import React from 'react'

const BreathalyzerAddUp = () => {
    return (
     
            <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="BreathalyzerModal" tabIndex="-1"  aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="m-1 mt-3">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Breathalyzer Result</legend>
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12 mt-1">
                                            <div className="text-field">
                                                <input type="text" name='Breathalyzer' id='Breathalyzer' className='' required />
                                                <label >Breathalyzer Description</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" className="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" className="btn btn-sm btn-success mr-1" data-dismiss="modal" >Close</button>
                        </div>
                    </div>
                </div>
            </dialog>

  
    )
}

export default BreathalyzerAddUp