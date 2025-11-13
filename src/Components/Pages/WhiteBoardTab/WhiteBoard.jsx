import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { getShowingDateText, getShowingMonthDateYear } from '../../Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import { toastifySuccess } from '../../Common/AlertMsg';
import WhiteBoardModel from './WhiteBoardModel';
import SearchModel from './SearchModel';
// import img from '../../../src/img/file.jpg'
import img from '../../../../src/img/file.jpg'
import WhiteboardServices from "../../../CADServices/APIs/whiteboard";
// import DeleteConfirmModal from '../../CADComponents/Common/DeleteConfirmModal';
import DeleteConfirmModal from '../../../CADComponents/Common/DeleteConfirmModal';
import ViewSingleImageModal from '../../../CADComponents/ViewSingleImageModal/ViewSingleImageModal';
import ViewAllDocumentsModal from '../../../CADComponents/ViewAllDocumentsModal';

function WhiteBoard() {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
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
    const [isOpenAllDocumentsModal, setIsOpenAllDocumentsModal] = useState(false);
    const [allDocuments, setAllDocuments] = useState([]);
    const fileInputRef = useRef(null);
    // const [WhiteboardServices, setWhiteboardServices] = useState("");

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

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);


    const getWhiteboardKey = `/CAD/Whiteboard/GetWhiteboard`;
    const { data: getWhiteboardData, isSuccess: isFetchWhiteboardData, refetch: refetchWhiteboardData, isError: isNoData } = useQuery(
        [getWhiteboardKey, {
            "AgencyID": loginAgencyID,
            // "WhiteboardID": WhiteboardID,
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
            "pinnedDate": getShowingMonthDateYear(new Date(datezone)),
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

    function handleCancel() {
        const baseUrl = window.location.origin + window.location.pathname;
        window.history.pushState(null, '', baseUrl);
        handelClear();
        setOpenWhiteboardModal(false)
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
            color: '#007bff',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'inline-block',
            marginTop: '5px'
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
        }, []);

        return (
            <div style={{ ...styles.col, fontSize: '16px', }}>
                <div
                    ref={textRef}
                    style={{
                        maxHeight: expanded ? 'none' : `${lineLimit * 1.4}em`, // 1.4 for spacing
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


    const handleSeeMoreClick = (documents, whiteBoardID) => {
        setAllDocuments(documents);
        setIsOpenAllDocumentsModal(true);
    };

    // Function to handle single document click
    const handleSingleDocumentClick = (document, whiteBoardID) => {
        const fileType = document.FileAttachment || document.name;
        if (isImageFile(fileType)) {
            setViewSingleImage(document);
            setIsOpenViewSingleImageModal(true);
        } else {
            window.open(document.FileAttachment || URL.createObjectURL(document), '_blank');
        }
    };

    return (
        <>
            <div className='mt-3 px-1'>
                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                    {isSearch && <button
                        type="button"
                        data-toggle="modal"
                        data-target="#WhiteboardSearchModal"
                        className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                        onClick={() => { setIsSearch(false); setWhiteboardSearchData([]) }}
                    >
                        Clear Search
                    </button>}
                    <button
                        type="button"
                        data-toggle="modal"
                        data-target="#WhiteboardSearchModal"
                        className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                        onClick={() => { setOpenWhiteboardSearchModal(true); }}
                    >
                        Search
                    </button>
                    <button
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
                    </button>
                </div>


                {whiteBoardTableData && whiteBoardTableData?.length === 0 ? (
                    <div className="container-sm p-2 CAD-card mb-2">
                        <div className="card-body py-2 px-3">
                            <div className="row py-1 d-flex align-items-center justify-content-center">
                                <div className="col-12 text-center">
                                    <strong>No Data Found</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    whiteBoardTableData?.map((item) => {

                        const Documents = item?.Documents ? JSON?.parse(item?.Documents) : [];
                        return (
                            <div className="container-sm p-2 CAD-card mb-2">
                                <div className="card-body py-2 px-3">
                                    <div className="message-item unread row py-1 d-flex align-items-center justify-content-between" style={{ fontSize: '18px', }}>
                                        <div className="col-10 justify-content-start" style={{ color: '#001f3f' }}>
                                            <strong>{item?.title || "-"}</strong>
                                            {item?.badgesText && <span className="ml-2" style={styles.badgeText}>{item?.badgesText || "-"}</span>}
                                        </div>
                                        <div className="col-2 d-flex justify-content-end">
                                            {getShowingDateText(item.CreatedDtTm) || "-"}
                                        </div>
                                    </div>
                                    <div className="row w-100 py-2 align-items-center d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="d-flex align-content-center justify-content-start">
                                            {!item?.DeletedFlag && <div className="mr-3">
                                                <span
                                                    style={{
                                                        background: item?.isPinned ? '#FF4D4F' : '#B0B0B0',
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => { handlePinWhiteboard(item) }}
                                                    className="btn btn-sm text-white pointer">
                                                    <i className="fa fa-thumb-tack fa-lg"></i>
                                                </span>

                                            </div>}
                                            {item?.Priority && <div className="mr-3">
                                                {/* <span style={{ ...styles.badgeHigh, backgroundColor: item?.BackColor, }}>{item?.Priority || "-"}</span> */}
                                                <span style={{ ...styles.badgeHigh, backgroundColor: item?.BackColor || "rgb(202, 202, 242)" }}>{item?.Priority || "-"}</span>
                                            </div>}
                                        </div>
                                        <div className="">
                                            <strong>Category</strong><br />
                                            {categoryData?.find((i) => i?.value === item?.categoryID)?.label || "-"}
                                        </div>

                                        <div className="">
                                            <strong>Created by</strong><br />
                                            {item?.CreatedByName || "-"}
                                        </div>

                                        <div className="">
                                            <strong>Elapsed days</strong><br />
                                            {item?.ElapsedDays || "-"}
                                        </div>
                                        <div className="">
                                            <strong>Expires at</strong><br />
                                            {item?.expiresDate ? getShowingDateText(item?.expiresDate) : "-"}
                                        </div>
                                        <div className="">
                                            <strong>Updated by</strong><br />
                                            {item?.UpdatedByByName || "-"}
                                        </div>
                                        <div className="">
                                            <strong>Updated at</strong><br />
                                            {item?.ModifiedDtTm ? getShowingDateText(item?.ModifiedDtTm) : "-"}
                                        </div>
                                        <div className="cad-images image-preview cursor pointer d-flex flex-wrap gap-4">
                                            {Documents?.length > 0 && (
                                                <>
                                                    {/* Show first document */}
                                                    <div
                                                        className="cad-images image-container ml-3"
                                                        data-toggle="modal"
                                                        data-target="#ViewSingleImageModal"
                                                        onClick={() => handleSingleDocumentClick(Documents[0], item.whiteBoardID)}
                                                    >
                                                        {item.whiteBoardID ? (
                                                            isImageFile(Documents[0].FileAttachment) ? (
                                                                <img
                                                                    src={Documents[0].FileAttachment}
                                                                    alt={`Selected 0`}
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
                                                            isImageFile(Documents[0].name) ? (
                                                                <img
                                                                    src={URL.createObjectURL(Documents[0])}
                                                                    alt={`Selected 0`}
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
                                                    </div>

                                                    {/* Show "See more" button if there are more than 1 documents */}
                                                    {Documents.length > 1 && (
                                                        <div
                                                            className="cad-images image-container ml-3 d-flex align-items-center justify-content-center"
                                                            style={{
                                                                width: '30px',
                                                                height: '30px',
                                                                backgroundColor: '#007bff',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                color: 'white',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}
                                                            data-toggle="modal"
                                                            data-target="#ViewAllDocumentsModal"
                                                            onClick={() => handleSeeMoreClick(Documents, item.whiteBoardID)}
                                                        >
                                                            +{Documents.length - 1}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="d-flex align-content-center justify-content-end table-header-buttons">
                                            {!item?.DeletedFlag && <div style={styles.buttonGroup}>
                                                <span
                                                    style={{ ...styles.iconButton, }}
                                                    data-toggle="modal"
                                                    data-target="#WhiteboardModal"
                                                    onClick={() => {
                                                        // setEditValue(row);
                                                        setOpenWhiteboardModal(true);
                                                        setWhiteboardID(item?.whiteBoardID)
                                                        setIsEdit(!isEdit)
                                                    }}
                                                    className="btn btn-lg bg-green px-2">
                                                    <i className="fa fa-edit fa-lg"></i>
                                                </span>
                                                <span
                                                    style={{ ...styles.iconButton, background: '#FF0000', }}
                                                    // onClick={() => setEditValue(row)}
                                                    onClick={() => { setShowModal(true); setWhiteboardID(item?.whiteBoardID) }}
                                                    className="btn btn-lg px-2">
                                                    <i className="fa fa-trash fa-lg"></i>
                                                </span>
                                            </div>}
                                        </div>

                                    </div>
                                    <div className="row clearfix py-2 align-items-center g-2">
                                        <div className="col-12 ">
                                            <CollapsibleText
                                                text={item?.Message}
                                                lineLimit={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>


            {openWhiteboardModal && <WhiteBoardModel {...{ openWhiteboardModal, setOpenWhiteboardModal, refetchWhiteboardData, WhiteboardID, setWhiteboardID, setIsSearch }} />
            }

            {whiteboardSearchModal && <SearchModel {...{ whiteboardSearchModal, setOpenWhiteboardSearchModal, whiteboardSearchData, setWhiteboardSearchData, setIsSearch }} />}


            {
                showModal &&
                <DeleteConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirm={() => handleDeleteWhiteboard()} />
            }

            <ViewSingleImageModal isOpenViewSingleImageModal={isOpenViewSingleImageModal} setIsOpenViewSingleImageModal={setIsOpenViewSingleImageModal} viewSingleImage={viewSingleImage} id={viewSingleImage.whiteBoardID} />

            {isOpenAllDocumentsModal && <ViewAllDocumentsModal isOpenAllDocumentsModal={isOpenAllDocumentsModal}
                setIsOpenAllDocumentsModal={setIsOpenAllDocumentsModal}
                allDocuments={allDocuments}
                whiteBoardID={allDocuments.length > 0 ? allDocuments[0].whiteBoardID : null} />}

        </>
    )
}

export default WhiteBoard