import React, { useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../Common/Utility';
const VehiclePawnProperty = () => {

    const [value, setValue] = useState();
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return (

        <div className="col-12 col-md-12 pt-2 p-0" >
            <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                <p className="p-0 m-0">Vehicle Pawned Property</p>

            </div>
            <div className="col-12 col-md-12 col-lg-12">
                <div className="row  px-0">

                    <div className="col-3 col-md-3 col-lg-3 mt-2">
                        <div className=" dropdown__box">
                            <Select
                                name='pawnstatus'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select.."
                            />
                            <label htmlFor="" className='pl-0'>Pawn Status</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <DatePicker
                                id='holdDate'
                                name='holdDate'
                                onChange={(date) => { setValue({ ...value, ['holdDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                dateFormat="MM/dd/yyyy"
                                isClearable={value?.holdDate ? true : false}
                                selected={value?.holdDate && new Date(value?.holdDate)}
                                maxDate={new Date()}
                                placeholderText={'Select...'}
                                autoComplete="Off"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                            />
                            <label htmlFor="" className='pt-1'>Hold To Date</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <DatePicker
                                id='retrieveDate'
                                name='retrieveDate'
                                onChange={(date) => { setValue({ ...value, ['retrieveDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                dateFormat="MM/dd/yyyy"
                                isClearable={value?.retrieveDate ? true : false}
                                selected={value?.retrieveDate && new Date(value?.retrieveDate)}
                                maxDate={new Date()}
                                placeholderText={'Select...'}
                                autoComplete="Off"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                            />
                            <label htmlFor="" className='pt-1'>Retrieved Date</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3  " style={{ marginTop: '9px' }}>
                        <div className="text-field">
                            <input type="text" required name='daysheld' />
                            <label className='pt-1'>Days Held</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-2">
                        <div className=" dropdown__box">
                            <DatePicker
                                id='soldDate'
                                name='soldDate'
                                onChange={(date) => { setValue({ ...value, ['soldDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                dateFormat="MM/dd/yyyy HH:mm"
                                isClearable={value?.soldDate ? true : false}
                                selected={value?.soldDate && new Date(value?.soldDate)}
                                maxDate={new Date()}
                                placeholderText={'Select...'}
                                autoComplete="Off"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                            />
                            <label htmlFor="" className='pt-1 pl-0'>Sold Date</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3  " style={{ marginTop: '13px' }}>
                        <div className="text-field">
                            <input type="text" required name='soldAmt' />
                            <label >Sold Amount</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3  " style={{ marginTop: '13px' }}>
                        <div className="text-field">
                            <input type="text" required name='pawnAmt' />
                            <label >Pawn Amount</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3  " style={{ marginTop: '13px' }}>
                        <div className="text-field">
                            <input type="text" required name='retrievedAmt' />
                            <label >Retrieved Amount</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3  " style={{ marginTop: '13px' }}>
                        <div className="text-field">
                            <input type="text" required name='IntRate' />
                            <label >Interest Rate</label>
                        </div>
                    </div>

                    <div className="col-3 col-md-3 col-lg-3 mt-2 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='transactiontype'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select.."
                            />
                            <label htmlFor="" className='pl-0'>Transaction Type</label>
                        </div>
                    </div>
                </div>
                <div className="btn-box text-right mt-2 mb-1">
                    <button type="button" className="btn btn-sm btn-success" >Update</button>

                </div>
            </div>
        </div>


    )
}

export default VehiclePawnProperty