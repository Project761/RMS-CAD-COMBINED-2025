import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api';
import { customStylesWithOutColor, Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, isLockOrRestrictModule, LockFildscolour, tableCustomStyles } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { SSN_Field, } from '../../../PersonnelCom/Validation/PersonnelValidation';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/api';
import NameListing from '../../../ShowAllList/NameListing';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';
import { NameValidationCharacter } from '../../../Agency/AgencyValidation/validators';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Aliases = (props) => {

  const { ListData, DecNameID, DecMasterNameID, isViewEventDetails = false, isLocked } = props
  const { get_Name_Count, setChangesStatus, GetDataTimeZone, datezone } = useContext(AgencyContext);

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const [clickedRow, setClickedRow] = useState(null);
  const [aliasesData, setAliasesData] = useState();
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0);
  const [nameAliasesID, setNameAliasesID] = useState('');
  //screen permission 
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [editval, setEditval] = useState([]);
  const [suffixIdDrp, setSuffixIdDrp] = useState([])
  const [dob, setDob] = useState();
  const [openPage, setOpenPage] = useState('');
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [addUpdatePermission, setaddUpdatePermission] = useState();


  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  let MstPage = query?.get('page');

  const [value, setValue] = useState({
    'LastName': '', 'FirstName': '', 'MiddleName': '', 'SuffixID': null, 'AliasSSN': '', 'DOB': '', 'ModifiedDtTm': "",
    'NameID': '',
    'MasterNameID': '',
    'CreatedByUserFK': '',
    "ModifiedByUserFK": "",
    'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
  })

  const [errors, setErrors] = useState({
    'LastNameErrors': '', 'FirstNameError': '', 'MiddleNameError': '', 'AliasSSNError': ''
  })

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("N049", localStoreData?.AgencyID, localStoreData?.PINID));
      GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (DecNameID || DecMasterNameID) {
      setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': DecNameID } });
      get_Aliases_Data(DecNameID, DecMasterNameID);
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

  const GetSingleData = (nameAliasesID) => {
    fetchPostData('NameAliases/GetSingleData_NameAliases', { 'NameAliasesID': nameAliasesID })
      .then((res) => {
        console.log("🚀 ~ GetSingleData ~ res:", res)
        if (res) setEditval(res)
        else setEditval([])
      }
      )
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        'NameAliasesID': nameAliasesID,
        'DOB': editval[0]?.DOB ? getShowingDateText(editval[0]?.DOB) : ' ', "LastName": editval[0]?.LastName,
        'FirstName': editval[0]?.FirstName, 'MiddleName': editval[0]?.MiddleName, 'SuffixID': editval[0]?.SuffixID,
        'AliasSSN': editval[0]?.AliasSSN,
        'ModifiedByUserFK': loginPinID,
      });
      setDob(editval[0]?.DOB ? new Date(editval[0]?.DOB) : '');
    }
    else {
      setValue({
        ...value,
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'DOB': '', 'SuffixID': null, 'AliasSSN': '', 'ModifiedByUserFK': '',
      })
    }
  }, [editval])


  const resetEditVal = () => {
    if (status && editval) {
      setValue({
        ...value,
        'NameAliasesID': nameAliasesID,
        'DOB': editval[0]?.DOB ? getShowingDateText(editval[0]?.DOB) : ' ', "LastName": editval[0]?.LastName ? editval[0]?.LastName?.trim() : editval[0]?.LastName,
        'FirstName': editval[0]?.FirstName, 'MiddleName': editval[0]?.MiddleName, 'SuffixID': editval[0]?.SuffixID,
        'AliasSSN': editval[0]?.AliasSSN,
        'ModifiedByUserFK': loginPinID,
      });
      setDob(editval[0]?.DOB ? new Date(editval[0]?.DOB) : '');
    }
  }

  const reset = () => {
    setValue({
      ...value,
      'LastName': '', 'FirstName': '', 'MiddleName': '', 'DOB': '', 'SuffixID': '', 'AliasSSN': '',
    });
    setDob("");
    setStatesChangeStatus(false);
    setErrors({
      ...errors,
      'LastNameErrors': '', 'FirstNameError': '', 'MiddleNameError': '', 'AliasSSNError': ''
    });
    setEditval([])
  }

  const check_Validation_Error = (e) => {
    const { LastName, FirstName, MiddleName, NameTypeID, NameReasonCodeID, SSN, DLStateID, DLNumber, Contact, HeightFrom, HeightTo, WeightFrom, WeightTo, AgeFrom, AgeTo, SexID, RaceID, DateOfBirth, IsUnknown } = value;
    const LastNameErr = NameValidationCharacter(LastName, 'LastName', FirstName, MiddleName, LastName);
    const FirstNameErr = NameValidationCharacter(FirstName, 'FirstName', FirstName, MiddleName, LastName);
    const MiddleNameErr = NameValidationCharacter(MiddleName, 'MiddleName', FirstName, MiddleName, LastName);
    const AliasSSNError = value.AliasSSN ? SSN_Field(value.AliasSSN) : 'true'


    setErrors(prevValues => {
      return {
        ...prevValues,
        ['LastNameErrors']: LastNameErr || prevValues['LastNameErrors'],
        ['FirstNameError']: FirstNameErr || prevValues['FirstNameError'],
        ['MiddleNameError']: MiddleNameErr || prevValues['MiddleNameError'],
        ['AliasSSNError']: AliasSSNError || prevValues['AliasSSNError'],

      }
    })
  }

  const { LastNameErrors, FirstNameError, MiddleNameError, AliasSSNError } = errors

  useEffect(() => {
    if (LastNameErrors === 'true' && FirstNameError === 'true' && MiddleNameError === 'true' && AliasSSNError === 'true') {
      if (nameAliasesID && status) { update_Activity() }
      else { Add_Type() }
    }
  }, [LastNameErrors, nameAliasesID, FirstNameError, MiddleNameError, AliasSSNError])

  useEffect(() => {
    if (openPage || loginAgencyID) {
      GetSuffixIDDrp(loginAgencyID);
    }
  }, [openPage, loginAgencyID])

  const GetSuffixIDDrp = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
      if (data) {
        setSuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
      } else {
        setSuffixIdDrp([]);
      }
    })
  }

  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const Add_Type = () => {
    AddDeleteUpadate('NameAliases/Insert_NameAliases', value).then((res) => {
      setChangesStatus(false);
      get_Aliases_Data(DecNameID, DecMasterNameID);
      get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
      const parseData = JSON.parse(res.data);
      toastifySuccess(parseData?.Table[0].Message);

      setStatesChangeStatus(false);
      reset();
    })
  }

  const update_Activity = () => {
    AddDeleteUpadate('NameAliases/Update_NameAliases', value).then((res) => {

      setChangesStatus(false);
      const parseData = JSON.parse(res.data);
      toastifySuccess(parseData?.Table[0].Message);
      get_Aliases_Data(DecNameID, DecMasterNameID);

      setStatesChangeStatus(false);

      reset();
      setStatus(false);
    })
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value })
      !addUpdatePermission && setChangesStatus(true)
    } else { setValue({ ...value, [name]: null }) }
    !addUpdatePermission && setChangesStatus(true)
  }

  useEffect(() => {
    if (!status) {
    } else {
      setDob('');
      setValue({
        ...value,
        ['DOB']: '',
      });
    }
  }, [])

  const handleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e.target.name === "IsVerify") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
      });
      !addUpdatePermission && setChangesStatus(true)
    }
    else if (e.target.name === 'AliasSSN') {
      !addUpdatePermission && setChangesStatus(true)
      let ele = e.target.value.replace(/\D/g, '');
      if (ele.length === 9) {
        const cleaned = ('' + ele).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
        if (match) {
          setValue({
            ...value,
            [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
          })
        }
      } else {
        ele = e.target.value.split('-').join('').replace(/\D/g, '');
        setValue({
          ...value,
          [e.target.name]: ele
        })
        !addUpdatePermission && setChangesStatus(true)
      }
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
      !addUpdatePermission && setChangesStatus(true)
    }
  };

  const get_Aliases_Data = (DecNameID, DecMasterNameID) => {
    const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
    const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
    fetchPostData('NameAliases/GetData_NameAliases', MstPage ? val2 : val).then((res) => {
      if (res) {
        setAliasesData(res)
      } else {
        setAliasesData([]);
      }
    })
  }

  const columns = [
    {
      name: 'Last Name',
      selector: (row) => row.LastName,
      sortable: true
    },
    {
      name: 'First Name',
      selector: (row) => row.FirstName,
      sortable: true
    },
    {
      name: 'Middle Name',
      selector: (row) => row.MiddleName,
      sortable: true
    },
    {
      name: 'Suffix',
      selector: (row) => row.Suffix_Des,
      sortable: true
    },
    {
      name: 'DOB',
      selector: (row) => row.DOB ? getShowingWithOutTime(row.DOB) : '',
      sortable: true
    },
    {
      name: 'Alias SSN',
      selector: (row) => row.AliasSSN,
      sortable: true
    },

    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10, zIndex: '1' }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.DeleteOK ?
                <span onClick={() => { setNameAliasesID(row.NameAliasesID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </span>
                : <></>
              : <span onClick={() => { setNameAliasesID(row.NameAliasesID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }


        </div>

    }
  ]

  const set_Edit_Value = (row) => {
    reset();
    GetSingleData(row.NameAliasesID)
    setNameAliasesID(row.NameAliasesID);
    setStatus(true);
  }

  const DeleteNameAliases = () => {
    const val = { 'NameAliasesID': nameAliasesID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('NameAliases/Delete_NameAliases', val).then((res) => {
      if (res) {
        const parseData = JSON.parse(res.data);
        toastifySuccess(parseData?.Table[0].Message);
        get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
        get_Aliases_Data(DecNameID, DecMasterNameID);
        setStatus(false);
        reset()
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {

    setStatesChangeStatus(false);
    setStatus(false); reset();
    setUpdateStatus(updateStatus + 1);
    setClickedRow(null);
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

  console.log("isLocked", isLocked);
  console.log("editval", editval);

  return (
    <>
      <NameListing  {...{ ListData }} />
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-2 col-md-2 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>Last Name{errors.LastNameErrors !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameErrors}</p>
            ) : null}</label>
          </div>
          <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
            <input
              type="text"
              className={isLockOrRestrictModule("Lock", editval[0]?.LastName, isLocked) ? 'LockFildsColor' : 'requiredColor'}
              disabled={isLockOrRestrictModule("Lock", editval[0]?.LastName, isLocked)}
              maxLength={100}
              name='LastName'
              value={value?.LastName}
              onChange={handleChange}
              required
              autoComplete='off'
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>First Name{errors.FirstNameError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</p>
            ) : null}</label>
          </div>
          <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
            <input
              type="text"
              className={isLockOrRestrictModule("Lock", editval[0]?.FirstName, isLocked) ? 'LockFildsColor' : 'requiredColor'}
              disabled={isLockOrRestrictModule("Lock", editval[0]?.FirstName, isLocked)}
              name='FirstName'
              maxLength={50}
              value={value?.FirstName}
              onChange={handleChange}
              required
              autoComplete='off'
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>Middle Name{errors.MiddleNameError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MiddleNameError}</p>
            ) : null}</label>
          </div>
          <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
            <input
              type="text"
              className={isLockOrRestrictModule("Lock", editval[0]?.MiddleName, isLocked) ? 'LockFildsColor' : 'requiredColor'}
              disabled={isLockOrRestrictModule("Lock", editval[0]?.MiddleName, isLocked)}
              name='MiddleName'
              maxLength={50}
              value={value?.MiddleName}
              onChange={handleChange}
              required
              autoComplete='off'
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>Alias SSN {errors.AliasSSNError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AliasSSNError}</p>
            ) : null}</label>
          </div>
          <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
            <input
              type="text"
              className={isLockOrRestrictModule("Lock", editval[0]?.AliasSSN, isLocked) ? 'LockFildsColor' : 'requiredColor'}
              disabled={isLockOrRestrictModule("Lock", editval[0]?.AliasSSN, isLocked)}
              name='AliasSSN'
              value={value.AliasSSN}
              maxLength={9}
              onChange={handleChange}
              required
              autoComplete='off'
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-3">
            <span data-toggle="modal" onClick={() => {
              setOpenPage('Suffix')
            }} data-target="#ListModel" className='new-link'>
              Suffix
            </span>
          </div>
          <div className="col-3 col-md-3 col-lg-3  mt-1" >
            <Select
              name='SuffixID'
              className={isLockOrRestrictModule("Lock", editval[0]?.SuffixID, isLocked) ? 'LockFildsColor' : 'requiredColor'}
              disabled={isLockOrRestrictModule("Lock", editval[0]?.SuffixID, isLocked)}
              // styles={customStylesWithOutColor}
              styles={isLockOrRestrictModule("Lock", editval[0]?.SuffixID, isLocked) ? LockFildscolour : customStylesWithOutColor}
              value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
              isClearable
              options={suffixIdDrp}
              onChange={(e) => ChangeDropDown(e, 'SuffixID')}
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
            <label htmlFor="" className='label-name '>DOB</label>
          </div>
          <div className="col-3 col-md-3 col-lg-3 " >
            <DatePicker
              id='DOB'
              name='DOB'
              className={isLockOrRestrictModule("Lock", editval[0]?.DOB, isLocked) ? 'LockFildsColor' : ''}
              disabled={isLockOrRestrictModule("Lock", editval[0]?.DOB, isLocked)}
              ref={startRef}
              onKeyDown={(e) => {
                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                  e.preventDefault();
                } else {
                  onKeyDown(e);
                }
              }}
              onChange={(date) => { setDob(date); !addUpdatePermission && setStatesChangeStatus(true); setValue({ ...value, ['DOB']: date ? getShowingMonthDateYear(date) : null }) }}
              dateFormat="MM/dd/yyyy"
              isClearable={dob ? true : false}
              selected={dob}
              showDisabledMonthNavigation
              autoComplete="nope"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              maxDate={new Date(datezone)}
              placeholderText={dob ? dob : 'Select...'}

            />
          </div>
        </div>
        {!isViewEventDetails &&
          <div className="btn-box text-right  mr-1 mb-2">
            <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>

            {
              nameAliasesID && status ?
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
        <div className="col-12 modal-table">
          <DataTable
            dense
            columns={columns}

            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? aliasesData : [] : aliasesData}
            highlightOnHover

            customStyles={tableCustomStyles}
            onRowClicked={(row) => {
              setClickedRow(row);
              set_Edit_Value(row);
            }}
            pagination
            paginationPerPage={'100'}
            paginationRowsPerPageOptions={[100, 150, 200, 500]}
            fixedHeader
            persistTableHead={true}
            fixedHeaderScrollHeight='230px'
            conditionalRowStyles={conditionalRowStyles}
            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          />

        </div>
      </div >
      <DeletePopUpModal func={DeleteNameAliases} />
      {/* <IdentifyFieldColor /> */}
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal func={check_Validation_Error} setToReset={resetEditVal} />

    </>
  )
}
export default Aliases; 