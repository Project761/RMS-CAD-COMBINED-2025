import React, { useEffect, useState, useContext, useRef } from 'react';
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingWithOutTime, getShowingDateText, getShowingWithMonthOnly, getShowingWithFixedTime01 } from '../../../Common/Utility';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import ReportAddress from '../../ReportAddress/ReportAddress';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import Loader from '../../../Common/Loader';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';


const ArrestMonthly = () => {

    const { GetDataTimeZone, datezone } = useContext(AgencyContext);

    const dispatch = useDispatch();

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const [multiImage, setMultiImage] = useState([]);
    const [verifyArrest, setVerifyArrest] = useState(false);
    const [startDate, setStartDate] = useState();
    const [arrestData, setArrestData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [loder, setLoder] = useState(false);
    const [loginPinID, setloginPinID] = useState('');
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
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginUserName(localStoreData?.UserName);
            setloginPinID(parseInt(localStoreData?.PINID));
            dispatch(get_ScreenPermissions_Data("I099", localStoreData?.AgencyID, localStoreData?.PINID)); // agar Arrest ka alag ScreenCode hai toh yahan change karna
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    const [value, setValue] = useState({
        ReportedDate: '',
        AgencyID: '',
    });

    const [searchValue, setSearchValue] = useState({
        ReportedDate: '',
    });

    const [showFields, setShowFields] = useState({
        showReportedDateFrom: false,
    });

    useEffect(() => {
        setShowFields({ showReportedDateFrom: searchValue.ReportedDate });
    }, [searchValue]);

    useEffect(() => {
        if (arrestData?.length > 0) {
            setVerifyArrest(true);
        }
    }, [arrestData]);

    const myStateRef = useRef(value);

    useEffect(() => {
        myStateRef.current = value;
    }, [value]);

    //     api/ArrestReport/ArrestReport_Monthly
    // ArrestDtTm
    // AgencyID

    const get_MonthlyReport = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0) {

            const { ReportedDate } = myStateRef.current;

            const val = { ArrestDtTm: ReportedDate, AgencyID: LoginAgencyID, };
            try {
                const res = await fetchPostData('ArrestReport/ArrestReport_Monthly', val);
                console.log(res)
                if (res.length > 0) {
                    const data = res[0].Arrest || res[0].Incident || [];
                    setArrestData(data);
                    setMasterReportData(res[0]);
                    getAgencyImg(LoginAgencyID);
                    setSearchValue(value);
                    setLoder(false);

                } else {
                    toastifyError("Data Not Available");
                    setArrestData([]);
                    setLoder(false);

                }

            } catch (error) {
                console.log(error)
                setLoder(false);

            }
        } else {
            toastifyError("Please Enter Details");
            setLoder(false);
        }
    };



    const Reset = () => {
        setValue({ ...value, ReportedDate: '' });
        setStartDate('');
        setVerifyArrest(false);
        setArrestData([]);
        setMasterReportData([]);
        setShowWatermark(false);
    };

    const getAgencyImg = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID };
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            } else {
                console.log("error");
            }
        });
    };

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Arrest-Monthly-Report',
        onBeforeGetContent: () => { setLoder(true); },
        onAfterPrint: () => { setLoder(false); }
    });

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
            get_MonthlyReport();
        }
    }, [isPermissionsLoaded]);

    return (
        <>
            {/* ========= FILTER / TOP FORM ========= */}
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset>
                                    <legend>Arrest Monthly Report</legend>
                                    <div className="row mt-2">
                                        <div className="col-3 col-md-3 col-lg-1 mt-2">
                                            <label className="new-label">Year</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => {
                                                    setStartDate(date);
                                                    setValue({
                                                        ...value,
                                                        ReportedDate: getShowingWithOutTime(date)
                                                    });
                                                }}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                maxDate={new Date(datezone)}
                                                autoComplete="nope"
                                                placeholderText="Select..."
                                            />
                                        </div>

                                        <div className="col-9 col-md-9 col-lg-5 mt-1 pt-1">
                                            {effectiveScreenPermission
                                                ? effectiveScreenPermission[0]?.AddOK
                                                    ? (
                                                        <button
                                                            className="btn btn-sm bg-green text-white px-2 py-1"
                                                            onClick={() => { get_MonthlyReport(false); }}
                                                        >
                                                            Show Report
                                                        </button>
                                                    )
                                                    : <></>
                                                : (
                                                    <button
                                                        className="btn btn-sm bg-green text-white px-2 py-1"
                                                        onClick={() => { get_MonthlyReport(false); }}
                                                    >
                                                        Show Report
                                                    </button>
                                                )}
                                            <button
                                                className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                                onClick={Reset}
                                            >
                                                Clear
                                            </button>
                                            <Link to="/Reports">
                                                <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2">
                                                    Close
                                                </button>
                                            </Link>
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

            {/* ========= REPORT SECTION ========= */}
            {verifyArrest && (
                arrestData?.length > 0 ? (
                    <>
                        <div className="col-12 col-md-12 col-lg-12 pt-2 px-2">
                            <div className="bg-line py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">
                                    Arrest Monthly Report
                                </p>

                                <div style={{ marginLeft: 'auto' }}>
                                    <Link
                                        to=""
                                        className="btn btn-sm bg-green mr-2 text-white px-2 py-0"
                                    >
                                        <i className="fa fa-print" onClick={handlePrintClick}></i>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="container mt-1">
                            <div
                                className="row clearfix"
                                ref={componentRef}
                                style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }}
                            >
                                <ReportAddress {...{ multiImage, masterReportData }} />
                                {/* Watermark */}
                                {showWatermark && (
                                    <div className="watermark-print">Confidential</div>
                                )}
                                <div className="col-12">
                                    <hr style={{ border: '1px solid rgb(20, 38, 51)' }} />
                                    <h5 className="text-white text-bold bg-green py-1 px-3 text-center">
                                        Arrest Monthly Report
                                    </h5>
                                </div>

                                {/* Search Criteria show */}
                                <div className="col-12">
                                    <fieldset>
                                        <legend>Search Criteria</legend>
                                        <div className="row">
                                            {showFields.showReportedDateFrom && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className="new-label">Year</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                        <input
                                                            type="text"
                                                            className="readonlyColor"
                                                            value={
                                                                searchValue.ReportedDate &&
                                                                getShowingWithMonthOnly(searchValue.ReportedDate)
                                                            }
                                                            readOnly
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </fieldset>
                                </div>
                                {/* Arrest table */}
                                {arrestData?.length > 0 && (
                                    <div className="container">
                                        <div className="col-12">
                                            <div className="table-responsive">
                                                {/* <div className="d-flex justify-content-between bb bt">
                                                    <h6 className="text-dark">
                                                        Patrol Zone <span></span>
                                                    </h6>
                                                    <h6 className="text-dark">
                                                        Zip Code:{' '}
                                                        <span className="text-gray">
                                                            {masterReportData?.Zipcode}
                                                        </span>
                                                    </h6>
                                                    <h6 className="text-dark">
                                                        City:{' '}
                                                        <span className="text-gray">
                                                            {masterReportData?.CityName}
                                                        </span>
                                                    </h6>
                                                </div> */}

                                                <table className="table" style={{ border: "1px solid #444" }}>
                                                    <thead className="text-dark master-table" style={{ background: "#f2f2f2" }}>
                                                        <tr className="bb" style={{ borderBottom: "2px solid #444" }}>
                                                            <th style={{ width: '110px', border: "1px solid #444" }}>Arrest Number</th>
                                                            <th style={{ width: '140px', border: "1px solid #444" }}>Arrestee</th>
                                                            <th style={{ width: '140px', border: "1px solid #444" }}>Arrest Date/Time</th>
                                                            <th style={{ width: '140px', border: "1px solid #444" }}>Location</th>
                                                            <th style={{ width: '120px', border: "1px solid #444" }}>DOB</th>
                                                            <th style={{ width: '80px', border: "1px solid #444" }}>AGE</th>
                                                            <th style={{ width: '80px', border: "1px solid #444" }}>SEX</th>

                                                            <th style={{ width: '220px', border: "1px solid #444" }}>Reason Code</th>
                                                            <th style={{ width: '260px', border: "1px solid #444" }}>Charge</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody className="master-tbody">
                                                        {arrestData?.map((item, key) => (
                                                            <tr
                                                                key={key}
                                                                style={{ borderBottom: "1px solid #ccc" }}
                                                            >
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">{item.ArrestNumber || ''}</td>
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">{item.Arrestee_Name}</td>
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">
                                                                    {item.ArrestDtTm ? getShowingDateText(item.ArrestDtTm) : ''}
                                                                </td>
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">{item?.CrimeLocation || ''}</td>
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">
                                                                    {item.DOB ? getShowingDateText(item.DOB) : ''}
                                                                </td>
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">{item.Age || ''}</td>
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">{item.Gender || ''}</td>

                                                                {/* Wider Columns */}
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">{item.NameReasonCode || ''}</td>
                                                                <td style={{ border: "1px solid #ccc" }} className="text-list">{item.Charge || ''}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>


                                                <hr />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Footer (Officer / IP / Time) */}
                                {showFooter && (
                                    <footer className="print-footer">
                                        <p>
                                            Officer Name: {LoginUserName || ''} | Date/Time:{' '}
                                            {getShowingWithFixedTime01(datezone || '')} | IP Address:{' '}
                                            {ipAddress || ''}
                                        </p>
                                    </footer>
                                )}
                            </div>
                        </div>
                    </>
                ) : <></>
            )}
            {loder && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )}
        </>
    );
};

export default ArrestMonthly;
