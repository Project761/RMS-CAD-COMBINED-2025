import React, { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component';
import { base64ToString, stringToBase64, tableCustomStyles } from '../../Components/Common/Utility';
import useObjState from '../../CADHook/useObjState';
import Select from "react-select";
import { colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Property_Tabs from '../../Components/Pages/Property/Property_Tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import ChainOfCustody from '../../Components/Pages/Property/PropertyTab/ChainOfCustody/ChainOfCustody';
import CaseManagementServices from '../../CADServices/APIs/caseManagement';
import { useQuery } from 'react-query';

function PropertyEvidence() {
    // Property/Evidence data
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [propertyData, setPropertyData] = useState([])
    const useRouterQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useRouterQuery();

    let IncId = query?.get('IncId');
    let CaseId = query?.get('CaseId');
    let IncSta = query?.get('IncSta');
    let IncNo = query?.get('IncNo');

    if (!IncId) IncId = 0;
    else IncId = parseInt(base64ToString(IncId));

    const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
    const [isChainModalOpen, setIsChainModalOpen] = useState(false);
    const [selectedChainId, setSelectedChainId] = useState(null);

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

    const getAllCaseTeamKey = `/CaseManagement/GetPropertyForCaseManagement/${IncId}`;
    const { data: getPropertyForCaseManagementData, isSuccess: isGetPropertyForCaseManagementDataSuccess, refetch: refetchPropertyForCaseManagementData } = useQuery(
        [getAllCaseTeamKey, {
            "IncidentID": IncId,
        },],
        CaseManagementServices.getPropertyForCaseManagement,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!IncId
        }
    );

    useEffect(() => {
        if (getPropertyForCaseManagementData && isGetPropertyForCaseManagementDataSuccess) {
            const data = JSON.parse(getPropertyForCaseManagementData?.data?.data)?.Table
            setPropertyData(data)
        } else {
            setPropertyData([])
        }
    }, [getPropertyForCaseManagementData, isGetPropertyForCaseManagementDataSuccess])

    // Event handlers
    const handleAddNewProperty = () => {
        setIsAddPropertyModalOpen(true);
    }

    const handleViewItem = (res) => {
        setIsAddPropertyModalOpen(true);
        navigate(`/inc-case-management?IncId=${stringToBase64(IncId)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(res?.PropertyID)}&MProId=${stringToBase64(res?.MasterPropertyID)}&ProSta=${true}&ProCategory=${res.ProCatagory}${CaseId ? `&CaseId=${CaseId}` : ''}`)
        // Here you would typically open a modal or navigate to item details
    }

    const handleViewChain = (itemId) => {
        setSelectedChainId(itemId);
        setIsChainModalOpen(true);
    }

    const closeChainModal = () => {
        setIsChainModalOpen(false);
        setSelectedChainId(null);
    }

    const closeAddPropertyModal = () => {
        setIsAddPropertyModalOpen(false);
        navigate(`/inc-case-management?IncId=${stringToBase64(IncId)}&IncNo=${IncNo}&IncSta=${IncSta}&CaseId=${CaseId}`)
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


    const columns = [
        {
            name: 'Action',
            selector: row => row.id,
            width: '80px',
            cell: row => (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewItem(row)}
                    style={{ backgroundColor: '#001f3f' }}
                    title="Edit"
                ><i className="fa fa-edit"></i>
                </button>

            )
        },
        {
            name: 'Item #',
            selector: row => row.PropertyNumber,
            sortable: true,
            width: '120px',
            cell: row => (
                <span className="fw-bold">{row.PropertyNumber}</span>
            )
        },
        {
            name: 'Description',
            selector: row => row.Description,
            sortable: true,
        },
        {
            name: 'Physical Location',
            selector: row => row.location,
            sortable: true,
            cell: row => (
                <span>{row.location || '-'}</span>
            )
        },
        {
            name: 'Property Room Officer',
            selector: row => row.PersonnelNames,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.ActivityType,
            sortable: true,
            cell: row => <div style={{ color: row.ActivityType === 'CheckIn' ? '#22c55e' : row.ActivityType === 'CheckOut' ? '#ef4444' : '#000' }}>{row.ActivityType === 'CheckIn' ? 'Check In' : row.ActivityType === 'CheckOut' ? 'Check Out' : !row.IsEvidence ? "Not Marked as Evidence" : row.IsEvidence && !row.IsSendToPropertyRoom && row?.ActivityType === null ? "Not Send to Property Room" : row.IsEvidence && row.IsSendToPropertyRoom && row?.ActivityType === null ? "Sent to Property Room (Pending Check In)" : row.ActivityType}</div>
        },
        {
            name: 'Chain',
            selector: row => row.chain,
            sortable: true,
            width: '100px',
            cell: row => (
                row.ActivityType === 'CheckIn' || row.ActivityType === 'CheckOut' || row.ActivityType === 'Release' || row.ActivityType === 'Destroy' ? (
                    <button
                        className="btn btn-link p-0 text-primary"
                        onClick={() => handleViewChain(row.PropertyID)}
                        style={{ textDecoration: 'underline' }}
                    >
                        View
                    </button>
                ) : (
                    <span>-</span>
                )
            )
        },
    ];

    return (
        <div className='col-12 col-md-12 col-lg-12'>
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
                    <div className="d-flex justify-content-end mb-3" style={{ gap: '15px' }}>
                        <button
                            type="button"
                            className="btn btn-success px-4 py-2"
                            onClick={handleAddNewProperty}
                        >
                            Add New Property
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
                        <div className="col-md-6 mb-1 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>Evidence System Link</label>
                            <input
                                type="url"
                                className="form-control"
                                placeholder="https://example.com/evidence"
                                value={digitalEvidenceForm.evidenceLink}
                                onChange={(e) => handleDigitalEvidenceForm('evidenceLink', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-1 d-flex align-items-center" style={{ gap: '10px' }}>
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
                        <div className="col-md-6 mb-1 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label text-nowrap" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>File Hash / Checksum (SHA-256)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter SHA-256 hash"
                                value={digitalEvidenceForm.fileHash}
                                onChange={(e) => handleDigitalEvidenceForm('fileHash', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-1 d-flex align-items-center" style={{ gap: '10px' }}>
                            <label className="new-label" style={{ minWidth: '200px', marginBottom: 0, textAlign: 'right' }}>File Size (MB/GB)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., 250 MB"
                                value={digitalEvidenceForm.fileSize}
                                onChange={(e) => handleDigitalEvidenceForm('fileSize', e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-1 d-flex align-items-center" style={{ gap: '10px' }}>
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
                        <div className="col-md-6 mb-1 d-flex align-items-center" style={{ gap: '10px' }}>
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
                        <div className="col-md-6 mb-1 d-flex align-items-center" style={{ gap: '10px' }}>
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
                                    <button type="button" onClick={closeAddPropertyModal} className="close text-red" data-dismiss="modal" >×</button>
                                </div>
                                <div className="modal-body">
                                    <Property_Tabs isCaseManagement isAddPropertyModalOpen={isAddPropertyModalOpen} refetchPropertyForCaseManagementData={refetchPropertyForCaseManagementData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Chain Modal */}
            {
                isChainModalOpen && (
                    <div
                        className="modal fade show"
                        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ borderRadius: '6px' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Chain of Custody</h5>
                                    <button
                                        type="button"
                                        onClick={closeChainModal}
                                        className="close text-red"
                                        data-dismiss="modal"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <ChainOfCustody DecPropID={selectedChainId} />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeChainModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default PropertyEvidence