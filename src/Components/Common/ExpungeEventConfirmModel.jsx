import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Decrypt_Id_Name, } from '../Common/Utility'
import { get_LocalStoreData } from '../../redux/actions/Agency'
import { useSelector } from 'react-redux'

const ExpungeEventConfirmModel = (props) => {
    const { eventConfirm, showModal, arrestId, handleCloseModal, seteventConfirm, func } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    const handleYesClick = () => {
        // Close the modal first
        handleCloseModal();

        // Execute the function
        func();
    };

    console.log(eventConfirm)
    return (
        eventConfirm ? (
            <div className="modal fade show" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="EventConfirm" tabIndex="-1" aria-labelledby="exampleModalLabel">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ backgroundColor: 'aliceblue' }} >
                        <div className="box text-center py-4">
                            <h5 className="modal-title" style={{ color: 'cadetblue', fontWeight: '700' }} id="exampleModalLabel">
                                Are you sure you want to Delete the Event
                            </h5>
                            <div className="btn-box mt-2" data-toggle="modal" data-target="#MasterModal">
                                <button 
                                    type="button" 
                                    data-toggle="modal" data-target="#myModal"
                                    className="btn btn-sm text-white" 
                                    style={{ background: "#ef233c" }}
                                    // Ensure data-toggle and data-target are set conditionally after the modal close
                                    // {...(showModal && arrestId ? { 'data-toggle': 'modal', 'data-target': '#myModal' } : {})}
                                    onClick={handleYesClick}  // Call the updated function
                                >
                                    Yes
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-secondary ml-2" 
                                    data-dismiss="modal" 
                                    onClick={() => seteventConfirm(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    );
}

export default ExpungeEventConfirmModel;
