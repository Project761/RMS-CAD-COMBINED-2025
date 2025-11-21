// Import Component
import React, { useEffect, useState, memo, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toastifyError, } from "../Common/AlertMsg";
import { Decrypt_Id_Name } from "../Common/Utility";
import GoogleAuthServices from "../../CADServices/APIs/googleAuth";
import { fetchPostData } from "../hooks/Api";
import { AgencyContext } from "../../Context/Agency/Index";
import { LoginContext } from "../../CADContext/loginAuth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { insert_LocalStoreData } from "../../redux/actions/Agency";




const Otp = ({ username, otp, loginResData, setOtp, timerOn, type, isMDT, isSuperAdmin = false, isValidUser = false, userEmail = "", isForgotPassword = false, PINID = "", typeOfAccount }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setForgetPasswordArray, } = useContext(AgencyContext);
    const { loginAPIData, loginData } = useContext(LoginContext);
    const [isEmail, setIsEmail] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [emailState, setEmailState] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [qrCodeData, setQrCodeData] = useState("");
    const [uniqueKey, setUniqueKey] = useState("");
    const [isSendEmailOtp, setIsSendEmailOtp] = useState(false);
    const [isReset2FA, setIsReset2FA] = useState(false);
    const [userOtp, setUserOtp] = useState('');
    const [errMsg, setErrMsg] = useState(false);
    const [loginLoader, setShowLoader] = useState(false);

    const [wrongOtpCount, setWrongOtpCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [otpCount, setOtpCount] = useState(0);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (otpCount == 3) {
            window.location.reload();
        }
        if (wrongOtpCount == 3) {
            window.location.reload();
        }
    }, [otpCount, wrongOtpCount])

    useEffect(() => {
        if (userEmail) {
            setEmailState(userEmail);
        }
        if (isForgotPassword) {
            setIsReset2FA(true);
        }
    }, [userEmail, isForgotPassword]);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const InsertAccessOrRefreshToken = (data) => {
        // sessionStorage.setItem('UniqueUserID', Encrypted_Id_Name(uniqueId, 'UForUniqueUserID'));
        const Tokens = {
            // 'AgencyID': data['AgencyID'],
            // 'Agency_Name': data['Agency_Name'],
            // 'PINID': data['PINID'],
            // 'UserName': data['userName'],
            // 'SessionTimeOut': data['SessionTimeOut'],
            // 'Is2FAEnabled': data['Is2FAEnabled'] === "False" || data['Is2FAEnabled'] === "false" || data['Is2FAEnabled'] === false ? false : true
            'AgencyID': data['AgencyID'],
            'Agency_Name': data['Agency_Name'],
            'PINID': data['PINID'],
            'UserName': data['userName'],
            'SessionTimeOut': data['SessionTimeOut'],
            'ORI': data['ORI'],
            'BaseDate': data['ReportSubmissionDate'],
            'StateCode': data['StateCode'],
            'StateName': data['StateName'],
            'IsSuperadmin': data['IsSuperadmin'] === "1" ? true : false,
            'IsSupervisor': data['IsSupervisor'],
            'IsIncidentEditable': data['IsIncidentEditable'] === "False" || data['IsIncidentEditable'] === "false" || data['IsIncidentEditable'] === false ? false : true,
            'IsAdministrativeSystem': data['IsAdministrativeSystem'] === "False" || data['IsAdministrativeSystem'] === "false" || data['IsAdministrativeSystem'] === false ? false : true,
            'Is2FAEnabled': data['Is2FAEnabled'] === "False" || data['Is2FAEnabled'] === "false" || data['Is2FAEnabled'] === false ? false : true,
            'NCICLoginId': data['NCICLoginId'],
            'NCICLoginPassword': data['NCICLoginPassword'],
            'NCICLoginTerminalID': data['NCICLoginTerminalID'],
            'NCICORI': data['NCICORI'],
            'ReportApproval': data['ReportApproval'] === "1" ? "Single" : 'Multi',
            'IsLevel': data['IsLevel'],
            'IsCaseManagementVisible': data['IsCaseManagementVisible'] === "False" || data['IsCaseManagementVisible'] === "false" || data['IsCaseManagementVisible'] === false ? false : true,
            'AgencyAddress': data['Agency_Address'],
        }
        const val = {
            // UniqueId: uniUserId,
            UniqueId: uniqueId,
            Key: JSON.stringify(Tokens)
        }
        sessionStorage.setItem('refresh_token', data['refresh_token']);
        sessionStorage.setItem('access_token', data['access_token']);
        sessionStorage.setItem('AgencyID', data['AgencyID']);
        sessionStorage.setItem("SessionTimeOut", data['SessionTimeOut']);
        dispatch(insert_LocalStoreData(val, Tokens));
    }


    // Verification Otp 
    const optVerification = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                username: loginData?.username,
                password: loginData?.password,
                UniqueId: loginData?.UniqueId,
                UnitId: loginData?.UnitId,
                AgencyId: loginData?.AgencyId,
                grant_type: loginData?.grant_type,
                Pin: userOtp,
                FullUserName: loginAPIData?.userName,
                UserPINID: loginAPIData?.PINID,
                UserUniqueKey: loginAPIData?.UserUniqueKey,
                IsFrom2FA: 0,
            };
            const { data } = await GoogleAuthServices.qRAccountValidate(payload);

            if (data.error === '200') {
                sessionStorage.setItem('is-login', true);
                InsertAccessOrRefreshToken(data);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data['access_token']}`;
                if (loginData?.typeOfAccount === "RMS") {
                    navigate('/dashboard-page');
                } else if (loginData?.typeOfAccount === "CAD") {
                    navigate('/cad/dashboard-page');
                } else {
                    navigate("/")
                }
            } else {
                toastifyError(data.message || 'Invalid code. Please try again.');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            toastifyError('Invalid code. Please try again.');
        }
    };

    const login_User = () => {
        setShowLoader(true)
        sessionStorage.setItem('is-login', true)
        setTimeout(() => {
            if (isMDT) {
                navigate('/incident-dashboard');
            } else if (typeOfAccount === 'CAD') {
                navigate('/cad/dashboard-page');
            } else {
                navigate('/dashboard-page');
            }
        }, 1000);
    }

    const verify_User = (e) => {
        e.preventDefault()
        const value = { 'UserName': username, 'AgencyID': loginResData?.AgencyID }
        fetchPostData('Personnel/GetData_ForgotPassword', value).then(res => {
            if (res) {
                setForgetPasswordArray(res);
                navigate('/change-Password');
            }
            else { toastifyError('Username is Wrong') }
        })
    }

    const handleEnterOtp = (e) => {
        setUserOtp((e.target.validity.valid ? e.target.value : userOtp));
    }

    useEffect(() => {
        if (loginAPIData?.UserEmail) {
            setEmailState(loginAPIData?.UserEmail)
        }
    }, [loginAPIData]);
    async function handleVerify(e) {
        e.preventDefault();
        try {
            const payload = {
                Email: emailState,
                Code: emailCode,
                UserPINID: isForgotPassword ? PINID : loginAPIData?.PINID,
            };
            const response = await GoogleAuthServices.verifyCode(payload);
            if (response) {
                if (isForgotPassword) {
                    const EventLocation = {
                        UserName: loginAPIData?.userName,
                        Result: 'Success',
                        Remarks: 'Email verification code verified successfully',
                        EventLocation: 'Forgot password',
                        AgencyID: loginAPIData?.AgencyID,
                    }
                    await GoogleAuthServices.insertLoginLog(EventLocation);
                    navigate('/change-Password');
                } else {
                    setIsVerified(true);
                    const EventLocation = {
                        UserName: loginAPIData?.userName,
                        Result: 'Success',
                        Remarks: 'Email verification code verified successfully',
                        EventLocation: 'Email verification',
                        AgencyID: loginAPIData?.AgencyID,
                    }
                    await GoogleAuthServices.insertLoginLog(EventLocation);
                    const qrPayload = {
                        UserName: loginAPIData?.userName,
                        UserPINID: loginAPIData?.PINID,
                    };
                    const res = await GoogleAuthServices.generateQR(qrPayload);
                    if (res?.status === 200) {
                        setQrCodeData(res?.data?.QRCode);
                        setUniqueKey(res?.data?.UniqueKey);
                    } else {
                        toastifyError(res?.data?.message || 'Failed to generate QR code. Please try again.');
                    }
                }
            } else {
                const EventLocation = {
                    UserName: loginAPIData?.userName,
                    Result: 'Fail',
                    Remarks: 'Email verification code verified failed',
                    EventLocation: 'Email verification',
                    AgencyID: loginAPIData?.AgencyID,
                }
                await GoogleAuthServices.insertLoginLog(EventLocation);
                toastifyError('Invalid email verification code. Please try again.');
            }
        } catch (error) {
            if (isForgotPassword) {
                const EventLocation = {
                    UserName: loginAPIData?.userName,
                    Result: 'Fail',
                    Remarks: 'Email verification code verified failed',
                    EventLocation: 'Forgot password',
                    AgencyID: loginAPIData?.AgencyID,
                }
                await GoogleAuthServices.insertLoginLog(EventLocation);
            } else {
                const EventLocation = {
                    UserName: loginAPIData?.userName,
                    Result: 'Fail',
                    Remarks: 'Email verification code verified failed',
                    EventLocation: 'Email verification',
                    AgencyID: loginAPIData?.AgencyID,
                }
                await GoogleAuthServices.insertLoginLog(EventLocation);
            }
            console.error('Error during verification process:', error);
            toastifyError('Invalid email verification code. Please try again.');
        }
    }

    async function sendVerificationCode(e) {
        setIsSendEmailOtp(true);
        e.preventDefault();
        setTimeout(() => {
            setTimer(60);
        }, 1000);
        const payload = {
            Email: loginAPIData?.UserEmail,
            UserPINID: loginAPIData?.PINID,
        };
        const response = await GoogleAuthServices.sendVerificationCode(payload);
        if (response) {
            setIsEmail(true);
            setEmailCode("");
        }
        setIsSendEmailOtp(false);
    }

    async function handleVerifyQRCode(e) {
        e.preventDefault();

        try {
            const payload = {
                username: loginData?.username,
                password: loginData?.password,
                UniqueId: loginData?.UniqueId,
                UnitId: loginData?.UnitId,
                AgencyId: loginData?.AgencyId,
                grant_type: loginData?.grant_type,
                Pin: qrCode,
                FullUserName: loginAPIData?.userName,
                UserPINID: loginAPIData?.PINID,
                UserUniqueKey: uniqueKey,
                IsFrom2FA: 1,   // 1 for 2FA True and 0 for 2FA False.
            };
            const { data } = await GoogleAuthServices.qRAccountValidate(payload);
            if (data.error === '200') {
                sessionStorage.setItem('is-login', true);
                InsertAccessOrRefreshToken(data);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data['access_token']}`;
                navigate('/dashboard-page');
                setQrCodeData("");
            } else {
                toastifyError(data.message || 'Invalid code. Please try again.');
            }
        } catch (error) {
            console.error('Error during QR Code verification:', error);
            toastifyError('Invalid code. Please try again.');
        }
    }

    return (
        <>
            {isReset2FA ? <div className="login-container" id='check_user' style={{ display: 'block' }}>
                <div className="auth mx-4">
                    <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                        <div className="text-center mb-2">
                        </div>
                        <div className="card-body">
                            {isVerified ? (
                                <>
                                    <form id='final-variation-form'>
                                        <div className="text-center pb-2">
                                            <h5 className="m-0 pb-3"> 2 Factor Authentication</h5>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                maxLength={6}
                                                pattern="[0-9]*"
                                                className="form-control"
                                                placeholder="Enter code"
                                                value={qrCode}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d{0,6}$/.test(value)) {
                                                        setQrCode(value);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <img src={qrCodeData} alt="Base64" />
                                        </div>
                                        <div className='mt-1'>
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-block"
                                                onClick={(e) => handleVerifyQRCode(e)}
                                            >Verify</button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                isEmail ? (
                                    <>
                                        <form id='email-variation-code-form'>
                                            <div className="text-center pb-2">
                                                <h5 className="m-0 pb-3">Enter email verification code</h5>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="number"
                                                    maxLength={6}
                                                    pattern="[0-9]*"
                                                    className="form-control"
                                                    placeholder="Enter code"
                                                    value={emailCode}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d{0,6}$/.test(value)) {
                                                            setEmailCode(value);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <Link
                                                    to=""
                                                    className={`small my-2 ${timer > 0 ? "text-muted" : ""}`}
                                                    onClick={timer > 0 ? null : sendVerificationCode}
                                                    style={{ pointerEvents: timer > 0 ? "none" : "auto" }}
                                                >
                                                    {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
                                                </Link>
                                            </div>
                                            <div className='mt-1'>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-block"
                                                    onClick={(e) => handleVerify(e)}
                                                >Verify</button>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <form id='email-form'>
                                            <div className="text-center pb-2">
                                                <h5 className="m-0 pb-1">Your registered email</h5>
                                            </div>
                                            <div className="form-group">
                                                <span className="d-flex justify-content-center">{emailState}</span>
                                                {/* <input
                                                    type="text"
                                                    value={emailState}
                                                    onChange={(e) => setEmailState(e.target.value)}
                                                    className="form-control"
                                                    disabled={!!loginAPIData?.UserEmail || emailState}
                                                    placeholder="Enter email address"
                                                /> */}
                                            </div>
                                            <div className='mt-1'>
                                                <button
                                                    onClick={(e) => sendVerificationCode(e)}
                                                    type="submit"
                                                    disabled={isSendEmailOtp}
                                                    className="btn btn-primary btn-block"
                                                >
                                                    Send Code
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
                :
                <div className="login-container">
                    <div className="auth mobile-login mx-4">
                        <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-4">
                            <div className="text-center mb-2">
                            </div>
                            {!isForgotPassword && (isValidUser || isSuperAdmin) ? (
                                <div className="card-body">
                                    <form onSubmit={optVerification}>
                                        <div className="text-center pb-2">
                                            {/* <span id="otp">{otp}</span> */}

                                            <h5 className="m-0 pb-3">Login Verification Code</h5>
                                            <spna style={{ fontSize: '14px', color: 'red' }}>{errMsg ? "Invalid UserName" : ''}</spna>
                                            {
                                                loginLoader ?
                                                    <>
                                                        <output className="spinner-border text-success">
                                                        </output> <br />
                                                        <span >Please Wait...</span>
                                                    </>
                                                    : ''
                                            }
                                        </div>
                                        <div className="">
                                            <input type="text" maxLength={6} pattern="[0-9]*" className="form-control" autoComplete="off" onChange={(e) => handleEnterOtp(e)} id="exampleInputEmail1" value={userOtp} aria-describedby="emailHelp" placeholder="Enter Your 6 digits code" />
                                        </div>
                                        {/* <div className="row">
                                    <div className="col-6">
                                        <div className="text-danger col-12" style={{ fontSize: '12px' }}>
                                            <label>Expire in <span id="timer"></span> </label>
                                        </div>
                                    </div>
                                    <div className="col-6  mt-1">
                                        <div className="col-12 verification text-center bg-green text-white" style={{ fontSize: '10px', borderRadius: '5px' }}>
                                            {
                                                !expireOtp ?
                                                    <button className="pt-1 mb-1" onClick={Resend_Verification_Code}>Resend Verification Code</button>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                </div> */}
                                        {isSuperAdmin && (
                                            <div className="d-flex justify-content-center align-items-center">
                                                <Link to="" className="small mt-2" onClick={() => setIsReset2FA(true)}>Reset 2FA</Link>
                                            </div>
                                        )}
                                        <div className="mt-3">
                                            <button type="submit" className="btn btn-primary btn-block">Verify</button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="card-body w-100 text-center">
                                    <h5 className="m-0">To access your account, please </h5>
                                    <h5 className="m-0 text-nowrap">contact your administrator to enable</h5>
                                    <h5 className="m-0 pb-3">two-factor authentication (2FA).</h5>
                                </div>
                            )}
                        </div>
                    </div>
                    {
                        openModal ?
                            <div style={{ background: "rgba(0,0,0, 0.5)", position: 'fixed', top: '0', left: '0', zIndex: '1990', width: '100%' }}>
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="box text-center py-5">
                                            {
                                                loginLoader ?
                                                    <>
                                                        <output className="spinner-border text-success">
                                                        </output> <br />
                                                        <span >Please Wait...</span>
                                                    </>
                                                    : ''
                                            }
                                            <h5 className="modal-title mt-2" id="exampleModalLabel">{loginResData?.Leftdays === '0' || loginResData?.Leftdays === 0 ? 'Your password is expired, please change your password.' : `change your password within ${loginResData?.Leftdays} days.`}</h5>
                                            <div className="btn-box mt-3">
                                                <button type="button" className="btn btn-sm text-white" style={{ background: "#ef233c" }} data-dismiss="modal" onClick={verify_User}>Change</button>
                                                {
                                                    loginResData?.Leftdays === '0' || parseInt(loginResData?.Leftdays) === 0 || parseInt(loginResData?.Leftdays) < 0 ? <></>
                                                        :
                                                        <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal" onClick={login_User}> Cancel</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                    }
                </div>}
        </>
    )
}

export default memo(Otp)