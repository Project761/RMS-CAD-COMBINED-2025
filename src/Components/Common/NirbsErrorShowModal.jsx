import Loader from "./Loader";

const NirbsErrorShowModal = (props) => {

    const { ErrorText, nibErrModalStatus, setNibrsErrModalStatus, nibrsValidateloder, offenseClick, OffenseState } = props

    return (
        <>
            {
                nibErrModalStatus ?
                    <div className="modal" style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: '11111', }} id="NibrsErrorShowModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="btn-box mt-4 m-2">
                                    {
                                        !nibrsValidateloder ?
                                            <>
                                                <div className="border border-danger text-center p-3 mt-2 mb-2">
                                                    {
                                                        offenseClick ?
                                                            <pre>{OffenseState ? OffenseState : 'No Errors'}</pre>
                                                            :
                                                            <pre>{ErrorText?.OnPageError || ErrorText || 'No Errors'}</pre>
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-between me-2">
                                                    <div>
                                                    </div>
                                                    <button type="button"
                                                        className="btn btn-sm btn-success ml-2  "
                                                        data-dismiss="modal" onClick={() => { setNibrsErrModalStatus(false) }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </>
                                            :
                                            <Loader />
                                    }
                                </div>

                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    )
}

export default NirbsErrorShowModal