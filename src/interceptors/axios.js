// Axios Interceptop -> Send access_token all component
import axios from "axios";

const url = window.location.origin;

// axios.defaults.baseURL = process.env.REACT_APP_DOMAIN_URL_KEY;
// axios.defaults.baseURL = 'https://apigoldline.com:5002/api/';
// axios.defaults.baseURL = 'https://rmsapidev.newinblue.com/api/';
// axios.defaults.baseURL = 'https://rmsapi.newinblue.com/api/';

// console.log(process.env.REACT_APP_DOMAIN_URL_KEY)
if (url === 'https://rmsdemo.newinblue.com') {
    axios.defaults.baseURL = 'https://rmsdemoapi.newinblue.com/api/';
}
else if (url === 'https://rmstest.newinblue.com') {
    axios.defaults.baseURL = 'https://rmstestapi.newinblue.com/api/';
}
else if (url === 'https://rmsdev.newinblue.com') {
    axios.defaults.baseURL = 'https://rmsapidev.newinblue.com/api/';
}

else if (url === 'https://rmstest.newinblue.com') {
    axios.defaults.baseURL = 'https://rmstestapi.newinblue.com/api/';
}

else if (url === 'https://rms.newinblue.com' || url === 'https://rmsweb1a.newinblue.com' || url === 'https://rmsweb1b.newinblue.com') {
    axios.defaults.baseURL = 'https://rmsapi.newinblue.com/api/';
}

else if (url === 'https://rmspreprod.newinblue.com') {
    axios.defaults.baseURL = 'https://rmspreprodapi.newinblue.com/api/';
}
else if (url === 'https://www.rmswebsocket.com') {
    axios.defaults.baseURL = 'https://www.websocketgoldline.com/api/';
}
else if (url === 'https://cumby.newinblue.com') {
    axios.defaults.baseURL = 'https://cumbyapi.newinblue.com/api/';
}
else if (url === 'https://cumbyrmspp.newinblue.com') {
    axios.defaults.baseURL = 'https://cumbyrmsapipp.newinblue.com/api/';
}
else {
    axios.defaults.baseURL = process.env.REACT_APP_DOMAIN_URL_KEY;
}

let refresh = false;

const AxiosCom = () => {
    axios.interceptors.request.use(async (request) => {
        const access_token = sessionStorage.getItem('access_token');
        request.headers['Authorization'] = `Bearer ${access_token}`
        return request;
    }, function (error) {
        console.log(error);
        return Promise.reject(error);
    });

    axios.interceptors.response.use(resp => { return resp }, async error => {
        if (error.response.status === 401 && !refresh) {
            refresh = true;
            try {
                const refresh_token = sessionStorage.getItem('refresh_token');
                const access_token = sessionStorage.getItem('access_token');

                const response = await axios.post('Account/GetToken', { access_token: access_token, refresh_token: refresh_token, grant_type: 'refresh_token' });

                if (response.status === 200) {
                    sessionStorage.setItem('refresh_token', response?.data?.refresh_token);
                    
                    if(response?.data?.access_token)
                    sessionStorage.setItem('access_token', response?.data?.access_token);

                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['access_token']}`;
                    return axios(error.config);
                }
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
            } finally {
                refresh = false;
            }
        }
        return Promise.reject(error);
    });
    return <div></div>;
};

export default AxiosCom;

