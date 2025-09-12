import { Decrypt_Id_Name } from "../../Components/Common/Utility";

import {
    //----------------------------------------AllUse-----------------------------------
    Unique_ID,
    Local_Store_Data, Incident_ID, Incident_Number, Incident_ReportDate,
    //----------------------------------------AllDrpData-----------------------------------

    //----------------------------------------Property-----------------------------------
    Master_Property_Status, Property_ID, MasterProperty_ID, Master_Vehicle_Status,
    //-----------------------------------------Name--------------------------------------

    Name_Update_Status, NameType_Data

} from "../actionTypes"

const initialState = {
    // All use
    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',

    localStoreData: [],
    incidentId: '', incidentNumber: '', incReportedDate: '',
    //----------------------------------------AllUse-----------------------------------

    //----------------------------------------Property-----------------------------------
    masterPropertyStatus: false, propertyId: '', masterPropertyId: '',

    //----------------------------------------Name---------------------------------------

    nameUpdateStatus: false, nameTypeData: [],

}

const AgencyReducer = (state = initialState, action) => {
    switch (action.type) {
        case Unique_ID:
            return {
                ...state,
                uniqueId: action.payload
            }
        case Local_Store_Data:
            return {
                ...state,
                localStoreData: action.payload
            }
        case Incident_ID:
            return {
                ...state,
                incidentId: action.payload
            }
        case Incident_Number:
            return {
                ...state,
                incidentNum: action.payload
            }
        case Incident_ReportDate:
            return {
                ...state,
                incReportedDate: action.payload
            }

        // --------------- vehicle --------------------------------
        case Master_Vehicle_Status:
            return {
                ...state,
                masterVehicleStatus: action.payload
            }
        //----------------------------------------Property-----------------------------------
        case Master_Property_Status:
            return {
                ...state,
                masterPropertyStatus: action.payload
            }
        case Property_ID:
            return {
                ...state,
                propertyId: action.payload
            }
        case MasterProperty_ID:
            return {
                ...state,
                masterPropertyId: action.payload
            }
        //----------------------------------------Name--------------------------------------------
        case NameType_Data:
            return {
                ...state,
                nameTypeData: action.payload
            }
        case Name_Update_Status:
            return {
                ...state,
                nameUpdateStatus: action.payload
            }

        default: return state
    }
}

export default AgencyReducer
