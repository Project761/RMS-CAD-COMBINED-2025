
export const ORIValidator = (ORI) => {
	if (ORI.trim() === '' || ORI.trim() === null) {
		return 'Required *';
	}
	if (ORI.toUpperCase().match(`(^[A-Z]{2})([0-9]{5})([0]{2}$)`)) {
		return 'true';
	} else {
		return 'Please enter a valid format (eg: WV0034500)';
	}
};
export const ORIValidatorVictim = (ORI) => {
	console.log(ORI)
	if (ORI?.trim() === '' || ORI?.trim() === null || ORI === null) {
		console.log(ORI)
		return 'true';
		
	}
	if (ORI?.toUpperCase()?.match(`(^[A-Z]{2})([0-9]{5})([0]{2}$)`)) {
		return 'true';
	} else {
		return 'Please enter a valid format (eg: WV0034500)';
	}
};

export const ORIWarant = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (field.toUpperCase().match(`(^[A-Z]{2})([0-9]{5})([0]{2}$)`)) {
		return 'true'
	} else {
		return 'Please enter a valid format (eg: WV0034500)';
	}
};

export const RequiredField = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	}
	else {
		return 'true'
	}
};



export const NameValidationCharacter = (field, type, firstName, middleName, lastName) => {

	if (!field || field === "Invalid date" || field === null || field.trim() === '') {
		return type === 'LastName' ? 'Required *' : 'true';
	}

	if (typeof field !== 'string') {
		return ' contain only alphabet *';
	}

	const fieldLower = field.toLowerCase();


	const firstNameLower = (firstName && typeof firstName === 'string') ? firstName.toLowerCase() : '';
	const middleNameLower = (middleName && typeof middleName === 'string') ? middleName.toLowerCase() : '';
	const lastNameLower = (lastName && typeof lastName === 'string') ? lastName.toLowerCase() : '';

	switch (type) {
		case 'LastName':
			if (fieldLower === firstNameLower && fieldLower === middleNameLower) {
				return ' should not be the same as First Name and Middle Name *';
			} else if (fieldLower === firstNameLower) {
				return ' should not be the same as First Name *';
			} else if (fieldLower === middleNameLower) {
				return ' should not be the same as Middle Name *';
			}
			break;
		case 'FirstName':
			if (fieldLower === lastNameLower && fieldLower === middleNameLower) {
				return ' should not be the same as Last Name and Middle Name *';
			} else if (fieldLower === lastNameLower) {
				return ' should not be the same as Last Name *';
			} else if (fieldLower === middleNameLower) {
				return ' should not be the same as Middle Name *';
			}
			break;
		case 'MiddleName':
			if (fieldLower === firstNameLower && fieldLower === lastNameLower) {
				return ' should not be the same as First Name and Last Name *';
			} else if (fieldLower === firstNameLower) {
				return ' should not be the same as First Name *';
			} else if (fieldLower === lastNameLower) {
				return ' should not be the same as Last Name *';
			}
			break;
		default:
			break;
	}

	return 'true';
};







// new function formed end //
export const RequiredFieldSpaceNotAllow = (field) => {
	if (!field || field === null || field === "Invalid date" || field.trim() === '') {
		return 'Required *';
	} else if (field.match(/^[a-zA-Z0-9\s]+$/)) {
		return 'true';
	} else {
		return 'Space Not Allow';
	}
};

export const PhoneField = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Phone number [876-987-8940]'
	}

};

export const FaxField = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Fax number [876-987-8940]'
	}
};

export const MunicipalityCodeValidator = (MunicipalityCode) => {
	if (MunicipalityCode === '' || MunicipalityCode === null) {
		return 'Required *';
	}
	if (MunicipalityCode.match(`(^[0-9]{4}$)`)) {
		return 'true';
	} else {
		return 'Please enter a valid Municipality code';
	}
};


// Password Setting
export const Max_Password_Age = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field > checkField[0]?.MaxPasswordAge) {
		return "Max Valid for 90 days"
	} else if (field < 1) {
		return "Max Valid for 90 days"
	} else {
		return "true"
	}
};

export const Min_Password_Length = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinPasswordLength) {
		return "Min Length 8"
	} else {
		return "true"
	}
};

export const Max_Login_Attempts = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field > checkField[0]?.MaxLoginAttempts) {
		return "Max Login Attempts " + checkField[0]?.MaxLoginAttempts
	} else if (field < 1) {
		return "Max Login Attempts " + checkField[0]?.MaxLoginAttempts
	} else {
		return "true"
	}
};

export const Min_LowerCase_InPassword = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinLowerCaseInPassword) {
		return "Min Lowercase Char " + checkField[0]?.MinLowerCaseInPassword
	} else {
		return "true"
	}
};

export const Min_NumericDigits_InPassword = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinNumericDigitsInPassword) {
		return "Min Numeric Digit " + checkField[0]?.MinNumericDigitsInPassword
	} else {
		return "true"
	}
};

export const Min_SpecialChars_InPassword = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinSpecialCharsInPassword) {
		return "Min Special Char " + checkField[0]?.MinSpecialCharsInPassword
	} else {
		return "true"
	}
};

export const Min_UpperCase_InPassword = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinUpperCaseInPassword) {
		return "Min Uppercase Char " + checkField[0]?.MinUpperCaseInPassword
	} else {
		return "true"
	}
};

export const Password_Hist_UniquenessDepth = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field > checkField[0]?.PasswordHistUniquenessDepth) {
		return "Max Uniqueness Depth " + checkField[0]?.PasswordHistUniquenessDepth
	} else if (field < 1) {
		return "Max Uniqueness Depth " + checkField[0]?.PasswordHistUniquenessDepth
	} else {
		return "true"
	}
};
export const Password_MessageDays = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field > checkField[0]?.PasswordMessageDays) {
		return "Max Message Days " + checkField[0]?.PasswordMessageDays
	} else if (field < 1) {
		return "Max Message Days " + checkField[0]?.PasswordMessageDays
	} else {
		return "true"
	}
};

export const Email_Field = (email) => {
	if (!email?.trim()) {
		return 'Required *';
	} else if (email.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)) {
		return 'true';
	} else {
		return 'Email not valid';
	}
};

export const PhoneFieldNotReq = (field) => {

	if (field === '' || field === null) {
		return 'Required *';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Phone number (eg: 876-987-8940)';
	}
}



