import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

function CaseTimeline() {
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [keywords, setKeywords] = useState('')

  // Sample timeline data
  const timelineData = [
    {
      date: "September 24, 2025",
      activities: [
        {
          id: 1,
          type: "Notes Edited",
          description: "Follow up with witness tomorrow.",
          readMore: true,
          author: "Sgt. Adams",
          timestamp: "14/10/2025 09:10"
        },
        {
          id: 2,
          type: "Task Added (Court)",
          description: "",
          readMore: false,
          author: "Sgt. Adams",
          timestamp: "14/10/2025 09:10"
        }
      ]
    },
    {
      date: "September 23, 2025",
      activities: [
        {
          id: 3,
          type: "Investigator Added (John)",
          description: "",
          readMore: false,
          author: "Sgt. Adams",
          timestamp: "14/10/2025 09:10"
        },
        {
          id: 4,
          type: "Notes Edited",
          description: "Follow up with witness tomorrow.",
          readMore: true,
          author: "Sgt. Adams",
          timestamp: "14/10/2025 09:10"
        },
        {
          id: 5,
          type: "Task Added (Court)",
          description: "",
          readMore: false,
          author: "Sgt. Adams",
          timestamp: "14/10/2025 09:10"
        }
      ]
    },
    {
      date: "September 21, 2025",
      activities: [
        {
          id: 6,
          type: "Case Generated",
          description: "",
          readMore: false,
          author: "Sgt. Adams",
          timestamp: "14/10/2025 09:10"
        }
      ]
    }
  ]

  const handleApplyFilters = () => {
    // Handle filter logic here
    console.log('Applying filters:', { fromDate, toDate, keywords })
  }

  return (
    <div className=''>
      {/* Filter Bar */}
      <div className="row mb-2">
        <div className="col-12">
          <div className="row align-items-end">
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">From Date</label>
              <DatePicker
                selected={fromDate}
                onChange={(date) => setFromDate(date)}
                dateFormat="MM/dd/yyyy"
                className="form-control"
                placeholderText="Select From Date"
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label fw-bold">To Date</label>
              <DatePicker
                selected={toDate}
                onChange={(date) => setToDate(date)}
                dateFormat="MM/dd/yyyy"
                className="form-control"
                placeholderText="Select To Date"
              />
            </div>
            <div className="col-md-5 mb-3">
              <label className="form-label fw-bold">Keywords</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter keywords to search"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <div className="col-md-1 mb-3">
              <button
                className="btn w-100"
                style={{ backgroundColor: '#20c997', color: 'white', border: 'none' }}
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline/Activity Log */}
      <div className="row">
        <div className="col-12">
          {timelineData.map((dateGroup, dateIndex) => (
            <div key={dateIndex} className="mb-4">
              <div className="card shadow-sm" style={{ border: '0px', borderRadius: '10px' }}>
                <div className="card-body">
                  {/* Date Heading */}
                  <h5 className="fw-bold mb-3" style={{ color: '#333' }}>
                    {dateGroup.date}
                  </h5>
                  <hr className="my-3" style={{ borderColor: '#e9ecef' }} />
                  {/* Activities for this date */}
                  {dateGroup.activities.map((activity, activityIndex) => (
                    <div key={activity.id} className="mb-3">
                      <div className="d-flex align-items-start">
                        {/* Activity Icon */}
                        <div
                          className="mr-2 mt-2"
                          style={{
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#007bff',
                            borderRadius: '50%',
                            flexShrink: 0
                          }}
                        ></div>

                        {/* Activity Content */}
                        <div className="flex-grow-1">
                          <div className="fw-semibold mb-1" style={{ color: '#333' }}>
                            {activity.type}
                          </div>

                          {activity.description && (
                            <div className="mb-2" style={{ color: '#666' }}>
                              "{activity.description}"
                              {activity.readMore && (
                                <span className="ms-2" style={{ color: '#007bff', cursor: 'pointer' }}>
                                  — Read more
                                </span>
                              )}
                            </div>
                          )}

                          <div className="text-muted small">
                            By: {activity.author} — {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State (if no data) */}
      {timelineData.length === 0 && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <h5 className="text-muted">No timeline data available</h5>
                <p className="text-muted">Try adjusting your filters or check back later.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaseTimeline