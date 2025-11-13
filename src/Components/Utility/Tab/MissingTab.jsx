import React, { useContext, useEffect, useState } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index';
import { Link, useLocation } from 'react-router-dom';
import DocumentModal from '../../Common/DocumentModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { Decrypt_Id_Name } from '../../Common/Utility';


const MissingTab = () => {

    const [status, setStatus] = useState(false)

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta")
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var MissVehID = query?.get("MissVehID");

    if (!IncID) IncID = 0;
    else IncID = IncID;

    if (!MissPerId) MissPerId = 0;
    else MissPerId = MissPerId;

    if (!MissVehID) MissVehID = 0;
    else MissVehID = MissVehID;

    const { changesStatus, incidentCount, tabCount } = useContext(AgencyContext)
    const [currentTab, setCurrentTab] = useState('');
    const [incidentStatus, setIncidentStatus] = useState(false)

    const currentLocation = window.location.pathname + window.location.search;


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (IncSta === false || IncSta === 'false') { setIncidentStatus(false); } else { setIncidentStatus(true) }
    }, [IncSta]);

    useEffect(() => {
        if (MissPerSta === true || MissPerSta === 'true') {
            setStatus(true);
        } else { setStatus(false) }
    }, [MissPerSta]);

    const active = window.location.pathname;
    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Missing-Home')) setCurrentTab('MissingPersonInfo');
        if (pathname.includes('Missing-Vehicle-Home')) setCurrentTab('MissingPersonVehicle');
        if (pathname.includes('Missing-Document-Home')) setCurrentTab('Document');
        if (pathname.includes('Missing-Person-Form')) setCurrentTab('MissingPersonForm');
    }, [window.location.pathname]);

    const handleTabClick = (tabName) => {
        if (!changesStatus) {
            setCurrentTab(tabName);
        }
    };


    return (
        <div className="col-12 inc__tabs">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <Link
                        className={`nav-item  ${currentTab === `/Missing-Home` ? 'active' : ''}`}
                        to={changesStatus ? currentLocation : `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        // style={{ color: currentTab === 'MissingPersonInfo' ? 'Red' : 'gray', fontWeight: '500' }}
                        style={{ color: currentTab === 'MissingPersonInfo' ? 'Red' : '#130e0e', fontWeight: '600' }}

                        onClick={() => { if (!changesStatus) { setCurrentTab('MissingPersonInfo'); } }}
                    >
                        Missing Person Info
                    </Link>
                </li>
                <li className="nav-item" >
                    <Link
                        className={`nav-item  ${currentTab === `/Missing-Vehicle-Home` ? 'active' : ''}${!status ? 'disabled' : ''}`}
                        to={changesStatus ? currentLocation : `/Missing-Vehicle-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}`}
                        // style={{ color: currentTab === 'MissingPersonVehicle' ? 'Red' : 'gray', fontWeight: '500' }}
                        style={{ color: currentTab === 'MissingPersonVehicle' ? 'Red' : '#130e0e', fontWeight: '600' }}

                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        onClick={() => { if (!changesStatus) { setCurrentTab('MissingPersonVehicle') } }}
                    >
                        Missing Person Vehicle
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className={`nav-item  ${currentTab === `/Missing-Document-Home` ? 'active' : ''}${!status ? 'disabled' : ''}`}
                        to={changesStatus ? currentLocation : `/Missing-Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        // style={{ color: currentTab === 'Document' ? 'Red' : 'gray', fontWeight: '500' }}
                        // style={{ color: currentTab === 'Document' ? 'Red' : '#130e0e', fontWeight: '600' }}
                        style={{ color: currentTab === 'Document' ? 'Red' : tabCount?.Document > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}

                        data-target={changesStatus ? "#SaveModal" : ''}
                        // onClick={() => handleTabClick('Document')}
                        onClick={() => { if (!changesStatus) { setCurrentTab('Document') } }}
                    >
                        Document  {`${tabCount?.Document > 0 ? '(' + tabCount?.Document + ')' : ''}`}
                    </Link>

                </li>
                 {/* <li className="nav-item" >
                    <Link
                        className={`nav-item  ${currentTab === `/Missing-Person-Form` ? 'active' : ''}${!status ? 'disabled' : ''}`}
                        to={changesStatus ? currentLocation : `/Missing-Person-Form?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}`}
                        // style={{ color: currentTab === 'MissingPersonForm' ? 'Red' : 'gray', fontWeight: '500' }}
                        style={{ color: currentTab === 'MissingPersonForm' ? 'Red' : '#130e0e', fontWeight: '600' }}

                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        onClick={() => { if (!changesStatus) { setCurrentTab('MissingPersonForm') } }}
                    >
                        Missing Person Form
                    </Link>
                </li> */}
            </ul>
        </div>
    )
}

export default MissingTab
