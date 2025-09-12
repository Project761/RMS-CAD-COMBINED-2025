import axios from "axios";
class WhiteboardServices {
    insertWhiteboard = async (payload) => {
        if (payload) {
            return await axios.post(
                `/CAD/Whiteboard/InsertWhiteboard`,
                payload
            );
        }
        console.warn("payload not provided, WhiteboardServices.insertWhiteboard");
        return null;
    };
    updateWhiteboard = async (payload) => {
        if (payload) {
            return await axios.post(
                `CAD/Whiteboard/UpdateWhiteboard`,
                payload
            );
        }
        console.warn("payload not provided, WhiteboardServices.updateWhiteboard");
        return null;
    };

    getWhiteboard = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/Whiteboard/GetWhiteboard`, payload);
        }
        console.warn("payload not provided, WhiteboardServices.getWhiteboard");
        return null;
    };

    deleteWhiteboard = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Whiteboard/DeleteWhiteboard`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.deleteWhiteboard");
        return null;
    };

    pinnedWhiteboard = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Whiteboard/PinWhiteboard`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.pinnedWhiteboard");
        return null;
    };

    searchWhiteboard = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Whiteboard/WhiteboardSearch`, payload);
        }
        console.warn("payload not provided, WhiteboardServices.searchWhiteboard");
        return null;
    };

    getWhiteboardDoc = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Whiteboard/GetDatawhiteBoardDocuments`, payload);
        }
        console.warn("payload not provided, WhiteboardServices.getWhiteboardDoc");
        return null;
    };

    deleteWhiteboardDoc = async (payload) => {
        if (payload) {
            return await axios.post(
                `/CAD/Whiteboard/DeletewhiteBoardDocument`,
                payload
            );
        }
        console.warn("payload not provided, WhiteboardServices.deleteWhiteboardDoc");
        return null;
    };

    getDropDownTitleMessage = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/Whiteboard/GetDropDownTitleMessage`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDropDownTitleMessage");
        return null;
    };
}

const instance = new WhiteboardServices();

export default instance;
