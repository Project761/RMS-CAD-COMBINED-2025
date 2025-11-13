import axios from "axios";
import { Aes256Decrypt, Aes256Encrypt } from '../Common/Utility';

const encDecStatus = process.env.REACT_APP_ENC_DEC_STATUS;
var IsEncDec = encDecStatus == 'true' || encDecStatus == true
// var IsEncDec = true

// IsEncDec && console.log(IsEncDec)

// ------get API Request
export const fetchData = async (url) => {
    try {
        //--------------> New code with EncDec <------------ Don't Remove--------By DK
        if (IsEncDec) {
            const res = await axios.get(url);
            const decr = res.data.data
            const decrypted = Aes256Decrypt(decr);
            const TextData = JSON.parse(decrypted)
            return TextData.Table
        } else {
            const res = await axios.get(url);
            // console.log('fetchData', res)
            const decr = res.data.data
            const TextData = JSON.parse(decr)
            return TextData.Table
        }

        //--------------> Old code <------------ Don't Remove--------By DK
        // const res = await axios.get(url);
        // const decr = res.data.data
        // const TextData = JSON.parse(decr)
        // return TextData.Table


    } catch (error) {
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`)
            console.log("%c🚀 ~ fetchData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    }
};

// ----- By DS
export const fetchDate = async (url, postData) => {
    try {
        //--------------> New code with EncDec <------------ Don't Remove--------By DK
        const ipAddress = sessionStorage.getItem('IPAddress');
        if (ipAddress) {
            postData.IPAddress = ipAddress;
        }
        if (IsEncDec) {
            const res = await axios.post(url, postData);
            const decr = res.data.data
            const decrypted = Aes256Decrypt(decr);
            const TextData = JSON.parse(decrypted)
            return TextData.Table
        } else {
            const res = await axios.post(url, postData);
            // console.log('fetchData', res)
            const decr = res.data.Message
            // const TextData = JSON.parse(decr)
            return decr
        }

        //--------------> Old code <------------ Don't Remove--------By DK
        // const res = await axios.get(url);
        // const decr = res.data.data
        // const TextData = JSON.parse(decr)
        // return TextData.Table

    } catch (error) {
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`)
            console.log("%c🚀 ~ fetchDate: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    }
};

//------------By DK
export const fetchPostDataNibrs = async (url, postData) => {
    var reUseUrl = url;
    var reUseData = postData;
    try {
        const ipAddress = sessionStorage.getItem('IPAddress');
        if (ipAddress) {
            postData.IPAddress = ipAddress;
        }

        if (Object.keys(postData).length !== 0) {

            //--------------> New code with EncDec <------------ Don't Remove--------By DK
            if (IsEncDec) {
                const EncPostData = await Aes256Encrypt(JSON.stringify(postData));
                // console.log(EncPostData)
                const DecPostData = { 'EDpostData': EncPostData }
                // console.log(DecPostData)
                const res = await axios.post(url, DecPostData);
                // console.log(res)
                const EncryptedData = res?.data?.data;
                // console.log(EncryptedData)
                const decryptedData = await Aes256Decrypt(EncryptedData);
                // console.log(decryptedData)
                const TextData = JSON.parse(decryptedData)
                return TextData

            } else {

                const res = await axios.post(url, postData);
                // console.log(res)
                const TextData = JSON.parse(res?.data?.data);
                return TextData
            }

        } else {
            // console.log(`${url}-----${postData}`)
            // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error?.response?.status === 401) {
            if (Object.keys(reUseData)?.length !== 0) {
                //--------------> New code with EncDec <------------ Don't Remove--------By DK
                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }
                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const EncryptedData = JSON.parse(res?.data?.data);
                    const decryptedData = await Aes256Decrypt(EncryptedData);
                    const TextData = JSON.parse(decryptedData)
                    return TextData

                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    // console.log(res)
                    const TextData = JSON.parse(res?.data?.data);
                    return TextData

                }

            } else {
                // console.log(`${url}-----${postData}`)
                // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`);
            // console.log("%c🚀 ~ fetchPostData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
        return []
    }
};

//------------By DK
export const fetchPostDataPersonnel = async (url, postData) => {
    var reUseUrl = url;
    var reUseData = postData;
    try {
        const ipAddress = sessionStorage.getItem('IPAddress');
        if (ipAddress) {
            postData.IPAddress = ipAddress;
        }

        if (Object.keys(postData).length !== 0) {

            //--------------> New code with EncDec <------------ Don't Remove--------By DK
            if (IsEncDec) {
                const EncPostData = await Aes256Encrypt(JSON.stringify(postData));
                // console.log(EncPostData)
                const DecPostData = { 'EDpostData': EncPostData }
                // console.log(DecPostData)
                const res = await axios.post(url, DecPostData);
                // console.log(res)
                const EncryptedData = res?.data?.data;
                // console.log(EncryptedData)
                const decryptedData = await Aes256Decrypt(EncryptedData);
                // console.log(decryptedData)
                const TextData = JSON.parse(decryptedData)
                return TextData
            } else {

                const res = await axios.post(url, postData);

                const TextData = JSON.parse(res?.data?.data);
                return TextData
            }

        } else {
            // console.log(`${url}-----${postData}`)
            // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error?.response?.status === 401) {
            if (Object.keys(reUseData)?.length !== 0) {
                //--------------> New code with EncDec <------------ Don't Remove--------By DK
                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }
                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const EncryptedData = JSON.parse(res?.data?.data);
                    const decryptedData = await Aes256Decrypt(EncryptedData);
                    const TextData = JSON.parse(decryptedData)
                    return TextData

                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    const TextData = JSON.parse(res?.data?.data);
                    return TextData

                }

            } else {
                // console.log(`${url}-----${postData}`)
                // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`);
            // console.log("%c🚀 ~ fetchPostData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
        return []
    }
};
export const fetchPostData = async (url, postData) => {
    var reUseUrl = url;
    var reUseData = postData;
    try {
        const ipAddress = sessionStorage.getItem('IPAddress');
        if (ipAddress) {
            postData.IPAddress = ipAddress;
        }

        if (Object.keys(postData).length !== 0) {

            //--------------> New code with EncDec <------------ Don't Remove--------By DK
            if (IsEncDec) {
                const EncPostData = await Aes256Encrypt(JSON.stringify(postData));
                // console.log(EncPostData)
                const DecPostData = { 'EDpostData': EncPostData }
                // console.log(DecPostData)
                const res = await axios.post(url, DecPostData);
                // console.log(res)
                const EncryptedData = res?.data?.data;
                // console.log(EncryptedData)
                const decryptedData = await Aes256Decrypt(EncryptedData);
                // console.log(decryptedData)
                const TextData = JSON.parse(decryptedData)
                return TextData?.Table
            } else {

                const res = await axios.post(url, postData);

                const TextData = JSON.parse(res?.data?.data);
                return TextData?.Table
            }

        } else {
            // console.log(`${url}-----${postData}`)
            // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error?.response?.status === 401) {
            if (Object.keys(reUseData)?.length !== 0) {
                //--------------> New code with EncDec <------------ Don't Remove--------By DK
                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }
                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const EncryptedData = JSON.parse(res?.data?.data);
                    const decryptedData = await Aes256Decrypt(EncryptedData);
                    const TextData = JSON.parse(decryptedData)
                    return TextData?.Table

                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    const TextData = JSON.parse(res?.data?.data);
                    return TextData?.Table

                }

            } else {
                // console.log(`${url}-----${postData}`)
                // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`);
            // console.log("%c🚀 ~ fetchPostData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
        return []
    }
};

export const fetchPostWithTableData = async (url, postData) => {
    var reUseUrl = url;
    var reUseData = postData;
    try {
        const ipAddress = sessionStorage.getItem('IPAddress');
        if (ipAddress) {
            postData.IPAddress = ipAddress;
        }

        if (Object.keys(postData).length !== 0) {

            //--------------> New code with EncDec <------------ Don't Remove--------By DK
            if (IsEncDec) {
                const EncPostData = await Aes256Encrypt(JSON.stringify(postData));
                // console.log(EncPostData)
                const DecPostData = { 'EDpostData': EncPostData }
                // console.log(DecPostData)
                const res = await axios.post(url, DecPostData);
                // console.log(res)
                const EncryptedData = res?.data?.data;
                // console.log(EncryptedData)
                const decryptedData = await Aes256Decrypt(EncryptedData);
                // console.log(decryptedData)
                const TextData = JSON.parse(decryptedData)
                return TextData
            } else {

                const res = await axios.post(url, postData);

                const TextData = JSON.parse(res?.data?.data);
                return TextData
            }

        } else {
            // console.log(`${url}-----${postData}`)
            // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error?.response?.status === 401) {
            if (Object.keys(reUseData)?.length !== 0) {
                //--------------> New code with EncDec <------------ Don't Remove--------By DK
                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }
                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const EncryptedData = JSON.parse(res?.data?.data);
                    const decryptedData = await Aes256Decrypt(EncryptedData);
                    const TextData = JSON.parse(decryptedData)
                    return TextData?.Table

                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    const TextData = JSON.parse(res?.data?.data);
                    return TextData

                }

            } else {
                // console.log(`${url}-----${postData}`)
                // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`);
            // console.log("%c🚀 ~ fetchPostData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
        return []
    }
};
export const fetchPostDataNew = async (url, postData) => {
    var reUseUrl = url;
    var reUseData = postData;
    try {
        const ipAddress = sessionStorage.getItem('IPAddress');
        if (ipAddress) {
            postData.IPAddress = ipAddress;
        }

        if (Object.keys(postData).length !== 0) {

            //--------------> New code with EncDec <------------ Don't Remove--------By DK
            if (IsEncDec) {
                const EncPostData = await Aes256Encrypt(JSON.stringify(postData));
                // console.log(EncPostData)
                const DecPostData = { 'EDpostData': EncPostData }
                // console.log(DecPostData)
                const res = await axios.post(url, DecPostData);
                // console.log(res)
                const EncryptedData = res?.data?.data;
                // console.log(EncryptedData)
                const decryptedData = await Aes256Decrypt(EncryptedData);
                // console.log(decryptedData)
                const TextData = JSON.parse(decryptedData)
                return TextData?.Table
            } else {

                const res = await axios.post(url, postData);

                const TextData = res?.data?.data;
                return TextData
            }

        } else {
            // console.log(`${url}-----${postData}`)
            // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error?.response?.status === 401) {
            if (Object.keys(reUseData)?.length !== 0) {
                //--------------> New code with EncDec <------------ Don't Remove--------By DK
                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }
                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const EncryptedData = JSON.parse(res?.data?.data);
                    const decryptedData = await Aes256Decrypt(EncryptedData);
                    const TextData = JSON.parse(decryptedData)
                    return TextData?.Table

                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    const TextData = JSON.parse(res?.data?.data);
                    return TextData?.Table

                }

            } else {
                // console.log(`${url}-----${postData}`)
                // console.log("%c🚀 ~ fetchPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`);
            // console.log("%c🚀 ~ fetchPostData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
        return []
    }
};
//------------By DK
export const fetchTreeModelPostData = async (url, postData) => {
    var reUseUrl = url;
    var reUseData = postData;
    try {
        if (Object.keys(postData).length !== 0) {
            const ipAddress = sessionStorage.getItem('IPAddress');
            if (ipAddress) {
                postData.IPAddress = ipAddress;
            }
            //--------------> New code with EncDec <------------ Don't Remove--------By DK
            if (IsEncDec) {
                const EncPostData = await Aes256Encrypt(JSON.stringify(postData));
                // console.log(EncPostData)
                const DecPostData = { 'EDpostData': EncPostData }
                // console.log(DecPostData)
                const res = await axios.post(url, DecPostData);
                // console.log(res)
                const EncryptedData = res?.data?.data;
                // console.log(EncryptedData)
                const decryptedData = await Aes256Decrypt(EncryptedData);
                // console.log(decryptedData)
                const TextData = JSON.parse(decryptedData)
                return TextData
            } else {
                const res = await axios.post(url, postData);
                // console.log('fetchPostData', res)

                const TextData = JSON.parse(res?.data?.data);
                return TextData
            }

            //--------------> Old code <------------ Don't Remove-----By DK
            // const res = await axios.post(url, postData);
            // const TextData = JSON.parse(res?.data?.data);
            // return TextData?.Table
        } else {
            // console.log(`${url}-----${postData}`)
            console.log("%c🚀 ~ fetchTreeModelPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error?.response?.status === 401) {
            if (Object.keys(reUseData)?.length !== 0) {
                //--------------> New code with EncDec <------------ Don't Remove--------By DK
                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }
                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const EncryptedData = JSON.parse(res?.data?.data);
                    const decryptedData = await Aes256Decrypt(EncryptedData);
                    const TextData = JSON.parse(decryptedData)
                    return TextData
                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    const TextData = JSON.parse(res?.data?.data);
                    return TextData
                }

                //--------------> Old code <------------ Don't Remove-------------By DK
                // const res = await axios.post(reUseUrl, reUseData);
                // const TextData = JSON.parse(res?.data?.data);
                // return TextData
            } else {
                // console.log(`${url}-----${postData}`)
                console.log("%c🚀 ~ fetchTreeModelPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`)
            console.log("%c🚀 ~ fetchTreeModelPostData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
        return []
    }
};

//------------By DK
export const fetchUCRReportPostData = async (url, postData) => {
    var reUseUrl = url;
    var reUseData = postData;
    try {
        if (Object.keys(postData).length !== 0) {
            const ipAddress = sessionStorage.getItem('IPAddress');
            if (ipAddress) {
                postData.IPAddress = ipAddress;
            }
            //--------------> New code with EncDec <------------ Don't Remove--------By DK
            if (IsEncDec) {
                const EncPostData = await Aes256Encrypt(JSON.stringify(postData));
                // console.log(EncPostData)
                const DecPostData = { 'EDpostData': EncPostData }
                // console.log(DecPostData)
                const res = await axios.post(url, DecPostData);
                // console.log(res)
                const EncryptedData = res?.data?.data;
                // console.log(EncryptedData)
                const decryptedData = await Aes256Decrypt(EncryptedData);
                // console.log(decryptedData)
                return decryptedData
            } else {
                const res = await axios.post(url, postData);
                // console.log('fetchPostData', res)
                const TextData = res?.data?.data;
                return TextData
            }

            //--------------> Old code <------------ Don't Remove-----By DK
            // const res = await axios.post(url, postData);
            // const TextData = JSON.parse(res?.data?.data);
            // return TextData?.Table
        } else {
            // console.log(`${url}-----${postData}`)
            console.log("%c🚀 ~ fetchUCRReportPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error?.response?.status === 401) {
            if (Object.keys(reUseData)?.length !== 0) {
                //--------------> New code with EncDec <------------ Don't Remove--------By DK
                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }
                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const EncryptedData = JSON.parse(res?.data?.data);
                    const decryptedData = await Aes256Decrypt(EncryptedData);
                    return decryptedData
                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    const TextData = res?.data?.data;
                    return TextData
                }

                //--------------> Old code <------------ Don't Remove-------------By DK
                // const res = await axios.post(reUseUrl, reUseData);
                // const TextData = res?.data?.data;
                // return TextData
            } else {
                // console.log(`${url}-----${postData}`);
                console.log("%c🚀 ~ fetchUCRReportPostData: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`);
            console.log("%c🚀 ~ fetchUCRReportPostData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
        return []
    }
};

export const fetch_Post_Data = async (url, postData) => {
    let Data
    let Permision
    var reUseUrl = url;
    var reUseData = postData;
    try {
        if (Object.keys(postData).length !== 0) {
            const ipAddress = sessionStorage.getItem('IPAddress');
            if (ipAddress) {
                postData.IPAddress = ipAddress;
            }
            //--------------> New code with EncDec <------------ Don't Remove--------By DK

            if (IsEncDec) {
                const EncPostData = Aes256Encrypt(JSON.stringify(postData));
                const DecPostData = { 'EDpostData': EncPostData }
                const res = await axios.post(url, DecPostData);
                const decr = res.data.data
                // const EncryptedData = JSON.parse(decr);
                const decryptedData = await Aes256Decrypt(decr);
                const TextData = JSON.parse(decryptedData)
                Permision = TextData.Table1
                Data = TextData.Table
                return { Data, Permision }
            } else {
                const res = await axios.post(url, postData);
                // console.log('fetch_Post_Data', res)
                const decr = res.data.data
                const TextData = JSON.parse(decr)
                Permision = TextData.Table1
                Data = TextData.Table
                return { Data, Permision }
            }


            //--------------> Old code <------------ Don't Remove-------------By DK

            // const res = await axios.post(url, postData);
            // const decr = res.data.data
            // const TextData = JSON.parse(decr)
            // Permision = TextData.Table1
            // Data = TextData.Table
            // return { Data, Permision }
        } else {
            // console.log(`${url}-----${postData}`)
            console.log("%c🚀 ~ fetch_Post_Data: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error.response.status === 401) {
            if (Object.keys(reUseData).length !== 0) {

                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }

                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const decr = res.data.data
                    // const EncryptedData = JSON.parse(decr);
                    const decryptedData = await Aes256Decrypt(decr);
                    const TextData = JSON.parse(decryptedData)
                    Permision = TextData.Table1
                    Data = TextData.Table
                    return { Data, Permision }
                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    const decr = res.data.data
                    const TextData = JSON.parse(decr)
                    Permision = TextData.Table1
                    Data = TextData.Table
                    return { Data, Permision }
                }

                // const res = await axios.post(reUseUrl, reUseData);
                // const decr = res.data.data
                // const TextData = JSON.parse(decr)
                // Permision = TextData.Table1
                // Data = TextData.Table
                // return { Data, Permision }
            } else {
                // console.log(`${url}-----${postData}`)
                console.log("%c🚀 ~ fetch_Post_Data: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`);
            console.log("%c🚀 ~ fetch_Post_Data: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    }
};

// --------ADD Update Delete Data  With API Post Request

export const AddDeleteUpadate = async (url, postData) => {
    if (Object.keys(postData).length !== 0) {
        const ipAddress = sessionStorage.getItem('IPAddress');
        if (ipAddress) {
            postData.IPAddress = ipAddress;
        }
        if (IsEncDec) {
            const EncPostData = Aes256Encrypt(JSON.stringify(postData));
            const DecPostData = { 'EDpostData': EncPostData }
            const res = await axios.post(url, DecPostData);
            if (res.code == "ERR_BAD_REQUEST") {
                return res
            } else {
                const EncryptedData = res.data.data
                const decryptedData = await Aes256Decrypt(EncryptedData);
                return decryptedData
                // return res.data;
            }
        } else {
            const res = await axios.post(url, postData);
            // console.log('AddDeleteUpadate', res)
            if (res.code == "ERR_BAD_REQUEST") {
                return res
            } else {
                return res.data;
            }
        }

        // const res = await axios.post(url, postData);
        // if (res.code == "ERR_BAD_REQUEST") {
        //     return res
        // } else {
        //     return res.data;
        // }
    } else {
        // console.log(`${url}-----${postData}`)
        console.log("%c🚀 ~ AddDeleteUpadate: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

    }
}

export const PropertyRoomInsert = async (url, postData) => {
    // console.log("URL::",url)
    // console.log("PostData::",postData)

    // for (let pair of postData.entries()) {
    // console.log(pair[0],":", pair[1]);
    // }

    const ipAddress = sessionStorage.getItem('IPAddress');
    if (ipAddress) {
        postData.append("IPAddress", ipAddress);
    }
    if (IsEncDec) {
        // console.log("IF IF Executed")

        const EncPostData = Aes256Encrypt(JSON.stringify(postData));
        const DecPostData = { 'EDpostData': EncPostData }
        const res = await axios.post(url, DecPostData);
        if (res.code == "ERR_BAD_REQUEST") {
            return res
        } else {
            const EncryptedData = res.data.data
            const decryptedData = await Aes256Decrypt(EncryptedData);
            return decryptedData
            // return res.data;
        }
    } else {
        // console.log("IF  else Executed")

        const res = await axios.post(url, postData);
        // console.log('AddDeleteUpadate', res)
        if (res.code == "ERR_BAD_REQUEST") {
            return res
        } else {
            return res.data;
        }
    }

    // const res = await axios.post(url, postData);
    // if (res.code == "ERR_BAD_REQUEST") {
    //     return res
    // } else {
    //     return res.data;
    // }

}

export const AddDelete_Img = async (url, FormData, EncFormdata) => {
    if (FormData || EncFormdata) {
        try {
            if (IsEncDec) {
                const res = await axios.post(url, EncFormdata);
                if (res.code === 'ERR_BAD_REQUEST') {
                    return res
                } else {
                    const EncryptedData = res?.data?.data
                    const decryptedData = await Aes256Decrypt(EncryptedData);
                    return decryptedData
                }
            } else {
                const res = await axios.post(url, FormData);
                // console.log('AddDelete_Img', res)
                if (res.code === 'ERR_BAD_REQUEST') {
                    return res
                } else {
                    return res.data;
                }
            }

        } catch (error) {
            console.error(error)
        }


        // const res = await axios.post(url, FormData);
        // if (res.code === 'ERR_BAD_REQUEST') {
        //     return res
        // } else {
        //     return res.data;
        // }
    } else {
        // console.log(`${url}-----${FormData}`)
        console.log("%c🚀 ~ AddDelete_Img: " + `${url}-----${FormData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

    }
}

// Agency Permision
export const ScreenPermision = async (code, agencyId, PinID) => {
    if (code && agencyId && PinID) {
        try {
            if (IsEncDec) {
                const val = { PINID: PinID, ApplicationID: '1', code: code, AgencyID: agencyId }
                const EncPostData = await Aes256Encrypt(JSON.stringify(val));
                const DecPostData = { 'EDpostData': EncPostData }
                const res = await axios.post("EffectivePermission/GetData_EffectiveScreenPermission", DecPostData);
                const EncryptedData = res.data.data
                const decryptedData = await Aes256Decrypt(EncryptedData);
                const TextData = JSON.parse(decryptedData)
                return TextData.Table
            } else {
                const val = { PINID: PinID, ApplicationID: '1', code: code, AgencyID: agencyId }
                const res = await axios.post("EffectivePermission/GetData_EffectiveScreenPermission", val);
                // console.log('ScreenPermision', res)
                const decr = res.data.data
                const TextData = JSON.parse(decr)
                return TextData.Table
            }

            // const val = { PINID: PinID, ApplicationID: '1', code: code, AgencyID: agencyId }
            // const res = await axios.post("EffectivePermission/GetData_EffectiveScreenPermission", val);
            // const decr = res.data.data
            // const TextData = JSON.parse(decr)
            // return TextData.Table
        } catch (error) {
            console.error(error)
        }

    } else {
        // console.log(`Data --> Code-${code}, agencyId-${agencyId}, PinID-${PinID} `)
    }
}

// Utility Personnel Screen Permision
export const UtilityPersonnelScreenPermision = async (code, tableId) => {
    try {
        if (IsEncDec) {
            const val = { PINID: '', TableCode: code, TableId: tableId }
            const EncPostData = Aes256Encrypt(JSON.stringify(val));
            const postData = { 'EDpostData': EncPostData }
            const res = await axios.post("TablePermission/GetData_SingleGroupTablePermission", postData);
            const EncryptedData = res.data.data
            const decryptedData = await Aes256Decrypt(EncryptedData);
            const TextData = JSON.parse(decryptedData)
            return TextData.Table
        } else {
            const val = { PINID: '', TableCode: code, TableId: tableId }
            const res = await axios.post("TablePermission/GetData_SingleGroupTablePermission", val);
            // console.log('UtilityPersonnelScreenPermision', res)
            const decr = res?.data?.data
            const TextData = JSON.parse(decr)
            return TextData.Table
        }
    } catch (error) {
        console.log(error)
    }



    // const val = { PINID: '', TableCode: code, TableId: tableId }
    // const res = await axios.post("TablePermission/GetData_SingleGroupTablePermission", val);
    // const decr = res?.data?.data
    // const TextData = JSON.parse(decr)
    // return TextData.Table
}

export const fieldPermision = async (AgencyID, ScreenCode, pinId) => {
    if (AgencyID && ScreenCode && pinId) {
        try {
            if (IsEncDec) {
                const val = { AgencyID: AgencyID, ScreenCode: ScreenCode, PINID: pinId, }
                const EncPostData = Aes256Encrypt(JSON.stringify(val));
                const postData = { 'EDpostData': EncPostData }
                const res = await axios.post("EffectivePermission/GetData_EffectiveFieldPermission_Validate", postData);
                const EncryptedData = res.data.data
                const decryptedData = await Aes256Decrypt(EncryptedData);
                const TextData = JSON.parse(decryptedData)
                return TextData.Table
            } else {
                const val = { AgencyID: AgencyID, ScreenCode: ScreenCode, PINID: pinId, }
                const res = await axios.post("EffectivePermission/GetData_EffectiveFieldPermission_Validate", val);
                // console.log('fieldPermision', res)
                const decr = res.data.data
                const TextData = JSON.parse(decr)
                return TextData.Table
            }
        } catch (error) {
            console.error(error)
        }

        // const val = { AgencyID: AgencyID, ScreenCode: ScreenCode, PINID: pinId, }
        // const res = await axios.post("EffectivePermission/GetData_EffectiveFieldPermission_Validate", val);
        // const decr = res.data.data
        // const TextData = JSON.parse(decr)
        // return TextData.Table
    } else {
        // console.log(`Data --> ScreenCode-${ScreenCode}, AgencyID-${AgencyID}, pinId-${pinId} `)
    }
}

export const fetchProgresData = async (url, postData) => {
    try {
        const ipAddress = sessionStorage.getItem('IPAddress');
        if (ipAddress) {
            postData.IPAddress = ipAddress;
        }
        if (Object.keys(postData).length !== 0) {
            const res = await axios.post(url, postData);
            return res.data
        } else {
            console.log(`${url}-----${postData}`)
        }
    } catch (error) {
        if (error.response) {
            // console.log(`${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`)
            console.log("%c🚀 ~ fetchProgresData: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    }
};

export const downloadUrl = async (url, postData) => {
    let Data
    let Permision
    var reUseUrl = url;
    var reUseData = postData;
    try {
        if (Object.keys(postData).length !== 0) {
            const ipAddress = sessionStorage.getItem('IPAddress');
            if (ipAddress) {
                postData.IPAddress = ipAddress;
            }
            //--------------> New code with EncDec <------------ Don't Remove--------By DK

            if (IsEncDec) {
                const EncPostData = Aes256Encrypt(JSON.stringify(postData));
                const DecPostData = { 'EDpostData': EncPostData }
                const res = await axios.post(url, DecPostData);
                const decr = res.data.data
                // const EncryptedData = JSON.parse(decr);
                const decryptedData = await Aes256Decrypt(decr);
                const TextData = JSON.parse(decryptedData)
                Permision = TextData.Table1
                Data = TextData.Table
                return { Data, Permision }
            } else {
                const res = await axios.post(url, postData);
                const decr = res?.data
                console.log('decr', decr)
                return decr
                const TextData = JSON.parse(decr)
                Permision = TextData.Table1
                Data = TextData.Table
            }

        } else {
            // console.log(`${url}-----${postData}`)
            console.log("%c🚀 ~ fetch_Post_Data: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    } catch (error) {
        if (error.response.status === 401) {
            if (Object.keys(reUseData).length !== 0) {

                const ipAddress = sessionStorage.getItem('IPAddress');
                if (ipAddress) {
                    reUseData.IPAddress = ipAddress;
                }

                if (IsEncDec) {
                    const EncPostData = Aes256Encrypt(JSON.stringify(reUseData));
                    const DecPostData = { 'EDpostData': EncPostData }
                    const res = await axios.post(reUseUrl, DecPostData);
                    const decr = res.data.data
                    // const EncryptedData = JSON.parse(decr);
                    const decryptedData = await Aes256Decrypt(decr);
                    const TextData = JSON.parse(decryptedData)
                    Permision = TextData.Table1
                    Data = TextData.Table
                    return { Data, Permision }
                } else {
                    const res = await axios.post(reUseUrl, reUseData);
                    const decr = res.data.data
                    const TextData = JSON.parse(decr)
                    Permision = TextData.Table1
                    Data = TextData.Table
                    return { Data, Permision }
                }
            } else {

                console.log("%c🚀 ~ fetch_Post_Data: " + `${url}-----${postData}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

            }
        }
        if (error.response) {
            console.log("%c🚀 ~ fetch_Post_Data: " + `${error.response?.request?.responseURL} -- ${error.response?.data?.Message}`, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

        }
    }
};