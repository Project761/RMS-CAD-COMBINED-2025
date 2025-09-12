
const IdentifyFieldColor = () => {

    return (
        <div className="col-md-12 field-main mt-2 ">
            <div className="row px-1 field-identify-color">
                <div className="col-4 col-md-3 col-lg-2 d-flex">
                    <div className="geekmark mt-2"></div>
                    <label className='ml-1'>Required</label>
                </div>
                <div className="col-4 col-md-3 col-lg-2 d-flex">
                    <span className="geekmark1 mt-2"></span>
                    <label className='ml-1'>Read Only</label>
                </div>
                <div className="col-4 col-md-3 col-lg-2 d-flex">
                    <span className="geekmark2 mt-2"></span>
                    <label className='ml-1'>Lock</label>
                </div>
                <div className="col-4 col-md-3 col-lg-2 d-flex">
                    <span className="geekmark3 mt-2"></span>
                    <label className='ml-1'>TIBRS Field</label>
                </div>
            </div>
        </div>

    )
}

export default IdentifyFieldColor