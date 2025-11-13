import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../Components/Common/Utility';

function PropertyEvidence() {
    // Property/Evidence data
    const [propertyData] = useState([
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

    // Event handlers
    const handleAddNewProperty = () => {
        console.log('Add New Property clicked')
        // Here you would typically open a modal or navigate to add property form
    }

    const handleFormallyEnterEvidence = () => {
        console.log('Formally Enter as Evidence clicked')
        // Here you would typically open a modal or navigate to evidence entry form
    }

    const handleViewItem = (itemId) => {
        console.log('View item:', itemId)
        // Here you would typically open a modal or navigate to item details
    }

    const handleViewChain = (itemId) => {
        console.log('View chain for item:', itemId)
        // Here you would typically open a modal or navigate to chain of custody
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
        </div>
    )
}

export default PropertyEvidence