import { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { base64ToString, filterPassedTime, getShowingMonthDateYear, Requiredcolour, } from "../../Common/Utility";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_AgencyOfficer_Data, } from "../../../redux/actions/DropDownsData";
import { Comman_changeArrayFormat, } from "../../Common/ChangeArrayFormat";
import { RequiredFieldIncident } from "../Utility/Personnel/Validation";
import { AgencyContext } from "../../../Context/Agency/Index";
import { AddDeleteUpadate, fetchPostData, PropertyRoomInsert } from "../../hooks/Api";
import { toastifyError, toastifySuccess } from "../../Common/AlertMsg";
import TreeModelPL from "./TreeModelPL";
import { useReactToPrint } from "react-to-print";


const CadPropertyModel = (props) => {

  const { modelActivityStatus, DecPropID, DecMPropID, setModalType, SetQueData, selectedReportType, getIncidentSearchData, modalType, masterModalRef, setAllProRoomFilterData, rowData, getIncidentSearchDataProperty, setDataSaved, SelectedCategory, CallStatus, ProType, ProNumber, ProTransfer, CheckboxStatus, ProCategory, taskListID, modalOpenStatus, setModalOpenStatus } = props
  const { GetDataTimeZone, datezone, } = useContext(AgencyContext);
  const componentRef = useRef();

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  var IncNo = query?.get("IncNo");
  var IncSta = query?.get("IncSta");
  var MProId = query?.get('MProId');
  var ProSta = query?.get('ProSta');
  let MstPage = query?.get('page');

  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));


  const [selectedFiles, setSelectedFiles] = useState([]);
  // date 
  const [expecteddate, setExpecteddate] = useState();
  const [courtdate, setCourtdate] = useState('');
  const [releasedate, setreleasedate] = useState('');
  const [destroydate, setdestroydate] = useState('');
  // dropdown
  const [loginAgencyID, setloginAgencyID] = useState('');
  const [loginPinID, setloginPinID,] = useState('');
  const [activitydate, setactivitydate] = useState();

  const [reasonIdDrp, setReasonIdDrp] = useState([]);
  const [propertyId, setPropertyId] = useState('');
  const [possessionID, setPossessionID] = useState('');
  // checkbox states
  let [selectedOption, setSelectedOption] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  // functionality states
  const [propertyNumber, setPropertyNumber] = useState('');
  const [toggleClear, setToggleClear] = useState(false);
  const [locationPath, setLocationPath] = useState();
  const [locationStatus, setlocationStatus] = useState(false);
  const [proRoom] = useState('PropertyRoom');
  const [searchStoStatus, setSearchStoStatus] = useState();
  const [shouldPrintForm, setShouldPrintForm] = useState(false);
  const [transferdate, settransferdate] = useState();
  const closeButtonRef = useRef(null); // at the top of your component
  const [selectedOptionInternal, setselectedOptionInternal] = useState('IsInternalTransfer');
  const [storagetype, setstoragetype] = useState();
  const [editval, setEditval] = useState([]);

  // modal open state
  const [keyChange, setKeyChange] = useState("");

  const fileInputRef = useRef(null)

  const [value, setValue] = useState({
    'PropertyID': '', 'MasterPropertyId': '', 'ActivityType': '', 'ActivityReasonID': '', 'IsInternalTransfer': true, 'IsExternalTransfer': false, 'ExpectedDate': '', 'ActivityComments': '', 'OtherPersonNameID': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
    'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
    'IsCheckIn': (modelActivityStatus === "CheckIn"), 'IsCheckOut': false, 'IsRelease': false, 'IsDestroy': false, 'IsTransferLocation': false, 'IsUpdate': false, 'CreatedByUserFK': '', 'AgencyID': '', 'EvidenceType': '',
    'PropertyTypeID': '', 'LastSeenDtTm': '', 'PackagingDetails': '', 'ReleasingOfficerID': '', ' ReceipentOfficerID': '', 'ReceipentID': '', 'DestructionOfficerID': '', 'ApprovalOfficerID': '', 'WitnessID': '', 'TransferDate': '', 'UpdatingOfficerID': '', 'DestinationStorageLocation': '', 'CurrentStorageLocation': '',
  })

  const [errors, setErrors] = useState({
    'ReasonError': '', 'UpdateDateTimeError': '', 'TransferDateTimeError': '', 'WitnessError': '', 'ApprovalOfficerError': '', 'UpdatingOfficerError': '', 'DestructionOfficerError': '', 'DestructionDateTimeError': '', 'ReleasedDateTimeError': '',
    'ReleasingOfficerError': '', 'ExpectedReturnDateTimeError': '', 'CheckOutDateTimeError': '', 'SubmittingOfficerError': '', 'CheckInDateTimeError': '', 'PropertyRoomOfficerError': '', 'StorageLocationError': '',
  })

  


  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }
  useEffect(() => {
    
    const normalizedActivityStatus = modelActivityStatus.trim(); 
    const transferLocation = "Transfer Location";  

    const isTransferLocation = normalizedActivityStatus === transferLocation; 
    setValue((prev) => {
      const newState = {
        ...prev,
        IsCheckIn: normalizedActivityStatus === "CheckIn",
        IsCheckOut: normalizedActivityStatus === "CheckOut",
        IsRelease: normalizedActivityStatus === "Release",
        IsDestroy: normalizedActivityStatus === "Destroy",
        IsTransferLocation: isTransferLocation,  // Correctly set IsTransferLocation
        IsUpdate: normalizedActivityStatus === "Update",
      };
      return newState;
    });

    // Update the selectedOption state
    setSelectedOption(modelActivityStatus);

  }, [modelActivityStatus, modalOpenStatus]);
  useEffect(() => {
    console.log('Updated value state:', value);
  }, [value]);



  useEffect(() => {
    if (localStoreData) {
      setloginAgencyID(localStoreData?.AgencyID);
      setloginPinID(localStoreData?.PINID);
      setPropertyId(DecPropID);
      if (!CheckboxStatus) {
        sessionStorage.removeItem('selectedRows');
      }

      if (CallStatus === 'true') {
      } else if (CallStatus === 'false' && (ProType && ProNumber)) {
      }
      // setValue({ ...value, 'PropertyTypeID': parseInt(ProNumber), 'ActivityType': ProTransfer })
      GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [localStoreData, ProType, ProNumber, CallStatus, DecPropID, SelectedCategory, propertyTypeData, ProTransfer]);


  useEffect(() => {
    // setValue({ ...value, ['PropertyRoomPersonNameID']: parseInt(possessionID), })
  }, [possessionID, loginPinID]);





  useEffect(() => {
    if (loginAgencyID && selectedOption) {
      GetActivityReasonDrp(loginAgencyID);
    }
    GetActivityReasonDrp(loginAgencyID);
  }, [loginAgencyID, selectedOption]);




  // useEffect(() => {
  //   if (possessionID) { setValue({ ...value, ['PropertyRoomPersonNameID']: parseInt(possessionID) }) }
  // }, [possessionID]);





  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    const { value: selectedOption } = event.target;
    setValue(prevState => ({
      ...prevState,
      IsCheckIn: selectedOption === 'CheckIn',
      IsCheckOut: selectedOption === 'CheckOut',
      IsRelease: selectedOption === 'Release',
      IsDestroy: selectedOption === 'Destroy',
      IsTransferLocation: (selectedOption === 'Transfer Location' || selectedOption === 'TransferLocation'),
      IsUpdate: selectedOption === 'Update',
    }));

    setErrors({
      ...errors,
      'ReasonError': '', 'UpdateDateTimeError': '', 'TransferDateTimeError': '', 'WitnessError': '', 'ApprovalOfficerError': '', 'UpdatingOfficerError': '', 'DestructionOfficerError': '', 'DestructionDateTimeError': '', 'ReleasedDateTimeError': '',
      'ReceipientError': '', 'ReleasingOfficerError': '', 'ExpectedReturnDateTimeError': '', 'CheckOutDateTimeError': '', 'SubmittingOfficerError': '', 'CheckInDateTimeError': '', 'PropertyRoomOfficerError': ''
    })
  };




  const check_Validation_Error = (e) => {

    const ReasonError = RequiredFieldIncident(value.ActivityReasonID);
    // const PropertyRoomOfficerError = !value.IsCheckOut ? RequiredFieldIncident(value.OfficerNameID) : 'true';
    const StorageLocationError = value.IsCheckIn ? RequiredFieldIncident(value.location) : 'true';
    const PropertyRoomOfficerError = value.IsTransferLocation || value.IsRelease || value.IsDestroy || value.IsUpdate ? RequiredFieldIncident(value.OfficerNameID) : 'true';
    const NewStorageLocationError = value.IsTransferLocation ? RequiredFieldIncident(value.DestinationStorageLocation) : 'true'
    const CheckInDateTimeError = value.IsCheckIn ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';
    const SubmittingOfficerError = value.IsCheckIn ? RequiredFieldIncident(value.InvestigatorID) : 'true';
    const CheckOutDateTimeError = value.IsCheckOut ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';
    const ExpectedReturnDateTimeError = value.IsTransferLocation && value.IsExternalTransfer ? RequiredFieldIncident(value.ExpectedDate) : 'true';
    const ReleasingOfficerError = (value.IsRelease || value.IsCheckOut) ? RequiredFieldIncident(value.ReleasingOfficerID) : 'true';
    // const ReceipientError = value.IsRelease ? RequiredFieldIncident(value.ReceipentID) : 'true';
    const ReleasedDateTimeError = value.IsRelease ? RequiredFieldIncident(value.ReleaseDate) : 'true';
    const DestructionDateTimeError = value.IsDestroy ? RequiredFieldIncident(value.DestroyDate) : 'true';
    // const DestructionDateTimeError = 'true';
    const DestructionOfficerError = value.IsDestroy ? RequiredFieldIncident(value.DestructionOfficerID) : 'true';
    const UpdatingOfficerError = value.IsUpdate ? RequiredFieldIncident(value.UpdatingOfficerID) : 'true';
    const ApprovalOfficerError = (value.IsDestroy || value.IsTransferLocation || value.IsUpdate) ? RequiredFieldIncident(value.ApprovalOfficerID) : 'true';
    const WitnessError = value.IsDestroy ? RequiredFieldIncident(value.WitnessID) : 'true';
    const TransferDateTimeError = value.IsTransferLocation ? RequiredFieldIncident(value.TransferDate) : 'true';
    const UpdateDateTimeError = (value.IsUpdate) ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';

    // const StorageLocationError = value.IsCheckIn ? RequiredFieldIncident(value.location) : 'true';

    setErrors(prevValues => {

      return {
        ...prevValues,
        ['ReasonError']: ReasonError || prevValues['ReasonError'],
        ['PropertyRoomOfficerError']: PropertyRoomOfficerError || prevValues['PropertyRoomOfficerError'],
        ['CheckInDateTimeError']: CheckInDateTimeError || prevValues['CheckInDateTimeError'],
        ['SubmittingOfficerError']: SubmittingOfficerError || prevValues['SubmittingOfficerError'],
        ['CheckOutDateTimeError']: CheckOutDateTimeError || prevValues['CheckOutDateTimeError'],
        ['ExpectedReturnDateTimeError']: ExpectedReturnDateTimeError || prevValues['ExpectedReturnDateTimeError'],
        ['ReleasingOfficerError']: ReleasingOfficerError || prevValues['ReleasingOfficerError'],
        // ['ReceipientError']: ReceipientError || prevValues['ReceipientError'],
        ['ReleasedDateTimeError']: ReleasedDateTimeError || prevValues['ReleasedDateTimeError'],
        ['DestructionDateTimeError']: DestructionDateTimeError || prevValues['DestructionDateTimeError'],
        ['DestructionOfficerError']: DestructionOfficerError || prevValues['DestructionOfficerError'],
        ['UpdatingOfficerError']: UpdatingOfficerError || prevValues['UpdatingOfficerError'],
        ['ApprovalOfficerError']: ApprovalOfficerError || prevValues['ApprovalOfficerError'],
        ['WitnessError']: WitnessError || prevValues['WitnessError'],
        ['TransferDateTimeError']: TransferDateTimeError || prevValues['TransferDateTimeError'],
        ['UpdateDateTimeError']: UpdateDateTimeError || prevValues['UpdateDateTimeError'],

        ['StorageLocationError']: StorageLocationError || prevValues['StorageLocationError'],
        ['NewStorageLocationError']: NewStorageLocationError || prevValues['NewStorageLocationError'],
      }
    })
  }
  const { ReasonError, PropertyRoomOfficerError, CheckInDateTimeError, StorageLocationError, NewStorageLocationError, SubmittingOfficerError, CheckOutDateTimeError, ExpectedReturnDateTimeError, ReleasingOfficerError, ReleasedDateTimeError,
    DestructionDateTimeError, DestructionOfficerError, UpdatingOfficerError, ApprovalOfficerError, WitnessError, TransferDateTimeError, UpdateDateTimeError, } = errors

  useEffect(() => {

    if (ReasonError === 'true' && PropertyRoomOfficerError === 'true' && NewStorageLocationError === 'true' && StorageLocationError === 'true' && CheckInDateTimeError === 'true' && SubmittingOfficerError === 'true' && CheckOutDateTimeError === 'true' && ExpectedReturnDateTimeError === 'true' && ReleasingOfficerError === 'true' && ReleasedDateTimeError === 'true'
      && DestructionDateTimeError === 'true' && DestructionOfficerError === 'true' && UpdatingOfficerError === 'true' && ApprovalOfficerError === 'true' && WitnessError === 'true' && TransferDateTimeError === 'true' && UpdateDateTimeError === 'true'
    ) {

      { Add_Type() }
    }
  }, [ReasonError, PropertyRoomOfficerError, CheckInDateTimeError, StorageLocationError, NewStorageLocationError, SubmittingOfficerError, CheckOutDateTimeError, ExpectedReturnDateTimeError, ReleasingOfficerError, ReleasedDateTimeError,
    DestructionDateTimeError, DestructionOfficerError, UpdatingOfficerError, ApprovalOfficerError, WitnessError, TransferDateTimeError, UpdateDateTimeError,
  ])


  const GetActivityReasonDrp = async (loginAgencyID) => {
    try {
      if (selectedOption === 'Transfer Location') {
        selectedOption = 'TransferLocation'
      }
      const val = { AgencyID: loginAgencyID, 'EvidenceReasonType': selectedOption };
      const data = await fetchPostData("PropertyEvidenceReason/GetDataDropDown_PropertyEvidenceReason", val);
      if (data) {
        setReasonIdDrp(Comman_changeArrayFormat(data, 'EvidenceReasonID', 'Description'))
      } else {
        setReasonIdDrp([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (loginAgencyID) {
      setValue({
        ...value,
        'IncidentID': propertyId, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'OtherPersonNameID': ''
      });
      if (agencyOfficerDrpData?.length === 0) {
        dispatch(get_AgencyOfficer_Data(loginAgencyID));
      }
    }
  }, [selectedOption, loginAgencyID]);


  const handleFileChange = (e) => {
    const files = e.target.files

    if (!files || files.length === 0) return
    const newFilesArray = Array.from(files)
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesArray])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles]
      updatedFiles.splice(index, 1)
      return updatedFiles
    })
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [name]: e.value
      })
    } else {
      setValue({
        ...value,
        [name]: null
      });

    }
  };

  useEffect(() => {
    if (localStoreData) {
      setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
      // if (selectedOption !== "CheckIn") {
      //   GetData_Propertyroom(MstPage === "MST-Property-Dash" ? rowData?.MasterPropertyID : rowData?.PropertyID, ProCategory, localStoreData?.AgencyID);
      // }

      GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [localStoreData, modalOpenStatus]);

  useEffect(() => {
      setEditval([]);
    if (rowData?.Activity !== "CheckIn") {
      GetData_Propertyroom(MstPage === "MST-Property-Dash" ? rowData?.MasterPropertyID : rowData?.PropertyID, ProCategory, loginAgencyID);
    }
  }, [modalOpenStatus]);




  const GetData_Propertyroom = async (DecPropID, category, loginAgencyID) => {
    try {
      const val1 = {
        'PropertyID': [DecPropID],
        'PropertyCategoryCode': category,
        'MasterPropertyID': 0,
        'AgencyId': loginAgencyID
      };
      const val2 = {
        'PropertyID': 0,
        'PropertyCategoryCode': category,
        'MasterPropertyID': DecPropID,
        'AgencyId': loginAgencyID
      };


      const res = await AddDeleteUpadate('Propertyroom/GetData_Propertyroom', MstPage === "MST-Property-Dash" ? val2 : val1);
      const parsedData = JSON.parse(res.data);


      if (parsedData.Table && parsedData.Table.length > 0) {
        setEditval(parsedData.Table[0]);

        // setcategoryStatus(parsedData.Table[0].Status);
        if (parsedData.Table[0].Status === 'Release' && shouldPrintForm === true) {
          await new Promise(resolve => setTimeout(resolve, 0));
          printForm();
          setShouldPrintForm(false);
        }
      } else {
        toastifyError('No Data Available');
      }
    } catch (error) {
    }
  };




  const printForm = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Data',
    onAfterPrint: () => { '' }
  })

  const Add_Type = () => {

    const formdata = new FormData();
    const PropertyID = rowData?.PropertyID;;
    const MasterPropertyId = rowData?.MasterPropertyID;
    const ActivityType = selectedOption
    const CreatedByUserFK = loginPinID;
    const AgencyId = loginAgencyID;
    const { ActivityReasonID, ExpectedDate, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate,
      CourtDate, ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId,
      IsCheckIn, IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, ReleasingOfficerID, ReceipentOfficerID, ReceipentID, DestructionOfficerID,
      ApprovalOfficerID, WitnessID, TransferDate, PackagingDetails, EvidenceType, UpdatingOfficerID, DestinationStorageLocation, CurrentStorageLocation
    } = value;
    const val = {
      PropertyID, ActivityType, ActivityReasonID, ExpectedDate, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate,
      CourtDate, ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId,
      MasterPropertyId, IsCheckIn, IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, CreatedByUserFK, AgencyId,
      ReleasingOfficerID, ReceipentOfficerID, ReceipentID, DestructionOfficerID, EvidenceType, PackagingDetails,
      ApprovalOfficerID, WitnessID, TransferDate, UpdatingOfficerID, DestinationStorageLocation, CurrentStorageLocation
    };


    const valuesArrayString = JSON.stringify([val]);
    for (let i = 0; i < selectedFiles?.length; i++) {
      formdata.append(`file`, selectedFiles[i]);
    }
    formdata.append("Data", valuesArrayString);

    PropertyRoomInsert('Propertyroom/PropertyroomInsert', formdata).then((res) => {
      if (!IsUpdate) {
        reset();
      }
      // setAllProRoomFilterData();
      // Delete_TaskList();

      // setModalType();
      // setDataSaved(true);
      // GetData_Propertyroom(MstPage === "MST-Property-Dash" ? DecMPropID : DecPropID, ProCategory, loginAgencyID);
      toastifySuccess(res.Message);

      if (selectedReportType === 'AllPropertyRoomStorage') {
        Delete_TaskList();
        setModalOpenStatus(false);
        // ✅ Close modal programmatically
        setModalOpenStatus(false);

        if (closeButtonRef.current) {
          closeButtonRef.current.click(); // Close modal by simulating user click
        }
        SetQueData();

        setTimeout(() => {
          getIncidentSearchData(localStoreData?.PINID);

        }, 600);

      }

      // setModalOpenStatus(false);
      // setModalType();
      // setDataSaved(true);
      // GetData_Propertyroom(MstPage === "MST-Property-Dash" ? DecMPropID : DecPropID, ProCategory, loginAgencyID);

      if (selectedReportType === 'all') {
        Delete_TaskList();
        setAllProRoomFilterData();
        setModalOpenStatus(false);
        setTimeout(() => {
          getIncidentSearchDataProperty(localStoreData?.PINID);
        }, 600)
      }




    }).catch((error) => {
      toastifyError(error.Message);
    })
  }

  const Delete_TaskList = () => {
    const val = { 'DeletedByUserFK': loginPinID, 'TaskListID': taskListID }
    AddDeleteUpadate('TaskList/Delete_TaskList', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
      } else { console.log("Somthing Wrong"); }
    }).catch((error) => {
      console.error("Error occurred:", error);
      toastifyError('Failed to Update Tasklist, Please try again.');
    })
  }



  const reset = () => {
    setValue({
      ...value,
      'PropertyID': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
      'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
      'MasterPropertyId': '', 'CreatedByUserFK': '', 'PropertyTypeID': '',
      'OtherPersonNameID': '', 'LastSeenDtTm': '', 'PackagingDetails': '', 'EvidenceType': '',
      'location': '',
      'IsCheckIn': '', 'PackagingDetails': '', 'IsCheckOut': '', 'IsRelease': '', 'IsDestroy': '', 'IsTransferLocation': '', 
    });
    setErrors({
      ...errors,
      'ReasonError': '', 'UpdateDateTimeError': '', 'TransferDateTimeError': '', 'WitnessError': '', 'ApprovalOfficerError': '', 'UpdatingOfficerError': '', 'DestructionOfficerError': '', 'DestructionDateTimeError': '', 'ReleasedDateTimeError': '',
      'ReleasingOfficerError': '', 'ExpectedReturnDateTimeError': '', 'CheckOutDateTimeError': '', 'SubmittingOfficerError': '', 'CheckInDateTimeError': '', 'PropertyRoomOfficerError': '', 'StorageLocationError': '',
    })
    setEditval([]);
    setSelectedOption(null);
    // setModalOpenStatus(false);
    //  if (closeButtonRef.current) {
    //           closeButtonRef.current.click(); // Close modal by simulating user click
    //         }
    setSelectedFiles([]);
    setCourtdate(''); setreleasedate(''); setdestroydate(''); setExpecteddate('');
    setSelectedStatus('');
    //  setSelectedOption('');
    setactivitydate('');
    setReasonIdDrp([]);
    setLocationPath('');
    setSelectedStatus('');
    setToggleClear(!toggleClear);
  }

   const resetdata = () => {
    setValue({
      ...value,
      'PropertyID': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
      'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
      'MasterPropertyId': '', 'CreatedByUserFK': '', 'PropertyTypeID': '',
      'OtherPersonNameID': '', 'LastSeenDtTm': '', 'PackagingDetails': '', 'EvidenceType': '',
      
      'location': ''
    });
    setErrors({
      ...errors,
      'ReasonError': '', 'UpdateDateTimeError': '', 'TransferDateTimeError': '', 'WitnessError': '', 'ApprovalOfficerError': '', 'UpdatingOfficerError': '', 'DestructionOfficerError': '', 'DestructionDateTimeError': '', 'ReleasedDateTimeError': '',
      'ReleasingOfficerError': '', 'ExpectedReturnDateTimeError': '', 'CheckOutDateTimeError': '', 'SubmittingOfficerError': '', 'CheckInDateTimeError': '', 'PropertyRoomOfficerError': '', 'StorageLocationError': '',
    })
    // setModalOpenStatus(false);
    //  if (closeButtonRef.current) {
    //           closeButtonRef.current.click(); // Close modal by simulating user click
    //         }
    setSelectedFiles([]);
    setCourtdate(''); setreleasedate(''); setdestroydate(''); setExpecteddate('');
    setSelectedStatus('');
    //  setSelectedOption('');
    setactivitydate('');
    setReasonIdDrp([]);
    setLocationPath('');
    setSelectedStatus('');
    setToggleClear(!toggleClear);
  }



  const handleChange = (event) => {
    const { name, value } = event.target;
    if (event) {
      setValue((prevState) => ({ ...prevState, [name]: value, }));
    }
    else {
      setValue((prevState) => ({ ...prevState, [name]: null, }));
    }
  };

  function handleClickedCleared(option) {
    setValue({
      ...value,
      [option]: '',
    });
  }

  const handleRadioChangeInner = (event) => {
    const selectedOption = event.target.value;
    // setselectedOptionInternal(selectedOption);

    // Set the specific state values based on the selected option
    setValue(prevState => ({
      ...prevState,
      IsInternalTransfer: selectedOption === 'IsInternalTransfer',
      IsExternalTransfer: selectedOption === 'IsExternalTransfer',
    }));
  };

  useEffect(() => {
    if (editval && selectedOption === 'Update') {
       setErrors({
      ...errors,
      'ReasonError': '', 'UpdateDateTimeError': '', 'TransferDateTimeError': '', 'WitnessError': '', 'ApprovalOfficerError': '', 'UpdatingOfficerError': '', 'DestructionOfficerError': '', 'DestructionDateTimeError': '', 'ReleasedDateTimeError': '',
      'ReleasingOfficerError': '', 'ExpectedReturnDateTimeError': '', 'CheckOutDateTimeError': '', 'SubmittingOfficerError': '', 'CheckInDateTimeError': '', 'PropertyRoomOfficerError': '', 'StorageLocationError': '',
    })
      setValue({
        ...value, PropertyID: editval?.PropertyID || '', ActivityType: editval?.ActivityType || '',

        ExpectedDate: editval?.ExpectedDate || '', ActivityComments: editval?.ActivityComments || '', OtherPersonNameID: editval?.OtherPersonNameID || '',
        PropertyRoomPersonNameID: editval?.PropertyRoomPersonNameID || '', ChainDate: editval?.ChainDate || '',
        DestroyDate: editval?.DestroyDate ? new Date(editval.DestroyDate) : '', CourtDate: editval?.CourtDate ? new Date(editval.CourtDate) : '', ReleaseDate: editval?.ReleaseDate ? new Date(editval.ReleaseDate) : '',
        PropertyTag: editval?.PropertyTag || '', RecoveryNumber: editval?.RecoveryNumber || '', StorageLocationID: editval?.StorageLocationID || '',
        ReceiveDate: editval?.ReceiveDate || '', OfficerNameID: editval?.OfficerNameID || '', InvestigatorID: editval?.InvestigatorID || '', location: editval?.location || '',
        activityid: editval?.activityid || '', EventId: editval?.EventId || '', MasterPropertyId: editval?.MasterPropertyId || '',
        CreatedByUserFK: editval?.CreatedByUserFK || '',
        IsUpdate : editval?.Status
      });

      dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
      GetActivityReasonDrp(loginAgencyID);
      setCourtdate(editval?.CourtDate ? new Date(editval.CourtDate) : null);
      setreleasedate(editval?.ReleaseDate ? new Date(editval.ReleaseDate) : null)
      setdestroydate(editval?.DestroyDate ? new Date(editval.DestroyDate) : null);


    } else if (editval && selectedOption === 'CheckOut' || editval && selectedOption === 'Release' || editval && selectedOption === 'Destroy' || editval && selectedOption === "Transfer Location" || editval && selectedOption === "Update") {
      
      setValue({
        ...value, PropertyID: editval?.PropertyID || '',
        StorageLocationID: editval?.StorageLocationID || '',
        location: editval?.location || '',

      });

    }
    else{
       setValue({
      ...value,
      'PropertyID': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
      'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
      'MasterPropertyId': '', 'CreatedByUserFK': '', 'PropertyTypeID': '',
      'OtherPersonNameID': '', 'LastSeenDtTm': '', 'PackagingDetails': '', 'EvidenceType': '',
      
    });
     setErrors({
      ...errors,
      'ReasonError': '', 'UpdateDateTimeError': '', 'TransferDateTimeError': '', 'WitnessError': '', 'ApprovalOfficerError': '', 'UpdatingOfficerError': '', 'DestructionOfficerError': '', 'DestructionDateTimeError': '', 'ReleasedDateTimeError': '',
      'ReleasingOfficerError': '', 'ExpectedReturnDateTimeError': '', 'CheckOutDateTimeError': '', 'SubmittingOfficerError': '', 'CheckInDateTimeError': '', 'PropertyRoomOfficerError': '', 'StorageLocationError': '',
    })
    
    }
  }, [editval, selectedOption]);

  

  return (
    modalOpenStatus &&
    <>

      <div class="modal" style={{ background: "rgba(0,0,0, 0.5)" }} ref={masterModalRef} id="MasterModalProperty" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
        <div class="modal-dialog  modal-dialog-centered  modal-xl">
          <div class="modal-content">
            <div className="model-header bg-light ml-3 py-2" style={{ fontWeight: 700 }}>Evidence Track</div>

            <div class="modal-body name-body-model">
              <div className="row " >
                <div className="col-12 col-md-12 col-lg-12 ">
                  <div className="row">
                    <div className="col-4 col-md-4 col-lg-2 ">
                      <div className="form-check  ">
                        <input className="form-check-input" type="radio" value="CheckIn" name="AttemptComplete" checked={value?.IsCheckIn} disabled={!value?.IsCheckIn}
                          id="flexRadioDefault" onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="flexRadioDefault">
                          Check In
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                      <div className="form-check  ">
                        <input className="form-check-input" type="radio" value="CheckOut" name="AttemptComplete" checked={value?.IsCheckOut} disabled={!value?.IsCheckOut}
                          onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                          Check Out
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                      <div className="form-check  ">
                        <input className="form-check-input" type="radio" value="Release" name="AttemptComplete" checked={value?.IsRelease} disabled={!value?.IsRelease}
                          onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="flexRadioDefault2 ">
                          Release
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                      <div className="form-check  ">
                        <input className="form-check-input" type="radio" value="Destroy" name="AttemptComplete" checked={value?.IsDestroy} disabled={!value?.IsDestroy}
                          onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="flexRadioDefault3">
                          Destroy
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                      <div className="form-check  ">
                        <input className="form-check-input" type="radio" value="TransferLocation" name="AttemptComplete" checked={value?.IsTransferLocation} disabled={!value?.IsTransferLocation}
                          onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="flexRadioDefault4">
                          Transfer Location
                        </label>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-1  pt-1 ">
                      <div className="form-check  ">
                        <input className="form-check-input" type="radio" value="Update" name="AttemptComplete" checked={value?.IsUpdate} disabled={!value?.IsUpdate}
                          onChange={handleRadioChange} />
                        <label className="form-check-label" htmlFor="flexRadioDefault5">
                          Update
                        </label>
                      </div>
                    </div>

                  </div>

                  <div className="div ">
                    {(selectedOption !== "CheckOut" && selectedOption !== "Release" && selectedOption !== "Destroy" && (value.IsTransferLocation === false || value.IsTransferLocation === 'false') && selectedOption !== "Update") && <div className='row align-items-center' style={{ rowGap: "8px" }}>
                      <div className="col-3 col-md-3 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Reason{errors.ReasonError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <Select
                          name='ActivityReasonID'
                          value={reasonIdDrp?.filter((obj) => obj.value === value?.ActivityReasonID)}
                          isClearable
                          options={reasonIdDrp}
                          onChange={(e) => ChangeDropDown(e, 'ActivityReasonID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Check in Date/Time{errors.CheckInDateTimeError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CheckInDateTimeError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <DatePicker
                          name='activitydate'
                          id='activitydate'
                          onChange={(date) => {
                            setactivitydate(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });

                          }}
                          isClearable={activitydate ? true : false}
                          selected={activitydate}
                          placeholderText={activitydate ? activitydate : 'Select...'}
                          dateFormat="MM/dd/yyyy HH:mm"
                          timeFormat="HH:mm "
                          is24Hour
                          timeInputLabel
                          showTimeSelect
                          timeIntervals={1}
                          timeCaption="Time"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          showDisabledMonthNavigation
                          autoComplete='off'
                          maxDate={new Date(datezone)}
                          disabled={selectedOption === null || selectedOption === ''}
                          className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                        />

                      </div>
                      <div className="col-3 col-md-3 col-lg-2  ">
                        <label htmlFor="" className='new-label px-0  mb-0'>Submitting Officer{errors.SubmittingOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SubmittingOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='InvestigatorID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.InvestigatorID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'InvestigatorID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Property Room Officer
                          {/* {errors.PropertyRoomOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyRoomOfficerError}</p>
                        ) : null} */}
                        </label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <Select
                          name='"OfficerNameID"'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerNameID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Evidence Type</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <input
                          type="text"
                          name="EvidenceType"
                          className={`form-control ${selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'
                            ? 'readonlyColor'
                            : ''
                            }`}
                          value={value.EvidenceType}
                          onChange={(e) => handleChange(e)}
                          readOnly={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>
                      <div className='col-3 col-md-3 col-lg-4'></div>

                      {/* <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Storage Location</label>
                      </div>
                      <div className="col-12 col-md-12 col-lg-3 ">
                        <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={locationStatus ? '' : value.location} className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
                          ? 'requiredColor'
                          : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                            ? 'readonlyColor'
                            : ''
                          }`}
                        />
                        {value.location ? (
                          <span style={{
                            position: 'absolute',
                            top: '40%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'not-allowed' : 'pointer',
                            opacity: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 0.5 : 1,
                            pointerEvents: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'none' : 'auto'
                          }} className='select-cancel' onClick={() => { handleClickedCleared("location") }}>
                            <i className='fa fa-times'></i>
                          </span>
                        ) : (null)}
                      </div>
                      <div className="col-1 ">
                        {(() => {
                          const isAddDisabled =
                            !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) ||
                            selectedOption === null;
                          return (
                            <button
                              disabled={isAddDisabled}
                              className="btn btn-sm bg-green text-white"
                              data-toggle="modal"
                              data-target="#PropertyRoomTreeModal"
                              style={{ cursor: isAddDisabled ? 'not-allowed' : 'pointer' }}
                              onClick={() => {
                                setlocationStatus(true)
                                // setKeyChange("CurrentStorageLocation")
                              }}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          );
                        })()}
                      </div> */}
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Storage Location
                          {errors.StorageLocationError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StorageLocationError}</p>
                          ) : null}
                        </label>
                      </div>
                      <div className="col-12 col-md-12 col-lg-3 ">
                        <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={value.location}
                          className={`form-control ${value.IsCheckIn || value.location || value.IsRelease
                            ? 'requiredColor'
                            : (selectedStatus === 'Release' || selectedStatus === 'Destroy')
                              ? 'readonlyColor'
                              : ''
                            }`}
                        />
                        {value.location ? (
                          <span style={{
                            position: 'absolute',
                            top: '40%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'not-allowed' : 'pointer',
                            opacity: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 0.5 : 1,
                            pointerEvents: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'none' : 'auto'
                          }} className='select-cancel' onClick={() => { handleClickedCleared("location") }}>
                            <i className='fa fa-times'></i>
                          </span>
                        ) : (null)}
                      </div>
                      <div className="col-1 ">
                        {(() => {
                          const isAddDisabled =
                            !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) ||
                            selectedOption === null;

                          return (
                            <button
                              disabled={isAddDisabled}
                              className="btn btn-sm bg-green text-white"
                              data-toggle="modal"
                              data-target="#PropertyRoomTreeModal"
                              style={{ cursor: isAddDisabled ? 'not-allowed' : 'pointer' }}
                              onClick={() => {
                                setlocationStatus(true)
                                // setKeyChange("CurrentStorageLocation")
                              }}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          );
                        })()}
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <label htmlFor="" className='new-label text-nowrap  mb-0'>Packaging Details</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-4 text-field mt-0">
                        <input type="text" name="PackagingDetails" className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.PackagingDetails} onChange={(e) => { handleChange(e) }} />
                      </div>


                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Comments</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-10 text-field mt-0">
                        <input type="text" name="ActivityComments"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                      </div>
                      <div className='col-12 col-md-12 col-lg-12 '>
                        <div className="row align-items-center ">
                          <div className="col-3 col-md-3 col-lg-2">
                            <label htmlFor="" className='new-label text-nowrap  mb-0'>
                              File Attachment
                            </label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-10 ">
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", }}
                            >
                              <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "6px", background: "#f9f9f9", width: "100%" }}>
                                <label
                                  htmlFor="file-input"
                                  style={{
                                    padding: "5px 16px",
                                    backgroundColor: "#e9e9e9",
                                    color: "#fff",
                                    borderRadius: "4px",
                                    marginLeft: "4px",
                                    marginTop: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    transition: "background 0.3s",
                                  }}
                                  onMouseOver={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                                  onMouseOut={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                                >
                                  Choose File
                                </label>
                                <input
                                  type="file"
                                  onChange={handleFileChange}
                                  ref={fileInputRef}
                                  multiple
                                  style={{ display: "none" }}
                                  id="file-input"
                                />
                                <div
                                  style={{
                                    borderRadius: "4px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    minHeight: "38px",
                                    flex: "1",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginLeft: "12px",
                                    backgroundColor: "#fff",
                                  }}
                                >
                                  {selectedFiles.length > 0 ? (
                                    selectedFiles.map((file, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          backgroundColor: "#e9ecef",
                                          padding: "4px 10px",
                                          borderRadius: "4px",
                                          margin: "4px",
                                          fontSize: "13px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        <span>{file.name}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeFile(index)}
                                          style={{
                                            marginLeft: "6px",
                                            border: "none",
                                            background: "none",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            color: "#d9534f",
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <span style={{ color: "#777", fontSize: "13px" }}>No files selected</span>
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>
                        </div>

                      </div>

                      <fieldset style={{ width: "100%" }}>
                        <legend>Schedule</legend>
                        <div className='row align-items-center'>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label mb-0'>Court Date</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <DatePicker
                              name='CourtDate'
                              id='CourtDate'
                              onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                  e?.preventDefault();
                                }
                              }}
                              onChange={(date) => {
                                setCourtdate(date); setValue({
                                  ...value, ['CourtDate']: date ? getShowingMonthDateYear(date) : null,
                                });
                                if (destroydate && new Date(destroydate) < new Date(date)) {
                                  setdestroydate(null); setValue({ ...value, ['DestroyDate']: null, });
                                }
                              }}
                              isClearable={!!courtdate}
                              selected={courtdate}
                              placeholderText={courtdate ? courtdate : 'Select...'}
                              dateFormat="MM/dd/yyyy"
                              filterTime={filterPassedTime}
                              timeIntervals={1}
                              timeCaption="Time"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showDisabledMonthNavigation
                              autoComplete='off'
                              minDate={new Date()}
                              maxDate={value.ReleaseDate ? new Date(value?.ReleaseDate) : ''}
                              disabled={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                              className={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}

                            />
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label mb-0'>Release Date/Time
                              {/* {errors.ReleasedDateTimeError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReleasedDateTimeError}</p>
                            ) : null} */}
                            </label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <DatePicker
                              name='activitydate'
                              id='activitydate'
                              onChange={(date) => {
                                setactivitydate(date); setValue({ ...value, ['activitydate']: date ? getShowingMonthDateYear(date) : null, });

                              }}
                              isClearable={activitydate ? true : false}
                              selected={activitydate}
                              placeholderText={activitydate ? activitydate : 'Select...'}
                              dateFormat="MM/dd/yyyy HH:mm"
                              timeFormat="HH:mm "
                              is24Hour
                              timeInputLabel
                              showTimeSelect
                              timeIntervals={1}
                              timeCaption="Time"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showDisabledMonthNavigation
                              autoComplete='off'
                              maxDate={new Date(datezone)}
                              disabled={selectedOption === null || selectedOption === ''}
                              className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : ''}
                            />

                          </div>

                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label mb-0'>Destroy&nbsp;Date</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <DatePicker
                              name='DestroyDate'
                              id='DestroyDate'
                              onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                  e?.preventDefault();
                                }
                              }}
                              onChange={(date) => {
                                setdestroydate(date);
                                setValue({
                                  ...value,
                                  ['DestroyDate']: date ? getShowingMonthDateYear(date) : null,
                                });
                              }}
                              isClearable={!!destroydate}
                              selected={destroydate}
                              placeholderText={destroydate ? destroydate : 'Select...'}
                              dateFormat="MM/dd/yyyy"
                              filterTime={filterPassedTime}

                              timeIntervals={1}
                              timeCaption="Time"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showDisabledMonthNavigation
                              autoComplete='off'
                              minDate={courtdate ? new Date(courtdate) : new Date()}
                              disabled={value.IsCheckOut || value.IsRelease || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                              className={value.IsCheckOut || value.IsRelease || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}

                            />
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    }

                    {selectedOption === "CheckOut" && <div className='row align-items-center' style={{ rowGap: "8px" }}>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Reason{errors.ReasonError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <Select
                          name='ActivityReasonID'
                          value={reasonIdDrp?.filter((obj) => obj.value === value?.ActivityReasonID)}
                          isClearable
                          options={reasonIdDrp}
                          onChange={(e) => ChangeDropDown(e, 'ActivityReasonID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Check Out Date/Time{errors.CheckOutDateTimeError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CheckOutDateTimeError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <DatePicker
                          name='activitydate'
                          id='activitydate'
                          onChange={(date) => {
                            setactivitydate(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });

                          }}
                          isClearable={activitydate ? true : false}
                          selected={activitydate}
                          placeholderText={activitydate ? activitydate : 'Select...'}
                          dateFormat="MM/dd/yyyy HH:mm"
                          timeFormat="HH:mm "
                          is24Hour
                          timeInputLabel
                          showTimeSelect
                          timeIntervals={1}
                          timeCaption="Time"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          showDisabledMonthNavigation
                          autoComplete='off'
                          maxDate={new Date(datezone)}
                          disabled={selectedOption === null || selectedOption === ''}
                          className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                        />

                      </div>
                      <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                        <label htmlFor="" className='new-label mb-0'>Expected Return Date/Time
                          {/* {errors.ExpectedReturnDateTimeError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ExpectedReturnDateTimeError}</p>
                        ) : null} */}
                        </label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <DatePicker
                          name='ExpectedDate'
                          id='ExpectedDate'
                          onChange={(date) => {
                            setExpecteddate(date); setValue({ ...value, ['ExpectedDate']: date ? getShowingMonthDateYear(date) : null, });

                          }}
                          isClearable={expecteddate ? true : false}
                          selected={expecteddate}
                          placeholderText={expecteddate ? expecteddate : 'Select...'}
                          dateFormat="MM/dd/yyyy HH:mm"
                          timeFormat="HH:mm "
                          is24Hour
                          timeInputLabel
                          showTimeSelect
                          timeIntervals={1}
                          timeCaption="Time"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          showDisabledMonthNavigation
                          autoComplete='off'
                          maxDate={new Date(datezone)}
                          disabled={selectedOption === null || selectedOption === ''}
                          className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : ''}
                        />

                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Releasing Officer{errors.ReleasingOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReleasingOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='ReleasingOfficerID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReleasingOfficerID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'ReleasingOfficerID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>
                      <div className="col-3 col-md-3 col-lg-2  ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Recipient Officer{errors.ReasonError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='ReceipentOfficerID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReceipentOfficerID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'ReceipentOfficerID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Destination</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-2 text-field mt-0">
                        <input type="text" name="Destination"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.Destination} onChange={(e) => { handleChange(e) }} />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Mode of Transport</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-2 text-field mt-0">
                        <input type="text" name="ModeOfTransport"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ModeOfTransport} onChange={(e) => { handleChange(e) }} />
                      </div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Storage Location</label>
                      </div>
                      <div className="col-12 col-md-12 col-lg-5 ">
                        <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={locationStatus ? '' : value.location} disabled className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
                          ? 'requiredColor'
                          : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                            ? 'readonlyColor'
                            : ''
                          }`}
                        />

                        {value.location ? (
                          <span style={{
                            position: 'absolute',
                            top: '40%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'not-allowed' : 'pointer',
                            opacity: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 0.5 : 1,
                            pointerEvents: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'none' : 'auto'
                          }} className='select-cancel' onClick={() => { handleClickedCleared("location") }}>
                            <i className='fa fa-times'></i>
                          </span>
                        ) : (null)}
                      </div>


                      {/* <div className="col-1" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                        <button disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null}
                          className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                            setlocationStatus(true);
                            // setKeyChange("location")
                          }}>
                          <i className="fa fa-plus" > </i>
                        </button>
                      </div> */}


                      <div className="col-3 col-md-3 col-lg-2">
                        <label htmlFor="" className='new-label text-nowrap mb-0'>Packaging Details</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-10 text-field mt-0">
                        <input type="text" name="PackagingDetails" className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.PackagingDetails} onChange={(e) => { handleChange(e) }} />
                      </div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Comments</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-10 text-field mt-0">
                        <input type="text" name="ActivityComments"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                      </div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label text-nowrap mb-0'>
                          File Attachment
                        </label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-10 ">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", }}
                        >
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "6px", background: "#f9f9f9", width: "100%" }}>
                            <label
                              htmlFor="file-input"
                              style={{
                                padding: "5px 16px",
                                backgroundColor: "#e9e9e9",
                                color: "#fff",
                                borderRadius: "4px",
                                marginLeft: "4px",
                                marginTop: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold",
                                transition: "background 0.3s",
                              }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                              onMouseOut={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                            >
                              Choose File
                            </label>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              multiple
                              style={{ display: "none" }}
                              id="file-input"
                            />
                            <div
                              style={{
                                borderRadius: "4px",
                                display: "flex",
                                flexWrap: "wrap",
                                minHeight: "38px",
                                flex: "1",
                                alignItems: "center",
                                gap: "6px",
                                marginLeft: "12px",
                                backgroundColor: "#fff",
                              }}
                            >
                              {selectedFiles.length > 0 ? (
                                selectedFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      backgroundColor: "#e9ecef",
                                      padding: "4px 10px",
                                      borderRadius: "4px",
                                      margin: "4px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <span>{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      style={{
                                        marginLeft: "6px",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#d9534f",
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <span style={{ color: "#777", fontSize: "13px" }}>No files selected</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>





                    </div>
                    }

                    {selectedOption === "Release" && <div className='row align-items-center' style={{ rowGap: "8px" }}>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Reason{errors.ReasonError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <Select
                          name='ActivityReasonID'
                          value={reasonIdDrp?.filter((obj) => obj.value === value?.ActivityReasonID)}
                          isClearable
                          options={reasonIdDrp}
                          onChange={(e) => ChangeDropDown(e, 'ActivityReasonID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0 '>Release Date/Time{errors.ReleasedDateTimeError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReleasedDateTimeError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <DatePicker
                          name='ReleaseDate'
                          id='ReleaseDate'
                          onChange={(date) => {
                            setactivitydate(date); setValue({ ...value, ['ReleaseDate']: date ? getShowingMonthDateYear(date) : null, });

                          }}
                          isClearable={activitydate ? true : false}
                          selected={activitydate}
                          placeholderText={activitydate ? activitydate : 'Select...'}
                          dateFormat="MM/dd/yyyy HH:mm"
                          timeFormat="HH:mm "
                          is24Hour
                          timeInputLabel
                          showTimeSelect
                          timeIntervals={1}
                          timeCaption="Time"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          showDisabledMonthNavigation
                          autoComplete='off'
                          maxDate={new Date(datezone)}
                          disabled={selectedOption === null || selectedOption === ''}
                          className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                        />

                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Property Room Officer{errors.PropertyRoomOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyRoomOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <Select
                          name='"OfficerNameID"'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerNameID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Releasing Officer{errors.ReleasingOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReleasingOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='ReleasingOfficerID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReleasingOfficerID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'ReleasingOfficerID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Recipient
                          {/* {errors.ReceipientError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReceipientError}</p>
                        ) : null} */}
                        </label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='ReceipentID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReceipentID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'ReceipentID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Recipient Location</label>
                      </div>
                      <div className="col-12 col-md-12 col-lg-2    ">
                        <Select
                          name='ReceipentID'
                          // value={''}
                          isClearable
                          // options={''}
                          // onChange={''}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Mode of Transport</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-2 text-field mt-0">
                        <input type="text" name="ActivityComments"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                      </div>


                      <div className="col-3 col-md-3 col-lg-2">
                        <label htmlFor="" className='new-label px-0 mb-0'>Storage Location</label>
                      </div>
                      <div className="col-12 col-md-12 col-lg-5 ">
                        <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={locationStatus ? '' : value.location} disabled className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
                          ? 'requiredColor'
                          : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                            ? 'readonlyColor'
                            : ''
                          }`}
                        />

                        {value.location ? (
                          <span style={{
                            position: 'absolute',
                            top: '40%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'not-allowed' : 'pointer',
                            opacity: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 0.5 : 1,
                            pointerEvents: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'none' : 'auto'
                          }} className='select-cancel' onClick={() => { handleClickedCleared("location") }}>
                            <i className='fa fa-times'></i>
                          </span>
                        ) : (null)}
                      </div>

                      {/* <div className="col-1" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                        <button disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null}
                          className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                            setlocationStatus(true);
                            // setKeyChange("location")
                          }}>
                          <i className="fa fa-plus" > </i>
                        </button>
                      </div> */}

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Comments</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-10 text-field mt-0">
                        <input type="text" name="ActivityComments"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                      </div>



                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label text-nowrap mb-0'>
                          File Attachment
                        </label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-10 ">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", }}
                        >
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "6px", background: "#f9f9f9", width: "100%" }}>
                            <label
                              htmlFor="file-input"
                              style={{
                                padding: "5px 16px",
                                backgroundColor: "#e9e9e9",
                                color: "#fff",
                                borderRadius: "4px",
                                marginLeft: "4px",
                                marginTop: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold",
                                transition: "background 0.3s",
                              }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                              onMouseOut={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                            >
                              Choose File
                            </label>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              multiple
                              style={{ display: "none" }}
                              id="file-input"
                            />
                            <div
                              style={{
                                borderRadius: "4px",
                                display: "flex",
                                flexWrap: "wrap",
                                minHeight: "38px",
                                flex: "1",
                                alignItems: "center",
                                gap: "6px",
                                marginLeft: "12px",
                                backgroundColor: "#fff",
                              }}
                            >
                              {selectedFiles.length > 0 ? (
                                selectedFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      backgroundColor: "#e9ecef",
                                      padding: "4px 10px",
                                      borderRadius: "4px",
                                      margin: "4px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <span>{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      style={{
                                        marginLeft: "6px",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#d9534f",
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <span style={{ color: "#777", fontSize: "13px" }}>No files selected</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>

                      <fieldset style={{ width: "100%" }}>
                        <legend>Schedule</legend>
                        <div className='row align-items-center'>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label mb-0'>Court Date</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <DatePicker
                              name='CourtDate'
                              id='CourtDate'
                              onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                  e?.preventDefault();
                                }
                              }}
                              onChange={(date) => {
                                setCourtdate(date);
                                setValue({
                                  ...value,
                                  ['CourtDate']: date ? getShowingMonthDateYear(date) : null,
                                });
                                if (destroydate && new Date(destroydate) < new Date(date)) {
                                  setdestroydate(null);
                                  setValue({
                                    ...value,
                                    ['DestroyDate']: null,
                                  });
                                }
                              }}
                              isClearable={!!courtdate}
                              selected={courtdate}
                              placeholderText={courtdate ? courtdate : 'Select...'}
                              dateFormat="MM/dd/yyyy"
                              filterTime={filterPassedTime}
                              timeIntervals={1}
                              timeCaption="Time"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showDisabledMonthNavigation
                              autoComplete='off'
                              minDate={new Date()}
                              maxDate={value.ReleaseDate ? new Date(value?.ReleaseDate) : ''}
                              disabled={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                              className={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}

                            />
                          </div>
                        </div>

                      </fieldset>

                    </div>
                    }

                    {selectedOption === "Destroy" && <div className='row align-items-center' style={{ rowGap: "8px" }}>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Reason{errors.ReasonError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <Select
                          name='ActivityReasonID'
                          value={reasonIdDrp?.filter((obj) => obj.value === value?.ActivityReasonID)}
                          isClearable
                          options={reasonIdDrp}
                          onChange={(e) => ChangeDropDown(e, 'ActivityReasonID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Destruction Date/Time{errors.DestructionDateTimeError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DestructionDateTimeError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <DatePicker
                          name='DestroyDate'
                          id='DestroyDate'
                          onChange={(date) => {
                            setactivitydate(date); setValue({ ...value, ['DestroyDate']: date ? getShowingMonthDateYear(date) : null, });

                          }}
                          isClearable={activitydate ? true : false}
                          selected={activitydate}
                          placeholderText={activitydate ? activitydate : 'Select...'}
                          dateFormat="MM/dd/yyyy HH:mm"
                          timeFormat="HH:mm "
                          is24Hour
                          timeInputLabel
                          showTimeSelect
                          timeIntervals={1}
                          timeCaption="Time"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          showDisabledMonthNavigation
                          autoComplete='off'
                          maxDate={new Date(datezone)}
                          disabled={selectedOption === null || selectedOption === ''}
                          className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                        />

                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Property Room Officer{errors.PropertyRoomOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyRoomOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <Select
                          name='"OfficerNameID"'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerNameID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Destruction Officer{errors.DestructionOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DestructionOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='DestructionOfficerID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.DestructionOfficerID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'DestructionOfficerID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Witness{errors.WitnessError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WitnessError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='WitnessID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.WitnessID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'WitnessID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Destruction Location</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <Select
                          name='ActivityReasonID'
                          // value={reasonIdDrp?.filter((obj) => obj.value === value?.ActivityReasonID)}
                          isClearable
                          // options={reasonIdDrp}
                          // onChange={(e) => ChangeDropDown(e, 'ActivityReasonID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>

                      {/* <div className="col-3 col-md-3 col-lg-2  ">
                        <label htmlFor="" className='new-label px-0 mb-0'> Destruction Location</label>
                      </div>
                      <div className="col-12 col-md-12 col-lg-2 ">
                        <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={locationStatus ? '' : value.location} disabled className={`form-control ${(value.IsCheckIn || value.IsTransferLocation || value.IsRelease)
                          ? 'requiredColor'
                          : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                            ? 'readonlyColor'
                            : ''}`} />

                        {value.location ? (
                          <span style={{
                            position: 'absolute',
                            top: '40%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'not-allowed' : 'pointer',
                            opacity: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 0.5 : 1,
                            pointerEvents: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'none' : 'auto'
                          }} className='select-cancel' onClick={() => { handleClickedCleared("location") }}>
                            <i className='fa fa-times'></i>
                          </span>
                        ) : (null)}
                      </div> */}
                      {/* <div className="col-1 " data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                                      <button disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null}
                                          className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                                              setlocationStatus(true);
                                          }}>
                                          <i className="fa fa-plus" ></i>
                                      </button>
                                  </div> */}



                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Destruction Method</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-2 text-field mt-0">
                        <input type="text" name="ActivityComments"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0'>Approval Officer{errors.ApprovalOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='ApprovalOfficerID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ApprovalOfficerID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'ApprovalOfficerID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>

                      <div className='col-3 col-md-3 col-lg-4'></div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Storage Location</label>
                      </div>
                      <div className="col-12 col-md-12 col-lg-6 ">
                        <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={locationStatus ? '' : value.location} disabled className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
                          ? 'requiredColor'
                          : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                            ? 'readonlyColor'
                            : ''
                          }`}
                        />

                        {value.location ? (
                          <span style={{
                            position: 'absolute',
                            top: '40%',
                            right: '10px',
                            transform: 'translateY(-50%)',
                            cursor: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'not-allowed' : 'pointer',
                            opacity: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 0.5 : 1,
                            pointerEvents: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'none' : 'auto'
                          }} className='select-cancel' onClick={() => { handleClickedCleared("location") }}>
                            <i className='fa fa-times'></i>
                          </span>
                        ) : (null)}
                      </div>
                      {/* <div className="col-1" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                        <button disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null}
                          className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                            setlocationStatus(true);
                            // setKeyChange("location")
                          }}>
                          <i className="fa fa-plus" > </i>
                        </button>
                      </div> */}
                      <div className='col-12 col-md-12 col-lg-3'></div>

                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Comments</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-10 text-field mt-0">
                        <input type="text" name="ActivityComments"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                      </div>


                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label text-nowrap mb-0'>
                          File Attachment
                        </label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-10 ">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", }}
                        >
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "6px", background: "#f9f9f9", width: "100%" }}>
                            <label
                              htmlFor="file-input"
                              style={{
                                padding: "5px 16px",
                                backgroundColor: "#e9e9e9",
                                color: "#fff",
                                borderRadius: "4px",
                                marginLeft: "4px",
                                marginTop: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold",
                                transition: "background 0.3s",
                              }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                              onMouseOut={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                            >
                              Choose File
                            </label>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              multiple
                              style={{ display: "none" }}
                              id="file-input"
                            />
                            <div
                              style={{
                                borderRadius: "4px",
                                display: "flex",
                                flexWrap: "wrap",
                                minHeight: "38px",
                                flex: "1",
                                alignItems: "center",
                                gap: "6px",
                                marginLeft: "12px",
                                backgroundColor: "#fff",
                              }}
                            >
                              {selectedFiles.length > 0 ? (
                                selectedFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      backgroundColor: "#e9ecef",
                                      padding: "4px 10px",
                                      borderRadius: "4px",
                                      margin: "4px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <span>{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      style={{
                                        marginLeft: "6px",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#d9534f",
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <span style={{ color: "#777", fontSize: "13px" }}>No files selected</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>



                    </div>
                    }

                    {(value.IsTransferLocation === true || value.IsTransferLocation === 'true') &&
                      <>
                        <div className='row align-items-center  mb-1'>
                          <div className="col-12 col-md-4 col-lg-2  "></div>
                          <div className="col-12 col-md-4 col-lg-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="TransferType"
                                value="IsInternalTransfer"
                                checked={value.IsInternalTransfer}
                                onChange={handleRadioChangeInner}
                              />
                              <label style={{ fontWeight: value?.IsCheckIn ? 'bold' : 'normal' }} className="form-check-label" htmlFor="flexRadioDefault">
                                Internal Transfer
                              </label>
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-lg-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="TransferType"
                                value="IsExternalTransfer"
                                checked={value.IsExternalTransfer}
                                onChange={handleRadioChangeInner}
                              />
                              <label style={{ fontWeight: value?.IsCheckOut ? 'bold' : 'normal' }} className="form-check-label" htmlFor="flexRadioDefault1">
                                External Transfer
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center' style={{ rowGap: "8px" }}>

                          <div className="col-3 col-md-3 col-lg-2">
                            <label htmlFor="" className='new-label mb-0'>Reason{errors.ReasonError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                            ) : null}</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <Select
                              name='ActivityReasonID'
                              value={reasonIdDrp?.filter((obj) => obj.value === value?.ActivityReasonID)}
                              isClearable
                              options={reasonIdDrp}
                              onChange={(e) => ChangeDropDown(e, 'ActivityReasonID')}
                              placeholder="Select..."
                              styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                              isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                            />
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label mb-0'>Transfer Date/Time{errors.TransferDateTimeError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.TransferDateTimeError}</p>
                            ) : null}</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <DatePicker
                              name='TransferDate'
                              id='TransferDate'
                              onChange={(date) => {
                                settransferdate(date); setValue({ ...value, ['TransferDate']: date ? getShowingMonthDateYear(date) : null, });

                              }}
                              isClearable={transferdate ? true : false}
                              selected={transferdate}
                              placeholderText={transferdate ? transferdate : 'Select...'}
                              dateFormat="MM/dd/yyyy HH:mm"
                              timeFormat="HH:mm "
                              is24Hour
                              timeInputLabel
                              showTimeSelect
                              timeIntervals={1}
                              timeCaption="Time"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showDisabledMonthNavigation
                              autoComplete='off'
                              maxDate={new Date(datezone)}
                              disabled={selectedOption === null || selectedOption === ''}
                              className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                            />

                          </div>

                          <div className="col-3 col-md-3 col-lg-2">
                            <label htmlFor="" className='new-label px-0 mb-0'>Approval Officer{errors.ApprovalOfficerError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalOfficerError}</p>
                            ) : null}</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                            <Select
                              name='ApprovalOfficerID'
                              value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ApprovalOfficerID)}
                              isClearable
                              options={agencyOfficerDrpData}
                              onChange={(e) => ChangeDropDown(e, 'ApprovalOfficerID')}
                              placeholder="Select..."
                              styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                              isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                            />


                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label mb-0'>Property Room Officer{errors.PropertyRoomOfficerError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyRoomOfficerError}</p>
                            ) : null}</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2">
                            <Select
                              name='"OfficerNameID"'
                              value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerNameID)}
                              isClearable
                              options={agencyOfficerDrpData}
                              onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                              placeholder="Select..."
                              styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                              isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                            />
                          </div>
                          {
                            value.IsExternalTransfer ?
                              <>
                                <div className="col-3 col-md-3 col-lg-2">
                                  <label htmlFor="" className='new-label mb-0'>Receiving Officer{errors.PropertyRoomOfficerError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyRoomOfficerError}</p>
                                  ) : null}</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 ">
                                  <Select
                                    name='"OfficerNameID"'
                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerNameID)}
                                    isClearable
                                    options={agencyOfficerDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                                    placeholder="Select..."
                                    styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                                    isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                  />
                                </div>
                                <div className="col-3 col-md-3 col-lg-2">
                                  <label htmlFor="" className='new-label mb-0'>Mode of Transport</label>
                                </div>
                                <div className="col-9 col-md-9 col-lg-2 text-field mt-0">
                                  <input type="text" name="ActivityComments"
                                    className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 ">
                                  <label htmlFor="" className='new-label mb-0'>Expected Arrival Date/Time{errors.ExpectedReturnDateTimeError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ExpectedReturnDateTimeError}</p>
                                  ) : null}</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 ">
                                  <DatePicker
                                    name='ExpectedDate'
                                    id='ExpectedDate'
                                    onChange={(date) => {
                                      setExpecteddate(date); setValue({ ...value, ['ExpectedDate']: date ? getShowingMonthDateYear(date) : null, });

                                    }}
                                    isClearable={expecteddate ? true : false}
                                    selected={expecteddate}
                                    placeholderText={expecteddate ? expecteddate : 'Select...'}
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    timeFormat="HH:mm "
                                    is24Hour
                                    timeInputLabel
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    showDisabledMonthNavigation
                                    autoComplete='off'
                                    maxDate={new Date(datezone)}
                                    disabled={selectedOption === null || selectedOption === ''}
                                    className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                                  />

                                </div>
                              </> : <></>
                          }



                          <div className='col-3 col-md-3 col-lg-8'></div>
                          <div className="col-3 col-md-3 col-lg-2  ">
                            <label htmlFor="" className='new-label px-0 mb-0'> Current Storage Location</label>
                          </div>
                          <div className="col-12 col-md-12 col-lg-3" style={{ position: 'relative' }}>
                            <input
                              type="text"
                              name="CurrentStorageLocation"
                              id="CurrentStorageLocation"
                              value={locationStatus ? '' : value.location}
                              disabled
                              className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
                                ? 'requiredColor'
                                : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                                  ? 'readonlyColor'
                                  : ''
                                }`}
                            />

                            {/* {value.CurrentStorageLocation && (
                              <span
                                className="select-cancel"
                                onClick={() => { handleClickedCleared("CurrentStorageLocation") }}
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  right: '10px',
                                  transform: 'translateY(-50%)',
                                  cursor:
                                    !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                      ? 'not-allowed'
                                      : 'pointer',
                                  opacity:
                                    !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                      ? 0.5
                                      : 1,
                                  pointerEvents:
                                    !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                      ? 'none'
                                      : 'auto',
                                }}
                              >
                               
                              </span>
                            )} */}
                          </div>

                          {/** ➕ Add Button Section **/}
                          {/* <div className="col-1 ">
                            {(() => {
                              const isAddDisabled =
                                !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) ||
                                selectedOption === null;

                              return (
                                <button
                                  disabled={isAddDisabled}
                                  className="btn btn-sm bg-green text-white"
                                  data-toggle="modal"
                                  data-target="#PropertyRoomTreeModal"
                                  style={{ cursor: isAddDisabled ? 'not-allowed' : 'pointer' }}
                                  onClick={() => {
                                    setlocationStatus(true)
                                    // setKeyChange("CurrentStorageLocation")
                                  }}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              );
                            })()}
                          </div> */}


                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label px-0 mb-0 text-nowrap'> New Storage Location{errors.NewStorageLocationError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NewStorageLocationError}</p>
                            ) : null}</label>
                          </div>
                          <div className="col-12 col-md-12 col-lg-3" style={{ position: 'relative' }}>
                            <input
                              type="text"
                              name="DestinationStorageLocation"
                              id="DestinationStorageLocation"
                              value={locationStatus ? '' : value.DestinationStorageLocation}

                              className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
                                ? 'requiredColor'
                                : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                                  ? 'readonlyColor'
                                  : ''
                                }`}
                            />

                            {value.DestinationStorageLocation && (
                              <span
                                className="select-cancel"
                                onClick={() => { handleClickedCleared("DestinationStorageLocation") }}
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  right: '10px',
                                  transform: 'translateY(-50%)',
                                  cursor:
                                    !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                      ? 'not-allowed'
                                      : 'pointer',
                                  opacity:
                                    !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                      ? 0.5
                                      : 1,
                                  pointerEvents:
                                    !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                      ? 'none'
                                      : 'auto',
                                }}
                              >
                                <i className="fa fa-times"></i>
                              </span>
                            )}
                          </div>

                          {/** Add Button Section **/}
                          <div className="col-1">
                            {(() => {
                              const isAddDisabled =
                                !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) ||
                                selectedOption === null;

                              return (
                                <button
                                  disabled={isAddDisabled}
                                  className="btn btn-sm bg-green text-white"
                                  data-toggle="modal"
                                  data-target="#PropertyRoomTreeModal"
                                  style={{ cursor: isAddDisabled ? 'not-allowed' : 'pointer' }}
                                  onClick={() => {
                                    setlocationStatus(true)
                                    setstoragetype('NewStorageLocation')
                                    // setKeyChange("DestinationStorageLocation")
                                  }}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              );
                            })()}
                          </div>

                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label mb-0'>Comments</label>
                          </div>
                          <div className="col-9 col-md-9 col-lg-10 text-field mt-0">
                            <input type="text" name="ActivityComments"
                              className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                          </div>


                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label text-nowrap mb-0'>
                              File Attachment
                            </label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-10">
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", }}
                            >
                              <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "6px", background: "#f9f9f9", width: "100%" }}>
                                <label
                                  htmlFor="file-input"
                                  style={{
                                    padding: "5px 16px",
                                    backgroundColor: "#e9e9e9",
                                    color: "#fff",
                                    borderRadius: "4px",
                                    marginLeft: "4px",
                                    marginTop: "8px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    transition: "background 0.3s",
                                  }}
                                  onMouseOver={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                                  onMouseOut={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                                >
                                  Choose File
                                </label>
                                <input
                                  type="file"
                                  onChange={handleFileChange}
                                  ref={fileInputRef}
                                  multiple
                                  style={{ display: "none" }}
                                  id="file-input"
                                />
                                <div
                                  style={{
                                    borderRadius: "4px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    minHeight: "38px",
                                    flex: "1",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginLeft: "12px",
                                    backgroundColor: "#fff",
                                  }}
                                >
                                  {selectedFiles.length > 0 ? (
                                    selectedFiles.map((file, index) => (
                                      <div
                                        key={index}
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          backgroundColor: "#e9ecef",
                                          padding: "4px 10px",
                                          borderRadius: "4px",
                                          margin: "4px",
                                          fontSize: "13px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        <span>{file.name}</span>
                                        <button
                                          type="button"
                                          onClick={() => removeFile(index)}
                                          style={{
                                            marginLeft: "6px",
                                            border: "none",
                                            background: "none",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            color: "#d9534f",
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <span style={{ color: "#777", fontSize: "13px" }}>No files selected</span>
                                  )}
                                </div>
                              </div>

                            </div>
                          </div>



                        </div>
                      </>
                    }

                    {selectedOption === "Update" && <div className='row align-items-center' style={{ rowGap: "8px" }}>
                      <div className="col-3 col-md-3 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Reason{errors.ReasonError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <Select
                          name='ActivityReasonID'
                          value={reasonIdDrp?.filter((obj) => obj.value === value?.ActivityReasonID)}
                          isClearable
                          options={reasonIdDrp}
                          onChange={(e) => ChangeDropDown(e, 'ActivityReasonID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Update Date/Time{errors.UpdateDateTimeError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UpdateDateTimeError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <DatePicker
                          name='activitydate'
                          id='activitydate'
                          onChange={(date) => {
                            setactivitydate(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });

                          }}
                          isClearable={activitydate ? true : false}
                          selected={activitydate}
                          placeholderText={activitydate ? activitydate : 'Select...'}
                          dateFormat="MM/dd/yyyy HH:mm"
                          timeFormat="HH:mm "
                          is24Hour
                          timeInputLabel
                          showTimeSelect
                          timeIntervals={1}
                          timeCaption="Time"
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          showDisabledMonthNavigation
                          autoComplete='off'
                          maxDate={new Date(datezone)}
                          disabled={selectedOption === null || selectedOption === ''}
                          className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                        />

                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Updating Officer{errors.UpdatingOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UpdatingOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='UpdatingOfficerID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.UpdatingOfficerID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'UpdatingOfficerID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Property Room Officer{errors.PropertyRoomOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyRoomOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2">
                        <Select
                          name='"OfficerNameID"'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerNameID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Approval Officer{errors.ApprovalOfficerError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalOfficerError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                          name='ApprovalOfficerID'
                          value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ApprovalOfficerID)}
                          isClearable
                          options={agencyOfficerDrpData}
                          onChange={(e) => ChangeDropDown(e, 'ApprovalOfficerID')}
                          placeholder="Select..."
                          styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                          isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                      </div>

                      <div className='col-3 col-md-3 col-lg-4'></div>
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'> Current Storage Location</label>
                      </div>
                      <div className="col-12 col-md-12 col-lg-5" style={{ position: 'relative' }}>
                        <input
                          type="text"
                          name="CurrentStorageLocation"
                          id="CurrentStorageLocation"
                          value={locationStatus ? '' : value.location}
                          disabled
                          className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
                            ? 'requiredColor'
                            : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                              ? 'readonlyColor'
                              : ''
                            }`}
                        />

                        {value.location && (
                          <span
                            className="select-cancel"
                            onClick={() => { handleClickedCleared("CurrentStorageLocation") }}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              right: '10px',
                              transform: 'translateY(-50%)',
                              cursor:
                                !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                  ? 'not-allowed'
                                  : 'pointer',
                              opacity:
                                !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                  ? 0.5
                                  : 1,
                              pointerEvents:
                                !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null)
                                  ? 'none'
                                  : 'auto',
                            }}
                          >
                            {/* <i className="fa fa-times"></i> */}
                          </span>
                        )}
                      </div>

                      {/* <div className="col-1 ">
                        {(() => {
                          const isAddDisabled =
                            !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) ||
                            selectedOption === null;

                          return (
                            <button
                              disabled={isAddDisabled}
                              className="btn btn-sm bg-green text-white"
                              data-toggle="modal"
                              data-target="#PropertyRoomTreeModal"
                              style={{ cursor: isAddDisabled ? 'not-allowed' : 'pointer' }}
                              onClick={() => {
                                setlocationStatus(true)
                                // setKeyChange("CurrentStorageLocation")
                              }}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          );
                        })()}
                      </div> */}
                      <div className='col-12 col-md-12 col-lg-4'></div>



                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label'>Comments</label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-10 text-field mt-0">
                        <input type="text" name="ActivityComments"
                          className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                      </div>


                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label text-nowrap mb-0'>
                          File Attachment
                        </label>
                      </div>
                      <div className="col-3 col-md-3 col-lg-10 ">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", }}
                        >
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "6px", background: "#f9f9f9", width: "100%" }}>
                            <label
                              htmlFor="file-input"
                              style={{
                                padding: "5px 16px",
                                backgroundColor: "#e9e9e9",
                                color: "#fff",
                                borderRadius: "4px",
                                marginLeft: "4px",
                                marginTop: "8px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "bold",
                                transition: "background 0.3s",
                              }}
                              onMouseOver={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                              onMouseOut={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                            >
                              Choose File
                            </label>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              multiple
                              style={{ display: "none" }}
                              id="file-input"
                            />
                            <div
                              style={{
                                borderRadius: "4px",
                                display: "flex",
                                flexWrap: "wrap",
                                minHeight: "38px",
                                flex: "1",
                                alignItems: "center",
                                gap: "6px",
                                marginLeft: "12px",
                                backgroundColor: "#fff",
                              }}
                            >
                              {selectedFiles.length > 0 ? (
                                selectedFiles.map((file, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      backgroundColor: "#e9ecef",
                                      padding: "4px 10px",
                                      borderRadius: "4px",
                                      margin: "4px",
                                      fontSize: "13px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    <span>{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(index)}
                                      style={{
                                        marginLeft: "6px",
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        color: "#d9534f",
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <span style={{ color: "#777", fontSize: "13px" }}>No files selected</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>


                      <fieldset style={{ width: "100%" }}>
                        <legend>Schedule</legend>
                        <div className='row align-items-center'>
                          <div className="col-3 col-md-3 col-lg-2">
                            <label htmlFor="" className='new-label mb-0'>Court Date</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 mt-1">
                            <DatePicker
                              name='CourtDate'
                              id='CourtDate'
                              onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                  e?.preventDefault();
                                }
                              }}
                              onChange={(date) => {
                                setCourtdate(date);
                                setValue({
                                  ...value,
                                  ['CourtDate']: date ? getShowingMonthDateYear(date) : null,
                                });
                                if (destroydate && new Date(destroydate) < new Date(date)) {
                                  setdestroydate(null);
                                  setValue({
                                    ...value,
                                    ['DestroyDate']: null,
                                  });
                                }
                              }}
                              isClearable={!!courtdate}
                              selected={courtdate}
                              placeholderText={courtdate ? courtdate : 'Select...'}
                              dateFormat="MM/dd/yyyy"
                              filterTime={filterPassedTime}
                              timeIntervals={1}
                              timeCaption="Time"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showDisabledMonthNavigation
                              autoComplete='off'
                              minDate={new Date()}
                              maxDate={value.ReleaseDate ? new Date(value?.ReleaseDate) : ''}
                              disabled={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                              className={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}

                            />
                          </div>
                          <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label mb-0'>Release Date/Time{errors.ReleasedDateTimeError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReleasedDateTimeError}</p>
                            ) : null}</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2">
                            <DatePicker
                              name='activitydate'
                              id='activitydate'
                              onChange={(date) => {
                                setactivitydate(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });

                              }}
                              isClearable={activitydate ? true : false}
                              selected={activitydate}
                              placeholderText={activitydate ? activitydate : 'Select...'}
                              dateFormat="MM/dd/yyyy HH:mm"
                              timeFormat="HH:mm "
                              is24Hour
                              timeInputLabel
                              showTimeSelect
                              timeIntervals={1}
                              timeCaption="Time"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showDisabledMonthNavigation
                              autoComplete='off'
                              maxDate={new Date(datezone)}
                              disabled={selectedOption === null || selectedOption === ''}
                              className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : ''}
                            />

                          </div>
                          <div className="col-3 col-md-3 col-lg-2 1">
                            <label htmlFor="" className='new-label mb-0'>Destroy&nbsp;Date</label>
                          </div>
                          <div className="col-3 col-md-3 col-lg-2">
                            <DatePicker
                              name='DestroyDate'
                              id='DestroyDate'
                              onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                  e?.preventDefault();
                                }
                              }}
                              onChange={(date) => {
                                setdestroydate(date);
                                setValue({
                                  ...value,
                                  ['DestroyDate']: date ? getShowingMonthDateYear(date) : null,
                                });
                              }}
                              isClearable={!!destroydate}
                              selected={destroydate}
                              placeholderText={destroydate ? destroydate : 'Select...'}
                              dateFormat="MM/dd/yyyy"
                              filterTime={filterPassedTime}

                              timeIntervals={1}
                              timeCaption="Time"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showDisabledMonthNavigation
                              autoComplete='off'
                              minDate={courtdate ? new Date(courtdate) : new Date()}
                              disabled={value.IsCheckOut || value.IsRelease || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                              className={value.IsCheckOut || value.IsRelease || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}

                            />
                          </div>
                        </div>
                      </fieldset>

                    </div>


                    }
                  </div>



                </div>
              </div>
            </div>

            <div className=" col-12  text-right " >
              <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1">
                Print Barcode
              </button>
              <button type="button" aria-label="Close" onClick={() => {  setModalOpenStatus(false); }} ref={closeButtonRef} data-dismiss="modal" className="btn btn-sm btn-success mr-2 mb-2 mt-1" >
                Close
              </button>
              <button onClick={() => { resetdata(); }} type="button" className="btn btn-sm btn-success  mb-2 mr-2 mt-1">
                Clear
              </button>
              <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success  mb-2 mt-1">
                Save
              </button>

            </div>


          </div>
        </div>
      </div >


      <TreeModelPL {...{ proRoom, locationStatus, setlocationStatus, storagetype, locationPath, setLocationPath, searchStoStatus, setSearchStoStatus, value, setValue, setPropertyNumber, keyChange }} />

    </>
  );
};

export default CadPropertyModel;
