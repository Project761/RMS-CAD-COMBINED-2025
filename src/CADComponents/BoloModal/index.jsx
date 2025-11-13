import { memo, useState, useRef, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { colourStyles, getShowingDateText, tableCustomStyles } from "../../Components/Common/Utility";
import BoloSearchModal from "../BoloSearchModal";
import CallTakerModal from "../CallTakerModal";
import { colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import { useQuery } from "react-query";
import { IncidentContext } from "../../CADContext/Incident";
import useObjState from "../../CADHook/useObjState";
import { useSelector, useDispatch } from "react-redux";
import { compareStrings, dropDownDataModel } from "../../CADUtils/functions/common";
import BoloServices from "../../CADServices/APIs/bolo";
import CloseBoloModal from "../CloseBoloModal";
import { AddDelete_Img, ScreenPermision } from "../../Components/hooks/Api";
import ViewImageModal from "../ViewImageModal/ViewImageModal";
import Tooltip from "../Common/Tooltip";
import ViewSingleImageModal from "../ViewSingleImageModal/ViewSingleImageModal";
import ModalConfirm from "../Common/ModalConfirm";
import { toastifyError } from "../../Components/Common/AlertMsg";
import img from '../../../src/img/file.jpg'
import { getData_DropDown_Priority, getData_DropDown_Zone } from "../../CADRedux/actions/DropDownsData";
import ReactQuill from "react-quill";

// Custom hooks for complex logic
const useBoloData = (loginAgencyID, openBoloModal, typeOfBoloFilter, priorityFilter) => {
    const getBoloKey = `/CAD/Bolo/GetBolo`;
    return useQuery(
        [getBoloKey, {
            "AgencyID": loginAgencyID,
            "BoloTypeID": typeOfBoloFilter,
            "PriorityID": priorityFilter
        }],
        BoloServices.getBolo,
        {
            refetchOnWindowFocus: false,
            enabled: openBoloModal && !!loginAgencyID,
            retry: 0,
        }
    );
};

const useBoloTypeData = (loginAgencyID, openBoloModal) => {
    const getBoloTypeKey = `/CAD/MasterBoloType/GetData_DropDown_BoloType/${loginAgencyID}`;
    return useQuery(
        [getBoloTypeKey, { "AgencyID": loginAgencyID }],
        MasterTableListServices.getData_DropDown_BoloType,
        {
            refetchOnWindowFocus: false,
            enabled: openBoloModal && !!loginAgencyID,
        }
    );
};

const useBoloByIdData = (searchBoloID, loginAgencyID, openBoloModal, openBoloSearchModal) => {
    const getByIdBoloKey = `/CAD/Bolo/GetBolo/${searchBoloID}`;
    return useQuery(
        [getByIdBoloKey, {
            "BoloID": searchBoloID,
            "AgencyID": loginAgencyID
        }],
        BoloServices.getBolo,
        {
            refetchOnWindowFocus: false,
            enabled: openBoloModal && !!loginAgencyID && !!searchBoloID && !openBoloSearchModal,
        }
    );
};

// Utility functions
const validateFileUpload = (files) => {
    const maxFileSizeInMB = 10;
    const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;
    const allowedTypes = [
        'image/png', 'image/jpeg', 'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv', 'text/plain', 'video/mp4'
    ];

    const validFiles = [];
    const invalidFileTypes = [];
    const oversizedFiles = [];

    files.forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
            invalidFileTypes.push(file.name);
        } else if (file.size > maxFileSizeInBytes) {
            oversizedFiles.push(file.name);
        } else {
            validFiles.push(file);
        }
    });

    return { validFiles, invalidFileTypes, oversizedFiles };
};

const isImageFile = (fileName) => {
    const imageExtensions = /\.(png|jpg|jpeg|jfif|bmp|gif|webp|tiff|tif|svg|ico|heif|heic)$/i;
    return imageExtensions.test(fileName);
};

const getText = (html) => {
    let divContainer = document.createElement("div");
    divContainer.innerHTML = html;
    return divContainer.textContent || divContainer.innerText || "";
};

const BoloModal = (props) => {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const dispatch = useDispatch();
    const { openBoloModal, setOpenBoloModal } = props;

    // State variables
    const [selectedImages, setSelectedImages] = useState([]);
    const [viewImg, setViewImg] = useState([]);
    const [imageModalStatus, setImageModalStatus] = useState(false);
    const [isOpenViewSingleImageModal, setIsOpenViewSingleImageModal] = useState(false);
    const [typeOFBOLO, setTypeOFBOLO] = useState([]);
    const [zoneDropDown, setZoneDropDown] = useState([]);
    const [showPage, setShowPage] = useState("home");
    const [openBoloSearchModal, setOpenBoloSearchModal] = useState(false);
    const [openCallTakerModal, setCallTakerModal] = useState(false);
    const [openCloseBolo, setOpenCloseBolo] = useState(false);
    const [loginPinID, setLoginPinID] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [typeOfBoloFilter, setTypeOfBoloFilter] = useState('');
    const [searchBoloID, setSearchBoloID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [boloList, setBoloList] = useState([]);
    const [incNo, setIncNo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [viewSingleImage, setViewSingleImage] = useState("");
    const [clickedRow, setClickedRow] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmParams, setConfirmParams] = useState(null);
    const [isDataUpdated, setIsDataUpdated] = useState(false);
    const [effectiveBoloScreenPermission, setEffectiveBoloScreenPermission] = useState(null);
    const [canAddBolo, setCanAddBolo] = useState(false);
    const [canUpdateBolo, setCanUpdateBolo] = useState(false);
    const [canDeleteBolo, setCanDeleteBolo] = useState(false);
    const fileInputRef = useRef(null);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
    const { incidentData, resourceRefetch, incidentRefetch } = useContext(IncidentContext);

    // Custom hooks for data fetching
    const { data: getBoloData, isSuccess: isFetchBoloData, refetch, isError: isNoData } = useBoloData(loginAgencyID, openBoloModal, typeOfBoloFilter, priorityFilter);
    const { data: getBoloTypeData, isSuccess: isFetchBoloType } = useBoloTypeData(loginAgencyID, openBoloModal);
    const { data: getByIdBoloData, isSuccess: isFetchByIdBoloData } = useBoloByIdData(searchBoloID, loginAgencyID, openBoloModal, openBoloSearchModal);

    const [
        boloState,
        setBoloState,
        handleBoloState,
        clearBoloState,
    ] = useObjState({
        BoloID: "",
        TypeOfBolo: "",
        IncidentID: "",
        Priority: "",
        Zone: "",
        Message: "",
        DeleteAfter: "",
        BOLODisposition: ""
    });

    const [
        initialBoloState,
        setInitialBoloState,
        ,
        ,
    ] = useObjState({
        BoloID: "",
        TypeOfBolo: "",
        IncidentID: "",
        Priority: "",
        Zone: "",
        Message: "",
        DeleteAfter: "",
        BOLODisposition: ""
    });

    const [
        errorState,
        ,
        handleErrorState,
        clearErrorState,
    ] = useObjState({
        Message: false,
    });

    // Effect handlers
    useEffect(() => {
        if (incNo) {
            setBoloState(prevState => ({
                ...prevState,
                IncidentID: incNo
            }));
        }
    }, [incNo]);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
            getBoloScreenPermission(localStoreData?.AgencyID, localStoreData?.PINID);
            if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) {
                dispatch(getData_DropDown_Priority(localStoreData?.AgencyID));
            }
            if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) {
                dispatch(getData_DropDown_Zone(localStoreData?.AgencyID));
            }
        }
    }, [localStoreData, PriorityDrpData, ZoneDrpData, dispatch]);

    const getBoloScreenPermission = (aId, pinID) => {
        try {
            ScreenPermision("BL101", aId, pinID).then(res => {
                if (res) {
                    setEffectiveBoloScreenPermission(res);
                    // Set individual permissions based on AddOK, Changeok, and DeleteOK
                    setCanAddBolo(res?.[0]?.AddOK === 1);
                    setCanUpdateBolo(res?.[0]?.Changeok === 1);
                    setCanDeleteBolo(res?.[0]?.DeleteOK === 1);
                }
                else {
                    setEffectiveBoloScreenPermission(null);
                    setCanAddBolo(false);
                    setCanUpdateBolo(false);
                    setCanDeleteBolo(false);
                }
            });
        } catch (error) {
            console.error('There was an error!', error);
            setEffectiveBoloScreenPermission(null);
            setCanAddBolo(false);
            setCanUpdateBolo(false);
            setCanDeleteBolo(false);
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const boloID = params.get("boloID");
        setSearchBoloID(boloID);
        getImages(boloID);
    }, [openBoloSearchModal]);

    useEffect(() => {
        if (getByIdBoloData && isFetchByIdBoloData) {
            const data = JSON.parse(getByIdBoloData?.data?.data || [])?.Table?.[0];
            setBoloState({
                BoloID: data?.BoloID,
                TypeOfBolo: data?.BoloTypeID,
                IncidentID: data?.IncidentID,
                Priority: data?.PriorityID,
                Zone: data?.ZoneID,
                Message: data?.Message,
                DeleteAfter: data?.DeleteAfter,
                BOLODisposition: data?.BoloDispositionID,
            });
        }
    }, [isFetchByIdBoloData, getByIdBoloData]);

    useEffect(() => {
        if (isFetchBoloData && getBoloData) {
            const data = JSON.parse(getBoloData?.data?.data || []);
            setBoloList(data?.Table);
        } else {
            setBoloList([]);
        }
    }, [isFetchBoloData, getBoloData]);

    useEffect(() => {
        if (ZoneDrpData) {
            setZoneDropDown(dropDownDataModel(ZoneDrpData, "ZoneID", "ZoneDescription"));
        }
    }, [ZoneDrpData]);

    useEffect(() => {
        if (getBoloTypeData && isFetchBoloType) {
            const data = JSON.parse(getBoloTypeData?.data?.data);
            setTypeOFBOLO(data?.Table);
        } else {
            setTypeOFBOLO([]);
        }
    }, [getBoloTypeData, isFetchBoloType]);

    useEffect(() => {
        if (initialBoloState) {
            setIsDataUpdated(JSON.stringify(boloState) !== JSON.stringify(initialBoloState));
        }
    }, [boloState, initialBoloState]);

    // Event handlers
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const { validFiles, invalidFileTypes, oversizedFiles } = validateFileUpload(files);

        if (invalidFileTypes.length > 0) {
            toastifyError(`Invalid file(s): ${invalidFileTypes.join(", ")}. Allowed types are: image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, text/plain, video/mp4.`);
        }

        if (oversizedFiles.length > 0) {
            toastifyError(`File size exceeds limit.`);
        }

        if (validFiles.length > 0) {
            setSelectedImages((prevImages) => [...prevImages, ...validFiles]);
            setIsDataUpdated(true);
        }
        event.target.value = "";
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
            };
            await BoloServices.deleteBoloDoc(payload);
        }
    };

    const handleCancel = () => {
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.pushState(null, '', baseUrl);
        handelClear();
        setOpenBoloModal(false);
    };

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

    const handelClear = () => {
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.pushState(null, '', baseUrl);
        clearBoloState();
        clearErrorState();
        setSelectedImages([]);
        setPriorityFilter("");
        setTypeOfBoloFilter("");
        setClickedRow("");
        setIsDataUpdated(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handelSetEditData = async (data) => {
        setBoloState({
            BoloID: data?.BoloID || "",
            TypeOfBolo: data?.BoloTypeID || "",
            IncidentID: data?.IncidentID || "",
            Priority: data?.PriorityID || "",
            Zone: data?.ZoneID || "",
            Message: data?.Message || "",
            DeleteAfter: data?.DeleteAfter || "",
            BOLODisposition: data?.BoloDispositionID || "",
        });
        setInitialBoloState({
            BoloID: data?.BoloID || "",
            TypeOfBolo: data?.BoloTypeID || "",
            IncidentID: data?.IncidentID || "",
            Priority: data?.PriorityID || "",
            Zone: data?.ZoneID || "",
            Message: data?.Message || "",
            DeleteAfter: data?.DeleteAfter || "",
            BOLODisposition: data?.BoloDispositionID || "",
        });
        getImages(data?.BoloID);
    };

    const getImages = async (boloID) => {
        if (!boloID) return;

        const payload = {
            "IsActive": true,
            "BoloId": boloID,
            AgencyID: loginAgencyID,
        };
        const response = await BoloServices.getBoloDoc(payload);
        if (response?.data?.success) {
            const parsedData = JSON.parse(response?.data?.data);
            const viewImgData = parsedData?.Table;
            setSelectedImages(viewImgData);
        } else {
            setSelectedImages([]);
        }
    };

    const viewBoloImage = async (data) => {
        setImageModalStatus(true);
        if (data?.BoloID) {
            const payload = {
                "IsActive": true,
                "BoloId": data?.BoloID,
                AgencyID: loginAgencyID,
            };
            const response = await BoloServices.getBoloDoc(payload);
            if (response?.data?.success) {
                const parsedData = JSON.parse(response?.data?.data);
                const viewImgData = parsedData?.Table;
                setViewImg(viewImgData);
            } else {
                setViewImg([]);
            }
        }
    };

    const validateForm = () => {
        let isError = false;
        const keys = Object.keys(errorState);
        keys.forEach((field) => {
            if (field === "Message" && (boloState?.Message === "" || boloState?.Message === null || boloState?.Message === "<p><br></p>")) {
                handleErrorState(field, true);
                isError = true;
            } else {
                handleErrorState(field, false);
            }
        });
        return !isError;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        const isUpdate = !!boloState?.BoloID;
        const data = {
            BoloID: isUpdate ? boloState?.BoloID : undefined,
            IncidentId: boloState?.IncidentID,
            BoloTypeId: boloState?.TypeOfBolo,
            PriorityId: boloState?.Priority,
            ZoneId: boloState?.Zone,
            Message: boloState?.Message,
            DeleteAfterDays: boloState?.DeleteAfter,
            BoloDispositionId: boloState?.BOLODisposition,
            IsArchived: 0,
            AgencyID: loginAgencyID,
            CreatedByUserFK: isUpdate ? undefined : loginPinID,
            ModifiedByUserFK: isUpdate ? loginPinID : undefined
        };

        const response = await BoloServices.insertBolo(data);
        if (response?.status === 200) {
            const responseData = JSON.parse(response?.data?.data);
            if (selectedImages.length > 0) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                Add_Documents(boloState?.BoloID ? boloState?.BoloID : responseData?.Table?.[0]?.BoloTypeID);
            }
            refetch();
            // incidentRefetch();
            resourceRefetch();
        }
        handelClear();
        setIsLoading(false);
    };

    const Add_Documents = async (BoloTypeID) => {
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
            BoloId: BoloTypeID,
            IsActive: true,
            AgencyID: loginAgencyID,
            CreatedByUserFK: loginPinID,
        };

        const valuesArray = [`${JSON.stringify(val)}`];
        const formattedValues = JSON.stringify(valuesArray);
        formdata.append("Data", formattedValues);

        AddDelete_Img('/CAD/Bolo/InsertBoloDocuments', formdata, EncFormdata)
            .then((res) => {
                if (res.success) {
                    refetch();
                    clearBoloState();
                    clearErrorState();
                    incidentRefetch();
                    resourceRefetch();
                } else {
                    console.warn("Something went wrong");
                }
            })
            .catch(err => console.warn("Error:", err));
    };

    const handleImageClick = (image) => {
        const fileType = image.FileAttachment || image.name;
        if (isImageFile(fileType)) {
            setViewSingleImage(image);
            setIsOpenViewSingleImageModal(true);
        } else {
            window.open(image.FileAttachment || URL.createObjectURL(image), '_blank');
        }
    };

    const handleImageKeyDown = (e, image) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleImageClick(image);
        }
    };

    const handleDeleteImage = (e, index, image) => {
        e.stopPropagation();
        setConfirmParams({ index, image });
        setShowConfirmModal(true);
    };

    // Table configuration
    const contactList = [];
    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const columns2 = [
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
            selector: (row) => row.PhoneNo || "",
            sortable: true,
        },
    ];

    const columns = [
        {
            name: "Priority",
            selector: (row) => (row.Priority ? row.Priority : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Priority, rowB.Priority),
            width: "120px",
        },
        {
            name: "CAD Event #",
            selector: (row) => (row.IncidentNumber ? row.IncidentNumber : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.IncidentNumber, rowB.IncidentNumber),
            width: "120px",
        },
        {
            name: "Updated Date and Time",
            selector: (row) => (row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CreatedDtTm, rowB.CreatedDtTm),
            width: "180px",
        },
        {
            name: "Elapsed Days",
            selector: (row) => (row.ElapsedDays ? row.ElapsedDays : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ElapsedDays, rowB.ElapsedDays),
            width: "120px",
        },
        {
            name: "BOLO Type",
            selector: (row) => (row.BoloType ? row.BoloType : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.BoloType, rowB.BoloType),
            width: "140px",
        },
        {
            name: "Message",
            selector: (row) => (row.Message ? row.Message : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Message, rowB.Message),
            cell: (row) => (
                <Tooltip text={getText(row?.Message) || ''} maxLength={50} tooltipTextLimit={120} />
            ),
        },
        {
            name: "Dispatcher",
            selector: (row) => (row.FullName ? row.FullName : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.FullName, rowB.FullName),
            width: "170px",
        },
        {
            name: "Delete After",
            selector: (row) => (row.DeleteAfter ? row.DeleteAfter : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.DeleteAfter, rowB.DeleteAfter),
            width: "120px",
        },
    ];

    const customStylesWithFixedHeight = {
        ...colorLessStyle_Select,
        menu: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: "10"
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: "10"
        }),
    };

    // Render methods
    const renderImagePreview = () => (
        <div className="cad-images image-preview cursor pointer">
            {selectedImages.map((image, index) => (
                <div
                    key={index}
                    className="cad-images image-container"
                    data-toggle="modal"
                    data-target="#ViewSingleImageModal"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleImageClick(image)}
                    onKeyDown={(e) => handleImageKeyDown(e, image)}
                    aria-label={`View ${image?.DocumentID ? image?.DocumentName : image?.name || 'file'}`}
                >
                    {image.BoloID ? (
                        isImageFile(image.FileAttachment) ? (
                            <img
                                src={image.FileAttachment}
                                alt={`Selected ${index}`}
                                style={{ width: '30px', height: '30px' }}
                            />
                        ) : (
                            <img
                                src={img}
                                alt="Document Icon"
                                style={{ width: '30px', height: '30px' }}
                            />
                        )
                    ) : (
                        isImageFile(image.name) ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Selected ${index}`}
                                style={{ width: '30px', height: '30px' }}
                            />
                        ) : (
                            <img
                                src={img}
                                alt="Document Icon"
                                style={{ width: '30px', height: '30px' }}
                            />
                        )
                    )}

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
                        <Tooltip text={image?.DocumentID ? image?.DocumentName : image?.name || 'No Name'} isRight isSmallFont maxLength={10} />
                    </p>

                    <button
                        className="delete-button"
                        onClick={(e) => handleDeleteImage(e, index, image)}
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            ))}
        </div>
    );

    const renderForm = () => {
        const closeBoloButton = !!boloState?.BoloID && canDeleteBolo && (
            <button
                type="button"
                className="cancel-button"
                data-toggle="modal"
                data-target="#BoloCloseModal"
                onClick={() => { setOpenCloseBolo(true); }}
            >
                Close Bolo
            </button>
        );
        const modules = {
            toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'size': ['small', 'medium', 'large', 'huge'] }],  // Font size options
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'color': [] }, { 'background': [] }],  // Text color and background color
                ['blockquote'],
            ],
        };

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
            // "link",
            "indent",
            // "image",
            "code-block",
            "color",
        ];
        return (
            <div className="m-1">
                <fieldset style={{ border: "1px solid gray" }}>
                    <div className="tab-form-container">
                        <div className="tab-form-row">
                            <div className="col-1 d-flex justify-content-end">
                                <label htmlFor="TypeOfBolo" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Type of BOLO</label>
                            </div>
                            <div className="d-flex col-11">
                                <Select
                                    id="TypeOfBolo"
                                    name="TypeOfBolo"
                                    styles={customStylesWithFixedHeight}
                                    isClearable
                                    options={typeOFBOLO}
                                    value={boloState?.TypeOfBolo ? typeOFBOLO?.find((i) => i?.BoloTypeID == boloState?.TypeOfBolo) : ""}
                                    getOptionLabel={(v) => v?.Description}
                                    getOptionValue={(v) => v?.BoloTypeID}
                                    onChange={(e) => handleBoloState("TypeOfBolo", e?.BoloTypeID)}
                                    placeholder="Select..."
                                    className="w-100"
                                />
                                <div className="col-1 d-flex justify-content-end align-items-center">
                                    <label htmlFor="IncidentID" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">CAD Event #</label>
                                </div>
                                <Select
                                    id="IncidentID"
                                    name="IncidentID"
                                    styles={customStylesWithFixedHeight}
                                    isClearable
                                    options={incidentData}
                                    value={boloState?.IncidentID ? incidentData?.find((i) => i?.IncidentID === boloState?.IncidentID) : ""}
                                    getOptionLabel={(v) => v?.CADIncidentNumber}
                                    getOptionValue={(v) => v?.IncidentID}
                                    onChange={(e) => handleBoloState("IncidentID", e?.IncidentID)}
                                    placeholder="Select..."
                                    className="w-100"
                                />
                                <button
                                    type="button"
                                    className="btn btn-sm btn-border ml-1"
                                    style={{ width: "85px" }}
                                    data-toggle="modal"
                                    data-target="#CallTakerModal"
                                    onClick={() => setCallTakerModal(true)}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                                <div className="col-1 d-flex justify-content-end align-items-center">
                                    <label htmlFor="Priority" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Priority</label>
                                </div>
                                <Select
                                    id="Priority"
                                    isClearable
                                    options={PriorityDrpData}
                                    placeholder="Select..."
                                    styles={customStylesWithFixedHeight}
                                    getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                    getOptionValue={(v) => v?.PriorityCode}
                                    formatOptionLabel={(option, { context }) => {
                                        return context === 'menu'
                                            ? `${option?.PriorityCode} | ${option?.Description}`
                                            : option?.PriorityCode;
                                    }}
                                    className="w-100"
                                    name="Priority"
                                    value={boloState.Priority ? PriorityDrpData?.find((i) => i?.PriorityID === boloState.Priority) : ""}
                                    onChange={(e) => handleBoloState("Priority", e?.PriorityID)}
                                    onInputChange={(inputValue, actionMeta) => {
                                        if (inputValue.length > 12) {
                                            return inputValue.slice(0, 12);
                                        }
                                        return inputValue;
                                    }}
                                />
                                <div className="col-1 d-flex justify-content-end align-items-center">
                                    <label htmlFor="Zone" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Zone</label>
                                </div>
                                <Select
                                    id="Zone"
                                    name="Zone"
                                    styles={customStylesWithFixedHeight}
                                    isClearable
                                    options={zoneDropDown}
                                    value={boloState?.Zone ? zoneDropDown?.find((i) => i?.value === boloState?.Zone) : ""}
                                    onChange={(e) => handleBoloState("Zone", e?.value)}
                                    placeholder="Select..."
                                    className="w-100"
                                />
                            </div>
                        </div>

                        <div className="tab-form-row mt-2">
                            <div className="col-1 d-flex align-self-center justify-content-end">
                                <label htmlFor="Message" className="tab-form-label">
                                    Message
                                    {errorState.Message && (boloState?.Message === "" || boloState?.Message === null || boloState?.Message === "<p><br></p>") && (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Enter Message</p>
                                    )}
                                </label>
                            </div>
                            <div className="col-11 custom-quill">
                                <ReactQuill
                                    value={boloState?.Message || ''}
                                    onChange={(e) => handleBoloState('Message', e)}
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    editorProps={{ spellCheck: true }}
                                    placeholder="Message"
                                />
                            </div>
                        </div>

                        <div className="tab-form-row">
                            <div className="col-1 d-flex justify-content-end">
                                <label htmlFor="UploadFile" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Upload File</label>
                            </div>
                            <div className="col-11 text-field mt-0">
                                <input
                                    id="UploadFile"
                                    type="file"
                                    accept="image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, text/plain, video/mp4"
                                    multiple
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                />
                            </div>
                        </div>

                        <div className="tab-form-row">
                            <div className="col-1 d-flex justify-content-end mt-1">
                                <label htmlFor="DeleteAfter" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Delete After</label>
                            </div>
                            <div className="col-1 text-field mt-0">
                                <input
                                    id="DeleteAfter"
                                    type="number"
                                    className="form-control py-1 new-input"
                                    name="DeleteAfter"
                                    placeholder="Delete After"
                                    value={boloState.DeleteAfter}
                                    onChange={(v) => {
                                        const value = v.target.value;
                                        if (/^\d*$/.test(value) && value.length <= 3) {
                                            handleBoloState("DeleteAfter", value);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                                            e.preventDefault();
                                        }
                                    }}
                                    maxLength={3}
                                />
                            </div>
                            <div className="col-1 d-flex justify-content-start mt-1">
                                <label htmlFor="DeleteAfter" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Days</label>
                            </div>
                            {renderImagePreview()}
                        </div>

                        {/* <div className="tab-form-row col-11 offset-1">
                            {renderImagePreview()}
                        </div> */}

                        <div className="row">
                            <div className="col-12 p-0">
                                <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                    <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                        {closeBoloButton}
                                        <button type="button" className="save-button ml-2" data-toggle="modal"
                                            data-target="#BoloSearchModal" onClick={() => { setOpenBoloSearchModal(true); handelClear(); }}>Search</button>
                                        {/* Save Button - Show only when user can add and no BoloID exists */}
                                        {!boloState?.BoloID && canAddBolo && (
                                            <button
                                                type="button"
                                                className="save-button"
                                                disabled={isLoading}
                                                onClick={() => handleSave()}
                                            >
                                                Save
                                            </button>
                                        )}

                                        {/* Update Button - Show only when user can update and BoloID exists */}
                                        {!!boloState?.BoloID && canUpdateBolo && (
                                            <button
                                                type="button"
                                                className="save-button"
                                                disabled={isLoading || !isDataUpdated}
                                                onClick={() => handleSave()}
                                            >
                                                Update
                                            </button>
                                        )}
                                        <button type="button" className="cancel-button" onClick={() => handelClear()}>Clear</button>
                                        <button type="button" data-dismiss="modal" className="cancel-button" onClick={() => handleCancel()}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        );
    };

    const renderFilters = () => (
        <div className="dropdown d-flex justify-content-end align-items-center pb-1">
            <div className='d-flex align-content-center justify-content-end table-header-buttons ml-2'>
                <label htmlFor="typeOfBoloFilter" className="tab-form-label d-flex justify-content-end mr-1 mt-2 text-nowrap">Type Of BOLO</label>
                <Select
                    id="typeOfBoloFilter"
                    name="typeOfBolo"
                    styles={{
                        ...colourStyles,
                        container: (base) => ({
                            ...base,
                            width: 200,
                        }),
                        menu: (base) => ({
                            ...base,
                        }),
                    }}
                    isClearable
                    options={typeOFBOLO}
                    value={typeOfBoloFilter ? typeOFBOLO?.find((i) => i?.BoloTypeID === typeOfBoloFilter) : ""}
                    getOptionLabel={(v) => v?.Description}
                    getOptionValue={(v) => v?.BoloTypeID}
                    onChange={(e) => setTypeOfBoloFilter(e?.BoloTypeID)}
                    placeholder="Select..."
                    menuPlacement="top"
                />
                <label htmlFor="priorityFilter" className="tab-form-label d-flex justify-content-end mr-1 mt-2 text-nowrap">Priority</label>
                <Select
                    id="priorityFilter"
                    name="priority"
                    styles={{
                        ...colourStyles,
                        container: (base) => ({
                            ...base,
                            width: 200,
                        }),
                        menu: (base) => ({
                            ...base,
                        }),
                    }}
                    isClearable
                    options={PriorityDrpData}
                    formatOptionLabel={(option, { context }) => {
                        return context === 'menu'
                            ? `${option?.PriorityCode} | ${option?.Description}`
                            : option?.PriorityCode;
                    }}
                    value={priorityFilter ? PriorityDrpData?.find((i) => i?.PriorityID === priorityFilter) : ""}
                    getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                    getOptionValue={(v) => v?.PriorityCode}
                    onChange={(e) => { setPriorityFilter(e?.PriorityID) }}
                    placeholder="Select..."
                    menuPlacement="top"
                />
            </div>
        </div>
    );

    const renderDataTable = () => (
        <div className="table-responsive CAD-table" style={{ position: "sticky" }}>
            <DataTable
                dense
                columns={columns}
                data={boloList}
                customStyles={tableCustomStyles}
                pagination
                responsive
                striped
                highlightOnHover
                fixedHeader
                selectableRowsHighlight
                noDataComponent={isNoData ? "There are no data to display" : 'There are no data to display'}
                fixedHeaderScrollHeight="160px"
                persistTableHead={true}
                onRowClicked={(row) => {
                    handelSetEditData(row); setClickedRow(row);
                }}
                conditionalRowStyles={conditionalRowStyles}
            />
        </div>
    );

    const renderAuditLog = () => (
        <div className="table-responsive mt-2" style={{ position: "sticky" }}>
            <DataTable
                dense
                columns={columns2}
                data={contactList}
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
        </div>
    );

    if (!openBoloModal) return null;

    return (
        <>
            <dialog
                className="modal fade modal-cad"
                style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflow: "hidden" }}
                id="BoloModal"
                tabIndex="-1"
                aria-hidden="true"
                data-backdrop="false"
            >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content modal-content-cad" style={{
                        maxHeight: "calc(100vh - 100px)",
                        overflowY: "auto",
                    }}>
                        <div className="modal-body py-1 px-2">
                            <div className="row">
                                <div className="col-12 ">
                                    <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                                        <p
                                            className="p-0 m-0 font-weight-medium"
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 500,
                                                letterSpacing: 0.5,
                                            }}
                                        >
                                            BOLO
                                        </p>
                                        <div className="notification_dropdown">
                                            <a id="dLabel" role="button" data-toggle="dropdown" data-target="#" href="/page.html">
                                                <i className="fa fa-bell"></i>
                                            </a>
                                        </div>
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
                                            className={`nav-item border-0 ${showPage === 'auditLog' ? 'active' : ''}`}
                                            style={{ color: showPage === 'auditLog' ? 'Red' : '#000' }}
                                            aria-current="page"
                                            onClick={() => { }}
                                        >
                                            Change Log
                                        </span>
                                    </ul>
                                </div>
                            </div>

                            {showPage === 'home' && (
                                <>
                                    {renderForm()}
                                    {renderFilters()}
                                    {renderDataTable()}
                                </>
                            )}

                            {showPage === 'auditLog' && renderAuditLog()}
                        </div>
                    </div>
                </div>
            </dialog>

            <ModalConfirm
                showModal={showConfirmModal}
                setShowModal={setShowConfirmModal}
                confirmAction=""
                handleConfirm={() => {
                    removeImage(confirmParams.index, confirmParams.image);
                    setIsDataUpdated(true);
                    setShowConfirmModal(false);
                }}
                isCustomMessage
                message="Are you sure you want to delete this item ?"
            />

            <BoloSearchModal {...{ openBoloSearchModal, setOpenBoloSearchModal }} />
            <CloseBoloModal {...{ openCloseBolo, setOpenCloseBolo, boloState, refetch, clearBoloState, clearErrorState, setSelectedImages, handelClear }} />
            <CallTakerModal
                {...{
                    openCallTakerModal,
                    setCallTakerModal,
                    setIncNo,
                }}
            />
            <ViewImageModal imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} viewImg={viewImg} />
            <ViewSingleImageModal isOpenViewSingleImageModal={isOpenViewSingleImageModal} setIsOpenViewSingleImageModal={setIsOpenViewSingleImageModal} viewSingleImage={viewSingleImage} viewBoloImage={viewBoloImage} id={viewSingleImage.BoloID} />
        </>
    );
};

export default memo(BoloModal);
BoloModal.propTypes = {
    openBoloModal: PropTypes.bool.isRequired,
    setOpenBoloModal: PropTypes.func.isRequired,
};

BoloModal.defaultProps = {
    openBoloModal: false,
    setOpenBoloModal: () => { }
};
