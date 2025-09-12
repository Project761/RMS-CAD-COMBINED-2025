import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../Common/Utility';

const ProgressPage = ({ progressData, progressStatus }) => {

    const [verifyModal, setVerifyModal] = useState(true);

    const [dateFrom, setDateFrom] = useState();
    const [dateTo, setDateTo] = useState();
    const [value, setValue] = useState({
        FBICodeGroupA: "IN ('200','13A','13B','13C','510','220','35A','35B','270','210','250','26A','26B','26C','26D','26E','39A','39B','39C','39D','09A','09B','09C','100','23A','23B','23C','23D','23E','23F','23G','23H','23I','240','370','40A','40B','120','11A','11B','11C','11D','36A','36B','280','290','520')",
        FBICodeGroupB: "IN ('90A','90B','90C','90D','90E','90F','90H','90I','90J','90X','90Y','90Z')",
        gIncidentID: 32,
        strSubmissionType: null,
        DateString: null,
        strSubmissionMonth: null,
        ActualDate: null,
        ReportedDate: null,
        PastErrorMonth: null,
        FromDate: null,
        gIntAgencyID: 19,
        NibrsType: null,
        OHIBRSTYPE: null,
        IsIncidentCheck: null,
        ToDate: null,
    });

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.target.id === 'ReportedDate') {
            e.preventDefault();
        } else {
            if (e.keyCode === 9 || e.which === 9) {
                startRef.current.setOpen(false);
                startRef1.current.setOpen(false);
            }
            void 0;
        }
    };

    const [startDate, setStartDate] = useState(new Date());
    const [startYear, setStartYear] = useState(new Date());

    return (

        <div className="section-body view_page_design pt-3">
            <div className="row clearfix" >
                <div className="col-12 col-sm-12">
                    <div className="card Agency">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-12" style={{ marginTop: '-15px' }}>
                                    <div className="row px-2">
                                        <div className="form-check" >
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked onClick={() => { setVerifyModal(true); }} />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                Monthly Report
                                            </label>
                                        </div>
                                        <div className="form-check ml-4">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => { setVerifyModal(false); }} />
                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                Report By Date Range
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {
                                    verifyModal ?
                                        <div className="col-12 ">
                                            <div className="row px-3">
                                                <div className="col-2 col-md-3 col-lg-2 mt-1 pt-1">
                                                    <label className="label-field text-dark">Date Range:</label>
                                                </div>
                                                <div className="col-4 col-md-3 col-lg-2" style={{ marginTop: '-12px' }}>
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            selected={startDate}
                                                            onChange={(date) => setStartDate(date)}
                                                            dateFormat="MM"
                                                            showMonthYearPicker
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 " style={{ marginTop: '-12px' }}>
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            selected={startYear}
                                                            onChange={(date) => setStartYear(date)}
                                                            showYearPicker
                                                            dateFormat="yyyy"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="col-12 ">
                                            <div className="row px-3">
                                                <div className="col-3 col-md-3 col-lg-2 mt-1 pt-1">
                                                    <label className="label-field text-dark">Date From:</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3" style={{ marginTop: '-12px' }}>
                                                    <div className="dropdown__box" >
                                                        <DatePicker
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            id='dateFrom'
                                                            name='dateFrom'
                                                            dateFormat="MM/dd/yyyy HH:mm"
                                                            onChange={(date) => { setDateFrom(date); setValue({ ...value, ['dateFrom']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            timeInputLabel
                                                            isClearable={value?.dateFrom ? true : false}
                                                            placeholderText={value?.dateFrom ? value?.dateFrom : 'Select...'}
                                                            selected={dateFrom}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-1 pt-1">
                                                    <label className="label-field text-dark">Date To:</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3" style={{ marginTop: '-12px' }}>
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            ref={startRef1}
                                                            onKeyDown={onKeyDown}
                                                            id='dateTo'
                                                            name='dateTo'
                                                            dateFormat="MM/dd/yyyy HH:mm"
                                                            onChange={(date) => { setDateTo(date); setValue({ ...value, ['dateTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            timeInputLabel
                                                            isClearable={value?.dateTo ? true : false}
                                                            placeholderText={value?.dateTo ? value?.dateTo : 'Select...'}
                                                            selected={dateTo}
                                                        />
                                                    </div>
                                                </div>
                                              
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className="col-12 mt-1">
                                <fieldset>
                                    <div className="row px-2">
                                        <div className="col-4 col-md-4 col-lg-2 mt-2">
                                            <label className="label-field ">Submission:</label>
                                        </div>
                                        <div className="col-8 col-md-8  col-lg-4" style={{ marginTop: '-7px' }}>
                                            <div className="text-field  ">
                                                <input type="file" className='' name='' required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row px-2">
                                        <div className="col-4 col-md-4 col-lg-2 mt-3">
                                            <label className="label-field ">Non Reportable:</label>
                                        </div>
                                        <div className
                                            ="col-8 col-md-8  col-lg-4 ">
                                            <div className="text-field  ">
                                                <input type="file" className='' name='' required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row px-2">
                                        <div className="col-4 col-md-4 col-lg-2 mt-3">
                                            <label className="label-field ">Error Log:</label>
                                        </div>
                                        <div className="col-8 col-md-8  col-lg-4 ">
                                            <div className="text-field  ">
                                                <input type="file" className='' name='' required />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-12 mt-1">
                                <fieldset>
                                    <div className="row px-2">
                                        <div className="col-3 col-md-4 col-lg-4">
                                            <label className="label-field text-dark">Base Date:</label>
                                        </div>
                                        <div className="col-9 col-md-8 col-lg-8">
                                            <label className="label-field ">17-07-23:</label>
                                        </div>
                                        <div className="col-2 col-md-4 col-lg-4">
                                            <label className="label-field ">Total Incidents:</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">Processed:</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-4 col-lg-4">
                                            <label className="label-field ">Submission File:</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">Error Log:</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-4 col-lg-4">
                                            <label className="label-field ">Non Reportable Incidents:</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">Arrest(Group A) Count:</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-4 col-lg-4">
                                            <label className="label-field ">Incident Of Group B Offense:</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">Arrest(Group B) Count:</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-4 col-lg-4">
                                            <label className="label-field ">Total Incidents link with Suicide:</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">0</label>
                                        </div>
                                        <div className="col-2 col-md-3 col-lg-3">
                                            <label className="label-field ">Processed:</label>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2">
                                            <label className="label-field ">0</label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div className=" mt-5">
                                <span className='text-danger' style={{ fontSize: '14px' }}>{progressData}</span>
                                <div className="progress mt-1 " style={{ height: '30px' }}>
                                    <progress className="progress-bar progress-bar-striped progress-bar-animated " aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} style={{ width: `${progressStatus}%` }}>
                                    </progress>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default ProgressPage