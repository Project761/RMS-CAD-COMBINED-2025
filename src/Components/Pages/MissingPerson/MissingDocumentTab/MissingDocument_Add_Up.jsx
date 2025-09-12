import { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Home from '../../../../Components/Pages/MissingPerson/MissingDocumentTab/Home/Home'
import { AgencyContext } from '../../../../Context/Agency/Index'
import { base64ToString } from '../../../Common/Utility'
import MissingTab from '../../../Utility/Tab/MissingTab'
import DocumentAccess from './DocumentAccess/DocumentAccess'
import DocumentHistory from './DocumentHistory/DocumentHistory'


const MissingDocument_Add_Up = () => {

    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const { updateCount,  changesStatus, } = useContext(AgencyContext)

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()
    const [showdocumentstatus, setShowdocumentstatus] = useState(false);

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

    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var MissVehID = query?.get("MissVehID");

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
                <div className="col-12  inc__tabs">
                    <MissingTab />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">
                            <div className="card-body" >
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px' }}>
                                    <div className="col-12 name-tab">
                                        <ul className='nav nav-tabs'>
                                            <Link
                                                className={`nav-item ${showPage === 'home' ? 'active' : ''}`}

                                              
                                                to={`/Missing-Document-Home?IncId=${IncID}&IncNo=${IncNo}&documentId=${(documentID)}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}`}

                                                style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) { setShowPage('home') } }}>
                                                {iconHome}
                                            </Link>

                                            {
                                                showdocumentstatus && (
                                                    <>
                                                        {/* Document Access */}
                                                        <span
                                                            className={`nav-item ${showPage === 'DocumentAccess' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: showPage === 'DocumentAccess' ? 'Red' : '#000' }}
                                                            onClick={() => {
                                                                if (!changesStatus) { setShowPage('DocumentAccess') }
                                                            }}
                                                        >
                                                            Document Access
                                                            
                                                        </span>

                                                        {/* Document History */}
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
                                {
                                    showPage === 'home' ?
                                        <Home {...{ DecIncID, status, setStatus, DecdocumentID, showdocumentstatus, setShowdocumentstatus }} />
                                        :
                                        showPage === 'DocumentAccess' && showdocumentstatus ?
                                            <DocumentAccess {...{ DecdocumentID }} />
                                            :
                                            showPage === 'DocumentHistory' && showdocumentstatus ?
                                                <DocumentHistory {...{ DecdocumentID }} />
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

export default MissingDocument_Add_Up