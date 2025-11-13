import axios from "axios";
class CitationServices {

    getAllCitations = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/Citation/GetAllCitations`, payload);
        }
        console.warn("payload not provided, CitationServices.getAllCitations");
        return null;
    };

}

const instance = new CitationServices();

export default instance;
