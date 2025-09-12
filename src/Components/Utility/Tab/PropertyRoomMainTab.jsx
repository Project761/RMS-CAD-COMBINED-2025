import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AgencyContext } from '../../../Context/Agency/Index';

const PropertyRoomMainTab = () => {

    const active = window.location.pathname;
    const currentLocation = window.location.pathname + window.location.search;
    const { changesStatus, } = useContext(AgencyContext);
    const [currentTab, setCurrentTab] = useState('Property-room');
    const [status, setStatus] = useState();

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Property-room')) setCurrentTab('Property-room');
    }, [window.location.pathname]);

    return (
        <>
            {/* <div className="col-12 inc__tabs pl-0">
                <ul className="nav nav-tabs mb-0 ">
                    <li className="nav-item">
                        <Link
                            className={`nav-item  ${active === `/Property-room` ? 'active' : ''}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            to={changesStatus ? currentLocation : `/Property-room`}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Property-room'); } }}
                            style={{
                                background: currentTab === 'Property-room' ? '#001f3f' : '',
                                color: currentTab === 'Property-room' ? '#fff' : 'gray', fontWeight: '500',
                                padding: currentTab === 'Property-room' ? '2px 10px' : '',
                                borderRadius: currentTab === 'Property-room' ? '4px' : ''
                            }}
                        >
                            Property Room
                        </Link>
                    </li>


                </ul>
            </div> */}
        </>
    )
}

export default PropertyRoomMainTab