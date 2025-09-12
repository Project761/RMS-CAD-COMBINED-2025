import { useCallback, useEffect, useState } from 'react'
import Select from 'react-select'
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { toastifySuccess } from '../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../Personnel/Validation';

const PreviousYearCounterAddUp = (props) => {

  const { preYearCountID, loginAgencyID, modal, pageStatus, setModal, get_Data, status, effectiveScreenPermission } = props

  const [editval, setEditval] = useState([]);

  const [value, setValue] = useState({
    Year: "", Code: "", Format: "", AgencyID: "", LastNumber: "", CounterType: "", CounterDesc: "", CounterID: "",
  });

  const [errors, setErrors] = useState({
    'YearError': '', 'LastNumberError': '', 'FormatError': '',
  });

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.Year)) {
      setErrors(prevValues => { return { ...prevValues, ['YearError']: RequiredFieldIncident(value.Year) } })
    }
    if (RequiredFieldIncident(value.LastNumber)) {
      setErrors(prevValues => { return { ...prevValues, ['LastNumberError']: RequiredFieldIncident(value.LastNumber) } })
    }
    if (RequiredFieldIncident(value.Format)) {
      setErrors(prevValues => { return { ...prevValues, ['FormatError']: RequiredFieldIncident(value.Format) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { YearError, LastNumberError, FormatError } = errors

  useEffect(() => {
    if (YearError === 'true' && LastNumberError === 'true' && FormatError === 'true') {
      if (status) updatePreviousCounters()
      else insertPreviousCounters()
    }
  }, [YearError, LastNumberError, FormatError])


  useEffect(() => {
    if (loginAgencyID) {
      setValue({ ...value, AgencyID: loginAgencyID, })
    }
  }, [loginAgencyID, pageStatus]);

  useEffect(() => {
    if (preYearCountID) {
      getSingleData(preYearCountID)
    }
  }, [pageStatus, preYearCountID]);

  const getSingleData = (preYearCountID) => {
    fetchPostData('Counter/GetSingleData_CounterForPreviousYear', { CounterID: preYearCountID }).then((res) => {
      if (res) {
        setEditval(res);
      }
    })
  }

  useEffect(() => {
    if (preYearCountID && editval?.length > 0) {
      setValue({
        ...value,
        Year: editval[0]?.Year, Code: editval[0]?.Code, Format: editval[0]?.Format, AgencyID: editval[0]?.AgencyID, LastNumber: editval[0]?.LastNumber, CounterType: editval[0]?.CounterType, CounterDesc: editval[0]?.CounterDesc, CounterID: editval[0]?.CounterID,
      })
    } else {
      reset();
    }
  }, [editval, pageStatus]);

  const insertPreviousCounters = () => {
    AddDeleteUpadate('Counter/Insert_CounterForPreviousYear', value).then((res) => {
      if (res.success) {
        setErrors({ ...errors, 'YearError': '', 'LastNumberError': '', 'FormatError': '', })
        toastifySuccess(res?.Message);
        setModal(false); get_Data(loginAgencyID); reset();
      }
    })
  }

  const updatePreviousCounters = () => {
    AddDeleteUpadate('Counter/Update_CounterForPreviousYear', value).then((res) => {
      if (res.success) {
        toastifySuccess(res?.Message);
        setErrors({ ...errors, 'YearError': '', 'LastNumberError': '', 'FormatError': '', })
        setModal(false); get_Data(loginAgencyID); reset();
      }
    })
  }

  const reset = () => {
    setValue({ ...value, Year: "", Code: "", Format: "", AgencyID: "", LastNumber: "", CounterType: "", CounterDesc: "", CounterID: "", });
    setErrors({ ...errors, 'YearError': '', 'LastNumberError': '', 'FormatError': '', });
  }

  const handleChange = (e) => {
    if (e) {
      setValue({
        ...value,
        [e.target.name]: e.target.value
      })
    } else {
      setValue({
        ...value,
        [e.target.name]: ""
      })
    }
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [name]: e.value
      })
    } else {
      setValue({
        ...value,
        [name]: null
      })
    }
  }

  function OnClose() {
    reset(); setModal(false);
  }

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      reset();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

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
    modal ?

      <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PreviousCounterModal" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
          <div className="modal-content">
            <div className="modal-body">
              <div className="m-1 mt-1">
                <fieldset style={{ border: '1px solid gray' }}>
                  <legend style={{ fontWeight: 'bold' }}> Previous Year Counter</legend>
                  <div className="row">
                    <div className="col-12 col-md-12 col-lg-4 mt-1">
                      <div className=" dropdown__box">
                        <Select
                          styles={customStylesWithOutColor}
                          name="CounterID"
                          isClearable
                          onChange={(e) => ChangeDropDown(e, 'CounterID')}
                          placeholder="Select..."
                        />
                        <label className='pl-0'>Application Counter Type</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-4 " style={{ marginTop: '5px' }}>
                      <div className="text-field">
                        <input type="text" name='CounterDesc' value={value?.CounterDesc} onChange={handleChange} className='readonlyColor' readOnly />
                        <label>Counter Type</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-4 " style={{ marginTop: '5px' }}>
                      <div className="text-field">
                        <input type="text" name='Code' value={value?.Code} onChange={handleChange} className='readonlyColor' readOnly />
                        <label>Screen Code</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-4  mt-3" >
                      <div className="text-field">
                        <input type="text" name='Year' value={value?.Year} onChange={handleChange} className='requiredColor' required />
                        <label>Year</label>
                        {errors.YearError !== 'true' ? (
                          <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.YearError}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-4  mt-3" >
                      <div className="text-field">
                        <input type="text" name='LastNumber' value={value?.LastNumber} onChange={handleChange} className='requiredColor' required />
                        <label>Last Number</label>
                        {errors.LastNumberError !== 'true' ? (
                          <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNumberError}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-4  mt-3" >
                      <div className="text-field">
                        <input type="text" name='Format' value={value?.Format} onChange={handleChange} className='requiredColor' required />
                        <label>Format</label>
                        {errors.FormatError !== 'true' ? (
                          <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FormatError}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
           
              <div className="btn-box text-right  mr-1">
                {
                  preYearCountID ?
                    effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                      <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error}>Update</button>
                      : <></> :
                      <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error}>Update</button>
                    :
                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                      <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error}>Save</button>
                      : <></> :
                      <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error}>Save</button>
                }
                <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={OnClose}>Close</button>
              </div>
              <hr />
              <div className="col-12">
                <div className="row">
                  <div className="col-4">
                    <p className='new-format'>Format Codes: <span># - Any Number</span></p>
                  </div>
                  <div className="col-3">
                    <p className='new-format'>YYYY <span> -Current Year</span></p>
                  </div>
                  <div className="col-5 d-flex">
                    <p className='new-format'>YY <span> -Current Year </span >  </p>
                    <p className='new-format pl-3'>MM <span> -Current Month</span >  </p>
                    <p className='new-format pl-3'>DD <span> -Current Date</span >  </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog >

      :
      <>
      </>
  )
}

export default PreviousYearCounterAddUp