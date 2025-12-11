import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import { customStylesWithOutColor, Decrypt_Id_Name, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../Common/Utility';
import { Link } from 'react-router-dom';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import Select from "react-select";
import { Comman_changeArrayFormat, threeColArray } from '../../../Common/ChangeArrayFormat';
import { get_AgencyOfficer_Data, get_NIBRS_Drp_Data } from '../../../../redux/actions/DropDownsData';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';

const CaseNumberByDateReport = () => {


    const { GetDataTimeZone, datezone } = useContext(AgencyContext)
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);
    const cadCfsCodeDrpData = useSelector((state) => state.DropDown.cadCfsCodeDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const [multiImage, setMultiImage] = useState([]);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [loder, setLoder] = useState(false);
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);
    const [showFooter, setShowFooter] = useState(false);
    const [incidentStatusDrpDwn, setIncidentStatusDrpDwn] = useState([]);


    const [value, setValue] = useState({
        'ReportedDate': null, 'ReportedDateTo': null, 'AgencyID': '', 'OfficerPINID': null,
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
    });

    const [searchValue, setSearchValue] = useState({
        ReportedDate: '', ReportedDateTo: '', OfficerPINID: null,
    });

    const [showFields, setShowFields] = useState({
        showReportedDateFrom: false, showReportedDateTo: false, showOfficerName: false,
    });

    useEffect(() => {
        setShowFields({
            showReportedDateFrom: searchValue.ReportedDate, showReportedDateTo: searchValue.ReportedDateTo, showOfficerName: searchValue.OfficerPINID !== null,

        });
    }, [searchValue]);

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
            dispatch(get_ScreenPermissions_Data("I100", localStoreData?.AgencyID, localStoreData?.PINID));
            if (NIBRSDrpData?.length === 0) {
                dispatch(get_NIBRS_Drp_Data(LoginAgencyID));
            }
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData])

    useEffect(() => {
        if (LoginAgencyID) {
            dispatch(get_AgencyOfficer_Data(LoginAgencyID, ''))
            getIncidentStatus(LoginAgencyID);
        }
    }, [LoginAgencyID]);



    const getIncidentStatus = async (AgencyID) => {
        try {
            await fetchPostData("IncidentStatus/GetDataDropDown_IncidentStatus", { 'AgencyID': AgencyID }).then((res) => {
                // console.log("🚀 ~ getIncidentStatus ~ res:", res)
                if (res?.length > 0) {
                    setIncidentStatusDrpDwn(threeColArray(res, "IncidentStatusID", "Description", "IncidentStatusCode"));
                } else {
                    setIncidentStatusDrpDwn([]);
                }
            })
        } catch (error) {
            console.error("Error in getIncidentStatus: ", error);
            setIncidentStatusDrpDwn([]);
        }
    };
    const getIncidentSearchData = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.OfficerPINID !== null
        ) {
            const { ReportedDate, ReportedDateTo, OfficerPINID, IPAddress, SearchCriteria, SearchCriteriaJson, Status, } = myStateRef.current
            const val = {
                'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'OfficerPINID': OfficerPINID,
                'AgencyID': LoginAgencyID,
                IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'Report/PrintReport' : 'Report/DailyEventLog';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
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
        }
    }


    const resetFields = () => {
        setValue({ ...value, 'ReportedDate': null, 'ReportedDateTo': null, 'OfficerPINID': null, });
        setverifyIncident(false);
        setMasterReportData([]);
        setShowWatermark('');
    }

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoder(true);
        },
        onAfterPrint: () => {
            setLoder(false);
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



    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm();
            getIncidentSearchData(true);
            setShowFooter(false);
        }, 100);
    };

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("I100", localStoreData?.AgencyID, localStoreData?.PINID));
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


    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })

        } else {
            setValue({
                ...value,
                [name]: null
            })
        }
    }

    const handlChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    };

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
                                    <legend>Case Number By Date Report</legend>
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
                                    <div className="row mt-2">

                                        <div className="row col-12 col-md-12 col-lg-12">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label '>Reported Date From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 ">
                                                <DatePicker
                                                    name='ReportedDate'
                                                    id='ReportedDate'
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null, ['ReportedDateTo']: null }) }}
                                                    selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReportedDate ? true : false}
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    // disabled
                                                    maxDate={new Date(datezone)}
                                                    placeholderText='Select...'
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Reported Date To</label>
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
                                                    maxDate={new Date(datezone)}
                                                    minDate={new Date(value?.ReportedDate)}
                                                    placeholderText='Select...'
                                                    disabled={value?.ReportedDate ? false : true}
                                                    className={!value?.ReportedDate && 'readonlyColor'}

                                                />
                                            </div>
                                        </div>

                                        <div className="row col-12 col-md-12 col-lg-12">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>RMS Case # From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='VehicleNumber' id='VehicleNumber' style={{ textTransform: "uppercase" }} maxLength={12} value={value?.VehicleNumber} onChange={handlChange} className='' />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>RMS Case # To</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='VehicleNumberTo' id='VehicleNumberTo' style={{ textTransform: "uppercase" }} maxLength={12} value={value?.VehicleNumberTo} onChange={handlChange}
                                                    disabled={!value?.VehicleNumber?.trim()}
                                                    className={!value?.VehicleNumber?.trim() ? 'readonlyColor' : ''}
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Prime Investigator</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">

                                                <Select
                                                    styles={customStylesWithOutColor}
                                                    name='OfficerPINID'
                                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerPINID)}
                                                    isClearable
                                                    options={agencyOfficerDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'OfficerPINID')}
                                                    placeholder="Select..."
                                                />
                                            </div>
                                        </div>
                                        <div className="row col-12 col-md-12 col-lg-12">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Master Case # From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='VehicleNumber' id='VehicleNumber' style={{ textTransform: "uppercase" }} maxLength={12} value={value?.VehicleNumber} onChange={handlChange} className='' />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Master Case # To</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='VehicleNumberTo' id='VehicleNumberTo' style={{ textTransform: "uppercase" }} maxLength={12} value={value?.VehicleNumberTo} onChange={handlChange}
                                                    disabled={!value?.VehicleNumber?.trim()}
                                                    className={!value?.VehicleNumber?.trim() ? 'readonlyColor' : ''}
                                                />
                                            </div>

                                            <div className="col-3 col-md-3 col-lg-2 text-right mt-2">
                                                <label htmlFor="" className='new-label'>Case Status</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                <Select
                                                    name="CaseStatusID"
                                                    styles={customStylesWithOutColor}
                                                    value={incidentStatusDrpDwn?.filter((obj) => obj.value === value?.CaseStatusID)}
                                                    isClearable
                                                    options={incidentStatusDrpDwn}
                                                    // onChange={(e) => handleCaseStatus(e, "CaseStatusID")}
                                                    onChange={(e) => ChangeDropDown(e, 'CaseStatusID')}

                                                    placeholder="Select..."
                                                />
                                            </div>

                                        </div>
                                        <div className="col-12 col-md-12 col-lg-12 mt-4 text-right ">
                                            {/* {
                                                effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
                                                    : <></> :
                                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
                                            } */}
                                            <button className="btn btn-sm bg-green text-white px-2  ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                            <Link to={'/Reports'}>
                                                <button className="btn btn-sm bg-green text-white px-2  ml-2" >Close</button>
                                            </Link>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                verifyIncident &&
                <>
                    <div className="col-12 col-md-12 col-lg-12  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Daily Event Log</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    {/* <i className="fa fa-print" onClick={printForm}></i> */}
                                    <i className="fa fa-print" onClick={handlePrintClick}></i>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="container mt-1" >
                        <div className="col-12" >
                            <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }}>
                                <>
                                    <ReportAddress {...{ multiImage, masterReportData }} />
                                    {showWatermark && (
                                        <div className="watermark-print">Confidential</div>
                                    )}

                                </>
                                <div className="col-12">
                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Incident Daily Event Log Report</h5>
                                </div>
                                <div className="col-12 bb">
                                    <fieldset>
                                        <legend>Search Criteria</legend>

                                        {/* First Row */}
                                        <div className="row">
                                            {showFields.showReportedDateFrom && (
                                                <>
                                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                        <label className='new-label'>Reported Date From</label>
                                                    </div>
                                                    <div className="col-6 col-md-6 col-lg-5 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.ReportedDate && getShowingWithOutTime(searchValue.ReportedDate)}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}

                                            {showFields.showReportedDateTo && (
                                                <>
                                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                        <label className='new-label'>Reported Date To</label>
                                                    </div>
                                                    <div className="col-6 col-md-6 col-lg-5 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.ReportedDateTo && getShowingWithOutTime(searchValue.ReportedDateTo)}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Second Row */}
                                        <div className="row row-Daily">
                                            {showFields.showOfficerName && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Officer Name</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={agencyOfficerDrpData.find((obj) => obj.value === searchValue.OfficerPINID)?.label || ''}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}

                                        </div>
                                    </fieldset>
                                </div>

                                {
                                    masterReportData?.Incident?.map((obj) =>
                                        <>
                                            <div className="container-fluid mt-3" style={{ pageBreakAfter: 'always' }}>
                                                <h5 className=" text-white text-bold bg-green py-1 px-3"> Incident Number:- {obj.IncidentNumber}</h5>
                                                <div className="row">

                                                    <table className="table table-bordered">
                                                        <thead className='text-dark master-table'>
                                                            <tr>
                                                                <th className='' style={{ width: '150px' }}>Incident Number:</th>
                                                                <th className='' style={{ width: '150px' }}>Offense Code:</th>
                                                                <th className='' style={{ width: '150px' }}>Reported Date/Time:</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody className='master-tbody'>
                                                            <tr>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.IncidentNumber}</td>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.RMSCFSCode_Description}</td>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.ReportedDate && getShowingDateText(obj?.ReportedDate)}</td>

                                                            </tr>
                                                        </tbody>
                                                        <thead className='text-dark master-table'>
                                                            <tr>
                                                                <th className='' style={{ width: '150px' }}>Location:</th>
                                                                <th className='' style={{ width: '150px' }}>CAD CFS:</th>
                                                                <th className='' style={{ width: '150px' }}>Officer:</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className='master-tbody'>
                                                            <tr>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.CrimeLocation}</td>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.CADCFSCode_Description}</td>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.Officer_Name}</td>
                                                            </tr>
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
                                            </div >
                                        </>
                                    )
                                }
                                {showFooter && (
                                    <footer className="print-footer">
                                        <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                                    </footer>
                                )}
                            </div>
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

export default CaseNumberByDateReport