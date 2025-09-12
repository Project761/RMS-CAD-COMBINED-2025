import React, { useEffect, useState } from 'react'
import img from '../../../../../../src/img/images1.jpg'
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingWithOutTime } from '../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';

const IncidentLocation = () => {
    
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const [fromDate, setfromDate] = useState();
    const [toDate, settoDate] = useState();
    const [value, setValue] = useState();
    const [verifyIncident, setverifyIncident] = useState(false)
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); 
            setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData])


    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                id='fromDate'
                                                name='fromDate'
                                                onChange={(date) => { setfromDate(date); setValue({ ...value, ['fromDate']: date ? getShowingWithOutTime(date) : null }) }}
                                                className=''
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.fromDate ? true : false}
                                                selected={fromDate}
                                                placeholderText={value?.fromDate ? value.fromDate : 'Select...'}
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                id='toDate'
                                                name='toDate'
                                                onChange={(date) => { settoDate(date); setValue({ ...value, ['toDate']: date ? getShowingWithOutTime(date) : null }) }}
                                                className=''
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.toDate ? true : false}
                                                selected={toDate}
                                                placeholderText={value?.toDate ? value.toDate : 'Select...'}
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported To Date</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-12 mt-3 text-right">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setverifyIncident(true); }}>Show Report</button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyIncident(false); }}>Clear</button>
                                        <Link to={'/incident-reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* for 1 table */}
            {
                verifyIncident ?

                    <>
                     <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
                            <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">Incidents Location</p>
                                <div style={{ marginLeft: 'auto' }}>
                                    <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                        <i className="fa fa-print"></i>
                                    </Link>
                                    <Link to={''} className="btn btn-sm bg-green  text-white px-2 py-0"  >
                                        <i className="fa fa-file"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="container mt-1">
                            <div className="row" style={{ border: '1px solid #80808085' }}>
                                <div className="col-3 ">
                                    <div className="main">
                                        <img src={img} className="img-fluid" alt style={{ border: '1px solid aliceblue' }} />
                                    </div>
                                </div>
                                <div className="col-8 mt-4">
                                    <div className="main">
                                        <h5 className='text-dark text-bold'>Demo</h5>
                                        <p>30 Lake Center Executive Park</p>
                                        <p>Marlton,Ny08053</p>
                                        <p>Ph:44458582255  <span>  Fax:556565665</span></p>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                </div>
                                <div className="container">
                                    <h2 className="text-center text-danger">Incidents By Location</h2><p className="text-center text-white" style={{ backgroundColor: 'gray' }}>September 1,2014 to September 23,
                                        2014</p>

                                    <div className="col-12">
                                        <div className="table-responsive" style={{ border: '2px solid gray' }}>
                                            <div className="div" style={{ border: '1px solid #dee2e6' }}>
                                                <tr >
                                                    <th >
                                                        Location:
                                                    </th>
                                                    <td>asfasfasfhgaysfhjasgfhjasgf</td>
                                                </tr>
                                            </div>
                                            <table className="table table-bordered" >
                                                <thead >
                                                    <tr className='location-print'>
                                                        <th>incident id</th>
                                                        <th>reported date &amp; time</th>
                                                        <th>rms cfs</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr >
                                                        <td>01123</td>
                                                        <td>09-09-2022</td>
                                                        <td>20-unit vrhicle stop</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h6 className='text-dark text-bold text-right mr-4' >
                                                Total Incident: 2
                                            </h6>
                                        </div>
                                    </div>
                                    {/* 2 */}
                                    <div className="col-12">
                                        <div className="table-responsive" style={{ border: '2px solid gray' }}>
                                            <div className="div" style={{ border: '1px solid #dee2e6' }}>
                                                <tr >
                                                    <th >
                                                        Location:
                                                    </th>
                                                    <td>asfasfasfhgaysfhjasgfhjasgf</td>
                                                </tr>
                                            </div>
                                            <table className="table table-bordered" >
                                                <thead >
                                                    <tr className='location-print'>
                                                        <th>incident id</th>
                                                        <th>reported date &amp; time</th>
                                                        <th>rms cfs</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr >
                                                        <td>01123</td>
                                                        <td>09-09-2022</td>
                                                        <td>20-unit vrhicle stop</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h6 className='text-dark text-bold text-right mr-4' >
                                                Total Incident: 2
                                            </h6>
                                        </div>
                                    </div>
                                    {/* 3 */}
                                    <div className="col-12">
                                        <div className="table-responsive" style={{ border: '2px solid gray' }}>
                                            <div className="div" style={{ border: '1px solid #dee2e6' }}>
                                                <tr >
                                                    <th >
                                                        Location:
                                                    </th>
                                                    <td>asfasfasfhgaysfhjasgfhjasgf</td>
                                                </tr>
                                            </div>
                                            <table className="table table-bordered" >
                                                <thead >
                                                    <tr className='location-print'>
                                                        <th>incident id</th>
                                                        <th>reported date &amp; time</th>
                                                        <th>rms cfs</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr >
                                                        <td>01123</td>
                                                        <td>09-09-2022</td>
                                                        <td>20-unit vrhicle stop</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h6 className='text-dark text-bold text-right mr-4' >
                                                Total Incident: 2
                                            </h6>
                                        </div>
                                    </div>
                                    {/* 4 */}
                                    <div className="col-12">
                                        <div className="table-responsive" style={{ border: '2px solid gray' }}>
                                            <div className="div" style={{ border: '1px solid #dee2e6' }}>
                                                <tr >
                                                    <th >
                                                        Location:
                                                    </th>
                                                    <td>asfasfasfhgaysfhjasgfhjasgf</td>
                                                </tr>
                                            </div>
                                            <table className="table table-bordered" >
                                                <thead >
                                                    <tr className='location-print'>
                                                        <th>incident id</th>
                                                        <th>reported date &amp; time</th>
                                                        <th>rms cfs</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr >
                                                        <td>01123</td>
                                                        <td>09-09-2022</td>
                                                        <td>20-unit vrhicle stop</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h6 className='text-dark text-bold text-right mr-4' >
                                                Total Incident: 2
                                            </h6>
                                        </div>
                                    </div>
                                    {/* 5 */}
                                    <div className="col-12">
                                        <div className="table-responsive" style={{ border: '2px solid gray' }}>
                                            <div className="div" style={{ border: '1px solid #dee2e6' }}>
                                                <tr >
                                                    <th >
                                                        Location:
                                                    </th>
                                                    <td>asfasfasfhgaysfhjasgfhjasgf</td>
                                                </tr>
                                            </div>
                                            <table className="table table-bordered" >
                                                <thead >
                                                    <tr className='location-print'>
                                                        <th>incident id</th>
                                                        <th>reported date &amp; time</th>
                                                        <th>rms cfs</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr >
                                                        <td>01123</td>
                                                        <td>09-09-2022</td>
                                                        <td>20-unit vrhicle stop</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h6 className='text-dark text-bold text-right mr-4' >
                                                Total Incident: 2
                                            </h6>
                                        </div>
                                    </div>
                                    {/* 6 */}
                                    <div className="col-12">
                                        <div className="table-responsive" style={{ border: '2px solid gray' }}>
                                            <div className="div" style={{ border: '1px solid #dee2e6' }}>
                                                <tr >
                                                    <th >
                                                        Location:
                                                    </th>
                                                    <td>asfasfasfhgaysfhjasgfhjasgf</td>
                                                </tr>
                                            </div>
                                            <table className="table table-bordered" >
                                                <thead >
                                                    <tr className='location-print'>
                                                        <th>incident id</th>
                                                        <th>reported date &amp; time</th>
                                                        <th>rms cfs</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr >
                                                        <td>01123</td>
                                                        <td>09-09-2022</td>
                                                        <td>20-unit vrhicle stop</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h6 className='text-dark text-bold text-right mr-4' >
                                                Total Incident: 2
                                            </h6>
                                        </div>
                                    </div>
                                    {/* 7 */}
                                    <div className="col-12">
                                        <div className="table-responsive" style={{ border: '2px solid gray' }}>
                                            <div className="div" style={{ border: '1px solid #dee2e6' }}>
                                                <tr >
                                                    <th >
                                                        Location:
                                                    </th>
                                                    <td>asfasfasfhgaysfhjasgfhjasgf</td>
                                                </tr>
                                            </div>
                                            <table className="table table-bordered" >
                                                <thead >
                                                    <tr className='location-print'>
                                                        <th>incident id</th>
                                                        <th>reported date &amp; time</th>
                                                        <th>rms cfs</th>
                                                    </tr>
                                                </thead>
                                                <tbody >
                                                    <tr >
                                                        <td>01123</td>
                                                        <td>09-09-2022</td>
                                                        <td>20-unit vrhicle stop</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <h6 className='text-dark text-bold text-right mr-4' >
                                                Total Incident: 2
                                            </h6>
                                        </div>
                                    </div>
                                 


                                </div>
                            </div>
                        </div>

                    </>
                    :
                    <>

                    </>
            }
        </>
    )
}

export default IncidentLocation