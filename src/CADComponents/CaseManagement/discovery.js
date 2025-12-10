import React, { useState } from 'react'
import Select from "react-select";
import { colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../Components/Common/Utility';

function Discovery() {
    const [reportType, setReportType] = useState()
    const [preparedBy, setPreparedBy] = useState()
    const [status, setStatus] = useState()

    const tableData = [
        {
            "Item": "Forensic Fingerprint Report",
            "Type": "Evidence",
            "IncidentNumber": "25-000371"
        },
        {
            "Item": "Witness Statement - John Doe",
            "Type": "Witness Statement",
            "IncidentNumber": "25-000371"
        },
        {
            "Item": "CCTV Footage - Incident",
            "Type": "Video Evidence",
            "IncidentNumber": "25-000371"
        }
    ]



    const columns = [
        {
            name: 'Item',
            selector: row => row.Item,
        },
        {
            name: 'Type',
            selector: row => row.Type,
        },
        {
            name: 'IncidentNumber',
            selector: row => row.IncidentNumber,
        },
        {
            name: 'Status',
            cell: row => <Select
                isClearable
                options={[]}
                placeholder="Select..."
                styles={colorLessStyle_Select}
                getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                getOptionValue={(v) => v?.PriorityCode}
                formatOptionLabel={(option, { context }) => {
                    return context === 'menu'
                        ? `${option?.PriorityCode} | ${option?.Description}`
                        : option?.PriorityCode;
                }}
                className="w-50 ml-2"
                name="priorityCode"
                value={reportType}
                onChange={(e) => { setReportType(e); }}
                onInputChange={(inputValue, actionMeta) => {
                    if (inputValue.length > 12) {
                        return inputValue.slice(0, 12);
                    }
                    return inputValue;
                }}
            />,
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>View</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        <button
                            className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                            type="button"
                        >
                            <i className="fa fa-eye"></i>
                        </button>
                    }
                </div>,
            width: '100px',
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        <button
                            className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                            type="button"
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    }
                </div>,
            width: '100px',
        },
    ];

    return (
        <div className='col-12 col-md-12 col-lg-12'>
            <div className='border border-dark rounded p-2'>
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Court & Filing Details</h6>
                    <button className="btn btn-primary btn-sm" >
                        Add Item
                    </button>
                </div>
                <div className="table-responsive mt-2">
                    <DataTable
                        dense
                        columns={columns}
                        data={tableData}
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


        </div>
    )
}

export default Discovery