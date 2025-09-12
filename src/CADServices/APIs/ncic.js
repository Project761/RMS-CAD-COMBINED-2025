import axios from "axios";
class NcicServices {

    sendNcicRequest = async (payload) => {
        if (payload) {
            return await axios.post(
                `/NCICDetails/SendNcicRequest`,
                payload
            );
        }
        console.warn("payload not provided, NcicServices.sendNcicRequest");
        return null;
    };

    getNCICParsedResponse = async (payload) => {
        if (payload) {
            return await axios.post(
                `/NCICDetails/GetNCICParsedResponse`,
                payload
            );
        }
        console.warn("payload not provided, NcicServices.getNCICParsedResponse");
        return null;
    };

    getNCICParsedResponseSummary = async (payload) => {
        if (payload) {
            console.log("payload", payload)
            return await axios.post(
                `/NCICDetails/GetNCICParsedResponse`,
                payload
            );
        }
        console.warn("payload not provided, NcicServices.getNCICParsedResponseSummary");
        return null;
    };

    getNCICResponse = async ({ queryKey }) => {
        const [
            _key,
            {
                userPID,
            },
        ] = queryKey;
        if (userPID) {
            return await axios.post(
                `/NCICDetails/GetNCICResponse?userPID=${userPID}`,
            );
        }
        console.warn("payload not provided, NcicServices.getNCICResponse");
        return null;
    };

}

const instance = new NcicServices();

export default instance;
