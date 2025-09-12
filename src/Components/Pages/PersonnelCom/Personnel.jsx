import React from 'react'
import { Link } from 'react-router-dom';

const Personnel = () => {


    return (
        <div className="section-body view_page_design pt-3">
            <div className="row clearfix">
                <div className="col-12 col-sm-12">
                    <div className="card Agency">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 px-2">
                                    <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0">Personnel</p>
                                        <p className="p-0 m-0">
                                            <Link
                                                to=""
                                                className="text-white d-inline-block mr-2"
                                            >
                                                <i className="fa fa-print"></i>
                                            </Link>
                                            <Link to="" className="text-white"
                                                data-toggle="modal" data-target="modal-fullscreen-xl" >
                                                <i className="fa fa-plus"></i> New
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Personnel