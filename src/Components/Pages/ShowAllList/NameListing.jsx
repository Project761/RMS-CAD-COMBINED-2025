import React, { useEffect, useState } from 'react'
import { fetchPostData } from '../../hooks/Api';
import { useLocation, } from 'react-router-dom';
import { base64ToString, getShowingWithOutTime } from '../../Common/Utility';
import { ErrorTooltipComp } from '../Name/NameNibrsErrors';

const NameListing = (props) => {

    const { ListData, page, victimCode } = props
    // console.log("🚀 ~ NameListing ~ props:", props);
    // console.log("🚀 ~ NameListing ~ page:", page);
    // console.log("🚀 ~ NameListing ~ victimCode:", victimCode);
    // console.log("🚀 ~ NameListing ~ ListData:", ListData);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DeNameID = 0
    const query = useQuery();
    var NameID = query?.get("NameID");
    if (!NameID) NameID = 0;

    // const get_Name = (NameID) => {
    //     const val = { NameID: NameID, }
    //     fetchPostData('TabBasicInformation/NameInformation', val).then((res) => {
    //         if (res) {
    //             setNameData(res);
    //         } else {
    //             setNameData([]);
    //         }
    //     })
    // }

    return (
        <>
            {
                ListData?.length === 0 ?
                    <>
                        <div className="mt-2">
                            <fieldset>
                                <legend>Name Information</legend>
                                <div className="col-12 bb">
                                    <div className="row">
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Name:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 text-show">
                                            <label htmlFor=""></label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>DOB:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 text-show">
                                            <label htmlFor=""></label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Gender:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 text-show">
                                            <label htmlFor=""></label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>SSN:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 text-show">
                                            <label htmlFor=""></label>
                                        </div>
                                    </div>

                                </div>
                            </fieldset>
                        </div>
                    </>
                    :
                    <>
                        {ListData?.map((data, index) => (
                            <div key={index} className="mt-2">
                                <fieldset>
                                    <legend>Name Information</legend>
                                    <div className="col-12 bb">
                                        <div className="row">
                                            {data.NameTypeID === 2 ? (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 showlist">
                                                        <p htmlFor="" className='label-name'>Business Name:</p>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-2 text-show">
                                                        <label htmlFor="">{data.FullName}</label>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {data.NameTypeID !== 2 && (
                                                        <>
                                                            <div className="col-2 col-md-2 col-lg-1 showlist">
                                                                <p htmlFor="" className='label-name'>Name:</p>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-2 text-show">
                                                                <label htmlFor="">{data.FullName}</label>
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1 showlist">
                                                                <p htmlFor="" className='label-name'>DOB:</p>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-2 text-show">
                                                                <label htmlFor="">{data.DateOfBirth ? getShowingWithOutTime(data.DateOfBirth) : ''}</label>
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1 showlist">
                                                                <p htmlFor="" className='label-name'>Gender:</p>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-2 text-show">
                                                                <label htmlFor="">{data.Gender}</label>
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1 showlist">
                                                                <p htmlFor="" className='label-name'>SSN:</p>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-2 text-show">
                                                                <label htmlFor="">{data.SSN}</label>
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        {
                                            page === 'Victim' ?
                                                <div className="row">
                                                    <div className="col-2 col-md-2 col-lg-1 showlist">
                                                        <p htmlFor="" className='label-name'>
                                                            {
                                                                (victimCode != 'L' && victimCode != 'I') && data.AgeFrom ? <ErrorTooltipComp ErrorStr={'For selected vic type Age is not Valid'} /> : ''
                                                            }
                                                            Age From:
                                                        </p>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-2 text-show">
                                                        <label htmlFor="">{data.AgeFrom}</label>
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-1 showlist">
                                                        <p htmlFor="" className='label-name'>
                                                            {
                                                                (victimCode != 'L' && victimCode != 'I') && data.AgeTo ? <ErrorTooltipComp ErrorStr={'For selected vic type Age is not Valid'} /> : ''
                                                            }
                                                            Age To:
                                                        </p>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-2 text-show">
                                                        <label htmlFor="">{data.AgeTo}</label>
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-1 showlist">
                                                        <p htmlFor="" className='label-name'>
                                                            {
                                                                (victimCode != 'L' && victimCode != 'I') && data.Race ? <ErrorTooltipComp ErrorStr={'For selected vic type Race is not Valid'} /> : ''
                                                            }
                                                            Race:
                                                        </p>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-2 text-show">
                                                        <label htmlFor="">{data.Race}</label>
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-1 showlist">
                                                        <p htmlFor="" className='label-name'>
                                                            {
                                                                (victimCode != 'L' && victimCode != 'I') && data.Ethnicity ? <ErrorTooltipComp ErrorStr={'For selected vic type Ethnicity is not Valid'} /> : ''
                                                            }
                                                            Ethnicity:
                                                        </p>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-2 text-show">
                                                        <label htmlFor="">{data.Ethnicity}</label>
                                                    </div>
                                                </div>
                                                :
                                                <></>
                                        }
                                    </div>
                                </fieldset>
                            </div>
                        ))}
                    </>
            }
        </>
    )
}

export default NameListing