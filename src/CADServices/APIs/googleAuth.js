import axios from "axios";
class GoogleAuthServices {

    generateQR = async (payload) => {
        if (payload) {
            return await axios.post(
                `/QR/GenerateQR`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.generateQR");
        return null;
    };

    qRValidate = async (payload) => {
        if (payload) {
            return await axios.post(
                `/QR/QRValidate`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.qRValidate");
        return null;
    };

    qRAccountValidate = async (payload) => {
        if (payload) {
            return await axios.post(
                `/Account/QRValidate`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.qRAccountValidate");
        return null;
    };

    disable2FA = async (payload) => {
        if (payload) {
            return await axios.post(
                `/QR/Disable2FA`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.disable2FA");
        return null;
    };

    sendVerificationCode = async (payload) => {
        if (payload) {
            return await axios.post(
                `/EmailVerification/SendVerificationCode`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.sendVerificationCode");
        return null;
    };

    verifyCode = async (payload) => {
        if (payload) {
            return await axios.post(
                `/EmailVerification/VerifyCode`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.verifyCode");
        return null;
    };

    insertLoginLog = async (payload) => {
        if (payload) {
            return await axios.post(
                `/Account/InsertLoginLog`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.insertLoginLog");
        return null;
    };

    logOutFromAllDevices = async (payload) => {
        if (payload) {
            return await axios.post(
                `/Account/LogOutFromAllDevices`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.logOutFromAllDevices");
        return null;
    };

    logOutSingleDevices = async (payload) => {
        if (payload) {
            return await axios.post(
                `/Account/LogOutSingleDevices`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.logOutSingleDevices");
        return null;
    };

    updateSessionTimeOut = async (payload) => {
        if (payload) {
            return await axios.post(
                `/Account/UpdateSessionTimeOut`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.updateSessionTimeOut");
        return null;
    };

    getDataUpdatePersonnel = async ({ queryKey }) => {
        const [_key, { payload }] = queryKey;
        if (payload) {
            return await axios.post(
                `Personnel/GetData_UpdatePersonnel`,
                payload
            );
        }
        console.warn("payload not provided, GoogleAuthServices.getDataUpdatePersonnel");
        return null;
    };
}

const instance = new GoogleAuthServices();

export default instance;
