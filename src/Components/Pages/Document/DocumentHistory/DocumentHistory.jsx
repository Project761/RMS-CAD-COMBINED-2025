import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getShowingDateText, tableCustomStyles } from '../../../Common/Utility'
import { fetchPostData } from '../../../hooks/Api'

const DocumentHistory = ({ DecdocumentID }) => {

    const [DocumentHistoryData, setDocumentHistoryData] = useState([]);

    useEffect(() => {
        if (DecdocumentID) {
            get_DocumentHistory(DecdocumentID);
        }
    }, [DecdocumentID]);

    const get_DocumentHistory = (DecdocumentID) => {
        const val = { 'DocumentID': DecdocumentID }
        fetchPostData('DocumentHistory/GetData_DocumentHistory', val).then((res) => {
            if (res?.length > 0) {
                console.log(res)
                setDocumentHistoryData(res)
            } else {
                setDocumentHistoryData([]);
            }
        })
    }

    const columns = [
        {
            width: '700px',
            name: 'View Date',
            selector: (row) => row.ViewDate ? getShowingDateText(row.ViewDate) : " ",
            sortable: true
        },
        {
            width: '700px',
            name: 'Officer',
            selector: (row) => row.Officer,
            sortable: true
        },
    ]
    console.log(DecdocumentID)

    return (
        <div className="col-12 px-0 mt-3">
            <DataTable
                dense
                columns={columns}
                data={DocumentHistoryData}
                noDataComponent={'There are no data to display'}
                selectableRowsHighlight
                highlightOnHover
                customStyles={tableCustomStyles}
                pagination
                paginationPerPage={'100'}
                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                showPaginationBottom={100}
                fixedHeader
                persistTableHead={true}
                fixedHeaderScrollHeight='450px'
            />
        </div>

    )
}

export default DocumentHistory