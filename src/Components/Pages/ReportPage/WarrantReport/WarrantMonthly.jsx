import React, { useEffect } from 'react'
import img from '../../../../img/images1.jpg'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime } from '../../../Common/Utility';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';

const WarrantMonthly = () => {

    const [verifyWarrant, setverifyWarrant] = useState(false);
    const [startDate, setStartDate] = useState();
    const [WarrantData, setWarrantData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
    const componentRef = useRef();

    const [value, setValue] = useState({
        'AgencyID': localStorage.getItem('AgencyID') ? Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID') : '',
        'DateTimeIssued': '',
    });
    const Reset = () => {
        setValue({
            ...value,
            'DateTimeIssued': '',
        });
        setStartDate(''); setverifyWarrant(false); setWarrantData([]); setMasterReportData([])
    }

    useEffect(() => {
        if (WarrantData?.length > 0) {
            setverifyWarrant(true);
        }
    }, [WarrantData]);

    const get_MonthlyReport = async () => {
        if (value?.DateTimeIssued?.trim()?.length > 0) {
            fetchPostData('ReportWarrant/WarrantReport_Monthly', value).then((res) => {
                if (res.length > 0) {
                    console.log(res)
                    setWarrantData(res[0].Incident); setMasterReportData(res[0])
                } else {
                    toastifyError("Data Not Available");
                }
            });
        } else {
            toastifyError("Please Select Year/Month")
        }
    }

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })

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
                                            <p className="p-0 m-0 d-flex align-items-center">Warrant Monthly Report</p>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                selected={startDate}
                                                peekNextMonth
                                                onChange={(date) => {
                                                    setStartDate(date); console.log(date);
                                                    setValue({ ...value, ['DateTimeIssued']: getShowingWithOutTime(date) })
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
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setverifyWarrant(false); get_MonthlyReport(); }}>Show Report</button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { Reset(); }}>Clear</button>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                verifyWarrant ?

                    WarrantData?.length > 0 ?
                        <>
                            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">Warrant Monthly Report</p>
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
                                        <div className="col-4 col-md-3 col-lg-2 ">
                                            <div className="main">
                                                <img src={masterReportData?.Agency_Photo} className="img-fluid" alt='Agency_Photo' style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                            </div>
                                        </div>
                                        <div className="col-7  col-md-7 col-lg-9 mt-4">
                                            <div className="main">
                                                <h5 className='text-dark text-bold'>{masterReportData?.Agency_Name}</h5>
                                                <p className='text-p'>Address: <span className='text-address'>{masterReportData?.Agency_Address1}</span></p>
                                                <div className='d-flex '>
                                                    <p className='text-p'>State: <span className='new-span ml-3'>{masterReportData?.Agency_StateId}</span>
                                                    </p>
                                                    <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{masterReportData?.Agency_CityId}</span>
                                                    </p>
                                                    <p className='text-p ml-2'>Zip: <span className='new-span  '>{masterReportData?.Agency_ZipId}</span>
                                                    </p>
                                                </div>
                                                <div className='d-flex'>
                                                    <p className='text-p'>Phone: <span className='new-span  ml-1'>{masterReportData?.Agency_Phone}</span></p>
                                                    <p className='text-p ml-4 pl-1'>Fax: <span className='new-span  '> {masterReportData?.Agency_Fax}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    <div className="col-12">
                                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    </div>
                                    {
                                        WarrantData?.length > 0 ?
                                            <>
                                                <div className="container">
                                                    <h5 className="text-white text-bold bg-green py-1 px-3">Warrant Details</h5>
                                                    <div className="col-12">
                                                        <div className="table-responsive">
                                                            <table className="table">
                                                                <thead className='text-dark master-table'>
                                                                    <tr className='bb'>
                                                                        <th className='' style={{ width: '100px' }}>Warrant Number</th>
                                                                        <th className='' style={{ width: '150px' }}>Warrant Type</th>
                                                                        <th className='' style={{ width: '150px' }}>Warrant Classification</th>
                                                                        <th className='' style={{ width: '150px' }}>Warrant Status</th>
                                                                        <th className='' style={{ width: '150px' }}>Date/Time</th>
                                                                        <th className='' style={{ width: '150px' }}>Warrant Name</th>
                                                                        <th className='' style={{ width: '150px' }}>Authority</th>
                                                                        <th className='' style={{ width: '150px' }}>Judge Name</th>
                                                                        {/* <th className='' style={{ width: '150px' }}>Crime Location</th> */}
                                                                    </tr>
                                                                </thead>
                                                                <tbody className='master-tbody'>
                                                                    {
                                                                        // console.log(JSON.parse(obj?.Arrest))
                                                                        WarrantData?.map((item, key) => (
                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                <td style={{ width: '100px' }}>{item.WarrantNumber}</td>
                                                                                <td style={{ width: '150px' }}>{item.WarrantType_Description}</td>
                                                                                <td style={{ width: '150px' }}>{item.WarrantClassfication_Description}</td>
                                                                                <td style={{ width: '150px' }}>{item.WarrantStatus_Description}</td>
                                                                                <td style={{ width: '150px' }}>{item.NoticeDate && getShowingDateText(item.NoticeDate)}</td>
                                                                                <td style={{ width: '150px' }}>{item.WarrantName}</td>
                                                                                <td style={{ width: '150px' }}>{item.Authority_Name}</td>
                                                                                <td style={{ width: '150px' }}>{item.Judge_Description}</td>
                                                                            </tr>
                                                                        ))
                                                                    }
                                                                </tbody>
                                                            </table>
                                                            <hr />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <>
                        </>
                    :
                    <>
                    </>
            }
        </>
    )
}

export default WarrantMonthly