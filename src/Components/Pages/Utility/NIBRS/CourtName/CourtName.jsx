
import { useState, useEffect, useCallback } from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchData, fetchPostData, fetch_Post_Data } from '../../../../hooks/Api';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { Filter } from '../../../../Filter/Filter';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useSelector, useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { RequiredField } from '../../Personnel/Validation';
import { PhoneField } from '../../../PersonnelCom/Validation/PersonnelValidation';
import Select from 'react-select'
import makeAnimated from "react-select/animated";
import SelectBox from '../../../../Common/SelectBox';


const CourtName = () => {
  const animatedComponents = makeAnimated()
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [courtNameData, setCourtNameData] = useState();
  const [status, setStatus] = useState(false);
  const [pageStatus, setPageStatus] = useState("1");
  const [modal, setModal] = useState(false)
  // FilterData 
  const [filterCourtNameCode, setFilterCourtNameCode] = useState('Contains');
  const [filterCourtName, setFilterCourtName] = useState('Contains');
  const [courtNameFilterData, setCourtNameFilterData] = useState();
  const [courtNameStatus, setCourtNameStatus] = useState(0);
  //filter SearchVal
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [cityList, setCityList] = useState([]);
  const [zipList, setZipList] = useState([]);

  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  const [isSuperadmin, setIsSuperadmin] = useState(0);
  const [clickedRow, setClickedRow] = useState(null);

  const [isActive, setIsActive] = useState('')
  const [CourtID, setCourtID] = useState('')
  const [confirmType, setConfirmType] = useState('')
  const [agencyData, setAgencyData] = useState([])
  const [courtNameEditVal, setCourtNameEditVal] = useState();
  const [stateList, setStateList] = useState([])

  const [value, setValue] = useState({
    'CourtNameCode': '', 'Description': '', 'AgencyCode': '', 'AgencyID': '', 'IsEditable': 1, 'CourtID': '', 'IsActive': '1', 'CreatedByUserFK': '',
    'ModifiedByUserFK': '', 'MultiAgency_Name': '', 'AgencyName': '', 'IsNjeTicket': '', 'IsSpinalResearch': '', 'IsJointCourt': '', 'IsCitation': '', 'IsDefault': '',
    'Hours': '', 'Administrator': '', 'Judge': '', 'Municipality': '', 'Phone2': '', 'CountryCode': '', 'PhoneNumber': '', 'Address': '', 'ZipId': '', 'CityId': '',
    'StateId': '', 'ZipName': '', 'StateName': '', 'CityName': '',
  });

  const [errors, setErrors] = useState({
    'CourtNameCodeError': '', 'DescriptionError': '', 'PhoneNumberError': '', 'Phone2Error': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); setIsSuperadmin(localStoreData?.IsSuperadmin);
      setIsSuperadmin(localStoreData?.IsSuperadmin); setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID });
      get_data_CourtName(localStoreData?.AgencyID, localStoreData?.PINID,); if (localStoreData?.AgencyID) { get_data_CourtName(localStoreData?.AgencyID, localStoreData?.PINID,); }
    }
  }, [localStoreData, pageStatus]);

  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })

  useEffect(() => {
    getAgency(loginAgencyID, loginPinID);
    if (agencyData?.length === 0 && modal) {
      if (loginPinID && loginAgencyID) { setValue({ ...value, 'CreatedByUserFK': loginPinID, }) }
    }
  }, [modal, loginAgencyID])

  useEffect(() => {
    if (CourtID) {
      GetSingledataCourtName()
    }
    getStateList()
  }, [CourtID, courtNameStatus])

  const GetSingledataCourtName = () => {
    const val = { 'CourtID': CourtID }
    fetchPostData('CourtName/GetSingleData_CourtName', val)
      .then((res) => {
        if (res) {
          setCourtNameEditVal(res)
        }
        else setCourtNameEditVal()
      })
  }

  const get_data_CourtName = (loginAgencyID, loginPinID, IsSuperadmin) => {
    const val = {
      IsActive: pageStatus, AgencyID: loginAgencyID, PINID: loginPinID, IsSuperadmin: IsSuperadmin,
    }
    fetch_Post_Data('CourtName/GetData_CourtName', val)
      .then((res) => {
        if (res) {
          setCourtNameData(res?.Data); setCourtNameFilterData(res?.Data); setEffectiveScreenPermission(res?.Permision)
        }
        else { setCourtNameData(); setCourtNameFilterData(); setEffectiveScreenPermission() }
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        "CourtNameCode": courtNameEditVal[0]?.CourtNameCode, 'AgencyID': courtNameEditVal[0]?.AgencyID, 'StateId': courtNameEditVal[0]?.StateId, 'CityId': courtNameEditVal[0]?.CityId,
        'ZipId': courtNameEditVal[0]?.ZipId, 'AgencyCode': courtNameEditVal[0]?.AgencyCode, "Description": courtNameEditVal[0]?.Description, 'CourtID': courtNameEditVal[0]?.CourtID,
        'IsActive': courtNameEditVal[0]?.IsActive, 'MultiAgency_Name': courtNameEditVal[0]?.MultiAgency_Name, 'IsNjeTicket': courtNameEditVal[0]?.IsNjeTicket,
        'IsSpinalResearch': courtNameEditVal[0]?.IsSpinalResearch, 'IsJointCourt': courtNameEditVal[0]?.IsJointCourt, 'IsCitation': courtNameEditVal[0]?.IsCitation,
        'IsEditable': courtNameEditVal[0]?.IsEditable === '0' ? false : true, 'IsDefault': courtNameEditVal[0]?.IsDefault,
        'Address': courtNameEditVal[0]?.Address, 'PhoneNumber': courtNameEditVal[0]?.PhoneNumber, 'CountryCode': courtNameEditVal[0]?.CountryCode, 'Phone2': courtNameEditVal[0]?.Phone2,
        'Municipality': courtNameEditVal[0]?.Municipality, 'Judge': courtNameEditVal[0]?.Judge, 'Administrator': courtNameEditVal[0]?.Administrator, 'Hours': courtNameEditVal[0]?.Hours,
        'AgencyName': courtNameEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(courtNameEditVal[0]?.MultipleAgency) : '',
        'ModifiedByUserFK': loginPinID, 'ZipName': changeArrayFormat_WithFilter(courtNameEditVal, 'zip', zipList), 'StateName': changeArrayFormat_WithFilter(courtNameEditVal, 'state', stateList), 'CityName': changeArrayFormat_WithFilter(courtNameEditVal, 'city', cityList),
      }); setMultiSelected({ optionSelected: courtNameEditVal[0]?.MultipleAgency ? changeArrayFormat_WithFilter(courtNameEditVal[0]?.MultipleAgency) : '', });
    }
    else {
      // reset()
      setValue({
        ...value,
        "CourtNameCode": '', 'ZipName': '', 'CityName': '', 'StateName': '', "Description": '', 'AgencyID': '', 'IsEditable': 0, 'ModifiedByUserFK': '', 'MultiAgency_Name': '',
        'IsJointCourt': '', 'IsDefault': '', 'IsCitation': '', 'IsSpinalResearch': '', 'IsNjeTicket': '', 'PropRectype': '', 'AgencyCode': '', 'Hours': '', 'Administrator': '',
        'Judge': '', 'Municipality': '', 'Phone2': '', 'CountryCode': '', 'PhoneNumber': '', 'Address': '', 'ZipId': '', 'CityId': '', 'StateId': '',
      }); setMultiSelected({ optionSelected: null })
    }
  }, [courtNameEditVal])


  const check_Validation_Error = (e) => {
    e.preventDefault()
    if (RequiredField(value.CourtNameCode)) {
      setErrors(prevValues => { return { ...prevValues, ['CourtNameCodeError']: RequiredField(value.CourtNameCode) } })
    }
    if (RequiredField(value.Description)) {
      setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
    }
    if (PhoneField(value.PhoneNumber)) {
      setErrors(prevValues => { return { ...prevValues, ['PhoneNumberError']: PhoneField(value.PhoneNumber) } })
    }
    if (PhoneField(value.Phone2)) {
      setErrors(prevValues => { return { ...prevValues, ['Phone2Error']: PhoneField(value.Phone2) } })
    }
  }
  // Check All Field Format is True Then Submit 
  const { DescriptionError, CourtNameCodeError, Phone2Error, PhoneNumberError } = errors

  useEffect(() => {
    if (DescriptionError === 'true' && CourtNameCodeError === 'true' && Phone2Error === 'true' && PhoneNumberError === 'true') {
      if (status) Update_CourtName()
      else Add_CourtName()
    }
  }, [DescriptionError, CourtNameCodeError, Phone2Error, PhoneNumberError])


  const UpdActiveDeactive = () => {
    const value = {
      'IsActive': isActive, 'CourtID': CourtID, 'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate('CourtName/DeleteCourtName', value)
      .then(res => {

        if (res.success) {
          toastifySuccess(res.Message); get_data_CourtName(loginAgencyID, loginPinID, isSuperadmin);
          setModal(false); setStatusFalse(); setSearchValue1(''); setSearchValue2('');
        } else {
          toastifyError(res.data.Message)
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  const getCity = async (stateID) => {
    const val = { StateID: stateID }
    fetchPostData("State_City_ZipCode/GetData_City", val).then((data) => {
      if (data) {
        setCityList(changeArrayFormat(data, 'city'))
      } else {
        setCityList([]);
      }
    })
  }

  const getZipCode = async (cityID) => {
    const val = { CityId: cityID }
    fetchPostData("State_City_ZipCode/GetData_ZipCode", val).then((data) => {
      if (data) {
        setZipList(changeArrayFormat(data, 'zip'))
      } else {
        setZipList([]);
      }
    })
  }

  const reset = () => {
    setValue({
      ...value,
      'CourtNameCode': '', 'ZipName': '', 'CityName': '', 'StateName': '', 'PropRectype': '', 'IsEditable': 0, 'Description': '', 'AgencyID': '', 'CourtID': '',
      'ModifiedByUserFK': '', 'AgencyName': '', 'MultiAgency_Name': '', 'IsDefault': '', 'IsCitation': '', 'IsSpinalResearch': '', 'IsNjeTicket': '', 'IsJointCourt': '',
      'AgencyCode': '', 'Hours': '', 'Administrator': '', 'Judge': '', 'Municipality': '', 'Phone2': '', 'CountryCode': '', 'PhoneNumber': '', 'Address': '', 'ZipId': '',
      'CityId': '', 'StateId': '',
    });
    setMultiSelected({ optionSelected: null })
    setErrors({
      ...errors, 'CourtNameCodeError': '', 'DescriptionError': '', 'Phone2Error': '',
    })
  }

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      reset()
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  function stateChanges(e) {
    if (e) {
      setValue({ ...value, ['StateId']: e.value });
      getCity(e.value)
    } else {
      setValue({
        ...value, ['StateId']: null, ['ZipName']: '',
      })
      setCityList()
      setZipList()
    }
  }

  function cityChanges(e) {
    if (e) {
      setValue({
        ...value, ['CityId']: e.value, ['ZipName']: '',
      });
      getZipCode(e.value)
    } else {
      setValue({
        ...value, ['CityId']: null, ['ZipName']: '', ['Agency_ZipId']: ''
      });
      setZipList()
    }
  }

  function zipChanges(e) {
    if (e) {
      setValue({
        ...value, ['ZipId']: e.value, ['ZipName']: { value: e.value, label: e.label }
      });
    } else {
      setValue({
        ...value, ['ZipId']: null
      });
    }

  }

  const getStateList = async () => {
    fetchData("State_City_ZipCode/GetData_State").then((data) => {
      if (data) {
        setStateList(changeArrayFormat(data, 'state'))
      } else {
        setStateList();
      }
    })
  }


  const getAgency = async (loginAgencyID, loginPinID) => {
    const value = { AgencyID: loginAgencyID, PINID: loginPinID, }
    fetchPostData("Agency/GetData_Agency", value).then((data) => {
      if (data) {
        setAgencyData(changeArrayFormat(data))
      } else {
        setAgencyData();
      }
    })
  }

  const handlChanges = (e) => {
    if (e.target.name === 'IsEditable' || e.target.name === 'IsNjeTicket' || e.target.name === 'IsSpinalResearch' || e.target.name === 'IsJointCourt' || e.target.name === 'IsCitation' || e.target.name === 'IsDefault') {
      setValue({
        ...value, [e.target.name]: e.target.checked,
      });
    }
    else {
      setValue({
        ...value, [e.target.name]: e.target.value,
      });
    }
  }

  const Agencychange = (multiSelected) => {
    setMultiSelected({
      optionSelected: multiSelected
    });
    const id = []
    const name = []
    if (multiSelected) {
      multiSelected.map((item, i) => {
        id.push(item.value);
        name.push(item.label)
      })
      setValue({
        ...value,
        ['AgencyID']: id.toString(), ['MultiAgency_Name']: name.toString()
      })
    }
  }


  const Add_CourtName = (e) => {
    const result = courtNameData?.find(item => {
      if (item.CourtNameCode === value.CourtNameCode) {
        return item.CourtNameCode === value.CourtNameCode
      } else return item.CourtNameCode === value.CourtNameCode
    });
    const result1 = courtNameData?.find(item => {
      if (item.Description === value.Description) {
        return item.Description === value.Description
      } else return item.Description === value.Description
    }
    );
    if (result || result1) {
      if (result) {
        toastifyError('Code Already Exists')
        setErrors({ ...errors, ['CourtNameCodeError']: '' })
      }
      if (result1) {
        toastifyError('Description Already Exists')
        setErrors({ ...errors, ['DescriptionError']: '' })
      }
    } else {
      AddDeleteUpadate('CourtName/InsertCourtName', value).then((res) => {

        toastifySuccess(res.Message); setErrors({ ...errors, ['CourtNameCodeError']: '' })
        setModal(false); get_data_CourtName(loginAgencyID, loginPinID, isSuperadmin); reset();
      })
    }
  }

  const Update_CourtName = () => {
    const result = courtNameData?.find(item => {
      if (item.CourtID != CourtID) {
        if (item.CourtNameCode === value.CourtNameCode) {
          return item.CourtNameCode === value.CourtNameCode
        } else return item.CourtNameCode === value.CourtNameCode
      }
    });
    const result1 = courtNameData?.find(item => {
      if (item.CourtID != value.CourtID) {
        if (item.Description === value.Description) {
          return item.Description === value.Description
        } else return item.Description === value.Description
      }
    }
    );
    if (result || result1) {
      if (result) {
        toastifyError('Code Already Exists')
        setErrors({ ...errors, ['CourtNameCodeError']: '' })
      }
      if (result1) {
        toastifyError('Description Already Exists')
        setErrors({ ...errors, ['DescriptionError']: '' })
      }
    } else {
      AddDeleteUpadate('CourtName/UpdateCourtName', value).then((res) => {
        toastifySuccess(res.Message);
        setErrors({ ...errors, ['CourtNameCodeError']: '' })
        get_data_CourtName(loginAgencyID, loginPinID, isSuperadmin);
        setModal(false); setStatus(true);
        reset(); setStatusFalse()
      })
    }
  }


  // Table Columns Array
  const columns = [
    {
      name: 'Code',
      selector: (row) => row.CourtNameCode,
      sortable: true
    },
    {
      name: 'Description',
      selector: (row) => row.Description,
      sortable: true
    },
    {
      name: 'Agency',
      selector: (row) => <>{row?.MultiAgency_Name ? row?.MultiAgency_Name.substring(0, 40) : ''}{row?.MultiAgency_Name?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: 'IsEditable',
      selector: (row) => <> <input type="checkbox" checked={checkEdittable(row.IsEditable)} disabled /></>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 40 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              pageStatus === "1" ?
                < Link to="/ListManagement?page=Court Name" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setCourtID(row.CourtID); setIsActive('0'); setConfirmType("InActive") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                </Link>
                :
                <Link to="/ListManagement?page=Court Name" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setCourtID(row.CourtID); setIsActive('1'); setConfirmType("Active") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                </Link>
              : <></>
              : <></>
          }

        </div>

    }
  ]

  const checkEdittable = (val) => { const check = { "1": true, "0": false }; return check[val] }

  const setEditValue = (row) => {
    getCity(row?.StateId); getZipCode(row?.CityId)
    setCourtNameStatus(courtNameStatus + 1); 
    setModal(true); setStatus(true); setCourtID(row?.CourtID); reset();
  }

  const setStatusFalse = (e) => {
    setClickedRow(null); setStatus(false); setCourtID(); setModal(true); reset();
  }


  const handleInput = (e) => {
    if (e.target.name === 'PhoneNumber' || e.target.name === 'Phone2') {
      let ele = e.target.value.replace(/\D/g, '');
      if (ele.length === 10) {
        const cleaned = ('' + ele).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
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
      }
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value
      })
    }
  };
  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 32,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };
  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: {
        backgroundColor: '#001f3fbd',
        color: 'white',
        cursor: 'pointer',
      },
    }
  ];
  return (

    <>
      <div className="row" style={{ marginTop: '-25px', marginLeft: '-18px' }}>
        <div className="col-12 col-md-12 col-lg-12 ">
          <div className="row mt-2">
            <div className="col-12 px-1 ">
              <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                <p className="p-0 m-0">Court Name</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-12 col-lg-12 incident-tab mt-1">
          <ul className="nav nav-tabs mb-1 " id="myTab" role="tablist">
            <span className={`nav-item ${pageStatus === '1' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus("1"); setStatusFalse(); setSearchValue1(''); setSearchValue2(''); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === '1' ? 'Red' : '' }}>Active</span>
            <span className={`nav-item ${pageStatus === '0' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus("0"); setStatusFalse(); setSearchValue1(''); setSearchValue2(''); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === '0' ? 'Red' : '' }}>InActive</span>
          </ul>
        </div>

        <div className="col-12 mt-2 ">
          {
            pageStatus === '1' ?
              <>
                <div className="row ">
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Code{errors.CourtNameCodeError !== 'true' ? (
                      <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtNameCodeError}</p>
                    ) : null}</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" name='CourtNameCode' maxLength={10} onChange={handlChanges} value={value?.CourtNameCode}
                      disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false}
                      className='requiredColor' />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Agency Code</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" name='AgencyCode' maxLength={10} onChange={handlChanges} value={value.AgencyCode} />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Description {errors.DescriptionError !== 'true' ? (
                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                    ) : null}</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-5 mt-1 text-field">
                    <textarea className='requiredColor' name='Description'
                      disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false}
                      onChange={handlChanges} value={value?.Description} required cols="30" rows="1"></textarea>
                  </div>

                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Municipality</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" name='Municipality' onChange={handlChanges} value={value.Municipality} />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Judge</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" name='Judge' onChange={handlChanges} value={value.Judge} />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Administrator</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" name='Administrator' onChange={handlChanges} value={value.Administrator} />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Hours</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="number" name='Hours' onChange={handlChanges} value={value.Hours} />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                    <label htmlFor="" className='new-label px-0'>Country Code</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" name='CountryCode' onChange={handlChanges} value={value.CountryCode} />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>State</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                    {
                      value?.StateName ?
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name='Agency_StateId' menuPlacement="top"
                          options={stateList}
                          defaultValue={value.StateName}
                          isClearable
                          onChange={stateChanges}
                          styles={customStylesWithOutColor}
                        /> :
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name='Agency_StateId' menuPlacement="top"
                          options={stateList}
                          isClearable
                          onChange={stateChanges}
                          styles={customStylesWithOutColor}

                        />
                    }
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>City</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                    {
                      value.CityName ?
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name='Agency_CityId' menuPlacement="top"
                          options={cityList}
                          defaultValue={value.CityName}
                          isClearable
                          styles={customStylesWithOutColor}
                          onChange={cityChanges}
                        />
                        :
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name='Agency_CityId' menuPlacement="top"
                          options={cityList}
                          isClearable
                          styles={customStylesWithOutColor}
                          onChange={cityChanges}
                        />

                    }
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Zip</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                    {
                      value.ZipName ?
                        <Select
                          styles={customStylesWithOutColor}
                          className="basic-single"
                          classNamePrefix="select"
                          name='Agency_ZipId' menuPlacement="top"
                          options={value?.Agency_CityId ? zipList : ''}
                          defaultValue={value.ZipName}
                          isClearable
                          onChange={zipChanges}
                        />
                        :
                        <Select
                          className="basic-single"
                          classNamePrefix="select"
                          name='Agency_ZipId' menuPlacement="top"
                          options={zipList}
                          styles={customStylesWithOutColor}
                          isClearable
                          onChange={zipChanges}
                        />
                    }
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Phone No {errors.PhoneNumberError !== 'true' ? (
                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PhoneNumberError}</span>
                    ) : null}</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" maxLength={10} name="PhoneNumber" value={value.PhoneNumber} onChange={handleInput}
                      required />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Phone 2   {errors.Phone2Error !== 'true' ? (
                      <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Phone2Error}</span>
                    ) : null}</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                    <input type="text" maxLength={10} name="Phone2" value={value.Phone2} onChange={handleInput}
                      required />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Address</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-5 mt-1 text-field">
                    <input type="text" name='Address' onChange={handlChanges} value={value.Address} />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 mt-2">
                    <label htmlFor="" className='new-label'>Agency</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-5 mt-1 ">
                    {
                      value?.AgencyName ?
                        <SelectBox
                          options={agencyData}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          onChange={Agencychange}
                          allowSelectAll={true}
                          value={multiSelected.optionSelected}
                        /> : <SelectBox
                          options={agencyData}
                          isMulti
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          onChange={Agencychange}
                          allowSelectAll={true}
                          value={multiSelected.optionSelected}
                        />

                    }
                  </div>


                  <div className="col-2 mt-1">
                    <input type="checkbox" name="IsDefault" checked={value.IsDefault} value={value.IsDefault}
                      onChange={handlChanges}
                      id="IsDefault" />
                    <label className='ml-2' htmlFor="IsDefault">Is Default</label>
                  </div>
                  <div className="col-2 mt-1">
                    <input type="checkbox" name="IsCitation" checked={value.IsCitation} value={value.IsCitation}
                      onChange={handlChanges}
                      id="IsCitation" />
                    <label className='ml-2' htmlFor="IsCitation">Is Citation</label>
                  </div>
                  <div className="col-2 mt-1">
                    <input type="checkbox" name="IsJointCourt" checked={value.IsJointCourt} value={value.IsJointCourt}
                      onChange={handlChanges}
                      id="IsJointCourt" />
                    <label className='ml-2' htmlFor="IsJointCourt">Is Joint Court</label>
                  </div>
                  <div className="col-3 mt-1 pl-5 ml-5">
                    <input type="checkbox" name="IsSpinalResearch" checked={value.IsSpinalResearch} value={value.IsSpinalResearch}
                      onChange={handlChanges}
                      id="IsSpinalResearch" />
                    <label className='ml-2' htmlFor="IsSpinalResearch">Is Spinal Research</label>
                  </div>
                  <div className="col-3 mt-1">
                    <input type="checkbox" name="IsNjeTicket" checked={value.IsNjeTicket} value={value.IsNjeTicket}
                      onChange={handlChanges}
                      id="IsNjeTicket" />
                    <label className='ml-2' htmlFor="IsNjeTicket">Is Nje Ticket</label>
                  </div>
                  <div className="col-3 mt-1">
                    <input type="checkbox" name="IsEditable" checked={value.IsEditable} value={value.IsEditable}
                      onChange={handlChanges}
                      id="IsEditable" />
                    <label className='ml-2' htmlFor="IsEditable">Is Editable</label>
                  </div>
                </div>
                <div className="text-right">
                  <div className="btn-box mb-1  mr-1 bb" style={{ position: 'fixed', bottom: 0, zIndex: '999', right: '15px' }}>
                    <button type="button" className="btn btn-sm btn-success mb-1 mr-2 text-right " data-dismiss="modal" onClick={() => { setStatusFalse(); }}
                    >New</button>
                 
                    {
                      status ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.ChangeOK ?
                          <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Update</button>
                          : <></> :
                          <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                          <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Save</button>
                          : <> </> :
                          <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Save</button>
                    }
                  </div>
                </div>
              </>
              : <></>
          }

          <div className="row mt-1 ">
            <div className="col-5">
              <input type="text" value={searchValue1} onChange={(e) => {
                setSearchValue1(e.target.value);
                const result = Filter(courtNameData, e.target.value, searchValue2, filterCourtNameCode, 'CourtNameCode', 'Description')
                setCourtNameFilterData(result)
              }}
                className='form-control' placeholder='Search By Code...' />
            </div>
            <div className='col-1 '>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterCourtNameCode('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterCourtNameCode('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterCourtNameCode('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterCourtNameCode('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterCourtNameCode('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-5">
              <input type="text" value={searchValue2} onChange={(e) => {
                setSearchValue2(e.target.value)
                const result = Filter(courtNameData, searchValue1, e.target.value, filterCourtName, 'CourtNameCode', 'Description')
                setCourtNameFilterData(result)
              }}
                className='form-control' placeholder='Search By Description...' />
            </div>
            <div className='col-1'>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterCourtName('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterCourtName('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterCourtName('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterCourtName('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterCourtName('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className=" col-12 table-responsive mt-2">

          <DataTable
            columns={columns}
            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? courtNameFilterData : '' : courtNameFilterData}
            dense
            paginationPerPage={'10'}
            paginationRowsPerPageOptions={[5, 10, 15]}
            highlightOnHover
            noContextMenu
            pagination
            responsive
            subHeaderAlign="right"
            subHeaderWrap
            fixedHeader
            conditionalRowStyles={conditionalRowStyles}
            onRowClicked={(row) => {
              setEditValue(row); setClickedRow(row);
            }}
            persistTableHead={true}
            customStyles={tableCustomStyles}
            fixedHeaderScrollHeight='140px'
            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          />
        </div>

      </div >
      < ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
    </>
  )
}

export default CourtName

export const changeArrayFormat = (data, type) => {
  if (type === 'zip') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.zipId, label: sponsor.Zipcode })
    )
    return result
  }
  if (type === 'state') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.StateID, label: sponsor.StateName })
    )
    return result
  }
  if (type === 'city') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.CityID, label: sponsor.CityName })
    );
    return result
  } else {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result
  }

}

export const changeArrayFormat_WithFilter = (data, type, DropDownValue) => {

  if (type === 'state') {
    const result = data?.map((sponsor) =>
      (sponsor.StateId)
    )
    const result2 = DropDownValue?.map((sponsor) => {
      if (sponsor.value === result[0]) {
        return { value: result[0], label: sponsor.label }
      }
    }
    )
    const val = result2.filter(function (element) {
      return element !== undefined;
    });
    return val[0]
  }
  if (type === 'city') {
    const result = data?.map((sponsor) =>
      (sponsor.CityId)
    )
    const result2 = DropDownValue?.map((sponsor) => {
      if (sponsor.value === result[0]) {
        return { value: result[0], label: sponsor.label }
      }
    }
    )
    const val = result2.filter(function (element) {
      return element !== undefined;
    });
    return val[0]
  }
  if (type === 'zip') {
    const result = data?.map((sponsor) =>
      (sponsor.ZipId)
    )
    const result2 = DropDownValue?.map((sponsor) => {
      if (sponsor.value === result[0]) {
        return { value: result[0], label: sponsor.label }
      }
    }
    )
    const val = result2.filter(function (element) {
      return element !== undefined;
    });
    return val[0]
  }
  else {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
    )
    return result
  }
}
// export const changeArrayFormat = (data, type) => {
//   if (type === 'zip') {
//     const result = data?.map((sponsor) =>
//       ({ value: sponsor.zipId, label: sponsor.Zipcode })
//     )
//     return result
//   }
//   if (type === 'state') {
//     const result = data?.map((sponsor) =>
//       ({ value: sponsor.StateID, label: sponsor.StateName })
//     )
//     return result
//   }
//   if (type === 'city') {
//     const result = data?.map((sponsor) =>
//       ({ value: sponsor.CityID, label: sponsor.CityName })
//     );
//     return result
//   }

// }