import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { coloredStyle_Select, colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import DataTable from 'react-data-table-component';
import { getShowingDateText, tableCustomStyles } from '../../Components/Common/Utility';
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { get_AgencyOfficer_Data, getData_DropDown_CaseTask } from '../../redux/actions/DropDownsData';
import useObjState from '../../CADHook/useObjState';
import { isEmptyObject } from '../../CADUtils/functions/common';
import { toastifySuccess } from '../../Components/Common/AlertMsg';
import CaseManagementServices from '../../CADServices/APIs/caseManagement';
import { useQuery } from 'react-query';
import { fetchPostData } from '../../Components/hooks/Api';
import { Comman_changeArrayFormat } from '../../Components/Common/ChangeArrayFormat';
import ListModal from '../../Components/Pages/Utility/ListManagementModel/ListModal';

function CaseEffort({ CaseId }) {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const caseTaskDrpData = useSelector((state) => state.DropDown.caseTaskDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    // Form state variables
    const [
        formState,
        setFormState,
        handleFormState,
        clearFormState,
    ] = useObjState({
        CaseEffortID: null,
        taskList: null,
        investigator: null,
        taskDueDate: null,
        startDateTime: null,
        endDateTime: null,
        taskInstruction: '',
    });

    const [duration, setDuration] = useState('')
    const [loginPinID, setLoginPinID] = useState(null)
    const [agencyID, setAgencyID] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false);
    const [openPage, setOpenPage] = useState("");
    const [
        errorCaseEffortState,
        ,
        handleErrorCaseEffortState,
        clearErrorCaseEffortState, ,
    ] = useObjState({
        taskList: false,
        investigator: false,
        taskDueDate: false,
        startDateTime: false,
        endDateTime: false,
    });

    // Task data
    const [caseEffortsData, setCaseEffortsData] = useState([])
    const [activeTeamMembersData, setActiveTeamMembersData] = useState([])

    const getAllCaseEffortsKey = `/CaseManagement/GetAllCaseEfforts/${localStoreData?.AgencyID}/${CaseId}`;
    const { data: getAllCaseEffortsData, isSuccess: isGetAllCaseEffortsDataSuccess, refetch: refetchAllCaseEffortsData } = useQuery(
        [getAllCaseEffortsKey, {
            "AgencyID": localStoreData?.AgencyID,
            "CaseID": parseInt(CaseId)
        },],
        CaseManagementServices.getAllCaseEfforts,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!CaseId && !!agencyID
        }
    );

    useEffect(() => {
        if (getAllCaseEffortsData && isGetAllCaseEffortsDataSuccess) {
            const data = JSON.parse(getAllCaseEffortsData?.data?.data)?.Table
            setCaseEffortsData(data)
        } else {
            setCaseEffortsData([])
        }
    }, [getAllCaseEffortsData, isGetAllCaseEffortsDataSuccess])

    useEffect(() => {
        if (localStoreData?.AgencyID) {
            if (caseTaskDrpData?.length === 0) dispatch(getData_DropDown_CaseTask(localStoreData?.AgencyID))
            if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID));
            setLoginPinID(localStoreData?.PINID);
            setAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData?.AgencyID])

    const getActiveTeamMembersKey = `/CaseManagement/GetActiveTeamMembers/${CaseId}`;
    const { data: getActiveTeamMembersData, isSuccess: isGetActiveTeamMembersDataSuccess, refetch: refetchActiveTeamMembersData } = useQuery(
        [getActiveTeamMembersKey, {
            "CaseID": parseInt(CaseId)
        },],
        CaseManagementServices.getActiveTeamMembers,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!CaseId
        }
    );

    useEffect(() => {
        if (getActiveTeamMembersData && isGetActiveTeamMembersDataSuccess) {
            const data = Comman_changeArrayFormat(JSON.parse(getActiveTeamMembersData?.data?.data)?.Table, 'PINID', 'FullName')
            setActiveTeamMembersData(data || [])
        } else {
            setActiveTeamMembersData([])
        }
    }, [getActiveTeamMembersData, isGetActiveTeamMembersDataSuccess])


    // Calculate duration when start and end times change
    const calculateDuration = (start, end) => {
        if (!start || !end) return '0 Days 1 Hour 0 Minutes 0 Seconds'

        const diff = end.getTime() - start.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        return `${days} Days ${hours} Hour ${minutes} Minutes ${seconds} Seconds`
    }

    // Format duration from seconds to readable format
    const formatDurationFromSeconds = (seconds) => {
        if (!seconds && seconds !== 0) return '0 Days 0 Hour 0 Minutes 0 Seconds'

        const totalSeconds = parseInt(seconds)
        const days = Math.floor(totalSeconds / (60 * 60 * 24))
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
        const secs = totalSeconds % 60

        return `${days} Days ${hours} Hour ${minutes} Minutes ${secs} Seconds`
    }

    // Event handlers
    const handleStartDateTimeChange = (date) => {
        handleFormState('startDateTime', date)
        if (date && formState.endDateTime) {
            setDuration(calculateDuration(date, formState.endDateTime))
        }
    }

    const handleEndDateTimeChange = (date) => {
        handleFormState('endDateTime', date)
        if (date && formState.startDateTime) {
            setDuration(calculateDuration(formState.startDateTime, date))
        }
    }

    const handleNew = () => {
        clearFormState();
        setDuration('')
        clearErrorCaseEffortState();
    }

    const validation = () => {
        let isError = false;
        const keys = Object.keys(errorCaseEffortState);
        keys.forEach((field) => {
            if (field === "taskList" && isEmptyObject(formState.taskList)) {
                handleErrorCaseEffortState(field, true);
                isError = true;
            } else if (field === "investigator" && isEmptyObject(formState.investigator)) {
                handleErrorCaseEffortState(field, true);
                isError = true;
            } else if (field === "taskDueDate" && !formState.taskDueDate) {
                handleErrorCaseEffortState(field, true);
                isError = true;
            } else if (field === "startDateTime" && !formState.startDateTime) {
                handleErrorCaseEffortState(field, true);
                isError = true;
            } else if (field === "endDateTime" && !formState.endDateTime) {
                handleErrorCaseEffortState(field, true);
                isError = true;
            } else {
                handleErrorCaseEffortState(field, false);
            }
        });
        return !isError;
    };

    const handleSave = async () => {
        if (!validation()) return;
        setIsDisabled(true);
        const isUpdate = !!formState?.CaseEffortID;
        const newTask = {
            AgencyID: agencyID,
            CaseID: CaseId,
            TaskListID: formState.taskList?.ID,
            InvestigatorID: formState.investigator?.value,
            ID: isUpdate ? formState?.CaseEffortID : undefined,
            TaskInstruction: formState.taskInstruction,
            StartDate: formState.startDateTime,
            EndDate: formState.endDateTime,
            DueDate: formState.taskDueDate,
            CreatedByUserFK: isUpdate ? undefined : loginPinID,
            ModifiedByUserFK: isUpdate ? loginPinID : undefined,
        }
        let response;
        if (isUpdate) {
            response = await CaseManagementServices.updateCaseEffort(newTask);
        } else {
            response = await CaseManagementServices.addCaseEffort(newTask);
        }
        if (response?.status === 200) {
            toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
            refetchAllCaseEffortsData()
            handleNew()
        }
        setIsDisabled(false);
    }

    const columns = [
        {
            name: 'Task List',
            selector: row => row?.TaskListID ? caseTaskDrpData?.find(item => item.ID === row.TaskListID)?.Code + " | " + caseTaskDrpData?.find(item => item.ID === row.TaskListID)?.Description : '',
            sortable: true,
        },
        {
            name: 'Investigator',
            selector: row => row?.InvestigatorID ? agencyOfficerDrpData?.find(item => item.value === row.InvestigatorID)?.label : '',
            sortable: true,
        },
        {
            name: 'Duration',
            selector: row => row?.Duration ? formatDurationFromSeconds(row?.Duration) : '',
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: row => row?.StartDateTime ? getShowingDateText(row?.StartDateTime) : '',
            sortable: true,
        },
        {
            name: 'End Date',
            selector: row => row?.EndDateTime ? getShowingDateText(row?.EndDateTime) : '',
            sortable: true,
        },
        {
            name: 'Task Due Date',
            selector: row => row?.TaskDueDate ? getShowingDateText(row?.TaskDueDate) : '',
            sortable: true,
        },
        {
            name: 'Completed',
            selector: row => row?.IsCompleted ? 'Yes' : 'No/Due',
            cell: row => (
                <span
                    style={{
                        backgroundColor: row?.IsCompleted ? '#22c55e' : '#ef4444',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                    }}
                >
                    {row?.IsCompleted ? "Yes" : 'No/Due'}
                </span>
            ),
            sortable: true,
            width: "120px",
        },
    ];

    const conditionalRowStyles = [
        {
            when: row => row?.CaseEffortID === formState?.CaseEffortID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                },
            },
        }
    ];

    function handelSetEditData(data) {
        const val = { ID: data?.CaseEffortID, }
        fetchPostData('/CaseManagement/GetCaseEffortByID', val).then((res) => {
            if (res && res?.[0]) {
                const responseData = res[0];
                setFormState({
                    ...formState,
                    CaseEffortID: responseData?.CaseEffortID,
                    taskList: responseData?.TaskListID ? caseTaskDrpData?.find(item => item.ID === responseData?.TaskListID) : null,
                    investigator: responseData?.InvestigatorID ? agencyOfficerDrpData?.find(item => item.value === responseData?.InvestigatorID) : null,
                    taskDueDate: responseData?.TaskDueDate ? new Date(responseData.TaskDueDate) : null,
                    startDateTime: responseData?.StartDateTime ? new Date(responseData.StartDateTime) : null,
                    endDateTime: responseData?.EndDateTime ? new Date(responseData.EndDateTime) : null,
                    taskInstruction: responseData?.TaskInstruction || '',
                })

                // Calculate duration if both dates exist
                if (responseData?.StartDateTime && responseData?.EndDateTime) {
                    const startDate = new Date(responseData.StartDateTime);
                    const endDate = new Date(responseData.EndDateTime);
                    setDuration(calculateDuration(startDate, endDate));
                }
            }
            else {
                setFormState({
                    ...formState,
                    CaseEffortID: null,
                    taskList: null,
                    investigator: null,
                    taskDueDate: null,
                    startDateTime: null,
                    endDateTime: null,
                    taskInstruction: '',
                });
                setDuration('');
            }
        })
    }


    return (
        <>
            <div className='col-12 col-md-12 col-lg-12'>
                {/* Task Management Form */}
                <div className="row">
                    <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap" style={{ width: "130px" }}>
                            <span className="text-nowrap new-link px-0" data-toggle="modal" data-target="#ListModel"
                                onClick={() => { setOpenPage("Case Task"); }}>Task List</span>
                            {errorCaseEffortState.taskList && isEmptyObject(formState.taskList) ? <span style={{ color: 'red' }}>Required</span> : ''}
                        </label>
                        <Select
                            isClearable
                            options={caseTaskDrpData}
                            placeholder="Select"
                            styles={coloredStyle_Select}
                            value={formState.taskList}
                            getOptionLabel={(v) => `${v?.Code} | ${v?.Description}`}
                            getOptionValue={(v) => v?.Code}
                            formatOptionLabel={(option, { context }) => {
                                return context === 'menu'
                                    ? `${option?.Code} | ${option?.Description}`
                                    : option?.Description;
                            }}
                            label="Description"
                            onChange={(e) => handleFormState('taskList', e)}
                        />
                    </div>
                    <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label">
                            <div className="text-nowrap">Case Team Member</div>
                            {errorCaseEffortState.investigator && isEmptyObject(formState.investigator) ? <span style={{ color: 'red' }}>Required</span> : ''}
                        </label>
                        <Select
                            isClearable
                            options={activeTeamMembersData}
                            placeholder="Select"
                            styles={coloredStyle_Select}
                            value={formState.investigator}
                            onChange={(e) => handleFormState('investigator', e)}
                        />
                    </div>
                    <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">
                            <div className="text-nowrap">Task Due Date</div>
                            {errorCaseEffortState.taskDueDate && !formState.taskDueDate ? <span style={{ color: 'red' }}>Required</span> : ''}
                        </label>
                        <DatePicker
                            selected={formState.taskDueDate}
                            onChange={(date) => handleFormState('taskDueDate', date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select"
                            className="form-control requiredColor"
                            isClearable
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap" style={{ width: "130px" }}>
                            <div className="text-nowrap">Start DT/TM</div>
                            {errorCaseEffortState.startDateTime && !formState.startDateTime ? <span style={{ color: 'red' }}>Required</span> : ''}
                        </label>
                        <DatePicker
                            selected={formState.startDateTime}
                            onChange={handleStartDateTimeChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MM/dd/yyyy HH:mm"
                            placeholderText="Select"
                            className="form-control requiredColor"
                            isClearable
                        />
                    </div>
                    <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap" style={{ width: "90px", marginLeft: "55px" }}>
                            <div className="text-nowrap">End DT/TM</div>
                            {errorCaseEffortState.endDateTime && !formState.endDateTime ? <span style={{ color: 'red' }}>Required</span> : ''}
                        </label>
                        <DatePicker
                            selected={formState.endDateTime}
                            onChange={handleEndDateTimeChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MM/dd/yyyy HH:mm"
                            placeholderText="Select"
                            className="form-control requiredColor"
                            isClearable
                        />
                    </div>
                    <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap" style={{ width: "110px" }}>Duration</label>
                        <input
                            type="text"
                            className="form-control"
                            value={duration}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa' }}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Task Instruction</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Placeholder"
                            value={formState.taskInstruction}
                            onChange={(e) => handleFormState('taskInstruction', e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-end" style={{ gap: "10px" }}>
                        <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={handleNew}
                        >
                            New
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={handleSave}
                            disabled={isDisabled}
                        >
                            {formState?.CaseEffortID ? "Update" : "Save"}
                        </button>
                    </div>
                </div>

                {/* Task List Table */}
                <div className="table-responsive mt-2">
                    <DataTable
                        dense
                        columns={columns}
                        data={caseEffortsData}
                        customStyles={tableCustomStyles}
                        pagination
                        conditionalRowStyles={conditionalRowStyles}
                        responsive
                        noDataComponent={'There are no data to display'}
                        striped
                        onRowClicked={(row) => {
                            handelSetEditData(row);
                        }}
                        persistTableHead={true}
                        highlightOnHover
                        fixedHeader
                    />
                </div>
            </div>
            <ListModal {...{ openPage, setOpenPage }} />
        </>
    )
}

export default CaseEffort