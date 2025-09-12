import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../Common/Utility';
import { fetchPostData } from '../../hooks/Api';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import Select from 'react-select';

const Reports = (props) => {
    const { DecArrestId } = props;
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID')
        ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
        : '';

    const [logData, setLogData] = useState([]);
    const [ArrestID, setArrestID] = useState('');

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (DecArrestId) {
            get_LogData(DecArrestId);
            setArrestID(DecArrestId);
        }
    }, [DecArrestId]);

    useEffect(() => {
        if (ArrestID) {
            get_LogData(ArrestID);
        }
    }, [ArrestID]);

    const get_LogData = (ArrestID) => {
        const val = {
            ArrestID: ArrestID,
        };
        fetchPostData('Log/GetData_ArrestLog', val).then((res) => {
            if (res) {
                setLogData(res);
            } else {
                setLogData([]);
            }
        });
    };

    const columns = [
        {
            name: 'Property#',
            selector: (row) => row.ColumnName,
            sortable: true,
        },
        {
            name: 'Expected',
            selector: (row) => row.OldValue,
            sortable: true,
        },
        {
            name: 'Observed',
            selector: (row) => row.NewValue,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => row.ChangeDate,
            sortable: true,
        },
        {
            name: 'Action',
            selector: (row) => row.Officer_Name,
            sortable: true,
        },
        {
            name: 'Attachments',
            selector: (row) => row.Module,
            sortable: true,
        },
    ];

    return (
        <div className="col-12 px-0 mt-1">

            {/* Audit Header Section */}
            <div className="audit-header-box  mb-3 ">
                {/* <h6 className="font-weight-bold mb-3">Audit Closeout Report</h6> */}
                {/* <div className="row mb-3"> */}
                {/* <div className="d-flex gap-2 align-items-end">
                        <select className="form-control">
                            <option value="all">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="in-progress">In Progress</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Search Property #"
                            className="form-control"
                        />
                    </div> */}
                <div className="plan-audit__header">
                    <h4 className="plan-audit__title mb-3">Audit Closeout Report</h4>
                    <div className="plan-audit__stats align-items-center">
                        <div className="">
                            <Select
                                name='PermissionTypeID'
                                styles
                                // value={''}
                                // options={''}
                                // onChange={''}
                                placeholder="All Status"
                            />

                        </div>
                        <div className='text-field mt-0'>
                            <input type="text" placeholder="Search property #" style={{ height: '38px' }} name='DocumentName' required autoComplete='off' />
                        </div>
                    </div>
                </div>

                {/* </div> */}
                <div className="row">
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                        <label htmlFor="" className='new-label'>Audit Type</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field  mt-1">
                        <input type="text" name='Style' id='Style' className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                        <label htmlFor="" className='new-label'>Period</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field  mt-1">
                        <input type="text" name='Finish' id='Finish' className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                        <label htmlFor="" className='new-label'>Location</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field  mt-1">
                        <input type="text" name='Caliber' maxLength={10} id='Caliber' className='' required autoComplete='off' />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                        <label htmlFor="" className='new-label'>Team</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field  mt-1">
                        <input type="text" name='Handle' id='Handle' className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                        <label htmlFor="" className='new-label'>Supervisor</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 text-field  mt-1">
                        <input type="text" name='Handle' id='Handle' className='' required autoComplete='off' />
                    </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="badge badge-light mr-2">Matches: 1</span>
                    <span className="badge badge-light mr-2">Mismatches: 0</span>
                    <span className="badge badge-light mr-2">Missing: 7</span>
                    <span className="badge badge-light mr-2">Completion: 100%</span>
                </div>
            </div>

            {/* Data Table Section */}
            <DataTable
                dense
                columns={columns}
                data={logData ? logData : []}
                pagination
                selectableRowsHighlight
                highlightOnHover
                customStyles={tableCustomStyles}
                persistTableHead={true}
                paginationPerPage={13}
                paginationRowsPerPageOptions={[13]}
            />

            {/* Button Actions */}
            <div className="btn-box text-right mr-1 mb-2 mt-2">
                <button type="button" className="btn btn-sm btn-success mr-1">
                    Export Reconciliation CSV
                </button>
                <button type="button" className="btn btn-sm btn-success mr-1">
                    Finalize & Build Report
                </button>
            </div>
        </div>
    );
};

export default Reports;
