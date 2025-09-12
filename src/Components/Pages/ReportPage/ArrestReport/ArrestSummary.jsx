import React, { useContext, useRef } from 'react'
import img from '../../../../../src/img/images1.jpg'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../Common/Utility';
import Select from "react-select";
import { useEffect } from 'react';
import { fetchData, fetchPostData } from '../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../Common/ChangeArrayFormat';
import { get_Incident_Drp_Data, get_NIBRS_Drp_Data } from '../../../../redux/actions/DropDownsData';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';


const ArrestSummary = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const fbiCodesDrpData = useSelector((state) => state.DropDown.fbiCodesDrpData);
    const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);

    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { GetDataTimeZone, datezone, } = useContext(AgencyContext);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const [reportData, setReportData] = useState([]);
    const [verifyArrestMaster, setverifyArrestMaster] = useState(false);
    const [Arrestfromdate, setArrestfromdate] = useState('')
    const [ArrestTodate, setArrestTodate] = useState('')
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [zipList, setZipList] = useState([]);
    const [multiImage, setMultiImage] = useState([]);
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [loder, setLoder] = useState(false);
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);


    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    //NIBRS Code
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    // Offense Code/Name
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(nibrsCodeDrp);

    const [value, setValue] = useState({
        AgencyID: '', ArrestNumber: '', ArrestNumberTo: '', ArrestDtTmTo: '', ArrestDtTm: '', NameIDNumber: '', PrimaryOfficerID: '', LawTitleId: '',
        LastName: '', FirstName: '', MiddleName: '', SexID: '', RMSCFSCodeList: '', FBIID: '', AgeFrom: '', AgeTo: '',
        IPAddress: '', UserID: LoginPinID, SearchCriteria: '', SearchCriteriaJson: '', FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status: '', ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,

    });
    const [searchValue, setSearchValue] = useState({
        ArrestNumber: '', ArrestNumberTo: '', ArrestDtTmTo: '', ArrestDtTm: '', NameIDNumber: '', PrimaryOfficerID: null, LastName: '', FirstName: '', MiddleName: '', SexID: null, RMSCFSCodeList: null, FBIID: null, AgeFrom: '', AgeTo: '', LawTitleId: '',
    });

    const [showFields, setShowFields] = useState({

        showArrestNumber: false, showArrestNumberTo: false, showArrestDtTm: false, showArrestDtTmTo: false, showNameIDNumber: false, showPrimaryOfficerID: false, showLastName: false, showFirstName: false, showMiddleName: false, showSexID: false, showRMSCFSCodeList: false, showFBIID: false, showAgeFrom: false, showAgeTo: false, showLawTitleId: false,
    });

    useEffect(() => {
        setShowFields({
            showArrestNumber: searchValue.ArrestNumber, showArrestNumberTo: searchValue.ArrestNumberTo, showArrestDtTm: searchValue.ArrestDtTm, showArrestDtTmTo: searchValue.ArrestDtTmTo, showNameIDNumber: searchValue.NameIDNumber, showPrimaryOfficerID: searchValue.PrimaryOfficerID !== null, showLastName: searchValue.LastName, showFirstName: searchValue.FirstName, showMiddleName: searchValue.MiddleName, showSexID: searchValue.SexID !== null, showRMSCFSCodeList: searchValue.RMSCFSCodeList !== null, showFBIID: searchValue.FBIID !== null, showAgeFrom: searchValue.AgeFrom, showAgeTo: searchValue.AgeTo, showLawTitleId: searchValue.LawTitleId
        });
    }, [searchValue]);

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            } else {
                setHeadOfAgency([])
            }
        })
    };

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); GetDataTimeZone(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            setLoginUserName(localStoreData?.UserName);
            dispatch(get_ScreenPermissions_Data("A110", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (LoginAgencyID) {
            get_Head_Of_Agency(LoginAgencyID); GetSexIDDrp(LoginAgencyID); getAgencyImg(LoginAgencyID);
            if (NIBRSDrpData?.length === 0) { dispatch(get_NIBRS_Drp_Data(LoginAgencyID)) }
        }
    }, [LoginAgencyID])


    useEffect(() => {
        if (LoginAgencyID) {
            // lawtitle dpr
            LawTitleIdDrpDwnVal(LoginAgencyID, null);
            // FBIID
            NIBRSCodeDrpDwnVal(LoginAgencyID, 0);
            // charge / offence codeName
            getRMSCFSCodeListDrp(LoginAgencyID, 0, 0);
        }
    }, [LoginAgencyID,]);


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
    // -----------------------old---------------------------
    const get_ArrestSearchData1 = async (isPrintReport = false) => {
        const {
            ArrestNumber, ArrestNumberTo, ArrestDtTm, ArrestDtTmTo, NameIDNumber, LastName, FirstName,
            MiddleName, SexID, RMSCFSCodeList, FBIID, AgeFrom, AgeTo, PrimaryOfficerID, LawTitleId,
            IPAddress, SearchCriteria, SearchCriteriaJson, Status,
        } = myStateRef.current;
        const val = {
            'AgencyID': LoginAgencyID, 'ArrestNumber': ArrestNumber?.trim(), 'ArrestNumberTo': ArrestNumberTo?.trim(), 'ArrestDtTm': ArrestDtTm, 'ArrestDtTmTo': ArrestDtTmTo, 'NameIDNumber': NameIDNumber?.trim(), 'LastName': LastName?.trim(), 'FirstName': FirstName?.trim(), 'MiddleName': MiddleName?.trim(), 'SexID': SexID, 'RMSCFSCodeList': RMSCFSCodeList, 'FBIID': FBIID, 'AgeFrom': AgeFrom?.trim(), 'AgeTo': AgeTo?.trim(), 'PrimaryOfficerID': PrimaryOfficerID, 'LawTitleID': LawTitleId, 'IPAddress': IPAddress, 'UserID': LoginPinID, 'SearchCriteria': SearchCriteria, 'SearchCriteriaJson': SearchCriteriaJson, 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK
        }
        if (hasValues(val)) {
            const apiUrl = isPrintReport ? 'ArrestReport/PrintArrestReport' : 'ArrestReport/ArrestSummaryReport';
            fetchPostData(apiUrl, val).then((res) => {
                if (res.length > 0) {
                    setMasterReportData(res[0]); setReportData(res[0]); setverifyArrestMaster(true)
                    getAgencyImg(LoginAgencyID); setSearchValue(value); setLoder(false);
                    setIsPermissionsLoaded(false)
                } else {
                    setIsPermissionsLoaded(false)
                    if (!isPrintReport) {
                        toastifyError("Data Not Available");
                        setReportData([]); setverifyArrestMaster(false);
                    }
                }
            });
        }
        else { toastifyError("Please Enter Details"); }
    }

    // -----------Update Function 30-04-2025-------------------
    const get_ArrestSearchData = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ArrestDtTm?.trim()?.length > 0 || value?.ArrestDtTmTo?.trim()?.length > 0 || value?.ArrestNumber?.trim()?.length > 0 ||
            value?.ArrestNumberTo?.trim()?.length > 0 || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 ||
            value?.FirstName?.trim()?.length > 0 ||
            value?.MiddleName?.trim()?.length > 0 ||
            // value?.RMSCFSCodeList?.trim()?.length > 0 ||
            value?.AgeFrom?.trim()?.length > 0 ||
            value?.AgeTo?.trim()?.length > 0 ||
            value?.SearchCriteria?.trim()?.length > 0 ||
            value?.SearchCriteriaJson?.trim()?.length > 0 ||
            (value?.SexID !== null && value?.SexID !== '') ||
            (value?.RMSCFSCodeList !== null && value?.RMSCFSCodeList !== '') ||
            (value?.FBIID !== null && value?.FBIID !== '') ||
            (value?.PrimaryOfficerID !== null && value?.PrimaryOfficerID !== '') || (value?.LawTitleId !== null && value?.LawTitleId !== '')
            // (value?.UserID !== null && value?.CategoryID !== '') ||
            // (value?.ModuleID !== null && value?.CategoryID !== '')
        ) {
            const {
                ArrestNumber, ArrestNumberTo, ArrestDtTm, ArrestDtTmTo, NameIDNumber, LastName, FirstName,
                MiddleName, SexID, RMSCFSCodeList, FBIID, AgeFrom, AgeTo, PrimaryOfficerID, LawTitleId,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
            } = myStateRef.current;
            const val = {
                'AgencyID': LoginAgencyID, 'ArrestNumber': ArrestNumber?.trim(), 'ArrestNumberTo': ArrestNumberTo?.trim(), 'ArrestDtTm': ArrestDtTm, 'ArrestDtTmTo': ArrestDtTmTo, 'NameIDNumber': NameIDNumber?.trim(), 'LastName': LastName?.trim(), 'FirstName': FirstName?.trim(), 'MiddleName': MiddleName?.trim(), 'SexID': SexID, 'RMSCFSCodeList': RMSCFSCodeList, 'FBIID': FBIID, 'AgeFrom': AgeFrom?.trim(), 'AgeTo': AgeTo?.trim(), 'PrimaryOfficerID': PrimaryOfficerID, 'LawTitleID': LawTitleId, 'IPAddress': IPAddress, 'UserID': LoginPinID, 'SearchCriteria': SearchCriteria, 'SearchCriteriaJson': SearchCriteriaJson, 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK
            }
            try {
                const apiUrl = isPrintReport ? 'ArrestReport/PrintArrestReport' : 'ArrestReport/ArrestSummaryReport';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    setMasterReportData(res[0]); setReportData(res[0]); setverifyArrestMaster(true)
                    getAgencyImg(LoginAgencyID); setSearchValue(value); setLoder(false);
                    setIsPermissionsLoaded(false)
                } else {
                    setIsPermissionsLoaded(false)
                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setMasterReportData(res[0]);
                        // setverifyReport(false);
                        setLoder(false);
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

    const resetFields = () => {
        setValue({
            ...value,
            AgencyID: '', ArrestNumber: '', ArrestNumberTo: '', ArrestDtTmTo: '', ArrestDtTm: '', NameIDNumber: '', LastName: '', FirstName: '', MiddleName: '', SexID: '', RMSCFSCodeList: '', FBIID: '', AgeFrom: '', AgeTo: '', PrimaryOfficerID: '', LawTitleId: '',
        })
        setverifyArrestMaster(false); setMasterReportData([]); setShowWatermark('')

        //law title
        LawTitleIdDrpDwnVal(LoginAgencyID, null);
        // nibrs code
        NIBRSCodeDrpDwnVal(LoginAgencyID, null);
        //offence code
        getRMSCFSCodeListDrp(LoginAgencyID, null, null);
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => { setLoder(true); },
        onAfterPrint: () => { setLoder(false); }
    });

    const getRMSCFSCodeList = (LoginAgencyID, FBIID) => {
        const val = { 'FBIID': FBIID, 'AgencyID': LoginAgencyID, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            } else {
                setRmsCfsID([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'FBIID') {
                getRMSCFSCodeList(LoginAgencyID, e.value)
                setValue({ ...value, [name]: e.value, ['RMSCFSCodeList']: "", })
            }
            else { setValue({ ...value, [name]: e.value }) }
        } else {
            if (name === 'FBIID') {
                setRmsCfsID([]);
                setValue({ ...value, ['FBIID']: "", ['RMSCFSCodeList']: "", })
            } else { setValue({ ...value, [name]: null }) }
        }
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
        else if (e.target.name === 'IncidentNumber') {
            let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
            if (ele.length === 8) {
                const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
                const match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
                setValue({ ...value, [e.target.name]: ele })
            }
        }
        else if (e.target.name === 'ArrestNumber' || e.target.name === 'ArrestNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'ArrestNumber' && setValue({
                    ...value, ['ArrestNumberTo']: "", [e.target.name]: ele
                });
            }
        }
        else if (e.target.name === 'AgeFrom' || e.target.name === 'AgeTo') {
            const checkNumber = e.target.value.replace(/[^0-9]/g, "");
            setValue({ ...value, ['Years']: 0, ['DateOfBirth']: 0 })
            setValue({ ...value, [e.target.name]: checkNumber })
            if (checkNumber?.length == 0) { e.target.name == 'AgeFrom' && setValue({ ...value, ['AgeTo']: "", [e.target.name]: checkNumber }) }
        }

        else if (e.target.name === 'LastName' || e.target.name === 'FirstName' || e.target.name === 'MiddleName') {
            const inputValue = e.target.value;
            const checkInput = inputValue.replace(/[^a-zA-Z0-9@#$%&*!.,\s]/g, "");
            const finalInput = inputValue.trim() === "" ? checkInput.replace(/\s/g, "") : checkInput;
            setValue({ ...value, [e.target.name]: finalInput });
        }
        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    }

    const onChangeNameIDNum = (e) => {
        if (e) {
            if (e.target.name === 'NameIDNumber') {
                let ele = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                if (ele.length === 10) {
                    const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
                    const match = cleaned.match(/^([AJ]{1})(\d{9})$/);
                    if (match) {
                        setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] })
                    }
                } else {
                    ele = e.target.value.split("'").join('').replace(/[^a-zA-Z0-9]/g, '');
                    setValue({ ...value, [e.target.name]: ele })
                }
            } else {
                setValue({ ...value, [e.target.name]: e.target.value })
            }
        } else {
            setValue({ ...value, [e.target.name]: e.target.value })
        }
    }



    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm(); get_ArrestSearchData(true); setShowFooter(false);
        }, 100);
    };


    //harsh
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
            get_ArrestSearchData()
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);


    useEffect(() => {
        myStateRef.current = value;
    }, [value])

    //--------------------------------------------//----------------------------------------
    const onChangeNIBRSCode = (e, name) => {
        if (e) {
            if (name === "FBIID") {
                setValue({ ...value, ["FBIID"]: e.value, ["RMSCFSCodeList"]: null, });
                setChargeCodeDrp([]);
                getRMSCFSCodeListDrp(LoginAgencyID, e.value, value?.LawTitleId);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "FBIID") {
                setValue({
                    ...value, [name]: null, ["RMSCFSCodeList"]: null,
                });
                NIBRSCodeDrpDwnVal(LoginAgencyID, value?.LawTitleId);
                getRMSCFSCodeListDrp(LoginAgencyID, null, value?.LawTitleId);
                setChargeCodeDrp([]);
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    };


    const handleInputChange = (inputValue) => {
        if (inputValue) {
            const filtered = nibrsCodeDrp.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions([]);
        }
    };


    const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, RMSCFSCodeList, mainIncidentID) => {
        const lawTitleObj = { 'AgencyID': loginAgencyID, 'ChargeCodeID': RMSCFSCodeList };
        const nibrsCodeObj = { 'AgencyID': loginAgencyID, 'LawTitleID': null, 'IncidentID': mainIncidentID, 'ChargeCodeID': RMSCFSCodeList, };
        try {
            const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
                fetchPostData("LawTitle/GetDataDropDown_LawTitle", lawTitleObj),
                fetchPostData("FBICodes/GetDataDropDown_FBICodes", nibrsCodeObj),
            ]);
            const lawTitleArr = Comman_changeArrayFormat(
                lawTitleResponse, "LawTitleID", "Description"
            );
            const nibrsArr = threeColArrayWithCode(
                nibrsCodeResponse, "FBIID", "Description", "FederalSpecificFBICode"
            );
            setNibrsCodeDrp(nibrsArr);
            setValue({
                ...value,
                LawTitleId: lawTitleArr[0]?.value, FBIID: nibrsArr[0]?.value, RMSCFSCodeList: RMSCFSCodeList,
            });
            const isSingleEntry = lawTitleArr.length === 1 && nibrsArr.length === 1;
        } catch (error) {
            console.error("Error during data fetching:", error);
        }
    };


    const getRMSCFSCodeListDrp = (loginAgencyID, FBIID, LawTitleID) => {
        const val = {
            'AgencyID': loginAgencyID, 'FBIID': FBIID, 'LawTitleID': LawTitleID,
        };
        fetchPostData("ChargeCodes/GetDataDropDown_ChargeCodes", val).then(
            (data) => {
                if (data) {
                    setChargeCodeDrp(Comman_changeArrayFormat(data, "ChargeCodeID", "Description"));
                } else {
                    setChargeCodeDrp([]);
                }
            }
        );
    };

    const LawTitleIdDrpDwnVal = async (loginAgencyID, RMSCFSCodeList) => {
        const val = { AgencyID: loginAgencyID, ChargeCodeID: RMSCFSCodeList };
        await fetchPostData("LawTitle/GetDataDropDown_LawTitle", val).then(
            (data) => {
                if (data) {
                    setLawTitleIdDrp(
                        Comman_changeArrayFormat(data, "LawTitleID", "Description")
                    );
                } else {
                    setLawTitleIdDrp([]);
                }
            }
        );
    };


    const NIBRSCodeDrpDwnVal = (loginAgencyID, LawTitleID, mainIncidentID) => {
        const val = {
            'AgencyID': loginAgencyID, 'LawTitleID': LawTitleID ? LawTitleID : null, 'IncidentID': mainIncidentID,
        };
        fetchPostData("FBICodes/GetDataDropDown_FBICodes", val).then((data) => {
            if (data) {
                setNibrsCodeDrp(threeColArrayWithCode(data, "FBIID", "Description", "FederalSpecificFBICode"));
            } else {
                setNibrsCodeDrp([]);
            }
        });
    };

    const onChangeDrpLawTitle = async (e, name) => {

        if (e) {
            if (name === "LawTitleId") {
                setValue({ ...value, ["LawTitleId"]: e.value, ["FBIID"]: null, ["RMSCFSCodeList"]: null, });
                setChargeCodeDrp([]); setNibrsCodeDrp([]);
                // nibrs code
                NIBRSCodeDrpDwnVal(LoginAgencyID, e.value);
                // charge code
                getRMSCFSCodeListDrp(LoginAgencyID, value?.FBIID, e.value);
            } else if (name === "RMSCFSCodeList") {
                const res = await getLawTitleNibrsByCharge(LoginAgencyID, value?.LawTitleId, e.value);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "LawTitleId") {
                setValue({ ...value, ["LawTitleId"]: null, ["FBIID"]: "", ["RMSCFSCodeList"]: null, });
                setNibrsCodeDrp([]); setChargeCodeDrp([]);
                //law title
                LawTitleIdDrpDwnVal(LoginAgencyID, null);
                // nibrs code
                NIBRSCodeDrpDwnVal(LoginAgencyID, null);
                //offence code
                getRMSCFSCodeListDrp(LoginAgencyID, null, null);
            } else if (name === "RMSCFSCodeList") {
                setValue({ ...value, ["RMSCFSCodeList"]: null });
                // nibrs code
                NIBRSCodeDrpDwnVal(LoginAgencyID, value?.LawTitleId);
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    };

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
                                    <legend>Arrest Summary Report</legend>
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
                                        <div className="col-3 col-md-3 col-lg-2  mt-2 ">
                                            <label htmlFor="" className='new-label'>Arrest # From</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1">
                                            <input type="text" id='ArrestNumber' name='ArrestNumber' value={value?.ArrestNumber} onChange={Handlechange}
                                                autoComplete='off'
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-4  mt-2 ">
                                            <label htmlFor="" className='new-label'>Arrest # To</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1">
                                            <input type="text" id='ArrestNumberTo' name='ArrestNumberTo' value={value?.ArrestNumberTo}
                                                disabled={!value?.ArrestNumber}
                                                className={!value?.ArrestNumber ? 'readonlyColor' : ''}
                                                autoComplete='off'
                                                onChange={Handlechange}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Arrest From Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3">
                                            <DatePicker
                                                id='ArrestDtTm'
                                                name='ArrestDtTm'
                                                dateFormat="MM/dd/yyyy"
                                                isClearable={value?.ArrestDtTm ? true : false}
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
                                                onChange={(date) => { setValue({ ...value, ['ArrestDtTm']: date ? getShowingDateText(date) : null, ['ArrestDtTmTo']: null }) }}
                                                timeInputLabel
                                                placeholderText='Select...'
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-4 mt-2 ">
                                            <label htmlFor="" className='new-label'>Arrest To Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3">
                                            <DatePicker
                                                name='ArrestDtTmTo'
                                                id='ArrestDtTmTo'
                                                onChange={(date) => { setValue({ ...value, ['ArrestDtTmTo']: date ? getShowingDateText(date) : null }) }}
                                                selected={value?.ArrestDtTmTo && new Date(value?.ArrestDtTmTo)}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ArrestDtTmTo ? true : false}
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
                                            <label htmlFor="" className='new-label'>Officer</label>
                                        </div>
                                        <div className="col-9 col-md-9 col-lg-10  mt-1 ">
                                            <Select
                                                styles={customStylesWithOutColor}
                                                name='PrimaryOfficerID'
                                                value={headOfAgency?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                                isClearable
                                                options={headOfAgency}
                                                onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                                placeholder="Select..."
                                            />
                                        </div>





                                        <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
                                            <label htmlFor="" className='new-label'> Law Title</label>
                                        </div>
                                        <div className="col-7 col-md-7 col-lg-3  mt-2">
                                            <Select
                                                name="LawTitleId"
                                                value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                                                options={lawTitleIdDrp}
                                                isClearable
                                                onChange={(e) => onChangeDrpLawTitle(e, "LawTitleId")}
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                            <label htmlFor="" className="new-label text-nowrap"   >   TIBRS Code
                                                <br />
                                            </label>
                                        </div>

                                        <div className="col-7 col-md-7 col-lg-3 mt-2">
                                            <Select
                                                name="FBIID"
                                                styles={colourStyles}
                                                value={nibrsCodeDrp?.filter((obj) => obj.value === value?.FBIID)}
                                                options={filteredOptions.length > 0 ? filteredOptions : nibrsCodeDrp}
                                                onInputChange={handleInputChange}
                                                isClearable
                                                onChange={(e) => onChangeNIBRSCode(e, "FBIID")}
                                                placeholder="Select..."
                                            />
                                        </div>

                                        <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1" >
                                            <label htmlFor="" className='new-label'>Offense Code/Name</label>
                                            <br />
                                        </div>
                                        <div className="col-7 col-md-7 col-lg-10 mt-2">
                                            <Select
                                                name="RMSCFSCodeList"
                                                styles={colourStyles}
                                                value={chargeCodeDrp?.filter((obj) => obj.value === value?.RMSCFSCodeList)}
                                                isClearable
                                                options={chargeCodeDrp}
                                                onChange={(e) => onChangeDrpLawTitle(e, "RMSCFSCodeList")}
                                                placeholder="Select..."
                                            />
                                        </div>



                                        {/* <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'> NIBRS Code</label>
                                        </div>
                                        <div className="col-9 col-md-9 col-lg-3 mt-1">
                                            <Select
                                                name='FBIID'
                                                value={NIBRSDrpData?.filter((obj) => obj.value === value?.FBIID)}
                                                isClearable
                                                options={NIBRSDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'FBIID')}
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-4 mt-2 ">
                                            <label htmlFor="" className='new-label'>Offense Code/Name</label>
                                        </div>
                                        <div className="col-9 col-md-9 col-lg-3  mt-1 ">
                                            <Select
                                                name='RMSCFSCodeList'
                                                styles={customStylesWithOutColor}
                                                value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeList)}
                                                isClearable
                                                options={rmsCfsID}
                                                onChange={(e) => ChangeDropDown(e, 'RMSCFSCodeList')}
                                                placeholder="Select..."
                                                isDisabled={!value?.FBIID}
                                                className={!value?.FBIID ? 'readonlyColor' : ''}
                                            />
                                        </div> */}






                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Name Information</legend>
                                    <div className="row">
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>MNI</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='NameIDNumber' maxLength={11} value={value?.NameIDNumber} onChange={onChangeNameIDNum} id='NameIDNumber' className='' autoComplete='off' />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Last Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-2">
                                            <input type="text" name='LastName' id='LastName' value={value?.LastName}
                                                onChange={Handlechange} autoComplete='off' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>First Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                            <input type="text" name='FirstName' id='FirstName' value={value?.FirstName}
                                                onChange={Handlechange} autoComplete='off' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Middle&nbsp;Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1">
                                            <input type="text" name='MiddleName' id='MiddleName' value={value?.MiddleName} onChange={Handlechange} autoComplete='off' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
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
                                            <label htmlFor="" className='new-label'>Age From</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                            <input type="text" name='AgeFrom' id='AgeFrom' value={value?.AgeFrom} onChange={Handlechange} autoComplete='off' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Age To</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                            <input type="text" name='AgeTo' id='AgeTo' value={value?.AgeTo} onChange={Handlechange}
                                                disabled={!value?.AgeFrom?.trim()}
                                                className={!value?.AgeFrom?.trim() ? 'readonlyColor' : ''} autoComplete='off'
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
                                {/* <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 text-right">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_ArrestSearchData(); }} >Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyArrestMaster(false); resetFields(); }}>Clear</button>
                                    <Link to={'/Reports'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                    </Link>
                                </div> */}
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
                            <p className="p-0 m-0 d-flex align-items-center">Arrest Summary Report</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    {/* <i className="fa fa-print" onClick={printForm}></i> */}
                                    <i className="fa fa-print" onClick={handlePrintClick}></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-1" >
                        <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }}>
                            <>
                                <ReportAddress {...{ multiImage, masterReportData }} />
                            </>
                            {showWatermark && (
                                <div className="watermark-print">Confidential</div>
                            )}
                            <div className="col-12">
                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Arrest Summary Report</h5>
                            </div>

                            <div className="col-12 bb">
                                <fieldset>
                                    <legend>Search Criteria</legend>
                                    <div className="row align-items-center mt-2" style={{ rowGap: "8px" }}>
                                        {showFields.showArrestNumber && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1 ">
                                                    <label className="new-label mb-0">Arrest Number</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={searchValue.ArrestNumber || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {showFields.showArrestNumberTo && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1 ">
                                                    <label className="new-label mb-0">Arrest Number To</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={searchValue.ArrestNumberTo || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {showFields.showArrestDtTm && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1">
                                                    <label className="new-label mb-0">Arrest Date From</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
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

                                        {showFields.showArrestDtTmTo && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1">
                                                    <label className="new-label mb-0">Arrest Date To</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
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

                                        {showFields.showNameIDNumber && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1">
                                                    <label className="new-label mb-0">NameID Number </label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={searchValue.NameIDNumber || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {showFields.showPrimaryOfficerID && searchValue.PrimaryOfficerID && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1">
                                                    <label className="new-label mb-0">Officer</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={headOfAgency.find((obj) => obj.value === searchValue.PrimaryOfficerID)?.label || ''}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {showFields.showLastName && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1 ">
                                                    <label className="new-label mb-0">Last Name</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={searchValue.LastName || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {showFields.showFirstName && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1 ">
                                                    <label className="new-label mb-0">First Name</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={searchValue.FirstName || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {showFields.showMiddleName && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1">
                                                    <label className="new-label mb-0">Middle Name</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={searchValue.MiddleName || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {
                                            showFields.showSexID && searchValue.SexID && (
                                                <>
                                                    <div className="col-12 col-sm-4 col-md-1 ">
                                                        <label className="new-label mb-0">Gender</label>
                                                    </div>
                                                    <div className="col-12 col-sm-8 col-md-5 text-field mt-0">
                                                        <input
                                                            type="text"
                                                            className="readonlyColor form-control"
                                                            value={sexIdDrp.find((obj) => obj.value === searchValue.SexID)?.label || ''}
                                                            readOnly
                                                        />
                                                    </div>
                                                </>
                                            )}


                                        {showFields.showLawTitleId && searchValue.LawTitleId && (
                                            <>
                                                <div className="col-12 col-sm-3 col-md-1">
                                                    <label className="new-label mb-0">Law Title</label>
                                                </div>
                                                <div className="col-12 col-sm-9 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={
                                                            lawTitleIdDrp.find((obj) => obj.value === searchValue.LawTitleId)
                                                                ?.label || ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {showFields.showFBIID && searchValue.FBIID && (
                                            <>
                                                <div className="col-12 col-sm-2 col-md-1">
                                                    <label className="new-label mb-0">TIBRS Code</label>
                                                </div>
                                                <div className="col-12 col-sm-10 col-md-5 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor readonlyColor_MasterInput form-control"
                                                        value={
                                                            NIBRSDrpData?.find((obj) => obj.value === searchValue.FBIID)?.label ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="col-12"></div> {/* Clear row */}

                                        {showFields.showRMSCFSCodeList && searchValue.RMSCFSCodeList && (
                                            <>
                                                <div className="col-12 col-sm-4 col-md-1 ">
                                                    <label className="new-label text-nowrap mb-0">Offense Code</label>
                                                </div>
                                                <div className="col-12 col-sm-8 col-md-11 text-field mt-0">
                                                    <input
                                                        type="text"
                                                        className="readonlyColor form-control"
                                                        value={
                                                            chargeCodeDrp.find((obj) => obj.value === searchValue.RMSCFSCodeList)
                                                                ?.label || ""
                                                        }
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
                                        masterReportData?.Incident?.map((obj) =>
                                            <>
                                                <div className="container">
                                                    <h5 className=" text-white text-bold bg-green py-1 px-3"> Incident Number:- {obj.IncidentNumber}</h5>
                                                    <table className="table table-bordered">
                                                        <thead className='text-dark master-table'>
                                                            <tr>
                                                                <th className='' style={{ width: '150px' }}>Incident Number:</th>
                                                                <th className='' style={{ width: '150px' }}>Reported Date/Time:</th>
                                                                <th className='' style={{ width: '150px' }}>Exceptional Clearance(Yes/No)</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody className='master-tbody'>
                                                            <tr>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.IncidentNumber}</td>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.ReportedDate && getShowingDateText(obj?.ReportedDate)}</td>
                                                                <td className='text-list' style={{ width: '150px' }}>{obj?.RMSDisposition}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    {
                                                        JSON.parse(obj?.Arrest)?.length > 0 ?
                                                            <>
                                                                <div className="table-responsive" >
                                                                    <table className="table table-bordered" >
                                                                        <hr />
                                                                        <tbody className='master-tbody'>
                                                                            {
                                                                                JSON.parse(obj?.Arrest)?.map((item, key) => (
                                                                                    <>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <h6 className='text-dark text-bold'>Arrest Number:</h6>
                                                                                                <p className='text-list'>{item.ArrestNumber}</p>
                                                                                            </td>
                                                                                            <td>
                                                                                                <h6 className='text-dark text-bold'>Arrest Date/Time</h6>
                                                                                                <p className='text-list'>{item?.ArrestDtTm && getShowingDateText(item?.ArrestDtTm)}</p>
                                                                                            </td>
                                                                                            <td >
                                                                                                <h6 className='text-dark text-bold'>Officer:</h6>
                                                                                                <p className='text-list'>{item.PrimaryOfficer_Name}</p>
                                                                                            </td>

                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                                <h6 className='text-dark text-bold'>Arrestee:</h6>
                                                                                                <p className='text-list'>{item.Arrestee_Name}</p>
                                                                                            </td>
                                                                                            <td>
                                                                                                <h6 className='text-dark text-bold'>Gender:</h6>
                                                                                                <p className='text-list'>{item.Gender}</p>
                                                                                            </td>
                                                                                            <td>
                                                                                                <h6 className='text-dark text-bold'>Age</h6>
                                                                                                <p className='text-list'>{item.Years ? `${item.Years} years` : 'N/A'}</p>
                                                                                            </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td colSpan={12}>
                                                                                                <h6 className='text-dark text-bold'>Charge</h6>
                                                                                                {
                                                                                                    (JSON.parse(obj?.Arrest || "[]") || []).map((arrest, arrestKey) => (
                                                                                                        (JSON.parse(arrest?.Charge || "[]") || []).map((charge, chargeKey) => (
                                                                                                            <p className='text-list' key={`${arrestKey}-${chargeKey}`} >
                                                                                                                {charge.ChargeCode_Description}
                                                                                                            </p>
                                                                                                        ))
                                                                                                    ))
                                                                                                }
                                                                                            </td>
                                                                                        </tr>

                                                                                    </>
                                                                                ))
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                            </>
                                                    }
                                                    <div className="table-responsive" >
                                                        {/* {
                                                            JSON.parse(obj?.Arrest).length > 0 ?
                                                                <>
                                                                    <table className="table table-bordered">
                                                                        <thead className='text-dark master-table'>
                                                                            <tr>
                                                                                <th className='' style={{ width: '150px' }}>Arrest Number</th>
                                                                                <th className='' style={{ width: '150px' }}>Arrest Date/Time</th>
                                                                                <th className='' style={{ width: '150px' }}>Officer</th>
                                                                                <th className='' style={{ width: '150px' }}>Arrestee</th>
                                                                                <th className='' style={{ width: '150px' }}>Gender</th>
                                                                                <th className='' style={{ width: '150px' }}>Age</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='master-tbody'>
                                                                            {
                                                                                JSON.parse(obj?.Arrest || obj?.Charge)?.map((item, key) => (
                                                                                    <>
                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                            <td style={{ width: '150px' }}>{item.ArrestNumber}</td>
                                                                                            <td style={{ width: '150px' }}>{item?.ArrestDtTm && getShowingDateText(item?.ArrestDtTm)}</td>
                                                                                            <td style={{ width: '150px' }}>{item.PrimaryOfficer_Name}</td>
                                                                                            <td style={{ width: '150px' }}>{item.Arrestee_Name}</td>
                                                                                            <td style={{ width: '150px' }}>{item.Gender}</td>
                                                                                            <td style={{ width: '150px' }}>{item.Years ? `${item.Years} years` : 'N/A'}</td>
                                                                                        </tr>
                                                                                    </>
                                                                                ))
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                    <table className="table table-bordered">
                                                                        <thead className='text-dark master-table'>
                                                                            <tr>
                                                                                <th className=''>Charge</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className='master-tbody'>
                                                                            {
                                                                                (JSON.parse(obj?.Arrest || "[]") || []).map((arrest, arrestKey) => (
                                                                                    (JSON.parse(arrest?.Charge || "[]") || []).map((charge, chargeKey) => (
                                                                                        <tr key={`${arrestKey}-${chargeKey}`} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                            <td>{charge.ChargeCode_Description}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                ))
                                                                            }

                                                                        </tbody>
                                                                    </table>

                                                                </>
                                                                :
                                                                <></>
                                                        } */}
                                                    </div>

                                                </div >
                                            </>
                                        )
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

export default ArrestSummary

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
