import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { getShowingDateText, getShowingMonthDateYear } from '../../Components/Common/Utility';
import { useSelector, useDispatch } from 'react-redux';
import WhiteboardModal from '../../CADComponents/WhiteboardModal';
import WhiteboardSearchModal from '../../CADComponents/WhiteboardSearchModal';
import WhiteboardServices from "../../CADServices/APIs/whiteboard";
import { useQuery } from 'react-query';
import DeleteConfirmModal from '../../CADComponents/Common/DeleteConfirmModal';
import { toastifySuccess } from '../../Components/Common/AlertMsg';
import { AgencyContext } from '../../Context/Agency/Index';
import img from '../../../src/img/file.jpg'
import ViewSingleImageModal from '../../CADComponents/ViewSingleImageModal/ViewSingleImageModal';
import { get_ScreenPermissions_Data } from '../../redux/actions/IncidentAction';

function CADWhiteboard() {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const [loginPinID, setLoginPinID] = useState(1);
    const [loginAgencyID, setLoginAgencyID] = useState("");
    const [openWhiteboardModal, setOpenWhiteboardModal] = useState(false);
    const [whiteboardSearchModal, setOpenWhiteboardSearchModal] = useState(false);
    const [whiteBoardData, setWhiteboardData] = useState([]);
    const [whiteBoardTableData, setWhiteboardTableData] = useState([]);
    const [whiteboardSearchData, setWhiteboardSearchData] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [WhiteboardID, setWhiteboardID] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [isOpenViewSingleImageModal, setIsOpenViewSingleImageModal] = useState(false);
    const [viewSingleImage, setViewSingleImage] = useState("")
    const fileInputRef = useRef(null);
    const categoryData = [
        { "value": 1, "label": "Alert" },
        { "value": 2, "label": "Update" },
        { "value": 3, "label": "Reminder" },
        { "value": 4, "label": "General Info" },
    ];

    // Extract data fields configuration
    const dataFields = [
        { key: 'category', label: 'Category', value: (item) => categoryData?.find((i) => i?.value === item?.categoryID)?.label || "-" },
        { key: 'createdBy', label: 'Created by', value: (item) => item?.CreatedByName || "-" },
        { key: 'elapsedDays', label: 'Elapsed days', value: (item) => item?.ElapsedDays || "-" },
        { key: 'expiresAt', label: 'Expires at', value: (item) => item?.expiresDate ? getShowingDateText(item?.expiresDate) : "-" },
        { key: 'updatedBy', label: 'Updated by', value: (item) => item?.UpdatedByByName || "-" },
        { key: 'updatedAt', label: 'Updated at', value: (item) => item?.ModifiedDtTm ? getShowingDateText(item?.ModifiedDtTm) : "-" },
        { key: 'file', label: 'File', value: (item) => item?.FileAttachment || "-" },
    ];

    // Helper function to render data field
    const renderDataField = (label, value) => (
        <div>
            <strong>{label}</strong><br />
            {value}
        </div>
    );

    // Helper function to render image
    const renderImage = (image, index, item) => (
        <div
            key={index}
            className="cad-images image-container"
            data-toggle="modal"
            data-target="#ViewSingleImageModal"
            onClick={() => handleImageClick(image)}
        >
            <img
                src={getImageSrc(image, item)}
                alt={getImageAlt(image, index)}
                style={{ width: '30px', height: '30px' }}
            />
        </div>
    );

    // Helper functions for image handling
    const handleImageClick = (image) => {
        const fileType = image.FileAttachment || image.name;
        if (isImageFile(fileType)) {
            setViewSingleImage(image);
            setIsOpenViewSingleImageModal(true);
        } else {
            window.open(image.FileAttachment || URL.createObjectURL(image), '_blank');
        }
    };

    const getImageSrc = (image, item) => {
        if (item.whiteBoardID) {
            return isImageFile(image.FileAttachment) ? image.FileAttachment : img;
        } else {
            return isImageFile(image.name) ? URL.createObjectURL(image) : img;
        }
    };

    const getImageAlt = (image, index) => {
        return isImageFile(image.FileAttachment || image.name) ? `Selected ${index}` : "Document Icon";
    };

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("CW101", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData, GetDataTimeZone]);


    const getWhiteboardKey = `/CAD/Whiteboard/GetWhiteboard`;
    const { data: getWhiteboardData, isSuccess: isFetchWhiteboardData, refetch: refetchWhiteboardData } = useQuery(
        [getWhiteboardKey, {
            "AgencyID": loginAgencyID,
        },],
        WhiteboardServices.getWhiteboard,
        {
            refetchOnWindowFocus: false,
            enabled: !!loginAgencyID,
            retry: 0,
        }
    );

    useEffect(() => {
        if (isFetchWhiteboardData && getWhiteboardData) {
            const data = JSON.parse(getWhiteboardData?.data?.data || []);
            setWhiteboardData(data?.Table);
        } else {
            setWhiteboardData([])
        }
    }, [isFetchWhiteboardData, getWhiteboardData])

    useEffect(() => {
        if (isSearch) {
            setWhiteboardTableData(whiteboardSearchData);
        } else {
            setWhiteboardTableData(whiteBoardData);
        }
    }, [isSearch, whiteBoardData, whiteboardSearchData, refetchWhiteboardData, isFetchWhiteboardData]);

    async function handleDeleteWhiteboard() {
        const data = {
            "WhiteboardID": WhiteboardID,
            "DeletedByUserFK": loginPinID,
        }
        const response = await WhiteboardServices.deleteWhiteboard(data);
        if (response?.status === 200) {
            const data = JSON.parse(response?.data?.data)?.Table?.[0];
            toastifySuccess(data?.Message);
            refetchWhiteboardData();
        }
        setWhiteboardID();
        setShowModal(false)
        setIsSearch(false)
    }
    async function handlePinWhiteboard(item) {
        GetDataTimeZone(localStoreData?.AgencyID);
        const data = {
            "WhiteboardID": item?.whiteBoardID,
            "IsPinned": !item?.isPinned
        }
        const response = await WhiteboardServices.pinnedWhiteboard(data);
        if (response?.status === 200) {
            const data = JSON.parse(response?.data?.data)?.Table?.[0];
            toastifySuccess(data?.Message);
            refetchWhiteboardData();
        }
        setWhiteboardID();
        setIsSearch(false)
    }

    // Image start

    function handelClear() {
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.pushState(null, '', baseUrl);
        // clearWhiteboardState();
        // clearErrorWhiteboardState();
        // setIsDataUpdated(false);
        // setIsLoading(false)
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleCancel = useCallback(() => {
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.pushState(null, '', baseUrl);
        handelClear();
        setOpenWhiteboardModal(false)
    }, []);

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            handleCancel();
        }
    }, [handleCancel]);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const isImageFile = (fileName) => {
        const imageExtensions = /\.(png|jpg|jpeg|jfif|bmp|gif|webp|tiff|tif|svg|ico|heif|heic)$/i;
        return imageExtensions.test(fileName);
    };

    // Image end
    const styles = {
        badgeHigh: {

            color: 'white',
            borderRadius: '5px',
            padding: '5px 10px',
            fontWeight: '500',
            fontSize: '14px',
            display: 'inline-block'
        },
        badgeText: {
            backgroundColor: '#FF4D4F',
            color: 'white',
            borderRadius: '5px',
            padding: '5px 10px',
            fontWeight: '500',
            fontSize: '14px',
            display: 'inline-block'
        },
        buttonGroup: {
            display: 'flex',
            gap: '8px',
        },
        iconButton: {
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            color: 'white',
        },
        title: {
            fontWeight: 'bold',
            color: '#003366',
            fontSize: '15px',
            marginTop: '10px',
            marginBottom: '6px'
        },
        description: {
            fontSize: '14px',
            color: '#444',
            // marginBottom: '10px'
        },

        imageRow: {
            display: 'flex',
            gap: '10px'
        },
        image: {
            width: '60px',
            height: 'auto',
            borderRadius: '6px'
        },
        col: {
            fontSize: '14px',
            color: '#555',
            position: 'relative',
            overflow: 'hidden'
        },
        readMore: {
            color: '#001F3F',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'inline-block',
            marginTop: '5px',
            fontSize: "15px"
        }
    };

    const CollapsibleText = ({ text, lineLimit = 3 }) => {
        const textRef = useRef(null);
        const [showToggle, setShowToggle] = useState(false);
        const [expanded, setExpanded] = useState(false);

        useEffect(() => {
            if (textRef.current) {
                const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight);
                const height = textRef.current.scrollHeight;
                const lineCount = height / lineHeight;

                if (lineCount > lineLimit) {
                    setShowToggle(true);
                }
            }
        }, [lineLimit]);

        return (
            <div style={{ ...styles.col, fontSize: '15px', }}>
                <div
                    ref={textRef}
                    style={{
                        maxHeight: expanded ? 'none' : `${lineLimit * 1.5}em`, // 1.4 for spacing
                        overflow: 'hidden',
                        transition: 'max-height 0.3s ease',
                    }}
                >
                    {text}
                </div>

                {showToggle && (
                    <span
                        style={styles.readMore}
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? 'Read Less' : 'Read More...'}
                    </span>
                )}
            </div>
        );
    };

    return (
        <>
            <div className='mt-3 px-1'>
                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                    {isSearch && (
                        <button
                            type="button"
                            className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                            onClick={() => { setIsSearch(false); setWhiteboardSearchData([]) }}
                        >
                            Clear Search
                        </button>
                    )}
                    {effectiveScreenPermission?.[0]?.DisplayOK === 1 && <button
                        type="button"
                        data-toggle="modal"
                        data-target="#WhiteboardSearchModal"
                        className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                        onClick={() => setOpenWhiteboardSearchModal(true)}
                    >
                        Search
                    </button>}
                    {effectiveScreenPermission?.[0]?.AddOK === 1 && <button
                        type="button"
                        data-toggle="modal"
                        data-target="#WhiteboardModal"
                        className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                        onClick={() => {
                            setOpenWhiteboardModal(true);
                            setWhiteboardID("")
                            setIsEdit(false)
                            setWhiteboardSearchData();
                            setIsSearch(false)
                        }}
                    >
                        <i className="fa fa-plus mr-2"></i>
                        <span>Add New</span>
                    </button>}
                </div>


                {effectiveScreenPermission?.[0]?.DisplayOK === 0 ? <div className="container-sm p-2 CAD-card mb-2">
                    <div className="card-body py-2 px-2">
                        <div className="row py-1 d-flex align-items-center justify-content-center">
                            <div className="col-12 text-center">
                                <strong>You don’t have permission to view data</strong>
                            </div>
                        </div>
                    </div>
                </div> : whiteBoardTableData && whiteBoardTableData?.length === 0 ? (
                    <div className="container-sm p-2 CAD-card mb-2">
                        <div className="card-body py-2 px-2">
                            <div className="row py-1 d-flex align-items-center justify-content-center">
                                <div className="col-12 text-center">
                                    <strong>No Data Found</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                ) :
                    <div className="row">
                        {
                            whiteBoardTableData?.map((item, index) => {
                                const Documents = item?.Documents ? JSON?.parse(item?.Documents) : [];
                                return (
                                    <div key={index} className="col-6 p-2">
                                        <div className=" container-sm p-2 CAD-card mb-2 " style={{ height: '350px' }}>
                                            <div className="card-body py-2 px-2">
                                                <div className="row py-1 d-flex align-items-center justify-content-between" style={{ fontSize: '16px', }}>
                                                </div>
                                                <div class="messages-widget">
                                                    <div class="message-item unread">
                                                        <div class="message-content">
                                                            <div class="message-header d-flex align-items-center">
                                                                <div className="row col-9 justify-content-start align-items-center" style={{ color: '#001f3f' }}>
                                                                    {!item?.DeletedFlag &&
                                                                        <div>
                                                                            <span
                                                                                style={{
                                                                                    background: item?.isPinned ? '#FF4D4F' : '#B0B0B0',
                                                                                    cursor: "pointer",
                                                                                    marginRight: "20px"
                                                                                }}
                                                                                onClick={() => { handlePinWhiteboard(item) }}
                                                                                className="btn btn-sm text-white pointer">
                                                                                <i className="fa fa-thumb-tack fa-lg"></i>
                                                                            </span>

                                                                        </div>}
                                                                    <strong>{item?.title || "-"}</strong>
                                                                    {item?.badgesText && <span className="ml-2" style={styles.badgeText}>{item?.badgesText || "-"}</span>}
                                                                </div>
                                                                <div className="col-2 d-flex justify-content-end align-items-center" style={{ fontSize: '16px', fontWeight: '500', color: '#374151', lineHeight: '1.4' }}>
                                                                    {getShowingDateText(item.CreatedDtTm) || "-"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row w-100 py-2 align-items-center d-flex flex-wrap justify-content-between align-items-center" style={{ fontSize: '14px' }}>
                                                    <div className="d-flex align-content-center justify-content-start">
                                                        {item?.Priority && (
                                                            <div className="mr-3 ml-1">
                                                                <span style={{ ...styles.badgeHigh, backgroundColor: item?.BackColor, }}>
                                                                    {item?.Priority || "-"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {dataFields.map(({ key, label, value }) => renderDataField(label, value(item)))}

                                                    <div className="d-flex align-content-center justify-content-end table-header-buttons">
                                                        {!item?.DeletedFlag && (
                                                            <div style={styles.buttonGroup}>
                                                                {effectiveScreenPermission?.[0]?.Changeok === 1 && <span
                                                                    style={{ ...styles.iconButton, }}
                                                                    data-toggle="modal"
                                                                    data-target="#WhiteboardModal"
                                                                    onClick={() => {
                                                                        setOpenWhiteboardModal(true);
                                                                        setWhiteboardID(item?.whiteBoardID)
                                                                        setIsEdit(!isEdit)
                                                                    }}
                                                                    className="btn btn-lg bg-green px-2">
                                                                    <i className="fa fa-edit fa-lg"></i>
                                                                </span>}
                                                                {effectiveScreenPermission?.[0]?.DeleteOK === 1 && <span
                                                                    style={{ ...styles.iconButton, background: '#FF0000', }}
                                                                    onClick={() => { setShowModal(true); setWhiteboardID(item?.whiteBoardID) }}
                                                                    className="btn btn-lg px-2">
                                                                    <i className="fa fa-trash fa-lg"></i>
                                                                </span>}

                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-100" style={{ height: '196px', overflowY: 'auto', overflowX: 'hidden' }}>


                                                    <div className="row clearfix py-2 align-items-center g-2">
                                                        <div className="col-12 ">
                                                            <CollapsibleText
                                                                text={item?.Message}
                                                                lineLimit={3}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="tab-form-row col-12">
                                                        <div className="cad-images image-preview cursor pointer">
                                                            {Documents?.length > 0 && Documents?.map((image, index) =>
                                                                renderImage(image, index, item)
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>



                }
            </div>

            {openWhiteboardModal && <WhiteboardModal {...{ openWhiteboardModal, setOpenWhiteboardModal, refetchWhiteboardData, WhiteboardID, setWhiteboardID, setIsSearch }} />
            }
            {whiteboardSearchModal && <WhiteboardSearchModal {...{ whiteboardSearchModal, setOpenWhiteboardSearchModal, whiteboardSearchData, setWhiteboardSearchData, setIsSearch }} />}
            {
                showModal &&
                <DeleteConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirm={() => handleDeleteWhiteboard()} />
            }

            <ViewSingleImageModal isOpenViewSingleImageModal={isOpenViewSingleImageModal} setIsOpenViewSingleImageModal={setIsOpenViewSingleImageModal} viewSingleImage={viewSingleImage} id={viewSingleImage.whiteBoardID} />

        </>
    )
}

export default CADWhiteboard