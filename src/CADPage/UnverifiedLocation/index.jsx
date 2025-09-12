import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { tableMinCustomStyles } from '../../Components/Common/Utility';
import Tooltip from '../../CADComponents/Common/Tooltip';
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import GEOModal from '../../CADComponents/GEOModal';
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UnverifiedLocationList = () => {
    const [unVerifiedLocationsList, setUnVerifiedLocationsList] = useState([]);
    const [unVerifiedSingleLocationsList, setUnVerifiedSingleLocationsList] = useState([]);
    const [openGEOModal, setOpenGEOModal] = useState(false);
    const [LoginAgencyID, setLoginAgencyID] = useState('');

    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const getUnVerifiedLocationsKey = `/CAD/GeoLocation/GetUnVerifiedLocations`;
    const { data: unVerifiedLocationsData, isSuccess: isFetchUnVerifiedLocationsData, refetch: refetchUnVerifiedLocationsData, isError: isNoData } = useQuery(
        [getUnVerifiedLocationsKey, { "AgencyID": LoginAgencyID, }],
        MasterTableListServices.getUnVerifiedLocations,
        {
            refetchOnWindowFocus: false,
            enabled: !!LoginAgencyID
        }
    );

    useEffect(() => {
        if (unVerifiedLocationsData && isFetchUnVerifiedLocationsData) {
            const data = JSON.parse(unVerifiedLocationsData?.data?.data);
            setUnVerifiedLocationsList(data?.Table)
        } else {
            setUnVerifiedLocationsList([])
        }
    }, [unVerifiedLocationsData, isFetchUnVerifiedLocationsData])

    const businessColumns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        <span
                            data-toggle={"modal"}
                            data-target={"#GEOModal"}
                            onClick={
                                () => {
                                    setOpenGEOModal(true);
                                    set_Edit_Value(row)
                                }
                            }
                            className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </span>
                    }
                </div>,
            width: '10%',
        },
        {
            width: '40%',
            name: 'Location',
            selector: (row) => row.Location || '',
            sortable: true,
            cell: (row) => (
                <Tooltip text={row?.Location || ''} maxLength={30} isSmall />
            ),
        },
        {
            width: '10%',
            name: 'City',
            selector: (row) => row.City || '',
            sortable: true,
        },
        {
            width: '10%',
            name: 'State',
            selector: (row) => row.State || '',
            sortable: true,
        },
        {
            width: '10%',
            name: 'Zip Code',
            selector: (row) => row.ZipCode || '',
            sortable: true,
        },
        {
            width: '10%',
            name: 'Missing Zone',
            selector: (row) => <FontAwesomeIcon
                icon={row.IsMissingZone !== "true" ? faCheckCircle : faXmarkCircle}
                style={{ color: row.IsMissingZone !== "true" ? "#4CAF50" : "	#ff0000" }}
            />,
            sortable: true,
        },
        {
            width: '10%',
            name: 'Missing LatLong',
            selector: (row) => <FontAwesomeIcon
                icon={row.IsMissingLatLong !== "true" ? faCheckCircle : faXmarkCircle}
                style={{ color: row.IsMissingLatLong !== "true" ? "#4CAF50" : "	#ff0000" }}
            />,
            sortable: true,
        },
    ]

    const set_Edit_Value = (row) => {
        if (row?.ID) {
            setUnVerifiedSingleLocationsList(row)
            setOpenGEOModal(true)
            // navigate(`/cad/dispatcher?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.CADIncidentNumber}&IncSta=true&key=resourceHistoryNew`)
        }
    }

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(parseInt(localStoreData?.AgencyID));
        }
    }, [localStoreData]);


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
                                                            data={unVerifiedLocationsList}
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
            {openGEOModal && <GEOModal {...{ openGEOModal, setOpenGEOModal, unVerifiedSingleLocationsList, refetchUnVerifiedLocationsData }} isVerifiedPage />}
        </>
    )
}

export default UnverifiedLocationList


