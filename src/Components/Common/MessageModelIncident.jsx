import { useNavigate, } from 'react-router-dom'
import { stringToBase64 } from "./Utility";

const MessageModelIncident = (props) => {

    const navigate = useNavigate();

    const { setToResetData, clsDrpCode, IncidentNumber, incidentID, IncSta } = props

    return (
        <>
            {
                (clsDrpCode === '01' || clsDrpCode === '02') ?
                    <div className="modal" style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: '11111', }} id="SaveModalIncident" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Create Arrest First</h5>
                                    <div className="btn-box mt-4">
                                        <span >
                                            <button type="button" data-dismiss="modal" className="btn btn-sm text-white" onClick={(e) => { navigate(`/Arrest-Home?IncId=${stringToBase64(incidentID)}&IncNo=${IncidentNumber}&IncSta=${IncSta}`) }} style={{ background: "#ef233c" }} >Yes</button>
                                        </span>
                                        <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal" onClick={() => { setToResetData(); }}>No</button>
                                    </div>
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

export default MessageModelIncident