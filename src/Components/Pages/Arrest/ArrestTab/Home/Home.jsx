import React, { useEffect, useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Aes256Encrypt, Decrypt_Id_Name, LockFildscolour, Requiredcolour, base64ToString, filterPassedTimeZoneArrest, filterPassedTimeZonesProperty, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, stringToBase64, } from '../../../../Common/Utility';
import { AddDeleteUpadate, AddDelete_Img, fetchPostData } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import ConfirmModal from '../../ConfirmModal';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';
import { useDispatch, useSelector } from 'react-redux';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../../redux/actions/Agency';
import ImageModel from '../../../ImageModel/ImageModel';
import { get_AgencyOfficer_Data, get_ArrestJuvenileDis_DrpData, get_ArrestType_Drp, get_ArresteeName_Data, get_Masters_Name_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import { Comman_changeArrayFormat, threeColArray, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { PhoneField } from '../../../Agency/AgencyValidation/validators';
import { ErrorTooltip } from '../../ArrestNibrsErrors';
import CurrentArrestMasterReport from './CurrentArrestMasterReport';



const Home = ({ setShowJuvinile, setShowPage, setShowPoliceForce, DecArrestId, setStatus, isEnabled, setIsEnabled, Agencystatus, setAgencystatus, arrestID, setArrestID, matchedAgency, setmatchedAgency, delChargeID, ChargeLocalArr, setChargeLocalArr, setDelChargeID, isChargeDel, setIsChargeDel, possessionID, setPossessionID, offenseNameID, setoffenseNameID, RestStatus, Editval, setEditval, incExceDate, setincExceDate, GetSingleData, get_List }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const arresteeNameData = useSelector((state) => state.DropDown.arresteeNameData);
    const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const arrestTypeDrpData = useSelector((state) => state.DropDown.arrestTypeDrpData);
    const arrestJuvenileDisDrpData = useSelector((state) => state.DropDown.arrestJuvenileDisDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecEIncID = 0; let DecNameId = 0;

    const query = useQuery();
    var IncID = query?.get("IncId");
    var ArrestId = query?.get("ArrestId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ArrNo = query?.get("ArrNo");
    var Name = query?.get("Name");
    let MstPage = query?.get('page');
    let ChargeSta = query?.get('ChargeSta');
    var ArrestSta = query?.get('ArrestSta');
    var NameID = query?.get("NameID");
    var NameStatus = query?.get("NameStatus");
    let isNew = query?.get('isNew');

    var SideBarStatus = query?.get("SideBarStatus");

    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }

    if (!NameID) { DecNameId = 0; }
    else { DecNameId = parseInt(base64ToString(NameID)); }

    const { get_Arrest_Count, setArrestName, setIncidentNumber, get_OffenseName_Data, arrestChargeData, changesStatus, setArrestChargeData, updateCount, setUpdateCount, get_ArrestCharge_Count, get_Data_Arrest_Charge, nibrsSubmittedArrestMain, tabCountArrest, incidentNumber, ArresteName, arrestFilterData, get_Data_Arrest, policeForceDrpData, get_Police_Force, changesStatusCount, setChangesStatus, get_Incident_Count, setActiveArrest, datezone, GetDataTimeZone, setNameID, NameId, incidentCount } = useContext(AgencyContext);

    const [arrestDate, setArrestDate] = useState();
    const [rightGivenCode, setRightGivenCode] = useState('N');
    // const [ArrestID, setArrestID] = useState('');
    // const [Editval, setEditval] = useState();
    const [showModal, setShowModal] = useState(false);
    const [arresteeChange, setArresteeChange] = useState();
    const [modalStatus, setModalStatus] = useState(false);
    const [imageid, setImageId] = useState('');
    const [multiImage, setMultiImage] = useState([]);
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [JuvenileCleared, setIsJuvenileCleared] = useState();
    const [nameModalStatus, setNameModalStatus] = useState(false);
    // const [possessionID, setPossessionID] = useState('');
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [uploadImgFiles, setuploadImgFiles] = useState([]);
    const [imageModalStatus, setImageModalStatus] = useState(false);
    const [arrestingAgencyDrpData, setAgencyNameDrpData] = useState([]);
    const [isDatePickerRequiredColor, setDatePickerRequiredColor] = useState(false);
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    // const [incExceDate, setincExceDate] = useState();

    const [AgencyCode, setAgencyCode] = useState('');
    const [printIncReport, setIncMasterReport] = useState(false);
    const [IncReportCount, setIncReportCount] = useState(1);
    const [showModalReport, setshowModalReport] = useState(false);
    const [incidentDate, setincidentDate] = useState([]);
    const [extractIncidentDate, setextractIncidentDate] = useState('');
    const [confirmInsertArrest, setConfirmInsertArrest] = useState(false);
    const [insertArrest, setInsertArrest] = useState([]);
    const [incidentReportedDate, setincidentReportedDate] = useState('');
    // const [offenseNameID, setoffenseNameID] = useState();

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [dobDate, setDobDate] = useState('');
    const [AgeFrom, setAgeFrom] = useState('');
    const [Gender, setGender] = useState('');
    const [ageUnitDrpData, setAgeUnitDrpData] = useState([]);
    const [complainantfilterID, setcomplainantfilterID] = useState([]);
    const [type, setType] = useState("ArrestMod");
    const [ArrestparentID, setArrestParentID] = useState('');
    const [isEditvalProcessed, setIsEditvalProcessed] = useState(false);


    const [value, setValue] = useState({
        'ArrestID': '', 'AgencyID': '', 'ArrestNumber': '', 'IncidentID': '', 'CreatedByUserFK': '', 'IsJuvenileArrest': '', 'ArrestDtTm': '', 'ArrestingAgency': '', 'ArrestTypeID': '', 'SupervisorID': '', 'PoliceForceID': '', 'RightsGivenID': '', 'JuvenileDispositionID': '', 'PhoneNo': '', 'PrimaryOfficerID': '', 'GivenByID': '', 'ArresteeID': '', 'ArresteeLable': 0, 'ModifiedByUserFK': '', 'IsMultipleArrestees': '', 'ArrestingAgencyID': '', 'IsSchoolNotified': '', 'Grade': '', 'LocationOfSchool': '', 'NameOfSchool': '', 'ParentPhone': '', 'ParentNameID': '', 'ResponseID': '',
    });

    const [errors, setErrors] = useState({
        'ArresteeIDError': '', 'ArrestDtTmError': '', 'JuvenileDispoError': '', 'ArrestTypeIDError': '', 'CellPhoneError': ''
    })

    const [imgData, setImgData] = useState({
        "PictureTypeID": '', "ImageViewID": '', "ImgDtTm": '', "OfficerID": '', "Comments": '', "DocumentID": ''
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            // dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId));
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            get_Arrest_Count(DecArrestId); dispatch(get_ScreenPermissions_Data("A067", localStoreData?.AgencyID, localStoreData?.PINID));
            get_Single_PersonnelList(localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID); setAgencyCode(localStoreData?.ORI);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else { setaddUpdatePermission(false); }
    }, [effectiveScreenPermission]);


    useEffect(() => {
        if (loginAgencyID) {
            get_Arresting_DropDown(loginAgencyID, '1');
        }
    }, [loginAgencyID])

    useEffect(() => {
        if (NameId) {
            get_List(NameId);
        }
    }, [NameId])

    const GetEditData = (incidentID) => {
        const val = { IncidentID: incidentID };
        fetchPostData('Incident/GetSingleData_Incident', val).then((res) => {
            if (res?.length > 0) {
                setincidentDate(res);
            }
        });
    };

    useEffect(() => {
        if (incidentDate?.length > 0) {
            setextractIncidentDate(incidentDate[0]?.NIBRSclearancedate ? new Date(incidentDate[0]?.NIBRSclearancedate) : null);
            setincidentReportedDate(incidentDate[0]?.ReportedDate ? new Date(incidentDate[0]?.ReportedDate) : null)
        }
    }, [incidentDate]);


    useEffect(() => {
        if (DecEIncID) {
            setMainIncidentID(DecEIncID);
            // dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId));
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(DecEIncID)) }
        }
        if (MstPage === "MST-Arrest-Dash" && possessionID) {
            dispatch(get_Masters_Name_Drp_Data(possessionID, 0, 0));
        }
    }, [DecEIncID, nameModalStatus, possessionID, DecArrestId]);

    useEffect(() => {
        if (DecEIncID) {
            getIncidentData(DecEIncID);
        }
    }, [DecEIncID]);

    useEffect(() => {
        setValue({ ...value, ['RaceID']: '', ['SexID']: '', ['AgeFrom']: '', ['AgeUnitID']: '', ['DateOfBirth']: '', ArrestNumber: '', IsJuvenileArrest: '', ArrestDtTm: '', ArrestingAgency: '', ArrestTypeID: '', SupervisorID: '', PoliceForceID: '', ArresteeID: '', RightsGivenID: '', JuvenileDispositionID: '', PhoneNo: '', GivenByID: '', PrimaryOfficerID: '', ModifiedByUserFK: '', IsMultipleArrestees: '', ArrestingAgencyID: '', 'IsSchoolNotified': '', 'Grade': '', 'LocationOfSchool': '', 'NameOfSchool': '', 'ParentPhone': '', 'ParentNameID': '', 'ResponseID': '', })
    }, [RestStatus]);

    //==================Dv-------------------------------
    useEffect(() => {
        if (DecNameId) {
            dispatch(get_Masters_Name_Drp_Data(DecNameId, 0, 0));
        }
    }, [DecNameId, arresteeNameData]);

    useEffect(() => {
        if (DecArrestId) {
            dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId));
        }
    }, [DecArrestId,]);

    useEffect(() => {
        if (DecEIncID && DecArrestId) {
            setMainIncidentID(DecEIncID); dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId));
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(DecEIncID)) }
        }
        if (MstPage === "MST-Arrest-Dash" && possessionID) {
            dispatch(get_Masters_Name_Drp_Data(possessionID, 0, 0));
        }
        else if (type === "ArrestParentMod") {
            dispatch(get_ArresteeName_Data('', '', DecEIncID, true, value.ParentNameID));
            // dispatch(get_Masters_Name_Drp_Data(value.ParentNameID, 0, 0));
        }
        else if (type === "ArrestMod") {
            dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId));



        }
    }, [DecEIncID, nameModalStatus, possessionID]);

    useEffect(() => {
        if (possessionID && (isEditvalProcessed === false) && type === "ArrestMod") {
            const newvalue = arresteeNameData?.filter((val) => val?.NameID == possessionID);
            setNameID(newvalue[0]?.NameID)
            setValue({
                ...value, ['ArresteeID']: parseInt(possessionID), ['RaceID']: newvalue[0]?.RaceID, ['SexID']: newvalue[0]?.SexID, ['AgeFrom']: newvalue[0]?.AgeFrom, ['AgeUnitID']: newvalue[0]?.AgeUnitID,
                ['DateOfBirth']: newvalue[0]?.DateOfBirth ? getShowingWithOutTime(newvalue[0].DateOfBirth) : null,
                'IsJuvenileArrest': newvalue[0]?.IsJuvenile,
            })
        }
    }, [arresteeNameData, nameModalStatus, isEditvalProcessed]);

    const checkSelectedName1 = (ArresteeID) => {
        if (ArresteeID) {
            const keysToCheck = ['AgeFrom', 'Gendre_Description', 'LastName', 'Race_Description'];
            const nameStatus = MstPage === "MST-Arrest-Dash" ? mastersNameDrpData : arresteeNameData?.filter((val) => val?.NameID == ArresteeID);
            const age = nameStatus[0]?.AgeFrom;
            const status = nameStatus[0]?.IsJuvenileArrest;
            setArresteeChange(nameStatus[0]);
            setArrestName(nameStatus[0]?.label)
            if (age === null || age === undefined) {
                setValue({ ...value, ['ArresteeID']: parseInt(DecNameId) })
            } else {
                setValue({ ...value, ['IsJuvenileArrest']: status, ['ArresteeID']: parseInt(DecNameId) })
            }
            return keysToCheck.every(key => nameStatus[0]?.hasOwnProperty(key) && nameStatus[0]?.[key]);
        } else {
            return true
        }
    }

    useEffect(() => {
        if (loginAgencyID) {
            setValue({ ...value, 'IncidentID': DecEIncID, 'ArrestID': DecArrestId, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID });
            get_Data_Arrest(DecEIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
            if (arrestTypeDrpData?.length === 0) dispatch(get_ArrestType_Drp(loginAgencyID)); get_Name_Drp_Data(loginAgencyID)
            if (arrestJuvenileDisDrpData?.length === 0) dispatch(get_ArrestJuvenileDis_DrpData(loginAgencyID));
            if (policeForceDrpData?.length === 0) { get_Police_Force(); } dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, DecEIncID))
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (DecArrestId) {
            GetSingleData(DecArrestId, DecEIncID); setArrestID(DecArrestId); get_Data_Arrest_Charge(DecArrestId);
        } else {
            setMultiImage(''); setStatus(false); setArrestID('');
            //  reset_Value()
        }
    }, [DecArrestId, DecEIncID]);

    const get_Name_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
            if (data) {
                setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));
                setSexIdDrp(Comman_changeArrayFormat(data[0]?.Gender, 'SexCodeID', 'Description'));
                setAgeUnitDrpData(threeColArray(data[0]?.AgeUnit, 'AgeUnitID', 'Description', 'AgeUnitCode'));
            } else {
                setRaceIdDrp([]); setSexIdDrp([]); setAgeUnitDrpData([]);
            }
        })
    };

    const getIncidentData = async (incidentID) => {
        const val = { IncidentID: incidentID }
        await fetchPostData('Incident/GetSingleData_Incident', val).then((res) => {
            if (res?.length > 0) {
                setInsertArrest(res[0]?.RMSDispositionId === 15 && incidentCount[0]?.ArrestCount == 0);
                return res[0]?.RMSDispositionId === 15 && incidentCount[0]?.ArrestCount == 0;
            }
            else { setInsertArrest(false); return false; }
        })
    }

    // const GetSingleData = (ArrestID, MainIncidentID) => {
    //     const val = { 'ArrestID': ArrestID, 'PINID': '0', 'IncidentID': MainIncidentID }
    //     fetchPostData('Arrest/GetSingleData_Arrest', val).then((res) => {
    //         if (res.length > 0) {
    //             if (res[0]?.NIBRSClearanceID) { setincExceDate(new Date(res[0]?.NIBRSclearancedate)); }
    //             setStatus(true);
    //             setEditval(res);
    //         } else {
    //             setEditval([]); setincExceDate('');
    //         }
    //     })
    // }

    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('showModal');
        });
    }, [])

    const get_Single_PersonnelList = (loginPinID) => {
        fetchPostData('Personnel/GetData_UpdatePersonnel', { PINID: loginPinID })
            .then((res) => {
                if (res) {
                    setIsJuvenileCleared(res[0]?.IsJuvenileCleared);
                } else {
                    setIsJuvenileCleared([]);
                }
            })
    }

    const check_Validation_Error = () => {
        //-------------------------dv--------------------------------
        const arresteeStatus = possessionID ? checkSelectedName(value?.ArresteeID) : checkSelectedName1(value?.ArresteeID)
        if (JuvenileCleared === false && value.IsJuvenileArrest) {
            toastifyError('You are not authorized to create a juvenile arrest.')
            return;
        }
        if (arresteeStatus) {
            const ArresteeIDErr = RequiredFieldIncident(value.ArresteeID);
            const ArrestDtTmErr = RequiredFieldIncident(value.ArrestDtTm);
            const CellPhoneErr = value.ParentPhone ? PhoneField(value.ParentPhone) : 'true'
            const JuvenileDispoErr = value?.IsJuvenileArrest === true || value?.IsJuvenileArrest === 'true' ? RequiredFieldIncident(value?.JuvenileDispositionID) : 'true'
            const ArrestTypeIDErr = RequiredFieldIncident(value.ArrestTypeID);
            setErrors(pre => {
                return {
                    ...pre,
                    ['ArresteeIDError']: ArresteeIDErr || pre['ArresteeIDError'],
                    ['ArrestDtTmError']: ArrestDtTmErr || pre['ArrestDtTmError'],
                    ['CellPhoneError']: CellPhoneErr || pre['CellPhoneError'],
                    ['JuvenileDispoError']: JuvenileDispoErr || pre['JuvenileDispoError'],
                    ['ArrestTypeIDError']: ArrestTypeIDErr || pre['ArrestTypeIDError'],
                }
            });
        } else {
            setShowModal(true);
            setErrors(pre => { return { ...pre, ['ArresteeIDError']: '' } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { ArresteeIDError, ArrestDtTmError, CellPhoneError, JuvenileDispoError, ArrestTypeIDError } = errors

    useEffect(() => {
        if (ArrestDtTmError === 'true' && ArresteeIDError === 'true' && CellPhoneError === 'true' && JuvenileDispoError === 'true' && ArrestTypeIDError === 'true') {
            if (MstPage === "MST-Arrest-Dash") {
                if (arrestID && (ArrestSta === true || ArrestSta === 'true')) { update_Arrest(); }
                else { insert_Arrest_Data(); }
            } else {
                if (arrestID && (ArrestSta === true || ArrestSta === 'true')) { update_Arrest(); }
                else { insert_Arrest_Data(); }
            }
        }
    }, [ArrestDtTmError, ArresteeIDError, CellPhoneError, JuvenileDispoError, ArrestTypeIDError])

    useEffect(() => {
        console.log("🚀 ~ Home ~ Editval:", Editval)
        if (Editval?.length > 0) {
            const newvalue = arresteeNameData?.filter((val) => val?.NameID == Editval[0]?.ArresteeID);

            setNameID(newvalue[0]?.NameID)
            get_Arrest_MultiImage(arrestID);
            setValue({
                ...value,
                'ArrestID': Editval[0]?.ArrestID, 'ArrestNumber': Editval[0]?.ArrestNumber, 'IsJuvenileArrest': Editval[0]?.IsJuvenileArrest,
                'ArrestDtTm': Editval[0]?.ArrestDtTm ? getShowingDateText(Editval[0]?.ArrestDtTm) : "", 'IsMultipleArrestees': Editval[0]?.IsMultipleArrestees,
                'ArrestingAgencyID': Editval[0]?.ArrestingAgencyID, 'ArrestingAgency': Editval[0]?.ArrestingAgency ? Editval[0]?.ArrestingAgency : '',
                'PhoneNo': Editval[0]?.PhoneNo ? Editval[0]?.PhoneNo : '', 'ArrestTypeID': Editval[0]?.ArrestTypeID, 'SupervisorID': Editval[0]?.SupervisorID, 'PoliceForceID': Editval[0]?.PoliceForceID ? Editval[0]?.PoliceForceID : '',

                'RightsGivenID': Editval[0]?.RightsGivenID, 'JuvenileDispositionID': Editval[0]?.JuvenileDispositionID, 'GivenByID': Editval[0]?.GivenByID, 'PrimaryOfficerID': Editval[0]?.PrimaryOfficerID, 'ModifiedByUserFK': loginPinID,
                // new add 
                'IsSchoolNotified': Editval[0]?.IsSchoolNotified, 'Grade': Editval[0]?.Grade, 'LocationOfSchool': Editval[0]?.LocationOfSchool, 'LocationOfSchool': Editval[0]?.LocationOfSchool, 'NameOfSchool': Editval[0]?.NameOfSchool, 'ParentPhone': Editval[0]?.ParentPhone,
                'ParentNameID': Editval[0]?.ParentNameID, 'ResponseID': Editval[0]?.ResponseID,
                ['RaceID']: newvalue[0]?.RaceID, ['SexID']: newvalue[0]?.SexID, ['AgeFrom']: newvalue[0]?.AgeFrom, ['AgeUnitID']: newvalue[0]?.AgeUnitID,
                ['DateOfBirth']: newvalue[0]?.DateOfBirth ? getShowingWithOutTime(newvalue[0].DateOfBirth) : null,
                ['ArresteeID']: Editval[0]?.ArresteeID,
                'IsJuvenileArrest': newvalue[0]?.IsJuvenile,
            });
            setPossessionID(Editval[0]?.ArresteeID);
            setArrestParentID(Editval[0]?.ParentNameID);
            setIsEditvalProcessed(true);
            // setPossessionID(Editval[0]?.ArresteeID);
            setArrestName(Editval[0]?.Arrestee_Name ? Editval[0]?.Arrestee_Name : '');
            setIncidentNumber(Editval[0]?.IncidentNumber ? Editval[0]?.IncidentNumber : ''); setArrestDate(Editval[0]?.ArrestDtTm ? new Date(Editval[0]?.ArrestDtTm) : ''); setRightGivenCode(Get_Given_Code(Editval, policeForceDrpData));

            if (Editval[0]?.PoliceForceID === 1 || Editval[0]?.PoliceForceID === '1') {
                setShowPoliceForce(true);
            } else if (Editval[0]?.PoliceForceID === 2 || Editval[0]?.PoliceForceID === '2') {
                setShowPoliceForce(false);
            }
            if (Editval[0]?.IsJuvenileArrest === true || Editval[0]?.IsJuvenileArrest === 'true') {
                setShowJuvinile(true);
            } else {
                setShowJuvinile(false);
            }
            if (Editval[0]?.PoliceForceID === 1) {
                setIsEnabled(true);
            } else {
                setIsEnabled(false);
            }
        } else {
            setIsEditvalProcessed(false);

            setValue({
                ...value,
                'ArrestNumber': '',
                'ArrestID': "", 'IsJuvenileArrest': '', 'ArrestDtTm': '', 'ArrestTypeID': '', 'SupervisorID': '', 'PoliceForceID': '', 'RightsGivenID': '', 'JuvenileDispositionID': '', 'PhoneNo': '', 'GivenByID': '', 'PrimaryOfficerID': '', 'ModifiedByUserFK': '', 'IsMultipleArrestees': '',
                'IsSchoolNotified': '', 'Grade': '', 'LocationOfSchool': '', 'NameOfSchool': '', 'ParentPhone': '', 'ParentNameID': '', 'ResponseID': '',
                ['RaceID']: '', ['SexID']: '', ['AgeFrom']: '', ['AgeUnitID']: '',
                ['DateOfBirth']: ''
            });
            setArrestDate();
        }
    }, [Editval, changesStatusCount])

    const HandleChange = (e) => {
        if (e.target.name === "IsJuvenileArrest") {
            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
            setValue({ ...value, [e.target.name]: e.target.checked });
        } else if (e.target.name === 'PhoneNo') {
            var ele = e.target.value.replace(/[^0-9\s]/g, "")
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setChangesStatus(true); setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] });
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/[^0-9\s]/g, "");
                setChangesStatus(true); setValue({ ...value, [e.target.name]: ele });
            }
        } else {
            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
            ; setValue({ ...value, [e.target.name]: e.target.value });
        }
    };

    const handleChange = (event) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        const { name, value } = event.target;
        let ele = value.replace(/\D/g, '');
        if (ele.length === 10) {
            const cleaned = ele.replace(/\D/g, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                setValue((prevState) => ({ ...prevState, [name]: match[1] + '-' + match[2] + '-' + match[3], }));
            }
        } else {
            ele = value.split('-').join('').replace(/\D/g, '');
            setValue((prevState) => ({ ...prevState, [name]: ele, }));
        }
    };

    useEffect(() => {
        if (rightGivenCode !== "Y") {
            setValue({ ...value, ['GivenByID']: '' })
        }
    }, [rightGivenCode])

    useEffect(() => {
        if (!value.IsJuvenileArrest || value.IsJuvenileArrest === 'false') {
            setShowJuvinile(false);
            setValue({ ...value, ['JuvenileDispositionID']: '', ['ParentPhone']: '' });
        } else { setShowJuvinile(true); }
    }, [value.IsJuvenileArrest])

    const insert_Arrest_Data = async () => {
        const { ArrestNumber, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, IsMultipleArrestees, ArrestingAgencyID,
            IsSchoolNotified, Grade, LocationOfSchool, NameOfSchool, ParentPhone, ParentNameID, ResponseID,
        } = value;
        const val = {
            'ArrestID': DecArrestId, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'CreatedByUserFK': loginPinID, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': '', 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
            'IsSchoolNotified': IsSchoolNotified, 'Grade': Grade, 'LocationOfSchool': LocationOfSchool, 'NameOfSchool': NameOfSchool, 'ParentPhone': ParentPhone, 'ParentNameID': ParentNameID, 'ResponseID': ResponseID,
        }
        localStorage.setItem('insertedArrestVal', JSON.stringify(val));
        setShowPage('Charges'); setStatus(true)
        // navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(res?.ArrestID)}&ArrNo=${res?.ArrestNumber}&Name=${ArresteName}&ArrestSta=${true}&ChargeSta=${false}`)
        // AddDeleteUpadate('Arrest/Insert_Arrest', val).then(async (res) => {
        //     if (res.success) {
        //         const newArrestID = res.ArrestID;
        //         await SyncLocalChargesToServer(newArrestID, DecEIncID, loginPinID, loginAgencyID, ChargeLocalArr, setChargeLocalArr, get_Arrest_Count, get_Data_Arrest_Charge
        //         );
        //         if (MstPage === "MST-Arrest-Dash") {
        //             navigate(`/Arrest-Home?page=MST-Arrest-Dash&ArrNo=${res?.ArrestNumber}&IncNo=${incidentNumber}&Name=${ArresteName}&ArrestId=${stringToBase64(res?.ArrestID)}&ArrestSta=${true}&ChargeSta=${true}`);
        //         } else {
        //             navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(res?.ArrestID)}&ArrNo=${res?.ArrestNumber}&Name=${ArresteName}&ArrestSta=${true}&ChargeSta=${false}`)
        //         }
        //         // reset_Value();
        //         toastifySuccess(res.Message); get_Arrest_Count(DecArrestId); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
        //         GetSingleData(res?.ArrestID, DecEIncID);
        //         setArrestID(res.ArrestID); setStatus(false); setChangesStatus(false); setStatesChangeStatus(false)
        //         if (uploadImgFiles?.length > 0) { upload_Image_File(res.ArrestID); setuploadImgFiles(''); }
        //         setErrors({ ...errors, ['ArresteeIDError']: '' }); get_Incident_Count(DecEIncID);
        //     }
        // });
        //     }
        // }
    }

    const update_Arrest = () => {
        const { ArrestNumber, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, IsMultipleArrestees, ArrestingAgencyID,
            IsSchoolNotified, Grade, LocationOfSchool, NameOfSchool, ParentPhone, ParentNameID, ResponseID,
        } = value;
        const val = {
            'ArrestID': DecArrestId, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': loginPinID, 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
            'IsSchoolNotified': IsSchoolNotified, 'Grade': Grade, 'LocationOfSchool': LocationOfSchool, 'NameOfSchool': NameOfSchool, 'ParentPhone': ParentPhone, 'ParentNameID': ParentNameID, 'ResponseID': ResponseID,
        }
        if (ChargeLocalArr?.length === 0 && tabCountArrest?.ChargeCount === 0 && arrestChargeData.length === 0) {
            toastifyError('Please add at least one charge')
            setErrors({
                ...errors,
                'ArrestNumberError': '', 'IsJuvenileArrestError': '', 'ArrestDtTmError': '', 'ArrestTypeIDError': '', 'SupervisorIDError': '', 'PoliceForceIDError': '', 'RightsGivenIDError': '', 'JuvenileDispositionIDError': '', 'PhoneNoError': '', 'PrimaryOfficerIDError': '', 'GivenByIDError': '', 'ArresteeIDError': '', 'ArresteeLableError': '', 'ModifiedByUserFKError': '', 'IsMultipleArresteesError': '', 'ArrestingAgencyIDError': '',
            })
        }
        else {
            if (insertArrest) {
                setConfirmInsertArrest(true);
                setErrors({
                    ...errors,
                    'ArrestNumberError': '', 'IsJuvenileArrestError': '', 'ArrestDtTmError': '', 'ArrestTypeIDError': '', 'SupervisorIDError': '', 'PoliceForceIDError': '', 'RightsGivenIDError': '', 'JuvenileDispositionIDError': '', 'PhoneNoError': '', 'PrimaryOfficerIDError': '', 'GivenByIDError': '', 'ArresteeIDError': '', 'ArresteeLableError': '', 'ModifiedByUserFKError': '', 'IsMultipleArresteesError': '', 'ArrestingAgencyIDError': '',
                })
            } else {
                const { ArrestNumber, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, IsMultipleArrestees, ArrestingAgencyID,
                    IsSchoolNotified, Grade, LocationOfSchool, NameOfSchool, ParentPhone, ParentNameID, ResponseID,
                } = value;
                const val = {
                    'ArrestID': DecArrestId, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'CreatedByUserFK': loginPinID, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': loginPinID, 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
                    'IsSchoolNotified': IsSchoolNotified, 'Grade': Grade, 'LocationOfSchool': LocationOfSchool, 'NameOfSchool': NameOfSchool, 'ParentPhone': ParentPhone, 'ParentNameID': ParentNameID, 'ResponseID': ResponseID,
                }
                AddDeleteUpadate('Arrest/Update_Arrest', val).then((res) => {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); setChangesStatus(false); setStatesChangeStatus(false); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                    setErrors({ ...errors, ['ArresteeIDError']: '' }); GetSingleData(arrestID, DecEIncID); get_Arrest_Count(DecArrestId);
                    if (uploadImgFiles?.length > 0) { upload_Image_File(); setuploadImgFiles(''); }
                })
            }
        }
    }

    const DeleteArrest = () => {
        const val = { 'ArrestID': arrestID, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('Arrest/Delete_Arrest', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                get_Incident_Count(DecEIncID); get_Arrest_Count(DecArrestId); setStatusFalse();
                navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`); if (DecEIncID) { dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId)); }
                sessionStorage.removeItem('ChargeLocalData');
            } else console.log("Somthing Wrong");
        })
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    const onMasterPropClose = () => {
        navigate('/dashboard-page');
    }

    const SyncLocalChargesToServer = async (ArrestID, DecEIncID, loginPinID, loginAgencyID, ChargeLocalArr, setChargeLocalArr, get_Arrest_Count, get_Data_Arrest_Charge) => {
        if (!ArrestID || !ChargeLocalArr?.length) return;
        for (let charge of ChargeLocalArr) {
            const val = { ...charge, ChargeID: null, ArrestID, IncidentID: DecEIncID, CreatedByUserFK: loginPinID, AgencyID: loginAgencyID, };
            await AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
                if (res?.success) {
                    console.log(`✅ Synced local charge: ${charge.ChargeCodeID}`);
                }
            });
        }
        setChargeLocalArr([]); sessionStorage.removeItem('ChargeLocalData'); get_Arrest_Count(arrestID); get_Data_Arrest_Charge(arrestID);
    };

    const setStatusFalse = () => {
        if (MstPage === "MST-Arrest-Dash") {
            navigate(`/Arrest-Home?page=MST-Arrest-Dash&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`);
            reset_Value(); setErrors(''); setPossessionID(''); setPossenSinglData([]); setArrestID('');
        } else {
            navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`); setErrors(''); setPossessionID(''); setPossenSinglData([]); setActiveArrest(false); setRightGivenCode(false); setArrestID(''); reset_Value(); setIsEnabled(false);
        }
    }

    const reset_Value = () => {
        setAgencystatus(true);
        setShowJuvinile(false); setShowPoliceForce(false);
        setValue(prevValue => ({
            ...prevValue, ArrestNumber: '', IsJuvenileArrest: '', ArrestDtTm: '', ArrestingAgency: '', ArrestTypeID: '', SupervisorID: '', PoliceForceID: '', ArresteeID: '', RightsGivenID: '', JuvenileDispositionID: '', PhoneNo: '', GivenByID: '', PrimaryOfficerID: '', ModifiedByUserFK: '', IsMultipleArrestees: '', ArrestingAgencyID: '', 'IsSchoolNotified': '', 'Grade': '', 'LocationOfSchool': '', 'NameOfSchool': '', 'ParentPhone': '', 'ParentNameID': '', 'ResponseID': '',
        }));
        setErrors(prevErrors => ({
            ...prevErrors, ArresteeIDError: '', PrimaryOfficerIDError: '', ArrestDtTmError: '', JuvenileDispoError: '', ArrestTypeIDError: ''
        }));
        sessionStorage.removeItem('ChargeLocalData');
        setArrestDate(); setMultiImage(''); setuploadImgFiles(''); setStatesChangeStatus(false); setStatus(false); setArrestID(''); setChangesStatus(false); setArrestChargeData([]); get_Arresting_DropDown(loginAgencyID);
    };

    const conditionalRowStyles = [
        {
            when: row => row.ArrestID === DecArrestId,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    //-------------------------Image---------------------------
    const get_Arrest_MultiImage = (ArrestID) => {
        const val = { 'ArrestID': ArrestID }
        const val1 = { 'ArrestID': 0 }
        fetchPostData('Arrest/GetData_ArrestPhoto', MstPage === 'ArrestSearch' ? val1 : val)
            .then((res) => {
                if (res) { setMultiImage(res); }
                else { setMultiImage([]); }
            })
    }

    // to update image data
    const update_Vehicle_MultiImage = () => {
        const val = { "ModifiedByUserFK": loginPinID, "AgencyID": loginAgencyID, "PictureTypeID": imgData?.PictureTypeID, "ImageViewID": imgData?.ImageViewID, "ImgDtTm": imgData?.ImgDtTm, "OfficerID": imgData?.OfficerID, "Comments": imgData?.Comments, "DocumentID": imgData?.DocumentID }
        AddDeleteUpadate('PropertyVehicle/Update_PropertyVehiclePhotoDetail', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
            }
            else { toastifyError(res?.Message); }
        })
    }

    const upload_Image_File = async (arrID) => {
        const formdata = new FormData();
        const newData = [];
        const EncFormdata = new FormData();
        const EncDocs = [];
        for (let i = 0; i < uploadImgFiles.length; i++) {
            const { file, imgData } = uploadImgFiles[i];
            const val = {
                'ArrestID': arrestID ? arrestID : arrID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
                'PictureTypeID': imgData?.PictureTypeID, 'ImageViewID': imgData?.ImageViewID, 'ImgDtTm': imgData?.ImgDtTm,
                'OfficerID': imgData?.OfficerID, 'Comments': imgData?.Comments
            }
            const val1 = {
                'ArrestID': 0, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'PictureTypeID': imgData?.PictureTypeID,
                'ImageViewID': imgData?.ImageViewID, 'ImgDtTm': imgData?.ImgDtTm, 'OfficerID': imgData?.OfficerID, 'Comments': imgData?.Comments
            }
            const values = JSON.stringify(MstPage === 'ArrestSearch' ? val1 : val);
            const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(MstPage === 'ArrestSearch' ? val1 : val)]));
            formdata.append("file", file);
            EncFormdata.append("file", file);
            newData.push(values);
            EncDocs.push(EncPostData);
        }
        formdata.append("Data", JSON.stringify(newData));
        EncFormdata.append("Data", EncDocs);
        AddDelete_Img('Arrest/Insert_ArrestPhoto', formdata, EncFormdata).then((res) => {
            if (res.success) {
                get_Arrest_MultiImage(arrestID ? arrestID : arrID); setuploadImgFiles([]);
            }
        }).catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        const value = { 'PhotoID': imageid, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('Arrest/Delete_ArrestPhoto', value).then((data) => {
            if (data.success) {
                get_Arrest_MultiImage(arrestID); setModalStatus(false); setImageId('');
                const parsedData = JSON.parse(data.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
            } else {
                toastifyError(data?.Message);

            }
        });
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20, minHeight: 30,
            fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    };

    //--------------------possession---------------------------------//
    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) { setPossenSinglData(res); }
            else { setPossenSinglData([]); }
        })
    }

    const handleDOBChange = (date, e) => {
        if (date) {
            setValue(pre => ({ ...pre, ['AgeFrom']: '', ['AgeTo']: '' }));
            const res = getShowingWithOutTime(date).split("/");
            let age = calculateAge(`${res[0]} ${res[1]} ${res[2]}`);
            return age;
        }
    };

    function calculateAge(birthday) {
        const today = new Date();
        const date = new Date(birthday);
        const diffInMs = today.getTime() - date.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const years = Math.floor(diffInDays / 365);
        let Days = "";
        Days += diffInDays % 7;
        return `${years}`;
    };

    const ChangeDropDown = (e, name) => {

        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        let newValue = { ...value };
        if (e) {
            newValue[name] = e.value;
            if (name === 'RightsGivenID') {
                setRightGivenCode(e.id);
            }
            else if (name === 'ParentNameID') {
                if (get_OffenseName_Data) {
                    get_OffenseName_Data(e?.value);
                    setNameID(e?.value)
                    // if (e.DateOfBirth) {
                    //     setDobDate(new Date(e.DateOfBirth));
                    //     newValue['DateOfBirth'] = getShowingWithOutTime(e.DateOfBirth);
                    // } else {
                    //     setDobDate('');
                    //     newValue['DateOfBirth'] = '';
                    // }
                    // setAgeFrom(e.SexID);
                    // newValue['SexID'] = e.SexID;
                    // newValue['RaceID'] = e.RaceID;
                    // newValue['AgeUnitID'] = e.AgeUnitID;
                    // setValue({
                    //     ...value,
                    //     ['DateOfBirth']: getShowingWithOutTime(e.DateOfBirth),
                    //     ['AgeFrom']: e.AgeFrom,
                    //     ['SexID']: e.SexID,
                    //     ['RaceID']: e.RaceID,
                    //     ['AgeUnitID']: e.AgeUnitID
                    // });
                }
                setArrestParentID(e.value);
                // const age = handleDOBChange(e.DateOfBirth);
                // if (e.AgeFrom) {
                //     if (e.AgeFrom === null) {
                //         newValue['IsJuvenileArrest'] = '';
                //     } else {
                //         newValue['IsJuvenileArrest'] = e.IsJuvenile;
                //     }
                //     setArresteeChange(e); setArrestParentID(e.value);
                // } else
                //     if (!e.Gendre_Description || !e.Race_Description || !e.AgeFrom || !e.LastName) {
                //         setArresteeChange(e);
                //     }
            }
            else if (name === 'ArresteeID') {
                if (get_OffenseName_Data) {
                    get_OffenseName_Data(e?.value);
                    setNameID(e?.value)
                    if (e.DateOfBirth) {
                        setDobDate(new Date(e.DateOfBirth));
                        newValue['DateOfBirth'] = e?.DateOfBirth ? getShowingWithOutTime(e.DateOfBirth) : null;

                    } else {
                        setDobDate('');
                        newValue['DateOfBirth'] = '';
                    }
                    setAgeFrom(e.SexID);
                    newValue['SexID'] = e.SexID;
                    newValue['RaceID'] = e.RaceID;
                    newValue['AgeUnitID'] = e.AgeUnitID;
                    setValue({
                        ...value,
                        ['DateOfBirth']: getShowingWithOutTime(e.DateOfBirth),
                        ['AgeFrom']: e.AgeFrom,
                        ['SexID']: e.SexID,
                        ['RaceID']: e.RaceID,
                        ['AgeUnitID']: e.AgeUnitID
                    });
                }
                const age = handleDOBChange(e.DateOfBirth);
                if (e.AgeFrom) {
                    if (e.AgeFrom === null) {
                        newValue['IsJuvenileArrest'] = '';
                    } else {
                        newValue['IsJuvenileArrest'] = e.IsJuvenile;
                    }
                    setArresteeChange(e); setPossessionID(e.value);
                } else
                    if (!e.Gendre_Description || !e.Race_Description || !e.AgeFrom || !e.LastName) {
                        setArresteeChange(e); setPossessionID(e.value);
                    }
            }
            setValue(newValue);
        }
        else {
            if (name === 'RightsGivenID') {
                setRightGivenCode('N');
            } else if (name === 'ArresteeID') {
                setPossessionID(''); setPossenSinglData([]); setArresteeChange(''); setDobDate(null); setAgeFrom(''); newValue['SexID'] = null; newValue['AgeUnitID'] = null;
                newValue['RaceID'] = null; newValue['DateOfBirth'] = ''; newValue['IsJuvenileArrest'] = '';
            }
            else if (name === 'ParentNameID') {
                setArrestParentID('');
                setPossenSinglData([]);

            }
            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
            newValue[name] = null;
            setValue(newValue);
        }
    };

    const checkSelectedName = (ArresteeID) => {
        if (ArresteeID) {
            const keysToCheck = ['AgeFrom', 'Gendre_Description', 'LastName', 'Race_Description'];
            const nameStatus = MstPage === "MST-Arrest-Dash" ? mastersNameDrpData : arresteeNameData?.filter((val) => val?.NameID == ArresteeID);
            setArresteeChange(nameStatus[0]);
            const age = nameStatus[0]?.AgeFrom;
            const status = nameStatus[0]?.IsJuvenile;
            setArrestName(nameStatus[0]?.label)
            if (age === null || age === undefined) {
                setValue({ ...value, ['ArresteeID']: parseInt(possessionID) })
            } else {
                setValue({ ...value, ['IsJuvenileArrest']: status, ['ArresteeID']: parseInt(possessionID) })
            }
            return keysToCheck.every(key => nameStatus[0]?.hasOwnProperty(key) && nameStatus[0]?.[key]);
        } else {
            return true
        }
    }

    //------------newChange----------------
    const clearID = () => {
        if (Editval?.length > 0) {
            setArrestID(arrestID)
        } else {
            setArrestID(null)
        }
    }

    const checkArrestDate = (arrestDate, incExDate) => {
        const arrDate = new Date(arrestDate);
        const incDate = new Date(incExDate);
        if (arrDate < incDate) {
            return arrDate < incDate
        } else {
            return false
        }
    }

    const setToReset = () => { }

    const ChangeDropDownArresting = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (AgencyCode == e.id) {
                setValue({ ...value, ['ArrestingAgencyID']: e.value, ['ArrestingAgency']: e.label }); setAgencystatus(true)
            } else {
                setValue({ ...value, [name]: e.value, ['ArrestingAgency']: '' }); setAgencystatus(false);
            }
        } else {
            setValue({ ...value, [name]: null, ['ArrestingAgency']: '', ['ArrestingAgencyID']: '' });
        }
    }

    const get_Arresting_DropDown = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID, 'IsActive': '1', }
        fetchPostData('DropDown/GetDataDropDown_Agency', val).then((data) => {
            if (data) {
                const matchedAgency = data.find(item => item.ORI === AgencyCode);
                setmatchedAgency(matchedAgency)
                setValue(
                    prevValue => ({
                        ...prevValue, ArrestingAgencyID: parseInt(matchedAgency?.AgencyID) || '',
                        ArrestingAgency: matchedAgency ? matchedAgency?.Agency_Name : ''
                    })
                );
                setAgencyNameDrpData(threeColArray(data, 'AgencyID', 'Agency_Name', 'ORI'));
            } else {
                setAgencyNameDrpData([]);
            }
        })
    }

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setNameModalStatus(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    useEffect(() => {
        const filteredComplainantID = arresteeNameData.filter(
            (item) => item.NameID !== value.ArresteeID
        );
        if (value.ParentNameID === value.ArresteeID) {
            setValue({ ...value, ['ParentNameID']: null })
        }
        setcomplainantfilterID(filteredComplainantID)
    }, [value.ParentNameID, value.ArresteeID, nameModalStatus])

    const handleClick = () => {
        setShowPage('PoliceForce')// Update the path according to your routing setup
    };

    const getValidDate = (date) => {
        const d = new Date(date);
        return !isNaN(d.getTime()) ? d : null;
    };

    return (
        <>
            {((incidentCount[0]?.ArrestCount === 0 || incidentCount[0]?.ArrestCount === "0") || (ArrestSta === true || ArrestSta === 'true') || isNew === "true" || isNew === true) && (
                <>
                    <div className="col-12 child " id="display-not-form">
                        <div className="row align-items-center mt-1" style={{ rowGap: "8px" }}>
                            <div className="col-2 col-md-2 col-lg-1 ">
                                <label htmlFor="" className='new-label mb-0 '> Arrest No.</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 d-flex gap-2">
                                <div>
                                    <input type="text" name="ArrestNumber" value={value?.ArrestNumber} className="readonlyColor form-control" id="ArrestNumber" readOnly />
                                </div>
                                <div className="form-check d-flex align-items-center gap-2 ml-1">
                                    <input className="form-check-input" type="checkbox" name="IsJuvenileArrest" checked={value?.IsJuvenileArrest} onChange={HandleChange} disabled />
                                    <label className="form-check-label mb-0 text-nowrap" htmlFor="flexCheckDefault">Juvenile Arrest</label>
                                </div>
                            </div>

                            <div className="col-2 col-md-3 col-lg-2 ">
                                <label htmlFor="" className='new-label text-nowrap mb-0'>Incident No.</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                                <input type="text" className='readonlyColor' name='IncidentNumber' value={IncNo ? IncNo : ''}
                                    required readOnly />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2">
                                <label htmlFor="" className='new-label mb-0'>
                                    Arrest Date/Time
                                    {
                                        loginAgencyState === 'TX' ?
                                            checkArrestDate(value?.ArrestDtTm, incExceDate) && <ErrorTooltip ErrorStr={'The arrest date must be after the exceptional clearance date if the incident is marked as "cleared exceptionally'} />
                                            :
                                            <></>
                                    }
                                    {errors.ArrestDtTmError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ArrestDtTmError}</p>
                                    ) : null}
                                </label>
                            </div>

                            <div className="col-4 col-md-4 col-lg-2 ">
                                {/* <DatePicker
                                    id='ArrestDtTm'
                                    name='ArrestDtTm'
                                    ref={startRef1}
                                    onKeyDown={(e) => {
                                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                            e?.preventDefault();
                                        } else {
                                            onKeyDown(e);
                                        }
                                    }}
                                    onChange={(date) => {
                                        if (!date) {
                                            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                            setArrestDate(null);
                                            setValue({ ...value, ['ArrestDtTm']: null });
                                            return;
                                        }

                                        let currDate = new Date(date);
                                        const minDate = extractIncidentDate ? new Date(extractIncidentDate) : new Date(incidentReportedDate);
                                        const maxDate = new Date(datezone);

                                        const isSameDate = (d1, d2) =>
                                            d1.getFullYear() === d2.getFullYear() &&
                                            d1.getMonth() === d2.getMonth() &&
                                            d1.getDate() === d2.getDate();

                                        if (minDate) {
                                            const minDateTime = new Date(minDate);
                                            minDateTime.setMinutes(minDateTime.getMinutes() + 1);
                                            if (isSameDate(currDate, minDate)) {
                                                if (currDate < minDateTime) {
                                                    currDate = minDateTime;
                                                }
                                            }
                                            if (currDate < minDateTime) {
                                                currDate = minDateTime;
                                            }
                                        }
                                        if (currDate > maxDate) {
                                            currDate = maxDate;
                                        }
                                        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                        setArrestDate(currDate);
                                        setValue({ ...value, ['ArrestDtTm']: getShowingMonthDateYear(currDate) });
                                    }}

                                    // className='requiredColor'
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    timeFormat="HH:mm"
                                    is24Hour
                                    timeInputLabel
                                    showYearDropdown
                                    showMonthDropdown  
                                    dropdownMode="select"
                                    isClearable={value?.ArrestDtTm ? true : false}
                                    selected={value?.ArrestDtTm ? new Date(value?.ArrestDtTm) : null}
                                    placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                    autoComplete="Off"
                                    maxDate={new Date(datezone)}
                                    minDate={extractIncidentDate ? new Date(extractIncidentDate) : new Date(incidentReportedDate)}
                                    filterTime={(time) =>
                                        filterPassedTimeZoneArrest(time, extractIncidentDate, datezone, incidentReportedDate)
                                    }

                                    disabled={nibrsSubmittedArrestMain === 1}
                                    className={nibrsSubmittedArrestMain === 1 ? 'LockFildsColor' : 'requiredColor'}
                                /> */}
                                <DatePicker
                                    id='ArrestDtTm'
                                    name='ArrestDtTm'
                                    ref={startRef}
                                    onKeyDown={(e) => {
                                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                            e.preventDefault();
                                        } else {
                                            onKeyDown(e);
                                        }
                                    }}
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    timeFormat="HH:mm "
                                    is24Hour
                                    isClearable={false}
                                    // selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                    selected={getValidDate(value?.ArrestDtTm)}
                                    autoComplete="Off"
                                    onChange={(date) => {
                                        setArrestDate(date ? getShowingMonthDateYear(date) : null);
                                        !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                                        if (date > new Date(datezone)) {
                                            date = new Date(datezone);
                                        }
                                        if (date >= new Date()) {
                                            setValue({ ...value, ['ArrestDtTm']: new Date() ? getShowingDateText(new Date()) : null })
                                        } else if (date <= new Date(incReportedDate)) {
                                            setValue({ ...value, ['ArrestDtTm']: incReportedDate ? getShowingDateText(incReportedDate) : null })
                                        } else {
                                            setValue({ ...value, ['ArrestDtTm']: date ? getShowingDateText(date) : null })
                                        }
                                    }}
                                    timeInputLabel
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    minDate={new Date(incReportedDate)}
                                    maxDate={new Date(datezone)}
                                    showDisabledMonthNavigation
                                    filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                                    disabled={nibrsSubmittedArrestMain === 1}
                                    className={nibrsSubmittedArrestMain === 1 ? 'LockFildsColor' : 'requiredColor'}
                                />
                            </div>

                            <div className="col-2 col-md-2 col-lg-1">
                                <label className='new-label text-nowrap mb-0'> Agency Name </label>
                            </div>
                            <div className="col-4 col-md-5 col-lg-3 ">
                                <Select
                                    name="ArrestingAgencyID"
                                    value={arrestingAgencyDrpData?.filter((obj) => obj.value === value?.ArrestingAgencyID)}
                                    styles={customStylesWithOutColor}
                                    isClearable
                                    options={arrestingAgencyDrpData}
                                    onChange={(e) => { ChangeDropDownArresting(e, 'ArrestingAgencyID') }}
                                    placeholder="Select..."
                                />
                            </div>

                            <div className="col-2 col-md-2 col-lg-2">
                                <label htmlFor="" className='new-label mb-0'>Arresting Agency</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                                <input
                                    type="text"
                                    name='ArrestingAgency'
                                    id='ArrestingAgency'
                                    value={value?.ArrestingAgency || ''}
                                    onChange={HandleChange}
                                    disabled={!value.ArrestingAgencyID || Agencystatus ? true : false}
                                    className={!value.ArrestingAgencyID || Agencystatus ? 'readonlyColor' : ''}
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2">
                                <label className='new-label mb-0'>Use of Force Applied</label>
                            </div>
                            <div className="col-4 col-md-5 col-lg-2">
                                <Select
                                    name='PoliceForceID'
                                    styles={customStylesWithOutColor}
                                    value={policeForceDrpData?.filter((obj) => obj.value === value?.PoliceForceID)}
                                    isClearable
                                    options={policeForceDrpData}
                                    onChange={(e) => {
                                        ChangeDropDown(e, 'PoliceForceID');
                                        if (!e) { setShowPoliceForce(false); }
                                    }}
                                    placeholder="Select..."
                                />
                                {/* {isEnabled && (
                              <div className='mt-2'
                                  style={{
                                      backgroundColor: '#fbecec',
                                      border: '1px solid red',
                                      borderRadius: '6px',
                                      padding: '3px 6px',
                                      textAlign: 'center',
                                      color: isHovered ? 'blue' : 'red',
                                      fontSize: '16px',
                                      maxWidth: '100%',
                                      width: '220px', // can be % if inside flex/grid
                                      boxSizing: 'border-box',
                                      wordWrap: 'break-word',
                                      cursor: 'pointer',
                                  }}
                                  onClick={handleClick}
                                  onMouseEnter={handleMouseEnter}
                                  onMouseLeave={handleMouseLeave}
                              >
                                  Enter Details in Police Force
                              </div>
  
                          )} */}
                            </div>

                            <div className="col-2 col-md-2 col-lg-1">
                                <label htmlFor="" className='new-label mb-0'>Arrest Type
                                    {errors.ArrestTypeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ArrestTypeIDError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 ">
                                <Select
                                    name="ArrestTypeID"
                                    value={arrestTypeDrpData?.filter((obj) => obj.value === value?.ArrestTypeID)}
                                    styles={nibrsSubmittedArrestMain === 1 ? LockFildscolour : Requiredcolour}
                                    isDisabled={nibrsSubmittedArrestMain === 1 ? true : false}
                                    isClearable
                                    options={arrestTypeDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'ArrestTypeID') }}
                                    placeholder="Select..."
                                />
                            </div>

                            <div className="col-4 col-md-4 col-lg-2">
                                <label htmlFor="" className='new-label px-0 text-nowrap mb-0'>Supervisor</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2">
                                <Select
                                    name='SupervisorID'
                                    styles={customStylesWithOutColor}
                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.SupervisorID)}
                                    isClearable
                                    options={agencyOfficerDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'SupervisorID')}
                                    placeholder="Select..."
                                />
                            </div>

                            <div className="col-4 col-md-4 col-lg-1"></div>
                            {isEnabled ? (
                                <div className="col-4 col-md-4 col-lg-3">
                                    <div
                                        onClick={handleClick}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        style={{
                                            border: '1px solid red',
                                            backgroundColor: '#ffe6e6',
                                            color: isHovered ? 'blue' : 'red',
                                            padding: '3px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                            transition: 'color 0.3s ease',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            width: '100%',
                                            textAlign: 'center'
                                        }}
                                    >
                                        Enter Details in Police Force
                                    </div>
                                </div>
                            ) : (
                                <div className="col-4 col-md-4 col-lg-3">
                                    <div
                                        style={{
                                            backgroundColor: '#f2f2f2',
                                            color: 'gray',
                                            padding: '3px',
                                            borderRadius: '4px',
                                            display: 'inline-block',
                                            transition: 'color 0.3s ease',
                                            fontWeight: 'bold',
                                            fontSize: '14px',
                                            width: '100%',
                                            textAlign: 'center'
                                        }}
                                    >
                                    </div>
                                </div>
                            )}

                            <div className="col-2 col-md-2 col-lg-1">
                                <label htmlFor="" className='new-label mb-0'>Arrestee
                                    {errors.ArresteeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ArresteeIDError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 d-flex align-items-center gap-2">
                                {
                                    MstPage === "MST-Arrest-Dash" ?
                                        <Select
                                            className="w-100"
                                            name="ArresteeID"
                                            styles={nibrsSubmittedArrestMain === 1 ? LockFildscolour : NameStatus ? 'readonlyColor' : Requiredcolour}
                                            isDisabled={nibrsSubmittedArrestMain === 1 || NameStatus ? true : false}
                                            options={mastersNameDrpData}
                                            value={mastersNameDrpData?.filter((obj) => obj.value === value?.ArresteeID)}
                                            isClearable
                                            onChange={(e) => ChangeDropDown(e, 'ArresteeID')}
                                            placeholder="Select..."
                                        />
                                        :
                                        <Select
                                            className="w-100"
                                            name="ArresteeID"
                                            styles={nibrsSubmittedArrestMain === 1 ? LockFildscolour : NameStatus ? 'readonlyColor' : Requiredcolour}
                                            isDisabled={arrestID || nibrsSubmittedArrestMain === 1 || NameStatus ? true : false}
                                            options={arresteeNameData}
                                            value={arresteeNameData?.filter((obj) => obj.value === value?.ArresteeID)}
                                            isClearable
                                            onChange={(e) => ChangeDropDown(e, 'ArresteeID')}
                                            placeholder="Select..."
                                        />
                                }
                                {!arrestID && (
                                    <div className="ml-1" data-toggle="modal" data-target="#MasterModal">
                                        <button
                                            className="btn btn-sm bg-green text-white"
                                            onClick={() => {
                                                if (possessionID) {
                                                    GetSingleDataPassion(possessionID);
                                                }
                                                else {
                                                    setPossenSinglData([]);
                                                    setPossessionID('');

                                                }
                                                setType('ArrestMod');
                                                setNameModalStatus(true); setDatePickerRequiredColor(true);
                                            }}
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="col-4 col-md-4 col-lg-2 d-flex align-items-center gap-2">
                                <label htmlFor="" className='new-label mr-1 mb-0'>
                                    DOB
                                </label>
                                <div>
                                    <DatePicker
                                        id='DateOfBirth'
                                        name='DateOfBirth'
                                        selected={dobDate}
                                        // onChange={handleDateChange}
                                        onKeyDown={(e) => {
                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                e.preventDefault();
                                            } else {
                                                onKeyDown(e);
                                            }
                                        }}
                                        dateFormat={"MM/dd/yyyy"}
                                        // showTimeSelect={allowTimeSelect} // Always show time picker
                                        timeFormat="HH:mm"
                                        timeIntervals={1}
                                        className='readonlyColor'
                                        timeCaption="Time"
                                        disabled
                                        placeholderText={value.DateOfBirth ? value.DateOfBirth : 'Select...'}
                                        isClearable={value.DateOfBirth ? true : false}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="col-12 col-md-10 col-lg-4 d-flex align-items-center gap-2">
                                <label htmlFor="AgeFrom" className="label-name mr-1 mb-0">
                                    Age
                                </label>
                                <div className="d-flex align-items-center gap-2">
                                    <input type="text" name="AgeFrom" className="form-control " maxLength={3} readOnly placeholder="From" autoComplete="off"
                                        style={{ width: "60px" }} value={value?.AgeFrom}
                                    />
                                    <span className="dash-name">_</span>
                                    <input type="text" name="AgeTo" className="form-control " readOnly maxLength={3} placeholder="To" autoComplete="off" style={{ width: "45px" }}
                                    />
                                    <div className='ml-2'>
                                        <Select
                                            name='AgeUnitID'
                                            value={ageUnitDrpData?.find((obj) => obj.value === value?.AgeUnitID)}
                                            options={ageUnitDrpData}
                                            onChange={(e) => ChangeDropDown(e, 'AgeUnitID')}
                                            isClearable
                                            isDisabled
                                            placeholder="Age Unit..."
                                            styles={value.AgeFrom ? Requiredcolour : customStylesWithOutColor}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 col-md-3 col-lg-2 d-flex align-items-center gap-2 ">
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="SexID" className="new-label mb-0 mr-1">
                                        Gender
                                    </label>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <Select
                                        styles={customStylesWithOutColor}
                                        name='SexID'
                                        value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                        options={sexIdDrp}
                                        onChange={(e) => ChangeDropDown(e, 'SexID')}
                                        isClearable
                                        isDisabled
                                        placeholder="Select..."
                                    />
                                </div>
                            </div>
                            <div className="col-2 col-md-2 col-lg-1">
                                <label className='new-label text-nowrap mb-0'> Race</label>
                            </div>
                            <div className="col-4 col-md-5 col-lg-3 ">
                                <Select
                                    name='RaceID'
                                    styles={customStylesWithOutColor}
                                    value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                    options={raceIdDrp}
                                    onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                    isClearable
                                    isDisabled
                                    placeholder="Select..."
                                />
                            </div>

                            <div className="col-6 col-md-3 col-lg-2">
                                <label htmlFor="" className='new-label px-0 text-nowrap mb-0'>Rights Given</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2">
                                <Select
                                    name='RightsGivenID'
                                    styles={customStylesWithOutColor}
                                    value={policeForceDrpData?.filter((obj) => obj.value === value?.RightsGivenID)}
                                    isClearable
                                    options={policeForceDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'RightsGivenID')}
                                    placeholder="Select..."
                                />
                            </div>

                            <div className="col-6 col-md-3 col-lg-2">
                                <label htmlFor="" className='new-label px-0 text-nowrap mb-0'>Response</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2">
                                <Select
                                    name='ResponseID'
                                    styles={customStylesWithOutColor}
                                    value={policeForceDrpData?.filter((obj) => obj.value === value?.ResponseID)}
                                    isClearable
                                    options={policeForceDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'ResponseID')}
                                    placeholder="Select..."
                                />
                            </div>

                            <div className="col-2 col-md-2 col-lg-1">
                                <label htmlFor="" className='new-label mb-0'>Given By</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3">
                                <Select
                                    name='GivenByID'
                                    styles={customStylesWithOutColor}
                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.GivenByID)}
                                    isClearable
                                    options={agencyOfficerDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'GivenByID')}
                                    placeholder="Select..."
                                // isDisabled={rightGivenCode === 'N' || !rightGivenCode}
                                />
                            </div>
                            <div className="col-6 col-md-3 col-lg-2">
                                <label htmlFor="" className='new-label text-nowrap mb-0'>Primary Officer</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2">
                                <Select
                                    name='PrimaryOfficerID'
                                    styles={customStylesWithOutColor}
                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                    isClearable
                                    options={agencyOfficerDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-4 col-md-4 col-lg-4"></div>

                            {/* <div className="col-2 col-md-2 col-lg-1">
                        <label htmlFor="" className='new-label mb-0'>Parent Name</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 d-flex align-items-center g-2 ">
                        <input type="text" name="ParentNameID" value={value?.ParentNameID} className="readonlyColor form-control" id="ParentNameID" readOnly />
                     
                        <div className="ml-1" data-toggle="modal" data-target="#MasterModal">
                            <button
                                className="btn btn-sm bg-green text-white"
                                onClick={() => {
                                    if (possessionID) {
                                        GetSingleDataPassion(possessionID);
                                    }
                                    setNameModalStatus(true); setDatePickerRequiredColor(true);
                                }}
                            >
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                       
                    </div> */}
                            <div className="col-2 col-md-2 col-lg-1">
                                <label htmlFor="" className='new-label mb-0'>Parent Name
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 d-flex align-items-center g-2">

                                <Select
                                    // styles={customStylesWithOutColor}
                                    className="w-100"
                                    name="ParentNameID"
                                    value={arresteeNameData?.filter((obj) => obj.value === value?.ParentNameID)}
                                    options={value.ArresteeID ? complainantfilterID : arresteeNameData}
                                    onChange={(e) => { ChangeDropDown(e, 'ParentNameID') }}
                                    isClearable
                                    placeholder="Select..."
                                    isDisabled={value?.IsJuvenileArrest ? false : true}
                                    styles={value?.IsJuvenileArrest === 'true' ? Requiredcolour : customStylesWithOutColor}
                                />

                                {/* {!arrestID && ( */}
                                <div className="ml-1" data-toggle="modal" data-target="#MasterModal">
                                    <button
                                        className="btn btn-sm bg-green text-white"
                                        disabled={value?.IsJuvenileArrest ? false : true}
                                        onClick={() => {
                                            if (ArrestparentID) {
                                                GetSingleDataPassion(ArrestparentID);
                                            }
                                            else {
                                                setArrestParentID('');
                                                setPossenSinglData('');
                                            }
                                            setType('ArrestParentMod');

                                            setNameModalStatus(true); setDatePickerRequiredColor(true);
                                        }}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                                {/* )} */}
                            </div>

                            <div className="col-2 col-md-2 col-lg-2">
                                <label htmlFor="" className='new-label mb-0'>Parent Phone  {errors.CellPhoneError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CellPhoneError}</p>
                                ) : null}</label>

                            </div>
                            <div className="col-4 col-md-4 col-lg-2">
                                <input type="text" maxLength={10} name='ParentPhone' id='ParentPhone' className={`form-control ${value?.IsJuvenileArrest === false ? 'readonlyColor' : ''}`}
                                    value={value?.ParentPhone} onChange={handleChange} required disabled={value.IsJuvenileArrest === true ? false : true} />
                            </div>

                            <div className="col-2 col-md-2 col-lg-2">
                                <label htmlFor="" className='new-label mb-0'>Name Of School</label>
                            </div>

                            <div className="col-4 col-md-4 col-lg-2">
                                <input type="text" name="NameOfSchool"
                                    value={value?.NameOfSchool}
                                    disabled={value?.IsJuvenileArrest ? false : true} onChange={HandleChange}
                                    styles={value?.IsJuvenileArrest === 'true' ? Requiredcolour : customStylesWithOutColor}
                                    className=" form-control" id="NameOfSchool" />
                            </div>

                            <div className="col-2 col-md-2 col-lg-1">
                                <label htmlFor="" className='new-label mb-0'>Location Of School</label>
                            </div>

                            <div className="col-4 col-md-4 col-lg-11">
                                <input type="text" name="LocationOfSchool"
                                    value={value?.LocationOfSchool}
                                    disabled={value?.IsJuvenileArrest ? false : true} onChange={HandleChange}
                                    styles={value?.IsJuvenileArrest === 'true' ? Requiredcolour : customStylesWithOutColor}
                                    className=" form-control" id="LocationOfSchool" />
                            </div>
                            <div className="col-2 col-md-2 col-lg-1">
                                <label htmlFor="" className='new-label mb-0'>Grade</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3">
                                <input type="text" name="Grade"
                                    disabled={value?.IsJuvenileArrest ? false : true} onChange={HandleChange}
                                    styles={value?.IsJuvenileArrest === 'true' ? Requiredcolour : customStylesWithOutColor}
                                    value={value?.Grade} className=" form-control" id="Grade" />
                            </div>

                            <div className="col-2 col-md-2 col-lg-2">
                                <label htmlFor="" className='new-label mb-0'>Disposition {errors.JuvenileDispoError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.JuvenileDispoError}</p>
                                ) : null}</label>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2">
                                <Select
                                    name='JuvenileDispositionID'
                                    menuPlacement='top'
                                    isDisabled={value?.IsJuvenileArrest || nibrsSubmittedArrestMain === 1 ? false : true}
                                    styles={nibrsSubmittedArrestMain === 1 ? LockFildscolour : value?.IsJuvenileArrest === 'true' || value?.IsJuvenileArrest === true ? Requiredcolour : customStylesWithOutColor}
                                    value={arrestJuvenileDisDrpData?.filter((obj) => obj.value === value?.JuvenileDispositionID)}
                                    isClearable
                                    options={arrestJuvenileDisDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'JuvenileDispositionID')}
                                    placeholder="Select..."
                                />
                            </div>
                            <div className='col-2 col-md-2 col-lg-3'>
                                <label className="form-check-label mb-0 ml-3 text-nowrap" htmlFor="flexCheckDefault">School Notified</label>
                                <input className="form-check-input ml-2" type="checkbox" name="IsSchoolNotified" checked={value?.IsSchoolNotified} onChange={HandleChange} />
                                <label className="form-check-label mb-0 ml-4 text-nowrap" htmlFor="flexCheckDefault">Y or N</label>
                            </div>
                        </div>
                    </div >
                    {
                        modalStatus &&
                        <div className="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="box text-center py-5">
                                        <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                        <div className="btn-box mt-3">
                                            <button type="button" onClick={delete_Image_File} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                            <button type="button" onClick={() => { setImageId(''); setModalStatus(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className={`modal ${confirmInsertArrest ? 'show' : ''}`} style={{ display: confirmInsertArrest ? 'block' : 'none', background: "rgba(0,0,0, 0.5)", transition: '0.5s', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to save current record ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={() => { setInsertArrest(false); check_Validation_Error(); setConfirmInsertArrest(false); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }}>OK</button>
                                        <button type="button" onClick={() => { setConfirmInsertArrest(false); }} className="btn btn-sm btn-secondary ml-2">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12  text-right p-0" style={{ marginTop: '10px' }}>
                        {/* {MstPage !== "MST-Arrest-Dash" && (<button type="button" className="btn btn-sm btn-success mr-1" onClick={setStatusFalse}>New </button>)} */}
                        {/* <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { setShowPage('Charges'); check_Validation_Error(); }}>Next </button> */}


                        {
                            arrestID && (ArrestSta === true || ArrestSta === 'true') ?
                                effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                                    <>
                                        <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#myModal"
                                            disabled={!statesChangeStatus} onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Update</button>

                                        <button
                                            type="button" className="btn btn-sm btn-success mr-4" data-toggle="modal" data-target="#QueueReportsModal"
                                            onClick={() => { setshowModalReport(true); setIncMasterReport(true); setIncReportCount(IncReportCount + 1); }}
                                        >
                                            Print <i className="fa fa-print"></i>
                                        </button>
                                    </>
                                    : <></> :
                                    <>
                                        <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#myModal" disabled={!statesChangeStatus} onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Update</button>

                                        <button
                                            type="button" className="btn btn-sm btn-success mr-4" data-toggle="modal" data-target="#QueueReportsModal"
                                            onClick={() => { setshowModalReport(true); setIncMasterReport(true); setIncReportCount(IncReportCount + 1); }}
                                        >
                                            Print <i className="fa fa-print"></i>
                                        </button>
                                    </>
                                :
                                effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#myModal" onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Next</button>
                                    : <></> :
                                    <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#myModal" onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Next</button>
                        }
                        {
                            MstPage === "MST-Arrest-Dash" &&
                            <button type="button" className="btn btn-sm btn-success mx-1" onClick={onMasterPropClose} data-dismiss="modal">Close</button>
                        }
                    </div >
                    <div className={`modal-backdrop ${confirmInsertArrest ? 'show' : ''}`} style={{ display: confirmInsertArrest ? 'block' : 'none' }}></div>
                    <ListModal {...{ openPage, setOpenPage }} />
                    <ConfirmModal {...{ showModal, setShowModal, arresteeChange, value, possessionID, setPossessionID, setValue, setErrors }} />
                    <DeletePopUpModal func={DeleteArrest} clearID={clearID} />
                    <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
                    <CurrentArrestMasterReport ArrestNumber={value.ArrestNumber} {...{ printIncReport, setIncMasterReport, IncReportCount, setIncReportCount, showModalReport, setshowModalReport }} />
                    <MasterNameModel {...{ type, setArrestID, isDatePickerRequiredColor, value, setValue, setArrestParentID, ArrestparentID, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, possessionID, setPossessionID, possenSinglData, setPossenSinglData, GetSingleDataPassion }} />
                    <ImageModel multiImage={multiImage} setStatesChangeStatus={setStatesChangeStatus} pinID={loginPinID} primaryOfficerID={agencyOfficerDrpData} setMultiImage={setMultiImage} uploadImgFiles={uploadImgFiles} setuploadImgFiles={setuploadImgFiles} ChangeDropDown={ChangeDropDown} modalStatus={modalStatus} setModalStatus={setModalStatus} imageId={imageid} setImageId={setImageId} imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} delete_Image_File={delete_Image_File} setImgData={setImgData} imgData={imgData} updateImage={update_Vehicle_MultiImage} agencyID={loginAgencyID} />
                </>
            )}
        </>

    )
}

export default Home

const Get_Given_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.RightsGivenID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}

