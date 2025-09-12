import axios from "axios";
class CallTakerServices {
  getReceiveSource = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/CallTakerReceiveSource/GetData_ReceiveSource`,
        payload
      );
    }
    console.warn("payload not provided, CallTakerServices.getReceiveSource");
    return null;
  };

  getPropertyVehiclePlateType = async ({ queryKey }) => {
    const [_key, { vehiclePlateTypePayload }] = queryKey;
    if (vehiclePlateTypePayload) {
      return await axios.post(`/CAD/CallTakerVehiclePlateType/GetData_PropertyVehiclePlateType`, vehiclePlateTypePayload);
    }
    console.warn("payload not provided, CallTakerServices.getPropertyVehiclePlateType");
    return null;
  };

  getNameReasonCode = async ({ queryKey }) => {
    const [_key, { payloadReasonCode }] = queryKey;
    if (payloadReasonCode) {
      return await axios.post(
        `/CAD/DispatcherNameReasonCode/GetDataDropDown_NameReasonCode`,
        payloadReasonCode
      );
    }
    console.warn("payload not provided, CallTakerServices.getNameReasonCode");
    return null;
  };

  getTagYear = async () => {
    return await axios.post(`/CAD/CallTakerVehiclePlateType/GetData_TagYear`);
  };

  getAptSuiteNo = async ({ queryKey }) => {
    const [_key, { aptSuiteNoPayload }] = queryKey;
    if (aptSuiteNoPayload) {
      return await axios.post(`/CAD/GeoLocation/Get_GeoLocationApartmentNo`, aptSuiteNoPayload);
    }
    console.warn("payload not provided, CallTakerServices.getAptSuiteNo");
    return null;
  };

  getIncidentByCrimeAndCFS = async ({ queryKey }) => {
    const [_key, { payload }] = queryKey;
    if (queryKey) {
      return await axios.post(`/CAD/Incident/GetIncidentByCrimeAndCFS`, queryKey[1]);
    }
    console.warn("payload not provided, CallTakerServices.getIncidentByCrimeAndCFS");
    return null;
  };

  insertIncident = async (payload) => {
    if (payload) {
      return await axios.post(`/CAD/CallTakerIncident/InsertIncident`, payload);
    }
    console.warn("payload not provided, CallTakerServices.insertIncident");
    return null;
  };

  insertRIVSIncident = async (payload) => {
    if (payload) {
      return await axios.post(`/CAD/RIVS/InsertRIVSIncident`, payload);
    }
    console.warn("payload not provided, CallTakerServices.insertRIVSIncident");
    return null;
  };

  // insertIncident = async (payload) => {
  //   if (payload) {
  //     return await axios.post(`/CAD/CallTakerIncident/InsertIncident`, payload);
  //   }
  //   console.warn("payload not provided, CallTakerServices.insertIncident");
  //   return null;
  // };

  // insertName = async (payload) => {
  //   if (payload) {
  //     return await axios.post(`/CAD/CallTakerMasterName/InsertIncidentNEW`, payload);
  //   }
  //   console.warn("payload not provided, CallTakerServices.insertName");
  //   return null;
  // };



  // searchName = async ({ queryKey }) => {
  //   const [_key, { payload123 }] = queryKey;
  //   if (payload123) {
  //     return await axios.post(
  //       `/CallTakerMasterName/Search_MasterName`,
  //       payload123
  //     );
  //   }
  //   console.warn("payload not provided, CallTakerServices.searchName");
  //   return null;
  // };

  searchName = async (nameCallTaker) => {
    return await axios.post(`/CAD/CallTakerName/Search_Name`, nameCallTaker);
  };

  searchVehicle = async ({ queryKey }) => {
    const [_key, { payload }] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/CallTakerPropertyVehicle/Search_Vehicle`,
        payload
      );
    }
    console.warn("payload not provided, CallTakerServices.searchVehicle");
    return null;
  };

  updateIncident = async (payload) => {
    if (payload) {
      return await axios.post(`/CAD/CallTakerIncident/UpdateIncident`, payload);
    }
    console.warn("payload not provided, CallTakerServices.updateIncident");
    return null;
  };

  // flag
  insertFlag = async (payload) => {
    if (payload) {
      return await axios.post(`/CAD/Flag/UpsertFlag`, payload);
    }
    console.warn("payload not provided, CallTakerServices.insertFlag");
    return null;
  };

  getFlag = async ({ queryKey }) => {
    const [_key, { flagPayload }] = queryKey;
    if (flagPayload) {
      return await axios.post(
        `/CAD/Flag/GetFlag`,
        flagPayload
      );
    }
    console.warn("flagPayload not provided, CallTakerServices.getFlag");
    return null;
  };

  getFlagIncident = async ({ queryKey }) => {
    const [_key, { payload }] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/Flag/FlagIncident`,
        payload
      );
    }
    console.warn("flagPayload not provided, CallTakerServices.getFlagIncident");
    return null;
  };

  insertCallTakerDoc = async (payload) => {
    if (payload) {
      return await axios.post(`/IncidentDocumentManagement/Insert_IncidentMultipleDocManagement`, payload);
    }
    console.warn("payload not provided, CallTakerServices.insertCallTakerDoc");
    return null;
  };

}

const instance = new CallTakerServices();

export default instance;
