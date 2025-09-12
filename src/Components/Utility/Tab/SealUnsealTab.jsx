import React, { useEffect, useContext, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name, DecryptedList } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useDispatch, useSelector } from 'react-redux';

const SealUnsealTab = () => {

    const { changesStatus, get_Name_Count, incidentCount, setVehicleStatus, setChangesStatus } = useContext(AgencyContext)
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [currentTab, setCurrentTab] = useState('Seal-unseal');
    const [incidentStatus, setIncidentStatus] = useState(false)

    const currentLocation = window.location.pathname + window.location.search;


    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var NameID = query?.get("NameID");
    var MasterNameID = query?.get("MasterNameID");
    var NameStatus = query?.get('NameStatus');
    var OffId = query?.get("OffId");
    var OffSta = query?.get("OffSta");
    let ProId = query?.get('ProId');
    let MProId = query?.get('MProId');
    var ProSta = query?.get('ProSta');
    let VehId = query?.get('VehId');
    let MVehId = query?.get('MVehId');
    var VehSta = query?.get('VehSta');

    if (!IncID) IncID = 0;
    else IncID = IncID;

    if (!NameID) NameID = 0;
    else NameID = NameID;

    if (!MasterNameID) MasterNameID = 0;
    else MasterNameID = MasterNameID;

    if (!OffId) OffId = 0;
    else OffId = OffId;

    if (!ProId) ProId = 0;
    else ProId = ProId;

    if (!MProId) MProId = 0;
    else MProId = MProId;

    if (!VehId) VehId = 0;
    else VehId = VehId;

    if (!MVehId) MVehId = 0;
    else MVehId = MVehId;


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (IncSta === false || IncSta === 'false') { setIncidentStatus(false); } else { setIncidentStatus(true) }
    }, [IncSta]);

    const active = window.location.pathname;

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Seal-unseal')) setCurrentTab('Seal-unseal');
    }, [window.location.pathname]);


    return (
        <div className="col-12 inc__tabs">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link
                        className={`nav-link  ${active === `/Seal-unseal` ? 'active' : ''}`}
                        to={changesStatus ? currentLocation : `/Seal-unseal`}
                        style={{ color: currentTab === 'Seal-unseal' ? 'Red' : '#130e0e', fontWeight: '600' }}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        onClick={() => { if (!changesStatus) { setCurrentTab('Seal-unseal') } }}
                    >
                        Records Of Seal/Unseal
                    </Link>
                </li>

            </ul>
        </div >
    )
}

export default SealUnsealTab