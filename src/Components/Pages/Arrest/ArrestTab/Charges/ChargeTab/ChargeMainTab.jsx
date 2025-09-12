import  { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { Decrypt_Id_Name, base64ToString } from '../../../../../Common/Utility';
import { get_LocalStoreData } from '../../../../../../redux/actions/Agency';
import Penalties from './Penalties/Penalties';
import CourtDisposition from './CourtDisposition/CourtDisposition';
import Comments from './Comments/Comments';
import Weapon from './Weapon/Weapon';
import Offense from './Offense/Offense';
import Home from './Home/Home';

const ChargeMainTab = () => {

    const dispatch = useDispatch()
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const { tabCount, get_ArrestCharge_Count, updateCount, changesStatus, incidentNumber } = useContext(AgencyContext);

    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState(false)
    const [chargeID, setChargeID] = useState('');
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var ArrestId = query?.get('ArrestId');
    var ChargeId = query?.get('ChargeId');
    var ChargeSta = query?.get('ChargeSta');
    var ArrNo = query?.get('ArrNo');
    var ArrestSta = query?.get('ArrestSta');
    var Name = query?.get("Name");
    let MstPage = query?.get('page');

    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var IncID = query?.get('IncId');

    let DecChargeId = 0, DecArrestId = 0, DecIncID = 0;

    if (!ArrestId) ArrestId = 0;
    else DecArrestId = parseInt(base64ToString(ArrestId));

    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));

    if (!ChargeId) { DecChargeId = 0; }
    else { DecChargeId = parseInt(base64ToString(ChargeId)); }

    useEffect(() => {
        if (ChargeSta === 'false' || ChargeSta === false) {
            setStatus(false)
            get_ArrestCharge_Count()
        } else {
            setStatus(true);
        }
    }, [ChargeSta, localStoreData, updateCount])

    return (
        <div className="section-body view_page_design pt-1 p-1 bt" >
            <div className="col-12  inc__tabs">
            </div>
            <div className="col-12 col-sm-12">
                <div className="card-body">
                    <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px' }}>
                        <div className="col-12 incident-tab">
                            <ul className='nav nav-tabs'>
                                <Link
                                    to={
                                        MstPage ?
                                            `/Arr-Charge-Home?page=MST-Arrest-Dash&ArrestId=${ArrestId}&IncNo=${incidentNumber}&ArrNo=${ArrNo}&Name=${Name}&ArrestSta=${ArrestSta}&ChargeSta=${ChargeSta}`
                                            :
                                            `/Arr-Charge-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${ArrestId}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&Name=${Name}&ChargeId=${ChargeId}&ChargeSta=${ChargeSta}`
                                    }
                                    className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                                    data-toggle={changesStatus ? "modal" : "pill"}
                                    data-target={changesStatus ? "#SaveModal" : ''}
                                    style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                    aria-current="page"
                                    onClick={() => { if (!changesStatus) setShowPage('home') }}
                                >
                                    {iconHome}
                                </Link>
                                <span
                                    className={`nav-item ${showPage === 'Penalties' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                    data-toggle={changesStatus ? "modal" : "pill"}
                                    data-target={changesStatus ? "#SaveModal" : ''}
                                    style={{ color: showPage === 'Penalties' ? 'Red' : '#000' }}
                                    aria-current="page" onClick={() => { if (!changesStatus) setShowPage('Penalties') }} >
                                    Penalties
                                </span>
                                <span
                                    className={`nav-item ${showPage === 'CourtDisposition' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                    data-toggle={changesStatus ? "modal" : "pill"}
                                    data-target={changesStatus ? "#SaveModal" : ''}
                                    style={{ color: showPage === 'CourtDisposition' ? 'Red' : tabCount?.CourtDispositionCount > 0 ? 'blue' : '#000' }}
                                    aria-current="page" onClick={() => { if (!changesStatus) setShowPage('CourtDisposition') }} >
                                    Court Disposition{`${tabCount?.CourtDispositionCount > 0 ? '(' + tabCount?.CourtDispositionCount + ')' : ''}`}
                                </span>
                                <span
                                    className={`nav-item ${showPage === 'Comments' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                    data-toggle={changesStatus ? "modal" : "pill"}
                                    data-target={changesStatus ? "#SaveModal" : ''}
                                    style={{ color: showPage === 'Comments' ? 'Red' : tabCount?.ChargeCommentsCount > 0 ? 'blue' : '#000' }}
                                    aria-current="page"
                                    onClick={() => { if (!changesStatus) setShowPage('Comments') }} >
                                    Comments{`${tabCount?.ChargeCommentsCount > 0 ? '(' + tabCount?.ChargeCommentsCount + ')' : ''}`}
                                </span>
                                <span
                                    className={`nav-item ${showPage === 'Weapon' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                    data-toggle={changesStatus ? "modal" : "pill"}
                                    data-target={changesStatus ? "#SaveModal" : ''}
                                    style={{ color: showPage === 'Weapon' ? 'Red' : tabCount?.ChargeWeaponTypeCount > 0 ? 'blue' : '#000' }}
                                    aria-current="page"
                                    onClick={() => { if (!changesStatus) setShowPage('Weapon') }} >
                                    Weapon{`${tabCount?.ChargeWeaponTypeCount > 0 ? '(' + tabCount?.ChargeWeaponTypeCount + ')' : ''}`}
                                </span>
                              
                            </ul>
                        </div>
                    </div>
                    {
                        showPage === 'home' ?
                            <Home  {...{ setStatus, IncID, status, setChargeID, chargeID, DecChargeId, DecArrestId, DecIncID }} />
                            :
                            showPage === 'Penalties' ?
                                <Penalties {...{ DecChargeId, DecArrestId }} />
                                :
                                showPage === 'CourtDisposition' ?
                                    <CourtDisposition {...{ DecChargeId, DecArrestId }} />
                                    :
                                    showPage === 'Comments' ?
                                        <Comments {...{ DecChargeId, DecArrestId }} />
                                        :
                                        showPage === 'Weapon' ?
                                            <Weapon  {...{ DecChargeId, DecArrestId }} />
                                            :
                                            showPage === 'Offense' ?
                                                <Offense  {...{ DecChargeId, DecIncID }} />
                                                :
                                                <></>
                    }
                </div>
            </div>
        </div >
    )
}

export default ChargeMainTab