import React, { useState } from 'react';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../Common/Utility';

const CertifiedByAddUp = () => {

    const startRef = React.useRef();
    const [certifiedDate, setCertifiedDate] = useState();
    const [value, setValue] = useState();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };


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
       
            <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CertifiedModal" tabIndex="-1"  aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="m-1 mt-3">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Certified By</legend>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                    <div className=" dropdown__box">
                                                        <Select
                                                            name='suffix'
                                                            styles={customStylesWithOutColor}
                                                            isClearable
                                                            options=''
                                                            placeholder="Select"
                                                        />
                                                        <label htmlFor="">Suffix</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-6 mt-1 ">
                                                    <div className="date__box">
                                                        <DatePicker
                                                            id='certifiedDate'
                                                            name='certifiedDate'
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setCertifiedDate(date); setValue({ ...value, ['DOBDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy HH:mm"
                                                            timeInputLabel
                                                            showTimeInput
                                                            isClearable={value?.certifiedDate ? true : false}
                                                            selected={certifiedDate}
                                                            placeholderText={value?.certifiedDate ? value.certifiedDate : 'Select...'}
                                                        />
                                                        <label htmlFor="">DOB</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" className="btn btn-sm btn-success mr-1" >Save</button>
                            <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </dialog>

     
    )
}

export default CertifiedByAddUp