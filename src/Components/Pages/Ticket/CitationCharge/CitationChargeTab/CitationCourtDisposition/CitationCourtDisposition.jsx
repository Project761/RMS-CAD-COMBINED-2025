import React, { useContext, useState } from 'react'
import { getShowingMonthDateYear, tableCustomStyles } from '../../../../../Common/Utility';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { useSelector } from 'react-redux';
import DataTable from 'react-data-table-component';
import { RequiredFieldIncident } from '../../../../Utility/Personnel/Validation';

const CitationCourtDisposition = () => {

  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const { setChangesStatus } = useContext(AgencyContext);

  const [courtDispositionDate, setCourtDispositionDate] = useState();
  const [errors, setErrors] = useState({
    'DispositionDtTmErrors': '', 'CourtDispositionIDErrors': '', 'CommentsErrors': '',
  })
  const [value, setValue] = useState({
    'DispositionDtTm': '', 'Comments': '', 'ExceptionalClearanceID': '', 'ChargeCourtDispositionID': "", 'CourtDispositionID': '',
    'ChargeID': '',
    'CreatedByUserFK': ''
  })
  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };
  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({ ...value, [name]: e.value })
      setChangesStatus(true)
    } else {
      setValue({ ...value, [name]: null })
      setChangesStatus(true)
    }
  }
  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value })
    setChangesStatus(true)
  }
  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.DispositionDtTm)) {
      setErrors(prevValues => { return { ...prevValues, ['DispositionDtTmErrors']: RequiredFieldIncident(value.DispositionDtTm) } })
    }
    if (RequiredFieldIncident(value.CourtDispositionID)) {
      setErrors(prevValues => { return { ...prevValues, ['CourtDispositionIDErrors']: RequiredFieldIncident(value.CourtDispositionID) } })
    }
    if (RequiredFieldIncident(value.Comments)) {
      setErrors(prevValues => { return { ...prevValues, ['CommentsError']: RequiredFieldIncident(value.Comments) } })
    }
  }

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
        <div className="row">
          <div className="col-4 col-md-4 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Disposition Date/Time{errors.DispositionDtTmErrors !== 'true' ? (
              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionDtTmErrors}</span>
            ) : null}</label>
          </div>
          <div className="col-8 col-md-8 col-lg-3 mt-2 ">
            <DatePicker
              ref={startRef}
              onKeyDown={onKeyDown}
              id='DispositionDtTm'
              name='DispositionDtTm'
              className='requiredColor'
              dateFormat="MM/dd/yyyy HH:mm"
              onChange={(date) => { setCourtDispositionDate(date); setValue({ ...value, ['DispositionDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
              selected={courtDispositionDate}
              timeInputLabel
              isClearable={value?.DispositionDtTm ? true : false}
              placeholderText={value?.DispositionDtTm ? value?.DispositionDtTm : 'Select...'}
              showTimeSelect
              timeIntervals={1}
              timeCaption="Time"
            />
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-3">
            <span data-toggle="modal" onClick={() => {

            }} data-target="#ListModel" className='new-link'>
              Exceptional Clearance
            </span>
          </div>
          <div className="col-8 col-md-8 col-lg-5 mt-2 ">
            <Select
              name='ExceptionalClearanceID'
              value={''}
              isClearable
              onChange={''}
              placeholder="Select..."
              styles={customStylesWithOutColor}
            />
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-3">
            <span data-toggle="modal" onClick={() => {

            }} data-target="#ListModel" className='new-link'>
              Court Disposition    {errors.CourtDispositionIDErrors !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtDispositionIDErrors}</span>
              ) : null}
            </span>
          </div>
          <div className="col-8 col-md-8 col-lg-3 mt-2 ">
            <Select
              name='CourtDispositionID'
              styles={colourStyles}
              value={''}
              isClearable
              options={''}
              onChange={''}
              placeholder="Select..."
            />
          </div>

          <div className="col-4 col-md-4 col-lg-2 mt-3">
            <label htmlFor="" className='new-label'>Comments{errors.CommentsError !== 'true' ? (
              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
            ) : null}</label>
          </div>
          <div className="col-8 col-md-8 col-lg-5 mt-2 ">
            <textarea name='Comments' onChange={handleChange} id="Comments" value={value.Comments} cols="30" rows='1' className="form-control requiredColor" ></textarea>
          </div>
        </div>
        <div className="btn-box text-right mt-3 mr-1 mb-2">
          <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" >New</button>
          <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Update</button>
          <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Save</button>

        </div>

        <DataTable
          dense
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          pagination
          highlightOnHover
          fixedHeaderScrollHeight='250px'
          fixedHeader
          persistTableHead={true}
          customStyles={tableCustomStyles}
        />
      </div>

    </>
  )
}

export default CitationCourtDisposition