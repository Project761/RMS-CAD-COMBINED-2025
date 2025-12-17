import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom'
import { Decrypt_Id_Name, getShowingWithOutTime, isLockOrRestrictModule, tableCustomStyles } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import PropListng from '../../../ShowAllList/PropListng';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';

const Owner = (props) => {

  const { ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails = false, isLocked, setIsLocked } = props
  const { get_Property_Count, setChangesStatus } = useContext(AgencyContext);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const arresteeNameProperty = useSelector((state) => state.DropDown.arresteeNameProperty);

  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  let MstPage = query?.get('page');

  const SelectedValue = useRef();
  const [ownerData, setOwnerData] = useState([]);
  const [propertyOwnerID, setPropertyOwnerID] = useState(0);
  //screen permission 
  const [filterData, setFilterData] = useState();
  const [loginPinID, setLoginPinID,] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [ownerIdDrp, setOwnerIdDrp] = useState([]);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [nameModalStatus, setNameModalStatus] = useState(false);
  const [possenSinglData, setPossenSinglData] = useState([]);
  const [possessionID, setPossessionID] = useState('');
  // permissions
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();
  const [type, setType] = useState("Pro-Owner");

  const [value, setValue] = useState({
    'MasterPropertyID': '', 'PropertyID': '', 'labal': '', 'OwnerID': null, 'IsDefaultOwner': '', 'PropertyOwnerID': '',
    'CreatedByUserFK': '', 'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
  })

  const [errors, setErrors] = useState({ 'OwnerIDError': '', });

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID); setLoginAgencyID(localStoreData?.AgencyID);
      dispatch(get_ScreenPermissions_Data("P062", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);


  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      // for change tab when not having  add and update permission
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 ? true : false);
    } else {
      setPermissionForAdd(false);
      setPermissionForEdit(false);
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);


  useEffect(() => {
    if (DecPropID || DecMPropID) { get_Data_Owner(DecPropID, DecMPropID); }
  }, [DecPropID, DecIncID]);

  useEffect(() => {
    if (MstPage === "MST-Property-Dash") {
      if (possessionID || DecPropID || DecMPropID) { get_Master_Owner_Drp(possessionID, DecMPropID, DecPropID,); }
    }
    else if (DecPropID) {
      if (possessionID || DecPropID || DecMPropID) { get_OwnerID_Drp(DecIncID); }
    }
  }, [possessionID, DecPropID, DecMPropID, DecIncID]);

  useEffect(() => {
    if (DecIncID && !MstPage) { get_OwnerID_Drp(DecIncID); }

  }, [DecIncID]);

  useEffect(() => {
    if (possessionID) { setValue({ ...value, 'OwnerID': possessionID, }); setPossenSinglData([]); } else { return }
  }, [nameModalStatus, possessionID]);

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.OwnerID)) {
      setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OwnerID) } })
    }
  }

  const { OwnerIDError } = errors

  useEffect(() => {
    if (OwnerIDError === 'true') { Add_Owner() } else { return }
  }, [OwnerIDError])

  const get_Data_Owner = (propertyID, DecMPropID) => {
    const val = { 'PropertyID': propertyID, 'MasterPropertyID': DecMPropID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    fetchPostData('PropertyOwner/GetData_PropertyOwner', val).then((res) => {
      if (res) {
        setOwnerData(res)
      } else {
        setOwnerData([]);
      }
    })
  }

  const get_OwnerID_Drp = (mainIncidentID) => {
    const val = { 'IncidentID': mainIncidentID, 'MasterNameID': 0, 'IsOwnerName': true, 'PropertyID': DecPropID }
    fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((res) => {
      if (res?.length > 0) {
        setFilterData(res);
        setOwnerIdDrp(res);

      } else {
        setOwnerIdDrp([]);
      }
    })
  }

  const get_Master_Owner_Drp = (possessionID, DecMPropID, DecPropID) => {
    const val = { 'IncidentID': '0', 'NameID': possessionID, 'MasterPropertyID': DecMPropID, 'PropertyID': DecPropID, }
    fetchPostData('Property/MasterProperty_ArresteeDropdown', val).then((res) => {
      if (res?.length > 0) {
        setFilterData(res);
        setOwnerIdDrp(res);

      } else {
        setOwnerIdDrp([]);
      }
    })
  }

  const Add_Owner = () => {
    const result = ownerData?.find(item => {
      if (item.OwnerID === value.OwnerID) {
        return item.OwnerID === value.OwnerID
      } else return item.OwnerID === value.OwnerID
    });
    if (result) {
      toastifyError('Owner Already Exists');
      setErrors({ ...errors, ['OwnerIDError']: '', });
    } else {
      const { MasterPropertyID, PropertyID, labal, OwnerID, IsDefaultOwner, PropertyOwnerID, CreatedByUserFK, IsMaster } = value
      const val = {
        'MasterPropertyID': DecMPropID, 'PropertyID': DecPropID, 'labal': labal, 'OwnerID': OwnerID, 'IsMaster': IsMaster,
        'IsDefaultOwner': IsDefaultOwner, 'PropertyOwnerID': PropertyOwnerID, 'CreatedByUserFK': loginPinID,
      }
      AddDeleteUpadate('PropertyOwner/Insert_PropertyOwner', val).then((res) => {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        setChangesStatus(false);
        get_Property_Count(DecPropID, DecMPropID, MstPage === "MST-Property-Dash" ? true : false);
        get_Data_Owner(DecPropID, DecMPropID);
        setErrors({ ...errors, ['OwnerIDError']: '', });
        onClear();
        if (MstPage === "MST-Property-Dash") {
          get_Master_Owner_Drp(DecPropID, DecMPropID);
        } else {
          get_OwnerID_Drp(DecIncID);
        }
      })
    }
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
    setValue(pre => { return { ...pre, ['OwnerID']: '', ['PropertyOwnerID']: '', ['labal']: '' } });
    setErrors({});
    setPossessionID('');
    setPossenSinglData([]);
  };

  const columns = [
    {
      name: 'Owner Name',
      selector: (row) => row.Owner_Name,
      sortable: true
    },
    {
      // width: '140px',
      name: 'Address',
      selector: (row) => row.Address,
      sortable: true
    },
    {
      // width: '150px',
      name: 'Phone Number',
      selector: (row) => row.Contact,
      sortable: true
    },
    {
      name: 'Reason Code',
      selector: (row) => <>{row?.NameReasonCode_Description ? row?.NameReasonCode_Description?.substring(0, 50) : ''}{row?.NameReasonCode_Description?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", ownerData, isLocked, true) ?
                <span onClick={() => { setDeleteStatus(true); setPropertyOwnerID(row.PropertyOwnerID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </span>
                :
                <></>
              :

              !isLockOrRestrictModule("Lock", ownerData, isLocked, true) &&
              <span onClick={() => { setDeleteStatus(true); setPropertyOwnerID(row.PropertyOwnerID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>


          }

        </div>
    }
  ]


  const columns1 = [
    {
      name: 'Owner Name',
      selector: (row) => row.Arrestee_Name,
      sortable: true
    },
    {
      name: 'Date Of Birth',
      selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : '',
      sortable: true
    },
    {
      name: 'Gender',
      selector: (row) => row.Gendre_Description,
      sortable: true
    },
  ]

  const DeletePin = () => {
    const val = { 'PropertyOwnerID': propertyOwnerID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('PropertyOwner/Delete_PropertyOwner', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_Property_Count(DecPropID, DecMPropID, MstPage === "MST-Property-Dash" ? true : false);
        get_Data_Owner(DecPropID, DecMPropID);
        if (MstPage === "MST-Property-Dash") {
          get_Master_Owner_Drp(DecPropID, DecMPropID);
        } else {
          get_OwnerID_Drp(DecIncID);
        }
        document.getElementById('customSelectBox').style.display = 'none';
        setDeleteStatus(false);
        onClear();
      } else console.log("Somthing Wrong");
    })
  }

  const notebookEntryHandler = row => {
    !addUpdatePermission && setChangesStatus(true)
    setPossessionID(row.NameID);
    setValue(pre => { return { ...pre, ['OwnerID']: row.NameID, ['PropertyOwnerID']: row?.PropertyOwnerID, ['labal']: row.Arrestee_Name } });
    document.getElementById('customSelectBox').style.display = 'none'
  }

  const GetSingleDataPassion = (nameID, masterNameID) => {
    const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
    fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
      if (res) {
        setPossenSinglData(res);
      } else { setPossenSinglData([]); }
    })
  }

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setNameModalStatus(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);


  return (
    <>
      <PropListng {...{ ListData }} />
      <div className="col-12">
        <div className="row">
          <div className="col-3 col-md-2 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>Owner{errors.OwnerIDError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</p>
            ) : null}
            </label>
          </div>
          <div ref={dropdownRef} className="col-6 col-md-6 col-lg-4 mt-2 text-field" >
            <input
              type="text"
              name='NoofHoles'
              id='NoofHoles'
              value={value.labal}
              readOnly={value.OwnerID ? true : false}
              required
              placeholder='Search By Owner .....'
              autoComplete='off'
              onChange={(e) => {
                let typedValue = e.target.value
                setValue({ ...value, labal: e.target.value })
                const result = ownerIdDrp?.filter((item) => {
                  return (item.Arrestee_Name.toLowerCase().includes(e.target.value.toLowerCase()))
                })
                setFilterData(result)
                if (!typedValue) {
                  if (DecIncID && !MstPage) {
                    get_OwnerID_Drp(DecIncID);
                  } else if (MstPage === "MST-Property-Dash") {
                    if (possessionID || DecPropID || DecMPropID) { get_Master_Owner_Drp(possessionID, DecMPropID, DecPropID,); }
                  }
                }
              }}
              onClick={() => { document.getElementById('customSelectBox').style.display = 'block' }}
            />
            <span className='offense-select' onClick={() => {
              document.getElementById('customSelectBox').style.display = 'none';
              setValue(prevState => ({
                ...prevState,
                OwnerID: '',
                PropertyOwnerID: '',
                labal: '' // Assuming 'labal' is intended to be 'label'
              }));

              if (DecIncID && !MstPage) {
                get_OwnerID_Drp(DecIncID);

              } else if (MstPage === "MST-Property-Dash") {
                if (possessionID || DecPropID || DecMPropID) { get_Master_Owner_Drp(possessionID, DecMPropID, DecPropID,); }

              }

            }}>
              {value.labal ? (
                <span className='select-cancel'>
                  <i onClick={() => { setPossessionID('') }} className='fa fa-times'></i>
                </span>
              ) : (null)}
            </span>
          </div>
          {
            (MstPage === "MST-Property-Dash" || DecPropID) &&
            <div className="pt-2" data-toggle="modal" data-target="#MasterModal"  >
              <button
                onClick={() => {
                  if (possessionID) { GetSingleDataPassion(possessionID); } setNameModalStatus(true);
                }}
                className=" btn btn-sm bg-green text-white py-1"
              >
                <i className="fa fa-plus" >
                </i>
              </button>
            </div>
          }
          {!isViewEventDetails &&
            <div className="col-1 col-md-4 col-lg-1 mt-2 mb-1">
              {
                effectiveScreenPermission ?
                  effectiveScreenPermission[0]?.AddOK ?
                    <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
                    :
                    <>
                    </>
                  :
                  <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
              }
            </div>
          }
          <div className="row col-12">
            <div className="col-1 col-md-1 col-lg-1" >

            </div>
            <div id='customSelectBox' className="col-11 col-md-11 col-lg-11 px-2 modal-table" style={{ display: 'none', width: '700px' }}>

              <DataTable
                dense
                fixedHeader
                fixedHeaderScrollHeight="150px"
                customStyles={tableCustomStyles}
                columns={columns1}
                data={filterData}
                onRowClicked={notebookEntryHandler}
                selectableRowsHighlight
                highlightOnHover
                className='new-table'
              />
            </div>

          </div>
        </div>
      </div>
      <div className="col-12" >
        <div className="new-offensetable modal-table" style={{ zIndex: '0' }}>
          {
            <DataTable
              columns={columns}
              data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? ownerData : [] : ownerData}
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              dense
              className='new-offensetable'
              selectableRowsHighlight
              highlightOnHover
              fixedHeader
              persistTableHead={true}
              customStyles={tableCustomStyles}
              pagination
              fixedHeaderScrollHeight='200px'
              paginationPerPage={'100'}
              paginationRowsPerPageOptions={[100, 150, 200, 500]}
            />
          }
        </div>
      </div>
      {
        deleteStatus ?
          <DeletePopUpModal func={DeletePin} />
          : ''
      }
      <ChangesModal func={check_Validation_Error} setToReset={onClear} />
      <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possenSinglData, setPossessionID, possessionID, setPossenSinglData, GetSingleDataPassion }} />
    </>
  )
}

export default Owner