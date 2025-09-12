import React from 'react'
import { Link } from 'react-router-dom'
import CommentsAddUp from './CommentsAddUp'

const Comments = () => {
    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Comments</p>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#ChargeCommentsModal">
                            <i className="fa fa-plus"></i>
                        </Link>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-12  mb-3">
                        <div className="table-responsive">
                            <table className="table">
                                <tr className="border-bottom">
                                    <th>comments</th>
                                    <th>date/time</th>
                                    <th>officer</th>
                                    <th className='text-right'>Action</th>
                                </tr>
                                <tr>
                                    <td>Testing </td>
                                    <td>08/05/23 </td>
                                    <td>Testing </td>
                                    <td className='text-right'>
                                        <Link to={''}>
                                            <button type='button' className="btn btn-sm bg-green text-white  py-0 " data-toggle="modal" data-target="#ChargeCommentsModal"><i className="fa fa-edit"></i>
                                            </button>
                                        </Link>
                                        <button type='button' className="btn btn-sm bg-green text-white py-0 ml-1"><i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <CommentsAddUp />
        </>
    )
}

export default Comments