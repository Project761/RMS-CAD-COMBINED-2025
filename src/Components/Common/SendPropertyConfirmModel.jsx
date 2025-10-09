import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Decrypt_Id_Name, } from '../Common/Utility'
import { get_LocalStoreData } from '../../redux/actions/Agency'
import { useSelector } from 'react-redux'
const SendPropertyConfirmModel = (props) => {

    const { showModal, setShowModal, func, onConfirm, value , victimCountStatus, offenderCountStatus } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);


    return (
        showModal ? (
            <div className="modal fade show" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="myModal" tabIndex="-1" aria-labelledby="exampleModalLabel">
               <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel"> {value.IsSendToPropertyRoom ? 'Are you sure you want to save this by sending property to the Property room' : 'Are you sure you want to save this by sending property to the Non-Property room'}</h5>
                                    <div className="btn-box mt-4">
                                        <span >
                                            <button type="button" data-dismiss="modal" className="btn btn-sm text-white" onClick={(e) => {
                                                func(e); 
                                                setShowModal(false);
                                            }} style={{ background: "#ef233c" }} >Save</button>
                                        </span>
                                        <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal" onClick={() => {  setShowModal(false); }}> Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>
        ) : null
    );
}

export default SendPropertyConfirmModel;
