import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import img from '../../../../../src/img/images1.jpg'
import Select from "react-select";
import { Decrypt_Id_Name, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear, getShowingWithFixedTime01, getShowingWithOutTime, getYearWithOutDateTime } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import { fetchPostData } from '../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';
import { Comman_changeArrayFormat, threeColArray } from '../../../Common/ChangeArrayFormat';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { toastifyError } from '../../../Common/AlertMsg';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data, get_VehicleLossCode_Drp_Data } from '../../../../redux/actions/DropDownsData';
import Location from '../../../Location/Location';
import TreeModalReport from './TreeModalReport';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';
import DOMPurify from 'dompurify';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';

const VehicleMasterReport = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const propertyLossCodeData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const [dispositionsDrpData, setDispositionsDrpData] = useState([]);

    const { GetDataTimeZone, datezone, } = useContext(AgencyContext);

    const [verifyReport, setverifyReport] = useState(false);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [locationStatus, setLocationStatus] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [proRoom, setProRoom] = useState('PropertyRoom');
    const [locationPath, setLocationPath] = useState();
    const [searchStoragepath, setSearchStoragePath] = useState();
    const [loder, setLoder] = useState(false);
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);

    const [value, setValue] = useState({
        'ReportedDate': null, 'ReportedDateTo': null, 'CategoryID': null, 'VehicleNumber': '', 'VehicleNumberTo': '', 'LossCodeID': null, 'Value': '',
        'ValueTo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'AgencyID': '', 'StorageLocationID': null,
        'ActivityType': '', 'ActivityTypeID': '', 'ReceiveDate': null, 'ReceiveDateTo': null, 'InvestigatorID': null, 'location': '', 'DispositionID': null, 'RecoveredDateTime': null, 'RecoveredDateTimeTo': null, 'PropertyTypeID': null,
        'IPAddress': '', 'UserID': '', 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,

    });

    const [searchValue, setSearchValue] = useState({
        ReportedDate: '', ReportedDateTo: '', CategoryID: null, VehicleNumber: '', VehicleNumberTo: '', LossCodeID: null, Value: '', ValueTo: '', LastName: '', FirstName: '', MiddleName: '', ReceiveDate: '', ReceiveDateTo: '',
        ActivityType: '', ActivityTypeID: null, InvestigatorID: null, StorageLocationID: null, DispositionID: null, PropertyTypeID: null, RecoveredDateTime: '', RecoveredDateTimeTo: '',
    });

    const [showFields, setShowFields] = useState({
        showReportedDate: false, showReportedDateTo: false, showCategoryID: false, showVehicleNumber: false, showVehicleNumberTo: false, showLossCodeID: false, showValue: false, showValueTo: false, showLastName: false, showFirstName: false, showMiddleName: false, showReceiveDate: false, showReceiveDateTo: false,
        showActivityType: false, showActivityTypeID: false, showInvestigatorID: false, showStorageLocationID: false, showDispositionID: false, showRecoveredDateTime: false, showRecoveredDateTimeTo: false, showPropertyTypeID: false,
    });

    useEffect(() => {
        setShowFields({
            showReportedDate: searchValue.ReportedDate, showReportedDateTo: searchValue.ReportedDateTo, showCategoryID: searchValue.CategoryID !== null, showVehicleNumber: searchValue.VehicleNumber, showVehicleNumberTo: searchValue.VehicleNumberTo, showLossCodeID: searchValue.LossCodeID !== null, showValue: searchValue.Value, showValueTo: searchValue.ValueTo, showLastName: searchValue.LastName, showFirstName: searchValue.FirstName, showMiddleName: searchValue.MiddleName, showReceiveDate: searchValue.ReceiveDate, showReceiveDateTo: searchValue.ReceiveDateTo, showActivityTypeID: searchValue.ActivityTypeID !== null, showInvestigatorID: searchValue.InvestigatorID !== null, showStorageLocationID: searchValue.StorageLocationID !== null, showDispositionID: searchValue.DispositionID !== null, showRecoveredDateTime: searchValue.RecoveredDateTime, showRecoveredDateTimeTo: searchValue.RecoveredDateTimeTo, showPropertyTypeID: searchValue.PropertyTypeID !== null,
        });
    }, [searchValue]);

    const AddTransfer = [
        { value: 1, label: 'CheckIn' }, { value: 2, label: 'CheckOut' }, { value: 3, label: 'Release' }, { value: 4, label: 'Destroy' },
    ]

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); GetDataTimeZone(localStoreData?.AgencyID); setLoginUserName(localStoreData?.UserName)
            dispatch(get_ScreenPermissions_Data("V108", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (LoginAgencyID) {
            dispatch(get_AgencyOfficer_Data(LoginAgencyID, ''))
            if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(LoginAgencyID)) };
            PropertyType(LoginAgencyID); get_Dispositions(LoginAgencyID);
        }
    }, [LoginAgencyID]);

    useEffect(() => {
        if (masterReportData?.length > 0) {
            setverifyReport(true);
        }
    }, [masterReportData]);

    const PropertyType = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((data) => {
            if (data) {
                const res = data?.filter((val) => {
                    if (val.PropertyCategoryCode === "V") return val
                })
                if (res.length > 0) {
                    get_CategoryId_Drp(res[0]?.PropertyCategoryID)
                }
            }
        })
    }

    const get_CategoryId_Drp = (CategoryID) => {
        const val = { CategoryID: CategoryID }
        fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
            if (data) {
                setCategoryIdDrp(threeColArray(data, 'PropertyDescID', 'Description', 'CategoryID'))
            } else {
                setCategoryIdDrp([]);
            }
        })
    }

    // console.log(value, 'value') 

    const get_PropertyReport = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0 || value?.Value?.trim()?.length > 0 || value?.ValueTo?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.VehicleNumber?.trim()?.length > 0 || value?.VehicleNumberTo?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || (value?.LossCodeID !== null && value?.LossCodeID != '') || (value?.CategoryID !== null && value?.CategoryID !== '') || (value?.InvestigatorID !== null && value?.InvestigatorID !== '') || value.ActivityType?.trim()?.length > 0 || (value.StorageLocationID !== null && value.StorageLocationID !== '') || value.ReceiveDate?.trim()?.length > 0
            || (value?.DispositionID !== null && value?.DispositionID !== '') || value?.RecoveredDateTime?.trim()?.length > 0 || value?.RecoveredDateTimeTo?.trim()?.length > 0) {
            const {
                ReportedDate, ReportedDateTo, CategoryID, VehicleNumber, VehicleNumberTo, LossCodeID, Value, ValueTo, LastName, FirstName, MiddleName, StorageLocationID, ActivityType, ReceiveDate, ReceiveDateTo, InvestigatorID, DispositionID, RecoveredDateTime, RecoveredDateTimeTo, PropertyTypeID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
            } = myStateRef.current;
            const val = {
                'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'CategoryID': CategoryID, 'VehicleNumber': VehicleNumber, 'VehicleNumberTo': VehicleNumberTo, 'LossCodeID': LossCodeID,
                'ValueTo': parseFloat(ValueTo) === 0 || parseFloat(ValueTo) < 0 ? '0.00' : parseFloat(ValueTo), 'Value': parseFloat(Value) === 0 || parseFloat(Value) < 0 ? '0.00' : parseFloat(Value),
                'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'AgencyID': LoginAgencyID, 'StorageLocationID': StorageLocationID, 'ActivityType': ActivityType, 'ReceiveDate': ReceiveDate, 'ReceiveDateTo': ReceiveDateTo, 'InvestigatorID': InvestigatorID,
                'PropertyTypeID': PropertyTypeID, 'DispositionID': DispositionID, 'RecoveredDateTime': RecoveredDateTime, 'RecoveredDateTimeTo': RecoveredDateTimeTo, 'IPAddress': IPAddress, 'UserID': UserID, 'SearchCriteria': SearchCriteria, 'SearchCriteriaJson': SearchCriteriaJson,
                'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK
            }
            try {
                const apiUrl = isPrintReport ? 'PropertyVehicle/PrintPropertyVehicleReport' : 'ReportVehicle/GetData_MasterReportVehicle';
                const res = await fetchPostData(apiUrl, val);

                if (res.length > 0) {
                    getAgencyImg(LoginAgencyID); setSearchValue(value); setMasterReportData(res[0]); setverifyReport(true); setLoder(false);
                    setIsPermissionsLoaded(false)
                } else {
                    setIsPermissionsLoaded(false)

                    if (!isPrintReport) {

                        toastifyError("Data Not Available"); setMasterReportData(res[0]); setverifyReport(false); setLoder(false);
                    }

                }
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setverifyReport(false); setMasterReportData([]); setLoder(false);
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

    const ChangeDropDown = (e, name) => {
        if (e) { setValue({ ...value, [name]: e.value }) }
        else { setValue({ ...value, [name]: null }) }
    }

    const ChangeDropDown1 = (e, name) => {
        if (e) {
            if (name === 'PropertyTypeID') { setValue({ ...value, [name]: e.value }); }
            else if (name === 'ActivityTypeID') { setValue({ ...value, [name]: e.value, ['ActivityType']: e.label }); }
            else { setValue({ ...value, [name]: e.value }) }
        }
        else {
            if (name === 'PropertyTypeID') { setValue({ ...value, [name]: null, ['LossCodeID']: null }) }
            else if (name === 'ActivityTypeID') { setValue({ ...value, [name]: '', ['ActivityType']: '' }); }
            else { setValue({ ...value, [name]: null }) }
        }
    }

    //-----------old-------------------

    const handlChange = (e) => {
        // const { name, value } = e.target;
        // let ele = value.replace(/[^a-zA-Z0-9]/g, '');
        // if (name === 'VehicleNumber' || name === 'VehicleNumberTo') {
        //     if (ele[0]?.match(/[a-zA-Z]/)) {
        //         let subs = ele.toUpperCase().substring(0, 2);
        //         let subs2 = ele.replace(/[^0-9]/g, '');
        //         if (ele.length <= 2) {
        //             const alphabet = ele.toUpperCase() || '';
        //             setValue((prevValue) => ({ ...prevValue, [name]: alphabet }));
        //         } else if (ele.length <= 6) {
        //             setValue((prevValue) => ({ ...prevValue, [name]: `${subs}-${subs2}` }));
        //         } else if (ele.length >= 15) {
        //             e.preventDefault();
        //         } else {
        //             let subs3 = ele.substring(2, 6).replace(/[^0-9]/g, '');
        //             let subs4 = ele.substring(6, 10).replace(/[^0-9]/g, '');
        //             setValue((prevValue) => ({ ...prevValue, [name]: `${subs}-${subs3}-${subs4}` }));
        //         }
        //     } else if (ele[0]?.match(/[0-9]/)) {
        //         const digits = ele.replace(/[^0-9]/g, '');
        //         if (ele.length <= 4) {
        //             setValue((prevValue) => ({ ...prevValue, [name]: digits }));
        //         } else if (ele.length >= 10) {
        //             e.preventDefault();
        //         } else {
        //             let subs = ele.substring(0, 4);
        //             let subs2 = ele.substring(4).replace(/[^0-9]/g, '');
        //             setValue((prevValue) => ({ ...prevValue, [name]: `${subs}-${subs2}` }));
        //         }
        //     } else {
        //         setValue((prevValue) => ({ ...prevValue, [name]: '' }));
        //         if (ele.length === 0 && name === 'VehicleNumber') {
        //             setValue((prevValue) => ({ ...prevValue, VehicleNumberTo: "", [name]: ele }));
        //         }
        //     }
        // }
        // else {
        //     setValue((prevValue) => ({ ...prevValue, [name]: value }));
        // }


        if (e.target.name === 'VehicleNumber' || e.target.name === 'VehicleNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'VehicleNumber' && setValue({
                    ...value, ['VehicleNumberTo']: "", [e.target.name]: ele
                });
            }
        }
        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    };


    const Valuehandle = (e) => {
        if (e.target.name === 'Value' || e.target.name === 'ValueTo') {
            let ele = e.target.value.replace(/[^0-9\.]/g, "").replace(/\s/g, "");
            if (ele.startsWith('.')) {
                return;
            }
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g);
                        if (!checkDot) {
                            setValue({
                                ...value,
                                [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2)
                            });
                            return;
                        } else {
                            return;
                        }
                    } else {
                        setValue({ ...value, [e.target.name]: ele });
                    }
                }
            }
            else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\.]/g, "");
                setValue({ ...value, [e.target.name]: ele });
                if (ele?.length == 0) { e.target.name == 'Value' && setValue({ ...value, ['ValueTo']: "", [e.target.name]: ele }) }
            }
        }
        else {
            setValue({ ...value, [e.target.name]: e.target.value })
        }
    }


    const resetFields = () => {
        setValue({
            ...value,
            'ReportedDate': "", 'ReportedDateTo': "", 'CategoryID': '', 'VehicleNumber': '', 'VehicleNumberTo': '', 'LossCodeID': null, 'Value': '', 'ValueTo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'StorageLocationID': '', 'ActivityType': '', 'ReceiveDate': '', 'ReceiveDateTo': '', 'InvestigatorID': '', 'location': '', 'DispositionID': '', 'RecoveredDateTime': '', 'RecoveredDateTimeTo': '', 'ActivityTypeID': ''
        }); setShowWatermark('')
    }

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data', // Empty title prevents browser titles from appearing
        removeAfterPrint: true,
        onBeforeGetContent: () => {
            setLoder(true);
            setShowFooter(true);
        },
        onAfterPrint: () => {
            setLoder(false);
            setShowFooter(false);
        }
    });


    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm(); get_PropertyReport(true); setShowFooter(false);
        }, 100);
    };

    const get_Dispositions = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('PropertyDispositions/GetDataDropDown_PropertyDispositions', val).then((data) => {
            if (data) {
                setDispositionsDrpData(Comman_changeArrayFormat(data, 'PropertyDispositionsID', 'Description'));
            }
            else { setDispositionsDrpData([]) }
        })
    };

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("V108", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {
        if (isPermissionsLoaded) {
            get_PropertyReport();
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
            <div class="section-body view_page_design pt-1">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="col-12 col-md-12 col-lg-12 " >
                                    <fieldset style={{ marginTop: '-15px' }}>
                                        <legend>Vehicle Master Report</legend>
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
                                                <label htmlFor="" className='new-label '>Reported Date From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 ">
                                                <DatePicker
                                                    name='ReportedDate'
                                                    id='ReportedDate'
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null, ['ReportedDateTo']: null }) }}
                                                    selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReportedDate ? true : false}
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    // disabled
                                                    maxDate={new Date(datezone)}
                                                    placeholderText='Select...'
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Reported Date To</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2  ">
                                                <DatePicker
                                                    name='ReportedDateTo'
                                                    id='ReportedDateTo'
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                    selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReportedDateTo ? true : false}
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
                                                    minDate={new Date(value?.ReportedDate)}
                                                    placeholderText='Select...'
                                                    disabled={value?.ReportedDate ? false : true}
                                                    className={!value?.ReportedDate && 'readonlyColor'}

                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Vehicle Category</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                                <Select
                                                    styles={customStylesWithOutColor}
                                                    name='CategoryID'
                                                    value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                                    options={categoryIdDrp}
                                                    onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Vehicle # From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='VehicleNumber' id='VehicleNumber' style={{ textTransform: "uppercase" }} maxLength={12} value={value?.VehicleNumber} onChange={handlChange} className='' />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Vehicle # To</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='VehicleNumberTo' id='VehicleNumberTo' style={{ textTransform: "uppercase" }} maxLength={12} value={value?.VehicleNumberTo} onChange={handlChange}
                                                    disabled={!value?.VehicleNumber?.trim()}
                                                    className={!value?.VehicleNumber?.trim() ? 'readonlyColor' : ''}
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Loss Code</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                                <Select
                                                    name='LossCodeID'
                                                    value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                    styles={customStylesWithOutColor}
                                                    options={propertyLossCodeData}
                                                    onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Value From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='Value' id='Value' maxLength={9} value={'$' + value?.Value} onChange={Valuehandle} className='' />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Value To</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='ValueTo' id='ValueTo' maxLength={9} value={'$' + value?.ValueTo} onChange={Valuehandle}
                                                    disabled={!value?.Value?.trim()}
                                                    className={!value?.Value?.trim() ? 'readonlyColor' : ''}
                                                />
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset >
                                        <legend>Vehicle Owner</legend>
                                        <div className="row mt-1">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Last Name</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='LastName' id='LastName' value={value?.LastName} onChange={handlChange} />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>First Name</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='FirstName' id='FirstName' value={value?.FirstName} onChange={handlChange} />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Middle Name</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                <input type="text" name='MiddleName' id='MiddleName' value={value?.MiddleName} onChange={handlChange} className='' />
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset >
                                        <legend>Property Room</legend>
                                        <div className="row ">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Receive From Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 ">
                                                <DatePicker
                                                    name='ReceiveDate'
                                                    id='ReceiveDate'
                                                    onChange={(date) => { setValue({ ...value, ['ReceiveDate']: date ? getShowingDateText(date) : null, ['ReceiveDateTo']: null }) }}
                                                    selected={value?.ReceiveDate && new Date(value?.ReceiveDate)}
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReceiveDate ? true : false}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    maxDate={new Date(datezone)}
                                                    placeholderText='Select...'
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Receive To Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 ">
                                                <DatePicker
                                                    name='ReceiveDateTo'
                                                    id='ReceiveDateTo'
                                                    onChange={(date) => { setValue({ ...value, ['ReceiveDateTo']: date ? getShowingDateText(date) : null }) }}
                                                    selected={value?.ReceiveDateTo && new Date(value?.ReceiveDateTo)}
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReceiveDateTo ? true : false}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    maxDate={new Date(datezone)}
                                                    minDate={new Date(value?.ReceiveDate)}
                                                    disabled={value?.ReceiveDate ? false : true}
                                                    placeholderText='Select...'
                                                    className={!value?.ReceiveDate && 'readonlyColor'}
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Activity</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                                <Select
                                                    name='ActivityTypeID'
                                                    value={AddTransfer?.filter((obj) => obj.value === value?.ActivityTypeID)}
                                                    isClearable
                                                    options={AddTransfer}
                                                    styles={customStylesWithOutColor}
                                                    onChange={(e) => ChangeDropDown1(e, 'ActivityTypeID')}
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Investigator</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                                <Select
                                                    name='InvestigatorID'
                                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.InvestigatorID)}
                                                    isClearable
                                                    options={agencyOfficerDrpData}
                                                    styles={customStylesWithOutColor}
                                                    onChange={(e) => ChangeDropDown(e, 'InvestigatorID')}
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Location</label>
                                            </div>
                                            <div className="col-4 col-md-8 col-lg-5 text-field mt-1">
                                                <input type="text" name="location" id="StorageLocationID" value={locationStatus ? '' : value.location} disabled />
                                            </div>
                                            <div className="col-1 pt-1" >
                                                <button
                                                    className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#MasterTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                                                        setLocationStatus(true);
                                                    }}>
                                                    <i className="fa fa-plus" > </i>
                                                </button>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset >
                                        <legend>Stolen Property</legend>
                                        <div className="row mt-2">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Disposition</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                                <Select
                                                    name='DispositionID'
                                                    value={dispositionsDrpData?.filter((obj) => obj.value === value?.DispositionID)}
                                                    options={dispositionsDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'DispositionID')}
                                                    styles={customStylesWithOutColor}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Recovered From Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2">
                                                <DatePicker
                                                    name='RecoveredDateTime'
                                                    id='RecoveredDateTime'
                                                    onChange={(date) => { setValue({ ...value, ['RecoveredDateTime']: date ? getShowingMonthDateYear(date) : null, ['RecoveredDateTimeTo']: null }) }}
                                                    selected={value?.RecoveredDateTime && new Date(value?.RecoveredDateTime)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.RecoveredDateTime ? true : false}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    // disabled
                                                    maxDate={new Date(datezone)}
                                                    placeholderText='Select...'
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Recovered To Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 ">
                                                <DatePicker
                                                    name='RecoveredDateTimeTo'
                                                    id='RecoveredDateTimeTo'
                                                    onChange={(date) => { setValue({ ...value, ['RecoveredDateTimeTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    selected={value?.RecoveredDateTimeTo && new Date(value?.RecoveredDateTimeTo)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.RecoveredDateTimeTo ? true : false}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    // maxDate={new Date()}
                                                    placeholderText='Select...'
                                                    maxDate={new Date(datezone)}
                                                    minDate={new Date(value?.RecoveredDateTime)}
                                                    disabled={value?.RecoveredDateTime ? false : true}
                                                    className={!value?.RecoveredDateTime && 'readonlyColor'}
                                                />
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="col-12 col-md-12 col-lg-12 text-right mt-3">
                                        {
                                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_PropertyReport(false); }}>Show Report</button>
                                                : <></> :
                                                <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_PropertyReport(false); }}>Show Report</button>
                                        }
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyReport(false); setMasterReportData([]); resetFields(); }}>Clear</button>
                                        <Link to={'/Reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                    </div>
                                    {/* <div className="col-12 col-md-12 col-lg-12 text-right mt-3">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_PropertyReport(); }}>Show Report</button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyReport(false); setMasterReportData([]); resetFields(); }}>Clear</button>
                                        <Link to={'/Reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* for 1 table */}
                {
                    verifyReport ?
                        <>
                            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">Vehicle Master Report</p>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Link to={''} onClick={handlePrintClick} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            {/* <i className="fa fa-print"></i> */}
                                            <i className="fa fa-print"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="container mt-1"  >
                                <div className="col-12" >
                                    <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }} >
                                        {
                                            masterReportData?.Vehicle?.length > 0 ?
                                                <>
                                                    <ReportAddress {...{ multiImage, masterReportData }} />
                                                </>
                                                :
                                                <>
                                                </>
                                        }
                                        {showWatermark && (
                                            <div className="watermark-print">Confidential</div>
                                        )}
                                        <div className="col-12">
                                            <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                            <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Vehicle Master Report</h5>
                                        </div>
                                        <div className="col-12 bb">

                                            <fieldset>
                                                <legend>Search Criteria</legend>

                                                <div className="row">
                                                    {showFields.showReportedDate && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Reported Date From</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.ReportedDate && getShowingWithOutTime(searchValue.ReportedDate)}
                                                                    readOnly />
                                                            </div>
                                                        </>
                                                    )}

                                                    {showFields.showReportedDateTo && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Reported Date To</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.ReportedDateTo && getShowingWithOutTime(searchValue.ReportedDateTo)}
                                                                    readOnly />
                                                            </div>
                                                        </>
                                                    )}

                                                    {
                                                        showFields.showCategoryID && searchValue.CategoryID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Category</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={categoryIdDrp.find((obj) => obj.value === searchValue.CategoryID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                    {showFields.showVehicleNumber && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Vehicle Number From</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.VehicleNumber || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showVehicleNumberTo && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Vehicle Number To</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.VehicleNumberTo || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}



                                                    {
                                                        showFields.showLossCodeID && searchValue.LossCodeID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Loss Code</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={propertyLossCodeData.find((obj) => obj.value === searchValue.LossCodeID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                    {showFields.showValue && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Value From </label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.Value || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showValueTo && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Value To</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.ValueTo || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}

                                                    {showFields.showLastName && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Last Name</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.LastName || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showFirstName && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>First Name</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.FirstName || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showMiddleName && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Middle Name</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.MiddleName || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showReceiveDate && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Receive Date From </label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.ReceiveDate || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showReceiveDateTo && (
                                                        <>
                                                            <div claReceiveDateame="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Receive Date To</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.ReceiveDateTo || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}

                                                    {showFields.showActivityTypeID && searchValue.ActivityTypeID && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Activity</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={AddTransfer.find((obj) => obj.value === searchValue.ActivityTypeID)?.label || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}

                                                    {
                                                        showFields.showInvestigatorID && searchValue.InvestigatorID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Investigator</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={agencyOfficerDrpData.find((obj) => obj.value === searchValue.InvestigatorID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                    {
                                                        showFields.showStorageLocationID && searchValue.StorageLocationID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Location</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.location || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                    {
                                                        showFields.showDispositionID && searchValue.DispositionID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Disposition</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={dispositionsDrpData.find((obj) => obj.value === searchValue.DispositionID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                    {showFields.showRecoveredDateTime && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Recovered Date From </label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.RecoveredDateTime || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}
                                                    {showFields.showRecoveredDateTimeTo && (
                                                        <>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label className='new-label'>Recovered Date To </label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" className='readonlyColor' value={searchValue.RecoveredDateTimeTo || ''} readOnly />
                                                            </div>
                                                        </>
                                                    )}

                                                </div>
                                            </fieldset>
                                        </div>
                                        {
                                            masterReportData?.Vehicle?.length > 0 ?
                                                <>
                                                    {
                                                        masterReportData?.Vehicle?.map((obj) => (
                                                            <>
                                                                <div className="container-fluid " style={{ pageBreakAfter: 'always' }}>

                                                                    <div className="table-responsive mt-5" >
                                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                            <p className="p-0 m-0 d-flex align-items-center">Vehicle Information: {obj?.VehicleNumber}</p>
                                                                        </div>
                                                                        <div className="col-12  " style={{ border: '1px solid #80808085', }}>
                                                                            <div className="container bb">
                                                                                <h6 className=' text-dark mt-2'>Vehicle Information</h6>
                                                                                <div className="col-12 ">
                                                                                    <div className="row bb px-3 mb-2">
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.VehicleNumber}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Vehicle Number</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj?.ReportedDtTm ? getShowingDateText(obj?.ReportedDtTm) : null}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Reported Date/Time</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Value}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Value</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.LossCode_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Loss Code</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Category_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Category</label>

                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Classification_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Classification</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.StatePlateNumber}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Plate State</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.VehicleNo}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Plate No.
                                                                                                </label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.PlateType_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Plate Type</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.VIN}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>VIN</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.VOD_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>VOD
                                                                                                </label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj?.PlateExpireDtTm ? getShowingWithOutTime(obj?.PlateExpireDtTm) : null}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Plate Expires</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.OANID}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>OAN ID</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.style_Desc}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Style</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Weight}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Weight</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Owner_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Owner</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Make_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Make</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Model_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Model</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.PrimaryColor_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Primary Color</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.SecondaryColor_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Secondary Color</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj?.ManufactureYear ? getYearWithOutDateTime(obj?.ManufactureYear) : null}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Manuf.Year</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Inspection_Sticker}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Inspection Sticker</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj?.InspectionExpiresDtTm ? getShowingWithOutTime(obj?.InspectionExpiresDtTm) : null}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Inspection Expires</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.PrimaryOfficer_Description}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Primary Officer</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.InProfessionOf}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>In Possession Of</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                            <div className=''>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name=""
                                                                                                    id=""
                                                                                                    // checked={obj && Object.keys(obj).length > 0 ? obj.IsEvidence : false}
                                                                                                    // disabled={!obj || Object.keys(obj).length === 0}
                                                                                                    checked={obj?.IsEvidence || false}
                                                                                                    disabled={!obj}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary pl-2'>Evidence</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                            <div className=''>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name=""
                                                                                                    id=""
                                                                                                    checked={obj && Object.keys(obj).length > 0 ? obj.IsSendToPropertyRoom : false}
                                                                                                    disabled={!obj || Object.keys(obj).length === 0}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary pl-2'>Send To Property Room</label>

                                                                                            </div>
                                                                                        </div>


                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className="col-12  " style={{ border: '1px solid #80808085', }}>
                                                                            <div className="container bb">
                                                                                <h6 className=' text-dark mt-2'>Additional Information</h6>
                                                                                <div className="col-12 ">
                                                                                    <div className="row bb px-3 mb-2">
                                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                            <div>
                                                                                                <label htmlFor="" className='new-summary'>Description</label>
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
                                                                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj?.Description) }}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                                            <div className=''>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name=""
                                                                                                    id=""
                                                                                                    // checked={obj && Object.keys(obj).length > 0 ? obj.IsImmobalizationDevice : false}
                                                                                                    // disabled={!obj || Object.keys(obj).length === 0}
                                                                                                    checked={obj?.IsImmobalizationDevice || false}
                                                                                                    disabled={!obj}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary pl-1'>Is Immobalization Device</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                                            <div className=''>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name=""
                                                                                                    id=""
                                                                                                    // checked={obj && Object.keys(obj).length > 0 ? obj.IsEligibleForImmobalization : false}
                                                                                                    // disabled={!obj || Object.keys(obj).length === 0}

                                                                                                    checked={obj?.IsEligibleForImmobalization || false}
                                                                                                    disabled={!obj}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary pl-1'>Is EligibleForImmobalization</label>

                                                                                            </div>
                                                                                        </div>



                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>

                                                                    </div>
                                                                    {/* notes */}
                                                                    <div className="col-12  " style={{ border: '1px solid #80808085', }}>
                                                                        {
                                                                            JSON.parse(obj?.VehicleNotes)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Vehicle Notes Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.VehicleNotes)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 mb-2">
                                                                                                        <div className="col-12 " >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.OfficerName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Officer Name</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                                    <div>
                                                                                                                        <label htmlFor="" className='new-summary'>Notes</label>
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
                                                                                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Notes) }}
                                                                                                                        />
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
                                                                    {/* vehicle-document */}
                                                                    {JSON.parse(obj?.Document)?.length > 0 ?
                                                                        <div className="table-responsive mt-2" >
                                                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                <p className="p-0 m-0 d-flex align-items-center">Vehicle Document:</p>
                                                                            </div>
                                                                            <table className="table " >
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className='' >Document Name</th>
                                                                                        <th className='' >Notes</th>
                                                                                        <th className=''>Document Type</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {
                                                                                        JSON.parse(obj?.Document)?.map((item, key) => (
                                                                                            <>
                                                                                                <tr key={key}>
                                                                                                    <td className='text-list'>{item.DocumentName}</td>
                                                                                                    <td className='text-list'>{item.DocumentNotes}</td>
                                                                                                    <td className='text-list'>{item.DocumentType_Description}</td>
                                                                                                </tr>
                                                                                            </>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        : <></>}


                                                                    <div className="col-12  bb" style={{ border: '1px solid #80808085', }}>
                                                                        {
                                                                            JSON.parse(obj?.Recovered)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Recovered Property Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Recovered)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Officer_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Officer</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.RecoveredDateTime ? getShowingDateText(item.RecoveredDateTime) : ''}
                                                                                                                        />

                                                                                                                        <label htmlFor="" className='new-summary'>Recovered Date/Time</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.RecoveryType}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Recovery Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.RecoveredValue}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Recovered Value</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Balance}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Balance</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Disposition}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Disposition</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                                    <label htmlFor="" className='new-summary'>Comments</label>

                                                                                                                    <div
                                                                                                                        className="readonlyColor  "
                                                                                                                        style={{
                                                                                                                            border: '1px solid #ccc',
                                                                                                                            borderRadius: '4px',
                                                                                                                            padding: '10px',
                                                                                                                            backgroundColor: '#f9f9f9',
                                                                                                                            lineBreak: 'anywhere'
                                                                                                                        }}
                                                                                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Comments) }}

                                                                                                                    />
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
                                                                    {
                                                                        JSON.parse(obj?.Transaction)?.length > 0 ?
                                                                            <>
                                                                                <div className="table-responsive mt-2" >
                                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                        <p className="p-0 m-0 d-flex align-items-center">Transaction Information:</p>
                                                                                    </div>
                                                                                    <table className="table " >
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className='' style={{ width: '100px' }}>Transaction Name</th>
                                                                                                <th className='' style={{ width: '100px' }}>Transaction Number</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {
                                                                                                JSON.parse(obj?.Transaction)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key}>
                                                                                                            <td style={{ width: '100px' }} className='text-list'>{item.TransactionName}</td>
                                                                                                            <td style={{ width: '100px' }} className='text-list'>{item.TransactionNumber}</td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </>
                                                                            :
                                                                            <></>
                                                                    }
                                                                    {
                                                                        JSON.parse(obj?.Propertyroom)?.length > 0 ?
                                                                            <>
                                                                                <div className="table-responsive mt-2" >
                                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                        <p className="p-0 m-0 d-flex align-items-center">Property Room Information:</p>
                                                                                    </div>
                                                                                    <table className="table " >
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className=''>Officer Name</th>
                                                                                                <th className=''>Activity Reason</th>
                                                                                                <th className=''>Other Person Name</th>
                                                                                                <th className=''>Activity</th>
                                                                                                <th className=''>Date/Time</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {
                                                                                                JSON.parse(obj?.Propertyroom)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key}>
                                                                                                            <td className='text-list'>{item.Officer_Name}</td>
                                                                                                            <td className='text-list'>{item.ActivityReason_Des}</td>
                                                                                                            <td className='text-list'>{item.OtherPersonName_Name}</td>
                                                                                                            <td className='text-list'>{item.Status}</td>
                                                                                                            <td className='text-list'>{item.ReleaseDate ? getShowingDateText(item.ReleaseDate) : ''}</td>

                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </>
                                                                            :
                                                                            <></>
                                                                    }
                                                                    {/* vehicle-img */}

                                                                    {/* ///-----------------------old------------------------- */}
                                                                    {/* {
                                                                        JSON.parse(obj?.Photo)?.length > 0 ?
                                                                            <div className="table-responsive mt-3">
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Vehicle Image Information</p>
                                                                                </div>
                                                                                <table className="table table-bordered" >
                                                                                    <div className='col-12'>
                                                                                        <div className="row">
                                                                                            {
                                                                                                JSON.parse(obj?.Photo)?.map((item, index) => {
                                                                                                    return (
                                                                                                        <div className="col-3" key={index}>
                                                                                                            <img src={item.Photo} />
                                                                                                        </div>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </table>
                                                                            </div>
                                                                            :
                                                                            <>
                                                                            </>
                                                                    } */}
                                                                    {
                                                                        JSON.parse(obj?.Photo)?.length > 0 ? (
                                                                            <div className="table-responsive mt-3 ">
                                                                                <div className="text-white text-bold bg-green py-1 px-2 d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Vehicle Image Information</p>
                                                                                </div>
                                                                                <div className='col-12'>
                                                                                    <div className="row">
                                                                                        {
                                                                                            JSON.parse(obj?.Photo)?.map((item, index) => {
                                                                                                return (
                                                                                                    <div className="col-3 d-flex justify-content-center mb-2" key={index}>
                                                                                                        <img
                                                                                                            src={item.Photo}
                                                                                                            alt={`Vehicle ${index}`}
                                                                                                            className="img-fluid"
                                                                                                            style={{
                                                                                                                width: "100%",
                                                                                                                height: "200px",
                                                                                                                padding: "5px"
                                                                                                            }}
                                                                                                        />
                                                                                                    </div>
                                                                                                );
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : null
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
                                        {showFooter && (
                                            <div className="print-footer">
                                                <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>


                            </div>
                        </>
                        :
                        <>
                        </>
                }
            </div >


            {loder && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )}
            <TreeModalReport {...{ proRoom, locationStatus, setLocationStatus, locationPath, setLocationPath, setSearchStoragePath, setValue }} />
        </>
    )
}

export default VehicleMasterReport