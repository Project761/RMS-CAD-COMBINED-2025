import { memo } from 'react';

const ViewSingleImageModal = (props) => {
    const { isOpenViewSingleImageModal, setIsOpenViewSingleImageModal, viewSingleImage } = props;
    return (
        <>
            {isOpenViewSingleImageModal && (
                <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ViewSingleImageModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered rounded modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" aria-label="Close" onClick={() => { setIsOpenViewSingleImageModal(false); }}><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div className="col-12">
                                <div className="row d-flex justify-content-center align-items-center">

                                    <div className="imagemodalcontainer" style={{ overflow: 'hidden', width: '620px' }}>
                                        <div style={{ display: 'flex', transition: 'transform 0.3s ease' }}>
                                            <div className="img-box" style={{ flex: '0 0 auto', margin: '0 0px' }}>
                                                <img
                                                    src={viewSingleImage.AssignTrainingID ? viewSingleImage.FileAttachment : URL.createObjectURL(viewSingleImage)}
                                                    style={{
                                                        height: '500px',
                                                        width: '620px',
                                                        maxHeight: '500px',
                                                        maxWidth: '620px',
                                                        objectFit: 'cover'
                                                    }}
                                                    alt="Image not found"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(ViewSingleImageModal);
