// Import Component
import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData } from '../hooks/Api';
import { AgencyContext } from '../../Context/Agency/Index';
import { encryptAndEncodeToBase64 } from '../Common/Utility';
import GoogleAuthServices from '../../CADServices/APIs/googleAuth';
import { hasKeyboardSequence } from '../Pages/PersonnelCom/Validation/PersonnelValidation';

const ChangePassword = () => {

    const { forgetPasswordArray } = useContext(AgencyContext);
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(true);
    const [confPasswordShown, setConfPasswordShown] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordSettingVal, setPasswordSettingVal] = useState([]);
    const [agencyID, setAgencyID] = useState();
    const [pinID, setPinID] = useState();
    const [userName, setUserName] = useState("");
    const [passStatus, setPassStatus] = useState(false);
    const [passMessage, setPassMessage] = useState();

    // Password Check Color
    const [colour1, setColour1] = useState('red')
    const [colour2, setColour2] = useState('red')
    const [colour3, setColour3] = useState('red')
    const [colour4, setColour4] = useState('red')
    const [colour5, setColour5] = useState('red')
    const [colour6, setColour6] = useState(false)
    const [checkPassSeq, setCheckPassSeq] = useState()

    useEffect(() => {
        if (forgetPasswordArray) {
            setPasswordSettingVal(forgetPasswordArray[0]);
            setAgencyID(forgetPasswordArray[0]?.AgencyID);
            setPinID(forgetPasswordArray[0]?.PINID);
            setUserName(forgetPasswordArray[0]?.Name);
        }
    }, [forgetPasswordArray])

    const togglePassword = (field) => {
        if (field === 'password') {
            setPasswordShown(!passwordShown);
        } else if (field === 'confirmPassword') {
            setConfPasswordShown(!confPasswordShown);
        }
    };

    // async function handleLoginLog() {
    //     const loginLogPayload = {
    //         UserName: loginAPIData?.userName,
    //         Result: 'Fail',
    //         Remarks: 'Email verification code verified failed',
    //         EventLocation: 'Email verification',
    //         AgencyID: loginAPIData?.AgencyID,
    //     }
    //     await GoogleAuthServices.insertLoginLog(loginLogPayload);
    // }

    const change_password = async (e) => {
        e.preventDefault()
        const value = { "AgencyID": agencyID, "PINID": pinID, "Password": encryptAndEncodeToBase64(password) }
        if (colour6) {
            if (password === confirmPassword) {
                if (!passStatus) {
                    toastifyError(passMessage);
                } else {
                    if (checkPassSeq) {
                        try {
                            const res = await AddDeleteUpadate('Personnel/UpdatePassword', value);
                            if (res.success) {
                                toastifySuccess(res.Message)
                                navigate('/')
                                const loginLogPayload = {
                                    UserName: userName,
                                    Result: 'Success',
                                    Remarks: 'Password Changed Successfully',
                                    EventLocation: 'Change Password',
                                    AgencyID: agencyID,
                                }
                                await GoogleAuthServices.insertLoginLog(loginLogPayload);
                                await GoogleAuthServices.logOutFromAllDevices({ UserPINID: pinID.toString() });
                                // handleLoginLog();
                            } else {
                                toastifyError(res.response.data.Message)
                            }
                        } catch (err) {
                            if (err?.response?.data?.Message) {
                                toastifyError(err?.response?.data?.Message)
                            }

                        };
                    } else {
                        toastifyError('Invalid Pattern');
                    }
                }
            } else {
                toastifyError('confirm password wrong')
            }
        } else {
            toastifyError('Space Not Allow')
        }
    }

    // Password Validation
    const validationPass = (e) => {
        e.preventDefault()
        const val = e.target.value
        setPassword(val)
        if (val?.length >= passwordSettingVal?.MinPasswordLength) {
            setColour1('green')
        } else {
            setColour1('red')
        }
        if (val.match(`(?=(.*[A-Z]){${passwordSettingVal?.MinUpperCaseInPassword}})`)) {
            setColour2('green')
        } else {
            setColour2('red')
        }
        if (val.match(`(?=(.*[a-z]){${passwordSettingVal?.MinLowerCaseInPassword},})`)) {
            setColour3('green')
        } else {
            setColour3('red')
        }
        if (val.match(`(?=(.*[0-9]){${passwordSettingVal?.MinNumericDigitsInPassword}})`)) {
            setColour4('green')
        } else {
            setColour4('red')
        }
        if (val.match(`(?=(.*[-#$.%&@*]){${passwordSettingVal?.MinSpecialCharsInPassword}})`)) {
            setColour5('green')
        } else {
            setColour5('red')
        }
        // if (/^[a-zA-Z\s]*$/.test(val)) {
        // if (/^\S[a-zA-Z\s]*$/.test(val)) {
        //     setColour6(true);
        // } else {
        //     setColour6(false);
        // }
        if (val.match(/^\S.*[a-zA-Z\s]*$/)) {
            setColour6(true)
        } else {
            setColour6(false)
        }
    }

    const checkPassword = (e, agencyID, pinID) => {
        const PasswordVal = e.target.value;
        const pwdSeqStatus = hasKeyboardSequence(PasswordVal);
        if (!pwdSeqStatus) {
            fetchPostData('Personnel/CheckPasswordSetting', { Password: encryptAndEncodeToBase64(PasswordVal), AgencyID: agencyID, PINID: pinID }).then(res => {
                if (res[0].status === "true" || res[0].status === true) {
                    setPassStatus(true); setPassMessage(res[0].Message); setCheckPassSeq(true);
                } else {
                    setPassStatus(false); setPassMessage(res[0].Message); setCheckPassSeq(true);
                }
            })
        } else {
            toastifyError('Invalid Pattern');
            setCheckPassSeq(false)
        }
    }

    // function hasKeyboardSequence(input) {
    //     const regex = /(.)\1/;
    //     const res = regex.test(input.toLowerCase());

    //     for (let i = 1; i < input.length; i++) {
    //         if ((Math.abs(input.charCodeAt(i) - input.charCodeAt(i - 1)) === 1) || res) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    const handleCopy = (e) => {
        e.preventDefault();
    };

    // style validation
    const style = {
        boxShadow: "2px 2px 3px 3px #ccc",
        border: "2px #eee",
        padding: "20px",
        marginTop: "25px"
    }

    return (
        <div className="login-container">
            <div className="auth mx-4">
                <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                    <div className="text-center mb-2">
                    </div>
                    <div className="card-body">
                        <form >
                            <div className="text-center pb-2">
                                <h5 className="m-0 pb-3">Change Password</h5>
                                <span style={{ fontSize: '14px', color: 'red' }}></span>
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">New Password </label>
                                <i className={passwordShown ? "fa fa-eye" : "fa fa-eye-slash"} onClick={() => togglePassword('password')} onKeyDown={''} style={{ position: 'absolute', top: '60%', right: '3%' }}></i>
                                <input
                                    type="text"
                                    className="form-control"
                                    onBlur={(e) => checkPassword(e, agencyID, pinID)}
                                    style={{ WebkitTextSecurity: passwordShown ? 'none' : 'disc' }}
                                    placeholder="New Password"
                                    onChange={validationPass}
                                    onCut={handleCopy}
                                    onCopy={handleCopy}
                                    onPaste={handleCopy}
                                />
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">Confirm Password</label>
                                <i className={confPasswordShown ? "fa fa-eye" : "fa fa-eye-slash"} onClick={() => togglePassword('confirmPassword')} onKeyDown={''} style={{ position: 'absolute', top: '60%', right: '3%' }}></i>
                                <input
                                    type="text"
                                    onChange={(e) => { setConfirmPassword(e.target.value) }}
                                    style={{ WebkitTextSecurity: confPasswordShown ? 'none' : 'disc' }}
                                    className="form-control"
                                    placeholder="Confirm Password"
                                    onCut={handleCopy}
                                    onCopy={handleCopy}
                                    onPaste={handleCopy}
                                />
                            </div>
                            <div className="">
                                <button type="submit" disabled={password !== confirmPassword} className="btn btn-primary btn-block" onClick={change_password}>Change Password</button>
                            </div>
                        </form>
                        <div className="col-md-12">
                            <div style={style}>
                                <form>
                                    <p><i style={{ color: colour1, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinPasswordLength} characters</p>
                                    <p><i style={{ color: colour2, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinUpperCaseInPassword} uppercase letter</p>
                                    <p><i style={{ color: colour3, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinLowerCaseInPassword} lowercase letter</p>
                                    <p><i style={{ color: colour4, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinNumericDigitsInPassword} number </p>
                                    <p><i style={{ color: colour5, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinSpecialCharsInPassword} special character</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
