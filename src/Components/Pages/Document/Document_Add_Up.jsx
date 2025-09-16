import { useState, useEffect, useContext } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import { base64ToString } from '../../Common/Utility'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DocumentHistory from './DocumentHistory/DocumentHistory'
import Home from './DocumentTab/Home/Home'
import Tab from '../../Utility/Tab/Tab'
import Comments from './Comments/Comments'

const Document_Add_Up = ({ isCad = false, isCADSearch = false, isViewEventDetails = false, isCitation = false }) => {

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { updateCount, changesStatus, } = useContext(AgencyContext)

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()
    const [showdocumentstatus, setShowdocumentstatus] = useState(false);
    const [addUpdatePermission, setaddUpdatePermission] = useState(false);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    const query = useQuery();
    let ArrestId = query?.get('ArrestId');
    let IncID = query?.get('IncId');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var DocSta = query?.get('DocSta');
    var ArrNo = query?.get("ArrNo");
    let MstPage = query?.get('page');
    var Name = query?.get("Name");
    var ChargeSta = query?.get('ChargeSta');
    let documentID = query?.get('documentId');

    let DecArrestId = 0, DecIncID = 0, DecdocumentID = 0;


    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));

    if (!documentID) documentID = 0;
    else DecdocumentID = parseInt(base64ToString(documentID));

    useEffect(() => {
        if (DocSta === 'true' || DocSta === true) {
            setStatus(true);
        } else if (DocSta === 'false' || DocSta === false) {
            setStatus(false);
        }
        setShowPage('home');
    }, [DocSta, localStoreData, updateCount]);

    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                {!isCad &&
                    <div className="col-12  inc__tabs">
                        {
                            <Tab />
                        }
                    </div>
                }
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className={`Agency ${isCitation ? '' : 'card'} ${isCad ? 'CAD-incident-card' : 'incident-card'}`}>
                            <div className="card-body" >
                                {!isCitation && (
                                    <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                        <div className="col-12 name-tab">
                                            <ul className='nav nav-tabs'>
                                                <Link

                                                    className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                                                    to={isCad ?
                                                        `/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&DocSta=${true}&documentId=${(documentID)}`
                                                        : `/Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&DocSta=${true}&documentId=${(documentID)}`
                                                    }

                                                    style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) { setShowPage('home') } }}

                                                >
                                                    {iconHome}
                                                </Link>

                                                <span
                                                    className={`nav-item ${showPage === 'Comments' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPage === 'Comments' ? 'Red' : '#000' }}
                                                    onClick={() => {
                                                        if (!changesStatus) { setShowPage('Comments') }

                                                    }}
                                                >
                                                    Comments
                                                </span>

                                                {
                                                    showdocumentstatus && (
                                                        <>
                                                            <span
                                                                className={`nav-item ${showPage === 'DocumentHistory' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: showPage === 'DocumentHistory' ? 'Red' : '#000' }}
                                                                onClick={() => {
                                                                    if (!changesStatus) { setShowPage('DocumentHistory') }

                                                                }}
                                                            >
                                                                Document History
                                                            </span>
                                                        </>
                                                    )
                                                }

                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {
                                    showPage === 'home' ?
                                        <Home {...{
                                            DecIncID,
                                            status,
                                            setStatus,
                                            DecdocumentID,
                                            showdocumentstatus,
                                            setShowdocumentstatus,
                                            isCad,
                                            isViewEventDetails,
                                            isCADSearch,
                                            showPage,
                                            setShowPage,
                                            isCitation,

                                        }} />
                                        :
                                        showPage === 'Comments' ?
                                            <Comments {...{ DecdocumentID, DecIncID, }} />
                                            :
                                            showPage === 'DocumentHistory' && showdocumentstatus ?
                                                <DocumentHistory {...{
                                                    DecdocumentID,
                                                    isCad,
                                                    isViewEventDetails,
                                                    isCADSearch
                                                }} />
                                                :
                                                null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default Document_Add_Up