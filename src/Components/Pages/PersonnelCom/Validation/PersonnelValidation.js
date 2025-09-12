import { toastifyError } from "../../../Common/AlertMsg";

export const PinValidator = (PIN) => {
	if (PIN === '' || PIN === null) {
		return 'Required *';
	}
	// else if (PIN.match(`(?:11|33|22|44|55|66|77|88|99|112233|123456|123|1234|12345|67890|7890|890)`)) {
	// 	return 'Please enter a valid code (eg:895471)';
	// }
	else if (PIN.match(`(^[0-9]{6}$)`)) {
		return 'true'
	}
	else {
		return 'Please enter a valid 6 digit code (eg:895471)';
	}
};

export const HeightComparision = (HeightFrom, HeightTo) => {
	if (HeightFrom || HeightTo) {
		if (HeightFrom.length >= 5 && HeightTo.length >= 5) {
			if (parseFloat(HeightFrom) > parseFloat(HeightTo)) {
				toastifyError('HeightTo is not less then HeightFrom')
			} else {
				return 'true';
			}
		} else {
			toastifyError('Invalid Format *');
		}
	} else {
		return 'true';
	}
};

// new function  start //

// export const Heights = (HeightFrom, HeightTo) => {
// 	const globalname_Fromarray = HeightFrom?.replace("\"", "").replace("'", "");
// 	const globalname_Toarray = HeightTo?.replace("\"", "").replace("'", "");
// 	if (globalname_Fromarray || globalname_Toarray) {
// 		if (globalname_Fromarray > globalname_Toarray) {
// 			toastifyError('Height To should be greater than Height From')
// 		} else {
// 			return 'true';
// 		}
// 	} else {
// 		return 'true';
// 	}
// };


export const Heights = (HeightFrom, HeightTo) => {
	const globalname_Fromarray = HeightFrom?.replace("\"", "").replace("'", "");
	const globalname_Toarray = HeightTo?.replace("\"", "").replace("'", "");


	if (!globalname_Fromarray || !globalname_Toarray) {
		return 'true';
	}

	if (globalname_Fromarray > globalname_Toarray) {
		toastifyError('Height To should be greater than Height From');
		return 'false';
	} else {
		return 'true';
	}
};

// new function end //
// export const Comparision = (ValueFrom, ValueTo, Name) => {
// 	if (ValueFrom || ValueTo) {
// 		if (parseFloat(ValueFrom) > parseFloat(ValueTo)) {
// 			toastifyError(`${Name}To not less then ${Name}From`);
// 			return (`${Name}To not less then ${Name}From`)
// 		}
// 		else {
// 			return 'true'
// 		}
// 	} else {
// 		return 'true'
// 	}
// }
export const Comparision = (ValueFrom, ValueTo, Name) => {
	if (ValueFrom || ValueTo) {
		if (parseFloat(ValueFrom) < 0 || parseFloat(ValueFrom) > 99 || parseFloat(ValueTo) < 0 || parseFloat(ValueTo) > 99) {
			toastifyError(`${Name} should be between 0 to 99.`);
			return (`${Name} should be between 0 to 99.`);
		}
		if (parseFloat(ValueFrom) > parseFloat(ValueTo)) {
			toastifyError(`${Name}To should not be less than ${Name}From.`);
			return (`${Name}To should not be less than ${Name}From.`);
		} else {
			return 'true';
		}
	} else {
		return 'true';
	}
}

export const Comparision2 = (ValueFrom, ValueTo, Name, AgeUnitID, nameTypeCode) => {
	let isValidToExist = false;

	if (nameTypeCode === 'B') {
		return 'true';
	}


	if (ValueFrom && AgeUnitID) {
		if (ValueTo !== undefined && ValueTo !== null && ValueTo !== '') {
			isValidToExist = true;
			if (parseFloat(ValueFrom) > parseFloat(ValueTo)) {
				toastifyError(`${Name}To should  be more than ${Name}From`);
				return (`${Name}To should  be more than ${Name}From`);
			}
		}
		if (AgeUnitID === 2 && ((ValueFrom > 23 || ValueFrom < 1))) {
			toastifyError(`${Name} in Hours should be between 1 to 23`);
			return (`${Name} in Hours should be between 1 to 23`);
		}
		if (AgeUnitID === 2 && isValidToExist && ((ValueTo > 23 || ValueTo < 1))) {
			toastifyError(`${Name} in Hours should be between 1 to 23`);
			return (`${Name} in Hours should be between 1 to 23`);
		}
		if (AgeUnitID === 1 && (ValueFrom > 364 || ValueFrom < 1)) {
			toastifyError(`${Name} in Days should be between 1 to 364`);
			return (`${Name} in Days should be between 1 to 364`);
		}
		if (AgeUnitID === 1 && isValidToExist && (ValueTo > 364 || ValueTo < 1)) {
			toastifyError(`${Name} in Days should be between 1 to 364`);
			return (`${Name} in Days should be between 1 to 364`);
		}
		if (AgeUnitID === 5 && (ValueFrom > 99 || ValueFrom < 1)) {
			toastifyError(`${Name} in Years should be between 1 to 99`);
			return (`${Name} in Years should be between 1 to 99`);
		}
		if (AgeUnitID === 5 && isValidToExist && (ValueTo > 99 || ValueTo < 1)) {
			toastifyError(`${Name} in Years should be between 1 to 99`);
			return (`${Name} in Years should be between 1 to 99`);
		}
		return 'true';

	} else {
		if (((AgeUnitID === null || AgeUnitID === undefined || AgeUnitID === '') && ValueFrom)) {
			toastifyError(`Please select Age Unit`);
			return (`Please select Age Unit`);
		}
		return 'true';
	}
}

// new function comparision dd //

export const Comparisionweight = (ValueFrom, ValueTo, Name) => {
	if (parseFloat(ValueFrom) <= 0) {
		toastifyError(`${Name}From should be greater than zero`);
		return `${Name}From should be greater than zero`;
	}

	if (ValueFrom || ValueTo) {
		if (parseFloat(ValueFrom) > parseFloat(ValueTo)) {
			toastifyError(`${Name}To cannot be less than ${Name}From`);
			return `${Name}To cannot be less than ${Name}From`;
		} else {
			return 'true';
		}
	} else {
		return 'true';
	}
}


// old slow regex  field.match(/^\S.*[a-zA-Z\s]*$/)
// new fast regex !/[^\sa-zA-Z0-9]/.test(field)

export const RequiredField = (field) => {
	if (field?.trim() === '' || field?.trim() === null) {
		return 'Required *';
	} else if (field.match(/[a-zA-Z\s]/)) {
		return 'true';
	} else {
		return 'Space Not Allow';
	}
};

export const RequiredFieldUser = (field, min, max) => {
	if (!field || field.trim().length === 0) {
		return 'Required *';
	} else if (field.includes(' ')) {

		return 'Spaces not allowed';
	} else if (field.length < 5) {
		return `Username must be 5 characters or longer`;
	} else {
		return 'true'
	}
};

export const RequiredFieldSelectBox = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else {
		return 'true';
	}
};

// old slow regex  val.match(/^\S.*[a-zA-Z\s]*$/)
// new fast regex !/[^\sa-zA-Z0-9]/.test(field)


export const PasswordField = (passwordSettingVal, field, UserName) => {
	if (field === '' || field === null) {
		return 'true'
	} else if (field === UserName) {
		return "Password can't be same as Login UserID"
	}
	else {
		const val = field
		let Color1
		if (
			val?.length >= passwordSettingVal?.MinPasswordLength &&
			val.match(`(?=(.*[A-Z]){${passwordSettingVal?.MinUpperCaseInPassword}})`) &&
			val.match(`(?=(.*[a-z]){${passwordSettingVal?.MinLowerCaseInPassword}})`) &&
			val.match(`(?=(.*[0-9]){${passwordSettingVal?.MinNumericDigitsInPassword}})`) &&
			val.match(`(?=(.*[-\#\$\.\%\&\@\*]){${passwordSettingVal?.MinSpecialCharsInPassword}})`) &&
			!hasKeyboardSequence(val)
		) {
			if (val.match(/^\S.*[a-zA-Z\s]*$/)) {
				Color1 = 'true'
			} else {
				Color1 = 'false'
			}
		} else {
			Color1 = 'false'
		}
		return Color1
	}
};


export function hasKeyboardSequence(input) {
	const regex = /(.)\1/;
	const res = regex.test(input.toLowerCase());

	// Check for consecutive identical characters (like aaa, 111, etc.)
	if (res) {
		return true;
	}

	// Convert to lowercase for pattern checking
	const lowerInput = input.toLowerCase();

	// Define obvious keyboard sequences that should be rejected
	const keyboardRows = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['z', 'x', 'c', 'v', 'b', 'n', 'm']
	];

	// Check for 3+ consecutive characters from the same keyboard row (like qwe, asd, qwer, etc.)
	// Also check for reverse sequences (like ewd, dsa, etc.)
	for (const row of keyboardRows) {
		for (let i = 0; i <= row.length - 3; i++) {
			const sequence3 = row.slice(i, i + 3).join('');
			const reverseSequence3 = row.slice(i, i + 3).reverse().join('');

			if (lowerInput.includes(sequence3) || lowerInput.includes(reverseSequence3)) {
				return true; // Reject 3+ character sequences (forward and reverse)
			}
		}
	}

	// Check 3+ character patterns - reject these (including reverse patterns)
	const obviousPatterns3Plus = [
		'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop', // Top row 3+
		'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl',       // Home row 3+
		'zxc', 'xcv', 'cvb', 'vbn', 'bnm',                     // Bottom row 3+
		'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz', // Alphabetical sequences 3+
		// Reverse patterns
		'ewq', 'rew', 'tre', 'ytr', 'uyt', 'iyu', 'oiu', 'poi', // Reverse top row 3+
		'dsa', 'fds', 'gfd', 'hgf', 'jhg', 'kjh', 'lkj',       // Reverse home row 3+
		'cxz', 'vcx', 'bvc', 'nvb', 'mnb',                     // Reverse bottom row 3+
		'cba', 'dcb', 'edc', 'fed', 'gfe', 'hgf', 'ihg', 'jih', 'kji', 'lkj', 'mlk', 'nml', 'onm', 'pon', 'qpo', 'rqp', 'srq', 'tsr', 'uts', 'vut', 'wvu', 'xwv', 'yxw', 'zyx' // Reverse alphabetical sequences 3+
	];

	for (const pattern of obviousPatterns3Plus) {
		if (lowerInput.includes(pattern)) {
			return true; // Reject 3+ character sequences
		}
	}

	// Check for 3+ digit numerical sequences (123, 234, 345, etc.) - reject these
	for (let i = 0; i <= lowerInput.length - 3; i++) {
		let isNumSeq = true;
		for (let j = 0; j < 3; j++) {
			const char = lowerInput.charCodeAt(i + j);
			if (char < 48 || char > 57) {
				isNumSeq = false;
				break;
			}
		}

		if (isNumSeq) {
			const num1 = parseInt(lowerInput[i]);
			const num2 = parseInt(lowerInput[i + 1]);
			const num3 = parseInt(lowerInput[i + 2]);

			// Check for ascending sequence (123, 234, 345, etc.)
			if ((num2 === num1 + 1) && (num3 === num2 + 1)) {
				return true;
			}
			// Check for descending sequence (321, 432, 543, etc.)
			if ((num2 === num1 - 1) && (num3 === num2 - 1)) {
				return true;
			}
		}
	}

	// Check for 3+ character sequential patterns (like abc, bcd, cde, etc.)
	for (let i = 0; i <= lowerInput.length - 3; i++) {
		const char1 = lowerInput.charCodeAt(i);
		const char2 = lowerInput.charCodeAt(i + 1);
		const char3 = lowerInput.charCodeAt(i + 2);

		// Check if three consecutive characters form a sequence
		if (Math.abs(char2 - char1) === 1 && Math.abs(char3 - char2) === 1) {
			return true; // Reject any 3+ character sequence
		}
	}

	return false; // No obvious sequential pattern found
}

export const ReEnterPasswordVal = (password, confirmPass) => {
	if ((password === '' || password === null || !password) && (!confirmPass || confirmPass === '' || confirmPass === null)) {
		return 'true';
	} else if (password === confirmPass) {
		return 'true';
	} else {
		return "password doesn't match"
	}
}

export const PhoneField = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Phone number (eg: 876-987-8940)';
	}
}

export const CellPhoneField = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Phone number (eg: 876-987-8940)';
	}
}

export const WorkPhone_Ext_Field = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (String(field).match(`(^[0-9]{3}$)`)) {
		return 'true';
	} else {
		return 'Please enter a valid Ext. (eg: 876)';
	}
}

export const SSN_Field = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (field.length === 11) {
		return 'true'
	} else {
		return 'Please enter a valid SSN number (eg: 876-97-8940)'
	}
}

export const SSN_FieldModel = (type, field) => {
	if (field === '' || field === null) {
		if (type === "ArrestMod") {
			return 'Required';
		}
		else {
			return 'true';
		}

	} else if (field.length === 11) {
		return 'true'
	} else {
		return 'Please enter a valid SSN number (eg: 876-97-8940)'
	}
}

// export const SSN_FieldName = (field) => {
// 	if (field === '' || field === null) {
// 		return 'true';
// 	} else if (field.length === 11) {
// 		return 'true'
// 	} else {
// 		return 'Please enter a valid SSN number (eg: 876-97-8940)'
// 	}
// }

export const Deactivate_Date_Field = (DeactivateDate, HiredDate) => {
	if (DeactivateDate === '' || DeactivateDate === null) {
		return 'true';
	} else if (new Date(DeactivateDate).getTime() >= new Date(HiredDate).getTime()) {
		return 'true'
	} else {
		return 'Date not valid'
	}
}

export const Deceased_Date_Field = (DeceasedDate, HiredDate) => {
	if (DeceasedDate === '' || DeceasedDate === null) {
		return 'true';
	} else if (new Date(DeceasedDate).getTime() >= new Date(HiredDate).getTime()) {
		return 'true'
	} else {
		return 'Date not valid'
	}
}

export const Email_Field = (email) => {
	if (email?.trim() === '' || email?.trim() === null) {
		return 'Required *';
	} else if (email?.toLowerCase()?.match(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)) {
		return 'true'
	} else {
		return 'Email not valid'
	}
}





