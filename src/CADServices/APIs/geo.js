import axios from "axios";
class GeoServices {
  getGeoZone = async ({ queryKey }) => {
    const [_key, payload] = queryKey;
    if (payload) {
      return await axios.post(`/CAD/GeoPetrolZone/GetData_Zone`, payload);
    }
    console.warn("zoneType not provided, GeoServices.getGeoZone");
    return null;
  };

  getPremise = async ({ queryKey }) => {
    const [_key, { payload }] = queryKey;
    // if (payload) {
    return await axios.post(`/CAD/GeoPremiseType/GetData_Premise`, payload);
    // }
    // console.warn("payload not provided, GeoServices.getPremise");
    // return null;
  };

  getFlag = async ({ queryKey }) => {
    const [_key, { payload }] = queryKey;
    // if (payload) {
    return await axios.post(`/CAD/GeoFlage/GetData_Flag`, payload);
    // }
    // console.warn("payload not provided, GeoServices.getFlag");
    // return null;
  };

  insertLocation = async (locationPayload) => {
    // const [_key, { payload }] = queryKey;

    // if (payload) {
    return await axios.post(`/CAD/GeoLocation/InsertLocation`, locationPayload);
    // }
    // console.warn("zoneType not provided, GeoServices.insertLocation");
    // return null;
  };

  insertContactDetail = async (contactDetailPayload) => {
    // const [_key, { payload }] = queryKey;

    // if (payload) {
    return await axios.post(`/CAD/GeoLocation/GeoLocationContactDetail`, contactDetailPayload);
    // }
    // console.warn("zoneType not provided, GeoServices.insertLocation");
    // return null;
  };

  getContactData = async ({ queryKey }) => {
    const [_key, { payload }] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/GeoLocationContactDetail/GetData_GeoContact`,
        payload
      );
    }
    console.warn("payload not provided, GeoServices.getContactData");
    return null;
  };

  getLocationData = async (payload) => {
    // const [_key, { payload }] = queryKey;
    if (payload) {
      return await axios.post(`/CAD/GeoLocation/GetLocation`, payload);
    }
    console.warn("payload not provided, GeoServices.getLocationData");
    return null;
  };

  getLocationDataByID = async (payload) => {
    // const [_key, { payload }] = queryKey;
    if (payload) {
      return await axios.post(`/CAD/GeoLocation/Get_LocationByID`, payload);
    }
    console.warn("payload not provided, GeoServices.getLocationDataByID");
    return null;
  };

  getFlagHistoryList = async ({ queryKey }) => {
    const [_key, { payload }] = queryKey;
    if (payload) {
      return await axios.post(
        `/CAD/Flag/Flags_History`,
        payload
      );
    }
    console.warn("payload not provided, GeoServices.getFlagHistoryList");
    return null;
  };

  getContactDetailApartmentNo = async ({ queryKey }) => {
    const [_key, { AptID }] = queryKey;

    if (AptID) {
      return await axios.post(
        `/CAD/GeoLocation/GetContactDetailApartmentNo`,
        { AptID } // Ensure both are sent correctly
      );
    }

    console.warn("payload not provided, GeoServices.getContactDetailApartmentNo");
    return null;
  };

  getMiscStatus = async ({ queryKey }) => {
    const [_key, payload] = queryKey;

    return await axios.post(`/CAD/MasterMiscellaneous/GetMiscStatus`, payload);

  };
}

const instance = new GeoServices();

export default instance;
