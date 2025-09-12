import React, { useState, useEffect,useContext } from 'react'
import ArrestMainTab from '../../../Utility/Tab/ArrestMainTab'
import { AgencyContext } from '../../../../Context/Agency/Index'
import { BookingTabs } from '../../../Utility/Tab/TabsArray'
import SubTab from '../../../Utility/Tab/SubTab'
import Home from './BookingTab/Home/Home'
import MedicalHistory from './BookingTab/MedicalHistory/MedicalHistory'
import Medication from './BookingTab/Medication/Medication'
import BailCondition from './BookingTab/BailCondition/BailCondition'
import Comments from './BookingTab/Comments/Comments'
import Condition from './BookingTab/Condition/Condition'
import Breathalyzer from './BookingTab/BreathalyzerDescription/Breathalyzer'
import BailInformation from './BookingTab/BailInformation/BailInformation'

const Booking = () => {
    
    const { updateCount } = useContext(AgencyContext)
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState(false)

    useEffect(() => {
        if (sessionStorage.getItem('ArrestID')) {
            setStatus(true)
        } else {
            setStatus(false)
        }
    }, [updateCount])


    return (
    
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3 mb-1 inc__tabs">
                                                <ArrestMainTab />
                                            </div>
                                            <div className="col-12 pl-3">
                                                <SubTab tabs={BookingTabs} setShowPage={setShowPage} showPage={showPage} status={status} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        showPage === 'home' ?
                                            <Home  />
                                            :
                                        showPage === 'MedicalHistory' ?
                                            <MedicalHistory  />
                                            :
                                        showPage === 'MedicalHistory' ?
                                            <MedicalHistory  />
                                            :
                                        showPage === 'Medication' ?
                                            <Medication  />
                                            :
                                        showPage === 'BailCondition' ?
                                            <BailCondition  />
                                            :
                                        showPage === 'Comment' ?
                                            <Comments  />
                                            :
                                        showPage === 'Condition' ?
                                            <Condition  />
                                            :
                                        showPage === 'BreathalyzerResult' ?
                                            <Breathalyzer  />
                                            :
                                        showPage === 'BailInformation' ?
                                            <BailInformation  />
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

export default Booking