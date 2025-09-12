import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { fetchPostData } from "../../../../Components/hooks/Api";
import { Comman_changeArrayFormat, Comman_changeArrayFormat3 } from "../../../../Components/Common/ChangeArrayFormat";
import DatePicker from "react-datepicker";
import { AgencyContext } from "../../../../Context/Agency/Index";
import { colourStyles, colourStylesNoReq } from "../../../Utility/CustomStylesForReact";
import PropTypes from "prop-types";

const VINSection = ({ vehicleSectionState, setVehicleSectionState, handleVehicleSectionState, clearVehicleSectionState, stateList, suffixIdDrp, errorVehicleSectionState, handleErrorVehicleSectionState, clearErrorVehicleSectionState, plateTypeIdDrp, makeIdDrp }) => {
  const { datezone } = useContext(AgencyContext);

  useEffect(() => {
    const savedState = localStorage.getItem('nameSectionState');
    if (savedState) {
      setVehicleSectionState(JSON.parse(savedState));
    }
  }, []);


  return (
    <>
      <fieldset className="ncic-main-container">
        <legend className="ncic-legend">{'Vehicle Registration Transactions (RQ/RNQ)'}</legend>
        <p className="ncic-warning-text">{'DST is required and also enter any one of the following : (Plate No. and Plate Expires) or VIN.'}</p>

        <div className="ncic-form-container">
          {/* New line */}

          <div className="tab-form-row">
            <div className="col-11 tab-form-row-gap d-flex w-100">
              <div className="form-check d-flex align-items-center">
                <input
                  type="radio"
                  className="form-check-input mb-1"
                  id="RQ"
                  value="RQ"
                  checked={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ'}
                  onChange={(e) => {
                    clearVehicleSectionState();
                    clearErrorVehicleSectionState();
                    handleVehicleSectionState("isByRQ_RNQ_QM", e.target.value);
                  }}

                />

                <label className="tab-form-label">
                  By (Plate No. and Plate Expires) or VIN (RQ)s
                </label>
              </div>
              <div className="form-check d-flex align-items-center">
                {/* <input className="form-check-input mb-1" type="radio" /> */}
                <input
                  type="radio"
                  className="form-check-input mb-1"
                  id="RNQ"
                  value="RNQ"
                  checked={vehicleSectionState?.isByRQ_RNQ_QM === 'RNQ'}
                  onChange={(e) => {
                    clearVehicleSectionState();
                    clearErrorVehicleSectionState();
                    handleVehicleSectionState("isByRQ_RNQ_QM", e.target.value);
                  }}
                />
                <label className="tab-form-label">
                  By Name and DOB (RNQ)
                </label>
              </div>
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Last Name :
                {errorVehicleSectionState?.lastName && vehicleSectionState?.isByRQ_RNQ_QM === 'RNQ' && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-4 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="form-control py-1 new-input requiredColor"
                name="lastName"
                placeholder="Last Name"
                value={vehicleSectionState.lastName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleVehicleSectionState("lastName", value);
                  if (errorVehicleSectionState?.lastName) {
                    handleErrorVehicleSectionState("lastName", false);
                  }
                }}
                readOnly={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? true : false}
              />
            </div>
            <div className="col-1 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Suffix :
                {errorVehicleSectionState?.suffix && vehicleSectionState?.isByRQ_RNQ_QM === 'RNQ' && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-4">
              <Select
                styles={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? colourStylesNoReq : colourStylesNoReq}
                placeholder="Select"
                isClearable
                options={suffixIdDrp}
                value={vehicleSectionState?.suffix ? suffixIdDrp?.find((i) => i?.label === vehicleSectionState?.suffix) : ""}
                onChange={(e) => {
                  handleVehicleSectionState("suffix", e?.label);
                  if (errorVehicleSectionState?.suffix) {
                    handleErrorVehicleSectionState("suffix", false);
                  }
                }}
                isDisabled={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? true : false}

              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end ">
              <label className="tab-form-label">
                First Name :
                {errorVehicleSectionState?.firstName && vehicleSectionState?.isByRQ_RNQ_QM === 'RNQ' && (
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
                value={vehicleSectionState.firstName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleVehicleSectionState("firstName", value);
                  if (errorVehicleSectionState?.firstName) {
                    handleErrorVehicleSectionState("firstName", false);
                  }
                }}
                readOnly={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? true : false}

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
                value={vehicleSectionState.middleName}
                onChange={(v) => {
                  const value = v.target.value;
                  handleVehicleSectionState("middleName", value);
                }}
                readOnly={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? true : false}
              />
            </div>
          </div>

          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                DOB :
                {errorVehicleSectionState?.dob && vehicleSectionState?.isByRQ_RNQ_QM === 'RNQ' && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <DatePicker
                name='dob'
                id='dob'
                onChange={(v) => {
                  handleVehicleSectionState("dob", v);
                  if (errorVehicleSectionState?.dob) {
                    handleErrorVehicleSectionState("dob", false);
                  }
                }}
                selected={vehicleSectionState?.dob || ""}
                dateFormat="MM/dd/yyyy"
                isClearable={!!vehicleSectionState?.dob}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
                placeholderText="Select DOB"
                maxDate={new Date(datezone)}
                disabled={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? true : false}
                className={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? "readonlyColor" : "requiredColor"}
              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Plate State :
                {errorVehicleSectionState?.plateState && vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-4">
              <Select
                styles={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? colourStyles : colourStylesNoReq}
                placeholder="Select"
                isClearable
                options={stateList}
                value={vehicleSectionState?.plateState ? stateList?.find((i) => i?.label === vehicleSectionState?.plateState) : ""}
                onChange={(e) => {
                  handleVehicleSectionState("plateState", e?.label);
                  if (errorVehicleSectionState?.plateState) {
                    handleErrorVehicleSectionState("plateState", false);
                  }
                }}
                menuPlacement="top"
                isDisabled={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? false : true}
              />
            </div>
            <div className="col-2 d-flex align-self-center justify-content-end">
              <label className="tab-form-label text-nowrap">
                Plate No. :
                {errorVehicleSectionState?.plateNo && vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-3 d-flex align-self-center justify-content-end ">
              <input
                type="text"
                className={`form-control py-1 new-input requiredColor`}
                name="plateNo"
                placeholder="Plate No."
                value={vehicleSectionState.plateNo}
                onChange={(v) => {
                  const value = v.target.value;
                  handleVehicleSectionState("plateNo", value);
                  if (errorVehicleSectionState?.plateNo) {
                    handleErrorVehicleSectionState("plateNo", false);
                  }
                }}
                readOnly={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? false : true}

              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Plate Expires :
                {errorVehicleSectionState?.platExpires && vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <DatePicker
                name='platExpires'
                id='platExpires'
                onChange={(v) => {
                  handleVehicleSectionState("platExpires", v);
                  if (errorVehicleSectionState?.platExpires) {
                    handleErrorVehicleSectionState("platExpires", false);
                  }
                }}
                selected={vehicleSectionState?.platExpires || ""}
                isClearable={!!vehicleSectionState?.platExpires}
                showMonthDropdown
                showYearDropdown
                showYearPicker
                dateFormat="yyyy"
                maxDate={new Date()}
                minDate={new Date(1900, 0, 1)}
                autoComplete="off"
                placeholderText="Select Plate Expires"
                disabled={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? false : true}
                className={`${vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? 'requiredColor' : 'readonlyColor'}`}
              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Plate Type :
                {errorVehicleSectionState?.playType && vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6">
              <Select
                styles={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? colourStylesNoReq : colourStylesNoReq}
                placeholder="Select"
                isClearable
                options={plateTypeIdDrp}
                value={vehicleSectionState?.playType ? plateTypeIdDrp?.find((i) => i?.shortCode === vehicleSectionState?.playType) : ""}
                onChange={(e) => {
                  handleVehicleSectionState("playType", e?.shortCode);
                  if (errorVehicleSectionState?.playType) {
                    handleErrorVehicleSectionState("playType", false);
                  }
                }}
                isDisabled={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? false : true}
                menuPlacement="top"
              />
            </div>
          </div>

          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                VIN :
                {errorVehicleSectionState?.VIN && vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                )}
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className={`form-control py-1 new-input`}
                name="VIN"
                placeholder="VIN"
                value={vehicleSectionState.VIN}
                onChange={(v) => {
                  const value = v.target.value;
                  handleVehicleSectionState("VIN", value);
                  if (errorVehicleSectionState?.VIN) {
                    handleErrorVehicleSectionState("VIN", false);
                  }
                }}
                readOnly={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? false : true}

              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Make :
              </label>
            </div>
            <div className="col-6">
              <Select
                styles={colourStylesNoReq}
                placeholder="Select"
                isClearable
                options={makeIdDrp}
                value={vehicleSectionState?.make ? makeIdDrp?.find((i) => i?.value === vehicleSectionState?.make) : ""}
                onChange={(e) => {
                  handleVehicleSectionState("make", e?.value);
                }}
                isDisabled={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? false : true}
                menuPlacement="top"
              />
            </div>
          </div>
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Manu. Year :
              </label>
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control py-1 new-input"
                name="manuYear"
                placeholder="Manu. Year"
                value={vehicleSectionState.manuYear}
                onChange={(v) => {
                  const value = v.target.value;
                  handleVehicleSectionState("manuYear", value);
                }}
                readOnly={vehicleSectionState?.isByRQ_RNQ_QM === 'RQ' ? false : true}

              />
            </div>
          </div>
        </div>
      </fieldset>
    </>
  )
}

export default VINSection;

VINSection.propTypes = {
  vehicleSectionState: PropTypes.object.isRequired,
  setVehicleSectionState: PropTypes.func.isRequired,
  handleVehicleSectionState: PropTypes.func.isRequired,
  clearVehicleSectionState: PropTypes.func.isRequired,
  stateList: PropTypes.array.isRequired,
  suffixIdDrp: PropTypes.array.isRequired,
  errorVehicleSectionState: PropTypes.object,
  handleErrorVehicleSectionState: PropTypes.func,
};

VINSection.defaultProps = {
  errorVehicleSectionState: {},
  handleErrorVehicleSectionState: () => { },
};
