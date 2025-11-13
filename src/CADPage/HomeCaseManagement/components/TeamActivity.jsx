import { FontSize } from 'ckeditor5'
import React from 'react'

const TeamActivity = () => {
    // Team activity data
    const teamActivity = [
        {
            id: 1,
            user: 'Supervisor Smith',
            action: 'approved Case #25-000372',
            time: '09:15',
            status: 'success',
            dotColor: 'green'
        },
        {
            id: 2,
            user: 'Analyst Jones',
            action: 'uploaded new evidence to Case #25-000371',
            time: '10:05',
            status: 'busy',
            dotColor: 'orange',
            note: 'Busy (12 cases)'
        },
        {
            id: 3,
            user: 'Det. Patel',
            action: 'flagged backlog issues',
            time: '11:30',
            status: 'overloaded',
            dotColor: 'red',
            note: 'Overloaded'
        }
    ]

    return (
        <div className="border border-dark rounded mb-4" style={{ border: '1px solid #dee2e6' }}>
            <div className="my-1 mx-2 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Team Activity</h6>
            </div>
            <div className="p-2">
                {teamActivity.map(activity => (
                    <div key={activity.id} className="d-flex align-items-center mb-3">
                        <div
                            className="rounded-circle mr-2"
                            style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: activity.dotColor,
                            }}
                        ></div>
                        <div className="fw-medium" style={{ fontSize: '14px' }}>{activity.user} {activity.action} ({activity.time})  {activity.note && <small className="text-muted">{activity.note}</small>}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeamActivity
