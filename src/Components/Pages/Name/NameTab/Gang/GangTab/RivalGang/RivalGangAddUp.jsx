import React,{ useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../../../Common/Utility';
const RivalGangAddUp = () => {


  const [firstKnownDate, setFirstKnownDate] = useState();
  const [lastKnownDate, setLastKnownDate] = useState();
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

  const startRef = React.useRef();
  const startRef1 = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
      startRef1.current.setOpen(false);
    }
  };
  return (

      <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="RivalGangModal" tabIndex="-1"  aria-hidden="true" data-backdrop="false">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="m-1">
                <fieldset style={{ border: '1px solid gray' }}>
                  <legend style={{ fontWeight: 'bold' }}>Rival Gang</legend>
                  <div className="col-12 col-md-12  p-0" >
                    <div className="row ">
                      <div className="col-12 col-md-12 col-lg-6 ">
                        <div className=" dropdown__box">
                          <Select
                            name='gangname'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Gang Name</label>
                        </div>
                      </div>
                      <div className="col-12  col-md-12 col-lg-6 " >
                        <div className=" dropdown__box">
                          <textarea name='Location' id="Location" cols="30" rows='1' className="form-control">
                          </textarea>
                          <label htmlFor="">Location Of Origin</label>
                        </div>
                      </div>
                      <div className="col-2 col-md-2 col-lg-2">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name='IsVerify' id="flexCheckDefault" />
                          <label className="form-check-label" htmlFor="flexCheckDefault">
                            Verify
                          </label>
                        </div>
                      </div>
                      <div className="col-10 col-md-10 col-lg-10 ">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name='validate' id="flexCheckDefault1" />
                          <label className="form-check-label" htmlFor="flexCheckDefault1">
                            Validate
                          </label>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                          id='firstKnownDate'
                          name='firstKnownDate'
                          ref={startRef}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setFirstKnownDate(date); setValue({ ...value, ['firstKnownDate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.firstKnownDate ? true : false}
                          selected={firstKnownDate}
                          placeholderText={value?.firstKnownDate ? value.firstKnownDate : 'Select...'}
                        />
                        <label htmlFor="">First Known Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                          id='lastKnownDate'
                          name='lastKnownDate'
                          ref={startRef1}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setLastKnownDate(date); setValue({ ...value, ['lastKnownDate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.lastKnownDate ? true : false}
                          selected={lastKnownDate}
                          placeholderText={value?.lastKnownDate ? value.lastKnownDate : 'Select...'}
                        />
                        <label htmlFor="">Last Active Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-3 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='status'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Status</label>
                        </div>
                      </div>
                      <div className="col-12  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Area Of Operation</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="btn-box text-right mt-3 mr-1 mb-2">
              <button type="button" className="btn btn-sm btn-success mr-1">Save</button>
              <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" >Close</button>
            </div>
          </div>
        </div>
      </dialog>
  
  )
}

export default RivalGangAddUp