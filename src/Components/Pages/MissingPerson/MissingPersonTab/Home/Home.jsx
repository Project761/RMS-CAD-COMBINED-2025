import React, { useContext, useState, useEffect, useMemo } from 'react'
import { Decrypt_Id_Name, Requiredcolour, base64ToString, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../../../Common/Utility'
import Select from "react-select";
import DatePicker from "react-datepicker";
import DataTable from 'react-data-table-component';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useLocation, useNavigate } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { get_AgencyOfficer_Data, get_ArresteeNameMissingPerData, get_Message_Key_Drp_Data, get_Missing_Person_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import { GetData_MissingPerson } from '../../../../../redux/actions/MissingPersonAction';
import ChangesModal from '../../../../Common/ChangesModal';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { PhoneFieldNotReq } from '../../../Agency/AgencyValidation/validators';

const Home = ({ DecMissPerID, DecIncID, get_List }) => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecEIncID = 0
    let DecMissVehID = 0
    let DecMissPerId = 0
    let DecNameId = 0;

    const query = useQuery();
    var IncID = query?.get("IncId");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    let MstPage = query?.get('page');
    var MissVehID = query?.get("MissVehID");
    var NameID = query?.get("NameID");

    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }


    if (!MissPerId) { DecMissPerId = 0; }
    else { DecMissPerId = parseInt(base64ToString(MissPerId)); }

    if (!NameID) { DecNameId = 0; }
    else { DecNameId = parseInt(base64ToString(NameID)); }

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const messageKeyDrpData = useSelector((state) => state.DropDown.messageKeyDrpData);
    const missingPersonDrpData = useSelector((state) => state.DropDown.missingPersonDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const arresteeNameMissingData = useSelector((state) => state.DropDown.arresteeNameMissingData);
    const arresteeNameData = useSelector((state) => state.DropDown.arresteeNameData);
    const missingPerData = useSelector((state) => state.MissingPerson.MissingPersonAllData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { setChangesStatus, get_Incident_Count, get_MissingPerson_Count, setActiveArrest, activeArrest, GetDataTimeZone, datezone, changesStatusCount } = useContext(AgencyContext);
    const [reportedDtTm, setReportedDtTm] = useState()
    const [emancipationDt, setEmancipationDt] = useState()
    const [MissingPersonID, setMissingPersonID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [status, setStatus] = useState(false)
    const [Editval, setEditval] = useState();
    const [type, setType] = useState("MissingMod");
    const [possessionID, setPossessionID] = useState();
    const [complainNameID, setcomplainNameID] = useState();
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [complainantfilterID, setcomplainantfilterID] = useState([]);

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'IncidentID': '', 'MissingPersonNumber': "", 'ReportingOfficerID': "", 'ReportedDttm': "", 'PersonID': "", 'IncidentNumber': IncNo, 'MessageKeyID': "", 'PossibleDestination': "", 'Occupation': "", 'PhysicalCondition': "", 'EmancipationDt': "", 'CompaintID': "", 'Relationwithmp': "", 'AgencyID': "", 'CreatedByUserFK': "", 'MissingPersonNameID': '', 'CloseFriends': "", 'PlaceMissingPerson': "", 'InvestigationOfficer': "", 'InvestigationOfficerTelephoneNumber': ""
    });

    const [errors, setErrors] = useState({
        'ReportingOfficerIDError': '', 'ReportedDttmError': '', 'PersonIDError': '', 'IncidentIDError': '', 'MissingPersonNameIDError': '', 'InvestigationOfficerTelephoneNumberError': ''
    })
    console.log("errors", errors)
    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("M121", localStoreData?.AgencyID, localStoreData?.PINID)); get_MissingPerson_Count(DecMissPerID, localStoreData?.PINID);
            dispatch(GetData_MissingPerson(DecEIncID))
        }

    }, [localStoreData, nameModalStatus]);

    useMemo(() => {
        if (value?.MissingPersonNameID) {
            get_List(value?.MissingPersonNameID, value?.MissingPersonNameID);
        }
    }, [value?.MissingPersonNameID]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        }
        else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);


    useEffect(() => {
        if (!incReportedDate) {
            dispatch(get_Inc_ReportedDate(DecEIncID));
        }
    }, [incReportedDate, DecEIncID])


    useEffect(() => {
        if (DecMissPerID) {
            setMissingPersonID(DecMissPerID);
            get_MissingPerson_Count(DecMissPerID, localStoreData?.PINID);

        } else {
            reset(); setMissingPersonID('');
        }
    }, [DecMissPerID]);

    useEffect(() => {
        if (DecMissPerID) {
            if (DecMissPerID) {
                setMissingPersonID(DecMissPerID);
            } else { reset(); setMissingPersonID(''); }
        }
    }, [DecMissPerID]);

    useEffect(() => {
        if (DecMissPerID) {
            GetSingleData(DecMissPerID);

        }
        else { get_MissingPerson_Count(''); }
    }, [DecMissPerID]);

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value, 'IncidentID': DecEIncID, 'MissingPersonID': DecMissPerID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'ReportedDttm': incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date())
            });
            dispatch(GetData_MissingPerson(DecEIncID))
            if (messageKeyDrpData?.length === 0) { dispatch(get_Message_Key_Drp_Data(loginAgencyID)) }
            if (missingPersonDrpData?.length === 0) { dispatch(get_Missing_Person_Drp_Data(loginAgencyID)) }

            dispatch(get_ArresteeNameMissingPerData('', '', DecEIncID))
            dispatch(get_AgencyOfficer_Data(loginAgencyID, DecEIncID))
        }
    }, [loginAgencyID, incReportedDate]);

    useEffect(() => {
        if (possessionID && type === "MissingMod") {
            setValue({ ...value, ['MissingPersonNameID']: parseInt(possessionID), })
            // GetSingleDataPassion(possessionID);


        }

        if (complainNameID && type === "ComplainantName") {
            setValue({ ...value, ['CompaintID']: parseInt(complainNameID) })
            // GetSingleDataPassion(complainNameID);
        }
    }, [possessionID, complainNameID]);

    useEffect(() => {
        if (DecNameId) {
            setValue({ ...value, ['MissingPersonNameID']: parseInt(DecNameId) })
            setPossessionID(DecIncID);
        }

    }, [DecNameId, arresteeNameMissingData]);


    // function to get single person data
    const GetSingleData = (MissingPersonID) => {
        const val = { 'MissingPersonID': MissingPersonID }
        fetchPostData('MissingPerson/GetSingleData_MissingPerson', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                    setStatus(true)

                }
            })
    }

    useEffect(() => {
        if (Editval?.length > 0) {
            setValue({
                ...value,
                'MissingPersonNumber': Editval[0]?.MissingPersonNumber, 'ReportingOfficerID': Editval[0]?.ReportingOfficerID, 'ReportedDttm': Editval[0]?.MissingPerson_ReportedDttm, 'PersonID': Editval[0]?.PersonID, 'IncidentNumber': Editval[0]?.IncidentNumber, 'MessageKeyID': Editval[0]?.MessageKeyID,
                'PossibleDestination': Editval[0]?.PossibleDestination ? Editval[0]?.PossibleDestination : '', 'Occupation': Editval[0]?.Occupation ? Editval[0]?.Occupation : '', 'PhysicalCondition': Editval[0]?.PhysicalCondition ? Editval[0]?.PhysicalCondition : '', 'EmancipationDt': Editval[0]?.EmancipationDt, 'CompaintID': Editval[0]?.CompaintID, 'Relationwithmp': Editval[0]?.Relationwithmp ? Editval[0]?.Relationwithmp : '', 'MissingPersonNameID': Editval[0]?.MissingPersonNameID,
                'CloseFriends': Editval[0]?.CloseFriends ? Editval[0]?.CloseFriends : '',
                'PlaceMissingPerson': Editval[0]?.PlaceMissingPerson ? Editval[0]?.PlaceMissingPerson : '',
                'InvestigationOfficer': Editval[0]?.InvestigationOfficer ? Editval[0]?.InvestigationOfficer : '',
                'InvestigationOfficerTelephoneNumber': Editval[0]?.InvestigationOfficerTelephoneNumber ? Editval[0]?.InvestigationOfficerTelephoneNumber : ''
            });

            setPossessionID(Editval[0]?.MissingPersonNameID);

            setcomplainNameID(Editval[0]?.CompaintID);


            setReportedDtTm(Editval[0]?.ReportedDttm ? new Date(Editval[0]?.MissingPerson_ReportedDttm) : '');
            setEmancipationDt(Editval[0]?.EmancipationDt ? new Date(Editval[0]?.EmancipationDt) : '');

        } else {
            setValue({
                ...value, 'MissingPersonNumber': "", 'ReportingOfficerID': "", 'ReportedDttm': incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()), 'PersonID': "", 'IncidentNumber': IncNo, 'MessageKeyID': "", 'PossibleDestination': "", 'Occupation': "", 'PhysicalCondition': "", 'EmancipationDt': "", 'CompaintID': "", 'Relationwithmp': "", 'CreatedByUserFK': "", 'MissingPersonNameID': '', 'CloseFriends': "", 'PlaceMissingPerson': "", 'InvestigationOfficer': "", 'InvestigationOfficerTelephoneNumber': ""
            });
        }
    }, [Editval, changesStatusCount])

    const reset = () => {
        setValue({
            ...value, 'MissingPersonNumber': "", 'ReportingOfficerID': "", 'ReportedDttm': incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()), 'PersonID': "", 'IncidentNumber': IncNo, 'MessageKeyID': "", 'PossibleDestination': "", 'Occupation': "", 'PhysicalCondition': "", 'EmancipationDt': "", 'CompaintID': "", 'Relationwithmp': "", 'MissingPersonNameID': '', 'CloseFriends': "", 'PlaceMissingPerson': "", 'InvestigationOfficer': "", 'InvestigationOfficerTelephoneNumber': ""
        });
        setStatesChangeStatus(false);
        setErrors({ ...errors, 'ReportingOfficerIDError': '', 'ReportedDttmError': '', 'PersonIDError': '', 'IncidentIDError': '', 'MissingPersonNameIDError': '', 'InvestigationOfficerTelephoneNumberError': '' });
        setReportedDtTm(''); setPossessionID(''); setPossenSinglData([]); setEmancipationDt(''); setMissingPersonID(''); setcomplainNameID('');
        setType('');
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.ReportingOfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['ReportingOfficerIDError']: RequiredFieldIncident(value.ReportingOfficerID) } })
        }
        if (RequiredFieldIncident(value.ReportedDttm)) {
            setErrors(prevValues => { return { ...prevValues, ['ReportedDttmError']: RequiredFieldIncident(value.ReportedDttm) } })
        }
        if (RequiredFieldIncident(value.PersonID)) {
            setErrors(prevValues => { return { ...prevValues, ['PersonIDError']: RequiredFieldIncident(value.PersonID) } })
        }

        if (RequiredFieldIncident(value.MissingPersonNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['MissingPersonNameIDError']: RequiredFieldIncident(value.MissingPersonNameID) } })
        }

        // Phone Validation for Investigating Officer Telephone Number (Business type validation)
        if (value.InvestigationOfficerTelephoneNumber) {
            const InvestigationOfficerTelephoneNumberErr = PhoneFieldNotReq(value.InvestigationOfficerTelephoneNumber);
            console.log("InvestigationOfficerTelephoneNumberErr", InvestigationOfficerTelephoneNumberErr)
            if (InvestigationOfficerTelephoneNumberErr) {
                setErrors(prevValues => { return { ...prevValues, ['InvestigationOfficerTelephoneNumberError']: InvestigationOfficerTelephoneNumberErr } })
            }
        }
    }

    // Check All Field Format is True Then Submit 
    const { ReportingOfficerIDError, ReportedDttmError, PersonIDError, MissingPersonNameIDError, InvestigationOfficerTelephoneNumberError } = errors

    useEffect(() => {
        const phoneValidationPass = value.InvestigationOfficerTelephoneNumber ? InvestigationOfficerTelephoneNumberError === 'true' : true;
        if (ReportingOfficerIDError === 'true' && ReportedDttmError === 'true' && PersonIDError === 'true' && MissingPersonNameIDError === 'true' && phoneValidationPass) {
            if (MissingPersonID && (MissPerSta === true || MissPerSta || 'true')) { update_MissingPerson() }
            else {
                insert_MissingPerson_Data();
            }
        }
    }, [ReportingOfficerIDError, ReportedDttmError, PersonIDError, MissingPersonNameIDError, InvestigationOfficerTelephoneNumberError])


    const insert_MissingPerson_Data = () => {
        const {
            IncidentID, MissingPersonNumber, ReportingOfficerID, ReportedDttm, PersonID, IncidentNumber, MessageKeyID, PossibleDestination, Occupation, PhysicalCondition, EmancipationDt,
            CompaintID, Relationwithmp, AgencyID, CreatedByUserFK, MissingPersonNameID, MissingPersonID, CloseFriends, PlaceMissingPerson, InvestigationOfficer, InvestigationOfficerTelephoneNumber
        } = value


        const val = {
            "IncidentID": IncidentID, "MissingPersonNumber": MissingPersonNumber, "ReportingOfficerID": ReportingOfficerID, "ReportedDttm": ReportedDttm,
            "PersonID": PersonID, "IncidentNumber": IncidentNumber, "MessageKeyID": MessageKeyID, "PossibleDestination": PossibleDestination, "Occupation": Occupation, "PhysicalCondition": PhysicalCondition,
            "EmancipationDt": EmancipationDt, "CompaintID": CompaintID, "Relationwithmp": Relationwithmp, 'CloseFriends': CloseFriends, 'PlaceMissingPerson': PlaceMissingPerson, 'InvestigationOfficer': InvestigationOfficer, 'InvestigationOfficerTelephoneNumber': InvestigationOfficerTelephoneNumber, "AgencyID": AgencyID,
            "CreatedByUserFK": CreatedByUserFK, "MissingPersonNameID": MissingPersonNameID, "MissingPersonID": MissingPersonID,

        }
        const existingPerson = missingPerData.find(item => item.MissingPersonNameID === MissingPersonNameID);
        if (existingPerson) {
            toastifyError('Name Already Exist Please select other Missing Person')
            setErrors({ ...errors, 'ReportingOfficerIDError': '', 'ReportedDttmError': '', 'PersonIDError': '', 'IncidentIDError': '', 'MissingPersonNameIDError': '' });
        }
        else {
            AddDeleteUpadate('MissingPerson/Insert_MissingPerson', val).then((res) => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    dispatch(GetData_MissingPerson(DecEIncID))
                    if (res?.MissingpersonID) {
                        navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${stringToBase64(res?.MissingpersonID)}&MissPerSta=${true}&MissVehID=${0}`)
                        setMissingPersonID(res.MissingpersonID);
                    }
                    setChangesStatus(false); setStatesChangeStatus(false); get_MissingPerson_Count(MissingPersonID, loginPinID)
                    setErrors({ ...errors, ['PersonIDError']: '' }); get_Incident_Count(DecEIncID);
                    get_List(MissingPersonNameID, MissingPersonNameID);

                }
            })
        }

    }

    const update_MissingPerson = () => {
        const { MissingPersonNumber, ReportingOfficerID, ReportedDttm, PersonID, IncidentNumber, MessageKeyID, PossibleDestination, Occupation, PhysicalCondition, EmancipationDt, CompaintID, Relationwithmp, CloseFriends, PlaceMissingPerson, InvestigationOfficer, InvestigationOfficerTelephoneNumber, MissingPersonNameID } = value;
        const val = { 'MissingPersonNumber': MissingPersonNumber, 'ReportingOfficerID': ReportingOfficerID, 'ReportedDttm': ReportedDttm, 'PersonID': PersonID, 'IncidentNumber': IncidentNumber, 'MessageKeyID': MessageKeyID, 'PossibleDestination': PossibleDestination, 'Occupation': Occupation, 'PhysicalCondition': PhysicalCondition, 'EmancipationDt': EmancipationDt, 'CompaintID': CompaintID, 'Relationwithmp': Relationwithmp, 'CloseFriends': CloseFriends, 'PlaceMissingPerson': PlaceMissingPerson, 'InvestigationOfficer': InvestigationOfficer, 'InvestigationOfficerTelephoneNumber': InvestigationOfficerTelephoneNumber, 'ModifiedByUserFK': loginPinID, 'MissingPersonID': MissingPersonID, 'MissingPersonNameID': MissingPersonNameID }

        AddDeleteUpadate('MissingPerson/Update_MissingPerson', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            get_List(MissingPersonNameID, MissingPersonNameID);
            toastifySuccess(message); setChangesStatus(false); setStatesChangeStatus(false); get_MissingPerson_Count(MissingPersonID, loginPinID)
            dispatch(GetData_MissingPerson(DecEIncID)); setErrors({ ...errors, ['PersonIDError']: '' })
        })
    }

    const Delete_MissingPerson = () => {
        const val = { 'MissingPersonID': MissingPersonID, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('MissingPerson/Delete_MissingPerson', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); dispatch(GetData_MissingPerson(DecEIncID))
                get_MissingPerson_Count(MissingPersonID, loginPinID); get_Incident_Count(DecEIncID)
                setStatusFalse()

            } else console.log("Somthing Wrong");
        })
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'ReportingOfficerID') {
                setValue({ ...value, [name]: e.value })
                setErrors({ ...errors, ['ReportingOfficerIDError']: '' });
            } else if (name === 'PersonID') {
                setValue({ ...value, [name]: e.value })
                setErrors({ ...errors, ['PersonIDError']: '' });
            } else if (name === 'MessageKeyID') {
                setValue({ ...value, [name]: e.value })
            }
            else if (name === 'CompaintID') {
                setValue({ ...value, [name]: e.value })
                setcomplainNameID(e.value);
            } else if (name === 'MissingPersonNameID') {
                setValue({ ...value, [name]: e.value })
                setErrors({ ...errors, ['MissingPersonNameIDError']: '' });
                setPossessionID(e.value); setPossenSinglData([])
            }
            else {

                setValue({ ...value, [name]: e.value })
            }
        } else {
            if (name === 'MissingPersonNameID') {
                setValue({ ...value, [name]: null })
                setErrors({ ...errors, ['MissingPersonNameIDError']: '' });
                setPossessionID(''); setPossenSinglData([])
            } else {
                setValue({ ...value, [name]: null })
                setcomplainNameID('');
            }
        }
    }

    const HandleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e.target.name) {
            if (e.target.name === 'InvestigationOfficerTelephoneNumber') {
                let ele = e.target.value.replace(/\D/g, '');
                if (ele.length === 10) {
                    const cleaned = ('' + ele).replace(/\D/g, '');
                    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if (match) {
                        !addUpdatePermission && setChangesStatus(true);
                        setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] });
                        setErrors({ ...errors, ['InvestigationOfficerTelephoneNumberError']: '' });
                    }
                } else {
                    ele = e.target.value.split('-').join('').replace(/\D/g, '');
                    !addUpdatePermission && setChangesStatus(true);
                    setValue({ ...value, [e.target.name]: ele });
                    setErrors({ ...errors, ['InvestigationOfficerTelephoneNumberError']: '' });
                }
            } else {
                setValue({ ...value, [e.target.name]: e.target.value });
            }
        }
        else { setChangesStatus(false) }
    };

    const set_Edit_Value = (row) => {
        if (row?.MissingPersonID) {
            navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${stringToBase64(row?.MissingPersonID)}&MissPerSta=${true}&MissVehID=${stringToBase64(DecMissVehID)}`)
            setMissingPersonID(row?.MissingPersonID);
            get_MissingPerson_Count(row?.MissingPersonID, loginPinID); setStatus(true); setActiveArrest(row?.MissingPersonID); setErrors({}); setStatesChangeStatus(false);

        }
    }

    const setStatusFalse = () => {
        navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${''}&MissPerSta=${false}&MissVehID=${''}`)
        setMissingPersonID(''); setStatus(false); reset(); setChangesStatus(false); get_MissingPerson_Count(''); setActiveArrest(false);
    }




    const conditionalRowStyles = [
        {
            when: row => row.MissingPersonID === DecMissPerID && status,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const columns = [
        {
            name: 'Missing Person Number', selector: (row) => row.MissingPersonNumber ? row.MissingPersonNumber : '', sortable: true
        },
        {
            name: 'Missing Person Name', selector: (row) => row.MissingPersonName ? row.MissingPersonName : '', sortable: true

        },
        {
            name: 'DOB', selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ", sortable: true
        },
        {
            name: 'Height', selector: (row) => row.HeightFrom ? row.HeightFrom : '', sortable: true

        },
        {
            name: 'Reporting Officer', selector: (row) => row.ReportingOfficer ? row.ReportingOfficer : '', sortable: true

        },
        {
            name: 'Relationship with MP', selector: (row) => row.Relationwithmp ? row.Relationwithmp : '', sortable: true

        },
        {
            name: 'Complainant Name', selector: (row) => row.ComplaintName ? row.ComplaintName : '', sortable: true

        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => setMissingPersonID(row.MissingPersonID)} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => setMissingPersonID(row.MissingPersonID)} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {

                setPossenSinglData(res);
            } else { setPossenSinglData([]); }
        })
    }

    const clearID = () => {
        if (Editval?.length > 0) {
            setMissingPersonID(DecMissPerID);
        }
        else { setMissingPersonID(''); }
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

    const setToReset = () => {
    }


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
            (item) => item.NameID !== value.MissingPersonNameID
        );
        if (value.MissingPersonNameID === value.CompaintID) {
            setValue({ ...value, ['CompaintID']: null })
        }
        setcomplainantfilterID(filteredComplainantID)
    }, [value.MissingPersonNameID])



    return (
        <>
            <div className="col-12">
                <div className="row align-items-center mt-1 mb-1" style={{ rowGap: "8px" }}>
                    <div className="col-2 col-md-2 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Missing Person No.</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                        <input type="text" className='form-control' value={value?.MissingPersonNumber ? value?.MissingPersonNumber : 'Auto Generated'} placeholder='Auto Generated' onChange={''} name='MissingPersonNumber' id='MissingPersonNumber' required readOnly />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>
                            Incident No.
                        </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                        <input type="text" className='readonlyColor' value={value?.IncidentNumber} onChange={HandleChange} name='IncidentNumber' required readOnly />
                    </div>

                    <div className="col-2 col-md-2 col-lg-2 ">
                        <label htmlFor="" className='new-label mb-0'>Reported Date/Time {errors.ReportedDttmError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedDttmError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2">
                        <DatePicker
                            id="ReportedDttm"
                            name='ReportedDttm'
                            dateFormat="MM/dd/yyyy HH:mm"
                            timeFormat="HH:mm"
                            is24Hour
                            maxDate={new Date(datezone)}
                            onChange={(date) => {
                                if (date > new Date(datezone)) {
                                    date = new Date(datezone);
                                }

                                !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                setReportedDtTm(date);
                                setValue({ ...value, ['ReportedDttm']: date ? getShowingDateText(date) : null })
                            }}
                            className='requiredColor'
                            selected={value?.ReportedDttm && new Date(value?.ReportedDttm)}
                            timeInputLabel
                            showTimeSelect
                            timeIntervals={1}
                            timeCaption="Time"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"

                            autoComplete='off'
                            placeholderText='Select...'

                            filterTime={(time) => filterTimeForDateZone(time, datezone)}

                            minDate={new Date(incReportedDate)}


                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <span data-toggle="modal" data-target="#ListModel" className='new-link' onClick={() => { setOpenPage('Missing Person') }}>
                            Missing Person {errors.PersonIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PersonIDError}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 ">
                        <Select
                            styles={Requiredcolour}
                            name="PersonID"
                            value={missingPersonDrpData?.filter((obj) => obj.value === value?.PersonID)}
                            options={missingPersonDrpData}
                            onChange={(e) => { ChangeDropDown(e, 'PersonID') }}
                            isClearable
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Reporting Officer{errors.ReportingOfficerIDError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportingOfficerIDError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2">
                        <Select
                            styles={Requiredcolour}
                            name="ReportingOfficerID"
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReportingOfficerID)}
                            options={agencyOfficerDrpData}
                            onChange={(e) => { ChangeDropDown(e, 'ReportingOfficerID') }}
                            isClearable
                            placeholder="Select..."
                        />
                    </div>

                    <div className="col-2 col-md-2 col-lg-2">

                        <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Message Key') }}>
                            Message Key
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2">
                        <Select
                            styles={customStylesWithOutColor}
                            name="MessageKeyID"
                            value={messageKeyDrpData?.filter((obj) => obj.value === value?.MessageKeyID)}
                            options={messageKeyDrpData}
                            onChange={(e) => { ChangeDropDown(e, 'MessageKeyID') }}
                            isClearable
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Possible Destination</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                        <input type="text" className='' name='PossibleDestination' value={value?.PossibleDestination} onChange={HandleChange} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Missing Person Occupation</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                        <input type="text" className='' name='Occupation' value={value?.Occupation} onChange={HandleChange} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Physical Condition</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                        <input type="text" className='' name='PhysicalCondition' value={value?.PhysicalCondition} onChange={HandleChange} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Date Of Emancipation</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2">
                        <DatePicker
                            id="EmancipationDt"
                            name='EmancipationDt'
                            dateFormat="MM/dd/yyyy"
                            onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                    e?.preventDefault();
                                }
                            }}
                            maxDate={new Date(datezone)}
                            onChange={(date) => { setChangesStatus(true); setStatesChangeStatus(true); setEmancipationDt(date); setValue({ ...value, ['EmancipationDt']: date ? getShowingMonthDateYear(date) : null }) }}
                            selected={emancipationDt}
                            className=''
                            showMonthDropdown
                            minDate={new Date(value?.ReportedDttm)}
                            showYearDropdown
                            dropdownMode="select"
                            showDisabledMonthNavigation
                            autoComplete='off'
                            placeholderText='Select...'
                            isClearable={emancipationDt ? true : false}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Complainant Name </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2">
                        <Select
                            styles={customStylesWithOutColor}
                            name="CompaintID"
                            value={arresteeNameData?.filter((obj) => obj.value === value?.CompaintID)}
                            options={value.MissingPersonNameID ? complainantfilterID : arresteeNameData}
                            onChange={(e) => { ChangeDropDown(e, 'CompaintID') }}
                            isClearable
                            placeholder="Select..."
                        />

                    </div>
                    <div className="col-1" data-toggle="modal" data-target="#MasterModal"  >
                        <button
                            onClick={() => {
                                if (value.CompaintID) {
                                    GetSingleDataPassion(value.CompaintID);
                                    console.log('hellocomplain')
                                    setType("ComplainantName");
                                }
                                else {
                                    setcomplainNameID('');
                                    setPossenSinglData('');
                                    setType("ComplainantName");
                                }
                                setNameModalStatus(true);

                            }}
                            className=" btn btn-sm bg-green text-white py-1"
                        >
                            <i className="fa fa-plus" > </i>
                        </button>
                    </div>
                    <div className="col-2 col-md-2 col-lg-1">
                        <label htmlFor="" className='new-label text-nowrap mb-0'>Relationship With M.P</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                        <input type="text" className='' name='Relationwithmp' value={value?.Relationwithmp} onChange={HandleChange} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Close Friends/Relatives </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4 mt-0 text-field">
                        <input type="text" className='' name='CloseFriends' value={value?.CloseFriends} onChange={HandleChange} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Places Missing Person Frequented </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4 mt-0 text-field">
                        <input type="text" className='' name='PlaceMissingPerson' value={value?.PlaceMissingPerson} onChange={HandleChange} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Investigating Officer </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4">
                        <Select
                            styles={customStylesWithOutColor}
                            name="InvestigationOfficer"
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.InvestigationOfficer)}
                            options={agencyOfficerDrpData}
                            onChange={(e) => { ChangeDropDown(e, 'InvestigationOfficer') }}
                            isClearable
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='new-label mb-0'>Investigating Officer's Telephone Number
                            {errors.InvestigationOfficerTelephoneNumberError && errors.InvestigationOfficerTelephoneNumberError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.InvestigationOfficerTelephoneNumberError}</p>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4 mt-0 text-field">
                        <input type="text"
                            maxLength={10} className={errors.InvestigationOfficerTelephoneNumberError && errors.InvestigationOfficerTelephoneNumberError !== 'true' ? '' : ''} name='InvestigationOfficerTelephoneNumber' value={value?.InvestigationOfficerTelephoneNumber} onChange={HandleChange} required />
                    </div>

                </div>
            </div>
            <fieldset className='w-100 px-0'>
                <legend>Missing Name Information</legend>
                <div className="col-12">
                    <div className="row mt-2">
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Missing Person Name {errors.MissingPersonNameIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MissingPersonNameIDError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-6">


                            <Select
                                name="MissingPersonNameID"
                                styles={Requiredcolour}
                                options={arresteeNameMissingData}
                                value={arresteeNameMissingData?.filter((obj) => obj.value === value?.MissingPersonNameID)}
                                isClearable
                                onChange={(e) => ChangeDropDown(e, 'MissingPersonNameID')}
                                placeholder="Select..."
                                isDisabled={MissingPersonID ? true : false}
                            />

                        </div>
                        <div className="col-1 pt-1" data-toggle="modal" data-target="#MasterModal"  >
                            <button
                                onClick={() => {
                                    if (possessionID) { GetSingleDataPassion(possessionID); console.log('hellocomplain') }
                                    else {
                                        setPossessionID('');
                                        setPossenSinglData('');
                                    }
                                    setNameModalStatus(true);
                                    setType("MissingMod");

                                }}
                                className=" btn btn-sm bg-green text-white py-1"
                            >
                                <i className="fa fa-plus" > </i>
                            </button>
                        </div>

                    </div>
                </div>
            </fieldset>


            <div div className="col-12 text-right  p-0">
                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { setStatusFalse(); }} >New</button>
                {
                    DecMissPerID && (MissPerSta === true || MissPerSta || 'true') ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }} >  Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }} >  Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }} >  Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }} >  Save</button>
                }
            </div>

            <div className="col-12 pt-1">
                <DataTable
                    dense
                    columns={columns}

                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? missingPerData : [] : missingPerData}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    onRowClicked={(row) => {
                        set_Edit_Value(row);
                    }}
                    fixedHeaderScrollHeight='180px'
                    conditionalRowStyles={conditionalRowStyles}
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    pagination
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                />
            </div>
            <DeletePopUpModal func={Delete_MissingPerson} clearID={clearID} />
            <ListModal {...{ openPage, setOpenPage }} />
            <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possenSinglData, complainNameID, setcomplainNameID, setPossessionID, possessionID, setPossenSinglData, GetSingleDataPassion }} />
            <ChangesModal func={check_Validation_Error} setToReset={setToReset} />





        </>
    )
}

export default Home







