import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate, fetchData } from '../../../../hooks/Api';
import { customStylesWithOutColor, Decrypt_Id_Name, getShowingWithOutTime, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident, Space_Not_Allow } from '../../../Utility/Personnel/Validation';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Comman_changeArrayFormat_With_Name, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/api';
import NameListing from '../../../ShowAllList/NameListing';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';

const Identification = (props) => {


  const { ListData, DecNameID, DecMasterNameID, isViewEventDetails = false } = props
  const { get_Name_Count, setChangesStatus } = useContext(AgencyContext)

  const dispatch = useDispatch();

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };


  let MstPage = useQuery().get('page');
  const [clickedRow, setClickedRow] = useState(null);

  const [identificationData, setIdentificationData] = useState();
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0);
  const [identificationNumberID, setIdentificationNumberID] = useState('');

  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');

  const [identification, setIdentification] = useState([]);
  const [editval, setEditval] = useState();
  const [identificationDate, setIdentificationDate] = useState();
  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [openPage, setOpenPage] = useState('');
  const [maxIdNumberLength, setMaxIdNumberLength] = useState(15);
  const [isTypeOne, setIsTypeOne] = useState(false);
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const [value, setValue] = useState({
    'IdentificationTypeID': null, 'StateID': null, 'CountryID': null, 'IdentificationNumber': '', 'IsCurrent': "", 'ExpiryDate': "", 'IdentificationNumberID': '',
    'NameID': '', 'MasterNameID': '', 'CreatedByUserFK': '',
    'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
  })

  const [errors, setErrors] = useState({
    'IdentificationTypeIDErrors': '', 'IdentificationNumberErrors': '', 'StateIDErrors': '', 'CountryIDErrors': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("N051", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  useEffect(() => {
    if (DecNameID || DecMasterNameID) {
      setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': DecNameID } });
      Get_IdentificationData(DecNameID, DecMasterNameID);
    }
  }, [DecNameID, DecMasterNameID, loginPinID]);

  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);



  const GetSingleData = (identificationNumberID) => {
    const val = { 'IdentificationNumberID': identificationNumberID }
    fetchPostData('NameIdentificationNumber/GetSingleData_NameIdentificationNumber', val)
      .then((res) => {
        if (res) { setEditval(res) }
        else { setEditval() }
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        'IdentificationNumberID': identificationNumberID, 'IsCurrent': editval[0]?.IsCurrent,
        'ExpiryDate': editval[0]?.ExpiryDate ? getShowingWithOutTime(editval[0]?.ExpiryDate) : '', "IdentificationNumber": editval[0]?.IdentificationNumber,
        'CountryID': editval[0]?.CountryID, 'StateID': editval[0]?.StateID, 'IdentificationTypeID': editval[0]?.IdentificationTypeID, 'ModifiedByUserFK': loginPinID,
      })
      setIdentificationDate(editval[0]?.ExpiryDate ? new Date(editval[0]?.ExpiryDate) : null);
      if (editval[0]?.IdentificationTypeID === 2) {
        if (editval[0]?.StateID || editval[0]?.StateID == '' ? 20001 : null) {
          setIsTypeOne(true)
        }
        else {
          setIsTypeOne(false);
        }
      }
    } else {
      setValue({
        ...value,
        'IdentificationTypeID': null, 'IdentificationNumber': '', 'IsCurrent': "", 'StateID': null, 'CountryID': null, 'ExpiryDate': "", 'ModifiedByUserFK': '',
      })
    }
  }, [editval])

  const reset = () => {
    setValue({
      ...value,
      'IdentificationTypeID': '', 'IdentificationNumber': '', 'IsCurrent': "", 'StateID': "", 'CountryID': "", 'ExpiryDate': "",
    });
    setIdentificationDate(''); setStatesChangeStatus(false);
    setErrors({
      'IdentificationTypeIDErrors': '', 'IdentificationNumberErrors': '',
    })
    setIsTypeOne(false); setStatus(false);
  }

  const check_Validation_Error = () => {
    const IdentificationNumberErr = Space_Not_Allow(value.IdentificationNumber)
    const IdentificationTypeIDErr = RequiredFieldIncident(value.IdentificationTypeID)
    const CountryIDErrors = isTypeOne ? RequiredFieldIncident(value.CountryID) : 'true'
    const StateIDErr = isTypeOne && value?.CountryID ? RequiredFieldIncident(value.StateID) : 'true'
    setErrors(prevValues => {
      return {
        ...prevValues,
        ['IdentificationNumberErrors']: IdentificationNumberErr || prevValues['IdentificationNumberErrors'],
        ['IdentificationTypeIDErrors']: IdentificationTypeIDErr || prevValues['IdentificationTypeIDErrors'],
        ['CountryIDErrors']: CountryIDErrors || prevValues['CountryIDErrors'],
        ['StateIDErrors']: StateIDErr || prevValues['StateIDErrors'],
      }
    })
  }

  // Check All Field Format is True Then Submit 
  const { IdentificationNumberErrors, IdentificationTypeIDErrors, CountryIDErrors, StateIDErrors } = errors

  useEffect(() => {
    if (IdentificationNumberErrors === 'true' && IdentificationTypeIDErrors === 'true' && StateIDErrors === 'true' && CountryIDErrors === 'true') {
      if (status) { update_Identification(); }
      else { Add_Type(); }
    }
  }, [IdentificationNumberErrors, IdentificationTypeIDErrors, StateIDErrors, CountryIDErrors, status]);

  useEffect(() => {
    if (openPage || loginAgencyID) {
      get_Identification(loginAgencyID);
    }
    getCountryID(); getStateList();
  }, [openPage, loginAgencyID])

  const get_Identification = (loginAgencyID) => {
    fetchPostData('IDTypes/GetDataDropDown_IDTypes', { AgencyID: loginAgencyID, }).then((data) => {
      if (data) {
        setIdentification(threeColArray(data, 'IDTypeID', 'Description', 'Code'))
      } else { setIdentification([]); }
    })
  }

  const getStateList = async () => {
    fetchData("State_City_ZipCode/GetData_State").then((data) => {
      if (data) {
        setStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "StateID"));
      } else { setStateList([]); }
    });
  };

  const getCountryID = async () => {
    const val = { 'IsUSCitizen': true, };
    fetchPostData("State_City_ZipCode/GetData_Country", val).then((data) => {
      if (data) {
        setCountryList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "CountryID"));
      } else { setCountryList([]); }
    });
  };

  const handleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true)
    if (e.target.name === 'IsCurrent') {
      setValue({ ...value, [e.target.name]: e.target.checked }); !addUpdatePermission && setChangesStatus(true);
    } else if (e.target.name === 'IdentificationNumber') {
      if (isTypeOne) {
        const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
        if (cleanedValue) {
          !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: cleanedValue });
        }
      } else {
        const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
        setValue({ ...value, [e.target.name]: cleanedValue }); !addUpdatePermission && setChangesStatus(true);
      }
    } else {
      setValue({ ...value, [e.target.name]: e.target.value }); !addUpdatePermission && setChangesStatus(true);
    }
  };

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const Add_Type = () => {
    const result = identificationData?.find(item => {
      if (item.IdentificationNumber === value.IdentificationNumber && item?.IdentificationTypeID === value.IdentificationTypeID) {
        return item.IdentificationNumber === value.IdentificationNumber && item?.IdentificationTypeID === value.IdentificationTypeID
      } else return item.IdentificationNumber === value.IdentificationNumber && item?.IdentificationTypeID === value.IdentificationTypeID
    });
    if (result) {
      toastifyError('Identification Number Already Exists')
      setErrors({ ...errors, ['IdentificationTypeIDErrors']: '' })
    } else {
      AddDeleteUpadate(MstPage === 'mastername' ? 'MainMasterNameIdentificationNumber/Insert_MainMasterNameIdentificationNumber' : 'NameIdentificationNumber/Insert_NameIdentificationNumber', value)
        .then((res) => {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          setChangesStatus(false);
          const parseData = JSON.parse(res.data);
          toastifySuccess(parseData?.Table[0].Message); Get_IdentificationData(DecNameID, DecMasterNameID);
          get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false); setStatesChangeStatus(false);
          reset(); setErrors({ ...errors, 'IdentificationTypeIDErrors': '', })
        })
    }
  }

  const update_Identification = () => {
    const result = identificationData?.find(item => {
      if (item?.IdentificationNumberID != value['IdentificationNumberID']) {
        if (item.IdentificationNumber === value.IdentificationNumber && item?.IdentificationTypeID === value.IdentificationTypeID) {
          return item.IdentificationNumber === value.IdentificationNumber && item?.IdentificationTypeID === value.IdentificationTypeID
        } else return item.IdentificationNumber === value.IdentificationNumber && item?.IdentificationTypeID === value.IdentificationTypeID
      }
    });
    if (result) {
      toastifyError('Identification Number Already Exists')
      setErrors({ ...errors, ['IdentificationTypeIDErrors']: '' })
    } else {
      AddDeleteUpadate('NameIdentificationNumber/Update_NameIdentificationNumber', value).then((res) => {
        const parsedData = JSON.parse(res.data);
        setChangesStatus(false);
        const parseData = JSON.parse(res.data);
        toastifySuccess(parseData?.Table[0].Message);
        Get_IdentificationData(DecNameID, DecMasterNameID); get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
        setStatesChangeStatus(false); reset(); setErrors({ ...errors, 'IdentificationTypeIDErrors': '', })
      })
    }
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
    if (e) {
      if (name == 'IdentificationTypeID') {
        if (e.id === "DLN") {
          setMaxIdNumberLength(15); setIsTypeOne(true); setValue({ ...value, [name]: e.value });
          setErrors({ ...errors, 'CountryIDErrors': '', 'StateIDErrors': '', })
        } else {
          setMaxIdNumberLength(15); setIsTypeOne(false); setValue({ ...value, [name]: e.value });
          setErrors({ ...errors, 'CountryIDErrors': '', 'StateIDErrors': '', })
        }
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name == 'IdentificationTypeID') {
        setValue({ ...value, [name]: null, }); setIsTypeOne(false); setErrors({ ...errors, 'CountryIDErrors': '', 'StateIDErrors': '', })
      } else {
        setValue({ ...value, ['CountryID']: '' }); setValue({ ...value, ['StateID']: '' }); setErrors({ ...errors, 'CountryIDErrors': '', 'StateIDErrors': '', })
      }
      setValue({ ...value, [name]: null });
      if (name === 'CountryID') {
        setValue({ ...value, [name]: null, 'StateID': null });
      }
    }
  }




  const Get_IdentificationData = (DecNameID, DecMasterNameID) => {
    const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
    const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
    fetchPostData('NameIdentificationNumber/GetData_NameIdentificationNumber', MstPage ? val2 : val).then((res) => {
      if (res) {
        setIdentificationData(res)
      } else {
        setIdentificationData([]);
      }
    })
  }

  const columns = [
    {
      width: '250px', name: 'Identification Type', selector: (row) => row.IdType_Description, sortable: true
    },
    {
      name: 'Identification Number', selector: (row) => row.IdentificationNumber?.toUpperCase() || row.DLIdentificationNumber.toUpperCase(), sortable: true
    },
    {
      name: 'Expiry Date', selector: (row) => row.ExpiryDate ? getShowingWithOutTime(row.ExpiryDate) : '', sortable: true
    },
    {
      name: 'Country', selector: (row) => row.CountryName, sortable: true
    },
    {
      name: 'State', selector: (row) => row.StateName, sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.DeleteOK ?
                <span onClick={() => { setIdentificationNumberID(row.IdentificationNumberID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </span>
                : <></>
              : <span onClick={() => { setIdentificationNumberID(row.IdentificationNumberID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>
    }
  ]

  const set_Edit_Value = (row) => {
    reset(); setStatus(true); GetSingleData(row.IdentificationNumberID); setUpdateStatus(updateStatus + 1); setIdentificationNumberID(row.IdentificationNumberID);
  }

  const DeleteIdentification = () => {
    const val = {
      'IdentificationNumberID': identificationNumberID, 'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate('NameIdentificationNumber/Delete_NameIdentificationNumber', val).then((res) => {
      if (res) {
        const parseData = JSON.parse(res.data);
        toastifySuccess(parseData?.Table[0].Message);
        Get_IdentificationData(DecNameID, DecMasterNameID); get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
        setStatus(false); reset();
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setClickedRow(null); reset(); setStatus(false)
    setStatesChangeStatus(false); setUpdateStatus(updateStatus + 1);
  }

  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: {
        backgroundColor: '#001f3fbd',
        color: 'white',
        cursor: 'pointer',
      },
    },
  ];

  const NameDateExpired = ListData[0]?.DateOfBirth

  return (
    <>
      <NameListing  {...{ ListData }} />
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-3 col-md-3 col-lg-2 mt-3">
            <span data-toggle="modal" onClick={() => {
              setOpenPage('ID Types')
            }} data-target="#ListModel" className='new-link'>
              Identification Type {errors.IdentificationTypeIDErrors !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IdentificationTypeIDErrors}</p>
              ) : null}
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-3  mt-2" >
            <Select
              name='IdentificationTypeID'
              styles={Requiredcolour}
              value={identification?.filter((obj) => obj.value === value?.IdentificationTypeID)}
              isClearable
              options={identification}
              onChange={(e) => { ChangeDropDown(e, 'IdentificationTypeID'); }}
              placeholder="Select..."
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-3">
            <label htmlFor="" className='label-name '>Identification Number{errors.IdentificationNumberErrors !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IdentificationNumberErrors}</p>
            ) : null}
            </label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 text-field mt-2" >
            <input type="text" style={{ textTransform: "uppercase" }} value={
              value?.IdentificationNumber
            } maxLength={maxIdNumberLength} onChange={handleChange} className='requiredColor' name='IdentificationNumber' required autoComplete='off' />
          </div>
          <div className="col-3 col-md-3 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>ID Expiry</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 " >
            <DatePicker
              ref={startRef}

              onKeyDown={(e) => {
                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                  e.preventDefault();
                } else {
                  onKeyDown(e);
                }
              }}
              id='ExpiryDate'
              name='ExpiryDate'
              dateFormat="MM/dd/yyyy"
              onChange={(date) => { setIdentificationDate(date); !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true); setValue({ ...value, ['ExpiryDate']: date ? getShowingWithOutTime(date) : null }) }}
              showMonthDropdown
              isClearable={value?.ExpiryDate ? true : false}
              autoComplete="off"
              showDisabledMonthNavigation
              dropdownMode="select"

              showYearDropdown
              placeholderText={value?.ExpiryDate ? value?.ExpiryDate : 'Select...'}
              selected={identificationDate}
              minDate={new Date(NameDateExpired)}
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-3">
            <label htmlFor="" className='label-name '>Country{errors.CountryIDErrors !== 'true' && errors.CountryIDErrors ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CountryIDErrors}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-3  mt-2" >
            <Select
              name="CountryID"
              value={countryList?.filter((obj) => obj.value === value?.CountryID)}
              isClearable
              options={countryList}
              onChange={(e) => { ChangeDropDown(e, 'CountryID'); }}
              placeholder="Select..."
              styles={isTypeOne ? Requiredcolour : customStylesWithOutColor}
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-3">
            <label htmlFor="" className='label-name '>State{errors.StateIDErrors !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StateIDErrors}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4  mt-2" >
            <Select
              name="StateID"
              value={value?.CountryID ? (value.StateID ? stateList.find(obj => obj.value === value.StateID) : null) : null}
              isClearable
              options={stateList}
              onChange={(e) => { ChangeDropDown(e, 'StateID'); }}
              placeholder="Select..."

              styles={isTypeOne && value?.CountryID ? Requiredcolour : customStylesWithOutColor}
              isDisabled={value?.CountryID ? false : true}
            />
          </div>
        </div>
        {!isViewEventDetails &&
          <div className="btn-box text-right mt-3 mr-1 mb-2">
            <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); conditionalRowStyles(''); setUpdateStatus(updateStatus + 1); }}>New</button>
            {
              status ?
                effectiveScreenPermission ?
                  effectiveScreenPermission[0]?.Changeok ?
                    <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                    :
                    <>
                    </>
                  :
                  <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                :
                effectiveScreenPermission ?
                  effectiveScreenPermission[0]?.AddOK ?
                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                    :
                    <>
                    </>
                  :
                  <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
            }
          </div>
        }
        <div className='modal-table'>
          <DataTable
            dense
            columns={columns}

            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? identificationData : [] : identificationData}
            pagination
            highlightOnHover

            customStyles={tableCustomStyles}
            onRowClicked={(row) => {
              setClickedRow(row);
              set_Edit_Value(row);
            }}
            fixedHeader
            persistTableHead={true}
            fixedHeaderScrollHeight='200px'
            paginationPerPage={'100'}
            paginationRowsPerPageOptions={[100, 150, 200, 500]}
            conditionalRowStyles={conditionalRowStyles}
            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          />
        </div>
      </div>
      <DeletePopUpModal func={DeleteIdentification} />
      {/* <IdentifyFieldColor /> */}
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal func={check_Validation_Error} setToReset={setStatusFalse} />
    </>
  )
}

export default Identification; 