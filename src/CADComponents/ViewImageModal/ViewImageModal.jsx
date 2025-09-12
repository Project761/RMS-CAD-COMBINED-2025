import { memo, useRef } from 'react';
import PropTypes from 'prop-types';

const ViewImageModal = (props) => {
    const { imageModalStatus, setImageModalStatus, viewImg } = props;
    const sliderRef = useRef(null);
    const scrollAmount = 620;

    const scrollPrevious = () => {
        sliderRef.current.scrollLeft -= scrollAmount;
    };

    const scrollNext = () => {
        sliderRef.current.scrollLeft += scrollAmount;
    };
    return (
        <>
            {imageModalStatus && (
                <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ViewImageModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered rounded modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close " aria-label="Close" onClick={() => { setImageModalStatus(false); }}><span aria-hidden="true">&times;</span></button>
                            </div>
                            <div className="col-12">
                                <div className="row d-flex justify-content-center align-items-center">
                                    <div className="col-1 d-flex justify-content-center">
                                        <button type="button" className="btn btn-primary modelimg-btn px-1 py-0" onClick={scrollPrevious}>
                                            <i className="fa fa-backward"></i>
                                        </button>
                                    </div>
                                    <div className="imagemodalcontainer" ref={sliderRef} style={{ overflow: 'hidden', width: '620px' }}>
                                        <div style={{ display: 'flex', transition: 'transform 0.3s ease' }}>
                                            {viewImg?.length > 0 && viewImg?.map((item, index) => (
                                                <div className="img-box" key={index} style={{ flex: '0 0 auto', margin: '0 0px' }}>
                                                    <img
                                                        src={item?.FileAttachment}
                                                        style={{
                                                            height: '500px', // Fixed height
                                                            width: '620px',  // Fixed width
                                                            maxHeight: '500px', // Fixed height
                                                            maxWidth: '620px',  // Fixed width
                                                            objectFit: 'cover' // Ensures the image covers the container without stretching
                                                        }}
                                                        alt=""
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-1 d-flex justify-content-center">
                                        <button type="button" className="btn btn-primary px-1 py-0 modelimg-btn" onClick={scrollNext}>
                                            <i className="fa fa-forward"></i>
                                        </button>
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

ViewImageModal.propTypes = {
    imageModalStatus: PropTypes.bool,
    setImageModalStatus: PropTypes.func,
    viewImg: PropTypes.arrayOf(
        PropTypes.shape({
            FileAttachment: PropTypes.string
        })
    )
};

ViewImageModal.defaultProps = {
    imageModalStatus: false,
    setImageModalStatus: () => {},
    viewImg: []
};

export default memo(ViewImageModal);
