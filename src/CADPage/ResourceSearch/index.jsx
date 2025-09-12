import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import DataTable from 'react-data-table-component';
import { AgencyContext } from '../../Context/Agency/Index';
import { Decrypt_Id_Name, getShowingDateText, stringToBase64, tableCustomStyles, tableMinCustomStyles } from '../../Components/Common/Utility';
import { fetchPostData } from '../../Components/hooks/Api';
import { get_LocalStoreData } from '../../redux/actions/Agency';
import * as XLSX from 'xlsx';
import ResourcePrintReport from './ResourcePrintReport';
import Tooltip from '../../CADComponents/Common/Tooltip';
import { compareStrings } from '../../CADUtils/functions/common';

const ResourceSearch = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { resourceData } = useContext(AgencyContext);

    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const [selectedStatus, setSelectedStatus] = useState(false);
    const [searchData, setSearchData] = useState([])
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const businessColumns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        <span onClick={(e) => set_Edit_Value(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </span>
                    }
                </div>,
            width: '50px',
        },
        {
            width: '120px',
            name: 'CAD Event #',
            selector: (row) => <>{row?.CADIncidentNumber || ""} </>,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.CADIncidentNumber, rowB?.CADIncidentNumber),
            sortable: true
        },
        {
            width: '160px',
            name: 'Reported DT/TM',
            selector: (row) => row.ReportedDate ? getShowingDateText(row.ReportedDate) : '',
            sortFunction: (rowA, rowB) => compareStrings(rowA?.ReportedDate, rowB?.ReportedDate),
            sortable: true
        },
        {
            width: '190px',
            name: 'Location',
            selector: (row) => row.CrimeLocation || '',
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.CrimeLocation, rowB?.CrimeLocation),
            cell: (row) => (
                <Tooltip text={row?.CrimeLocation || ''} maxLength={20} />
            ),
        },
        {
            width: '130px',
            name: 'Unit Type',
            selector: (row) => row.ResourceTypeCode,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.ResourceTypeCode, rowB?.ResourceTypeCode),
            sortable: true
        },
        {
            width: '130px',
            name: 'Unit #',
            selector: (row) => row.ResourceNumber,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.ResourceNumber, rowB?.ResourceNumber),
            sortable: true
        },
        {
            width: '155px',
            name: 'Reported CFS Code',
            selector: (row) => row.CFSCODE,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.CFSCODE, rowB?.CFSCODE),
            sortable: true
        },
        {
            width: '190px',
            name: 'Reported CFS Description',
            selector: (row) => <>{row?.CADCFSCode_Description || ""} </>,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.CADCFSCode_Description, rowB?.CADCFSCode_Description),
            sortable: true,
            cell: (row) => (
                <Tooltip text={row?.CADCFSCode_Description || ''} maxLength={15} />
            ),
        },
        {
            width: '80px',
            name: 'Shift',
            selector: (row) => <>{row?.ShiftCode || ""} </>,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.ShiftCode, rowB?.ShiftCode),
            sortable: true,
        },
        {
            width: '150px',
            name: 'Primary Officer',
            selector: (row) => <>{row?.primaryofficer || ""} </>,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.primaryofficer, rowB?.primaryofficer),
            sortable: true,
        },
        {
            width: '150px',
            name: 'Zone',
            selector: (row) => <>{row?.ZoneDescription || ""} </>,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.ZoneDescription, rowB?.ZoneDescription),
            sortable: true
        },
    ]

    const set_Edit_Value = (row) => {
        if (row?.IncidentID) {
            navigate(`/cad/dispatcher?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.CADIncidentNumber}&IncSta=true&key=resourceHistoryNew`)
        }
    }

    const exportToExcel = () => {
        const filteredData = resourceData?.map(item => ({
            "CAD Event #": item?.CADIncidentNumber,
            "RMS Incident #": item?.IncidentNumber,
            "Reported DT/TM": item?.ReportedDate,
            "Resource Type": item?.ResourceTypeCode,
            "Resource #": item?.ResourceNumber,
            "Status": item?.status,
            "CFS Code": item?.CFSCODE,
            "Description": item?.CADCFSCode_Description,
            "Primary Officer": item?.primaryofficer,
            "Operator": item?.UserName,
            "Zone": item?.ZoneDescription,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(parseInt(localStoreData?.AgencyID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (LoginAgencyID) {
            getAgencyImg(LoginAgencyID);
        }
    }, [LoginAgencyID]);

    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetData_AgencyWithPhoto', val).then((res) => {
            if (res) {
                setSearchData(res[0]);
            }
            else {
                setSearchData([]);
            }
        })
    }

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        // onAfterPrint: () => { '' },
        onAfterPrint: () => setSelectedStatus(false),
    })

    useEffect(() => {
        if (selectedStatus) {
            printForm();
            getAgencyImg(LoginAgencyID);
        }
    }, [selectedStatus]);

    const handleRefineSearch = () => {
        navigate('/cad/query_incident/resourceSearch', { state: { searchState: location.state?.searchState, fromRefineSearch: true, } })
    }

    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency name-card">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12  ">
                                                <div className="row">
                                                    <div className="col-12 CAD-table">
                                                        <DataTable
                                                            dense
                                                            columns={businessColumns}
                                                            data={resourceData}
                                                            selectableRowsHighlight
                                                            customStyles={tableMinCustomStyles}
                                                            highlightOnHover
                                                            fixedHeader
                                                            pagination
                                                            paginationPerPage={'100'}
                                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                            showPaginationBottom={100}
                                                            persistTableHead={true}
                                                            responsive
                                                            fixedHeaderScrollHeight='450px'
                                                        />
                                                    </div>
                                                    <div className="btn-box text-right col-12 mr-1 mt-4 pt-3 ">
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => handleRefineSearch()}>Refine Search</button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-primary mr-1"
                                                            onClick={() => setSelectedStatus(true)}
                                                        >
                                                            <i className="fa fa-print mr-1"></i>
                                                            Print Preview
                                                        </button>
                                                        <button type="button" onClick={exportToExcel} className="btn btn-sm btn-primary mr-1"
                                                        >
                                                            <i className="fa fa-file-excel-o mr-1" aria-hidden="true"></i>
                                                            Export to Excel</button>
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
            {selectedStatus && (
                <div style={{ position: 'absolute', top: '-100000px', left: '-100000px' }}>
                    <ResourcePrintReport  {...{ componentRef, selectedStatus, setSelectedStatus, resourceData, searchData }} />
                </div>
            )}
        </>
    )
}

export default ResourceSearch


