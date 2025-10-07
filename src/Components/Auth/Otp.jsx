// Import Component
import React, { useEffect, useState, memo, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toastifyError, } from "../Common/AlertMsg";
import { Decrypt_Id_Name, get_OTP } from "../Common/Utility";
import { AddDeleteUpadate, fetchPostData } from "../hooks/Api";
import { AgencyContext } from "../../Context/Agency/Index";



const Otp = ({ username, otp, loginResData, setOtp, timerOn, type, isMDT }) => {

    const navigate = useNavigate();
    const { setForgetPasswordArray, } = useContext(AgencyContext);


    const [userOtp, setUserOtp] = useState('');
    const [errMsg, setErrMsg] = useState(false);
    const [expireOtp, setExpireOtp] = useState(true);
    const [loginLoader, setShowLoader] = useState(false);
    const [wrongOtpCount, setWrongOtpCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [otpCount, setOtpCount] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (timerOn) timer(60);
    }, [timerOn])

    const timer = (remaining) => {
        let m = Math.floor(remaining / 60);
        let s = remaining % 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        if (timerRef.current) {
            timerRef.current.innerHTML = `${m}:${s}`;
        }
        remaining -= 1;

        if (remaining >= 0 && timerOn) {
            setTimeout(function () {
                timer(remaining);
            }, 1000);
            return;
        }
        setExpireOtp(false)
    }

    useEffect(() => {
        if (otpCount == 3) {
            window.location.reload();
        }
        if (wrongOtpCount == 3) {
            window.location.reload();
        }
    }, [otpCount, wrongOtpCount])

    const optVerfication = async (e) => {
        e.preventDefault()
        // old code ----------->  Don't Remove <-------------------------
        if (otp === userOtp && expireOtp && type === 'login') {
            // console.log("🚀 ~ optVerfication ~ loginResData:", loginResData);
            const leftdays = loginResData?.Leftdays ? parseInt(loginResData?.Leftdays) : 0;
            const PasswordMessageDays = loginResData?.PasswordMessageDays ? parseInt(loginResData?.PasswordMessageDays) : 0;
            if (leftdays <= PasswordMessageDays) {
                setOpenModal(true);
            } else {
                login_User()
            }
        } else if (otp === userOtp && expireOtp && type === 'forget_password') {
            navigate('/change-Password')
        }
        else if (userOtp?.length === 0) {
            toastifyError('Please Enter Otp')
        }
        else if (otp !== userOtp) {
            setWrongOtpCount(wrongOtpCount + 1)
            toastifyError('Wrong Otp')
        } else if (!expireOtp) {
            toastifyError('Otp Expired')
        }
    }

    const login_User = () => {
        setShowLoader(true)
        sessionStorage.setItem('is-login', true)
        setTimeout(() => {
            if (isMDT) {
                navigate('/incident-dashboard');
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

    // Resend Otp and Verifiy Otp And Again Call timer function
    const Resend_Verification_Code = (e) => {
        e.preventDefault()
        const otp = get_OTP()
        setExpireOtp(true)
        setOtp(otp)
        // setOtp('123456')
        timer(60);
        setOtpCount(otpCount + 1)
    }

    return (
        <div className="login-container">
            <div className="auth mobile-login mx-4">
                <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                    <div className="text-center mb-2">
                    </div>
                    <div className="card-body">
                        <form onSubmit={optVerfication}>
                            <div className="text-center pb-2">
                                <span id="otp">{otp}</span>

                                <h5 className="m-0 pb-3">Login Verification Code</h5>
                                <span style={{ fontSize: '14px', color: 'red' }}>{errMsg ? "Invalid UserName" : ''}</span>
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
                            <div className="row">
                                <div className="col-6">
                                    <div className="text-danger col-12" style={{ fontSize: '12px' }}>
                                        <label>Expire in <span ref={timerRef} id="timer"></span> </label>
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
                            </div>
                            <div className="mt-5">
                                <button type="submit" className="btn btn-primary btn-block">Verify</button>
                            </div>
                        </form>
                    </div>
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
        </div>
    )
}

export default memo(Otp)