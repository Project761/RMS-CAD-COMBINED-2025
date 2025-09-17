import React, { useEffect, useState } from 'react'
import Select from "react-select";
import useObjState from '../../CADHook/useObjState';
import { coloredStyle_Select, colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, tableCustomStyles } from '../../Components/Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../Components/hooks/Api';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../redux/actions/Agency';
import { toastifySuccess } from '../../Components/Common/AlertMsg';
import { RequiredFieldIncident } from '../../Components/Pages/Utility/Personnel/Validation';

function ReportWorkflow() {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [loginAgencyID, setLoginAgencyID] = useState('')
    const [loginPinID, setLoginPinID] = useState('');
    const [ReportWorkflowData, setReportWorkflowData] = useState('');
    const [status, setStatus] = useState(false);
    const [clickedRow, setClickedRow] = useState(null);
    const [reportWorkFlowID, setReportWorkFlowID] = useState('');
    const [editval, setEditval] = useState();

    const [isChange, setIsChange] = React.useState(false);

    const [reportWorkflowState, setReportWorkflowState, handleReportWorkflowState, clearReportWorkflowState,
    ] = useObjState({
        workflowName: "", appliesToReport: "", FOIA: false, note: "", reportApproverType: "multipleLevel", reportApprover: "", approvalsRequired: "", reportReviewer: "", reportWritingTimeLimit: "", reportWritingTimeUnit: "hours",
        timeUnit: "hours", skipIfApproverIsAuthor: false, notificationAuthor: false, notifyUponExpiration: false, notificationSupervisor: false, warningBeforeTime: "", warningBeforeTimeCheck: false, warningTimeUnit: "hours",
        warningBeforeTime2: "", warningBeforeTimeUnit2: "hours", warningBeforeTimeCheck2: false, reportApprovalTimeLimit: "", reportApprovalTimeUnit: "hours"
    })

    const [errors, setErrors] = useState({
        'ParentContactDtTmErrors': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID); setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);


    const handleSpecialKeyDown = (e) => {
        const isAlphanumeric = e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/);
        const controlKeys = ["Backspace", "Delete", "Tab", "Enter", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
        ];

        if (!isAlphanumeric && !controlKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    const appliesToReportDrpData = [
        { Code: 1, Description: "Initial Report" },
        { Code: 2, Description: "Press Release" },
        { Code: 3, Description: "Public Narrative" },
        { Code: 4, Description: "Supplementary Narrative" },
        { Code: 5, Description: "Use of Force" },
    ];

    const timeUnitOptions = [
        { value: "hours", label: "Hours" },
        { value: "days", label: "Days" }
    ];

    const approverOptions = [
        { value: "1", label: "Supervisor" },
        { value: "2", label: "Manager" },
        { value: "3", label: "Administrator" }
    ];

    const reviewerOptions = [
        { value: "1", label: "Senior Officer" },
        { value: "2", label: "Quality Assurance" },
        { value: "3", label: "Legal Review" }
    ];
    const groupLevelColumns = [
        {
            name: "Group Name",
            selector: (row) => row.groupName,
            sortable: true
        },
        {
            name: "Group Level",
            selector: (row) => row.groupLevel,
            sortable: true,
            width: "150px"
        }
    ]
    const groupLevelData = [
        { groupName: "Group 1", groupLevel: "Level 1" },
        { groupName: "Group 2", groupLevel: "Level 2" },
        { groupName: "Group 3", groupLevel: "Level 3" }
    ]


    const data = [
        {
            workflowName: "Initial Report",
            appliesToReportType: "Initial Report",
            reviewer: "None",
            reportApprover: "Multiple Level",
            reportWritingTimeLimit: "12 Hours",
            reportApprovalTimeLimit: "48 Hours",
        },
        {
            workflowName: "Press Release",
            appliesToReportType: "Press Release",
            reviewer: "Records",
            reportApprover: "Single Level",
            reportWritingTimeLimit: "4 Hours",
            reportApprovalTimeLimit: "48 Hours",
        },
        {
            workflowName: "Public Narrative",
            appliesToReportType: "Public Narrative",
            reviewer: "Detectives",
            reportApprover: "Multiple Level",
            reportWritingTimeLimit: "24 Hours",
            reportApprovalTimeLimit: "12 Hours",
        },
        {
            workflowName: "Supplementary Narrative",
            appliesToReportType: "Supplementary Narrative",
            reviewer: "Records",
            reportApprover: "Self Approval",
            reportWritingTimeLimit: "48 Hours",
            reportApprovalTimeLimit: "48 Hours",
        },
        {
            workflowName: "Use of Force",
            appliesToReportType: "Use of Force",
            reviewer: "Detectives",
            reportApprover: "Multiple Level",
            reportWritingTimeLimit: "4 Hours",
            reportApprovalTimeLimit: "12 Hours",
        },
    ];

    useEffect(() => {
        if (loginAgencyID) {
            get_Data_ReportWorkflow(loginAgencyID)
        }
    }, [loginAgencyID])

    const get_Data_ReportWorkflow = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID, }
        fetchPostData('ReportWorkFlow/GetData_ReportWorkFlow', val).then((res) => {
            if (res) { setReportWorkflowData(res); }
            else { setReportWorkflowData(); }
        })
    }

    const GetSingleData = (ReportWorkFlowID) => {
        const val = { 'ReportWorkFlowID': ReportWorkFlowID, }
        fetchPostData('ReportWorkFlow/GetSingleData_ReportWorkFlow', val)
            .then((res) => {
                if (res) { setEditval(res); }
                else { setEditval([]) }
            })
    }
    useEffect(() => {
        if (status) {
            console.log(editval[0]?.WorkflowName)
            setReportWorkflowState({
                ...reportWorkflowState,
                'WorkflowName': editval[0]?.WorkflowName,
                'ModifiedByUserFK': loginPinID,
            })
        }
    }, [editval])


    const reset = () => {
        setReportWorkflowState({
            ...reportWorkflowState,
            workflowName: "", appliesToReport: "", FOIA: false, note: "", reportApproverType: "multipleLevel", reportApprover: "", approvalsRequired: "", reportReviewer: "", reportWritingTimeLimit: "", reportWritingTimeUnit: "hours",
            timeUnit: "hours", skipIfApproverIsAuthor: false, notificationAuthor: false, notifyUponExpiration: false, notificationSupervisor: false, warningBeforeTime: "", warningBeforeTimeCheck: false, warningTimeUnit: "hours",
            warningBeforeTime2: "", warningBeforeTimeUnit2: "hours", warningBeforeTimeCheck2: false, reportApprovalTimeLimit: "", reportApprovalTimeUnit: "hours"
        }); setErrors({ ...errors, 'ParentContactDtTmErrors': '', }); setStatus(false); setClickedRow(null)
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(reportWorkflowState.workflowName)) {
            setErrors(prevValues => { return { ...prevValues, ['ParentContactDtTmErrors']: RequiredFieldIncident(reportWorkflowState.workflowName) } })
        }
        // if (RequiredFieldIncident(value.ContactByID)) {
        //     setErrors(prevValues => { return { ...prevValues, ['ContactByIDErrors']: RequiredFieldIncident(value.ContactByID) } })
        // }
    }
    const { ParentContactDtTmErrors, } = errors

    useEffect(() => {
        if (ParentContactDtTmErrors === 'true') {
            if (status) { update_Juvenile() }
            else { Add_Type() }
        }
    }, [ParentContactDtTmErrors,])


    const Add_Type = () => {
        const payload = {
            AgencyID: loginAgencyID,
            WorkflowName: reportWorkflowState.workflowName,
            AppliesReportTypeID: reportWorkflowState.AppliesReportTypeID,
            Notes: reportWorkflowState.note,
            ReportApproverGroupID: reportWorkflowState.ReportApproverGroupID,
            ReportApproverRequired: reportWorkflowState.approvalsRequired,
            ReportReviewerGroupID: reportWorkflowState.ReportReviewerGroupID,
            IsMultipleLevel: reportWorkflowState.reportApproverType === "multipleLevel",
            IsSingleLevel: reportWorkflowState.reportApproverType === "singleLevel",
            IsNoApproval: reportWorkflowState.reportApproverType === "noApproval",
            IsSelfApproved: reportWorkflowState.reportApproverType === "selfApproved",
            CreatedByUserFK: loginPinID
        };
        AddDeleteUpadate('ReportWorkFlow/Insert_ReportWorkFlow', payload).then((res) => {
            const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
            toastifySuccess(message); get_Data_ReportWorkflow(loginAgencyID); setStatus(false); setErrors({ ...errors, 'ParentContactDtTmErrors': '', });
        })
    }
    const update_Juvenile = () => {
        const payload = {
            AgencyID: loginAgencyID,
            WorkflowName: reportWorkflowState.workflowName,
            AppliesReportTypeID: reportWorkflowState.AppliesReportTypeID,
            Notes: reportWorkflowState.note,
            ReportApproverGroupID: reportWorkflowState.ReportApproverGroupID,
            ReportApproverRequired: reportWorkflowState.approvalsRequired,
            ReportReviewerGroupID: reportWorkflowState.ReportReviewerGroupID,
            IsMultipleLevel: reportWorkflowState.reportApproverType === "multipleLevel",
            IsSingleLevel: reportWorkflowState.reportApproverType === "singleLevel",
            IsNoApproval: reportWorkflowState.reportApproverType === "noApproval",
            IsSelfApproved: reportWorkflowState.reportApproverType === "selfApproved",
            CreatedByUserFK: loginPinID
        };
        AddDeleteUpadate('ReportWorkFlow/Update_ReportWorkFlow', payload).then((res) => {
            const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            setStatus(false); setErrors({ ...errors, 'ParentContactDtTmErrors': '', });
            reset();
        })
    }


    const columns = [
        {
            name: "Workflow Name",
            selector: row => row.WorkflowName,
            sortable: true,
        },
        {
            name: "Applies To Report Type",
            selector: row => row.appliesToReportType,
            sortable: true,
        },
        {
            name: "Reviewer",
            selector: row => row.reviewer,
            sortable: true,
        },
        {
            name: "Report Approver",
            selector: row => row.reportApprover,
            sortable: true,
        },
        {
            name: "Report Writing Time Limit",
            selector: row => row.reportWritingTimeLimit,
            sortable: true,
        },
        {
            name: "Report Approval Time Limit",
            selector: row => row.reportApprovalTimeLimit,
            sortable: true,
        },
    ];

    const set_Edit_Value = (row) => {
        setStatus(true); setErrors('');
        setReportWorkFlowID(row.ReportWorkFlowID);
        GetSingleData(row.ReportWorkFlowID)

    }
    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    return (
        <div className="col-12 mt-3 mb-1 cad-css">
            <div className="utilities-tab-content-table-container mb-1">
                {/* Scope Section */}
                <fieldset>
                    <legend>Scope</legend>
                    <div className="row">
                        <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="" className="tab-form-label">  Workflow Name{errors.ParentContactDtTmErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ParentContactDtTmErrors}</p>
                            ) : null}  </label>
                        </div>
                        <div className="col-3 d-flex align-self-center">
                            <input name="workflowName" type="text" className="form-control py-1 new-input requiredColor" placeholder='Placeholder'
                                onKeyDown={handleSpecialKeyDown} value={reportWorkflowState?.WorkflowName} onChange={(e) => { handleReportWorkflowState("workflowName", e.target.value); setIsChange(true); }}
                            />
                        </div>
                        <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="" className="tab-form-label"> Applies To Report </label>
                        </div>
                        <div className="col-4 d-flex align-items-center justify-content-center">
                            <Select
                                isClearable
                                options={appliesToReportDrpData}
                                placeholder="Select"
                                styles={coloredStyle_Select}
                                getOptionLabel={(v) => `${v?.Code} | ${v?.Description}`}
                                getOptionValue={(v) => v?.Code}
                                formatOptionLabel={(option, { context }) => {
                                    return context === 'menu' ? `${option?.Code} | ${option?.Description}` : option?.Code;
                                }}
                                className="w-100"
                                name="appliesToReport"
                                value={reportWorkflowState.appliesToReport ? reportWorkflowState.appliesToReport : ""}
                                onChange={(e) => { handleReportWorkflowState("appliesToReport", e); setIsChange(true); }}
                            />
                            <div className="form-check ml-2">
                                <input className="form-check-input" type="checkbox" id="FOIA" checked={reportWorkflowState.FOIA} disabled={reportWorkflowState.reportApproverType === "noApproval"}
                                    onChange={(e) => handleReportWorkflowState("FOIA", e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="FOIA"> FOIA </label>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <fieldset className='mt-2'>
                        <legend>Notes</legend>
                        <div className="row mt-2">
                            <div className="col-12">
                                <input name="note" type="text" className="form-control py-1 new-input" placeholder='Notes'
                                    onKeyDown={handleSpecialKeyDown} value={reportWorkflowState?.note} onChange={(e) => { handleReportWorkflowState("note", e.target.value); setIsChange(true); }}
                                />
                            </div>
                        </div>
                    </fieldset>
                </fieldset>
            </div>

            <div className="utilities-tab-content-table-container mb-3">
                {/* Approver & Reviewer Eligibility Section */}
                <fieldset>
                    <legend>Approver & Reviewer Eligibility</legend>
                    <div className="border rounded p-3 mt-2 mb-4">
                        {/* Report Approver */}
                        <div className="row mb-3">
                            <div className="col-12 d-flex align-items-center">
                                <div className="h6">Report Approver</div>
                                <div className="d-flex align-items-center mb-2 ml-2">
                                    <i className="fa fa-exclamation-triangle text-danger mr-1" aria-hidden="true"></i>
                                    <small className="text-danger">
                                        Only personnel with <strong>Report Approver = Yes</strong> at the selected group level will receive reports for approval, except in cases of self-approval or no approval
                                    </small>
                                </div>
                            </div>
                            <div className="col-12 d-flex align-items-center mb-2">
                                <div className="col-7 offset-1 d-flex gap-2 align-content-center">
                                    <div className="form-check mr-3">
                                        <input className="form-check-input" type="radio" name="reportApproverType"
                                            id="multipleLevel" checked={reportWorkflowState.reportApproverType === "multipleLevel"} onChange={() => handleReportWorkflowState("reportApproverType", "multipleLevel")}
                                        />
                                        <label className="form-check-label" htmlFor="multipleLevel">  Multiple Level  </label>
                                    </div>
                                    <div className="form-check mr-3">
                                        <input className="form-check-input" type="radio" name="reportApproverType" id="singleLevel" checked={reportWorkflowState.reportApproverType === "singleLevel"} onChange={() => { handleReportWorkflowState("reportApproverType", "singleLevel"); handleReportWorkflowState("approvalsRequired", "") }}
                                        />
                                        <label className="form-check-label" htmlFor="singleLevel">  Single Level     </label>
                                    </div>
                                    <div className="form-check mr-3">
                                        <input className="form-check-input" type="radio" name="reportApproverType" id="selfApproved" checked={reportWorkflowState.reportApproverType === "selfApproved"} onChange={() => { handleReportWorkflowState("reportApproverType", "selfApproved"); handleReportWorkflowState("skipIfApproverIsAuthor", false); handleReportWorkflowState("approvalsRequired", "") }}
                                        />
                                        <label className="form-check-label" htmlFor="selfApproved">Self Approved </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="reportApproverType" id="noApproval" checked={reportWorkflowState.reportApproverType === "noApproval"} onChange={() => { handleReportWorkflowState("reportApproverType", "noApproval"); handleReportWorkflowState("skipIfApproverIsAuthor", false); handleReportWorkflowState("approvalsRequired", "") }}
                                        />
                                        <label className="form-check-label" htmlFor="noApproval"> No Approval  </label>
                                    </div>
                                </div>
                                <div className="col-4 d-flex align-items-center">
                                    <i className="fa fa-exclamation-triangle text-danger mr-2"></i>
                                    <small className="text-danger">   Approvals stop at Level 1 (highest) even if more hops are configured </small>
                                </div>
                            </div>
                            <div className="col-12 d-flex align-items-center">
                                <div className="col-6 offset-1 d-flex gap-2 align-content-center">
                                    <Select
                                        options={approverOptions}
                                        placeholder="Select"
                                        styles={reportWorkflowState.reportApproverType === "selfApproved" || reportWorkflowState.reportApproverType === "noApproval" ? colorLessStyle_Select : coloredStyle_Select}
                                        className="w-100"
                                        isDisabled={reportWorkflowState.reportApproverType === "selfApproved" || reportWorkflowState.reportApproverType === "noApproval"}
                                        value={reportWorkflowState.reportApprover}
                                        onChange={(e) => handleReportWorkflowState("reportApprover", e)}
                                    />
                                </div>
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label"> Approvals Required (hops)  </label>
                                </div>
                                <div className="col-3">
                                    <input type="number" className="form-control py-1 new-input requiredColor" placeholder="Enter hours" min="1" disabled={reportWorkflowState.reportApproverType === "noApproval" || reportWorkflowState.reportApproverType === "selfApproved" || reportWorkflowState.reportApproverType === "singleLevel"} value={reportWorkflowState.approvalsRequired} onChange={(e) => handleReportWorkflowState("approvalsRequired", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-4 d-flex align-items-center offset-1 mt-1">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="skipIfApproverIsAuthor"
                                        checked={reportWorkflowState.skipIfApproverIsAuthor} disabled={reportWorkflowState.reportApproverType === "noApproval" || reportWorkflowState.reportApproverType === "selfApproved"} onChange={(e) => handleReportWorkflowState("skipIfApproverIsAuthor", e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="skipIfApproverIsAuthor">  Skip if the approver is the author </label>
                                </div>
                                <div className='ml-2'><span className='hovertext' data-hover="If the author belongs to the approver’s group level, they cannot approve their own report. 
    The system skips the author, and another officer from the same level will take action" ><i className='fa fa-exclamation-circle'></i></span></div>
                            </div>
                        </div>
                        {/* Report Reviewer */}
                        <div className='h6 mb-3'>Report Reviewer</div>
                        <div className="col-12 d-flex align-items-center">
                            <div style={{ width: '9%' }}>
                                <label className="form-label">Reviewer (read-only)</label>  </div>
                            <div className="col-4">
                                <Select
                                    options={reviewerOptions}
                                    placeholder="Select"
                                    styles={reportWorkflowState.reportApproverType === "noApproval" ? colorLessStyle_Select : coloredStyle_Select}
                                    isDisabled={reportWorkflowState.reportApproverType === "noApproval"}
                                    className="w-100"
                                    value={reportWorkflowState.reportReviewer}
                                    onChange={(e) => handleReportWorkflowState("reportReviewer", e)}
                                />
                            </div>
                            <div className="col-4 d-flex align-items-center">
                                <small className="text-danger">  Reviewers can comment but cannot block Approval process </small>
                            </div>
                        </div>
                    </div>

                    {/* Escalation & Rules Section */}
                    <fieldset>
                        <legend>Escalation & Rules (Reminder and Notification)</legend>
                        <div className="border rounded p-2 mt-2">
                            <div className="col-12 d-flex align-items-center">
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label">   Report Writing Time Limit  </label>
                                </div>
                                <div className="col-3">
                                    <input type="number" className="form-control py-1 new-input requiredColor" placeholder="Enter hours" min="1" disabled={reportWorkflowState.reportApproverType === "noApproval"} value={reportWorkflowState.reportWritingTimeLimit}
                                        onChange={(e) => handleReportWorkflowState("reportWritingTimeLimit", e.target.value)}
                                    />
                                </div>
                                <div className="col-1">
                                    <Select
                                        options={timeUnitOptions}
                                        placeholder="Hours"
                                        styles={reportWorkflowState.reportApproverType === "noApproval" ? colorLessStyle_Select : coloredStyle_Select}
                                        isDisabled={reportWorkflowState.reportApproverType === "noApproval"}
                                        className="w-100"
                                        value={timeUnitOptions.find(option => option.value === reportWorkflowState.reportWritingTimeUnit)}
                                        onChange={(e) => { handleReportWorkflowState("reportWritingTimeUnit", e.value); handleReportWorkflowState("warningTimeUnit", e.value) }}
                                    />
                                </div>
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label">
                                        Report Approval Time Limit
                                    </label>
                                </div>
                                <div className="col-3">
                                    <input type="number" className="form-control py-1 new-input requiredColor" placeholder="Enter hours" min="1" disabled={reportWorkflowState.reportApproverType === "noApproval"} value={reportWorkflowState.reportApprovalTimeLimit}
                                        onChange={(e) => handleReportWorkflowState("reportApprovalTimeLimit", e.target.value)}
                                    />
                                </div>
                                <div className="col-1">
                                    <Select
                                        options={timeUnitOptions}
                                        placeholder="Hours"
                                        styles={reportWorkflowState.reportApproverType === "noApproval" ? colorLessStyle_Select : coloredStyle_Select}
                                        isDisabled={reportWorkflowState.reportApproverType === "noApproval"}
                                        className="w-100"
                                        value={timeUnitOptions.find(option => option.value === reportWorkflowState.reportApprovalTimeUnit)}
                                        onChange={(e) => { handleReportWorkflowState("reportApprovalTimeUnit", e.value); handleReportWorkflowState("warningBeforeTimeUnit2", e.value) }}
                                    />
                                </div>
                            </div>
                            <div className="col-12 d-flex align-content-center my-2">
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label"> Warning Before Time (Reminder) </label>
                                </div>
                                <div className="col-3 d-flex align-items-center">
                                    <input type="checkbox" id="warningBeforeTimeCheck" checked={reportWorkflowState.warningBeforeTimeCheck}
                                        disabled={reportWorkflowState.reportApproverType === "noApproval"}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            handleReportWorkflowState("warningBeforeTimeCheck", isChecked);
                                            if (!isChecked) { handleReportWorkflowState("warningBeforeTime", ""); }
                                        }}
                                    />
                                    <input
                                        type="number" className="form-control py-1 new-input requiredColor ml-2" placeholder="Enter time" min="1" max={reportWorkflowState.reportWritingTimeLimit} disabled={reportWorkflowState.reportApproverType === "noApproval" || !reportWorkflowState.warningBeforeTimeCheck} value={reportWorkflowState.warningBeforeTime}
                                        onChange={(e) => {
                                            const value = e.target.value; const maxValue = reportWorkflowState.reportWritingTimeLimit;
                                            if (value === "" || (value && !isNaN(value) && parseFloat(value) < parseFloat(maxValue))) {
                                                handleReportWorkflowState("warningBeforeTime", value);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-1">
                                    <Select
                                        options={timeUnitOptions}
                                        placeholder="Hours"
                                        styles={reportWorkflowState.reportApproverType === "noApproval" ? colorLessStyle_Select : colorLessStyle_Select}
                                        isDisabled
                                        className="w-100"
                                        value={timeUnitOptions.find(option => option.value === reportWorkflowState.warningTimeUnit)}
                                        onChange={(e) => handleReportWorkflowState("warningTimeUnit", e.value)}
                                    />
                                </div>
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label">  Warning Before Time (Reminder)  </label>
                                </div>
                                <div className="col-3 d-flex align-items-center">
                                    <input type="checkbox" id="warningBeforeTimeCheck2" checked={reportWorkflowState.warningBeforeTimeCheck2} disabled={reportWorkflowState.reportApproverType === "noApproval"}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            handleReportWorkflowState("warningBeforeTimeCheck2", isChecked);
                                            if (!isChecked) { handleReportWorkflowState("warningBeforeTime2", ""); }
                                        }}
                                    />
                                    <input
                                        type="number"
                                        className="form-control py-1 new-input requiredColor ml-2"
                                        placeholder="Enter time"
                                        min="1"
                                        disabled={reportWorkflowState.reportApproverType === "noApproval" || !reportWorkflowState.warningBeforeTimeCheck2}
                                        value={reportWorkflowState.warningBeforeTime2}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const maxValue = reportWorkflowState.reportApprovalTimeLimit;
                                            if (value === "" || (value && !isNaN(value) && parseFloat(value) < parseFloat(maxValue))) {
                                                handleReportWorkflowState("warningBeforeTime2", value);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-1">
                                    <Select
                                        options={timeUnitOptions}
                                        placeholder="Hours"
                                        styles={reportWorkflowState.reportApproverType === "noApproval" ? colorLessStyle_Select : colorLessStyle_Select}
                                        isDisabled
                                        className="w-100"
                                        value={timeUnitOptions.find(option => option.value === reportWorkflowState.warningBeforeTimeUnit2)}
                                        onChange={(e) => handleReportWorkflowState("warningBeforeTimeUnit2", e.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 d-flex align-content-center mb-2">
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label">
                                        Notification
                                    </label>
                                </div>
                                <div className="col-7 d-flex align-items-center">
                                    <Select
                                        options={[
                                            { value: "author", label: "Author" },
                                            { value: "supervisor", label: "Supervisor" },
                                            { value: "manager", label: "Manager" },
                                            { value: "administrator", label: "Administrator" }
                                        ]}
                                        placeholder="Select"
                                        styles={reportWorkflowState.reportApproverType === "noApproval" ? colorLessStyle_Select : coloredStyle_Select}
                                        isDisabled={reportWorkflowState.reportApproverType === "noApproval"}
                                        className="w-100"
                                        value={reportWorkflowState.notification}
                                        onChange={(e) => handleReportWorkflowState("notification", e)}
                                    />
                                </div>
                                <div className="form-check mr-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="notifyUponExpiration"
                                        checked={reportWorkflowState.notifyUponExpiration}
                                        disabled={reportWorkflowState.reportApproverType === "noApproval"}
                                        onChange={(e) => handleReportWorkflowState("notifyUponExpiration", e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="notifyUponExpiration">
                                        Notify Upon Expiration
                                    </label>
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-center">
                                <small className="text-danger">
                                    Notification will be received by the current level approver, even  if you have not selected them to the notification field.
                                </small>
                            </div>
                        </div>
                    </fieldset>
                </fieldset>
            </div>
            <div className="utilities-tab-content-table-container mb-3">
                <div className="col-12 d-flex align-items-center">
                    <div className='h6 mb-2'>Agency Group Levels <span className="text-muted">(1 = Highest)</span></div>
                    <button
                        type="button"
                        className="btn btn-primary btn-sm ml-4"
                        onClick={() => {
                            // Add your add new group logic here
                            console.log('Add new group clicked');
                        }}
                    >
                        Add new group
                    </button>
                </div>
                <div className="table-responsive">
                    <DataTable
                        dense
                        columns={groupLevelColumns}
                        data={groupLevelData}
                        customStyles={tableCustomStyles}
                        pagination
                        responsive
                        striped
                        persistTableHead={true}
                        highlightOnHover
                        fixedHeader
                    />
                </div>
            </div>


            <div className="col-12">
                <div className="btn-box text-right mt-1 mr-1">
                    <button
                        type="button" className="btn btn-sm btn-success mr-1" onClick={() => { reset(); }}
                    >
                        Reset
                    </button>
                    {
                        status ?
                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Update</button>
                            :
                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Save</button>
                    }
                </div>
            </div>
            <div className="table-responsive mt-4">
                <DataTable
                    dense
                    columns={columns}
                    data={ReportWorkflowData}
                    customStyles={tableCustomStyles}
                    pagination
                    onRowClicked={(row) => {
                        setClickedRow(row);
                        set_Edit_Value(row);
                    }}
                    conditionalRowStyles={conditionalRowStyles}

                    responsive
                    striped
                    persistTableHead={true}
                    highlightOnHover
                    fixedHeader
                />
            </div>
        </div>
    )
}

export default ReportWorkflow