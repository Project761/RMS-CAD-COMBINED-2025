import React from 'react'

const GangNotesAddUp = () => {
    return (
       

            <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="GangNotesModal" tabIndex="-1"  aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="m-1">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Gang Notes</legend>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 col-md-12 col-lg-12 ">
                                                    <div className="text-field">
                                                        <textarea name="Notes" id="Notes" cols="30" rows="6" required></textarea>
                                                        <label>Notes</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right mt-3 mr-1 mb-2">
                            <button type="button" className="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </dialog>
     
    )
}

export default GangNotesAddUp