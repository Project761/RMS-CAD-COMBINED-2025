import React, { useState } from 'react'

const MyTasks = () => {
    const [taskFilter, setTaskFilter] = useState('All')

    // Tasks data
    const tasksData = [
        {
            id: 1,
            title: 'Write Interview Report (Case #25-000372)',
            dueDate: 'Due Today',
            status: 'today',
            completed: false
        },
        {
            id: 2,
            title: 'Submit Lab Request (Case #25-000371)',
            dueDate: 'Overdue',
            status: 'overdue',
            completed: false
        },
        {
            id: 3,
            title: 'Follow Up with Witness (Case #25-000371)',
            dueDate: 'Due Tomorrow',
            status: 'upcoming',
            completed: false
        },
        {
            id: 4,
            title: 'Draft Case Closure Summary (Case #25-000373)',
            dueDate: 'Due in 3 Days',
            status: 'upcoming',
            completed: false
        }
    ]

    const filteredTasks = tasksData.filter(task => {
        if (taskFilter === 'All') return true
        if (taskFilter === 'Today') return task.status === 'today'
        if (taskFilter === 'Overdue') return task.status === 'overdue'
        return true
    })

    return (
        <div className="border border-dark rounded mb-4" style={{ border: '1px solid #dee2e6' }}>
            <div className="my-1 mx-2 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold">My Tasks</h6>
                <div className="btn-group btn-group-sm">
                    {['All', 'Today', 'Overdue'].map(filter => (
                        <button
                            key={filter}
                            className={`btn ${taskFilter === filter ? 'btn-primary' : 'btn-outline-primary'}`}
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => setTaskFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
            {filteredTasks.map(task => (
                <div key={task.id} className="d-flex align-items-center p-1">
                    <input
                        type="checkbox"
                        className='mr-2'
                        checked={task.completed}
                        onChange={() => { }}
                    />
                    <div className="flex-grow-1" style={{ fontSize: '14px' }}>
                        <div className={`fw-medium text-${task.status === 'overdue' ? 'danger' : task.status === 'today' ? 'warning' : 'muted'}`}>{task.title} <small className='font-weight-bold'>
                            {task.dueDate}
                        </small></div>

                    </div>
                </div>
            ))}
        </div>
    )
}

export default MyTasks
