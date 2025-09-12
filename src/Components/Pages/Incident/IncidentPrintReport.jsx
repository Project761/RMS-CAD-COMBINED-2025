import  {  useState } from 'react'
import { getShowingDateText } from '../../Common/Utility';

const IncidentPrintReport = (props) => {
    const { componentRef,  incidentSearchData, agencysingledata, multiImage } = props


    return (
        <>

            <>
                <div className="container" ref={componentRef}>
                    <div className="property-room px-3">
                        <div className="row">
                            <div className="col-4 col-md-3 col-lg-2 mt-2">
                                <div className="img-box" >
                                    <img src={multiImage} className='picture' style={{ width: '150px', height: '140px' }} />
                                </div>
                            </div>
                            <div className="col-8 col-md-9 col-lg-10">
                                <div className="row mt-3">
                                    <div className="col-7 d-flex justify-content-center">
                                        <h6>Agency:</h6>
                                        <span>{agencysingledata[0]?.Agency_Name || '-'}</span>
                                    </div>
                                    <div className="col-7 d-flex justify-content-center">
                                        <h6>Phone:</h6>
                                        <span>{agencysingledata[0]?.Agency_Phone || '-'}</span>
                                    </div>
                                    <div className="col-7 d-flex justify-content-center">
                                        <h6>Fax:</h6>
                                        <span>{agencysingledata[0]?.Agency_Fax || '-'}</span>
                                    </div>
                                    <div className="col-7 d-flex justify-content-center">
                                        <h6>Address:</h6>
                                        <span>{agencysingledata[0]?.Agency_Address1 || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="container" style={{ pageBreakAfter: 'always' }}>
                            <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center ">
                                <p className="p-0 m-0 d-flex align-items-center">Incident Search Report</p>
                                <div style={{ marginLeft: 'auto' }}>
                                    <span className='text-end'>
                                        Total Data: {incidentSearchData?.length || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="table-responsive bb">
                                <table className="table table-bordered">
                                    <thead className='text-dark master-table'>
                                        <tr>
                                            <th className='' style={{ width: '150px' }}>Incident Number</th>
                                            <th className='' style={{ width: '150px' }}>Offense</th>
                                            <th className='' style={{ width: '150px' }}>CAD CFS Code</th>
                                            <th className='' style={{ width: '150px' }}>Primary Officer</th>
                                            <th className='' style={{ width: '150px' }}>CAD Disposition</th>
                                            <th className='' style={{ width: '150px' }}>Reported Date/Time</th>
                                            {/* <th className='' style={{ width: '150px' }}>Arrestee Name</th> */}

                                        </tr>
                                    </thead>
                                    <tbody className='master-tbody'>
                                        {incidentSearchData?.map((item, index) => (
                                            <tr key={index}>
                                                <td className='text-list' style={{ width: '150px' }}>{item?.IncidentNumber}</td>
                                                <td className='text-list' style={{ width: '150px' }}>{item?.OffenseName_Description}</td>
                                                <td className='text-list' style={{ width: '150px' }}>{item?.CADCFSCode_Description}</td>
                                                <td className='text-list' style={{ width: '150px' }}>{item?.PrimaryOfficer}</td>
                                                <td className='text-list' style={{ width: '150px' }}>{item?.RMS_Disposition}</td>
                                                <td className='text-list' style={{ width: '150px' }}>{item?.ReportedDate && getShowingDateText(item?.ReportedDate)}</td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        </>
    )
}
export default IncidentPrintReport

