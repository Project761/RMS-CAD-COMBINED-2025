import React from 'react'

function CertificationPrintReport(props) {
    const { componentRef, data, searchData } = props
    const dropDownData = [{ label: "Low", value: 1 }, { label: "Medium", value: 2 }, { label: "High", value: 3 }]
    return (
        <>
            {
                data ? (
                    <>
                        <div className="container" ref={componentRef}>
                            <div className="property-room px-3">
                                <div className="row">
                                    <div className="col-4 col-md-3 col-lg-2 mt-2">
                                        <div className="img-box" >
                                            <img src={searchData?.Agency_Photo} className='picture' style={{ width: '150px', height: '140px' }} />
                                        </div>
                                    </div>
                                    <div className="col-8 col-md-9 col-lg-10">
                                        <div className="row mt-3">
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Agency:</h6>
                                                <span>{searchData?.Agency_Name}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Phone:</h6>
                                                <span>{searchData?.Agency_Phone}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Fax:</h6>
                                                <span>{searchData?.Agency_Fax}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Address:</h6>
                                                <span>{searchData?.Agency_Address1}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="container" style={{ pageBreakAfter: 'always' }}>
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center ">
                                        <p className="p-0 m-0 d-flex align-items-center">Event Search Report</p>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <span className='text-end'>
                                                Total Data: {data?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="table-responsive bb">
                                        <table className="table table-bordered">
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className='' style={{ width: '150px' }}>PIN</th>
                                                    <th className='' style={{ width: '150px' }}>Last Name</th>
                                                    <th className='' style={{ width: '150px' }}>First Name</th>
                                                    <th className='' style={{ width: '150px' }}>Middle Name</th>
                                                    <th className='' style={{ width: '150px' }}>Gender</th>
                                                    <th className='' style={{ width: '150px' }}>Priviledge Indicators</th>
                                                    <th className='' style={{ width: '150px' }}>Authenticator Assurance Level</th>
                                                    <th className='' style={{ width: '150px' }}>Federation Assurance Level</th>
                                                    <th className='' style={{ width: '150px' }}>Identity Assurance Level</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {data?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.PIN}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.LastName}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.FirstName}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.MiddleName}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.Gender}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.SelectedColumns}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{dropDownData?.find((i) => item.AuthenticatorAssuranceLevel === i.value)?.label}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{dropDownData?.find((i) => item.FederationAssuranceLevel === i.value)?.label}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{dropDownData?.find((i) => item.IdentityAssuranceLevel === i.value)?.label}</td>
                                                    </tr>
                                                ))}
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

export default CertificationPrintReport