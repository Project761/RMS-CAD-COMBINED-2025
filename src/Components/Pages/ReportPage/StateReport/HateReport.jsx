import React, { useContext, useRef, useState } from 'react'
import { Decrypt_Id_Name, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../Common/Utility';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { get_Incident_Drp_Data, get_NIBRS_Drp_Data } from '../../../../redux/actions/DropDownsData';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';
import { AgencyContext } from '../../../../Context/Agency/Index';

const HateReport = (props) => {

    const { masterReportData, showFields, searchValue, multiImage, GetHateReportData, showWatermark, setShowWatermark, } = props
    const { GetDataTimeZone, datezone } = useContext(AgencyContext);

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
            printForm(); GetHateReportData(true); setShowFooter(false);
        }, 100);
    };
    return (
        <>
            {
                masterReportData?.Incident?.length > 0 ?
                    <>
                        <div className="col-12 col-md-12 col-lg-12  px-2" >
                            <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">Hate Crime Summary Report</p>
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
                                        <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Hate Crime Summary Report</h5>
                                    </div>

                                    {
                                        masterReportData?.Incident?.map((obj) => (
                                            <>
                                                <div className="container-fluid" style={{ pageBreakAfter: 'always' }}>
                                                    <h6 className='text-white pl-2 text-center  bg-green'>Incident Number:- <span className='text-white'>
                                                        {obj?.Incidentnumber}
                                                    </span>
                                                    </h6>

                                                    {
                                                        JSON.parse(obj?.Crime)?.length > 0 ?
                                                            <>
                                                                {
                                                                    JSON.parse(obj?.Crime)?.map((item, key) => (
                                                                        <>
                                                                            <div className="table-responsive bb" >
                                                                                <table className="table table-bordered "  >
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Offense Code:</h6>
                                                                                                <p className='text-list'>{item?.OffenceCode}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Race</h6>
                                                                                                <p className='text-list'>{item?.Race_Desc}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Ethnicity</h6>
                                                                                                <p className='text-list'>{item?.Ethnicity_Desc}</p>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Location:</h6>
                                                                                                <p className='text-list'>{obj?.CrimeLocation}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>No Of Victim:</h6>
                                                                                                <p className='text-list'>{item?.VictimNameNum}</p>
                                                                                            </td>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>No Of Offender:</h6>
                                                                                                <p className='text-list'>{item?.PrimaryOfficer_Name}</p>
                                                                                            </td>
                                                                                        </tr>

                                                                                        <tr>
                                                                                            <td colSpan={4}>
                                                                                                <h6 className='text-dark text-bold'>Victim Type:</h6>
                                                                                                <p className='text-list'>{item?.OffenderUse}</p>
                                                                                            </td>
                                                                                            <td colSpan={8}>
                                                                                                <h6 className='text-dark text-bold'>Bias:</h6>
                                                                                                <p className='text-list'>{item?.Bias}</p>
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

export default HateReport