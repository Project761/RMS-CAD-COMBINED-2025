import React, { useEffect, useState } from 'react'
import Loader from '../../../Common/Loader';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Decrypt_Id_Name, getShowingDateText, stringToBase64, tableCustomStyles } from '../../../Common/Utility';
import { Incident_ID, Incident_Number } from '../../../../redux/actionTypes';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import DatePicker from 'react-datepicker';
var FileSaver = require('file-saver');


const Nibrs_File_Model = ({ show, setShow, handleModel }) => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [showModal, setShowModal] = useState(true);
    const [loder, setLoder] = useState(false);
    const [incidentFilterData, setIncidentFilterData] = useState();
    const [modelActivityStatus, setModelActivityStatus] = useState("");
    const [search, setSearch] = useState(false);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const [error, setError] = useState({
        monthStatus: "",
        yearStatus: ""
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("N144", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (search) {
            if (check_Validation_Error()) {
                getIncidentSearchData(localStoreData?.PINID);
            }
            setSearch(false)
        }
    }, [search]);

    // api/Incident/GetData_CADIncident
    // AgencyID

    const getIncidentSearchData = async (AgencyID) => {

        fetchPostData('NIBRS/GetData_Nibrs', { 'CreatedYears': year, 'CreatedMonth': month }).then((res) => {

            if (res.length > 0) {
                setIncidentFilterData(res); setLoder(true);
            } else {
                toastifyError("No Data Available"); setLoder(true); setIncidentFilterData([]);

            }
        });

    }

    const check_Validation_Error = () => {

        setError({
            monthStatus: "",
            yearStatus: ""
        })
        let isValid = true;
        if (month === "" || month === null || Number.isNaN(month)) {
            setError((prevState) => ({
                ...prevState,
                monthStatus: "Please select month"
            }))
            isValid = false;
        }
        if (year === "") {
            setError((prevState) => ({
                ...prevState,
                yearStatus: "Please select year"
            }))
            isValid = false;
        }
        return isValid;
    }

    const downloadFile = async (fileUrl) => {
        try {

            const originalUrl = fileUrl;
            const lastSlashIndex = fileUrl?.lastIndexOf('/');
            // const updatedUrl = replaceDomain(originalUrl);

            FileSaver.saveAs(fileUrl, fileUrl?.substring(lastSlashIndex + 1));

        } catch (error) {
            console.log("🚀 ~ downloadFile ~ error:", error);
        }
    };

    const JustDate = (timestamp) => {
        const date = new Date(timestamp);

        // Format the date to "yyyy/MM/dd"
        const formattedDate = date.toISOString()?.split('T')[0];
        return formattedDate;
    }

    const columns = [
        // {
        //     width: "80px",
        //     // omit: incAdvSearchData == "kdsjfhkjsdfsdf" ? true : false,
        //     name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
        //     cell: row => (
        //         <div style={{ position: 'absolute', top: 4, }}>
        //             {
        //                 effectiveScreenPermission ?
        //                     effectiveScreenPermission[0]?.Changeok ?
        //                         <Link to=""
        //                             onClick={(e) => {
        //                                 set_IncidentId(row);

        //                                 setModelActivityStatus(row.Activity);
        //                             }}
        //                             className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
        //                             <i className="fa fa-edit" data-toggle="modal" data-target="#MasterModalProperty"></i>
        //                         </Link>
        //                         : <></>
        //                     : <Link to=""
        //                         onClick={(e) => { set_IncidentId(row); }}
        //                         className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
        //                         <i className="fa fa-edit" data-toggle="modal" data-target="#MasterModalProperty"></i>
        //                     </Link>
        //             }
        //         </div>)
        // },
        {
            // width: '140px',
            name: 'User Name',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            // width: '180px',
            name: 'Created Date',
            selector: (row) => (JustDate(row.CreatedDate)),
            sortable: true
        },
        // {
        //     width: '180px',
        //     name: 'Occurred  To',
        //     selector: (row) => row.OccurredTo ? getShowingDateText(row.OccurredTo) : " ",
        //     sortable: true
        // },

        // {
        //     width: '180px',
        //     name: 'RMS Disposition',
        //     selector: (row) => row.RMSDisposition_Desc,
        //     sortable: true
        // },

        {
            // width: '160px',
            name: 'Submission File',
            cell: (row) => {
                const fileName = row.SubmissionFilePath?.split('/').pop();
                return (
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => downloadFile(row.SubmissionFilePath)}
                    >
                        Download
                    </button>
                );
            },
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
        // {
        //     width: '180px',
        //     name: 'Activity',
        //     selector: (row) => row.Activity,
        //     sortable: true
        // },

    ]

    const set_IncidentId = (row) => {
        if (row.IncidentID) {
            dispatch({ type: Incident_ID, payload: row?.IncidentID });
            dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
        }
    }

    return (
        <>
            {
                show ?
                    <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)", zIndex: '' }} id="NibrsFileModel" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered  modal-xl">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="section-body mt-4" style={{ margin: '10px 10px 10px 15px' }}>
                                        <div className="col-12 mb-2 d-flex justify-content-between align-items-center">
                                            <div className="bg-green text-white py-1 px-2 ">
                                                <span className="ml-3">TIBRS Files</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setYear("");
                                                    setMonth("");
                                                    setIncidentFilterData([]);
                                                    handleModel()
                                                    setError({
                                                        monthStatus: "",
                                                        yearStatus: ""
                                                    })
                                                }}
                                                data-dismiss="modal"
                                                className="btn btn-sm "
                                                style={{ backgroundColor: "#001f3f", color: "#fff" }}
                                            >
                                                <b>X</b>
                                            </button>
                                        </div>

                                        <div className="row mb-1">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                <label className="new-label">Created Month:{error.monthStatus !== '' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{error.monthStatus}</p>
                                                ) : null}</label>
                                            </div>

                                            <div className="col-6 col-md-3 col-lg-2">
                                                <DatePicker
                                                    id='createdMonth'
                                                    name='createdMonth'
                                                    isClearable
                                                    dateFormat="MM"
                                                    selected={month ? new Date(2024, month - 1) : null}
                                                    onChange={(date) => setMonth(date?.getMonth() + 1)}
                                                    showMonthYearPicker
                                                    autoComplete="Off"
                                                    className=''
                                                    placeholderText={'Select...'}
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                <label htmlFor="" className='new-label'>Created Year:{error.yearStatus !== '' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{error.yearStatus}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-6 col-md-3 col-lg-2">
                                                <DatePicker
                                                    name='createdYear'
                                                    id='createdYear'
                                                    selected={year ? new Date(year, 0) : null}  // Display as a date
                                                    onChange={(date) => setYear(date?.getFullYear())}  // Store only the year (e.g., 2025)
                                                    showYearPicker
                                                    dateFormat="yyyy"
                                                    autoComplete="off"
                                                    placeholderText={'Select...'}
                                                //yearItemNumber={8}

                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => { setSearch(true); }}
                                                className="btn btn-sm "
                                                style={{ backgroundColor: "#001f3f", color: "#fff" }}
                                            >
                                                Search
                                            </button>
                                        </div>

                                        <div className="row clearfix">
                                            <div className="main-dashboard col-12 ">
                                                <div className="col-12 col-sm-12">
                                                    {
                                                        <DataTable
                                                            columns={columns}
                                                            persistTableHead={true}
                                                            dense
                                                            data={incidentFilterData}
                                                            // conditionalRowStyles={conditionalRowStyles}
                                                            pagination
                                                            paginationPerPage={'100'}
                                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                            showPaginationBottom={100}
                                                            // paginationRowsPerPageOptions={[10, 15, 20]}
                                                            highlightOnHover
                                                            // subHeader
                                                            responsive
                                                            // fixedHeaderScrollHeight='380px'
                                                            // fixedHeader
                                                            customStyles={tableCustomStyles}
                                                            // subHeaderComponent={''}
                                                            subHeaderAlign='left'
                                                            noDataComponent={'There are no data to display'}
                                                        />

                                                    }
                                                </div>


                                                <div className="col-3 col-md-3 col-lg-12 mt-2 px-1 d-flex justify-content-end">
                                                    <div>
                                                        {/* <button type="button" className="btn btn-sm mb-2 mt-1 mr-2" style={{ border: "1px solid #001f3f", color: "#000" }}>
                                                            Export
                                                        </button>
                                                        <button type="button" data-toggle="modal" data-target="#MasterModalProperty" className="btn btn-sm mb-2 mt-1 " style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={() => setShowModal(true)}>
                                                            Send

                                                        </button> */}
                                                    </div>


                                                </div>
                                            </div>
                                        </div >
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

        </>
    )
}

export default Nibrs_File_Model