import axios from "axios";
class CertificationServices {

    getCertificationByPINID = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/Certification/GetCertificationByPINID`, payload);
        }
        console.warn("payload not provided, CertificationServices.getCertificationByPINID");
        return null;
    };

    InsertCertification = async (payload) => {
        if (payload) {
            return await axios.post(`/Certification/InsertUpdateCertification`, payload);
        }
        console.warn("payload not provided, CertificationServices.InsertCertification");
        return null;
    };

    updateCertification = async (payload) => {
        if (payload) {
            return await axios.post(`/Certification/UpdateCertification`, payload);
        }
        console.warn("payload not provided, CertificationServices.updateCertification");
        return null;
    }

    searchCertification = async (payload) => {
        if (payload) {
            return await axios.post(`/Certification/SearchCertification`, payload);
        }
        console.warn("payload not provided, CertificationServices.searchCertification");
        return null;
    }
}

const instance = new CertificationServices();

export default instance;
