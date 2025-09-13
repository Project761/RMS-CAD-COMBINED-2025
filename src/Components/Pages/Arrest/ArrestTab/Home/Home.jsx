import React, { useEffect, useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Aes256Encrypt, Decrypt_Id_Name, LockFildscolour, Requiredcolour, base64ToString, filterPassedTimeZoneArrest, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, nibrscolourStyles, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import { AddDeleteUpadate, AddDelete_Img, fetchPostData } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import ConfirmModal from '../../ConfirmModal';
import defualtImage from '../../../../../img/uploadImage.png'
import { Carousel } from 'react-responsive-carousel';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import DataTable from 'react-data-table-component';
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



const Home = ({ setShowJuvinile, setShowPage, setShowPoliceForce, DecArrestId, setStatus }) => {

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


    var SideBarStatus = query?.get("SideBarStatus");


    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }

    if (!NameID) { DecNameId = 0; }
    else { DecNameId = parseInt(base64ToString(NameID)); }

    const { get_Arrest_Count, setArrestName, setIncidentNumber, get_OffenseName_Data, arrestChargeData, changesStatus, setArrestChargeData, updateCount, setUpdateCount, get_ArrestCharge_Count, get_Data_Arrest_Charge, nibrsSubmittedArrestMain, setnibrsSubmittedArrestMain, tabCountArrest, incidentNumber, ArresteName, arrestFilterData, get_Data_Arrest, policeForceDrpData, get_Police_Force, changesStatusCount, setChangesStatus, get_Incident_Count, setActiveArrest, datezone, GetDataTimeZone, incidentCount } = useContext(AgencyContext);

    const [arrestDate, setArrestDate] = useState();
    const [rightGivenCode, setRightGivenCode] = useState('N');
    const [ArrestID, setArrestID] = useState('');
    const [Editval, setEditval] = useState();
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
    const [possessionID, setPossessionID] = useState('');
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [uploadImgFiles, setuploadImgFiles] = useState([]);
    const [imageModalStatus, setImageModalStatus] = useState(false);
    const [arrestingAgencyDrpData, setAgencyNameDrpData] = useState([]);
    const [isDatePickerRequiredColor, setDatePickerRequiredColor] = useState(false);
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [incExceDate, setincExceDate] = useState();

    const [AgencyCode, setAgencyCode] = useState('');
    const [Agencystatus, setAgencystatus] = useState('true');
    const [matchedAgency, setmatchedAgency] = useState('')
    const [isEnabled, setIsEnabled] = useState(false);


    const [printIncReport, setIncMasterReport] = useState(false);
    const [IncReportCount, setIncReportCount] = useState(1);
    const [showModalReport, setshowModalReport] = useState(false);
    const [incidentDate, setincidentDate] = useState([]);
    const [extractIncidentDate, setextractIncidentDate] = useState('');
    const [confirmInsertArrest, setConfirmInsertArrest] = useState(false);
    const [insertArrest, setInsertArrest] = useState([]);
    const [incidentReportedDate, setincidentReportedDate] = useState('');
    const [offenseNameID, setoffenseNameID] = useState();

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [ChargeLocalArr, setChargeLocalArr] = useState(
        JSON.parse(sessionStorage.getItem('ChargeLocalData')) || []
    );

    const type = "ArrestMod"

    const [value, setValue] = useState({
        'ArrestID': '', 'AgencyID': '', 'ArrestNumber': '', 'IncidentID': '', 'CreatedByUserFK': '', 'IsJuvenileArrest': '', 'ArrestDtTm': '', 'ArrestingAgency': '', 'ArrestTypeID': '', 'SupervisorID': '', 'PoliceForceID': '', 'RightsGivenID': '', 'JuvenileDispositionID': '', 'PhoneNo': '', 'PrimaryOfficerID': '', 'GivenByID': '', 'ArresteeID': '', 'ArresteeLable': 0, 'ModifiedByUserFK': '', 'IsMultipleArrestees': '', 'ArrestingAgencyID': '',
    });

    const [errors, setErrors] = useState({
        'ArresteeIDError': '', 'ArrestDtTmError': '', 'JuvenileDispoError': '', 'ArrestTypeIDError': '',
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
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            get_Arrest_Count(DecArrestId);
            dispatch(get_ScreenPermissions_Data("A067", localStoreData?.AgencyID, localStoreData?.PINID));
            get_Single_PersonnelList(localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID);
            setAgencyCode(localStoreData?.ORI);
            if (DecEIncID) {
                dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId));
                GetEditData(DecEIncID); get_Incident_Count(DecEIncID);
            }
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        }
        else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);


    useEffect(() => {
        if (loginAgencyID) {
            get_Arresting_DropDown(loginAgencyID, '1');
        }
    }, [loginAgencyID])

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
            dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId));
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(DecEIncID)) }
        }
        if (MstPage === "MST-Arrest-Dash" && possessionID) {
            dispatch(get_Masters_Name_Drp_Data(possessionID, 0, 0));
        }

    }, [DecEIncID, nameModalStatus, possessionID]);

    useEffect(() => {
        if (DecEIncID) {
            getIncidentData(DecEIncID);
            getNarrativeApprovedStatus(DecEIncID);
        }
    }, [DecEIncID]);

    useEffect(() => {
        if (possessionID) {
            checkSelectedName(parseInt(possessionID))
        }
    }, [possessionID, arresteeNameData]);


    //==================Dv-------------------------------
    useEffect(() => {
        if (DecNameId) {
            dispatch(get_Masters_Name_Drp_Data(DecNameId, 0, 0));
            checkSelectedName1(parseInt(DecNameId));
            setPossessionID(DecNameId);
            setValue({ ...value, ['ArresteeID']: parseInt(DecNameId) })
        }
    }, [DecNameId, arresteeNameData]);

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
            if (arrestTypeDrpData?.length === 0) dispatch(get_ArrestType_Drp(loginAgencyID));
            if (arrestJuvenileDisDrpData?.length === 0) dispatch(get_ArrestJuvenileDis_DrpData(loginAgencyID));
            if (policeForceDrpData?.length === 0) { get_Police_Force(); } dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, DecEIncID))
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (DecArrestId) {
            GetSingleData(DecArrestId, DecEIncID);
            setArrestID(DecArrestId);
            get_Data_Arrest_Charge(DecArrestId);
        } else {
            setMultiImage(''); setStatus(false); setArrestID('');
            reset_Value()
        }
    }, [DecArrestId, DecEIncID]);


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

    const GetSingleData = (ArrestID, MainIncidentID) => {
        const val = { 'ArrestID': ArrestID, 'PINID': '0', 'IncidentID': MainIncidentID }
        fetchPostData('Arrest/GetSingleData_Arrest', val).then((res) => {
            if (res.length > 0) {
                if (res[0]?.NIBRSClearanceID) { setincExceDate(new Date(res[0]?.NIBRSclearancedate)); }
                setStatus(true);
                setEditval(res);
            } else {
                setEditval([]); setincExceDate('');
            }
        })
    }

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

    const check_Validation_Error = (e) => {
        //-------------------------dv--------------------------------
        const arresteeStatus = possessionID ? checkSelectedName(value?.ArresteeID) : checkSelectedName1(value?.ArresteeID)

        if (JuvenileCleared === false && value.IsJuvenileArrest) {
            toastifyError('You are not authorized to create a juvenile arrest.')
            return;
        }
        if (arresteeStatus) {
            const ArresteeIDErr = RequiredFieldIncident(value.ArresteeID);
            const ArrestDtTmErr = RequiredFieldIncident(value.ArrestDtTm);
            const CellPhoneErr = value.PhoneNo ? PhoneField(value.PhoneNo) : 'true'
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
                if (ArrestID && (ArrestSta === true || ArrestSta === 'true')) { update_Arrest(); }
                else { insert_Arrest_Data(); }
            } else {
                if (ArrestID && (ArrestSta === true || ArrestSta === 'true')) { update_Arrest(); }
                else { insert_Arrest_Data(); }
            }
        }
    }, [ArrestDtTmError, ArresteeIDError, CellPhoneError, JuvenileDispoError, ArrestTypeIDError])

    useEffect(() => {
        if (Editval?.length > 0) {
            get_Arrest_MultiImage(ArrestID);
            setValue({
                ...value,
                'ArrestID': Editval[0]?.ArrestID, 'ArrestNumber': Editval[0]?.ArrestNumber, 'IsJuvenileArrest': Editval[0]?.IsJuvenileArrest,
                'ArrestDtTm': Editval[0]?.ArrestDtTm ? getShowingDateText(Editval[0]?.ArrestDtTm) : "", 'IsMultipleArrestees': Editval[0]?.IsMultipleArrestees,
                'ArrestingAgencyID': Editval[0]?.ArrestingAgencyID,
                'ArrestingAgency': Editval[0]?.ArrestingAgency ? Editval[0]?.ArrestingAgency : '',
                'PhoneNo': Editval[0]?.PhoneNo ? Editval[0]?.PhoneNo : '',
                'ArrestTypeID': Editval[0]?.ArrestTypeID, 'SupervisorID': Editval[0]?.SupervisorID, 'PoliceForceID': Editval[0]?.PoliceForceID ? Editval[0]?.PoliceForceID : '',
                'ArresteeID': Editval[0]?.ArresteeID, 'RightsGivenID': Editval[0]?.RightsGivenID, 'JuvenileDispositionID': Editval[0]?.JuvenileDispositionID,
                'GivenByID': Editval[0]?.GivenByID, 'PrimaryOfficerID': Editval[0]?.PrimaryOfficerID, 'ModifiedByUserFK': loginPinID,
            });
            setPossessionID(Editval[0]?.ArresteeID);
            setArrestName(Editval[0]?.Arrestee_Name ? Editval[0]?.Arrestee_Name : '');
            setIncidentNumber(Editval[0]?.IncidentNumber ? Editval[0]?.IncidentNumber : '')
            setArrestDate(Editval[0]?.ArrestDtTm ? new Date(Editval[0]?.ArrestDtTm) : ''); setRightGivenCode(Get_Given_Code(Editval, policeForceDrpData))
            setnibrsSubmittedArrestMain(Editval[0]?.IsNIBRSSummited);
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
            setValue({
                ...value,
                'ArrestNumber': '', 'IsJuvenileArrest': '', 'ArrestDtTm': '', 'ArrestTypeID': '', 'SupervisorID': '',
                'PoliceForceID': '', 'RightsGivenID': '', 'JuvenileDispositionID': '', 'PhoneNo': '', 'GivenByID': '', 'PrimaryOfficerID': '', 'ModifiedByUserFK': '', 'IsMultipleArrestees': '',

            });
            setArrestDate();
        }
    }, [Editval, changesStatusCount])

    // const [isHoveredUseForm, setIsHoveredUseForm] = useState(false);
    // const handleMouseEnterUseForm = () => setIsHoveredUseForm(true);
    // const handleMouseLeaveUseForm = () => setIsHoveredUseForm(false);

    const [isHoveredUseForm, setIsHoveredUseForm] = useState(false);
    const handleMouseEnterUseForm = () => setIsHoveredUseForm(true);
    const handleMouseLeaveUseForm = () => setIsHoveredUseForm(false);

    const handleClickCharges = () => {
        setShowPage('Charges')// Update the path according to your routing setup
    };

    const reset_Value = () => {
        setAgencystatus(true);
        Reset();
        setShowJuvinile(false);
        setShowPoliceForce(false);
        setValue(prevValue => ({
            ...prevValue, ArrestNumber: '', IsJuvenileArrest: '', ArrestDtTm: '', ArrestingAgency: '', ArrestTypeID: '', SupervisorID: '', PoliceForceID: '', ArresteeID: '', RightsGivenID: '', JuvenileDispositionID: '', PhoneNo: '', GivenByID: '', PrimaryOfficerID: '', ModifiedByUserFK: '', IsMultipleArrestees: '',
            ArrestingAgencyID: ''
        }));
        setValueCharge({ ...valueCharge, 'CreatedByUserFK': '', 'ChargeCodeID': '', 'NIBRSID': '', 'WarrantID': '', 'LawTitleId': '', });
        setErrors(prevErrors => ({
            ...prevErrors, ArresteeIDError: '', PrimaryOfficerIDError: '', ArrestDtTmError: '', JuvenileDispoError: '', ArrestTypeIDError: ''
        }));
        sessionStorage.removeItem('ChargeLocalData');
        setnibrsSubmittedArrestMain(0);
        setArrestDate(); setMultiImage(''); setuploadImgFiles('');
        setStatesChangeStatus(false); setStatus(false); setArrestID('');
        setChangesStatus(false);
        setArrestChargeData([]);
        setChargeID('');
        get_Arresting_DropDown(loginAgencyID);
    };

    const HandleChange = (e) => {
        if (e.target.name === "IsJuvenileArrest") {
            // setChangesStatus(true); setStatesChangeStatus(true)
            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
            setValue({ ...value, [e.target.name]: e.target.checked });
        } else if (e.target.name === 'PhoneNo') {
            var ele = e.target.value.replace(/[^0-9\s]/g, "")
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setChangesStatus(true)
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] });
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
            setValue({ ...value, ['JuvenileDispositionID']: '', ['PhoneNo']: '' });
        } else { setShowJuvinile(true); }
    }, [value.IsJuvenileArrest])

    const insert_Arrest_Data = async () => {
        const hasChargesInGrid = arrestChargeData && arrestChargeData.length > 0;
        const hasChargesInLocalStorage = ChargeLocalArr && ChargeLocalArr.length > 0;
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

                const { ArrestNumber, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, IsMultipleArrestees, ArrestingAgencyID, } = value;
                const val = {
                    'ArrestID': DecArrestId, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'CreatedByUserFK': loginPinID, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': '', 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
                }
                AddDeleteUpadate('Arrest/Insert_Arrest', val).then(async (res) => {
                    if (res.success) {
                        const newArrestID = res.ArrestID;
                        await SyncLocalChargesToServer(newArrestID, DecEIncID, loginPinID, loginAgencyID, ChargeLocalArr, setChargeLocalArr, get_Arrest_Count, get_Data_Arrest_Charge
                        );
                        if (MstPage === "MST-Arrest-Dash") {
                            navigate(`/Arrest-Home?page=MST-Arrest-Dash&ArrNo=${res?.ArrestNumber}&IncNo=${incidentNumber}&Name=${ArresteName}&ArrestId=${stringToBase64(res?.ArrestID)}&ArrestSta=${true}&ChargeSta=${true}`);
                        } else {
                            navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(res?.ArrestID)}&ArrNo=${res?.ArrestNumber}&Name=${ArresteName}&ArrestSta=${true}&ChargeSta=${false}`)
                        }
                        // reset_Value();
                        toastifySuccess(res.Message); get_Arrest_Count(DecArrestId); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                        GetSingleData(res?.ArrestID, DecEIncID);
                        setArrestID(res.ArrestID); setStatus(false); setChangesStatus(false); setStatesChangeStatus(false)
                        if (uploadImgFiles?.length > 0) { upload_Image_File(res.ArrestID); setuploadImgFiles(''); }
                        setErrors({ ...errors, ['ArresteeIDError']: '' }); get_Incident_Count(DecEIncID);
                    }
                });

            }
        }

    }


    const update_Arrest = () => {
        const { ArrestNumber, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, IsMultipleArrestees, ArrestingAgencyID, } = value;
        const val = {
            'ArrestID': DecArrestId, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': loginPinID, 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
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

                const { ArrestNumber, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, IsMultipleArrestees, ArrestingAgencyID, } = value;
                const val = {
                    'ArrestID': DecArrestId, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'CreatedByUserFK': loginPinID, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': loginPinID, 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
                }
                AddDeleteUpadate('Arrest/Update_Arrest', val).then((res) => {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); setChangesStatus(false); setStatesChangeStatus(false); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                    setErrors({ ...errors, ['ArresteeIDError']: '' }); GetSingleData(ArrestID, DecEIncID); get_Arrest_Count(DecArrestId);
                    if (uploadImgFiles?.length > 0) { upload_Image_File(); setuploadImgFiles(''); }

                })

            }
        }


    }

    const DeleteArrest = () => {
        const val = { 'ArrestID': ArrestID, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('Arrest/Delete_Arrest', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                get_Incident_Count(DecEIncID); get_Arrest_Count(DecArrestId); setStatusFalse(); Reset()
                navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`)
                if (DecEIncID) {
                    dispatch(get_ArresteeName_Data('', '', DecEIncID, true, DecArrestId));
                }
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


    const columns = [
        {
            name: 'Arrest Number', selector: (row) => row.ArrestNumber, sortable: true
        },
        {
            name: 'Arrestee Name', selector: (row) => row.Arrestee_Name, sortable: true
        },
        {
            name: 'Arrest Type', selector: (row) => row.ArrestType_Description, sortable: true
        },
        {
            name: 'Arresting Agency', selector: (row) => row.Agency_Name, sortable: true
        },
        {
            name: 'Charges(Count)', selector: (row) => row.ChargeCount, sortable: true
        },
        // {
        //     name: 'Juvenile Flag', selector: (row) => row.IsJuvenileArrest, sortable: true
        // },
        {
            name: 'Juvenile Flag',
            selector: row => (
                <input type="checkbox" checked={row.IsJuvenileArrest === true} disabled />
            ),
            sortable: true
        },

        {
            name: 'Use of Force Flag', selector: (row) => row.PoliceForce_Description, sortable: true
        },
        {
            width: '200px', name: 'Supervisor Name',
            selector: (row) => <>{row?.Supervisor_Name ? row?.Supervisor_Name.substring(0, 60) : ''}{row?.Supervisor_Name?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        // {
        //     name: 'Police Force Description', selector: (row) => row.PoliceForce_Description, sortable: true
        // },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={() => setArrestID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">                                    <i className="fa fa-trash"></i>
                            </span>
                            : <></> :
                            <span onClick={() => setArrestID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">                                    <i className="fa fa-trash"></i>
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const onMasterPropClose = () => {
        navigate('/dashboard-page');
    }

    const set_Edit_Value = (row) => {
        if (row?.PoliceForce_Description === "Yes") {
            setIsEnabled(true);
        } else {
            setIsEnabled(false);
        }
        if (row?.Agency_Name == matchedAgency?.Agency_Name) {
            setAgencystatus(true)
        } else {
            setAgencystatus(false);
        }
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
            modal.show();
        } else {
            if (row.ArrestID) {
                Reset();
                navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${row?.ArrestNumber}&Name=${row?.Arrestee_Name}&ArrestSta=${true}&ChargeSta=${false}&SideBarStatus=${!SideBarStatus}&ArrestStatus=${false} `)
                setArrestID(row?.ArrestID); setActiveArrest(row?.ArrestID); setErrors(''); setStatesChangeStatus(false); setChangesStatus(false); setStatus(true);
                GetSingleData(row.ArrestID, DecEIncID); get_Arrest_Count(row?.ArrestID);
            }
        }
    }

    const SyncLocalChargesToServer = async (ArrestID, DecEIncID, loginPinID, loginAgencyID, ChargeLocalArr, setChargeLocalArr, get_Arrest_Count, get_Data_Arrest_Charge) => {
        if (!ArrestID || !ChargeLocalArr?.length) return;
        for (let charge of ChargeLocalArr) {
            const val = {
                ...charge, ChargeID: null, ArrestID, IncidentID: DecEIncID, CreatedByUserFK: loginPinID, AgencyID: loginAgencyID,
            };
            await AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
                if (res?.success) {
                    console.log(`✅ Synced local charge: ${charge.ChargeCodeID}`);
                }
            });
        }
        // Cleanup
        setChargeLocalArr([]);
        sessionStorage.removeItem('ChargeLocalData');
        get_Arrest_Count(ArrestID);
        get_Data_Arrest_Charge(ArrestID);
    };

    const setStatusFalse = () => {
        if (MstPage === "MST-Arrest-Dash") {
            navigate(`/Arrest-Home?page=MST-Arrest-Dash&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`);
            reset_Value(); setErrors(''); setPossessionID(''); setPossenSinglData([]); setArrestID('');
        } else {
            navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`)

            setErrors(''); setPossessionID(''); setPossenSinglData([]);
            setActiveArrest(false); setRightGivenCode(false); setArrestID(''); reset_Value(); setIsEnabled(false);

        }
    }

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
                'ArrestID': ArrestID ? ArrestID : arrID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
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
                get_Arrest_MultiImage(ArrestID ? ArrestID : arrID); setuploadImgFiles([]);
            }
        }).catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        const value = { 'PhotoID': imageid, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('Arrest/Delete_ArrestPhoto', value).then((data) => {
            if (data.success) {
                get_Arrest_MultiImage(ArrestID); setModalStatus(false); setImageId('');
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
            else if (name === 'ArresteeID') {
                if (get_OffenseName_Data) {
                    get_OffenseName_Data(e?.value);
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
        } else {
            if (name === 'RightsGivenID') {
                setRightGivenCode('N');
            } else if (name === 'ArresteeID') {
                setPossessionID(''); setPossenSinglData([]); setArresteeChange('');
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
            setArrestID(ArrestID)
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
                setValue({ ...value, ['ArrestingAgencyID']: e.value, ['ArrestingAgency']: e.label });
                setAgencystatus(true)
            } else {
                setValue({ ...value, [name]: e.value, ['ArrestingAgency']: '' });
                setAgencystatus(false);
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

    const handleClick = () => {
        setShowPage('PoliceForce')
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setNameModalStatus(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const customStylesWithOutColorCharge = {
        control: base => ({
            ...base, height: 20, minHeight: 30, fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    };



    //----------------------------//----------------------------------Charge-------------------------------------------

    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [EditvalCharge, setEditvalCharge] = useState([]);
    const [ChargeID, setChargeID] = useState();
    const [DecChargeId, setDecChargeId] = useState();
    const [delChargeID, setDelChargeID] = useState();
    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    const [NIBRSDrpData, setNIBRSDrpData] = useState([]);
    const [statesChangeCharge, setstatesChangeCharge] = useState(false);
    const [narrativeApprovedStatus, setNarrativeApprovedStatus] = useState(false);
    const [isChargeDel, setIsChargeDel] = useState(false);

    const [valueCharge, setValueCharge] = useState({
        'ArrestID': '', 'IncidentID': '', 'CreatedByUserFK': '', 'ChargeCodeID': '', 'NIBRSID': '', 'ChargeID': '', 'ModifiedByUserFK': '', 'LawTitleId': '', 'AttemptComplete': '',
    });

    const [errorsCharge, setErrorsCharge] = useState({
        'NIBRSIDError': '', 'ChargeCodeIDError': '', 'AttemptRequiredError': '',
    })

    useEffect(() => {
        if (loginAgencyID) {
            setValueCharge({
                ...valueCharge,
                'IncidentID': DecEIncID, 'ArrestID': ArrestID, 'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
                'LawTitleId': '', 'AttemptComplete': '',
            });
            get_Arrest_Count(ArrestID); get_Data_Arrest_Charge(ArrestID);
            // lawTitle
            LawTitleIdDrpDwnVal(loginAgencyID, null);
            // nibrs code
            get_NIBRS_Drp_Data(loginAgencyID, null);
            // charge code
            get_ChargeCode_Drp_Data(loginAgencyID, null, null);
        }
    }, [loginAgencyID]);

    const check_Validation_ErrorCharge = (e) => {
        const NIBRSIDError = RequiredFieldIncident(valueCharge.NIBRSID);
        const ChargeCodeIDError = RequiredFieldIncident(valueCharge.ChargeCodeID);
        const AttemptRequiredError = RequiredFieldIncident(valueCharge.AttemptComplete);
        setErrorsCharge(pre => {
            return {
                ...pre,
                ['NIBRSIDError']: NIBRSIDError || pre['NIBRSIDError'],
                ['ChargeCodeIDError']: ChargeCodeIDError || pre['ChargeCodeIDError'],
                ['AttemptRequiredError']: AttemptRequiredError || pre['AttemptRequiredError'],
            }
        });
    }

    const { ChargeCodeIDError, NIBRSIDError, AttemptRequiredError } = errorsCharge

    useEffect(() => {
        if (ChargeCodeIDError === 'true' && NIBRSIDError === 'true' && AttemptRequiredError === 'true') {
            if (ChargeID) { update_Arrest_Charge() }
            else { Add_Charge_Data() }
        }
    }, [ChargeCodeIDError, NIBRSIDError, AttemptRequiredError])

    useEffect(() => {
        if (DecChargeId) {
            GetSingleDataCharge(DecChargeId);
        }
    }, [DecChargeId]);

    const GetSingleDataCharge = (ChargeID) => {
        if (ArrestID) {
            const val = { 'ChargeID': ChargeID };
            fetchPostData('ArrestCharge/GetSingleData_ArrestCharge', val).then((res) => {
                if (res) {
                    setEditvalCharge(res);
                } else {
                    setEditvalCharge([]);
                }
            });
        } else {
            const localChargeData = JSON.parse(sessionStorage.getItem('ChargeLocalData')) || [];
            const chargeData = localChargeData.find(charge => charge.ChargeID === ChargeID);

            if (chargeData) {
                setEditvalCharge([chargeData]);
            } else {
                setEditvalCharge([]);
            }
        }
    };

    useEffect(() => {
        if (EditvalCharge) {
            setValueCharge({
                ...valueCharge,
                'ChargeCodeID': EditvalCharge[0]?.ChargeCodeID || EditvalCharge?.ChargeCodeID,
                'NIBRSID': EditvalCharge[0]?.NIBRSID || EditvalCharge?.NIBRSCodeId,
                'ChargeID': EditvalCharge[0]?.ChargeID,
                'ModifiedByUserFK': loginPinID,
                'LawTitleId': EditvalCharge[0]?.LawTitleId || EditvalCharge?.LawTitleId,
                'AttemptComplete': EditvalCharge[0]?.AttemptComplete === "C"
                    ? "C"
                    : EditvalCharge[0]?.AttemptComplete === "A"
                        ? "A"
                        : "",
            });
            setArrestName(EditvalCharge[0]?.Name ? EditvalCharge[0]?.Name : '');
            // lawTitle
            LawTitleIdDrpDwnVal(loginAgencyID, null);
            // nibrs code
            get_NIBRS_Drp_Data(loginAgencyID, null);
            // charge code
            get_ChargeCode_Drp_Data(loginAgencyID, null, null);
        } else {
            setValueCharge({ ...valueCharge, 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'AttemptComplete': '', 'ChargeID': '', 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'LawTitleId': '', });
        }
    }, [EditvalCharge, changesStatusCount])

    // api/Narrative/GetData_AllIncidentNarrativeApprovedStatus
    // IncidentId

    const getNarrativeApprovedStatus = async (IncidentId) => {
        try {
            const res = await fetchPostData('Narrative/GetData_AllIncidentNarrativeApprovedStatus', { IncidentId: IncidentId });
            if (res?.length > 0) {
                // true when all narrative approved
                setNarrativeApprovedStatus(res[0]?.AllReportApprove);
            } else {
                setNarrativeApprovedStatus(false);
            }
        } catch (error) {
            setNarrativeApprovedStatus(false);
        }
    }


    const LawTitleIdDrpDwnVal = async (loginAgencyID, ChargeCodeID) => {
        const val = { AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID }
        await fetchPostData('LawTitle/GetDataDropDown_LawTitle', val).then((data) => {
            if (data) {
                setLawTitleIdDrp(Comman_changeArrayFormat(data, 'LawTitleID', 'Description'));
            } else {
                setLawTitleIdDrp([]);
            }
        })
    }

    const get_NIBRS_Drp_Data = (loginAgencyID, LawTitleID,) => {
        const val = { 'AgencyID': loginAgencyID, 'LawTitleID': LawTitleID ? LawTitleID : null, 'IncidentID': DecEIncID, }
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((res) => {
            if (res) {
                setNIBRSDrpData(threeColArrayWithCode(res, 'FBIID', 'Description', 'FederalSpecificFBICode'));

            } else {
                setNIBRSDrpData([]);

            }
        })
    }

    const get_ChargeCode_Drp_Data = (loginAgencyID, FBIID, LawTitleID) => {
        const val = { 'AgencyID': loginAgencyID, 'FBIID': FBIID, 'LawTitleID': LawTitleID, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'));
            } else {
                setChargeCodeDrp([]);
            }
        })
    };

    const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, chargeCodeId) => {
        const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: chargeCodeId };
        const nibrsCodeObj = { AgencyID: loginAgencyID, LawTitleID: null, IncidentID: DecEIncID, ChargeCodeID: chargeCodeId };
        try {
            const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
                fetchPostData('LawTitle/GetDataDropDown_LawTitle', lawTitleObj),
                fetchPostData('FBICodes/GetDataDropDown_FBICodes', nibrsCodeObj)
            ]);
            const lawTitleArr = Comman_changeArrayFormat(lawTitleResponse, 'LawTitleID', 'Description');
            const nibrsArr = threeColArrayWithCode(nibrsCodeResponse, 'FBIID', 'Description', 'FederalSpecificFBICode');
            setValueCharge({ ...valueCharge, LawTitleId: lawTitleArr[0]?.value, NIBRSID: nibrsArr[0]?.value, ChargeCodeID: chargeCodeId, });
        } catch (error) {
            console.error('Error during data fetching:', error);

        }
    };

    const onChangeDrpLawTitle = async (e, name) => {
        !addUpdatePermission && setstatesChangeCharge(true); !addUpdatePermission && setChangesStatus(true);

        if (e) {
            if (name === "LawTitleId") {
                setValueCharge({ ...valueCharge, ['LawTitleId']: e.value, ['NIBRSID']: null, ['ChargeCodeID']: null, });
                setChargeCodeDrp([]); setNIBRSDrpData([]);
                // nibrs code 
                get_NIBRS_Drp_Data(loginAgencyID, e.value);
                // charge code
                get_ChargeCode_Drp_Data(loginAgencyID, valueCharge?.NIBRSID, e.value);
            } else if (name === 'ChargeCodeID') {
                const res = await getLawTitleNibrsByCharge(loginAgencyID, valueCharge?.LawTitleId, e.value);
            } else {
                setValueCharge({ ...valueCharge, [name]: e.value });
            }
        } else {
            if (name === "LawTitleId") {
                setValueCharge({ ...valueCharge, ['LawTitleId']: null, ['NIBRSID']: '', ['ChargeCodeID']: null, });
                setChargeCodeDrp([]); setNIBRSDrpData([]);
                //law title
                LawTitleIdDrpDwnVal(loginAgencyID, null);
                // nibrs code
                get_NIBRS_Drp_Data(loginAgencyID, null);
                //offence code 
                get_ChargeCode_Drp_Data(loginAgencyID, null, null);

            } else if (name === 'ChargeCodeID') {
                setValueCharge({ ...valueCharge, ['ChargeCodeID']: null });
            } else {
                setValueCharge({ ...valueCharge, [name]: null });
            }
        }
    }

    const onChangeNIBRSCode = (e, name) => {
        !addUpdatePermission && setstatesChangeCharge(true); !addUpdatePermission && setChangesStatus(true);

        if (e) {
            if (name === 'NIBRSID') {
                if ((e.id === "09C" || e.id === "360" || e.id === "09A" || e.id === "09B" || e.id === "13A" || e.id === "13B" || e.id === "13C") && loginAgencyState === "TX") {
                    setValueCharge({ ...valueCharge, ["NIBRSID"]: e.value, ["ChargeCodeID"]: null, AttemptComplete: "C", });
                    setChargeCodeDrp([]); get_ChargeCode_Drp_Data(loginAgencyID, e.value, valueCharge?.LawTitleId);

                } else {
                    setValueCharge({ ...valueCharge, ['NIBRSID']: e.value, ['ChargeCodeID']: null, });
                    setChargeCodeDrp([]); get_ChargeCode_Drp_Data(loginAgencyID, e.value, valueCharge?.LawTitleId);

                }
            } else {
                setValueCharge({ ...valueCharge, [name]: e.value });

            }
        } else {
            if (name === "NIBRSID") {
                setValueCharge({ ...valueCharge, [name]: null, ['ChargeCodeID']: null, });
                get_ChargeCode_Drp_Data(loginAgencyID, null, null);
            } else {
                setValueCharge({ ...valueCharge, [name]: null });

            }
        }
    }

    const Add_Charge_Data = () => {
        const { ChargeCodeID, NIBRSID, LawTitleId, AttemptComplete } = valueCharge;
        const newCharge = {
            ...valueCharge,
            ChargeCodeID, NIBRSID, LawTitleId, IncidentID: DecEIncID, CreatedByUserFK: loginPinID, AgencyID: loginAgencyID, AttemptComplete: AttemptComplete,
        };

        if (ArrestID) {
            const val = { ...newCharge, ChargeID: DecChargeId, ArrestID: ArrestID, };
            AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); get_Arrest_Count(ArrestID);
                    get_Data_Arrest_Charge(ArrestID);
                    get_ArrestCharge_Count(DecChargeId);
                    Reset();
                    setChangesStatus(false);
                    setstatesChangeCharge(false);
                    setUpdateCount(updateCount + 1);
                    setErrorsCharge({ ...errorsCharge, ['ChargeCodeIDError']: '', });
                    LawTitleIdDrpDwnVal(loginAgencyID, null);
                    get_NIBRS_Drp_Data(loginAgencyID, null);
                    get_ChargeCode_Drp_Data(loginAgencyID, null, null);
                }
            });

        } else {
            const localCharge = {
                ...newCharge,
                ChargeID: `local-${Date.now()}`,
                ArrestID: null,
                NIBRS_Description: NIBRSDrpData?.find(x => x.value === NIBRSID)?.label || '',
                ChargeCode_Description: chargeCodeDrp?.find(x => x.value === ChargeCodeID)?.label || '',
                LawTitle_Description: lawTitleIdDrp?.find(x => x.value === LawTitleId)?.label || '',
            };
            const isDuplicate = ChargeLocalArr?.some(item =>
                item.ChargeCodeID === localCharge.ChargeCodeID &&
                item.NIBRSID === localCharge.NIBRSID
            );

            if (isDuplicate) {
                toastifyError('This charge already exists locally.');
                return;
            }

            const updatedLocalCharges = [...ChargeLocalArr, localCharge];
            setChargeLocalArr(updatedLocalCharges);
            sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedLocalCharges));
            Reset();
            setChangesStatus(false);
            setStatesChangeStatus(false);
        }
    };

    const update_Arrest_Charge = () => {
        const { ChargeCodeID, NIBRSID, LawTitleId, AttemptComplete } = valueCharge;
        if (ArrestID) {
            const val = { IncidentID: DecEIncID, ArrestID: ArrestID, ChargeID: DecChargeId, ModifiedByUserFK: loginPinID, AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID, NIBRSID: NIBRSID, LawTitleId: LawTitleId, AttemptComplete: AttemptComplete, };
            AddDeleteUpadate('ArrestCharge/Update_ArrestCharge', val).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setstatesChangeCharge(false); setChangesStatus(false); get_Data_Arrest_Charge(ArrestID);
                setErrorsCharge({ ...errorsCharge, ['ChargeCodeIDError']: '', });
                LawTitleIdDrpDwnVal(loginAgencyID, null); get_NIBRS_Drp_Data(loginAgencyID, null); get_ChargeCode_Drp_Data(loginAgencyID, null, null);
            });
        } else {
            const updatedCharges = ChargeLocalArr.map(charge => {
                if (charge.ChargeID === DecChargeId) {
                    return {
                        ...charge, ChargeCodeID, NIBRSID, LawTitleId, AttemptComplete: AttemptComplete, NIBRS_Description: NIBRSDrpData?.find(x => x.value === NIBRSID)?.label || '',
                        ChargeCode_Description: chargeCodeDrp?.find(x => x.value === ChargeCodeID)?.label || '',
                        LawTitle_Description: lawTitleIdDrp?.find(x => x.value === LawTitleId)?.label || '',
                    };
                }
                return charge;
            });
            setChargeLocalArr(updatedCharges);
            sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedCharges));
            setStatesChangeStatus(false); setChangesStatus(false);
            setErrorsCharge({ ...errorsCharge, ['ChargeCodeIDError']: '', });
            LawTitleIdDrpDwnVal(loginAgencyID, null); get_NIBRS_Drp_Data(loginAgencyID, null); get_ChargeCode_Drp_Data(loginAgencyID, null, null);
        }
    };

    const set_Edit_ValueCharge = (row) => {
        // setDelChargeID(row.ChargeID);
        if (!row.OffenseID) { setChargeID(row.ChargeID); setDecChargeId(row.ChargeID); }
        get_ArrestCharge_Count(row.ChargeID); setErrorsCharge(''); setstatesChangeCharge(false);
        if (row.OffenseID) {
            setEditvalCharge(row);
            setoffenseNameID(row.NameOffenseID);
        }
        else {
            GetSingleDataCharge(row.ChargeID);
        }
        setChangesStatus(false);
        //  get_Arrest_Count(ArrestID);
    }

    const setStatusFalseCharge = () => {
        setErrorsCharge(''); setChargeID(''); Reset();
    }

    const Reset = () => {
        setEditvalCharge([]); setValueCharge({ ...valueCharge, 'CreatedByUserFK': '', 'ChargeCodeID': '', 'NIBRSID': '', 'WarrantID': '', 'LawTitleId': '', 'AttemptComplete': '', });
        setstatesChangeCharge(false); setChangesStatus(false); setErrorsCharge({}); setDelChargeID(''); setDecChargeId(''); setChargeID('')
        // lawTitle
        LawTitleIdDrpDwnVal(loginAgencyID, null);
        // nibrs code
        get_NIBRS_Drp_Data(loginAgencyID, null);
        setoffenseNameID();
        // charge code
        get_ChargeCode_Drp_Data(loginAgencyID, null, null);
    }

    const conditionalRowStylesCharge = [
        {
            when: row => row.ChargeID === DecChargeId,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const columnsCharge = [
        {
            name: ' Offense Code/Name', selector: (row) => row.ChargeCode_Description || row.Offense_Description, sortable: true
        },
        {
            name: 'TIBRS Code', selector: (row) => row.NIBRS_Description || row.FBICode_Desc, sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        !narrativeApprovedStatus && <span onClick={() => {
                            if (row.NameOffenseID) {
                                setoffenseNameID(row.NameOffenseID)
                            }
                            else {
                                setDelChargeID(row.ChargeID); setIsChargeDel(true)
                            }
                        }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </span>
                    }
                </div >
        }
    ]

    // const DeleteCharge = () => {
    //     const val = { 'ChargeID': delChargeID, 'DeletedByUserFK': loginPinID }
    //     AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
    //         if (res) {
    //             const parsedData = JSON.parse(res.data);
    //             const message = parsedData.Table[0].Message;
    //             toastifySuccess(message);
    //             get_Data_Arrest_Charge(DecArrestId);
    //             get_Arrest_Count(ArrestID);
    //             Reset();
    //             get_ArrestCharge_Count(DecChargeId);
    //             setErrors('');
    //             setStatusFalse()
    //         } else { console.log("Somthing Wrong"); }
    //     })
    // }

    const DeleteCharge = () => {
        // if (!delChargeID) {
        //     toastifyError('No charge selected for deletion.');
        //     return;
        // }
        const chargeID = String(delChargeID);
        if (chargeID.startsWith('local-')) {
            const updatedLocalCharges = ChargeLocalArr.filter(charge => charge.ChargeID !== delChargeID);
            setChargeLocalArr(updatedLocalCharges);
            sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedLocalCharges));

            toastifySuccess('Deleted successfully.');
            setDelChargeID(null);
            setIsChargeDel(false);
            // Reset();
            setChangesStatus(false); get_Data_Arrest(DecEIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
            setStatesChangeStatus(false);
        } else {
            const val = { 'ChargeID': delChargeID, 'DeletedByUserFK': loginPinID };
            AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
                if (res) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    get_Data_Arrest_Charge(DecArrestId); get_Data_Arrest(DecEIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                    get_Arrest_Count(ArrestID);
                    setIsChargeDel(false);
                    // Reset();
                    get_ArrestCharge_Count(DecChargeId);
                    setErrors('');
                    // setStatusFalse();
                } else {
                    console.log("Something went wrong");
                }
            });
        }
    };

    //  Attempted/Completed
    const StatusOption = [
        { value: "A", label: "Attempted" },
        { value: "C", label: "Completed" },
    ];

    const nibrsSuccessStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#9fd4ae",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const onChangeAttComp = (e, name) => {
        !addUpdatePermission && setstatesChangeCharge(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setValueCharge({ ...valueCharge, [name]: e.value });
        } else {
            setValueCharge({ ...valueCharge, [name]: null });
        }
    };

    const DeleteOffense = () => {
        const val = {
            'NameOffenseID': offenseNameID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('NameOffense/Delete_NameOffense', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                // get_Name_Count(DecNameID)
                // get_Offense_DropDown(incidentID, DecNameID);

                get_OffenseName_Data(possessionID)
            } else {
                console.log("res");
            }
        }).catch((err) => {
            console.log("🚀 ~Delete AddDeleteUpadate ~ err:", err);
        })
    }

    return (
        <>
            <div className="col-12 child " id="display-not-form">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-11 pt-2 p-0">

                        <div className="row px-2">
                            <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                <label htmlFor="" className='new-label '> Arrest No.</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2  text-field  mt-1">
                                <input type="text" name='ArrestNumber' value={value?.ArrestNumber} className="readonlyColor" onChange={''} id='ArrestNumber' required readOnly />
                            </div>
                            <div className="col-2 col-md-3 col-lg-2 mt-1 pt-2">
                                <label htmlFor="" className='new-label text-nowrap'>Incident No.</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                <input type="text" className='readonlyColor' name='IncidentNumber' value={IncNo ? IncNo : ''}
                                    required readOnly />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2">
                                <label htmlFor="" className='new-label'>
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
                                <DatePicker
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
                                />
                            </div>

                            <div className="col-2 col-md-2 col-lg-1 mt-1">
                                <label className='new-label text-nowrap '> Agency Name </label>
                            </div>
                            <div className="col-4 col-md-5 col-lg-2 ">
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

                            <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                <label htmlFor="" className='new-label'>Arresting Agency</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
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
                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                <label className='new-label  '>Use of Force Applied</label>
                            </div>
                            <div className="col-4 col-md-5 col-lg-2 mt-2 ">
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
                                {isEnabled && (
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

                                )}
                            </div>
                        </div>
                    </div>
                    <div className=" col-4 col-md-4 col-lg-1 mt-4 ">
                        <div className="img-box" >
                            <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                {
                                    multiImage.length > 0 ?
                                        multiImage?.map((item) => (
                                            <div key={item.index} data-toggle="modal" data-target="#ImageModel" onClick={() => { setImageModalStatus(true); }} className='model-img'>
                                                <img src={`data:image/png;base64,${item.Photo}`} style={{ height: '100px' }} />

                                            </div>
                                        ))
                                        :
                                        <div data-toggle="modal" data-target="#ImageModel" onClick={() => { setImageModalStatus(true); }}>
                                            <img src={defualtImage} />
                                        </div>
                                }
                            </Carousel>
                        </div>
                    </div>

                    <div className="col-12 col-md-12 col-lg-11 pt-2 p-0">
                        <div className="row px-2">
                        </div>
                    </div>
                </div>
                {/* <fieldset className='mt-2'> */}
                {/* <legend>Name Information </legend> */}
                <div className="row ">
                    <div className="col-12 col-md-12 col-lg-12 pt-2 p-0 ">
                        <div className="row ">
                            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                <label htmlFor="" className='new-label'>Arrestee
                                    {errors.ArresteeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ArresteeIDError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3">
                                {
                                    MstPage === "MST-Arrest-Dash" ?
                                        <Select
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
                                            name="ArresteeID"
                                            styles={nibrsSubmittedArrestMain === 1 ? LockFildscolour : NameStatus ? 'readonlyColor' : Requiredcolour}
                                            isDisabled={ArrestID || nibrsSubmittedArrestMain === 1 || NameStatus ? true : false}
                                            options={arresteeNameData}
                                            value={arresteeNameData?.filter((obj) => obj.value === value?.ArresteeID)}
                                            isClearable
                                            onChange={(e) => ChangeDropDown(e, 'ArresteeID')}
                                            placeholder="Select..."
                                        />
                                }
                            </div>
                            {!ArrestID && (
                                <div className="col-1" data-toggle="modal" data-target="#MasterModal">
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
                            )}

                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Arrest Type') }}>
                                    Arrest Type{errors.ArrestTypeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ArrestTypeIDError}</p>
                                    ) : null}
                                </span>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 ">
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
                        </div>
                    </div>
                </div>
                {/* </fieldset> */}
                {/* <fieldset> */}
                {/* <legend>Rights Information </legend> */}
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12 pt-2 p-0 ">
                        <div className="row align-items-center ">
                            <div className="col mt-1">
                                <label htmlFor="" className='new-label px-0 text-nowrap'>Rights Given</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 mt-1">
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
                            <div className="col mt-2 ">
                                <label htmlFor="" className='new-label'>Given By</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 mt-1">
                                <Select
                                    name='GivenByID'
                                    styles={customStylesWithOutColor}
                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.GivenByID)}
                                    isClearable
                                    options={agencyOfficerDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'GivenByID')}
                                    placeholder="Select..."
                                    isDisabled={rightGivenCode === 'N' || !rightGivenCode}
                                />
                            </div>
                            <div className="col mt-2 ">
                                <label htmlFor="" className='new-label text-nowrap '>Primary Officer</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 mt-1">
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
                            <div className="col mt-2 ">
                                <label htmlFor="" className='new-label'>Supervisor</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 mt-1">
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

                        </div>
                    </div>
                </div>
                {/* </fieldset> */}
                {/* juvenile */}
                {/* <fieldset> */}
                {/* <legend>Juvenile Disposition</legend> */}
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-11 pt-2 p-0 ">
                        <div className="row">
                            <div className='col-2 col-md-2 col-lg-1'></div>
                            <div className='col-2 col-md-2 col-lg-2 mt-2 '>
                                <div className="form-check ml-4">
                                    <input className="form-check-input " type="checkbox" onChange={HandleChange} name='IsJuvenileArrest' value={value?.IsJuvenileArrest} checked={value?.IsJuvenileArrest} id="flexCheckDefault" disabled
                                    />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">Juvenile Arrest  </label>
                                </div>
                            </div>
                            <div className="col mt-2 p-0 ">
                                <span data-toggle="modal" onClick={() => {
                                    setOpenPage('Arrest Juvenile Disposition')
                                }} data-target="#ListModel" className='new-link'>
                                    Disposition {errors.JuvenileDispoError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.JuvenileDispoError}</p>
                                    ) : null}
                                </span>
                            </div>
                            <div className="col-4 col-md-4 col-lg-4 mt-1">
                                <Select
                                    name='JuvenileDispositionID'
                                    menuPlacement='top'
                                    styles={nibrsSubmittedArrestMain === 1 ? LockFildscolour : value?.IsJuvenileArrest === 'true' || value?.IsJuvenileArrest === true ? Requiredcolour : customStylesWithOutColor}
                                    value={arrestJuvenileDisDrpData?.filter((obj) => obj.value === value?.JuvenileDispositionID)}
                                    isClearable
                                    options={arrestJuvenileDisDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'JuvenileDispositionID')}
                                    placeholder="Select..."
                                    isDisabled={value?.IsJuvenileArrest || nibrsSubmittedArrestMain === 1 ? false : true}
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                <label htmlFor="" className='new-label'>Phone No:{errors.CellPhoneError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CellPhoneError}</p>
                                ) : null}</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                <input type="text" maxLength={10} name='PhoneNo' id='PhoneNo'
                                    // className={`${value.IsJuvenileArrest === false || nibrsSubmittedArrestMain === 1 ? "readonlyColor" : ''}`} 
                                    className={nibrsSubmittedArrestMain === 1 ? "LockFildsColour" : value.IsJuvenileArrest === false ? "readonlyColor"
                                        : ""
                                    }

                                    value={value?.PhoneNo} onChange={handleChange} required disabled={value.IsJuvenileArrest === true ? false : true} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* </fieldset> */}
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
            <>
                <fieldset className='px-0'>
                    <legend>Charge</legend>
                    <div className="col-12">
                        <div className="row">
                            {/* Law Title */}
                            <div className="col-2 col-md-2 col-lg-1 mt-2 p-0">
                                <span className="new-link">
                                    Law Title
                                </span>
                            </div>
                            <div className="col-10 col-md-4 col-lg-2 mt-2">
                                <Select
                                    name="LawTitleId"
                                    styles={customStylesWithOutColorCharge}
                                    value={lawTitleIdDrp?.filter((obj) => obj.value === valueCharge?.LawTitleId)}
                                    options={lawTitleIdDrp}
                                    isClearable
                                    onChange={(e) => onChangeDrpLawTitle(e, 'LawTitleId')}
                                    placeholder="Select..."
                                />
                            </div>
                            {/* Offense Code/Name */}
                            <div className="col-2 col-md-2 col-lg-1 mt-2 p-0">
                                <label className="new-label">
                                    <Link to="/ListManagement?page=Charge%20Code&call=/Arr-Charge-Home" className="new-link">
                                        Offense Code/Name
                                    </Link>
                                    {errorsCharge.ChargeCodeIDError !== 'true' && (
                                        <span style={{ color: 'red', fontSize: '13px', display: 'block' }}>
                                            {errorsCharge.ChargeCodeIDError}
                                        </span>
                                    )}
                                </label>
                            </div>
                            <div className="col-10 col-md-4 col-lg-4 mt-2">
                                <Select
                                    name="ChargeCodeID"
                                    value={chargeCodeDrp?.filter((obj) => obj.value === valueCharge?.ChargeCodeID)}
                                    styles={Requiredcolour}
                                    isClearable
                                    options={chargeCodeDrp}
                                    onChange={(e) => onChangeDrpLawTitle(e, 'ChargeCodeID')}
                                    placeholder="Select..."
                                />
                            </div>
                            {/* NIBRS Code */}
                            <div className="col-2 col-md-2 col-lg-1 mt-3 p-0">
                                <label className="new-label">
                                    TIBRS Code
                                    {errorsCharge.NIBRSIDError !== 'true' && (
                                        <span style={{ color: 'red', fontSize: '13px', display: 'block' }}>
                                            {errorsCharge.NIBRSIDError}
                                        </span>
                                    )}
                                </label>
                            </div>
                            <div className="col-10 col-md-4 col-lg-3 mt-2">
                                <Select
                                    name="NIBRSID"
                                    styles={Requiredcolour}
                                    value={NIBRSDrpData?.filter((obj) => obj.value === valueCharge?.NIBRSID)}
                                    isClearable
                                    options={NIBRSDrpData}
                                    onChange={(e) => onChangeNIBRSCode(e, 'NIBRSID')}
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-3 " >
                                <label className="new-label text-wrap text-right" >
                                    Attem/Comp
                                    {errorsCharge.AttemptRequiredError !== 'true' && (
                                        <span style={{ color: 'red', fontSize: '13px', display: 'block' }}>
                                            {errorsCharge.AttemptRequiredError}
                                        </span>
                                    )}
                                </label>

                            </div>
                            <div className="col-10 col-md-4 col-lg-2 mt-2">
                                <Select
                                    onChange={(e) => onChangeAttComp(e, "AttemptComplete")}
                                    options={StatusOption}
                                    isClearable
                                    styles={!valueCharge?.AttemptComplete ? nibrscolourStyles : nibrsSuccessStyles}
                                    placeholder="Select..."
                                    value={StatusOption.filter((option) => option.value === valueCharge?.AttemptComplete)}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="row mt-2">
                            <div className="col-12 text-right">
                                <button type="button" className="btn btn-sm btn-success mx-1" onClick={() => setStatusFalseCharge()}>New</button>
                                {
                                    ChargeID ?
                                        effectiveScreenPermission?.[0]?.Changeok ?
                                            <button type="button" onClick={check_Validation_ErrorCharge} disabled={!statesChangeCharge} className="btn btn-sm btn-success mx-1">Update Charge</button>
                                            : null
                                        :
                                        effectiveScreenPermission?.[0]?.AddOK ?
                                            <button type="button" onClick={check_Validation_ErrorCharge} className="btn btn-sm btn-success mx-1">Add Charge</button>
                                            : null
                                }
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="col-12 mt-2">
                        <DataTable
                            dense
                            data={
                                effectiveScreenPermission?.[0]?.DisplayOK ?
                                    ((ArrestID || possessionID) && arrestChargeData.length > 0 ? arrestChargeData : ChargeLocalArr)
                                    : []
                            }
                            columns={columnsCharge}
                            selectableRowsHighlight
                            highlightOnHover
                            pagination
                            onRowClicked={(row) => { set_Edit_ValueCharge(row); }}
                            fixedHeaderScrollHeight='250px'
                            conditionalRowStyles={conditionalRowStylesCharge}
                            fixedHeader
                            persistTableHead={true}
                            customStyles={tableCustomStyles}
                            noDataComponent={
                                effectiveScreenPermission?.[0]?.DisplayOK
                                    ? "There are no data to display"
                                    : "You don’t have permission to view data"
                            }
                        />
                    </div>

                    <ListModal {...{ openPage, setOpenPage }} />
                    <ChangesModal func={check_Validation_Error} />
                </fieldset>
            </>
            <div className="col-12  text-right p-0" style={{ marginTop: '10px' }}>
                {MstPage !== "MST-Arrest-Dash" && (<button type="button" className="btn btn-sm btn-success mr-1" onClick={setStatusFalse}>New </button>)}
                {
                    ArrestID && (ArrestSta === true || ArrestSta === 'true') ?
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
                            <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#myModal" onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#myModal" onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Save</button>
                }
                {
                    MstPage === "MST-Arrest-Dash" &&
                    <button type="button" className="btn btn-sm btn-success mx-1" onClick={onMasterPropClose} data-dismiss="modal">Close</button>
                }
            </div>
            <div className={`modal-backdrop ${confirmInsertArrest ? 'show' : ''}`} style={{ display: confirmInsertArrest ? 'block' : 'none' }}></div>
            <div className="col-12 pt-1">
                {
                    MstPage != "MST-Arrest-Dash" &&
                    <DataTable
                        dense
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? arrestFilterData : [] : arrestFilterData}
                        columns={columns}
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        pagination
                        onRowClicked={(row) => {
                            set_Edit_Value(row);
                        }}
                        fixedHeaderScrollHeight='100px'
                        conditionalRowStyles={conditionalRowStyles}
                        fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        paginationPerPage={'100'}
                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                }
            </div>
            <ListModal {...{ openPage, setOpenPage }} />
            <ConfirmModal {...{ showModal, setShowModal, arresteeChange, value, possessionID, setPossessionID, setValue, setErrors }} />
            <DeletePopUpModal func={offenseNameID ? DeleteOffense : isChargeDel ? DeleteCharge : DeleteArrest} clearID={clearID} />
            <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
            <CurrentArrestMasterReport ArrestNumber={value.ArrestNumber} {...{ printIncReport, setIncMasterReport, IncReportCount, setIncReportCount, showModalReport, setshowModalReport }} />
            <MasterNameModel {...{ type, setArrestID, isDatePickerRequiredColor, value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, possessionID, setPossessionID, possenSinglData, setPossenSinglData, GetSingleDataPassion }} />
            <ImageModel multiImage={multiImage} setStatesChangeStatus={setStatesChangeStatus} pinID={loginPinID} primaryOfficerID={agencyOfficerDrpData} setMultiImage={setMultiImage} uploadImgFiles={uploadImgFiles} setuploadImgFiles={setuploadImgFiles} ChangeDropDown={ChangeDropDown} modalStatus={modalStatus} setModalStatus={setModalStatus} imageId={imageid} setImageId={setImageId} imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} delete_Image_File={delete_Image_File} setImgData={setImgData} imgData={imgData} updateImage={update_Vehicle_MultiImage} agencyID={loginAgencyID} />
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

