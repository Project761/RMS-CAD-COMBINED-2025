import { Decrypt_Id_Name, getUcrReportUrl } from "../../Components/Common/Utility";
import { ScreenPermision } from "../../Components/hooks/Api";
import moment from 'moment-timezone'

import {
    //----------------------------------------Drop_DownsDataArrays-----------------------------------
    Agency_OfficerDrp_Data, Screen_Permissions, Report_App_Officer_Drp_Data,

} from "../actionTypes"

const url = window.location.origin;
// console.log("🚀 ~ url:", url);

const initialState = {
    // All use
    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    agencyOfficerDrpData: [], effectiveScreenPermission: [], reportApproveOfficer: [],
    // ucrReportSexualAssaultUrl: getUcrReportUrl('https://rmsgoldline.com', 'sexualAssault'),
    // ucrReportFamilyViolanceUrl: getUcrReportUrl('https://rmsgoldline.com', 'FamilyViolence'),
    // ucrReportHateCrimeUrl: getUcrReportUrl('https://rmsgoldline.com', 'hateCrime'),
    ucrReportSexualAssaultUrl: getUcrReportUrl(url, 'sexualAssault'),
    ucrReportFamilyViolanceUrl: getUcrReportUrl(url, 'FamilyViolence'),
    ucrReportHateCrimeUrl: getUcrReportUrl(url, 'hateCrime'),

}

const IncidentReducer = (state = initialState, action) => {
    switch (action.type) {
        case Agency_OfficerDrp_Data:
            return {
                ...state,
                agencyOfficerDrpData: action.payload
            }
        case Screen_Permissions:
            return {
                ...state,
                effectiveScreenPermission: action.payload
            }
        case Report_App_Officer_Drp_Data:
            return {
                ...state,
                reportApproveOfficer: action.payload
            }
        default: return state
    }
}

export default IncidentReducer
