import React, { useContext, useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { customStylesWithOutColor, Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../Common/Utility';
import { fetchPostData } from '../../../hooks/Api';
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { get_PropertyLossCode_Drp_Data, get_PropertyTypeData } from '../../../../redux/actions/DropDownsData';
import { Property_LossCode_Drp_Data } from '../../../../redux/actionTypes';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { toastifyError } from '../../../Common/AlertMsg';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';

const ChainOfCustodyReport = () => {

  const dispatch = useDispatch();

  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const { setChangesStatus, GetDataTimeZone, datezone, } = useContext(AgencyContext);
  const ipAddress = sessionStorage.getItem('IPAddress');
  const [stolenStatus, setStolenStatus] = useState(false)
  const [recoveredStatus, setRecoveredStatus] = useState(false)
  const [damagedStatus, setDamagedStatus] = useState(false)

  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [propertyCategoryData, setPropertyCategoryData] = useState([]);
  const [verifyReport, setverifyReport] = useState(false);
  const [masterReportData, setMasterReportData] = useState([]);
  const [multiImage, setMultiImage] = useState([]);
  const [loder, setLoder] = useState(false);
  const [loginPinID, setloginPinID,] = useState('');
  const [LoginUserName, setLoginUserName] = useState('');
  const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
  const [showWatermark, setShowWatermark] = useState(false);

  const [value, setValue] = useState({
    'IncidentNumber': '', 'IncidentNumberTo': '', 'PropertyNumber': '', 'PropertyNumberTo': '', 'ReportedDate': null, 'ReportedDateTo': null, 'OccurredFrom': null, 'OccurredFromTo': null, 'AgencyID': '', 'PropertyTypeID': null, 'CategoryID': null, 'IsStolen': '', 'IsDamaged': '', 'IsRecovered': '',
    'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
  });

  const [searchValue, setSearchValue] = useState({
    PropertyTypeID: null, CategoryID: null, ReportedDate: '', ReportedDateTo: '', PropertyNumber: '', PropertyNumberTo: '', IncidentNumber: '', IncidentNumberTo: '', OccurredFrom: '', OccurredFromTo: '',

  });

  const [showFields, setShowFields] = useState({
    showPropertyTypeID: false, showCategoryID: false, showReportedDate: false, showReportedDateTo: false, showPropertyNumber: false, showPropertyNumberTo: false, showIncidentNumber: false, showIncidentNumberTo: false, showOccurredFrom: false, showOccurredFromTo: false, showValueFrom: false,
  });

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginUserName(localStoreData?.UserName); setloginPinID(parseInt(localStoreData?.PINID));
      dispatch(get_PropertyTypeData(localStoreData?.AgencyID)); dispatch(get_ScreenPermissions_Data("P105", localStoreData?.AgencyID, localStoreData?.PINID));
      GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  useEffect(() => {
    setShowFields({
      showPropertyTypeID: searchValue.PropertyTypeID !== null,
      showCategoryID: searchValue.CategoryID !== null,
      showReportedDate: searchValue.ReportedDate,
      showReportedDateTo: searchValue.ReportedDateTo,
      showPropertyNumber: searchValue.PropertyNumber,
      showPropertyNumberTo: searchValue.PropertyNumberTo,
      showIncidentNumber: searchValue.IncidentNumber,
      showIncidentNumberTo: searchValue.IncidentNumberTo,
      showOccurredFrom: searchValue.OccurredFrom,
      showOccurredFromTo: searchValue.OccurredFromTo,

    });
  }, [searchValue]);

  const componentRef = useRef();

  // const printForm = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: 'Data',
  //   onAfterPrint: () => { '' }
  // })
  const printForm = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Data',
    onBeforeGetContent: () => {
      setLoder(true);
    },
    onAfterPrint: () => {
      setLoder(false);
    }
  });
  // const propertyhandle = (e) => {
  //   if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
  //     var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
  //     if (ele.length === 10) {
  //       var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
  //       var match = cleaned.match(/^(\w{3})(\d{7})$/);
  //       if (match) {
  //         setValue({
  //           ...value,
  //           [e.target.name]: match[1].toUpperCase() + '-' + match[2]
  //         })
  //       }
  //     } else {
  //       ele = e.target.value.split("'").join('').replace(/[^a-zA-Z\s^0-9\s]/g, '');
  //       setValue({ ...value, [e.target.name]: ele });

  //       if (ele?.length == 0) { e.target.name == 'PropertyNumber' && setValue({ ...value, ['PropertyNumberTo']: "", [e.target.name]: ele }) }
  //     }
  //   } else {
  //     setValue({
  //       ...value,
  //       [e.target.name]: e.target.value
  //     })
  //   }
  // }
  const propertyhandle = (e) => {
    // if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
    //   var ele = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    //   if (ele.length === 10) {
    //     var match = ele.match(/^(\w{3})(\d{7})$/);
    //     if (match) {
    //       setValue({ ...value, [e.target.name]: match[1].toUpperCase() + '-' + match[2] });
    //     }
    //   } else {
    //     setValue({
    //       ...value,
    //       [e.target.name]: ele
    //     });
    //     if (ele.length === 0 && e.target.name === 'PropertyNumber') {
    //       setValue({ ...value, PropertyNumberTo: "", [e.target.name]: ele });
    //     }
    //   }
    // } else {
    //   setValue({
    //     ...value,
    //     [e.target.name]: e.target.value
    //   });
    // }
    if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
      let ele = e.target.value.trim();
      setValue({ ...value, [e.target.name]: ele });
      if (ele.length === 0) {
        e.target.name === 'PropertyNumber' && setValue({
          ...value, ['PropertyNumberTo']: "", [e.target.name]: ele
        });
      }
    }
    else { setValue({ ...value, [e.target.name]: e.target.value }) }
  };

  // const handleChange = (e) => {
  //   if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
  //     var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
  //     if (ele.length === 8) {
  //       var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
  //       var match = cleaned.match(/^(\d{2})(\d{6})$/);
  //       if (match) {
  //         // console.log(match)
  //         setValue({
  //           ...value,
  //           [e.target.name]: match[1] + '-' + match[2]
  //         })
  //       }
  //     } else {
  //       ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
  //       setValue({ ...value, [e.target.name]: ele });

  //       if (ele?.length == 0) { e.target.name == 'IncidentNumber' && setValue({ ...value, ['IncidentNumberTo']: "", [e.target.name]: ele }) }
  //     }
  //   } else {
  //     setValue({
  //       ...value,
  //       [e.target.name]: e.target.value
  //     })
  //   }
  // }

  const handleChange = (e) => {
    // if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
    //   var ele = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    //   if (ele.length === 8) {
    //     var cleaned = ('' + ele).replace(/[^a-zA-Z0-9]/g, '');
    //     var match = cleaned.match(/^(\d{2})(\d{6})$/);
    //     if (match) {
    //       setValue({
    //         ...value,
    //         [e.target.name]: match[1] + '-' + match[2]
    //       });
    //     }
    //   } else {
    //     ele = e.target.value.replace(/[^0-9]/g, '');
    //     setValue({ ...value, [e.target.name]: ele });

    //     if (ele.length === 0 && e.target.name === 'IncidentNumber') {
    //       setValue({ ...value, ['IncidentNumberTo']: "", [e.target.name]: ele });
    //     }
    //   }
    // } else {
    //   setValue({
    //     ...value,
    //     [e.target.name]: e.target.value
    //   });
    // }
    if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
      let ele = e.target.value.trim();
      setValue({ ...value, [e.target.name]: ele });
      if (ele.length === 0) {
        e.target.name === 'IncidentNumber' && setValue({
          ...value, ['IncidentNumberTo']: "", [e.target.name]: ele
        });
      }
    }
    else { setValue({ ...value, [e.target.name]: e.target.value }) }
  };

  const getAgencyImg = (LoginAgencyID) => {
    const val = { 'AgencyID': LoginAgencyID }
    fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
      if (res) {
        // console.log(res)
        let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
        setMultiImage(imgUrl);

      }
      else { console.log("errror") }
    })
  }

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

  const PropertyCategory = (CategoryID) => {
    const val = { CategoryID: CategoryID, }
    fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
      if (data) {
        setPropertyCategoryData(threeColArray(data, 'PropertyDescID', 'Description', 'CategoryID'))
      } else {
        setPropertyCategoryData([]);
      }
    })
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      if (name === 'SuspectedDrugTypeID') {
        setChangesStatus(true)
        setValue({
          ...value,
          [name]: e.value, 'SuspectedDrugType_Description': e.label, 'TypeMarijuana': '', 'MarijuanaNumber': '', '  ClandistineLabsNumber': '', 'DrugManufactured': '',
        });
      } else if (name === 'PropertyTypeID') {
        switch (e.id) {
          case 'A': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', '')); break;
          case 'B': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '1', '', '', '', '')); break;
          case 'S': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '1', '', '', '')); break;
          case 'O': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '1', '', '')); break;
          case 'D': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '1', '')); break;
          case 'G': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '', '1')); break;
          default: dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));;
        }
        PropertyCategory(e.value);
        setChangesStatus(true);
        setValue({ ...value, ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '', });
      } else if (name === 'CategoryID') {
        setChangesStatus(true)
        setValue({ ...value, [name]: e.value });
      }
      else {
        setChangesStatus(true)
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name === 'SuspectedDrugTypeID') {
        setChangesStatus(true)
        setValue({
          ...value,
          [name]: null
        });
      } else if (name === 'PropertyTypeID') {
        setChangesStatus(true);
        setValue({
          ...value,
          ['PropertyTypeID']: null, ['PropertyCategoryCode']: '', ['CategoryID']: null, ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '',
        });
        setPropertyCategoryData([]);
        dispatch({ type: Property_LossCode_Drp_Data, payload: [] });
      }
      else if (name === 'CategoryID') {
        setChangesStatus(true);
        setValue({ ...value, ['CategoryID']: null, ['ClassificationID']: null, });
      }

      else {
        setChangesStatus(true);
        setValue({ ...value, [name]: null });
      }
      void 0;
    }
  }

  const handleChange1 = (e) => {
    const { name, checked } = e.target;
    setValue(prevValue => ({
      ...prevValue,
      [name]: checked
    }));
  };
  //   const get_PropertyReport = async () => {
  //     setLoder(true);
  //     const { ReportedDtTm, ReportedDtTmTo, PropertyNumber, PropertyNumberTo, LastName, FirstName, MiddleName, ValueTo, ValueFrom, DispositionID, RecoveredDateTime, RecoveredDateTimeTo, ActivityType, ReceiveDate, ReceiveDateTo, location, PropertyTypeID, LossCodeID, InvestigatorID, } = value
  //     const isValid = isNotEmpty(ReportedDtTm) || isNotEmpty(ReportedDtTmTo) || isNotEmpty(ValueFrom) || isNotEmpty(ValueTo) || isNotEmpty(MiddleName) || isNotEmpty(FirstName) || isNotEmpty(LastName) || isNotEmpty(PropertyNumberTo) || isNotEmpty(PropertyNumber) || (LossCodeID !== null && LossCodeID !== '') || (ActivityType !== null && ActivityType.trim() !== '') || isNotEmpty(location) || isNotEmpty(ReceiveDateTo) || isNotEmpty(ReceiveDate) || isNotEmpty(DispositionID) || isNotEmpty(RecoveredDateTime) || isNotEmpty(RecoveredDateTimeTo) || (PropertyTypeID !== null && PropertyTypeID !== '') || (InvestigatorID !== null && InvestigatorID !== '');
  //     if (isValid) {
  //         const val = {
  //             'ReportedDtTm': ReportedDtTm, 'ReportedDtTmTo': ReportedDtTmTo,
  //             'LossCodeID': LossCodeID, 'PropertyNumber': PropertyNumber, 'PropertyNumberTo': PropertyNumberTo,
  //             'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'AgencyID': LoginAgencyID,
  //             'ValueTo': parseFloat(ValueTo) === 0 || parseFloat(ValueTo) < 0 ? '0.00' : parseFloat(ValueTo),
  //             'ValueFrom': parseFloat(ValueFrom) === 0 || parseFloat(ValueFrom) < 0 ? '0.00' : parseFloat(ValueFrom),
  //             'PropertyTypeID': PropertyTypeID,
  //             'ActivityType': ActivityType, 'ReceiveDate': ReceiveDate, 'ReceiveDateTo': ReceiveDateTo, 'location': location,
  //             'DispositionID': DispositionID, 'RecoveredDateTime': RecoveredDateTime, 'RecoveredDateTimeTo': RecoveredDateTimeTo,
  //             'InvestigatorID': InvestigatorID
  //         }
  //         try {
  //             const res = await fetchPostData('ReportProperty/GetData_ReportProperty', val);
  //             if (res.length > 0) {
  //                 setMasterReportData(res[0]);
  //                 setverifyReport(true);
  //                 getAgencyImg(LoginAgencyID)
  //                 setSearchValue(value);
  //                 setLoder(false);
  //             } else {
  //                 toastifyError("Data Not Available");
  //                 setverifyReport(false); setMasterReportData([]);
  //                 setLoder(false);

  //             }
  //         } catch (error) {
  //             toastifyError("Data Not Available");
  //             setverifyReport(false);
  //             setLoder(false);
  //         }

  //     } else {
  //         toastifyError("Please Enter Details");
  //         setLoder(false);
  //     }
  // }
  const get_ChainReport = async (isPrintReport = false) => {
    setLoder(true);
    if (value?.ReportedDate?.trim()?.length > 0 || value?.PropertyNumber?.trim()?.length > 0 || value?.PropertyNumberTo?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.OccurredFromTo?.trim()?.length > 0 || (value?.PropertyTypeID !== null && value?.PropertyTypeID != '') || (value?.CategoryID !== null && value?.CategoryID !== '') || (value?.IsStolen !== null && value?.IsStolen !== '') || (value?.IsDamaged !== null && value?.IsDamaged !== '') || (value?.IsRecovered !== null && value?.IsRecovered !== '')) {
      const {
        ReportedDate, ReportedDateTo, CategoryID, PropertyNumber, PropertyNumberTo, PropertyTypeID, IncidentNumber, IncidentNumberTo, OccurredFrom, OccurredFromTo, IsStolen, IsDamaged, IsRecovered,
        IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
      } = myStateRef.current;
      setDamagedStatus((value.IsDamaged ? true : false));
      setStolenStatus((value.IsStolen ? true : false));
      setRecoveredStatus((value.IsRecovered ? true : false));
      const val = {
        'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'CategoryID': CategoryID, 'PropertyNumber': PropertyNumber, 'PropertyNumberTo': PropertyNumberTo, 'PropertyTypeID': PropertyTypeID, 'AgencyID': loginAgencyID,
        'IncidentNumber': IncidentNumber,
        'IncidentNumberTo': IncidentNumberTo,
        'OccurredFrom': OccurredFrom,
        'OccurredFromTo': OccurredFromTo,
        'IsStolen': IsStolen, 'IsDamaged': IsDamaged, 'IsRecovered': IsRecovered,
        IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
      }
      try {
        const apiUrl = isPrintReport ? 'ReportProperty/PrintPropertyReport' : 'ReportPropertyRoom/GetData_ChainOfCustodyReport';
        const res = await fetchPostData(apiUrl, val);
        if (res.length > 0) {
          setMasterReportData(res[0]);
          setverifyReport(true);
          getAgencyImg(loginAgencyID)
          setSearchValue(value);
          setLoder(false);
        }
        else {
          if (!isPrintReport) {
            toastifyError("Data Not Available"); setverifyReport(false); setMasterReportData([]);
            setLoder(false);
          }
        }
        setIsPermissionsLoaded(false);
      } catch (error) {

        if (!isPrintReport) {
          toastifyError("Data Not Available");
        }
        setverifyReport(false);
        setLoder(false);
        setIsPermissionsLoaded(false);

      }

    } else {
      toastifyError("Please Enter Details");
      setLoder(false);

    }
  }

  const resetFields = () => {
    setValue({
      ...value,
      'PropertyTypeID': null, 'ReportedDate': "", 'ReportedDateTo': "", 'OccurredFrom': "", 'OccurredFromTo': "", 'PropertyNumber': '', 'PropertyNumberTo': '',
      'IncidentNumberTo': '', 'IncidentNumber': '', 'CategoryID': null, 'IsStolen': '', 'IsDamaged': '', 'IsRecovered': ''
    });
    setverifyReport(false); setMasterReportData([]); setShowWatermark('')

  }


  useEffect(() => {
    const handleKeyDown = async (event) => {
      if (event.key === 'Enter') {
        await dispatch(get_ScreenPermissions_Data("P105", localStoreData?.AgencyID, localStoreData?.PINID));
        setIsPermissionsLoaded(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);


  useEffect(() => {

    if (isPermissionsLoaded) {
      get_ChainReport()
    }
  }, [isPermissionsLoaded]);

  const myStateRef = React.useRef(value);


  useEffect(() => {
    myStateRef.current = value;
  }, [value])

  const [showFooter, setShowFooter] = useState(false);

  const handlePrintClick = () => {
    setShowFooter(true);
    setTimeout(() => {
      printForm(); get_ChainReport(true); setShowFooter(false);
    }, 100);
  };
  console.log("ISDamaged::", value?.IsDamaged)
  console.log("ISrecovered::", value?.IsRecovered)
  console.log("isStolen::", value?.IsStolen)

  function formatRawInput(value) {
    // Remove non-digit characters
    const cleaned = value?.replace(/\D/g, '');

    // MMddyyyy handling
    if (cleaned?.length === 8) {
      const mm = cleaned?.slice(0, 2);
      const dd = cleaned?.slice(2, 4);
      const yyyy = cleaned?.slice(4, 8);
      return `${mm}/${dd}/${yyyy}`;
    }

    return value;
  }


  return (
    <>
      <div class="section-body view_page_design pt-1" >
        <div className="row clearfix">
          <div className="col-12 col-sm-12">
            <div className="card Agency">
              <div className="card-body">
                <div className="col-12 col-md-12 col-lg-12  " >
                  <fieldset>
                    <legend>Chain Of Custody Report</legend>
                    <div className="form-check ml-2 col-9 col-md-9 col-lg-12 mt-1 pt-1 text-right">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="watermarkCheckbox"
                        checked={showWatermark}
                        onChange={(e) => setShowWatermark(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="watermarkCheckbox">
                        Print Confidential Report
                      </label>
                    </div>
                    <div className="row mt-2">
                      <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label'>Property # From</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                        <input type="text" name='PropertyNumber' id='PropertyNumber' style={{ textTransform: "uppercase" }} value={value?.PropertyNumber} maxLength={11} onChange={propertyhandle} className='' />
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                        <label htmlFor="" className='new-label'>Property # To</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                        <input type="text" name='PropertyNumberTo' style={{ textTransform: "uppercase" }} id='PropertyNumberTo' value={value?.PropertyNumberTo} maxLength={11} onChange={propertyhandle}
                          disabled={!value?.PropertyNumber?.trim()}
                          className={!value?.PropertyNumber?.trim() ? 'readonlyColor' : ''}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label'>Incident # From</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                        <input type="text" name='IncidentNumber' id='IncidentNumber' value={value.IncidentNumber} onChange={handleChange} className='' />
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                        <label htmlFor="" className='new-label'>Incident # To</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                        <input type="text" name='IncidentNumberTo'
                          // disabled={!value.IncidentNumber}
                          disabled={!value?.IncidentNumber?.trim()}
                          className={!value?.IncidentNumber?.trim() ? 'readonlyColor' : ''}
                          id='IncidentNumberTo' value={value.IncidentNumberTo} onChange={handleChange} />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label'>Reported From Date</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mb-1">
                        <DatePicker
                          name='ReportedDate'
                          id='ReportedDate'
                          ref={startRef}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null, ['ReportedDateTo']: null }) }}
                          selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                          onChangeRaw={(e) => {
                            const formatted = formatRawInput(e.target.value);
                            e.target.value = formatted;
                          }}
                          dateFormat="MM/dd/yyyy"
                          timeInputLabel
                          isClearable={value?.ReportedDate ? true : false}
                          // peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          autoComplete='Off'
                          // disabled
                          maxDate={new Date(datezone)}
                          placeholderText='Select...'
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                        <label htmlFor="" className='new-label'>Reported To Date</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mb-1">
                        <DatePicker
                          name='ReportedDateTo'
                          id='ReportedDateTo'
                          ref={startRef1}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                          selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                          onChangeRaw={(e) => {
                            const formatted = formatRawInput(e.target.value);
                            e.target.value = formatted;
                          }}
                          dateFormat="MM/dd/yyyy"
                          timeInputLabel
                          isClearable={value?.ReportedDateTo ? true : false}
                          // peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          autoComplete='Off'
                          // maxDate={new Date()}
                          placeholderText='Select...'
                          maxDate={new Date(datezone)}
                          minDate={new Date(value?.ReportedDate)}
                          disabled={value?.ReportedDate ? false : true}
                          className={!value?.ReportedDate && 'readonlyColor'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label'>Occurred From Date</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3">
                        <DatePicker
                          name='OccurredFrom'
                          id='OccurredFrom'
                          ref={startRef2}
                          onKeyDown={onKeyDown}
                          onChange={(date) => {
                            if (date) {
                              setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null })
                            } else {
                              setValue({ ...value, ['OccurredFrom']: null, ['OccurredFromTo']: null })
                            }
                          }}
                          selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                          onChangeRaw={(e) => {
                            const formatted = formatRawInput(e.target.value);
                            e.target.value = formatted;
                          }}
                          dateFormat="MM/dd/yyyy"
                          timeInputLabel
                          isClearable={value?.OccurredFrom ? true : false}
                          // peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          autoComplete='Off'
                          // disabled
                          maxDate={new Date(datezone)}
                          placeholderText='Select...'
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                        <label htmlFor="" className='new-label'>Occurred To Date</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3">
                        <DatePicker
                          id='OccurredFromTo'
                          name='OccurredFromTo'
                          ref={startRef3}
                          onKeyDown={onKeyDown}
                          onChange={(date) => { setValue({ ...value, ['OccurredFromTo']: date ? getShowingMonthDateYear(date) : null }) }}
                          dateFormat="MM/dd/yyyy"
                          isClearable={value?.OccurredFromTo ? true : false}
                          // disabled={value?.OccurredFrom ? false : true}
                          selected={value?.OccurredFromTo && new Date(value?.OccurredFromTo)}
                          onChangeRaw={(e) => {
                            const formatted = formatRawInput(e.target.value);
                            e.target.value = formatted;
                          }}
                          minDate={new Date(value?.OccurredFrom)}
                          maxDate={new Date(datezone)}
                          placeholderText={'Select...'}
                          showDisabledMonthNavigation
                          autoComplete="off"
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                          disabled={value?.OccurredFrom ? false : true}
                          className={!value?.OccurredFrom && 'readonlyColor'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label'>Type</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-1" >
                        <Select
                          styles={customStylesWithOutColor}
                          name='PropertyTypeID'
                          value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                          options={propertyTypeData}
                          onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                          isClearable
                          placeholder="Select..."
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                        <label htmlFor="" className='new-label'>Category</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-3 mt-1" >
                        <Select
                          name='CategoryID'
                          id='CategoryID'
                          styles={customStylesWithOutColor}
                          value={propertyCategoryData?.filter((obj) => obj.value === value?.CategoryID)}
                          options={propertyCategoryData}
                          onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                          isClearable
                          placeholder="Select..."
                          isDisabled={!value?.PropertyTypeID}
                          className={!value?.PropertyTypeID ? 'readonlyColor' : ''}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-2"></div>
                      <div className="col-6 col-md-6 col-lg-2 mt-3 mb-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="IsStolen"
                            checked={value?.IsStolen || false}
                            onChange={handleChange1}
                            id="flexCheckStolen"
                          />
                          <label className="form-check-label" htmlFor="flexCheckStolen">
                            Stolen
                          </label>
                        </div>
                      </div>
                      <div className="col-6 col-md-6 col-lg-2 mt-3 mb-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="IsRecovered"
                            checked={value?.IsRecovered || false}
                            onChange={handleChange1}
                            id="flexCheckRecovered"
                          />
                          <label className="form-check-label" htmlFor="flexCheckRecovered">
                            Recovered
                          </label>
                        </div>
                      </div>
                      {/* <div className="col-6 col-md-6 col-lg-2 mt-3 mb-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="Towed"
                            checked={value?.Towed || false}
                            onChange={handleChange1}
                            id="flexCheckTowed"
                          />
                          <label className="form-check-label" htmlFor="flexCheckTowed">
                            Towed
                          </label>
                        </div>
                      </div> */}
                      <div className="col-6 col-md-6 col-lg-2 mt-3 mb-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="IsDamaged"
                            checked={value?.IsDamaged || false}
                            onChange={handleChange1}
                            id="flexCheckDamaged"
                          />
                          <label className="form-check-label" htmlFor="flexCheckDamaged">
                            Damaged
                          </label>
                        </div>
                      </div>
                    </div>

                  </fieldset>
                  <div className="col-12 col-md-12 col-lg-12 text-right mt-1">
                    {/* <button className="btn btn-sm bg-green text-white px-2 py-1"
                      onClick={() => { get_ChainReport(); }}>Show Report</button> */}
                    {
                      effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                        <button className="btn btn-sm bg-green text-white px-2 py-1"
                          onClick={() => { get_ChainReport(false); }}>Show Report</button>
                        : <></> :
                        <button className="btn btn-sm bg-green text-white px-2 py-1"
                          onClick={() => { get_ChainReport(false); }}>Show Report</button>
                    }
                    {/* <Link to={'/Reports'}>
                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                      </Link> */}
                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields(); }}>Clear</button>
                    <Link to={'/Reports'}>
                      <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          verifyReport ?

            masterReportData?.Property?.length > 0 ?
              <>
                <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
                  <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Chain Of Custody Report</p>
                    <div style={{ marginLeft: 'auto' }}>
                      <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                        {/* <i className="fa fa-print"></i> */}
                        <i className="fa fa-print" onClick={handlePrintClick}></i>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="container mt-1" >
                  <div className="col-12" >
                    <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }} >
                      <>
                        <ReportAddress {...{ multiImage, masterReportData }} />
                        {showWatermark && (
                          <div className="watermark-print">Confidential</div>
                        )}
                        {/* <div className="col-4 col-md-3 col-lg-2 pt-1 ml-3">
                        <div className="main">
                          <div className="img-box" >
                            <img src={multiImage} className='' style={{ marginTop: '4px', width: '150px', height: '150px' }} />
                          </div>
                        </div>
                      </div> */}
                        {/* <div className="col-7  col-md-7 col-lg-9 mt-2">
                        <div className="main">
                          <h5 className='text-dark text-bold'>{masterReportData?.Agency_Name}</h5>
                          <p className='text-p'>Address: <span className='new-span pl-2'>{masterReportData?.Agency_Address1}</span></p>
                          <div className='d-flex '>
                            <p className='text-p'>State: <span className='new-span ml-2'>{masterReportData?.StateName}</span>
                            </p>
                            <p className='text-p ml-5 pl-1'>City: <span className='new-span'>{masterReportData?.CityName}</span>
                            </p>
                            <p className='text-p ml-2'>Zip: <span className='new-span'>{masterReportData?.Zipcode}</span>
                            </p>
                          </div>
                          <div className='d-flex'>
                            <p className='text-p'>Phone: <span className='new-span'>{masterReportData?.Agency_Phone}</span></p>
                          </div>
                        </div>
                      </div> */}
                        {/* <div className="col-7 col-md-7 col-lg-9 mt-2">
                        <div className="main">
                          <h5 className='text-dark font-weight-bold'>{masterReportData?.Agency_Name}</h5>
                          <p className='text-p'>Address: <span className='text-address'>{masterReportData?.Agency_Address1}</span></p>
                          <div className='d-flex justify-content-start flex-wrap'>
                            <p className='text-p'>City: <span className='text-gray ml-2'>{masterReportData?.CityName}</span></p>
                            <p className='text-p mb-1 ml-3'>State: <span className='text-gray'>{masterReportData?.StateName}</span></p>
                            <p className='text-p mb-1 ml-3'>Zip: <span className='text-gray'>{masterReportData?.Zipcode}</span></p>
                          </div>
                          <div className='d-flex justify-content-start flex-wrap'>
                            <p className='text-p mb-1'>Phone: <span className='text-gray ml-1'>{masterReportData?.Agency_Phone}</span></p>
                            <p className='text-p mb-1 ml-4'>Fax: <span className='text-gray'>{masterReportData?.Agency_Fax}</span></p>
                          </div>
                        </div>
                      </div> */}

                      </>
                      <div className="col-12">
                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                        <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Chain Of Custody Report</h5>
                      </div>
                      <div className="col-12">
                        <fieldset>
                          <legend>Search Criteria</legend>
                          <div className="row">

                            {stolenStatus ? <div className="col-6 col-md-6 col-lg-2 mt-3 mb-1">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="IsStolen"
                                  checked={true}

                                  id="flexCheckStolen"
                                />
                                <label className="form-check-label" htmlFor="flexCheckStolen">
                                  Stolen
                                </label>
                              </div>
                            </div> : null}
                            {recoveredStatus ? <div className="col-6 col-md-6 col-lg-2 mt-3 mb-1">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="IsRecovered"
                                  checked={true}

                                  id="flexCheckRecovered"
                                />
                                <label className="form-check-label" htmlFor="flexCheckRecovered">
                                  Recovered
                                </label>
                              </div>
                            </div> : null}
                            {damagedStatus ? <div className="col-6 col-md-6 col-lg-2 mt-3 mb-1">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name="IsDamaged"
                                  checked={true}

                                  id="flexCheckDamaged"
                                />
                                <label className="form-check-label" htmlFor="flexCheckDamaged">
                                  Damaged
                                </label>
                              </div>
                            </div> : null}
                          </div>
                          {/* <div className="col-6 col-md-6 col-lg-2 mt-3 mb-1">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="Towed"
                            checked={value?.Towed || false}
                            onChange={handleChange1}
                            id="flexCheckTowed"
                          />
                          <label className="form-check-label" htmlFor="flexCheckTowed">
                            Towed
                          </label>
                        </div>
                      </div> */}



                          <div className="row">

                            {showFields.showPropertyNumber && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Property Number From</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor' value={searchValue.PropertyNumber || ''} readOnly />
                                </div>
                              </>
                            )}

                            {showFields.showPropertyNumberTo && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Property Number To</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor' value={searchValue.PropertyNumberTo || ''} readOnly />
                                </div>
                              </>
                            )}
                            {showFields.showIncidentNumber && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Incident Number From</label>

                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor' value={searchValue.IncidentNumber || ''} readOnly />
                                </div>
                              </>
                            )}
                            {showFields.showIncidentNumberTo && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Incident Number To</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor' value={searchValue.IncidentNumberTo || ''} readOnly />
                                </div>
                              </>
                            )}
                            {showFields.showReportedDate && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Reported From Date</label>

                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor' value={searchValue.ReportedDate && getShowingWithOutTime(searchValue.ReportedDate)} readOnly />
                                </div>
                              </>
                            )}
                            {showFields.showReportedDateTo && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Reported To Date</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor' value={searchValue.ReportedDateTo && getShowingWithOutTime(searchValue.ReportedDateTo)} readOnly />
                                </div>
                              </>
                            )}
                            {showFields.showOccurredFrom && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Occurred From Date</label>

                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor'
                                    //  value={searchValue.OccurredDate || ''}
                                    value={searchValue.OccurredDate && getShowingWithOutTime(searchValue.OccurredDate)}
                                    readOnly />
                                </div>
                              </>
                            )}
                            {showFields.showOccurredFromTo && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Occurred To Date</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor'
                                    //  value={searchValue.OccurredDateTo || ''}
                                    value={searchValue.OccurredDateTo && getShowingWithOutTime(searchValue.OccurredDateTo)}

                                    readOnly
                                  />
                                </div>
                              </>
                            )}

                            {showFields.showPropertyTypeID && searchValue.PropertyTypeID && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Type</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor' value={propertyTypeData.find((obj) => obj.value === searchValue.PropertyTypeID)?.label || ''} readOnly />
                                </div>
                              </>
                            )}
                            {showFields.showCategoryID && searchValue.CategoryID && (
                              <>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                  <label className='new-label'>Category</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                  <input type="text" className='readonlyColor' value={propertyCategoryData.find((obj) => obj.value === searchValue.CategoryID)?.label || ''} readOnly />
                                </div>
                              </>
                            )}
                          </div>
                        </fieldset>
                      </div>
                      {
                        masterReportData?.Property?.length > 0 ?
                          <>
                            {
                              masterReportData?.Property?.map((obj) => (

                                <>
                                  <div className="container-fluid" style={{ pageBreakAfter: 'always' }}>
                                    <h5 className=" text-white text-bold bg-green text-center py-1 px-3">Evidence Property Information</h5>
                                    <div className="table-responsive" >
                                      <table className="table table-bordered" >
                                        <tbody>
                                          <tr>
                                            <td colSpan={4}>
                                              <h6 className='text-dark text-bold'>Property Number:</h6>
                                              <p className='text-list'>{obj?.PropertyNumber}</p>
                                            </td>
                                            <td colSpan={4}>
                                              <h6 className='text-dark text-bold'>Property Type</h6>
                                              <p className='text-list'>{obj?.PropertyType}</p>
                                            </td>
                                            <td colSpan={4}>
                                              <h6 className='text-dark text-bold'>Reported Date/Time:</h6>
                                              <p className='text-list'>{obj?.ReportedDtTm ? getShowingDateText(obj?.ReportedDtTm) : null}</p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td colSpan={12}>
                                              <h6 className='text-dark text-bold'>Reason Code:</h6>
                                              <p className='text-list'>{obj?.LossCode_Description}</p>
                                            </td>
                                          </tr>
                                          {obj.PropertyType === "Article" && (
                                            <>
                                              <tr>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Serial No:</h6>
                                                  <p className='text-list'>{obj?.SerialID}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Model:</h6>
                                                  <p className='text-list'>{obj?.ModelID}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>OAN:</h6>
                                                  <p className='text-list'>{obj?.OAN}</p>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Quantity:</h6>
                                                  <p className='text-list'>{obj?.Quantity}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Brand:</h6>
                                                  <p className='text-list'>{obj?.Brand}</p>
                                                </td>

                                              </tr>
                                              <tr>
                                                <td colSpan={6}>
                                                  <h6 className='text-dark text-bold'>Top Color:</h6>
                                                  <p className='text-list'>{obj?.ArticleTopColor}</p>
                                                </td>
                                                <td colSpan={6}>
                                                  <h6 className='text-dark text-bold'>Bottom Color</h6>
                                                  <p className='text-list'>{obj?.ArticleBottomColor}</p>
                                                </td>
                                              </tr>

                                            </>
                                          )}
                                          {obj.PropertyType === "Boat" && (
                                            <>
                                              <tr>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'> Registration No:</h6>
                                                  <p className='text-list'>{obj?.RegNumber}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>HIN:</h6>
                                                  <p className='text-list'>{obj?.HIN}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Expiry Year:</h6>
                                                  <p className='text-list'>{obj?.BoatWidth}</p>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'> Make:</h6>
                                                  <p className='text-list'>{obj?.Make_Description}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Model:</h6>
                                                  <p className='text-list'>{obj?.BoatModelID}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Manu. Year:</h6>
                                                  <p className='text-list'>{obj?.ManufactureYear}</p>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>VOD:</h6>
                                                  <p className='text-list'>{obj?.VODID}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Propulsion:</h6>
                                                  <p className='text-list'>{obj?.Propulusion_Description}</p>
                                                </td>
                                                <td colSpan={4}>
                                                  <h6 className='text-dark text-bold'>Material</h6>
                                                  <p className='text-list'>{obj?.MaterialID}</p>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td colSpan={6}>
                                                  <h6 className='text-dark text-bold'>Top Color:</h6>
                                                  <p className='text-list'>{obj?.BoatTopColor}</p>
                                                </td>
                                                <td colSpan={6}>
                                                  <h6 className='text-dark text-bold'>Bottom Color</h6>
                                                  <p className='text-list'>{obj?.BottomColor_Description}</p>
                                                </td>
                                              </tr>

                                            </>
                                          )}
                                          <tr>
                                            <td colSpan={6}>
                                              <h6 className='text-dark text-bold'>Owner Name:</h6>
                                              <p className='text-list'>{obj?.OwnerNameOther}</p>
                                            </td>
                                            <td colSpan={6}>
                                              <h6 className='text-dark text-bold'>Incident Number</h6>
                                              <p className='text-list'>{obj?.IncidentNumber}</p>
                                            </td>

                                          </tr>
                                          <tr>
                                            <td colSpan={6}>
                                              <h6 className='text-dark text-bold'>Category:</h6>
                                              <p className='text-list'>{obj?.Category_Description}</p>
                                            </td>
                                            <td colSpan={6}>
                                              <h6 className='text-dark text-bold'>Classification</h6>
                                              <p className='text-list'>{obj?.PropertyClassification_Description}</p>
                                            </td>
                                          </tr>

                                          <tr>
                                            <td colSpan={12}>
                                              <h6 className='text-dark text-bold'>Misc.Description:</h6>
                                              <p className='text-list'>{obj?.Description}</p>
                                            </td>
                                          </tr>

                                        </tbody>
                                      </table>
                                    </div>
                                    {
                                      JSON.parse(obj?.ChainOfCustody)?.length > 0 ?
                                        <>
                                          <div className="table-responsive" >
                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                              <p className="p-0 m-0 d-flex align-items-center"> Chain of Custody Information:</p>
                                            </div>

                                            <table className="table " >
                                              <thead className='text-dark master-table'>
                                                <tr>
                                                  <th className='' style={{ width: '100px' }}>Property Number</th>
                                                  <th className='' style={{ width: '100px' }}>Activity Date/Time</th>
                                                  <th className='' style={{ width: '100px' }}>Activity Type</th>
                                                  <th className='' style={{ width: '100px' }}>Officer</th>
                                                  <th className='' style={{ width: '100px' }}>Property Room Person</th>
                                                  <th className='' style={{ width: '100px' }}>Location</th>
                                                </tr>
                                              </thead>
                                              <tbody >
                                                {
                                                  JSON.parse(obj?.ChainOfCustody)?.map((item, key) => (
                                                    <>
                                                      <tr key={key} >
                                                        <td className='text-list' style={{ width: '100px' }}>{item.PropertyNumber}</td>
                                                        <td className='text-list' style={{ width: '100px' }}>{item?.ReceiveDate ? getShowingDateText(item?.ReceiveDate) : null}</td>
                                                        <td className='text-list' style={{ width: '100px' }}>{item.ActivityType}</td>
                                                        <td className='text-list' style={{ width: '100px' }}>{item.Officer_Name}</td>
                                                        <td className='text-list' style={{ width: '100px' }}>{item.RoomPerson}</td>
                                                        <td className='text-list' style={{ width: '100px' }}>{item.location}</td>

                                                      </tr>
                                                    </>
                                                  ))
                                                }
                                              </tbody>
                                            </table>
                                          </div>
                                        </>
                                        :
                                        <>
                                        </>
                                    }

                                  </div>

                                </>
                              ))
                            }

                          </>
                          :
                          <>
                          </>
                      }
                      {showFooter && (
                        <div className="print-footer">
                          <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </>
              :
              <>
              </>
            :
            <>
            </>
        }
      </div>
      {loder && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}

    </>
  )
}

export default ChainOfCustodyReport