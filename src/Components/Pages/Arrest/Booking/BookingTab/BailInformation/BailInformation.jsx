import React, { useState } from 'react'
import { customStylesWithOutColor, getShowingMonthDateYear } from '../../../../../Common/Utility';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';

const BailInformation = () => {
    const [bailDischargeDate, setBailDischargeDate] = useState();
    const [expirationDate, setExpirationDate] = useState();
    const [bailSetDate, setBailSetDate] = useState();
    const [value, setValue] = useState();
    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
        }
    };
    return (
        <>
        {/* bail-information */}
            <div className="col-12 col-md-12 col-lg-12 ">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Bail Information</p>
                </div>
            </div>
            <div className="col-12 col-md-12 col-lg-12 mt-1">
                <div className="row">
                    <div className="col-6 col-md-4 col-lg-2 mt-1">
                        <div className="text-field">
                            <input type="text" name='BailNumber' id='BailNumber' className='' required />
                            <label >Bail Number</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 mt-1">
                        <div className="text-field">
                            <input type="text" name='cabs' id='cabs' className='' required />
                            <label >Cabs ID</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 mt-1">
                        <div className="text-field">
                            <input type="text" name='gravel' id='gravel' className='' required />
                            <label >Gravel ID</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 mt-1">
                        <div className="text-field">
                            <input type="text" name='complaint' id='complaint' className='' required />
                            <label >Complaint Number</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 mt-1">
                        <div className="text-field">
                            <input type="text" name='Investigation' id='Investigation' className='' required />
                            <label >Investigation ID</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 mt-1">
                        <div className="text-field">
                            <input type="text" name='Power' id='Power' className='' required />
                            <label >Power ID</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='Receipt' id='Receipt' className='' required />
                            <label >Receipt ID</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-4 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="suretytype"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Suerty Type</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='Warrant' id='Warrant' className='' required />
                            <label>Warrant ID</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-4 d-flex px-0">
                        <div className="col-6 col-md-8 col-lg-8 mt-1 pt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='documentationorigination'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select..."
                                />
                                <label htmlFor="" className='pl-0'>Documentation Origination</label>
                            </div>
                        </div>
                        <span className='' style={{ marginLeft: '-10px', marginTop: '1px' }}>
                            <div className="text-field col-md-12 col-lg-12 pt-2 ">
                                <input type="text" name='' id='' placeholder='' className='' required />
                            </div>
                        </span>
                    </div>
                    <div className="col-12 col-md-12 col-lg-4 d-flex px-0">
                        <div className="col-6 col-md-8 col-lg-8 mt-1 pt-1">
                            <div className=" dropdown__box">
                                <Select
                                    name='paymenttype'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select..."
                                />
                                <label htmlFor="" className='pl-0'>Payment Type</label>
                            </div>
                        </div>
                        <span className='' style={{ marginLeft: '-10px', marginTop: '1px' }}>
                            <div className="text-field col-md-12 col-lg-12 pt-2 ">
                                <input type="text" name='' id='' placeholder='' className='' required />
                            </div>
                        </span>
                    </div>
                    <div className=" col-lg-2 ">
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 pt-4 ">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault" />
                            <label className="form-check-label" htmlFor="flexRadioDefault">
                                Money Order
                            </label>
                        </div>
                    </div>
                    <div className="col-2  col-md-2 col-lg-1 pt-4 ">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault" />
                            <label className="form-check-label" htmlFor="flexRadioDefault">
                                Check
                            </label>
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 pt-2 ">
                        <div className="text-field">
                            <input type="text" name='' id='' placeholder='' className='' required />
                        </div>
                    </div>
               
                </div>
            </div>
            {/* other-information */}
            <div className="col-12 col-md-12 col-lg-12 ">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Other Information</p>
                </div>
            </div>
            <div className="col-12 col-md-12 col-lg-12 mt-1">
                <div className="row">
                    <div className="col-6 col-md-8 col-lg-4 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="namesurety1"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Name Of Suerty/Depositor 1</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='amountposted' id='amountposted' className='' required />
                            <label>Amount Posted</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-8 col-lg-4 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="namesurety2"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Name Of Suerty/Depositor 2</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='amountposted' id='amountposted' className='' required />
                            <label>Amount Posted</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='naic' id='naic' className='' required />
                            <label>NAIC ID</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='assurancecomapny' id='assurancecomapny' className='' required />
                            <label>Assurance Company</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='agentname' id='agentname' className='' required />
                            <label>Agent Name</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="courtcode"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Court Code</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-6 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='agencyname' id='agencyname' className='' required />
                            <label>Agency Name</label>
                        </div>
                    </div>
                 
                </div>
            </div>
            {/* bail-details */}
            <div className="col-12 col-md-12 col-lg-12 ">
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Bail Details</p>
                </div>
            </div>
            <div className="col-12 col-md-12 col-lg-12 mt-1">
                <div className="row">
                     <div className="col-6 col-md-4 col-lg-3  ">
                        <div className="dropdown__box">
                            <DatePicker
                                id='bailDischargeDate'
                                name='bailDischargeDate'
                                ref={startRef}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setBailDischargeDate(date); setValue({ ...value, ['bailDischargeDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeInputLabel
                                autoComplete="nope"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                isClearable={value?.bailDischargeDate ? true : false}
                                selected={bailDischargeDate}
                                placeholderText={value?.bailDischargeDate ? value.bailDischargeDate : 'Select...'}
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                            />
                            <label htmlFor="" className='pt-1'>Bail Discharge Date</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="bailfoteid"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Bail Fortfeited</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3  ">
                        <div className="dropdown__box">
                            <DatePicker
                                id='expirationDate'
                                name='expirationDate'
                                ref={startRef1}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setExpirationDate(date); setValue({ ...value, ['expirationDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeInputLabel
                                autoComplete="nope"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                isClearable={value?.expirationDate ? true : false}
                                selected={expirationDate}
                                placeholderText={value?.expirationDate ? value.expirationDate : 'Select...'}
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                            />
                            <label htmlFor="" className='pt-1'>Expiration Date</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="bailtype"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Bail Type</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="bailsetby"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Bail Set By</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3  pt-1">
                        <div className="dropdown__box">
                            <DatePicker
                                id='bailSetDate'
                                name='bailSetDate'
                                ref={startRef2}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setBailSetDate(date); setValue({ ...value, ['bailSetDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeInputLabel
                                autoComplete="nope"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                isClearable={value?.bailSetDate ? true : false}
                                selected={bailSetDate}
                                placeholderText={value?.bailSetDate ? value.bailSetDate : 'Select...'}
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                            />
                            <label htmlFor="" className='pt-1'>Date Bill Set</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='amount' id='amount' className='' required />
                            <label>Bail Amount</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 mt-1 pt-1">
                        <div className=" dropdown__box">
                            <Select
                                name="municipalitycode"
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label htmlFor="">Municipality Code</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='Municipality' id='Municipality' className='' required />
                            <label>Municipality</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='totalamount' id='totalamount' className='' required />
                            <label>Total Amount Received</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-6 " style={{ marginTop: '10px' }}>
                        <div className="text-field">
                            <input type="text" name='bailresult' id='bailresult' className='' required />
                            <label>Bail Result</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12  text-right mt-3 p-0">
                <button type="button" data-toggle="modal" data-target="#myModal" className="btn btn-sm btn-success  mr-1" >Save</button>
                <Link to={'/arrest'}>
                    <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" >Close</button>
                </Link>
            </div>
        </>
    )
}

export default BailInformation