import { useContext, useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { base64ToString, getShowingYearMonthDate, tableCustomStyles } from '../../../../Components/Common/Utility';
import MonitorServices from '../../../../CADServices/APIs/monitor'
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import useObjState from "../../../../CADHook/useObjState";
import { useSelector } from "react-redux";
import { toastifySuccess } from "../../../../Components/Common/AlertMsg";
import { isEmpty, compareStrings } from "../../../../CADUtils/functions/common";
import { IncidentContext } from "../../../../CADContext/Incident";
import { ScreenPermision } from "../../../../Components/hooks/Api";

const columns = [
  {
    name: 'Comment Date & Time',
    selector: row => row.commentDateTime,
    sortable: true,
    format: row => row?.CommentDateTime ? getShowingYearMonthDate(row?.CommentDateTime) : "",
  },
  {
    name: 'Operator Name',
    selector: row => row.OperatorName,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.OperatorName, rowB.OperatorName),
  },
  {
    name: 'Comments',
    selector: row => row.Comments,
    sortable: false,
    width: "40%",
    cell: row => (
      <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {row.Comments}
      </div>
    ),
  },
  {
    name: 'Unit #',
    selector: row => row.Resources,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.resourceNumber, rowB.resourceNumber),
  },
];

const CommentsTabFrom = (props) => {
  const { isViewEventDetails = false } = props;
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const { CommentsData, refetchGetComments, setIncID } = useContext(IncidentContext);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [isCallAPI, setIsCallAPI] = useState(false)
  const [loginPinID, setLoginPinID,] = useState('');
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState(null);

  const [
    commentState,
    setCommentState,
    handleCommentState,
    ,
  ] = useObjState({
    incidentNumber: "",
    location: "",
    comments: ""
  })
  const [
    errorComment,
    ,
    handleErrorComment,
    ,
  ] = useObjState({
    comments: false
  });

  const useURLQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useURLQuery();
  let IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  useEffect(() => {
    if (IncID) {
      setIncID(IncID)
    }
  }, [IncID])

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      setLoginPinID(parseInt(localStoreData?.PINID));
      getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID)
    }
  }, [localStoreData]);

  const getScreenPermision = (aId, pinID) => {
    try {
      ScreenPermision("CA105", aId, pinID).then(res => {
        if (res) {
          setEffectiveScreenPermission(res);
        }
        else {
          setEffectiveScreenPermission(null);
        }
      });
    } catch (error) {
      console.error('There was an error!', error);
      setEffectiveScreenPermission(null);
    }
  }

  const getSingleIncidentKey = `/CAD/Monitor/MonitorIncidentByID/${IncID}`;
  const { data: singleIncidentData, isSuccess: isFetchSingleIncidentData } = useQuery(
    [getSingleIncidentKey, {
      IncidentID: IncID, AgencyID: loginAgencyID,
    }],
    MonitorServices.getSingleIncident,
    {
      refetchOnWindowFocus: false,
      enabled: !!IncID && !!loginAgencyID,
      retry: 0,
      onSuccess: (data) => {
        const parsedData = JSON.parse(data?.data?.data)?.Table || [];
        setCommentState({
          incidentNumber: parsedData[0]?.CADIncidentNumber,
          location: parsedData[0]?.CrimeLocation,
          comments: ""
        })
      },
      onError: (error) => {
        if (error?.response?.data?.Code === 400) {
          console.error("No Data Available", error?.response?.data?.Message);
        } else {
          console.error("An error occurred:", error);
        }
      }
    }
  );

  const validateCommentFormValues = () => {
    let isError = false;
    const keys = Object.keys(errorComment);
    keys.map((field) => {
      if (field === "comments" && isEmpty(commentState[field])) {
        handleErrorComment(field, true);
        isError = true;
      } else {
        handleErrorComment(field, false);
      }
      return null;
    });
    return !isError;
  };

  async function handleSave() {
    if (!validateCommentFormValues()) return;
    setIsCallAPI(true);
    if (IncID) {
      const payload = {
        "IncidentId": IncID,
        "Comments": commentState?.comments,
        "OfficerId": loginPinID,
        "CreatedByUserFK": loginPinID,
        "AgencyID": loginAgencyID,
      }
      const response = await MonitorServices.insertComment(payload);
      if (response?.data?.success) {
        toastifySuccess("Data Added Successfully");
        setCommentState({
          comments: ""
        })
        refetchGetComments()
      }
    }
    setIsCallAPI(false);
  }

  return (
    <>
      <div className="tab-form-monitor-container section-body pt-1 p-1 bt">
        <div className="card CAD-bg-color">
          <div className="card-body" style={{ display: "grid", gap: "5px" }}>
            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label for="" className="tab-form-label">
                  CAD Event #
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  value={commentState?.incidentNumber}
                  className="form-control py-1 new-input"
                  readOnly
                />
              </div>
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label for="" className="tab-form-label">
                  Location
                </label>
              </div>
              <div className="col-6 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  value={commentState?.location}
                  className="form-control py-1 new-input"
                  readOnly
                />
              </div>
            </div>
            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label for="" className="tab-form-label">
                  Comments{errorComment?.comments && (
                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter comments"}</p>
                  )}
                </label>
              </div>
              <div className="col-9 d-flex align-self-center justify-content-end">
                <textarea
                  className="form-control py-1 new-input"
                  style={{ height: "auto", overflowY: "auto" }}
                  value={commentState?.comments}
                  placeholder="Comments"
                  onChange={(e) => {
                    handleCommentState("comments", e.target.value);
                    e.target.style.height = "auto";
                    const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                  }}
                  rows="3"
                />
              </div>
            </div>
            <div className="tab-form-row">
              {!isViewEventDetails && effectiveScreenPermission?.[0]?.AddOK === 1 && <div className="offset-1 col-3 d-flex align-self-center justify-content-start">
                <button className="save-button d-flex align-items-center justify-content-center" style={{ gap: '3px' }} disabled={isCallAPI} onClick={() => handleSave()}>
                  <FontAwesomeIcon icon={faAdd} style={{ color: 'white' }} />
                  {"Add Comment"}
                </button>
              </div>}
            </div>
          </div>
          <div className="table-responsive CAD-table">
            <DataTable
              dense
              columns={columns}
              data={effectiveScreenPermission ? effectiveScreenPermission?.[0]?.DisplayOK ? CommentsData : '' : ''}
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              customStyles={tableCustomStyles}
              pagination
              responsive
              striped
              highlightOnHover
              fixedHeader
              persistTableHead={true}
              fixedHeaderScrollHeight="200px"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentsTabFrom;
