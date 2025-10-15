// Import Component
import React, { useEffect, useState, memo, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Aes256Base64DecryptString, Aes256Decrypt, Aes256Encrypt, Encrypted_Id_Name, customStylesWithOutColor, encryptAndEncodeToBase64, getShowingDateText, getShowingYearMonthDate, get_OTP, stringToBase64 } from "../Common/Utility";
import { AddDeleteUpadate, fetchPostData } from "../hooks/Api";
import { toastifyError } from "../Common/AlertMsg";
import Select from 'react-select';
import uuid from "uuidv4";
import { AgencyContext } from "../../Context/Agency/Index";
import { Comman_changeArrayFormat, login_changeArrayFormat } from "../Common/ChangeArrayFormat";
import { useDispatch } from "react-redux";
import { LoginContext } from "../../CADContext/loginAuth";
import GoogleAuthServices from "../../CADServices/APIs/googleAuth";
import { fetchIpAddress, insert_LocalStoreData } from "../../redux/actions/Agency";
import { useSelector } from "react-redux";
import { connection } from "../../CADServices/signalRService";
import { HubConnectionState } from "@microsoft/signalr";
import Otp2FA from "./Otp2FA";
import Otp from "./Otp";

const Login = ({ login }) => {

    const { setAuthSession, setLogByOtp, setIsLogout, setRecentSearchData, setSearchObject, setIs2FAEnabled } = useContext(AgencyContext);
    const { setLoginAPIData, setLoginData } = useContext(LoginContext);
    const encDecStatus = process.env.REACT_APP_ENC_DEC_STATUS;
    // var IsEncDec = encDecStatus == 'true' || encDecStatus == true
    const IsEncDec = encDecStatus == 'true' || encDecStatus === true;
    
    const ipAddress = useSelector((state) => state.Ip.ipAddress);

    // Hooks initialize   
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [pinID, setPinID] = useState('');
    const [password, setPassword] = useState('');
    const [unitName, setUnitName] = useState(0);
    const [grant_type] = useState('password');
    const [errMSg, setErrMsg] = useState('');
    const [loginAttempt, setLoginAttempt] = useState('');
    const [typeOfAccount, setTypeOfAccount] = useState('');
    const [isValidUser, setIsValidUser] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [loginAttemptStatus, setLoginAttemptStatus] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [loginResData, setLoginResData] = useState([]);
    const [otp, setOtp] = useState('');
    const [type] = useState('login');
    const [logLoader, setShowLoader] = useState(false);
    const [timerOn, setTimerOn] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [unitCheck, setUnitCheck] = useState(false);
    const [agency, setAgency] = useState([]);
    const accType = [
        {
            "value": 'RMS',
            "label": "RMS"
        },
        {
            "value": 'CAD',
            "label": "CAD"
        },
    ]
    const [unit, setUnit] = useState([]);
    const agencyPlaceholder = []
    const unitPlaceholder = []
    const [isMDT, setIsMDT] = useState(false);
    const [uniUserId, setUniUserId] = useState('');
    const [agencyMenu, setAgencyMenu] = useState(false);
    // const [ipAddress, setIpAddress] = useState('');
    const myRef = useRef()
    const userNameRef = useRef()
    const [typeMenu, setTypeMenu] = useState(false);
    const IsLoginSession = sessionStorage.getItem('is-login') ? sessionStorage.getItem('is-login') : false;

    useEffect(() => {
        const uniqueID = uuid();
        const small_uniq_ID = uniqueID.slice(0, 8);
        if (small_uniq_ID) {
            setUniUserId(small_uniq_ID)
        }
        // get IpAddress
        dispatch(fetchIpAddress());
        // get_IpAddress()
    }, []);

    useEffect(() => {
        if (IsLoginSession === 'true' || IsLoginSession === true) {
            setIsLogout(false);
            setLogByOtp(false)
            setAuthSession('');
            navigate('/');
            sessionStorage.setItem('is-login', false);
        }
    }, [])

    useEffect(() => {
        if (timerOn) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('otp').style.display = 'block';
        }
    }, [timerOn])

    // Show Password
    const togglePassword = (e) => {
        e.preventDefault();
        setPasswordShown(!passwordShown);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            togglePassword();
        }
    };

    // Check Login Attempt and Lock Id 
    const login_Attempt = (err) => {
        if (err === "Your Account is Locked.Please contact your Administrator.") {
            toastifyError(err);
            setLoginAttemptStatus(false);
            setErrMsg(err);
        } else if (err === 'Invalid UserName and password') {
            if (loginAttempt > 1) {
                toastifyError(err)
                // setLoginAttempt(loginAttempt - 1);
                setLoginAttemptStatus(true)
                setErrMsg(err);
                // Logs for Wrong Entries
                insertLogInfo()

            } else {
                setLoginAttemptStatus(false)
                lock_User_Id()
                setErrMsg(err)
            }
        } else {
            setErrMsg(err);
            // setErrMsg("User Not Found");
        }
    }

    // Lock Id Call Api
    const lock_User_Id = () => {
        const value = {
            FailureLock: 1,
            FailureLockDateTime: getShowingYearMonthDate(new Date),
            UserName: username,
        }
        fetchPostData('Personnel/UpdateFailureLock', value).then(res => {
            if (res) toastifyError('Lock Your Id')
        })
    }

    const [LoginAgencyId, setLoginAgencyId] = useState('')
    const [Is2FALogin, setIs2FALogin] = useState(false);
    const AgencyChanges = (e) => {
        setAgencyMenu(true);
        setPinID(e?.PINID);
        if (e) {
            setLoginAgencyId(e.value);
            setIs2FALogin(e.Is2FAEnabled);
            setIs2FAEnabled(e.Is2FAEnabled);
            setAgencyMenu(false);
            myRef.current.focus();
        }
    }
    const [agencyErr, setAgencyErr] = useState(false)
    const [typeOfAccountErr, setTypeOfAccountErr] = useState(false)
    const [passErr, setPassErr] = useState(false)
    const [userErr, setUserErr] = useState(false)
    const [unitErr, setUnitErr] = useState(false)

    // Login user 
    const InsertAccessOrRefreshToken = (data) => {
        const is2FAEnabled = data.hasOwnProperty('Is2FAEnabled') ? data['Is2FAEnabled'] === "False" || data['Is2FAEnabled'] === "false" || data['Is2FAEnabled'] === false ? false : true : false;
        setRecentSearchData([]); setSearchObject({});
        sessionStorage.setItem('UniqueUserID', Encrypted_Id_Name(uniUserId, 'UForUniqueUserID'));
        const Tokens = {
            'AgencyID': data['AgencyID'],
            'Agency_Name': data['Agency_Name'],
            'PINID': data['PINID'],
            'UserName': data['userName'],
            'fullName': data['fullName'],
            'SessionTimeOut': data['SessionTimeOut'],
            'ORI': data['ORI'],
            'BaseDate': data['ReportSubmissionDate'],
            'StateCode': data['StateCode'],
            'StateName': data['StateName'],
            'IsSupervisor': data['IsSupervisor'],
            'IsIncidentEditable': data['IsIncidentEditable'] === "False" || data['IsIncidentEditable'] === "false" || data['IsIncidentEditable'] === false ? false : true,
            'IsAdministrativeSystem': data['IsAdministrativeSystem'] === "False" || data['IsAdministrativeSystem'] === "false" || data['IsAdministrativeSystem'] === false ? false : true,
            'Is2FAEnabled': is2FAEnabled,
            'NCICLoginId': data['NCICLoginId'],
            'NCICLoginPassword': data['NCICLoginPassword'],
            'NCICLoginTerminalID': data['NCICLoginTerminalID'],
            'NCICORI': data['NCICORI'],
            'IsSuperadmin': data['IsSuperadmin'] === "1" ? true : false,
            'ReportApproval': data['ReportApproval'] === "1" ? "Single" : 'Multi',
            'IsLevel': data['IsLevel']
        }
        // StateName
        // StateCode
        const val = {
            UniqueId: uniUserId,
            Key: JSON.stringify(Tokens)
        }
        sessionStorage.setItem('PINID', data['PINID']);
        sessionStorage.setItem("SessionTimeOut", data['SessionTimeOut']);
        sessionStorage.setItem('refresh_token', data['refresh_token']);

        if (data['access_token'])
            sessionStorage.setItem('access_token', data['access_token']);

        sessionStorage.setItem('IPAddress', ipAddress);

        dispatch(insert_LocalStoreData(val, Tokens));
    }

    const handleLoginSubmit = async e => {
        e.preventDefault()
        if (LoginAgencyId === '') {
            setAgencyErr("Select agency !!");
        } else {
            setAgencyErr(false)
        }
        if (typeOfAccount === '') {
            setTypeOfAccountErr("Select Type Of Account !!");
        } else {
            setTypeOfAccountErr(false)
        }
        if (username === '') {
            setUserErr("Please enter username");
        } else {
            setUserErr(false)
        }
        if (password === '') {
            setPassErr("Please enter password");
        } else {
            setPassErr(false)
        }
        if (password === '') {
            toastifyError("Please enter password");
        }
        if (username === '') {
            toastifyError("Please enter password");
        }
        if (unitName === 0) {
            setUnitErr("Select unit !!");
        } else {
            setUnitErr(false);
        }
        if (LoginAgencyId !== '' && uniUserId !== '' && password !== '' && unitCheck === false && typeOfAccount !== '') {
            if (IsEncDec) {
                const val = { username: username, password: encryptAndEncodeToBase64(password), UniqueId: uniUserId, UnitId: unitName, AgencyId: LoginAgencyId, grant_type, Attempts: loginAttempt, UserPINID: pinID }
                // encrypting data
                const EncPostData = await Aes256Encrypt(JSON.stringify(val));
                const postData = { 'EDpostData': EncPostData }
                const { data } = await axios.post(Is2FALogin ? 'Account/GetToken' : 'Account/GetTokenNormal', postData);
                // axios.defaults.headers.common['Authorization'] = `Bearer ${data['access_token']}`;
                setLoginAPIData(data);
                if (data.error === '200') {
                    InsertAccessOrRefreshToken(data);
                    const baseVal = {
                        ...val,
                        typeOfAccount
                    };
                    setLoginData(baseVal);
                    // InsertAccessOrRefreshToken(data['refresh_token'], data['access_token'])
                    setErrMsg('');
                    setLoginResData(data);
                    setIsValidUser(data?.IsValidUser)
                    setIsSuperAdmin(data?.IsSuperadmin === "1" ? true : false)
                    localStorage.setItem('IsSuperadmin', data['IsSuperadmin'])
                    sessionStorage.setItem('IsSuperadmin', data['IsSuperadmin'])
                    localStorage.setItem('PINID', data['PINID'])
                    sessionStorage.setItem('PINID', data['PINID'])
                    setLoginStatus(data?.IsLoggedIn ? false : true);
                    const PinID = data['PINID'];
                    if (Is2FALogin) {
                        if (PinID && !data?.IsLoggedIn) {
                            connection.start()
                                .then(() => {
                                    localStorage.setItem("connectionId", stringToBase64(connection.connectionId)); // Store connectionId
                                    sessionStorage.setItem("connectionId", stringToBase64(connection.connectionId)); // Store connectionId
                                })
                                .catch(err => console.error("Error starting connection: ", err));

                            connection.invoke("InitializeConnection", PinID).then(() => {
                            }).catch((err) => console.error("Error sending parameters to the hub:", err));
                        }
                    }
                    const otp = get_OTP();
                    // setOtp('123456')
                    setOtp(otp);
                    setTimerOn(true);
                } else {
                    login_Attempt(data.error_description);
                    setLoginAttempt(data.LoginAttempts);
                }
            } else {
                const { data } = await axios.post(Is2FALogin ? 'Account/GetToken' : 'Account/GetTokenNormal', { username: username, password: encryptAndEncodeToBase64(password), UniqueId: uniUserId, UnitId: unitName, AgencyId: LoginAgencyId, grant_type, Attempts: loginAttempt, UserPINID: pinID });

                setLoginAPIData(data);
                if (data.error === '200') {
                    setLoginData({ username: username, password: encryptAndEncodeToBase64(password), UniqueId: uniUserId, UnitId: unitName, AgencyId: LoginAgencyId, grant_type, typeOfAccount });
                    InsertAccessOrRefreshToken(data);
                    setIsValidUser(data?.IsValidUser)
                    setIsSuperAdmin(data?.IsSuperadmin === "1" ? true : false)
                    localStorage.setItem('IsSuperadmin', data['IsSuperadmin'])
                    sessionStorage.setItem('IsSuperadmin', data['IsSuperadmin'])
                    localStorage.setItem('PINID', data['PINID'])
                    sessionStorage.setItem('PINID', data['PINID'])
                    setLoginStatus(data?.IsLoggedIn ? false : true)
                    const PinID = data['PINID'];
                    if (Is2FALogin) {
                        if (PinID && !data?.IsLoggedIn) {
                            if (connection.state === HubConnectionState.Disconnected) {
                                connection.start()
                                    .then(() => {
                                        const encodedId = stringToBase64(connection.connectionId);
                                        localStorage.setItem("connectionId", encodedId);
                                        sessionStorage.setItem("connectionId", encodedId);
                                    })
                                    .then(() => {
                                        console.log("✅ Parameters sent to the server after connection.");
                                    })
                                    .catch(err => {
                                        console.error("❌ Error starting or initializing SignalR:", err);
                                    });
                            } else {
                                console.warn("⚠ SignalR already connected or connecting.");

                                // If already connected, just invoke
                                connection.invoke("InitializeConnection", PinID)
                                    .then(() => {
                                        console.log("✅ Parameters sent to the server after existing connection.");
                                    })
                                    .catch((err) => {
                                        console.error("❌ Error sending parameters to the hub:", err);
                                    });
                            }
                        }
                    }
                    setErrMsg('');
                    setLoginResData(data);

                    const otp = get_OTP();
                    // setOtp('123456')
                    setOtp(otp);
                    setTimerOn(true);
                } else {
                    login_Attempt(data.error_description);
                    setLoginAttempt(data.LoginAttempts);
                }
            }
        } else if (LoginAgencyId !== '' && uniUserId !== '' && password !== '' && unitCheck === true && unitName !== 0) {
            if (IsEncDec) {
                const val = { username, password, UniqueId: uniUserId, UnitId: unitName, AgencyId: LoginAgencyId, grant_type, Attempts: loginAttempt, UserPINID: pinID }
                const EncPostData = await Aes256Encrypt(JSON.stringify(val));
                const postData = { 'EDpostData': EncPostData }
                const { data } = await axios.post(Is2FALogin ? 'Account/GetToken' : 'Account/GetTokenNormal', postData);
                if (data.error === '200') {
                    InsertAccessOrRefreshToken(data)
                    setErrMsg('')
                    setLoginResData(data)
                    setLoginStatus(data?.IsLoggedIn ? false : true)
                    const PinID = data['PINID'];
                    if (Is2FALogin) {
                        if (PinID && !data?.IsLoggedIn) {
                            connection.start()
                                .then(() => {
                                    localStorage.setItem("connectionId", stringToBase64(connection.connectionId)); // Store connectionId
                                    sessionStorage.setItem("connectionId", stringToBase64(connection.connectionId)); // Store connectionId
                                })
                                .catch(err => console.error("Error starting connection: ", err));
                        }
                    }
                    const otp = get_OTP()
                    setOtp(otp)
                    // setOtp('123456')
                    setTimerOn(true)
                } else {
                    login_Attempt(data.error_description);
                    setLoginAttempt(data.LoginAttempts);
                }
            } else {
                const { data } = await axios.post(Is2FALogin ? 'Account/GetToken' : 'Account/GetTokenNormal', { username, password, UniqueId: uniUserId, UnitId: unitName, AgencyId: LoginAgencyId, grant_type, Attempts: loginAttempt, UserPINID: pinID });

                if (data.error === '200') {
                    InsertAccessOrRefreshToken(data)
                    setErrMsg('')
                    setLoginResData(data)
                    setLoginStatus(data?.IsLoggedIn ? false : true)
                    const PinID = data['PINID'];
                    if (Is2FALogin) {
                        if (PinID && !data?.IsLoggedIn) {
                            connection.start()
                                .then(() => {
                                    localStorage.setItem("connectionId", stringToBase64(connection.connectionId)); // Store connectionId
                                    sessionStorage.setItem("connectionId", stringToBase64(connection.connectionId)); // Store connectionId
                                })
                                .catch(err => console.error("Error starting connection: ", err));

                            connection.invoke("InitializeConnection", PinID).then(() => {
                                console.log("Parameters sent to the server after connection.");
                            }).catch((err) => console.error("Error sending parameters to the hub:", err));
                        }
                    }
                    const otp = get_OTP()
                    setOtp(otp)
                    // setOtp('123456')
                    setTimerOn(true)
                } else {
                    login_Attempt(data.error_description)
                    setLoginAttempt(data.LoginAttempts);
                }
            }
        }
    }

    // Verify User
    const verify_User = (e) => {
        e.preventDefault()
        const value = { UserName: username }
        fetchPostData('Personnel/GetData_AgencyLogin', value).then(res => {
            if (res?.length > 0) {
                if (!loginAttemptStatus) {
                    setLoginAttempt(res[0]?.MaxLoginAttempts);
                }

                if (res?.length > 0 && res?.length <= 1) {
                    setAgency(login_changeArrayFormat(res, 'AgencyID', 'Agency_Name', 'PINID', 'Is2FAEnabled'));
                    setLoginAgencyId(res[0]?.AgencyID);
                    setIs2FALogin(res[0]?.Is2FAEnabled);
                } else {
                    setAgency(login_changeArrayFormat(res, 'AgencyID', 'Agency_Name', 'PINID', 'Is2FAEnabled'));
                    setAgencyMenu(true);

                }
            } else {
                if (username?.length > 0) {
                    toastifyError('User Not Found');
                    // logs for wrong Entries  
                    insertLogInfo()
                }
            }
        })
    }

    // api/LoginHistory/Insert_LoginHistory
    // IpAddress
    // UserName
    // Password
    // AccessDate
    // not in use
    // Workstation
    // Description
    // Data
    // ScreenCode
    // CreatedByUserFK

    const insertLogInfo = () => {
        // console.log(ipAddress);
        const logInfo = {
            Password: password?.length > 0 ? encryptAndEncodeToBase64(password) : '',
            UserName: username,
            IpAddress: ipAddress,
            AccessDate: getShowingDateText(new Date()),
            Workstation: '',
            Description: '',
            Data: '',
            ScreenCode: '',
            CreatedByUserFK: '',
        }
        // console.log(logInfo)
        AddDeleteUpadate('/LoginHistory/Insert_LoginHistory', logInfo).then((res) => {
            // console.log(res)
        })
    }

    const handleUserNameInput = (e) => {
        if (e) {
            setUsername(e.target.value);
            if (e.target.value?.length == 0) { setLoginAgencyId(''); setAgency([]); }
        } else {
            if (e.target.value?.length == 0) { setLoginAgencyId(''); setAgency([]); }
        }
    }

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

    const handleCopy = (e) => {
        e.preventDefault();
    };

    const handleMDT_Change = (e) => {
        setIsMDT(e.target.checked);
    }

    const get_unit_list = (id) => {
        const value = {
            AgencyID: id,
            UserName: username,
            Password: password,
        }
        fetchPostData('Personnel/GetData_UnitLogin', value)
            .then(res => {
                if (res) {
                    setUnit(Comman_changeArrayFormat(res, '', ''));
                    setUnitName(res[0]?.UnitId);
                } else { setUnit() }
            })
    }

    // to get the ipAddress of user
    // const get_IpAddress = async () => {
    //     try {
    //         const res = await fetch('https://api.ipify.org');
    //         const data = await res.text()
    //         setIpAddress(data)
    //         // console.log(data)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async function handelContinue() {
        const res = await GoogleAuthServices.logOutFromAllDevices({ UserPINID: loginResData?.PINID.toString() });
        if (res?.status === 200) {
            setLoginStatus(true);
            const PinID = loginResData?.PINID.toString()
            if (PinID && Is2FALogin) {
                connection.start()
                    .then(() => {
                        localStorage.setItem("connectionId", stringToBase64(connection.connectionId)); // Store connectionId
                        sessionStorage.setItem("connectionId", stringToBase64(connection.connectionId)); // Store connectionId
                    })
                    .catch(err => console.error("Error starting connection: ", err));
            }
        }
    }

    return (
        <>
            {/* Login Page */}
            <div className="login-container" id='login' style={{ display: 'block ' }}>
                <div className="auth mobile-login mx-4">
                    <div className="d-flex justify-content-center row" style={{ gap: '20px' }}>
                        <div className="d-flex flex-column col-12 col-md-6" style={{ gap: '10px', background: "#edf2f6", borderRadius: '10px', padding: '30px' }}>
                            <span style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>System Use Notification</span>
                            <span style={{ fontSize: '16px', fontWeight: '400', color: '#000' }}>Access to this system is restricted to authorized users only.  By logging in to this system, you are agreeing to comply with applicable privacy, security, and legal requirements, including but not limited to the CJIS Security Policy, and other relevant federal, state, and local laws.<br />This system may contain criminal justice information (CJI), including sensitive data such as criminal intelligence, investigative information, and personally identifiable information (PII). Unauthorized access or use is prohibited and subject to penalties.<br />Please read and understand the system use policies before proceeding. Your actions on this system are being monitored for compliance and security purposes.</span>
                        </div>
                        <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                            <div className="card-body"  >
                                <form onSubmit={handleLoginSubmit} autoComplete="off">
                                    <div className="text-center ">
                                        <h5 className="m-0 pb-1"> Login to the GoldLine</h5>
                                        <output style={{ fontSize: '14px', color: 'red' }}>{errMSg}</output>
                                        {
                                            logLoader ?
                                                <>
                                                    <output className="spinner-border text-success">
                                                    </output> <br />
                                                    <span>Please Wait...</span>
                                                </>
                                                : ''
                                        }
                                    </div>
                                    <div className="form-check text-center">
                                        {/* <input type="checkbox" onChange={handleMDT_Change} className="form-check-input " id="" name="MDT" defaultValue="" />MDT
                                    <label className="form-check-label" htmlFor="radio2" /> */}
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label form-tab">Username<span className="text-danger">*</span></label>
                                        <input
                                            ref={userNameRef}
                                            type="text"
                                            onCut={handleCopy}
                                            onCopy={handleCopy}
                                            onPaste={handleCopy}
                                            className="form-control"
                                            autoComplete='off'
                                            onChange={(e) => handleUserNameInput(e)}
                                            id="exampleInputEmail1"
                                            value={username}
                                            aria-describedby="emailHelp"
                                            placeholder="Enter Username" />
                                        <span className="text-danger" style={{ fontSize: '13px' }}>{userErr}</span>
                                    </div>
                                    <div className="form-group" style={{ position: 'relative' }}>
                                        <label className="form-label form-tab">Password<span className="text-danger">*</span></label>
                                        <span
                                            onClick={(e) => togglePassword(e)}
                                            onKeyDown={handleKeyDown}
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '3%',
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {/* <button type="button" style={{ cursor: 'pointer', border:'none'}}> */}
                                            <i className={passwordShown ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                                            {/* </button> */}
                                        </span>
                                        <input
                                            type="text"
                                            name="reactPassword"
                                            onChange={(e) => { setPassword(e.target.value) }}
                                            onFocus={verify_User}
                                            style={{ WebkitTextSecurity: passwordShown ? 'none' : 'disc' }}
                                            className="form-control"
                                            placeholder="Password"
                                            onCut={handleCopy}
                                            onCopy={handleCopy}
                                            onPaste={handleCopy}
                                        />
                                    </div>
                                    <p className="text-danger" style={{ fontSize: '13px', marginTop: '-12px' }}>{passErr}</p>
                                    <div className="row form-group">
                                        <div className="col-12" >
                                            <label htmlFor="" className="m-0 p-0 pb-1" style={{ fontWeight: '600' }}>Agency <span className="text-danger">*</span></label>
                                            <Select
                                                name='AgencyID'
                                                value={agency?.filter((obj) => obj.value === LoginAgencyId)}
                                                options={agency}
                                                onFocus={() => setAgencyMenu(true)}
                                                placeholder={agencyPlaceholder}
                                                onChange={(e) => AgencyChanges(e)}
                                                styles={customStylesWithOutColor}
                                                menuIsOpen={agencyMenu}
                                            />
                                            <span className="text-danger" style={{ fontSize: '13px' }}>{agencyErr}</span>
                                        </div>
                                        <div className="col-12 mt-2">
                                            {/* <input type="checkbox" name="IsSuperadmin"
                                            onChange={() => { setUnitCheck(!unitCheck); get_unit_list(LoginAgencyId) }}
                                            id="IsSuperadmin" />
                                        <label className='ml-2' htmlFor="IsSuperadmin">Unit</label> */}
                                        </div>
                                        {
                                            unitCheck ?
                                                <div className="col-12 mt-1">
                                                    <label htmlFor="" className="m-0 p-0 pb-1" style={{ fontWeight: '600' }}>Unit <span className="text-danger">*</span></label>
                                                    <Select
                                                        name='UnitId'
                                                        value={unit?.filter((obj) => obj.value === unitName)}
                                                        options={unit}
                                                        placeholder={unitPlaceholder}
                                                        onChange={(e) => setUnitName(e.value)}
                                                    />
                                                    <span className="text-danger" style={{ fontSize: '13px' }}>{unitErr}</span>
                                                </div>
                                                :
                                                <></>
                                        }
                                    </div>
                                    <div className="form-group">
                                        <div className="col-12" >
                                            <label htmlFor="" className="m-0 p-0 pb-1" style={{ fontWeight: '600' }}>Type of Account <span className="text-danger">*</span></label>
                                            <Select
                                                name="typeOfAccount"
                                                ref={myRef}
                                                options={accType}
                                                onChange={(e) => { setTypeOfAccount(e.value); setTypeMenu(false); userNameRef.current.focus(); }}
                                                value={accType?.find((obj) => obj.value === typeOfAccount)}
                                                styles={customStylesWithOutColor}
                                                onFocus={() => setTypeMenu(true)}
                                                menuIsOpen={typeMenu}
                                            />
                                            <span className="text-danger" style={{ fontSize: '13px' }}>{typeOfAccountErr}</span>
                                        </div>
                                    </div>
                                    <Link to="/forgot-Password" className="float-right small my-2" onClick={() => {
                                    }}>Forgot Password?</Link>
                                    <div>
                                        <button type="submit" className="btn btn-primary btn-block mt-2">Login</button>
                                    </div>
                                    <div className="text-danger text-right mt-1" style={{ fontSize: '12px' }}>
                                        <label> {loginAttemptStatus ? 'You have ' + loginAttempt + ' attempt left' : ''} </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {Is2FALogin ?
                <div id='otp' style={{ display: 'none' }}>
                    {loginResData?.IsLoggedIn && !loginStatus ? <div className="login-container">
                        <div className="auth mobile-login mx-4">
                            <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-4">
                                <div className="text-center mb-2">
                                </div>
                                <div className="card-body w-100 text-center">
                                    <h5 className="m-0">Your account is already logged in.</h5>
                                    <h5 className="m-0">If you choose to continue with the login process, this will log out your account from other devices.</h5>
                                    <div className="alert alert-warning mt-3" role="alert">
                                        <strong>Note:</strong> For security purposes, please reset your password.
                                    </div>
                                    <button type="button" className="btn btn-sm btn-success mr-4" onClick={() => window.location.reload()}>Back</button>
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => handelContinue()}>Continue</button>
                                </div>
                            </div>
                        </div>
                    </div> :
                        <Otp2FA {...{ username, loginResData, otp, setOtp, setTimerOn, timerOn, type, login, isMDT, isSuperAdmin, isValidUser }} />}
                </div> :
                <div id='otp' style={{ display: 'none' }}>
                    <Otp {...{ username, loginResData, otp, setOtp, setTimerOn, timerOn, type, login, isMDT }} />
                </div>}
        </>
    )
}

export default memo(Login)

