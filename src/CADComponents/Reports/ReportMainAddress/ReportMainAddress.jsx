const ReportMainAddress = (props) => {
    const { multiImage, agencyData } = props

    return (
        <>
            <div className="col-12 d-flex mt-2 mb-2">

                <div className="img-box" >
                    <img src={multiImage} className='' style={{ marginTop: '4px', width: '150px', height: '150px' }} alt="" />
                </div>
                <div className="main ml-4 mt-3">
                    <h5 className='text-dark font-weight-bold' style={{ fontSize: "24px" }}>{agencyData?.Agency_Name}</h5>
                    <p className='text-p'>Address: <span className='text-address'>{agencyData?.Agency_Address1}</span></p>
                    <div className='d-flex justify-content-start flex-wrap'>
                        <p className='text-p'>City: <span className='text-gray'>{agencyData?.CityName}</span></p>
                        <p className='text-p mb-1 ml-2'>State: <span className='text-gray'>{agencyData?.StateName}</span></p>
                        <p className='text-p mb-1 ml-2'>Zip: <span className='text-gray'>{agencyData?.Zipcode}</span></p>
                    </div>
                    <div className='d-flex justify-content-start flex-wrap'>
                        <p className='text-p mb-1'>Phone: <span className='text-gray'>{agencyData?.Agency_Phone}</span></p>
                        <p className='text-p mb-1 ml-2'>Fax: <span className='text-gray'>{agencyData?.Agency_Fax}</span></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportMainAddress