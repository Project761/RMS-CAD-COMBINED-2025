import React,{ useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../../../Common/Utility';

const MemberAddUp = () => {
  const [firstKnownDate, setFirstKnownDate] = useState();
  const [firstIdentifiedDate, setFirstIdentifiedDate] = useState();
  const [statusLastDate, setStatusLastDate] = useState();
  const [longerDate, setLongerDate] = useState();
  const [prisonDate, setPrisonDate] = useState();
  const [releasedDate, setReleasedDate] = useState();
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
  const startRef2 = React.useRef();
  const startRef3 = React.useRef();
  const startRef4 = React.useRef();
  const startRef5 = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
      startRef1.current.setOpen(false);
      startRef2.current.setOpen(false);
      startRef3.current.setOpen(false);
      startRef4.current.setOpen(false);
      startRef5.current.setOpen(false);
    }
  };
  return (
    

      <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="MemberModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body">
              <div className="m-1">
                <fieldset style={{ border: '1px solid gray' }}>
                  <legend style={{ fontWeight: 'bold' }}>Gang Member</legend>
                  <div className="col-12 col-md-12  p-0" >
                    <div className="row ">
                      <div className="col-6  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Member Name</label>
                        </div>
                      </div>
                      <div className="col-6  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Name Id</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
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
                      <div className="col-2 col-md-2 col-lg-1 mt-4 ">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name='IsVerify' id="flexCheckDefault" />
                          <label className="form-check-label" htmlFor="flexCheckDefault">
                            Founder 
                          </label>
                        </div>
                      </div>
                      <div className="col-2 col-md-2 col-lg-2 mt-4 pl-5">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name='validate' id="flexCheckDefault1" />
                          <label className="form-check-label" htmlFor="flexCheckDefault1">
                            Leader
                          </label>
                        </div>
                      </div>
                      <div className="col-12  col-md-6 col-lg-6  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Notes</label>
                        </div>
                      </div>
                      <div className="col-12  col-md-6 col-lg-6  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Characteristics</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='MemberType'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Member Type</label>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='Memberstatus'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Member Status</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='firstIdentifiedDate'
                          name='firstIdentifiedDate'
                          ref={startRef1}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setFirstIdentifiedDate(date); setValue({ ...value, ['firstIdentifiedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.firstIdentifiedDate ? true : false}
                          selected={firstIdentifiedDate}
                          placeholderText={value?.firstIdentifiedDate ? value.firstIdentifiedDate : 'Select...'}
                        />
                        <label htmlFor="">First Identified In Gang Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='statusLastDate'
                          name='statusLastDate'
                          ref={startRef2}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setStatusLastDate(date); setValue({ ...value, ['statusLastDate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.statusLastDate ? true : false}
                          selected={statusLastDate}
                          placeholderText={value?.statusLastDate ? value.statusLastDate : 'Select...'}
                        />
                        <label htmlFor="">Status Last Review Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='Probation/ParoleStatus'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Probation/Parole Status</label>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='longerDate'
                          name='longerDate'
                          ref={startRef3}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setLongerDate(date); setValue({ ...value, ['longerDate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.longerDate ? true : false}
                          selected={longerDate}
                          placeholderText={value?.longerDate ? value.longerDate : 'Select...'}
                        />
                        <label htmlFor="">No Longer In Gang Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='prisonDate'
                          name='prisonDate'
                          ref={startRef4}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setPrisonDate(date); setValue({ ...value, ['prisonDate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.prisonDate ? true : false}
                          selected={prisonDate}
                          placeholderText={value?.prisonDate ? value.prisonDate : 'Select...'}
                        />
                        <label htmlFor="">In Prison Date</label>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-3 date__box">
                        <DatePicker
                          id='releasedDate'
                          name='releasedDate'
                          ref={startRef5}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setReleasedDate(date); setValue({ ...value, ['releasedDate']: date ? getShowingMonthDateYear(date) : null }) }}
                          className=''
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.releasedDate ? true : false}
                          selected={releasedDate}
                          placeholderText={value?.releasedDate ? value.releasedDate : 'Select...'}
                        />
                        <label htmlFor="">Last Released From Prison Date</label>
                      </div>
                      <div className="col-12  col-md-6 col-lg-4  mt-1 pt-1" >
                        <div className="text-field">
                          <input type="text" />
                          <label htmlFor="">Jail Prison Location</label>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                          <Select
                            name='certified by'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Select..."
                          />
                          <label>Certified By</label>
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

export default MemberAddUp