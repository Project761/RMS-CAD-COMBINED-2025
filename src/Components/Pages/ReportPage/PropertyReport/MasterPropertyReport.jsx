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
import { Accordion, AccordionTab } from 'primereact/accordion';
import { get_AgencyOfficer_Data, get_PropertyLossCode_Drp_Data, get_PropertyTypeData, get_VehicleLossCode_Drp_Data } from '../../../../redux/actions/DropDownsData';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';
import DOMPurify from 'dompurify';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import Location from '../../../Location/Location';
import TreeModalReport from '../VehicleReport/TreeModalReport';

const MasterPropertyReport = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    // const propertyLossCodeData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);
    const propertyLossCodeDrpData = useSelector((state) => state.DropDown.propertyLossCodeDrpData);
    const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);
    const { GetDataTimeZone, datezone, setChangesStatus } = useContext(AgencyContext);

    const ipAddress = sessionStorage.getItem('IPAddress');

    const [dispositionsDrpData, setDispositionsDrpData] = useState([]);
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    // const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [verifyReport, setverifyReport] = useState(false);
    const [masterReportData, setMasterReportData] = useState([]);
    const [localStatus, setlocalStatus] = useState(false);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [recoverDate, setRecoverDate] = useState();
    const [loder, setLoder] = useState(false);
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const [showWatermark, setShowWatermark] = useState(false);

    const [locationStatus, setLocationStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [onSelectLocation, setOnSelectLocation] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [proRoom, setProRoom] = useState('PropertyRoom');
    const [locationPath, setLocationPath] = useState();
    const [searchStoragepath, setSearchStoragePath] = useState();
    const [value, setValue] = useState({
        'PropertyTypeID': null, 'LossCodeID': null, 'ReportedDtTm': "", 'ReportedDtTmTo': "", 'PropertyNumber': '', 'PropertyNumberTo': '',
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'AgencyID': '', 'ValueTo': '', 'ValueFrom': '',
        'ActivityType': '', 'ActivityTypeID': '', 'ReceiveDate': '', 'ReceiveDateTo': '', 'InvestigatorID': '', 'location': '',
        'DispositionID': '', 'RecoveredDateTime': '', 'RecoveredDateTimeTo': '',
        'IPAddress': '',
        'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
    });
    const [searchValue, setSearchValue] = useState({
        PropertyTypeID: null, LossCodeID: null, ReportedDtTm: '', ReportedDtTmTo: '', PropertyNumber: '', PropertyNumberTo: '', LastName: '', FirstName: '', MiddleName: '', ValueTo: '', ValueFrom: '', ActivityTypeID: null, ReceiveDate: '', ReceiveDateTo: '', InvestigatorID: null, location: '', DispositionID: null, RecoveredDateTime: '', RecoveredDateTimeTo: '',
    });

    const [showFields, setShowFields] = useState({
        showPropertyTypeID: false, showLossCodeID: false, showReportedDtTm: false, showReportedDtTmTo: false, showPropertyNumber: false, showPropertyNumberTo: false, showLastName: false, showFirstName: false, showMiddleName: false, showValueTo: false, showValueFrom: false, showActivityTypeID: false, showReceiveDate: false, showReceiveDateTo: false, showInvestigatorID: false, showlocation: false, showDispositionID: false, showRecoveredDateTime: false, showRecoveredDateTimeTo: false,
    });
    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);
    // useEffect(() => {
    //     if (localStoreData) {
    //         if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(localStoreData?.AgencyID)) };
    //         setLoginAgencyID(localStoreData?.AgencyID);
    //         setLoginPinID(localStoreData?.PINID);
    //         get_PropertyType(localStoreData?.AgencyID);
    //         // if (agencyOfficerDrpData?.length === 0) { dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID)); }
    //         get_Dispositions(localStoreData?.AgencyID);
    //     }
    // }, [localStoreData])
    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginUserName(localStoreData?.UserName)
            setloginPinID(parseInt(localStoreData?.PINID)); dispatch(get_ScreenPermissions_Data("P104", localStoreData?.AgencyID, localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (LoginAgencyID) {
            dispatch(get_AgencyOfficer_Data(LoginAgencyID, ''))
            // if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(LoginAgencyID)) };
            // get_PropertyType(LoginAgencyID);
            get_Dispositions(LoginAgencyID);
            dispatch(get_PropertyTypeData(LoginAgencyID));

        }
    }, [LoginAgencyID]);
    useEffect(() => {
        setShowFields({
            showPropertyTypeID: searchValue.PropertyTypeID !== null,
            showLossCodeID: searchValue.LossCodeID !== null,
            showReportedDtTm: searchValue.ReportedDtTm,
            showReportedDtTmTo: searchValue.ReportedDtTmTo,
            showPropertyNumber: searchValue.PropertyNumber,
            showPropertyNumberTo: searchValue.PropertyNumberTo,
            showLastName: searchValue.LastName,
            showFirstName: searchValue.FirstName,
            showMiddleName: searchValue.MiddleName,
            showValueTo: searchValue.ValueTo,
            showValueFrom: searchValue.ValueFrom,
            showActivityTypeID: searchValue.ActivityTypeID !== null,
            showReceiveDate: searchValue.ReceiveDate,
            showReceiveDateTo: searchValue.ReceiveDateTo,
            showInvestigatorID: searchValue.InvestigatorID !== null,
            showlocation: searchValue.location,
            showDispositionID: searchValue.DispositionID !== null,
            showRecoveredDateTime: searchValue.RecoveredDateTime,
            showRecoveredDateTimeTo: searchValue.RecoveredDateTimeTo,

        });
    }, [searchValue]);
    // useEffect(() => {
    //     if (LoginAgencyID) {
    //         get_Dispositions(LoginAgencyID);
    //     }
    // }, [LoginAgencyID]);

    // Onload Function

    useEffect(() => {
        if (masterReportData?.length > 0) {
            setverifyReport(true);
        }
    }, [masterReportData]);
    // const get_PropertyType = (LoginAgencyID) => {
    //     const val = { AgencyID: LoginAgencyID }
    //     fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((data) => {
    //         if (data) {
    //             const res = data?.filter((val) => {
    //                 if (val.PropertyCategoryCode !== "V") return val
    //             })
    //             // const id = data?.filter((val) => { if (val.PropertyCategoryCode === "A") return val })
    //             // if (id.length > 0) {
    //             //   // setValue({ ...value,['PropertyTypeID']: id[0].PropertyCategoryID, ['PropertyCategoryCode']: id[0].PropertyCategoryCode,});
    //             //   setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: id[0].PropertyCategoryID, ['PropertyCategoryCode']: id[0].PropertyCategoryCode, } })
    //             //   PropertyCategory(id[0].PropertyCategoryID)
    //             // }
    //             setPropertyTypeData(threeColArray(res, 'PropertyCategoryID', 'Description', 'PropertyCategoryCode'))
    //         } else {
    //             setPropertyTypeData([]);
    //         }
    //     })
    // }

    const componentRef = useRef();

    // const printForm = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: 'Data',
    //     onAfterPrint: () => { '' }
    // })
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
    const get_Dispositions = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('PropertyDispositions/GetDataDropDown_PropertyDispositions', val).then((data) => {
            if (data) {
                setDispositionsDrpData(Comman_changeArrayFormat(data, 'PropertyDispositionsID', 'Description'));
            }
            else { setDispositionsDrpData([]) }
        })
    };
    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                // console.log(res)
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);

            }
            else { console.log("errror") }
        })
    }

    const isNotEmpty = (value) => {
        // console.log(value)
        return value !== null && value.trim() !== '';
    }
    const get_PropertyReport = async (isPrintReport = false) => {
        setLoder(true);
        const { ReportedDtTm, ReportedDtTmTo, PropertyNumber, PropertyNumberTo, LastName, FirstName, MiddleName, ValueTo, ValueFrom, DispositionID, RecoveredDateTime, RecoveredDateTimeTo, ActivityType, ReceiveDate, ReceiveDateTo, location, PropertyTypeID, LossCodeID, InvestigatorID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, } = myStateRef.current
        const isValid = isNotEmpty(ReportedDtTm) || isNotEmpty(ReportedDtTmTo) || isNotEmpty(ValueFrom) || isNotEmpty(ValueTo) || isNotEmpty(MiddleName) || isNotEmpty(FirstName) || isNotEmpty(LastName) || isNotEmpty(PropertyNumberTo) || isNotEmpty(PropertyNumber) ||
            (LossCodeID !== null && LossCodeID !== '') || (ActivityType !== null && ActivityType.trim() !== '') || isNotEmpty(location) || isNotEmpty(ReceiveDateTo) || isNotEmpty(ReceiveDate) || (DispositionID !== null && DispositionID !== '') || isNotEmpty(RecoveredDateTime) || isNotEmpty(RecoveredDateTimeTo) || (PropertyTypeID !== null && PropertyTypeID !== '') || (InvestigatorID !== null && InvestigatorID !== '');
        if (isValid) {
            const val = {
                'ReportedDtTm': ReportedDtTm, 'ReportedDtTmTo': ReportedDtTmTo,
                'LossCodeID': LossCodeID, 'PropertyNumber': PropertyNumber, 'PropertyNumberTo': PropertyNumberTo,
                'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'AgencyID': LoginAgencyID,
                'ValueTo': parseFloat(ValueTo) === 0 || parseFloat(ValueTo) < 0 ? '0.00' : parseFloat(ValueTo),
                'ValueFrom': parseFloat(ValueFrom) === 0 || parseFloat(ValueFrom) < 0 ? '0.00' : parseFloat(ValueFrom),
                'PropertyTypeID': PropertyTypeID,
                'ActivityType': ActivityType, 'ReceiveDate': ReceiveDate, 'ReceiveDateTo': ReceiveDateTo, 'location': location,
                'DispositionID': DispositionID, 'RecoveredDateTime': RecoveredDateTime, 'RecoveredDateTimeTo': RecoveredDateTimeTo,
                'InvestigatorID': InvestigatorID,
                IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'ReportProperty/PrintPropertyReport' : 'ReportProperty/GetData_ReportProperty';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    console.log(res)
                    setMasterReportData(res[0]);
                    setverifyReport(true);
                    getAgencyImg(LoginAgencyID)
                    setSearchValue(value);
                    setLoder(false);
                } else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available");
                        setverifyReport(false); setMasterReportData([]);
                        setLoder(false);
                    }
                }
                setIsPermissionsLoaded(false);
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setverifyReport(false);
                setLoder(false);
                setIsPermissionsLoaded(false);

            }

        } else {
            toastifyError("Please Enter Details");
            setLoder(false);
        }
    }
    // const get_PropertyReport = () => {
    //     const { ReportedDtTm, ReportedDtTmTo, PropertyNumber, PropertyNumberTo, LastName, FirstName, MiddleName, ValueTo, ValueFrom, DispositionID, RecoveredDateTime, RecoveredDateTimeTo, ActivityType, ReceiveDate, ReceiveDateTo, location, PropertyTypeID, LossCodeID, InvestigatorID, } = value
    //     const isValid = isNotEmpty(ReportedDtTm) || isNotEmpty(ReportedDtTmTo) || isNotEmpty(ValueFrom) || isNotEmpty(ValueTo) || isNotEmpty(MiddleName) || isNotEmpty(FirstName) || isNotEmpty(LastName) || isNotEmpty(PropertyNumberTo) || isNotEmpty(PropertyNumber) || (LossCodeID !== null && LossCodeID !== '') || (ActivityType !== null && ActivityType.trim() !== '') || isNotEmpty(location) || isNotEmpty(ReceiveDateTo) || isNotEmpty(ReceiveDate) || isNotEmpty(DispositionID) || isNotEmpty(RecoveredDateTime) || isNotEmpty(RecoveredDateTimeTo) || (PropertyTypeID !== null && PropertyTypeID !== '') || (InvestigatorID !== null && InvestigatorID !== '');
    //     if (isValid) {
    //         const val = {
    //             'ReportedDtTm': ReportedDtTm, 'ReportedDtTmTo': ReportedDtTmTo,
    //             'LossCodeID': LossCodeID, 'PropertyNumber': PropertyNumber, 'PropertyNumberTo': PropertyNumberTo,
    //             'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'AgencyID': LoginAgencyID,
    //             'ValueTo': parseFloat(ValueTo) === 0 || parseFloat(ValueTo) < 0 ? '0.00' : parseFloat(ValueTo),
    //             'ValueFrom': parseFloat(ValueFrom) === 0 || parseFloat(ValueFrom) < 0 ? '0.00' : parseFloat(ValueFrom),
    //             'PropertyTypeID': PropertyTypeID,
    //             'ActivityType': ActivityType, 'ReceiveDate': ReceiveDate, 'ReceiveDateTo': ReceiveDateTo, 'location': location,
    //             'DispositionID': DispositionID, 'RecoveredDateTime': RecoveredDateTime, 'RecoveredDateTimeTo': RecoveredDateTimeTo,
    //             'InvestigatorID': InvestigatorID
    //         }
    //         fetchPostData('ReportProperty/GetData_ReportProperty', val).then((res) => {
    //             if (res.length > 0) {
    //                 console.log(res)
    //                 setMasterReportData(res[0]);
    //                 setverifyReport(true);
    //                 getAgencyImg(LoginAgencyID)
    //                 setSearchValue(value);
    //             }
    //             else {
    //                 toastifyError("Data Not Available");
    //                 setverifyReport(false); setMasterReportData([]);
    //             }
    //         })
    //     }
    //     else {
    //         toastifyError("Please Enter Details");
    //     }
    // }

    const ChangeDropDown = (e, name) => {
        // console.log(e)
        if (e) {
            if (name === 'PropertyTypeID') {
                setValue({
                    ...value,
                    [name]: e.value
                });
                switch (e.id) {
                    case 'A': dispatch(get_PropertyLossCode_Drp_Data(LoginAgencyID, '1', '', '', '', '', '')); break;
                    case 'B': dispatch(get_PropertyLossCode_Drp_Data(LoginAgencyID, '', '1', '', '', '', '')); break;
                    case 'S': dispatch(get_PropertyLossCode_Drp_Data(LoginAgencyID, '', '', '1', '', '', '')); break;
                    case 'O': dispatch(get_PropertyLossCode_Drp_Data(LoginAgencyID, '', '', '', '1', '', '')); break;
                    case 'D': dispatch(get_PropertyLossCode_Drp_Data(LoginAgencyID, '', '', '', '', '1', '')); break;
                    case 'G': dispatch(get_PropertyLossCode_Drp_Data(LoginAgencyID, '', '', '', '', '', '1')); break;
                    default: dispatch(get_PropertyLossCode_Drp_Data(LoginAgencyID, '1', '', '', '', '', ''));;
                }
            }
            else if (name === 'ActivityTypeID') {
                setValue({
                    ...value,
                    [name]: e.value,
                    ['ActivityType']: e.label
                });
            }

            else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
        }
        else {
            if (name === 'PropertyTypeID') {
                setValue({
                    ...value,
                    ['PropertyTypeID']: null,
                    ['LossCodeID']: null
                })
                dispatch(get_PropertyLossCode_Drp_Data('', '', '', '', '', '', ''));
            } else if (name === 'ActivityTypeID') {
                setValue({
                    ...value,
                    [name]: '',
                    ['ActivityType']: ''
                });
            } else {
                setValue({
                    ...value,
                    [name]: null
                })
            }
        }
    }

    const handlChange = (e,) => {
        // if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
        //     var ele = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); // Remove spaces and invalid characters

        //     if (ele.length === 10) {
        //         var cleaned = ele; // No need for additional cleaning as spaces are already removed
        //         var match = cleaned.match(/^(\w{3})(\d{7})$/);
        //         if (match) {
        //             setValue({
        //                 ...value,
        //                 [e.target.name]: match[1].toUpperCase() + '-' + match[2]
        //             });
        //         }

        //     }
        //     else {
        //         ele = e.target.value.split("'").join('').replace(/[^a-zA-Z\s^0-9\s]/g, '');

        //         setValue({
        //             ...value,
        //             [e.target.name]: ele
        //         });

        //         if (ele.length === 0) {
        //             if (e.target.name === 'PropertyNumber') {
        //                 setValue({ ...value, ['PropertyNumberTo']: "", [e.target.name]: ele });
        //             }
        //             // Uncomment if you have a similar case for ValueFrom
        //             // if (e.target.name === 'ValueFrom') { 
        //             //     setValue({ ...value, ['ValueTo']: "", [e.target.name]: ele });
        //             // }
        //         }
        //     }

        if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'PropertyNumber' && setValue({
                    ...value, ['PropertyNumberTo']: "", [e.target.name]: ele
                });
            }
        }

        else if (e.target.name === 'MiddleName' || e.target.name === 'LastName' || e.target.name === 'FirstName') {
            const inputValue = e.target.value;
            const checkInput = inputValue.replace(/[^a-zA-Z0-9@#$%&*!.,\s]/g, "");
            const finalInput = inputValue.trim() === "" ? checkInput.replace(/\s/g, "") : checkInput;
            setValue({
                ...value,
                [e.target.name]: finalInput
            });
        }
        else if (e.target.name === 'location') {
            const inputValue = e.target.value;
            // Modify the regex to remove spaces but allow other characters (including backslashes)
            const checkInput = inputValue.replace(/[^a-zA-Z0-9@#$%&*!.,/\\]/g, ""); // Removed space from regex
            setValue({
                ...value,
                [e.target.name]: checkInput
            });
        }


        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }
    const Valuehandle = (e) => {
        if (e.target.name === 'ValueFrom' || e.target.name === 'ValueTo') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "");
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

                        setValue({
                            ...value,
                            [e.target.name]: ele
                        });

                    }
                }
            }

            else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\.]/g, "");
                setValue({ ...value, [e.target.name]: ele });
                if (ele?.length == 0) { e.target.name == 'ValueFrom' && setValue({ ...value, ['ValueTo']: "", [e.target.name]: ele }) }
            }
        }

        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }
    const resetFields = () => {
        setValue({
            ...value,
            'PropertyTypeID': null, 'LossCodeID': null, 'ReportedDtTm': "", 'ReportedDtTmTo': "", 'PropertyNumber': '', 'PropertyNumberTo': '',
            'ValueTo': '', 'ValueFrom': '', 'LastName': '', 'FirstName': '', 'MiddleName': '',
            'ActivityType': '', 'ActivityTypeID': '', 'ReceiveDate': '', 'ReceiveDateTo': '', 'InvestigatorID': '', 'location': '', 'DispositionID': '', 'RecoveredDateTime': '', 'RecoveredDateTimeTo': '',
        });
        setverifyReport(false); setMasterReportData([]); setShowWatermark('')

    }

    const AddTransfer = [
        { value: 1, label: 'CheckIn' },
        { value: 2, label: 'CheckOut' },
        { value: 3, label: 'Release' },
        { value: 4, label: 'Destroy' },
    ]


    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm(); get_PropertyReport(true); setShowFooter(false);
        }, 100);
    };

    //harsh
    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("P104", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {

        if (isPermissionsLoaded) {
            get_PropertyReport()
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
            <div class="section-body view_page_design pt-1" >
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="col-12 col-md-12 col-lg-12  " >
                                    <fieldset>
                                        <legend>Property Master Report</legend>
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
                                        <div className="row mt-2">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Reported From Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mb-1">
                                                <DatePicker
                                                    name='ReportedDtTm'
                                                    id='ReportedDtTm'
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDtTm']: date ? getShowingDateText(date) : null, ['ReportedDtTmTo']: null }) }}
                                                    selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReportedDtTm ? true : false}
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
                                            <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                <label htmlFor="" className='new-label'>Reported To Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mb-1">
                                                <DatePicker
                                                    name='ReportedDtTmTo'
                                                    id='ReportedDtTmTo'
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingDateText(date) : null }) }}
                                                    selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReportedDtTmTo ? true : false}
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    // maxDate={new Date()}
                                                    placeholderText='Select...'
                                                    maxDate={new Date(datezone)}
                                                    minDate={new Date(value?.ReportedDtTm)}
                                                    disabled={value?.ReportedDtTm ? false : true}
                                                    className={!value?.ReportedDtTm && 'readonlyColor'}
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Property Type</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mt-1" >
                                                <Select
                                                    styles={customStylesWithOutColor}
                                                    name='PropertyTypeID'
                                                    value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                    options={propertyTypeData}
                                                    onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                <label htmlFor="" className='new-label'>Loss Code</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 ">
                                                <Select
                                                    name='LossCodeID'
                                                    styles={customStylesWithOutColor}
                                                    value={propertyLossCodeDrpData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                    options={propertyLossCodeDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Value From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">

                                                <input type="text" name='ValueFrom' id='ValueFrom' value={'$' + value?.ValueFrom} onChange={Valuehandle} className='' maxLength={9} />

                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                <label htmlFor="" className='new-label'>Value To</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                                                <input type="text" name='ValueTo' id='ValueTo' maxLength={9} value={'$' + value?.ValueTo} onChange={Valuehandle}
                                                    disabled={!value?.ValueFrom?.trim()}

                                                    className={!value?.ValueFrom?.trim() ? 'readonlyColor' : ''}

                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Property # From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                                                <input type="text" name='PropertyNumber' id='PropertyNumber' style={{ textTransform: "uppercase" }} value={value?.PropertyNumber} maxLength={11} onChange={handlChange} className='' />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                <label htmlFor="" className='new-label'>Property # To</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                                                <input type="text" name='PropertyNumberTo' id='PropertyNumberTo' style={{ textTransform: "uppercase" }} value={value?.PropertyNumberTo} maxLength={11} onChange={handlChange}
                                                    disabled={!value?.PropertyNumber?.trim()}
                                                    className={!value?.PropertyNumber?.trim() ? 'readonlyColor' : ''}
                                                />
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset >
                                        <legend>Property Owner</legend>
                                        <div className="row mt-2">
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
                                                    onChange={(e) => ChangeDropDown(e, 'ActivityTypeID')}
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
                                                <input type="text" name="location" id="location" value={locationStatus ? '' : value.location} disabled />
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
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
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
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
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
                                    <div className="col-12 col-md-12 col-lg-12 text-right mt-1">
                                        {/* <button className="btn btn-sm bg-green text-white px-2 py-1"
                                            onClick={() => { get_PropertyReport(); }}>Show Report</button> */}
                                        {
                                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_PropertyReport(false); }} >Show Report</button>
                                                : <></> :
                                                <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_PropertyReport(false); }} >Show Report</button>
                                        }
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                        <Link to={'/Reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                {/* for 1 table */}
                {
                    verifyReport ?

                        masterReportData?.Property?.length > 0 ?
                            <>
                                <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Property Master Report</p>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                                {/* <i className="fa fa-print"></i> */}
                                                <i className="fa fa-print" onClick={handlePrintClick}></i>
                                            </Link>
                                            {/* <Link to={''} className="btn btn-sm bg-green  text-white px-2 py-0"  >
                                        <i className="fa fa-file"></i>
                                    </Link> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="container mt-1"  >
                                    <div className="col-12" >
                                        <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }} >
                                            <>
                                                <ReportAddress {...{ multiImage, masterReportData }} />
                                                {showWatermark && (
                                                    <div className="watermark-print">Confidential</div>
                                                )}

                                            </>
                                            <div className="col-12">
                                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Master Property Report</h5>
                                            </div>
                                            <div className="col-12">

                                                <fieldset>
                                                    <legend>Search Criteria</legend>

                                                    <div className="row">
                                                        {showFields.showReportedDtTm && searchValue.ReportedDtTm && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Reported From Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor'
                                                                        value={searchValue.ReportedDtTm && getShowingWithOutTime(searchValue.ReportedDtTm)}
                                                                        readOnly />
                                                                </div>
                                                            </>
                                                        )}

                                                        {showFields.showReportedDtTmTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Reported To Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.ReportedDtTmTo && getShowingWithOutTime(searchValue.ReportedDtTmTo)} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showPropertyTypeID && searchValue.PropertyTypeID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Property Type</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={propertyTypeData.find((obj) => obj.value === searchValue.PropertyTypeID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showLossCodeID && searchValue.LossCodeID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Loss Code</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={propertyLossCodeDrpData.find((obj) => obj.value === searchValue.LossCodeID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showValueFrom && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Value From</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.ValueFrom || ''} readOnly />
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
                                                        {showFields.showPropertyNumber && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Property From Number</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.PropertyNumber || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showPropertyNumberTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Property To Number</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.PropertyNumberTo || ''} readOnly />
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
                                                                    <label className='new-label'>Receive From Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    {/* <input type="text" className='readonlyColor' value={searchValue.ReceiveDate || ''} readOnly /> */}
                                                                    <input type="text" className='readonlyColor' value={searchValue.ReceiveDate && getShowingWithOutTime(searchValue.ReceiveDate)} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showReceiveDateTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Receive To Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    {/* <input type="text" className='readonlyColor' value={searchValue.ReceiveDateTo || ''} readOnly /> */}
                                                                    <input type="text" className='readonlyColor' value={searchValue.ReceiveDateTo && getShowingWithOutTime(searchValue.ReceiveDateTo)} readOnly />
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

                                                        {showFields.showInvestigatorID && searchValue.InvestigatorID && (

                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Investigator</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={agencyOfficerDrpData.find((obj) => obj.value === searchValue.InvestigatorID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showlocation && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Location</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
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
                                                            )
                                                        }
                                                        {showFields.showRecoveredDateTime && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Recovered From Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    {/* <input type="text" className='readonlyColor' value={searchValue.RecoveredDateTime || ''} readOnly /> */}
                                                                    <input type="text" className='readonlyColor' value={searchValue.RecoveredDateTime && getShowingWithOutTime(searchValue.RecoveredDateTime)} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showRecoveredDateTimeTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Recovered To Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    {/* <input type="text" className='readonlyColor' value={searchValue.RecoveredDateTimeTo || ''} readOnly /> */}
                                                                    <input type="text" className='readonlyColor' value={searchValue.RecoveredDateTimeTo && getShowingWithOutTime(searchValue.RecoveredDateTimeTo)} readOnly />
                                                                </div>
                                                            </>
                                                        )}

                                                    </div>
                                                </fieldset>
                                            </div>
                                            {
                                                masterReportData?.Property?.length > 0 ?
                                                    <>
                                                        {
                                                            masterReportData?.Property?.map((obj) => (
                                                                <>
                                                                    <div className="col-12">
                                                                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                                    </div>
                                                                    <div className="container-fluid" style={{ pageBreakAfter: 'always', border: '1px solid #80808085', }}>
                                                                        <h5 className=" text-white text-bold bg-green text-center py-1 px-3">Property Information:{obj?.PropertyNumber}</h5>
                                                                        <div className="col-12 bb mt-2" >
                                                                            <div className="row px-3 mb-1" >
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.PropertyNumber}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Property Number</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-8 col-md-8 col-lg-8 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.PropertyType_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Property Type</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.ReportedDtTm ? getShowingDateText(obj.ReportedDtTm) : ''}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Reported Date/Time</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.Value}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Value</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                    <div className="text-field">
                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                            value={obj.PossessionOf_Name}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>In Possession Of</label>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                    <div className="text-field">
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.PropertyCategory_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Category</label>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                    <div className="text-field">
                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                            value={obj.PropertyClassification_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Classification</label>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                    <div className="text-field">
                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                            value={obj.Officer_Name}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Primary Officer</label>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-12 col-md-12 col-lg-6 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.PropertyLossCode_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Loss Code</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                    <div className=''>
                                                                                        {/* <input
                                                                                            type="checkbox"
                                                                                            name=""
                                                                                            id=""
                                                                                            checked={obj && Object.keys(obj).length > 0 ? obj.IsEvidence : false}
                                                                                            disabled={!obj || Object.keys(obj).length === 0}
                                                                                        /> */}
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={obj?.IsEvidence || false}
                                                                                            disabled={!obj}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary pl-2'>Is Evidence</label>

                                                                                    </div>
                                                                                </div>


                                                                            </div>
                                                                        </div>
                                                                        {/* Miscellaneous Information */}
                                                                        <div className="col-12  ">
                                                                            <div className="container ">
                                                                                <h6 className=' text-dark mt-2'>Miscellaneous Information
                                                                                </h6>
                                                                                <div className="col-12 ">
                                                                                    <div className="row bb px-3 mb-2">
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.PropertyTag}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Tag #</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.NICB}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>NICB #</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                            <div className="text-field">
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.DestroyDtTm}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Destroy Date/Time</label>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                            <div className='text-field'>
                                                                                                <textarea rows={2} type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={obj.Description} style={{ resize: 'none' }}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary'>Description</label>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-6 col-md-6 col-lg-3 mt-2 ">
                                                                                            <div className=''>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name=""
                                                                                                    id=""
                                                                                                    checked={obj && Object.keys(obj).length > 0 ? obj.IsSendToPropertyRoom : false}
                                                                                                    disabled={!obj || Object.keys(obj).length === 0}
                                                                                                />
                                                                                                <label htmlFor="" className='new-summary pl-2'>Is Send To Property Room</label>

                                                                                            </div>
                                                                                        </div>



                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                        </div>


                                                                        {/* Article */}
                                                                        <div className="col-12 bb ">
                                                                            {
                                                                                JSON.parse(obj?.Article)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="container ">
                                                                                            <h6 className=' text-dark mt-2'>Article Information</h6>
                                                                                            <div className="col-12 ">
                                                                                                {
                                                                                                    JSON.parse(obj?.Article)?.map((item, key) => (
                                                                                                        <div className="row bb px-3 ">
                                                                                                            <div className="col-12 mb-2" >
                                                                                                                <div className="row ">


                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.SerialID}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Serial No.</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Quantity}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Quantity</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Brand}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Brand</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.ModelID}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Model No.</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.TopColor_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.BottomColor_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.OAN}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>OAN No.</label>

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


                                                                        {/* Boat */}
                                                                        <div className="col-12  bb" >
                                                                            {
                                                                                JSON.parse(obj?.Boat)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="container bb">
                                                                                            <h6 className=' text-dark mt-2'>Boat Information</h6>
                                                                                            <div className="col-12 ">
                                                                                                {
                                                                                                    JSON.parse(obj?.Boat)?.map((item, key) => (
                                                                                                        <div className="row bb px-3 ">
                                                                                                            <div className="col-12 mb-2" >
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Registration_StateName}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Registration State</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.RegistrationNumber}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Registration Number</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Make_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Make</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Model_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Model</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.HIN}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>HIN</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.VOD_Desc}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>VOD</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Propulusion_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Propulation</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.TopColor_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.BottomColor_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Length}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Length</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item?.RegistrationExpiryDtTm ? getYearWithOutDateTime(item?.RegistrationExpiryDtTm) : null}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Registration Expiry</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                                                        {/* <div className="text-field">
                                                                                                                            <textarea type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item?.Comments}
                                                                                                                                style={{ resize: 'none' }} />
                                                                                                                            <label htmlFor="" className='new-summary'>Comments</label>
                                                                                                                        </div> */}
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
                                                                        {/* Drug */}
                                                                        <div className="col-12  bb">
                                                                            {
                                                                                JSON.parse(obj?.Drug)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="container bb">
                                                                                            <h6 className=' text-dark mt-2'>Drug Information</h6>
                                                                                            <div className="col-12 ">
                                                                                                {
                                                                                                    JSON.parse(obj?.Drug)?.map((item, key) => (
                                                                                                        <div className="row bb px-3 ">
                                                                                                            <div className="col-12 mb-2" >
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.SuspectedDrugType_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Drug Type</label>

                                                                                                                        </div>
                                                                                                                    </div>


                                                                                                                    {/* <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.PropertySourceDrugType_Desc}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Property Source Drug Type</label>

                                                                                                                        </div>
                                                                                                                    </div>*/}
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.MeasurementUnit_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Measurement Units</label>

                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.MeasurementType_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Measurement Type</label>

                                                                                                                        </div>
                                                                                                                    </div>


                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.EstimatedDrugQty}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Estimate Drug Qty</label>

                                                                                                                        </div>
                                                                                                                    </div>


                                                                                                                    {/* <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.FractionDrugQty}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Fraction Drug Qty</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.MeasurementType_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Measurement Type</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.SolidPounds}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Solid Pounds</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.SolidOunces}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Solid Ounces</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.SolidGrams}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Solid Grams</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.LiquidOunces}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Liquid Ounces</label>

                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.DoseUnits}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Dose Units</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item?.Items}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Items</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item?.MarijuanaType_Desc}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Type Marijuana Fields and Gardens</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item?.NumLabs}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Number Of Clandestine Labs Seized</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item?.NumFields}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Number Marijuana Fields and Gardens</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item?.DrugManufactured_Desc}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Type of Drug Manufactured</label>

                                                                                                                        </div>
                                                                                                                    </div> */}

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
                                                                        {/* Other */}
                                                                        <div className="col-12  bb" >
                                                                            {
                                                                                JSON.parse(obj?.Other)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="container bb">
                                                                                            <h6 className=' text-dark mt-2'>Other Information</h6>
                                                                                            <div className="col-12 ">
                                                                                                {
                                                                                                    JSON.parse(obj?.Other)?.map((item, key) => (
                                                                                                        <div className="row bb px-3 ">
                                                                                                            <div className="col-12 mb-2" >
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Brand}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Brand</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.SerialID}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Serial ID</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.TopColor_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.BottomColor_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.ModelID}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Model ID</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Quantity}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Quantity</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.QuantityUnit}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Quantity Unit</label>

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


                                                                        {/* Security */}
                                                                        <div className="col-12  bb" >
                                                                            {
                                                                                JSON.parse(obj?.Security)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="container bb">
                                                                                            <h6 className=' text-dark mt-2'>Security Information</h6>
                                                                                            <div className="col-12 ">
                                                                                                {
                                                                                                    JSON.parse(obj?.Security)?.map((item, key) => (
                                                                                                        <div className="row bb px-3 ">
                                                                                                            <div className="col-12 mb-2" >
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Denomination}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Denomination</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.IssuingAgency}
                                                                                                                            />

                                                                                                                            <label htmlFor="" className='new-summary'>Issuing Agency</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.MeasureType}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Measure Type</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.SecurityDtTm ? getShowingWithOutTime(item.SecurityDtTm) : ''}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Security Date</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.SerialID}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Serial ID</label>

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
                                                                        {/* Weapon */}
                                                                        <div className="col-12  bb" >
                                                                            {
                                                                                JSON.parse(obj?.weapon)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="container bb">
                                                                                            <h6 className=' text-dark mt-2'>Weapon Information</h6>
                                                                                            <div className="col-12 ">
                                                                                                {
                                                                                                    JSON.parse(obj?.weapon)?.map((item, key) => (
                                                                                                        <div className="row bb px-3 ">
                                                                                                            <div className="col-12 mb-2" >
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Style}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Style</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Finish}
                                                                                                                            />

                                                                                                                            <label htmlFor="" className='new-summary'>Finish</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Caliber}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Caliber</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Handle}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Handle</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.WeaponMake_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Weapon Make</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.PropertyModel_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Weapon Model</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.ManufactureYear}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Manufacture Year</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.BarrelLength}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Barrel Length</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                                                        <div className=''>
                                                                                                                            {/* <input
                                                                                                                                type="checkbox"
                                                                                                                                name=""
                                                                                                                                id=""
                                                                                                                                checked={item && Object.keys(obj).length > 0 ? item.IsAuto : false}
                                                                                                                                disabled={!item || Object.keys(item).length === 0}
                                                                                                                            /> */}
                                                                                                                            <input
                                                                                                                                type="checkbox"
                                                                                                                                checked={item?.IsAuto || false}
                                                                                                                                disabled={!item}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary pl-2'>Is Auto</label>

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
                                                                        {/* property notes */}
                                                                        <div className="col-12  bb">
                                                                            {
                                                                                JSON.parse(obj?.PropertyNotes)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="container bb">
                                                                                            <h6 className=' text-dark mt-2'>Property Notes Information</h6>
                                                                                            <div className="col-12 ">
                                                                                                {
                                                                                                    JSON.parse(obj?.PropertyNotes)?.map((item, key) => (
                                                                                                        <div className="row bb px-3 ">
                                                                                                            <div className="col-12 mb-2" >
                                                                                                                <div className="row ">

                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.OfficerName}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Officer Name</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                                        <label htmlFor="" className='new-summary'>Property Notes</label>

                                                                                                                        <div
                                                                                                                            className="readonlyColor  "
                                                                                                                            style={{
                                                                                                                                border: '1px solid #ccc',
                                                                                                                                borderRadius: '4px',
                                                                                                                                padding: '10px',
                                                                                                                                backgroundColor: '#f9f9f9',
                                                                                                                                lineBreak: 'anywhere'
                                                                                                                            }}
                                                                                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Notes) }}

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
                                                                        {/* RecoveredProperty */}
                                                                        <div className="col-12  bb" >
                                                                            {
                                                                                JSON.parse(obj?.RecoveredProperty)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="container bb">
                                                                                            <h6 className=' text-dark mt-2'>Recovered Property Information</h6>
                                                                                            <div className="col-12 ">
                                                                                                {
                                                                                                    JSON.parse(obj?.RecoveredProperty)?.map((item, key) => (
                                                                                                        <div className="row bb px-3 ">
                                                                                                            <div className="col-12 mb-2" >
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                value={item.Officer_Name}
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
                                                                                                                                value={item.RecoveryType_Des}
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
                                                                                                                                value={item.Disposition_Des}
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
                                                                            JSON.parse(obj?.Document)?.length > 0 ?
                                                                                <>
                                                                                    <div className="table-responsive" >
                                                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                            <p className="p-0 m-0 d-flex align-items-center">Property Document</p>
                                                                                        </div>
                                                                                        <table className="table table-bordered" >
                                                                                            <thead className='text-dark master-table'>
                                                                                                <tr>
                                                                                                    <th className='' style={{ width: '100px' }}>Document Name</th>
                                                                                                    <th className='' style={{ width: '100px' }}>Notes</th>
                                                                                                    <th className='' style={{ width: '100px' }}>Document Type</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody >
                                                                                                {
                                                                                                    JSON.parse(obj?.Document)?.map((item, key) => (
                                                                                                        <>
                                                                                                            <tr key={key}>
                                                                                                                <td style={{ width: '100px' }} className='text-list'>{item.DocumentName}</td>
                                                                                                                <td style={{ width: '100px' }} className='text-list'>{item.DocumentNotes}</td>
                                                                                                                <td style={{ width: '100px' }} className='text-list'>{item.Description_Document}</td>
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
                                                                        {/* vehicle-recoverd */}

                                                                        {
                                                                            JSON.parse(obj?.Owner)?.length > 0 ?
                                                                                <>
                                                                                    <div className="table-responsive" >
                                                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                            <p className="p-0 m-0 d-flex align-items-center">Property Owner Information:</p>
                                                                                        </div>
                                                                                        <table className="table " >
                                                                                            <thead className='text-dark master-table'>
                                                                                                <tr>
                                                                                                    <th className=''>Owner Name</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody >
                                                                                                {
                                                                                                    JSON.parse(obj?.Owner)?.map((item, key) => (
                                                                                                        <>
                                                                                                            <tr key={key} >
                                                                                                                <td className='text-list'>{item.Owner_Name}</td>
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
                                                                        {/* property room */}
                                                                        {
                                                                            JSON.parse(obj?.PropertyRoom)?.length > 0 ?
                                                                                <>
                                                                                    <div className="table-responsive" >
                                                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                            <p className="p-0 m-0 d-flex align-items-center">Property Room Information:</p>
                                                                                        </div>
                                                                                        <table className="table " >
                                                                                            <thead className='text-dark master-table'>
                                                                                                <tr>
                                                                                                    <th className=''>Activity</th>
                                                                                                    <th className=''>Activity Reason</th>
                                                                                                    <th className=''>Date/Time</th>
                                                                                                    <th className=''>Officer Name</th>
                                                                                                    <th className=''>Other Person Name</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody >
                                                                                                {
                                                                                                    JSON.parse(obj?.PropertyRoom)?.map((item, key) => (
                                                                                                        <>
                                                                                                            <tr key={key} >
                                                                                                                <td className='text-list'>{item.Status}</td>
                                                                                                                <td className='text-list'>{item.ActivityReason_Des}</td>
                                                                                                                <td className='text-list'>{item.ReleaseDate ? getShowingDateText(item.ReleaseDate) : ''}</td>
                                                                                                                <td className='text-list'>{item.Officer_Name}</td>
                                                                                                                <td className='text-list'>{item.OtherPersonName_Name}</td>
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


                                                                        {/* property offence */}
                                                                        {
                                                                            JSON.parse(obj?.PropertyOffense)?.length > 0 ?
                                                                                <>
                                                                                    <div className="table-responsive bb" >
                                                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                            <p className="p-0 m-0 d-flex align-items-center">Property Offense:</p>
                                                                                        </div>
                                                                                        <table className="table " >
                                                                                            <thead className='text-dark master-table'>
                                                                                                <tr>
                                                                                                    <th className='' style={{ width: '200px' }}>TIBRS Code</th>
                                                                                                    <th className='' style={{ width: '200px' }}>Offense Code/Name</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody >
                                                                                                {
                                                                                                    JSON.parse(obj?.PropertyOffense)?.map((item, key) => (
                                                                                                        <>
                                                                                                            <tr key={key} >
                                                                                                                <td className='text-list' style={{ width: '200px' }}>{item.NIBRSCode}</td>
                                                                                                                <td className='text-list' style={{ width: '200px' }}>{item.Offense_Description}</td>
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


                                                                        {/* property TRANSACTION */}
                                                                        {
                                                                            JSON.parse(obj?.TransactionLog)?.length > 0 ?
                                                                                <>
                                                                                    <div className="table-responsive" >
                                                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                            <p className="p-0 m-0 d-flex align-items-center">Transaction Information:</p>
                                                                                        </div>
                                                                                        <table className="table " >
                                                                                            <thead className='text-dark master-table'>
                                                                                                <tr>
                                                                                                    <th className=''>Transaction Name</th>
                                                                                                    <th className=''>Transaction Number</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody >
                                                                                                {
                                                                                                    JSON.parse(obj?.TransactionLog)?.map((item, key) => (
                                                                                                        <>
                                                                                                            <tr key={key} >
                                                                                                                <td className='text-list'>{item.TransactionName}</td>
                                                                                                                <td className='text-list'>{item.TransactionNumber}</td>
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


                                                                        <div className="table-responsive">
                                                                            <h5 className="text-white text-bold bg-green py-1 px-3">Property Image:</h5>
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

export default MasterPropertyReport