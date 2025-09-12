import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import { customStylesWithOutColor, Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../Common/Utility';
import { Link } from 'react-router-dom';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import Select from "react-select";
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { get_Incident_Drp_Data, get_NIBRS_Drp_Data } from '../../../../redux/actions/DropDownsData';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';

const MissingPersonReport = (props) => {
    const { masterReportData, multiImage, GetMissingReportData, showWatermark, setShowWatermark, } = props

    const { GetDataTimeZone, datezone } = useContext(AgencyContext);

    // const { multiImage } = useContext(AgencyContext)
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const fbiCodesDrpData = useSelector((state) => state.DropDown.fbiCodesDrpData);
    const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);

    const ipAddress = sessionStorage.getItem('IPAddress');

    // const [multiImage, setMultiImage] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [loder, setLoder] = useState(false);
    const [LoginUserName, setLoginUserName] = useState('');

    const [value, setValue] = useState({
        'IncidentNumber': '', 'IncidentNumberTo': '',
        'ReportedDate': null, 'ReportedDateTo': null, 'AgencyID': '', 'RMSCFSCodeID': null, 'FBIID': null,
    });
    const [searchValue, setSearchValue] = useState({
        IncidentNumber: '',
        IncidentNumberTo: '',
        ReportedDate: '',
        ReportedDateTo: '',
        RMSCFSCodeID: null,
        FBIID: null,
    });

    const [showFields, setShowFields] = useState({
        showIncidentNumber: false,
        showIncidentNumberTo: false,
        showReportedDateFrom: false,
        showReportedDateTo: false,
        showRMSCFSCodeID: false,
        showFBIID: false,
    });
    useEffect(() => {
        setShowFields({
            showIncidentNumber: searchValue.IncidentNumber,
            showIncidentNumberTo: searchValue.IncidentNumberTo,
            showReportedDateFrom: searchValue.ReportedDate,
            showReportedDateTo: searchValue.ReportedDateTo,
            showRMSCFSCodeID: searchValue.RMSCFSCodeID !== null,
            showFBIID: searchValue.FBIID !== null,
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
            setLoginPinID(localStoreData?.PINID); setLoginUserName(localStoreData?.UserName)
            if (NIBRSDrpData?.length === 0) { dispatch(get_NIBRS_Drp_Data(localStoreData?.AgencyID)) }

        }
    }, [localStoreData])

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
        },
        onAfterPrint: () => {
            setLoder(false);
        }
    });


    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm(); GetMissingReportData(true); setShowFooter(false);
        }, 100);
    };
    return (
        <>
            {
                masterReportData?.Incident?.length > 0 ?
                    <>
                        <div className="col-12 col-md-12 col-lg-12  px-2" >
                            <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">Missing Person Summary Report</p>
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
                                        {/* <div className="col-4 col-md-3 col-lg-2 ml-3">
                                        <div className="main">
                                            <div className="img-box" >
                                                <img src={multiImage} className='' style={{ marginTop: '4px', width: '150px', height: '150px' }} />
                                            </div>
                                        </div>
                                    </div> */}
                                        {/* <div className="col-7  col-md-7 col-lg-9 mt-2">
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
                                    </div> */}
                                        {/* <div className="col-7 col-md-7 col-lg-9 mt-2">
                                        <div className="main">
                                            <h5 className='text-dark font-weight-bold'>{masterReportData?.Agency_Name}</h5>
                                            <p className='text-p'>Address: <span className='text-address'>{masterReportData?.Agency_Address1}</span></p>
                                            <div className='d-flex justify-content-start flex-wrap'>
                                                <p className='text-p'>City: <span className='text-gray ml-2'>{masterReportData?.CityName}</span></p>
                                                <p className='text-p mb-1 ml-3'>State: <span className='text-gray'>{masterReportData?.StateName}</span></p>
                                                <p className='text-p mb-1 ml-3'>Zip: <span className='text-gray'>{masterReportData?.Zipcode}</span></p>
                                            </div>
                                            <div className='d-flex justify-content-start flex-wrap'>
                                                <p className='text-p mb-1'>Phone: <span className='text-gray ml-1'>{masterReportData?.Agency_Phone}</span></p>
                                                <p className='text-p mb-1 ml-4'>Fax: <span className='text-gray'>{masterReportData?.Agency_Fax}</span></p>
                                            </div>
                                        </div>
                                    </div> */}
                                    </>
                                    <div className="col-12">
                                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                        <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Missing Person Summary Report</h5>
                                    </div>
                                    <div className="col-12 bb">
                                        <fieldset>
                                            <legend>Search Criteria</legend>

                                            <div className="row">
                                                {showFields.showIncidentNumber && (
                                                    <>
                                                        <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                            <label className='new-label'>Incident Number From</label>
                                                        </div>
                                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                            <input type="text" className='readonlyColor'
                                                                value={searchValue.IncidentNumber}

                                                                readOnly />
                                                        </div>
                                                    </>
                                                )}
                                                {showFields.showIncidentNumberTo && (
                                                    <>
                                                        <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                            <label className='new-label'>Incident Number To</label>
                                                        </div>
                                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                            <input type="text" className='readonlyColor'
                                                                value={searchValue.IncidentNumberTo}

                                                                readOnly />
                                                        </div>
                                                    </>
                                                )}
                                                {showFields.showReportedDateFrom && (
                                                    <>
                                                        <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                            <label className='new-label'>Reported Date From</label>
                                                        </div>
                                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                            <input type="text" className='readonlyColor'
                                                                value={searchValue.ReportedDate && getShowingWithOutTime(searchValue.ReportedDate)}

                                                                readOnly />
                                                        </div>
                                                    </>
                                                )}
                                                {showFields.showReportedDateTo && (
                                                    <>
                                                        <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                            <label className='new-label'>Reported Date To</label>
                                                        </div>
                                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                            <input type="text" className='readonlyColor'
                                                                // value={searchValue.ReportedDateTo || ''} 
                                                                value={searchValue.ReportedDateTo && getShowingWithOutTime(searchValue.ReportedDateTo)}
                                                                readOnly />
                                                        </div>
                                                    </>
                                                )}

                                            </div>
                                        </fieldset>
                                    </div>
                                    {/* {
                        masterReportData?.Incident?.length > 0 ?
                            <> */}
                                    {
                                        masterReportData?.Incident?.map((obj) => (
                                            <>
                                                <div className="container-fluid" style={{ pageBreakAfter: 'always' }}>
                                                    <h6 className='text-white pl-2 text-center  bg-green py-1'>Incident Number:- <span className='text-white'>
                                                        {obj?.IncidentNumber}
                                                    </span>
                                                    </h6>

                                                    {
                                                        JSON.parse(obj?.PropertyRoom)?.length > 0 ?
                                                            <>
                                                                {
                                                                    JSON.parse(obj?.PropertyRoom)?.map((item, key) => (
                                                                        <>
                                                                            <div className="table-responsive  bb  bt" >
                                                                                <table className="table table-bordered bb"  >
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Missing Person Name:</h6>
                                                                                                <p className='text-list'>{item?.FullName}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Gender</h6>
                                                                                                <p className='text-list'>{item?.Gender}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>MNI</h6>
                                                                                                <p className='text-list'>{item?.NameIDNumber}</p>
                                                                                            </td>

                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Reported Date/Time:</h6>
                                                                                                <p className='text-list'>{item?.ReportedDttm ? getShowingDateText(item?.ReportedDttm) : null}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Race</h6>
                                                                                                <p className='text-list'>{item?.Race_Description}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Hair Color</h6>
                                                                                                <p className='text-list'>{item?.HairColor_Description}</p>
                                                                                            </td>

                                                                                        </tr>

                                                                                        <tr>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>CMC:</h6>
                                                                                                <p className='text-list'>{item?.CMC_Desc}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>M.P Occupation</h6>
                                                                                                <p className='text-list'>{item?.Occupation}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Missing Person</h6>
                                                                                                <p className='text-list'>{item?.PersonName}</p>
                                                                                            </td>

                                                                                        </tr>
                                                                                        {/* <tr>
                                                                                     
                                                                                        <td colSpan={4}>
                                                                                            <h6 className='text-dark text-bold'>DNA Location:</h6>
                                                                                            <p className='text-list'>{item?.Bias}</p>
                                                                                        </td>
                                                                                    </tr> */}
                                                                                        {/* <tr>
                                                                                        <td colSpan={12}>
                                                                                            <h6 className='text-dark text-bold'>Missing Person Address:</h6>
                                                                                            <p className='text-list'>{item?.OffenderUse}</p>
                                                                                        </td>

                                                                                    </tr> */}

                                                                                        <tr>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Phone Number:</h6>
                                                                                                <p className='text-list'>{item?.Contact}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Circumsatnces:</h6>
                                                                                                <p className='text-list'>{item?.Circumstances_Desc}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>DNA:</h6>
                                                                                                <p className='text-list'>{item?.IsDNA}</p>
                                                                                            </td>
                                                                                            {/* <td colSpan={6}>
                                                                                            <h6 className='text-dark text-bold'>Complainant Address:</h6>
                                                                                            <p className='text-list'>{item?.OffenderUse}</p>
                                                                                        </td> */}

                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td colSpan={6}>
                                                                                                <h6 className='text-dark text-bold'>Complainant Name:</h6>
                                                                                                <p className='text-list'>{item?.CompaintName}</p>
                                                                                            </td>
                                                                                            <td colSpan={6}>
                                                                                                <h6 className='text-dark text-bold'>Relationship with M.P:</h6>
                                                                                                <p className='text-list'>{item?.Relationwithmp}</p>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>

                                                                        </>
                                                                    ))
                                                                }
                                                            </>
                                                            : <></>
                                                    }

                                                </div>
                                            </>
                                        ))
                                    }
                                    {showFooter && (
                                        <div className="print-footer">
                                            <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                                        </div>
                                    )}
                                    {/* </>
                            :
                            <>
                            </>
                    } */}
                                </div>
                            </div>

                        </div >
                    </>
                    :
                    <>
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

export default MissingPersonReport