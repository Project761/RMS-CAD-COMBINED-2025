import React, { useState, useEffect } from "react";
import { fetchPostData } from "../../../../hooks/Api";
import { useLocation } from "react-router-dom";
import { base64ToString } from "../../../../Common/Utility";

const GeneratePassword = ({ clickedRow, setValue }) => {

    const [uppercaseCount, setUppercaseCount] = useState(1);
    const [lowercaseCount, setLowercaseCount] = useState(1);
    const [numberCount, setNumberCount] = useState(1);
    const [specialCount, setSpecialCount] = useState(1);
    const [minPasswordLength, setMinPasswordLength] = useState(8);

    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "@#$%&*-";
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));
    const get_PasswordSetting_List = (aId) => {
        const val = { AgencyID: aId }
        fetchPostData('PasswordSetting/PasswordSetting_getData', val)
            .then((res) => {
                if (res) {
                    setUppercaseCount(res?.[0]?.MinUpperCaseInPassword);
                    setLowercaseCount(res?.[0]?.MinLowerCaseInPassword);
                    setNumberCount(res?.[0]?.MinNumericDigitsInPassword);
                    setSpecialCount(res?.[0]?.MinSpecialCharsInPassword);
                    setMinPasswordLength(res?.[0]?.MinPasswordLength);
                }
            })
    }

    useEffect(() => {
        if (aId) {
            get_PasswordSetting_List(aId);
        }
    }, [aId]);

    const getRandomChar = (charSet) => charSet.charAt(Math.floor(Math.random() * charSet.length));


    const hasSequentialChars = (password) => {
        for (let i = 0; i < password.length - 2; i++) {
            let char1 = password.charCodeAt(i);
            let char2 = password.charCodeAt(i + 1);
            let char3 = password.charCodeAt(i + 2);

            if (
                (char2 === char1 + 1 && char3 === char2 + 1) ||
                (char2 === char1 - 1 && char3 === char2 - 1)
            ) {
                return true;  // Found a sequential pattern
            }
        }

        // No sequential characters found
        return false;
    };

    const generateCustomPassword = (length) => {
        let tempPassword = new Set();

        const addUniqueChar = (charSet) => {
            let char;
            do {
                char = getRandomChar(charSet);
            } while (tempPassword.has(char));
            tempPassword.add(char);
        };

        for (let i = 0; i < uppercaseCount && tempPassword.size < length; i++) addUniqueChar(uppercaseChars);
        for (let i = 0; i < lowercaseCount && tempPassword.size < length; i++) addUniqueChar(lowercaseChars);
        for (let i = 0; i < numberCount && tempPassword.size < length; i++) addUniqueChar(numberChars);
        for (let i = 0; i < specialCount && tempPassword.size < length; i++) addUniqueChar(specialChars);

        let allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
        while (tempPassword.size < length) {
            addUniqueChar(allChars);
        }

        let generatedPassword = Array.from(tempPassword).sort(() => Math.random() - 0.5).join("");

        while (hasSequentialChars(generatedPassword)) {
            tempPassword.clear();
            for (let i = 0; i < uppercaseCount && tempPassword.size < length; i++) addUniqueChar(uppercaseChars);
            for (let i = 0; i < lowercaseCount && tempPassword.size < length; i++) addUniqueChar(lowercaseChars);
            for (let i = 0; i < numberCount && tempPassword.size < length; i++) addUniqueChar(numberChars);
            for (let i = 0; i < specialCount && tempPassword.size < length; i++) addUniqueChar(specialChars);

            while (tempPassword.size < length) {
                addUniqueChar(allChars);
            }

            generatedPassword = Array.from(tempPassword).sort(() => Math.random() - 0.5).join("");
        }

        return generatedPassword;
    };



    const [passwords, setPasswords] = useState([]);

    useEffect(() => {
        if (minPasswordLength) {
            const generatedPasswords = [
                generateCustomPassword(minPasswordLength),
                generateCustomPassword(minPasswordLength),
            ];
            setPasswords(generatedPasswords);
        }
    }, [minPasswordLength, clickedRow]);

    return (
        <div className="container text-center mt-1 p-1 border rounded shadow">
            <div className="d-flex flex-wrap justify-content-center gap-2">
                {passwords.map((pwd, index) => (
                    <span
                        key={index}
                        className="badge bg-primary fs-6 p-2 ml-1"
                        onClick={() => setValue(pre => { return { ...pre, Password: pwd, ReEnterPassword: pwd } })}
                    >
                        {pwd}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default GeneratePassword;
