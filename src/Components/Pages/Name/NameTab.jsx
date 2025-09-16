import { useContext, useEffect, useState } from 'react';
import Home from './NameTab/Home/Home';
import General from './NameTab/General/General';
import ContactDetails from './NameTab/ContactDetails/ContactDetails';
import Aliases from './NameTab/Aliases/Aliases';
import Smt from './NameTab/SMT/Smt';
import Victim from './NameTab/Victim/Victim';
import IdentificationNumber from './NameTab/IdentificationNumber/IdentificationNumber';
import Gang from './NameTab/Gang/Gang';
import { AgencyContext } from '../../../Context/Agency/Index';
import Connection from './NameTab/Connection/Connection';
import Address from './NameTab/Address/Address';
import { Decrypt_Id_Name } from '../../Common/Utility';
import Tab from '../../Utility/Tab/Tab';
import { Link, useNavigate } from 'react-router-dom';
import AssaultInjuryCom from './NameTab/Offender/OffenderTab/AllTabCom/AssaultInjuryCom';
import Appearance from './NameTab/Appearance/Appearance';
import Log from '../Log/Log';
import { useLocation } from "react-router-dom";
import { base64ToString } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { fetchPostData } from '../../hooks/Api';
import Involvements from '../SummaryModel/Involvement';
import Warrant from './NameTab/Warrant/Warrant';
import History from './NameTab/History/History';
import Offense from './NameTab/Offense/Offense';

const NameTab = ({ isCad = false, isCADSearch = false, isViewEventDetails = false }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var NameID = query?.get("NameID");
    var MasterNameID = query?.get('MasterNameID');
    var IncID = query?.get('IncId');
    var NameStatus = query?.get('NameStatus');
    var MstPage = query?.get('page');
    var ModNo = query?.get('ModNo');
    var ProSta = query?.get('ProSta');
    var SideBarStatus = query?.get("SideBarStatus");

    let DecNameID = 0, DecMasterNameID = 0, DecIncID = 0;

    if (!NameID) NameID = 0;
    else DecNameID = parseInt(base64ToString(NameID));
    if (!MasterNameID) MasterNameID = 0;
    else DecMasterNameID = parseInt(base64ToString(MasterNameID));
    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));


    const { nameShowPage, changesStatus, auditCount, offenderCount, victimCount, tabCount, NameTabCount, setNameShowPage, countStatus, countAppear, localStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const navigate = useNavigate();
    const [status, setStatus] = useState();
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>

    const [showOffender, setShowOffender] = useState(false);
    const [showVictim, setShowVictim] = useState(false);
    const [showWarrant, setshowWarrant] = useState(false);
    const [isBusinessName, setIsBusinessName] = useState(false);
    const [NameId, setNameId] = useState(false);
    const [ListData, setListData] = useState([]);
    const [DocName, setDocName] = useState('NameDoc')
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    useEffect(() => {
        if (NameStatus === true || NameStatus === 'true') {
            setStatus(true);
        } else {
            setStatus(false);
        }
        setNameShowPage('home');
    }, [NameStatus])

    useEffect(() => {
        if (DecNameID || DecMasterNameID) { get_List(DecNameID, DecMasterNameID) }
    }, [DecNameID, DecMasterNameID]);

    const get_List = (DecNameID, DecMasterNameID) => {
        const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
        const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('TabBasicInformation/NameInformation', MstPage ? val2 : val).then((res) => {
            if (res) {

                setListData(res);
            } else {
                setListData([]);
            }
        })
    }



    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                {!isCad && <div className="col-12  inc__tabs">
                    {
                        !MstPage && <Tab />
                    }
                </div>}
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className={`card Agency ${isCad ? 'CAD-incident-card' : 'incident-card'}`}>
                            <div className="card-body" >
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12 name-tab">
                                        <ul className='nav nav-tabs'>
                                            {isCad ? <Link
                                                className={`nav-item ${nameShowPage === 'home' ? 'active' : ''}`}
                                                to={
                                                    isCADSearch ? `/cad/name-search?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}` :
                                                        MstPage ?
                                                            `/cad/dispatcher?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}`
                                                            :
                                                            `/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${NameID}&MasterNameID=${MasterNameID}&NameStatus=${NameStatus}`
                                                }

                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: nameShowPage === 'home' ? 'Red' : '#000' }}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                aria-current="page"

                                                onClick={() => { if (!changesStatus) setNameShowPage('home') }}

                                            >
                                                {iconHome}
                                            </Link> : <Link
                                                className={`nav-item ${nameShowPage === 'home' ? 'active' : ''}`}
                                                to={
                                                    MstPage ?
                                                        `/Name-Home?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}`
                                                        :
                                                        `/Name-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${NameID}&MasterNameID=${MasterNameID}&NameStatus=${NameStatus}`
                                                }
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: nameShowPage === 'home' ? 'Red' : '#000' }}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                aria-current="page"

                                                onClick={() => { if (!changesStatus) setNameShowPage('home') }}

                                            >
                                                {iconHome}
                                            </Link>}

                                            {isBusinessName && (
                                                <>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Contact_Details' ? 'Red' : NameTabCount?.ContactDetailsCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Contact_Details') }}
                                                    >
                                                        Contact Details{`${NameTabCount?.ContactDetailsCount > 0 ? '(' + NameTabCount?.ContactDetailsCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Address' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Address' ? 'Red' : NameTabCount?.AddressCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Address') }}
                                                    >
                                                        Address{`${NameTabCount?.AddressCount > 0 ? '(' + NameTabCount?.AddressCount + ')' : ''}`}
                                                    </span>

                                                    <span
                                                        className={`nav-item ${nameShowPage === 'TransactionLog' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'TransactionLog' ? 'Red' : NameTabCount?.TransactionLogCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('TransactionLog') }}
                                                    >
                                                        Involvement{`${NameTabCount?.TransactionLogCount > 0 ? '(' + NameTabCount?.TransactionLogCount + ')' : ''}`}
                                                    </span>
                                                </>
                                            )}
                                            {!isBusinessName && (
                                                <>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'general' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'general' ? 'Red' : countStatus === true ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('general') }}
                                                    >
                                                        General{`${NameTabCount?.GeneralCount > 0 ? '(' + NameTabCount?.GeneralCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Appearance' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Appearance' ? 'Red' : countAppear === true ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Appearance') }}
                                                    >
                                                        Appearance{`${NameTabCount?.AppearanceCount > 0 ? '(' + NameTabCount?.AppearanceCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'aliases' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'aliases' ? 'Red' : NameTabCount?.AliasesCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('aliases') }}
                                                    >
                                                        Aliases{`${NameTabCount?.AliasesCount > 0 ? '(' + NameTabCount?.AliasesCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'SMT' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'SMT' ? 'Red' : NameTabCount?.NameSMTCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('SMT') }}
                                                    >
                                                        SMT{`${NameTabCount?.NameSMTCount > 0 ? '(' + NameTabCount?.NameSMTCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Identification_Number' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Identification_Number' ? 'Red' : NameTabCount?.IdentificationNumberCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Identification_Number') }}
                                                    >
                                                        Identification Number{`${NameTabCount?.IdentificationNumberCount > 0 ? '(' + NameTabCount?.IdentificationNumberCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Contact_Details' ? 'Red' : NameTabCount?.ContactDetailsCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Contact_Details') }}
                                                    >
                                                        Contact Details{`${NameTabCount?.ContactDetailsCount > 0 ? '(' + NameTabCount?.ContactDetailsCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Address' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Address' ? 'Red' : NameTabCount?.AddressCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Address') }}
                                                    >
                                                        Address{`${NameTabCount?.AddressCount > 0 ? '(' + NameTabCount?.AddressCount + ')' : ''}`}
                                                    </span>


                                                    <span
                                                        className={`nav-item ${nameShowPage === 'Warrant' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'Warrant' ? 'Red' : NameTabCount?.NameWarrantCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('Warrant') }}
                                                    >
                                                        Warrant{`${NameTabCount?.NameWarrantCount > 0 ? '(' + NameTabCount?.NameWarrantCount + ')' : ''}`}
                                                    </span>


                                                    <span
                                                        className={`nav-item ${nameShowPage === 'TransactionLog' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'TransactionLog' ? 'Red' : NameTabCount?.TransactionLogCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"

                                                        onClick={() => { if (!changesStatus) setNameShowPage('TransactionLog') }}
                                                    >
                                                        Involvement{`${NameTabCount?.TransactionLogCount > 0 ? '(' + NameTabCount?.TransactionLogCount + ')' : ''}`}
                                                    </span>
                                                    {
                                                        MstPage &&
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'History' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: nameShowPage === 'History' ? 'Red' : '#000' }}
                                                            aria-current="page"

                                                            onClick={() => { if (!changesStatus) setNameShowPage('History') }}
                                                        >
                                                            History
                                                        </span>

                                                    }
                                                </>
                                            )}
                                            {
                                                showVictim && !isBusinessName && MstPage !== "MST-Name-Dash" &&
                                                <span
                                                    className={`nav-item ${nameShowPage === 'Victim' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: nameShowPage === 'Victim' ? 'Red' : victimCount === true ? 'blue' : '#000' }}
                                                    aria-current="page"

                                                    onClick={() => { if (!changesStatus) setNameShowPage('Victim') }}
                                                >

                                                    Victim
                                                </span>
                                            }

                                            {
                                                showOffender && MstPage !== "MST-Name-Dash" &&
                                                <span
                                                    className={`nav-item ${nameShowPage === 'Offender' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: nameShowPage === 'Offender' ? 'Red' : offenderCount === true ? 'blue' : '#000' }}
                                                    aria-current="page"

                                                    onClick={() => { if (!changesStatus) setNameShowPage('Offender') }}
                                                >
                                                    Offender{`${tabCount?.OffenderCount > 0 ? '(' + tabCount?.OffenderCount + ')' : ''}`}
                                                </span>
                                            }
                                            {MstPage !== "MST-Name-Dash" && (
                                                <span
                                                    className={`nav-item ${nameShowPage === 'Offense' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: nameShowPage === 'Offense' ? 'Red' : NameTabCount?.NameOffenseCount > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"

                                                    onClick={() => { if (!changesStatus) setNameShowPage('Offense') }}
                                                >
                                                    Associated Offenses
                                                </span>
                                            )}


                                            <span
                                                className={`nav-item ${nameShowPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}

                                                style={{ color: nameShowPage === 'AuditLog' ? 'Red' : auditCount === true ? 'blue' : '#000' }}
                                                aria-current="page"

                                                onClick={() => { if (!changesStatus) setNameShowPage('AuditLog') }}
                                            >
                                                {isCad ? "Change Log" : " Audit Log"}
                                            </span>

                                        </ul>
                                    </div>
                                </div>
                                {
                                    nameShowPage === 'home' ?
                                        <Home {...{ setStatus, status, showVictim, setShowVictim, setNameShowPage, setshowWarrant, setShowOffender, setIsBusinessName, get_List, isCad, isCADSearch, isViewEventDetails }} />
                                        :
                                        nameShowPage === 'general' ?
                                            <General {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                            :
                                            nameShowPage === 'Contact_Details' ?
                                                <ContactDetails {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                :
                                                nameShowPage === 'Appearance' ?
                                                    <Appearance  {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                    :
                                                    nameShowPage === 'aliases' ?
                                                        <Aliases {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                        :

                                                        nameShowPage === 'SMT' ?
                                                            <Smt {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                            :
                                                            nameShowPage === 'Offender' && showOffender ?
                                                                <AssaultInjuryCom  {...{ ListData, ListData, DecNameID, DecMasterNameID, DecIncID }} />
                                                                :
                                                                nameShowPage === 'Identification_Number' ?
                                                                    <IdentificationNumber {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                    :
                                                                    nameShowPage === 'Victim' && showVictim ?
                                                                        <Victim {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} showTabs={setNameShowPage} />
                                                                        :
                                                                        nameShowPage === 'Gang' ?
                                                                            <Gang {...{ DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                            :
                                                                            nameShowPage === 'connections' ?
                                                                                <Connection  {...{ ListData, DecNameID, DecMasterNameID, DecIncID }} />
                                                                                :
                                                                                nameShowPage === 'Address' ?
                                                                                    <Address {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                    :
                                                                                    nameShowPage === 'Warrant' ?
                                                                                        <Warrant {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                        :
                                                                                        nameShowPage === 'Offense' ?
                                                                                            // <></>
                                                                                            <Offense {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                            :
                                                                                            nameShowPage === 'History' ?
                                                                                                <History {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                                :
                                                                                                nameShowPage === 'TransactionLog' ?

                                                                                                    <Involvements
                                                                                                        idColName={'MasterNameID'}
                                                                                                        para={'NameID'}
                                                                                                        url={''}
                                                                                                        NameStatus={NameStatus}
                                                                                                        SideBarStatus={SideBarStatus}
                                                                                                        NameID={NameID}
                                                                                                        ProSta={ProSta}
                                                                                                        IncNo={IncNo}
                                                                                                        IncSta={IncSta}
                                                                                                        scrCode={'N055'}
                                                                                                        incId={DecIncID}
                                                                                                        tabID={DecNameID}
                                                                                                        masterID={DecMasterNameID}
                                                                                                        IsMaster={MstPage === "MST-Name-Dash" ? true : false}
                                                                                                    />
                                                                                                    :
                                                                                                    nameShowPage === 'AuditLog' ?
                                                                                                        <Log ParentId={DecNameID}
                                                                                                            scrCode={'N056'}
                                                                                                            url={'Log/GetData_LogName'}
                                                                                                            para={'NameID'}
                                                                                                            masterPara={'MasterNameID'}
                                                                                                            MstParentId={DecMasterNameID}
                                                                                                            IsMaster={MstPage === "MST-Name-Dash" ? true : false}
                                                                                                        />
                                                                                                        :
                                                                                                        <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default NameTab