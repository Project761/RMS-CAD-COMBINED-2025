import { useContext, useState, useEffect } from 'react'
import Home from './MissingPersonTab/Home/Home'
import { Link, useLocation, } from 'react-router-dom'
import { Decrypt_Id_Name, base64ToString } from '../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { AgencyContext } from '../../../Context/Agency/Index';
import NCIC from './MissingPersonTab/NCIC/NCIC';
import { Hobbies } from './MissingPersonTab/Hobbies/Hobbies';
import Jewellery from './MissingPersonTab/Jewellery/Jewellery';
import MedicalInformation from './MissingPersonTab/MedicalInformation/MedicalInformation';
import LastSeenInformation from './MissingPersonTab/LastSeenInformation/LastSeenInformation';
import PersonNotify from './MissingPersonTab/PersonNotify/PersonNotify';
import Involvement from './MissingPersonTab/Involvement/Involvement';
import MissingTab from '../../Utility/Tab/MissingTab';
import DentalInformation from './MissingPersonTab/DentalInformation/DentalInformation';
import Tab from '../../Utility/Tab/Tab';
import MissingPersonVehicle from './MissingPersonVehicle/MissingPersonVehicle';

const MissingPersonTab = () => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecMissPerID = 0, DecIncID = 0;
    const query = useQuery();
    let IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var MissVehID = query?.get("MissVehID");
    var MissPerPg = query?.get("MissPerPg");
    var openPage = query?.get('page');

    function isValidBase64(str) {
        const base64Pattern = /^[A-Za-z0-9+/=]+$/;
        return base64Pattern.test(str);
    }

    if (!MissPerId) {
        MissPerId = 0;
    } else {
        if (isValidBase64(MissPerId)) {
            try {
                let decodedString = atob(MissPerId);
                DecMissPerID = parseInt(decodedString, 10);
            } catch (error) {
                DecMissPerID = 0;
            }
        } else {
            DecMissPerID = 0;
        }
    }



    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));

    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const { changesStatus, tabCount, } = useContext(AgencyContext);
    const [status, setStatus] = useState();
    const [showIncPage, setShowIncPage] = useState('home');
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (IncSta === true || IncSta === 'true') { setStatus(true); }
        else { setStatus(false); }
        setShowIncPage('home');
    }, [IncSta]);

    useEffect(() => {
        if (MissPerPg) {
            setShowIncPage(MissPerPg);
        }
    }, [MissPerPg])



    useEffect(() => {
        if (MissPerSta === 'true' || MissPerSta === true) {
            setStatus(true);
        } else if (MissPerSta === 'false' || MissPerSta === false) {
            setStatus(false);
        }
        setShowIncPage('home');
    }, [MissPerSta, localStoreData]);


    return (
        <>
            <div className="section-body view_page_design pt-1 p-1 bt" >
                <div className="div">
                    <div className="col-12  inc__tabs">
                        {
                            !openPage && <Tab />
                        }
                    </div>
                    {/* <div className="col-12  inc__tabs">
                        <MissingTab />
                    </div> */}
                    <div className="dark-row" >
                        <div className="col-12 col-sm-12">
                            <div className="card Agency incident-card ">
                                <div className="card-body" >
                                    <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                        <div className="col-12   incident-tab">
                                            <ul className='nav nav-tabs'>
                                                <Link
                                                    className={`nav-item ${showIncPage === 'home' ? 'active' : ''} `}
                                                    to={changesStatus ? `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}` : `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${MissPerSta}&MissVehID=${MissVehID}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'home' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('home') }}
                                                >
                                                    {iconHome}
                                                </Link>
                                                <span
                                                    className={`nav-item ${showIncPage === 'NCIC' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'NCIC' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('NCIC') }}
                                                >
                                                    Other Info
                                                </span>
                                                <span
                                                    className={`nav-item ${showIncPage === 'MedicalInformation' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'MedicalInformation' ? 'Red' : tabCount?.MedicalInformation > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('MedicalInformation') }}
                                                >
                                                    Medical Info {`${tabCount?.MedicalInformation > 0 ? '(' + tabCount?.MedicalInformation + ')' : ''}`}
                                                </span>
                                                <span
                                                    className={`nav-item ${showIncPage === 'DentalInfo' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'DentalInfo' ? 'Red' : tabCount?.DentalInfo > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('DentalInfo') }}
                                                >
                                                    Dental Info {`${tabCount?.DentalInfo > 0 ? '(' + tabCount?.DentalInfo + ')' : ''}`}
                                                </span>
                                                <span
                                                    className={`nav-item ${showIncPage === 'Jewellery' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'Jewellery' ? 'Red' : tabCount?.MissingPersonJewellery > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('Jewellery') }}
                                                >
                                                    Jewellery {`${tabCount?.MissingPersonJewellery > 0 ? '(' + tabCount?.MissingPersonJewellery + ')' : ''}`}
                                                </span>
                                                {/* <span
                                                    className={`nav-item ${showIncPage === 'LastSeenInformation' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'LastSeenInformation' ? 'Red' : tabCount?.LastSeenInformation > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('LastSeenInformation') }}
                                                >
                                                    Last Seen Information {`${tabCount?.LastSeenInformation > 0 ? '(' + tabCount?.LastSeenInformation + ')' : ''}`}
                                                </span> */}
                                                <span
                                                    className={`nav-item ${showIncPage === 'Hobbies' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'Hobbies' ? 'Red' : tabCount?.MissingPersonHobbies > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('Hobbies') }}
                                                >
                                                    Last Seen, Hobbies & Associates Info {`${tabCount?.MissingPersonHobbies > 0 ? '(' + tabCount?.MissingPersonHobbies + ')' : ''}`}
                                                </span>




                                                <span
                                                    className={`nav-item ${showIncPage === 'PersonNotify' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'PersonNotify' ? 'Red' : tabCount?.PersonToBeNotified > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('PersonNotify') }}
                                                >
                                                    Associated & Reporting Persons Info {`${tabCount?.PersonToBeNotified > 0 ? '(' + tabCount?.PersonToBeNotified + ')' : ''}`}
                                                </span>
                                                <span
                                                    className={`nav-item ${showIncPage === 'MissingPersonVehicle' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'MissingPersonVehicle' ? 'Red' : tabCount?.PersonToBeNotified > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('MissingPersonVehicle') }}
                                                >
                                                    Missing Person Vehicle
                                                </span>
                                                <span
                                                    className={`nav-item ${showIncPage === 'Involvement' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'Involvement' ? 'Red' : '#000' }}

                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowIncPage('Involvement') }}
                                                >
                                                    Audit Log

                                                </span>


                                            </ul>
                                        </div>
                                    </div>
                                    {
                                        showIncPage === 'home' ?
                                            <Home {...{ DecMissPerID, DecIncID }} />
                                            :
                                            showIncPage === 'NCIC' ?
                                                <NCIC {...{ DecMissPerID, DecIncID }} />
                                                :
                                                showIncPage === 'Hobbies' ?
                                                    <Hobbies {...{ DecMissPerID, DecIncID }} />
                                                    :
                                                    showIncPage === 'Jewellery' ?
                                                        <Jewellery {...{ DecMissPerID, DecIncID }} />
                                                        :
                                                        showIncPage === 'MedicalInformation' ?
                                                            <MedicalInformation {...{ DecMissPerID, DecIncID }} />
                                                            :
                                                            showIncPage === 'DentalInfo' ?
                                                                <DentalInformation {...{ DecMissPerID, DecIncID }} />
                                                                :
                                                                showIncPage === 'LastSeenInformation' ?
                                                                    <LastSeenInformation {...{ DecMissPerID, DecIncID }} />
                                                                    :
                                                                    showIncPage === 'PersonNotify' ?
                                                                        <PersonNotify {...{ DecMissPerID, DecIncID }} />
                                                                        :
                                                                        showIncPage === 'MissingPersonVehicle' ?
                                                                            <MissingPersonVehicle {...{ DecMissPerID, DecIncID }} />
                                                                            :
                                                                            showIncPage === 'Involvement' ?
                                                                                <Involvement {...{ DecMissPerID, DecIncID }} />
                                                                                :
                                                                                <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MissingPersonTab