import React, { useState } from 'react';
import { GangTabs } from '../../../../Utility/Tab/TabsArray'
import SubTab from '../../../../Utility/Tab/SubTab';
import Home from './GangTab/Home/Home';
import Member from './GangTab/Member/Member';
import GangNotes from './GangTab/GangNotes/GangNotes';
import Picture from './GangTab/Picture/Picture';
import AuditLog from './GangTab/AuditLog/AuditLog';
import RivalGang from './GangTab/RivalGang/RivalGang';

const GangAddUp = () => {

    const [showPage, setShowPage] = useState('home');
    return (

        <div className="section-body view_page_design pt-3">
            <div className="row clearfix" >
                <div className="col-12 col-sm-12">
                    <div className="card Agency">
                        <div className="card-body">
                            <div className="row  ">
                                <div className={`col-12 col-md-12`}>
                                    <div className="row">
                                        <div className="col-12 pl-3">
                                            <SubTab tabs={GangTabs} setShowPage={setShowPage} showPage={showPage} />
                                        </div>
                                    </div>
                                </div>
                                {
                                    showPage === 'home' ?
                                        <Home />
                                        :
                                        showPage === 'Member' ?
                                            <Member />
                                            :
                                            showPage === 'RivalGang' ?
                                                <RivalGang />
                                                :
                                                showPage === 'gangnotes' ?
                                                    <GangNotes />
                                                    :
                                                    showPage === 'Picture' ?
                                                        <Picture />
                                                        :
                                                        showPage === 'AuditLog' ?
                                                            <AuditLog />
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

export default GangAddUp