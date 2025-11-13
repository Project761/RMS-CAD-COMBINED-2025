import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { showNotificationToast, toastifySuccess } from '../Components/Common/AlertMsg';

const signalRAPI = process.env.REACT_APP_SIGNALR_URL_KEY;
const APIurl = process.env.REACT_APP_DOMAIN_URL_KEY;

export const connection = new HubConnectionBuilder()
    .withUrl(`${signalRAPI}?AgencyID=${sessionStorage.getItem("AgencyID")}`, {
        accessTokenFactory: (data) => {
            const token = sessionStorage.getItem("PINID");
            return token;
        },
    })
    .build();

// Function to set up SignalR handlers with context functions
export const setupSignalRHandlers = (incidentRefetch, resourceRefetch) => {
    // Remove existing handlers to avoid duplicates
    connection.off("MonitorIncidentsView");
    connection.off("MonitorResourceView");

    connection.on("MonitorIncidentsView", (e) => {
        console.log("MonitorIncidentsView")
        incidentRefetch();
    });

    connection.on("MonitorResourceView", (e) => {
        console.log("MonitorResourceView")
        resourceRefetch();
    });
};

connection.on("Logout", () => {
    toastifySuccess("Logout Successfully !!");
    connection.stop().catch(err => console.error("Error disconnecting:", err));
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
});

connection.on("ResetTimer", async (message) => {
    try {
        const token = sessionStorage.getItem("access_token");
        if (!token) return;
        const response = await fetch(`${APIurl}/Personnel/GetData_UpdatePersonnel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ PINID: localStorage?.getItem("PINID") })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const res = await response.json();
        const parsedData = JSON.parse(res.data);
        const sessionTimeOut = parsedData.Table[0]?.SessionTimeOut;
        sessionStorage.setItem("SessionTimeOut", sessionTimeOut);

    } catch (error) {
        console.error("Error fetching session timeout data:", error);
    }
});

connection.on("ReceiveNotification", async (message) => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return; // If no token, exit early
    const AgencyID = sessionStorage.getItem("AgencyID");
    try {
        const response = await fetch(`${APIurl}CAD/MasterPriority/GetDataDropDown_Priority`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ AgencyID: AgencyID })
        });
        if (!response.ok) {
            console.error(`API error! Status: ${response.status}`);
            return; // API error - skip further processing
        }

        // Parse response data
        const res = await response.json();
        const parsedData = res?.data ? JSON.parse(res.data) : null;

        if (!parsedData || !parsedData.Table) {
            console.warn("Invalid or missing priority data. Using default color.");
        }

        const getMarkerColor = (description) => {
            const priority = parsedData?.Table?.find(item => item.Description === description);
            return priority?.BackColor || '#808080';
        };

        const color = getMarkerColor(message?.priority);
        showNotificationToast(message?.heading, message?.message, color);

    } catch (error) {
        console.error("Error handling notification:", error.message);
    }
});

connection.onclose(() => {
    console.warn("🔌 SignalR disconnected. Attempting reconnect...");
    if (connection.state === HubConnectionState.Disconnected) {
        connection.start().catch(console.error);
    }
});
