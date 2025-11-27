import React, { useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../Components/Common/Utility';
import useObjState from '../../CADHook/useObjState';
import Select from "react-select";

function PropertyEvidence() {
    // Property/Evidence data
    const [activeTab, setActiveTab] = useState('home');
    const [propertyData, setPropertyData] = useState([
        {
            id: 1,
            itemNumber: "VF-2025-0229",
            description: "Category . Make",
            physicalLocation: "Property Room A-13",
            custodian: "Daniel D",
            status: "Check In",
            chain: "View"
        },
        {
            id: 2,
            itemNumber: "PRN-001241",
            description: "Category . Classification",
            physicalLocation: "",
            custodian: "A K John",
            status: "Evidence",
            chain: ""
        },
        {
            id: 3,
            itemNumber: "PRN-001241",
            description: "Household Goods . Waxer",
            physicalLocation: "Property Room A-13",
            custodian: "Smith John",
            status: "Check Out",
            chain: "View"
        },
        {
            id: 4,
            itemNumber: "PRN-001241",
            description: "Category . Classification",
            physicalLocation: "",
            custodian: "A K John",
            status: "Pending Review",
            chain: ""
        }
    ])

    const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
    const [isEnterEvidenceModalOpen, setIsEnterEvidenceModalOpen] = useState(false);
    const [categoryOptions] = useState([
        { value: 'electronics', label: 'Electronics' },
        { value: 'weapons', label: 'Weapons' },
        { value: 'documents', label: 'Documents' },
    ]);
    const [custodianOptions] = useState([
        { value: 'daniel', label: 'Daniel D' },
        { value: 'smith', label: 'Smith John' },
        { value: 'akjohn', label: 'A K John' },
    ]);
    const [statusOptions] = useState([
        { value: 'checkin', label: 'Check In' },
        { value: 'checkout', label: 'Check Out' },
        { value: 'evidence', label: 'Evidence' },
        { value: 'pending', label: 'Pending Review' },
    ]);

    const [newPropertyForm, , handleNewPropertyForm, clearNewPropertyForm] = useObjState({
        itemNumber: '',
        category: null,
        classification: '',
        physicalLocation: '',
        custodian: null,
        status: null,
        description: '',
        notes: '',
    });

    const [enterEvidenceForm, , handleEnterEvidenceForm, clearEnterEvidenceForm] = useObjState({
        propertyItem: null,
        evidenceTag: '',
        collectedBy: null,
        collectionDateTime: '',
        evidenceType: null,
        storageLocation: '',
        custodyInfo: '',
        additionalNotes: '',
        createTimelineEntry: false,
    });

    const collectedByOptions = [
        { value: 'officer1', label: 'Officer John D' },
        { value: 'officer2', label: 'Officer Mary S' },
        { value: 'officer3', label: 'Officer Alex K' },
    ];

    const evidenceTypeOptions = [
        { value: 'physical', label: 'Physical' },
        { value: 'digital', label: 'Digital' },
        { value: 'biological', label: 'Biological' },
    ];

    const propertyItemOptions = useMemo(
        () => propertyData.map(item => ({ value: item.id, label: `${item.itemNumber} - ${item.description}` })),
        [propertyData]
    );

    const [digitalEvidenceForm, , handleDigitalEvidenceForm, clearDigitalEvidenceForm] = useObjState({
        evidenceLink: '',
        fileType: null,
        fileHash: '',
        fileSize: '',
        captureSource: null,
        retentionDate: '',
        accessRestriction: null,
    });
    const [digitalEvidenceData, setDigitalEvidenceData] = useState([]);

    const fileTypeOptions = [
        { value: 'video', label: 'Video' },
        { value: 'audio', label: 'Audio' },
        { value: 'image', label: 'Image' },
        { value: 'document', label: 'Document' },
    ];

    const captureSourceOptions = [
        { value: 'bodycam', label: 'Body Camera' },
        { value: 'dashcam', label: 'Dash Camera' },
        { value: 'surveillance', label: 'Surveillance Camera' },
        { value: 'mobile', label: 'Mobile Device' },
    ];

    const accessRestrictionOptions = [
        { value: 'general', label: 'General Access' },
        { value: 'restricted', label: 'Restricted' },
        { value: 'confidential', label: 'Confidential' },
    ];

    const digitalEvidenceColumns = [
        { name: 'Evidence Link', selector: row => row.evidenceLink, wrap: true },
        { name: 'File Type', selector: row => row.fileType, width: '150px' },
        { name: 'File Size', selector: row => row.fileSize, width: '120px' },
        { name: 'Capture Source', selector: row => row.captureSource, width: '180px' },
        { name: 'Retention Date', selector: row => row.retentionDate, width: '150px' },
        { name: 'Access Restriction', selector: row => row.accessRestriction, width: '180px' },
    ];

    // Event handlers
    const handleAddNewProperty = () => {
        setIsAddPropertyModalOpen(true);
    }

    const handleFormallyEnterEvidence = () => {
        setIsEnterEvidenceModalOpen(true);
    }

    const handleViewItem = (itemId) => {
        console.log('View item:', itemId)
        // Here you would typically open a modal or navigate to item details
    }

    const handleViewChain = (itemId) => {
        console.log('View chain for item:', itemId)
        // Here you would typically open a modal or navigate to chain of custody
    }

    const closeAddPropertyModal = () => {
        setIsAddPropertyModalOpen(false);
        clearNewPropertyForm();
    }

    const closeEnterEvidenceModal = () => {
        setIsEnterEvidenceModalOpen(false);
        clearEnterEvidenceForm();
    }

    const saveNewProperty = () => {
        const newItem = {
            id: propertyData.length + 1,
            itemNumber: newPropertyForm.itemNumber || `PRN-${propertyData.length + 1}`,
            description: `${newPropertyForm.category?.label || 'Category'} . ${newPropertyForm.classification || 'Description'}`,
            physicalLocation: newPropertyForm.physicalLocation,
            custodian: newPropertyForm.custodian?.label || '',
            status: newPropertyForm.status?.label || 'Pending Review',
            chain: ''
        };
        setPropertyData(prev => [...prev, newItem]);
        closeAddPropertyModal();
    }

    const submitEnterEvidence = () => {
        console.log('Entering as evidence', enterEvidenceForm);
        closeEnterEvidenceModal();
    }

    const saveDigitalEvidence = () => {
        if (!digitalEvidenceForm.evidenceLink || !digitalEvidenceForm.fileType) return;
        const newEntry = {
            id: digitalEvidenceData.length + 1,
            evidenceLink: digitalEvidenceForm.evidenceLink,
            fileType: digitalEvidenceForm.fileType?.label || '',
            fileSize: digitalEvidenceForm.fileSize,
            captureSource: digitalEvidenceForm.captureSource?.label || '',
            retentionDate: digitalEvidenceForm.retentionDate,
            accessRestriction: digitalEvidenceForm.accessRestriction?.label || '',
        };
        setDigitalEvidenceData(prev => [...prev, newEntry]);
        clearDigitalEvidenceForm();
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Check In': { color: '#22c55e', textColor: '#fff' }, // green
            'Evidence': { color: '#3b82f6', textColor: '#fff' }, // blue
            'Check Out': { color: '#ef4444', textColor: '#fff' }, // red
            'Pending Review': { color: '#fbbf24', textColor: '#000' } // yellow
        }

        const config = statusConfig[status] || { color: '#6b7280', textColor: '#fff' }

        return (
            <span
                className="badge px-3 py-2"
                style={{
                    backgroundColor: config.color,
                    color: config.textColor,
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '4px'
                }}
            >
                {status}
            </span>
        )
    }

    const columns = [
        {
            name: 'Item #',
            selector: row => row.itemNumber,
            sortable: true,
            width: '150px',
            cell: row => (
                <span className="fw-bold">{row.itemNumber}</span>
            )
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
        },
        {
            name: 'Physical Location',
            selector: row => row.physicalLocation,
            sortable: true,
            cell: row => (
                <span>{row.physicalLocation || '-'}</span>
            )
        },
        {
            name: 'Custodian',
            selector: row => row.custodian,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            width: '150px',
            cell: row => getStatusBadge(row.status)
        },
        {
            name: 'Chain',
            selector: row => row.chain,
            sortable: true,
            width: '100px',
            cell: row => (
                row.chain ? (
                    <button
                        className="btn btn-link p-0 text-primary"
                        onClick={() => handleViewChain(row.id)}
                        style={{ textDecoration: 'underline' }}
                    >
                        {row.chain}
                    </button>
                ) : (
                    <span>-</span>
                )
            )
        },
        {
            name: 'Action',
            selector: row => row.id,
            width: '100px',
            cell: row => (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewItem(row.id)}
                    style={{ backgroundColor: '#1e40af', borderColor: '#1e40af' }}
                >
                    View
                </button>
            )
        }
    ];

    const tabPanels = [
        {
            id: 'home',
            title: 'Property & Evidence',
            description: 'Manage all physical property items and evidence records.'
        },
        {
            id: 'digitalEvidence',
            title: 'Digital Evidence',
            description: 'Capture metadata for digital artifacts linked to the case.'
        }
    ];

    return (
        <div className='col-12 col-md-12 col-lg-12 mt-2'>
            <div className="card shadow-sm mb-4" style={{ border: '0px', borderRadius: '12px' }}>
                <div className="card-body d-flex flex-wrap align-items-center" style={{ gap: '10px' }}>
                    {tabPanels.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                className="btn text-start flex-grow-1"
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    borderRadius: '10px',
                                    border: isActive ? '1px solid #163b5b' : '1px solid #e2e8f0',
                                    background: isActive ? '#163b5b' : '#f8fafc',
                                    color: isActive ? '#fff' : '#0f172a',
                                    padding: '12px 16px',
                                    boxShadow: isActive ? '0 6px 20px rgba(22,59,91,0.3)' : 'none',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div className="fw-semibold" style={{ fontSize: '15px' }}>{tab.title}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>{tab.description}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeTab === 'home' && (
                <>
                    {/* Action Buttons Header */}
                    <div className="d-flex justify-content-start mb-3" style={{ gap: '15px' }}>
                        <button
                            type="button"
                            className="btn btn-success px-4 py-2"
                            onClick={handleAddNewProperty}
                            style={{ backgroundColor: '#20c997', borderColor: '#20c997' }}
                        >
                            Add New Property
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary px-4 py-2"
                            onClick={handleFormallyEnterEvidence}
                            style={{ backgroundColor: '#6c757d', borderColor: '#6c757d' }}
                        >
                            Formally Enter as Evidence
                        </button>
                    </div>

                    {/* Property/Evidence Data Table */}
                    <div className="table-responsive">
                        <DataTable
                            dense
                            columns={columns}
                            data={propertyData}
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
                </>
            )}

            {activeTab === 'digitalEvidence' && (
                <div className="card shadow-sm" style={{ border: '0px', borderRadius: '10px' }}>
                    <div className="card-body">
                        <h5 className="fw-bold mb-3">Digital Evidence Metadata</h5>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Evidence System Link</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="https://example.com/evidence"
                                    value={digitalEvidenceForm.evidenceLink}
                                    onChange={(e) => handleDigitalEvidenceForm('evidenceLink', e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">File Type</label>
                                <Select
                                    classNamePrefix="react-select"
                                    options={fileTypeOptions}
                                    placeholder="Select file type"
                                    value={digitalEvidenceForm.fileType}
                                    onChange={(option) => handleDigitalEvidenceForm('fileType', option)}
                                    isClearable
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">File Hash / Checksum (SHA-256)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter SHA-256 hash"
                                    value={digitalEvidenceForm.fileHash}
                                    onChange={(e) => handleDigitalEvidenceForm('fileHash', e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">File Size (MB/GB)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., 250 MB"
                                    value={digitalEvidenceForm.fileSize}
                                    onChange={(e) => handleDigitalEvidenceForm('fileSize', e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Capture Source</label>
                                <Select
                                    classNamePrefix="react-select"
                                    options={captureSourceOptions}
                                    placeholder="Select source"
                                    value={digitalEvidenceForm.captureSource}
                                    onChange={(option) => handleDigitalEvidenceForm('captureSource', option)}
                                    isClearable
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Retention Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={digitalEvidenceForm.retentionDate}
                                    onChange={(e) => handleDigitalEvidenceForm('retentionDate', e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Access Restriction</label>
                                <Select
                                    classNamePrefix="react-select"
                                    options={accessRestrictionOptions}
                                    placeholder="Select restriction level"
                                    value={digitalEvidenceForm.accessRestriction}
                                    onChange={(option) => handleDigitalEvidenceForm('accessRestriction', option)}
                                    isClearable
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-info text-white" onClick={saveDigitalEvidence}>
                                Save Digital Evidence
                            </button>
                        </div>

                        <div className="mt-4">
                            <DataTable
                                dense
                                columns={digitalEvidenceColumns}
                                data={digitalEvidenceData}
                                customStyles={tableCustomStyles}
                                noDataComponent={'There are no digital evidence records'}
                                striped
                                highlightOnHover
                                persistTableHead
                                pagination
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Add Property Modal */}
            {isAddPropertyModalOpen && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content" style={{ borderRadius: '12px' }}>
                            <div className="modal-header">
                                <div>
                                    <h5 className="modal-title">Add New Property</h5>
                                    <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
                                        Enter the details of the property item to be added to the case.
                                    </p>
                                </div>
                                <button type="button" className="close" onClick={closeAddPropertyModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Item Number *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., PRN-001241"
                                            value={newPropertyForm.itemNumber}
                                            onChange={(e) => handleNewPropertyForm('itemNumber', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Category *</label>
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            options={categoryOptions}
                                            placeholder="Select category"
                                            value={newPropertyForm.category}
                                            onChange={(option) => handleNewPropertyForm('category', option)}
                                            isClearable
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Classification</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., Waxer, Laptop, etc."
                                            value={newPropertyForm.classification}
                                            onChange={(e) => handleNewPropertyForm('classification', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Physical Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., Property Room A-13"
                                            value={newPropertyForm.physicalLocation}
                                            onChange={(e) => handleNewPropertyForm('physicalLocation', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Custodian *</label>
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            options={custodianOptions}
                                            placeholder="Select custodian"
                                            value={newPropertyForm.custodian}
                                            onChange={(option) => handleNewPropertyForm('custodian', option)}
                                            isClearable
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Status *</label>
                                        <Select
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            options={statusOptions}
                                            placeholder="Select status"
                                            value={newPropertyForm.status}
                                            onChange={(option) => handleNewPropertyForm('status', option)}
                                            isClearable
                                        />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label fw-bold">Description</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Enter detailed description of the property item"
                                            value={newPropertyForm.description}
                                            onChange={(e) => handleNewPropertyForm('description', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label fw-bold">Notes</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Additional notes or comments"
                                            value={newPropertyForm.notes}
                                            onChange={(e) => handleNewPropertyForm('notes', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-end" style={{ gap: '12px' }}>
                                <button type="button" className="btn btn-light px-4" onClick={closeAddPropertyModal}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary px-4" onClick={saveNewProperty}>
                                    Add Property
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Formally Enter as Evidence Modal */}
            {isEnterEvidenceModalOpen && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content" style={{ borderRadius: '12px' }}>
                            <div className="modal-header">
                                <div>
                                    <h5 className="modal-title">Formally Enter as Evidence</h5>
                                    <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>
                                        Convert property item to formal evidence with proper documentation and chain of custody.
                                    </p>
                                </div>
                                <button type="button" className="close" onClick={closeEnterEvidenceModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Property Item Number *</label>
                                        <Select
                                            classNamePrefix="react-select"
                                            options={propertyItemOptions}
                                            placeholder="Select property item"
                                            value={enterEvidenceForm.propertyItem}
                                            onChange={(option) => handleEnterEvidenceForm('propertyItem', option)}
                                            isClearable
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Evidence Tag Number *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., EV-2025-001"
                                            value={enterEvidenceForm.evidenceTag}
                                            onChange={(e) => handleEnterEvidenceForm('evidenceTag', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Collected By *</label>
                                        <Select
                                            classNamePrefix="react-select"
                                            options={collectedByOptions}
                                            placeholder="Select officer"
                                            value={enterEvidenceForm.collectedBy}
                                            onChange={(option) => handleEnterEvidenceForm('collectedBy', option)}
                                            isClearable
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Collection Date &amp; Time *</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                        value={enterEvidenceForm.collectionDateTime}
                                            onChange={(e) => handleEnterEvidenceForm('collectionDateTime', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Evidence Type *</label>
                                        <Select
                                            classNamePrefix="react-select"
                                            options={evidenceTypeOptions}
                                            placeholder="Select type"
                                            value={enterEvidenceForm.evidenceType}
                                            onChange={(option) => handleEnterEvidenceForm('evidenceType', option)}
                                            isClearable
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Evidence Storage Location *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g., Evidence Locker B-12"
                                            value={enterEvidenceForm.storageLocation}
                                            onChange={(e) => handleEnterEvidenceForm('storageLocation', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label fw-bold">Chain of Custody Information</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Document the chain of custody from collection to storage"
                                            value={enterEvidenceForm.custodyInfo}
                                            onChange={(e) => handleEnterEvidenceForm('custodyInfo', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label fw-bold">Additional Notes</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Any additional information about the evidence"
                                            value={enterEvidenceForm.additionalNotes}
                                            onChange={(e) => handleEnterEvidenceForm('additionalNotes', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="createTimelineEntry"
                                                checked={enterEvidenceForm.createTimelineEntry}
                                                onChange={(e) => handleEnterEvidenceForm('createTimelineEntry', e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="createTimelineEntry">
                                                Automatically create an entry in Case Timeline
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-end" style={{ gap: '12px' }}>
                                <button type="button" className="btn btn-light px-4" onClick={closeEnterEvidenceModal}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-success px-4" onClick={submitEnterEvidence}>
                                    Enter as Evidence
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PropertyEvidence