import React, { useEffect, useContext, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { useNavigate } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, sixColArray } from '../../../../Common/ChangeArrayFormat';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import ChangesModal from '../../../../Common/ChangesModal';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const Home = () => {

  const { get_Warrent_Count, updateCount, setUpdateCount, setArresteeDrpData, setChangesStatus, changesStatus, get_Incident_Count, localStoreArray, get_LocalStorage, setWarentStatus, deleteStoreData, storeData } = useContext(AgencyContext);

  const [warentTypeDrpData, setWarentTypeDrpData] = useState([])
  const [warentClassificationDrp, setWarentClassificationDrp] = useState([])
  const [warentStatusDrp, setWarentStatusDrp] = useState([])
  const [headOfAgency, setHeadOfAgency] = useState([]);
  const [editval, setEditval] = useState([]);
  const [warrantID, setWarrantID] = useState('');
  const navigate = useNavigate();
  const [creationDate, setCreationDate] = useState(new Date());

  const [agencyName, setAgencyName] = useState('');
  const [mainIncidentID, setMainIncidentID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [warrentNameData, setWarrentNameData] = useState([]);

  const [value, setValue] = useState({
    WarrantNumber: '',
    AgencyID: '',
    IncidentID: '',
    CreatedByUserFK: '',
    //DropDown
    WarrantTypeID: null,
    WarrantClassificationID: null,
    WarrantStatusID: null,
    WarrantNameID: null,
    AuthorityID: null,
    //Date
    DateOfComplain: '',
    DateTimeIssued: '',
    DateExpired: '',
    NoticeDate: '',
    CreationDate: '',
    WarrantHolder: '',
    Complaint: '',
    Location: '',
  });

  const [errors, setErrors] = useState({
    'DateOfComplainError': '',
    'DateTimeIssuedError': '',
    'DateExpiredError': '',
    'NoticeDateError': '',
    'AuthorityIDError': '',
    'WarrantNameIDError': '',
    'WarrantClassificationIDErrors': '',
    'WarrantTypeIDErrors': '',
  })

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', Agency_Name: "" }),
  }

  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
        setMainIncidentID(localStoreArray?.IncidentID);
        setValue({ ...value, 'IncidentID': localStoreArray?.IncidentID, 'CreatedByUserFK': localStoreArray?.PINID, 'AgencyID': localStoreArray?.AgencyID }
        );
        setAgencyName(localStoreArray?.Agency_Name);
        if (localStoreArray.IncidentID) {
          setMainIncidentID(localStoreArray?.IncidentID);
        }
        if (localStoreArray.WarrantID) {
          setWarrantID(localStoreArray?.WarrantID);
          get_Warrent_Count(localStoreArray?.WarrantID);
        } else {
          setWarrantID(''); GetSingleData(''); get_Warrent_Count('')
        }
      }
    }
  }, [localStoreArray])


  useEffect(() => {
    setValue({ ...value, 'IncidentID': mainIncidentID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID }
    );
  }, [mainIncidentID]);

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.DateOfComplain)) {
      setErrors(prevValues => { return { ...prevValues, ['DateOfComplainError']: RequiredFieldIncident(value.DateOfComplain) } })
    }
    if (RequiredFieldIncident(value.DateTimeIssued)) {
      setErrors(prevValues => { return { ...prevValues, ['DateTimeIssuedError']: RequiredFieldIncident(value.DateTimeIssued) } })
    }
    if (RequiredFieldIncident(value.DateExpired)) {
      setErrors(prevValues => { return { ...prevValues, ['DateExpiredError']: RequiredFieldIncident(value.DateExpired) } })
    }
    if (RequiredFieldIncident(value.NoticeDate)) {
      setErrors(prevValues => { return { ...prevValues, ['NoticeDateError']: RequiredFieldIncident(value.NoticeDate) } })
    }
    if (RequiredFieldIncident(value.AuthorityID)) {
      setErrors(prevValues => { return { ...prevValues, ['AuthorityIDError']: RequiredFieldIncident(value.AuthorityID) } })
    }
    if (RequiredFieldIncident(value.WarrantNameID)) {
      setErrors(prevValues => { return { ...prevValues, ['WarrantNameIDError']: RequiredFieldIncident(value.WarrantNameID) } })
    }
    if (RequiredFieldIncident(value.WarrantTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['WarrantTypeIDErrors']: RequiredFieldIncident(value.WarrantTypeID) } })
    }
    if (RequiredFieldIncident(value.WarrantClassificationID)) {
      setErrors(prevValues => { return { ...prevValues, ['WarrantClassificationIDErrors']: RequiredFieldIncident(value.WarrantClassificationID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DateOfComplainError, DateTimeIssuedError, DateExpiredError, NoticeDateError, AuthorityIDError, WarrantNameIDError, WarrantTypeIDErrors, WarrantClassificationIDErrors } = errors

  useEffect(() => {
    if (WarrantNameIDError === 'true' && DateOfComplainError === 'true' && DateTimeIssuedError === 'true' && DateExpiredError === 'true' && NoticeDateError === 'true' && AuthorityIDError === 'true' && WarrantTypeIDErrors === 'true' && WarrantClassificationIDErrors === 'true') {
      if (warrantID) { Update_Warent(); setErrors({ ...errors, ['DateOfComplainError']: '' }) }
      else { Add_Warent(); setErrors({ ...errors, ['DateOfComplainError']: '' }) }
    }
  }, [DateOfComplainError, DateTimeIssuedError, DateExpiredError, NoticeDateError, AuthorityIDError, WarrantNameIDError, WarrantTypeIDErrors, WarrantClassificationIDErrors])

  const ChangeDropDown = (e, name) => {
    if (e) {
      setChangesStatus(true)
      setValue({
        ...value,
        [name]: e.value
      })
    } else {
      setChangesStatus(true)
      setValue({
        ...value,
        [name]: null
      })
    }
  }

  const handleChange = (e) => {
    if (e) {
      setChangesStatus(true)
      setValue({
        ...value,
        [e.target.name]: e.target.value
      })
    }
  }

  useEffect(() => {
    if (loginAgencyID) {
      WarentType_DrpDwnVal(loginAgencyID); WarentClassificaion_DrpDwnVal(loginAgencyID); WarentStatus_DrpDwnVal(loginAgencyID); get_Head_Of_Agency(loginAgencyID);
      get_Arrestee_Drp_Data(mainIncidentID);
    }
  }, [loginAgencyID])

  const get_Arrestee_Drp_Data = (IncidentID) => {
    const val = {
      'MasterNameID': 0,
      'IncidentID': IncidentID,
    }

    fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((data) => {
      if (data) {
        setWarrentNameData(sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID'));
      }
      else {
        setArresteeDrpData([])
      }
    })
  };

  const get_Head_Of_Agency = (loginAgencyID) => {
    const val = {
      AgencyID: loginAgencyID
    }
    fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
      if (data) {
        setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
      }
      else {
        setHeadOfAgency([])
      }
    })
  };

  const WarentStatus_DrpDwnVal = (loginAgencyID) => {
    const val = {
      AgencyID: loginAgencyID
    }
    fetchPostData('WarrantStatus/GetDataDropDown_WarrantStatus ', val).then((data) => {
      if (data) {
        setWarentStatusDrp(Comman_changeArrayFormat(data, 'WarrantStatusID', 'Description'))
      } else {
        setWarentStatusDrp([]);
      }
    })
  }

  const WarentType_DrpDwnVal = (loginAgencyID) => {
    const val = {
      AgencyID: loginAgencyID
    }
    fetchPostData('WarrantType/GetDataDropDown_WarrantType', val).then((data) => {

      if (data) {
        setWarentTypeDrpData(Comman_changeArrayFormat(data, 'WarrantTypeID', 'Description'))
      } else {
        setWarentTypeDrpData([]);
      }
    })
  }

  const WarentClassificaion_DrpDwnVal = (loginAgencyID) => {
    const val = {
      AgencyID: loginAgencyID
    }
    fetchPostData('WarrantClassification/GetDataDropDown_WarrantClassification', val).then((data) => {
      if (data) {
        setWarentClassificationDrp(Comman_changeArrayFormat(data, 'WarrantClassificationID', 'Description'))
      } else {
        setWarentClassificationDrp([]);
      }
    })
  }

  useEffect(() => {
    if (warrantID) {
      GetSingleData(warrantID)
    }
  }, [warrantID])

  const GetSingleData = (warrantID) => {
    const val = { 'WarrantID': warrantID }
    fetchPostData('Warrant/GetSingleData_Warrant', val)
      .then((res) => {
        if (res) {
          setEditval(res);
        } else { setEditval() }
      })
  }

  useEffect(() => {
    if (warrantID) {
      get_Arrestee_Drp_Data(mainIncidentID);
      setValue({
        ...value,
        'WarrantID': editval[0]?.WarrantID,
        'WarrantNumber': editval[0]?.WarrantNumber,
        'WarrantTypeID': editval[0]?.WarrantTypeID,
        'WarrantClassificationID': editval[0]?.WarrantClassificationID,
        'WarrantStatusID': editval[0]?.WarrantStatusID,
        'WarrantNameID': editval[0]?.WarrantNameID,
        'AuthorityID': editval[0]?.AuthorityID,
        'DateOfComplain': editval[0]?.DateOfComplain,
        'DateTimeIssued': editval[0]?.DateTimeIssued,
        'DateExpired': editval[0]?.DateExpired,
        'NoticeDate': editval[0]?.NoticeDate,
        'WarrantHolder': editval[0]?.WarrantHolder,
        'Complaint': editval[0]?.Complaint,
        'Location': editval[0]?.Location,
        'ModifiedByUserFK': loginPinID,
      }); storeData({ 'WarrantNumber': editval[0]?.WarrantNumber, 'WarrantID': editval[0]?.WarrantID, });
    } else {
      setValue({
        ...value,
        'WarrantIDNumber': '',
        'WarrantTypeID': null,
        'WarrantClassificationID': null,
        'WarrantStatusID': null,
        'WarrantNameID': null,
        'AuthorityID': null,
        //Date
        'DateOfComplain': '',
        'DateTimeIssued': '',
        'DateExpired': '',
        'NoticeDate': '',
        'WarrantHolder': '',
        'Complaint': '',
        'Location': '',
      });
    }
  }, [editval])

  const Add_Warent = () => {
    AddDeleteUpadate('Warrant/Insert_Warrant', value).then((res) => {
      toastifySuccess(res.Message);
      setErrors({ ...errors, 'DateOfComplainError': '' })
      setChangesStatus(false)
      if (res.WarrantId) {
        get_Incident_Count(mainIncidentID)
        setWarrantID(res.WarrantId);
        setWarentStatus(true)
        storeData({ 'WarrantID': res.WarrantId, 'WarrantStatus': true })
      }
      setUpdateCount(updateCount + 1);
      setChangesStatus(false)
    })
      .catch((Err) => toastifyError('Error'))
  }

  const Update_Warent = () => {
    AddDeleteUpadate('Warrant/Update_Warrant', value).then((res) => {
      toastifySuccess(res.Message);
      setChangesStatus(false)
      setUpdateCount(updateCount + 1);
      setErrors({ ...errors, 'DateOfComplainError': '' })
    })
  }

  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const startRef = React.useRef();
  const startRef1 = React.useRef();
  const startRef2 = React.useRef();
  const startRef3 = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
      startRef1.current.setOpen(false);
      startRef2.current.setOpen(false);
      startRef3.current.setOpen(false);
    }
  };

  const Cancel = () => {
    if (!changesStatus) {
      navigate('/warrant');
      // deleteStoreData({ 'WarrantID': '', 'WarrantStatus': '', });
    }
  }

  return (
    <>
      {/* Warrant-information */}
      <div className="col-12 " id="display-not-form">
        <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
          <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0 d-flex align-items-center">Warrant Information</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 pt-1 ">
            <div className="row">
              <div className="col-6 col-md-4 col-lg-2 mt-1">
                <div className="text-field">
                  <input type="text" name='WarrantIDNumber' value={value?.WarrantNumber} className="readonlyColor" onChange={''} id='Warrant Id' required readOnly />
                  <label className="">Warrant Number</label>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-4 mt-1">
                <div className="text-field">
                  <input type="text" name='agencyName' className='readonlyColor' value={agencyName ? agencyName : 'Agency Name'} onChange={''} id='Agency' required readOnly />
                  <label className="">Agency</label>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3 mt-1">
                <div className=" dropdown__box">
                  <Select
                    name='WarrantTypeID'
                    value={warentTypeDrpData?.filter((obj) => obj.value === value?.WarrantTypeID)}
                    isClearable
                    options={warentTypeDrpData}
                    onChange={(e) => ChangeDropDown(e, 'WarrantTypeID')}
                    placeholder="Select..."
                    styles={colourStyles}
                  />
                  <label htmlFor="">Warrant Type</label>
                  {errors.WarrantTypeIDErrors !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WarrantTypeIDErrors}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3 mt-1">
                <div className=" dropdown__box">
                  <Select
                    name='WarrantClassificationID'
                    value={warentClassificationDrp?.filter((obj) => obj.value === value?.WarrantClassificationID)}
                    isClearable
                    options={warentClassificationDrp}
                    onChange={(e) => ChangeDropDown(e, 'WarrantClassificationID')}
                    placeholder="Select..."
                    styles={colourStyles}
                  />
                  <label htmlFor="">Warrant Classification</label>
                  {errors.WarrantClassificationIDErrors !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WarrantClassificationIDErrors}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '6px' }}>
                <div className="text-field">
                  <input type="text" name='WarrantHolder' value={value?.WarrantHolder} className="" onChange={handleChange} id='Warrant Holder' required />
                  <label className="">Warrant Holder</label>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '5px' }}>
                <div className=" dropdown__box">
                  <Select
                    name='WarrantStatusID'
                    value={warentStatusDrp?.filter((obj) => obj.value === value?.WarrantStatusID)}
                    isClearable
                    options={warentStatusDrp}
                    onChange={(e) => ChangeDropDown(e, 'WarrantStatusID')}
                    placeholder="Select..."
                    styles={customStylesWithOutColor}
                  />
                  <label htmlFor="">Warrant Status</label>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3  ">
                <div className="dropdown__box">
                  <DatePicker
                    // open={false}
                    ref={startRef}
                    onKeyDown={onKeyDown}
                    id="creationDate"
                    name='creationDate'
                    onChange={(date) => { setCreationDate(date); setValue({ ...value, ['creationDate']: date ? getShowingMonthDateYear(date) : null }) }}
                    className='readonlyColor'
                    dateFormat="MM/dd/yyyy HH:mm"
                    selected={creationDate}
                    timeInputLabel
                    isClearable
                    placeholderText='Select...'
                    peekNextMonth
                    dropdownMode="select"
                    showMonthDropdown
                    showYearDropdown
                    timeIntervals={1}
                    timeCaption="Time"
                    maxDate={new Date()}
                    readOnly
                  />
                  <label htmlFor="" className='pt-1'>Creation Date/Time</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Name-information */}
      <div className="col-12 " id="display-not-form">
        <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
          <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0 d-flex align-items-center">Name Information</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 pt-1 ">
            <div className="row">
              <div className="col-6 col-md-4 col-lg-4 mt-1">
                <div className="dropdown__box">
                  <Select
                    name='WarrantNameID'
                    styles={colourStyles}
                    options={warrentNameData}
                    value={warrentNameData?.filter((obj) => obj.value === value?.WarrantNameID)}
                    isClearable={!!value?.WarrantNameID}
                    onChange={(e) => ChangeDropDown(e, 'WarrantNameID')}
                    placeholder="Select..."
                  />
                  <label htmlFor="">Warrant Name</label>
                  {errors.WarrantNameIDError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WarrantNameIDError}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '6px' }}>
                <div className="text-field">
                  <input type="text" name='Complaint' value={value?.Complaint} onChange={handleChange} className="" id='Complaint' required />
                  <label >Complainant</label>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3  ">
                <div className="dropdown__box">
                  <DatePicker
                    name='DateOfComplain'
                    id='DateOfComplain'
                    className={'requiredColor'}
                    onChange={(date) => { setValue({ ...value, ['DateOfComplain']: date ? getShowingDateText(date) : null }) }}
                    selected={value?.DateOfComplain && new Date(value?.DateOfComplain)}
                    placeholderText={'Select...'}
                    dateFormat="MM/dd/yyyy"
                    isClearable={!!value?.DateOfComplain}
                    autoComplete='Off'
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    timeIntervals={1}
                    maxDate={new Date()}
                  />
                  <label htmlFor="" className='pt-1'>Date Of Complain</label>
                  {errors.DateOfComplainError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateOfComplainError}</span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Dates */}
      <div className="col-12 " id="display-not-form">
        <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
          <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0 d-flex align-items-center">Dates</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 pt-1 ">
            <div className="row">
              <div className="col-6 col-md-4 col-lg-3  ">
                <div className="dropdown__box">
                  <DatePicker
                    name='DateTimeIssued'
                    id='DateTimeIssued'
                    className={'requiredColor'}
                    onChange={(date) => { setValue({ ...value, ['DateTimeIssued']: date ? getShowingDateText(date) : null }) }}
                    selected={value?.DateTimeIssued && new Date(value?.DateTimeIssued)}
                    placeholderText={'Select...'}
                    dateFormat="MM/dd/yyyy HH:mm"
                    timeInputLabel
                    isClearable={!!value?.DateTimeIssued}
                    autoComplete='Off'
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    showTimeSelect
                    timeIntervals={1}
                    maxDate={new Date()}
                  />
                  <label htmlFor="" className='pt-1'>Date/Time Issued</label>
                  {errors.DateTimeIssuedError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateTimeIssuedError}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3  ">
                <div className="dropdown__box">
                  <DatePicker
                    name='DateExpired'
                    id='DateExpired'
                    className={'requiredColor'}
                    onChange={(date) => { setValue({ ...value, ['DateExpired']: date ? getShowingDateText(date) : null }) }}
                    selected={value?.DateExpired && new Date(value?.DateExpired)}
                    placeholderText={'Select...'}
                    dateFormat="MM/dd/yyyy"
                    isClearable={!!value?.DateExpired}
                    autoComplete='Off'
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    timeIntervals={1}
                  />
                  <label htmlFor="" className='pt-1'>Date Expired</label>
                  {errors.DateExpiredError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateExpiredError}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-3  ">
                <div className="dropdown__box">
                  <DatePicker
                    name='NoticeDate'
                    id='NoticeDate'
                    className={'requiredColor'}
                    onChange={(date) => { setValue({ ...value, ['NoticeDate']: date ? getShowingDateText(date) : null }) }}
                    selected={value?.NoticeDate && new Date(value?.NoticeDate)}
                    placeholderText={'Select...'}
                    dateFormat="MM/dd/yyyy"
                    isClearable={!!value?.NoticeDate}
                    autoComplete='Off'
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    timeIntervals={1}
                    maxDate={new Date()}
                  />
                  <label htmlFor="" className='pt-1'>Notice Date</label>
                  {errors.NoticeDateError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NoticeDateError}</span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Issuing Authority*/}
      <div className="col-12 " id="display-not-form">
        <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
          <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0 d-flex align-items-center">Issuing Authority</p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 pt-1 ">
            <div className="row">
              <div className="col-4 col-md-4 col-lg-4 mt-1">
                <div className=" dropdown__box">
                  <Select
                    styles={colourStyles}
                    name='AuthorityID'
                    value={headOfAgency?.filter((obj) => obj.value === value?.AuthorityID)}
                    isClearable
                    options={headOfAgency}
                    onChange={(e) => ChangeDropDown(e, 'AuthorityID')}
                    placeholder="Select..."
                    menuPlacement='top'
                  />
                  <label htmlFor="">Authority</label>
                  {errors.AuthorityIDError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AuthorityIDError}</span>
                  ) : null}
                </div>
              </div>
              <div className="col-8  col-md-8 col-lg-8  " >
                <div className="dropdown__box">
                  <textarea name='Location' id="Location" value={value?.Location} onChange={handleChange} cols="30" rows='1' className="form-control " ></textarea>
                  <label htmlFor="" className=''>Location</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 mt-2 text-right p-0">
        <button type="button" data-toggle="modal" data-target="#" className="btn btn-sm btn-success  mr-1" onClick={check_Validation_Error} >{warrantID ? 'Update' : 'Save'}
        </button>
        <button type="button" className="btn btn-sm btn-success  mr-1" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} onClick={() => { Cancel() }}>Close</button>

      </div>
      <ChangesModal func={check_Validation_Error} />
      <IdentifyFieldColor />
    </>
  )
}

export default Home