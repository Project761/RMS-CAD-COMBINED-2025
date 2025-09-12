import { useState } from 'react'
import DataTable from 'react-data-table-component'
import { compareStrings } from '../../../../CADUtils/functions/common';
import NCICModal from '../../../NCICModal';
import Tooltip from '../../../Common/Tooltip';
import { tableMinCustomStyles } from '../../../../Components/Common/Utility';

function NCICHistoryTabSection() {
    const [openNCICModal, setOpenNCICModal] = useState(false);
    const columns = [
        {
            name: 'Queried On',
            selector: row => row.QueriedOn,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.QueriedOn, rowB.QueriedOn),
        },
        {
            name: 'Queried By',
            selector: row => row.QueriedBy,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.QueriedBy, rowB.QueriedBy),
        },
        {
            name: 'Query Type',
            selector: row => row.QueryType,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.QueryType, rowB.QueryType),
        },
        {
            name: 'Input',
            selector: row => row.Input,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Input, rowB.Input),
            width: "200px",
            cell: (row) => (
                <Tooltip text={row.Input || ''} maxLength={20} />
            ),
        },
        {
            name: 'Result',
            selector: row => row.Result,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Result, rowB.Result),
        },
        {
            name: 'Response Time',
            selector: row => row.ResponseTime,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ResponseTime, rowB.ResponseTime),
        },
        {
            name: 'View',
            selector: row => row?.View,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.View, rowB.View),
            width: "160px",
            cell: (row) => (
                <button className="save-button ml-2 text-nowrap"
                    data-toggle="modal"
                    data-target="#NCICModal"
                    // style={{ width: "8%" }}
                    onClick={() => {
                        setOpenNCICModal(true);
                    }}>Summary</button>
            ),
        },
    ];

    const data = [{
        QueriedOn: "07/14/2025",
        QueriedBy: "Admin 12345",
        QueryType: "Vehicle",
        Input: "Plate No./ RDX4451, Plate Expires/02/10/2028",
        Result: "True",
        ResponseTime: "10 seconds",
    }]

    return (
        <div>
            <DataTable
                dense
                columns={columns}
                data={data}
                persistTableHead={true}
                customStyles={tableMinCustomStyles}
                pagination
                responsive
                striped
                highlightOnHover
                minHeight="300px"
                fixedHeader
            />
            <NCICModal openNCICModal={openNCICModal} setOpenNCICModal={setOpenNCICModal} />
        </div>
    )
}

export default NCICHistoryTabSection