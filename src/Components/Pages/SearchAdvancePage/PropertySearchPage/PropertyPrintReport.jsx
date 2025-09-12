import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPostData } from '../../../hooks/Api';

const PropertyPrintReport = (props) => {
    const { componentRef, propertySearchData, searchData } = props


    return (
        <>

            {
                propertySearchData ? (
                    <>
                        <div className="container" ref={componentRef}>
                            <div className="property-room px-3">
                                <div className="row">
                                    <div className="col-4 col-md-3 col-lg-2 mt-2">
                                        <div className="img-box" >
                                            <img src={searchData.Agency_Photo} className='picture' style={{ width: '150px', height: '140px' }} />
                                        </div>
                                    </div>

                                    <div className="col-8 col-md-9 col-lg-10">
                                        <div className="row mt-3">
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Agency:</h6>
                                                <span>{searchData.Agency_Name}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Phone:</h6>
                                                <span>{searchData.Agency_Phone}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Fax:</h6>
                                                <span>{searchData.Agency_Fax}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Address:</h6>
                                                <span>{searchData.Agency_Address1}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="container" style={{ pageBreakAfter: 'always' }}>
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center ">
                                        <p className="p-0 m-0 d-flex align-items-center">Property Search Report</p>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <span className='text-end'>
                                                Total Data: {propertySearchData?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="table-responsive bb">
                                        <table className="table table-bordered">
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className='' style={{ width: '150px' }}>Incident No.</th>
                                                    <th className='' style={{ width: '150px' }}>Property No.</th>
                                                    <th className='' style={{ width: '150px' }}>Category</th>
                                                    <th className='' style={{ width: '150px' }}>Classfication</th>
                                                    <th className='' style={{ width: '150px' }}>LossCode</th>
                                                    <th className='' style={{ width: '150px' }}>Owner Name</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {propertySearchData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.IncidentNumber}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.PropertyNumber}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.Category_Description}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.Classification_Description}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.LossCode_Description}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.OwnerName}</td>
                                                    </tr>
                                                ))}
                                                {/* <tr>
                                                    <h4 colSpan="7" className='text-end '>Total Data: {propertySearchData?.length || 0}</h4>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
                    :
                    <></>
            }


        </>
    )
}

export default PropertyPrintReport