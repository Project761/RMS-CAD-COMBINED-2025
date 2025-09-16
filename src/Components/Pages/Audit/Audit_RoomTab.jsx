import React, { useContext, useState } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index';
import { Link, useLocation } from 'react-router-dom';
import { base64ToString } from '../../Common/Utility';
import Home from './Home';
import ChainOfCustody from '../Property/PropertyTab/ChainOfCustody/ChainOfCustody';
import Comments from '../Document/Comments/Comments';
import EvidenceDestruction from '../PropertyRoom/PropertyRoomTab/EvidenceDestruction/EvidenceDestruction';

const Property_RoomTab = () => {
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const { changesStatus, tabCount } = useContext(AgencyContext);
    const [status, setStatus] = useState();
    const [showIncPage, setShowIncPage] = useState('home');
    const [incidentReportedDate, setIncidentReportedDate] = useState(null);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecPropID = 0, DecMPropID = 0, DecProRomId = 0, DeSelectedStatus = 0


    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ProId = query?.get("ProId");
    var MProId = query?.get('MProId');
    var ProRomId = query?.get('ProRomId');
    var ProRoomStatus = query?.get('ProRoomStatus');
    var SelectedCategory = query?.get('selectedCategory');
    var ProType = query?.get('ProType');
    var ProNumber = query?.get('ProNumber');
    var ProTransfer = query?.get('ProTransfer');
    var CallStatus = query?.get('CallStatus');
    var CheckboxStatus = query?.get('CheckboxStatus');


    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!ProId) ProId = 0;
    else DecPropID = parseInt(base64ToString(ProId));
    if (!MProId) MProId = 0;
    else DecMPropID = parseInt(base64ToString(MProId));
    if (!ProRomId) ProRomId = 0;
    else DecProRomId = parseInt(base64ToString(ProRomId));
    // if (!SelectedStatus) SelectedStatus = 0;
    // else DeSelectedStatus = parseInt(base64ToString(SelectedStatus));





    return (
        <>
            <div className="section-body view_page_design pt-1 p-1 bt" >
                <div className="div">
                    {/* <div className="col-12  inc__tabs">
                        <PropertyRoomMainTab />
                    </div> */}
                    <div className="dark-row" >
                        <div className="col-12 col-sm-12">
                            <div className="card Agency name-card ">
                                <div className="card-body" >
                                    <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                        <div className="col-12   incident-tab">
                                            <ul className='nav nav-tabs'>
                                                {/* <Link
                                                    className={`nav-item ${showIncPage === 'home' ? 'active' : ''} `}
                                                    // to={`/Property-room?&ProId=${ProId}&MProId=${MProId}&ProRomId=${ProRomId}&ProRoomStatus=${ProRoomStatus}&selectedCategory=${SelectedCategory}&ProType=${ProType}&ProNumber=${ProNumber}&ProTransfer=${ProTransfer}&ProRomId=${ProRomId}&CallStatus=${CallStatus}&CheckboxStatus=${CheckboxStatus}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'home' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                >
                                                    Property Management
                                                </Link> */}

                                                <Link
                                                    className={`nav-item ${showIncPage === 'home' ? 'active' : ''}`}
                                                    style={{ color: showIncPage === 'home' ? 'Red' : '#000' }}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    aria-current="page"
                                                >

                                                    {iconHome}
                                                </Link>

                                                <span
                                                    className={`nav-item ${showIncPage === 'ChainOfCustody' ? 'active' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'ChainOfCustody' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                >
                                                    Audit history
                                                </span>


                                            </ul>
                                        </div>
                                    </div>
                                    {
                                        showIncPage === 'home' ?
                                            <Home {...{ setStatus, showIncPage, DecPropID, DecMPropID, DecProRomId, ProRoomStatus, SelectedCategory, CallStatus, ProType, ProNumber, ProTransfer, CheckboxStatus }} />

                                            :
                                            showIncPage === 'ChainOfCustody' ?
                                                <ChainOfCustody {...{ DecPropID }} />
                                                :
                                                showIncPage === 'Comments' ?
                                                    <Comments {...{ DecProRomId }} />
                                                    :
                                                    showIncPage === 'EvidenceDestruction' ?
                                                        <EvidenceDestruction {...{ DecProRomId, DecPropID, DecMPropID }} />
                                                        :
                                                        // showIncPage === 'AuditHome' ?
                                                        //     <AuditHome {...{ DecProRomId, DecPropID, DecMPropID }} />
                                                        //     :
                                                        <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Property_RoomTab