import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../Context/Agency/Index';
import SubTab from '../../../Utility/Tab/SubTab';
import { AgencyTabs } from '../../../Utility/Tab/TabsArray';
import Division from '../AgencyTab/Division/Division';
import FieldSecurity from '../AgencyTab/FieldSecurity/FieldSecurity';
import Group from '../AgencyTab/Group/Group';
import Home from '../AgencyTab/Home/Index';
import LockRestrictLevel from '../AgencyTab/LockRestrictLevel/LockRestrictLevel';
import Login from '../AgencyTab/Login/Login';
import Member from '../AgencyTab/Member/Member';
import PasswordSetting from '../AgencyTab/PasswordSetting/PasswordSetting';
import Personnel from '../AgencyTab/Personnel/Personnel';
import Ranks from '../AgencyTab/Ranks/Ranks';
import Roster from '../AgencyTab/Roster/Roster';
import ScreenPermission from '../AgencyTab/ScreenPermission/ScreenPermission';
import Shift from '../AgencyTab/Shift/Shift';
import Unit from '../AgencyTab/Unit/Unit';
import UnitAssignment from '../AgencyTab/UnitAssignment/UnitAssignment';
import AgencyContact from '../AgencyTab/AgencyContact/AgencyConatct';
import { Decrypt_Id_Name, base64ToString } from '../../../Common/Utility';
import AgencySetting from '../AgencyTab/AgencySetting/AgencySetting';
import PersonnelTab from '../../PersonnelCom/PersonnelModal/PersonnelTab';
import TabAgency from '../../../Utility/Tab/TabAgency';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import AuditLog from '../AgencyTab/AgencyLog/AuditLog';
import NotificationManagement from '../AgencyTab/NotificationManagement/NotificationManagement';
import Training from '../AgencyTab/Training/Training';
import ReportWorkflow from '../../../../CADComponents/AgencyComponents/ReportWorkflow';

const AgencyTab = ({ send_Notification }) => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };


    const query = useQuery();
    var AId = query?.get("Aid");
    var AgySta = query?.get("ASta");
    var AgyName = query?.get("AgyName");
    var ORINum = query?.get("ORINum");


    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const { count, changesStatus, countoffaduitAgency } = useContext(AgencyContext);

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [pinID, setPinID] = useState();
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState();
    const [allowMultipleLogin, setAllowMultipleLogin] = useState('');


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (AgySta === true || AgySta === 'true') { setStatus(true); }
        else { setStatus(false); }
        setShowPage('home');
    }, [AgySta]);


    return (
        <div className="section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    <TabAgency />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-cards-agency">
                            <div className="card-body" >
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12 name-tab">
                                        <ul className='nav nav-tabs'>
                                            <Link
                                                className={`nav-item ${showPage === 'home' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                to={`/agencyTab?Aid=${AId}&ASta=${AgySta}&AgyName=${AgyName}&ORINum=${ORINum}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('home') }}


                                            >
                                                {iconHome}
                                            </Link>
                                            <span
                                                className={`nav-item ${showPage === 'Group' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Group' ? 'Red' : count?.GroupCount > 0 && status ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('Group') }}


                                            >
                                                Group{count?.GroupCount > 0 && status ? '(' + count?.GroupCount + ')' : ''}
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'member' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'member' ? 'Red' : count?.member > 0 && status ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('member') }}

                                            >
                                                Group Member{count?.member > 0 && status ? '(' + count?.member + ')' : ''}
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'screenpermission' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'screenpermission' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('screenpermission') }}

                                            >
                                                Screen Permission
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'PasswordSetting' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'PasswordSetting' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('PasswordSetting') }}

                                            >
                                                Password Setting
                                            </span>
                                            {/* <span
                                                className={`nav-item ${showPage === 'ShiftA' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'ShiftA' ? 'Red' : count?.ShiftCount > 0 && status ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('ShiftA') }}

                                            >
                                                Shift{count?.ShiftCount > 0 && status ? '(' + count?.ShiftCount + ')' : ''}
                                            </span> */}
                                            <span
                                                className={`nav-item ${showPage === 'AgencyContact' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'AgencyContact' ? 'Red' : count?.AgencyContactCount > 0 && status ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('AgencyContact') }}

                                            >
                                                Agency Contact{count?.AgencyContactCount > 0 && status ? '(' + count?.AgencyContactCount + ')' : ''}
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'AgencySetting' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'AgencySetting' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('AgencySetting') }}

                                            >
                                                Agency Setting
                                            </span>
                                            {/* <span
                                                className={`nav-item ${showPage === 'Division' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Division' ? 'Red' : count?.DivisionCount > 0 && status ? 'blue' : '#000' }}

                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('Division') }}

                                            >
                                                Division{count?.DivisionCount > 0 && status ? '(' + count?.DivisionCount + ')' : ''}
                                            </span> */}
                                            {/* <span
                                                className={`nav-item ${showPage === 'Unit' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Unit' ? 'Red' : count?.UnitCount > 0 && status ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('Unit') }}

                                            >
                                                Unit{count?.UnitCount > 0 && status ? '(' + count?.UnitCount + ')' : ''}
                                            </span> */}
                                            {/* <span
                                                className={`nav-item ${showPage === 'UnitAssignment' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'UnitAssignment' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('UnitAssignment') }}

                                            >
                                                Unit Assignment
                                            </span> */}
                                            {/* <span
                                                className={`nav-item ${showPage === 'roster' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'roster' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('roster') }}

                                            >
                                                Roster
                                            </span> */}
                                            {/* <span
                                                className={`nav-item ${showPage === 'Ranks' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}

                                                style={{ color: showPage === 'Ranks' ? 'Red' : count?.RankCount > 0 && status ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('Ranks') }}

                                            >
                                                Ranks{count?.RankCount > 0 && status ? '(' + count?.RankCount + ')' : ''}
                                            </span> */}
                                            <span
                                                className={`nav-item ${showPage === 'Training' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Training' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('Training') }}

                                            >
                                                Training
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'NotificationManagement' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'NotificationManagement' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('NotificationManagement') }}
                                            >
                                                Notification Management
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'AuditLog' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}

                                                style={{ color: showPage === 'AuditLog' ? 'Red' : countoffaduitAgency === true ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('AuditLog') }}

                                            >
                                                Audit Log
                                            </span>
                                            <span
                                                className={`nav-item ${showPage === 'report-workFlow' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}

                                                style={{ color: showPage === 'report-workFlow' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowPage('report-workFlow') }}

                                            >
                                                Report Workflow
                                            </span>
                                        </ul>
                                    </div>
                                </div>
                                {
                                    showPage === 'home' ?
                                        <Home {...{ send_Notification, allowMultipleLogin }} />
                                        :
                                        showPage === 'Group' ?
                                            <Group {...{ allowMultipleLogin, }} />
                                            :
                                            showPage === 'PasswordSetting' ?
                                                <PasswordSetting {...{ allowMultipleLogin, }} />
                                                :
                                                showPage === 'member' ?
                                                    <Member {...{ allowMultipleLogin, }} />
                                                    :
                                                    showPage === 'screenpermission' ?
                                                        <ScreenPermission {...{ allowMultipleLogin, }} />
                                                        :
                                                        showPage === 'ShiftA' ?
                                                            <Shift {...{ AId, pinID, }} />
                                                            :
                                                            showPage === 'AgencyContact' ?
                                                                <AgencyContact {...{}} />
                                                                :
                                                                showPage === 'AgencySetting' ?
                                                                    <AgencySetting {...{}} />
                                                                    :
                                                                    showPage === 'Division' ?
                                                                        <Division {...{}} />
                                                                        :
                                                                        showPage === 'UnitAssignment' ?
                                                                            <UnitAssignment {...{}} />
                                                                            :
                                                                            showPage === 'Unit' ?
                                                                                <Unit {...{}} />
                                                                                :
                                                                                showPage === 'roster' ?
                                                                                    <Roster {...{}} />
                                                                                    :
                                                                                    showPage === 'Ranks' ?
                                                                                        <Ranks />
                                                                                        : showPage === 'NotificationManagement' ?
                                                                                            <NotificationManagement />
                                                                                            :
                                                                                            showPage === 'Training' ?
                                                                                                <Training {...{}} />
                                                                                                :
                                                                                                showPage === 'AuditLog' ?
                                                                                                    <AuditLog />
                                                                                                    :
                                                                                                    showPage === 'report-workFlow' ?
                                                                                                        <ReportWorkflow />
                                                                                                        : ''
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>


    )
}

export default AgencyTab