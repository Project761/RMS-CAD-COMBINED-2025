import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData } from '../../../../hooks/Api';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';

const AuditLog = (props) => {
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
            name: 'Column Name',
            selector: (row) => row.ColumnName,
            sortable: true
        },
        {
            name: 'Old Value',
            selector: (row) => row.OldValue,
            sortable: true
        },
        {
            name: 'New Value',
            selector: (row) => row.NewValue,
            sortable: true
        },
        {
            name: 'Change Date',
            selector: (row) => row.ChangeDate,
            selector: (row) => row.ChangeDate ? getShowingDateText(row.ChangeDate) : " ",
            sortable: true
        },
        {
            name: 'Officer Name',
            selector: (row) => row.Officer_Name,
            sortable: true
        },
        {
            name: 'Module',
            selector: (row) => row.Module,
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => row.Status,
            sortable: true
        },
    ]

    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="col-12 px-0 mt-1">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditLog