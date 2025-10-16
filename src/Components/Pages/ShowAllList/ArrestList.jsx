import React, { useEffect, useState } from 'react'
import { fetchPostData } from '../../hooks/Api';
import { useLocation, } from 'react-router-dom';
import { base64ToString, getShowingWithOutTime } from '../../Common/Utility';

const ArresList = (props) => {

    const { ListData, } = props

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecOffID = 0
    const query = useQuery();
    var OffId = query?.get("OffId");

    if (!OffId) OffId = 0;
    else DecOffID = parseInt(base64ToString(OffId));

    const [offData, setOffData] = useState([]);
    const [value, setValue] = useState({
        'CrimeID': '',
    });

    // useEffect(() => {
    //     if (DecOffID) {
    //         setValue({ ...value, 'CrimeID': OffId, });
    //         get_Off(DecOffID);
    //     }
    // }, [DecOffID]);

    const get_Off = (CrimeID) => {
        const val = { CrimeID: CrimeID, }
        fetchPostData('TabBasicInformation/CrimeInformation', val).then((res) => {
            if (res) {

                setOffData(res);
            } else {
                setOffData([]);
            }
        })
    }

    return (
        <>
            {
                ListData?.length === 0
                    ?
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
                                            <p htmlFor="" className='label-name'>Race:</p>
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
                                                <p htmlFor="" className='label-name'>Race:</p>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2 text-show">
                                                <label htmlFor="">{data.Race}</label>
                                            </div>

                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        ))}
                    </>
            }
        </>
    )
}

export default ArresList