import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Decrypt_Id_Name, base64ToString, getShowingDateText, getShowingWithOutTime } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { fetchPostData } from '../../hooks/Api';
import { useLocation } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import DOMPurify from 'dompurify';

const IncidentSummaryModel = (props) => {

    const { setIncSummModal, incSummModal, otherColID, updateCount } = props
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [ListData, setListData] = useState([])
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [multiImage, setMultiImage] = useState([]);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
            // get_List();
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        // console.log(IncID)
        // console.log(otherColID)
        if ((IncID && LoginAgencyID) || (otherColID && LoginAgencyID)) {
            get_List(LoginAgencyID, IncID ? IncID : otherColID);
            getAgencyImg(LoginAgencyID);
        }
    }, [LoginAgencyID, IncID, otherColID, updateCount])

    const get_List = (LoginAgencyID, IncID) => {
        const val = { 'AgencyID': LoginAgencyID, 'IncidentID': IncID, }
        fetchPostData('Summary/IncidentSummary', val).then((res) => {
            if (res) {
                console.log(res)
                setListData(res);
            } else {
                setListData([]);
            }
        })
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
            {
                incSummModal ?
                    <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="IncSummaryModel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog  modal-xl modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h6 className="modal-title text-dark">Incident Summary</h6>
                                    <button type="button" onClick={() => { setListData([]); }} className="close text-red" data-dismiss="modal" >×</button>
                                </div>
                                <div class="modal-body">

                                    {ListData?.map((data, index) => (
                                        <div key={index}>
                                            <div className="col-12 col-md-12 col-lg-12">
                                                <fieldset>
                                                    <legend style={{ fontWeight: 'bold' }}>Incident Information</legend>
                                                    <div className="row">
                                                        <div className='col-11'>
                                                            <div className='row'>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Incident Number:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.IncidentNumber}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Reported&nbsp;Date:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-1 ">
                                                                    <label htmlFor="" className=''>{data.ReportedDate ? getShowingDateText(data.ReportedDate) : ''}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-11'>
                                                            <div className='row'>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Occurred&nbsp;From:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.OccurredFrom ? getShowingDateText(data.OccurredFrom) : ''}</label>
                                                                </div>

                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Occurred&nbsp;To:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                    <label htmlFor="" className=''>{data.OccurredTo && getShowingDateText(data.OccurredTo) ? getShowingDateText(data.OccurredTo) : ''}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                            <label htmlFor="" className='new-summary'>RMS CFS Code:</label>
                                                        </div>
                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                            <label htmlFor="" className=''>{data.RMSCFSCode_Description}</label>
                                                        </div> */}
                                                        <div className='col-11'>
                                                            <div className='row'>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>CAD CFS Code:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.CADCFSCode_Description}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>CAD Disposition:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.CADDispositions_Description}</label>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className='col-11'>
                                                            <div className='row'>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Primary Officer:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.PrimaryOfficer}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Exceptional Clearance:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                    <label htmlFor="" className=''>{data.RMS_Disposition}</label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className='col-11'>
                                                            <div className='row'>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Dispatching Agency:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.Dispatching_Agency}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Crime Location:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                    <label htmlFor="" className=''>{data.CrimeLocation}</label>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className='col-11'>
                                                            <div className='row'>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Dispatcher:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.Dispatcher}</label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </fieldset>
                                            </div>
                                            {/* Pin activity*/}
                                            <div className="col-12">
                                                {/* <hr /> */}
                                                {ListData[0]?.PinActivity && ListData[0]?.PinActivity.length > 0 ? (
                                                    <Accordion activeIndex={0}>
                                                        <AccordionTab header="Inc-Pin Activity">
                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                <div className="table-responsive">
                                                                    <table className="table mt-2">
                                                                        <thead className='thead Summary-table'>
                                                                            <tr>
                                                                                <th className=''>Activity Date/Time</th>
                                                                                <th className=''>Role</th>
                                                                                <th className=''>Officer Name</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {ListData[0]?.PinActivity?.map((obj) => (
                                                                            <tbody className='master-tbody'>
                                                                                <tr >
                                                                                    <td>{obj.ActivityDateTime ? getShowingDateText(obj.ActivityDateTime) : ''}</td>
                                                                                    <td>{obj.Role}</td>
                                                                                    <td>{obj.OfficerName}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        ))}
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                ) : null}
                                            </div>
                                            {/* <hr /> */}
                                            {/*Type of security*/}
                                            <div className="col-12">
                                                {ListData[0]?.TypeOfSecurity && ListData[0]?.TypeOfSecurity.length > 0 ? (
                                                    <Accordion activeIndex={0}>
                                                        <AccordionTab header="Inc-Type of security">
                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                <div className="table-responsive">
                                                                    <table className="table mt-2">
                                                                        <thead className='thead Summary-table'>
                                                                            <tr>
                                                                                <th className=''>Type Of Security</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {ListData[0]?.TypeOfSecurity?.map((obj) => (
                                                                            <tbody className='master-tbody'>
                                                                                <tr >
                                                                                    <td>{obj.TypeOfSecurity}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        ))}
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                ) : null}
                                            </div>
                                            {/* <hr /> */}
                                            {/* DispatchActivity*/}
                                            <div className="col-12">
                                                {ListData[0]?.DispatchActivity && ListData[0]?.DispatchActivity.length > 0 ? (
                                                    <Accordion activeIndex={0}>
                                                        <AccordionTab header="Inc-Dispatch Activity">
                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                <div className="table-responsive">
                                                                    <table className="table mt-2">
                                                                        <thead className='thead Summary-table'>
                                                                            <tr>
                                                                                <th className=''>Dispatch Date</th>
                                                                                <th className=''>Comments</th>
                                                                                <th className=''>Officer Name</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {ListData[0]?.DispatchActivity?.map((obj) => (
                                                                            <tbody className='master-tbody'>
                                                                                <tr >
                                                                                    <td>{obj.DispatchDate ? getShowingDateText(obj.DispatchDate) : ''}</td>
                                                                                    <td>{obj.Comments}</td>
                                                                                    <td>{obj.OfficerName}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        ))}
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                ) : null}
                                            </div>
                                            {/* <hr /> */}
                                            {/* Report*/}
                                            <div className="col-12">
                                                {ListData[0]?.Narrative && ListData[0]?.Narrative.length > 0 ? (
                                                    <Accordion activeIndex={0}>
                                                        <AccordionTab header="Inc-Report">
                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                <div className="table-responsive">
                                                                    <table className="table mt-2">
                                                                        <thead className='thead Summary-table'>
                                                                            <tr>
                                                                                <th className=''>Date/Time</th>
                                                                                <th className=''>Type</th>
                                                                                <th className=''>Reported By</th>
                                                                                <th className=''>Comments</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {ListData[0]?.Narrative?.map((obj) => (
                                                                            <tbody className='master-tbody'>
                                                                                <tr >
                                                                                    <td>{obj.AsOfDate ? getShowingDateText(obj.AsOfDate) : ''}</td>
                                                                                    <td>{obj.NarrativeDescription}</td>
                                                                                    <td>{obj.ReportedBy_Description}</td>
                                                                                    <div className="col-9 col-md-9 col-lg-10 mt-1">
                                                                                        <label htmlFor="" className=''
                                                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj?.CommentsDoc) }}
                                                                                        >
                                                                                        </label>
                                                                                    </div>
                                                                                </tr>
                                                                            </tbody>
                                                                        ))}
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                ) : null}
                                            </div>
                                            {/* <hr /> */}
                                            {/* offense data */}
                                            {ListData[0]?.Offense && ListData[0]?.Offense.length > 0 ? (

                                                <div className="col-12">
                                                    <Accordion activeIndex={0}>
                                                        <AccordionTab header="Offense Information">
                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                <div className="table-responsive">
                                                                    <table className="table mt-2">
                                                                        <thead className='thead Summary-table'>
                                                                            <tr>
                                                                                <th className=''> Offense Code</th>
                                                                                <th className=''>Offense Description</th>
                                                                                <th className=''>TIBRS Code</th>
                                                                                <th className=''>TIBRS Description
                                                                                </th>
                                                                                <th className=''>Premises Entered</th>
                                                                                <th className=''>Primary Location</th>
                                                                            </tr>
                                                                        </thead>
                                                                        {ListData[0]?.Offense?.map((obj) => (

                                                                            <tbody className='master-tbody'>
                                                                                <tr >
                                                                                    <td>{obj.CFSCode}</td>
                                                                                    <td>{obj.CFS_Description}</td>
                                                                                    <td>{obj.FBICode}</td>
                                                                                    <td>{obj.Type}</td>
                                                                                    <td>{obj.PremisesEntered}</td>
                                                                                    <td>{obj.PremiseType}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        ))}

                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                </div>
                                            ) : null}

                                            {/* name data */}
                                            {/* <div className="col-12 mt-2">
                                                <Accordion activeIndex={0}>
                                                    <AccordionTab header="Name Information">
                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                            {ListData[0]?.Name?.map((obj) => (
                                                                <div className="row bb bt">
                                                                  
                                                                    <div className="col-11">
                                                                        <div className="row">
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Full Name:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.FullName}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Name Type:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.NameType_Description}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Date Of Birth:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.DateOfBirth ? getShowingWithOutTime(obj.DateOfBirth) : ''}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Gender:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Gender}</label>
                                                                            </div>

                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Hair Color:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.HairColor}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Eye Color:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.EyeColor}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Reason Code:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.NameReasonCode_Description}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Race:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Race}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Height From:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.HeightFrom}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Height To:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.HeightTo}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Weight From:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.WeightFrom}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Weight To:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.WeightTo}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Address:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Address}</label>
                                                                            </div>
                                                                            <div className="col-6">
                                                                                <div className='text-field'>
                                                                                    <div className="row">
                                                                                        {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                            <div className="col-3 col-md-2 col-lg-2 mt-2" key={index}>
                                                                                                <img
                                                                                                    src={url.trim()}
                                                                                                    className='picture'
                                                                                                    style={{ width: '150px', height: '100px' }}
                                                                                                    alt={`Photo ${index + 1}`}
                                                                                                />
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionTab>
                                                </Accordion>
                                            </div> */}

                                            <div className="col-12 mt-2">
                                                <Accordion activeIndex={0}>
                                                    <AccordionTab header="Name Information">
                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                            {ListData[0]?.Name?.map((obj) => (
                                                                <div className="row bb bt" key={obj.FullName}>

                                                                    <div className="col-11">
                                                                        <div className="row">
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Full Name:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.FullName}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Name Type:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.NameType_Description}</label>
                                                                            </div>

                                                                            {/* Conditionally render additional sections based on NameType_Description */}
                                                                            {obj.NameType_Description === 'Business' ? (
                                                                                <div className="col-12 mt-2">
                                                                                    <div className="row">
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Business Type:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.BusinessType}</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : null}
                                                                            {obj.NameType_Description === 'Person' ? (
                                                                                <div className="col-12 mt-2">
                                                                                    <div className="row">
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Date Of Birth:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.DateOfBirth ? getShowingWithOutTime(obj.DateOfBirth) : ''}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Age From:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.AgeFrom}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Age To:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.AgeTo}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Age Unit:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.AgeUnit_Decsription}</label>
                                                                                        </div>

                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Gender:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.Gender}</label>
                                                                                        </div>

                                                                                        {/* More sections */}
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Hair Color:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.HairColor}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Eye Color:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.EyeColor}</label>
                                                                                        </div>

                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Race:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.Race}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Height:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            {/* <label htmlFor="" className=''>{obj.HeightFrom}</label> */}
                                                                                            <label className=''>
                                                                                                {obj?.HeightFrom != null || obj?.HeightTo != null
                                                                                                    ? `${obj.HeightFrom || ''}-${obj.HeightTo || ''}`.replace(/-$/, '')
                                                                                                    : ''}
                                                                                            </label>
                                                                                        </div>
                                                                                        {/* <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Height To:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.HeightTo}</label>
                                                                                        </div> */}
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Weight:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label className=''>
                                                                                                {obj?.WeightFrom != null || obj?.WeightTo != null
                                                                                                    ? `${obj.WeightFrom || ''}-${obj.WeightTo || ''}`.replace(/-$/, '')
                                                                                                    : ''}
                                                                                            </label>
                                                                                            {/* <label htmlFor="" className=''>{obj.WeightFrom}</label> */}
                                                                                        </div>
                                                                                        {/* <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Weight To:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.WeightTo}</label>
                                                                                        </div> */}

                                                                                    </div>
                                                                                </div>
                                                                            ) : null}
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Reason Code:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                <label htmlFor="" className=''>{obj.NameReasonCode_Description}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Address:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Address}</label>
                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className='text-field'>
                                                                                    <div className="row">
                                                                                        {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-2" key={index}>
                                                                                                <img
                                                                                                    src={url.trim()}
                                                                                                    className='picture'
                                                                                                    style={{ width: '150px', height: '100px' }}
                                                                                                    alt={`Photo ${index + 1}`}
                                                                                                />
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionTab>
                                                </Accordion>
                                            </div>

                                            {/* property information */}
                                            <div className="col-12 mt-2">
                                                <Accordion activeIndex={0}>
                                                    <AccordionTab header="Property Information">
                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                            {ListData[0]?.Property?.map((obj) => (
                                                                <div className="row bb bt">
                                                                    <div className="col-11">
                                                                        <div className="row mt-2">
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Property Number:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.PropertyNumber}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Property Type	:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.PropertyType_Description}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Reason:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Reason}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Reported Dt/Tm:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.ReportedDtTm ? getShowingDateText(obj.ReportedDtTm) : ''}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Property Category:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.PropertyCategory_Description}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                                                                <label htmlFor="" className='new-summary '>Property&nbsp;Classification:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.PropertyClassification_Description}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Value:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>${obj.Value}</label>
                                                                            </div>

                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Possession Of:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Possession_Name}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Misc:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Misc_Description}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Evidence:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                {/* <input type="checkbox" name="" id="" checked={obj.IsEvidence} disabled={!isDataAvailable} /> */}
                                                                                {/* <input
                                                                                    type="checkbox"
                                                                                    name=""
                                                                                    id=""
                                                                                    checked={obj && Object.keys(obj).length > 0 ? obj.IsEvidence : false}
                                                                                    disabled={!obj || Object.keys(obj).length === 0}
                                                                                /> */}
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={obj?.IsEvidence || false}
                                                                                    disabled={!obj}
                                                                                />

                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className="row">
                                                                                    {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                        <div className="col-3 col-md-3 col-lg-3 mt-2" key={index}>
                                                                                            <img
                                                                                                src={url.trim()}
                                                                                                className='picture'
                                                                                                style={{ width: '150px', height: '100px' }}
                                                                                                alt={`Photo ${index + 1}`}
                                                                                            />
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionTab>
                                                </Accordion>
                                            </div>
                                            {/* Vehicle information */}
                                            <div className="col-12 mt-2">
                                                <Accordion activeIndex={0}>
                                                    <AccordionTab header="Vehicle Information">
                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                            {ListData[0]?.Vehicle?.map((obj) => (
                                                                <div className="row bb bt">

                                                                    <div className="col-11">
                                                                        <div className="row mt-2">
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Vehicle Number:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.VehicleNumber}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>VIN :</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.VIN}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Plate Type:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.PlateType}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Reason:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Reason}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Model:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Model}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Category:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Category}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Classification:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Classification}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Primary Color	:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Color}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Sec Color:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Sec_Color}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Possession Of:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Possession}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Misc:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                <label htmlFor="" className=''>{obj.Misc_Description}</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                <label htmlFor="" className='new-summary'>Evidence:</label>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={obj?.IsEvidence || false}
                                                                                    disabled={!obj}
                                                                                />

                                                                            </div>
                                                                            <div className="col-12">
                                                                                <div className='text-field'>
                                                                                    <div className="row">
                                                                                        {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-2" key={index}>
                                                                                                <img
                                                                                                    src={url.trim()}
                                                                                                    className='picture'
                                                                                                    style={{ width: '150px', height: '100px' }}
                                                                                                    alt={`Photo ${index + 1}`}
                                                                                                />
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                    {/* <label htmlFor="" className='new-summary '>Images:</label> */}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </AccordionTab>
                                                </Accordion>
                                            </div>

                                            {/* Arrest information */}
                                            {
                                                ListData[0]?.Arrest?.length > 0 ?
                                                    <>
                                                        < div className="col-12 mt-2" >
                                                            <Accordion activeIndex={0}>
                                                                <AccordionTab header="Arrest Information">
                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                        {ListData[0]?.Arrest?.map((obj) => (
                                                                            <div className="row bb bt">

                                                                                <div className="col-11">
                                                                                    <div className="row mt-2">
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Arrest Number:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.ArrestNumber}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Arrest Type:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.ArrestType}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Arrest Dt/Tm:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.ArrestDtTm ? getShowingDateText(obj.ArrestDtTm) : ''}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Police Force:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.PoliceForce}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Primary Officer:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.PrimaryOfficer}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>SuperVisor:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.SuperVisor}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Arresting Agency:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.ArrestingAgency}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Arrestee Name:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.ArresteeName}</label>
                                                                                        </div>
                                                                                        <div className="col-12">
                                                                                            <div className='text-field'>
                                                                                                <div className="row">
                                                                                                    {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                                        <div className="col-3 col-md-3 col-lg-3 mt-2" key={index}>
                                                                                                            <img
                                                                                                                src={url.trim()}
                                                                                                                className='picture'
                                                                                                                style={{ width: '150px', height: '100px' }}
                                                                                                                alt={`Photo ${index + 1}`}
                                                                                                            />
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                                {/* <label htmlFor="" className='new-summary '>Images:</label> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </AccordionTab>
                                                            </Accordion>
                                                        </div>
                                                    </>
                                                    : <></>
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div >
                    </div >
                    :
                    <></>
            }
        </>
    )
}

export default IncidentSummaryModel