import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingMonthDateYear, getShowingMonthDateYearNibReport, getShowingWithFixedTime, getShowingWithFixedTime00, getShowingWithOutTime } from '../../Common/Utility';
import { fetchPostData } from '../../hooks/Api';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useDispatch } from 'react-redux';
import { AgencyContext } from '../../../Context/Agency/Index';
import Loader from '../../Common/Loader';

var FileSaver = require('file-saver');

const Nibrs_Report_Model = ({ show, setShow, handleModel }) => {

    const { GetDataTimeZone, datezone, } = useContext(AgencyContext);

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const dispatch = useDispatch();


    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [oriNumber, setOriNumber] = useState('');
    const [baseDate, setBaseDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginPinID, setloginPinID] = useState('');

    useEffect(() => {
        if (!localStoreData.AgencyID || !localStoreData.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        GetDataTimeZone(localStoreData?.AgencyID);
        setValueObj({
            ...valueObj,

            "dtpDateFrom": datezone ? getShowingMonthDateYearNibReport(datezone, "from") : null,
            "dtpDateTo": datezone ? getShowingMonthDateYearNibReport(datezone, "to") : null,
        })
    }, [show])

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setloginPinID(localStoreData?.PINID); getAgencySettingData(localStoreData?.AgencyID);
            setOriNumber(localStoreData?.ORI);
            // setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData, show]);

    useEffect(() => {
        if (loginAgencyID) {
            getAgencySettingData(loginAgencyID);
        }
    }, [loginAgencyID, show]);

    const getAgencySettingData = (aId) => {
        fetchPostData('Agency/GetData_SingleData', { 'AgencyID': aId })
            .then((res) => {
                setBaseDate(res[0]?.BaseDate);
            })
    };

    const [valueObj, setValueObj] = useState({
        "TxtYear": "",
        "txtMonth": "",
        "rdbMonthlyReport": false,

        "strORINumber": "",
        "gIntAgencyID": "",
        "IsIncidentCheck": false,


        "rdbAllLogFile": true,
        "rdbSubmissionFile": false,
        "rdbErrorLog": false,
        "rdbNonReportable": false,

        "chkPastErrorPrint": true,
        "rdbOne": true,
        "rdbTwoMonth": false,
        "rdbThreeMonth": false,
        "chkStatetoSubmit": false,


        "BaseDate": "",
        "strComputerName": "",
    });

    const [showNoObj, setShowNoObj] = useState({
        NonReportable: '',
        PastError: '',
        PastSubmission: '',
        ProcessArrestA: '',
        ProcessArrestB: '',
        ProcessIncident: '',
        SucessfullyIncident: '',
        TotalArrest: '',
        TotalIncidentNumber: '',
        lblTime: '',
        processsuc: '',
        processvh: '',
        totalSuc: '',
        totalVH: '',
        ErrorIncident: '',

    })

    const getfileUrlToDownload = async () => {
        setIsLoading(true);

        const {
            TxtYear, txtMonth, rdbMonthlyReport, strORINumber, gIntAgencyID, IsIncidentCheck,
            rdbAllLogFile, rdbSubmissionFile, rdbErrorLog, rdbNonReportable, chkPastErrorPrint,
            rdbOne, rdbTwoMonth, rdbThreeMonth, dtpDateFrom, dtpDateTo, UserId, chkStatetoSubmit
        } = valueObj
        const val = {
            "TxtYear": TxtYear,
            "txtMonth": txtMonth,
            "rdbMonthlyReport": rdbMonthlyReport,
            'UserId': loginPinID,
            "gIntAgencyID": loginAgencyID,
            "IsIncidentCheck": IsIncidentCheck,

            "rdbAllLogFile": rdbAllLogFile,
            "rdbSubmissionFile": rdbSubmissionFile,
            "rdbErrorLog": rdbErrorLog,
            "rdbNonReportable": rdbNonReportable,

            "chkPastErrorPrint": chkPastErrorPrint,
            "rdbOne": rdbOne,
            "rdbTwoMonth": rdbTwoMonth,
            "rdbThreeMonth": rdbThreeMonth,

            "dtpDateFrom": dtpDateFrom,
            // "dtpDateTo": dtpDateTo,
            "dtpDateTo": dtpDateTo ? dtpDateTo : getShowingMonthDateYearNibReport(datezone),
            "chkStatetoSubmit": chkStatetoSubmit,

            "BaseDate": baseDate ? getShowingMonthDateYearNibReport(baseDate) : null,
            "strComputerName": uniqueId,
            "strORINumber": oriNumber,

        }

        const res = await fetchPostData('NIBRS/TXIBRS', val);

        setShowNoObj({
            ...showNoObj,
            NonReportable: res[0]?.NonReportable,
            PastError: res[0]?.PastError,
            PastSubmission: res[0]?.PastSubmission,
            ProcessArrestA: res[0]?.ProcessArrestA,
            ProcessArrestB: res[0]?.ProcessArrestB,
            ProcessIncident: res[0]?.ProcessIncident,
            SucessfullyIncident: res[0]?.SucessfullyIncident,
            TotalArrest: res[0]?.TotalArrest,
            TotalIncidentNumber: res[0]?.TotalIncidentNumber,
            lblTime: res[0]?.lblTime,
            processsuc: res[0]?.processsuc,
            processvh: res[0]?.processvh,
            totalSuc: res[0]?.totalSuc,
            totalVH: res[0]?.totalVH,
            ErrorIncident: res[0]?.ErrorIncident,

        });

        const arr = [res[0]?.ErrorlogPath, res[0]?.NonReportablePath, res[0]?.SubmissionPath,].filter(Boolean);

        const staticArr = [
            'https://apigoldline.com:5002/Imagefolder/WV0030100-1224E.txt',
            'https://apigoldline.com:5002/Imagefolder/WV0030100-1224E.txt',
            'https://apigoldline.com:5002/Imagefolder/WV0030100-1224E.txt',

        ];

        // [
        //     "",
        //     "",
        //     "https://rmsgoldline.com/Imagefolder/2658cbe7/WV0006000-0126S.txt"
        // ]

        downloadFile(arr);

        setIsLoading(false);
    }

    function replaceDomain(url) {
        const oldDomain = 'https://apigoldline.com:5002';

        const newDomain = 'https://apigoldline.com';
        return url.replace(oldDomain, newDomain);
    }

    const downloadFile = async (fileUrl) => {
        // console.log("🚀 ~ downloadFile ~ fileUrl:", fileUrl);
        try {
            for (let i = 0; i < fileUrl?.length; i++) {
                const originalUrl = fileUrl[0];
                const lastSlashIndex = fileUrl[i].lastIndexOf('/');
                const updatedUrl = replaceDomain(originalUrl);

                FileSaver.saveAs(fileUrl[i], fileUrl[i]?.substring(lastSlashIndex + 1));

            }
        } catch (error) {
            console.log("🚀 ~ downloadFile ~ error:", error);

        }
    };

    const HandleChackedOne = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['rdbOne']: true, ['rdbTwoMonth']: false, ['rdbThreeMonth']: false, })
        } else {
            setValueObj({ ...valueObj, ['rdbOne']: 'One', })
        }
    }

    const HandlerdbTwoMonth = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['rdbOne']: false, ['rdbTwoMonth']: true, ['rdbThreeMonth']: false, })
        } else {
            setValueObj({ ...valueObj, ['rdbTwoMonth']: 'Two', })
        }
    }

    const HandleThreeMonth = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['rdbOne']: false, ['rdbTwoMonth']: false, ['rdbThreeMonth']: true, })
        } else {
            setValueObj({ ...valueObj, ['rdbThreeMonth']: 'Three', })
        }
    }

    const HandleChange = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['rdbOne']: true, })
        } else {
            setValueObj({ ...valueObj, ['rdbOne']: true, })
        }
    }

    const HandleCheckbox = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['chkStatetoSubmit']: e.target.checked })
        } else {
            setValueObj({ ...valueObj, ['chkStatetoSubmit']: e.target.checked, })
        }
    }

    const HandleAllLogFile = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['rdbAllLogFile']: true, ['rdbSubmissionFile']: false, ['rdbErrorLog']: false, ['rdbNonReportable']: false, })
        } else {
            setValueObj({ ...valueObj, ['rdbAllLogFile']: true, ['rdbSubmissionFile']: false, ['rdbErrorLog']: false, ['rdbNonReportable']: false, })
        }
    }

    const HandleSubmissionFile = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['rdbAllLogFile']: false, ['rdbSubmissionFile']: true, ['rdbErrorLog']: false, ['rdbNonReportable']: false, })
        } else {
            setValueObj({ ...valueObj, ['rdbAllLogFile']: true, ['rdbSubmissionFile']: false, ['rdbErrorLog']: false, ['rdbNonReportable']: false, })
        }
    }

    const HandleErrorLog = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['rdbAllLogFile']: false, ['rdbSubmissionFile']: false, ['rdbErrorLog']: true, ['rdbNonReportable']: false, })
        } else {
            setValueObj({ ...valueObj, ['rdbAllLogFile']: true, ['rdbSubmissionFile']: false, ['rdbErrorLog']: false, ['rdbNonReportable']: false, })
        }
    }

    const HandleNonReportable = (e) => {
        if (e) {
            setValueObj({ ...valueObj, ['rdbAllLogFile']: false, ['rdbSubmissionFile']: false, ['rdbErrorLog']: false, ['rdbNonReportable']: true, })
        } else {
            setValueObj({ ...valueObj, ['rdbAllLogFile']: true, ['rdbSubmissionFile']: false, ['rdbErrorLog']: false, ['rdbNonReportable']: false, })
        }
    }

    const onClickClose = () => {
        setShow(false);
        setShowNoObj({
            ...showNoObj,
            NonReportable: '',
            PastError: '',
            PastSubmission: '',
            ProcessArrestA: '',
            ProcessArrestB: '',
            ProcessIncident: '',
            SucessfullyIncident: '',
            TotalArrest: '',
            TotalIncidentNumber: '',
            lblTime: '',
            processsuc: '',
            processvh: '',
            totalSuc: '',
            totalVH: '',
            ErrorIncident: '',

        });
        setValueObj({
            ...valueObj,
            chkStatetoSubmit: false,
            rdbAllLogFile: true,
            rdbSubmissionFile: false,
            rdbErrorLog: false,
            rdbNonReportable: false,
        })
    }

    return (
        <>
            {
                show ?
                    <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)", zIndex: '' }} id="NibrsReportModel" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered  modal-xl">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <fieldset>
                                        <div className="col-12 mt-2">
                                            <div className="row justify-content-between px-3">
                                                <div className='form-check col-6'>
                                                    <input className='form-check-input' onClick={HandleChange} value={'Three'} checked={true} type="radio" name="IsUsLocation" id="flexRadioDefault2" />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                        Report By Date Range
                                                    </label>
                                                </div>
                                                <div className='form-check col-6 text-right'>
                                                    <input type='checkbox' value={valueObj?.chkStatetoSubmit} onClick={HandleCheckbox} checked={valueObj?.chkStatetoSubmit} name='chkStatetoSubmit' id='chkStatetoSubmit' />
                                                    <label className="form-check-label px-2" name='checkbox' id='chkStatetoSubmit' htmlFor="chkStatetoSubmit">
                                                        Submit To State
                                                    </label>
                                                </div>

                                            </div>
                                            <div className="row mb-1">
                                                <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                    <label className="new-label">Reported From:</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3">
                                                    <DatePicker
                                                        id='dtpDateFrom'
                                                        name='dtpDateFrom'
                                                        dateFormat="MM/dd/yyyy"
                                                        onChange={(date) => { setValueObj({ ...valueObj, ['dtpDateTo']: '', ['dtpDateFrom']: date ? getShowingWithFixedTime00(date) : null }) }}
                                                        timeInputLabel
                                                        isClearable={valueObj?.dtpDateFrom ? true : false}
                                                        placeholderText={valueObj?.dtpDateFrom ? valueObj?.dtpDateFrom : 'Select...'}
                                                        selected={valueObj?.dtpDateFrom && new Date(valueObj?.dtpDateFrom)}
                                                        maxDate={new Date(datezone)}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                    <label className="new-label">Reported To:</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3">
                                                    <DatePicker
                                                        id='dtpDateTo'
                                                        name='dtpDateTo'
                                                        dateFormat="MM/dd/yyyy"
                                                        onChange={(date) => { setValueObj({ ...valueObj, ['dtpDateTo']: date ? getShowingWithFixedTime(date) : null }) }}
                                                        timeInputLabel
                                                        isClearable={valueObj?.dtpDateTo ? true : false}
                                                        placeholderText={valueObj?.dtpDateTo ? valueObj?.dtpDateTo : 'Select...'}
                                                        selected={valueObj?.dtpDateTo && new Date(valueObj?.dtpDateTo)}
                                                        maxDate={new Date(datezone)}
                                                        minDate={new Date(valueObj?.dtpDateFrom)}
                                                        disabled={!valueObj?.dtpDateFrom}
                                                        className={!valueObj?.dtpDateFrom ? 'readonlyColor' : ''}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset>
                                        <div className="col-12 mt-2 mb-1">
                                            <div className="col-12 col-md-12 col-lg-12">
                                                <label className="text-dark">Downloads</label>
                                            </div>
                                            <div className="row px-3">
                                                <div className='form-check col-3'>
                                                    <input
                                                        onClick={HandleAllLogFile}
                                                        value={valueObj?.rdbAllLogFile}
                                                        checked={valueObj?.rdbAllLogFile}
                                                        type="radio" name="rdbAllLogFile" id="flexRadioDefault1"
                                                    />
                                                    <label className="form-check-label px-2" htmlFor="flexRadioDefault1">
                                                        All Log File
                                                    </label>
                                                </div>
                                                <div className='form-check col-3'>
                                                    <input
                                                        onClick={HandleSubmissionFile}
                                                        value={valueObj?.rdbSubmissionFile}
                                                        checked={valueObj?.rdbSubmissionFile}
                                                        type="radio" name="rdbSubmissionFile" id="flexRadioDefault1"
                                                    />
                                                    <label className="form-check-label px-2" htmlFor="flexRadioDefault1">
                                                        Submission File
                                                    </label>
                                                </div>
                                                <div className='form-check col-3'>
                                                    <input
                                                        onClick={HandleErrorLog}
                                                        value={valueObj?.rdbErrorLog}
                                                        checked={valueObj?.rdbErrorLog}
                                                        type="radio" name="rdbErrorLog" id="flexRadioDefault1"
                                                    />
                                                    <label className="form-check-label px-2" htmlFor="flexRadioDefault1">
                                                        Error Log
                                                    </label>
                                                </div>
                                                <div className='form-check col-3'>
                                                    <input
                                                        onClick={HandleNonReportable}
                                                        value={valueObj?.rdbNonReportable}
                                                        checked={valueObj?.rdbNonReportable}
                                                        type="radio" name="rdbNonReportable" id="flexRadioDefault1"
                                                    />
                                                    <label className="form-check-label px-2" htmlFor="flexRadioDefault1">
                                                        Non Reportable File
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="col-12 mt-2 mb-1">
                                        <fieldset>
                                            <div className="row px-2">
                                                <div className="col-3 col-md-4 col-lg-4">
                                                    <label className="label-field text-dark">Base Date:</label>
                                                </div>
                                                <div className="col-9 col-md-8 col-lg-8">
                                                    <label className="label-field ">{baseDate ? getShowingWithOutTime(baseDate) : ""}</label>
                                                </div>
                                                <div className="col-2 col-md-4 col-lg-4">
                                                    <label className="label-field ">Total Incidents:</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">{showNoObj?.TotalIncidentNumber ? showNoObj?.TotalIncidentNumber : 0}</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">Processed:</label>
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label className="label-field ">{showNoObj?.ProcessIncident ? showNoObj?.ProcessIncident : 0}</label>
                                                </div>
                                                <div className="col-2 col-md-4 col-lg-4">
                                                    <label className="label-field ">Submission File:</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">{showNoObj?.ProcessIncident ? showNoObj?.ProcessIncident : 0}</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">Error Log:</label>
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label className="label-field ">{showNoObj?.ErrorIncident ? showNoObj?.ErrorIncident : 0}</label>
                                                </div>
                                                <div className="col-2 col-md-4 col-lg-4">
                                                    <label className="label-field ">Non Reportable Incidents:</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">{showNoObj?.NonReportable ? showNoObj?.NonReportable : 0}</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">Arrest(Group A) Count:</label>
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label className="label-field ">{showNoObj?.ProcessArrestA ? showNoObj?.ProcessArrestA : 0}</label>
                                                </div>
                                                <div className="col-2 col-md-4 col-lg-4">
                                                    <label className="label-field ">Incident Of Group B Offense:</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">0</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">Arrest(Group B) Count:</label>
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label className="label-field ">{showNoObj?.ProcessArrestB ? showNoObj?.ProcessArrestB : 0}</label>
                                                </div>
                                                <div className="col-2 col-md-4 col-lg-4">
                                                    <label className="label-field ">Total Incidents link with Suicide:</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">0</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">Processed:</label>
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label className="label-field ">{showNoObj?.ProcessIncident ? showNoObj?.ProcessIncident : 0}</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12 mt-2">
                                        <fieldset>
                                            <div className="row px-2">
                                                <div className="col-3 col-md-4 col-lg-4">
                                                    <label className="label-field text-dark">Base Date:</label>
                                                </div>
                                                <div className="col-9 col-md-8 col-lg-8">
                                                    <label className="label-field ">{baseDate ? getShowingWithOutTime(baseDate) : ""}</label>
                                                </div>
                                                <div className="col-2 col-md-4 col-lg-4">
                                                    <label className="label-field ">Total Incidents:</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">{showNoObj?.TotalIncidentNumber ? showNoObj?.TotalIncidentNumber : 0}</label>
                                                </div>
                                                <div className="col-2 col-md-3 col-lg-3">
                                                    <label className="label-field ">Processed:</label>
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label className="label-field ">{showNoObj?.ProcessIncident ? showNoObj?.ProcessIncident : 0}</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box mt-4 col-12 text-right">

                                        <button type='button' disabled={isLoading} onClick={() => {
                                            getfileUrlToDownload();

                                        }} className='btn btn-sm btn-success mr-2' >
                                            Download Report
                                        </button>

                                        <button type="button" onClick={() => { handleModel(); onClickClose() }} data-dismiss="modal" className="btn btn-sm btn-success mr-1" >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
            {isLoading && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )}
        </>
    )
}

export default Nibrs_Report_Model