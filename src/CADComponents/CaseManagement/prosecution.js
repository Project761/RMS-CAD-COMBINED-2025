import React from 'react'
import Select from "react-select";
import { colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import useObjState from '../../CADHook/useObjState';
import DatePicker from "react-datepicker";

function Prosecution() {

    const [prosecutionState, setProsecutionState, handleProsecutionState, clearProsecutionState] = useObjState({
        prosecutorOffice: '',
        prosecutorContact: '',
        daCaseNumber: '',
        court: '',
        fillingType: '',
        status: '',
        referralDate: '',
        filingDate: '',
        trialDate: '',
        disposition: '',
        firstAppearance: '',
        note: '',
    })



    return (
        <div className='col-12 col-md-12 col-lg-12 mt-2'>
            <div className='border border-dark rounded p-2'>

                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold text-dark">Prosecution</h6>
                    <button className="btn btn-primary btn-sm" >
                        Send referral
                    </button>
                </div>
                <h6 className="mb-0 fw-bold">Court & Filing Details</h6>
                {/* line 1 */}
                <div className='d-flex justify-content-start align-content-center mt-2'>
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <label className="form-label me-2 mb-0 text-nowrap">Prosecutor Office</label>
                            <Select
                                isClearable
                                options={[]}
                                placeholder="Select..."
                                styles={colorLessStyle_Select}
                                getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                getOptionValue={(v) => v?.PriorityCode}
                                formatOptionLabel={(option, { context }) => {
                                    return context === 'menu'
                                        ? `${option?.PriorityCode} | ${option?.Description}`
                                        : option?.PriorityCode;
                                }}
                                className="w-100 ml-2"
                                name="priorityCode"
                                value={prosecutionState.prosecutorOffice}
                                onChange={(e) => { handleProsecutionState('prosecutorOffice', e); }}
                                onInputChange={(inputValue, actionMeta) => {
                                    if (inputValue.length > 12) {
                                        return inputValue.slice(0, 12);
                                    }
                                    return inputValue;
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap">Prosecutor Contact</label>
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                placeholder='Prosecutor Contact'
                                name="prosecutorContact"
                                value={prosecutionState.prosecutorContact}
                                onChange={(e) => { handleProsecutionState('prosecutorContact', e.target.value); }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap">DA Case #</label>
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                placeholder='DA Case #'
                                name="daCaseNumber"
                                value={prosecutionState.daCaseNumber}
                                onChange={(e) => { handleProsecutionState('daCaseNumber', e.target.value); }}

                            />
                        </div>
                    </div>
                </div>
                {/* line 2 */}
                <div className='d-flex justify-content-start align-content-center mt-2'>
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <label className="form-label me-2 mb-0" style={{ marginLeft: "74px" }}>Court</label>
                            <Select
                                isClearable
                                options={[]}
                                placeholder="Select..."
                                styles={colorLessStyle_Select}
                                getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                getOptionValue={(v) => v?.PriorityCode}
                                formatOptionLabel={(option, { context }) => {
                                    return context === 'menu'
                                        ? `${option?.PriorityCode} | ${option?.Description}`
                                        : option?.PriorityCode;
                                }}
                                className="w-100 ml-2"
                                name="priorityCode"
                                value={prosecutionState.court}
                                onChange={(e) => { handleProsecutionState('court', e); }}
                                onInputChange={(inputValue, actionMeta) => {
                                    if (inputValue.length > 12) {
                                        return inputValue.slice(0, 12);
                                    }
                                    return inputValue;
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <label className="form-label me-2 mb-0" style={{ marginLeft: "86px" }}>Filling Type</label>
                            <Select
                                isClearable
                                options={[]}
                                placeholder="Select..."
                                styles={colorLessStyle_Select}
                                getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                getOptionValue={(v) => v?.PriorityCode}
                                formatOptionLabel={(option, { context }) => {
                                    return context === 'menu'
                                        ? `${option?.PriorityCode} | ${option?.Description}`
                                        : option?.PriorityCode;
                                }}
                                className="w-100 ml-2"
                                name="priorityCode"
                                value={prosecutionState.fillingType}
                                onChange={(e) => { handleProsecutionState('fillingType', e); }}
                                onInputChange={(inputValue, actionMeta) => {
                                    if (inputValue.length > 12) {
                                        return inputValue.slice(0, 12);
                                    }
                                    return inputValue;
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <label className="form-label me-2 mb-0" style={{ marginLeft: "29px" }}>Status</label>
                            <Select
                                isClearable
                                options={[]}
                                placeholder="Select..."
                                styles={colorLessStyle_Select}
                                getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                getOptionValue={(v) => v?.PriorityCode}
                                formatOptionLabel={(option, { context }) => {
                                    return context === 'menu'
                                        ? `${option?.PriorityCode} | ${option?.Description}`
                                        : option?.PriorityCode;
                                }}
                                className="w-100 ml-2"
                                name="priorityCode"
                                value={prosecutionState.status}
                                onChange={(e) => { handleProsecutionState('status', e); }}
                                onInputChange={(inputValue, actionMeta) => {
                                    if (inputValue.length > 12) {
                                        return inputValue.slice(0, 12);
                                    }
                                    return inputValue;
                                }}
                            />
                        </div>
                    </div>
                </div>
                {/* line 3 */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <h6 className="mb-0 fw-bold">Key Dates</h6>
                </div>
                <div className='d-flex justify-content-start align-content-center mt-2'>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap" style={{ marginLeft: "29px" }}>Referral date</label>
                            <DatePicker
                                name='startDate'
                                id='startDate'
                                onChange={(v) => handleProsecutionState('referralDate', v)}
                                selected={prosecutionState.referralDate || ""}
                                dateFormat="MM/dd/yyyy"
                                isClearable={!!prosecutionState.referralDate}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                autoComplete="off"
                                placeholderText="Select Referral Date..."
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap">Filing date</label>
                            <DatePicker
                                name='startDate'
                                id='startDate'
                                onChange={(v) => handleProsecutionState('filingDate', v)}
                                selected={prosecutionState.filingDate || ""}
                                dateFormat="MM/dd/yyyy"
                                isClearable={!!prosecutionState.filingDate}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                autoComplete="off"
                                placeholderText="Select Filing Date..."
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap">Trial date</label>
                            <DatePicker
                                name='startDate'
                                id='startDate'
                                onChange={(v) => handleProsecutionState('trialDate', v)}
                                selected={prosecutionState.trialDate || ""}
                                dateFormat="MM/dd/yyyy"
                                isClearable={!!prosecutionState.trialDate}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                autoComplete="off"
                                placeholderText="Select Trial Date..."
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap">Disposition</label>
                            <DatePicker
                                name='startDate'
                                id='startDate'
                                onChange={(v) => handleProsecutionState('dispositionDate', v)}
                                selected={prosecutionState.dispositionDate || ""}
                                dateFormat="MM/dd/yyyy"
                                isClearable={!!prosecutionState.dispositionDate}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                autoComplete="off"
                                placeholderText="Select Disposition Date..."
                            />
                        </div>
                    </div>
                </div>
                {/* line 4 */}
                <div className='d-flex justify-content-start align-content-center mt-2'>
                    <div className="col-md-3">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap" style={{ marginLeft: "6px" }}>First appearance</label>
                            <DatePicker
                                name='startDate'
                                id='startDate'
                                onChange={(v) => handleProsecutionState('firstAppearanceDate', v)}
                                selected={prosecutionState.firstAppearanceDate || ""}
                                dateFormat="MM/dd/yyyy"
                                isClearable={!!prosecutionState.firstAppearanceDate}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                autoComplete="off"
                                placeholderText="Select First Appearance Date..."
                            />
                        </div>
                    </div>
                    <div className="col-md-9 mt-1">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0">Note</label>
                            <input
                                className="form-control py-1 new-input"
                                placeholder='Note'
                                name="note"
                                value={prosecutionState.note}
                                onChange={(e) => { handleProsecutionState('note', e.target.value); }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-end align-content-center mt-2'>
                <button type="button" className="btn btn-sm btn-success mr-1" >
                    Clear
                </button>
                <button type="button" className="btn btn-sm btn-success mr-1" >
                    Save
                </button>
            </div>
            <div className='border border-dark rounded p-2 mt-2'>
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Gates for Closing Case</h6>
                </div>
                <div className="d-flex my-2">
                    <span style={{ width: "150px" }}>Case Report</span>
                    <span>
                        Approved{" "}
                        <span className="text-success fw-bold">✔</span>{" "}
                        <a href="#" className="fw-semibold" style={{ color: "#204164" }}>View</a>
                    </span>
                </div>
                <div className="d-flex mb-2">
                    <span style={{ width: "150px" }}>All Tasks</span>
                    <span>
                        2 tasks remaining{" "}
                        <span role="img" aria-label="hourglass">⏳</span>{" "}
                        <a href="#" className="fw-semibold" style={{ color: "#204164" }}>Go To Task</a>
                    </span>
                </div>
                <div className="d-flex mb-2">
                    <span style={{ width: "150px" }}>Evidence</span>
                    <span>
                        2 items need disposition{" "}
                        <a href="#" className="fw-semibold" style={{ color: "#204164" }}>Open Property Room</a>
                    </span>
                </div>
                <div className="d-flex">
                    <span style={{ width: "150px" }}>Discovery</span>
                    <span>
                        Not sent{" "}
                        <span role="img" aria-label="hourglass">⏳</span>{" "}
                        <a href="#" className="fw-semibold" style={{ color: "#204164" }}>Open Packet</a> ·{" "}
                        <a href="#" className="fw-semibold" style={{ color: "#204164" }}>Not Required</a>
                    </span>
                </div>
            </div>


        </div>
    )
}

export default Prosecution