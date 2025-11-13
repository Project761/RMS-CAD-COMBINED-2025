import React from 'react'

const UrgentCaseLocations = () => {
    return (
        <div className="border border-dark rounded mb-4" style={{ border: '1px solid #dee2e6' }}>
            <div className="my-1 mx-2 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Urgent Case Locations</h6>
            </div>
            <div className="p-2">
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                        height: '200px',
                        backgroundColor: '#f8f9fa',
                        border: '2px dashed #dee2e6',
                        borderRadius: '4px'
                    }}
                >
                    <div className="text-center">
                        <i className="fas fa-map-marked-alt fa-3x text-muted mb-2"></i>
                        <div className="text-muted">Map showing urgent case locations</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UrgentCaseLocations
