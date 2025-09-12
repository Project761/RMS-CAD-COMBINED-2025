import { Comman_changeArrayFormat } from '../../Components/Common/ChangeArrayFormat';
import { fetchPostData } from '../../Components/hooks/Api';
import { Missing_Person_All_Data } from '../actionTypes';
import * as api from '../api'


export const GetData_MissingPerson = (IncidentID) => async (dispatch) => {
    const val = { 'IncidentID': IncidentID }
    fetchPostData('MissingPerson/GetData_MissingPerson', val)
        .then((res) => {
            if (res) {
                dispatch({ type: Missing_Person_All_Data, payload: res });
            } else {
                dispatch({ type: Missing_Person_All_Data, payload: [] });
            }
        })
}