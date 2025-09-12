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

    const { DecPropID, DecMPropID, DecIncID, ProCategory, } = props
    const { get_Property_Count, setChangesStatus, GetDataTimeZone, datezone, } = useContext(AgencyContext);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

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
    const [activityDate, setactivitydate] = useState();
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

    const fileInputRef = useRef(null)
    const [value, setValue] = useState({
        'PropertyID': '', 'MasterPropertyId': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'OtherPersonNameID': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
        'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
        'IsCheckIn': false, 'IsCheckOut': false, 'IsRelease': false, 'IsDestroy': false, 'IsTransferLocation': false, 'IsUpdate': false, 'CreatedByUserFK': '', 'ActivityDtTm': '', 'LastSeenDtTm': '',
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
        const ReasonError = !rowClicked || selectedOption === null ? true : RequiredFieldIncident(value.ActivityReasonID);
        const PropertyError = !rowClicked || selectedOption === null ? true : RequiredFieldIncident(value.OtherPersonNameID);
        const OfficerNameError = !rowClicked || selectedOption === null ? true : RequiredFieldIncident(value.OfficerNameID);
        const NameError = value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || value.IsUpdate || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'true' : RequiredFieldIncident(value.PropertyRoomPersonNameID);
        const CourtDateError = RequiredFieldIncident(value.CourtDate);
        const ReleaseDateError = RequiredFieldIncident(value.ReleaseDate);
        const DestroyDateError = RequiredFieldIncident(value.DestroyDate);
        const LocationError = value.IsCheckIn || value.IsTransferLocation || value.IsRelease ? RequiredFieldIncident(value.location) : 'true';
        const ActivityDtTmError = !rowClicked || selectedOption === null ? true : RequiredFieldIncident(value.ActivityDtTm);

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['ReasonError']: ReasonError || prevValues['ReasonError'],
                ['PropertyError']: PropertyError || prevValues['PropertyError'],
                ['OfficerNameError']: OfficerNameError || prevValues['OfficerNameError'],
                ['NameError']: NameError || prevValues['NameError'],
                ['LocationError']: LocationError || prevValues['LocationError'],
                ['ActivityDtTmError']: ActivityDtTmError || prevValues['ActivityDtTmError'],
            }
        })
    }
    const { ReasonError, PropertyError, ExpectedDateError, OfficerNameError, NameError, LocationError, ActivityDtTmError } = errors

    useEffect(() => {

        if (ReasonError === 'true' && PropertyError === 'true' && OfficerNameError === 'true' && NameError === 'true' && LocationError === 'true' && ActivityDtTmError === 'true') {

            { Add_Type() }
        }
    }, [ReasonError, PropertyError, OfficerNameError, NameError, LocationError, ActivityDtTmError])

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
            'MasterPropertyId': '', 'IsCheckIn': '', 'PackagingDetails': '', 'IsCheckOut': '', 'IsRelease': '', 'IsDestroy': '', 'IsTransferLocation': '', 'IsUpdate': '', 'CreatedByUserFK': '', 'LastSeenDtTm': '',
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


    return (
        <>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12 mt-2 px-0 ">
                    <fieldset>
                        <legend>Project Management</legend>
                        <div className="row px-0">
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

                            <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
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
                                    styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                                    isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                                <label htmlFor="" className='new-label'>Activity Date/Time{errors.ActivityDtTmError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ActivityDtTmError}</p>
                                ) : null}</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 ">

                                {/* <DatePicker
                                    name='activitydate'
                                    id='activitydate'
                                    onChange={(selectedDate) => {
                                        if (!selectedDate) {
                                            // User ne clear kiya hai
                                            setactivitydate(null);
                                            setValue({ ...value, ['ActivityDtTm']: null });
                                            setChangesStatus(true);
                                            return;
                                        }

                                        const rptDate = new Date(ReportedDtTm);
                                        const zoneDate = new Date(datezone);

                                        // Selected date ka date part lo
                                        let currDate = new Date(selectedDate);

                                        // Current system time us date mein set karo
                                        const now = new Date();
                                        currDate.setHours(now.getHours());
                                        currDate.setMinutes(now.getMinutes());
                                        currDate.setSeconds(now.getSeconds());
                                        currDate.setMilliseconds(now.getMilliseconds());

                                        // Date validation
                                        if (currDate.getTime() < rptDate.getTime()) {
                                            currDate = new Date(rptDate.getTime() + 60000);
                                        }
                                        if (currDate.getTime() > zoneDate.getTime()) {
                                            currDate = zoneDate;
                                        }

                                        setChangesStatus(true);
                                        setactivitydate(currDate);
                                        setValue({ ...value, ['ActivityDtTm']: currDate ? getShowingMonthDateYear(currDate) : null });
                                    }}

                                    isClearable={activityDate ? true : false}
                                    selected={activityDate}
                                    placeholderText={activityDate ? activityDate : 'Select...'}
                                    value={activityDate ? getShowingMonthDateYear(activityDate) : ''}
                                    minDate={new Date(ReportedDtTm)}
                                    maxDate={new Date(datezone)}
                                    showTimeSelect
                                    filterTime={(time) => filterTimeForDateZone(time, datezone)}
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    timeIntervals={1}
                                    timeCaption="Time"
                                    showMonthDropdown
                                    showYearDropdown
                                    placeholder="Select.."
                                    dropdownMode="select"
                                    className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                                    disabled={selectedOption === null || selectedOption === ''}
                                /> */}
                                <DatePicker
                                    name='ActivityDtTm'
                                    id='ActivityDtTm'
                                    selected={activityDate}
                                    onChange={(date) => {
                                        const now = new Date(datezone);

                                        if (!date) {
                                            // If user clears the date
                                            setactivitydate(null);
                                            setValue({
                                                ...value,
                                                ['ActivityDtTm']: null,
                                            });
                                            return;
                                        }

                                        // If time is 00:00:00 (i.e., only date selected), set default time to datezone time
                                        let updatedDate = new Date(date);
                                        const isMidnight = date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;

                                        if (isMidnight) {
                                            updatedDate.setHours(now.getHours());
                                            updatedDate.setMinutes(now.getMinutes());
                                            updatedDate.setSeconds(now.getSeconds());
                                        }

                                        // Prevent future date-time
                                        const finalDate = updatedDate > now ? now : updatedDate;

                                        setactivitydate(finalDate);
                                        setValue({
                                            ...value,
                                            ['ActivityDtTm']: getShowingMonthDateYear(finalDate),
                                        });
                                    }}
                                    placeholderText={activityDate ? activityDate : 'Select...'}
                                    isClearable={!!activityDate}
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    showTimeSelect
                                    timeInputLabel="Time"
                                    timeIntervals={1}
                                    timeCaption="Time"
                                    timeFormat="HH:mm"
                                    is24Hour
                                    maxDate={new Date(datezone)}
                                    filterTime={(date) => filterPassedTimeZone(date, datezone)}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    showDisabledMonthNavigation
                                    autoComplete='off'
                                    disabled={selectedOption === null || selectedOption === ''}
                                    className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                                />


                            </div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                                <label htmlFor="" className='new-label'>Investigator{errors.InvestigatorError !== 'true' ? (
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

                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                <label htmlFor="" className='new-label'>Property&nbsp;Room Officer{errors.PropertyError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyError}</p>
                                ) : null}</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                <Select
                                    name='OtherPersonNameID'
                                    value={arresteeNameData?.filter((obj) => obj.value === value?.OtherPersonNameID)}
                                    isClearable
                                    options={arresteeNameData}
                                    onChange={(e) => ChangeDropDown(e, 'OtherPersonNameID')}
                                    placeholder="Select..."
                                    styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                                    isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                                <label htmlFor="" className='new-label'>Expected Return Date{errors.ExpectedDateError !== 'true' ? (
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
                                        setChangesStatus(true);
                                        setExpecteddate(date); setValue({ ...value, ['ExpectedDate']: date ? getShowingMonthDateYear(date) : null, });

                                    }}
                                    isClearable={expecteddate ? true : false}
                                    selected={expecteddate}
                                    placeholderText={expecteddate ? expecteddate : 'Select...'}
                                    dateFormat="MM/dd/yyyy"
                                    filterTime={filterPassedTime}
                                    timeIntervals={1}
                                    timeCaption="Time"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    showDisabledMonthNavigation
                                    autoComplete='off'
                                    className={value.IsCheckIn || value.IsRelease || value.IsDestroy || value.IsTransferLocation || value.IsUpdate || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}
                                    disabled={value.IsCheckIn || value.IsRelease || value.IsDestroy || value.IsTransferLocation || value.IsUpdate || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}

                                />
                            </div>



                            <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                                <label htmlFor="" className='new-label'>Officer Name{errors.OfficerNameError !== 'true' ? (
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
                                    styles={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}
                                    isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}
                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                                <label htmlFor="" className='new-label'>Evidence Type</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                <div className="col-9 col-md-9 col-lg-4 text-field mt-1">
                                    <input type="text" name="EvidenceType" disabled={!rowClicked} className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.EvidenceType} onChange={(e) => { handleChange(e) }} />
                                </div>
                            </div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                <label htmlFor="" className='new-label'>Location{errors.LocationError !== 'true' ? (
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
                            </div>
                            <div className="col-1 pt-1" >
                                <button disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null}
                                    className=" btn btn-sm bg-green text-white" data-toggle="modal" data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
                                        setlocationStatus(true);
                                    }}>
                                    <i className="fa fa-plus" > </i>
                                </button>
                            </div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2 ">
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
                                        styles={value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsUpdate || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : Requiredcolour}

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
                            </div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                <label htmlFor="" className='new-label'>Comments</label>
                            </div>
                            <div className="col-9 col-md-9 col-lg-6 text-field mt-1">
                                <input type="text" name="ActivityComments" disabled={!rowClicked} className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                            </div>
                            <div className='col-12 col-md-12 col-lg-12 mt-2'>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", fontFamily: "Arial, sans-serif" }}>
                                    <label htmlFor="" className='new-label text-nowrap'>
                                        File Attachment
                                    </label>

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

                            <div className="col-3 col-md-3 col-lg-1 mt-2  ">
                                <label htmlFor="" className='new-label text-nowrap ml-1'>Packaging Details</label>
                            </div>
                            <div className="col-9 col-md-9 col-lg-4 text-field mt-1">
                                <input type="text" name="PackagingDetails" disabled={!rowClicked} className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.PackagingDetails} onChange={(e) => { handleChange(e) }} />
                            </div>
                            <div className='col-lg-2'></div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                                <label htmlFor="" className='new-label px-0'>Misc&nbsp;Description</label>
                            </div>

                        </div>

                    </fieldset>
                </div>


            </div>

            <div className="col-12 col-md-12 col-lg-12 pt-2 px-0 " >
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
                                    setChangesStatus(true);
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
                                    setChangesStatus(true);
                                    setreleasedate(date); setValue({ ...value, ['ReleaseDate']: date ? getShowingMonthDateYear(date) : null, });

                                }}
                                isClearable={releasedate ? true : false}
                                selected={releasedate}
                                placeholderText={releasedate ? releasedate : 'Select...'}
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
                                    setChangesStatus(true);
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
                    </div >
                </fieldset>
            </div>

            <div className="div float-right">
                <div className=" col-12  mt-2 btn-box" >
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
                        <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1">
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

                        {
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.AddOK ?
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success mr-2 mb-2 mt-1"
                                        onClick={(e) => {
                                            check_Validation_Error();
                                        }}
                                    >
                                        Save
                                    </button>
                                    :
                                    <></>
                                :
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success mr-2 mb-2 mt-1"
                                    onClick={(e) => {
                                        check_Validation_Error();
                                    }}
                                >
                                    Save
                                </button>
                        }

                        <button type="button" className="btn btn-sm btn-success mr-2 mb-2 mt-1" onClick={() => { setStatusFalse(); }}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>
            <TreeModel {...{ proRoom, locationStatus, setlocationStatus, locationPath, setfunctiondone, setLocationPath, setSearchStoragePath, searchStoStatus, setSearchStoStatus, setStorageLocationID, value, setValue, setPropertyNumber }} />

            <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possessionID, setPossessionID, possenSinglData, setPossenSinglData, GetSingleDataPassion }} />

            <ChangesModal hasPermission={permissionForAdd} func={check_Validation_Error} />
            <ChainOfModel {...{ componentRefnew, chainreport }} />


        </>
    )
}

export default PropertyManagement