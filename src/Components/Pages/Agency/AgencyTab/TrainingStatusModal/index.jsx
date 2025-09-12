import { useEffect, useState } from 'react'
import { fetchPostData } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../../../Common/Utility';

const TrainingStatusModal = ({ openTrainingStatusModal, setOpenTrainingStatusModal, AssignTrainingID }) => {
    const [personalTrainingStatusData, setPersonalTrainingStatusData] = useState([]);

    useEffect(() => {
        if (AssignTrainingID) {
            getAssignTraining(AssignTrainingID);
        }
    }, [AssignTrainingID, openTrainingStatusModal])

    const getAssignTraining = (AssignTrainingID) => {
        const value = { AssignTrainingID: AssignTrainingID }
        fetchPostData('CAD/AssignTraining/GetOfficerTrainingStatus', value).then(res => {
            if (res) {
                setPersonalTrainingStatusData(res)
            } else {
                setPersonalTrainingStatusData([])
            }
        })
    }

    const columns = [
        {
            name: 'Officer Name',
            selector: (row) => row?.OfficerName,
            sortable: true
        },
        {
            name: 'Completion Certificate',
            cell: (row) =>
                row.FileAttachment ? (
                    <a
                        href={row.FileAttachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                        {row.DocumentName}
                    </a>
                ) : (
                    row.DocumentName || ""
                ),
            sortable: true
        },
        {
            name: 'Status',
            sortable: true,
            center: true,
            width: "180px",
            selector: (row) => {
                let bgColor = "";
                if (row?.Status === "IN PROGRESS") {
                    bgColor = "#e3bf00";
                } else if (row?.Status === "PASS") {
                    bgColor = "#29cf3d";
                } else {
                    bgColor = "#6c757d";
                }
                return (
                    <>
                        {row?.Status && <button
                            className="btn btn-sm p-1 py-0"
                            style={{
                                background: bgColor,
                                color: "white",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: "center",
                                gap: '5px',
                                width: '100px',
                                fontSize: '12px',
                            }}
                            data-toggle="modal"
                            data-target="#PARTimerModal"
                        >
                            {row?.Status}
                        </button>}
                    </>
                );
            },
        },
    ]

    return (
        <>
            {
                openTrainingStatusModal ?
                    <dialog className="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="TrainingStatusModal" data-backdrop="false" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className=" modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body ">
                                    <div className="row " style={{ marginTop: '5px', }}>
                                        <div className="col-12 p-0">
                                            <div className="bg-green text-white p-1 d-flex justify-content-between align-items-center" >
                                                <p className="p-0 pl-1 m-0">Personal Training Status</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-1">
                                        <div className="table-responsive mt-2">
                                            <div className="col-12">
                                                <div className="row ">
                                                    <div className="col-12">
                                                        <DataTable
                                                            columns={columns}
                                                            data={personalTrainingStatusData}
                                                            dense
                                                            paginationPerPage={'10'}
                                                            paginationRowsPerPageOptions={[5, 10, 15]}
                                                            highlightOnHover
                                                            noContextMenu
                                                            pagination
                                                            responsive
                                                            subHeaderAlign="right"
                                                            subHeaderWrap
                                                            fixedHeader
                                                            persistTableHead={true}
                                                            customStyles={tableCustomStyles}
                                                            fixedHeaderScrollHeight="190px"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success"
                                                data-dismiss="modal"
                                                onClick={(e) =>
                                                    setOpenTrainingStatusModal(false)
                                                }
                                            >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    :
                    <></>
            }
        </>
    )
}

export default TrainingStatusModal

