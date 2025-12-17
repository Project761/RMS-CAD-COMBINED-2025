import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, DecryptedList, base64ToString, isLockOrRestrictModule, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { check_OffenceCode_NoneUnknown, TableErrorTooltip } from '../../../Property/PropertyNibrsError';
import VehicleListing from '../../../ShowAllList/VehicleListing';

const Offense = (props) => {

  const { ListData, DecVehId, DecMVehId, IncID, isLocked, setIsLocked } = props

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const selectBoxRef = useRef(null);
  const inputRef = useRef(null);
  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  let MstPage = query?.get('page');

  const { get_vehicle_Count, setChangesStatus } = useContext(AgencyContext);
  const SelectedValue = useRef();

  const [ownerData, setOwnerData] = useState();
  const [propertyOffenseID, setPropertyOffenseID] = useState();
  const [deleteStatus, setDeleteStatus] = useState(false)
  const [mainIncidentID, setMainIncidentID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [ownerIdDrp, setOwnerIdDrp] = useState([]);
  const [filterData, setFilterData] = useState();
  const [nibrsCodeArr, setNibrsCodeArr] = useState([]);
  const [propLossCode, setPropLossCode] = useState('');

  const [value, setValue] = useState({
    'MasterPropertyID': '', 'PropertyID': '', 'labal': '', 'IncidentID': '', 'OffenseID': null,
    'CreatedByUserFK': '', 'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
  })

  const [errors, setErrors] = useState({
    'OwnerIDError': '',
  });

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      // old code - P063  
      dispatch(get_ScreenPermissions_Data("V137", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  useEffect(() => {
    if (DecVehId || DecMVehId) {
      get_Data_Owner(DecVehId, DecMVehId, IncID);
      setValue({
        ...value,
        'IncidentID': IncID, 'PropertyID': DecVehId, 'CreatedByUserFK': loginPinID, 'MasterPropertyID': DecMVehId, 'labal': '', 'OffenseID': null,
      })
    }
  }, [DecVehId, DecMVehId]);

  useEffect(() => {
    if (IncID) { get_OwnerID_Drp(IncID); setMainIncidentID(IncID); }
  }, [IncID])

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.OffenseID)) {
      setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OffenseID) } })
    }
  }

  const { OwnerIDError } = errors

  useEffect(() => {
    if (OwnerIDError === 'true') {
      Add_Owner()
    }
  }, [OwnerIDError])

  const get_Data_Owner = (propertyID, DecMVehId, mainIncidentID) => {
    const val = { 'PropertyID': propertyID, 'MasterPropertyID': DecMVehId ? DecMVehId : 0, 'IncidentID': mainIncidentID, 'OffenseID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    fetchPostData('PropertyOffense/GetData_PropertyOffense', val).then((res) => {
      if (res) {
        setOwnerData(res);
        const nibrsCodeArr = res?.filter((item) => {
          if (item?.NIBRSCode != '23A' && item?.NIBRSCode != '23B' && item?.NIBRSCode != '23C' && item?.NIBRSCode != '23D' && item?.NIBRSCode != '23E' && item?.NIBRSCode != '23F' && item?.NIBRSCode != '23G' && item?.NIBRSCode != '23H') { return item }
        });
        setNibrsCodeArr(nibrsCodeArr);
        setPropLossCode(res[0]?.PropertyReasonsCode);
      } else {
        setOwnerData([]);
        setNibrsCodeArr([]);
        setPropLossCode('');
      }
      get_OwnerID_Drp(mainIncidentID, res);
    });
  }

  const get_OwnerID_Drp = (mainIncidentID, ownerData) => {
    const val = { 'IncidentID': mainIncidentID, 'OffenseID': 0, }
    fetchPostData('PropertyOffense/GetDataDropDown_PropertyOffense', val).then((data) => {
      if (data) {
        setFilterData(shortArr(ownerData, data));
        setOwnerIdDrp(shortArr(ownerData, data));
      } else {
        setOwnerIdDrp([]);
      }
    })
  }

  const shortArr = (ownerData, data) => {
    const ids = []
    ownerData?.forEach(({ OffenseID }) => ids.push(OffenseID))
    const shortArr = data?.filter(obj1 => !ownerData?.some(obj2 => obj1.CrimeID === obj2.OffenseID));
    return shortArr
  }

  const Add_Owner = () => {
    const result = ownerData?.find(item => {
      if (item.OffenseID === value.OffenseID) {
        return item.OffenseID === value.OffenseID
      } else return item.OffenseID === value.OffenseID
    });
    if (result) {
      toastifyError('Offence Already Exists');
      setErrors({
        ...errors,
        ['OwnerIDError']: '',
      })
    } else if (value.OffenseID !== '') {
      const { IncidentID, PropertyID, CreatedByUserFK, MasterPropertyID, labal, OffenseID, IsMaster } = value
      const val = {
        'IncidentID': IncID, 'PropertyID': DecVehId, 'CreatedByUserFK': loginPinID, 'IsMaster': IsMaster,
        'MasterPropertyID': DecMVehId, 'labal': labal, 'OffenseID': OffenseID,
      }
      AddDeleteUpadate('PropertyOffense/Insert_PropertyOffense', val).then((res) => {

        setChangesStatus(false);
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_vehicle_Count(DecVehId, DecMVehId, MstPage === "MST-Property-Dash" ? true : false);
        get_Data_Owner(DecVehId, DecMVehId, IncID);
        get_OwnerID_Drp(IncID);
        onClear();
        setErrors({ ...errors, ['OwnerIDError']: '', })
      })
    }
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
    setValue(pre => { return { ...pre, ['OffenseID']: '', ['propertyOffenseID']: '', ['labal']: '' } });
    setErrors({});

  };

  const columns = [
    {
      name: 'Offense Name',
      selector: (row) => row.Offense_Description,
      sortable: true
    },
    {
      name: 'Attempted/Completed',
      selector: (row) => row.AttemptComplete,
      sortable: true
    },
    {
      name: 'TIBRS Code',
      selector: (row) => row.NIBRSCode ? row.NIBRSCode : '',
      sortable: true,
      width: "120px",
      cell: (row) => (
        check_OffenceCode_NoneUnknown(row.NIBRSCode, row?.PropertyReasonsCode, row.AttemptComplete, row?.PropDescCode, nibrsCodeArr) ? <TableErrorTooltip value={row.NIBRSCode} ErrorStr={check_OffenceCode_NoneUnknown(row.NIBRSCode, row?.PropertyReasonsCode, row.AttemptComplete, row?.PropDescCode, nibrsCodeArr)} /> : row.NIBRSCode
      ),
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", ownerData, isLocked, true) ?
                <span onClick={() => { setDeleteStatus(true); setPropertyOffenseID(row.PropertyOffenseID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </span>
                : <></>
              :
              !isLockOrRestrictModule("Lock", ownerData, isLocked, true) &&
              <span onClick={() => { setDeleteStatus(true); setPropertyOffenseID(row.PropertyOffenseID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>
    }
  ]

  const DeletePin = () => {
    const val = { 'propertyOffenseID': propertyOffenseID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('PropertyOffense/Delete_PropertyOffense', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        get_vehicle_Count(DecVehId, DecMVehId, MstPage === "MST-Property-Dash" ? true : false); setDeleteStatus(false);
        get_OwnerID_Drp(IncID); get_Data_Owner(DecVehId, DecMVehId, IncID);
        onClear();
      } else { console.log("Somthing Wrong"); }
    })
  }

  const columns1 = [
    {
      name: 'Offense Name',
      selector: (row) => row.Offense_Description,
      sortable: true
    },
    {
      name: 'Attempted/Completed',
      selector: (row) => row.AttemptComplete,
      sortable: true
    },
  ]

  const notebookEntryHandler = row => {
    setChangesStatus(true)
    setValue(pre => {
      return {
        ...pre,
        ['OffenseID']: row.CrimeID, ['PropertyOffenseID']: row?.propertyOffenseID, ['labal']: row.Offense_Description
      }
    });
    document.getElementById('customSelectBox').style.display = 'none'
  }


  const conditionalRowStyles = [
    {
      when: () => true,
      style: (row) => getStatusColors(row.NIBRSCode, row?.PropertyReasonsCode, row.AttemptComplete, row?.PropDescCode, nibrsCodeArr),
    },
  ];

  const getStatusColors = (Code, propLossCode, AttmComp, categoryCode, nibrsCodeArr) => {
    return check_OffenceCode_NoneUnknown(Code, propLossCode, AttmComp, categoryCode, nibrsCodeArr) ? { backgroundColor: "rgb(255 202 194)" } : {};
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectBoxRef.current &&
        !selectBoxRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        document.getElementById('customSelectBox').style.display = 'none';
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      <VehicleListing {...{ ListData }} />
      <div className="col-12">
        <div className="row">
          <div className="col-3 col-md-2 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>Offense  {errors.OwnerIDError !== 'true' ? (
              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</span>
            ) : null}
            </label>
          </div>
          <div className="col-6 col-md-6 col-lg-4 mt-2 text-field"  >
            <input
              ref={inputRef} // 👈 Input ref
              type="text"
              name='NoofHoles'
              id='NoofHoles'
              readOnly={value.OffenseID ? true : false}
              value={value.labal}
              required
              placeholder='Search By Offense .....'
              autoComplete='off'
              onChange={(e) => {
                let typedValue = e.target.value
                setValue({ ...value, labal: e.target.value })
                const result = ownerIdDrp?.filter((item) => {
                  return (item.Offense_Description.toLowerCase().includes(e.target.value.toLowerCase()))
                })
                setFilterData(result);
                if (!typedValue) {
                  document.getElementById('customSelectBox').style.display = 'none';
                  setValue(pre => { return { ...pre, ['OffenseID']: '', ['propertyOffenseID']: '', ['labal']: '' } });
                  get_OwnerID_Drp(mainIncidentID, ownerData);
                }
              }}
              onClick={() => {
                document.getElementById('customSelectBox').style.display = 'block'
              }}
            />
            <span className='offense-select' onClick={() => {
              document.getElementById('customSelectBox').style.display = 'none';
              setValue(pre => { return { ...pre, ['OffenseID']: '', ['propertyOffenseID']: '', ['labal']: '' } });
              get_OwnerID_Drp(mainIncidentID, ownerData);
            }}>
              {value.labal ? (
                <span className='select-cancel'>
                  <i className='fa fa-times'></i>
                </span>
              ) :
                (
                  null
                )}
            </span>
            <div id='customSelectBox' ref={selectBoxRef} className="col-12 col-md-12 col-lg-12 modal-table" style={{ display: 'none', width: '700px' }}>
              <DataTable
                dense
                fixedHeader
                fixedHeaderScrollHeight="225px"
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
        </div>
      </div >
      <div className="col-12" >
        <div className="new-offensetable modal-table" >
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
              conditionalRowStyles={conditionalRowStyles}
              pagination
              paginationPerPage={'100'}
              paginationRowsPerPageOptions={[100, 150, 200, 500]}
              showPaginationBottom={100}
              fixedHeaderScrollHeight='200px'
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
    </>
  )
}

export default Offense