import { useContext, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithFixedTime, getShowingWithOutTime, stringToBase64, tableCustomStyles, } from '../../Common/Utility';
import '../../../style/incident.css';
import { useDispatch, useSelector } from 'react-redux';
import { Incident_ID, Incident_Number } from '../../../redux/actionTypes';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';

const DashboardIncidentListModel = ({ handleModel, Data, modelSelected }) => {


    const dispatch = useDispatch();
    const { setShowIncPage, incidentRecentData, setIncidentRecentData, GetDataExceptionalClearanceID, getRmsDispositionID, incAdvSearchData, GetDataTimeZone, datezone } = useContext(AgencyContext);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);


    const [updateCount, setupdateCount] = useState(1);
    const [advancedSearch] = useState(false);

    //Assign Incident 
    const [loginAgencyID, setLoginAgencyID] = useState('');

    useEffect(() => {
        if (false) {
            if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
                if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
            }
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("I034", localStoreData?.AgencyID, localStoreData?.PINID));
            setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID, 'PINID': localStoreData?.PINID });
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    // --- DS
    useEffect(() => {
        const defaultReportedDate = getShowingWithOutTime(datezone);
        const defaultReportedDateTo = getShowingWithFixedTime(datezone);
        setValue(prevState => ({
            ...prevState, 'ReportedDate': defaultReportedDate, 'ReportedDateTo': defaultReportedDateTo,
        }));

        setShowIncPage('home');
    }, [loginAgencyID, datezone]);


    const [value, setValue] = useState({
        'ReportedDate': getShowingWithOutTime(datezone), 'ReportedDateTo': getShowingWithFixedTime(datezone),
        'IncidentNumber': '', 'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'RMSDispositionId': '', 'DispositionDate': '', 'DispositionDateTo': '', 'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityID': '', 'PINID': '', 'AgencyID': '',
    });

    useEffect(() => {
        setShowIncPage('home');
    }, [loginAgencyID, incAdvSearchData])

    const columns = [
        {
            width: "80px",
            omit: incAdvSearchData == true ? false : true,
            // omit: true,
            cell: row =>
                <div className="div" >
                    <a data-toggle="modal" data-target="#IncSummaryModel"
                        style={{ textDecoration: 'underline' }}
                        onClick={() => {
                            setupdateCount(updateCount + 1);

                        }}
                    >
                        MS
                    </a>
                </div>,
        },
        {
            width: "80px",
            omit: incAdvSearchData === "kdsjfhkjsdfsdf" ? true : false,
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => (
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.Changeok ?
                                <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=${true}&IsCadInc=${false}`}
                                    onClick={(e) => { set_IncidentId(row); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                    <i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                            : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=${true}&IsCadInc=${false}`}
                                onClick={(e) => { set_IncidentId(row); }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>)
        },
        {
            width: '220px',
            name: 'Incident',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            width: '180px',
            name: 'Offense',
            selector: (row) => row.OffenseName_Description,
            sortable: true
        },

        {
            width: '140px',
            name: 'CAD CFS ',
            selector: (row) => row.CADCFSCode_Description,
            sortable: true
        },
        {
            width: '140px',
            name: 'Primary Officer',
            selector: (row) => row.PrimaryOfficer,
            sortable: true
        },

        {
            width: '180px',
            name: 'CAD Disposition',
            selector: (row) => row.RMS_Disposition,
            sortable: true
        },
        {
            width: '180px',
            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDate ? getShowingDateText(row.ReportedDate) : " ",
            sortable: true
        },
        {
            name: 'Location',
            selector: (row) => <>{row?.CrimeLocation ? row?.CrimeLocation.substring(0, 30) : ''}{row?.CrimeLocation?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '140px',
            name: 'Offense Count',
            selector: (row) => row.OffenceCount,
            sortable: true,
        },
        {
            width: '140px',
            name: 'Name Count',
            selector: (row) => row.NameCount,
            sortable: true
        },
        {
            width: '140px',
            name: 'Property Count',
            selector: (row) => row.PropertyCount,
            sortable: true
        },
        {
            width: '140px',
            name: 'Report Count',
            selector: (row) => row.ReportCount,
            sortable: true
        },
    ]


    const getStatusColors = (row) => {
        return !row?.OffenseName_Description ? { backgroundColor: "rgb(255 202 194)" } : {};
    };

    const conditionalRowStyles = [
        {
            when: () => true,
            style: (row) => getStatusColors(row),
        },
    ];

    const set_IncidentId = (row) => {
        let newData = [...incidentRecentData];
        let currentItem = newData.find((item) => row.IncidentID === item.IncidentID);
        if (!currentItem) {
            newData.push(row);
        }
        setIncidentRecentData(newData);
        if (row.IncidentID) {
            dispatch({ type: Incident_ID, payload: row?.IncidentID });
            dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
        }
    }

    const reset_Fields = () => {
        setValue({
            ...value,
            'IncidentNumber': '', 'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '',
            'OccurredFrom': '', 'OccurredFromTo': '', 'RMSDispositionId': '', 'DispositionDate': '', 'DispositionDateTo': '',
            'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityID': '',
        });
    }

    useEffect(() => {
        if (advancedSearch) {
            if (loginAgencyID) {
                getRmsDispositionID(loginAgencyID); GetDataExceptionalClearanceID(loginAgencyID);
            }
        }
    }, [loginAgencyID, advancedSearch]);


    return (
        <>
            {

                <div className="modal" style={{ background: "rgba(0,0,0, 0.5)", zIndex: '9999' }} id="IncidentListModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered  modal-xl">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="section-body " style={{ margin: '10px 10px 10px 15px' }}>
                                    <div className="col-12 px-0 mt-1">
                                        <div className="row px-0">
                                            <div className="col-12 col-md-12 col-lg-12 d-flex" style={{ justifyContent: "space-between" }}>
                                                <div>
                                                    <p className="new-para ">{modelSelected}</p>
                                                </div>
                                                <div>
                                                    <button
                                                        type="button"
                                                        onClick={handleModel(false)}
                                                        data-dismiss="modal"
                                                        className="btn btn-sm "
                                                        style={{ backgroundColor: "#001f3f", color: "#fff" }}
                                                    >
                                                        <b>X</b>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row clearfix">
                                        <div className="main-dashboard col-12 mb-2 mt-2">
                                            <div className="col-12 col-sm-12">
                                                {
                                                    <DataTable
                                                        columns={columns}
                                                        persistTableHead={true}
                                                        dense
                                                        data={Data}
                                                        conditionalRowStyles={conditionalRowStyles}
                                                        pagination
                                                        paginationPerPage={'100'}
                                                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                        showPaginationBottom={100}
                                                        highlightOnHover
                                                        responsive
                                                        fixedHeader
                                                        customStyles={tableCustomStyles}
                                                        subHeaderAlign='left'
                                                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </div >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default DashboardIncidentListModel