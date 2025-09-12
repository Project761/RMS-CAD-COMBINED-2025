import { memo } from "react";
import PropTypes from "prop-types";


const QueryIncidentModal = (props) => {
  const { openQueryIncidentModal, setQueryIncidentModal } = props;

  return (
    <>
      {openQueryIncidentModal ? (
        <dialog
          className="modal fade"
          style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200" }}
          id="QueryIncidentModal"
          tabIndex="-1"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
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
                        {'Query Incident'}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Form Section */}
                <div className="m-1">
                  <fieldset style={{ border: "1px solid gray" }}>
                    {/* Line 1 */}
                    {/* <div className="tab-form-row py-2">
                        <div className="col-1 d-flex align-items-center justify-content-end">
                          <label className="tab-form-label text-nowrap">
                            Law Zone
                          </label>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <Select
                            name="patrolZone"
                            styles={colourStyles}
                            isClearable
                            placeholder="Select..."
                            className="w-100"
                          />
                        </div>
                      </div> */}
                  </fieldset>
                </div>
                {/* Buttons Section */}
                <div className="row">
                  <div className="col-12 p-0">
                    <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                      <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                        <button
                          type="button"
                          className="save-button ml-2"
                        >
                          {'Save'}
                        </button>
                        <button
                          type="button"
                          data-dismiss="modal"
                          className="cancel-button"
                          onClick={() => setQueryIncidentModal(false)}
                        >
                          Cancel
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
      )
      }
    </>
  );
};

export default memo(QueryIncidentModal);

// PropTypes definition
QueryIncidentModal.propTypes = {
  openQueryIncidentModal: PropTypes.bool.isRequired,
  setQueryIncidentModal: PropTypes.func.isRequired
};

// Default props
QueryIncidentModal.defaultProps = {
  openQueryIncidentModal: false,
  setQueryIncidentModal: () => {}
};
