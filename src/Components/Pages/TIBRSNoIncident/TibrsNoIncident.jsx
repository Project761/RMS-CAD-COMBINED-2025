import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Decrypt_Id_Name, } from '../../Common/Utility';
import { toastifyError } from '../../Common/AlertMsg';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { downloadUrl } from '../../hooks/Api';
import { AgencyContext } from '../../../Context/Agency/Index';
var FileSaver = require('file-saver');

const TibrsNoIncident = ({ showTibrsModel, handleTibrsModel }) => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { datezone } = useContext(AgencyContext);
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [error, setError] = useState({ monthStatus: "", yearStatus: "" });
    const [oriNumber, setOriNumber] = useState('');

    useEffect(() => {
        if (!localStoreData?.AgencyID && uniqueId) {
            dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID);
            setOriNumber(localStoreData?.ORI);
        }
    }, [localStoreData]);


    const validateInputs = () => {
        let isValid = true;
        let errors = { monthStatus: '', yearStatus: '' };
        if (!month) {
            errors.monthStatus = 'Required'; isValid = false;
        }
        if (!year) {
            errors.yearStatus = 'Required'; isValid = false;
        }
        setError(errors);
        return isValid;
    };


    const today = new Date();
    const currentMonthLastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const currentYearLastDate = new Date(today.getFullYear(), 11, 31);

    // const handleDownload = async () => {
    //     if (!validateInputs()) return;
    //     const payload = {
    //         'AgencyID': loginAgencyID,
    //         'StrZeroMonth': month,
    //         'StrZeroYear': year,
    //         'StrSubmissionMonth': 0,
    //         'StrSubmissionYear': 0,
    //         'StrORI': oriNumber,
    //         'dtpDateFrom': "",
    //         'strComputerName': uniqueId,
    //     };
    //     try {
    //         const res = await downloadUrl('NIBRS/GetData_NIBRSSubmissionPath', payload);
    //         console.log("API response:", res);
    //         const fileUrl = res?.data;
    //         const lastSlashIndex = fileUrl?.lastIndexOf('/');
    //         FileSaver.saveAs(fileUrl, fileUrl?.substring(lastSlashIndex + 1));
    //     } catch (error) {
    //         toastifyError("Something went wrong");
    //         console.error("Download error:", error);
    //     }
    // };

    // const handleDownload = async () => {
    //     if (!validateInputs()) return;
    //     const currentDate = new Date();
    //     const padZero = (num) => num.toString().padStart(2, '0');
    //     const formattedDateTime =
    //         `${padZero(currentDate.getMonth() + 1)}/${padZero(currentDate.getDate())}/${currentDate.getFullYear()} ` +
    //         `${padZero(currentDate.getHours())}:${padZero(currentDate.getMinutes())}:${padZero(currentDate.getSeconds())}`;
    //     const payload = {
    //         'AgencyID': loginAgencyID,
    //         'StrZeroMonth': month,
    //         'StrZeroYear': year,
    //         'StrSubmissionMonth': 0,
    //         'StrSubmissionYear': 0,
    //         'StrORI': oriNumber,
    //         'dtpDateFrom': formattedDateTime,
    //         'strComputerName': uniqueId,
    //     };
    //     try {
    //         const res = await downloadUrl('NIBRS/GetData_NIBRSSubmissionPath', payload);
    //         console.log("API response:", res);
    //         const fileUrl = res?.data;
    //         const lastSlashIndex = fileUrl?.lastIndexOf('/');
    //         FileSaver.saveAs(fileUrl, fileUrl?.substring(lastSlashIndex + 1));
    //     } catch (error) {
    //         toastifyError("Something went wrong");
    //         console.error("Download error:", error);
    //     }
    // };


    const handleDownload = async () => {
        if (!validateInputs()) return;
        const currentDate = new Date();
        const padZero = (num) => num.toString().padStart(2, '0');
        const formattedDateTime =
            `${padZero(currentDate.getMonth() + 1)}/${padZero(currentDate.getDate())}/${currentDate.getFullYear()} ` +
            `${padZero(currentDate.getHours())}:${padZero(currentDate.getMinutes())}:${padZero(currentDate.getSeconds())}`;

        const currentMonth = padZero(currentDate.getMonth() + 1);
        const currentYear = currentDate.getFullYear();
        const formattedZeroMonth = padZero(month);

        const payload = {
            'AgencyID': loginAgencyID,
            'StrZeroMonth': formattedZeroMonth,
            'StrZeroYear': year,
            'StrSubmissionMonth': currentMonth,
            'StrSubmissionYear': currentYear,
            'StrORI': oriNumber,
            'dtpDateFrom': formattedDateTime,
            'strComputerName': uniqueId,
        };
        try {
            const res = await downloadUrl('NIBRS/ZeroIncident', payload);
            console.log("API response:", res);
            const fileUrl = res?.data;
            const lastSlashIndex = fileUrl?.lastIndexOf('/');
            FileSaver.saveAs(fileUrl, fileUrl?.substring(lastSlashIndex + 1));

            // const textData = res.data;  // assuming this is string content
            // const blob = new Blob([textData], { type: 'text/plain' });
            // FileSaver.saveAs(blob, 'filename.txt');

        } catch (error) {
            toastifyError("Something went wrong");
            console.error("Download error:", error);
        }
    };

    return (
        <>
            {showTibrsModel &&
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} id="TibrsNoIncident" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="text-center mb-3">
                                    <h5 style={{ color: '#001f3f' }}>TIBRS No Incident</h5>
                                </div>

                                <div className="row justify-content-center align-items-center mb-3">
                                    <div className="col-md-4 text-md-right mr-2">
                                        <label className='text-nowrap mb-0'>Zero SubmissionMonth</label>
                                        {/* {error.yearStatus && <p style={{ color: 'red', fontSize: '11px' }}>{error.yearStatus}</p>} */}
                                    </div>
                                    <div className="col-md-6">
                                        <DatePicker
                                            id="StrZeroMonth"
                                            name="StrZeroMonth"
                                            isClearable
                                            dateFormat="MM"
                                            selected={month ? new Date(2024, month - 1) : null}
                                            onChange={(date) => setMonth(date?.getMonth() + 1)}
                                            showMonthYearPicker
                                            autoComplete="off"
                                            placeholderText="Select..."
                                            className="form-controlTIBRSNo"
                                            maxDate={currentMonthLastDate}
                                        />
                                    </div>
                                </div>

                                <div className="row justify-content-center align-items-center mb-3">
                                    <div className="col-md-4 text-md-right">
                                        <label className='mb-0'> Zero SubmissionYear</label>
                                        {/* {error.yearStatus && <p style={{ color: 'red', fontSize: '11px' }}>{error.yearStatus}</p>} */}

                                    </div>
                                    <div className="col-md-6">
                                        <DatePicker
                                            name="StrZeroYear"
                                            id="StrZeroYear"
                                            selected={year ? new Date(year, 0) : null}
                                            onChange={(date) => setYear(date?.getFullYear())}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            autoComplete="off"
                                            placeholderText="Select..."
                                            className="form-controlTIBRSNo"
                                            maxDate={currentYearLastDate}
                                        />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        className="btn"
                                        style={{ backgroundColor: '#001f3f', color: '#fff', padding: '6px 25px' }}
                                    >
                                        Download
                                    </button>
                                    <p className="mt-2" style={{ fontSize: '12px', color: 'gray' }}>
                                        Please select both Month and Year before downloading.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setYear('');
                                        setMonth('');
                                        setError({ monthStatus: '', yearStatus: '' });
                                        handleTibrsModel();
                                    }}
                                    className="btn btn-sm position-absolute"
                                    style={{ top: '10px', right: '10px', backgroundColor: '#001f3f', color: '#fff' }}
                                >
                                    <b>X</b>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}
export default TibrsNoIncident;
