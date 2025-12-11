import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { fetchPostData } from '../../../Components/hooks/Api';
import { useSelector, useDispatch } from 'react-redux';
import { getShowingMonthDateYear, tableCustomStyles } from '../../../Components/Common/Utility';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { colorLessStyle_Select } from '../../Utility/CustomStylesForReact';
import { get_AgencyOfficer_Data, getData_DropDown_CaseTask } from '../../../redux/actions/DropDownsData';
import useObjState from '../../../CADHook/useObjState';
import CaseManagementServices from '../../../CADServices/APIs/caseManagement';
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import { Link, useNavigate } from 'react-router-dom';

function CaseEffortsDashboard(props) {
    const { isPreview } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const caseTaskDrpData = useSelector((state) => state.DropDown.caseTaskDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const [filteredData, setFilteredData] = useState([]);
    const [queData, setQueData] = useState([]);
    const [modelStatus, setModelStatus] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (localStoreData) {
            get_Dashboard_Case_Efforts(localStoreData?.AgencyID, localStoreData?.PINID);
            if (caseTaskDrpData?.length === 0) dispatch(getData_DropDown_CaseTask(localStoreData?.AgencyID));
            if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID));
        }
    }, [localStoreData, caseTaskDrpData?.length, agencyOfficerDrpData?.length, dispatch, modelStatus]);

    const get_Dashboard_Case_Efforts = (agencyId, OfficerID) => {
        const val = { 'AgencyID': agencyId, PINID: OfficerID }
        fetchPostData('/CaseManagement/GetDashboardCaseEfforts', val).then((res) => {
            if (res) {
                setQueData(res);
            } else {
                setQueData([]);
            }
        })
    }


    const HandleChange = (e) => {
        const value = e.target.value
        const filteredData = queData.filter(item => item.IncidentNumber?.toLowerCase().includes(value.toLowerCase()) || item.ReportedDate?.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filteredData);
    };

    const onMasterPropClose = () => {
        navigate('/dashboard-page');
    }

    const columns = [
        {
            name: 'Review',
            cell: row => (
                <div className="text-start">
                    <button
                        type="button"
                        className="btn btn-sm btn-dark w-100 mb-1"
                        style={{ backgroundColor: "#001f3f", color: "#fff", fontSize: '11px' }}
                        // data-toggle="modal" data-target="#QueueReportsModal"
                        onClick={() => {
                            setModelStatus(true);
                            setEditData(row);
                        }}
                    >
                        Review
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Incident# ', selector: row => row?.IncidentNumber, sortable: true, width: "110px" },
        { name: 'RMS Case# ', selector: row => row?.RMSCaseNumber, sortable: true, width: "130px" },
        { name: 'Task List', selector: row => row.TaskList, sortable: true, width: "200px" },
        { name: 'Investigator', selector: row => row.InvestigatorName, sortable: true, width: "180px" },
        { name: 'Submitted By', selector: row => row.submittedBy, sortable: true, width: "180px" },
        { name: 'Submitted DT/TM', selector: row => row.CreatedDtTm ? getShowingMonthDateYear(row.CreatedDtTm) : " ", sortable: true, width: "150px" },
        { name: 'Elapsed Days', selector: row => row.ElapsedDay, sortable: true, width: "150px" },

    ];


    return (
        <>
            <div className="col-12 col-sm-12">
                <div className="property-evidence">
                    <div className="text-right mt-2 d-flex w-100" style={{ justifyContent: "space-between", alignItems: "center", }} >
                        <>
                            <div className='d-flex align-items-center ml-0'>
                                {isPreview && (
                                    <span className="mr-2 ">
                                        <svg width="32" height="32" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="128" height="128" rx="100" fill="#D6ECFF" />
                                            <path d="M48 36h44v52H52v8h48V36h-8v44H48z" fill="#E30613" />
                                            <rect x="36" y="24" width="56" height="72" rx="4" fill="#0B2F80" />
                                            <rect x="48" y="38" width="32" height="6" rx="3" fill="white" />
                                            <rect x="48" y="50" width="40" height="6" rx="3" fill="white" />
                                            <rect x="48" y="62" width="40" height="6" rx="3" fill="white" />
                                            <rect x="48" y="74" width="24" height="6" rx="3" fill="white" />
                                        </svg>
                                    </span>
                                )}
                                <span className="fw-bold mb-0 " style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>Case Effort</span>
                            </div>
                        </>
                        {isPreview ? (
                            <div className="d-flex align-items-center">
                                <div className="position-relative mr-3 ">
                                    <input
                                        type="text" name="IncidentNumber" id="IncidentNumber"
                                        className="form-control py-1 new-input" placeholder="Search......"
                                        // value={value.IncidentNumber}
                                        // maxLength={12}
                                        // onKeyDown={handleKeyPress}
                                        onChange={(e) => { HandleChange(e); }}
                                        autoComplete="off"
                                    />
                                </div>
                                <h5 className="mb-0 mr-3" style={{ fontSize: "18px", fontWeight: "600", color: '#334c65' }}>
                                    {filteredData?.length > 0 ? filteredData?.length : queData?.length}
                                </h5>
                                <Link to="/case-efforts-dashboard">
                                    <button className="see-all-btn mr-1 see_all-button" style={{ fontSize: "12px", padding: "4px 8px" }}>See All</button>
                                </Link>
                            </div>
                        ) : (
                            <button
                                className="btn btn-outline-dark mr-3"
                                style={{ backgroundColor: "#001f3f", color: "#fff" }}
                                onClick={onMasterPropClose}
                            >
                                Close
                            </button>
                        )}
                    </div>
                    <div className="pt-2 property-evidence-datatable mt-2">
                        <DataTable
                            className={isPreview ? 'table-responsive_pastdues datatable-grid' : ''}
                            data={filteredData?.length > 0 ? filteredData : queData}
                            dense
                            columns={columns}
                            pagination
                            highlightOnHover
                            customStyles={tableCustomStyles}
                            noDataComponent={'There are no data to display'}
                            fixedHeader
                            persistTableHead
                            fixedHeaderScrollHeight='400px'
                            paginationPerPage={100}
                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                        />
                    </div>
                </div>
            </div>
            {modelStatus && (
                <CaseEffortTaskModal
                    setModelStatus={setModelStatus}
                    editData={editData}
                    caseTaskDrpData={caseTaskDrpData}
                    agencyOfficerDrpData={agencyOfficerDrpData}
                    modelStatus={modelStatus}
                />
            )}
        </>
    )
}

export default CaseEffortsDashboard

const CaseEffortTaskModal = (props) => {
    const { setModelStatus, editData, caseTaskDrpData, agencyOfficerDrpData, modelStatus } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [
        formState,
        setFormState,
        handleFormState,
        clearFormState,
    ] = useObjState({
        taskList: null,
        investigator: null,
        startDateTime: null,
        endDateTime: null,
        taskDueDate: null,
        taskInstruction: '',
        taskCompleted: false,
    });

    useEffect(() => {
        if (editData && caseTaskDrpData && agencyOfficerDrpData) {
            // Pre-populate form with editData if available
            const taskListOption = caseTaskDrpData?.find(item => item?.Code === editData?.TaskListCode || item?.Description === editData?.TaskList);
            const investigatorOption = agencyOfficerDrpData?.find(item => item?.value === editData?.InvestigatorID || item?.label === editData?.InvestigatorName);

            setFormState({
                taskList: taskListOption || null,
                investigator: investigatorOption || null,
                startDateTime: editData?.StartDateTime ? new Date(editData.StartDateTime) : null,
                endDateTime: editData?.EndDateTime ? new Date(editData.EndDateTime) : null,
                taskDueDate: editData?.TaskDueDate ? new Date(editData.TaskDueDate) : null,
                taskInstruction: editData?.TaskInstruction || '',
                taskCompleted: editData?.TaskCompleted || false,
            });
        }
    }, [editData, caseTaskDrpData, agencyOfficerDrpData, setFormState]);

    const handleClose = () => {
        setModelStatus(false);
        clearFormState();
        // Remove any existing modal backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    };

    const handleSave = async () => {
        const payload = {
            "IsCompleted": formState?.taskCompleted,
            "ID": editData?.CaseEffortID,
            "ModifiedByUserFK": localStoreData?.PINID,
        }
        const res = await CaseManagementServices.updateDashboardCaseEfforts(payload);
        if (res?.status === 200) {
            toastifySuccess("Data Updated Successfully");
            //   refetchDashboardCaseEffortsData();
            handleClose();

        } else {
            toastifyError("Failed to update data");
            handleClose();
        }
    };

    // Cleanup effect when component unmounts or modal closes
    useEffect(() => {
        if (!modelStatus) {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
        }
    }, [modelStatus]);

    return (
        <div className="modal fade show" style={{ display: 'block', background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content p-2 px-4" style={{ overflowY: "auto" }}>
                    <div className="d-flex justify-content-between mb-3">
                        <h5 className="fw-bold mb-0">Case Effort Task</h5>
                        <button
                            className="btn-close b-none bg-transparent"
                            onClick={handleClose}
                            style={{ fontSize: '20px', fontWeight: 'bold' }}
                        >
                            ×
                        </button>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <label className="form-label fw-bold mb-0 text-right" style={{ minWidth: '100px' }}>Task List</label>
                                <Select
                                    isClearable
                                    options={caseTaskDrpData}
                                    placeholder="Select"
                                    styles={colorLessStyle_Select}
                                    value={formState.taskList}
                                    isDisabled
                                    getOptionLabel={(v) => `${v?.Code} | ${v?.Description}`}
                                    getOptionValue={(v) => v?.Code}
                                    formatOptionLabel={(option, { context }) => {
                                        return context === 'menu'
                                            ? `${option?.Code} | ${option?.Description}`
                                            : option?.Description;
                                    }}
                                    onChange={(e) => handleFormState('taskList', e)}
                                    className="py-1 new-input"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <label className="form-label fw-bold mb-0 text-right" style={{ minWidth: '100px' }}>Investigator</label>
                                <Select
                                    isClearable
                                    options={agencyOfficerDrpData}
                                    placeholder="Select"
                                    styles={colorLessStyle_Select}
                                    value={formState.investigator}
                                    isDisabled
                                    onChange={(e) => handleFormState('investigator', e)}
                                    className="py-1 new-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <label className="form-label fw-bold mb-0 text-right" style={{ minWidth: '100px' }}>Start DT/TM</label>
                                <DatePicker
                                    selected={formState.startDateTime}
                                    onChange={(date) => handleFormState('startDateTime', date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    placeholderText="Select"
                                    className="form-control py-1 new-input"
                                    isClearable
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <label className="form-label fw-bold mb-0 text-right" style={{ minWidth: '100px' }}>End DT/TM</label>
                                <DatePicker
                                    selected={formState.endDateTime}
                                    onChange={(date) => handleFormState('endDateTime', date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    placeholderText="Select"
                                    className="form-control py-1 new-input"
                                    isClearable
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <label className="form-label fw-bold mb-0 text-right" style={{ minWidth: '120px' }}>Task Due Date</label>
                                <DatePicker
                                    selected={formState.taskDueDate}
                                    onChange={(date) => handleFormState('taskDueDate', date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    placeholderText="Select"
                                    className="form-control py-1 new-input"
                                    isClearable
                                    disabled
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '4px' }}>
                        <div className="col-12">
                            <div className="d-flex align-items-start" style={{ gap: '10px' }}>
                                <label className="form-label fw-bold mb-0 text-right" style={{ minWidth: '100px', paddingTop: '8px' }}>Task Instruction</label>
                                <div className="flex-grow-1">
                                    <textarea
                                        className="form-control py-1 new-input"
                                        rows="3"
                                        value={formState.taskInstruction}
                                        onChange={(e) => handleFormState('taskInstruction', e.target.value)}
                                        placeholder="Enter task instruction..."
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '4px' }}>
                        <div className="col-12">
                            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                <label className="form-label fw-bold mb-0 text-right" style={{ minWidth: '100px' }}>Task Completed</label>
                                <input
                                    type="checkbox"
                                    checked={formState.taskCompleted}
                                    onChange={(e) => handleFormState('taskCompleted', e.target.checked)}
                                    style={{ width: '20px', height: '20px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-1" style={{ gap: '10px' }}>
                        <button
                            type="button"
                            className="btn"
                            onClick={handleClose}
                            style={{ backgroundColor: '#17a2b8', color: '#fff', borderColor: '#17a2b8' }}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={handleSave}
                            style={{ backgroundColor: '#17a2b8', color: '#fff', borderColor: '#17a2b8' }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};