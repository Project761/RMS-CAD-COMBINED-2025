import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import { getShowingMonthDateYear } from '../../../../../Common/Utility';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
const CommentsAddUp = () => {
    const [commentsDate, setCommentsDate] = useState();
    const [value, setValue] = useState();

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };
    return (
     
            <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CommentsModal" tabIndex="-1"  aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="m-1 mt-1">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <div className="row ">
                                        <div className="col-12 col-md-12 col-lg-12 ">
                                            <div className="row ">
                                                <div className="col-12 col-md-12 col-lg-12">
                                                    <div className="text-field">
                                                        <Editor
                                                            wrapperClassName="wrapper-class"
                                                            editorClassName="editor-class"
                                                            toolbarClassName="toolbar-class"
                                                            editorStyle={{ height: '60vh' }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-3  " style={{marginTop:'3px'}}>
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='commentsDate'
                                                    name='commentsDate'
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setCommentsDate(date); setValue({ ...value, ['commentsDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className='requiredColor'
                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                    timeInputLabel
                                                    autoComplete="nope"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.commentsDate ? true : false}
                                                    selected={commentsDate}
                                                    placeholderText={value?.commentsDate ? value.commentsDate : 'Select...'}
                                                    showTimeSelect
                                                    timeIntervals={1}
                                                    timeCaption="Time"
                                                />
                                                <label htmlFor="" className='pt-1'> Date/Time</label>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-6 col-lg-6 mt-1 pt-1">
                                            <div className="text-field">
                                                <input type="text" name='AdminOfficer' disabled readOnly />
                                                <label>Officer Name</label>
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-3 text-right mt-3 pt-1">
                                            <button type="button" className="btn btn-sm btn-success pl-2">Save</button>
                                            <button type="button" className="btn btn-sm btn-success ml-2" data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
     
    )
}

export default CommentsAddUp