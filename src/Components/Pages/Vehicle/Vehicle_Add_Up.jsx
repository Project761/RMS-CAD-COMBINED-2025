import React, { useContext, useEffect, useState } from 'react'
import SubTab from '../../Utility/Tab/SubTab'
import { VehicleTabs } from '../../Utility/Tab/TabsArray'
import Home from './VehicleTab/Home/Home';
import VehicleNotes from './VehicleTab/VehicleNotes/VehicleNotes';
import Document from './VehicleTab/Document/Document';
import VehicleTransactionLog from './VehicleTab/VehicleTransactionLog/VehicleTransactionLog';
import { AgencyContext } from '../../../Context/Agency/Index';
import VehiclePawnProperty from './VehicleTab/VehiclePawnProperty/VehiclePawnProperty';
import TowingVehicle from './VehicleTab/TowingVehicle/TowingVehicle';
import Tab from '../../Utility/Tab/Tab';
import { Link, useLocation } from 'react-router-dom';
import Log from '../Log/Log';
import RecoveredVehicle from './VehicleTab/RecoveredVehicle/RecoveredVehicle';
import AddInformation from './VehicleTab/AddInformation/AddInformation';
import { useDispatch, useSelector } from 'react-redux';
import { base64ToString } from '../../Common/Utility';
import DocumentModal from '../../Common/DocumentModal';
import { fetchPostData } from '../../hooks/Api';
import VehicleInvolvement from '../SummaryModel/VehicleInvolvement';
import VehicleManagement from './VehicleTab/VehicleManagement/VehicleManagement';
import VehicleChain from './VehicleTab/VehicleChain/VehicleChain';
import Offense from './VehicleTab/Offense/Offense';

const Vehicle_Add_Up = ({ isCad = false, isCADSearch = false, isViewEventDetails = false }) => {

    const dispatch = useDispatch()
    const { changesStatus, vehicleCount, get_vehicle_Count, countoffaduit, } = useContext(AgencyContext);
    const [propertystatus, setPropertyStatus] = useState('');
    const [IsNonPropertyRoomSelected, setIsNonPropertyRoomSelected] = useState(false);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();

    let MstVehicle = query?.get('page');
    var VehId = query?.get("VehId");
    var MVehId = query?.get('MVehId');
    var IncID = query?.get('IncId');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get('IncSta');
    var VehSta = query?.get('VehSta');
    var ModNo = query?.get('ModNo');
    var openPage = query?.get('page');
    var VicCategory = query?.get('VicCategory');

    let DecVehId = 0, DecMVehId = 0, DecIncID = 0;

    if (!VehId) VehId = 0;
    else DecVehId = parseInt(base64ToString(VehId));
    if (!MVehId) MVehId = 0;
    else DecMVehId = parseInt(base64ToString(MVehId));
    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));


    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState();
    const [vehicleId, setvehicleId] = useState();
    const [showVehicleRecovered, setShowVehicleRecovered] = useState(false);
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [ListData, setListData] = useState([]);
    const [DocName, setDocName] = useState('VehDoc')
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [incidentReportedDate, setIncidentReportedDate] = useState(null);


    useEffect(() => {
        if (VehSta === 'true' || VehSta === true) {
            setStatus(true)
        } else {
            setStatus(false); get_vehicle_Count('')
        }
    }, [VehSta])

    useEffect(() => {
        if (DecVehId || DecMVehId) { get_List(DecVehId, DecMVehId) } else { setShowPage('home') }
    }, [DecVehId, DecMVehId]);

    const get_List = (DecVehId, DecMVehId) => {
        const val = { "PropertyID": DecVehId, "MasterPropertyID": DecMVehId, "IsMaster": openPage === "MST-Vehicle-Dash" ? true : false }
        fetchPostData('TabBasicInformation/VehicleInformation', val).then((res) => {
            if (res) {
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }

    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                {!isCad && <div className="col-12  inc__tabs">
                    {
                        !openPage && <Tab />
                    }
                </div>}
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className={`card Agency ${isCad ? 'CAD-incident-card' : 'incident-card'}`}>
                            <div className="card-body">
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12  name-tab">
                                        <ul className='nav nav-tabs'>
                                            <Link
                                                className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                                                to={
                                                    isCad ? isCADSearch ? `cad/property_search?page=MST-Vehicle-Dash&VehId=${VehId}&MVehId=${MVehId}&ModNo=${ModNo}&VehSta=${VehSta}&VicCategory=${VicCategory}` :
                                                        openPage
                                                            ? `/cad/dispatcher?page=MST-Vehicle-Dash&VehId=${VehId}&MVehId=${MVehId}&ModNo=${ModNo}&VehSta=${VehSta}&VicCategory=${VicCategory}`
                                                            : `/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${VehId}&MVehId=${MVehId}&VehSta=${VehSta}&VicCategory=${VicCategory}`
                                                        : openPage
                                                            ? `/Vehicle-Home?page=MST-Vehicle-Dash&VehId=${VehId}&MVehId=${MVehId}&ModNo=${ModNo}&VehSta=${VehSta}&VicCategory=${VicCategory}`
                                                            : `/Vehicle-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${VehId}&MVehId=${MVehId}&VehSta=${VehSta}&VicCategory=${VicCategory}`
                                                }
                                                style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) { setShowPage('home'); setPropertyStatus(false); } }}

                                            >
                                                {iconHome}
                                            </Link>
                                            <span
                                                className={`nav-item ${showPage === 'AdditionalInformation' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'AdditionalInformation' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) { setShowPage('AdditionalInformation') } }}

                                            >
                                                Additional Information
                                            </span>
                                            {MstVehicle !== "MST-Vehicle-Dash" && (
                                                <span
                                                    className={`nav-item ${showPage === 'Offense' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPage === 'Offense' ? 'Red' : vehicleCount?.OffenseCount > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => {
                                                        if (!changesStatus) { setShowPage('Offense') }
                                                    }}

                                                >

                                                    Associated Offenses{`${vehicleCount?.OffenseCount > 0 ? '(' + vehicleCount?.OffenseCount + ')' : ''}`}
                                                </span>
                                            )}
                                            {
                                                showVehicleRecovered &&
                                                <span className={`nav-item ${showPage === 'RecoveredVehicle' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPage === 'RecoveredVehicle' ? 'Red' : vehicleCount?.VehicleRecovered > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => {
                                                        if (!changesStatus) { setShowPage('RecoveredVehicle') }
                                                    }}

                                                >
                                                    Recovered Vehicle   {`${vehicleCount?.VehicleRecovered > 0 ? '(' + vehicleCount?.VehicleRecovered + ')' : ''}`}
                                                </span>
                                            }

                                            <span className={`nav-item ${showPage === 'VehicleTransactionLog' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'VehicleTransactionLog' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) setShowPage('VehicleTransactionLog')
                                                }}


                                            >
                                                Involvement
                                            </span>
                                            {
                                                propertystatus && !(IsNonPropertyRoomSelected) &&
                                                <>
                                                    <span
                                                        className={`nav-item ${showPage === 'PropertyManagement' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'PropertyManagement' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('PropertyManagement') } }}

                                                    >

                                                        Property Management
                                                    </span>
                                                    <span
                                                        className={`nav-item ${showPage === 'ChainOfCustody' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'ChainOfCustody' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('ChainOfCustody') } }}

                                                    >
                                                        Chain Of Custody
                                                    </span>
                                                </>
                                            }
                                            <span className={`nav-item ${showPage === 'AuditLog' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'AuditLog' ? 'Red' : countoffaduit === true ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('AuditLog') }
                                                }}
                                            >
                                                {isCad ? "Change Log" : " Audit Log"}
                                            </span>
                                        </ul>
                                    </div>
                                </div>
                                {
                                    showPage === 'home' ?
                                        <Home {...{ setStatus, setaddUpdatePermission, status, setShowVehicleRecovered, showVehicleRecovered, get_List, setPropertyStatus, incidentReportedDate, setIncidentReportedDate, isCad, isViewEventDetails, isCADSearch }} />
                                        :
                                        // showPage === 'VehicleNotes' ?
                                        //     <VehicleNotes  {...{ ListData, DecVehId, DecMVehId, DecIncID, isViewEventDetails }} />
                                        //     :
                                        showPage === 'Document' ?
                                            <DocumentModal
                                                {...{ ListData, DocName, isViewEventDetails }}
                                                ParentId={DecVehId}
                                                Vichile={'VehicleDoc'}
                                                scrCode={'V083'}
                                                count={DecVehId}
                                                parentTabMasterID={DecMVehId}
                                                rowIdName={'DocumentID'}
                                                masterIDColName={'MasterPropertyID'}
                                                TabIdColName={'PropertyID'}
                                                insertDataMasterUrl={''}
                                                deleteUrl={'VehicleDocument/Delete_VehicleDocument'}
                                                insertDataUrl={'VehicleDocument/Insert_VehicleDocument'}
                                                getDataUrl={'VehicleDocument/GetData_VehicleDocument'}
                                            />
                                            :
                                            showPage === 'RecoveredVehicle' ?
                                                <RecoveredVehicle  {...{ ListData, DecVehId, DecMVehId, DecIncID, incidentReportedDate, isViewEventDetails }} />
                                                :
                                                showPage === 'pawnvehicle' ?
                                                    <VehiclePawnProperty  {...{ ListData, DecVehId, DecMVehId, DecIncID }} />
                                                    :
                                                    showPage === 'Offense' ?
                                                        <Offense {...{ ListData, DecVehId, DecMVehId, DecIncID, }} />
                                                        :
                                                        showPage === 'VehicleTransactionLog' ?
                                                            <VehicleInvolvement
                                                                idColName={'PropertyID'}
                                                                url={''}
                                                                IncNo={IncNo}
                                                                IncSta={IncSta}
                                                                incId={DecIncID}
                                                                scrCode={'V085'}
                                                                tabID={DecVehId}
                                                                masterID={DecMVehId}
                                                                IsMaster={openPage === "MST-Vehicle-Dash" ? true : false}
                                                            />
                                                            :
                                                            showPage === 'AdditionalInformation' ?
                                                                <AddInformation   {...{ ListData, DecVehId, setIsNonPropertyRoomSelected, DecMVehId, DecIncID, propertystatus, setPropertyStatus, isViewEventDetails }} />
                                                                :
                                                                showPage === 'PropertyManagement' ?
                                                                    <VehicleManagement {...{ DecVehId, DecMVehId, DecIncID, VicCategory, isViewEventDetails }} />
                                                                    :
                                                                    showPage === 'ChainOfCustody' ?
                                                                        <VehicleChain {...{ DecVehId, DecMVehId, DecIncID, isViewEventDetails }} />
                                                                        :
                                                                        showPage === 'AuditLog' ?
                                                                            <Log
                                                                                ParentId={DecVehId}
                                                                                scrCode={'V086'}
                                                                                url={'Log/GetData_PropertyVehicle'}
                                                                                para={'PropertyID'}
                                                                                masterPara={'MasterPropertyID'}
                                                                                MstParentId={DecMVehId}
                                                                                IsMaster={openPage === "MST-Vehicle-Dash" ? true : false}
                                                                            />
                                                                            :
                                                                            <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vehicle_Add_Up