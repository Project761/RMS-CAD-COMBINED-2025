import React from 'react'
import { Link } from 'react-router-dom'

const NameReportSidebar = () => {

    return (

        <div className="row px-1">
            <div className="col-12">
                <input type="text" className='form-control' placeholder='Search By Name...' />
            </div>
            <div className="col-12 " >
                <ul className='mt-1' >
                    <li className="" >
                        <Link to={`/name-history`}>
                            <span className="">Address History</span>
                        </Link>
                    </li>
                    <li className="" >
                        <Link to={`/name-information`}>
                            <span className="">Name Information  Report</span>
                        </Link>
                    </li>

                </ul>
            </div>
        </div>

    )
}

export default NameReportSidebar