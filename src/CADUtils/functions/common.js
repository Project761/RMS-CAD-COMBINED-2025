import { useContext } from "react";
import { func } from "prop-types";
import { LoginContext } from '../../CADContext/loginAuth';
import { useSelector } from 'react-redux';
const APIurl = process.env.REACT_APP_DOMAIN_URL_KEY;
export const dropDownDataModel = (data, value, label) => {
  const result = data?.map((item) => ({
    value: item[value],
    label: item[label],
  }));
  return result;
};
export const dropDownDataModelForAptNo = (data, value, label, id) => {
  const result = data?.map((item) => ({
    value: item[value],
    label: item[label],
    aptId: item[id]
  }));
  return result;
};
// Allow Text and Number with space
export const handleNumberTextKeyDown = (e) => {
  const regex = /^[a-zA-Z0-9\s]$/;

  // Allow control keys such as Backspace, Delete, Tab, Enter, and arrow keys
  const controlKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  // If the key does not match the regex and is not a control key, prevent the input
  if (!regex.test(e.key) && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};

// Allow Text and Number with no space
export const handleNumberTextNoSpaceKeyDown = (e) => {
  const regex = /^[a-zA-Z0-9]$/; // Allow only letters and numbers (no spaces)

  // Allow control keys such as Backspace, Delete, Tab, Enter, and arrow keys
  const controlKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  // If the key does not match the regex and is not a control key, prevent the input
  if (!regex.test(e.key) && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};

// Allow Number only with no space
export const handleNumberNoSpaceKeyDown = (e) => {
  const regex = /^[0-9]$/;

  // Allow control keys such as Backspace, Delete, Tab, Enter, and arrow keys
  const controlKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  // If the key does not match the regex and is not a control key, prevent the input
  if (!regex.test(e.key) && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};

// Allow Text only with no space
export const handleTextNoSpaceKeyDown = (e) => {
  // Allow only alphabetic characters (a-z, A-Z)
  const regex = /^[a-zA-Z]$/;

  // Allow control keys such as Backspace, Delete, Tab, Enter, and arrow keys
  const controlKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  // If the key does not match the regex and is not a control key, prevent the input
  if (!regex.test(e.key) && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};

// Allow Text only with space
export const handleTextKeyDown = (e) => {
  const regex = /^[a-zA-Z\s]$/;

  // Allow control keys such as Backspace, Delete, Tab, Enter, and arrow keys
  const controlKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  // If the key does not match the regex and is not a control key, prevent the input
  if (!regex.test(e.key) && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};

// Allow Number and Dot only with no space

export const handleNumDotNoSpaceKeyDown = (e) => {
  const regex = /^[0-9.-]$/;

  // Allow control keys such as Backspace, Delete, Tab, Enter, and arrow keys
  const controlKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Enter",
    "Escape",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
  ];

  // Prevent space explicitly
  if (e.key === " ") {
    e.preventDefault();
  }

  // If the key does not match the regex and is not a control key, prevent input
  if (!regex.test(e.key) && !controlKeys.includes(e.key)) {
    e.preventDefault();
  }
};


export function isEmptyObject(obj) {
  for (let prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}
export function isNotEmpty(str) {
  const pattern = /\S+/;
  return pattern.test(str); // returns a boolean
}

export function isEmpty(str) {
  return !isNotEmpty(str) || str === undefined;
}

export function isEmptyCheck(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)
  );
}

export function isNotEmptyCheck(value) {
  return !isEmptyCheck(value);
}

// Function to compare strings for table sorting
export function compareStrings(a, b) {
  const resourceA = a ? a.toString().toLowerCase() : '';
  const resourceB = b ? b.toString().toLowerCase() : '';
  return resourceA.localeCompare(resourceB);
};

// export async function SetTimeOut() {
//   const localStoreData = useSelector((state) => state.Agency.localStoreData);
//     console.log("ResetTimer", localStoreData)
//     try {
//         const token = sessionStorage.getItem("access_token");
//         if (!token) return;

//         const response = await fetch(`${APIurl}/Personnel/GetData_UpdatePersonnel`, {
//             method: 'POST', // Changed from GET to POST
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ PINID: localStoreData?.PINID }) // Sending PINID in the request body
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const res = await response.json();
//         const parsedData = JSON.parse(res?.data?.data);
//         const data = parsedData?.Table;
//         console.log("API Response:", data);

//         const { setSessionTimeOut } = useContext(LoginContext);
//         setSessionTimeOut(data?.[0]?.SessionTimeOut);
//     } catch (error) {
//         console.error("Error fetching session timeout data:", error);
//     }
// }

