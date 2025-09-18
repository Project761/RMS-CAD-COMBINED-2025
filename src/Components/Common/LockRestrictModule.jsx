import React, { useState } from "react";
import Select from "react-select";

const LockRestrictModule = ({ show, onClose }) => {

    const [agency, setAgency] = useState([
        { value: 1, label: "Admin Group" },
        { value: 2, label: "User Group" },
    ]);

    const [agencyPlaceholder] = useState("Select Group");



    // Handlers
    const handleLoginSubmit = (e) => {
        e.preventDefault();
    };



    const handelContinue = () => {
        handleLoginSubmit(new Event("submit"));
    };

    if (!show) return null; // Hide modal if not active

    return (
        <div
            className="modal fade"
            style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: "11111" }}
            id="NibrsAllModuleErrorShowModal"
            tabIndex="-1"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"

            data-backdrop="false"
        >
            <div className="modal-dialog modal-dialog-centered modal-m">
                <div className="modal-content p-3">
                    <div className="col-12">
                        <div className="card-body">
                            <form onSubmit={handleLoginSubmit} autoComplete="off">
                                {/* Title */}
                                <div className="text-center mb-3">
                                    <h5 className="m-0 pb-2">
                                        Select Group and Enter Password
                                    </h5>

                                </div>

                                {/* Group Select */}
                                <div className="form-group mb-3">
                                    <label className="form-label">
                                        Group
                                    </label>
                                    <Select
                                        name="AgencyID"
                                        options={agency}
                                        placeholder={agencyPlaceholder}
                                        isClearable


                                    />

                                </div>

                                {/* Login (readonly) */}
                                <div className="form-group mb-3">
                                    <label className="form-label">Login</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value="Administrator"
                                        readOnly
                                        disabled
                                    />
                                </div>

                                {/* Password */}
                                <div
                                    className="form-group mb-3"
                                    style={{ position: "relative" }}
                                >
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type={"text"}
                                        name="text"
                                        className="form-control"
                                        placeholder="placeholder"
                                        autoComplete="off"

                                    />

                                </div>

                                <div className=" d-flex justify-content-space-between gap-5" style={{ columnGap: "15px" }}>
                                    <button
                                        type="button"
                                        data-dismiss="modal"
                                        className="btn custom-cancel-btn w-100"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn custom-ok-btn w-100"
                                        onClick={handelContinue}
                                    >
                                        Ok
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LockRestrictModule;
