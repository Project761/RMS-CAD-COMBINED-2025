import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component';
import { base64ToString, Decrypt_Id_Name, getShowingWithOutTime, tableCustomStyles } from '../../../../Common/Utility'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data, getData_DropDown_ModeOfTraining, getData_DropDown_TrainingCategory, getData_DropDown_TrainingCourse } from '../../../../../redux/actions/DropDownsData';
import Location from '../../../../../CADComponents/Common/Location';
import useObjState from '../../../../../CADHook/useObjState';
import GeoServices from "../../../../../CADServices/APIs/geo";
import CallTakerServices from "../../../../../CADServices/APIs/callTaker";
import { dropDownDataModelForAptNo, isEmpty } from '../../../../../CADUtils/functions/common';
import { useQuery } from 'react-query';
import TrainingStatusModal from '../TrainingStatusModal';
import ModalConfirm from '../../../../../CADComponents/Common/ModalConfirm';

const Training = ({ aId }) => {
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [trainingData, setTrainingData] = useState([])
    const [groupList, setGroupList] = useState([]);
    const [personnelList, setPersonnelList] = useState([]);
    const [assignTrainingData, setAssignTrainingData] = useState([])
    const [AssignTrainingID, setAssignTrainingID] = useState();
    const [pinID, setPinID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState("");
    const TrainingModeOfDrpData = useSelector((state) => state.DropDown.TrainingModeOfDrpData);
    const TrainingCourseDrpData = useSelector((state) => state.DropDown.TrainingCourseDrpData);
    const [isChange, setIsChange] = useState(false);
    const [openTrainingStatusModal, setOpenTrainingStatusModal] = useState(false);
    const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
    const [defaultAptSuite, setDefaultAptSuite] = useState(null);
    const [aptInputValue, setAptInputValue] = useState("");
    const [locationStatus, setLocationStatus] = useState(false);
    const [locationData, setLocationData] = useState();
    const [isSelectLocation, setIsSelectLocation] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const TrainingCategoryDrpData = [
        {
            "value": 1,
            "label": "CJIS"
        },
        {
            "value": 2,
            "label": "Non CJIS"
        },
    ]

    const [
        trainingState,
        setTrainingState,
        handleTrainingState,
        clearTrainingState,
    ] = useObjState({
        AssignTrainingID: "",
        trainingCategory: "",
        trainingCourse: "",
        modeOfTraining: "",
        trainingStartDate: "",
        completedTrainingBy: "",
        trainingValidTill: "",
        assignBy: "Group",
        selectedGroupIndividual: [],
        personnel: [],
        location: "",
        apt: "",
        intersection1: "",
        intersection2: "",
        City: "",
        commonPlaceName: "",
        ZipCode: "",
        Id: "",
    });

    const [
        errorTrainingState,
        _setErrorTrainingState,
        handleErrorTrainingState,
        clearErrorTrainingState,
    ] = useObjState({
        trainingCategory: false,
        trainingCourse: false,
        modeOfTraining: false,
        trainingStartDate: false,
        completedTrainingBy: false,
        trainingValidTill: false,
        location: false,
        selectedGroupIndividual: false,
        apt: false,
    });

    const columns = [
        {
            name: <p className='text-center' style={{ position: 'absolute', top: '7px' }} >View</p>,
            center: true,
            selector: (row) => {
                return (
                    <>
                        <span
                            className="btn btn-sm text-white p-1 py-0"
                            style={{ background: "#ddd", cursor: "pointer" }}
                        >
                            <button
                                className="d-flex justify-content-end btn btn-sm px-1 py-0"
                                data-toggle="modal"
                                data-target="#TrainingStatusModal"
                                onClick={() => {
                                    setAssignTrainingID(row.AssignTrainingID);
                                    setOpenTrainingStatusModal(true);

                                }}
                            >
                                <i className="fa fa-eye"></i>
                            </button>
                        </span>
                    </>
                )
            },
            sortable: true,
            width: "80px",
        },
        {
            name: 'Training Category',
            selector: (row) => row.TrainingCategoryName,
            sortable: true
        },
        {
            name: 'Training Course',
            selector: (row) => row.TrainingCourseName,
            sortable: true
        },
        {
            name: 'Training Start Date',
            selector: (row) => row.TrainingStartDate ? getShowingWithOutTime(row.TrainingStartDate) : "",
            sortable: true
        },
        {
            name: 'Completed Training By',
            selector: (row) => row.CompletedTrainingBy ? getShowingWithOutTime(row.CompletedTrainingBy) : "",
            sortable: true
        },
        {
            name: 'Training Valid Till',
            selector: (row) => row.TrainingValidTill ? getShowingWithOutTime(row.TrainingValidTill) : "",
            sortable: true
        },
        {
            name: 'Status',
            sortable: true,
            center: true,
            width: "200px",
            selector: (row) => {
                let bgColor = "";

                if (row?.TrainingStatus === "Training Initiated") {
                    bgColor = "#29cf3d";
                } else if (row?.TrainingStatus === "Future Training") {
                    bgColor = "#39a3d3";
                } else {
                    bgColor = "#6c757d";
                }

                return (
                    <>
                        {row?.TrainingStatus && <button
                            className="btn btn-sm p-1 py-0 "
                            style={{
                                background: bgColor,
                                color: "black",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                gap: '5px',
                                width: '120px',
                                fontSize: '14px'
                            }}
                        >
                            {row?.TrainingStatus}
                        </button>}
                    </>
                );
            },
        },

    ]

    const useQueryLocation = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQueryLocation();
    var aId = query?.get("Aid");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (assignTrainingData?.AssignTrainingID) {
            setTrainingState({
                AssignTrainingID: assignTrainingData?.AssignTrainingID,
                trainingCategory: assignTrainingData?.TrainingCategoryID,
                trainingCourse: assignTrainingData?.TrainingCourseID,
                modeOfTraining: assignTrainingData?.ModeOfTrainingID,
                trainingStartDate: assignTrainingData?.TrainingStartDate ? new Date(assignTrainingData?.TrainingStartDate) : "",
                completedTrainingBy: assignTrainingData?.CompletedTrainingBy ? new Date(assignTrainingData?.CompletedTrainingBy) : "",
                trainingValidTill: assignTrainingData?.TrainingValidTill ? new Date(assignTrainingData?.TrainingValidTill) : "",
                assignBy: assignTrainingData?.AssignBy,
                selectedGroupIndividual: assignTrainingData?.AssignBy,
                personnel: assignTrainingData?.assignBy,
                location: assignTrainingData?.Location,
                apt: assignTrainingData?.ApartmentNo,
                Id: assignTrainingData?.Id,
            });
        }
    }, [assignTrainingData])

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            // old code ->   A005
            dispatch(get_ScreenPermissions_Data("A139", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, 0))
            dispatch(getData_DropDown_ModeOfTraining(localStoreData?.AgencyID))
            dispatch(getData_DropDown_TrainingCourse(localStoreData?.AgencyID))
            dispatch(getData_DropDown_TrainingCategory(localStoreData?.AgencyID))
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    // location start
    const aptSuiteNoPayload = {
        GeoLocationID: trainingState?.Id
    };

    const aptSuiteNoKey = `/CAD/GeoLocation/Get_GeoLocationApartmentNo`;
    const { data: aptSuiteNoData, isSuccess: isFetchAptSuiteNoData, refetch: refetchAptSuiteNoData } = useQuery(
        [
            aptSuiteNoKey,
            {
                aptSuiteNoPayload,
            },
        ],
        CallTakerServices.getAptSuiteNo,
        {
            refetchOnWindowFocus: false,
            enabled: !!trainingState?.Id
        }
    );

    useEffect(() => {
        if (isFetchAptSuiteNoData && aptSuiteNoData?.data?.data) {
            const parsedData = JSON.parse(aptSuiteNoData.data.data || "{}");
            if (parsedData?.Table?.length) {
                const filteredOptions = parsedData.Table.filter((item) => item.Description !== null);

                setAptSuiteNoDropDown(
                    dropDownDataModelForAptNo(filteredOptions, "Description", "Description", "AptID")
                );

                const defaultOption = parsedData.Table.find(
                    (item) => item.Description === null && item.AptID
                );

                if (defaultOption) {
                    const defaultValue = {
                        value: "",
                        label: "",
                        aptId: defaultOption.AptID,
                    };

                    setDefaultAptSuite(defaultValue);

                    if (!trainingState?.apt || Object.keys(trainingState?.apt).length === 0) {
                        handleTrainingState("apt", defaultValue);
                    }
                }
            } else {
                setAptSuiteNoDropDown([]);
                setDefaultAptSuite({});
                setAptInputValue("");
            }
        } else {
            setAptSuiteNoDropDown([]);
            setDefaultAptSuite({})
            setAptInputValue("")
        }
    }, [isFetchAptSuiteNoData, aptSuiteNoData, trainingState?.Id, trainingState?.location]);

    useEffect(() => {
        if (!trainingState?.location) {
            setTrainingState((prevState) => ({
                ...prevState,
                Id: "",
                apt: {}
            }));
        }

        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: trainingState?.location,
                    AgencyID: loginAgencyID
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
            }
        };

        if (trainingState?.location) {
            fetchLocationData();
        }
    }, [trainingState?.location, isSelectLocation]);


    useEffect(() => {
        if (aId || pinID) {
            getAssignTraining(aId);
            get_Group_List(aId);
            get_Personnel_Lists(aId, pinID);
        }
    }, [aId, pinID])


    const getAssignTraining = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('CAD/AssignTraining/GetAssignTraining', value).then(res => {
            if (res) {
                setTrainingData(res)
            } else {
                setTrainingData([])
            }
        })
    }

    const get_Group_List = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(res)
            } else setGroupList()
        })
    }

    const get_Personnel_Lists = (id, PINID) => {
        const val = { 'AgencyID': id, 'PINID': PINID }
        fetchPostData('Personnel/GetData_Personnel', val)
            .then((res) => {
                if (res) { setPersonnelList(res); }
                else { setPersonnelList([]); }
            })
    }

    const handleSelection = (groupId, isChecked) => {
        setTrainingState(prev => ({
            ...prev,
            selectedGroupIndividual: isChecked
                ? [...prev.selectedGroupIndividual, groupId]
                : prev.selectedGroupIndividual.filter(id => id !== groupId),
        }));
        setIsChange(true);
    };

    const set_Edit_Value = (row) => {
        setAssignTrainingID(row.AssignTrainingID);
        setAssignTrainingData(row);
    }

    const validateCFSCodeForm = () => {
        let isError = false;
        const keys = Object.keys(errorTrainingState);
        keys.map((field) => {
            if (field === "trainingCategory" && isEmpty(trainingState[field])) {
                handleErrorTrainingState(field, true);
                isError = true;
            } else if (field === "trainingCourse" && isEmpty(trainingState[field])) {
                handleErrorTrainingState(field, true);
                isError = true;
            } else if (field === "modeOfTraining" && isEmpty(trainingState[field])) {
                handleErrorTrainingState(field, true);
                isError = true;
            } else if (field === "trainingStartDate" && isEmpty(trainingState[field])) {
                handleErrorTrainingState(field, true);
                isError = true;
            } else if (field === "completedTrainingBy" && isEmpty(trainingState[field])) {
                handleErrorTrainingState(field, true);
                isError = true;
            } else if (field === "trainingValidTill" && isEmpty(trainingState[field])) {
                handleErrorTrainingState(field, true);
                isError = true;
            } else if (field === "location" && isEmpty(trainingState[field])) {
                handleErrorTrainingState(field, true);
                isError = true;
            } else if (field === "selectedGroupIndividual" && trainingState[field]?.length === 0) {
                handleErrorTrainingState(field, true);
                isError = true;
            } else {
                handleErrorTrainingState(field, false);
            }
        });
        return !isError;
    };

    const onSave = async () => {
        if (!validateCFSCodeForm()) { setShowConfirmModal(false); return }
        const isUpdate = !!trainingState?.AssignTrainingID;

        const payload = {
            AssignTrainingID: isUpdate ? trainingState?.AssignTrainingID : "",
            TrainingCategoryID: trainingState?.trainingCategory,
            TrainingCourseID: trainingState?.trainingCourse,
            ModeOfTrainingID: trainingState?.modeOfTraining,
            TrainingStartDate: trainingState?.trainingStartDate ? getShowingWithOutTime(trainingState?.trainingStartDate) : null,
            CompletedTrainingBy: trainingState?.completedTrainingBy ? getShowingWithOutTime(trainingState?.completedTrainingBy) : null,
            TrainingValidTill: trainingState?.trainingValidTill ? getShowingWithOutTime(trainingState?.trainingValidTill) : null,
            Location: trainingState?.location,
            ApartmentNo: trainingState?.apt?.label,
            AssignBy: trainingState?.assignBy,
            AssignGroupID: "",
            GroupIDs: trainingState?.assignBy === "Group" ? trainingState?.selectedGroupIndividual?.join(",") || "" : "",
            PINIDs: trainingState?.assignBy === "Individual" ? trainingState?.selectedGroupIndividual?.join(",") || "" : "",
            CreatedByUserFK: isUpdate ? "" : pinID,
            AgencyID: aId,
        };

        AddDeleteUpadate('CAD/AssignTraining/UpsertAssignTraining', payload)
            .then(res => {
                if (res.success) {
                    toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
                    getAssignTraining(aId);
                    handelCancel();
                } else {
                    toastifyError(res.data.Message)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        setShowConfirmModal(false);
    };

    function handelCancel() {
        clearErrorTrainingState()
        clearTrainingState();
        setIsChange(false);
        setAssignTrainingID()
    }

    const conditionalRowStyles = [
        {
            when: row => row?.AssignTrainingID === AssignTrainingID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const customStylesWithOutColorArrow = {
        control: base => ({
            ...base,

            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            transition: "all .2s ease",
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
        }),
        input: (provided) => ({
            ...provided,
            minWidth: '0px',
            maxWidth: '100%',
        }),
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            <div className="col-12">
                <div className="row pt-1 ">
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Training Category{errorTrainingState.trainingCategory && isEmpty(trainingState?.trainingCategory) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Training Category"}</p>
                        )}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <Select
                            styles={colourStyles}
                            placeholder="Select"
                            isClearable
                            options={TrainingCategoryDrpData}
                            value={trainingState?.trainingCategory ? TrainingCategoryDrpData?.find((i) => i?.value === trainingState?.trainingCategory) : ""}
                            onChange={(e) => {
                                handleTrainingState("trainingCategory", e?.value);
                                setIsChange(true);
                            }}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>
                            Training Course{errorTrainingState.trainingCourse && isEmpty(trainingState?.trainingCourse) && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Training Course"}</p>
                            )}
                        </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <Select
                            styles={colourStyles}
                            placeholder="Select"
                            isClearable
                            options={TrainingCourseDrpData}
                            value={trainingState?.trainingCourse ? TrainingCourseDrpData?.find((i) => i?.value === trainingState?.trainingCourse) : ""}
                            onChange={(e) => {
                                handleTrainingState("trainingCourse", e?.value);
                                setIsChange(true);
                            }}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>
                            Mode Of Training{errorTrainingState.modeOfTraining && isEmpty(trainingState?.modeOfTraining) && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Mode Of Training"}</p>
                            )}
                        </label>
                    </div>
                    <div className="ol-4 col-md-4 col-lg-3 mt-2 text-field">
                        <Select
                            styles={colourStyles}
                            placeholder="Select"
                            isClearable
                            options={TrainingModeOfDrpData}
                            value={trainingState?.modeOfTraining ? TrainingModeOfDrpData?.find((i) => i?.value === trainingState?.modeOfTraining) : ""}
                            onChange={(e) => {
                                handleTrainingState("modeOfTraining", e?.value);
                                setIsChange(true);
                            }}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Training Start Date{errorTrainingState.trainingStartDate && isEmpty(trainingState?.trainingStartDate) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Training Start Date"}</p>
                        )}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3">
                        <DatePicker
                            name='trainingStartDate'
                            id='trainingStartDate'
                            onChange={(date) => {
                                handleTrainingState("trainingStartDate", date);
                                if (!date) {
                                    handleTrainingState("trainingStartDate", "");
                                }
                                setIsChange(true);
                            }}
                            selected={trainingState?.trainingStartDate || ""}
                            dateFormat="MM/dd/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            showDisabledMonthNavigation
                            dropdownMode="select"
                            autoComplete="off"
                            placeholderText="Select From Date..."
                            minDate={new Date(datezone)}
                            className="requiredColor"
                        />

                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Completed Training By{errorTrainingState.completedTrainingBy && isEmpty(trainingState?.completedTrainingBy) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Completed Training By"}</p>
                        )}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3">
                        <DatePicker
                            name='completedTrainingBy'
                            id='completedTrainingBy'
                            onChange={(date) => {
                                handleTrainingState("completedTrainingBy", date);
                                if (!date) {
                                    handleTrainingState("completedTrainingBy", "");
                                }
                                handleTrainingState("trainingValidTill", "");

                                setIsChange(true);
                            }}
                            selected={trainingState?.completedTrainingBy || ""}
                            dateFormat="MM/dd/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            showDisabledMonthNavigation
                            dropdownMode="select"
                            autoComplete="off"
                            placeholderText="Select From Date..."
                            minDate={trainingState.trainingStartDate || null}
                            className="requiredColor"
                            disabled={!trainingState?.trainingStartDate}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Training Valid Till{errorTrainingState.trainingValidTill && isEmpty(trainingState?.trainingValidTill) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Training Valid Till"}</p>
                        )}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3">
                        <DatePicker
                            name='trainingValidTill'
                            id='trainingValidTill'
                            onChange={(date) => {
                                handleTrainingState("trainingValidTill", date);
                                if (!date) {
                                    handleTrainingState("trainingValidTill", "");
                                }
                                setIsChange(true);
                            }}
                            selected={trainingState?.trainingValidTill || ""}
                            dateFormat="MM/dd/yyyy"
                            showMonthDropdown
                            showYearDropdown
                            showDisabledMonthNavigation
                            dropdownMode="select"
                            autoComplete="off"
                            placeholderText="Select From Date..."
                            minDate={trainingState?.completedTrainingBy || null}
                            className="requiredColor"
                            disabled={!trainingState?.completedTrainingBy}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Location{errorTrainingState.location && isEmpty(trainingState?.location) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Location"}</p>
                        )}</label>
                    </div>
                    <div className="w-100 col-9 col-md-9 col-lg-7 inner-input-fullw">

                        <Location
                            {...{
                                value: trainingState,
                                setValue: setTrainingState,
                                locationStatus,
                                setLocationStatus,
                                setIsSelectLocation,
                                locationData,
                            }}
                            col="location"
                            locationID="NameLocationID"
                            check={true}
                            verify={true}
                            page="Name"
                            isGEO
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Apt#/Suite</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3">
                        <Select
                            styles={customStylesWithOutColorArrow}
                            placeholder="Select"
                            options={aptSuiteNoDropDown}
                            getOptionLabel={(v) => v?.label}
                            getOptionValue={(v) => v?.aptId}
                            isClearable
                            value={trainingState?.apt || defaultAptSuite} // Set default value
                            onInputChange={(inputValue, actionMeta) => {
                                if (actionMeta.action === "input-change") {
                                    setAptInputValue(inputValue.length > 12 ? inputValue.slice(0, 12) : inputValue);
                                }
                                if (actionMeta.action === "menu-close") {
                                    setAptInputValue(""); // Clear the input field when closing the menu
                                }
                            }}
                            inputValue={aptInputValue} // Real-time controlled input
                            onChange={(e) => {
                                if (!e) {
                                    handleTrainingState("apt", defaultAptSuite);
                                } else {
                                    handleTrainingState("apt", e);
                                }
                            }}
                            isDisabled={!trainingState?.location || !trainingState?.Id}
                        />
                    </div>
                </div>
                <div className="row pt-1">
                    <div className="col-2 col-md-2 col-lg-1  pt-1">
                        <label htmlFor="" className='new-label'>Assign</label>
                    </div>
                    <div className='col-5 d-flex '>
                        <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                            <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                                <input
                                    type="radio"
                                    id="Group"
                                    value="Group"
                                    checked={trainingState?.assignBy === 'Group'}
                                    onChange={(e) => {
                                        setTrainingState((prevState) => ({
                                            ...prevState,
                                            selectedGroupIndividual: []
                                        }));
                                        handleTrainingState("assignBy", e.target.value);
                                        setIsChange(true);
                                    }}
                                />
                                <label for="Group" className='tab-form-label' style={{ margin: '0', }}>By Group</label>
                            </div>
                        </div>
                        <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                            <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                                <input
                                    type="radio"
                                    id="Individual"
                                    value="Individual"
                                    checked={trainingState?.assignBy === 'Individual'}
                                    onChange={(e) => {
                                        setTrainingState((prevState) => ({
                                            ...prevState,
                                            selectedGroupIndividual: []
                                        }));
                                        handleTrainingState("assignBy", e.target.value);
                                        setIsChange(true);
                                    }} />
                                <label for="Individual" className='tab-form-label' style={{ margin: '0', }}>Individual</label>
                            </div>
                        </div>

                    </div>

                </div>
                <div className="row">
                    <div className="col-2 col-md-2 col-lg-1  pt-1">
                        <label htmlFor="" className='new-label'>Select{errorTrainingState.selectedGroupIndividual && trainingState?.selectedGroupIndividual?.length === 0 && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select any one"}</p>
                        )}</label>
                    </div>
                    <div className="col-7 row align-self-center justify-content-end">
                        <div
                            style={{
                                width: "100%",
                                border: "#54697E 0.44px solid",
                                padding: "5px",
                                maxHeight: "200px",
                                overflowY: "auto",
                            }}
                        >
                            {trainingState?.assignBy === "Group" &&
                                groupList?.map((group) => (
                                    <div key={group.GroupID} className="agency-checkbox-item">
                                        <input
                                            type="checkbox"
                                            name={`group-${group.GroupID}`}
                                            checked={trainingState.selectedGroupIndividual.includes(group.GroupID)}
                                            onChange={(e) => handleSelection(group.GroupID, e.target.checked)}
                                        />
                                        <div className="agency-checkbox-text-container tab-form-label">
                                            {group.GroupName}
                                        </div>
                                    </div>
                                ))}

                            {trainingState?.assignBy === "Individual" &&
                                personnelList?.map((person) => (
                                    <div key={person.PINID} className="agency-checkbox-item">
                                        <input
                                            type="checkbox"
                                            name={`group-${person.PINID}`}
                                            checked={trainingState.selectedGroupIndividual.includes(person.PINID)}
                                            onChange={(e) => handleSelection(person.PINID, e.target.checked)}
                                        />
                                        <div className="agency-checkbox-text-container tab-form-label">
                                            {`${person.FirstName} ${person?.LastName}`}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                </div>
                <div className="col-12">
                    <div className="btn-box text-right mt-1 mr-1">
                        <button
                            type="button"
                            className="btn btn-sm btn-success mr-1"
                            data-dismiss="modal"
                            onClick={() => handelCancel()}
                        >
                            New
                        </button>
                        <button
                            type="button" className="btn btn-sm btn-success mr-1"
                            disabled={!isChange}
                            onClick={() => {
                                setShowConfirmModal(true);
                            }}
                        >
                            {!!trainingState?.AssignTrainingID ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
                <div className="col-12 mt-1">
                    <DataTable
                        columns={columns}
                        data={trainingData}
                        dense
                        paginationRowsPerPageOptions={[10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        showHeader={true}
                        persistTableHead={true}
                        conditionalRowStyles={conditionalRowStyles}
                        customStyles={tableCustomStyles}

                        fixedHeader
                        subHeaderAlign="right"
                        subHeaderWrap
                    />
                </div>
            </div>
            <TrainingStatusModal {...{ openTrainingStatusModal, setOpenTrainingStatusModal, AssignTrainingID }} />
            <ModalConfirm
                showModal={showConfirmModal}
                setShowModal={setShowConfirmModal}
                confirmAction=""
                handleConfirm={() => onSave()}
                isCustomMessage
                message={"After saving, training details cannot be modified. Do you want to continue?"}
            />
        </>
    )
}

export default Training
