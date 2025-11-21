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
// import ViewSingleImageModal from '../../CADComponents/ViewSingleImageModal/ViewSingleImageModal';
import ViewSingleImageModal from '../../../CADComponents/ViewSingleImageModal/ViewSingleImageModal';
import ViewAllDocumentsModal from '../../../CADComponents/ViewAllDocumentsModal';
import Loader from '../../Common/Loader';
import { Link } from 'react-router-dom';

function DashwhiteBoard() {
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
    const fileInputRef = useRef(null);
    // const [WhiteboardServices, setWhiteboardServices] = useState("");
    const [documentPreviews, setDocumentPreviews] = useState({});
    const [isOpenAllDocumentsModal, setIsOpenAllDocumentsModal] = useState(false);
    const [allDocuments, setAllDocuments] = useState([]);

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
    const { data: getWhiteboardData, isSuccess: isFetchWhiteboardData, refetch: refetchWhiteboardData, isError: isNoData, isLoading } = useQuery(
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

    // async function handlePinWhiteboard(item) {
    //     GetDataTimeZone(localStoreData?.AgencyID);
    //     const data = {
    //         "WhiteboardID": item?.whiteBoardID,
    //         "IsPinned": !item?.isPinned
    //     }
    //     const response = await WhiteboardServices.pinnedWhiteboard(data);
    //     if (response?.status === 200) {
    //         const data = JSON.parse(response?.data?.data)?.Table?.[0];
    //         toastifySuccess(data?.Message);
    //         refetchWhiteboardData();
    //     }
    //     setWhiteboardID();
    //     setIsSearch(false)
    // }

    async function handlePinWhiteboard(item) {
        const data = {
            "WhiteboardID": item?.whiteBoardID,
            "IsPinned": !item?.isPinned
        };
        const response = await WhiteboardServices.pinnedWhiteboard(data);
        if (response?.status === 200) {
            const data = JSON.parse(response?.data?.data)?.Table?.[0];
            toastifySuccess(data?.Message);
            refetchWhiteboardData();
        }
        setWhiteboardID();
        setIsSearch(false);
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
            // color: 'white',
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


    useEffect(() => {
        const previews = {};
        whiteBoardData.forEach((item) => {
            const docs = item?.Documents ? JSON.parse(item?.Documents) : [];
            previews[item.whiteBoardID] = docs.map(doc => {
                if (doc.FileAttachment) return doc.FileAttachment;
                if (isImageFile(doc.name)) return URL.createObjectURL(doc);
                return null;
            });
        });

        setDocumentPreviews(previews);

        return () => {
            Object.values(previews).flat().forEach(url => {
                if (url?.startsWith('blob:')) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [whiteBoardData]);

    // Function to handle "See more" click
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
            <div className='d-flex align-items-center justify-content-between  ml-3' >
                <div className='d-flex align-items-center   '>
                    <span className='mr-3'>
                        <svg width="40" height="40" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="40" cy="40" r="40" fill="#D6ECFF" />
                            <defs>
                                <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stop-color="#FF3B3B" />
                                    <stop offset="100%" stop-color="#D90000" />
                                </linearGradient>
                            </defs>
                            <path d="M30 50a10 10 0 0120 0v8H30v-8z" fill="url(#glow)" />
                            <rect x="38" y="40" width="4" height="10" rx="2" fill="white" />
                            <circle cx="40" cy="53" r="2" fill="white" />
                            <rect x="26" y="58" width="28" height="6" rx="2" fill="#E0E0E0" />
                            <rect x="30" y="64" width="20" height="4" rx="2" fill="#BDBDBD" />
                            <line x1="20" y1="30" x2="28" y2="32" stroke="#E30613" stroke-width="2" />
                            <line x1="60" y1="30" x2="52" y2="32" stroke="#E30613" stroke-width="2" />
                            <line x1="40" y1="20" x2="40" y2="28" stroke="#E30613" stroke-width="2" />
                        </svg>

                    </span>
                    {/* <h5 className="fw-bold ">White Board</h5> */}
                    <span className="fw-bold mb-0" style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>Whiteboard</span>
                </div>
                <div className="dropdown d-flex">
                    <Link
                        to='/WhiteBoardTab'
                        className="d-flex align-items-center justify-content-between"
                        style={{
                            backgroundColor: '#002244', // deep navy like in your image
                            color: '#ffffff',
                            fontWeight: '600',
                            fontSize: '14px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            // minWidth: '120px',
                            height: '36px',
                        }}
                    >
                        <span>Expand</span>
                        <span
                            style={{
                                backgroundColor: '#ffffff',     // White background for icon box
                                color: '#002244',               // Dark blue icon color (reverse contrast)
                                padding: '4px',
                                borderRadius: '4px',
                                marginLeft: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                            }}
                        >
                            <i className="fa fa-expand" aria-hidden="true" style={{ fontSize: '12px' }}></i>
                        </span>
                    </Link>
                </div>
            </div>
            <div className="mt-3 px-1 overflow-auto my-2" style={{ maxHeight: '61vh' }}>

                {isLoading ? (

                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <div className="" role="status">
                            <Loader />
                        </div>
                    </div>

                ) : whiteBoardTableData && whiteBoardTableData?.length === 0 ? (
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
                                    <div className="row py-1 d-flex align-items-center justify-content-between" style={{ fontSize: '18px', }}>
                                        <div className="col-10 justify-content-start" style={{ fontSize: '14px', color: '#283041' }} >
                                            <strong>{item?.title || "-"}</strong>
                                            {item?.badgesText && <span className="ml-2" style={styles.badgeText}>{item?.badgesText || "-"}</span>}
                                        </div>

                                        {/* <div className="col-2 d-flex justify-content-end">
                                            {getShowingDateText(item.CreatedDtTm) || "-"}
                                        </div> */}
                                    </div>
                                    <div className="row w-100 py-2 align-items-center d-flex flex-wrap justify-content-between align-items-center">
                                        <div className="d-flex align-content-center text-center justify-content-start">
                                            {!item?.DeletedFlag && <div className="mr-3">
                                                <span
                                                    style={{
                                                        background: item?.isPinned ? '#FF4D4F' : '#B0B0B0',
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={() => { handlePinWhiteboard(item) }}
                                                    className="btn btn-sm text-black  pointer">
                                                    <i className="fa fa-thumb-tack fa-lg"></i>
                                                </span>

                                            </div>}
                                            {item?.Priority && <div className="mr-3 ">
                                                {/* <span className='' style={{ ...styles.badgeHigh, backgroundColor: item?.BackColor, }}>{item?.Priority || "-"}</span> */}
                                                <span style={{ ...styles.badgeHigh, backgroundColor: item?.BackColor || "rgb(202, 202, 242)" }}>{item?.Priority || "-"}</span>

                                            </div>}
                                        </div>
                                        <div className="ml-4" style={{ fontSize: '13px', color: '#283041' }}>
                                            <span>Category</span><br />
                                            <strong> {categoryData?.find((i) => i?.value === item?.categoryID)?.label || "-"}
                                            </strong>
                                        </div>

                                        <div className="" style={{ fontSize: '13px', color: '#283041' }}>
                                            <span>Created by</span><br />
                                            <strong>{item?.CreatedByName || "-"}</strong>
                                        </div>

                                        <div className="" style={{ fontSize: '13px', color: '#283041' }}>
                                            <span>Elapsed days</span><br />
                                            <strong>{item?.ElapsedDays || "-"}</strong>
                                        </div>
                                        <div className="" style={{ fontSize: '13px', color: '#283041' }}>
                                            <span>Expires at</span><br />
                                            <strong>{item?.expiresDate ? getShowingDateText(item?.expiresDate) : "-"}</strong>
                                        </div>
                                        <div className="" style={{ fontSize: '13px', color: '#283041' }}>
                                            <span>Updated by</span><br />
                                            <strong> {item?.UpdatedByByName || "-"}</strong>
                                        </div>
                                        <div className="" style={{ fontSize: '13px', color: '#283041' }}>
                                            <span>Updated at</span><br />
                                            <strong>  {item?.ModifiedDtTm ? getShowingDateText(item?.ModifiedDtTm) : "-"}</strong>
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
                                    </div>
                                    <div className="row clearfix py-2 align-items-center g-2">
                                        <div className="col-12 " style={{ fontSize: '13px', color: '#283041' }}>
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

            <ViewSingleImageModal isOpenViewSingleImageModal={isOpenViewSingleImageModal} setIsOpenViewSingleImageModal={setIsOpenViewSingleImageModal} viewSingleImage={viewSingleImage} id={viewSingleImage.whiteBoardID} />
            <ViewAllDocumentsModal
                isOpenAllDocumentsModal={isOpenAllDocumentsModal}
                setIsOpenAllDocumentsModal={setIsOpenAllDocumentsModal}
                allDocuments={allDocuments}
                whiteBoardID={allDocuments.length > 0 ? allDocuments[0].whiteBoardID : null}
            />

        </>
    )
}

export default DashwhiteBoard
