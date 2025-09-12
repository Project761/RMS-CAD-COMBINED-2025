import { Decrypt_Id_Name } from "../../Components/Common/Utility";
import { IP_ADDRESS, Login_Agency_State } from "../actionTypes";



const initialState = {

    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    ipAddress: [],
    loginAgencyState: '',
}

const ipReducer = (state = initialState, action) => {
    switch (action.type) {
        case IP_ADDRESS:
            return {  
                ...state,
                ipAddress: action.payload,
            };
        case Login_Agency_State:
            return {
                ...state,
                loginAgencyState: action.payload,
            };
        default:
            return state;
    }
};

export default ipReducer;
