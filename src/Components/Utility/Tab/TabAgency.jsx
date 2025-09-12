import React, { useContext, useEffect, useState } from 'react'
import { Decrypt_Id_Name, base64ToString } from '../../Common/Utility';
import { Link, useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../Context/Agency/Index';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const TabAgency = () => {

    const active = window.location.pathname;
    const currentLocation = window.location.pathname + window.location.search;


    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const { get_CountList, count, getAgency, changesStatus, } = useContext(AgencyContext);
    const [currentTab, setCurrentTab] = useState('Agency');
    const [status, setStatus] = useState();

    // console.log(count)
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecAgeID = 0;
    const query = useQuery();
    var Aid = query?.get("Aid");
    var ASta = query?.get("ASta");
    var AgyName = query?.get("AgyName");
    var ORINum = query?.get("ORINum");

    var perId = query?.get("perId");
    var perSta = query?.get("perSta");

    if (!Aid) DecAgeID = 0;
    else DecAgeID = base64ToString(Aid);

    if (!perId) perId = 0;
    else perId = perId;

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (ASta === true || ASta === 'true') { setStatus(true); } else { setStatus(false) }
    }, [ASta]);

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('agencyTab')) setCurrentTab('Agency');
        if (pathname.includes('personnelTab')) setCurrentTab('personnel');
    }, [window.location.pathname]);

    useEffect(() => {
        if (ASta === true || ASta === 'true') { get_CountList(DecAgeID); }
    }, [Aid]);

    return (
        <>
            <div className="col-12 inc__tabs pl-0">
                <ul className="nav nav-tabs mb-0 ">
                    <li className="nav-item">
                        <Link
                            className={`nav-item  ${active === `/agencyTab?Aid=${Aid}&ASta=${ASta}&AgyName=${AgyName}&ORINum=${ORINum}` ? 'active' : ''}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            to={changesStatus ? currentLocation : `/agencyTab?Aid=${Aid}&ASta=${ASta}&AgyName=${AgyName}&ORINum=${ORINum}`}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Agency'); } }}
                            style={{
                                background: currentTab === 'Agency' ? '#001f3f' : '',
                                color: currentTab === 'Agency' ? '#fff' : '#000', fontWeight: '500',
                                padding: currentTab === 'Agency' ? '2px 10px' : '',
                                borderRadius: currentTab === 'Agency' ? '4px' : ''

                            }}
                        >
                            Agency
                        </Link>
                    </li>
                    <li className="nav-item" >
                        <Link
                            className={`nav-item${active === `/personnelTab?Aid=${Aid}&ASta=${ASta}&AgyName=${AgyName}&ORINum=${ORINum}&perId=${perId}&perSta=${perSta}` ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                            to={changesStatus ? currentLocation : `/personnelTab?Aid=${Aid}&ASta=${ASta}&AgyName=${AgyName}&ORINum=${ORINum}&perId=${perId}&perSta=${perSta}`}
                            onClick={() => { if (!changesStatus) { setCurrentTab('personnel') } }}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            style={{
                                background: currentTab === 'personnel' ? '#001f3f' : '',
                                // color: currentTab === 'personnel' ? '#fff' : '#000', fontWeight: '500' 
                                color: currentTab === 'personnel' ? '#fff' : count?.PersonnelCount > 0 ? 'blue' : '#000', fontWeight: '500',
                                padding: currentTab === 'personnel' ? '2px 10px' : '',
                                borderRadius: currentTab === 'personnel' ? '4px' : ''
                            }}
                        >
                            Personnel{`${count?.PersonnelCount > 0 ? '(' + count?.PersonnelCount + ')' : ''}`}
                        </Link>
                    </li>

                </ul>
            </div>
        </>
    )
}

export default TabAgency