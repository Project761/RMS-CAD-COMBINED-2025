import React, { useState } from "react";
import GoogleAuthServices from "../../CADServices/APIs/googleAuth";
import { useLocation } from "react-router-dom";
import { base64ToString } from "../Common/Utility";
import { toastifyError } from "../Common/AlertMsg";
import { useSelector } from "react-redux";

const TwoFactorModal = ({
  TwoFactorEnabled = false,
  value,
  get_Personnel_Lists,
  setValue,
  isSuperadmin,
  loginPinID
}) => {
  const [open2FAModal, setOpen2FAModal] = useState(false);
  const [reset2FAModal, setReset2FAModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [uniqueKey, setUniqueKey] = useState("");
  const [verifyQRCodeData, setVerifyQRCodeData] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);

  const useQueryURL = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param),
    };
  };

  const query = useQueryURL();
  let aId = query?.get("Aid");
  if (!aId) aId = 0;
  else aId = parseInt(base64ToString(aId));

  const close2FAModal = () => {
    setOpen2FAModal(false);
  };
  const closeReset2FAModal = () => {
    setReset2FAModal(false);
  };

  async function handelEnable2FA() {
    const payload = {
      UserName: value?.LastName + "," + value?.FirstName + "-" + value?.PIN,
      UserPINID: value?.PINID,
    };
    const res = await GoogleAuthServices.generateQR(payload);
    if (res?.status === 200) {
      setQrCodeData(res?.data?.QRCode);
      setUniqueKey(res?.data?.UniqueKey);
      setOpen2FAModal(true);
    }
  }

  async function handelVerifyQR() {
    try {
      const payload = {
        UserPINID: value?.PINID,
        Pin: verifyQRCodeData,
        UserUniqueKey: uniqueKey,
      };

      const res = await GoogleAuthServices.qRValidate(payload);
      if (res?.status === 200) {
        setValue({
          ...value,
          Is2FAEnabled: true,
        });
        get_Personnel_Lists(aId, localStoreData?.PINID);
        setIsVerified(true);
        setQrCodeData("");
        setVerifyQRCodeData("")
        close2FAModal();
      } else {
        toastifyError(res?.data?.message || 'Invalid code. Please try again.');
      }
    } catch (error) {
      console.error('Error during QR code verification:', error);
      toastifyError('Invalid code. Please try again.');
    }
  }

  async function handelReset2FA() {

    const payload = {
      UserPINID: value?.PINID,
    };
    const res = await GoogleAuthServices.disable2FA(payload);
    if (res?.status === 200) {
      setValue({
        ...value, Is2FAEnabled: false
      })
      get_Personnel_Lists(aId, localStoreData?.PINID);
      setIsVerified(false);
      setReset2FAModal(false);
      if (value?.PINID !== loginPinID) { await GoogleAuthServices.logOutFromAllDevices({ UserPINID: value?.PINID.toString() }); }

    }
  }

  return (
    <>
      {value?.Is2FAEnabled ? (
        <>
          <div
            className="d-flex justify-content-start align-items-center"
            style={{ gap: "10px" }}
          >
            <span className="alert-success">{"2FA Activated"}</span>
            <button
              type="button"
              className="btn btn-sm text-white"
              onClick={() => setReset2FAModal(true)}
              style={{ background: "rgb(239, 35, 60)" }}
            >
              Disable 2FA
            </button>
          </div>

          {/* Reset Modal */}
          {reset2FAModal && (
            <div
              className="modal fade show"
              style={{ display: "block", background: "rgba(0,0,0, 0.5)" }}
              role="dialog"
              aria-labelledby="resetModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-header" style={{ border: "none", justifyContent: "center" }}>
                    <h5 className="modal-title" id="resetModalLabel">
                      {"Are you sure, you want to Disable 2FA?"}
                    </h5>
                  </div>
                  <div className="modal-footer" style={{ border: "none", justifyContent: "center", }}>
                    <button
                      type="button"
                      className="btn btn-sm text-white"
                      style={{ background: "rgb(239, 35, 60)" }}
                      onClick={() => {
                        handelReset2FA()
                      }}
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={closeReset2FAModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={() => handelEnable2FA()}
          >
            Enable 2FA
          </button>

          {/* 2FA Modal */}
          {open2FAModal && (
            <div
              className="modal fade show"
              style={{ display: "block", background: "rgba(0,0,0, 0.5)" }}
              role="dialog"
              aria-labelledby="2faModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="2faModalLabel">
                      2 Factor Authentication
                    </h5>
                  </div>
                  <div className="modal-body">
                    <div className="d-flex justify-content-center align-items-center">
                      {/* <QRCode value={qrCodeData} /> */}
                      <img src={qrCodeData} alt="Base64" />
                    </div>
                    <div className="mt-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter code"
                        maxLength={6}
                        pattern="[0-9]*"
                        value={verifyQRCodeData}
                        onChange={(e) => setVerifyQRCodeData(e.target.value)}
                        disabled={isVerified}
                      />
                    </div>
                    <div className="mt-2 d-flex justify-content-center align-items-center">
                      {isVerified ? (
                        <span className="alert-success">{"Verified"}</span>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-sm btn-success"
                          onClick={() => {
                            handelVerifyQR();
                          }}
                        >
                          {"Verify"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer" style={{ border: "none" }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={close2FAModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )
      }
    </>
  );
};

export default TwoFactorModal;
