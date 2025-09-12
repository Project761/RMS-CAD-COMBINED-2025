import React, { useState } from 'react'
import { Link, useLocation } from "react-router-dom";

const ReportSidebar = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const [expandList, setExpandList] = useState(null);

    const [plusMinus, setPlusMinus] = useState({
        'Master Table': false,
        'Master Table2': false,
        'Master Table3': false,
        'Master Table5': false,
        'Master Table7': false,
        'Master Table8': false,
    });

    const callReportModules = (type, val) => {
        if (type === 'List') {
            setExpandList(expandList === val ? null : val);
            setPlusMinus(prevState => ({
                ...prevState,
                [val]: !prevState[val],
                ...Object.keys(prevState).reduce((acc, key) => {
                    if (key !== val) acc[key] = false;
                    return acc;
                }, {}),
            }));
        }
    }

    return (
        <>
            <div className="row px-1">
                <div className="col-12 mt-4">
                    <input type="text" className='form-control input-fixed mt-1'
                        placeholder='Search By List ...' />
                </div>
            </div>

            {/* Event */}
            <li className='mt-2 pt-1'>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table']} onClick={() => callReportModules('List', 'Master Table')}>
                    <span className='ml-3'>Event</span>
                </Link>
                <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table'} className={`${expandList === 'Master Table' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <li className="ml-3 p-0">
                        <Link to={`/cad/reports/event-receive-source?page=EventReceiveSource`} style={{ cursor: 'pointer', background: openPage === 'EventReceiveSource' ? '#EEE' : '' }} >
                            <span>Event Receive Source</span>
                        </Link>
                    </li>
                    <li className="ml-3 p-0">
                        <Link to={`/cad/reports/call-log-report?page=CallLogReport`} style={{ cursor: 'pointer', background: openPage === 'CallLogReport' ? '#EEE' : '' }}>
                            <span >Daily Activity Report</span>
                        </Link>
                    </li>
                </ul>
            </li>

            {/* GEO */}
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table2']} onClick={() => callReportModules('List', 'Master Table2')}>
                    <span className='ml-3'> GEO</span>
                </Link>
                <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table2'} className={`${expandList === 'Master Table2' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <li className="ml-3 p-0">
                        <Link to={`/cad/reports/premises-history-report?page=PremisesHistory`} style={{ cursor: 'pointer', background: openPage === 'PremisesHistory' ? '#EEE' : '' }}>
                            <span>Premises History</span>
                        </Link>
                    </li>
                </ul>
                <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table2'} className={`${expandList === 'Master Table2' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <li className="ml-3 p-0">
                        <Link to={`/cad/reports/location-report?page=LocationReport`} style={{ cursor: 'pointer', background: openPage === 'LocationReport' ? '#EEE' : '' }}>
                            <span>Location Report</span>
                        </Link>
                    </li>
                </ul>
            </li>

            {/* Event */}
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus['Master Table3']} onClick={() => callReportModules('List', 'Master Table3')}>
                    <span className='ml-3'>Unit</span>
                </Link>
                <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table3'} className={`${expandList === 'Master Table3' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <li className="ml-3 p-0">
                        <Link to={`/cad/reports/resource-history-report?page=ResourceHistory`} style={{ cursor: 'pointer', background: openPage === 'ResourceHistory' ? '#EEE' : '' }}>
                            <span>Unit History</span>
                        </Link>
                    </li>
                </ul>
            </li>
        </>
    );
}

export default ReportSidebar;
