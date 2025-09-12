import React, { useEffect, useState } from 'react'
import { Decrypt_Id_Name, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime } from '../../../Common/Utility';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import img from '../../../../img/images1.jpg'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';

const ArrestIncident = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const [verifyArrest, setVerifyArrest] = useState(false)
    const [reportData, setReportData] = useState([]);
    const [ArrestDate, setArrestDate] = useState();
    const [ArrestToDate, setArrestToDate] = useState();
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');

    const [value, setValue] = useState({
        'AgencyID': '', 'IncidentNumber': '', 'IncidentNumberTo': '', 'ArrestDtTm': '', 'ArrestDtToTm': '',
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData])

    const resetFields = () => {
        setValue({
            ...value,
            'IncidentNumber': '', 'IncidentNumberTo': '', 'ArrestDtTm': '', 'ArrestDtToTm': '',
        })
        setVerifyArrest(false); setReportData([]); setMasterReportData([]);
    }

    useEffect(() => {
        if (reportData?.length > 0) {
            setVerifyArrest(true);
        }
    }, [reportData]);

    const getIncidentSearchData = async () => {
        if (value?.IncidentNumber?.trim()?.length > 0 || value?.ArrestDtTm?.trim()?.length > 0 || value?.ArrestDtToTm?.trim()?.length > 0) {
            const { AgencyID, IncidentNumber, IncidentNumberTo, ArrestDtTm, ArrestDtToTm, } = value
            const val = {
                'AgencyID': LoginAgencyID, 'IncidentNumber': IncidentNumber, 'IncidentNumberTo': IncidentNumberTo, 'ArrestDtTm': ArrestDtTm, 'ArrestDtToTm': ArrestDtToTm,
            }
            fetchPostData('ArrestReport/ArrestIncident_Report', val).then((res) => {
                if (res.length > 0) {
                    setReportData(res[0].Arrest); setMasterReportData(res[0]); setVerifyArrest(true);
                } else {
                    toastifyError("Data Not Available");
                    setReportData([]); setMasterReportData([]); setVerifyArrest(false);
                }
            });
        } else {
            toastifyError("Please Enter Details"); setVerifyArrest(false);
        }
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })

    const handleChange = (e) => {
        if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            if (ele.length === 8) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
        
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2]
                    })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 mb-2 " >
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Arrest Incident Report</p>
                                        </div>
                                    </div>
                                    <div className="col-3  col-md-3 col-lg-2  " style={{ marginTop: '5px' }}>
                                        <div className="text-field">
                                            <input type="text" name='IncidentNumber' id='IncidentNumber'  value={value?.IncidentNumber} onChange={handleChange} className='' />
                                            <label htmlFor="">Incident Number From</label>
                                        </div>
                                    </div>
                                    <div className="col-3  col-md-3 col-lg-2  " style={{ marginTop: '5px' }}>
                                        <div className="text-field">
                                            <input type="text" name='IncidentNumberTo' id='IncidentNumberTo' value={value.IncidentNumberTo} onChange={handleChange} className='' />
                                            <label htmlFor="">Incident Number To</label>
                                        </div>
                                    </div>
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
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-3 text-right">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(); }}>Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setVerifyArrest(false); setArrestDate([]); resetFields(); }}>Clear</button>
                                    <Link to={'/Reports'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                    </Link>
                                </div>
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
                            <p className="p-0 m-0 d-flex align-items-center">Arrest Incident Report</p>
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
                                        <img src={masterReportData?.Agency_Photo} className="img-fluid" alt='Agency_Photo' style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                    </div>
                                </div>
                                <div className="col-7  col-md-7 col-lg-9 mt-4 pt-1 ml-5">
                                    <div className="main">
                                        <h5 className='text-dark text-bold'>{masterReportData?.Agency_Name}</h5>
                                        <p className='text-p'>Address: <span className=''>{masterReportData?.Agency_Address1}</span></p>
                                        <div className='d-flex '>
                                            <p className='text-p'>State: <span className='new-span '>{masterReportData?.StateName}</span>
                                            </p>
                                            <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{masterReportData?.CityName}</span>
                                            </p>
                                            <p className='text-p ml-2'>Zip: <span className='new-span  '>{masterReportData?.Agency_ZipId}</span>
                                            </p>
                                        </div>
                                        <div className='d-flex'>
                                            <p className='text-p'>Phone: <span className='new-span  '>{masterReportData?.Agency_Phone}</span></p>
                                            <p className='text-p ml-3 '>Fax: <span className='new-span  '> {masterReportData?.Agency_Fax}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </>
                            <div className="col-12">
                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                            </div>
                            <div className="container">
                                <div className="row">
                                    {
                                        masterReportData?.Arrest?.map((obj) =>
                                            <>
                                                <div className="table-responsive">
                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                        <p className="p-0 m-0 d-flex align-items-center">Incident ID:{obj?.IncidentNumber}</p>
                                                    </div>
                                                    <table className="table table-bordered ">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <h6 className='text-dark text-bold'>ArrestNumber:</h6>
                                                                    {/* <p>{masterReportData[0]?.ArrestNumber}</p> */}
                                                                    <p className='text-list'>{obj?.ArrestNumber}</p>
                                                                    {/* <p>{getShowingDateText()}</p> */}
                                                                </td>
                                                                <td >
                                                                    <h6 className='text-dark text-bold'>Exceptional Clearance(Yes/No)</h6>
                                                                    <p className='text-list'>{obj?.RMSDisposition_Description}</p>
                                                                </td>
                                                                <td >
                                                                    <h6 className='text-dark text-bold'>CAD Disposition:</h6>
                                                                    <p className='text-list'>{obj?.CADDisposition_Description}</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td >
                                                                    <h6 className='text-dark text-bold'>Arrest Id:</h6>
                                                                    <p className='text-list'> {obj?.ArrestNumber}</p>
                                                                </td>
                                                                <td >
                                                                    <h6 className='text-dark text-bold'>Arrest Date/Time:</h6>
                                                                    <p className='text-list'>{obj?.ArrestDtTm}</p>
                                                                </td>
                                                                <td>
                                                                    <h6 className='text-dark text-bold'>Arrest Officer:</h6>
                                                                    <p className='text-list'>{obj?.Supervisor_Name}</p>
                                                                </td>
                                                                <td >
                                                                    <h6 className='text-dark text-bold'>Arrestee:</h6>
                                                                    <p className='text-list'>{obj?.Arrestee_Name}</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan={12}>
                                                                    <h6 className='text-dark text-bold'>Charges:</h6>
                                                                    <p className='text-list'>{obj?.ChargeCode_Description}</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                </div >
                            </div >
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ArrestIncident