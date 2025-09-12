import React, { useEffect, useState } from 'react'
import { fetchPostData } from '../../hooks/Api';
import { useLocation, } from 'react-router-dom';
import { base64ToString, getShowingWithOutTime } from '../../Common/Utility';

const VehicleListing = (props) => {
    const { ListData, } = props

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecVehId = 0
    const query = useQuery();
    var VehId = query?.get("VehId");

    if (!VehId) VehId = 0;
    else DecVehId = parseInt(base64ToString(VehId));

    const [vehData, setVehData] = useState([]);
    const [value, setValue] = useState({
        'VehicleID': '',
    });

    useEffect(() => {
        if (ListData) {
            // console.log(ListData)
        }
        // if (DecVehId) {
        //     setValue({ ...value, 'NameID': VehId, });
        //     get_Veh(DecVehId);
        // }
    }, [DecVehId]);

    const get_Veh = (VehicleID) => {
        const val = { VehicleID: VehicleID, }
        fetchPostData('TabBasicInformation/VehicleInformation', val).then((res) => {
            if (res) {
                setVehData(res);
            } else {
                setVehData([]);
            }
        })
    }

    return (
        <>
            {
                ListData?.length === 0 ?
                    <>
                        <div className="mt-2">
                            <fieldset>
                                <legend>Vehicle Information</legend>
                                <div className="col-12 bb">
                                    <div className="row">
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Vehicle&nbsp;No:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-1 text-show px-0">
                                            <label htmlFor="" className='px-0'></label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Category:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 text-show">
                                            <label htmlFor=""></label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Loss Code:</p>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2 text-show">
                                            <label htmlFor=""></label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 showlist">
                                            <p htmlFor="" className='label-name'>Plate Type:</p>
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
                                    <legend>Vehicle Information</legend>
                                    <div className="col-12 bb">
                                        <div className="row">
                                            <div className="col-2 col-md-2 col-lg-1 showlist">
                                                <p htmlFor="" className='label-name'>Vehicle&nbsp;No:</p>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-1 text-show px-0">
                                                <label htmlFor="" className='px-0'>{data.VehicleNumber}</label>
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 showlist">
                                                <p htmlFor="" className='label-name'>Category:</p>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3 text-show">
                                                <label htmlFor="">{data.Category_Description}</label>
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 showlist">
                                                <p htmlFor="" className='label-name'>Loss Code:</p>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2 text-show">
                                                <label htmlFor="">{data.LossCode_Description}</label>
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 showlist">
                                                <p htmlFor="" className='label-name'>Plate Type:</p>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2 text-show">
                                                <label htmlFor="">{data.PlateType_Description}</label>
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

export default VehicleListing