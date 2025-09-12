import { useCallback, useEffect, useState } from 'react'
import DataTable from "react-data-table-component";
import PropTypes from 'prop-types';
import { getShowingDateText, tableCustomStyles } from '../../Components/Common/Utility';
import { compareStrings } from '../../CADUtils/functions/common';
import Tooltip from '../Common/Tooltip';
import CloseCallModal from '../CloseCallModal';

function DuplicateCallModal({ openDuplicateCallModal, setOpenDuplicateCallModal, duplicateCallData, getResourceValues, createPayload, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID, insertIncident, setNameData, setVehicleData, onCloseLocation, incidentFormValues, setIncidentFormValues, receiveSourceDropDown, setDocData }) {

    const [selectIncident, setSelectIncident] = useState("");
    const [openCloseCallModal, setOpenCloseCallModal] = useState(false);

    const columns = [
        {
            width: "68px",
            name: (
                <div
                    className="d-flex justify-content-end"
                >
                    Select
                </div>
            ),
            cell: (row) => (
                <input type="checkbox" name="question" value="14" className="clickable mr-2" id="2" checked={selectIncident === row?.IncidentID} onChange={(e) => { setSelectIncident(e.target.checked ? row?.IncidentID : "") }} />
            ),
            style: {
                position: "static",
            },
        },
        {
            name: "CAD Event #",
            selector: (row) => (row?.CADIncidentNumber ? row?.CADIncidentNumber : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.CADIncidentNumber, rowB?.CADIncidentNumber),
            width: "130px",
        },
        {
            name: "Reported DT&TM",
            selector: (row) => row?.ReportedDate ? getShowingDateText(row?.ReportedDate) : '',
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedDate, rowB.ReportedDate),
            width: "145px",
        },
        {
            name: "Location",
            selector: (row) => (row?.CrimeLocation ? row?.CrimeLocation : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.CrimeLocation, rowB?.CrimeLocation),
            cell: (row) => {
                return <Tooltip text={row?.CrimeLocation} maxLength={30} />;
            },
            width: "240px",
        },
        {
            name: "CFS code",
            selector: (row) => (row?.CFSCODE ? row?.CFSCODE : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.CFSCODE, rowB?.CFSCODE),
            width: "130px",
        },
        {
            name: "CFS Description",
            selector: (row) => row?.CFSCodeDescription || "",
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.CFSCodeDescription, rowB?.CFSCodeDescription),
            cell: (row) => {
                return <Tooltip text={row?.CFSCodeDescription} maxLength={15} />;
            },
            width: "145px",
        },
    ];

    const handleClose = () => {
        setOpenDuplicateCallModal(false);
        setSelectIncident("");
        onCloseLocation();
    };
    const handleCloseAll = () => {
        setOpenDuplicateCallModal(false);
        onCloseLocation();
        setSelectIncident("");
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            handleCloseAll();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    return (
        <>
            {openDuplicateCallModal && <div className="modal fade " style={{ background: "rgba(0,0,0, 0.5)", display: 'block', opacity: '1' }} >
                <div className="modal-dialog modal-dialog-centered modal-xl1">
                    <div className="modal-content modal-content-cad">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 p-0 pb-2">
                                    <div className="py-0 px-2 d-flex justify-content-center align-items-center">
                                        <p
                                            className="p-0 m-0 font-weight-medium"
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 500,
                                                letterSpacing: 0.5,
                                                color: "red"
                                            }}
                                        >
                                            Duplicate Call Detected!
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="m-1">
                                <fieldset style={{ border: "1px solid gray" }}>
                                    <div className="container duplicate-call-container py-1">
                                        <div className="call-details-section mb-2">
                                            <div className="CAD-card">
                                                <div className="card-body py-2 px-3">
                                                    <h5 className="card-title">New Call Details</h5>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="detail-row">
                                                                <span className="new-label" style={{ fontSize: "14px", color: "#131b2c" }}>Location : </span>
                                                                <span className="new-label ml-1" style={{ fontSize: "14px", color: "#5e677a", fontWeight: "400" }}>{duplicateCallData?.[0]?.CrimeLocation}</span>
                                                            </div>
                                                            <div className="detail-row">
                                                                <span className="new-label" style={{ fontSize: "14px", color: "#131b2c" }}>CFS code/description:</span>
                                                                <span className="new-label ml-1" style={{ fontSize: "14px", color: "#5e677a", fontWeight: "400" }}>{duplicateCallData?.[0]?.CFSCODE} / {duplicateCallData?.[0]?.CFSCodeDescription}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="duplicates-section">
                                            <div className="CAD-card mb-0">
                                                <div className="card-body py-2 px-3">
                                                    <h5 className="card-title">Potential Duplicates</h5>
                                                    <div className="table-responsive CAD-table" style={{ position: "sticky" }}>
                                                        <DataTable
                                                            dense
                                                            columns={columns}
                                                            data={duplicateCallData} // Pass your data here
                                                            customStyles={tableCustomStyles}
                                                            pagination
                                                            responsive
                                                            paginationPerPage={10} // default rows per page
                                                            paginationRowsPerPageOptions={[10, 20, 30]} // only show these options
                                                            striped
                                                            highlightOnHover
                                                            fixedHeader
                                                            selectableRowsHighlight
                                                            fixedHeaderScrollHeight="190px"
                                                            persistTableHead={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="row">
                                <div className="col-12 p-0">
                                    <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                        <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                            <button
                                                type="button"
                                                className="save-button ml-2"
                                                onClick={() => handleClose()}
                                                disabled={selectIncident === ""}
                                            >
                                                {"Merge with Existing"}
                                            </button>
                                            <button
                                                type="button"
                                                className="save-button ml-2"
                                                data-toggle="modal"
                                                data-target="#CloseCallModal"
                                                onClick={() => setOpenCloseCallModal(true)}
                                                disabled={selectIncident !== ""}
                                            >
                                                {"Close Call"}
                                            </button>
                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={() => { setSelectIncident("") }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="cancel-button"
                                                onClick={() => { setOpenDuplicateCallModal(false); setSelectIncident(""); }}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {openCloseCallModal && <CloseCallModal {...{ openCloseCallModal, setOpenCloseCallModal, getResourceValues, createPayload, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID, insertIncident, setNameData, setVehicleData, receiveSourceDropDown, incidentFormValues, setDocData }} onCloseLocation={handleCloseAll} isDuplicateCall />}
        </>
    )
}

export default DuplicateCallModal

// PropTypes definition
DuplicateCallModal.propTypes = {
  openDuplicateCallModal: PropTypes.bool.isRequired,
  setOpenDuplicateCallModal: PropTypes.func.isRequired,
  duplicateCallData: PropTypes.array,
  getResourceValues: PropTypes.func,
  createPayload: PropTypes.func,
  isGoogleLocation: PropTypes.bool,
  createLocationPayload: PropTypes.func,
  geoLocationID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setGeoLocationID: PropTypes.func,
  insertIncident: PropTypes.func,
  setNameData: PropTypes.func,
  setVehicleData: PropTypes.func,
  onCloseLocation: PropTypes.func,
  incidentFormValues: PropTypes.object,
  setIncidentFormValues: PropTypes.func,
  receiveSourceDropDown: PropTypes.array,
  setDocData: PropTypes.func
};

// Default props
DuplicateCallModal.defaultProps = {
  duplicateCallData: [],
  getResourceValues: () => {},
  createPayload: () => {},
  isGoogleLocation: false,
  createLocationPayload: () => {},
  geoLocationID: null,
  setGeoLocationID: () => {},
  insertIncident: () => {},
  setNameData: () => {},
  setVehicleData: () => {},
  onCloseLocation: () => {},
  incidentFormValues: {},
  setIncidentFormValues: () => {},
  receiveSourceDropDown: [],
  setDocData: () => {}
};