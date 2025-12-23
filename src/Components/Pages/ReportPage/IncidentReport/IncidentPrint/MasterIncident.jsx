import React, { useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear, getShowingWithFixedTime01, getShowingWithOutTime, } from '../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { fetchPostData } from '../../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';
import { toastifyError } from '../../../../Common/AlertMsg';
import Select from "react-select";
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_Incident_Drp_Data, get_NIBRS_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import DOMPurify from 'dompurify';
import Loader from '../../../../Common/Loader';
import ReportAddress from '../../../ReportAddress/ReportAddress';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import Location from '../../../../Location/Location';

const MasterIncident = ({ comments }) => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const cadCfsCodeDrpData = useSelector((state) => state.DropDown.cadCfsCodeDrpData);
    const fbiCodesDrpData = useSelector((state) => state.DropDown.fbiCodesDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);

    const { GetDataTimeZone, datezone, setChangesStatus } = useContext(AgencyContext);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const [multiImage, setMultiImage] = useState([]);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [reportedData, setReportedData] = useState([]);
    const [incidentData, setIncidentData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [locationStatus, setLocationStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [PropertyPhoto, setPropertyPhoto] = useState([]);
    const [loder, setLoder] = useState(false);
    const [height, setHeight] = useState('auto');
    const textareaRef = useRef(null);
    const [propertyID, setPropertyID] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);
    const [onSelectLocation, setOnSelectLocation] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    //NIBRS Code
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    // Offense Code/Name
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(nibrsCodeDrp);

    const [value, setValue] = useState({
        'IncidentNumber': '', 'IncidentNumberTo': '', 'ReportedDate': '', 'ReportedDateTo': '', 'OccurredFrom': '', 'OccurredTo': '', 'Location': '', 'AgencyID': '', 'FBIID': '', 'RMSCFSCodeList': '', 'LawTitleId': '',
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,

    });

    const [searchValue, setSearchValue] = useState({
        IncidentNumber: '', IncidentNumberTo: '', ReportedDate: '', ReportedDateTo: '', OccurredFrom: '', OccurredTo: '', Location: '', FBIID: null, RMSCFSCodeList: null, showLawTitleId: '',
    });

    const [showFields, setShowFields] = useState({
        showIncidentNumber: false, showIncidentNumberTo: false, showReportedDateFrom: false, showReportedDateTo: false, showOccurredFrom: false, showOccurredTo: false, showLocation: false, showFBIID: false, showRMSCFSCodeList: false, showLawTitleId: false,
    });

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [comments]);

    useEffect(() => {
        setShowFields({
            showIncidentNumber: searchValue.IncidentNumber, showIncidentNumberTo: searchValue.IncidentNumberTo, showReportedDateFrom: searchValue.ReportedDate, showReportedDateTo: searchValue.ReportedDateTo, showOccurredFrom: searchValue.OccurredFrom, showOccurredTo: searchValue.OccurredTo, showLocation: searchValue.Location, showFBIID: searchValue.FBIID !== null, showLawTitleId: searchValue.LawTitleId !== null, showRMSCFSCodeList: searchValue.RMSCFSCodeList !== null,
        });
    }, [searchValue]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginPinID(parseInt(localStoreData?.PINID));
            dispatch(get_ScreenPermissions_Data("I097", localStoreData?.AgencyID, localStoreData?.PINID));
            setLoginAgencyID(localStoreData?.AgencyID); setLoginUserName(localStoreData?.UserName)
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);


    // Onload Function
    useEffect(() => {
        if (LoginAgencyID) {
            getAgencyImg(LoginAgencyID);
            getpPropertyImg();
            if (fbiCodesDrpData?.length === 0) { dispatch(get_Incident_Drp_Data(LoginAgencyID)) }
            if (NIBRSDrpData?.length === 0) { dispatch(get_NIBRS_Drp_Data(LoginAgencyID)); }

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


    const get_Incident_Report = () => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Report/GetData_ReportIncident', val).then((res) => {
            if (res.length > 0) {

            } else {

            }
        })
    }

    useEffect(() => {
        if (incidentData?.length > 0) {
            setverifyIncident(true);
        }
    }, [incidentData]);

    const getIncidentCurrentData = async () => {
        const val = {
            'ReportedDate': getShowingWithOutTime(new Date()),
            'ReportedDateTo': getShowingWithOutTime(new Date()),
            'IncidentNumber': null, 'IncidentNumberTo': null,
            'OccurredFrom': null, 'OccurredTo': null,
            'AgencyID': LoginAgencyID
        }
        fetchPostData('Report/GetData_MasterReport', val).then((res) => {
            if (res.length > 0) {
                // console.log(JSON.parse(res[0]?.Incident[0]?.Offence))
                // setIncidentData(res[0].Incident);
                //  setMasterReportData(res[0])
            } else {

            }
        });
    }

    const getRMSCFSCodeList = (LoginAgencyID, FBIID) => {
        const val = { 'FBIID': FBIID, 'AgencyID': LoginAgencyID, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'RMSCFSCodeList', 'Description'))
            } else {
                setRmsCfsID([]);
            }
        })
    }

    const isNotEmpty = (value) => {
        return value !== null && value.trim() !== '';
    }

    const getIncidentSearchData = async (isPrintReport = false) => {
        setLoder(true);

        const {
            IncidentNumber, IncidentNumberTo, ReportedDate, ReportedDateTo, OccurredFrom, OccurredTo, LawTitleId,
            FBIID, RMSCFSCodeList, Location, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
        } = myStateRef.current;

        const isValid = isNotEmpty(ReportedDate) || isNotEmpty(ReportedDateTo) || isNotEmpty(OccurredFrom) || isNotEmpty(OccurredTo) || (LawTitleId !== null && LawTitleId !== '') || isNotEmpty(Location) || isNotEmpty(IncidentNumberTo) || isNotEmpty(IncidentNumber) || (FBIID !== null && FBIID !== '') || (RMSCFSCodeList !== null && RMSCFSCodeList.trim() !== '');

        if (isValid) {
            const val = {
                'IncidentNumber': IncidentNumber, 'IncidentNumberTo': IncidentNumberTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'OccurredFrom': OccurredFrom, 'OccurredTo': OccurredTo, 'LawTitleId': LawTitleId, 'AgencyID': LoginAgencyID, 'FBIID': FBIID, 'RMSCFSCodeList': RMSCFSCodeList, 'Location': Location, 'AgencyID': LoginAgencyID,
                IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'Report/PrintReport' : 'Report/GetData_MasterReport';
                const res = await fetchPostData(apiUrl, val);
                // const res = await fetchPostData('Report/GetData_MasterReport', val);
                if (res.length > 0) {
                    console.log(res)

                    setIncidentData(res[0].Incident);
                    setMasterReportData(res[0]);
                    getpPropertyImg(masterPropertyID, propertyID)
                    getAgencyImg(LoginAgencyID)
                    setSearchValue(value); setLoder(false);
                } else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available");
                        setIncidentData([]);
                        setverifyIncident(false); setLoder(false);
                    }

                }
                setIsPermissionsLoaded(false);
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                // setverifyReport(false);
                setLoder(false);
                setIsPermissionsLoaded(false);

            }
        } else {
            toastifyError("Please Enter Details");
            setLoder(false);
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

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'FBIID') {
                getRMSCFSCodeList(LoginAgencyID, e.value)
                setValue({
                    ...value,
                    [name]: e.value,
                    ['RMSCFSCodeList']: "",
                })
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
        } else {
            if (name === 'FBIID') {
                setRmsCfsID([]);
                setValue({
                    ...value,
                    ['FBIID']: "",
                    ['RMSCFSCodeList']: "",
                })
            } else {
                setValue({
                    ...value,
                    [name]: null
                })
            }
        }
    }


    const resetFields = () => {
        setLocationStatus(true);
        setValue({
            ...value,
            'IncidentNumber': "", 'IncidentNumberTo': "", 'ReportedDate': "", 'LawTitleId': '',
            'ReportedDateTo': "", 'OccurredFrom': "", 'OccurredTo': "", 'Location': "", 'FBIID': null, 'RMSCFSCodeList': null,
        });
        setUpdateStatus(updateStatus + 1); setShowWatermark('');
        //law title
        LawTitleIdDrpDwnVal(LoginAgencyID, null);
        // nibrs code
        NIBRSCodeDrpDwnVal(LoginAgencyID, null);
        //offence code
        getRMSCFSCodeListDrp(LoginAgencyID, null, null);
    }

    const columns = [
        {
            width: '140px',
            name: 'Incident',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            width: '180px',
            name: 'Occured To',
            selector: (row) => row.OccurredTo ? getShowingMonthDateYear(row.OccurredTo) : " ",
        },
        {
            width: '180px',
            name: 'Report Date/Time',
            selector: (row) => row.ReportedDate ? getShowingMonthDateYear(row.ReportedDate) : " ",
            sortable: true
        },
        {
            width: '140px',
            name: 'RMS CFS',
            selector: (row) => <>{row?.RMSCFSCode_Description ? row?.RMSCFSCode_Description.substring(0, 20) : ''}{row?.RMSCFSCode_Description?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Location',
            selector: (row) => <>{row?.CrimeLocation ? row?.CrimeLocation.substring(0, 20) : ''}{row?.CrimeLocation?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
    ]

    const componentRef = useRef();

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

    const getpPropertyImg = (propertyID, masterPropertyID) => {
        const val = { 'PropertyID': propertyID, 'MasterPropertyID': masterPropertyID, }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setPropertyPhoto(imgUrl);
            }
            else { console.log("errror") }
        })
    }

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
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
            printForm(); getIncidentSearchData(true); setShowFooter(false);
        }, 100);
    };

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("I097", localStoreData?.AgencyID, localStoreData?.PINID));
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



    // const changeDropDown = (e, name) => {
    //     if (e) {
    //         if (name === "RMSCFSCodeID") {
    //             setValue({ ...value, [name]: e.value })
    //         }
    //         else if (name === 'FBIID') {
    //             getRMSCFSCodeList(LoginAgencyID, e.value)
    //             setValue({ ...value, [name]: e.value, ['RMSCFSCodeID']: '', });
    //         }
    //     } else if (e === null) {
    //         if (name === 'FBIID') {
    //             getRMSCFSCodeList([]);
    //             setValue({ ...value, ['FBIID']: "", ['RMSCFSCodeID']: "", })
    //         }
    //         else {
    //             setValue({ ...value, [name]: null });
    //         }
    //     }
    //     else {
    //         setValue({ ...value, [name]: null });
    //     }
    // }

    const changeDropDown = (e, name) => {
        if (e) {
            if (name === "RMSCFSCodeID") {
                setValue({ ...value, [name]: e.value });
            }
            else if (name === 'FBIID') {
                getRMSCFSCodeList(LoginAgencyID, e.value);
                setValue({ ...value, [name]: e.value, ['RMSCFSCodeList']: '' });
            }
        } else if (e === null) {
            if (name === 'FBIID') {
                getRMSCFSCodeList([]);
                setValue({ ...value, ['FBIID']: "", ['RMSCFSCodeList']: "" });
            } else {
                setValue({ ...value, [name]: null });
            }
        } else {
            setValue({ ...value, [name]: null });
        }
    };

    const ChangeDropDownCode = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value, })
        } else {
            setValue({ ...value, [name]: null, })
        }
    }
    ///////////////////////////////////////////////////////////////////////////-------------------////////////////////

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
        const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: RMSCFSCodeList };
        const nibrsCodeObj = { AgencyID: loginAgencyID, LawTitleID: null, IncidentID: mainIncidentID, ChargeCodeID: RMSCFSCodeList, };
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
            AgencyID: loginAgencyID,
            FBIID: FBIID,
            LawTitleID: LawTitleID,
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
                    ["RMSCFSCodeList"]: null,
                });
                setChargeCodeDrp([]);
                setNibrsCodeDrp([]);
                // nibrs code
                NIBRSCodeDrpDwnVal(LoginAgencyID, e.value);
                // charge code
                getRMSCFSCodeListDrp(LoginAgencyID, value?.FBIID, e.value);
            } else if (name === "RMSCFSCodeList") {
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
                    ["RMSCFSCodeList"]: null,
                });
                setNibrsCodeDrp([]);
                setChargeCodeDrp([]);

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
            <div class="section-body view_page_design pt-1">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset>
                                    <legend>Incident Master Report</legend>
                                    <div className="form-check ml-2 col-9 col-md-9 col-lg-12 mt-1 pt-1 text-right float-end">
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
                                    <div className="row align-items-center" style={{ rowGap: "8px" }}>
                                        <div className="col-3 col-md-3 col-lg-2 ">
                                            <label htmlFor="" className='new-label mb-0'>Incident Number From</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-0 ">
                                            <input type="text" name='IncidentNumber' id='IncidentNumber' value={value.IncidentNumber} onChange={handleChange} className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-4">
                                            <label htmlFor="" className='new-label mb-0'>Incident Number To</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-0 ">
                                            <input type="text" name='IncidentNumberTo'
                                                // disabled={!value.IncidentNumber}
                                                disabled={!value?.IncidentNumber?.trim()}
                                                className={!value?.IncidentNumber?.trim() ? 'readonlyColor' : ''}
                                                id='IncidentNumberTo' value={value.IncidentNumberTo} onChange={handleChange} />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2">
                                            <label htmlFor="" className='new-label mb-0'>Reported From Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3">
                                            <DatePicker
                                                name='ReportedDate'
                                                id='ReportedDate'
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => {
                                                    if (date) {
                                                        setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null })
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
                                                timeInputLabel
                                                isClearable={value?.ReportedDate ? true : false}
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
                                        <div className="col-3 col-md-3 col-lg-4">
                                            <label htmlFor="" className='new-label mb-0'>Reported To Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3">
                                            <DatePicker
                                                name='ReportedDateTo'
                                                id='ReportedDateTo'
                                                onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                ref={startRef1}
                                                onKeyDown={onKeyDown}
                                                isClearable={value?.ReportedDateTo ? true : false}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                // disabled={value?.ReportedDate ? false : true}
                                                maxDate={new Date(datezone)}
                                                placeholderText='Select...'
                                                minDate={new Date(value?.ReportedDate)}
                                                disabled={value?.ReportedDate ? false : true}
                                                className={!value?.ReportedDate && 'readonlyColor'}

                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2  ">
                                            <label htmlFor="" className='new-label mb-0'>Occurred From Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3">
                                            <DatePicker
                                                name='OccurredFrom'
                                                id='OccurredFrom'
                                                ref={startRef2}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => {
                                                    if (date) {
                                                        setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null })
                                                    } else {
                                                        setValue({ ...value, ['OccurredFrom']: null, ['OccurredTo']: null })
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
                                        <div className="col-3 col-md-3 col-lg-4">
                                            <label htmlFor="" className='new-label mb-0'>Occurred To Date</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3">
                                            <DatePicker
                                                id='OccurredTo'
                                                name='OccurredTo'
                                                ref={startRef3}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setValue({ ...value, ['OccurredTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                dateFormat="MM/dd/yyyy"
                                                isClearable={value?.OccurredTo ? true : false}
                                                // disabled={value?.OccurredFrom ? false : true}
                                                selected={value?.OccurredTo && new Date(value?.OccurredTo)}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                minDate={new Date(value?.OccurredFrom)}
                                                maxDate={new Date(datezone)}
                                                placeholderText={'Select...'}
                                                showDisabledMonthNavigation
                                                autoComplete="off"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                disabled={value?.OccurredFrom ? false : true}
                                                className={!value?.OccurredFrom && 'readonlyColor'}
                                            />
                                        </div>


                                        <div className="col-4 col-md-4 col-lg-2">
                                            <label htmlFor="" className='new-label mb-0'> Law Title</label>
                                        </div>
                                        <div className="col-7 col-md-7 col-lg-3">
                                            <Select
                                                name="LawTitleId"
                                                value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                                                options={lawTitleIdDrp}
                                                isClearable
                                                onChange={(e) => onChangeDrpLawTitle(e, "LawTitleId")}
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4">
                                            <label htmlFor="" className="new-label text-nowrap mb-0">   TIBRS Code
                                                <br />
                                            </label>
                                        </div>


                                        <div className="col-7 col-md-7 col-lg-3">
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

                                        <div className="col-4 col-md-4 col-lg-2 "  >
                                            <label htmlFor="" className='new-label mb-0'>Offense Code/Name</label>
                                            <br />
                                        </div>
                                        <div className="col-7 col-md-7 col-lg-10">
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



                                        <div className="col-3 col-md-3 col-lg-2 ">
                                            <label htmlFor="" className='new-label mb-0'>Location</label>
                                        </div>
                                        <div className="col-9 col-md-9 col-lg-10 mt-0 text-field">
                                            {/* <input type="text" name='Location' value={value?.Location} onChange={handleChange} id='Location' className='' /> */}
                                            <Location
                                                {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setChangesStatus, setStatesChangeStatus }}
                                                col='Location'
                                                locationID='crimelocationid'
                                                check={false}
                                                verify={true}
                                                style={{ resize: 'both' }}
                                            />
                                            {/* <Location {...{ setValue, value, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation }} col='Location' locationID='crimelocationid' check={true} verify={true} /> */}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                {
                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
                                        : <></> :
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
                                }
                                <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyIncident(false); setIncidentData([]); resetFields(); }}>Clear</button>
                                <Link to={`${reportedData.length > 0 ? '/incidenttab' : '/Reports'}`}>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* for 1 table */}
            {
                verifyIncident ?
                    incidentData?.length > 0 ?
                        <>
                            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">Incident Master Report</p>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            {/* <i className="fa fa-print" onClick={printForm}></i> */}
                                            <i className="fa fa-print" onClick={handlePrintClick}></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div className="container mt-1 position-relative"  >
                                <div className="print-page">
                                    <div className="row printable-area" ref={componentRef} >
                                        <table className="print-table" >
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className='content row '>
                                                            <>
                                                                <ReportAddress {...{ multiImage, masterReportData }} />
                                                            </>
                                                            {showWatermark && (
                                                                <div className="watermark-print">Confidential</div>
                                                            )}


                                                            <div className="col-12">
                                                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                                <h5 className="text-center text-white text-bold bg-green  py-1" >Master Incident Report</h5>
                                                            </div>
                                                            <div className="col-12  ">
                                                                <fieldset>
                                                                    <legend>Search Criteria</legend>
                                                                    <div className="row">
                                                                        {showFields.showIncidentNumber && (
                                                                            <>
                                                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                                                    <label className="new-label">Incident Number</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-8 col-md-3 text-field mt-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="readonlyColor form-control"
                                                                                        value={searchValue.IncidentNumber || ""}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {showFields.showIncidentNumberTo && (
                                                                            <>
                                                                                <div className="col-12 col-sm-4 col-md-4 mt-2">
                                                                                    <label className="new-label">Incident Number To</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-8 col-md-3 text-field mt-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="readonlyColor form-control"
                                                                                        value={searchValue.IncidentNumberTo || ""}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {showFields.showReportedDateFrom && (
                                                                            <>
                                                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                                                    <label className="new-label">Reported Date From</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-8 col-md-3 text-field mt-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="readonlyColor form-control"
                                                                                        value={
                                                                                            searchValue.ReportedDate
                                                                                                ? getShowingWithOutTime(searchValue.ReportedDate)
                                                                                                : ""
                                                                                        }
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {showFields.showReportedDateTo && (
                                                                            <>
                                                                                <div className="col-12 col-sm-4 col-md-4 mt-2">
                                                                                    <label className="new-label">Reported Date To</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-8 col-md-3 text-field mt-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="readonlyColor form-control"
                                                                                        value={
                                                                                            searchValue.ReportedDateTo
                                                                                                ? getShowingWithOutTime(searchValue.ReportedDateTo)
                                                                                                : ""
                                                                                        }
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {showFields.showOccurredFrom && (
                                                                            <>
                                                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                                                    <label className="new-label">Occurred From Date</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-8 col-md-3 text-field mt-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="readonlyColor form-control"
                                                                                        value={
                                                                                            searchValue.OccurredFrom
                                                                                                ? getShowingWithOutTime(searchValue.OccurredFrom)
                                                                                                : ""
                                                                                        }
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {showFields.showOccurredTo && (
                                                                            <>
                                                                                <div className="col-12 col-sm-4 col-md-4 mt-2">
                                                                                    <label className="new-label">Occurred To Date</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-8 col-md-3 text-field mt-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="readonlyColor form-control"
                                                                                        value={
                                                                                            searchValue.OccurredTo
                                                                                                ? getShowingWithOutTime(searchValue.OccurredTo)
                                                                                                : ""
                                                                                        }
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                        {showFields.showLocation && (
                                                                            <>
                                                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                                                    <label className="new-label">Location</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-8 col-md-3 text-field mt-1">
                                                                                    <input
                                                                                        type="text"
                                                                                        className="readonlyColor form-control"
                                                                                        value={searchValue.Location || ""}
                                                                                        readOnly
                                                                                    />
                                                                                </div>
                                                                            </>
                                                                        )}

                                                                        {showFields.showLawTitleId && searchValue.LawTitleId && (
                                                                            <>
                                                                                <div className="col-12 col-sm-3 col-md-1 mt-2">
                                                                                    <label className="new-label">Law Title</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-9 col-md-5 text-field mt-1">
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
                                                                                <div className="col-12 col-sm-2 col-md-1 mt-2">
                                                                                    <label className="new-label">TIBRS Code</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-10 col-md-5 text-field mt-1">
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
                                                                                <div className="col-12 col-sm-4 col-md-2 mt-2">
                                                                                    <label className="new-label">Offense Code</label>
                                                                                </div>
                                                                                <div className="col-12 col-sm-8 col-md-10 text-field mt-1">
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

                                                            {
                                                                masterReportData?.Incident?.map((obj) =>
                                                                    <>
                                                                        <div className="container mb-1 px-2 incident_bg  footer_margin">
                                                                            <h5 className=" text-white text-bold bg-green py-1 px-3"> Incident Number:- {obj.IncidentNumber}</h5>
                                                                            {/* incident */}
                                                                            <div className="col-12  mb-2 pb-2 py-2" style={{ border: '1px solid #80808085', }}>
                                                                                <div className="container">
                                                                                    <div className="col-12 mb-2">
                                                                                        <h6 className=' text-dark mt-2'>Incident Information</h6>
                                                                                        <div className="row px-3" >
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.IncidentNumber}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Incident Number</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.ReportedDate ? getShowingDateText(obj.ReportedDate) : ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Reported Date</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.BIBRSDate ? getShowingDateText(obj.BIBRSDate) : ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>TIBRS Date</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            {/* <div className="col-2"></div> */}
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4 ">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.OccurredFrom ? getShowingDateText(obj.OccurredFrom) : ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Occurred From</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            {/* <div className="col-1"></div> */}
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4 ">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.OccurredTo ? getShowingDateText(obj.OccurredTo) : ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Occurred To</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.ReceiveSource}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>How Reported</label>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.isPoliceForceApplied}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Use of Force Applied</label>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.OfficerName}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Primary Officer</label>
                                                                                                </div>
                                                                                            </div>


                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.NIBRSStatus}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Case Status</label>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-9 col-md-9 col-lg-10 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.CrimeLocation}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary Crime_Location '>Crime Location</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-3 col-md-3 col-lg-2 mt-4 pt-3">
                                                                                                <div className=''>
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        name=""
                                                                                                        id=""
                                                                                                        checked={obj && Object.keys(obj).length > 0 ? obj.IsVerify : false}
                                                                                                        disabled={!obj || Object.keys(obj).length === 0}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary pl-2'>Verified</label>

                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-12 col-md-12 col-lg-12 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.OffenseType}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Offense Type</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-12 col-md-12 col-lg-12 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                        value={obj.RMS_Disposition}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Exceptional Clearance(Yes/No)</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-6 col-lg-6 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                        value={obj.NIBRSClearance || ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Exceptional Clearance Code</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-6 col-lg-6 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                        value={obj.NIBRSclearancedate ? getShowingDateText(obj.NIBRSclearancedate) : ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Exceptional Clearance Date/Time</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-6 col-lg-6 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                        value={obj.CADCFSCode_Description}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>CAD CFS Code</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-6 col-lg-6 mt-4">
                                                                                                <div className='text-field'>
                                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                        value={obj.CADDispositions_Description || ''}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>CAD Disposition</label>
                                                                                                </div>
                                                                                            </div>

                                                                                        </div>

                                                                                    </div>
                                                                                </div>
                                                                                {/* pin-activity */}
                                                                                <div className="col-12  " >
                                                                                    {
                                                                                        JSON.parse(obj?.PINActivity)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container">
                                                                                                    <h6 className=' text-dark mt-2'>PIN Activity</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.PINActivity)?.map((item, key) => (
                                                                                                                <div className="row  px-3 ">
                                                                                                                    <div className="col-12 mb-2" >
                                                                                                                        <div className="row ">
                                                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                                <div className="text-field">
                                                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                        // value={item.ActivityDateTime ? getShowingDateText(obj.ActivityDateTime) : ''}
                                                                                                                                        // value={item.ActivityDateTime}
                                                                                                                                        value={item.ActivityDateTime ? getShowingDateText(item.ActivityDateTime) : ''}

                                                                                                                                    />
                                                                                                                                    <label htmlFor="" className='new-summary'>Date/Time</label>

                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                                <div className="text-field">
                                                                                                                                    <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                        value={item.OfficerName}
                                                                                                                                    />
                                                                                                                                    <label htmlFor="" className='new-summary'>Officer Name</label>

                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                                <div className="text-field">
                                                                                                                                    <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                        value={item.ActivityRole}
                                                                                                                                    />
                                                                                                                                    <label htmlFor="" className='new-summary'>Role</label>

                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                                <div className="text-field">
                                                                                                                                    <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                        value={item.ActivityStatus}
                                                                                                                                    />
                                                                                                                                    <label htmlFor="" className='new-summary'>Activity Details</label>

                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                                <div className="text-field">
                                                                                                                                    <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                        value={item.ResourceNumber}
                                                                                                                                    />
                                                                                                                                    <label htmlFor="" className='new-summary'>Module</label>

                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                                <div className="text-field">
                                                                                                                                    <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                        value={item.ShiftDescription}
                                                                                                                                    />
                                                                                                                                    <label htmlFor="" className='new-summary'>Shift</label>

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
                                                                                {/* type of secruity */}
                                                                                <div className="col-12  ">
                                                                                    {
                                                                                        JSON.parse(obj?.IncidentSecurity)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container ">
                                                                                                    <h6 className=' text-dark mt-2'>Types Of Security</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.IncidentSecurity)?.map((item, key) => (
                                                                                                                <div className="row  px-3 ">
                                                                                                                    <div className="col-12 mb-2" >
                                                                                                                        <div className="row ">
                                                                                                                            <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                                                                {/* <div className="text-field">
                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                value={item.Security_Description}
                                                                                                            />
                                                                                                            <label htmlFor="" className='new-summary'>Types Of Security</label>

                                                                                                        </div> */}
                                                                                                                                <label htmlFor="" className='new-summary'>Types Of Security</label>
                                                                                                                                <div
                                                                                                                                    className="readonlyColor "
                                                                                                                                    style={{
                                                                                                                                        border: '1px solid #ccc',
                                                                                                                                        borderRadius: '4px',
                                                                                                                                        padding: '10px',
                                                                                                                                        backgroundColor: '#f9f9f9',
                                                                                                                                        lineBreak: 'anywhere'
                                                                                                                                    }}
                                                                                                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.Security_Description) }}
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
                                                                               
                                                                               
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )
                                                            }

                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                            
                                            <tfoot>
                                                <tr>
                                                    <div className="footer-space"></div>
                                                </tr>
                                            </tfoot>
                                        </table>

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
            {/* {loder && <Loader />} */}
            {loder && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )}

        </>
    )
}

export default MasterIncident