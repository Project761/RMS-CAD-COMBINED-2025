import moment from 'moment';
import Isequal from '../../../img/Isequal.png'
import Isnotequal from '../../../img/Isnotequal.png'
import Contains from '../../../img/Contains.png'

// Generic filter operation functions
const filterOperations = {
    "Contains": (value, searchValue) => value?.toLowerCase().includes(searchValue.toLowerCase()),
    "is equal to": (value, searchValue) => value?.toLowerCase() === searchValue.toLowerCase(),
    "is not equal to": (value, searchValue) => value?.toLowerCase() !== searchValue.toLowerCase(),
    "Starts With": (value, searchValue) => String(value?.toLowerCase()).startsWith(searchValue.toLowerCase()),
    "End with": (value, searchValue) => String(value?.toLowerCase()).endsWith(searchValue.toLowerCase())
};

// Generic filter function for multiple fields and values
const genericFilter = (data, searchValues, fields, type, operator = 'AND') => {
    // If all search values are empty, return original data
    if (searchValues.every(value => !value || value === "")) {
        return data;
    }

    const filterFn = filterOperations[type];
    if (!filterFn) return data;

    return data.filter((item) => {
        const results = [];
        
        for (let i = 0; i < searchValues.length; i++) {
            const searchValue = searchValues[i];
            const field = fields[i];
            
            if (searchValue && searchValue !== "" && item[field]) {
                results.push(filterFn(item[field], searchValue));
            } else if (!searchValue || searchValue === "") {
                // For empty search values, consider as true for AND operations
                results.push(operator === 'AND' ? true : false);
            }
        }

        // Apply operator logic
        if (operator === 'AND') {
            return results.length > 0 && results.every(result => result === true);
        } else {
            return results.some(result => result === true);
        }
    });
};

export const SearchFilter = (data, searchValue1, searchValue2, type, firstFieldValue, secondfirstFieldValue) => {
    return genericFilter(data, [searchValue1, searchValue2], [firstFieldValue, secondfirstFieldValue], type);
};

export const Three_Search_Filter = (data, searchValue1, searchValue2, searchValue3, type, firstFieldValue, secondfirstFieldValue, thrdFieldValue) => {
    return genericFilter(data, [searchValue1, searchValue2, searchValue3], [firstFieldValue, secondfirstFieldValue, thrdFieldValue], type);
};

export const One_Search_Filter = (data, searchValue, type, firstFieldValue, secondfirstFieldValue) => {
    return genericFilter(data, [searchValue], [firstFieldValue, secondfirstFieldValue], type, 'OR');
};

export const One_Search_Filter_OneValue = (data, searchValue, type, firstFieldValue) => {
    return genericFilter(data, [searchValue], [firstFieldValue], type);
};

export const One_Value_Search_Filter = (data, searchValue, type, firstFieldValue) => {
    return genericFilter(data, [searchValue], [firstFieldValue], type);
};

// Special date filter function - handles mixed types with date comparison
export const Three_Search_FilterWith_Date = (data, searchValue1, searchValue2, searchValue3, type1, type2, type3, firstFieldValue, secondfirstFieldValue, thrdFieldValue) => {
    // If all search values are empty, return original data
    if (!searchValue1 && !searchValue2 && !searchValue3) {
        return data;
    }

    return data.filter((item) => {
        const results = [];
        
        // Handle first field
        if (searchValue1 && item[firstFieldValue]) {
            const filterFn = filterOperations[type1];
            if (filterFn) {
                results.push(filterFn(item[firstFieldValue], searchValue1));
            }
        }
        
        // Handle second field
        if (searchValue2 && item[secondfirstFieldValue]) {
            const filterFn = filterOperations[type2];
            if (filterFn) {
                results.push(filterFn(item[secondfirstFieldValue], searchValue2));
            }
        }
        
        // Handle third field (date field)
        if (searchValue3 && item[thrdFieldValue]) {
            if (type3 === "Contains") {
                const formattedDate = moment(item[thrdFieldValue]).format("MM/DD/YYYY");
                const formattedSearchDate = moment(searchValue3).format("MM/DD/YYYY");
                results.push(formattedDate === formattedSearchDate);
            } else {
                const filterFn = filterOperations[type3];
                if (filterFn) {
                    results.push(filterFn(item[thrdFieldValue], searchValue3));
                }
            }
        }

        // Return true if any condition matches (OR logic for this specific use case)
        return results.length > 0 && results.some(result => result === true);
    });
};

// Return Icon
export const SendIcon = (name) => {
    const filterIcon = { 'Contains': Contains, 'is equal to': Isequal, 'is not equal to': Isnotequal, 'Starts With': Contains, 'End with': Contains }
    return filterIcon[name]
}
