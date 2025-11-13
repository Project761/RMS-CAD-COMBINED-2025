import React from 'react'

const ReportAddress = (props) => {
    const { multiImage, masterReportData } = props

    return (<>
        <style>
            {`
            .text-description {
                font-size: 16px;
                color: #283041 !important;
                font-weight: 400;
                user-select: none;
            }
        `}
        </style>
        <style>
            {`
            .text-title {
                color: #000000e8 !important;
                font-weight: 600 !important;
            }
        `}
        </style>
        <div className="col-4 col-md-3 col-lg-2 pt-1 ml-3 mt-3">
            <div className="img-box " >
                <img src={multiImage} className='' style={{ marginTop: '4px', width: '135px', height: '135px' }} />
            </div>

        </div>

        <div className="col-7 col-md-7 col-lg-9 mt-4">
            <div className="main">
                <h5 className='text-dark font-weight-bold mb-1.5 mt-1'>{masterReportData?.Agency_Name}</h5>
                <p className='text-title mb-2'>Address: <span className='text-description ml-1'>{masterReportData?.Agency_Address1}</span></p>
                <div className='d-flex justify-content-start flex-wrap mb-2'>
                    <p className='text-title  mb-0'>City: <span className='text-description ml-1'>{masterReportData?.CityName}</span></p>
                    <p className='text-title mb-0  ml-4'>State: <span className='text-description ml-1'>{masterReportData?.StateName}</span></p>
                    <p className='text-title mb-0 ml-4'>Zip: <span className='text-description ml-1'>{masterReportData?.Zipcode}</span></p>
                </div>
                <div className='d-flex justify-content-start flex-wrap mb-2'>
                    <p className='text-title'>Phone: <span className='text-description ml-1'>{masterReportData?.Agency_Phone}</span></p>
                    <p className='text-title  ml-4'>Fax: <span className='text-description ml-1'>{masterReportData?.Agency_Fax}</span></p>
                </div>
            </div>
        </div>
    </>
    )
}

export default ReportAddress