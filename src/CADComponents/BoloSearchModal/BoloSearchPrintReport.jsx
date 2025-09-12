import PropTypes from 'prop-types';

const BoloSearchPrintReport = (props) => {
    const { componentRef, boloSearchList, searchData } = props;

    return (
        <>
            {
                boloSearchList && boloSearchList.length > 0 ? (
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
                                <div style={{ pageBreakAfter: 'always' }}>
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center ">
                                        <p className="p-0 m-0 d-flex align-items-center">BOLO Search Report</p>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <span className='text-end'>
                                                Total Data: {boloSearchList?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="table-responsive ">
                                        <table className="table table-bordered">
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className='' style={{ width: '150px' }}>Date/Time</th>
                                                    <th className='' style={{ width: '150px' }}>Created By</th>
                                                    <th className='' style={{ width: '150px' }}>Type</th>
                                                    <th className='' style={{ width: '150px' }}>Disposition</th>
                                                    <th className='' style={{ width: '100px' }}>Priority</th>
                                                    <th className='' style={{ width: '150px' }}>CAD Event#</th>
                                                    <th className='' style={{ width: '200px' }}>Message</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {boloSearchList.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.CreatedDtTm}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.FullName}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.DispositionCode}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.Description}</td>
                                                        <td className='text-list' style={{ width: '100px' }}>{item?.Priority}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.IncidentNumber}</td>
                                                        <td className='text-list' style={{ width: '200px' }}>{item?.Message}</td>
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
    );
}

BoloSearchPrintReport.propTypes = {
    componentRef: PropTypes.object,  // Safe for optional ref prop
    boloSearchList: PropTypes.array, // Safe for optional array of results
    searchData: PropTypes.shape({
        Agency_Photo: PropTypes.string, // Optional string for image URL
        Agency_Name: PropTypes.string,  // Optional string
        Agency_Phone: PropTypes.string, // Optional string
        Agency_Fax: PropTypes.string,   // Optional string
        Agency_Address1: PropTypes.string, // Optional string
    }), // Safe for optional object structure
};

export default BoloSearchPrintReport;
