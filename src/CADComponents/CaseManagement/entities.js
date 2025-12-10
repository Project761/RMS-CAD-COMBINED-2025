import React, { useEffect, useState } from "react"
import Select from "react-select";
import { colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import { getShowingDateText, tableCustomStyles } from "../../Components/Common/Utility";
import CaseManagementServices from "../../CADServices/APIs/caseManagement";
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import Tooltip from "../Common/Tooltip";
import OtherSummaryModel from "../../Components/Pages/SummaryModel/OtherSummaryModel";
import { fetchPostData } from "../../Components/hooks/Api";
import { threeColArray } from "../../Components/Common/ChangeArrayFormat";
import DataTable from "react-data-table-component";

function Entities(props) {
    const { CaseId = null } = props
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [evidenceType, setEvidenceType] = useState("")
    const [entitiesData, setEntitiesData] = useState([])
    const [updateCount, setUpdateCount] = useState(0)
    const [otherSummModal, setOtherSummModal] = useState(false)
    const [otherColName, setOtherColName] = useState('')
    const [otherColID, setOtherColID] = useState('')
    const [otherUrl, setOtherUrl] = useState('')
    const [modalTitle, setModalTitle] = useState('')
    const [openPage, setOpenPage] = useState('')
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [evidenceOffense, setEvidenceOffense] = useState("")

    const getAllCaseEntitiesKey = `/CaseManagement/GetAllCaseEntities/${localStoreData?.AgencyID}/${CaseId}`;
    const { data: getAllCaseEntitiesData, isSuccess: isGetAllCaseEntitiesDataSuccess, refetch: refetchAllCaseEntitiesData } = useQuery(
        [getAllCaseEntitiesKey, {
            "AgencyID": localStoreData?.AgencyID,
            "CaseID": parseInt(CaseId),
            "EntityTypeFilter": evidenceType,
            "ChargeCodeIDFilter": evidenceOffense,
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
        } else {
            setEntitiesData([])
        }
    }, [getAllCaseEntitiesData, isGetAllCaseEntitiesDataSuccess])

    useEffect(() => {
        if (localStoreData?.AgencyID) {
            get_ChargeCode_Drp_Data(localStoreData?.AgencyID, null, null);
        }
    }, [localStoreData?.AgencyID])

    const get_ChargeCode_Drp_Data = (LoginAgencyID, FBIID, LawTitleID) => {
        const val = { 'AgencyID': LoginAgencyID, 'FBIID': FBIID, 'LawTitleID': LawTitleID };
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setChargeCodeDrp(threeColArray(data, "ChargeCodeID", "Description", "CategoryID"));
            } else {
                setChargeCodeDrp([]);
            }
        });
    };

    const evidenceColumns = [
        {
            name: "Type",
            selector: (row) => row?.Type,
            sortable: true,
            width: "80px",
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
                                        className="px-1 py-1 rounded-pill"
                                        style={{
                                            border: "1px solid #d6b400",
                                            backgroundColor: "#fff8db",
                                            color: "#6b5800",
                                            fontSize: "11px",
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
            width: "200px",
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
                                className="px-1 py-1 rounded-pill"
                                style={{
                                    border: "1px solid #dc3545",
                                    backgroundColor: "#fff5f5",
                                    color: "#dc3545",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                }}
                            >
                                {typeof alert === 'string' ? alert : alert?.label}
                            </span>
                        ))}
                    </div>
                );
            },
            width: "160px",
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
            width: "160px",
        },
        {
            name: "Date Added",
            selector: (row) => row?.DateAdded ? getShowingDateText(row?.DateAdded) : '',
            sortable: true,
            width: "140px",
        },
        {
            name: "Monitor",
            selector: (row) => row?.Monitor,
            cell: (row) => {
                const allowedTypes = ["Person", "Vehicle", "Property"];
                if (!allowedTypes.includes(row?.Type)) {
                    return null;
                }
                return (
                    <input
                        type="checkbox"
                        checked={row?.Monitor}
                        onChange={() => { }}
                        style={{ width: "16px", height: "16px" }}
                    />
                );
            },
            center: true,
            width: "80px",
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
            width: "100px",
        },
    ];

    const evidenceTypeOptions = [
        { label: "Person", value: "Person" },
        { label: "Vehicle", value: "Vehicle" },
        { label: "Property", value: "Property" },
        { label: "Arrest", value: "Arrest" }
    ]

    const getEntityIcon = (type) => {
        if (type === "Person" || type === "Arrest") {
            return <i className="fa fa-user" style={{ fontSize: '24px' }}></i>;
        } else if (type === "Property") {
            return <i className="fa fa-building-o" style={{ fontSize: '24px' }}></i>;
        } else if (type === "Vehicle") {
            return <i className="fa fa-car" style={{ fontSize: '24px' }}></i>;
        }
        return <i className="fa fa-question" style={{ fontSize: '24px' }}></i>;
    };

    const getEntityTagColor = (type) => {
        if (type === "Person") return { bg: '#d1fae5', border: '#10b981', text: '#059669' }; // Green
        if (type === "Arrest") return { bg: '#f3e8ff', border: '#9333ea', text: '#7e22ce' }; // Purple
        if (type === "Property") return { bg: '#fef3c7', border: '#f59e0b', text: '#d97706' }; // Orange
        if (type === "Vehicle") return { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' }; // Blue
        return { bg: '#e5e7eb', border: '#9ca3af', text: '#6b7280' }; // Gray (default)
    };

    const renderEntityCard = (entity) => {
        const tagColor = getEntityTagColor(entity.Type);
        const alerts = typeof entity?.Alerts === 'string'
            ? [...new Set(entity.Alerts.split(',').map(alert => alert.trim()).filter(alert => alert.length > 0))]
            : Array.isArray(entity?.Alerts) ? [...new Set(entity.Alerts)] : [];
        const offenses = typeof entity?.Offense === 'string'
            ? [...new Set(entity.Offense.split(',').map(offense => offense.trim()).filter(offense => offense.length > 0))]
            : Array.isArray(entity?.Offense) ? [...new Set(entity.Offense)] : [];
        const entities = typeof entity?.AssociatedEntities === 'string'
            ? entity.AssociatedEntities.split(',').map(entity => entity.trim()).filter(entity => entity.length > 0)
            : entity?.AssociatedEntities || [];
        return (
            <div
                key={entity.ID}
                style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    display: 'flex',
                    overflow: 'hidden'
                }}
            >
                {/* Left Section */}
                <div style={{ flex: 1, padding: '16px', display: 'flex', gap: '16px' }}>
                    {/* Icon */}
                    <div className="d-flex flex-column align-items-center" style={{ gap: '10px' }}>
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: tagColor.bg,
                                border: `3px solid ${tagColor.border}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                color: tagColor.text,
                                overflow: 'hidden'
                            }}
                        >
                            {entity.Path ? (
                                <img
                                    src={entity.Path}
                                    alt={entity.FullName || 'Entity'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (entity.Type === "Person" || entity.Type === "Arrest") && entity.FullName ? (
                                <span style={{ fontSize: '24px', fontWeight: '600' }}>
                                    {entity.FullName.split(' ').map(word => word.charAt(0).toUpperCase()).join('')}
                                </span>
                            ) : (
                                getEntityIcon(entity.Type)
                            )}
                        </div>
                        <span
                            style={{
                                backgroundColor: tagColor.bg,
                                color: tagColor.text,
                                border: `1px solid ${tagColor.border}`,
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                            }}
                        >
                            {entity.Type === "Person" ? "Person" : entity.Type === "Arrest" ? "Arrest" : entity.Type === "Property" ? "Property" : "Vehicle"}
                        </span>
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                        {/* Name and Type Tag */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                                {entity.FullName || 'N/A'}
                            </h5>
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
                                                className="px-1 py-1 rounded-pill"
                                                style={{
                                                    border: "1px solid #d6b400",
                                                    backgroundColor: "#fff8db",
                                                    color: "#6b5800",
                                                    fontSize: "11px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                +{entities.length - 1} Assets
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            {alerts.length > 0 && alerts.map((alert, index) => (
                                <span
                                    key={index}
                                    style={{
                                        backgroundColor: '#fee2e2',
                                        color: '#dc2626',
                                        border: '1px solid #ef4444',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    <i className="fa fa-exclamation-triangle" style={{ fontSize: '10px' }}></i>
                                    {alert}
                                </span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            {offenses.length > 0 && offenses.map((offense, index) => (
                                <span
                                    key={index}
                                    style={{
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        border: '1px solid #9ca3af',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '500'
                                    }}
                                >
                                    {offense}
                                </span>
                            ))}
                        </div>

                        {/* Details */}
                        <div style={{ fontSize: '13px', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {entity.Linkage && (
                                <div>
                                    <span style={{ fontWeight: '600' }}>Linkage: </span>
                                    {entity.Linkage}
                                </div>
                            )}
                            {entity.DateAdded && (
                                <div>
                                    <span style={{ fontWeight: '600' }}>Date Added: </span>
                                    {getShowingDateText(entity.DateAdded)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section - Purple Sidebar */}
                {/* <div
                    style={{
                        width: '120px',
                        backgroundColor: '#f3e8ff',
                        borderLeft: '1px solid #e5e7eb',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}
                > */}
                {/* Action Buttons */}
                <div style={{
                    display: 'flex', justifyContent: 'flex-end', gap: '8px',
                    margin: "auto 10px"
                }}>
                    <button
                        cla className="btn btn-sm text-white"
                        data-toggle="modal" data-target="#OtherSummaryModel"
                        style={{
                            backgroundColor: "#0d6efd",
                            fontSize: "12px",
                            height: "30px",
                            padding: "4px 10px",
                            borderRadius: "6px",
                        }}
                        onClick={() => {
                            setUpdateCount(updateCount + 1);
                            setOtherSummModal(true);
                            setOtherColName(entity?.Type === "Person" ? "MasterNameID" : entity?.Type === "Vehicle" ? "MasterPropertyID" : entity?.Type === "Property" ? "MasterPropertyID" : "ArrestID");
                            setOtherColID(entity?.ID);
                            setOtherUrl(entity?.Type === "Person" ? "Summary/NameSummary" : entity?.Type === "Vehicle" ? "Summary/VehicleSummary" : entity?.Type === "Property" ? "Summary/PropertySummary" : "Summary/ArrestSummary");
                            setModalTitle(entity?.Type === "Person" ? "Name Summary" : entity?.Type === "Vehicle" ? "Vehicle Summary" : entity?.Type === "Property" ? "Property Summary" : "Arrest Summary");
                            setOpenPage(entity?.Type === "Person" ? "Name-Search" : entity?.Type === "Vehicle" ? "vehicle-Search" : entity?.Type === "Property" ? "Property-Search" : "Arrest-Search");
                        }}
                        title="View Summary"
                    >
                        View MS
                    </button>
                </div>

                {/* </div> */}
            </div>
        );
    };

    return (
        <>
            <div className="col-12 col-md-12 col-lg-12">
                {/* Evidence Filters */}
                <div className="row mb-3">
                    <div className="col-md-2">
                        <Select
                            isClearable
                            options={evidenceTypeOptions}
                            placeholder="Filter By Type"
                            styles={colorLessStyle_Select}
                            value={evidenceTypeOptions?.find(item => item?.value === evidenceType)}
                            onChange={(e) => setEvidenceType(e?.value)}
                        />
                    </div>
                    <div className="col-md-4">
                        <Select
                            isClearable
                            options={chargeCodeDrp}
                            placeholder="Filter By Offense Code/Description"
                            styles={colorLessStyle_Select}
                            value={chargeCodeDrp?.find(item => item?.value === evidenceOffense)}
                            onChange={(e) => setEvidenceOffense(e?.value)}
                        />
                    </div>
                </div>

                {/* <div className="table-responsive CAD-table">
                    <DataTable
                        dense
                        columns={evidenceColumns}
                        data={entitiesData}
                        customStyles={tableCustomStyles}
                        pagination
                        persistTableHead={true}
                        responsive
                        noDataComponent={'There are no data to display'}
                        striped
                        highlightOnHover
                        fixedHeaderScrollHeight='450px'
                        fixedHeader
                    />
                </div> */}
                {/* Entity Cards */}
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {entitiesData && entitiesData?.length > 0 ? (
                        entitiesData.map(entity => renderEntityCard(entity))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                            There are no data to display
                        </div>
                    )}
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

export default Entities
