import React from 'react'
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import { customStylesWithOutColor, getShowingDateText } from '../../../Common/Utility';
import { useState } from 'react';
import img from '../../../../img/images1.jpg'
import Select from "react-select";

const WarrantCharge = () => {
    const [verifyIncident, setverifyIncident] = useState(false)
    const [reportData, setReportData] = useState([]);
    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })
    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const [value, setValue] = useState({
        DateOfComplain: '',
        DateOfComplainTo: '',
        DateTimeIssued: '',
        DateExpired: '',
        DateExpiredTo: '',
        NoticeDate: '',
    })
    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">

                                <div className="row">
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='DateOfComplain'
                                                id='DateOfComplain'
                                                onChange={(date) => {
                                                    setValue({
                                                        ...value,
                                                        ['DateOfComplain']: date ? getShowingDateText(date) : null,
                                                        ['ReportedDateTo']: getShowingDateText(new Date()),
                                                    })
                                                }}
                                                selected={value?.DateOfComplain && new Date(value?.DateOfComplain)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.DateOfComplain ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={false}
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Warrant Issue From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='DateOfComplainTo'
                                                id='DateOfComplainTo'
                                                onChange={(date) => {
                                                    setValue({
                                                        ...value,
                                                        ['DateOfComplainTo']: date ? getShowingDateText(date) : null,
                                                        ['DateOfComplainTo']: getShowingDateText(new Date()),
                                                    })
                                                }}
                                                selected={value?.DateOfComplainTo && new Date(value?.DateOfComplainTo)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.DateOfComplainTo ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={false}
                                                // maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Warrant Issue To Date</label>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                                        <div className=" dropdown__box">
                                            <Select
                                                name='Charge Code'
                                                styles={customStylesWithOutColor}
                                                placeholder="Select..."
                                            />
                                            <label>Charge Code</label>
                                        </div>
                                    </div>


                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-3 txet-right">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setverifyIncident(true); }}>Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyIncident(false); }}>Clear</button>
                                    <Link to={'/Reports'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                verifyIncident &&
                <>
                    <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Warrant By Charge</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    <i className="fa fa-print" onClick={printForm}></i>
                                </Link>
                                {/* <Link to={''} className="btn btn-sm bg-green  text-white px-2 py-0"  >
                                    <i className="fa fa-file"></i>
                                </Link> */}
                            </div>
                        </div>
                    </div>
                    <div className="container mt-1" ref={componentRef}>
                        <div className="row" style={{ border: '1px solid #80808085' }}>
                            <>
                                <div className="col-4 col-md-3 col-lg-2">
                                    <div className="main">
                                        <img src={img} className="img-fluid" alt='Agency_Photo' style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                    </div>
                                </div>
                                <div className="col-7  col-md-7 col-lg-9 mt-4 pt-1 ml-5">
                                    <div className="main">
                                        <h5 className='text-dark text-bold'>{reportData?.Agency_Name} Test Test Test</h5>
                                        <p className='text-p'>Address: <span className=''>{reportData?.Agency_Address1}Test</span></p>
                                        <div className='d-flex '>
                                            <p className='text-p'>State: <span className='new-span '>{reportData?.StateName}</span>
                                            </p>
                                            <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{reportData?.CityName}</span>
                                            </p>
                                            <p className='text-p ml-2'>Zip: <span className='new-span  '>{reportData?.Agency_ZipId}</span>
                                            </p>
                                        </div>
                                        <div className='d-flex'>
                                            <p className='text-p'>Phone: <span className='new-span  '>{reportData?.Agency_Phone}</span></p>
                                            <p className='text-p ml-3 '>Fax: <span className='new-span  '> {reportData?.Agency_Fax}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </>
                            <div className="col-12">
                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                            </div>

                            <div className="container">
                            <h5 className="  text-center  ">Month: Jan 2100</h5>

                                <div className="row">
                                  
                                <div className="table-responsive">
                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Charge: 0111-Testing</p>
                                        </div>
                                        <table className="table ">
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className=''>Warrant Number</th>
                                                    <th className=''>Issue Date/Time</th>
                                                    <th className=''>Warrant Name</th>
                                                    <th className=''>Location</th>
                                                    <th className=''>Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1246855</td>
                                                    <td>26-10-23 01:12</td>
                                                    <td>44654646</td>
                                                    <td>26-10-23 01:12</td>
                                                    <td>Testing</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                        <hr />
                                    </div>


                                </div>
                            </div >

                        </div>
                    </div>

                </>
            }

        </>
    )
}

export default WarrantCharge