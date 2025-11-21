import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate, } from '../../../../hooks/Api';
import { Decrypt_Id_Name, isLockOrRestrictModule, LockFildscolour, Requiredcolour, tableCustomStyles, } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { Email_Field, PhoneFieldNotReq } from '../../../Agency/AgencyValidation/validators';
import { threeColArray } from '../../../../Common/ChangeArrayFormat';
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/api';
import NameListing from '../../../ShowAllList/NameListing';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';

const ContactDetails = (props) => {

  const { ListData, DecNameID, DecMasterNameID, isViewEventDetails = false, isLocked } = props
  const { get_Name_Count, setChangesStatus } = useContext(AgencyContext)

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const [clickedRow, setClickedRow] = useState(null);
  const [contactDetailsData, setContactDetailsData] = useState([]);
  const [masterContactData, setMasterContactData] = useState([]);
  const [status, setStatus] = useState(false);
  const [nameContactID, setNameContactID] = useState();
  const [updateStatus, setUpdateStatus] = useState(0)
  //screen permission 
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [contactType, setContactType] = useState([]);
  const [editval, setEditval] = useState([]);
  const [contactTypeCode, setContactTypeCode] = useState('');
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
    'ContactTypeID': null, 'VerifyID': null, 'Phone_Email': '', 'IsInListedPh': "", "IsCurrentPh": "",
    'NameID': '', 'MasterNameID': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
  })

  const [errors, setErrors] = useState({ 'ContactTypeIDErrors': "", 'Phone_EmailErrors': "" })


  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("N052", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);


  useEffect(() => {
    if (DecNameID || DecMasterNameID) {
      setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': DecNameID } });
      Get_ContactDetailsData(DecNameID, DecMasterNameID);
    }
  }, [DecNameID, DecMasterNameID, loginPinID]);

  useEffect(() => {
    if (MstPage === 'mastername') {
      if (nameContactID) { GetMasterSingleData(nameContactID) }
    } else if (nameContactID) {

    }
  }, [nameContactID, updateStatus])

  const GetSingleData = (nameContactID) => {
    const val = { 'NameContactID': nameContactID }
    fetchPostData('NameContactDetails/GetSingleData_NameContactDetails', val)
      .then((res) => {
        if (res) { setEditval(res); } else { setEditval([]) }
      })
  }

  const GetMasterSingleData = (nameContactID) => {
    const val = { 'NameContactID': nameContactID }
    fetchPostData('MainMasterNameContactDetails/GetSingleData_MainMasterNameContactDetails', val).then((res) => {
      if (res) {
        setEditval(res);
      }
      else { setEditval([]) }
    })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        'NameContactID': nameContactID,
        'ContactTypeID': editval[0]?.ContactTypeID,
        'VerifyID': editval[0]?.VerifyID,
        'Phone_Email': editval[0]?.Phone_Email,
        'ModifiedByUserFK': loginPinID,
        'IsInListedPh': editval[0]?.IsInListedPh,
        "IsCurrentPh": editval[0]?.IsCurrentPh,
      })
      setContactTypeCode(Get_Property_Code(editval, contactType))
    } else {
      setValue({
        ...value,
        'ContactTypeID': null,
        'VerifyID': null,
        'Phone_Email': '',
        'IsInListedPh': '',
        "IsCurrentPh": false,
      })
      setContactTypeCode('')
    }
  }, [editval])

  const reset = () => {
    setValue({
      ...value,
      'ContactTypeID': '', 'VerifyID': '', 'Phone_Email': '', 'IsInListedPh': "", "IsCurrentPh": '',
    });
    setErrors({
      ...errors,
      'Phone_EmailErrors': '', 'ContactTypeIDErrors': '', 'CommentsError': '',
    });
    setNameContactID('');
    setStatesChangeStatus(false);
    setStatus('');
    setContactTypeCode('');
    setEditval([])
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.ContactTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ContactTypeIDErrors']: RequiredFieldIncident(value.ContactTypeID) } })
    }
    if (value.ContactTypeID) {
      if (contactTypeCode === "E") {
        if (Email_Field(value.Phone_Email)) {
          setErrors(prevValues => { return { ...prevValues, ['Phone_EmailErrors']: Email_Field(value.Phone_Email) } })
        }
      } else if (PhoneFieldNotReq(value.Phone_Email)) {
        setErrors(prevValues => { return { ...prevValues, ['Phone_EmailErrors']: PhoneFieldNotReq(value.Phone_Email) } })
      }
    }

  }

  const { ContactTypeIDErrors, Phone_EmailErrors, } = errors

  useEffect(() => {
    if (ContactTypeIDErrors === 'true' && Phone_EmailErrors === 'true') {
      if (MstPage === 'mastername') {
        if (status) Master_Update_Activity()
        else master_Add_Type()
      } else {
        if (status) {
          update_Activity()
          return;
        }
        Add_Type()
      }
    }
  }, [ContactTypeIDErrors, Phone_EmailErrors])

  useEffect(() => {
    if (openPage || loginAgencyID) {
      get_ContactType(loginAgencyID, '1', '1');
    }
  }, [openPage, loginAgencyID])

  const get_ContactType = (loginAgencyID, IsEMail, IsPhone) => {
    const val = {
      AgencyID: loginAgencyID,
      IsEMail: IsEMail,
      IsPhone: IsPhone,
    }
    fetchPostData('ContactPhoneType/GetDataDropDown_ContactPhoneType', val).then((data) => {
      if (data) {
        setContactType(threeColArray(data, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
      } else {
        setContactType([]);
      }
    })
  }

  const handleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e.target.name === 'IsInListedPh' || e.target.name === 'IsCurrentPh') {
      setValue({
        ...value,
        [e.target.name]: e.target.checked
      })
      !addUpdatePermission && setChangesStatus(true)
    } else if (e.target.name === 'Phone_Email') {
      if (contactTypeCode !== "E") {
        let ele = e.target.value.replace(/\D/g, '');
        if (ele.length === 10) {
          const cleaned = ('' + ele).replace(/\D/g, '');
          const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
          if (match) {
            setValue({
              ...value,
              [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
            })
            !addUpdatePermission && setChangesStatus(true)
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
          [e.target.name]: e.target.value
        })
        !addUpdatePermission && setChangesStatus(true)
      }
    }
  }

  const Add_Type = (e) => {
    const result = contactDetailsData?.find(item => {
      if (item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID) {
        return item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID
      } else {
        return item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID
      }
    });
    if (result) {
      toastifyError('Phone/Email Already Exists')
      setErrors({ ...errors, ['ContactTypeIDErrors']: '' })
    } else {


      setStatesChangeStatus(false);
      AddDeleteUpadate('NameContactDetails/Insert_NameContactDetails', value)
        .then((res) => {
          if (res.Message === " ") {
            setChangesStatus(false);
            get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
            Get_ContactDetailsData(DecNameID);
            reset();
            setContactTypeCode('')
          } else {
            get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
            Get_ContactDetailsData(DecNameID);
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message);
            setChangesStatus(false);
            reset();
          }
        })
    }
  }

  const master_Add_Type = (e) => {
    const result = masterContactData?.find(item => {
      if (item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID) {
        return item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID
      } else {
        return item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID
      }
    });
    if (result) {
      toastifyError('Phone/Email Already Exists')
      setErrors({ ...errors, ['ContactTypeIDErrors']: '' })
    } else {
      setStatesChangeStatus(false);
      AddDeleteUpadate('MainMasterNameContactDetails/Insert_MainMasterNameContactDetails', value)
        .then((res) => {
          if (res.Message === " ") {
            Get_Master_ContactData(DecMasterNameID);
            reset();
            setContactTypeCode('')
          } else {
            Get_Master_ContactData(DecMasterNameID);
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message);
            reset();
          }
        })
    }
  }

  const Master_Update_Activity = () => {
    const result = masterContactData?.find(item => {
      if (item.NameContactID != value['NameContactID']) {
        if (item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID) {
          return item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID
        } else {
          return item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID
        }
      }
    });
    if (result) {
      toastifyError('Phone/Email Already Exists')
      setErrors({ ...errors, ['ContactTypeIDErrors']: '' })
    } else {
      setStatesChangeStatus(false);
      AddDeleteUpadate('MainMasterNameContactDetails/Update_MainMasterNameContactDetails', value).then((res) => {
        setChangesStatus(false);
        const parseData = JSON.parse(res.data);
        toastifySuccess(parseData?.Table[0].Message);
        Get_Master_ContactData(DecMasterNameID);
        reset();
        setContactTypeCode('')
        setErrors({ ...errors, ['Phone_EmailErrors']: '', });
      })
    }
  }

  const update_Activity = () => {
    const result = contactDetailsData?.find(item => {
      if (item.NameContactID != value['NameContactID']) {
        if (item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID) {
          return item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID
        } else {
          return item.Phone_Email === value.Phone_Email && item?.ContactTypeID === value?.ContactTypeID
        }
      }
    });
    if (result) {
      toastifyError('Phone/Email Already Exists')
      setErrors({ ...errors, ['ContactTypeIDErrors']: '' })
    } else {
      setStatesChangeStatus(false);
      AddDeleteUpadate('NameContactDetails/Update_NameContactDetails', value).then((res) => {
        setChangesStatus(false);
        const parseData = JSON.parse(res.data);
        toastifySuccess(parseData?.Table[0].Message);
        Get_ContactDetailsData(DecNameID);
        setContactTypeCode('')
        reset();
        setStatus(false);
        setErrors({ ...errors, ['Phone_EmailErrors']: '', });
      })
    }
  }

  const ChangeDropDown = (e, name) => {
    setStatesChangeStatus(true);
    if (e) {
      if (name === 'ContactTypeID') {
        setContactTypeCode(e.id)
        setValue({
          ...value,
          ['ContactTypeID']: e.value, ['Phone_Email']: '', 'IsCurrentPh': null, 'IsInListedPh': null,
        })
        setErrors({ ...errors, ['Phone_EmailErrors']: '', });
        !addUpdatePermission && setChangesStatus(true)
      } else {
        setValue({ ...value, [name]: e.value })
        !addUpdatePermission && setChangesStatus(true)
      }
    } else {
      setValue({ ...value, [name]: null, ['Phone_Email']: '' }); setContactTypeCode('')
      !addUpdatePermission && setChangesStatus(true);
      setErrors({ ...errors, ['Phone_EmailErrors']: '', });
    }
  }


  const Get_ContactDetailsData = (DecNameID) => {
    const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
    const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
    fetchPostData('NameContactDetails/GetData_NameContactDetails', MstPage ? val2 : val).then((res) => {
      if (res) {
        setContactDetailsData(res)
      } else {
        setContactDetailsData([]);
      }
    })
  }

  const Get_Master_ContactData = (DecMasterNameID) => {
    const val = { 'MasterNameID': DecMasterNameID, }
    fetchPostData('MainMasterNameContactDetails/GetData_MainMasterNameContactDetails', val).then((res) => {
      if (res) {
        setMasterContactData(res)
      } else {
        setMasterContactData([]);
      }
    })
  }

  const columns = [
    {
      name: 'Phone/Email',
      selector: (row) => row.Phone_Email,
      sortable: true
    },

    {
      name: 'Contact Type',
      selector: (row) => row.ContactType_Description,
      sortable: true
    },
    {
      name: 'Current Phone',
      selector: (row) => <input type="checkbox" name="" id="" checked={row.IsCurrentPh} />,
      sortable: true
    },
    {
      name: 'Unlisted Phone',
      selector: (row) => <input type="checkbox" name="" id="" checked={row.IsInListedPh} />,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>

          {
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.DeleteOK ?
                <span onClick={() => { setNameContactID(row.NameContactID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </span>
                : <></>
              : <span onClick={() => { setNameContactID(row.NameContactID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }

        </div>

    }
  ]

  const set_Edit_Value = (row) => {
    reset(); setStatus(true);
    setUpdateStatus(updateStatus + 1);
    setNameContactID(row.NameContactID);
    GetSingleData(row.NameContactID);

  }

  const DeleteContactDetail = () => {
    const val = { 'NameContactID': nameContactID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate(MstPage === 'mastername' ? 'MainMasterNameContactDetails/Delete_MainMasterNameContactDetails' : 'NameContactDetails/Delete_NameContactDetails', val).then((res) => {
      if (res) {
        const parseData = JSON.parse(res.data);
        toastifySuccess(parseData?.Table[0].Message);
        get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);

        reset();
        Get_ContactDetailsData(DecNameID, DecMasterNameID)
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setStatesChangeStatus(false);
    setStatus(false); reset(); setUpdateStatus(updateStatus + 1); setClickedRow(null);
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


  return (
    <>
      <NameListing  {...{ ListData }} />
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-2 col-md-2 col-lg-2 mt-3 px-0">
            <span data-toggle="modal" onClick={() => {
              setOpenPage('Contact Phone Type')
            }} data-target="#ListModel" className='new-link'>
              Contact Type {errors.ContactTypeIDErrors !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactTypeIDErrors}</p>
              ) : null}
            </span>
          </div>
          <div className="col-3 col-md-4 col-lg-3  mt-2" >
            <Select
              name='ContactTypeID'
              value={contactType?.filter((obj) => obj.value === value?.ContactTypeID)}
              isClearable
              options={contactType}
              onChange={(e) => ChangeDropDown(e, 'ContactTypeID')}
              placeholder="Select..."
              // styles={Requiredcolour}
              styles={isLockOrRestrictModule("Lock", editval[0]?.ContactTypeID, isLocked) ? LockFildscolour : Requiredcolour}
              isDisabled={isLockOrRestrictModule("Lock", editval[0]?.ContactTypeID, isLocked)}
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <label htmlFor="" className='label-name '>Phone/Email
            </label>
          </div>
          <div className="col-3 col-md-3 col-lg-3 text-field mt-2" >
            {
              contactTypeCode === "E" ?
                <input
                  type="text"
                  className={isLockOrRestrictModule("Lock", editval[0]?.Phone_Email, isLocked) ? 'LockFildsColor' : `${value?.ContactTypeID ? 'requiredColor' : 'readonlyColor'}`}
                  disabled={isLockOrRestrictModule("Lock", editval[0]?.Phone_Email, isLocked) || !value?.ContactTypeID}
                  name='Phone_Email'
                  value={value.Phone_Email}
                  onChange={handleChange}
                  required
                  autoComplete='off'
                />
                :
                <input
                  type="text"
                  className={isLockOrRestrictModule("Lock", editval[0]?.Phone_Email, isLocked) ? 'LockFildsColor' : `${value?.ContactTypeID ? 'requiredColor' : 'readonlyColor'}`}
                  disabled={isLockOrRestrictModule("Lock", editval[0]?.Phone_Email, isLocked) || !value?.ContactTypeID}
                  maxLength={10}
                  name='Phone_Email'
                  value={value.Phone_Email}
                  onChange={handleChange}
                  required
                  autoComplete='off'
                />
            }
            {errors.Phone_EmailErrors !== 'true' ? (
              <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px', }}>{errors.Phone_EmailErrors}</span>
            ) : null}
          </div>
        </div>
        <div className="col-12">
          {
            contactTypeCode === "E" ?
              <>
              </>
              :
              <div className="col-12">
                <div className="row">
                  <div className="col-2"></div>
                  <div className="col-10 col-md-10 col-lg-10 mt-2 " >
                    <div className="form-check "  >
                      <input className="form-check-input" type="checkbox" id="IsCurrentPh" onChange={handleChange} name='IsCurrentPh' value={value.IsCurrentPh} checked={value.IsCurrentPh} />
                      <label className="form-check-label" htmlFor="IsCurrentPh">  Current Phone
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2"></div>
                  <div className="col-10 col-md-10 col-lg-10 mt-2" >
                    <div className="form-check " >
                      <input className="form-check-input" type="checkbox" name="IsInListedPh" checked={value.IsInListedPh} value={value.IsInListedPh}
                        onChange={handleChange}
                        id="IsInListedPh" />
                      <label className="form-check-label" htmlFor="IsInListedPh">Unlisted Phone</label>
                    </div>
                  </div>
                </div>
              </div>
          }
        </div>
        {!isViewEventDetails &&
          <div className="btn-box text-right mr-1 mb-2">
            <button type="button" data-dismiss="modal" onClick={() => {
              setStatusFalse();
            }} className="btn btn-sm btn-success mr-1" >New</button>


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
      </div >
      <div className="col-12 mt-3 modal-table">
        <DataTable
          dense
          columns={columns}

          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? contactDetailsData : [] : contactDetailsData}
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
      <DeletePopUpModal func={DeleteContactDetail} />
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal func={check_Validation_Error} setToReset={setStatusFalse} />
    </>
  )
}

export default ContactDetails;

const Get_Property_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) => (sponsor.ContactTypeID))
  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id }
    }
  })
  const val = result2.filter(function (element) {
    return element !== undefined;
  });
  return val[0]?.id
}