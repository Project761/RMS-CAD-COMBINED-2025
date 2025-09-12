import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector, useDispatch } from 'react-redux';
import { base64ToString, Decrypt_Id_Name, getShowingMonthDateYear, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { fetchPostData } from '../../hooks/Api';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function IncompleteNibrsIncident({ isPreview }) {

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
    const [queData, setqueData] = useState();
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            get_Data_Que_Report(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));

        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            get_Data_Que_Report(loginAgencyID);
        }
    }, [loginAgencyID]);

    const columns = [

        {
            name: 'Action',
            selector: row => row.incident,
            sortable: true,
            wrap: true,
            grow: 0,
            cell: row => (
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.Changeok ?
                                <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}`}
                                    onClick={(e) => { set_IncidentId(row); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                    <i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                            : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}`}
                                onClick={(e) => { set_IncidentId(row); }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>)
        },
        { name: 'Incident# ', selector: row => row?.IncidentNumber, sortable: true, },

        { name: 'Reported DT/TM', selector: row => row.ReportedDate ? getShowingMonthDateYear(row.ReportedDate) : " ", sortable: true },

        { name: 'Primary Officer', selector: row => row.PrimaryOfficer, sortable: true, },
    ];

    const set_IncidentId = (row) => {
        if (row.IncidentID) {
        }
    }

    const get_Data_Que_Report = (agencyId) => {
        const val = { 'AgencyID': agencyId }
        fetchPostData('/Incident/GetData_InCompleteNIBRSIncident', val).then((res) => {
            if (res) {
                setqueData(res);
            } else {
                setqueData([]);
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
        const filteredData = queData.filter(item => item.IncidentNumber?.toLowerCase().includes(value.toLowerCase()) || item.ReportedDate?.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filteredData);
    };


    return (
        <>

            <div className="col-12 col-sm-12">

                <div className="property-evidence">

                    <div className="text-end mt-2 d-flex w-100" style={{ justifyContent: "space-between", alignItems: "center", }} >
                        <>
                            <div className='d-flex align-items-center ml-0'>
                                {isPreview && (
                                    <span className="mr-2 ">
                                        <svg width="40" height="40" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="40" cy="40" r="40" fill="#D6ECFF" />
                                            <defs>
                                                <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
                                                    <stop offset="0%" stopColor="#FF3B3B" />
                                                    <stop offset="100%" stopColor="#D90000" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M30 50a10 10 0 0120 0v8H30v-8z" fill="url(#glow)" />
                                            <rect x="38" y="40" width="4" height="10" rx="100" fill="white" />
                                            <circle cx="40" cy="53" r="2" fill="white" />
                                            <rect x="26" y="58" width="28" height="6" rx="2" fill="#E0E0E0" />
                                            <rect x="30" y="64" width="20" height="4" rx="2" fill="#BDBDBD" />
                                            <line x1="20" y1="30" x2="28" y2="32" stroke="#E30613" strokeWidth="2" />
                                            <line x1="60" y1="30" x2="52" y2="32" stroke="#E30613" strokeWidth="2" />
                                            <line x1="40" y1="20" x2="40" y2="28" stroke="#E30613" strokeWidth="2" />
                                        </svg>
                                    </span>
                                )}
                                <span className="fw-bold mb-0 " style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>Incomplete TIBRS incidents</span>
                            </div>
                        </>
                        {isPreview ? (
                            <div className="d-flex align-items-center">
                                <div className="position-relative mr-3 ">
                                    <input
                                        type="text" name="IncidentNumber" id="IncidentNumber"
                                        className="form-control py-1 new-input" placeholder="Search......"
                                        // value={value.IncidentNumber}
                                        // maxLength={12}
                                        // onKeyDown={handleKeyPress}
                                        onChange={(e) => { HandleChange(e); }}
                                        autoComplete="off"
                                    />
                                </div>
                                <h5 className="mb-0 mr-3" style={{ fontSize: "18px", fontWeight: "600", color: '#334c65' }}>
                                    {queData?.length}
                                </h5>
                                <Link to="/assigned-Incompletenibrs">
                                    <button className="see-all-btn mr-1 see_all-button" style={{ fontSize: "12px", padding: "4px 8px" }}>See All</button>
                                </Link>
                            </div>
                        ) : (
                            <button
                                className="btn btn-outline-dark mr-3"
                                style={{ backgroundColor: "#001f3f", color: "#fff" }}
                                onClick={onMasterPropClose}
                            >
                                Close
                            </button>
                        )}
                    </div>
                    <div className="pt-2 property-evidence-datatable mt-2">
                        <DataTable
                            className={isPreview ? 'table-responsive_pastdues datatable-grid' : ''}
                            data={filteredData?.length > 0 ? filteredData : queData}
                            // data={queData}
                            dense
                            columns={columns}
                            pagination
                            highlightOnHover
                            customStyles={tableCustomStyles}
                            noDataComponent={
                                effectiveScreenPermission?.[0]?.DisplayOK
                                    ? 'There are no data to display'
                                    : 'You don’t have permission to view data'
                            }
                            fixedHeader
                            persistTableHead
                            fixedHeaderScrollHeight='400px'
                            paginationPerPage={100}
                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                            conditionalRowStyles={conditionalRowStyles}
                            onRowClicked={setClickedRow}
                        />
                    </div>
                </div>
            </div >
        </>
    )
}

export default IncompleteNibrsIncident






