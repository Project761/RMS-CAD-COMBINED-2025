import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { customStylesWithOutColor, Decrypt_Id_Name, getShowingWithOutTime } from "../../../../Common/Utility";
import { Comman_changeArrayFormat_With_Name } from "../../../../Common/ChangeArrayFormat";
import { AddDeleteUpadate, fetchPostData } from "../../../../hooks/Api";
import { toastifySuccess } from "../../../../Common/AlertMsg";
import { AgencyContext } from "../../../../../Context/Agency/Index";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/api';
import NameListing from '../../../ShowAllList/NameListing';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_Eye_Color_Drp_Data, get_Hair_Color_Drp_Data } from '../../../../../redux/actions/DropDownsData';

const General = (props) => {

  const { ListData, DecNameID, DecMasterNameID, isViewEventDetails = false } = props
  const { setChangesStatus, get_Name_Count, setcountStatus, setNameSingleData } = useContext(AgencyContext);

  const dispatch = useDispatch();

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const eyeColorDrpData = useSelector((state) => state.DropDown.eyeColorDrpData);
  const hairColorDrpData = useSelector((state) => state.DropDown.hairColorDrpData);


  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  let MstPage = query?.get('page');

  const [verifyIdDrp, setVerifyIdDrp] = useState([]);
  const [biVerifyIDDrp, setBiVerifyIDDrp] = useState([]);
  const [editval, setEditval] = useState([]);
  const [maritalStatusIDDrp, setMaritalStatusIDDrp] = useState([]);

  //------country-------//
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [dlCountryIDList, setDlCountryIDList] = useState([]);
  const [biCountryIDList, setBiCountryIDList] = useState([]);
  const [biStateList, setBiStateList] = useState([]);

  //------------------Ids---------------------
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState(1);
  const [openPage, setOpenPage] = useState('');
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const [value, setValue] = useState({

    'DLVerifyID': null, 'BICountryID': null, 'BIStateID': null,
    'BIVerifyID': null, 'EyeColorID': null, 'HairColorID': null, 'ResidentID': null, 'MaritalStatusID': null,
    'DLExpiryDate': null,
    'DLNumber': "", 'IsUSCitizen': "", 'BirthPlace': "", 'BINationality': "",
    'DLStateID': null, 'DLCountryID': null, "BICityID": null,
    'NameID': '', 'MasterNameID': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '',
    'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
    'PINID': "",
  });

  const [errors, setErrors] = useState({
    'DLNumber': '',
    'DLStateID': ''
  });

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("N047", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

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
      setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': DecNameID } });
    }
  }, [DecNameID, DecMasterNameID, loginPinID]);

  useEffect(() => {

    get_Single_Data(DecNameID);

  }, [DecNameID])

  const get_Single_Data = (nameID, masterNameID) => {
    const val = { NameID: DecNameID, MasterNameID: DecMasterNameID };
    const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, 'PINID': loginPinID };

    return new Promise((resolve, reject) => {
      fetchPostData('MasterName/GetSingleData_MasterName', MstPage ? val2 : val).then((res) => {
        if (res) {
          setEditval(res);
          setNameSingleData(res)
          resolve();
        } else {
          setEditval([]);

        }
      }).catch((error) => {
        reject(error);
      });
    });
  }


  const checkValidationErrors = () => {
    const newErrors = {};
    if (value.DLStateID && !value.DLNumber) {
      newErrors.DLNumber = 'Required *';
    }
    if (!value.DLStateID && value.DLNumber) {
      newErrors.DLStateID = 'Required *';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      Update_Name();
    }
  };

  useEffect(() => {
    if (editval) {
      if (editval[0]?.DLCountryID || editval[0]?.DLStateID || editval[0]?.DLNumber || editval[0]?.MaritalStatusID || editval[0]?.HairColorID || editval[0]?.BIVerifyID
        || editval[0]?.BICountryID || editval[0]?.BIStateID || editval[0]?.BICityID || editval[0]?.DLVerifyID || editval[0]?.ResidentID || editval[0]?.EyeColorID ||
        editval[0]?.BINationality || editval[0]?.BirthPlace || editval[0]?.IsUSCitizen
      ) {
        setcountStatus(true);
      }
      else {
        setcountStatus(false);
      }
      setValue({
        ...value,
        'MasterNameID': DecMasterNameID, 'NameID': DecNameID,
        'MaritalStatusID': editval[0]?.MaritalStatusID, 'HairColorID': editval[0]?.HairColorID, 'BIVerifyID': editval[0]?.BIVerifyID,
        'BICountryID': editval[0]?.BICountryID, 'BIStateID': editval[0]?.BIStateID, 'BICityID': editval[0]?.BICityID,
        'DLVerifyID': editval[0]?.DLVerifyID, "ResidentID": editval[0]?.ResidentID,
        'EyeColorID': editval[0]?.EyeColorID, 'DLStateID': editval[0]?.DLStateID, 'DLCountryID': editval[0]?.DLCountryID ? editval[0]?.DLCountryID : editval[0]?.DLStateID || editval[0]?.DLStateID == '' ? 20001 : null,

        'IsJuvenile': editval[0]?.IsJuvenile, 'IsVerify': editval[0]?.IsVerify, 'IsUnListedPhNo': editval[0]?.IsUnListedPhNo,

        'BINationality': editval[0]?.BINationality, 'BirthPlace': editval[0]?.BirthPlace, 'IsUSCitizen': editval[0]?.IsUSCitizen,
        'DLNumber': editval[0]?.DLNumber,

        'DLExpiryDate': editval[0]?.DLExpiryDate ? getShowingWithOutTime(editval[0]?.DLExpiryDate) : null,
      })
      getStateList(editval[0]?.DLCountryID ? editval[0]?.DLCountryID : editval[0]?.DLStateID || editval[0]?.DLStateID == '' ? 20001 : null);
      getBIStateList(editval[0]?.BICountryID);
      getCity(editval[0]?.BIStateID);
    } else {
      resetState()
    }
  }, [editval])

  useEffect(() => {
    if (openPage || loginAgencyID) {
      if (hairColorDrpData?.length === 0) dispatch(get_Hair_Color_Drp_Data(loginAgencyID))
      if (eyeColorDrpData?.length === 0) dispatch(get_Eye_Color_Drp_Data(loginAgencyID))
      getStateList(); getCountryID(); get_General_Drp_Data(loginAgencyID);
    }
  }, [openPage, loginAgencyID]);


  const get_General_Drp_Data = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('MasterName/GetGeneralDropDown', val).then((data) => {
      if (data) {
        setVerifyIdDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.HowVerify, "VerifyID", "Description", "DLVerifyID")
        );
        setBiVerifyIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.HowVerify, "VerifyID", "Description", "BIVerifyID")
        );
        setMaritalStatusIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.MaritalStatus, "MaritalStatusID", "Description", "MaritalStatusID")
        );
      } else {
        setBiVerifyIDDrp([]); setBiVerifyIDDrp([]); setMaritalStatusIDDrp([]);
      }
    })
  };

  useEffect(() => {
    getCountryID();
  }, [value?.IsUSCitizen])

  const getCountryID = async () => {
    const val = { 'IsUSCitizen': value.IsUSCitizen, };
    fetchPostData("State_City_ZipCode/GetData_Country", val).then((data) => {
      if (data) {
        setDlCountryIDList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "DLCountryID"));
        setBiCountryIDList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "BICountryID"));
      } else {
        setDlCountryIDList([]);
      }
    });
  };

  const getStateList = async (CountryID) => {
    const val = { CountryID: CountryID, };
    fetchPostData("NameCountry_State_City/GetData_NameState", val).then((data) => {
      if (data) {
        setStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "DLStateID"));
      } else {
        setStateList([]);
      }
    });
  };

  const getBIStateList = async (CountryID) => {
    const val = { CountryID: CountryID, };
    fetchPostData("NameCountry_State_City/GetData_NameState", val).then((data) => {
      if (data) {
        setBiStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "BIStateID"));
      } else {
        setBiStateList([]);
      }
    });
  };

  const getCity = async (StateID) => {
    const val = { StateID: StateID, };
    fetchPostData("State_City_ZipCode/GetData_City", val).then((data) => {
      if (data) {
        setCityList(Comman_changeArrayFormat_With_Name(data, "CityID", "CityName", "BICityID"))
      } else {
        setCityList([]);
      }
    });
  };



  const selectHandleChange = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e) {

      !addUpdatePermission && setChangesStatus(true);
      switch (name) {
        case 'DLCountryID':
          getStateList(e.value);
          setValue(prev => ({ ...prev, [name]: e.value, DLStateID: '', DLNumber: '' }));
          break;
        case 'DLStateID':
          setValue(prev => ({ ...prev, [name]: e.value, DLNumber: '' }));
          break;
        case 'BICountryID':
          getBIStateList(e.value);
          setValue(prev => ({ ...prev, [name]: e.value, BIStateID: '', BICityID: '' }));
          setBiStateList([]);
          setCityList([]);
          break;
        case 'BIStateID':
          getCity(e.value);
          setValue(prev => ({ ...prev, [name]: e.value, BICityID: '' }));
          setCityList([]);
          break;
        case 'BICityID':
          setValue(prev => ({ ...prev, [name]: e.value }));
          break;
        default:
          setValue(prev => ({ ...prev, [name]: e.value }));
          break;
      }
    } else if (e === null) {

      !addUpdatePermission && setChangesStatus(true);
      switch (name) {
        case 'DLCountryID':
          setValue(prev => ({
            ...prev,
            [name]: '',
            DLStateID: '',
            DLNumber: '',
          }));
          setStateList([]);
          break;
        case 'DLStateID':
          setValue(prev => ({
            ...prev,
            [name]: '',
            DLNumber: '',
          }));
          break;
        case 'BICountryID':
          setValue(prev => ({
            ...prev,
            [name]: '',
            BIStateID: '',
            BICityID: '',
          }));
          setBiStateList([]);
          setCityList([]);
          break;
        case 'BIStateID':
          setValue(prev => ({
            ...prev,
            [name]: '',
            BICityID: '',
          }));
          setCityList([]);
          break;
        case 'BICityID':
          setValue(prev => ({ ...prev, [name]: '' }));
          break;
        default:
          setValue(prev => ({ ...prev, [name]: null }));
          break;
      }
    } else {
      setValue(prev => ({ ...prev, [name]: '' }));
    }
  };


  const HandleChange = (e) => {
    if (e.target.name === "IsUSCitizen") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
      });
      !addUpdatePermission && setStatesChangeStatus(true);
      !addUpdatePermission && setChangesStatus(true)
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
      !addUpdatePermission && setStatesChangeStatus(true);
      !addUpdatePermission && setChangesStatus(true)
    }
  };

  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const Update_Name = () => {
    const ModifiedByUserFK = loginPinID;
    const { DLVerifyID, BICountryID, BIStateID, BIVerifyID, EyeColorID, HairColorID, ResidentID, MaritalStatusID, DLExpiryDate,
      DLNumber, IsUSCitizen, BirthPlace, BINationality, DLStateID, DLCountryID, BICityID, NameID, MasterNameID, CreatedByUserFK,
      IsMaster, PINID } = value;
    const val = {
      DLVerifyID, BICountryID, BIStateID, BIVerifyID, EyeColorID, HairColorID, ResidentID, MaritalStatusID, DLExpiryDate,
      DLNumber, IsUSCitizen, BirthPlace, BINationality, DLStateID, DLCountryID, BICityID, NameID, MasterNameID, CreatedByUserFK,
      IsMaster, PINID, ModifiedByUserFK,
    };

    AddDeleteUpadate('MasterName/UpdateBasicInfoName', val).then((res) => {
      get_Single_Data(DecNameID, DecMasterNameID).then(() => {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
        const parseData = JSON.parse(res.data);
        toastifySuccess(parseData?.Table[0].Message);
        setChangesStatus(false);
        setStatesChangeStatus(false);
      });
    });
  }


  const resetState = () => {
    setStatesChangeStatus(false);
    setValue({
      ...value,
      'BIVerifyID': "", 'EyeColorID': "", 'HairColorID': "", 'ResidentID': "", 'MaritalStatusID': "",
      'DLExpiryDate': null, 'DLNumber': "", 'IsUSCitizen': "", 'BirthPlace': "", 'BINationality': "",
      'DLStateID': "", 'DLCountryID': "", 'DLVerifyID': "",
    })

  }



  const customWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 33,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
      width: 130,
    }),
  };

  const NameDateExpired = ListData[0]?.DateOfBirth



  return (
    <>
      <NameListing {...{ ListData }} />
      <div className="col-12 " id="display-not-form">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-4 pt-3 ">
            <fieldset>
              <legend>Birth Information</legend>
              <div className="row ">
                <div className="col-12 col-md-12 col-lg-12 mt-1  ml-5 pl-5">
                  <div className="form-check ">
                    <input
                      className="form-check-input"
                      value={value?.IsUSCitizen}
                      checked={value?.IsUSCitizen}
                      onChange={HandleChange}
                      type="checkbox"
                      name="IsUSCitizen"
                      id="flexCheckDefault"
                    />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                      US Citizen
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2 col-md-2 col-lg-3 mt-3">
                    <label htmlFor="" className='label-name '>Country</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-8  mt-1 " >
                    <Select
                      name="BICountryID"
                      styles={customStylesWithOutColor}
                      value={biCountryIDList?.filter((obj) => obj.value === value?.BICountryID)}
                      isClearable
                      options={biCountryIDList}
                      onChange={(e) => selectHandleChange(e, 'BICountryID')}
                      placeholder="Select..."
                    />
                  </div>
                  <div className="col-2 col-md-2 col-lg-3 mt-3">
                    <label htmlFor="" className='label-name '>State</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-8  mt-1" >
                    <Select
                      name="BIStateID"
                      styles={customStylesWithOutColor}
                      value={biStateList?.filter((obj) => obj.value === value?.BIStateID)}
                      isClearable
                      options={biStateList}
                      onChange={(e) => selectHandleChange(e, 'BIStateID')}

                      isDisabled={!value?.BICountryID || value.BICountryID > 20003}
                      placeholder="Select..."
                    />
                  </div>
                  <div className="col-2 col-md-2 col-lg-3 mt-2">
                    <label htmlFor="" className='label-name '>City</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-8  mt-1" >
                    <Select
                      name="BICityID"
                      styles={customStylesWithOutColor}
                      value={cityList?.filter((obj) => obj.value === value?.BICityID)}
                      isClearable
                      options={cityList}
                      onChange={(e) => selectHandleChange(e, 'BICityID')}
                      placeholder="Select..."

                      isDisabled={!value?.BIStateID || value.BICountryID > 20003}
                    />
                  </div>
                  <div className="col-2 col-md-2 col-lg-3 mt-3 px-1">
                    <label htmlFor="" className='label-name '>Place Of Birth</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-8 text-field mt-2" >
                    <input type="text" className="" value={value?.BirthPlace ? value.BirthPlace.match(/[a-zA-Z\s]*/) : ''} onChange={HandleChange} name="BirthPlace" required autoComplete='off' />
                  </div>
                  <div className="col-2 col-md-2 col-lg-3 mt-2">
                    <label htmlFor="" className='label-name '>Nationality</label>
                  </div>
                  <div className="col-4 col-md-4 col-lg-8 text-field mt-1" >
                    <input type="text" className="" value={value?.BINationality ? value.BINationality.match(/[a-zA-Z\s]*/) : ''} onChange={HandleChange} name="BINationality" required autoComplete='off' />
                  </div>
                  <div className="col-2 col-md-2 col-lg-3 mt-3">

                    <span data-toggle="modal" onClick={() => { setOpenPage('Verify') }} data-target="#ListModel" className='new-link px-0'>
                      How Verify
                    </span>
                  </div>
                  <div className="col-4 col-md-4 col-lg-8 mt-1 pt-1" >
                    <Select
                      name="BIVerifyID"
                      styles={customStylesWithOutColor}
                      value={biVerifyIDDrp?.filter((obj) => obj.value === value?.BIVerifyID)}
                      options={biVerifyIDDrp}
                      onChange={(e) => selectHandleChange(e, 'BIVerifyID')}
                      isClearable
                      placeholder="Select..."
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="col-12 col-md-12 col-lg-4 pt-3">
            <fieldset>
              <legend>DL Information</legend>
              <div className="row mt-4">
                <div className="col-2 col-md-2 col-lg-3 mt-3">
                  <label htmlFor="" className='label-name '>Country</label>
                </div>
                <div className="col-4 col-md-4 col-lg-9 mt-2" >
                  <Select
                    name="DLCountryID"
                    styles={customStylesWithOutColor}
                    value={dlCountryIDList?.filter((obj) => obj.value === value?.DLCountryID)}
                    isClearable
                    options={dlCountryIDList}
                    onChange={(e) => selectHandleChange(e, 'DLCountryID')}
                    placeholder="Select..."
                  />
                </div>
                <div className="col-2 col-md-2 col-lg-3 mt-3">
                  <label htmlFor="" className='label-name '>License State{errors.DLStateID && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors.DLStateID}</p>}</label>
                </div>
                <div className="col-4 col-md-4 col-lg-9 mt-2" >
                  <Select
                    name="DLStateID"
                    styles={customStylesWithOutColor}
                    value={stateList?.find(obj => obj.value === value.DLStateID)}
                    isClearable
                    options={stateList}
                    onChange={(e) => selectHandleChange(e, 'DLStateID')}
                    placeholder="Select..."
                    isDisabled={!value.DLCountryID}

                  />
                </div>

                <div className="col-2 col-md-2 col-lg-3 mt-3">
                  <label htmlFor="" className='label-name '>DL #{errors.DLNumber && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors.DLNumber}</p>}</label>
                </div>
                <div className="col-4 col-md-4 col-lg-9 text-field mt-2" >
                  <input
                    type="text"
                    style={{ textTransform: "uppercase" }}

                    value={value?.DLNumber ? value.DLNumber.replace(/[^\w\s]/g, '') : ''}
                    maxLength={15}
                    onChange={HandleChange}
                    name="DLNumber"
                    required
                    autoComplete='off'
                    disabled={!value?.DLStateID}
                    className={!value?.DLStateID ? 'readonlyColor' : 'requiredColor'}

                  />
                </div>
                <div className="col-2 col-md-2 col-lg-3 mt-3 ">
                  <label htmlFor="" className='label-name '>DL&nbsp;Expiry&nbsp;Date</label>
                </div>
                <div className="col-4 col-md-4 col-lg-9  " >
                  <DatePicker
                    ref={startRef}

                    onKeyDown={(e) => {
                      if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                        e.preventDefault();
                      } else {
                        onKeyDown(e);
                      }
                    }}
                    id="DLExpiryDate"
                    name="DLExpiryDate"
                    dateFormat="MM/dd/yyyy"
                    onChange={(date) => { !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true); setValue({ ...value, ["DLExpiryDate"]: date ? getShowingWithOutTime(date) : null, }); }}
                    isClearable
                    selected={value?.DLExpiryDate && new Date(value?.DLExpiryDate)}
                    placeholderText={"Select..."}
                    autoComplete="Off"
                    dropdownMode="select"
                    showMonthDropdown
                    showDisabledMonthNavigation
                    showYearDropdown

                    minDate={new Date(NameDateExpired)}
                  />
                </div>
                <div className="col-2 col-md-2 col-lg-3 mt-3">
                  <span data-toggle="modal" onClick={() => { setOpenPage('Verify') }} data-target="#ListModel" className='new-link px-0'>
                    How Verify
                  </span>
                </div>
                <div className="col-4 col-md-4 col-lg-9  mt-1" >
                  <Select
                    name="DLVerifyID"
                    styles={customStylesWithOutColor}
                    value={verifyIdDrp?.filter((obj) => obj.value === value?.DLVerifyID)}
                    options={verifyIdDrp}
                    onChange={(e) => selectHandleChange(e, 'DLVerifyID')}
                    isClearable
                    placeholder="Select..."
                  />
                </div>
              </div>
            </fieldset>
          </div>


          {/* Basic */}
          <div className="col-12 col-md-12 col-lg-4 pt-3">
            <fieldset>
              <legend>Basic Information</legend>
              <div className="row mt-4">
                <div className="col-2 col-md-2 col-lg-3 mt-3">
                  <span data-toggle="modal" onClick={() => { setOpenPage('Color') }} data-target="#ListModel" className='new-link px-0'>
                    Eye Color
                  </span>
                </div>
                <div className="col-4 col-md-4 col-lg-8  mt-2" >
                  <Select
                    name="EyeColorID"
                    styles={customStylesWithOutColor}
                    value={eyeColorDrpData?.filter((obj) => obj.value === value?.EyeColorID)}
                    options={eyeColorDrpData}
                    onChange={(e) => selectHandleChange(e, 'EyeColorID')}
                    isClearable
                    placeholder="Select..."
                    menuPlacement="bottom"
                  />
                </div>
                <div className="col-2 col-md-2 col-lg-3 mt-3">
                  <span data-toggle="modal" onClick={() => { setOpenPage('Color') }} data-target="#ListModel" className='new-link px-0'>
                    Hair Color
                  </span>
                </div>
                <div className="col-4 col-md-4 col-lg-8  mt-2" >
                  <Select
                    name="HairColorID"
                    styles={customStylesWithOutColor}
                    value={hairColorDrpData?.filter((obj) => obj.value === value?.HairColorID)}
                    options={hairColorDrpData}
                    onChange={(e) => selectHandleChange(e, 'HairColorID')}
                    isClearable
                    placeholder="Select..."
                    menuPlacement="bottom"
                  />
                </div>

                <div className="col-2 col-md-2 col-lg-3 mt-3 ">

                  <span data-toggle="modal" onClick={() => { setOpenPage('Marital Status') }} data-target="#ListModel" className='new-link '>
                    Marital&nbsp;Status
                  </span>
                </div>
                <div className="col-4 col-md-4 col-lg-8  mt-2" >
                  <Select
                    name="MaritalStatusID"
                    styles={customStylesWithOutColor}
                    value={maritalStatusIDDrp?.filter((obj) => obj.value === value?.MaritalStatusID)}
                    options={maritalStatusIDDrp}
                    onChange={(e) => selectHandleChange(e, 'MaritalStatusID')}
                    isClearable
                    placeholder="Select..."
                    menuPlacement="top"
                  />
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        {!isViewEventDetails &&
          <div className="col-12  text-right mt-3 p-0">


            {
              effectiveScreenPermission ?
                effectiveScreenPermission[0]?.Changeok ?
                  <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" disabled={!statesChangeStatus} onClick={() => { checkValidationErrors(); }} >Update</button>
                  :
                  <>
                  </>
                :
                <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" disabled={!statesChangeStatus} onClick={() => { checkValidationErrors(); }} >Update</button>
            }
          </div>}
      </div >
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal func={checkValidationErrors} />
    </>

  );
};

export default General;




