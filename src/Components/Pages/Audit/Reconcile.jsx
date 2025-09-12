import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux';
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../Common/Utility';
import { fetchPostData } from '../../hooks/Api';
import { get_LocalStoreData } from '../../../redux/actions/Agency';

const Reconcile = (props) => {
    const { DecArrestId } = props
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';


    const [logData, setLogData] = useState([]);
    const [ArrestID, setArrestID] = useState('');

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);



    useEffect(() => {
        if (DecArrestId) {
            get_LogData(DecArrestId); setArrestID(DecArrestId);
        }
    }, [DecArrestId]);


    useEffect(() => {
        if (ArrestID) {
            get_LogData(ArrestID);
        }
    }, [ArrestID])

    const get_LogData = (ArrestID) => {
        const val = {
            "ArrestID": ArrestID,
        }
        fetchPostData('Log/GetData_ArrestLog', val).then((res) => {
            if (res) {
                setLogData(res);
            } else {
                setLogData([]);
            }
        })
    }

    const columns = [
        {
            name: 'Property#',
            selector: (row) => row.ColumnName,
            sortable: true
        },
        {
            name: 'Expected',
            selector: (row) => row.OldValue,
            sortable: true
        },
        {
            name: 'Observed',
            selector: (row) => row.NewValue,
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => row.ChangeDate,
            sortable: true
        },
        {
            name: 'Action',
            selector: (row) => row.Officer_Name,
            sortable: true
        },
        {
            name: 'Attachments',
            selector: (row) => row.Module,
            sortable: true
        },

    ]

    return (

        // <div className=" section-body pt-1 p-1 bt" >
        //     <div className="div">
        //         <div className="dark-row" >
        //             <div className="col-12 col-sm-12">
        //                 <div className="col-12 px-0 mt-1">
        //                     <DataTable
        //                         dense
        //                         columns={columns}
        //                         data={logData ? logData : []}
        //                         pagination
        //                         selectableRowsHighlight
        //                         highlightOnHover
        //                         customStyles={tableCustomStyles}
        //                         persistTableHead={true}
        //                         paginationPerPage={'13'}
        //                         paginationRowsPerPageOptions={[13]}
        //                     />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className="btn-box text-right mr-1 mb-2 mt-2">
        //             <button type="button" className="btn btn-sm btn-success mr-1 ">Export Reconciliation CSV</button>
        //             <button type="button" className="btn btn-sm btn-success mr-1 ">Finalize & Build Report</button>


        //         </div>
        //     </div>
        // </div>
        <div className="col-12 px-0 mt-1">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="plan-audit__title mb-3">Reconcile (Supervisor)</h4>
                <div>
                    <span className="badge badge-light mr-2">Matches: 1</span>
                    <span className="badge badge-light mr-2">Mismatches: 0</span>
                    <span className="badge badge-light mr-2">Missing: 7</span>
                    <span className="badge badge-light">Out (Temp Custody): 0</span>
                </div>
            </div>

            <DataTable
                dense
                columns={columns}
                data={logData ? logData : []}
                pagination
                selectableRowsHighlight
                highlightOnHover
                customStyles={tableCustomStyles}
                persistTableHead={true}
                paginationPerPage={'13'}
                paginationRowsPerPageOptions={[13]}
            />
            <div className="btn-box text-right mr-1 mb-2 mt-2">
                <button type="button" className="btn btn-sm btn-success mr-1 ">Export Reconciliation CSV</button>
                <button type="button" className="btn btn-sm btn-success mr-1 ">Finalize & Build Report</button>
            </div>
        </div>


    )
}

export default Reconcile