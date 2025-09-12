import Select from "react-select";
import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import { colourStyles, customStylesWithOutColor, Decrypt_Id_Name, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { fetchPostData } from '../../../../hooks/Api';
import { toastifyError } from '../../../../Common/AlertMsg';
import { useRef, useEffect, useContext } from 'react';
import { useReactToPrint } from 'react-to-print';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import { get_NIBRS_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import Loader from '../../../../Common/Loader';
import ReportAddress from '../../../ReportAddress/ReportAddress';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const IncidentTotalByCode = () => {

    const { GetDataTimeZone, datezone } = useContext(AgencyContext)
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);

    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const [multiImage, setMultiImage] = useState([]);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [incidentData, setIncidentData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [loder, setLoder] = useState(false);
    const [loginPinID, setloginPinID,] = useState('');
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
        'IncidentNumber': '', 'IncidentNumberTo': '',
        'ReportedDate': null, 'ReportedDateTo': null, 'AgencyID': '', 'RMSCFSCodeID': null, 'FBIID': null, 'LawTitleId': null,
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
    });
    const [searchValue, setSearchValue] = useState({
        IncidentNumber: '', IncidentNumberTo: '', ReportedDate: '', ReportedDateTo: '', RMSCFSCodeID: null, FBIID: null, LawTitleId: null
    });

    const [showFields, setShowFields] = useState({
        showIncidentNumber: false, showIncidentNumberTo: false, showReportedDateFrom: false, showReportedDateTo: false, showRMSCFSCodeID: false, showFBIID: false, showLawTitleId: false
    });
    useEffect(() => {
        setShowFields({
            showIncidentNumber: searchValue.IncidentNumber, showIncidentNumberTo: searchValue.IncidentNumberTo, showReportedDateFrom: searchValue.ReportedDate, showReportedDateTo: searchValue.ReportedDateTo, showRMSCFSCodeID: searchValue.RMSCFSCodeID !== null, showFBIID: searchValue.FBIID !== null, showLawTitleId: searchValue.LawTitleId !== null,
        });
    }, [searchValue]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);


    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            setLoginUserName(localStoreData?.UserName)
            if (NIBRSDrpData?.length === 0) { dispatch(get_NIBRS_Drp_Data(localStoreData?.AgencyID)) }
            GetDataTimeZone(localStoreData?.AgencyID); dispatch(get_ScreenPermissions_Data("I101", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData])


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


    const getIncidentSearchData = async (isPrintReport = false) => {
        console.log(isPrintReport);
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || (value?.LawTitleId !== null && value?.LawTitleId != '') || (value?.RMSCFSCodeID !== null && value?.RMSCFSCodeID != '') || (value?.FBIID !== null && value?.FBIID != '')) {
            const { IncidentNumber, IncidentNumberTo, LawTitleId, ReportedDate, ReportedDateTo, RMSCFSCodeID, FBIID, AgencyID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, } = myStateRef.current
            const val = {
                'IncidentNumber': IncidentNumber,
                'IncidentNumberTo': IncidentNumberTo, 'LawTitleID': LawTitleId,
                'ReportedDate': ReportedDate,
                'ReportedDateTo': ReportedDateTo,
                'RMSCFSCodeID': RMSCFSCodeID,
                'FBIID': FBIID,
                'AgencyID': LoginAgencyID,
                IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'Report/PrintReport' : 'Report/Report_IncidentByCharge';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    setIncidentData(res[0].Incident); setMasterReportData(res[0]);
                    setverifyIncident(true); getAgencyImg(LoginAgencyID); setSearchValue(value); setLoder(false);
                } else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setMasterReportData([]);
                        setverifyIncident(false); setLoder(false);
                    }

                }
                setIsPermissionsLoaded(false);
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setverifyIncident(false); setLoder(false);
                setIsPermissionsLoaded(false);
            }
        } else {
            toastifyError("Please Enter Details"); setLoder(false);
        }
    }
    // const getIncidentSearchData = async () => {
    //     if (value?.ReportedDate?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.RMSCFSCodeID !== null || value?.FBIID !== null) {
    //         const { IncidentNumber, IncidentNumberTo, ReportedDate, ReportedDateTo, RMSCFSCodeID, FBIID, AgencyID, } = value
    //         const val = {
    //             'IncidentNumber': IncidentNumber,
    //             'IncidentNumberTo': IncidentNumberTo,
    //             'ReportedDate': ReportedDate,
    //             'ReportedDateTo': ReportedDateTo,
    //             'RMSCFSCodeID': RMSCFSCodeID,
    //             'FBIID': FBIID,
    //             'AgencyID': LoginAgencyID,
    //         }
    //         fetchPostData('Report/Report_IncidentByCharge', val).then((res) => {
    //             if (res.length > 0) {

    //                 setIncidentData(res[0].Incident);
    //                 setMasterReportData(res[0]);
    //                 setverifyIncident(true);
    //                 getAgencyImg(LoginAgencyID);
    //                 setSearchValue(value);
    //             } else {
    //                 toastifyError("Data Not Available");
    //                 setMasterReportData([]);
    //                 setverifyIncident(false);
    //             }
    //         });
    //     } else {
    //         toastifyError("Please Enter Details")
    //     }
    // }

    const resetFields = () => {
        setValue({
            ...value, 'ReportedDate': null, 'ReportedDateTo': null, 'IncidentNumber': "", 'IncidentNumberTo': "", 'RMSCFSCodeID': null, 'LawTitleId': '', 'FBIID': null,
        });
        setverifyIncident(false); setIncidentData([]); setMasterReportData([]); setShowWatermark('');
        //law title
        LawTitleIdDrpDwnVal(LoginAgencyID, null);
        // nibrs code
        NIBRSCodeDrpDwnVal(LoginAgencyID, null);
        //offence code
        getRMSCFSCodeListDrp(LoginAgencyID, null, null);
    }

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
    // const ChangeDropDown = (e, name) => {
    //     if (e) { setValue({ ...value, [name]: e.value }) }
    //     else { setValue({ ...value, [name]: null }) }
    // }


    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'FBIID') {
                getRMSCFSCodeList(LoginAgencyID, e.value)
                setValue({ ...value, [name]: e.value, ['RMSCFSCodeID']: "", })
            } else {
                setValue({ ...value, [name]: e.value })
            }
        } else {
            if (name === 'FBIID') {
                setRmsCfsID([]);
                setValue({ ...value, ['FBIID']: "", ['RMSCFSCodeID']: "", })
            } else {
                setValue({ ...value, [name]: null })
            }
        }
    }
    const handleChange = (e) => {
        if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'IncidentNumber' && setValue({
                    ...value, ['IncidentNumberTo']: "", [e.target.name]: ele
                });
            }
        }
        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    }


    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm(); getIncidentSearchData(true); setShowFooter(false);
        }, 100);
    };

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("I101", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {

        if (isPermissionsLoaded) {
            getIncidentSearchData()
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);

    useEffect(() => {
        myStateRef.current = value;
    }, [value])


    //----------------------------------------------//-------------------------------------------------------------------
    const onChangeNIBRSCode = (e, name) => {
        if (e) {
            if (name === "FBIID") {
                setValue({ ...value, ["FBIID"]: e.value, ["RMSCFSCodeID"]: null, });
                setChargeCodeDrp([]);
                getRMSCFSCodeListDrp(LoginAgencyID, e.value, value?.LawTitleId);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "FBIID") {
                setValue({
                    ...value, [name]: null, ["RMSCFSCodeID"]: null,
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


    const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, RMSCFSCodeID, mainIncidentID) => {
        const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: RMSCFSCodeID };
        const nibrsCodeObj = { AgencyID: loginAgencyID, LawTitleID: null, IncidentID: mainIncidentID, ChargeCodeID: RMSCFSCodeID, };
        try {
            const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
                fetchPostData("LawTitle/GetDataDropDown_LawTitle", lawTitleObj),
                fetchPostData("FBICodes/GetDataDropDown_FBICodes", nibrsCodeObj),
            ]);
            const lawTitleArr = Comman_changeArrayFormat(lawTitleResponse, "LawTitleID", "Description");
            const nibrsArr = threeColArrayWithCode(nibrsCodeResponse, "FBIID", "Description", "FederalSpecificFBICode");
            setNibrsCodeDrp(nibrsArr);
            setValue({
                ...value,
                LawTitleId: lawTitleArr[0]?.value, FBIID: nibrsArr[0]?.value, RMSCFSCodeID: RMSCFSCodeID,
            });
            const isSingleEntry = lawTitleArr.length === 1 && nibrsArr.length === 1;
        } catch (error) {
            console.error("Error during data fetching:", error);
        }
    };


    const getRMSCFSCodeListDrp = (loginAgencyID, FBIID, LawTitleId) => {
        const val = {
            AgencyID: loginAgencyID,
            FBIID: FBIID,
            LawTitleID: LawTitleId,
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

    const LawTitleIdDrpDwnVal = async (loginAgencyID, RMSCFSCodeID) => {
        const val = { AgencyID: loginAgencyID, ChargeCodeID: RMSCFSCodeID };
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
            AgencyID: loginAgencyID,
            LawTitleID: LawTitleID ? LawTitleID : null,
            IncidentID: mainIncidentID,
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
                setValue({
                    ...value,
                    ["LawTitleId"]: e.value,
                    ["FBIID"]: null,
                    ["RMSCFSCodeID"]: null,
                });
                setChargeCodeDrp([]);
                setNibrsCodeDrp([]);
                // nibrs code
                NIBRSCodeDrpDwnVal(LoginAgencyID, e.value);
                // charge code
                getRMSCFSCodeListDrp(LoginAgencyID, value?.FBIID, e.value);
            } else if (name === "RMSCFSCodeID") {
                const res = await getLawTitleNibrsByCharge(
                    LoginAgencyID,
                    value?.LawTitleId,
                    e.value
                );
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "LawTitleId") {
                setValue({
                    ...value,
                    ["LawTitleId"]: null,
                    ["FBIID"]: "",
                    ["RMSCFSCodeID"]: null,
                });
                setNibrsCodeDrp([]);
                setChargeCodeDrp([]);
                //law title
                LawTitleIdDrpDwnVal(LoginAgencyID, null);
                // nibrs code
                NIBRSCodeDrpDwnVal(LoginAgencyID, null);
                //offence code
                getRMSCFSCodeListDrp(LoginAgencyID, null, null);
            } else if (name === "RMSCFSCodeID") {
                setValue({ ...value, ["RMSCFSCodeID"]: null });

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
                                    <legend>Incident Totals By Code Range</legend>
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
                                        <div className="col-3 col-md-3 col-lg-3 ">
                                            <DatePicker
                                                name='ReportedDate'
                                                id='ReportedDate'
                                                onChange={(date) => {
                                                    if (date) {
                                                        setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null })
                                                    } else {
                                                        setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null, ['ReportedDateTo']: '', })
                                                    }
                                                }}
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
                                                disabled={false}
                                                maxDate={new Date(datezone)}
                                                placeholderText='Select...'
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-4 mt-2 ">
                                            <label htmlFor="" className='new-label'>Reported To Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mb-1">
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
                                                // disabled={value?.ReportedDate ? false : true}
                                                minDate={new Date(value?.ReportedDate)}
                                                maxDate={new Date(datezone)}
                                                placeholderText='Select...'
                                                disabled={value?.ReportedDate ? false : true}
                                                className={!value?.ReportedDate && 'readonlyColor'}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                            <label htmlFor="" className='new-label'>Incident # From</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='IncidentNumber' id='IncidentNumber' value={value.IncidentNumber} onChange={handleChange} className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-4 mt-2 ">
                                            <label htmlFor="" className='new-label'>Incident # To</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='IncidentNumberTo'
                                                // disabled={!value.IncidentNumber}
                                                disabled={!value?.IncidentNumber?.trim()}
                                                className={!value?.IncidentNumber?.trim() ? 'readonlyColor' : ''}
                                                id='IncidentNumberTo' value={value.IncidentNumberTo} onChange={handleChange} />
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
                                            <label htmlFor="" className="new-label text-nowrap"  >   NIBRS Code
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

                                        <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
                                            <label htmlFor="" className='new-label'>Offense Code/Name</label>
                                            <br />
                                        </div>
                                        <div className="col-7 col-md-7 col-lg-10  mt-2">
                                            <Select
                                                name="RMSCFSCodeID"
                                                styles={colourStyles}
                                                value={chargeCodeDrp?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                isClearable
                                                options={chargeCodeDrp}
                                                onChange={(e) => onChangeDrpLawTitle(e, "RMSCFSCodeID")}
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
                                                name='RMSCFSCodeID'
                                                styles={customStylesWithOutColor}
                                                value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                isClearable
                                                options={rmsCfsID}
                                                onChange={(e) => ChangeDropDown(e, 'RMSCFSCodeID')}
                                                placeholder="Select..."
                                                isDisabled={!value?.FBIID}
                                                className={!value?.FBIID ? 'readonlyColor' : ''}
                                            />
                                        </div> */}





                                        {/* <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                            <label htmlFor="" className='new-label'>Patrol Zone</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                            <Select
                                                name=''
                                                styles={customStylesWithOutColor}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                            <label htmlFor="" className='new-label'>City</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                            <Select
                                                name=''
                                                styles={customStylesWithOutColor}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                            <label htmlFor="" className='new-label'>Zip</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                            <Select
                                                name=''
                                                styles={customStylesWithOutColor}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                        </div> */}
                                        <div className="col-12 col-md-12 col-lg-12 mt-4 text-right ">
                                            {
                                                effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                    <button className="btn btn-sm bg-green text-white px-2  ml-2" onClick={() => { getIncidentSearchData(false); }}>Show Report</button>
                                                    : <></> :
                                                    <button className="btn btn-sm bg-green text-white px-2  ml-2" onClick={() => { getIncidentSearchData(false); }}>Show Report</button>
                                            }
                                            <button className="btn btn-sm bg-green text-white px-2  ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                            <Link to={'/Reports'}>
                                                <button className="btn btn-sm bg-green text-white px-2  ml-2" >Close</button>
                                            </Link>
                                        </div>


                                        {/* <div className="col-12 col-md-12 col-lg-12 mt-4 text-right ">
                                            <button className="btn btn-sm bg-green text-white px-2  ml-2" onClick={() => { getIncidentSearchData(); }}>Show Report</button>
                                            <button className="btn btn-sm bg-green text-white px-2  ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                            <Link to={'/Reports'}>
                                                <button className="btn btn-sm bg-green text-white px-2  ml-2" >Close</button>
                                            </Link>
                                        </div> */}
                                    </div>
                                </fieldset>
                                {/* <DataTable
                                    columns={columns}
                                    dense
                                    data={incidentData}
                                    pagination
                                    paginationPerPage={'10'}
                                    paginationRowsPerPageOptions={[10, 15, 20]}
                                    highlightOnHover
                                    subHeader
                                    responsive
                                    showPaginationBottom={10}
                                    subHeaderAlign='left'
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                verifyIncident &&
                <>
                    <div className="col-12 col-md-12 col-lg-12  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Incident Totals By Code Range Report</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    {/* <i className="fa fa-print" onClick={printForm}></i> */}
                                    <i className="fa fa-print" onClick={handlePrintClick}></i>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="container mt-1" >
                        <div className="col-12" >
                            <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }} >
                                <>
                                    <ReportAddress {...{ multiImage, masterReportData }} />
                                    {showWatermark && (
                                        <div className="watermark-print">Confidential</div>
                                    )}
                                    {/* <div className="col-4 col-md-3 col-lg-2 ml-3">
                                        <div className="main ">
                                            <div className="img-box " >
                                                <img src={multiImage} className='' style={{ marginTop: '4px', width: '150px', height: '150px' }} />
                                            </div>
                                        </div>
                                    </div> */}
                                    {/* <div className="col-7  col-md-7 col-lg-9 mt-2">
                                    <div className="main">
                                        <h5 className='text-dark text-bold'>{masterReportData?.Agency_Name}</h5>
                                        <p className='text-p'>Address: <span className=''>{masterReportData?.Agency_Address1}</span></p>
                                        <div className='d-flex '>
                                            <p className='text-p'>State: <span className='new-span '>{masterReportData?.StateName}</span>
                                            </p>
                                            <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{masterReportData?.CityName}</span>
                                            </p>
                                            <p className='text-p ml-2'>Zip: <span className='new-span  '>{masterReportData?.Zipcode}</span>
                                            </p>
                                        </div>
                                        <div className='d-flex'>
                                            <p className='text-p'>Phone: <span className='new-span  '>{masterReportData?.Agency_Phone}</span></p>
                                            <p className='text-p ml-3 '>Fax: <span className='new-span  '> {masterReportData?.Agency_Fax}</span></p>
                                        </div>
                                    </div>
                                </div> */}
                                    {/* <div className="col-7 col-md-7 col-lg-9 mt-2">
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
                                    </div> */}
                                </>
                                <div className="col-12">
                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Incident Totals By Code Range Report</h5>
                                </div>
                                <div className="col-12 bb">
                                    <fieldset>
                                        <legend>Search Criteria</legend>
                                        <div className="row">
                                            {showFields.showIncidentNumber && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Incident Number From</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.IncidentNumber}

                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showIncidentNumberTo && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Incident Number To</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.IncidentNumberTo}

                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showReportedDateFrom && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Reported Date From</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.ReportedDate && getShowingWithOutTime(searchValue.ReportedDate)}

                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showReportedDateTo && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Reported Date To</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            // value={searchValue.ReportedDateTo || ''} 
                                                            value={searchValue.ReportedDateTo && getShowingWithOutTime(searchValue.ReportedDateTo)}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {
                                                showFields.showLawTitleId && searchValue.LawTitleId && (
                                                    <>
                                                        <div className="col-2 col-md-2 col-lg-2 mt-2">
                                                            <label className='new-label'>Law Title</label>
                                                        </div>
                                                        <div className="col-10 col-md-10 col-lg-10 text-field mt-1">
                                                            <input type="text" className='readonlyColor' value={lawTitleIdDrp?.find((obj) => obj.value === searchValue.LawTitleId)?.label || ''} readOnly />
                                                        </div>
                                                    </>
                                                )}
                                            {
                                                showFields.showFBIID && searchValue.FBIID && (
                                                    <>
                                                        <div className="col-2 col-md-2 col-lg-2 mt-2">
                                                            <label className='new-label'>TIBRS Code</label>
                                                        </div>
                                                        <div className="col-10 col-md-10 col-lg-10 text-field mt-1">
                                                            <input type="text" className='readonlyColor' value={NIBRSDrpData?.find((obj) => obj.value === searchValue.FBIID)?.label || ''} readOnly />
                                                        </div>
                                                    </>
                                                )}
                                            {showFields.showRMSCFSCodeID && searchValue.RMSCFSCodeID && (
                                                <>
                                                    <div className="col-2 col-md-2 col-lg-2 mt-2">
                                                        <label className='new-label'>Offense&nbsp;Code</label>
                                                    </div>
                                                    <div className="col-10 col-md-10 col-lg-10 text-field mt-1">
                                                        <input type="text" className='readonlyColor' value={chargeCodeDrp?.find((obj) => obj.value === searchValue.RMSCFSCodeID)?.label || ''} readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </fieldset>
                                </div>
                                {/* {
                                masterReportData?.Crime?.map((obj) =>
                                    <>
                                        <div className="container">
                                            <h5 className=" "> Reported Date:- {obj.ReportedDate} To </h5>
                                            <h5 className=" "> Incident Number:- {obj.IncidentNumber} To</h5>
                                            <div className="row">

                                                <table className="table table-bordered">
                                                    <thead className='text-dark master-table'>
                                                        <tr>
                                                            <th className='' style={{ width: '150px' }}>Incident Number:</th>
                                                            <th className='' style={{ width: '150px' }}>Offense Code:</th>
                                                                <th className='' style={{ width: '150px' }}>Reported Date/Time:</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody className='master-tbody'>
                                                        <tr>
                                                            <td className='text-list' style={{ width: '150px' }}>{obj?.IncidentNumber}</td>
                                                            <td className='text-list' style={{ width: '150px' }}>{obj?.RMSCFSCode_Description}</td>
                                                            <td className='text-list' style={{ width: '150px' }}>{obj?.ReportedDate && getShowingDateText(obj?.ReportedDate)}</td>

                                                        </tr>
                                                    </tbody>
                                                    <thead className='text-dark master-table'>
                                                        <tr>
                                                            <th className='' style={{ width: '150px' }}>Location:</th>
                                                            <th className='' style={{ width: '150px' }}>CAD CFS:</th>
                                                            <th className='' style={{ width: '150px' }}>Officer:</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className='master-tbody'>
                                                        <tr>
                                                            <td className='text-list' style={{ width: '150px' }}>{obj?.CrimeLocation}</td>
                                                            <td className='text-list' style={{ width: '150px' }}>{obj?.CADCFSCode_Description}</td>
                                                            <td className='text-list' style={{ width: '150px' }}>{obj?.Officer_Name}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                            </div>
                                        </div >
                                    </>
                                )
                            } */}
                                {
                                    masterReportData?.Crime?.map((obj) => (
                                        <>

                                            <div className="container-fluid " style={{ pageBreakAfter: 'always' }}>
                                                <div className="table-responsive bb mt-4" >
                                                    {
                                                        JSON.parse(obj?.Incident).length > 0 ?
                                                            <>
                                                                {/* <h5 className="text-white text-bold bg-green py-1 px-3" >SMT Information:</h5> */}

                                                                {/* <h6 className='text-dark pl-2 '>Charge Code:- <span className='text-gray'>
                                                                {obj?.ChargeCode}
                                                            </span></h6> */}
                                                                <table className="table table-bordered">
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th scope="col" colSpan='2' style={{ width: '100px' }}>Offense Code:- <span style={{ color: '#000', fontWeight: 'bold' }}>
                                                                                {obj?.ChargeCode}
                                                                            </span></th>
                                                                            <th scope="col" className='text-right'>Total Incident: <span style={{ color: '#000', fontWeight: 'bold' }}>
                                                                                {JSON.parse(obj?.Incident).length}
                                                                            </span></th>
                                                                        </tr>
                                                                    </thead>
                                                                </table >
                                                                <table className="table table-bordered ">
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th className='' style={{ width: '150px' }}>Incident Number:</th>
                                                                            <th className='' style={{ width: '150px' }}>Reported Date/Time:</th>
                                                                            <th className='' style={{ width: '150px' }}>Location:</th>
                                                                            <th className='' style={{ width: '150px' }}>TIBRS Code:</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='master-tbody'>
                                                                        {
                                                                            JSON.parse(obj?.Incident)?.map((obj, key) => (
                                                                                <>
                                                                                    <tr key={key}>
                                                                                        <td className='text-list' style={{ width: '150px' }}>{obj?.IncidentNumber}</td>
                                                                                        <td className='text-list' style={{ width: '150px' }}>{obj?.ReportedDate && getShowingDateText(obj?.ReportedDate)}</td>
                                                                                        <td className='text-list' style={{ width: '150px' }}>{obj?.CrimeLocation}</td>
                                                                                        <td className='text-list' style={{ width: '150px' }}>{obj?.NIBRSCode}</td>
                                                                                    </tr>
                                                                                </>
                                                                            ))
                                                                        }
                                                                    </tbody>
                                                                    {/* <tfoot className="table-footer ">
                                                                        <tr style={{ textAlign: 'center', fontSize: '45px', color: '#000', }}>
                                                                            <td colSpan={5}>
                                                                                {showFooter && `Officer Name:${LoginUserName} - Date/Time:${datezone} - IP Address:${ipAddress}`}
                                                                            </td>


                                                                        </tr>
                                                                    </tfoot> */}
                                                                </table>
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    ))
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
            }
            {loder && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )}
        </>
    )
}

export default IncidentTotalByCode