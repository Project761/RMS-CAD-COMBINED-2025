import React from 'react'
import { Link } from 'react-router-dom'

const IncidentReportSidebar = () => {

    return (
     
            <div className="row px-1">
                <div className="col-12">
                    <input type="text" className='form-control' placeholder='Search By Incident...' />
                </div>
                <div className="col-12 " >
                        <ul className='mt-1' >
                            <li className="" >
                                <Link to={`/incident-DailyEvent`}>        
                                    <span className="">Daily Event Log</span>
                                </Link>
                            </li>
                            <li className="">
                                <Link to={``}>
                                    <span >Incident Frequency Report</span>
                                </Link>
                            </li>
                            <li className="">
                                <Link to={`/incident-Location`}>
                                    <span >Incident By Location</span>
                                </Link>
                            </li>
                            <li className="">
                                <Link to={`/incident-Master`}>
                                    <span >Incident Master Report</span>
                                </Link>
                            </li>
                            <li className="">
                                <Link to={`/incident-Monthly`}>
                                    <span >Incidents Monthly</span>
                                </Link>
                            </li>
                        </ul>
                </div>
            </div>
      
    )
}

export default IncidentReportSidebar