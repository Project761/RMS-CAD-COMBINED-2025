import React from 'react'

const ReportAddress = (props) => {
    const { multiImage, masterReportData } = props

    return (
        <>
            <div className="col-4 col-md-3 col-lg-2 pt-1 ml-3 mt-3">

                <div className="img-box " >
                    <img src={multiImage} className='' style={{ marginTop: '4px', width: '150px', height: '150px' }} />
                </div>

            </div>

            <div className="col-7 col-md-7 col-lg-9 mt-3">
                <div className="main">
                    <h5 className='text-dark font-weight-bold mb-1'>{masterReportData?.Agency_Name}</h5>
                    <p className='text-p mb-1'>Address: <span className='text-address'>{masterReportData?.Agency_Address1}</span></p>
                    <div className='d-flex justify-content-start flex-wrap mb-1'>
                        <p className='text-p  mb-0'>City: <span className='text-gray ml-2'>{masterReportData?.CityName}</span></p>
                        <p className='text-p mb-0  ml-3'>State: <span className='text-gray'>{masterReportData?.StateName}</span></p>
                        <p className='text-p mb-0 ml-3'>Zip: <span className='text-gray'>{masterReportData?.Zipcode}</span></p>
                    </div>
                    <div className='d-flex justify-content-start flex-wrap mb-1'>
                        <p className='text-p'>Phone: <span className='text-gray ml-1'>{masterReportData?.Agency_Phone}</span></p>
                        <p className='text-p  ml-4'>Fax: <span className='text-gray'>{masterReportData?.Agency_Fax}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportAddress