import moment from "moment";

export const ReqTrim = (field) => {
	if (field.trim() == '') {
		return !field.trim() == ''
	} else {
		return true
	}
}

export const RequiredFieldIncident = (field) => {
	if (!field || field?.length === 0 || (typeof field === 'string' && field.trim() === "") || field === '' || field === null || field === undefined || field === 0 || field === "Invalid date") {
		return 'Required *';
	} else {
		return 'true'
	}
};

export const RequiredFieldIncidentOffender = (field) => {
	if (field.length > 0) {
		return 'true'
	} else {
		return 'Required *';
	}
};

export const RequiredFieldIncidentCarboTheft = (field) => {
	if (typeof field === 'boolean') {
		return 'true';
	}
	return 'Required *';
};


export const RequiredForYesNo = (field) => {
	if (field?.length === 0 || (typeof field === 'string' && field.trim() === "") || field === '' || field === null || field === undefined || field === 0 || field === "Invalid date") {
		return 'Required *';
	} else {
		return 'true'
	}
};



export const RequiredFieldHIN = (field, min, max) => {
	if (!field || field?.length === 0 || field === '' || field === null || field === undefined || field === 0 || field === "Invalid date") {
		return 'Required *';
	} else if (field.length < min) {
		return `Enter Minimum ${min} Characters`
	} else if (field.length > max) {
		return `Enter maximum ${max} Characters`
	} else {
		return 'true';
	}
};

export const Space_Not_Allow = (field) => {
	if (!field || field === null || field.trim() === '') {
		return 'Required *';
	}
	else if (/^\s|\s$/.test(field)) {
		return 'Space Not Allow';
	}
	else {
		return 'true';
	}
};

export const Space_Not_AllowSmt = (field) => {
	if (!field || field === null || field.trim() === '') {
		return 'true'
	}
	else if (/^\s|\s$/.test(field.trim())) {
		return 'Space Not Allow';
	}
	else {
		return 'true';
	}
};


export const RequiredFieldOnConditon = (field) => {
	if (field?.length === 0 || field === '' || field === undefined || field === 0) {
		return 'Required *';
	} else {
		return 'true'
	}
};

export const RequiredFieldArrestee = (field) => {
	if (field === '' || field === null || field === undefined) {
		return 'Required *';
	}
	else {
		return 'true'
	}
};

export const RequiredField = (field) => {
	if (!field || field === null || field === "Invalid date") {
		return 'Required *';
	} else if (field.match(/^[a-zA-Z0-9\s]+$/)) {
		return 'true';
	} else {
		return 'Space Not Allow';
	}
};

export const SpaceCheck = (field) => {
	if (!field || field === null) {
		return 'true';
	} else if (field.match(/^[a-zA-Z0-9\s]+$/)) {
		return 'true';
	} else {
		return 'Space Not Allow';
	}
};

export const Space_Allow_with_Trim = (field) => {
	if (!field || field === null || field.trim() === '') {
		return 'Required *';
	}
	else if (field.match(/^[a-zA-Z0-9\s]+$/)) {
		return 'true';
	}
	else {
		return 'Space Not Allow';
	}
};

// old slow regex field.match(/[a-zA-Z0-9\s]*$/)
// new fast regex !/[^\sa-zA-Z0-9]/.test(field)

export const Space_NotAllow = (field) => {
	if (!field || field === null || field.trim() === '') {
		return 'Required *';
	}
	else if (field.match(/[a-zA-Z0-9\s]/)) {
		return 'true';
	}
	else {
		return 'Space Not Allow';
	}
};

export const Space_AllowInc = (field) => {
	if (!field || field.trim() === '') {
		return 'Required *';
	} else {
		return 'true';
	}
};


export const Penalties_Valid = (field) => {
	if (!field || field.trim() === '') {
		return 'true';
	} else if (isNaN(field)) {
		return 'Enter Correct value';
	} else if (field === '.') {
		return 'Enter proper value';
	} else if (!/^(\d+(\.\d+)?|\.\d+)$/.test(field)) {
		return 'Proper Numeric Format';
	}
	return 'true';
};

export const checkDateIsAfter = (fromDate, ToDate, type) => {
	const date1 = moment(fromDate);
	const date2 = moment(ToDate);

	if (type === 'Reported') {

		if (date2.isBefore(date1) || date1.isSame(date2)) {
			return date2.isBefore(date1) || date1.isSame(date2)
		} else {
			return false
		}
	} else {

		if (date2.isAfter(date1) || date1.isSame(date2)) {
			return date2.isAfter(date1) || date1.isSame(date2)
		} else {
			return false
		}
	}
}

export const validateDLNumber = (field) => {
	if (!field || field?.length === 0 || field === '' || field === null || field === undefined || field === 0 || field === "Invalid date") {
		return 'Required *';
	} else {
		return 'true'
	}
};

