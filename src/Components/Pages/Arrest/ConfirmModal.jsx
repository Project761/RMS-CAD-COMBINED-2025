import { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AgencyContext } from '../../../Context/Agency/Index'
import MasterNameModel from '../MasterNameModel/MasterNameModel'
import { useDispatch } from 'react-redux'
import { Decrypt_Id_Name, base64ToString } from '../../Common/Utility'
import { get_LocalStoreData } from '../../../redux/actions/Agency'
import { useSelector } from 'react-redux'
import { fetchPostData } from '../../hooks/Api'

const ConfirmModal = (props) => {

    const { showModal, setShowModal, arresteeChange, possessionID, value, setValue, setErrors } = props

    const { setIncStatus, updateCount, setUpdateCount, } = useContext(AgencyContext);

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [possenSinglData, setPossenSinglData] = useState([])
    const type = "ArrestMod"

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var NameID = query?.get("NameID");
    var MasterNameID = query?.get('MasterNameID');
    var IncID = query?.get('IncId');
    var NameStatus = query?.get('NameStatus');
    var openPage = query?.get('page');

    let DecNameID = 0, DecMasterNameID = 0, DecIncID = 0;

    if (!NameID) NameID = 0;
    else DecNameID = parseInt(base64ToString(NameID));
    if (!MasterNameID) MasterNameID = 0;
    else DecMasterNameID = parseInt(base64ToString(MasterNameID));
    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));


    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');


    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);

    const GetSingleData = (nameID) => {
        const val = { 'NameID': nameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setPossenSinglData(res);
            } else {
                setPossenSinglData([]);
            }
        })
    }

    const yesChange = () => {
        setIncStatus(true); setUpdateCount(updateCount + 1); setNameModalStatus(true)
        if (openPage != 'ArrestSearch') {
            GetSingleData(possessionID);
        } else {
            GetSingleData(possessionID);
        }
        setShowModal(false);
    }



    return (
        <>
            {
                showModal &&
                <div className="modal fade show" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="myModal" tabIndex="-1" aria-labelledby="exampleModalLabel">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ backgroundColor: 'aliceblue' }} >
                            <div className="box text-center py-4">
                                <h5 className="modal-title  " style={{ color: 'cadetblue', fontWeight: '700' }} id="exampleModalLabel">
                                    {/* {!arresteeChange?.LastName && 'LastName,'}
                                    {!arresteeChange?.AgeFrom && 'Age'}
                                    {!arresteeChange?.Race_Description && ' Race,'}
                                    {!arresteeChange?.Gendre_Description && ' Gender, '} */}
                                    {
                                        [
                                            !arresteeChange?.LastName && 'LastName',
                                            !arresteeChange?.AgeFrom && 'Age',
                                            !arresteeChange?.Race_Description && 'Race',
                                            !arresteeChange?.Gendre_Description && 'Gender'
                                        ]
                                            .filter(Boolean)
                                            .join(', ')
                                    }
                                    {/* <span style={{ marginLeft: '4px' }} >
                                        can't be Empty
                                    </span> */}
                                    <span style={{ marginLeft: '4px' }} >
                                        {
                                            (
                                                !arresteeChange?.LastName ||
                                                !arresteeChange?.AgeFrom ||
                                                !arresteeChange?.Race_Description ||
                                                !arresteeChange?.Gendre_Description
                                            ) && "can't be empty"
                                        }
                                    </span>
                                </h5>
                                <div className="btn-box mt-2" data-toggle="modal" data-target="#MasterModal" >
                                    <span to={''} >
                                        <button type="button" onClick={() => { yesChange() }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Yes</button>
                                    </span>
                                    <button type="button" onClick={() => {
                                        setValue(pre => { return { ...pre, ['ArresteeID']: '' } });
                                        setErrors(pre => { return { ...pre, ['ArresteeIDError']: '' } })
                                        setShowModal(false);
                                    }} className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal"> No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <MasterNameModel {...{ type, value, setValue, nameModalStatus, possenSinglData, setNameModalStatus, possessionID, loginPinID, loginAgencyID, setPossenSinglData, GetSingleData }} />
        </>
    )
}

export default ConfirmModal;
