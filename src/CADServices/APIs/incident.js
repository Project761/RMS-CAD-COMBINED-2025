import axios from "axios";
class IncidentServices {

    getPinActivity = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/CallTakerIncident/GetPinActivity`, payload);
        }
        console.warn("payload not provided, IncidentServices.getPinActivity");
        return null;
    };

    getQueueCall = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/CallTakerIncident/GetQueueCall`, payload);
        }
        console.warn("payload not provided, IncidentServices.GetQueueCall");
        return null;
    };
}

const instance = new IncidentServices();

export default instance;
