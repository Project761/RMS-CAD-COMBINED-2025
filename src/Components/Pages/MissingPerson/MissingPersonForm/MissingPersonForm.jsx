import { useState, useEffect, useContext, useRef } from 'react'
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AddDeleteUpadate, fetchPostData, fetchPostDataNew } from '../../../hooks/Api';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import {
    Canvas as FabricCanvas,
    Circle,
    FabricImage,
    Ellipse,
    Path,
} from "fabric";
import DatePicker from "react-datepicker";
import useObjState from '../../../../CADHook/useObjState';
import { base64ToString, changeArrayFormat, Decrypt_Id_Name, getShowingWithOutTime, } from '../../../Common/Utility';
import { changeArrayFormat_Active_InActive } from '../../../Common/ChangeArrayFormat';
import SelectBox from '../../../Common/SelectBox';
import { get_AgencyOfficer_Data, get_Report_Approve_Officer_Data } from '../../../../redux/actions/IncidentAction';
import { toastifySuccess } from '../../../Common/AlertMsg';
import { useReactToPrint } from 'react-to-print';
import Loader from '../../../Common/Loader';
import MissingTab from '../../../Utility/Tab/MissingTab';

const MissingPersonForm = (props) => {
    // const { DecArrestId } = props
    const deleteSelectedRef = useRef(null);
    const clearAllRef = useRef(null);
    const componentRef = useRef();

    const dispatch = useDispatch();

    const { agnecyName, datezone, changesStatusCount } = useContext(AgencyContext);

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [loginAgencyID, setLoginAgencyID] = useState('')
    const [selectedTool, setSelectedTool] = useState(null);
    const [arrestID, setArrestID] = useState('')
    const [loginPinID, setLoginPinID] = useState('');
    const [useOfForceID, setUseOfForceID] = useState('');
    const [editValUseOfForce, setEditValUseOfForce] = useState([]);
    const [selectedOption, setSelectedOption] = useState("IND");
    const [IsSuperadmin, setIsSuperadmin] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [groupList, setGroupList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(false);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    let DecArrestId = 0
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    function isValidBase64(str) {
        const base64Pattern = /^[A-Za-z0-9+/=]+$/;
        return base64Pattern.test(str);
    }
    let ArrestID = query?.get("ArrestId");
    if (!ArrestID) {
        ArrestID = 0;
    } else {
        if (isValidBase64(ArrestID)) {
            try {
                let decodedString = atob(ArrestID);
                DecArrestId = parseInt(decodedString, 10);
            } catch (error) {
                console.error("Error in decoding Base64 or parsing to integer:", error);
                DecArrestId = 0;
            }
        } else {
            console.error("ArrestID is not a valid Base64 string");
            DecArrestId = 0;
        }
    }

    const [WrittenForDataDrp, setWrittenForDataDrp] = useState([]);

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
    const get_Group_List = (loginAgencyID) => {
        const value = { AgencyId: loginAgencyID, PINID: loginPinID }
        fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'))
                if (res[0]?.GroupID) {
                    // setValue({
                    //   ...value,
                    //   ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID),
                    //   'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
                    //   'WrittenForID': narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
                    //   'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
                    // });
                }
            }
            else {
                setGroupList();
            }
        })
    }

    useEffect(() => {
        if (loginAgencyID) {
            dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
            Get_WrittenForDataDrp(loginAgencyID, IncID);
            dispatch(get_Report_Approve_Officer_Data(loginAgencyID, localStoreData?.PINID));
            // if (narrativeTypeDrpData?.length === 0) { dispatch(get_Narrative_Type_Drp_Data(loginAgencyID)) }
            get_Group_List(loginAgencyID);
            // get_IncidentTab_Count(IncID, loginPinID);


        }
    }, [loginAgencyID])


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(parseInt(localStoreData?.PINID)); setLoginAgencyID(parseInt(localStoreData?.AgencyID));
            setIsSuperadmin(localStoreData?.IsSuperadmin);

            GetUseOfForceSingleData(DecArrestId)
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecArrestId) {
            setArrestID(DecArrestId);
            GetUseOfForceSingleData(DecArrestId);
        }
    }, [DecArrestId]);

    useEffect(() => {
        if (arrestID) {
            GetUseOfForceSingleData(arrestID)
        }
    }, [arrestID])

    const [formData, setFormData] = useState({
        useOfForceSecond: {
            subjectInjuredYes: false,
            subjectInjuredNo: false,
            subjectInjuredNote: '',
            transportedTo1: '',
            ambulance1: false,
            refusedTreatment1: false,
            officerInjuryYes: false,
            officerInjuryNo: false,
            officerInjuryNote: '',
            transportedTo2: '',
            ambulance2: false,
            refusedTreatment2: false
        },
        reasonForce: {
            toEffectArrest: false,
            toDefendSelf: false,
            toDefendOfficer: false,
            toDefendPerson: false,
            toPreventOffense: false,
            restrainSafety: false,
            other: false,
            otherText: ''
        },
        subjectActions: {
            nonVerbalCues: false,
            verbalThreats: false,
            deadlyPull: false,
            pulling: false,
            assault: false,
            assaultIntent: false,
            assaultWeapon: false,
            other: false,
            otherText: '',
            numberOfSuspects: '',
            alcohol: false,
            drugs: false,
            mentalIssues: false,
            otherUnderInfluence: false,
            otherUnderInfluenceText: ''
        },
        officerActions: {
            verbalDirection: false,
            softWeapons: false,
            hardWeapons: false,
            ocSpray: false,
            aspBaton: false,
            nonLethal: false,
            lessLethal: false,
            pointedTaser: false,
            dischargedTaser: false,
            pointedFirearm: false,
            dischargedFirearm: false,
            other: false,
            otherText: ''
        },
        physicalControl: {
            notUsed: false,
            muscling: false,
            pressurePoints: false,
            jointLock: false,
            takedown: false,
            handcuffing: false,
            hobble: false,
            other: false,
            otherText: '',
            effectiveYes: false,
            effectiveNo: false,
            effectiveNote: "",
        },
        ocSpray: {
            notUsed: false,
            attempted: false,
            used: false,
            distance: '',
            distance1: '',
            duration1: '',
            duration2: '',
            duration3: '',
            effectiveYes: false,
            effectiveNo: false,
            effectiveNote: "",
        },
        aspBaton: {
            notUsed: false,
            used: false,
            numStrikes: '',
            location: '',
            effectiveYes: false,
            effectiveNo: false,
            effectiveNote: "",
        },
        lessLethal: {
            notUsed: false,
            used: false,
            beanBag: '',
            stinger: '',
            rubber: '',
            pepperball: '',
            location: '',
            effectiveYes: false,
            effectiveNo: false,
            effectiveNote: "",
        },
        taser: {
            notUsed: false,
            pointed: false,
            discharged: false,
            driveStun: false,
            distance: '',
            cycles: '',
            probesPenetrateSkinYes: false,
            probesPenetrateSkinNo: false,
            taserNumber: '',
            cartridgeNumbers: '',
            placedInEvidenceYes: false,
            placedInEvidenceNo: false,
            effectiveYes: false,
            effectiveNo: false,
            effectiveNote: "",
        },
        firearm: {
            notUsed: false,
            pointed: false,
            discharged: false,
            sidearm: false,
            shotgun: false,
            rifle: false,
            backup: false,
            distance: '',
            roundsDischarged: '',
            hitsOnTarget: '',
            serialNumber: '',
            serialNumberMark: false,
            effectiveYes: false,
            effectiveNo: false,
            effectiveNote: "",
        },
        environmental: {
            hot: false,
            warm: false,
            cool: false,
            cold: false,
            daylight: false,
            dawnDusk: false,
            darkness: false,
            other: false,
            otherNote: ''
        },
        situational: {
            multipleSuspects: false,
            hostile: false,
            threats: false,
            confined: false,
            indoors: false,
            outdoors: false,
            inVehicle: false,
            other: false,
            otherNote: ''
        },
        officerSummary: {
            successfulForceType: '',
            forceEffectivenessComments: '',
            reportingOfficer: ''
        },
        supervisorReview: {
            officerCount: '',
            videoReviewed: false,
            comments: '',
            supervisorName: '',
            badgeNumber: '',
            inCompliance: false,
            investigationNeeded: false
        },
        reviewed: {
            patrolLieutenantName: '',
            patrolLieutenantInCompliance: false,
            patrolLieutenantInvestigationNeeded: false,
            chiefOfPoliceName: '',
            chiefOfPoliceInCompliance: false,
            chiefOfPoliceInvestigationNeeded: false
        }
    });

    const [useOfForce, setUseOfForce] = useState({
        useOfForce: {
            date: '',
            time: '',
            dayOfWeek: '',
            shift: '',
            area: '',
            arrOff: '',
            primaryOfficer: '',
            fileNumber: '',
            timeOnDept: '',
            mos: '',
            location: '',
            callType: '',
            typePromises: '',
            subjectName: '',
            race: '',
            sex: '',
            dob: '',
            age: '',
            address: '',
            hgt: '',
            wgt: '',
        },
    });

    const [locks, setLocks] = useState({
        address: false,
        hgt: false,
        wgt: false,
    });

    const [
        useOfForceBasicDetailState,
        setUseOfForceBasicDetailState,
        handleUseOfForceBasicDetailState,
        clearUseOfForceBasicDetailState,
    ] = useObjState({
        ReportType: "Use Of Force",
        ReportDateTime: "",
        PreparedById: loginPinID,
        WrittenForID: "",
    });

    const [
        approvalState,
        setApprovalState,
        handleApprovalState,
        clearApprovalState,
    ] = useObjState({
        Status: "",
        ApprovingSupervisorID: "",
        Reason: ""
    });

    const [
        errorState,
        setErrorState,
        handleErrorState,
        clearErrorState,
    ] = useObjState({
        ReportDateTime: false,
        WrittenForID: false,
    });

    const [
        errorApprovalState,
        setErrorApprovalState,
        handleErrorApprovalState,
        clearErrorApprovalState,
    ] = useObjState({
        ApprovingSupervisorID: false,
    });

    const handleSelectIncidentName = (selectedOption, actionMeta = {}) => {
        console.log("selectedOption", selectedOption)
        // selectedOption can be: array (multi), single option, or null
        const arr = Array.isArray(selectedOption)
            ? selectedOption
            : selectedOption
                ? [selectedOption]
                : [];

        const ids = arr
            .map(o => (o?.value != null ? String(o.value) : null))
            .filter(Boolean);

        // You were using the meta { name }, but you always set this same field anyway:
        handleApprovalState("ApprovingSupervisorID", ids.join(","));
    };

    // console.log("reportApproveOfficer", reportApproveOfficer)
    // const handleSelectIncidentName = (selectedOption, { name }) => {
    //   console.log("selectedOption", selectedOption)
    //   const data = selectedOption.map(item => item?.value);
    //   handleApprovalState("ApprovingSupervisorID", data.join(","));
    // };

    const selectedIds = (approvalState?.ApprovingSupervisorID || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);


    function extractYearsAndMonths(input) {
        let years = 0;
        let months = 0;

        if (!input) return { years, months };

        // Match "X Years Y Months", "X Year", "Y Months", etc.
        const yearMatch = input.match(/(\d+)\s*Years?/i);
        const monthMatch = input.match(/(\d+)\s*Months?/i);

        if (yearMatch) {
            years = parseInt(yearMatch[1], 10);
        }
        if (monthMatch) {
            months = parseInt(monthMatch[1], 10);
        }

        return { years, months };
    }

    useEffect(() => {
        const useForceSectionData = editValUseOfForce?.Table?.[0];
        const table1UseOfForce = editValUseOfForce?.Table1?.[0]?.useOfForce;
        const prefer = (primary, fallback) => {
            const isMissing =
                primary === undefined ||
                primary === null ||
                (typeof primary === "string" && primary.trim() === "");
            return !isMissing ? primary : fallback;
        };
        // const addressInit = prefer(useForceSectionData?.Address, table1UseOfForce?.address);
        // const hgtInit = prefer(useForceSectionData?.Height, table1UseOfForce?.hgt);
        // const wgtInit = prefer(useForceSectionData?.Weight, table1UseOfForce?.wgt);
        const { years, months } = extractYearsAndMonths(useForceSectionData?.TimeOnDept);
        setUseOfForce({
            useOfForce: {
                date: useForceSectionData?.ReportedDateOnly,
                time: useForceSectionData?.ReportedTimeOnly,
                dayOfWeek: useForceSectionData?.DayOfWeek,
                shift: useForceSectionData?.ShiftDescription,
                area: useForceSectionData?.ZoneDescription,
                arrOff: useForceSectionData?.ArrestNumber,
                primaryOfficer: useForceSectionData?.FirstName,
                fileNumber: useForceSectionData?.PIN,
                timeOnDept: years,
                mos: months,
                location: useForceSectionData?.CrimeLocation,
                callType: useForceSectionData?.CFSDescription,
                typePromises: useForceSectionData?.PrimaryLocationType,
                subjectName: table1UseOfForce?.subjectName,
                race: table1UseOfForce?.race,
                sex: table1UseOfForce?.sex,
                // dob: table1UseOfForce?.dob ? moment(useForceSectionData?.dob).format('MM/DD/YYYY') : '',
                dob: table1UseOfForce?.dob || '',
                age: table1UseOfForce?.age,
                address: table1UseOfForce?.address,
                hgt: table1UseOfForce?.hgt,
                wgt: table1UseOfForce?.wgt,
            },
        })
        setUseOfForceBasicDetailState(prevState => ({
            ...prevState,
            PreparedById: loginPinID,
            WrittenForID: loginPinID
        }));

        // setLocks(prev => ({
        //   ...prev,
        //   address: !!addressInit,
        //   hgt: !!hgtInit,
        //   wgt: !!wgtInit,
        // }));
        if (useOfForceID) {
            setFormData(editValUseOfForce?.Table1?.[0] || {})

            editCanvasData(editValUseOfForce?.Table1?.[0]?.canvasData || {})
            setUseOfForceBasicDetailState({
                ReportType: "Use Of Force",
                ReportDateTime: editValUseOfForce?.Table1?.[0]?.useOfForceBasicDetailState?.ReportDateTime ? new Date(editValUseOfForce?.Table1?.[0]?.useOfForceBasicDetailState?.ReportDateTime) : "",
                PreparedById: editValUseOfForce?.Table1?.[0]?.useOfForceBasicDetailState?.PreparedById,
                WrittenForID: editValUseOfForce?.Table1?.[0]?.useOfForceBasicDetailState?.WrittenForID,
            })
            setApprovalState({
                Status: editValUseOfForce?.Table1?.[0]?.Status || "",
                ApprovingSupervisorID: editValUseOfForce?.Table1?.[0]?.ApprovePinID || "",
                Reason: editValUseOfForce?.Table1?.[0]?.Reason || "",
            })
            setIsViewMode(editValUseOfForce?.Table1?.[0]?.Status === "Pending Review" || editValUseOfForce?.Table1?.[0]?.Status === "Approved")
            setSelectedOption(editValUseOfForce?.Table1?.[0]?.ReportApproveType || "IND")

        }
    }, [editValUseOfForce, changesStatusCount, reportApproveOfficer]);

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [section, subField] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...(prev[section]),
                    [subField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleInputChangeUseOfForce = (field, value) => {
        if (field.includes('.')) {
            const [section, subField] = field.split('.');
            setUseOfForce(prev => ({
                ...prev,
                [section]: {
                    ...(prev[section]),
                    [subField]: value
                }
            }));
        } else {
            setUseOfForce(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleRadioChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedOption(selectedValue);
        setApprovalState((prev) => ({
            ...prev,
            ApprovingSupervisorID: ""
        }));
    };

    const GetUseOfForceSingleData = (arrestID) => {
        const val = {
            'ArrestID': null,
            'IncidentID': IncID,
            "IsArrest": 0,
        }
        fetchPostDataNew('CAD/UseOfForce/GetUseOfForceSupplement', val)
            .then((res) => {
                setUseOfForceID(res?.Table1?.[0]?.UseofForceID || '');
                setEditValUseOfForce(res);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const validateForm = () => {
        let isError = false;
        const keys = Object.keys(errorState);
        keys.forEach((field) => {
            if (field === "ReportDateTime" && (useOfForceBasicDetailState?.ReportDateTime === "" || useOfForceBasicDetailState?.ReportDateTime === null || useOfForceBasicDetailState?.ReportDateTime === undefined)) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "WrittenForID" && (useOfForceBasicDetailState?.WrittenForID === "" || useOfForceBasicDetailState?.WrittenForID === null || useOfForceBasicDetailState?.WrittenForID === undefined)) {
                handleErrorState(field, true);
                isError = true;
            }
            else {
                handleErrorState(field, false);
            }
        });
        return !isError;
    };

    const addUseOfForceForm = () => {
        if (!validateForm()) return;
        const canvasData = fabricCanvas.toJSON();
        const { useOfForce: _, ...formDataWithoutUseOfForce } = formData || {};

        const payload = {
            ...useOfForce,
            ...formDataWithoutUseOfForce,
            useOfForceBasicDetailState: useOfForceBasicDetailState,
            agencyId: loginAgencyID,
            incidentId: IncID,
            arrestId: "",
            canvasData: canvasData,
            CreatedByUserFK: loginPinID,
        };
        AddDeleteUpadate('/CAD/UseOfForce/InsertUseOfForce', payload).then((res) => {
            toastifySuccess("Use of Force added successfully")
            const parsedData = JSON.parse(res.data);
            GetUseOfForceSingleData(DecArrestId)
        });
    }

    const updateUseOfForceForm = () => {
        if (!validateForm()) return;
        const canvasData = fabricCanvas.toJSON();
        const { useOfForce: _, ...formDataWithoutUseOfForce } = formData || {};

        const payload = {
            ...useOfForce,
            ...formDataWithoutUseOfForce,
            useOfForceBasicDetailState: useOfForceBasicDetailState,
            UseofForceID: useOfForceID,
            agencyId: loginAgencyID,
            incidentId: IncID,
            arrestId: "",
            canvasData: canvasData,
            ModifiedByUserFK: loginPinID,
        };
        AddDeleteUpadate('/CAD/UseOfForce/UpdateUseOfForce', payload).then((res) => {
            toastifySuccess("Use of Force updated successfully")
            const parsedData = JSON.parse(res.data);
            GetUseOfForceSingleData(DecArrestId)

        });
    }

    const validateApprovalForm = () => {
        let isError = false;
        const keys = Object.keys(errorApprovalState);
        keys.forEach((field) => {
            if (field === "ApprovingSupervisorID" && (approvalState?.ApprovingSupervisorID === "" || approvalState?.ApprovingSupervisorID === null || approvalState?.ApprovingSupervisorID === undefined)) {
                handleErrorApprovalState(field, true);
                isError = true;
            }
            else {
                handleErrorApprovalState(field, false);
            }
        });
        return !isError;
    };
    const Add_Approval = async (id) => {
        if (!validateApprovalForm()) return;
        const val = {
            "UseofForceID": useOfForceID,
            "ArrestID": DecArrestId,
            "IncidentID": IncID,
            "ReportApproveType": selectedOption,    // IND // Group
            "ApprovePinID": approvalState?.ApprovingSupervisorID,    // Report Approver
            "CreatedByUserFK": loginPinID,
            "Status": "Pending Review",
        };

        AddDeleteUpadate('CAD/UseOfForceApprove/UseOfForceApprove', val)
            .then((res) => {
                if (res.success) {
                    GetUseOfForceSingleData(DecArrestId)

                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    // toastifySuccess(message);
                    // get_Data_PoliceForce(arrestID); setStatus(true); setErrors({ ...errors, ['ApprovingOfficerError']: '' })


                } else {
                    console.error("something Wrong");
                }
            }).catch(err => console.error(err));
    }


    // Diagram Code Start

    const handleToolUsed = () => {
        setSelectedTool(null);
    };

    const handleDeleteSelected = () => {
        if (deleteSelectedRef.current) {
            deleteSelectedRef.current();
        }
    };

    const handleClearAll = () => {
        if (clearAllRef.current) {
            clearAllRef.current();
        }
    };
    const tools = [
        { type: 'grip', label: 'Grip', color: '#fbbf24', symbol: '●' },
        { type: 'spray', label: 'Spray', color: '#10b981', symbol: '○' },
        { type: 'impact', label: 'Impact', color: '#ef4444', symbol: '◆' },
        { type: 'dart', label: 'Dart', color: '#8b5cf6', symbol: '▲' },
        { type: 'munition', label: 'Munition', color: '#f59e0b', symbol: '◯' },
    ];

    const canvasRef = useRef(null);
    const [fabricCanvas, setFabricCanvas] = useState(null);
    const selectedToolRef = useRef(selectedTool);

    const RED = "#ff0000";
    // Update the ref when selectedTool changes
    useEffect(() => {
        selectedToolRef.current = selectedTool;
    }, [selectedTool]);

    // useEffect(() => {
    //   const canvas = new FabricCanvas(canvasRef.current, {
    //     width: 380,
    //     height: 400,
    //     backgroundColor: "#ffffff",
    //   });
    //   wireUniformScaling(canvas);
    //   // Load background image
    //   FabricImage.fromURL(
    //     "/image.jpg"
    //   )
    //     .then((img) => {
    //       if (!img) return;

    //       // Scale image to fit canvas while maintaining aspect ratio
    //       const scaleX = canvas.width / img.width;
    //       const scaleY = canvas.height / img.height;
    //       const scale = Math.min(scaleX, scaleY) * 1; // 90% to leave some margin

    //       img.set({
    //         scaleX: scale,
    //         scaleY: scale,
    //         left: (canvas.width - img.width * scale) / 2,
    //         top: (canvas.height - img.height * scale) / 2,
    //         selectable: false,
    //         evented: false,
    //         lockMovementX: true,
    //         lockMovementY: true,
    //       });

    //       canvas.add(img);
    //       canvas.sendObjectToBack(img);
    //       canvas.renderAll();
    //     })
    //     .catch((error) => {
    //       console.error("Error loading background image:", error);
    //     });

    //   setFabricCanvas(canvas);

    //   // Handle canvas clicks to add annotations
    //   let isMouseDown = false;
    //   let mouseDownPosition = { x: 0, y: 0 };
    //   let hadActiveOnMouseDown = false;
    //   const handleMouseDown = (e) => {
    //     // remember if something was selected when the click started
    //     hadActiveOnMouseDown = !!canvas.getActiveObject();

    //     // clicking empty space should clear selection immediately
    //     if (!e.target) {
    //       canvas.discardActiveObject();
    //       canvas.requestRenderAll();
    //     }

    //     isMouseDown = true;
    //     if (e.pointer) {
    //       mouseDownPosition = { x: e.pointer.x, y: e.pointer.y };
    //     }
    //   };

    //   const handleMouseUp = (e) => {
    //     if (!selectedToolRef.current || !e.pointer || !isMouseDown) {
    //       isMouseDown = false;
    //       return;
    //     }

    //     const distance = Math.hypot(
    //       e.pointer.x - mouseDownPosition.x,
    //       e.pointer.y - mouseDownPosition.y
    //     );

    //     // ✅ If this click started while something was selected and we clicked blank,
    //     // treat it as a deselect-only click (do NOT create a new shape).
    //     if (distance < 5 && !e.target && hadActiveOnMouseDown) {
    //       isMouseDown = false;
    //       hadActiveOnMouseDown = false;
    //       return;
    //     }

    //     // normal place-on-click (only when starting with no selection)
    //     if (distance < 5 && !e.target) {
    //       const shape = createAnnotationShape(
    //         selectedToolRef.current,
    //         e.pointer.x,
    //         e.pointer.y
    //       );
    //       if (shape) {
    //         canvas.add(shape);
    //         canvas.setActiveObject(shape); // keep if you want it selected right away
    //         canvas.renderAll();
    //         handleToolUsed?.(); // optional: tell parent to clear tool for one-shot placement
    //       }
    //     }

    //     isMouseDown = false;
    //     hadActiveOnMouseDown = false;
    //   };

    //   const handleMouseDown2 = (e) => {
    //     if (e.e.button === 2 && e.target && e.target !== canvas.getObjects()[0]) {
    //       // Right click and not background
    //       canvas.remove(e.target);
    //       canvas.renderAll();
    //       // toast.success("Annotation deleted");
    //     }
    //   };

    //   const handleDeselectOnBlank = (e) => {
    //     if (!e.target) {
    //       canvas.discardActiveObject();
    //       canvas.requestRenderAll();
    //     }
    //   };

    //   canvas.on("mouse:down", handleMouseDown);
    //   canvas.on("mouse:up", handleMouseUp);
    //   canvas.on("mouse:down", handleMouseDown2);
    //   canvas.on("mouse:down", handleDeselectOnBlank); // << add this

    //   // Handle delete key
    //   const handleKeyDown = (e) => {
    //     if (e.key === "Delete" || e.key === "Backspace") {
    //       const activeObjects = canvas.getActiveObjects();
    //       if (activeObjects.length > 0) {
    //         activeObjects.forEach((obj) => {
    //           // Don't delete the background image
    //           if (obj !== canvas.getObjects()[0]) {
    //             canvas.remove(obj);
    //           }
    //         });
    //         canvas.discardActiveObject();
    //         canvas.renderAll();
    //         //   toast.success("Annotation deleted");
    //       }
    //     }
    //   };

    //   document.addEventListener("keydown", handleKeyDown);

    //   return () => {
    //     canvas.off("mouse:down", handleMouseDown);
    //     canvas.off("mouse:up", handleMouseUp);
    //     canvas.off("mouse:down", handleMouseDown2);
    //     document.removeEventListener("keydown", handleKeyDown);
    //     canvas.dispose();
    //   };
    // }, []); // Removed selectedTool from dependencies

    function styleAnnotation(obj) {
        obj.set({
            lockUniScaling: true,   // ❗ only uniform scaling allowed
            lockScalingFlip: true,
            lockSkewingX: true,
            lockSkewingY: true,
            strokeUniform: true,    // keep stroke width constant while scaling
            centeredScaling: true,  // scale from center
            lockRotation: true,     // no rotation
        });

        // hide side handles (that cause non-uniform scaling) + rotation handle
        obj.setControlsVisibility({
            ml: false, mr: false, mt: false, mb: false, // sides off
            mtr: false, // rotation off
        });

        return obj;
    }

    const createAnnotationShape = (type, x, y) => {
        const commonOpts = { selectable: true };

        switch (type) {
            // ᐱᐱ Grip (chevron/zig-zag)
            case "grip":
                return styleAnnotation(new Path("M -12 6 L -6 -6 L 0 6 L 6 -6 L 12 6", {
                    ...commonOpts,
                    left: x,
                    top: y,
                    originX: "center",
                    originY: "center",
                    fill: "",
                    stroke: RED,
                    strokeWidth: 3,
                    objectCaching: false,
                }));

            // ◯ Spray (ellipse outline)
            case "spray":
                return styleAnnotation(new Ellipse({
                    ...commonOpts,
                    left: x,
                    top: y,
                    originX: "center",
                    originY: "center",
                    rx: 16,
                    ry: 12,
                    fill: "transparent",
                    stroke: RED,
                    strokeWidth: 2,
                }));
            case "impact":
                return styleAnnotation(new Path(
                    "M 40 -4 L 20 -4 L 20 -8 L 0 0 L 20 8 L 20 4 L 40 4 Z",
                    {
                        left: x, top: y,
                        originX: "center", originY: "center",
                        fill: RED,
                        strokeWidth: 0,
                    }
                ));
            // ▶ Dart (triangle/arrowhead)
            case "dart":
                return styleAnnotation(new Path("M -8 0 L -2 6 L 8 -6", {
                    left: x,
                    top: y,
                    originX: "center",
                    originY: "center",
                    fill: "",
                    stroke: RED,
                    strokeWidth: 4,
                }));
            // ● Munition (solid dot)
            case "munition":
                return styleAnnotation(new Circle({
                    ...commonOpts,
                    left: x,
                    top: y,
                    originX: "center",
                    originY: "center",
                    radius: 6,
                    fill: RED,
                }));

            default:
                return null;
        }
    };

    function wireUniformScaling(canvas) {
        canvas.on("object:scaling", (e) => {
            const obj = e.target;
            if (!obj) return;
            const s = Math.max(obj.scaleX, obj.scaleY); // or (obj.scaleX + obj.scaleY)/2
            obj.set({ scaleX: s, scaleY: s });
        });
    }

    const clearCanvas = () => {
        if (!fabricCanvas) return;

        // Keep only the background image (first object)
        const objects = fabricCanvas.getObjects();
        objects.slice(1).forEach((obj) => fabricCanvas.remove(obj));
        fabricCanvas.renderAll();
        // toast.success("All annotations cleared");
    };

    const deleteSelected = () => {
        if (!fabricCanvas) return;

        const activeObjects = fabricCanvas.getActiveObjects();
        if (activeObjects.length > 0) {
            activeObjects.forEach((obj) => {
                // Don't delete the background image
                if (obj !== fabricCanvas.getObjects()[0]) {
                    fabricCanvas.remove(obj);
                }
            });
            fabricCanvas.discardActiveObject();
            fabricCanvas.renderAll();
            //   toast.success("Selected annotations deleted");
        }
    };

    // Expose delete functions
    useEffect(() => {
        deleteSelectedRef.current = deleteSelected;
        clearAllRef.current = clearCanvas;
    }, [fabricCanvas]);

    const editCanvasData = async (canvasData) => {

        if (!fabricCanvas || !canvasData) return;

        // Load JSON back into the same canvas instance
        await fabricCanvas.loadFromJSON(canvasData);

        // Re-apply any canvas-wide handlers if needed
        wireUniformScaling(fabricCanvas);

        // Ensure background image stays locked & at the back
        const imgs = fabricCanvas.getObjects().filter((o) => o.type === "image");
        imgs.forEach((img) => {
            img.set({
                selectable: false,
                evented: false,
                lockMovementX: true,
                lockMovementY: true,
                hasControls: false,
                hoverCursor: "default",
            });
            fabricCanvas.sendObjectToBack(img);
        });

        fabricCanvas.renderAll();
    };
    // Diagram Code End

    const colourStylesUsers = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: isDisabled ? '#d3d3d3' : '#fce9bf',
            fontSize: 14,
            marginTop: 2,
            boxShadow: 'none',
            cursor: isDisabled ? 'not-allowed' : 'default',
        }),
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#fce9bf', // Default background color
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

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Use Of Force',
        onBeforeGetContent: () => {
            setLoader(true);
        },
        onAfterPrint: () => {
            setSelectedStatus(false);
            setLoader(false);
        },
    })

    useEffect(() => {
        if (selectedStatus) {
            printForm();
        }
    }, [selectedStatus]);

    return (
        <>
              <style jsx>{`
    body {
      background-color: white;
      color: black;
    }
    
    .form-section {
      position: relative;
      margin-bottom: 1rem;
    }
    .form-input {
      border: none;
      border-bottom: 1px solid black;
      background: transparent;
      outline: none;
      padding: 2px 4px;
      font-size: 12px;
      height: 20px;
         width: 100%;
      min-width: 60px;
      max-width: 100%;
         margin: 1px 1px;
    }
    
    .form-checkbox {
      width: 16px;
      height: 16px;
      border: 1px solid black;
      background: transparent;
      margin-right: 4px;
    }
    
    .form-header {
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      letter-spacing: 2px;
    }
    
    .form-subheader {
      text-align: center;
      font-weight: 600;
      font-size: 16px;
    }
    
    .section-title {
      font-weight: bold;
      font-size: 12px;
      background: white;
      padding: 0 8px;
      position: absolute;
      top: -8px;
      left: 8px;
    }
    
    .label-nowrap {
      white-space: nowrap;
      flex-shrink: 0;
      margin-right: 6px; /* tweak as needed */
    }

    .new-page {
      page-break-before: always;
    }

    .no-break {
      page-break-inside: avoid; /* Prevent divs from breaking across pages */
    }

    .page-number {
      position: fixed;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: black;
    }

    @media print {
      @page {
        size: 8.5in 11in; /* Set page size to 8.5 inches by 11 inches (Letter size) */
        margin: 5mm; /* Set margins, you can adjust as per your requirement */
      }
    }
    
    .border,
    .border-top,
    .border-right, .border-end,
    .border-bottom,
    .border-left, .border-start {
      border-color: #000 !important;
    }
           `}
      </style>
            <div className="section-body view_page_design pt-1 p-1 bt" >
                <div className="col-12  inc__tabs">
                    <MissingTab />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">

                        {/* start */}
                            <div className="col-12 col-md-12 pt-2 p-0 child" >
                                <div
                                    style={{
                                        pointerEvents: isViewMode ? 'none' : 'auto',  // Disable interactions if isViewMode is true
                                        cursor: isViewMode ? 'not-allowed' : 'auto',  // Change cursor to indicate it's read-only
                                    }}
                                >
                                    {/* print start */}
                                    <div className="col-12" ref={componentRef}>
                                        {/* use of force form start */}
                                        <div className="row mt-2 m-2" style={{ minHeight: '100vh', backgroundColor: 'white', fontSize: "12px" }}>
                                            <div className="container-fluid m-0">
                                                {/* -----First Page---- */}
                                                <div className='d-flex justify-content-between align-items-start mt-3'>
                                                    <h5 className="">NCIC Missing Person File <br />
                                                        Data Collection Entry Guide</h5>
                                                    <label className="d-flex align-items-center">
                                                        <h5 className='label-nowrap'>Agency Case #</h5>
                                                        <input
                                                            type="text"
                                                            className="form-input flex-fill"
                                                            value={useOfForce?.useOfForce?.shift}
                                                            onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                            style={{
                                                                color: '#333333',
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <div className="position-relative mb-4 form-section border no-break">
                                                    <div className='d-flex justify-content-center fs-4'> <h5 className="">NCIC Initial Entry Report</h5></div>

                                                    <div className='col-12  d-flex border border-left-0 border-right-0'>
                                                        <div className='col-6 d-flex flex-column border-right'>
                                                            <div>
                                                                <span>Message Key (MKE) (See Categories, page 2)</span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-4">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toEffectArrest}
                                                                                onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                                                                            />
                                                                            <span>Disability (EMD)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span> Juvenile (EMJ)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span>Endangered (EME)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-5">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendOfficer}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendOfficer', e.target.checked)}
                                                                            />
                                                                            <span>Catastrophe Victim (EMV )
                                                                            </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendPerson}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendPerson', e.target.checked)}
                                                                            />
                                                                            <span>Involuntary (EMI) </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendPerson}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendPerson', e.target.checked)}
                                                                            />
                                                                            <span>Caution</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toPreventOffense}
                                                                                onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                                                                            />
                                                                            <span>Other (EMO)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-6 d-flex flex-column justify-content-start " style={{ padding: '0' }}>
                                                            <div className="col-6 d-flex align-items-center">
                                                                <span className="me-1 label-nowrap">Date:</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>

                                                            <div className="border-top"></div>
                                                            <div className="col-6 d-flex align-items-center">
                                                                <span className="me-1 label-nowrap">Reporting Agency (ORI):</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                            {/* </div> */}
                                                        </div>
                                                    </div>

                                                    <div className='col-12 d-flex  border-left-0 border-right-0'>
                                                        <div className="col-6 border-right">

                                                            <div className="col-6 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Name of Missing Person (NAM)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 d-flex align-items-center">
                                                            <div className="d-flex flex-column mr-5">
                                                                <label className="d-flex align-items-center">
                                                                    <span>Sex (SEX)</span>
                                                                </label>
                                                            </div>
                                                            <div className="d-flex flex-row">
                                                                <label className="d-flex align-items-center mr-4">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-checkbox me-2"
                                                                        checked={formData?.reasonForce?.toPreventOffense}
                                                                        onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                                                                    />
                                                                    <span>Male (M)</span>
                                                                </label>
                                                                <label className="d-flex align-items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="form-checkbox me-2"
                                                                        checked={formData?.reasonForce?.toPreventOffense}
                                                                        onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                                                                    />
                                                                    <span>Female (F)</span>
                                                                </label>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className='col-12 d-flex border border-left-0 border-right-0'>
                                                        <div className="col-12">
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Aliases</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12  d-flex  border-left-0 border-right-0'>
                                                        <div className='col-6 d-flex flex-column border-right'>
                                                            <div className="row mt-2">
                                                                <div className="row col-12">
                                                                    <span>Race (RAC)</span>
                                                                    <div className="d-flex flex-column gap-1 ml-2">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toEffectArrest}
                                                                                onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                                                                            />
                                                                            <span> Asian or Pacific Islander (A)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span>American Indian/Alaskan Native (I) </span>
                                                                        </label>
                                                                        <div className="d-flex flex-row ">
                                                                            <label className="d-flex align-items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.reasonForce?.toDefendSelf}
                                                                                    onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                                />
                                                                                <span>Black (B)</span>
                                                                            </label>
                                                                            <label className="d-flex align-items-center ml-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.reasonForce?.toDefendOfficer}
                                                                                    onChange={(e) => handleInputChange('reasonForce.toDefendOfficer', e.target.checked)}
                                                                                />
                                                                                <span>White ( W )
                                                                                </span>
                                                                            </label>
                                                                            <label className="d-flex align-items-center ml-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.reasonForce?.toPreventOffense}
                                                                                    onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                                                                                />
                                                                                <span>Unknown (U) </span>
                                                                            </label>
                                                                        </div>


                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>
                                                        <div className="col-3 border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Place of Birth (POB)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Date of Birth (DOB)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12  d-flex border border-left-0 border-right-0'>

                                                        <div className="col-2" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Date of Emancipation (DOE) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-2 border-left border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Height (HGT ) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-2" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Weight ( WGT )</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-6 d-flex flex-column border-left'>
                                                            <div>
                                                                <span>Eye Color (EYE) </span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-4">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toEffectArrest}
                                                                                onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                                                                            />
                                                                            <span>Black (BLK)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span>Blue (BLU)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span> Brown (BRO)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendOfficer}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendOfficer', e.target.checked)}
                                                                            />
                                                                            <span>Gray (GRY )
                                                                            </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendPerson}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendPerson', e.target.checked)}
                                                                            />
                                                                            <span>Green (GRN) </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendPerson}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendPerson', e.target.checked)}
                                                                            />
                                                                            <span>Hazel (HAZ)
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-5">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toPreventOffense}
                                                                                onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                                                                            />
                                                                            <span>Maroon (MAR)
                                                                            </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toPreventOffense}
                                                                                onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                                                                            />
                                                                            <span> Pink (PNK)
                                                                            </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toPreventOffense}
                                                                                onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                                                                            />
                                                                            <span>Unknown (XXX)
                                                                            </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toPreventOffense}
                                                                                onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                                                                            />
                                                                            <span>Multicolored (MUL)
                                                                            </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex  border-left-0 border-right-0">
                                                        <div className="col-8 d-flex flex-column">
                                                            <div>
                                                                <span>Hair Color (HAI)</span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-4">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.brown}
                                                                                onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                            />
                                                                            <span>Brown (BRO)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.black}
                                                                                onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                            />
                                                                            <span>Black (BLK)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.blonde}
                                                                                onChange={(e) => handleInputChange('hairColor.blonde', e.target.checked)}
                                                                            />
                                                                            <span>Blond/Strawberry (BLD)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.sandy}
                                                                                onChange={(e) => handleInputChange('hairColor.sandy', e.target.checked)}
                                                                            />
                                                                            <span>Sandy (SDY)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.gray}
                                                                                onChange={(e) => handleInputChange('hairColor.gray', e.target.checked)}
                                                                            />
                                                                            <span>Gray or Partially Gray (GRY)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.red}
                                                                                onChange={(e) => handleInputChange('hairColor.red', e.target.checked)}
                                                                            />
                                                                            <span>Red/Auburn (RED)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.blondStrawberry}
                                                                                onChange={(e) => handleInputChange('hairColor.blondStrawberry', e.target.checked)}
                                                                            />
                                                                            <span>Blond/Strawberry (BLD)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.unknown}
                                                                                onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                            />
                                                                            <span>Unknown (XXX)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col-2 d-flex flex-column border-left border-right'>
                                                            <div className="row mt-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <span> Ethnicity (ETN)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toEffectArrest}
                                                                                onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                                                                            />
                                                                            <span> Hispanic or Latino (H)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span> Not Hispanic or Not Latino (N)</span>
                                                                        </label>

                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <div className='col-2 d-flex flex-column'>
                                                            <div className="row mt-2">
                                                                <div className="col-12 d-flex flex-column">
                                                                    <span className="me-1 label-nowrap">FBI Number (FBI) </span>
                                                                    <input
                                                                        type="text"
                                                                        className="form-input flex-fill"
                                                                        value={useOfForce?.useOfForce?.shift}
                                                                        onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                        style={{
                                                                            color: '#333333',
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12  d-flex border border-left-0 border-right-0'>
                                                        <div className="col-8 border-right" style={{ padding: '0' }}>
                                                            <div className='col-12  d-flex  flex-column' style={{ padding: '0' }}>

                                                                <div className="col-12 d-flex flex-column " >
                                                                    <div>
                                                                        <span>Skin Tone (SKN)</span>
                                                                    </div>
                                                                    <div className="row mt-2">
                                                                        <div className="col-3">
                                                                            <div className="d-flex flex-column gap-1">
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.brown}
                                                                                        onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                    />
                                                                                    <span>Albino (ALB)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.black}
                                                                                        onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                                    />
                                                                                    <span>Black (BLK)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.blonde}
                                                                                        onChange={(e) => handleInputChange('hairColor.blonde', e.target.checked)}
                                                                                    />
                                                                                    <span>Dark (DRK)</span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="d-flex flex-column gap-1">
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.sandy}
                                                                                        onChange={(e) => handleInputChange('hairColor.sandy', e.target.checked)}
                                                                                    />
                                                                                    <span>Yellow ( YEL)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.gray}
                                                                                        onChange={(e) => handleInputChange('hairColor.gray', e.target.checked)}
                                                                                    />
                                                                                    <span> Dk. Brown (DBR)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.red}
                                                                                        onChange={(e) => handleInputChange('hairColor.red', e.target.checked)}
                                                                                    />
                                                                                    <span> Fair (FAR)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.red}
                                                                                        onChange={(e) => handleInputChange('hairColor.red', e.target.checked)}
                                                                                    />
                                                                                    <span>Light (LGT ) </span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="d-flex flex-column gap-1">
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.blondStrawberry}
                                                                                        onChange={(e) => handleInputChange('hairColor.blondStrawberry', e.target.checked)}
                                                                                    />
                                                                                    <span>Lt. Brown (LBR)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.unknown}
                                                                                        onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                                    />
                                                                                    <span>Medium (MED)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.unknown}
                                                                                        onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                                    />
                                                                                    <span> Medium Brown (MBR)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.unknown}
                                                                                        onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                                    />
                                                                                    <span> Olive (OLV ) </span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <div className="d-flex flex-column gap-1">
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.blondStrawberry}
                                                                                        onChange={(e) => handleInputChange('hairColor.blondStrawberry', e.target.checked)}
                                                                                    />
                                                                                    <span>Ruddy (RUD)</span>
                                                                                </label>
                                                                                <label className="d-flex align-items-center">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="form-checkbox me-2"
                                                                                        checked={formData?.hairColor?.unknown}
                                                                                        onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                                    />
                                                                                    <span>Sallow (SAL)</span>
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='col-12 row border-top border-bottom' >
                                                                    <div className='col-6 d-flex flex-column  border-right'>
                                                                        <div className="row mt-2">
                                                                            <div className="col-12">
                                                                                <div className="d-flex flex-column gap-1">
                                                                                    <label className="d-flex align-items-center">
                                                                                        <span>Has the missing person ever been finger printed?</span>
                                                                                    </label>
                                                                                    <label className="d-flex align-items-center">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="form-checkbox me-2"
                                                                                            checked={formData?.reasonForce?.toEffectArrest}
                                                                                            onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                                                                                        />
                                                                                        <span>No</span>
                                                                                    </label>
                                                                                    <label className="d-flex align-items-center">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="form-checkbox me-2"
                                                                                            checked={formData?.reasonForce?.toDefendSelf}
                                                                                            onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                                        />
                                                                                        <span className="label-nowrap">Yes, by whom?</span>
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-input flex-fill"
                                                                                            value={useOfForce?.useOfForce?.shift}
                                                                                            onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                                            style={{
                                                                                                color: '#333333',
                                                                                            }}
                                                                                        />
                                                                                    </label>

                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    <div className='col-6 d-flex flex-column'>
                                                                        <div className="row mt-2">
                                                                            <div className="col-12 d-flex flex-column">
                                                                                <span className="me-1 label-nowrap">Other Identifying Numbers (MNU)</span>
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-input flex-fill"
                                                                                    value={useOfForce?.useOfForce?.shift}
                                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                                    style={{
                                                                                        color: '#333333',
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 d-flex flex-column" >
                                                                    <div>
                                                                        <span>Fingerprint Classifi cation (FPC)*</span>
                                                                    </div>
                                                                    <div className="row mt-2">
                                                                        <div className="col-12">
                                                                            <div className="d-flex mb-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                            </div>
                                                                            <div className="d-flex mb-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.brown}
                                                                                    onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Scars, Marks, Tattoos, and Other Characteristics (SMT ) (See Checklist, page 8)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12  d-flex border-left-0 border-right-0'>
                                                        <div className="col-3" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Social Security Number (SOC) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3 border-left border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Operator’s License Number (OLN) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3 border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Operator’s License State (OLS) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">License Expiration (OLY ) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12  d-flex border border-left-0 border-right-0'>
                                                        <div className='col-5 d-flex flex-column border-right'>
                                                            <div>
                                                                <span>Missing Person (MNP) </span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-6">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toEffectArrest}
                                                                                onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                                                                            />
                                                                            <span> Missing Person (MP)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span>Child Abduction (CA)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendOfficer}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendOfficer', e.target.checked)}
                                                                            />
                                                                            <span>Catastrophe Victim (DV)
                                                                            </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendPerson}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendPerson', e.target.checked)}
                                                                            />
                                                                            <span> AMBER Alert (AA) </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-3  border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Date of Last Contact (DLC) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-4" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Originating Agency Case Number
                                                                    (OCA)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12  d-flex border-left-0 border-right-0'>
                                                        <div className="col-8" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-wrap">Miscellaneous (MIS) Information such as build, handedness, any illness or diseases, clothing description, hair description, should be included. If more space is needed, attach additional sheet.**</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='col-4 d-flex flex-column border-left'>
                                                            <div>
                                                                <span>Missing Person Circumstances (MPC)</span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toEffectArrest}
                                                                                onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                                                                            />
                                                                            <span> Abducted By Stranger (S)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span>Runaway (R)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span>Abducted By Non-custodial
                                                                                Parent (N)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12  d-flex border border-left-0 border-right-0'>
                                                        <div className="col-3" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">License Plate Number (LIC) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3 border-left border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">State (LIS)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3  border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Year Expires (LIY )</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">License Plate Type (LIT ) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='col-12  d-flex border-left-0 border-right-0'>
                                                        <div className="col-8" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Vehicle Identification Number ( VIN)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 border-left" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Year ( VYR)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className='col-12  d-flex border border-left-0 border-right-0 border-bottom-0'>
                                                        <div className="col-3" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Make ( VMA)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3 border-left border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Model ( VMO)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3 border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Style ( VST ) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Color (VCO)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div>
                                                    Rev 04/13 * Fingerprints, if available, may be submitted electronically via the CJIS Wide Area Network or in hard copy to the FBI, CJIS Division,
                                                    Post Office Box 4142, Clarksburg, West Virginia 26302-9929.
                                                    ** All dental information should be recorded on the NCIC Missing Person Dental Report and entered into NCIC as supplemental information.
                                                </div>



                                                {/* -----Second Page---- */}
                                                <div className='d-flex justify-content-between align-items-start mt-5'>
                                                    <h5 className="">NCIC Missing Person File <br />
                                                        Data Collection Entry Guide</h5>
                                                    <label className="d-flex align-items-center">
                                                        <h5 className='label-nowrap'>Agency Case #</h5>
                                                        <input
                                                            type="text"
                                                            className="form-input flex-fill"
                                                            value={useOfForce?.useOfForce?.shift}
                                                            onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                            style={{
                                                                color: '#333333',
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                                <div className="position-relative mb-4 form-section no-break border">

                                                    <div className='col-12  d-flex  '>
                                                        <div className='col-12 d-flex flex-column'>
                                                            <div>
                                                                <span>Caution and Medical Conditions (CMC)</span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-4">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <span>Code</span>  <span className='ml-2'>Descriptions</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>00</span>  <span className='ml-4'>Armed and dangerous</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>05</span> <span className='ml-4'>Violent tendencies</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>10</span>   <span className='ml-4'>Martial arts expert</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>15</span>   <span className='ml-4'>Explosives expertise</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>20</span>   <span className='ml-4'>Known to abuse drugs</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>25</span>  <span className='ml-4'>Escape risk</span>
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                <div className="col-4">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <span>Code</span>  <span className='ml-2'>Description</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>30 </span>  <span className='ml-4'>Sexually violent predator - contact
                                                                                ORI for detailed information </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>40 </span>   <span className='ml-4'>International Flight Risk</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>50 </span>     <span className='ml-4'>Heart condition </span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>55 </span>     <span className='ml-4'>Alcoholic</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>60 </span>  <span className='ml-4'>Allergies</span>
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                <div className="col-4">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <span>Code</span>  <span className='ml-2'>Description</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>65 </span> <span className='ml-4'>Epilepsy</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>70 </span> <span className='ml-4'>Suicidal</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>80 </span> <span className='ml-4'>Medication required</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>85 </span>   <span className='ml-4'>Hemophiliac</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>90 </span> <span className='ml-4'>Diabetic</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <span>01 </span>    <span className='ml-4'>Other</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex border border-left-0 border-right-0">
                                                        <div className='col-2 d-flex flex-column border-right'>
                                                            <div className="row mt-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <span> Has the missing person ever donated blood? (MIS)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toEffectArrest}
                                                                                onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                                                                            />
                                                                            <span> Yes</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.reasonForce?.toDefendSelf}
                                                                                onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                                                                            />
                                                                            <span>No</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-10 d-flex flex-column">
                                                            <div>
                                                                <span>Blood Type (BLT)</span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-3">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.brown}
                                                                                onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                            />
                                                                            <span>A Positive (APOS)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.black}
                                                                                onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                            />
                                                                            <span>A Negative (ANEG)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.blonde}
                                                                                onChange={(e) => handleInputChange('hairColor.blonde', e.target.checked)}
                                                                            />
                                                                            <span>A Unknown (AUNK)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3">
                                                                    <div className="d-flex flex-column gap-1">
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.sandy}
                                                                                onChange={(e) => handleInputChange('hairColor.sandy', e.target.checked)}
                                                                            />
                                                                            <span>B Positive (BPOS)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.gray}
                                                                                onChange={(e) => handleInputChange('hairColor.gray', e.target.checked)}
                                                                            />
                                                                            <span>B Negative (BNEG)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.red}
                                                                                onChange={(e) => handleInputChange('hairColor.red', e.target.checked)}
                                                                            />
                                                                            <span>B Unknown (BUNK) </span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-6 row">
                                                                    <div className="col-5">
                                                                        <div className="d-flex flex-column gap-1">
                                                                            <label className="d-flex align-items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.blondStrawberry}
                                                                                    onChange={(e) => handleInputChange('hairColor.blondStrawberry', e.target.checked)}
                                                                                />
                                                                                <span>AB Positive (ABPOS)</span>
                                                                            </label>
                                                                            <label className="d-flex align-items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.unknown}
                                                                                    onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                                />
                                                                                <span> AB Negative (ABNEG)</span>
                                                                            </label>
                                                                            <label className="d-flex align-items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.unknown}
                                                                                    onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                                />
                                                                                <span>AB Unknown (ABUNK)</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-5">
                                                                        <div className="d-flex flex-column gap-1">
                                                                            <label className="d-flex align-items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.blondStrawberry}
                                                                                    onChange={(e) => handleInputChange('hairColor.blondStrawberry', e.target.checked)}
                                                                                />
                                                                                <span>O Positive (OPOS)</span>
                                                                            </label>
                                                                            <label className="d-flex align-items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.unknown}
                                                                                    onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                                />
                                                                                <span>O Negative (ONEG)</span>
                                                                            </label>
                                                                            <label className="d-flex align-items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.unknown}
                                                                                    onChange={(e) => handleInputChange('hairColor.unknown', e.target.checked)}
                                                                                />
                                                                                <span>O Unknown (OUNK)</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <div className="d-flex flex-column gap-1">
                                                                            <label className="d-flex align-items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    className="form-checkbox me-2"
                                                                                    checked={formData?.hairColor?.blondStrawberry}
                                                                                    onChange={(e) => handleInputChange('hairColor.blondStrawberry', e.target.checked)}
                                                                                />
                                                                                <span>Unknown (UNKWN)</span>
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex ">
                                                        <div className="col-4 d-flex flex-column">
                                                            <div>
                                                                <span>Circumcision?
                                                                    (CRC)</span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex" style={{ gap: "12px" }}>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.brown}
                                                                                onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                            />
                                                                            <span>Was (C)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.black}
                                                                                onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                            />
                                                                            <span>Was Not (N)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.blonde}
                                                                                onChange={(e) => handleInputChange('hairColor.blonde', e.target.checked)}
                                                                            />
                                                                            <span>Unknown (U)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="col-4 d-flex flex-column border-left border-right">
                                                            <div>
                                                                <span>Footprints available?
                                                                    (FPA)</span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex" style={{ gap: "12px" }}>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.brown}
                                                                                onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                            />
                                                                            <span>Yes (Y)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.black}
                                                                                onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                            />
                                                                            <span>No (N)</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-4 d-flex flex-column">
                                                            <div>
                                                                <span>Body X-Rays? (BXR)</span>
                                                            </div>
                                                            <div className="row mt-2">
                                                                <div className="col-12">
                                                                    <div className="d-flex" style={{ gap: "12px" }}>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.brown}
                                                                                onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                            />
                                                                            <span>Full (F)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.black}
                                                                                onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                            />
                                                                            <span>Partial (P)</span>
                                                                        </label>
                                                                        <label className="d-flex align-items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                className="form-checkbox me-2"
                                                                                checked={formData?.hairColor?.black}
                                                                                onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                            />
                                                                            <span>None (N)</span>
                                                                        </label>

                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex border border-left-0 border-right-0">
                                                        <div className="col-6 d-flex flex-column">
                                                            <div>
                                                                <span>Does the missing person have corrected vision? (SMT )</span>
                                                            </div>
                                                            <div className="d-flex mt-2">
                                                                <div className="col-4">
                                                                    <label className="d-flex align-items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox me-2"
                                                                            checked={formData?.hairColor?.brown}
                                                                            onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                        />
                                                                        <span>Yes</span>
                                                                    </label>
                                                                    <label className="d-flex align-items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox me-2"
                                                                            checked={formData?.hairColor?.black}
                                                                            onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                        />
                                                                        <span>No</span>
                                                                    </label>
                                                                </div>
                                                                <div className="col-8">
                                                                    <label className="d-flex align-items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox me-2"
                                                                            checked={formData?.hairColor?.blonde}
                                                                            onChange={(e) => handleInputChange('hairColor.blonde', e.target.checked)}
                                                                        />
                                                                        <span>Glasses</span>
                                                                    </label>
                                                                    <label className="d-flex align-items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox me-2"
                                                                            checked={formData?.hairColor?.blonde}
                                                                            onChange={(e) => handleInputChange('hairColor.blonde', e.target.checked)}
                                                                        />
                                                                        <span>Con Lenses</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 border-left" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Corrective Vision Prescription(VRX)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex ">
                                                        <div className="col-6" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Jewelry Type (JWT ) (See Checklist, page 20)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 border-left" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Jewelry Description (JWL) (See Checklist, page 20</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex border border-left-0 border-right-0">
                                                        <div className="col-4 d-flex flex-column">
                                                            <div>
                                                                <span>DNA Profile Indicator (DNA) </span>
                                                            </div>
                                                            <div className="col-12">
                                                                <div className="d-flex row mt-2" style={{ gap: "10px" }}>
                                                                    <label className="d-flex align-items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox me-2"
                                                                            checked={formData?.hairColor?.brown}
                                                                            onChange={(e) => handleInputChange('hairColor.brown', e.target.checked)}
                                                                        />
                                                                        <span>Yes (Y)</span>
                                                                    </label>
                                                                    <label className="d-flex align-items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-checkbox me-2"
                                                                            checked={formData?.hairColor?.black}
                                                                            onChange={(e) => handleInputChange('hairColor.black', e.target.checked)}
                                                                        />
                                                                        <span>No (N)</span>
                                                                    </label>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-8 border-left" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">DNA Location (DLO)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>


                                                    </div>

                                                    <div className="col-12 d-flex ">
                                                        <div className="col-12" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Complainant’s Name </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 d-flex border border-left-0 border-right-0">
                                                        <div className="col-8" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Complainant’s Address</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 border-left" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Complainant’s Telephone Number </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex ">
                                                        <div className="col-6" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Relationship of Complainant to Missing Person </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-6 border-left" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Missing Person’s Occupation (MIS) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex border border-left-0 border-right-0">
                                                        <div className="col-12" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Missing Person’s Address </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex ">
                                                        <div className="col-12" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Close friends/relatives</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex border border-left-0 border-right-0">
                                                        <div className="col-12" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Places Missing Person Frequented (MIS) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex ">
                                                        <div className="col-12" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Possible destination (MIS) </span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex border border-left-0 border-right-0">
                                                        <div className="col-4" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Reporting Officer</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-4 border-left border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Reporting Agency Telephone Number</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-4" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-wrap">Investigating Officer and Telephone Number (MIS)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12 d-flex ">
                                                        <div className="col-5" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Complainant’s Signature</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3 border-left border-right" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">Date</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-4" style={{ padding: '0' }}>
                                                            <div className="col-12 d-flex flex-column align-items-start">
                                                                <span className="me-1 label-nowrap">NCIC Number (NIC)</span>
                                                                <input
                                                                    type="text"
                                                                    className="form-input flex-fill"
                                                                    value={useOfForce?.useOfForce?.shift}
                                                                    onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                                                                    style={{
                                                                        color: '#333333',
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* use of force form end */}
                                    </div>
                                </div>
                            </div>
                        {/* end */}



                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default MissingPersonForm
