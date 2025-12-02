import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { fetchPostData } from '../../../Components/hooks/Api';
import { Link, useNavigate } from 'react-router-dom';
import { getShowingMonthDateYear, tableCustomStyles } from '../../../Components/Common/Utility';
import { useDispatch } from 'react-redux';
import { getDropDownReasonCase } from '../../../redux/actions/DropDownsData';

function ManualPurgeRequest(props) {
    const { isPreview } = props;
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [clickedRow, setClickedRow] = useState(null);
    const [queData, setQueData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modelStatus, setModelStatus] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        if (localStoreData) {
            get_Data_Que_Report(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    const get_Data_Que_Report = (agencyId, OfficerID) => {
        const val = { 'AgencyID': agencyId, OfficerID: OfficerID }
        fetchPostData('/CaseManagement/ManualPurgeApprove_PendingReview', val).then((res) => {
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

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

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
                            setModelStatus(true)
                            setEditData(row)
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
        { name: 'Approving Officer/ Group', selector: row => row.Approve_Officer, sortable: true, width: "200px" },
        { name: 'Submitted By', selector: row => row.CreateOfficer, sortable: true, width: "180px" },
        { name: 'Submitted DT/TM', selector: row => row.CreatedDtTm ? getShowingMonthDateYear(row.CreatedDtTm) : " ", sortable: true, width: "150px" },
        { name: 'Elapsed Days', selector: row => row.ElapsedDay, sortable: true, width: "150px" },

    ];

    return (
        <>
            <div className="col-12 col-sm-12">
                <div className="property-evidence">
                    <div className="text-end mt-2 d-flex w-100" style={{ justifyContent: "space-between", alignItems: "center", }} >
                        <>
                            <div className='d-flex align-items-center ml-0'>
                                {isPreview && (
                                    <span className="mr-2 ">
                                        <svg width="40" height="40" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="40" cy="40" r="40" fill="#D6ECFF" />
                                            <defs>
                                                <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#FF3B3B" />
                                                    <stop offset="100%" stopColor="#D90000" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M30 50a10 10 0 0120 0v8H30v-8z" fill="url(#glow)" />
                                            <rect x="38" y="40" width="4" height="10" rx="100" fill="white" />
                                            <circle cx="40" cy="53" r="2" fill="white" />
                                            <rect x="26" y="58" width="28" height="6" rx="2" fill="#E0E0E0" />
                                            <rect x="30" y="64" width="20" height="4" rx="2" fill="#BDBDBD" />
                                            <line x1="20" y1="30" x2="28" y2="32" stroke="#E30613" strokeWidth="2" />
                                            <line x1="60" y1="30" x2="52" y2="32" stroke="#E30613" strokeWidth="2" />
                                            <line x1="40" y1="20" x2="40" y2="28" stroke="#E30613" strokeWidth="2" />
                                        </svg>
                                    </span>
                                )}
                                <span className="fw-bold mb-0 " style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>Manual Purge Request</span>
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
                                    {queData?.length}
                                </h5>
                                <Link to="/manual-purge-request">
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
                            // data={queData}
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
                            conditionalRowStyles={conditionalRowStyles}
                            onRowClicked={setClickedRow}
                        />
                    </div>
                </div>
            </div>
            {modelStatus &&
                <ManualPurgeRequestModal setModelStatus={setModelStatus} editData={editData} />}
        </>
    )
}

export default ManualPurgeRequest

const ManualPurgeRequestModal = (props) => {
    const { setModelStatus, editData } = props;
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const reasonCaseDrpData = useSelector((state) => state.DropDown.reasonCaseDrpData);
    const [approvalAction, setApprovalAction] = useState('Approve');
    const [approvalComments, setApprovalComments] = useState('');
    const [previousComment, setPreviousComment] = useState('');

    useEffect(() => {
        if (localStoreData?.AgencyID) {
            if (reasonCaseDrpData?.length === 0) dispatch(getDropDownReasonCase(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const handleClear = () => {
        setApprovalAction('Approve');
        setApprovalComments('');
    };

    const handleSave = () => {
        // Handle save logic here
        console.log('Save clicked', { approvalAction, approvalComments });
        // Add your save API call here
    };
    console.log("reasonCaseDrpData", reasonCaseDrpData)
    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content p-2 px-4 approvedReportsModal" style={{ minHeight: '280px', overflowY: "scroll " }}>
                    <div className="d-flex justify-content-between">
                        <div className='row mt-1 mb-2'>
                            <div className='col-12'>
                                <h5 className="fw-bold">
                                    Request Manual Purge
                                </h5>
                            </div>
                        </div>
                        <button className="btn-close b-none bg-transparent" onClick={() => { setModelStatus(false); }} data-dismiss="modal">X</button>
                    </div>

                    {/* Request Details Section */}
                    <div className="mt-3">
                        {/* Row 1: RMS Case #, Incident #, Submitted By, Submitted DT/TM */}
                        <div className="row mb-3">
                            <div className="col-md-3">
                                <div className="d-flex align-items-center">
                                    <label className="form-label fw-bold mb-0 me-2" style={{ minWidth: '100px' }}>RMS Case #:</label>
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        value={editData?.RMSCaseNumber || ''}
                                        readOnly
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex align-items-center">
                                    <label className="form-label fw-bold mb-0 me-2" style={{ minWidth: '80px' }}>Incident #:</label>
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        value={editData?.IncidentNumber || ''}
                                        readOnly
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex align-items-center">
                                    <label className="form-label fw-bold mb-0 me-2" style={{ minWidth: '100px' }}>Submitted By:</label>
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        value={editData?.CreateOfficer || ''}
                                        readOnly
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="d-flex align-items-center">
                                    <label className="form-label fw-bold mb-0 me-2" style={{ minWidth: '120px' }}>Submitted DT/TM:</label>
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        value={editData?.CreatedDtTm ? getShowingMonthDateYear(editData.CreatedDtTm) : ''}
                                        readOnly
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Row 2: Reason, Date/Time, Attachment */}
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <label className="form-label fw-bold mb-0 me-2" style={{ minWidth: '70px' }}>Reason:</label>
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        value={reasonCaseDrpData?.find(item => item.ReasonID === editData?.ReasonID)?.ReasonCode || ''}
                                        readOnly
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <label className="form-label fw-bold mb-0 me-2" style={{ minWidth: '80px' }}>Date/Time:</label>
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        value={editData?.ManualDateTime ? getShowingMonthDateYear(editData.ManualDateTime) : ''}
                                        readOnly
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="d-flex align-items-center">
                                    <label className="form-label fw-bold mb-0 me-2" style={{ minWidth: '90px' }}>Attachment:</label>
                                    <div className="flex-grow-1">
                                        {editData?.Attachment ? (
                                            <a href={editData.Attachment} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
                                                {editData.AttachmentName || 'File.Pdf'}
                                            </a>
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Requester Notes */}
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="d-flex align-items-start">
                                    <label className="form-label fw-bold mb-0 me-2" style={{ minWidth: '140px', paddingTop: '8px' }}>Requester Notes:</label>
                                    <textarea
                                        className="form-control py-1 new-input flex-grow-1"
                                        rows="2"
                                        value={editData?.RequesterNote || ''}
                                        readOnly
                                        style={{ backgroundColor: '#f5f5f5' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Approval Action Section */}
                    <div className="mt-1">
                        {/* Radio Buttons */}
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="form-check form-check-inline mr-4">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="approvalAction"
                                        id="approve"
                                        value="Approve"
                                        checked={approvalAction === 'Approve'}
                                        onChange={(e) => setApprovalAction(e.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="approve">
                                        Approve
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="approvalAction"
                                        id="reject"
                                        value="Reject"
                                        checked={approvalAction === 'Reject'}
                                        onChange={(e) => setApprovalAction(e.target.value)}
                                    />
                                    <label className="form-check-label" htmlFor="reject">
                                        Reject
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* Previous Comment */}
                        <div className="row">
                            <div className="col-6">
                                <label className="form-label fw-bold mb-2">Previous Comment</label>
                                <textarea
                                    className="form-control py-1 new-input"
                                    rows="4"
                                    value={previousComment}
                                    placeholder="Placeholder"
                                    readOnly
                                    style={{ backgroundColor: '#e9ecef' }}
                                />
                            </div>
                            <div className="col-6">
                                <label className="form-label fw-bold mb-2">Enter Approval Comments Here</label>
                                <textarea
                                    className="form-control py-1 new-input requiredColor"
                                    rows="4"
                                    value={approvalComments}
                                    onChange={(e) => setApprovalComments(e.target.value)}
                                    placeholder="Placeholder"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="d-flex justify-content-end mt-4 mb-3" style={{ gap: '10px' }}>
                        <button
                            type="button"
                            className="btn"
                            onClick={handleClear}
                            style={{ backgroundColor: '#17a2b8', color: '#fff', borderColor: '#17a2b8' }}
                        >
                            Clear
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
    )
}