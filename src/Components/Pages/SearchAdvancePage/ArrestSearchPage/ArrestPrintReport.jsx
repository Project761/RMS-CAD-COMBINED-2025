import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPostData } from '../../../hooks/Api';
import { getShowingDateText } from '../../../Common/Utility';

const ArrestPrintReport = (props) => {
    const { componentRef, selectedStatus, setSelectedStatus, arrestSearchData, searchData } = props

    const [multiImage, setMultiImage] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [data, setData] = useState('');
    const [propertyCategoryCode, setPropertyCategoryCode] = useState('');
    const [value, setValue] = useState('');
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        if (LoginAgencyID) {
            getAgencyImg(LoginAgencyID);
        }
    }, [LoginAgencyID]);

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

    console.log(arrestSearchData)

    return (
        <>
            {
                arrestSearchData ? (
                    <>
                        <div className="container" ref={componentRef}>
                            <div className="property-room px-3">
                                <div className="row">
                                    <div className="col-4 col-md-3 col-lg-2 mt-2">
                                        <div className="img-box" >
                                            <img src={searchData.Agency_Photo} className='picture' style={{ width: '150px', height: '140px' }} />
                                        </div>
                                    </div>
                                    <div className="col-8 col-md-9 col-lg-10">
                                        <div className="row mt-3">
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Agency:</h6>
                                                <span>{searchData.Agency_Name}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Phone:</h6>
                                                <span>{searchData.Agency_Phone}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Fax:</h6>
                                                <span>{searchData.Agency_Fax}</span>
                                            </div>
                                            <div className="col-7 d-flex justify-content-center">
                                                <h6>Address:</h6>
                                                <span>{searchData.Agency_Address1}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="container" style={{ pageBreakAfter: 'always' }}>
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center ">
                                        <p className="p-0 m-0 d-flex align-items-center">Arrest Search Report</p>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <span className='text-end'>
                                                Total Data: {arrestSearchData?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="table-responsive bb">
                                        <table className="table table-bordered">
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className='' style={{ width: '150px' }}>Arrest Date/Time</th>
                                                    <th className='' style={{ width: '150px' }}>Arrest No.</th>
                                                    <th className='' style={{ width: '150px' }}>Incident No.</th>
                                                    <th className='' style={{ width: '150px' }}>Arrest Type</th>
                                                    <th className='' style={{ width: '150px' }}>Arrestee Name</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {arrestSearchData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.ArrestDtTm && getShowingDateText(item?.ArrestDtTm)}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.ArrestNumber}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.IncidentNumber}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.ArrestType_Description}</td>
                                                        <td className='text-list' style={{ width: '150px' }}>{item?.Arrestee_Name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
                    :
                    <></>
            }
        </>
    )
}
export default ArrestPrintReport