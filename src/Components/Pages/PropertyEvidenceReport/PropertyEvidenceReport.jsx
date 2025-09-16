import React, { useContext, useEffect, useRef, useState } from 'react'
import Loader from '../../Common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { customStylesWithOutColor, Decrypt_Id_Name, getShowingDateText, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { Incident_ID, Incident_Number } from '../../../redux/actionTypes';
import { fetchPostData, AddDeleteUpadate } from '../../hooks/Api';
import { toastifyError } from '../../Common/AlertMsg';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import CadPropertyModel from '../CadIncidents/CadPropertyModel';
import NonPropertyStorageList from '../CadIncidents/NonPropertyStorageList';
import Select from 'react-select';
import { AgencyContext } from '../../../Context/Agency/Index';
import AllPropertyRoomStorage from '../CadIncidents/AllPropertyRoomStorage';
import NonpropertyModel from '../CadIncidents/NonpropertyModel';


const PropertyEvidenceReport = ({ isPreview }) => {

    const [showModal, setShowModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loder, setLoder] = useState(false);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [queData, SetQueData] = useState();
    const [modelActivityStatus, setModelActivityStatus] = useState("");
    const [taskListID, setTaskListID] = useState('')
    const [rowData, setRowData] = useState();
    const [modalOpenStatus, setModalOpenStatus] = useState(false);
    const [dataSaved, setDataSaved] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedReportType, setSelectedReportType] = useState('AllPropertyRoomStorage');
    const { incidentFilterData, setIncidentFilterData, AllProRoomFilterData } = useContext(AgencyContext);
    const [newfiltered, setnewfiltered] = useState();
    const [Allfiltered, setAllfiltered] = useState();
    const [modalType, setModalType] = useState(""); // 'property' or 'nonproperty'
    const masterModalRef = useRef(null);
    const nonPropertyModalRef = useRef(null);



    const [currentReportType, setCurrentReportType] = useState({
        selectedReportType: 'AllPropertyRoomStorage',
    });


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("I034", localStoreData?.AgencyID, localStoreData?.PINID));
            getIncidentSearchData(localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (!modalOpenStatus && dataSaved) {
            setTimeout(() => {
                setDataSaved(false);
                getIncidentSearchData(localStoreData?.PINID);
            }, 1690);
            setModalType('')
        }
    }, [modalOpenStatus]);

    // api/Incident/GetData_CADIncident
    // AgencyID
    const getIncidentSearchData = async (AgencyID) => {
        fetchPostData('TaskList/GetDataDashBoardAll_TaskList', { 'OfficerID': parseInt(AgencyID) }).then((res) => {
            if (res.length > 0) {
                SetQueData(res); setLoder(true);
            } else {
                // toastifyError("No Data Available");
                setLoder(true); SetQueData([]);
            }
        });
    }


    // Delete Api call 
    const Delete_TaskList = () => {
        const val = { 'DeletedByUserFK': localStoreData?.loginPinID, 'TaskListID': "" }
        AddDeleteUpadate('TaskList/Delete_TaskList', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                // const message = parsedData.Table[0].Message;
                // toastifySuccess(message);
            } else { console.log("Somthing Wrong"); }
        }).catch((error) => {
            console.error("Error occurred:", error);
            toastifyError('Failed to Update Tasklist, Please try again.');
        })
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => (
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.Changeok ?
                                <Link
                                    to=""
                                    onClick={(e) => {
                                        e.preventDefault(); setRowData(row); set_IncidentId(row); setTaskListID(row?.TaskListID);


                                        if (row.IsSendToPropertyRoom) {
                                            setModelActivityStatus(row.Activity);
                                            setModalType("property"); setModalOpenStatus(true); setShowModal(true);
                                            setTimeout(() => {
                                                const modal = new window.bootstrap.Modal(masterModalRef.current);
                                                modal.show();
                                            }, 100);
                                        } else if (row.IsNonPropertyRoom) {
                                            setModalType("nonproperty"); setModalOpenStatus(true); setShowModal(true);
                                            setTimeout(() => {
                                                const modal = new window.bootstrap.Modal(nonPropertyModalRef.current);
                                                modal.show();
                                            }, 100);
                                        }
                                    }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                    style={{
                                        lineHeight: '1',
                                        minWidth: '22px',
                                        height: '22px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <i className="fa fa-edit" />
                                </Link>

                                : <></>
                            : <span
                                onClick={(e) => { set_IncidentId(row); }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                style={{
                                    lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                <i className="fa fa-edit" data-toggle="modal" data-target="#MasterModalProperty" style={{ fontSize: '10px' }}></i>
                            </span>
                    }
                </div>)
        },
        {
            name: 'Entry Date & Time', selector: (row) => ((row?.EnteryDtTm).replace("T", " & ")), sortable: true
        },
        {
            name: 'Property', selector: (row) => row.PropertyNumber, sortable: true
        },
        {
            name: 'Property Type', selector: (row) => row.Category_Description, sortable: true
        },
        {
            name: 'Reason Code', selector: (row) => row.PropertyReason, sortable: true
        },
        {
            name: 'Owner Name', selector: (row) => row.OwnerName, sortable: true
        },
        {

            name: 'Activity',
            cell: (row) => (
                <div style={{
                    color: 'red', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '4px 8px',
                    borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                }}> {row.Activity}
                </div>
            ),
            sortable: true
        }

    ]

    const set_IncidentId = (row) => {
        if (row.IncidentID) {
            dispatch({ type: Incident_ID, payload: row?.IncidentID });
            dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
        }
    }

    const onMasterPropClose = () => {
        navigate('/dashboard-page');
    }

    const HandleFilterChange = (e) => {
        const value = e.target.value
        let filtered = [...queData];
        const filteredData = queData.filter(item => item.PropertyNumber?.toLowerCase().includes(value.toLowerCase()) || item.Category_Description?.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filteredData);
    };

    const handleRadioChange = (e) => {
        e.preventDefault();
        setSelectedReportType(e.target.value);
        setCurrentReportType({
            selectedReportType: e.target.value,
        });
    };

    const [selectedOption, setSelectedOption] = useState(null);

    const StatusOption = [
        { value: "1", label: "CheckIn" },
        { value: "2", label: "CheckOut" },
        { value: "3", label: "Release" },
        { value: "4", label: "Destroy" },
        { value: "5", label: "Transfer Location" },
        { value: "6", label: "Update" }
    ];

    const handleChange = (option) => {
        setSelectedOption(option);
    };

    // useEffect(() => {
    //     // Reset selected filter when report type changes
    //     setSelectedOption(null);
    // }, [selectedReportType]);

    useEffect(() => {
        if (selectedOption) {
            if (selectedReportType === 'NonProperty') {
                const filtered = incidentFilterData?.filter(item => item.Activity === selectedOption.label);
                setnewfiltered(filtered);
            } else if (selectedReportType === 'AllPropertyRoomStorage') {
                const filtered = queData?.filter(item => item.Activity === selectedOption.label);
                setFilteredData(filtered);
            } else if (selectedReportType === 'all') {
                const filtered = AllProRoomFilterData?.filter(item => item.Activity === selectedOption.label);
                setAllfiltered(filtered);
            }
        } else {
            // User cleared the filter
            if (selectedReportType === 'NonProperty') {
                setnewfiltered(incidentFilterData || []);
            } else if (selectedReportType === 'AllPropertyRoomStorage') {
                setFilteredData(queData || []);
            } else if (selectedReportType === 'all') {
                setAllfiltered(AllProRoomFilterData || []);
            }
        }
    }, [selectedOption, selectedReportType, incidentFilterData, queData, AllProRoomFilterData]);


    return (
        <>
            <div className="col-12 col-sm-12">
                <div className="property-evidence">
                    <div className="text-end mt-2 d-flex w-100" style={{ justifyContent: "space-between", alignItems: "center", }}>
                        <div className="d-flex align-items-center ml-0">
                            {isPreview && (
                                <span className="mr-2" style={{ background: "#d6ecff", display: "flex", justifyContent: "center", alignItems: "center", width: "40px", height: "40px", borderRadius: "50%" }} >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="20">
                                        <path
                                            d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"
                                            fill="#002366"
                                        />
                                        <rect x="360" y="0" width="24" height="512" fill="red" />
                                    </svg>
                                </span>
                            )}
                            <span className="fw-bold mb-0 " style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>My Property & Evidence</span>
                        </div>
                        {/* Right side: Show count + "See All" if preview, else show Close */}
                        {isPreview ? (
                            <div className="d-flex align-items-center">
                                <div className="position-relative mr-3 ">
                                    <input type="text" name="IncidentNumber" id="IncidentNumber" className="form-control py-1 new-input" placeholder="Search......" onChange={(e) => { HandleFilterChange(e); }} autoComplete="off" />
                                </div>
                                <h5 className="mb-0 mr-3" style={{ fontSize: "18px", fontWeight: "600", color: '#334c65' }}>
                                    {queData?.length}
                                </h5>
                                <Link to="/PropertyEvidenceReport">
                                    <button className="see-all-btn mr-1 see_all-button" style={{ fontSize: "12px", padding: "4px 8px" }}>See All</button>
                                </Link>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center">
                                <div className="mr-3" style={{ width: "180px", height: "40px" }}>
                                    <Select
                                        options={StatusOption}
                                        value={selectedOption}
                                        onChange={handleChange}
                                        placeholder="Filter....."
                                        styles={customStylesWithOutColor}
                                        isClearable

                                    />
                                </div>
                                <button className="btn btn-outline-dark mr-3" style={{ backgroundColor: "#001f3f", color: "#fff" }}
                                    onClick={onMasterPropClose}>  Close </button>
                            </div>
                        )}
                    </div>
                    <div className='row gx-2 gy-2' style={{ margin: '0px 10px' }}>
                        {isPreview ? (
                            <>
                            </>
                        ) : (
                            <ul className="list-unstyled d-flex mb-0" style={{ gap: "25px" }}>
                                <li className="form-check">
                                    <input className="form-check-input" type="radio" value="AllPropertyRoomStorage" name="AttemptCompletenew" id="AllPropertyRoomStorage"
                                        checked={selectedReportType === 'AllPropertyRoomStorage'} onChange={handleRadioChange} />
                                    <label className="form-check-label" htmlFor="AllPropertyRoomStorage"> All Property Room Storage </label>
                                </li>
                                <li className="form-check">
                                    <input className="form-check-input" type="radio" value="all" name="AttemptCompletenew" id="all" checked={selectedReportType === 'all'} onChange={handleRadioChange} />
                                    <label className="form-check-label" htmlFor="all"> Property Room Storage</label>
                                </li>

                                <li className="form-check ml-2">
                                    <input className="form-check-input" type="radio" value="NonProperty" name="AttemptCompletenew" id="NonProperty" checked={selectedReportType === 'NonProperty'} onChange={handleRadioChange} />
                                    <label className="form-check-label" htmlFor="NonProperty">  Non Property Room Storage </label>
                                </li>
                            </ul>
                        )}
                    </div>
                    {selectedReportType === 'all' && <AllPropertyRoomStorage selectedReportType={selectedReportType} Allfiltered={Allfiltered} />}
                    {selectedReportType === 'NonProperty' && <NonPropertyStorageList newfiltered={newfiltered} />}

                    <div className="pt-2 property-evidence-datatable mt-2">
                        {selectedReportType === 'AllPropertyRoomStorage' && (
                            <>
                                {
                                    loder ?
                                        <DataTable
                                            className={isPreview ? 'table-responsive_pastdues datatable-grid' : ''}
                                            columns={columns}
                                            persistTableHead={true}
                                            dense
                                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? filteredData?.length > 0 ? filteredData : queData : [] : ""}
                                            pagination
                                            paginationPerPage={'100'}
                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                            fixedHeader={true}
                                            showPaginationBottom={100}
                                            highlightOnHoverd
                                            responsive
                                            fixedHeaderScrollHeight='400px'
                                            customStyles={tableCustomStyles}
                                            subHeaderAlign='left'
                                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                        />
                                        :
                                        <Loader />
                                }
                            </>
                        )}
                    </div>
                </div>
            </div>
            {
                modalType === "property" && (
                    <CadPropertyModel
                        show={showModal}
                        modalOpenStatus={modalOpenStatus}
                        setDataSaved={setDataSaved}
                        setModalOpenStatus={(bool) => setModalOpenStatus(bool)}
                        taskListID={taskListID}
                        masterModalRef={masterModalRef}
                        setModalType={setModalType}
                        modalType={modalType}
                        selectedReportType={selectedReportType}
                        rowData={rowData}
                        handleClose={() => setShowModal(false)}
                        setModelActivityStatus={setModelActivityStatus}
                        SetQueData={SetQueData}
                        modelActivityStatus={modelActivityStatus}
                        getIncidentSearchData={getIncidentSearchData}
                    />
                )
            }

            {
                modalType === "nonproperty" && (
                    <NonpropertyModel
                        show={showModal}
                        modalOpenStatus={modalOpenStatus}
                        setDataSaved={setDataSaved}
                        setModalOpenStatus={(bool) => setModalOpenStatus(bool)}
                        propertyID={rowData?.PropertyID}
                        masterPropertyID={rowData?.MasterPropertyID}
                        taskListID={taskListID}
                        nonPropertyModalRef={nonPropertyModalRef}
                        rowData={rowData}
                        handleClose={() => setShowModal(false)}
                        setModelActivityStatus={setModelActivityStatus}
                        modelActivityStatus={modelActivityStatus}
                        getIncidentSearchData={getIncidentSearchData}
                    />
                )
            }

            {/* <CadPropertyModel show={showModal} modalOpenStatus={modalOpenStatus} setDataSaved={setDataSaved} setModalOpenStatus={(bool) => { setModalOpenStatus(bool) }} taskListID={taskListID} rowData={rowData} handleClose={() => setShowModal(false)} setModelActivityStatus={setModelActivityStatus} modelActivityStatus={modelActivityStatus} getIncidentSearchData={getIncidentSearchData} /> */}
        </>
    );
}
export default PropertyEvidenceReport;