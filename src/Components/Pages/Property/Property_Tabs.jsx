import React, { useContext, useEffect, useState, } from 'react';
import { PropertyTabs } from '../../Utility/Tab/TabsArray';
import { AgencyContext } from '../../../Context/Agency/Index';
import Home from './PropertyTab/Home/Home'
import Document from './PropertyTab/Document/Document'
import Owner from './PropertyTab/Owner/Owner'
import Offense from './PropertyTab/Offense/Offense'
import RecoveredProperty from './PropertyTab/RecoveredProperty/RecoveredProperty';
import PropertyTransactionlog from './PropertyTab/PropertyTransactionLog/PropertyTransactionlog';
import PawnProperty from './PropertyTab/PawnProperty/PawnProperty';
import Tab from '../../Utility/Tab/Tab';
import { Link, useLocation } from 'react-router-dom';
import Log from '../Log/Log';
import PropertyNotes from './PropertyTab/PropertyNotes/PropertyNotes';
import MiscellaneousInformation from './PropertyTab/MiscellaneousInformation/MiscellaneousInformation';
import DocumentModal from '../../Common/DocumentModal';
import { useDispatch, useSelector } from 'react-redux';
import { base64ToString } from '../../Common/Utility';
import { fetchPostData } from '../../hooks/Api';
import Other from './PropertyTab/Other/Other';
import Involvements from '../SummaryModel/Involvement';
import PropertyInvolvement from '../SummaryModel/PropertyInvolvement';
import PropertyManagement from './PropertyTab/PropertyManagement/PropertyManagement';
import ChainOfCustody from './PropertyTab/ChainOfCustody/ChainOfCustody';

const Property_Tabs = ({ isCad = false, isViewEventDetails = false, isCADSearch = false }) => {

    const { changesStatus, propertyCount, get_Property_Count, countoffaduit, } = useContext(AgencyContext);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get('IncId');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ProId = query?.get("ProId");
    var MProId = query?.get('MProId');
    var ProSta = query?.get('ProSta');
    var ModNo = query?.get('ModNo');
    var openPage = query?.get('page');
    var ProCategory = query?.get('ProCategory');
    var NameStatus = query?.get('NameStatus');
    let DecPropID = 0, DecMPropID = 0, DecIncID = 0;
    let MstPage = query?.get('page');

    if (!ProId) ProId = 0;
    else DecPropID = parseInt(base64ToString(ProId));
    if (!MProId) MProId = 0;
    else { DecMPropID = parseInt(base64ToString(MProId)); }
    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));


    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState(false);
    const [showRecovered, setShowRecovered] = useState(false);
    const [showOtherTab, setShowOtherTab] = useState(false);
    const [ListData, setListData] = useState([]);
    const [DocName, setDocName] = useState('PropDoc');
    const [propertyID, setPropertyID] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [propertystatus, setPropertyStatus] = useState('');
    const [IsNonPropertyRoomSelected, setIsNonPropertyRoomSelected] = useState(false);
    // const [incidentReportedDate, setIncidentReportedDate] = useState(null);


    useEffect(() => {
        if (ProSta === 'true' || ProSta === true) {
            setStatus(true);
        } else {
            setStatus(false); get_Property_Count('')
        }
    }, [ProSta])

    useEffect(() => {
        if (DecPropID || DecMPropID) {
            get_List(DecPropID, DecMPropID)
        }
    }, [DecPropID, DecMPropID]);



    const get_List = (propertyID, masterPropertyID) => {
        const val = {
            'MasterPropertyID': '0',
            'PropertyID': propertyID,
            'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
        }
        const val1 = {
            'PropertyID': '0',
            'MasterPropertyID': masterPropertyID,
            'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
        }
        fetchPostData('TabBasicInformation/PropertyInformation', MstPage === 'MST-Property-Dash' ? val1 : val).then((res) => {
            if (res) {
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }


    return (
        <div className="section-body  pt-1 p-1 bt" >
            <div className="div">
                {!isCad && <div className="col-12  inc__tabs">
                    {
                        !openPage && <Tab />
                    }
                </div>}
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className={`card Agency ${isCad ? 'CAD-incident-card' : 'incident-card'} ${openPage ? 'name-card' : ''}`}>
                            <div className="card-body">
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12  name-tab">
                                        <ul className='nav nav-tabs'>
                                            {isCad ? <Link
                                                className={`nav-item ${showPage === 'home' ? 'active' : ''} `}
                                                to={isCADSearch ? `cad/property_search?page=MST-Property-Dash&ProId=${ProId}&MProId=${MProId}&ModNo=${ModNo}&ProSta=${ProSta}&ProCategory=${ProCategory}` :
                                                    openPage ?
                                                        `/cad/dispatcher?page=MST-Property-Dash&ProId=${ProId}&MProId=${MProId}&ModNo=${ModNo}&ProSta=${ProSta}&ProCategory=${ProCategory}`
                                                        :
                                                        `/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${ProId}&MProId=${MProId}&ProSta=${ProSta}&ProCategory=${ProCategory}`
                                                }
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('home'); setPropertyStatus(false); }

                                                }}
                                            >
                                                {iconHome}
                                            </Link> : <Link
                                                className={`nav-item ${showPage === 'home' ? 'active' : ''} `}
                                                to={
                                                    openPage ?
                                                        `/Prop-Home?page=MST-Property-Dash&ProId=${ProId}&MProId=${MProId}&ModNo=${ModNo}&ProSta=${ProSta}&ProCategory=${ProCategory}`
                                                        :
                                                        `/Prop-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${ProId}&MProId=${MProId}&ProSta=${ProSta}&ProCategory=${ProCategory}`
                                                }
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) { setShowPage('home'); setPropertyStatus(false); } }}

                                            >
                                                {iconHome}
                                            </Link>}
                                            <span
                                                className={`nav-item ${showPage === 'Miscellaneous Information' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                aria-current="page"
                                                style={{ color: showPage === 'Miscellaneous Information' ? 'Red' : propertyCount?.MiscellaneousInformationCount > 0 ? 'blue' : '#000' }}
                                                onClick={() => { if (!changesStatus) { setShowPage('Miscellaneous Information') } }}


                                            >
                                                Miscellaneous Information{`${propertyCount?.MiscellaneousInformationCount > 0 ? '(' + propertyCount?.MiscellaneousInformationCount + ')' : ''}`}
                                            </span>


                                            <span
                                                className={`nav-item ${showPage === 'Owner' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Owner' ? 'Red' : propertyCount?.OwnerCount > 0 ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) { setShowPage('Owner') } }}

                                            >
                                                Owner{`${propertyCount?.OwnerCount > 0 ? '(' + propertyCount?.OwnerCount + ')' : ''}`}
                                            </span>

                                            {MstPage !== "MST-Property-Dash" && (
                                                <span
                                                    className={`nav-item ${showPage === 'Offense' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPage === 'Offense' ? 'Red' : propertyCount?.OffenseCount > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) { setShowPage('Offense') } }}

                                                >
                                                    Associated Offenses{`${propertyCount?.OffenseCount > 0 ? '(' + propertyCount?.OffenseCount + ')' : ''}`}
                                                </span>
                                            )}
                                            {
                                                showRecovered &&
                                                <span
                                                    className={`nav-item ${showPage === 'Recoveredproperty' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPage === 'Recoveredproperty' ? 'Red' : propertyCount?.RecoveredCount > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) { setShowPage('Recoveredproperty') } }}

                                                >
                                                    Recovered property{`${propertyCount?.RecoveredCount > 0 ? '(' + propertyCount?.RecoveredCount + ')' : ''}`}
                                                </span>
                                            }

                                            <span
                                                className={`nav-item ${showPage === 'PropertyTransactionLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'PropertyTransactionLog' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) { setShowPage('PropertyTransactionLog') } }}

                                            >
                                                Involvement
                                            </span>
                                            {
                                                showOtherTab &&
                                                <span
                                                    className={`nav-item ${showPage === 'other' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPage === 'other' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) { setShowPage('other') } }}

                                                >
                                                    Other
                                                </span>
                                            }
                                            {
                                                propertystatus && !(IsNonPropertyRoomSelected) &&
                                                <>
                                                    <span
                                                        className={`nav-item ${showPage === 'PropertyManagement' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'PropertyManagement' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('PropertyManagement') } }}

                                                    >
                                                        Property Management
                                                    </span>
                                                    <span
                                                        className={`nav-item ${showPage === 'ChainOfCustody' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'ChainOfCustody' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('ChainOfCustody') } }}

                                                    >
                                                        Chain Of Custody
                                                    </span>
                                                </>

                                            }
                                            <span
                                                className={`nav-item ${showPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}

                                                style={{ color: showPage === 'AuditLog' ? 'Red' : countoffaduit === true ? 'blue' : '#000' }}

                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) { setShowPage('AuditLog') } }}

                                            >
                                                {isCad ? "Change Log" : " Audit Log"}
                                            </span>
                                        </ul>
                                    </div>
                                    {
                                        showPage === 'home' ?
                                            <Home {...{ showRecovered, setShowRecovered, get_List, showOtherTab, setShowOtherTab, setPropertyStatus, setShowPage, propertystatus, isCad, isViewEventDetails, isCADSearch, status, }} />
                                            :
                                            showPage === 'Miscellaneous Information' ?
                                                <MiscellaneousInformation {...{ ListData, setIsNonPropertyRoomSelected, DecPropID, DecMPropID, DecIncID, propertystatus, setPropertyStatus, isCad, isViewEventDetails, isCADSearch, }} />
                                                :
                                                showPage === 'Document' ?
                                                    // <Document />
                                                    <DocumentModal
                                                        {...{ ListData, DocName }}
                                                        scrCode={'P060'}
                                                        IncID={DecIncID}
                                                        count={DecPropID}
                                                        ParentId={DecPropID}
                                                        parentTabMasterID={DecMPropID}
                                                        rowIdName={'DocumentID'}
                                                        masterIDColName={'MasterPropertyID'}
                                                        TabIdColName={'PropertyID'}
                                                        insertDataMasterUrl={''}
                                                        deleteUrl={'PropertyDocument/Delete_PropertyDocument'}
                                                        insertDataUrl={'PropertyDocument/Insert_PropertyDocument'}
                                                        getDataUrl={'PropertyDocument/GetData_PropertyDocument'}
                                                        getDataMasterUrl={'MainMasterPropertyDocument/GetData_MainMasterPropertyDocument'}
                                                    />
                                                    :
                                                    showPage === 'PropertyNotes' ?
                                                        <PropertyNotes {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails }} />
                                                        :
                                                        showPage === 'Owner' ?
                                                            <Owner {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                            :
                                                            showPage === 'Offense' ?
                                                                <Offense {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                                :
                                                                showPage === 'Recoveredproperty' ?
                                                                    <RecoveredProperty {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                                    :
                                                                    showPage === 'other' ?
                                                                        <Other {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                                        :
                                                                        showPage === 'PropertyManagement' ?
                                                                            <PropertyManagement {...{ DecPropID, DecMPropID, DecIncID, ProCategory, isViewEventDetails }} />
                                                                            :
                                                                            showPage === 'ChainOfCustody' ?
                                                                                <ChainOfCustody {...{ DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                                                :
                                                                                showPage === 'AuditLog' ?
                                                                                    <Log
                                                                                        scrCode={'P065'}
                                                                                        ParentId={DecPropID}
                                                                                        para={'PropertyID'}
                                                                                        masterPara={'MasterPropertyID'}
                                                                                        MstParentId={DecMPropID}
                                                                                        IsMaster={openPage === "MST-Property-Dash" ? true : false}
                                                                                        url={'Log/GetData_Property'}
                                                                                    />
                                                                                    :
                                                                                    showPage === 'PropertyTransactionLog' ?

                                                                                        <PropertyInvolvement
                                                                                            idColName={'MasterPropertyID'}
                                                                                            para={'PropertyID'}
                                                                                            url={''}
                                                                                            NameStatus={NameStatus}
                                                                                            IncNo={IncNo}
                                                                                            IncSta={IncSta}
                                                                                            incId={DecIncID}
                                                                                            scrCode={'P064'}
                                                                                            tabID={DecPropID}
                                                                                            IsMaster={openPage === "MST-Property-Dash" ? true : false}
                                                                                            masterID={DecMPropID}
                                                                                        />
                                                                                        :
                                                                                        <></>
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Property_Tabs