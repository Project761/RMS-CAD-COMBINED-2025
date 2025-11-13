import React from 'react'

const WorkloadSnapshot = () => {
    return (
        <div className="border border-dark rounded mb-4" style={{ border: '1px solid #dee2e6' }}>
            <h6 className="my-1 ml-2 fw-bold">Workload Snapshot</h6>
            <div className="flex flex-wrap justify-content-between align-items-center">
                <div className="row text-center">
                    <div className="col-3">
                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: "#3498DB" }}>3</div>
                        <small className="text-muted font-weight-bold">Open Cases</small>
                    </div>
                    <div className="col-3">
                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: "#3498DB" }}>2</div>
                        <small className="text-muted font-weight-bold">Pending</small>
                    </div>
                    <div className="col-3">
                        <div className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>1</div>
                        <small className="text-muted font-weight-bold">Suspended</small>
                    </div>
                    <div className="col-3">
                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: "#5EBA00" }}>8/12</div>
                        <small className="text-muted font-weight-bold">Tasks Completed</small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkloadSnapshot
