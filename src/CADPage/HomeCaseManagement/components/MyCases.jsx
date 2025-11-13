import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { tableCustomStyles, tableMinCustomStyles } from '../../../Components/Common/Utility'
import { colorLessStyle_Select } from '../../../CADComponents/Utility/CustomStylesForReact'
import Select from "react-select";

const MyCases = () => {
    const [searchFilter, setSearchFilter] = useState('')
    const [status, setStatus] = useState('')
    // Sample case data based on the image description
    const casesData = [
        {
            id: '25-000371',
            title: 'Shooting at 5th & Main',
            status: 'Open',
            statusColor: 'primary',
            lastActivity: '2025-09-25',
            nextDeadline: 'Overdue by 2d',
            deadlineColor: 'danger',
            milestones: '3/5 Milestones'
        },
        {
            id: '25-000372',
            title: 'Burglary at Elm Street',
            status: 'Pending Closure',
            statusColor: 'warning',
            lastActivity: '2025-09-24',
            nextDeadline: '1d 4h Remaining',
            deadlineColor: 'warning',
            milestones: '2/5 Milestones'
        },
        {
            id: '25-000373',
            title: 'Vandalism at City Hall',
            status: 'Suspended',
            statusColor: 'secondary',
            lastActivity: '2025-09-22',
            nextDeadline: 'N/A',
            deadlineColor: 'muted',
            milestones: '1/5 Milestones'
        }
    ]

    const columns = [
        {
            name: 'Case ID',
            selector: (row) => row.id
        },

        {
            name: 'Title',
            selector: (row) => row.title
        },
        {
            name: 'Status',
            selector: (row) => row.status
        },
        {
            name: 'Last Activity',
            selector: (row) => row.lastActivity
        },
        {
            name: 'Next Deadline',
            selector: (row) => row.nextDeadline
        },
        {
            name: 'Milestones',
            selector: (row) => row.milestones
        },
        {
            name: 'Actions',
            selector: (row) => row.actions,
            cell: (row) => (<Select
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
                value={status ? { label: status, value: status } : ""}
                onChange={(e) => { setStatus(e?.value); }}
            />)
        }
    ]

    return (
        <div className="my-cases-container">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">My Cases</h5>
                <div className="search-container" style={{ width: '300px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by Case ID or Title..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        style={{ border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <div className="table-responsive">
                    <DataTable
                        dense
                        columns={columns}
                        data={casesData}
                        customStyles={tableMinCustomStyles}
                        pagination
                        responsive
                        striped
                        persistTableHead={true}
                        highlightOnHover
                        fixedHeader
                    />
                </div>
            </div>
        </div>
    )
}

export default MyCases
