import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../Components/Common/Utility';
import useObjState from '../../CADHook/useObjState';
import { VictimModal, WitnessModal, NotificationModal } from './components/VictimWitnessModals';

const VictimManagementSection = ({ data, columns, onAddClick }) => (
    <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Victim Management</h5>
            <button className="btn btn-primary btn-sm" onClick={onAddClick}>
                + Add Victim Interaction
            </button>
        </div>
        <DataTable
            columns={columns}
            data={data}
            dense
            customStyles={tableCustomStyles}
            responsive
            highlightOnHover
            striped
            noHeader
            noDataComponent={'No records found'}
        />
    </div>
);

const WitnessManagementSection = ({ data, columns, onAddClick }) => (
    <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Witness Management</h5>
            <button className="btn btn-primary btn-sm" onClick={onAddClick}>
                + Add Witness Record
            </button>
        </div>
        <DataTable
            columns={columns}
            data={data}
            dense
            customStyles={tableCustomStyles}
            responsive
            highlightOnHover
            striped
            noHeader
            noDataComponent={'No records found'}
        />
    </div>
);

const VictimNotificationLogSection = ({ data, columns, onAddClick }) => (
    <div className="bg-white p-3 rounded shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Victim Notification Log</h5>
            <button className="btn btn-primary btn-sm" onClick={onAddClick}>
                + Log Notification
            </button>
        </div>
        <DataTable
            columns={columns}
            data={data}
            dense
            customStyles={tableCustomStyles}
            responsive
            highlightOnHover
            striped
            noHeader
            noDataComponent={'No records found'}
        />
    </div>
);

function VictimWitness() {
    const [showVictimModal, setShowVictimModal] = useState(false);
    const [showWitnessModal, setShowWitnessModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    const [victimFormState, setVictimFormState, handleVictimFormState, clearVictimFormState] = useObjState({
        victimName: null,
        contactMethod: null,
        primaryPhone: '',
        emailAddress: '',
        contactRestrictions: null,
        safetyRiskLevel: null,
        lastContactDate: null,
        safetyNotes: '',
        riskCategories: [],
        servicesReferred: [],
        nextScheduledContact: null,
        lastContactOutcome: null,
        additionalNotes: '',
    });

    const [victimErrorState, , handleVictimErrorState, clearVictimErrorState] = useObjState({
        victimName: false,
        contactMethod: false,
        safetyRiskLevel: false,
    });

    const [witnessFormState, , handleWitnessFormState, clearWitnessFormState] = useObjState({
        witnessName: null,
        witnessType: null,
        contactPhone: '',
        emailAddress: '',
        reliabilityRating: null,
        cooperationLevel: null,
        statementStatus: null,
        statementDate: null,
        subpoenaIssued: false,
        subpoenaDate: null,
        subpoenaNumber: '',
        serviceMethod: null,
        courtAppearanceDate: null,
        appearanceStatus: null,
        specialNeeds: '',
        notes: '',
    });

    const [witnessErrorState, , handleWitnessErrorState, clearWitnessErrorState] = useObjState({
        witnessName: false,
        witnessType: false,
    });

    const [notificationFormState, , handleNotificationFormState, clearNotificationFormState] = useObjState({
        notificationDateTime: null,
        recipient: null,
        notificationType: null,
        notificationMethod: null,
        outcome: null,
        subject: '',
        detailedMessage: '',
        victimResponse: '',
        followUpRequired: false,
        followUpDate: null,
        notifiedBy: 'ADMIN1: ADMIN TEST',
        legalRequirements: [],
    });

    const [notificationErrorState, , handleNotificationErrorState, clearNotificationErrorState] = useObjState({
        notificationDateTime: false,
        recipient: false,
        notificationType: false,
        notificationMethod: false,
        outcome: false,
        subject: false,
    });

    const badgeStyles = {
        base: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '999px',
            padding: '4px 12px',
        },
        variants: {
            high: { backgroundColor: '#fee2e2', color: '#b91c1c' },
            medium: { backgroundColor: '#fef3c7', color: '#92400e' },
            low: { backgroundColor: '#e0f2fe', color: '#0f172a' },
            default: { backgroundColor: '#e2e8f0', color: '#1e293b' },
            navy: { backgroundColor: '#0b3d91', color: '#fff' },
        },
    };

    const renderBadge = (label, variant = 'default') => (
        <span style={{ ...badgeStyles.base, ...badgeStyles.variants[variant] }}>{label}</span>
    );

    const victimData = [
        {
            id: 1,
            name: 'Jane Smith',
            contactMethod: 'Phone',
            safetyConcerns: renderBadge('High', 'high'),
            servicesProvided: 'Advocacy, Counseling',
            lastContactDate: '2024-11-15',
            lastOutcome: renderBadge('Reached', 'navy'),
            nextFollowUp: '2024-12-01 10:00',
            restrictions: 'None',
        },
        {
            id: 2,
            name: 'Robert Johnson',
            contactMethod: 'Email',
            safetyConcerns: renderBadge('Low', 'low'),
            servicesProvided: 'None',
            lastContactDate: '2024-11-10',
            lastOutcome: renderBadge('Left message', 'default'),
            nextFollowUp: '2024-11-25 14:00',
            restrictions: 'Third-party only',
        },
    ];

    const victimColumns = [
        {
            name: 'Victim Name',
            selector: row => row.name,
            cell: row => <span className="fw-bold">{row.name}</span>,
            sortable: true,
        },
        {
            name: 'Contact Method',
            selector: row => row.contactMethod,
        },
        {
            name: 'Safety Concerns',
            selector: row => row.safetyConcerns,
        },
        {
            name: 'Services Provided',
            selector: row => row.servicesProvided,
        },
        {
            name: 'Last Contact Date',
            selector: row => row.lastContactDate,
        },
        {
            name: 'Last Outcome',
            selector: row => row.lastOutcome,
        },
        {
            name: 'Next Follow-Up',
            selector: row => row.nextFollowUp,
        },
        {
            name: 'Restrictions',
            selector: row => row.restrictions,
        },
        {
            name: 'Actions',
            cell: () => (
                <div className="d-flex" style={{ gap: '12px' }}>
                    <button className="btn btn-link p-0 text-primary">Edit</button>
                    <button className="btn btn-link p-0 text-danger">Delete</button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
    ];

    const witnessData = [
        {
            id: 1,
            name: 'Michael Davis',
            type: renderBadge('Eyewitness', 'default'),
            reliability: renderBadge('High', 'navy'),
            subpoenaIssued: renderBadge('Yes', 'navy'),
            courtDate: '2024-12-15',
            appearanceStatus: renderBadge('Scheduled', 'default'),
            notes: 'Key witness to incident',
        },
        {
            id: 2,
            name: 'Dr. Sarah Williams',
            type: renderBadge('Expert', 'default'),
            reliability: renderBadge('High', 'navy'),
            subpoenaIssued: renderBadge('Yes', 'navy'),
            courtDate: '2024-12-15',
            appearanceStatus: renderBadge('Appeared', 'navy'),
            notes: 'Forensic expert testimony',
        },
        {
            id: 3,
            name: 'Anonymous Tipster',
            type: renderBadge('Confidential', 'default'),
            reliability: renderBadge('Medium', 'medium'),
            subpoenaIssued: renderBadge('No', 'default'),
            courtDate: 'N/A',
            appearanceStatus: renderBadge('N/A', 'default'),
            notes: 'Identity protected',
        },
    ];

    const witnessColumns = [
        {
            name: 'Witness Name',
            selector: row => row.name,
            cell: row => <span className="fw-bold">{row.name}</span>,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.type,
        },
        {
            name: 'Reliability',
            selector: row => row.reliability,
        },
        {
            name: 'Subpoena Issued',
            selector: row => row.subpoenaIssued,
        },
        {
            name: 'Court Date',
            selector: row => row.courtDate,
        },
        {
            name: 'Appearance Status',
            selector: row => row.appearanceStatus,
        },
        {
            name: 'Notes',
            selector: row => row.notes,
            wrap: true,
        },
        {
            name: 'Actions',
            cell: () => (
                <div className="d-flex" style={{ gap: '12px' }}>
                    <button className="btn btn-link p-0 text-primary">Edit</button>
                    <button className="btn btn-link p-0 text-primary">Subpoena</button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        },
    ];

    const notificationData = [
        {
            id: 1,
            dateTime: '2024-11-15 09:30',
            recipient: 'Jane Smith',
            type: 'Case Status Update',
            method: renderBadge('Phone', 'default'),
            outcome: renderBadge('Delivered', 'navy'),
        },
        {
            id: 2,
            dateTime: '2024-11-10 14:15',
            recipient: 'Robert Johnson',
            type: 'Court Date Notification',
            method: renderBadge('Email', 'default'),
            outcome: renderBadge('Delivered', 'navy'),
        },
    ];

    const notificationColumns = [
        { name: 'Date/Time', selector: row => row.dateTime },
        { name: 'Recipient', selector: row => row.recipient },
        { name: 'Notification Type', selector: row => row.type },
        { name: 'Method', selector: row => row.method },
        { name: 'Outcome', selector: row => row.outcome },
        {
            name: 'Actions',
            cell: () => (
                <button className="btn btn-link p-0 text-primary">View Details</button>
            ),
            ignoreRowClick: true,
        },
    ];

    const contactMethodOptions = [
        { value: 'Phone', label: 'Phone' },
        { value: 'Email', label: 'Email' },
        { value: 'In-Person', label: 'In-Person' },
        { value: 'Video Call', label: 'Video Call' },
    ];

    const victimNameOptions = [
        { value: 'jane-smith', label: 'Jane Smith' },
        { value: 'robert-johnson', label: 'Robert Johnson' },
        { value: 'alex-taylor', label: 'Alex Taylor' },
    ];

    const witnessNameOptions = [
        { value: 'michael-davis', label: 'Michael Davis' },
        { value: 'sarah-williams', label: 'Dr. Sarah Williams' },
        { value: 'anonymous-tipster', label: 'Anonymous Tipster' },
    ];

    const witnessTypeOptions = [
        { value: 'eyewitness', label: 'Eyewitness' },
        { value: 'expert', label: 'Expert' },
        { value: 'confidential', label: 'Confidential' },
    ];

    const reliabilityOptions = [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
    ];

    const cooperationOptions = [
        { value: 'full', label: 'Full' },
        { value: 'partial', label: 'Partial' },
        { value: 'refused', label: 'Refused' },
    ];

    const statementStatusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'scheduled', label: 'Scheduled' },
    ];

    const serviceMethodOptions = [
        { value: 'in-person', label: 'In-Person' },
        { value: 'mail', label: 'Mail' },
        { value: 'email', label: 'Email' },
    ];

    const appearanceStatusOptions = [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'appeared', label: 'Appeared' },
        { value: 'no-show', label: 'No Show' },
        { value: 'na', label: 'N/A' },
    ];

    const restrictionOptions = [
        { value: 'none', label: 'None' },
        { value: 'third-party', label: 'Third-party only' },
        { value: 'no-contact', label: 'No contact order' },
    ];

    const riskLevelOptions = [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
    ];

    const contactOutcomeOptions = [
        { value: 'reached', label: 'Reached' },
        { value: 'left-message', label: 'Left Message' },
        { value: 'no-answer', label: 'No Answer' },
    ];

    const notificationTypeOptions = [
        { value: 'case-status', label: 'Case Status Update' },
        { value: 'court-date', label: 'Court Date Notification' },
        { value: 'safety-update', label: 'Safety Update' },
    ];

    const notificationMethodOptions = [
        { value: 'phone', label: 'Phone' },
        { value: 'email', label: 'Email' },
        { value: 'in-person', label: 'In-Person' },
    ];

    const notificationOutcomeOptions = [
        { value: 'delivered', label: 'Delivered' },
        { value: 'left-message', label: 'Left Message' },
        { value: 'failed', label: 'Failed' },
    ];

    const legalRequirementOptions = [
        'Marsy\'s Law Compliant',
        'Timely Notification',
        'State Notification Law Met',
        'Properly Documented',
    ];

    const riskCategoryOptions = [
        'Domestic Violence',
        'Weapon Access',
        'Stalking',
        'Child Victim',
        'Threats Made',
        'Elder/Vulnerable Adult',
    ];

    const serviceOptions = [
        'Victim Advocacy',
        'Legal Services',
        'Shelter',
        'Medical Services',
        'Counseling',
        'Financial Assistance',
    ];

    const toggleCheckboxGroup = (field, value) => {
        setVictimFormState((prev) => {
            const currentValues = prev[field] || [];
            const exists = currentValues.includes(value);
            const updatedValues = exists
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];
            return { ...prev, [field]: updatedValues };
        });
    };

    const toggleLegalRequirement = (value) => {
        const current = notificationFormState.legalRequirements || [];
        const exists = current.includes(value);
        const updated = exists ? current.filter(item => item !== value) : [...current, value];
        handleNotificationFormState('legalRequirements', updated);
    };

    const handleOpenVictimModal = () => {
        setShowVictimModal(true);
        clearVictimFormState();
        clearVictimErrorState();
    };

    const handleCloseVictimModal = () => {
        setShowVictimModal(false);
        clearVictimFormState();
        clearVictimErrorState();
    };

    const handleSaveVictim = () => {
        let hasError = false;
        if (!victimFormState.victimName) {
            handleVictimErrorState('victimName', true);
            hasError = true;
        } else {
            handleVictimErrorState('victimName', false);
        }

        if (!victimFormState.contactMethod) {
            handleVictimErrorState('contactMethod', true);
            hasError = true;
        } else {
            handleVictimErrorState('contactMethod', false);
        }

        if (!victimFormState.safetyRiskLevel) {
            handleVictimErrorState('safetyRiskLevel', true);
            hasError = true;
        } else {
            handleVictimErrorState('safetyRiskLevel', false);
        }

        if (hasError) return;

        console.log('Saving victim interaction:', victimFormState);
        handleCloseVictimModal();
    };

    const handleOpenWitnessModal = () => {
        setShowWitnessModal(true);
        clearWitnessFormState();
        clearWitnessErrorState();
    };

    const handleCloseWitnessModal = () => {
        setShowWitnessModal(false);
        clearWitnessFormState();
        clearWitnessErrorState();
    };

    const handleSaveWitness = () => {
        let hasError = false;
        if (!witnessFormState.witnessName) {
            handleWitnessErrorState('witnessName', true);
            hasError = true;
        } else {
            handleWitnessErrorState('witnessName', false);
        }

        if (!witnessFormState.witnessType) {
            handleWitnessErrorState('witnessType', true);
            hasError = true;
        } else {
            handleWitnessErrorState('witnessType', false);
        }

        if (hasError) return;

        console.log('Saving witness record:', witnessFormState);
        handleCloseWitnessModal();
    };

    const handleOpenNotificationModal = () => {
        setShowNotificationModal(true);
        clearNotificationFormState();
        clearNotificationErrorState();
        handleNotificationFormState('notifiedBy', 'ADMIN1: ADMIN TEST');
    };

    const handleCloseNotificationModal = () => {
        setShowNotificationModal(false);
        clearNotificationFormState();
        clearNotificationErrorState();
    };

    const handleSaveNotification = () => {
        let hasError = false;
        ['notificationDateTime', 'recipient', 'notificationType', 'notificationMethod', 'outcome', 'subject'].forEach((field) => {
            if (!notificationFormState[field]) {
                handleNotificationErrorState(field, true);
                hasError = true;
            } else {
                handleNotificationErrorState(field, false);
            }
        });

        if (hasError) return;

        console.log('Saving victim notification:', notificationFormState);
        handleCloseNotificationModal();
    };

    return (
        <>
            <div className="container-fluid">
                <VictimManagementSection
                    data={victimData}
                    columns={victimColumns}
                    onAddClick={handleOpenVictimModal}
                />
                <WitnessManagementSection
                    data={witnessData}
                    columns={witnessColumns}
                    onAddClick={handleOpenWitnessModal}
                />
                <VictimNotificationLogSection
                    data={notificationData}
                    columns={notificationColumns}
                    onAddClick={handleOpenNotificationModal}
                />
            </div>

            <VictimModal
                show={showVictimModal}
                victimFormState={victimFormState}
                victimErrorState={victimErrorState}
                handleVictimFormState={handleVictimFormState}
                contactMethodOptions={contactMethodOptions}
                victimNameOptions={victimNameOptions}
                restrictionOptions={restrictionOptions}
                riskLevelOptions={riskLevelOptions}
                riskCategoryOptions={riskCategoryOptions}
                serviceOptions={serviceOptions}
                contactOutcomeOptions={contactOutcomeOptions}
                toggleCheckboxGroup={toggleCheckboxGroup}
                onClose={handleCloseVictimModal}
                onSave={handleSaveVictim}
            />

            <WitnessModal
                show={showWitnessModal}
                witnessFormState={witnessFormState}
                witnessErrorState={witnessErrorState}
                handleWitnessFormState={handleWitnessFormState}
                witnessNameOptions={witnessNameOptions}
                witnessTypeOptions={witnessTypeOptions}
                reliabilityOptions={reliabilityOptions}
                cooperationOptions={cooperationOptions}
                statementStatusOptions={statementStatusOptions}
                serviceMethodOptions={serviceMethodOptions}
                appearanceStatusOptions={appearanceStatusOptions}
                onClose={handleCloseWitnessModal}
                onSave={handleSaveWitness}
            />

            <NotificationModal
                show={showNotificationModal}
                notificationFormState={notificationFormState}
                notificationErrorState={notificationErrorState}
                handleNotificationFormState={handleNotificationFormState}
                victimNameOptions={victimNameOptions}
                notificationTypeOptions={notificationTypeOptions}
                notificationMethodOptions={notificationMethodOptions}
                notificationOutcomeOptions={notificationOutcomeOptions}
                legalRequirementOptions={legalRequirementOptions}
                toggleLegalRequirement={toggleLegalRequirement}
                onClose={handleCloseNotificationModal}
                onSave={handleSaveNotification}
            />
        </>
    );
}

export default VictimWitness;