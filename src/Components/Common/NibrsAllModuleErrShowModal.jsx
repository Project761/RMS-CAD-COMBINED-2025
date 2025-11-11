import { useEffect } from "react";
import Loader from "./Loader";

const NirbsAllModuleErrorShowModal = (props) => {

    const { nibErrModalStatus, setNibrsErrModalStatus, nibrsValidateloder, sideBarValidateloder, administrativeErrorString, offenseErrorString, victimErrorString, offenderErrorString, propertyErrorString, vehicleErrorString, incidentErrorStatus, incidentErrorString, arrestErrorString, setnibrsValidateLoder, setNibrsSideBarLoading } = props

    const isLoading = (!nibrsValidateloder && !sideBarValidateloder)
    // console.log("🚀 ~ NirbsAllModuleErrorShowModal ~ sideBarValidateloder:", !sideBarValidateloder)
    console.log("🚀 ~ NirbsAllModuleErrorShowModal ~ nibrsValidateloder:", !nibrsValidateloder)
    // console.log("🚀 ~ NirbsAllModuleErrorShowModal ~ isLoading:", isLoading)

    return (
        <>
            {
                nibErrModalStatus ?
                    <div className="modal" style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: '11111', }} id="NibrsAllModuleErrorShowModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="btn-box mt-4 m-2">
                                    {
                                        isLoading ?
                                            <>
                                                <div className="border border-danger text-center p-3 mt-2 mb-2">
                                                    {
                                                        administrativeErrorString && <>
                                                            <h5>Administrative Error</h5>
                                                            <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{administrativeErrorString || 'No Errors'}</pre>
                                                        </>
                                                    }
                                                    {/* {
                                                        incidentErrorStatus && <>
                                                            <h5>Incident Error</h5>
                                                            <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{incidentErrorString || 'No Errors'}</pre>
                                                        </>
                                                    } */}
                                                    {
                                                        offenseErrorString && <>
                                                            <h5>Offense Error</h5>
                                                            <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{offenseErrorString || 'No Errors'}</pre>
                                                        </>
                                                    }
                                                    {
                                                        victimErrorString && <>
                                                            <h5>Victim Error</h5>
                                                            <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{victimErrorString || 'No Errors'}</pre>
                                                        </>
                                                    }
                                                    {
                                                        offenderErrorString && <>
                                                            <h5>Offender Error</h5>
                                                            <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{offenderErrorString || 'No Errors'}</pre>
                                                        </>
                                                    }
                                                    {
                                                        propertyErrorString && <>
                                                            <h5>Property Error</h5>
                                                            <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{propertyErrorString || 'No Errors'}</pre>
                                                        </>
                                                    }
                                                    {
                                                        vehicleErrorString && <>
                                                            <h5>Vehicle Error</h5>
                                                            <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{vehicleErrorString || 'No Errors'}</pre>
                                                        </>
                                                    }
                                                    {
                                                        arrestErrorString && <>
                                                            <h5>Arrest Error</h5>
                                                            <pre style={{ maxWidth: '100%', whiteSpace: 'pre-wrap' }}>{arrestErrorString || 'No Errors'}</pre>
                                                        </>
                                                    }
                                                    {
                                                        !administrativeErrorString && !offenseErrorString && !victimErrorString && !offenderErrorString && !propertyErrorString && !vehicleErrorString && !arrestErrorString && <>
                                                            <pre>No Errors</pre>
                                                        </>
                                                    }

                                                </div>
                                                <div className="d-flex justify-content-between me-2">
                                                    <div>
                                                    </div>
                                                    <button type="button"
                                                        className="btn btn-sm btn-success ml-2  "
                                                        data-dismiss="modal" onClick={() => { setNibrsErrModalStatus(false) }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <Loader />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    )
}

export default NirbsAllModuleErrorShowModal