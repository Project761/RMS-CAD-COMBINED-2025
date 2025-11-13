import axios from "axios";
class ScreenPermissionServices {

    getScreenPermissionByParentName = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/ScreenPermission/GetScreenPermissionByParentName`, payload);
        }
        console.warn("payload not provided, ScreenPermissionServices.getScreenPermissionByParentName");
        return null;
    };
}

const instance = new ScreenPermissionServices();

export default instance;
