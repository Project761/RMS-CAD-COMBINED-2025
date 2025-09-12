import React, { useContext, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import { customStylesWithOutColor, Decrypt_Id_Name, filterPassedDateTime, filterPassedTime, getShowingDateText, getShowingMonthDateYear } from '../../../Common/Utility';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat, threeColArray, threeColArrayWithCode } from '../../../Common/ChangeArrayFormat';
import SelectBox from '../../../Common/SelectBox';
import Select from "react-select";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_AgencyOfficer_Data, get_Incident_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import Location from '../../../Location/Location';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';

const IncidentSearchPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const fbiCodesDrpData = useSelector((state) => state.DropDown.fbiCodesDrpData);
    const receiveSourceDrpData = useSelector((state) => state.DropDown.receiveSourceDrpData);
    const cadCfsCodeDrpData = useSelector((state) => state.DropDown.cadCfsCodeDrpData);
    const rmsDispositionDrpData = useSelector((state) => state.DropDown.rmsDispositionDrpData);
    const cadDispositionDrpData = useSelector((state) => state.DropDown.cadDispositionDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);


    const { exceptionalClearID, GetDataExceptionalClearanceID, setIncidentSearchData, setIncAdvSearchData, GetDataTimeZone, datezone, recentSearchData, setRecentSearchData } = useContext(AgencyContext);

    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [typeOfSecurityID, setTypeOfSecurityID] = useState([]);
    const [pinActivityID, setPinActivityID] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [offenceCodeArray, setOffenceCodeArray] = useState([]);
    //location
    const [locationStatus, setLocationStatus] = useState();
    const [updateStatus, setUpdateStatus] = useState(0);
    const [onSelectLocation, setOnSelectLocation] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [changeStatus, setChangesStatus] = useState(false);
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [loginPinID, setLoginPINID] = useState('');
    // Law Title
    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    //NIBRS Code
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    // Offense Code/Name
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [incidentStatusDrpDwn, setIncidentStatusDrpDwn] = useState([]);

    const [value, setValue] = useState({
        'ReportedDate': '', 'LawTitleId': '', 'RMSDispositionId': '', 'RMSCFSCodeID': '', 'IncidentNumber': '', 'IncidentNumberTo': '', 'MasterIncidentNumber': '',
        'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'ReportedDateTo': '', 'IncidentSecurityID': '', 'PINID': '', 'FBIID': '', 'AgencyID': '',
        'DispositionDate': '', 'DispositionDateTo': '', 'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityIDlist': '', 'CADCFSCodeID': '', 'DispositionComments': '', 'CrimeLocation': '',
        'MasterIncidentNoFrom': '', 'MasterIncidentNoTo': '', 'OfficerPINID': "", 'CategoryID': '', 'CaseStatusID': '',
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'ReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK, isAllAgencies: false,
        isSelfAgency: true
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPINID(localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("I096", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            // lawtitle dpr
            LawTitleIdDrpDwnVal(loginAgencyID); CategoryDrpDwnVal(loginAgencyID); NIBRSCodeDrpDwnVal(loginAgencyID, 0);
            dispatch(get_AgencyOfficer_Data(loginAgencyID, '')); GetDataTypeOfSecurity(loginAgencyID)
            if (cadDispositionDrpData?.length === 0) { dispatch(get_Incident_Drp_Data(loginAgencyID)) }
            if (exceptionalClearID.length === 0) { GetDataExceptionalClearanceID(loginAgencyID); }
            getChargeCodeIDDrp(loginAgencyID); getIncidentStatus(loginAgencyID);
        }
        GetDataPinActivity();
    }, [loginAgencyID]);

    const LawTitleIdDrpDwnVal = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('LawTitle/GetDataDropDown_LawTitle', val).then((data) => {
            if (data) {
                setLawTitleIdDrp(Comman_changeArrayFormat(data, 'LawTitleID', 'Description'))
            }
            else { setLawTitleIdDrp([]); }
        })
    }

    const NIBRSCodeDrpDwnVal = (loginAgencyID, LawTitleID) => {
        const val = { AgencyID: loginAgencyID, 'LawTitleID': LawTitleID, }
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
            if (data) {
                setNibrsCodeDrp(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
            }
            else { setNibrsCodeDrp([]); }
        })
    }
    const CategoryDrpDwnVal = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('ChargeCategory/GetDataDropDown_ChargeCategory', val).then((data) => {
            if (data) {
                setCategoryIdDrp(Comman_changeArrayFormat(data, 'ChargeCategoryID', 'Description'))
            }
            else { setCategoryIdDrp([]); }
        })
    }
    const getChargeCodeIDDrp = (NIBRSCodeId, loginAgencyID, LawTitleID) => {
        const val = { 'FBIID': NIBRSCodeId, 'AgencyID': loginAgencyID, 'LawTitleID': LawTitleID ? LawTitleID : 0, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            }
            else { setChargeCodeDrp([]); }
        })
    }

    const onChangeDrpLawTitle = (e, name) => {
        if (e) {
            if (name === "LawTitleId") {
                setValue({ ...value, ['LawTitleId']: e.value, ['NIBRSCodeId']: null, ['RMSCFSCodeID']: '', ['RMSCFSCodeList']: '', ['FBIID']: '' })
                setOffenceCodeArray([]); setOffenceCodeArray([]); setChargeCodeDrp([]); NIBRSCodeDrpDwnVal(loginAgencyID, e.value); getChargeCodeIDDrp(value?.NIBRSCodeId, loginAgencyID, e.value);
            } else if (name === 'FBIID') {
                setValue({ ...value, ['FBIID']: e.value, ['RMSCFSCodeID']: '', ['RMSCFSCodeList']: '', });
                setOffenceCodeArray([]); setChargeCodeDrp([]);
                getChargeCodeIDDrp(e.value, loginAgencyID, value?.LawTitleId);
            }
        } else {
            if (name === "LawTitleId") {
                setValue({ ...value, ['LawTitleId']: null, ['NIBRSCodeId']: '', ['RMSCFSCodeID']: '', ['RMSCFSCodeList']: '', ['FBIID']: '' });
                setNibrsCodeDrp([]); setOffenceCodeArray([]); setChargeCodeDrp([]); NIBRSCodeDrpDwnVal(loginAgencyID, 0);
                getChargeCodeIDDrp(value?.NIBRSCodeId, loginAgencyID, 0);
            } else if (name === 'FBIID') {
                setValue({ ...value, ['FBIID']: '', ['RMSCFSCodeID']: '', ['RMSCFSCodeList']: '', });
                setOffenceCodeArray([]); setChargeCodeDrp([]); getChargeCodeIDDrp(0, loginAgencyID, value?.LawTitleId);
            }
        }
    }

    const getRmsCfsCodeID = (FBIID) => {
        const val = { 'FBIID': FBIID, 'AgencyID': null, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            }
            else { setRmsCfsID([]); }
        })
    }

    const GetDataTypeOfSecurity = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID, }
        fetchPostData('IncidentSecurity/GetDataDropDown_IncidentSecurity', val).then((data) => {
            if (data) {
                setTypeOfSecurityID(Comman_changeArrayFormat(data, 'SecurityId', 'Description'))
            }
            else { setTypeOfSecurityID([]); }
        })
    }

    const GetDataPinActivity = () => {
        const val = { 'AgencyID': loginAgencyID }
        fetchPostData('PINActivity/GetData_PINActivityType', val).then((data) => {
            setPinActivityID(Comman_changeArrayFormat(data, 'ActivityTypeID', 'Description'));
        })
    }

    function hasValues(obj) {
        for (let key in obj) {
            if (key != 'AgencyID') {
                if (obj[key]) {
                    return true;
                }
            }
        }
        return false;
    }

    const getIncidentSearchData = async () => {
        const {
            PINID, ReportedDate, RMSDispositionId, RMSCFSCodeID, IncidentNumber, IncidentNumberTo, MasterIncidentNumber, MasterIncidentNumberTo, RMSCFSCodeList, OccurredFrom, OccurredFromTo,
            IncidentSecurityID, FBIID, AgencyID, DispositionDate, DispositionDateTo, ReceiveSourceID, NIBRSClearanceID, IncidentPINActivityID, ReportedDateTo, IncidentSecurityIDlist, CADCFSCodeID, DispositionComments, CrimeLocation, LawTitleId, OfficerPINID, CategoryID,
            IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, isSelfAgency, isAllAgencies, CaseStatusID
        } = myStateRef.current
        const val = {
            'PINID': loginPinID, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'RMSDispositionId': RMSDispositionId, 'IncidentNumber': IncidentNumber?.trim(), 'IncidentNumberTo': IncidentNumberTo,
            'MasterIncidentNumber': MasterIncidentNumber?.trim(), 'MasterIncidentNumberTo': MasterIncidentNumberTo, 'DispositionDate': DispositionDate, 'DispositionDateTo': DispositionDateTo,
            'ReceiveSourceID': ReceiveSourceID, 'IncidentPINActivityID': IncidentPINActivityID, 'RMSCFSCodeList': RMSCFSCodeList, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'LawTitleId': LawTitleId,
            'NIBRSClearanceID': NIBRSClearanceID, 'IncidentSecurityID': IncidentSecurityID, 'RMSCFSCodeID': RMSCFSCodeID, 'FBIID': FBIID, 'IncidentSecurityIDlist': IncidentSecurityIDlist, 'CADCFSCodeID': CADCFSCodeID, 'DispositionComments': DispositionComments?.trim(), 'CrimeLocation': CrimeLocation, 'OfficerPINID': OfficerPINID, 'CategoryID': CategoryID,
            'IPAddress': IPAddress, 'UserID': loginPinID, 'SearchCriteria': SearchCriteria, 'SearchCriteriaJson': SearchCriteriaJson,
            'ReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK, 'CaseStatusID': CaseStatusID,
            "AgencyID":
                isSelfAgency && isAllAgencies
                    ? loginAgencyID
                    : isAllAgencies
                        ? ""
                        : loginAgencyID,
            "SearchFlag":
                (isSelfAgency && isAllAgencies) ||
                (isAllAgencies && !isSelfAgency),
        }

        if (hasValues(val)) {
            fetchPostData('Incident/Search_Incident', val).then((res) => {
                if (res.length > 0) {
                    setIncidentSearchData(res); setIncAdvSearchData(true); reset_Fields(); navigate('/incident');
                    // Add to Recent Search
                    setRecentSearchData([...recentSearchData, { ...val, "SearchModule": "Inc-Search" }]);
                } else {
                    toastifyError("Data Not Available"); setIncidentSearchData([]);
                    setIsPermissionsLoaded(false);
                    // Remove from Recent Search
                    // setRecentSearchData([...recentSearchData, { ...val, "SearchModule": "Inc-Search" }]);
                }
            });
        } else { toastifyError("Please Enter Details"); }
    }

    const HandleChange = (e,) => {
        // if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
        //     let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
        //     if (ele.length === 8) {
        //         const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
        //         const match = cleaned.match(/^(\d{2})(\d{6})$/);
        //         if (match) { setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] }) }
        //     } else {
        //         ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
        //         setValue({ ...value, [e.target.name]: ele })
        //         if (ele?.length == 0) { e.target.name == 'IncidentNumber' && setValue({ ...value, ['IncidentNumberTo']: "", [e.target.name]: ele }) }
        //     }
        // }
        if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'IncidentNumber' && setValue({
                    ...value, ['IncidentNumberTo']: "", [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'isSelfAgency' || e.target.name === 'isAllAgencies') {
            setValue({ ...value, [e.target.name]: e.target.checked })
        }
        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    }

    const changeDropDown = (e, name) => {
        if (e) {
            if (name === "RMSCFSCodeID") {
                setValue({ ...value, [name]: e.value })
            }
            else if (name === 'FBIID') {
                getRmsCfsCodeID(e.value); setValue({ ...value, [name]: e.value, ['RMSCFSCodeID']: '', });
            }
            else if (name === 'NIBRSClearanceID') {
                if (e.id != 'N') {
                    setValue({ ...value, [name]: e.value, ['NIBRSclearancedate']: getShowingMonthDateYear(new Date()), });
                } else {
                    setValue({ ...value, [name]: e.value, ['NIBRSclearancedate']: '', });
                }
            } else {
                setValue({ ...value, [name]: e.value, })
            }
        } else if (e === null) {
            if (name === "RMSDispositionId") {
                setValue({ ...value, [name]: null, ['NIBRSClearanceID']: null, ['DispositionDate']: '', ['NIBRSclearancedate']: '', });
            }
            else if (name === 'FBIID') {
                setValue({ ...value, ['FBIID']: "", ['RMSCFSCodeID']: '', ['RMSCFSCodeList']: '' })
                setRmsCfsID([]);
                setOffenceCodeArray([]);
            }
            else if (name === 'NIBRSClearanceID') {
                setValue({ ...value, [name]: null, ['NIBRSclearancedate']: "", });
            } else {
                setValue({ ...value, [name]: null });
            }
        } else {
            setValue({ ...value, [name]: null });
        }
    }

    const RMSCFSDropDown = (e, name) => {
        if (e) {
            if (name === 'RMSCFSCodeList') {
                setOffenceCodeArray(e)
                const ids = []
                e.forEach(({ value }) => ids.push(value))
                setValue({ ...value, [name]: JSON.stringify(ids) })
            } else if (name === 'IncidentSecurityIDlist') {
                const ids = []
                e.forEach(({ value }) => ids.push(value))
                setValue({ ...value, [name]: JSON.stringify(ids) })
            } else { setValue({ ...value, [name]: e.value, }) }
        }
        else { setValue({ ...value, [name]: null, }) }
    }

    const reset_Fields = () => {
        setIsPermissionsLoaded(false);
        setValue({
            ...value,
            'ReportedDate': '', 'RMSDispositionId': '', 'RMSCFSCodeID': '', 'IncidentNumber': '', 'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '',
            'RMSCFSCodeList': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'ReportedDateTo': '', 'IncidentSecurityID': '', 'PINID': '', 'FBIID': '', 'AgencyID': '', 'CaseStatusID': '',
            'DispositionDate': '', 'DispositionDateTo': '', 'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityIDlist': '', 'CADCFSCodeID': '', 'DispositionComments': '', 'CrimeLocation': '', 'OfficerPINID': '', 'CategoryID': '', isAllAgencies: false,
            isSelfAgency: true
        }); setOffenceCodeArray([])
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles, height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();
    const startRef5 = React.useRef();
    const startRef6 = React.useRef();
    const startRef7 = React.useRef();
    const startRef8 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
            startRef5.current.setOpen(false);
            startRef6.current.setOpen(false);
            startRef7.current.setOpen(false);
            startRef8.current.setOpen(false);
        }
    };
    //harsh 
    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("I096", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {

        if (isPermissionsLoaded) {
            getIncidentSearchData();
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

    const getIncidentStatus = async (AgencyID) => {
        try {
            await fetchPostData("IncidentStatus/GetDataDropDown_IncidentStatus", { 'AgencyID': AgencyID }).then((res) => {
                if (res?.length > 0) {
                    setIncidentStatusDrpDwn(threeColArray(res, "IncidentStatusID", "Description", "IncidentStatusCode"));
                } else {
                    setIncidentStatusDrpDwn([]);
                }
            })
        } catch (error) {
            console.log("Error in getIncidentStatus: ", error);
            setIncidentStatusDrpDwn([]);
        }
    };

    const handleCaseStatus = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value, NIBRSStatus: e.label, CaseStatusCode: e.id });
        }
        else {
            setValue({ ...value, [name]: null, NIBRSStatus: '', CaseStatusCode: '' });
        }
    }

    return (
        <div className=" section-body  p-1 bt" >
            <div className="div">
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency ">
                            <div className="card-body" >
                                <div className="btn-box text-right  mr-1 mb-2">
                                    {
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { getIncidentSearchData(); }}>Search</button>
                                            : <></> :
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { getIncidentSearchData(); }}>Search</button>
                                    }
                                    <Link to={'/incident'}>
                                        <button type="button" className="btn btn-sm btn-success mr-1" >Close</button>
                                    </Link>
                                </div>
                                <div className="col-12 row my-2 ml-3">
                                    <div className="row align-items-center px-1 mt-2 mb-2">
                                        <div className="col-auto mt-1">
                                            <label className="new-label">Search with Agency</label>
                                        </div>
                                        <div className="col-auto d-flex align-items-center" style={{ gap: '5px' }}>
                                            <input
                                                type="checkbox"
                                                id="isSelfAgency"
                                                name="isSelfAgency"
                                                checked={value.isSelfAgency}
                                                onChange={HandleChange}
                                            />
                                            <label htmlFor="isSelfAgency" className="tab-form-label mb-0">
                                                Self Agency
                                            </label>
                                        </div>
                                        <div className="col-auto d-flex align-items-center" style={{ gap: '5px' }}>
                                            <input
                                                type="checkbox"
                                                id="isAllAgencies"
                                                name="isAllAgencies"
                                                checked={value.isAllAgencies}
                                                onChange={HandleChange}
                                            />
                                            <label htmlFor="isAllAgencies" className="tab-form-label mb-0">
                                                All Agencies
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row ">
                                    <div className="col-12 ">
                                        <fieldset style={{ marginTop: '-15px' }}>
                                            <legend>Incident Search</legend>

                                            <div className="row px-1">
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Incident Number From</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 text-field ">
                                                    <input type="text" id='IncidentNumber' name='IncidentNumber' value={value?.IncidentNumber} onChange={HandleChange} />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Incident Number To</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 text-field ">
                                                    <input type="text" id='IncidentNumberTo'
                                                        name='IncidentNumberTo' value={value?.IncidentNumberTo}
                                                        disabled={!value?.IncidentNumber?.trim()}
                                                        className={!value?.IncidentNumber?.trim() ? 'readonlyColor' : ''}
                                                        onChange={HandleChange} />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Master&nbsp;Incident&nbsp;No.&nbsp;From</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 text-field ">
                                                    <input type="text" id='MasterIncidentNumber' value={value?.MasterIncidentNumber} onChange={HandleChange} name='MasterIncidentNumber' />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Master Incident No. To</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 text-field ">
                                                    <input type="text" id='MasterIncidentNumberTo' disabled={!value?.MasterIncidentNumber?.trim()} className={!value?.MasterIncidentNumber?.trim() ? 'readonlyColor' : ''} name='MasterIncidentNumberTo' />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Occurred From Date</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <DatePicker
                                                        name='OccurredFrom'
                                                        id='OccurredFrom'
                                                        ref={startRef2}
                                                        // onKeyDown={onKeyDown}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e?.preventDefault();
                                                            }
                                                            else { onKeyDown(e); }
                                                        }}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null, ['OccurredFromTo']: null })
                                                            } else {
                                                                setValue({ ...value, ['OccurredFrom']: null, ['OccurredFromTo']: null })
                                                            }
                                                        }}
                                                        selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        isClearable={value?.OccurredFrom ? true : false}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date(datezone)}
                                                        placeholderText='Select...'
                                                        filterTime={filterPassedTime}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <babel htmlFor="" className='new-label'>Occurred To Date</babel>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <DatePicker
                                                        id='OccurredFromTo'
                                                        name='OccurredFromTo'
                                                        ref={startRef3}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e?.preventDefault();
                                                            }
                                                            else { onKeyDown(e); }
                                                        }}
                                                        onChange={(date) => { setValue({ ...value, ['OccurredFromTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={value?.OccurredFromTo ? true : false}
                                                        selected={value?.OccurredFromTo && new Date(value?.OccurredFromTo)}
                                                        minDate={new Date(value?.OccurredFrom)}
                                                        maxDate={new Date(datezone)}
                                                        placeholderText={'Select...'}
                                                        autoComplete="off"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        dropdownMode="select"
                                                        disabled={!value?.OccurredFrom}
                                                        className={!value?.OccurredFrom ? 'readonlyColor' : ''}
                                                        filterTime={(time) => filterPassedDateTime(time, value?.OccurredFromTo, value?.OccurredFrom)}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Reported From Date</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <DatePicker
                                                        name='ReportedDate'
                                                        id='ReportedDate'
                                                        ref={startRef}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e?.preventDefault();
                                                            }
                                                            else { onKeyDown(e); }
                                                        }}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null, ['ReportedDateTo']: null })
                                                            } else {
                                                                setValue({ ...value, ['ReportedDate']: null, ['ReportedDateTo']: null })
                                                            }
                                                        }}
                                                        selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={value?.ReportedDate ? true : false}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date(datezone)}
                                                        placeholderText='Select...'
                                                        filterTime={filterPassedTime}

                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Reported To Date</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <DatePicker
                                                        name='ReportedDateTo'
                                                        id='ReportedDateTo'
                                                        onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                        selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                        dateFormat="MM/dd/yyyy"
                                                        ref={startRef1}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e?.preventDefault();
                                                            }
                                                            else { onKeyDown(e); }
                                                        }}
                                                        isClearable={value?.ReportedDateTo ? true : false}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date(datezone)}
                                                        placeholderText='Select...'
                                                        minDate={new Date(value?.ReportedDate)}
                                                        disabled={!value?.ReportedDate}
                                                        className={!value?.ReportedDate ? 'readonlyColor' : ''}
                                                        filterTime={(time) => filterPassedDateTime(time, value?.ReportedDateTo, value?.ReportedDate)}

                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                    <label htmlFor="" className='new-label'>Location</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-9 mt-1 text-field">
                                                    <Location
                                                        {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setChangesStatus, setStatesChangeStatus }}
                                                        col='CrimeLocation'
                                                        locationID='crimelocationid'
                                                        check={false}
                                                        verify={true}
                                                        style={{ resize: 'both' }}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Law Title</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <Select
                                                        name='LawTitleId'
                                                        styles={colourStyles}
                                                        value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                                                        options={lawTitleIdDrp}
                                                        isClearable
                                                        onChange={(e) => onChangeDrpLawTitle(e, 'LawTitleId')}
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>TIBRS Code</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <Select
                                                        name='FBIID'
                                                        styles={colourStyles}
                                                        value={nibrsCodeDrp?.filter((obj) => obj.value === value?.FBIID)}
                                                        options={nibrsCodeDrp}
                                                        isClearable
                                                        onChange={(e) => onChangeDrpLawTitle(e, 'FBIID')}
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'> Offense Code/Name </label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-9 mt-2 ">
                                                    <SelectBox
                                                        name='RMSCFSCodeList'
                                                        defaultValue
                                                        value={offenceCodeArray}
                                                        isMulti
                                                        options={chargeCodeDrp}
                                                        isClearable
                                                        onChange={(e) => RMSCFSDropDown(e, 'RMSCFSCodeList')}
                                                        placeholder="Select..."
                                                        // isDisabled={value?.FBIID || value?.LawTitleId ? false : true}
                                                        className={!value?.FBIID ? 'readonlyColor' : ''}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Category</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-9 mt-2 ">
                                                    <Select
                                                        name='CategoryID'
                                                        styles={customStylesWithOutColor}
                                                        value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                                        isClearable
                                                        options={categoryIdDrp}
                                                        onChange={(e) => changeDropDown(e, 'CategoryID')}
                                                        placeholder="Select..."
                                                    />
                                                </div>

                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>CAD CFS Code</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-9 mt-2 ">
                                                    <Select
                                                        name='CADCFSCodeID'
                                                        value={cadCfsCodeDrpData?.filter((obj) => obj.value === value?.CADCFSCodeID)}
                                                        isClearable
                                                        menuPlacement='top'
                                                        options={cadCfsCodeDrpData}
                                                        onChange={(e) => changeDropDown(e, 'CADCFSCodeID')}
                                                        placeholder="Select..."
                                                        styles={customStylesWithOutColor}
                                                    />
                                                </div>
                                                {/* <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Type Of Security</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <Select
                                                        name='IncidentSecurityIDlist'
                                                        defaultValue={[]}
                                                        isMulti
                                                        options={typeOfSecurityID}
                                                        isClearable
                                                        onChange={(e) => RMSCFSDropDown(e, 'IncidentSecurityIDlist')}
                                                        placeholder="Select..."
                                                    />
                                                </div> */}
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>How Reported</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <Select
                                                        name='ReceiveSourceID'
                                                        value={receiveSourceDrpData?.filter((obj) => obj.value === value?.ReceiveSourceID)}
                                                        isClearable
                                                        options={receiveSourceDrpData}
                                                        menuPlacement='top'
                                                        onChange={(e) => changeDropDown(e, 'ReceiveSourceID')}
                                                        placeholder="Select..."
                                                        styles={colourStyles}
                                                    />
                                                </div>
                                                <div className='col-3 col-md-3 col-lg-1'></div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Officer</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <Select
                                                        name='OfficerPINID'
                                                        styles={colourStyles}
                                                        menuPlacement='top'
                                                        value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerPINID)}
                                                        isClearable
                                                        options={agencyOfficerDrpData}
                                                        onChange={(e) => changeDropDown(e, 'OfficerPINID')}
                                                        placeholder="Select..."

                                                    />
                                                </div>


                                                <div className="col-3 col-md-3 col-lg-2 mt-2 text-right">
                                                    <label htmlFor="" className='new-label'> Case Status</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3 mt-1">
                                                    <Select
                                                        name="CaseStatusID"
                                                        // styles={Requiredcolou}
                                                        value={incidentStatusDrpDwn?.filter((obj) => obj.value === value?.CaseStatusID)}
                                                        isClearable
                                                        menuPlacement='top'
                                                        options={incidentStatusDrpDwn}
                                                        onChange={(e) => handleCaseStatus(e, "CaseStatusID")}
                                                        placeholder="Select..."
                                                    />
                                                </div>

                                                {/* <div className='col-3 col-md-3 col-lg-1'>
                                                    <label htmlFor="" className='new-label'>Pin Activity</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <Select
                                                        name='IncidentPINActivityID'
                                                        styles={colourStyles}
                                                        value={pinActivityID?.filter((obj) => obj.value === value?.IncidentPINActivityID)}
                                                        options={pinActivityID}
                                                        isClearable
                                                        onChange={(e) => changeDropDown(e, 'IncidentPINActivityID')}
                                                        placeholder="Select..."
                                                    />
                                                </div> */}


                                                {/* <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                    <label htmlFor="" className='new-label'>Description</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-9 mt-1 text-field">
                                                    <input type="text" name='DispositionComments' className='' value={value.DispositionComments} onChange={HandleChange} />
                                                </div> */}
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12">
                                        <fieldset >
                                            <legend>Clearance Information</legend>
                                            <div className="row px-1">
                                                <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Exceptional Clearance (Yes/No)</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <Select
                                                        name='RMSDispositionId'
                                                        value={rmsDispositionDrpData?.filter((obj) => obj.value === value?.RMSDispositionId)}
                                                        isClearable
                                                        options={rmsDispositionDrpData}
                                                        onChange={(e) => changeDropDown(e, 'RMSDispositionId')}
                                                        placeholder="Select..."
                                                        styles={colourStyles}
                                                        menuPlacement='top'
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Exceptional Clearance Code</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <Select
                                                        name='NIBRSClearanceID'
                                                        value={exceptionalClearID?.filter((obj) => obj.value === value?.NIBRSClearanceID)}
                                                        isClearable
                                                        options={exceptionalClearID}
                                                        onChange={(e) => changeDropDown(e, 'NIBRSClearanceID')}
                                                        placeholder="Select..."
                                                        styles={colourStyles}
                                                        menuPlacement='top'
                                                    />
                                                </div>
                                                {/* <div className="col-3 col-md-3 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Disposition From Date </label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                    <DatePicker
                                                        id='DispositionDate'
                                                        name='DispositionDate'
                                                        ref={startRef6}
                                                        // onKeyDown={onKeyDown}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e?.preventDefault();
                                                            } else {
                                                                onKeyDown(e);
                                                            }
                                                        }}
                                                        onChange={(date) => {
                                                            setValue({
                                                                ...value,
                                                                ['DispositionDate']: date ? getShowingMonthDateYear(date) : null, ['DispositionDateTo']: date ? value.DispositionDateTo : null, ['DispositionDateTo']: null
                                                            })
                                                        }}
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={value?.DispositionDate ? true : false}
                                                        selected={value?.DispositionDate && new Date(value?.DispositionDate)}
                                                        maxDate={new Date()}
                                                        placeholderText={'Select...'}
                                                        showDisabledMonthNavigation
                                                        autoComplete="off"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        dropdownMode="select"
                                                    />
                                                </div> */}

                                                {/* <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Disposition To Date </label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                    <DatePicker
                                                        id='DispositionDateTo'
                                                        name='DispositionDateTo'
                                                        ref={startRef7}
                                                        // onKeyDown={onKeyDown}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e?.preventDefault();
                                                            } else {
                                                                onKeyDown(e);
                                                            }
                                                        }}
                                                        onChange={(date) => { setValue({ ...value, ['DispositionDateTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={value?.DispositionDateTo ? true : false}
                                                        // disabled={value?.DispositionDate ? false : true}
                                                        selected={value?.DispositionDateTo && new Date(value?.DispositionDateTo)}
                                                        maxDate={new Date()}
                                                        minDate={new Date(value?.DispositionDate)}
                                                        placeholderText={'Select...'}
                                                        showDisabledMonthNavigation
                                                        autoComplete="off"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        dropdownMode="select"
                                                        disabled={!value?.DispositionDate}
                                                        className={!value?.DispositionDate ? 'readonlyColor' : ''}
                                                    />
                                                </div> */}

                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="btn-box text-right  mr-1 mb-2">
                                {
                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { getIncidentSearchData(); }}>Search</button>
                                        : <></> :
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { getIncidentSearchData(); }}>Search</button>
                                }
                                <Link to={'/incident'}>
                                    <button type="button" className="btn btn-sm btn-success mr-1" >Close</button>
                                </Link>
                            </div> */}
                            {/* <div className="btn-box text-right  mr-1 mb-2">
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { getIncidentSearchData(); }}>Search</button>
                                <Link to={'/incident'}>
                                    <button type="button" className="btn btn-sm btn-success mr-1" >Close</button>
                                </Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default IncidentSearchPage

