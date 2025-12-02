import React, { useState, useEffect, useRef } from 'react';
import Select from "react-select";
import { customStylesWithOutColor, filterPassedTimeZonesProperty, getShowingDateText, Requiredcolour, tableCustomStyles, nibrscolourStyles, base64ToString } from '../../Components/Common/Utility';
import { Link, useLocation } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData } from '../../Components/hooks/Api';
import { Comman_changeArrayFormat, threeColArray, threeColArrayWithCode } from '../../Components/Common/ChangeArrayFormat';
import { toastifySuccess } from '../../Components/Common/AlertMsg';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../Components/Common/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { get_UcrClear_Drp_Data } from '../../redux/actions/DropDownsData';
import ChangesModal from '../../Components/Common/ChangesModal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { get_Inc_ReportedDate } from '../../redux/api';
import ListModal from '../../Components/Pages/Utility/ListManagementModel/ListModal';
import { RequiredFieldIncident } from '../../Components/Pages/Utility/Personnel/Validation';
import useObjState from '../../CADHook/useObjState';

const StatusOption = [
    { value: "A", label: "Attempted" },
    { value: "C", label: "Completed" },
];

function ChargingProsecution({ CaseId = null }) {
    const dispatch = useDispatch();
    const location = useLocation();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const UCRClearDrpData = useSelector((state) => state.DropDown.UCRClearDrpData);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const { datezone } = useSelector((state) => state.Agency) || { datezone: new Date() };

    const useQuery = () => {
        const params = new URLSearchParams(location.search);
        return {
            get: (param) => params.get(param)
        };
    };
    let DecIncID = 0, DecEIncID = 0, DecArrestId = 0;
    const query = useQuery();
    let IncID = query?.get("IncId");
    let ChargeId = query?.get("ChargeId");
    let ChargeSta = query?.get("ChargeSta");


    if (!IncID) IncID = 0;
    else DecIncID = parseInt((IncID));

    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }

    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [Editval, setEditval] = useState();
    const [ChargeID, setChargeID] = useState();
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [changesStatus, setChangesStatus] = useState(false);
    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    const [NIBRSDrpData, setNIBRSDrpData] = useState([]);
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [chargeData, setChargeData] = useState([]);
    const [filingStatusDrp, setFilingStatusDrp] = useState([]);
    const [filedOffenseCodeDrp, setFiledOffenseCodeDrp] = useState([]);
    const filingDateRef = useRef();
    const [daStatusLog] = useState([]);

    // Prosecutor Filing Section State
    const [prosecutorFormState, , handleProsecutorFormState] = useObjState({
        prosecutorName: '',
        prosecutorCaseNumber: '',
        filedOffenseCode: null,
        numberOfCounts: '1',
        prosecutorOffice: '',
        filingStatus: null,
        filedChargeDescription: '',
        filingDate: null,
        notes: ''
    });
    const [daNotificationState, , handleDaNotificationState] = useObjState({
        notifyAssignedInvestigator: false,
        notifySupervisor: false,
    });

    const [value, setValue] = useState({
        AttemptComplete: 'N',
        'CaseID': CaseId || '', 'ChargeID': '', 'CreatedByUserFK': '',
        'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'Name': '',
        'LawTitleId': '', 'CategoryId': '', 'OffenseDateTime': '',
    });

    const [errors, setErrors] = useState({
        'NIBRSIDError': '', 'ChargeCodeIDError': '', 'AttemptRequiredError': '', 'OffenseDttmError': ''
    });

    const startRef = useRef();

    useEffect(() => {
        setFilingStatusDrp([
            { value: 'Pending', label: 'Pending' },
            { value: 'Submitted', label: 'Submitted' },
            { value: 'Approved', label: 'Approved' },
        ]);
        setFiledOffenseCodeDrp([
            { value: 'FOC-001', label: 'FOC-001 | Theft' },
            { value: 'FOC-002', label: 'FOC-002 | Assault' },
            { value: 'FOC-003', label: 'FOC-003 | Fraud' },
        ]);
        if (localStoreData?.AgencyID) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            if (UCRClearDrpData?.length === 0) {
                dispatch(get_UcrClear_Drp_Data(localStoreData?.AgencyID));
            }
            if (!incReportedDate && IncID) {
                dispatch(get_Inc_ReportedDate(IncID));
            }
            LawTitleIdDrpDwnVal(localStoreData?.AgencyID, null);
            get_NIBRS_Drp_Data(localStoreData?.AgencyID, null);
            get_ChargeCode_Drp_Data(localStoreData?.AgencyID, null, null);
            get_CategoryId_Drp(localStoreData?.AgencyID);
            if (CaseId) {
                get_Charge_Data(CaseId);
            }
        }
    }, [localStoreData, CaseId]);

    useEffect(() => {
        if (ChargeId) {
            GetSingleData(ChargeId);
        } else {
            Reset();
        }
    }, [ChargeId]);

    useEffect(() => {
        if (Editval) {
            setValue({
                ...value,
                'Count': Editval[0]?.Count || '', 'ChargeCodeID': Editval[0]?.ChargeCodeID || '',
                'NIBRSID': Editval[0]?.NIBRSID || '', 'UCRClearID': Editval[0]?.UCRClearID || '',
                'ChargeID': Editval[0]?.ChargeID || '', 'ModifiedByUserFK': LoginPinID,
                'LawTitleId': Editval[0]?.LawTitleId || '', 'AttemptComplete': Editval[0]?.AttemptComplete || '',
                'CategoryId': Editval[0]?.CategoryId || '', 'OffenseDateTime': Editval[0]?.OffenseDateTime || '',
            });
            if (Editval[0]?.LawTitleId) {
                LawTitleIdDrpDwnVal(LoginAgencyID, null);
                get_NIBRS_Drp_Data(LoginAgencyID, Editval[0]?.LawTitleId);
                get_ChargeCode_Drp_Data(LoginAgencyID, Editval[0]?.NIBRSID, Editval[0]?.LawTitleId);
                get_CategoryId_Drp(LoginAgencyID, Editval[0]?.CategoryId);
            }
        }
    }, [Editval]);

    const GetSingleData = (ChargeID) => {
        const val = { 'ChargeID': ChargeID, 'CaseID': CaseId };
        fetchPostData('CaseManagement/GetSingleData_ChargeRecommendation', val).then((res) => {
            if (res) {
                setEditval(res);
                setChargeID(ChargeID);
            } else {
                setEditval([]);
            }
        });
    };

    const get_Charge_Data = (CaseID) => {
        const val = { 'CaseID': CaseID };
        fetchPostData('CaseManagement/GetAll_ChargeRecommendation', val).then((res) => {
            if (res) {
                setChargeData(res);
            } else {
                setChargeData([]);
            }
        });
    };

    const get_CategoryId_Drp = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID };
        fetchPostData('ChargeCategory/GetDataDropDown_ChargeCategory', val).then((data) => {
            if (data) {
                setCategoryIdDrp(Comman_changeArrayFormat(data, 'ChargeCategoryID', 'Description'));
            } else {
                setCategoryIdDrp([]);
            }
        });
    };

    const LawTitleIdDrpDwnVal = async (loginAgencyID, ChargeCodeID) => {
        const val = { AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID };
        await fetchPostData('LawTitle/GetDataDropDown_LawTitle', val).then((data) => {
            if (data) {
                setLawTitleIdDrp(Comman_changeArrayFormat(data, 'LawTitleID', 'Description'));
            } else {
                setLawTitleIdDrp([]);
            }
        });
    };

    const get_NIBRS_Drp_Data = (LoginAgencyID, LawTitleID) => {
        const val = { 'AgencyID': LoginAgencyID, 'LawTitleID': LawTitleID ? LawTitleID : null, 'IncidentID': DecEIncID || 0 };
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((res) => {
            if (res) {
                setNIBRSDrpData(threeColArrayWithCode(res, 'FBIID', 'Description', 'FederalSpecificFBICode'));
            } else {
                setNIBRSDrpData([]);
            }
        });
    };

    const get_ChargeCode_Drp_Data = (LoginAgencyID, FBIID, LawTitleID) => {
        const val = { 'AgencyID': LoginAgencyID, 'FBIID': FBIID, 'LawTitleID': LawTitleID };
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setChargeCodeDrp(threeColArray(data, "ChargeCodeID", "Description", "CategoryID"));
            } else {
                setChargeCodeDrp([]);
            }
        });
    };

    const onChangeDrpLawTitle = async (e, name) => {
        setStatesChangeStatus(true);
        setChangesStatus(true);
        if (e) {
            if (name === "LawTitleId") {
                setValue({ ...value, LawTitleId: e.value, NIBRSID: null, ChargeCodeID: null });
                setChargeCodeDrp([]);
                setNIBRSDrpData([]);
                get_NIBRS_Drp_Data(LoginAgencyID, e.value);
                get_ChargeCode_Drp_Data(LoginAgencyID, value?.NIBRSID, e.value);
            } else if (name === 'ChargeCodeID') {
                setCategoryIdDrp([]);
                get_CategoryId_Drp(LoginAgencyID, e.id);
                setValue({ ...value, [name]: e.value, CategoryId: e.id });
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "LawTitleId") {
                setValue({ ...value, LawTitleId: null, NIBRSID: '', ChargeCodeID: null });
                setChargeCodeDrp([]);
                setNIBRSDrpData([]);
                LawTitleIdDrpDwnVal(LoginAgencyID, null);
                get_NIBRS_Drp_Data(LoginAgencyID, null);
                get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
            } else if (name === 'ChargeCodeID') {
                setValue({ ...value, ChargeCodeID: null, CategoryId: null });
                setCategoryIdDrp([]);
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    };

    const onChangeNIBRSCode = (e, name) => {
        setStatesChangeStatus(true);
        setChangesStatus(true);
        if (e) {
            if (name === 'NIBRSID') {
                setValue({ ...value, NIBRSID: e.value, ChargeCodeID: null });
                setChargeCodeDrp([]);
                get_ChargeCode_Drp_Data(LoginAgencyID, e.value, value?.LawTitleId);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "NIBRSID") {
                setValue({ ...value, [name]: null, ChargeCodeID: null });
                get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    };

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true);
        setChangesStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value });
        } else {
            setValue({ ...value, [name]: null });
        }
    };

    const handlcount = (e) => {
        setStatesChangeStatus(true);
        setChangesStatus(true);
        if (e.target.name === 'Count') {
            const ele = e.target.value.replace(/[^0-9.]/g, "");
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g);
                        if (!checkDot) {
                            setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                            return;
                        } else { return; }
                    } else {
                        setValue({ ...value, [e.target.name]: ele });
                    }
                }
            } else {
                setValue({ ...value, [e.target.name]: ele });
            }
        } else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    };

    const onChangeAttComplete = (e, name) => {
        setStatesChangeStatus(true);
        setChangesStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value });
        } else {
            setValue({ ...value, [name]: null });
        }
    };

    const check_Validation_Error = () => {
        const NIBRSIDError = RequiredFieldIncident(value.NIBRSID);
        const ChargeCodeIDError = RequiredFieldIncident(value.ChargeCodeID);
        const AttemptRequiredError = RequiredFieldIncident(value.AttemptComplete);
        const OffenseDttmError = RequiredFieldIncident(value.OffenseDateTime);
        setErrors({
            'NIBRSIDError': NIBRSIDError,
            'ChargeCodeIDError': ChargeCodeIDError,
            'AttemptRequiredError': AttemptRequiredError,
            'OffenseDttmError': OffenseDttmError
        });
    };

    const { ChargeCodeIDError, NIBRSIDError, AttemptRequiredError, OffenseDttmError } = errors;

    useEffect(() => {
        if (ChargeCodeIDError === 'true' && NIBRSIDError === 'true' && AttemptRequiredError === 'true' && OffenseDttmError === 'true') {
            if ((ChargeSta === true || ChargeSta === 'true') && ChargeID) {
                update_Charge_Data();
            } else {
                Add_Charge_Data();
            }
        }
    }, [ChargeCodeIDError, NIBRSIDError, AttemptRequiredError, OffenseDttmError]);

    const Add_Charge_Data = () => {
        const { Count, ChargeCodeID, NIBRSID, UCRClearID, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime } = value;
        const val = {
            'CaseID': CaseId, 'ChargeID': '', 'CreatedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID,
            'UCRClearID': UCRClearID, 'ChargeCodeID': ChargeCodeID, 'NIBRSID': NIBRSID, 'Count': Count,
            'LawTitleId': LawTitleId, 'AttemptComplete': AttemptComplete, 'CategoryId': CategoryId, 'OffenseDateTime': OffenseDateTime,
        };
        AddDeleteUpadate('CaseManagement/Insert_ChargeRecommendation', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message || 'Charge Recommendation added successfully');
                get_Charge_Data(CaseId);
                Reset();
                setErrors({});
            }
        });
    };

    const update_Charge_Data = () => {
        const { Count, ChargeCodeID, NIBRSID, UCRClearID, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime } = value;
        const val = {
            'CaseID': CaseId, 'ChargeID': ChargeID, 'ModifiedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID,
            'UCRClearID': UCRClearID, 'ChargeCodeID': ChargeCodeID, 'NIBRSID': NIBRSID, 'Count': Count,
            'LawTitleId': LawTitleId, 'AttemptComplete': AttemptComplete, 'CategoryId': CategoryId, 'OffenseDateTime': OffenseDateTime
        };
        AddDeleteUpadate('CaseManagement/Update_ChargeRecommendation', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message || 'Charge Recommendation updated successfully');
                get_Charge_Data(CaseId);
                setStatesChangeStatus(false);
                setChangesStatus(false);
                setErrors({});
            }
        });
    };

    const DeleteChargeRecommendation = (delChargeID) => {
        const val = { 'ChargeID': delChargeID, 'DeletedByUserFK': LoginPinID };
        AddDeleteUpadate('CaseManagement/Delete_ChargeRecommendation', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message || 'Charge Recommendation deleted successfully');
                get_Charge_Data(CaseId);
                Reset();
                setErrors({});
            }
        });
    };

    const Reset = () => {
        setEditval('');
        setValue({
            ...value,
            'CreatedByUserFK': '', 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '',
            'ChargeID': '', 'LawTitleId': '', 'AttemptComplete': '', 'CategoryId': '', 'OffenseDateTime': '',
        });
        setStatesChangeStatus(false);
        setChangesStatus(false);
        setErrors({});
        setChargeID('');
        LawTitleIdDrpDwnVal(LoginAgencyID, null);
        get_NIBRS_Drp_Data(LoginAgencyID, null);
        get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
    };

    const setStatusFalse = () => {
        setErrors({});
        setChargeID('');
        Reset();
    };

    const set_Edit_Value = (row) => {
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
            modal.show();
        } else {
            setChargeID(row.ChargeID);
            GetSingleData(row.ChargeID);
            setStatesChangeStatus(false);
            setChangesStatus(false);
        }
    };

    const columns = [
        {
            name: 'TIBRS Code',
            selector: (row) => row.NIBRS_Description || row.FBICode_Desc,
            sortable: true
        },
        {
            name: 'Offense Code/Name',
            selector: (row) => row.ChargeCode_Description || row.Offense_Description,
            sortable: true
        },
        {
            name: 'Law Title',
            selector: (row) => row.LawTitle || row.LawTitleId,
            sortable: true
        },
    ];

    const conditionalRowStyles = [
        {
            when: row => row.ChargeID === ChargeID,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer' },
        },
    ];

    const nibrsSuccessStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#9fd4ae",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    return (
        <>
            <div className="mt-2">
                <fieldset className='mt-1'>
                    <legend>Charge Recommendation</legend>
                    <div className="row align-items-center mt-2" style={{ rowGap: "8px" }}>
                        <div className="col-2 col-md-2 col-lg-1">
                            <label htmlFor="" className='new-label mb-0'>
                                Law Title
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2">
                            <Select
                                name='LawTitleId'
                                styles={customStylesWithOutColor}
                                value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                                options={lawTitleIdDrp}
                                isClearable
                                onChange={(e) => onChangeDrpLawTitle(e, 'LawTitleId')}
                                placeholder="Select..."
                            />
                        </div>

                        <div className="col-2 col-md-2 col-lg-2 text-right">
                            <label htmlFor="" className='new-label mb-0'>
                                TIBRS Code
                                {errors.NIBRSIDError !== 'true' && (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block" }}>{errors.NIBRSIDError}</span>
                                )}
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3">
                            <Select
                                styles={Requiredcolour}
                                name="NIBRSID"
                                value={NIBRSDrpData?.filter((obj) => obj.value === value?.NIBRSID)}
                                isClearable
                                options={NIBRSDrpData}
                                onChange={(e) => { onChangeNIBRSCode(e, 'NIBRSID') }}
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2">
                            <label htmlFor="" className='new-label mb-0'>
                                Category
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2">
                            <Select
                                name='CategoryId'
                                value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryId)}
                                styles={customStylesWithOutColor}
                                options={categoryIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'CategoryId')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>

                        <div className="col-2 col-md-2 col-lg-1 text-right">
                            <Link to={'/ListManagement?page=Charge%20Code&call=/Arr-Charge-Home'} className='new-link'>
                                Offense Code/Name
                                {errors.ChargeCodeIDError !== 'true' ? (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block" }}>{errors.ChargeCodeIDError}</span>
                                ) : null}
                            </Link>
                        </div>
                        <div className="col-4 col-md-4 col-lg-7 mt-0">
                            <Select
                                name="ChargeCodeID"
                                value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                                styles={Requiredcolour}
                                isClearable
                                options={chargeCodeDrp}
                                onChange={(e) => { onChangeDrpLawTitle(e, 'ChargeCodeID') }}
                                placeholder="Select..."
                            />
                        </div>

                        <div className="col-2 col-md-2 col-lg-2 text-right">
                            <label className="new-label mb-0">
                                Attempt/Complete
                                {errors.AttemptRequiredError !== 'true' && (
                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block" }}>
                                        {errors.AttemptRequiredError}
                                    </span>
                                )}
                            </label>
                        </div>
                        <div className="col-3 col-md-4 col-lg-2">
                            <Select
                                onChange={(e) => onChangeAttComplete(e, "AttemptComplete")}
                                options={StatusOption}
                                isClearable
                                styles={!value?.AttemptComplete ? nibrscolourStyles : nibrsSuccessStyles}
                                placeholder="Select..."
                                value={StatusOption.find((option) => option.value === value?.AttemptComplete) || null}
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 text-right">
                            <span data-toggle="modal" onClick={() => {
                                setOpenPage('UCR Clear')
                            }} data-target="#ListModel" className='new-link'>
                                UCR Clear
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3">
                            <Select
                                styles={customStylesWithOutColor}
                                name="UCRClearID"
                                value={UCRClearDrpData?.filter((obj) => obj.value === value?.UCRClearID)}
                                isClearable
                                options={UCRClearDrpData}
                                onChange={(e) => { ChangeDropDown(e, 'UCRClearID') }}
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 text-right">
                            <label htmlFor="" className='new-label mb-0'>Count</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-0 text-field">
                            <input
                                type="text"
                                name='Count'
                                id='Count'
                                maxLength={5}
                                onChange={handlcount}
                                value={value?.Count}
                                className=''
                            />
                        </div>
                        <div className="col-3 col-md-3 col-lg-2">
                            <label htmlFor="" className="new-label px-0 mb-0">
                                Charge Date/Time
                                {errors.OffenseDttmError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OffenseDttmError}</p>
                                ) : null}
                            </label>
                        </div>
                        <div className="col-3 col-md-4 col-lg-2">
                            <DatePicker
                                id='OffenseDateTime'
                                name='OffenseDateTime'
                                ref={startRef}
                                onKeyDown={(e) => {
                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                        e?.preventDefault();
                                    } else {
                                        onKeyDown(e);
                                    }
                                }}
                                dateFormat="MM/dd/yyyy HH:mm"
                                isClearable={false}
                                onChange={(date) => {
                                    setStatesChangeStatus(true);
                                    setChangesStatus(true);
                                    if (date > new Date(datezone)) {
                                        date = new Date(datezone);
                                    }
                                    if (date >= new Date()) {
                                        setValue({ ...value, OffenseDateTime: new Date() ? getShowingDateText(new Date(date)) : null });
                                    } else if (date <= new Date(incReportedDate)) {
                                        setValue({ ...value, OffenseDateTime: new Date() ? getShowingDateText(new Date(date)) : null });
                                    } else {
                                        setValue({ ...value, OffenseDateTime: date ? getShowingDateText(date) : null });
                                    }
                                }}
                                selected={value?.OffenseDateTime && new Date(value?.OffenseDateTime)}
                                autoComplete="Off"
                                placeholderText={'Select...'}
                                timeInputLabel
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                minDate={new Date(incReportedDate)}
                                maxDate={new Date(datezone)}
                                filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                                timeFormat="HH:mm "
                                is24Hour
                            />
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className="col-12 text-right mt-0 p-0">
                <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { setStatusFalse(); }}>New</button>
                {
                    (ChargeSta === true || ChargeSta === 'true') && ChargeID ?
                        <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1">Update</button>
                        :
                        <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Save</button>
                }
            </div>
            <div className="col-12 mt-2">
                <DataTable
                    dense
                    data={chargeData}
                    columns={columns}
                    selectableRowsHighlight
                    highlightOnHover
                    pagination
                    onRowClicked={(row) => { set_Edit_Value(row); }}
                    fixedHeaderScrollHeight='250px'
                    conditionalRowStyles={conditionalRowStyles}
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    noDataComponent="There are no data to display"
                />
            </div>

            {/* B. Prosecutor Filing Section */}
            <div className="mt-2">
                <fieldset className='mt-1'>
                    <legend>B. Prosecutor Filing Section</legend>
                    <div className="row mt-2" style={{ rowGap: "8px" }}>
                        {/* First Column */}
                        <div className="col-md-4">
                            <div className="row align-items-center mb-3" style={{ rowGap: "8px" }}>
                                <div className="col-4">
                                    <label htmlFor="" className='new-label mb-0'>
                                        Prosecutor Name
                                    </label>
                                </div>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        placeholder="Enter prosecutor name"
                                        value={prosecutorFormState.prosecutorName}
                                        onChange={(e) => handleProsecutorFormState("prosecutorName", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row align-items-center mb-3" style={{ rowGap: "8px" }}>
                                <div className="col-4">
                                    <label htmlFor="" className='new-label mb-0'>
                                        Prosecutor Case #
                                    </label>
                                </div>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input requiredColor"
                                        placeholder="Enter case number"
                                        value={prosecutorFormState.prosecutorCaseNumber}
                                        onChange={(e) => handleProsecutorFormState("prosecutorCaseNumber", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row align-items-center mb-3" style={{ rowGap: "8px" }}>
                                <div className="col-4">
                                    <label htmlFor="" className='new-label mb-0'>
                                        Filed Offense Code
                                    </label>
                                </div>
                                <div className="col-8">
                                    <Select
                                        name='filedOffenseCode'
                                        styles={Requiredcolour}
                                        value={filedOffenseCodeDrp?.find((obj) => obj.value === prosecutorFormState.filedOffenseCode)}
                                        options={filedOffenseCodeDrp}
                                        isClearable
                                        onChange={(e) => handleProsecutorFormState("filedOffenseCode", e?.value || null)}
                                        placeholder="Select..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Second Column */}
                        <div className="col-md-4">
                            <div className="row align-items-center mb-3" style={{ rowGap: "8px" }}>
                                <div className="col-4">
                                    <label htmlFor="" className='new-label mb-0'>
                                        Number of Counts
                                    </label>
                                </div>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input requiredColor"
                                        placeholder="1"
                                        value={prosecutorFormState.numberOfCounts}
                                        onChange={(e) => handleProsecutorFormState("numberOfCounts", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row align-items-center mb-3" style={{ rowGap: "8px" }}>
                                <div className="col-4">
                                    <label htmlFor="" className='new-label mb-0'>
                                        Prosecutor Office
                                    </label>
                                </div>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        placeholder="Enter office name"
                                        value={prosecutorFormState.prosecutorOffice}
                                        onChange={(e) => handleProsecutorFormState("prosecutorOffice", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row align-items-center mb-3" style={{ rowGap: "8px" }}>
                                <div className="col-4">
                                    <label htmlFor="" className='new-label mb-0'>
                                        Filing Status
                                    </label>
                                </div>
                                <div className="col-8">
                                    <Select
                                        name='filingStatus'
                                        styles={Requiredcolour}
                                        value={filingStatusDrp?.find((obj) => obj.value === prosecutorFormState.filingStatus)}
                                        options={filingStatusDrp}
                                        isClearable
                                        onChange={(e) => handleProsecutorFormState("filingStatus", e?.value || null)}
                                        placeholder="Select..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Third Column */}
                        <div className="col-md-4">
                            <div className="row align-items-center mb-3" style={{ rowGap: "8px" }}>
                                <div className="col-4">
                                    <label htmlFor="" className='new-label mb-0'>
                                        Filed Charge Description
                                    </label>
                                </div>
                                <div className="col-8">
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input requiredColor"
                                        placeholder="Auto-populated"
                                        value={prosecutorFormState.filedChargeDescription}
                                        onChange={(e) => handleProsecutorFormState("filedChargeDescription", e.target.value)}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="row align-items-center mb-3" style={{ rowGap: "8px" }}>
                                <div className="col-4">
                                    <label htmlFor="" className='new-label mb-0'>
                                        Filing Date
                                    </label>
                                </div>
                                <div className="col-8">
                                    <DatePicker
                                        id='filingDate'
                                        name='filingDate'
                                        ref={filingDateRef}
                                        selected={prosecutorFormState.filingDate ? new Date(prosecutorFormState.filingDate) : null}
                                        onChange={(date) => handleProsecutorFormState("filingDate", date ? getShowingDateText(date) : null)}
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        isClearable
                                        className="form-control py-1 new-input requiredColor"
                                        placeholderText="dd-mm-yyyy --:--"
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        autoComplete="Off"
                                        is24Hour
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div className="row">
                        <div className="col-12">
                            <h6 className="fw-bold mb-2">Notes</h6>
                            <textarea
                                className="form-control requiredColor"
                                rows="2"
                                placeholder="Enter notes about filing..."
                                value={prosecutorFormState.notes}
                                onChange={(e) => handleProsecutorFormState("notes", e.target.value)}
                            />
                        </div>
                    </div>
                </fieldset>
            </div>

            {/* C. DA Notifications */}
            <div className="mt-2 mb-4">
                <fieldset>
                    <legend>C. DA Notifications</legend>
                    <div className="row">
                        <div className="col-12 d-flex flex-column flex-md-row mt-2" style={{ gap: '20px' }}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="notifyAssignedInvestigator"
                                    checked={daNotificationState.notifyAssignedInvestigator}
                                    onChange={(e) => handleDaNotificationState("notifyAssignedInvestigator", e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="notifyAssignedInvestigator">
                                    Notify Assigned Investigator
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="notifySupervisor"
                                    checked={daNotificationState.notifySupervisor}
                                    onChange={(e) => handleDaNotificationState("notifySupervisor", e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="notifySupervisor">
                                    Notify Supervisor
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <h6 className="fw-bold mb-2">Status Activity Log</h6>
                        <DataTable
                            columns={[
                                { name: 'Date/Time', selector: row => row.dateTime, sortable: true },
                                { name: 'User', selector: row => row.user, sortable: true },
                                { name: 'Action', selector: row => row.action, sortable: true },
                                { name: 'Status', selector: row => row.status, sortable: true },
                                { name: 'Notes', selector: row => row.notes, wrap: true },
                            ]}
                            data={daStatusLog}
                            dense
                            selectableRowsHighlight
                            highlightOnHover
                            pagination
                            onRowClicked={(row) => { set_Edit_Value(row); }}
                            fixedHeaderScrollHeight='250px'
                            conditionalRowStyles={conditionalRowStyles}
                            fixedHeader
                            persistTableHead={true}
                            customStyles={tableCustomStyles}
                            noDataComponent="There are no data to display"
                        />
                    </div>
                    <div className="d-flex justify-content-end align-items-center mt-4" style={{ gap: '12px' }}>
                        <button type="button" className="btn btn-outline-secondary btn-sm">
                            Cancel
                        </button>
                        <button type="button" className="btn btn-sm btn-success">
                            Save
                        </button>
                        <button type="button" className="btn btn-sm btn-success">
                            Submit to DA
                        </button>
                    </div>
                </fieldset>
            </div>
            <DeletePopUpModal func={DeleteChargeRecommendation} />
            <ListModal {...{ openPage, setOpenPage }} />
            <ChangesModal func={check_Validation_Error} />
        </>
    );
}

export default ChargingProsecution;
