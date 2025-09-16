import { useContext, useEffect, useState, useRef } from 'react';
import Select from "react-select";
import SubTab from '../../../../Utility/Tab/SubTab';
import { VictimTabs } from '../../../../Utility/Tab/TabsArray';
import Offense from './VictimTab/Offense/Offense';
import Relationship from './VictimTab/Relationship/Relationship';
import InjuryType from './VictimTab/InjuryType/InjuryType';
import JustifiableHomicide from './VictimTab/JustifiableHomicide/JustifiableHomicide';
import AssaultType from './VictimTab/AssaultType/AssaultType';
import Property from './VictimTab/Property/Property';
import Officer from './VictimTab/Officer/Officer';
import { customStylesWithOutColor, Decrypt_Id_Name, nibrscolourStyles, Requiredcolour } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import Ori from './VictimTab/ORI/Ori';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './VictimTab/Home/Home';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import NameListing from '../../../ShowAllList/NameListing';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';
import { ErrorStyle, ErrorTooltip, ErrorTooltipComp, SexOfVictimError, SocietyPublicError, StatutoryRapeError, victimNibrsErrors } from '../../NameNibrsErrors';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { ORIValidatorVictim } from '../../../Agency/AgencyValidation/validators';


const Victim = (props) => {

    const { ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails = false } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { nameSingleData, setChangesStatus, get_Name_Count, setVictimCount, setNameShowPage, setNameVictimCount } = useContext(AgencyContext);

    const SelectedValue = useRef();
    const [showPage, setShowPage] = useState('home');
    const [victimTypeDrp, setVictimTypeDrp] = useState([]);
    const [bodyArmorDrp, setBodyArmorDrp] = useState([]);
    const [callTypeDrp, setCallTypeDrp] = useState([]);
    const [additionalJustiDrp, setAdditionalJustiDrp] = useState([]);
    const [assignmentTypeDrp, setAssignmentTypeDrp] = useState([]);
    const [editval, setEditval] = useState();
    const [victimStatus, setVictimStatus] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [victimID, setVictimID] = useState();

    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [nameID] = useState();
    const [incidentID] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);


    //NibrsErrors
    const [offenceCodes, setOffenceCodes] = useState([]);
    const [isCrimeAgainsPerson, setIsCrimeAgainsPerson] = useState();
    const [isCrimeAgainstProperty, setIsCrimeAgainstProperty] = useState();
    const [isCrimeAgainstSociety, setIsCrimeAgainstSociety] = useState();
    const [raceSexAgeStatus, setRaceSexAgeStatus] = useState(false);
    const [nibFieldStatusOrErr] = useState()
    const [openPage, setOpenPage] = useState('');
    const page = "Victim";

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');
    let IncNo = query?.get('IncNo');

    const [value, setValue] = useState({
        'VictimTypeID': '', 'BodyArmorID': '', 'CallTypeID': '', 'AdditionalJustificationID': '', 'AssignmentTypeID': '',
        'CreatedByUserFK': '', 'NameID': '', 'ModifiedByUserFK': '', 'VictimID': '', 'VictemTypeCode': '',
        'IsMaster': MstPage === "MST-Name-Dash" ? true : false, 'MasterNameID': '', 'ORI': '',
    });

    const [errors, setErrors] = useState({
        'VictimTypeIDErrors': '', 'CallTypeError': '', 'AssignmentTypeIDError': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("N057", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecNameID && DecMasterNameID) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'NameID': DecNameID, 'VictemTypeCode': null, 'MasterNameID': DecMasterNameID, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false } });
        }
    }, [DecNameID, DecMasterNameID, loginPinID]);

    useEffect(() => {
        GetSingleData(DecNameID);
    }, [DecNameID])

    const GetSingleData = (NameID) => {
        const val = { 'NameID': NameID }
        fetchPostData('Victim/GetData_Victim', val).then((res) => {

            if (res.length != 0) {

                const offenceCodesArr = res[0]?.Offense?.length > 0 ? res[0]?.Offense?.map((item) => { return item?.FBICode }) : []
                setOffenceCodes(offenceCodesArr);

                const IsCrimeAgainsPerson = res[0]?.Offense?.length > 0 ? res[0]?.Offense?.filter((item) => { if (item?.IsCrimeAgains_Person === true) { return true } }) : []

                setIsCrimeAgainsPerson(IsCrimeAgainsPerson?.length > 0)

                const IsCrimeAgainstProperty = res[0]?.Offense?.length > 0 ? res[0]?.Offense?.filter((item) => { if (item?.IsCrimeAgainstProperty === true) { return true } }) : []

                setIsCrimeAgainstProperty(IsCrimeAgainstProperty?.length > 0)

                const CrimeAgainstSociety = res[0]?.Offense?.length > 0 ? res[0]?.Offense?.filter((item) => { if (item?.IsCrimeAgainstSociety === true) { return true } }) : []

                setIsCrimeAgainstSociety(CrimeAgainstSociety?.length > 0)

                setEditval(res);
                setVictimStatus(true);
                setUpdateCount(updateCount + 1);

            } else {
                setEditval([]);
                setVictimStatus(false);

                setIsCrimeAgainsPerson(false);
                setIsCrimeAgainstProperty(false);
                setIsCrimeAgainstSociety(false);
            }
        })
    }

    useEffect(() => {
        if (editval) {
            setValue({
                ...value,
                'VictimTypeID': editval[0]?.VictimTypeID,
                'BodyArmorID': editval[0]?.BodyArmorID,
                'CallTypeID': editval[0]?.CallTypeID,
                'AdditionalJustificationID': editval[0]?.AdditionalJustificationID,
                'AssignmentTypeID': editval[0]?.AssignmentTypeID,
                'VictimID': editval[0]?.VictimID,
                'ModifiedByUserFK': loginPinID,
                'VictemTypeCode': editval[0]?.VictimCode,
                'ORI': editval[0]?.ORI,
            })
            setVictimID(editval[0]?.VictimID)
        } else {
            reset_Value_Data();
        }
    }, [editval, updateCount])

    const check_Validation_Error = (e) => {

        const ORI = ORIValidatorVictim(value?.ORI);
        const VictimTypeIDErr = RequiredFieldIncident(value.VictimTypeID);
        const CallTypeErr = loginAgencyState === 'TX' ? value?.VictemTypeCode == 'L' ? RequiredFieldIncident(value.CallTypeID) : 'true' : 'true'
        const AssignmentTypeIDErr = loginAgencyState === 'TX' ? value?.VictemTypeCode == 'L' ? RequiredFieldIncident(value.AssignmentTypeID) : 'true' : 'true'

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['VictimTypeIDErrors']: VictimTypeIDErr || prevValues['VictimTypeIDErrors'],
                ['ORITypeErrors']: ORI || prevValues['ORITypeErrors'],
                ['CallTypeError']: CallTypeErr || prevValues['CallTypeError'],
                ['AssignmentTypeIDError']: AssignmentTypeIDErr || prevValues['AssignmentTypeIDError'],
            }
        })

    }

    const { VictimTypeIDErrors, CallTypeError, ORITypeErrors, AssignmentTypeIDError } = errors

    useEffect(() => {
        if (VictimTypeIDErrors === 'true' && CallTypeError === 'true' && AssignmentTypeIDError === 'true' && ORITypeErrors === 'true') {
            if (victimStatus) { UpdateVictim(); } else { AddVictim(); }
        }
    }, [VictimTypeIDErrors, CallTypeError, AssignmentTypeIDError, ORITypeErrors])

    useEffect(() => {
        if (loginAgencyID) {
            get_Victim_Type_Data(loginAgencyID); get_Body_Armor_Data(loginAgencyID); get_Call_Type_Data(loginAgencyID); get_Additional_justificaion_Data(loginAgencyID); get_AssignmentType_Data(loginAgencyID);
        }
    }, [loginAgencyID])

    const get_AssignmentType_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('VictimAssignmentType/GetDataDropDown_VictimAssignmentType', val).then((data) => {
            if (data) {
                setAssignmentTypeDrp(Comman_changeArrayFormat(data, 'VictimAssignmentTypeID', 'Description'))
            } else {
                setAssignmentTypeDrp([]);
            }
        })
    }

    const get_Additional_justificaion_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('AdditionalJustification/GetDataDropDown_AdditionalJustification', val).then((data) => {
            if (data) {
                setAdditionalJustiDrp(Comman_changeArrayFormat(data, 'AdditionalJustificationID', 'Description'))
            } else {
                setAdditionalJustiDrp([]);
            }
        })
    }

    const get_Call_Type_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('VictimCallType/GetDataDropDown_VictimCallType', val).then((data) => {
            if (data) {
                setCallTypeDrp(Comman_changeArrayFormat(data, 'VictimCallTypeID', 'Description'))
            } else {
                setCallTypeDrp([]);
            }
        })
    }

    const get_Body_Armor_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('BodyArmor/GetDataDropDown_BodyArmor', val).then((data) => {
            if (data) {
                setBodyArmorDrp(Comman_changeArrayFormat(data, 'BodyArmorID', 'Description'))
            } else {
                setBodyArmorDrp([]);
            }
        })
    }

    const get_Victim_Type_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('VictimType/GetDataDropDown_VictimType', val).then((data) => {
            if (data) {
                setVictimTypeDrp(threeColArray(data, 'VictimTypeID', 'Description', 'VictimCode'))
            } else {
                setVictimTypeDrp([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true); setChangesStatus(true)
        if (e) {
            if (name === 'VictimTypeID') {

                if (e.id == 'L') {
                    setValue({ ...value, [name]: e.value, ['VictemTypeCode']: e.id, });
                    setErrors({ ...errors, 'CallTypeError': '', 'AssignmentTypeIDError': '' });

                    if (!nameSingleData[0]?.Gender_Code || !nameSingleData[0]?.Race_Code || !nameSingleData[0]?.AgeFrom) {
                        setRaceSexAgeStatus(true)
                    } else {
                        setRaceSexAgeStatus(false);
                    }
                } else {
                    setValue({ ...value, [name]: e.value, ['VictemTypeCode']: e.id, ['AssignmentTypeID']: null, ['BodyArmorID']: null });
                    setErrors({ ...errors, 'CallTypeError': '', 'AssignmentTypeIDError': '' });
                }
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === 'VictimTypeID') {
                setValue({ ...value, [name]: '', 'VictemTypeCode': '', 'BodyArmorID': '' });
                setErrors({ ...errors, 'CallTypeError': '', 'AssignmentTypeIDError': '', });
            } else {
                setValue({ ...value, [name]: null, });
            };
        }
    }

    const AddVictim = () => {
        AddDeleteUpadate('Victim/Insert_Victim', value).then((res) => {
            if (res) {
                if (res.VictimID) {
                    setChangesStatus(false);
                    GetSingleData(DecNameID)
                    get_Name_Count(DecNameID, DecMasterNameID);
                    setVictimCount(true);
                }
                toastifySuccess(res.Message);
                setStatesChangeStatus(false);
                setErrors({ ...errors, ['VictimTypeIDErrors']: '', });
            }
        })
    }

    const UpdateVictim = () => {
        AddDeleteUpadate('Victim/Update_Victim', value).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                setChangesStatus(false);
                toastifySuccess(message);
                setVictimCount(true);
                get_Name_Count(DecNameID, DecMasterNameID);
                setStatesChangeStatus(false);
                setErrors({ ...errors, ['VictimTypeIDErrors']: '', });
            };
        })
    }

    const DeletePin = () => {
        const val = { 'VictimID': victimID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('Victim/Delete_Victim', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setValue({ ...value, ['NameID']: '' }); reset_Value_Data();
                setVictimStatus(false); setErrors('')
                get_Name_Count(DecNameID, DecMasterNameID);
                setNameVictimCount('');
                setVictimCount(false);
                setNameShowPage('home');
            } else console.log("Somthing Wrong");
        })
    }

    const reset_Value_Data = () => {
        setValue({
            ...value,
            'VictimTypeID': '',
            'BodyArmorID': '',
            'CallTypeID': '',
            'AdditionalJustificationID': '',
            'AssignmentTypeID': '',
            'ORI': '',
            'ModifiedByUserFK': ''
        });
        setStatesChangeStatus(false);
        setVictimStatus(false)
    }


    // const ErrorColorStyle = {
    //     control: base => ({
    //         ...base,
    //         backgroundColor: "rgb(255 202 194)",
    //         height: 20,
    //         minHeight: 35,
    //         fontSize: 14,
    //         margintop: 2,
    //         boxShadow: 0,
    //     }),
    // };

    const check_StatutoryRape = (offenceCodes, type, nameSingleData) => {
        // StatutoryRape
        const StatutoryRapeCodeArr = ['36B'];
        const StatutoryRapeCodeSet = new Set(StatutoryRapeCodeArr);
        const StatutoryRapeCommanCodes = offenceCodes.filter(value => StatutoryRapeCodeSet.has(value));

        // StatutoryRape / Rape
        const rapeandStatutoryCode = ['36B', '11A'];
        const rapeandStatutoryCodeSet = new Set(rapeandStatutoryCode);
        const RapeCommanCodes = offenceCodes.filter(value => rapeandStatutoryCodeSet.has(value));

        if (StatutoryRapeCommanCodes?.length > 0 && nameSingleData[0]?.AgeFrom > 18) {
            return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(StatutoryRapeError);

        } else if (RapeCommanCodes?.length > 0 && nameSingleData[0]?.Gender_Code != 'M' && nameSingleData[0]?.Gender_Code != 'F') {
            return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(SexOfVictimError);

        } else {
            return false

        }
    }


    const handleChange = (event) => {
        const { name, value } = event.target;
        setStatesChangeStatus(true);
        if (event) {
            let ele = value.split('-').join('').replace(/[^a-zA-Z0-9\s\W]/g, "").toUpperCase();
            setValue((prevState) => ({ ...prevState, [name]: ele, }));
        }
        else {
            setValue((prevState) => ({ ...prevState, [name]: null, }));
        }
    };


    return (
        <>

            <NameListing  {...{ ListData, page }} victimCode={value?.VictemTypeCode} />
            <div className="col-12 child">
                <div className="row">
                    <div className="col-3 col-md-3 col-lg-2 mt-3">
                        <span data-toggle="modal" data-target="#ListModel" className='new-link '>
                            <span onClick={() => { setOpenPage('Victim Type') }}>Victim Type </span>
                            {
                                loginAgencyState === 'TX' ? (
                                    raceSexAgeStatus && value?.VictemTypeCode === 'L' ? (
                                        // Move modal trigger inside tooltip component
                                        <span data-toggle="modal" data-target="#ListModel">
                                            <ErrorTooltipComp ErrorStr={SocietyPublicError} />
                                        </span>
                                    ) : (
                                        check_StatutoryRape(offenceCodes, 'tool', nameSingleData)
                                            ? (
                                                <span data-toggle="modal" data-target="#ListModel">
                                                    {check_StatutoryRape(offenceCodes, 'tool', nameSingleData)}
                                                </span>
                                            )
                                            : (
                                                <span data-toggle="modal" data-target="#ListModel">
                                                    {victimNibrsErrors(
                                                        value?.VictemTypeCode,
                                                        offenceCodes,
                                                        'tool',
                                                        isCrimeAgainsPerson,
                                                        isCrimeAgainstProperty,
                                                        isCrimeAgainstSociety,
                                                        nameSingleData
                                                    )}
                                                </span>
                                            )
                                    )
                                ) : null
                            }
                            {errors.VictimTypeIDErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>
                                    {errors.VictimTypeIDErrors}
                                </p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4  mt-2">
                        <Select
                            name='VictimTypeID'
                            value={victimTypeDrp?.filter((obj) => obj.value === value?.VictimTypeID)}
                            styles={value.VictimTypeID && victimStatus ? 'readOnly' :
                                loginAgencyState === 'TX' ?
                                    raceSexAgeStatus && value?.VictemTypeCode === 'L' ? nibrscolourStyles
                                        :
                                        check_StatutoryRape(offenceCodes, 'Color', nameSingleData) ? check_StatutoryRape(offenceCodes, 'Color', nameSingleData)
                                            :
                                            victimNibrsErrors(value?.VictemTypeCode, offenceCodes, 'Color', isCrimeAgainsPerson, isCrimeAgainstProperty, isCrimeAgainstSociety, nameSingleData)
                                    :
                                    Requiredcolour
                            }
                            isClearable

                            options={victimTypeDrp}
                            onChange={(e) => { ChangeDropDown(e, 'VictimTypeID'); }}
                            placeholder="Select.."
                            ref={SelectedValue}
                            isDisabled={value.VictimTypeID && victimStatus ? 'true' : false}
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-3">

                        <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Body Armor') }}>
                            Body Armor
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4  mt-2" >
                        <Select
                            name='BodyArmorID'
                            value={bodyArmorDrp?.filter((obj) => obj.value === value?.BodyArmorID)}

                            isClearable
                            options={bodyArmorDrp}
                            onChange={(e) => { ChangeDropDown(e, 'BodyArmorID'); }}
                            placeholder="Select.."
                            styles={(value?.VictemTypeCode !== 'L') ? customStylesWithOutColor : ''}
                            isDisabled={value?.VictemTypeCode === 'L' ? false : true}
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-3">
                        <span data-toggle="modal" data-target="#ListModel" className='new-link ' >
                            <span onClick={() => { setOpenPage('Victim Call Type') }}>  Call Type</span>

                            {nibFieldStatusOrErr?.CallType && <ErrorTooltipComp ErrorStr={nibFieldStatusOrErr?.CallTypeError} />}

                            {errors.CallTypeError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CallTypeError}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4  mt-2" >
                        <Select
                            name='CallTypeID'
                            value={callTypeDrp?.filter((obj) => obj.value === value?.CallTypeID)}
                            styles={
                                loginAgencyState === 'TX'
                                    ?
                                    value?.VictemTypeCode === 'L' ? Requiredcolour : customStylesWithOutColor
                                    :
                                    customStylesWithOutColor
                            }
                            isDisabled={
                                loginAgencyState === 'TX' ?
                                    value?.VictemTypeCode === 'L' ? false : true
                                    :
                                    false
                            }
                            isClearable
                            options={callTypeDrp}
                            onChange={(e) => { ChangeDropDown(e, 'CallTypeID'); }}
                            placeholder="Select.."
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-3">

                        <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Additional Justification') }}>
                            Additional Justification
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4  mt-2" >
                        <Select
                            name='AdditionalJustificationID'
                            value={additionalJustiDrp?.filter((obj) => obj.value === value?.AdditionalJustificationID)}
                            styles={customStylesWithOutColor}
                            isClearable
                            options={additionalJustiDrp}
                            onChange={(e) => { ChangeDropDown(e, 'AdditionalJustificationID'); }}
                            placeholder="Select.."
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-3">
                        <span data-toggle="modal" data-target="#ListModel" className='new-link '>
                            <span onClick={() => { setOpenPage('Victim Officer Assignment Type') }}>Assignment Type </span>

                            {nibFieldStatusOrErr?.AssignmentType && <ErrorTooltipComp ErrorStr={nibFieldStatusOrErr?.AssignmentTypeError} />}

                            {errors.AssignmentTypeIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AssignmentTypeIDError}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4  mt-2" >
                        <Select
                            name='AssignmentTypeID'
                            value={assignmentTypeDrp?.filter((obj) => obj.value === value?.AssignmentTypeID)}
                            styles={
                                loginAgencyState === 'TX' ?
                                    value?.VictemTypeCode === 'L' ? Requiredcolour : customStylesWithOutColor
                                    :
                                    customStylesWithOutColor
                            }
                            isDisabled={
                                loginAgencyState === 'TX' ?
                                    value?.VictemTypeCode === 'L' ? false : true
                                    :
                                    false
                            }
                            isClearable
                            options={assignmentTypeDrp}
                            onChange={(e) => { ChangeDropDown(e, 'AssignmentTypeID'); }}
                            placeholder="Select.."
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-3">
                        <div className="d-flex align-items-center justify-content-end " style={{ gap: "8px" }}> {/* Flex wrapper */}
                            <label htmlFor="" className="new-label mb-0">
                                ORI
                            </label>
                            {
                                value?.VictemTypeCode === 'L' ? (
                                    <span
                                        className="hovertext text-right"
                                        data-hover="ORI : Enter a 9 digit code starting with first two capital characters and ending with 00"
                                    >
                                        <i className="fa fa-exclamation-circle" style={{ color: 'blue' }}></i>
                                    </span>
                                ) : null
                            }

                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-4  mt-2  my-0 ">
                        <div style={{ display: "block" }}>
                            <input
                                type="text"
                                className={`form-control ${value?.VictemTypeCode === 'L' ? '' : 'readonlyColor'}`}
                                name="ORI"
                                value={value?.ORI}
                                disabled={value?.VictemTypeCode === 'L' ? false : true}

                                maxLength={9}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div>
                            {errors.ORITypeErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '10px', padding: '0px', textAlign: "left", display: "block" }}>{errors.ORITypeErrors}</p>
                            ) : null}
                        </div>
                    </div>
                    {!isViewEventDetails &&
                        <div className="col-6 col-md-6 col-lg-12 text-right  mt-3 pt-2">
                            {
                                victimStatus ?
                                    effectiveScreenPermission ?
                                        effectiveScreenPermission[0]?.Changeok ?
                                            <>

                                                <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                {
                                                    effectiveScreenPermission ?
                                                        effectiveScreenPermission[0]?.DeleteOK ?
                                                            <button type="button" className="btn btn-sm btn-success  mr-1" data-toggle="modal" data-target="#DeleteModal" >Delete</button>
                                                            : <></>
                                                        : <button type="button" className="btn btn-sm btn-success  mr-1" data-toggle="modal" data-target="#DeleteModal" >Delete</button>
                                                }
                                            </>
                                            :
                                            <>
                                            </>
                                        :
                                        <>


                                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                            {
                                                effectiveScreenPermission ?
                                                    effectiveScreenPermission[0]?.DeleteOK ?
                                                        <button type="button" className="btn btn-sm btn-success  mr-1" data-toggle="modal" data-target="#DeleteModal" >Delete</button>
                                                        : <></>
                                                    : <button type="button" className="btn btn-sm btn-success  mr-1" data-toggle="modal" data-target="#DeleteModal" >Delete</button>
                                            }
                                        </>
                                    :
                                    effectiveScreenPermission ?
                                        effectiveScreenPermission[0]?.AddOK ?
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                            :
                                            <>
                                            </>
                                        :
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                            }
                        </div>
                    }
                </div>
            </div>
            <div className={`col-12 col-md-12`}>
                <div className="row px-0">
                    <div className="col-12 mt-3">
                        <SubTab tabs={VictimTabs} showPage={showPage} setShowPage={setShowPage} status={victimStatus} />
                    </div>
                </div>
            </div>
            {
                showPage === 'home' && victimStatus ?
                    <Home {...{ victimID, DecNameID, loginPinID, DecIncID, loginAgencyID, offenceCodes, nibFieldStatusOrErr, isCrimeAgainsPerson }} victimCode={value?.VictemTypeCode} />
                    :
                    showPage === 'offense' && victimStatus ?
                        <Offense {...{ victimID, DecNameID, loginPinID, DecIncID, loginAgencyID }} />
                        :
                        showPage === 'relationship' ?
                            <Relationship {...{ victimID, DecNameID, loginPinID, DecIncID, loginAgencyID, nameSingleData, isCrimeAgainsPerson }} />
                            :
                            showPage === 'InjuryType' && victimStatus ?
                                <InjuryType {...{ victimID, nameID, loginPinID, incidentID, loginAgencyID, }} />
                                :
                                showPage === 'JustifiableHomicide' && victimStatus ?
                                    <JustifiableHomicide {...{ victimID, nameID, loginPinID, incidentID, loginAgencyID, }} />
                                    :
                                    showPage === 'AssaultType' && victimStatus ?
                                        <AssaultType {...{ victimID, nameID, loginPinID, incidentID, loginAgencyID, }} />
                                        :
                                        showPage === 'Officer' && victimStatus ?
                                            <Officer {...{ victimID, nameID, loginPinID, incidentID, loginAgencyID, }} />
                                            :
                                            showPage === 'Property' && victimStatus ?
                                                <Property {...{ victimID, nameID, loginPinID, incidentID, loginAgencyID, }} />
                                                :
                                                showPage === 'ORI' && victimStatus ?
                                                    <Ori {...{ victimID, nameID, loginPinID, incidentID, loginAgencyID, }} />
                                                    :
                                                    <></>
            }
            <ListModal {...{ openPage, setOpenPage }} />

            <DeletePopUpModal func={DeletePin} />
            <ChangesModal func={check_Validation_Error} />
        </>
    )
}

export default Victim