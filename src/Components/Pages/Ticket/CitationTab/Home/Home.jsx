import React, { useState } from 'react'
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import DataTable from 'react-data-table-component';
import { tableCustomStyles } from '../../../../Common/Utility';
const Home = () => {
  const [value, setValue] = useState();
  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 35,
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
    
      <div className="col-12">
        <div className="row " >
          <div className="col-2 col-md-3 col-lg-1 mt-2 pt-2 px-0">
            <label htmlFor="" className='new-label px-0'>Citation&nbsp;Number</label>
          </div>
          <div className="col-4 col-md-9 col-lg-2 mt-2 text-field">
            <input type="text" name='Name' id='Name' className='readonlyColor' required readOnly />
          </div>
          <div className="col-2 col-md-3 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'> Date/Time Issued</label>
          </div>
          <div className="col-4 col-md-3 col-lg-3 mt-1">
            <DatePicker
              id='AppearDateTime'
              name='AppearDateTime'
              className='requiredColor'
              dateFormat="MM/dd/yyyy HH:mm"
              // onChange={(date) => { setAppearDate(date); setValue({ ...value, ['AppearDateTime']: date ? getShowingMonthDateYear(date) : null }) }}
              // selected={appearDate}
              timeInputLabel
              isClearable
              placeholderText={'Select...'}
              showTimeSelect
              timeIntervals={1}
              timeCaption="Time"
            />
          </div>
          <div className="col-2 col-md-3 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Incident No.</label>
          </div>
          <div className="d-flex col-2">
            <div className="col-12 col-md-12 col-lg-11 mt-2 text-field ">
              <input type="text" name='Name' id='Name' className='readonlyColor' required readOnly />
            </div>
            <div className="col-1 col-md-1 col-lg-1 pt-2" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
              <span
                className=" btn btn-sm bg-green text-white py-0 px-1"   >
                <i className="fa fa-search" > </i>
              </span>
            </div>
          </div>
          <div className="col-4 col-md-3 col-lg-1 mt-2 pt-1">
            <label htmlFor="" className='new-label'>Ticket Type</label>
          </div>
          <div className="col-4 col-md-3 col-lg-2 mt-1 ">
            <Select
              name="CourtCityID"
              styles={colourStyles}
              // value={cityList?.filter((obj) => obj.value === value?.CourtCityID)}
              isClearable
              // options={cityList}
              // onChange={(e) => selectHandleChange(e, 'CourtCityID')}
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-3 col-lg-2 mt-2 pt-1">
            <label htmlFor="" className='new-label'>Primary Officer</label>
          </div>
          <div className="col-4 col-md-3 col-lg-3 mt-1 ">
            <Select
              name="CourtCityID"
              styles={colourStyles}
              // value={cityList?.filter((obj) => obj.value === value?.CourtCityID)}
              isClearable
              // options={cityList}
              // onChange={(e) => selectHandleChange(e, 'CourtCityID')}
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-3 col-lg-2 mt-2 pt-1">
            <label htmlFor="" className='new-label'>Issuing Agency</label>
          </div>
          <div className="col-4 col-md-9 col-lg-2 mt-1 ">
            <Select
              name="CourtCityID"
              styles={customStylesWithOutColor}
              // value={cityList?.filter((obj) => obj.value === value?.CourtCityID)}
              isClearable
              // options={cityList}
              // onChange={(e) => selectHandleChange(e, 'CourtCityID')}
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-3 col-lg-1 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Location</label>
          </div>
          <div className="col-8 col-md-6 col-lg-9 mt-2 text-field">
            <input type="text" name='Name' id='Name' className='' required />
          </div>
          <div className="col-2 col-md-3 col-lg-2 mt-2 mb-2 d-flex">
            <div className="form-check custom-control custom-checkbox">
              <input className="custom-control-input" data-toggle="modal" data-target="#VerifyModal" type="checkbox" name='IsVerify'
                id="flexCheckDefault" style={{ cursor: 'pointer' }} />
              <label className="custom-control-label " htmlFor="flexCheckDefault" style={{ fontSize: '14px' }}>
                Verify
              </label>
            </div>
            {/* {
                            !value?.IsVerify && addVerifySingleData.length > 0 ?
                                <i className="fa fa-edit pl-3 mt-1 pt-1 " onKeyDown={''} onClick={() => { if (value.crimelocationid) { get_Add_Single_Data(value.crimelocationid); setModalStatus(true); } }} data-toggle="modal" data-target="#VerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                :
                                <>
                                </>
                        } */}
          </div>
          <div className="col-2 col-md-3 col-lg-1 mt-2 pt-1 px-0">
            <label htmlFor="" className='new-label px-0'>Agency&nbsp;Vehicle</label>
          </div>
          <div className="col-4 col-md-3 col-lg-2 mt-1 text-field">
            <input type="text" name='Name' id='Name' className='' required />
          </div>
          <div className="col-2 col-md-3 col-lg-2 mt-2 pt-1">
            <label htmlFor="" className='new-label'>Agency Ticket</label>
          </div>
          <div className="col-4 col-md-3 col-lg-2 mt-1 text-field">
            <input type="text" name='Name' id='Name' className='' required />
          </div>
          <div className="col-12 col-md-12 col-lg-2 mt-2 pt-1 ml-md-5 pl-md-5 ml-lg-0 pl-lg-0">
            <div className="form-check ">
              <input className="form-check-input" name='IsParking' type="checkbox" id="flexCheckDefault" />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Parking Ticket
              </label>
            </div>
          </div>
          <div className="col-2 col-md-3 col-lg-1 mt-2 pt-1">
            <label htmlFor="" className='new-label'>Other Type</label>
          </div>
          <div className="col-4 col-md-9 col-lg-2 mt-1 ">
            <Select
              name="CourtCityID"
              styles={customStylesWithOutColor}
              // value={cityList?.filter((obj) => obj.value === value?.CourtCityID)}
              isClearable
              // options={cityList}
              // onChange={(e) => selectHandleChange(e, 'CourtCityID')}
              placeholder="Select..."
            />
          </div>


        </div>
      </div>
      <div className="col-12 mt-2 px-0">
        <fieldset>
          <legend>Citation  Name Information</legend>
          <div className="row mt-2 px-0">
            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
              <label htmlFor="" className='new-label '>Citation&nbsp;Name</label>
            </div>
            <div className="col-4 col-md-4 col-lg-6 px-0">
              <Select
                name="MissingPersonNameID"
                styles={colourStyles}
                // options={arresteeNameData}
                // value={arresteeNameData?.filter((obj) => obj.value === value?.MissingPersonNameID)}
                isClearable
                // onChange={(e) => ChangeDropDown(e, 'MissingPersonNameID')}
                placeholder="Select..."
              />
            </div>
            <div className="col-1 pt-1" data-toggle="modal" data-target="#MasterModal"  >
              <button

                className=" btn btn-sm bg-green text-white py-1"
              >
                <i className="fa fa-plus" > </i>
              </button>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="col-12 mt-2 px-0">
        <fieldset>
          <legend>Driving Condition</legend>
          <div className="row mt-2 px-0">
            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
              <label htmlFor="" className='new-label'>Weather</label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 px-0">
              <Select
                name="MissingPersonNameID"
                styles={customStylesWithOutColor}
                // options={arresteeNameData}
                // value={arresteeNameData?.filter((obj) => obj.value === value?.MissingPersonNameID)}
                isClearable
                // onChange={(e) => ChangeDropDown(e, 'MissingPersonNameID')}
                placeholder="Select..."
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
              <label htmlFor="" className='new-label'>Traffic</label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 px-0">
              <Select
                name="MissingPersonNameID"
                styles={customStylesWithOutColor}
                // options={arresteeNameData}
                // value={arresteeNameData?.filter((obj) => obj.value === value?.MissingPersonNameID)}
                isClearable
                // onChange={(e) => ChangeDropDown(e, 'MissingPersonNameID')}
                placeholder="Select..."
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
              <label htmlFor="" className='new-label'>Road</label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 px-0">
              <Select
                name="MissingPersonNameID"
                styles={customStylesWithOutColor}
                // options={arresteeNameData}
                // value={arresteeNameData?.filter((obj) => obj.value === value?.MissingPersonNameID)}
                isClearable
                // onChange={(e) => ChangeDropDown(e, 'MissingPersonNameID')}
                placeholder="Select..."
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
              <label htmlFor="" className='new-label'>Light</label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 px-0">
              <Select
                name="MissingPersonNameID"
                styles={customStylesWithOutColor}
                // options={arresteeNameData}
                // value={arresteeNameData?.filter((obj) => obj.value === value?.MissingPersonNameID)}
                isClearable
                // onChange={(e) => ChangeDropDown(e, 'MissingPersonNameID')}
                placeholder="Select..."
              />
            </div>
          </div>
        </fieldset>
      </div>
      <div className="btn-box text-right mt-1 mr-1 mb-2">
        <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center">New</button>
        <button type="button" className="btn btn-sm btn-success mr-1">Save</button>
      </div>
      <div className="col-12 mt-1" >
        <DataTable
          dense
          // data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? courtInfoData : '' : courtInfoData}
          // columns={columns}
          pagination
          highlightOnHover
          // onRowClicked={(row) => { setClickedRow(row); set_Edit_Value(row); }}
          fixedHeaderScrollHeight='150px'
          // conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          persistTableHead={true}
          customStyles={tableCustomStyles}
        // noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}

        />

      </div>
    </>
  )
}

export default Home