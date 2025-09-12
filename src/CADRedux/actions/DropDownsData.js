import { fetchPostData } from '../../Components/hooks/Api';
import { Operator_Drp_Data, Priority_Drp_Data, Zone_Drp_Data, IncidentDispositions_Drp_Data } from '../actionTypes';

export const getData_DropDown_Operator = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('/CAD/Operator_search/Operator', val).then((data) => {
        if (data) {
            dispatch({ type: Operator_Drp_Data, payload: data });
        } else {
            dispatch({ type: Operator_Drp_Data, payload: [] });
        }
    })
}

export const getData_DropDown_Priority = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('/CAD/MasterPriority/GetDataDropDown_Priority', val).then((data) => {
        if (data) {
            dispatch({ type: Priority_Drp_Data, payload: data });
        } else {
            dispatch({ type: Priority_Drp_Data, payload: [] });
        }
    })
}

export const getData_DropDown_Zone = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('/CAD/GeoPetrolZone/GetDataDropDown_Zone', val).then((data) => {
        if (data) {
            dispatch({ type: Zone_Drp_Data, payload: data });
        } else {
            dispatch({ type: Zone_Drp_Data, payload: [] });
        }
    })
}

// export const getData_DropDown_IncidentDispositions = (LoginAgencyID) => async (dispatch) => {
//     const val = { AgencyID: LoginAgencyID }
//     fetchPostData('/CAD/MasterIncidentDispositions/GetDataDropDown_IncidentDispositions', val).then((data) => {
//         if (data) {
//             dispatch({ type: IncidentDispositions_Drp_Data, payload: data });
//         } else {
//             dispatch({ type: IncidentDispositions_Drp_Data, payload: [] });
//         }
//     })
// }


export const getData_DropDown_IncidentDispositions = (payload) => async (dispatch) => {
    fetchPostData('/CAD/MasterIncidentDispositions/GetDataDropDown_IncidentDispositions', payload).then((data) => {
        if (data) {
            dispatch({ type: IncidentDispositions_Drp_Data, payload: data });
        } else {
            dispatch({ type: IncidentDispositions_Drp_Data, payload: [] });
        }
    });
}
