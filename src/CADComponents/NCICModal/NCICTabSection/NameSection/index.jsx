import Select from "react-select";
import { useContext, useEffect } from "react";
import { colourStyles, colourStylesNoReq } from "../../../Utility/CustomStylesForReact";
import DatePicker from "react-datepicker";
import { AgencyContext } from "../../../../Context/Agency/Index";
import PropTypes from "prop-types";

const NameSection = ({ nameSectionState, setNameSectionState, handleNameSectionState, clearNameSectionState, suffixIdDrp, raceIdDrp, errorNameSectionState, handleErrorNameSectionState }) => {
  const { datezone } = useContext(AgencyContext);

  useEffect(() => {
    const savedState = localStorage.getItem('nameSectionState');
    if (savedState) {
      setNameSectionState(JSON.parse(savedState));
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
        <legend className="ncic-legend">{'Query Missing Person (QM)'}</legend>
        <p className="ncic-warning-text">{'AGE, GENDER, RACE, ETHNICITY, EYES, HAIR, HEIGHT, WEIGHT are required.'}</p>
        <div className="ncic-form-container">
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Last Name :
                {errorNameSectionState?.lastName && (
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
                value={nameSectionState.lastName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleNameSectionState("lastName", value);
                  if (errorNameSectionState?.lastName) {
                    handleErrorNameSectionState("lastName", false);
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
                {errorNameSectionState?.firstName && (
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
                value={nameSectionState.firstName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleNameSectionState("firstName", value);
                  if (errorNameSectionState?.firstName) {
                    handleErrorNameSectionState("firstName", false);
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
                value={nameSectionState.middleName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleNameSectionState("middleName", value);
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
                value={nameSectionState?.suffix ? suffixIdDrp?.find((i) => i?.label === nameSectionState?.suffix) : ""}
                onChange={(e) => {
                  handleNameSectionState("suffix", e?.label);
                }}

              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Gender :
                {errorNameSectionState?.sex && (
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
                maxMenuHeight={100}
                value={nameSectionState?.sex ? sexIdDrp?.find((i) => i?.code === nameSectionState?.sex) : ""}
                onChange={(e) => {
                  handleNameSectionState("sex", e?.code);
                  if (errorNameSectionState?.sex) {
                    handleErrorNameSectionState("sex", false);
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
                Race:
                {errorNameSectionState?.race && (
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
                maxMenuHeight={100}
                value={nameSectionState?.race ? raceIdDrp?.find((i) => i?.label === nameSectionState?.race) : ""}
                onChange={(e) => {
                  handleNameSectionState("race", e?.label);
                  if (errorNameSectionState?.race) {
                    handleErrorNameSectionState("race", false);
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
                {errorNameSectionState?.dob && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <DatePicker
                name='dob'
                id='dob'
                onChange={(v) => {
                  handleNameSectionState("dob", v);
                  if (errorNameSectionState?.dob) {
                    handleErrorNameSectionState("dob", false);
                  }
                }}
                selected={nameSectionState?.dob || ""}
                dateFormat="MM/dd/yyyy"
                isClearable={!!nameSectionState?.dob}
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

NameSection.propTypes = {
  nameSectionState: PropTypes.object.isRequired,
  setNameSectionState: PropTypes.func.isRequired,
  handleNameSectionState: PropTypes.func.isRequired,
  clearNameSectionState: PropTypes.func.isRequired,
  suffixIdDrp: PropTypes.array.isRequired,
  raceIdDrp: PropTypes.array.isRequired,
  errorNameSectionState: PropTypes.object,
  handleErrorNameSectionState: PropTypes.func,
};

NameSection.defaultProps = {
  errorNameSectionState: {},
  handleErrorNameSectionState: () => {},
};

export default NameSection;
