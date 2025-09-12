// for new type of security
export const typeofsecurityArray = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4], id: sponsor[col3], code: sponsor[col4] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4], code: sponsor[col4] })
        )
        return result
    }
}

export const Comman_changeArrayFormatBasicInfo = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4] + '-' + sponsor[Code], id: sponsor[col3], code: sponsor[col4] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4] + '-' + sponsor[Code], code: sponsor[col4] })
        )
        return result
    }
}

// new function DS Start //

export const Comman_changeArrayFormatReasonCode = (data, Id, Code, LabelField) => {
    return data?.map((item) => ({
        value: item[Id], label: item[LabelField], ReasonCode: item[Code]
    }));
};


export const fourColArrayReasonCode = (data, Id, Code, col3, col4) => {
    const result = data?.map((sponsor) => ({
        value: sponsor[Id], label: sponsor[Code], checkVictem: sponsor[col3], checkOff: sponsor[col4], reasonCode: sponsor.ReasonCode
    }));
    return result;
};


// new function formed //
export const offenseArray = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        return data?.map((item) => ({ value: item[Id], label: item[col4], id: item[col3], code: item[Code] }));
    } else {
        return data?.map((item) => ({ value: item[Id], label: item[col4], code: item[Code] }));
    }
};

export const threeColVictimOffenseArray = (data, Id, Code, col3) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], id: sponsor[col3] })
    )
    return result
}

export const Comman_changeArrayVictim = (data, Id, Code, type, col3, col4) => {

    // Check if the data is defined and is an array
    if (!Array.isArray(data)) {
        throw new Error("Invalid data: data should be an array.");
    }

    if (type === 'PretendToBeID') {
        const result = data.map((sponsor) => ({
        }));

        return result;
    } else {
        const result = data.map((sponsor) => ({
            value: sponsor[Id],
            label: sponsor[type],
            VictimID: sponsor.VictimID,
            NameID: sponsor.NameID,
            Name: sponsor.Name
        }));
        return result;
    }
}

export const threeColVictimInjuryArray = (data, Id, Code, col3) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[col3] + ' - ' + sponsor[Code], id: sponsor[col3] })
    )
    return result
}

export const Comman_changeArrayFormatJustfiableHomicide = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Code], label: sponsor[col3], id: sponsor[Id], code: sponsor[col4] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Code], label: sponsor[col4], code: sponsor[col4] })
        )
        return result
    }
}

export const AssaultInjuryComArrayFormat = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4], id: sponsor[col3] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[Code] })
        )
        return result
    }
}

export const Comman_changeArrayFormatChargeWeapon = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4], id: sponsor[col3], code: sponsor[col4] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4], code: sponsor[col4] })
        )
        return result
    }
}

export const Comman_changeArrayFormatwithoutcode = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4], id: sponsor[col3] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[Code] })
        )
        return result
    }
}

export const Comman_changeArrayFormatBasicInfowithoutcode = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4], id: sponsor[col3], code: sponsor[col4] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4], code: sponsor[col4] })
        )
        return result
    }
}

// new function formed end //

export const Comman_changeArrayFormat = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4] + '-' + sponsor[Code], id: sponsor[col3] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[Code] })
        )
        return result
    }
}
export const Comman_changeArrayFormat3 = (data, Id, Code, type, col3) => {
    if (type === 'shortCode') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col3] + '-' + sponsor[Code], shortCode: sponsor[col3] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col3] + '-' + sponsor[Code] })
        )
        return result
    }
}

export const login_changeArrayFormat = (data, Id, Code, PINID) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], PINID: sponsor[PINID], Is2FAEnabled: sponsor.Is2FAEnabled })
    )
    return result

}

export const Comman_changeArrayFormatNarrativeType = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[col4] + '-' + sponsor[Code], id: sponsor[col3] })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor[Id], label: sponsor[Code], type: sponsor[type] })
        )
        return result
    }
}

export const changeArrayFormat_Active_InActive = (data, Id, Code, col1) => {
    const result = data?.map((sponsor) => ({
        value: sponsor[Id],
        label: sponsor[Code],
        IsActive: sponsor[col1],
    }));
    return result;
};

export const Comman_changeArrayFormatMethodOfOperation = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
        const result = data?.map((sponsor) => ({ value: sponsor[col3], label: sponsor[col4], id: sponsor[Id] }));
        return result;
    } else {
        const result = data?.map((sponsor) => ({
            value: sponsor[col3], label: sponsor[col4] + '-' + sponsor[Code], code: sponsor[col4]
        }));
        return result;
    }
};

export const threeColArray = (data, Id, Code, col3) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], id: sponsor[col3] })
    )
    return result
}

export const fourColwithExtraCode = (data, Id, Code, col3, col4) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], id: sponsor[col3], code: sponsor[col4] })
    )
    return result
}

export const threeColArrayWithCode = (data, Id, Code, col3) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[col3] + ' - ' + sponsor[Code], id: sponsor[col3], code: sponsor[col3] })
    )
    return result
}

export const modifiedFbiCodeArray = (data, FBIID, Description, FederalSpecificFBICode, IsCrimeAgains_Person, IsCrimeAgainstProperty, IsCrimeAgainstSociety) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[FBIID], label: sponsor[FederalSpecificFBICode] + ' - ' + sponsor[Description], id: sponsor[FederalSpecificFBICode], code: sponsor[FederalSpecificFBICode], IsCrimeAgainsPerson: sponsor[IsCrimeAgains_Person], IsCrimeAgainstProperty: sponsor[IsCrimeAgainstProperty], IsCrimeAgainstSociety: sponsor[IsCrimeAgainstSociety] })
    )
    return result
}

export const threeColArrayWithId = (data, Id, Code, Id2) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], id2: sponsor[Id2] })
    )
    return result
}

export const fourColArray = (data, Id, Code, col3, col4) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], checkVictem: sponsor[col3], checkOff: sponsor[col4] })
    )
    return result
}

export const fourColArrayAlert = (data, Id, Code, col3, col4) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], priorityID: sponsor[col3], priorityDescription: sponsor[col4] })
    )
    return result
}

export const sixColArray = (data, Id, Code, col1, col2, col3, col4, col5, col6, col7) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], LastName: sponsor[col1], DateOfBirth: sponsor[col2], Gendre_Description: sponsor[col3], Race_Description: sponsor[col4], NameID: sponsor[col5], MasterNameID: sponsor[col6], AgeFrom: sponsor[col7] })
    )

    return result
}

export const sixColArrayArrest = (data, Id, Code, col1, col2, col3, col4, col5, col6, col7, col8) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], LastName: sponsor[col1], DateOfBirth: sponsor[col2], Gendre_Description: sponsor[col3], Race_Description: sponsor[col4], NameID: sponsor[col5], MasterNameID: sponsor[col6], AgeFrom: sponsor[col7], IsJuvenile: sponsor[col8] })
    )

    return result
}

export const CommanchangeArrayFormat_WithFilter = (data, Id, DropDownValue) => {
    if (DropDownValue) {
        const result = data?.map((sponsor) =>
            (sponsor[Id])
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        })
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
}

export const CommanGetIdDescription = (data, Id, DropDownValue) => {
    if (DropDownValue) {
        const result = data?.map((sponsor) =>
            (sponsor[Id])
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        })
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]?.label
    }
}

export const Comman_changeArrayFormat_With_Name = (data, Id, Code, name) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[Code], name: name })
    )
    return result
}

export const changeArray = (data, Id) => {
    const arr = []
    const result = data?.map((sponsor) => (arr.push(sponsor[Id])));
    return arr
}

export const findCode_WithId = (data, Id) => {
    if (data) {
        const result = data?.map((sponsor) => {
            if (sponsor.value === Id) {
                return sponsor.id
            }
        })
        const val = result.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
};

export const Get_DropDown_Code = (data, dropDownData, IdName) => {
    const result = data?.map((sponsor) =>
        (sponsor[IdName])
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}

export const dropDownDataModel = (data, value, label) => {
    const result = data?.map((item) => ({
        value: item[value],
        label: item[label],
    }));
    return result;
};

