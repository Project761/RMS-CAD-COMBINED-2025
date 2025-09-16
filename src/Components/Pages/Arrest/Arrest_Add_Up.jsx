import { useState, useEffect, useContext } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import Home from './ArrestTab/Home/Home'
import Property from './ArrestTab/Property/Property'
import CriminalActivity from './ArrestTab/CriminalActivity/CriminalActivity'
import CourtInformation from './ArrestTab/CourtInformation/CourtInformation'
import Narratives from './ArrestTab/Narratives/Narratives'
import PoliceForce from './ArrestTab/PoliceForce/PoliceForce'
import Juvenile from './ArrestTab/Juvenile/Juvenile'
import { base64ToString } from '../../Common/Utility'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Log from '../Log/Log'
import ChargeAddUp from './ArrestTab/Charges/ChargeAddUp'
import Tab from '../../Utility/Tab/Tab';


const Arrest_Add_Up = () => {

    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const { updateCount, EditArrestStatus, setEditArrestStatus, tabCountArrest, get_Arrest_Count, changesStatus, } = useContext(AgencyContext)

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()
    const [showJuvinile, setShowJuvinile] = useState(false);
    const [showPoliceForce, setShowPoliceForce] = useState(false);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let ArrestID = query?.get('ArrestId');
    let IncID = query?.get('IncId');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ArrNo = query?.get("ArrNo");
    var ArrestSta = query?.get('ArrestSta');
    let MstPage = query?.get('page');
    var Name = query?.get("Name");
    var ChargeSta = query?.get('ChargeSta');
    var isFromDashboard = query?.get('isFromDashboard');

    var SideBarStatus = query?.get("SideBarStatus");
    var ArrestStatus = query?.get("ArrestStatus");


    var ChargeId = query?.get('ChargeId');
    let DecArrestId = 0, DecIncID = 0, DecChargeId = 0

    if (!ChargeId) ChargeId = 0;
    else DecChargeId = parseInt((ChargeId));

    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));


    useEffect(() => {
        if (ArrestSta === 'true' || ArrestSta === true) {
            setStatus(true);
        } else if (ArrestSta === 'false' || ArrestSta === false) {
            setStatus(false);
            get_Arrest_Count();
        }
    }, [ArrestSta, localStoreData, updateCount]);

    useEffect(() => {
        if (isFromDashboard === 'true' || isFromDashboard === true) {
            setShowPoliceForce(true);
            setShowPage("PoliceForce")
        }
    }, [isFromDashboard]);

    console.log("isFromDashboard", isFromDashboard)

    const [currentTab, setCurrentTab] = useState('Arrest');



    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Arrest-Home')) setCurrentTab('Arrest');
        if (pathname.includes('Arr-Charge-Home')) setCurrentTab('Charge');
    }, [window.location.pathname]);



    function isValidBase64(str) {
        const base64Pattern = /^[A-Za-z0-9+/=]+$/;
        return base64Pattern.test(str);
    }

    if (!ArrestID) {
        ArrestID = 0;
    } else {
        if (isValidBase64(ArrestID)) {
            try {
                let decodedString = atob(ArrestID);
                DecArrestId = parseInt(decodedString, 10);
            } catch (error) {
                console.error("Error in decoding Base64 or parsing to integer:", error);
                DecArrestId = 0;
            }
        } else {
            console.error("ArrestID is not a valid Base64 string");
            DecArrestId = 0;
        }
    }

    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    <Tab />

                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">
                            <div className="card-body" >
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px',  marginRight: '-18px'  }}>
                                    <div className="col-12 name-tab">
                                        <ul className='nav nav-tabs'>
                                            <Link
                                                className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                                                to={
                                                    MstPage ?
                                                        `/Arrest-Home?page=MST-Arrest-Dash&ArrestId=${ArrestID}&Name=${Name}&IncId=${IncID}&ArrNo=${ArrNo}&ArrestSta=${ArrestSta}&ChargeSta=${true}&SideBarStatus=${false}&ArrestStatus=${false}`

                                                        :
                                                        `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&Name=${Name}&ArrestId=${ArrestID}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&ChargeSta=${ChargeSta}&SideBarStatus=${false}&ArrestStatus=${false}`
                                                }
                                                style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) { setShowPage('home') } }}>

                                                {iconHome}
                                            </Link>

                                            <span
                                                className={`nav-item ${showPage === 'Charges' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Charges' ? 'Red' : tabCountArrest?.ChargeCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('Charges') }
                                                }}>

                                                Charge{`${tabCountArrest?.ChargeCount > 0 ? '(' + tabCountArrest?.ChargeCount + ')' : ''}`}
                                            </span>

                                            <span
                                                className={`nav-item ${showPage === 'Property' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Property' ? 'Red' : tabCountArrest?.PropertyCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('Property') }
                                                }}>

                                                Property{`${tabCountArrest?.PropertyCount > 0 ? '(' + tabCountArrest?.PropertyCount + ')' : ''}`}
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'CriminalActivity' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'CriminalActivity' ? 'Red' : tabCountArrest?.CriminalActivityCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('CriminalActivity') }
                                                }}>

                                                Criminal Activity{`${tabCountArrest?.CriminalActivityCount > 0 ? '(' + tabCountArrest?.CriminalActivityCount + ')' : ''}`}
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'CourtInformation' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'CourtInformation' ? 'Red' : tabCountArrest?.CourtInformationCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('CourtInformation') }
                                                }}>

                                                Court Information{`${tabCountArrest?.CourtInformationCount > 0 ? '(' + tabCountArrest?.CourtInformationCount + ')' : ''}`}
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'Narratives' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Narratives' ? 'Red' : tabCountArrest?.NarrativeCount > 0 ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('Narratives') }
                                                }}>

                                                Arrest Notes{`${tabCountArrest?.NarrativeCount > 0 ? '(' + tabCountArrest?.NarrativeCount + ')' : ''}`}
                                            </span>
                                            {
                                                showPoliceForce &&
                                                <span
                                                    className={`nav-item ${showPage === 'PoliceForce' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPage === 'PoliceForce' ? 'Red' : tabCountArrest?.ArrsetPoliceForce > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => {
                                                        if (!changesStatus) { setShowPage('PoliceForce') }
                                                    }}>

                                                    Use Of Force {`${tabCountArrest?.ArrsetPoliceForce > 0 ? '(' + tabCountArrest?.ArrsetPoliceForce + ')' : ''}`}
                                                </span>
                                            }
                                            {
                                                showJuvinile &&
                                                <span
                                                    className={`nav-item ${showPage === 'Juvenile' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPage === 'Juvenile' ? 'Red' : tabCountArrest?.ArrestJuvenile > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => {
                                                        if (!changesStatus) { setShowPage('Juvenile') }
                                                    }}>

                                                    Juvenile {`${tabCountArrest?.ArrestJuvenile > 0 ? '(' + tabCountArrest?.ArrestJuvenile + ')' : ''}`}
                                                </span>
                                            }
                                            <span
                                                className={`nav-item ${showPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'AuditLog' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('AuditLog') }
                                                }}>

                                                Audit Log
                                            </span>
                                        </ul>
                                    </div>
                                </div>
                                {
                                    showPage === 'home' ?
                                        <Home {...{ setStatus, showPage, setShowPage, status, setEditArrestStatus, showJuvinile, EditArrestStatus, setShowJuvinile, setShowPoliceForce, DecIncID, DecArrestId }} />
                                        :
                                        showPage === 'Property' ?
                                            <Property {...{ DecArrestId, DecIncID, }} />
                                            :

                                            showPage === 'Charges' ?
                                                <ChargeAddUp {...{ DecArrestId, DecIncID, }} />
                                                :
                                                showPage === 'CriminalActivity' ?
                                                    <CriminalActivity {...{ DecArrestId, DecIncID, }} />
                                                    :
                                                    showPage === 'CourtInformation' ?
                                                        <CourtInformation {...{ DecArrestId, DecIncID, }} />
                                                        :
                                                        showPage === 'Narratives' ?
                                                            <Narratives {...{ DecArrestId, DecIncID, }} />
                                                            :
                                                            showPage === 'PoliceForce' && showPoliceForce ?
                                                                <PoliceForce {...{ DecArrestId, DecIncID, }} />
                                                                :
                                                                showPage === 'Juvenile' ?
                                                                    <Juvenile {...{ DecArrestId, DecIncID, }} />
                                                                    :
                                                                    showPage === 'AuditLog' ?
                                                                        <Log
                                                                            scrCode={'A092'}
                                                                            ParentId={DecArrestId}
                                                                            url={'Log/GetData_ArrestLog'}
                                                                            para={'ArrestID'}
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

export default Arrest_Add_Up