import React from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

const ReportPage_Add_Up = () => {

    // const columns = [
    //     {
    //         name: 'Incident No',
    //         selector: 'Incident No',
    //         sortable: true,
    //     },
    //     {
    //         name: 'Reported Date/Time',
    //         selector: 'Reported Date/Time',
    //         sortable: true,
    //     },
    //     {
    //         name: 'Occured Date/Time',
    //         selector: 'Occured Date/Time',
    //         sortable: true,
    //     },
    //     {
    //         name: 'BIBRS Date/Time',
    //         selector: 'BIBRS Date/Time',
    //         sortable: true,
    //     },
    //     {
    //         name: 'Classification',
    //         selector: 'Classification',
    //         sortable: true,
    //     },
    //     {
    //         name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
    //         cell: row => <>
    //             <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
    //                 <i className="fa fa-edit"></i>
    //             </Link>
    //             <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
    //                 <i className="fa fa-trash"></i>
    //             </Link>

    //         </>
    //     }

    // ];

    // const data = [
    //     {
    //         "Property Ticket": "Dev Test",
    //         "Property Type": "Vehicle",
    //         "Property Reason": "Dummy",
    //         "Description": "Desc Test",
    //         "Classification": "Testing",
    //     },
    // ]

    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ReportModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog  modal-xl" role="document" >
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Incident Report</legend>
                                    <div className="table-incident" >
                                        <table class="table ">
                                            <thead className='' style={{ background: '#000000d1', position: 'sticky', top: '0px', }}>
                                                <tr>
                                                    <th scope="col">Check Field</th>
                                                    <th>Incident Name</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ zIndex: '0px' }}>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Reported Date/Time</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Occured From Date/Time</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Occured to Date/Time</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Crime Location</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>RMS Disposition</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Disposition Date/Time</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Exceptional Clearance</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>CAD CFS Code</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>CAD Disposition</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Activity Details</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Role</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>User PIN</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Report Due</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Type Of Security</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Dispatch Date</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Dispatch Comments</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Narrative Type/Report Type</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Narrative Reported By</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <input type="checkbox" name="" id="" />
                                                    </td>
                                                    <td className='text-dark text-bold'>Narrative Date/Time</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right mr-2 mb-2">
                            <button type="button" className="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>


    )
}

export default ReportPage_Add_Up