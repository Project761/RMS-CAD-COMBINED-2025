import { memo, useContext, useEffect, useState } from "react";
import useObjState from "../../CADHook/useObjState";
import MonitorServices from "../../CADServices/APIs/monitor";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { useSelector } from "react-redux";
import { IncidentContext } from "../../CADContext/Incident";
import ModalConfirm from "../Common/ModalConfirm";
import PropTypes from "prop-types";

const PARTimerOverDueModal = (props) => {
  const { PARTimerModal, setPARTimerModal, displayTimer, editValue, isResourcePAR = false, isOfficer1PAR = false, isOfficer2PAR = false, setEditValue, setIsResourcePAR, setIsOfficer1PAR, setIsOfficer2PAR } = props;
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isButtonDisable, setIsButtonDisable] = useState(false);
  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [backgroundColor, setBackgroundColor] = useState('');
  const [color, setColor] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modal, setModal] = useState("");
  const { resourceRefetch } = useContext(IncidentContext);
  const [
    PARTimerState,
    setPARTimerState,
    handlePARTimerState,
    clearPARTimerState,
  ] = useObjState({
    incidentID: "",
    CADEventNo: "",
    unitNo: "",
    resourceID: "",
    officer1: "",
    OfficerID1: "",
    officer2: "",
    OfficerID2: "",
    CFSCode: "",
    CFSDesc: "",
    location: "",
    aptNo: "",
    comments: "",
    splitPAR: false,
    totalTimeRemaining: "",
    isPause: false,
    isResume: false,
    isExtend: false,
    isSafe: false,
    IsPauseResource: false,
    IsPauseOfficer1: false,
    IsPauseOfficer2: false,
    ResourceCurrentTimer: "",
    Officer1CurrentTimer: "",
    Officer2CurrentTimer: "",
  });

  useEffect(() => {
    setPARTimerState({
      incidentID: editValue?.IncidentID,
      CADEventNo: editValue?.CADIncidentNumber,
      unitNo: editValue?.ResourceNumber,
      resourceID: editValue?.ResourceID,
      OfficerID1: editValue?.OfficerID1,
      OfficerID2: editValue?.OfficerID2,
      officer1: editValue?.Officer1,
      officer2: editValue?.Officer2,
      CFSCode: editValue?.CFSCODE,
      CFSDesc: editValue?.CFSCodeDescription,
      location: editValue?.CrimeLocation,
      aptNo: editValue?.ApartmentNo,
      comments: "",
      splitPAR: editValue?.IsSplited,
      totalTimeRemaining: "",
      IsPauseResource: editValue?.IsPauseResource,
      ResourceCurrentTimer: editValue?.ResourceCurrentTimer,
      IsPauseOfficer1: editValue?.IsPauseOfficer1,
      Officer1CurrentTimer: editValue?.Officer1CurrentTimer,
      IsPauseOfficer2: editValue?.IsPauseOfficer2,
      Officer2CurrentTimer: editValue?.Officer2CurrentTimer,
    })
  }, [PARTimerModal, editValue])

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  const handlePARActionClick = (button) => {
    if (button === "pause") {
      setModal("pause");
      setShowConfirmModal(true);
    }
    if (button === "resume") {
      setSelectedButton(button);
      handlePARAction(button);
      setModal("");
    }
    if (button === "extend") {
      setModal("extend");
      setShowConfirmModal(true);
    }
    if (button === "safe") {
      setModal("");
      setSelectedButton(button);
      handlePARAction(button);
    }
  };

  async function handlePARAction(button) {

    let action = "";

    if (button === 'pause') {
      if (isResourcePAR) action = "PauseResource";
      else if (isOfficer1PAR) action = "PauseOfficer1";
      else if (isOfficer2PAR) action = "PauseOfficer2";
    } else if (button === 'resume') {
      if (isResourcePAR) action = "ResumeResource";
      else if (isOfficer1PAR) action = "ResumeOfficer1";
      else if (isOfficer2PAR) action = "ResumeOfficer2";
    }
    else if (button === 'extend') {
      if (isResourcePAR) action = "ExtendResource";
      else if (isOfficer1PAR) action = "ExtendOfficer1";
      else if (isOfficer2PAR) action = "ExtendOfficer2";
    } else if (button === 'safe') {
      if (isResourcePAR) action = "SafeResource";
      else if (isOfficer1PAR) action = "SafeOfficer1";
      else if (isOfficer2PAR) action = "SafeOfficer2";
    }

    const data = {
      ResourceID: PARTimerState?.resourceID || "",
      PINID1: PARTimerState?.OfficerID1 || "",
      PINID2: PARTimerState?.OfficerID2 || "",
      ExtendTime: button === 'extend' ? "05:00" : null,
      CurrentTimer: button === "pause" ? (isOfficer2PAR ? displayTimer?.Officer2 : displayTimer?.timer) : null,
      IsSplit: isResourcePAR && PARTimerState?.splitPAR ? 1 : 0,
      ACTION: isButtonDisable ? null : action,
    };
    const response = await MonitorServices.insertPAR(data);

    if (response?.status === 200) {
      resourceRefetch()
      const payload = {
        ResourceID: PARTimerState?.resourceID || "",
        loginAgencyID: loginAgencyID
      };
      const response = await MonitorServices.getResourceViewByID(payload);

      if (response?.data?.Data?.length === 0) {
        return;
      } else {
        try {
          const parsedData = JSON.parse(response?.data?.data);
          const data = parsedData?.Table;
          if (JSON.stringify(data) !== JSON.stringify(editValue)) {
            setEditValue(data[0]);
          }
          setEditValue(data[0]);
        } catch (error) {
          console.error("Error parsing name:", error);
        }
      }
    }
  }

  async function handleSave() {

    if (isButtonDisable) {
      const data = {
        ResourceID: PARTimerState?.resourceID || "",
        PINID1: PARTimerState?.OfficerID1 || "",
        PINID2: PARTimerState?.OfficerID2 || "",
        ExtendTime: null,
        CurrentTimer: null,
        IsSplit: 1,
        ACTION: null,
      };
      await MonitorServices.insertPAR(data);
      const payload = {
        ResourceID: PARTimerState?.resourceID || "",
        loginAgencyID: loginAgencyID
      };
      const response = await MonitorServices.getResourceViewByID(payload);
      if (response?.data?.Data?.length === 0) {
        return;
      } else {
        try {
          const parsedData = JSON.parse(response?.data?.data);
          const data = parsedData?.Table;
          if (JSON.stringify(data) !== JSON.stringify(editValue)) {
            setEditValue(data[0]);
          }
          setEditValue(data[0]);
        } catch (error) {
          console.error("Error parsing name:", error);
        }
      }
    }

    if (PARTimerState?.incidentID) {
      const payload = {
        "IncidentId": PARTimerState?.incidentID,
        "Comments": PARTimerState?.comments,
        "AgencyID": loginAgencyID,
      }
      const response = await MonitorServices.insertComment(payload);
      if (response?.data?.success) {
        setSelectedButton("")
        resourceRefetch()
        toastifySuccess("Data Saved Successfully");
        handleClose();
      }
    }
  }

  const handleConfirmModal = () => {
    if (modal === "pause") {
      setSelectedButton(modal);
    }
    if (modal === "extend") {
      setSelectedButton(modal);
    }
    handlePARAction(modal);
    setModal("")
    setShowConfirmModal(false);
  };

  const handleClose = () => {
    setIsButtonDisable(false)
    setIsResourcePAR(false);
    setIsOfficer1PAR(false);
    setIsOfficer2PAR(false);
    setSelectedButton(null);
    clearPARTimerState();
    setPARTimerModal(false);
  };

  useEffect(() => {

    let timerValue = "";

    if (isResourcePAR) {
      timerValue = PARTimerState?.IsPauseResource
        ? PARTimerState?.ResourceCurrentTimer
        : displayTimer?.timer;
    } else if (isOfficer1PAR) {
      timerValue = PARTimerState?.IsPauseOfficer1
        ? PARTimerState?.Officer1CurrentTimer
        : displayTimer?.timer;
    } else if (isOfficer2PAR) {
      timerValue = PARTimerState?.IsPauseOfficer2
        ? PARTimerState?.Officer2CurrentTimer
        : displayTimer?.Officer2;
    }

    const convertToSeconds = (timer) => {
      const [minutes, seconds] = timer?.split(':').map(Number);
      const isNegative = timer.startsWith('-');
      if (isNegative) {
        return minutes * 60 - Math.abs(seconds); // Subtract seconds when minutes are negative
      } else {
        return minutes * 60 + seconds; // Normal calculation for positive or zero minutes
      }
    };

    if (timerValue) {
      const timerInSeconds = convertToSeconds(timerValue);
      if (timerInSeconds <= -60) {
        setIsBlinking(false);

        setBackgroundColor('green'); // For -01:00 and less
        setColor('white'); // For -01:00 and less
      } else if (timerInSeconds > -60 && timerInSeconds <= 0) {
        setIsBlinking(false);

        setBackgroundColor('yellow'); // For -00:59 to +00:00
        setColor('black'); // For -00:59 to +00:00
      } else if (timerInSeconds > 0) {
        setIsBlinking(true);

        setBackgroundColor('red'); // For +01:00 and more
        setColor('white'); // For +01:00 and more
      }
    }
  }, [isResourcePAR, isOfficer1PAR, isOfficer2PAR, displayTimer, PARTimerState]);

  return (
    <>
      {PARTimerModal ? (
        <dialog
          className="modal fade"
          style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
          id="PARTimerModal"
          tabIndex="-1"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-content-cad">
              <div className="modal-body" style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                <div className="row" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                  <div className="col-22 p-0 pb-2">
                    <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                      <p
                        className="p-0 m-0 font-weight-medium"
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          letterSpacing: 0.5,
                        }}
                      >
                        PAR Timer
                      </p>
                    </div>
                  </div>
                </div>
                {(isBlinking) ?
                  <div
                    className={"row mx-0 mb-3 px-3 py-2 d-flex justify-content-center align-items-center blinking-text"}
                    style={{
                      color: color,
                      backgroundColor: backgroundColor,
                    }}
                  >
                    <p
                      className="p-0 m-0 font-weight-medium"
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: 0.6,
                      }}
                    >
                      OVERDUE :
                      {isResourcePAR &&
                        (PARTimerState?.IsPauseResource ?
                          PARTimerState?.ResourceCurrentTimer :
                          displayTimer?.timer)
                      }
                      {isOfficer1PAR &&
                        (PARTimerState?.IsPauseOfficer1 ?
                          PARTimerState?.Officer1CurrentTimer :
                          displayTimer?.timer)
                      }
                      {isOfficer2PAR &&
                        (PARTimerState?.IsPauseOfficer2 ?
                          PARTimerState?.Officer2CurrentTimer :
                          displayTimer?.Officer2)
                      }
                    </p>
                  </div>
                  :
                  <div
                    className="row mx-0 mb-3 px-3 py-2 d-flex justify-content-center align-items-center" style={{
                      backgroundColor: backgroundColor,
                      color: color,
                    }}
                  >
                    <p
                      className="p-0 m-0 font-weight-medium"
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: 0.6,
                      }}
                    >
                      {isResourcePAR &&
                        (PARTimerState?.IsPauseResource ?
                          PARTimerState?.ResourceCurrentTimer :
                          displayTimer?.timer)
                      }
                      {isOfficer1PAR &&
                        (PARTimerState?.IsPauseOfficer1 ?
                          PARTimerState?.Officer1CurrentTimer :
                          displayTimer?.timer)
                      }
                      {isOfficer2PAR &&
                        (PARTimerState?.IsPauseOfficer2 ?
                          PARTimerState?.Officer2CurrentTimer :
                          displayTimer?.Officer2)
                      }
                    </p>
                  </div>
                }
                {/* Form Section */}
                <div className="m-1" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                  <fieldset style={{ border: "1px solid gray" }}>
                    <div className="tab-form-container">
                      {/* Row 1 */}
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                            CAD Event #</label>
                        </div>
                        <div className="col-4 d-flex align-items-center justify-content-end">
                          <input
                            type="text"
                            value={PARTimerState?.CADEventNo}
                            className="form-control py-1 new-input"
                            readOnly
                          />
                        </div>
                        <div className="tab-form-row ml-2">
                          <div className="col-3 d-flex align-items-center justify-content-end">
                            <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                              Unit #</label>
                          </div>
                          <div className="col-9 d-flex align-items-center justify-content-end">
                            <input
                              type="text"
                              value={PARTimerState?.unitNo}
                              className="form-control py-1 new-input"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 2 */}
                      {isResourcePAR &&
                        <div className="tab-form-row">
                          <div className="col-2 d-flex align-items-center justify-content-end">
                            <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                              Officer 1</label>
                          </div>
                          <div className="col-4 d-flex align-items-center justify-content-end">
                            <input
                              type="text"
                              value={PARTimerState?.officer1}
                              className="form-control py-1 new-input"
                              readOnly
                            />
                          </div>
                          <div className="tab-form-row ml-2">
                            <div className="col-3 d-flex align-items-center justify-content-end">
                              <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                                Officer 2</label>
                            </div>
                            <div className="col-9 d-flex align-items-center justify-content-end">
                              <input
                                type="text"
                                value={PARTimerState?.officer2}
                                className="form-control py-1 new-input"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>}

                      {isOfficer1PAR &&
                        <div className="tab-form-row">
                          <div className="col-2 d-flex align-items-center justify-content-end">
                            <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                              Officer 1</label>
                          </div>
                          <div className="col-4 d-flex align-items-center justify-content-end">
                            <input
                              type="text"
                              value={PARTimerState?.officer1}
                              className="form-control py-1 new-input"
                              readOnly
                            />
                          </div>
                        </div>
                      }

                      {isOfficer2PAR &&
                        <div className="tab-form-row">
                          <div className="col-2 d-flex align-items-center justify-content-end">
                            <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                              Officer 2</label>
                          </div>
                          <div className="col-4 d-flex align-items-center justify-content-end">
                            <input
                              type="text"
                              value={PARTimerState?.officer2}
                              className="form-control py-1 new-input"
                              readOnly
                            />
                          </div>
                        </div>
                      }
                      {/* Row 3 */}
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                            CFS</label>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <input
                            type="text"
                            value={PARTimerState?.CFSCode}
                            className="form-control py-1 new-input"
                            readOnly
                          />

                        </div>
                        <div className="col-5 d-flex align-items-center justify-content-end">
                          <input
                            type="text"
                            value={PARTimerState?.CFSDesc}
                            className="form-control py-1 new-input"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Row 4 */}
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                            Location</label>
                        </div>
                        <div className="col-7 d-flex align-items-center justify-content-end">
                          <input
                            type="text"
                            value={PARTimerState?.location}
                            className="form-control py-1 new-input"
                            readOnly
                          />

                        </div>
                        <div className="col-3 d-flex align-items-center justify-content-end">
                          <label htmlFor="" className="new-label m-1" style={{ textAlign: "start", width: "100%" }}>
                            Apt#/ Suit</label>
                          <input
                            type="text"
                            value={PARTimerState?.aptNo}
                            className="form-control py-1 new-input"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Row 5 */}
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                            Comments</label>
                        </div>
                        <div className="col-10 d-flex align-items-center justify-content-end">
                          <textarea
                            type="text"
                            rows="3"
                            className="form-control  py-1 new-input"
                            style={{ height: "auto", overflowY: "scroll" }}
                            placeholder="Comments"
                            value={PARTimerState?.comments}
                            onChange={(e) => {
                              handlePARTimerState("comments", e.target.value)
                              e.target.style.height = "auto";
                              const maxHeight = 2 * parseFloat(getComputedStyle(e.target).lineHeight);
                              e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                            }}
                          />
                        </div>

                      </div>

                      {/* Row 6 */}
                      {(isResourcePAR && PARTimerState?.officer1 && PARTimerState?.officer2) &&
                        <div className="tab-form-row">
                          <div className="col-5 offset-2 agency-checkbox-item">
                            <input
                              type="checkbox"
                              name="splitPAR"
                              checked={PARTimerState.splitPAR}
                              onChange={(e) => {
                                handlePARTimerState("splitPAR", e.target.checked);
                                setIsButtonDisable(e.target.checked ? true : false)
                              }}
                            />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>Split PAR</span>
                            </div>
                          </div>
                        </div>
                      }

                      {/* Row 7 */}
                      <div className="tab-form-row mt-1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="col-12">
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>Total Time Remaining</span>
                            <button
                              type="button"
                              className={`save-button  ${isBlinking ? "blinking-text" : ""}`}
                              style={{
                                padding: '5px 5px',
                                fontSize: '16px',
                                border: "solid 0px",
                                color: color,
                                backgroundColor: backgroundColor,
                                width: "145px",
                              }}
                            >
                              {isResourcePAR &&
                                (PARTimerState?.IsPauseResource ?
                                  PARTimerState?.ResourceCurrentTimer :
                                  displayTimer?.timer)
                              }
                              {isOfficer1PAR &&
                                (PARTimerState?.IsPauseOfficer1 ?
                                  PARTimerState?.Officer1CurrentTimer :
                                  displayTimer?.timer)
                              }
                              {isOfficer2PAR &&
                                (PARTimerState?.IsPauseOfficer2 ?
                                  PARTimerState?.Officer2CurrentTimer :
                                  displayTimer?.Officer2)
                              }
                              {' '}
                              Mins
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Row 8 */}
                      <div className="tab-form-row mt-1">
                        <div className="col-12">
                          <div className="d-flex justify-content-end align-items-center">
                            <div className="d-flex justify-content-center tab-form-row-gap">
                              {(selectedButton === "pause" ||
                                (isResourcePAR && PARTimerState?.IsPauseResource)
                                || (isOfficer1PAR && PARTimerState?.IsPauseOfficer1)
                                || (isOfficer2PAR && PARTimerState?.IsPauseOfficer2)) ?
                                <button
                                  type="button"
                                  className="save-button d-flex justify-content-center align-items-center gap-1"
                                  style={{
                                    padding: "4px 12px",
                                    fontSize: "15px",
                                    fontWeight: 400,
                                    border: "solid 0px",
                                    backgroundColor: "#19aea3"
                                  }}
                                  onClick={() => { handlePARActionClick('resume') }}
                                  disabled={isBlinking || isButtonDisable}
                                >
                                  <i className="fa fa-play" style={{ marginRight: "6px" }}></i>
                                  {'Resume'}
                                </button> :
                                <button
                                  type="button"
                                  className="save-button d-flex justify-content-center align-items-center gap-1"
                                  style={{
                                    padding: "4px 12px",
                                    fontSize: "15px",
                                    fontWeight: 400,
                                    border: "solid 0px",
                                    backgroundColor: "#19aea3 "
                                  }}
                                  onClick={() => handlePARActionClick('pause')}
                                  disabled={isBlinking || isButtonDisable}
                                >
                                  <i className="fa fa-pause-circle" style={{ marginRight: "6px" }}></i>
                                  {'Pause'}
                                </button>}

                              <button
                                type="button"
                                className="save-button"
                                style={{
                                  padding: "4px 12px",
                                  fontSize: "15px",
                                  fontWeight: 400,
                                  border: "solid 0px",
                                  backgroundColor: "#19aea3 "
                                }}
                                onClick={() => handlePARActionClick('extend')}
                                disabled={(isBlinking || isButtonDisable || selectedButton === "pause" ||
                                  (isResourcePAR && PARTimerState?.IsPauseResource)
                                  || (isOfficer1PAR && PARTimerState?.IsPauseOfficer1)
                                  || (isOfficer2PAR && PARTimerState?.IsPauseOfficer2))}
                              >
                                <i className="fa fa-plus-circle" style={{ marginRight: "6px" }}></i>
                                {'Extend 5 Mins'}
                              </button>
                              <button
                                type="button"
                                className="save-button"
                                style={{
                                  padding: "4px 12px",
                                  fontSize: "15px",
                                  fontWeight: 400,
                                  border: "solid 0px",
                                  backgroundColor: "#19aea3 "
                                }}
                                onClick={() => handlePARActionClick('safe')}
                                disabled={isButtonDisable}
                              >
                                <i className="fa fa-check-circle" style={{ marginRight: "6px" }}></i>
                                {'I am Safe'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                {/* Buttons Section */}
                <div className="row" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                  <div className="col-12 p-0">
                    <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                      <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                        <button
                          type="button"
                          className="save-button ml-2"
                          onClick={() => handleSave()}
                          disabled={!isButtonDisable && !PARTimerState?.comments}
                        >
                          {'Save'}
                        </button>
                        <button
                          type="button"
                          data-dismiss="modal"
                          className="cancel-button"
                          onClick={() => handleClose()}
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
      ) : null
      }
      <ModalConfirm
        showModal={showConfirmModal}
        setShowModal={setShowConfirmModal}
        confirmAction=""
        handleConfirm={() => handleConfirmModal()}
        isCustomMessage
        message={
          modal === "pause" ?
            "Do you want to pause timer?" :
            modal === "extend" ?
              "Add 5 more mins to this PAR timer?" :
              ""
        }
      />
    </>
  );
};

export default memo(PARTimerOverDueModal);

// PropTypes definition
PARTimerOverDueModal.propTypes = {
  PARTimerModal: PropTypes.bool.isRequired,
  setPARTimerModal: PropTypes.func.isRequired,
  displayTimer: PropTypes.bool,
  editValue: PropTypes.object,
  isResourcePAR: PropTypes.bool,
  isOfficer1PAR: PropTypes.bool,
  isOfficer2PAR: PropTypes.bool,
  setEditValue: PropTypes.func,
  setIsResourcePAR: PropTypes.func,
  setIsOfficer1PAR: PropTypes.func,
  setIsOfficer2PAR: PropTypes.func
};

// Default props
PARTimerOverDueModal.defaultProps = {
  displayTimer: false,
  editValue: {},
  isResourcePAR: false,
  isOfficer1PAR: false,
  isOfficer2PAR: false,
  setEditValue: () => {},
  setIsResourcePAR: () => {},
  setIsOfficer1PAR: () => {},
  setIsOfficer2PAR: () => {}
};



