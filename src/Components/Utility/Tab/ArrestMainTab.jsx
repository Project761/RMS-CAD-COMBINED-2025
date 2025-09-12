import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name, base64ToString } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const ArrestMainTab = () => {

    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = useState('Arrest');
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

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
    const [status, setStatus] = useState(false)

    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ArrestSta = query?.get('ArrestSta');
    var ChargeSta = query?.get('ChargeSta');
    var ChargeId = query?.get('ChargeId');
    var ArrestId = query?.get("ArrestId");
    var ArrNo = query?.get("ArrNo");
    var Name = query?.get("Name");
    var MstPage = query?.get("page");
    let DecChargeId = 0

    if (!IncID) IncID = 0;
    else IncID = IncID;

    if (!ArrestId) ArrestId = 0;
    else ArrestId = ArrestId;

    if (!ChargeId) ChargeId = 0;
    else DecChargeId = parseInt(base64ToString(ChargeId));
    // const active = window.location.pathname;

    const { changesStatus, ArresteName, incidentNumber, tabCountArrest } = useContext(AgencyContext)

    const currentLocation = window.location.pathname + window.location.search;
    const active = window.location.pathname;

    // useEffect(() => {
    //     const pathname = window.location.pathname;
    //     if (pathname.includes('Arrest-Home')) setCurrentTab('Arrest');
    //     if (pathname.includes('Arr-Charge-Home')) setCurrentTab('Charge');
    // }, [window.location.pathname]);

    // const currentLocation = window.location.pathname + window.location.search;

    // useEffect(() => {
    //     if (ArrestSta === true || ArrestSta === 'true') { setStatus(true); } else { setStatus(false) }
    // }, [ArrestSta]);

    return (
        <div className="col-12 inc__tabs" >
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link
                        className={`nav-link ${active === `/Arrest-Home?IncId=${IncID}&ArrestId=${ArrestId}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&Name=${Name}` ? 'active' : ''} `}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        style={{ color: currentTab === 'Arrest' ? 'Red' : '#130e0e', fontWeight: '500' }}
                        onClick={() => { if (!changesStatus) { setCurrentTab('Arrest'); } }}
                        //------------page=MST-Arrest-Dash ke liye condiction---------
                        to={
                            MstPage ? `/Arrest-Home?page=MST-Arrest-Dash&ArrestId=${ArrestId}&ArrNo=${ArrNo}&Name=${ArresteName}&IncId=${IncID}&IncNo=${incidentNumber}&ArrestSta=${ArrestSta}&ChargeSta=false`
                                : changesStatus
                                    ? currentLocation
                                    : `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${ArrestId}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&Name=${Name}&ChargeSta=false`
                        }
                    >Arrest
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to={
                            MstPage ? `/Arr-Charge-Home?page=MST-Arrest-Dash&IncId=${IncID}&ArrestId=${ArrestId}&ArrNo=${ArrNo}&IncNo=${incidentNumber}&Name=${Name}&ArrestSta=${ArrestSta}&ChargeSta=${false}`
                                : changesStatus
                                    ? currentLocation
                                    : `/Arr-Charge-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${ArrestId}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&Name=${Name}&ChargeId=${ChargeId}&ChargeSta=${ChargeSta}`
                        }
                        className={`nav-link  ${active === `/Arr-Charge-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&Name=${ArresteName}&ArrestId=${ArrestId}&ArrNo=${ArrNo}&ArrestSta=${ArrestSta}&ChargeSta=${ChargeSta}` ? 'active' : ''}${!status ? 'disabled' : ''}`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        // style={{ color: currentTab === 'Charge' ? 'Red' : '#130e0e', fontWeight: '500' }}
                        // style={{ color: incidentCount[0]?.ChargeCount > 0 && 'blue' }}
                        style={{ color: currentTab === 'Charge' ? 'Red' : tabCountArrest?.ChargeCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                        onClick={() => { if (!changesStatus) { setCurrentTab('Charge'); } }}
                    >
                        Charges{`${tabCountArrest?.ChargeCount > 0 ? '(' + tabCountArrest?.ChargeCount + ')' : ''}`}

                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default ArrestMainTab