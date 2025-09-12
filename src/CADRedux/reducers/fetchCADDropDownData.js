import { Operator_Drp_Data, Priority_Drp_Data, Zone_Drp_Data, IncidentDispositions_Drp_Data } from "../actionTypes"

const initialState = {
    OperatorDrpData: [],
    PriorityDrpData: [],
    ZoneDrpData: [],
    IncidentDispositionsDrpData: [],
}

const CADDropDownReducer = (state = initialState, action) => {
    switch (action.type) {
        case Operator_Drp_Data:
            return {
                ...state,
                OperatorDrpData: action.payload
            }
        case Priority_Drp_Data:
            return {
                ...state,
                PriorityDrpData: action.payload
            }
        case Zone_Drp_Data:
            return {
                ...state,
                ZoneDrpData: action.payload
            }
        case IncidentDispositions_Drp_Data:
            return {
                ...state,
                IncidentDispositionsDrpData: action.payload
            }
        default: return state
    }
}

export default CADDropDownReducer