import axios from "axios";
class BoloServices {

    insertBolo = async (payload) => {
        if (payload) {
            return await axios.post(
                `/CAD/Bolo/InsertBolo`,
                payload
            );
        }
        console.warn("payload not provided, BoloServices.insertBolo");
        return null;
    };

    getBolo = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/Bolo/GetBolo`, payload);
        }
        console.warn("payload not provided, BoloServices.getBolo");
        return null;
    };

    getBoloDoc = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Bolo/GetDataBoloDocuments`, payload);
        }
        console.warn("payload not provided, BoloServices.getBoloDoc");
        return null;
    };

    searchBolo = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Bolo/SearchBolo`, payload);
        }
        console.warn("payload not provided, BoloServices.searchBolo");
        return null;
    };

    deleteBoloDoc = async (payload) => {
        if (payload) {
            return await axios.post(
                `/CAD/Bolo/DeleteBoloDocuments`,
                payload
            );
        }
        console.warn("payload not provided, BoloServices.deleteBoloDoc");
        return null;
    };

    closeBolo = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Bolo/CloseBolo`, payload);
        }
        console.warn("payload not provided, BoloServices.closeBolo");
        return null;
    };
}

const instance = new BoloServices();

export default instance;
