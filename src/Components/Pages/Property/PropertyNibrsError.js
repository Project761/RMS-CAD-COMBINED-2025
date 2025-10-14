export const NoneUnknownErrorStr = "Property Loss must be either 'None' or 'Unknown'";

export const ErrorTooltip = ({ ErrorStr }) => (<span className='hovertext' style={{ marginLeft: '15px' }} data-hover={ErrorStr} ><i className='fa fa-exclamation-circle'></i></span>);

export const TableErrorTooltip = ({ ErrorStr, value }) => { return (<span className='hovertext' data-hover={ErrorStr} >{value} <i className='fa fa-exclamation-circle'></i></span>) };

export const ErrorShow = ({ ErrorStr }) => (<span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{ErrorStr}</span>);

export const NibrsErrorStyle = (status) => {
    const colour_Styles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: status ? "rgb(255 202 194)" : "#fce9bf",
            height: 20,
            minHeight: 32,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return colour_Styles;
};

export const check_OffenceCode_NoneUnknown = (nibrsCode, lossCode, AttmComp, categoryCode, nibrsCodeArr) => {
    switch (nibrsCode) {
        case '39A':
        case '39B':
        case '39C':
        case '39D': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'CON') ? 'Loss Code must be Sized' : '';
                }
                default: {
                    return '';
                }
            }
        }
        case '200': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'BURN') ? 'Loss Code must be Burned Property' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '510': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'RECD' && lossCode !== 'STOL' && lossCode !== 'Unknown' && lossCode !== 'None') ? 'Loss Code must be Recovered, stolen, None and Unknown' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '220': {
            switch (AttmComp) {
                case 'A': {
                    if (categoryCode === '29' || categoryCode === '30' || categoryCode === '31' || categoryCode === '32' || categoryCode === '32' || categoryCode === '33' || categoryCode === '33') {
                        return 'illogical value of property description & offense code';

                    } else {
                        return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';

                    }
                }
                case 'C': {
                    if (categoryCode === '29' || categoryCode === '30' || categoryCode === '31' || categoryCode === '32' || categoryCode === '32' || categoryCode === '33' || categoryCode === '33') {
                        return 'illogical value of property description & offense code';

                    } else {
                        return (lossCode !== 'None' && lossCode !== 'RECD' && lossCode !== 'STOL' && lossCode !== 'Unknown') ? 'Loss Code must be None, Recoverd, Stolen or Unknown' : '';

                    }
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '250': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'FORG' && lossCode !== 'RECD' && lossCode !== 'CON') ? 'Loss Code must be  Counterfeited/Forged, Recoverd, Sized' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '290': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'DAMA') ? 'Loss Code must be Destroyed/Damaged/Vandalized ' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '35A':
        case '35B': {
            switch (AttmComp) {
                case 'A': {
                    if (categoryCode != '11' && lossCode != 'CON') {
                        return 'loss code is seized and Category is Drug/Narcotic Equipment Then only 35A/35B is reported';

                    } else {
                        return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                    }
                }
                case 'C': {
                    if (categoryCode != '11' && lossCode !== 'None' && lossCode != 'CON') {
                        return 'loss code is None or seized and Category is Drug/Narcotic Equipment Then only 35A/35B is reported';

                    } else {
                        return (lossCode !== 'None' && lossCode !== 'CON') ? 'Loss Code must be None or sized' : '';
                    }
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '270':
        case '210':
        case '26A':
        case '26B':
        case '26C':
        case '26E':
        case '26F':
        case '26G': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be Recovered, Stolen' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '100': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'None' && lossCode !== 'RECD' && lossCode !== 'STOL' && lossCode !== 'Unknown') ? 'Loss Code must be None, Recovered, Stolen or Unknown' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '23A':
        case '23B':
        case '23C':
        case '23D':
        case '23E':
        case '23F':
        case '23G':
        case '23H': {
            switch (AttmComp) {
                case 'A': {
                    if (nibrsCode === '23A' || nibrsCode === '23B') {

                        if (categoryCode === '01' || categoryCode === '03' || categoryCode === '04' || categoryCode === '05' || categoryCode === '12' || categoryCode === '15' || categoryCode === '18' || categoryCode === '24' || categoryCode === '28' || categoryCode === '15' || categoryCode === '30' || categoryCode === '31' || categoryCode === '32' || categoryCode === '33' || categoryCode === '35' || categoryCode === '36' || categoryCode === '37' || categoryCode === '39' || categoryCode === '66' || categoryCode === '78') {
                            return 'illogical value of property description & offense code';

                        } else {

                            if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                                return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                            } else {
                                return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                            }

                        }


                    } else if (nibrsCode === '23C') {
                        if (categoryCode === '01' || categoryCode === '03' || categoryCode === '05' || categoryCode === '12' || categoryCode === '15' || categoryCode === '18' || categoryCode === '24' || categoryCode === '28' || categoryCode === '29' || categoryCode === '30' || categoryCode === '31' || categoryCode === '32' || categoryCode === '34' || categoryCode === '35' || categoryCode === '37' || categoryCode === '39') {

                            return 'illogical value of property description & offense code';

                        } else {
                            if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                                return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                            } else {
                                return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                            }

                        }
                    } else if (nibrsCode === '23D' || nibrsCode === '23F') {
                        if (categoryCode === '03' || categoryCode === '05' || categoryCode === '24' || categoryCode === '28' || categoryCode === '30' || categoryCode === '29' || categoryCode === '31' || categoryCode === '32' || categoryCode === '33' || categoryCode === '34' || categoryCode === '35' || categoryCode === '37') {
                            return 'illogical value of property description & offense code';

                        } else {
                            if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                                return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                            } else {
                                return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                            }

                        }
                    }
                    else if (nibrsCode === '23H') {
                        if (categoryCode === '03' || categoryCode === '05' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') {
                            return 'illogical value of property description & offense code';

                        } else {

                            if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                                return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                            } else {
                                return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                            }
                        }
                    }
                    else {

                        if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                            return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                        } else {
                            return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                        }

                    }


                }
                case 'C': {

                    if (nibrsCode === '23A' || nibrsCode === '23B') {

                        if (categoryCode === '01' || categoryCode === '03' || categoryCode === '04' || categoryCode === '05' || categoryCode === '12' || categoryCode === '15' || categoryCode === '18' || categoryCode === '24' || categoryCode === '28' || categoryCode === '15' || categoryCode === '30' || categoryCode === '31' || categoryCode === '32' || categoryCode === '33' || categoryCode === '35' || categoryCode === '36' || categoryCode === '37' || categoryCode === '39' || categoryCode === '66' || categoryCode === '78') {
                            return 'illogical value of property description & offense code';

                        } else {

                            if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                                return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                            } else {
                                return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be Recoverd or Stolen' : '';

                            }

                        }


                    } else if (nibrsCode === '23C') {
                        if (categoryCode === '01' || categoryCode === '03' || categoryCode === '05' || categoryCode === '12' || categoryCode === '15' || categoryCode === '18' || categoryCode === '24' || categoryCode === '28' || categoryCode === '29' || categoryCode === '30' || categoryCode === '31' || categoryCode === '32' || categoryCode === '34' || categoryCode === '35' || categoryCode === '37' || categoryCode === '39') {

                            return 'illogical value of property description & offense code';

                        } else {
                            if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                                return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                            } else {
                                return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be Recoverd or Stolen' : '';

                            }

                        }
                    } else if (nibrsCode === '23D' || nibrsCode === '23F') {
                        if (categoryCode === '03' || categoryCode === '05' || categoryCode === '24' || categoryCode === '28' || categoryCode === '30' || categoryCode === '29' || categoryCode === '31' || categoryCode === '32' || categoryCode === '33' || categoryCode === '34' || categoryCode === '35' || categoryCode === '37') {
                            return 'illogical value of property description & offense code';

                        } else {
                            if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                                return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                            } else {
                                return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be Recoverd or Stolen' : '';

                            }

                        }
                    }
                    else if (nibrsCode === '23H') {
                        if (categoryCode === '03' || categoryCode === '05' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') {
                            return 'illogical value of property description & offense code';

                        } else {

                            if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                                return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                            } else {
                                return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be Recoverd or Stolen' : '';
                            }
                        }
                    }
                    else {

                        if (lossCode === 'STOL' && (categoryCode === '05' || categoryCode === '03' || categoryCode === '24' || categoryCode === '28' || categoryCode === '37') && nibrsCodeArr?.length === 0) {
                            return 'MUST contain an additional Offense Segment with a Crime Against Property offense other than a Larceny/Theft offense.'

                        } else {
                            return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be Recoverd or Stolen' : '';

                        }

                    }



                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '240':
        case '120': {
            switch (AttmComp) {
                case 'A': {
                    if (nibrsCode === '240') {
                        if (categoryCode === '29' || categoryCode === '30' || categoryCode === '31' || categoryCode === '32' || categoryCode === '32' || categoryCode === '33' || categoryCode === '33') {
                            return 'illogical value of property description & offense code';

                        } else {
                            return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';

                        }
                    } else {
                        return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                    }
                }
                case 'C': {

                    if (nibrsCode === '240') {
                        if (categoryCode === '29' || categoryCode === '30' || categoryCode === '31' || categoryCode === '32' || categoryCode === '32' || categoryCode === '33' || categoryCode === '33') {
                            return 'illogical value of property description & offense code';

                        } else {
                            return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be Stolen, Recoverd' : '';

                        }
                    } else {
                        return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be Stolen, Recoverd' : '';
                    }


                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '280': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'None' && lossCode !== 'RECD') ? 'Loss Code must be None or Recoverd' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '26H': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'RECD' && lossCode !== 'STOL') ? 'Loss Code must be None, Recoverd, Stolen' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '521':
        case '522':
        case '526': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'None' && lossCode !== 'CON') ? 'Loss Code must be None, Sized' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '58A': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'None' && lossCode !== 'CON') ? 'Loss Code must be None, Sized' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '58B': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'CON' && lossCode !== 'FORG' && lossCode !== 'RECD') ? 'Loss Code must be Counterfeited/Forged, Recoverd, or Sized' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        case '61A':
        case '61B':
        case '620': {
            switch (AttmComp) {
                case 'A': {
                    return (lossCode !== 'None' && lossCode !== 'Unknown') ? 'Loss Code must be None or Unknown' : '';
                }
                case 'C': {
                    return (lossCode !== 'None' && lossCode !== 'CON') ? 'Loss Code must be None, Unknown or Sized' : '';
                }
                default: {
                    return ''; // Added return statement for default case
                }
            }
        }
        default: {
            return ''; // Added return statement for default case
        }
    }
}

export const check_Category_Nibrs = (nibrsCodeArr, propRecType, propCategoryCode, type = 'Color') => {

    if (propCategoryCode) {
        if (propCategoryCode === '11' && propRecType === '6' && nibrsCodeArr.includes('35A')) {
            return type === 'Color' ? NibrsErrorStyle(true) : <ErrorTooltip ErrorStr={'Property Description Code Cannot = 11 For Property Loss Type=6 and Offense = 35A'} />
        } else if (propCategoryCode === '10' && propRecType === '5' && nibrsCodeArr.includes('35B')) {
            return type === 'Color' ? NibrsErrorStyle(true) : <ErrorTooltip ErrorStr={' Property Description Code Cannot = 10 For Property Loss Type=6 and Offense = 35B'} />
        } else {
            return false
        }
    } else {
        return false
    }
}  