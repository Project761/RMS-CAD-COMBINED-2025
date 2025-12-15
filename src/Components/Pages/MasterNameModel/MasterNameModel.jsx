import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLabelsString, Decrypt_Id_Name, base64ToString, changeArrayFormat, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles, Requiredcolour, customStylesWithOutColor } from '../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormatReasonCode, Comman_changeArrayFormat_With_Name, changeArray, fourColArray, fourColArrayReasonCode, sixColArray, threeColArray, threeColArrayWithCode } from '../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { AgencyContext } from '../../../Context/Agency/Index';
import { RequiredFieldIncident, Space_Allow_with_Trim } from '../Utility/Personnel/Validation';
import { Email_Field, FaxField, NameValidationCharacter, PhoneField, PhoneFieldNotReq, RequiredField } from '../Agency/AgencyValidation/validators';
import { Comparision, Comparision2, Comparisionweight, Heights, SSN_Field, SSN_FieldModel } from '../PersonnelCom/Validation/PersonnelValidation';
import SelectBox from '../../Common/SelectBox';
import Location from '../../Location/Location';
import NameSearchModal from '../NameSearch/NameSearchModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_ArresteeName_Data, get_ArresteeNameMissingPerData, get_DLStateDrpData, get_Masters_Name_Drp_Data, get_Masters_PossessionOwnerData } from '../../../redux/actions/DropDownsData';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../img/uploadImage.png';
import MasterGeneral from './MasterNameSubTab/MasterGeneral';
import MasterAppearance from './MasterNameSubTab/MasterAppearance';
import MasterAliases from './MasterNameSubTab/MasterAliases';
import MasterSmt from './MasterNameSubTab/MasterSmt';
import MasterIdentificationNumber from './MasterNameSubTab/MasterIdentificationNumber';
import MasterContactDetails from './MasterNameSubTab/MasterContactDetails';
import MasterAddress from './MasterNameSubTab/MasterAddress';
import MasterDocument from './MasterNameSubTab/MasterDocument';
import MasterChangesModal from './MasterChangeModel';
import MasterOffence from './MasterNameSubTab/MasterOffence';


const Option = props => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />
                <p className='ml-2 d-inline'>{props.label}</p>
            </components.Option>
        </div>
    );
};

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const MasterNameModel = ({ setArrestID, setOwnerOfID, ownerOfID, possenSinglData, value, possessionIDVictim, setArrestParentID, ArrestparentID, setValue, complainNameID, setcomplainNameID, nameModalStatus, setNameModalStatus, loginAgencyID, loginPinID, setPossessionIDVictim, type, setPossessionID, possessionID, setPossenSinglData, GetSingleDataPassion }) => {

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const dlStateDrpData = useSelector((state) => state.DropDown.dlStateDrpData);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);

    // const { setArrestID, setOwnerOfID, ownerOfID, possenSinglData, value, setValue, complainNameID, setcomplainNameID, nameModalStatus, setNameModalStatus, loginAgencyID, loginPinID, setPossessionIDVictim, type, setPossessionID, possessionID, setPossenSinglData, GetSingleDataPassion } = props

    const { nameSearchStatus, get_vehicle_Count, setNameSearchStatus, masterCountgenStatus, masterAppeaCountStatus, setMasterCountgenStatus, setmasterAppeaCountStatus, setChangesStatus, get_Arrestee_Drp_Data, get_Name_Count, changesStatus, tabCount, NameTabCount, MasterNameTabCount, setMasterNameTabCount, get_MasterName_Count } = useContext(AgencyContext);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    let openPage = query?.get('page');
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    let MstPage = query?.get('page');

    const crossButtonRef = useRef(null);
    const closeButtonRef = useRef(null);
    const saveButtonRef = useRef(null);
    const saveAndContRef = useRef(null);


    const [editval] = useState([]);
    const [dobDate, setDobDate] = useState();
    const [yearsVal] = useState();
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [ageUnitDrpData, setAgeUnitDrpData] = useState([]);
    const [nameTypeIdDrp, setNameTypeIdDrp] = useState([]);
    const [suffixIdDrp, setSuffixIdDrp] = useState([]);
    const [verifyIdDrp, setVerifyIdDrp] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [phoneTypeIdDrp, setPhoneTypeIdDrp] = useState([]);
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [certifiedByIdDrp, setCertifiedByIdDrp] = useState([]);
    const [nameTypeCode, setNameTypeCode] = useState();
    const [phoneTypeCode, setPhoneTypeCode] = useState('');
    const [isAdult, setIsAdult] = useState(false);
    const [isOffender, setIsOffender] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const [addVerifySingleData, setAddVerifySingleData] = useState([]);
    const [locationStatus, setLocationStatus] = useState(false);
    const [masterNameID] = useState();
    const [nameID] = useState();
    const [juvinile, setJuvinile] = useState();
    const [masterNameSearchModal, setMasterNameSearchModal] = useState(true);
    const [nameSearchValue, setNameSearchValue] = useState([]);
    const [updateStatus, setUpdateStatus] = useState([]);
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [nameShowPage, setNameShowPage] = useState('home');
    const [saveContinueStatus, setsaveContinueStatus] = useState(false);
    const [mstPossessionID, setMstPossessionID] = useState('');
    const [globalname, setglobalname] = useState('');
    const [globalnameto, setglobalnameto] = useState('');
    const [residentIDDrp, setResidentIDDrp] = useState([]);
    const [victimStatus, setVictimStatus] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [isBusinessName, setIsBusinessName] = useState(false);
    const [businessTypeDrp, setBusinessTypeDrp] = useState([]);
    const [victimTypeDrp, setVictimTypeDrp] = useState([]);
    const [victimTypeStatus, setvictimTypeStatus] = useState(false);
    const [missingpersonCount, setmissingpersonCount] = useState('');
    const [propertyOwnerCount, setpropertyOwnerCount] = useState('');


    const [roleStatus, setroleStatus] = useState(false);


    const [isSecondDropdownDisabled, setIsSecondDropdownDisabled] = useState(true);



    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    });
    const [multiSelectedReason, setMultiSelectedReason] = useState({
        optionSelected: null
    })

    const [masterNameValues, setmasterNameValues] = useState({
        'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '',
        'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'EthnicityID': '',
        'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
        'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
        'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
        'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': '', 'NameLocationID': '', 'DLStateID': '', 'IsMaster': false, 'DLNumber': '',
        'Role': null, 'ResidentID': '', 'VictimTypeID': '',
    })

    const [errors, setErrors] = useState({
        'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true',
        'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'DLNumberError': '', 'HeightError': 'true', 'SsnNoError': '', 'AgeFromError': '',
    })



    useEffect(() => {
        if ((IncID && !possessionID) || (IncID && !ownerOfID)) {
            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '',
                'Role': null, 'ResidentID': '',
            });
            setMultiSelected({ optionSelected: [], });
            setMultiSelectedReason({ optionSelected: [], });
            // condition for unwanted api calling
            if (type === "ComplainantName") {
                get_MasterName_Count(complainNameID, 0, MstPage === "MST-Name-Dash" ? true : false);
            }
            else {
                get_MasterName_Count(possessionID, 0, MstPage === "MST-Name-Dash" ? true : false);
            }

        }
        if (IncID) {
            setMainIncidentID(IncID);

            if (type === "ArrestMod") {
                // dispatch(get_ArresteeName_Data('', 0, IncID, true));
                // get_Arrestee_Drp_Data('', 0, IncID, true);
            }
            // else if (type === "Pro-Owner") {

            // }
            else if (type !== "ArrestMod") {
                get_Arrestee_Drp_Data('', 0, IncID);
                dispatch(get_ArresteeName_Data('', 0, IncID));
            }

            // condition for unwanted api calling
            // nameModalStatus && get_vehicle_Count(possessionID)
        }
        if (!value.InProfessionOf) {
            Reset();
        }
        else if (!value.OwnerID && (type === "VehicleOwner")) {
            Reset();
        }
    }, [IncID, nameModalStatus]);






    useEffect(() => {
        if (loginAgencyID && nameModalStatus) {
            if (nameTypeIdDrp.length === 0) { GetNameTypeIdDrp(loginAgencyID); }
            if (suffixIdDrp?.length === 0) { GetSuffixIDDrp(loginAgencyID); }
            if (ageUnitDrpData?.length === 0) { getAgeUnitDrp(loginAgencyID); }
            if (sexIdDrp?.length === 0) { GetSexIDDrp(loginAgencyID); }
            if (raceIdDrp?.length === 0) { GetRaceIdDrp(loginAgencyID); }
            if (ethinicityDrpData?.length === 0) { getEthinicityDrp(loginAgencyID); }
            if (phoneTypeIdDrp?.length === 0) { GetPhoneTypeIDDrp(loginAgencyID, '1', '1'); }
            if (verifyIdDrp?.length === 0) { GetVerifyIDDrp(loginAgencyID); }
            if (certifiedByIdDrp?.length === 0) { getcertifiedByIdDrp(loginAgencyID); }
            if (residentIDDrp?.length === 0) { get_General_Drp_Data(loginAgencyID) }

        }
        if (dlStateDrpData?.length === 0) { dispatch(get_DLStateDrpData()) }
    }, [loginAgencyID, nameModalStatus])

    useEffect(() => {
        if (loginAgencyID && masterNameValues.NameTypeID && (type !== "Victim" || type !== "Offender") && (!possessionID || !complainNameID)) {
            if ((!possessionID && (type !== "ComplainantName"))) {
                GetReasonIdDrp(loginAgencyID, masterNameValues?.NameTypeID, type, JSON?.parse(masterNameValues?.Role));
            }
            else if (!complainNameID && (type === "ComplainantName")) {
                GetReasonIdDrp(loginAgencyID, masterNameValues?.NameTypeID, type, JSON?.parse(masterNameValues?.Role));
            }
            else if (!ownerOfID && (type === "VehicleOwner")) {
                console.log('hello')
                GetReasonIdDrp(loginAgencyID, masterNameValues?.NameTypeID, type, JSON?.parse(masterNameValues?.Role));
            }

        }
    }, [masterNameValues.NameTypeID, type, nameModalStatus])


    useEffect(() => {

        if (possenSinglData?.length > 0 && possenSinglData[0]?.LastName?.trim() !== null) {
            const id = nameTypeIdDrp?.filter((val) => { if (val.value === possenSinglData[0]?.NameTypeID) return val })
            get_Victim_Type_Data(loginAgencyID, id[0]?.id);

            // get_Victim_Type_Data(loginAgencyID, nameTypeCode);

            if (type !== "VehicleName") { dispatch(get_Masters_Name_Drp_Data(possenSinglData[0]?.NameID)); }
            if (type === "VehicleName") { dispatch(get_Masters_PossessionOwnerData(possenSinglData[0]?.NameID)); }
            // console.log(possenSinglData[0]?.Role)
            setmasterNameValues({
                ...masterNameValues,
                'MasterNameID': possenSinglData[0]?.MasterNameID, 'NameID': possenSinglData[0]?.NameID,

                'AgeFrom': possenSinglData[0]?.AgeFrom === null ? null : possenSinglData[0]?.AgeFrom ?? '0',
                'AgeTo': possenSinglData[0]?.AgeTo ? possenSinglData[0]?.AgeTo : '',
                'SexID': possenSinglData[0]?.SexID,
                'NameIDNumber': possenSinglData[0]?.NameIDNumber ? possenSinglData[0]?.NameIDNumber : 'Auto Generated',
                'checkVictem': possenSinglData[0]?.NewVictimID ? possenSinglData[0]?.NewVictimID[0]?.NewVictimID : "",
                'checkOffender': possenSinglData[0]?.NewOffenderID ? possenSinglData[0]?.NewOffenderID[0]?.NewOffenderID : "",
                'VerifyID': possenSinglData[0]?.VerifyID, 'AgeUnitID': possenSinglData[0]?.AgeUnitID,
                'checkArrest': possenSinglData[0]?.ArrestID ? possenSinglData[0]?.ArrestID[0]?.ArrestID : "", 'SuffixID': possenSinglData[0]?.SuffixID,
                'NameTypeID': possenSinglData[0]?.NameTypeID, 'BusinessTypeID': possenSinglData[0]?.BusinessTypeID,
                'RaceID': possenSinglData[0]?.RaceID, 'PhoneTypeID': possenSinglData[0]?.PhoneTypeID, 'EthnicityID': possenSinglData[0]?.EthnicityID,
                'NameReasonCodeID': possenSinglData[0]?.ReasonCode ? changeArray(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID') : '',
                'CertifiedByID': possenSinglData[0]?.CertifiedByID, 'IsJuvenile': possenSinglData[0]?.IsJuvenile,
                'OwnerNameID': possenSinglData[0]?.OwnerNameID, 'DLStateID': possenSinglData[0]?.DLStateID,
                'IsVerify': possenSinglData[0]?.IsVerify, 'IsUnListedPhNo': possenSinglData[0]?.IsUnListedPhNo,
                'OwnerFaxNumber': possenSinglData[0]?.OwnerFaxNumber, 'OwnerPhoneNumber': possenSinglData[0]?.OwnerPhoneNumber,
                'LastName': possenSinglData[0]?.LastName?.trim(), 'FirstName': possenSinglData[0]?.FirstName?.trim(), 'MiddleName': possenSinglData[0]?.MiddleName?.trim(),
                'SSN': possenSinglData[0]?.SSN, 'WeightFrom': possenSinglData[0]?.WeightFrom, 'WeightTo': possenSinglData[0]?.WeightTo,
                'HeightFrom': possenSinglData[0]?.HeightFrom, 'HeightTo': possenSinglData[0]?.HeightTo, 'Address': possenSinglData[0]?.Address,
                'Contact': possenSinglData[0]?.Contact,
                'DateOfBirth': possenSinglData[0]?.DateOfBirth ? getShowingWithOutTime(possenSinglData[0]?.DateOfBirth) : '',
                'CertifiedDtTm': possenSinglData[0]?.CertifiedDtTm ? getShowingDateText(possenSinglData[0]?.CertifiedDtTm) : null,
                'Years': possenSinglData[0]?.Years, 'NameLocationID': possenSinglData[0]?.NameLocationID,
                'ModifiedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'DLNumber': possenSinglData[0]?.DLNumber?.replace(/-/g, ''),
                'VerifyID': possenSinglData[0]?.DLVerifyID,
                'Role': (type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod") ? possenSinglData[0]?.Role : possenSinglData[0]?.Role,
                'ResidentID': possenSinglData[0]?.ResidentID,
                'VictimTypeID': possenSinglData[0]?.VictimTypeID
            });

            GetReasonIdDrpDropdown(loginAgencyID, possenSinglData[0]?.NameTypeID, type, JSON?.parse(possenSinglData[0]?.Role));

            setIsSecondDropdownDisabled(possenSinglData[0]?.Role?.length === 0);
            setmissingpersonCount(possenSinglData[0]?.MissingPersonCount);

            if (possenSinglData[0]?.Role?.includes(1)) {
                setroleStatus(true);
            } else {
                setroleStatus(false);
            }
            setDobDate(possenSinglData[0]?.DateOfBirth ? new Date(possenSinglData[0]?.DateOfBirth) : null);

            if (possenSinglData[0]?.DLCountryID || possenSinglData[0]?.DLStateID || possenSinglData[0]?.DLNumber || possenSinglData[0]?.DLVerifyID) {
                setMasterCountgenStatus(true);
            }
            else {
                setMasterCountgenStatus(false);
            }
            if (possenSinglData[0]?.FaceShapeID || possenSinglData[0]?.ComplexionID || possenSinglData[0]?.HairStyleID || possenSinglData[0]?.FacialHairID1 || possenSinglData[0]?.FacialHairID2 || possenSinglData[0]?.DistinctFeatureID1 || possenSinglData[0]?.DistinctFeatureID2 || possenSinglData[0]?.HairLengthID || possenSinglData[0]?.HairShadeID || possenSinglData[0]?.FacialOddityID1
                || possenSinglData[0]?.FacialOddityID2 || possenSinglData[0]?.FacialOddityID3 || possenSinglData[0]?.BodyBuildID || possenSinglData[0]?.SpeechID || possenSinglData[0]?.TeethID || possenSinglData[0]?.GlassesID || possenSinglData[0]?.Clothing || possenSinglData[0]?.HandednessID
            ) { setmasterAppeaCountStatus(true); }
            else { setmasterAppeaCountStatus(false); }

            setIsAdult(possenSinglData[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Adult Arrest" }));
            setIsOffender(possenSinglData[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Offender" || item.ReasonCode_Description === "Sex Offender" }));
            setVictimStatus(possenSinglData[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Victim" }))
            setvictimTypeStatus(possenSinglData[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Victim" || item.ReasonCode_Description === "Business Is A Victim" || item.ReasonCode_Description === "Domestic Victim" || item.ReasonCode_Description === "Individual Is A Victim" || item.ReasonCode_Description === "Individual Victim" || item.ReasonCode_Description === "Other Is A Victim" || item.ReasonCode_Description === "Restraint Victim" || item.ReasonCode_Description === "Restraint Victim" || item.ReasonCode_Description === "Society Is A Victim" }))

            setNameTypeCode(possenSinglData[0]?.NameTypeCode);
            setMstPossessionID(possenSinglData[0]?.MasterNameID);

            if (type === "MissingMod") {
                console.log('hellomissing')
                let newReasonCodeData = multiSelected?.optionSelected?.concat(fourColArray(
                    possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                ))

                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
                // setMultiSelected({ optionSelected: newReasonCodeData });
            }
            // else if (value.InProfessionOf || value.PossessionOfID) {
            //     // setMultiSelected({
            //     //     optionSelected: possenSinglData[0]?.ReasonCode ? fourColArray(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
            //     //     ) : '',
            //     // });
            // }
            // else if (type === "ArrestMod") {
            //     setMultiSelected({
            //         optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
            //         ) : '',
            //     });
            // }
            else if (type === "MissingNotify") {
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
            }
            else if (type === "LastSeenInfo") {
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
            }
            else if (type === "MissingPersonVehicleOwner") {
                //  GetReasonIdDrp(loginAgencyID, possenSinglData[0]?.NameTypeID, type, JSON?.parse(possenSinglData[0]?.Role));
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
            }
            else if (type === "Victim") {
                console.log(possenSinglData[0]?.Role)
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                const possenSinglDataRole = possenSinglData[0]?.Role || [];
                const filteredRoles = ReasonCodeRoleArr.filter(role => possenSinglDataRole.includes(role.value));

                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? filteredRoles : [],
                });

            }
            else if (type === "ComplainantName") {
                //  GetReasonIdDrp(loginAgencyID, possenSinglData[0]?.NameTypeID, type, JSON?.parse(possenSinglData[0]?.Role));
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
            }
            else if (type === "PropertyRoom") {
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
            }
            else if (type === "NameBusiness") {
                // setMultiSelected({
                //     optionSelected: possenSinglData[0]?.ReasonCode ? fourColArray(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                //     ) : '',
                // });
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
            }
            else if (type === "VehicleOwner") {
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });



                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
            }
            else if (type === "Offender") {
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
                const possenSinglDataRole = possenSinglData[0]?.Role || [];
                const filteredRoles = ReasonCodeRoleArr.filter(role => possenSinglDataRole.includes(role.value));
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? filteredRoles : [],
                });
            }
            // else if (type === "ComplainantName") {
            //      GetReasonIdDrp(loginAgencyID, possenSinglData[0]?.NameTypeID, type, JSON?.parse(possenSinglData[0]?.Role));
            //     setMultiSelectedReason({
            //         optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
            //     });
            // }
            else if (type === "Property") {
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
            }
            else if (type === "ArrestMod") {
                //  GetReasonIdDrp(loginAgencyID, possenSinglData[0]?.NameTypeID, type, JSON?.parse(possenSinglData[0]?.Role));
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
            }
            else if (type === "ArrestParentMod") {
                //  GetReasonIdDrp(loginAgencyID, possenSinglData[0]?.NameTypeID, type, JSON?.parse(possenSinglData[0]?.Role));
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
            }
            else if (type === "Pro-Owner") {
                //  GetReasonIdDrp(loginAgencyID, possenSinglData[0]?.NameTypeID, type, JSON?.parse(possenSinglData[0]?.Role));
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
            }
            else if (type === "VehicleName") {

                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
                setMultiSelected({
                    optionSelected: possenSinglData[0]?.ReasonCode ? fourColArrayReasonCode(possenSinglData[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });
            }
            else {
                setMultiSelectedReason({
                    optionSelected: possenSinglData[0]?.Role ? makeRoleArr(possenSinglData[0]?.Role) : [],
                });
            }
            setPhoneTypeCode(Get_PhoneType_Code(possenSinglData, phoneTypeIdDrp));
            setIsBusinessName(possenSinglData[0]?.NameTypeCode === 'B' ? true : false);
        }
        else if (!ownerOfID && type === "VehicleOwner") {

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': [3], 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            const filteredReasonCodeRoleArr = ReasonCodeRoleArr.filter(item => item.value === 3);

            setMultiSelectedReason({ optionSelected: filteredReasonCodeRoleArr, });
        }
        // else if ((!possessionID && !mstPossessionID) && type !== "ComplainantName") {
        //      console.log('hello')
        //     setmasterNameValues({
        //         ...masterNameValues,
        //         'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
        //         'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
        //         'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
        //         'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
        //         'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
        //         'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
        //         'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

        //         'Role': null, 'ResidentID': '',
        //     });
        //     setPhoneTypeCode('');
        //     const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
        //     if (id.length > 0) {
        //         setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
        //         setNameTypeCode(id[0].NameTypeCode);
        //         setIsBusinessName(false);
        //     }
        //     setMultiSelected({ optionSelected: [], });
        // }
        else if (!complainNameID && type === "ComplainantName") {

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "Property") {

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "MissingNotify") {

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            // setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "LastSeenInfo") {

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            // setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "MissingMod") {
            const filteredReasonCodeRoleArr = ReasonCodeRoleArr.filter(item => item.value === 3);
            const finalValueList = filteredReasonCodeRoleArr.map(item => item?.value);
            setMultiSelectedReason({ optionSelected: filteredReasonCodeRoleArr, });

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': finalValueList, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "MissingPersonVehicleOwner") {
            const filteredReasonCodeRoleArr = ReasonCodeRoleArr.filter(item => item.value === 3);
            const finalValueList = filteredReasonCodeRoleArr.map(item => item?.value);
            setMultiSelectedReason({ optionSelected: filteredReasonCodeRoleArr, });
            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': finalValueList, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "Offender") {
            // const filteredReasonCodeRoleArr = ReasonCodeRoleArr.filter(item => item.value === 3);
            // const finalValueList = filteredReasonCodeRoleArr.map(item => item?.value);
            setMultiSelectedReason({ optionSelected: filteredReasonCodeRoleArr, });
            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "Victim") {
            // const filteredReasonCodeRoleArr = ReasonCodeRoleArr.filter(item => item.value === 3);
            // const finalValueList = filteredReasonCodeRoleArr.map(item => item?.value);
            setMultiSelectedReason({ optionSelected: filteredReasonCodeRoleArr, });
            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "ArrestMod") {

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID && !mstPossessionID) && type === "ArrestParentMod") {

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID || !mstPossessionID) && type === "VehicleName") {

            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': null, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID || !mstPossessionID) && type === "Pro-Owner") {
            const filteredReasonCodeRoleArr = ReasonCodeRoleArr.filter(item => item.value === 3);
            const finalValueList = filteredReasonCodeRoleArr.map(item => item?.value);
            setMultiSelectedReason({ optionSelected: filteredReasonCodeRoleArr, });
            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': finalValueList, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], });
        }
        else if ((!possessionID || !mstPossessionID) && type === "NameBusiness") {
            const filteredReasonCodeRoleArr = ReasonCodeRoleArr.filter(item => item.value === 3);
            const finalValueList = filteredReasonCodeRoleArr.map(item => item?.value);
            setMultiSelectedReason({ optionSelected: filteredReasonCodeRoleArr, });
            setmasterNameValues({
                ...masterNameValues,
                'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
                'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'CertifiedByID': '', 'EthnicityID': '',
                'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
                'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
                'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
                'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
                'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '', 'VictimTypeID': '',

                'Role': finalValueList, 'ResidentID': '',
            });
            setPhoneTypeCode('');
            const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);
                setIsBusinessName(false);
            }
            // const filteredReasonCodeRoleArr = ReasonCodeRoleArr.filter(item => item.value === 3);

            // setMultiSelectedReason({ optionSelected: filteredReasonCodeRoleArr, });
            // setMultiSelected({ optionSelected: [], });
        }


    }, [possenSinglData, nameModalStatus])

    const makeRoleArr = (ids) => {
        const arr = filteredReasonCodeRoleArr?.filter(item => ids.includes(item.value));

        return filteredReasonCodeRoleArr?.filter(item => ids.includes(item.value));
    }

    const Get_PhoneType_Code = (data, dropDownData) => {
        const result = data?.map((sponsor) => (sponsor.PhoneTypeID));
        const result2 = dropDownData?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label, id: sponsor.id }
            }
        })
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]?.id
    };

    const GetBusinessTypeDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('NameBusinessType/GetDataDropDown_NameBusinessType', val).then((data) => {
            if (data) {
                setBusinessTypeDrp(Comman_changeArrayFormat(data, 'NameBusinessTypeID', 'Description'))
            } else {
                setBusinessTypeDrp([]);
            }
        })
    };

    const handleKeyDown = (e) => {
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode);
        const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
        const numpadKeys = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
        const numpadSpecialKeys = [106, 107, 109, 110, 111];
        if (!charStr.match(/^[a-zA-Z]+$/) && !controlKeys.includes(charCode)) {
            e.preventDefault();
        }
        if ((charCode >= 48 && charCode <= 57) || numpadKeys.includes(charCode) || numpadSpecialKeys.includes(charCode)) {
            e.preventDefault();
        }
    };

    const check_Validation_Error = () => {

        const { LastName, FirstName, MiddleName, NameTypeID, NameReasonCodeID, SSN, DLStateID, DLNumber, Contact, HeightFrom, HeightTo, WeightFrom, WeightTo, AgeFrom, AgeTo, SexID, RaceID, DateOfBirth, IsUnknown } = masterNameValues;
        if (HeightFrom) {

            const heightFromStatus = HeightFromOnBlur({ target: { name: 'HeightFrom', value: HeightFrom } });
            if (!heightFromStatus) {
                setmasterNameValues({ ...masterNameValues, 'HeightFrom': '', });
                return
            }

        }
        if (HeightTo) {

            const heightToStatus = HeightOnChange({ target: { name: 'HeightTo', value: HeightTo } });
            if (!heightToStatus) {
                setmasterNameValues({ ...masterNameValues, 'HeightTo': '', });
                return
            }

        }
        if (isAdult || isOffender || victimTypeStatus) {

            const SexIDError = (nameTypeCode === "B") ? 'true' : RequiredFieldIncident(masterNameValues?.SexID);
            const RaceIDError = (nameTypeCode === "B") ? 'true' : RequiredFieldIncident(masterNameValues?.RaceID);
            const DateOfBirthError = isAdult && masterNameValues?.IsUnknown || type === "MissingMod" || type === 'Victim' || (type === "Property" && !isAdult) || nameTypeCode === "B" || (victimTypeStatus && type === "VehicleName") || (victimTypeStatus && type === "ComplainantName") || (victimTypeStatus && type === "ArrestMod") || (isAdult || isOffender || victimTypeStatus) || type === "Offender" ? 'true' : RequiredField(masterNameValues.DateOfBirth);

            const SSNError = 'true';

            const NameTypeIDErr = RequiredFieldIncident(masterNameValues?.NameTypeID);
            const LastNameErr = NameValidationCharacter(LastName, 'LastName', FirstName, MiddleName, LastName);
            const FirstNameErr = NameValidationCharacter(FirstName, 'FirstName', FirstName, MiddleName, LastName);
            const MiddleNameErr = NameValidationCharacter(MiddleName, 'MiddleName', FirstName, MiddleName, LastName);
            const NameReasonCodeIDErr = RequiredFieldIncident(masterNameValues.NameReasonCodeID);
            const DLNumberErr = masterNameValues?.DLStateID ? RequiredFieldIncident(masterNameValues.DLNumber) : 'true';

            const AgeFromErr = (type === "MissingMod" && !masterNameValues.DateOfBirth) || (victimTypeStatus && type === "VehicleName" && !masterNameValues.DateOfBirth) || (victimTypeStatus && type === "ComplainantName" && !masterNameValues.DateOfBirth) || (victimTypeStatus && !masterNameValues.DateOfBirth) || (type === "ArrestMod" && !masterNameValues.DateOfBirth) || isAdult || isOffender || type === "Offender" || type === 'Victim' ? RequiredFieldIncident(masterNameValues.AgeFrom) : 'true'

            const EthnicityErrorr = (nameTypeCode === "B") ? 'true' : victimTypeStatus ? RequiredFieldIncident(masterNameValues.EthnicityID) : 'true'
            const ResidentErr = victimTypeStatus ? RequiredFieldIncident(masterNameValues.ResidentID) : 'true'
            const RoleErr = (type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod" || type === 'Pro-Owner' || type === "Offender" || type === "Victim" || type === 'MissingPersonVehicleOwner') ? 'true' : victimTypeStatus || isOffender || isAdult ? RequiredFieldIncident(masterNameValues.Role) : '';
            // const VictimTypeError = victimTypeStatus ? RequiredFieldIncident(masterNameValues.VictimTypeID) : 'true';
            const VictimTypeError = roleStatus ? RequiredFieldIncident(masterNameValues.VictimTypeID) : 'true';
            // const InjuryErr = victimStatus ? RequiredFieldIncident(masterNameValues.IsInjury) : 'true'
            const OwnerPhoneNumberError = masterNameValues?.OwnerPhoneNumber ? PhoneField(masterNameValues?.OwnerPhoneNumber) : 'true'
            const OwnerFaxNumberError = masterNameValues.OwnerFaxNumber ? FaxField(masterNameValues.OwnerFaxNumber) : 'true'

            setErrors(pre => {
                return {
                    ...pre,
                    ['SexIDError']: SexIDError || pre['SexIDError'],
                    ['RaceIDError']: RaceIDError || pre['RaceIDError'],
                    ['SsnNoError']: SSNError || pre['SsnNoError'],
                    ['DateOfBirthError']: DateOfBirthError || pre['DateOfBirthError'],
                    ['NameTypeIDError']: NameTypeIDErr || pre['NameTypeIDError'],
                    ['LastNameError']: LastNameErr || pre['LastNameError'],
                    ['FirstNameError']: FirstNameErr || pre['FirstNameError'],
                    ['MiddleNameError']: MiddleNameErr || pre['MiddleNameError'],
                    ['NameReasonCodeIDError']: NameReasonCodeIDErr || pre['NameReasonCodeIDError'],
                    ['DLNumberError']: DLNumberErr || pre['DLNumberError'],
                    ['AgeFromError']: AgeFromErr || pre['AgeFromError'],
                    ['EthnicityErrorr']: EthnicityErrorr || pre['EthnicityErrorr'],
                    ['ResidentError']: ResidentErr || pre['ResidentError'],
                    ['RoleError']: RoleErr || pre['RoleError'],
                    ['VictimTypeError']: VictimTypeError || pre['VictimTypeError'],

                    ['OwnerPhoneNumberError']: OwnerPhoneNumberError || pre['OwnerPhoneNumberError'],
                    ['OwnerFaxNumberError']: OwnerFaxNumberError || pre['OwnerFaxNumberError'],


                }
            })

            if (Heights(masterNameValues.HeightFrom, masterNameValues.HeightTo, 'Height') === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'error' } })
            }
            if (Comparisionweight(masterNameValues.WeightFrom, masterNameValues.WeightTo, 'Weight') === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'error' } })
            }

            if (Comparision2(masterNameValues.AgeFrom, masterNameValues.AgeTo, 'Age', masterNameValues.AgeUnitID, nameTypeCode) === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'error' } })
            }

        } else {

            const SexIDError = (nameTypeCode === "B") ? 'true' : (type === "ArrestMod" || type === "Offender" || type === "MissingMod") ? RequiredFieldIncident(masterNameValues?.SexID) : 'true';
            const RaceIDError = (nameTypeCode === "B") ? 'true' : (type === "ArrestMod" || type === "Offender" || type === "MissingMod") ? RequiredFieldIncident(masterNameValues?.RaceID) : 'true';
            const SSNError = 'true';
            const DateOfBirthError = (nameTypeCode === "B") || (type === "ComplainantName") || (type === "VehicleOwner") || type === "ArrestMod" || (type === "Offender") ? 'true' : '' ? RequiredField(masterNameValues.DateOfBirth) : 'true'

            const NameTypeIDErr = RequiredFieldIncident(masterNameValues?.NameTypeID);
            const LastNameErr = NameValidationCharacter(LastName, 'LastName', FirstName, MiddleName, LastName);
            const FirstNameErr = NameValidationCharacter(FirstName, 'FirstName', FirstName, MiddleName, LastName);
            const MiddleNameErr = NameValidationCharacter(MiddleName, 'MiddleName', FirstName, MiddleName, LastName);
            const NameReasonCodeIDErr = RequiredFieldIncident(masterNameValues.NameReasonCodeID);
            const DLNumberErr = masterNameValues?.DLStateID ? RequiredFieldIncident(masterNameValues.DLNumber) : 'true';
            const ContactErr = phoneTypeCode ? phoneTypeCode === 'E' ? Email_Field(masterNameValues.Contact) : PhoneFieldNotReq(masterNameValues.Contact) : 'true';
            const AgeFromErr = (type === "MissingMod" && !masterNameValues.DateOfBirth) || (victimTypeStatus && type === "ComplainantName") || (type === "ArrestMod" && !masterNameValues.DateOfBirth) || type === "Offender" || type === 'Victim' ? RequiredFieldIncident(masterNameValues.AgeFrom) : 'true'
            // const AgeFromErr = (type === "MissingMod" && !masterNameValues.DateOfBirth) || (victimTypeStatus && type === "ComplainantName") || type === "ArrestMod" || type === "NameBusiness" || type === "Property" || type === "VehicleOwner" || type === "VehicleName" ? RequiredFieldIncident(masterNameValues.AgeFrom) : 'true'
            // const AgeFromErr = (nameTypeCode === "B") ? 'true' : (type === "MissingMod" && !masterNameValues.DateOfBirth)  ? RequiredFieldIncident(masterNameValues.AgeFrom) : ''
            const RoleErr = (type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod" || type === 'Pro-Owner' || type === "Victim" || type === "Offender" || type === 'MissingPersonVehicleOwner') ? 'true' : RequiredFieldIncident(masterNameValues.Role);
            const VictimTypeError = roleStatus ? RequiredFieldIncident(masterNameValues.VictimTypeID) : 'true';
            const OwnerPhoneNumberError = masterNameValues.OwnerPhoneNumber ? PhoneField(masterNameValues.OwnerPhoneNumber) : 'true'
            const OwnerFaxNumberError = masterNameValues.OwnerFaxNumber ? FaxField(masterNameValues.OwnerFaxNumber) : 'true'

            setErrors(pre => {
                return {
                    ...pre,
                    ['SexIDError']: SexIDError || pre['SexIDError'],
                    ['RaceIDError']: RaceIDError || pre['RaceIDError'],
                    ['SsnNoError']: SSNError || pre['SsnNoError'],
                    ['DateOfBirthError']: DateOfBirthError || pre['DateOfBirthError'],
                    ['ContactError']: ContactErr || pre['ContactError'],
                    ['NameTypeIDError']: NameTypeIDErr || pre['NameTypeIDError'],
                    ['LastNameError']: LastNameErr || pre['LastNameError'],
                    ['FirstNameError']: FirstNameErr || pre['FirstNameError'],
                    ['MiddleNameError']: MiddleNameErr || pre['MiddleNameError'],
                    ['NameReasonCodeIDError']: NameReasonCodeIDErr || pre['NameReasonCodeIDError'],
                    ['DLNumberError']: DLNumberErr || pre['DLNumberError'],
                    ['AgeFromError']: AgeFromErr || pre['AgeFromError'],
                    ['RoleError']: RoleErr || pre['RoleError'],
                    ['VictimTypeError']: VictimTypeError || pre['VictimTypeError'],
                    ['OwnerPhoneNumberError']: OwnerPhoneNumberError || pre['OwnerPhoneNumberError'],
                    ['OwnerFaxNumberError']: OwnerFaxNumberError || pre['OwnerFaxNumberError'],

                }
            })
            if (phoneTypeCode === 'E') {
                Email_Field(masterNameValues.Contact) && setErrors(prevValues => { return { ...prevValues, ['ContactError']: Email_Field(masterNameValues.Contact) } })
            } else if (phoneTypeCode) {
                PhoneFieldNotReq(masterNameValues.Contact) && setErrors(prevValues => { return { ...prevValues, ['ContactError']: PhoneFieldNotReq(masterNameValues.Contact) } })
            }
            if (Heights(masterNameValues.HeightFrom, masterNameValues.HeightTo, 'Height') === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'error' } })
            }
            if (Comparisionweight(masterNameValues.WeightFrom, masterNameValues.WeightTo, 'Weight') === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'error' } })
            }
            if (Comparision2(masterNameValues.AgeFrom, masterNameValues.AgeTo, 'Age', masterNameValues.AgeUnitID, nameTypeCode) === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'error' } })
            }
        }
    }

    const GetSingleDataPassions = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) { setPossenSinglData(res); }
            else { setPossenSinglData([]); }
        })
    }


    const { NameTypeIDError, AgeFromError, LastNameError, ContactError, FirstNameError, MiddleNameError, RoleError, VictimTypeError, EthnicityErrorr, OwnerPhoneNumberError, OwnerFaxNumberError, ResidentError, NameReasonCodeIDError, SexIDError, RaceIDError, DateOfBirthError, DLNumberError, SsnNoError, HeightError, WeightError, AgeError } = errors

    useEffect(() => {
        if (nameTypeCode === 'B') {
            if (isAdult || isOffender || victimTypeStatus) {
                if (NameReasonCodeIDError === 'true' && ContactError === 'true' && VictimTypeError === 'true' && OwnerPhoneNumberError === 'true' && OwnerFaxNumberError === 'true' && RoleError === 'true' && EthnicityErrorr === 'true' && HeightError === 'true' && LastNameError === 'true' && FirstNameError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && SexIDError === 'true' && RaceIDError === 'true' && WeightError === 'true' && DateOfBirthError === 'true' && DLNumberError === 'true' && SsnNoError === 'true') {
                    if (type === "VehicleOwner") {
                        if (ownerOfID && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                    else if ((type === "ComplainantName")) {
                        if (complainNameID && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                    else if ((type === "Victim")) {
                        if (possessionIDVictim && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                    else if ((type === "ArrestParentMod")) {
                        if (ArrestparentID && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                    else {
                        if (possessionID && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {

                            insertMasterName(); return;
                        }
                    }
                }
            } else if (NameReasonCodeIDError === 'true' && HeightError === 'true' && RoleError === 'true' && OwnerPhoneNumberError === 'true' && OwnerFaxNumberError === 'true' && VictimTypeError === 'true' && ContactError === 'true' && LastNameError === 'true' && FirstNameError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && SexIDError === 'true' && RaceIDError === 'true' && DateOfBirthError === 'true' && WeightError === 'true' && DLNumberError === 'true' && SsnNoError === 'true') {

                if (type === "VehicleOwner") {
                    if (ownerOfID && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }

                else if ((type === "ComplainantName")) {
                    if ((type === "ComplainantName" && complainNameID) && possenSinglData.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }
                else if ((type === "Victim")) {
                    if (possessionIDVictim && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }
                else if ((type === "ArrestParentMod")) {
                    if (ArrestparentID && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }
                else {
                    if (possessionID && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }
            }
        }
        else {
            if (isAdult || isOffender || victimTypeStatus) {
                if (NameReasonCodeIDError === 'true' && ContactError === 'true' && AgeFromError === 'true' && VictimTypeError === 'true' && RoleError === 'true' && ResidentError === 'true' && EthnicityErrorr === 'true' && HeightError === 'true' && LastNameError === 'true' && FirstNameError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && SexIDError === 'true' && RaceIDError === 'true' && WeightError === 'true' && DateOfBirthError === 'true' && DLNumberError === 'true' && SsnNoError === 'true' && AgeError === 'true') {
                    if (type === "VehicleOwner") {
                        if (ownerOfID && possenSinglData.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                    else if ((type === "ComplainantName")) {
                        if (complainNameID && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                    else if ((type === "Victim")) {
                        if (possessionIDVictim && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                    else if ((type === "ArrestParentMod")) {
                        if (ArrestparentID && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                    else {
                        if (possessionID && possenSinglData?.length > 0) {
                            Update_Name(); return;
                        } else {
                            insertMasterName(); return;
                        }
                    }
                }
            } else if (NameReasonCodeIDError === 'true' && HeightError === 'true' && AgeFromError === 'true' && RoleError === 'true' && VictimTypeError === 'true' && ContactError === 'true' && LastNameError === 'true' && FirstNameError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && SexIDError === 'true' && RaceIDError === 'true' && DateOfBirthError === 'true' && WeightError === 'true' && DLNumberError === 'true' && SsnNoError === 'true' && AgeError === 'true') {

                if (type === "VehicleOwner") {
                    if (ownerOfID && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }

                else if ((type === "ComplainantName")) {
                    if ((type === "ComplainantName" && complainNameID) && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }
                else if ((type === "Victim")) {
                    if (possessionIDVictim && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }
                else if ((type === "ArrestParentMod")) {
                    if (ArrestparentID && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }
                else {
                    if (possessionID && possenSinglData?.length > 0) {
                        Update_Name(); return;
                    } else {
                        insertMasterName(); return;
                    }
                }
            }
        }
    }, [LastNameError, FirstNameError, MiddleNameError, ContactError, OwnerFaxNumberError, OwnerPhoneNumberError, WeightError, NameTypeIDError, VictimTypeError, EthnicityErrorr, RoleError, ResidentError, AgeFromError, NameReasonCodeIDError, DateOfBirthError, RaceIDError, SexIDError, HeightError, DLNumberError, SsnNoError, AgeError])

    const insertMasterName = () => {
        if (roleStatus && !victimTypeStatus) {
            toastifyError('Please Add Reason Code Related To Victim');
            setErrors({
                ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true', "CrimeLocationError": '', 'AgeFromError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',
            })
        } else {
            const AgencyID = loginAgencyID;
            const CreatedByUserFK = loginPinID;
            const RoleName = multiSelectedReason?.optionSelected?.length > 0 ? getLabelsString(multiSelectedReason?.optionSelected) : "";
            const { NameIDNumber, Address, Contact, NameTypeID, BusinessTypeID, SuffixID,
                VerifyID, SexID, RaceID, PhoneTypeID, NameReasonCodeID, CertifiedByID, EthnicityID,
                AgeUnitID, IsJuvenile, IsCurrentPh, IsVerify, IsUnListedPhNo, HeightFrom, HeightTo,
                LastName, FirstName, MiddleName, SSN, WeightFrom, WeightTo, DateOfBirth, CertifiedDtTm,
                AgeFrom, OwnerNameID, OwnerPhoneNumber, OwnerFaxNumber, NameID, ArrestID, WarrantID,
                AgeTo, Years, EventType, ModifiedByUserFK, MasterNameID, TicketID, checkVictem, checkOffender,
                checkArrest, IncidentID, NameLocationID, DLStateID, IsMaster, DLNumber, Role, ResidentID, VictimTypeID } = masterNameValues;

            const values = {
                // 'NameIDNumber': IsJuvenile === editval[0]?.IsJuvenile ? NameIDNumber : 'Auto Generated',
                'NameIDNumber': (masterNameValues.NameIDNumber.startsWith('J') && masterNameValues.IsJuvenile) || (masterNameValues.NameIDNumber.startsWith('A') && !masterNameValues.IsJuvenile)
                    ? masterNameValues.NameIDNumber
                    : 'Auto Generated',
                'NameIDNumber': NameIDNumber,
                'Address': Address, 'Contact': Contact, 'NameTypeID': NameTypeID, 'BusinessTypeID': BusinessTypeID, 'SuffixID': SuffixID,
                'DLVerifyID': VerifyID, 'SexID': SexID, 'RaceID': RaceID, 'PhoneTypeID': PhoneTypeID, 'NameReasonCodeID': NameReasonCodeID, 'CertifiedByID': CertifiedByID, 'EthnicityID': EthnicityID,
                'AgeUnitID': AgeUnitID, 'IsJuvenile': IsJuvenile, 'IsCurrentPh': IsCurrentPh, 'IsVerify': IsVerify, 'IsUnListedPhNo': IsUnListedPhNo, 'HeightFrom': HeightFrom, 'HeightTo': HeightTo,
                'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SSN': SSN, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'DateOfBirth': DateOfBirth, 'CertifiedDtTm': CertifiedDtTm,
                'AgeFrom': AgeFrom, 'OwnerNameID': OwnerNameID, 'OwnerPhoneNumber': OwnerPhoneNumber, 'OwnerFaxNumber': OwnerFaxNumber, 'NameID': NameID, 'ArrestID': ArrestID, 'WarrantID': WarrantID,
                'AgeTo': AgeTo, 'Years': Years, 'EventType': EventType, 'ModifiedByUserFK': ModifiedByUserFK, 'MasterNameID': MasterNameID, 'TicketID': TicketID, 'checkVictem': checkVictem, 'checkOffender': checkOffender,
                'checkArrest': checkArrest, 'CreatedByUserFK': CreatedByUserFK, 'AgencyID': AgencyID, 'IncidentID': IncidentID, 'NameLocationID': NameLocationID, 'DLStateID': DLStateID, 'IsMaster': IsMaster, 'DLNumber': DLNumber,
                'Role': (type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod") ? [3] : Role, 'ResidentID': ResidentID, 'VictimTypeID': VictimTypeID, "RoleName": RoleName,
            };
            fetchPostData("MasterName/GetData_EventNameExists", {
                "MasterNameID": MasterNameID, "SSN": SSN, "IncidentID": mainIncidentID, "NameID": NameID, 'AgencyID': AgencyID
            }).then((data) => {
                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
                if (data) {
                    if (data[0]?.Total === 0) {
                        AddDeleteUpadate('MasterName/Insert_MasterName', values).then((res) => {

                            if (res.success) {
                                if (type === "Property") {
                                    setValue({ ...value, ['PossessionOfID']: res?.NameID, ['Name']: res.Name });

                                    setPossessionID(parseInt(res?.NameID)); setMstPossessionID(parseInt(res?.MasterNameID)); GetSingleDataPassion(res?.NameID, res?.MasterNameID);
                                    if (MstPage) { dispatch(get_Masters_Name_Drp_Data(parseInt(res?.NameID))); }
                                }
                                else if (type === "Pro-Owner") {
                                    setValue({ ...value, ['OwnerID']: res?.NameID, ['Name']: res.Name }); setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)
                                }
                                else if (type === "NameBusiness") {
                                    setValue({ ...value, ['OwnerNameID']: res?.NameID, ['Name']: res.Name }); setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)
                                }
                                else if (type === "ArresteeID") {
                                    setValue({ ...value, ['ArresteeID']: res?.NameID, ['Name']: res.Name }); setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)

                                }

                                else if (type === "VehicleOwner") {
                                    setValue({ ...value, ['OwnerID']: res?.NameID, ['Name']: res.Name });
                                    setOwnerOfID(parseInt(res?.NameID));
                                    // setPossessionID(res?.NameID);
                                    // setMstPossessionID(parseInt(res?.MasterNameID));
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID);

                                    if (MstPage && res?.MasterNameID) { dispatch(get_Masters_Name_Drp_Data(parseInt(res?.NameID))); }
                                }
                                else if (type === "VehicleName") {
                                    setValue({ ...value, ['InProfessionOf']: res?.NameID, ['Name']: res.Name });
                                    setPossessionID(parseInt(res?.NameID)); setMstPossessionID(res?.MasterNameID); GetSingleDataPassion(res?.NameID, res?.MasterNameID);
                                    Reset();
                                    if (MstPage && res?.MasterNameID) { dispatch(get_Masters_PossessionOwnerData(parseInt(res?.NameID))); }
                                }
                                else if (type === "LastSeenInfo") {
                                    setValue({ ...value, ['MissingPersonID']: res?.NameID, ['Name']: res.Name }); setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)
                                }
                                else if (type === "MissingNotify") {
                                    setValue({ ...value, ['NameID']: res?.NameID, ['Name']: res.Name }); setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)
                                }
                                else if (type === "MissingMod") {
                                    setValue({ ...value, ['MissingPersonNameID']: res?.NameID, ['Name']: res.Name });
                                    setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID);
                                    dispatch(get_ArresteeNameMissingPerData('', '', mainIncidentID));
                                }
                                else if (type === "ArrestMod") {

                                    setValue({ ...value, ['Name']: res.Name }); setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)
                                }
                                else if (type === "ArrestParentMod") {

                                    setValue({ ...value, ['ParentNameID']: parseInt(res?.NameID) });
                                    // setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    setArrestParentID(parseInt(res?.NameID));

                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)
                                }
                                else if (type === "PropertyManagement") {
                                    setValue({ ...value, ['Name']: res.Name }); setPossessionID(res?.NameID);
                                    Reset();
                                }
                                else if (type === "PropertyRoom") {
                                    setValue({ ...value, ['Name']: res.Name }); setPossessionID(res?.NameID);
                                    setMstPossessionID(res?.MasterNameID);
                                    Reset();
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)
                                }
                                else if (type === "Offender") {
                                    setValue({ ...value, ['Name']: res.Name }); setPossessionID(res?.NameID); GetSingleDataPassion(res?.NameID, res?.MasterNameID);
                                    Reset();
                                }
                                else if (type === "ComplainantName") {
                                    setValue({ ...value, ['Name']: res.Name }); setcomplainNameID(res?.NameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID);
                                    Reset();
                                }
                                else if (type === "Victim") {
                                    setValue({ ...value, ['Name']: res.Name }); setPossessionIDVictim(res?.NameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)
                                    Reset();

                                }
                                else {
                                    setValue({ ...value, ['inProfessionOf']: res?.NameID, ['Name']: res.Name }); setPossessionID(res?.NameID); setMstPossessionID(res?.MasterNameID);
                                    GetSingleDataPassion(res?.NameID, res?.MasterNameID)

                                }
                                toastifySuccess(res.Message);
                                setStatesChangeStatus(false);
                                if (!saveContinueStatus) {
                                    Reset();
                                    setNameModalStatus(false)
                                }
                                Reset();
                                setErrors({ ...errors, ['NameTypeIDError']: '', });
                                setChangesStatus(false)
                                get_MasterName_Count(res?.NameID, 0, MstPage === "MST-Name-Dash" ? true : false);
                            }
                        })
                    } else {
                        toastifyError('SSN Already Exists');
                    }
                }
            })
        }
    }

    const Update_Name = () => {
        if (roleStatus && !victimTypeStatus) {
            toastifyError('Please Add Reason Code Related To Victim');
            setErrors({
                ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true', "CrimeLocationError": '', 'AgeFromError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',
            })
        }
        else {
            const AgencyID = loginAgencyID;
            const RoleName = multiSelectedReason?.optionSelected?.length > 0 ? getLabelsString(multiSelectedReason?.optionSelected) : "";
            const { NameIDNumber, Address, Contact, NameTypeID, BusinessTypeID, SuffixID,
                VerifyID, SexID, RaceID, PhoneTypeID, NameReasonCodeID, CertifiedByID, EthnicityID,
                AgeUnitID, IsJuvenile, IsCurrentPh, IsVerify, IsUnListedPhNo, HeightFrom, HeightTo,
                LastName, FirstName, MiddleName, SSN, WeightFrom, WeightTo, DateOfBirth, CertifiedDtTm,
                AgeFrom, OwnerNameID, OwnerPhoneNumber, OwnerFaxNumber, NameID, ArrestID, WarrantID,
                AgeTo, Years, EventType, ModifiedByUserFK, MasterNameID, TicketID, checkVictem, checkOffender,
                checkArrest, IncidentID, NameLocationID, DLStateID, IsMaster, DLNumber, Role, ResidentID, VictimTypeID } = masterNameValues;

            let formattedRole = [];
            if (typeof Role === 'string' && Role.startsWith('[') && Role.endsWith(']')) {
                try {
                    formattedRole = JSON.parse(Role);
                } catch (error) {
                    console.error('Error parsing Role:', error);
                }
            } else if (typeof Role === 'number') {
                formattedRole = [Role];
            } else {
                formattedRole = Role;
            }
            const val = {
                // 'NameIDNumber': IsJuvenile === editval[0]?.IsJuvenile ? NameIDNumber : 'Auto Generated',
                'NameIDNumber': (masterNameValues.NameIDNumber.startsWith('J') && masterNameValues.IsJuvenile) || (masterNameValues.NameIDNumber.startsWith('A') && !masterNameValues.IsJuvenile)
                    ? masterNameValues.NameIDNumber
                    : 'Auto Generated',
                'Address': Address, 'Contact': Contact, 'NameTypeID': NameTypeID, 'BusinessTypeID': BusinessTypeID, 'SuffixID': SuffixID,
                'DLVerifyID': VerifyID, 'SexID': SexID, 'RaceID': RaceID, 'PhoneTypeID': PhoneTypeID, 'NameReasonCodeID': NameReasonCodeID, 'CertifiedByID': CertifiedByID, 'EthnicityID': EthnicityID,
                'AgeUnitID': AgeUnitID, 'IsJuvenile': IsJuvenile, 'IsCurrentPh': IsCurrentPh, 'IsVerify': IsVerify, 'IsUnListedPhNo': IsUnListedPhNo, 'HeightFrom': HeightFrom, 'HeightTo': HeightTo,
                'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SSN': SSN, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'DateOfBirth': DateOfBirth, 'CertifiedDtTm': CertifiedDtTm,
                'AgeFrom': AgeFrom, 'OwnerNameID': OwnerNameID, 'OwnerPhoneNumber': OwnerPhoneNumber, 'OwnerFaxNumber': OwnerFaxNumber, 'NameID': NameID, 'ArrestID': ArrestID, 'WarrantID': WarrantID,
                'AgeTo': AgeTo, 'Years': Years, 'EventType': EventType, 'ModifiedByUserFK': ModifiedByUserFK, 'MasterNameID': MasterNameID, 'TicketID': TicketID, 'checkVictem': checkVictem, 'checkOffender': checkOffender,
                'checkArrest': checkArrest, 'AgencyID': AgencyID, 'IncidentID': IncidentID, 'NameLocationID': NameLocationID, 'DLStateID': DLStateID, 'IsMaster': IsMaster, 'DLNumber': DLNumber,
                'Role': (type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod") ? [3] : formattedRole, 'ResidentID': ResidentID, 'VictimTypeID': VictimTypeID, "RoleName": RoleName,
            };

            fetchPostData("MasterName/GetData_EventNameExists", {

                "MasterNameID": MasterNameID, "SSN": SSN, "IncidentID": mainIncidentID, "NameID": NameID, 'AgencyID': AgencyID
            }).then((data) => {
                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
                if (data) {
                    setmasterNameValues({ ...masterNameValues, 'LastName': '', 'FirstName': '', 'MiddleName': '', });
                    if (data[0]?.Total === 0) {
                        AddDeleteUpadate('MasterName/Update_MasterName', val).then((res) => {
                            if (res.success) {
                                const parsedData = JSON.parse(res.data);
                                const message = parsedData.Table[0].Message;
                                toastifySuccess(message);
                                setErrors({ ...errors, ['NameTypeIDError']: '', ['LastNameError']: '', ['FirstNameError']: '', });
                                setChangesStatus(false)
                                setStatesChangeStatus(false);
                                get_MasterName_Count(NameID, MasterNameID, MstPage === "MST-Name-Dash" ? true : false);
                                dispatch(get_ArresteeNameMissingPerData(openPage, MasterNameID, mainIncidentID))
                                GetSingleDataPassions(NameID, MasterNameID);
                                if (type === "ArrestMod") {
                                    dispatch(get_ArresteeName_Data('', 0, IncID, true));
                                }
                            }
                        })
                    } else {
                        toastifyError('SSN Already Exists');
                    }
                }
            })
        }
    }

    const GetNameTypeIdDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('NameType/GetDataDropDown_NameType', val).then((data) => {
            if (data) {
                const id = data?.filter((val) => { if (val.NameTypeCode === "I") return val })
                if (id.length > 0 && editval.length === 0) {
                    setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].NameTypeID } })
                    setNameTypeCode(id[0].NameTypeCode);
                }
                setNameTypeIdDrp(threeColArray(data, 'NameTypeID', 'Description', 'NameTypeCode'))
            } else {
                setNameTypeIdDrp([]);
            }
        })
    };
    const GetReasonIdDrp = (loginAgencyID, id, type, RoleIdsArray) => {
        const val = { AgencyID: loginAgencyID, CategoryID: id, Role: (RoleIdsArray === null || RoleIdsArray === undefined) ? [] : (Array.isArray(RoleIdsArray) ? RoleIdsArray : [RoleIdsArray]) };
        // const val = { AgencyID: loginAgencyID, CategoryID: id, Role: RoleIdsArray === null ? null : (Array.isArray(RoleIdsArray) ? RoleIdsArray : [RoleIdsArray]) };
        fetchPostData('NameReasonCode/GetDataDropDown_NameReasonCode', val)
            .then((data) => {
                if (data) {
                    setReasonIdDrp(Comman_changeArrayFormatReasonCode(data, 'NameReasonCodeID', 'ReasonCode', 'Description'));
                    // setReasonIdDrp(Comman_changeArrayFormat(data, 'NameReasonCodeID', 'Description'));
                    let filterCode = '';
                    if (openPage === 'Victim') filterCode = 'VIC';
                    // else if (type === 'Offender') filterCode = 'OFF';
                    else if (type === 'NameBusiness' || type === 'VehicleOwner' || type === 'Pro-Owner') filterCode = 'OWN';
                    else if (type === 'MissingMod') filterCode = 'MIS';
                    else if (type === 'MissingPersonVehicleOwner') filterCode = 'OWN'
                    if (filterCode) {
                        const filtered = data.filter(item => item?.ReasonCode === filterCode);
                        if (filtered?.length > 0) {
                            const optionSelected = fourColArrayReasonCode(
                                filtered,
                                'NameReasonCodeID',
                                'Description',
                                'IsVictimName',
                                'IsOffenderName'
                            );
                            const finalValueList = filtered.map(item => item?.NameReasonCodeID);

                            setMultiSelected({ optionSelected });
                            setmasterNameValues(prev => ({
                                ...prev,
                                NameReasonCodeID: finalValueList
                            }));
                        }
                    }
                } else {
                    setReasonIdDrp([]);
                }
            })
            .catch((err) => {

            });
    };


    const GetReasonIdDrpDropdown = (loginAgencyID, id, type, RoleIdsArray) => {
        const val = { AgencyID: loginAgencyID, CategoryID: id, Role: RoleIdsArray === null ? null : (Array.isArray(RoleIdsArray) ? RoleIdsArray : [RoleIdsArray]) };
        fetchPostData('NameReasonCode/GetDataDropDown_NameReasonCode', val)
            .then((data) => {
                if (data) {
                    setReasonIdDrp(Comman_changeArrayFormatReasonCode(data, 'NameReasonCodeID', 'ReasonCode', 'Description'));
                    // setReasonIdDrp(Comman_changeArrayFormat(data, 'NameReasonCodeID', 'Description'));
                    // let filterCode = '';
                    // if (openPage === 'Victim') filterCode = 'VIC';
                    // else if (type === 'Offender') filterCode = 'OFF';
                    // else if (type === 'NameBusiness' || type === 'VehicleOwner' || type === 'Pro-Owner') filterCode = 'OWN';
                    // else if (type === 'MissingMod') filterCode = 'MIS';
                    // else if (type === 'MissingPersonVehicleOwner') filterCode = 'OWN'
                    // if (filterCode) {
                    //     const filtered = data.filter(item => item?.ReasonCode === filterCode);
                    //     if (filtered?.length > 0) {
                    //         const optionSelected = fourColArrayReasonCode(
                    //             filtered,
                    //             'NameReasonCodeID',
                    //             'Description',
                    //             'IsVictimName',
                    //             'IsOffenderName'
                    //         );
                    //         const finalValueList = filtered.map(item => item?.NameReasonCodeID);

                    //         setMultiSelected({ optionSelected });
                    //         setmasterNameValues(prev => ({
                    //             ...prev,
                    //             NameReasonCodeID: finalValueList
                    //         }));
                    //     }
                    // }
                } else {
                    setReasonIdDrp([]);
                }
            })
            .catch((err) => {

            });
    };



    const GetSuffixIDDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
            if (data) {
                setSuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
            } else {
                setSuffixIdDrp([]);
            }
        })
    };

    const getAgeUnitDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('/AgeUnit/GetDataDropDown_AgeUnit', val).then((data) => {
            if (data) {
                setAgeUnitDrpData(threeColArray(data, 'AgeUnitID', 'Description', 'AgeUnitCode'));
            }
            else {
                setAgeUnitDrpData([])
            }
        })
    };

    const GetSexIDDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('DropDown/GetData_SexType', val).then((data) => {
            if (data) {
                setSexIdDrp(Comman_changeArrayFormat(data, 'SexCodeID', 'Description'))
            } else {
                setSexIdDrp([]);
            }
        })
    }

    const GetRaceIdDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('DropDown/GetData_RaceType', val).then((data) => {
            if (data) {
                setRaceIdDrp(Comman_changeArrayFormat(data, 'RaceTypeID', 'Description'))
            } else {
                setRaceIdDrp([]);
            }
        })
    }

    const getEthinicityDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('/DropDown/GetDataDropDown_Ethnicity', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data, 'EthnicityID', 'Description'));
            }
            else {
                setEthinicityDrpData([])
            }
        })
    };

    const GetPhoneTypeIDDrp = (loginAgencyID, IsEMail, IsPhone) => {
        const val = { AgencyID: loginAgencyID, IsEMail: IsEMail, IsPhone: IsPhone, }
        fetchPostData('ContactPhoneType/GetDataDropDown_ContactPhoneType', val).then((data) => {
            if (data) {
                setPhoneTypeIdDrp(threeColArray(data, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
            } else {
                setPhoneTypeIdDrp([]);
            }
        })
    }

    const GetVerifyIDDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('Verify/GetDataDropDown_Verify', val).then((data) => {
            if (data) {
                setVerifyIdDrp(Comman_changeArrayFormat(data, 'VerifyID', 'Description'))
            } else {
                setVerifyIdDrp([]);
            }
        })
    };

    const getcertifiedByIdDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setCertifiedByIdDrp(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setCertifiedByIdDrp([])
            }
        })
    };

    const get_General_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetGeneralDropDown', val).then((data) => {
            if (data) {
                setResidentIDDrp(Comman_changeArrayFormat_With_Name(data[0]?.Resident, "ResidentID", "Description", "ResidentID"));

            } else {
                setResidentIDDrp([]);

            }
        })
    };

    const ChangeNameType = (e, name) => {
        if (e) {
            // get_Victim_Type_Data(loginAgencyID, nameTypeCode);
            setChangesStatus(true)
            setStatesChangeStatus(true)
            setroleStatus(false)
            if (name === 'NameTypeID') {
                get_Victim_Type_Data(loginAgencyID, e.id);
                setmasterNameValues({
                    ...masterNameValues,
                    [name]: e.value,
                    'NameIDNumber': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '', 'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'CertifiedByID': '', 'AgeUnitID': '',
                    'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'Role': null, 'VictimTypeID': '',
                });
                setErrors({
                    ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
                })
                setMultiSelected({ optionSelected: [], });
                setMultiSelectedReason({ optionSelected: [], });
                setLocationStatus(true);
                setErrors(prevValues => { return { ...prevValues, ['ContactError']: 'true' } })
                setMultiSelected({ optionSelected: [] }); setPhoneTypeCode(''); setNameTypeCode(e.id);
                if (e.id === 'B') { setIsBusinessName(true); GetBusinessTypeDrp(loginAgencyID); get_Arrestee_Drp_Data(mainIncidentID); } else { setIsBusinessName(false); }
            } else {
                setmasterNameValues({
                    ...masterNameValues,
                    [name]: e.value
                })
            }
        } else {
            setStatesChangeStatus(true)
            setmasterNameValues({
                ...masterNameValues,
                [name]: null, ['LastName']: '', ['Contact']: '',
            }); setNameTypeCode('');
            setIsBusinessName(false);

        }
    }

    const OnChangeSelectedReason = (data, name) => {
        setStatesChangeStatus(true)
        let VictimStatusData = data.some(function (item) { return item.label === "Victim" || item.label === "Business Is A Victim" || item.label === "Domestic Victim" || item.label === "Individual Is A Victim" || item.label === "Individual Victim" || item.label === "Other Is A Victim" || item.label === "Restraint Victim" || item.label === "Restraint Victim" || item.label === "Society Is A Victim" });
        if (VictimStatusData) {
            setvictimTypeStatus(true);
        } else if (
            !possessionID && !mstPossessionID
        ) {
            setvictimTypeStatus(false);
        }
        else if (!complainNameID) {
            setvictimTypeStatus(false);
        }





        // <---------------Both function are to resturn true or false ----------------> 
        let adult = data.some(function (item) { return item.label === "Adult Arrest" });
        let offender = data.some(function (item) { return item.label === "Offender" || item.label === "Sex Offender" });
        let VictimStatus = data.some(function (item) { return item.label === "Victim" });

        if (!adult || !offender) {
            setErrors({ ...errors, ['DateOfBirthError']: 'true', ['RaceIDError']: 'true', ['SexIDError']: 'true', ['NameTypeIDError']: '', ['ResidentError']: 'true', ['EthnicityErrorr']: 'true', ['AgeFromError']: 'true', });
        }
        setIsAdult(adult);
        setIsOffender(offender);
        setVictimStatus(VictimStatus);

        const newArray = [...data]
        if (masterNameValues.checkOffender === 1 && masterNameValues.checkVictem === 1) {
            multiSelected.optionSelected?.map(val => {
                if (val.checkVictem) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
                if (val.checkOff) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setmasterNameValues({
                ...masterNameValues,
                [name]: finalValueList
            });
            setMultiSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        }
        else if (masterNameValues.checkOffender === 1) {
            multiSelected.optionSelected?.map(val => {
                if (val.checkOff) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setmasterNameValues({
                ...masterNameValues,
                [name]: finalValueList
            })
            setMultiSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        }
        else if (masterNameValues.checkVictem === 1) {
            multiSelected.optionSelected?.map(val => {
                if (val.checkVictem) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setmasterNameValues({
                ...masterNameValues,
                [name]: finalValueList
            })
            setMultiSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        } else {
            let finalValueList = newArray?.map((item) => item.value);
            setmasterNameValues({
                ...masterNameValues,
                [name]: finalValueList
            })
            setMultiSelected({
                optionSelected: newArray
            });
        }
    };



    const handleDOBChange = (date, e) => {
        setStatesChangeStatus(true)
        if (date) {
            setmasterNameValues(pre => { return { ...pre, ['AgeFrom']: '', ['AgeTo']: '' } })
            setDobDate(date);
            const res = getShowingWithOutTime(date).split("/")
            let ageObj = calculateAge(date);

            if (ageObj.age > 0) {
                setmasterNameValues({ ...masterNameValues, ['AgeFrom']: ageObj?.age, ['AgeTo']: '', ['Years']: ageObj.age, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 5 })
            }
            else {
                if (ageObj.days > 0) {
                    setmasterNameValues({ ...masterNameValues, ['AgeFrom']: ageObj?.days, ['AgeTo']: '', ['Years']: ageObj.days, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 1, ['IsJuvenile']: true })
                } else {
                    const diffInMs = maxAllowedDate - date; // difference in milliseconds
                    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                    setmasterNameValues({ ...masterNameValues, ['AgeFrom']: 0, ['AgeTo']: '', ['Years']: 0, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 1, ['IsJuvenile']: true })
                    // setmasterNameValues({ ...masterNameValues, ['AgeFrom']: diffInHours, ['AgeTo']: '', ['Years']: diffInHours, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 2, ['IsJuvenile']: true })
                }
            }
        }
        else if (date === null) {
            setDobDate(''); setmasterNameValues({ ...masterNameValues, ['AgeFrom']: '', ['AgeTo']: '', ['DateOfBirth']: null, ['AgeUnitID']: null, });
            calculateAge(null)
        } else {
            setDobDate(''); setmasterNameValues({ ...masterNameValues, ['AgeFrom']: null, ['AgeTo']: '', ['DateOfBirth']: null, ['AgeUnitID']: null, });
            calculateAge(null)
        }

    };

    function calculateAge(birthday) {
        const today = MstPage === "MST-Name-Dash" ? new Date() : new Date(incReportedDate);
        const birthDate = new Date(birthday);
        const diffInMs = today - birthDate;

        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        return {
            age: age,
            days: diffInDays,
        };
    }

    // useEffect(() => {
    //     if (yearsVal < 18 || parseInt(masterNameValues.AgeFrom) < 18) {
    //         setJuvinile(true)
    //         setmasterNameValues({ ...masterNameValues, ['IsJuvenile']: true })
    //     } else {
    //         setJuvinile(false); setmasterNameValues({ ...masterNameValues, ['IsJuvenile']: false })
    //     }
    //     if (value.DateOfBirth) {
    //         const id = ageUnitDrpData?.filter((val) => { if (val.id === "Y") return val })
    //         if (id.length > 0) { setmasterNameValues(prevValues => { return { ...prevValues, ['AgeUnitID']: id[0].value } }) }
    //     }
    // }, [masterNameValues.DateOfBirth, masterNameValues.AgeFrom]);

    // useEffect(() => {
    //     if (yearsVal < 18 || parseInt(masterNameValues.AgeFrom) < 18 || masterNameValues.AgeFrom === '' || masterNameValues.AgeFrom === null || masterNameValues.AgeUnitID === 1 || masterNameValues.AgeUnitID === 2) {
    //         setJuvinile(true)
    //         setmasterNameValues({ ...masterNameValues, ['IsJuvenile']: true })
    //     } else {
    //         setJuvinile(false);
    //         setmasterNameValues({ ...masterNameValues, ['IsJuvenile']: false })
    //     }
    //     // if (value.DateOfBirth) {
    //     //   const id = ageUnitDrpData?.filter((val) => { if (val.id === "Y") return val })
    //     //     
    //     //   if (id.length > 0) { setValue(prevValues => { return { ...prevValues, ['AgeUnitID']: id[0].value } }) }
    //     // }
    // }, [masterNameValues.DateOfBirth, masterNameValues.AgeFrom, masterNameValues.AgeUnitID]);

    //DS new change in useEffect // 

    useEffect(() => {
        if (yearsVal < 18 || parseInt(masterNameValues.AgeFrom) < 18 || masterNameValues.AgeUnitID === 1 || masterNameValues.AgeUnitID === 2) {
            setJuvinile(true)
            setmasterNameValues({ ...masterNameValues, ['IsJuvenile']: true })
        } else {
            setJuvinile(false);
            setmasterNameValues({ ...masterNameValues, ['IsJuvenile']: false })
        }

    }, [masterNameValues.DateOfBirth, masterNameValues.AgeFrom, masterNameValues.AgeUnitID]);

    const HandleChange = (e) => {
        if (e.target.name === 'IsVerify' || e.target.name === 'IsUnListedPhNo' || e.target.name === 'IsUnknown') {
            setStatesChangeStatus(true)
            setChangesStatus(true)
            if (e.target.name === 'IsVerify') {
                if (e.target.checked && addVerifySingleData.length > 0) {
                    setModalStatus(false);
                    setLocationStatus(true); setAddVerifySingleData([]);
                    setmasterNameValues(pre => { return { ...pre, ['Address']: '', [e.target.name]: e.target.checked, } });
                } else {
                    setmasterNameValues(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
                    setModalStatus(true);
                    setLocationStatus(false);
                }
            } else {
                setmasterNameValues({ ...masterNameValues, [e.target.name]: e.target.checked });
            }
        } else if (e.target.name === 'Contact') {
            setStatesChangeStatus(true)
            if (phoneTypeCode === 'E') {
                setChangesStatus(true)
                setmasterNameValues({ ...masterNameValues, [e.target.name]: e.target.value });
            } else {
                let ele = e.target.value.replace(/\D/g, '');
                if (ele.length === 10) {
                    setmasterNameValues(pre => { return { ...pre, ['IsUnListedPhNo']: 'true', } });
                    const cleaned = ('' + ele).replace(/\D/g, '');
                    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if (match) {
                        setChangesStatus(true)
                        setmasterNameValues({
                            ...masterNameValues,
                            [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                        })
                    }
                } else {
                    ele = e.target.value.split('-').join('').replace(/\D/g, '');
                    setChangesStatus(true)
                    setmasterNameValues({
                        ...masterNameValues,
                        [e.target.name]: ele,
                        ['IsUnListedPhNo']: ele === '' ? false : masterNameValues['IsUnListedPhNo'],
                    })
                }
            }
        }
        else if (e.target.name === 'OwnerPhoneNumber') {
            setStatesChangeStatus(true)
            setChangesStatus(true)
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length <= 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setmasterNameValues({
                        ...masterNameValues,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3],
                    });
                } else {
                    setmasterNameValues({
                        ...masterNameValues,
                        [e.target.name]: ele,
                    });
                }
            }
        } else if (e.target.name === 'OwnerFaxNumber') {
            setStatesChangeStatus(true)
            setChangesStatus(true)
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length <= 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setmasterNameValues({
                        ...masterNameValues,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3],
                    });
                } else {
                    setmasterNameValues({
                        ...masterNameValues,
                        [e.target.name]: ele,
                    });
                }
            }
        } else if (e.target.name === 'SSN') {
            setStatesChangeStatus(true)
            setChangesStatus(true)
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setmasterNameValues({
                        ...masterNameValues,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    });
                    getNameSearchPop(loginAgencyID, value?.NameTypeID, null, null, null, null, match[1] + '-' + match[2] + '-' + match[3])
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setmasterNameValues({
                    ...masterNameValues,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'WeightTo' || e.target.name === 'WeightFrom') {
            setStatesChangeStatus(true)
            setChangesStatus(true)
            let checkNumber = e.target.value.replace(/[^0-9]/g, "");
            if (e.target.name === 'WeightFrom') {
                setmasterNameValues({ ...masterNameValues, [e.target.name]: checkNumber, 'WeightTo': '' })
            }
            else if (e.target.name === 'WeightTo') {
                setmasterNameValues({ ...masterNameValues, [e.target.name]: checkNumber })
            }

        } else if (e.target.name === 'HeightFrom') {
            setStatesChangeStatus(true)
            setChangesStatus(true)
            let checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setmasterNameValues({
                ...masterNameValues,
                [e.target.name]: checkNumber, HeightTo: '',
            })
        } else if (e.target.name === 'HeightTo') {
            setStatesChangeStatus(true)
            setChangesStatus(true)
            let checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setmasterNameValues({
                ...masterNameValues,
                [e.target.name]: checkNumber
            })
        } else if (e.target.name === 'AgeFrom') {
            setStatesChangeStatus(true)
            setChangesStatus(true)

            const checkNumber = e.target.value.replace(/[^0-9]/g, "");
            setDobDate('');
            setmasterNameValues({ ...masterNameValues, [e.target.name]: checkNumber, ['Years']: null, ['DateOfBirth']: null, AgeTo: '', AgeUnitID: '' })
        }
        else if (e.target.name === 'AgeTo') {
            setStatesChangeStatus(true)
            setChangesStatus(true)
            const checkNumber = e.target.value.replace(/[^0-9]/g, "");
            setDobDate('');
            setmasterNameValues({ ...masterNameValues, [e.target.name]: checkNumber, ['Years']: null, ['DateOfBirth']: null })
        }
        else {
            setStatesChangeStatus(true)
            setmasterNameValues({ ...masterNameValues, [e.target.name]: e.target.value })
        }
    };

    const LastFirstNameOnBlur = (e) => {
        if (e.target.name === 'LastName') {

            if (masterNameValues?.LastName && masterNameValues?.FirstName) {
                getNameSearchPop(loginAgencyID, masterNameValues?.NameTypeID, masterNameValues?.LastName, masterNameValues?.FirstName, null, null)
            }
        } else if (e.target.name === 'FirstName') {

            if (masterNameValues?.LastName && masterNameValues?.FirstName) {
                getNameSearchPop(loginAgencyID, masterNameValues?.NameTypeID, masterNameValues?.LastName, masterNameValues?.FirstName, null, null)
            }
        }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {

            setChangesStatus(true)
            setStatesChangeStatus(true)
            if (name === 'DLStateID') {
                setmasterNameValues({ ...masterNameValues, [name]: e.value, ['DLNumber']: '', ['VerifyID']: '' });
            }
            else {
                setmasterNameValues({ ...masterNameValues, [name]: e.value });
            }
        } else {
            setStatesChangeStatus(true)
            if (name === 'DLStateID') {
                setmasterNameValues({ ...masterNameValues, [name]: null, ['DLNumber']: '', ['VerifyID']: '' });
            } else {
                setmasterNameValues({ ...masterNameValues, [name]: null });

            }
        }
    };

    const ChangeDropDownVictimType = (e, name) => {
        if (e) {
            setChangesStatus(true)
            setStatesChangeStatus(true)
            setmasterNameValues({ ...masterNameValues, [name]: e.value, });
        } else {
            setStatesChangeStatus(true)
            setmasterNameValues({ ...masterNameValues, [name]: null, });
        }
    };

    const ChangePhoneType = (e, name) => {
        setStatesChangeStatus(true); setChangesStatus(true);
        if (e) {
            if (name === 'PhoneTypeID') {
                setPhoneTypeCode(e.id)
                setmasterNameValues({ ...masterNameValues, [name]: e.value, ['Contact']: "", })

            } else {
                setmasterNameValues({ ...masterNameValues, [name]: e.value })
            }
        } else if (e === null) {
            if (name === 'PhoneTypeID') {
                setmasterNameValues({ ...masterNameValues, ['PhoneTypeID']: "", ['Contact']: "", ['IsUnListedPhNo']: false });
                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '' });
                setPhoneTypeCode('')
            }
        } else {
            setmasterNameValues({ ...masterNameValues, [name]: null, ['IsUnListedPhNo']: false });
            setPhoneTypeCode('')
        }
    }


    const Reset = () => {
        setmasterNameValues({
            ...masterNameValues,
            'NameIDNumber': 'Auto Generated', 'Address': '', 'Contact': '', 'BusinessTypeID': '', 'SuffixID': '', 'DLStateID': '',
            'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'EthnicityID': '',
            'AgeUnitID': '', 'IsJuvenile': false, 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'HeightFrom': '', 'HeightTo': '',
            'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'DateOfBirth': '', 'CertifiedDtTm': '',
            'AgeFrom': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "",
            'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0,
            'checkArrest': 0, 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': IncID, 'NameLocationID': '', 'DLNumber': '',
            'Role': null, 'ResidentID': '',
        });

        setIsSecondDropdownDisabled(true);
        setmissingpersonCount('');
        setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', ['InjuryError']: '', ['ResidentError']: '', ['EthnicityErrorr']: '', ['RoleError']: '' });
        setIsBusinessName(false);
        setChangesStatus(false);
        setStatesChangeStatus(false);
        setIsAdult(false);
        setIsOffender(false);
        setVictimStatus(false);
        setroleStatus(false);
        setglobalname('');
        setglobalnameto('');
        setPhoneTypeCode('');
        setPossenSinglData([]);
        setvictimTypeStatus(false);
        setMstPossessionID('');
        setVictimTypeDrp([]);
        const id = nameTypeIdDrp?.filter((val) => { if (val.id === "I") return val });
        if (id.length > 0) {
            setmasterNameValues(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
            setNameTypeCode(id[0].NameTypeCode);
        }
        setMultiSelected({ optionSelected: [], });
        setMultiSelectedReason({ optionSelected: [], });
    }

    const getNameSearch = async (loginAgencyID, NameTypeID, LastName, FirstName, MiddleName, DateOfBirth, SSN, HeightFrom, HeightTo, WeightFrom, WeightTo, EthnicityID, RaceID, SexID, PhoneTypeID, Contact, type) => {
        if (LastName || DateOfBirth || FirstName || MiddleName || SSN || SexID || HeightFrom || HeightTo || DateOfBirth || WeightFrom || WeightTo || EthnicityID || RaceID || PhoneTypeID || Contact || value.NameReasonCodeID || value.Address || value.AgeFrom || value.AgeTo || value.AgeUnitID || value.DLNumber || value.DLStateID || value.SuffixID) {
            fetchPostData("MasterName/Search_Name", {
                "NameTypeID": NameTypeID, "LastName": LastName, "FirstName": FirstName ? FirstName : null, "MiddleName": MiddleName ? MiddleName : null, "SSN": SSN ? SSN : null, 'AgencyID': loginAgencyID ? loginAgencyID : null,
                NameIDNumber: "", 'ReasonCodeList': masterNameValues.NameReasonCodeID ? JSON.stringify(masterNameValues.NameReasonCodeID) : '', SuffixID: masterNameValues.SuffixID, 'DateOfBirth': DateOfBirth, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, HairColorID: "", EyeColorID: "", 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, SMTTypeID: "", SMTLocationID: "", SMT_Description: "",
                IncidentNumber: "", IncidentNumberTo: "", ReportedDate: "", ReportedDateTo: "", 'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'PhoneTypeID': PhoneTypeID, 'Contact': Contact, 'Address': masterNameValues.Address ? masterNameValues.Address : '', 'AgeFrom': masterNameValues.AgeFrom ? masterNameValues.AgeFrom : '', 'AgeTo': masterNameValues.AgeTo ? masterNameValues.AgeTo : '', 'AgeUnitID': masterNameValues.AgeUnitID ? masterNameValues.AgeUnitID : '',
                'DLNumber': masterNameValues.DLNumber ? masterNameValues.DLNumber : '',
                'DLStateID': masterNameValues.DLStateID ? masterNameValues.DLStateID : '',
                'MasterNameID': mstPossessionID,

            }).then((data) => {
                if (data.length > 0) {
                    setNameSearchValue(data); setNameSearchStatus(true)
                } else {
                    setNameSearchValue([]);
                    if (type) toastifyError('No Name Available');
                    setNameSearchStatus(false)
                }
            })
        } else {
            setNameSearchStatus(false);
            toastifyError('Empty Feild');
        }
    }

    const getNameSearchPop = async (loginAgencyID, NameTypeID, LastName, FirstName, MiddleName, DateOfBirth, SSN, type) => {
        if (LastName || DateOfBirth || LastName || FirstName || MiddleName || SSN || loginAgencyID) {
            fetchPostData("MasterName/Search_Name", {
                "NameTypeID": NameTypeID, "LastName": LastName, "FirstName": FirstName ? FirstName : null, "MiddleName": MiddleName ? MiddleName : null, "SSN": SSN ? SSN : null, 'AgencyID': loginAgencyID ? loginAgencyID : null,
                NameIDNumber: "", NameTypeID: "", NameReasonCodeID: "", SuffixID: "", DateOfBirthFrom: DateOfBirth, DateOfBirthTo: "", SexID: "", RaceID: "", EthnicityID: "", HairColorID: "", EyeColorID: "", WeightFrom: "", WeightTo: "", SMTTypeID: "", SMTLocationID: "", SMT_Description: "",
                IncidentNumber: "", IncidentNumberTo: "", ReportedDate: "", ReportedDateTo: "", DateOfBirth: "", HeightFrom: "", HeightTo: "", 'MasterNameID': mstPossessionID,
            }).then((data) => {
                if (data.length > 0) {
                    setNameSearchValue(data); setNameSearchStatus(true)
                } else {
                    setNameSearchValue([]);
                    if (type) toastifyError('No Name Available');
                    setNameSearchStatus(false)
                }
            })
        } else {
            setNameSearchStatus(false);
            toastifyError('Empty Feild');
        }
    }

    const HeightFromOnBlur = (e) => {
        setStatesChangeStatus(true)
        setChangesStatus(true)
        const heightstates = e.target.value;
        var len = heightstates.length;
        let heights = "";
        var oldvalue = heightstates.substring(len - 1, len);
        if (oldvalue != "\"") {
            if (len == 0) {
                heights = '';
            }
            else if (len == 1) {
                heights = heightstates.substring(0, len) + "'00\"";
            }
            else if (len == 2) {
                heights = heightstates.substring(0, len - 1) + "'0" + heightstates.substring(len - 1) + "\"";
            }
            else {
                var lengthstate = heightstates.substring(len - 2)
                heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
                if (heightstates.substring(len - 2, len - 1) == 0) {
                    heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
                }
                if (lengthstate > 11) {

                    heights = '';
                    toastifyError('invalid');
                    return false
                }
            }
        }
        else {
            heights = heightstates;
        }
        const globalname_Fromarray = globalnameto.replace("\"", "").replace("'", "");
        const globalname_Toarray = heights.replace("\"", "").replace("'", "");
        if ((parseInt(globalname_Fromarray) < parseInt(globalname_Toarray))) {
            toastifyError('height should be less');

        }
        if (parseInt(heights.replace("\"", "").replace("'", "")) < 101) {
            toastifyError('Height should be greater than or equal to 1\'01"');
            heights = '';
        }
        if (heights != '') {
            setglobalname(heights);
        }
        setmasterNameValues({
            ...masterNameValues,
            ['HeightFrom']: heights,
        })
        setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'true' } })
        return true
    }

    const HeightOnChange = (e) => {
        setStatesChangeStatus(true)
        setChangesStatus(true)
        const heightstates = e.target.value;
        var len = heightstates.length;
        let heights = "";
        var oldvalue = heightstates.substring(len - 1, len);
        if (oldvalue != "\"") {
            if (len == 0) {
                heights = '';
            }
            else if (len == 1) {
                heights = heightstates.substring(0, len) + "'00\"";
            }
            else if (len == 2) {
                heights = heightstates.substring(0, len - 1) + "'0" + heightstates.substring(len - 1) + "\"";
            }
            else {
                heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
                if (heightstates.substring(len - 2, len - 1) == 0) {
                    heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
                }
                var lengthstate = heightstates.substring(len - 2)
                if (lengthstate > 11) {
                    heights = '';

                    toastifyError('invalid');
                    return false
                }
            }

        }
        else {
            heights = heightstates;
        }

        const globalname_Fromarray = globalname.replace("\"", "").replace("'", "");
        const globalname_Toarray = heights.replace("\"", "").replace("'", "");

        if ((parseInt(globalname_Fromarray) > parseInt(globalname_Toarray))) {
            toastifyError('height should be greater');

        }
        if (parseInt(heights.replace("\"", "").replace("'", "")) < 101) {
            toastifyError('Height should be greater than or equal to 1\'01"');
            heights = '';
        }

        if (heights != '') {
            setglobalnameto(heights)
        }

        setmasterNameValues({
            ...masterNameValues,
            ['HeightTo']: heights,
        })
        setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'true' } })
        return true

    }

    const setStatusFalse = () => {
        setNameModalStatus(false); Reset(); setErrors(''); setNameSearchStatus(false);
    }

    const handleWeightFromBlur = () => {
        const weightFrom = Number(masterNameValues?.WeightFrom);
        const weightTo = Number(masterNameValues?.WeightTo);
        if (weightFrom && weightTo) {
            if (weightFrom > weightTo) {
                toastifyError('WeightFrom should be less than WeightTo');
            }
        }

    };

    const handleWeightToBlur = () => {
        const weightFrom = Number(masterNameValues?.WeightFrom);
        const weightTo = Number(masterNameValues?.WeightTo);
        if (weightFrom && weightTo) {
            if (weightTo < weightFrom) {
                toastifyError('WeightTo should be greater than WeightFrom');
            }
        }

    };

    const handleKeyDowns = (e) => {
        const charCode = e.keyCode || e.which;
        const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
        const numKeys = Array.from({ length: 10 }, (_, i) => i + 48);
        const numpadKeys = Array.from({ length: 10 }, (_, i) => i + 96);

        if (!controlKeys.includes(charCode) && !numKeys.includes(charCode) && !numpadKeys.includes(charCode)) {
            e.preventDefault();
        }
    };

    const maxDate = (incReportedDate && !isNaN(Date.parse(incReportedDate))) ? new Date(incReportedDate) : new Date();

    // // Custom Style
    // const colourStyles = {
    //     control: (styles) => ({
    //         ...styles, backgroundColor: "#fce9bf",
    //         height: 20,
    //         minHeight: 33,
    //         fontSize: 14,
    //         margintop: 2,
    //         boxShadow: 0,
    //     }),
    // };

    const colourStylesReason = {
        control: (styles) => ({
            ...styles, backgroundColor: "#FFE2A8",
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
            minHeight: 33,
        }),
    };


    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef1.current.setOpen(false);
        }
    };



    const onChangeReaonsRole = (e, name) => {
        setStatesChangeStatus(true);
        setChangesStatus(true);

        const newArray = [...(e || [])];
        const finalValueList = newArray.map(item => item.value);

        setIsSecondDropdownDisabled(finalValueList.length === 0);
        // Define role values
        const VICTIM_ROLE_ID = 1;
        const OFFENDER_ROLE_ID = 2;
        const OTHER_ROLE_ID = 3;

        const victimLabels = [
            "Victim", "Business Is A Victim", "Domestic Victim", "Individual Is A Victim",
            "Individual Victim", "Other Is A Victim", "Restraint Victim", "Society Is A Victim"
        ];

        const victimRemoved = !finalValueList.includes(VICTIM_ROLE_ID);
        const offenderRemoved = !finalValueList.includes(OFFENDER_ROLE_ID);
        const otherRemoved = !finalValueList.includes(OTHER_ROLE_ID);

        let updatedOptionSelected = [...multiSelected.optionSelected];

        if (victimRemoved) {
            updatedOptionSelected = updatedOptionSelected.filter(
                (opt) => !victimLabels.includes(opt.label)
            );
        }

        if (offenderRemoved) {
            updatedOptionSelected = updatedOptionSelected.filter(
                (opt) => !["Offender", "Sex Offender"].includes(opt.label)
            );
        }

        if (otherRemoved) {
            updatedOptionSelected = updatedOptionSelected.filter(
                (opt) => victimLabels.includes(opt.label) || opt.label === "Offender"
            );
        }
        if (finalValueList.includes(VICTIM_ROLE_ID)) {
            setroleStatus(true);
            const id = nameTypeIdDrp?.filter((val) => { if (val.value === masterNameValues.NameTypeID) return val })
            get_Victim_Type_Data(loginAgencyID, id[0].id);
            // get_Victim_Type_Data(loginAgencyID, nameTypeCode);
        } else {
            setroleStatus(false);
        }
        setMultiSelected(prev => ({ ...prev, optionSelected: updatedOptionSelected }));

        setmasterNameValues(prev => ({
            ...prev,
            [name]: finalValueList,
            VictimTypeID: finalValueList.includes(VICTIM_ROLE_ID) ? masterNameValues.VictimTypeID : '',
            NameReasonCodeID: updatedOptionSelected.map(item => item.value)
        }));

        if (finalValueList.length > 0) {
            GetReasonIdDrp(loginAgencyID, masterNameValues.NameTypeID, type, finalValueList);
        } else {
            GetReasonIdDrp(loginAgencyID, masterNameValues.NameTypeID, type, []);
            setMultiSelected({ optionSelected: [] });
            setmasterNameValues(prev => ({ ...prev, NameReasonCodeID: [], VictimTypeID: '' }));
        }

        setMultiSelectedReason({ optionSelected: newArray });
    };
    const ReasonCodeRoleArr = [
        { value: 1, label: 'Victim' },
        { value: 2, label: 'Offender' },
        { value: 3, label: 'Other' }
    ]

    // const filteredReasonCodeRoleArr = nameTypeCode === 'B' ? ReasonCodeRoleArr.filter(item => item.value !== 2) : type === "Offender" ? ReasonCodeRoleArr.filter(item => item.value === 2) : ReasonCodeRoleArr ;
    const filteredReasonCodeRoleArr = nameTypeCode === 'B' ? ReasonCodeRoleArr.filter(item => item.value !== 2) : type === "Offender" ? ReasonCodeRoleArr.filter(item => item.value === 2) : type === "Victim" ? ReasonCodeRoleArr.filter(item => item.value === 1) : ReasonCodeRoleArr;


    // const filteredReasonCodeRoleArr = nameTypeCode === 'B' ? ReasonCodeRoleArr.filter(item => item.value !== 2) : ReasonCodeRoleArr;
    const filteredValue = filteredReasonCodeRoleArr[0]?.value;

    const StatusOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
    ];

    useEffect(() => {
        if (nameTypeCode) get_Victim_Type_Data(loginAgencyID, nameTypeCode);
    }, [nameTypeCode])



    const get_Victim_Type_Data = (loginAgencyID, nameTypeID) => {
        const val = { AgencyID: loginAgencyID };

        fetchPostData('VictimType/GetDataDropDown_VictimType', val).then((data) => {
            if (data) {
                const formattedData = threeColArray(data, 'VictimTypeID', 'Description', 'VictimCode');

                let filteredVictimType = [];

                if (nameTypeID === 'I') {
                    filteredVictimType = formattedData?.filter(item =>
                        item.id === "I" || item.id === "L"
                    );
                } else if (nameTypeID === 'B') {
                    filteredVictimType = formattedData?.filter(item =>
                        ["B", "F", "G", "R", "S", "O", "U"].includes(item.id)
                    );
                } else {
                    filteredVictimType = formattedData; // fallback to all if not 1 or 2
                }

                setVictimTypeDrp(filteredVictimType);
            } else {
                setVictimTypeDrp([]);
            }
        });
    };


    const getFiltredReasonCode = (arr) => {
        const selectedReasonArr = multiSelected.optionSelected ? multiSelected.optionSelected : [];

        const isAdultArrest = selectedReasonArr?.filter((item) => item?.label === "Adult Arrest")
        const isJuvinileArrest = selectedReasonArr?.filter((item) => item?.label === "Juvenile Arrest")

        if (isAdultArrest?.length > 0) {
            const isAdultArr = arr?.filter((item) => item?.label != "Juvenile Arrest")

            return isAdultArr

        } else if (isJuvinileArrest?.length > 0) {
            const isAdultArr = arr?.filter((item) => item?.label != "Adult Arrest")

            return isAdultArr
        } else {
            return arr
        }
    }

    const [allowTimeSelect, setAllowTimeSelect] = useState(false);

    const maxAllowedDate = MstPage === "MST-Name-Dash" ? new Date() : new Date(incReportedDate);

    const isSameDate = (d1, d2) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const updateAllowTimeSelect = (date) => {
        if (!date) {
            setAllowTimeSelect(false);
            return;
        }
        const selectedDate = new Date(date);
        const maxDate = new Date(maxAllowedDate);
        const dayBeforeMax = new Date(maxDate);
        dayBeforeMax.setDate(maxDate.getDate() - 1);


        if (isSameDate(selectedDate, maxDate) || isSameDate(selectedDate, dayBeforeMax)) {
            setAllowTimeSelect(true);
        } else {
            setAllowTimeSelect(false);
        }
    };

    useEffect(() => {
        updateAllowTimeSelect(dobDate); // Set it when page loads (initially)
    }, [dobDate, maxAllowedDate]);

    const handleDateChange = (date, e) => {
        if (new Date(date) > new Date(maxAllowedDate)) {
            date = maxAllowedDate
        } else if (new Date('1900-01-01') > new Date(date)) {
            date = new Date('1900-01-02')
        }
        setDobDate(date);
        updateAllowTimeSelect(date);
        handleDOBChange(date, e);
        setChangesStatus(true);
        setStatesChangeStatus(true);
    };

    const getLimitedTimesUpTo = (limitDate) => {
        const times = [];
        const start = new Date(limitDate);
        start.setHours(0, 0, 0, 0); // start at 00:00

        const end = new Date(limitDate);

        while (start <= end) {
            times.push(new Date(start));
            start.setMinutes(start.getMinutes() + 1);
        }

        return times;
    };


    useEffect(() => {
        if (type === "Offender" && filteredReasonCodeRoleArr.length && !possessionID > 0) {
            const selectedOption = filteredReasonCodeRoleArr[0];

            // Prevent re-setting if the selected option is already set
            if (multiSelectedReason?.optionSelected?.value !== selectedOption.value) {
                setMultiSelectedReason({
                    optionSelected: selectedOption
                });
                setmasterNameValues(prev => ({ ...prev, 'Role': [selectedOption.value] }));
                if (masterNameValues.NameTypeID) {
                    GetReasonIdDrp(loginAgencyID, masterNameValues?.NameTypeID, type, [selectedOption.value]);
                }

            }
        }
        else if (type === "Victim" && filteredReasonCodeRoleArr.length && !possessionIDVictim > 0) {
            const selectedOption = filteredReasonCodeRoleArr[0];

            // Prevent re-setting if the selected option is already set
            if (multiSelectedReason?.optionSelected?.value !== selectedOption.value) {
                setMultiSelectedReason({
                    optionSelected: selectedOption
                });
                setroleStatus(true);
                setmasterNameValues(prev => ({ ...prev, 'Role': [selectedOption.value] }));
                if (masterNameValues.NameTypeID) {
                    GetReasonIdDrp(loginAgencyID, masterNameValues?.NameTypeID, type, [selectedOption.value]);
                    get_Victim_Type_Data(loginAgencyID, nameTypeCode);
                }
            }
        }
    }, [type, filteredReasonCodeRoleArr, multiSelectedReason?.optionSelected?.value, masterNameValues?.NameTypeID]);



    return (
        <>
            {
                nameModalStatus &&
                <>

                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="MasterModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog  modal-dialog-centered  modal-xl" style={{ minHeight: "500px" }}>
                            <div class="modal-content">
                                <button type="button" className="border-0" aria-label="Close" onClick={() => { setStatusFalse(); setNameShowPage('home'); }} data-dismiss="modal" style={{ alignSelf: "end" }} ref={crossButtonRef}><b>X</b>
                                </button>
                                <div class="modal-body name-body-model">
                                    <div className="row " >
                                        <div className="col-12 name-tab">
                                            <ul className='nav nav-tabs'>
                                                <span
                                                    className={`nav-item ${nameShowPage === 'home' ? 'active' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                    style={{ color: nameShowPage === 'home' ? 'Red' : '#000' }}
                                                    aria-current="page"
                                                    onClick={() => {
                                                        if (!changesStatus) setNameShowPage('home');
                                                        if (type === "ComplainantName") { GetSingleDataPassion(complainNameID); }
                                                        else {
                                                            GetSingleDataPassion(possessionID);
                                                        }
                                                    }}>
                                                    {iconHome}
                                                </span>
                                                {!isBusinessName && (
                                                    <>
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'General' ? 'Red' : masterCountgenStatus === true ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('General') }}>
                                                            General{`${MasterNameTabCount?.GeneralCount > 0 ? '(' + MasterNameTabCount?.GeneralCount + ')' : ''}`}
                                                        </span>
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'Appearance' ? 'Red' : masterAppeaCountStatus === true ? 'blue' : '#000' }}

                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Appearance') }} >
                                                            Appearance{`${MasterNameTabCount?.AppearanceCount > 0 ? '(' + MasterNameTabCount?.AppearanceCount + ')' : ''}`}
                                                        </span>
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'aliases' ? 'Red' : MasterNameTabCount?.AliasesCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('aliases') }}  >
                                                            Aliases{`${MasterNameTabCount?.AliasesCount > 0 ? '(' + MasterNameTabCount?.AliasesCount + ')' : ''}`}
                                                        </span>
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'SMT' ? 'Red' : MasterNameTabCount?.NameSMTCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('SMT') }}>
                                                            SMT{`${MasterNameTabCount?.NameSMTCount > 0 ? '(' + MasterNameTabCount?.NameSMTCount + ')' : ''}`}
                                                        </span>
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'Identification_Number' ? 'Red' : MasterNameTabCount?.IdentificationNumberCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Identification_Number') }}  >
                                                            Identification Number{`${MasterNameTabCount?.IdentificationNumberCount > 0 ? '(' + MasterNameTabCount?.IdentificationNumberCount + ')' : ''}`}
                                                        </span>
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'Contact_Details' ? 'Red' : MasterNameTabCount?.ContactDetailsCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Contact_Details') }}  >
                                                            Contact Details{`${MasterNameTabCount?.ContactDetailsCount > 0 ? '(' + MasterNameTabCount?.ContactDetailsCount + ')' : ''}`}
                                                        </span>
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'Address' ? 'Red' : MasterNameTabCount?.AddressCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Address') }}    >
                                                            Address{`${MasterNameTabCount?.AddressCount > 0 ? '(' + MasterNameTabCount?.AddressCount + ')' : ''}`}
                                                        </span>


                                                    </>
                                                )}

                                                {isBusinessName && (
                                                    <>
                                                        <span

                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'Contact_Details' ? 'Red' : MasterNameTabCount?.ContactDetailsCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Contact_Details') }}  >
                                                            Contact Details{`${MasterNameTabCount?.ContactDetailsCount > 0 ? '(' + MasterNameTabCount?.ContactDetailsCount + ')' : ''}`}
                                                        </span>
                                                        <span

                                                            className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${type === "VehicleOwner"
                                                                ? (!ownerOfID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                : type === "ComplainantName"
                                                                    ? (!complainNameID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                    : (!possessionID && possenSinglData?.length === 0 ? ' disabled' : '')
                                                                }`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#MasterSaveModel" : ''}
                                                            style={{ color: nameShowPage === 'Address' ? 'Red' : MasterNameTabCount?.AddressCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Address') }}    >
                                                            Address{`${MasterNameTabCount?.AddressCount > 0 ? '(' + MasterNameTabCount?.AddressCount + ')' : ''}`}
                                                        </span>

                                                    </>
                                                )}

                                            </ul>
                                        </div>
                                    </div>

                                    {nameShowPage === 'home' &&
                                        <div>
                                            <fieldset>
                                                <legend style={{ fontWeight: 'bold' }}>Name</legend>
                                                <div className="row">
                                                    <div className="col-2 col-md-2 col-lg-1 mt-1">
                                                        <label htmlFor="" className='new-label '>Name Type
                                                            {errors.NameTypeIDError !== 'true' ? (
                                                                <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.NameTypeIDError}</p>
                                                            ) : null}
                                                        </label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2">
                                                        <Select
                                                            name='NameTypeID'
                                                            value={nameTypeIdDrp?.filter((obj) => obj.value === masterNameValues?.NameTypeID)}
                                                            options={nameTypeIdDrp}
                                                            onChange={(e) => ChangeNameType(e, 'NameTypeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            isDisabled={setArrestID || nameID || masterNameID || possessionID || type === "MissingMod" ? true : false}
                                                            styles={Requiredcolour}
                                                        />
                                                    </div>
                                                    {
                                                        nameTypeCode !== "B" ?
                                                            <>
                                                                <div className="col-2 col-md-2 col-lg-1 mt-1">
                                                                    <label htmlFor="" className='new-label '>MNI</label>
                                                                </div>
                                                                <div className="col-2 col-md-3 col-lg-2 text-field mt-0 ">
                                                                    <input type="text" className='readonlyColor' value={masterNameValues?.NameIDNumber} name='nameid' required readOnly autoComplete='off' />
                                                                </div>
                                                                <div className="col-3 col-md-2 col-lg-1 mt-1">
                                                                    <div className="form-check ">
                                                                        <input className="form-check-input" type="checkbox" name='IsJuvenile' value={value?.IsJuvenile} checked={juvinile} id="flexCheckDefault" disabled={nameTypeCode === "B" ? true : false} />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Juvenile
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </> :
                                                            <></>

                                                    }

                                                    {
                                                        nameTypeCode === "B" ?
                                                            <div className="col-12 col-md-12 col-lg-12">
                                                                <div className="row ">
                                                                    <div className="col-1 col-md-1 col-lg-1 mt-2 px-0">
                                                                        <label htmlFor="" className='label-name'>Business Name
                                                                            {errors.LastNameError !== 'true' && nameTypeCode === 'B' ? (
                                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</p>
                                                                            ) : null}</label>
                                                                    </div>
                                                                    <div className="col-2 col-md-2 col-lg-4 text-field mt-1">
                                                                        <input type="text" name='LastName'
                                                                            className={'requiredColor'}
                                                                            value={masterNameValues?.LastName}

                                                                            maxLength={100}
                                                                            onChange={HandleChange} onBlur={LastFirstNameOnBlur} required
                                                                            autoComplete='off' />
                                                                    </div>
                                                                    {
                                                                        !nameID &&
                                                                        <div className="col-12 col-md-3 col-lg-1 name-box text-center mt-1 pt-1 " >
                                                                            <button type="button" data-toggle="modal" data-target="#SearchModal" className="btn btn-sm btn-success" onClick={() => getNameSearch(loginAgencyID, masterNameValues?.NameTypeID, masterNameValues.LastName, masterNameValues.FirstName, masterNameValues.MiddleName, masterNameValues.DateOfBirth, masterNameValues.SSN, masterNameValues.HeightFrom, masterNameValues.HeightTo, masterNameValues.WeightFrom, masterNameValues.WeightTo, masterNameValues.EthnicityID, masterNameValues.RaceID, masterNameValues.SexID, masterNameValues.PhoneTypeID, masterNameValues.Contact, true)}>Search</button>
                                                                        </div>
                                                                    }
                                                                    <div className="col-1 col-md-1 col-lg-1 mt-2">
                                                                        <label htmlFor="" className='label-name '>Business Type</label>
                                                                    </div>
                                                                    <div className="col-2 col-md-2 col-lg-5  mt-1">
                                                                        <Select
                                                                            name='BusinessTypeID'
                                                                            value={businessTypeDrp?.filter((obj) => obj.value === masterNameValues?.BusinessTypeID)}
                                                                            options={businessTypeDrp}
                                                                            onChange={(e) => ChangeDropDown(e, 'BusinessTypeID')}
                                                                            isClearable
                                                                            placeholder="Select..."
                                                                            styles={customStylesWithOutColor}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="row">




                                                                    <div className="col-1 col-md-1 col-lg-1 mt-2 ">
                                                                        <label htmlFor="" className='label-name '>Owner&nbsp;Phone&nbsp;No.{errors.OwnerPhoneNumberError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OwnerPhoneNumberError}</p>
                                                                        ) : null}</label>
                                                                    </div>
                                                                    <div className="col-2 col-md-2 col-lg-2 text-field mt-1">
                                                                        <input type="text" name='OwnerPhoneNumber' maxLength={11} className={''} value={masterNameValues?.OwnerPhoneNumber} onChange={HandleChange} required />

                                                                    </div>

                                                                    <div className="col-1 col-md-1 col-lg-2 px-0 mt-2">
                                                                        <label htmlFor="" className='label-name px-0'>Business Fax No.{errors.OwnerFaxNumberError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OwnerFaxNumberError}</p>
                                                                        ) : null}</label>
                                                                    </div>
                                                                    <div className="col-2 col-md-2 col-lg-2 text-field mt-1">
                                                                        <input type="text" name='OwnerFaxNumber' className={''} value={masterNameValues?.OwnerFaxNumber} onChange={HandleChange} required />
                                                                    </div>
                                                                    <div className='col-lg-5'></div>
                                                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                                        <label htmlFor="" className='label-name '>
                                                                            Role{errors.RoleError !== 'true' ? (
                                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RoleError}</p>
                                                                            ) : null}
                                                                        </label>
                                                                    </div>

                                                                    <div className="col-3 col-md-3 col-lg-5 mt-1">
                                                                        <SelectBox
                                                                            options={filteredReasonCodeRoleArr ? filteredReasonCodeRoleArr : []}
                                                                            // styles={StylesRole}
                                                                            isDisabled={type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod" || type === "Victim" || type === 'Pro-Owner' || type === 'MissingPersonVehicleOwner' ? true : false}
                                                                            menuPlacement="bottom"
                                                                            isMulti
                                                                            closeMenuOnSelect={false}
                                                                            hideSelectedOptions={true}
                                                                            isClearable={false}

                                                                            allowSelectAll={false}
                                                                            value={multiSelectedReason?.optionSelected}
                                                                            components={{ MultiValue }}

                                                                            onChange={(selectedOptions, actionMeta) => {
                                                                                const removedOption = actionMeta.removedValue;
                                                                                const action = actionMeta.action;
                                                                                const isRemovingVictim = removedOption?.value === 1;
                                                                                if ((action === 'remove-value' || action === 'pop-value') && removedOption?.value === 3 && missingpersonCount > 0
                                                                                ) { return; }

                                                                                if (actionMeta.action === 'remove-value' && isRemovingVictim && masterNameValues.checkVictem === 1 && (possessionID || mstPossessionID)) {
                                                                                    return;
                                                                                }
                                                                                if (actionMeta.action === 'remove-value' && isRemovingVictim && masterNameValues.checkVictem !== 1) {
                                                                                    setMultiSelected({ optionSelected: [] });
                                                                                    setmasterNameValues(masterNameValues => ({ ...masterNameValues, NameReasonCodeID: null }));
                                                                                }
                                                                                onChangeReaonsRole(selectedOptions, 'Role');
                                                                            }}
                                                                            // styles={colourStyles}
                                                                            styles={(type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod" || type === "Victim" || type === 'Pro-Owner' || type === 'MissingPersonVehicleOwner') ? customStylesWithOutColor : Requiredcolour}
                                                                        />
                                                                    </div>
                                                                    <div className="col-2 col-md-2 col-lg-1 mt-1">
                                                                        <label htmlFor="" className='new-label '>Reason Code
                                                                            {errors.NameReasonCodeIDError !== 'true' ? (
                                                                                <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.NameReasonCodeIDError}</p>
                                                                            ) : null}
                                                                        </label>
                                                                    </div>
                                                                    <div className="col-3 col-md-3 col-lg-5 " >
                                                                        <SelectBox
                                                                            // isDisabled={type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod"  || type === 'Pro-Owner' || (isSecondDropdownDisabled && type !== "Offender") || (isSecondDropdownDisabled && type !== "Victim") ? true : false}
                                                                            isDisabled={
                                                                                (type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod" || type === "MissingPersonVehicleOwner" || type === 'Pro-Owner' ||
                                                                                    (isSecondDropdownDisabled && !(type === "Offender" || type === "Victim")))
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            styles={colourStylesReason}
                                                                            options={reasonIdDrp ? getFiltredReasonCode(reasonIdDrp) : []}
                                                                            menuPlacement="bottom"
                                                                            isMulti
                                                                            closeMenuOnSelect={false}
                                                                            hideSelectedOptions={true}
                                                                            allowSelectAll={false}
                                                                            value={multiSelected.optionSelected}
                                                                            components={{ MultiValue }}
                                                                            onChange={(selectedOptions, actionMeta) => {
                                                                                const victimLabels = [
                                                                                    "Victim", "Business Is A Victim", "Domestic Victim", "Individual Is A Victim",
                                                                                    "Individual Victim", "Other Is A Victim", "Restraint Victim", "Society Is A Victim"
                                                                                ];

                                                                                const removedOption = actionMeta.removedValue;

                                                                                const action = actionMeta.action;
                                                                                if (
                                                                                    (action === 'remove-value' || action === 'pop-value') &&
                                                                                    (removedOption?.reasonCode === 'MIS') &&
                                                                                    missingpersonCount > 0
                                                                                ) {

                                                                                    return;
                                                                                }
                                                                                if (action === 'remove-value' && removedOption) {
                                                                                    const isVictim = victimLabels.includes(removedOption.label);
                                                                                    const currentVictimCount = multiSelected.optionSelected.filter(opt => victimLabels.includes(opt.label)).length;
                                                                                    if ((mstPossessionID || mstPossessionID) && isVictim && currentVictimCount <= 1) {
                                                                                        return;
                                                                                    }
                                                                                }
                                                                                if (masterNameValues.checkVictem === 1 || (masterNameValues.checkVictem === 0 && masterNameValues.checkOffender === 1) || masterNameValues.checkOffender === 0) {
                                                                                    OnChangeSelectedReason(selectedOptions, 'NameReasonCodeID');
                                                                                }
                                                                            }}

                                                                        />
                                                                    </div>
                                                                    {

                                                                        roleStatus ?

                                                                            <>
                                                                                <div className="col-3 col-md-3 col-lg-1 mt-1">
                                                                                    <label htmlFor="" className='label-name '>
                                                                                        Victim Type
                                                                                        {errors.VictimTypeError !== 'true' ? (
                                                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.VictimTypeError}</p>
                                                                                        ) : null}</label>

                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-2 mt-1" >
                                                                                    <Select
                                                                                        name='VictimTypeID'
                                                                                        value={victimTypeDrp?.filter((obj) => obj.value === masterNameValues?.VictimTypeID)}
                                                                                        styles={roleStatus ? Requiredcolour : ''}
                                                                                        isClearable
                                                                                        options={victimTypeDrp}
                                                                                        onChange={(e) => { ChangeDropDownVictimType(e, 'VictimTypeID'); }}
                                                                                        placeholder="Select.."
                                                                                        menuPlacement="top"
                                                                                    />
                                                                                </div>
                                                                            </>


                                                                            :
                                                                            <></>
                                                                    }

                                                                </div>

                                                            </div>
                                                            :


                                                            <>





                                                                <div className="col-2 col-md-2 col-lg-1 mt-1">
                                                                    <label htmlFor="" className='new-label '>
                                                                        Resident
                                                                        {errors.ResidentError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ResidentError}</p>
                                                                        ) : null}
                                                                    </label>

                                                                </div>
                                                                <div className="col-10 col-md-10 col-lg-4" >

                                                                    <Select
                                                                        name="ResidentID"
                                                                        styles={victimTypeStatus ? Requiredcolour : ''}
                                                                        value={residentIDDrp?.filter((obj) => obj.value === masterNameValues?.ResidentID)}
                                                                        options={residentIDDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'ResidentID')}
                                                                        isClearable
                                                                        placeholder="Select..."

                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-1 mt-1">
                                                                    <label htmlFor="" className='new-label '>Last Name
                                                                        {errors.LastNameError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</p>
                                                                        ) : null}
                                                                    </label>
                                                                </div>
                                                                <div className="col-10 col-md-10 col-lg-2 text-field mt-1 ">
                                                                    <input type="text" name='LastName'

                                                                        className={(type === "ArrestMod" && possessionID) ? 'readonlyColor' : 'requiredColor'}
                                                                        disabled={(type === "ArrestMod" && possessionID) ? true : false}
                                                                        value={masterNameValues?.LastName}

                                                                        maxLength={100}
                                                                        onChange={HandleChange} onBlur={LastFirstNameOnBlur} required
                                                                        autoComplete='off' />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-1 mt-1">
                                                                    <label htmlFor="" className='new-label '>First Name
                                                                        {errors.FirstNameError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</p>
                                                                        ) : null}
                                                                    </label>
                                                                </div>
                                                                <div className="col-10 col-md-10 col-lg-2 text-field mt-0 ">
                                                                    <input type="text" name='FirstName'
                                                                        className={nameTypeCode === "B" || (type === "ArrestMod" && possessionID) ? 'readonlyColor' : ''}
                                                                        value={masterNameValues?.FirstName}

                                                                        maxLength={50}
                                                                        onChange={HandleChange} onBlur={LastFirstNameOnBlur}
                                                                        required
                                                                        disabled={nameTypeCode === "B" || (type === "ArrestMod" && possessionID) ? true : false}
                                                                        readOnly={nameTypeCode === "B" || (type === "ArrestMod" && possessionID) ? true : false} autoComplete='off' />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-1 mt-1 px-0 ">
                                                                    <label htmlFor="" className='new-label '>Middle Name
                                                                        {errors.MiddleNameError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.MiddleNameError}</p>
                                                                        ) : null}
                                                                    </label>
                                                                </div>
                                                                <div className="col-10 col-md-10 col-lg-2 text-field mt-1 ">
                                                                    <input type="text" name='MiddleName'
                                                                        value={masterNameValues?.MiddleName} className={nameTypeCode === "B" ? 'readonlyColor' : ''}
                                                                        onChange={HandleChange}
                                                                        maxLength={50}

                                                                        required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} autoComplete='off' />
                                                                </div>
                                                                <div className="col-12 col-md-12 col-lg-3 d-flex  ">
                                                                    <div className="col-2 col-md-2 col-lg-2 mt-2 ml-4 ml-md-0">
                                                                        <label htmlFor="" className='label-name'>Suffix</label>
                                                                    </div>
                                                                    <div className="col-10 col-md-10 col-lg-10 mt-1 ">
                                                                        <Select
                                                                            name='SuffixID'
                                                                            value={suffixIdDrp?.filter((obj) => obj.value === masterNameValues?.SuffixID)}
                                                                            options={suffixIdDrp}
                                                                            onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                                                                            isClearable
                                                                            placeholder="Select..."
                                                                            isDisabled={nameTypeCode === "B" ? true : false}
                                                                            styles={customStylesWithOutColor}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-12 col-lg-6" >
                                                                    <div className="row">
                                                                        <div className="col-1 col-md-2 col-lg-2 mt-3">
                                                                            <label htmlFor="" className='label-name '>DOB
                                                                                {errors.DateOfBirthError !== 'true' ? (
                                                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DateOfBirthError}</p>
                                                                                ) : null}</label>
                                                                        </div>
                                                                        <div className="col-2 col-md-3 col-lg-4 mt-0">
                                                                            <DatePicker
                                                                                id='DateOfBirth'
                                                                                name='DateOfBirth'
                                                                                ref={startRef}
                                                                                selected={dobDate}
                                                                                onChange={handleDateChange}
                                                                                onKeyDown={(e) => {
                                                                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                                        e.preventDefault();
                                                                                    } else {
                                                                                        onKeyDown(e);
                                                                                    }
                                                                                }}
                                                                                dateFormat={allowTimeSelect ? "MM/dd/yyyy " : "MM/dd/yyyy"}
                                                                                // showTimeSelect={allowTimeSelect} // Always show time picker
                                                                                timeFormat="HH:mm"
                                                                                timeIntervals={1}
                                                                                timeCaption="Time"
                                                                                placeholderText={masterNameValues.DateOfBirth ? masterNameValues.DateOfBirth : 'Select...'}
                                                                                isClearable={masterNameValues.DateOfBirth ? true : false}
                                                                                showMonthDropdown
                                                                                showYearDropdown
                                                                                dropdownMode="select"
                                                                                autoComplete="off"
                                                                                maxDate={maxAllowedDate}
                                                                                disabled={nameTypeCode === "B"}
                                                                                className={(nameTypeCode === "B" || masterNameValues?.IsUnknown === 'true' || masterNameValues?.IsUnknown === true) ? 'readonlyColor' : '' ? 'requiredColor' : ''}
                                                                                readOnly={(nameTypeCode === "B" || masterNameValues?.IsUnknown === 'true' || masterNameValues?.IsUnknown === true)}
                                                                                // Disable time input if not allowed
                                                                                timeInputLabel={allowTimeSelect ? "" : "Time Not Available"}
                                                                                includeTimes={
                                                                                    dobDate && isSameDate(dobDate, maxAllowedDate)
                                                                                        ? getLimitedTimesUpTo(maxAllowedDate)
                                                                                        : undefined
                                                                                }
                                                                            />
                                                                        </div>
                                                                        <div className="col-12 col-md-7 col-lg-4 d-flex " >
                                                                            <div className="col-1 col-md-1 col-lg-2 mt-2 ">
                                                                                <label htmlFor="" className='label-name'>Age{errors.AgeFromError !== 'true' ? (
                                                                                    <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.AgeFromError}</p>
                                                                                ) : null}</label>
                                                                            </div>
                                                                            <div className=" mt-1  text-field px-0" style={{ flex: "0 0 auto", width: "31%" }} >
                                                                                <input type="text"
                                                                                    name='AgeFrom'
                                                                                    maxLength={3}
                                                                                    value={masterNameValues?.AgeFrom} onChange={HandleChange} required

                                                                                    className={nameTypeCode === "B" || masterNameValues?.DateOfBirth ? 'readonlyColor' : type === "MissingMod" || victimTypeStatus || type === "ArrestMod" || type === "Offender" || type === 'Victim' ? 'requiredColor' : ''}
                                                                                    disabled={nameTypeCode === "B" || masterNameValues?.DateOfBirth ? true : false}
                                                                                    readOnly={nameTypeCode === "B" || masterNameValues?.DateOfBirth ? true : false}
                                                                                    placeholder='From' autoComplete='off' />
                                                                            </div>
                                                                            <span className='dash-name mt-1'>_</span>
                                                                            <div className=" mt-1  text-field " style={{ flex: "0 0 auto", width: "20%" }} >
                                                                                <input type="text"
                                                                                    name='AgeTo'
                                                                                    maxLength={3} value={masterNameValues?.AgeTo}
                                                                                    onChange={HandleChange} required
                                                                                    className={nameTypeCode === "B" || masterNameValues?.DateOfBirth || !masterNameValues?.AgeFrom ? 'readonlyColor' : ''}
                                                                                    disabled={nameTypeCode === "B" || masterNameValues?.DateOfBirth ? true : false || !masterNameValues?.AgeFrom}
                                                                                    readOnly={nameTypeCode === "B" || masterNameValues?.DateOfBirth ? true : false}
                                                                                    placeholder='To' autoComplete='off' />
                                                                            </div>
                                                                            <div className="col-4 col-md-4 col-lg-10  mt-1" >
                                                                                <Select
                                                                                    name='AgeUnitID'
                                                                                    value={ageUnitDrpData?.filter((obj) => obj.value === masterNameValues?.AgeUnitID)}
                                                                                    options={ageUnitDrpData}
                                                                                    onChange={(e) => ChangeDropDown(e, 'AgeUnitID')}
                                                                                    isClearable
                                                                                    placeholder="Age Unit..."
                                                                                    styles={masterNameValues.AgeFrom ? Requiredcolour : customStylesWithOutColor}

                                                                                    isDisabled={masterNameValues.DateOfBirth ? true : false || !masterNameValues?.AgeFrom || masterNameValues?.IsUnknown === 'true' || masterNameValues?.IsUnknown === true}

                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-12 col-md-12 col-lg-6 p-0 mt-1">
                                                                    <div className="row">
                                                                        <div className="col-6 col-md-6 col-lg-5 d-flex ">
                                                                            <div className="col-1 col-md-4 col-lg-5 mt-1 ">
                                                                                <label htmlFor="" className='label-name '>Gender
                                                                                    {errors.SexIDError !== 'true' ? (
                                                                                        <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.SexIDError}</p>
                                                                                    ) : null}</label>
                                                                            </div>
                                                                            <div className="col-12 col-md-8 col-lg-8 ">
                                                                                <Select
                                                                                    styles={(nameTypeCode === "B") ? customStylesWithOutColor : ((isAdult || isOffender || type === "ArrestMod" || type === "MissingMod" || type === "Offender") || victimTypeStatus) ? Requiredcolour : customStylesWithOutColor}
                                                                                    name='SexID'
                                                                                    value={sexIdDrp?.filter((obj) => obj.value === masterNameValues?.SexID)}
                                                                                    onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                                                    options={sexIdDrp}
                                                                                    isClearable
                                                                                    placeholder="Select..."
                                                                                    isDisabled={nameTypeCode === "B" ? true : false}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-6 col-md-6 col-lg-5 d-flex ">
                                                                            <div className="col-1 col-md-2 col-lg-5 mt-1 px-0">
                                                                                <label htmlFor="" className='label-name '>Race
                                                                                    {errors.RaceIDError !== 'true' ? (
                                                                                        <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.RaceIDError}</p>
                                                                                    ) : null}</label>
                                                                            </div>
                                                                            <div className="col-12 col-md-10 col-lg-12 ">
                                                                                <Select
                                                                                    name='RaceID'
                                                                                    value={raceIdDrp?.filter((obj) => obj.value === masterNameValues?.RaceID)}
                                                                                    onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                                                    options={raceIdDrp}
                                                                                    isClearable
                                                                                    placeholder="Select..."
                                                                                    isDisabled={nameTypeCode === "B" ? true : false}
                                                                                    styles={(nameTypeCode === "B") ? customStylesWithOutColor : (isAdult || isOffender || type === "ArrestMod" || type === "MissingMod" || type === "Offender") || victimTypeStatus ? Requiredcolour : customStylesWithOutColor}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                                    <label htmlFor="" className='new-label '>Ethnicity{errors.EthnicityErrorr !== 'true' ? (
                                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.EthnicityErrorr}</p>
                                                                    ) : null}</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-1 ">
                                                                    <Select
                                                                        name='EthnicityID'
                                                                        value={ethinicityDrpData?.filter((obj) => obj.value === masterNameValues?.EthnicityID)}
                                                                        onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                                        options={ethinicityDrpData}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                        styles={nameTypeCode === "B" ? customStylesWithOutColor : victimTypeStatus ? Requiredcolour : customStylesWithOutColor}
                                                                        isDisabled={nameTypeCode === "B" ? true : false}
                                                                        className={nameTypeCode === "B" ? 'readonlyColor' : ''}
                                                                    />
                                                                </div>
                                                                <div className="col-1 col-md-1 col-lg-1 ">
                                                                    <label htmlFor="" className='new-label '>Weight
                                                                        <p className='text-center mb-0' style={{ fontWeight: 'bold', fontSize: '10px' }}>(LBS)</p>
                                                                        {errors.WeightError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.WeightError}</p>
                                                                        ) : null}
                                                                    </label>
                                                                </div>
                                                                <div className="col-2 col-md-1 col-lg-1 text-field mt-0 " >
                                                                    <input type="text" name='WeightFrom'
                                                                        onBlur={(e) => {
                                                                            if (e.target.name === 'WeightFrom' &&
                                                                                e.relatedTarget !== crossButtonRef.current &&
                                                                                e.relatedTarget?.name !== 'HeightFrom' &&
                                                                                e.relatedTarget?.name !== 'HeightTo') {
                                                                                handleWeightFromBlur(e);
                                                                            }
                                                                        }}

                                                                        value={masterNameValues?.WeightFrom}
                                                                        onChange={HandleChange} maxLength={3}
                                                                        required
                                                                        disabled={nameTypeCode === "B" ? true : false}
                                                                        readOnly={nameTypeCode === "B" ? true : false}
                                                                        className={nameTypeCode === "B" ? 'readonlyColor' : ''}
                                                                        placeholder='From' autoComplete='off' />

                                                                </div>
                                                                <span className='dash-name mt-1' >_</span>
                                                                <div className="col-3 col-md-1 col-lg-1 ">
                                                                    <div className="text-field pr-2 mt-0 ">
                                                                        <input type="text"
                                                                            onBlur={(e) => {
                                                                                if (e.target.name === 'WeightTo' &&
                                                                                    e.relatedTarget !== crossButtonRef.current &&
                                                                                    e.relatedTarget?.name !== 'HeightFrom' &&
                                                                                    e.relatedTarget?.name !== 'HeightTo') {
                                                                                    handleWeightToBlur(e);
                                                                                }
                                                                            }}
                                                                            name='WeightTo'
                                                                            value={masterNameValues?.WeightTo}
                                                                            onChange={HandleChange} maxLength={3}
                                                                            required className={nameTypeCode === "B" || !masterNameValues?.WeightFrom ? 'readonlyColor' : ''}
                                                                            disabled={nameTypeCode === "B" || !masterNameValues?.WeightFrom ? true : false}
                                                                            readOnly={nameTypeCode === "B" ? true : false}
                                                                            placeholder='To' autoComplete='off' />
                                                                    </div>
                                                                </div>
                                                                <div className="col-2 col-md-1 col-lg-1 ">
                                                                    <label htmlFor="" className='new-label text-nowrap '>Height
                                                                        {errors.HeightError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.HeightError}</p>
                                                                        ) : null}
                                                                        <p className='text-center mb-0 ' style={{ fontWeight: 'bold', fontSize: '10px' }}>(FT)</p>
                                                                    </label>
                                                                </div>
                                                                <div className="col-2 col-md-1 col-lg-1 text-field mt-0 " >
                                                                    <input type="text"
                                                                        name='HeightFrom'
                                                                        maxLength={3}
                                                                        onChange={HandleChange}
                                                                        onBlur={(e) => {
                                                                            e.relatedTarget !== closeButtonRef.current &&
                                                                                e.relatedTarget !== saveButtonRef.current &&
                                                                                e.relatedTarget !== crossButtonRef.current &&
                                                                                e.relatedTarget !== saveAndContRef.current &&
                                                                                e.relatedTarget?.name !== 'WeightFrom' &&
                                                                                e.relatedTarget?.name !== 'WeightTo' &&
                                                                                HeightFromOnBlur(e)
                                                                        }}
                                                                        value={masterNameValues?.HeightFrom}
                                                                        required
                                                                        onKeyDown={handleKeyDowns}
                                                                        disabled={nameTypeCode === "B" ? true : false}
                                                                        readOnly={nameTypeCode === "B" ? true : false}
                                                                        className={nameTypeCode === "B" ? 'readonlyColor' : ''}
                                                                        placeholder='From' autoComplete='off' />
                                                                </div>
                                                                <span className='dash-name mt-0' >__</span>
                                                                <div className="col-3 col-md-1 col-lg-1 ">
                                                                    <div className="text-field mt-0  ">
                                                                        <input type="text"
                                                                            name='HeightTo'
                                                                            maxLength={3}
                                                                            onChange={HandleChange}
                                                                            onBlur={(e) => {
                                                                                e.relatedTarget !== closeButtonRef.current &&
                                                                                    e.relatedTarget !== saveButtonRef.current &&
                                                                                    e.relatedTarget !== crossButtonRef.current &&
                                                                                    e.relatedTarget !== saveAndContRef.current &&
                                                                                    e.relatedTarget?.name !== 'WeightFrom' &&
                                                                                    e.relatedTarget?.name !== 'WeightTo' &&
                                                                                    HeightOnChange(e)
                                                                            }}
                                                                            value={masterNameValues?.HeightTo}
                                                                            required
                                                                            className={nameTypeCode === "B" || !masterNameValues.HeightFrom ? 'readonlyColor' : ''}
                                                                            disabled={nameTypeCode === "B" || !masterNameValues.HeightFrom ? true : false}
                                                                            readOnly={nameTypeCode === "B" ? true : false}
                                                                            placeholder='To' autoComplete='off' />
                                                                    </div>
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2 mt-1">
                                                                    <div className="col-2 col-md-2 col-lg-3 mt-3">

                                                                    </div>

                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-1 mt-1">
                                                                    <label htmlFor="" className='label-name '>
                                                                        Role{errors.RoleError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RoleError}</p>
                                                                        ) : null}
                                                                    </label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-4 ">
                                                                    <SelectBox
                                                                        options={filteredReasonCodeRoleArr ? filteredReasonCodeRoleArr : []}
                                                                        // styles={StylesRole}
                                                                        isDisabled={type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod" || type === "Victim" || type === "Offender" || type === "Pro-Owner" || type === 'MissingPersonVehicleOwner' ? true : false}
                                                                        menuPlacement="bottom"
                                                                        isMulti
                                                                        closeMenuOnSelect={false}
                                                                        hideSelectedOptions={true}
                                                                        isClearable={false}

                                                                        allowSelectAll={false}
                                                                        value={multiSelectedReason?.optionSelected}
                                                                        components={{ MultiValue }}

                                                                        onChange={(selectedOptions, actionMeta) => {
                                                                            const removedOption = actionMeta.removedValue;
                                                                            const isRemovingVictim = removedOption?.value === 1;
                                                                            const action = actionMeta.action;
                                                                            if ((action === 'remove-value' || action === 'pop-value') && removedOption?.value === 3 && missingpersonCount > 0
                                                                            ) { return; }
                                                                            if (actionMeta.action === 'remove-value' && isRemovingVictim && masterNameValues.checkVictem === 1 && (possessionID || mstPossessionID)) {
                                                                                return;
                                                                            }
                                                                            if (actionMeta.action === 'remove-value' && isRemovingVictim && masterNameValues.checkVictem !== 1) {
                                                                                setMultiSelected({ optionSelected: [] });
                                                                                setmasterNameValues(masterNameValues => ({ ...masterNameValues, NameReasonCodeID: null }));
                                                                            }
                                                                            onChangeReaonsRole(selectedOptions, 'Role');
                                                                        }}
                                                                        // styles={colourStyles}
                                                                        styles={(type === "NameBusiness" || type === "VehicleOwner" || type === "Pro-Owner" || type === "Offender" || type === "Victim" || type === "MissingMod" || type === 'MissingPersonVehicleOwner') ? customStylesWithOutColor : Requiredcolour}
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-1 mt-1">
                                                                    <label htmlFor="" className='new-label '>Reason Code
                                                                        {errors.NameReasonCodeIDError !== 'true' ? (
                                                                            <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.NameReasonCodeIDError}</p>
                                                                        ) : null}
                                                                    </label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-6 " >
                                                                    <SelectBox
                                                                        // isDisabled={type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod" || type === 'Pro-Owner' || (isSecondDropdownDisabled && type !== "Offender") || (isSecondDropdownDisabled && type !== "Victim") ? true : false}
                                                                        isDisabled={
                                                                            (type === "NameBusiness" || type === "VehicleOwner" || type === "MissingMod" || type === 'Pro-Owner' ||
                                                                                (isSecondDropdownDisabled && !(type === "Offender" || type === "Victim")))
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        styles={colourStylesReason}

                                                                        options={reasonIdDrp ? getFiltredReasonCode(reasonIdDrp) : []}
                                                                        menuPlacement="bottom"
                                                                        isMulti
                                                                        closeMenuOnSelect={false}
                                                                        hideSelectedOptions={true}
                                                                        allowSelectAll={false}
                                                                        value={multiSelected.optionSelected}
                                                                        components={{ MultiValue }}
                                                                        onChange={(selectedOptions, actionMeta) => {
                                                                            const victimLabels = [
                                                                                "Victim", "Business Is A Victim", "Domestic Victim", "Individual Is A Victim",
                                                                                "Individual Victim", "Other Is A Victim", "Restraint Victim", "Society Is A Victim"
                                                                            ];

                                                                            const removedOption = actionMeta.removedValue;

                                                                            const action = actionMeta.action;
                                                                            if (
                                                                                (action === 'remove-value' || action === 'pop-value') &&
                                                                                (removedOption?.reasonCode === 'MIS') &&
                                                                                missingpersonCount > 0
                                                                            ) {

                                                                                return;
                                                                            }
                                                                            if (action === 'remove-value' && removedOption) {
                                                                                const isVictim = victimLabels.includes(removedOption.label);
                                                                                const currentVictimCount = multiSelected.optionSelected.filter(opt => victimLabels.includes(opt.label)).length;
                                                                                if ((mstPossessionID || mstPossessionID) && isVictim && currentVictimCount <= 1) {
                                                                                    return;
                                                                                }
                                                                            }
                                                                            if (masterNameValues.checkVictem === 1 || (masterNameValues.checkVictem === 0 && masterNameValues.checkOffender === 1) || masterNameValues.checkOffender === 0) {
                                                                                OnChangeSelectedReason(selectedOptions, 'NameReasonCodeID');
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>
                                                                {

                                                                    roleStatus ?

                                                                        <>
                                                                            <div className="col-3 col-md-3 col-lg-1 mt-1">
                                                                                <label htmlFor="" className='label-name '>
                                                                                    Victim Type
                                                                                    {errors.VictimTypeError !== 'true' ? (
                                                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.VictimTypeError}</p>
                                                                                    ) : null}</label>

                                                                            </div>
                                                                            <div className="col-3 col-md-3 col-lg-2 mt-1" >
                                                                                <Select
                                                                                    name='VictimTypeID'
                                                                                    value={victimTypeDrp?.filter((obj) => obj.value === masterNameValues?.VictimTypeID)}
                                                                                    styles={roleStatus ? Requiredcolour : ''}
                                                                                    isClearable
                                                                                    options={victimTypeDrp}
                                                                                    onChange={(e) => { ChangeDropDownVictimType(e, 'VictimTypeID'); }}
                                                                                    placeholder="Select.."
                                                                                    menuPlacement="top"
                                                                                />
                                                                            </div>
                                                                        </>


                                                                        :
                                                                        <></>
                                                                }




                                                            </>

                                                    }
                                                </div>
                                            </fieldset>


                                            {
                                                nameTypeCode !== "B" &&
                                                <fieldset >
                                                    <legend style={{ fontWeight: 'bold' }}>SSN/DL Info</legend>
                                                    <div className="col-12 col-md-12 col-lg-12 ">
                                                        <div className="row ">
                                                            <div className="col-3 col-md-2 col-lg-1 mt-2 ">
                                                                <label htmlFor="" className='new-label '>SSN
                                                                    {errors.SsnNoError !== 'true' ? (
                                                                        <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.SsnNoError}</p>
                                                                    ) : null}
                                                                </label>
                                                            </div>
                                                            <div className="col-3 col-md-4 col-lg-2 text-field mt-1" >
                                                                <input type="text"
                                                                    maxLength={9} onChange={HandleChange} name='SSN' value={masterNameValues?.SSN} required autoComplete='off' />

                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-5 d-flex " >
                                                                <div className="col-2 col-md-2 col-lg-3 mt-2">
                                                                    <label htmlFor="" className='new-label '>State/DL#</label>
                                                                </div>
                                                                <div className="col-3 col-md-5 col-lg-5 mt-1">
                                                                    <Select
                                                                        name='DLStateID'
                                                                        value={dlStateDrpData?.filter((obj) => obj.value === masterNameValues?.DLStateID)}
                                                                        options={dlStateDrpData}
                                                                        onChange={(e) => ChangeDropDown(e, 'DLStateID')}
                                                                        isClearable
                                                                        placeholder="State"
                                                                        styles={customStylesWithOutColor}
                                                                        menuPlacement="top"
                                                                    />
                                                                </div>
                                                                <span className='dash-name mt-1' >__{errors.DLNumberError !== 'true' ? (
                                                                    <p style={{ color: 'red', fontSize: '9px', margin: '0px', padding: '0px' }}>{errors.DLNumberError}</p>
                                                                ) : null}</span>
                                                                <div className="col-3 col-md-5 col-lg-4 text-field mt-2" >
                                                                    <input
                                                                        type="text"
                                                                        style={{ textTransform: "uppercase" }}
                                                                        value={masterNameValues?.DLNumber}
                                                                        maxLength={15}
                                                                        className={masterNameValues?.DLStateID ? 'requiredColor' : 'readonlyColor'}
                                                                        onChange={HandleChange}
                                                                        name="DLNumber"
                                                                        required
                                                                        autoComplete='off'
                                                                        disabled={masterNameValues?.DLStateID ? false : true}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                                <label htmlFor="" className='new-label '>How Verify</label>
                                                            </div>
                                                            <div className="col-10 col-md-4 col-lg-3 mt-1">
                                                                <Select
                                                                    name='VerifyID'
                                                                    value={verifyIdDrp?.filter((obj) => obj.value === masterNameValues?.VerifyID)}
                                                                    onChange={(e) => ChangeDropDown(e, 'VerifyID')}
                                                                    options={verifyIdDrp}
                                                                    isClearable
                                                                    placeholder="Verify ID"
                                                                    styles={customStylesWithOutColor}
                                                                    isDisabled={!masterNameValues?.DLStateID}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            }



                                            <fieldset>
                                                <legend style={{ fontWeight: 'bold' }}>Contact Info</legend>
                                                <div className="row">
                                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                        <label htmlFor="" className='new-label '>Contact Type</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                        <Select
                                                            name='PhoneTypeID'
                                                            value={phoneTypeIdDrp?.filter((obj) => obj.value === masterNameValues?.PhoneTypeID)}
                                                            options={phoneTypeIdDrp}
                                                            onChange={(e) => ChangePhoneType(e, 'PhoneTypeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            disabled={phoneTypeCode ? false : true}
                                                            styles={customStylesWithOutColor}
                                                            menuPlacement="top"
                                                        />
                                                    </div>
                                                    <div className="col-1 col-md-2 col-lg-1 mt-2">
                                                        <label htmlFor="" className='new-label '>Contact{errors.ContactError !== 'true' ? (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
                                                        ) : null}
                                                        </label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                        <input type="text"
                                                            maxLength={phoneTypeCode !== 'E' ? 10 : ''} className={masterNameValues?.PhoneTypeID ? 'requiredColor' : 'readonlyColor'}
                                                            name='Contact' value={masterNameValues?.Contact} onChange={HandleChange} required disabled={masterNameValues?.PhoneTypeID ? false : true} autoComplete='off' />
                                                    </div>
                                                    <div className="col-3 col-md-1 col-lg-1  pt-1 ">
                                                        {
                                                            phoneTypeCode !== 'E' ?
                                                                <div className="form-check ">
                                                                    <input className="form-check-input"
                                                                        onChange={HandleChange}
                                                                        type="checkbox"
                                                                        name='IsUnListedPhNo'
                                                                        value={masterNameValues?.IsUnListedPhNo}
                                                                        checked={masterNameValues?.IsUnListedPhNo}
                                                                        disabled={!masterNameValues?.Contact ? true : false}
                                                                        id="flexCheckDefault2" />
                                                                    <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                                        Unlisted
                                                                    </label>
                                                                </div> : <></>
                                                        }

                                                    </div>


                                                </div>
                                            </fieldset>
                                        </div>

                                    }

                                    {/* General */}
                                    {nameShowPage === 'General' && <MasterGeneral {...{ possessionID, mstPossessionID, type, complainNameID, ownerOfID, loginAgencyID, loginPinID, type }} />}
                                    {/* Appearance */}
                                    {nameShowPage === 'Appearance' && <MasterAppearance {...{ possessionID, mstPossessionID, type, complainNameID, ownerOfID, loginAgencyID, loginPinID, type }} />}
                                    {/* aliases */}
                                    {nameShowPage === 'aliases' && <MasterAliases {...{ possessionID, mstPossessionID, type, ownerOfID, complainNameID, loginAgencyID, loginPinID }} />}
                                    {/* SMT */}
                                    {nameShowPage === 'SMT' && <MasterSmt {...{ possessionID, mstPossessionID, ownerOfID, type, loginAgencyID, complainNameID, loginPinID }} />}
                                    {/* Identification_Number */}
                                    {nameShowPage === 'Identification_Number' && <MasterIdentificationNumber {...{ possessionID, type, mstPossessionID, complainNameID, ownerOfID, loginAgencyID, loginPinID }} />}
                                    {/* Contact_Details */}
                                    {nameShowPage === 'Contact_Details' && <MasterContactDetails {...{ possessionID, mstPossessionID, type, ownerOfID, complainNameID, loginAgencyID, loginPinID }} />}
                                    {/* Address */}
                                    {nameShowPage === 'Address' && <MasterAddress {...{ possessionID, mstPossessionID, ownerOfID, loginAgencyID, type, complainNameID, loginPinID }} />}
                                    {/* Offence */}






                                </div>

                                <div className=" text-right col-12  mb-1">
                                    {
                                        type === "VehicleOwner" && nameShowPage === 'home' ?
                                            <>
                                                {
                                                    ownerOfID && mstPossessionID ?
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Update</button>
                                                        :
                                                        <>
                                                            <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
                                                            <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); setsaveContinueStatus(true) }}>Save & Continue</button>
                                                        </>
                                                }
                                                <button type="button" onClick={() => { setStatusFalse(); Reset(); }} data-dismiss="modal" className="btn btn-sm btn-success mr-1 mt-2"  >Close</button>
                                            </>
                                            :
                                            <>

                                            </>

                                    }

                                    {
                                        nameShowPage === 'home' && (type !== "ComplainantName") && (type !== "Victim") && (type !== "VehicleOwner") && ((type !== "ArrestParentMod")) ? <>
                                            {
                                                possessionID && mstPossessionID ?
                                                    <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Update</button>
                                                    :
                                                    <>
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} ref={saveButtonRef}>Save</button>
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); setsaveContinueStatus(true) }} ref={saveAndContRef}>Save & Continue</button>
                                                    </>
                                            }
                                            <button type="button" onClick={() => setStatusFalse()} data-dismiss="modal" className="btn btn-sm btn-success mr-1 mt-2" ref={closeButtonRef}>Close</button>
                                        </>
                                            :
                                            <></>
                                    }

                                    {
                                        nameShowPage === 'home' && (type === "ComplainantName") && <>
                                            {
                                                complainNameID ?
                                                    <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Update</button>
                                                    :
                                                    <>
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} ref={saveButtonRef}>Save</button>
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); setsaveContinueStatus(true) }} ref={saveAndContRef}>Save & Continue</button>
                                                    </>
                                            }
                                            <button type="button" onClick={() => setStatusFalse()} data-dismiss="modal" className="btn btn-sm btn-success mr-1 mt-2" ref={closeButtonRef}>Close</button>
                                        </>
                                    }
                                    {
                                        nameShowPage === 'home' && (type === "ArrestParentMod") && <>
                                            {
                                                ArrestparentID ?
                                                    <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Update</button>
                                                    :
                                                    <>
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} ref={saveButtonRef}>Save</button>
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); setsaveContinueStatus(true) }} ref={saveAndContRef}>Save & Continue</button>
                                                    </>
                                            }
                                            <button type="button" onClick={() => setStatusFalse()} data-dismiss="modal" className="btn btn-sm btn-success mr-1 mt-2" ref={closeButtonRef}>Close</button>
                                        </>
                                    }

                                    {
                                        nameShowPage === 'home' && (type === "Victim") && <>
                                            {
                                                possessionIDVictim ?
                                                    <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Update</button>
                                                    :
                                                    <>
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); }} ref={saveButtonRef}>Save</button>
                                                        <button type="button" className="btn btn-sm btn-success mt-2  mr-1" onClick={() => { check_Validation_Error(); setsaveContinueStatus(true) }} ref={saveAndContRef}>Save & Continue</button>
                                                    </>
                                            }
                                            <button type="button" onClick={() => setStatusFalse()} data-dismiss="modal" className="btn btn-sm btn-success mr-1 mt-2" ref={closeButtonRef}>Close</button>
                                        </>
                                    }


                                </div>
                            </div>
                        </div>
                    </div >
                    <NameSearchModal {...{ setMasterNameSearchModal, type, GetReasonIdDrp, setNameTypeCode, masterNameSearchModal, setValue, value, mainIncidentID, nameSearchValue, setmasterNameValues, masterNameValues, setDobDate, setUpdateStatus, updateStatus, Reset, setMultiSelected, }} />
                </>
            }
            <MasterChangesModal func={check_Validation_Error} />
        </>
    )
}

export default memo(MasterNameModel)
