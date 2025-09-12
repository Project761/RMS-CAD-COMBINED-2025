// Import Component
import React, { memo, useContext, useRef, useState } from 'react'
import { toastifyError } from '../Common/AlertMsg';
import { get_OTP } from '../Common/Utility';
import { fetchPostData } from '../hooks/Api';
import Otp from './Otp2FA';
import { AgencyContext } from '../../Context/Agency/Index';
import Select from 'react-select';
import { Comman_changeArrayFormat } from '../Common/ChangeArrayFormat';
import { LoginContext } from '../../CADContext/loginAuth';

const ForgotPassword = () => {

    const { setForgetPasswordArray, } = useContext(AgencyContext);
    const { setLoginAPIData } = useContext(LoginContext);

    const [username, setUserName] = useState('');
    const [timerOn, setTimerOn] = useState(false);
    const [otp, setOtp] = useState('');
    const [type, setType] = useState('forget_password');
    const [userNameErr, setUserNameErr] = useState(false);
    const [agency, setAgency] = useState([]);
    const [agencyMenu, setAgencyMenu] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isValidUser, setIsValidUser] = useState(false);
    const [LoginAgencyId, setLoginAgencyId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loginResData, setLoginResData] = useState([]);
    const [PINID, setPINID] = useState("");

    const myRef = useRef()

    // Check User 
    const verify_User = () => {
        const value = { UserName: username, 'AgencyID': LoginAgencyId }
        fetchPostData('Personnel/GetData_ForgotPassword', value).then(res => {
            if (res.length > 0) {
                setLoginAPIData(res?.[0]);
                setLoginResData(res[0]);
                setForgetPasswordArray(res);
                setIsSuperAdmin(res?.[0]?.isSuperadmin);
                setIsValidUser(res?.[0]?.isValidUser === 1 ? true : false);
                setUserEmail(res?.[0]?.UserEmail);
                setPINID(res?.[0]?.PINID);
                dom_Fuction('otp-page');
            }
            else toastifyError('Username is Wrong')
        })
    }

    const verifying_Agency = () => {
        const value = { UserName: username }
        fetchPostData('Personnel/GetData_AgencyLogin', value).then(res => {
            if (res?.length > 0) {
                if (res?.length > 0 && res?.length <= 1) {
                    setAgency(Comman_changeArrayFormat(res, 'AgencyID', 'Agency_Name'));
                    setLoginAgencyId(res[0]?.AgencyID);
                } else {
                    setAgency(Comman_changeArrayFormat(res, 'AgencyID', 'Agency_Name'));
                    setAgencyMenu(true);
                }
            } else {
                if (username?.length > 0) {
                    toastifyError('User Not Found')
                }
            }
        })
    }

    const handleUserNameInput = (e) => {
        if (e) {
            setUserName(e.target.value);
            if (e.target.value?.length == 0) { setLoginAgencyId(''); setAgency([]); }
        } else {
            if (e.target.value?.length == 0) { setLoginAgencyId(''); setAgency([]); }
        }
    }

    const AgencyChanges = (e) => {
        setAgencyMenu(true);
        if (e) {
            setLoginAgencyId(e.value);
            setAgencyMenu(false);
            myRef.current.focus();
        }
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        if (username === '') {
            setUserNameErr("Please enter UserName")
        } else {
            setUserNameErr(false)
        }
        if (username !== '' || userNameErr) {
            verify_User()
        }
    }

    // Change Page With Dom 
    const dom_Fuction = (val) => {
        if (val === 'otp-page') {
            setTimerOn(true)
            const otp = get_OTP()
            setOtp(otp)
            document.getElementById('otp-page').style.display = 'block'
            document.getElementById('check_user').style.display = 'none'
            document.getElementById('change_pass').style.display = 'none'
        }
    }

    const handleCopy = (e) => {
        e.preventDefault();
    };

    // custuom style withoutColor
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            {/* User Verify Page */}
            <div className="login-container" id='check_user' style={{ display: 'block' }}>
                <div className="auth mx-4">
                    <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                        <div className="text-center mb-2">
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleLoginSubmit} >
                                <div className="text-center pb-2">
                                    <h5 className="m-0 pb-3">Forgot Password</h5>
                                    <span style={{ fontSize: '14px', color: 'red' }}></span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">UserName </label>
                                    <input
                                        type="text"
                                        ref={myRef}
                                        onBlur={agency?.length > 0 ? '' : verifying_Agency}
                                        onCut={handleCopy}
                                        onCopy={handleCopy}
                                        onPaste={handleCopy}
                                        className="form-control"
                                        onChange={(e) => handleUserNameInput(e)}
                                        placeholder="Enter Username"
                                    />
                                    {userNameErr && <span className="text-danger" style={{ fontSize: '13px' }}>{userNameErr}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Agency</label>
                                    <Select
                                        name='AgencyID'
                                        value={agency?.filter((obj) => obj.value === LoginAgencyId)}
                                        options={agency}
                                        onChange={(e) => AgencyChanges(e)}
                                        styles={customStylesWithOutColor}
                                        onFocus={() => setAgencyMenu(true)}
                                        onBlur={() => setAgencyMenu(false)}
                                        menuIsOpen={agencyMenu}
                                    />
                                </div>
                                <div className='mt-1'>
                                    <button type="submit" className="btn btn-primary btn-block" >Verify</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Otp Page Component */}
            <div id='otp-page' style={{ display: 'none' }}>
                <Otp {...{ username, loginResData, timerOn, otp, setOtp, type, isSuperAdmin, isValidUser, userEmail, PINID }} isForgotPassword />
            </div>
        </>
    )
}

export default memo(ForgotPassword)