import { useContext, useEffect, useState } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Decrypt_Id_Name } from '../../../../Common/Utility';

const Offender = () => {

    const { localStoreArray, get_LocalStorage, get_NameOffender_Count } = useContext(AgencyContext);


    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', MasterNameID: '', NameID: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    useEffect(() => {

        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                if (localStoreArray.NameID) {
                    get_NameOffender_Count(localStoreArray?.NameID)
                }
            }
        }
    }, [localStoreArray])

    return (
        <>
            <div className="col-md-12 col-lg-12 mt-2 pt-1">
            </div>
        </>
    )

}

export default Offender