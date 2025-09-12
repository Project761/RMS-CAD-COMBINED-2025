import React, { useState } from 'react'
import { getShowingMonthDateYear } from '../../../../Common/Utility';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';

const TowingVehicle = () => {
    const [value, setValue] = useState();

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return (

        <div className="col-12 col-md-12  p-0" >
            <div className="row ">
                <div className="col-4 col-md-2 col-lg-1 mt-2 pt-2 px-0">
                    <label htmlFor="" className='new-label px-0'>Authorized By</label>
                </div>
                <div className="col-3 col-md-4 col-lg-3 mt-2 ">
                    <Select
                        name='autorizedBy'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
                <div className="col-4 col-md-3 col-lg-2 mt-2 pt-2">
                    <label htmlFor="" className='new-label'>Towing Company</label>
                </div>
                <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                    <Select
                        name='towingcompany'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
                <div className="col-4 col-md-2 col-lg-2 mt-2 pt-2">
                    <label htmlFor="" className='new-label'>Towing Id</label>
                </div>
                <div className="col-3 col-md-4 col-lg-2 mt-2 text-field ">
                    <input type="text" required name='towingId' />
                </div>
                <div className="col-4 col-md-3 col-lg-1 mt-2 ">
                    <label htmlFor="" className='new-label'>Tow Reason</label>
                </div>
                <div className="col-3 col-md-3 col-lg-3 mt-1">
                    <Select
                        name='towingreason'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
                <div className="col-4 col-md-3 col-lg-2 mt-2 ">
                    <label htmlFor="" className='new-label'>Towing Location</label>
                </div>
                <div className="col-3 col-md-7 col-lg-5 mt-1 text-field ">
                    <textarea name="" id="" cols="1" rows="1">
                    </textarea>
                </div>
                <div className="col-3 col-md-2 col-lg-1 mt-2 ">
                    <div className="form-check ">
                        <input className="form-check-input" type="checkbox" name='IsVerify' data-toggle="modal" data-target="#" id="flexCheckDefault" />
                        <label className="form-check-label mr-2" htmlFor="flexCheckDefault">
                            Verify
                        </label>
                    </div>
                </div>
                <div className="col-4 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Main Type</label>
                </div>
                <div className="col-3 col-md-4 col-lg-3 mt-1 ">
                    <Select
                        name='maintype'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
                <div className="col-4 col-md-3 col-lg-2 mt-2">
                    <label htmlFor="" className='new-label'>Equipment Type</label>
                </div>
                <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                    <Select
                        name='eqipementtype'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
                <div className="col-4 col-md-2 col-lg-2 mt-2">
                    <label htmlFor="" className='new-label'>Letter Sent</label>
                </div>
                <div className="col-3 col-md-4 col-lg-2 mt-1">
                    <Select
                        name='lettersent'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
                <div className="col-4 col-md-3 col-lg-1 mt-2 ">
                    <label htmlFor="" className='new-label'>Why Towed</label>
                </div>
                <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                    <input type="text" required name='whytowed' />
                </div>
                <div className="col-4 col-md-2 col-lg-2 mt-2 ">
                    <label htmlFor="" className='new-label'>Company City</label>
                </div>
                <div className="col-3 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" required name='companyCity' />
                </div>
                <div className="col-4 col-md-3 col-lg-2 mt-2 ">
                    <label htmlFor="" className='new-label'>Towed To</label>
                </div>
                <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                    <Select
                        name='towedTo'
                        styles={customStylesWithOutColor}
                        isClearable
                        placeholder="Select.."
                    />
                </div>
                <div className="col-4 col-md-2 col-lg-1 mt-2  ">
                    <label htmlFor="" className='new-label '>Date/Time</label>
                </div>
                <div className="col-3 col-md-4 col-lg-2  ">
                    <DatePicker
                        id='towedDate'
                        name='towedDate'
                        onChange={(date) => { setValue({ ...value, ['towedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                        dateFormat="MM/dd/yyyy"
                        isClearable={value?.towedDate ? true : false}
                        selected={value?.towedDate && new Date(value?.towedDate)}
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

                <div className="col-2 col-md-4 col-lg-2  pt-2">
                    <div className="form-check ">
                        <input className="form-check-input" type="checkbox" name='NCICCheked' id="flexCheckDefault1" />
                        <label className="form-check-label" htmlFor="flexCheckDefault1">
                            NCIC Checked
                        </label>
                    </div>
                </div>
                <div className="col-2 col-md-4 col-lg-2  pt-2">
                    <div className="form-check ">
                        <input className="form-check-input" type="checkbox" name='SCICCheked' id="flexCheckDefault2" />
                        <label className="form-check-label" htmlFor="flexCheckDefault2">
                            SCIC Checked
                        </label>
                    </div>
                </div>
                <div className="col-2 col-md-4 col-lg-2  pt-2">
                    <div className="form-check ">
                        <input className="form-check-input" type="checkbox" name='plateattech' id="flexCheckDefault3" />
                        <label className="form-check-label" htmlFor="flexCheckDefault3">
                            Plates Attached
                        </label>
                    </div>
                </div>
                <div className="col-2 col-md-4 col-lg-2  pt-2">
                    <div className="form-check ">
                        <input className="form-check-input" type="checkbox" name='SCICENTERED' id="flexCheckDefault4" />
                        <label className="form-check-label" htmlFor="flexCheckDefault4">
                            Entered into SCIC
                        </label>
                    </div>
                </div>

            </div>
         
            <div className="col-12 col-md-12 col-lg-12  p-0 pt-2">
                <fieldset>
                    <legend>Hold/Impound Information</legend>
                    <div className="row  ">
                        <div className="col-12 col-md-12 col-lg-12 ">
                            <div className="form-check ">
                                <input className="form-check-input" type="checkbox" name='impound' id="flexCheckDefault2" />
                                <label className="form-check-label" htmlFor="flexCheckDefault2">
                                    Impound
                                </label>
                            </div>
                        </div>
                        <div className="col-4 col-md-2 col-lg-1 mt-2">
                            <label htmlFor="" className='new-label'>Hold Reason</label>
                        </div>
                        <div className="col-3 col-md-4 col-lg-3 mt-1 ">
                            <Select
                                name='holdreason'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select.."
                            />
                        </div>
                        <div className="col-4 col-md-3 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Hold Ok By</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                            <Select
                                name='holdok'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select.."
                            />
                        </div>
                        <div className="col-4 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Hold Released By</label>
                        </div>
                        <div className="col-3 col-md-4 col-lg-2 mt-1 ">
                            <Select
                                name='holdReleasedby'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select.."
                            />
                        </div>
                        <div className="col-4 col-md-3 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Hold By</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-1 ">
                            <Select
                                name='holdby'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select.."
                            />
                        </div>

                        <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Date/Time Hold Released</label>
                        </div>
                        <div className="col-3 col-md-4 col-lg-2 ">
                            <DatePicker
                                id='releasedDate'
                                name='releasedDate'
                                onChange={(date) => { setValue({ ...value, ['releasedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                dateFormat="MM/dd/yyyy"
                                isClearable={value?.releasedDate ? true : false}
                                selected={value?.releasedDate && new Date(value?.releasedDate)}
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
                    </div>
                </fieldset >
            </div>
     

            <div className="col-12 col-md-12 col-lg-12  p-0">
                <fieldset>
                    <legend>Notify/Release Information</legend>
                    <div className="row  ">
                        <div className="col-4 col-md-2 col-lg-1 mt-2 pt-2 px-0">
                            <label htmlFor="" className='new-label px-0'>Notified By</label>
                        </div>
                        <div className="col-3 col-md-10 col-lg-3 mt-2 ">
                            <Select
                                name='notifyby'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select.."
                            />
                        </div>
                        <div className="col-4 col-md-4 col-lg-2 mt-2 pt-2">
                            <label htmlFor="" className='new-label'>Date/Time Notified</label>
                        </div>
                        <div className="col-3 col-md-8 col-lg-2 ">
                            <DatePicker
                                id='notifyDate'
                                name='notifyDate'
                                onChange={(date) => { setValue({ ...value, ['notifyDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                dateFormat="MM/dd/yyyy"
                                isClearable={value?.notifyDate ? true : false}
                                selected={value?.notifyDate && new Date(value?.notifyDate)}
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
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
                            <label htmlFor="" className='new-label'>Released By</label>
                        </div>
                        <div className="col-10 col-md-10 col-lg-2 mt-2 ">
                            <Select
                                name='releasedby'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select.."
                            />
                        </div>
                        <div className="col-4 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Released To</label>
                        </div>
                        <div className="col-10 col-md-10 col-lg-3 d-flex px-0">
                            <div className="col-10 col-md-10 col-lg-10 mt-1">
                                <Select
                                    name='Releasedto'
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    placeholder="Select.."
                                />
                            </div>
                            <div className="col-1 mt-1">
                                <Link to="/Name-Home?page=clear" className="btn btn-sm bg-green text-white ">
                                    <i className="fa fa-plus"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="col-4 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Date/Time Released</label>
                        </div>
                        <div className="col-3 col-md-10 col-lg-2 ">
                            <DatePicker
                                id='NreleasedDate'
                                name='NreleasedDate'
                                onChange={(date) => { setValue({ ...value, ['NreleasedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                dateFormat="MM/dd/yyyy"
                                isClearable={value?.NreleasedDate ? true : false}
                                selected={value?.NreleasedDate && new Date(value?.NreleasedDate)}
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
                        <div className="col-4 col-md-2 col-lg-2 mt-2">
                            <label htmlFor="" className='new-label'>Owner Proof</label>
                        </div>
                        <div className="col-3 col-md-10 col-lg-2 mt-1 text-field">
                            <input type="text" required name='ownerproof' />

                        </div>
                        <div className="col-4 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label '>Release</label>
                        </div>
                        <div className="col-3 col-md-10 col-lg-5  mt-1">
                            <textarea name="" className='form-control' id="" cols="1" rows="1">
                            </textarea>
                        </div>
                        <div className="col-4 col-md-2 col-lg-2 mt-2">
                            <label htmlFor="" className='new-label'>Comments</label>
                        </div>
                        <div className="col-3 col-md-10 col-lg-4 mt-1">
                            <textarea name="" className='form-control' id="" cols="1" rows="1">
                            </textarea>
                        </div>
                    </div>
                </fieldset>
            </div >
            <div className="btn-box text-right mt-3 ">
                <button type="button" className="btn btn-sm btn-success" >Update</button>
            </div>
        </div>
    )
}

export default TowingVehicle