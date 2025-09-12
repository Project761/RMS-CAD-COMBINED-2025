import React, { useContext, useEffect, useRef, useState } from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { stringToBase64, tableMinCustomStyles } from '../../../Common/Utility';
import { fetchPostData } from '../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';
import EventPrintReport from '../../../../CADPage/EventSearch/EventPrintReport';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import Tooltip from '../../../../CADComponents/Common/Tooltip';
import CertificationPrintReport from './CertificationPrintReport';


function CertificationSearchList() {
    const { searchCertificationData } = useContext(AgencyContext);
    const dropDownData = [{ label: "Low", value: 1 }, { label: "Medium", value: 2 }, { label: "High", value: 3 }]

    const navigate = useNavigate();
    const location = useLocation();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const [selectedStatus, setSelectedStatus] = useState(false);
    const [searchData, setSearchData] = useState([])
    const [LoginAgencyID, setLoginAgencyID] = useState('');

    const set_Edit_Value = (row) => {
        if (row?.PINID) {
            navigate(`/personnelTab?Aid=${stringToBase64(row?.AgencyID)}&ASta=${true}&perId=${stringToBase64(row?.PINID)}&IncSta=true&perSta=true`)
        }
    }

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
            name: 'PIN',
            selector: (row) => <>{row?.PIN || ""} </>,
            sortable: true
        },
        {
            width: '130px',
            name: 'Last Name',
            selector: (row) => <>{row?.LastName || ""} </>,
            sortable: true
        },
        {
            width: '150px',
            name: 'First Name',
            selector: (row) => <>{row?.FirstName || ""} </>,
            sortable: true
        },
        {
            width: '130px',
            name: 'Middle Name',
            selector: (row) => row.MiddleName,
            sortable: true
        },
        {
            width: '90px',
            name: 'Gender',
            selector: (row) => row.Gender,
            sortable: true
        },
        {
            width: '250px',
            name: 'Priviledge Indicators',
            selector: (row) => row.SelectedColumns,
            sortable: true,
            cell: (row) => (
                <Tooltip text={row?.SelectedColumns || ''} maxLength={25} />
            ),
        },
        {
            name: 'Authenticator Assurance Level',
            selector: (row) => dropDownData?.find((i) => row.AuthenticatorAssuranceLevel === i.value)?.label || '',
            sortable: true,
        },
        {
            name: 'Federation Assurance Level',
            selector: (row) => dropDownData?.find((i) => row.FederationAssuranceLevel === i.value)?.label || '',
            sortable: true,
        },
        {
            name: 'Identity Assurance Level',
            selector: (row) => dropDownData?.find((i) => row.IdentityAssuranceLevel === i.value)?.label || '',
            sortable: true,
        },
    ]
    console.log("searchCertificationData", searchCertificationData)
    const exportToExcel = () => {
        const filteredData = searchCertificationData?.map(item => ({
            "PIN": item?.PIN,
            "Last Name": item?.LastName,
            "First Name": item?.FirstName,
            "Middle Name": item?.MiddleName,
            "Gender": item?.Gender,
            "Priviledge Indicators'": item?.SelectedColumns,
            "Authenticator Assurance Level": dropDownData?.find((i) => item.AuthenticatorAssuranceLevel === i.value)?.label,
            "Federation Assurance Level": dropDownData?.find((i) => item.FederationAssuranceLevel === i.value)?.label,
            "Identity Assurance Level": dropDownData?.find((i) => item.IdentityAssuranceLevel === i.value)?.label,
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
        navigate('/cad/query_incident/eventSearch', { state: { searchState: location.state?.searchState, fromRefineSearch: true, } })
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
                                                    <div className="col-12 CAD-table" >
                                                        <DataTable
                                                            dense
                                                            columns={businessColumns}
                                                            data={searchCertificationData}
                                                            selectableRowsHighlight
                                                            highlightOnHover
                                                            fixedHeader
                                                            pagination
                                                            paginationPerPage={'100'}
                                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                            showPaginationBottom={100}
                                                            persistTableHead={true}
                                                            customStyles={tableMinCustomStyles}
                                                            responsive
                                                            fixedHeaderScrollHeight='450px'
                                                        />
                                                    </div>
                                                    <div className="btn-box text-right col-12 mr-1 mt-4 pt-3 ">
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
                    <CertificationPrintReport  {...{ componentRef, selectedStatus, setSelectedStatus, searchCertificationData, searchData }} />
                </div>
            )}
        </>
    )
}

export default CertificationSearchList