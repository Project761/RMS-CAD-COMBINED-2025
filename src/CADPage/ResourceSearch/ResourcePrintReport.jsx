import PropTypes from 'prop-types';

const ResourcePrintReport = (props) => {
    const { componentRef, resourceData, searchData } = props
    return (
        <>
            {
                resourceData ? (
                    <>
                        <div className="container" ref={componentRef}>
                            <div className="property-room px-3">
                                <div className="row">
                                    <div className="col-4 col-md-3 col-lg-2 mt-2">
                                        <div className="img-box" >
                                            <img src={searchData?.Agency_Photo} className='picture' style={{ width: '150px', height: '140px' }} alt="" />
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
                                        <p className="p-0 m-0 d-flex align-items-center">Unit Search Report</p>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <span className='text-end'>
                                                Total Data: {resourceData?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="table-responsive bb">
                                        <table className="table table-bordered">
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className='' style={{ width: '150px' }}>CAD Event #</th>
                                                    <th className='' style={{ width: '150px' }}>RMS Incident #</th>
                                                    <th className='' style={{ width: '150px' }}>Reported DT/TM</th>
                                                    <th className='' style={{ width: '150px' }}>Unit Type</th>
                                                    <th className='' style={{ width: '150px' }}>Unit #</th>
                                                    <th className='' style={{ width: '150px' }}>Status</th>
                                                    <th className='' style={{ width: '150px' }}>CFS Code</th>
                                                    <th className='' style={{ width: '150px' }}>Description</th>
                                                    <th className='' style={{ width: '150px' }}>Primary Officer</th>
                                                    <th className='' style={{ width: '150px' }}>Operator</th>
                                                    <th className='' style={{ width: '150px' }}>Zone</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {resourceData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.CADIncidentNumber}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.IncidentNumber}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.ReportedDate}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.ResourceTypeCode}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.ResourceNumber}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.status}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.CFSCODE}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.CADCFSCode_Description}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.primaryofficer}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.UserName}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.ZoneDescription}</td>
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

ResourcePrintReport.propTypes = {
  componentRef: PropTypes.object,
  resourceData: PropTypes.array,
  searchData: PropTypes.object
};

ResourcePrintReport.defaultProps = {
  componentRef: null,
  resourceData: [],
  searchData: {}
};

export default ResourcePrintReport