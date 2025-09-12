import PropTypes from 'prop-types';

function DeleteConfirmModal(props) {
    const { showModal, setShowModal, handleConfirm } = props
    return (
        <>
            {showModal ? (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="box text-center py-5">
                                <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to delete this record?</h5>
                                <div className="btn-box mt-3">
                                    <button type="button" onClick={() => handleConfirm()} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                    <button type="button" className="btn btn-sm btn-secondary ml-2 " onClick={() => setShowModal(false)}> No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : <></>}
        </>
    )
}

export default DeleteConfirmModal

// PropTypes definition
DeleteConfirmModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired
};

// Default props
DeleteConfirmModal.defaultProps = {
  showModal: false,
  setShowModal: () => {},
  handleConfirm: () => {}
};