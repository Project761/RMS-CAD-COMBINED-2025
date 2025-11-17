import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { base64ToString, Decrypt_Id_Name, encryptAndEncodeToBase64 } from "./Utility";
import { get_LocalStoreData } from "../../redux/actions/Agency";
import { useSelector } from "react-redux";
import { fetchPostData } from "../hooks/Api";
import { toastifyError, toastifySuccess } from "./AlertMsg";
import axios from "axios";

const LockRestrictModule = (props) => {

    const { show, openModule, onClose, isLockOrRestrictUrl, isLockedOrRestrict, isLockOrRestrictLevel, isLockOrRestricPINID, isLockOrRestricDate, getPermissionLevelByLock, getPermissionLevelByRestrict } = props;

    // console.log("🚀 ~ LockRestrictModule ~ isLockedOrRestrict:", isLockedOrRestrict)

    // Lock and Unlock
    // api/Restricted/UpdateIncidentLockStatus
    // IncidentID
    // IsLocked
    // LockLevel
    // LockPINID
    // LockDate
    // ModifiedByUserFK

    // api/Restricted/GetPermissionLevelBy_Lock
    // IncidentID
    // OfficerID




    // api/Restricted/UpdateIncidentRestrictedStatus
    // IncidentID
    // IsRestricted
    // RestrictLevel
    // RestrictPINID
    // RestrictDate
    // ModifiedByUserFK

    // api/Restricted/GetPermissionLevelBy_Restricted
    // IncidentID
    // OfficerID




    let navigate = useNavigate();
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem("UniqueUserID") ? Decrypt_Id_Name(sessionStorage.getItem("UniqueUserID"), "UForUniqueUserID") : "";
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param),
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));


    const [groupList, setGroupList] = useState([]);
    const [groupDrpArray, setgroupDrpArray] = useState([]);
    const [agencyPlaceholder] = useState("Select Group");
    const [loginUser, setLoginUser] = useState("");

    // password
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    const [formValues, setFormValues] = useState({
        [isLockedOrRestrict]: '',
        [isLockOrRestrictLevel]: '',
        [isLockOrRestricPINID]: '',
        [isLockOrRestricDate]: '',
        IncidentID: '',
        ModifiedByUserFK: '',

    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        // console.log("🚀 ~ LockRestrictModule ~ localStoreData:", localStoreData)
        if (localStoreData) {
            get_Group_List(localStoreData?.AgencyID, localStoreData.PINID);
            setLoginUser(localStoreData?.LoginUserName || '');
        }
    }, [localStoreData]);


    const get_Group_List = async (AgencyID, PINID) => {
        try {
            const res = await fetchPostData("Group/GetData_GroupByUser", { AgencyID: AgencyID, PINID: PINID });
            // console.log("🚀 ~ get_Group_List ~ res:", res)
            if (res?.length > 0) {
                setgroupDrpArray(formatGroupArray(res, 'GroupName', 'level', 'IsAdmin', 'IsActive', 'GroupID'))
                setGroupList(res)

            } else {
                setGroupList([]);
                setgroupDrpArray([]);

            }
        } catch (error) {
            console.error('There was an error!', error);
            setGroupList([]);
            setgroupDrpArray([]);
        }
    }

    const formatGroupArray = (data, GroupName, GroupID, IsAdmin, IsActive, level) => {
        const formattedData = data?.map((item) => ({
            label: item[GroupName],
            value: item[GroupID],
            IsAdmin: item[IsAdmin],
            IsActive: item[IsActive],
            level: item[level],
        }));
        return formattedData;
    }


    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // const { isLockedOrRestrict, isLockOrRestrictLevel, isLockOrRestricPINID, isLockOrRestricDate, IncidentID } = formValues;
        console.log("🚀 ~ handleLoginSubmit ~ formValues:", formValues)
        if (![isLockedOrRestrict]) {
            toastifyError("Please select group");

        } else if (!password) {
            toastifyError("Please enter password");

        } else {
            // verifyPassword(password)

            const val = {
                username: loginUser || "",
                password: encryptAndEncodeToBase64(password),
                UniqueId: uniqueId,
                UnitId: '',
                AgencyId: localStoreData?.AgencyID || '',
                grant_type: 'password',
                Attempts: 0,
                UserPINID: localStoreData.PINID || ''
            }
            const { data } = await axios.post('Account/GetToken', val);
            // console.log("🚀 ~ verifyPassword ~ data:", data)

            if (data.error === '200') {
                // const value = {
                //     [isLockedOrRestrict]: isLockedOrRestrict,
                //     [isLockOrRestrictLevel]: isLockOrRestrictLevel,
                //     [isLockOrRestricPINID]: isLockOrRestricPINID,
                //     [isLockOrRestricDate]: isLockOrRestricDate,
                //     'IncidentID': IncidentID,
                //     'ModifiedByUserFK': '',
                // }

                // fetchPostData('Restricted/UpdateIncidentLockStatus', formValues).then(res => {
                fetchPostData(isLockOrRestrictUrl, formValues).then(res => {
                    if (res?.length > 0) {
                        toastifySuccess("Lock Status Updated Successfully");
                        getPermissionLevelByLock(IncID, localStoreData?.PINID);
                        getPermissionLevelByRestrict(IncID, localStoreData?.PINID);
                        onClose();

                    } else {


                    }
                })


            } else {
                login_Attempt(data.error_description);

            }
        }
    };

    // Check Login Attempt and Lock Id 
    const login_Attempt = (err) => {
        if (err === 'Invalid UserName and password') {
            toastifyError(err)

        } else {
            console.log("🚀 ~ login_Attempt ~ err:", err)

        }
    }

    // Handlers
    const onChangeDropdown = (e, name) => {
        // console.log("🚀 ~ onChangeDropdown ~ e:", e)
        if (e) {
            if (name === 'LockLevel') {
                setFormValues({
                    ...formValues,
                    [name]: e.value,
                    [isLockedOrRestrict]: openModule === 'Lock' ? true : false,
                    [isLockOrRestricPINID]: localStoreData?.PINID || '',
                    ['IncidentID']: IncID,
                    ['ModifiedByUserFK']: '',
                    ['LockDate']: '',
                });

            } else {
                setFormValues({ ...formValues, [name]: e.value });

            }
        } else {
            setFormValues({ ...formValues, [name]: null });

        }
    }

    if (!show) return null; // Hide modal if not active

    const handleCopy = (e) => {
        e.preventDefault();
    };

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



    // Account/GetToken
    // const verifyPassword = async (password) => {
    //     const val = {
    //         username: 'admin',
    //         password: encryptAndEncodeToBase64(password),
    //         UniqueId: uniqueId,
    //         UnitId: '',
    //         AgencyId: localStoreData?.AgencyID || '',
    //         grant_type: 'password',
    //         Attempts: 0,
    //         UserPINID: localStoreData.PINID || ''
    //     }
    //     const { data } = await axios.post('Account/GetToken', val);
    //     console.log("🚀 ~ verifyPassword ~ data:", data)

    //     if (data.error === '200') {

    //     } else {
    //         login_Attempt(data.error)
    //     }
    // }

    return (
        <div
            className="modal fade"
            style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: "11111" }}
            id="NibrsAllModuleErrorShowModal"
            tabIndex="-1"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
            data-backdrop="false"
        >
            <div className="modal-dialog modal-dialog-centered modal-m">
                <div className="modal-content">
                    <div className="col-12">
                        <div className="card-body">
                            <form onSubmit={handleLoginSubmit} autoComplete="off">
                                {/* Title */}
                                <div className="text-center mb-3">
                                    <h5 className="m-0 pb-2"> Select Group and Enter Password  </h5>
                                </div>

                                {/* Group Select */}
                                <div className="form-group mb-3">
                                    <label className="form-label"> Group </label>
                                    <Select
                                        name={isLockOrRestrictLevel}
                                        options={groupDrpArray}
                                        value={groupDrpArray.find((item) => item.value === formValues.LockLevel)}
                                        onChange={(e) => onChangeDropdown(e, isLockOrRestrictLevel)}
                                        placeholder={agencyPlaceholder}
                                        isClearable
                                    />
                                </div>

                                {/* Login (readonly) */}
                                <div className="form-group mb-3">
                                    <label className="form-label">Login</label>
                                    <input type="text" className="form-control" value={loginUser} readOnly disabled />
                                </div>

                                {/* Password */}
                                <div className="form-group mb-3" style={{ position: "relative" }}>
                                    <label className="form-label"> Password </label>
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
                                        <i className={passwordShown ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                                    </span>
                                    <input
                                        type={"text"}
                                        name="password"
                                        onChange={(e) => { setPassword(e.target.value); }}
                                        style={{ WebkitTextSecurity: passwordShown ? 'none' : 'disc' }}
                                        className="form-control"
                                        placeholder="Password"
                                        autoComplete="off"
                                        onCut={handleCopy}
                                        onCopy={handleCopy}
                                        onPaste={handleCopy}
                                    />
                                </div>

                                <div className=" d-flex justify-content-space-between gap-5" style={{ columnGap: "15px" }}>
                                    <button type="button" data-dismiss="modal" className="btn custom-cancel-btn w-100"
                                        onClick={() => {
                                            onClose();
                                            setFormValues({
                                                ...formValues,
                                                [isLockOrRestrictLevel]: null,
                                                [isLockedOrRestrict]: null,
                                                [isLockOrRestricDate]: null,
                                            })
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="button" className="btn custom-ok-btn w-100" onClick={handleLoginSubmit} >  Ok </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LockRestrictModule;
