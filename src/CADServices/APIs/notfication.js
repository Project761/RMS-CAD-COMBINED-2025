import axios from "axios";
class NotificationServices {

    getNotification = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/Notification/GetUnreadNotifications`, payload);
        }
        console.warn("payload not provided, NotificationServices.getNotification");
        return null;
    };

    markNotificationAsRead = async (payload) => {
        if (payload) {
            return await axios.post(`/Notification/MarkNotificationAsRead`, payload);
        }
        console.warn("payload not provided, NotificationServices.markNotificationAsRead");
        return null;
    };


}

const instance = new NotificationServices();

export default instance;
