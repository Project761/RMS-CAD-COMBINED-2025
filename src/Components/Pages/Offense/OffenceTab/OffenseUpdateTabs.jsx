import React, { useState, useEffect, useRef, useContext } from "react";
import BasicInformation from "./BasicInformation/BasicInformation";
import Home from "./Home/Home";
import { AgencyContext } from "../../../../Context/Agency/Index";
import { Decrypt_Id_Name, base64ToString, getShowingWithOutTime, tableCustomStyles, stringToBase64 } from "../../../Common/Utility";
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

    const { changesStatus, localStoreArray, countoff, offenceFillterData, get_Incident_Count, incidentCount, get_Offence_Data, setEditval, countoffaduit, offenseCount, setOffenseCount, } = useContext(AgencyContext);

    const carouselRef = useRef(null);
    const crimeIdRef = useRef(null);
    const PropertyCount = incidentCount[0]?.PropertyCount || 0;
    const PropertyDrugCount = incidentCount[0]?.PropertyDrugCount || 0;
    const [ListData, setListData] = useState([]);
    const [status, setStatus] = useState()
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
    const [delCrimeId, setDelCrimeId] = useState("");

    // const [nibrsCode, setNibrsCode] = useState('09C');

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

    useEffect(() => {
        if (IncID) {
            get_Offence_Data(IncID); setMainIncidentID(IncID);
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
            minWidth: "110px",
            grow: 1,
            cell: (row) => (
                <div >
                    {
                        getCrimeInfoErrorButton(row.CrimeID, nibrsValidateOffenseData) ?
                            <>
                                <span
                                    onClick={(e) => {
                                        navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(row?.CrimeID)}&OffSta=${true}&CrimeSta=${true}`);
                                    }}
                                    className={`btn btn-sm text-white px-2 py-0 mr-1 `}
                                    style={{
                                        backgroundColor: "red",
                                    }}
                                >
                                    Crime Info
                                </span>
                            </>
                            :
                            <>
                                <span
                                    onClick={(e) => {
                                        navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(row?.CrimeID)}&OffSta=${true}&CrimeSta=${true}`);
                                    }}
                                    className={`btn btn-sm text-white px-2 py-0 mr-1 `}
                                    style={{
                                        backgroundColor: "#19aea3",
                                    }}
                                >
                                    Crime Info
                                </span>
                            </>
                    }
                </div>
            ),

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
                            className={`btn btn-sm bg-green text-white px-2 py-0 mr-1`}
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
            name: "View",
            cell: (row) => (
                <div >
                    {getOffenseNibrsError(row.CrimeID, nibrsValidateOffenseData) ? (
                        <span
                            onClick={(e) =>
                                setOffenseErrString(row.CrimeID, nibrsValidateOffenseData)
                            }
                            className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                            data-toggle="modal"
                            data-target="#NibrsErrorShowModal"
                        >
                            <i className="fa fa-eye"></i>
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
            ),
            // omit: row => getOffenseNibrsError(row.CrimeID, nibrsValidateOffenseData) ? false : true,
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
                            effectiveScreenPermission[0]?.DeleteOK ? (
                                <span
                                    // onClick={() => handleDeleteClick(row)}
                                    onClick={() => { setCrimeId(row.CrimeID); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                    data-toggle="modal"
                                    data-target="#DeleteModal"
                                >
                                    <i className="fa fa-trash"></i>
                                </span>
                            ) : null
                        ) : (
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
        console.log(row)
        setCrimeId(row.CrimeID);
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
            modal?.show();
        } else {
            if (row.CrimeID) {
                // setStatesChangeStatus(false);
                navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(row.CrimeID)}&OffSta=${true}`);
                // setErrors({ ...errors, ChargeCodeIDError: "", NibrsIdError: "" });
                // GetSingleData(row.CrimeID);
                //    get_Offence_Count(row.CrimeID);
                //    NibrsErrorReturn(row.CrimeID);
                setCrimeId(row.CrimeID);
                // setOffenceID(row?.CrimeID);
                setStatus(true);
                // Reset();
            }
            // setUpdateCount(updateCount + 1);
            //  setIncStatus(true);
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
        // console.log("🚀 ~ getOffenseNibrsError ~ arr:", arr);
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
        // NIBRSCodeDrpDwnVal(loginAgencyID, 0);
        setCrimeId('');
        setStatus(false);
        // Reset();
    };


    // const GetSingleData = (crimeId) => {
    //     const val = { CrimeID: crimeId };
    //     fetchPostData("Crime/GetSingleData_Offense", val).then((res) => {
    //         if (res) {
    //             setEditval(res);
    //             const PanelCode = res[0]?.PanelCode;
    //             // setPanelCode(PanelCode)
    //         } else {
    //             setEditval();
    //         }
    //     });
    // };



    const DeleteOffence = () => {
        const val = { CrimeID: crimeId, DeletedByUserFK: loginPinID };
        AddDeleteUpadate("Crime/Delete_Offense", val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            get_Incident_Count(mainIncidentID, loginPinID);
            get_Offence_Data(mainIncidentID);
            // setStatusFalse();
            setResetErrors(true);
            //  Reset();
        });
    };

    // const handleDeleteClick = (row) => {
    //     setCrimeId(row.CrimeID);
    // };

    console.log(offenceFillterData, crimeId, loginPinID)
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
                            <div className="card-body">
                                {offenceFillterData && offenceFillterData.length > 0 && (
                                    <div className="card-carousel-container position-relative mb-3">
                                        {/* Cards Wrapper */}
                                        {viewType === "card" ? (
                                            <div className="card-carousel" id="cardCarousel" ref={carouselRef}>

                                                {offenceFillterData?.map((row, index) => (
                                                    <div
                                                        className="info-card position-relative d-flex align-items-center justify-content-between"
                                                        key={index}
                                                        style={{
                                                            cursor: "pointer",
                                                            // borderLeft: nibrsNameValidateArray?.some(item => item?.NameEventID === row?.NameID) ? "5px solid #EB0101" : "5px solid #2DEB7A",
                                                        }}
                                                    >
                                                        {/* Card Content */}
                                                        <div>
                                                            <div>
                                                                <p className="mb-0 small" style={{ color: "black" }}><strong>{row.OffenseName_Description}</strong></p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small"> {row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : ""}</p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small">{row.Gender}</p>
                                                            </div>
                                                            <div>
                                                                <p
                                                                    className="mb-0 small"
                                                                    style={{
                                                                        color:
                                                                            row.RoleName === "Other" ? "orange"
                                                                                :
                                                                                row.RoleName === "Victim" ? "green"
                                                                                    :
                                                                                    row.RoleName === "Offender" ? "red"
                                                                                        :
                                                                                        "black",
                                                                    }}
                                                                >
                                                                    {row.FBIID_Description ? row.FBIID_Description.length > 40 ? `${row.FBIID_Description.substring(0, 50)} . . .` : row.FBIID_Description : ""}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-column align-items-center gap-2 flex-shrink-0">
                                                            {/* Edit Button */}
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
                                                                // onMouseEnter={(e) => {
                                                                //     e.currentTarget.style.transform = "scale(1.1)";
                                                                //     e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
                                                                // }}
                                                                // onMouseLeave={(e) => {
                                                                //     e.currentTarget.style.transform = "scale(1)";
                                                                //     e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                                                // }}
                                                                onClick={() => {
                                                                    setEditValOffense(row);
                                                                    setResetErrors(true);
                                                                }}

                                                                title="Edit"
                                                            >
                                                                <i className="fa fa-edit"></i>
                                                            </div>

                                                            {/* Delete Button */}
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
                                                                    // transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                                }}
                                                                // onMouseEnter={(e) => {
                                                                //     e.currentTarget.style.transform = "scale(1.1)";
                                                                //     e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
                                                                // }}
                                                                // onMouseLeave={(e) => {
                                                                //     e.currentTarget.style.transform = "scale(1)";
                                                                //     e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                                                // }}
                                                                data-toggle="modal"
                                                                data-target="#DeleteModal"
                                                                // onClick={() => handleDeleteClick(row)}
                                                                onClick={() => setCrimeId(row.CrimeID)}
                                                                title="Delete"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </div>
                                                        </div>
                                                        {/* <div className="d-fle flex-column gap-2 flex-shrink-0">
                                                                                            <div
                                                                                                style={{
                                                                                                    backgroundColor: "#001f3f",
                                                                                                    padding: "8px",
                                                                                                    borderRadius: "50%",
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    justifyContent: "center",
                                                                                                    cursor: "pointer",
                                                                                                    marginBottom: "10px"
                                                                                                }}
                                                                                                className="text-white "
                                                                                                onClick={() => { set_Edit_Value(row); setResetErrors(true) }}
                                                                                            >
                                                                                                <i className="fa fa-edit"></i>
                                                                                            </div>
                                                                                            <div
                                                                                                style={{
                                                                                                    backgroundColor: "#001f3f",
                                                                                                    padding: "8px",
                                                                                                    borderRadius: "50%",
                                                                                                    display: "flex",
                                                                                                    alignItems: "center",
                                                                                                    justifyContent: "center",
                                                                                                    cursor: "pointer",
                                                                                                    fontSize: '20px'
                                                                                                }}
                                                                                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteNameModal"
                                                                                                onClick={() => { setNameID(row.NameID); }}
                                                                                            >
                                                                                                <i className="fa fa-trash"></i>
                                                                                            </div>
                                                                                        </div> */}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                            :
                                            viewType === "list" ? (
                                                <div className="modal-table" style={{ flex: "0 0 95%", maxWidth: "95%" }}>

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
                                                        }}
                                                        conditionalRowStyles={mergedConditionalRowStyles}
                                                        // conditionalRowStyles={conditionalRowStyles1}
                                                        // conditionalRowStyles={conditionalRowStyles}
                                                        fixedHeader
                                                        fixedHeaderScrollHeight="170px"
                                                        pagination
                                                        paginationPerPage={"100"}
                                                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                        showPaginationBottom={100}
                                                    />

                                                </div>
                                            )
                                                :
                                                null
                                        }
                                        <div className="text-right ml-3">
                                            <div className="right-controls d-flex flex-column align-items-center gap-2">
                                                <div className="view-toggle d-flex flex-column gap-2">
                                                    <button className="btn btn-sm btn-success mb-2" onClick={() => { setStatusFalse(); setResetErrors(true); }}> New </button>
                                                    {viewType === "card" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("list")}  > Grid </button>)}
                                                    {viewType === "list" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("card")} > Card  </button>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {
                                    (status || isNew === "true" || isNew === true || offenseCount === 0 || offenseCount === "0") && (
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
                                                        // to={`/Off-Home?IncId=${IncID}WVX?OffId=${OffId}`}
                                                        style={{ color: showOffPage === 'CrimeInformation' ? 'Red' : offenseCount?.CrimeInfoCount != "0" ? 'blue' : '#000' }}
                                                        // style={{ color: showOffPage === 'CrimeInformation' ? 'Red' : countoff === true ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) setshowOffPage('CrimeInformation') }}

                                                    >
                                                        Crime Information
                                                    </span>
                                                    <span
                                                        className={`nav-item ${showOffPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        // to={`/Off-Home?IncId=${IncID}WVX?OffId=${OffId}`} 
                                                        // style={{ color: showOffPage === 'AuditLog' ? 'Red' : '#000' }}
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
                                        <Home {...{ status, setStatus, offenceID, ResetErrors, setResetErrors, setOffenceID, get_List, nibrsCode, setNibrsCode, setshowOffPage, }} />
                                        :
                                        showOffPage === 'CrimeInformation' ?
                                            <BasicInformation {...{ ListData, loginPinID, loginAgencyID, offenceID, mainIncidentID, nibrsCode, setNibrsCode, }} />
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
