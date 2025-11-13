import React, { useState, useEffect } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { colorLessStyle_Select } from '../Utility/CustomStylesForReact'

function AddTaskModal({ showAddTaskModal, setShowAddTaskModal }) {

    const [taskForm, setTaskForm] = useState({
        task: "",
        assignee: "",
        dueDate: "",
        status: ""
    })

    const handleTaskFormChange = (field, value) => {
        setTaskForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleCloseModal = () => {
        setShowAddTaskModal(false);
        // Remove any existing modal backdrops
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        // Reset body padding if it was modified
        document.body.style.paddingRight = '';
    }

    const handleClearTask = () => {
        setTaskForm({
            task: "",
            assignee: "",
            dueDate: "",
            status: ""
        })
        handleCloseModal();
    }

    const handleAddTask = () => {
        // Handle adding the task here
        handleCloseModal();
        setTaskForm({
            task: "",
            assignee: "",
            dueDate: "",
            status: ""
        });
    }

    // Cleanup effect when component unmounts or modal closes
    useEffect(() => {
        if (!showAddTaskModal) {
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
        }
    }, [showAddTaskModal]);

    return (
        <>
            {showAddTaskModal && (
                <div className="modal fade show" style={{ display: 'block', background: "rgba(0,0,0, 0.5)" }} id="AddCaseTaskModal" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="false">
                    <div className="modal-dialog modal-xl" style={{ maxWidth: "800px" }}>
                        <div className="modal-content">
                            <div className="modal-header bg-green text-white">
                                <h5 className="modal-title">Add Case Task</h5>
                            </div>
                            <div className="modal-body">
                                <fieldset
                                    style={{ border: "1px solid gray" }}
                                    className="tab-form-container"
                                >
                                    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                        <label className="form-label text-nowrap text-end" style={{ marginLeft: "35px" }}>Task</label>
                                        <textarea
                                            className="form-control"
                                            rows={3}
                                            value={taskForm.task}
                                            onChange={(e) => handleTaskFormChange('task', e.target.value)}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                        <label className="form-label text-nowrap text-end" style={{ marginLeft: "8px" }}>Assignee</label>
                                        <Select
                                            isClearable
                                            options={[
                                                { label: "Det. Smith", value: "Det. Smith" },
                                                { label: "Officer Lee", value: "Officer Lee" },
                                                { label: "CSI Kim", value: "CSI Kim" }
                                            ]}
                                            placeholder="Select"
                                            styles={colorLessStyle_Select}
                                            value={taskForm.assignee}
                                            onChange={(e) => handleTaskFormChange('assignee', e)}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                        <label className="form-label text-nowrap text-end" style={{ marginLeft: "8px" }}>Due Date</label>
                                        <DatePicker
                                            name='startDate'
                                            id='startDate'
                                            onChange={(v) => handleTaskFormChange('dueDate', v)}
                                            selected={taskForm.dueDate || ""}
                                            dateFormat="MM/dd/yyyy"
                                            isClearable={!!taskForm.dueDate}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select"
                                            autoComplete="off"
                                            placeholderText="Select Due Date..."
                                        />
                                        <label className="form-label text-nowrap text-end">Status</label>
                                        <Select
                                            isClearable
                                            options={[
                                                { label: "Open", value: "Open" },
                                                { label: "In Progress", value: "In Progress" },
                                                { label: "Completed", value: "Completed" }
                                            ]}
                                            placeholder="Select"
                                            styles={colorLessStyle_Select}
                                            value={taskForm.status}
                                            onChange={(e) => handleTaskFormChange('status', e)}
                                        />
                                    </div>
                                </fieldset>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAddTask}
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddTaskModal