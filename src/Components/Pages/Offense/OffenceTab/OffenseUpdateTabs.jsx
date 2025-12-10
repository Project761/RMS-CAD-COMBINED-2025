import React, { useState, useEffect, useRef, useContext } from "react";
import BasicInformation from "./BasicInformation/BasicInformation";
import Home from "./Home/Home";
import { AgencyContext } from "../../../../Context/Agency/Index";
import { Decrypt_Id_Name, base64ToString, getShowingWithOutTime, tableCustomStyles, stringToBase64, isLockOrRestrictModule } from "../../../Common/Utility";
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Tab from "../../../Utility/Tab/Tab";
import Log from "../../Log/Log";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { get_LocalStoreData } from "../../../../redux/actions/Agency";
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from "../../../hooks/Api";
import DataTable from "react-data-table-component";
import DeletePopUpModal from "../../../Common/DeleteModal";
import { toastifySuccess } from "../../../Common/AlertMsg";
import { check_NibrsCode_09C, TableErrorTooltip } from "./ErrorNibrs";

const OffenceHomeTabs = () => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecOffID = 0
    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    let OffSta = query?.get('OffSta');
    let OffId = query?.get('OffId');
    let CrimeSta = query?.get('CrimeSta');
    let isNew = query?.get('isNew');
    var openPage = query?.get('page');

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!OffId) OffId = 0;
    else DecOffID = parseInt(base64ToString(OffId));

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const { changesStatus, localStoreArray, countoff, offenceFillterData, get_Incident_Count, incidentCount, get_Offence_Data, setEditval, countoffaduit, offenseCount, setOffenseCount, offenseValidateNibrsData } = useContext(AgencyContext);


    const carouselRef = useRef(null);
    const crimeIdRef = useRef(null);
    const offenseCountnew = incidentCount[0]?.OffenseCount || 0;
    const PropertyCount = incidentCount[0]?.PropertyCount || 0;
    const PropertyDrugCount = incidentCount[0]?.PropertyDrugCount || 0;
    const VehicleCount = incidentCount[0]?.VehicleCount || 0;

    const [ListData, setListData] = useState([]);
    const [status, setStatus] = useState();
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [offenceID, setOffenceID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [showOffPage, setshowOffPage] = useState('home');
    const [nibrsCode, setNibrsCode] = useState('');
    const [isCrimeExists, setIsCrimeExists] = useState(false);
    const [viewType, setViewType] = useState('card');
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);

    // nibrs Validate Incident
    const [nibrsValidateOffenseData, setnibrsValidateOffenseData] = useState([]);
    const [nibrsOffErrStr, setNibrsOffErrStr] = useState("");
    const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
    const [nibrsValidateloder] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [crimeId, setCrimeId] = useState("");
    const [ResetErrors, setResetErrors] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    // Lock Restrict
    const [isLocked, setIsLocked] = useState(false);
    const [permissionToUnlock, setPermissionToUnlock] = useState(false);

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    // nibrs Validate Offense
    useEffect(() => {
        if (offenseValidateNibrsData?.Offense) {
            setnibrsValidateOffenseData(offenseValidateNibrsData?.Offense);
        }
    }, [offenseValidateNibrsData]);

    useEffect(() => {
        if (IncID) {
            get_Offence_Data(IncID); setMainIncidentID(IncID); getPermissionLevelByLock(IncID, localStoreData?.PINID);
        }
    }, [IncID]);

    const getScreenPermision = (LoginAgencyID, PinID) => {
        ScreenPermision("O036", LoginAgencyID, PinID).then((res) => {
            if (res) {
                setEffectiveScreenPermission(res); setPermissionForEdit(res[0]?.Changeok); setPermissionForAdd(res[0]?.AddOK);
                setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
            } else {
                setEffectiveScreenPermission([]); setPermissionForEdit(false); setPermissionForAdd(false); setaddUpdatePermission(false);
            }
        });
    };

    useEffect(() => {
        if (OffSta === 'true' || OffSta === true) {
            setStatus(true);
        } else {
            setStatus(false);
        }
        if (CrimeSta) {
            setshowOffPage('CrimeInformation');
        } else {
            setshowOffPage('home');
        }
    }, [OffSta, CrimeSta])

    useEffect(() => {
        if (DecOffID) { get_List(DecOffID) }
    }, [DecOffID]);

    const get_List = (DecOffID) => {
        const val = { CrimeID: DecOffID, }
        fetchPostData('TabBasicInformation/CrimeInformation', val).then((res) => {
            if (res) {
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }

    const getPermissionLevelByLock = async (IncidentID, OfficerID) => {
        try {
            const res = await fetchPostData("Restricted/GetPermissionLevelBy_Lock", { 'IncidentID': IncidentID, 'OfficerID': OfficerID, 'ModuleName': "Incident", 'ID': 0 });
            if (res?.length > 0) {
                setIsLocked(res[0]?.IsLocked === true || res[0]?.IsLocked === 1 ? true : false);
                setPermissionToUnlock(res[0]?.IsUnLockPermission === true || res[0]?.IsUnLockPermission === 1 ? true : false);

            } else {
                setPermissionToUnlock(false);
                setIsLocked(false);

            }
        } catch (error) {
            console.error('There was an error!', error);
            setPermissionToUnlock(false);
            setIsLocked(false);
        }
    }

    const columns = [
        {
            minWidth: "200px",
            grow: 1,
            name: "TIBRS Code",
            selector: (row) => row.FBIID_Description,
            sortable: true,
            cell: (row) =>
                check_NibrsCode_09C(row.FBICode, offenceFillterData) ? (
                    <div className="tooltip-left-zero">
                        <TableErrorTooltip
                            value={row.FBIID_Description}
                            ErrorStr={check_NibrsCode_09C(row.FBICode, offenceFillterData)}
                        />
                    </div>
                ) : (
                    row.FBIID_Description
                ),
        },
        {
            minWidth: "200px",
            grow: 2,
            name: "Offense Code",
            selector: (row) => row.OffenseName_Description,
            sortable: true,
        },
        {
            minWidth: "100px",
            grow: 1,
            name: "Law Title",
            selector: (row) => row.LawTitle_Description,
            sortable: true,
        },
        {
            minWidth: "120px",
            grow: 1,
            cell: (row) => (
                <div >
                    {(row?.FBICode === "35A" || row?.FBICode === "35B") && row?.AttemptComplete === "Completed" && (
                        <span
                            onClick={(e) => {
                                navigate(`/Prop-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${0}&MProId=${0}&ProSta=${false}&FbiCode=${row.FBICode}&AttComp=${row?.AttemptComplete === "Completed" ? "C" : "A"}`);
                            }}
                            className={`btn btn-sm  text-white px-2 py-0 mr-1`}
                            style={{
                                backgroundColor: PropertyDrugCount === 0 ? "red" : "#19aea3",
                            }}
                        >
                            Drug Property
                        </span>
                    )}
                </div>
            ),
        },
        {
            minWidth: "110px",
            grow: 1,
            cell: (row) => (
                <div >
                    {row?.IsCrimeAgainstProperty === true && (
                        <span
                            onClick={(e) => {
                                navigate(`/Prop-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${0}&MProId=${0}&ProSta=${false}&FbiCode=${row.FBICode}&AttComp=${row?.AttemptComplete === "Completed" ? "C" : "A"}`);
                            }}
                            className={`btn btn-sm  text-white px-2 py-0 mr-1 `}
                            style={{
                                backgroundColor: (row?.IsCrimeAgainstProperty === true && PropertyCount === 0) ? "red" : "#19aea3",
                            }}
                        >
                            Property
                        </span>
                    )}
                </div >
            ),
        },
        {
            minWidth: "110px",
            grow: 1,
            cell: (row) => (
                <div >
                    {row?.IsCrimeAgainstProperty === true && (
                        <span
                            onClick={(e) => {
                                navigate(`/Vehicle-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${0}&MVehId=${0}&VehSta=${false}&FbiCode=${row.FBICode}&AttComp=${row?.AttemptComplete === "Completed" ? "C" : "A"}`);
                            }}
                            // className={`btn btn-sm bg-green text-white px-2 py-0 mr-1`}
                            className={`btn btn-sm  text-white px-2 py-0 mr-1 `}
                            style={{
                                backgroundColor: (row?.FBICode === "240" && VehicleCount === 0) ? "red" : "#19aea3",
                            }}
                        >
                            Vehicle
                        </span>
                    )}
                </div>
            ),
        },
        {
            minWidth: "40px",
            grow: 1,
            name: (
                <p
                    className="text-end"
                    style={{ position: "absolute", top: "7px", }}
                >
                    Action
                </p>
            ),
            cell: (row) => (
                <div >
                    {row.ArrestChargeCount === "0" && (
                        effectiveScreenPermission ? (
                            effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", offenceFillterData, isLocked, true) ? (
                                <span
                                    onClick={() => { setCrimeId(row.CrimeID); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                    data-toggle="modal"
                                    data-target="#DeleteModal"
                                >
                                    <i className="fa fa-trash"></i>
                                </span>
                            ) : null
                        ) : (
                            !isLockOrRestrictModule("Lock", offenceFillterData, isLocked, true) &&
                            <span
                                onClick={() => { setCrimeId(row.CrimeID); }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                data-toggle="modal"
                                data-target="#DeleteModal"
                            >
                                <i className="fa fa-trash"></i>
                            </span>
                        )
                    )}
                </div>
            ),
        },
    ];

    const setEditValOffense = (row) => {
        setCrimeId(row.CrimeID);
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
            modal?.show();
        } else {
            if (row.CrimeID) {
                navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(row.CrimeID)}&OffSta=${true}`);
                setClickCount(clickCount + 1);
                setCrimeId(row.CrimeID);
                setStatus(true);
                setResetErrors(true);
                setshowOffPage('home');
            }
        }
    };

    const getCrimeInfoErrorButton = (crimeId, nibrsValidateOffenseData) => {
        const arr = nibrsValidateOffenseData?.filter((item) => (item?.CrimeID === crimeId) && (item?.Bias === true || item?.OffenderUsing === true || item?.CriminalActivity === true || item?.Weapon === true));
        return arr?.[0]?.OnPageError;
    };

    const getOffenseNibrsError = (crimeId, nibrsValidateOffenseData) => {
        const arr = nibrsValidateOffenseData?.filter(
            (item) => item?.CrimeID === crimeId
        );
        return arr?.[0]?.OnPageError;
    };

    const setOffenseErrString = (CrimeID, nibrsValidateOffenseData) => {
        const arr = nibrsValidateOffenseData?.filter(
            (item) => item?.CrimeID === CrimeID
        );
        setNibrsOffErrStr(arr[0]?.OnPageError);
        setNibrsErrModalStatus(true);
    };

    const getStatusColors = (CrimeID, nibrsValidateOffenseData) => {
        return getOffenseNibrsError(CrimeID, nibrsValidateOffenseData) ? { backgroundColor: "rgb(255 202 194)" } : {};
    };

    const mergedConditionalRowStyles = [
        {
            when: () => true,
            style: (row) => ({
                ...getStatusColors(row.CrimeID, nibrsValidateOffenseData),
                ...(row.CrimeID === crimeId
                    ? {
                        backgroundColor: "#001f3fbd",
                        color: "white",
                        cursor: "pointer",
                    }
                    : {}),
            }),
        },
    ];

    const setStatusFalse = (e) => {
        navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${0}&OffSta=${false}&isNew=${true}`);
        setCrimeId('');
        setStatus(false);
        setshowOffPage('home');
    };

    const DeleteOffence = () => {
        const val = { CrimeID: crimeId, DeletedByUserFK: loginPinID };
        AddDeleteUpadate("Crime/Delete_Offense", val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            get_Incident_Count(mainIncidentID, loginPinID);
            get_Offence_Data(mainIncidentID);
            setStatusFalse();
            setResetErrors(true);
        });
    };

    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    {
                        !openPage && <Tab />
                    }
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card">
                            <div className="card-body py-1">


                                {offenceFillterData && offenceFillterData.length > 0 && (
                                    <div className="card-carousel-container position-relative mb-1">
                                        {/* Cards Wrapper */}
                                        <div className="col-lg-10">
                                            {viewType === "card" ? (
                                                <div className="card-carousel" id="cardCarousel" ref={carouselRef}>

                                                    {offenceFillterData?.map((row, index) => (

                                                        <div
                                                            className="info-card position-relative d-flex align-items-center justify-content-between"
                                                            key={index}
                                                            style={{
                                                                cursor: "pointer",
                                                                borderLeft: nibrsValidateOffenseData?.some(item => item?.CrimeID === row?.CrimeID) ? "5px solid #EB0101" : "5px solid #2DEB7A",
                                                                backgroundColor: row?.CrimeID === crimeId ? "#425971" : "#ffffff",
                                                            }}
                                                        >
                                                            {/* Card Content */}
                                                            <div>
                                                                <p
                                                                    className="mb-1 small truncate-multiline"
                                                                    style={{ color: row?.CrimeID === crimeId ? "white" : "black", fontWeight: "bold" }}
                                                                >
                                                                    {row.FBIID_Description}
                                                                </p>

                                                                <p
                                                                    className="mb-1 small truncate-multiline"
                                                                    style={{ color: row?.CrimeID === crimeId ? "white" : "black" }}
                                                                >
                                                                    {row.OffenseName_Description || ""}
                                                                </p>

                                                                <p
                                                                    className="mb-0 small truncate-multiline"
                                                                    style={{ color: row?.CrimeID === crimeId ? "white" : "black" }}
                                                                >
                                                                    {row.LawTitle_Description || ""}
                                                                </p>
                                                            </div>


                                                            <div className="d-flex flex-column align-items-center gap-2 flex-shrink-0">
                                                                {/* Edit Button */}
                                                                {
                                                                    effectiveScreenPermission ?
                                                                        <>
                                                                            {
                                                                                effectiveScreenPermission[0]?.Changeok ?
                                                                                    <>
                                                                                        <div
                                                                                            style={{
                                                                                                backgroundColor: "#001f3f",
                                                                                                color: "white",
                                                                                                width: "36px",
                                                                                                height: "36px",
                                                                                                borderRadius: "50%",
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                justifyContent: "center",
                                                                                                cursor: "pointer",
                                                                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                                                                marginBottom: "10px"
                                                                                                // transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                                                            }}
                                                                                            onClick={() => { setEditValOffense(row); setshowOffPage('home'); }}
                                                                                            title="Edit"
                                                                                        >
                                                                                            <i className="fa fa-edit"></i>
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                    </>
                                                                            }
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <div
                                                                                style={{
                                                                                    backgroundColor: "#001f3f",
                                                                                    color: "white",
                                                                                    width: "36px",
                                                                                    height: "36px",
                                                                                    borderRadius: "50%",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    justifyContent: "center",
                                                                                    cursor: "pointer",
                                                                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                                                    marginBottom: "10px"
                                                                                }}
                                                                                onClick={() => { setEditValOffense(row); setshowOffPage('home'); }}
                                                                                title="Edit"
                                                                            >
                                                                                <i className="fa fa-edit"></i>
                                                                            </div>
                                                                        </>
                                                                }

                                                                {/* Delete Button */}
                                                                {
                                                                    row.ArrestChargeCount === "0" ? (
                                                                        <>
                                                                            {effectiveScreenPermission ? (
                                                                                effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", offenceFillterData, isLocked, true) ? (
                                                                                    <div
                                                                                        style={{
                                                                                            backgroundColor: "#001f3f",
                                                                                            color: "white",
                                                                                            width: "36px",
                                                                                            height: "36px",
                                                                                            borderRadius: "50%",
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "center",
                                                                                            cursor: "pointer",
                                                                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                                                        }}
                                                                                        data-toggle="modal"
                                                                                        data-target="#DeleteModal"
                                                                                        onClick={() => setCrimeId(row.CrimeID)}
                                                                                        title="Delete"
                                                                                    >
                                                                                        <i className="fa fa-trash"></i>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div
                                                                                        style={{
                                                                                            width: "36px",
                                                                                            height: "36px",
                                                                                            borderRadius: "50%",
                                                                                        }}
                                                                                    ></div>
                                                                                )
                                                                            ) : (
                                                                                !isLockOrRestrictModule("Lock", offenceFillterData, isLocked, true) ? (
                                                                                    <div
                                                                                        style={{
                                                                                            backgroundColor: "#001f3f",
                                                                                            color: "white",
                                                                                            width: "36px",
                                                                                            height: "36px",
                                                                                            borderRadius: "50%",
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "center",
                                                                                            cursor: "pointer",
                                                                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                                                        }}
                                                                                        data-toggle="modal"
                                                                                        data-target="#DeleteModal"
                                                                                        onClick={() => setCrimeId(row.CrimeID)}
                                                                                        title="Delete"
                                                                                    >
                                                                                        <i className="fa fa-trash"></i>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div
                                                                                        style={{
                                                                                            width: "36px",
                                                                                            height: "36px",
                                                                                            borderRadius: "50%",
                                                                                        }}
                                                                                    ></div>
                                                                                )
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                width: "36px",
                                                                                height: "36px",
                                                                                borderRadius: "50%",
                                                                            }}
                                                                        ></div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                                :
                                                viewType === "list" ? (
                                                    <div className="modal-table" >
                                                        <DataTable
                                                            showHeader={true}
                                                            persistTableHead={true}
                                                            dense
                                                            columns={columns}
                                                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? offenceFillterData : "" : offenceFillterData}
                                                            highlightOnHover
                                                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : "There are no data to display"}
                                                            responsive
                                                            customStyles={tableCustomStyles}
                                                            onRowClicked={(row) => {
                                                                setEditValOffense(row);
                                                                setshowOffPage('home');
                                                            }}
                                                            conditionalRowStyles={mergedConditionalRowStyles}
                                                            // conditionalRowStyles={conditionalRowStyles1}
                                                            // conditionalRowStyles={conditionalRowStyles}
                                                            fixedHeader
                                                            fixedHeaderScrollHeight="110px"

                                                        />
                                                    </div>
                                                )
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="col-lg-2">
                                            <div className="view-toggle d-flex align-items-center justify-content-end" style={{ gap: "10px" }}>
                                                <button className="btn btn-sm btn-success" onClick={() => {
                                                    setStatusFalse(); setResetErrors(true); setIsLocked(false);
                                                }}> New </button>
                                                {viewType === "card" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("list")}  > Grid </button>)}
                                                {viewType === "list" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("card")} > Card  </button>)}
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {
                                    (status || isNew === "true" || isNew === true || offenseCountnew === 0 || offenseCountnew === "0") && (
                                        <div className="row mt-1 " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                            <div className="col-12  incident-tab">
                                                <ul className='nav nav-tabs'>
                                                    <Link
                                                        className={`nav-item ${showOffPage === 'home' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        to={`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${OffId}&OffSta=${OffSta}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showOffPage === 'home' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) setshowOffPage('home') }}

                                                    >
                                                        {iconHome}
                                                    </Link>
                                                    <span
                                                        className={`nav-item ${showOffPage === 'CrimeInformation' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}

                                                        style={{ color: showOffPage === 'CrimeInformation' ? 'Red' : offenseCount?.CrimeInfoCount != "0" ? 'blue' : '#000' }}

                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) setshowOffPage('CrimeInformation') }}

                                                    >
                                                        Crime Information
                                                    </span>
                                                    <span
                                                        className={`nav-item ${showOffPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showOffPage === 'AuditLog' ? 'Red' : countoffaduit === true ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) setshowOffPage('AuditLog') }}
                                                    >
                                                        Audit Log
                                                    </span>
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    showOffPage === 'home' ?
                                        <Home {...{ status, setStatus, offenceID, ResetErrors, setResetErrors, setOffenceID, get_List, nibrsCode, setNibrsCode, setshowOffPage, clickCount, isLocked }} />
                                        :
                                        showOffPage === 'CrimeInformation' ?
                                            <BasicInformation {...{ ListData, loginPinID, loginAgencyID, offenceID, mainIncidentID, nibrsCode, setNibrsCode, isLocked }} />
                                            :
                                            showOffPage === 'AuditLog' ?
                                                <Log
                                                    ParentId={DecOffID}
                                                    scrCode={'O094'}
                                                    url={'Log/GetData_OffenseLog'}
                                                    para={'CrimeID'}
                                                />
                                                :
                                                <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteOffence} />
        </div>
    )
}

export default OffenceHomeTabs
