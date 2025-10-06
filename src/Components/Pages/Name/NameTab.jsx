import { useContext, useEffect, useRef, useState } from 'react';
import Home from './NameTab/Home/Home';
import General from './NameTab/General/General';
import ContactDetails from './NameTab/ContactDetails/ContactDetails';
import Aliases from './NameTab/Aliases/Aliases';
import Smt from './NameTab/SMT/Smt';
import Victim from './NameTab/Victim/Victim';
import IdentificationNumber from './NameTab/IdentificationNumber/IdentificationNumber';
import Gang from './NameTab/Gang/Gang';
import { AgencyContext } from '../../../Context/Agency/Index';
import Connection from './NameTab/Connection/Connection';
import Address from './NameTab/Address/Address';
import { Decrypt_Id_Name, getShowingWithOutTime, stringToBase64, tableCustomStyle } from '../../Common/Utility';
import Tab from '../../Utility/Tab/Tab';
import { Link, useNavigate } from 'react-router-dom';
import AssaultInjuryCom from './NameTab/Offender/OffenderTab/AllTabCom/AssaultInjuryCom';
import Appearance from './NameTab/Appearance/Appearance';
import Log from '../Log/Log';
import { useLocation } from "react-router-dom";
import { base64ToString } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import Involvements from '../SummaryModel/Involvement';
import Warrant from './NameTab/Warrant/Warrant';
import History from './NameTab/History/History';
import Offense from './NameTab/Offense/Offense';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toastifySuccess } from '../../Common/AlertMsg';
import DeleteNameModal from '../../Common/DeleteNameModel';

const NameTab = ({ isCad = false, isCADSearch = false, isViewEventDetails = false }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var NameID = query?.get("NameID");
    var MasterNameID = query?.get('MasterNameID');
    var IncID = query?.get('IncId');
    var NameStatus = query?.get('NameStatus');
    var MstPage = query?.get('page');
    var ModNo = query?.get('ModNo');
    var ProSta = query?.get('ProSta');
    var SideBarStatus = query?.get("SideBarStatus");

    let DecNameID = 0, DecMasterNameID = 0, DecIncID = 0;

    if (!NameID) NameID = 0;
    else DecNameID = parseInt(base64ToString(NameID));
    if (!MasterNameID) MasterNameID = 0;
    else DecMasterNameID = parseInt(base64ToString(MasterNameID));

    // if (!IncID) IncID = 0;
    // else DecIncID = parseInt(base64ToString(IncID));

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const { nameShowPage, changesStatus, auditCount, offenderCount, nameFilterData, victimCount, tabCount, NameTabCount, setNameShowPage, countStatus, countAppear, localStoreArray, get_LocalStorage, setNameSingleData, get_Data_Name, } = useContext(AgencyContext);
    const carouselRef = useRef(null);

    const navigate = useNavigate();
    const [status, setStatus] = useState();
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [showOffender, setShowOffender] = useState(false);
    const [showVictim, setShowVictim] = useState(false);
    const [showWarrant, setshowWarrant] = useState(false);
    const [isBusinessName, setIsBusinessName] = useState(false);
    const [NameId, setNameId] = useState(false);
    const [ListData, setListData] = useState([]);
    const [DocName, setDocName] = useState('NameDoc')


    const [showArrows, setShowArrows] = useState(false);
    const [viewType, setViewType] = useState('card'); // 'card' or 'list'
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [editval, setEditval] = useState([]);
    const [masterNameID, setMasterNameID] = useState();
    const [nameID, setNameID] = useState();
    const [clickNibloder, setclickNibLoder] = useState(false);
    const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
    const [nibrsErrStr, setNibrsErrStr] = useState('');
    const [nibrsValidateNameData, setnibrsValidateNameData] = useState([]);
    const [addName, setAddName] = useState(true); // 'card' or 'list'
    const [loginPinID, setLoginPinID] = useState(1);
    const [ResetErrors, setResetErrors] = useState(false); // 'card' or 'list'

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID); get_Data_Name(IncID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (NameStatus === true || NameStatus === 'true') {
            setStatus(true);
        } else {
            setStatus(false);
        }
        setNameShowPage('home');
    }, [NameStatus])

    useEffect(() => {
        if (DecNameID || DecMasterNameID) { get_List(DecNameID, DecMasterNameID); GetSingleData(DecNameID, DecMasterNameID); }
    }, [DecNameID, DecMasterNameID]);

    useEffect(() => {
        if (IncID) {
            get_Data_Name(IncID);
        }
    }, [IncID]);



    const get_List = (DecNameID, DecMasterNameID) => {
        const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
        const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('TabBasicInformation/NameInformation', MstPage ? val2 : val).then((res) => {
            if (res) {
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        const checkOverflow = () => {
            const carousel = carouselRef.current;
            if (carousel) {
                setShowArrows(carousel.scrollWidth > carousel.clientWidth);
            }
        };
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [nameFilterData]);

    const scrollCards = (direction) => {
        const carousel = carouselRef.current;
        if (carousel) {
            const scrollAmount = 300;
            carousel.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };
    // useEffect(() => {
    //     if (DeNameID || DeMasterNameID) {
    //         setNameID(DeNameID); GetSingleData(DeNameID, DeMasterNameID); setMasterNameID(DeMasterNameID)
    //     }
    // }, [DeNameID, DeMasterNameID]);

    const GetSingleData = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        const val2 = { 'MasterNameID': masterNameID, 'NameID': 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('MasterName/GetSingleData_MasterName', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
            if (res) {
                setEditval(res); setNameSingleData(res);
            } else { setEditval([]); setNameSingleData([]) }
        })
    }
    const getNibrsError = (Id, nibrsValidateNameData) => {
        const arr = nibrsValidateNameData?.filter((item) => item?.NameEventID == Id);
        return arr?.[0]?.OnPageError;
    }


    const set_Edit_Value = (row) => {
        if (row.NameID || row.MasterNameID) {
            // Reset(); setVictimTypeDrp([]);
            GetSingleData(row.NameID, row.MasterNameID);
            if (isCad) {
                navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
            } else {
                navigate(`/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
            }
            // get_Name_Count(row.NameID, row.MasterNameID, MstPage === "MST-Name-Dash" ? true : false);
            setNameID(row.NameID); setMasterNameID(row?.MasterNameID);
            //  setUpdateStatus(updateStatus + 1); setuploadImgFiles('');
            // getNibrsErrorToolTip(row.NameID, uniqueId, mainIncidentID);
            // setIsSocietyName(row.IsSociety === 'true' ? true : false);
        }
    }

    const setErrString = (ID, nibrsValidateNameData) => {
        const arr = nibrsValidateNameData?.filter((item) => item?.NameEventID == ID);
        setNibrsErrStr(arr[0]?.OnPageError);
        setNibrsErrModalStatus(true);
    }


    const columns = [
        {
            name: 'MNI', selector: (row) => row.NameIDNumber, sortable: true
        },
        {
            name: 'Name', selector: (row) => row.FullName, sortable: true
        },
        {
            name: 'Gender', selector: (row) => row.Gender, sortable: true
        },
        {
            name: 'DOB', selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ", sortable: true
        },

        {
            name: 'SSN', selector: (row) => row.SSN, sortable: true
        },
        {
            name: 'Race', selector: (row) => row.Description_Race, sortable: true
        },
        {
            name: 'Ethnicity', selector: (row) => row.EthnicityDes, sortable: true
        },
        {
            name: 'Alias Indicator', selector: (row) => row.AliasIndicator, sortable: true
        },
        {
            width: '100px', name: 'View',
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 30 }}>
                    {
                        getNibrsError(row.NameID, nibrsValidateNameData) ?
                            <span
                                onClick={(e) => { setErrString(row.NameID, nibrsValidateNameData) }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                data-toggle="modal"
                                data-target="#NibrsErrorShowModal"
                            >
                                <i className="fa fa-eye"></i>
                            </span>
                            :
                            <></>
                    }
                </div>
        },
        {
            name: 'Reason Code', selector: (row) => row?.NameReasonCode || '',
            format: (row) => (<>{row?.NameReasonCode ? row?.NameReasonCode.substring(0, 50) : ''}{row?.NameReasonCode?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={() => { setNameID(row.NameID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteNameModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            : <span onClick={() => { setNameID(row.NameID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteNameModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>

        }
    ]


    const setStatusFalse = () => {
        if (MstPage === "MST-Name-Dash") {
            if (isCADSearch) {
                navigate(`/cad/name-search?page=MST-Name-Dash&IncId=${stringToBase64(IncID)}&IncNo=${0}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
            } else {
                navigate(`/Name-Home?page=MST-Name-Dash&&IncId=${stringToBase64(IncID)}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
            }
        }
        else {
            if (isCad) {
                navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
            } else {
                navigate(`/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
            }
            setMasterNameID(''); setNameID('');
        }
    }
    const setToReset = () => {
    }
    const DeleteContactDetail = () => {
        const val = { 'NameID': nameID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('MasterName/Delete_NameEvent', val).then((res) => {
            if (res) {
                const parseData = JSON.parse(res.data);
                toastifySuccess(parseData?.Table[0].Message);
                get_Data_Name(DecIncID, MstPage === "MST-Name-Dash" ? true : false);
                // get_NameTypeData(loginAgencyID);
                // setStatesChangeStatus(false); get_Incident_Count(mainIncidentID, loginPinID); Reset(); 
                setStatusFalse();
            } else { console.log("Somthing Wrong"); }
        })
    }


    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">

                {!isCad && <div className="col-12  inc__tabs">
                    {
                        !MstPage && <Tab />
                    }
                </div>}
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">

                        <div className={`card Agency ${isCad ? 'CAD-incident-card' : 'incident-card'}`}>
                            <div className="card-body" >
                                {nameFilterData && nameFilterData.length > 0 && (
                                    <div className="card-carousel-container position-relative mb-3">
                                        {/* Cards Wrapper */}
                                        {viewType === "card" ? (
                                            <div className="card-carousel" id="cardCarousel" ref={carouselRef}>
                                                {nameFilterData.map((row, index) => (
                                                    <div
                                                        className="info-card position-relative d-flex align-items-center justify-content-between"
                                                        key={index}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {/* Card Content */}
                                                        <div>
                                                            <div>
                                                                <p className="mb-0 small" style={{ color: "black" }}>
                                                                    <strong>{row.FullName}</strong>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small">
                                                                    {row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : ""}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small">{row.Gender}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p
                                                                    className="mb-0 small"
                                                                    style={{
                                                                        color:
                                                                            row.RoleName === "Other"
                                                                                ? "orange"
                                                                                : row.RoleName === "Victim"
                                                                                    ? "green"
                                                                                    : row.RoleName === "Offender"
                                                                                        ? "red"
                                                                                        : "black",
                                                                    }}
                                                                >
                                                                    {row.NameReasonCode
                                                                        ? row.NameReasonCode.length > 40
                                                                            ? `${row.NameReasonCode.substring(0, 50)} . . .`
                                                                            : row.NameReasonCode
                                                                        : ""}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="d-fle flex-column gap-2 flex-shrink-0">
                                                            {/* Edit Icon */}
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

                                                            {/* Trash Icon */}
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
                                                        </div>


                                                    </div>
                                                ))}
                                            </div>
                                        ) : viewType === "list" ? (
                                            <div className="modal-table" style={{ flex: "0 0 95%", maxWidth: "95%" }}>
                                                {MstPage !== "MST-Name-Dash" && (
                                                    <DataTable
                                                        dense
                                                        columns={columns}
                                                        data={
                                                            effectiveScreenPermission
                                                                ? effectiveScreenPermission[0]?.DisplayOK
                                                                    ? nameFilterData
                                                                    : []
                                                                : nameFilterData
                                                        }
                                                        selectableRowsHighlight
                                                        highlightOnHover
                                                        responsive
                                                        fixedHeader
                                                        fixedHeaderScrollHeight="150px"
                                                        customStyles={tableCustomStyle}
                                                        onRowClicked={(row) => {
                                                            set_Edit_Value(row);
                                                        }}
                                                        persistTableHead
                                                        noDataComponent={
                                                            effectiveScreenPermission
                                                                ? effectiveScreenPermission[0]?.DisplayOK
                                                                    ? "There are no data to display"
                                                                    : "You don’t have permission to view data"
                                                                : "There are no data to display"
                                                        }
                                                    />
                                                )}
                                            </div>
                                        ) : null}

                                        <div className="text-right ml-3">
                                            <div className="right-controls d-flex flex-column align-items-center gap-2">
                                                <div className="view-toggle d-flex flex-column gap-2">
                                                    <button
                                                        className="btn btn-sm btn-success mb-2"
                                                        onClick={() => { setStatusFalse(); setResetErrors(true) }}
                                                    >
                                                        New
                                                    </button>
                                                    {viewType === "card" && (

                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => setViewType("list")}
                                                        >
                                                            Grid
                                                        </button>

                                                    )}
                                                    {viewType === "list" && (
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => setViewType("card")}
                                                        >
                                                            Card
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="row mt-2 " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12 name-tab">
                                        <ul className='nav nav-tabs'>
                                            {isCad ? <Link
                                                className={`nav-item ${nameShowPage === 'home' ? 'active' : ''}`}
                                                to={
                                                    isCADSearch ? `/cad/name-search?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}` :
                                                        MstPage ?
                                                            `/cad/dispatcher?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}`
                                                            :
                                                            `/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${NameID}&MasterNameID=${MasterNameID}&NameStatus=${NameStatus}`
                                                }

                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: nameShowPage === 'home' ? 'Red' : '#000' }}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                aria-current="page"

                                                onClick={() => { if (!changesStatus) setNameShowPage('home') }}

                                            >
                                                {iconHome}
                                            </Link> : <Link
                                                className={`nav-item ${nameShowPage === 'home' ? 'active' : ''}`}
                                                to={
                                                    MstPage ?
                                                        `/Name-Home?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}`
                                                        :
                                                        `/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${NameID}&MasterNameID=${MasterNameID}&NameStatus=${NameStatus}`
                                                }
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: nameShowPage === 'home' ? 'Red' : '#000' }}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                aria-current="page"

                                                onClick={() => { if (!changesStatus) setNameShowPage('home') }}

                                            >
                                                {iconHome}
                                            </Link>}

                                            {isBusinessName && (
                                                <>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Contact_Details' ? 'Red' : NameTabCount?.ContactDetailsCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Contact_Details') }}
                                                    >
                                                        Contact Details{`${NameTabCount?.ContactDetailsCount > 0 ? '(' + NameTabCount?.ContactDetailsCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Address' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Address' ? 'Red' : NameTabCount?.AddressCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Address') }}
                                                    >
                                                        Address{`${NameTabCount?.AddressCount > 0 ? '(' + NameTabCount?.AddressCount + ')' : ''}`}
                                                    </span>

                                                    <span
                                                        className={`nav-item ${nameShowPage === 'TransactionLog' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'TransactionLog' ? 'Red' : NameTabCount?.TransactionLogCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('TransactionLog') }}
                                                    >
                                                        Involvement{`${NameTabCount?.TransactionLogCount > 0 ? '(' + NameTabCount?.TransactionLogCount + ')' : ''}`}
                                                    </span>
                                                </>
                                            )}
                                            {!isBusinessName && (
                                                <>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'general' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'general' ? 'Red' : countStatus === true ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('general') }}
                                                    >
                                                        General{`${NameTabCount?.GeneralCount > 0 ? '(' + NameTabCount?.GeneralCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Appearance' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Appearance' ? 'Red' : countAppear === true ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Appearance') }}
                                                    >
                                                        Appearance{`${NameTabCount?.AppearanceCount > 0 ? '(' + NameTabCount?.AppearanceCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'aliases' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'aliases' ? 'Red' : NameTabCount?.AliasesCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('aliases') }}
                                                    >
                                                        Aliases{`${NameTabCount?.AliasesCount > 0 ? '(' + NameTabCount?.AliasesCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'SMT' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'SMT' ? 'Red' : NameTabCount?.NameSMTCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('SMT') }}
                                                    >
                                                        SMT{`${NameTabCount?.NameSMTCount > 0 ? '(' + NameTabCount?.NameSMTCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Identification_Number' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Identification_Number' ? 'Red' : NameTabCount?.IdentificationNumberCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Identification_Number') }}
                                                    >
                                                        Identification Number{`${NameTabCount?.IdentificationNumberCount > 0 ? '(' + NameTabCount?.IdentificationNumberCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Contact_Details' ? 'Red' : NameTabCount?.ContactDetailsCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Contact_Details') }}
                                                    >
                                                        Contact Details{`${NameTabCount?.ContactDetailsCount > 0 ? '(' + NameTabCount?.ContactDetailsCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Address' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Address' ? 'Red' : NameTabCount?.AddressCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Address') }}
                                                    >
                                                        Address{`${NameTabCount?.AddressCount > 0 ? '(' + NameTabCount?.AddressCount + ')' : ''}`}
                                                    </span>


                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Warrant' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Warrant' ? 'Red' : NameTabCount?.NameWarrantCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Warrant') }}
                                                    >
                                                        Warrant{`${NameTabCount?.NameWarrantCount > 0 ? '(' + NameTabCount?.NameWarrantCount + ')' : ''}`}
                                                    </span>


                                                    <span
                                                        className={`nav-item ${nameShowPage === 'TransactionLog' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'TransactionLog' ? 'Red' : NameTabCount?.TransactionLogCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('TransactionLog') }}
                                                    >
                                                        Involvement{`${NameTabCount?.TransactionLogCount > 0 ? '(' + NameTabCount?.TransactionLogCount + ')' : ''}`}
                                                    </span>
                                                    {
                                                        MstPage &&
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'History' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: nameShowPage === 'History' ? 'Red' : '#000' }}
                                                            aria-current="page"

                                                            onClick={() => { if (!changesStatus) setNameShowPage('History') }}
                                                        >
                                                            History
                                                        </span>

                                                    }
                                                </>
                                            )}
                                            {
                                                showVictim && !isBusinessName && MstPage !== "MST-Name-Dash" &&
                                                <span
                                                    className={`nav-item ${nameShowPage === 'Victim' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: nameShowPage === 'Victim' ? 'Red' : victimCount === true ? 'blue' : '#000' }}
                                                    aria-current="page"

                                                    onClick={() => { if (!changesStatus) setNameShowPage('Victim') }}
                                                >

                                                    Victim
                                                </span>
                                            }

                                            {
                                                showOffender && MstPage !== "MST-Name-Dash" &&
                                                <span
                                                    className={`nav-item ${nameShowPage === 'Offender' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: nameShowPage === 'Offender' ? 'Red' : offenderCount === true ? 'blue' : '#000' }}
                                                    aria-current="page"

                                                    onClick={() => { if (!changesStatus) setNameShowPage('Offender') }}
                                                >
                                                    Offender{`${tabCount?.OffenderCount > 0 ? '(' + tabCount?.OffenderCount + ')' : ''}`}
                                                </span>
                                            }
                                            {MstPage !== "MST-Name-Dash" && (
                                                <span
                                                    className={`nav-item ${nameShowPage === 'Offense' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: nameShowPage === 'Offense' ? 'Red' : NameTabCount?.NameOffenseCount > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"

                                                    onClick={() => { if (!changesStatus) setNameShowPage('Offense') }}
                                                >
                                                    Associated Offenses
                                                </span>
                                            )}


                                            <span
                                                className={`nav-item ${nameShowPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}

                                                style={{ color: nameShowPage === 'AuditLog' ? 'Red' : auditCount === true ? 'blue' : '#000' }}
                                                aria-current="page"

                                                onClick={() => { if (!changesStatus) setNameShowPage('AuditLog') }}
                                            >
                                                {isCad ? "Change Log" : " Audit Log"}
                                            </span>

                                        </ul>
                                    </div>
                                </div>

                                {
                                    nameShowPage === 'home' ?
                                        <Home {...{ setStatus, status, showVictim, setShowVictim, setNameShowPage, setshowWarrant, setShowOffender, setIsBusinessName, get_List, isCad, isCADSearch, isViewEventDetails, editval, setEditval, setNameSingleData, masterNameID, setMasterNameID, nameID, setNameID, GetSingleData, get_Data_Name, nibrsErrModalStatus, setNibrsErrModalStatus, nibrsErrStr, setNibrsErrStr, nibrsValidateNameData, setnibrsValidateNameData, addName, setAddName, ResetErrors, setResetErrors }} />
                                        :
                                        nameShowPage === 'general' ?
                                            <General {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                            :
                                            nameShowPage === 'Contact_Details' ?
                                                <ContactDetails {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                :
                                                nameShowPage === 'Appearance' ?
                                                    <Appearance  {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                    :
                                                    nameShowPage === 'aliases' ?
                                                        <Aliases {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                        :

                                                        nameShowPage === 'SMT' ?
                                                            <Smt {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                            :
                                                            nameShowPage === 'Offender' && showOffender ?
                                                                <AssaultInjuryCom  {...{ ListData, ListData, DecNameID, DecMasterNameID, DecIncID }} />
                                                                :
                                                                nameShowPage === 'Identification_Number' ?
                                                                    <IdentificationNumber {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                    :
                                                                    nameShowPage === 'Victim' && showVictim ?
                                                                        <Victim {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} showTabs={setNameShowPage} />
                                                                        :
                                                                        nameShowPage === 'Gang' ?
                                                                            <Gang {...{ DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                            :
                                                                            nameShowPage === 'connections' ?
                                                                                <Connection  {...{ ListData, DecNameID, DecMasterNameID, DecIncID }} />
                                                                                :
                                                                                nameShowPage === 'Address' ?
                                                                                    <Address {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                    :
                                                                                    nameShowPage === 'Warrant' ?
                                                                                        <Warrant {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                        :
                                                                                        nameShowPage === 'Offense' ?
                                                                                            // <></>
                                                                                            <Offense {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                            :
                                                                                            nameShowPage === 'History' ?
                                                                                                <History {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                                :
                                                                                                nameShowPage === 'TransactionLog' ?

                                                                                                    <Involvements
                                                                                                        idColName={'MasterNameID'}
                                                                                                        para={'NameID'}
                                                                                                        url={''}
                                                                                                        NameStatus={NameStatus}
                                                                                                        SideBarStatus={SideBarStatus}
                                                                                                        NameID={NameID}
                                                                                                        ProSta={ProSta}
                                                                                                        IncNo={IncNo}
                                                                                                        IncSta={IncSta}
                                                                                                        scrCode={'N055'}
                                                                                                        incId={DecIncID}
                                                                                                        tabID={DecNameID}
                                                                                                        masterID={DecMasterNameID}
                                                                                                        IsMaster={MstPage === "MST-Name-Dash" ? true : false}
                                                                                                    />
                                                                                                    :
                                                                                                    nameShowPage === 'AuditLog' ?
                                                                                                        <Log ParentId={DecNameID}
                                                                                                            scrCode={'N056'}
                                                                                                            url={'Log/GetData_LogName'}
                                                                                                            para={'NameID'}
                                                                                                            masterPara={'MasterNameID'}
                                                                                                            MstParentId={DecMasterNameID}
                                                                                                            IsMaster={MstPage === "MST-Name-Dash" ? true : false}
                                                                                                        />
                                                                                                        :
                                                                                                        <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteNameModal func={DeleteContactDetail} setStatusFalse={setStatusFalse} setToReset={setToReset} />
        </div >
    )
}

export default NameTab