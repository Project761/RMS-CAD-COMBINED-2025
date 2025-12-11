import React, { useRef } from 'react'
import { Decrypt_Id_Name, changeArrayFormat, customStylesWithOutColor, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../../Common/Utility'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import img from '../../../../../../src/img/images1.jpg'
import { fetchPostData } from '../../../../hooks/Api';
import { toastifyError } from '../../../../Common/AlertMsg';
import { useEffect } from 'react';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import Loader from '../../../../Common/Loader';
import ReportAddress from '../../../ReportAddress/ReportAddress';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const IncidentOfficer = () => {

    const { GetDataTimeZone, datezone } = useContext(AgencyContext)
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [multiImage, setMultiImage] = useState([]);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [incidentData, setIncidentData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [loder, setLoder] = useState(false);
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const ipAddress = sessionStorage.getItem('IPAddress');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);

    const [value, setValue] = useState({
        'ReportedDate': "", 'ReportedDateTo': "", 'OfficerPINID': null, 'AgencyID': null,
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
    });

    const [searchValue, setSearchValue] = useState({
        ReportedDate: '',
        ReportedDateTo: '',
        OfficerPINID: null
    });

    const [showFields, setShowFields] = useState({
        showReportedDateFrom: false,
        showReportedDateTo: false,
        showOfficerName: false,
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        setShowFields({
            showReportedDateFrom: searchValue.ReportedDate,
            showReportedDateTo: searchValue.ReportedDateTo,
            showOfficerName: searchValue.OfficerPINID !== null,
        });
    }, [searchValue]);

    // Onload Function
    useEffect(() => {
        if (localStoreData) {
            console.log(localStoreData)
            setloginPinID(parseInt(localStoreData?.PINID));
            setLoginAgencyID(localStoreData?.AgencyID); get_Head_Of_Agency(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID); setLoginUserName(localStoreData?.UserName)
            dispatch(get_ScreenPermissions_Data("I098", localStoreData?.AgencyID, localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData])

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            } else {
                setHeadOfAgency([])
            }
        })
    };

    // const getIncidentSearchData = async () => {
    //     if (value?.ReportedDate?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.OfficerPINID !== null) {
    //         const { ReportedDate, ReportedDateTo, OfficerPINID, AgencyID, } = value
    //         const val = { 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'OfficerPINID': OfficerPINID, 'AgencyID': LoginAgencyID, }
    //         fetchPostData('Report/IncidentOfficer', val).then((res) => {
    //             if (res.length > 0) {
    //                 setIncidentData(res[0].Incident); setMasterReportData(res[0]); setverifyIncident(true); getAgencyImg(LoginAgencyID);
    //                 setSearchValue(value);
    //             } else {
    //                 toastifyError("Data Not Available");
    //                 setMasterReportData([]);
    //                 setverifyIncident(false);
    //             }
    //         });
    //     } else {
    //         toastifyError("Please Enter Details");
    //     }
    // }
    const getIncidentSearchData = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.OfficerPINID !== null) {
            const { ReportedDate, ReportedDateTo, OfficerPINID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, } = myStateRef.current
            const val = { 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'OfficerPINID': OfficerPINID, 'AgencyID': LoginAgencyID, IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK, }
            try {
                const apiUrl = isPrintReport ? 'Report/PrintReport' : 'Report/IncidentOfficer';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    console.log(res);
                    setIncidentData(res[0].Incident);
                    setMasterReportData(res[0]);
                    setverifyIncident(true);
                    getAgencyImg(LoginAgencyID);
                    setSearchValue(value);
                    setLoder(false);
                } else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available");
                        setMasterReportData([]);
                        setverifyIncident(false);
                        setLoder(false);
                    }


                }
                setIsPermissionsLoaded(false);

            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setverifyIncident(false);
                setLoder(false);
                setIsPermissionsLoaded(false);

            }

        } else {
            toastifyError("Please Enter Details");
            setLoder(false);
            // setverifyIncident(false);

        }
    }
    const ChangeDropDown = (e, name) => {
        if (e) { setValue({ ...value, [name]: e.value }) }
        else { setValue({ ...value, [name]: null }) }
    }

    const resetFields = () => {
        setValue({ ...value, 'ReportedDate': "", 'ReportedDateTo': "", 'OfficerPINID': null, });
        setMasterReportData([]); setverifyIncident(false); setIncidentData([]); setShowWatermark('')
    }

    const componentRef = useRef();
    // const printForm = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: 'Data',
    //     onAfterPrint: () => { '' }
    // })


    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoder(true);
            setShowFooter(true);
        },
        onAfterPrint: () => {
            setLoder(false);
            setShowFooter(false);
        }
    });
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
    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm(); getIncidentSearchData(true); setShowFooter(false);
        }, 100);
    };
    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("I098", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {

        if (isPermissionsLoaded) {
            getIncidentSearchData()
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);


    useEffect(() => {
        myStateRef.current = value;
    }, [value])

    function formatRawInput(value) {
        // Remove non-digit characters
        const cleaned = value?.replace(/\D/g, '');

        // MMddyyyy handling
        if (cleaned?.length === 8) {
            const mm = cleaned?.slice(0, 2);
            const dd = cleaned?.slice(2, 4);
            const yyyy = cleaned?.slice(4, 8);
            return `${mm}/${dd}/${yyyy}`;
        }

        return value;
    }



    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset>
                                    <legend>Incident Officer Report</legend>
                                    <div className="form-check ml-2 col-9 col-md-9 col-lg-12 mt-1 pt-1 text-right">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="watermarkCheckbox"
                                            checked={showWatermark}
                                            onChange={(e) => setShowWatermark(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="watermarkCheckbox">
                                            Print Confidential Report
                                        </label>
                                    </div>
                                    <div className="row">
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Reported From Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 ">
                                            <DatePicker
                                                name='ReportedDate'
                                                id='ReportedDate'
                                                onChange={(date) => {
                                                    if (date) {
                                                        setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null, ['ReportedDateTo']: null })
                                                    }
                                                    else {
                                                        setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null, ['ReportedDateTo']: '', })
                                                    }
                                                }}
                                                selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ReportedDate ? true : false}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={false}
                                                maxDate={new Date(datezone)}
                                                placeholderText='Select...'
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Reported To Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2  ">
                                            <DatePicker
                                                name='ReportedDateTo'
                                                id='ReportedDateTo'
                                                onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ReportedDateTo ? true : false}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                minDate={new Date(value?.ReportedDate)}
                                                maxDate={new Date(datezone)}
                                                placeholderText='Select...'
                                                disabled={value?.ReportedDate ? false : true}
                                                className={!value?.ReportedDate && 'readonlyColor'}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Officer&nbsp;Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                            <Select
                                                styles={customStylesWithOutColor}
                                                name='OfficerPINID'
                                                value={headOfAgency?.filter((obj) => obj.value === value?.OfficerPINID)}
                                                isClearable
                                                options={headOfAgency}
                                                onChange={(e) => ChangeDropDown(e, 'OfficerPINID')}
                                                placeholder="Select..."
                                            />
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-12 mt-2 text-right">
                                            {/* <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { getIncidentSearchData(); }}>Show Report</button> */}
                                            {
                                                effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
                                                    : <></> :
                                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
                                            }
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                            <Link to={'/Reports'}>
                                                <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                            </Link>
                                        </div>
                                    </div>
                                </fieldset>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {
                verifyIncident &&
                <>
                    <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Incident By Officer Report</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    {/* <i className="fa fa-print" onClick={printForm}></i> */}
                                    <i className="fa fa-print" onClick={handlePrintClick}></i>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="container mt-1 ">
                        <div className="row" ref={componentRef}>
                            <table className="print-table" >
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className='content row '>
                                                <>
                                                    <ReportAddress {...{ multiImage, masterReportData }} />
                                                </>
                                                {showWatermark && (
                                                    <div className="watermark-print">Confidential</div>
                                                )}
                                                <div className="col-12">
                                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                    <h5 className="text-center text-white text-bold bg-green  py-1" >Incident By Officer Report</h5>

                                                </div>
                                                <div className="col-12"  >
                                                    <fieldset>
                                                        <legend>Search Criteria</legend>
                                                        <div className="row">
                                                            {showFields.showReportedDateFrom && (
                                                                <>
                                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                        <label className='new-label'>Reported Date From</label>
                                                                    </div>
                                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                                        <input type="text" className='readonlyColor'
                                                                            //  value={searchValue.ReportedDate || ''}
                                                                            readOnly
                                                                            value={searchValue.ReportedDate && getShowingWithOutTime(searchValue.ReportedDate)}
                                                                        />
                                                                        {/* <input type="text" className='readonlyColor' value={searchValue.ReportedDate ? getShowingWithOutTime(searchValue.ReportedDate) : ''} readOnly /> */}
                                                                    </div>
                                                                </>
                                                            )}

                                                            {showFields.showReportedDateTo && (
                                                                <>
                                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                        <label className='new-label'>Reported Date To</label>
                                                                    </div>
                                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                                        <input type="text" className='readonlyColor'
                                                                            //  value={searchValue.ReportedDateTo || ''} 
                                                                            value={searchValue.ReportedDateTo && getShowingWithOutTime(searchValue.ReportedDateTo)}
                                                                            readOnly />
                                                                        {/* <input type="text" className='readonlyColor' value={searchValue.ReportedDateTo ? getShowingWithOutTime(searchValue.ReportedDateTo) : ''} readOnly /> */}
                                                                    </div>
                                                                </>
                                                            )}

                                                            {showFields.showOfficerName && (
                                                                <>
                                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                        <label className='new-label'>Officer Name</label>
                                                                    </div>
                                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                                        <input type="text" className='readonlyColor' value={headOfAgency.find((obj) => obj.value === searchValue.OfficerPINID)?.label || ''} readOnly />
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </fieldset>
                                                    {masterReportData?.Incident?.map((obj) => (
                                                        obj?.Incident && JSON.parse(obj?.Incident).length > 0 ? (
                                                            <>
                                                                <div className="container-fluid ">
                                                                    <div className="col-12 ">
                                                                        <div className="table-responsive">
                                                                            <table className="table table-bordered">
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th scope="col" colSpan='2' style={{ width: '100px' }}>
                                                                                            Officer Name:- <span style={{ color: '#000', fontWeight: 'bold' }}>
                                                                                                {obj?.Officer_Name}
                                                                                            </span>
                                                                                        </th>
                                                                                        <th scope="col">Total Incident: <span style={{ color: '#000', fontWeight: 'bold' }}>
                                                                                            {JSON.parse(obj?.Incident).length}
                                                                                        </span></th>
                                                                                    </tr>
                                                                                </thead>
                                                                            </table>
                                                                            <table className="table table-bordered ">
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>Incident Number:</th>
                                                                                        <th className=''>Reported Date/Time:</th>
                                                                                        <th className=''>Offense:</th>
                                                                                        <th className=''>Exceptional Clearance(Yes/No):</th>
                                                                                        <th className=''>CAD Disposition:</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.Incident)?.map((incident, key) => (
                                                                                            <tr key={key}>
                                                                                                <td className='text-list'>{incident?.IncidentNumber}</td>
                                                                                                <td className='text-list'>{incident?.ReportedDate && getShowingDateText(incident?.ReportedDate)}</td>
                                                                                                <td className='text-list'>{incident?.RMSCFSCode_Description}</td>
                                                                                                <td className='text-list'>{incident?.RMS_Disposition}</td>
                                                                                                <td className='text-list'>{incident?.CADDispositions_Description}</td>
                                                                                            </tr>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                                {/* <tfoot className="table-footer ">
                                                                <tr style={{ textAlign: 'center', fontSize: '45px', color: '#000', }}>
                                                                    <td colSpan={5}>
                                                                        {showFooter && `Officer Name:${LoginUserName} - Date/Time:${datezone} - IP Address:${ipAddress}`}
                                                                    </td>


                                                                </tr>
                                                            </tfoot> */}
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                    <hr />
                                                                </div>
                                                            </>
                                                        ) : null
                                                    ))}

                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                                <tfoot>
                                    <tr>
                                        <div className="footer-space"></div>
                                    </tr>
                                </tfoot>
                            </table>



                            {showFooter && (
                                <footer className="print-footer">
                                    <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')}| IP Address: {ipAddress || ''}</p>
                                </footer>
                            )}
                        </div>

                    </div>

                </>

            }
            {loder && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )}

        </>
    )
}

export default IncidentOfficer



