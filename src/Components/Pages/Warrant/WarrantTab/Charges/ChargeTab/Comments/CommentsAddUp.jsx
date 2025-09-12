import React from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const CommentsAddUp = () => {
    
    return (
      
            <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ChargeCommentsModal" tabIndex="-1"  aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="m-1 mt-3">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <div className="row ">
                                        <div className="col-12 col-md-12 col-lg-12 ">
                                            <div className="row ">
                                                <div className="col-12 col-md-12 col-lg-12">
                                                    <div className="text-field">
                                                        <Editor
                                                            editorState={''}
                                                            onEditorStateChange={''}
                                                            wrapperClassName="wrapper-class"
                                                            editorClassName="editor-class"
                                                            toolbarClassName="toolbar-class"
                                                            editorStyle={{ height: '60vh' }}
                                                            toolbar={{
                                                                options: ['inline', 'blockType', 'fontFamily', 'list', 'textAlign', 'remove', 'history'],
                                                                inline: {
                                                                    inDropdown: false,
                                                                    className: undefined,
                                                                    component: undefined,
                                                                    dropdownClassName: undefined,
                                                                    options: ['bold', 'italic', 'underline',  'monospace', ],
                                                                },
                                                            }}
                                                        />
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 text-right mt-1">
                                            <button type="button" className="btn btn-sm btn-success pl-2">Save</button>
                                            <button type="button" className="btn btn-sm btn-success ml-2" data-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog >
      
    )
}

export default CommentsAddUp