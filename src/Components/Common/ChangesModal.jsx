import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import { AgencyContext } from '../../Context/Agency/Index'

const ChangesModal = (props) => {

    const { changesStatus, setChangesStatus, setChangesStatusCount, changesStatusCount, setcountStatus, setStatus, setcountAppear } = useContext(AgencyContext)

    const { hasPermission = true, func, inActiveCheckBox, setToReset = () => { } } = props

    return (
        <>
            {
                changesStatus && hasPermission ?
                    <div className="modal" style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: '11111', }} id="SaveModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to save changes you made for the current record?</h5>
                                    <div className="btn-box mt-4">
                                        <span >
                                            <button type="button" data-dismiss="modal" className="btn btn-sm text-white" onClick={(e) => {
                                                func(e); setTimeout(() => {
                                                    setChangesStatus(false);
                                                }, [700]);
                                            }} style={{ background: "#ef233c" }} >Save</button>
                                        </span>
                                        <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal" onClick={() => { setChangesStatus(false); setToReset(); setChangesStatusCount(changesStatusCount + 1); setStatus(false); }}> Cancel</button>
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

export default ChangesModal