import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData } from '../../../../hooks/Api';
import { Decrypt_Id_Name, Requiredcolour, selectBoxDiableColourStyles, base64ToString, getShowingDateText, tableCustomStyles, isLockOrRestrictModule } from '../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data, get_Report_Approve_Officer_Data, get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';

const Pin = ({ isLocked }) => {

  const dispatch = useDispatch()
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));


  const [pinData, setPinData] = useState([]);
  const [loginPinID, setLoginPinID] = useState('');
  const [editValueObject, setEditValueObject] = useState({});

  const [value, setValue] = useState({
    OfficerID: '',
    OfficerActivityComment: '',
    IncidentOfficerActivityID: '',
    ModifiedByUserFK: '',
  })

  const [errors, setErrors] = useState({
    'OfficerIDError': '', 'OfficerActivityCommentError': '',
  })

  const isInitailReportGenerated = pinData?.find((item) => item?.NarrativeTypeCode === "NI" ? true : false);


  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(parseInt(localStoreData?.PINID));
      dispatch(get_Report_Approve_Officer_Data(localStoreData?.AgencyID));
      dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID));
      dispatch(get_ScreenPermissions_Data("I028", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  useEffect(() => {
    if (IncID) {
      get_Pin_Data(IncID);
    }
  }, [IncID]);

  const get_Pin_Data = (incidentID) => {
    const val = { 'IncidentId': incidentID, }
    fetchPostData('IncidentOfficerActivity/GetData_IncidentOfficerActivity', val).then((res) => {
      if (res) {
        setPinData(res);

      } else {
        setPinData([]);

      }
    })
  }

  const columns = [
    {
      name: 'Activity Details',
      selector: (row) => row.ReportType ? row.ReportType : '',
      sortable: true
    },
    {
      name: 'Date/Time',
      selector: (row) => row.ActivityDtTm ? getShowingDateText(row.ActivityDtTm) : '',
      sortable: true
    },
    {
      name: 'Role',
      selector: (row) => row.Role_Des ? row.Role_Des : '',

      sortable: true
    },
    {
      name: 'Officer',
      selector: (row) => row.OfficerName ? row.OfficerName : '',
      sortable: true
    },
    {
      name: 'Written For',
      selector: (row) => row.WrittenFor ? row.WrittenFor : '',
      sortable: true
    },
    {
      name: 'Comments',
      selector: (row) => row.OfficerActivityComment ? row.OfficerActivityComment : '',
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Edit</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            (row?.IsPrimaryOfficer === 'true' || row?.IsPrimaryOfficer === 'True') && !isInitailReportGenerated ? (

              effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                <span onClick={() => { setEditValue(row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                  <i className="fa fa-edit"></i>
                </span>
                :
                <></>
                :
                <></>
            )
              :
              null
          }
        </div>
    }
  ]

  const setEditValue = (row) => {
    setEditValueObject(row);
    setValue({ ...value, IncidentOfficerActivityID: row?.IncidentOfficerActivityID, OfficerID: row?.OfficerID, OfficerActivityComment: row?.OfficerActivityComment });
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  }

  const updatePinData = () => {
    let errors = {};
    if (!value?.OfficerID) errors['OfficerIDError'] = "required *";
    if (!value?.OfficerActivityComment) errors['OfficerActivityCommentError'] = "required *";
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const val = {
      'IncidentOfficerActivityID': value?.IncidentOfficerActivityID,
      'OfficerID': value?.OfficerID,
      'OfficerActivityComment': value?.OfficerActivityComment,
      'ModifiedByUserFK': loginPinID,
    }
    fetchPostData('IncidentOfficerActivity/Update_IncidentOfficerActivity', val).then((res) => {
      if (res) {
        toastifySuccess("Updated Successfully");
        get_Pin_Data(IncID);
        setValue({ ...value, IncidentOfficerActivityID: '', OfficerID: '', OfficerActivityComment: '' });
        setErrors({ ...errors, 'OfficerIDError': '', 'OfficerActivityCommentError': '' });
        setEditValueObject({});
      }
    })
  }

  // Custom Style
  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  return (
    <>
      <div className="row mb-1">
        <div className="col-12 col-md-12 col-lg-12 mt-1">
          <div className="row">
            <div className="col-3 col-md-3 col-lg-1 mt-2">
              <span className="new-label">
                Primary Officer5465465
                {errors.OfficerIDError !== "true" ? (
                  <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>
                    {errors.OfficerIDError}
                  </p>
                ) : null}
              </span>
            </div>
            <div className="col-9  col-md-9 col-lg-4 mt-1">
              <Select
                name="OfficerID"
                // styles={Requiredcolour}
                styles={isLockOrRestrictModule("Lock", editValueObject?.OfficerID, isLocked) ? selectBoxDiableColourStyles : Requiredcolour}
                isDisabled={isLockOrRestrictModule("Lock", editValueObject?.OfficerID, isLocked) ? true : false}

                value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerID)}
                options={agencyOfficerDrpData}
                isClearable={value?.OfficerID ? true : false}
                onChange={(e) => ChangeDropDown(e, "OfficerID")}
                placeholder="Select..."
              />
            </div>
            <div className="col-3 col-md-3 col-lg-1 mt-2">
              <span className="new-label">
                Comments
                {errors.OfficerActivityCommentError !== "true" ? (
                  <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>
                    {errors.OfficerActivityCommentError}
                  </p>
                ) : null}
              </span>
            </div>
            <div className="col-9 col-md-9 col-lg-4  mt-1">
              <textarea
                name="OfficerActivityComment"

                className={`form-control ${isLockOrRestrictModule("Lock", editValueObject?.OfficerActivityComment, isLocked) ? "readonlyColor" : "requiredColor"}`}
                disabled={isLockOrRestrictModule("Lock", editValueObject?.OfficerActivityComment, isLocked) ? true : false}

                value={value.OfficerActivityComment}
                onChange={(e) => setValue({ ...value, OfficerActivityComment: e.target.value })}
                id=""
                cols="30"
                rows="1"
                style={{ resize: "none" }}
              >
              </textarea>
            </div>
            <div className="col-12 col-md-12 col-lg-2 mt-1 d-flex justify-content-end">
              {
                effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?

                  value?.IncidentOfficerActivityID ? (
                    <button className="btn btn-sm btn-success" onClick={updatePinData}>Update</button>
                  ) : (
                    <></>
                  )
                  :
                  <></>
                  :
                  <></>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <DataTable
          dense
          columns={columns}
          // data={pinData}
          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? pinData : '' : ''}
          customStyles={tableCustomStyles}
          pagination
          responsive
          paginationPerPage={'50'}
          paginationRowsPerPageOptions={[100, 150, 200, 500]}
          showPaginationBottom={50}
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          striped
          persistTableHead={true}
          highlightOnHover
          fixedHeader
          className="mt-2"
        />
      </div>
    </>
  )
}

export default Pin