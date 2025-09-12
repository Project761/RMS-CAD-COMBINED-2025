import PropTypes from 'prop-types';

function ModalConfirm(props) {
    const { showModal, setShowModal, confirmAction, handleConfirm, isCustomMessage = false, message } = props
    return (
        <>
            {showModal && (
                <div
                    className="modal fade show modal-in-Call-taker"
                    style={{ display: "block", zIndex: "9999999", background: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="box text-center py-5 px-2">
                                {isCustomMessage ? <h5 className="modal-title mt-2" id="exampleModalLabel">{message}</h5> : <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to {confirmAction} the popup ?</h5>}
                                <div className="btn-box mt-3">
                                    <button type="button" onClick={() => handleConfirm()} className="btn btn-sm text-white" style={{ background: "#ef233c" }} data-dismiss="modal">Yes</button>
                                    <button type="button" className="btn btn-sm btn-secondary ml-2 " onClick={() => setShowModal(false)}> No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ModalConfirm

// PropTypes definition
ModalConfirm.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  confirmAction: PropTypes.string,
  handleConfirm: PropTypes.func.isRequired,
  isCustomMessage: PropTypes.bool,
  message: PropTypes.string
};

// Default props
ModalConfirm.defaultProps = {
  confirmAction: "",
  isCustomMessage: false,
  message: ""
};