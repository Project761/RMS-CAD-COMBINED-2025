import PropTypes from 'prop-types';

function CADConfirmModal(props) {
    const { showModal, setShowModal, confirmType, handleConfirm } = props
    return (
        <>
            {showModal && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="box text-center py-5">
                                <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure to move it to {confirmType} ?</h5>
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

export default CADConfirmModal

// PropTypes definition
CADConfirmModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  confirmType: PropTypes.string.isRequired,
  handleConfirm: PropTypes.func.isRequired
};

// Default props
CADConfirmModal.defaultProps = {
  showModal: false,
  setShowModal: () => {},
  confirmType: "",
  handleConfirm: () => {}
};