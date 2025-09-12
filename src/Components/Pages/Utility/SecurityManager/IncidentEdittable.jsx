import React from 'react'
import Select from "react-select";
import { customStylesWithOutColor } from '../../../Common/Utility';


const IncidentEdittable = () => {
    return (
    

            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row px-3"></div>
                                <div className="col-12">
                                    <div className="col-12 col-md-12  p-0" >
                                        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                                            <p className="p-0 m-0">Incident Editable</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6 col-md-6 col-lg-4 mt-2">
                                            <div className=" dropdown__box">
                                                <Select
                                                    name='OfficerName'
                                                    styles={customStylesWithOutColor}
                                                    isClearable
                                                    isMulti
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor="">Officer Name</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-6 col-md-6 col-lg-4 mt-2">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='PropertyAbandoned' id="flexCheckDefault" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    Reported Date/Time
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-6 col-md-6 col-lg-4 mt-2">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='PropertyAbandoned' id="flexCheckDefault1" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault1">
                                                    TIBRS Date/Time
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-4 mt-2">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='PropertyAbandoned' id="flexCheckDefault2" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                    FBI Code
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-4 mt-2">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='PropertyAbandoned' id="flexCheckDefault3" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault3">
                                                    RMS CFS Code/Description
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-4 mt-2">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='PropertyAbandoned' id="flexCheckDefault4" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault4">
                                                    Exceptional Clearance
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-4 mt-2">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='PropertyAbandoned' id="flexCheckDefault5" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault5">
                                                    How Reported
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >


       
    )
}

export default IncidentEdittable