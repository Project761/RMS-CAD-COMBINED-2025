import { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import { getShowingDateText } from '../../Components/Common/Utility';
import { useQuery } from 'react-query';
import CallTakerServices from '../../CADServices/APIs/callTaker'
import { compareStrings } from '../../CADUtils/functions/common';
import { useSelector } from 'react-redux';


const VehicleSearchModal = ({ isOpenVehicleSearchModel, setIsOpenVehicleSearchModel, vehicleCallTaker, setVehicleCallTaker }) => {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [vehicleData, setVehicleList] = useState([])
    const [loginAgencyID, setLoginAgencyID] = useState('');

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);

        }
    }, [localStoreData]);

    const payload = {
        VehicleNo: vehicleCallTaker?.Plate || "",
        PlateTypeID: vehicleCallTaker?.PlateTypeCode || "",
        PlateID: vehicleCallTaker?.StateCode || "",
        ManufactureYear: vehicleCallTaker?.TagYear || "",
        AgencyID: loginAgencyID
    }

    const searchVehicleKey = `/CAD/CallTakerPropertyVehicle/Search_Vehicle`;
    const { data: vehicleList, isSuccess: isFetchVehicleData } =
        useQuery(
            [searchVehicleKey, { payload }],
            CallTakerServices.searchVehicle,
            {
                refetchOnWindowFocus: false,
                enabled: !!isOpenVehicleSearchModel && !!loginAgencyID
            }
        );

    useEffect(() => {
        if (isFetchVehicleData && vehicleList) {
            if (vehicleList?.data?.Data?.length === 0) {
                return;
            } else {
                try {
                    const parsedData = JSON.parse(vehicleList?.data?.data);
                    const data = parsedData?.Table;
                    setVehicleList(data);
                } catch (error) {
                    console.error("Error parsing vehicle:", error);
                }
            }
        }
    }, [isFetchVehicleData, vehicleList]);

    const setEditValue = (row) => {
        setVehicleCallTaker({
            Plate: row?.VehicleNo,
            StateCode: row?.PlateID,
            PlateTypeCode: row?.PlateTypeID,
            TagYear: row?.ManufactureYear,
            MasterPropertyID: row?.MasterPropertyID,
        });
        setIsOpenVehicleSearchModel(false)
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: (row) => (
                <button
                    onClick={() => setEditValue(row)}
                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                >
                    <i className="fa fa-edit"></i>
                </button>
            ),
        },
        {
            name: 'Vehicle',
            selector: (row) => <>{row?.VehicleNumber} </>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.VehicleNumber, rowB.VehicleNumber),
        },
        {
            name: 'Incident',
            selector: (row) => <>{row?.IncidentNumber || ""} </>,
            sortable: true,
        },
        {
            name: 'VIN',
            selector: (row) => (
                <>
                    {row?.VIN ? row?.VIN.substring(0, 10) : ''}
                    {row?.VIN?.length > 20 ? '  . . .' : null}
                </>
            ),
            sortable: true,
        },
        {
            name: 'Manufacture Year',
            selector: (row) => <>{row?.ManufactureYear || ""} </>,
            sortable: true,
        },
        {
            name: 'Plate Type',
            selector: (row) => <>{row?.PlateType_Description || ""} </>,
            sortable: true,
        },
        {
            name: 'Category',
            selector: (row) => <>{row?.Category_Description || ""} </>,
            sortable: true,
        },
        {
            name: 'Reported Date',
            selector: (row) =>
                row.ReportedDtTm ? getShowingDateText(row.ReportedDtTm) : '',
            sortable: true,
        },
    ];

    return (
        <>
            {
                isOpenVehicleSearchModel &&
                <dialog className="modal fade " style={{ background: "rgba(0,0,0, 0.5)", display: 'block', opacity: '1', maxHeight: "80vh", overflowY: "hidden", marginTop: "50px" }} id="SearchVehicleModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                            <div className="modal-header px-3 p-2">
                                <h5 className="modal-title">Vehicle List</h5>
                                <button type="button" onClick={() => { setIsOpenVehicleSearchModel(false); }} className="close btn-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                </button>
                            </div>
                            <div className="box text-center px-2">
                                <div className="col-12 ">
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={vehicleData}
                                        pagination
                                        fixedHeader
                                        persistTableHead={true}
                                        selectableRowsHighlight
                                        highlightOnHover
                                        fixedHeaderScrollHeight="550px"
                                        paginationComponentOptions={{
                                            noRowsPerPage: false,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </dialog>
            }
        </>
    )
}

export default memo(VehicleSearchModal)

// PropTypes definition
VehicleSearchModal.propTypes = {
  isOpenVehicleSearchModel: PropTypes.bool.isRequired,
  setIsOpenVehicleSearchModel: PropTypes.func.isRequired,
  vehicleCallTaker: PropTypes.object,
  setVehicleCallTaker: PropTypes.func
};

// Default props
VehicleSearchModal.defaultProps = {
  vehicleCallTaker: {},
  setVehicleCallTaker: () => {}
};