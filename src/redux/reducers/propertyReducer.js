import { Decrypt_Id_Name } from "../../Components/Common/Utility";

import {
    //----------------------------------------Drop_DownsDataArrays-----------------------------------
    PropertyMainModule_Data, Property_Search_Data, PropertySearch_Type, PropertySearch_Modal_Status,

} from "../actionTypes"

const initialState = {
    // All use
    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    propertyMainModuleData: [], propertySearchData: [], propertySearchType: '', propertySearchModalStatus: false,

}

const PropertyReducer = (state = initialState, action) => {
    switch (action.type) {
        case PropertySearch_Modal_Status:
            return {
                ...state,
                propertySearchModalStatus: action.payload
            }
        case PropertySearch_Type:
            return {
                ...state,
                propertySearchType: action.payload
            }
        case Property_Search_Data:
            return {
                ...state,
                propertySearchData: action.payload
            }
        case PropertyMainModule_Data:
            return {
                ...state,
                propertyMainModuleData: action.payload
            }
        default: return state
    }
}

export default PropertyReducer
