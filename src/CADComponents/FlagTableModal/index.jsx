import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getShowingDateText, stringToBase64, tableCustomStyles } from "../../Components/Common/Utility";
import DataTable from "react-data-table-component";
import { useQuery } from "react-query";
import CallTakerServices from "../../CADServices/APIs/callTaker";
import CADViewIncident from "../../CADPage/CADViewIncident";
import { compareStrings } from "../../CADUtils/functions/common";


const FlagTableModal = (props) => {
    const { openFlagTableModal, setOpenFlagTableModal, geoLocationID, flagName, isViewEventDetails = false, IncID = "", aptData = "" } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [loginAgencyID, setLoginAgencyID] = useState();
    const [tableData, setTableData] = useState([]);
    const [eventDetailsModal, setEventDetailsModal] = useState(false);
    const [previousUrl, setPreviousUrl] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const getFlagIncidentKey = `/CAD/Flag/FlagIncident/${geoLocationID}`;
    const payload = { FlagFromId: geoLocationID, AgencyID: loginAgencyID, Action: flagName === "PremiseFlag" ? "PremiseFlag" : "Is24HourFlag", "IncidentID": IncID, AptID: aptData?.aptId }
    const {
        data: flagIncidentData,
        isSuccess: isFetchFlagIncidentData,
    } = useQuery([getFlagIncidentKey, { payload }],
        CallTakerServices.getFlagIncident, {
        refetchOnWindowFocus: false,
        enabled: !!geoLocationID && !!loginAgencyID && !!aptData?.aptId,
        onSuccess: (res) => {
            if (res?.data?.Data?.length === 0) {
                return;
            } else {
                try {
                    const parsedData = JSON.parse(res?.data?.data);
                    const data = parsedData?.Table;
                    setTableData(data);
                } catch (error) {
                    console.error("Error parsing name:", error);
                }
            }
        },
    });

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID)
        }
    }, [localStoreData]);


    const handleClose = () => {
        setOpenFlagTableModal(false);
        setTableData([]);
    };
    const handleActionClick = (row) => {
        setPreviousUrl(location.pathname + location.search); // Save the current URL
        const base64IncId = stringToBase64(row?.IncidentID);
        const newUrl = isViewEventDetails
            ? `/cad/dashboard-page?IncId=${base64IncId}&IncNo=${row?.CADIncidentNumber}&isResourceView=false&IncSta=true`
            : `/cad/dispatcher?IncId=${base64IncId}&IncNo=${row?.CADIncidentNumber}&isResourceView=false&IncSta=true`;
        navigate(newUrl);
        setEventDetailsModal(true);
    };

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span
                        data-toggle="modal"
                        data-target="#CADDispatcherModal"
                        onClick={() => handleActionClick(row)}
                        className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                        style={{ cursor: "pointer" }}>
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>,
            width: "70px",
        },
        {
            name: 'CAD Event #',
            selector: (row) => <>{row?.CADIncidentNumber ? row?.CADIncidentNumber : ''} </>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CADIncidentNumber, rowB.CADIncidentNumber),
            width: "130px",

        },
        {
            name: 'RMS Incident #',
            selector: (row) => <>{row?.IncidentNumber ? row?.IncidentNumber : ''} </>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.IncidentNumber, rowB.IncidentNumber),
            width: "130px",

        },
        {
            name: 'Reported DT/TM',
            selector: (row) => <>{row?.ReportedDate ? getShowingDateText(row?.ReportedDate) : ''}</>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedDate, rowB.ReportedDate),
        },
        {
            name: 'CFS Code',
            selector: (row) => <>{row?.CFSCODE ? row?.CFSCODE : ''}</>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCODE, rowB.CFSCODE),
        },
        {
            name: 'CFS Description',
            selector: (row) => <>{row?.CFSCodeDescription ? row?.CFSCodeDescription : ''}</>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCodeDescription, rowB.CFSCodeDescription),
        },
        {
            name: 'Priority',
            selector: (row) => <>{row?.PriorityCode ? row?.PriorityCode : ''}</>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.PriorityCode, rowB.PriorityCode),
        },
        {
            name: 'Disposition Code',
            selector: (row) => <>{row?.Disposition ? row?.Disposition : ''}</>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Disposition, rowB.Disposition),
        },
        {
            name: 'Caller Name',
            selector: (row) => <>{row?.CallerName ? row?.CallerName : ''}</>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CallerName, rowB.CallerName),
        }
    ]


    return (
        <>
            {openFlagTableModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200" }}
                        id="FlagTableModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content modal-content-cad">
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-22 p-0 pb-2">
                                            <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                                                <p
                                                    className="p-0 m-0 font-weight-medium"
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: 500,
                                                        letterSpacing: 0.5,
                                                    }}
                                                >
                                                    {flagName === "PremiseFlag" ? "Premise History" : "24 Hr History"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Form Section */}
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-container">
                                                <div className="table-responsive CAD-table" style={{ position: "sticky" }}>
                                                    <DataTable
                                                        dense
                                                        columns={columns}
                                                        data={tableData}
                                                        customStyles={tableCustomStyles}
                                                        pagination
                                                        responsive
                                                        striped
                                                        highlightOnHover
                                                        noDataComponent={true ? "There are no data to display" : 'There are no data to display'}
                                                        fixedHeader
                                                        selectableRowsHighlight
                                                        fixedHeaderScrollHeight="190px"
                                                        persistTableHead={true}

                                                    />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    {/* Buttons Section */}
                                    <div className="row">
                                        <div className="col-12 p-0">
                                            <div className="py-0 px-2 d-flex justify-align-content-between align-items-center">
                                                <div className="tab-form-label text-nowrap"> Total Records : {tableData?.length}</div>
                                                <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                    <button
                                                        type="button"
                                                        data-dismiss="modal"
                                                        className="cancel-button"
                                                        onClick={() => handleClose()}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </>
            ) : (
                <> </>
            )
            }
            <CADViewIncident
                {...{ eventDetailsModal, setEventDetailsModal }}
                previousUrl={previousUrl}
            />
        </>
    );
};

export default memo(FlagTableModal);

// PropTypes definition
FlagTableModal.propTypes = {
  openFlagTableModal: PropTypes.bool.isRequired,
  setOpenFlagTableModal: PropTypes.func.isRequired,
  geoLocationID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flagName: PropTypes.string,
  isViewEventDetails: PropTypes.bool,
  IncID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  aptData: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

// Default props
FlagTableModal.defaultProps = {
  geoLocationID: null,
  flagName: "",
  isViewEventDetails: false,
  IncID: "",
  aptData: ""
};
