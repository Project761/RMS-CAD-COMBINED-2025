import React from 'react'
import { Link } from 'react-router-dom'

const ArrestReportSidebar = () => {
    return (

        <div className="row px-1">
            <div className="col-12">
                <input type="text" className='form-control' placeholder='Search By Arrest...' />
            </div>
            <div className="col-12 " >
                <ul className='mt-1' >
                    <li className="" >
                        <Link to={`/arrest-charge`}>
                            <span className="">Arrest By Charge</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to={``}>
                            <span >Arrest By Incident</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to={``}>
                            <span >Arrest List Report</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to={``}>
                            <span >Arrest Monthly Report</span>
                        </Link>
                    </li>
                    <li className="">
                        <Link to={``}>
                            <span >Arrest Rap Sheet</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>

    )
}

export default ArrestReportSidebar