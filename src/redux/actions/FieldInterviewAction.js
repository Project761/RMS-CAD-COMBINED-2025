import { Comman_changeArrayFormat } from '../../Components/Common/ChangeArrayFormat';
import { fetchPostData } from '../../Components/hooks/Api';
import { FieldInterview_All_Data } from '../actionTypes';

import * as api from '../api'


export const get_FieldInterview_Data = (incId) => async (dispatch) => {
    const val = { 'IncidentID': incId }
    fetchPostData('FieldInterview/GetData_FieldInterview', val)
        .then((res) => {
            if (res) {
                dispatch({ type: FieldInterview_All_Data, payload: res });
            } else {
                dispatch({ type: FieldInterview_All_Data, payload: [] });
            }
        })
}
