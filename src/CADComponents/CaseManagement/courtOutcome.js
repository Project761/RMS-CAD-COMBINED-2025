import React, { useState } from 'react'
import Select from "react-select";
import { colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import useObjState from '../../CADHook/useObjState';
import DatePicker from "react-datepicker";


function CourtOutcome() {

    const [CourtOutcomeState, setCourtOutcomeState, handleCourtOutcomeState, clearCourtOutcomeState] = useObjState({
        outcome: '',
        dispositionDate: '',
        judgeCourt: '',
        note: '',
    })

    return (
        <div className='col-12 col-md-12 col-lg-12'>
            <div className='border border-dark rounded p-2'>
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold">Court Outcome (optional)</h6>
                </div>
                <div className='d-flex justify-content-start align-content-center mt-2'>
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap">Outcome</label>
                            <DatePicker
                                name='startDate'
                                id='startDate'
                                onChange={(v) => handleCourtOutcomeState('outcomeDate', v)}
                                selected={CourtOutcomeState.outcomeDate || ""}
                                dateFormat="MM/dd/yyyy"
                                isClearable={!!CourtOutcomeState.outcomeDate}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                autoComplete="off"
                                placeholderText="Select Outcome Date..."
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <label className="form-label mr-2 mb-0 text-nowrap">Disposition Date</label>
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
                                value={CourtOutcomeState.dispositionDate}
                                onChange={(e) => { handleCourtOutcomeState('dispositionDate', e); }}
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
                            <label className="form-label mr-2 mb-0 text-nowrap">Judge/Court</label>
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                placeholder='DA Case #'
                                name="daCaseNumber"
                                value={CourtOutcomeState.judgeCourt}
                                onChange={(e) => { handleCourtOutcomeState('judgeCourt', e.target.value); }}

                            />
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-start align-content-center mt-2'>
                    <div className="col-md-12">
                        <div className="d-flex align-items-center">
                            <label className="form-label me-2 mb-0 text-nowrap" style={{ marginLeft: "26px" }}>Note</label>
                            <textarea
                                className="form-control py-1 new-input ml-2"
                                rows="3"
                                placeholder='Note'
                                name="note"
                                value={CourtOutcomeState.note}
                                onChange={(e) => { handleCourtOutcomeState('note', e.target.value); }}
                            />
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
        </div>
    )
}

export default CourtOutcome