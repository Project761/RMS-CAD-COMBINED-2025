import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import img from '../../../../../src/img/images1.jpg'

const NameReport = () => {

  const [verifyName, setverifyName] = useState(false);

  return (
    <>
      <div class="section-body view_page_design pt-3">
        <div className="row clearfix">
          <div className="col-12 col-sm-12">
            <div className="card Agency">
              <div className="card-body">
                <div className="row">
                  <div className="col-3  col-md-3 col-lg-4" >
                    <div className="text-field">
                      <input type="text" name='LastName' id='LastName' className='' />
                      <label htmlFor="">Last Name</label>
                    </div>
                  </div>
                  <div className="col-3  col-md-3 col-lg-4" >
                    <div className="text-field">
                      <input type="text" name='FirstName' id='FirstName' className='' />
                      <label htmlFor="">First Name</label>
                    </div>
                  </div>
                  <div className="col-3  col-md-3 col-lg-4" >
                    <div className="text-field">
                      <input type="text" name='MiddleName' id='MiddleName' className='' />
                      <label htmlFor="">Middle Name</label>
                    </div>
                  </div>
                  <div className="col-6 col-md-6 col-lg-6 mt-3">
                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setverifyName(true); }}>Show Report</button>
                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyName(false); }}>Clear</button>
                    <Link to={'/name-reports'}>
                      <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* for 1 table */}
      {
        verifyName ?
          <>
            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
              <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                <p className="p-0 m-0 d-flex align-items-center">Address History</p>
                <div style={{ marginLeft: 'auto' }}>
                  <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                    <i className="fa fa-print"></i>
                  </Link>
                  <Link to={''} className="btn btn-sm bg-green  text-white px-2 py-0"  >
                    <i className="fa fa-file"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="container mt-1">
              <div className="row" style={{ border: '1px solid #80808085' }}>
                <div className="col-3 ">
                  <div className="main">
                    <img src={img} className="img-fluid" alt />
                  </div>
                </div>
                <div className="col-8 mt-4">
                  <div className="main">
                    <h4 className='text-dark text-bold'>Demo</h4>
                    <p>30 Lake Center Executive Park</p>
                    <p>Marlton,Ny08053</p>
                    <p>Ph:44458582255 <span>fax;556565665</span></p>
                  </div>
                </div>
                <div className="col-12">
                  <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                </div>
                <div className="container">
                  <div className="col-12">
                    <h2 className="text-center text-danger">Address History Report</h2>
                    <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                      {/* <hr /> */}
                      <h6 className="px-2 pt-1 text-start text-dark text-bold">Name:
                        <span className=''>hfjfgfgf</span>
                      </h6>
                      <hr />
                      <table className="table table-bordered" style={{ marginTop: '-15px' }}>
                        <tbody>
                          <tr>
                            <td>
                              <h6 className='text-dark text-bold'>SSN:</h6>
                              <p>A-0000001</p>
                            </td>
                            <td>
                              <h6 className='text-dark text-bold'>Gender:</h6>
                              <p>

                                Tellingatpor, Robart
                              </p>
                            </td>
                            <td>
                              <h6 className='text-dark text-bold'>Race</h6>
                              <p>Male</p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <h6 className='text-dark text-bold'>DOB:</h6>
                              <p>

                                5
                              </p>
                            </td>
                            <td>
                              <h6 className='text-dark text-bold'>Age:</h6>
                              <p>

                                175
                              </p>
                            </td>
                            <td>
                              <h6 className='text-dark text-bold'>Juvenile:</h6>
                              <p>
                                04/19/1970
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <h6 className='text-dark text-bold'>Present Address</h6>
                              <p>Brown</p>
                            </td>
                            <td >
                              <h6 className='text-dark text-bold'>Address Type</h6>
                              <p>
                                Black
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <h6 className='text-dark text-bold'>Present Address</h6>
                              <p>Brown</p>
                            </td>
                            <td >
                              <h6 className='text-dark text-bold'>Address Type</h6>
                              <p>
                                Black
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <h6 className='text-dark text-bold'>Present Address</h6>
                              <p>Brown</p>
                            </td>
                            <td >
                              <h6 className='text-dark text-bold'>Address Type</h6>
                              <p>
                                Black
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <h6 className='text-dark text-bold'>Present Address</h6>
                              <p>Brown</p>
                            </td>
                            <td >
                              <h6 className='text-dark text-bold'>Address Type</h6>
                              <p>
                                Black
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <h6 className='text-dark text-bold'>Present Address</h6>
                              <p>Brown</p>
                            </td>
                            <td >
                              <h6 className='text-dark text-bold'>Address Type</h6>
                              <p>
                                Black
                              </p>
                            </td>
                          </tr>
                       
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            </div>


          </>
          :
          <>
          </>
      }




    </>

  )
}

export default NameReport