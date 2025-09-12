import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Decrypt_Id_Name, base64ToString, getShowingDateText, getShowingWithOutTime } from '../../Common/Utility';
import { useLocation } from 'react-router-dom';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { fetchPostData } from '../../hooks/Api';
import { Accordion, AccordionTab } from 'primereact/accordion';
import DOMPurify from 'dompurify';

const OtherSummaryModel = (props) => {

    const { updateCount, otherSummModal, otherColName, otherUrl, otherColID, openPage, modalTitle, masterID, idColName } = props
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const dispatch = useDispatch();

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let MstPage = useQuery().get('page');

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [multiImage, setMultiImage] = useState([]);
    const [ListData, setListData] = useState([]);

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
        if (otherColID && LoginAgencyID && otherSummModal) {
            get_List(LoginAgencyID, otherColID);
            getAgencyImg(LoginAgencyID);
        }
    }, [LoginAgencyID, otherColID, updateCount, openPage])

    const get_List = (LoginAgencyID, otherColID) => {

        const val = {
            'AgencyID': LoginAgencyID,
            [otherColName]: otherColID,
            IsMaster: MstPage ? otherColName === 'NameID' ? false : true : false,
        }
        const val1 = { 'AgencyID': LoginAgencyID, [otherColName]: otherColID, IsMaster: MstPage ? true : false, }

        fetchPostData(otherUrl, otherColName === "MasterPropertyID" ? val1 : val).then((res) => {
            if (res) {
                console.log(res)
                // console.log("Modal Title:", modalTitle);
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }
    // const get_List = (LoginAgencyID, otherColID) => {
    //     const val = { 'AgencyID': LoginAgencyID, [otherColName]: otherColID, IsMaster: MstPage ? true : false, }
    //     const val1 = { 'AgencyID': LoginAgencyID, [otherColName]: otherColID, IsMaster: MstPage ? true : false, }
    //     fetchPostData(otherUrl, otherColName === "MasterPropertyID" ? val1 : val).then((res) => {
    //         if (res) {
    //             // console.log(res)
    //             // console.log("Modal Title:", modalTitle);
    //             setListData(res);
    //         } else {
    //             setListData([]);
    //         }
    //     })
    // }
    // console.log(otherColName)
    // console.log(otherColID)

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
                otherSummModal ?
                    <>
                        <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="OtherSummaryModel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                            <div className="modal-dialog  modal-xl modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        {/* <h6 class="modal-title">Summary</h6> */}
                                        <h6 className="modal-title text-dark">{modalTitle}</h6>
                                        <button type="button" className="close text-red" data-dismiss="modal">×</button>
                                    </div>
                                    <div class="modal-body">
                                        {ListData?.map((data, index) => (
                                            <div key={index}>
                                                {
                                                    ListData[0]?.Arrest?.length > 0 ?
                                                        <>
                                                            <div className="col-12 mt-2">
                                                                <Accordion activeIndex={0}>
                                                                    <AccordionTab header="Arrest Information">
                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                            {ListData[0]?.Arrest?.map((obj) => (
                                                                                <div className="row bb bt">
                                                                                    {/* <div className="col-1"  >
                                                                                        <img src={multiImage} className='picture' style={{ marginTop: '4px', width: '150px', height: '100px' }} alt='Agency_Photo' />
                                                                                    </div> */}
                                                                                    <div className="col-11">
                                                                                        <div className="row">
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Arrest Number:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.ArrestNumber}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Agency:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.AgencyName}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Arresting Agency:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.ArrestingAgency}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Arrest Dt/Tm:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.ArrestDtTm ? getShowingDateText(obj.ArrestDtTm) : ''}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Arrest Type:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.ArrestType}</label>
                                                                                            </div>

                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>SuperVisor:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.SuperVisor}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Primary Officer:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.PrimaryOfficer}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Police Force:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.PoliceForce}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Juvenile Arrest:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                {/* <label htmlFor="" className=''>{obj.IsJuvenileArrest}</label> */}
                                                                                                {/* <input
                                                                                                    type="checkbox"
                                                                                                    name=""
                                                                                                    id=""
                                                                                                    checked={obj && Object.keys(obj).length > 0 ? obj.IsJuvenileArrest : false}
                                                                                                    disabled={!obj || Object.keys(obj).length === 0}
                                                                                                /> */}
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    checked={obj?.IsJuvenileArrest || false}
                                                                                                    disabled={!obj}
                                                                                                />


                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Juvenile Disposition:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.JuvenileDisposition}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Right Given:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.RightGiven}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Given By:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.GivenBy}</label>
                                                                                            </div>
                                                                                            <div className='col-12'>
                                                                                                <div className="row">
                                                                                                    {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                                        <div className="col-3 col-md-3 col-lg-3 mt-2" key={index}>
                                                                                                            <img
                                                                                                                src={url.trim()}
                                                                                                                className='picture'
                                                                                                                style={{ width: '150px', height: '100px' }}
                                                                                                                alt={` ${index + 1}`}
                                                                                                            />
                                                                                                        </div>
                                                                                                    ))}
                                                                                                </div>
                                                                                                {/* <label htmlFor="" className='new-summary '>Images:</label> */}
                                                                                            </div>
                                                                                        </div>
                                                                                        <hr />
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </AccordionTab>
                                                                </Accordion>
                                                            </div>
                                                            {/* name-arrest */}
                                                            {/* <div className="col-12 mt-2">
                                                                {ListData[0]?.Name && ListData[0]?.Name.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Name Information">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                {ListData[0]?.Name?.map((obj) => (
                                                                                    <div className="row bb bt">

                                                                                        <div className="col-12">
                                                                                            <div className="row mt-2">
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Full Name</label>
                                                                                                </div>
                                                                                                <div className="col-9 col-md-9 col-lg-10 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.FullName}</label>
                                                                                                </div>
                                                                                              
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Date Of Birth</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label className=''>{obj.DateOfBirth ? getShowingWithOutTime(obj.DateOfBirth) : ''}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Age:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.AgeFrom}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Birth Place:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.BirthPlace}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Gender:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Gender}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Race:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Race}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Weight:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label className=''>
                                                                                                        {obj?.WeightFrom != null || obj?.WeightTo != null
                                                                                                            ? `${obj.WeightFrom || ''}-${obj.WeightTo || ''}`.replace(/-$/, '')
                                                                                                            : ''}
                                                                                                    </label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Height:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label className=''>
                                                                                                        {obj?.HeightFrom != null || obj?.HeightTo != null
                                                                                                            ? `${obj.HeightFrom || ''}-${obj.HeightTo || ''}`.replace(/-$/, '')
                                                                                                            : ''}
                                                                                                    </label>
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
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.EyeColor}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Address:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Address}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Reason Code:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.NameReasonCode}</label>
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
                                                                                                                        alt={` ${index + 1}`}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </AccordionTab>
                                                                    </Accordion>
                                                                ) : null}
                                                            </div> */}
                                                            {/* <div className="col-12 mt-2">
                                                                {ListData[0]?.Name && ListData[0]?.Name.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Name Information">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                {ListData[0]?.Comments?.map((obj) => (
                                                                                    <div className="row bb bt">

                                                                                        <div className="col-11">
                                                                                            <div className="row mt-2">
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Name Number:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.NameIDNumber}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Full Name</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.FullName}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Date Of Birth</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label className=''>{obj.DateOfBirth ? getShowingWithOutTime(obj.DateOfBirth) : ''}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Birth Place:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.BirthPlace}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Gender:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Gender}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Race:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Race}</label>
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
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.EyeColor}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Address:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Address}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Reason Code:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.NameReasonCode}</label>
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
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </AccordionTab>
                                                                    </Accordion>
                                                                ) : null}
                                                            </div>  */}
                                                            {/* <hr /> */}
                                                            {/* comments */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Comments && ListData[0]?.Comments.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Comments">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Comments</th>
                                                                                                <th className=''>Officer Name</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Comments?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.Comments}</td>
                                                                                                    <td>{obj.Officer_Name}</td>
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
                                                            {/* courtinformtion */}
                                                            <div className="col-12">
                                                                {ListData[0]?.CourtInformation && ListData[0]?.CourtInformation.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Court Information">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Plea Date Time</th>
                                                                                                <th className=''>Name</th>

                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.CourtInformation?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.PleaDateTime ? getShowingDateText(obj.PleaDateTime) : ''}</td>
                                                                                                    <td>{obj.Name}</td>
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
                                                            {/* narrative */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Narrative && ListData[0]?.Narrative.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Narrative">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Narrative Date/Time</th>
                                                                                                <th className=''>Narrative Comments</th>
                                                                                                <th className=''>Narrative</th>
                                                                                                <th className=''>Reported By</th>

                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Narrative?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.NarrativeDtTm ? getShowingDateText(obj.NarrativeDtTm) : ''}</td>
                                                                                                    <td>{obj.NarrativeComments}</td>
                                                                                                    <td>{obj.Narrative_Description}</td>
                                                                                                    <td>{obj.ReportedBy_Description}</td>

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
                                                            {/* charge */}
                                                            <div className="col-12">
                                                                {ListData[0]?.ChargeInformation && ListData[0]?.ChargeInformation.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Charge Information">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>TIBRS Code</th>
                                                                                                <th className=''>Charge Code/Description</th>
                                                                                                <th className=''>UCR Clear</th>
                                                                                                {/* <th className=''>Primary Officer</th> */}
                                                                                                {/* <th className=''>Reported By</th> */}

                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.ChargeInformation?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.ChargeCode}</td>
                                                                                                    <td>{obj.Description}</td>
                                                                                                    <td>{obj.UCRClear_Description}</td>
                                                                                                    {/* <td>{obj.PrimaryOfficer
                                                                                                    }</td> */}
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
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }

                                                <div className="col-12">
                                                    {ListData[0]?.Arrest && ListData[0]?.Arrest.length > 0 ? (
                                                        <Accordion activeIndex={0}>
                                                            <AccordionTab header="Charge">
                                                                <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                    <div className="table-responsive">
                                                                        <table className="table mt-2">
                                                                            <thead className='thead Summary-table'>
                                                                                <tr>
                                                                                    <th className=''>Arrest Number</th>
                                                                                    <th className=''>TIBRS Description</th>
                                                                                    <th className=''>UCR Clear Description</th>
                                                                                </tr>
                                                                            </thead>
                                                                            {ListData[0]?.Arrest?.map((obj) => (
                                                                                <tbody className='master-tbody'>
                                                                                    <tr >
                                                                                        <td>{obj.ArrestNumber}</td>
                                                                                        <td>{obj.Description}</td>
                                                                                        <td>{obj.UCRClear_Description
                                                                                        }</td>
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
                                                {/* property information */}
                                                {
                                                    ListData[0]?.Property?.length > 0 ?
                                                        <>
                                                            <div className="col-12 mt-2">
                                                                <Accordion activeIndex={0}>
                                                                    <AccordionTab header="Property Information">
                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                            {/* {ListData[0]?.Property?.map((obj) => ( */}
                                                                            {ListData[0]?.Property?.filter(obj => obj.Type !== 'Vehicle').map((obj) => (
                                                                                <div className="row bb bt">
                                                                                    {/* <div className="col-1"  >
                                                                                        <img src={multiImage} className='picture' style={{ marginTop: '4px', width: '150px', height: '100px' }} alt='Agency_Photo' />
                                                                                    </div> */}
                                                                                    <div className="col-11">
                                                                                        <div className="row mt-2">
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Property Number:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.PropertyNumber}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Property Type:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.PropertyType_Description}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Reason:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.LossCode}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Reported Date/Time:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.ReportedDtTm ? getShowingDateText(obj.ReportedDtTm) : ''}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Property Category:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Category}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                                                                                <label htmlFor="" className='new-summary '>Property&nbsp;Classification:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Classification}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Value:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Value}</label>
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
                                                                                                <label htmlFor="" className=''>{obj.Misc_description}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Evidence:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-10 mt-1">
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
                                                                                                                className=''
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
                                                            {ListData[0]?.Vehicle && ListData[0]?.Vehicle.length > 0 ? (

                                                                <div className="col-12 mt-2">
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Vehicle Information">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                {/* {ListData[0]?.Property?.map((obj) => ( */}
                                                                                {ListData[0]?.Property?.filter(obj => obj.Type === 'Vehicle').map((obj) => (
                                                                                    <div className="row bb bt">
                                                                                        {/* <div className="col-1"  >
                                                                                        <img src={multiImage} className='picture' style={{ marginTop: '4px', width: '150px', height: '100px' }} alt='Agency_Photo' />
                                                                                    </div> */}
                                                                                        <div className="col-11">
                                                                                            <div className="row mt-2">
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Vehicle Number:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.PropertyNumber}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Property Type:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Type}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Reason:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Reason}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Reported Date/Time:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.ReportedDtTm ? getShowingDateText(obj.ReportedDtTm) : ''}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Property Category:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Category}</label>
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
                                                                                                    <label htmlFor="" className=''>{obj.Value}</label>
                                                                                                </div>

                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Possession Of:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.PossessionName}</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                    <label htmlFor="" className='new-summary'>Misc:</label>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-10 mt-1">
                                                                                                    <label htmlFor="" className=''>{obj.Description}</label>
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
                                                                                                                        alt={` ${index + 1}`}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
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
                                                            ) : null}

                                                            {/* drug */}
                                                            {/* <hr /> */}
                                                            {ListData[0]?.Drug && ListData[0]?.Drug.length > 0 ? (
                                                                <div className="col-12">
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Drug">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Drug Type</th>
                                                                                                <th className=''>Estimated Drug Qty</th>
                                                                                                <th className=''>Fraction Drug Qty</th>
                                                                                                <th className=''>MeasureType</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Drug?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td className=''>{obj.DrugType}</td>
                                                                                                    <td className=''>{obj.EstimatedDrugQty}</td>
                                                                                                    <td className=''>{obj.FractionDrugQty}</td>
                                                                                                    <td className=''>{obj.MeasureType}</td>
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
                                                            {/* offense */}
                                                            {/* <hr /> */}
                                                            {/* {ListData[0]?.Offense?.map((obj) => ( */}
                                                            {
                                                                ListData[0]?.Offense && ListData[0]?.Offense.length > 0 ? (

                                                                    <div className="col-12">
                                                                        <Accordion activeIndex={0}>
                                                                            <AccordionTab header="Offense">
                                                                                <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                    <div className="table-responsive">
                                                                                        <table className="table mt-2">
                                                                                            <thead className='thead Summary-table'>
                                                                                                <tr>
                                                                                                    <th className=''>Attempt Complete</th>
                                                                                                    <th className=''>Charge Code</th>
                                                                                                    <th className=''>Offense</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            {ListData[0]?.Offense?.map((obj) => (
                                                                                                <tbody className='master-tbody'>
                                                                                                    <tr >
                                                                                                        <td className=''>{obj.AttemptComplete}</td>
                                                                                                        <td className=''>{obj.ChargeCode}</td>
                                                                                                        <td className=''>{obj.Offense_Description}</td>
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

                                                            {/* Notes */}
                                                            {/* <hr /> */}
                                                            {ListData[0]?.Notes && ListData[0]?.Notes.length > 0 ? (
                                                                <div className="col-12">
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Notes">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                {/* <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Created Date/Time</th>
                                                                                                <th className=''>Notes</th>
                                                                                                <th className=''>Officer Name</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Notes?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td className=''>{obj.CreatedDtTm ? getShowingDateText(obj.CreatedDtTm) : ''}</td>
                                                                                                    <td style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>{obj.Notes}</td>
                                                                                                    <td className=''
                                                                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj?.CommentsDoc) }}
                                                                                                    >
                                                                                                    </td>
                                                                                                    <td className=''>{obj.OfficerName}</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        ))}
                                                                                    </table>
                                                                                </div> */}
                                                                                {ListData[0]?.Notes?.map((obj) => (
                                                                                    <div className="col-12">
                                                                                        <div className="row mt-2">
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Created Date/Time:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.CreatedDtTm ? getShowingDateText(obj.CreatedDtTm) : ''}</label>
                                                                                            </div>
                                                                                            {/* <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Officer Name:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.OfficerName}</label>
                                                                                            </div> */}

                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Notes:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                {/* <label htmlFor="" className=''>{obj.OfficerName}</label> */}
                                                                                                <label htmlFor="" className=''
                                                                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj?.CommentsDoc) }}
                                                                                                >
                                                                                                </label>
                                                                                            </div>



                                                                                            {/* <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Notes:</label>
                                                                                            </div>
                                                                                            <div className="col-9 col-md-9 col-lg-10 mt-1">
                                                                                                <label htmlFor="" className=''
                                                                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj?.CommentsDoc) }}
                                                                                                >
                                                                                                </label>
                                                                                            </div> */}

                                                                                        </div>
                                                                                    </div>
                                                                                ))}

                                                                            </div>
                                                                        </AccordionTab>
                                                                    </Accordion>
                                                                </div>
                                                            ) : null}
                                                            {/* RecoveredProperty */}
                                                            {/* <hr /> */}
                                                            {ListData[0]?.RecoveredProperty && ListData[0]?.RecoveredProperty.length > 0 ? (
                                                                <div className="col-12">
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Recovered Property">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Recovered Date/Time</th>
                                                                                                <th className=''>Recovered Number</th>
                                                                                                <th className=''>Officer Name</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.RecoveredProperty?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td className=''>{obj.RecoveredDateTime ? getShowingDateText(obj.RecoveredDateTime) : ''}</td>
                                                                                                    <td className=''>{obj.RecoveredNumber}</td>
                                                                                                    <td className=''>{obj.OfficerName}</td>
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
                                                            {/* Document */}
                                                            {/* <hr /> */}
                                                            {ListData[0]?.Document && ListData[0]?.Document.length > 0 ? (
                                                                <div className="col-12">
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Document">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Document Name</th>
                                                                                                <th className=''>Document Type</th>
                                                                                                <th className=''>File Extension</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Document?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td className=''>{obj.DocumentName}</td>
                                                                                                    <td className=''>{obj.DocumentType}</td>
                                                                                                    <td className=''>{obj.FileExtension}</td>
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
                                                            {/* <hr /> */}
                                                            {/* owner */}
                                                            {ListData[0]?.Owner && ListData[0]?.Owner.length > 0 ? (
                                                                <div className="col-12">
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Owner">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Last Name</th>
                                                                                                <th className=''>First Name</th>
                                                                                                <th className=''>Middle Name</th>
                                                                                                <th className=''>Date Of Birth</th>
                                                                                                <th className=''>Gender</th>
                                                                                                <th className=''>Contact</th>
                                                                                                <th className=''>Race</th>
                                                                                                <th className=''>Address</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Owner?.map((obj) => (
                                                                                            <>
                                                                                                <tbody className='master-tbody'>
                                                                                                    <tr >
                                                                                                        <td className=''>{obj.LastName}</td>
                                                                                                        <td className=''>{obj.FirstName}</td>
                                                                                                        <td className=''>{obj.MiddleName}</td>
                                                                                                        <td className=''>{obj.DateOfBirth ? getShowingWithOutTime(obj.DateOfBirth) : ''}</td>
                                                                                                        <td className=''>{obj.Gender}</td>
                                                                                                        <td className=''>{obj.Contact}</td>
                                                                                                        <td className=''>{obj.Race}</td>
                                                                                                        <td className=''>{obj.Address}</td>
                                                                                                    </tr>
                                                                                                    {/* <div className="row">
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
                                                                                                </div> */}
                                                                                                </tbody>
                                                                                                {/* <div className="col-12">
                                                                                                    <div className="row">
                                                                                                        {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                                            <div className="col-12 col-md-12 col-lg-12 mt-2" key={index}>
                                                                                                                <img
                                                                                                                    src={url.trim()}
                                                                                                                    className='picture'
                                                                                                                    style={{ width: '150px', height: '100px' }}
                                                                                                                    alt={` ${index + 1}`}
                                                                                                                />
                                                                                                            </div>
                                                                                                        ))}
                                                                                                    </div>
                                                                                                </div> */}

                                                                                                <div className="col-12">
                                                                                                    <div className='text-field'>
                                                                                                        <div className="row">
                                                                                                            {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2" key={index}>
                                                                                                                    <img
                                                                                                                        src={url.trim()}
                                                                                                                        className='picture'
                                                                                                                        style={{ width: '300px', height: '100px' }}
                                                                                                                        alt={` ${index + 1}`}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            ))}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </>

                                                                                        ))}
                                                                                    </table>

                                                                                </div>
                                                                            </div>
                                                                        </AccordionTab>
                                                                    </Accordion>
                                                                </div>
                                                            ) : null}

                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }
                                                {/* Vehicle information */}
                                                {
                                                    ListData[0]?.Vehicle?.length > 0
                                                        ?
                                                        <>
                                                            <div className="col-12 mt-2">
                                                                <Accordion activeIndex={0}>
                                                                    <AccordionTab header="Vehicle Information">
                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                            {ListData[0]?.Vehicle?.map((obj) => (
                                                                                <div className="row ">
                                                                                    {/* <div className="col-1"  >
                                                                                        <img src={multiImage} className='picture' style={{ marginTop: '4px', width: '150px', height: '100px' }} alt='Agency_Photo' />
                                                                                    </div> */}
                                                                                    <div className="col-11">
                                                                                        <div className="row mt-2">
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Vehicle Number:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.VehicleNumber}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Reported Date/Time</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.ReportedDtTm ? getShowingDateText(obj.ReportedDtTm) : ''}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Primary Officer:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.PrimaryOfficer}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Reason:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.LossCode}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Make:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Make}</label>
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
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Category}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Classification:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Classification}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Primary Color:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.PrimaryColor}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Sec Color:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.SecondaryColor}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Possession Of:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Possession}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Plate:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.VehicleNo}</label>
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
                                                                                                                    alt={` ${index + 1}`}
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
                                                            {/* Notes */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Notes && ListData[0]?.Notes.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Notes">
                                                                            {ListData[0]?.Notes?.map((obj) => (
                                                                                <div className="col-12">
                                                                                    <div className="row mt-2">
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Created Date/Time:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.CreatedDtTm ? getShowingDateText(obj.CreatedDtTm) : ''}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Officer Name:</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                            <label htmlFor="" className=''>{obj.OfficerName}</label>
                                                                                        </div>
                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                            <label htmlFor="" className='new-summary'>Notes:</label>
                                                                                        </div>
                                                                                        <div className="col-9 col-md-9 col-lg-10 mt-1">
                                                                                            <label htmlFor="" className=''
                                                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj?.CommentsDoc) }}
                                                                                            >
                                                                                            </label>
                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                            {/* <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Created Date/Time</th>
                                                                                                <th className=''>Notes</th>
                                                                                                <th className=''>Officer Name</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Notes?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td className=''>{obj.CreatedDtTm ? getShowingDateText(obj.CreatedDtTm) : ''}</td>
                                                                                                    <td className=''>{obj.Notes}</td>
                                                                                                    <td className=''>{obj.OfficerName}</td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        ))}
                                                                                    </table>
                                                                                </div> */}
                                                                        </AccordionTab>
                                                                    </Accordion>
                                                                ) : null}
                                                            </div>
                                                            {/* RecoveredProperty */}
                                                            <div className="col-12">
                                                                {ListData[0]?.RecoveredVehicle && ListData[0]?.RecoveredVehicle.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Recovered Vehicle">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Recovered Date/Time</th>
                                                                                                <th className=''>Recovered Number</th>
                                                                                                <th className=''>Officer Name</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.RecoveredVehicle?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td className=''>{obj.RecoveredDateTime ? getShowingDateText(obj.RecoveredDateTime) : ''}</td>
                                                                                                    <td className=''>{obj.RecoveredNumber}</td>
                                                                                                    <td className=''>{obj.OfficerName}</td>
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
                                                            {/* Document */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Document && ListData[0]?.Document.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Document">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Document Name</th>
                                                                                                <th className=''>Document Type</th>
                                                                                                <th className=''>File Extension</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Document?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td className=''>{obj.DocumentName}</td>
                                                                                                    <td className=''>{obj.DocumentType}</td>
                                                                                                    <td className=''> {obj.FileExtension}</td>
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
                                                            {/* owner */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Owner && ListData[0]?.Owner.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Owner">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Last Name</th>
                                                                                                <th className=''>First Name</th>
                                                                                                <th className=''>Middle Name</th>
                                                                                                <th className=''>Date Of Birth</th>
                                                                                                <th className=''>Gender</th>
                                                                                                <th className=''>Contact</th>
                                                                                                <th className=''>Race</th>
                                                                                                <th className=''>Address</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Owner?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td className=''>{obj.LastName}</td>
                                                                                                    <td className=''>{obj.FirstName}</td>
                                                                                                    <td className=''>{obj.MiddleName}</td>
                                                                                                    <td className=''>{obj.DateOfBirth ? getShowingWithOutTime(obj.DateOfBirth) : ''}</td>
                                                                                                    <td className=''>{obj.Gender}</td>
                                                                                                    <td className=''>{obj.Contact}</td>
                                                                                                    <td className=''>{obj.Race}</td>
                                                                                                    {/* <td className=''>{obj.Race}</td>
                                                                                                    <td className=''>{obj.Race}</td> */}
                                                                                                    <td className=''>{obj.Address}</td>
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
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }
                                                {
                                                    ListData[0]?.Name?.length > 0
                                                        ?
                                                        <>
                                                            {/* <div className="col-12 mt-2">
                                                                <Accordion activeIndex={0}>
                                                                    <AccordionTab header="Name Information">
                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                            {ListData[0]?.Name?.map((obj) => (
                                                                                <div className="row bb bt">
                                                                                
                                                                                    <div className="col-11">
                                                                                        <div className="row mt-2">
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Name Number:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.NameIDNumber}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Full Name</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.FullName}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Date Of Birth</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label className=''>{obj.DateOfBirth ? getShowingWithOutTime(obj.DateOfBirth) : ''}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Birth Place:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.BirthPlace}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Gender:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Gender}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Race:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Race}</label>
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
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.EyeColor}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Address:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.Address}</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                <label htmlFor="" className='new-summary'>Reason Code:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.NameReasonCode}</label>
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
                                                                                                <label htmlFor="" className='new-summary'>Name Type:</label>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                                                <label htmlFor="" className=''>{obj.NameType}</label>
                                                                                            </div>
                                                                                            {obj.NameType === 'Business' ? (
                                                                                                <div className="col-12 mt-2">
                                                                                                    <div className="row">
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Business Name:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.FullName}</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Business Type:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.BusinessType}</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Contact Type:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.PhoneType}</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Contact:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.Contact}</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Owner Name:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.OwnerName}</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Owner Phone No:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.OwnerPhoneNumber}</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Owner Fax No:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.OwnerFaxNumber}</label>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : null}
                                                                                            {obj.NameType === 'Person' ? (
                                                                                                <div className="col-12 mt-2">
                                                                                                    <div className="row">
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Full Name:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.FullName}</label>
                                                                                                        </div>
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
                                                                                                            <label htmlFor="" className='new-summary'>Address:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.Address}</label>
                                                                                                        </div>

                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Reason Code:</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.NameReasonCode}</label>
                                                                                                        </div>

                                                                                                        {/* <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Address:</label>
                                                                                                        </div>
                                                                                                        <div className="col-9 col-md-9 col-lg-10 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.Address}</label>
                                                                                                        </div>
                                                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                                                            <label htmlFor="" className='new-summary'>Reason Code:</label>
                                                                                                        </div>
                                                                                                        <div className="col-9 col-md-9 col-lg-10 mt-1">
                                                                                                            <label htmlFor="" className=''>{obj.NameReasonCode}</label>
                                                                                                        </div> */}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : null}
                                                                                            <div className="col-12">
                                                                                                <div className='text-field'>
                                                                                                    <div className="row">
                                                                                                        {obj.Photo && obj.Photo.split(',').map((url, index) => (
                                                                                                            <div className="col-3 col-md-3 col-lg-3 mt-2" key={index}>
                                                                                                                <img
                                                                                                                    src={url.trim()}
                                                                                                                    className='picture'
                                                                                                                    style={{ width: '150px', height: '100px' }}
                                                                                                                    alt={` ${index + 1}`}
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
                                                            {/* Alias */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Alias && ListData[0]?.Alias.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Alias">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Last Name</th>
                                                                                                <th className=''>First Name</th>
                                                                                                <th className=''>Middle Name</th>
                                                                                                <th className=''>Alias SSN</th>
                                                                                                <th className=''>Suffix</th>
                                                                                                <th className=''>DOB</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Alias?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.LastName}</td>
                                                                                                    <td>{obj.FirstName}</td>
                                                                                                    <td>{obj.MiddleName}</td>
                                                                                                    <td>{obj.AliasSSN}</td>
                                                                                                    <td>{obj.Suffix}</td>
                                                                                                    <td>{obj.DOB ? getShowingWithOutTime(obj.DOB) : ''}</td>
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
                                                            {/* Contact */}
                                                            {/* <hr /> */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Contact && ListData[0]?.Contact.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Contact">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Contact Type</th>
                                                                                                <th className=''>Current Phone</th>
                                                                                                <th className=''>Unlisted Phone</th>
                                                                                                <th className=''>Phone/Email</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Contact?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.ContactType}</td>
                                                                                                    <td>
                                                                                                        <input type="checkbox" name="" id="" checked={obj.IsCurrentPh} />
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <input type="checkbox" name="" id="" checked={obj.IsInListedPh} />
                                                                                                    </td>
                                                                                                    <td>{obj.Phone_Email}</td>
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
                                                            {/* Identification */}
                                                            {/* <hr /> */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Identification && ListData[0]?.Identification.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Identification">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Identification Type</th>
                                                                                                <th className=''>Identification Number</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Identification?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.IdentificationType_Des}</td>
                                                                                                    <td>{obj.IdentificationNumber}</td>
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
                                                            {/* SMT */}
                                                            {/* <hr /> */}
                                                            <div className="col-12">
                                                                {ListData[0]?.SMT && ListData[0]?.SMT.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="SMT">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>SMT Location</th>
                                                                                                <th className=''>SMT Type</th>
                                                                                                <th className=''>SMT Description</th>

                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.SMT?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.SMTLocation}</td>
                                                                                                    <td>{obj.SMTType}</td>
                                                                                                    <td>{obj.SMT_Description}</td>
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
                                                            {/* Document */}
                                                            {/* <hr /> */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Document && ListData[0]?.Document.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Document">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Document Name</th>
                                                                                                <th className=''>Document Type</th>
                                                                                                <th className=''>File Extension</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Document?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.DocumentName}</td>
                                                                                                    <td>{obj.DocumentType}</td>
                                                                                                    <td>{obj.FileExtension}</td>
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
                                                            {/* Address */}
                                                            {/* <hr /> */}
                                                            <div className="col-12">
                                                                {ListData[0]?.Address && ListData[0]?.Address.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Address">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>Address</th>
                                                                                                <th className=''>Address Type</th>

                                                                                                <th className=''>Date From</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Address?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.Address}</td>
                                                                                                    <td>{obj.Type}</td>
                                                                                                    <td>{obj.DateFrom ? getShowingWithOutTime(obj.DateFrom) : ''}</td>
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
                                                            <div className="col-12">
                                                                {ListData[0]?.Crime && ListData[0]?.Crime.length > 0 ? (
                                                                    <Accordion activeIndex={0}>
                                                                        <AccordionTab header="Offense Information">
                                                                            <div className="col-12 col-md-12 col-lg-12 mt-1">
                                                                                <div className="table-responsive">
                                                                                    <table className="table mt-2">
                                                                                        <thead className='thead Summary-table'>
                                                                                            <tr>
                                                                                                <th className=''>CFS Code</th>
                                                                                                <th className=''>CFS Description</th>

                                                                                                <th className=''>Premise Type</th>
                                                                                                <th className=''>Type</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        {ListData[0]?.Crime?.map((obj) => (
                                                                                            <tbody className='master-tbody'>
                                                                                                <tr >
                                                                                                    <td>{obj.CFSCode}</td>
                                                                                                    <td>{obj.CFS_Description}</td>
                                                                                                    <td>{obj.PremiseType}</td>
                                                                                                    <td>{obj.Type}</td>
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
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }

                                                {/* <div className="col-12 col-md-12 col-lg-12">
                                                    <Accordion activeIndex={0}>
                                                        <AccordionTab header="Incident Information">
                                                    
                                                            <div className="row">
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Incident Number</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                    <label htmlFor="" className=''>{data.IncidentNumber}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-1 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Reported&nbsp;Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1 pl-4">
                                                                    <label htmlFor="" className=' '>{data.ReportedDate ? getShowingDateText(data.ReportedDate) : ''}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-1 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Occurred&nbsp;From</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1 pl-4">
                                                                    <label htmlFor="" className=''>{data.OccurredFrom ? getShowingDateText(data.OccurredFrom) : ''}</label>
                                                                </div>
                                                          
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>CAD CFS Code:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.CADCFSCode_Description}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Crime Location:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.CrimeLocation}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Primary Officer:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.PrimaryOfficer}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>RMS Disposition:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.RMS_Disposition}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>CAD Disposition:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.CADDispositions_Description}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Dispatching Agency:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.Dispatching_Agency}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                    <label htmlFor="" className='new-summary'>Dispatcher:</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                    <label htmlFor="" className=''>{data.Dispatcher}</label>
                                                                </div>
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                </div> */}

                                                <div className="col-12 col-md-12 col-lg-12">
                                                    <Accordion activeIndex={0}>
                                                        <AccordionTab header="Incident Information">
                                                            <div className="row">
                                                                {/* {/ Incident Number /} */}
                                                                {data.IncidentNumber && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="" className="new-summary">Incident Number</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                            <label htmlFor="">{data.IncidentNumber}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ Reported Date /} */}
                                                                {data.ReportedDate && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-1 mt-1">
                                                                            <label htmlFor="" className="new-summary">Reported&nbsp;Date</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1 pl-4">
                                                                            <label htmlFor="">{getShowingDateText(data.ReportedDate)}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ Occurred From /} */}
                                                                {data.OccurredFrom && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-1 mt-1">
                                                                            <label htmlFor="" className="new-summary">Occurred&nbsp;From</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1 pl-4">
                                                                            <label htmlFor="">{getShowingDateText(data.OccurredFrom)}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ CAD CFS Code /} */}
                                                                {data.CADCFSCode_Description && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="" className="new-summary">CAD CFS Code:</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                            <label htmlFor="">{data.CADCFSCode_Description}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ Crime Location /} */}
                                                                {data.CrimeLocation && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="" className="new-summary">Crime Location:</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                            <label htmlFor="">{data.CrimeLocation}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ Primary Officer /} */}
                                                                {data.PrimaryOfficer && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="" className="new-summary">Primary Officer:</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                            <label htmlFor="">{data.PrimaryOfficer}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ RMS Disposition /} */}
                                                                {data.RMS_Disposition && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="" className="new-summary">Exceptional Clearance(Yes/No)</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-1 mt-1">
                                                                            <label htmlFor="">{data.RMS_Disposition}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ CAD Disposition /} */}
                                                                {data.CADDispositions_Description && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="" className="new-summary">CAD Disposition:</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="">{data.CADDispositions_Description}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ Dispatching Agency /} */}
                                                                {data.Dispatching_Agency && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="" className="new-summary">Dispatching Agency:</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="">{data.Dispatching_Agency}</label>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {/* {/ Dispatcher /} */}
                                                                {data.Dispatcher && (
                                                                    <>
                                                                        <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                            <label htmlFor="" className="new-summary">Dispatcher:</label>
                                                                        </div>
                                                                        <div className="col-3 col-md-3 col-lg-4 mt-1">
                                                                            <label htmlFor="">{data.Dispatcher}</label>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </AccordionTab>
                                                    </Accordion>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div >
                        </div >
                    </>
                    :
                    <>
                    </>
            }
        </>
    )
}

export default OtherSummaryModel