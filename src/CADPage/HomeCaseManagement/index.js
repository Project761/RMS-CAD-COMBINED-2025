import React, { useState } from 'react'
import CriticalAlerts from './components/CriticalAlerts'
import WorkloadSnapshot from './components/WorkloadSnapshot'
import MyTasks from './components/MyTasks'
import TeamActivity from './components/TeamActivity'
import UrgentCaseLocations from './components/UrgentCaseLocations'
import MyCases from './components/MyCases'
import CaseNotes from './components/CaseNotes'

function HomeCaseManagement() {
    const [active, setActive] = useState('myCase')

    return (
        <div className="section-body view_page_design pt-1 p-1 bt cad-css">
            <div className="div">
                <div className="col-12 inc__tabs">
                    <div className='d-flex justify-content-between align-items-center mb-1'>
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <div
                                    className={`nav-link  ${active === `myCase` ? 'active' : ''}`}
                                    style={{ color: active === 'myCase' ? 'Red' : '#130e0e', fontWeight: '600' }}
                                    onClick={() => { setActive('myCase') }}
                                >
                                    My Case
                                </div>
                            </li>
                            <li className="nav-item" >
                                <div
                                    className={`nav-link  ${active === `caseNotes` ? 'active' : ''}`}
                                    style={{ color: active === 'caseNotes' ? 'Red' : '#130e0e', fontWeight: '600' }}
                                    onClick={() => { setActive('caseNotes') }}
                                >
                                    Case Notes & Intelligence
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="dark-row">
                    <div className="col-12">
                        <div className="card Agency incident-cards-agency">
                            <div className="card-body">
                                {active === 'myCase' && (
                                    <>
                                        <div className="mb-4">
                                            <h5 className="mb-3">Good Afternoon, Detective Lee. You have 3 critical items requiring attention.</h5>
                                            <CriticalAlerts />
                                        </div>
                                        <div className='row'>
                                            <div className="col-lg-8">
                                                <MyCases />
                                            </div>
                                            <div className="col-lg-4">
                                                <WorkloadSnapshot />
                                                <MyTasks />
                                                <TeamActivity />
                                                <UrgentCaseLocations />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {active === 'caseNotes' && <CaseNotes />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeCaseManagement