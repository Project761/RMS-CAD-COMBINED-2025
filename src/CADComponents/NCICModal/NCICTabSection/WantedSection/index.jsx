import Select from "react-select";
import { useContext, useEffect } from "react";
import { colourStyles, colourStylesNoReq } from "../../../Utility/CustomStylesForReact";
import DatePicker from "react-datepicker";
import { AgencyContext } from "../../../../Context/Agency/Index";
import PropTypes from "prop-types";

const WantedSection = ({ wantedSectionState, setWantedSectionState, handleWantedSectionState, suffixIdDrp, raceIdDrp, errorWantedSectionState, handleErrorWantedSectionState }) => {
  const { datezone } = useContext(AgencyContext);

  useEffect(() => {
    const savedState = localStorage.getItem('wantedSectionState');
    if (savedState) {
      setWantedSectionState(JSON.parse(savedState));
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
        <legend className="ncic-legend">{'Query Wanted Person/Warrants (QW)'}</legend>
        <p className="ncic-warning-text">{'Last Name, First Name, Gender, Race and DOB are required.'}</p>
        <div className="ncic-form-container">
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Last Name :
                {errorWantedSectionState?.lastName && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="form-control py-1 new-input requiredColor"
                name="lastName"
                placeholder="Last Name"
                value={wantedSectionState.lastName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleWantedSectionState("lastName", value);
                  if (errorWantedSectionState?.lastName) {
                    handleErrorWantedSectionState("lastName", false);
                  }
                }}
              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                First Name :
                {errorWantedSectionState?.firstName && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="form-control py-1 new-input requiredColor"
                name="firstName"
                placeholder="First Name"
                value={wantedSectionState.firstName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleWantedSectionState("firstName", value);
                  if (errorWantedSectionState?.firstName) {
                    handleWantedSectionState("firstName", false);
                  }
                }}

              />
            </div>
          </div>
          {/* New line */}
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
                placeholder="Middle Name"
                value={wantedSectionState.middleName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleWantedSectionState("middleName", value);
                }}
              />
            </div>
          </div>
          {/* New line */}

          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Suffix :
              </label>
            </div>
            <div className="col-6">
              <Select
                styles={colourStylesNoReq}
                placeholder="Select"
                isClearable
                options={suffixIdDrp}
                value={wantedSectionState?.suffix ? suffixIdDrp?.find((i) => i?.label === wantedSectionState?.suffix) : ""}
                onChange={(e) => {
                  handleWantedSectionState("suffix", e?.label);
                }}

              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Gender :
                {errorWantedSectionState?.sex && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6">
              <Select
                styles={colourStyles}
                placeholder="Select"
                isClearable
                options={sexIdDrp}
                value={wantedSectionState?.sex ? sexIdDrp?.find((i) => i?.code === wantedSectionState?.sex) : ""}
                onChange={(e) => {
                  handleWantedSectionState("sex", e?.code);
                  if (errorWantedSectionState?.sex) {
                    handleErrorWantedSectionState("sex", false);
                  }
                }}
                className={"requiredColor"}
              />

            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Race :
                {errorWantedSectionState?.race && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6">
              <Select
                styles={colourStyles}
                placeholder="Select"
                isClearable
                options={raceIdDrp}
                value={wantedSectionState?.race ? raceIdDrp?.find((i) => i?.label === wantedSectionState?.race) : ""}
                onChange={(e) => {
                  handleWantedSectionState("race", e?.label);
                  if (errorWantedSectionState?.race) {
                    handleErrorWantedSectionState("race", false);
                  }
                }}
                className={"requiredColor"}

              />

            </div>
          </div>
              
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                DOB :
                {errorWantedSectionState?.dob && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <DatePicker
                name='dob'
                id='dob'
                onChange={(v) => {
                  handleWantedSectionState("dob", v);
                  if (errorWantedSectionState?.dob) {
                    handleErrorWantedSectionState("dob", false);
                  }
                }}
                selected={wantedSectionState?.dob || ""}
                isClearable={!!wantedSectionState?.dob}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
                placeholderText="Select DOB"
                maxDate={new Date(datezone)}
                className="requiredColor"
              />
            </div>
          </div>
        </div>
      </fieldset>

    </>
  )
}

WantedSection.propTypes = {
  wantedSectionState: PropTypes.object.isRequired,
  setWantedSectionState: PropTypes.func.isRequired,
  handleWantedSectionState: PropTypes.func.isRequired,
  suffixIdDrp: PropTypes.array.isRequired,
  raceIdDrp: PropTypes.array.isRequired,
  errorWantedSectionState: PropTypes.object,
  handleErrorWantedSectionState: PropTypes.func,
};

WantedSection.defaultProps = {
  errorWantedSectionState: {},
  handleErrorWantedSectionState: () => {},
};

export default WantedSection;
