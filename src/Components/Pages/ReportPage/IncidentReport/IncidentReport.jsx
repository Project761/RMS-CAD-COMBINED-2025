import React from 'react'
import { Link } from 'react-router-dom';
import IncidentReport_Add_Up from './IncidentReport_Add_Up'

const ReportPage = () => {      

    const columns = [
        {
            name: 'Property Ticket',
            selector: 'Property Ticket',
            sortable: true,      
        },
        {
            name: 'Property Type',
            selector: 'Property Type',
            sortable: true,
        },
        {
            name: 'Property Reason',
            selector: 'Property Reason',
            sortable: true,
        },
        {
            name: 'Description',
            selector: 'Description',
            sortable: true,
        },
        {
            name: 'Classification',
            selector: 'Classification',
            sortable: true,
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-edit"></i>
                </Link>
                <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-trash"></i>
                </Link>

            </>
        }
    ];

    const data = [
        {
            "Property Ticket": "Dev Test",
            "Property Type": "Vehicle",
            "Property Reason": "Dummy",
            "Description": "Desc Test",
            "Classification": "Testing",
        },
    ]
    
    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset className='fieldset'>
                                    <legend>Saved Report</legend>
                                    <div className="row">
                                        <div class="col-6 col-md-4 ">
                                            <div className="text-field">
                                                <input type="text" id='IncidentNumber' maxLength={8} name='IncidentNumber' className={''} />
                                                <label className=''>Save Report Name</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-8 pt-3 pl-4">
                                            <div className="row">
                                                <div className="form-check col-6 col-lg-3 ">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                        Private
                                                    </label>
                                                </div>
                                                <div className="form-check col-6 col-lg-3">
                                                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                        Public
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <IncidentReport_Add_Up />
        </>
    )
}

export default ReportPage