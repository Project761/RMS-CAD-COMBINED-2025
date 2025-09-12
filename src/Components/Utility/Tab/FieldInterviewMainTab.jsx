import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';

const FieldInterviewMainTab = () => {

    const dispatch = useDispatch();
    const currentLocation = window.location.pathname + window.location.search;
    const { changesStatus, } = useContext(AgencyContext);
    const [currentTab, setCurrentTab] = useState('field-interview');
    const active = window.location.pathname;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [incidentStatus, setIncidentStatus] = useState(false)
    const [status, setStatus] = useState(false)

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
    var FiID = query?.get("FiID");
    var FiSta = query?.get("FiSta");


    if (!IncID) IncID = 0;
    else IncID = IncID;

    if (!FiID) FiID = 0;
    else FiID = FiID;

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (IncSta === false || IncSta === 'false') { setIncidentStatus(false); } else { setIncidentStatus(true) }
    }, [IncSta]);


    useEffect(() => {
        if (FiSta === true || FiSta === 'true') {
            setStatus(true);
        } else { setStatus(false) }
    }, [FiSta]);

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('field-interview')) setCurrentTab('field-interview');
        if (pathname.includes('Name-Home')) setCurrentTab('Name');
        if (pathname.includes('Prop-Home')) setCurrentTab('Property');
        if (pathname.includes('Vehicle-Home')) setCurrentTab('Vehicle');
        if (pathname.includes('Field-Narrative-Home')) setCurrentTab('Narratives');
        if (pathname.includes('Field-Notes-Home')) setCurrentTab('Notes');
    }, [window.location.pathname]);

    return (
        <>
            <div className="col-12 inc__tabs">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link
                            className={`nav-item  ${active === `/field-interview` ? 'active' : ''}`}
                            // to={`/field-interview`}
                            to={changesStatus ? currentLocation : `/field-interview?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&FiID=${FiID}&FiSta=${FiSta}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            style={{ color: currentTab === 'field-interview' ? 'Red' : 'gray', fontWeight: '500' }}
                            onClick={() => { if (!changesStatus) { setCurrentTab('field-interview'); } }}
                        >
                            Field Interview
                        </Link>
                    </li>
                    <li className="nav-item" >
                        <Link
                            className={`nav-item  ${active === `/Name-Home` ? 'active' : ''}`}
                            to={changesStatus ? currentLocation : `/Name-Home`}
                            style={{ color: currentTab === 'Name' ? 'Red' : 'gray', fontWeight: '500' }}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Name') } }}
                        >
                            Name
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-item  ${active === `/Prop-Home` ? 'active' : ''}`}
                            to={changesStatus ? currentLocation : `/Prop-Home`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            style={{ color: currentTab === 'Property' ? 'Red' : 'gray', fontWeight: '500' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Property') } }}
                        >
                            Property
                        </Link>

                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-item  ${active === `/Vehicle-Home` ? 'active' : ''}`}
                            to={changesStatus ? currentLocation : `/Vehicle-Home`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            style={{ color: currentTab === 'Vehicle' ? 'Red' : 'gray', fontWeight: '500' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Vehicle') } }}
                        >
                            Vehicle
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-item  ${active === `/Field-Narrative-Home` ? 'active' : ''}`}
                            to={`/Field-Narrative-Home`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            style={{ color: currentTab === 'Narratives' ? 'Red' : 'gray', fontWeight: '500' }}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Narratives') } }}
                        >
                            Narratives
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-item  ${active === `/Field-Notes-Home` ? 'active' : ''}`}
                            to={changesStatus ? currentLocation : `/Field-Notes-Home`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            style={{ color: currentTab === 'Notes' ? 'Red' : 'gray', fontWeight: '500' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Notes') } }}
                        >
                            Notes
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default FieldInterviewMainTab