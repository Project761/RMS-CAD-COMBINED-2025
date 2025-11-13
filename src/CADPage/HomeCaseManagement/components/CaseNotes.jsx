import React, { useState } from 'react'
import Select from 'react-select'
import DatePicker from "react-datepicker"
import { colorLessStyle_Select } from '../../../CADComponents/Utility/CustomStylesForReact'
import "react-datepicker/dist/react-datepicker.css"

const CaseNotes = () => {
    const [newNote, setNewNote] = useState('')
    const [confidence, setConfidence] = useState({ value: 'High', label: 'Confidence: High' })
    const [noteDate, setNoteDate] = useState(new Date())
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState({ value: 'Date', label: 'Sort by Date' })
    const [selectedTag, setSelectedTag] = useState({ value: '#phoneTap', label: '#phoneTap' })
    const [selectedEntity, setSelectedEntity] = useState({ value: '@Jane Smith', label: '@Jane Smith' })

    const confidenceOptions = [
        { value: 'High', label: 'Confidence: High' },
        { value: 'Medium', label: 'Confidence: Medium' },
        { value: 'Low', label: 'Confidence: Low' }
    ]

    const sortOptions = [
        { value: 'Date', label: 'Sort by Date' },
        { value: 'Author', label: 'Sort by Author' },
        { value: 'Confidence', label: 'Sort by Confidence' }
    ]

    const tagOptions = [
        { value: '#barScene', label: '#barScene' },
        { value: '#surveillance', label: '#surveillance' },
        { value: '#phoneTap', label: '#phoneTap' }
    ]

    const entityOptions = [
        { value: '@John Doe', label: '@John Doe' },
        { value: '@Jane Smith', label: '@Jane Smith' },
        { value: '@MacBook Pro', label: '@MacBook Pro' }
    ]

    const notes = [
        {
            id: 1,
            author: 'Det. Lee',
            date: '09/28/2025 14:32:10',
            content: 'Surveillance confirmed suspect @John Doe at #barScene with @MacBook Pro in possession.',
            confidence: 'HIGH',
        },
        {
            id: 2,
            author: 'CSI Kim',
            date: '09/27/2025 09:15:55',
            content: 'Witness mentioned seeing @Jane Smith leaving area with items later identified as #stolenProperty.',
            confidence: 'MEDIUM',
        }
    ]

    const handleAddNote = () => {
        if (newNote.trim()) {
            // Handle adding new note
            setNewNote('')
        }
    }

    const renderNoteContent = (content) => {
        // Replace @mentions with styled links
        let formattedContent = content.replace(/@(\w+\s*\w*)/g, '<span class="text-decoration-underline text_blue_color">$&</span>')
        // Replace #tags with styled tags
        formattedContent = formattedContent.replace(/#(\w+)/g, '<span class="light_green_badge rounded">$&</span>')
        return { __html: formattedContent }
    }

    return (
        <div className="container-fluid p-4">
            <div className="mb-4">
                <h2 className="text-dark fw-bold">Case Notes & Intelligence</h2>
            </div>

            {/* New Note Input Section */}
            <div className="mb-4">
                <div className="row">
                    <div className="col-7">
                        <textarea
                            rows="3"
                            className="form-control mb-3"
                            placeholder="Add confidential note... Use @entity and #tag for linking"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <Select
                            value={confidence}
                            onChange={setConfidence}
                            options={confidenceOptions}
                            isSearchable={false}
                            styles={colorLessStyle_Select}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div className="col-md-2">
                        <DatePicker
                            selected={noteDate}
                            onChange={(date) => setNoteDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MM/dd/yyyy HH:mm"
                            className="form-control"
                            placeholderText="Select date and time"
                            maxDate={new Date()}
                            minTime={new Date(0, 0, 0, 0, 0)}
                            maxTime={new Date()}
                        />
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-primary" onClick={handleAddNote}>
                            + Add
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-4">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <Select
                            value={selectedTag}
                            onChange={setSelectedTag}
                            options={tagOptions}
                            isSearchable={false}
                            styles={colorLessStyle_Select}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>

                    <div className="col-md-2">
                        <Select
                            value={selectedEntity}
                            onChange={setSelectedEntity}
                            options={entityOptions}
                            isSearchable={false}
                            styles={colorLessStyle_Select}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div className="col-md-2">
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            options={sortOptions}
                            styles={colorLessStyle_Select}
                            isSearchable={false}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>
            </div>

            {/* Notes Display Section */}
            <div className="row">
                {notes.map(note => (
                    <div key={note.id} className="col-12 mb-3">
                        <div className="border border-dark rounded p-2">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="fw-bold text-dark">Note by {note.author}</span>
                                    <span className="text-primary">{note.date}</span>
                                    <span className="text-muted">🛡️</span>
                                </div>
                                <span className={`${note.confidence === "HIGH" ? "light_red_badge" : note.confidence === "MEDIUM" ? "light_yellow_badge" : "light_red_badge"}`}>
                                    CONFIDENCE: {note.confidence}
                                </span>
                            </div>

                            <div
                                className="mb-3"
                                dangerouslySetInnerHTML={renderNoteContent(note.content)}
                            />

                            <div className="d-flex gap-3">
                                <span className="text-muted" style={{ cursor: 'pointer' }}>✏️</span>
                                <span className="text-muted" style={{ cursor: 'pointer' }}>➕</span>
                                <span className="text-muted" style={{ cursor: 'pointer' }}>🔗</span>
                                <span className="text-muted" style={{ cursor: 'pointer' }}>📎</span>
                                <span className="text-muted" style={{ cursor: 'pointer' }}>📌</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CaseNotes
