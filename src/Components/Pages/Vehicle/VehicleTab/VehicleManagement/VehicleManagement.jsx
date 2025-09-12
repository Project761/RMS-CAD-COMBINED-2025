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
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';


const VehicleManagement = (props) => {

    const navigate = useNavigate();
    const componentRefnew = useRef();
    const componentRef = useRef();

    const { DecVehId, DecMVehId, DecIncID, VicCategory, isViewEventDetails = false } = props
    const { GetDataTimeZone, datezone, } = useContext(AgencyContext);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
    const primaryOfficerID = useSelector((state) => state.DropDown.agencyOfficerDrpData)
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
    let MstVehicle = query?.get('page');
    let MstPage = query?.get('page');

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const [possenSinglData, setPossenSinglData] = useState([]);
    const [expecteddate, setExpecteddate] = useState();
    const [courtdate, setCourtdate] = useState('');
    const [releasedate, setreleasedate] = useState('');
    const [destroydate, setdestroydate] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [clickedRow, setClickedRow] = useState(null);
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [propertyId, setPropertyId] = useState('');
    const [masterpropertyId, setMasterPropertyId] = useState('');
    const [possessionID, setPossessionID] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
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
    const [ActivityDtTm, setactivitydate] = useState();
    const [chainreport, setChainReport] = useState();
    const [releasestatus, setReleaseStatus] = useState();
    const [functiondone, setfunctiondone] = useState(false);
    const [shouldPrintForm, setShouldPrintForm] = useState(false);
    const [value, setValue] = useState({
        'PropertyID': '', 'MasterPropertyId': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'OtherPersonNameID': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
        'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
        'IsCheckIn': false, 'IsCheckOut': false, 'IsRelease': false, 'IsDestroy': false, 'IsTransferLocation': false, 'IsUpdate': false, 'CreatedByUserFK': '', 'ActivityDtTm': '', 'LastSeenDtTm': '',
    })

    const [errors, setErrors] = useState({
        'ReasonError': '', 'ActivityDateError': '', 'InvestigatorError': '', 'PropertyError': '', 'ExpectedDateError': '', 'OfficerNameError': '', 'NameError': '', 'CourtDateError': '', 'ReleaseDateError': '', 'DestroyDateError': '', 'TypeError': '', 'TransferError': '', 'ActivityDtTmError': '',
    })


    console.log(agencyOfficerDrpData)
    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            setPropertyId(DecVehId);
            setMasterPropertyId(DecVehId);
            GetData_Propertyroom(MstVehicle === "MST-Vehicle-Dash" ? DecMVehId : DecVehId, localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecVehId || DecMVehId) {
            setPropertyId(DecVehId);
            setMasterPropertyId(DecVehId);
            GetData_Propertyroom(MstVehicle === "MST-Vehicle-Dash" ? DecMVehId : DecVehId, loginAgencyID);
        }
    }, [DecVehId, DecMVehId]);

    useEffect(() => {
        if (localStoreData) {
            // setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("V094", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value,
                'IncidentID': propertyId, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'OtherPersonNameID': ''
            }); if (primaryOfficerID?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)); }
        }
    }, [selectedOption]);

    useEffect(() => {
        console.log("VehicaleManagement")

        dispatch(get_Masters_Name_Drp_Data(possessionID, 0, 0, IncID));
        if (possessionID) { setValue({ ...value, ['PropertyRoomPersonNameID']: parseInt(possessionID), 'OfficerNameID': loginPinID, 'OtherPersonNameID': loginPinID }) }
    }, [possessionID, loginPinID]);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID && selectedOption) {
            GetActivityReasonDrp(loginAgencyID);
        }
    }, [loginAgencyID, selectedOption]);

    useEffect(() => {
        if (DecIncID) {
            setMainIncidentID(DecIncID);
            dispatch(get_AgencyOfficer_Data(loginAgencyID, DecIncID));
            dispatch(get_ArresteeName_Data('', '', DecIncID, true,));

        }
    }, [DecIncID, nameModalStatus, possessionID]);

    useEffect(() => {
        if (DecVehId && loginAgencyID && VicCategory) {
            GetData_Propertyroom(MstVehicle === "MST-Vehicle-Dash" ? DecMVehId : DecVehId, loginAgencyID);
        }
    }, [DecVehId, loginAgencyID, VicCategory]);

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value,
                'IncidentID': DecMVehId, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
            });
        }
    }, [loginAgencyID]);

    const GetData_Propertyroom = async (DecVehId, loginAgencyID) => {
        try {
            const val1 = {
                'PropertyID': DecVehId, 'PropertyCategoryCode': 'V', 'MasterPropertyID': 0, 'AgencyId': loginAgencyID
            };
            const val2 = {
                'PropertyID': 0, 'PropertyCategoryCode': 'V', 'MasterPropertyID': DecVehId, 'AgencyId': loginAgencyID
            };
            const res = await AddDeleteUpadate('Propertyroom/GetData_Propertyroom', MstVehicle === "MST-Vehicle-Dash" ? val2 : val1);
            const parsedData = JSON.parse(res.data);
            setSearchData(parsedData.Table);
            if (parsedData.Table && parsedData.Table.length > 0) {
                setEditval(parsedData.Table[0]);
                setcategoryStatus(parsedData.Table[0].Status);
                if (parsedData.Table[0].Status === 'Release' && shouldPrintForm === true) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                    printForm();
                    setShouldPrintForm(false);
                }
            } else {
                toastifyError('No Data Available');
            }
        } catch (error) {
            console.error('No Data Available');
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

    };

    const isCheckInSelected = selectedOption === 'CheckIn';

    const handleInputChange = (e) => {
        setPropertyNumber(e.target.value);
    };

    const check_Validation_Error = (e) => {
        const ReasonError = RequiredFieldIncident(value.ActivityReasonID);
        const PropertyError = RequiredFieldIncident(value.OtherPersonNameID);
        const OfficerNameError = RequiredFieldIncident(value.OfficerNameID);
        const NameError = value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsTransferLocation || value.IsUpdate ? 'true' : RequiredFieldIncident(value.PropertyRoomPersonNameID);
        const LocationError = value.IsCheckIn || value.IsTransferLocation || value.IsRelease ? RequiredFieldIncident(value.location) : 'true';
        const ActivityDtTmError = RequiredFieldIncident(value.ActivityDtTm);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['NameError']: NameError || prevValues['NameError'],

                ['ReasonError']: ReasonError || prevValues['ReasonError'],
                ['PropertyError']: PropertyError || prevValues['PropertyError'],
                ['OfficerNameError']: OfficerNameError || prevValues['OfficerNameError'],
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

    // const Add_Type = () => {
    //     const PropertyID = propertyId;
    //     const MasterPropertyId = masterpropertyId;
    //     const ActivityType = selectedOption;
    //     const AgencyID = loginAgencyID;
    //     const CreatedByUserFK = loginPinID;
    //     const { ActivityReasonID, ExpectedDate, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate,
    //         CourtDate, ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId,
    //         IsCheckIn, IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate,
    //     } = value;
    //     const val = {
    //         PropertyID: propertyId, ActivityType: selectedOption, ActivityReasonID, ExpectedDate, ActivityComments, OtherPersonNameID, PropertyRoomPersonNameID, ChainDate, DestroyDate,
    //         CourtDate, ReleaseDate, PropertyTag, RecoveryNumber, StorageLocationID, ReceiveDate, OfficerNameID, InvestigatorID, location, activityid, EventId,
    //         MasterPropertyId: masterpropertyId, IsCheckIn, IsCheckOut, IsRelease, IsDestroy, IsTransferLocation, IsUpdate, CreatedByUserFK: loginPinID, AgencyID: loginAgencyID,
    //     };
    //     AddDeleteUpadate('Propertyroom/PropertyroomInsert', val).then((res) => {
    //         reset();
    //         GetData_Propertyroom(MstVehicle === "MST-Vehicle-Dash" ? DecMVehId : DecVehId, loginAgencyID);
    //         setShouldPrintForm(true);
    //         setReleaseStatus(selectedOption === 'Release' ? true : false)
    //         toastifySuccess(res.Message);
    //         setErrors({ ...errors, 'ReasonError': '', 'ActivityDateError': '', })
    //     })
    // }

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
        PropertyRoomInsert('Propertyroom/PropertyroomInsert', formdata).then((res) => {
            if (!IsUpdate) { reset(); }
            setShouldPrintForm(true);
            GetData_Propertyroom(MstVehicle === "MST-Vehicle-Dash" ? DecMVehId : DecVehId, loginAgencyID);
            setReleaseStatus(selectedOption === 'Release' ? true : false)
            toastifySuccess(res.Message);
        })
    }

    const GetChainCustodyReport = () => {
        const val = {
            'PropertyID': propertyId,
            'PropertyCategoryCode': VicCategory,
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
            setPossessionID('');
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
        setClickedRow(null);
    }

    const reset = () => {
        setValue({
            ...value,
            'PropertyID': '', 'ActivityType': '', 'ActivityReasonID': '', 'ExpectedDate': '', 'ActivityComments': '', 'OtherPersonNameID': '', 'PropertyRoomPersonNameID': '', 'ChainDate': '', 'DestroyDate': '',
            'CourtDate': '', 'ReleaseDate': '', 'PropertyTag': '', 'RecoveryNumber': '', 'StorageLocationID': '', 'ReceiveDate': '', 'OfficerNameID': '', 'InvestigatorID': '', 'location': '', 'activityid': '', 'EventId': '',
            'MasterPropertyId': '', 'IsCheckIn': '', 'IsCheckOut': '', 'IsRelease': '', 'IsDestroy': '', 'IsTransferLocation': '', 'IsUpdate': '', 'CreatedByUserFK': '', 'LastSeenDtTm': '',
        });
        setErrors({
            ...errors,
            'ReasonError': '', 'ActivityDateError': '', 'InvestigatorError': '', 'PropertyError': '', 'ExpectedDateError': '', 'OfficerNameError': '', 'NameError': '', 'CourtDateError': '', 'ReleaseDateError': '', 'DestroyDateError': '', 'TypeError': '', 'TransferError': '', 'LocationError': '', 'ActivityDtTmError': '',
        })
        setCourtdate(''); setreleasedate(''); setdestroydate(''); setExpecteddate('');
        setSelectedStatus(''); setRowClicked(''); setSelectedOption(''); setactivitydate('')
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

    function handleClickedCleared() {
        setValue({
            ...value,
            'location': '',
        });

        setfunctiondone(!functiondone);
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




    return (
        <>
            <div className="col-12">
                <div className="row">
                    <div className="col-4 col-md-4 col-lg-2  pt-1 pl-lg-5 ml-lg-5 pl-md-0 ml-md-0">
                        <div className="form-check  ">
                            <input className="form-check-input" type="radio" value="CheckIn" name="AttemptComplete"
                                checked={value?.IsCheckIn}
                                disabled={categoryStatus === 'CheckIn' || categoryStatus === 'Release' || categoryStatus === 'Destroy'} id="flexRadioDefault"
                                onChange={handleRadioChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault">
                                Check In
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                        <div className="form-check  ">
                            <input className="form-check-input" type="radio" value="CheckOut" name="AttemptComplete" checked={value?.IsCheckOut}
                                disabled={!categoryStatus || categoryStatus === 'CheckOut' || categoryStatus === null || categoryStatus === 'Release' || categoryStatus === 'Destroy'} id="flexRadioDefault1" onChange={handleRadioChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                Check Out
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                        <div className="form-check  ">
                            <input className="form-check-input" type="radio" value="Release" name="AttemptComplete" checked={value?.IsRelease}
                                disabled={!categoryStatus || categoryStatus === 'Release' || categoryStatus === null || categoryStatus === 'Release' || categoryStatus === 'Destroy'} id="flexRadioDefault2" onChange={handleRadioChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault2 ">
                                Release
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                        <div className="form-check  ">
                            <input className="form-check-input" type="radio" value="Destroy" name="AttemptComplete" checked={value?.IsDestroy}
                                disabled={!categoryStatus || categoryStatus === 'Destroy' || categoryStatus === null || categoryStatus === 'Release' || categoryStatus === 'Destroy'} id="flexRadioDefault3" onChange={handleRadioChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault3">
                                Destroy
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-2  pt-1 ">
                        <div className="form-check  ">
                            <input className="form-check-input" type="radio" value="TransferLocation" name="AttemptComplete" checked={value?.IsTransferLocation}
                                disabled={!categoryStatus || categoryStatus === 'TransferLocation' || categoryStatus === null || categoryStatus === 'Release' || categoryStatus === 'Destroy'} id="flexRadioDefault4" onChange={handleRadioChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault4">
                                Transfer Location
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-lg-1  pt-1 ">
                        <div className="form-check  ">
                            <input className="form-check-input" type="radio" value="Update" name="AttemptComplete" checked={value?.IsUpdate}
                                disabled={!categoryStatus || categoryStatus === 'Update' || categoryStatus === null || categoryStatus === 'Release' || categoryStatus === 'Destroy'} id="flexRadioDefault5" onChange={handleRadioChange} />
                            <label className="form-check-label" htmlFor="flexRadioDefault5">
                                Update
                            </label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                        <label htmlFor="" className='new-label'>Reason{errors.ReasonError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReasonError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4 mt-1">
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
                        <label htmlFor="" className='new-label'>Investigator{errors.InvestigatorError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.InvestigatorError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4 mt-1">
                        <Select
                            name='InvestigatorID'
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.InvestigatorID)}
                            isClearable
                            options={agencyOfficerDrpData}
                            onChange={(e) => ChangeDropDown(e, 'InvestigatorID')}
                            placeholder="Select..."
                            styles={customStylesWithOutColor}
                            isDisabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}

                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2 px-0">
                        <label htmlFor="" className='new-label px-0'>Property&nbsp;Person{errors.PropertyError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4 mt-1">
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
                        <label htmlFor="" className='new-label'>Officer Name{errors.OfficerNameError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerNameError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4 mt-1">
                        <Select
                            name='OfficerNameID'
                            value={primaryOfficerID?.filter((obj) => obj.value === value?.OfficerNameID)}
                            isClearable
                            options={primaryOfficerID}
                            onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
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
                    <div className="col-3 col-md-3 col-lg-4 ">
                        {/* <DatePicker
                            name='ActivityDtTm'
                            id='ActivityDtTm'
                            onChange={(date) => {
                                if (date > new Date(datezone)) {
                                    date = new Date(datezone);
                                }
                                setactivitydate(date); setValue({ ...value, ['LastSeenDtTm']: date ? getShowingMonthDateYear(date) : null, });

                            }}
                            isClearable={ActivityDtTm ? true : false}
                            selected={ActivityDtTm}
                            placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
                            dateFormat="MM/dd/yyyy HH:mm"
                            filterTime={(date) => filterPassedTimeZone(date, datezone)}
                            timeInputLabel
                            showTimeSelect
                            timeIntervals={1}
                            timeCaption="Time"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            showDisabledMonthNavigation
                            autoComplete='off'
                            timeFormat="HH:mm "
                            is24Hour
                            maxDate={new Date(datezone)}
                            disabled={selectedOption === null || selectedOption === ''}
                            className={selectedOption === null || selectedOption === '' ? 'readonlyColor' : 'requiredColor'}
                        /> */}
                        <DatePicker
                            name='ActivityDtTm'
                            id='ActivityDtTm'
                            selected={ActivityDtTm}
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
                            placeholderText={ActivityDtTm ? ActivityDtTm : 'Select...'}
                            isClearable={!!ActivityDtTm}
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


                    <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                        <label htmlFor="" className='new-label'>Expected Return Date{errors.ExpectedDateError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ExpectedDateError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4 ">
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
                            timeIntervals={1}
                            timeCaption="Time"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            showDisabledMonthNavigation
                            autoComplete='off'
                            maxDate={new Date(datezone)}
                            className={value.IsCheckIn || value.IsRelease || value.IsDestroy || value.IsTransferLocation || value.IsUpdate || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''}
                            disabled={value.IsCheckIn || value.IsRelease || value.IsDestroy || value.IsTransferLocation || value.IsUpdate || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'}

                        />
                    </div>

                    <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label'>Location{errors.LocationError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LocationError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-8 col-md-8 col-lg-4 text-field mt-1">
                        <input type="text" name="location" id="StorageLocationID" value={locationStatus ? '' : value.location} disabled className={(value.IsCheckIn || value.IsTransferLocation || value.IsRelease)
                            ? 'requiredColor'
                            : (selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy')
                                ? 'readonlyColor'
                                : ''} />
                        {value.location ? (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '40%',
                                    right: '10px',
                                    transform: 'translateY(-50%)',
                                    cursor: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'not-allowed' : 'pointer',
                                    opacity: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 0.5 : 1,
                                    pointerEvents: !(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate || selectedOption === null) ? 'none' : 'auto'
                                }}
                                onClick={handleClickedCleared}
                            >
                                <i className='fa fa-times'></i>
                            </span>
                        ) : (null)}
                    </div>
                    <div className="col-1 pt-1" >
                        <button
                            className=" btn btn-sm bg-green text-white" data-toggle="modal" disabled={!(value.IsCheckIn || value.IsTransferLocation || value.IsRelease || value.IsCheckOut || value.IsDestroy || value.IsUpdate) || selectedOption === null} data-target="#PropertyRoomTreeModal" style={{ cursor: 'pointer' }} onClick={() => {
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
                    <div className='d-flex col-8 col-md-8 col-lg-4'>
                        <div className="col-12 col-md-12 col-lg-11  mt-1">
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
                        <div className="col-1 pt-2" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                            <button disabled={value.IsCheckIn || value.IsCheckOut || value.IsDestroy || value.IsUpdate || value.IsTransferLocation || selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'} onClick={() => {
                                if (possessionID) { GetSingleDataPassion(possessionID); } setNameModalStatus(true);
                            }}
                                className=" btn btn-sm bg-green text-white py-1"   >
                                <i className="fa fa-plus" > </i>
                            </button>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                        <label htmlFor="" className='new-label'>Comments</label>
                    </div>
                    <div className="col-9 col-md-9 col-lg-10 text-field mt-1">
                        <input type="text" name="ActivityComments" disabled={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy'} className={selectedOption === null || selectedOption === '' || selectedStatus === 'Release' || selectedStatus === 'Destroy' ? 'readonlyColor' : ''} value={value.ActivityComments} onChange={(e) => { handleChange(e) }} />
                    </div>
                </div>
            </div >
            <div className="col-12 col-md-12 col-lg-12 pt-2 px-0" >
                <fieldset>
                    <legend>Schedule</legend>
                    <div className="row px-0">
                        <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Court Date{errors.CourtDateError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtDateError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 px-0">
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
                        <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
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
                        <div className="col-3 col-md-3 col-lg-3 ">
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
                </fieldset>
            </div>
            <TreeModel {...{ proRoom, locationStatus, setlocationStatus, setfunctiondone, locationPath, functiondone, setLocationPath, setSearchStoragePath, searchStoStatus, value, setSearchStoStatus, setStorageLocationID, setValue, setPropertyNumber }} />
            <ChainOfModel {...{ componentRefnew, chainreport }} />
            <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, possessionID, setPossessionID, possenSinglData, setPossenSinglData, GetSingleDataPassion }} />
            <PropertyReportRoom {...{ releasestatus, setReleaseStatus, editval, componentRef }} />
        </>
    )
}

export default VehicleManagement