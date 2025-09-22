import { toastifyError } from '../../Components/Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../Components/Common/ChangeArrayFormat';
import { ScreenPermision, fetchPostData } from '../../Components/hooks/Api';
import { Agency_OfficerDrp_Data, Agency_Officer_FullName_Drp_Data, INC_NO_Exist_Status, INC_NO_Genrate_Status, Report_App_Officer_Drp_Data, Screen_Permissions } from '../actionTypes';
import * as api from '../api'

// IncidentID
// AgencyID
export const get_AgencyOfficer_Data = (ID, IncID) => async (dispatch) => {
    // --------------------------old code change by Dinesh--------------------------------
    // const val = { AgencyID: ID, IncidentID: IncID ? IncID : 0 };
    const val = { AgencyID: ID, IncidentID: 0 };

    fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
        // console.log("🚀 ~ get_AgencyOfficer_Data ~ data:", data)
        if (data) {
            dispatch({ type: Agency_OfficerDrp_Data, payload: Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency') });
            dispatch({ type: Agency_Officer_FullName_Drp_Data, payload: Comman_changeArrayFormat(data, 'PINID', 'FullName') });
        } else {
            dispatch({ type: Agency_OfficerDrp_Data, payload: [] });
            dispatch({ type: Agency_Officer_FullName_Drp_Data, payload: [] });
        }
    })
};

export const get_Report_Approve_Officer_Data = (ID, PinID) => async (dispatch) => {
    const val = { AgencyID: ID, 'PINID': PinID };
    fetchPostData('IncidentNarrativeReport/GetDropDown_ReportApprovedPersonnel', val).then((data) => {
        if (data) {

            dispatch({ type: Report_App_Officer_Drp_Data, payload: Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency') });
        } else {
            dispatch({ type: Report_App_Officer_Drp_Data, payload: [] });
        }
    })
};


export const get_ScreenPermissions_Data = (code, LoginAgencyID, PinID) => async (dispatch) => {
    ScreenPermision(code, LoginAgencyID, PinID).then(res => {
        if (res) {
            dispatch({ type: Screen_Permissions, payload: res });
        } else {
            dispatch({ type: Screen_Permissions, payload: [] });
        }
    });
};
