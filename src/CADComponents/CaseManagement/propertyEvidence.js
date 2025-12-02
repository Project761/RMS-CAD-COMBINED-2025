import React, { useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../Components/Common/Utility';
import useObjState from '../../CADHook/useObjState';
import Select from "react-select";
import { colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

    const modalLabelStyle = { minWidth: '110px', marginBottom: 0, textAlign: 'right' };
    const modalFormallyLabelStyle = { minWidth: '180px', marginBottom: 0, textAlign: 'right' };

    const [digitalEvidenceForm, , handleDigitalEvidenceForm, clearDigitalEvidenceForm] = useObjState({
        evidenceLink: '',
        fileType: null,
        fileHash: '',
        fileSize: '',
        captureSource: null,
        retentionDate: null,
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
        const formatDate = (date) => {
            if (!date) return '';
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}-${month}-${year}`;
        };
        const newEntry = {
            id: digitalEvidenceData.length + 1,
            evidenceLink: digitalEvidenceForm.evidenceLink,
            fileType: digitalEvidenceForm.fileType?.label || '',
            fileSize: digitalEvidenceForm.fileSize,
            captureSource: digitalEvidenceForm.captureSource?.label || '',
            retentionDate: formatDate(digitalEvidenceForm.retentionDate),
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

    return (
        <div className='col-12 col-md-12 col-lg-12 mt-2'>
            <div className="row" style={{ marginLeft: '-18px', marginRight: '-18px' }}>
                <div className="col-12 name-tab mb-2">
                    <ul className='nav nav-tabs'>
                        <span
                            className={`nav-item ml-2 ${activeTab === 'home' ? 'active' : ''}`}
                            style={{ color: activeTab === 'home' ? 'Red' : '#000' }}
                            aria-current="page"
                            onClick={() => setActiveTab('home')}
                        >
                            Property & Evidence
                        </span>
                        <span
                            className={`nav-item ${activeTab === 'digitalEvidence' ? 'active' : ''}`}
                            style={{ color: activeTab === 'digitalEvidence' ? 'Red' : '#000' }}
                            aria-current="page"
                            onClick={() => setActiveTab('digitalEvidence')}
                        >
                            Digital Evidence
                        </span>
                    </ul>
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

                <fieldset className='mt-1'>
                    <legend>Digital Evidence Metadata</legend>
                    <div className="row mt-2">
                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>Evidence System Link</label>
                            <input
                                type="url"
                                className="form-control"
                                placeholder="https://example.com/evidence"
                                value={digitalEvidenceForm.evidenceLink}
                                onChange={(e) => handleDigitalEvidenceForm('evidenceLink', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>File Type</label>
                            <Select
                                classNamePrefix="react-select"
                                options={fileTypeOptions}
                                styles={colorLessStyle_Select}
                                placeholder="Select file type"
                                value={digitalEvidenceForm.fileType}
                                onChange={(option) => handleDigitalEvidenceForm('fileType', option)}
                                isClearable
                            />
                        </div>
                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label text-nowrap" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>File Hash / Checksum (SHA-256)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter SHA-256 hash"
                                value={digitalEvidenceForm.fileHash}
                                onChange={(e) => handleDigitalEvidenceForm('fileHash', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>File Size (MB/GB)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., 250 MB"
                                value={digitalEvidenceForm.fileSize}
                                onChange={(e) => handleDigitalEvidenceForm('fileSize', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>Capture Source</label>
                            <Select
                                classNamePrefix="react-select"
                                options={captureSourceOptions}
                                styles={colorLessStyle_Select}
                                placeholder="Select source"
                                value={digitalEvidenceForm.captureSource}
                                onChange={(option) => handleDigitalEvidenceForm('captureSource', option)}
                                isClearable
                            />
                        </div>
                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>Retention Date</label>
                            <DatePicker
                                selected={digitalEvidenceForm.retentionDate}
                                onChange={(date) => handleDigitalEvidenceForm('retentionDate', date)}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-mm-yyyy"
                                className="form-control"
                                isClearable
                            />
                        </div>
                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>Access Restriction</label>
                            <Select
                                classNamePrefix="react-select"
                                options={accessRestrictionOptions}
                                placeholder="Select restriction level"
                                styles={colorLessStyle_Select}
                                value={digitalEvidenceForm.accessRestriction}
                                onChange={(option) => handleDigitalEvidenceForm('accessRestriction', option)}
                                isClearable
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-success px-4 py-2"
                            onClick={saveDigitalEvidence}
                            style={{ backgroundColor: '#20c997', borderColor: '#20c997' }}
                        >
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
                </fieldset>
            )
            }

            {/* Add Property Modal */}
            {
                isAddPropertyModalOpen && (
                    <div
                        className="modal fade show"
                        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ borderRadius: '6px' }}>
                                <div className="modal-header">
                                    <div>
                                        <h5 className="modal-title">Add New Property</h5>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalLabelStyle}>Item Number</label>
                                            <input
                                                type="text"
                                                className="form-control flex-grow-1"
                                                placeholder="e.g., PRN-001241"
                                                value={newPropertyForm.itemNumber}
                                                onChange={(e) => handleNewPropertyForm('itemNumber', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalLabelStyle}>Category</label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={categoryOptions}
                                                    placeholder="Select category"
                                                    value={newPropertyForm.category}
                                                    onChange={(option) => handleNewPropertyForm('category', option)}
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalLabelStyle}>Classification</label>
                                            <input
                                                type="text"
                                                className="form-control flex-grow-1"
                                                placeholder="e.g., Waxer, Laptop, etc."
                                                value={newPropertyForm.classification}
                                                onChange={(e) => handleNewPropertyForm('classification', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalLabelStyle}>Physical Location</label>
                                            <input
                                                type="text"
                                                className="form-control flex-grow-1"
                                                placeholder="e.g., Property Room A-13"
                                                value={newPropertyForm.physicalLocation}
                                                onChange={(e) => handleNewPropertyForm('physicalLocation', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalLabelStyle}>Custodian</label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={custodianOptions}
                                                    placeholder="Select custodian"
                                                    value={newPropertyForm.custodian}
                                                    onChange={(option) => handleNewPropertyForm('custodian', option)}
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalLabelStyle}>Status</label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={statusOptions}
                                                    placeholder="Select status"
                                                    value={newPropertyForm.status}
                                                    onChange={(option) => handleNewPropertyForm('status', option)}
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold" style={modalLabelStyle}>Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Enter detailed description of the property item"
                                                value={newPropertyForm.description}
                                                onChange={(e) => handleNewPropertyForm('description', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold" style={modalLabelStyle}>Notes</label>
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
                                    <button
                                        type="button"
                                        className="btn btn-success px-4 py-2"
                                        onClick={saveNewProperty}
                                        style={{ backgroundColor: '#20c997', borderColor: '#20c997' }}
                                    >
                                        Add Property
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Formally Enter as Evidence Modal */}
            {
                isEnterEvidenceModalOpen && (
                    <div
                        className="modal fade show"
                        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ borderRadius: '6px' }}>
                                <div className="modal-header">
                                    <div>
                                        <h5 className="modal-title">Formally Enter as Evidence</h5>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalFormallyLabelStyle}>Property Number</label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={propertyItemOptions}
                                                    placeholder="Select property item"
                                                    value={enterEvidenceForm.propertyItem}
                                                    onChange={(option) => handleEnterEvidenceForm('propertyItem', option)}
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalFormallyLabelStyle}>Evidence Tag Number</label>
                                            <input
                                                type="text"
                                                className="form-control flex-grow-1"
                                                placeholder="e.g., EV-2025-001"
                                                value={enterEvidenceForm.evidenceTag}
                                                onChange={(e) => handleEnterEvidenceForm('evidenceTag', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalFormallyLabelStyle}>Collected By</label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={collectedByOptions}
                                                    placeholder="Select officer"
                                                    value={enterEvidenceForm.collectedBy}
                                                    onChange={(option) => handleEnterEvidenceForm('collectedBy', option)}
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalFormallyLabelStyle}>Collection Date &amp; Time</label>
                                            <input
                                                type="datetime-local"
                                                className="form-control flex-grow-1"
                                                value={enterEvidenceForm.collectionDateTime}
                                                onChange={(e) => handleEnterEvidenceForm('collectionDateTime', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalFormallyLabelStyle}>Evidence Type</label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    classNamePrefix="react-select"
                                                    options={evidenceTypeOptions}
                                                    placeholder="Select type"
                                                    value={enterEvidenceForm.evidenceType}
                                                    onChange={(option) => handleEnterEvidenceForm('evidenceType', option)}
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold mb-0" style={modalFormallyLabelStyle}>Evidence Storage Location</label>
                                            <input
                                                type="text"
                                                className="form-control flex-grow-1"
                                                placeholder="e.g., Evidence Locker B-12"
                                                value={enterEvidenceForm.storageLocation}
                                                onChange={(e) => handleEnterEvidenceForm('storageLocation', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold" style={modalFormallyLabelStyle}>Chain of Custody Information</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Document the chain of custody from collection to storage"
                                                value={enterEvidenceForm.custodyInfo}
                                                onChange={(e) => handleEnterEvidenceForm('custodyInfo', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 mb-3 d-flex align-items-center" style={{ gap: '10px' }}>
                                            <label className="new-label fw-bold" style={modalFormallyLabelStyle}>Additional Notes</label>
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
                )
            }
        </div >
    )
}

export default PropertyEvidence