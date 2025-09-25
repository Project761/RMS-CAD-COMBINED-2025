import React, { useState, useRef, useCallback } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, filterPassedTime, getShowingMonthDateYear, getShowingWithFixedTime, getShowingWithFixedTime01, Requiredcolour, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext } from 'react'
import { get_AgencyOfficer_Data, get_Masters_Name_Drp_Data, get_PropertyTypeData } from '../../../../../redux/actions/DropDownsData';
import { useLocation, useNavigate } from "react-router-dom";
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat, sixColArray } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData, PropertyRoomInsert } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import TreeComponent from '../TreeComponent/TreeComponent';
import TreeModel from './TreeModel';
import PropertyReportRoom from '../../PropertyReportRoom/PropertyReportRoom';
import { useReactToPrint } from 'react-to-print';
import ChainOfModel from '../../PropertyReportRoom/ChainOfModel';
import { TaskListModal } from '../../../Property/PropertyTab/MiscellaneousInformation/MiscellaneousInformation';
import BarCode from '../../../../Common/BarCode';
import SelectBox from '../../../../Common/SelectBox';


const Home = (props) => {

    const { setStatus, DecPropID, DecMPropID, SelectedCategory, CallStatus, ProType, ProNumber, ProTransfer, CheckboxStatus } = props

    const { GetDataTimeZone, datezone, setChangesStatus } = useContext(AgencyContext);
    const navigate = useNavigate();
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

    const [ownerNameData, setOwnerNameData] = useState([]);
    const [possenSinglData, setPossenSinglData] = useState([]);
    // date 
    const [expecteddate, setExpecteddate] = useState();
    const [courtdate, setCourtdate] = useState('');
    const [releasedate, setreleasedate] = useState('');
    const [destroydate, setdestroydate] = useState('');
    // dropdown
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [activitydate, setactivitydate] = useState();

    const [clickedRow, setClickedRow] = useState(null);
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [editval, setEditval] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [masterpropertyId, setMasterPropertyId] = useState('');
    const [possessionID, setPossessionID] = useState('');
    // checkbox states
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionInternal, setselectedOptionInternal] = useState('Internal');
    const [selectedStatus, setSelectedStatus] = useState('');
    // functionality states
    const [propertyNumber, setPropertyNumber] = useState('');
    const [vehicleNumber, setvehicleNumber] = useState('');
    const [rowClicked, setRowClicked] = useState(false);
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [description, setDescription] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleClear, setToggleClear] = useState(false);

    const [locationPath, setLocationPath] = useState();
    const [StorageLocationID, setStorageLocationID] = useState();
    const [locationStatus, setlocationStatus] = useState(false);
    const [proRoom, setProRoom] = useState('PropertyRoom');
    const [searchStoStatus, setSearchStoStatus] = useState();
    const [searchStoragepath, setSearchStoragePath] = useState();
    const [releasestatus, setReleaseStatus] = useState();
    const [selectedCategory, setSelectedCategory] = useState();
    const [chainreport, setChainReport] = useState();
    const [insertcall, setInsertcall] = useState();
    const [selectedRowsObjects, setselectedRowsObjects] = useState([]);
    const [isClearing, setIsClearing] = useState(false);
    const [type, setType] = useState("PropertyRoom");
    const [functiondone, setfunctiondone] = useState(false);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([])
    const [taskListModalStatus, setTaskListModalStatus] = useState(false);
    const fileInputRef = useRef(null)
    const [taskToSend, setTaskToSend] = useState("");
    const [propertyRoomArr, setPropertyRoomArr] = useState([])
    const [task, setTask] = useState("")
    const [taskListStatus, setTaskListStatus] = useState("");
    const [enabledStatus, setEnabledStatus] = useState("");
    const [reportStatus, setreportStatus] = useState(false);
    const [printStatus, setPrintStatus] = useState(false);
    const [collectingOfficer, setCollectingOfficer] = useState("");
    const [CollectingOfficerError, setCollectingOfficerError] = useState("");
    const [transfer, settransfer] = useState('');
    const [multiSelected, setMultiSelected] = useState({ optionSelected: null });
    const [groupList, setGroupList] = useState([]);
    const [selectedOptiontask, setselectedOptiontask] = useState("Individual");
    const [transferdate, settransferdate] = useState();
    const [storagetype, setstoragetype] = useState();
    const [radioButtonStatus, setradioButtonStatus] = useState(false);
    const [LastTask, setLastTask] = useState("");
    const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
    const [IsNonPropertyStatus, setIsNonPropertyStatus] = useState(false);
    const [SendToPropertyRoomStatus, setSendToPropertyRoomStatus] = useState(false);


    const AddType = [
        { value: 'PropertyNumber', label: 'Property Number' },
        { value: 'StorageLocationID', label: 'Location' },
        { value: 'IncidentNumber', label: 'Incident Number' },
        { value: 'PropertyTypeID', label: 'Property Type' },
        { value: 'VehicleNumber', label: 'Vehicle Number' },
    ]
    const AddTransfer = [
        { value: 1, label: 'CheckIn' },
        { value: 2, label: 'CheckOut' },
        { value: 3, label: 'Release' },
        { value: 4, label: 'Destroy' },
    ]
    const [selectedOptions, setSelectedOptions] = useState(AddType[0]);

    const [value, setValue] = useState({
        'PropertyID': '', 'MasterPropertyId': '', 'ActivityType': '', 'DestinationStorageLocation': '', 'IsInternalTransfer': true, 'Destination': '', 'ModeOfTransport': '',
        'IsExternalTransfer': false, 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'OtherPersonNameID': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '', 'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '', 'IsCheckIn': false, 'IsCheckOut': false, 'IsRelease': false, 'IsDestroy': false, 'IsTransferLocation': false, 'IsUpdate': false, 'CreatedByUserFK': '', 'AgencyID': '', 'PropertyTypeID': '', 'LastSeenDtTm': '', 'PackagingDetails': ''
    })

    const [errors, setErrors] = useState({
        'ReasonError': '', 'ActivityDateError': '', 'InvestigatorError': '', 'LocationError': '', 'PropertyError': '', 'ExpectedDateError': '', 'OfficerNameError': '', 'NameError': '', 'CourtDateError': '', 'ReleaseDateError': '', 'DestroyDateError': '', 'TypeError': '', 'TransferError': '', 'SearchError': '', 'ActivityDtTmError': '',
    })

    const [searcherror, setsearcherror] = useState({
        'SearchError': '',
    })

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID); setPropertyId(prev => (prev?.length ? prev : DecPropID));
            setMasterPropertyId(prev => (prev?.length ? prev : DecPropID));
            if (!CheckboxStatus) { sessionStorage.removeItem('selectedRows'); }
            if (CallStatus === 'true') { GetData_Propertyroom(DecPropID, SelectedCategory); }
            else if (CallStatus === 'false' && (ProType && ProNumber)) {
                SearchButtons(ProType, ProNumber, localStoreData?.AgencyID);
                const matchedOption = AddType.find(option => option.value === ProType);
                if (matchedOption) { setSelectedOptions(matchedOption); }
            }
            // setValue({ ...value, 'PropertyTypeID': parseInt(ProNumber), 'ActivityType': ProTransfer })
            settransfer(ProTransfer); setPropertyNumber(ProNumber); GetDataTimeZone(localStoreData?.AgencyID);
            setvehicleNumber();
        }
    }, [localStoreData, ProType, ProNumber, CallStatus, DecPropID, SelectedCategory, propertyTypeData, ProTransfer]);

    console.log(selectedOptions)

    useEffect(() => {
        dispatch(get_Masters_Name_Drp_Data(possessionID, 0, 0, IncID));
        setValue({ ...value, ['PropertyRoomPersonNameID']: parseInt(possessionID), })
    }, [possessionID, loginPinID]);

    useEffect(() => {
        if (CallStatus === 'true') {
            GetData_Propertyroom(DecPropID, SelectedCategory);
        }
        else if (CallStatus === 'false' && (ProType || ProNumber)) {
        }
    }, [CallStatus]);


    useEffect(() => {
        if (loginAgencyID && selectedOption) {
            GetActivityReasonDrp(loginAgencyID);
        }
        dispatch(get_PropertyTypeData(loginAgencyID));

    }, [loginAgencyID, selectedOption]);

    useEffect(() => {
        if (IncID) {
            setMainIncidentID(IncID); get_Arrestee_Drp_Data(IncID);
        }
    }, [IncID, nameModalStatus, possessionID]);

    useEffect(() => {
        dispatch(get_Masters_Name_Drp_Data(possessionID, 0, 0));
        if (possessionID) { setValue({ ...value, ['PropertyRoomPersonNameID']: parseInt(possessionID) }) }
    }, [possessionID]);

    const get_Arrestee_Drp_Data = (IncidentID) => {
        const val = { 'MasterNameID': 0, 'IncidentID': IncidentID, }
        fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((data) => {
            if (data) {
                setOwnerNameData(sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID'));
            } else {
                setOwnerNameData([])
            }
        })
    };

    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setPossenSinglData(res);
            } else { setPossenSinglData([]); }
        })
    }

    const handleRadioChange = (event) => {
        setradioButtonStatus(true)
        setSelectedOption(event.target.value);
        const { value: selectedOption } = event.target;
        setValue(prevState => ({
            ...prevState,
            IsCheckIn: selectedOption === 'CheckIn',
            IsCheckOut: selectedOption === 'CheckOut',
            IsRelease: selectedOption === 'Release',
            IsDestroy: selectedOption === 'Destroy',
            IsTransferLocation: selectedOption === 'TransferLocation',
            IsUpdate: selectedOption === 'Update',
        }));
        setErrors({
            ...errors,
            'ReasonError': '', 'ActivityDateError': '', 'InvestigatorError': '', 'PropertyError': '', 'ExpectedDateError': '', 'OfficerNameError': '', 'NameError': '', 'CourtDateError': '', 'ReleaseDateError': '', 'DestroyDateError': '', 'TypeError': '', 'TransferError': '', 'LocationError': '', 'SearchError': '', 'ActivityDtTmError': '',
        })
        GetData_PropertyroomRadio(propertyId, selectedCategory);
    };

    const isCheckInSelected = selectedOption === 'CheckIn';

    const handleInputChange = (e) => {
        setPropertyNumber(e.target.value);
        setsearcherror(prevValues => {
            return { ...prevValues, 'SearchError': '', }
        })
    };

    const handleInputChangeVehicle = (e) => {
        setvehicleNumber(e.target.value);
        setsearcherror(prevValues => {
            return { ...prevValues, 'SearchError': '', }
        })
    };

    const check_Validation_Error = (e) => {

        const ReasonError = RequiredFieldIncident(value.ActivityReasonID);
        const StorageLocationError = value.IsCheckIn ? RequiredFieldIncident(value.location) : 'true';
        const NewStorageLocationError = value.IsTransferLocation ? RequiredFieldIncident(value.DestinationStorageLocation) : 'true'
        const PropertyRoomOfficerError = value.IsTransferLocation || value.IsRelease || value.IsDestroy || value.IsUpdate ? RequiredFieldIncident(value.OfficerNameID) : 'true';
        const CheckInDateTimeError = value.IsCheckIn ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';
        const SubmittingOfficerError = value.IsCheckIn ? RequiredFieldIncident(value.InvestigatorID) : 'true';
        const CheckOutDateTimeError = value.IsCheckOut ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';
        const ExpectedReturnDateTimeError = value.IsCheckOut ? RequiredFieldIncident(value.ExpectedDate) : 'true';
        const ReleasingOfficerError = (value.IsRelease || value.IsCheckOut) ? RequiredFieldIncident(value.ReleasingOfficerID) : 'true';
        const ReceipientError = value.IsRelease ? RequiredFieldIncident(value.OfficerNameID) : 'true';
        const ReleasedDateTimeError = value.IsRelease ? RequiredFieldIncident(value.ReleaseDate) : 'true';
        // const DestructionDateTimeError = value.IsDestroy ? RequiredFieldIncident(value.DestroyDate) : 'true';
        const DestructionDateTimeError = 'true';
        const DestructionOfficerError = value.IsDestroy ? RequiredFieldIncident(value.DestructionOfficerID) : 'true';
        const UpdatingOfficerError = value.IsUpdate ? RequiredFieldIncident(value.UpdatingOfficerID) : 'true';
        const ApprovalOfficerError = (value.IsDestroy || value.IsTransferLocation || value.IsUpdate) ? RequiredFieldIncident(value.ApprovalOfficerID) : 'true';
        const WitnessError = value.IsDestroy ? RequiredFieldIncident(value.WitnessID) : 'true';
        const TransferDateTimeError = value.IsTransferLocation ? RequiredFieldIncident(value.TransferDate) : 'true';
        const UpdateDateTimeError = (value.IsUpdate) ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';
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
                ['ReceipientError']: ReceipientError || prevValues['ReceipientError'],
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

    const { ReasonError, PropertyRoomOfficerError, CheckInDateTimeError, NewStorageLocationError, StorageLocationError, SubmittingOfficerError, CheckOutDateTimeError, ExpectedReturnDateTimeError, ReleasingOfficerError, ReceipientError, ReleasedDateTimeError,
        DestructionDateTimeError, DestructionOfficerError, UpdatingOfficerError, ApprovalOfficerError, WitnessError, TransferDateTimeError, UpdateDateTimeError } = errors

    useEffect(() => {

        if (ReasonError === 'true' && PropertyRoomOfficerError === 'true' && NewStorageLocationError === 'true' && StorageLocationError === 'true' && CheckInDateTimeError === 'true' && SubmittingOfficerError === 'true' && CheckOutDateTimeError === 'true' && ExpectedReturnDateTimeError === 'true' && ReleasingOfficerError === 'true' && ReceipientError === 'true' && ReleasedDateTimeError === 'true'
            && DestructionDateTimeError === 'true' && DestructionOfficerError === 'true' && UpdatingOfficerError === 'true' && ApprovalOfficerError === 'true' && WitnessError === 'true' && TransferDateTimeError === 'true' && UpdateDateTimeError === 'true'
        ) {

            { Add_Type() }
        }
    }, [ReasonError, PropertyRoomOfficerError, CheckInDateTimeError, NewStorageLocationError, StorageLocationError, SubmittingOfficerError, CheckOutDateTimeError, ExpectedReturnDateTimeError, ReleasingOfficerError, ReceipientError, ReleasedDateTimeError,
        DestructionDateTimeError, DestructionOfficerError, UpdatingOfficerError, ApprovalOfficerError, WitnessError, TransferDateTimeError, UpdateDateTimeError
    ])


    const check_Validation_Errorr = (e) => {
        sessionStorage.removeItem('selectedRows')
        const SearchError = RequiredFieldIncident(propertyNumber || vehicleNumber);
        setsearcherror(prevValues => {
            return {
                ...prevValues,
                ['SearchError']: SearchError,
            }
        })
    }

    const { SearchError } = searcherror

    useEffect(() => {
        if (SearchError === 'true' || SearchError === null) {
            SearchButton()
        }
    }, [searcherror])

    const GetActivityReasonDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, 'EvidenceReasonType': selectedOption };
        fetchPostData("PropertyEvidenceReason/GetDataDropDown_PropertyEvidenceReason", val).then((data) => {
            if (data) {
                setReasonIdDrp(Comman_changeArrayFormat(data, 'EvidenceReasonID', 'Description'))
            } else {
                setReasonIdDrp([]);
            }
        });
    };

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value,
                'IncidentID': propertyId, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'OtherPersonNameID': ''
            });
            if (agencyOfficerDrpData?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)); }
        }
    }, [selectedOption, loginAgencyID]);

    const GetData_Propertyroom = (DecPropID, category) => {
        const val = {
            'PropertyID': DecPropID, 'PropertyCategoryCode': category, 'MasterPropertyID': 0, 'AgencyId': loginAgencyID,
        };
        AddDeleteUpadate('Propertyroom/GetData_Propertyroom', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            setSearchData(parsedData.Table);
            sessionStorage.removeItem('selectedRows')
            setSelectedRows([])
            if (parsedData.Table && parsedData.Table?.length > 0) {
                setEditval(parsedData.Table[0]);
                setTimeout(() => {
                    setreportStatus(true);
                }, [1000])
            } else {
                toastifyError('No Data Available')
            }
        }).catch((error) => {
            // toastifyError('No Data Available');
        });
    };



    const GetData_PropertyroomRadio = (propertyId, category) => {
        const val = {
            'PropertyID': propertyId, 'PropertyCategoryCode': category, 'MasterPropertyID': 0, 'AgencyId': loginAgencyID,
        };
        AddDeleteUpadate('Propertyroom/GetData_Propertyroom', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            if (parsedData.Table && parsedData.Table?.length > 0) {
                setEditval(parsedData.Table[0]);
            }
        }).catch((error) => {
            // toastifyError('No Data Available');
        });
    };

    const GetChainCustodyReport = () => {
        const val = {
            'PropertyID': propertyId, 'PropertyCategoryCode': selectedCategory, 'MasterPropertyID': 0, 'AgencyId': loginAgencyID,
        };
        AddDeleteUpadate('Propertyroom/Report_ChainOfCustody', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            if (parsedData.Table && parsedData.Table?.length > 0) {
                setChainReport(parsedData.Table[0]);
            }
            else {
                toastifyError('No Data Available')
            }
        }).catch((error) => {
            toastifyError('No Data Available');
        });
    };

    useEffect(() => {
        if (chainreport) {
            chainForm();
        }
    }, [chainreport]);

    const SearchButtons = (ProType, ProNumber, loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID, [ProType]: ProNumber || vehicleNumber, 'ActivityType': transfer, };
        AddDeleteUpadate('Propertyroom/SearchPropertyRoom', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            setSearchData(parsedData.Table);
            if (parsedData.Table && parsedData.Table?.length > 0) {
                const propertyId = parsedData.Table[0].PropertyID;
                const masterpropertyId = parsedData.Table[0].MasterPropertyID;
                setDescription('');
            } else {
                toastifyError('No Data Available')
            }
        }).catch((error) => {
            console.log(error)
            // toastifyError('No Data Available');
        });
    };

    const SearchButton = () => {
        const val = { 'AgencyID': loginAgencyID, [selectedOptions.value]: propertyNumber || vehicleNumber, 'ActivityType': ((transfer === "null" || transfer === null) ? "" : transfer), ReportedDtTm: value?.ReportedDate, ReportedDtTmTo: value?.ReportedDateTo };
        AddDeleteUpadate('Propertyroom/SearchPropertyRoom', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            setSearchData(parsedData.Table);
            sessionStorage.removeItem('selectedRows')
            setSelectedRows([])
            if (parsedData.Table && parsedData.Table?.length > 0) {
                setDescription(''); setPropertyId(''); setEnabledStatus('');
                navigate(`/Property-room?&ProId=${stringToBase64('')}&MProId=${stringToBase64('')}&ProRomId=${stringToBase64('')}&ProRoomStatus=${true}&selectedCategory=${selectedCategory}&ProType=${selectedOptions.value}&ProNumber=${propertyNumber}&ProTransfer=${transfer}&CallStatus=${false}&CheckboxStatus=${true}`)
            } else {
                toastifyError('No Data Available')
            }
        }).catch((error) => {
            if (error.response.data.Message == "No Data Available") {
                setSearchData([])
            }
            // toastifyError('No Data Available');
        });
    };

    // const Add_Type = () => {
    //     const PropertyID = propertyId;
    //     const MasterPropertyId = masterpropertyId;
    //     const ActivityType = selectedOption;
    //     const CreatedByUserFK = loginPinID;

    //     const { ActivityReasonID, ExpectedDate, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate, CourtDate,
    //         ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId, IsCheckIn,
    //         IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, AgencyID, PackagingDetails,
    //     } = value;

    //     const valuesArray = PropertyID.map(id => ({
    //         PropertyID: id, ActivityType, ActivityReasonID, ExpectedDate, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate,
    //         CourtDate, ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId,
    //         MasterPropertyId, IsCheckIn, IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, CreatedByUserFK, AgencyID, PackagingDetails,
    //     }));

    //     const valuesArrayString = JSON.stringify(valuesArray);




    //     AddDeleteUpadate('Propertyroom/PropertyroomInsert', { 'Data': valuesArray }).then((res) => {
    //         reset();
    //         GetData_Propertyroom(propertyId, selectedCategory);
    //         navigate(`/Property-room?&ProId=${stringToBase64(propertyId)}&MProId=${stringToBase64(masterpropertyId)}&ProRomId=${stringToBase64(res?.PropertyroomID)}&ProRoomStatus=${true}&selectedCategory=${''}&ProType=${''}&ProNumber=${''}&ProTransfer=${''}&CallStatus=${true}&CheckboxStatus=${true}`);

    //         setInsertcall(true);
    //         setReleaseStatus(selectedOption === 'Release' ? true : false);
    //         if (selectedOption === 'Release') {
    //             printForm();
    //         }
    //         toastifySuccess(res.Message);
    //     });
    // };

    const Add_Type = () => {
        const formdata = new FormData();
        const PropertyID = propertyId;
        const MasterPropertyId = masterpropertyId;
        const ActivityType = selectedOption;
        const CreatedByUserFK = loginPinID;

        const { ActivityReasonID, ExpectedDate, ActivityComments, DestinationStorageLocation, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate, CourtDate,
            ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId, IsCheckIn,
            IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, activitydate, AgencyID, PackagingDetails,
        } = value;
        const valuesArray = PropertyID.map((id, index) => ({
            PropertyID: id, ActivityType, ActivityReasonID, ExpectedDate, activitydate, DestinationStorageLocation, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate,
            CourtDate, ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId,
            MasterPropertyId: MasterPropertyId[index], IsCheckIn, IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, CreatedByUserFK, AgencyID, PackagingDetails,
        }));
        let valuesArrayString = JSON.stringify(valuesArray);
        // valuesArrayString ="\"" +valuesArrayString.replace("\"", "\\\"")+"\"";
        let tempArr = valuesArray.map((item) => item?.PropertyID)
        for (let i = 0; i < selectedFiles?.length; i++) {
            formdata.append(`file`, selectedFiles[i]);
        }
        setPropertyRoomArr(tempArr)
        formdata.append("Data", JSON.stringify(valuesArray));
        PropertyRoomInsert('Propertyroom/PropertyroomInsert', formdata).then((res) => {
            reset(); GetData_Propertyroom(tempArr, selectedCategory);
            navigate(`/Property-room?&ProId=${stringToBase64(propertyId)}&MProId=${stringToBase64(masterpropertyId)}&ProRomId=${stringToBase64(res?.PropertyroomID)}&ProRoomStatus=${true}&selectedCategory=${''}&ProType=${''}&ProNumber=${''}&ProTransfer=${''}&CallStatus=${true}&CheckboxStatus=${true}`);
            setInsertcall(true); setReleaseStatus(selectedOption === 'Release' ? true : false);
            if (selectedOption === 'Release') {
                setreportStatus(true); printForm();
            }
            toastifySuccess(res.Message);
        });
    };



    const Get_SendTask_Data = (PropertyID, MasterPropertyID) => {
        const val = { "PropertyID": PropertyID.toString(), "MasterPropertyID": MasterPropertyID.toString() }
        fetchPostData('TaskList/GetData_TaskList', val).then((res) => {
            if (res) {
                setLastTask(res[res.length - 1]?.Task);
                setTask(res[0]);
            } else {
                setTask("");
            }
        }).catch((err) => {
            console.log(err);
            toastifyError(err?.message);
        })
    }

    const InSertBasicInfo = (id, col1, url, task) => {
        const documentAccess =
            selectedOptiontask === "Individual" ? "Individual" : "Group";
        const val = {
            "PropertyID": selectedRows[0].PropertyID, "MasterPropertyID": selectedRows[0].MasterPropertyID,
            'OfficerID': value?.OfficerID, 'CreatedByUserFK': loginPinID, 'Task': task,
            AssigneeType: documentAccess,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setValue({
                    ...value,
                    ["OfficerID"]: "",
                    ["DocumentAccess_Name"]: "",
                });
                setMultiSelected({ optionSelected: [] });
                // toastifySuccess(res.Message);
                //   col1 === 'OffenseID' && get_Offense_Data(); get_Data_Offense_Drp(incidentID, nameID);
                //   col1 === 'PropertyID' && get_Offender_Property_Data(); get_Offender_Property_Drp(incidentID, nameID);
                //   col1 === 'InjuryID' && get_InjuryType_Data();
                //   col1 === 'AssaultID' && get_Offender_Assault_Data(); get_Offender_Assault_Drp(incidentID, nameID);
                Get_SendTask_Data(propertyId, masterpropertyId)
                //    Get_SendTask_DrpVal(DecPropID, DecMPropID)
            } else {
                console.log("Somthing Wrong");
            }
        }).catch((err) => {
            console.log(err);
            toastifyError(err?.message);
        })
    }

    const set_Edit_Value = (row) => {
        setSelectedStatus(row.Status);
        setPropertyId(row.PropertyID);
        navigate(`/Property-room?&ProId=${stringToBase64(row.PropertyID)}&MProId=${stringToBase64(masterpropertyId)}&ProRomId=${stringToBase64(row?.PropertyroomID)}&ProRoomStatus=${true}&selectedCategory=${row.PropertyCategoryCode}&ProType=${selectedOptions.value}&ProNumber=${propertyNumber}&ProTransfer=${transfer}&CallStatus=${CallStatus}`)
        setSelectedCategory(row.PropertyCategoryCode)
        if (row.Status) { setStatus(true); }
        else { setStatus(''); }
        setRowClicked(true);
        setValue({
            IsCheckIn: false,
            IsCheckOut: false,
            IsRelease: false,
            IsDestroy: false,
            IsTransferLocation: false,
            IsUpdate: false
        });
        setSelectedOption(null);
    }

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

    const columns = [
        {
            name: '',
            selector: row => (
                <input
                    type="checkbox"
                    checked={selectedRows ? (selectedRows?.some(selected => selected?.PropertyID === row?.PropertyID)) : false}
                    onChange={() => handleCheckboxChange(row)}
                    disabled={enabledStatus === "" ? false : enabledStatus === row.Status ? false : true}
                />
            ),
            sortable: false,
        },
        {
            name: 'Property Number', selector: (row) => row.PropertyNumber, sortable: true
        },
        {
            name: 'Type', selector: (row) => row.Type, sortable: true
        },
        {
            name: 'Category', selector: (row) => row.Category, sortable: true
        },
        // {
        //     name: 'Description', sortable: true,
        //     cell: (row) => (
        //         <span title={row?.Description}>
        //             {row.Description?.length > 30 ? row?.Description.substring(0, 30) + '...' : row?.Description}
        //         </span>
        //     )

        // },

        {
            name: 'Classification',
            sortable: true,
            cell: (row) => (
                <span title={row?.Classification}>
                    {row?.Classification?.length > 30 ? row?.Classification?.substring(0, 30) + '...' : row?.Classification}
                </span>)

        },
        {
            name: 'Status',
            selector: row => row.Status,
            sortable: true,
            cell: (row) => {
                let color = 'black';
                switch (row.Status) {
                    case 'CheckIn':
                        color = 'green';
                        break;
                    case 'CheckOut':
                        color = 'red';
                        break;
                    case 'Update':
                        color = 'black';
                        break;
                    case 'Destroy':
                        color = 'orange';
                        break;
                    default:
                        color = 'gray';
                }
                return (
                    <span style={{ color }}>
                        {row.Status}
                    </span>
                );
            }
        },
        {
            name: 'Location', selector: (row) => row.NodePath, sortable: true
        },

        // , {
        //     name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 30 }}>Action</p>,
        //     cell: row =>
        //         <div style={{ position: 'absolute', top: 4, right: 30 }}>
        //             {/* {
        //         effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
        //           <span onClick={(e) => setCrimeId(row.CrimeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
        //             <i className="fa fa-trash"></i>
        //           </span>
        //           : <></>
        //           : <span onClick={(e) => setCrimeId(row.CrimeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
        //             <i className="fa fa-trash"></i>
        //           </span>
        //       }
        // */}
        //         </div>
        // }

    ]

    const ChangeDropDowns = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value })
            setPropertyNumber(e.value)
            setsearcherror(prevValues => {
                return { ...prevValues, 'SearchError': '', }
            })
        } else {
            setValue({
                ...value,
                [name]: null
            });
            setsearcherror(prevValues => {
                return {
                    ...prevValues, 'SearchError': '',
                }
            })
            setPossessionID('');
            setPropertyNumber('')
        }
    };

    const ChangeDropDown = (e, name) => {
        if (e && name === "CollectingOfficer") {

            setCollectingOfficer(e.value)
        }
        else if (e && name === 'Task' || e === null && name === 'Task') {
            setTaskToSend(e ? e.label : "");
            if (e === null) {
                setTaskListStatus("");
            }
            if (e) TaskListvalidation(e.label)
        }
        else if (e === null && name === 'CollectingOfficer') {
            setCollectingOfficer('');
        }
        else if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
            // setPossessionID(e.value);
        } else {
            setValue({
                ...value,
                [name]: null
            });
            setPossessionID('');

        }
    };

    const TaskListvalidation = (selectedStatus) => {
        setTaskListStatus("");
        let tasksInList = [];

        try {
            const parsed = JSON.parse(task?.tasklistdata || "[]");
            tasksInList = parsed.map((item) => item.Task);
        } catch (err) {
            console.error("Error parsing tasklistdata:", err);
        }

        setIsSendButtonDisabled(false);
        console.log(tasksInList, 'hello');
        if (tasksInList.includes("CheckIn") && selectedStatus === "CheckOut" || tasksInList.includes("CheckIn") && selectedStatus === "Release" || tasksInList.includes("CheckIn") && selectedStatus === "Destroy" || tasksInList.includes("CheckIn") && selectedStatus === "Update" || tasksInList.includes("CheckIn") && selectedStatus === "Transfer Location") {
            setTaskListStatus("Other task already pending in task list.");
            setChangesStatus(false);
            setIsSendButtonDisabled(true);
        }

        // else if (tasksInList.includes("CheckIn") && selectedStatus === "Release") {
        //     setTaskListStatus("Please complete CheckIn");
        //     setChangesStatus(false);
        //     setIsSendButtonDisabled(true);
        // }
        //  else if (tasksInList.includes("CheckIn") && selectedStatus === "Destroy") {
        //     setTaskListStatus("Please complete CheckIn");
        //     setChangesStatus(false);
        //     setIsSendButtonDisabled(true);
        // }
        else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "Release") {
            setTaskListStatus("Other task already pending in task list.");
            setChangesStatus(false);
            setIsSendButtonDisabled(true);
        }
        else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "Destroy") {
            setTaskListStatus("Other task already pending in task list.");
            setChangesStatus(false);
            setIsSendButtonDisabled(true);
        }
        else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "Transfer Location") {
            setTaskListStatus("Other task already pending in task list.");
            setChangesStatus(false);
            setIsSendButtonDisabled(true);
        }
        else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "Update") {
            setTaskListStatus("Other task already pending in task list.");
            setChangesStatus(false);
            setIsSendButtonDisabled(true);
        }
        else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "CheckIn") {
            setTaskListStatus("CheckIn task already sent to task list.");
            setChangesStatus(false);
            setIsSendButtonDisabled(true);
        } else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "CheckOut") {
            setTaskListStatus("Already checked out.");
            setChangesStatus(false);
            setIsSendButtonDisabled(true);
        } else if (tasksInList.includes("CheckOut") && selectedStatus === "Transfer Location") {
            setChangesStatus(false);
            setTaskListModalStatus(true);
            setIsSendButtonDisabled(true);
        } else {
            setChangesStatus(true);
            setTaskListStatus("");
            setIsSendButtonDisabled(false);
        }
    };



    const HandleStatusOption = () => {
        let arr = [];
        if (LastTask) {
            arr = StatusOption.filter((item) => !(item.label === LastTask));
            return arr;
        } else {

            const status = LastTask;
            arr = [{ value: "1", label: "CheckIn" }];
            if (LastTask) {
                const filteredvalue = StatusOption.filter(
                    (item) => item.label !== LastTask
                );
                console.log(filteredvalue);
                return filteredvalue;
                // return StatusOption;
            }
            else if (selectedStatus && (LastTask === null || LastTask === undefined)) {

                const filteredvalue = StatusOption.filter(
                    (item) => item.label !== selectedStatus
                );
                console.log(filteredvalue);
                return filteredvalue;
            }
            return arr;
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (event) {
            setValue((prevState) => ({ ...prevState, [name]: value, }));
        }
        else {
            setValue((prevState) => ({ ...prevState, [name]: null, }));
        }
    };

    const setStatusFalse = (e) => {
        reset();

        setIsClearing(true);
        setSelectedRows([]); setSelectedStatus('');
        navigate(`/Property-room?&ProId=${0}&MProId=${0}&ProRomId=${0}&ProRoomStatus=${true}&selectedCategory=${''}&ProType=${''}&ProNumber=${''}&ProTransfer=${''}&CallStatus=${false}`);
        setPropertyId(''); setClickedRow(null);
        setPropertyNumber('');
        setvehicleNumber('');
        setSelectedRows([]);
        setSearchStoragePath(''); setSelectedOptions(AddType[0]);
        setPossessionID('');
        //    setValue({ ...value, ['ReportedDate']: '', ['ReportedDateTo']: '' });
        setToggleClear(!toggleClear);
        sessionStorage.setItem('selectedRows', '');
    }

    const handleCheckboxChange = (row) => {
        const isSelected = (selectedRows ? selectedRows?.some(selected => selected?.PropertyID === row?.PropertyID) : false);
        let tempSelectedRows = selectedRows;
        if (isSelected) {
            // Remove it
            setSelectedRows(prev => prev.filter(selected => selected?.PropertyID !== row?.PropertyID));
            tempSelectedRows = (tempSelectedRows.filter(selected => selected?.PropertyID !== row?.PropertyID))
            if (tempSelectedRows?.length === 0) {
                setValue(prevState => ({
                    ...prevState,
                    IsCheckIn: false,
                    IsCheckOut: false,
                    IsRelease: false,
                    IsDestroy: false,
                    IsTransferLocation: false,
                    IsUpdate: false,
                }));
                setEnabledStatus("");
            }
        } else {
            // Add it
            setSelectedRows(prev => [row, ...prev]);
            tempSelectedRows = [row, ...tempSelectedRows]
            if (tempSelectedRows?.length === 1) {
                setValue(prevState => ({
                    ...prevState,
                    IsCheckIn: false,
                    IsCheckOut: false,
                    IsRelease: false,
                    IsDestroy: false,
                    IsTransferLocation: false,
                    IsUpdate: false,
                }));
                setEnabledStatus(tempSelectedRows[0].Status)
            }
        }
        if (tempSelectedRows?.length > 0) {

            const { Status, Description, PropertyID, PropertyCategoryCode } = tempSelectedRows[0];
            const propertyIds = tempSelectedRows.map(row => row.PropertyID);
            const masterpropertyIds = tempSelectedRows.map(row => row.MasterPropertyID);
            setSelectedCategory(PropertyCategoryCode); setDescription(Description);
            setSelectedStatus(Status); setRowClicked(true);
            sessionStorage.setItem('selectedRows', JSON.stringify(tempSelectedRows));
            setPropertyId(propertyIds); setMasterPropertyId(masterpropertyIds); setStatus(!!Status);
            console.log(propertyIds, propertyIds)
            Get_SendTask_Data(propertyIds, propertyIds);
        } else {
            setRowClicked(false); setStatus(false);
        }
    }

    useEffect(() => {
        const savedSelectedRows = JSON.parse(sessionStorage.getItem('selectedRows')) || [];
        if (savedSelectedRows.length > 0) {
            setEnabledStatus(savedSelectedRows[0].Status)
        }
        setSelectedRows(savedSelectedRows);
    }, []);

    useEffect(() => {
        if (!isClearing && selectedRows.length > 0) {
            sessionStorage.setItem('selectedRows', JSON.stringify(selectedRows));
        } else if (isClearing) {
            sessionStorage.removeItem('selectedRows');
            setIsClearing(false);
        }

    }, [selectedRows, isClearing]);

    useEffect(() => {
        if (selectedRows.length > 0) {
            setTaskListStatus("")
            setTask(selectedRows[0]?.Status)
        } else {
            if (selectedRows.length === 0) {
                setTask('')
                setTaskToSend("")
            }
        }
    }, [selectedRows])

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })

    const chainForm = useReactToPrint({
        content: () => componentRefnew.current,
        documentTitle: 'Data',
        onAfterPrint: () => { console.log(chainreport) }

    })

    const reset = () => {
        setValue({
            ...value,
            'PropertyID': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
            'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
            'MasterPropertyId': '', 'IsCheckIn': '', 'IsCheckOut': '', 'IsRelease': '', 'IsDestroy': '', 'IsTransferLocation': '', 'IsUpdate': '', 'CreatedByUserFK': '', 'PropertyTypeID': '',
            'OtherPersonNameID': '', 'LastSeenDtTm': '', 'PackagingDetails': '',
            ['ReportedDate']: '', ['ReportedDateTo']: ''
        });
        setErrors({
            ...errors,
            'ReasonError': '', 'ActivityDateError': '', 'InvestigatorError': '', 'PropertyError': '', 'ExpectedDateError': '', 'OfficerNameError': '', 'NameError': '', 'CourtDateError': '', 'ReleaseDateError': '', 'DestroyDateError': '', 'TypeError': '', 'TransferError': '', 'LocationError': '', 'SearchError': '', 'ActivityDtTmError': '',
        })
        setradioButtonStatus(false);
        setsearcherror(prevValues => { return { ...prevValues, 'SearchError': '', } })
        setCourtdate(''); setreleasedate(''); setdestroydate(''); setExpecteddate('');
        setSelectedStatus(''); setRowClicked(''); setSelectedOption(null); setactivitydate(''); setReasonIdDrp([]); setLocationPath('');
        setDescription('');
        setRowClicked('');
        setSearchData([]);
        setSelectedRows([]);
        setToggleClear(!toggleClear); setStatus(''); settransfer(null); setEditval([]);
    }

    const conditionalRowStyles = [
        {
            when: row => row.PropertyID === propertyId,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 31,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const onDashboardClose = () => {
        navigate('/dashboard-page');
    }

    const componentRef = useRef();
    const componentRefnew = useRef();

    const clearSelectedRows = () => {
        localStorage.removeItem('selectedRows'); // Remove selected rows from localStorage
        setSelectedRows([]); // Clear the selected rows state
    };

    const getSelectedRows = (selectedRows, searchData) => {
        const totalIds = searchData.map(item => item.PropertyID);
        const selectedIds = selectedRows.map(item => item.PropertyID);
        const selectedRowsData = searchData.filter(item => selectedIds.includes(item.PropertyID));
        setselectedRowsObjects(selectedRowsData);
    }

    function handleClickedCleared() {
        setValue({ ...value, 'location': '', });
    }

    const filterTimeForDateZone = (time, datezone) => {
        const zoneDate = new Date(datezone);
        const zoneHours = zoneDate.getHours();
        const zoneMinutes = zoneDate.getMinutes();
        const timeHours = time.getHours();
        const timeMinutes = time.getMinutes();
        if (timeHours > zoneHours || (timeHours === zoneHours && timeMinutes > zoneMinutes)) {
            return false;
        }
        return true;
    };

    const changeHandler = (e) => {
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) {
            nameArray?.push(name?.name)
        }
        setSelectedFileName(nameArray);
    };

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

    // abhi

    const [taskListDrpData, setTaskListDrpData] = useState([
        { value: "1", label: "Check In" },
        { value: "2", label: "Check Out" },
        { value: "3", label: "Release" },
        { value: "4", label: "Destroy" },
        { value: "5", label: "Transfer Location" },
        { value: "6", label: "Update" }
    ]);


    // Handle Dropdown Selection
    const handleDropdownChange = (selectedOption) => {
        if (!selectedOption) {
            setErrors((prev) => ({ ...prev, tasklistError: "Task list is required!" }));
            setValue({ taskListDrpDataID: null });
        } else {
            setErrors((prev) => ({ ...prev, tasklistError: "" }));
            setValue({ taskListDrpDataID: selectedOption.value });
        }
    };

    const handleSendToTaskList = () => {
        // if (collectingOfficer === "") {
        //     setCollectingOfficerError("required")
        //     return
        // }
        InSertBasicInfo(selectedRows[0]?.InvestigatorID, 'OfficerID', 'TaskList/Insert_TaskList', taskToSend)
        setCollectingOfficerError('true'); setTaskToSend(''); setCollectingOfficer('')

    }

    const StatusOption = [
        { value: "1", label: "CheckIn" },
        { value: "2", label: "CheckOut" },
        { value: "3", label: "Release" },
        { value: "4", label: "Destroy" },
        { value: "5", label: "TransferLocation" },
        { value: "6", label: "Update" }
    ]

    const handleRadioChangeArrestForward = (e) => {
        const selectedValue = e.target.value;
        setselectedOptiontask(selectedValue);
        setValue({
            ...value,
            ["OfficerID"]: "",
            ["DocumentAccess_Name"]: "",
        });
        setMultiSelected({ optionSelected: [] });
        setErrors({
            ...errors,
            ["ApprovalCommentsError"]: "",
            ["CommentsDocumentsError"]: "",
            ["ApprovingOfficerError"]: "",
            ["GroupError"]: "",
        });
    };

    const colourStylesUsers = {
        control: (styles, { isDisabled }) => ({
            ...styles,
            backgroundColor: isDisabled ? "#d3d3d3" : "#fce9bf",
            fontSize: 14,
            marginTop: 2,
            boxShadow: "none",
            cursor: isDisabled ? "not-allowed" : "default",
        }),
    };

    const Agencychange = (multiSelected) => {
        // setStatesChangeStatus(true)
        // setMultiSelected({optionSelected: multiSelected });
        setMultiSelected({ optionSelected: multiSelected });
        const id = [];

        if (multiSelected) {
            multiSelected.map((item, i) => {
                id.push(item.value);
            });
            setValue({ ...value, ["OfficerID"]: id.toString() });
        }
    };

    useEffect(() => {
        if (groupList?.GroupID) {
            setValue({
                ...value,
                ["GroupName"]: changeArrayFormat_WithFilter(
                    groupList,
                    "group",
                    groupList[0]?.GroupID
                ),
                CreatedByUserFK: loginPinID,
            });
        }
    }, [groupList]);

    const get_Group_List = (loginAgencyID) => {
        const value = { AgencyId: loginAgencyID, PINID: loginPinID };
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, "group"));

            } else {
                setGroupList();
            }
        });
    };

    useEffect(() => {
        if (loginAgencyID) {
            get_Group_List(loginAgencyID);
        }
    }, [loginAgencyID]);

    const handleRadioChangeInner = (event) => {
        const selectedOption = event.target.value;
        setselectedOptionInternal(selectedOption);

        // Set the specific state values based on the selected option
        setValue(prevState => ({
            ...prevState,
            IsInternalTransfer: selectedOption === 'IsInternalTransfer',
            IsExternalTransfer: selectedOption === 'IsExternalTransfer',
        }));
    };

    useEffect(() => {

        if (editval && selectedOption === 'Update') {
            setValue({
                ...value, PropertyID: editval?.PropertyID || '', ActivityType: editval?.ActivityType || '',

                ExpectedDate: editval?.ExpectedDate || '', ActivityComments: editval?.ActivityComments || '', OtherPersonNameID: editval?.OtherPersonNameID || '',
                PropertyRoomPersonNameID: editval?.PropertyRoomPersonNameID || '', ChainDate: editval?.ChainDate || '',
                DestroyDate: editval?.DestroyDate ? new Date(editval.DestroyDate) : '', CourtDate: editval?.CourtDate ? new Date(editval.CourtDate) : '', ReleaseDate: editval?.ReleaseDate ? new Date(editval.ReleaseDate) : '',
                PropertyTag: editval?.PropertyTag || '', RecoveryNumber: editval?.RecoveryNumber || '', StorageLocationID: editval?.StorageLocationID || '',
                ReceiveDate: editval?.ReceiveDate || '', OfficerNameID: editval?.OfficerNameID || '', InvestigatorID: editval?.InvestigatorID || '', location: editval?.location || '',
                activityid: editval?.activityid || '', EventId: editval?.EventId || '', MasterPropertyId: editval?.MasterPropertyId || '',
                CreatedByUserFK: editval?.CreatedByUserFK || '',
            });
            dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
            GetActivityReasonDrp(loginAgencyID);
            setCourtdate(editval?.CourtDate ? new Date(editval.CourtDate) : null);
            setreleasedate(editval?.ReleaseDate ? new Date(editval.ReleaseDate) : null)
            setdestroydate(editval?.DestroyDate ? new Date(editval.DestroyDate) : null);


        } else if (editval && selectedOption === 'CheckOut' || editval && selectedOption === 'Release' || editval && selectedOption === 'Destroy' || editval && selectedOption === "TransferLocation" || editval && selectedOption === "Update") {
            setValue({
                ...value, PropertyID: editval?.PropertyID || '',
                StorageLocationID: editval?.StorageLocationID || '',
                location: editval?.location || '',

            });

        }
    }, [editval, selectedOption]);
    function handleClickedClearedDestination() {
        setValue({
            ...value,
            'DestinationStorageLocation': '',
        });
        setfunctiondone(!functiondone);

    }




    return (
        <>

            <div className="col-12">
                <div className="col-12 col-md-12 col-lg-12 pt-2 px-0 " >
                    <fieldset>
                        <legend>Search</legend>
                        <div className="row px-0 align-items-center">
                            <div className="col-3 col-md-2 col-lg-1 mt-2">
                                <label htmlFor="" className='new-label'>Type</label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-3 mt-1">
                                <Select
                                    name='AddType'
                                    value={selectedOptions}
                                    // value={AddType.find(option => option.label === selectedOptions)}
                                    onChange={(selectedOption) => {
                                        setSelectedOptions(selectedOption);
                                        setPropertyNumber('');
                                        setsearcherror(prevValues => {
                                            return { ...prevValues, 'SearchError': '', }
                                        })
                                        setValue({
                                            ...value,
                                            'PropertyTypeID': ''
                                        })
                                    }}
                                    defaultValue={AddType[0]}
                                    placeholder="Select..."
                                    options={AddType}
                                    menuPlacement='top'
                                />
                            </div>

                            {selectedOptions?.value === 'PropertyNumber' && (
                                <>
                                    <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                                        <label htmlFor="" className='new-label '>Property No.{searcherror.SearchError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-3 col-lg-2">
                                        <div className="text-field mt-1">
                                            <input type="text" className='requiredColor' maxLength={12} value={propertyNumber} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {selectedOptions?.value === 'VehicleNumber' && (
                                <>
                                    <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                                        <label htmlFor="" className='new-label '>Vehicle No.{searcherror.SearchError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-3 col-lg-2">
                                        <div className="text-field mt-1">
                                            <input type="text" className='requiredColor' maxLength={12} value={vehicleNumber} onChange={handleInputChangeVehicle} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {selectedOptions?.value === 'StorageLocationID' && (
                                <>
                                    <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                                        <label htmlFor="" className='new-label'>Location{searcherror.SearchError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-3 col-lg-2 ">
                                        <div className="text-field mt-1 " data-toggle="modal" data-target="#PropertyRoomTreeModal">
                                            <input type="text" className='requiredColor' value={searchStoragepath} onClick={() => {
                                                // setlocationStatus(true);
                                                setSearchStoStatus(true);
                                            }} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {selectedOptions?.label === 'Barcode' && (
                                <>
                                    <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                                        <label htmlFor="" className='new-label'>Barcode{searcherror.SearchError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-3 col-lg-2">
                                        <div className="text-field mt-1">
                                            <input type="text" value={propertyNumber} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </>
                            )}
                            {selectedOptions?.value === 'IncidentNumber' && (
                                <>
                                    <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                                        <label htmlFor="" className='new-label'>Transaction Number{searcherror.SearchError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-3 col-lg-2">
                                        <div className="text-field mt-1">
                                            <input type="text" className='requiredColor' maxLength={12} value={propertyNumber} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedOptions?.value === 'PropertyTypeID' && (
                                <>
                                    <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                                        <label htmlFor="" className='new-label'>Property Type{searcherror.SearchError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-3 col-lg-2">
                                        <div className=" mt-1">
                                            <Select
                                                name='PropertyTypeID'
                                                value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                options={propertyTypeData}
                                                onChange={(e) => ChangeDropDowns(e, 'PropertyTypeID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={Requiredcolour}
                                            // isDisabled={propertyID || masterPropertyID ? true : false}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedOptions?.value === 'PropertyTag' && (
                                <>
                                    <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                                        <label htmlFor="" className='new-label'>Property Tag{searcherror.SearchError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-3 col-lg-2">
                                        <div className="text-field mt-1">
                                            <input type="text" className='requiredColor' value={propertyNumber} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="col-1 pt-2" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                                <button
                                    className=" btn btn-sm bg-green text-white py-0 px-1" onClick={(e) => {
                                        check_Validation_Errorr();
                                        setRowClicked(false);
                                        setSelectedStatus(null);
                                        setSelectedOption(null);
                                    }}>
                                    <i className="fa fa-search"> </i>
                                </button>
                            </div>

                            <div className="col-3 col-md-2 col-lg-1 mt-2">
                                <label htmlFor="" className='new-label'>Activity Type</label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2 mt-1">
                                <Select
                                    name='AddType'
                                    value={transfer ? AddTransfer.find(option => option.label === transfer) : null}
                                    onChange={(selectedOption) => {
                                        // settransfer(selectedOption.label);
                                        settransfer(selectedOption ? selectedOption.label : null);

                                    }}
                                    // defaultValue={AddTransfer[0]}
                                    placeholder="Select..."
                                    options={AddTransfer}
                                    isClearable
                                    styles={{
                                        control: (provided, { isFocused }) => ({
                                            ...provided,
                                            fontWeight: transfer ? 'bold' : 'normal',
                                            color: transfer ? 'black' : 'black',

                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            fontWeight: 'bold',
                                            color: 'black',
                                        }),
                                        option: (provided, { isSelected, isFocused }) => ({
                                            ...provided,
                                            fontWeight: isSelected ? 'bold' : isFocused ? 'bold' : 'normal',
                                            color: isSelected ? 'black' : isFocused ? 'black' : 'black',
                                        }),
                                    }}
                                />
                            </div>

                            {
                                (selectedOptions?.value === 'StorageLocationID' || selectedOptions?.value === 'PropertyTypeID') ?

                                    <>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 text-right">
                                            <label htmlFor="" className='new-label'>Date From</label>
                                        </div>
                                        <div className='col-3 col-md-3 col-lg-3'>
                                            <div className="dropdown__box m-0">
                                                <DatePicker
                                                    name='ReportedDate'
                                                    id='ReportedDate'
                                                    onChange={(date) => {
                                                        // console.log(date)
                                                        if (date) {
                                                            setValue({
                                                                ...value,
                                                                ['ReportedDate']: date ? getShowingWithFixedTime01(date) : null,
                                                                ['ReportedDateTo']: getShowingWithFixedTime(new Date(datezone))
                                                            })
                                                        } else {
                                                            setValue({
                                                                ...value,
                                                                ['ReportedDate']: null,
                                                                ['ReportedDateTo']: null,
                                                            })
                                                        }
                                                    }}
                                                    selected={value.ReportedDate && new Date(value.ReportedDate)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReportedDate ? true : false}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    disabled={false}
                                                    maxDate={new Date(datezone)}
                                                    placeholderText='Select From Date...'
                                                />
                                                {/* <label htmlFor="" className='pl-0 pt-1' >Reported From Date</label> */}
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 text-right">
                                            <label htmlFor="" className='new-label'>Date To</label>
                                        </div>
                                        <div className='col-3 col-md-3 col-lg-2'>
                                            <div className="dropdown__box m-0">
                                                <DatePicker
                                                    name='ReportedDateTo'
                                                    id='ReportedDateTo'
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingWithFixedTime(date) : null }) }}
                                                    selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={value?.ReportedDateTo ? true : false}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    minDate={new Date(value?.ReportedDate)}
                                                    disabled={value?.ReportedDate ? false : true}
                                                    maxDate={new Date(datezone)}
                                                    placeholderText='Select To Date...'
                                                />
                                                {/* <label htmlFor="" className='pl-0 pt-1' >Reported To Date</label>    */}
                                            </div>
                                        </div>
                                    </> : <></>
                            }
                        </div >
                    </fieldset>
                </div>
                <div className="col-12 px-0 mt-1 mb-1" >
                    <DataTable
                        showHeader={true}
                        persistTableHead={true}
                        dense
                        columns={columns}
                        data={searchData}
                        highlightOnHover
                        responsive
                        customStyles={tableCustomStyles}
                        fixedHeader
                        fixedHeaderScrollHeight='100px'
                        pagination
                        paginationPerPage={'100'}
                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                        showPaginationBottom={100}
                        onSelectedRowsChange={(row) => { handleCheckboxChange(row); }}
                        noDataComponent={searchData.length === 0 ? 'There are no data to display' : ""}
                    // selectableRowsHighlight
                    //  selectableRows
                    // selectableRowSelected={row => selectedRows?.some(selected => selected.PropertyID === row.PropertyID)}
                    // selectableRowSelected={row => (selectedRows || [])?.some(selected => selected?.PropertyID === row?.PropertyID)}
                    // onRowClicked={(row) => { console.log(row) }}
                    // handleSelectedRows={(row) => { console.log(row) }}
                    // clearSelectedRows={toggleClear}
                    // selectedRows={selectedRows}

                    />
                </div>

                <div className="col-12 col-md-12 col-lg-12 mt-2 px-0 ">
                    {
                        task === '' ? null :
                            // <fieldset>
                            //     <legend>Task List</legend>
                            //     <div className="row px-0">
                            //         <div className="col-3 col-md-3 col-lg-1 mt-2">
                            //             <label htmlFor="" className='new-label text-nowrap'>
                            //                 Send Task to List
                            //                 {errors.tasklistError && (
                            //                     <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>
                            //                         {errors.tasklistError}
                            //                     </p>
                            //                 )}
                            //             </label>
                            //         </div>
                            //         <div className="col-9 col-md-9 col-lg-3 text-field mt-1">
                            //             <Select
                            //                 // className='attemped__com flex-grow-1'
                            //                 onChange={(e) => ChangeDropDowns(e, 'Task')}
                            //                 options={StatusOption}
                            //                 isClearable
                            //                 //  styles={!value?.AttemptComplete ? nibrscolourStyles : nibrsSuccessStyles}
                            //                 placeholder="Select..."
                            //                 value={StatusOption.filter(option => option.value === value?.Task)}
                            //             />
                            //         </div>
                            //         <div className="col-3 col-md-3 col-lg-8 mt-2 px-1 d-flex justify-content-end">
                            //             <button type="button" className="btn btn-sm mb-2 mt-1" style={{ backgroundColor: "#001f3f", color: "#fff" }}>
                            //                 Send
                            //             </button>
                            //         </div>
                            //     </div>
                            // </fieldset>

                            <fieldset>
                                <legend>Task List</legend>
                                <div className="row px-0 align-items-center">
                                    <div className="col-3 col-md-3 col-lg-1">
                                        <label htmlFor="" className="new-label text-nowrap mb-0">
                                            Send Task to List
                                            {errors.tasklistError && (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>
                                                    {errors.tasklistError}
                                                </p>
                                            )}
                                        </label>
                                    </div>

                                    <div className="col-9 col-md-9 col-lg-2 text-field mt-0 ">
                                        {/* Flex wrapper for Select + inline message */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Select
                                                onChange={(e) => ChangeDropDown(e, 'Task')}
                                                options={HandleStatusOption()}
                                                isClearable
                                                placeholder="Select..."
                                                value={StatusOption.find(option => option.label === taskToSend) || null}
                                                styles={{
                                                    container: (base) => ({ ...base, flex: 1 }) // Makes Select grow inside flex
                                                }}
                                            />
                                        </div>
                                    </div>


                                    <>
                                        <div className="col-1 col-md-1 col-lg-1 ">
                                            <label
                                                className="form-check-label mb-0"
                                                htmlFor="sendToPropertyRoom"
                                            >
                                                Assignee
                                            </label>
                                        </div>

                                        <div className="col-3 col-md-3 col-lg-5 g-1 row align-items-center">
                                            <>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <div className="form-check ml-2">
                                                        <input
                                                            type="radio"
                                                            name="approverType"
                                                            value="Individual"
                                                            className="form-check-input"
                                                            checked={selectedOptiontask === "Individual"}
                                                            onChange={handleRadioChangeArrestForward}
                                                        />
                                                        <label
                                                            className="form-check-label mb-0"
                                                            htmlFor="Individual"
                                                        >
                                                            By User
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <div className="form-check ml-2">
                                                        <input
                                                            type="radio"
                                                            name="approverType"
                                                            value="Group"
                                                            className="form-check-input"
                                                            checked={selectedOptiontask === "Group"}
                                                            onChange={handleRadioChangeArrestForward}
                                                        />
                                                        <label
                                                            className="form-check-label mb-0"
                                                            htmlFor="Group"
                                                        >
                                                            By Group
                                                        </label>
                                                    </div>
                                                </div>
                                                <>
                                                    {selectedOptiontask === "Individual" ? (
                                                        <>
                                                            {/* <div className="col-2 col-md-2 col-lg-2">
                                                                <span className="label-name">
                                                                    {errors.ApprovingOfficerError !==
                                                                        "true" && (
                                                                            <p
                                                                                style={{
                                                                                    color: "red",
                                                                                    fontSize: "13px",
                                                                                    margin: "0px",
                                                                                    padding: "0px",
                                                                                    fontWeight: "400",
                                                                                }}
                                                                            >
                                                                                {errors.ApprovingOfficerError}
                                                                            </p>
                                                                        )}
                                                                </span>
                                                            </div> */}
                                                            <div className="col-4 col-md-12 col-lg-6 dropdown__box mt-0">
                                                                <SelectBox
                                                                    className="custom-multiselect"
                                                                    classNamePrefix="custom"
                                                                    options={agencyOfficerDrpData}
                                                                    isMulti
                                                                    required
                                                                    menuPlacement="top"
                                                                    styles={colourStylesUsers}
                                                                    closeMenuOnSelect={false}
                                                                    onChange={Agencychange}
                                                                    value={multiSelected.optionSelected}
                                                                    // isDisabled={value.Status === "Pending Review" || value.Status === "Approved"}
                                                                    // menuPlacement="top"
                                                                    // hideSelectedOptions={true}
                                                                    allowSelectAll={true}
                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* <div className="col-2 col-md-2 col-lg-2 ">
                                                                <span className="label-name">
                                                                    {errors.ApprovingOfficerError !==
                                                                        "true" && (
                                                                            <p
                                                                                style={{
                                                                                    color: "red",
                                                                                    fontSize: "13px",
                                                                                    margin: "0px",
                                                                                    padding: "0px",
                                                                                    fontWeight: "400",
                                                                                }}
                                                                            >
                                                                                {errors.ApprovingOfficerError}
                                                                            </p>
                                                                        )}
                                                                </span>
                                                            </div> */}
                                                            <div className="col-4 col-md-12 col-lg-6 dropdown__box mt-0">
                                                                <SelectBox
                                                                    className="custom-multiselect"
                                                                    classNamePrefix="custom"
                                                                    options={groupList}
                                                                    menuPlacement="top"
                                                                    isMulti
                                                                    styles={colourStylesUsers}
                                                                    closeMenuOnSelect={false}
                                                                    hideSelectedOptions={true}
                                                                    onChange={Agencychange}
                                                                    allowSelectAll={true}
                                                                    value={multiSelected.optionSelected}
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            </>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-1 px-1 d-flex justify-content-end">
                                            <button
                                                type="button"
                                                className="btn btn-sm mb-2 mt-1"
                                                style={{
                                                    backgroundColor: "#001f3f",
                                                    color: "#fff",
                                                }}
                                                onClick={handleSendToTaskList}
                                                // disabled={!(taskToSend && value.OfficerID)}
                                                disabled={
                                                    isSendButtonDisabled
                                                        ? true
                                                        : !(taskToSend && value.OfficerID)
                                                }
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </>

                                    {/* <div className="col-6 col-md-2 col-lg-2 ">
                                        <label htmlFor="" className='new-label mb-0'>Collecting Officer
                                            {CollectingOfficerError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{CollectingOfficerError}</p>
                                            ) : null}
                                        </label>
                                    </div>
                                    <div className="col-4 col-md-3 col-lg-2 ">
                                        <Select
                                            name='CollectingOfficer'
                                            //  styles={colourStyles}
                                            value={agencyOfficerDrpData?.filter((obj) => obj.value == collectingOfficer)}
                                            options={agencyOfficerDrpData}
                                            onChange={(e) => ChangeDropDown(e, 'CollectingOfficer')}
                                            placeholder="Select.."
                                            menuPlacement="bottom"
                                            isClearable
                                            styles={colourStyles}
                                        />
                                    </div> */}


                                </div>

                                <div className='row ' >
                                    <div className='col-lg-1'></div>
                                    {taskListStatus && (
                                        <p
                                            style={{
                                                color: '#001f3f',
                                                fontSize: '16px',
                                                fontWeight: 500,
                                                margin: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {taskListStatus}
                                        </p>
                                    )}
                                </div>
                            </fieldset>

                    }
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12 mt-2 px-0 ">
                        <fieldset>
                            <legend>Project Management</legend>
                            <div className="row px-0 mt-1">
                                <div className="col-3 col-md-2 col-lg-1 pt-1">
                                    <label htmlFor="" className='new-label '>Activity Type</label>
                                </div>
                                <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                                    <div className="form-check  ">
                                        <input className="form-check-input" type="radio" value="CheckIn" name="AttemptComplete" checked={value?.IsCheckIn}
                                            disabled={!rowClicked || selectedStatus === 'TransferLocation' || selectedStatus === 'Update' || selectedStatus === 'CheckIn' || selectedStatus === 'Release' || selectedStatus === 'Destroy'} id="flexRadioDefault" onChange={handleRadioChange} />
                                        <label style={{ fontWeight: value?.IsCheckIn ? 'bold' : 'normal' }} className="form-check-label" htmlFor="flexRadioDefault">
                                            Check In
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                                    <div className="form-check  ">
                                        <input className="form-check-input" type="radio" value="CheckOut" name="AttemptComplete" checked={value?.IsCheckOut}
                                            disabled={!rowClicked || selectedStatus === 'CheckOut' || selectedStatus === null || selectedStatus === 'Release' || selectedStatus === 'Destroy'} id="flexRadioDefault1" onChange={handleRadioChange} />
                                        <label style={{ fontWeight: value?.IsCheckOut ? 'bold' : 'normal' }} className="form-check-label" htmlFor="flexRadioDefault1">
                                            Check Out
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                                    <div className="form-check  ">
                                        <input className="form-check-input" type="radio" value="Release" name="AttemptComplete" checked={value?.IsRelease}
                                            disabled={!rowClicked || selectedStatus === 'Release' || selectedStatus === null || selectedStatus === 'Release' || selectedStatus === 'Destroy'} id="flexRadioDefault2" onChange={handleRadioChange} />
                                        <label style={{ fontWeight: value?.IsRelease ? 'bold' : 'normal' }} className="form-check-label" htmlFor="flexRadioDefault2 ">
                                            Release
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                                    <div className="form-check  ">
                                        <input className="form-check-input" type="radio" value="Destroy" name="AttemptComplete" checked={value?.IsDestroy}
                                            disabled={!rowClicked || selectedStatus === 'Destroy' || selectedStatus === null || selectedStatus === 'Release' || selectedStatus === 'Destroy'} id="flexRadioDefault3" onChange={handleRadioChange} />
                                        <label style={{ fontWeight: value?.IsDestroy ? 'bold' : 'normal' }} className="form-check-label" htmlFor="flexRadioDefault3">
                                            Destroy
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                                    <div className="form-check  ">
                                        <input className="form-check-input" type="radio" value="TransferLocation" name="AttemptComplete" checked={value?.IsTransferLocation}
                                            disabled={!rowClicked || selectedStatus === 'TransferLocation' || selectedStatus === null || selectedStatus === 'Release' || selectedStatus === 'Destroy'} id="flexRadioDefault4" onChange={handleRadioChange} />
                                        <label style={{ fontWeight: value?.IsTransferLocation ? 'bold' : 'normal' }} className="form-check-label" htmlFor="flexRadioDefault4">
                                            Transfer Location
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-lg-1  pt-1 ">
                                    <div className="form-check  ">
                                        <input className="form-check-input" type="radio" value="Update" name="AttemptComplete" checked={value?.IsUpdate}
                                            disabled={!rowClicked || selectedStatus === 'Update' || selectedStatus === null || selectedStatus === 'Release' || selectedStatus === 'Destroy'} id="flexRadioDefault5" onChange={handleRadioChange} />
                                        <label style={{ fontWeight: value?.IsUpdate ? 'bold' : 'normal' }} className="form-check-label" htmlFor="flexRadioDefault5">
                                            Update
                                        </label>
                                    </div>
                                </div>

                                {/* <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                                    <label htmlFor="" className='new-label'>Reason{errors.ReasonError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                    <Select
                                        name='ActivityReasonID'
                                        value={reasonIdDrp?.filter((obj) => obj.value === value?.ActivityReasonID)}
                                        isClearable
                                        options={reasonIdDrp}
                                        onChange={(e) => ChangeDropDown(e, 'ActivityReasonID')}
                                        placeholder="Select..."
                                        styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
                                        isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                    />
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                                    <label htmlFor="" className='new-label'>{((selectedOption === "" || selectedOption === null) ? "CheckIn" : selectedOption === "Destroy" ? "Destruction" : (selectedOption === "TransferLocation" ? "Transfer" : selectedOption))} Date/Time{errors.ActivityDtTmError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ActivityDtTmError}</p>
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
                                        // filterTime={filterPassedTime}
                                        filterTime={(time) => filterTimeForDateZone(time, datezone)}
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
                                        // className='requiredColor'
                                        disabled={selectedOption === null || selectedOption === ''}
                                        className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                                    />
                                </div> */}
                                {/* {!(selectedOption === "TransferLocation") &&
                                    <>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                                            <label htmlFor="" className='new-label'>{((selectedOption === '' || selectedOption === null) ? "Investigator" : selectedOption === "Destroy" ? "Destruction" : (selectedOption === "Update" ? "Updating" : (selectedOption === "Release" || selectedOption === "CheckOut") ? "Releasing" : selectedOption === "CheckIn" ? "Submitting" : "Investigator"))} Officer{errors.InvestigatorError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.InvestigatorError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mt-1">
                                            <Select
                                                name='InvestigatorID'
                                                value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.InvestigatorID)}
                                                isClearable
                                                options={agencyOfficerDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'InvestigatorID')}
                                                placeholder="Select..."
                                                isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                            // styles={colourStyles}
                                            />
                                        </div>
                                    </>
                                } */}
                                {/* <div className="col-3 col-md-3 col-lg-1 mt-2">
                                    <label htmlFor="" className='new-label'>{selectedOption === "CheckOut" ? "Recipient Officer" : "Property Room Officer"}{errors.PropertyError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                    <Select
                                        name='OtherPersonNameID'
                                        value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OtherPersonNameID)}
                                        isClearable
                                        options={agencyOfficerDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'OtherPersonNameID')}
                                        placeholder="Select..."
                                        styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
                                        isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                    />
                                </div> */}
                                {/* {selectedOption === "CheckOut" &&
                                    <>
                                        <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                                            <label htmlFor="" className='new-label'>Expected Return Date/Time{errors.ExpectedDateError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ExpectedDateError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-2 ">
                                            <DatePicker
                                                name='ExpectedDate'
                                                id='ExpectedDate'
                                                onKeyDown={(e) => {
                                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                        e?.preventDefault();
                                                    }
                                                }}
                                                onChange={(date) => {
                                                    setExpecteddate(date); setValue({ ...value, ['ExpectedDate']: date ? getShowingMonthDateYear(date) : null, });

                                                }}
                                                isClearable={expecteddate ? true : false}
                                                selected={expecteddate}
                                                placeholderText={expecteddate ? expecteddate : 'Select...'}
                                                dateFormat="MM/dd/yyyy"
                                                filterTime={filterPassedTime}
                                                // timeInputLabel
                                                // showTimeSelect
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                showDisabledMonthNavigation
                                                autoComplete='off'
                                                // maxDate={new Date()}
                                                className={value.IsCheckIn || value.IsRelease || value.IsDestroy || value.IsTransferLocation || value.IsUpdate || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}
                                                disabled={value.IsCheckIn || value.IsRelease || value.IsDestroy || value.IsTransferLocation || value.IsUpdate || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                            />
                                        </div>
                                    </>
                                } */}



                                {/* <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                                    <label htmlFor="" className='new-label'>{selectedOption === null || selectedOption === '' ? "Officer Name" : "Approval Officer"}{errors.OfficerNameError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerNameError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-3 mt-1">
                                    <Select
                                        name='OfficerNameID'
                                        value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerNameID)}
                                        isClearable
                                        options={agencyOfficerDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                                        placeholder="Select..."
                                        styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
                                        isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                    />
                                </div>
                                <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                                    <label htmlFor="" className='new-label'>Evidence Type</label>
                                </div>

                                <div className="col-9 col-md-9 col-lg-3 text-field mt-1">
                                    <input type="text" name="EvidenceType" disabled={!rowClicked} className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.EvidenceType} onChange={(e) => { handleChange(e) }} />
                                </div>

                                <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                    <label htmlFor="" className='new-label'>Storage Location{errors.LocationError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LocationError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-8 col-lg-6 text-field mt-1">
                                    <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={locationStatus ? '' : value.location} disabled className={(value.IsCheckIn || value.IsTransferLocation || value.IsRelease)
                                        ? 'requiredColor'
                                        : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                                            ? 'readonlyColor'
                                            : ''} />

                                    {value.location ? (
                                        <span style={{
                                            position: 'absolute',
                                            top: '40%',
                                            right: '10px',
                                            transform: 'translateY(-50%)',
                                            cursor: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'not-allowed' : 'pointer',
                                            opacity: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 0.5 : 1,
                                            pointerEvents: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'none' : 'auto'
                                        }} className='select-cancel' onClick={handleClickedCleared}>
                                            <i className='fa fa-times'></i>
                                        </span>
                                    ) : (null)}
                                </div> */}
                                {/* <div className="col-1 pt-1" >
                                    <button disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null}
                                        className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                                            setlocationStatus(true);
                                        }}>
                                        <i className="fa fa-plus" > </i>
                                    </button>
                                </div> */}
                                {/* <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                    <label htmlFor="" className='new-label'>Name{errors.NameError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NameError}</p>
                                    ) : null}</label>
                                </div>
                                <div className='d-flex col-3 col-md-8 col-lg-3'>
                                    <div className="col-4 col-md-12 col-lg-11  mt-1">
                                        <Select
                                            name='OwnerNameID'
                                            options={mastersNameDrpData}
                                            value={mastersNameDrpData?.filter((obj) => obj.value === value?.PropertyRoomPersonNameID)}
                                            isClearable={value?.OwnerNameID ? true : false}
                                            onChange={(e) => ChangeDropDown(e, 'PropertyRoomPersonNameID')}
                                            placeholder="Select..."
                                            isDisabled={value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsUpdate || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                            styles={value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsUpdate || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}

                                        />
                                        <Select
                                name='Investigator'

                                isClearable
                                placeholder="Select..."
                                // isDisabled={isCheckInSelected}
                                isDisabled={value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsUpdate || value.IsTransferLocation}
                                styles={value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsUpdate || value.IsTransferLocation ? 'readonlyColor' : 'requiredColor'}
                            />
                                    </div>
                                    <div className="col-1 pt-1" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                                        <button disabled={!rowClicked || selectedOption === null} onClick={() => {
                                            if (possessionID) { GetSingleDataPassion(possessionID); } setNameModalStatus(true);
                                        }}
                                            className=" btn btn-sm bg-green text-white py-1"   >
                                            <i className="fa fa-plus" > </i>
                                        </button>
                                    </div>
                                </div> */}
                                {/* <div className='col-12 col-md-12 col-lg-4 mt-2'></div>
                                <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                    <label htmlFor="" className='new-label'>Comments</label>
                                </div>
                                <div className="col-9 col-md-9 col-lg-11 text-field mt-1">
                                    <input type="text" name="ActivityComments" disabled={!rowClicked} className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                                </div>
                                <div className='col-12 col-md-1 col-lg-1 mt-4'>

                                    <label htmlFor="" className='new-label text-nowrap'>
                                        File Attachment
                                    </label>
                                </div> */}
                                {/* <div className='col-12 col-md-1 col-lg-11 mt-2'>
                                    <div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", padding: "8px", borderRadius: "6px", background: "#f9f9f9", width: "100%" }}>
                                        <label
                                            htmlFor="file-input"
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: "#e9e9e9",
                                                color: "#fff",
                                                borderRadius: "4px",
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
                                                // border: "1px solid #ccc",
                                                // padding: "6px",
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
                                </div> */}




                                {/* <div className="col-3 col-md-3 col-lg-1 mt-2  ">
                                    <label htmlFor="" className='new-label text-nowrap ml-1'>Packaging Details</label>
                                </div>
                                <div className="col-9 col-md-9 col-lg-4 text-field mt-1">
                                    <input type="text" name="PackagingDetails" disabled={!rowClicked} className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.PackagingDetails} onChange={(e) => { handleChange(e) }} />
                                </div> */}
                                {/* <div className='col-lg-2'></div> */}
                                {/* <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                                    <label htmlFor="" className='new-label px-0'>Misc&nbsp;Description</label>
                                </div>
                                <div className="col-9 col-md-9 col-lg-4 text-field mt-1">
                                    <input type="text" name="ActivityComments" value={description} className='readonlyColor' />
                                </div> */}
                            </div>

                        </fieldset>
                    </div>


                </div>
















            </div >
            {/* <div className="col-12 col-md-12 col-lg-12 pt-2 px-0 " >
                <fieldset>
                    <legend>Schedule</legend>
                    <div className="row px-0">
                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Court Date{errors.CourtDateError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtDateError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 px-0">
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
                                // timeInputLabel
                                // showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                showDisabledMonthNavigation
                                autoComplete='off'
                                minDate={new Date()}
                                maxDate={value.ReleaseDate ? new Date(value?.ReleaseDate) : ''}

                                // className='requiredColor'
                                disabled={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                className={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}

                            />
                        </div>
                        <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                            <label htmlFor="" className='new-label'>Release Date{errors.ReleaseDateError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReleaseDateError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 ">
                            <DatePicker
                                name='ReleaseDate'
                                id='ReleaseDate'
                                onKeyDown={(e) => {
                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                        e?.preventDefault();
                                    }
                                }}
                                onChange={(date) => {
                                    setreleasedate(date); setValue({ ...value, ['ReleaseDate']: date ? getShowingMonthDateYear(date) : null, });

                                }}
                                isClearable={releasedate ? true : false}
                                selected={releasedate}
                                placeholderText={releasedate ? releasedate : 'Select...'}
                                dateFormat="MM/dd/yyyy"
                                filterTime={filterPassedTime}
                                // timeInputLabel
                                // showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                showDisabledMonthNavigation
                                autoComplete='off'
                                minDate={courtdate ? new Date(courtdate) : new Date()}
                                disabled={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                className={value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}

                            />
                        </div>
                        <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                            <label htmlFor="" className='new-label'>Destroy&nbsp;Date{errors.DestroyDateError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DestroyDateError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-4 ">
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
                                // timeInputLabel
                                // showTimeSelect
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
                    </div >
                </fieldset>
            </div> */}



            {/* <div className="col-12 col-md-12 col-lg-12    mt-1">
                <div className="row mb-1 px-0">
                    <div className="col-1 pt-2" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                        <button
                            className=" btn btn-sm bg-green text-white py-0 px-1" onClick={(e) => { check_Validation_Errorr(); }}>
                            <i className="fa fa-search"> </i>
                        </button>
                    // </div>

                </div>
            </div> */}

            <div className="div ">
                {(selectedOption !== "CheckOut" && selectedOption !== "Release" && selectedOption !== "Destroy" && selectedOption !== "TransferLocation" && selectedOption !== "Update") && <div className='row align-items-center' style={{ rowGap: "8px" }}>
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
                            isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
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

                    <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Storage Location{errors.StorageLocationError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StorageLocationError}</p>
                        ) : null}</label>
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
                            <div className="col-3 col-md-3 col-lg-2 ">
                                <DatePicker
                                    name='ReleaseDate'
                                    id='ReleaseDate'
                                    onChange={(date) => {
                                        setreleasedate(date); setValue({ ...value, ['ReleaseDate']: date ? getShowingMonthDateYear(date) : null, });

                                    }}
                                    isClearable={releasedate ? true : false}
                                    selected={releasedate}
                                    placeholderText={releasedate ? releasedate : 'Select...'}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                        <label htmlFor="" className='new-label mb-0'>Expected Return Date/Time{errors.ExpectedReturnDateTimeError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ExpectedReturnDateTimeError}</p>
                        ) : null}</label>
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
                            className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
                            isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                    </div>
                    <div className="col-3 col-md-3 col-lg-2  ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Receipient Officer{errors.ReasonError !== 'true' ? (
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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

                        {/* {value.location ? (
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
                        ) : (null)} */}
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





                </div>}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
                            isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                    </div>
                    <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Receipient {errors.ReceipientError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReceipientError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-0">

                        <Select
                            name='ReceipentID'
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReceipentID)}
                            isClearable
                            options={agencyOfficerDrpData}
                            onChange={(e) => ChangeDropDown(e, 'ReceipentID')}
                            placeholder="Select..."
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
                            isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                    </div>

                    <div className="col-3 col-md-3 col-lg-2 ">
                        <label htmlFor="" className='new-label px-0 mb-0'>Receipient Location</label>
                    </div>
                    <div className="col-12 col-md-12 col-lg-2    ">
                        <input type="text" onChange={(e) => { handleChange(e) }} name="locationsdgf" style={{ position: 'relative' }} value={value.locationsdgf} className={`form-control`}
                        />

                        {/* {value.location ? (
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
                        ) : (null)} */}
                    </div>


                    {/* <div className="col-1" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                                        <button disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null}
                                            className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                                                setlocationStatus(true);
                                            }}>
                                            <i className="fa fa-plus" > </i>
                                        </button>
                                    </div> */}

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

                        {/* {value.location ? (
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
                        ) : (null)} */}






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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
                            isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />


                    </div>

                    <div className="col-3 col-md-3 col-lg-2  ">
                        <label htmlFor="" className='new-label px-0 mb-0'> Destruction Location</label>
                    </div>
                    <div className="col-12 col-md-12 col-lg-2 ">
                        <Select
                            name='DestructionLocation'
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.DestructionLocation)}
                            isClearable
                            options={agencyOfficerDrpData}
                            onChange={(e) => ChangeDropDown(e, 'DestructionLocation')}
                            placeholder="Select..."
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}
                            isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                        />
                    </div>
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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

                        {/* {value.location ? (
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
                        ) : (null)} */}
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
                {selectedOption === "TransferLocation" &&
                    <>
                        <div className='row align-items-center  mb-1'>
                            <div className="col-12 col-md-4 col-lg-2  "></div>
                            <div className="col-12 col-md-4 col-lg-2">
                                <div className="form-check">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        value="IsInternalTransfer"
                                        // name="AttemptComplete"
                                        checked={value?.IsInternalTransfer}
                                        // id="flexRadioDefault"
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
                                        value="IsExternalTransfer"
                                        // name="AttemptComplete"
                                        checked={value?.IsExternalTransfer}
                                        // id="flexRadioDefault1"
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
                                    styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                                    styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                                    styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                                                styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                                        <i className="fa fa-times"></i>
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
                                        onClick={() => { handleClickedClearedDestination("DestinationStorageLocation") }}
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
                                                // setKeyChange("DestinationStorageLocation")
                                                setstoragetype('NewStorageLocation')
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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
                            styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : colourStyles}
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


                    </div>
                    {/** ➕ Add Button Section **/}

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

            <div className=" col-12  mt-2 btn-box d-flex justify-content-between align-items-center" >

                <div className="row propertyroom-button">
                    <div className='mr-1 mt-1 ' style={{ width: '150px' }}>
                        <Select
                            name='Investigator'
                            styles={customStylesWithOutColor}
                            isClearable
                            placeholder="Export..."
                            menuPlacement='top'
                        />
                    </div>
                    <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1">
                        Email Report
                    </button>
                    {/* {
                            (propertyId || masterpropertyId) &&
                            <button type="button" className="btn btn-sm btn-success mx-1" onClick={() => { setPrintStatus(true) }}>Print Barcode</button>
                        } */}
                    <button type="button" onClick={() => { setPrintStatus(true) }} className="btn btn-sm btn-success mr-2 mb-2 mt-1">
                        Print Barcode
                    </button>
                    <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={GetChainCustodyReport} disabled={!selectedStatus}>
                        Chain Of Custody Report
                    </button>
                    <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={printForm} disabled={selectedStatus !== 'Release'}>
                        Display Property Released Receipt
                    </button>
                    <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1">
                        Export
                    </button>
                </div>

                <div>
                    <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1 " onClick={onDashboardClose}>
                        Close
                    </button>

                    <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={() => { setStatusFalse(); }}>
                        Clear
                    </button>
                    <button type="button" disabled={radioButtonStatus === false} className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={(e) => {
                        check_Validation_Error();
                        setEnabledStatus("")
                    }}>
                        Save
                    </button>
                </div>

            </div>
            <TreeModel {...{ proRoom, locationStatus, storagetype, setlocationStatus, locationPath, setfunctiondone, setLocationPath, setSearchStoragePath, searchStoStatus, setSearchStoStatus, setStorageLocationID, value, setValue, setPropertyNumber }} />
            <TreeComponent {...{ proRoom }} />
            {/* <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possessionID, setPossessionID, possenSinglData, setPossenSinglData, GetSingleDataPassion }} />  */}
            <BarCode agencyID={loginAgencyID} propID={propertyId} masPropID={masterpropertyId} codeNo={propertyNumber} printStatus={printStatus} setPrintStatus={setPrintStatus} />

            <PropertyReportRoom {...{ releasestatus, setReleaseStatus, reportStatus, editval, componentRef }} />
            <ChainOfModel {...{ componentRefnew, chainreport }} />
            <TaskListModal changesStatus={taskListModalStatus} setChangesStatus={setTaskListModalStatus} InSertBasicInfo={handleSendToTaskList} taskToSend={taskToSend} value={value} />


        </>
    )
}

export default Home












{/* <div className="col-12 col-md-12 col-lg-12    mt-1">
<div className="row mb-1 px-0">
    <div className="col-3 col-md-2 col-lg-1 mt-2">
        <label htmlFor="" className='new-label'>Type</label>
    </div>
    <div className="col-4 col-md-3 col-lg-3 mt-1">
        <Select
            name='AddType'
            value={selectedOptions}
            // value={AddType.find(option => option.label === selectedOptions)}
            onChange={(selectedOption) => {
                setSelectedOptions(selectedOption);
                setPropertyNumber('');
                setsearcherror(prevValues => {
                    return { ...prevValues, 'SearchError': '', }
                })
            }}
            defaultValue={AddType[0]}
            placeholder="Select..."
            options={AddType}
            menuPlacement='top'
        />
    </div>
    {selectedOptions?.value === 'PropertyNumber' && (
        <>
            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                <label htmlFor="" className='new-label'>Property No.{searcherror.SearchError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                ) : null}</label>
            </div>
            <div className="col-4 col-md-3 col-lg-2">
                <div className="text-field mt-1">
                    <input type="text" value={propertyNumber} onChange={handleInputChange} />
                </div>
            </div>
        </>
    )}
    {selectedOptions?.value === 'StorageLocationID' && (
        <>
            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                <label htmlFor="" className='new-label'>Location{searcherror.SearchError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                ) : null}</label>
            </div>
            <div className="col-4 col-md-3 col-lg-2 ">
                <div className="text-field mt-1 " data-toggle="modal" data-target="#PropertyRoomTreeModal">
                    <input type="text" value={searchStoragepath} onClick={() => {
                        // setlocationStatus(true);
                        setSearchStoStatus(true);
                    }} />
                </div>
            </div>
        </>
    )}
    {selectedOptions?.label === 'Barcode' && (
        <>
            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                <label htmlFor="" className='new-label'>Barcode{searcherror.SearchError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                ) : null}</label>
            </div>
            <div className="col-4 col-md-3 col-lg-2">
                <div className="text-field mt-1">
                    <input type="text" value={propertyNumber} onChange={handleInputChange} />
                </div>
            </div>
        </>
    )}
    {selectedOptions?.value === 'IncidentNumber' && (
        <>
            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                <label htmlFor="" className='new-label'>Transaction Number{searcherror.SearchError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                ) : null}</label>
            </div>
            <div className="col-4 col-md-3 col-lg-2">
                <div className="text-field mt-1">
                    <input type="text" value={propertyNumber} onChange={handleInputChange} />
                </div>
            </div>
        </>
    )}


    {selectedOptions?.value === 'PropertyTypeID' && (
        <>
            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                <label htmlFor="" className='new-label'>Property Type{searcherror.SearchError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                ) : null}</label>
            </div>
            <div className="col-4 col-md-3 col-lg-2">
                <div className=" mt-1">
                    <Select

                        name='PropertyTypeID'
                        value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                        options={propertyTypeData}
                        onChange={(e) => ChangeDropDowns(e, 'PropertyTypeID')}
                        isClearable
                        placeholder="Select..."
                    // isDisabled={propertyID || masterPropertyID ? true : false}
                    />
                </div>
            </div>
        </>

    )}

    {selectedOptions?.value === 'PropertyTag' && (
        <>
            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                <label htmlFor="" className='new-label'>Property Tag{searcherror.SearchError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{searcherror.SearchError}</p>
                ) : null}</label>
            </div>
            <div className="col-4 col-md-3 col-lg-2">
                <div className="text-field mt-1">
                    <input type="text" value={propertyNumber} onChange={handleInputChange} />
                </div>
            </div>
        </>
    )}

    <div className="col-1 pt-2" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
        <button
            className=" btn btn-sm bg-green text-white py-0 px-1" onClick={(e) => { check_Validation_Errorr(); }}>
            <i className="fa fa-search"> </i>
        </button>
    </div> */}