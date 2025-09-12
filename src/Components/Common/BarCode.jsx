import React, { memo, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';
import { fetchPostData } from '../hooks/Api';
import { toastifyError } from './AlertMsg';
import { getShowingDateText } from './Utility';


const BarCode = (props) => {

    const { agencyID, propID, masPropID, codeNo, printStatus, setPrintStatus } = props;

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstVehicle = query?.get('page');
    const isMaster = MstVehicle != '' && MstVehicle === 'MST-Name-Dash' || MstVehicle === 'MST-Property-Dash' || MstVehicle === 'MST-Vehicle-Dash' ? true : false;


    const [barCodeData, setBarCodeData] = useState([])

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })

    useEffect(() => {
        if (agencyID && (propID || masPropID)) {
            get_BarCode_Data(agencyID, propID, masPropID)
        }
    }, [agencyID, propID, masPropID])

    const get_BarCode_Data = async (agencyID, propID, masPropID) => {
        const val = { 'AgencyID': agencyID, 'PropertyID': propID, 'MasterPropertyID': 0 }
        const val1 = { 'AgencyID': agencyID, 'PropertyID': 0, 'MasterPropertyID': masPropID }
        fetchPostData("PropertyBarCode/GetData_PropertyBarCode", isMaster ? val1 : val).then((res) => {
            if (res) {
                setBarCodeData(res);
            } else { setBarCodeData([]); }
        })
    }

    useEffect(() => {
        if (printStatus && codeNo && barCodeData?.length > 0) {
            printForm()
            setPrintStatus(false)
        } else if (printStatus && (!codeNo || barCodeData?.length === 0)) {
            toastifyError("No Data Available")
            setPrintStatus(false)
        }
    }, [printStatus, codeNo])


    return (

        printStatus &&
        <div style={{ display: "none", visibility: "hidden" }}>
            <div className="container" ref={componentRef} >
                {barCodeData?.length > 0 &&
                    barCodeData?.map((barData) => (
                        <div style={{ width: '450px', height: '450px', border: '2px solid black' }}>
                            <div className="table-responsive">
                                <table className="table table-bordered  mb-0">
                                    <div className="barcode-head">
                                        <h5 className='text-center'>{barData?.Agency_Name}</h5>
                                        <p className='text-center'>Address: {barData?.Agency_Address1}</p>
                                    </div>
                                    <div className="div d-flex justify-content-around bar-head">
                                        <p className=''>Phone: {barData?.Agency_Phone}</p>
                                        <p className=''>Fax: {barData?.Agency_Fax}</p>
                                    </div>
                                </table >
                            </div>
                            {barData?.Property.length > 0 && barData?.Property?.map((proData) => (
                                <div style={{ border: '1px solid black' }}  >
                                    <div className="div d-flex justify-content-between bar-head  ">
                                        <p className='col-6 mb-0' style={{ borderRight: '2px solid #000' }}>Incident No: <span className='text-gray'>{proData?.IncidentNumber}</span></p>
                                        <p className='col-6 '>Date/time: <span className='text-gray'>{proData?.ReportedDate ? getShowingDateText(proData.ReportedDate) : ''}</span></p>
                                    </div>
                                    <div className="div d-flex justify-content-between bar-head ">
                                        <p className='col-6 mb-0' style={{ borderRight: '2px solid #000' }}>Classification: <span className='text-gray'>{proData?.PropertyClassification_Description}</span></p>
                                        <p className='col-6'>Loss Code: <span className='text-gray'>{proData?.PropertyLossCode_Description}</span></p>
                                    </div>
                                    <div className="div d-flex justify-content-between bar-head ">
                                        <p className='col-6 mb-0' style={{ borderRight: '2px solid #000' }}>Brand: <span className='text-gray'>{proData?.Brand}</span></p>
                                        <p className='col-6'>Model No: <span className='text-gray'>{proData?.ModelID}</span></p>
                                    </div>
                                    <div className="div d-flex justify-content-between bar-head ">
                                        <p className='col-4 mb-0' style={{ borderRight: '2px solid #000' }}>Serial: <span className='text-gray'>{proData?.SerialID}</span></p>
                                        <p className='col-4 mb-0' style={{ borderRight: '2px solid #000' }}>Size No: <span className='text-gray'></span></p>
                                        <p className='col-4'>Quantity: <span className='text-gray'>{proData?.Quantity}</span></p>
                                    </div>
                                    <div className=" bar-head">
                                        <p className='col-12'>Description: <span className='text-gray'></span></p>
                                    </div>
                                    <div className=" bar-head ">
                                        <p className='col-12'>Location: <span className='text-gray'></span></p>
                                    </div>
                                </div>
                            ))}
                            <div className='bar-code'>
                                <Barcode value={codeNo} height={50} displayValue={true} width={2} />
                            </div>

                        </div>
                    ))}
            </div >
        </div>

    )
}

export default memo(BarCode)
