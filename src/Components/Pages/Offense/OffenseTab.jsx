import React from 'react'
import Tab from '../../Utility/Tab/Tab';
import Offense from './Offense';

const OffenseTab = () => {

    const [showPage, setShowPage] = React.useState('home');

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
                                            <Tab />
                                        </div>
                                    </div>
                                </div>
                                {
                                    showPage === 'home' ?
                                        <Offense />
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

export default OffenseTab