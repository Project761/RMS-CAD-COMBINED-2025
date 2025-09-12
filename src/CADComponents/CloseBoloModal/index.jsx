import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { useQuery } from 'react-query';
import Select from "react-select";
import { useSelector } from 'react-redux';
import useObjState from '../../CADHook/useObjState';
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import { toastifySuccess } from '../../Components/Common/AlertMsg';
import BoloServices from "../../CADServices/APIs/bolo";
import { isEmpty } from '../../CADUtils/functions/common';
import { colourStyles1 } from '../Utility/CustomStylesForReact';

function CloseBoloModal(props) {
    const { openCloseBolo, setOpenCloseBolo, boloState, refetch, clearBoloState, clearErrorState, setSelectedImages, handelClear } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [boloDisposition, setBoloDisposition] = useState([]);

    const [
        closeBoloState,
        ,
        handleCloseBoloState,
        clearCloseBoloState,
    ] = useObjState({
        BOLODisposition: "",
        Comments: ""
    });

    const [
        errorState,
        ,
        handleErrorState,
        clearBoloCloseErrorState,
    ] = useObjState({
        BOLODisposition: false,
        Comments: false,
    });

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    const getBoloDispositionKey = `/CAD/Monitor/GetData_DropDown_Bolo/${loginAgencyID}`;
    const { data: getBoloDispositionData, isSuccess: isFetchBoloDisposition } = useQuery(
        [getBoloDispositionKey, {
            AgencyID: loginAgencyID,
        }],
        MasterTableListServices.getData_DropDown_Bolo,
        {
            refetchOnWindowFocus: false,
            enabled: openCloseBolo && !!loginAgencyID,
            retry: 0
        }
    );

    useEffect(() => {
        if (getBoloDispositionData && isFetchBoloDisposition) {
            const data = JSON.parse(getBoloDispositionData?.data?.data);
            setBoloDisposition(data?.Table)
        } else {
            setBoloDisposition([]);
        }
    }, [getBoloDispositionData, isFetchBoloDisposition]);

    function handelClose() {
        setOpenCloseBolo(false);
        clearCloseBoloState();
        clearBoloCloseErrorState();
        clearErrorState();
        clearBoloState();
        handelClear();
    }

    const validateForm = () => {
        let isError = false;
        const keys = Object.keys(errorState);
        keys.map((field) => {
            if (
                field === "BOLODisposition" &&
                isEmpty(closeBoloState[field])) {
                handleErrorState(field, true);
                isError = true;
            } else if (
                field === "Comments" &&
                isEmpty(closeBoloState[field])) {
                handleErrorState(field, true);
                isError = true;
            } else {
                handleErrorState(field, false);
            }
            return null;
        });
        return !isError;
    };

    async function handleSave() {
        if (!validateForm()) return;

        const payload = {
            BoloId: boloState?.BoloID,
            BoloDispositionId: closeBoloState?.BOLODisposition,
            Comments: closeBoloState?.Comments,
            ModifiedByUserFK: loginPinID,
            AgencyID: loginAgencyID,
        };
        const response = await BoloServices.closeBolo(payload);

        if (response?.status === 200) {
            toastifySuccess("Data Saved Successfully");
            refetch();
            handelClose();
            setSelectedImages([]);
            clearBoloState();
            clearErrorState();
        }
    }

    return (
        <>
            {openCloseBolo ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200" }}
                        id="BoloCloseModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content modal-content-cad">
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-22 p-0 pb-2">
                                            <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                                                <p
                                                    className="p-0 m-0 font-weight-medium"
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: 500,
                                                        letterSpacing: 0.5,
                                                    }}
                                                >
                                                    Close BOLO
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Form Section */}
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-container">
                                                {/* Line 2 */}
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end mt-2">
                                                        <label className="tab-form-label text-nowrap">BOLO Disposition{errorState.BOLODisposition && isEmpty(closeBoloState?.BOLODisposition) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Disposition"}</p>
                                                        )}</label>
                                                    </div>
                                                    <div className="col-3 mt-2">
                                                        <Select
                                                            isClearable
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            styles={colourStyles1}
                                                            options={boloDisposition}
                                                            getOptionLabel={(v) => `${v?.DispositionCode} | ${v?.Description}`}
                                                            getOptionValue={(v) => v?.DispositionCode}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.DispositionCode} | ${option?.Description}`
                                                                    : option?.DispositionCode;
                                                            }}
                                                            maxMenuHeight={180}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            value={closeBoloState?.BOLODisposition ? boloDisposition?.find((i) => i?.BoloDispositionID === closeBoloState?.BOLODisposition) : ""}
                                                            onChange={(e) => handleCloseBoloState("BOLODisposition", e?.BoloDispositionID)}
                                                            isSearchable={true}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Line 6 */}
                                                <div className="tab-form-row" style={{ alignItems: 'baseline' }}>
                                                    <div className="col-2 d-flex align-items-end justify-content-end">
                                                        <label className="tab-form-label">
                                                            Disposition Details{errorState.Comments && isEmpty(closeBoloState?.Comments) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Disposition Details"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-10 d-flex align-items-center justify-content-end">
                                                        <textarea
                                                            type="text"
                                                            rows="3"
                                                            className="form-control  py-1 new-input requiredColor"
                                                            style={{ height: "auto", overflowY: "scroll" }}
                                                            placeholder="Comment"
                                                            value={closeBoloState?.Comments}
                                                            onChange={(e) => {
                                                                handleCloseBoloState("Comments", e.target.value)
                                                                e.target.style.height = "auto";
                                                                const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                                                                e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    {/* Buttons Section */}
                                    <div className="row">
                                        <div className="col-12 p-0">
                                            <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                    <button
                                                        type="button"
                                                        className="save-button ml-2"
                                                        onClick={() => { handleSave() }}
                                                    >
                                                        {'Save'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        data-dismiss="modal"
                                                        className="cancel-button"
                                                        onClick={() => { handelClose() }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </>
            ) : (
                <> </>
            )}
        </>
    );
}

// Adding propTypes for safety
CloseBoloModal.propTypes = {
    openCloseBolo: PropTypes.bool.isRequired,          // Whether the modal is open
    setOpenCloseBolo: PropTypes.func.isRequired,       // Function to set modal open state
    boloState: PropTypes.object.isRequired,            // The state of the BOLO (BoloID, etc.)
    refetch: PropTypes.func.isRequired,                // Function to trigger refetching of data
    clearBoloState: PropTypes.func.isRequired,         // Function to clear the BOLO state
    clearErrorState: PropTypes.func.isRequired,        // Function to clear error state
    setSelectedImages: PropTypes.func.isRequired,      // Function to set selected images
};

export default CloseBoloModal;
