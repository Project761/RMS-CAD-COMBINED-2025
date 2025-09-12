import React from 'react'
import Select from "react-select";

const ConnectionAddUp = () => {

    
    // custuom style withoutColor
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
   
            <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ConnectionModal" tabIndex="-1"  aria-hidden="true" data-backdrop="false">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="m-1">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Connection</legend>
                                    <div className="col-12 col-md-12  p-0" >
                                        <div className="row ">
                                            <div className="col-6 col-md-6 col-lg-6 ">
                                                <div className=" dropdown__box">
                                                    <Select
                                                        name='name'
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label>Name</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-6 col-lg-6 ">
                                                <div className=" dropdown__box">
                                                    <Select
                                                        name='relationship'
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label>Relationship</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" className="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1">Close</button>
                        </div>
                    </div>
                </div>
            </dialog>
       
    )
}

export default ConnectionAddUp