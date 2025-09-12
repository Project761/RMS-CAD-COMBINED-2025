import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import FieldInterviewMainTab from '../../Utility/Tab/FieldInterviewMainTab';
import Home from './FieldInterviewTab/Home/Home';
import { base64ToString } from '../../Common/Utility';

const FieldInterview = () => {
    const [showIncPage, setShowIncPage] = useState('home');

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    let DecFiID = 0, DecIncID = 0;

    const query = useQuery();
    var IncID = query?.get("IncId");
    var FiID = query?.get("FiID");
    var FiSta = query?.get("FiSta");

    if (!FiID) { DecFiID = 0; }
    else { DecFiID = parseInt(base64ToString(FiID)); }

    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));

    return (
        <div className="section-body view_page_design pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    <FieldInterviewMainTab />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">
                            <div className="card-body" >
                                {
                                    showIncPage === 'home' ?
                                        <Home {...{ DecFiID, DecIncID }} />
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

export default FieldInterview