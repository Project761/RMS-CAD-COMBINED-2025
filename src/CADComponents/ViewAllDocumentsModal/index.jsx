import { memo, useState } from "react";
import PropTypes from "prop-types";

const ViewAllDocumentsModal = (props) => {
    const { isOpenAllDocumentsModal, setIsOpenAllDocumentsModal, allDocuments, whiteBoardID } = props;
    const [selectedDocument, setSelectedDocument] = useState(null);

    const isImageFile = (fileName) => {
        const imageExtensions = /\.(png|jpg|jpeg|jfif|bmp|gif|webp|tiff|tif|svg|ico|heif|heic)$/i;
        return imageExtensions.test(fileName);
    };

    const handleDocumentClick = (document) => {
        const fileType = document.FileAttachment || document.name;
        if (isImageFile(fileType)) {
            setSelectedDocument(document);
        } else {
            window.open(document.FileAttachment || URL.createObjectURL(document), "_blank");
        }
    };

    const handleCloseModal = () => {
        setIsOpenAllDocumentsModal(false);
        setSelectedDocument(null);
    };

    return (
        <>
            {isOpenAllDocumentsModal && (
                <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ViewAllDocumentsModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered rounded modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">All Documents</h5>
                                <button type="button" className="close" aria-label="Close" onClick={handleCloseModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {allDocuments?.map((document, index) => {
                                        const fileType = document.FileAttachment || document.name;
                                        const isImage = isImageFile(fileType);
                                        const imageSrc = whiteBoardID 
                                            ? document.FileAttachment 
                                            : URL.createObjectURL(document);
                                        
                                        return (
                                            <div key={index} className="col-md-3 col-sm-4 col-6 mb-3">
                                                <div 
                                                    className="card h-100 cursor-pointer"
                                                    style={{ cursor: "pointer" }}
                                                    data-toggle="modal"
                                                    data-target="#ViewSingleDocumentModal"
                                                    onClick={() => handleDocumentClick(document)}
                                                >
                                                    <div className="card-body text-center p-2">
                                                        {isImage ? (
                                                            <img
                                                                src={imageSrc}
                                                                alt={`Document ${index + 1}`}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "120px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "4px"
                                                                }}
                                                            />
                                                        ) : (
                                                            <div 
                                                                style={{
                                                                    width: "100%",
                                                                    height: "120px",
                                                                    backgroundColor: "#f8f9fa",
                                                                    borderRadius: "4px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    flexDirection: "column"
                                                                }}
                                                            >
                                                                <i className="fa fa-file-o fa-3x text-muted"></i>
                                                                <small className="text-muted mt-2">
                                                                    {document.name || "Document"}
                                                                </small>
                                                            </div>
                                                        )}
                                                        <div className="mt-2">
                                                            <small className="text-muted">
                                                                {document.name || `Document ${index + 1}`}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Single Document View Modal */}
            {selectedDocument && (
                <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ViewSingleDocumentModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered rounded modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Document View</h5>
                                <button type="button" className="close" aria-label="Close" onClick={() => setSelectedDocument(null)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center">
                                <img
                                    src={whiteBoardID ? selectedDocument.FileAttachment : URL.createObjectURL(selectedDocument)}
                                    style={{
                                        maxHeight: "500px",
                                        maxWidth: "100%",
                                        objectFit: "contain"
                                    }}
                                    alt="Document"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(ViewAllDocumentsModal);

ViewAllDocumentsModal.propTypes = {
    isOpenAllDocumentsModal: PropTypes.bool.isRequired,
    setIsOpenAllDocumentsModal: PropTypes.func.isRequired,
    allDocuments: PropTypes.array.isRequired,
    whiteBoardID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ViewAllDocumentsModal.defaultProps = {
    whiteBoardID: null
};
