import React, { useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../Common/Utility';
const PawnProperty = () => {

    const [value, setValue] = useState();

    // custuom style withoutColor
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
           
            <div className="row  px-0">
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Pawn Status</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2  mt-2" >
                    <Select
                        name='pawnstatus'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Hold To Date</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2  " >
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
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Retrieved Date</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2 " >
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
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Days Held</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2 text-field  mt-2" >
                    <input type="text" required name='daysheld' />
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Sold Date</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2  " >
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
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Sold Amount</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2 text-field  mt-2" >
                    <input type="text" required name='soldAmt' />
                </div>

                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Pawn Amount</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2 text-field  mt-2" >
                    <input type="text" required name='pawnAmt' />
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Retrieved Amount</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2 text-field  mt-2" >
                    <input type="text" required name='retrievedAmt' />
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Interest Rate</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2 text-field  mt-2" >
                    <input type="text" required name='IntRate' />
                </div>
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Transaction Type</label>
                </div>
                <div className="col-4 col-md-4 col-lg-2   mt-2" >
                    <Select
                        name='transactiontype'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
            </div>
            <div className="btn-box text-right mt-2 mb-1">
                <button type="button" className="btn btn-sm btn-success" >Update</button>
            </div>

        </div>


    )
}

export default PawnProperty