import React, { useState, useEffect, useContext } from 'react'
import Select from "react-select";
import { colorLessStyle_Select, coloredStyle_Select } from '../Utility/CustomStylesForReact';
import DatePicker from "react-datepicker";
import classNames from 'classnames';
import useObjState from '../../CADHook/useObjState';
import { isEmpty, isEmptyObject } from '../../CADUtils/functions/common';
import { fetchPostData } from '../../Components/hooks/Api';
import { Comman_changeArrayVictim, threeColArray } from '../../Components/Common/ChangeArrayFormat';
import { useDispatch, useSelector } from 'react-redux';
import { AgencyContext } from '../../Context/Agency/Index';
import CaseManagementServices from '../../CADServices/APIs/caseManagement';
import { toastifyError, toastifySuccess } from '../../Components/Common/AlertMsg';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { base64ToString, changeArrayFormat, tableCustomStyles } from '../../Components/Common/Utility';
import DataTable from "react-data-table-component";
import { getDropDownReasonCase } from '../../redux/actions/DropDownsData';
import ListModal from '../../Components/Pages/Utility/ListManagementModel/ListModal';
import SelectBox from '../../Components/Common/SelectBox';
import { get_Report_Approve_Officer_Data } from '../../redux/actions/IncidentAction';

function CaseClosure(props) {
    const { CaseId } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
    const reasonCaseDrpData = useSelector((state) => state.DropDown.reasonCaseDrpData);
    const { datezone } = useContext(AgencyContext);
    const dispatch = useDispatch();
    const useRouterQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useRouterQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const [agencyID, setAgencyID] = useState(null);
    const [pinID, setPinID] = useState(null);
    // State for Case Disposition & Administrative Actions
    const [caseDisposition, setCaseDisposition] = useState(null);
    const [openPage, setOpenPage] = useState("");

    const [onHold, setOnHold] = useState(false);
    const [dispositionDate, setDispositionDate] = useState(null);
    const [dispositionSummary, setDispositionSummary] = useState(null);
    const [holdReason, setHoldReason] = useState(null);
    const [holdDate, setHoldDate] = useState(null);
    const [groupList, setGroupList] = useState([]);

    const [reExaminationRequired, setReExaminationRequired] = useState(false);
    const [incidentStatusDrpDwn, setIncidentStatusDrpDwn] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Individual");
    // State for Retention & Re-Examination Management
    const [reExaminationDate, setReExaminationDate] = useState(null);
    const [purgeDate, setPurgeDate] = useState(null);
    const [closureID, setClosureID] = useState(null);

    // State for Victim Notification Log
    const [victimNotifications, setVictimNotifications] = useState([]);
    const [notificationLogData, setNotificationLogData] = useState([]);

    const [errorState, setErrorState, handleErrorState, clearErrorState] = useObjState({
        caseDisposition: false,
        dispositionDate: false,
        dispositionSummary: false,
        holdReason: false,
        holdDate: false,
        reExaminationDate: false,
        purgeDate: false,
    });

    // State for Send Notification Modal
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationForm, setNotificationForm, handleNotificationFormChange, clearNotificationForm] = useObjState({
        victim: null,
        email: "",
        subject: "",
        body: ""
    });
    const [notificationErrorState, setNotificationErrorState, handleNotificationErrorState, clearNotificationErrorState] = useObjState({
        victim: false,
        email: false,
        subject: false,
        body: false
    });
    // State for Request Manual Purge Modal
    const [showPurgeModal, setShowPurgeModal] = useState(false);
    const [multiSelected, setMultiSelected] = useState({ optionSelected: null })

    const [purgeForm, setPurgeForm, handlePurgeFormChange, clearPurgeForm] = useObjState({
        reason: null,
        dateTime: null,
        requesterNote: "",
        officer: "",
        attachment: null,
        ManualPurgeId: null,
        Status: "",
        ApprovingSupervisorID: "",
        DocumentAccess_Name: ""
    });
    const [purgeErrorState, setPurgeErrorState, handlePurgeErrorState, clearPurgeErrorState] = useObjState({
        reason: false,
        dateTime: false,
        requesterNote: false
    });


    const getNotificationHistoryKey = `/CaseManagement/GetCaseNotificationHistory/${CaseId}`;
    const { data: getNotificationHistoryData, isSuccess: isGetNotificationHistorySuccess, refetch: refetchNotificationHistory } = useQuery(
        [getNotificationHistoryKey, {
            "CaseID": CaseId,
        },],
        CaseManagementServices.getCaseNotificationHistory,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!CaseId
        }
    );

    const getCaseClosureByIDKey = `/CaseManagement/GetCaseClosureByID/${CaseId}`;
    const { data: getCaseClosureByIDData, isSuccess: isGetCaseClosureByIDSuccess, refetch: refetchCaseClosureByID } = useQuery(
        [getCaseClosureByIDKey, {
            "CaseID": CaseId,
        },],
        CaseManagementServices.getCaseClosureByID,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!CaseId
        }
    );

    useEffect(() => {
        if (isGetCaseClosureByIDSuccess) {
            const data = JSON.parse(getCaseClosureByIDData?.data?.data)?.Table?.[0]
            setCaseDisposition(incidentStatusDrpDwn?.find(item => item?.value === data?.DispositionID));
            setOnHold(data?.IsOnHold);
            setDispositionDate(data?.DispositionDateTime ? new Date(data?.DispositionDateTime) : null);
            setDispositionSummary(data?.DIsposationSummary);
            setHoldReason(data?.HoldReason);
            setHoldDate(data?.HoldDate ? new Date(data?.HoldDate) : null);
            setReExaminationRequired(data?.IsReExaminationRequired);
            setReExaminationDate(data?.ReExaminationDate ? new Date(data?.ReExaminationDate) : null);
            setPurgeDate(data?.PurgeDate ? new Date(data?.PurgeDate) : null);
            setClosureID(data?.ID);
        } else {
            setCaseDisposition(null);
            setOnHold(false);
            setDispositionDate(null);
            setDispositionSummary(null);
            setHoldReason(null);
            setHoldDate(null);
            setReExaminationRequired(false);
            setReExaminationDate(null);
            setPurgeDate(null);
            setClosureID(null);
        }
    }, [isGetCaseClosureByIDSuccess, getCaseClosureByIDData, incidentStatusDrpDwn])

    const getManualPurgeByCaseIDKey = `/CaseManagement/GetManualPurgeByCaseID/${CaseId}`;
    const { data: getManualPurgeByCaseIDData, isSuccess: isGetManualPurgeByCaseIDSuccess, refetch: refetchManualPurgeByCaseID } = useQuery(
        [getManualPurgeByCaseIDKey, {
            "CaseID": CaseId,
        },],
        CaseManagementServices.getManualPurgeByCaseID, {
        refetchOnWindowFocus: false,
        retry: 0,
        enabled: !!CaseId
    }
    );

    useEffect(() => {
        if (isGetManualPurgeByCaseIDSuccess && getManualPurgeByCaseIDData) {
            const data = JSON.parse(getManualPurgeByCaseIDData?.data?.data)?.Table?.[0]
            setPurgeForm({
                ManualPurgeId: data?.ManualPurgeId,
                reason: reasonCaseDrpData?.find(item => item.ReasonID === data?.ReasonID),
                dateTime: data?.ManualDateTime ? new Date(data?.ManualDateTime) : null,
                requesterNote: data?.RequesterNote,
                officer: localStoreData?.fullName,
                attachment: data?.Attachment,
                Status: data?.Status
            })
        } else {
            clearPurgeForm();
        }
    }, [isGetManualPurgeByCaseIDSuccess, getManualPurgeByCaseIDData, showPurgeModal])

    const handleSendForApproval = async () => {

        const approverIDs = multiSelected?.optionSelected?.map(item => item.value).join(',') || '';
        const approverLabels = multiSelected?.optionSelected?.map(item => item.label).join(',') || '';

        const payload = {
            "ManualPurgeID": purgeForm?.ManualPurgeId,
            "CaseID": CaseId,
            "ManualDateTime": purgeForm?.dateTime,
            "ApprovingSupervisorType": selectedOption,
            "ApprovingSupervisorID": approverIDs,
            "ApprovingSupervisorName": approverLabels,
            "AgencyID": agencyID,
            "CreatedByUserFK": pinID
        }
        const response = await CaseManagementServices.addManualPurgeApprove(payload);
        if (response) {
            refetchManualPurgeByCaseID();
            handleClosePurgeModal();
            toastifySuccess("Request sent for approval successfully");
        } else {
            toastifyError("Failed to send request for approval");
        }
    }

    const handleSendNotification = () => {
        setShowNotificationModal(true);
    };

    const handleCloseNotificationModal = () => {
        setShowNotificationModal(false);
        clearNotificationErrorState();
        // Cleanup modal backdrop
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    };

    const validateEmail = (email) => {
        if (!email || email.trim() === "") {
            return { isValid: false, message: "Required" };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return { isValid: false, message: "Invalid email format" };
        }
        return { isValid: true, message: "" };
    };

    const validateNotificationForm = () => {
        let isError = false;
        const keys = Object.keys(notificationErrorState);
        keys.forEach((field) => {
            if (field === "victim") {
                if (isEmptyObject(notificationForm.victim)) {
                    handleNotificationErrorState("victim", true);
                    isError = true;
                } else {
                    handleNotificationErrorState("victim", false);
                }
            } else if (field === "email") {
                const emailValidation = validateEmail(notificationForm.email);
                if (!emailValidation.isValid) {
                    handleNotificationErrorState("email", true);
                    isError = true;
                } else {
                    handleNotificationErrorState("email", false);
                }
            } else if (field === "subject") {
                if (!notificationForm.subject || notificationForm.subject.trim() === "") {
                    handleNotificationErrorState("subject", true);
                    isError = true;
                } else {
                    handleNotificationErrorState("subject", false);
                }
            } else if (field === "body") {
                if (!notificationForm.body || notificationForm.body.trim() === "") {
                    handleNotificationErrorState("body", true);
                    isError = true;
                } else {
                    handleNotificationErrorState("body", false);
                }
            } else {
                handleNotificationErrorState(field, false);
            }
        });
        return !isError;
    };

    const handleSendNotificationSubmit = async () => {
        if (!validateNotificationForm()) return;
        const payload = {
            CaseID: CaseId,
            VictimID: notificationForm.victim.value,
            Email: notificationForm.email,
            Subject: notificationForm.subject,
            Body: notificationForm.body,
            AgencyID: agencyID,
            CreatedByUserFK: pinID
        }
        const response = await CaseManagementServices.addCaseNotification(payload);
        if (response) {
            toastifySuccess("Notification sent successfully");
        } else {
            toastifyError("Failed to send notification");
        }
        clearNotificationForm();
        clearNotificationErrorState();
        handleCloseNotificationModal();
    };

    useEffect(() => {
        if (localStoreData?.AgencyID) {
            getIncidentStatus(localStoreData?.AgencyID);
            setAgencyID(localStoreData?.AgencyID);
            setPinID(localStoreData?.PINID);
            handlePurgeFormChange('officer', localStoreData?.fullName);
            if (reasonCaseDrpData?.length === 0) dispatch(getDropDownReasonCase(localStoreData?.AgencyID))
            get_Group_List(localStoreData?.AgencyID, localStoreData?.PINID);
            if (reportApproveOfficer?.length === 0) dispatch(get_Report_Approve_Officer_Data(localStoreData?.AgencyID, localStoreData?.PINID));
        }
        const defaultDate = datezone ? new Date(datezone) : null;
        setDispositionDate(defaultDate);
    }, [localStoreData, datezone, showPurgeModal]);

    const get_Group_List = (loginAgencyID, loginPinID,) => {
        const value = { AgencyId: loginAgencyID, PINID: loginPinID, }
        fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'))
            }
            else {
                setGroupList();
            }
        })
    }

    const getIncidentStatus = async (AgencyID) => {
        try {
            await fetchPostData("IncidentStatus/GetDataDropDown_IncidentStatus", { 'AgencyID': AgencyID }).then((res) => {

                if (res?.length > 0) {
                    setIncidentStatusDrpDwn(threeColArray(res, "IncidentStatusID", "Description", "IncidentStatusCode"));
                } else {
                    setIncidentStatusDrpDwn([]);
                }
            })
        } catch (error) {
            console.error("Error in getIncidentStatus: ", error);
            setIncidentStatusDrpDwn([]);
        }
    };

    const get_Data_Victim_Drp = (IncID) => {
        fetchPostData('Victim/GetData_InsertVictimName', { 'IncidentID': IncID, }).then((data) => {
            if (data) {
                setVictimNotifications(Comman_changeArrayVictim(data, 'NameID', 'VictimID', 'Name',))
            } else {
                setVictimNotifications([])
            }
        })
    }

    useEffect(() => {
        if (IncID) {
            get_Data_Victim_Drp(IncID);
        }
    }, [IncID])

    // Cleanup effect when modals close
    useEffect(() => {
        if (!showNotificationModal && !showPurgeModal) {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
        }
    }, [showNotificationModal, showPurgeModal]);

    const handleRequestManualPurge = () => {
        setShowPurgeModal(true);
    };

    const handleClosePurgeModal = () => {
        setShowPurgeModal(false);
        clearPurgeErrorState();
        setMultiSelected({ optionSelected: null });
        clearPurgeForm();
        handlePurgeFormChange('officer', localStoreData?.fullName);
        // Cleanup modal backdrop
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    };

    const validatePurgeForm = () => {
        let isError = false;
        const keys = Object.keys(purgeErrorState);
        keys.forEach((field) => {
            if (field === "reason") {
                if (isEmptyObject(purgeForm.reason)) {
                    handlePurgeErrorState("reason", true);
                    isError = true;
                } else {
                    handlePurgeErrorState("reason", false);
                }
            } else if (field === "dateTime") {
                if (!purgeForm.dateTime) {
                    handlePurgeErrorState("dateTime", true);
                    isError = true;
                } else {
                    handlePurgeErrorState("dateTime", false);
                }
            } else if (field === "requesterNote") {
                if (!purgeForm.requesterNote || purgeForm.requesterNote.trim() === "") {
                    handlePurgeErrorState("requesterNote", true);
                    isError = true;
                } else {
                    handlePurgeErrorState("requesterNote", false);
                }
            } else {
                handlePurgeErrorState(field, false);
            }
        });
        return !isError;
    };

    const handleSavePurge = async () => {
        if (!validatePurgeForm()) return;
        const isUpdate = purgeForm?.ManualPurgeId ? true : false;
        const payload = {
            "ManualPurgeId": isUpdate ? purgeForm?.ManualPurgeId : undefined,
            "AgencyID": agencyID,
            "ReasonID": purgeForm.reason?.ReasonID,
            "ManualDateTime": purgeForm?.dateTime,
            "RequesterNote": purgeForm?.requesterNote,
            "OfficerID": pinID,
            "CaseID": CaseId,
            "CreatedByUserFK": isUpdate ? undefined : pinID,
            "ModifiedByUserFK": isUpdate ? pinID : undefined,
            "Status": isUpdate ? "Draft" : ""
        }
        const response = isUpdate ? await CaseManagementServices.updateManualPurge(payload) : await CaseManagementServices.addManualPurge(payload);
        if (response) {
            toastifySuccess(isUpdate ? "Purge request updated successfully" : "Purge request saved successfully");
            refetchManualPurgeByCaseID();
        } else {
            toastifyError("Failed to save purge request");
        }
        clearPurgeForm();
        clearPurgeErrorState();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handlePurgeFormChange('attachment', file);
        }
    };

    const handleClear = () => {
        alert("Clear clicked");
    };

    const validation = () => {
        let isError = false;
        const keys = Object.keys(errorState);
        keys.forEach((field) => {
            if (field === "caseDisposition") {
                if (!onHold && isEmptyObject(caseDisposition)) {
                    handleErrorState("caseDisposition", true);
                    isError = true;
                } else {
                    handleErrorState("caseDisposition", false);
                }
            } else if (field === "dispositionDate") {
                if (!onHold && !dispositionDate) {
                    handleErrorState("dispositionDate", true);
                    isError = true;
                } else {
                    handleErrorState("dispositionDate", false);
                }
            } else if (field === "holdReason") {
                if (onHold && !holdReason) {
                    handleErrorState("holdReason", true);
                    isError = true;
                } else {
                    handleErrorState("holdReason", false);
                }
            } else if (field === "holdDate") {
                if (onHold && !holdDate) {
                    handleErrorState("holdDate", true);
                    isError = true;
                } else {
                    handleErrorState("holdDate", false);
                }
            } else if (field === "purgeDate") {
                if (!onHold && !purgeDate) {
                    handleErrorState("purgeDate", true);
                    isError = true;
                } else {
                    handleErrorState("purgeDate", false);
                }
            } else {
                handleErrorState(field, false);
            }
        });
        return !isError;
    };

    const handleSave = async () => {
        if (!validation()) return;
        const isUpdate = closureID ? true : false;
        const payload = {
            "ID": isUpdate ? closureID : undefined,
            "AgencyID": agencyID,
            "CreatedByUserFK": isUpdate ? undefined : pinID,
            "ModifiedByUserFK": isUpdate ? pinID : undefined,
            "CaseID": CaseId,
            "DispositionID": caseDisposition?.value,
            "DispositionDateTime": dispositionDate,
            "DisposationSummary": dispositionSummary,
            "HoldReason": holdReason,
            "HoldDate": holdDate,
            "ReExaminationDate": reExaminationDate,
            "PurgeDate": purgeDate,
            "IsOnHold": onHold,
            "IsReExaminationRequired": reExaminationRequired

        }
        const res = await CaseManagementServices.addCaseClosure(payload);
        if (res?.status === 200) {
            toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
            refetchCaseClosureByID();
        }
    };

    const colourStylesUsers = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: isDisabled ? '#9d949436' : '#FFE2A8',
            fontSize: 14,
            marginTop: 2,
            boxShadow: 'none',
            cursor: isDisabled ? 'not-allowed' : 'default',
        }),
    };

    const Agencychange = (multiSelected) => {
        // setStatesChangeStatus(true)
        setMultiSelected({ optionSelected: multiSelected });
        const id = []
        const name = []
        if (multiSelected) {
            multiSelected.map((item, i) => { id.push(item.value); name.push(item.label) })
            setPurgeForm({ ...purgeForm, ['ApprovingSupervisorID']: id.toString(), ['DocumentAccess_Name']: name.toString() })
        }
    }

    return (
        <>
            <div className="">
                {/* Closure Checklist Section */}
                <div className="border border-dark rounded p-3 mb-3">
                    <h6 className="fw-bold mb-3">Closure Checklist</h6>
                    <div className="row">
                        <div className="col-md-12 mb-2">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <span className="col-5">Evidence Disposition Complete</span>
                                <span className="badge bg-danger me-2">Pass</span>
                                <small className="text-muted">All Evidence Items Disposed</small>
                            </div>
                        </div>
                        <div className="col-md-12 mb-2">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <span className="col-5">All Reports Approved</span>
                                <span className="badge bg-success me-2">Fail</span>
                                <small className="text-muted">3 Reports Needs Approval</small>
                            </div>
                        </div>
                        <div className="col-md-12 mb-2">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <span className="col-5">All Tasks Completed</span>
                                <span className="badge bg-success me-2">Fail</span>
                                <small className="text-muted">2 Running Tasks</small>
                            </div>
                        </div>
                        <div className="col-md-12 mb-2">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <span className="col-5">Required Case Team Assigned</span>
                                <span className="badge bg-danger me-2">Pass</span>
                                <small className="text-muted">Assigned</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Case Disposition & Administrative Actions Section */}
                <fieldset className='mt-1'>
                    <legend>Case Disposition & Administrative Actions</legend>
                    <div className="row mt-2 mb-3">
                        <div className="col-md-4 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="form-label text-nowrap" style={{ marginLeft: '30px' }}>
                                <div className="fw-bold">Case Disposition</div> {errorState.caseDisposition && !onHold && isEmptyObject(caseDisposition) ? <span style={{ color: 'red' }}>Required</span> : ''}
                            </label>
                            <Select
                                isClearable
                                options={incidentStatusDrpDwn}
                                placeholder="Select"
                                className="w-100"
                                isDisabled={onHold}
                                styles={onHold ? colorLessStyle_Select : coloredStyle_Select}
                                value={caseDisposition}
                                onChange={(e) => setCaseDisposition(e)}
                            />
                        </div>
                        <div className="col-md-2 d-flex align-items-center" style={{ gap: '10px' }}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="onHold"
                                    checked={onHold}
                                    onChange={(e) => setOnHold(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="onHold">
                                    On Hold
                                </label>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="form-label text-nowrap">
                                <div className="fw-bold">Disposition Date</div> {errorState.dispositionDate && !onHold && !dispositionDate ? <span style={{ color: 'red' }}>Required</span> : ''}
                            </label>
                            <DatePicker
                                selected={dispositionDate}
                                onChange={(date) => setDispositionDate(date)}
                                dateFormat="MM/dd/yyyy"
                                disabled={onHold}
                                placeholderText="Select"
                                className={classNames("form-control", { "requiredColor": !onHold })}
                            />
                        </div>
                    </div>

                    <div className="mb-3 d-flex" style={{ gap: '10px' }}>
                        <label className="form-label text-nowrap">Disposition Summary</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            disabled={onHold}
                            value={dispositionSummary}
                            onChange={(e) => setDispositionSummary(e.target.value)}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-7 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="form-label text-nowrap" style={{ marginLeft: '57px' }}>
                                <div className="fw-bold">Hold Reason</div>
                                {errorState.holdReason && onHold && !holdReason ? <span style={{ color: 'red' }}>Required</span> : ''}
                            </label>
                            <input
                                type="text"
                                value={holdReason}
                                disabled={!onHold}
                                className={classNames("form-control", { "requiredColor": onHold })}
                                onChange={(e) => setHoldReason(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="form-label text-nowrap">
                                <div className="fw-bold">Hold Date</div> {errorState.holdDate && onHold && !holdDate ? <span style={{ color: 'red' }}>Required</span> : ''}
                            </label>
                            <DatePicker
                                selected={holdDate}
                                onChange={(date) => setHoldDate(date)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Select"
                                disabled={!onHold}
                                isClearable
                                className={classNames("form-control", { "requiredColor": onHold })}
                            />
                        </div>
                        <div className="col-md-2 d-flex align-items-center" style={{ gap: '10px' }}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="reExaminationRequired"
                                    checked={reExaminationRequired}
                                    onChange={(e) => setReExaminationRequired(e.target.checked)}
                                    disabled={!onHold}
                                />
                                <label className="form-check-label" htmlFor="reExaminationRequired">
                                    Re-Examination Required?
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Victim Notification Log Section */}

                <fieldset className='my-1'>
                    <legend>Victim Notification Log</legend>
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-sm btn-success mt-2 "
                            onClick={handleSendNotification}
                        >
                            Send Notification
                        </button>
                    </div>


                    <div className="table-responsive">
                        <DataTable
                            dense
                            columns={[
                                {
                                    name: "Victim",
                                    selector: (row) => row.victim || row.Victim || "",
                                    sortable: true,
                                },
                                {
                                    name: "Date Notified",
                                    selector: (row) => row.dateNotified || row.DateNotified || "",
                                    sortable: true,
                                },
                                {
                                    name: "Notified By",
                                    selector: (row) => row.notifiedBy || row.NotifiedBy || "",
                                    sortable: true,
                                }
                            ]}
                            data={notificationLogData}
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
                </fieldset>
                {/* Retention & Re-Examination Management Section */}

                <fieldset className='my-1'>
                    <legend>Retention & Re-Examination Management</legend>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="col-md-5 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="form-label text-nowrap">Re-Examination Date</label>
                            <DatePicker
                                selected={reExaminationDate}
                                onChange={(date) => setReExaminationDate(date)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="Select"
                                className="form-control"
                                isClearable
                                disabled={!reExaminationRequired}
                            />
                        </div>
                        <div className="col-md-5 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="form-label text-nowrap">
                                <div className="fw-bold">Purge Date</div> {errorState.purgeDate && !onHold && !purgeDate ? <span style={{ color: 'red' }}>Required</span> : ''}
                            </label>
                            <DatePicker
                                selected={purgeDate}
                                onChange={(date) => setPurgeDate(date)}
                                dateFormat="MM/dd/yyyy"
                                disabled={onHold}
                                placeholderText="Select"
                                isClearable
                                className={classNames("form-control", { "requiredColor": !onHold })}
                            />
                        </div>
                        <button
                            className="btn btn-sm btn-success"
                            onClick={handleRequestManualPurge}
                        >
                            Request Manual Purge
                        </button>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="col-md-5 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="form-label text-nowrap">
                                <div className="fw-bold">Status</div>
                            </label>
                            <div
                                id="NIBRSStatus"
                                className={
                                    purgeForm.Status === "Draft"
                                        ? "nibrs-draft-Nar"
                                        : purgeForm.Status === "Approved"
                                            ? "nibrs-submitted-Nar"
                                            : purgeForm.Status === "Rejected"
                                                ? "nibrs-rejected-Nar"
                                                : purgeForm.Status === "Pending Review"
                                                    ? "nibrs-reopened-Nar"
                                                    : ""
                                }
                                style={{
                                    color: "black",
                                    opacity: 1,
                                    fontSize: "14px",
                                    boxShadow: "none",
                                    userSelect: "none",
                                }}
                            >
                                {purgeForm.Status}
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Finalization Workflow Section */}
                <fieldset className='my-1'>
                    <legend>Finalization Workflow</legend>

                    {/* Workflow Status Indicators */}
                    <div className="mt-3 mb-3">
                        <div className="d-flex rounded" style={{ backgroundColor: '#e3f2fd' }}>
                            <div className="col-3 d-flex align-items-center pl-3 p-3 rounded-start" style={{ gap: '10px', backgroundColor: true ? '#001F3F' : '#e3f2fd', color: true ? 'white' : '#001F3F' }}>
                                {true ?
                                    <i className="fa fa-check-circle-o" aria-hidden="true" style={{ fontSize: '20px' }}></i> :
                                    <i className="fa fa-circle-o" aria-hidden="true" style={{ fontSize: '20px' }}></i>
                                }
                                <label htmlFor="readyToClose" className="form-check-label">Ready to Close</label>
                            </div>
                            <div className="col-3 d-flex align-items-center  p-3" style={{ gap: '10px', backgroundColor: purgeForm.Status === "Pending Review" ? '#001F3F' : '#e3f2fd', color: purgeForm.Status === "Pending Review" ? 'white' : '#001F3F' }}>
                                {purgeForm.Status === "Pending Review" ? <i className="fa fa-check-circle-o" aria-hidden="true" style={{ fontSize: '20px' }}></i> : <i className="fa fa-circle-o" aria-hidden="true" style={{ fontSize: '20px' }}></i>}
                                <label htmlFor="underReview" className="form-check-label">Under Review</label>
                            </div>
                            <div className="col-3 d-flex align-items-center  p-3" style={{ gap: '10px', backgroundColor: purgeForm.Status === "Approved " ? '#001F3F' : '#e3f2fd', color: purgeForm.Status === "Approved" ? 'white' : '#001F3F' }}>
                                {purgeForm.Status === "Approved" ? <i className="fa fa-check-circle-o" aria-hidden="true" style={{ fontSize: '20px' }}></i> : <i className="fa fa-circle-o" aria-hidden="true" style={{ fontSize: '20px' }}></i>}
                                <label htmlFor="approved" className="form-check-label">Approved</label>
                            </div>
                            <div className="col-3 d-flex align-items-center  p-3" style={{ gap: '10px', backgroundColor: purgeForm.Status === "Closed Archived" ? '#001F3F' : '#e3f2fd', color: purgeForm.Status === "Closed Archived" ? 'white' : '#001F3F' }}>
                                {purgeForm.Status === "Closed Archived" ? <i className="fa fa-check-circle-o" aria-hidden="true" style={{ fontSize: '20px' }}></i> : <i className="fa fa-circle-o" aria-hidden="true" style={{ fontSize: '20px' }}></i>}
                                <label htmlFor="closedArchived" className="form-check-label">Closed Archived</label>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end mt-3" style={{ gap: '10px' }}>
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => alert("Submit for Closure Review")}
                        >
                            Submit for Closure Review
                        </button>
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => alert("Finalize & Archive")}
                        >
                            Finalize & Archive
                        </button>
                    </div>
                    <div className="d-flex justify-content-end mt-2" style={{ gap: '10px' }}>
                        <button
                            className="btn btn-sm btn-success"
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-sm btn-success"
                            onClick={handleSave}
                            disabled={purgeForm.Status && purgeForm.Status !== "Draft"}
                        >
                            {closureID ? "Update" : "Save"}
                        </button>
                    </div>
                </fieldset>

                {/* Send Notification to Victim Modal */}
                {showNotificationModal && (
                    <div
                        className="modal fade show"
                        style={{ display: 'block', background: "rgba(0,0,0, 0.5)", zIndex: "9999" }}
                        id="SendNotificationModal"
                        tabIndex="-1"
                        aria-labelledby="sendNotificationModalLabel"
                        aria-hidden="false"
                        onClick={(e) => {
                            if (e.target.id === 'SendNotificationModal') {
                                handleCloseNotificationModal();
                            }
                        }}
                    >
                        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "800px" }}>
                            <div className="modal-content" style={{ borderRadius: "8px" }}>
                                <div className="modal-header" style={{ borderBottom: "1px solid #dee2e6" }}>
                                    <h5 className="modal-title fw-bold" id="sendNotificationModalLabel">
                                        Send Notification to Victim
                                    </h5>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="row mb-3">
                                        <div className="col-md-6 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="form-label ml-2">
                                                <div className="fw-bold">Victim</div> {notificationErrorState.victim && isEmptyObject(notificationForm.victim) ? <span style={{ color: 'red' }}>Required</span> : ''}
                                            </label>
                                            <Select
                                                isClearable
                                                options={victimNotifications}
                                                placeholder="Select"
                                                className="w-100"
                                                styles={coloredStyle_Select}
                                                value={notificationForm.victim}
                                                onChange={(e) => handleNotificationFormChange('victim', e)}
                                            />
                                        </div>
                                        <div className="col-md-6 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="form-label">
                                                <div className="fw-bold">Email</div>
                                                {notificationErrorState.email && (
                                                    <span style={{ color: 'red' }}>
                                                        {validateEmail(notificationForm.email).message}
                                                    </span>
                                                )}
                                            </label>
                                            <input
                                                type="email"
                                                className="form-control requiredColor"
                                                placeholder="Placeholder"
                                                value={notificationForm.email}
                                                onChange={(e) => handleNotificationFormChange('email', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                        <label className="form-label">
                                            <div className="fw-bold">Subject</div> {notificationErrorState.subject && (!notificationForm.subject || notificationForm.subject.trim() === "") ? <span style={{ color: 'red' }}>Required</span> : ''}
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control requiredColor"
                                            placeholder="Placeholder"
                                            value={notificationForm.subject}
                                            onChange={(e) => handleNotificationFormChange('subject', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                        <label className="form-label ml-3">
                                            <div className="fw-bold">Body</div> {notificationErrorState.body && (!notificationForm.body || notificationForm.body.trim() === "") ? <span style={{ color: 'red' }}>Required</span> : ''}
                                        </label>
                                        <textarea
                                            className="form-control requiredColor"
                                            rows="4"
                                            placeholder="Placeholder"
                                            value={notificationForm.body}
                                            onChange={(e) => handleNotificationFormChange('body', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer" style={{ borderTop: "1px solid #dee2e6" }}>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={handleCloseNotificationModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={() => {
                                            clearNotificationForm();
                                            clearNotificationErrorState();
                                        }}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={handleSendNotificationSubmit}
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Request Manual Purge Modal */}
                {showPurgeModal && (
                    <>
                        <div
                            className="modal fade show"
                            style={{ display: 'block', background: "rgba(0,0,0, 0.5)", zIndex: "9999" }}
                            id="RequestManualPurgeModal"
                            tabIndex="-1"
                            aria-labelledby="requestManualPurgeModalLabel"
                            aria-hidden="false"
                            onClick={(e) => {
                                if (e.target.id === 'RequestManualPurgeModal') {
                                    handleClosePurgeModal();
                                }
                            }}
                        >
                            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "800px" }}>
                                <div className="modal-content" style={{ borderRadius: "8px" }}>
                                    <div className="modal-header" style={{ borderBottom: "1px solid #dee2e6" }}>
                                        <h5 className="modal-title fw-bold d-flex justify-content-between align-items-center" id="requestManualPurgeModalLabel">
                                            Request Manual Purge
                                        </h5>
                                        <h6 className="modal-title fw-bold">{purgeForm.Status}</h6>
                                    </div>
                                    <div className="modal-body p-4">
                                        <div className="row mb-3">
                                            <div className="col-md-6 d-flex align-items-center" style={{ gap: '10px' }}>
                                                <label className="form-label">
                                                    <span className="fw-bold new-link px-0"
                                                        data-toggle="modal" data-target="#ListModel"
                                                        onClick={() => { setOpenPage("Reason"); }}
                                                    >Reason</span>
                                                    {purgeErrorState.reason && isEmptyObject(purgeForm.reason) ? <span style={{ color: 'red' }}>Required</span> : ''}
                                                </label>
                                                <Select
                                                    isClearable
                                                    options={reasonCaseDrpData}
                                                    placeholder="Select"
                                                    className="w-100"
                                                    styles={coloredStyle_Select}
                                                    getOptionLabel={(v) => `${v?.ReasonCode} | ${v?.Description}`}
                                                    getOptionValue={(v) => v?.ReasonCode}
                                                    formatOptionLabel={(option, { context }) => {
                                                        return context === 'menu'
                                                            ? `${option?.ReasonCode} | ${option?.Description}`
                                                            : option?.ReasonCode;
                                                    }}
                                                    value={purgeForm.reason}
                                                    onChange={(e) => handlePurgeFormChange('reason', e)}
                                                />
                                            </div>
                                            <div className="col-md-6 d-flex align-items-center" style={{ gap: '10px' }}>
                                                <label className="form-label">
                                                    <div className="fw-bold">Date/Time</div> {purgeErrorState.dateTime && !purgeForm.dateTime ? <span style={{ color: 'red' }}>Required</span> : ''}
                                                </label>
                                                <DatePicker
                                                    selected={purgeForm.dateTime}
                                                    onChange={(date) => handlePurgeFormChange('dateTime', date)}
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeFormat="HH:mm"
                                                    timeCaption="Time"
                                                    placeholderText="Select"
                                                    className="form-control w-100 requiredColor"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="form-label">
                                                <div className="fw-bold">Requester Note</div> {purgeErrorState.requesterNote && (!purgeForm.requesterNote || purgeForm.requesterNote.trim() === "") ? <span style={{ color: 'red' }}>Required</span> : ''}
                                            </label>
                                            <textarea
                                                className="form-control requiredColor"
                                                rows="4"
                                                placeholder="Placeholder"
                                                value={purgeForm.requesterNote}
                                                onChange={(e) => handlePurgeFormChange('requesterNote', e.target.value)}
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6 d-flex align-items-center" style={{ gap: '10px' }}>
                                                <label className="form-label">Officer</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Auto select login officer"
                                                    value={purgeForm.officer}
                                                    onChange={(e) => handlePurgeFormChange('officer', e.target.value)}
                                                    readOnly
                                                    style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                                />
                                            </div>
                                            <div className="col-md-6 d-flex align-items-center" style={{ gap: '10px' }}>
                                                <label className="form-label">Attachment</label>
                                                <div className="d-flex align-items-center w-100" style={{ gap: '10px' }}>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={purgeForm.attachment ? purgeForm.attachment.name : "No file chosen"}
                                                        readOnly
                                                        style={{ backgroundColor: '#e9ecef' }}
                                                    />
                                                    <label className="btn btn-sm text-white mb-0" style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                        Choose File
                                                        <input
                                                            type="file"
                                                            style={{ display: 'none' }}
                                                            onChange={handleFileChange}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        {purgeForm.Status === "Draft" && (
                                            <>
                                                <div className='d-flex align-items-center' style={{ gap: '10px' }}>
                                                    <div className="form-check ml-2">
                                                        <input
                                                            type="radio"
                                                            id="Individual"
                                                            name="approverType"
                                                            value="Individual"
                                                            className="form-check-input"
                                                            checked={selectedOption === "Individual"}
                                                            onChange={(e) => setSelectedOption(e.target.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor="Individual">
                                                            Individual
                                                        </label>
                                                    </div>
                                                    <div className="form-check ml-2">
                                                        <input
                                                            type="radio"
                                                            id="Group"
                                                            name="approverType"
                                                            value="Group"
                                                            className="form-check-input"
                                                            checked={selectedOption === "Group"}
                                                            onChange={(e) => setSelectedOption(e.target.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor="Group">
                                                            Group
                                                        </label>
                                                    </div>
                                                </div>
                                                {selectedOption === "Individual" ? (
                                                    <>
                                                        <div className="col-10 col-lg-7 dropdown__box d-flex align-items-center ">
                                                            <span htmlFor="" className='label-name '
                                                                style={{ marginRight: '10px', flexGrow: 1, whiteSpace: 'nowrap', fontSize: '13px' }}
                                                            >
                                                                Report Approver
                                                                {/* {errors.ApprovingOfficerError !== 'true' ? (
                                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovingOfficerError}</p>
                                                            ) : null} */}
                                                            </span>
                                                            <SelectBox
                                                                className="custom-multiselect w-100"
                                                                classNamePrefix="custom"
                                                                options={reportApproveOfficer}
                                                                isMulti
                                                                styles={colourStylesUsers}
                                                                closeMenuOnSelect={false}
                                                                hideSelectedOptions={true}
                                                                onChange={Agencychange}
                                                                allowSelectAll={reportApproveOfficer.length > 0 ? true : false}
                                                                value={multiSelected.optionSelected}
                                                            />

                                                        </div>

                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="col-10 col-lg-7 dropdown__box d-flex align-items-center ">
                                                            <span htmlFor="" className='label-name'
                                                                style={{ marginRight: '10px', flexGrow: 1, whiteSpace: 'nowrap', fontSize: '13px' }}>  Approval Group
                                                                {/* {errors.ApprovingOfficerError !== 'true' ? (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ApprovingOfficerError}
                                                                </p>
                                                            ) : null} */}
                                                            </span>
                                                            <SelectBox
                                                                className="custom-multiselect w-100"
                                                                classNamePrefix="custom"
                                                                options={groupList}
                                                                isMulti
                                                                styles={colourStylesUsers}
                                                                closeMenuOnSelect={false}
                                                                hideSelectedOptions={true}
                                                                onChange={Agencychange}
                                                                allowSelectAll={true}
                                                                value={multiSelected.optionSelected}
                                                            />
                                                        </div>

                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="modal-footer" style={{ borderTop: "1px solid #dee2e6" }}>
                                        {purgeForm.Status === "Draft" && <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            onClick={handleSendForApproval}
                                        >
                                            Send For Approval
                                        </button>}
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            onClick={handleClosePurgeModal}
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            onClick={() => {
                                                clearPurgeErrorState(); clearPurgeForm();
                                                handlePurgeFormChange('officer', localStoreData?.fullName);
                                                setMultiSelected({ optionSelected: null });
                                            }}
                                        >
                                            Clear
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            onClick={handleSavePurge}
                                        >
                                            {purgeForm?.ManualPurgeId ? 'Update' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ListModal {...{ openPage, setOpenPage }} />
                    </>
                )}
            </div>

        </>
    )
}

export default CaseClosure