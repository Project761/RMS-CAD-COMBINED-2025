import React, { useContext, useState, useEffect, useRef } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, colourStyles, getShowingDateText, getShowingMonthDateYear, stringToBase64, tableCustomStyles } from '../../../Common/Utility';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import DeletePopUpModal from '../../../Common/DeleteModal';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { useReactToPrint } from 'react-to-print';
import OtherSummaryModel from '../../SummaryModel/OtherSummaryModel';
import * as XLSX from 'xlsx';
import PropertyPrintReport from './PropertyPrintReport';
import { useDispatch } from 'react-redux';
// import { get_LocalStoreData } from '../../../../redux/api';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';

import { useSelector } from 'react-redux';

const PropertySearch = ({ isCAD = false }) => {
    const dispatch = useDispatch();

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const navigate = useNavigate();
    const location = useLocation();
    const { propertySearchData, setPropertySearchData, recentSearchData, setRecentSearchData, searchObject, setSearchObject } = useContext(AgencyContext);

    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [loginPinID, setLoginPinID] = useState('');
    const [otherSummModal, setOtherSummModal] = useState(false);
    const [incSummModal, setIncSummModal] = useState(false);
    const [otherColID, setOtherColID] = useState('');
    const [otherUrl, setOtherUrl] = useState('');
    const [updateCount, setupdateCount] = useState(1);
    const [otherColName, setOtherColName] = useState('')
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [recentProSearchData, setRecentProSearchData] = useState([]);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();

    let Recent = query?.get("Recent");

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

    const columns = [
        {
            width: '100px',
            cell: row =>
                <div className="div" >
                    {/* <a data-toggle="modal" data-target={`${row?.TransactionName == "Incident" ? "#IncSummaryModel" : "#OtherSummaryModel"}`} */}
                    <a data-toggle="modal" data-target="#OtherSummaryModel"
                        style={{ textDecoration: 'underline' }}
                        onClick={() => {

                            setupdateCount(updateCount + 1);
                            setOtherSummModal(true);
                            setOtherColName('MasterPropertyID');
                            setOtherColID(row?.MasterPropertyID);
                            setOtherUrl('Summary/PropertySummary');
                            setModalTitle("Property Summary");
                        }}
                    >
                        MS
                    </a>
                </div>
        },
        {
            width: '100px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span onClick={(e) => set_Edit_Value(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span >
                }
            </>
        },
        {
            width: '150px',
            name: 'Agency Code',
            selector: (row) => row.Agency_Code,
            sortable: true
        },

        {
            width: '150px',
            name: 'Property Number',
            selector: (row) => <>{row?.PropertyNumber} </>,
            sortable: true
        },
        {
            width: '150px',
            name: 'Property Type',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            width: '150px',
            name: 'Property Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            width: '150px',
            name: 'Property Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        {
            width: '150px',
            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            width: '150px',
            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDtTm ? getShowingMonthDateYear(row.ReportedDtTm) : '',
            sortable: true
        },
        {
            width: '150px',
            name: 'Property Value',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            width: '150px',
            name: 'Primary Officer',
            selector: (row) => row.PrimaryOfficer_Name,
            sortable: true
        },
        {
            name: 'Evidence Flag',
            selector: row => (
                <input type="checkbox" checked={row.IsEvidence === true} disabled />
            ),
            sortable: true
        },

        {
            width: '150px',
            name: 'Owner Name',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        // {
        //     width: '150px',
        //     name: 'Last Updated Date',
        //     selector: (row) => row.LastModifyDate ? getShowingMonthDateYear(row.LastModifyDate) : '',
        //     sortable: true
        // },
        {
            width: '150px',
            name: 'Last Updated Date',
            selector: (row) => (
                <span title={row?.LastModifyDate}>
                    {row?.LastModifyDate ? getShowingMonthDateYear(row.LastModifyDate) : ''}
                </span>
            ),
            sortable: true
        }

    ]

    const set_Edit_Value = (row) => {
        if (row.PropertyID || row.MasterPropertyID) {
            setMasterPropertyID(row.MasterPropertyID);
            if (isCAD) {
                navigate(`/cad/property_search?page=MST-Property-Dash&ProId=${stringToBase64(row?.PropertyID)}&MProId=${stringToBase64(row?.MasterPropertyID)}&ModNo=${row?.PropertyNumber?.trim()}&ProSta=${true}`);
            } else {
                navigate(`/Prop-Home?page=MST-Property-Dash&ProId=${stringToBase64(row?.PropertyID)}&MProId=${stringToBase64(row?.MasterPropertyID)}&ModNo=${row?.PropertyNumber?.trim()}&ProSta=${true}`);
            }
        }
    }

    const Delete_MasterProperty = () => {
        const val = { 'MasterPropertyID': masterPropertyID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('MainMasterProperty/Delete_MainMasterProperty', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
            } else {
                console.log("Something Wrong")
            }
        })
    }


    const exportToExcel = () => {
        const filteredData = propertySearchData?.map(item => ({
            'Incident Number': item.IncidentNumber,
            'Property Number': item.PropertyNumber,
            'Property Type': item.Description,
            'Property Category': item.Category_Description,
            'Property Classification': item.Classification_Description,
            'Loss Code': item.LossCode_Description,
            'Reported Date': item.ReportedDtTm ? getShowingDateText(item.ReportedDtTm) : " ",
            'Property Value': item.Value,
            'Owner': item.OwnerName,
            'Misc Description': item.Mis_Description,
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


    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };
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
        onAfterPrint: () => setSelectedStatus(false),
    })

    useEffect(() => {
        if (selectedStatus) {
            printForm();
            getAgencyImg(LoginAgencyID);
        }
    }, [selectedStatus]);

    const handleRefineSearch = () => {
        navigate('/cad/query_incident/propertySearch', { state: { searchState: location.state?.searchState, fromRefineSearch: true, } })
    }


    useEffect(() => {
        if (Recent && Recent === 'Property' && searchObject?.SearchModule === 'Pro-Search') { setPropertySearchData([]); getPropertyRecentSearchData(searchObject); }
    }, [Recent, searchObject]);

    const getPropertyRecentSearchData = (searchObject) => {
        fetchPostData('Property/Search_Property', searchObject).then((res) => {
            if (res) {
                setRecentProSearchData(res);
            }
            else {
                setRecentProSearchData([]);
            }
        })
    }

    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency name-card">
                            <div className="card-body">

                                <div className="row">

                                    <div className={`col-12 ${isCAD ? "CAD-table" : ""}`}>
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={Recent === 'Property' && searchObject?.SearchModule === 'Pro-Search' ? recentProSearchData : propertySearchData}
                                            // data={propertySearchData?.length > 0 ? propertySearchData : recentProSearchData}
                                            pagination
                                            selectableRowsHighlight
                                            highlightOnHover
                                            fixedHeader
                                            persistTableHead={true}
                                            paginationPerPage={'100'}
                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                            showPaginationBottom={100}
                                            customStyles={tableCustomStyles}
                                            responsive
                                            fixedHeaderScrollHeight='450px'
                                        />
                                    </div>
                                    <div className="btn-box text-right col-12 mr-1 mt-4 pt-3 ">
                                        {isCAD && <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => handleRefineSearch()}>Refine Search</button>}
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

            <DeletePopUpModal func={Delete_MasterProperty} />
            <OtherSummaryModel
                {...{ otherSummModal, setOtherSummModal, updateCount, modalTitle }}
                otherColName={otherColName}
                otherColID={otherColID}
                otherUrl={otherUrl}
            />
            {selectedStatus && (
                <div style={{ position: 'absolute', top: '-100000px', left: '-100000px' }}>
                    <PropertyPrintReport  {...{ componentRef, selectedStatus, setSelectedStatus, propertySearchData, searchData }} />
                </div>
            )}
        </>
    )
}

export default PropertySearch