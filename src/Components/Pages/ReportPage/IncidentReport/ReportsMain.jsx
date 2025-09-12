import React from 'react'
import { useLocation } from 'react-router-dom';
import DailyEvent from './IncidentPrint/DailyEvent';
import { useState } from 'react';
import ReportSidebar from '../../../Inc/SidebarCom/ReportSidebar';

const ReportsMain = () => {

    const useQuery = () => new URLSearchParams(useLocation().search);     
    let openPage = useQuery().get('page');
    const [showPage, setShowPage] = useState('');

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <p className='text-center' style={{ color: 'rgb(39, 76, 119)' }}>
                                    <h5 className='mt-2'>
                                        <i className='fa fa-arrow-left'></i>
                                        <span className='p-2'>Select Reports From Left Console</span>
                                    </h5>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportsMain