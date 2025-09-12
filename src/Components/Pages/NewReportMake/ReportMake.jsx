import React,{ useState } from 'react'
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import { getShowingWithOutTime } from '../../Common/Utility';

const ReportMake = () => {

    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [value, setValue] = useState();

    return (
        <>
            <div className="section-body view_page_design">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency" style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', borderTop: 'none' }}>
                            <div className="card-body">
                                <div className="col-12 px-0">
                                    <div className="row" style={{ marginTop: '-20px' }}>
                                        <div className="col-4 col-md-4 col-lg-4 mt-3 d-flex">
                                            <h6 className='text-bold text-dark'>Date:</h6>
                                            <span className='ml-4'>21-09-23</span>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 text-center mt-1 text-primary">
                                            <h2 >Arustu Mines</h2>
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1 mt-3">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='Narration' id="flexCheckDefault1" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault1">
                                                    Narration
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mb-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='fromDate'
                                                    name='fromDate'
                                                    onChange={(date) => { setFromDate(date); setValue({ ...value, ['fromDate']: date ? getShowingWithOutTime(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.fromDate ? true : false}
                                                    selected={fromDate}
                                                    placeholderText={value?.fromDate ? value.fromDate : 'Select...'}
                                                />
                                                <label htmlFor="" className='pl-0 pt-1' >From</label>
                                            </div>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mb-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='toDate'
                                                    name='toDate'
                                                    onChange={(date) => { setToDate(date); setValue({ ...value, ['toDate']: date ? getShowingWithOutTime(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.toDate ? true : false}
                                                    selected={toDate}
                                                    placeholderText={value?.toDate ? value.toDate : 'Select...'}
                                                />
                                                <label htmlFor="" className='pl-0 pt-1' >To</label>
                                            </div>
                                        </div>
                                        <div className="col-1 col-md-1 col-lg-1 mt-3">
                                            <Link to={''}>
                                                <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" > Report</button>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="bg-line text-white py-1 px-2 mb-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Report
                    </p>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link to='' className="btn btn-sm bg-green text-white px-2 py-0" >
                            <i className="fa fa-print"></i>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="row border-top border-dark " >
                    <div className="col-6  px-2 ">
                        <div className="table-responsive" style={{ height: '450px', overflowY: 'scroll' }} >
                            <table className="table " style={{ height: '400px' }}>
                                <thead className='make-table ' >
                                    <tr >
                                        <th scope="col">Voucher Name</th>
                                        <th scope="col">Voucher Type</th>
                                        <th scope="col">Vch No</th>
                                        <th scope="col">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="">
                                        <td scope="row">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptate, adipisci autem! Corrupti eligendi unde quisquam earum accusantium minima neque dolorum.</td>
                                        <td>iasdakdhsdfhsfhshj</td>
                                        <td>fjsfhskhfskfhs</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <hr />
                        <div className=' float-right mr-3'>
                            <h6 className='text-right col-12  text-dark'>Recipt Total: 6564764</h6>
                        </div>
                    </div>
                    <hr />
                    <div className="vl "></div>
                    {/* <hr /> */}
                    <div className="col-6   ">
                        <div className="table-responsive" style={{ height: '450px', overflowY: 'scroll' }}>
                            <table className="table " style={{ height: '400px' }}>
                                <thead className='make-table'>
                                    <tr>
                                        <th scope="col">Voucher Name</th>
                                        <th scope="col">Voucher Type</th>
                                        <th scope="col">Vch No</th>
                                        <th scope="col">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>
                                    <tr className="">
                                        <td scope="row">R1C1</td>
                                        <td>R1C2</td>
                                        <td>R1C3</td>
                                        <td>44646</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <hr />
                        <div className=' float-right mr-3'>
                            <h6 className='text-right col-12 text-dark text-bold'>Payment Total: 6564764</h6>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ReportMake