import React, { useContext } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import { useLocation } from 'react-router-dom'

const SubTab = ({ tabs, setShowPage, showPage, count, status }) => {

    const { changesStatus, inActiveStatus, tabCount, NameVictimCount, } = useContext(AgencyContext);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    return (
        <ul className="nav nav-tabs">
            {
                tabs?.map((tabs) => {
                    return (
                        <li key={tabs.tab} className='nav-item'>
                            <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`}
                                data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} style={{ color: NameVictimCount[tabs?.count] > 0 && 'blue' }} aria-current="page" onClick={() => {
                                    if (!changesStatus) setShowPage(tabs.path)
                                }
                                }
                                href={tabs.path}>
                                {tabs.tab}{`${NameVictimCount[tabs?.count] > 0 ? '(' + NameVictimCount[tabs?.count] + ')' : ''}`}
                                {
                                    status && !inActiveStatus ?
                                        <span>
                                            {tabs?.count === "GroupCount" ? count?.GroupCount : tabs?.count === "UnitCount" ? count?.UnitCount : tabs.count === "PersonnelCount" ? count?.PersonnelCount : tabs.count === "DivisionCount" ? count?.DivisionCount : tabs.count === "LoginCount" ? count?.LoginCount : tabs.count === "ShiftCount" ? count?.ShiftCount : tabs.count === "RankCount" ? count?.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
                                        </span>
                                        : ''
                                }
                            </a>
                        </li>
                    )
                }
                )}
        </ul>
    )
}

export default SubTab