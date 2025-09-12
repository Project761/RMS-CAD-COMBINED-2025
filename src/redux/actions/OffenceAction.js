import { Comman_changeArrayFormat } from '../../Components/Common/ChangeArrayFormat';
import { fetchPostData } from '../../Components/hooks/Api';
import { Agency_OfficerDrp_Data } from '../actionTypes';
import * as api from '../api'


export const get_AgencyOfficer_Data = (ID) => async (dispatch) => {
    const val = { AgencyID: ID };
    fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
        if (data) {
            dispatch({ type: Agency_OfficerDrp_Data, payload: Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency') });
        } else {
            dispatch({ type: Agency_OfficerDrp_Data, payload: [] });
        }
    })
};