import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor, getShowingWithOutTime } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { AgencyContext } from '../../../../Context/Agency/Index';
import { fetchPostData } from '../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../Common/ChangeArrayFormat';
import { toastifyError } from '../../../Common/AlertMsg';
import { useDispatch, useSelector } from 'react-redux';
import { get_AgencyOfficer_Data, get_ArrestJuvenileDis_DrpData, get_ArrestType_Drp, get_Arresting_DropDown, get_NIBRS_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import Location from '../../../Location/Location';

const ArrestSearchPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const arrestTypeDrpData = useSelector((state) => state.DropDown.arrestTypeDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const arrestJuvenileDisDrpData = useSelector((state) => state.DropDown.arrestJuvenileDisDrpData);
    const arrestingDrpData = useSelector((state) => state.DropDown.arrestingDrpData);
    const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);


    const { get_Police_Force, setArrestSearchData, GetDataTimeZone, datezone, setChangesStatus, recentSearchData, setRecentSearchData } = useContext(AgencyContext)
    const [arrestfromDate, setArrestfromDate] = useState();
    const [arresttoDate, setArresttoDate] = useState();
    // const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [locationStatus, setLocationStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [onSelectLocation, setOnSelectLocation] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    //NIBRS Code
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    // Offense Code/Name
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(nibrsCodeDrp);

    const [value, setValue] = useState({
        'ArrestNumber': '', 'ArrestNumberTo': '', 'IncidentNumber': '', 'DLNumber': '', 'ArrestDtTm': '', 'ArrestDtTmTo': '',
        'ArrestTypeID': null, 'ArrestingAgency': '', 'JuvenileDispositionID': null, 'LastName': '', 'AgencyID': '', 'LawTitleId': '',
        'FirstName': '', 'MiddleName': '', 'SSN': '', 'PrimaryOfficerID': null, 'ChargeCodeID': null,
        'NIBRSID': null, 'Location': '', 'FBIID': '', 'SBI': '',
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
            setloginAgencyID(parseInt(localStoreData?.AgencyID)); setloginPinID(parseInt(localStoreData?.PINID));
            dispatch(get_ScreenPermissions_Data("A108", localStoreData?.AgencyID, localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            get_ChargeCode_Drp_Data(loginAgencyID);
            if (NIBRSDrpData?.length === 0) { dispatch(get_NIBRS_Drp_Data(loginAgencyID)); }
            if (arrestTypeDrpData?.length === 0) dispatch(get_ArrestType_Drp(loginAgencyID));
            if (agencyOfficerDrpData?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)) }
            if (arrestJuvenileDisDrpData?.length === 0) dispatch(get_ArrestJuvenileDis_DrpData(loginAgencyID));
            if (arrestingDrpData?.length === 0) dispatch(get_Arresting_DropDown(loginAgencyID));
        }
        get_Police_Force();
    }, [loginAgencyID])

    useEffect(() => {
        if (loginAgencyID) {
            // lawtitle drp
            LawTitleIdDrpDwnVal(loginAgencyID, null);
            // FBIID
            NIBRSCodeDrpDwnVal(loginAgencyID, 0);
            // charge / offence codeName
            getRMSCFSCodeListDrp(loginAgencyID, 0, 0);
        }
    }, [loginAgencyID,]);

    // const get_Data_Arrest = async () => {
    //     if (value?.ArrestNumber?.trim() || value?.ArrestNumberTo?.trim() || value?.IncidentNumber?.trim() ||
    //         value?.ArrestDtTm?.trim() || value?.ArrestDtTmTo?.trim() || value?.ArrestTypeID || value?.ArrestingAgency?.trim() ||
    //         value?.JuvenileDispositionID || value?.LastName?.trim() || value?.FirstName?.trim() || value?.MiddleName?.trim() ||
    //         value?.DLNumber?.trim() || value?.SSN?.trim() || value?.PrimaryOfficerID || value?.LawTitleId || value?.ChargeCodeID || value?.NIBRSID ||
    //         value?.FBIID || value?.SBI || value?.Location || value?.IPAddress
    //     ) {
    //         const {
    //             AgencyID, PINID, ArrestNumber, ArrestNumberTo, IncidentNumber, ArrestDtTm, ArrestDtTmTo, ArrestTypeID, ArrestingAgency, JuvenileDispositionID, LastName, FirstName, MiddleName, SSN, DLNumber, PrimaryOfficerID, LawTitleId, ChargeCodeID, NIBRSID, Location, FBIID, SBI,
    //             IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
    //         } = myStateRef.current;
    //         const payload = {
    //             AgencyID: loginAgencyID, PINID: loginPinID, ArrestNumber, ArrestNumberTo, IncidentNumber, ArrestDtTm, ArrestDtTmTo, ArrestTypeID, ArrestingAgency, JuvenileDispositionID, LastName, FirstName, MiddleName, SSN, DLNumber, PrimaryOfficerID, LawTitleID: LawTitleId, ChargeCodeID, NIBRSID, Location, FBIID, SBI, IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, ReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
    //         };
    //         const res = await fetchPostData("Arrest/Search_Arrest", payload);
    //         if (res.length > 0) {
    //             setArrestSearchData(res); reset(); navigate('/arrest-search');
    //         } else {
    //             toastifyError("Data Not Available"); setArrestSearchData([]); reset();
    //         }
    //     } else { toastifyError("Please Enter Details"); }
    // };

    const get_Data_Arrest = async () => {
        if (value?.ArrestNumber?.trim() || value?.ArrestNumberTo?.trim() || value?.IncidentNumber?.trim() ||
            value?.ArrestDtTm?.trim() || value?.ArrestDtTmTo?.trim() || value?.ArrestTypeID || value?.ArrestingAgency?.trim() ||
            value?.JuvenileDispositionID || value?.LastName?.trim() || value?.FirstName?.trim() || value?.MiddleName?.trim() ||
            value?.DLNumber?.trim() || value?.SSN?.trim() || value?.PrimaryOfficerID || value?.LawTitleId || value?.ChargeCodeID || value?.NIBRSID ||
            value?.FBIID || value?.SBI || value?.Location || value?.IPAddress || value?.isSelfAgency || value?.isAllAgencies
        ) {
            const {
                AgencyID, PINID, ArrestNumber, ArrestNumberTo, IncidentNumber, ArrestDtTm, ArrestDtTmTo, ArrestTypeID, ArrestingAgency, JuvenileDispositionID, LastName, FirstName, MiddleName, SSN, DLNumber, PrimaryOfficerID, LawTitleId, ChargeCodeID, NIBRSID, Location, FBIID, SBI,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, isSelfAgency, isAllAgencies
            } = myStateRef.current;

            const payload = {
                PINID: loginPinID, ArrestNumber, ArrestNumberTo, IncidentNumber, ArrestDtTm, ArrestDtTmTo, ArrestTypeID, ArrestingAgency, JuvenileDispositionID, LastName, FirstName, MiddleName, SSN, DLNumber, PrimaryOfficerID, LawTitleID: LawTitleId, ChargeCodeID, NIBRSID, Location, FBIID, SBI, IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, ReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
                "AgencyID":
                    isSelfAgency && isAllAgencies
                        ? loginAgencyID
                        : isAllAgencies
                            ? ""
                            : loginAgencyID,
                "SearchFlag":
                    (isSelfAgency && isAllAgencies) ||
                    (isAllAgencies && !isSelfAgency),
            };
            const apiEndpoint = "Arrest/Search_Arrest";
            const res = await fetchPostData(apiEndpoint, payload);
            if (res.length > 0) {
                setArrestSearchData(res);
                navigate('/arrest-search');
                reset();
                // Add to Recent Search
                setRecentSearchData([...recentSearchData, { ...payload, SearchModule: 'Arr-Search' }]);
            } else {
                setArrestSearchData([]); toastifyError("Data Not Available");
                // setIsPermissionsLoaded(false)
            }
        } else { toastifyError("Please Enter Details"); }
    };

    const get_ChargeCode_Drp_Data = (loginAgencyID, FBIID) => {
        // const val = { 'AgencyID': loginAgencyID, 'FBIID': FBIID }
        // fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
        //     if (data) {
        //         setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
        //     }
        //     else { setChargeCodeDrp([]); }
        // })
    }

    const reset = () => {
        setIsPermissionsLoaded(false)
        setValue({
            ...value,
            'ArrestNumber': null, 'ArrestNumberTo': null, 'IncidentNumber': null, 'ArrestDtTm': null, 'ArrestDtTmTo': null, 'ArrestTypeID': null, 'ArrestingAgency': null, 'DLNumber': null, 'JuvenileDispositionID': null, 'LastName': null, 'FirstName': null, 'MiddleName': null, 'SSN': null, 'PrimaryOfficerID': null, 'ChargeCodeID': null, 'NIBRSID': null, 'Location': null, 'FBIID': null, 'SBI': null, "LawTitleId": '', isAllAgencies: false,
            isSelfAgency: true
        });
        setArresttoDate(null); setArrestfromDate(null);
    }

    const HandleChange = (e) => {
        if (e.target.name === 'SSN') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) { setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] }) }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({ ...value, [e.target.name]: ele })
            }
            if (e.target.name === 'SSN') { return 'true'; }
            if (e.target.name.length === 11) { return 'true' }
        }
        // else if (e.target.name === 'IncidentNumber') {
        //     let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
        //     if (ele.length === 8) {
        //         const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
        //         const match = cleaned.match(/^(\d{2})(\d{6})$/);
        //         if (match) {
        //             setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] })
        //         }
        //     } else {
        //         ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
        //         setValue({ ...value, [e.target.name]: ele })
        //     }
        // }
        else if (e.target.name === 'ArrestNumber' || e.target.name === 'ArrestNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'ArrestNumber' && setValue({
                    ...value, ['ArrestNumberTo']: "", [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'isSelfAgency' || e.target.name === 'isAllAgencies') {
            setValue({ ...value, [e.target.name]: e.target.checked })
        }

        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'NIBRSID') {
                get_ChargeCode_Drp_Data(e.value);
                setValue({ ...value, [name]: e.value, ['ChargeCodeID']: '', });
            } else {
                setValue({ ...value, [name]: e.value, });
            }
        } else if (e === null) {
            if (name === 'NIBRSID') {
                get_ChargeCode_Drp_Data([]);
                setValue({ ...value, ['NIBRSID']: "", ['ChargeCodeID']: "", });
            } else {
                setValue({ ...value, [name]: null });
            }
        } else {
            setValue({ ...value, [name]: null })
        }
    }

    const onClose = () => {
        navigate('/dashboard-page'); reset();
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    const changeDropDown1 = (e, name) => {
        if (e) {
            if (name === 'NIBRSID') {
                get_ChargeCode_Drp_Data(loginAgencyID, e.value)
                setValue({ ...value, [name]: e.value, ['ChargeCodeID']: '', });
            }
            else {
                setValue({ ...value, [name]: e.value, })
            }
        } else if (e === null) {
            if (name === 'NIBRSID') {
                setChargeCodeDrp([]);
                setValue({ ...value, ['NIBRSID']: "", ['ChargeCodeID']: "", })
            }
            else {
                setValue({ ...value, [name]: null });
            }
        }
        else {
            setValue({ ...value, [name]: null });
        }
    }

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
            get_Data_Arrest()
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);

    useEffect(() => {
        myStateRef.current = value;
    }, [value])

    //-----------------------------------------------------//--------------------------------------
    const onChangeNIBRSCode = (e, name) => {
        if (e) {
            if (name === "FBIID") {
                setValue({ ...value, ["FBIID"]: e.value, ["ChargeCodeID"]: null, });
                setChargeCodeDrp([]);
                getRMSCFSCodeListDrp(loginAgencyID, e.value, value?.LawTitleId);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "FBIID") {
                setValue({
                    ...value, [name]: null, ["ChargeCodeID"]: null,
                });
                NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
                getRMSCFSCodeListDrp(loginAgencyID, null, value?.LawTitleId);
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

    const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, ChargeCodeID, mainIncidentID) => {
        const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID };
        const nibrsCodeObj = { AgencyID: loginAgencyID, LawTitleID: null, IncidentID: mainIncidentID, ChargeCodeID: ChargeCodeID, };
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
                LawTitleId: lawTitleArr[0]?.value, FBIID: nibrsArr[0]?.value, ChargeCodeID: ChargeCodeID,
            });
        } catch (error) {
            console.error("Error during data fetching:", error);
        }
    };

    const getRMSCFSCodeListDrp = (loginAgencyID, FBIID, LawTitleId) => {
        const val = {
            AgencyID: loginAgencyID, FBIID: FBIID, LawTitleID: LawTitleId,
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

    const LawTitleIdDrpDwnVal = async (loginAgencyID, ChargeCodeID) => {
        const val = { AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID };
        await fetchPostData("LawTitle/GetDataDropDown_LawTitle", val).then(
            (data) => {
                if (data) {
                    setLawTitleIdDrp(Comman_changeArrayFormat(data, "LawTitleID", "Description"));
                } else {
                    setLawTitleIdDrp([]);
                }
            }
        );
    };

    const NIBRSCodeDrpDwnVal = (loginAgencyID, LawTitleId, mainIncidentID) => {
        const val = {
            AgencyID: loginAgencyID, LawTitleID: LawTitleId ? LawTitleId : null, IncidentID: mainIncidentID,
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
                setValue({ ...value, ["LawTitleId"]: e.value, ["FBIID"]: null, ["ChargeCodeID"]: null, });
                setChargeCodeDrp([]); setNibrsCodeDrp([]);
                // nibrs code
                NIBRSCodeDrpDwnVal(loginAgencyID, e.value);
                // charge code
                getRMSCFSCodeListDrp(loginAgencyID, value?.FBIID, e.value);
            } else if (name === "ChargeCodeID") {
                const res = await getLawTitleNibrsByCharge(loginAgencyID, value?.LawTitleId, e.value);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "LawTitleId") {
                setValue({ ...value, ["LawTitleId"]: null, ["FBIID"]: "", ["ChargeCodeID"]: null, });
                setNibrsCodeDrp([]); setChargeCodeDrp([]);
                //law title
                LawTitleIdDrpDwnVal(loginAgencyID, null);
                // nibrs code
                NIBRSCodeDrpDwnVal(loginAgencyID, null);
                //offence code
                getRMSCFSCodeListDrp(loginAgencyID, null, null);
            } else if (name === "ChargeCodeID") {
                setValue({ ...value, ["ChargeCodeID"]: null });
                // nibrs code
                NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
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
        <div className=" section-body pt-3 p-1 bt" >
            <div className="div">
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">
                            <div className="card-body" >
                                <div className="btn-box text-right  mr-1 mb-2">
                                    {
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button>
                                            : <></> :
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button>
                                    }
                                    <button type="button" onClick={() => onClose()} className="btn btn-sm btn-success mr-1" >Close</button>
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
                                        <fieldset >
                                            <legend>Arrest Information</legend>
                                            <div className="row align-items-center mt-1" style={{ rowGap: "8px" }}>
                                                <div className="col-2 col-md-2 col-lg-2 ">
                                                    <label htmlFor="" className='new-label mb-0'>Incident #</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field mt-0">
                                                    <input type="text" id='IncidentNumber' name='IncidentNumber' value={value?.IncidentNumber} onChange={HandleChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-6"></div>

                                                <div className="col-2 col-md-2 col-lg-2 ">
                                                    <label htmlFor="" className='new-label mb-0'>Arrest Number From</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field mt-0">
                                                    <input type="text" id='ArrestNumber' name='ArrestNumber' maxLength={16} value={value?.ArrestNumber} onChange={HandleChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-3">
                                                    <label htmlFor="" className='new-label mb-0'>Arrest Number To</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field mt-0">
                                                    <input type="text" id='ArrestNumberTo' disabled={!value?.ArrestNumber?.trim()}
                                                        className={!value?.ArrestNumber?.trim() ? 'readonlyColor' : ''} name='ArrestNumberTo' value={value?.ArrestNumberTo} onChange={HandleChange} />

                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label htmlFor="" className='new-label mb-0'>Arrest From Date</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-0 ">
                                                    <DatePicker
                                                        id='ArrestDtTm'
                                                        name='ArrestDtTm'
                                                        ref={startRef}
                                                        onKeyDown={onKeyDown}
                                                        onChange={(date) => { setArrestfromDate(date); setValue({ ...value, ['ArrestDtTm']: date ? getShowingWithOutTime(date) : null, ['ArrestDtTmTo']: date ? value.ArrestDtTmTo : null }) }}
                                                        className=''
                                                        dateFormat="MM/dd/yyyy"
                                                        autoComplete='Off'
                                                        timeInputLabel
                                                        maxDate={new Date(datezone)}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        isClearable
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        dropdownMode="select"
                                                        selected={arrestfromDate}
                                                        placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-3">
                                                    <label htmlFor="" className='new-label mb-0'>Arrest To Date</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-0">
                                                    <DatePicker
                                                        id='ArrestDtTmTo'
                                                        name='ArrestDtTmTo'
                                                        ref={startRef1}
                                                        onKeyDown={onKeyDown}
                                                        onChange={(date) => { setArresttoDate(date); setValue({ ...value, ['ArrestDtTmTo']: date ? getShowingWithOutTime(date) : null }) }}
                                                        dateFormat="MM/dd/yyyy"
                                                        autoComplete='Off'
                                                        timeInputLabel
                                                        showMonthDropdown
                                                        minDate={arrestfromDate}
                                                        maxDate={new Date(datezone)}
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        placeholderText={value?.ArrestDtTmTo ? value.ArrestDtTmTo : 'Select...'}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        isClearable={value?.ArrestDtTmTo ? true : false}
                                                        selected={value?.ArrestDtTmTo && new Date(value?.ArrestDtTmTo)}
                                                        disabled={!value?.ArrestDtTm}
                                                        className={!value?.ArrestDtTm ? 'readonlyColor' : ''}
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label htmlFor="" className='new-label mb-0'>Arrest Type</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-0">
                                                    <Select
                                                        name='ArrestTypeID'
                                                        styles={colourStyles}
                                                        value={arrestTypeDrpData?.filter((obj) => obj.value === value?.ArrestTypeID)}
                                                        isClearable
                                                        options={arrestTypeDrpData}
                                                        onChange={(e) => { ChangeDropDown(e, 'ArrestTypeID') }}
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-3">
                                                    <label htmlFor="" className='new-label mb-0'>Arresting Officer</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-0">
                                                    <Select
                                                        name='PrimaryOfficerID'
                                                        styles={colourStyles}
                                                        menuPlacement='bottom'
                                                        value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                                        isClearable
                                                        options={agencyOfficerDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                                        placeholder="Select..."
                                                    />
                                                </div>


                                                <div className="col-4 col-md-4 col-lg-2 mt-0 ">
                                                    <label htmlFor="" className='new-label mb-0'> Law Title</label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-3">
                                                    <Select
                                                        name="LawTitleId"
                                                        value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                                                        options={lawTitleIdDrp}
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        onChange={(e) => onChangeDrpLawTitle(e, "LawTitleId")}
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 ">
                                                    <label htmlFor="" className="new-label text-nowrap mb-0" >   TIBRS Code
                                                        <br />
                                                    </label>
                                                </div>

                                                <div className="col-7 col-md-7 col-lg-3">
                                                    <Select
                                                        name="FBIID"
                                                        styles={customStylesWithOutColor}
                                                        value={nibrsCodeDrp?.filter((obj) => obj.value === value?.FBIID)}
                                                        options={filteredOptions.length > 0 ? filteredOptions : nibrsCodeDrp}
                                                        onInputChange={handleInputChange}
                                                        isClearable
                                                        onChange={(e) => onChangeNIBRSCode(e, "FBIID")}
                                                        placeholder="Select..."
                                                        menuPlacement='bottom'
                                                    />
                                                </div>

                                                <div className="col-4 col-md-4 col-lg-2">
                                                    <label htmlFor="" className='new-label mb-0'>Offense Code/Name</label>
                                                    <br />
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-9">
                                                    <Select
                                                        name="ChargeCodeID"
                                                        styles={customStylesWithOutColor}
                                                        value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                                                        isClearable
                                                        options={chargeCodeDrp}
                                                        onChange={(e) => onChangeDrpLawTitle(e, "ChargeCodeID")}
                                                        placeholder="Select..."
                                                        menuPlacement='bottom'
                                                    />
                                                </div>

                                                {/* <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                    <label htmlFor="" className='new-label'> NIBRS Code/Name</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3 mt-1">
                                                    <Select
                                                        name='NIBRSID'
                                                        styles={customStylesWithOutColor}
                                                        value={NIBRSDrpData?.filter((obj) => obj.value === value?.NIBRSID)}
                                                        isClearable
                                                        options={NIBRSDrpData}
                                                        onChange={(e) => changeDropDown1(e, 'NIBRSID')}
                                                        placeholder="Select..."
                                                        menuPlacement='bottom'
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Charge Code/Description</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-3 mt-1">
                                                    <Select
                                                        name='ChargeCodeID'
                                                        styles={customStylesWithOutColor}
                                                        value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                                                        isClearable
                                                        options={chargeCodeDrp}
                                                        menuPlacement='bottom'
                                                        onChange={(e) => changeDropDown1(e, 'ChargeCodeID')}
                                                        placeholder="Select..."
                                                        isDisabled={!value?.NIBRSID}
                                                        className={!value?.NIBRSID ? 'readonlyColor' : ''}
                                                    />
                                                </div> */}




                                                <div className="col-2 col-md-2 col-lg-2">
                                                    <label htmlFor="" className='new-label mb-0'>Arresting Agency</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-0 text-field">
                                                    <input type="text" name='ArrestingAgency' id='ArrestingAgency' value={value?.ArrestingAgency} onChange={HandleChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-3 mt-0 ">
                                                    <label htmlFor="" className='new-label mb-0'>Juvenile Disposition</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-0 text-field ">
                                                    <Select
                                                        name='JuvenileDispositionID'
                                                        menuPlacement='bottom'
                                                        styles={colourStyles}
                                                        value={arrestJuvenileDisDrpData?.filter((obj) => obj.value === value?.JuvenileDispositionID)}
                                                        isClearable
                                                        options={arrestJuvenileDisDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'JuvenileDispositionID')}
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2">
                                                    <label htmlFor="" className='new-label mb-0'>Location</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-9 mt-0 text-field">
                                                    <Location
                                                        {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setChangesStatus, setStatesChangeStatus }}
                                                        col='Location'
                                                        locationID='crimelocationid'
                                                        check={false}
                                                        verify={true}
                                                        style={{ resize: 'both' }}
                                                    />
                                                    {/* <input type="text" name='Location' value={value?.Location} onChange={HandleChange} id='Location' className='' /> */}
                                                </div>

                                            </div>

                                        </fieldset>
                                        <fieldset>
                                            <legend>Arrestee Information</legend>
                                            <div className="row">
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Last Name</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field">
                                                    <input type="text" id='LastName' name='LastName' value={value?.LastName} onChange={HandleChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>First Name</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field">
                                                    <input type="text" id='FirstName' name='FirstName' value={value?.FirstName} onChange={HandleChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Middle Name</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field">
                                                    <input type="text" id='MiddleName' name='MiddleName' value={value?.MiddleName} onChange={HandleChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>SSN</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field">
                                                    <input type="text" id='SSN' name='SSN' maxLength={9} value={value?.SSN} onChange={HandleChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>DL #</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field">
                                                    <input type="text" id='DLNumber' name='DLNumber' maxLength={15} value={value?.DLNumber} onChange={HandleChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>FBI #</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field">
                                                    <input type="text" id='FBI' name='FBI' maxLength={25} value={value?.FBI} onChange={HandleChange} />

                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>SBI #</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field">
                                                    <input type="text" id='SBI' name='SBI' maxLength={25} value={value?.SBI} onChange={HandleChange} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="btn-box text-right  mr-1 mb-2">
                                {
                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button>
                                        : <></> :
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button>
                                }
                                <button type="button" onClick={() => onClose()} className="btn btn-sm btn-success mr-1" >Close</button>
                            </div> */}
                            {/* <div className="btn-box text-right  mr-1 mb-2">
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button>
                                <button type="button" onClick={() => onClose()} className="btn btn-sm btn-success mr-1" >Close</button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArrestSearchPage