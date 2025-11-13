import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import Select from "react-select";
import { Modal, Button } from 'react-bootstrap'
import { getShowingDateText, tableCustomStyles } from '../../Common/Utility'
import { colorLessStyle_Select } from '../../../CADComponents/Utility/CustomStylesForReact';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import CaseManagementServices from '../../../CADServices/APIs/caseManagement';
import Tooltip from '../../../CADComponents/Common/Tooltip';
import { useNavigate } from 'react-router-dom';
import { getData_DropDown_Priority } from '../../../CADRedux/actions/DropDownsData';
import { useDispatch } from 'react-redux';
import { fetchPostData } from '../../hooks/Api';
import { threeColArray } from '../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../Common/AlertMsg';

function SupervisorCaseReview() {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedIncident, setSelectedIncident] = useState(null)
    const [caseStatus, setCaseStatus] = useState(null)
    const [comment, setComment] = useState('')
    const [supervisorCaseReviewData, setSupervisorCaseReviewData] = useState([])
    const [incidentStatusDrpDwn, setIncidentStatusDrpDwn] = useState([]);

    const getSupervisorCaseReviewKey = `/CaseManagement/GetAllSupervisorCases/${parseInt(localStoreData?.AgencyID)}`;
    const { data: getSupervisorCaseReviewData, isError: isNoData, refetch: refetchSupervisorCaseReview } = useQuery(
        [getSupervisorCaseReviewKey, {
            "AgencyID": parseInt(localStoreData?.AgencyID),
        },],
        CaseManagementServices.getAllSupervisorCases,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!localStoreData?.AgencyID
        }
    );

    useEffect(() => {
        if (getSupervisorCaseReviewData) {
            const supervisorCaseReviewData = JSON.parse(getSupervisorCaseReviewData?.data?.data)
            setSupervisorCaseReviewData(supervisorCaseReviewData?.Table)
        }
    }, [getSupervisorCaseReviewData])

    useEffect(() => {
        if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) {
            dispatch(getData_DropDown_Priority(localStoreData?.AgencyID));
        }
        getIncidentStatus(localStoreData?.AgencyID);
    }, [localStoreData])

    const getIncidentStatus = async (AgencyID) => {
        try {
            await fetchPostData("IncidentStatus/GetDataDropDown_IncidentStatus", { 'AgencyID': AgencyID }).then((res) => {

                if (res?.length > 0) {
                    console.log(res)
                    setIncidentStatusDrpDwn(threeColArray(res, "IncidentStatusID", "Description", "IncidentStatusCode"));
                } else {
                    setIncidentStatusDrpDwn([]);
                }
            })
        } catch (error) {
            console.error("Error in getIncidentStatus: ", error);
            setIncidentStatusDrpDwn([]);
        }
    };

    const handleWithoutAssignmentClick = (incident) => {
        setSelectedIncident(incident)
        setIsModalOpen(true)
    }

    const handleClear = () => {
        setCaseStatus(null)
        setComment('')
        setIsModalOpen(false)
    }

    const handleSave = async () => {
        const res = await CaseManagementServices.caseManagementCaseReviewWithoutAssignment({
            IncidentID: selectedIncident?.IncidentID,
            CaseStatusID: caseStatus?.value,
            CaseStatusCode: caseStatus?.id,
            CreatedByUserFK: localStoreData?.PINID,
            Comment: comment,
            AgencyID: localStoreData?.AgencyID,
            NIBRSStatus: caseStatus?.label,
        })
        if (res?.status === 200) {
            toastifySuccess("Data Saved Successfully")
            refetchSupervisorCaseReview()
            setIsModalOpen(false)
            handleClear()
        }
    }

    // Function to convert string to base64
    const stringToBase64 = (str) => {
        return btoa(unescape(encodeURIComponent(str)));
    }

    // Function to handle navigation to incident home
    const handleAssignClick = (row) => {
        const encodedIncId = stringToBase64(row?.IncidentID);
        const url = `/inc-case-management?IncId=${encodedIncId}&IncNo=${row?.IncidentNumber}&IncSta=${true}&IsCadInc=${false}`;
        navigate(url);
    }

    const columns = [
        {
            name: 'Incident ID',
            selector: row => row.IncidentNumber,
            sortable: true,
            width: "150px",
        },
        {
            name: 'Offense',
            selector: row => row.NIBRSCode,
            cell: row => (
                <Tooltip
                    text={row.NIBRSCode || ''}
                    maxLength={35}
                    tooltipTextLimit={50}
                    isSmall={true}
                />
            ),
            sortable: true,
        },
        {
            name: 'Date Reported',
            selector: row => row.ReportedDate ? getShowingDateText(row.ReportedDate) : '',
            sortable: true,
            width: "150px",
        },
        {
            name: 'Age Days',
            selector: row => {
                if (row.ReportedDate) {
                    const reportedDate = new Date(row.ReportedDate);
                    const currentDate = new Date();
                    const timeDiff = currentDate.getTime() - reportedDate.getTime();
                    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
                    return daysDiff;
                }
                return 0;
            },
            sortable: true,
            width: "100px",
        },
        {
            name: 'Primary Officer',
            selector: row => row.OfficerName,
            sortable: true,
            width: "200px",
        }, {
            name: "Actions",
            cell: row => (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    <button
                        onClick={() => handleWithoutAssignmentClick(row)}
                        style={{
                            backgroundColor: "#007BFF",
                            border: "none",
                            padding: "5px 8px",
                            borderRadius: "6px",
                            color: "#fff",
                            fontSize: "12px",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Without Assignment
                    </button>
                    <button
                        onClick={() => handleAssignClick(row)}
                        style={{
                            backgroundColor: "#007BFF",
                            border: "none",
                            padding: "5px 8px",
                            borderRadius: "6px",
                            color: "#fff",
                            fontSize: "12px",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Assign
                    </button>
                </div>
            ),
            width: "230px",
        }
    ]

    return (
        <div className="">
            <span className="fw-bold mb-0" style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>Supervisor Case Review</span>

            <div className="table-responsive mt-2">
                <DataTable
                    dense
                    columns={columns}
                    data={supervisorCaseReviewData}
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

            {/* Bootstrap Modal */}
            <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered size="lg">
                <Modal.Header>
                    <Modal.Title>Without Assignment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                        <label className="form-label fw-bold text-nowrap">Case Status</label>
                        <Select
                            value={caseStatus}
                            onChange={(e) => setCaseStatus(e)}
                            styles={colorLessStyle_Select}
                            placeholder="Select"
                            isClearable
                            options={incidentStatusDrpDwn}
                            className="w-100"
                            name="CaseStatus"
                        />
                    </div>

                    <div className="d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                        <label className="form-label fw-bold">Comment</label>
                        <textarea
                            className="form-control"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Placeholder"
                            rows="3"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClear}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default SupervisorCaseReview