// Agency Name Filter
export const Agency_Name_Filter = (data, searchValue, type) => {
    if (type === 'Contains') {
        if(searchValue === ''){
            return data
        } else {
            const result = data.filter((item) => {
                return item.Agency_Name.toLowerCase().includes(searchValue.toLowerCase())
            });
            return result
        }
    }  
    if (type === 'is equal to') {
        if (searchValue === '') {
            return data
        } else {
            const result = data.filter((item) => {
                return item.Agency_Name.toLowerCase() === searchValue.toLowerCase();
            });
            return result
        }
    }
    if (type === 'is not equal to') {
        const result = data.filter((item) => {
            return item.Agency_Name !== searchValue;
        });
        return result
    }
    if (type === 'End with') {
        const result = data.filter(item => String(item.Agency_Name.toLowerCase()).endsWith(searchValue.toLowerCase()));
        return result
    }
    if (type === 'Starts With') {
        const result = data.filter(item => String(item.Agency_Name.toLowerCase()).startsWith(searchValue.toLowerCase()));
        return result
    }
}

// Filter By Agency_ORI
export const Agency_ORI_Filter = (data, searchValue, type) => {
    if (type === 'Contains') {
        const result = data.filter((item) => {
            return item.ORI.toLowerCase().includes(searchValue.toLowerCase())
        });
        return result
    }
    if (type === 'is equal to') {
        if (searchValue === '') {
            return data
        } else {
            const result = data.filter((item) => {
                return item.ORI.toLowerCase() == searchValue.toLowerCase();
            });
            return result
        }
    }
    if (type === 'is not equal to') {
        const result = data.filter((item) => {
            return item.ORI.toLowerCase() !== searchValue.toLowerCase();
        });
        return result
    }
    if (type === 'End with') {
        const result = data.filter(item => String(item.ORI.toLowerCase()).endsWith(searchValue.toLowerCase()));
        return result
    }
    if (type === 'Starts With') {
        const result = data.filter(item => String(item.ORI.toLowerCase()).startsWith(searchValue.toLowerCase()));
        return result
    }
}

// Filter By Agency_Phone
export const Agency_Phone_Filter = (data, searchValue, type) => {
    if (type === 'Contains') {
        const result = data.filter((item) => {
            return item.Agency_Phone.includes(searchValue)
        });
        return result
    }
    if (type === 'is equal to') {
        if (searchValue === '') {
            return data
        } else {
            const result = data.filter((item) => {
                return item.Agency_Phone == searchValue;
            });
            return result
        }

    }
    if (type === 'is not equal to') {
        const result = data.filter((item) => {
            return item.Agency_Phone !== searchValue;
        });
        return result
    }
    if (type === 'End with') {
        const result = data.filter(item => String(item.Agency_Phone).endsWith(searchValue));
        return result
    }
    if (type === 'Starts With') {
        const result = data.filter(item => String(item.Agency_Phone).startsWith(searchValue));
        return result
    }
}

// Agency Field Permision Filter
export const Agency_Field_Permistion_Filter = (data, searchValue) => {
    const result = data.filter((item) => {
        return item.Description === searchValue;
    });
    return result
}

export const AllAgencyFilter = (e, data, ORI, oriType, Name, nameType, Phone, phoneType) => {
    if(ORI!=''){
       return Agency_ORI_Filter(data, ORI, oriType)
    }
    if(Name!=''){
       return Agency_Name_Filter(data, Name, nameType)
    }
    if(Phone!=''){
        return Agency_Phone_Filter(data, Phone, phoneType)
    }
}