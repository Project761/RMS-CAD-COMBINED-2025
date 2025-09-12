import { useEffect, useState } from 'react'
import Loader from '../../Common/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { Decrypt_Id_Name, getShowingDateText, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { Incident_ID, Incident_Number } from '../../../redux/actionTypes';
import { fetchPostData } from '../../hooks/Api';
import { toastifyError } from '../../Common/AlertMsg';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { get_LocalStoreData } from '../../../redux/actions/Agency';

const CadIncidentList = () => {
    const dispatch = useDispatch();
    const [loder, setLoder] = useState(false);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [incidentFilterData, setIncidentFilterData] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState();


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("I034", localStoreData?.AgencyID, localStoreData?.PINID));
            setLoginAgencyID(localStoreData?.AgencyID)

        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            getIncidentSearchData(loginAgencyID)
        }
    }, [loginAgencyID]);

    

    const getIncidentSearchData = async (AgencyID) => {
        fetchPostData('Incident/GetData_CADIncident', { 'AgencyID': AgencyID }).then((res) => {
            if (res.length > 0) {
                setIncidentFilterData(res); setLoder(true);
            } else {
                toastifyError("No Data Available"); setLoder(true); setIncidentFilterData([]);
            }
        });
    }

    const columns = [
        {
            width: "80px",
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => (
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.Changeok ?
                                <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=${true}&IsCadInc=${true}`}
                                    onClick={(e) => { set_IncidentId(row); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                    <i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                            : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=${true}&IsCadInc=${true}`}
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
            sortable: true
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

    const set_IncidentId = (row) => {
        if (row.IncidentID) {
            dispatch({ type: Incident_ID, payload: row?.IncidentID });
            dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
        }
    }

    return (
        <>
            <div className="section-body mt-4" style={{ margin: '10px 10px 10px 15px' }}>
                <div className="col-3 mb-2" >
                    <div className=" text-black py-1 px-2 d-flex justify-content-between align-items-center text-align-center" >
                        <h5 className="fw-bold ml-3">Incomplete Incidents</h5>
                    </div>
                </div>
                <div className="row clearfix">
                    <div className="main-dashboard col-12 ">
                        <div className="col-12 col-sm-12">
                            {
                                loder ?
                                    <DataTable
                                        columns={columns}
                                        persistTableHead={true}
                                        dense
                                        data={
                                            effectiveScreenPermission ?
                                                effectiveScreenPermission[0]?.DisplayOK ? incidentFilterData : []
                                                :
                                                ""

                                        }
                                        pagination
                                        paginationPerPage={'100'}
                                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                        showPaginationBottom={100}
                                        highlightOnHover
                                        responsive
                                        customStyles={tableCustomStyles}
                                        subHeaderAlign='left'
                                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                    />
                                    :
                                    <Loader />
                            }
                        </div>
                    </div>
                </div >
            </div>
        </>
    )
}

export default CadIncidentList