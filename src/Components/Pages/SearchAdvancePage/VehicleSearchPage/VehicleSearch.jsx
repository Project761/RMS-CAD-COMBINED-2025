import React, { useContext, useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, colourStyles, getShowingMonthDateYear, stringToBase64, tableCustomStyles } from '../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { AgencyContext } from '../../../../Context/Agency/Index';
import DeletePopUpModal from '../../../Common/DeleteModal';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import OtherSummaryModel from '../../SummaryModel/OtherSummaryModel';
import { useReactToPrint } from 'react-to-print';
import * as XLSX from 'xlsx';
import VehiclePrintReport from './VehiclePrintReport';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const VehicleSearch = ({ isCAD = false }) => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { vehicleSearchData, setVehicleSearchData, searchObject, setSearchObject } = useContext(AgencyContext)

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };


    const exportToExcel = () => {
        const filteredData = vehicleSearchData?.map(item => ({
            'Incident Number': item.IncidentNumber,
            'Vehicle Number': item.VehicleNumber,
            'VIN': item.VIN,
            'Plate Type': item.PlateType_Description,
            'Category': item.Category_Description,
            'Classification': item.Classification_Description,
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


    const query = useQuery();
    let openPage = query?.get("page");
    let Recent = query?.get("Recent");


    const [loginPinID, setLoginPinID,] = useState('');
    const [masterVehicleId, setMasterVehicleId] = useState('');
    const [otherColID, setOtherColID] = useState('');
    const [otherUrl, setOtherUrl] = useState('');
    const [updateCount, setupdateCount] = useState(1);
    const [otherColName, setOtherColName] = useState('');
    const [otherSummModal, setOtherSummModal] = useState(false);
    const [incSummModal, setIncSummModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [recentVehicleSearchData, setRecentVehicleSearchData] = useState([]);

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
            grow: 0,
            minWidth: "70px",
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
                            setOtherUrl('Summary/VehicleSummary');
                            setModalTitle("Vehicle Summary");
                        }}
                    >
                        MS
                    </a>
                </div>
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            grow: 0,
            minWidth: "70px",
            cell: row =>
                <span onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-edit"></i>
                </span>
        },

        {
            name: 'Agency Code',
            selector: (row) => row.Agency_Code,
            sortable: true
        },
        {
            name: 'Vehicle Number',
            selector: (row) => row.VehicleNumber,
            sortable: true
        },
        {
            name: 'Plate State No.',
            selector: (row) => row.VehicleNo,
            sortable: true
        },
        {
            name: ' VIN',
            selector: (row) => row.VIN,
            sortable: true
        },
        {
            name: 'Plate Type',
            selector: (row) => row.PlateType_Description,
            sortable: true
        },
        {
            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },

        {
            name: 'Make/Model',
            selector: (row) => row.Make || row.Model,
            sortable: true
        },
        {
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
        // {
        //     name: 'Evidence Flag',
        //     selector: (row) => row.IncidentNumber,
        //     sortable: true
        // },
        {
            name: 'Evidence Flag',
            selector: row => (
                <input type="checkbox" checked={row.IsEvidence === true} disabled />
            ),
            sortable: true
        },
        {
            name: '  Owner Nmae',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        // {
        //     name: 'Last Updated Date',
        //     selector: (row) => row.LastModifyDate ? getShowingMonthDateYear(row.LastModifyDate) : '',
        //     sortable: true
        // },
        {
            width: '150px',
            name: 'Last Updated Date',
            selector: (row) => (
                <span title={row?.LastModifyDate ? getShowingMonthDateYear(row.LastModifyDate) : ''}>
                    {row?.LastModifyDate ? getShowingMonthDateYear(row.LastModifyDate) : ''}
                </span>
            ),
            sortable: true
        }
    ]
    const set_Edit_Value = (e, row) => {
        if (row.MasterPropertyID) {
            if (isCAD) {
                navigate(`/cad/vehicle_search?page=MST-Vehicle-Dash&VehId=${stringToBase64(row?.VehicleID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&ModNo=${row?.VehicleNumber}&VehSta=${true}`)
            } else {
                navigate(`/Vehicle-Home?page=MST-Vehicle-Dash&VehId=${stringToBase64(row?.VehicleID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&ModNo=${row?.VehicleNumber}&VehSta=${true}`)
            }
        }
    }

    const Delete_Vehicle = () => {
        const val = { 'MasterPropertyID': masterVehicleId, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('MainMasterVehicle/Delete_MainMasterVehicle', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
            } else {
                console.log("Something Wrong")
            }
        })
    }

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
        navigate('/cad/query_incident/vehicleSearch', { state: { searchState: location.state?.searchState, fromRefineSearch: true, } })
    }

    useEffect(() => {
        if (Recent && Recent === 'Vehicle' && searchObject?.SearchModule === 'Veh-Search') { setVehicleSearchData([]); getVehicleRecentSearchData(searchObject); }
    }, [Recent, searchObject]);

    const getVehicleRecentSearchData = (searchObject) => {
        fetchPostData('PropertyVehicle/Search_PropertyVehicle', searchObject).then((res) => {
            if (res) {
                setRecentVehicleSearchData(res);

            } else {
                setRecentVehicleSearchData([]);

            }
        })
    }

    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency name-card">
                            <div className="card-body">
                                <div className="row">
                                    <div className={`col-12 ${isCAD ? "CAD-table" : ""}`}>
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={Recent === 'Vehicle' && searchObject?.SearchModule === 'Veh-Search' ? recentVehicleSearchData : vehicleSearchData}
                                            // data={vehicleSearchData ? vehicleSearchData : recentVehicleSearchData}
                                            selectableRowsHighlight
                                            highlightOnHover
                                            fixedHeader
                                            pagination
                                            paginationPerPage={'100'}
                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                            showPaginationBottom={100}
                                            persistTableHead={true}
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
            <DeletePopUpModal func={Delete_Vehicle} />
            <OtherSummaryModel
                {...{ otherSummModal, setOtherSummModal, updateCount, openPage, modalTitle }}
                otherColName={otherColName}
                otherColID={otherColID}
                otherUrl={otherUrl}
            />
            {selectedStatus && (
                <div style={{ position: 'absolute', top: '-100000px', left: '-100000px' }}>
                    <VehiclePrintReport  {...{ componentRef, selectedStatus, setSelectedStatus, vehicleSearchData, searchData }} />
                </div>
            )}
        </>
    )
}

export default VehicleSearch