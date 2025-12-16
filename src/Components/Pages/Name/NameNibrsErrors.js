// Name -----> Victem -----------
export const NameVictimError = '{404} Invalid Victim Type ';
export const NameVictimOffenses = '{401} Atleast one UCR Offense Code must be present - Mandatory field ';
export const VictimGovermentError = 'Type of Victim must be G = Government for offenses: 26H, 521, 522, 526, 58A, 58B, 61A, 61B, 620';
export const policeOfficerError = '(Type of Victim) cannot be L = Police Officer UNLESS Victim Connected to UCR Offense Code is one of the following';
export const SocietyPublicError = 'Age of Victim , Sex of Victim and Race of Victim must be entered. WHEN Type of Victim is person or Police Officer';
export const StatutoryRapeError = '(Age of Victim) should be under 18 WHEN (Victim Connected to UCR Offense Code) is 36B = Statutory Rape.';
export const ResidentStatusError = ' Resident Status of Victim is must be entered when Victim is Person or Police Officer';
export const VectimOffenderSpouceError = 'Invalid Age: Victim cannot be under 13 with "Spouse" as Relationship to Offender.';
export const VictimCantBeSocietyError = 'Entry For Type Of Victim Cannot Be S When The Crime Against Property Offense Code Is Entered';
export const VictimPoliceOfficerError = 'Age of Police Officer in not less than 17 or greater than 98';
export const SexOfVictimError = '(Sex of Victim) must be M = Male or F = Female to be connected to offense codes of 11A = Rape and 36B = Statutory Rape.';
export const LawOfficerError = 'Type of Victim cant not be "L" Unless offence code is 09A, 13A, 13B, 13C ';

export const CrimeAgainstSocietyError = 'when Type of Victim  Society/Public offence must be Crimes Against Society.';
export const CrimeAgainstPersonError = 'Type of Victim Must have a value of Person or Police Officer WHEN Victim Connected to UCR Offense Code contains a Crime Against Person';
export const CrimeAgainstPropertyError = "offense code related to Crime Against Property THEN Type of Victim Cannot have a value of  Society/Public"

export const ErrorTooltip = (ErrorStr) => (<span className='hovertext' style={{ marginLeft: '15px' }} data-hover={ErrorStr ? ErrorStr : ''} ><i className='fa fa-exclamation-circle'></i></span>);

export const ErrorTooltipComp = ({ ErrorStr }) => (<span className='hovertext' style={{ marginLeft: '15px' }} data-hover={ErrorStr} ><i className='fa fa-exclamation-circle'></i></span>);

export const RelationGridErrorTooltip = ({ ErrorStr, value }) => { return (<span className='hovertext' data-hover={ErrorStr} >{value} <i className='fa fa-exclamation-circle'></i></span>) };

export const ErrorShow = ({ ErrorStr }) => (<span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{ErrorStr ? ErrorStr : ''}</span>);

export const ErrorStyle = (type) => {
    const colour_Styles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: type ? "rgb(255 202 194)" : "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles;
};

export const ErrorStyle_VictimHome = (status) => {
    const colour_Styles_CriminalActivity = {
        control: (styles) => ({
            ...styles,
            backgroundColor: status ? "rgb(255 202 194)" : "",
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles_CriminalActivity;
};

export const ErrorStyle_VictimHomeWithReq = (status) => {
    const colour_Styles_CriminalActivity = {
        control: (styles) => ({
            ...styles,
            backgroundColor: status ? "#fce9bf" : "",
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles_CriminalActivity;
};

export const NibrsStylesRelationShip = (status) => {
    const colour_Styles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: status ? "rgb(255 202 194)" : "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles;
};

export const victimNibrsErrors = (victimCode, offenceCodes, type = 'Color', isCrimeAgainsPerson, isCrimeAgainstProperty, isCrimeAgainstSociety, nameSingleData) => {

    // policeOfficer
    const policeOfficerCodeArr = ['09A', '09B', '09C', '11A', '11B', '11C', '11D', '100', '36A', '36B', '13A', '64A', '64B', '13B', '13C'];
    const policeOfficerCodeSet = new Set(policeOfficerCodeArr);
    const PoliceOfficerCommanCodes = offenceCodes?.filter(value => policeOfficerCodeSet?.has(value));

    // Law Enforcement Officer
    const LawOfficerCodeArr = ['09A', '13A', '13B', '13C'];
    const LawOfficerCodeSet = new Set(LawOfficerCodeArr);
    const lawOfficerCommanCodes = offenceCodes?.filter(value => LawOfficerCodeSet?.has(value));

    // Goverment
    const GovermentCodeArr = ['26H', '521', '522', '526', '58A', '58B', '61A', '61B', '620'];
    const GovermentCodeSet = new Set(GovermentCodeArr);
    const GovermentCommanCodes = offenceCodes?.filter(value => GovermentCodeSet?.has(value));

    switch (victimCode) {
        case 'I': {
            // if (!isCrimeAgainsPerson) {
            //     return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(CrimeAgainstPersonError);
            // } else
            if (!nameSingleData[0]?.ResidentID) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(ResidentStatusError);
            } else if (!nameSingleData[0]?.Gender_Code || !nameSingleData[0]?.Race_Code || !nameSingleData[0]?.AgeFrom) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(SocietyPublicError);
            } else {
                return type === 'Color' ? ErrorStyle(false) : <></>;
            }
        }
        case 'L': {
            // if (!isCrimeAgainsPerson) {
            //     return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(CrimeAgainstPersonError);

            // } else 
            if (!PoliceOfficerCommanCodes || PoliceOfficerCommanCodes?.length === 0) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(policeOfficerError);

            } else if (!lawOfficerCommanCodes || lawOfficerCommanCodes?.length === 0) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(LawOfficerError);

            } else if (!nameSingleData[0]?.ResidentID) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(ResidentStatusError);

            } else if (!nameSingleData[0]?.Gender_Code || !nameSingleData[0]?.Race_Code || !nameSingleData[0]?.AgeFrom) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(SocietyPublicError);

            } else if (nameSingleData[0]?.AgeFrom < 17 || nameSingleData[0]?.AgeFrom > 98) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(VictimPoliceOfficerError);

            } else {
                return type === 'Color' ? ErrorStyle(false) : <></>;
            }
        }
        case 'S': {
            if (isCrimeAgainstProperty) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(CrimeAgainstPropertyError);

            } else if (!isCrimeAgainstSociety) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(CrimeAgainstSocietyError);

            } else {
                return type === 'Color' ? ErrorStyle(false) : <></>;
            }
        }
        case 'G': {
            if (!GovermentCommanCodes || GovermentCommanCodes.length === 0) {
                return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(VictimGovermentError);

            } else {
                return type === 'Color' ? ErrorStyle(false) : <></>;
            }
        }
        default: return type === 'Color' ? ErrorStyle(false) : <></>;
    }
}

export const assult_Type_Nibrs_Errors = (assultCodeArr, offenceCodesArr, type = 'Color') => {
    if (offenceCodesArr?.includes('09A')) {
        if (assultCodeArr?.length > 0) {
            const arr = assultCodeArr?.filter((val) => {
                if (val != "01" && val != "02" && val != "03" && val != "04" && val != "05" && val != "06" && val != "07" && val != "08" && val != "09" && val != "10") {
                    return val
                }
            });
            return arr?.length > 0 ? type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Invalid Aggravated Assault/Homicide for 09A offense'} /> : type === 'Color' ? ErrorStyle_VictimHome(false) : <> </>
        } else {
            return type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Assault code must be present for Offense 09A-09C,13A '} />;
        }
    }

    if (offenceCodesArr?.includes('09B')) {
        const arr = assultCodeArr?.filter((val) => {
            if (val != "30" && val != "31" && val != "32" && val != "33" && val != "34" && val != "02") {
                return val
            }
        });
        return arr?.length > 0 ? type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Invalid Aggravated Assault/Homicide for 09B offense'} /> : type === 'Color' ? ErrorStyle_VictimHome(false) : <> </>
    }

    if (offenceCodesArr?.includes('09C')) {
        if (assultCodeArr?.length > 0) {
            const arr = assultCodeArr?.filter((val) => {
                if (val != "20" && val != "21") {
                    return val
                }
            });
            return arr?.length > 0 ? type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Invalid Aggravated Assault/Homicide for 09C offense'} /> : type === 'Color' ? ErrorStyle_VictimHome(false) : <> </>
        } else {
            return type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Assault code must be present for Offense 09A-09C,13A '} />;
        }
    }


    if (offenceCodesArr?.includes('13A')) {
        if (assultCodeArr?.length > 0) {
            const arr = assultCodeArr?.filter((val) => {
                if (val != "01" && val != "02" && val != "03" && val != "04" && val != "05" && val != "06" && val != "07" && val != "08" && val != "09" && val != "10") {
                    return val
                }
            });
            return arr?.length > 0 ? type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Invalid Aggravated Assault/Homicide for 13A offense'} /> : type === 'Color' ? ErrorStyle_VictimHome(false) : <> </>
        } else {
            return type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Assault code must be present for Offense 09A-09C,13A '} />;
        }
    }

}

export const check_justifiy_Homicide = (assultCodeArr, justifiyArr, offenceCodes, type = 'Color') => {

    const justifyHomicideCodeArr = justifiyArr?.map((item) => item?.code)
    if (offenceCodes?.includes('09A')) {
        const arr = justifyHomicideCodeArr?.filter((val) => {
            if (val != 'A' && val != 'B' && val != 'C' && val != 'D' && val != 'E' && val != 'F' && val != 'G') {
                return val
            }
        })
        return arr?.length > 0 ? type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Missing valid JustHomicide Code'} /> : type === 'Color' ? ErrorStyle_VictimHome(false) : <> </>
    }

    if (assultCodeArr?.includes('20') || assultCodeArr?.includes('21')) {
        return justifiyArr?.length < 1 ?
            type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Justifiable Homicide is mandatory with a 20 or 21 entered in Assault Code'} />
            : type === 'Color' ? ErrorStyle_VictimHome(false) : <> </>
    } else {
        return false
    }

}

// Injury Type must be present - Mandatory field for 100,120,210,11A-D,13A-B. 
export const check_injuryType_Nibrs = (offenceCodes, victimInjuryID, victimCode, type = 'Color') => {

    const CodeArr = ['100', '120', '210', '11A', '11B', '11C', '11D', '13A', '13B',]

    if (check_hasCode(offenceCodes, CodeArr) && victimInjuryID?.length === 0) {
        return type === 'Color' ? ErrorStyle_VictimHome(true) : <ErrorTooltipComp ErrorStr={'Injury Type must be present for offence 100,120,210,11A-D,13A-B. '} />

    } else {
        if ((victimCode === 'I' || victimCode === 'L') && victimInjuryID?.length === 0) {
            return type === 'Color' ? ErrorStyle_VictimHomeWithReq(true) : <ErrorTooltipComp ErrorStr={'Injury Type must be present for victim I=Individual or L=Law Enforcement Officer.'} />

        } else {
            return type === 'Color' ? ErrorStyle_VictimHome(false) : <></>

        }
    }
}

export const checkOffenderIsUnknown = (RelationCode, SelectedNameData, type = 'Color') => {

    if (RelationCode) {
        if (SelectedNameData?.Race_Code === 'U' && SelectedNameData?.Gender_Code === 'U' && !SelectedNameData?.AgeFrom && RelationCode != 'RU') {
            return type === 'Color' ? NibrsStylesRelationShip(true) : <ErrorTooltipComp ErrorStr={'Offender Age/Sex/Race Are Unknown relationship Must Be Unknown.'} />
        } else {
            return type === 'Color' ? NibrsStylesRelationShip(false) : <> </>
        }
    } else {
        return type === 'Color' ? NibrsStylesRelationShip(false) : <> </>
    }
}

const check_hasCode = (Arr, CodeArr) => {
    if (Arr?.length > 0) {
        const GovermentCodeSet = new Set(Arr);
        const GovermentCommanCodes = CodeArr.filter(value => GovermentCodeSet.has(value));
        return GovermentCommanCodes?.length > 0
    } else {
        return false
    }

}