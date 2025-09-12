import axios from "axios";
class ResourcesStatusServices {

    getHospitalNameCode = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalNamecode/GetData_HospitalNameCode`, payload);
        }
        console.warn("payload not provided, ResourcesStatusServices.getHospitalNameCode");
        return null;
    };

    getDataDropDown_HospitalNameCode = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalNamecode/GetDataDropDown_HospitalNameCode`, payload);
        }
        console.warn("payload not provided, ResourcesStatusServices.getDataDropDown_HospitalNameCode");
        return null;
    };

    insertHospitalNameCode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalNamecode/InsertMasterHospitalNamecode`, payload);
        }
        console.warn("payload not provided, ResourcesStatusServices.insertHospitalNameCode");
        return null;
    };

    updateMasterHospitalNamecode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalNamecode/UpdateMasterHospitalNamecode`, payload);
        }
        console.warn("payload not provided, ResourcesStatusServices.updateMasterHospitalNamecode");
        return null;
    };

    changeStatusHospitalNameCode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalNamecode/change_status`, payload);
        }
        console.warn("payload not provided, ResourcesStatusServices.changeStatusHospitalNameCode");
        return null;
    };

    incidentRecourseStatus = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Enroute/IncidentRecourseStatus`, payload);
        }
        console.warn("payload not provided, ResourcesStatusServices.incidentRecourseStatus");
        return null;
    };

}

const instance = new ResourcesStatusServices();

export default instance;
