import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { coloredStyle_Select, colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import DataTable from 'react-data-table-component';
import { base64ToString, Decrypt_Id_Name, tableCustomStyles } from '../../Components/Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../Components/hooks/Api';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../redux/actions/Agency';
import { toastifyError, toastifySuccess } from '../../Components/Common/AlertMsg';
import { RequiredFieldIncident } from '../../Components/Pages/Utility/Personnel/Validation';
import { get_Narrative_Type_Drp_Data } from '../../redux/actions/DropDownsData';
import { Comman_changeArrayFormat } from '../../Components/Common/ChangeArrayFormat';
import AddGroup from './AddGroup';
import { useLocation } from 'react-router-dom';

function ReportWorkflow() {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);
    const [loginAgencyID, setLoginAgencyID] = useState('')
    const [loginPinID, setLoginPinID] = useState('');
    const [ReportWorkflowData, setReportWorkflowData] = useState('');
    const [status, setStatus] = useState(false);
    const [clickedRow, setClickedRow] = useState(null);
    const [reportWorkFlowID, setReportWorkFlowID] = useState('');
    const [editval, setEditval] = useState();
    const [groupList, setGroupList] = useState([]);
    const [GroupListData, setGroupListData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [value, setValue] = useState({
        'AgencyID': '', 'WorkflowName': '', 'ApprovalType': "IsMultipleLevel", 'AppliesReportTypeID': '', 'Notes': '', 'ReportApproverGroupID': '',
        'ReportApproverRequired': '', 'ReportReviewerGroupID': '', 'IsSkipApproverAuthor': '', 'IsMultipleLevel': true, 'IsSingleLevel': '', 'IsNoApproval': '', 'IsSelfApproved': '', 'CreatedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'WorkflowNameErrors': '', 'ReportApproverGroupIDErrors': '', 'AppliesReportTypeErrors': '', 'ReportReviewerGroupIDErrors': '', 'ReportApproverRequiredErrors': '',
    })
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
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

    const timeUnitOptions = [
        { value: "hours", label: "Hours" },
        { value: "days", label: "Days" }
    ];

    const groupLevelColumns = [
        {
            name: 'Group Name',
            selector: (row) => row.GroupName,
            sortable: true
        },
        {
            name: 'Group Level',
            selector: (row) => row.level,
            sortable: true
        },
    ]

    useEffect(() => {
        if (aId) {
            get_Data_ReportWorkflow(aId); if (narrativeTypeDrpData?.length === 0) { dispatch(get_Narrative_Type_Drp_Data(aId)) }
            get_Group_List(aId);
        }
    }, [aId])

    const get_Data_ReportWorkflow = (aId) => {
        const val = { 'AgencyID': aId, }
        fetchPostData('ReportWorkFlow/GetData_ReportWorkFlow', val).then((res) => {
            if (res) { setReportWorkflowData(res); }
            else { setReportWorkflowData(); }
        })
    }

    const GetSingleData = (ReportWorkFlowID) => {
        const val = { 'ReportWorkFlowID': ReportWorkFlowID, }
        fetchPostData('ReportWorkFlow/GetSingleData_ReportWorkFlow', val)
            .then((res) => {
                if (res) {
                    setEditval(res);
                }
                else { setEditval([]) }
            })
    }

    const get_Group_List = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(Comman_changeArrayFormat(res, 'GroupID', 'GroupName'))
                setGroupListData(res)
            } else { setGroupList([]); setGroupListData([]) }
        })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'WorkflowName': editval[0]?.WorkflowName, 'ReportApproverGroupID': Number(editval[0]?.ReportApproverGroupID),
                'Notes': editval[0]?.Notes, 'ReportReviewerGroupID': Number(editval[0]?.ReportReviewerGroupID),
                'ReportApproverRequired': editval[0]?.ReportApproverRequired, 'ReportApproverRequired': editval[0]?.ReportApproverRequired != null ? Number(editval[0].ReportApproverRequired) : '', 'AppliesReportTypeID': editval[0]?.AppliesReportTypeID, 'IsMultipleLevel': editval[0]?.IsMultipleLevel,
                'IsSingleLevel': editval[0]?.IsSingleLevel, 'IsSkipApproverAuthor': editval[0]?.IsSkipApproverAuthor,
                'IsSelfApproved': editval[0]?.IsSelfApproved, 'IsNoApproval': editval[0]?.IsNoApproval, 'ModifiedByUserFK': loginPinID,
            })
        }
    }, [editval])

    const reset = () => {
        setValue({
            ...value, 'WorkflowName': '', 'AppliesReportTypeID': '', 'Notes': '', 'IsSkipApproverAuthor': '', 'ReportApproverGroupID': '', 'ReportApproverRequired': '', 'ReportReviewerGroupID': '', 'IsMultipleLevel': true, 'IsSingleLevel': '', 'IsNoApproval': '', 'IsSelfApproved': '', 'AppliesReportTypeErrors': '', 'ReportApproverGroupIDErrors': ''
        }); setErrors({ ...errors, 'WorkflowNameErrors': '', 'ReportApproverGroupIDErrors': '', 'AppliesReportTypeErrors': '', 'ReportReviewerGroupIDErrors': '' }); setStatus(false); setClickedRow(null)
    }

    const check_Validation_Error = (e) => {

        setErrors(prev => ({
            ...prev,
            WorkflowNameErrors: RequiredFieldIncident(value.WorkflowName),
            AppliesReportTypeErrors: RequiredFieldIncident(value.AppliesReportTypeID),
            ReportApproverGroupIDErrors: (value?.IsSingleLevel === true || value?.IsMultipleLevel === true) ? RequiredFieldIncident(value.ReportApproverGroupID) : 'true',
            ReportReviewerGroupIDErrors: (value?.IsSingleLevel === true || value?.IsMultipleLevel === true) ? RequiredFieldIncident(value.ReportReviewerGroupID) : 'true',
        }));
    };

    const { WorkflowNameErrors, AppliesReportTypeErrors, ReportApproverGroupIDErrors, ReportReviewerGroupIDErrors } = errors

    useEffect(() => {
        if (WorkflowNameErrors === 'true' && AppliesReportTypeErrors === 'true' && ReportApproverGroupIDErrors === 'true' && ReportReviewerGroupIDErrors === 'true') {
            if (status) { update_Juvenile() }
            else { Add_Type() }
        }
    }, [WorkflowNameErrors, AppliesReportTypeErrors, ReportApproverGroupIDErrors, ReportReviewerGroupIDErrors])


    const Add_Type = () => {
        const { AgencyID, WorkflowName, IsSkipApproverAuthor, AppliesReportTypeID, Notes, ReportApproverGroupID, ReportApproverRequired, ReportReviewerGroupID, IsMultipleLevel, IsSingleLevel, IsNoApproval, IsSelfApproved, CreatedByUserFK } = value;
        const Value = {
            AgencyID: aId, WorkflowName: WorkflowName, IsSkipApproverAuthor: IsSkipApproverAuthor, AppliesReportTypeID: AppliesReportTypeID, Notes: Notes, ReportApproverGroupID: ReportApproverGroupID, ReportApproverRequired: ReportApproverRequired, ReportReviewerGroupID: ReportReviewerGroupID, IsMultipleLevel: IsMultipleLevel, IsSingleLevel: IsSingleLevel, IsNoApproval: IsNoApproval, IsSelfApproved: IsSelfApproved, CreatedByUserFK: loginPinID
        };
        const result = ReportWorkflowData?.find(item => {
            if (item.AppliesReportTypeID === value.AppliesReportTypeID) {
                return item.AppliesReportTypeID === value.AppliesReportTypeID
            } else return item.AppliesReportTypeID === value.AppliesReportTypeID
        });
        if (result) {

            toastifyError('Report Type  Already Exists')
            setErrors({ ...errors, 'AppliesReportTypeErrors': '', })
        }
        else {
            AddDeleteUpadate('ReportWorkFlow/Insert_ReportWorkFlow', Value).then((res) => {
                const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Data_ReportWorkflow(aId); setStatus(false); reset(); setErrors({ ...errors, 'WorkflowNameErrors': '', });
            })
        }

    }

    const update_Juvenile = () => {
        const { AgencyID, ReportWorkFlowID, IsSkipApproverAuthor, WorkflowName, AppliesReportTypeID, Notes, ReportApproverGroupID, ReportApproverRequired, ReportReviewerGroupID, IsMultipleLevel, IsSingleLevel, IsNoApproval, IsSelfApproved, CreatedByUserFK } = value;
        const Value = {
            AgencyID: aId, ReportWorkFlowID: reportWorkFlowID, IsSkipApproverAuthor: IsSkipApproverAuthor, WorkflowName: WorkflowName, AppliesReportTypeID: AppliesReportTypeID, Notes: Notes, ReportApproverGroupID: ReportApproverGroupID, ReportApproverRequired: ReportApproverRequired, ReportReviewerGroupID: ReportReviewerGroupID, IsMultipleLevel: IsMultipleLevel, IsSingleLevel: IsSingleLevel, IsNoApproval: IsNoApproval, IsSelfApproved: IsSelfApproved, ModifiedByUserFK: loginPinID
        };
        const result = ReportWorkflowData?.find(item => {
            if (item?.ReportWorkFlowID != reportWorkFlowID) {

                if (item.AppliesReportTypeID === value.AppliesReportTypeID) {
                    return item.AppliesReportTypeID === value.AppliesReportTypeID
                } else return item.AppliesReportTypeID === value.AppliesReportTypeID
            }

        });

        if (result) {

            toastifyError('Report Type  Already Exists')
            setErrors({ ...errors, 'AppliesReportTypeErrors': '', })
        }
        else {
            AddDeleteUpadate('ReportWorkFlow/Update_ReportWorkFlow', Value).then((res) => {
                const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setStatus(false); setErrors({ ...errors, 'WorkflowNameErrors': '', 'WorkflowNameErrors': '' });
                reset(); get_Data_ReportWorkflow(aId);
            })
        }

    }

    const HandleChange = (e) => {
        const { name, value: inputValue, checked } = e.target;
        if (name === "ApprovalType") {
            if (value.ApprovalType === "IsMultipleLevel" && inputValue !== "IsMultipleLevel") {
                setValue({
                    ...value,
                    ApprovalType: inputValue, ReportApproverGroupID: '', approvalsRequired: '', ReportApproverRequired: '', ReportReviewerGroupID: '', skipIfApproverIsAuthor: false
                });
            } else { setValue({ ...value, [name]: inputValue }); }
        }
        else if (
            name === "IsSelfApproved" ||
            name === "IsNoApproval" ||
            name === "IsSingleLevel" ||
            name === "IsMultipleLevel"
        ) {
            setValue({ ...value, [name]: checked });
        }
        else {
            setValue({ ...value, [name]: e.target.value });
        }
    };

    const columns = [
        {
            name: "Workflow Name", selector: row => row?.WorkflowName, sortable: true,
        },
        {
            name: "Applies To Report Type", selector: row => row?.AppliesReportType, sortable: true,
        },
        {
            name: "Reviewer", selector: row => row?.ReportReviewerGroup, sortable: true,
        },
        {
            name: "Report Approver", selector: row => row?.reportApprover, sortable: true,
        },
        {
            name: "Report Writing Time Limit", selector: row => row?.reportWritingTimeLimit, sortable: true,
        },
        {
            name: "Report Approval Time Limit", selector: row => row?.reportApprovalTimeLimit, sortable: true,
        },
    ];

    const set_Edit_Value = (row) => {
        setStatus(true); setErrors(''); setReportWorkFlowID(row.ReportWorkFlowID);
        GetSingleData(row?.ReportWorkFlowID)
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const ChangeDropDownReportType = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value });
        } else {
            setValue({ ...value, [name]: null });
        }
    }

    const ReportApprovingLevel = [
        { value: 1, label: "Greater Than" },
        { value: 2, label: "Greater Than Or Equal To" },
    ];

    const handleRadioChange = (event) => {
        const selectedOptionnew = event.target.value;
        setValue(prevState => ({
            ...prevState,
            IsMultipleLevel: selectedOptionnew === 'IsMultipleLevel',
            IsSingleLevel: selectedOptionnew === 'IsSingleLevel',
            IsSelfApproved: selectedOptionnew === 'IsSelfApproved',
            IsNoApproval: selectedOptionnew === 'IsNoApproval',
        }));
        setErrors({ ...errors, 'WorkflowNameErrors': '', 'WorkflowNameErrors': '', 'AppliesReportTypeErrors': '', 'ReportApproverGroupIDErrors': '', 'ReportReviewerGroupIDErrors': '' });
    };

    const handleReportWorkflowState = (e) => {
        let { name, value: inputValue } = e.target;
        if (e) {
            if (e.target.name === "IsSkipApproverAuthor") {
                setValue({
                    ...value,
                    [e.target.name]: e.target.checked
                })
                // setChangesStatus(true)
                // setStatesChangeStatus(true);

            } else {
                // setValue({ ...value, [e.target.name]: e.target.value.replace(/\D/g, '') })
            }
        } else {
            // setChangesStatus(true)
            // setStatesChangeStatus(true);

            setValue({
                ...value,
                [e.target.name]: " "
            })
        }
    };

    return (
        <div className="col-12 mt-3 mb-1 cad-css">
            <div className="utilities-tab-content-table-container mb-1">
                {/* Scope Section */}
                <fieldset>
                    <legend>Scope</legend>
                    <div className="row">
                        <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="" className="tab-form-label">  Workflow Name{errors.WorkflowNameErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WorkflowNameErrors}</p>
                            ) : null}  </label>
                        </div>
                        <div className="col-3 d-flex align-self-center">
                            <input type="text" name='WorkflowName' onKeyDown={handleSpecialKeyDown} value={value?.WorkflowName} placeholder='Placeholder' onChange={HandleChange} className="form-control py-1 new-input requiredColor" id='WorkflowName' required />
                        </div>
                        <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="" className="tab-form-label"> Applies To Report{errors.AppliesReportTypeErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AppliesReportTypeErrors}</p>
                            ) : null}  </label>
                        </div>
                        <div className="col-4 d-flex align-items-center justify-content-center">
                            <Select
                                name='AppliesReportTypeID'
                                isClearable
                                styles={coloredStyle_Select}
                                value={narrativeTypeDrpData?.filter((obj) => obj.value === value?.AppliesReportTypeID)}
                                options={narrativeTypeDrpData}
                                onChange={(e) => ChangeDropDownReportType(e, 'AppliesReportTypeID', 'NarrativeTypeCode')}
                                placeholder="Select.."
                                menuPlacement="bottom"
                            />
                            <div className="form-check ml-2">
                                <input className="form-check-input" type="checkbox" id="FOIA" checked={value.FOIA} disabled={value.reportApproverType === "noApproval"}
                                />
                                <label className="form-check-label" htmlFor="FOIA"> FOIA </label>
                            </div>
                        </div>
                        <div className="col-2 d-flex align-self-center justify-content-end mt-1">
                            <label htmlFor="" className="tab-form-label">Notes</label>
                        </div>
                        <div className="col-10 d-flex align-self-center mt-1">
                            <input type="text" name='Notes' onKeyDown={handleSpecialKeyDown} value={value?.Notes} placeholder='Placeholder' onChange={HandleChange} className="form-control py-1 new-input" id='Notes' required />
                        </div>
                    </div>
                </fieldset>
            </div>

            <div className="utilities-tab-content-table-container mb-3">
                {/* Approver & Reviewer Eligibility Section */}
                <fieldset>
                    <legend>Approver & Reviewer Eligibility</legend>
                    <div className="mt-2 mb-4">
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
                         
                                    
                                        <div className="col-12 d-flex align-items-center mb-2" style={{ marginLeft: "15px" }}>
                                            <div className="col-7 d-flex gap-2 align-content-center">
                                                <div className="form-check mr-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="ApprovalType"
                                                        id="IsMultipleLevel"
                                                        value="IsMultipleLevel"
                                                        checked={value?.IsMultipleLevel}
                                                        onChange={handleRadioChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="IsMultipleLevel">Multiple Level</label>
                                                </div>

                                                <div className="form-check mr-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="ApprovalType"
                                                        id="IsSingleLevel"
                                                        value="IsSingleLevel"
                                                        checked={value?.IsSingleLevel}
                                                        onChange={handleRadioChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="IsSingleLevel">Single Level</label>
                                                </div>

                                                <div className="form-check mr-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="ApprovalType"
                                                        id="IsSelfApproved"
                                                        value="IsSelfApproved"
                                                        checked={value?.IsSelfApproved}
                                                        onChange={handleRadioChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="IsSelfApproved">Self Approved</label>
                                                </div>

                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="ApprovalType"
                                                        id="IsNoApproval"
                                                        value="IsNoApproval"
                                                        checked={value?.IsNoApproval}
                                                        onChange={handleRadioChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="IsNoApproval">No Approval</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 d-flex align-items-center" style={{ marginLeft: "15px" }}>
                                            <div className="col-4 d-flex gap-2 align-content-center" >
                                                <label htmlFor="" className="tab-form-label"> {errors.ReportApproverGroupIDErrors !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportApproverGroupIDErrors}</p>
                                                ) : null}  </label>
                                                <Select
                                                    // styles={coloredStyle_Select}
                                                    name="ReportApproverGroupID"
                                                    value={ReportApprovingLevel?.filter((obj) => obj.value === value?.ReportApproverGroupID)}
                                                    isClearable
                                                    placeholder="Select..."
                                                    options={ReportApprovingLevel}
                                                    onChange={(e) => ChangeDropDownReportType(e, 'ReportApproverGroupID')}
                                                    styles={value.IsSelfApproved || value.IsNoApproval ? colorLessStyle_Select : coloredStyle_Select}
                                                    className="w-100"
                                                    isDisabled={value.IsSelfApproved || value.IsNoApproval || value.ApprovalType === "IsNoApproval"}
                                                />
                                            </div>
                                            <div className="col-4 d-flex align-items-center" style={{ gap: "10px" }}>
                                                <label htmlFor="" className="tab-form-label text-nowrap"> Approvals Required (hops) <span className='hovertext ml-2' data-hover="Approvals stop at Level 1 (highest) even if more hops are configured" ><i className='fa fa-exclamation-circle'></i></span>
                                                </label>
                                                <input type="number" name='ReportApproverRequired' className="form-control py-1 new-input " placeholder="Enter hops" min="1"
                                                    disabled={value.IsNoApproval || value.IsSelfApproved || value.IsSingleLevel} value={value.ReportApproverRequired} onChange={HandleChange}
                                                />
                                            </div>
                                            <div className="col-4 d-flex align-items-center" style={{ gap: "10px" }}>
                                                <label className="form-label text-nowrap ">Reviewer (read-only)
                                                    <span className='hovertext ml-2' data-hover=" Reviewers can comment but cannot block Approval process" ><i className='fa fa-exclamation-circle'></i></span>
                                                    {errors.ReportReviewerGroupIDErrors !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportReviewerGroupIDErrors}</p>
                                                    ) : null}</label>
                                                <Select
                                                    name="ReportReviewerGroupID"
                                                    value={groupList?.filter((obj) => obj.value === value?.ReportReviewerGroupID)}
                                                    isClearable
                                                    placeholder="Select..."
                                                    options={groupList}
                                                    onChange={(e) => ChangeDropDownReportType(e, 'ReportReviewerGroupID')}
                                                    styles={value.IsSelfApproved || value.IsNoApproval ? colorLessStyle_Select : coloredStyle_Select}
                                                    className="w-100"
                                                    isDisabled={value.IsSelfApproved || value.IsNoApproval}
                                                />
                                            </div>
                                            {/* <div className="col-4 d-flex align-items-center">
                                                    <small className="text-danger">  Reviewers can comment but cannot block Approval process </small>
                                                </div> */}
                                        </div>
                                   
                        

                            {
                                ((value?.IsSingleLevel && value.ReportApproverGroupID === 2) || (value?.IsMultipleLevel && value.ReportApproverGroupID === 2)) ?
                                    <>
                                        <div className="col-4 d-flex align-items-center offset-1 mt-1">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="IsSkipApproverAuthor"
                                                    name='IsSkipApproverAuthor' checked={value.IsSkipApproverAuthor} disabled={value.IsNoApproval || value.IsSelfApproved} onChange={handleReportWorkflowState}
                                                />
                                                <label className="form-check-label" htmlFor="IsSkipApproverAuthor">  Skip if the approver is the author </label>
                                            </div>
                                            <div className='ml-2'><span className='hovertext' data-hover="If the author belongs to the approver’s group level, they cannot approve their own report.
    The system skips the author, and another officer from the same level will take action" ><i className='fa fa-exclamation-circle'></i></span></div>
                                        </div>
                                    </> : <></>
                            }

                        </div>
                    </div>

                    {/* Escalation & Rules Section */}
                    <fieldset>
                        <legend>Escalation & Rules (Reminder and Notification)</legend>
                        <div className="mt-2">
                            <div className="col-12 d-flex align-items-center">
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label">   Report Writing Time Limit  </label>
                                </div>
                                <div className="col-3">
                                    <input type="number" className="form-control py-1 new-input requiredColor" placeholder="Enter hours" min="1" disabled={value.ApprovalType === "IsNoApproval"} value={value.reportWritingTimeLimit}
                                        onChange={(e) => handleReportWorkflowState("reportWritingTimeLimit", e.target.value)}
                                    />
                                </div>
                                <div className="col-1">
                                    <Select
                                        options={timeUnitOptions}
                                        placeholder="Hours"
                                        styles={value.ApprovalType === "IsNoApproval" ? colorLessStyle_Select : coloredStyle_Select}
                                        isDisabled={value.ApprovalType === "IsNoApproval"}
                                        className="w-100"
                                        value={timeUnitOptions.find(option => option.value === value.reportWritingTimeUnit)}
                                        onChange={(e) => { handleReportWorkflowState("reportWritingTimeUnit", e.value); handleReportWorkflowState("warningTimeUnit", e.value) }}
                                    />
                                </div>
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label">
                                        Report Approval Time Limit
                                    </label>
                                </div>
                                <div className="col-3">
                                    <input type="number" className="form-control py-1 new-input requiredColor" placeholder="Enter hours" min="1" disabled={value.ApprovalType === "IsNoApproval"} value={value.reportApprovalTimeLimit}
                                        onChange={(e) => handleReportWorkflowState("reportApprovalTimeLimit", e.target.value)}
                                    />
                                </div>
                                <div className="col-1">
                                    <Select
                                        options={timeUnitOptions}
                                        placeholder="Hours"
                                        styles={value.ApprovalType === "IsNoApproval" ? colorLessStyle_Select : coloredStyle_Select}
                                        isDisabled={value.ApprovalType === "IsNoApproval"}
                                        className="w-100"
                                        value={timeUnitOptions.find(option => option.value === value.reportApprovalTimeUnit)}
                                        onChange={(e) => { handleReportWorkflowState("reportApprovalTimeUnit", e.value); handleReportWorkflowState("warningBeforeTimeUnit2", e.value) }}
                                    />
                                </div>
                            </div>
                            <div className="col-12 d-flex align-content-center my-2">
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label"> Warning Before Time (Reminder) </label>
                                </div>
                                <div className="col-3 d-flex align-items-center">
                                    <input type="checkbox" id="warningBeforeTimeCheck" checked={value.warningBeforeTimeCheck}
                                        disabled={value.ApprovalType === "IsNoApproval"}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            handleReportWorkflowState("warningBeforeTimeCheck", isChecked);
                                            if (!isChecked) { handleReportWorkflowState("warningBeforeTime", ""); }
                                        }}
                                    />
                                    <input
                                        type="number" className="form-control py-1 new-input requiredColor ml-2" placeholder="Enter time" min="1" max={value.reportWritingTimeLimit} disabled={value.ApprovalType === "IsNoApproval" || !value.warningBeforeTimeCheck} value={value.warningBeforeTime}
                                        onChange={(e) => {
                                            const value = e.target.value; const maxValue = value.reportWritingTimeLimit;
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
                                        styles={value.ApprovalType === "IsNoApproval" ? colorLessStyle_Select : colorLessStyle_Select}
                                        isDisabled
                                        className="w-100"
                                        value={timeUnitOptions.find(option => option.value === value.warningTimeUnit)}
                                        onChange={(e) => handleReportWorkflowState("warningTimeUnit", e.value)}
                                    />
                                </div>
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label">  Warning Before Time (Reminder)  </label>
                                </div>
                                <div className="col-3 d-flex align-items-center">
                                    <input type="checkbox" id="warningBeforeTimeCheck2" checked={value.warningBeforeTimeCheck2} disabled={value.ApprovalType === "IsNoApproval"}
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
                                        disabled={value.ApprovalType === "IsNoApproval" || !value.warningBeforeTimeCheck2}
                                        value={value.warningBeforeTime2}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const maxValue = value.reportApprovalTimeLimit;
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
                                        styles={value.ApprovalType === "IsNoApproval" ? colorLessStyle_Select : colorLessStyle_Select}
                                        isDisabled
                                        className="w-100"
                                        value={timeUnitOptions.find(option => option.value === value.warningBeforeTimeUnit2)}
                                        onChange={(e) => handleReportWorkflowState("warningBeforeTimeUnit2", e.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 d-flex align-content-center mb-2">
                                <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label htmlFor="" className="tab-form-label">
                                        Notification
                                        <span className='hovertext ml-2' data-hover="Notification will be received by the current level approver, even  if you have not selected them to the notification field."><i className='fa fa-exclamation-circle'></i></span>
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
                                        styles={value.ApprovalType === "IsNoApproval" ? colorLessStyle_Select : coloredStyle_Select}
                                        isDisabled={value.ApprovalType === "IsNoApproval"}
                                        className="w-100"
                                        value={value.notification}
                                        onChange={(e) => handleReportWorkflowState("notification", e)}
                                    />
                                </div>
                                <div className="form-check mr-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="notifyUponExpiration"
                                        checked={value.notifyUponExpiration}
                                        disabled={value.reportApproverType === "IsNoApproval"}
                                        onChange={(e) => handleReportWorkflowState("notifyUponExpiration", e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="notifyUponExpiration">
                                        Notify Upon Expiration
                                    </label>
                                </div>
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
                        onClick={() => setShowModal(true)}
                    >
                        Add new group
                    </button>
                </div>
                <div className="col-12 mt-1">
                    <DataTable
                        dense
                        columns={groupLevelColumns}
                        // data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? groupList : '' : ''}
                        data={GroupListData}
                        highlightOnHover
                        paginationPerPage={'100'}
                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                        noContextMenu
                        showHeader={true}
                        persistTableHead={true}
                        conditionalRowStyles={conditionalRowStyles}
                        customStyles={tableCustomStyles}
                        // onRowClicked={(row) => {
                        //     set_Edit_Value(row);
                        //     setClickedRow(row);
                        // }}
                        fixedHeader
                        pagination
                        responsive
                        subHeaderAlign="right"
                        subHeaderWrap
                        fixedHeaderScrollHeight='340px'
                        noDataComponent={'There are no data to display'}

                    // noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>


            {showModal && (
                <AddGroup setShowModal={setShowModal} showModal={showModal} get_Group_List={get_Group_List} />
                // <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                //     <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                //         <div className="modal-content">
                //             <div className="modal-header">
                //                 <h5 className="modal-title">Add Group</h5>
                //                 <button
                //                     type="button" className="btn btn-outline-danger btn-sm"
                //                     aria-label="Close modal" title="Close" onClick={() => setShowModal(false)}
                //                 >
                //                     ✖
                //                 </button>

                //             </div>
                //             <div className="modal-body">
                //                 <form>
                //                     <div className="row mb-3">
                //                         <div className="col-12">
                //                             <label className="form-label">Group Name</label>
                //                             <input type="text" name='GroupName' className="form-control" />
                //                         </div>
                //                     </div>
                //                     <div className="row mb-4">
                //                         <div className="col-12">
                //                             <label className="form-label">Group Level</label>

                //                             <input type="text" name='level'
                //                                 // value={value.level}
                //                                 autocomplete="off" className="form-control"
                //                                 // onChange={handleChange}
                //                                 maxLength={1}
                //                             />
                //                         </div>
                //                     </div>

                //                     <div className="d-flex justify-content-end">
                //                         <button
                //                             type="button"
                //                             className="btn btn-success mr-2"
                //                             onClick={() => setShowModal(false)}
                //                         >
                //                             Close
                //                         </button>

                //                         <button type="submit" className="btn btn-success mr-2">
                //                             Update
                //                         </button>

                //                         <button type="submit" className="btn btn-success">
                //                             Save
                //                         </button>

                //                     </div>
                //                 </form>
                //             </div>
                //         </div>
                //     </div>
                // </div>
            )}

            <div className="col-12">
                <div className="btn-box text-right mt-1 mr-1">
                    <button
                        type="button" className="btn btn-sm btn-success mr-1" onClick={() => { reset(); }}
                    >
                        New
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