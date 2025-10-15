import React, { useContext, useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name, customStylesWithOutColor, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import { useReactToPrint } from 'react-to-print';
import { fetchPostData } from '../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { toastifyError } from '../../../Common/AlertMsg';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import Loader from '../../../Common/Loader';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import Location from '../../../Location/Location';

const NameInformation = () => {
    const { datezone, setChangesStatus } = useContext(AgencyContext)
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [loder, setLoder] = useState(false);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let openPage = query?.get('page');

    const [multiImage, setMultiImage] = useState([]);
    const [masterNameID, setMasterNameID] = useState();
    const [nameID, setNameID] = useState();
    const [verifyName, setverifyName] = useState(false);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [ethinicityDrpData, setEthinicityDrpData] = useState([])
    const [masterReportData, setMasterReportData] = useState([]);
    const [reportData, setReportData] = useState([])
    const [localStatus, setlocalStatus] = useState(false);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [nameMultiImg, setNameMultiImg] = useState([]);
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);
    const [locationStatus, setLocationStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [onSelectLocation, setOnSelectLocation] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [value, setValue] = useState({
        'NameIDNumber': '', 'SSN': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'DateOfBirth': '',
        'SexID': null, 'RaceID': null, 'EthnicityID': null, 'IsUSCitizen': '', 'Address': '', 'IsVerify': '', 'AgencyID': '', 'DLNumber': '',
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
    });
    const [searchValue, setSearchValue] = useState({
        NameIDNumber: '', SSN: '', LastName: '', FirstName: '', MiddleName: '', DateOfBirth: '', SexID: null, RaceID: null, EthnicityID: null, Address: '', DLNumber: '',
    });

    const [showFields, setShowFields] = useState({
        showNameIDNumber: false, showSSN: false, showLastName: false, showFirstName: false, showMiddleName: false, showDateOfBirth: false, showSexID: false, showRaceID: false, showEthnicityID: false, showAddress: false, showDLNumber: false,
    });
    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);
    useEffect(() => {
        setShowFields({
            showNameIDNumber: searchValue.NameIDNumber, showSSN: searchValue.SSN, showLastName: searchValue.LastName, showFirstName: searchValue.FirstName, showMiddleName: searchValue.MiddleName, showDateOfBirth: searchValue.DateOfBirth, showSexID: searchValue.SexID !== null, showRaceID: searchValue.RaceID !== null, showEthnicityID: searchValue.EthnicityID !== null, showAddress: searchValue.Address, showDLNumber: searchValue.DLNumber,
        });
    }, [searchValue]);


    // Onload Function
    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginUserName(localStoreData?.UserName); setLoginPinID(localStoreData?.PINID);
            GetSexIDDrp(localStoreData?.AgencyID); GetRaceIdDrp(localStoreData?.AgencyID); getEthinicityDrp(localStoreData?.AgencyID);
            setloginPinID(parseInt(localStoreData?.PINID)); dispatch(get_ScreenPermissions_Data("N103", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData])

    const getEthinicityDrp = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('/DropDown/GetDataDropDown_Ethnicity', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data, 'EthnicityID', 'Description'));
            } else {
                setEthinicityDrpData([])
            }
        })
    };

    const GetRaceIdDrp = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('DropDown/GetData_RaceType', val).then((data) => {
            if (data) {
                setRaceIdDrp(Comman_changeArrayFormat(data, 'RaceTypeID', 'Description'))
            } else {
                setRaceIdDrp([]);
            }
        })
    }

    const GetSexIDDrp = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('DropDown/GetData_SexType', val).then((data) => {
            if (data) {
                setSexIdDrp(Comman_changeArrayFormat(data, 'SexCodeID', 'Description'))
            } else {
                setSexIdDrp([]);
            }
        })
    }

    useEffect(() => {
        if (reportData?.length > 0) {
            setverifyName(true);
        }
    }, [reportData]);

    const get_MasterName_Report = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.NameIDNumber?.trim()?.length > 0 || value?.SSN?.trim()?.length > 0 || value?.DLNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.DateOfBirth?.trim()?.length > 0 ||
            value?.Address?.trim()?.length > 0 ||
            (value?.SexID !== null && value?.SexID != '') || (value?.RaceID !== null && value?.RaceID != '') || (value?.EthnicityID !== null && value?.EthnicityID != '')) {
            const {
                NameIDNumber, SSN, LastName, FirstName, MiddleName, DateOfBirth, SexID, RaceID, EthnicityID, IsUSCitizen, Address, DLNumber,
                IsVerify, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
            } = myStateRef.current
            const val = {
                'NameIDNumber': NameIDNumber, 'SSN': SSN, 'DLNumber': DLNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'DateOfBirth': DateOfBirth, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'IsUSCitizen': IsUSCitizen, 'Address': Address,
                'IsVerify': IsVerify, 'AgencyID': LoginAgencyID,
                IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'ReportName/PrintNameReport' : 'ReportName/GetData_ReportName';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    setReportData(res); setMasterReportData(res[0]); getAgencyImg(LoginAgencyID);
                    get_Name_MultiImage(nameID, masterNameID); setSearchValue(value); setLoder(false);
                } else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setReportData([]); setverifyName(false); setLoder(false);
                    }
                }
                setIsPermissionsLoaded(false)
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setLoder(false); setIsPermissionsLoaded(false)
            }
        } else {
            toastifyError("Please Enter Details"); setLoder(false);
        }
    }
    const handlChange = (e) => {
        if (e.target.name === 'SSN') {
            var ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) { setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] }) }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({ ...value, [e.target.name]: ele })
            } if (e.target.name === 'SSN') {
                return 'true';
            } if (e.target.name.length === 11) {
                return 'true'
            }
        }
        else if (e.target.name === 'DLNumber' || e.target.name === 'Address' || e.target.name === 'DLMiddleNameNumber' || e.target.name === 'FirstName' || e.target.name === 'LastName' || e.target.name === 'NameIDNumber' || e.target.name === 'MiddleName') {
            const inputValue = e.target.value;
            const checkInput = inputValue.replace(/[^a-zA-Z0-9@#$%&*!.,\s()\-]/g, ""); // Add () and - to the allowed list
            const finalInput = inputValue.trim() === "" ? checkInput.replace(/\s/g, "") : checkInput;
            setValue({ ...value, [e.target.name]: finalInput });
        }
        else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    }

    const ChangeDropDown = (e, name) => {
        if (e) { setValue({ ...value, [name]: e.value, }); }
        else { setValue({ ...value, [name]: null, }); }
    }

    const resetFields = () => {
        setLocationStatus(true);
        setValue({
            ...value,
            'NameIDNumber': '', 'SSN': '', 'LastName': '', 'DLNumber': '', 'FirstName': '', 'MiddleName': '', 'DateOfBirth': '', 'SexID': null, 'RaceID': null, 'EthnicityID': null, 'IsUSCitizen': '', 'Address': '', 'IsVerify': '',
        });
        setverifyName(false); setMasterReportData([]); setShowWatermark('')
    }

    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            }
            else { console.log("errror") }
        })
    }

    const get_Name_MultiImage = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID, }
        const val1 = { 'NameID': 0, 'MasterNameID': masterNameID, }
        fetchPostData('MasterName/GetData_MasterNamePhoto', val)
            .then((res) => {
                if (res) {
                    setNameMultiImg(res);
                }
                else { setNameMultiImg(); }
            })
    }

    const handleChangeMNI = (e) => {
        let ele = e.target.value
        if (e) {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
        if (!ele?.length) { if (e.target.name == 'NameIDNumber') { setValue({ ...value, ['NameIDNumberTo']: "", ['NameIDNumber']: '' }) } }
    }

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => { setLoder(true); },
        onAfterPrint: () => { setLoder(false); }
    });

    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => { printForm(); get_MasterName_Report(true); setShowFooter(false); }, 100);
    };

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("N103", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {
        if (isPermissionsLoaded) {
            get_MasterName_Report()
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);

    useEffect(() => {
        myStateRef.current = value;
    }, [value])

    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset>
                                    <legend>Name Master Report</legend>
                                    <div className="form-check ml-2 col-9 col-md-9 col-lg-12 mt-1 pt-1 text-right">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="watermarkCheckbox"
                                            checked={showWatermark}
                                            onChange={(e) => setShowWatermark(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="watermarkCheckbox">
                                            Print Confidential Report
                                        </label>
                                    </div>
                                    <div className="row mt-1">
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>MNI</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='NameIDNumber' maxLength={11} value={value?.NameIDNumber} onChange={handleChangeMNI} id='NameIDNumber' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>SSN</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='SSN' value={value?.SSN} onChange={handlChange} id='SSN' maxLength={9} className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1  mt-2 px-0">
                                            <label htmlFor="" className='new-label px-0'>DL&nbsp;Number</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='DLNumber' value={value?.DLNumber} onChange={handlChange} id='DLNumber' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Last Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='LastName' value={value?.LastName} onChange={handlChange} id='LastName' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>First Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='FirstName' value={value?.FirstName} onChange={handlChange} id='FirstName' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                                            <label htmlFor="" className='new-label px-0'>Middle&nbsp;Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='MiddleName' value={value?.MiddleName} onChange={handlChange} id='MiddleName' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Gender</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                            <Select
                                                name='SexID'
                                                value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                options={sexIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Race</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                            <Select
                                                name='RaceID'
                                                value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                options={raceIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Ethnicity</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                            <Select
                                                name='EthnicityID'
                                                value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                options={ethinicityDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>DOB</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                            <DatePicker
                                                id='DateOfBirth'
                                                name='DateOfBirth'
                                                dateFormat="MM/dd/yyyy"
                                                onChange={(date) => setValue({ ...value, ['DateOfBirth']: date ? getShowingWithOutTime(date) : "" })}
                                                isClearable={value.DateOfBirth ? true : false}
                                                selected={value?.DateOfBirth && new Date(value.DateOfBirth)}
                                                placeholderText={'Select...'}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                // dropdownMode="select"
                                                autoComplete='Off'
                                                maxDate={new Date()}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Address</label>
                                        </div>
                                        <div className="col-9 col-md-9 col-lg-7 text-field mt-2 ">
                                            <Location
                                                {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setChangesStatus, setStatesChangeStatus }}
                                                col='Address'
                                                locationID='crimelocationid'
                                                check={false}
                                                verify={true}
                                                style={{ resize: 'both' }}
                                            />
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 text-right mt-3">
                                        {
                                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_MasterName_Report(false); }} >Show Report</button>
                                                : <></> :
                                                <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_MasterName_Report(false); }} >Show Report</button>
                                        }
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields() }}>Clear</button>
                                        <Link to={'/Reports'}>
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
                verifyName ?
                    reportData?.length > 0 ?
                        <>
                            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">Name Master Report</p>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            <i className="fa fa-print" onClick={handlePrintClick}></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="container mt-1"  >
                                <div className="col-12">
                                    <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }}>
                                        {showWatermark && (
                                            <div className="watermark-print">Confidential</div>
                                        )}
                                        <>
                                            <div className="col-4 col-md-3 col-lg-2 pt-1 ml-3">
                                                <div className="main">
                                                    <div className="img-box" >
                                                        <img src={multiImage} className='' style={{ marginTop: '4px', width: '150px', height: '150px' }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-7 col-md-7 col-lg-9 mt-2">
                                                <div className="main">
                                                    <h5 className='text-dark font-weight-bold'>{masterReportData?.Agency_Name}</h5>
                                                    <p className='text-p'>Address: <span className='text-address'>{masterReportData?.Agency_Address1}</span></p>
                                                    <div className='d-flex justify-content-start flex-wrap'>
                                                        <p className='text-p'>City: <span className='text-gray ml-2'>{masterReportData?.CityName}</span></p>
                                                        <p className='text-p mb-1 ml-3'>State: <span className='text-gray'>{masterReportData?.StateName}</span></p>
                                                        <p className='text-p mb-1 ml-3'>Zip: <span className='text-gray'>{masterReportData?.Zipcode}</span></p>
                                                    </div>
                                                    <div className='d-flex justify-content-start flex-wrap'>
                                                        <p className='text-p mb-1'>Phone: <span className='text-gray ml-1'>{masterReportData?.Agency_Phone}</span></p>
                                                        <p className='text-p mb-1 ml-4'>Fax: <span className='text-gray'>{masterReportData?.Agency_Fax}</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>

                                        <div className="col-12">
                                            <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                            <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Name Master Report</h5>
                                        </div>
                                        <div className="col-12">
                                            <fieldset>
                                                <legend>Search Criteria</legend>
                                                <div className="row">
                                                    {showFields.showNameIDNumber && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>MNI</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.NameIDNumber || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showSSN && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>SSN</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.SSN || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showLastName && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>Last Name</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.LastName || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showFirstName && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>First Name</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.FirstName || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showMiddleName && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>Middle Name</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.MiddleName || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showDateOfBirth && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>DOB</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.DateOfBirth || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}

                                                    {showFields.showSexID && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>Gender</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={sexIdDrp.find((obj) => obj.value === searchValue.SexID)?.label || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showRaceID && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>Race</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={raceIdDrp.find((obj) => obj.value === searchValue.RaceID)?.label || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showEthnicityID && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>Ethnicity</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={ethinicityDrpData.find((obj) => obj.value === searchValue.EthnicityID)?.label || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showAddress && (
                                                        <>
                                                            {/* <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>Address</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-11 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.Address || ''} readOnly />
                                                            </div> */}
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2 print-address-label">
                                                                <label className='new-label'>Address</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-11 text-field mt-1 print-address-input">
                                                                <input type="text" className='readonlyColor readonlyColosshow' value={searchValue.Address || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showDLNumber && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                                                <label className='new-label'>DL Number</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-5 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.DLNumber || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}

                                                </div>
                                            </fieldset>
                                        </div>
                                        {
                                            masterReportData?.Name?.length > 0 ?
                                                <>
                                                    {
                                                        masterReportData?.Name?.map((obj) => (
                                                            <>
                                                                <div className="container" style={{ pageBreakAfter: 'always', border: '1px solid #80808085' }}>
                                                                    <h5 className=" text-white text-bold bg-green py-1 px-3"> MNI:- {obj.NameIDNumber}</h5>

                                                                    <div className="col-12  " >
                                                                        <div className="container bb">
                                                                            <div className="col-12 ">
                                                                                <h6 className=' text-dark mt-2'>Name Information</h6>
                                                                                <div className="row px-3 mb-2" >
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-1 ">
                                                                                        <div className='text-field'>
                                                                                            <input type="text" className='readonlyColor' name='Name' required readOnly
                                                                                                value={obj.NameType_Description}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Name Type</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-1">
                                                                                        <div className='text-field'>
                                                                                            <input type="text" className='readonlyColor' name='Name' required readOnly
                                                                                                value={obj.FullName}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Name</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    {obj.NameType_Description === 'Business' ? (
                                                                                        <>

                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4 ">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='Name' required readOnly
                                                                                                        value={obj.BusinessType_Description}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Business Type:</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4 ">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='Name' required readOnly
                                                                                                        value={obj.OwnerName}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Owner Name</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4 ">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='Name' required readOnly
                                                                                                        value={obj.OwnerFaxNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Owner Fax Number</label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : null}
                                                                                    {obj.NameType_Description === 'Person' ? (
                                                                                        <>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-1 ">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='Suffix' required readOnly
                                                                                                        value={obj.Suffix_Decsription}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Suffix</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.DateOfBirth ? getShowingWithOutTime(obj?.DateOfBirth) : ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>DOB</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.AgeFrom}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Age From</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.AgeTo}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Age To</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.AgeUnit_Decsription}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Age Unit</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.Gender}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Gender</label>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.HeightFrom != null || obj?.HeightTo != null
                                                                                                            ? `${obj.HeightFrom || ''}-${obj.HeightTo || ''}`.replace(/-$/, '')
                                                                                                            : ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Height</label>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.WeightFrom != null || obj?.WeightTo != null
                                                                                                            ? `${obj.WeightFrom || ''}-${obj.WeightTo || ''}`.replace(/-$/, '')
                                                                                                            : ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Weight</label>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.EyeColor_Description}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Eye Color</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.HairColor_Description}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Hair Color</label>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.Resident_Description}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Resident</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.MaritalStatus_Description}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Marital Status</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.Ethnicity_Description}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Ethnicity</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.Race_Description}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Race</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={obj?.SSN}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>SSN</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.SID)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>SID No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.SPN)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>SPN No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.State)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>State No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.TAX)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Tax No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.Jacket)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Jacket No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.FBI)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>FBI No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.LCL)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Local No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.MNU)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>MNU No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.NCIC)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>NCIC No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.NYID)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>NYSID No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.OCN)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>OCN No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                        value={JSON.parse(obj?.SBI)[0]?.IdentificationNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>SBI No.</label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    ) : null}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* dl-info */}
                                                                    <div className="col-12  " >
                                                                        <div className="container bb">
                                                                            <h6 className=' text-dark mt-2'>DL Information</h6>
                                                                            <div className="col-12 ">
                                                                                <div className="row bb px-3 mb-2">
                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.CountryName}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Country</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.StateName}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>State</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.DLNumber}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>DL Number</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj?.DLExpiryDate ? getShowingWithOutTime(obj?.DLExpiryDate) : ''}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>DL Expiry Date
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.Verify_Description1}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>How Verify</label>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    {/* birth-info */}
                                                                    <div className="col-12  " >
                                                                        <div className="container bb">
                                                                            <h6 className=' text-dark mt-2'>Birth Information</h6>
                                                                            <div className="col-12 ">
                                                                                <div className="row bb px-3 mb-2">
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.BICountryName}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Country</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.BIStateName}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>State</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.BICity_Name}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>City</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.BirthPlace}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Place Of Birth</label>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.BINationality}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Nationality</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.BINationality}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>How Verify</label>
                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    {/* apperence */}
                                                                    <div className="col-12  " >
                                                                        <div className="container bb">
                                                                            <h6 className=' text-dark mt-2'>Appearance Information</h6>
                                                                            <div className="col-12 ">
                                                                                <div className="row bb px-3 mb-2">
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.FaceShape}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Face Shape</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.Complexion_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Complexion</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.HairStyle_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Hair Style</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.FacialHair_Desc1}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Facial Hair 1</label>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.NameDistinctFeaturesCode_Desc1}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Distinct Feature 1</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.HairLength_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Hair Length</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.FacialHair_Desc2}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Facial Hair 2
                                                                                            </label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.NameDistinctFeaturesCode_Desc2}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Distinct Feature 2</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.HairShade_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Hair Shade</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.FacialOddity_Desc1}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Facial Oddity 1
                                                                                            </label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.odyBuild_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Body Build</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.Speech_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Speech</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.FacialOddity_Desc2}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Facial Oddity 2</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.Teeth_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Teeth</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.Glasses_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Glasses</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.FacialOddity_Desc3}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Facial Oddity 3</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.Clothing}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Clothing</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.Handedness_Desc}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Handedness</label>

                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                    {/* Address */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.AddressTab)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Address</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.AddressTab)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 mb-2">
                                                                                                        <div className="col-12 " >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.Address}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Address</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.AddressFlags}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Address Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.DateFrom ? getShowingDateText(obj.DateFrom) : ''}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Date From</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.DateTo ? getShowingDateText(obj.DateTo) : ''}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Date To</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* IdentificationNumber */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.IdentificationNumber)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>Identification Number Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.IdentificationNumber)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 mb-2">
                                                                                                        <div className="col-12 " >
                                                                                                            <div className="row mb-1">
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.IdType_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Identification Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.IdentificationTypeID === '2' || item.IdentificationTypeID === 2 ? item.IdentificationNumber : item.DLIdentificationNumber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Identification Number</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.ExpiryDate ? getShowingDateText(obj.ExpiryDate) : ''}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>ID Expiry
                                                                                                                        </label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.CountryName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Country</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.StateName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>State</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* smt */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.SMT)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>SMT Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.SMT)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 mb-2 ">
                                                                                                        <div className="col-12 " >
                                                                                                            <div className="row mb-1">
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.SMTLocation_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>SMT Location</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.SMTType_Decription}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>SMT Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.SMT_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>SMT Description</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* alias */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Aliases)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Alias Name Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Aliases)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 mb-2">
                                                                                                        <div className="col-12" >
                                                                                                            <div className="row mb-1">
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.FullName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Alias Name</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.DOB ? getShowingWithOutTime(item.DOB) : ''}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Alias DOB</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.AliasSSN}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Alias SSN</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.Suffix_Decsription}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Suffix</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* contact */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.NameContact)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Contact Details</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.NameContact)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 mb-2">
                                                                                                        <div className="col-12" >
                                                                                                            <div className="row mb-1">
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.ContactType_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Contact Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.Phone_Email}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Phone/Email</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-4 pt-1">
                                                                                                                    <div className=''>
                                                                                                                        <input
                                                                                                                            type="checkbox"
                                                                                                                            name=""
                                                                                                                            id=""
                                                                                                                            checked={item && Object.keys(item).length > 0 ? item.IsCurrentPh : false}
                                                                                                                            disabled={!item || Object.keys(item).length === 0}
                                                                                                                        // checked={obj?.IsCurrentPh || false}
                                                                                                                        // disabled={!obj}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary pl-2'>Current Phone</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-3 col-md-3 col-lg-2 mt-4 pt-1">
                                                                                                                    <div className=''>
                                                                                                                        <input
                                                                                                                            type="checkbox"
                                                                                                                            name=""
                                                                                                                            id=""
                                                                                                                            checked={item && Object.keys(item).length > 0 ? item.IsInListedPh : false}
                                                                                                                            disabled={!item || Object.keys(item).length === 0}
                                                                                                                        // checked={obj?.IsInListedPh || false}
                                                                                                                        // disabled={!obj}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary pl-2'>Unlisted Phone</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* //----------------------------Warrant Informatio------------------------------ */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Warrant)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Warrant Information:</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Warrant)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 mb-2">
                                                                                                        <div className="col-12 " >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.WarrantNumber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Warrant Number</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.WarrantType_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Warrant Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.AssignedOfficer}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Assigned Officer</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.WarrantStatus}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Warrant Status</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.DateTimeIssued ? getShowingWithOutTime(item.DateTimeIssued) : ''}

                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Issued Date/Time</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.DateExpired ? getShowingWithOutTime(item.DateExpired) : ''}

                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Expired Date/Time</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.Agency}

                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Issuing Agency</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* //----------------------------Activity Informatio------------------------------ */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Incident)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Activity Information:</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Incident)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 mb-2">
                                                                                                        <div className="col-12" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.IncidentNumber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Incident Number</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.ReportedDate ? getShowingWithOutTime(item.ReportedDate) : ''}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Reported Date</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.CADCFSCode_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>CAD/CFS Code</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.RMSDisposition_Desc}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Exceptional Clearance(Yes/No)</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.NameReason}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Reason Code</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >


                                                                    {/* //---------------------------------------PropertyInformation----------------------------------------- */}

                                                                    <div className="table-responsive" >
                                                                        {
                                                                            JSON.parse(obj?.Property)?.length > 0 ?
                                                                                <>
                                                                                    <h5 className="text-white text-bold bg-green py-1 px-3">Property Information:</h5>
                                                                                    <table className="table table-bordered" >
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className=''>Property Number:</th>
                                                                                                <th className=''>Type:</th>
                                                                                                <th className=''>Classification</th>
                                                                                                <th className=''>Value</th>
                                                                                                <th className=''>Reason</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className='master-tbody'>
                                                                                            {
                                                                                                JSON.parse(obj?.Property)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                            <td>{item.PropertyNumber}</td>
                                                                                                            <td>{item.PropertyType_Description}</td>
                                                                                                            <td>{item.PropertyClassification_Description}</td>
                                                                                                            <td>{item.Value}</td>
                                                                                                            <td>{item.PropertyLossCode_Description}</td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div>

                                                                    {/* ----------------------Arrest Information---------------------- */}
                                                                    <div className="table-responsive" >
                                                                        {
                                                                            JSON.parse(obj?.Arrest)?.length > 0 ?
                                                                                <>
                                                                                    <h5 className="text-white text-bold bg-green py-1 px-3">Arrest Information:</h5>
                                                                                    <table className="table table-bordered" >
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className=''>Arrest Number:</th>
                                                                                                <th className=''>Incident Number:</th>
                                                                                                <th className=''>Arrest Date:</th>
                                                                                                <th className=''>Offense Code/Nmae</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className='master-tbody'>
                                                                                            {
                                                                                                JSON.parse(obj?.Arrest)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                            <td>{item.ArrestNumber}</td>
                                                                                                            <td>{item.IncidentNumber}</td>
                                                                                                            <td>{getShowingWithOutTime(item.ArrestDtTm)}</td>
                                                                                                            <td>{item.ChargeCode_Description}</td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div>
                                                                    {/* ----------------------Vehicle Information---------------------- */}
                                                                    <div className="table-responsive" >
                                                                        {
                                                                            JSON.parse(obj?.Vehicle)?.length > 0 ?
                                                                                <>
                                                                                    <h5 className="text-white text-bold bg-green py-1 px-3">Vehicle Information:</h5>
                                                                                    <table className="table table-bordered" >
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className=''>Vehicle Number:</th>
                                                                                                <th className=''>Category:</th>
                                                                                                <th className=''>Classification</th>
                                                                                                <th className=''>Value</th>
                                                                                                <th className=''>Reason Code</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className='master-tbody'>
                                                                                            {
                                                                                                JSON.parse(obj?.Vehicle)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                            <td>{item.VehicleNumber}</td>
                                                                                                            <td>{item.Category_Description}</td>
                                                                                                            <td>{item.Classification_Description}</td>
                                                                                                            <td>{item.Value}</td>
                                                                                                            <td>{item.LossCode_Description}</td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div>

                                                                    {/* //----------------------------Transaction Informatio------------------------ */}
                                                                    <div className="table-responsive" >
                                                                        {
                                                                            JSON.parse(obj?.Transaction)?.length > 0 ?
                                                                                <>
                                                                                    <h5 className="text-white text-bold bg-green py-1 px-3">Transaction Information:</h5>
                                                                                    <table className="table table-bordered" >
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className=''>TransactionNumber:</th>
                                                                                                <th className=''>TransactionName:</th>
                                                                                                <th className=''>Date of Birth</th>
                                                                                                <th className=''>Age</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className='master-tbody'>
                                                                                            {
                                                                                                JSON.parse(obj?.Transaction)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                            <td>{item.TransactionNumber}</td>
                                                                                                            <td>{item.TransactionName}</td>
                                                                                                            {/* <td>{getShowingWithOutTime(item.DateOfBirth)}</td> */}
                                                                                                            <td>{item.DateOfBirth ? getShowingWithOutTime(item.DateOfBirth) : ''}</td>
                                                                                                            <td>{item.Age}</td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div>



                                                                    {/* Name History */}
                                                                    <div className="table-responsive" >
                                                                        {
                                                                            JSON.parse(obj?.NameHistory)?.length > 0 ?
                                                                                <>
                                                                                    <h5 className="text-white text-bold bg-green py-1 px-3">Name History Information:</h5>
                                                                                    <table className="table table-bordered" >
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className=''>Name:</th>
                                                                                                <th className=''>Date of Birth</th>
                                                                                                <th className=''>Age</th>
                                                                                                <th className=''>Height</th>
                                                                                                <th className=''>Weight</th>
                                                                                                <th className=''>Hair Color</th>
                                                                                                <th className=''>Eye Color</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className='master-tbody'>
                                                                                            {
                                                                                                JSON.parse(obj?.NameHistory)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                            <td>{item.FullName}</td>
                                                                                                            {/* <td>{getShowingWithOutTime(item.DateofBirth)}</td> */}
                                                                                                            <td>{item.DateofBirth}</td>
                                                                                                            <td>{item['Age From']}</td>
                                                                                                            <td>{item['Height From']}</td>
                                                                                                            <td>{item['Weight From']}</td>
                                                                                                            <td>{item['Hair Color']}</td>
                                                                                                            <td>{item['Eye Color']}</td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div>
                                                                    <div className="col-12">
                                                                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                                    </div>
                                                                    {/* name img */}
                                                                    {/* //--------old------------ */}
                                                                    <div className="table-responsive">
                                                                        <h5 className="text-white text-bold bg-green py-1 px-3">Name Image:</h5>
                                                                        {
                                                                            JSON.parse(obj?.Photo)?.length > 0 ? (
                                                                                <div className="col-12">
                                                                                    <div className="row">
                                                                                        {
                                                                                            JSON.parse(obj?.Photo)?.map((item, index) => {
                                                                                                return (
                                                                                                    <div key={index} className="col-3 mb-1 mt-1 d-flex justify-content-center">
                                                                                                        <img
                                                                                                            src={item.Photo}
                                                                                                            alt={`Property ${index}`}
                                                                                                            className="img-fluid "
                                                                                                            style={{ width: "100%", height: "200px" }}
                                                                                                        />
                                                                                                    </div>
                                                                                                );
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <p>No images available</p>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ))
                                                    }
                                                </>
                                                :
                                                <>
                                                </>
                                        }
                                        {showFooter && (
                                            <footer className="print-footer">
                                                <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                                            </footer>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <>
                        </>
                    :
                    <>
                    </>
            }
            {
                loder && (
                    <div className="loader-overlay">
                        <Loader />
                    </div>
                )
            }
        </>
    )
}
export default NameInformation