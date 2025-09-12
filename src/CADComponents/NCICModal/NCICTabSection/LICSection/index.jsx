import Select from "react-select";

const LICSection = () => {
  return (
    <>
      <fieldset className="ncic-main-container">
        <legend className="ncic-legend">{'Query Stolen Vehicle (QV)'}</legend>
        <p className="ncic-warning-text">{'Enter any one of the following : NIC or LIC or VIN.'}</p>
        <div className="ncic-form-container">
          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                NCIC # (NIC) :
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="new-input w-100 form-control py-1 new-input requiredColor"
              />
            </div>
          </div>

          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                License Plate # (LIC) :
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="new-input w-100 form-control py-1 new-input requiredColor"
              />
            </div>
          </div>

          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                License State (LIS) :
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <Select
                isClearable
                placeholder="Select..."
                className="w-100"
              />
            </div>
          </div>

          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Vehicle Identification # (VIN) :
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="new-input w-100 form-control py-1 new-input requiredColor"
              />
            </div>
          </div>

          {/* New line */}
          <div className="tab-form-row">
            <div className="col-3 d-flex align-self-center justify-content-end">
              <label className="tab-form-label">
                Vehicle Make (VMA)
              </label>
            </div>
            <div className="col-6 d-flex align-self-center justify-content-end">
              <Select
                isClearable
                placeholder="Select..."
                className="w-100"
              />
            </div>
          </div>
        </div>
      </fieldset>

    </>
  )
}

export default LICSection;
