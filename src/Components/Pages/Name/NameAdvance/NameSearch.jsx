import React, { useContext,} from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { stringToBase64 } from '../../../Common/Utility';


const NameSearch = () => {

    const navigate = useNavigate();
    const { nameSearch } = useContext(AgencyContext);

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        <span onClick={(e) => set_Edit_Value(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </span>
                    }
                </div>
        },
        {
            name: 'LastName',
            selector: (row) => <>{row?.LastName ? row?.LastName.substring(0, 10) : ''}{row?.LastName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'FirstName',
            selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'MiddleName',
            selector: (row) => <>{row?.MiddleName ? row?.MiddleName.substring(0, 10) : ''}{row?.MiddleName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            name: 'Address',
            selector: (row) => <>{row?.Address ? row?.Address.substring(0, 50) : ''}{row?.Address?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'IsAlias',
            selector: (row) => row.IsAlias,
            sortable: true
        },

    ]

    const set_Edit_Value = (row) => {
        if (row.NameID || row?.MasterNameID) {
            navigate(`/Name-Home?page=MST-Name-Dash&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&ModNo=${row?.NameNumber}&NameStatus=${true}`);
        }
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();

    
    
    return (
        <div className="section-body view_page_design pt-3">
            <div className="row clearfix" >
                <div className="col-12 col-sm-12">
                    <div className="card Agency">
                        <div className="card-body">
                            <div className="row  ">
                                <div className={`col-12 col-md-12`}>
                                    <div className="row">
                                        <div className="col-12  mt-2">
                                            <div className="row">
                                                <div className="col-12 ">
                                                    <DataTable
                                                        dense
                                                        columns={columns}
                                                        data={nameSearch?.length > 0 ? nameSearch : ''}
                                                        pagination
                                                        selectableRowsHighlight
                                                        highlightOnHover
                                                        paginationPerPage={'5'}
                                                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NameSearch


