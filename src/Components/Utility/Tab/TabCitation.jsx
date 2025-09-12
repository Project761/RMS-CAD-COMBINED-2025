import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function TabCitation() {
    const active = window.location.pathname;
    const [currentTab, setCurrentTab] = useState('Agency');

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('citationTab')) setCurrentTab('Citation');
        if (pathname.includes('documentTab')) setCurrentTab('Document');
    }, [window.location.pathname]);

    return (
        <>
            <div className="col-12 inc__tabs pl-0">
                <ul className="nav nav-tabs mb-0 ">
                    <li className="nav-item">
                        <Link
                            className={`nav-item  ${active === `/citationTab` ? 'active' : ''}`}

                            to={`/citationTab`}
                            onClick={() => { setCurrentTab('Citation') }}
                            style={{
                                background: currentTab === 'Citation' ? '#001f3f' : '',
                                color: currentTab === 'Citation' ? '#fff' : '#000', fontWeight: '500',
                                padding: currentTab === 'Citation' ? '2px 10px' : '',
                                borderRadius: currentTab === 'Citation' ? '4px' : ''

                            }}
                        >
                            Citation
                        </Link>
                    </li>
                    <li className="nav-item" >
                        <Link
                            className={`nav-item${active === `/documentTab` ? 'active' : ''}`}
                            to={`/documentTab`}
                            onClick={() => { setCurrentTab('Document') }}
                            style={{
                                background: currentTab === 'Document' ? '#001f3f' : '',
                                color: currentTab === 'Document' ? '#fff' : '#000', fontWeight: '500',
                                padding: currentTab === 'Document' ? '2px 10px' : '',
                                borderRadius: currentTab === 'Document' ? '4px' : ''
                            }}
                        >
                            Document
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default TabCitation