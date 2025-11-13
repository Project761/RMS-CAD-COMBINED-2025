import React, { useEffect, useState } from "react"
import Select from "react-select";
import { colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import DataTable from "react-data-table-component";
import { getShowingDateText, tableCustomStyles } from "../../Components/Common/Utility";
import CaseManagementServices from "../../CADServices/APIs/caseManagement";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import Tooltip from "../Common/Tooltip";
import OtherSummaryModel from "../../Components/Pages/SummaryModel/OtherSummaryModel";

function EvidenceDocs(props) {
    const { CaseId = null } = props
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [evidenceStatus, setEvidenceStatus] = useState("")
    const [entitiesData, setEntitiesData] = useState([])
    const [updateCount, setUpdateCount] = useState(0)
    const [otherSummModal, setOtherSummModal] = useState(false)
    const [otherColName, setOtherColName] = useState('')
    const [otherColID, setOtherColID] = useState('')
    const [otherUrl, setOtherUrl] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [openPage, setOpenPage] = useState('')
    const getAllCaseEntitiesKey = `/CaseManagement/GetAllCaseEntities/${localStoreData?.AgencyID}/${CaseId}`;
    const { data: getAllCaseEntitiesData, isSuccess: isGetAllCaseEntitiesDataSuccess, refetch: refetchAllCaseEntitiesData } = useQuery(
        [getAllCaseEntitiesKey, {
            "AgencyID": localStoreData?.AgencyID,
            "CaseID": parseInt(CaseId),
        },],
        CaseManagementServices.getAllCaseEntities,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!CaseId
        }
    );

    useEffect(() => {
        if (getAllCaseEntitiesData && isGetAllCaseEntitiesDataSuccess) {
            const data = JSON.parse(getAllCaseEntitiesData?.data?.data)?.Table;
            setEntitiesData(data)
        }
    }, [getAllCaseEntitiesData, isGetAllCaseEntitiesDataSuccess])

    const evidenceColumns = [
        {
            name: "Type",
            selector: (row) => row?.Type,
            sortable: true,
            width: "100px",
        },
        {
            name: "Master Name",
            selector: (row) => row?.FullName,
            sortable: true,
            width: "170px",
        },
        {
            name: "Associated Entities",
            selector: (row) => row?.AssociatedEntities,
            cell: (row) => {
                const entities = typeof row?.AssociatedEntities === 'string'
                    ? row.AssociatedEntities.split(',').map(entity => entity.trim()).filter(entity => entity.length > 0)
                    : row?.AssociatedEntities || [];

                return (
                    <div className="d-flex flex-wrap" style={{ gap: "5px" }}>
                        {entities.length > 0 && (
                            <>
                                <span
                                    className="px-2 py-1 rounded-pill"
                                    style={{
                                        border: "1px solid #d6b400",
                                        backgroundColor: "#fff8db",
                                        color: "#6b5800",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                    }}
                                >
                                    {typeof entities[0] === 'string' ? entities[0] : entities[0]?.label}
                                </span>
                                {entities.length > 1 && (
                                    <span
                                        className="px-2 py-1 rounded-pill"
                                        style={{
                                            border: "1px solid #d6b400",
                                            backgroundColor: "#fff8db",
                                            color: "#6b5800",
                                            fontSize: "12px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        +{entities.length - 1} Assets
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                );
            },
            sortable: false,
            width: "300px",
        },
        {
            name: "Alerts",
            cell: (row) => {
                const alerts = typeof row?.Alerts === 'string'
                    ? row.Alerts.split(',').map(alert => alert.trim()).filter(alert => alert.length > 0)
                    : row?.Alerts || [];

                return (
                    <div className="d-flex flex-wrap" style={{ gap: "5px" }}>
                        {alerts.length > 0 && alerts.map((alert, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 rounded-pill"
                                style={{
                                    border: "1px solid #dc3545",
                                    backgroundColor: "#fff5f5",
                                    color: "#dc3545",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                }}
                            >
                                {typeof alert === 'string' ? alert : alert?.label}
                            </span>
                        ))}
                    </div>
                );
            },
            width: "200px",
        },
        {
            name: "Offense",
            selector: (row) => row?.Offense,
            sortable: true,
            wrap: true,
            cell: (row) => (
                <Tooltip text={row?.Offense || ''} maxLength={40} tooltipTextLimit={120} />
            ),
        },
        {
            name: "Linkage / Source ID",
            selector: (row) => row?.Linkage,
            sortable: true,
            width: "150px",
        },
        {
            name: "Date Added",
            selector: (row) => row?.DateAdded ? getShowingDateText(row?.DateAdded) : '',
            sortable: true,
            width: "150px",
        },
        {
            name: "Monitor",
            selector: (row) => row?.Monitor,
            cell: (row) => (
                <input
                    type="checkbox"
                    checked={row?.Monitor}
                    onChange={() => { }}
                    style={{ width: "16px", height: "16px" }}
                />
            ),
            center: true,
            width: "90px",
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    className="btn btn-sm text-white"
                    data-toggle="modal" data-target="#OtherSummaryModel"
                    style={{
                        backgroundColor: "#0d6efd",
                        fontSize: "12px",
                        padding: "4px 10px",
                        borderRadius: "6px",
                    }}
                    onClick={() => {
                        setUpdateCount(updateCount + 1);
                        setOtherSummModal(true);
                        setOtherColName(row?.Type === "Person" ? "MasterNameID" : row?.Type === "Vehicle" ? "MasterPropertyID" : row?.Type === "Property" ? "MasterPropertyID" : "ArrestID");
                        setOtherColID(row?.ID);
                        setOtherUrl(row?.Type === "Person" ? "Summary/NameSummary" : row?.Type === "Vehicle" ? "Summary/VehicleSummary" : row?.Type === "Property" ? "Summary/PropertySummary" : "Summary/ArrestSummary");
                        setModalTitle(row?.Type === "Person" ? "Name Summary" : row?.Type === "Vehicle" ? "Vehicle Summary" : row?.Type === "Property" ? "Property Summary" : "Arrest Summary");
                        setOpenPage(row?.Type === "Person" ? "Name-Search" : row?.Type === "Vehicle" ? "vehicle-Search" : row?.Type === "Property" ? "Property-Search" : "Arrest-Search");
                    }}
                >
                    View MS
                </button>
            ),
            width: "110px",
        },
    ];


    return (
        <>
            <div className="col-12 col-md-12 col-lg-12 mt-2">
                {/* Case Evidence Section */}
                {/* Evidence Filters */}
                <div className="row mb-3">
                    <div className="col-md-2">
                        <Select
                            isClearable
                            options={[
                                { label: "Logged", value: "Logged" },
                                { label: "Pending Lab", value: "Pending Lab" },
                                { label: "In Transit", value: "In Transit" }
                            ]}
                            placeholder="Type"
                            styles={colorLessStyle_Select}
                            value={evidenceStatus}
                            onChange={(e) => setEvidenceStatus(e)}
                        />
                    </div>
                    <div className="col-md-4">
                        <Select
                            isClearable
                            options={[
                                { label: "Logged", value: "Logged" },
                                { label: "Pending Lab", value: "Pending Lab" },
                                { label: "In Transit", value: "In Transit" }
                            ]}
                            placeholder="Offense Code/Description"
                            styles={colorLessStyle_Select}
                            value={evidenceStatus}
                            onChange={(e) => setEvidenceStatus(e)}
                        />
                    </div>
                </div>

                {/* Evidence Table */}
                <div className="table-responsive CAD-table">
                    <DataTable
                        dense
                        columns={evidenceColumns}
                        data={entitiesData}
                        customStyles={tableCustomStyles}
                        pagination
                        responsive
                        noDataComponent={'There are no data to display'}
                        striped
                        highlightOnHover
                        fixedHeader
                    />
                </div>
            </div>
            <OtherSummaryModel
                {...{ otherSummModal, setOtherSummModal, updateCount, openPage, modalTitle }} IsMaster
                otherColName={otherColName}
                otherColID={otherColID}
                otherUrl={otherUrl}
            />
        </>
    )
}

export default EvidenceDocs
