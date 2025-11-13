import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, Decrypt_Id_Name, getShowingDateText, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_Report_Approve_Officer_Data, get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { toastifySuccess } from '../../Common/AlertMsg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import SelectBox from '../../Common/SelectBox';
import { get_Narrative_Type_Drp_Data } from '../../../redux/actions/DropDownsData';
import Loader from '../../Common/Loader';
import DraftReport from '../DraftReport/DraftReport';
import RejectedReports from '../RejectedReports/RejectedReports';
import ApprovedReports from '../ApprovedReports/ApprovedReports';
import AssignedReports from '../AssignedReports/AssignedReports';


function DashboardAll({ isPreview }) {


    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [clickedRow, setClickedRow] = useState(null);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState();
    const [editval, setEditval] = useState([]);
    const [narrativeID, setNarrativeID] = useState();
    const [queData, setqueData] = useState();
    const [modelStatus, setModelStatus] = useState(false);
    const [WrittenForID, setWrittenForID] = useState();
    const [loder, setLoder] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedReportType, setSelectedReportType] = useState('all');
    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            get_Data_Que_Report(localStoreData?.PINID, localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (modelStatus) {
            get_Data_Que_Report(loginPinID, loginAgencyID);
        }
    }, [modelStatus, selectedReportType]);

    const handleRadioChange = (e) => {
        setSelectedReportType(e.target.value);
    };


    const columns = [
        // {
        //     name: 'Action',
        //     selector: row => row.incident,
        //     sortable: true,
        //     wrap: true,
        //     grow: 0,
        //     cell: row => (
        //         <div style={{ position: 'absolute', top: 4 }}>
        //             {
        //                 effectiveScreenPermission ?
        //                     effectiveScreenPermission[0]?.Changeok ? (
        //                         <Link
        //                             to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
        //                             onClick={() => set_IncidentId(row)}
        //                         // className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
        //                         // style={{
        //                         //     lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
        //                         //     alignItems: 'center', justifyContent: 'center', borderRadius: '4px'
        //                         // }}
        //                         >
        //                             <button type="button"
        //                                 className="btn btn-sm btn-dark w-100 mb-1"
        //                                 style={{ backgroundColor: "#001f3f", color: "#fff", lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>Edit</button>
        //                         </Link>
        //                     ) : null
        //                     : (
        //                         <Link
        //                             to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
        //                             onClick={() => set_IncidentId(row)}
        //                         // className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
        //                         // style={{
        //                         //     lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
        //                         //     alignItems: 'center', justifyContent: 'center', borderRadius: '4px'
        //                         // }}
        //                         >
        //                             <button type="button"
        //                                 className="btn btn-sm btn-dark w-100 mb-1"
        //                                 style={{ backgroundColor: "#001f3f", color: "#fff", lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>Edit</button>
        //                         </Link>
        //                     )
        //             }
        //         </div>)
        // },
        {
            name: 'Incident# ', cell: row => {
                return (
                    <span
                        onClick={() => {
                            <>
                                {
                                    row.NarrativeDescription?.toLowerCase() === "use of force" ? (
                                        row?.ArrestID ? (
                                            effectiveScreenPermission ?
                                                effectiveScreenPermission[0]?.Changeok ?

                                                    navigate(`/Arrest-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}&isFromDashboard=true`)
                                                    : <></>
                                                :
                                                navigate(`/Arrest-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}&isFromDashboard=true`)

                                        ) : (
                                            effectiveScreenPermission ?
                                                effectiveScreenPermission[0]?.Changeok ?
                                                    navigate(`/Inc-Report?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=true&isFromDashboard=true`)
                                                    : <></>
                                                :
                                                navigate(`/Inc-Report?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=true&isFromDashboard=true`)
                                        )
                                    ) : (
                                        navigate(`/Inc-Report?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`)
                                    )}
                            </>
                        }}
                        style={{
                            color: '#007bff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                        }}
                        title="Go to Incident"
                    >
                        {row?.IncidentNumber}
                    </span>
                );
            }, sortable: true, grow: 1, minWidth: "160px",
        },
        {
            name: 'Report Type',
            grow: 2,
            minWidth: "150px",
            selector: row => row.NarrativeDescription,
            sortable: true,

            cell: row => {
                const desc = row.NarrativeDescription?.toLowerCase();

                let backgroundColor = 'transparent';
                let color = 'inherit';

                if (desc === 'initial narrative') {
                    backgroundColor = '#fde047'; // yellow-300
                    color = 'inherit';
                } else if (desc === 'public narrative') {
                    backgroundColor = '#86efac'; // green-300
                    color = 'inherit';
                } else if (desc === 'supplementary narrative') {
                    backgroundColor = '#bfdbfe'; // blue-200
                    color = 'inherit';
                }
                else if (desc === 'press release') {
                    backgroundColor = '#f87171'; // red-400
                    color = 'inherit';
                } else if (desc === 'use of force') {
                    backgroundColor = '#007bff'; // red-400
                    color = 'inherit';
                }

                return (
                    <span
                        style={{
                            backgroundColor,
                            color,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            whiteSpace: "nowrap"
                        }}
                    >
                        {row.NarrativeDescription}
                    </span>
                );
            },
        },
        {
            name: 'Summitted Date/Time', grow: 2,
            minWidth: "160px", selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true
        },
        {
            name: 'Status',
            grow: 2,
            minWidth: "120px",
            selector: row => row.Status,
            sortable: true,
            cell: row => {
                const desc = row.Status?.toLowerCase();
                // console.log("🚀 ~ desc:", desc)
                let backgroundColor = 'transparent';
                let color = 'black';

                if (desc === 'pending review') {
                    backgroundColor = '#007bff'; // Blue for "Pending Review"
                    color = 'white';
                }
                else if (desc === 'approved') {
                    backgroundColor = '#28a745'; // Green color
                    color = 'white';
                }
                else if (desc === 'draft') {
                    backgroundColor = '#ffc107'; // Orange color
                    color = 'white';
                }
                else if (desc === 'rejected') {
                    backgroundColor = '#FF0000'; // Red color
                    color = 'white';
                }
                else if (desc === 'assigned report') {
                    backgroundColor = '#c00090'; // Purple color
                    color = 'white';
                }

                return (
                    <span
                        style={{
                            backgroundColor,
                            color,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontWeight: 'bold',
                        }}
                    >
                        {row.Status}
                    </span>
                );
            }
        },
        {
            name: 'Elapsed Days',
            selector: row => row.ElapsedDay,
            sortable: true,
            grow: 1,
            minWidth: "100px",
            cell: row => {
                let color = '';
                if (row.ElapsedDay > row.DueStatus) {
                    color = '#FF0000';
                }

                return (
                    <span
                        style={{
                            color,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            // fontWeight: 'bold',
                        }}
                    >
                        {row.ElapsedDay}
                    </span>
                );
            }
        }
    ];

    const set_IncidentId = (row) => {
        if (row.IncidentID) { }
    }



    const get_Data_Que_Report = (OfficerID, agencyId) => {
        const val = { 'OfficerID': OfficerID, 'AgencyID': agencyId }
        fetchPostData('/IncidentNarrativeReport/GetData_AllNarrativeReport', val).then((res) => {
            if (res) {
                setqueData(res);
                setLoder(true);
            } else {
                setqueData([]);
                setLoder(true);
            }
        })
    }

    const GetSingleData = (NarrativeID) => {
        const val = { 'NarrativeID': NarrativeID, }
        fetchPostData('IncidentNarrativeReport/GetSingleData_NarrativeApprove', val).then((res) => {
            if (res) {
                setEditval(res);
            } else {
                setEditval([]);
            }
        })
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const onMasterPropClose = () => {
        navigate('/dashboard-page');
    }

    const HandleChange = (e) => {
        const value = e.target.value
        const filteredData = queData.filter(item => item.IncidentNumber?.toLowerCase().includes(value.toLowerCase()) || item.NarrativeDescription?.toLowerCase().includes(value.toLowerCase()) || item.CreatedDtTm?.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filteredData);
    };

    return (
        <>
            <div className="col-12 dashboards-all-reports col-sm-12">
                <div className="" style={{ borderRadius: "12px" }}>
                    <div className="text-end mt-3 d-flex mb-2" style={{ justifyContent: "space-between", alignItems: "center" }}>
                        <h5 className="fw-bold ml-3">My Reports</h5>
                        <button className="btn btn-outline-dark mr-3" style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={onMasterPropClose}>
                            Close
                        </button>
                    </div>
                    <div className='row gx-2 gy-2' style={{ margin: '0px 10px' }}>
                        <ul className="list-unstyled d-flex mb-0" style={{ gap: "25px" }}>
                            <li className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    value="all"
                                    name="AttemptComplete"
                                    id="all"
                                    checked={selectedReportType === 'all'}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="all">
                                    All Report
                                </label>
                            </li>
                            <li className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    value="Assigned"
                                    name="AttemptComplete"
                                    id="assigned"
                                    checked={selectedReportType === 'Assigned'}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="assigned">
                                    Assigned Report
                                </label>
                            </li>

                            <li className="form-check ml-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    value="Draft"
                                    name="AttemptComplete"
                                    id="draft"
                                    checked={selectedReportType === 'Draft'}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="draft">
                                    Not submitted Report (DRAFT)
                                </label>
                            </li>

                            <li className="form-check ml-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    value="Rejected"
                                    name="AttemptComplete"
                                    id="rejected"
                                    checked={selectedReportType === 'Rejected'}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="rejected">
                                    Need Correction Report (REJECTED)
                                </label>
                            </li>

                            {/* <li className="form-check ml-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    value="Approved"
                                    name="AttemptComplete"
                                    id="approved"
                                    checked={selectedReportType === 'Approved'}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label" htmlFor="approved">
                                    Finalized Report (APPROVED)
                                </label>
                            </li> */}
                        </ul>
                    </div>
                    {/* {selectedReportType === 'All' && <DashboardAll />} */}
                    {selectedReportType === 'Draft' && <DraftReport />}
                    {selectedReportType === 'Rejected' && <RejectedReports />}
                    {selectedReportType === 'Assigned' && <AssignedReports />}
                    {/* <div className="card-body"> */}
                    <div className="table-responsive datatable-all-reports mt-2">
                        {selectedReportType === 'all' && (
                            <>
                                {
                                    loder ?
                                        <DataTable
                                            data={
                                                filteredData.length > 0 ? filteredData : queData
                                            }
                                            // data={queData}
                                            className="datatable-grid custom-border"
                                            dense
                                            columns={columns}
                                            pagination
                                            highlightOnHover
                                            customStyles={{
                                                ...tableCustomStyles,
                                                headCells: {
                                                    style: {
                                                        fontSize: '12px',
                                                    },
                                                },
                                                cells: {
                                                    style: {
                                                        fontSize: '12px',
                                                    },
                                                },
                                            }}
                                            noDataComponent={effectiveScreenPermission?.[0]?.DisplayOK ? 'There are no data to display' : 'You don’t have permission to view data'}
                                            fixedHeader
                                            persistTableHead
                                            fixedHeaderScrollHeight="400px"
                                            paginationPerPage={100}
                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                            conditionalRowStyles={conditionalRowStyles}
                                            onRowClicked={setClickedRow}
                                            defaultSortFieldId={3}
                                            defaultSortAsc={false}
                                        // subHeaderComponent={
                                        //     <div className="col-12 px-0 mt-1">
                                        //         <div className="row px-0">
                                        //             <div className="col-3 col-md-8 col-lg-4 ">
                                        //                 <input
                                        //                     type="text" name="IncidentNumber" id="IncidentNumber"
                                        //                     className="form-control py-1 new-input" placeholder="Search......"
                                        //                     // value={value.IncidentNumber}
                                        //                     maxLength={12}
                                        //                     // onKeyDown={handleKeyPress}
                                        //                     // onChange={(e) => { HandleChange(e); }}
                                        //                     autoComplete="off"
                                        //                 />

                                        //             </div>
                                        //         </div>
                                        //     </div>
                                        // }
                                        />
                                        :
                                        <Loader />
                                }
                            </>
                        )}

                    </div>
                </div>
            </div>

        </>
    )
}

export default DashboardAll




