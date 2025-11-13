import React, { useState } from 'react'
import PropTypes from 'prop-types';

function VehicleInfoContent(props) {
    const { vehicleData } = props;
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="row">
                    <div className="col-md-4 d-flex align-items-center">
                        <label className='new-label mt-2 ml-4 '>Plate Type</label>
                        <div className='text-field text-field ml-3' style={{ width: '66%' }}>
                            <input
                                type="text"
                                className="form-control"
                                value={vehicleData.plateType}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="col-md-1 mt-2">
                        <label className='new-label '>Plate State & No.</label>
                    </div>
                    <div className="col-md-3 text-field" style={{ marginTop: '6px' }}>
                        <div className="row">
                            <div className="col-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={vehicleData.plateState}
                                    disabled
                                />
                            </div>
                            <div className="col-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={vehicleData.plateNumber}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-1 mt-2">
                        <label className='new-label'>VIN</label>
                    </div>
                    <div className="col-md-3 text-field" style={{ marginTop: '6px' }}>
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.vin}
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div className='col-md-9'>
                <div className="d-flex align-items-center">
                    <div className="col-md-1 mt-3">
                        <label className='new-label'>Category</label>
                    </div>
                    <div className="col-md-3 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.category}
                            disabled
                        />
                    </div>
                    <div className="col-md-1">
                        <label className='new-label'>Classification</label>
                    </div>
                    <div className="col-md-3 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.classification}
                            disabled
                        />
                    </div>
                    <div className="col-md-1">
                        <label className='new-label'>VOD</label>
                    </div>
                    <div className="col-md-3 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.vod}
                            disabled
                        />
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="col-md-1 mt-3">
                        <label className='new-label'>Make</label>
                    </div>
                    <div className="col-md-3 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.make}
                            disabled
                        />
                    </div>
                    <div className="col-md-1">
                        <label className='new-label'>Model</label>
                    </div>
                    <div className="col-md-3 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.model}
                            disabled
                        />
                    </div>
                    <div className="col-md-1">
                        <label className='new-label'>Style</label>
                    </div>
                    <div className="col-md-3 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.style}
                            disabled
                        />
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="col-md-1 mt-2">
                        <label className='new-label'>Plate Expires</label>
                    </div>
                    <div className="col-md-3 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.plateExpires}
                            disabled
                        />
                    </div>
                    <div className="col-md-1">
                        <label className='new-label'>Mfg. Year</label>
                    </div>
                    <div className="col-md-1 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.mfgYear}
                            disabled
                        />
                    </div>
                    <div className="col-md-1">
                        <label className='new-label'>Weight</label>
                    </div>
                    <div className="col-md-1 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.weight}
                            disabled
                        />
                    </div>
                    <div className="col-md-1">
                        <label className='new-label'>OAN #</label>
                    </div>
                    <div className="col-md-3 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.oanNumber}
                            disabled
                        />
                    </div>
                </div>
                <div className="d-flex align-items-center">
                    <div className="col-md-1 mt-3">
                        <label className='new-label'>Primary Color</label>
                    </div>
                    <div className="col-md-3 text-field">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.primaryColor}
                            disabled
                        />
                    </div>
                    <div className="col-md-1 ml-1">
                        <label className='new-label text-nowrap'>Secondary Color</label>
                    </div>
                    <div className="col-md-3 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.secondaryColor}
                            disabled
                        />
                    </div>
                    <div className="col-md-1">
                        <label className='new-label'>Owner</label>
                    </div>
                    <div className="col-md-3 text-field mt-0">
                        <input
                            type="text"
                            className="form-control"
                            value={vehicleData.owner}
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-center">
                        <i className="fa fa-image fa-3x text-muted"></i>
                        <p className="text-muted mt-2">Image Placeholder</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VehicleInfoContent

// PropTypes definition
VehicleInfoContent.propTypes = {
    citationState: PropTypes.object.isRequired
};

// Default props
VehicleInfoContent.defaultProps = {
    citationState: {}
};