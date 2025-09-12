import { memo } from "react";
import PropTypes from "prop-types";
import CommentsTabFrom from "../MonitorScreen/TabSections/CommentsTabSection";

const CommentsModal = (props) => {
  const { openCommentModal, setOpenCommentModal } = props;

  const onCloseLocation = () => {
    setOpenCommentModal(false);
  };

  return (
    <>
      {openCommentModal ? (
        <dialog
          className="modal fade"
          style={{
            background: "rgba(0,0,0, 0.5)",
            zIndex: "200",
            overflow: "hidden",
          }}
          id="CommentModal"
          tabIndex="-1"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div className="modal-dialog modal-dialog-centered CAD-sub-modal-width">
            <div className="modal-content modal-content-cad">
              <div className="modal-body">
                <div className="row">
                  <div className="col-12 p-0 pb-2">
                    <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                      <p
                        className="p-0 m-0 font-weight-medium"
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          letterSpacing: 0.5,
                        }}
                      >
                        Comments
                      </p>
                    </div>
                  </div>
                </div>

                <CommentsTabFrom />

                <div className="row">
                  <div className="col-12 p-0">
                    <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                      <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => {
                            onCloseLocation();
                          }
                          }
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      ) : (
        <> </>
      )}

    </>
  );
};

export default memo(CommentsModal);

// PropTypes definition
CommentsModal.propTypes = {
  openCommentModal: PropTypes.bool.isRequired,
  setOpenCommentModal: PropTypes.func.isRequired
};

// Default props
CommentsModal.defaultProps = {
  openCommentModal: false,
  setOpenCommentModal: () => {}
};
