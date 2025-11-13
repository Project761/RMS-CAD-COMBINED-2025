import React from 'react'

const CriticalAlerts = () => {
    // Critical alerts data
    const criticalAlerts = [
        {
            id: 1,
            message: 'Discovery Due in 1d 10h - Case #25-000371',
            icon: '🔴',
            type: 'danger'
        },
        {
            id: 2,
            message: 'Report Pending Supervisor Approval - Case #25-000372',
            icon: '⚠️',
            type: 'warning'
        },
        {
            id: 3,
            message: 'New Evidence Uploaded - Case #25-000371',
            icon: 'ℹ️',
            type: 'info'
        }
    ]

    return (
        <div className="alert alert-warning mb-4" style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
            <div className="mt-1">
                {criticalAlerts.map(alert => (
                    <div key={alert.id} className="d-flex align-items-center mb-1">
                        <span className="mr-2" style={{ fontSize: '16px' }}>{alert.icon}</span>
                        <span className='font-weight-bold' style={{ color: alert.type === 'warning' ? '#856404' : alert.type === 'danger'?'#E74C3C':'#3498DB' }}>{alert.message}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CriticalAlerts
