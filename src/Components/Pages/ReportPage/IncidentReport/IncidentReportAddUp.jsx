import React from 'react'

const ReportPageAddUp = () => {
  

    return (
       
            <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ReportModal" tabindex="-1"  aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog  modal-xl">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Incident Report</legend>
                                    <div className="table-incident" >
                                        <table className="table ">
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
                            <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </dialog>
      

        
    )
}

export default ReportPageAddUp