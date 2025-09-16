import React, { useEffect, useState, useRef, useContext } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { base64ToString, customStylesWithOutColor, filterPassedTime, filterPassedTimeZone, getShowingMonthDateYear, Requiredcolour, stringToBase64 } from '../../../../Common/Utility';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData, PropertyRoomInsert } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { get_AgencyOfficer_Data, get_ArresteeName_Data, get_Masters_Name_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import TreeModel from '../../../PropertyRoom/PropertyRoomTab/Home/TreeModel';
import { useReactToPrint } from 'react-to-print';
import ChainOfModel from '../../../PropertyRoom/PropertyReportRoom/ChainOfModel';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';
import PropertyReportRoom from '../../../PropertyRoom/PropertyReportRoom/PropertyReportRoom';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';


const PropertyManagement = (props) => {

    const navigate = useNavigate();
    const componentRefnew = useRef();
    const componentRef = useRef();

    const { DecPropID, DecMPropID, DecIncID, ProCategory, isViewEventDetails = false } = props
    const { get_Property_Count, setChangesStatus, GetDataTimeZone, datezone, } = useContext(AgencyContext);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const primaryOfficerID = useSelector((state) => state.DropDown.agencyOfficerDrpData)

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
    const arresteeNameData = useSelector((state) => state.DropDown.arresteeNameData);

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
    var ProId = query?.get("ProId");
    var MProId = query?.get('MProId');
    var ProSta = query?.get('ProSta');
    let MstPage = query?.get('page');

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const [possenSinglData, setPossenSinglData] = useState([]);
    // date 
    const [expecteddate, setExpecteddate] = useState();
    const [courtdate, setCourtdate] = useState('');
    const [releasedate, setreleasedate] = useState('');
    const [destroydate, setdestroydate] = useState('');
    // dropdown
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');

    const [clickedRow, setClickedRow] = useState(null);
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [masterpropertyId, setMasterPropertyId] = useState('');
    const [possessionID, setPossessionID] = useState('');
    // checkbox states
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    // functionality states
    const [propertyNumber, setPropertyNumber] = useState('');
    const [rowClicked, setRowClicked] = useState(false);
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [proRoom, setProRoom] = useState('PropertyRoom');
    const [locationStatus, setlocationStatus] = useState(false);
    const [locationPath, setLocationPath] = useState();
    const [searchStoragepath, setSearchStoragePath] = useState();
    const [searchStoStatus, setSearchStoStatus] = useState();
    const [StorageLocationID, setStorageLocationID] = useState();
    const [editval, setEditval] = useState([]);
    const [categoryStatus, setcategoryStatus] = useState('');
    // const [activityDate, setactivitydate] = useState();
    const [chainreport, setChainReport] = useState();
    const [releasestatus, setReleaseStatus] = useState();
    const [type, setType] = useState("PropertyManagement");
    const [ReportedDtTm, setReportedDtTm] = useState('');
    const [functiondone, setfunctiondone] = useState(false);
    const [shouldPrintForm, setShouldPrintForm] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([])
    const [reportStatus, setreportStatus] = useState(false);
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    const [ActivityDtTm, setactivitydate] = useState();

    const fileInputRef = useRef(null)
    const [value, setValue] = useState({
        'PropertyID': '', 'MasterPropertyId': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'OtherPersonNameID': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
        'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
        'IsCheckIn': false, 'IsCheckOut': false, 'IsRelease': false, 'IsDestroy': false, 'IsTransferLocation': false, 'IsUpdate': false, 'CreatedByUserFK': '', 'ActivityDtTm': '', 'LastSeenDtTm': '', 'ModeofTransport': '', 'Destination': '', 'Internal': true,
        'External': false,
    })

    const [errors, setErrors] = useState({
        'ReasonError': '', 'ActivityDateError': '', 'InvestigatorError': '', 'PropertyError': '', 'ExpectedDateError': '', 'OfficerNameError': '', 'NameError': '', 'CourtDateError': '', 'ReleaseDateError': '', 'DestroyDateError': '', 'TypeError': '', 'TransferError': '', 'ActivityDtTmError': '',
    })

    const AddType = [
        { value: 1, label: 'Property Number' },
        { value: 2, label: 'Location' },
        { value: 3, label: 'Barcode' },
        { value: 4, label: 'Transaction Number' },
        { value: 5, label: 'Property Type' },
        { value: 6, label: 'Property Tag' },
    ]

    const AddTransfer = [
        { value: 1, label: 'Check In' },
        { value: 2, label: 'Check Out' },
        { value: 3, label: 'Release' },
        { value: 4, label: 'Destroy' },
    ]



    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            GetData_Propertyroom(MstPage === "MST-Property-Dash" ? DecMPropID : DecPropID, ProCategory, loginAgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
            // for change tab when not having  add and update permission
            // setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            // setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (localStoreData) {
            // setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("P092", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecPropID || DecMPropID) {
            setPropertyId(DecPropID);
            setMasterPropertyId(DecMPropID);
            get_Property_Count(DecPropID, DecMPropID, MstPage === "MST-Property-Dash" ? true : false);
            GetData_Propertyroom(MstPage === "MST-Property-Dash" ? DecMPropID : DecPropID, ProCategory, loginAgencyID);
        }
    }, [DecPropID, DecMPropID]);

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value,
                'IncidentID': '', 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'OtherPersonNameID': ''
            });

            if (agencyOfficerDrpData?.length === 0 && (selectedOption !== '' || selectedOption !== null)) { dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID)); }
        }
    }, [selectedOption, loginAgencyID]);



    useEffect(() => {
        //call
        dispatch(get_Masters_Name_Drp_Data(possessionID, 0, 0, IncID));
        setValue({ ...value, ['PropertyRoomPersonNameID']: parseInt(possessionID), })
    }, [possessionID, loginPinID]);


    useEffect(() => {
        if (loginAgencyID && selectedOption) {
            GetActivityReasonDrp(loginAgencyID);
        }
    }, [loginAgencyID, selectedOption]);

    useEffect(() => {
        if (DecIncID) {
            setMainIncidentID(DecIncID); dispatch(get_ArresteeName_Data('', '', DecIncID, true,));

            dispatch(get_AgencyOfficer_Data(loginAgencyID, DecIncID));
        }
    }, [DecIncID, nameModalStatus, possessionID]);

    useEffect(() => {
        if (DecPropID && ProCategory && loginAgencyID) {
            GetData_Propertyroom(MstPage === "MST-Property-Dash" ? DecMPropID : DecPropID, ProCategory, loginAgencyID);
        }
    }, [DecPropID, ProCategory, loginAgencyID]);

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
                'MasterPropertyID': [DecPropID],
                'AgencyId': loginAgencyID
            };
            const res = await AddDeleteUpadate('Propertyroom/GetData_Propertyroom', MstPage === "MST-Property-Dash" ? val2 : val1);
            const parsedData = JSON.parse(res.data);
            setSearchData(parsedData.Table);

            if (parsedData.Table && parsedData.Table.length > 0) {

                setEditval(parsedData.Table[0]);

                setcategoryStatus(parsedData.Table[0].Status);
                setRowClicked(true);
                setSelectedStatus(parsedData.Table[0].Status);
                setTimeout(() => {
                    setreportStatus(true);
                }, [1000])
                setReportedDtTm(parsedData.Table[0]?.ReportedDtTm);
                console.log("data::", parsedData.Table[0])
                if (parsedData.Table[0].Status === 'Release' && shouldPrintForm === true) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                    printForm();
                    setShouldPrintForm(false);
                }
            } else {
                console.log("No data available else executed");
                toastifyError('No Data Available');
                setRowClicked(true);
                setcategoryStatus('');
                setSelectedStatus(null);
            }
        } catch (error) {

            if (error?.response?.status === 400) {
                setRowClicked(true);
                setcategoryStatus('');
                setSelectedStatus(null);
            }


        }
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
        setSelectedOption(event.target.value);
        const { value: selectedOption } = event.target;

        setValue(prevState => ({
            ...prevState,
            'ExpectedDate': '', 'ActivityComments': '', 'OtherPersonNameID': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
            'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
            'MasterPropertyId': '', 'CreatedByUserFK': '',
            IsCheckIn: selectedOption === 'CheckIn',
            IsCheckOut: selectedOption === 'CheckOut',
            IsRelease: selectedOption === 'Release',
            IsDestroy: selectedOption === 'Destroy',
            IsTransferLocation: selectedOption === 'TransferLocation',
            IsUpdate: selectedOption === 'Update',

        }));

        setErrors({
            ...errors,
            'ReasonError': '', 'ActivityDateError': '', 'InvestigatorError': '', 'PropertyError': '', 'ExpectedDateError': '', 'OfficerNameError': '', 'NameError': '', 'CourtDateError': '', 'ReleaseDateError': '', 'DestroyDateError': '', 'TypeError': '', 'TransferError': '', 'LocationError': '', 'ActivityDtTmError': '',
        })

        if (selectedOption === 'Destroy') {
            setExpecteddate(null);
        }
        else if (selectedOption === 'CheckOut' || selectedOption === 'Destroy' || selectedOption === 'TransferLocation') {
            setCourtdate(null); setreleasedate(null); setdestroydate(null);
        }
        else if (selectedOption === 'Update') {
            GetData_Propertyroom(MstPage === "MST-Property-Dash" ? DecMPropID : DecPropID, ProCategory, loginAgencyID);
        }


    };

    const isCheckInSelected = selectedOption === 'CheckIn';

    const handleInputChange = (e) => {
        setPropertyNumber(e.target.value);
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


        } else {

        }
    }, [editval]);





    const check_Validation_Error = (e) => {
        // const ReasonError = !rowClicked || selectedOption === null ? true : RequiredFieldIncident(value.ActivityReasonID);
        // const PropertyError = !rowClicked || selectedOption === null ? true : RequiredFieldIncident(value.OtherPersonNameID);
        // const OfficerNameError = !rowClicked || selectedOption === null ? true : RequiredFieldIncident(value.OfficerNameID);
        // const NameError = value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || value.IsUpdate || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'true' : RequiredFieldIncident(value.PropertyRoomPersonNameID);
        // const CourtDateError = RequiredFieldIncident(value.CourtDate);
        // const ReleaseDateError = RequiredFieldIncident(value.ReleaseDate);
        // const DestroyDateError = RequiredFieldIncident(value.DestroyDate);
        // const LocationError = value.IsCheckIn || value.IsTransferLocation || value.IsRelease ? RequiredFieldIncident(value.location) : 'true';
        // const ActivityDtTmError = !rowClicked || selectedOption === null ? true : RequiredFieldIncident(value.ActivityDtTm);

        // setErrors(prevValues => {
        //     return {
        //         ...prevValues,
        //         ['ReasonError']: ReasonError || prevValues['ReasonError'],
        //         ['PropertyError']: PropertyError || prevValues['PropertyError'],
        //         ['OfficerNameError']: OfficerNameError || prevValues['OfficerNameError'],
        //         ['NameError']: NameError || prevValues['NameError'],
        //         ['LocationError']: LocationError || prevValues['LocationError'],
        //         ['ActivityDtTmError']: ActivityDtTmError || prevValues['ActivityDtTmError'],
        //     }
        // })
        const ReasonError = RequiredFieldIncident(value.ActivityReasonID);
        const StorageLocationError = value.IsCheckIn ? RequiredFieldIncident(value.location) : 'true';
        const PropertyRoomOfficerError = 'true';
        // const PropertyRoomOfficerError = !value.IsCheckOut ? RequiredFieldIncident(value.OfficerNameID) : 'true';
        const CheckInDateTimeError = value.IsCheckIn ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';
        const SubmittingOfficerError = value.IsCheckIn ? RequiredFieldIncident(value.InvestigatorID) : 'true';
        const CheckOutDateTimeError = value.IsCheckOut ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';
        // const ExpectedReturnDateTimeError = value.IsCheckOut ? RequiredFieldIncident(value.ExpectedDate) : 'true';
        const ReleasingOfficerError = (value.IsRelease || value.IsCheckOut) ? RequiredFieldIncident(value.ReleasingOfficerID) : 'true';
        const ReceipientError = value.IsRelease ? RequiredFieldIncident(value.OfficerNameID) : 'true';
        const ReleasedDateTimeError = value.IsRelease ? RequiredFieldIncident(value.LastSeenDtTm) : 'true';
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
                // ['ExpectedReturnDateTimeError']: ExpectedReturnDateTimeError || prevValues['ExpectedReturnDateTimeError'],
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
            }
        })
    }
    const { ReasonError, PropertyRoomOfficerError, StorageLocationError, CheckInDateTimeError, SubmittingOfficerError, CheckOutDateTimeError, ReleasingOfficerError, ReceipientError, ReleasedDateTimeError,
        DestructionDateTimeError, DestructionOfficerError, UpdatingOfficerError, ApprovalOfficerError, WitnessError, TransferDateTimeError, UpdateDateTimeError } = errors

    useEffect(() => {

        if (ReasonError === 'true' && PropertyRoomOfficerError === 'true' && StorageLocationError === 'true' && CheckInDateTimeError === 'true' && SubmittingOfficerError === 'true' && CheckOutDateTimeError === 'true' && ReleasingOfficerError === 'true' && ReceipientError === 'true' && ReleasedDateTimeError === 'true'
            && DestructionDateTimeError === 'true' && DestructionOfficerError === 'true' && UpdatingOfficerError === 'true' && ApprovalOfficerError === 'true' && WitnessError === 'true' && TransferDateTimeError === 'true' && UpdateDateTimeError === 'true'
        ) {

            { Add_Type() }
        }
    }, [ReasonError, PropertyRoomOfficerError, StorageLocationError, CheckInDateTimeError, SubmittingOfficerError, CheckOutDateTimeError, ReleasingOfficerError, ReceipientError, ReleasedDateTimeError,
        DestructionDateTimeError, DestructionOfficerError, UpdatingOfficerError, ApprovalOfficerError, WitnessError, TransferDateTimeError, UpdateDateTimeError
    ])


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
                'IncidentID': DecMPropID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
            });
        }
    }, [loginAgencyID]);

    const SearchButton = () => {
        const val = { 'AgencyID': loginAgencyID, 'PropertyNumber': propertyNumber };
        AddDeleteUpadate('Propertyroom/SearchPropertyRoom', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            setSearchData(parsedData.Table);
            if (parsedData.Table && parsedData.Table.length > 0) {
                const propertyId = parsedData.Table[0].PropertyID;
                const masterpropertyId = parsedData.Table[0].MasterPropertyID;
                setPropertyId(propertyId);
                setMasterPropertyId(masterpropertyId);
            }
        });
    };




    const Add_Type = () => {
        const formdata = new FormData();
        const PropertyID = propertyId;
        const MasterPropertyId = masterpropertyId;
        const ActivityType = selectedOption
        const CreatedByUserFK = loginPinID;
        const AgencyId = loginAgencyID;
        const { ActivityReasonID, ExpectedDate, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate,
            CourtDate, ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId,
            IsCheckIn, IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, ActivityDtTm
        } = value;
        const val = {
            PropertyID, ActivityType, ActivityReasonID, ExpectedDate, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate,
            CourtDate, ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId,
            MasterPropertyId, IsCheckIn, IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, CreatedByUserFK, AgencyId, ActivityDtTm
        };
        const valuesArrayString = JSON.stringify([val]);

        formdata.append("Data", valuesArrayString);
        for (let i = 0; i < selectedFiles?.length; i++) {
            formdata.append(`file`, selectedFiles[i]);
        }
        PropertyRoomInsert('Propertyroom/PropertyroomInsert', formdata).then((res) => {
            if (!IsUpdate) {
                reset();
            }
            setShouldPrintForm(true);
            GetData_Propertyroom(MstPage === "MST-Property-Dash" ? DecMPropID : DecPropID, ProCategory, loginAgencyID);
            setReleaseStatus(selectedOption === 'Release' ? true : false)
            toastifySuccess(res.Message);
        })
    }
    const GetChainCustodyReport = () => {
        const val = {
            'PropertyID': propertyId,
            'PropertyCategoryCode': ProCategory,
            'MasterPropertyID': 0,
            'AgencyId': loginAgencyID,
        };
        AddDeleteUpadate('Propertyroom/Report_ChainOfCustody', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            if (parsedData.Table && parsedData.Table.length > 0) {
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

    const chainForm = useReactToPrint({
        content: () => componentRefnew.current,
        documentTitle: 'Data',
        onAfterPrint: () => { console.log(chainreport) }

    })

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })

    const ChangeDropDown = (e, name) => {
        console.log("event::", e, "name::", name)
        if (e) {
            setChangesStatus(true);
            if (name === 'PropertyRoomPersonNameID') {
                setValue({ ...value, [name]: e.value })
                setPossessionID(e.value);
            }
            else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }

        }
        else {
            setChangesStatus(false);
            if (name === 'PropertyRoomPersonNameID') {
                setValue({ ...value, [name]: null })
                setPossessionID('');
            }
            else {
                setValue({
                    ...value,
                    [name]: null
                });
            }


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

    }

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
    const reset = () => {
        setValue({
            ...value,
            'PropertyID': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'OtherPersonNameID': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
            'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '', 'EvidenceType': '',
            'MasterPropertyId': '', 'IsCheckIn': '', 'PackagingDetails': '', 'IsCheckOut': '', 'IsRelease': '', 'IsDestroy': '', 'IsTransferLocation': '', 'IsUpdate': '', 'CreatedByUserFK': '', 'LastSeenDtTm': '', 'ModeofTransport': '', 'Destination': ''
        });
        setSelectedFiles([]);
        setErrors({
            ...errors,
            'ReasonError': '', 'ActivityDateError': '', 'InvestigatorError': '', 'PropertyError': '', 'ExpectedDateError': '', 'OfficerNameError': '', 'NameError': '', 'CourtDateError': '', 'ReleaseDateError': '', 'DestroyDateError': '', 'TypeError': '', 'TransferError': '', 'LocationError': '', 'ActivityDtTmError': '',
        })
        setCourtdate(''); setreleasedate(''); setdestroydate(''); setExpecteddate('');
        setSelectedOption(''); setactivitydate('')
        setReasonIdDrp([]);
        setfunctiondone(!functiondone);
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




    function handleClickedCleared() {
        setValue({
            ...value,
            'location': '',
        });
        setfunctiondone(!functiondone);

    }

    const filterTimeForDateZone = (time, datezone) => {

        let currDate = new Date(value?.ActivityDtTm);
        let zoneDate = new Date(datezone);
        let rptDate = new Date(ReportedDtTm);

        {

            if (currDate.getFullYear() === zoneDate.getFullYear() && currDate.getMonth() === zoneDate.getMonth() && currDate.getDate() === zoneDate.getDate()) {
                if (time.getHours() > zoneDate.getHours() || (time.getHours() === zoneDate.getHours() && time.getMinutes() > zoneDate.getMinutes())) {
                    return false;
                }
                return true;
            }
            if (currDate.getFullYear() === rptDate.getFullYear() && currDate.getMonth() === rptDate.getMonth() && currDate.getDate() === rptDate.getDate()) {
                if (time.getHours() > rptDate.getHours() || (time.getHours() === rptDate.getHours() && time.getMinutes() > rptDate.getMinutes())) {
                    return true;
                }
                return false;
            }

            return true;
        }

    };


    const handleRadioChangeInner = (event) => {
        const selectedOption = event.target.value;
        // setselectedOptionInternal(selectedOption);

        // Set the specific state values based on the selected option
        setValue(prevState => ({
            ...prevState,
            Internal: selectedOption === 'Internal',
            External: selectedOption === 'External',
        }));
    };
    return (
        <>
            <div className="col-12">
                <div className="row">
                    <div className="col-3 col-md-2 col-lg-1 pt-1">
                        <label htmlFor="" className='new-label'>Activity Type</label>
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
                </div>
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
                                name='LastSeenDtTm'
                                id='LastSeenDtTm'
                                onChange={(date) => {
                                    setactivitydate(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });

                                }}
                                isClearable={ActivityDtTm ? true : false}
                                selected={ActivityDtTm}
                                placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
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
                                // styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'
                                            ? 'readonlyColor' // For Release or Destroy status
                                            : (selectedStatus === 'CheckIn' ? '' : 'requiredColor') // Avoid requiredColor when status is CheckIn
                                    })
                                }}
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
                            <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={locationStatus ? '' : value.location}
                                className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
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
                                        name='activitydate'
                                        id='activitydate'
                                        onChange={(date) => {
                                            setactivitydate(date); setValue({ ...value, ['activitydate']: date ? getShowingMonthDateYear(date) : null, });

                                        }}
                                        isClearable={ActivityDtTm ? true : false}
                                        selected={ActivityDtTm}
                                        placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
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
                                isClearable={ActivityDtTm ? true : false}
                                selected={ActivityDtTm}
                                placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
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
                            <input type="text" name="ModeofTransport"
                                className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ModeofTransport} onChange={(e) => { handleChange(e) }} />
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


                        <div className="col-1" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                            <button disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null}
                                className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                                    setlocationStatus(true);
                                    // setKeyChange("location")
                                }}>
                                <i className="fa fa-plus" > </i>
                            </button>
                        </div>


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
                                name='activitydate'
                                id='activitydate'
                                onChange={(date) => {
                                    setactivitydate(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });

                                }}
                                isClearable={ActivityDtTm ? true : false}
                                selected={ActivityDtTm}
                                placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
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
                            <label htmlFor="" className='new-label px-0 mb-0'>Recipient {errors.ReceipientError !== 'true' ? (
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
                                styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                                isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                            />


                        </div>

                        <div className="col-3 col-md-3 col-lg-2 ">
                            <label htmlFor="" className='new-label px-0 mb-0'>Recipient Location</label>
                        </div>
                        <div className="col-12 col-md-12 col-lg-2    ">
                            {/* <input type="text" name="location" style={{ position: 'relative' }} id="StorageLocationID" value={locationStatus ? '' : value.location} disabled className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
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
                            ) : (null)} */}
                            <Select
                                name='ReceipentID'
                                value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReceipentID)}
                                isClearable
                                options={agencyOfficerDrpData}
                                onChange={(e) => ChangeDropDown(e, 'ReceipentID')}
                                placeholder="Select..."
                            // styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                            // isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                            />

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
                            <input type="text" name="ModeofTransport"
                                className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ModeofTransport} onChange={(e) => { handleChange(e) }} />
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
                                name='activitydate'
                                id='activitydate'
                                onChange={(date) => {
                                    setactivitydate(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });

                                }}
                                isClearable={ActivityDtTm ? true : false}
                                selected={ActivityDtTm}
                                placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
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
                            <label htmlFor="" className='new-label px-0 mb-0'>Destruction Location</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 text-field mt-0">
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
                    {selectedOption === "TransferLocation" &&
                        <>
                            <div className='row align-items-center  mb-1'>
                                <div className="col-12 col-md-4 col-lg-2  "></div>
                                <div className="col-12 col-md-4 col-lg-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="TransferType"
                                            value="Internal"
                                            checked={value.Internal}
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
                                            value="External"
                                            checked={value.External}
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
                                        // onChange={(date) => {
                                        //     settransferdate(date); setValue({ ...value, ['TransferDate']: date ? getShowingMonthDateYear(date) : null, });

                                        // }}
                                        // isClearable={transferdate ? true : false}
                                        // selected={transferdate}
                                        // placeholderText={transferdate ? transferdate : 'Select...'}
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
                                    value.External ?
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
                                                <input type="text" name="ModeofTransport"
                                                    className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ModeofTransport} onChange={(e) => { handleChange(e) }} />
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
                                        value={locationStatus ? '' : value.CurrentStorageLocation}
                                        disabled
                                        className={`form-control ${value.IsCheckIn || value.IsTransferLocation || value.IsRelease
                                            ? 'requiredColor'
                                            : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                                                ? 'readonlyColor'
                                                : ''
                                            }`}
                                    />

                                    {value.CurrentStorageLocation && (
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
                                    )}
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
                                    <label htmlFor="" className='new-label px-0 mb-0 text-nowrap'>New Storage Location</label>
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
                                                ? ''
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
                                isClearable={ActivityDtTm ? true : false}
                                selected={ActivityDtTm}
                                placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
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
                                value={locationStatus ? '' : value.CurrentStorageLocation}
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
                                        isClearable={ActivityDtTm ? true : false}
                                        selected={ActivityDtTm}
                                        placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
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
            </div >
            <div className="col-12 col-md-12 col-lg-12 pt-2 px-0" >

                <div className="row px-0">



                    {!isViewEventDetails && <div className="col-12 mt-5 btn-box text-right" >
                        <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={GetChainCustodyReport} disabled={!categoryStatus}>
                            Chain Of Custody Report
                        </button>
                        <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={printForm} disabled={categoryStatus !== 'Release'}>
                            Display Property Released Receipt
                        </button>
                        {
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.AddOK ?
                                    <button
                                        disabled={!selectedOption}
                                        type="button"
                                        className="btn btn-sm btn-success mr-2 mb-2 mt-1"
                                        onClick={(e) => { check_Validation_Error(); }}
                                    >
                                        Save
                                    </button>
                                    :
                                    <></>
                                :
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success mr-2 mb-2 mt-1"
                                    onClick={(e) => { check_Validation_Error(); }}
                                >
                                    Save
                                </button>
                        }
                        {/* <button disabled={!selectedOption} type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={(e) => { check_Validation_Error(); }}>
                                          Save
                                      </button> */}
                        <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={() => { setStatusFalse(); conditionalRowStyles(''); }}>
                            Clear
                        </button>
                    </div>
                    }
                </div >
            </div>
            <TreeModel {...{ proRoom, locationStatus, setlocationStatus, locationPath, setfunctiondone, setLocationPath, setSearchStoragePath, searchStoStatus, setSearchStoStatus, setStorageLocationID, value, setValue, setPropertyNumber }} />

            <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possessionID, setPossessionID, possenSinglData, setPossenSinglData, GetSingleDataPassion }} />


            <ChangesModal hasPermission={permissionForAdd} func={check_Validation_Error} />
            <ChainOfModel {...{ componentRefnew, chainreport }} />


        </>
    )
}

export default PropertyManagement