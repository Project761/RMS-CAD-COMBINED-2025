import React from 'react'
import CitationMainTab from '../../../Utility/Tab/CitationMainTab'
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";

const CitationAdditional = () => {


  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }
  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };
  return (
    <>
      <div className="section-body view_page_design pt-1 p-1 bt">
        <div className="div">
          <div className="col-12  inc__tabs">
            <CitationMainTab />
          </div>
          <div className="col-12 col-sm-12">
            <div className="card Agency incident-card ">
              <div className="card-body" >
                <div className="col-md-12">
                  <div className="row" style={{ marginTop: '-18px', }}>
                    <div className="col-4 col-md-4 col-lg-2 mt-3">
                      <label htmlFor="" className='label-name '>Next Follow-Up Officer</label>
                    </div>
                    <div className="col-7 col-md-7 col-lg-4  mt-2" >
                      <Select
                        name='OfficerNameID'
                        isClearable
                        styles={customStylesWithOutColor}
                        placeholder="Select.."
                        menuPlacement="bottom"
                      />
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-3">
                      <label htmlFor="" className='label-name '>Next Follow-Up Date/Time</label>
                    </div>
                    <div className="col-7 col-md-7 col-lg-4" >
                      <DatePicker
                        id='AppearDateTime'
                        name='AppearDateTime'
                        className='requiredColor'
                        dateFormat="MM/dd/yyyy HH:mm"
                        timeInputLabel
                        isClearable
                        placeholderText={'Select...'}
                        showTimeSelect
                        timeIntervals={1}
                        timeCaption="Time"
                      />
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-3">
                      <label htmlFor="" className='label-name '>Disposition</label>
                    </div>
                    <div className="col-7 col-md-7 col-lg-4  mt-2" >
                      <Select
                        name='OfficerNameID'
                        isClearable
                        styles={customStylesWithOutColor}
                        placeholder="Select.."
                        menuPlacement="bottom"
                      />
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-3">
                      <label htmlFor="" className='label-name '>Disposition Date/Time</label>
                    </div>
                    <div className="col-7 col-md-7 col-lg-4" >
                      <DatePicker
                        id='AppearDateTime'
                        name='AppearDateTime'
                        className='requiredColor'
                        dateFormat="MM/dd/yyyy HH:mm"
                        timeInputLabel
                        isClearable
                        placeholderText={'Select...'}
                        showTimeSelect
                        timeIntervals={1}
                        timeCaption="Time"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-2 px-0">
                  <fieldset>
                    <legend>Equipment Information</legend>
                    <div className="row mt-2 px-0">
                      <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label '>Equipment Used</label>
                      </div>
                      <div className="col-7 col-md-7 col-lg-4 px-0">
                        <Select
                          name="Equipment"
                          styles={customStylesWithOutColor}
                          isClearable
                          placeholder="Select..."
                        />
                      </div>
                      <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Radar Unit No.</label>
                      </div>
                      <div className="col-7 col-md-7 col-lg-4 mt-1 text-field ">
                        <input type="text" name='Name' id='Name' className='' required />
                      </div>
                      <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label '>Breathalyzer Operator No.</label>
                      </div>
                      <div className="col-7 col-md-7 col-lg-4 px-0">
                        <Select
                          name="Equipment"
                          styles={customStylesWithOutColor}
                          isClearable
                          placeholder="Select..."
                        />
                      </div>
                      <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Posted Speed Limit</label>
                      </div>
                      <div className="col-7 col-md-7 col-lg-4 mt-1 text-field ">
                        <input type="text" name='Name' id='Name' className='' required />
                      </div>
                      <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label '>Breathalyzer Unit No.</label>
                      </div>
                      <div className="col-7 col-md-7 col-lg-4 px-0 mt-1 text-field">
                        <input type="text" name='Name' id='Name' className='' required />
                      </div>
                      <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Alleged Speed</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 mt-1 text-field ">
                        <input type="text" name='Name' id='Name' className='' required />
                      </div>
                      <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Meter</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-1 mt-1 text-field ">
                        <input type="text" name='Name' id='Name' className='' required />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="btn-box text-right mt-1 mr-1 mb-2">
                  <button type="button" className="btn btn-sm btn-success mr-1">Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CitationAdditional