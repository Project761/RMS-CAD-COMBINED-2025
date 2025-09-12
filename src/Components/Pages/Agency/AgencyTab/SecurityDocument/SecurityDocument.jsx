import React from 'react'

const SecurityDocument = () => {
    return (
     
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="row">
                        <div className="col-4">
                            <select name="" id="" className='form-control form-control-sm' style={{ padding: '3px 4px' }}>
                                <option value="">Application</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Security Document
                        </p>

                    </div>

                    <div className="card py-2 px-2 mt-2">
                        <div className="row">
                            <div className="col-6">
                                <div className="text-field">
                                    <input type="text" required />
                                    <label>Document Type</label>
                                </div>
                            </div>
                            <div className="" style={{ border: '1px solid #E6E9ED', marginRight: '-2px' }}>  </div>

                            <div className="col-6">
                                <select name="" id="" className='form-control form-control-sm' style={{ padding: '3px 4px' }}>
                                    <option value="">Module</option>
                                    <option value="">Arrest</option>
                                    <option value="">Name</option>
                                    <option value="">Property</option>
                                    <option value="">Incident</option>
                                    <option value="">Case Mangement</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
    
    )
}

export default SecurityDocument