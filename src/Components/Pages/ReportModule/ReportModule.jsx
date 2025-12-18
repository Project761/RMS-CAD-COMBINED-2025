import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Decrypt_Id_Name, Requiredcolour, base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, editorConfig, filterPassedDateTimeZone, getShowingDateText, getShowingMonthDateYear, getYearWithOutDateTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision, fetchPostDataNew, fetch_Post_Data } from '../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import DeletePopUpModal from '../../Common/DeleteModal';
import Loader from '../../Common/Loader';
import { AgencyContext } from '../../../Context/Agency/Index';
import Select from "react-select";
import DatePicker from 'react-datepicker';
import { changeArrayFormat_Active_InActive, Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name, Comman_changeArrayFormatReasonCode, threeColArray } from '../../Common/ChangeArrayFormat';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_AgencyOfficer_Data, get_Report_Approve_Officer_Data } from '../../../redux/actions/IncidentAction';
import { get_Narrative_Type_Drp_Data, get_PlateType_Drp_Data, get_PropertyTypeData, get_State_Drp_Data, get_VehicleLossCode_Drp_Data } from '../../../redux/actions/DropDownsData';
import ChangesModal from '../../Common/ChangesModal';
import SelectBox from '../../Common/SelectBox';

// ckeditor 5
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';
import { ClassicEditor } from 'ckeditor5';
import ReactQuill from 'react-quill';
import CurrentIncMasterReport from '../Incident/IncidentTab/CurrentIncMasterReport';
import { matchIncidentWords } from '../../../CADUtils/functions/redactFind';
import Tab from '../../Utility/Tab/Tab';
import { isEmptyCheck } from '../../../CADUtils/functions/common';
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

const ReportModule = (props) => {
    const navigate = useNavigate();

    const { incidentReportedDate, isPreviewNormalReport, isCaseManagement = false, CaseId = null } = props
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    var NarrativeAssignId = query?.get("narrativeAssignId");
    var IncNo = query?.get("IncNo");
    var NarrativeAutoSaveID = query?.get("narrativeAutoSaveId");
    var narrativeId = query?.get("narrativeId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!NarrativeAssignId) NarrativeAssignId = 0;
    else NarrativeAssignId = parseInt(base64ToString(NarrativeAssignId));
    if (!NarrativeAutoSaveID) NarrativeAutoSaveID = null;
    else NarrativeAutoSaveID = base64ToString(NarrativeAutoSaveID);
    if (!narrativeId) narrativeId = null;
    else narrativeId = base64ToString(narrativeId);

    const tabParam = query.get("tab");
    const assigned = query.get("Assigned");

    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state?.Agency?.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const agencyOfficerFullNameDrpData = useSelector((state) => state.DropDown.agencyOfficerFullNameDrpData);
    const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
    const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);
    const vehicleLossCodeDrpData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);
    const plateTypeIdDrp = useSelector((state) => state.DropDown.vehiclePlateIdDrpData)
    const stateList = useSelector((state) => state.DropDown.stateDrpData);
    const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);

    const { get_IncidentTab_Count, get_Incident_Count, changesStatus, setChangesStatus, nibrsStatus, GetDataTimeZone, datezone, setassignedReportID, validate_IncSideBar, offenceFillterData, get_Offence_Data } = useContext(AgencyContext);

    const [narrativeData, setNarrativeData] = useState([]);
    const [upDateCount, setUpDateCount] = useState(0);
    const [status, setStatus] = useState(false);
    const [narrativeID, setNarrativeID] = useState('');
    const [loder, setLoder] = useState(false);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [incidentID, setIncidentID] = useState('');
    const [loginPinID, setLoginPinID] = useState();
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [selectedOption, setSelectedOption] = useState("Individual");
    const [multiSelected, setMultiSelected] = useState({ optionSelected: null })
    const [narrativeAssignId, setnarrativeAssignId] = useState(false);
    const [showModalAssign, setshowModal] = useState(false);
    const [narrativeInformation, setNarrativeInformation] = useState('');
    const [editval, setEditval] = useState();
    const [incidentData, setIncidentData] = useState();
    const [LastComments, SetLastComments] = useState([]);
    const [WrittenForDataDrp, setWrittenForDataDrp] = useState([]);
    const [IsSupervisor, setIsSupervisor] = useState(false);
    const [IsSuperadmin, setIsSuperadmin] = useState(false);
    const [narrativeTypeCode, setnarrativeTypeCode] = useState('');
    const [primaryOfficer, setprimaryOfficer] = useState('');
    const [showModal, setShowModal] = useState(false);
    // ucr reportdata
    const [printIncReport, setIncMasterReport] = useState(false);
    const [IncReportCount, setIncReportCount] = useState(1);

    const [permissionForEdit, setPermissionForEdit] = useState(false);
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [isUpdated, setIsUpdated] = useState(false);
    const [redactingData, setRedactingData] = useState({});
    const [detectedWords, setDetectedWords] = useState([]);
    const [missingField, setMissingField] = useState({});
    const [isNormalReport, setNormalReport] = useState(true);
    const [redactedComment, setRedactedComment] = useState("");
    const [checkWebWorkFlowStatus, setcheckWebWorkFlowStatus] = useState(false);
    const [IsSelfApproved, setIsSelfApproved] = useState(false);
    const [skipApproverAuthor, setskipApproverAuthor] = useState(false);
    const [showModalRecall, setshowModalRecall] = useState(false);
    const [reportTemplateDropdownData, setReportTemplateDropdownData] = useState([]);
    const detectedWordsRef = useRef([]);
    const quillEditorRef = useRef(null);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
    const [autocompletePosition, setAutocompletePosition] = useState({ top: 0, left: 0, show: false });
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [currentKeyword, setCurrentKeyword] = useState(''); // Store the keyword (Gender, DOB, Race)
    const [fieldDropdown, setFieldDropdown] = useState({ show: false, field: '', position: { top: 0, left: 0 }, startIndex: 0, endIndex: 0, requiresParen: false, hasClosingParen: false });
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [residentIDDrp, setResidentIDDrp] = useState([]);
    // const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [victimIdDrp, setVictimIdDrp] = useState([]);
    const [offenderIdDrp, setOffenderIdDrp] = useState([]);
    const [otherIdDrp, setOtherIdDrp] = useState([]);
    const [dataList, setDataList] = useState();
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [degreeDrpDwnVal, setDegreeDrpDwnVal] = useState([]);
    const [vehicleCategoryIdDrp, setVehicleCategoryIdDrp] = useState([]);
    const [propertyCategoryData, setPropertyCategoryData] = useState([]);
    console.log(">>>propertyCategoryData", propertyCategoryData)
    const [propertyLossCodeData, setPropertyLossCodeData] = useState([]);
    console.log(">>>propertyLossCodeData", propertyLossCodeData)
    // Define keyword-based suggestions (using useMemo to avoid recreating on each render)
    const [narrativeAutoSaveID, setNarrativeAutoSaveID] = useState(NarrativeAutoSaveID);
    const autosaveIntervalRef = useRef(null);
    const valueRef = useRef(null);
    const narrativeAutoSaveIDRef = useRef(null);
    const isLoadingAutoSaveRef = useRef(false);

    const keywordSuggestions = useMemo(() => ({
        // 'Gender': ['Male', 'Female'],
        'DOB': ['1999', '2000', '2001'],
        'Race': [
            { value: "American Indian or Alaska Native", label: "American Indian or Alaska Native" },
            { value: "Asian", label: "Asian" },
            { value: "Black or African American", label: "Black or African American" },
            { value: "Native Hawaiian or Other Pacific Islander", label: "Native Hawaiian or Other Pacific Islander" },
            { value: "Unknown", label: "Unknown" },
            { value: "White", label: "White" }
        ]
    }), []);

    // Field dropdown options
    const fieldOptions = useMemo(() => ({
        'Gender': sexIdDrp?.map(item => item.label),
        'Race': raceIdDrp?.map(item => item.label),
        // 'DOB': ['1999', '2000', '2001'], // DOB will be handled differently if needed
        'Ethnicity': ethinicityDrpData?.map(item => item.label),
        'Resident': residentIDDrp?.map(item => item.label),
        'Victim': victimIdDrp?.map(item => item.Description),
        'Offender': offenderIdDrp?.map(item => item.Description),
        'Other': otherIdDrp?.map(item => item.Description),
        'Vehicle Category': vehicleCategoryIdDrp?.map(item => item.label),
        'Vehicle Loss Code': vehicleLossCodeDrpData?.map(item => item.label),
        'Plate Type': plateTypeIdDrp?.map(item => item.label),
        'Plate State': stateList?.map(item => item.label),
        'Property Loss Code': propertyLossCodeData?.map(item => item.Description),
        'Property Category': propertyCategoryData?.map(item => item.Description),
    }), [sexIdDrp, raceIdDrp, ethinicityDrpData, residentIDDrp, victimIdDrp, offenderIdDrp, otherIdDrp, vehicleCategoryIdDrp, vehicleLossCodeDrpData, plateTypeIdDrp, stateList, propertyLossCodeData, propertyCategoryData]);
    const [value, setValue] = useState({
        'IncidentId': '', 'NarrativeID': '', 'ReportedByPINActivityID': null, 'NarrativeTypeID': null, 'AsOfDate': null,
        'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'ApprovingSupervisorID': '', 'NarrativeAssignedID': '', 'WrittenForID': '',
        'Comments': '', 'CommentsDoc': '', 'reportTemplateTypeId': null
    })

    // Initialize refs after value state is defined
    if (valueRef.current === null) {
        valueRef.current = value;
    }
    if (narrativeAutoSaveIDRef.current === null) {
        narrativeAutoSaveIDRef.current = narrativeAutoSaveID;
    }

    const [errors, setErrors] = useState({
        'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '', 'WrittenForIDError': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(parseInt(localStoreData?.PINID));
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID);
            setnarrativeAssignId(NarrativeAssignId);
            get_NarrativesData(IncID, localStoreData?.PINID);
            GetData_ReportWorkLevelCheck(localStoreData?.AgencyID, narrativeID);
            setIsSupervisor(localStoreData?.IsSupervisor); get_IncidentTab_Count(IncID, localStoreData?.PINID); setIsSuperadmin(localStoreData?.IsSuperadmin);
            if (NarrativeAssignId && tabParam && !assigned) { setNarrativeID(NarrativeAssignId); GetSingleData(NarrativeAssignId); }
            else if (NarrativeAssignId && tabParam && assigned) {
                GetSingleDataOfficers(NarrativeAssignId);
            }
            get_Offence_Data(IncID);
        }
    }, [localStoreData, IncID]);


    useEffect(() => {
        if (NarrativeAssignId) {
            setnarrativeAssignId(NarrativeAssignId);
            GetData_ReportWorkLevelCheck(localStoreData?.AgencyID, NarrativeAssignId);
            dispatch(get_Report_Approve_Officer_Data(localStoreData?.AgencyID, localStoreData?.PINID, NarrativeAssignId));
        }
    }, [NarrativeAssignId, localStoreData]);

    // Keep refs in sync with state
    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    useEffect(() => {
        narrativeAutoSaveIDRef.current = narrativeAutoSaveID;
    }, [narrativeAutoSaveID]);

    // Sync narrativeAutoSaveID from URL to state on mount
    useEffect(() => {
        if (NarrativeAutoSaveID && !narrativeAutoSaveID) {
            setNarrativeAutoSaveID(NarrativeAutoSaveID);
        }
    }, [NarrativeAutoSaveID, narrativeAutoSaveID]);

    // Load autosave data when narrativeAutoSaveId exists in URL and user navigates to Report tab
    useEffect(() => {
        if (NarrativeAutoSaveID && loginAgencyID && !narrativeID && !status && !NarrativeAssignId) {
            GetAutoSaveData(loginAgencyID, NarrativeAutoSaveID);
        }
    }, [NarrativeAutoSaveID, loginAgencyID, narrativeID, status, NarrativeAssignId]);

    // Helper function to update URL with or without narrativeAutoSaveId
    const updateURLWithAutoSaveID = useCallback((autoSaveID) => {
        if (!isCaseManagement) {
            const params = new URLSearchParams(window.location.search);
            if (autoSaveID) {
                params.set('narrativeAutoSaveId', stringToBase64(autoSaveID));
            } else {
                params.delete('narrativeAutoSaveId');
            }
            const newURL = `${window.location.pathname}?${params.toString()}`;
            navigate(newURL, { replace: true });
        }
    }, [isCaseManagement, navigate]);

    // Autosave function - only called by interval, not on typing
    // Using refs to access current values without causing re-renders
    const handleNarrativeAutoSave = useCallback(() => {
        // Access current values from refs to avoid dependency issues
        const currentValue = valueRef.current;
        const currentAutoSaveID = narrativeAutoSaveIDRef.current;

        // Only autosave if:
        // 1. Report is not saved (narrativeID is empty)
        // 2. Not in edit mode (status is false)
        // 3. Has required data
        if (!narrativeID && !status && loginAgencyID && loginPinID && IncID && currentValue.Comments) {
            const val = {
                AgencyID: loginAgencyID,
                CreatedByUserFK: loginPinID,
                IncidentId: IncID,
                ReportedByPINActivityID: currentValue.ReportedByPINActivityID || 0,
                NarrativeTypeID: currentValue.NarrativeTypeID || 0,
                Comments: currentValue.Comments || '',
                AsOfDate: currentValue.AsOfDate ? new Date(currentValue.AsOfDate).toISOString() : new Date().toISOString(),
                ReportTemplateID: currentValue.reportTemplateTypeId ? String(currentValue.reportTemplateTypeId) : '',
                WrittenForID: currentValue.WrittenForID ? String(currentValue.WrittenForID) : ''
            };

            // If narrativeAutoSaveID exists, use Update API, otherwise use Insert API
            if (currentAutoSaveID) {
                // Update existing autosave record
                val.NarrativeID = parseInt(currentAutoSaveID);
                AddDeleteUpadate('Narrative/Update_NarrativeAutoSave', val)
                    .then((res) => {
                        // Update successful, no need to update URL as ID remains the same
                        if (res && res.success) {
                            // Optionally handle success response
                        }
                    })
                    .catch((error) => {
                        console.error('Autosave update error:', error);
                    });
            } else {
                // Insert new autosave record (first time only)
                AddDeleteUpadate('Narrative/Insert_NarrativeAutoSave', val)
                    .then((res) => {
                        const data = JSON.parse(res?.data)?.Table;
                        setNarrativeAutoSaveID(data?.[0]?.NarrativeAutoSaveID);
                        updateURLWithAutoSaveID(data?.[0]?.NarrativeAutoSaveID);
                    })
                    .catch((error) => {
                        console.error('Autosave insert error:', error);
                    });
            }
        }
    }, [narrativeID, status, loginAgencyID, loginPinID, IncID, updateURLWithAutoSaveID]);

    // Autosave useEffect - runs every 10 seconds for new, unsaved reports (NOT on typing)
    useEffect(() => {
        // Clear any existing interval
        if (autosaveIntervalRef.current) {
            clearInterval(autosaveIntervalRef.current);
            autosaveIntervalRef.current = null;
        }

        // Only set up autosave if:
        // 1. Report is not saved (narrativeID is empty)
        // 2. Not in edit mode (status is false)
        // 3. Has login data
        if (!narrativeID && !status && loginAgencyID && loginPinID && IncID) {
            // Set interval to call autosave every 10 seconds (NOT immediately)
            autosaveIntervalRef.current = setInterval(() => {
                handleNarrativeAutoSave();
            }, 10000); // 10 seconds
        }

        // Cleanup interval on unmount or when conditions change
        return () => {
            if (autosaveIntervalRef.current) {
                clearInterval(autosaveIntervalRef.current);
                autosaveIntervalRef.current = null;
            }
        };
    }, [narrativeID, status, loginAgencyID, loginPinID, IncID, handleNarrativeAutoSave]);

    const get_Name_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
            if (data) {
                // setAgeUnitDrpData(threeColArray(data[0]?.AgeUnit, 'AgeUnitID', 'Description', 'AgeUnitCode'));
                setEthinicityDrpData(Comman_changeArrayFormat(data[0]?.Ethnicity, 'EthnicityID', 'Description'));
                setSexIdDrp(Comman_changeArrayFormat(data[0]?.Gender, 'SexCodeID', 'Description'));
                setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));

                // setVerifyIdDrp(Comman_changeArrayFormat(data[0]?.HowVerify, 'VerifyID', 'Description'));
                // setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));
                // setStateList(Comman_changeArrayFormat(data[0]?.State, "StateID", "State"));
                // setSuffixIdDrp(Comman_changeArrayFormat(data[0]?.Suffix, 'SuffixID', 'Description'));
                // setPhoneTypeIdDrp(threeColArray(data[0]?.ContactType, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
            } else {
                // setAgeUnitDrpData([]);
                setEthinicityDrpData([]);
                setSexIdDrp([]);
                //   setVerifyIdDrp([]);
                setRaceIdDrp([]);
                //  setStateList([]); setSuffixIdDrp([]);
                // setPhoneTypeIdDrp([]);
            }
        })
    };

    const get_General_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetGeneralDropDown', val).then((data) => {
            if (data) {
                setResidentIDDrp(
                    Comman_changeArrayFormat_With_Name(data[0]?.Resident, "ResidentID", "Description", "ResidentID")
                );
            } else {
                setResidentIDDrp([]);
            }
        })
    };

    // useEffect(() => {
    //     if (localStoreData) {
    //       setAgencyName(localStoreData?.Agency_Name);
    //       setUserName(localStoreData?.fullName);
    //       // setUserName(localStoreData?.UserName);
    //       // setUserName(localStoreData?.UserName ? localStoreData?.UserName?.split(",")[0] : '');
    //       getReportPermission(localStoreData?.AgencyID, localStoreData?.PINID)
    //     }
    //   }, [localStoreData]);
    const checkId = (id, obj) => {
        const status = obj?.filter((item) => item?.value == id)
        return status?.length > 0
    }

    const checkWrittenId = async (id, obj) => {
        const status = await obj?.filter((item) => item?.value == id)
        return status?.length > 0
    }

    useEffect(() => {
        if (IncID) {
            setIncidentID(IncID); get_NarrativesInformation(IncID); get_Incident_Count(IncID);
        }
    }, [IncID,]);


    const GetReasonIdDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, CategoryID: 1, Role: [1, 2, 3] }
        fetchPostData('NameReasonCode/GetDataDropDown_NameReasonCode', val).then((data) => {
            if (data) {
                // setReasonIdDrp(data);
                setVictimIdDrp(data?.filter((item) => item?.IsVictimName === true));
                setOffenderIdDrp(data?.filter((item) => item?.IsOffenderName === true));
                setOtherIdDrp(data?.filter((item) => item?.IsOther === true));
            } else {
                // setReasonIdDrp([]);
                setVictimIdDrp([]);
                setOffenderIdDrp([]);
                setOtherIdDrp([]);
            }
        })
    }

    const fetchData = async () => {
        try {
            const res = await fetch_Post_Data("ChargeCodes/GetData_ChargeCodes", {
                PageCount: '',
                PageRecord: '',
                AgencyID: loginAgencyID,
                ChargeCode: "",
                Description: "",
                FBIDescriptionCode: "",
                IsActive: '1',
                IsSuperAdmin: '1',
                PINID: '1',
                OrderTypeDescription: '',
                OrderTypeCode: 'Asc',
                Ispagination: false
            });

            if (res) {
                setDataList(changeArrayFormatNew(res?.Data));

            } else {
                setDataList([]);

            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setDataList([]);

        }
    };

    const GetDataPropertytypeWithLossCode = async (loginAgencyID) => {
        try {
            const res = await fetchPostDataNew("PropertytypeWithLossCode/GetData_LossCodeList", {
                "AgencyID": loginAgencyID,
                IsArticleReason: 0,
                IsBoatReason: 0,
                IsGunReason: 0,
                IsSecurityReason: 0,
                IsOtherReason: 0,
                IsDrugReason: 0
            });
            if (res) {
                setPropertyLossCodeData(res?.Table);
            } else {
                setPropertyLossCodeData([]);

            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setPropertyLossCodeData([]);
        }
    };

    const GetData_PropertytypeWithCategory = async (loginAgencyID) => {
        try {
            const res = await fetchPostDataNew("PropertytypeWithLossCode/GetData_CategoryList", {
                "AgencyID": loginAgencyID,

            });
            if (res) {
                setPropertyCategoryData(res?.Table);
            } else {
                setPropertyCategoryData([]);

            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setPropertyCategoryData([]);
        }
    };

    const CategoryDrpDwnVal = (loginAgencyID,) => {

        const val = { 'AgencyID': loginAgencyID, };
        fetchPostData("ChargeCategory/GetDataDropDown_ChargeCategory", val).then(
            (data) => {
                // console.log("🚀 ~ CategoryDrpDwnVal ~ data:", data)
                if (data) setCategoryIdDrp(Comman_changeArrayFormat(data, "ChargeCategoryID", "Description"));
                else setCategoryIdDrp([]);
            }
        );
    };

    const getDegreeDropVal = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData("ChargeDegree/GetDataDropDown_ChargeDegree", val).then((data) => {
            if (data) {
                setDegreeDrpDwnVal(data)
            } else {
                setDegreeDrpDwnVal();
            }
        })
    }

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
                setVehicleCategoryIdDrp(threeColArray(data, 'PropertyDescID', 'Description', 'PropDescCode'))
            } else {
                setVehicleCategoryIdDrp([]);
            }
        })
    }
    useEffect(() => {

        if (loginAgencyID) {
            dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
            Get_WrittenForDataDrp(loginAgencyID, IncID);
            Get_AgencyWiseRedactingReport(loginAgencyID, IncID);
            dispatch(get_Report_Approve_Officer_Data(loginAgencyID, loginPinID, narrativeID));
            if (narrativeTypeDrpData?.length === 0) { dispatch(get_Narrative_Type_Drp_Data(loginAgencyID)) }
            if (narrativeID) get_Group_List(loginAgencyID, loginPinID, narrativeID);
            get_IncidentTab_Count(IncID, loginPinID);
            get_Name_Drp_Data(loginAgencyID)
            get_General_Drp_Data(loginAgencyID)
            GetReasonIdDrp(loginAgencyID);
            fetchData();
            CategoryDrpDwnVal(loginAgencyID);
            getDegreeDropVal(loginAgencyID);
            PropertyType(loginAgencyID);
            GetDataPropertytypeWithLossCode(loginAgencyID);
            GetData_PropertytypeWithCategory(loginAgencyID);
            if (vehicleLossCodeDrpData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(loginAgencyID)) };
            if (plateTypeIdDrp?.length === 0) { dispatch(get_PlateType_Drp_Data(loginAgencyID)) };
            if (stateList?.length === 0) { dispatch(get_State_Drp_Data()) };
            if (propertyTypeData?.length === 0) { dispatch(get_PropertyTypeData(loginAgencyID)) };
        }

    }, [loginAgencyID])



    const GetSingleData = (NarrativeID) => {
        const val = { 'NarrativeID': NarrativeID }
        fetchPostData('Narrative/GetSingleData_Narrative', val)
            .then((res) => {
                const setChargeCode = res[0]?.LastComments;
                SetLastComments(setChargeCode);
                if (res) {
                    setEditval(res);
                    setStatus(true)
                }
                else { setEditval() }
            })
    }

    // Get autosave data when narrativeAutoSaveId exists in URL
    const GetAutoSaveData = useCallback((AgencyID, NarrativeAutoSaveID) => {
        if (!AgencyID || !NarrativeAutoSaveID) return;

        const val = {
            'AgencyID': AgencyID,
            'NarrativeID': parseInt(NarrativeAutoSaveID)
        };

        isLoadingAutoSaveRef.current = true;
        fetchPostData('Narrative/GetByID_NarrativeAutoSave', val)
            .then((res) => {
                if (res && res.length > 0) {
                    const autoSaveData = res[0];
                    // Set form values from autosave data using functional update to preserve existing fields
                    setValue((prevValue) => {
                        const updatedValue = {
                            ...prevValue,
                            'IncidentId': autoSaveData?.IncidentID ? String(autoSaveData.IncidentID) : prevValue.IncidentId,
                            'AsOfDate': autoSaveData?.CreatedDtTm ? getShowingDateText(autoSaveData.CreatedDtTm) : null,
                            'NarrativeTypeID': autoSaveData?.NarrativeTypeID || null,
                            'reportTemplateTypeId': autoSaveData?.ReportTemplateTypeID || null,
                            'ReportedByPINActivityID': autoSaveData?.PreparedByID || loginPinID,
                            'WrittenForID': autoSaveData?.WrittenForID || '',
                            'Comments': autoSaveData?.ReportText ? autoSaveData.ReportText.trim() : '',
                            'CommentsDoc': autoSaveData?.ReportText ? autoSaveData.ReportText.trim() : '',
                        };
                        // Update ref immediately
                        valueRef.current = updatedValue;
                        return updatedValue;
                    });
                    // Reset flag after a short delay to allow state to update
                    setTimeout(() => {
                        isLoadingAutoSaveRef.current = false;
                    }, 500);
                } else {
                    isLoadingAutoSaveRef.current = false;
                }
            })
            .catch((error) => {
                console.error('Error fetching autosave data:', error);
                isLoadingAutoSaveRef.current = false;
            });
    }, [loginPinID]);

    const Get_WrittenForDataDrp = async (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        await fetchPostData('Narrative/GetData_WrittenForOfficer', val).then((data) => {
            if (data) {
                setWrittenForDataDrp(changeArrayFormat_Active_InActive(data, 'PINID', 'HeadOfAgency', 'IsActive'));
            } else {
                setWrittenForDataDrp([]);
            }
        })
    }

    const Get_AgencyWiseRedactingReport = async (loginAgencyID, IncID) => {
        const val = { AgencyID: loginAgencyID, IncidentID: IncID }
        await fetchPostDataNew('CAD/RedactingofReports/GetAgencyWiseRedactingReport', val).then((data) => {
            if (data.length > 0) {
                setRedactingData(JSON.parse(data));
            } else {
                setRedactingData([]);
            }
        })
    }

    useEffect(() => {
        if (narrativeTypeCode.toLowerCase() === 'ni') {
            setValue({ ...value, 'WrittenForID': primaryOfficer, });
        }
    }, [WrittenForDataDrp])

    const GetSingleDataOfficers = (assignedReportID) => {
        const val = { 'NarrativeAssignedID': assignedReportID }
        fetchPostData('IncidentNarrativeAssigned/GetSingleData_IncidentNarrativeAssigned', val)
            .then((res) => {
                if (res) {
                    setEditval(res);
                    setStatus(true)
                }
                else {
                    setEditval()
                }
            })
    }

    const GetEditData = (incidentID) => {
        const val = { IncidentID: incidentID };
        fetchPostData("Incident/GetSingleData_Incident", val).then((res) => {
            if (res?.length > 0) {
                setIncidentData(res[0]);
                const primaryOfficerID = res[0]?.PrimaryOfficerID;
                setprimaryOfficer(primaryOfficerID);
            }
        });
    };

    useEffect(() => {
        if (IncID) {
            GetEditData(IncID);
        }
    }, [IncID, localStoreData]);

    useEffect(() => {
        // Don't reset value if we're currently loading autosave data
        // if (isLoadingAutoSaveRef.current) return;

        if (editval?.length > 0 && !narrativeAutoSaveID) {

            const accessIDs = editval[0]?.ApprovingSupervisorID1?.split(',').map(id => parseInt(id));
            setValue({
                ...value,
                'AsOfDate': editval[0]?.AsOfDate || editval[0]?.CreatedDtTm ? getShowingDateText(editval[0]?.AsOfDate || editval[0]?.CreatedDtTm) : null,
                'NarrativeID': editval[0]?.NarrativeID, 'NarrativeTypeID': editval[0]?.NarrativeTypeID, 'reportTemplateTypeId': editval[0]?.reportTemplateTypeId,
                'ReportedByPINActivityID': NarrativeAssignId && tabParam && assigned && !narrativeID ? loginPinID : editval[0]?.ReportedByPINActivityID,
                'WrittenForID': NarrativeAssignId && tabParam && assigned ? (checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : loginPinID) : (narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : editval[0]?.WrittenForID),
                'ApprovingSupervisorID': editval[0]?.ApprovingSupervisorID1, 'Status': editval[0]?.Status, 'ModifiedByUserFK': loginPinID,
                'Comments': editval[0]?.Comments ? editval[0].Comments?.trim() : '', 'CommentsDoc': editval[0]?.CommentsDoc,
            });
            const initialSelectedOptions = (editval[0]?.ApprovingSupervisorType === 'Group' ? groupList : reportApproveOfficer)
                .filter(option => accessIDs?.includes(option.value));
            setMultiSelected({ optionSelected: initialSelectedOptions });
            setSelectedOption(editval[0]?.ApprovingSupervisorType ? editval[0]?.ApprovingSupervisorType : "Individual");
            setIsUpdated(true)
            setRedactedComment(editval[0]?.RedactedComment)
        } else {
            // Only reset if we're not loading autosave data and not in edit mode
            if (!narrativeAutoSaveID && !status) {
                setValue({
                    ...value,
                    'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerFullNameDrpData) ? loginPinID : loginPinID,
                    'WrittenForID': narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : loginPinID,
                });
                setRedactedComment("")
            }
        }
    }, [editval, groupList, reportApproveOfficer, primaryOfficer])

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            // reset()
            setShowModal(false)
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    useEffect(() => {
        if (value?.NarrativeTypeID) {
            const val = {
                NarrativeTypeID: value?.NarrativeTypeID,
                AgencyID: loginAgencyID
            };
            fetchPostData("ReportTemplate/NarrativeTypeIDReportTemplate", val).then((res) => {
                if (res) {
                    const data = res || [];
                    setReportTemplateDropdownData(data);
                } else {
                    //    console.error("error") 
                }
            });

        }
    }, [value?.NarrativeTypeID])

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value });
        } else {
            setValue({ ...value, [name]: null });
        }
    }

    const ChangeDropDownReportType = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setnarrativeTypeCode(e.type);
            setValue({ ...value, [name]: e.value, reportTemplateTypeId: '', CommentsDoc: '', Comments: '' });
            Get_WrittenForDataDrp(loginAgencyID, IncID);
        } else {
            setnarrativeTypeCode('');
            setValue({ ...value, [name]: null, reportTemplateTypeId: '', CommentsDoc: '', Comments: '' });

        }
    }

    const ChangeDropDownReportTemplateType = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        const { Agency_Name, AgencyAddress, ORI, StateName, ZipCode, City, fullName } = localStoreData;
        const Offenses = offenceFillterData?.map(offense => {
            const category = categoryIdDrp?.find(category => category.value === offense?.CategoryId);
            const categoryLabel = category?.label;
            const parts = [];

            if (offense?.OffenseName_Description) {
                parts.push(offense.OffenseName_Description);
            }
            if (categoryLabel) {
                parts.push(categoryLabel);
            }
            if (offense?.AttemptComplete) {
                parts.push(offense.AttemptComplete);
            }

            const offenseText = parts.join(' - ');
            return offenseText;
        }).filter(Boolean).join('<br/>');
        if (e) {
            // Build address parts conditionally to avoid undefined
            const addressParts = [];
            if (AgencyAddress) addressParts.push(AgencyAddress);
            if (City) addressParts.push(City);
            if (StateName) addressParts.push(StateName);
            if (ZipCode) addressParts.push(ZipCode);
            const agencyAddress = addressParts.length > 0 ? addressParts.join(', ') + '.' : '';

            let updatedData = e?.templateContent
                .replace(/{{OfficerName}}/g, (fullName || '') + (fullName ? ',' : ''))
                .replace(/{{AgencyName}}/g, (Agency_Name || '') + (Agency_Name ? ',' : ''))
                .replace(/{{AgencyAddress}}/g, agencyAddress)
                .replace(/{{ORI}}/g, ORI || '')
                .replace(/{{IncidentReportedDateTime}}/g, incidentData?.ReportedDate ? (getShowingMonthDateYear(incidentData.ReportedDate) || '') : '')
                .replace(/{{IncidentNumber}}/g, incidentData?.IncidentNumber || '')
                .replace(/{{IncidentCrimeLocation}}/g, incidentData?.CrimeLocation || '')
                .replace(/{{Offenses}}/g, Offenses || '')
            setValue({ ...value, [name]: e.templateID, CommentsDoc: updatedData, Comments: updatedData });
        } else {
            setValue({ ...value, [name]: null, CommentsDoc: '', Comments: '' });
        }
    }

    const check_Validation_Error = () => {
        const ReportedByPinErr = RequiredFieldIncident(value.ReportedByPINActivityID)
        const AsOfDateErr = RequiredFieldIncident(value.AsOfDate)
        const NarrativeIDErr = RequiredFieldIncident(value.NarrativeTypeID)
        const CommentsErr = RequiredFieldIncident(value.Comments?.trim())
        const WrittenForIDErr = RequiredFieldIncident(value.WrittenForID)

        setErrors((prevValues) => {
            return {
                ...prevValues,
                ["ReportedByPinError"]: ReportedByPinErr || prevValues["ReportedByPinError"],
                ["AsOfDateError"]: AsOfDateErr || prevValues["AsOfDateError"],
                ["NarrativeIDError"]: NarrativeIDErr || prevValues["NarrativeIDError"],
                ["CommentsError"]: CommentsErr || prevValues["CommentsError"],
                ["WrittenForIDError"]: WrittenForIDErr || prevValues["WrittenForIDError"],
            };
        });
    }

    // Check All Field Format is True Then Submit 
    const { ReportedByPinError, AsOfDateError, NarrativeIDError, CommentsError, WrittenForIDError } = errors

    useEffect(() => {
        if (ReportedByPinError === 'true' && AsOfDateError === 'true' && NarrativeIDError === 'true' && CommentsError === 'true' && WrittenForIDError === 'true') {
            if (narrativeID && !(NarrativeAssignId && tabParam && assigned) || narrativeID) { updateNarrative() }
            else { submit() }
        }
    }, [ReportedByPinError, AsOfDateError, NarrativeIDError, CommentsError, WrittenForIDError])

    const submit = () => {
        const result = narrativeData?.find(item =>
            item.Comments && value.Comments &&
            item.Comments.toLowerCase() === value.Comments.toLowerCase()
        );
        let resultType = [];
        if (narrativeTypeCode?.toLowerCase() === 'ni') {
            resultType = narrativeData?.filter(item =>
                item.NarrativeTypeCode?.toLowerCase() === 'ni') || [];
        }
        let hasError = false;

        if (result) {
            toastifyError('Comments Already Exists');
            setErrors(prev => ({ ...prev, AsOfDateError: '' }));
            hasError = true;
        }
        if (resultType.length > 0) {
            toastifyError('Report type already exists');
            setErrors(prev => ({ ...prev, AsOfDateError: '' }));
            hasError = true;
        }
        if (hasError) return;
        const {
            CommentsDoc, NarrativeID, Comments, ReportedByPINActivityID, NarrativeTypeID, AsOfDate, WrittenForID, reportTemplateTypeId
        } = value;
        const val = {
            CommentsDoc, Comments, IncidentId: IncID, NarrativeID, ReportedByPINActivityID, NarrativeTypeID,
            AsOfDate, NarrativeAssignedID: narrativeAssignId, WrittenForID, CreatedByUserFK: loginPinID, ApprovingSupervisorID: null, RedactedComment: CommentsDoc || "", reportTemplateTypeId: reportTemplateTypeId,
            ...(isCaseManagement && { CaseID: CaseId, IsCase: true })
        };
        AddDeleteUpadate('Narrative/Insert_Narrative', val)
            .then((res) => {
                if (res.success) {
                    // Clear autosave interval and remove autosave ID from URL when report is saved
                    if (autosaveIntervalRef.current) {
                        clearInterval(autosaveIntervalRef.current);
                        autosaveIntervalRef.current = null;
                    }
                    // Remove narrativeAutoSaveId from URL and state
                    setNarrativeAutoSaveID(null);
                    if (!isCaseManagement) {
                        const params = new URLSearchParams(window.location.search);
                        params.delete('narrativeAutoSaveId');
                        const newURL = `${window.location.pathname}?${params.toString()}`;
                        navigate(newURL, { replace: true });
                    }

                    toastifySuccess(res?.Message); get_NarrativesData(incidentID, loginPinID);
                    GetData_ReportWorkLevelCheck(localStoreData?.AgencyID, res?.NarrativeID);
                    get_IncidentTab_Count(incidentID, loginPinID);
                    get_Incident_Count(incidentID, loginPinID);
                    setNarrativeID(res?.NarrativeID);
                    GetSingleData(res?.NarrativeID); setStatesChangeStatus(false);
                    setChangesStatus(false); setErrors(prev => ({ ...prev, AsOfDateError: '' }));
                    // validateIncSideBar
                    validate_IncSideBar(IncID, IncNo, loginAgencyID);
                }
            });
    };

    const updateNarrative = (e) => {
        const result = narrativeData?.find(item => {
            if (item.Comments) {
                if (item.NarrativeID != value.NarrativeID) {
                    if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                        return item.Comments.toLowerCase() === value.Comments.toLowerCase()
                    } else return item.Comments.toLowerCase() === value.Comments.toLowerCase()
                }
            }
        });

        const resultType = narrativeTypeCode.toLowerCase() === 'ni' && narrativeData?.filter(item => {
            if (item.NarrativeTypeCode) {
                return item.NarrativeTypeCode.toLowerCase() === 'ni';
            }
            return false;
        });

        if (result) {
            toastifyError('Comments Already Exists ')
            setErrors({ ...errors, ['AsOfDateError']: '' })
        }
        // else if (resultType && resultType.length > 0) {
        //   toastifyError('Report type already exists update');
        //   setErrors({ ...errors, ['AsOfDateError']: '' });
        // }
        else {
            const { CommentsDoc, NarrativeID, Comments, ReportedByPINActivityID, NarrativeTypeID, AsOfDate, WrittenForID, reportTemplateTypeId } = value;
            const val = {
                CommentsDoc: CommentsDoc, IncidentId: IncID, NarrativeID: NarrativeID, Comments: Comments, ReportedByPINActivityID: ReportedByPINActivityID, NarrativeTypeID: NarrativeTypeID, AsOfDate: AsOfDate, ModifiedByUserFK: loginPinID, WrittenForID: WrittenForID,
                ApprovingSupervisorID: null, RedactedComment: value.Status === 'Approved' ? redactedComment : CommentsDoc, reportTemplateTypeId: reportTemplateTypeId,
                ...(isCaseManagement && { CaseID: CaseId, IsCase: true })
            };
            AddDeleteUpadate('Narrative/Update_Narrative', val)
                .then((res) => {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);

                    setStatesChangeStatus(false); setChangesStatus(false); GetSingleData(narrativeID);
                    // setStatus(true);  setStatusFalse();
                    setErrors({ ...errors, 'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '', ['ApprovingOfficerError']: '' });
                    get_NarrativesData(incidentID, loginPinID);
                    // validateIncSideBar
                    validate_IncSideBar(IncID, IncNo, loginAgencyID);
                })
        }
    }

    const reset = () => {
        // Clear autosave interval and remove autosave ID from URL when clicking NEW
        if (autosaveIntervalRef.current) {
            clearInterval(autosaveIntervalRef.current);
            autosaveIntervalRef.current = null;
        }
        // Remove narrativeAutoSaveId from URL and state
        setNarrativeAutoSaveID(null);

        if (!isCaseManagement) {
            // Build URL without narrativeAutoSaveId parameter
            const params = new URLSearchParams();
            params.set('IncId', stringToBase64(IncID));
            params.set('IncNo', IncNo);
            params.set('IncSta', true);
            params.set('IsCadInc', true);
            params.set('narrativeAssignId', stringToBase64(''));
            params.set('narrativeId', stringToBase64(''));
            params.set('narrativeAutoSaveId', stringToBase64(''));
            navigate(`/Inc-Report?${params.toString()}`);
        }
        setValue({
            ...value,
            'NarrativeTypeID': '',
            'reportTemplateTypeId': null,
            'NarrativeID': '', 'AsOfDate': null, 'IsReject': '', 'status': '', 'ApprovingSupervisorID': '', 'Status': '', 'IncidentId': '', 'NarrativeID': '',
            'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '', 'IsApprove': '', 'CreatedByUserFK': '',
            'CommentsDoc': '', 'Comments': '',
            'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerFullNameDrpData) ? loginPinID : loginPinID,
            'WrittenForID': narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : loginPinID,
        });
        setRedactedComment("");
        setNormalReport(true);
        setDetectedWords([]);
        setnarrativeTypeCode('')
        setStatus(); setNarrativeID(''); setassignedReportID('');
        setErrors({
            ...errors, 'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '', ['ApprovingOfficerError']: '', 'WrittenForIDError': '',
        });
        setStatesChangeStatus(false); setChangesStatus(false);
        setMissingField({})
    }

    const startRef = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const get_NarrativesData = (incidentID, loginPinID) => {
        const val = { IncidentId: incidentID, OfficerID: loginPinID }
        fetchPostData(isCaseManagement ? '/Narrative/GetData_CaseReport' : 'Narrative/GetData_Narrative', val).then(res => {
            if (res) {
                setNarrativeData(res); setLoder(true)
            } else {
                setNarrativeData([]); setLoder(true)
            }
        })
    }

    const GetData_ReportWorkLevelCheck = (loginAgencyID, narrativeID) => {
        const val = { AgencyID: loginAgencyID, NarrativeID: narrativeID };

        fetchPostData('IncidentNarrativeReport/GetData_ReportWorkLevelCheck', val).then(res => {
            if (res && res.length > 0) {

                const workflowData = res[0];
                const approverAuthor = res[0];
                const canShowApprovalButton = workflowData?.IsMultipleLevel || workflowData?.IsSingleLevel;
                const canApproved = workflowData?.IsSelfApproved;
                setcheckWebWorkFlowStatus(canShowApprovalButton);
                setIsSelfApproved(canApproved);
                setskipApproverAuthor(approverAuthor.IsSkipApproverAuthor);
                // setLoder(true);
            } else {
                // Handle case where no data is returned
                // setNarrativeData([]);
                // setLoder(true);
            }
        });
    };


    const get_NarrativesInformation = (incidentID) => {
        const val = { IncidentId: incidentID, }
        fetchPostData('Narrative/Narrative_Info', val).then(res => {
            if (res) {
                setNarrativeInformation(res); setLoder(true)
            } else {
                setNarrativeInformation([]); setLoder(true)
            }
        })
    }

    const getScreenPermision = (LoginAgencyID, LoginPinID) => {
        ScreenPermision("I032", LoginAgencyID, LoginPinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res);
                setPermissionForEdit(res[0]?.Changeok);
                setPermissionForAdd(res[0]?.AddOK);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);

            } else {
                setEffectiveScreenPermission([]);
                setPermissionForEdit(false);
                setPermissionForAdd(false);
                setaddUpdatePermission(true);
            }
        });
    }

    const conditionalRowStyles = [
        {
            // when: row => String(row.NarrativeID) === String(narrativeID),
            when: row => row?.NarrativeDescription === "Use Of Force" ? "" : parseInt(row.NarrativeID) === parseInt(narrativeID),

            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const columns = [
        {
            name: 'Date/Time',
            selector: (row) => getShowingDateText(row.CreatedDtTm),
            sortable: true
        },
        // {
        //     name: 'Report',
        //     selector: (row) => row?.Comments || '',
        //     format: (row) => (
        //         <>{row?.Comments ? row?.Comments.substring(0, 70) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>
        //     ),
        //     sortable: true
        // },
        {
            name: 'Prepared By',
            selector: (row) => row.ReportedBy_Description,
            sortable: true
        },
        {
            name: 'Written For',
            selector: (row) => row.WrittenFor_Officer,
            sortable: true
        },
        {
            name: 'Report Type',
            selector: (row) => row.NarrativeDescription,
            sortable: true
        },
        {
            name: 'Status',
            selector: row => row.Status,
            sortable: true,
            cell: row => {
                const desc = row.Status?.toLowerCase();
                let backgroundColor = 'transparent';
                let color = 'black'; // Default text color

                // Set background color based on status
                if (desc === 'pending review') {
                    backgroundColor = '#007bff'; // Blue for "Pending Review"
                    color = 'white';
                }
                else if (desc === 'approved') {
                    backgroundColor = '#28a745'; // Green color
                    color = 'white';
                }
                else if (desc === 'draft') {
                    backgroundColor = '#ffc107'; // Orange color
                    color = 'white';
                }
                else if (desc === 'rejected') {
                    backgroundColor = '#FF0000'; // Red color
                    color = 'white';
                }

                return (
                    <span
                        style={{
                            backgroundColor,
                            color,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            fontWeight: 'bold',
                        }}
                    >
                        {row.Status}
                    </span>
                );
            }
        },
        {
            name: 'Comment',
            selector: (row) => row.LastComments,
            sortable: true
        },

        {
            name: 'Approving Officer/Group',
            selector: (row) => row.ApproveOfficer,
            sortable: true
        },
        // {
        //   name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 15 }}>Delete</p>,
        //   cell: row =>
        //     <div style={{ position: 'absolute', top: 4, right: 15 }}>
        //       {
        //         effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
        //           <span onClick={(e) => setNarrativeID(row.NarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
        //             <i className="fa fa-trash"></i>
        //           </span>
        //           : <></>
        //           : <span onClick={(e) => setNarrativeID(row.NarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
        //             <i className="fa fa-trash"></i>
        //           </span>
        //       }
        //     </div>
        // }
        {
            name: (
                <p className='text-end' style={{ position: 'absolute', top: '7px', right: 15 }}>
                    Delete
                </p>
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, right: 15 }}>
                    {
                        row.IsAllowDelete === 'true' || row.IsAllowDelete === true && (
                            effectiveScreenPermission
                                ? effectiveScreenPermission[0]?.DeleteOK &&
                                <span
                                    onClick={() => setNarrativeID(row.NarrativeID)}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                    data-toggle="modal"
                                    data-target="#DeleteModal"
                                >
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <span
                                    onClick={() => setNarrativeID(row.NarrativeID)}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                    data-toggle="modal"
                                    data-target="#DeleteModal"
                                >
                                    <i className="fa fa-trash"></i>
                                </span>
                        )
                    }
                </div>
            )
        }
    ]

    useEffect(() => {
        if (narrativeId && localStoreData) {
            editNarratives(narrativeId);
            setNarrativeID(narrativeId);
            GetData_ReportWorkLevelCheck(localStoreData?.AgencyID, narrativeId);
            dispatch(get_Report_Approve_Officer_Data(localStoreData?.AgencyID, localStoreData?.PINID, NarrativeAssignId));
        }
    }, [narrativeId, localStoreData]);

    const editNarratives = (NarrativeID) => {

        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
            modal?.show();

        } else {
            if (NarrativeID) {
                // Clear autosave interval and remove autosave ID from URL when editing
                if (autosaveIntervalRef.current) {
                    clearInterval(autosaveIntervalRef.current);
                    autosaveIntervalRef.current = null;
                }
                // Remove narrativeAutoSaveId from URL and state
                setNarrativeAutoSaveID(null);
                if (!isCaseManagement) {
                    const params = new URLSearchParams(window.location.search);
                    params.delete('narrativeAutoSaveId');
                    if (NarrativeID) {
                        params.set('narrativeId', stringToBase64(NarrativeID));
                    }
                    const newURL = `${window.location.pathname}?${params.toString()}`;
                    navigate(newURL, { replace: true });
                }

                setNarrativeID(NarrativeID);
                GetSingleData(NarrativeID);
                GetData_ReportWorkLevelCheck(loginAgencyID, NarrativeID);
                if (NarrativeID) get_Group_List(loginAgencyID, loginPinID, NarrativeID);
                setUpDateCount(upDateCount + 1); dispatch(get_Report_Approve_Officer_Data(loginAgencyID, loginPinID, NarrativeID));
                setStatus(true);
                setErrors({ ...errors, 'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '', 'WrittenForIDError': '', }); setStatesChangeStatus(false);
            }
        }
    }

    const setStatusFalse = () => {
        reset();
    }

    const DeleteNarratives = () => {
        const val = { 'narrativeID': narrativeID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('Narrative/Delete_Narrative', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_IncidentTab_Count(incidentID, loginPinID);
            } else { console.error("Somthing Wrong"); }
            get_NarrativesData(incidentID, loginPinID);
            // GetData_ReportWorkLevelCheck(loginAgencyID ,narrativeID);
        })
    }

    const reportedTime = new Date(incidentReportedDate);
    let reportDate = reportedTime.getDate();


    const get_Group_List = (loginAgencyID, loginPinID, NarrativeID) => {
        const value = { AgencyId: loginAgencyID, PINID: loginPinID, NarrativeID: NarrativeID }
        fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'))
                if (res[0]?.GroupID) {
                    setValue({
                        ...value,
                        ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID),
                        'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerFullNameDrpData) ? loginPinID : '',
                        'WrittenForID': narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
                        'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
                    });
                }
            }
            else {
                setGroupList();
            }
        })
    }

    function getLabelsString(data) {
        return data.map(item => item.label).join(',');
    }

    const Add_Approval = async (id) => {
        const { ApprovingSupervisorID, status } = value;
        const documentAccess = selectedOption === "Individual" ? 'Individual' : 'Group';
        let ApprovingSupervisorName = null;
        ApprovingSupervisorName = multiSelected?.optionSelected?.length > 0 ? getLabelsString(multiSelected.optionSelected) : null;
        const val = {
            'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': documentAccess, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': '', 'CreatedByUserFK': loginPinID, 'IsReject': '', 'Comments': '', 'status': status, 'ApprovingSupervisorName': ApprovingSupervisorName,
            ...(isCaseManagement && { CaseID: CaseId })
        };
        AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    get_NarrativesData(incidentID, loginPinID);
                    // GetData_ReportWorkLevelCheck(loginAgencyID ,narrativeID);
                    resets(); reset()
                } else {
                    console.error("something Wrong");
                }
            }).catch(err => console.warn(err));
    }

    const Agencychange = (multiSelected) => {
        setStatesChangeStatus(true)
        setMultiSelected({ optionSelected: multiSelected });
        const id = []
        const name = []
        if (multiSelected) {
            multiSelected.map((item, i) => { id.push(item.value); name.push(item.label) })
            setValue({ ...value, ['ApprovingSupervisorID']: id.toString(), ['DocumentAccess_Name']: name.toString() })
        }
    }

    const handleRadioChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
        setValue({ ...value, ['ApprovingSupervisorID']: "", ['DocumentAccess_Name']: "" })
        setMultiSelected({ optionSelected: [] });
        setErrors({ ...errors, ['ApprovingOfficerError']: '' })
    };

    const colourStylesUsers = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: isDisabled ? '#9d949436' : '#FFE2A8',
            fontSize: 14,
            marginTop: 2,
            boxShadow: 'none',
            cursor: isDisabled ? 'not-allowed' : 'default',
        }),
    };

    const check_Validation_ErrorApproval = () => {
        if (RequiredFieldIncident(value.ApprovingSupervisorID)) {
            setErrors(prevValues => { return { ...prevValues, ['ApprovingOfficerError']: RequiredFieldIncident(value.ApprovingSupervisorID) } })
        }
    }

    const { ApprovingOfficerError } = errors

    useEffect(() => {
        if (ApprovingOfficerError === 'true') {
            Add_Approval(); updateNarrative(); reset();
        }
    }, [ApprovingOfficerError])

    const resets = () => {
        setValue({
            ...value,
            'IncidentId': '', 'NarrativeID': '', 'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '',
            'IsApprove': '', 'CreatedByUserFK': '', 'IsReject': '', 'Comments': '', 'status': ''
        });
        setErrors({ ...errors, ['ApprovingOfficerError']: '' })
        setMultiSelected({ optionSelected: ' ' });
    }

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `.ck-powered-by { display: none !important; }`;
        document.head.appendChild(style);
    }, []);

    const renderNarrativeData = () => {

        const narrative = Array.isArray(narrativeInformation) && narrativeInformation.length > 0 ? narrativeInformation[0] : null;

        return (
            <div className='col-xxl-12'>
                <div className='row'>
                    <div className="col-lg-4">
                        <label htmlFor="" className='new-summary'>Reported DT/TM :</label>
                        <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
                            {narrative ? getShowingDateText(narrative.ReportedDate) : ''}
                        </span>
                    </div>
                    <div className='col-lg-4'>
                        <label htmlFor="" className='new-summary'>Victim :</label>
                        <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
                            {narrative ? narrative.VictimNameData : ''}
                        </span>
                    </div>
                    <div className='col-lg-4'>
                        <label htmlFor="" className='new-summary'>Offender :</label>
                        <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
                            {narrative ? narrative.OffenderNameData : ''}
                        </span>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-lg-8">
                        <label htmlFor="" className='new-summary'>Property :</label>
                        <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
                            {narrative ? narrative.PropertyData : ''}
                        </span>
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="" className='new-summary'>Suspect :</label>
                        <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
                            {narrative ? narrative.SuspectNameData : ''}
                        </span>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-lg-8">
                        <label htmlFor="" className='new-summary'>Vehicle:</label>
                        <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
                            {narrative ? narrative?.VehicleData : ''}
                        </span>
                    </div>
                    <div className="col-lg-4">
                        <label htmlFor="" className='new-summary'>OtherName :</label>
                        <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
                            {narrative ? narrative.OtherNameData : ''}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const isSupervisor = IsSupervisor === true || IsSupervisor === "True";
    const isSuperadmin = IsSuperadmin === true || IsSuperadmin === "true";

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#FFE2A8', // Default background color
            borderColor: state.isFocused ? '#aaa' : '#ccc',
        }),
        option: (provided, state) => {
            const isInactive = state.data?.IsActive === false;
            return {
                ...provided,
                color: isInactive ? 'red' : 'Green',
                backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
            };
        },
        singleValue: (provided, state) => {
            const isInactive = state.data?.IsActive === false;
            return {
                ...provided,
                color: isInactive ? 'red' : 'Green',
            };
        },
    };

    // editor start
    const [ChargesData, setChargesData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [VehicleData, setVehicleData] = useState([]);
    const [CategoryData, setCategoryData] = useState([]);

    useEffect(() => {
        if (redactingData) {

            const data1 = redactingData?.Table4?.[0]?.Description;
            const data2 = redactingData?.Table;
            const data1List = data1?.split(",");

            const filteredCategoryData = data2?.map(item => {
                const allowNames = data1List?.includes(item?.Category);

                return {
                    FullName: allowNames ? item.FullName : "",
                    FirstName: allowNames ? item.FirstName : "",
                    MiddleName: allowNames ? item.MiddleName : "",
                    LastName: allowNames ? item.LastName : "",
                    Address: data1List?.includes("Address") ? item.Address : "",
                    SSN: data1List?.includes("SSN") ? item.SSN : "",
                    Contact: data1List?.includes("Contact") ? item.Contact : "",
                    DateOfBirth: data1List?.includes("DateOfBirth") ? item.DateOfBirth : "",
                    DLNumber: data1List?.includes("DLNumber") ? item.DLNumber : "",
                    // AgeFrom: data1List?.includes("Juveniles") ? item.AgeFrom : "",
                    AgeFrom: item.AgeFrom || "",
                    Category: item.Category,
                };
            });
            setCategoryData(filteredCategoryData || []);


            // const data1 = redactingData?.Table4?.[0]?.Description;
            // const data2 = redactingData?.Table;
            // console.log("data2", data2)
            // const data1List = data1?.split(",");
            // const roleType = ["Victim", "Witness", "Juveniles"]
            // console.log("data1List", data1List)
            // const filteredCategoryData = data2
            //   ?.map(item =>
            //   ({
            //     FullName: roleType.includes(item?.Category) ? item.FullName : "",
            //     FirstName: roleType.includes(item?.Category) ? item.FirstName : "",
            //     MiddleName: roleType.includes(item?.Category) ? item.MiddleName : "",
            //     LastName: roleType.includes(item?.Category) ? item.LastName : "",
            //     Address: data1List?.includes("Address") ? item.Address : "",
            //     SSN: data1List?.includes("SSN") ? item.SSN : "",
            //     Contact: data1List?.includes("Contact") ? item.Contact : "",
            //     OwnerPhoneNumber: data1List?.includes("Contact") ? item.OwnerPhoneNumber : "",
            //     DateOfBirth: data1List?.includes("DateOfBirth") ? item.DateOfBirth : "",
            //     DLNumber: data1List?.includes("DLNumber") ? item.DLNumber : "",
            //     AgeFrom: data1List?.includes("Juveniles") ? item.AgeFrom : "",
            //     Category: item.Category,
            //   }));
            // console.log("filteredCategoryData", filteredCategoryData)
            // setCategoryData(filteredCategoryData || []);

            // --- ChargesData ---
            if (data1List?.includes("Charges")) {
                setChargesData([...redactingData?.Table1]);
            }

            // --- locationData ---
            if (data1List?.includes("CrimeLocation")) {
                setLocationData([...redactingData?.Table3]);
            }

            // --- VehicleData ---
            if (data1List?.includes("VehicleNo")) {
                const filteredVehicleData = redactingData?.Table2?.map(item => ({
                    VehicleNo: item?.VehicleNo,
                    VIN: item?.VIN
                }));
                setVehicleData(filteredVehicleData || []);
            }
        }
    }, [redactingData]);

    useEffect(() => {
        detectedWordsRef.current = Array.isArray(detectedWords) ? detectedWords : [];
    }, [detectedWords]);

    // const onChangeComments = (value) => {
    //     setChangesStatus(true);
    //     setStatesChangeStatus(true);
    //     setRedactedComment(value)
    //     const data = value;
    //     console.log("@@111 @@>>>  ", value)
    //     if (data?.length > 0) {
    //         const val = {
    //             text: data,
    //             IncidentID: incidentID,
    //             AgencyID: loginAgencyID
    //         };
    //         AddDeleteUpadate('/suggestion/MissingFiled', val)
    //             .then((res) => {
    //                 console.log("@@222 @@>>>  ", res?.ReportText)
    //                 setMissingField(res);
    //                 setValue((prevValue) => ({
    //                     ...prevValue,
    //                     CommentsDoc: res?.ReportText,
    //                 }));
    //             })
    //             .catch(err => setMissingField({}));
    //     } else {
    //         setMissingField({});
    //     }
    // }

    // Debounce timer ref for MissingFiled API call
    const missingFieldDebounceRef = useRef(null);
    // Ref to track if update is coming from API response (to prevent infinite loop)
    const isUpdatingFromAPI = useRef(false);
    // Ref to store the last value sent to API (to prevent duplicate calls)
    const lastAPICallValue = useRef('');
    // Ref to store the text that was sent to API (to preserve user-added text)
    const textSentToAPI = useRef('');

    useEffect(() => {
        if (value.Status !== 'Approved' && value.Status !== 'Pending Review') {
            const data = value?.CommentsDoc;

            // Skip if this update is from API response
            if (isUpdatingFromAPI.current) {
                isUpdatingFromAPI.current = false;
                return;
            }

            // Skip if the value hasn't changed from last API call
            if (data === lastAPICallValue.current) {
                return;
            }

            // Clear previous timeout
            if (missingFieldDebounceRef.current) {
                clearTimeout(missingFieldDebounceRef.current);
            }

            // Set new timeout for debouncing (1 second delay - waits for user to stop typing)
            missingFieldDebounceRef.current = setTimeout(() => {
                if (data?.length > 0) {
                    // Store the value we're about to send to API
                    lastAPICallValue.current = data;
                    // Store the text sent to API to preserve user-added text later
                    textSentToAPI.current = data;

                    const val = {
                        text: data,
                        IncidentID: incidentID,
                        AgencyID: loginAgencyID
                    };
                    AddDeleteUpadate('/suggestion/MissingFiled', val)
                        .then((res) => {
                            setMissingField(res);
                            // Update CommentsDoc with the modified HTML from ReportText
                            const reportText = res?.ReportText || res?.data?.ReportText || res?.data?.Table?.[0]?.ReportText;
                            if (reportText) {
                                // Get current editor content to check if user has added text
                                let currentEditorContent = '';
                                if (narrativeQuillRef.current) {
                                    const quillInstance = narrativeQuillRef.current.getEditor();
                                    currentEditorContent = quillInstance.root.innerHTML;
                                } else {
                                    currentEditorContent = value?.CommentsDoc || '';
                                }

                                // Only update if the current content still matches what we sent to API
                                // This preserves user-added text that was typed after the API call was made
                                const textSentToAPIValue = textSentToAPI.current;

                                // Compare plain text (without HTML tags) to check if content has changed
                                const stripHtml = (html) => {
                                    const tmp = document.createElement('DIV');
                                    tmp.innerHTML = html;
                                    return tmp.textContent || tmp.innerText || '';
                                };

                                const currentPlainText = stripHtml(currentEditorContent).trim();
                                const sentPlainText = stripHtml(textSentToAPIValue).trim();

                                // Only update if current content exactly matches what was sent (user hasn't added new text)
                                // This prevents overwriting user-added text like "bhasvin" that might not be in span tags
                                if (currentPlainText === sentPlainText) {
                                    // Set flag to prevent useEffect and onChange from triggering
                                    isUpdatingFromAPI.current = true;

                                    // Update the last API call value to the new reportText
                                    lastAPICallValue.current = reportText;

                                    // Update ReactQuill editor directly using 'api' source to prevent onChange
                                    if (narrativeQuillRef.current) {
                                        const quillInstance = narrativeQuillRef.current.getEditor();

                                        // Save current cursor position before updating (only if editor has focus)
                                        const selection = quillInstance.getSelection(true);
                                        const cursorIndex = selection && selection.index !== null ? selection.index : null;

                                        // Get the length of current content
                                        const length = quillInstance.getLength();

                                        // Delete all content first, then insert new content using 'api' source
                                        quillInstance.deleteText(0, length, 'api');
                                        quillInstance.clipboard.dangerouslyPasteHTML(0, reportText, 'api');

                                        // Restore cursor position after update (only if we had a valid cursor position)
                                        if (cursorIndex !== null) {
                                            // Use setTimeout to ensure the paste operation is complete before setting selection
                                            setTimeout(() => {
                                                const newLength = quillInstance.getLength();
                                                // Ensure cursor position doesn't exceed new content length
                                                const restoredIndex = Math.min(cursorIndex, Math.max(0, newLength - 1));
                                                quillInstance.setSelection(restoredIndex, 'api');
                                            }, 0);
                                        }
                                    }

                                    // Update state (this will update the value prop, but onChange will be skipped due to flag)
                                    setValue((prevValue) => ({
                                        ...prevValue,
                                        CommentsDoc: reportText,
                                        Comments: reportText,
                                    }));

                                    // Clear the flag after a short delay to allow React to process the update
                                    setTimeout(() => {
                                        isUpdatingFromAPI.current = false;
                                    }, 100);
                                }
                            }
                        })
                        .catch(err => {
                            setMissingField({});
                            // Reset lastAPICallValue on error so we can retry
                            lastAPICallValue.current = '';
                            textSentToAPI.current = '';
                        });
                } else {
                    setMissingField({});
                    lastAPICallValue.current = '';
                    textSentToAPI.current = '';
                }
            }, 1500); // 1 second debounce delay - waits for user to stop typing

            // Cleanup function to clear timeout on unmount or dependency change
            return () => {
                if (missingFieldDebounceRef.current) {
                    clearTimeout(missingFieldDebounceRef.current);
                }
            };
        }
    }, [value.CommentsDoc, incidentID, loginAgencyID]);
    const autoRedact = (quill, detectedWordsData) => {
        if (!quill || !Array.isArray(detectedWordsData) || detectedWordsData.length === 0) return;

        // --- local helpers ---
        const normalize = (s) =>
            ///s (s || "").toString().toLowerCase() // Convert to lowercase.replace(/-/g, "") // Remove hyphens.replace(/\s+/g, "") // Remove all whitespace characters.trim(); // Trim leading and trailing spaces
            (s || "").toString().toLowerCase().replace(/\s+/g, "").trim();

        const isBlack = (v) => {
            const n = normalize(v);
            return n === "#000" || n === "#000000" || n === "black";
        };

        const isGreen = (v) => {
            const n = normalize(v);
            return n === "#008000" || n === "green";
        };

        // NEW: treat #7FFFD4 / aquamarine as the suggestion text color
        const isAquamarine = (v) => {
            const n = normalize(v);
            return n === "#7fffd4" || n === "aquamarine";
        };

        const isWs = (ch) => /\s/.test(ch);

        // Find next match for `needleNoWs` ignoring whitespace in textLower
        const findNextMatchIgnoringSpaces = (textLower, needleNoWs, startAt) => {
            const nlen = needleNoWs.length;

            for (let i = startAt; i < textLower.length; i++) {
                let j = 0; // needle idx
                let k = i; // haystack idx
                let first = -1;
                let last = -1;

                while (k < textLower.length && j < nlen) {
                    const hk = textLower[k];

                    if (isWs(hk)) {
                        k++;
                        continue;
                    }
                    if (hk === needleNoWs[j]) {
                        if (first === -1) first = k;
                        last = k;
                        j++;
                        k++;
                        continue;
                    }
                    // mismatch
                    j = -1;
                    break;
                }

                if (j === nlen && first !== -1) {
                    return { start: first, endExclusive: last + 1 };
                }
            }
            return null;
        };

        // Return true if entire [index, index+length) is black-on-black
        const isRangeFullyBlackOnBlack = (quill, index, length) => {
            if (!quill || length <= 0) return false;

            const delta = quill.getContents(index, length);
            for (const op of (delta && delta.ops) || []) {
                const attr = op.attributes || {};
                if (!(isBlack(attr.color) && isBlack(attr.background))) return false;
            }
            return true;
        };

        // --- main logic ---
        const textLower = quill.getText().toLowerCase();


        const fullTextLength = quill.getLength();
        let currentIndex = 0;

        // Step 1: Clear all previous green background highlights across the entire Quill editor
        while (currentIndex < fullTextLength) {
            const fmt = quill.getFormat(currentIndex, 1);
            if (isGreen(fmt?.background)) {
                quill.formatText(currentIndex, 1, { background: false, color: false }, "user");
            }
            currentIndex++;
        }

        detectedWordsData
            .filter(Boolean)
            .map((w) => String(w).trim())
            .filter((w) => w.length > 0)
            .forEach((word) => {
                const needleNoWs = word.toLowerCase().replace(/\s+/g, "");
                if (!needleNoWs) return;

                let searchFrom = 0;
                while (true) {
                    const match = findNextMatchIgnoringSpaces(textLower, needleNoWs, searchFrom);
                    if (!match) break;

                    const { start, endExclusive } = match;
                    const len = Math.max(0, endExclusive - start);
                    if (len > 0) {
                        // skip if fully redacted already
                        if (!isRangeFullyBlackOnBlack(quill, start, len)) {
                            // skip if already suggestion styled
                            const fmt = quill.getFormat(start, len);
                            let alreadySuggestion = false;
                            if (Array.isArray(fmt) && fmt.length > 0) {
                                alreadySuggestion = fmt.every(
                                    (f) => isAquamarine(f?.color) && isGreen(f?.background)
                                );
                            } else {
                                alreadySuggestion = isAquamarine(fmt?.color) && isGreen(fmt?.background);
                            }

                            if (!alreadySuggestion) {
                                quill.formatText(start, len, { color: "#7FFFD4", background: "#008000" }, "user");
                            }
                        }
                    }

                    searchFrom = endExclusive;
                }
            });
    };

    useEffect(() => {
        if (isUpdated && redactedComment && !isNormalReport) {
            const detectedWordsData = matchIncidentWords({
                commentsDoc: redactedComment,
                vehicleData: VehicleData,
                categoryData: CategoryData,
                chargesData: ChargesData,
                locationData: locationData,
            })
            setDetectedWords(detectedWordsData);


        }
    }, [redactedComment, VehicleData, CategoryData, ChargesData, locationData, isUpdated, isNormalReport]);

    useMemo(() => {
        // auto redact
        const quill = document.querySelector(".ql-editor");
        if (quill) {
            const quillInstance = quill.closest(".ql-container").__quill;
            if (quillInstance) {
                autoRedact(quillInstance, detectedWords);
                setIsUpdated(false);
            }
        }
    }, [detectedWords])

    const toggleRedactManualFromTextEditor = (quill, detectedWordsArr) => {
        if (!quill) return;

        const sel = quill.getSelection(true);
        if (!sel || sel.length === 0) return;

        const { index, length } = sel;
        const fmt = quill.getFormat(index, length);

        const normalize = (s) =>
            (s || "").toString().toLowerCase().replace(/\s+/g, "").trim();

        const isBlack = (v) => {
            const n = normalize(v);
            return n === "#000" || n === "#000000" || n === "black";
        };

        const currentlyRedacted = isBlack(fmt?.color) && isBlack(fmt?.background);

        const selectedText = quill.getText(index, length);
        const selectedNorm = normalize(selectedText);

        const isDetected =
            Array.isArray(detectedWordsArr) &&
            detectedWordsArr.some((w) => normalize(w) === selectedNorm);

        if (currentlyRedacted) {
            // unredact
            if (isDetected) {
                // detected → suggestion style
                quill.formatText(index, length, { color: "#000000", background: "#008000" }, "user");
            } else {
                // not detected → clear formatting
                quill.formatText(index, length, { color: false, background: false }, "user");
            }
        } else {
            // redact
            quill.formatText(index, length, { color: "#000000", background: "#000000" }, "user");
        }
    };

    const toggleRedactFromHeaderButton = (quill, word) => {
        if (!quill || !word) return;
        // Normalize the clicked word (needle): case-insensitive, remove spaces
        const needle = String(word).toLowerCase().replace(/\s+/g, "").trim();
        if (!needle) return;

        const isBlack = (v) => {
            const n = (v || "").toString().trim().toLowerCase().replace(/\s+/g, "");
            return n === "#000" || n === "#000000" || n === "black";
        };

        const isWs = (ch) => /\s/.test(ch);

        // Find next match ignoring whitespace; return a TIGHT span:
        // [firstNonWs, lastNonWs + 1) — no leading/trailing whitespace included
        const findNextMatchIgnoringSpaces = (text, startAt) => {
            const lower = text.toLowerCase();
            const nlen = needle.length;

            for (let i = startAt; i < lower.length; i++) {
                let j = 0;                 // index in needle (no spaces)
                let k = i;                 // moving index in haystack
                let firstNonWsPos = -1;    // first non-whitespace matched index
                let lastNonWsPos = -1;     // last non-whitespace matched index

                while (k < lower.length && j < nlen) {
                    const hk = lower[k];

                    if (isWs(hk)) {          // skip whitespace but keep span open
                        k++;
                        continue;
                    }

                    if (hk === needle[j]) {
                        if (firstNonWsPos === -1) firstNonWsPos = k;
                        lastNonWsPos = k;
                        j++;
                        k++;
                        continue;
                    }

                    // mismatch for this i
                    j = -1;
                    break;
                }

                if (j === nlen && firstNonWsPos !== -1) {
                    return { start: firstNonWsPos, endExclusive: lastNonWsPos + 1 };
                }
            }
            return null;
        };

        // Loop through all matches; only format the tight token span.
        let searchFrom = 0;
        while (true) {
            const plain = quill.getText(); // refresh each loop
            const match = findNextMatchIgnoringSpaces(plain, searchFrom);
            if (!match) break;

            const { start, endExclusive } = match;
            const spanLen = Math.max(0, endExclusive - start);
            if (spanLen === 0) {
                searchFrom = endExclusive + 1;
                continue;
            }

            // Check current formatting on the token span
            const fmt = quill.getFormat(start, spanLen);
            const currentlyRedacted = isBlack(fmt?.color) && isBlack(fmt?.background);

            if (currentlyRedacted) {
                // Suggestion style: black text on green background
                quill.formatText(start, spanLen, { color: "#000000", background: "#008000" }, "user");
            } else {
                // Fully redacted: black text on black background
                quill.formatText(start, spanLen, { color: "#000000", background: "#000000" }, "user");
            }

            // Continue after this matched token
            searchFrom = endExclusive;
        }
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: ["small", "normal", "large", "huge"] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["bold", "italic", "underline"],
                    ["link", "image"],
                    [{ color: [] }, { background: [] }],
                    ["blockquote"],
                ],

            },
            clipboard: { matchVisual: false },
        }),
        [] // ok to keep empty; we read latest via ref
    );

    const redactModules = useMemo(
        () => ({
            toolbar: {
                container: value.Status === 'Approved'
                    ? [["redact"]] // Only redact button when status is Approved
                    : [
                        [{ header: "1" }, { header: "2" }, { font: [] }],
                        [{ size: ["small", "normal", "large", "huge"] }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ align: [] }],
                        ["bold", "italic", "underline"],
                        ["link", "image"],
                        [{ color: [] }, { background: [] }],
                        ["blockquote"],
                        ["redact"], // our button
                    ],
                handlers: {
                    redact: function () {
                        const quill = this.quill;
                        // always the latest value:
                        toggleRedactManualFromTextEditor(quill, detectedWordsRef.current);
                    },
                },
            },
            clipboard: { matchVisual: false },
        }),
        [value.Status] // Add value.Status as dependency
    );

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "size",
        "background",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "code-block",
        "color",
        "align",
        "link",
        "image",
    ];

    const narrativeQuillRef = useRef(null); // Reference for the main narrative Quill editor instance
    const redactQuillRef = useRef(null); // Reference for the redacted comment Quill editor instance


    // Function to insert suggestion into editor
    const insertSuggestion = useCallback((suggestion) => {
        if (!narrativeQuillRef.current) return;

        const quill = narrativeQuillRef.current.getEditor();
        const selection = quill.getSelection(true);
        if (!selection) return;

        // Get current word boundaries
        const text = quill.getText();
        let start = selection.index;
        let end = selection.index;

        // Find word start
        while (start > 0 && /\S/.test(text[start - 1])) {
            start--;
        }

        // Find word end
        while (end < text.length && /\S/.test(text[end])) {
            end++;
        }

        // Format the insertion based on keyword
        let textToInsert = '';
        if (currentKeyword) {
            // Format as "Keyword Suggestion" (e.g., "Gender Male")
            textToInsert = `${currentKeyword} ${suggestion}`;
        } else {
            textToInsert = suggestion;
        }

        // Replace the word with formatted suggestion
        quill.deleteText(start, end - start, 'user');
        quill.insertText(start, textToInsert, 'user');
        quill.setSelection(start + textToInsert.length, 'user');

        // Hide autocomplete and reset
        setAutocompletePosition(prev => ({ ...prev, show: false }));
        setAutocompleteSuggestions([]);
        setSelectedSuggestionIndex(-1);
        setCurrentKeyword('');
    }, [currentKeyword]);

    // Handle keyboard navigation for autocomplete
    const handleAutocompleteKeyDown = useCallback((e) => {
        if (!autocompletePosition.show || autocompleteSuggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev =>
                prev < autocompleteSuggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
        } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
            e.preventDefault();
            insertSuggestion(autocompleteSuggestions[selectedSuggestionIndex]);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setAutocompletePosition(prev => ({ ...prev, show: false }));
            setSelectedSuggestionIndex(-1);
        }
    }, [autocompletePosition.show, autocompleteSuggestions, selectedSuggestionIndex, insertSuggestion]);

    // Disable keyboard typing if status is "Approved"
    const handleKeyDown = (e) => {
        if (value?.Status === "Approved") {
            e.preventDefault(); // Prevent keyboard input when status is approved
            return;
        }

        // Handle autocomplete navigation
        handleAutocompleteKeyDown(e);
    };

    const evaluateFieldTrigger = useCallback((quillInstance) => {
        if (!quillInstance || value?.Status === 'Approved') {
            setFieldDropdown(prev => prev.show ? { ...prev, show: false } : prev);
            return false;
        }

        const selection = quillInstance.getSelection(true);
        if (!selection) {
            setFieldDropdown(prev => prev.show ? { ...prev, show: false } : prev);
            return false;
        }

        const text = quillInstance.getText();
        const cursorIndex = selection.index;
        const textLower = text.toLowerCase();

        // Helper function to detect if "loss code:" or "category:" is in Property context
        const isPropertyContext = (textBeforePattern, patternIndex) => {
            const textBeforeLower = textBeforePattern.toLowerCase();

            // Check for Property context indicators
            // Look for patterns like "Property (property category", "Property (losscode", "Property (category"
            const propertyIndicators = [
                'property (property category',
                'property (losscode',
                'property (loss code',
                'property (category'
            ];

            // Check if any Property indicator exists before the current position
            for (const indicator of propertyIndicators) {
                const indicatorIndex = textBeforeLower.lastIndexOf(indicator);
                if (indicatorIndex !== -1 && indicatorIndex < patternIndex) {
                    // Check if "Vehicle" doesn't appear between the indicator and the pattern
                    const textBetween = textBeforeLower.substring(indicatorIndex, patternIndex);
                    if (!textBetween.includes('vehicle')) {
                        return true;
                    }
                }
            }

            // Also check if "Property" appears before "loss code:" and "Vehicle" doesn't appear between them
            const propertyIndex = textBeforeLower.lastIndexOf('property');
            const vehicleIndex = textBeforeLower.lastIndexOf('vehicle');

            if (propertyIndex !== -1 && propertyIndex < patternIndex) {
                // If Vehicle appears after Property but before loss code, it's Vehicle context
                if (vehicleIndex !== -1 && vehicleIndex > propertyIndex && vehicleIndex < patternIndex) {
                    return false;
                }
                // If Property appears and Vehicle doesn't appear between them, it's Property context
                return true;
            }

            return false;
        };

        // Field names to check (case insensitive)
        const fieldNames = [
            { name: 'gender', field: 'Gender' },
            { name: 'race', field: 'Race' },
            { name: 'ethnicity', field: 'Ethnicity' },
            { name: 'resident', field: 'Resident' },
            { name: 'victim', field: 'Victim' },
            { name: 'offender', field: 'Offender' },
            { name: 'other', field: 'Other' },
            { name: 'category', field: 'Vehicle Category' },
            { name: 'loss code', field: 'Vehicle Loss Code' },
            { name: 'plate type', field: 'Plate Type' },
            { name: 'plate state', field: 'Plate State' },
            // Removed propertylosscode and propertycategory - now handled dynamically via 'loss code' and 'category' with context detection
        ];

        for (const { name, field: fieldName } of fieldNames) {
            // Look for "fieldname:" pattern (case insensitive), optionally preceded by "("
            // We'll search backwards from cursor to find the pattern
            const searchText = textLower.substring(0, cursorIndex);

            // Try to find the field name followed by colon
            const fieldPattern = name + ':';
            let patternIndex = searchText.lastIndexOf(fieldPattern);

            if (patternIndex === -1) continue;

            const colonIndex = patternIndex + fieldPattern.length;

            // Cursor must be at or after the colon
            if (cursorIndex < colonIndex) continue;

            // Only show dropdown when cursor is immediately after colon (or with whitespace only)
            // This ensures dropdown only appears right after typing the colon, not later
            const between = text.substring(colonIndex, cursorIndex);

            // Allow only whitespace between colon and cursor (max 1 space for better UX)
            if (!/^\s{0,1}$/.test(between)) continue;

            // Find the end of any existing text after colon (for deletion purposes)
            let endIndex = cursorIndex;
            while (endIndex < text.length && text[endIndex] && text[endIndex] !== ' ' && text[endIndex] !== ')' && text[endIndex] !== '\n') {
                endIndex++;
            }

            // Special handling for "loss code:" and "category:" - determine if it's Property or Vehicle context
            let actualFieldName = fieldName;
            if (name === 'loss code') {
                const textBeforePattern = text.substring(0, patternIndex);
                if (isPropertyContext(textBeforePattern, patternIndex)) {
                    actualFieldName = 'Property Loss Code';
                } else {
                    actualFieldName = 'Vehicle Loss Code';
                }
            } else if (name === 'category') {
                const textBeforePattern = text.substring(0, patternIndex);
                if (isPropertyContext(textBeforePattern, patternIndex)) {
                    actualFieldName = 'Property Category';
                } else {
                    actualFieldName = 'Vehicle Category';
                }
            }

            // Special handling for Property Loss Code and Property Category - bidirectional filtering
            let filteredOptions = fieldOptions[actualFieldName];
            if (actualFieldName === 'Property Loss Code' || actualFieldName === 'Property Category') {
                const textBeforeCurrentField = text.substring(0, patternIndex);

                // Helper function to extract field value (case-insensitive)
                const extractFieldValue = (pattern, textBefore) => {
                    const textLower = textBefore.toLowerCase();
                    const patternLower = pattern.toLowerCase();
                    const patternIndex = textLower.lastIndexOf(patternLower);
                    if (patternIndex === -1) return null;

                    const colonIndex = patternIndex + pattern.length;
                    let endIndex = colonIndex;

                    // Skip whitespace after colon
                    while (endIndex < textBefore.length &&
                        textBefore[endIndex] &&
                        (textBefore[endIndex] === ' ' || textBefore[endIndex] === '\t')) {
                        endIndex++;
                    }

                    // Extract value until closing paren, next field pattern, or newline
                    const startValueIndex = endIndex;
                    while (endIndex < textBefore.length &&
                        textBefore[endIndex] &&
                        textBefore[endIndex] !== '\n') {
                        // Check if we've hit a closing paren
                        if (textBefore[endIndex] === ')') {
                            // Check what comes after the closing paren
                            const afterParen = textBefore.substring(endIndex + 1).trim();
                            const afterParenLower = afterParen.toLowerCase();

                            // If there's whitespace and then another field pattern, stop here
                            // This handles cases like: "Category: Money) Loss Code:" or "Category: Money) (Loss Code:"
                            if (afterParenLower.startsWith('loss code:') ||
                                afterParenLower.startsWith('category:') ||
                                afterParenLower.startsWith('(loss code:') ||
                                afterParenLower.startsWith('(category:') ||
                                afterParenLower.startsWith('property')) {
                                break;
                            }
                            // If closing paren is followed by space and then another opening paren with field, stop
                            if (afterParen.startsWith('(')) {
                                const afterOpenParen = afterParen.substring(1).trim().toLowerCase();
                                if (afterOpenParen.startsWith('loss code:') ||
                                    afterOpenParen.startsWith('category:')) {
                                    break;
                                }
                            }
                        }

                        const remainingText = textBefore.substring(endIndex).toLowerCase();
                        // Check if we've hit the start of another field pattern (case-insensitive)
                        // But only if it's not part of the current value
                        if (remainingText.startsWith('loss code:') ||
                            remainingText.startsWith('category:') ||
                            remainingText.startsWith('property category:') ||
                            remainingText.startsWith('property loss code:') ||
                            remainingText.startsWith('property (loss code:') ||
                            remainingText.startsWith('property (category:') ||
                            remainingText.startsWith('(loss code:') ||
                            remainingText.startsWith('(category:')) {
                            // Make sure this is actually a new field, not part of the value
                            // Check if there's a space or opening paren before it
                            if (endIndex > 0) {
                                const charBefore = textBefore[endIndex - 1];
                                if (charBefore === ' ' || charBefore === '(' || charBefore === ')') {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                        endIndex++;
                    }

                    const extractedValue = textBefore.substring(startValueIndex, endIndex).trim();
                    // Remove any trailing characters that might be part of the next field
                    // Remove closing paren if it's at the end
                    return extractedValue.replace(/\)\s*$/, '').trim();
                };

                if (actualFieldName === 'Property Loss Code') {
                    // Filter Loss Codes based on selected Category
                    // Since format is fixed as (Loss Code:) (Category:), Category comes AFTER Loss Code
                    // We need to check the full text to find Category value that comes after Loss Code
                    let categoryValue = null;

                    // First, try to find Category before current position (in case user is editing)
                    categoryValue = extractFieldValue('category:', textBeforeCurrentField);

                    // If not found before, check the full text after current field position
                    // This handles the case where Category is entered after Loss Code in the fixed format
                    if (!categoryValue) {
                        const fullText = text;
                        // Look for Category pattern after the current Loss Code field
                        // Pattern: (Category: value) or Category: value
                        const categoryPattern = /(?:\(|\s)category:\s*([^()\n]+?)(?:\s*\)|(?=\s*(?:\(|loss code:|category:|\n|$)))/i;
                        const textAfterPattern = fullText.substring(patternIndex);
                        const categoryMatch = textAfterPattern.match(categoryPattern);
                        if (categoryMatch && categoryMatch[1]) {
                            categoryValue = categoryMatch[1].trim().replace(/\)\s*$/, '');
                        }
                    }

                    if (categoryValue) {
                        // Find matching category (case-insensitive, trim whitespace)
                        const searchValue = categoryValue.toLowerCase().trim();
                        let matchedCategory = propertyCategoryData?.find(item => {
                            const itemDesc = item.Description?.toLowerCase().trim();
                            return itemDesc === searchValue;
                        });

                        // If exact match not found, try partial match
                        if (!matchedCategory) {
                            matchedCategory = propertyCategoryData?.find(item => {
                                const itemDesc = item.Description?.toLowerCase().trim();
                                return itemDesc.includes(searchValue) || searchValue.includes(itemDesc);
                            });
                        }

                        if (matchedCategory?.LossCodeID && Array.isArray(matchedCategory.LossCodeID) && matchedCategory.LossCodeID.length > 0) {
                            // Filter loss codes that have IDs in the category's LossCodeID array
                            const allowedLossCodeIDs = matchedCategory.LossCodeID
                                .map(id => String(id).trim())
                                .filter(id => id !== '' && id !== 'null' && id !== 'undefined');

                            const filteredLossCodes = propertyLossCodeData?.filter(item => {
                                const lossCodeID = String(item.PropertyReasonCodeID).trim();
                                return allowedLossCodeIDs.includes(lossCodeID);
                            });

                            filteredOptions = filteredLossCodes?.length > 0
                                ? filteredLossCodes.map(item => item.Description)
                                : fieldOptions[actualFieldName];
                        } else {
                            // Category found but no LossCodeID or empty array - show all
                            filteredOptions = fieldOptions[actualFieldName];
                        }
                    } else {
                        // No category selected, show all loss codes
                        filteredOptions = fieldOptions[actualFieldName];
                    }
                } else if (actualFieldName === 'Property Category') {
                    // Filter Categories based on selected Loss Code
                    const lossCodeValue = extractFieldValue('loss code:', textBeforeCurrentField);

                    if (lossCodeValue) {
                        // Find matching loss code
                        const searchValue = lossCodeValue.toLowerCase().trim();
                        let matchedLossCode = propertyLossCodeData?.find(item => {
                            const itemDesc = item.Description?.toLowerCase().trim();
                            return itemDesc === searchValue;
                        });

                        // If exact match not found, try partial match
                        if (!matchedLossCode) {
                            matchedLossCode = propertyLossCodeData?.find(item => {
                                const itemDesc = item.Description?.toLowerCase().trim();
                                return itemDesc.includes(searchValue) || searchValue.includes(itemDesc);
                            });
                        }

                        if (matchedLossCode?.CategoryID) {
                            // Parse CategoryID (can be string or array)
                            let categoryIDs = [];
                            if (typeof matchedLossCode.CategoryID === 'string') {
                                try {
                                    // Clean up the string - remove extra spaces and trailing commas
                                    const cleanedString = matchedLossCode.CategoryID
                                        .replace(/,\s*]/g, ']')  // Remove trailing commas before ]
                                        .replace(/\[\s+/g, '[')  // Remove spaces after [
                                        .replace(/\s+\]/g, ']')  // Remove spaces before ]
                                        .trim();
                                    categoryIDs = JSON.parse(cleanedString);
                                } catch (e) {
                                    // If parsing fails, try to extract numbers manually
                                    const numbers = matchedLossCode.CategoryID.match(/\d+/g);
                                    categoryIDs = numbers ? numbers.map(n => parseInt(n, 10)) : [];
                                }
                            } else if (Array.isArray(matchedLossCode.CategoryID)) {
                                categoryIDs = matchedLossCode.CategoryID;
                            }

                            // Normalize categoryIDs to numbers for comparison
                            const normalizedCategoryIDs = categoryIDs.map(id => {
                                const num = typeof id === 'string' ? parseInt(id, 10) : id;
                                return isNaN(num) ? null : num;
                            }).filter(id => id !== null);

                            // Filter categories that have PropertyDescID in the loss code's CategoryID array
                            const filteredCategories = propertyCategoryData?.filter(item => {
                                const propertyDescID = typeof item.PropertyDescID === 'string'
                                    ? parseInt(item.PropertyDescID, 10)
                                    : item.PropertyDescID;
                                return normalizedCategoryIDs.includes(propertyDescID);
                            });

                            filteredOptions = filteredCategories?.length > 0
                                ? filteredCategories.map(item => item.Description)
                                : fieldOptions[actualFieldName];
                        } else {
                            // Loss code found but no CategoryID - show all
                            filteredOptions = fieldOptions[actualFieldName];
                        }
                    } else {
                        // No loss code selected, show all categories
                        filteredOptions = fieldOptions[actualFieldName];
                    }
                }
            }

            if (!filteredOptions || filteredOptions.length === 0) {
                continue;
            }

            const bounds = quillInstance.getBounds(cursorIndex);
            const editorContainer = narrativeQuillRef.current?.editor?.container;
            const containerRect = editorContainer?.getBoundingClientRect();

            setFieldDropdown({
                show: true,
                field: actualFieldName,
                position: {
                    top: bounds.top + bounds.height + 5 + (containerRect?.top || 0) + window.scrollY,
                    left: bounds.left + (containerRect?.left || 0) + window.scrollX,
                },
                startIndex: colonIndex,
                endIndex,
                requiresParen: false, // Not used anymore but keeping for compatibility
                hasClosingParen: false, // Not used anymore but keeping for compatibility
                filteredOptions: (actualFieldName === 'Property Loss Code' || actualFieldName === 'Property Category') ? filteredOptions : null, // Store filtered options for Property Loss Code and Property Category
            });
            return true;
        }

        setFieldDropdown(prev => prev.show ? { ...prev, show: false } : prev);
        return false;
    }, [fieldOptions, value?.Status, propertyLossCodeData, propertyCategoryData]);

    // Function to insert field value
    const insertFieldValue = useCallback((fieldValue) => {
        if (!narrativeQuillRef.current || !fieldDropdown.show) return;

        const quill = narrativeQuillRef.current.getEditor();
        const { startIndex, endIndex } = fieldDropdown;

        // Delete existing text after colon (if any)
        const textToDelete = endIndex - startIndex;
        if (textToDelete > 0) {
            quill.deleteText(startIndex, textToDelete, 'user');
        }

        // Insert the selected value
        quill.insertText(startIndex, fieldValue, 'user');

        // Set cursor position after the inserted value (don't auto-add closing parenthesis)
        let cursorPos = startIndex + fieldValue.length;
        quill.setSelection(cursorPos, 'user');

        // Hide dropdown
        setFieldDropdown(prev => ({ ...prev, show: false }));
    }, [fieldDropdown]);

    // Effect to initialize the Quill instance when the component mounts and handle field triggers
    useEffect(() => {
        if (narrativeQuillRef.current) {
            const quillInstance = narrativeQuillRef.current.getEditor();
            quillEditorRef.current = quillInstance;

            // Enable mouse interactions
            if (value?.Status === "Approved") {
                quillInstance.disable(); // Disable typing
            } else {
                quillInstance.enable(); // Allow typing
            }

            const triggerFieldDropdown = () => {
                if (quillInstance.hasFocus()) {
                    evaluateFieldTrigger(quillInstance);
                }
            };

            const handleSelectionChange = (range, oldRange, source) => {
                if (source === 'user') {
                    triggerFieldDropdown();
                }
            };

            const handleTextChange = (delta, oldDelta, source) => {
                if (source === 'user') {
                    triggerFieldDropdown();
                }
            };


            quillInstance.on('selection-change', handleSelectionChange);
            quillInstance.on('text-change', handleTextChange);

            triggerFieldDropdown();

            return () => {
                quillInstance.off('selection-change', handleSelectionChange);
                quillInstance.off('text-change', handleTextChange);
            };
        }
    }, [evaluateFieldTrigger, value?.Status]);

    // Close autocomplete when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (autocompletePosition.show) {
                const quillContainer = narrativeQuillRef.current?.editor?.container;
                const autocompleteElement = document.querySelector('[data-autocomplete-dropdown]');

                if (quillContainer && !quillContainer.contains(event.target) &&
                    autocompleteElement && !autocompleteElement.contains(event.target)) {
                    setAutocompletePosition(prev => ({ ...prev, show: false }));
                    setSelectedSuggestionIndex(-1);
                }
            }

            // Close field dropdown when clicking outside
            if (fieldDropdown.show) {
                const quillContainer = narrativeQuillRef.current?.editor?.container;
                const fieldDropdownElement = document.querySelector('[data-field-dropdown]');

                if (quillContainer && !quillContainer.contains(event.target) &&
                    fieldDropdownElement && !fieldDropdownElement.contains(event.target)) {
                    setFieldDropdown(prev => ({ ...prev, show: false }));
                }
            }
        };

        if (autocompletePosition.show || fieldDropdown.show) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [autocompletePosition.show, fieldDropdown.show]);


    const Add_Type_Comments = () => {
        const { IsApprove, IsReject, Comments, CommentsDoc, ApprovalComments, ApprovingSupervisorID, IsApprovedForward } = value
        const type = selectedOption === "Individual" ? 'Individual' : 'Group';

        const val = {
            'AgencyID': loginAgencyID,
            'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': type, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': true, 'CreatedByUserFK': loginPinID,
            // 'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': type, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': IsApprovedForward ? 'true' : IsApprove, 'CreatedByUserFK': loginPinID, 'IsApprovedForward': IsApprovedForward, 'IsReject': IsReject, 'Comments': ApprovalComments,

        };
        AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val).then((res) => {
            // get_Data_Que_Report(loginPinID, loginAgencyID);
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message);
            get_NarrativesData(incidentID, loginPinID);
            setIsSelfApproved(false);
            // setStatesChangeStatus(false);
            // setIsSaved(true);
            // setModelStatus(true);
            // resets();
        })
    }
    console.log("checkWebWorkFlowStatus", checkWebWorkFlowStatus)
    // editor end
    return (
        <>
            <div className={`${!isCaseManagement ? 'container-fluid section-body pt-1 p-1 bt' : ''}`} >
                <div>
                    {!isCaseManagement && <div className="col-12  inc__tabs">
                        <Tab />
                    </div>}
                    <div className={`${!isCaseManagement ? 'dark-row' : ''}`} >
                        <div className="col-12 col-sm-12">
                            <div className={`${!isCaseManagement ? 'card Agency incident-card' : ''}`} >
                                <div className="card-body">

                                    <div className={`${!isCaseManagement ? 'row mt-1 child' : ''}`} >
                                        <div className="col-12 col-md-12 col-lg-12 px-0 pl-0">
                                            {/* <div>
            {renderNarrativeData()}
          </div> */}
                                            <div className="row mb-3">
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Report Type  {errors.NarrativeIDError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeIDError}</p>
                                                    ) : null}</label>

                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                                                    <Select
                                                        name='NarrativeTypeID'
                                                        isClearable
                                                        styles={value.Status === 'Pending Review' || value.Status === 'Approved' || (NarrativeAssignId && tabParam && assigned) || status || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                                                            !IsSuperadmin &&
                                                            !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? colourStylesUsers : Requiredcolour}
                                                        value={narrativeTypeDrpData?.filter((obj) => obj.value === value?.NarrativeTypeID)}
                                                        options={narrativeTypeDrpData?.filter((obj) => obj.value !== 6)}
                                                        onChange={(e) => {
                                                            ChangeDropDownReportType(e, 'NarrativeTypeID', 'NarrativeTypeCode');
                                                        }}
                                                        placeholder="Select.."
                                                        menuPlacement="bottom"
                                                        isDisabled={value.Status === 'Pending Review' || value.Status === 'Approved' || (NarrativeAssignId && tabParam && assigned) || status || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                                                            !IsSuperadmin &&
                                                            !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Date/Time {errors.AsOfDateError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AsOfDateError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                                                    <DatePicker
                                                        ref={startRef}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e.preventDefault();
                                                            } else {
                                                                onKeyDown(e);
                                                            }
                                                        }
                                                        }
                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                        timeFormat="HH:mm "
                                                        is24Hour
                                                        timeInputLabel
                                                        isClearable={value?.AsOfDate ? true : false}
                                                        name='AsOfDate'
                                                        onChange={(date) => {
                                                            if (date) {
                                                                let currDate = new Date(date);
                                                                let prevDate = new Date(value?.AsOfDate);
                                                                let maxDate = new Date(datezone);
                                                                !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                                                if ((currDate.getDate() === maxDate.getDate() && currDate.getMonth() === maxDate.getMonth() && currDate.getFullYear() === maxDate.getFullYear()) && !(currDate.getDate() === prevDate.getDate() && currDate.getMonth() === prevDate.getMonth() && currDate.getFullYear() === prevDate.getFullYear())) {

                                                                    setValue({ ...value, ['AsOfDate']: maxDate ? getShowingMonthDateYear(maxDate) : null })
                                                                }
                                                                else if (date >= new Date()) {

                                                                    setValue({ ...value, ['AsOfDate']: new Date() ? getShowingMonthDateYear(new Date()) : null })
                                                                } else if (date <= new Date(incidentReportedDate)) {

                                                                    setValue({ ...value, ['AsOfDate']: incidentReportedDate ? getShowingMonthDateYear(incidentReportedDate) : null })
                                                                } else {

                                                                    setValue({ ...value, ['AsOfDate']: date ? getShowingMonthDateYear(date) : null })
                                                                }
                                                            } else {
                                                                setValue({ ...value, ['AsOfDate']: null })

                                                            }
                                                        }}
                                                        selected={value?.AsOfDate && new Date(value?.AsOfDate)}
                                                        placeholderText={'Select...'}
                                                        showTimeSelect
                                                        timeIntervals={1}
                                                        timeCaption="Time"
                                                        popperPlacement="bottom"
                                                        maxDate={new Date(datezone)}
                                                        minDate={new Date(incidentReportedDate)}
                                                        autoComplete="Off"
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        filterTime={(time) => filterPassedDateTimeZone(time, value?.AsOfDate, incidentReportedDate, datezone)}
                                                        disabled={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                                                            !IsSuperadmin &&
                                                            !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? true : false}
                                                        className={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                                                            !IsSuperadmin &&
                                                            !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? 'readonlyColor' : 'requiredColor'}
                                                    />

                                                </div>

                                                <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                                                    <label htmlFor="" className='new-label text-nowrap'>Prepared By  {errors.ReportedByPinError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedByPinError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                                                    <Select
                                                        name='ReportedByPINActivityID'
                                                        isClearable
                                                        value={agencyOfficerFullNameDrpData?.filter((obj) => obj.value === value?.ReportedByPINActivityID)}
                                                        options={agencyOfficerFullNameDrpData}
                                                        // value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReportedByPINActivityID)}
                                                        // options={agencyOfficerDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'ReportedByPINActivityID')}
                                                        placeholder="Select.."
                                                        menuPlacement="bottom"
                                                        isDisabled
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                                                    <label htmlFor="" className='new-label text-nowrap'>Written For {errors.WrittenForIDError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WrittenForIDError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                                                    <Select
                                                        name="WrittenForID"
                                                        isClearable

                                                        styles={
                                                            value.Status === 'Pending Review' || value.Status === 'Approved' || narrativeTypeCode.toLowerCase() === 'ni' || value.Status === 'Draft' || value.Status === 'Rejected'
                                                                ? colourStylesUsers
                                                                :
                                                                customStyles
                                                        }
                                                        value={WrittenForDataDrp?.filter((obj) => obj.value === value?.WrittenForID)}
                                                        options={WrittenForDataDrp}
                                                        onChange={(e) => ChangeDropDown(e, 'WrittenForID')}
                                                        placeholder="Select.."
                                                        menuPlacement="bottom"
                                                        isDisabled={value.Status === 'Pending Review' || value.Status === 'Approved' || value.Status === 'Draft' || narrativeTypeCode.toLowerCase() === 'ni' || value.Status === 'Rejected'}
                                                    />


                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Report Template</label>

                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-2 ">
                                                    <Select
                                                        name='reportTemplateTypeId'
                                                        isClearable
                                                        styles={value.Status === 'Pending Review' || value.Status === 'Approved' || (NarrativeAssignId && tabParam && assigned) || status || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                                                            !IsSuperadmin &&
                                                            !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? colourStylesUsers : ""}

                                                        onChange={(e) => ChangeDropDownReportTemplateType(e, 'reportTemplateTypeId')}
                                                        value={value?.reportTemplateTypeId ? reportTemplateDropdownData?.find((obj) => obj.templateID === value?.reportTemplateTypeId) : ""}
                                                        options={reportTemplateDropdownData}
                                                        getOptionLabel={(v) => v?.templateName}
                                                        getOptionValue={(v) => v?.templateID}
                                                        placeholder="Select.."
                                                        menuPlacement="bottom"
                                                        isDisabled={!value?.NarrativeTypeID || value.Status === 'Pending Review' || value.Status === 'Approved' || (NarrativeAssignId && tabParam && assigned) || status || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                                                            !IsSuperadmin &&
                                                            !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}
                                                    />
                                                </div>
                                                {value.Status === "Rejected" &&
                                                    <>

                                                        <>
                                                            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                                                                <label htmlFor="" className='new-label'>Comment</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 text-field">
                                                                <textarea type="text" className="form-control" name='Justification'
                                                                    id="Justification"
                                                                    value={LastComments}
                                                                    readOnly />
                                                            </div>
                                                        </>
                                                        <div className={'col-4 text-right ml-auto'}>
                                                            <div
                                                                id="NIBRSStatus"
                                                                className={
                                                                    value.Status === "Draft"
                                                                        ? "nibrs-draft-Nar"
                                                                        : value.Status === "Approved"
                                                                            ? "nibrs-submitted-Nar"
                                                                            : value.Status === "Rejected"
                                                                                ? "nibrs-rejected-Nar"
                                                                                : value.Status === "Pending Review"
                                                                                    ? "nibrs-reopened-Nar"
                                                                                    : ""
                                                                }
                                                                style={{
                                                                    color: "black",
                                                                    opacity: 1,
                                                                    height: "35px",
                                                                    fontSize: "14px",
                                                                    marginTop: "2px",
                                                                    boxShadow: "none",
                                                                    userSelect: "none",
                                                                    padding: "5px", // optional for spacing
                                                                }}
                                                            >
                                                                {value.Status}
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            </div>
                                            {(value.Status !== "Rejected" && value.Status) &&
                                                <div className="row mt-2 align-items-center">
                                                    {value.Status === 'Approved' &&
                                                        <>
                                                            <div className="col-2 col-md-2 col-lg-1">
                                                                <label className="new-label">Preview Report</label>
                                                            </div>

                                                            <div className="col-4 d-flex align-items-center">
                                                                {/* Normal Report */}
                                                                <label className="d-flex align-items-center me-4" style={{ gap: "6px" }}>
                                                                    <input
                                                                        type="radio"
                                                                        name="status"
                                                                        checked={isNormalReport}
                                                                        onChange={() => { setNormalReport(true) }}
                                                                    />
                                                                    <span>Normal Report</span>
                                                                </label>

                                                                {/* Redacted Report */}
                                                                <label className="d-flex align-items-center" style={{ marginLeft: "18px", gap: "6px" }}>
                                                                    <input
                                                                        type="radio"
                                                                        name="status"
                                                                        checked={!isNormalReport}
                                                                        onChange={() => { setNormalReport(false) }}
                                                                    />
                                                                    <span>Redacted Report</span>
                                                                </label>
                                                            </div>
                                                        </>
                                                    }
                                                    <div className={'col-4 text-right mb-2 ml-auto'}>
                                                        <div
                                                            id="NIBRSStatus"
                                                            className={
                                                                value.Status === "Draft"
                                                                    ? "nibrs-draft-Nar"
                                                                    : value.Status === "Approved"
                                                                        ? "nibrs-submitted-Nar"
                                                                        : value.Status === "Rejected"
                                                                            ? "nibrs-rejected-Nar"
                                                                            : value.Status === "Pending Review"
                                                                                ? "nibrs-reopened-Nar"
                                                                                : ""
                                                            }
                                                            style={{
                                                                color: "black",
                                                                opacity: 1,
                                                                height: "35px",
                                                                fontSize: "14px",
                                                                marginTop: "2px",
                                                                boxShadow: "none",
                                                                userSelect: "none",
                                                                padding: "5px", // optional for spacing
                                                            }}
                                                        >
                                                            {value.Status}
                                                        </div>
                                                    </div>
                                                </div>
                                            }

                                            {isNormalReport &&
                                                <span>
                                                    {value.Status !== 'Approved' && value.Status !== 'Pending Review' && (
                                                        missingField.KeyWordHitsSuggestions ||
                                                        missingField.PropertySuggestions ||
                                                        missingField.VehicleSuggestions ||
                                                        missingField?.MissingFields?.length > 0 ||
                                                        missingField.ReasonCodeSuggestions ||
                                                        missingField.ChargeCodeSuggestions
                                                    ) &&
                                                        <div className='mx-2'>
                                                            <label htmlFor="" className='new-summary' style={{ fontSize: "18px" }}>NIBRS Missing Information</label>
                                                            <div className="d-flex flex-row flex-wrap mt-1">
                                                                {/* For when no reson code  */}
                                                                {missingField.ReasonCodeSuggestions &&
                                                                    <div class="badge-bar px-2 py-2 mx-1 my-1">
                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                            <div class="d-flex align-items-center">
                                                                                <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                                                                                <span class="badge-title">{missingField.ReasonCodeSuggestions}</span>
                                                                            </div>
                                                                            {/* tooltip */}
                                                                            <OverlayTrigger
                                                                                placement="top"
                                                                                trigger={["hover", "focus"]}
                                                                                overlay={
                                                                                    <Tooltip id="fmt-tip" className="wide-tooltip">
                                                                                        <div className="fw-bold mb-2" style={{ color: "red" }}><b>VALID FORMAT</b></div>
                                                                                        <div className="mb-1">
                                                                                            <b>Please Enter Details In The Following Order:</b> Name, Reason Code, DOB, Age, Gender, Race, Ethnicity, Resident
                                                                                        </div>
                                                                                        <div style={{ wordBreak: "break-word" }}>
                                                                                            <b>Example:</b> Maria Castillo (Victim) (DOB: 09/15/1986) (Age: 45) (Gender: Female) (Race: Unknown) (Ethnicity: Hispanic Or Latino) (Resident: Non-Resident)
                                                                                        </div>
                                                                                    </Tooltip>
                                                                                }
                                                                            >
                                                                                <span className="badge-pill ml-3" style={{ cursor: "pointer" }}>
                                                                                    <i className="fa fa-exclamation" />
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                        <div className="d-flex align-items-center flex-wrap mt-0">
                                                                            <span>
                                                                                <span className="bullet"></span>
                                                                                <span className="meta">Reason Code</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {/* {missingField.ChargeCodeSuggestions &&
                                                                    <div class="badge-bar px-2 py-2 mx-1 my-1">
                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                            <div class="d-flex align-items-center">
                                                                                <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                                                                                <span class="badge-title">Charge Code</span>
                                                                            </div>

                                                                        </div>
                                                                        <div className="d-flex align-items-center flex-wrap mt-0">
                                                                            <span>
                                                                                <span className="bullet"></span>
                                                                                <span className="meta">Please Enter Charge Code</span>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                } */}

                                                                {/* For other missing field  */}
                                                                {missingField?.MissingFields?.length > 0 &&
                                                                    missingField.MissingFields.map((p, idx) => {
                                                                        if (!p?.REASON_CODE) return null;
                                                                        const role = (p?.REASON_CODE || "").trim().toLowerCase();
                                                                        const fields =
                                                                            role === "victim"
                                                                                ? ["AGE", "DOB", "RACE", "GENDER", "ETHNICITY", "RESIDENT"]
                                                                                : ["AGE", "DOB", "RACE", "GENDER"]


                                                                        // --- OR logic for AGE/DOB ---
                                                                        const isEmpty = (v) => isEmptyCheck(v);
                                                                        const hasAge = !isEmpty(p?.AGE);
                                                                        const hasDob = !isEmpty(p?.DOB);

                                                                        // start with naive missing
                                                                        let missing = fields.filter((f) => isEmpty(p?.[f]));

                                                                        // if either AGE or DOB exists, drop both from "missing"
                                                                        if (fields.includes("AGE") && fields.includes("DOB") && (hasAge || hasDob)) {
                                                                            missing = missing.filter((f) => f !== "AGE" && f !== "DOB");
                                                                        }

                                                                        if (missing.length === 0) return null; // nothing missing ⇒ skip

                                                                        const labels = {
                                                                            AGE: "Age",
                                                                            DOB: "DOB",
                                                                            RACE: "Race",
                                                                            GENDER: "Gender",
                                                                            ETHNICITY: "Ethnicity",
                                                                            RESIDENT: "Resident",
                                                                        };

                                                                        const toTitleCaseList = (s = "") =>
                                                                            s
                                                                                .split(",")
                                                                                .map(part =>
                                                                                    part
                                                                                        .trim()
                                                                                        .split(/\s+/)
                                                                                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                                                                                        .join(" ")
                                                                                )
                                                                                .filter(Boolean)
                                                                                .join(", ");

                                                                        const roleLabel = role ? toTitleCaseList(role) : "";

                                                                        return (
                                                                            <div class="badge-bar px-2 py-2 mx-1 my-1">
                                                                                <div class="d-flex align-items-center justify-content-between">
                                                                                    <div class="d-flex align-items-center">
                                                                                        <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                                                                                        <span class="badge-title">{roleLabel}: {p?.NAME}</span>
                                                                                    </div>
                                                                                    {/* tooltip */}
                                                                                    <OverlayTrigger
                                                                                        placement="top"
                                                                                        trigger={["hover", "focus"]}
                                                                                        overlay={
                                                                                            <Tooltip id="fmt-tip" className="wide-tooltip">
                                                                                                <div className="fw-bold mb-2" style={{ color: "red" }}><b>VALID FORMAT</b></div>
                                                                                                <div className="mb-1">
                                                                                                    <b>Please Enter Details In The Following Order:</b> Name, Reason Code, DOB, Age, Gender, Race, Ethnicity, Resident
                                                                                                </div>
                                                                                                <div style={{ wordBreak: "break-word" }}>
                                                                                                    <b>Example:</b> Maria Castillo (Victim) (DOB: 09/15/1986) (Age: 45) (Gender: Female) (Race: Unknown) (Ethnicity: Hispanic Or Latino) (Resident: Non-Resident)
                                                                                                </div>
                                                                                            </Tooltip>
                                                                                        }
                                                                                    >
                                                                                        <span className="badge-pill ml-3" style={{ cursor: "pointer" }}>
                                                                                            <i className="fa fa-exclamation" />
                                                                                        </span>
                                                                                    </OverlayTrigger>
                                                                                </div>
                                                                                <div className="d-flex align-items-center flex-wrap mt-0">
                                                                                    {missing.map((f) => (
                                                                                        <span key={f}>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="meta">{labels[f]}</span>
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}


                                                                {missingField?.VehicleSuggestions &&
                                                                    <div class="badge-bar px-2 py-2 mx-1 my-1">
                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                            <div class="d-flex align-items-center">
                                                                                <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                                                                                <span class="badge-title">Vehicle Missing Field</span>
                                                                            </div>
                                                                            {/* tooltip */}
                                                                            <OverlayTrigger
                                                                                placement="top"
                                                                                trigger={["hover", "focus"]}
                                                                                overlay={
                                                                                    <Tooltip id="fmt-tip" className="wide-tooltip">
                                                                                        <div className="fw-bold mb-2" style={{ color: "red" }}><b>VALID FORMAT</b></div>
                                                                                        <div className="mb-1">
                                                                                            <b>Please Enter Details In The Following Order:</b> Vehicle, Plate State & No, Loss Code, Category, Plate Type, VIN
                                                                                        </div>
                                                                                        <div style={{ wordBreak: "break-word" }}>
                                                                                            <b>Example:</b> Vehicle (TXLP#WHT7386) (Loss Code: Stolen) (Category: Automobile) (Plate Type: Ambulance) (VIN: 44HAHCFGHG2752755)
                                                                                        </div>
                                                                                    </Tooltip>
                                                                                }
                                                                            >
                                                                                <span className="badge-pill ml-3" style={{ cursor: "pointer" }}>
                                                                                    <i className="fa fa-exclamation" />
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                        <div className="d-flex align-items-center flex-wrap mt-0">
                                                                            {missingField.VehicleSuggestions.split(",").map((f) => (
                                                                                <span key={f}>
                                                                                    <span className="bullet"></span>
                                                                                    <span className="meta">{f}</span>
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {missingField?.PropertySuggestions &&
                                                                    <div class="badge-bar px-2 py-2 mx-1 my-1">
                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                            <div class="d-flex align-items-center">
                                                                                <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                                                                                <span class="badge-title">Property Missing Field</span>
                                                                            </div>
                                                                            {/* tooltip */}
                                                                            <OverlayTrigger
                                                                                placement="top"
                                                                                trigger={["hover", "focus"]}
                                                                                overlay={
                                                                                    <Tooltip id="fmt-tip" className="wide-tooltip">
                                                                                        <div className="fw-bold mb-2" style={{ color: "red" }}><b>VALID FORMAT</b></div>
                                                                                        <div className="mb-1">
                                                                                            <b>Please Enter Details In The Following Order:</b> Property, Loss Code, Category
                                                                                        </div>
                                                                                        <div style={{ wordBreak: "break-word" }}>
                                                                                            <b>Example:</b> Property (Loss Code: Stolen Property) (Category: Personal Paper)
                                                                                        </div>
                                                                                    </Tooltip>
                                                                                }
                                                                            >
                                                                                <span className="badge-pill ml-3" style={{ cursor: "pointer" }}>
                                                                                    <i className="fa fa-exclamation" />
                                                                                </span>
                                                                            </OverlayTrigger>
                                                                        </div>
                                                                        <div className="d-flex align-items-center flex-wrap mt-0">
                                                                            {missingField.PropertySuggestions.split(",").map((f) => (
                                                                                <span key={f}>
                                                                                    <span className="bullet"></span>
                                                                                    <span className="meta">{f}</span>
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                }

                                                                {missingField?.KeyWordHitsSuggestions &&
                                                                    <div class="badge-bar px-2 py-2 mx-1 my-1">
                                                                        <div class="d-flex align-items-center justify-content-between">
                                                                            <div class="d-flex align-items-center">
                                                                                <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                                                                                <span class="badge-title">Charge Code Modifier</span>
                                                                            </div>

                                                                        </div>
                                                                        <div className="d-flex align-items-center flex-wrap mt-0">
                                                                            {missingField.KeyWordHitsSuggestions.split(",").map((f) => {
                                                                                const formatted = f.trim().replace(/\b\w/g, (c) => c.toUpperCase());
                                                                                return (
                                                                                    <span key={f}>
                                                                                        <span className="bullet"></span>
                                                                                        <span
                                                                                            className="meta"
                                                                                        // style={{ color: 'white', cursor: 'pointer', textDecoration: 'underline' }}
                                                                                        // onClick={() => { navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64('')}`) }}
                                                                                        >
                                                                                            {formatted}
                                                                                        </span>
                                                                                    </span>
                                                                                );
                                                                            })}

                                                                        </div>
                                                                    </div>
                                                                }

                                                            </div>
                                                        </div>
                                                    }

                                                    <div style={{ position: 'relative' }}>
                                                        <ReactQuill
                                                            ref={narrativeQuillRef}
                                                            className={`editor-class ${value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') && !IsSuperadmin && !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? 'readonly' : ''}`}
                                                            disabled={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                                                                !IsSuperadmin &&
                                                                !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}

                                                            readOnly={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') && !IsSuperadmin && !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}
                                                            value={value.CommentsDoc}
                                                            onChange={(value, delta, source, editor) => {
                                                                // Skip if this update is from API response (to prevent infinite loop)
                                                                if (isUpdatingFromAPI.current || source === 'api' || source === 'silent') {
                                                                    return;
                                                                }

                                                                // Check and show autocomplete when user types
                                                                // if (source === 'user') {
                                                                //     checkAndShowAutocomplete();
                                                                // }

                                                                const text = editor?.getText();
                                                                // setChangesStatus(true); 
                                                                setStatesChangeStatus(true);

                                                                setValue((prevValue) => ({
                                                                    ...prevValue,
                                                                    Comments: text,
                                                                    CommentsDoc: value,
                                                                }));

                                                            }}
                                                            onKeyDown={handleKeyDown}
                                                            modules={modules}
                                                            formats={formats}
                                                            editorProps={{ spellCheck: true }}
                                                            theme="snow"
                                                            placeholder="Write something..."
                                                            style={{
                                                                minHeight: 'auto',
                                                                maxHeight: 'auto',
                                                                overflowY: 'auto',
                                                            }}
                                                        />

                                                        {/* Autocomplete Dropdown */}
                                                        {autocompletePosition.show && autocompleteSuggestions.length > 0 && (
                                                            <div
                                                                data-autocomplete-dropdown
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: `${autocompletePosition.top}px`,
                                                                    left: `${autocompletePosition.left}px`,
                                                                    zIndex: 9999,
                                                                    backgroundColor: 'white',
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: '4px',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                                    maxHeight: '200px',
                                                                    overflowY: 'auto',
                                                                    minWidth: '200px',
                                                                    maxWidth: '400px',
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {autocompleteSuggestions.map((suggestion, index) => (
                                                                    <div
                                                                        key={index}
                                                                        onClick={() => insertSuggestion(suggestion)}
                                                                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                                                        style={{
                                                                            padding: '8px 12px',
                                                                            cursor: 'pointer',
                                                                            backgroundColor: index === selectedSuggestionIndex ? '#007bff' : 'transparent',
                                                                            color: index === selectedSuggestionIndex ? 'white' : 'black',
                                                                            borderBottom: index < autocompleteSuggestions.length - 1 ? '1px solid #eee' : 'none',
                                                                        }}
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                    >
                                                                        <label>{suggestion}</label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Field Dropdown (Gender, Race, DOB) */}
                                                        {fieldDropdown.show && ((fieldDropdown.filteredOptions && fieldDropdown.filteredOptions.length > 0) || (fieldOptions[fieldDropdown.field] && fieldOptions[fieldDropdown.field].length > 0)) && (
                                                            <div
                                                                data-field-dropdown
                                                                style={{
                                                                    position: 'fixed',
                                                                    top: `${fieldDropdown.position.top}px`,
                                                                    left: `${fieldDropdown.position.left}px`,
                                                                    zIndex: 10000,
                                                                    backgroundColor: 'white',
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: '4px',
                                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                                    maxHeight: '200px',
                                                                    overflowY: 'auto',
                                                                    minWidth: '200px',
                                                                    maxWidth: '400px',
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {(fieldDropdown.filteredOptions || fieldOptions[fieldDropdown.field] || []).map((option, index, arr) => (
                                                                    <div
                                                                        key={index}
                                                                        onClick={() => insertFieldValue(option)}
                                                                        style={{
                                                                            padding: '8px 12px',
                                                                            cursor: 'pointer',
                                                                            backgroundColor: 'transparent',
                                                                            color: 'black',
                                                                            borderBottom: index < arr.length - 1 ? '1px solid #eee' : 'none',
                                                                        }}
                                                                        onMouseEnter={(e) => {
                                                                            e.target.style.backgroundColor = '#007bff';
                                                                            e.target.style.color = 'white';
                                                                        }}
                                                                        onMouseLeave={(e) => {
                                                                            e.target.style.backgroundColor = 'transparent';
                                                                            e.target.style.color = 'black';
                                                                        }}
                                                                        onMouseDown={(e) => e.preventDefault()}
                                                                    >
                                                                        <label style={{ cursor: 'pointer', margin: 0 }}>{option}</label>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {errors.CommentsError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
                                                    ) : null}
                                                </span>
                                            }

                                            {(value.Status === 'Approved' && !isNormalReport) &&
                                                <span>
                                                    {detectedWords.length > 0 &&
                                                        <div className='mx-2'>
                                                            <label htmlFor="" className='new-summary' style={{ fontSize: "18px" }}>Redact Data</label>
                                                            <div className="d-flex flex-row flex-wrap mt-1">

                                                                {detectedWords.map((word, index) => (
                                                                    <>
                                                                        <button
                                                                            key={index}
                                                                            type="button"
                                                                            className="btn btn-success mr-2 mb-0.5 py-1 px-1.5" // 'me-3' adds space to the right and 'mb-2' adds space below
                                                                            onClick={() => {
                                                                                const quill = document.querySelector(".ql-editor");
                                                                                if (quill) {
                                                                                    const quillInstance = quill.closest(".ql-container").__quill;
                                                                                    toggleRedactFromHeaderButton(quillInstance, word);
                                                                                }
                                                                            }}
                                                                        >
                                                                            {word}
                                                                        </button>
                                                                    </>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    }
                                                    <ReactQuill
                                                        ref={redactQuillRef}
                                                        className="editor-class"
                                                        value={redactedComment}
                                                        onChange={(value) => {
                                                            setChangesStatus(true);
                                                            setStatesChangeStatus(true);
                                                            setRedactedComment(value)
                                                        }}
                                                        modules={redactModules}
                                                        formats={formats}
                                                        editorProps={{ spellCheck: true }}
                                                        theme="snow"
                                                        placeholder="Write something..."
                                                        style={{
                                                            minHeight: 'auto',
                                                            maxHeight: 'auto',
                                                            overflowY: 'auto',
                                                        }}
                                                        onKeyDown={handleKeyDown}
                                                    />
                                                    <style jsx>
                                                        {`
                ::selection {
                   background: #000000 !important;  /* Red background for normal selection */
                    color: #000000 !important;  /* White text for normal selection */
                 }
                .ql-toolbar .ql-redact {
                    width: auto !important; /* Ensure it takes the width of the content */
                    min-width: 60px; /* Set a reasonable minimum width */
                    padding: 4px 10px; /* Add more padding if needed */
                    text-align: center; /* Center the text */
                    white-space: nowrap; /* Prevent text from wrapping */
                }
                  .ql-redact::before {
                    content: "REDACT";
                    font-size: 16px;
                    color:blue;
                    font-weight: normal;
                }
                .ql-editor .redacted::selection {
                    background: transparent !important; 
                    color: transparent !important;
                  }
              `}
                                                    </style>
                                                </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        {/* Approval  */}
                                        <div className="row ">
                                            {
                                                // narrativeID && value.Status !== null && !IsSelfApproved && !skipApproverAuthor ?
                                                ((narrativeID && value.Status !== null && !IsSelfApproved) || (narrativeID && value.Status !== null && !IsSelfApproved && skipApproverAuthor)) ?
                                                    <>
                                                        <div className="col-12 col-md-12 col-lg-12">
                                                            <div className="row ">
                                                                {(value.Status === 'Approved' && !isNormalReport) ?
                                                                    <></>
                                                                    :
                                                                    <>
                                                                        <div className="col-2 col-md-2 col-lg-1 mt-4 ">
                                                                            <div className="form-check ml-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    name="approverType"
                                                                                    value="Individual"
                                                                                    className="form-check-input"
                                                                                    checked={selectedOption === "Individual"}
                                                                                    onChange={handleRadioChange}
                                                                                    disabled={value.Status === 'Pending Review' || value.Status === 'Approved' ? true : false}
                                                                                />
                                                                                <label className="form-check-label" htmlFor="Individual">
                                                                                    Individual
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-2 col-md-2 col-lg-1 mt-4 ">
                                                                            <div className="form-check ml-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    name="approverType"
                                                                                    value="Group"
                                                                                    className="form-check-input"
                                                                                    checked={selectedOption === "Group"}
                                                                                    disabled={value.Status === 'Pending Review' || value.Status === 'Approved' ? true : false}
                                                                                    onChange={handleRadioChange}
                                                                                />
                                                                                <label className="form-check-label" htmlFor="Group">
                                                                                    Group
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        {selectedOption === "Individual" ? (
                                                                            <>
                                                                                <div className="col-10 col-lg-7 dropdown__box d-flex align-items-center ">
                                                                                    <span htmlFor="" className='label-name '
                                                                                        style={{ marginRight: '10px', flexGrow: 1, whiteSpace: 'nowrap', fontSize: '13px' }}
                                                                                    >
                                                                                        Report Approver{errors.ApprovingOfficerError !== 'true' ? (
                                                                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovingOfficerError}</p>
                                                                                        ) : null}
                                                                                    </span>
                                                                                    <SelectBox
                                                                                        className="custom-multiselect w-100"
                                                                                        classNamePrefix="custom"
                                                                                        options={reportApproveOfficer}
                                                                                        isMulti
                                                                                        styles={colourStylesUsers}
                                                                                        isDisabled={
                                                                                            value.Status?.trim() === 'Approved' || value.Status === 'Pending Review' ||
                                                                                            (!IsSuperadmin && value.ReportedByPINActivityID != loginPinID && value.Status === 'Draft')
                                                                                        }
                                                                                        closeMenuOnSelect={false}
                                                                                        hideSelectedOptions={true}
                                                                                        onChange={Agencychange}
                                                                                        allowSelectAll={reportApproveOfficer.length > 0 ? true : false}
                                                                                        value={multiSelected.optionSelected}
                                                                                    />

                                                                                </div>

                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className="col-10 col-lg-7 dropdown__box d-flex align-items-center ">
                                                                                    <span htmlFor="" className='label-name'
                                                                                        style={{ marginRight: '10px', flexGrow: 1, whiteSpace: 'nowrap', fontSize: '13px' }}>  Approval Group{errors.ApprovingOfficerError !== 'true' ? (
                                                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ApprovingOfficerError}
                                                                                            </p>
                                                                                        ) : null}</span>
                                                                                    <SelectBox
                                                                                        className="custom-multiselect w-100"
                                                                                        classNamePrefix="custom"
                                                                                        options={groupList}
                                                                                        isMulti
                                                                                        styles={colourStylesUsers}
                                                                                        isDisabled={
                                                                                            value.Status?.trim() === 'Approved' || value.Status === 'Pending Review' ||
                                                                                            (!IsSuperadmin && value.ReportedByPINActivityID != loginPinID && value.Status === 'Draft')
                                                                                        }
                                                                                        closeMenuOnSelect={false}
                                                                                        hideSelectedOptions={true}
                                                                                        onChange={Agencychange}
                                                                                        allowSelectAll={true}
                                                                                        value={multiSelected.optionSelected}
                                                                                    />
                                                                                </div>

                                                                            </>
                                                                        )}
                                                                    </>
                                                                }

                                                            </div>
                                                        </div>

                                                    </> :
                                                    <></>
                                            }

                                        </div>

                                        {/* Action Button */}
                                        <div className="col-12 col-md-12 col-lg-12 text-right mb-2 mt-2 ">
                                            <div className='row justify-content-end align-items-center'>

                                                <ul className='d-flex  align-items-center ' style={{ columnGap: "10px", listStyle: "none" }}>
                                                    <li>
                                                        {(isSupervisor || isSuperadmin) && !narrativeAssignId && !narrativeID && (
                                                            <div className=''>
                                                                <button
                                                                    type="button"
                                                                    data-toggle="modal"
                                                                    data-target="#QueueReportsModall"
                                                                    onClick={() => setshowModal(true)}
                                                                    style={{ backgroundColor: "#001f3f", color: "#fff" }}
                                                                    className="btn"
                                                                >
                                                                    Assign a New Report
                                                                </button>
                                                            </div>
                                                        )}



                                                        {/* {
                                            narrativeID && value.Status != "Pending Review" && value.Status != "Rejected" && value.Status != "Approved" || narrativeID && value.Status === "Rejected" && value.ReportedByPINActivityID === loginPinID  ? <>
                                                <div className=" ">
                                                  <button type="button" disabled={((value.ReportedByPINActivityID != loginPinID && value.Status === 'Draft') || value.Status === 'Approved') ? true : false} onClick={(e) => { check_Validation_ErrorApproval(); }} className="btn btn-sm btn-success"  >Send For Approval</button>
                                                </div>
                                              </> :
                                                <></>
                                            } */}
                                                        {
                                                            // (checkWebWorkFlowStatus && (skipApproverAuthor === false || skipApproverAuthor === null)) ? (
                                                            (checkWebWorkFlowStatus || (checkWebWorkFlowStatus && (skipApproverAuthor === true || skipApproverAuthor === null))) ? (
                                                                narrativeID && (
                                                                    (value.Status !== "Pending Review" &&
                                                                        value.Status !== "Rejected" &&
                                                                        value.Status !== "Approved") ||
                                                                    (value.Status === "Rejected" && value.ReportedByPINActivityID === loginPinID)
                                                                ) ? (
                                                                    <div className=" ">
                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                value.ReportedByPINActivityID !== loginPinID &&
                                                                                    value.Status === 'Draft' ||
                                                                                    value.Status === 'Approved'
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onClick={(e) => {
                                                                                check_Validation_ErrorApproval();
                                                                            }}
                                                                            className="btn btn-sm btn-success"
                                                                        >
                                                                            Send For Approval
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <></>
                                                                )
                                                            ) : null
                                                        }
                                                        {
                                                            narrativeID &&
                                                                (value.Status === "Pending Review") || (value.Status === "Approved") ?
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        data-toggle="modal"
                                                                        data-target="#QueueReportsModalRecall"
                                                                        disabled={
                                                                            value.ReportedByPINActivityID !== loginPinID &&
                                                                                value.Status === 'Draft'

                                                                                ? true
                                                                                : false
                                                                        }
                                                                        onClick={() => setshowModalRecall(true)}
                                                                        className="btn btn-sm btn-success"
                                                                    >
                                                                        Recall
                                                                    </button>
                                                                </> : <></>
                                                        }
                                                        {
                                                            (IsSelfApproved) ? (
                                                                narrativeID && (
                                                                    (value.Status !== "Pending Review" &&
                                                                        value.Status !== "Rejected" &&
                                                                        value.Status !== "Approved") ||
                                                                    (value.Status === "Rejected" && value.ReportedByPINActivityID === loginPinID)
                                                                ) ? (
                                                                    <div className=" ">
                                                                        <button
                                                                            type="button"
                                                                            disabled={
                                                                                value.ReportedByPINActivityID !== loginPinID &&
                                                                                    value.Status === 'Draft' ||
                                                                                    value.Status === 'Approved'
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            onClick={(e) => {
                                                                                Add_Type_Comments();
                                                                            }}
                                                                            className="btn btn-sm btn-success"
                                                                        >
                                                                            Approved
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <></>
                                                                )
                                                            ) : null
                                                        }
                                                        {/* {
                                  IsSelfApproved ?
                                    <>
                                      <div className=" ">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            Add_Type_Comments();
                                          }}
                                          className="btn btn-sm btn-success"
                                        >
                                          Approved
                                        </button>
                                      </div>
                                    </> : <></>
                
                
                                } */}

                                                    </li>
                                                    <li className=''>
                                                        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { reset(); }}>New</button>
                                                        {
                                                            narrativeID && !(NarrativeAssignId && tabParam && assigned) || narrativeID ?
                                                                effectiveScreenPermission ?
                                                                    effectiveScreenPermission[0]?.Changeok ?
                                                                        <>
                                                                            <button type="button" disabled={!statesChangeStatus || value.Status === 'Pending Review' || value.Status === 'Approve'} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 ">{value.Status === "Approved" ? "Save Redact" : "Update"}</button>
                                                                            {!isCaseManagement && <button
                                                                                type="button"
                                                                                onClick={() => navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=true&IsReport=true&narrativeId=${stringToBase64(narrativeID)}`)}
                                                                                className="btn btn-sm btn-success pl-2 ml-2"
                                                                                disabled={!narrativeID}
                                                                            >
                                                                                Next
                                                                            </button>}
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-success ml-2 "
                                                                                data-toggle="modal"
                                                                                data-target="#CurrentIncidentReport"
                                                                                onClick={() => {
                                                                                    setShowModal(true);
                                                                                    setIncMasterReport(true);
                                                                                    setIncReportCount(IncReportCount + 1);
                                                                                }}
                                                                            >
                                                                                Print <i className="fa fa-print"></i>
                                                                            </button>
                                                                        </>

                                                                        :
                                                                        <>
                                                                        </>
                                                                    :
                                                                    <>
                                                                        <button type="button" disabled={!statesChangeStatus || value.Status === 'Pending Review' || value.Status === 'Approve'} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 ">{value.Status === "Approved" ? "Save Redact" : "Update"}</button>
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-success ml-2 "
                                                                            data-toggle="modal"
                                                                            data-target="#CurrentIncidentReport"
                                                                            onClick={() => {
                                                                                setShowModal(true);
                                                                                setIncMasterReport(true);
                                                                                setIncReportCount(IncReportCount + 1);
                                                                            }}
                                                                        >
                                                                            Print <i className="fa fa-print"></i>
                                                                        </button>
                                                                    </>

                                                                :
                                                                effectiveScreenPermission ?
                                                                    effectiveScreenPermission[0]?.AddOK ?
                                                                        <>
                                                                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 ">Save</button>
                                                                            {!isCaseManagement && <button
                                                                                type="button"
                                                                                onClick={() => navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=true&IsReport=true&narrativeId=${stringToBase64(narrativeID)}`)}
                                                                                className="btn btn-sm btn-success pl-2 ml-2"
                                                                                disabled={!narrativeID}
                                                                            >
                                                                                Next
                                                                            </button>}
                                                                        </>
                                                                        :
                                                                        <>
                                                                        </>
                                                                    :
                                                                    <>
                                                                        <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 ">Save</button>
                                                                        {!isCaseManagement && <button
                                                                            type="button"
                                                                            onClick={() => navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=true&IsReport=true&narrativeId=${stringToBase64(narrativeID)}`)}
                                                                            className="btn btn-sm btn-success pl-2 ml-2"
                                                                            disabled={!narrativeID}
                                                                        >
                                                                            Next
                                                                        </button>}
                                                                    </>
                                                        }
                                                    </li>


                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid */}
                                    <div className="col-12 px-0 mt-1" >
                                        {
                                            loder ?
                                                <DataTable
                                                    showHeader={true}
                                                    persistTableHead={true}
                                                    dense
                                                    columns={columns}
                                                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? narrativeData : '' : narrativeData}
                                                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                    highlightOnHover
                                                    customStyles={tableCustomStyles}
                                                    conditionalRowStyles={conditionalRowStyles}
                                                    onRowClicked={(row) => {
                                                        if (row?.NarrativeDescription === "Use Of Force") {
                                                            row?.ArrestID ? (
                                                                navigate(`/Arrest-Home?IncId=${stringToBase64(row?.IncidentId)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}&isFromDashboard=true`)
                                                            ) : (
                                                                navigate(`/Inc-Home?IncId=${stringToBase64(row?.IncidentId)}&IncNo=${row?.IncidentNumber}&IncSta=true&isFromDashboard=true`)
                                                            )
                                                        }
                                                        else {
                                                            setIsUpdated(false); setNormalReport(true); editNarratives(row?.NarrativeID);
                                                        }
                                                    }}
                                                    pagination
                                                    paginationPerPage={'100'}
                                                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                    showPaginationBottom={100}
                                                    fixedHeaderScrollHeight='255px'
                                                    fixedHeader
                                                />
                                                :
                                                <Loader />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <IdentifyFieldColor /> */}
            <ChangesModal func={check_Validation_Error} />
            <DeletePopUpModal func={DeleteNarratives} />
            <CurrentIncMasterReport
                incNumber={IncNo}
                incidentID={IncID}
                isRedactedReport={!isPreviewNormalReport}
                {...{
                    printIncReport,
                    setIncMasterReport,
                    showModal,
                    setShowModal,
                    IncReportCount,
                    setIncReportCount,
                }}
            />
            <RecallNarrativeModal showModalRecall={showModalRecall} updateNarrative={updateNarrative} setshowModalRecall={setshowModalRecall} narrativeID={narrativeID} incidentID={incidentID} showModalAssign={showModalAssign} loginAgencyID={loginAgencyID} nibrsStatus={nibrsStatus} loginPinID={loginPinID} value={value} />
            <NarrativeModal incidentID={incidentID} showModalAssign={showModalAssign} loginAgencyID={loginAgencyID} primaryOfficer={primaryOfficer} narrativeTypeCode={narrativeTypeCode} nibrsStatus={nibrsStatus} setshowModal={setshowModal} loginPinID={loginPinID} value={value} show={showModal}
            />

        </>
    )
}
export default ReportModule;


const NarrativeModal = (props) => {

    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const agencyOfficerFullNameDrpData = useSelector((state) => state.DropDown.agencyOfficerFullNameDrpData);
    const localStoreData = useSelector((state) => state?.Agency?.localStoreData);
    const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);
    const [writtenForID, setWrittenForID] = useState([]);
    const [typeCode, settypeCode] = useState('');
    const { incidentID, nibrsStatus, loginPinID, setshowModal, showModalAssign, primaryOfficer, loginAgencyID, narrativeTypeCode } = props
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const rejectColumns = [
        { name: 'Rejected By', selector: row => row.ApprovingOfficer, sortable: true },
        { name: 'Reason For Rejection', selector: row => row.Comments, sortable: true },
        { name: 'Date Of Rejection', selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true },
    ];


    const [value, setValue] = useState({
        'CommentsDoc': '', 'IncidentId': '', 'NarrativeID': '', 'Comments': '', 'AssignComment': '', 'ReportType': '',
        'ReportedByPINActivityID': null, 'NarrativeTypeID': null, 'AsOfDate': null,
        'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'ApprovingSupervisorID': '', 'OfficerID': '',
        'IncidentID': ''
    })

    const [errors, setErrors] = useState({
        'OfficerError': '', 'NarrativeIDError': '', 'AssignCommentError': ''
    })


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (typeCode?.toLowerCase() === 'ni') {
            setValue({ ...value, 'OfficerID': primaryOfficer, });
        }
        else {
            setValue({ ...value, 'OfficerID': '', });
        }

    }, [writtenForID])



    const Get_WrittenForDataDrp = async (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        await fetchPostData('Narrative/GetData_WrittenForOfficer', val).then((data) => {
            if (data) {
                setWrittenForID(changeArrayFormat_Active_InActive(data, 'PINID', 'HeadOfAgency', 'IsActive'));

            } else {
                setWrittenForID([]);
            }
        })
    }

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID))
        }
    }, [localStoreData, IncID]);



    // const colourStyles = {
    //   control: (styles) => ({
    //     ...styles,
    //     backgroundColor: "#fce9bf",
    //     height: 20,
    //     minHeight: 35,
    //     fontSize: 14,
    //     margintop: 2,
    //     boxShadow: 0,
    //   }),
    // }

    const colourStylesUsers = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: isDisabled ? '#9d949436' : '#fce9bf',
            fontSize: 14,
            marginTop: 2,
            boxShadow: 'none',
            cursor: isDisabled ? 'not-allowed' : 'default',
        }),
    };



    const check_Validation_Error = () => {

        const OfficerErr = RequiredFieldIncident(value?.OfficerID);
        const NarrativeTypeIDErr = RequiredFieldIncident(value.NarrativeTypeID);
        const AssignCommentErr = 'true';

        setErrors((prevValues) => {
            return {
                ...prevValues,
                ["OfficerError"]: OfficerErr || prevValues["OfficerError"],
                ["NarrativeIDError"]: NarrativeTypeIDErr || prevValues["NarrativeIDError"],
                ["AssignCommentError"]: AssignCommentErr || prevValues["AssignCommentError"],
            };
        });

    }

    const { OfficerError, NarrativeIDError, AssignCommentError } = errors

    useEffect(() => {
        if (OfficerError === 'true' && NarrativeIDError === 'true' && AssignCommentError === 'true') {
            submit()
        }
    }, [OfficerError, NarrativeIDError, AssignCommentError])

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'NarrativeTypeID') {
                settypeCode(e.type)
                setValue({ ...value, [name]: e.value, 'ReportType': e.type });
                if (e.type.toLowerCase() === 'ni') {
                    Get_WrittenForDataDrp(loginAgencyID, IncID);
                }

            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === 'NarrativeTypeID') {
                setValue({ ...value, [name]: null, 'ReportType': '' });
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    }

    const submit = () => {
        const {
            NarrativeTypeID,
            OfficerID, AssignComment,
        } = value;
        const val = {
            OfficerID: OfficerID,
            NarrativeTypeID: NarrativeTypeID,
            IncidentID: incidentID,
            CreatedByUserFK: loginPinID,
            AssignComment: AssignComment,
        };
        AddDeleteUpadate('IncidentNarrativeAssigned/Insert_IncidentNarrativeAssigned', val)
            .then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                setshowModal(false);
                resetOfficers();
                setErrors({ ...errors, ['AssignCommentError']: '', });
            })
    }

    const resetOfficers = () => {
        setValue({
            ...value,
            'IncidentId': '', 'OfficerID': '', 'NarrativeTypeID': '', 'ReportType': '', 'AssignComment': '',
        });
        settypeCode('')

        setErrors({ ...errors, ['OfficerError']: '', ['NarrativeIDError']: '', ['AssignCommentError']: '' })

    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            resetOfficers();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);



    return (
        <>
            {showModalAssign && (
                <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="QueueReportsModall" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content p-2 px-4 approvedReportsModal" >
                            <div className='d-flex justify-content-between'>
                                <h5 className="fw-bold">Assign Report</h5>
                                <button className="btn-close b-none bg-transparent text-right" onClick={() => { resetOfficers(); setshowModal(false) }} data-dismiss="modal">X</button>
                            </div>
                            <div className="d-flex ">
                                <div className='col-lg-12'>
                                    <div className="row">
                                        <div className="col-4 col-md-4 col-lg-2 mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Assigned Officer {errors.OfficerError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerError}</p>
                                            ) : null} </label>
                                        </div>
                                        <div className="col-7 col-md-7 col-lg-6 mt-2 ">
                                            <Select
                                                name='OfficerID'
                                                isClearable
                                                // styles={colourStyles}
                                                value={agencyOfficerFullNameDrpData?.filter((obj) => obj.value === value?.OfficerID)}
                                                options={agencyOfficerFullNameDrpData}
                                                // value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerID)}
                                                // options={agencyOfficerDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                                                placeholder="Select.."
                                                styles={
                                                    typeCode.toLowerCase() === 'ni'
                                                        ? colourStylesUsers
                                                        :
                                                        Requiredcolour
                                                }
                                                isDisabled={typeCode.toLowerCase() === 'ni'}
                                                menuPlacement="bottom"
                                            />
                                        </div>
                                        <div className='col-lg-4'></div>
                                        <div className="col-4 col-md-4 col-lg-2 mt-2 pt-2">
                                            <label htmlFor="" className='new-label'>Report Type {errors.NarrativeIDError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeIDError}</p>
                                            ) : null} </label>
                                        </div>
                                        <div className="col-7 col-md-7 col-lg-6 mt-2 ">
                                            <Select
                                                name='NarrativeTypeID'
                                                isClearable
                                                styles={Requiredcolour}
                                                value={narrativeTypeDrpData?.filter((obj) => obj.value === value?.NarrativeTypeID)}
                                                options={narrativeTypeDrpData?.filter((obj) => obj.value !== 6)}
                                                onChange={(e) => ChangeDropDown(e, 'NarrativeTypeID', 'NarrativeTypeCode')}
                                                placeholder="Select.."
                                                menuPlacement="bottom"
                                            />
                                        </div>
                                        <div className='col-lg-4'></div>

                                    </div>
                                    {Array.isArray(nibrsStatus) && (
                                        (nibrsStatus.includes("CASE CLOSED") && nibrsStatus.includes("NIBRS SUBMITTED")) && (
                                            <div className="mt-3">
                                                <div className="alert alert-danger p-2" role="alert" style={{ fontSize: "14px", border: "1px solid red" }}>
                                                    <strong style={{ color: "#000" }}>NOTE:</strong> The case is currently closed. The officer will only be able to submit a supplement narrative.
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className='col-6 col-md-4 col-lg-12 mt-2 d-flex text-right ' style={{ justifyContent: "flex-end" }}>
                                <button type="button" style={{ backgroundColor: "#001f3f", color: "#fff" }} className="btn  mr-1 mb-2" onClick={() => check_Validation_Error()} >Save</button>
                                <button type="button" style={{ border: " 1px solid#001f3f", color: "#001f3f" }} data-dismiss="modal" onClick={() => { resetOfficers(); setshowModal(false) }} className="btn  pl-2 mb-2">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>


    );
};


const RecallNarrativeModal = (props) => {


    const localStoreData = useSelector((state) => state?.Agency?.localStoreData);
    const { incidentID, nibrsStatus, loginPinID, setshowModal, showModalAssign, primaryOfficer, updateNarrative, loginAgencyID, showModalRecall, narrativeID, setshowModalRecall, narrativeTypeCode } = props
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));


    const [value, setValue] = useState({
        'CommentsDoc': '', 'IncidentId': '', 'NarrativeID': '', 'Comments': '', 'AssignComment': '', 'ReportType': '',
        'ReportedByPINActivityID': null, 'NarrativeTypeID': null, 'AsOfDate': null,
        'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'ApprovingSupervisorID': '', 'OfficerID': '',
        'IncidentID': ''
    })

    const [errors, setErrors] = useState({
        'OfficerError': '', 'NarrativeIDError': '', 'AssignCommentError': ''
    })


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);



    const resetRecall = () => {
        setValue({ ...value, 'NarrativeID': '', 'NarrativeID': '', 'Comments': '', });
        setErrors({ ...errors, ['ApprovalCommentsError']: '', })
    }


    useEffect(() => {
        if (localStoreData) {
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID))
        }
    }, [localStoreData, IncID]);


    const check_Validation_Recall = () => {
        const ApprovalCommentsErr = RequiredFieldIncident(value?.Comments);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['ApprovalCommentsError']: ApprovalCommentsErr || prevValues['ApprovalCommentsError'],
            }
        })
    }

    const { ApprovalCommentsError } = errors

    useEffect(() => {
        if (ApprovalCommentsError === 'true') {
            Add_Approval_Recall()
            // reset();
            resetserror();
        }

    }, [ApprovalCommentsError])

    const resetserror = () => {
        setErrors({ ...errors, ['ApprovalCommentsError']: '', })
    }




    const Add_Approval_Recall = async (id) => {
        const { ApprovingSupervisorID, status, Comments } = value;

        const val = {
            'IncidentId': incidentID, 'NarrativeID': narrativeID, 'CreatedByUserFK': loginPinID, 'Comments': Comments, 'status': 'Draft',
        };
        AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    setshowModalRecall(false);
                    // get_NarrativesData(incidentID, loginPinID);
                    updateNarrative();
                    resetRecall();
                    // resets(); reset()
                } else {
                    console.error("something Wrong");
                }
            }).catch(err => console.warn(err));
    }




    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            resetserror();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (event) {
            setValue((prevState) => ({ ...prevState, [name]: value, }));
        }
        else {
            setValue((prevState) => ({ ...prevState, [name]: null, }));
        }
    };

    return (
        <>
            {showModalRecall && (
                <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="QueueReportsModalRecall" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content p-2 px-4 approvedReportsModal" >
                            <div className='d-flex justify-content-between'>
                                <h5 className="fw-bold">Recall Report</h5>
                                <button className="btn-close b-none bg-transparent text-right" onClick={() => { resetRecall(); setshowModalRecall(false); }} data-dismiss="modal">X</button>
                            </div>
                            <div className="col-md-6">
                                <label className="fw-bold">Enter Reason</label>
                                <textarea
                                    className="form-control"
                                    style={{ minHeight: '80px', minWidth: '100px', background: '#FFE2A8' }}
                                    placeholder="Enter Reason"
                                    name="Comments"
                                    value={value?.Comments}

                                    onChange={(e) => { handleChange(e) }}
                                />
                                {errors.ApprovalCommentsError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', fontWeight: "400" }}>{errors.ApprovalCommentsError}</p>
                                ) : null}
                            </div>
                            <div className='col-6 col-md-4 col-lg-12 mt-2 d-flex text-right ' style={{ justifyContent: "flex-end" }}>
                                <button type="button" style={{ backgroundColor: "#001f3f", color: "#fff" }} className="btn  mr-1 mb-2" onClick={() => check_Validation_Recall()} >Save</button>
                                <button type="button" style={{ border: " 1px solid#001f3f", color: "#001f3f" }} data-dismiss="modal" onClick={() => { resetRecall(); setshowModalRecall(false) }} className="btn  pl-2 mb-2">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>


    );
};



const changeArrayFormatNew = (data) => {
    if (!data || !Array.isArray(data)) {
        return [];
    }

    return data.map((item) => ({
        Code: item.ChargeCode,
        AgencyCode: item.AgencyCode || '',
        Description: item.Description || '',
        FBIID: item.FBIDescription || '',
        MultiAgency_Name: item.MultiAgency_Name,
        IsEditable: item.IsEditable,
        ChargeCodeID: item.ChargeCodeID || '',
        IsActive: item.IsActive
    }));
};
