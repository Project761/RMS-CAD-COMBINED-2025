import React, { useEffect, useRef, useState } from 'react'
import Select from "react-select";
import { coloredStyle_Select, colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import DatePicker from "react-datepicker";
import useObjState from '../../CADHook/useObjState';
import { useDispatch, useSelector } from 'react-redux';
import { getData_DropDown_SourceType } from '../../redux/actions/DropDownsData';
import { get_AgencyOfficer_Data } from '../../redux/actions/IncidentAction';
import { getData_DropDown_Priority } from '../../CADRedux/actions/DropDownsData';
import CaseManagementServices from '../../CADServices/APIs/caseManagement';
import { useQuery } from 'react-query';
import { toastifyError, toastifySuccess } from '../../Components/Common/AlertMsg';
import { isEmpty, isEmptyObject } from '../../CADUtils/functions/common';
import { AddDelete_Img } from '../../Components/hooks/Api';
import ModalConfirm from '../Common/ModalConfirm';
import ViewSingleImageModal from '../ViewSingleImageModal/ViewSingleImageModal';
import img from '../../img/file.jpg'

function DetectiveNotes({ CaseId }) {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const sourceTypeDrpData = useSelector((state) => state.DropDown.sourceTypeDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const [notes, setNotes] = useState([])
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [selectedImages, setSelectedImages] = useState([])
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmParams, setConfirmParams] = useState({ index: null, image: null })
    const [isOpenViewSingleImageModal, setIsOpenViewSingleImageModal] = useState(false)
    const [viewSingleImage, setViewSingleImage] = useState(null)

    // Form state using useObjState
    const [formState, setFormState, handleFormState, clearFormState] = useObjState({
        detectiveID: null,
        noteBy: null,
        sourceType: null,
        confidence: null,
        dateTime: null,
        intelligenceText: '',
        isPinned: false
    })
    const [errorState, setErrorState, handleErrorState, clearErrorState] = useObjState({
        noteBy: false,
        sourceType: false,
        confidence: false,
        dateTime: false,
        intelligenceText: false,
    })

    const [loginPinID, setLoginPinID] = useState(null)
    const [agencyID, setAgencyID] = useState(null)
    const [isDisabled, setIsDisabled] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteNoteId, setDeleteNoteId] = useState(null)
    const fileInputRef = useRef(null);
    // Filter state using useObjState
    const [filterState, , handleFilterState, clearFilterState] = useObjState({
        filterText: '',
        filterNoteBy: null,
        filterConfidence: null,
        hasDocuments: false,
    })

    useEffect(() => {
        if (localStoreData?.AgencyID) {
            if (sourceTypeDrpData?.length === 0) dispatch(getData_DropDown_SourceType(localStoreData?.AgencyID))
            if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID));
            if (PriorityDrpData?.length === 0) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID));
            setLoginPinID(localStoreData?.PINID);
            setAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData?.AgencyID])

    const getAllDetectiveNotesKey = `/CaseManagement/GetAllDetective/${localStoreData?.AgencyID}/${CaseId}`;
    const { data: getAllDetectiveNotesData, isSuccess: isGetAllDetectiveNotesDataSuccess, refetch: refetchAllDetectiveNotesData } = useQuery(
        [getAllDetectiveNotesKey, {
            "AgencyID": localStoreData?.AgencyID,
            "CaseID": parseInt(CaseId),
            "IsActive": true,
            "NoteByID": filterState?.filterNoteBy?.value,
            "ConfidenceID": filterState?.filterConfidence?.PriorityID,
            "IntelligenceText": filterState?.filterText,
            "HasDocuments": filterState?.hasDocuments,
        },],
        CaseManagementServices.getAllDetectiveNotes,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!CaseId && !!agencyID
        }
    );

    useEffect(() => {
        if (getAllDetectiveNotesData && isGetAllDetectiveNotesDataSuccess) {
            const data = JSON.parse(getAllDetectiveNotesData?.data?.data)?.Table
            setNotes(data);
        } else {
            setNotes([])
        }
    }, [getAllDetectiveNotesData, isGetAllDetectiveNotesDataSuccess])

    // Event handlers
    const handleNew = () => {
        clearFormState();
        clearErrorState();
        clearFilterState();
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const validation = () => {
        let isError = false;
        const keys = Object.keys(errorState);
        keys.forEach((field) => {
            if (field === "noteBy" && isEmptyObject(formState.noteBy)) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "sourceType" && isEmptyObject(formState.sourceType)) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "confidence" && isEmptyObject(formState.confidence)) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "dateTime" && !formState.dateTime) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "intelligenceText" && isEmpty(formState.intelligenceText)) {
                handleErrorState(field, true);
                isError = true;
            } else {
                handleErrorState(field, false);
            }
        });
        return !isError;
    };

    const getImages = async (ID) => {
        if (ID) {
            const payload = {
                // "IsActive": true,
                DetectiveID: ID,
                AgencyID: agencyID,
            }
            const response = await CaseManagementServices.getDetectiveNoteDoc(payload);
            if (response?.data?.success) {
                const parsedData = JSON.parse(response?.data?.data);
                const viewImgData = parsedData?.Table;
                setSelectedImages(viewImgData)
            } else {
                setSelectedImages([]);
            }
        }
    }

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const maxFileSizeInMB = 10; // Maximum individual file size in MB
        const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024; // Convert MB to bytes

        // Allowed file types
        const allowedTypes = [
            'image/png',
            'image/jpeg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
            'text/plain',
            'video/mp4' // Added video/mp4
        ];

        const validFiles = [];
        const invalidFileTypes = [];
        const oversizedFiles = [];

        files.forEach((file) => {
            if (!allowedTypes.includes(file.type)) {
                invalidFileTypes.push(file.name); // Invalid file type
            } else if (file.size > maxFileSizeInBytes) {
                oversizedFiles.push(file.name); // Single file exceeds the 10MB limit
            } else {
                validFiles.push(file);
            }
        });

        if (invalidFileTypes.length > 0) {
            toastifyError(`Invalid file(s): ${invalidFileTypes.join(", ")}. Allowed types are: ${allowedTypes.join(", ")}.`);
        }

        if (oversizedFiles.length > 0) {
            toastifyError(`File size exceeds limit.`);
        }

        if (validFiles.length > 0) {
            setSelectedImages((prevImages) => [...prevImages, ...validFiles]);
            setIsDataUpdated(true);
        }
        event.target.value = ""; // Reset the input value to allow re-uploading
    };

    const isImageFile = (fileName) => {
        const imageExtensions = /\.(png|jpg|jpeg|jfif|bmp|gif|webp|tiff|tif|svg|ico|heif|heic)$/i;
        return imageExtensions.test(fileName);
    };

    const Add_Documents = async (ID) => {
        if (!selectedImages || selectedImages.length === 0) {
            console.warn("No images selected. API call skipped.");
            return;
        }

        const formdata = new FormData();
        const EncFormdata = new FormData();
        let hasValidFiles = false;

        for (let i = 0; i < selectedImages.length; i++) {
            if (selectedImages[i] instanceof File) {
                formdata.append("File", selectedImages[i]);
                EncFormdata.append("File", selectedImages[i]);
                hasValidFiles = true;
            }
        }

        if (!hasValidFiles) {
            console.warn("No valid files found in selectedImages. API call skipped.");
            return;
        }

        const val = {
            DetectiveID: ID,
            IsActive: true,
            AgencyID: agencyID,
            CreatedByUserFK: loginPinID,
        };

        const valuesArray = [`${JSON.stringify(val)}`];
        const formattedValues = JSON.stringify(valuesArray);
        formdata.append("Data", formattedValues);
        const res = await AddDelete_Img('/CaseManagement/InsertDetectiveDocument', formdata, EncFormdata)
        if (res.success) {
            return true; // Return true on success
        } else {
            console.warn("Something went wrong");
            return false; // Return false on failure
        }
    };

    const removeImage = async (index, image) => {
        setSelectedImages((prevImages) => {
            const updatedImages = prevImages.filter((_, i) => i !== index);
            if (updatedImages.length === 0 && fileInputRef.current) {
                fileInputRef.current.value = null;
            }
            return updatedImages;
        });
        if (image?.DocumentID) {
            const payload = {
                DeletedByUserFK: loginPinID || "",
                DocumentID: image?.DocumentID,
                IsActive: false,
                AgencyID: agencyID,
            }
            await CaseManagementServices.deleteDetectiveDocument(payload);
        }
    };

    const handleSave = async () => {
        if (!validation()) return;
        // setIsDisabled(true);
        const isUpdate = formState?.detectiveID ? true : false
        const payload = {
            "DetectiveID": isUpdate ? formState?.detectiveID : undefined,
            "CaseID": CaseId,
            "NoteByID": formState?.noteBy?.value,
            "SourceTypeID": formState?.sourceType?.SourceTypeID,
            "ConfidenceID": formState?.confidence?.PriorityID,
            "DateTime": formState?.dateTime,
            "IntelligenceText": formState?.intelligenceText,
            "AgencyID": agencyID,
            "CreatedByUserFK": isUpdate ? undefined : loginPinID,
            "ModifiedByUserFK": isUpdate ? loginPinID : undefined,
            "IsActive": true,
            "isPinned": isUpdate ? formState?.isPinned : false,
        }
        let response = isUpdate ? await CaseManagementServices.updateDetectiveNote(payload) : await CaseManagementServices.insertDetectiveNote(payload)
        if (response?.status === 200) {
            const data = JSON.parse(response?.data?.data);
            if (selectedImages.length > 0) {
                await Add_Documents(isUpdate ? formState?.detectiveID : data?.Table?.[0]?.DetectiveID);
                refetchAllDetectiveNotesData();
            } else {
                refetchAllDetectiveNotesData();
            }
            toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully")
            handleNew() // Clear form after saving
        }
        setIsDisabled(false);
    }

    const handlePin = async (noteId, isPinned) => {
        const payload = {
            "isPinned": isPinned ? false : true,
            "DetectiveID": noteId
        }
        const response = await CaseManagementServices.pinnedSourceType(payload)
        if (response?.status === 200) {
            toastifySuccess(isPinned ? "Data Unpinned Successfully" : "Data Pinned Successfully")
            refetchAllDetectiveNotesData()
        }
    }

    const handleEdit = async (noteId) => {
        const payload = { "DetectiveID": noteId }
        const response = await CaseManagementServices.getByID_Detective(payload)
        if (response?.status === 200) {
            const data = JSON.parse(response?.data?.data)?.Table?.[0]
            setFormState({
                detectiveID: data?.DetectiveID,
                noteBy: agencyOfficerDrpData?.find(v => v?.value === data?.NoteByID),
                sourceType: sourceTypeDrpData?.find(v => v?.SourceTypeID === data?.SourceTypeID),
                confidence: PriorityDrpData?.find(v => v?.PriorityID === data?.ConfidenceID),
                dateTime: data?.DateTime ? new Date(data?.DateTime) : null,
                intelligenceText: data?.IntelligenceText,
                isPinned: data?.isPinned
            })
            getImages(data?.DetectiveID)
        }
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false)
        setDeleteNoteId(null)
    }

    const handleDelete = async () => {
        if (deleteNoteId) {
            const payload = { "DetectiveID": deleteNoteId, "DeletedByUserFK": loginPinID }
            let response = await CaseManagementServices.deleteDetectiveNote(payload)
            if (response?.status === 200) {
                toastifySuccess("Data Deleted Successfully")
                refetchAllDetectiveNotesData() // Refresh the data
                handleCloseDeleteModal()
            }
        }
    }

    const handleApplyFilter = () => {
        // Here you would typically apply the filters to the notes
        console.log('Applying filters:', filterState)
    }

    const pinnedNotes = notes.filter(note => note.isPinned)
    const allNotes = notes.filter(note => !note.isPinned)
    const getImageSrc = (image, item) => {
        if (item.DetectiveID) {
            return isImageFile(image.FileAttachment) ? image.FileAttachment : img;
        } else {
            return isImageFile(image.name) ? URL.createObjectURL(image) : img;
        }
    };

    const getImageAlt = (image, index) => {
        return isImageFile(image.FileAttachment || image.name) ? `Selected ${index}` : "Document Icon";
    };

    const renderImage = (image, index, item) => {
        return (
            <div
                key={index}
                className="cad-images image-container mb-0"
                data-toggle="modal"
                data-target="#ViewSingleImageModal"
            // onClick={() => handleImageClick(image)}
            >
                <img
                    src={getImageSrc(image, item)}
                    alt={getImageAlt(image, index)}
                    style={{ width: '30px', height: '30px' }}
                />
            </div>
        )
    };

    const NoteCard = ({ note, index, showPinAction = true }) => {
        const image = JSON.parse(note?.Documents)
        return (
            <div className="border rounded p-3" style={{ backgroundColor: note.isPinned ? "#FFFFE5" : '#f8f9fa' }}>
                {note.isPinned && <div className='border-bottom mb-2'>
                    <h5 style={{ color: "#B99900" }}>Pinned</h5>
                </div>}
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                        <span className="fw-bold">{agencyOfficerDrpData?.find(v => v?.value === note?.NoteByID)?.label}</span>
                        <span>•</span>
                        <span>Source: {sourceTypeDrpData?.find(v => v?.SourceTypeID === note?.SourceTypeID)?.Description}</span>
                        <span>•</span>
                        <span
                            className="badge text-white px-2 py-1 text-nowrap"
                            style={{ backgroundColor: PriorityDrpData?.find(v => v?.PriorityID === note?.ConfidenceID)?.BackColor }}
                        >
                            {PriorityDrpData?.find(v => v?.PriorityID === note?.ConfidenceID)?.Description}
                        </span>
                        <div className='d-flex justify-content-center' style={{ gap: "10px" }}>
                            {image?.map((image, index) => renderImage(image, index, note))}
                        </div>
                    </div>
                    <div className="d-flex" style={{ gap: "10px" }}>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(note.DetectiveID)}
                        >
                            <i className="fa fa-edit me-1"></i> Edit
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                                setDeleteNoteId(note.DetectiveID)
                                setShowDeleteModal(true)
                            }}
                        >
                            <i className="fa fa-trash me-1"></i> Delete
                        </button>
                        {showPinAction ? (
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handlePin(note.DetectiveID, note.isPinned)}
                            ><i className="fa fa-thumb-tack fa-lg" style={{ color: note.isPinned ? '#FF4D4F' : '#B0B0B0' }}></i>
                                {note.isPinned ? ' Unpin' : ' Pin'}
                            </button>
                        ) : (
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handlePin(note.DetectiveID, note.isPinned)}
                            ><i className="fa fa-thumb-tack fa-lg" style={{ color: note.isPinned ? '#FF4D4F' : '#B0B0B0' }}></i>
                                <i className="fa fa-thumbtack me-1 text-danger"></i> Unpin
                            </button>
                        )}
                    </div>
                </div>
                <div>{note.IntelligenceText}</div>
            </div >
        )
    }

    return (
        <div className='col-12 col-md-12 col-lg-12 mt-2'>
            {/* New Intelligence Note Form */}
            <div>
                <div className="row">
                    <div className="col-md-3 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap"> <div className="text-nowrap">Note By</div> {errorState.noteBy && isEmptyObject(formState.noteBy) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                        <Select
                            isClearable
                            options={agencyOfficerDrpData}
                            placeholder="Select"
                            styles={coloredStyle_Select}
                            value={formState.noteBy}
                            onChange={(e) => handleFormState('noteBy', e)}
                        />
                    </div>
                    <div className="col-md-3 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap"> <div className="text-nowrap">Source Type</div> {errorState.sourceType && isEmptyObject(formState.sourceType) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                        <Select
                            isClearable
                            options={sourceTypeDrpData}
                            getOptionLabel={(v) => `${v?.SourceTypeCode} | ${v?.Description}`}
                            getOptionValue={(v) => v?.SourceTypeCode}
                            formatOptionLabel={(option, { context }) => {
                                return context === 'menu'
                                    ? `${option?.SourceTypeCode} | ${option?.Description}`
                                    : option?.SourceTypeCode;
                            }}
                            placeholder="Select"
                            styles={coloredStyle_Select}
                            value={formState.sourceType}
                            onChange={(e) => handleFormState('sourceType', e)}
                        />
                    </div>
                    <div className="col-md-3 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap"> <div className="text-nowrap">Confidence</div> {errorState.confidence && isEmptyObject(formState.confidence) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                        <Select
                            isClearable
                            options={PriorityDrpData}
                            getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                            getOptionValue={(v) => v?.PriorityCode}
                            formatOptionLabel={(option, { context }) => {
                                return context === 'menu'
                                    ? `${option?.PriorityCode} | ${option?.Description}`
                                    : option?.PriorityCode;
                            }}
                            placeholder="Select"
                            styles={coloredStyle_Select}
                            value={formState.confidence}
                            onChange={(e) => handleFormState('confidence', e)}
                        />
                    </div>
                    <div className="col-md-3 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap"> <div className="text-nowrap">Date/Time</div> {errorState.dateTime && !formState.dateTime ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                        <DatePicker
                            selected={formState.dateTime}
                            onChange={(date) => handleFormState('dateTime', date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MM/dd/yyyy HH:mm"
                            placeholderText="Select"
                            className="form-control requiredColor"
                            isClearable
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb-3 d-flex" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap"> <div className="text-nowrap">Intelligence Text</div> {errorState.intelligenceText && isEmpty(formState.intelligenceText) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                        <textarea
                            className="form-control requiredColor"
                            rows="3"
                            placeholder="Placeholder"
                            value={formState.intelligenceText}
                            onChange={(e) => handleFormState('intelligenceText', e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 d-flex align-items-center mb-3" style={{ gap: "10px" }}>
                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Upload File</label>
                        <div className="text-field mt-0 w-100">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, 'text/plain', video/mp4"
                                multiple
                                className='w-100'
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />
                        </div>
                    </div>
                </div>
                <div className="tab-form-row col-10 offset-2">
                    <div className="cad-images image-preview cursor pointer">
                        {selectedImages.map((image, index) => (
                            <div
                                key={index}
                                className="cad-images image-container"
                                data-toggle="modal"
                                data-target="#ViewSingleImageModal"
                                onClick={() => {
                                    const fileType = image.FileAttachment || image.name;
                                    if (isImageFile(fileType)) {
                                        setViewSingleImage(image);
                                        setIsOpenViewSingleImageModal(true);
                                    } else {
                                        window.open(image.FileAttachment || URL.createObjectURL(image), '_blank');
                                    }
                                }}
                            >
                                {image.DetectiveID ? (
                                    isImageFile(image.FileAttachment) ? (
                                        <img
                                            src={image.FileAttachment}
                                            alt={`Selected ${index}`}
                                            width="50"
                                            height="50"
                                        />
                                    ) : (
                                        <img
                                            src={img}
                                            alt="Document Icon"
                                            width="50"
                                            height="50"
                                        />
                                    )
                                ) : (
                                    isImageFile(image.name) ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Selected ${index}`}
                                            width="50"
                                            height="50"
                                        />
                                    ) : (
                                        <img
                                            src={img}
                                            alt="Document Icon"
                                            width="50"
                                            height="50"
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
                                    {image?.DocumentID ? image?.DocumentName : image?.name || 'No Name'}
                                </p>

                                {/* Trash icon */}
                                <button
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevents the parent click handler from firing
                                        setConfirmParams({ index, image }); // Pass the parameters to use later
                                        setShowConfirmModal(true); // Open the modal
                                    }}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-end" style={{ gap: "10px" }}>
                        <button
                            type="button"
                            className="btn btn-success px-2"
                            onClick={handleNew}
                        >
                            New
                        </button>
                        <button
                            type="button"
                            className="btn btn-success px-2"
                            onClick={handleSave}
                            disabled={isDisabled}
                        >
                            {formState?.detectiveID ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <fieldset className='mt-1'>
                <legend>Filters</legend>
                <div className="row">
                    <div className="col-md-4 mt-2 mb-2 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Text Contains</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Placeholder"
                            value={filterState?.filterText}
                            onChange={(e) => handleFilterState('filterText', e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 mb-2 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Note By</label>
                        <Select
                            isClearable
                            options={agencyOfficerDrpData}
                            placeholder="Select"
                            styles={colorLessStyle_Select}
                            value={filterState?.filterNoteBy}
                            onChange={(e) => handleFilterState('filterNoteBy', e)}
                        />
                    </div>
                    <div className="col-md-3 mb-2 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Confidence</label>
                        <Select
                            isClearable
                            options={PriorityDrpData}
                            placeholder="Select"
                            styles={colorLessStyle_Select}
                            value={filterState?.filterConfidence}
                            getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                            getOptionValue={(v) => v?.PriorityCode}
                            formatOptionLabel={(option, { context }) => {
                                return context === 'menu'
                                    ? `${option?.PriorityCode} | ${option?.Description}`
                                    : option?.PriorityCode;
                            }}
                            onChange={(e) => handleFilterState('filterConfidence', e)}
                        />
                    </div>
                    <div className="col-md-2 mb-2 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Has Documents</label>
                        <input
                            type="checkbox"
                            checked={filterState?.hasDocuments || false}
                            onChange={(e) => handleFilterState('hasDocuments', e.target.checked)}
                        />
                    </div>
                </div>
            </fieldset>

            {/* Pinned Notes Section */}
            <div className="mb-2">
                <fieldset className=''>
                    <legend>Pinned Notes</legend>
                    <div className='mt-2 d-flex flex-column' style={{ gap: "10px" }}>
                        {pinnedNotes.length > 0 ? (
                            pinnedNotes.map((note, index) => (
                                <NoteCard key={note.id} note={note} index={index} showPinAction={false} />
                            ))
                        ) : (
                            <div className="text-muted text-center py-3">No pinned notes</div>
                        )}</div>
                </fieldset>
            </div>


            {/* All Notes Section */}
            <div>
                <fieldset className='mt-1'>
                    <legend>All Notes</legend>
                    <div className='mt-2 d-flex flex-column' style={{ gap: "10px" }}>
                        {allNotes.length > 0 ? (
                            allNotes.map((note, index) => (
                                <NoteCard key={note.id} note={note} index={index} showPinAction={true} />
                            ))
                        ) : (
                            <div className="text-muted text-center py-3">No notes found</div>
                        )}
                    </div>
                </fieldset>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body text-center py-5">
                                <h5 className="modal-title mt-2">Are you sure you want to delete this record?</h5>
                                <div className="btn-box mt-3">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="btn btn-sm text-white"
                                        style={{ background: "#ef233c" }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary ml-2"
                                        onClick={handleCloseDeleteModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ModalConfirm
                showModal={showConfirmModal}
                setShowModal={setShowConfirmModal}
                confirmAction=""
                handleConfirm={() => {
                    removeImage(confirmParams.index, confirmParams.image);
                    setIsDataUpdated(true)
                    setShowConfirmModal(false);
                }}
                isCustomMessage
                message="Are you sure you want to delete this item ?"
            />

            <ViewSingleImageModal isOpenViewSingleImageModal={isOpenViewSingleImageModal} setIsOpenViewSingleImageModal={setIsOpenViewSingleImageModal} viewSingleImage={viewSingleImage} id={viewSingleImage?.whiteBoardID} />

        </div>
    )
}

export default DetectiveNotes