import PropTypes from 'prop-types';

const EventPrintReport = (props) => {
    const { componentRef, eventData, searchData } = props;
    
    if (!eventData) {
        return null;
    }

    return (
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
                        <p className="p-0 m-0 d-flex align-items-center">Event Search Report</p>
                        <div style={{ marginLeft: 'auto' }}>
                            <span className='text-end'>
                                Total Data: {eventData?.length || 0}
                            </span>
                        </div>
                    </div>
                    <div className="table-responsive bb">
                        <table className="table table-bordered">
                            <thead className='text-dark master-table'>
                                <tr>
                                    <th className='' style={{ width: '150px' }}>CAD Event #</th>
                                    <th className='' style={{ width: '150px' }}>RMS Incident #</th>
                                    <th className='' style={{ width: '150px' }}>Master Incident #</th>
                                    <th className='' style={{ width: '150px' }}>CFS Code</th>
                                    <th className='' style={{ width: '150px' }}>CFS Description</th>
                                    <th className='' style={{ width: '150px' }}>Location</th>
                                    <th className='' style={{ width: '150px' }}>Primary Officer</th>
                                    <th className='' style={{ width: '150px' }}>Disposition Code</th>
                                    <th className='' style={{ width: '150px' }}>Caller Name</th>
                                </tr>
                            </thead>
                            <tbody className='master-tbody'>
                                {eventData?.map((item) => (
                                    <tr key={`${item?.CADIncidentNumber || 'unknown'}-${item?.IncidentNumber || 'unknown'}`}>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.CADIncidentNumber}</td>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.IncidentNumber}</td>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.MasterIncidentNumber}</td>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.CFSCODE}</td>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.CADCFSCode_Description}</td>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.CrimeLocation}</td>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.primaryofficer}</td>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.DispositionCode}</td>
                                        <td className='text-list' style={{ width: '150px' }}>{item?.CallerName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

EventPrintReport.propTypes = {
    componentRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ]),
    eventData: PropTypes.arrayOf(PropTypes.shape({
        CADIncidentNumber: PropTypes.string,
        IncidentNumber: PropTypes.string,
        MasterIncidentNumber: PropTypes.string,
        CFSCODE: PropTypes.string,
        CADCFSCode_Description: PropTypes.string,
        CrimeLocation: PropTypes.string,
        primaryofficer: PropTypes.string,
        DispositionCode: PropTypes.string,
        CallerName: PropTypes.string
    })),
    searchData: PropTypes.shape({
        Agency_Photo: PropTypes.string,
        Agency_Name: PropTypes.string,
        Agency_Phone: PropTypes.string,
        Agency_Fax: PropTypes.string,
        Agency_Address1: PropTypes.string
    })
};

EventPrintReport.defaultProps = {
    componentRef: null,
    eventData: [],
    searchData: {}
};

export default EventPrintReport;