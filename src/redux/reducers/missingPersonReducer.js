import { Decrypt_Id_Name } from "../../Components/Common/Utility";

import {
    Missing_Person_All_Data,
} from "../actionTypes"

const initialState = {
    // All use
    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    MissingPersonAllData: [],
}

const MissingPersonReducer = (state = initialState, action) => {
    switch (action.type) {
        case Missing_Person_All_Data:
            return {
                ...state,
                MissingPersonAllData: action.payload
            }
        default: return state
    }
}

export default MissingPersonReducer
