import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { colorLessStyle_Select } from '../../Utility/CustomStylesForReact';
import { useSelector } from 'react-redux';
import ReportsServices from "../../../CADServices/APIs/reports";
import { toastifyError } from '../../../Components/Common/AlertMsg';
import { fetchPostData } from '../../../Components/hooks/Api';
import Loader from '../../../Components/Common/Loader';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime } from '../../../Components/Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import ReportMainAddress from '../ReportMainAddress/ReportMainAddress';
import { getData_DropDown_Operator } from '../../../CADRedux/actions/DropDownsData';

const OnOffDutyOfficerReport = () => {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const dispatch = useDispatch();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loader, setLoader] = useState(false);
    const [verifyIncident, setVerifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [onOffDutyOfficerData, setOnOffDutyOfficerData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);

    const [
        onOffDutyOfficerState,
        ,
        handleOnOffDutyOfficerState,
        clearOnOffDutyOfficerState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        callTaker: "",
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        callTaker: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showCallTaker: false,
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showCallTaker: searchValue?.callTaker,
        });
    }, [searchValue]);

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const resetFields = () => {
        clearOnOffDutyOfficerState();
        setOnOffDutyOfficerData([]);
        setAgencyData();
        setLoader(false);
        setVerifyIncident(false);
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoader(true);
        },
        onAfterPrint: () => {
            setLoader(false);
        }
    });

    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            }
            else { console.log("error") }
        })
    }

    const getIncidentSearchData = async (isPrintReport = false) => {
        setLoader(true);
        if (
            !onOffDutyOfficerState?.reportedFromDate &&
            !onOffDutyOfficerState?.reportedToDate &&
            !onOffDutyOfficerState?.callTaker?.PINID

        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setVerifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "ReportedFromDate": onOffDutyOfficerState?.reportedFromDate ? getShowingMonthDateYear(onOffDutyOfficerState?.reportedFromDate) : "",
            "ReportedToDate": onOffDutyOfficerState?.reportedToDate ? getShowingMonthDateYear(onOffDutyOfficerState?.reportedToDate) : "",
            "OfficerID": onOffDutyOfficerState?.callTaker?.PINID,
        }
        setSearchValue(onOffDutyOfficerState)
        try {
            const response = await ReportsServices.getOfficerOnOffDutyReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setOnOffDutyOfficerData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setVerifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setOnOffDutyOfficerData([]);
                    setAgencyData([])
                    setVerifyIncident(false);
                    setLoader(false);
                }
            }
        } catch (error) {
            if (!isPrintReport) {
                toastifyError("Data Not Available");
            }
            setVerifyIncident(false); setLoader(false);
        }
    }

    const handlePrintClick = () => {
        setLoader(true)
        setShowFooter(true);
        setTimeout(() => {
            printForm(); getIncidentSearchData(true); setShowFooter(false);
        }, 100);
    };

    return (
        <>
            <div className="section-body pt-1 p-1 bt" >
                <div className="div">
                    <div className="dark-row" >
                        <div className="col-12 col-sm-12">
                            <div className="card Agency">
                                <div className="card-body pt-3 pb-2" >
                                    <div className="row " style={{ marginTop: '-10px' }}>
                                        <div className="col-12 mt-2">
                                            <fieldset>
                                                <legend>On/Off Duty Report By Officer</legend>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Reported From Date
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <DatePicker
                                                            name='startDate'
                                                            id='startDate'
                                                            onChange={(date) => {
                                                                handleOnOffDutyOfficerState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleOnOffDutyOfficerState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={onOffDutyOfficerState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={onOffDutyOfficerState?.reportedFromDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select From Date..."
                                                            maxDate={new Date(datezone)}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Reported To Date
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <DatePicker
                                                            name='reportedToDate'
                                                            id='reportedToDate'
                                                            onChange={(date) => {
                                                                handleOnOffDutyOfficerState("reportedToDate", date);
                                                            }}
                                                            selected={onOffDutyOfficerState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={onOffDutyOfficerState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={onOffDutyOfficerState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!onOffDutyOfficerState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!onOffDutyOfficerState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Officer
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            options={OperatorDrpData}
                                                            getOptionLabel={(v) => v?.displayName}
                                                            getOptionValue={(v) => v?.PINID}
                                                            value={onOffDutyOfficerState?.callTaker}
                                                            isClearable
                                                            onChange={(e) => { handleOnOffDutyOfficerState("callTaker", e) }}
                                                        />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        onClick={() => { resetFields(); }}
                                    >Clear</button>
                                    <Link to={'/cad/dashboard-page'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        >Close</button>
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
                    <div className="col-12 col-md-12 col-lg-12  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">On/Off Duty Report By Officer</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    <i className="fa fa-print" onClick={handlePrintClick}></i>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="container mt-1" ref={componentRef}>
                        <div className="col-12" >
                            <div className="row" >
                                {/* Report Address */}
                                <ReportMainAddress {...{ multiImage, agencyData }} />

                                <div className="col-12">
                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    <p className=" py-1 text-center text-white bg-green" style={{
                                        textAlign: "center", fontWeight: "bold", fontSize: "20px"
                                    }}>On/Off Duty Report By Officer</p>
                                </div>
                                <div className="col-12 mt-1 mb-3">
                                    <fieldset>
                                        <legend>Search Criteria</legend>
                                        <div className="row mt-2">
                                            {showFields.showReportedFromDate && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Reported From Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.reportedFromDate ? getShowingWithOutTime(searchValue.reportedFromDate) : ""}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showReportedToDate && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Reported To Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.reportedToDate ? getShowingWithOutTime(searchValue.reportedToDate) : ""}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showCallTaker && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Officer</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.callTaker?.displayName2 || ""}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </fieldset>
                                </div>
                                {
                                    <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead className="text-dark master-table text-bold">
                                                    <tr>
                                                        <th className="">Officer</th>
                                                        <th className="">On Duty</th>
                                                        <th className="">Off Duty</th>
                                                        <th className="" style={{ width: '100px' }}>Total Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="master-tbody">
                                                    {onOffDutyOfficerData
                                                        .map((obj) => (
                                                            <tr>
                                                                <td className="text-list">{obj.OfficerName}</td>
                                                                <td className="text-list">{obj.OnDutyTime && getShowingDateText(obj.OnDutyTime)}</td>
                                                                <td className="text-list">{obj.OffDutyTime && getShowingDateText(obj.OffDutyTime)}</td>
                                                                <td className="text-list" style={{ width: '100px' }}>{obj.Duration_HH_MM}</td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                                {showFooter && (
                                    <div className="print-footer">
                                        <div className="text-bold py-1 px-3 mb-4 mr-3 ml-3" style={{ backgroundColor: '#e7eaed', color: 'black', textAlign: 'left', fontSize: "16px" }}>
                                            Printed By: {LoginUserName || '-'} on {getShowingWithOutTime(datezone) || ''}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                loader && (
                    <div className="loader-overlay">
                        <Loader />
                    </div>
                )
            }
        </>
    )
}

export default OnOffDutyOfficerReport