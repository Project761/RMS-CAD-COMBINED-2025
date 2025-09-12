export const OffenderUseError_N = '{207} Mutually exclusive values for offenderusing';
export const OffenderUseError_Other = '{204} Offender Using must be A,C,D or N';
export const BiasError = '{204} Biascode invalid';
export const WeaponError = '{207} Mutually exclusive values for Weapon Code';
export const MethodEntryError = '{204} Method of Entry is invalid';
export const MethodEntryError2 = '{253} Method of Entry Must be present when offense code is 220';
export const Bias_90C_Error = 'Bias Must be ‘None’ when the Nibrs code is 09C - Justifiable Homicide.';
export const LocationError = '{257} Number Of Premises Must be present Only with an offense code of 220 and a location type of 14 or 19';
export const NotApplicableError = 'After selecting Not Applicable then the user should not be able to select the other values';
export const MethodOFEntryMandataryError = "When UCR Offense Code of '220-Burglary/Breaking & Entering' has been entered Method of Entry Must be present";
export const CrimeActivitySelectNoneError = "Select None/Unknown in Criminal Activity";
export const CrimeActivitySelectSuitableCodesError = "Select suitable Criminal Activities for selected  nibrs Codes ";
export const ValidateNibrsCodeError = "Select Valid Nibrs Codes";
export const ValidateBiasCodeError = "Select Valid Bias";
export const HomicideOffenseUnknowError = "Invalid Weapon UnKnown for specified Homicide offense";
export const InvalidWeaponCode_For13B_OffenceError = "Invalid Weapon Code with an Offense of 13B";
export const CyberspaceLocationError = "58 = Cyberspace can only be entered with suitable  Offense Code";
export const AttemptCompleteError = "UCR Offense Code is an Assault, Homicide, or 360 = 'Failure to Register as a Sex Offender'"

export const suitable_Gang_CrimeCode_Error = "Criminal Activity Code must be with in J,G,N with '09A 09B 100 120 11A 11B 11C 11D 13A 13B 13C' Offence Code";

export const ErrorTooltip = ({ ErrorStr }) => (<span className='hovertext' style={{ marginLeft: '15px' }} data-hover={ErrorStr} ><i className='fa fa-exclamation-circle'></i></span>);

export const TableErrorTooltip = ({ ErrorStr, value }) => { return (<span className='hovertext' data-hover={ErrorStr} >{value} <i className='fa fa-exclamation-circle'></i></span>) };

export const ErrorShow = ({ ErrorStr }) => (<span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{ErrorStr}</span>);

// bias 90C
export const ErrorStyle_NIBRS_09C = (code) => {
    const colour_Styles_NIBRS = {
        control: (styles) => ({
            ...styles,
            backgroundColor: code === '09C' ? "#F29A9A" : "#FFE2A8",
            minHeight: 58,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles_NIBRS;
};

// CriminalActivity
export const ErrorStyle_CriminalActivity = (status) => {
    const colour_Styles_CriminalActivity = {
        control: (styles) => ({
            ...styles,
            backgroundColor: status ? "#F29A9A" : "#FFE2A8",
            minHeight: 58,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles_CriminalActivity;
};

export const Style_Without_Color = () => {
    const colour_Styles_CriminalActivity = {
        control: (styles) => ({
            ...styles,
            // backgroundColor: status ? "#F29A9A" : "#FFE2A8",
            minHeight: 58,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles_CriminalActivity;
};

// custuom style withoutColor
const customStylesWithOutColor = {
    control: base => ({
        ...base,
        minHeight: 58,
        fontSize: 14,
        margintop: 2,
        boxShadow: 0,
    }),
};

//  use in any BasicInfo 
export const ErrorStyleWeapon = (code) => {
    const colour_Styles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: code === '99' ? "#F29A9A" : '#fff',
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles;
};

//  use in assaultInjuryCom
export const ErrorStyleOffenderUse = (data) => {
    const res = data?.filter((obj) => {
        if (obj.code === 'N') return 'N'
        else if (obj.code === 'A' || obj.code === 'C' || obj.code === 'D') { return obj.code }
        else return "Not"
    })
    return res[0]?.code;
};

//offence BasicInformation
export const checkWeaponTypeIsRequire = (code, stateCode) => {
    if (
        (
            code === '09A' ||
            code === '09B' ||
            code === '09C' ||
            code === '100' ||
            code === '11A' ||
            code === '11B' ||
            code === '11C' ||
            code === '11D' ||
            code === '120' ||
            code === '13A' ||
            code === '13B' ||
            code === '210' ||
            code === '520' ||
            code === '521' ||
            code === '522' ||
            code === '526' ||
            code === '64A' ||
            code === '64B'
        ) && stateCode === 'TX'
    ) { return true; }
    else return false;
}

export const checkWeaponTypeValidate = (nibrsCode, weaponSelectedCodeArray, type, stateCode) => {
    // console.log("%c🚀 ~ checkWeaponTypeValidate ~ nibrsCode:" + nibrsCode, "padding: 6px; font-weight: bold; background-color: #2ecc71; color: black'");

    const weaponSelArr = new Set(weaponSelectedCodeArray)
    if (nibrsCode === '09A' || nibrsCode === '09B' || nibrsCode === '09C') {
        if (weaponSelArr.has("99")) {
            // console.log("weapnselarr", weaponSelArr.has("99"));
            return type === 'Color' ? ErrorStyle_CriminalActivity(true) : <ErrorTooltip ErrorStr={HomicideOffenseUnknowError} />
        }
    } else {

    }

    if (nibrsCode === '13B') {
        if (weaponSelArr.has("99") || weaponSelArr.has("40") || weaponSelArr.has("90") || weaponSelArr.has("95")) {
            // console.log(nibrsCode === '13B')
            return type === 'Color' ? ErrorStyle_CriminalActivity(false) : <></>
        } else {
            return type === 'Color' ? customStylesWithOutColor : <ErrorTooltip ErrorStr={InvalidWeaponCode_For13B_OffenceError} />
        }
    } else {

    }

    if ((nibrsCode === '09A' || nibrsCode === '09B' || nibrsCode === '09C' || nibrsCode === '100' || nibrsCode === '11A' || nibrsCode === '11B' || nibrsCode === '11C' || nibrsCode === '11D' || nibrsCode === '120' || nibrsCode === '13A' || nibrsCode === '13B' || nibrsCode === '210' || nibrsCode === '520' || nibrsCode === '521' || nibrsCode === '522' || nibrsCode === '526' || nibrsCode === '64A' ||
        nibrsCode === '64B'
    ) && stateCode === 'TX') {
        return type === 'Color' ? ErrorStyle_CriminalActivity(false) : ""
    } else {
        return false;
    }

}

export const checkMethodOfEntryIsRequire = (code, stateCode) => {
    if (code === '220' && stateCode === 'TX') { return true; }
    else { return false; }
}

// const nibrsCodeValue = ["09A", "09B", "100", "120", "11A", "11B", "11C", "11D", "13A", "13B", "13C"]

export const checkCriminalActivityIsRequire = (code, stateCode) => {
    if (
        (
            code === '250' ||
            code === '280' ||
            code === '30C' ||
            code === '35A' ||
            code === '35B' ||
            code === '39C' ||
            code === '370' ||
            code === '49A' ||
            code === '520' ||
            code === '521' ||
            code === '522' ||
            code === '526' ||
            code === '58A' ||
            code === '58B' ||
            code === '61A' ||
            code === '61B' ||
            code === '620' ||
            code === '720'
        ) && stateCode === 'TX'
    ) { return true; }
    else return false;
}

export const checkCrimeActiSuitableCode = (nibrsCode, crimeActSelectedCodeArray, stateCode, type) => {
    // console.log("🚀 ~ checkCrimeActiSuitableCode ~ type:", type);

    const crimeActivityCodeArray = ["B", "C", "D", "E", "O", "P", "T", "U"]
    const crimeActivityCodeArraySet = new Set(crimeActivityCodeArray);
    const crimeActivityCommanCodes = crimeActSelectedCodeArray?.filter(value => crimeActivityCodeArraySet.has(value));

    const AnimalCruelty = ['A', 'F', 'I', 'S']
    const AnimalCrueltyCodeArraySet = new Set(AnimalCruelty);
    const AnimalCrueltyCommanCodes = crimeActSelectedCodeArray?.filter(value => AnimalCrueltyCodeArraySet.has(value));

    const arr = crimeActSelectedCodeArray?.filter((val) => { if (val === "J" || val === "G" || val === "N") { return val } });

    switch (nibrsCode) {
        case '250':
        case '280':
        case '30C':
        case '35A':
        case '35B':
        case '39C':
        case '370':
        case '49A':
        case '520':
        case '521':
        case '522':
        case '526':
        case '58A':
        case '58B':
        case '61A':
        case '61B':
        case '620': {
            if ((AnimalCrueltyCommanCodes?.length === 0) && (crimeActivityCommanCodes?.length > 0) && (stateCode === 'TX')) {
                return false
            } else {
                return crimeActSelectedCodeArray?.length > 0 ? type === 'Color' ? ErrorStyle_CriminalActivity(true) : <ErrorTooltip ErrorStr={CrimeActivitySelectSuitableCodesError} /> : false;
            }
        }
        case '720': {
            if ((crimeActivityCommanCodes?.length === 0) && (AnimalCrueltyCommanCodes?.length > 0) && (stateCode === 'TX')) {
                return false
            } else {
                return crimeActSelectedCodeArray?.length > 0 ? type === 'Color' ? ErrorStyle_CriminalActivity(true) : <ErrorTooltip ErrorStr={CrimeActivitySelectSuitableCodesError} /> : false;
            }
        }
        case "09A":
        case "09B":
        case "100":
        case "120":
        case "11A":
        case "11B":
        case "11C":
        case "11D":
        case "13A":
        case "13B":
        case "13C": {
            if (arr?.length > 0 && (stateCode === 'TX')) {
                return false
            } else {
                return crimeActSelectedCodeArray?.length > 0 ? type === 'Color' ? ErrorStyle_CriminalActivity(true) : <ErrorTooltip ErrorStr={suitable_Gang_CrimeCode_Error} /> : false;
            }
        }
        default: return false
    }
}

export const check_GangCrime_CrimeCode = (nibrsCode, crimeActSelectedCodeArray, type) => {

    const nibrsCodeArray = ["09A", "09B", "100", "120", "11A", "11B", "11C", "11D", "13A", "13B", "13C"]

    const arr = crimeActSelectedCodeArray?.filter((val) => { if (val === "J" || val === "G" || val === "N") { return val } });

    if (arr?.length > 0) {
        if (nibrsCodeArray.includes(nibrsCode)) {
            return false;
        } else {
            return type === 'Color' ? ErrorStyle_CriminalActivity(true) : <ErrorTooltip ErrorStr={suitable_Gang_CrimeCode_Error} />
        }
    } else {
        return false
    }

    // if (nibrsCodeArray.includes(nibrsCode)) {
    //     const arr = crimeActSelectedCodeArray?.filter((val) => {
    //         if (val != "J" && val != "G" && val != "N") {
    //             return val
    //         }
    //     });
    //     return arr?.length > 0 ? type === 'Color' ? ErrorStyle_CriminalActivity(true) : <ErrorTooltip ErrorStr={suitable_Gang_CrimeCode_Error} /> : ''
    // } else {
    //     return false
    // }
}

export const check_Valid_Nibrs_Code = (code) => {
    const validNibrsCode = ['200', '13A', '13B', '13C', '510', '220', '35A', '35B', '270', '210', '250', '26A', '26B', '26C', '26D', '26E', '39A', '39B', '39C', '39D', '09A', '09B', '09C', '100', '23A', '23B', '23C', '23D', '23E', '23F', '23G', '23H', '240', '370', '40A', '40B', '120', '11A', '11B', '11C', '11D', '36A', '36B', '280', '290', '520', '64A', '64B', '40C'
    ];
    // console.log(validNibrsCode.includes(code))
    if (code) {
        if (validNibrsCode.includes(code)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

export const check_NibrsCode_09C = (code, offenceData) => {
    if (code === '09C') {
        const fbiCode = offenceData?.map((item) => { return item?.FBICode });
        const nibrsCodeArray = ["09C", "90A", "90B", "90C", "90D", "90G", "90J", "90K", "90L", "90M", "90Z"]
        const unmatchedCodes = fbiCode?.filter(code => !nibrsCodeArray.includes(code));

        return unmatchedCodes?.length > 0 ? 'Within this 09C offense code there should not be any other UCR offense code' : false;
    } else {
        return false
    }

}

export const check_Valid_Bias_Code = (codeArray) => {

    const validBiasCode = ["11", "12", "13", "14", "15", "16", "21", "22", "23", "24", "25", "26", "27", "28", "29",
        "31", "32", "33", "41", "42", "43", "44", "45", "51", "52", "61", "62", "71", "72", "81", "82", "83", "84", "85", "88", "99"
    ];
    if (codeArray?.length > 0) {
        const nonMatchingValues = codeArray.filter(value => !validBiasCode.includes(value));
        if (nonMatchingValues?.length > 0) {
            return true;
        } else {
            return false;
        }

    } else {
        return false;
    }
}

export const chekLocationType = (nibrsCode, primaryLocationCode) => {
    const nibrsCodes = [
        '210', '250', '270', '280', '290', '370', '510', '26A', '26B', '26C', '26D', '26E', '26F', '26G', '26H', '39A', '39B', '39C', '13C', '35A', '35B', '520', '521', '526', '64A', '64B', '40A', '40B', '40C', '101', '103'
    ]
    if (!nibrsCodes?.includes(nibrsCode) && primaryLocationCode === '58') {
        return true
    } else {
        return false
    }
}
