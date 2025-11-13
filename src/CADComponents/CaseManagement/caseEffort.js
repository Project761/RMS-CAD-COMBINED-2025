import React, { useState } from 'react'
import Select from "react-select";
import { colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../Components/Common/Utility';
import DatePicker from "react-datepicker";

function CaseEffort() {
    // Form state variables
    const [taskList, setTaskList] = useState(null)
    const [investigator, setInvestigator] = useState(null)
    const [taskDueDate, setTaskDueDate] = useState(null)
    const [startDateTime, setStartDateTime] = useState(null)
    const [endDateTime, setEndDateTime] = useState(null)
    const [taskInstruction, setTaskInstruction] = useState('')
    const [duration, setDuration] = useState('0 Days 1 Hour 0 Minutes 0 Seconds')

    // Task data
    const [taskData, setTaskData] = useState([
        {
            "TaskList": "A K John",
            "Investigator": "Court",
            "Duration": "0 Days 1 Hour 0 Minutes 0 Seconds",
            "StartDate": "10/10/2025 2:00",
            "EndDate": "10/10/2025 2:00",
            "TaskDueDate": "10/11/2025",
            "Completed": "Yes"
        },
        {
            "TaskList": "A K John",
            "Investigator": "Court",
            "Duration": "0 Days 1 Hour 0 Minutes 0 Seconds",
            "StartDate": "10/10/2025 2:00",
            "EndDate": "10/10/2025 2:00",
            "TaskDueDate": "10/11/2025",
            "Completed": "No/Due"
        }
    ])

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

    // Event handlers
    const handleStartDateTimeChange = (date) => {
        setStartDateTime(date)
        if (date && endDateTime) {
            setDuration(calculateDuration(date, endDateTime))
        }
    }

    const handleEndDateTimeChange = (date) => {
        setEndDateTime(date)
        if (date && startDateTime) {
            setDuration(calculateDuration(startDateTime, date))
        }
    }

    const handleNew = () => {
        setTaskList(null)
        setInvestigator(null)
        setTaskDueDate(null)
        setStartDateTime(null)
        setEndDateTime(null)
        setTaskInstruction('')
        setDuration('0 Days 1 Hour 0 Minutes 0 Seconds')
    }

    const handleSave = () => {
        const newTask = {
            "TaskList": taskList?.label || '',
            "Investigator": investigator?.label || '',
            "Duration": duration,
            "StartDate": startDateTime ? startDateTime.toLocaleDateString('en-US') + ' ' + startDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
            "EndDate": endDateTime ? endDateTime.toLocaleDateString('en-US') + ' ' + endDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
            "TaskDueDate": taskDueDate ? taskDueDate.toLocaleDateString('en-US') : '',
            "Completed": "No/Due"
        }

        setTaskData([...taskData, newTask])
        handleNew() // Clear form after saving
    }

    const columns = [
        {
            name: 'Task List',
            selector: row => row.TaskList,
            sortable: true,
        },
        {
            name: 'Investigator',
            selector: row => row.Investigator,
            sortable: true,
        },
        {
            name: 'Duration',
            selector: row => row.Duration,
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: row => row.StartDate,
            sortable: true,
        },
        {
            name: 'End Date',
            selector: row => row.EndDate,
            sortable: true,
        },
        {
            name: 'Task Due Date',
            selector: row => row.TaskDueDate,
            sortable: true,
        },
        {
            name: 'Completed',
            selector: row => row.Completed,
            cell: row => (
                <span
                    style={{
                        backgroundColor: row.Completed === 'Yes' ? '#22c55e' : '#ef4444',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                    }}
                >
                    {row.Completed}
                </span>
            ),
            sortable: true,
        },
    ];

    return (
        <div className='col-12 col-md-12 col-lg-12 mt-2'>
            {/* Task Management Form */}
            <div className="row">
                <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                    <label className="form-label text-nowrap">Task List</label>
                    <Select
                        isClearable
                        options={[
                            { label: "A K John", value: "A K John" },
                            { label: "B L Smith", value: "B L Smith" },
                            { label: "C M Johnson", value: "C M Johnson" }
                        ]}
                        placeholder="Select"
                        styles={colorLessStyle_Select}
                        value={taskList}
                        onChange={(e) => setTaskList(e)}
                    />
                </div>
                <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                    <label className="form-label text-nowrap">Investigator</label>
                    <Select
                        isClearable
                        options={[
                            { label: "Court", value: "Court" },
                            { label: "Detective", value: "Detective" },
                            { label: "Officer", value: "Officer" }
                        ]}
                        placeholder="Select"
                        styles={colorLessStyle_Select}
                        value={investigator}
                        onChange={(e) => setInvestigator(e)}
                    />
                </div>
                <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                    <label className="form-label text-nowrap">Task Due Date</label>
                    <DatePicker
                        selected={taskDueDate}
                        onChange={(date) => setTaskDueDate(date)}
                        dateFormat="MM/dd/yyyy"
                        placeholderText="Select"
                        className="form-control"
                        isClearable
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                    <label className="form-label text-nowrap">Start DT/TM</label>
                    <DatePicker
                        selected={startDateTime}
                        onChange={handleStartDateTimeChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MM/dd/yyyy HH:mm"
                        placeholderText="Select"
                        className="form-control"
                        isClearable
                    />
                </div>
                <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                    <label className="form-label text-nowrap">End DT/TM</label>
                    <DatePicker
                        selected={endDateTime}
                        onChange={handleEndDateTimeChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MM/dd/yyyy HH:mm"
                        placeholderText="Select"
                        className="form-control"
                        isClearable
                    />
                </div>
                <div className="col-md-4 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                    <label className="form-label text-nowrap">Duration</label>
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
                        value={taskInstruction}
                        onChange={(e) => setTaskInstruction(e.target.value)}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-end" style={{ gap: "10px" }}>
                    <button
                        type="button"
                        className="btn btn-success px-4 py-2"
                        onClick={handleNew}
                    >
                        New
                    </button>
                    <button
                        type="button"
                        className="btn btn-success px-4 py-2"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Task List Table */}
            <div className="table-responsive mt-2">
                <DataTable
                    dense
                    columns={columns}
                    data={taskData}
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
    )
}

export default CaseEffort