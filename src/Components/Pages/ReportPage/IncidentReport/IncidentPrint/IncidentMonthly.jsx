import React, { useEffect, useState, useContext, useRef } from 'react'
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingWithOutTime, getShowingDateText, getShowingWithMonthOnly, getShowingWithFixedTime01 } from '../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { fetchPostData } from '../../../../hooks/Api';
import { toastifyError } from '../../../../Common/AlertMsg';
import { useReactToPrint } from 'react-to-print';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import Loader from '../../../../Common/Loader';
import ReportAddress from '../../../ReportAddress/ReportAddress';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const IncidentMonthly = () => {

    const { GetDataTimeZone, datezone } = useContext(AgencyContext)
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const [multiImage, setMultiImage] = useState([]);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [startDate, setStartDate] = useState();
    const [incidentData, setIncidentData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [loder, setLoder] = useState(false);
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showFooter, setShowFooter] = useState(false);

    const [showWatermark, setShowWatermark] = useState(false);


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginUserName(localStoreData?.UserName); setloginPinID(parseInt(localStoreData?.PINID)); dispatch(get_ScreenPermissions_Data("I099", localStoreData?.AgencyID, localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData])

    const [value, setValue] = useState({
        'ReportedDate': '', 'AgencyID': '', 'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
    });

    const [searchValue, setSearchValue] = useState({
        ReportedDate: '',
    });

    const [showFields, setShowFields] = useState({
        showReportedDateFrom: false,
    });

    useEffect(() => {
        setShowFields({ showReportedDateFrom: searchValue.ReportedDate, });
    }, [searchValue]);

    useEffect(() => {
        if (incidentData?.length > 0) { setverifyIncident(true); }
    }, [incidentData]);

    const get_MonthlyReport = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0) {
            const { ReportedDate, AgencyID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, } = myStateRef.current;
            const val = {
                'ReportedDate': ReportedDate, 'AgencyID': LoginAgencyID, IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'Report/PrintReport' : 'Report/IncidentReport_Monthly';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    setIncidentData(res[0].Incident); setMasterReportData(res[0]); getAgencyImg(LoginAgencyID);
                    setSearchValue(value); setLoder(false);
                } else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setIncidentData([]); setverifyIncident(false); setLoder(false);
                    }
                }
                setIsPermissionsLoaded(false);
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setverifyIncident(false); setLoder(false); setIsPermissionsLoaded(false);
            }
        } else {
            toastifyError("Please Enter Details"); setLoder(false);
        }
    }

    const Reset = () => {
        setValue({ ...value, 'ReportedDate': '', });
        setStartDate(''); setverifyIncident(false); setIncidentData([]); setMasterReportData([]); setShowWatermark('')
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

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => { setLoder(true); },
        onAfterPrint: () => { setLoder(false); }
    });

    // const handlePrintClick = () => {
    //     setShowFooter(true); setTimeout(() => { printForm(); get_MonthlyReport(true); setShowFooter(false); }, 100);
    // };
    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm();
            get_MonthlyReport(true);
            setShowFooter(false);
        }, 100);
    };

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("I099", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {
        if (isPermissionsLoaded) {
            get_MonthlyReport()
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);


    useEffect(() => {
        myStateRef.current = value;
    }, [value])

    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset>
                                    <legend>Incident Monthly Report</legend>
                                    <div className="row mt-2">
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Year</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 ">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => { setStartDate(date); setValue({ ...value, ['ReportedDate']: getShowingWithOutTime(date) }) }}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                maxDate={new Date(datezone)}
                                                autoComplete="nope"
                                                placeholderText={'Select...'}
                                            />
                                        </div>
                                        <div className="col-9 col-md-9 col-lg-5 mt-1 pt-1 " >
                                            {
                                                effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_MonthlyReport(false); }} >Show Report</button>
                                                    : <></> :
                                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_MonthlyReport(false); }} >Show Report</button>
                                            }
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { Reset(); }}>Clear</button>
                                            <Link to={'/Reports'}> <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button> </Link>
                                        </div>

                                        <div className="form-check ml-2 col-9 col-md-9 col-lg-3 mt-1 pt-1 text-right">
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
                                    </div>
                                </fieldset>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* for 1 table */}
            {
                verifyIncident ?

                    incidentData?.length > 0 ?
                        <>
                            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">Incident Monthly Report</p>

                                    <div style={{ marginLeft: 'auto' }}>
                                        <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            <i className="fa fa-print" onClick={handlePrintClick}></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="container mt-1">
                                <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }}>
                                    <>
                                        <ReportAddress {...{ multiImage, masterReportData }} />
                                    </>
                                    {/* ----------------showWatermark---------------------- */}
                                    {showWatermark && (
                                        <div className="watermark-print">Confidential</div>
                                    )}
                                    <div className="col-12">
                                        <hr style={{ border: '1px solid rgb(20, 38, 51)' }} />
                                        <h5 className="text-white text-bold bg-green py-1 px-3 text-center">Incident Monthly Report</h5>
                                    </div>
                                    <div className="col-12">
                                        <fieldset>
                                            <legend>Search Criteria</legend>
                                            <div className="row">
                                                {showFields.showReportedDateFrom && (
                                                    <>
                                                        <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                            <label className='new-label'>Year</label>
                                                        </div>
                                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                            <input type="text" className='readonlyColor' value={searchValue.ReportedDate && getShowingWithMonthOnly(searchValue.ReportedDate)} readOnly />
                                                        </div>
                                                    </>
                                                )}

                                            </div>
                                        </fieldset>
                                    </div>
                                    {
                                        incidentData?.length > 0 ?
                                            <>
                                                <div className="container">
                                                    <div className="col-12">
                                                        <div className="table-responsive">
                                                            <div className='d-flex justify-content-between bb bt'>
                                                                <h6 className='text-dark'>Patrol Zone <span></span></h6>
                                                                <h6 className='text-dark'>Zip Code: <span className='text-gray'>{masterReportData?.Zipcode}</span> </h6>
                                                                <h6 className='text-dark'>City: <span className='text-gray'> {masterReportData?.CityName}</span></h6>
                                                            </div>
                                                            <table className="table">
                                                                <thead className='text-dark master-table'>
                                                                    <tr className='bb'>
                                                                        <th className='' style={{ width: '100px' }}>Incident Number</th>
                                                                        <th className='' style={{ width: '150px' }}>Reported Date/Time</th>
                                                                        <th className='' style={{ width: '150px' }}>Officer</th>
                                                                        <th className='' style={{ width: '150px' }}>CAD CFS Code</th>
                                                                        <th className='' style={{ width: '150px' }}>Crime Location</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className='master-tbody'>
                                                                    {
                                                                        incidentData?.map((item, key) => (
                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                <td style={{ width: '100px' }} className='text-list'>{item.IncidentNumber}</td>
                                                                                <td style={{ width: '150px' }} className='text-list'>{item.ReportedDate && getShowingDateText(item.ReportedDate)}</td>
                                                                                <td style={{ width: '150px' }} className='text-list'>{item.Officer_Name}</td>
                                                                                <td style={{ width: '150px' }} className='text-list'>{item.CADCFSCode_Description}</td>
                                                                                <td style={{ width: '150px' }} className='text-list'>{item.CrimeLocation}</td>
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
                                    {showFooter && (
                                        <footer className="print-footer">
                                            <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                                        </footer>
                                    )}
                                </div>

                            </div>
                        </> : <> </> : <> </>
            }
            {loder && (
                <div className="loader-overlay"> <Loader />  </div>
            )}
        </>
    )
}
export default IncidentMonthly

