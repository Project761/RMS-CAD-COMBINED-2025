import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../Context/Agency/Index';
import SubTab from '../../../Utility/Tab/SubTab';
import { PersTabs } from '../../../Utility/Tab/TabsArray';
import Dates from '../PersTab/DatesMember/Dates';
import EffectiveFieldPermission from '../PersTab/EffectiveFieldPermission/EffectiveFieldPermission';
import Effectivepermission from '../PersTab/Effectivepermission/Effectivepermission';
import Emergency from '../PersTab/Emergency/Emergency';
import PersonnelGroup from '../PersTab/Group/PersonnelGroup';
import Home from '../PersTab/Home/Index';
import { Decrypt_Id_Name, base64ToString } from '../../../Common/Utility';
import TabAgency from '../../../Utility/Tab/TabAgency';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import AuditLog from '../PersTab/AuditLog/AuditLog';
import Certification from '../PersTab/Certification/Certification';
import TrainingCJISCompliance from '../PersTab/TrainingCJISCompliance/Index';

const PersonnelTab = () => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecPerId = 0, DecAgeID = 0;
    const query = useQuery();
    var Aid = query?.get("Aid");
    var ASta = query?.get("ASta");
    var perId = query?.get("perId");
    var perSta = query?.get("perSta");
    var AgyName = query?.get("AgyName");
    var ORINum = query?.get("ORINum");

    if (!Aid) DecAgeID = 0;
    else DecAgeID = base64ToString(Aid);

    if (!perId) perId = 0;
    else DecPerId = parseInt(base64ToString(perId));


    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const { changesStatus, get_CountList, count, countaduitprsonel } = useContext(AgencyContext)

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [showPagePersonnel, setShowPagePersonnel] = useState('home')
    const [personnelStatus, setPersonnelStatus] = useState(false)
    const [dobHireDate, setDobHireDate] = useState(false)
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (perSta === 'true' || perSta === true) {
            setPersonnelStatus(true);
        } else {
            setPersonnelStatus(false);
        }
        setShowPagePersonnel('home');
    }, [perSta])

    useEffect(() => {
        if (DecAgeID) { get_CountList(DecAgeID, DecPerId) }
    }, [Aid])



    return (
        <>
            <div className="section-body pt-1 p-1 bt" >
                <div className="div">
                    <div className="col-12  inc__tabs">
                        <TabAgency />
                    </div>
                    <div className="dark-row" >
                        <div className="col-12 col-sm-12">
                            <div className="card Agency incident-card ">
                                <div className="card-body" >
                                    <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                        <div className="col-12 name-tab">
                                            <ul className='nav nav-tabs'>
                                                <Link
                                                    className={`nav-item ${showPagePersonnel === 'home' ? 'active' : ''}`}
                                                    to={`/personnelTab?Aid=${Aid}&ASta=${ASta}&AgyName=${AgyName}&ORINum=${ORINum}&perId=${perId}&perSta=${perSta}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPagePersonnel === 'home' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowPagePersonnel('home') }}
                                                // onClick={() => {
                                                //     if (addUpdatePermission) {
                                                //         setShowPagePersonnel('home')
                                                //     } else {
                                                //         if (!changesStatus) setShowPagePersonnel('home')
                                                //     }
                                                // }}
                                                >
                                                    {iconHome}
                                                </Link>
                                                <span
                                                    className={`nav-item ${showPagePersonnel === 'group' ? 'active' : ''} ${!personnelStatus ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPagePersonnel === 'group' ? 'Red' : count?.GroupCount > 0 && personnelStatus ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowPagePersonnel('group') }}
                                                // onClick={() => {
                                                //     if (addUpdatePermission) {
                                                //         setShowPagePersonnel('group')
                                                //     } else {
                                                //         if (!changesStatus) setShowPagePersonnel('group')
                                                //     }
                                                // }}
                                                >
                                                    Group{personnelStatus && count?.GroupCount > 0 ? '(' + count?.GroupCount + ')' : ''}
                                                </span>
                                                <span
                                                    className={`nav-item ${showPagePersonnel === 'Emergency' ? 'active' : ''} ${!personnelStatus ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPagePersonnel === 'Emergency' ? 'Red' : count?.EmergencyCount > 0 && personnelStatus ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowPagePersonnel('Emergency') }}
                                                // onClick={() => {
                                                //     if (addUpdatePermission) {
                                                //         setShowPagePersonnel('Emergency')
                                                //     } else {
                                                //         if (!changesStatus) setShowPagePersonnel('Emergency')
                                                //     }
                                                // }}
                                                >
                                                    Emergency Contact{personnelStatus && count?.EmergencyCount > 0 ? '(' + count?.EmergencyCount + ')' : ''}
                                                </span>
                                                <span
                                                    className={`nav-item ${showPagePersonnel === 'effective screen permission' ? 'active' : ''} ${!personnelStatus ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPagePersonnel === 'effective screen permission' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowPagePersonnel('effective screen permission') }}
                                                // onClick={() => {
                                                //     if (addUpdatePermission) {
                                                //         setShowPagePersonnel('effective screen permission')
                                                //     } else {
                                                //         if (!changesStatus) setShowPagePersonnel('effective screen permission')
                                                //     }
                                                // }}
                                                >
                                                    Effective Screen Permission
                                                </span>
                                                <span
                                                    className={`nav-item ${showPagePersonnel === 'Training & CJIS Compliance' ? 'active' : ''} ${!personnelStatus ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPagePersonnel === 'Training & CJIS Compliance' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowPagePersonnel('Training & CJIS Compliance') }}
                                                // onClick={() => {
                                                //     if (addUpdatePermission) {
                                                //         setShowPagePersonnel('Training & CJIS Compliance')
                                                //     } else {
                                                //         if (!changesStatus) setShowPagePersonnel('Training & CJIS Compliance')
                                                //     }
                                                // }}
                                                >
                                                    Training & CJIS Compliance
                                                </span>
                                                <span
                                                    className={`nav-item ${showPagePersonnel === 'audit log' ? 'active' : ''} ${!personnelStatus ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    // style={{ color: showPagePersonnel === 'audit log' ? 'Red' : '#000' }}
                                                    style={{ color: showPagePersonnel === 'audit log' ? 'Red' : countaduitprsonel === true ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowPagePersonnel('audit log') }}
                                                // onClick={() => {
                                                //     if (addUpdatePermission) {
                                                //         setShowPagePersonnel('audit log')
                                                //     } else {
                                                //         if (!changesStatus) setShowPagePersonnel('audit log')
                                                //     }
                                                // }}
                                                >
                                                    Audit log
                                                </span>
                                                <span
                                                    className={`nav-item ${showPagePersonnel === 'certification' ? 'active' : ''} ${!personnelStatus ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showPagePersonnel === 'certification' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!changesStatus) setShowPagePersonnel('certification') }}
                                                >
                                                    Certification
                                                </span>
                                            </ul>
                                        </div>
                                    </div>
                                    {
                                        showPagePersonnel === 'home' ?
                                            <Home {...{ setDobHireDate, setaddUpdatePermission }} />
                                            :
                                            showPagePersonnel === 'effective screen permission' ?
                                                <Effectivepermission {...{ setaddUpdatePermission }} />
                                                :
                                                showPagePersonnel === 'group' ?
                                                    <PersonnelGroup {...{ setaddUpdatePermission }} />
                                                    :
                                                    showPagePersonnel === 'Training & CJIS Compliance' ?
                                                        <TrainingCJISCompliance />
                                                        :
                                                        showPagePersonnel === 'Emergency' ?
                                                            <Emergency {...{ setaddUpdatePermission }} />
                                                            :
                                                            showPagePersonnel === 'certification' ?
                                                                <Certification /> :
                                                                showPagePersonnel === 'audit log' ?
                                                                    <AuditLog {...{}} />
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

export default PersonnelTab