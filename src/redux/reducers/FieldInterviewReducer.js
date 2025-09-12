import { Decrypt_Id_Name } from "../../Components/Common/Utility";

import { FieldInterview_All_Data, } from "../actionTypes"

const initialState = {
    // All use
    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    FieldInterviewData: [],
}

const FieldInterviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case FieldInterview_All_Data:
            return {
                ...state,
                FieldInterviewData: action.payload
            }
        default: return state
    }
}

export default FieldInterviewReducer
