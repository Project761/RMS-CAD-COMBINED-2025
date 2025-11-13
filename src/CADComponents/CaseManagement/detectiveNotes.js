import React, { useState } from 'react'
import Select from "react-select";
import { colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import DatePicker from "react-datepicker";
import useObjState from '../../CADHook/useObjState';

function DetectiveNotes() {
    // Form state using useObjState
    const [formState, , handleFormState, clearFormState] = useObjState({
        noteBy: null,
        sourceType: null,
        confidence: null,
        dateTime: null,
        intelligenceText: ''
    })

    // Filter state using useObjState
    const [filterState, , handleFilterState] = useObjState({
        filterText: '',
        filterNoteBy: null,
        filterConfidence: null
    })

    // Notes data
    const [notes, setNotes] = useState([
        {
            id: 1,
            noteBy: "A K John",
            sourceType: "Surveillance",
            confidence: "High",
            dateTime: "10/08/2025 18:30",
            text: "Vehicle @TX ABC-123 observed near crime scene at 18:30. Possibly connected to #burglary series. Recommend stakeout.",
            isPinned: true
        },
        {
            id: 2,
            noteBy: "Daniel D",
            sourceType: "Witness Interview",
            confidence: "Medium",
            dateTime: "10/08/2025 16:45",
            text: "Witness reports a suspect named @John Doe frequents the warehouse at night. #breakin #pattern",
            isPinned: false
        },
        {
            id: 3,
            noteBy: "Smith James",
            sourceType: "Self-Generated",
            confidence: "Low",
            dateTime: "10/08/2025 14:20",
            text: "Unverified tip about a grey sedan circling the block. Potential link to @TX ABC-123 unconfirmed. #tip #vehicle",
            isPinned: false
        }
    ])

    // Event handlers
    const handleNew = () => {
        clearFormState()
    }

    const handleSave = () => {
        const newNote = {
            id: Date.now(),
            noteBy: formState.noteBy?.label || '',
            sourceType: formState.sourceType?.label || '',
            confidence: formState.confidence?.label || '',
            dateTime: formState.dateTime ? formState.dateTime.toLocaleDateString('en-US') + ' ' + formState.dateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
            text: formState.intelligenceText,
            isPinned: false
        }

        setNotes([...notes, newNote])
        handleNew() // Clear form after saving
    }

    const handlePin = (noteId) => {
        setNotes(notes.map(note =>
            note.id === noteId ? { ...note, isPinned: true } : note
        ))
    }

    const handleUnpin = (noteId) => {
        setNotes(notes.map(note =>
            note.id === noteId ? { ...note, isPinned: false } : note
        ))
    }

    const handleEdit = (noteId) => {
        // Here you would typically open an edit modal or inline edit
        console.log('Edit note:', noteId)
    }

    const handleDelete = (noteId) => {
        setNotes(notes.filter(note => note.id !== noteId))
    }

    const handleApplyFilter = () => {
        // Here you would typically apply the filters to the notes
        console.log('Applying filters:', filterState)
    }

    const getConfidenceColor = (confidence) => {
        switch (confidence) {
            case 'High': return '#ef4444' // red
            case 'Medium': return '#f97316' // orange
            case 'Low': return '#22c55e' // green
            default: return '#6b7280' // gray
        }
    }

    const getFilteredNotes = () => {
        let filtered = notes

        if (filterState.filterText) {
            filtered = filtered.filter(note =>
                note.text.toLowerCase().includes(filterState.filterText.toLowerCase()) ||
                note.noteBy.toLowerCase().includes(filterState.filterText.toLowerCase())
            )
        }

        if (filterState.filterNoteBy) {
            filtered = filtered.filter(note => note.noteBy === filterState.filterNoteBy.label)
        }

        if (filterState.filterConfidence) {
            filtered = filtered.filter(note => note.confidence === filterState.filterConfidence.label)
        }

        return filtered
    }

    const pinnedNotes = getFilteredNotes().filter(note => note.isPinned)
    const allNotes = getFilteredNotes().filter(note => !note.isPinned)

    const NoteCard = ({ note, showPinAction = true }) => (
        <div className="border rounded p-3" style={{ backgroundColor: note.isPinned ? "#FFFFE5" : '#f8f9fa' }}>
            {note.isPinned && <div className='border-bottom mb-2'>
                <h5 style={{ color: "#B99900" }}>Pinned</h5>
            </div>}
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                    <span className="fw-bold">{note.noteBy}</span>
                    <span>•</span>
                    <span>Source: {note.sourceType}</span>
                    <span>•</span>
                    <span
                        className="badge text-white px-2 py-1 text-nowrap"
                        style={{ backgroundColor: getConfidenceColor(note.confidence) }}
                    >
                        {note.confidence}
                    </span>
                </div>
                <div className="d-flex" style={{ gap: "10px" }}>
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleEdit(note.id)}
                    >
                        <i className="fa fa-edit me-1"></i> Edit
                    </button>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(note.id)}
                    >
                        <i className="fa fa-trash me-1"></i> Delete
                    </button>
                    {showPinAction ? (
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => note.isPinned ? handleUnpin(note.id) : handlePin(note.id)}
                        ><i className="fa fa-thumb-tack fa-lg" style={{ color: note.isPinned ? '#FF4D4F' : '#B0B0B0' }}></i>
                            {note.isPinned ? ' Unpin' : ' Pin'}
                        </button>
                    ) : (
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleUnpin(note.id)}
                        ><i className="fa fa-thumb-tack fa-lg" style={{ color: note.isPinned ? '#FF4D4F' : '#B0B0B0' }}></i>
                            <i className="fa fa-thumbtack me-1 text-danger"></i> Unpin
                        </button>
                    )}
                </div>
            </div>
            <div>{note.text}</div>
        </div>
    )

    return (
        <div className='col-12 col-md-12 col-lg-12 mt-2'>
            {/* New Intelligence Note Form */}
            <div>
                <div className="row">
                    <div className="col-md-3 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Note By</label>
                        <Select
                            isClearable
                            options={[
                                { label: "A K John", value: "A K John" },
                                { label: "Daniel D", value: "Daniel D" },
                                { label: "Smith James", value: "Smith James" }
                            ]}
                            placeholder="Select"
                            styles={colorLessStyle_Select}
                            value={formState.noteBy}
                            onChange={(e) => handleFormState('noteBy', e)}
                        />
                    </div>
                    <div className="col-md-3 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Source Type</label>
                        <Select
                            isClearable
                            options={[
                                { label: "Surveillance", value: "Surveillance" },
                                { label: "Witness Interview", value: "Witness Interview" },
                                { label: "Self-Generated", value: "Self-Generated" }
                            ]}
                            placeholder="Select"
                            styles={colorLessStyle_Select}
                            value={formState.sourceType}
                            onChange={(e) => handleFormState('sourceType', e)}
                        />
                    </div>
                    <div className="col-md-3 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Confidence</label>
                        <Select
                            isClearable
                            options={[
                                { label: "High", value: "High" },
                                { label: "Medium", value: "Medium" },
                                { label: "Low", value: "Low" }
                            ]}
                            placeholder="Select"
                            styles={colorLessStyle_Select}
                            value={formState.confidence}
                            onChange={(e) => handleFormState('confidence', e)}
                        />
                    </div>
                    <div className="col-md-3 mb-3 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Date/Time</label>
                        <DatePicker
                            selected={formState.dateTime}
                            onChange={(date) => handleFormState('dateTime', date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MM/dd/yyyy HH:mm"
                            placeholderText="Select"
                            className="form-control"
                            isClearable
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb-3 d-flex" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Intelligence Text</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Placeholder"
                            value={formState.intelligenceText}
                            onChange={(e) => handleFormState('intelligenceText', e.target.value)}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-end" style={{ gap: "10px" }}>
                        <button
                            type="button"
                            className="btn btn-primary px-4 py-2"
                            onClick={handleNew}
                        >
                            New
                        </button>
                        <button
                            type="button"
                            className="btn btn-success px-4 py-2"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <fieldset className='mt-1'>
                <legend>Filters</legend>
                <div className="row">
                    <div className="col-md-4 mt-2 mb-2 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Text Contains</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Placeholder"
                            value={filterState.filterText}
                            onChange={(e) => handleFilterState('filterText', e.target.value)}
                        />
                    </div>
                    <div className="col-md-3 mb-2 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Note By</label>
                        <Select
                            isClearable
                            options={[
                                { label: "A K John", value: "A K John" },
                                { label: "Daniel D", value: "Daniel D" },
                                { label: "Smith James", value: "Smith James" }
                            ]}
                            placeholder="Select"
                            styles={colorLessStyle_Select}
                            value={filterState.filterNoteBy}
                            onChange={(e) => handleFilterState('filterNoteBy', e)}
                        />
                    </div>
                    <div className="col-md-3 mb-2 d-flex align-items-center" style={{ gap: "10px" }}>
                        <label className="form-label text-nowrap">Confidence</label>
                        <Select
                            isClearable
                            options={[
                                { label: "High", value: "High" },
                                { label: "Medium", value: "Medium" },
                                { label: "Low", value: "Low" }
                            ]}
                            placeholder="Select"
                            styles={colorLessStyle_Select}
                            value={filterState.filterConfidence}
                            onChange={(e) => handleFilterState('filterConfidence', e)}
                        />
                    </div>
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn btn-success px-4 py-2"
                            onClick={handleApplyFilter}
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            </fieldset>

            {/* Pinned Notes Section */}
            <div className="mb-2">
                <fieldset className=''>
                    <legend>Pinned Notes</legend>
                    <div className='mt-2'>
                        {pinnedNotes.length > 0 ? (
                            pinnedNotes.map(note => (
                                <NoteCard key={note.id} note={note} showPinAction={false} />
                            ))
                        ) : (
                            <div className="text-muted text-center py-3">No pinned notes</div>
                        )}</div>
                </fieldset>
            </div>


            {/* All Notes Section */}
            <div>
                <fieldset className='mt-1'>
                    <legend>All Notes</legend>
                    <div className='mt-2 d-flex flex-column' style={{ gap: "10px" }}>
                        {allNotes.length > 0 ? (
                            allNotes.map(note => (
                                <NoteCard key={note.id} note={note} showPinAction={true} />
                            ))
                        ) : (
                            <div className="text-muted text-center py-3">No notes found</div>
                        )}
                    </div>
                </fieldset>
            </div>
        </div>
    )
}

export default DetectiveNotes