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
import { useDispatch, useSelector } from 'react-redux'
import Log from '../Log/Log'
import Tab from '../../Utility/Tab/Tab';
import ChargeMainAdd_Up from './ArrestTab/Charges/ChargeMainAdd_Up'


const ArrestMain_Add_Up = () => {

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

    var ChargeId = query?.get('ChargeId');
    let DecArrestId = 0, DecIncID = 0, DecChargeId = 0


    if (!ChargeId) ChargeId = 0;
    else DecChargeId = parseInt((ChargeId));

    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));

    if (!ArrestID) { ArrestID = 0; }
    else { DecArrestId = parseInt((ArrestID)); }

    useEffect(() => {
        if (ArrestSta === 'true' || ArrestSta === true) {
            setStatus(true);
        } else if (ArrestSta === 'false' || ArrestSta === false) {
            setStatus(false);
            get_Arrest_Count();
        }
    }, [ArrestSta, localStoreData, updateCount]);


    const [currentTab, setCurrentTab] = useState('Arrest');


    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Arrest-Home')) setCurrentTab('Arrest');
        if (pathname.includes('Arr-Charge-Home')) setCurrentTab('Charge');
    }, [window.location.pathname]);


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
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12 name-tab">
                                        <ul className='nav nav-tabs'>
                                            <Link
                                                className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                                                to={
                                                    MstPage ?
                                                        `/Arrest-Home?page=MST-Arrest-Dash&ArrestId=${ArrestID}&Name=${Name}&IncId=${IncID}&ArrNo=${ArrNo}&ArrestSta=${ArrestSta}&ChargeSta=${true}`

                                                        :
                                                        `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&Name=${Name}&ArrestId=${ArrestID}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&ChargeSta=${ChargeSta}`
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

                                                    Police Force {`${tabCountArrest?.ArrsetPoliceForce > 0 ? '(' + tabCountArrest?.ArrsetPoliceForce + ')' : ''}`}
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
                                        <Home {...{ setStatus, status, setEditArrestStatus, showJuvinile, EditArrestStatus, setShowJuvinile, setShowPoliceForce, DecIncID, DecArrestId }} />
                                        :

                                        showPage === 'Charges' ?
                                            <ChargeMainAdd_Up {...{ DecArrestId, DecIncID }} />
                                            :
                                            showPage === 'Property' ?
                                                <Property {...{ DecArrestId, DecIncID }} />
                                                :
                                                showPage === 'CriminalActivity' ?
                                                    <CriminalActivity {...{ DecArrestId, DecIncID }} />
                                                    :
                                                    showPage === 'CourtInformation' ?
                                                        <CourtInformation {...{ DecArrestId, DecIncID }} />
                                                        :
                                                        showPage === 'Narratives' ?
                                                            <Narratives {...{ DecArrestId, DecIncID }} />
                                                            :
                                                            showPage === 'PoliceForce' && showPoliceForce ?
                                                                <PoliceForce {...{ DecArrestId, DecIncID }} />
                                                                :
                                                                showPage === 'Juvenile' ?
                                                                    <Juvenile {...{ DecArrestId, DecIncID }} />
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

export default ArrestMain_Add_Up