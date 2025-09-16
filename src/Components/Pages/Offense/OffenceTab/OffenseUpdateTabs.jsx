import React, { useState, useEffect, useContext } from "react";
import BasicInformation from "./BasicInformation/BasicInformation";
import Home from "./Home/Home";
import { AgencyContext } from "../../../../Context/Agency/Index";
import { Decrypt_Id_Name, base64ToString } from "../../../Common/Utility";
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Tab from "../../../Utility/Tab/Tab";
import Log from "../../Log/Log";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { get_LocalStoreData } from "../../../../redux/actions/Agency";
import { fetchPostData } from "../../../hooks/Api";

const OffenceHomeTabs = () => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecOffID = 0
    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    let OffSta = query?.get('OffSta');
    let OffId = query?.get('OffId');
    let CrimeSta = query?.get('CrimeSta');
    var openPage = query?.get('page');

    if (!IncID) IncID = 0;
    else IncID = IncID;
    if (!OffId) OffId = 0;
    else DecOffID = parseInt(base64ToString(OffId));

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const { changesStatus, localStoreArray, countoff, countoffaduit, offenseCount, setOffenseCount, } = useContext(AgencyContext);

    const [ListData, setListData] = useState([]);
    const [status, setStatus] = useState()
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [offenceID, setOffenceID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [showOffPage, setshowOffPage] = useState('home');
    const [nibrsCode, setNibrsCode] = useState('');
    const [isCrimeExists, setIsCrimeExists] = useState(false);

    // const [nibrsCode, setNibrsCode] = useState('09C');

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreArray?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (OffSta === 'true' || OffSta === true) {
            setStatus(true);
        } else {
            setStatus(false);
        }

        if (CrimeSta) {
            setshowOffPage('CrimeInformation');

        } else {
            setshowOffPage('home');
        }
    }, [OffSta, CrimeSta])

    useEffect(() => {
        if (DecOffID) { get_List(DecOffID) }
    }, [DecOffID]);

    const get_List = (DecOffID) => {
        const val = { CrimeID: DecOffID, }
        fetchPostData('TabBasicInformation/CrimeInformation', val).then((res) => {
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
                <div className="col-12  inc__tabs">
                    {
                        !openPage && <Tab />
                    }
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card">
                            <div className="card-body">
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12  incident-tab">
                                        <ul className='nav nav-tabs'>
                                            <Link
                                                className={`nav-item ${showOffPage === 'home' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                to={`/Off-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${OffId}&OffSta=${OffSta}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showOffPage === 'home' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setshowOffPage('home') }}

                                            >
                                                {iconHome}
                                            </Link>
                                            <span
                                                className={`nav-item ${showOffPage === 'CrimeInformation' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                // to={`/Off-Home?IncId=${IncID}WVX?OffId=${OffId}`}
                                                style={{ color: showOffPage === 'CrimeInformation' ? 'Red' : offenseCount?.CrimeInfoCount != "0" ? 'blue' : '#000' }}
                                                // style={{ color: showOffPage === 'CrimeInformation' ? 'Red' : countoff === true ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setshowOffPage('CrimeInformation') }}

                                            >
                                                Crime Information
                                            </span>
                                            <span
                                                className={`nav-item ${showOffPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                // to={`/Off-Home?IncId=${IncID}WVX?OffId=${OffId}`} 
                                                // style={{ color: showOffPage === 'AuditLog' ? 'Red' : '#000' }}
                                                style={{ color: showOffPage === 'AuditLog' ? 'Red' : countoffaduit === true ? 'blue' : '#000' }}

                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setshowOffPage('AuditLog') }}

                                            >
                                                Audit Log
                                            </span>
                                        </ul>
                                    </div>
                                </div>
                                {
                                    showOffPage === 'home' ?
                                        <Home {...{ status, setStatus, offenceID, setOffenceID, get_List, nibrsCode, setNibrsCode, setshowOffPage, }} />
                                        :
                                        showOffPage === 'CrimeInformation' ?
                                            <BasicInformation {...{ ListData, loginPinID, loginAgencyID, offenceID, mainIncidentID, nibrsCode, setNibrsCode, }} />
                                            :
                                            showOffPage === 'AuditLog' ?
                                                <Log
                                                    ParentId={DecOffID}
                                                    scrCode={'O094'}
                                                    url={'Log/GetData_OffenseLog'}
                                                    para={'CrimeID'}
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
    )
}

export default OffenceHomeTabs
