
const googleAddKey = process.env.REACT_APP_GOOGLE_ADD_API_KEY;

export async function SplitAddress(Add) {
    try {
        const myHeaders = new Headers();

        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "address": {
                "regionCode": "US",
                "addressLines": [Add]
            },
            "enableUspsCass": true
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        };

        const res = await fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${googleAddKey}`, requestOptions);

        if (!res.ok) {
            throw Error(res.statusText);
        }
        const data = await res.json();

        const newData = data?.result
        return newData
    } catch (error) {
        console.log(error)
    }
}

