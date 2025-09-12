import { combineReducers } from "redux";
import AgencyReducer from "./fetchStoreData";
import DropDownReducer from "./fetchDropDownData";
import IncidentReducer from "./incidentReducer";
import OffenceReducer from "./offenceReducer";
import NameReducer from "./nameReducer";
import VehicleReducer from "./vehicleReducer";
import PropertyReducer from "./propertyReducer";
import ArrestReducer from "./arrestReducer";
import MissingPersonReducer from "./missingPersonReducer";
import FieldInterviewReducer from "./FieldInterviewReducer";
import ipReducer from "./ipReducer";

// CAD
import CADDropDownReducer from "../../CADRedux/reducers/fetchCADDropDownData";


export default combineReducers({
    Agency: AgencyReducer,
    DropDown: DropDownReducer,
    Incident: IncidentReducer,
    Offence: OffenceReducer,
    Name: NameReducer,
    Vehicle: VehicleReducer,
    Property: PropertyReducer,
    Arrest: ArrestReducer,
    MissingPerson: MissingPersonReducer,
    FieldInterview: FieldInterviewReducer,
    Ip: ipReducer,

    // CAD
    CADDropDown: CADDropDownReducer,
});    