import React from 'react'
import { Link } from 'react-router-dom'

const PropertyReportSidebar = () => {
    return (
      
            <div className="row px-1">
                <div className="col-12">
                    <input type="text" className='form-control' placeholder='Search By Property...' />
                </div>
                <div className="col-12 " >
                    <ul className='mt-1' >
                        <li className="" >
                            <Link to={``}>
                                <span className="">Pawn Report</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={`/property-vehicle`}>
                                <span >Vehicle/Property Reoprt</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={``}>
                                <span >Vehicle Towing Report</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={``}>
                                <span >Gun Registration List</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to={``}>
                                <span >Property Inventory Report</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
      
    )
}

export default PropertyReportSidebar