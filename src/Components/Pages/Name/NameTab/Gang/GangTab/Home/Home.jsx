import React,{ useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../../../Common/Utility';
import IdentifyFieldColor from '../../../../../../Common/IdentifyFieldColor';
import { Link } from 'react-router-dom';
const Home = () => {
    const [firstknowndate, setFirstknowndate] = useState();
    const [lastknowndate, setLastknowndate] = useState();
    const [value, setValue] = useState();


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
      
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Gang</p>
                </div>
                <div className="row ">
                    <div className="col-12 col-md-4 col-lg-3 mt-2">
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
                    <div className="col-7  col-md-4 col-lg-6  mt-2 " >
                        <div className=" dropdown__box">
                            <textarea name='Location' id="Location" cols="30" rows='1' className="form-control">
                            </textarea>
                            <label htmlFor="">Location Of Origin</label>
                        </div>
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-4 pt-1 pl-2">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" name='IsVerify' id="flexCheckDefault" />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Verify
                            </label>
                        </div>
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-4 pt-1 pl-4 ">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" name='validate' id="flexCheckDefault1" />
                            <label className="form-check-label" htmlFor="flexCheckDefault1">
                                Validate
                            </label>
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                            id='firstknowndate'
                            name='firstknowndate'
                            ref={startRef}
                            onKeyDown={onKeyDown}
                            onChange={(date) => { setFirstknowndate(date); setValue({ ...value, ['firstknowndate']: date ? getShowingMonthDateYear(date) : null }) }}
                            className=''
                            dateFormat="MM/dd/yyyy"
                            isClearable={value?.firstknowndate ? true : false}
                            selected={firstknowndate}
                            placeholderText={value?.firstknowndate ? value.firstknowndate : 'Select...'}
                        />
                        <label htmlFor="">First Known Date</label>
                    </div>
                    <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                        <DatePicker
                            id='lastknowndate'
                            name='lastknowndate'
                            ref={startRef1}
                            onKeyDown={onKeyDown}
                            onChange={(date) => { setLastknowndate(date); setValue({ ...value, ['lastknowndate']: date ? getShowingMonthDateYear(date) : null }) }}
                            className=''
                            dateFormat="MM/dd/yyyy"
                            isClearable={value?.lastknowndate ? true : false}
                            selected={lastknowndate}
                            placeholderText={value?.lastknowndate ? value.lastknowndate : 'Select...'}
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
                    <div className="col-7  col-md-4 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" />
                            <label htmlFor="">Area Of Operation</label>
                        </div>
                    </div>
                    <div className="col-12 text-right mt-3 p-0">
                        <button type="button" className="btn btn-sm btn-success ">Save</button>
                        <Link to={'/nametab'}>
                            <button type="button" className="btn btn-sm btn-success mx-1" >Close</button>
                        </Link>
                    </div>
                    <IdentifyFieldColor />
                </div>
            </div>
     
    )
}

export default Home