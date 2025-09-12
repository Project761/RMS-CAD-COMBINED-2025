import { Decrypt_Id_Name } from "../../Components/Common/Utility";

import {
    //----------------------------------------Drop_DownsDataArrays-----------------------------------
    Agency_OfficerDrp_Data,

} from "../actionTypes"

const initialState = {
    // All use
    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    agencyOfficerDrpData: [],
}

const ArrestReducer = (state = initialState, action) => {
    switch (action.type) {
        case Agency_OfficerDrp_Data:
            return {
                ...state,
                agencyOfficerDrpData: action.payload

            }
        default: return state
    }
}

export default ArrestReducer
