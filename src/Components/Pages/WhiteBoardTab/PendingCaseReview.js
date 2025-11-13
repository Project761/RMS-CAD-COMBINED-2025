import React, { useState, useEffect } from 'react'
import Select from "react-select";
import { colorLessStyle_Select } from '../../../CADComponents/Utility/CustomStylesForReact'
import DatePicker from "react-datepicker";
import DataTable from 'react-data-table-component';
import { getShowingDateText, tableCustomStyles } from '../../../Components/Common/Utility';
import { useSelector } from 'react-redux';
import CaseManagementServices from '../../../CADServices/APIs/caseManagement';
import { useQuery } from 'react-query';
import Tooltip from '../../../CADComponents/Common/Tooltip';

function PendingCaseReview() {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [officerFilter, setOfficerFilter] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [pendingCaseReviewData, setPendingCaseReviewData] = useState([])

    const getPendingCaseReviewKey = `/CaseManagement/GetAllPendingCasesByAgencyID/${parseInt(localStoreData?.AgencyID)}`;
    const { data: getPendingCaseReviewData, isError: isNoData } = useQuery(
        [getPendingCaseReviewKey, {
            "AgencyID": parseInt(localStoreData?.AgencyID),
        },],
        CaseManagementServices.getPendingCaseReview,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!localStoreData?.AgencyID
        }
    );
    useEffect(() => {
        if (getPendingCaseReviewData) {
            const pendingCaseReviewData = JSON.parse(getPendingCaseReviewData?.data?.data)
            setPendingCaseReviewData(pendingCaseReviewData?.Table)
        }
    }, [getPendingCaseReviewData])

    const handleApplyFilters = () => {
        // Implement filter logic here
        console.log('Applying filters:', { searchTerm, statusFilter, officerFilter, startDate, endDate })
    }

    const handleClearFilters = () => {
        setSearchTerm('')
        setStatusFilter('All Statuses')
        setOfficerFilter('All Officers')
        setStartDate('')
        setEndDate('')
    }


    const incidentsColumns = [
        { name: "Incident #", selector: row => row.IncidentNumber, sortable: true, width: "150px" },
        {
            name: "NIBRS Code",
            cell: row => (
                <Tooltip
                    text={row.NIBRSCode || ''}
                    maxLength={15}
                    tooltipTextLimit={50}
                    isSmall={true}
                />
            ),
            sortable: true
        },
        {
            name: "Summary",
            cell: row => (
                <Tooltip
                    text={row.CrimeDetails || ''}
                    maxLength={20}
                    tooltipTextLimit={100}
                    isSmall={true}
                />
            )
        },
        { name: "Reporting Officer", selector: row => row.ReportingOfficer, width: "150px" },
        { name: "Date / Time", selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : "" },
        {
            name: "Auto-Flag",
            cell: row => (
                <span
                    style={{
                        padding: "4px 8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        backgroundColor: "#DC2626",
                        color: "#fff",
                    }}
                >
                    Mandatory Case
                </span>
            ),
            width: "150px"
        },
        {
            name: "Actions",
            cell: row => (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    <button
                        style={{
                            backgroundColor: "#007BFF",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            color: "#fff",
                            fontSize: "10px",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Open Case
                    </button>
                    <button
                        style={{
                            backgroundColor: "#F5F5F5",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            color: "#000",
                            fontSize: "10px",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Hold
                    </button>
                    <button
                        style={{
                            backgroundColor: "#DC2626",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            color: "#fff",
                            fontSize: "10px",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Dismiss
                    </button>
                </div>
            )
        }
    ];



    return (
        <div className="">
            <span className="fw-bold mb-0" style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>Pending Case Review</span>
            {/* Filter Section */}
            <div className="d-flex align-items-center mt-2" style={{ gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Search incidents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                />
                <Select
                    isClearable
                    options={[
                        { label: "Open", value: "Open" },
                        { label: "Closed", value: "Closed" },
                        { label: "Pending", value: "Pending" }
                    ]}
                    placeholder="Select..."
                    styles={colorLessStyle_Select}
                    className="w-100"
                    name="status"
                    value={statusFilter ? { label: statusFilter, value: statusFilter } : ""}
                    onChange={(e) => { setStatusFilter(e?.value); }}
                />
                <Select
                    isClearable
                    options={[
                        { label: "Ptl. Adams", value: "Ptl. Adams" },
                        { label: "Ptl. Brown", value: "Ptl. Brown" },
                        { label: "Det. Smith", value: "Det. Smith" }
                    ]}
                    placeholder="Select..."
                    styles={colorLessStyle_Select}
                    className="w-100"
                    name="officer"
                    value={officerFilter ? { label: officerFilter, value: officerFilter } : ""}
                    onChange={(e) => { setOfficerFilter(e?.value); }}
                />

                <DatePicker
                    name='startDate'
                    id='startDate'
                    onChange={(v) => setStartDate(v)}
                    selected={startDate || ""}
                    dateFormat="MM/dd/yyyy"
                    isClearable={!!startDate}
                    showMonthDropdown
                    showYearDropdown
                    className="mt-0"
                    dropdownMode="select"
                    autoComplete="off"
                    placeholderText="Select Start Date..."
                />
                <span className="text-muted">To</span>
                <DatePicker
                    name='startDate'
                    id='startDate'
                    onChange={(v) => setEndDate(v)}
                    selected={endDate || ""}
                    dateFormat="MM/dd/yyyy"
                    isClearable={!!endDate}
                    showMonthDropdown
                    showYearDropdown
                    className="mt-0"
                    dropdownMode="select"
                    autoComplete="off"
                    placeholderText="Select End Date..."
                />

                <button onClick={handleApplyFilters} className="btn btn-primary btn-sm text-nowrap">
                    Apply Filters
                </button>
                <button onClick={handleClearFilters} className="btn btn-outline-secondary btn-sm">
                    Clear
                </button>
            </div>
            <div className="table-responsive mt-2">
                <DataTable
                    dense
                    columns={incidentsColumns}
                    data={pendingCaseReviewData}
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
        </div>
    )
}

export default PendingCaseReview