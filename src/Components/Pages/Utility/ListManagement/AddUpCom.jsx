import React, { useState, useEffect, useCallback, memo } from 'react';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { RequiredField, RequiredFieldIncident, Space_Not_Allow } from '../Personnel/Validation';
import makeAnimated from "react-select/animated";
import SelectBox from '../../../Common/SelectBox';
import Select, { components } from 'react-select';
import { CommanchangeArrayFormat_WithFilter, Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';

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

const animatedComponents = makeAnimated()

const AddUpCom = (props) => {

    const { loginPinID, isSuperadmin, loginAgencyID, col1, col3, modal, setModal, openPage, addUrl, get_data, status, singleDataUrl, id, updateStatus, upUrl, listData } = props

    const [agencyData, setAgencyData] = useState([])
    const [firstDropDownValue, setFirstDropDownValue] = useState([])
    const [smtDropDownValue, setSmtDropDownValue] = useState([])
    const [vehicalModalDownValue, setVehicalModalDownValue] = useState([])
    const [proNameReaDrpValue, setProNameReaDrpValue] = useState([])
    const [propertyDesValue, setPropertyDesValue] = useState([])
    const [nameReasonDrpDwnVal, setNameReasonDrpDwnVal] = useState([])
    const [contactTypeDrpVal, setContactTypeDrpVal] = useState([]);
    const [warrantTypeDrpdown, setWarrantTypeDrpdown] = useState([]);
    const [editval, setEditval] = useState([]);

    const [value, setValue] = useState({
        [col1]: '', [col3]: '', "Description": '', 'IsActive': '', 'CreatedByUserFK': '',
        'ModifiedByUserFK': '', 'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name': '', 'AgencyCode': '',
        // Color List Fields
        'IsHair': '', 'IsEye': '', 'IsEditable': 1, 'Abbreviation': '', 'IDMOCode': '', 'InterfaceCode': '', 'NjEyeColor': '', 'NjVehicleColor': '', 'IsStandard': '', 'IsNjETicketEye': '', 'IsNjETicketVehicle': '',
        'IsTop': '', 'IsBottom': '', 'IsPrimary': '', 'IsSecondary': '',
        // Court Name Fields
        'IsNjeTicket': '', 'IsSpinalResearch': '', 'IsJointCourt': '', 'IsCitation': '', 'IsDefault': '', 'Hours': '', 'Administrator': '', 'Judge': '', 'Municipality': '', 'Phone2': '', 'CountryCode': '', 'PhoneNumber': '', 'Address': '', 'ZipId': '', 'CityId': '', 'StateId': '',
        // FBI Code Field
        'IsCrimeAgains_Person': '', 'IsCrimeAgainstProperty': '', 'IsCrimeAgainstSociety': '', 'FederalSpecificFBICode': '', 'NIBRSSeq': '', 'IsCrimeForTicket': '', 'IsDomesticViolence': '', 'IsCriminalActivityRequired': '', 'IsUcrArson': '', 'IsGangInvolved': '', 'IsCrimeForSexOffender': '',
        'StateSpecificFbicode': '',
        // Property Vehicle Style Field
        'PropertyDescID': '', 'PropertyDescName': '',
        // SMT Location Fields
        'SMTTypeID': '', 'SMTTypeName': '', 'NIBRSCode': '', 'StatusCode': '',
        // Warrant Ori
        'ORINumber': '',
        // Vehical Modal Fields
        'PropertyVehicleMakeID': '', 'PropertyWeaponMakeName': '',
        // Resident Field
        'ArrestResidentCode': '',
        // Property vehical plate
        'InterfaceSpecificVehicleType': '',
        // Contact Phone Type
        'IsEMail': '', 'IsPhone': '', 'ContactTypeID': '', 'ContactTypeIDName': '',
        // Property Reason Code
        'PropRecType': '', 'PropType': '', 'IsDrugReason': '', 'IsBoatReason': '', 'IsOtherReason': '', 'IsArticleReason': '',
        'IsAlert': '', 'IsVehicleReason': '', 'IsForParkingCitation': '', 'IsGunReason': '', 'IsSecurityReason': '',
        // Property Classification Fields
        'PropertyDesName': '', 'IsTicket': '',
        // Race Type Fields
        'InterfaceSpecificRaceCode': '',
        // Property Description Fields
        'UCRType': '', 'IsForParkingPermit': '', 'IsForTicket': '', 'CategoryID': '', 'CategoryIDName': '',
        //Condition Type
        //Type of Victim
        'IsBusiness': '', 'IsPerson': '',
        //Handicap Type
        'IsMental': '',
        //Resident
        'IsArrest': '',
        // Name Reason Code
        'IsArrestName': '', 'IsJuvenileArrest': '', 'IsChildCustody': '', 'IsVictimName': '', 'IsWitnessName': '', 'IsOffenderName': '', 'IsMissingPerson': '',
        'CategoryName': '',
        //Incident Disposition
        'IsCADCfsCode': '',
        // Weapon Type
        'IsWeapon': '',
        'IsAuto': '',
        'IsChargeWeapon': '',
        'IsFirearm': '',

        // -----------Warrant Classification----------
        'WarrantTypeID': '', 'WarrantTypeIDName': '',
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'CodeError': '',
        'DescriptionError': '',
    })

    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })

    useEffect(() => {
        if (agencyData?.length === 0) {
            if (loginPinID && loginAgencyID) {
                getAgency(loginAgencyID, loginPinID);
                setValue({ ...value, 'CreatedByUserFK': loginPinID, })
            }
        }
    }, [loginPinID, loginAgencyID])

    useEffect(() => {
        if (openPage === 'Property Vehicle Style') {
            getFirstDropDownValue('PropertyDescriptionCodes/GetDataDropDown_PropertyDescriptionCodes', loginAgencyID)
        }
        if (openPage === 'SMT Location') {
            getSMTLocationDropDownValue('SMTTypes/GetDataDropDown_SMTTypes', loginAgencyID);
        }
        if (openPage === 'Property Vehicle Model') {
            getVehicalModalDropDownValue('PropertyVehicleMake/GetDataDropDown_PropertyVehicleMake', loginAgencyID);
        }
        if (openPage === 'Property Classification') {
            getPropertyDesDropDownValue('PropertyCategory/GetDataDropDown_PropertyCategory', loginAgencyID);
        }
        if (openPage === 'Property Description') {
            getProNameReaDropDownValue('PropertyCategory/GetDataDropDown_PropertyCategory', loginAgencyID);
        }
        if (openPage === 'Name Reason Code') {
            getNameResonDrpDwnVal('NameType/GetDataDropDown_NameType', loginAgencyID);
        }
        if (openPage === 'Contact Phone Type') {
            getContactTypeIDDrpDwnVal('ContactType/GetDataDropDown_ContactType', loginAgencyID);
        }
        // -----------Warrant Classification----------
        if (openPage === 'Warrant Classification') {
            getWarrantTypeDropDownValue('WarrantType/GetDataDropDown_WarrantType', loginAgencyID);
        }
    }, [status, loginPinID, loginAgencyID])

    useEffect(() => {
        if (id) {
            GetSingleData()
        }
    }, [id, updateStatus])

    const GetSingleData = () => {
        const val = { [col3]: id }
        fetchPostData(singleDataUrl, val)
            .then((res) => {

                if (res) setEditval(res)
                else setEditval([])
            })
    }

    useEffect(() => {
        if (status && editval.length > 0) {
            setValue({
                ...value,
                "IsActive": editval[0]?.IsActive, 'AgencyCode': editval[0]?.AgencyCode,
                [col1]: editval[0][col1],
                "Description": editval[0]?.Description,
                'AgencyId': editval[0]?.AgencyID,
                [col3]: editval[0][col3], 'MultiAgency_Name': editval[0]?.MultiAgency_Name,
                'AgencyName': editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(editval[0]?.MultipleAgency) : '',
                'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID,
                // Color fields  
                'IsHair': editval[0]?.IsHair, 'IsEye': editval[0]?.IsEye, 'IsEditable': editval[0]?.IsEditable === '0' ? false : true,
                'Abbreviation': editval[0]?.Abbreviation, 'IDMOCode': editval[0]?.IDMOCode, 'InterfaceCode': editval[0]?.InterfaceCode, 'NjEyeColor': editval[0]?.NjEyeColor, 'NjVehicleColor': editval[0]?.NjVehicleColor, 'IsStandard': editval[0]?.IsStandard, 'IsNjETicketEye': editval[0]?.IsNjETicketEye, 'IsNjETicketVehicle': editval[0]?.IsNjETicketVehicle,
                'IsBottom': editval[0]?.IsBottom, 'IsTop': editval[0]?.IsTop, 'IsPrimary': editval[0]?.IsPrimary, 'IsSecondary': editval[0]?.IsSecondary,
                // Court Name Fields
                'IsNjeTicket': editval[0]?.IsNjeTicket, 'IsSpinalResearch': editval[0]?.IsSpinalResearch, 'IsJointCourt': editval[0]?.IsJointCourt, 'IsCitation': editval[0]?.IsCitation, 'IsDefault': editval[0]?.IsDefault, 'Hours': editval[0]?.Hours, 'Administrator': editval[0]?.Administrator, 'Judge': editval[0]?.Judge, 'Municipality': editval[0]?.Municipality, 'Phone2': editval[0]?.Phone2, 'CountryCode': editval[0]?.CountryCode, 'PhoneNumber': editval[0]?.PhoneNumber, 'Address': editval[0]?.Address, 'ZipId': editval[0]?.ZipId, 'CityId': editval[0]?.CityId, 'StateId': editval[0]?.StateId,

                // FBI Code Field
                'IsCrimeAgains_Person': editval[0]?.IsCrimeAgains_Person, 'IsCrimeAgainstProperty': editval[0]?.IsCrimeAgainstProperty, 'IsCrimeAgainstSociety': editval[0]?.IsCrimeAgainstSociety, 'FederalSpecificFBICode': editval[0]?.FederalSpecificFBICode, 'NIBRSSeq': editval[0]?.NIBRSSeq, 'IsCrimeForTicket': editval[0]?.IsCrimeForTicket, 'IsDomesticViolence': editval[0]?.IsDomesticViolence, 'IsCriminalActivityRequired': editval[0]?.IsCriminalActivityRequired, 'IsUcrArson': editval[0]?.IsUcrArson, 'IsGangInvolved': editval[0]?.IsGangInvolved, 'IsCrimeForSexOffender': editval[0]?.IsCrimeForSexOffender,
                'StateSpecificFbicode': editval[0]?.StateSpecificFbicode,
                // Property Vehicle Style Field
                'PropertyDescID': editval[0]?.PropertyDescID, 'PropertyDescName': editval[0]?.PropertyDescID ? changeArrayFormat_WithFilter(editval, 'SMTLocation', firstDropDownValue) : '',
                // SMT Location Fields
                'SMTTypeID': editval[0]?.SMTTypeID, 'SMTTypeName': editval[0]?.SMTTypeID ? changeArrayFormat_WithFilter(editval, 'SMTSecLocation', smtDropDownValue) : '', 'NIBRSCode': editval[0]?.NIBRSCode, 'StatusCode': editval[0]?.StatusCode,
                // Warrant Ori
                'ORINumber': editval[0]?.ORINumber,
                // Vehical Modal Fields
                'PropertyVehicleMakeID': editval[0]?.PropertyVehicleMakeID, 'PropertyWeaponMakeName': editval[0]?.PropertyVehicleMakeID ? changeArrayFormat_WithFilter(editval, 'VehicalModal', vehicalModalDownValue) : '',
                // Resident Field
                'ArrestResidentCode': editval[0]?.ArrestResidentCode,
                // Property vehical plate
                'InterfaceSpecificVehicleType': editval[0]?.InterfaceSpecificVehicleType,
                // Property Reason Code
                'PropRecType': editval[0]?.PropRectype, 'PropType': editval[0]?.PropType, 'IsForTicket': editval[0]?.IsForTicket, 'IsDrugReason': editval[0]?.IsDrugReason,
                'IsBoatReason': editval[0]?.IsBoatReason, 'IsOtherReason': editval[0]?.IsOtherReason, 'IsArticleReason': editval[0]?.IsArticleReason,
                'IsAlert': editval[0]?.IsAlert, 'IsVehicleReason': editval[0]?.IsVehicleReason,
                'IsForParkingPermit': editval[0]?.IsForParkingPermit, 'IsGunReason': editval[0]?.IsGunReason, 'IsSecurityReason': editval[0]?.IsSecurityReason,
                // Property Classification Fields
                'PropertyDesName': editval[0]?.PropertyDescID ? changeArrayFormat_WithFilter(editval, 'PropertyDesVal', propertyDesValue) : '', 'IsTicket': editval[0]?.IsTicket,
                // Property Description Fields
                'UCRType': editval[0]?.UCRType, 'IsForParkingCitation': editval[0]?.IsForParkingCitation,
                'CategoryID': editval[0]?.CategoryID, 'CategoryIDName': editval[0]?.CategoryID ? changeArrayFormat_WithFilter(editval, 'PropNamResVal', proNameReaDrpValue) : '',
                // Contact Phone Type
                'IsEMail': editval[0]?.IsEMail, 'IsPhone': editval[0]?.IsPhone,
                'ContactTypeID': editval[0]?.ContactTypeID,
                'ContactTypeIDName': editval[0]?.ContactTypeID ? CommanchangeArrayFormat_WithFilter(editval, 'ContactTypeID', contactTypeDrpVal) : '',
                // Race Type Fields
                'InterfaceSpecificRaceCode': editval[0]?.InterfaceSpecificRaceCode,
                //Condition Type or Handicap Type
                'IsMental': editval[0]?.IsMental,
                //Type of Victim
                'IsBusiness': editval[0]?.IsBusiness,
                'IsPerson': editval[0]?.IsPerson,
                //Resident
                'IsArrest': editval[0]?.IsArrest,
                // Name Reason Code
                'IsArrestName': editval[0]?.IsArrestName, 'IsJuvenileArrest': editval[0]?.IsJuvenileArrest, 'IsChildCustody': editval[0]?.IsChildCustody, 'IsVictimName': editval[0]?.IsVictimName, 'IsWitnessName': editval[0]?.IsWitnessName, 'IsOffenderName': editval[0]?.IsOffenderName, 'IsMissingPerson': editval[0]?.IsMissingPerson,
                'CategoryName': editval[0]?.CategoryID ? changeArrayFormat_WithFilter(editval, 'NamResVal', nameReasonDrpDwnVal) : '',
                //Incident Disposition
                'IsCADCfsCode': editval[0]?.IsCADCfsCode,
                // Contact Phone Type
                'IsWeapon': editval[0]?.IsWeapon, 'IsAuto': editval[0]?.IsAuto, 'IsChargeWeapon': editval[0]?.IsChargeWeapon, 'IsFirearm': editval[0]?.IsFirearm,

                // -----------Warrant Classification----------

                'WarrantTypeID': editval[0]?.WarrantTypeID,
                'WarrantTypeIDName': editval[0]?.WarrantTypeID ? CommanchangeArrayFormat_WithFilter(editval, 'WarrantTypeID', warrantTypeDrpdown) : '',

            });
            setMultiSelected({
                optionSelected: editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(editval[0]?.MultipleAgency
                ) : '',
            });
        }
        else {
            setValue({
                ...value,
                [col1]: '', [col3]: '', "Description": '', 'IsActive': '', 'ModifiedByUserFK': '', 'AgencyName': '', 'MultiAgency_Name': '', 'AgencyCode': '',
                // Color List Fields
                'IsHair': '', 'IsEye': '', 'IsEditable': 0, 'Abbreviation': '', 'IDMOCode': '', 'InterfaceCode': '', 'NjEyeColor': '', 'NjVehicleColor': '', 'IsStandard': '', 'IsNjETicketEye': '', 'IsNjETicketVehicle': '',
                'IsTop': '', 'IsBottom': '', 'IsPrimary': '', 'IsSecondary': '',
                // Court Name Fields
                'IsNjeTicket': '', 'IsSpinalResearch': '', 'IsJointCourt': '', 'IsCitation': '', 'IsDefault': '', 'Hours': '', 'Administrator': '', 'Judge': '', 'Municipality': '', 'Phone2': '', 'CountryCode': '', 'PhoneNumber': '', 'Address': '', 'ZipId': '', 'CityId': '', 'StateId': '',
                // FBI Code Field
                'StateSpecificFbicode': '', 'IsCrimeAgains_Person': '', 'IsCrimeAgainstProperty': '', 'IsCrimeAgainstSociety': '', 'FederalSpecificFBICode': '', 'NIBRSSeq': '', 'IsCrimeForTicket': '', 'IsDomesticViolence': '', 'IsCriminalActivityRequired': '', 'IsUcrArson': '', 'IsGangInvolved': '', 'IsCrimeForSexOffender': '',
                // Property Vehicle Style Field
                'PropertyDescID': '', 'PropertyDescName': '',
                // SMT Location Fields
                'SMTTypeID': '', 'SMTTypeName': '', 'NIBRSCode': '', 'StatusCode': '',
                // Warrant Ori
                'ORINumber': '',
                // Vehical Modal Fields
                'PropertyVehicleMakeID': '', 'PropertyWeaponMakeName': '',
                // Resident Field
                'ArrestResidentCode': '',
                // Property vehical plate
                'InterfaceSpecificVehicleType': '',
                //Property Reason Code
                'PropRecType': '', 'PropType': '', 'IsForTicket': '', 'IsDrugReason': '', 'IsBoatReason': '', 'IsOtherReason': '', 'IsArticleReason': '',
                'IsAlert': '', 'IsVehicleReason': '', 'IsForParkingPermit': '', 'IsGunReason': '', 'IsSecurityReason': '',
                // Property Classification Fields
                'PropertyDesName': '', 'IsTicket': '',
                // Property Description Fields
                'UCRType': '', 'IsForParkingCitation': '', 'CategoryID': '', 'CategoryIDName': '',
                // Contact Phone Type
                'IsEMail': '', 'IsPhone': '', 'ContactTypeID': '', 'ContactTypeIDName': '',
                // Race Type Fields
                'InterfaceSpecificRaceCode': '',
                //Condition Type or Handicap Type
                'IsMental': '',
                //Type of Victim
                'IsBusiness': '',
                'IsPerson': '',
                //Resident
                'IsArrest': '',
                // Name Reason Code
                'IsArrestName': '', 'IsJuvenileArrest': '', 'IsChildCustody': '', 'IsVictimName': '', 'IsWitnessName': '', 'IsOffenderName': '', 'IsMissingPerson': '',
                'CategoryName': '',
                //Incident Disposition
                'IsCADCfsCode': '',
                // Contact Phone Type
                'IsWeapon': '', 'IsAuto': '', 'IsChargeWeapon': '', 'IsFirearm': '',

                // -----------Warrant Classification----------
                'WarrantTypeID': '', 'WarrantTypeIDName': '',
            }); setMultiSelected({ optionSelected: null })
        }
    }, [editval, status])

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            closeModal()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const getAgency = async (loginAgencyID, loginPinID) => {
        const value = {
            AgencyID: loginAgencyID,
            PINID: loginPinID,
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData([]);
            }
        })
    }

    const getFirstDropDownValue = (url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(url, val).then((data) => {
            if (data) {
                setFirstDropDownValue(changeArrayFormat(data, 'SMTLocation'))
            } else {
                setFirstDropDownValue([]);
            }
        })
    }

    const getVehicalModalDropDownValue = (url, loginAgencyID, PropertyVehicleMakeID) => {
        const val = {
            PropertyVehicleMakeID: PropertyVehicleMakeID,
            AgencyID: loginAgencyID,
        }
        fetchPostData(url, val).then((data) => {
            if (data) {
                setVehicalModalDownValue(Comman_changeArrayFormat(data, 'PropertyVehicleMakeID', 'Description'))
            } else {
                setVehicalModalDownValue([]);
            }
        })
    }

    const getSMTLocationDropDownValue = (url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(url, val).then((data) => {
            if (data) {
                setSmtDropDownValue(changeArrayFormat(data, 'SMTSecLocation'))
            } else {
                setSmtDropDownValue([]);
            }
        })
    }

    const getPropertyDesDropDownValue = (url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(url, val).then((data) => {
            if (data) {

                setPropertyDesValue(changeArrayFormat(data, 'PropertyDesVal',))
            } else {
                setPropertyDesValue([]);
            }
        })
    }

    const getProNameReaDropDownValue = (url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(url, val).then((data) => {
            if (data) {
                setProNameReaDrpValue(changeArrayFormat(data, 'PropNamResVal'))
            } else {
                setProNameReaDrpValue([]);
            }
        })
    }

    const getNameResonDrpDwnVal = (url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(url, val).then((data) => {
            if (data) {
                setNameReasonDrpDwnVal(changeArrayFormat(data, 'NamResVal'))
            } else {
                setNameReasonDrpDwnVal([]);
            }
        })
    }

    const getContactTypeIDDrpDwnVal = (url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(url, val).then((data) => {
            if (data) {

                setContactTypeDrpVal(Comman_changeArrayFormat(data, 'ContactTypeID', 'Description'))
            } else {
                setContactTypeDrpVal([]);
            }
        })
    }

    // -----------Warrant Classification----------
    const getWarrantTypeDropDownValue = (url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(url, val).then((data) => {
            if (data) {
                setWarrantTypeDrpdown(changeArrayFormat(data, 'WarrentVal'))
            } else {
                setWarrantTypeDrpdown([]);
            }
        })
    }

    const handlChanges = (e) => {
        // Color List
        if (e.target.name === 'IsEye' || e.target.name === 'IsHair' || e.target.name === 'IsStandard' || e.target.name === 'IsNjETicketEye' || e.target.name === 'IsNjETicketVehicle' || e.target.name === 'IsBottom' || e.target.name === 'IsTop' || e.target.name === 'IsSecondary' || e.target.name === 'IsPrimary' || e.target.name === 'IsEditable' ||
            // Court Name 
            e.target.name === 'IsNjeTicket' || e.target.name === 'IsSpinalResearch' || e.target.name === 'IsJointCourt' || e.target.name === 'IsCitation' || e.target.name === 'IsDefault' ||
            // FBI Code
            e.target.name === 'IsCrimeAgainstProperty' || e.target.name === 'IsCrimeAgains_Person' || e.target.name === 'IsCrimeAgainstSociety' || e.target.name === 'IsCrimeForTicket' || e.target.name === 'IsDomesticViolence' || e.target.name === 'IsCriminalActivityRequired' || e.target.name === 'IsUcrArson' || e.target.name === 'IsGangInvolved' || e.target.name === 'IsCrimeForSexOffender' ||
            // property Reason Code
            e.target.name === 'IsForTicket' || e.target.name === 'IsDrugReason' ||
            e.target.name === 'IsBoatReason' || e.target.name === 'IsOtherReason' || e.target.name === 'IsArticleReason' ||
            e.target.name === 'IsVehicleReason' || e.target.name === 'IsForParkingCitation' || e.target.name === 'IsGunReason' || e.target.name === 'IsSecurityReason' || e.target.name === 'IsForParkingPermit' ||
            //Contact Phone Type
            e.target.name === 'IsEMail' || e.target.name === 'IsPhone' ||
            //Type of Victim
            e.target.name === 'IsBusiness' || e.target.name === 'IsPerson' ||
            //Condition Type or Handicap Type
            e.target.name === 'IsMental' ||
            //Resident
            e.target.name === 'IsArrest' ||
            // Name Reason Code
            e.target.name === 'IsArrestName' || e.target.name === 'IsJuvenileArrest' || e.target.name === 'IsChildCustody' || e.target.name === 'IsVictimName' || e.target.name === 'IsWitnessName' || e.target.name === 'IsAlert' || e.target.name === 'IsOffenderName' || e.target.name === 'IsMissingPerson' ||
            //Incident Disposition
            e.target.name === 'IsCADCfsCode' ||
            //Property Classification Fields
            e.target.name === 'IsTicket' ||
            // Contact Phone Type
            e.target.name === 'IsWeapon' || e.target.name === 'IsAuto' || e.target.name === 'IsChargeWeapon' || e.target.name === 'IsFirearm'
        ) {
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const changeDropDownFirst = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

    const Agencychange = (multiSelected) => {
        setMultiSelected({ optionSelected: multiSelected });
        const id = []
        const name = []
        if (multiSelected) {
            multiSelected.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyId']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    }

    const reset = () => {
        setValue({
            ...value,
            [col1]: '', [col3]: '', "Description": '', 'IsActive': '', 'ModifiedByUserFK': '', 'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name': '', 'AgencyCode': '',
            // contect phone type
            'IsEMail': '', 'IsPhone': '', 'ContactTypeID': '', 'ContactTypeIDName': '',
            // Color List Fields
            'IsHair': '', 'IsEye': '', 'IsEditable': 0, 'Abbreviation': '', 'IDMOCode': '', 'InterfaceCode': '', 'NjEyeColor': '', 'NjVehicleColor': '', 'IsStandard': '', 'IsNjETicketEye': '', 'IsNjETicketVehicle': '', 'IsTop': "", 'IsBottom': "", 'IsPrimary': '', 'IsSecondary': '',
            // Court Name Fields
            'IsNjeTicket': '', 'IsSpinalResearch': '', 'IsJointCourt': '', 'IsCitation': '', 'IsDefault': '', 'Hours': '', 'Administrator': '', 'Judge': '', 'Municipality': '', 'Phone2': '', 'CountryCode': '', 'PhoneNumber': '', 'Address': '', 'ZipId': '', 'CityId': '', 'StateId': '',
            // FBI Code Field
            'StateSpecificFbicode': '', 'IsCrimeAgains_Person': '', 'IsCrimeAgainstProperty': '', 'IsCrimeAgainstSociety': '', 'FederalSpecificFBICode': '', 'NIBRSSeq': '', 'IsCrimeForTicket': '', 'IsDomesticViolence': '', 'IsCriminalActivityRequired': '', 'IsUcrArson': '', 'IsGangInvolved': '', 'IsCrimeForSexOffender': '',
            // Property Vehicle Style Field
            'PropertyDescID': '', 'PropertyDescName': '',
            // SMT Location Fields
            'SMTTypeID': '', 'SMTTypeName': '', 'NIBRSCode': '', 'StatusCode': '',
            // Warrant Ori
            'ORINumber': '',
            // Vehical Modal Fields
            'PropertyVehicleMakeID': '', 'PropertyWeaponMakeName': '',
            // Resident Field
            'ArrestResidentCode': '',
            // Property vehical plate
            'InterfaceSpecificVehicleType': '',
            // Property Reason Code
            'PropRecType': '', 'PropType': '', 'IsDrugReason': '', 'IsBoatReason': '', 'IsOtherReason': '', 'IsArticleReason': '',
            'IsAlert': '', 'IsVehicleReason': '', 'IsForParkingCitation': '', 'IsGunReason': '', 'IsSecurityReason': '',
            // Property Classification Fields
            'PropertyDesName': '', 'IsTicket': '',
            // Property Description Fields
            'UCRType': '', 'IsForParkingPermit': '', 'IsForTicket': '', 'CategoryID': '', 'CategoryIDName': '',
            // Race Type Fields
            'InterfaceSpecificRaceCode': '',
            //Condition Type or Handicap Type
            'IsMental': '',
            //Type of Victim
            'IsBusiness': '', 'IsPerson': '',
            //Resident
            'IsArrest': '',
            // Name Reason Code
            'IsArrestName': '', 'IsJuvenileArrest': '', 'IsChildCustody': '', 'IsVictimName': '', 'IsWitnessName': '', 'IsOffenderName': '', 'IsMissingPerson': '',
            'CategoryName': '',
            //Incident Disposition
            'IsCADCfsCode': '',
            // Contact Phone Type
            'IsWeapon': '', 'IsAuto': '', 'IsChargeWeapon': '', 'IsFirearm': '',
            // WARRANT TYPE 
            'WarrantTypeID': '', 'WarrantTypeIDName': '',
        }); setMultiSelected({ optionSelected: null })
        setErrors({
            ...errors,
            ['CodeError']: '',
            ['DescriptionError']: '',
        })
    }

    const closeModal = () => {
        reset();
        setModal(false);
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (Space_Not_Allow(value[col1])) {
            setErrors(prevValues => { return { ...prevValues, ['CodeError']: Space_Not_Allow(value[col1]) } })
        }
        if (Space_Not_Allow(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: Space_Not_Allow(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, CodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CodeError === 'true') {
            if (status) update_ListTable()
            else Add_ListTable()
        }
    }, [DescriptionError, CodeError,])

    const Add_ListTable = (e) => {
        const result = listData?.find(item => {
            if (item.Code) {
                if (item.Code.toLowerCase() === value[col1].toLowerCase()) {
                    return item.Code.toLowerCase() === value[col1].toLowerCase()
                } else return item.Code.toLowerCase() === value[col1].toLowerCase()
            }
        }
        );
        const result1 = listData?.find(item => {
            if (item.Description) {
                if (item.Description.toLowerCase() === value.Description.toLowerCase()) {
                    return item.Description.toLowerCase() === value.Description.toLowerCase()
                } else return item.Description.toLowerCase() === value.Description.toLowerCase()
            }
        });
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate(addUrl, value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['RaceError']: '' })
                setModal(false); get_data(loginAgencyID, loginPinID, isSuperadmin); reset();
            })

        }
    }

    const update_ListTable = () => {
        // console.log(value)
        const result = listData?.find(item => {
            if (item.id != value[col3]) {
                if (item.Code) {
                    if (item.Code.toLowerCase() === value[col1].toLowerCase()) {
                        return item.Code.toLowerCase() === value[col1].toLowerCase()
                    } else return item.Code.toLowerCase() === value[col1].toLowerCase()
                }
            }
        });
        const result1 = listData?.find(item => {
            if (item.id != value[col3]) {
                if (item.Description) {
                    if (item.Description.toLowerCase() === value.Description.toLowerCase()) {
                        return item.Description.toLowerCase() === value.Description.toLowerCase()
                    } else return item.Description.toLowerCase() === value.Description.toLowerCase()
                }
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate(upUrl, value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                setModal(false); get_data(loginAgencyID, loginPinID, isSuperadmin)
                reset();
            })
        }
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

    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ListModel" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>

                                            <legend style={{ fontWeight: 'bold' }}>{openPage}</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name={col1} maxLength={10} onChange={handlChanges} value={value[col1]} className='requiredColor' disabled={status && editval[0]?.IsEditable === '0' || editval[0]?.IsEditable === false ? true : false} />
                                                        <label>Code</label>
                                                        {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='AgencyCode' onChange={handlChanges} value={value.AgencyCode} />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                {/* FBI Code */}
                                                {
                                                    openPage === 'FBI Code' ?
                                                        <>
                                                            <div className="col-12 col-md-4 col-lg-8 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='FederalSpecificFBICode' onChange={handlChanges} value={value.FederalSpecificFBICode} />
                                                                    <label>Federal Specific FBI Code</label>
                                                                    {errors.FederalSpecificFBICodeError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FederalSpecificFBICodeError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-lg-6 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='StateSpecificFbicode' onChange={handlChanges} value={value.StateSpecificFbicode} />
                                                                    <label>State Specific Fbi Code</label>

                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-lg-6 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='NIBRSSeq' onChange={handlChanges} value={value.NIBRSSeq} />
                                                                    <label>TIBRS Seq</label>
                                                                    {errors.NIBRSSeqError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NIBRSSeqError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </> :
                                                        openPage === 'Resident' ?

                                                            <div className="col-12 col-md-8 col-lg-8 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='ArrestResidentCode' onChange={handlChanges} value={value.ArrestResidentCode} className='requiredColor' />
                                                                    <label>Arrest Code</label>
                                                                </div>
                                                            </div>
                                                            :
                                                            openPage === 'Property Vehicle Plate Type' ?

                                                                <div className="col-12 col-md-8 col-lg-8 mt-2">
                                                                    <div className="text-field">
                                                                        <input type="text" name='InterfaceSpecificVehicleType' onChange={handlChanges} value={value.InterfaceSpecificVehicleType} />
                                                                        <label>Interface Specific Vehicle Type</label>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <></>
                                                }
                                                <div className={`col-12 ${openPage === 'FBI Code' || openPage === 'Resident' || openPage === 'Property Vehicle Plate Type' ? ' col-md-12 col-lg-12' : 'col-md-7 col-lg-8'} mt-2`}>
                                                    <div className="text-field">
                                                        <textarea className='requiredColor' maxLength={250} name='Description' onChange={handlChanges} value={value.Description} required cols="30" rows="1" disabled={status && editval[0]?.IsEditable === '0' || editval[0]?.IsEditable === false ? true : false}></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                {/* Court Name */}
                                                {openPage === 'Court Name' ?
                                                    <>
                                                        <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='Address' onChange={handlChanges} value={value.Address} />
                                                                <label>Address</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='Municipality' onChange={handlChanges} value={value.Municipality} />
                                                                <label>Municipality</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='Judge' onChange={handlChanges} value={value.Judge} />
                                                                <label>Judge</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='Administrator' onChange={handlChanges} value={value.Administrator} />
                                                                <label>Administrator</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='Hours' onChange={handlChanges} value={value.Hours} />
                                                                <label>Hours</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='PhoneNumber' onChange={handlChanges} value={value.PhoneNumber} />
                                                                <label>PhoneNumber</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='Phone2' onChange={handlChanges} value={value.Phone2} />
                                                                <label>Phone2</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='CountryCode' onChange={handlChanges} value={value.CountryCode} />
                                                                <label>CountryCode</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-4 col-lg-4 mt-2 dropdown__box">
                                                            <Select
                                                                name='StateId'
                                                                isMulti
                                                                isClearable
                                                                defaultValue={value?.StateId}
                                                                options=''
                                                                placeholder="Select State"
                                                            />
                                                            <label>State</label>
                                                        </div>
                                                        <div className="col-12 col-md-4 col-lg-4 mt-2 dropdown__box">
                                                            <Select
                                                                name='CityId'
                                                                isMulti
                                                                isClearable
                                                                defaultValue=''
                                                                options=''
                                                                onChange={Agencychange}
                                                                placeholder="Select City"
                                                            />
                                                            <label>City</label>
                                                        </div>
                                                        <div className="col-12 col-md-4 col-lg-4 mt-2 dropdown__box">
                                                            <Select
                                                                name='ZipId'
                                                                isMulti
                                                                isClearable
                                                                defaultValue={value?.ZipId}
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Zip"
                                                            />
                                                            <label>Zip</label>
                                                        </div>
                                                    </>
                                                    :
                                                    openPage === 'Property Description' ?

                                                        <div className="col-12 col-md-8 col-lg-6 mt-2">
                                                            <div className="text-field">
                                                                <input type="text" name='UCRType' onChange={handlChanges} value={value.UCRType} />
                                                                <label>UCR Type</label>
                                                            </div>
                                                        </div>

                                                        :
                                                        <></>
                                                }
                                                {/* Color */}
                                                {
                                                    openPage === 'Color' ?
                                                        <>
                                                            <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='Abbreviation' onChange={handlChanges} value={value.Abbreviation} />
                                                                    <label>Abbreviation</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='IDMOCode' onChange={handlChanges} value={value.IDMOCode} />
                                                                    <label>IDMO Code</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-3 col-lg-4 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='InterfaceCode' onChange={handlChanges} value={value.InterfaceCode} />
                                                                    <label>Interface Code</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='NjEyeColor' onChange={handlChanges} value={value.NjEyeColor} />
                                                                    <label>Nj Eye Color</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='NjVehicleColor' onChange={handlChanges} value={value.NjVehicleColor} />
                                                                    <label>Nj Vehicle Color</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 mt-3 ml-1">
                                                                <input type="checkbox" name="IsHair" checked={value.IsHair} value={value.IsHair}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsHair" />
                                                                <label className='ml-2' htmlFor="IsHair">Is Hair</label>
                                                            </div>
                                                            <div className="col-4 mt-3 ">
                                                                <input type="checkbox" name="IsEye" checked={value.IsEye} value={value.IsEye}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsEye" />
                                                                <label className='ml-2' htmlFor="IsEye">Is Eye</label>
                                                            </div>
                                                            <div className="col-4 mt-3">
                                                                <input type="checkbox" name="IsStandard" checked={value.IsStandard} value={value.IsStandard}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsStandard" />
                                                                <label className='ml-2' htmlFor="IsStandard">Is Standard</label>
                                                            </div>
                                                            <div className="col-4 mt-3">
                                                                <input type="checkbox" name="IsNjETicketEye" checked={value.IsNjETicketEye} value={value.IsNjETicketEye}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsNjETicketEye" />
                                                                <label className='ml-2' htmlFor="IsNjETicketEye">Is Nj E-Ticket Eye</label>
                                                            </div>
                                                            <div className="col-4 mt-3">
                                                                <input type="checkbox" name="IsNjETicketVehicle" checked={value.IsNjETicketVehicle} value={value.IsNjETicketVehicle}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsNjETicketVehicle" />
                                                                <label className='ml-2' htmlFor="IsNjETicketVehicle">Is Nj E-Ticket Vehicle</label>
                                                            </div>
                                                            <div className="col-4 mt-3">
                                                                <input type="checkbox" name="IsTop" checked={value.IsTop} value={value.IsTop}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsTop" />
                                                                <label className='ml-2' htmlFor="IsTop">Is Top</label>
                                                            </div>
                                                            <div className="col-4 mt-3">
                                                                <input type="checkbox" name="IsBottom" checked={value.IsBottom} value={value.IsBottom}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsBottom" />
                                                                <label className='ml-2' htmlFor="IsBottom">Is Bottom</label>
                                                            </div>
                                                            <div className="col-4 mt-3">
                                                                <input type="checkbox" name="IsPrimary" checked={value.IsPrimary} value={value.IsPrimary}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsPrimary" />
                                                                <label className='ml-2' htmlFor="IsPrimary">Is Primary</label>
                                                            </div>
                                                            <div className="col-4 mt-3">
                                                                <input type="checkbox" name="IsSecondary" checked={value.IsSecondary} value={value.IsSecondary}
                                                                    onChange={handlChanges}
                                                                    disabled={''}
                                                                    id="IsSecondary" />
                                                                <label className='ml-2' htmlFor="IsSecondary">Is Secondary</label>
                                                            </div>
                                                        </>
                                                        :
                                                        openPage === 'Court Name' ?
                                                            <>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsDefault" checked={value.IsDefault} value={value.IsDefault}
                                                                        onChange={handlChanges}
                                                                        id="IsDefault" />
                                                                    <label className='ml-2' htmlFor="IsDefault">Is Default</label>
                                                                </div>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsCitation" checked={value.IsCitation} value={value.IsCitation}
                                                                        onChange={handlChanges}
                                                                        id="IsCitation" />
                                                                    <label className='ml-2' htmlFor="IsCitation">Is Citation</label>
                                                                </div>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsJointCourt" checked={value.IsJointCourt} value={value.IsJointCourt}
                                                                        onChange={handlChanges}
                                                                        id="IsJointCourt" />
                                                                    <label className='ml-2' htmlFor="IsJointCourt">Is Joint Court</label>
                                                                </div>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsSpinalResearch" checked={value.IsSpinalResearch} value={value.IsSpinalResearch}
                                                                        onChange={handlChanges}
                                                                        id="IsSpinalResearch" />
                                                                    <label className='ml-2' htmlFor="IsSpinalResearch">Is Spinal Research</label>
                                                                </div>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsNjeTicket" checked={value.IsNjeTicket} value={value.IsNjeTicket}
                                                                        onChange={handlChanges}
                                                                        id="IsNjeTicket" />
                                                                    <label className='ml-2' htmlFor="IsNjeTicket">Is Nje  Ticket</label>
                                                                </div>
                                                            </>
                                                            // FBI Code
                                                            : openPage === 'FBI Code' ?
                                                                <>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsCrimeAgains_Person" checked={value.IsCrimeAgains_Person} value={value.IsCrimeAgains_Person}
                                                                            onChange={handlChanges}
                                                                            id="IsCrimeAgains_Person" />
                                                                        <label className='ml-2' htmlFor="IsCrimeAgains_Person">Is Crime Against Person</label>
                                                                    </div>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsCrimeAgainstProperty" checked={value.IsCrimeAgainstProperty} value={value.IsCrimeAgainstProperty}
                                                                            onChange={handlChanges}
                                                                            id="IsCrimeAgainstProperty" />
                                                                        <label className='ml-2' htmlFor="IsCrimeAgainstProperty">Is Crime Against Property</label>
                                                                    </div>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsCrimeAgainstSociety" checked={value.IsCrimeAgainstSociety} value={value.IsCrimeAgainstSociety}
                                                                            onChange={handlChanges}
                                                                            id="IsCrimeAgainstSociety" />
                                                                        <label className='ml-2' htmlFor="IsCrimeAgainstSociety">Is Crime Against Society</label>
                                                                    </div>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsCrimeForTicket" checked={value.IsCrimeForTicket} value={value.IsCrimeForTicket}
                                                                            onChange={handlChanges}
                                                                            id="IsCrimeForTicket" />
                                                                        <label className='ml-2' htmlFor="IsCrimeForTicket">Is Crime For Ticket</label>
                                                                    </div>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsDomesticViolence" checked={value.IsDomesticViolence} value={value.IsDomesticViolence}
                                                                            onChange={handlChanges}
                                                                            id="IsDomesticViolence" />
                                                                        <label className='ml-2' htmlFor="IsDomesticViolence">Is Domestic Violence</label>
                                                                    </div>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsCriminalActivityRequired" checked={value.IsCriminalActivityRequired} value={value.IsDomesticViolence}
                                                                            onChange={handlChanges}
                                                                            id="IsCriminalActivityRequired" />
                                                                        <label className='ml-2' htmlFor="IsCriminalActivityRequired">Is Criminal Activity Required</label>
                                                                    </div>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsUcrArson" checked={value.IsUcrArson} value={value.IsUcrArson}
                                                                            onChange={handlChanges}
                                                                            id="IsUcrArson" />
                                                                        <label className='ml-2' htmlFor="IsUcrArson">Is UCR Arson</label>
                                                                    </div>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsGangInvolved" checked={value.IsGangInvolved} value={value.IsGangInvolved}
                                                                            onChange={handlChanges}
                                                                            id="IsGangInvolved" />
                                                                        <label className='ml-2' htmlFor="IsGangInvolved">Is Gang Involved</label>
                                                                    </div>
                                                                    <div className="col-4 mt-3">
                                                                        <input type="checkbox" name="IsCrimeForSexOffender" checked={value.IsCrimeForSexOffender} value={value.IsCrimeForSexOffender}
                                                                            onChange={handlChanges}
                                                                            id="IsCrimeForSexOffender" />
                                                                        <label className='ml-2' htmlFor="IsCrimeForSexOffender">Is Crime For Sex Offender</label>
                                                                    </div>
                                                                </>
                                                                // Property Reason code
                                                                : openPage === 'Property Reason Code' ?
                                                                    <>
                                                                        <div className="col-12 col-md-8 col-lg-6 mt-2">
                                                                            <div className="text-field">
                                                                                <input type="text" name='PropRecType' onChange={handlChanges} value={value.PropRecType} />
                                                                                <label>Prop Rec Type</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 col-md-8 col-lg-6 mt-2">
                                                                            <div className="text-field">
                                                                                <input type="text" name='PropType' onChange={handlChanges} value={value.PropType} />
                                                                                <label>Prop Type</label>
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsForTicket" checked={value.IsForTicket} value={value.IsForTicket}
                                                                                onChange={handlChanges}
                                                                                id="IsForTicket" />
                                                                            <label className='ml-2' htmlFor="IsForTicket">Is For Ticket</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsForParkingCitation" checked={value.IsForParkingCitation} value={value.IsForParkingCitation}
                                                                                onChange={handlChanges}
                                                                                id="IsForParkingCitation" />
                                                                            <label className='ml-2' htmlFor="IsForParkingCitation">Is For Parking Citation</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsForParkingPermit" checked={value.IsForParkingPermit} value={value.IsForParkingPermit}
                                                                                onChange={handlChanges}
                                                                                id="IsForParkingPermit" />
                                                                            <label className='ml-2' htmlFor="IsForParkingPermit">Is For Parking Permit</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsDrugReason" checked={value.IsDrugReason} value={value.IsDrugReason}
                                                                                onChange={handlChanges}
                                                                                id="IsForTicket" />
                                                                            <label className='ml-2' htmlFor="IsDrugReason">Is Drug Reason</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsBoatReason" checked={value.IsBoatReason} value={value.IsBoatReason}
                                                                                onChange={handlChanges}
                                                                                id="IsBoatReason" />
                                                                            <label className='ml-2' htmlFor="IsBoatReason">Is Boat Reason</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsOtherReason" checked={value.IsOtherReason} value={value.IsOtherReason}
                                                                                onChange={handlChanges}
                                                                                id="IsOtherReason" />
                                                                            <label className='ml-2' htmlFor="IsOtherReason">Is Other Reason</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsArticleReason" checked={value.IsArticleReason} value={value.IsArticleReason}
                                                                                onChange={handlChanges}
                                                                                id="IsArticleReason" />
                                                                            <label className='ml-2' htmlFor="IsArticleReason">Is Article Reason</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsAlert" checked={value.IsAlert} value={value.IsAlert}
                                                                                onChange={handlChanges}
                                                                                id="IsAlert" />
                                                                            <label className='ml-2' htmlFor="IsAlert">Is Alert</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsVehicleReason" checked={value.IsVehicleReason} value={value.IsVehicleReason}
                                                                                onChange={handlChanges}
                                                                                id="IsVehicleReason" />
                                                                            <label className='ml-2' htmlFor="IsVehicleReason">Is Vehicle Reason</label>
                                                                        </div>

                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsGunReason" checked={value.IsGunReason} value={value.IsGunReason}
                                                                                onChange={handlChanges}
                                                                                id="IsGunReason" />
                                                                            <label className='ml-2' htmlFor="IsGunReason">Is Gun Reason</label>
                                                                        </div>
                                                                        <div className="col-3 mt-3">
                                                                            <input type="checkbox" name="IsSecurityReason" checked={value.IsSecurityReason} value={value.IsSecurityReason}
                                                                                onChange={handlChanges}
                                                                                id="IsSecurityReason" />
                                                                            <label className='ml-2' htmlFor="IsSecurityReason">Is Security Reason</label>
                                                                        </div>

                                                                    </>

                                                                    : openPage === 'Property Description' ?
                                                                        <>
                                                                            <div className=" col-12 col-md-12 col-lg-6 dropdown__box mt-4 ">
                                                                                {
                                                                                    value?.CategoryIDName ?
                                                                                        <Select
                                                                                            name='CategoryID'
                                                                                            isClearable
                                                                                            defaultValue={value?.CategoryIDName}
                                                                                            options={proNameReaDrpValue}
                                                                                            onChange={(e) => changeDropDownFirst(e, 'CategoryID')}
                                                                                            placeholder="Category"
                                                                                        />
                                                                                        :
                                                                                        <Select
                                                                                            name='CategoryID'
                                                                                            isClearable
                                                                                            options={proNameReaDrpValue}
                                                                                            onChange={(e) => changeDropDownFirst(e, 'CategoryID')}
                                                                                            placeholder="Category"
                                                                                        />

                                                                                }
                                                                                <label>Category</label>
                                                                            </div>

                                                                            <div className="col-4 mt-3">
                                                                                <input type="checkbox" name="IsForTicket" checked={value.IsForTicket} value={value.IsForTicket}
                                                                                    onChange={handlChanges}
                                                                                    id="IsForTicket" />
                                                                                <label className='ml-2' htmlFor="IsForTicket">Is For Ticket</label>
                                                                            </div>
                                                                            <div className="col-4 mt-3">
                                                                                <input type="checkbox" name="IsForParkingCitation" checked={value.IsForParkingCitation} value={value.IsForParkingCitation}
                                                                                    onChange={handlChanges}
                                                                                    id="IsForParkingCitation" />
                                                                                <label className='ml-2' htmlFor="IsForParkingCitation">Is For Parking Citation</label>
                                                                            </div>
                                                                            <div className="col-4 mt-3">
                                                                                <input type="checkbox" name="IsForParkingPermit" checked={value.IsForParkingPermit} value={value.IsForParkingPermit}
                                                                                    onChange={handlChanges}
                                                                                    id="IsForParkingPermit" />
                                                                                <label className='ml-2' htmlFor="IsForParkingPermit">Is For Parking Permit</label>
                                                                            </div>
                                                                        </>
                                                                        // Property Vehicle Style
                                                                        : openPage === 'Property Vehicle Style' ?

                                                                            <div className="pt-2 col-12 col-md-6 col-lg-6 dropdown__box  ">
                                                                                {
                                                                                    value?.PropertyDescName ?
                                                                                        <Select
                                                                                            name='PropertyDescID'
                                                                                            isClearable
                                                                                            defaultValue={value?.PropertyDescName}
                                                                                            options={firstDropDownValue}
                                                                                            onChange={(e) => changeDropDownFirst(e, 'PropertyDescID')}
                                                                                            placeholder="Property Description"
                                                                                        />
                                                                                        :
                                                                                        <Select
                                                                                            name='PropertyDescID'
                                                                                            isClearable
                                                                                            options={firstDropDownValue}
                                                                                            onChange={(e) => changeDropDownFirst(e, 'PropertyDescID')}
                                                                                            placeholder="Property Description"

                                                                                        />

                                                                                }
                                                                                <label className='pt-2'>Property Description</label>
                                                                            </div>

                                                                            : openPage === 'SMT Location' ?
                                                                                <>
                                                                                    <div className="col-12 col-md-8 col-lg-3 mt-2">
                                                                                        <div className="text-field">
                                                                                            <input type="text" name='StatusCode' onChange={handlChanges} value={value.StatusCode} />
                                                                                            <label>Status Code</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-12 col-md-8 col-lg-3 mt-2">
                                                                                        <div className="text-field">
                                                                                            <input type="text" name='NIBRSCode' onChange={handlChanges} value={value.NIBRSCode} />
                                                                                            <label>TIBRS Code</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className=" col-12 col-md-12 col-lg-6  " style={{ marginTop: '5px' }}>
                                                                                        <div className=" dropdown__box ">
                                                                                            {
                                                                                                value?.SMTTypeName ?
                                                                                                    <Select
                                                                                                        name='SMTTypeID'
                                                                                                        isClearable
                                                                                                        defaultValue={value?.SMTTypeName}
                                                                                                        options={smtDropDownValue}
                                                                                                        onChange={(e) => changeDropDownFirst(e, 'SMTTypeID')}
                                                                                                        placeholder="SMT Type"
                                                                                                        styles={customStylesWithOutColor}
                                                                                                    />
                                                                                                    :
                                                                                                    <Select
                                                                                                        name='SMTTypeID'
                                                                                                        isClearable
                                                                                                        options={smtDropDownValue}
                                                                                                        onChange={(e) => changeDropDownFirst(e, 'SMTTypeID')}
                                                                                                        placeholder="SMT Type"
                                                                                                        styles={customStylesWithOutColor}

                                                                                                    />

                                                                                            }
                                                                                            <label>SMT Type</label>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                                : openPage === 'Warrant ORI' ?

                                                                                    <div className="col-12 col-md-8 col-lg-3 mt-2">
                                                                                        <div className="text-field">
                                                                                            <input type="text" name='ORINumber' onChange={handlChanges} value={value.ORINumber} className='requiredColor' required />
                                                                                            <label>ORI Number</label>
                                                                                        </div>
                                                                                    </div>

                                                                                    : openPage === 'Property Vehicle Model' ?

                                                                                        <div className=" col-12 col-md-12 col-lg-12 dropdown__box mt-4 ">
                                                                                            {
                                                                                                value?.PropertyWeaponMakeName ?
                                                                                                    <Select
                                                                                                        name='PropertyVehicleMakeID'
                                                                                                        isClearable
                                                                                                        defaultValue={value?.PropertyWeaponMakeName}
                                                                                                        options={vehicalModalDownValue}
                                                                                                        onChange={(e) => changeDropDownFirst(e, 'PropertyVehicleMakeID')}
                                                                                                        placeholder="Weapon Make"
                                                                                                    />
                                                                                                    :
                                                                                                    <Select
                                                                                                        name='PropertyVehicleMakeID'
                                                                                                        isClearable
                                                                                                        options={vehicalModalDownValue}
                                                                                                        onChange={(e) => changeDropDownFirst(e, 'PropertyVehicleMakeID')}
                                                                                                        placeholder="Vehicle Make"
                                                                                                    />

                                                                                            }
                                                                                            <label>Vehicle Make</label>
                                                                                        </div>

                                                                                        : openPage === 'Property Classification' ?
                                                                                            <>
                                                                                                <div className=" col-12 col-md-12 col-lg-12 dropdown__box mt-4 ">
                                                                                                    {
                                                                                                        value?.PropertyDesName ?
                                                                                                            <Select
                                                                                                                name='PropertyDescID'
                                                                                                                isClearable
                                                                                                                defaultValue={value?.PropertyDesName}
                                                                                                                options={propertyDesValue}
                                                                                                                onChange={(e) => changeDropDownFirst(e, 'PropertyDescID')}
                                                                                                                placeholder="Property Des"
                                                                                                            />
                                                                                                            :
                                                                                                            <Select
                                                                                                                name='PropertyDescID'
                                                                                                                isClearable
                                                                                                                options={propertyDesValue}
                                                                                                                onChange={(e) => changeDropDownFirst(e, 'PropertyDescID')}
                                                                                                                placeholder="Property Desc"
                                                                                                            />

                                                                                                    }
                                                                                                    <label>Property Desc</label>
                                                                                                </div>
                                                                                                <div className="col-3 mt-3">
                                                                                                    <input type="checkbox" name="IsTicket" checked={value.IsTicket} value={value.IsTicket}
                                                                                                        onChange={handlChanges}
                                                                                                        id="IsTicket" />
                                                                                                    <label className='ml-2' htmlFor="IsTicket">IsTicket</label>
                                                                                                </div>

                                                                                            </>
                                                                                            : openPage === 'Contact Phone Type' ?
                                                                                                <>
                                                                                                    <div className=" col-12 col-md-12 col-lg-12 dropdown__box mt-4 ">
                                                                                                        {
                                                                                                            value?.ContactTypeIDName ?
                                                                                                                <Select
                                                                                                                    name='ContactTypeID'
                                                                                                                    isClearable
                                                                                                                    defaultValue={value?.ContactTypeIDName}
                                                                                                                    options={contactTypeDrpVal}
                                                                                                                    onChange={(e) => changeDropDownFirst(e, 'ContactTypeID')}
                                                                                                                    placeholder="Contact Type"
                                                                                                                />
                                                                                                                :
                                                                                                                <Select
                                                                                                                    name='ContactTypeID'
                                                                                                                    isClearable
                                                                                                                    options={contactTypeDrpVal}
                                                                                                                    onChange={(e) => changeDropDownFirst(e, 'ContactTypeID')}
                                                                                                                    placeholder="Contact Type"
                                                                                                                />

                                                                                                        }
                                                                                                        <label>Contact Type</label>
                                                                                                    </div>
                                                                                                    <div className="col-3 mt-3">
                                                                                                        <input type="checkbox" name="IsPhone" checked={value.IsPhone} value={value.IsPhone}
                                                                                                            onChange={handlChanges}
                                                                                                            id="IsPhone" />
                                                                                                        <label className='ml-2' htmlFor="IsPhone">Is Phone</label>
                                                                                                    </div>
                                                                                                    <div className="col-3 mt-3">
                                                                                                        <input type="checkbox" name="IsEMail" checked={value.IsEMail} value={value.IsEMail}
                                                                                                            onChange={handlChanges}
                                                                                                            id="IsEMail" />
                                                                                                        <label className='ml-2' htmlFor="IsEMail">Is EMail</label>
                                                                                                    </div>
                                                                                                </>
                                                                                                :
                                                                                                openPage === 'Race' ?

                                                                                                    <div className="col-12 col-md-8 col-lg-12 mt-2">
                                                                                                        <div className="text-field">
                                                                                                            <input type="text" name='InterfaceSpecificRaceCode' onChange={handlChanges} value={value.InterfaceSpecificRaceCode} />
                                                                                                            <label>Interface Specific Race Code</label>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    :
                                                                                                    openPage === 'Condition Type' || openPage === 'Handicap Type' ?

                                                                                                        <div className="col-3 mt-3">
                                                                                                            <input type="checkbox" name="IsMental" checked={value.IsMental} value={value.IsMental}
                                                                                                                onChange={handlChanges}
                                                                                                                id="IsMental" />
                                                                                                            <label className='ml-2' htmlFor="IsMental">Is Mental</label>
                                                                                                        </div>

                                                                                                        :
                                                                                                        openPage === 'Victim Type' ?
                                                                                                            <>
                                                                                                            </>
                                                                                                            :
                                                                                                            openPage === 'Resident' ?

                                                                                                                <div className="col-3 mt-3">
                                                                                                                    <input type="checkbox" name="IsArrest" checked={value.IsArrest} value={value.IsArrest}
                                                                                                                        onChange={handlChanges}
                                                                                                                        id="IsArrest" />
                                                                                                                    <label className='ml-2' htmlFor="IsArrest">Is Arrest</label>
                                                                                                                </div>

                                                                                                                :



                                                                                                                //-----------Warrant Classification
                                                                                                                openPage === 'Warrant Classification' ?

                                                                                                                    <div className=" col-12 col-md-12 col-lg-12 dropdown__box mt-4 ">
                                                                                                                        {
                                                                                                                            value?.WarrantTypeIDName ?
                                                                                                                                <Select
                                                                                                                                    name='WarrantTypeID'
                                                                                                                                    isClearable
                                                                                                                                    defaultValue={value?.WarrantTypeIDName}
                                                                                                                                    options={warrantTypeDrpdown}
                                                                                                                                    onChange={(e) => changeDropDownFirst(e, 'WarrantTypeID')}
                                                                                                                                    placeholder="Contact Type"
                                                                                                                                />
                                                                                                                                :
                                                                                                                                <Select
                                                                                                                                    name='WarrantTypeID'
                                                                                                                                    isClearable
                                                                                                                                    options={warrantTypeDrpdown}
                                                                                                                                    onChange={(e) => changeDropDownFirst(e, 'WarrantTypeID')}
                                                                                                                                    placeholder="Warrant Type"
                                                                                                                                />

                                                                                                                        }
                                                                                                                        <label>Warrant Type</label>
                                                                                                                    </div>

                                                                                                                    :



                                                                                                                    openPage === 'Name Reason Code' ?
                                                                                                                        <>
                                                                                                                            <div className="col-3 mt-3">
                                                                                                                                <input type="checkbox" name="IsArrestName" checked={value.IsArrestName} value={value.IsArrestName}
                                                                                                                                    onChange={handlChanges}
                                                                                                                                    id="IsArrestName" />
                                                                                                                                <label className='ml-2' htmlFor="IsArrestName">Is Arrest Name</label>
                                                                                                                            </div>
                                                                                                                            <div className="col-3 mt-3">
                                                                                                                                <input type="checkbox" name="IsJuvenileArrest" checked={value.IsJuvenileArrest} value={value.IsJuvenileArrest}
                                                                                                                                    onChange={handlChanges}
                                                                                                                                    id="IsJuvenileArrest" />
                                                                                                                                <label className='ml-2' htmlFor="IsJuvenileArrest">Is Juvenile Arrest</label>
                                                                                                                            </div>
                                                                                                                            <div className="col-3 mt-3">
                                                                                                                                <input type="checkbox" name="IsChildCustody" checked={value.IsChildCustody} value={value.IsChildCustody}
                                                                                                                                    onChange={handlChanges}
                                                                                                                                    id="IsChildCustody" />
                                                                                                                                <label className='ml-2' htmlFor="IsChildCustody">Is Child Custody</label>
                                                                                                                            </div>
                                                                                                                            <div className="col-3 mt-3">
                                                                                                                                <input type="checkbox" name="IsVictimName" checked={value.IsVictimName} value={value.IsVictimName}
                                                                                                                                    onChange={handlChanges}
                                                                                                                                    id="IsVictimName" />
                                                                                                                                <label className='ml-2' htmlFor="IsVictimName">Is Victim Name</label>
                                                                                                                            </div>
                                                                                                                            <div className="col-3 mt-3">
                                                                                                                                <input type="checkbox" name="IsWitnessName" checked={value.IsWitnessName} value={value.IsWitnessName}
                                                                                                                                    onChange={handlChanges}
                                                                                                                                    id="IsWitnessName" />
                                                                                                                                <label className='ml-2' htmlFor="IsWitnessName">Is Witness Name</label>
                                                                                                                            </div>
                                                                                                                            <div className="col-3 mt-3">
                                                                                                                                <input type="checkbox" name="IsAlert" checked={value.IsAlert} value={value.IsAlert}
                                                                                                                                    onChange={handlChanges}
                                                                                                                                    id="IsAlert" />
                                                                                                                                <label className='ml-2' htmlFor="IsAlert">Is Alert</label>
                                                                                                                            </div>
                                                                                                                            <div className="col-3 mt-3">
                                                                                                                                <input type="checkbox" name="IsOffenderName" checked={value.IsOffenderName} value={value.IsOffenderName}
                                                                                                                                    onChange={handlChanges}
                                                                                                                                    id="IsOffenderName" />
                                                                                                                                <label className='ml-2' htmlFor="IsOffenderName">Is Offender Name</label>
                                                                                                                            </div>
                                                                                                                            <div className="col-3 mt-3">
                                                                                                                                <input type="checkbox" name="IsMissingPerson" checked={value.IsMissingPerson} value={value.IsMissingPerson}
                                                                                                                                    onChange={handlChanges}
                                                                                                                                    id="IsMissingPerson" />
                                                                                                                                <label className='ml-2' htmlFor="IsMissingPerson">Is Missing Person</label>
                                                                                                                            </div>
                                                                                                                            <div className=" col-12 col-md-12 col-lg-12 dropdown__box mt-4 ">
                                                                                                                                {
                                                                                                                                    value?.CategoryName ?
                                                                                                                                        <Select
                                                                                                                                            name='CategoryID'
                                                                                                                                            isClearable
                                                                                                                                            defaultValue={value?.CategoryName}
                                                                                                                                            options={nameReasonDrpDwnVal}
                                                                                                                                            onChange={(e) => changeDropDownFirst(e, 'CategoryID')}
                                                                                                                                            placeholder="Category.."
                                                                                                                                        />
                                                                                                                                        :
                                                                                                                                        <Select
                                                                                                                                            name='CategoryID'
                                                                                                                                            isClearable
                                                                                                                                            options={nameReasonDrpDwnVal}
                                                                                                                                            onChange={(e) => changeDropDownFirst(e, 'CategoryID')}
                                                                                                                                            placeholder="Category.."
                                                                                                                                        />

                                                                                                                                }
                                                                                                                                <label>Category</label>
                                                                                                                            </div>
                                                                                                                        </>
                                                                                                                        :

                                                                                                                        <></>
                                                }
                                                <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                    <SelectBox
                                                        options={agencyData}
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={false}
                                                        components={{ Option, MultiValue, animatedComponents }}
                                                        onChange={Agencychange}
                                                        allowSelectAll={true}
                                                        value={multiSelected.optionSelected}
                                                    />
                                                    <label>Agency</label>
                                                </div>
                                                <div className="col-12 col-md-12 col-lg-12">
                                                    <input type="checkbox" id="IsEditable" onChange={handlChanges} name='IsEditable' value={value.IsEditable} checked={value.IsEditable} />
                                                    <label className='pl-2'> Is Editable</label>
                                                </div>
                                                {
                                                    openPage === 'Incident Disposition' ?

                                                        <div className="col-3 mt-3">
                                                            <input type="checkbox" name="IsCADCfsCode" checked={value.IsCADCfsCode} value={value.IsCADCfsCode}
                                                                onChange={handlChanges}
                                                                id="IsCADCfsCode" />
                                                            <label className='ml-2' htmlFor="IsCADCfsCode">Is CAD CFS Code</label>
                                                        </div>

                                                        :
                                                        openPage === 'Weapon Type' ?
                                                            <>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsWeapon" checked={value.IsWeapon} value={value.IsWeapon}
                                                                        onChange={handlChanges}
                                                                        id="IsWeapon" />
                                                                    <label className='ml-2' htmlFor="IsWeapon">IsWeapon</label>
                                                                </div>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsAuto" checked={value.IsAuto} value={value.IsAuto}
                                                                        onChange={handlChanges}
                                                                        id="IsAuto" />
                                                                    <label className='ml-2' htmlFor="IsAuto">IsAuto</label>
                                                                </div>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsChargeWeapon" checked={value.IsChargeWeapon} value={value.IsChargeWeapon}
                                                                        onChange={handlChanges}
                                                                        id="IsChargeWeapon" />
                                                                    <label className='ml-2' htmlFor="IsChargeWeapon">IsChargeWeapon</label>
                                                                </div>
                                                                <div className="col-3 mt-3">
                                                                    <input type="checkbox" name="IsFirearm" checked={value.IsFirearm} value={value.IsFirearm}
                                                                        onChange={handlChanges}
                                                                        id="IsFirearm" />
                                                                    <label className='ml-2' htmlFor="IsFirearm">IsFirearm</label>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                            </>
                                                }
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {
                                            status ?
                                                <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >Update</button>
                                                :
                                                <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >Save</button>
                                        }
                                        <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={() => closeModal()}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    :
                    <> </>
            }
        </>
    )
}

export default memo(AddUpCom)

export const changeArrayFormat = (data, type) => {
    if (type === 'NamResVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.NameTypeID, label: sponsor.Description })
        )

        return result
    }
    if (type === 'WarrentVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.WarrantTypeID, label: sponsor.Description })
        )

        return result
    }
    if (type === 'PropNamResVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PropertyCategoryID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'PropertyDesVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PropertyCategoryID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'SMTLocation') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PropertyDescID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'SMTSecLocation') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.SMTTypeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'VehicalModal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PropertyVehicleMakeID, label: sponsor.Description })
        )
        return result
    } else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, firstDropDownValue) => {
    if (type === 'ContactTypeID') {
        const result = data?.map((sponsor) =>
            (sponsor.ContactTypeID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'NamResVal') {
        const result = data?.map((sponsor) =>
            (sponsor.CategoryID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'WarrentVal') {
        const result = data?.map((sponsor) =>
            (sponsor.WarrantTypeID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'PropNamResVal') {
        const result = data?.map((sponsor) =>
            (sponsor.CategoryID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'PropertyDesVal') {
        const result = data?.map((sponsor) =>
            (sponsor.PropertyDescID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'SMTLocation') {
        const result = data?.map((sponsor) =>
            (sponsor.PropertyDescID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'SMTSecLocation') {
        const result = data?.map((sponsor) =>
            (sponsor.SMTTypeID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    if (type === 'VehicalModal') {
        const result = data?.map((sponsor) =>
            (sponsor.PropertyVehicleMakeID)
        )
        const result2 = firstDropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
        )
        return result
    }
}
