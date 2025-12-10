import React, { useMemo, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../Components/Common/Utility';
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { coloredStyle_Select } from '../Utility/CustomStylesForReact';
import useObjState from '../../CADHook/useObjState';
import { useSelector } from 'react-redux';

function LegalOrder() {
    const [showModal, setShowModal] = useState(false);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Form state using useObjState
    const [formState, setFormState, handleFormState, clearFormState] = useObjState({
        orderType: null,
        orderNumber: '',
        court: '',
        judge: '',
        dateIssued: null,
        dateServed: null,
        servedBy: null,
        status: null,
        notes: '',
        returnFiled: false,
        createFollowUpTask: false,
    });

    const [errorState, setErrorState, handleErrorState, clearErrorState] = useObjState({
        orderType: false,
        orderNumber: false,
        court: false,
        judge: false,
        dateIssued: false,
        status: false,
    });

    const modalLabelStyle = { minWidth: '100px', marginBottom: 0, textAlign: 'right' };

    // Order type options
    const orderTypeOptions = [
        { value: 'Search Warrant', label: 'Search Warrant' },
        { value: 'Arrest Warrant', label: 'Arrest Warrant' },
        { value: 'Subpoena', label: 'Subpoena' },
        { value: 'Court Order', label: 'Court Order' },
    ];

    // Status options
    const statusOptions = [
        { value: 'Pending', label: 'Pending' },
        { value: 'Served', label: 'Served' },
        { value: 'Returned', label: 'Returned' },
        { value: 'Expired', label: 'Expired' },
    ];

    const handleOpenModal = () => {
        setShowModal(true);
        clearFormState();
        clearErrorState();
        setSelectedFiles([]);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        clearFormState();
        clearErrorState();
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const maxFileSizeInMB = 10;
        const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];

        const validFiles = files.filter(file => {
            if (!allowedTypes.includes(file.type)) return false;
            if (file.size > maxFileSizeInBytes) return false;
            return true;
        });

        setSelectedFiles(prev => [...prev, ...validFiles]);
        event.target.value = "";
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        // Validation logic can be added here
        console.log('Form State:', formState);
        handleCloseModal();
    };
    const data = useMemo(() => ([
        {
            id: 1,
            orderType: 'Search Warrant',
            orderNumber: 'SW-2024-0001',
            court: 'District Court',
            judge: 'Hon. Smith',
            issuedDate: '2024-01-15',
            servedDate: '2024-01-16',
            servedBy: 'Officer Johnson',
            returnFiled: true,
            status: 'Returned',
        },
    ]), []);

    const columns = useMemo(() => ([
        {
            name: 'Order Type',
            selector: row => row.orderType,
            sortable: true,
        },
        {
            name: 'Order Number',
            selector: row => row.orderNumber,
            sortable: true,
        },
        {
            name: 'Court / Judge',
            selector: row => `${row.court} ${row.judge}`,
            cell: row => (
                <div className="d-flex flex-column">
                    <span className="fw-bold">{row.court}</span>
                    <small>{row.judge}</small>
                </div>
            ),
        },
        {
            name: 'Issued Date',
            selector: row => row.issuedDate,
        },
        {
            name: 'Served Date',
            selector: row => row.servedDate,
        },
        {
            name: 'Served By',
            selector: row => row.servedBy,
        },
        {
            name: 'Return Filed',
            selector: row => row.returnFiled ? 'Yes' : 'No',
            cell: row => (
                <span
                    className="badge px-2 py-1 rounded-pill"
                    style={{
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}
                >
                    {row.returnFiled ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            name: 'Status',
            selector: row => row.status,
            cell: row => (
                <span
                    className="badge px-2 py-1 rounded-pill"
                    style={{
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        fontSize: '12px',
                        fontWeight: '500'
                    }}
                >
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Actions',
            cell: () => (
                <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                    <button className="btn btn-link text-secondary p-0" title="View">
                        <i className="fa fa-eye"></i>
                    </button>
                    <button className="btn btn-link text-secondary p-0" title="Edit">
                        <i className="fa fa-pencil"></i>
                    </button>
                    <button className="btn btn-link text-danger p-0" title="Delete">
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ]), []);

    return (
        <>
            <div className="container-fluid bg-white p-4 rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Legal Orders</h5>
                    <button className="btn btn-primary px-4" onClick={handleOpenModal}>New Legal Order</button>
                </div>
                <DataTable
                    columns={columns}
                    data={data}
                    dense
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

            {/* Add Legal Order Modal */}
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered modal-xl" style={{ maxHeight: '90vh' }}>
                        <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                            <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6' }}>
                                <h5 className="modal-title" style={{ fontSize: '18px', fontWeight: '600' }}>Add Legal Order</h5>
                            </div>
                            <div className="modal-body" style={{ overflowY: 'auto', flex: '1', padding: '10px' }}>

                                {/* Two Column Form */}
                                <div className="row">
                                    {/* Left Column */}
                                    <div className="col-md-6">
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                            <label className="form-label mb-0" style={modalLabelStyle}>
                                                Order Type <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    isClearable
                                                    options={orderTypeOptions}
                                                    placeholder="Select order type"
                                                    styles={coloredStyle_Select}
                                                    value={formState.orderType}
                                                    onChange={(e) => handleFormState('orderType', e)}
                                                />
                                                {errorState.orderType && !formState.orderType && (
                                                    <small className="text-danger">Required</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                            <label className="form-label mb-0" style={modalLabelStyle}>
                                                Court <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex-grow-1">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter court name"
                                                    value={formState.court}
                                                    onChange={(e) => handleFormState('court', e.target.value)}
                                                />
                                                {errorState.court && !formState.court && (
                                                    <small className="text-danger">Required</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                            <label className="form-label mb-0" style={modalLabelStyle}>
                                                Date Issued <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex-grow-1">
                                                <DatePicker
                                                    selected={formState.dateIssued}
                                                    onChange={(date) => handleFormState('dateIssued', date)}
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="dd-mm-yyyy"
                                                    className="form-control"
                                                    isClearable
                                                />
                                                {errorState.dateIssued && !formState.dateIssued && (
                                                    <small className="text-danger">Required</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                            <label className="form-label mb-0" style={modalLabelStyle}>Served By</label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    isClearable
                                                    options={agencyOfficerDrpData || []}
                                                    placeholder="Select officer"
                                                    styles={coloredStyle_Select}
                                                    value={formState.servedBy}
                                                    onChange={(e) => handleFormState('servedBy', e)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="col-md-6">
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                            <label className="form-label mb-0" style={modalLabelStyle}>
                                                Order Number <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex-grow-1">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter order number"
                                                    value={formState.orderNumber}
                                                    onChange={(e) => handleFormState('orderNumber', e.target.value)}
                                                />
                                                {errorState.orderNumber && !formState.orderNumber && (
                                                    <small className="text-danger">Required</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                            <label className="form-label mb-0" style={modalLabelStyle}>
                                                Judge <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex-grow-1">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter judge name"
                                                    value={formState.judge}
                                                    onChange={(e) => handleFormState('judge', e.target.value)}
                                                />
                                                {errorState.judge && !formState.judge && (
                                                    <small className="text-danger">Required</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                            <label className="form-label mb-0" style={modalLabelStyle}>Date Served</label>
                                            <div className="flex-grow-1">
                                                <DatePicker
                                                    selected={formState.dateServed}
                                                    onChange={(date) => handleFormState('dateServed', date)}
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="dd-mm-yyyy"
                                                    className="form-control"
                                                    isClearable
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                            <label className="form-label mb-0" style={modalLabelStyle}>
                                                Status <span className="text-danger">*</span>
                                            </label>
                                            <div className="flex-grow-1">
                                                <Select
                                                    isClearable
                                                    options={statusOptions}
                                                    placeholder="Select status"
                                                    styles={coloredStyle_Select}
                                                    value={formState.status}
                                                    onChange={(e) => handleFormState('status', e)}
                                                />
                                                {errorState.status && !formState.status && (
                                                    <small className="text-danger">Required</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                    <label className="form-label mb-0" style={modalLabelStyle}>Notes</label>
                                    <textarea
                                        className="form-control flex-grow-1"
                                        rows="3"
                                        placeholder="Enter any additional notes or details"
                                        value={formState.notes}
                                        onChange={(e) => handleFormState('notes', e.target.value)}
                                    />
                                </div>

                                {/* Checkboxes */}
                                <div className="mb-3 d-flex align-items-center" style={{ gap: '12px' }}>
                                    <div className="form-check mb-2 offset-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="returnFiled"
                                            checked={formState.returnFiled}
                                            onChange={(e) => handleFormState('returnFiled', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="returnFiled">
                                            Return Filed
                                        </label>
                                    </div>
                                    <div className="form-check offset-1">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="createFollowUpTask"
                                            checked={formState.createFollowUpTask}
                                            onChange={(e) => handleFormState('createFollowUpTask', e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="createFollowUpTask">
                                            Create a follow-up task in Case Effort automatically
                                        </label>
                                    </div>
                                </div>

                                {/* Attachment Upload Section */}
                                <div className="mb-3">
                                    <label className="form-label">Attachment Upload</label>
                                    <div
                                        className="border border-dashed rounded p-4 text-center"
                                        style={{
                                            borderColor: '#d1d5db',
                                            backgroundColor: '#f9fafb',
                                            cursor: 'pointer',
                                            minHeight: '150px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <i className="fa fa-upload fa-3x mb-3" style={{ color: '#6b7280' }}></i>
                                        <p className="mb-1" style={{ fontSize: '14px', fontWeight: '500' }}>
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                                            PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                                        </p>
                                    </div>
                                    {selectedFiles.length > 0 && (
                                        <div className="mt-2">
                                            {selectedFiles.map((file, index) => (
                                                <div key={index} className="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-1">
                                                    <span style={{ fontSize: '12px' }}>{file.name}</span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-link text-danger p-0"
                                                        onClick={() => handleRemoveFile(index)}
                                                    >
                                                        <i className="fa fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', padding: '15px 20px' }}>
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success px-4 py-2"
                                    style={{ backgroundColor: '#20c997', borderColor: '#20c997' }}
                                    onClick={handleSave}
                                >
                                    Add Legal Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default LegalOrder;