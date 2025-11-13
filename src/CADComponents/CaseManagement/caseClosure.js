import React, { useState } from 'react'
import Select from "react-select";
import { colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import DatePicker from "react-datepicker";

function CaseClosure() {
    // State for Case Disposition & Administrative Actions
    const [caseDisposition, setCaseDisposition] = useState("");
    const [onHold, setOnHold] = useState(false);
    const [dispositionDate, setDispositionDate] = useState(null);
    const [dispositionSummary, setDispositionSummary] = useState("Placeholder");
    const [holdReason, setHoldReason] = useState("Placeholder");
    const [holdDate, setHoldDate] = useState(null);
    const [reExaminationRequired, setReExaminationRequired] = useState(false);

    // State for Retention & Re-Examination Management
    const [reExaminationDate, setReExaminationDate] = useState(null);
    const [purgeDate, setPurgeDate] = useState(null);

    // State for Victim Notification Log
    const [victimNotifications, setVictimNotifications] = useState([
        { victim: "Jane Doe", dateNotified: "10/06/2025 13:00", notifiedBy: "Daniel D" }
    ]);

    const handleSendNotification = () => {
        alert("Send Notification clicked");
    };

    const handleRequestManualPurge = () => {
        alert("Request Manual Purge clicked");
    };

    const handleClear = () => {
        alert("Clear clicked");
    };

    const handleSave = () => {
        alert("Save clicked");
    };

    return (
        <div className="py-3">
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
                        <label className="form-label text-nowrap" style={{ marginLeft: '30px' }}>Case Disposition</label>
                        <Select
                            isClearable
                            options={[]}
                            placeholder="Select"
                            className="w-100"
                            styles={{
                                ...colorLessStyle_Select,
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#fff3cd',
                                    borderColor: '#ffeaa7'
                                })
                            }}
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
                        <label className="form-label text-nowrap">Disposition Date</label>
                        <DatePicker
                            selected={dispositionDate}
                            onChange={(date) => setDispositionDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select"
                            className="form-control"
                            style={{ backgroundColor: '#fff3cd' }}
                        />
                    </div>
                </div>

                <div className="mb-3 d-flex" style={{ gap: '10px' }}>
                    <label className="form-label text-nowrap">Disposition Summary</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={dispositionSummary}
                        onChange={(e) => setDispositionSummary(e.target.value)}
                    />
                </div>

                <div className="row">
                    <div className="col-md-4 d-flex align-items-center" style={{ gap: '10px' }}>
                        <label className="form-label text-nowrap" style={{ marginLeft: '57px' }}>Hold Reason</label>
                        <input
                            type="text"
                            className="form-control"
                            value={holdReason}
                            onChange={(e) => setHoldReason(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 d-flex align-items-center" style={{ gap: '10px' }}>
                        <label className="form-label text-nowrap">Hold Date</label>
                        <DatePicker
                            selected={holdDate}
                            onChange={(date) => setHoldDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-4 d-flex align-items-center" style={{ gap: '10px' }}>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="reExaminationRequired"
                                checked={reExaminationRequired}
                                onChange={(e) => setReExaminationRequired(e.target.checked)}
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
                        className="btn btn-info btn-sm mt-2 "
                        onClick={handleSendNotification}
                        style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
                    >
                        Send Notification
                    </button>
                </div>


                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead style={{ backgroundColor: '#204164', color: 'white' }}>
                            <tr>
                                <th>Victim</th>
                                <th>Date Notified</th>
                                <th>Notified By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {victimNotifications.map((notification, index) => (
                                <tr key={index}>
                                    <td>{notification.victim}</td>
                                    <td>{notification.dateNotified}</td>
                                    <td>{notification.notifiedBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                        />
                    </div>
                    <div className="col-md-5 d-flex align-items-center" style={{ gap: '10px' }}>
                        <label className="form-label text-nowrap">Purge Date</label>
                        <DatePicker
                            selected={purgeDate}
                            onChange={(date) => setPurgeDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Select"
                            className="form-control"
                        />
                    </div>
                    <button
                        className="btn btn-info btn-sm"
                        onClick={handleRequestManualPurge}
                        style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
                    >
                        Request Manual Purge
                    </button>
                </div>
                <div className="d-flex justify-content-end mt-1" style={{ gap: '10px' }}>
                    <button
                        className="btn btn-info btn-sm"
                        onClick={handleClear}
                        style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
                    >
                        Clear
                    </button>
                    <button
                        className="btn btn-info btn-sm"
                        onClick={handleSave}
                        style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
                    >
                        Save
                    </button>
                </div>
            </fieldset>

            {/* Finalization Workflow Section */}
            <fieldset className='my-1'>
                <legend>Finalization Workflow</legend>
                
                {/* Workflow Status Indicators */}
                <div className="mt-3 mb-3">
                    <div className="d-flex p-3 rounded" style={{ backgroundColor: '#e3f2fd' }}>
                        <div className="col-3 d-flex align-items-center pl-3">
                            <input 
                                type="radio" 
                                name="workflowStatus" 
                                id="readyToClose" 
                                className="form-check-input me-2" 
                                defaultChecked
                            />
                            <label htmlFor="readyToClose" className="form-check-label">Ready to Close</label>
                        </div>
                        <div className="col-3 d-flex align-items-center">
                            <input 
                                type="radio" 
                                name="workflowStatus" 
                                id="underReview" 
                                className="form-check-input me-2"
                            />
                            <label htmlFor="underReview" className="form-check-label">Under Review</label>
                        </div>
                        <div className="col-3 d-flex align-items-center">
                            <input 
                                type="radio" 
                                name="workflowStatus" 
                                id="approved" 
                                className="form-check-input me-2"
                            />
                            <label htmlFor="approved" className="form-check-label">Approved</label>
                        </div>
                        <div className="col-3 d-flex align-items-center">
                            <input 
                                type="radio" 
                                name="workflowStatus" 
                                id="closedArchived" 
                                className="form-check-input me-2"
                            />
                            <label htmlFor="closedArchived" className="form-check-label">Closed Archived</label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end mt-3" style={{ gap: '10px' }}>
                    <button
                        className="btn btn-info btn-sm"
                        onClick={() => alert("Submit for Closure Review")}
                        style={{ backgroundColor: '#17a2b8' }}
                    >
                        Submit for Closure Review
                    </button>
                    <button
                        className="btn btn-info btn-sm"
                        onClick={() => alert("Finalize & Archive")}
                        style={{ backgroundColor: '#17a2b8' }}
                    >
                        Finalize & Archive
                    </button>
                </div>
            </fieldset>
        </div>
    )
}

export default CaseClosure