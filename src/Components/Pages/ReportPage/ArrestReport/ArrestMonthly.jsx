import React from 'react'
import img from '../../../../img/images1.jpg'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, getShowingMonthDateYear, getShowingWithOutTime } from '../../../Common/Utility';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
const ArrestMonthly = () => {

    const [verifyArrest, setVerifyArrest] = useState(false)
    const [reportData, setReportData] = useState([]);
    const [ArrestDate, setArrestDate] = useState();
    const [ArrestToDate, setArrestToDate] = useState();
    const [startDate, setStartDate] = useState();
    const componentRef = useRef();
    const [value, setValue] = useState({
        'IncidentNumber': '',
        'ArrestDtTm': '',
        'ArrestDtToTm': '',
        'AgencyID': '',
    });

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

    return (
        <>

            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 mb-1 " >
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Arrest Monthly Report</p>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                selected={startDate}
                                                // peekNextMonth
                                                onChange={(date) => {
                                                    setStartDate(date);
                                                    setValue({ ...value, ['ReportedDate']: getShowingWithOutTime(date) })
                                                }}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                maxDate={new Date()}
                                                autoComplete="nope"
                                                placeholderText={'Select...'}
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Month/Year</label>
                                        </div>
                                    </div>
                                    <div className="col-9 col-md-9 col-lg-9 mt-3">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setVerifyArrest(true); }}>Show Report</button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setVerifyArrest(false); }}>Clear</button>
                                        <Link to={'/Reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="col-6 col-md-4 col-lg-3  ">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                id='ArrestDtTm'
                                                name='ArrestDtTm'
                                                onChange={(date) => { setArrestDate(date); setValue({ ...value, ['ArrestDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                className=''
                                                dateFormat="MM/dd/yyyy HH:mm"
                                                timeInputLabel
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                isClearable={value?.ArrestDtTm ? true : false}
                                                selected={ArrestDate}
                                                placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                                                showTimeSelect
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                autoComplete="Off"
                                                maxDate={new Date()}
                                            />
                                            <label htmlFor="" className='pt-1'>Arrest From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-4 col-lg-3  ">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                id='ArrestDtTmTo'
                                                name='ArrestDtTmTo'
                                                onChange={(date) => { setArrestToDate(date); setValue({ ...value, ['ArrestDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                className=''
                                                dateFormat="MM/dd/yyyy HH:mm"
                                                timeInputLabel
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                isClearable={value?.ArrestDtTmTo ? true : false}
                                                selected={ArrestToDate}
                                                placeholderText={value?.ArrestDtTmTo ? value.ArrestDtTmTo : 'Select...'}
                                                showTimeSelect
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                autoComplete="Off"
                                                maxDate={new Date()}
                                            />
                                            <label htmlFor="" className='pt-1'>Arrest To Date</label>
                                        </div>
                                    </div>
                                </div> */}
                                {/* <DataTable
                                    columns={columns}
                                    dense
                                    data={incidentData}
                                    pagination
                                    paginationPerPage={'10'}
                                    paginationRowsPerPageOptions={[10, 15, 20]}
                                    highlightOnHover
                                    subHeader
                                    responsive
                                    showPaginationBottom={10}
                                    subHeaderAlign='left'
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                verifyArrest &&
                <>
                    <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Arrest Monthly Report</p>
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

                                <div className="row">
                                    <div className="table-responsive">
                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Arrest Monthly: 54565654</p>
                                        </div>
                                        <table className="table table-bordered ">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <h6 className='text-dark text-bold'>Arrest Id:</h6>
                                                        {/* <p>{nameReportData[0]?.NameIDNumber}</p> */}
                                                    </td>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>Arrestee:</h6>
                                                        {/* <p>{nameReportData[0]?.LastName}</p> */}
                                                        <p>agsdvadbav</p>
                                                    </td>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>Arrest Date:</h6>
                                                        {/* <p>{nameReportData[0]?.LastName}</p> */}
                                                        <p>agsdvadbav</p>
                                                    </td>
                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Location:</h6>
                                                        {/* <p>{nameReportData[0]?.LastName}</p> */}
                                                        <p>agsdvadbav</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>DOB:</h6>
                                                        <p>0005465</p>
                                                    </td>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>Age:</h6>
                                                        <p>45</p>
                                                    </td>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>Gender:</h6>
                                                        <p>male</p>
                                                    </td>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>Bail Amt:</h6>
                                                        <p>Adult,Offender</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={12}>
                                                        <h6 className='text-dark text-bold'>Charges:</h6>
                                                        <p>Adult,Offende 634646644745r</p>
                                                    </td>

                                                </tr>
                                            </tbody>


                                        </table>
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

export default ArrestMonthly