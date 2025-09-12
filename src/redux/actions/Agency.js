import { Incident_ReportDate, IP_ADDRESS, Local_Store_Data, Login_Agency_State, NameType_Data, } from '../actionTypes';
import * as api from '../api'
import { threeColArray } from '../../Components/Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../Components/hooks/Api';

//----------get the All  local Array data  with unique ID ------------Dk-> 
export const insert_LocalStoreData = (formData, Tokens) => async (dispatch) => {
    try {
        AddDeleteUpadate('LocalStorage/ObjectInsert_LocalStorage', formData).then((res) => {
            if (res.success) {
                // console.log(res)
            }
        })
        dispatch({ type: Local_Store_Data, payload: Tokens });
        dispatch({ type: Login_Agency_State, payload: Tokens?.StateCode });
    } catch (error) {
        dispatch({ type: Local_Store_Data, payload: Tokens });
    }
};

//----------get the All  local Array data  with unique ID ------------Dk->   
export const get_LocalStoreData = (UniqueId) => async (dispatch) => {
    const val = { UniqueId: UniqueId };
    fetchPostData('LocalStorage/GetData_UniqueLocalStorage', val).then((data) => {

        if (data) {
            dispatch({ type: Local_Store_Data, payload: data[0] });
            dispatch({ type: Login_Agency_State, payload: data[0]?.StateCode });
        } else {
            dispatch({ type: Local_Store_Data, payload: [] });
        }
    })
    // try {
    //     const data = await api.get_LocalStoreData(val);
    //     const TextData = JSON.parse(data?.data?.data);
    //     const dataObj = TextData?.Table[0]
    //     // console.log("get Local data", dataObj)
    //     dispatch({ type: Local_Store_Data, payload: dataObj });
    // } catch (error) {
    //     dispatch({ type: Local_Store_Data, payload: [] });
    // }
};

export const get_Inc_ReportedDate = (ID) => async (dispatch) => {
    const val = { IncidentID: ID };
    fetchPostData('Incident/GetDataReportedDate', val).then((data) => {
        if (data) {
            dispatch({ type: Incident_ReportDate, payload: data[0]?.ReportedDate });
        } else {
            dispatch({ type: Incident_ReportDate, payload: [] });
        }
    })
    // try {
    //     const data = await api.get_Inc_ReportedDate(val);
    //     const TextData = JSON.parse(data?.data?.data);
    //     const dataObj = TextData?.Table[0]
    //     dispatch({ type: Incident_ReportDate, payload: dataObj?.ReportedDate });
    // } catch (error) {
    //     dispatch({ type: Incident_ReportDate, payload: [] });
    // }
};

export const get_NameTypeData = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('NameType/GetDataDropDown_NameType', val).then((data) => {
        if (data) {
            dispatch({ type: NameType_Data, payload: threeColArray(data, 'NameTypeID', 'Description', 'NameTypeCode') });
        } else {
            dispatch({ type: NameType_Data, payload: [] });
        }
    })
    // try {
    //     let res = await api.get_NameTypeData(val);
    //     let TextData = JSON.parse(res?.data?.data);
    //     let dataObj = TextData?.Table
    //     dispatch({ type: NameType_Data, payload: threeColArray(dataObj, 'NameTypeID', 'Description', 'NameTypeCode') });
    // } catch {
    //     dispatch({ type: NameType_Data, payload: [] });
    // }
}

// DS -----------------------------------------
export const fetchIpAddress = () => async (dispatch) => {
    try {
        const res = await fetch('https://api.ipify.org');
        const data = await res.text();
        if (data) {
            dispatch({ type: IP_ADDRESS, payload: data });
        } else {
            dispatch({ type: IP_ADDRESS, payload: [] });
        }
    } catch (error) {
        console.error('Error fetching IP Address:', error);
    }
};

