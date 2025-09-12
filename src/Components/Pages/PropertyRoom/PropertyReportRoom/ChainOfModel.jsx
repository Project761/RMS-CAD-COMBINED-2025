import React from 'react'
import defualtImage from '../../../../img/uploadImage.png';

const ChainOfModel = (props) => {

  const { componentRefnew, chainreport } = props



  if (!chainreport) {
    return null; // or a loading spinner or placeholder content
  }




  return (
    <>
      <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ChainCustodyModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
        <div className="modal-dialog modal-xl rounded modal-dialog-scrollable">
          <div className="modal-content">
            <button type="button" className="border-0" aria-label="Close" data-dismiss="modal" style={{ alignSelf: "end" }} ><b>X
            </b>
            </button>
            <div className="modal-body ">
              <div classNameName="col-12 col-md-12 col-lg-12 " style={{ marginTop: '-15px' }}>
                <fieldset >
                  <legend className='prop-legend'>Chain Of Custody Report</legend>
                  <div classNameName="row " >
                    <div className="container" ref={componentRefnew}>
                      <div className="property-room px-3">
                        <div className="row">
                          <div className="col-4 col-md-3 col-lg-2 mt-2">
                            <div className="img-box" >
                              <img src={chainreport?.Agency_Photo} className='picture' style={{ width: '150px', height: '140px' }} />
                            </div>
                          </div>
                          <div className="col-8 col-md-9 col-lg-10">
                            <div className="row mt-3">
                              <div className="col-7 d-flex justify-content-center">
                                <h6>Agency:</h6>
                                <span>{chainreport.Agency_Name}</span>
                              </div>
                              <div className="col-7 d-flex justify-content-center">
                                <h6>Phone:</h6>
                                <span>{chainreport.Agency_Phone}</span>
                              </div>
                              <div className="col-7 d-flex justify-content-center">
                                <h6>Fax:</h6>
                                <span>{chainreport.Agency_Fax}</span>
                              </div>
                              <div className="col-7 d-flex justify-content-center">
                                <h6>Address:</h6>
                                <span>{chainreport.Agency_Address1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <hr />
                      {/* Article info */}
                      {chainreport.Property[0].Type === 'Article' && (
                        <>
                          <div className="property-info px-0">
                            <fieldset>
                              <legend className='prop-legend px-0'>Evidence Property Information</legend>
                              <table className="table table-bordered mt-3">
                                <tbody>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Property No:</span>
                                      <p>{chainreport.Property[0].PropertyNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Property Type:</span>
                                      <p>{chainreport.Property[0].Type}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Reported Date:</span>
                                      <p>{chainreport.Property[0].ReportedDtTm}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Incident No:</span>
                                      <p>{chainreport.Property[0].IncidentNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Loss Code:</span>
                                      <p>{chainreport.Property[0].LossCode_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Owner Name:</span>
                                      <p>{chainreport.Property[0].OwnerDescription || 'N/A'}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Category:</span>
                                      <p>{chainreport.Property[0].Category_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Classification:</span>
                                      <p>{chainreport.Property[0].Classification_Description || 'N/A'}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Brand:</span>
                                      <p>{chainreport.Property[0].Brand}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Top Color:</span>
                                      <p>{chainreport.Property[0].TopColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Bottom Color:</span>
                                      <p>{chainreport.Property[0].BottomColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Quantity:</span>
                                      <p>{chainreport.Property[0].Quantity}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell" colSpan="3">
                                      <span className='prop-td'>Misc Description:</span>
                                      <p>{chainreport.Property[0].Description}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                          <div className="release-info">
                            <fieldset>
                              <legend className='prop-legend'>Chain Of Custody Information</legend>
                              <table className="table table-bordered mt-3">
                                <thead className='text-dark master-table'>
                                  <tr>
                                    <th className=''>Incident No.</th>
                                    <th className=''>Activity Date/Time</th>
                                    <th className=''>Activity Type</th>
                                    <th className=''>Officer</th>
                                    <th className=''>Property Room Person</th>
                                    <th className=''>Location/Reason</th>
                                    <th className=''>Destroyed Date/Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {chainreport.PropertyRoom.map((item, index) => (
                                    <tr key={index}>
                                      <td className='text-list'>{item.IncidentNumber1}</td>
                                      <td className='text-list'>{item.ChainDate || 'N/A'}</td>
                                      <td className='text-list'>{item.ActivityReason_Des}</td>
                                      <td className='text-list'>{item.Officer_Name}</td>
                                      <td className='text-list'>{item.PropertyRoomPerson_Name || 'N/A'}</td>
                                      <td className='text-list'>{item.location || 'N/A'}</td>
                                      <td className='text-list'>{item.DestroyDate || 'N/A'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                        </>

                      )}

                      {/* Boat info */}

                      {chainreport.Property[0].Type === 'Boat' && (
                        <>
                          <div className="property-info px-0">
                            <fieldset>
                              <legend className='prop-legend px-0'>Evidence Property Information</legend>
                              <table className="table table-bordered mt-3">
                                <tbody>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Property No:</span>
                                      <p>{chainreport.Property[0].PropertyNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Property Type:</span>
                                      <p>{chainreport.Property[0].Type}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Reported Date:</span>
                                      <p>{chainreport.Property[0].ReportedDtTm}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Incident No:</span>
                                      <p>{chainreport.Property[0].IncidentNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Loss Code:</span>
                                      <p>{chainreport.Property[0].LossCode_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Owner Name:</span>
                                      <p>{chainreport.Property[0].OwnerDescription || 'N/A'}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Category:</span>
                                      <p>{chainreport.Property[0].Category_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Classification:</span>
                                      <p>{chainreport.Property[0].Classification_Description || 'N/A'}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Brand:</span>
                                      <p>{chainreport.Property[0].Brand}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Top Color:</span>
                                      <p>{chainreport.Property[0].TopColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Bottom Color:</span>
                                      <p>{chainreport.Property[0].BottomColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Quantity:</span>
                                      <p>{chainreport.Property[0].Quantity}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell" colSpan="3">
                                      <span className='prop-td'>Misc Description:</span>
                                      <p>{chainreport.Property[0].Description}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                          <div className="release-info">
                            <fieldset>
                              <legend className='prop-legend'>Chain Of Custody Information</legend>
                              <table className="table table-bordered mt-3">
                                <thead className='text-dark master-table'>
                                  <tr>
                                    <th className=''>Incident No.</th>
                                    <th className=''>Activity Date/Time</th>
                                    <th className=''>Activity Type</th>
                                    <th className=''>Officer</th>
                                    <th className=''>Property Room Person</th>
                                    <th className=''>Location/Reason</th>
                                    <th className=''>Destroyed Date/Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {chainreport.PropertyRoom.map((item, index) => (
                                    <tr key={index}>
                                      <td className='text-list'>{item.IncidentNumber1}</td>
                                      <td className='text-list'>{item.ChainDate || 'N/A'}</td>
                                      <td className='text-list'>{item.ActivityReason_Des}</td>
                                      <td className='text-list'>{item.Officer_Name}</td>
                                      <td className='text-list'>{item.PropertyRoomPerson_Name || 'N/A'}</td>
                                      <td className='text-list'>{item.location || 'N/A'}</td>
                                      <td className='text-list'>{item.DestroyDate || 'N/A'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                        </>

                      )}

                      {/* Drug info */}

                      {chainreport.Property[0].Type === 'Drug' && (
                        <>
                          <div className="property-info px-0">
                            <fieldset>
                              <legend className='prop-legend px-0'>Evidence Property Information</legend>
                              <table className="table table-bordered mt-3">
                                <tbody>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Property No:</span>
                                      <p>{chainreport.Property[0].PropertyNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Property Type:</span>
                                      <p>{chainreport.Property[0].Type}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Reported Date:</span>
                                      <p>{chainreport.Property[0].ReportedDtTm}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Incident No:</span>
                                      <p>{chainreport.Property[0].IncidentNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Loss Code:</span>
                                      <p>{chainreport.Property[0].LossCode_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Owner Name:</span>
                                      <p>{chainreport.Property[0].OwnerDescription || 'N/A'}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Category:</span>
                                      <p>{chainreport.Property[0].Category_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Classification:</span>
                                      <p>{chainreport.Property[0].Classification_Description || 'N/A'}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Brand:</span>
                                      <p>{chainreport.Property[0].Brand}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Top Color:</span>
                                      <p>{chainreport.Property[0].TopColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Bottom Color:</span>
                                      <p>{chainreport.Property[0].BottomColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Quantity:</span>
                                      <p>{chainreport.Property[0].Quantity}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell" colSpan="3">
                                      <span className='prop-td'>Misc Description:</span>
                                      <p>{chainreport.Property[0].Description}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                          <div className="release-info">
                            <fieldset>
                              <legend className='prop-legend'>Chain Of Custody Information</legend>
                              <table className="table table-bordered mt-3">
                                <thead className='text-dark master-table'>
                                  <tr>
                                    <th className=''>Incident No.</th>
                                    <th className=''>Activity Date/Time</th>
                                    <th className=''>Activity Type</th>
                                    <th className=''>Officer</th>
                                    <th className=''>Property Room Person</th>
                                    <th className=''>Location/Reason</th>
                                    <th className=''>Destroyed Date/Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {chainreport.PropertyRoom.map((item, index) => (
                                    <tr key={index}>
                                      <td className='text-list'>{item.IncidentNumber1}</td>
                                      <td className='text-list'>{item.ChainDate || 'N/A'}</td>
                                      <td className='text-list'>{item.ActivityReason_Des}</td>
                                      <td className='text-list'>{item.Officer_Name}</td>
                                      <td className='text-list'>{item.PropertyRoomPerson_Name || 'N/A'}</td>
                                      <td className='text-list'>{item.location || 'N/A'}</td>
                                      <td className='text-list'>{item.DestroyDate || 'N/A'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                        </>

                      )}
                      {/* Other info */}

                      {chainreport.Property[0].Type === 'Other' && (
                        <>
                          <div className="property-info px-0">
                            <fieldset>
                              <legend className='prop-legend px-0'>Evidence Property Information</legend>
                              <table className="table table-bordered mt-3">
                                <tbody>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Property No:</span>
                                      <p>{chainreport.Property[0].PropertyNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Property Type:</span>
                                      <p>{chainreport.Property[0].Type}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Reported Date:</span>
                                      <p>{chainreport.Property[0].ReportedDtTm}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Incident No:</span>
                                      <p>{chainreport.Property[0].IncidentNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Loss Code:</span>
                                      <p>{chainreport.Property[0].LossCode_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Owner Name:</span>
                                      <p>{chainreport.Property[0].OwnerDescription || 'N/A'}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Category:</span>
                                      <p>{chainreport.Property[0].Category_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Classification:</span>
                                      <p>{chainreport.Property[0].Classification_Description || 'N/A'}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Brand:</span>
                                      <p>{chainreport.Property[0].Brand}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Top Color:</span>
                                      <p>{chainreport.Property[0].TopColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Bottom Color:</span>
                                      <p>{chainreport.Property[0].BottomColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Quantity:</span>
                                      <p>{chainreport.Property[0].Quantity}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell" colSpan="3">
                                      <span className='prop-td'>Misc Description:</span>
                                      <p>{chainreport.Property[0].Description}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                          <div className="release-info">
                            <fieldset>
                              <legend className='prop-legend'>Chain Of Custody Information</legend>
                              <table className="table table-bordered mt-3">
                                <thead className='text-dark master-table'>
                                  <tr>
                                    <th className=''>Incident No.</th>
                                    <th className=''>Activity Date/Time</th>
                                    <th className=''>Activity Type</th>
                                    <th className=''>Officer</th>
                                    <th className=''>Property Room Person</th>
                                    <th className=''>Location/Reason</th>
                                    <th className=''>Destroyed Date/Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {chainreport.PropertyRoom.map((item, index) => (
                                    <tr key={index}>
                                      <td className='text-list'>{item.IncidentNumber1}</td>
                                      <td className='text-list'>{item.ChainDate || 'N/A'}</td>
                                      <td className='text-list'>{item.ActivityReason_Des}</td>
                                      <td className='text-list'>{item.Officer_Name}</td>
                                      <td className='text-list'>{item.PropertyRoomPerson_Name || 'N/A'}</td>
                                      <td className='text-list'>{item.location || 'N/A'}</td>
                                      <td className='text-list'>{item.DestroyDate || 'N/A'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                        </>

                      )}


                      {/* Security info */}

                      {chainreport.Property[0].Type === 'Security' && (
                        <>
                          <div className="property-info px-0">
                            <fieldset>
                              <legend className='prop-legend px-0'>Evidence Property Information</legend>
                              <table className="table table-bordered mt-3">
                                <tbody>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Property No:</span>
                                      <p>{chainreport.Property[0].PropertyNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Property Type:</span>
                                      <p>{chainreport.Property[0].Type}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Reported Date:</span>
                                      <p>{chainreport.Property[0].ReportedDtTm}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Incident No:</span>
                                      <p>{chainreport.Property[0].IncidentNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Loss Code:</span>
                                      <p>{chainreport.Property[0].LossCode_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Owner Name:</span>
                                      <p>{chainreport.Property[0].OwnerDescription || 'N/A'}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Category:</span>
                                      <p>{chainreport.Property[0].Category_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Classification:</span>
                                      <p>{chainreport.Property[0].Classification_Description || 'N/A'}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Brand:</span>
                                      <p>{chainreport.Property[0].Brand}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Top Color:</span>
                                      <p>{chainreport.Property[0].TopColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Bottom Color:</span>
                                      <p>{chainreport.Property[0].BottomColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Quantity:</span>
                                      <p>{chainreport.Property[0].Quantity}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell" colSpan="3">
                                      <span className='prop-td'>Misc Description:</span>
                                      <p>{chainreport.Property[0].Description}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                          <div className="release-info">
                            <fieldset>
                              <legend className='prop-legend'>Chain Of Custody Information</legend>
                              <table className="table table-bordered mt-3">
                                <thead className='text-dark master-table'>
                                  <tr>
                                    <th className=''>Incident No.</th>
                                    <th className=''>Activity Date/Time</th>
                                    <th className=''>Activity Type</th>
                                    <th className=''>Officer</th>
                                    <th className=''>Property Room Person</th>
                                    <th className=''>Location/Reason</th>
                                    <th className=''>Destroyed Date/Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {chainreport.PropertyRoom.map((item, index) => (
                                    <tr key={index}>
                                      <td className='text-list'>{item.IncidentNumber1}</td>
                                      <td className='text-list'>{item.ChainDate || 'N/A'}</td>
                                      <td className='text-list'>{item.ActivityReason_Des}</td>
                                      <td className='text-list'>{item.Officer_Name}</td>
                                      <td className='text-list'>{item.PropertyRoomPerson_Name || 'N/A'}</td>
                                      <td className='text-list'>{item.location || 'N/A'}</td>
                                      <td className='text-list'>{item.DestroyDate || 'N/A'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                        </>

                      )}



                      {/* Weapon info */}


                      {chainreport.Property[0].Type === 'Weapon' && (
                        <>
                          <div className="property-info px-0">
                            <fieldset>
                              <legend className='prop-legend px-0'>Evidence Property Information</legend>
                              <table className="table table-bordered mt-3">
                                <tbody>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Property No:</span>
                                      <p>{chainreport.Property[0].PropertyNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Property Type:</span>
                                      <p>{chainreport.Property[0].Type}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Reported Date:</span>
                                      <p>{chainreport.Property[0].ReportedDtTm}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Incident No:</span>
                                      <p>{chainreport.Property[0].IncidentNumber}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Loss Code:</span>
                                      <p>{chainreport.Property[0].LossCode_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Owner Name:</span>
                                      <p>{chainreport.Property[0].OwnerDescription || 'N/A'}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Category:</span>
                                      <p>{chainreport.Property[0].Category_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Classification:</span>
                                      <p>{chainreport.Property[0].Classification_Description || 'N/A'}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Brand:</span>
                                      <p>{chainreport.Property[0].Brand}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell">
                                      <span className='prop-td'>Top Color:</span>
                                      <p>{chainreport.Property[0].TopColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Bottom Color:</span>
                                      <p>{chainreport.Property[0].BottomColor_Description}</p>
                                    </td>
                                    <td className="table-cell">
                                      <span className='prop-td'>Quantity:</span>
                                      <p>{chainreport.Property[0].Quantity}</p>
                                    </td>
                                  </tr>
                                  <tr className="table-row">
                                    <td className="table-cell" colSpan="3">
                                      <span className='prop-td'>Misc Description:</span>
                                      <p>{chainreport.Property[0].Description}</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                          <div className="release-info">
                            <fieldset>
                              <legend className='prop-legend'>Chain Of Custody Information</legend>
                              <table className="table table-bordered mt-3">
                                <thead className='text-dark master-table'>
                                  <tr>
                                    <th className=''>Incident No.</th>
                                    <th className=''>Activity Date/Time</th>
                                    <th className=''>Activity Type</th>
                                    <th className=''>Officer</th>
                                    <th className=''>Property Room Person</th>
                                    <th className=''>Location/Reason</th>
                                    <th className=''>Destroyed Date/Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {chainreport.PropertyRoom.map((item, index) => (
                                    <tr key={index}>
                                      <td className='text-list'>{item.IncidentNumber1}</td>
                                      <td className='text-list'>{item.ChainDate || 'N/A'}</td>
                                      <td className='text-list'>{item.ActivityReason_Des}</td>
                                      <td className='text-list'>{item.Officer_Name}</td>
                                      <td className='text-list'>{item.PropertyRoomPerson_Name || 'N/A'}</td>
                                      <td className='text-list'>{item.location || 'N/A'}</td>
                                      <td className='text-list'>{item.DestroyDate || 'N/A'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </fieldset>
                          </div>
                        </>

                      )}






                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div >
      </div >
    </>
  )
}

export default ChainOfModel