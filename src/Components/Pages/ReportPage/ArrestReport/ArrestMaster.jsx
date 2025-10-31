import React, { useContext, useRef } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../Common/Utility';
import { useEffect } from 'react';
import { fetchData, fetchPostData } from '../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { toastifyError } from '../../../Common/AlertMsg';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';
import DOMPurify from 'dompurify';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import Location from '../../../Location/Location';

const ArrestMaster = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { GetDataTimeZone, datezone, setChangesStatus } = useContext(AgencyContext);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const [reportData, setReportData] = useState([]);
    const [verifyArrestMaster, setverifyArrestMaster] = useState(false);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [zipList, setZipList] = useState([]);
    const [multiImage, setMultiImage] = useState([]);
    const [loder, setLoder] = useState(false);
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);
    const [locationStatus, setLocationStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [onSelectLocation, setOnSelectLocation] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [value, setValue] = useState({
        AgencyID: '', ArrestNumber: '', ArrestDtTmTo: '', ArrestDtTm: '', IncidentNumber: '', NameIDNumber: '',
        LastName: '', FirstName: '', MiddleName: '', DateOfBirthFrom: '', DateOfBirthTo: '', DirectionPrefix: '', Street: '',
        DirectionSufix: '', TypeSufix: '', PremiseNo: '', ApartmentNo: '', CommonPlace: '',
        ApartmentType: '', Street_Parse: '', PremiseNo_Parse: '', DirectionPrefix_Parse: '', TypeSuffix_Parse: '',
        DirectionSuffix_Parse: '', IsUsLocation: '', point_of_interest: '', Location: '',
        neighborhood: '', subpremise: '', premise: '', Statefullname: '',
        CountryID: '', Country: '', State: '', City: '', CityID: '', ZipCodeID: '', ZipCode: '', SSN: '',
        IPAddress: '', UserID: LoginPinID, SearchCriteria: '', SearchCriteriaJson: '', FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status: '', ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
    });

    const [searchValue, setSearchValue] = useState({
        ArrestNumber: '', ArrestDtTmTo: '', ArrestDtTm: '', IncidentNumber: '', NameIDNumber: '', LastName: '', FirstName: '', MiddleName: '', DateOfBirthFrom: '', DateOfBirthTo: '', Location: '', SSN: '',

    });

    const [showFields, setShowFields] = useState({
        showArrestNumber: false, showArrestDtTm: false, showArrestDtTmTo: false, showIncidentNumber: false, showNameIDNumber: false, showLastName: false, showFirstName: false, showMiddleName: false, showDateOfBirthFrom: false, showDateOfBirthTo: false, showLocation: false, showSSN: false,
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        setShowFields({
            showArrestNumber: searchValue.ArrestNumber, showArrestDtTm: searchValue.ArrestDtTm, showArrestDtTmTo: searchValue.ArrestDtTmTo, showIncidentNumber: searchValue.IncidentNumber, showNameIDNumber: searchValue.NameIDNumber, showLastName: searchValue.LastName, showFirstName: searchValue.FirstName, showMiddleName: searchValue.MiddleName, showDateOfBirthFrom: searchValue.DateOfBirthFrom, showDateOfBirthTo: searchValue.DateOfBirthTo, showLocation: searchValue.Location, showSSN: searchValue.SSN,
        });
    }, [searchValue]);

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then(res => {
            if (res) {
                setStateList(changeArrayFormat(res, 'state'))
            }
            else setStateList([])
        })
    }

    const getCity = async (stateID) => {
        fetchPostData('State_City_ZipCode/GetData_City', { StateID: stateID }).then((res) => {
            if (res) {
                setCityList(changeArrayFormat(res, 'city'))
            }
            else setCityList(changeArrayFormat(res, 'city'))
        }).catch((error) => {
            console.error('There was an error!', error);
        });
    }

    const getZipCode = async (cityID) => {
        fetchPostData('State_City_ZipCode/GetData_ZipCode', { CityId: cityID }).then((res) => {
            if (res) {
                setZipList(changeArrayFormat(res, 'zip'))
            }
            else setZipList(changeArrayFormat(res, 'zip'))
        }).catch((error) => {
            console.error('There was an error!', error);
        });
    }

    const Handlechange = (e) => {
        if (e.target.name === 'SSN') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({ ...value, [e.target.name]: ele })
            }
            if (e.target.name === 'SSN') {
                return 'true';
            }
            if (e.target.name.length === 11) {
                return 'true'
            }
        }
        // else if (e.target.name === 'IncidentNumber') {
        //     let ele = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        //     if (ele.length === 8) {
        //         const match = ele.match(/^(\d{2})(\d{6})$/);
        //         if (match) {
        //             setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] });
        //         }
        //     } else {
        //         ele = e.target.value.replace(/'/g, '').replace(/[^0-9]/g, '');
        //         setValue({ ...value, [e.target.name]: ele });
        //     }
        // }
        else if (e.target.name === 'ArrestNumber' || e.target.name === 'ArrestNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'ArrestNumber' && setValue({ ...value, ['ArrestNumberTo']: "", [e.target.name]: ele });
            }
        }

        else if (e.target.name === 'NameIDNumber') {
            let ele = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
            if (ele.length <= 11) {
                const alphabet = ele[0]?.toUpperCase() || '';
                const digits = ele.slice(1).replace(/[^0-9]/g, '');
                // console.log(match)
                if (digits.length === 9) {
                    setValue({ ...value, [e.target.name]: alphabet + '-' + digits });
                } else {
                    setValue({ ...value, [e.target.name]: alphabet + digits });
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^a-zA-Z0-9\s]/g, '');
                setValue({ ...value, [e.target.name]: ele })
            }
        }
        else if (e.target.name === 'Location' || e.target.name === 'LastName' || e.target.name === 'FirstName' || e.target.name === 'MiddleName') {
            const inputValue = e.target.value;
            const checkInput = inputValue.replace(/[^a-zA-Z0-9@#$%&*!.,\s]/g, "");
            const finalInput = inputValue.trim() === "" ? checkInput.replace(/\s/g, "") : checkInput;
            setValue({ ...value, [e.target.name]: finalInput });
        }
        else {
            setValue({ ...value, [e.target.name]: e.target.value })
        }
    }

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); getStateList();
            setLoginUserName(localStoreData?.UserName)
            getCity(); getZipCode(); getAgencyImg(localStoreData?.AgencyID); GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("A109", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData])

    function hasValues(obj) {
        for (let key in obj) {
            if (key != 'AgencyID' && key != 'PINID') {
                if (obj[key]) {
                    return true;
                }
            }
        }
        return false;
    }

    const get_ArrestSearchData = async (isPrintReport = false) => {
        setLoder(true);

        if (value?.ArrestDtTm?.trim()?.length > 0 || value?.ArrestDtTmTo?.trim()?.length > 0 || value?.ArrestNumber?.trim()?.length > 0 ||
            value?.NameIDNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 ||
            value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.Location?.trim()?.length > 0 || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0
        ) {
            const {
                Location, SSN, ArrestNumber, ArrestDtTmTo, ArrestDtTm, IncidentNumber, NameIDNumber, LastName, FirstName, MiddleName, DateOfBirthFrom, DirectionPrefix, Street, DirectionSufix, TypeSufix, City, State, ZipCode, ApartmentNo, CommonPlace, ApartmentType, Street_Parse, PremiseNo_Parse, DirectionPrefix_Parse, TypeSuffix_Parse, DirectionSuffix_Parse, ZipCodeID, CityID, IsUsLocation, CountryID, Country, point_of_interest, neighborhood, premise, Statefullname, DateOfBirthTo, Address, PremiseNo, subpremise,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
            } = myStateRef.current;
            const val = {
                'AgencyID': LoginAgencyID, 'Location': Location?.trim(), 'SSN': SSN?.trim(), 'ArrestNumber': ArrestNumber?.trim(), 'ArrestDtTmTo': ArrestDtTmTo, 'ArrestDtTm': ArrestDtTm, 'IncidentNumber': IncidentNumber?.trim(), 'NameIDNumber': NameIDNumber, 'LastName': LastName?.trim(), 'FirstName': FirstName?.trim(), 'MiddleName': MiddleName?.trim(), 'DateOfBirthFrom': DateOfBirthFrom, 'DirectionPrefix': DirectionPrefix, 'Street': Street, 'DirectionSufix': DirectionSufix, 'TypeSufix': TypeSufix, 'City': City, 'State': State, 'ZipCode': ZipCode, 'ApartmentNo': ApartmentNo, 'CommonPlace': CommonPlace, 'ApartmentType': ApartmentType, 'Street_Parse': Street_Parse, 'PremiseNo_Parse': PremiseNo_Parse, 'DirectionPrefix_Parse': DirectionPrefix_Parse, 'TypeSuffix_Parse': TypeSuffix_Parse, 'DirectionSuffix_Parse': DirectionSuffix_Parse, 'ZipCodeID': ZipCodeID, 'CityID': CityID, 'IsUsLocation': IsUsLocation, 'CountryID': CountryID, 'Country': Country, 'point_of_interest': point_of_interest, 'neighborhood': neighborhood, 'premise': premise, 'Statefullname': Statefullname, 'DateOfBirthTo': DateOfBirthTo, 'Address': Address, 'PremiseNo': PremiseNo, 'subpremise': subpremise,
                'IPAddress': IPAddress, 'UserID': LoginPinID, 'SearchCriteria': SearchCriteria, 'SearchCriteriaJson': SearchCriteriaJson,
                'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK
            }
            try {
                const apiUrl = isPrintReport ? 'ArrestReport/PrintArrestReport' : 'ArrestReport/GetData_ArrestReport';
                const res = await fetchPostData(apiUrl, val);
                console.log("🚀 ~ get_ArrestSearchData ~ res:", res)
                if (res.length > 0) {
                    setReportData(res);
                    setMasterReportData(res[0]);
                    setverifyArrestMaster(true)
                    getAgencyImg(LoginAgencyID); setSearchValue(value); setLoder(false);
                    setIsPermissionsLoaded(false);
                } else {
                    setIsPermissionsLoaded(false);

                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setReportData([])
                        setMasterReportData([]); setverifyArrestMaster(false); setLoder(false);
                    }
                }
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                // setverifyReport(false);
                setMasterReportData([]); setLoder(false);
            }
        } else {
            toastifyError("Please Enter Details"); setLoder(false);
        }

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

    useEffect(() => {
        if (masterReportData?.length > 0) {
            setverifyArrestMaster(true);
        } else {
            setverifyArrestMaster(false);
        }
    }, []);

    const resetFields = () => {
        setValue({
            ...value,
            AgencyID: '', ArrestNumber: '', ArrestDtTmTo: '', ArrestDtTm: '', IncidentNumber: '', NameIDNumber: '', Location: '',
            LastName: '', FirstName: '', MiddleName: '', DateOfBirthFrom: '', DateOfBirthTo: '', DirectionPrefix: '', Street: '',
            DirectionSufix: '', TypeSufix: '', City: '', State: '', ZipCode: '', PremiseNo: '', ApartmentNo: '', CommonPlace: '',
            ApartmentType: '', Street_Parse: '', PremiseNo_Parse: '', DirectionPrefix_Parse: '', TypeSuffix_Parse: '',
            DirectionSuffix_Parse: '', ZipCodeID: '', CityID: '', IsUsLocation: '', CountryID: '', Country: '', point_of_interest: '',
            neighborhood: '', subpremise: '', premise: '', Statefullname: ''
        })
        setverifyArrestMaster(false)
        setMasterReportData([]); setShowWatermark('')
    }

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoder(true);
        },
        onAfterPrint: () => {
            setLoder(false);
        }
    });

    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm(); get_ArrestSearchData(true); setShowFooter(false);
        }, 100);
    };

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("A109", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isPermissionsLoaded) {
            get_ArrestSearchData();
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);

    useEffect(() => {
        myStateRef.current = value;
    }, [value])

    function formatRawInput(value) {
        // Remove non-digit characters
        const cleaned = value?.replace(/\D/g, '');

        // MMddyyyy handling
        if (cleaned?.length === 8) {
            const mm = cleaned?.slice(0, 2);
            const dd = cleaned?.slice(2, 4);
            const yyyy = cleaned?.slice(4, 8);
            return `${mm}/${dd}/${yyyy}`;
        }

        return value;
    }

    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset>
                                    <legend>Arrest Master Report</legend>
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
                                    <div className="row">

                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Arrest From Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2">
                                            <DatePicker
                                                id='ArrestDtTm'
                                                name='ArrestDtTm'
                                                dateFormat="MM/dd/yyyy"
                                                isClearable={value?.ArrestDtTm ? true : false}
                                                // selected={ArrestDtTm}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                maxDate={new Date(datezone)}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                selected={value?.ArrestDtTm && new Date(value?.ArrestDtTm)}
                                                // ref={startRef}
                                                // onKeyDown={onKeyDown}
                                                onChange={(date) => { setValue({ ...value, ['ArrestDtTm']: date ? getShowingDateText(date) : null, ['ArrestDtTmTo']: null }) }}
                                                timeInputLabel
                                                placeholderText='Select...'
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Arrest To Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2">
                                            <DatePicker
                                                name='ArrestDtTmTo'
                                                id='ArrestDtTmTo'
                                                onChange={(date) => { setValue({ ...value, ['ArrestDtTmTo']: date ? getShowingDateText(date) : null }) }}
                                                selected={value?.ArrestDtTmTo && new Date(value?.ArrestDtTmTo)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                // ref={startRef1}
                                                // onKeyDown={onKeyDown}
                                                isClearable={value?.ArrestDtTmTo ? true : false}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                maxDate={new Date(datezone)}
                                                placeholderText='Select...'
                                                minDate={new Date(value?.ArrestDtTm)}
                                                disabled={value?.ArrestDtTm ? false : true}
                                                className={!value?.ArrestDtTm && 'readonlyColor'}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Arrest #</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-2">
                                            <input type="text" name='ArrestNumber' id='ArrestNumber' className='' value={value?.ArrestNumber} onChange={Handlechange} />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Incident #</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                            <input type="text" name='IncidentNumber' id='IncidentNumber' className='' value={value?.IncidentNumber} onChange={Handlechange} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Location</label>
                                        </div>
                                        <div className="col-9 col-md-9 col-lg-10 mt-1 text-field">
                                            <Location
                                                {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setChangesStatus, setStatesChangeStatus }}
                                                col='Location'
                                                locationID='crimelocationid'
                                                check={false}
                                                verify={true}
                                                style={{ resize: 'both' }}
                                            />
                                            {/* <input type="text" name='Location' value={value?.Location} id='Location' onChange={Handlechange} className='' /> */}
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Name Information</legend>
                                    <div className="row">
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>MNI</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                            <input type="text" name='NameIDNumber' id='NameIDNumber' maxLength={11} className='' value={value?.NameIDNumber} onChange={Handlechange} />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Last Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-2">
                                            <input type="text" name='LastName' id='LastName' value={value?.LastName}
                                                onChange={Handlechange} />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>First Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                            <input type="text" name='FirstName' id='FirstName' value={value?.FirstName}
                                                onChange={Handlechange} />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Middle Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                            <input type="text" name='MiddleName' id='MiddleName' value={value?.MiddleName} onChange={Handlechange} />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>SSN</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                            <input type="text" name='SSN' id='SSN' maxLength={9} value={value?.SSN} onChange={Handlechange} />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>DOB From</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 ">
                                            <DatePicker
                                                id='DateOfBirthFrom'
                                                name='DateOfBirthFrom'
                                                dateFormat="MM/dd/yyyy"
                                                onChange={(date) => {
                                                    if (date) {
                                                        setValue({ ...value, ['DateOfBirthFrom']: date ? getShowingWithOutTime(date) : "" })
                                                    } else {
                                                        setValue({ ...value, ['DateOfBirthFrom']: null, ['DateOfBirthTo']: null })
                                                    }
                                                }}
                                                isClearable={value.DateOfBirthFrom ? true : false}
                                                selected={value?.DateOfBirthFrom && new Date(value.DateOfBirthFrom)}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                placeholderText={'Select...'}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                maxDate={new Date(datezone)}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>DOB To</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 ">
                                            <DatePicker
                                                id='DateOfBirthTo'
                                                name='DateOfBirthTo'
                                                dateFormat="MM/dd/yyyy"
                                                onChange={(date) => setValue({ ...value, ['DateOfBirthTo']: date ? getShowingWithOutTime(date) : "" })}
                                                isClearable={value.DateOfBirthTo ? true : false}
                                                selected={value?.DateOfBirthTo && new Date(value.DateOfBirthTo)}
                                                placeholderText={'Select...'}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                autoComplete='Off'
                                                maxDate={new Date(datezone)}
                                                minDate={new Date(value.DateOfBirthFrom)}
                                                disabled={value?.DateOfBirthFrom ? false : true}
                                                className={!value?.DateOfBirthFrom && 'readonlyColor'}
                                            />
                                        </div>
                                    </div>

                                </fieldset>
                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 text-right">
                                    {
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                            <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_ArrestSearchData(false); }} >Show Report</button>
                                            : <></> :
                                            <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_ArrestSearchData(false); }} >Show Report</button>
                                    }
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyArrestMaster(false); resetFields(); }}>Clear</button>
                                    <Link to={'/Reports'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                verifyArrestMaster &&
                <>
                    <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Arrest Master Report</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    {/* <i className="fa fa-print" onClick={printForm}></i> */}
                                    <i className="fa fa-print" onClick={handlePrintClick}></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-1" >
                        <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }} >
                            <>
                                <ReportAddress {...{ multiImage, masterReportData }} />
                            </>
                            {showWatermark && (
                                <div className="watermark-print">Confidential</div>
                            )}
                            <div className="col-12">
                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                <h5 className="text-center text-white text-bold bg-green  py-1" >Arrest Master Report</h5>
                            </div>

                            <div className="col-12 bb">
                                <fieldset>
                                    <legend>Search Criteria</legend>
                                    <div className="row">

                                        {/* Arrest Number */}
                                        {showFields.showArrestNumber && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">Arrest Number</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={searchValue.ArrestNumber || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Incident Number */}
                                        {showFields.showIncidentNumber && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">Incident Number</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={searchValue.IncidentNumber || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Arrest Date From */}
                                        {showFields.showArrestDtTm && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">Arrest Date From</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={
                                                            searchValue.ArrestDtTm
                                                                ? getShowingWithOutTime(searchValue.ArrestDtTm)
                                                                : ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Arrest Date To */}
                                        {showFields.showArrestDtTmTo && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">Arrest Date To</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={
                                                            searchValue.ArrestDtTmTo
                                                                ? getShowingWithOutTime(searchValue.ArrestDtTmTo)
                                                                : ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* DOB From */}
                                        {showFields.showDateOfBirthFrom && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">DOB From</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={
                                                            searchValue.DateOfBirthFrom
                                                                ? getShowingWithOutTime(searchValue.DateOfBirthFrom)
                                                                : ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* DOB To */}
                                        {showFields.showDateOfBirthTo && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">DOB To</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={
                                                            searchValue.DateOfBirthTo
                                                                ? getShowingWithOutTime(searchValue.DateOfBirthTo)
                                                                : ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Name ID Number */}
                                        {showFields.showNameIDNumber && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">NameID Number</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={searchValue.NameIDNumber || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Last Name */}
                                        {showFields.showLastName && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">Last Name</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={searchValue.LastName || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* First Name */}
                                        {showFields.showFirstName && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">First Name</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={searchValue.FirstName || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Middle Name */}
                                        {showFields.showMiddleName && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">Middle Name</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-4 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={searchValue.MiddleName || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Location */}
                                        {showFields.showLocation && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">Location</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-10 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={searchValue.Location || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {/* Law Title / SSN */}
                                        {showFields.SSN && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                    <label className="new-label">Law Title</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-10 mt-1">
                                                    <input
                                                        type="text"
                                                        className="readonlyColorArrestMasterr form-control full-width-inputArrestMasterr"
                                                        value={searchValue.SSN || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </fieldset>
                            </div>

                            <div className="container mt-1" style={{ pageBreakAfter: 'always' }}>
                                <div className="col-12">

                                    {
                                        masterReportData?.Charge?.length > 0 ?
                                            <>
                                                {
                                                    masterReportData?.Charge?.map((obj) => (
                                                        <>
                                                            <h5 className=" text-white text-bold bg-green py-1 px-3"> Arrest #:- {obj.ArrestNumber}</h5>

                                                            {/* name */}
                                                            <div className="col-12  ">

                                                                <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                    <h6 className=' text-dark mt-2'>Name Information</h6>

                                                                    <div className="col-12 mb-2 ">

                                                                        <div className="row px-3 ">
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.NameIDnumber}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Name ID#</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-8 col-md-8 col-lg-8 mt-2 pt-1 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly

                                                                                        value={obj?.Arrestee_Name
                                                                                        }
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Name:</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.Suffix}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Suffix</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.DateOfBirth && getShowingWithOutTime(obj?.DateOfBirth)}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>DOB</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.AgeFrom}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Age From</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.AgeTo}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Age To</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.AgeUnit_Decsription}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Age Unit</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-6 col-md-6col-lg-6 mt-2 pt-1  ">
                                                                                <div className=" text-field">
                                                                                    <textarea rows={1} type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.Address} style={{ resize: 'none' }}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Address</label>
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-6 col-md-6 col-lg-6 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.Race_Description}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Race</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.Gender}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Gender</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                        value={obj?.HeightFrom != null || obj?.HeightTo != null
                                                                                            ? `${obj.HeightFrom || ''}-${obj.HeightTo || ''}`.replace(/-$/, '')
                                                                                            : ''}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Height</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-2 col-md-2 col-lg-2 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                        value={obj?.WeightFrom != null || obj?.WeightTo != null
                                                                                            ? `${obj.WeightFrom || ''}-${obj.WeightTo || ''}`.replace(/-$/, '')
                                                                                            : ''}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Weight</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.EyeColor_Description}

                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Eye Color</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.HairColor_Description
                                                                                        }

                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Hair Color</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.Resident_Description}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Resident</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.SSN}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>SSN</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.Ethnicity_Description}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Ethnicity</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.DLNumber}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>DL#</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={JSON.parse(obj?.State)[0]?.IdentificationNumber}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>State#</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        // value={item?.DLNumber}
                                                                                        value={JSON.parse(obj?.Jacket)[0]?.IdentificationNumber}

                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Jacket#</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={JSON.parse(obj?.FBI)[0]?.IdentificationNumber}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>FBI#</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.BirthPlace}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Birth Place</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        value={obj?.BINationality
                                                                                        }
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Nationality</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                <div className="text-field">
                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                        // value={item?.DLNumber}
                                                                                        value={obj?.MaritalStatus_Description}

                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Maritial Status</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div >

                                                            {/* arrest */}
                                                            <div className="col-12  ">
                                                                <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                    <div className="col-12 mb-2">
                                                                        <h6 className=' text-dark mt-2 bb'>Arrest Information</h6>
                                                                        <div className="row px-3" >

                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.ArrestDtTm ? getShowingDateText(obj?.ArrestDtTm) : ''}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Arrest Date/Time</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.Arrestee_Name}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Arrestee</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.Agency_Name}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Arrest Agency</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.ArrestType_Description}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Arrest Type</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.IncidentNumber}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Incident Number</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly

                                                                                        value={obj?.ReportedDate ? getShowingDateText(obj?.ReportedDate) : ''}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Reported Date/Time</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.Supervisor_Name}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Supervisor</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-9 col-md-9 col-lg-9 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.Address}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Incident Location</label>
                                                                                </div>
                                                                            </div>

                                                                            {/* new Add column */}
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.ParentName}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Parent Name</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.ParentPhone}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Parent Phone</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.ResponseDescription}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Response </label>
                                                                                </div>
                                                                            </div>


                                                                            {/* school */}
                                                                            <div className="col-3 col-md-3 col-lg-3 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.NameOfSchool}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Name of School</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-9 col-md-9 col-lg-9 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.LocationOfSchool}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Location of School</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-4 mt-4">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.PoliceForce_Description}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Use Of Force </label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-3">
                                                                                <div className='' style={{ marginTop: '40px' }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        name=""
                                                                                        id=""
                                                                                        checked={obj && obj.IsSchoolNotified ? obj.IsSchoolNotified : false}
                                                                                        disabled={!obj || obj.IsSchoolNotified === null}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary pl-2'>School Notified</label>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Rights-info */}
                                                            <div className="col-12  ">
                                                                <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                    <h6 className=' text-dark mt-2 bb'>Rights Information</h6>
                                                                    <div className="col-12 ">
                                                                        <div className="row bb px-3 mb-2">
                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.RightsGiven}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Rights Given</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.GivenBy_Name}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Given By</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.PrimaryOfficer_Name}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Primary Officer</label>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Juvenile Disposition-info */}
                                                            <div className="col-12  ">
                                                                <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                    <h6 className=' text-dark mt-2 bb'>Juvenile Disposition</h6>
                                                                    <div className="col-12 ">
                                                                        <div className="row bb px-3 mb-2">
                                                                            <div className="col-8 col-md-8 col-lg-10 mt-2">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.JuvenileDisposition_Desc}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Disposition</label>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-2 mt-2">
                                                                                <div className='text-field'>
                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                        value={obj?.PhoneNo}
                                                                                    />
                                                                                    <label htmlFor="" className='new-summary'>Phone No.</label>
                                                                                </div>
                                                                            </div>


                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Alias Name Information */}
                                                            <div className="col-12" >
                                                                {
                                                                    JSON.parse(obj?.NameAliases)?.length > 0 ? (
                                                                        <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                            <h6 className='text-dark mt-2'>Alias Name Information:</h6>
                                                                            <div className="col-12">
                                                                                <table className="table table-bordered">
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className=''>Alias Name</th>
                                                                                            <th className=''>Alias DOB</th>
                                                                                            <th className=''>Alias SSN</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className='master-tbody'>
                                                                                        {
                                                                                            JSON.parse(obj?.NameAliases)?.map((item, key) => (
                                                                                                <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                    <td>{item.LastName}</td>
                                                                                                    <td>{item.DOB ? getShowingDateText(item.DOB) : ''}</td>
                                                                                                    <td>{item.AliasSSN}</td>
                                                                                                </tr>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                                }
                                                            </div>
                                                            {/* Warrant Information */}
                                                            <div className="col-12" >
                                                                {
                                                                    JSON.parse(obj?.NameWarrant)?.length > 0 ? (
                                                                        <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                            <h6 className='text-dark mt-2'>Warrant Information:</h6>
                                                                            <div className="col-12">
                                                                                <table className="table table-bordered">
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className=''>Warrant Number</th>
                                                                                            <th className=''>DateTimeIssued</th>
                                                                                            <th className=''>Assigned Officer</th>
                                                                                            <th className=''>WarrantStatus</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className='master-tbody'>
                                                                                        {
                                                                                            JSON.parse(obj?.NameWarrant)?.map((item, key) => (
                                                                                                <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                    <td>{item.WarrantNumber}</td>
                                                                                                    <td>{item.DateTimeIssued ? getShowingDateText(item.DateTimeIssued) : ''}</td>
                                                                                                    <td>{item.AssignedOfficer}</td>
                                                                                                    <td>{item.WarrantStatus}</td>
                                                                                                </tr>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                                }
                                                            </div>
                                                            <div className="col-12" >
                                                                {
                                                                    JSON.parse(obj?.FingerPrints)?.length > 0 ? (
                                                                        <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                            <h6 className='text-dark mt-2'>FingerPrint Information:</h6>
                                                                            <div className="col-12">
                                                                                <table className="table table-bordered">
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className=''>TRN</th>
                                                                                            <th className=''>FingerPrintDtTm</th>
                                                                                            <th className=''>PrintedBy</th>

                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className='master-tbody'>
                                                                                        {
                                                                                            JSON.parse(obj?.FingerPrints)?.map((item, key) => (
                                                                                                <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                    <td>{item.TRN}</td>
                                                                                                    <td>{item.FingerPrintDtTm ? getShowingDateText(item.DateTimeIssued) : ''}</td>
                                                                                                    <td>{item.PrintedBy}</td>

                                                                                                </tr>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                                }
                                                            </div>
                                                            <div className="col-12" >
                                                                {
                                                                    JSON.parse(obj?.Mugshot)?.length > 0 ? (
                                                                        <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                            <h6 className='text-dark mt-2'>MugShot Information:</h6>
                                                                            <div className="col-12">
                                                                                <table className="table table-bordered">
                                                                                    <thead className="text-dark master-table">
                                                                                        <tr>
                                                                                            <th>EyeColor</th>
                                                                                            <th>HairColor</th>
                                                                                            <th>Height</th>
                                                                                            <th>Weight</th>
                                                                                            <th>BodyBuildType</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className="master-tbody">
                                                                                        {JSON.parse(obj?.Mugshot)?.map((item, key) => (
                                                                                            <React.Fragment key={key}>
                                                                                                {/* Data Row */}
                                                                                                <tr style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                    <td>{item.EyeColor}</td>
                                                                                                    <td>{item.HairColor}</td>
                                                                                                    <td>{item.Height}</td>
                                                                                                    <td>{item.Weight}</td>
                                                                                                    <td>{item.BodyBuildType}</td>
                                                                                                </tr>

                                                                                                {/* Image Row */}
                                                                                                <tr>
                                                                                                    <td colSpan="5">
                                                                                                        <div
                                                                                                            className="d-flex align-items-center flex-wrap"
                                                                                                            style={{
                                                                                                                width: '100%',
                                                                                                                gap: '20px',
                                                                                                                flexDirection: 'row',
                                                                                                            }}
                                                                                                        >
                                                                                                            {item.FrontImage && (
                                                                                                                <img
                                                                                                                    src={item.FrontImage}
                                                                                                                    alt="Front Mugshot"
                                                                                                                    className="img-fluid"
                                                                                                                    style={{
                                                                                                                        width: '200px',
                                                                                                                        height: 'auto',
                                                                                                                        objectFit: 'contain',
                                                                                                                        borderRadius: '5px',
                                                                                                                    }}
                                                                                                                />
                                                                                                            )}
                                                                                                            {item.LeftImage && (
                                                                                                                <img
                                                                                                                    src={item.LeftImage}
                                                                                                                    alt="Left Mugshot"
                                                                                                                    className="img-fluid"
                                                                                                                    style={{
                                                                                                                        width: '200px',
                                                                                                                        height: 'auto',
                                                                                                                        objectFit: 'contain',
                                                                                                                        borderRadius: '5px',
                                                                                                                    }}
                                                                                                                />
                                                                                                            )}
                                                                                                            {item.RightImage && (
                                                                                                                <img
                                                                                                                    src={item.RightImage}
                                                                                                                    alt="Right Mugshot"
                                                                                                                    className="img-fluid"
                                                                                                                    style={{
                                                                                                                        width: '200px',
                                                                                                                        height: 'auto',
                                                                                                                        objectFit: 'contain',
                                                                                                                        borderRadius: '5px',
                                                                                                                    }}
                                                                                                                />
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </React.Fragment>
                                                                                        ))}
                                                                                    </tbody>
                                                                                </table>

                                                                               
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                        :
                                                                        null
                                                                }
                                                            </div>

                                                            {/* court */}
                                                            < div className="col-12  " >
                                                                {

                                                                    JSON.parse(obj?.ArrestCourtInformation)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                <h6 className=' text-dark mt-2'>Court Information</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.ArrestCourtInformation)?.map((item, key) => (
                                                                                            <div className="row  px-3 bb mb-2" >
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Name}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Name</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.DocketID}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Docket ID</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.CourtName}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Court Name</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.StateName}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Court State</label>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.CityName}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Court City</label>
                                                                                                    </div>
                                                                                                </div>


                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.JudgeName}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Judge Name</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.PleaDescription}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Plea </label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item?.PleaDateTime ? getShowingDateText(item?.PleaDateTime) : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Plea Date/Time</label>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item?.Prosecutor}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Prosecutor</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4  mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item?.Attorney}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Attorney</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item?.AppearDateTime ? getShowingDateText(item?.AppearDateTime) : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Appear Date/Time</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.CourtAppearDescription}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Court Appear Reason</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                                    <div className=''>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name=""
                                                                                                            id=""
                                                                                                            checked={item && Object.keys(item).length > 0 ? item.IsRescheduled : false}
                                                                                                            disabled={!item || Object.keys(item).length === 0}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary pl-2'>Rescheduled</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                                    <div className=''>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name=""
                                                                                                            id=""
                                                                                                            checked={item && Object.keys(item).length > 0 ? item.IsContinued : false}
                                                                                                            disabled={!item || Object.keys(item).length === 0}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary pl-2'>Continued</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                                    <div className=''>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name=""
                                                                                                            id=""
                                                                                                            checked={item && Object.keys(item).length > 0 ? item.IsAppearRequired : false}
                                                                                                            disabled={!item || Object.keys(item).length === 0}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary pl-2'>Appear Required</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                                    <div className=''>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name=""
                                                                                                            id=""
                                                                                                            checked={item && Object.keys(item).length > 0 ? item.IsDismissed : false}
                                                                                                            disabled={!item || Object.keys(item).length === 0}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary pl-2'>Dismissed</label>

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
                                                            </div>

                                                            {/* Property Information */}
                                                            <div className="col-12" >
                                                                <div className="table-responsive">
                                                                    {
                                                                        JSON.parse(obj?.ArrestProperty)?.length > 0 ? (
                                                                            <>
                                                                                <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                    <h5 className='text-dark mt-2'>Property Information:</h5>

                                                                                    <table className="table table-bordered">
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className=''>Property Number</th>
                                                                                                <th className=''>Type</th>
                                                                                                <th className=''>Classification</th>
                                                                                                <th className=''>Value</th>
                                                                                                <th className=''>Reason</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className='master-tbody'>
                                                                                            {
                                                                                                JSON.parse(obj?.ArrestProperty)?.map((item, key) => (
                                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                        <td>{item.PropertyNumber}</td>
                                                                                                        <td>{item.PropertyType_Description}</td>
                                                                                                        <td>{item.Classification_Desc}</td>
                                                                                                        <td>{item.Value}</td>
                                                                                                        <td>{item.PropertyLossCode_Description}</td>
                                                                                                    </tr>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <></>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>

                                                            {/* ------------------------VEHICLE --------------------*/}
                                                            <div className="col-12" >

                                                                < div className="table-responsive" >
                                                                    {
                                                                        JSON.parse(obj?.ArrestVehicle)?.length > 0 ? (
                                                                            <>
                                                                                <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                    <h5 className=' text-dark mt-2' >Vehicle Information:</h5>
                                                                                    <table className="table table-bordered">
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className=''>Vehicle Number</th>
                                                                                                <th className=''>Category</th>
                                                                                                <th className=''>Classification</th>
                                                                                                <th className=''>Value</th>
                                                                                                <th className=''>Reason</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className='master-tbody'>
                                                                                            {
                                                                                                JSON.parse(obj?.ArrestVehicle)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                            <td>{item.PropertyNumber}</td>
                                                                                                            <td>{item.Category_Description}</td>
                                                                                                            <td>{item.Classification_Description}</td>
                                                                                                            <td>{item.Value}</td>
                                                                                                            <td>{item.PropertyLossCode_Description}</td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <></>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>

                                                            {/* ArrestCriminalActivity */}
                                                            {/* < div className="col-12  " >
                                                                {
                                                                    JSON.parse(obj?.ArrestCriminalActivity)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                <h6 className=' text-dark mt-2'>Criminal Activity</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.ArrestCriminalActivity)?.map((item, key) => (
                                                                                            <div className="row  px-3 bb mb-2" >
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.CriminalActivity_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Criminal Activity</label>
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
                                                            </div> */}

                                                            {/* naartive */}
                                                            <div className="col-12  " >
                                                                {
                                                                    JSON.parse(obj?.ArrestNarrative)?.length > 0 ?
                                                                        <>
                                                                            {
                                                                                JSON.parse(obj?.ArrestNarrative)?.map((item, key) => (
                                                                                    <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                        <div className="col-12">
                                                                                            <h6 className=' text-dark mt-2'>Narratives</h6>
                                                                                            <div className="row  mb-2 px-3" >
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.ReportedBy_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Reported By</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Narrative_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Narrative Type/Report Type</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.NarrativeDtTm ? getShowingDateText(obj.NarrativeDtTm) : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Date/Time</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                    <div>
                                                                                                        <label htmlFor="" className='new-summary'>Narrative</label>
                                                                                                        <div
                                                                                                            className="readonlyColor text-justify"
                                                                                                            style={{
                                                                                                                border: '1px solid #ccc',
                                                                                                                borderRadius: '4px',
                                                                                                                padding: '10px',
                                                                                                                minHeight: '100px',
                                                                                                                backgroundColor: '#f9f9f9', // Light background for readability
                                                                                                                overflowY: 'auto', // Allows scrolling if content overflows
                                                                                                            }}
                                                                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.CommentsDoc) }}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    JSON.parse(obj?.Smt)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                <h6 className='text-dark mt-2'>SMT Info:</h6>
                                                                                <div className="col-12">
                                                                                    {
                                                                                        JSON.parse(obj?.Smt)?.map((item, key) => (
                                                                                            <div key={key} className="row bb mb-2">
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className='readonlyColor'
                                                                                                            name='DocFileName'
                                                                                                            required
                                                                                                            readOnly
                                                                                                            value={item.SMTType_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>SMT Type</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className='readonlyColor'
                                                                                                            name='DocFileName'
                                                                                                            required
                                                                                                            readOnly
                                                                                                            value={item.SMTLocation_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>SMT Location</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            className='readonlyColor'
                                                                                                            name='DocFileName'
                                                                                                            required
                                                                                                            readOnly
                                                                                                            value={item.SMT_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Description</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12">
                                                                                                    <div className="row mt-1">
                                                                                                        {
                                                                                                            JSON.parse(item.SMTPhoto)?.map((photo, index) => (
                                                                                                                <div key={index} className="col-3 mb-3">
                                                                                                                    <img
                                                                                                                        src={photo.Path}
                                                                                                                        className=''
                                                                                                                        alt={`Image ${index}`}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            ))
                                                                                                        }
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
                                                                {
                                                                    JSON.parse(obj?.ArrestPhoto)?.length > 0 ? (
                                                                        <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                            <h6 className='text-dark mt-2'>Mug Shot Images:</h6>
                                                                            <div className="col-12 mb-2">
                                                                                <div className="row">
                                                                                    {obj.ArrestPhoto ? (
                                                                                        JSON.parse(obj.ArrestPhoto).map((Photo, index) => (
                                                                                            <div key={index} className="col-3 mb-3 d-flex justify-content-center">
                                                                                                <img
                                                                                                    src={Photo.Photo}
                                                                                                    alt={`Mug shot ${index + 1}`}
                                                                                                    className="img-fluid"
                                                                                                    style={{
                                                                                                        width: "100%",
                                                                                                        height: "200px",
                                                                                                        padding: "5px"
                                                                                                    }}
                                                                                                />
                                                                                            </div>
                                                                                        ))
                                                                                    ) : null}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                                }
                                                            </div>

                                                            {/* juvenile  */}
                                                            <div className="col-12  " >
                                                                {

                                                                    JSON.parse(obj?.ArrestJuvenile)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                <h6 className=' text-dark mt-2'>Juvenile Information</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.ArrestJuvenile)?.map((item, key) => (
                                                                                            <div className="row  px-3 bb mb-2" >
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.ParentName}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Parent/Guardian</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item?.ParentContactDtTm ? getShowingDateText(item?.ParentContactDtTm) : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'> Parent Contacted Date</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.ContactBy}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Contacted By</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <textarea rows={1} type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.ParentAddress} style={{ resize: 'none' }}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Parent Address</label>
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
                                                            </div>

                                                            {/* police */}
                                                            <div className="col-12  " >
                                                                {
                                                                    // JSON.parse(obj?.ArrestPoliceForce)?.map((item, key) => (
                                                                    JSON.parse(obj?.Charge)?.length > 0 && JSON.parse(obj?.ArrestPoliceForce)?.length > 0 ? (
                                                                        <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                            <h6 className=' text-dark mt-2'>Police Force:</h6>
                                                                            <div className="col-12 ">
                                                                                <table className="table table-bordered">
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className=''>Officer Name</th>
                                                                                            <th className=''>Description</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className='master-tbody'>
                                                                                        {
                                                                                            JSON.parse(obj?.ArrestPoliceForce)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                        <td>{item.Officer_Name}</td>
                                                                                                        <td>{item.ArrPoliceForce_Description}</td>

                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>

                                                                            </div>
                                                                        </div>
                                                                    ) : null
                                                                }
                                                            </div>

                                                            {/* charge */}
                                                            <div className="col-12  ">
                                                                {

                                                                    JSON.parse(obj?.Charge)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                <h6 className=' text-dark mt-2'>Charge Information</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.Charge)?.map((item, key) => (
                                                                                            <div className="row  px-3 bb mb-2" >
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Name}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Name</label>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.IncidentNumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Incident #</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.ArrestNumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Arrest #</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.NIBRS_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>TIBRS Code</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.ChargeCode_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Offense Code/Nmae</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.UCRClear_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>UCR Clear</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Count}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Count</label>
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
                                                            </div>

                                                            {/* Penalties-info */}
                                                            {/* <div className="col-12  ">
                                                                {
                                                                    JSON.parse(obj?.Charge)?.length > 0 ?
                                                                        <>
                                                                            <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                                <h6 className=' text-dark mt-2 bb'>Penalties</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.Charge)?.map((item, key) => (
                                                                                            <div className="row bb px-3 mb-2">
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Fine}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Fine</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.CourtCost}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Court Cost</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.OtherCost}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Other Cost</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.FTADate ? getShowingWithOutTime(item.FTADate) : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>FTA Date</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.FTAAmount}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>FTA Amount</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.LitigationTax}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Litigation Tax</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.TotalPenalty}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Total Penalty</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Years}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Years</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Months}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Months</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Days}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Days</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                    <div>
                                                                                                        <label htmlFor="" className='new-summary'>Comments</label>
                                                                                                        <div
                                                                                                            className="readonlyColor text-justify"
                                                                                                            style={{
                                                                                                                border: '1px solid #ccc',
                                                                                                                borderRadius: '4px',
                                                                                                                padding: '10px',
                                                                                                                minHeight: '100px',
                                                                                                                backgroundColor: '#f9f9f9',
                                                                                                                overflowY: 'auto',
                                                                                                            }}
                                                                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.Comments) }}
                                                                                                        />
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
                                                            </div> */}

                                                            {/* ChargeCourtDisposition  */}
                                                            <div className="col-12  " >
                                                                {

                                                                    JSON.parse(obj?.ChargeCourtDisposition)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                <h6 className=' text-dark mt-2'>Court Disposition Information</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.ChargeCourtDisposition)?.map((item, key) => (
                                                                                            <div className="row  px-3 bb mb-2" >
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item?.DispositionDtTm ? getShowingDateText(obj?.DispositionDtTm) : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Disposition Date/Time</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-8 col-md-8 col-lg-8 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item?.ExceptionalClearance}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Exceptional Clearance</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.CourtDispostion}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Court Disposition</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2">

                                                                                                    <div>
                                                                                                        <label htmlFor="" className='new-summary'>Comments</label>
                                                                                                        <div
                                                                                                            className="readonlyColor text-justify"
                                                                                                            style={{
                                                                                                                border: '1px solid #ccc',
                                                                                                                borderRadius: '4px',
                                                                                                                padding: '10px',
                                                                                                                minHeight: '100px',
                                                                                                                backgroundColor: '#f9f9f9',
                                                                                                                overflowY: 'auto',
                                                                                                            }}
                                                                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Comments) }}
                                                                                                        />
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
                                                            </div>

                                                            {/* ChargeComment  */}
                                                            < div className="col-12  " >
                                                                {

                                                                    JSON.parse(obj?.ArrestChargeComments)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                <h6 className=' text-dark mt-2'>Comment Information</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.ArrestChargeComments)?.map((item, key) => (
                                                                                            <div className="row  px-3 bb mb-2" >
                                                                                                <div className="col-12 col-md-6 col-lg-6 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Officer_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Reported By</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                    <div>
                                                                                                        <label htmlFor="" className='new-summary'>Notes</label>
                                                                                                        <div
                                                                                                            className="readonlyColor text-justify"
                                                                                                            style={{
                                                                                                                border: '1px solid #ccc',
                                                                                                                borderRadius: '4px',
                                                                                                                padding: '10px',
                                                                                                                minHeight: '100px',
                                                                                                                backgroundColor: '#f9f9f9', // Light background for readability
                                                                                                                overflowY: 'auto', // Allows scrolling if content overflows
                                                                                                            }}
                                                                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.CommentsDoc) }}
                                                                                                        />
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
                                                            </div>

                                                            {/* ChargeWeapon  */}
                                                            < div className="col-12  " >
                                                                {

                                                                    JSON.parse(obj?.ChargeWeapon)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                <h6 className=' text-dark mt-2'>Weapon Information</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.ChargeWeapon)?.map((item, key) => (
                                                                                            <div className="row  px-3 bb mb-2" >
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Weapon_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Weapon</label>
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
                                                            </div>

                                                            {/* ChargeOffense  */}
                                                            < div className="col-12  " >
                                                                {

                                                                    JSON.parse(obj?.ChargeOffense)?.length > 0 ?
                                                                        <>
                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                <h6 className=' text-dark mt-2'>Offense Information</h6>
                                                                                <div className="col-12 ">
                                                                                    {
                                                                                        JSON.parse(obj?.ChargeOffense)?.map((item, key) => (
                                                                                            <div className="row  px-3 bb mb-2" >
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={item.Offense_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Offense</label>
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
                                                            </div>

                                                        </>
                                                    ))
                                                }
                                            </>
                                            :
                                            <>
                                            </>
                                    }
                                </div>
                            </div>
                            {showFooter && (
                                <div className="print-footer">
                                    <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                                </div>
                            )}
                        </div>

                    </div >
                </>
            }
            {loder && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )}
        </>
    )
}

export default ArrestMaster

export const changeArrayFormat = (data, type) => {
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        );
        return result
    }
}
