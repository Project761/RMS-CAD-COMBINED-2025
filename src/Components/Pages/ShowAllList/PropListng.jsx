import React, { useEffect, useState } from 'react'
import { fetchPostData } from '../../hooks/Api';
import { useLocation, } from 'react-router-dom';
import { base64ToString, getShowingWithOutTime } from '../../Common/Utility';

const PropListng = (props) => {
    const { ListData, } = props
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecPropID = 0
    const query = useQuery();
    var ProId = query?.get("ProId");
    let MstPage = query?.get('page');


    if (!ProId) ProId = 0;
    else DecPropID = parseInt(base64ToString(ProId));

    const [propData, setPropData] = useState([]);
    const [value, setValue] = useState({
        'PropertyID': '',
        'MasterPropertyID': '',
        'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
    });

    useEffect(() => {
        // if (DecPropID) {
        //     setValue({ ...value, 'PropertyID': ProId, });
        //     get_Prop(DecPropID);
        // }
    }, [DecPropID]);

    const get_Prop = (PropertyID) => {
        const val = { PropertyID: PropertyID, }
        fetchPostData('TabBasicInformation/PropertyInformation', val).then((res) => {
            if (res) {
              
                setPropData(res);
            } else {
                setPropData([]);
            }
        })
    }

    return (
        <>
            {
                ListData?.length === 0
                    ?
                    <>
                        <div className="col-12 mt-2">
                            <fieldset>
                                <legend>Property Information</legend>
                                <div className="row bb">
                                    <div className="col-2 col-md-2 col-lg-1 showlist px-0">
                                        <p htmlFor="" className='label-name px-0'>Property&nbsp;No.</p>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-1 text-show ">
                                        <label htmlFor="" className=''></label>
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-1 showlist">
                                        <p htmlFor="" className='label-name'>Type:</p>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-1 text-show">
                                        <label htmlFor=""></label>
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-1 showlist">
                                        <p htmlFor="" className='label-name'>Category:</p>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 text-show">
                                        <label htmlFor=""></label>
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-1 showlist">
                                        <p htmlFor="" className='label-name'>Loss Code:</p>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2 text-show">
                                        <label htmlFor=""></label>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </>
                    :
                    <>
                        {ListData?.map((data, index) => (
                            <div key={index} className="col-12 mt-2">
                                <fieldset>
                                    <legend>Property Information</legend>
                                    <div className="row bb">
                                        <div className="col-2 col-md-2 col-lg-1 showlist px-0">
                                            <p htmlFor="" className='label-name px-0'>Property&nbsp;No:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-1 text-show ">
                                            <label htmlFor="" className=''>{data.PropertyNumber}</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Type:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-1 text-show">
                                            <label htmlFor="">{data.PropertyType_Description}</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Category:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4 text-show">
                                            <label htmlFor="">{data.PropertyCategory_Description}</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Loss Code:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 text-show">
                                            <label htmlFor="">{data.PropertyLossCode_Description}</label>
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

export default PropListng