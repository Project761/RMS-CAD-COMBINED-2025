import { useState, useEffect, useContext, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchPostData, AddDelete_Img } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component';
import { base64ToString, Decrypt_Id_Name, getShowingWithOutTime, tableCustomStyles } from '../../../../Common/Utility'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import Select from "react-select";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data, getData_DropDown_LevelClearance, getData_DropDown_ModeOfTraining, getData_DropDown_TrainingCategory, getData_DropDown_TrainingCourse } from '../../../../../redux/actions/DropDownsData';
import useObjState from '../../../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import img from '../../../../../../src/img/file.jpg'
import ModalConfirm from '../../../../../CADComponents/Common/ModalConfirm';
import ViewSingleImageModal from '../../../../Common/ViewSingleImageModal';

const TrainingCJISCompliance = ({ aId, setaddUpdatePermission }) => {

    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [trainingData, setTrainingData] = useState([])
    const [updCount, setUpdCount] = useState(0)
    const [pinID, setPinID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState("");
    const LevelClearanceDrpData = useSelector((state) => state.DropDown.LevelClearanceDrpData);
    const [isChange, setIsChange] = useState(false);
    const [assignTrainingData, setAssignTrainingData] = useState([])
    const [AssignTrainingUserID, setAssignTrainingUserID] = useState();
    const [AssignTrainingID, setAssignTrainingID] = useState();
    const [isCJIS, setIsCJIS] = useState(true);

    //  document
    const [selectedImage, setSelectedImage] = useState(null);
    const [isOpenViewSingleImageModal, setIsOpenViewSingleImageModal] = useState(false);
    const [viewSingleImage, setViewSingleImage] = useState("")
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmParams, setConfirmParams] = useState(null);
    const fileInputRef = useRef(null);
    const [
        trainingCJISComplianceState,
        setTrainingCJISComplianceState,
        handleTrainingCJISComplianceState,
        clearTrainingCJISComplianceState,
    ] = useObjState({
        AssignTrainingID: "",
        AssignTrainingUserID: "",
        levelClearance: "",
        backgroundCheck: "",
        trainingCompleted: "",
        CJIStrainingValidTill: "",
        isFingerPrintClearance: false,
        clearanceDate: "",
        trainingCategory: "",
        trainingCourse: "",
        modeOfTraining: "",
        trainingStartDate: "",
        completedTrainingBy: "",
        trainingValidTill: "",
        location: "",
        apt: "",
        isAcknowledge: false
    });

    const [
        errorTrainingCJISComplianceState,
        _setErrorTrainingCJISComplianceState,
        handleErrorTrainingCJISComplianceState,
        clearStateTrainingCJISComplianceState,
    ] = useObjState({
        isAcknowledge: false,
        clearanceDate: false,
    });

    const columns = [
        {
            name: 'Training Category',
            selector: (row) => row.TrainingCategory,
            sortable: true
        },
        {
            name: 'Training Course',
            selector: (row) => row.TrainigCourse,
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
            name: 'Completion Certificate',
            cell: (row) =>
                row.FileAttachment ? (
                    <a
                        href={row.FileAttachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                        {row.DocumentName}
                    </a>
                ) : (
                    row.DocumentName || ""
                ),
            sortable: true
        },
        {
            name: 'Status',
            sortable: true,
            center: true,
            selector: (row) => {
                let bgColor = "";

                if (row?.Status === "PASS") {
                    bgColor = "#39d368";
                } else if (row?.Status === "IN PROGRESS") {
                    bgColor = "#e3bf00";
                } else {
                    bgColor = "#6c757d";
                }
                return (
                    <>
                        {row?.Status && <button
                            className="btn btn-sm p-1 py-0 "
                            style={{
                                background: bgColor,
                                color: "black",
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "center",
                                gap: '5px',
                                width: '100px',
                                fontSize: '12px'
                            }}
                        >
                            {row?.Status}
                        </button>}
                    </>
                );
            },
        },
    ]

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");
    var perId = query?.get('perId');

    if (!perId) perId = 0;
    else perId = parseInt(base64ToString(perId));

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (assignTrainingData?.AssignTrainingID) {
            setTrainingCJISComplianceState({
                AssignTrainingUserID: assignTrainingData?.AssignTrainingUserID,
                AssignTrainingID: assignTrainingData?.AssignTrainingID,
                levelClearance: assignTrainingData?.LevelClearanceID,
                backgroundCheck: assignTrainingData?.BackgroundCheckDate ? new Date(assignTrainingData?.BackgroundCheckDate) : "",
                trainingCompleted: assignTrainingData?.CompletedTrainingBy ? getShowingWithOutTime(assignTrainingData?.CompletedTrainingBy) : "",
                CJIStrainingValidTill: assignTrainingData?.TrainingValidTill ? getShowingWithOutTime(assignTrainingData?.TrainingValidTill) : "",
                isFingerPrintClearance: assignTrainingData?.FingerprintClearance,
                clearanceDate: assignTrainingData?.ClearanceDate ? new Date(assignTrainingData?.ClearanceDate) : "",
                trainingCategory: assignTrainingData?.TrainingCategory,
                trainingCourse: assignTrainingData?.TrainigCourse,
                modeOfTraining: assignTrainingData?.ModeOfTraining,
                trainingStartDate: assignTrainingData?.TrainingStartDate ? getShowingWithOutTime(assignTrainingData?.TrainingStartDate) : "",
                completedTrainingBy: assignTrainingData?.CompletedTrainingBy ? getShowingWithOutTime(assignTrainingData?.CompletedTrainingBy) : "",
                trainingValidTill: assignTrainingData?.TrainingValidTill ? getShowingWithOutTime(assignTrainingData?.TrainingValidTill) : "",
                location: assignTrainingData?.Location,
                apt: assignTrainingData?.AptSuite,
                isAcknowledge: assignTrainingData?.IsAcknowledgement
            });
        }
    }, [assignTrainingData])

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("A005", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, 0))
            dispatch(getData_DropDown_ModeOfTraining(localStoreData?.AgencyID))
            dispatch(getData_DropDown_TrainingCourse(localStoreData?.AgencyID))
            dispatch(getData_DropDown_TrainingCategory(localStoreData?.AgencyID))
            dispatch(getData_DropDown_LevelClearance(localStoreData?.AgencyID))
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("P141", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (aId) {
            getAssignTraining(aId);
        }
    }, [aId])

    const getAssignTraining = (aId) => {
        const value = {
            PINID: perId,
            AgencyID: aId
        }
        fetchPostData('CAD/AssignTraining/GetAssignTrainingUsers', value).then(res => {
            if (res) {
                setTrainingData(res)
            } else {
                setTrainingData([])
            }
        })
    }

    const set_Edit_Value = (row) => {
        setAssignTrainingUserID(row.AssignTrainingUserID);
        setAssignTrainingID(row.AssignTrainingID);
        setSelectedImage(row)
        setAssignTrainingData(row);
        setUpdCount(updCount + 1)
        setIsCJIS(row?.TrainingCategory === "CJIS" ? true : false)
        setIsChange(false)
    }

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        const file = files[0];

        const maxFileSizeInMB = 10;
        const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;
        const allowedTypes = [
            'image/png',
            'image/jpeg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'text/plain'
        ];

        if (!allowedTypes.includes(file.type)) {
            toastifyError(`Invalid file: ${file.name}. Allowed types are: ${allowedTypes.join(", ")}`);
            event.target.value = "";
            return;
        }
        if (file.size > maxFileSizeInBytes) {
            toastifyError(`File size exceeds 10MB limit.`);
            event.target.value = "";
            return;
        }
        setSelectedImage(file);
        setIsChange(true);
        event.target.value = "";
    };

    const removeImage = () => {
        setSelectedImage(null);
        setTrainingCJISComplianceState((prevState) => ({
            ...prevState,
            isAcknowledge: false
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        setIsChange(true);
        setShowConfirmModal(false);
    };

    const isImageFile = (fileName) => {
        const imageExtensions = /\.(png|jpg|jpeg|jfif|bmp|gif|webp|tiff|tif|svg|ico|heif|heic)$/i;
        return imageExtensions.test(fileName);
    };

    const validateCFSCodeForm = () => {
        let isError = false;
        const keys = Object.keys(errorTrainingCJISComplianceState);
        keys.map((field) => {
            if (
                field === "isAcknowledge" &&
                (selectedImage?.FileAttachment || selectedImage?.name) &&
                !trainingCJISComplianceState.isAcknowledge
            ) {
                handleErrorTrainingCJISComplianceState(field, true);
                isError = true;
            }
            else if (
                field === "clearanceDate" &&
                !!trainingCJISComplianceState?.isFingerPrintClearance &&
                !trainingCJISComplianceState.clearanceDate
            ) {
                handleErrorTrainingCJISComplianceState(field, true);
                isError = true;
            } else {
                handleErrorTrainingCJISComplianceState(field, false);
            }
        });
        return !isError;
    };

    const onSave = async () => {
        const isUpdate = !!trainingCJISComplianceState?.AssignTrainingID;

        if (!validateCFSCodeForm()) return;

        const formdata = new FormData();
        const EncFormdata = new FormData();


        if (selectedImage && selectedImage instanceof File) {
            formdata.append("File", selectedImage);
            EncFormdata.append("File", selectedImage);
        }
        const val = {
            AssignTrainingID: isUpdate ? trainingCJISComplianceState?.AssignTrainingID : "",
            LevelClearanceID: trainingCJISComplianceState?.levelClearance,
            BackgroundCheckDate: trainingCJISComplianceState?.backgroundCheck ? getShowingWithOutTime(trainingCJISComplianceState?.backgroundCheck) : null,
            FingerprintClearance: trainingCJISComplianceState?.isFingerPrintClearance,
            ClearanceDate: trainingCJISComplianceState?.clearanceDate ? getShowingWithOutTime(trainingCJISComplianceState?.clearanceDate) : null,
            IsAcknowledgement: trainingCJISComplianceState?.isAcknowledge,
            PINID: perId,
            ModifiedByUserFK: pinID,
            AgencyID: aId,
        };

        const valuesArray = `${JSON.stringify(val)}`;
        const formattedValues = JSON.stringify(valuesArray);
        formdata.append("Data", formattedValues);
        try {
            const res = await AddDelete_Img('CAD/AssignTraining/UpdateAssignTrainingUsers', formdata, EncFormdata);
            if (res.success) {
                toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
                getAssignTraining(aId);
                handelCancel();
            } else {
                console.warn("Something went wrong");
            }
        } catch (err) {
            console.warn("Error:", err);
        }
    };

    function handelCancel() {
        clearTrainingCJISComplianceState();
        setAssignTrainingUserID()
        setAssignTrainingID()
        setAssignTrainingData()
        setSelectedImage()
        setIsChange(false);
        setViewSingleImage("")
        setConfirmParams("")
        setIsCJIS(true)
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
            // height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            transition: "all .2s ease",
            transform: state.selectProps.menuIsOpen ? null : "rotate(180deg)"
        }),
        input: (provided) => ({
            ...provided,
            minWidth: '0px',
            maxWidth: '100%',
        }),
    };

    return (
        <>
            <div className="col-12 mt-3">
                {isCJIS &&
                    <fieldset>
                        <legend>CJIS Compliance</legend>
                        <div className="row pt-1 ">
                            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                                <label htmlFor="" className='new-label'>Level Clearance</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                                <Select
                                    styles={customStylesWithOutColorArrow}
                                    placeholder="Select"
                                    isClearable
                                    options={LevelClearanceDrpData}
                                    value={trainingCJISComplianceState?.levelClearance ? LevelClearanceDrpData?.find((i) => i?.value === trainingCJISComplianceState?.levelClearance) : ""}
                                    onChange={(e) => {
                                        handleTrainingCJISComplianceState("levelClearance", e?.value);
                                        setIsChange(true);
                                    }}
                                    isDisabled={!AssignTrainingID}
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                                <label htmlFor="" className='new-label'>
                                    Background Check
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                <DatePicker
                                    name='backgroundCheck'
                                    id='backgroundCheck'
                                    onChange={(date) => {
                                        handleTrainingCJISComplianceState("backgroundCheck", date);
                                        if (!date) {
                                            handleTrainingCJISComplianceState("backgroundCheck", "");
                                        }
                                        setIsChange(true);
                                    }}
                                    selected={trainingCJISComplianceState?.backgroundCheck || ""}
                                    dateFormat="MM/dd/yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable={trainingCJISComplianceState?.backgroundCheck ? true : false}
                                    showDisabledMonthNavigation
                                    dropdownMode="select"
                                    autoComplete="off"
                                    placeholderText="Select From Date..."
                                    maxDate={new Date(datezone)}
                                    disabled={!AssignTrainingID}
                                />

                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                                <label htmlFor="" className='new-label'>
                                    Training Completed
                                </label>
                            </div>
                            <div className="ol-4 col-md-4 col-lg-3 mt-2 text-field">
                                <input
                                    type="text"
                                    className="form-control py-1 new-input"
                                    name="trainingCompleted"
                                    value={trainingCJISComplianceState.trainingCompleted}
                                    readOnly
                                />

                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                                <label htmlFor="" className='new-label'>Training Valid Till</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-2">
                                <input
                                    type="text"
                                    className="form-control py-1 new-input"
                                    name="CJIStrainingValidTill"
                                    value={trainingCJISComplianceState.CJIStrainingValidTill}
                                    readOnly
                                />
                            </div>
                            <div className="col-6 col-md-6 col-lg-4 align-self-center justify-content-end">
                                <div className="agency-checkbox-item">
                                    <input
                                        type="checkbox"
                                        name="isFingerPrintClearance"
                                        checked={trainingCJISComplianceState.isFingerPrintClearance}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            handleTrainingCJISComplianceState("isFingerPrintClearance", checked);
                                            if (!checked) {
                                                handleTrainingCJISComplianceState("clearanceDate", "");
                                            }
                                            setIsChange(true);
                                        }}
                                        disabled={!AssignTrainingID}
                                    />
                                    <div className="agency-checkbox-text-container tab-form-label">
                                        Fingerprint Clearance
                                    </div>
                                </div>
                            </div>
                            {trainingCJISComplianceState.isFingerPrintClearance &&
                                <>
                                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                                        <label htmlFor="" className='new-label'>Clearance Date {(errorTrainingCJISComplianceState.clearanceDate && !!trainingCJISComplianceState?.isFingerPrintClearance && !trainingCJISComplianceState.clearanceDate) && (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Clearance Date"}</p>
                                        )}</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-3">
                                        <DatePicker
                                            name='clearanceDate'
                                            id='clearanceDate'
                                            onChange={(date) => {
                                                handleTrainingCJISComplianceState("clearanceDate", date);
                                                if (!date) {
                                                    handleTrainingCJISComplianceState("clearanceDate", "");
                                                }
                                                setIsChange(true);
                                            }}
                                            selected={trainingCJISComplianceState?.clearanceDate || ""}
                                            dateFormat="MM/dd/yyyy"
                                            showMonthDropdown
                                            showYearDropdown
                                            isClearable={trainingCJISComplianceState?.clearanceDate ? true : false}
                                            showDisabledMonthNavigation
                                            dropdownMode="select"
                                            autoComplete="off"
                                            placeholderText="Select From Date..."
                                            maxDate={new Date(datezone)}
                                            disabled={!AssignTrainingID}
                                        />
                                    </div>
                                </>
                            }
                        </div>
                    </fieldset>
                }
                <fieldset>
                    <legend>Training Record</legend>
                    <div className="row pt-1 ">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Training Category</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="trainingCategory"
                                value={trainingCJISComplianceState.trainingCategory}
                                readOnly
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>
                                Training Course
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="trainingCourse"
                                value={trainingCJISComplianceState.trainingCourse}
                                readOnly
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>
                                Mode of Training
                            </label>
                        </div>
                        <div className="ol-4 col-md-4 col-lg-3 mt-2 text-field">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="modeOfTraining"
                                value={trainingCJISComplianceState.modeOfTraining}
                                readOnly
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Training Start Date</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3  mt-2">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="trainingStartDate"
                                value={trainingCJISComplianceState.trainingStartDate}
                                readOnly
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Completed Training By</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3  mt-2">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="completedTrainingBy"
                                value={trainingCJISComplianceState.completedTrainingBy}
                                readOnly
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Training Valid Till</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3  mt-2">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="trainingValidTill"
                                value={trainingCJISComplianceState.trainingValidTill}
                                readOnly
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Location</label>
                        </div>
                        <div className="w-100 col-4 col-md-4 col-lg-3 mt-2 inner-input-fullw">

                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="location"
                                value={trainingCJISComplianceState.location}
                                readOnly
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Apt#/Suite</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-2">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="apt"
                                value={trainingCJISComplianceState.apt}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col-1 mt-3 d-flex justify-content-end">
                            <label className="new-label">Upload Training Certificate</label>
                        </div>
                        <div className="col-11 text-field">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, 'text/plain'"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                disabled={!AssignTrainingID}
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="offset-1 col-11 cad-images image-preview cursor pointer" style={{ width: "max-content" }}>
                            {(selectedImage?.FileAttachment || selectedImage?.name) &&
                                <div
                                    className="cad-images image-container"
                                    style={{ width: "max-content" }}
                                    data-toggle="modal"
                                    data-target="#ViewSingleImageModal"
                                    onClick={() => {
                                        const fileType = selectedImage.FileAttachment || selectedImage.name;
                                        if (isImageFile(fileType)) {
                                            setViewSingleImage(selectedImage);
                                            setIsOpenViewSingleImageModal(true);
                                        } else {
                                            window.open(selectedImage.FileAttachment || URL.createObjectURL(selectedImage), '_blank');
                                        }
                                    }}
                                >
                                    {selectedImage.AssignTrainingID ? (
                                        isImageFile(selectedImage.FileAttachment) ? (
                                            <img
                                                src={selectedImage.FileAttachment}
                                                alt={`Selected`}
                                                width="100"
                                                height="100"
                                            />
                                        ) : (
                                            <img
                                                src={img}
                                                alt="Document Icon"
                                                width="100"
                                                height="100"
                                            />
                                        )
                                    ) : (
                                        isImageFile(selectedImage.name) ? (
                                            <img
                                                src={URL.createObjectURL(selectedImage)}
                                                alt={`Selected`}
                                                width="100"
                                                height="100"
                                            />
                                        ) : (
                                            <img
                                                src={img}
                                                alt="Document Icon"
                                                width="100"
                                                height="100"
                                            />
                                        )
                                    )}

                                    {/* File name */}
                                    <p
                                        style={{
                                            fontSize: '10px',
                                            textAlign: 'center',
                                            margin: '5px 0',
                                            wordWrap: 'break-word',
                                            overflowWrap: 'break-word',
                                            maxWidth: '100px',
                                            whiteSpace: 'normal',
                                        }}
                                    >
                                        {selectedImage?.DocumentID ? selectedImage?.DocumentName : selectedImage?.name || 'No Name'}
                                    </p>

                                    {/* Trash icon */}
                                    <button
                                        className="btn btn-sm bg-green text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmParams({ selectedImage });
                                            setShowConfirmModal(true);
                                        }}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            }
                        </div>
                    </div>

                    {(selectedImage?.FileAttachment || selectedImage?.name) && <div className="row mt-2">
                        <div className="offset-1 col-11  align-self-center justify-content-end">
                            <div className="agency-checkbox-item">
                                <input
                                    type="checkbox"
                                    name="isAcknowledge"
                                    checked={trainingCJISComplianceState.isAcknowledge}
                                    onChange={(e) => {
                                        handleTrainingCJISComplianceState("isAcknowledge", e.target.checked);
                                        setIsChange(true);
                                    }}
                                />
                                <div className="agency-checkbox-text-container tab-form-label">
                                    I acknowledge that i have completed the training
                                </div>
                            </div>
                            {(errorTrainingCJISComplianceState.isAcknowledge && (selectedImage?.FileAttachment || selectedImage?.name) && !trainingCJISComplianceState.isAcknowledge) && (
                                <p style={{ color: 'red', fontSize: '14px', margin: '0px', padding: '0px' }}>{"Please acknowledge"}</p>
                            )}
                        </div>
                    </div>}
                </fieldset>
                <div className="col-12">
                    <div className="btn-box text-right mt-1 mr-1">
                        <button
                            type="button"
                            className="btn btn-sm btn-success mr-1"
                            data-dismiss="modal"
                            onClick={() => handelCancel()}
                        >
                            Clear
                        </button>
                        <button
                            type="button" className="btn btn-sm btn-success mr-1"
                            disabled={!!selectedImage?.name ? !trainingCJISComplianceState.isAcknowledge || !isChange : !isChange}
                            onClick={() => {
                                onSave()
                            }}
                        >
                            Update
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
                        onRowClicked={(row) => {
                            set_Edit_Value(row);
                        }}
                        fixedHeader
                        subHeaderAlign="right"
                        subHeaderWrap
                    // noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>

            <ModalConfirm
                showModal={showConfirmModal}
                setShowModal={setShowConfirmModal}
                confirmAction=""
                handleConfirm={() => {
                    removeImage(confirmParams.index, confirmParams.image);
                }}
                isCustomMessage
                message="Are you sure you want to delete this item ?"
            />
            <ViewSingleImageModal isOpenViewSingleImageModal={isOpenViewSingleImageModal} setIsOpenViewSingleImageModal={setIsOpenViewSingleImageModal} viewSingleImage={viewSingleImage} />
        </>
    )
}

export default TrainingCJISCompliance
