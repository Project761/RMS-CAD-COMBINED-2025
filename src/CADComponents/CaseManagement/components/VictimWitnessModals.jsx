import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { coloredStyle_Select } from '../../Utility/CustomStylesForReact';

export const VictimModal = ({
    show,
    victimFormState,
    victimErrorState,
    handleVictimFormState,
    contactMethodOptions,
    victimNameOptions,
    restrictionOptions,
    riskLevelOptions,
    riskCategoryOptions,
    serviceOptions,
    contactOutcomeOptions,
    toggleCheckboxGroup,
    onClose,
    onSave,
}) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '760px' }}>
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <div>
                            <h5 className="modal-title" style={{ fontWeight: 600 }}>Add Victim Interaction</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Enter the details for the new victim interaction</p>
                        </div>
                        <button type="button" className="close" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px' }}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Victim Name <span className="text-danger">*</span></label>
                                <Select
                                    options={victimNameOptions}
                                    placeholder="Select from Master Name"
                                    styles={coloredStyle_Select}
                                    value={victimFormState.victimName}
                                    onChange={(option) => handleVictimFormState('victimName', option)}
                                />
                                {victimErrorState.victimName && <small className="text-danger">Required</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Preferred Contact Method <span className="text-danger">*</span></label>
                                <Select
                                    options={contactMethodOptions}
                                    placeholder="Select method"
                                    styles={coloredStyle_Select}
                                    value={victimFormState.contactMethod}
                                    onChange={(option) => handleVictimFormState('contactMethod', option)}
                                />
                                {victimErrorState.contactMethod && <small className="text-danger">Required</small>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Primary Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="(555) 123-4567"
                                    value={victimFormState.primaryPhone}
                                    onChange={(e) => handleVictimFormState('primaryPhone', e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="victim@example.com"
                                    value={victimFormState.emailAddress}
                                    onChange={(e) => handleVictimFormState('emailAddress', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Contact Restrictions</label>
                                <Select
                                    options={restrictionOptions}
                                    placeholder="Select restriction"
                                    styles={coloredStyle_Select}
                                    value={victimFormState.contactRestrictions}
                                    onChange={(option) => handleVictimFormState('contactRestrictions', option)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Safety Risk Level <span className="text-danger">*</span></label>
                                <Select
                                    options={riskLevelOptions}
                                    placeholder="Select risk level"
                                    styles={coloredStyle_Select}
                                    value={victimFormState.safetyRiskLevel}
                                    onChange={(option) => handleVictimFormState('safetyRiskLevel', option)}
                                />
                                {victimErrorState.safetyRiskLevel && <small className="text-danger">Required</small>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last Contact Date</label>
                                <DatePicker
                                    selected={victimFormState.lastContactDate}
                                    onChange={(date) => handleVictimFormState('lastContactDate', date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="dd-mm-yyyy"
                                    className="form-control"
                                    isClearable
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Safety Notes</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Describe any safety concerns, threats, protective orders, etc."
                                value={victimFormState.safetyNotes}
                                onChange={(e) => handleVictimFormState('safetyNotes', e.target.value)}
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Risk Categories</label>
                                <div className="row">
                                    {riskCategoryOptions.map((option) => {
                                        const optionId = `risk-${option.replace(/\s+/g, '-').toLowerCase()}`;
                                        const isChecked = (victimFormState.riskCategories || []).includes(option);
                                        return (
                                            <div className="col-md-4" key={optionId}>
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={optionId}
                                                        checked={isChecked}
                                                        onChange={() => toggleCheckboxGroup('riskCategories', option)}
                                                    />
                                                    <label className="form-check-label" htmlFor={optionId}>
                                                        {option}
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Services Referred</label>
                                <div className="row">
                                    {serviceOptions.map((option) => {
                                        const optionId = `service-${option.replace(/\s+/g, '-').toLowerCase()}`;
                                        const isChecked = (victimFormState.servicesReferred || []).includes(option);
                                        return (
                                            <div className="col-md-4" key={optionId}>
                                                <div className="form-check mb-2">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={optionId}
                                                        checked={isChecked}
                                                        onChange={() => toggleCheckboxGroup('servicesReferred', option)}
                                                    />
                                                    <label className="form-check-label" htmlFor={optionId}>
                                                        {option}
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Next Scheduled Contact</label>
                                <DatePicker
                                    selected={victimFormState.nextScheduledContact}
                                    onChange={(date) => handleVictimFormState('nextScheduledContact', date)}
                                    dateFormat="dd-MM-yyyy HH:mm"
                                    placeholderText="dd-mm-yyyy --:--"
                                    className="form-control"
                                    showTimeSelect
                                    timeIntervals={15}
                                    isClearable
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last Contact Outcome</label>
                                <Select
                                    options={contactOutcomeOptions}
                                    placeholder="Select outcome"
                                    styles={coloredStyle_Select}
                                    value={victimFormState.lastContactOutcome}
                                    onChange={(option) => handleVictimFormState('lastContactOutcome', option)}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Additional Notes</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Any additional information..."
                                value={victimFormState.additionalNotes}
                                onChange={(e) => handleVictimFormState('additionalNotes', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onSave}>
                            Save Victim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const WitnessModal = ({
    show,
    witnessFormState,
    witnessErrorState,
    handleWitnessFormState,
    witnessNameOptions,
    witnessTypeOptions,
    reliabilityOptions,
    cooperationOptions,
    statementStatusOptions,
    serviceMethodOptions,
    appearanceStatusOptions,
    onClose,
    onSave,
}) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '760px' }}>
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <div>
                            <h5 className="modal-title" style={{ fontWeight: 600 }}>Add Witness Record</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Enter the details for the new witness</p>
                        </div>
                        <button type="button" className="close" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px' }}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Witness Name <span className="text-danger">*</span></label>
                                <Select
                                    options={witnessNameOptions}
                                    placeholder="Select from Master Name"
                                    styles={coloredStyle_Select}
                                    value={witnessFormState.witnessName}
                                    onChange={(option) => handleWitnessFormState('witnessName', option)}
                                />
                                {witnessErrorState.witnessName && <small className="text-danger">Required</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Witness Type <span className="text-danger">*</span></label>
                                <Select
                                    options={witnessTypeOptions}
                                    placeholder="Select type"
                                    styles={coloredStyle_Select}
                                    value={witnessFormState.witnessType}
                                    onChange={(option) => handleWitnessFormState('witnessType', option)}
                                />
                                {witnessErrorState.witnessType && <small className="text-danger">Required</small>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Contact Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="(555) 123-4567"
                                    value={witnessFormState.contactPhone}
                                    onChange={(e) => handleWitnessFormState('contactPhone', e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="witness@example.com"
                                    value={witnessFormState.emailAddress}
                                    onChange={(e) => handleWitnessFormState('emailAddress', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Reliability Rating</label>
                                <Select
                                    options={reliabilityOptions}
                                    placeholder="Select rating"
                                    styles={coloredStyle_Select}
                                    value={witnessFormState.reliabilityRating}
                                    onChange={(option) => handleWitnessFormState('reliabilityRating', option)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Cooperation Level</label>
                                <Select
                                    options={cooperationOptions}
                                    placeholder="Select level"
                                    styles={coloredStyle_Select}
                                    value={witnessFormState.cooperationLevel}
                                    onChange={(option) => handleWitnessFormState('cooperationLevel', option)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Statement Status</label>
                                <Select
                                    options={statementStatusOptions}
                                    placeholder="Select status"
                                    styles={coloredStyle_Select}
                                    value={witnessFormState.statementStatus}
                                    onChange={(option) => handleWitnessFormState('statementStatus', option)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Statement Date</label>
                                <DatePicker
                                    selected={witnessFormState.statementDate}
                                    onChange={(date) => handleWitnessFormState('statementDate', date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="dd-mm-yyyy"
                                    className="form-control"
                                    isClearable
                                />
                            </div>
                        </div>
                        <hr />
                        <h6 className="fw-bold mb-3">Subpoena & Court Information</h6>
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="subpoenaIssued"
                                checked={witnessFormState.subpoenaIssued}
                                onChange={(e) => handleWitnessFormState('subpoenaIssued', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="subpoenaIssued">
                                Subpoena Issued
                            </label>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Subpoena Date</label>
                                <DatePicker
                                    selected={witnessFormState.subpoenaDate}
                                    onChange={(date) => handleWitnessFormState('subpoenaDate', date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="dd-mm-yyyy"
                                    className="form-control"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Subpoena Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="SUB-2024-00000"
                                    value={witnessFormState.subpoenaNumber}
                                    onChange={(e) => handleWitnessFormState('subpoenaNumber', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Service Method</label>
                                <Select
                                    options={serviceMethodOptions}
                                    placeholder="Select method"
                                    styles={coloredStyle_Select}
                                    value={witnessFormState.serviceMethod}
                                    onChange={(option) => handleWitnessFormState('serviceMethod', option)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Court Appearance Date</label>
                                <DatePicker
                                    selected={witnessFormState.courtAppearanceDate}
                                    onChange={(date) => handleWitnessFormState('courtAppearanceDate', date)}
                                    dateFormat="dd-MM-yyyy HH:mm"
                                    placeholderText="dd-mm-yyyy --:--"
                                    className="form-control"
                                    showTimeSelect
                                    timeIntervals={15}
                                    isClearable
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Appearance Status</label>
                                <Select
                                    options={appearanceStatusOptions}
                                    placeholder="Select status"
                                    styles={coloredStyle_Select}
                                    value={witnessFormState.appearanceStatus}
                                    onChange={(option) => handleWitnessFormState('appearanceStatus', option)}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Special Needs / Accommodations</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Interpreter needed, disability accommodations, security concerns, etc."
                                value={witnessFormState.specialNeeds}
                                onChange={(e) => handleWitnessFormState('specialNeeds', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Additional information about the witness..."
                                value={witnessFormState.notes}
                                onChange={(e) => handleWitnessFormState('notes', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onSave}>
                            Save Witness
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NotificationModal = ({
    show,
    notificationFormState,
    notificationErrorState,
    handleNotificationFormState,
    victimNameOptions,
    notificationTypeOptions,
    notificationMethodOptions,
    notificationOutcomeOptions,
    legalRequirementOptions,
    toggleLegalRequirement,
    onClose,
    onSave,
}) => {
    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ maxWidth: '700px' }}>
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <div>
                            <h5 className="modal-title" style={{ fontWeight: 600 }}>Log Victim Notification</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Capture the details of the notification</p>
                        </div>
                        <button type="button" className="close" onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '24px' }}>
                            &times;
                        </button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Notification Date/Time <span className="text-danger">*</span></label>
                                <DatePicker
                                    selected={notificationFormState.notificationDateTime}
                                    onChange={(date) => handleNotificationFormState('notificationDateTime', date)}
                                    dateFormat="dd-MM-yyyy HH:mm"
                                    placeholderText="dd-mm-yyyy --:--"
                                    className="form-control"
                                    showTimeSelect
                                    timeIntervals={15}
                                    isClearable
                                />
                                {notificationErrorState.notificationDateTime && <small className="text-danger">Required</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Recipient <span className="text-danger">*</span></label>
                                <Select
                                    options={victimNameOptions}
                                    placeholder="Select victim"
                                    styles={coloredStyle_Select}
                                    value={notificationFormState.recipient}
                                    onChange={(option) => handleNotificationFormState('recipient', option)}
                                />
                                {notificationErrorState.recipient && <small className="text-danger">Required</small>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Notification Type <span className="text-danger">*</span></label>
                                <Select
                                    options={notificationTypeOptions}
                                    placeholder="Select type"
                                    styles={coloredStyle_Select}
                                    value={notificationFormState.notificationType}
                                    onChange={(option) => handleNotificationFormState('notificationType', option)}
                                />
                                {notificationErrorState.notificationType && <small className="text-danger">Required</small>}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Outcome <span className="text-danger">*</span></label>
                                <Select
                                    options={notificationOutcomeOptions}
                                    placeholder="Select outcome"
                                    styles={coloredStyle_Select}
                                    value={notificationFormState.outcome}
                                    onChange={(option) => handleNotificationFormState('outcome', option)}
                                />
                                {notificationErrorState.outcome && <small className="text-danger">Required</small>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Notification Method <span className="text-danger">*</span></label>
                                <Select
                                    options={notificationMethodOptions}
                                    placeholder="Select method"
                                    styles={coloredStyle_Select}
                                    value={notificationFormState.notificationMethod}
                                    onChange={(option) => handleNotificationFormState('notificationMethod', option)}
                                />
                                {notificationErrorState.notificationMethod && <small className="text-danger">Required</small>}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Subject/Summary <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Brief description of notification content"
                                value={notificationFormState.subject}
                                onChange={(e) => handleNotificationFormState('subject', e.target.value)}
                            />
                            {notificationErrorState.subject && <small className="text-danger">Required</small>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Detailed Message/Notes</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Full details of what was communicated to the victim..."
                                value={notificationFormState.detailedMessage}
                                onChange={(e) => handleNotificationFormState('detailedMessage', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Victim Response/Feedback</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Record any questions, concerns, or feedback from the victim..."
                                value={notificationFormState.victimResponse}
                                onChange={(e) => handleNotificationFormState('victimResponse', e.target.value)}
                            />
                        </div>
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="followUpRequired"
                                checked={notificationFormState.followUpRequired}
                                onChange={(e) => handleNotificationFormState('followUpRequired', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="followUpRequired">
                                Follow-up Required
                            </label>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Follow-up Date</label>
                                <DatePicker
                                    selected={notificationFormState.followUpDate}
                                    onChange={(date) => handleNotificationFormState('followUpDate', date)}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="dd-mm-yyyy"
                                    className="form-control"
                                    isClearable
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Notified By</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={notificationFormState.notifiedBy || ''}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Legal Notification Requirements</label>
                            <div className="row">
                                {legalRequirementOptions.map((option) => {
                                    const optionId = `legal-${option.replace(/\s+/g, '-').toLowerCase()}`;
                                    const isChecked = (notificationFormState.legalRequirements || []).includes(option);
                                    return (
                                        <div className="col-md-6" key={optionId}>
                                            <div className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={optionId}
                                                    checked={isChecked}
                                                    onChange={() => toggleLegalRequirement(option)}
                                                />
                                                <label className="form-check-label" htmlFor={optionId}>
                                                    {option}
                                                </label>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={onSave}>
                            Save Notification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

