import React from 'react'
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import { customStylesWithOutColor, getShowingDateText } from '../../../Common/Utility';
import { useState } from 'react';
import img from '../../../../img/images1.jpg'
import Select from "react-select";

const WarrantMaster = () => {
    const [verifyIncident, setverifyIncident] = useState(false)
    const [reportData, setReportData] = useState([]);
    const [nameReportData, setNameReportData] = useState([]);

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
        DateOfBirth: '',
        DateOfBirthTo: '',
    })
    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset className='fieldset ' style={{ marginTop: '-20px' }}>
                                    <legend>Warrant Information</legend>
                                    <div className="row">
                                        <div className="col-3  col-md-3 col-lg-2  " style={{ marginTop: '5px' }}>
                                            <div className="text-field">
                                                <input type="text" name='WarrantNumber' id='WarrantNumber' className='' />
                                                <label htmlFor="">Warrant Number From</label>
                                            </div>
                                        </div>
                                        <div className="col-3  col-md-3 col-lg-2  " style={{ marginTop: '5px' }}>
                                            <div className="text-field">
                                                <input type="text" name='WarrantNumber' id='WarrantNumber' className='' />
                                                <label htmlFor="">Warrant Number To</label>
                                            </div>
                                        </div>
                                        <div className="col-3  col-md-3 col-lg-2  " style={{ marginTop: '5px' }}>
                                            <div className="text-field">
                                                <input type="text" name='SSN' id='SSN' className='' />
                                                <label htmlFor="">SSN</label>
                                            </div>
                                        </div>
                                    </div>
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
                                                            ['DateOfComplain']: getShowingDateText(new Date()),
                                                        })
                                                    }}
                                                    selected={value?.DateOfComplain && new Date(value?.DateOfComplain)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable
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
                                                    isClearable
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
                                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                                            <div className=" dropdown__box">
                                                <Select
                                                    name='Warrant Type'
                                                    styles={customStylesWithOutColor}
                                                    placeholder="Select..."
                                                />
                                                <label>Warrant Type</label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                            <div className=" dropdown__box">
                                                <Select
                                                    name='Warrant Classification'
                                                    styles={customStylesWithOutColor}
                                                    placeholder="Select..."
                                                />
                                                <label>Warrant Classification</label>
                                            </div>
                                        </div>

                                        <div className="col-9  col-md-9 col-lg-9  " >
                                            <div className="dropdown__box">
                                                <textarea name='Location' id="Location" cols="30" rows='1' className="form-control " ></textarea>
                                                <label htmlFor="" className=''>Location</label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                            <div className=" dropdown__box">
                                                <Select
                                                    name='Warrant Status'
                                                    styles={customStylesWithOutColor}
                                                    placeholder="Select..."
                                                />
                                                <label>Warrant Status</label>
                                            </div>
                                        </div>

                                    </div>
                                </fieldset>
                                <fieldset className='fieldset mt-2'>
                                    <legend>Name Information</legend>
                                    <div className="row">
                                        <div className="col-4  col-md-4 col-lg-4  " style={{ marginTop: '5px' }}>
                                            <div className="text-field">
                                                <input type="text" name='LastName' id='LastName' className='' />
                                                <label htmlFor="">Last Name</label>
                                            </div>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-4  " style={{ marginTop: '5px' }}>
                                            <div className="text-field">
                                                <input type="text" name='FirstName' id='FirstName' className='' />
                                                <label htmlFor="">First Name</label>
                                            </div>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-4  " style={{ marginTop: '5px' }}>
                                            <div className="text-field">
                                                <input type="text" name='MiddleName' id='MiddleName' className='' />
                                                <label htmlFor="">Middle Name</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    name='DateOfBirth'
                                                    id='DateOfBirth'
                                                    onChange={(date) => {
                                                        setValue({
                                                            ...value,
                                                            ['DateOfBirth']: date ? getShowingDateText(date) : null,
                                                            ['DateOfBirth']: getShowingDateText(new Date()),
                                                        })
                                                    }}
                                                    // selected={value?.DateOfBirth && new Date(value?.DateOfBirth)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable

                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    disabled={false}
                                                    // maxDate={new Date()}
                                                    placeholderText='Select...'
                                                />
                                                <label htmlFor="" className='pl-0 pt-1' >DOB From</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3 mb-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    name='DateOfBirthTo'
                                                    id='DateOfBirthTo'
                                                    onChange={(date) => {
                                                        setValue({
                                                            ...value,
                                                            ['DateOfBirthTo']: date ? getShowingDateText(date) : null,
                                                            ['DateOfBirthTo']: getShowingDateText(new Date()),
                                                        })
                                                    }}
                                                    // selected={value?.DateOfBirthTo && new Date(value?.DateOfBirthTo)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable

                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    disabled={false}
                                                    // maxDate={new Date()}
                                                    placeholderText='Select...'
                                                />
                                                <label htmlFor="" className='pl-0 pt-1' >DOB To</label>
                                            </div>
                                        </div>

                                    </div>

                                </fieldset>
                                <div className="col-12 col-md-12 col-lg-12 mt-3 text-right">
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
                            <p className="p-0 m-0 d-flex align-items-center">Warrant Master Report</p>
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

                            <div className="col-12">
                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                            </div>

                            <div className="container mt-1" ref={componentRef}>
                                <div className="row" style={{ border: '1px solid #80808085' }}>
                                    {
                                        nameReportData[0]?.Agency.length > 0 ?
                                            <>
                                                <div className="col-4 col-md-3 col-lg-2 ">
                                                    <div className="main">
                                                        <img src={nameReportData[0]?.Agency[0]?.Agency_Photo} className="img-fluid" alt style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                                    </div>
                                                </div>
                                                <div className="col-7  col-md-7 col-lg-9 mt-4">
                                                    <div className="main">
                                                        <h5 className='text-dark text-bold'>{nameReportData[0]?.Agency[0]?.Agency_Name}</h5>

                                                        <p className='text-p'>Address: <span className='new-span'>{nameReportData[0]?.Agency[0]?.Agency_Address1}</span></p>
                                                        <div className='d-flex '>
                                                            <p className='text-p'>State: <span className='new-span '>{nameReportData[0]?.Agency[0]?.StateName}</span>
                                                            </p>
                                                            <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{nameReportData[0]?.Agency[0]?.CityName}</span>
                                                            </p>
                                                            <p className='text-p ml-2'>Zip: <span className='new-span  '>{nameReportData[0]?.Agency[0]?.ZipId}</span>
                                                            </p>
                                                        </div>
                                                        <div className='d-flex'>
                                                            <p className='text-p'>Phone: <span className='new-span  '>{nameReportData[0]?.Agency[0]?.Agency_Phone}</span></p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </>
                                            :
                                            <>
                                                <div className="col-3 ">
                                                    <div className="main">
                                                        <img src={img} className="img-fluid" alt />
                                                    </div>
                                                </div>
                                                <div className="col-8 mt-4">
                                                    <div className="main">
                                                        <h5 className='text-dark text-bold'>{"Agency_Name"}</h5>
                                                        <p>{"Agency_Address"}</p>
                                                        <p>{"Agency_Phone"}</p>
                                                    </div>
                                                </div>
                                            </>
                                    }
                                    <div className="col-12">
                                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    </div>
                                    <div className="container">
                                        <div className="row">

                                            <div className="table-responsive" >
                                                <div className="text-white text-bold py-1 px-2  d-flex justify-content-between align-items-center" style={{ background: 'gray' }} >
                                                    <p className="p-0 m-0 d-flex align-items-center">Warrant Information</p>
                                                    <p className="p-0 m-0 d-flex align-items-center">{getShowingDateText()}</p>
                                                </div>
                                                <div className="text-white text-bold py-1 bt px-2  d-flex justify-content-between align-items-center bg-green"  >
                                                    <p className="p-0 m-0 d-flex align-items-center">Name Information:</p>
                                                </div>

                                                <table className="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td >
                                                                <h6 className='text-dark text-bold'>Name Id</h6>
                                                                {/* <p>{nameReportData[0]?.NameIDNumber}</p> */}
                                                                <p className='text-list '>65464664</p>

                                                            </td>
                                                            <td colSpan={3}>
                                                                <h6 className='text-dark text-bold'>Name:</h6>
                                                                {/* <p>{nameReportData[0]?.LastName}</p> */}
                                                                <p className='text-list '>adasfafa</p>
                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Phone Number:</h6>
                                                                <p className='text-list '>6544663446</p>
                                                            </td>

                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2}>
                                                                <h6 className='text-dark text-bold'>Address:</h6>
                                                                {/* <p>{nameReportData[0]?.Address}</p> */}
                                                                <p className='text-list '>adasdafafdafasdaf</p>

                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>DOB:</h6>
                                                                {/* <p>{nameReportData[0]?.Race_Description}</p> */}
                                                                <p className='text-list '>30-10-23</p>

                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Gender:</h6>
                                                                {/* <p>{nameReportData[0]?.Gender}</p> */}
                                                                <p className='text-list '>male</p>
                                                            </td>
                                                            <td >
                                                                <h6 className='text-dark text-bold'>Race</h6>
                                                                <p className='text-list '>545</p>

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td >
                                                                <h6 className='text-dark text-bold'>Height</h6>
                                                                {/* <p>{nameReportData[0]?.HeightTo}</p> */}
                                                                <p className='text-list '>545</p>

                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Weight</h6>
                                                                {/* <p>{nameReportData[0]?.WeightTo}</p> */}
                                                                <p className='text-list '>12</p>

                                                            </td>
                                                          
                                                          
                                                            <td >
                                                                <h6 className='text-dark text-bold'>Alias Name</h6>
                                                                <p className='text-list '>12</p>
                                                            </td>

                                                        
                                                            <td colSpan={2}>
                                                                <h6 className='text-dark text-bold'>SSN</h6>
                                                                <p>{nameReportData[0]?.SSN}</p>
                                                                <p className='text-list '>15645454652</p>

                                                            </td>
                                                        </tr>
                                                        <tr>
                                                         
                                                            <td>
                                                                <h6 className='text-dark text-bold'>DL Number</h6>
                                                                <p className='text-list '>12455544</p>

                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Licence State</h6>
                                                                <p className='text-list '>12455544</p>

                                                            </td>

                                                          
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2}>
                                                                <h6 className='text-dark text-bold'>Warrant Id</h6>
                                                                <p>{nameReportData[0]?.SSN}</p>
                                                                <p className='text-list '>15645454652</p>

                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Issue Date/Time</h6>
                                                                <p className='text-list '>12455544</p>

                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Warrant Type</h6>
                                                                <p className='text-list '>12455544</p>

                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Warrant Classification</h6>
                                                                <p className='text-list '>12455544</p>

                                                            </td>

                                                          
                                                        </tr>
                                                        <tr>
                                               
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Issuing Authority</h6>
                                                                <p className='text-list '>12455544</p>

                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Warrant Date Expire</h6>
                                                                <p className='text-list '>30-10-23</p>
                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Bail Condition</h6>
                                                                <p className='text-list '>30-10-23</p>
                                                            </td>
                                                            <td>
                                                                <h6 className='text-dark text-bold'>Bail Amt</h6>
                                                                <p className='text-list '>30-10-23</p>
                                                            </td>

                                                          
                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </>
            }

        </>
    )
}

export default WarrantMaster