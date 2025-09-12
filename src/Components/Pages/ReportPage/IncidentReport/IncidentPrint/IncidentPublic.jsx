import React from 'react'
import { Link } from 'react-router-dom';
import img from '../../../../../../src/img/images1.jpg'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, customStylesWithOutColor, getShowingWithOutTime, } from '../../../../Common/Utility';
import { useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { fetchPostData } from '../../../../hooks/Api';
import { toastifyError } from '../../../../Common/AlertMsg';
import { useEffect } from 'react';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';


const IncidentPublic = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);


    const { localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [multiImage, setMultiImage] = useState([]);

    const [cadCfsCodeID, setCadCfsCodeID] = useState([]);
    const [verifyIncident, setverifyIncident] = useState(false)
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [incidentData, setIncidentData] = useState([]);
    const [localStatus, setlocalStatus] = useState(false);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const [value, setValue] = useState({
        'IncidentNumber': '', 'IncidentNumberTo': '', 'ReportedDate': '', 'ReportedDateTo': '', 'OccurredFrom': '',
        'OccurredTo': '', 'FBIID': null, 'RMSCFSCodeID': null, 'CADCFSCodeID': null, 'Location': '', 'AgencyID': '',
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            getCADCFSCodeID(localStoreData?.AgencyID); FBIidDrpVal(localStoreData?.AgencyID);
        }
    }, [localStoreData])

    const FBIidDrpVal = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
            if (data) {
                setNibrsCodeDrp(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
            } else {
                setNibrsCodeDrp([]);
            }
        })
    }

    const getRmsCfsCodeID = (FBIID) => {
        const val = { 'FBIID': FBIID, 'AgencyID': null, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            } else {
                setRmsCfsID([]);
            }
        })
    }

    const getCADCFSCodeID = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('Incident/GetData_CADCFSCODE', val).then((data) => {
            if (data) {
                setCadCfsCodeID(Comman_changeArrayFormat(data, 'CADCFSCodeID', 'CADCFSCode'))
            } else {
                setCadCfsCodeID([]);
            }
        })
    }

    const getIncidentSearchData = async () => {
        if (value?.Location.trim()?.length > 0 || value?.ReportedDate?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.IncidentNumber.trim()?.length > 0 || value?.IncidentNumberTo.trim()?.length > 0 || value?.OccurredFrom.trim()?.length > 0 || value?.OccurredTo.trim()?.length > 0 || value?.FBIID !== null || value?.RMSCFSCodeID !== null || value?.CADCFSCodeID !== null) {
            const {
                IncidentNumber, IncidentNumberTo, ReportedDate, ReportedDateTo, OccurredFrom,
                OccurredTo, FBIID, RMSCFSCodeID, CADCFSCodeID, Location, AgencyID,
            } = value
            const val = {
                IncidentNumber: IncidentNumber, IncidentNumberTo: IncidentNumberTo, ReportedDate: ReportedDate, ReportedDateTo: ReportedDateTo,
                OccurredFrom: OccurredFrom, OccurredTo: OccurredTo, FBIID: FBIID, RMSCFSCodeID: RMSCFSCodeID, CADCFSCodeID: CADCFSCodeID,
                Location: Location, AgencyID: LoginAgencyID
            }
            fetchPostData('Report/PublicReport', val).then((res) => {
                if (res.length > 0) {
                    // console.log(res);
                    // console.log(JSON.parse(res[0].Incident[0]?.Narrative));
                    setIncidentData(res[0].Incident); setReportData(res[0]); setverifyIncident(true); getAgencyImg(LoginAgencyID)
                } else {
                    toastifyError("Data Not Available");
                }
            });
        } else {
            toastifyError("Please Enter Details");
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
                    // console.log(match)
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

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'FBIID') {
                getRmsCfsCodeID(e.value);
                setValue({
                    ...value,
                    [name]: e.value,
                    ['RMSCFSCodeID']: null,
                });
                setRmsCfsID([])
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
        } else {
            if (name === 'FBIID') {
                setValue({
                    ...value,
                    [name]: null,
                    ['RMSCFSCodeID']: null,
                });
                setRmsCfsID([])
            } else {
                setValue({
                    ...value,
                    [name]: null
                })
            }
        }
    }

    const resetFields = () => {
        setValue({
            ...value,
            'IncidentNumber': '', 'IncidentNumberTo': '', 'ReportedDate': '', 'ReportedDateTo': '',
            'OccurredFrom': '', 'OccurredTo': '', 'FBIID': null, 'RMSCFSCodeID': null, 'CADCFSCodeID': null,
            'Location': '',
        });
        setverifyIncident(false); setIncidentData([]); setReportData([]);
    }

    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
        
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);

            }
            else { console.log("errror") }
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
                                    <div className="col-12 col-md-12 col-lg-12 mb-2 " >
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Incident Public Report</p>
                                        </div>
                                    </div>
                                    <div className="col-3  col-md-3 col-lg-2  " >
                                        <div className="text-field">
                                            <input type="text" name='IncidentNumber' maxLength={9} id='IncidentNumberFrom' value={value.IncidentNumber} onChange={handleChange} className='' />
                                            <label htmlFor="">Incident Number From</label>
                                        </div>
                                    </div>
                                    <div className="col-3  col-md-3 col-lg-2  " >
                                        <div className="text-field">
                                            <input type="text" name='IncidentNumberTo' maxLength={9} id='IncidentNumberTo' value={value.IncidentNumberTo} onChange={handleChange} className='' />
                                            <label htmlFor="">Incident Number To</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='ReportedDate'
                                                id='ReportedDate'
                                                onChange={(date) => {
                                                    setValue({
                                                        ...value,
                                                        ['ReportedDate']: date ? getShowingWithOutTime(date) : null,
                                                    })
                                                }}
                                                selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ReportedDate ? true : false}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={false}
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='ReportedDateTo'
                                                id='ReportedDateTo'
                                                onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingWithOutTime(date) : null }) }}
                                                selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ReportedDateTo ? true : false}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={value?.ReportedDate ? false : true}
                                                minDate={new Date(value?.ReportedDate)}
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported To Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='OccurredFrom'
                                                id='OccurredFrom'
                                                onChange={(date) => { setValue({ ...value, ['OccurredFrom']: date ? getShowingWithOutTime(date) : null }) }}
                                                selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.OccurredFrom ? true : false}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                // disabled
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Occurred From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='OccurredTo'
                                                id='OccurredTo'
                                                onChange={(date) => { setValue({ ...value, ['OccurredTo']: date ? getShowingWithOutTime(date) : null }) }}
                                                selected={value?.OccurredTo && new Date(value?.OccurredTo)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.OccurredTo ? true : false}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={value?.OccurredFrom ? false : true}
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Occurred To Date</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                        <div className=" dropdown__box">
                                            <Select
                                                name='FBIID'
                                                styles={customStylesWithOutColor}
                                                value={nibrsCodeDrp?.filter((obj) => obj.value === value?.FBIID)}
                                                isClearable
                                                options={nibrsCodeDrp}
                                                onChange={(e) => ChangeDropDown(e, 'FBIID')}
                                                placeholder="Select..."
                                            />
                                            <label>FBI Code</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                        <div className=" dropdown__box">
                                            <Select
                                                name='RMSCFSCodeID'
                                                styles={customStylesWithOutColor}
                                                value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                isClearable
                                                options={rmsCfsID}
                                                onChange={(e) => ChangeDropDown(e, 'RMSCFSCodeID')}
                                                placeholder="Select..."
                                            />
                                            <label>RMS CFS Code</label>
                                        </div>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                        <div className=" dropdown__box">
                                            <Select
                                                name='CADCFSCodeID'
                                                value={cadCfsCodeID?.filter((obj) => obj.value === value?.CADCFSCodeID)}
                                                isClearable
                                                menuPlacement='top'
                                                options={cadCfsCodeID}
                                                onChange={(e) => ChangeDropDown(e, 'CADCFSCodeID')}
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label>CAD CFS Code</label>
                                        </div>
                                    </div>
                                    <div className="col-12  col-md-12 col-lg-12  pt-1">
                                        <div className="text-field">
                                            {/* <Location  /> */}
                                            <input type="text" name='Location' id='Location' value={value.Location} onChange={handleChange} className='' />
                                            <label htmlFor="" className='pl-1'>Crime Location</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-3 text-right">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { getIncidentSearchData(); }}>Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields(); }}>Clear</button>
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
                            <p className="p-0 m-0 d-flex align-items-center">Incident By Public Report</p>
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
                                        {/* <img src={reportData?.Agency_Photo} className="img-fluid" alt='Agency_Photo' style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} /> */}
                                        <div className="img-box" >
                                            <img src={multiImage} className='picture' style={{ marginTop: '4px', width: '150px' }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-7  col-md-7 col-lg-9 mt-4 pt-1 ml-5">
                                    <div className="main">
                                        <h5 className='text-dark text-bold'>{reportData?.Agency_Name}</h5>
                                        <p className='text-p'>Address: <span className=''>{reportData?.Agency_Address1}Test</span></p>
                                        <div className='d-flex '>
                                            <p className='text-p'>State: <span className='new-span '>{reportData?.StateName}</span>
                                            </p>
                                            <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{reportData?.CityName}</span>
                                            </p>
                                            <p className='text-p ml-2'>Zip: <span className='new-span  '>{reportData?.Zipcode}</span>
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
                            {
                                incidentData?.map((obj) =>
                                    <>
                                        <div className="container">
                                            <div className="row">
                                                <div className="table-responsive">
                                                    <div className="col-12 col-md-12 col-lg-12 mb-2 " style={{ background: 'gray' }}>
                                                        <div className="py-1 px-2 mt-1 ">
                                                            <p className="p-0 m-0 text-white text-center">Public Report:  <span >{obj?.IncidentNumber}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                        <p className="p-0 m-0 d-flex align-items-center">Incident Information:</p>
                                                    </div>
                                                    <table className="table ">
                                                        <thead className='text-dark master-table'>
                                                            <tr>
                                                                <th className='' style={{ width: '150px' }}>Incident Number:</th>
                                                                <th className='' style={{ width: '300px' }}>Crime Location:</th>
                                                                <th className='' style={{ width: '180px' }}>Reported Date/Time:</th>
                                                                <th className='' style={{ width: '180px' }}>Occurred Date/Time:</th>
                                                                <th className=''>CAD CFS:</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ width: '150px' }} className='text-list'>{obj?.IncidentNumber}</td>
                                                                <td style={{ width: '300px' }} className='text-list'>{obj?.Location}</td>
                                                                <td style={{ width: '180px' }} className='text-list'>{obj?.ReportedDate && getShowingWithOutTime(obj?.ReportedDate)}</td>
                                                                <td style={{ width: '180px' }} className='text-list'>{obj?.OccuredDate && getShowingWithOutTime(obj?.OccuredDate)}</td>
                                                                <td className='text-list'>{obj?.CFSDescription}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <hr />
                                                </div>
                                                {
                                                    JSON.parse(obj?.Name)?.length > 0 ?
                                                        <>

                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div className="table-responsive">
                                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                            <p className="p-0 m-0 d-flex align-items-center">Name Information:</p>
                                                                        </div>

                                                                        {
                                                                            JSON.parse(obj?.Name).map((item, key) => (
                                                                                <>
                                                                                    {/* <table className="table table-bordered ">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <th >
                                                                                            <h6 className='text-dark text-bold'>Name ID:</h6>
                                                                                            <p>{item?.MNIID}</p>
                                                                                        </th>
                                                                                        <td >
                                                                                            <h6 className='text-dark text-bold'>Name:</h6>
                                                                                            <p>{item?.name}</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr>
                                                                                        <td colSpan={12}>
                                                                                            <h6 className='text-dark text-bold'>Reason:</h6>
                                                                                            <p>{item?.Reason}</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table> */}
                                                                                    <table className="table table-bordered " style={{ borderTop: '1px solid #E8E9E9' }}>
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className='' style={{ width: '120px' }}>Name ID:</th>
                                                                                                <th className='' style={{ width: '250px' }}>Name:</th>
                                                                                                <th className=''>Reason:</th>

                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td style={{ width: '120px' }} className='text-list'>{item?.MNIID}</td>
                                                                                                <td style={{ width: '250px' }} className='text-list'>{item?.name}</td>
                                                                                                <td className='text-list'>{item?.Reason}</td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }
                                                {
                                                    JSON.parse(obj?.Narrative)?.length > 0 ?
                                                        <>
                                                            <div className="table-responsive">
                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                    <p className="p-0 m-0 d-flex align-items-center">Narrative Information:</p>
                                                                </div>
                                                                <table className="table ">
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            {/* <th className=''>Narrative Id:</th> */}
                                                                            <th className='' style={{ width: '150px' }}>Arrest Date/Time:</th>
                                                                            <th className=''>Reported By:</th>
                                                                            <th className=''>Narrative Type:</th>
                                                                            <th className=''>Comments:</th>
                                                                        </tr>
                                                                    </thead>
                                                                    {
                                                                        JSON.parse(obj?.Narrative)?.map((item, key) => (
                                                                            <>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        {/* <td>1246855</td> */}
                                                                                        <td style={{ width: '150px' }} className='text-list'>{item?.NarrativeDate && getShowingWithOutTime(item?.NarrativeDate)}</td>
                                                                                        <td className='text-list'>{item?.ReportedBy}</td>
                                                                                        <td className='text-list'>{item?.NarrativeType}</td>
                                                                                        <td className='text-list'>{item?.Comments}</td>
                                                                                    </tr>
                                                                                    {/* <tr> Comment :- {item?.Comments}</tr> */}
                                                                                </tbody>
                                                                            </>
                                                                        ))
                                                                    }
                                                                </table>
                                                                <hr />
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default IncidentPublic