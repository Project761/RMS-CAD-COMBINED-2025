import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';

const CitationMainTab = () => {

    const [status, setStatus] = useState(false)

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    // const useQuery = () => {
    //     const params = new URLSearchParams(useLocation().search);
    //     return {
    //         get: (param) => params.get(param)
    //     };
    // };
    // const query = useQuery();
    // var IncID = query?.get("IncId");
    // var IncNo = query?.get("IncNo");
    // var IncSta = query?.get("IncSta")
    // var MissPerId = query?.get("MissPerID");
    // var MissPerSta = query?.get('MissPerSta');
    // var MissVehID = query?.get("MissVehID");

    // if (!IncID) IncID = 0;
    // else IncID = IncID;

    // if (!MissPerId) MissPerId = 0;
    // else MissPerId = MissPerId;

    // if (!MissVehID) MissVehID = 0;
    // else MissVehID = MissVehID;

    const { changesStatus, incidentCount } = useContext(AgencyContext)
    const [currentTab, setCurrentTab] = useState('');
    const [incidentStatus, setIncidentStatus] = useState(false)

    const currentLocation = window.location.pathname + window.location.search;


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    // useEffect(() => {
    //     if (IncSta === false || IncSta === 'false') { setIncidentStatus(false); } else { setIncidentStatus(true) }
    // }, [IncSta]);

    // useEffect(() => {
    //     if (MissPerSta === true || MissPerSta === 'true') {
    //         setStatus(true);
    //     } else { setStatus(false) }
    // }, [MissPerSta]);

    const active = window.location.pathname;
    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Citation-Home')) setCurrentTab('Citation');
        if (pathname.includes('Citation-Charge-Home')) setCurrentTab('Charge');
        if (pathname.includes('Citation-Additional')) setCurrentTab('Additional');
        if (pathname.includes('Citation-Document')) setCurrentTab('Document');
        if (pathname.includes('Citation-Notes')) setCurrentTab('Notes');
    }, [window.location.pathname]);

    // const handleTabClick = (tabName) => {
    //     if (!changesStatus) {
    //         setCurrentTab(tabName);
    //     }
    // };

    return (
        <div className="col-12 inc__tabs">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link
                        className={`nav-item pl-1 ${currentTab === `/Citation-Home` ? 'active' : ''}`}
                        to={changesStatus ? currentLocation : `/Citation-Home`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        style={{ color: currentTab === 'Citation' ? 'Red' : 'gray', fontWeight: '500' }}
                        onClick={() => { if (!changesStatus) { setCurrentTab('Citation'); } }}
                    >
                        Citation
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-item pl-1 ${currentTab === `/Citation-Charge-Home` ? 'active' : ''}`}
                        to={changesStatus ? currentLocation : `/Citation-Charge-Home`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        style={{ color: currentTab === 'Charge' ? 'Red' : 'gray', fontWeight: '500' }}
                        onClick={() => { if (!changesStatus) { setCurrentTab('Charge'); } }}
                    >
                        Charge
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-item pl-1 ${currentTab === `/Citation-Additional` ? 'active' : ''}`}
                        to={changesStatus ? currentLocation : `/Citation-Additional`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        style={{ color: currentTab === 'Additional' ? 'Red' : 'gray', fontWeight: '500' }}
                        onClick={() => { if (!changesStatus) { setCurrentTab('Additional'); } }}
                    >
                        Additional
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link  ${active === `/Citation-Document`} `}
                        to={changesStatus ? currentLocation : `/Citation-Document`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        style={{ color: currentTab === 'Document' ? 'Red' : 'gray', fontWeight: '500' }}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        tabIndex="-1" aria-disabled="true"
                        onClick={() => { if (!changesStatus) { setCurrentTab('Document') } }}
                    >
                        Document
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-link  ${active === `/Citation-Notes`} `}
                        to={changesStatus ? currentLocation : `/Citation-Notes`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        style={{ color: currentTab === 'Notes' ? 'Red' : 'gray', fontWeight: '500' }}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        tabIndex="-1" aria-disabled="true"
                        onClick={() => { if (!changesStatus) { setCurrentTab('Notes') } }}
                    >
                        Notes
                    </Link>
                </li>

            </ul>
        </div>
    )
}

export default CitationMainTab