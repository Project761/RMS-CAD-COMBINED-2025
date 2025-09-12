import axios from "axios";
class MonitorServices {

  getSingleIncident = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload?.IncidentID) {
      return await axios.post(`/CAD/Monitor/MonitorIncidentByID`, payload);
    }
    console.warn("payload not provided, MonitorServices.getSingleIncident");
    return null;
  };

  GetComments = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(`/CAD/DispatcherComments/GetData_Comments`, payload);
    }
    console.warn("payload not provided, MonitorServices.getSingleIncident");
    return null;
  };

  insertComment = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/DispatcherComments/Insert_Comments`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.insertComment");
    return null;
  };

  getResourceView = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(`/CAD/Monitor/MonitorResourceView`, payload);
    }
    console.warn("payload not provided, MonitorServices.getResourceView");
    return null;
  };

  getResourceViewByID = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Monitor/MonitorResourceView`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.getResourceViewByID");
    return null;
  };


  getOnOffDuty = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(`/CAD/MonitorOnOffDuty/GetOnOffDuty`, payload);
    }
    console.warn("payload not provided, MonitorServices.getOnOffDuty");
    return null;
  };

  getIncidentsView = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    // if (payload?.AgencyID) {
    return await axios.post(`/CAD/Monitor/MonitorIncidentsView`, payload);
    // }
    // console.warn("payload not provided, MonitorServices.getIncidentsView");
    // return null;
  };

  updateMonitorIncident = async (payload) => {
    if (payload) {
      return await axios.post(`/CAD/Monitor/MonitorIncidentUpdate`, payload);
    }
    console.warn("payload not provided, MonitorServices.updateMonitorIncident");
    return null;
  };

  RMSIncidentNumberUpdate = async (payload) => {
    if (payload) {
      return await axios.post(`/CAD/DispatcherRMSIncident/RMSIncidentNumberUpdate`, payload);
    }
    console.warn("payload not provided, MonitorServices.RMSIncidentNumberUpdate");
    return null;
  };

  changeOnOffDuty = async (payload) => {
    if (payload) {
      return await axios.post(`/CAD/MonitorOnOffDuty/ChangeOnOffDuty`, payload);
    }
    console.warn("payload not provided, MonitorServices.ChangeOnOffDuty");
    return null;
  };

  getResourceOnDutyHistory = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/ResourceHistory/GetResourceOnDutyHistory`, payload);
    }
    console.warn("payload not provided, MonitorServices.getResourceOnDutyHistory");
    return null;
  };

  getResourceHistory = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/ResourceHistory/GetResourceHistory`, payload);
    }
    console.warn("payload not provided, MonitorServices.getResourceHistory");
    return null;
  };

  getOffSetTime = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/CallTakerIncident/GetOffSetTime`, payload);
    }
    console.warn("payload not provided, MonitorServices.getOffSetTime");
    return null;
  };

  insertFinishClear = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Clear/ClearUpdate`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.insertFinishClear");
    return null;
  };

  insertUserTable = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/UserTableColumns/Insert_UserTable`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.insertUserTable");
    return null;
  };

  getDataUserTable = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/UserTableColumns/GetData_UserTable`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.getDataUserTable");
    return null;
  };

  insertUserTableResourse = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/UserTableColumns/Insert_UserTableResourse`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.insertUserTableResourse");
    return null;
  };

  getDataUserTableResourse = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/UserTableColumns/GetData_UserTableResourse`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.getDataUserTableResourse");
    return null;
  };

  getQueueCallCount = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/CallTakerIncident/GetQueueCallCount`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.getQueueCallCount");
    return null;
  };

  insertPAR = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/PAR/PAR`,
        payload
      );
    }
    console.warn("payload not provided, MonitorServices.insertPAR");
    return null;
  };
}

const instance = new MonitorServices();

export default instance;
