import { memo, useState, useRef, useEffect, useContext, useCallback } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { getShowingMonthDateYear, tableCustomStyles } from "../../Components/Common/Utility";
import { customStylesWithFixedHeight, requiredFieldColourStyles } from "../Utility/CustomStylesForReact";
import useObjState from "../../CADHook/useObjState";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "../../CADUtils/functions/common";
import WhiteboardServices from "../../CADServices/APIs/whiteboard";
import { AddDelete_Img } from "../../Components/hooks/Api";
import ModalConfirm from "../Common/ModalConfirm";
import { toastifyError, toastifySuccess } from "../../Components/Common/AlertMsg";
import img from '../../../src/img/file.jpg'
import { getData_DropDown_Priority } from "../../CADRedux/actions/DropDownsData";
import DatePicker from "react-datepicker";
import { AgencyContext } from "../../Context/Agency/Index";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import ViewSingleImageModal from "../ViewSingleImageModal/ViewSingleImageModal";


const WhiteboardModal = (props) => {
    const { openWhiteboardModal, setOpenWhiteboardModal, refetchWhiteboardData, WhiteboardID, setWhiteboardID, setIsSearch } = props;
    const dispatch = useDispatch();
    const { datezone } = useContext(AgencyContext);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const [selectedImages, setSelectedImages] = useState([])
    const [badgesDropDownData, setBadgesDropDownData] = useState([]);
    const [isOpenViewSingleImageModal, setIsOpenViewSingleImageModal] = useState(false);
    const [showPage, setShowPage] = useState("home")
    const [loginPinID, setLoginPinID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [viewSingleImage, setViewSingleImage] = useState("")
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmParams, setConfirmParams] = useState(null);
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const fileInputRef = useRef(null);

    const categoryData = [
        {
            "value": 1,
            "label": "Alert"
        },
        {
            "value": 2,
            "label": "Update"
        },
        {
            "value": 3,
            "label": "Reminder"
        },
        {
            "value": 4,
            "label": "General Info"
        },
    ]

    const [
        whiteboardState,
        setWhiteboardState,
        handleWhiteboardState,
        clearWhiteboardState,
    ] = useObjState({
        category: "",
        priority: "",
        title: "",
        message: "",
        expiresDate: "",
        badgesText: ""
    });

    const [
        errorWhiteboardState,
        ,
        handleErrorWhiteboardState,
        clearErrorWhiteboardState,
    ] = useObjState({
        category: false,
        title: false,
        message: false,
    });

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
            if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const getImages = async (ID) => {
        if (ID) {
            const payload = {
                // "IsActive": true,
                whiteBoardID: ID,
                AgencyID: loginAgencyID,
            }
            const response = await WhiteboardServices.getWhiteboardDoc(payload);
            if (response?.data?.success) {
                const parsedData = JSON.parse(response?.data?.data);
                const viewImgData = parsedData?.Table;
                setSelectedImages(viewImgData)
            } else {
                setSelectedImages([]);
            }
        }
    }

    const getWhiteboardKey = `/CAD/Whiteboard/GetWhiteboard`;
    const { data: getWhiteboardData, isSuccess: isFetchWhiteboardData, isError: isNoData } = useQuery(
        [getWhiteboardKey, {
            "AgencyID": loginAgencyID,
            "WhiteboardID": WhiteboardID,
        },],
        WhiteboardServices.getWhiteboard,
        {
            refetchOnWindowFocus: false,
            enabled: openWhiteboardModal && !!loginAgencyID && !!WhiteboardID,
            retry: 0,
        }
    );
    useEffect(() => {
        if (getWhiteboardData && isFetchWhiteboardData) {
            const data = JSON.parse(getWhiteboardData?.data?.data || [])?.Table?.[0];
            setWhiteboardState({
                category: data?.categoryID,
                priority: data?.PriorityID,
                title: data?.title,
                message: data?.Message,
                expiresDate: data?.expiresDate ? new Date(data?.expiresDate) : "",
                badgesText: data?.badgesID,
            })
            getImages(data?.whiteBoardID)
        }
    }, [isFetchWhiteboardData, getWhiteboardData])

    const getDataDropDownBadges = `/CAD/MasterBadges/GetDataDropDownBadges/${loginAgencyID}`;
    const { data: getDropDownBadgesData, isSuccess: isFetchBadgesData } = useQuery(
        [getDataDropDownBadges, {
            "AgencyID": loginAgencyID
        },],
        MasterTableListServices.getDataDropDownBadges,
        {
            refetchOnWindowFocus: false,
            enabled: openWhiteboardModal,
        }
    );

    useEffect(() => {
        if (getDropDownBadgesData && isFetchBadgesData) {
            const data = JSON.parse(getDropDownBadgesData?.data?.data);
            setBadgesDropDownData(data?.Table)
        } else {
            setBadgesDropDownData([])
        }
    }, [getDropDownBadgesData, isFetchBadgesData])

    function handleCancel() {
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.pushState(null, '', baseUrl);
        handelClear();
        setOpenWhiteboardModal(false)
        refetchWhiteboardData()
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            handleCancel();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

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
            whiteBoardID: ID,
            IsActive: true,
            AgencyID: loginAgencyID,
            CreatedByUserFK: loginPinID,
        };

        const valuesArray = [`${JSON.stringify(val)}`];
        const formattedValues = JSON.stringify(valuesArray);
        formdata.append("Data", formattedValues);
        const res = await AddDelete_Img('/CAD/Whiteboard/InsertwhiteBoardDocument', formdata, EncFormdata)
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
                AgencyID: loginAgencyID,
            }
            await WhiteboardServices.deleteWhiteboardDoc(payload);
        }
    };

    const changeLogList = [];

    const isImageFile = (fileName) => {
        const imageExtensions = /\.(png|jpg|jpeg|jfif|bmp|gif|webp|tiff|tif|svg|ico|heif|heic)$/i;
        return imageExtensions.test(fileName);
    };

    function handelClear() {
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.pushState(null, '', baseUrl);
        clearWhiteboardState();
        clearErrorWhiteboardState();
        setSelectedImages([]);
        setIsDataUpdated(false);
        setIsLoading(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const validateForm = () => {
        let isError = false;
        const keys = Object.keys(errorWhiteboardState);
        keys.map((field) => {
            if (
                field === "title" &&
                isEmpty(whiteboardState[field])) {
                handleErrorWhiteboardState(field, true);
                isError = true;
            } else if (
                field === "category" &&
                isEmpty(whiteboardState[field])) {
                handleErrorWhiteboardState(field, true);
                isError = true;
            } else if (
                field === "message" &&
                isEmpty(whiteboardState[field])) {
                handleErrorWhiteboardState(field, true);
                isError = true;
            } else {
                handleErrorWhiteboardState(field, false);
            }
            return null;
        });
        return !isError;
    };

    async function handleSave() {
        if (!validateForm()) return
        setIsLoading(true)
        const isUpdate = !!WhiteboardID
        const data = {
            WhiteboardID: isUpdate ? WhiteboardID : undefined,
            categoryID: whiteboardState?.category,
            PriorityID: whiteboardState?.priority,
            title: whiteboardState?.title,
            Message: whiteboardState?.message,
            expiresDate: whiteboardState?.expiresDate ? getShowingMonthDateYear(whiteboardState?.expiresDate) : null,
            AgencyID: loginAgencyID,
            IsArchived: 0,
            CreatedByUserFK: isUpdate ? undefined : loginPinID,
            ModifiedByUserFK: isUpdate ? loginPinID : undefined,
            badgesID: whiteboardState?.badgesText
                ? typeof whiteboardState.badgesText === "object"
                    ? whiteboardState.badgesText.badgesID
                    : whiteboardState.badgesText
                : null,
        }


        let response = []
        if (isUpdate) {
            response = await WhiteboardServices.updateWhiteboard(data);
        } else {
            response = await WhiteboardServices.insertWhiteboard(data);
        }
        if (response?.status === 200) {
            const data = JSON.parse(response?.data?.data);
            if (selectedImages.length > 0) {
                await Add_Documents(WhiteboardID ? WhiteboardID : data?.Table?.[0]?.whiteBoardID);
                refetchWhiteboardData();
            } else {
                refetchWhiteboardData();
            }
            toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
        }

        handelClear()
        setOpenWhiteboardModal(false)
        setIsLoading(false)
        setWhiteboardID("")
        setIsSearch(false)
    }

    const changeLogColumns = [
        {
            name: "Column Name",
            selector: (row) => (row.MiddleName ? row.MiddleName : ""),
            sortable: true,
        },
        {
            name: "Old Value",
            selector: (row) => (row.FirstName ? row.FirstName : ""),

            sortable: true,
        },
        {
            name: "New Value",
            selector: (row) => (row.PhoneType ? row.PhoneType : ""),
            sortable: true,
        },
        {
            name: "Change Date",
            selector: (row) =>
                row.PhoneNo || "",
            sortable: true,
        },
    ];

    return (
        <>
            {openWhiteboardModal ? (
                <dialog
                    className="modal fade modal-cad"
                    style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflow: "hidden", }}
                    id="WhiteboardModal"
                    tabIndex="-1"
                    aria-hidden="true"
                    data-backdrop="false"
                >
                    <div className="modal-dialog modal-dialog-centered modal-xl1">
                        <div className="modal-content modal-content-cad" style={{
                            maxHeight: "calc(100vh - 100px)",
                            overflowY: "auto",
                        }}>
                            <div className="modal-body py-1 px-2">
                                {/* Modal Header */}
                                <div className="row">
                                    <div className="col-12 ">
                                        <div className="py-1 px-2 d-flex justify-content-between align-items-center">
                                            <p
                                                className="p-0 m-0 font-weight-medium"
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: 500,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                {WhiteboardID ? "Edit Whiteboard" : "Add Whiteboard"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-1">
                                    <div className="col-12 name-tab m-0">
                                        <ul className='nav nav-tabs mx-1'>
                                            <span
                                                className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                                                style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { setShowPage('home') }}
                                            >
                                                <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
                                            </span>
                                            <span
                                                className={`nav-item border-0 ${showPage === 'changeLog' ? 'active' : ''}`}
                                                style={{ color: showPage === 'changeLog' ? 'Red' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { }}
                                            >
                                                Change Log
                                            </span>
                                        </ul>
                                    </div>
                                </div>
                                {showPage === 'home' &&
                                    <>
                                        <div className="m-1">
                                            <fieldset style={{ border: "1px solid gray" }}>
                                                <div className="tab-form-container">
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label ">Category{errorWhiteboardState.category && isEmpty(whiteboardState?.category) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Category"}</p>
                                                            )}</label>
                                                        </div>
                                                        <div className="d-flex col-10">
                                                            <Select
                                                                name="category"
                                                                styles={requiredFieldColourStyles}
                                                                options={categoryData}
                                                                value={whiteboardState?.category ? categoryData?.find((i) => i?.value === whiteboardState?.category) : ""}
                                                                getOptionLabel={(v) => v?.label}
                                                                getOptionValue={(v) => v?.value}
                                                                onChange={(e) => handleWhiteboardState("category", e?.value)}
                                                                placeholder="Select..."
                                                                className="w-100 requiredColor"
                                                            />
                                                            <div className="col-1 d-flex justify-content-end align-items-center">
                                                                <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Priority</label>
                                                            </div>
                                                            <Select
                                                                isClearable
                                                                options={PriorityDrpData}
                                                                placeholder="Select..."
                                                                styles={customStylesWithFixedHeight}

                                                                getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                                                getOptionValue={(v) => v?.Description}
                                                                formatOptionLabel={(option, { context }) => {
                                                                    return context === 'menu'
                                                                        ? `${option?.PriorityCode} | ${option?.Description}`
                                                                        : option?.Description;
                                                                }}
                                                                className="w-100"
                                                                name="priority"
                                                                value={whiteboardState.priority ? PriorityDrpData?.find((i) => i?.PriorityID === whiteboardState.priority) : ""}
                                                                onChange={(e) => {
                                                                    handleWhiteboardState("priority", e?.PriorityID)
                                                                }}
                                                                onInputChange={(inputValue, actionMeta) => {
                                                                    if (inputValue.length > 12) {
                                                                        return inputValue.slice(0, 12);
                                                                    }
                                                                    return inputValue;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex align-self-center justify-content-end ">
                                                            <label for="" className="tab-form-label">Title {errorWhiteboardState.title && isEmpty(whiteboardState?.title) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Title"}</p>
                                                            )}</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                type="text"
                                                                className="form-control requiredColor py-1 new-input"
                                                                name="title"
                                                                placeholder="Title"
                                                                value={whiteboardState.title}
                                                                onChange={(e) => {
                                                                    handleWhiteboardState("title", e.target.value)
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Message Field */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex align-self-center justify-content-end ">
                                                            <label for="" className="tab-form-label">Message  {errorWhiteboardState.message && isEmpty(whiteboardState?.message) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Message"}</p>
                                                            )}</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <textarea
                                                                name="message"
                                                                type="text"
                                                                rows="4"
                                                                className="form-control  py-1 new-input requiredColor"
                                                                style={{ height: "auto", overflowY: "scroll" }}
                                                                placeholder="Message"
                                                                value={whiteboardState?.message}
                                                                onChange={(e) => {
                                                                    handleWhiteboardState("message", e.target.value)
                                                                    e.target.style.height = "auto";
                                                                    const maxHeight = 5 * parseFloat(getComputedStyle(e.target).lineHeight);
                                                                    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Image Upload Section */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Upload File</label>
                                                        </div>
                                                        <div className="col-10 text-field mt-0">
                                                            <input
                                                                type="file"
                                                                accept="image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, 'text/plain', video/mp4"
                                                                multiple
                                                                onChange={handleImageChange}
                                                                ref={fileInputRef}
                                                            />
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
                                                                    {image.whiteBoardID ? (
                                                                        isImageFile(image.FileAttachment) ? (
                                                                            <img
                                                                                src={image.FileAttachment}
                                                                                alt={`Selected ${index}`}
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
                                                                        isImageFile(image.name) ? (
                                                                            <img
                                                                                src={URL.createObjectURL(image)}
                                                                                alt={`Selected ${index}`}
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
                                                    {/* Additional Form Fields */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Expires</label>
                                                        </div>
                                                        <div className="col-2 text-field mt-0">
                                                            <DatePicker
                                                                name='expiresDate'
                                                                id='expiresDate'
                                                                onChange={(date) => {
                                                                    handleWhiteboardState("expiresDate", date);
                                                                    // Clear badgesText if date is cleared
                                                                    if (!date) {
                                                                        handleWhiteboardState("badgesText", "");
                                                                    }
                                                                }}
                                                                selected={whiteboardState?.expiresDate || ""}
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                timeIntervals={1}
                                                                // filterTime={(date) => filterPassedTimeZone(date, datezone)}
                                                                timeCaption="Time"
                                                                showMonthDropdown
                                                                // disabled={!whiteboardState?.reportedFromDate}
                                                                // className={!whiteboardState?.reportedFromDate ? 'readonlyColor' : ''}
                                                                showYearDropdown
                                                                showTimeSelect
                                                                timeInputLabel
                                                                isClearable={whiteboardState?.expiresDate ? true : false}
                                                                timeFormat="HH:mm "
                                                                showDisabledMonthNavigation
                                                                is24Hour
                                                                dropdownMode="select"
                                                                autoComplete="off"
                                                                placeholderText="Select Expires Date..."
                                                                minDate={new Date(datezone)}
                                                            />
                                                        </div>
                                                        <div className="col-1 d-flex justify-content-end">
                                                            <label className="tab-form-label">Badge Text</label>
                                                        </div>
                                                        <div className="col-3">
                                                            <Select
                                                                name="badgesText"
                                                                styles={customStylesWithFixedHeight}
                                                                options={badgesDropDownData}
                                                                value={whiteboardState?.badgesText ? badgesDropDownData?.find((i) => i?.badgesID === whiteboardState?.badgesText) : ""}
                                                                getOptionLabel={(v) => v?.badgesText}
                                                                getOptionValue={(v) => v?.badgesID}
                                                                onChange={(e) => handleWhiteboardState("badgesText", e)
                                                                }
                                                                placeholder="Select..."
                                                                className="w-100"
                                                                menuPlacement="top"
                                                                isClearable
                                                                isDisabled={!whiteboardState?.expiresDate} />
                                                        </div>
                                                        <div className="col-4 d-flex justify-content-end align-items-center">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Days Before Expiration Date</label>
                                                            <input
                                                                type="text"
                                                                className="form-control requiredColor py-1 new-input"
                                                                name="expirationDays"
                                                                placeholder="Expiration Days"
                                                                // value={whiteboardState?.badgesText?.daysBeforeExpirationDate || ""}
                                                                value={
                                                                    whiteboardState?.badgesText?.daysBeforeExpirationDate ||
                                                                    badgesDropDownData?.find((i) => i?.badgesID === whiteboardState?.badgesText)?.daysBeforeExpirationDate ||
                                                                    ""
                                                                }
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="row">
                                                        <div className="col-12 p-0">
                                                            <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                                <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                                    <button
                                                                        type="button"
                                                                        className="save-button"
                                                                        disabled={isLoading || (!!whiteboardState?.whiteBoardID && !isDataUpdated)}
                                                                        onClick={() => handleSave()}
                                                                    >
                                                                        {WhiteboardID ? "Update" : "Save"}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="cancel-button"
                                                                        onClick={() => handelClear()}
                                                                    >
                                                                        Clear
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        data-dismiss="modal"
                                                                        className="cancel-button"
                                                                        onClick={() => handleCancel()}
                                                                    >
                                                                        Close
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </>}
                                {showPage === 'changeLog' && <div className="table-responsive  mt-2" style={{ position: "sticky" }}>
                                    <DataTable
                                        dense
                                        columns={changeLogColumns}
                                        data={changeLogList}
                                        customStyles={tableCustomStyles}
                                        pagination
                                        responsive
                                        striped
                                        highlightOnHover
                                        fixedHeader
                                        selectableRowsHighlight
                                        fixedHeaderScrollHeight="190px"
                                        persistTableHead={true}
                                    />
                                </div>}
                            </div>
                        </div>
                    </div>
                </dialog>
            ) : null}
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

            <ViewSingleImageModal isOpenViewSingleImageModal={isOpenViewSingleImageModal} setIsOpenViewSingleImageModal={setIsOpenViewSingleImageModal} viewSingleImage={viewSingleImage} id={viewSingleImage.whiteBoardID} />

        </>
    );
};

export default memo(WhiteboardModal);

// PropTypes definition
WhiteboardModal.propTypes = {
  openWhiteboardModal: PropTypes.bool.isRequired,
  setOpenWhiteboardModal: PropTypes.func.isRequired,
  refetchWhiteboardData: PropTypes.func,
  WhiteboardID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setWhiteboardID: PropTypes.func,
  setIsSearch: PropTypes.func
};

// Default props
WhiteboardModal.defaultProps = {
  refetchWhiteboardData: () => {},
  WhiteboardID: null,
  setWhiteboardID: () => {},
  setIsSearch: () => {}
};
