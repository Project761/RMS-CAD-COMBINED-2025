// const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });
// const API = axios.create({ baseURL: "https://rmsapi2.arustu.com/api" });

import axios from "axios";

// const API = axios.create({ baseURL: process.env.REACT_APP_DOMAIN_URL_KEY });
// const API = axios.create({ baseURL: "https://rmsapi2.arustu.com/api" });

export const get_LocalStoreData = async (formData) => {
    return await axios.post('LocalStorage/GetData_UniqueLocalStorage', formData);
}

export const insert_LocalStoreData = async (formData) => {
    return await axios.post('LocalStorage/ObjectInsert_LocalStorage', formData);
}

export const get_Inc_ReportedDate = async (formData) => {
    return await axios.post('Incident/GetDataReportedDate', formData);
}

//----------------------------------------Property-----------------------------------
export const get_PropertyTypeData = async (formData) => {
    return await axios.post('PropertyCategory/GetDataDropDown_PropertyCategory', formData);
}

//----------------------------------------DropDownData-----------------------------------
export const get_DLStateDrpData = async () => {
    return await axios.get('State_City_ZipCode/GetData_State');
}

export const get_NameTypeData = async (formData) => {
    return await axios.post('NameType/GetDataDropDown_NameType', formData);
}
