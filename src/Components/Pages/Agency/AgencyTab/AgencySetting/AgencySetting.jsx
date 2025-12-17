import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, Encrypted_Id_Name, base64ToString, getShowingMonthDateYear } from '../../../../Common/Utility';
import { AddDeleteUpadate, ScreenPermision, fetchPostData } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import ChangesModal from '../../../../Common/ChangesModal';
import GoogleAuthServices from "../../../../../CADServices/APIs/googleAuth";
import { LoginContext } from '../../../../../CADContext/loginAuth';
import { insert_LocalStoreData } from '../../../../../redux/api';
import SelectBox from '../../../../Common/SelectBox';

const AgencySetting = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [reportingTypeDrp, setReportingTypeDrp] = useState(
        [
            { value: 1, label: 'LIBRS' },
            { value: 2, label: 'NIBRS' },
            { value: 3, label: 'TIBRS' }
        ]
    );

    const [editVal, setEditVal] = useState([])
    const [pinID, setPinId] = useState('');
    const { get_CountList, setChangesStatus, } = useContext(AgencyContext);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddAgencySetting, setPermissionForAddAgencySetting] = useState(false);
    const [permissionForEditAgencySetting, setPermissionForEditAgencySetting] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        MaxAgeForJuvenile: "", ReportingTypeID: 1, BaseDate: "", ExpiryYear: "", SolvabilityRating: "", MaxAgeForStatutoryRape: "", MaxAgeForJuvenileByFederal_UCR_NIBRS: "", IsEnhancedNameIndex: "", IsAliasReqForConsolidating: "", IsRMSCFSCode: "", IsReqHeightWeightArrest: "", IsEnableMasterIncident: '', IsCadEditable: '', ModifiedByUserFK: pinID, AgencyID: aId, IsSupervisorEdit: '', IsSearchableByOtherAgencies: false, ExpungeExpireDate: '', MaxRestrictLevel: '', MaxLockLevel: '', SessionTimeOut: '', Is2FAEnabled: '', ReportApproval: '', ReportApprovalLevel: '', RedactedItemsDescription: "", IsCaseManagementVisible: '', IsArrestMigrate: ''
    });

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");
    var aIdSta = query?.get("ASta");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinId(localStoreData?.PINID); getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (pinID) {
            setValue({
                ...value,
                MaxAgeForJuvenile: "", ReportingTypeID: 1, BaseDate: "", ExpiryYear: "", SolvabilityRating: "", MaxAgeForStatutoryRape: "", MaxAgeForJuvenileByFederal_UCR_NIBRS: "", IsEnhancedNameIndex: "", IsAliasReqForConsolidating: "", IsRMSCFSCode: "", IsReqHeightWeightArrest: "", IsEnableMasterIncident: '', IsCadEditable: '', ModifiedByUserFK: pinID, AgencyID: aId, IsSupervisorEdit: '',
                ExpungeExpireDate: '', MaxRestrictLevel: '', MaxLockLevel: '', IsSearchableByOtherAgencies: false, Is2FAEnabled: "", IsCaseManagementVisible: '', ReportApproval: '', ReportApprovalLevel: '', SessionTimeOut: '', RedactedItemsDescription: "", IsArrestMigrate: ''
            });
        }
    }, [pinID]);

    useEffect(() => {
        if (aId) {
            getAgencySettingData(aId);
        }
    }, [aId]);

    // Get Effective Screeen Permission
    const getScreenPermision = (aId, pinID) => {
        ScreenPermision("A087", aId, pinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res);
                setPermissionForAddAgencySetting(res[0]?.AddOK);
                setPermissionForEditAgencySetting(res[0]?.Changeok);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(res[0]?.Changeok != 1 ? true : false);

            }
            else {
                setEffectiveScreenPermission([]); setPermissionForAddAgencySetting(false); setPermissionForEditAgencySetting(false);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(false)
            }
        }).catch(error => {
            console.error('There was an error!', error);
            setPermissionForAddAgencySetting(false);
            setPermissionForEditAgencySetting(false);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(false)
        });
    }

    const getAgencySettingData = (aId) => {
        fetchPostData('Agency/GetData_SingleData', { 'AgencyID': aId }).then((res) => {
            setEditVal(res)
        })
    }

    useEffect(() => {
        if (aId && editVal?.length > 0) {
            setValue({
                ...value,
                SessionTimeOut: editVal[0]?.SessionTimeOut,
                MaxAgeForJuvenile: editVal[0]?.MaxAgeForJuvenile, ReportingTypeID: editVal[0]?.ReportingTypeID, BaseDate: editVal[0]?.BaseDate, ExpiryYear: editVal[0]?.ExpiryYear, SolvabilityRating: editVal[0]?.SolvabilityRating, MaxAgeForStatutoryRape: editVal[0]?.MaxAgeforStatutoryRape, MaxAgeForJuvenileByFederal_UCR_NIBRS: editVal[0]?.MaxAgeForJuvenileByFederal_UCR_NIBRS,
                IsEnhancedNameIndex: editVal[0]?.IsEnhancedNameIndex, IsAliasReqForConsolidating: editVal[0]?.IsAliasReqForConsolidating, IsRMSCFSCode: editVal[0]?.IsRMSCFSCode, IsReqHeightWeightArrest: editVal[0]?.IsReqHeightWeightArrest,
                IsEnableMasterIncident: editVal[0]?.IsEnableMasterIncident, IsCadEditable: editVal[0]?.IsCadEditable, IsArrestMigrate: editVal[0]?.IsArrestMigrate,
                ReportDueDay: editVal[0]?.ReportDueDay, ReleaseTask: editVal[0]?.ReleaseTask, DestroyTask: editVal[0]?.DestroyTask, IsSupervisorEdit: editVal[0]?.IsSupervisorEdit,
                ExpungeExpireDate: editVal[0]?.ExpungeDueDay, IsSearchableByOtherAgencies: editVal[0]?.IsSearchableByOtherAgencies,
                MaxRestrictLevel: editVal[0]?.MaxRestrictLevel, MaxLockLevel: editVal[0]?.MaxLockLevel,
                Is2FAEnabled: editVal[0]?.Is2FAEnabled,
                ReportApproval: editVal[0]?.ReportApproval ? parseInt(editVal[0]?.ReportApproval) : '', ReportApprovalLevel: editVal[0]?.ReportApprovalLevel ? parseInt(editVal[0]?.ReportApprovalLevel) : '', RedactedItemsDescription: editVal[0]?.RedactedItemsDescription,
                IsCaseManagementVisible: editVal[0]?.IsCaseManagementVisible
            });
            dispatch(get_LocalStoreData(uniqueId))
        } else {
            setValue({
                ...value,
                MaxAgeForJuvenile: "", ReportingTypeID: "", BaseDate: "", ExpiryYear: "", SolvabilityRating: "", MaxAgeForStatutoryRape: "", MaxAgeForJuvenileByFederal_UCR_NIBRS: "",
                IsEnhancedNameIndex: "", IsAliasReqForConsolidating: "", IsRMSCFSCode: "", IsReqHeightWeightArrest: "", IsEnableMasterIncident: '', DestroyTask: '', ReleaseTask: '', ReportDueDay: '', IsSupervisorEdit: '', IsCadEditable: '', IsArrestMigrate: '', ExpungeExpireDate: '', MaxRestrictLevel: '', MaxLockLevel: '', IsSearchableByOtherAgencies: false,
                ReportApproval: '', ReportApprovalLevel: '', RedactedItemsDescription: "", IsCaseManagementVisible: ''
            })
        }
    }, [editVal]);

    const InsertAccessOrRefreshToken = () => {
        const Tokens = {
            'AgencyID': localStoreData?.AgencyID,
            'Agency_Name': localStoreData?.Agency_Name,
            'PINID': localStoreData?.PINID,
            'UserName': localStoreData?.UserName,
            'SessionTimeOut': value?.SessionTimeOut,
            'ORI': localStoreData?.ORI,
            'BaseDate': localStoreData?.BaseDate,
            'StateCode': localStoreData?.StateCode,
            'StateName': localStoreData?.StateName,
            'IsSuperadmin': localStoreData?.IsSuperadmin,
            'IsSupervisor': localStoreData?.IsSupervisor,
            'IsIncidentEditable': localStoreData?.IsIncidentEditable,
            'IsAdministrativeSystem': localStoreData?.IsAdministrativeSystem,
            'Is2FAEnabled': value?.Is2FAEnabled,
            'NCICLoginId': localStoreData?.NCICLoginId,
            'NCICLoginPassword': localStoreData?.NCICLoginPassword,
            'NCICLoginTerminalID': localStoreData?.NCICLoginTerminalID,
            'NCICORI': localStoreData?.NCICORI,
            'ReportApproval': value?.ReportApproval === 1 ? "Single" : 'Multi',
            'IsLevel': localStoreData?.IsLevel,
            'IsCaseManagementVisible': value?.IsCaseManagementVisible,
            'ZipCode': localStoreData?.ZipCode,
            'City': localStoreData?.City,
        }
        const val = {
            UniqueId: uniqueId,
            Key: JSON.stringify(Tokens)
        }

        dispatch(insert_LocalStoreData(val, Tokens));
    }

    const updateAgencySetting = async () => {
        await AddDeleteUpadate('Agency/AgencyDetails', value).then(async (res) => { // Mark callback as async
            if (res?.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setChangesStatus(false);
                setStatesChangeStatus(false);

                getAgencySettingData(aId);
                await GoogleAuthServices.updateSessionTimeOut({ 'AgencyId': aId }); // Use await here
                InsertAccessOrRefreshToken()
            } else {
                console.error("Api Throw Error");
            }
        });
    };

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, [name]: e.value });

        } else {
            setValue({ ...value, [name]: null });
        }
    }

    const HandleChanges = (e) => {
        let { name, value: inputValue } = e.target;
        if (name === "SessionTimeOut") {
            let num = Number(inputValue);
            if (inputValue === "") {
                setChangesStatus(true);
                setStatesChangeStatus(true);
                setValue({ ...value, [name]: 5 });
                return;
            }
            if (isNaN(num)) num = 5;
            num = Math.max(5, Math.min(15, num));
            setStatesChangeStatus(true);
            setChangesStatus(true);
            setValue({ ...value, [name]: num });
            return;
        }
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

        if (e) {
            if (e.target.name === "IsEnhancedNameIndex" || e.target.name === "IsAliasReqForConsolidating" || e.target.name === "IsRMSCFSCode" || e.target.name === "IsReqHeightWeightArrest" || e.target.name === "IsEnableMasterIncident" || e.target.name === "IsSupervisorEdit" || e.target.name === "IsCadEditable" || e.target.name === "Is2FAEnabled" || e.target.name === "IsArrestMigrate" || e.target.name === "IsCaseManagementVisible") {
                setValue({
                    ...value,
                    [e.target.name]: e.target.checked
                })
                setChangesStatus(true)
                setStatesChangeStatus(true);

            } else {
                const numericValue = e.target.value.replace(/\D/g, '');
                if (e.target.name === 'ExpungeExpireDate' && /^0+$/.test(numericValue)) {
                    return;
                }

                setValue({ ...value, [e.target.name]: e.target.value.replace(/\D/g, '') })
            }
        } else {
            setChangesStatus(true)
            setStatesChangeStatus(true);

            setValue({
                ...value,
                [e.target.name]: " "
            })
        }
    };

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    const MaxLockLevel_Type = [
        { value: "Equal To", label: "Equal To" },
        { value: "Greater Than", label: "Greater Than" },
        { value: "Greater Than Or Equal To", label: "Greater Than Or Equal To" },
    ];

    const RedactedItem_Type = [
        { value: "Victim", label: "Victim Name" },
        { value: "Witness", label: "Witness Name" },
        { value: "Charges", label: "Charges" },
        { value: "Juveniles", label: "Juveniles Names" },
        { value: "Address", label: "Home Address" },
        { value: "SSN", label: "SSN#" },
        { value: "Contact", label: "Contact/Email" },
        { value: "DateOfBirth", label: "DOB" },
        { value: "DLNumber", label: "DL#" },
        { value: "VehicleNo", label: "Plate No." },
        { value: "VIN", label: "VIN" },
        { value: "CrimeLocation", label: "Location of incident" }
    ];


    const MaxRestrictLevel_Type = [
        { value: "Equal To", label: "Equal To" },
        { value: "Greater Than", label: "Greater Than" },
        { value: "Greater Than Or Equal To", label: "Greater Than Or Equal To" },
    ]

    const toOptionArray = (stored) => {
        const arr = stored ? stored.split(",") : [];
        return RedactedItem_Type.filter(opt => arr.includes(opt.value));
    };

    const handleReportApprover = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        console.log("🚀 ~ handleCaseStatus ~ e:", e)
        if (e) {
            setValue({ ...value, [name]: e.value, });
        }
        else {
            setValue({ ...value, [name]: null, });
        }
    }

    const ReportApprovalDrpData = [
        {
            value: 1,
            label: "Single Level",
        },
        {
            value: 2,
            label: "Multiple Level",
        },
    ];

    const ReportApprovingLevel = [
        { value: 1, label: "Greater Than" },
        { value: 2, label: "Greater Than Or Equal To" },
    ];

    return (
        <>
            {
                effectiveScreenPermission ?
                    effectiveScreenPermission[0]?.DisplayOK ?
                        <>
                            <div className="col-12 col-md-12 " >
                                <div className="row ">
                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                        <label htmlFor="" className='new-label'>Maximum Age For Juvenile</label>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-2 mt-2 text-field">
                                        <input type="text" name='MaxAgeForJuvenile' value={value?.MaxAgeForJuvenile} onChange={HandleChanges} className='' maxLength={2} required />
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-2 pt-1">
                                        <label htmlFor="" className='new-label'>Reporting Type</label>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mt-2 ">
                                        <Select
                                            styles={customStylesWithOutColor}
                                            value={reportingTypeDrp?.filter((obj) => obj.value === value?.ReportingTypeID)}
                                            options={reportingTypeDrp}
                                            onChange={(e) => ChangeDropDown(e, 'ReportingTypeID')}
                                            name="ReportingTypeID"
                                            isClearable
                                            placeholder="Select..."
                                        />
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                        <label htmlFor="" className='new-label'>Base Date</label>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-2 ">
                                        <DatePicker
                                            ref={startRef}
                                            onKeyDown={onKeyDown}
                                            id='BaseDate'
                                            name='BaseDate'
                                            className=''

                                            dateFormat="MM/dd/yyyy"
                                            onChange={(date) => {
                                                !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);

                                                setValue({ ...value, ['BaseDate']: date ? getShowingMonthDateYear(date) : null })
                                            }}
                                            selected={value?.BaseDate && new Date(value?.BaseDate)}
                                            timeInputLabel
                                            isClearable={value?.BaseDate ? true : false}
                                            placeholderText={'Select...'}

                                            timeIntervals={1}
                                            timeCaption="Time"
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            timeFormat="HH:mm "
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="col-8 col-md-8 col-lg-3 mt-2 pt-1">
                                        <label htmlFor="" className='new-label'>Maximum Age For Statutory Rape</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                        <input type="text" name='MaxAgeForStatutoryRape' value={value?.MaxAgeForStatutoryRape} onChange={HandleChanges} maxLength={2} required />
                                    </div>
                                    <div className="col-8 col-md-8 col-lg-4 mt-2 pt-1">
                                        <label htmlFor="" className='new-label'>Maximum Age For Juvenile Set By Federal UCR/TIBRS</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                        <input type="text" name='MaxAgeForJuvenileByFederal_UCR_NIBRS' value={value?.MaxAgeForJuvenileByFederal_UCR_NIBRS} onChange={HandleChanges} maxLength={2} required />
                                    </div>
                                    {/* <div className="col-8 col-md-8 col-lg-3 mt-2 pt-1">
                                        <label htmlFor="" className='new-label'>Session Time Out</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                        <input
                                            type="number"
                                            name="SessionTimeOut"
                                            value={value?.SessionTimeOut || ''}
                                            onChange={HandleChanges}
                                            min={5}
                                            max={15}
                                            required
                                        />
                                    </div> */}
                                    {/* <div className='col-12 col-md-12 col-lg-12'>
                                        <div className='row align-items-center'>
                                            <div className="col-8 col-md-8 col-lg-4">
                                                <label htmlFor="" className='new-label mb-0'>Report Approve</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 mt-0 text-field">
                                                <Select
                                                    styles={customStylesWithOutColor}
                                                    name="ReportApproval"
                                                    value={ReportApprovalDrpData?.filter((obj) => obj.value === value?.ReportApproval)}
                                                    isClearable

                                                    placeholder="Select..."
                                                    options={ReportApprovalDrpData}
                                                    onChange={(e) => handleReportApprover(e, 'ReportApproval')}
                                                />
                                            </div>
                                            -
                                            <div className="col-4 col-md-4 col-lg-3 mt-0  text-field">
                                                <Select
                                                    styles={customStylesWithOutColor}
                                                    name="ReportApprovalLevel"
                                                    value={ReportApprovingLevel?.filter((obj) => obj.value === value?.ReportApprovalLevel)}
                                                    isClearable

                                                    placeholder="Select..."
                                                    options={ReportApprovingLevel}
                                                    onChange={(e) => handleReportApprover(e, 'ReportApprovalLevel')}

                                                />
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-12 col-md-12 col-lg-12">
                                        <div className="row">
                                            <div className="col-12 col-md-12 col-lg-12 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0 mt-1">
                                                <input type="checkbox" name='IsEnhancedNameIndex' checked={value?.IsEnhancedNameIndex} value={value?.IsEnhancedNameIndex} onChange={HandleChanges} />
                                                <label className='ml-2'>Enhanced Name Index</label>
                                            </div>
                                            <div className="col-12 col-md-12 col-lg-12 mt-1 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0">
                                                <input type="checkbox" name='IsAliasReqForConsolidating' checked={value?.IsAliasReqForConsolidating} value={value?.IsAliasReqForConsolidating} onChange={HandleChanges} />
                                                <label className='ml-2' >Alias Required For Consolidating</label>
                                            </div>

                                        </div>

                                        <div className="col-12 col-md-12 col-lg-12 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0 mt-1">
                                            <input type="checkbox" name='IsCadEditable' id='IsCadEditable' checked={value?.IsCadEditable} value={value?.IsCadEditable
                                            } onChange={HandleChanges} />
                                            <label className='ml-2' htmlFor='IsCadEditable' >Is Cad Available</label>
                                        </div>
                                        <div className="col-12 col-md-12 col-lg-12 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0 mt-1">
                                            <input type="checkbox" name='Is2FAEnabled' id='Is2FAEnabled' checked={value?.Is2FAEnabled} value={value?.Is2FAEnabled
                                            } onChange={HandleChanges} />
                                            <label className='ml-2' htmlFor='Is2FAEnabled' >Is 2FA Enabled</label>
                                        </div>
                                        <div className="col-12 col-md-12 col-lg-12 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0 mt-1">
                                            <input type="checkbox" name='IsCaseManagementVisible' id='IsCaseManagementVisible' checked={value?.IsCaseManagementVisible} value={value?.IsCaseManagementVisible
                                            } onChange={HandleChanges} />
                                            <label className='ml-2' htmlFor='IsCaseManagementVisible' >Is Case Management Visible</label>
                                        </div>
                                        <div className="col-12 col-md-12 col-lg-12 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0 mt-1">
                                            <input type="checkbox" name='IsArrestMigrate' checked={value?.IsArrestMigrate} value={value?.IsArrestMigrate
                                            } onChange={HandleChanges} />
                                            <label className='ml-2' >Use Initial Narrative as Arrest Narrative</label>
                                        </div>
                                        <div className="row align-items-center mt-2">
                                            {/* Report Due Day */}
                                            <div className="col-12 col-md-6 d-flex align-items-center">
                                                <div className="col-4">
                                                    <label className="new-label">Report Due Day</label>
                                                </div>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        name="ReportDueDay"
                                                        value={value.ReportDueDay}
                                                        maxLength={4}
                                                        autoComplete="off"
                                                        className="form-control"
                                                        onChange={HandleChanges}
                                                    />
                                                </div>
                                            </div>

                                            {/* Expunge Due Day */}
                                            <div className="col-12 col-md-6 d-flex align-items-center">
                                                <div className="col-4">
                                                    <label className="new-label">Expunge Due Day</label>
                                                </div>
                                                <div className="col-8">
                                                    <input
                                                        type="text"
                                                        name="ExpungeExpireDate"
                                                        value={value.ExpungeExpireDate}
                                                        maxLength={4}
                                                        autoComplete="off"
                                                        className="form-control"
                                                        onChange={HandleChanges}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row align-items-center mt-3">
                                            <div className="col-12 col-md-2">
                                                <label className="new-label">Lock Level</label>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <Select
                                                    styles={customStylesWithOutColor}
                                                    name="MaxLockLevel"
                                                    options={MaxLockLevel_Type}
                                                    isClearable
                                                    placeholder="MaxLockLevel..."
                                                    value={MaxLockLevel_Type?.filter((obj) => obj.value === value?.MaxLockLevel)}
                                                    onChange={(selectedOption) => {
                                                        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
                                                        setValue({ ...value, MaxLockLevel: selectedOption ? selectedOption.value : '' });
                                                    }}
                                                />
                                            </div>

                                            <div className="col-12 col-md-2">

                                                <label className="new-label">Restrict Level</label>
                                            </div>
                                            <div className="col-12 col-md-4">
                                                <Select
                                                    name="MaxRestrictLevel"
                                                    styles={customStylesWithOutColor}
                                                    options={MaxRestrictLevel_Type}
                                                    isClearable
                                                    placeholder="MaxRestrictLevel..."
                                                    value={MaxRestrictLevel_Type?.filter((obj) => obj.value === value?.MaxRestrictLevel)}
                                                    onChange={(selectedOption) => {
                                                        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
                                                        setValue({ ...value, MaxRestrictLevel: selectedOption ? selectedOption.value : '' });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-12 col-lg-12 pt-2 ">
                                            <fieldset>
                                                <legend>Property Room Task In Task List</legend>
                                                <div className="row mt-1" >
                                                    <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                        <label htmlFor="" className='new-label px-0'>Release Task</label>
                                                    </div>
                                                    <div className="col-8  col-md-8 col-lg-3 mt-2 text-field">
                                                        <input type="text" name='ReleaseTask' maxLength={4} value={value.ReleaseTask} onChange={HandleChanges}
                                                        />
                                                    </div>
                                                    <div className="d-flex col-6 col-md-6 col-lg-6">
                                                        <div className="col-2 col-md-4 col-lg-4 mt-2">
                                                            <label htmlFor="" className='new-label'>Destroy Task</label>
                                                        </div>
                                                        <div className="col-4  col-md-7 col-lg-7 mt-2 text-field">
                                                            <input type="text" name='DestroyTask' maxLength={4} value={value.DestroyTask} autocomplete="off" className={''}
                                                                onChange={HandleChanges}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-12 col-lg-12 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0 mt-4">
                                                        <input type="checkbox" name='IsSupervisorEdit' checked={value?.IsSupervisorEdit} value={value?.IsSupervisorEdit} onChange={HandleChanges} />
                                                        <label className='ml-2' >Supervisor Can Edit Report</label>
                                                    </div>
                                                </div>
                                            </fieldset>

                                        </div>
                                        <div className="col-12 col-md-12 col-lg-12 pt-2 ">
                                            <fieldset>
                                                <legend>Search Record Permission</legend>
                                                <div className="row mt-1 justify-content-center gap-2" >
                                                    <div className="col-2 col-md-2 col-lg-2 mt-2 px-0">
                                                        <label htmlFor="" className='new-label px-0'>Other Agencies able to search your records</label>
                                                    </div>
                                                    <div className="col-9 col-md-9 col-lg-9 ml-2 px-0 d-flex align-items-center">
                                                        <div className="form-check form-check-inline">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="IsSearchableByOtherAgencies"
                                                                id="IsSearchableByOtherAgenciesYes"
                                                                value={true}
                                                                checked={value?.IsSearchableByOtherAgencies === true}
                                                                onChange={() => {
                                                                    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                                                                    setValue({ ...value, IsSearchableByOtherAgencies: true });
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="IsSearchableByOtherAgenciesYes">Yes</label>
                                                        </div>
                                                        <div className="form-check form-check-inline ml-3">
                                                            <input
                                                                className="form-check-input"
                                                                type="radio"
                                                                name="IsSearchableByOtherAgencies"
                                                                id="IsSearchableByOtherAgenciesNo"
                                                                value={false}
                                                                checked={value?.IsSearchableByOtherAgencies === false || value?.IsSearchableByOtherAgencies === undefined}
                                                                onChange={() => {
                                                                    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                                                                    setValue({ ...value, IsSearchableByOtherAgencies: false });
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="IsSearchableByOtherAgenciesNo">No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div className="col-12 pt-2 ">
                                            <fieldset>
                                                <legend>Items need to be redacted</legend>
                                                <div className="row mt-1 justify-content-center gap-2 mt-1" >
                                                    <div className="col-2 col-md-2 col-lg-2 mt-2 px-0">
                                                        <label htmlFor="" className='new-label px-0'>Items need to be redacted</label>
                                                    </div>
                                                    <div className="col-10 ">
                                                        <div className="w-100">

                                                            <SelectBox
                                                                styles={customStylesWithOutColor}
                                                                name="RedactedItemsDescription"               // <- ensures actionMeta.name exists in normal changes
                                                                options={RedactedItem_Type}
                                                                className="custom-multiselect"
                                                                classNamePrefix="custom"
                                                                placeholder="Items need to be redacted..."
                                                                isMulti
                                                                closeMenuOnSelect={false}
                                                                hideSelectedOptions={true}
                                                                menuPlacement="top"
                                                                value={toOptionArray(value?.RedactedItemsDescription)}
                                                                onChange={(selected) => {
                                                                    const arr = Array.isArray(selected) ? selected.map(o => o.value) : [];
                                                                    const joined = arr.join(","); // "VictimName,WitnessName"
                                                                    setValue(v => ({ ...v, RedactedItemsDescription: joined }));
                                                                    setStatesChangeStatus(true)
                                                                }}
                                                                allowSelectAll={!!RedactedItem_Type?.length}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div className="col-12 text-right mt-5 p-0">
                                            {
                                                effectiveScreenPermission ?
                                                    effectiveScreenPermission[0]?.Changeok ?
                                                        <button type="button" disabled={!statesChangeStatus} onClick={() => { updateAgencySetting() }} className="btn btn-sm btn-success">Update</button>
                                                        :
                                                        <>
                                                        </>
                                                    :
                                                    <button type="button" disabled={!statesChangeStatus} onClick={() => { updateAgencySetting() }} className="btn btn-sm btn-success">Update</button>
                                            }
                                        </div>
                                    </div >
                                </div >
                            </div >
                            <ChangesModal func={updateAgencySetting} />
                        </>
                        :
                        <>
                            <p className='text-center mt-2'>You don’t have permission to view data</p>
                        </>
                    :
                    <>
                        <div className="col-12 col-md-12 " >
                            <div className="row ">
                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                    <label htmlFor="" className='new-label'>Maximum Age For Juvenile</label>
                                </div>
                                <div className="col-6 col-md-6 col-lg-2 mt-2 text-field">
                                    <input type="text" name='MaxAgeForJuvenile' value={value?.MaxAgeForJuvenile} onChange={HandleChanges} className='' maxLength={2} required />
                                </div>
                                <div className="col-4 col-md-4 col-lg-3 mt-2 pt-1">
                                    <label htmlFor="" className='new-label'>Reporting Type</label>
                                </div>
                                <div className="col-6 col-md-6 col-lg-3 mt-2 ">
                                    <Select
                                        styles={customStylesWithOutColor}
                                        value={reportingTypeDrp?.filter((obj) => obj.value === value?.ReportingTypeID)}
                                        options={reportingTypeDrp}
                                        onChange={(e) => ChangeDropDown(e, 'ReportingTypeID')}
                                        name="ReportingTypeID"
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                    <label htmlFor="" className='new-label'>Base Date</label>
                                </div>
                                <div className="col-6 col-md-6 col-lg-2 ">
                                    <DatePicker
                                        ref={startRef}
                                        onKeyDown={onKeyDown}
                                        id='BaseDate'
                                        name='BaseDate'
                                        className=''
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        onChange={(date) => {
                                            !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                                            setValue({ ...value, ['BaseDate']: date ? getShowingMonthDateYear(date) : null })
                                        }}
                                        selected={value?.BaseDate && new Date(value?.BaseDate)}
                                        timeInputLabel
                                        isClearable={value?.BaseDate ? true : false}
                                        placeholderText={'Select...'}
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        autoComplete='off'

                                    />
                                </div>

                                <div className="col-6 col-md-6 col-lg-2 mt-1 text-field">
                                    <input type="text" name='SolvabilityRating' value={value?.SolvabilityRating} onChange={HandleChanges} maxLength={3} required />
                                </div>
                                <div className="col-8 col-md-8 col-lg-3 mt-2 pt-1">
                                    <label htmlFor="" className='new-label'>Maximum Age For Statutory Rape</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                    <input type="text" name='MaxAgeForStatutoryRape' value={value?.MaxAgeForStatutoryRape} onChange={HandleChanges} maxLength={3} required />
                                </div>
                                <div className="col-8 col-md-8 col-lg-4 mt-2 pt-1">
                                    <label htmlFor="" className='new-label'>Maximum Age For Juvenile Set By Federal UCR/TIBRS</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                    <input type="text" name='MaxAgeForJuvenileByFederal_UCR_NIBRS' value={value?.MaxAgeForJuvenileByFederal_UCR_NIBRS} onChange={HandleChanges} maxLength={2} required />
                                </div>
                                <div className="col-12 col-md-12 col-lg-12">
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0 mt-1">
                                            <input type="checkbox" name='IsEnhancedNameIndex' checked={value?.IsEnhancedNameIndex} value={value?.IsEnhancedNameIndex} onChange={HandleChanges} />
                                            <label className='ml-2' >Enhanced Name Index</label>
                                        </div>
                                        <div className="col-12 col-md-12 col-lg-12 mt-1 ml-lg-5 pl-lg-5 ml-md-0 pl-md-0">
                                            <input type="checkbox" name='IsAliasReqForConsolidating' checked={value?.IsAliasReqForConsolidating} value={value?.IsAliasReqForConsolidating} onChange={HandleChanges} />
                                            <label className='ml-2' >Alias Required For Consolidating</label>
                                        </div>

                                    </div>
                                    <div className="col-12 text-right mt-2 p-0" style={{ position: 'fixed', bottom: '10px', right: '29px' }}>
                                        {
                                            effectiveScreenPermission ?
                                                effectiveScreenPermission[0]?.Changeok ?
                                                    <button type="button" disabled={!statesChangeStatus} onClick={() => { updateAgencySetting() }} className="btn btn-sm btn-success">Update</button>
                                                    :
                                                    <>
                                                    </>
                                                :
                                                <button type="button" disabled={!statesChangeStatus} onClick={() => { updateAgencySetting() }} className="btn btn-sm btn-success">Update</button>
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                        <ChangesModal func={updateAgencySetting} />
                        {/* <ChangesModal hasPermission={permissionForEditAgencySetting} func={updateAgencySetting} /> */}
                    </>
            }
        </>
    )
}

export default AgencySetting