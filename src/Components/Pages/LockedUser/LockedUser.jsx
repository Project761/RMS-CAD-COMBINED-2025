import { useContext, useEffect, useState } from 'react'
import { toastifySuccess } from '../../Common/AlertMsg'
import { Decrypt_Id_Name, getShowingDateText, getShowingYearMonthDate } from '../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api'
import { AgencyContext } from '../../../Context/Agency/Index'

const LockedUser = () => {

    const { localStoreArray, get_LocalStorage } = useContext(AgencyContext);

    // Hooks initialize
    const [lockUserData, setLockUserData] = useState([])
    const [reason, setReason] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                get_Locked_User(localStoreArray?.AgencyID)
            }
        }
    }, [localStoreArray])


    // Lock User Data
    const get_Locked_User = (AgencyID) => {
        const val = {
            AgencyID: AgencyID ? AgencyID : '0',
        }
        fetchPostData('LockedUser/GetData_LockedUser', val)
            .then((res) => {
                if (res) setLockUserData(res);
                else setLockUserData()
            })
    }

    // update Lock User
    const update_Locked_User = (e, PINID) => {
        e.preventDefault()
        const val = {
            Reason: reason,
            FailureLock: e.target.checked,
            FailureLockDateTime: getShowingYearMonthDate(new Date),
            PINID: PINID,
        }
        AddDeleteUpadate('LockedUser/LockedUserUpdate', val)
            .then((res) => {
                if (res) {
                    toastifySuccess(res.Message); get_Locked_User()
                }
            })
    }

    return (
        <div className="section-body view_page_design pt-3">
            <div className="row clearfix">
                <div className="col-12 col-sm-12">
                    <div className="card Agency">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12 px-2">
                                    <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0">Locked User</p>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <div className="col-12">
                                        <div className="row mt-4">
                                            <table className="table w-100">
                                                <tr>
                                                    <th>UserName</th>
                                                    <th>DateTime</th>
                                                    <th>Reason</th>
                                                    <th>Unlocked</th>
                                                </tr>
                                                {
                                                    lockUserData?.map((item) => (
                                                        <tr key={item.PINID}>
                                                            <td>{item.UserName}</td>
                                                            <td>{item.FailureLockDateTime ? getShowingDateText(item.FailureLockDateTime) : ''}</td>
                                                            <td>
                                                                <input type="text" value={reason ? reason : item.Reason} onChange={(e) => setReason(e.target.value)} className='form-control' />
                                                            </td>
                                                            <td>
                                                                <input type="checkbox" checked={item.FailureLock} onChange={(e) => update_Locked_User(e, item.PINID)} />
                                                            </td>
                                                        </tr>
                                                    ))
                                                }

                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LockedUser