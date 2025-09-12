import { Decrypt_Id_Name } from "../../Components/Common/Utility";

import {
    //----------------------------------------Drop_DownsDataArrays-----------------------------------
    Agency_OfficerDrp_Data, VehicleSearch_Modal_Status, VehicleSearch_Type, Vehicle_Search_Data,

} from "../actionTypes"

const initialState = {
    // All use
    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    agencyOfficerDrpData: [], vehicleSearchModalStatus: [], vehicleSearchType: [], vehicleSearchData: [],
}

const VehicleReducer = (state = initialState, action) => {
    switch (action.type) {
        case VehicleSearch_Modal_Status:
            return {
                ...state,
                vehicleSearchModalStatus: action.payload
            }
        case Vehicle_Search_Data:
            return {
                ...state,
                vehicleSearchData: action.payload
            }
        case Agency_OfficerDrp_Data:
            return {
                ...state,
                agencyOfficerDrpData: action.payload
            }
        default: return state
    }
}

export default VehicleReducer
