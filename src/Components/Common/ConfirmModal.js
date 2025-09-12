import React from 'react'

const ConfirmModal = (props) => {

    const { func, confirmType } = props

    return (

        <div className="modal fade" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="ConfirmModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="box text-center py-5">
                        <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure to move it to {confirmType}?</h5>
                        <div className="btn-box mt-3">
                            <button type="button" onClick={func} className="btn btn-sm text-white" style={{ background: "#ef233c" }} data-dismiss="modal">Yes</button>
                            <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal"> No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default ConfirmModal;
