import React from 'react'
import Select from "react-select";

const OffenseAddUp = () => {

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    return (
    
            <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="OffenseModal" tabIndex="-1"  aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="m-1 mt-3">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Offense</legend>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-6 col-md-6 pt-1 mb-1 col-lg-6  dropdown__box">
                                                    <Select
                                                        name='offense'
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor='' className='mt-1'>Offense</label>
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

export default OffenseAddUp