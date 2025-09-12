import { useContext, useEffect, useState } from "react";
import Loader from "../../Common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { Decrypt_Id_Name, tableCustomStyles } from "../../Common/Utility";
import { Incident_ID, Incident_Number } from "../../../redux/actionTypes";
import { fetchPostData } from "../../hooks/Api";
import { toastifyError } from "../../Common/AlertMsg";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { get_ScreenPermissions_Data } from "../../../redux/actions/IncidentAction";
import { get_LocalStoreData } from "../../../redux/actions/Agency";
import CadPropertyModel from "./CadPropertyModel";
import { AgencyContext } from "../../../Context/Agency/Index";
import NonpropertyModel from "./NonpropertyModel";



const NonPropertyStorageList = (props) => {
  const { newfiltered } = props;

  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [loder, setLoder] = useState(false);
  const uniqueId = sessionStorage.getItem("UniqueUserID")
    ? Decrypt_Id_Name(
        sessionStorage.getItem("UniqueUserID"),
        "UForUniqueUserID"
      )
    : "";
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const effectiveScreenPermission = useSelector(
    (state) => state.Incident.effectiveScreenPermission
  );
  // const [incidentFilterData, setIncidentFilterData] = useState();
  const [modelActivityStatus, setModelActivityStatus] = useState("");
  const [taskListID, setTaskListID] = useState("");
  const [rowData, setRowData] = useState();
  const [modalOpenStatus, setModalOpenStatus] = useState(false);
  const [dataSaved, setDataSaved] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [propertyID , setpropertyID] = useState([]);
  const [masterPropertyID , setmasterPropertyID] = useState([]);

  const { incidentFilterData, setIncidentFilterData } =
    useContext(AgencyContext);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      dispatch(
        get_ScreenPermissions_Data(
          "I034",
          localStoreData?.AgencyID,
          localStoreData?.PINID
        )
      );
      getIncidentSearchData(localStoreData?.PINID);
    }
  }, [localStoreData]);

  const getIncidentSearchData = async (AgencyID) => {
    fetchPostData("TaskList/GetDataDashBoard_TaskList", {
      OfficerID: parseInt(AgencyID),
      PropertyRoomType: "IsNonPropertyRoom",
    }).then((res) => {
      if (res.length > 0) {
        setIncidentFilterData(res);
        setLoder(true);
      } else {
        setLoder(true);
        setIncidentFilterData([]);
      }
    });
  };

  const columns = [
    // {
    //     width: "80px",
    //     name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
    //     cell: row => (
    //         <div style={{ position: 'absolute', top: 4, }}>
    //             {
    //                 effectiveScreenPermission ?
    //                     effectiveScreenPermission[0]?.Changeok ?
    //                         <Link to=""
    //                             onClick={(e) => {
    //                                 set_IncidentId(row);
    //                                 setModelActivityStatus(row.Activity);
    //                             }}
    //                             className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
    //                             <i className="fa fa-edit" data-toggle="modal" data-target="#MasterModalProperty"></i>
    //                         </Link>
    //                         : <></>
    //                     : <Link to=""
    //                         onClick={(e) => { set_IncidentId(row); }}
    //                         className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
    //                         <i className="fa fa-edit" data-toggle="modal" data-target="#MasterModalProperty"></i>
    //                     </Link>
    //             }
    //         </div>)
    // },
    {
      // omit: incAdvSearchData == "kdsjfhkjsdfsdf" ? true : false,
      name: (
        <p className="text-end" style={{ position: "absolute", top: 8 }}>
          Action
        </p>
      ),
      cell: (row) => (
        <div style={{ position: "absolute", top: 4 }}>
          {effectiveScreenPermission ? (
            effectiveScreenPermission[0]?.Changeok ? (
              <Link
                to=""
                onClick={(e) => {
                  setRowData(row);
                  set_IncidentId(row);
                  setTaskListID(row?.TaskListID);
                  setModelActivityStatus(row.Activity);
                  setModalOpenStatus(true);
                  setpropertyID(row.PropertyID)
                  setmasterPropertyID(row.MasterPropertyID);
                }}
                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                style={{
                  lineHeight: "1",
                  minWidth: "22px",
                  height: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                }}
              >
                <i
                  className="fa fa-edit"
                  data-toggle="modal"
                  data-target="#NonpropertyModel"
                  style={{ fontSize: "10px" }}
                ></i>
              </Link>
            ) : (
              <></>
            )
          ) : (
            <Link
              to=""
              onClick={(e) => {
                set_IncidentId(row);
              }}
              className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
              style={{
                lineHeight: "1",
                minWidth: "22px",
                height: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
              }}
            >
              <i
                className="fa fa-edit"
                data-toggle="modal"
                data-target="#NonpropertyModel"
                style={{ fontSize: "10px" }}
              ></i>
            </Link>
          )}
        </div>
      ),
    },
    {
      name: "Entry Date & Time",
      selector: (row) => (row?.EnteryDtTm).replace("T", " & "),
      sortable: true,
    },
    {
      name: "Property",
      selector: (row) => row.PropertyNumber,
      sortable: true,
    },

    {
      name: "Property Type",
      selector: (row) => row.Category_Description,
      sortable: true,
    },
    {
      name: "Reason Code",
      selector: (row) => row.LossCode_Description,
      sortable: true,
    },

    {
      name: "Owner Name",
      selector: (row) => row.OwnerName,
      sortable: true,
    },
    {
      name: "Opened By",
      selector: (row) => "",
      sortable: true,
    },
    // {

    //     name: 'Activity',
    //     cell: (row) => (
    //         <div style={{
    //             color: 'red',
    //             backgroundColor: 'rgba(255, 0, 0, 0.1)',
    //             padding: '4px 8px',
    //             borderRadius: '4px',
    //             boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    //         }}>
    //             {row.Activity}
    //         </div>
    //     ),
    //     sortable: true
    // }
  ];

  const set_IncidentId = (row) => {
    if (row.IncidentID) {
      dispatch({ type: Incident_ID, payload: row?.IncidentID });
      dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
    }
  };

  console.log(newfiltered , incidentFilterData);
  return (
    <>
      <div
        className="section-body mt-4"
        style={{ margin: "10px 10px 10px 15px" }}
      >
        {/* <div className="col-3 mb-2" >
                    <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center text-align-center" >
                        <span className="ml-3">Non Property Room Storage</span>
                    </div>
                </div> */}
        <div className="row clearfix">
          <div className="main-dashboard col-12 ">
            <div className="col-12 col-sm-12">
              {loder ? (
                <DataTable
                  columns={columns}
                  persistTableHead={true}
                  dense
                  data={
                    effectiveScreenPermission
                      ? effectiveScreenPermission[0]?.DisplayOK
                        ? newfiltered?.length > 0
                          ? newfiltered
                          : incidentFilterData
                        : []
                      : ""
                  }
                  pagination
                  paginationPerPage={"100"}
                  paginationRowsPerPageOptions={[100, 150, 200, 500]}
                  showPaginationBottom={100}
                  highlightOnHover
                  responsive
                  customStyles={tableCustomStyles}
                  subHeaderAlign="left"
                  noDataComponent={
                    effectiveScreenPermission
                      ? effectiveScreenPermission[0]?.DisplayOK
                        ? "There are no data to display"
                        : "You don’t have permission to view data"
                      : "There are no data to display"
                  }
                />
              ) : (
                <Loader />
              )}
            </div>
            {/* <div className="col-3 col-md-3 col-lg-12 mt-2 px-1 d-flex justify-content-end">
                            <button type="button" className="btn btn-sm mb-2 mt-1 mr-2" style={{ border: "1px solid #001f3f", color: "#000" }}>
                                Export
                            </button>
                            <button type="button" data-toggle="modal" data-target="#MasterModalProperty" className="btn btn-sm mb-2 mt-1 " style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={() => setShowModal(true)}>
                                Send
                            </button>
                        </div> */}
          </div>
        </div>
      </div>
      {/* <CadPropertyModel show={showModal} handleClose={() => setShowModal(false)} setModelActivityStatus={setModelActivityStatus} modelActivityStatus={modelActivityStatus} /> */}
      {/* <CadPropertyModel show={showModal} modalOpenStatus={modalOpenStatus} setDataSaved={setDataSaved} setModalOpenStatus={(bool) => { setModalOpenStatus(bool) }} taskListID={taskListID} rowData={rowData} handleClose={() => setShowModal(false)} setModelActivityStatus={setModelActivityStatus} modelActivityStatus={modelActivityStatus} getIncidentSearchData={getIncidentSearchData} /> */}
      <NonpropertyModel
        show={showModal}
        modalOpenStatus={modalOpenStatus}
        setDataSaved={setDataSaved}
        setModalOpenStatus={(bool) => {
          setModalOpenStatus(bool);
        }}
        propertyID={propertyID}
        masterPropertyID={masterPropertyID}
        taskListID={taskListID}
        rowData={rowData}
        handleClose={() => setShowModal(false)}
        setModelActivityStatus={setModelActivityStatus}
        modelActivityStatus={modelActivityStatus}
        getIncidentSearchData={getIncidentSearchData}
      />
    </>
  );
};

export default NonPropertyStorageList;
