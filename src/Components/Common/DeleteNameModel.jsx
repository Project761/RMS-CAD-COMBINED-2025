import React from 'react'

const DeleteNameModal = (props) => {

    const { func, Imgfunc, clearID , setStatusFalse , setToReset } = props

    

    return (
        <div className="modal fade" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="DeleteNameModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="box text-center py-5">
                        <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to delete this record?</h5>
                        <div className="btn-box mt-3">
                           
                            
                     <button type="button" onClick={func} className="btn btn-sm text-white" style={{ background: "#ef233c" }} data-dismiss="modal">Delete</button>
                            <button type="button" className="btn btn-sm btn-secondary ml-2 " onClick={()=>{setStatusFalse(); setToReset()}} data-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DeleteNameModal;
