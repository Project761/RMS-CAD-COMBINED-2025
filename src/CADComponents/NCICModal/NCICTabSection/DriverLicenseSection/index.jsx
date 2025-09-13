import Select from "react-select";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { colourStyles, colourStylesNoReq } from "../../../Utility/CustomStylesForReact";
import PropTypes from "prop-types";

const DriverLicenseSection = ({ driverLicenseSectionState, setDriverLicenseSectionState, handleDriverLicenseSectionState, suffixIdDrp, stateList, raceIdDrp, errorDriverLicenseSectionState, handleErrorDriverLicenseSectionState }) => {

    useEffect(() => {
        const savedState = localStorage.getItem('driverLicenseSectionState');
        if (savedState) {
            setDriverLicenseSectionState(JSON.parse(savedState));
        }
    }, []);


    const sexIdDrp = [
        {
            value: "1",
            label: "Male",
            code: "M"
        },
        {
            value: "2",
            label: "Female",
            code: "F"
        },
        {
            value: "3",
            label: "Unknown",
            code: "U"
        }
    ]

    return (
        <>
            <fieldset className="ncic-main-container">
                <legend className="ncic-legend">{'Driver\'s License Query (DQ)'}</legend>
                <p className="ncic-warning-text">{'(Last Name and First Name)/License Number is required.'}</p>
                <div className="ncic-form-container mt-3">
                    {/* NAM - Name */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                Last Name :
                                {errorDriverLicenseSectionState?.lastName && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="lastName"
                                placeholder="Last Name"
                                value={driverLicenseSectionState?.lastName}
                                onChange={(v) => {
                                    const value = v.target.value;
                                    handleDriverLicenseSectionState("lastName", value);
                                    if (errorDriverLicenseSectionState?.lastName) {
                                        handleErrorDriverLicenseSectionState("lastName", false);
                                    }
                                }}
                                disabled={driverLicenseSectionState?.oln ? true : false}
                            />
                        </div>
                    </div>
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                First Name :
                                {errorDriverLicenseSectionState?.firstName && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="firstName"
                                placeholder="First Name"
                                value={driverLicenseSectionState?.firstName}
                                onChange={(v) => {
                                    const value = v.target.value;
                                    handleDriverLicenseSectionState("firstName", value);
                                    if (errorDriverLicenseSectionState?.firstName) {
                                        handleErrorDriverLicenseSectionState("firstName", false);
                                    }
                                }}
                                disabled={driverLicenseSectionState?.oln ? true : false}
                            />
                        </div>
                    </div>
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                Middle Name :
                            </label>
                        </div>
                        <div className="col-6 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="middleName"
                                placeholder="Middle Name (Optional)"
                                value={driverLicenseSectionState?.middleName}
                                onChange={(v) => {
                                    const value = v.target.value;
                                    handleDriverLicenseSectionState("middleName", value);
                                }}
                                disabled={driverLicenseSectionState?.oln ? true : false}
                            />
                        </div>
                    </div>
                    {/* SEX - Sex */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                Sex :
                                {errorDriverLicenseSectionState?.sex && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-3">
                            <Select
                                styles={colourStylesNoReq}
                                placeholder="Select"
                                isClearable
                                options={sexIdDrp}
                                value={driverLicenseSectionState?.sex ? sexIdDrp?.find((i) => i?.code === driverLicenseSectionState?.sex) : ""}
                                onChange={(e) => {
                                    handleDriverLicenseSectionState("sex", e?.code);
                                    if (errorDriverLicenseSectionState?.sex) {
                                        handleErrorDriverLicenseSectionState("sex", false);
                                    }
                                }}
                            />
                        </div>
                        <div className="col-1 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                Suffix :
                                {errorDriverLicenseSectionState?.suffix && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-3">
                            <Select
                                styles={colourStylesNoReq}
                                placeholder="Select"
                                isClearable
                                options={suffixIdDrp}
                                value={driverLicenseSectionState?.suffix ? suffixIdDrp?.find((i) => i?.label === driverLicenseSectionState?.suffix) : ""}
                                onChange={(e) => {
                                    handleDriverLicenseSectionState("suffix", e?.label);
                                    if (errorDriverLicenseSectionState?.suffix) {
                                        handleErrorDriverLicenseSectionState("suffix", false);
                                    }
                                }}

                            />
                        </div>
                    </div>
                    {/* RAC - Race */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                Race :
                                {errorDriverLicenseSectionState?.race && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6">
                            <Select
                                styles={colourStylesNoReq}
                                placeholder="Select"
                                isClearable
                                options={raceIdDrp}
                                value={driverLicenseSectionState?.race ? raceIdDrp?.find((i) => i?.label === driverLicenseSectionState?.race) : ""}
                                onChange={(e) => {
                                    handleDriverLicenseSectionState("race", e?.label);
                                    if (errorDriverLicenseSectionState?.race) {
                                        handleErrorDriverLicenseSectionState("race", false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/* DOB - Date of Birth */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                Date of Birth :
                                {errorDriverLicenseSectionState?.dob && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6 d-flex align-self-center justify-content-end">
                            <DatePicker
                                id='dob'
                                name='dob'
                                className='form-control py-1 new-input'
                                dateFormat="MM/dd/yyyy"
                                isClearable={!!driverLicenseSectionState?.dob}
                                selected={
                                    driverLicenseSectionState?.dob
                                        ? (
                                            driverLicenseSectionState.dob.length === 8
                                                ? new Date(
                                                    parseInt(driverLicenseSectionState.dob.substring(0, 4)),
                                                    parseInt(driverLicenseSectionState.dob.substring(4, 6)) - 1,
                                                    parseInt(driverLicenseSectionState.dob.substring(6, 8))
                                                )
                                                : new Date(driverLicenseSectionState.dob)
                                        )
                                        : null
                                }
                                onChange={(date) => {
                                    if (date) {
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const formattedDate = `${year}${month}${day}`;
                                        handleDriverLicenseSectionState("dob", formattedDate);
                                    } else {
                                        handleDriverLicenseSectionState("dob", "");
                                    }
                                }}
                                placeholderText="Select Date of Birth"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                autoComplete="off"
                                maxDate={new Date()}
                                peekNextMonth
                            />
                        </div>
                    </div>
                    {/* OLN - Driver's License Number */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                License Number :
                                {errorDriverLicenseSectionState?.oln && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control py-1 new-input requiredColor"
                                name="oln"
                                placeholder="Driver's License Number"
                                value={driverLicenseSectionState?.oln}
                                onChange={(v) => {
                                    const value = v.target.value;
                                    handleDriverLicenseSectionState("oln", value);
                                    if (errorDriverLicenseSectionState?.oln) {
                                        handleErrorDriverLicenseSectionState("oln", false);
                                    }
                                }}
                                disabled={(driverLicenseSectionState?.lastName && driverLicenseSectionState?.firstName) ? true : false}
                            />
                        </div>
                    </div>
                    {/* ST - State */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                State :
                                {errorDriverLicenseSectionState?.st && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6">
                            <Select
                                styles={colourStyles}
                                placeholder="Select"
                                isClearable
                                options={stateList}
                                maxMenuHeight={180}
                                menuPlacement="top"
                                value={driverLicenseSectionState?.st ? stateList?.find((i) => i?.label === driverLicenseSectionState?.st) : ""}
                                onChange={(e) => {
                                    handleDriverLicenseSectionState("st", e?.label);
                                    if (errorDriverLicenseSectionState?.st) {
                                        handleErrorDriverLicenseSectionState("st", false);
                                    }
                                }}
                                className={"requiredColor"}
                            />
                        </div>
                    </div>
                </div>
            </fieldset>
        </>
    )
}

DriverLicenseSection.propTypes = {
    driverLicenseSectionState: PropTypes.object.isRequired,
    setDriverLicenseSectionState: PropTypes.func.isRequired,
    handleDriverLicenseSectionState: PropTypes.func.isRequired,
    suffixIdDrp: PropTypes.array.isRequired,
    stateList: PropTypes.array.isRequired,
    raceIdDrp: PropTypes.array.isRequired,
    errorDriverLicenseSectionState: PropTypes.object,
    handleErrorDriverLicenseSectionState: PropTypes.func,
};

DriverLicenseSection.defaultProps = {
    errorDriverLicenseSectionState: {},
    handleErrorDriverLicenseSectionState: () => { },
};

export default DriverLicenseSection;