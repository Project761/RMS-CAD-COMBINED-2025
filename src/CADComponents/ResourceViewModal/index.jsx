import { memo, useContext, useEffect, useState } from "react";
import ResourcesStatusServices from "../../CADServices/APIs/resourcesStatus";
import PropTypes from "prop-types";
import useObjState from "../../CADHook/useObjState";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { useSelector } from "react-redux";
import { IncidentContext } from "../../CADContext/Incident";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import ResourcesTableSection from "../MonitorScreen/ResourcesTableSection";

const ResourceViewModal = (props) => {
    const { openResourceViewModal, setOpenResourceViewModal, incidentID, CADIncidentNumber } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { resourceData, resourceRefetch, incidentRefetch } = useContext(IncidentContext);
    const [loginAgencyID, setLoginAgencyID] = useState();
    const [loginPinID, setLoginPinID] = useState(1);

    const [
        dispatchState,
        ,
        ,
        clearDispatchState,
    ] = useObjState({
        IncidentID: "",
        Resources1: "",
        Comments: ""
    });

    const [
        errorDispatch,
        ,
        handleErrorDispatch,
        clearStateDispatch,
    ] = useObjState({
        IncidentID: false,
        Resources1: false,
    });

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID)
            setLoginPinID(localStoreData?.PINID)

        }
    }, [localStoreData]);


    const onCloseLocation = () => {
        clearDispatchState();
        clearStateDispatch();
        setOpenResourceViewModal(false);
    };
    // const { resourceData } = useContext(IncidentContext);
    const [resources, setResources] = useState([])

    // const useRouteQuery = () => {
    //     const params = new URLSearchParams(useLocation().search);
    //     return {
    //         get: (param) => params.get(param)
    //     };
    // };

    // const query = useRouteQuery();
    // let IncID = query?.get("IncId");
    // if (!IncID) IncID = 0;
    // else IncID = parseInt(base64ToString(IncID));

    useEffect(() => {
        if (resourceData?.length > 0) {
            const filteredData = resourceData.filter((item) => item.IncidentID === incidentID);
            setResources(filteredData);
        }
    }, [resourceData, incidentID]);
    const validateDispatch = () => {
        let isError = false;
        const keys = Object.keys(errorDispatch);
        keys.map((field) => {
            if (
                field === "IncidentID" &&
                isEmpty(dispatchState[field])) {
                handleErrorDispatch(field, true);
                isError = true;
            } else if (field === "Resources1" && isEmptyObject(dispatchState[field])) {
                handleErrorDispatch(field, true);
                isError = true;
            } else {
                handleErrorDispatch(field, false);
            }
            return null;
        });
        return !isError;
    };

    async function handleSave() {
        if (!validateDispatch()) return;
        const resourceIDs = dispatchState.Resources1.map(item => item.ResourceID).join(',');
        const data = {
            Status: "DP",
            IncidentID: dispatchState?.IncidentID,
            Resources: resourceIDs,
            Comments: dispatchState?.Comments,
            CreatedByUserFK: loginPinID,
            AgencyID: loginAgencyID,
        }
        const response = await ResourcesStatusServices.incidentRecourseStatus(data);
        if (response?.status === 200) {
            toastifySuccess("Data Saved Successfully");
            onCloseLocation();
            incidentRefetch();
            resourceRefetch();
        }
    }
    const handleClose = () => {
        setOpenResourceViewModal(false);
    };


    return (
        <>
            {openResourceViewModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "9999" }}
                        id="resourceViewModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content modal-content-cad">
                                <div className="modal-body">
                                    <div className="row pb-2">
                                        <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                                            <p
                                                className="p-0 m-0 font-weight-medium"
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: 500,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                {CADIncidentNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-container">
                                                <ResourcesTableSection resources={resources} isCADMap />
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 p-0">
                                            <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                    <button
                                                        type="button"
                                                        className="save-button ml-2"
                                                        onClick={() => handleSave()}
                                                    >
                                                        {'Save'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        data-dismiss="modal"
                                                        className="cancel-button"
                                                        onClick={() => handleClose()}
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
                    </dialog >
                </>
            ) : (
                <> </>
            )
            }
        </>
    );
};

export default memo(ResourceViewModal);

// PropTypes definition
ResourceViewModal.propTypes = {
  openResourceViewModal: PropTypes.bool.isRequired,
  setOpenResourceViewModal: PropTypes.func.isRequired,
  incidentID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  CADIncidentNumber: PropTypes.string
};

// Default props
ResourceViewModal.defaultProps = {
  incidentID: null,
  CADIncidentNumber: ""
};
