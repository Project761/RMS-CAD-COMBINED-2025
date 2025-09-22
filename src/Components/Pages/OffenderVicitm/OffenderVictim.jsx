import React, { useContext, useEffect, useRef, useState } from 'react'
import { Decrypt_Id_Name, MultiSelectRequredColor, Requiredcolour, base64ToString, customStylesWithOutColor, tableCustomStyles } from '../../Common/Utility';
import Tab from '../../Utility/Tab/Tab';
import DataTable from 'react-data-table-component';
import Select from "react-select";
import SelectBox from '../../Common/SelectBox';
import { components } from "react-select";
import DeletePopUpModal from '../../Common/DeleteModal';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useDispatch, useSelector } from 'react-redux';
import { AssaultInjuryComArrayFormat, Comman_changeArrayFormat, Comman_changeArrayFormatBasicInfo, Comman_changeArrayFormatBasicInfowithoutcode, Comman_changeArrayVictim, offenseArray, threeColArray, threeColArrayWithCode, threeColVictimInjuryArray, threeColVictimOffenseArray } from '../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { useLocation } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import { AgencyContext } from '../../../Context/Agency/Index';
import ChangesModal from '../../Common/ChangesModal';
import MasterNameModel from '../MasterNameModel/MasterNameModel';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';


const OffenderVictim = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const { setChangesStatus, get_Offence_Count, get_Incident_Count, } = useContext(AgencyContext);

    const [offenseDrp, setOffenseDrp] = useState();
    const [isCrimeIDSelected, setIsCrimeIDSelected] = useState(false);

    const SelectedValue = useRef();
    const [crimeBiasCategoryDrp, setCrimeBiasCategoryDrp] = useState([]);
    const [crimeOffenderUseDrp, setCrimeOffenderUseDrp] = useState([]);
    const [relationShipDrp, setRelationShipDrp] = useState([]);
    const [nameDrp, setNameDrp] = useState([]);
    // const [nameDrp, setnameDrp] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
    const [offenderOffenseDrp, setOffenderOffenseDrp] = useState();
    const [loginPinID, setLoginPinID,] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [injuryTypeEditVal, setInjuryTypeEditVal] = useState();
    const [injuryTypeDrp, setInjuryTypeDrp] = useState([]);
    //ids
    const [VictimOffenderNameData, setVictimOffenderNameData] = useState([]);
    const [DrpNameID, setDrpNameID] = useState('');
    const [victimInjuryID, setVictimInjuryID] = useState();
    const [VictimID, setVictimID] = useState('');
    const [OffenseID, setOffenseID] = useState();
    //-----------------------------------------------------offence---------------------------------------------
    const [locationIdDrp, setLocationIdDrp] = useState([]);
    const [crimeOffenderUseEditVal, setCrimeOffenderUseEditVal] = useState([]);
    const [crimeBiasCategoryEditVal, setCrimeBiasCategoryEditVal] = useState([]);
    const [crimeBiasCategory, setCrimeBiasCategory] = useState([])
    const [RelationshipID, setRelationshipID] = useState('');
    const [singleData, setSingleData] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);
    const [clickedRowOff, setclickedRowOff] = useState(null);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [statesChangeStatus1, setStatesChangeStatus1] = useState(false);

    //---------------------------------weapon-------------------------------------------
    const [weaponDrp, setWeaponDrp] = useState([]);
    const [weaponID, setWeaponID] = useState([]);
    const [weaponEditVal, setweaponEditVal] = useState([]);
    const [expandedRowsTemp, setExpandedRowsTemp] = useState(null);
    const [status, setStatus] = useState(false);
    const [statusOffrnce, setstatusOffrnce] = useState(false);
    const [offenderusing, setoffenderusing] = useState([]);
    const [CrimeID, setCrimeID] = useState('');
    const [isProperty, setIsProperty] = useState(true);
    const [VictimDrpp, setVictimDrpp] = useState([]);
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [possessionID, setPossessionID] = useState('');
    const [possessionIDVictim, setPossessionIDVictim] = useState('');
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [type, setType] = useState("Offender");
    const [expandedRows, setExpandedRows] = useState(null);
    //  // permissions
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'IncidentID': '', 'VictimID': VictimID, 'NameID': '', 'RelationshipTypeID': '', 'VictimNameID': '',
        'OffenderNameID': '', 'RelationshipID': '',
    });

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) { if (uniqueId) dispatch(get_LocalStoreData(uniqueId)); }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); get_Incident_Count(IncID, localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("O148", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAdd(effectiveScreenPermission[0]?.AddOK); setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setPermissionForAdd(false); setPermissionForEdit(false); setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    const MultiValue = props => (
        <components.MultiValue {...props}>
            <span>{props.data.label}</span>
        </components.MultiValue>
    );

    const [errors, setErrors] = useState({ 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', 'RelationshipIDErrors': '', 'OffenseIDIDErrors': '', })

    const ChangeDropDownVictim = async (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            const selectedNameId = e.NameID;
            const selectedVictimId = e.VictimID;
            const selectedValue = e.value;
            setValue(prev => ({
                ...prev,
                [name]: selectedValue,
                VictimID: selectedVictimId,
                NameID: selectedNameId,
            }));

            setDrpNameID(selectedNameId); setVictimID(selectedVictimId);
            setPossessionIDVictim(selectedValue); get_OffenseName_Data(selectedNameId);
            get_Offense_DropDown(IncID, selectedNameId);
            get_InjuryType_Data(selectedVictimId); get_Data_InjuryType_Drp(IncID, selectedVictimId);
        } else {
            // setVictimID('');
            // setDrpNameID('');
            setPossessionIDVictim('');
            setPossessionID(''); setOffenceData([]); setVictimInjuryID([]); setOffenseID([]);
            setValue(prev => ({ ...prev, [name]: null }));
        }
    };

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OffenderNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['RelationshipTypeIDErrors']: RequiredFieldIncident(value.OffenderNameID) } })
        }
        if (RequiredFieldIncident(value.VictimNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['VictimNameIDErrors']: RequiredFieldIncident(value.VictimNameID) } })
        }
        if (RequiredFieldIncident(value.RelationshipTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['RelationshipIDErrors']: RequiredFieldIncident(value.RelationshipTypeID) } })
        }
        if (RequiredFieldIncident(OffenseID)) {
            setErrors(prevValues => { return { ...prevValues, ['OffenseIDIDErrors']: RequiredFieldIncident(OffenseID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { RelationshipTypeIDErrors, VictimNameIDErrors, RelationshipIDErrors, OffenseIDIDErrors } = errors

    useEffect(() => {
        if (RelationshipTypeIDErrors === 'true' && VictimNameIDErrors === 'true' && RelationshipIDErrors === 'true' && OffenseIDIDErrors === 'true') {
            if (status && RelationshipID) update_Relationship()
            else { save_Relationship() }
        }
    }, [RelationshipTypeIDErrors, VictimNameIDErrors, RelationshipIDErrors, OffenseIDIDErrors])

    useEffect(() => {
        if (loginAgencyID) {
            get_Data_RelationShip_Drp(loginAgencyID); LocationIdDrpDwnVal(loginAgencyID);
            getCrimeOffenderUseDrpVal(); getCrimeBiasCategoryDrpVal(loginAgencyID); get_Weapon_DropDown(loginAgencyID);
        }
    }, [loginAgencyID])

    useEffect(() => {
        if (singleData?.RelationshipID) {
            setValue(pre => {
                return {
                    ...pre,
                    RelationshipTypeID: singleData?.RelationshipTypeID, VictimNameID: singleData?.VictimNameID, OffenderNameID: singleData?.OffenderNameID, ModifiedByUserFK: loginPinID, RelationshipID: singleData?.RelationshipID,
                }
            })
        }
    }, [singleData])

    useEffect(() => {
        if (VictimID || loginPinID) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'NameID': DrpNameID, 'VictimID': VictimID, 'incidentID': IncID, } });
        }
    }, [loginPinID, VictimID])

    useEffect(() => {
        if (IncID || DrpNameID) {
            get_Data_Name_Drp(IncID); get_Data_Victim_Drp(IncID); get_Data_VictimOffenderName(IncID);
            get_Offense_DropDown(IncID, DrpNameID); get_OffenseName_Data(DrpNameID);
            // get_Data_Offense_Drp(IncID, DrpNameID);
        }
    }, [IncID, DrpNameID])

    useEffect(() => {
        if (RelationshipID) { get_Single_Data(RelationshipID) }
    }, [RelationshipID])

    const get_Single_Data = (RelationshipID) => {
        const val = { 'RelationshipID': RelationshipID, }
        fetchPostData('NameRelationship/GetSingleData_NameRelationship', val).then((data) => {
            if (data && data.length > 0) {
                const VictimID = data[0].VictimID;
                setVictimID(VictimID); setSingleData(data[0])
            } else { setSingleData([]) }
        })
    }

    const get_Data_VictimOffenderName = () => {
        const val = { 'IncidentID': IncID, }
        fetchPostData('Victim/GetData_VictimOffenderName', val).then((data) => {
            if (data) {
                setVictimOffenderNameData(data)
            } else { setVictimOffenderNameData([]) }
        })
    }

    const Reset = () => {
        setValue({ ...value, 'OffenderInjuryID': '', 'OffenderNameID': '', 'RelationshipTypeID': '', 'NameID': '', 'VictimNameID': '', });
        setStatesChangeStatus(false); setOffenceData([]); setStatusFalseOffrnce(); setclickedRowOff(); setChargeCodeDec('');
        setPossessionID('');
        setPossessionIDVictim('');
        setPossenSinglData([]);
    }

    const get_Data_RelationShip_Drp = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID }
        fetchPostData('VictimRelationshipType/GetDataDropDown_VictimRelationshipType', val).then((data) => {
            if (data) {
                setRelationShipDrp(Comman_changeArrayFormat(data, 'VictimRelationshipTypeID', 'Description'))
            } else { setRelationShipDrp([]) }
        })
    }

    useEffect(() => {
        if (possessionID && (type === "Offender")) {
            get_Data_Name_Drp(IncID); setValue({ ...value, ['OffenderNameID']: parseInt(possessionID), })
        }
        else if (possessionIDVictim && (type === "Victim")) {
            get_Data_Victim_Drp(IncID); setValue({ ...value, ['VictimNameID']: parseInt(possessionIDVictim) })
        }
    }, [possessionID, possessionIDVictim, nameModalStatus]);

    const get_Data_Name_Drp = (IncID) => {
        const val = { 'IncidentID': IncID, }
        fetchPostData('NameRelationship/GetDataDropDown_OffenderName', val).then((data) => {
            if (data) {
                setNameDrp(Comman_changeArrayFormat(data, 'NameID', 'Name'))
            } else { setNameDrp([]) }
        })
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value }); setPossessionID(e.value);
        } else {
            setValue({ ...value, [name]: null }); setPossessionID('');
        }
    };

    const ChangeDropDownRelationship = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value });
        } else {
            setValue({ ...value, [name]: null });
        }
    };

    useEffect(() => {
        if (injuryTypeEditVal) { setVictimInjuryID(injuryTypeEditVal) }
    }, [injuryTypeEditVal])

    useEffect(() => {
        if (typeOfSecurityEditVal) { setOffenseID(typeOfSecurityEditVal) }
    }, [typeOfSecurityEditVal])

    useEffect(() => {
        if (crimeOffenderUseEditVal) { setoffenderusing(crimeOffenderUseEditVal) }
    }, [crimeOffenderUseEditVal])

    useEffect(() => {
        if (crimeBiasCategoryEditVal) { setCrimeBiasCategory(crimeBiasCategoryEditVal) }
    }, [crimeBiasCategoryEditVal])

    useEffect(() => {
        if (weaponEditVal) { setWeaponID(weaponEditVal); }
    }, [weaponEditVal])

    useEffect(() => {
        if (VictimID || IncID) {
            get_Data_InjuryType_Drp(VictimID); get_InjuryType_Data(VictimID); get_Data_Victim_Drp(IncID);
        }
    }, [VictimID, IncID])

    const get_Data_Offense_Drp = (incidentID, NameID) => {
        const val = { 'NameID': NameID, 'IncidentId': incidentID, }
        fetchPostData('OffenderOffense/GetData_InsertOffenderOffense', val).then((data) => {
            if (data) {
                setOffenderOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description',))
            } else {
                setOffenderOffenseDrp([])
            }
        })
    }

    const get_OffenseName_Data = (NameID) => {
        const val = { 'NameID': NameID, }
        fetchPostData('NameOffense/GetData_NameOffense', val).then((res) => {
            if (res) {
                setOffenceData(res);
                setTypeOfSecurityEditVal(offenseArray(res, 'NameOffenseID', 'OffenseID', 'NameID', 'NameID', 'Offense_Description', 'PretendToBeID'));
            } else {
                setTypeOfSecurityEditVal([]);
            }
        })
    }

    const get_InjuryType_Data = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('InjuryVictim/GetData_InjuryVictim', val).then((res) => {
            // console.log("🚀 ~ get_InjuryType_Data ~ res:", res)

            if (res) {
                setInjuryTypeEditVal(AssaultInjuryComArrayFormat(res, 'VictimInjuryID', 'NameID', 'PretendToBeID', 'NameEventInjuryID', 'VictimInjury_Description'));
            } else {
                setInjuryTypeEditVal([]);
            }
        })
    }

    const get_Data_InjuryType_Drp = (incidentID, VictimID) => {
        const val = { 'IncidentID': incidentID, 'VictimID': VictimID }
        fetchPostData('InjuryVictim/GetData_InsertVictimInjury', val).then((data) => {
            // console.log("🚀 ~ get_Data_InjuryType_Drp ~ data:", data)
            if (data) {
                setInjuryTypeDrp(threeColVictimInjuryArray(data, 'VictimInjuryID', 'Description', 'InjuryCode'))
            } else {
                setInjuryTypeDrp([])
            }
        })
    }

    // const InjuryTypeOnChange = (multiSelected) => {
    //     setStatesChangeStatus(true); setVictimInjuryID(multiSelected);

    //     const len = multiSelected.length - 1;
    //     const selectedValue = len >= 0 ? multiSelected[len].value : null;
    //     if (multiSelected.length < injuryTypeEditVal?.length) {

    //         let missing = null;
    //         let i = injuryTypeEditVal?.length;

    //         while (i) {
    //             missing = (~multiSelected.indexOf(injuryTypeEditVal[--i])) ? missing : injuryTypeEditVal[i];
    //         }
    //         if (missing) {
    //             DelSertBasicInfo(missing.id, 'NameEventInjuryID', 'InjuryVictim/Delete_VictimInjury');
    //         }
    //     } else {
    //         if (selectedValue) {
    //             InSertBasicInfo(selectedValue, 'VictimInjuryID', 'InjuryVictim/Insert_VictimInjury');
    //         }
    //     }
    // };

    const InjuryTypeOnChange = (multiSelected) => {
        // console.log("🚀 ~ InjuryTypeOnChange ~ multiSelected:", multiSelected)
        // console.log("🚀 ~ InjuryTypeOnChange ~ injuryTypeEditVal:", injuryTypeEditVal)
        setStatesChangeStatus(true); setVictimInjuryID(multiSelected);

        const len = multiSelected.length - 1;
        if (multiSelected.length < injuryTypeEditVal?.length) {
            let missing = null;
            let i = injuryTypeEditVal?.length;
            while (i) {
                missing = (~multiSelected.indexOf(injuryTypeEditVal[--i])) ? missing : injuryTypeEditVal[i];
                if (missing) {
                    DelSertBasicInfo(missing.id, 'NameEventInjuryID', 'InjuryVictim/Delete_VictimInjury');
                    break;
                }
            }
        } else if (multiSelected.length > injuryTypeEditVal?.length) {
            InSertBasicInfo(multiSelected[len].value, 'VictimInjuryID', 'InjuryVictim/Insert_VictimInjury');
        }
    };

    const offense = (multiSelected) => {
        setStatesChangeStatus(true); setOffenseID(multiSelected)
        const len = multiSelected.length - 1
        const selectedValue = len >= 0 ? multiSelected[len].value : null;
        if (multiSelected?.length < typeOfSecurityEditVal?.length) {
            let missing = null;
            let i = typeOfSecurityEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
            }
            DelSertBasicInfoOff(missing.value, 'NameOffenseID', 'NameOffense/Delete_NameOffense')
        } else {
            if (selectedValue) {
                InSertBasicInfo(multiSelected[len].value, 'OffenseID', 'NameOffense/Insert_NameOffense')
            }
        }
    }

    const get_Offense_DropDown = (IncID, DrpNameID) => {
        const val = { 'IncidentID': IncID, 'NameID': DrpNameID, }
        fetchPostData('NameOffense/GetData_InsertNameOffense', val).then((data) => {
            if (data) {
                setOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description'))
            } else {
                setOffenseDrp([])
            }
        })
    }

    const InSertBasicInfo = (id, col1, url) => {
        setDisabled(true)
        const val = {
            'NameID': DrpNameID, 'VictimID': VictimID, 'CrimeID': CrimeID, 'AgencyID': loginAgencyID, [col1]: id, 'CreatedByUserFK': loginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                setDisabled(false);
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                col1 === 'OffenseID' && get_OffenseName_Data(DrpNameID);
                // col1 === 'NameEventInjuryID' && get_InjuryType_Data(VictimID);
                col1 === 'VictimInjuryID' && get_InjuryType_Data(VictimID);
                col1 === 'CrimeOffenderUseID' && get_Crime_OffenderUse_Data(CrimeID);
                col1 === 'CrimeBiasCategoryID' && get_Crime_Bias_Category_Data(CrimeID);
                col1 === 'WeaponTypeID' && get_Weapon_Data(CrimeID);
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const DelSertBasicInfo = (victimOfficerID, col1, url) => {
        setDisabled(true)
        const val = { [col1]: victimOfficerID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                setDisabled(false);
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                col1 === 'OffenderOffenseID' && get_OffenseName_Data(DrpNameID)
                col1 === 'NameEventInjuryID' && get_InjuryType_Data(VictimID);
                col1 === 'CrimeOffenderUseID' && get_Crime_OffenderUse_Data(CrimeID);
                col1 === 'CrimeBiasCategoryID' && get_Crime_Bias_Category_Data(CrimeID);
                col1 === 'WeaponID' && get_Weapon_Data(CrimeID);
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const DelSertBasicInfoOff = (OffenderOffenseID, col1, url) => {
        setDisabled(true)
        const val = {
            [col1]: OffenderOffenseID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                setDisabled(false);
                const parsedData = JSON.parse(res.data);
                setStatusFalseOffrnce()
                get_OffenseName_Data(DrpNameID); get_Offense_DropDown(IncID, DrpNameID);
                const message = parsedData.Table[0].Message;
                col1 === 'OffenderOffenseID' && get_OffenseName_Data(DrpNameID);
                col1 === 'InjuryID' && get_InjuryType_Data(VictimID);
                col1 === 'CrimeOffenderUseID' && get_Crime_OffenderUse_Data(CrimeID);
                col1 === 'CrimeBiasCategoryID' && get_Crime_Bias_Category_Data(CrimeID);
                col1 === 'WeaponID' && get_Weapon_Data(CrimeID);
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const set_Edit_Value = (row) => {
        get_Single_Data(row.RelationshipID); get_InjuryType_Data(row.VictimID);
        get_OffenseName_Data(row.NameID);
        setStatus(true); setStatesChangeStatus(false); setRelationshipID(row.RelationshipID);
        setErrors({}); get_Offence_Data(row.NameID);
    }

    const save_Relationship = () => {
        const { NameID, IncidentID, CreatedByUserFK, RelationshipTypeID, VictimNameID, OffenderNameID, RelationshipID } = value;
        const val = {
            NameID: DrpNameID, IncidentID: IncID, VictimID: VictimID, RelationshipTypeID: RelationshipTypeID, VictimNameID: VictimNameID, OffenderNameID: OffenderNameID, RelationshipID: RelationshipID, CreatedByUserFK: loginPinID,
        }
        AddDeleteUpadate('NameRelationship/Insert_NameRelationship', val).then((data) => {
            if (data.success) {
                const parsedData = JSON.parse(data.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Data_VictimOffenderName(IncID); setStatus(false);
                setStatusFalse(); setStatesChangeStatus(false); setChangesStatus(false)
                setErrors({
                    ...errors, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', 'RelationshipIDErrors': '', 'OffenseIDIDErrors': ''
                });
            } else {
                toastifyError(data.Message)
            }
        })
        // }
    }

    const update_Relationship = () => {
        AddDeleteUpadate('NameRelationship/Update_NameRelationship', value).then((data) => {
            if (data.success) {
                const parsedData = JSON.parse(data.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setChangesStatus(false)
                // toastifySuccess(data.Message);
                get_Data_VictimOffenderName(IncID); setStatesChangeStatus(false); setStatusFalse(); setStatus(false);
                // setStatus(true);
                setErrors({
                    ...errors,
                    'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', 'RelationshipIDErrors': '', 'OffenseIDIDErrors': ''
                });
            } else {
                toastifyError(data.Message)
            }
        })
    }

    const DeleteRelationship = () => {
        const val = { 'RelationshipID': RelationshipID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameRelationship/Delete_NameRelationship', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setChangesStatus(false)
                get_Data_VictimOffenderName(IncID); setStatus(false); setStatusFalse()

            } else { toastifyError("Somthing Wrong"); }
        })
    }

    const columns = [
        {
            cell: (row) => {
                return (
                    (row?.isExpandedContent === true ? null :
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <button
                                onClick={() => handleRowClick(row)}
                                style={{
                                    transform: expandedRows === row.RelationshipID ? "rotate(90deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s ease-in-out", marginLeft: "15px", width: "30px", height: "30px",
                                    border: "none", fontSize: "20px"
                                }}
                            >
                                {">"}
                            </button>
                        </div>)
                )
            },
            width: "120px",
        },
        {
            name: 'Offender Name',
            selector: (row) => row.OffenderName,
            sortable: true
        },
        {
            name: 'Victim Name',
            selector: (row) => row.VictimName,
            sortable: true
        },
        {
            name: 'Relationship Type',
            selector: (row) => row.RelationshipType,
            sortable: true
        },
    ];

    const setStatusFalse = () => {
        Reset();
        setStatus(false);
        setErrors('')
        setClickedRow(null); setStatesChangeStatus(false);
        setVictimInjuryID([]);
        setOffenseID([]);
        // setoffenderusing([])
    }



    //------------------------------------------Offence---------------------------------------
    const [Offencedata, setOffencedata] = useState([])
    const [editval, setEditval] = useState();
    const [offenceData, setOffenceData] = useState([]);

    const [values, setValues] = useState({
        'ChargeCodeID': '', 'NIBRSCodeId': null, 'OffenseCodeId': null, 'LawTitleId': null, 'OffenderLeftSceneId': null,
        'CategoryId': null, 'PrimaryLocationId': null, 'SecondaryLocationId': null, 'FTADate': '',
        'Fine': '', 'CourtCost': '', 'FTAAmt': '', 'LitigationTax': '', 'DamageProperty': '', 'OfRoomsInvolved': '', 'PremisesEntered': '',
        'PropertyAbandoned': '', 'IsForceused': '', 'IsIncidentCode': false, 'AttemptComplete': "Completed",
        'CrimeID': '', 'IncidentID': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'CrimeOffenderUseID': '',
    });

    const [error, setError] = useState({
        'RelationshipTypeIDErrors': '',
        // 'offenderusingErrors': '',
    })

    const check_ValidationError = (e) => {
        if (RequiredFieldIncident(values.PrimaryLocationId)) {
            setError(prevValues => { return { ...prevValues, ['PrimaryLocationIdErrors']: RequiredFieldIncident(values.PrimaryLocationId) } })
        }
        // if (RequiredFieldIncident(values.CrimeOffenderUseID)) {
        //     setError(prevValues => { return { ...prevValues, ['offenderusingErrors']: RequiredFieldIncident(values.CrimeOffenderUseID) } })
        // }
    }

    // Check All Field Format is True Then Submit 
    const { PrimaryLocationIdErrors, } = error

    useEffect(() => {
        if (PrimaryLocationIdErrors === 'true') {
            if (statusOffrnce && CrimeID) { Update_Offence() }
            else { save_Offrnce() }
        }
    }, [PrimaryLocationIdErrors])

    const ChangeDropDownPrimary = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus1(true); !addUpdatePermission && setChangesStatus(true);
        const updatedValue = e ? e.value : null;
        const updatedValues = { ...values, [name]: updatedValue };
        setValues(updatedValues);
        Update_Offence(updatedValues)
    };

    useEffect(() => {
        if (CrimeID) { setValues(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'CrimeID': CrimeID, } }); }
    }, [CrimeID])

    useEffect(() => {
        if (CrimeID) { GetSingleData(CrimeID) }
    }, [CrimeID])

    useEffect(() => {
        if (DrpNameID) { get_Offence_Data(DrpNameID); }
    }, [DrpNameID])

    useEffect(() => {
        get_Crime_OffenderUse_Data(CrimeID); get_Offence_Count(CrimeID); get_Crime_Bias_Category_Data(CrimeID); get_Weapon_Data(CrimeID);
        get_Offence_Data(DrpNameID); LocationIdDrpDwnVal(loginAgencyID, CrimeID);
    }, [CrimeID, IncID])

    const get_Offence_Data = (NameID) => {
        const val = { 'NameID': NameID }
        fetchPostData('NameOffense/GetData_NameOffense', val).then(res => {
            if (res) { setOffenceData(res); }
            else { setOffenceData([]); }
        })
    };

    const get_Offence_data = (IncidentId) => {
        const val = { 'IncidentId': IncidentId, }
        fetchPostData('Crime/GetData_Offense', val).then(res => {
            if (res) { setOffencedata(res); }
            else { setOffencedata([]); }
        })
    };

    const [ChargeCodeDec, setChargeCodeDec] = useState([]);

    const GetSingleData = (CrimeID) => {
        const val = { 'CrimeID': CrimeID }
        fetchPostData('Crime/GetSingleData_Offense', val).then((res) => {
            if (res) {
                const setChargeCode = res[0]?.OffenseName_Description;
                setChargeCodeDec(setChargeCode);
                setEditval(res);
            } else { setEditval() }
        })
    }

    useEffect(() => {
        if (CrimeID) {
            if (editval?.length > 0) {
                setValues({
                    ...value,
                    'CrimeID': CrimeID, 'NIBRSCodeId': editval[0]?.NIBRSCodeId,
                    'ChargeCodeID': editval[0]?.ChargeCodeID, 'PrimaryLocationId': editval[0]?.PrimaryLocationId,
                    'ModifiedByUserFK': loginPinID, 'CreatedByUserFK': loginPinID,
                })
            }
        }
        else {
            setValues({
                ...value, 'CrimeID': '', 'ChargeCodeID': '', 'NIBRSCodeId': '', 'PrimaryLocationId': null,
            });
        }
    }, [editval])

    const columns1 = [
        {
            name: 'Offense Code/Name',
            selector: (row) => row.Offense_Description,
            sortable: true
        },
        {
            name: 'Location',
            selector: (row) => row.PrimaryLocation,
            sortable: true
        },
    ]

    const setEditVal = (row) => {
        if (row.OffenseID) { setIsCrimeIDSelected(true); }
        setDrpNameID(row.NameID)
        GetSingleData(row.OffenseID);
        setStatesChangeStatus1(false)
        setCrimeID(row.OffenseID);
        setstatusOffrnce(true)
        setError({});

    }

    const LocationIdDrpDwnVal = () => {
        const val = { AgencyID: loginAgencyID, 'CrimeID': CrimeID }
        fetchPostData('LocationType/GetDataDropDown_LocationType', val).then((data) => {
            if (data) {
                setLocationIdDrp(threeColArray(data, 'LocationTypeID', 'Description', 'LocationTypeCode'))
            } else {
                setLocationIdDrp([]);
            }
        })
    }

    const getCrimeOffenderUseDrpVal = () => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('CrimeOffenderUse/GetDataDropDown_CrimeOffenderUse', val).then((data) => {
            if (data) {
                setCrimeOffenderUseDrp(threeColArrayWithCode(data, 'OffenderUseID', 'Description', 'OffenderUseCode'))
            } else {
                setCrimeOffenderUseDrp([]);
            }
        })
    }

    const get_Crime_OffenderUse_Data = () => {
        const val = { 'CrimeID': CrimeID, }
        fetchPostData('OffenseOffenderUse/GetData_OffenseOffenderUse', val)
            .then((res) => {
                if (res) {
                    setCrimeOffenderUseEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeOffenderUseID', 'Description', 'PretendToBeID', 'OffenderUseID', 'OffenderUseCode'));
                }
                else {
                    setCrimeOffenderUseEditVal([]);
                }
            })
    }

    const getCrimeBiasCategoryDrpVal = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('CrimeBias/GetDataDropDown_CrimeBias', val).then((data) => {
            if (data) {
                setCrimeBiasCategoryDrp(threeColArrayWithCode(data, 'BiasID', 'Description', 'BiasCode'))
            } else {
                setCrimeBiasCategoryDrp([]);
            }
        })
    }

    const get_Weapon_DropDown = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID, }
        fetchPostData('OffenseWeapon/GetData_InsertOffenseWeapon', val).then((data) => {
            if (data) {
                setWeaponDrp(threeColArrayWithCode(data, 'WeaponID', 'Description', 'WeaponCode'));
            } else {
                setWeaponDrp([])
            }
        })
    }

    const get_Crime_Bias_Category_Data = (CrimeID) => {
        const val = { 'CrimeID': CrimeID, }
        fetchPostData('OffenseBiasCategory/GetData_OffenseBiasCategory', val)
            .then((res) => {
                if (res) {
                    setCrimeBiasCategoryEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeBiasCategoryID', 'Description', 'PretendToBeID', 'BiasCategoryID', 'BiasCode'));
                }
                else {
                    setCrimeBiasCategoryEditVal([]);
                }
            })
    }

    // weapon
    const get_Weapon_Data = (CrimeID) => {
        const val = { 'CrimeID': CrimeID, }
        fetchPostData('OffenseWeapon/GetData_OffenseWeapon', val).then((res) => {
            if (res) {
                setweaponEditVal(Comman_changeArrayFormatBasicInfo(res, 'WeaponID', 'Weapon_Description', 'PretendToBeID', 'CrimeID', 'WeaponCode'))
            } else {
                setweaponEditVal([]);
            }
        })
    }

    const OffenderUsechange = (multiSelected) => {
        setoffenderusing(multiSelected)
        const len = multiSelected.length - 1
        const selectedValues = len >= 0 ? multiSelected[len].value : null;
        if (multiSelected?.length < crimeOffenderUseEditVal?.length) {
            let missing = null;
            let i = crimeOffenderUseEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(crimeOffenderUseEditVal[--i])) ? missing : crimeOffenderUseEditVal[i];
            }
            DelSertBasicInfo(missing.id, 'OffenderUseID', 'OffenseOffenderUse/DeleteOffenseOffenderUse')
        } else {
            if (selectedValues) {
                InSertBasicInfo(multiSelected[len].value, 'CrimeOffenderUseID', 'OffenseOffenderUse/InsertOffenseOffenderUse')
            }
        }
    }

    const CrimeBiasCategorychange = (multiSelected) => {
        setCrimeBiasCategory(multiSelected)
        const len = multiSelected.length - 1
        const selectedValues = len >= 0 ? multiSelected[len].value : null;
        if (multiSelected?.length < crimeBiasCategoryEditVal?.length) {
            let missing = null;
            let i = crimeBiasCategoryEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(crimeBiasCategoryEditVal[--i])) ? missing : crimeBiasCategoryEditVal[i];
            }
            DelSertBasicInfo(missing.id, 'BiasCategoryID', 'OffenseBiasCategory/DeleteOffenseBiasCategory')
        } else {
            if (selectedValues) {
                InSertBasicInfo(multiSelected[len].value, 'CrimeBiasCategoryID', 'OffenseBiasCategory/InsertOffenseBiasCategory')
            }
        }
    }

    const Weaponchange = (multiSelected) => {
        setWeaponID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < weaponEditVal?.length) {
            let missing = null;
            let i = weaponEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(weaponEditVal[--i])) ? missing : weaponEditVal[i];
            }
            DelSertBasicInfo(missing.value, 'WeaponID', 'OffenseWeapon/Delete_OffenseWeapon')
        } else {
            InSertBasicInfo(multiSelected[len].value, 'WeaponTypeID', 'OffenseWeapon/Insert_OffenseWeapon')
        }
    }

    function filterArray(arr, key) {
        return [...new Map(arr?.map(item => [item[key], item])).values()]
    }

    const conditionalRowStyles1 = [
        {
            when: row => row.OffenseID == CrimeID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const setStatusFalseOffrnce = () => {
        setExpandedRows(''); setError(''); setStatesChangeStatus1(false)
        setstatusOffrnce(false); setValues({ ...values, CrimeID: null, PrimaryLocationId: null });
        setoffenderusing([]); setCrimeBiasCategory([]); setChargeCodeDec(''); setCrimeID(null); setIsCrimeIDSelected(false)
    };

    const save_Offrnce = () => {
        AddDeleteUpadate('Crime/Insert_Offense', values).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message); get_Offence_Data(DrpNameID); setstatusOffrnce(true); setChangesStatus(false);
                get_Offence_Count(CrimeID); get_Incident_Count(IncID, loginPinID); setError({ ...error, 'PrimaryLocationIdErrors': '', });
            } else {
                toastifyError(data.Message)
            }
        })
    }

    const Update_Offence = (values) => {
        AddDeleteUpadate('Crime/Update_Offense', values).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); setStatesChangeStatus1(false); setstatusOffrnce(true); setChangesStatus(false); get_Incident_Count(IncID, loginPinID);
            get_Offence_Data(DrpNameID); setError({ ...error, 'PrimaryLocationIdErrors': '', });
        })

    }

    const DeleteOffence = () => {
        const value1 = { 'CrimeID': CrimeID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('Crime/Delete_Offense', value1).then((res) => {
            toastifySuccess(res.Message); setStatusFalseOffrnce();
            get_Offence_Data(DrpNameID); get_Incident_Count(IncID, loginPinID);
        })
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            minHeight: 58,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };


    const customStylesWithColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 45,
            fontSize: 14,
            marginTop: 2,
            boxShadow: 0,
            backgroundColor: '#9d949436',
        }),
    };

    const get_Data_Victim_Drp = (IncID) => {
        fetchPostData('Victim/GetData_InsertVictimName', { 'IncidentID': IncID, 'NameID': DrpNameID, }).then((data) => {
            if (data) {
                setVictimDrpp(Comman_changeArrayVictim(data, 'NameID', 'VictimID', 'Name',))
            } else {
                setVictimDrpp([])
            }
        })
    }

    const GetSingleDataPassion = (nameID, masterNameID) => {
        fetchPostData('MasterName/GetSingleData_MasterName', { 'NameID': nameID, 'MasterNameID': masterNameID }).then((res) => {
            if (res) { setPossenSinglData(res); } else { setPossenSinglData([]); }
        })
    }

    const conditionalRowStyles = [
        {
            when: row => row?.RelationshipID === clickedRow?.RelationshipID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const handleRowClick = (row) => {
        setClickedRow(row); set_Edit_Value(row);
        setExpandedRows((prev) => {
            setExpandedRowsTemp(row.RelationshipID);
            const newExpandedRow = prev === row.RelationshipID ? null : row.RelationshipID;
            if (!(expandedRowsTemp === row.RelationshipID)) { setStatusFalseOffrnce(); }
            if (newExpandedRow) { get_Offence_Data(row.NameID); setDrpNameID(row.NameID); }
            return newExpandedRow;
        });
    }

    const handleRowClickOffense = (row) => {
        setclickedRowOff(row);
        setEditVal(row);
    };

    const conditionalRowStyles2 = [
        {
            when: row => row?.RelationshipID === clickedRowOff?.RelationshipID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const processedData = VictimOffenderNameData.flatMap((row) => {
        const rows = [row];
        if (expandedRows === row.RelationshipID) {
            rows.push({
                isExpandedContent: true,
                parentId: row.RelationshipID,
            });
        }
        return rows;
    });

    const valuenew = VictimDrpp?.filter((obj) => obj.value === value.VictimNameID)

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setNameModalStatus(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);


    const allOptions = filterArray(crimeOffenderUseDrp, 'label') || [];

    const options = React.useMemo(() => {
        const isNSelected = offenderusing.some(item => item.code === "N");
        const isOtherSelected = offenderusing.some(item => item.code !== "N");
        if (isNSelected) {
            return allOptions.filter(item => item.code === "N");
        } else if (isOtherSelected) {
            return allOptions.filter(item => item.code !== "N");
        }
        return allOptions;
    }, [offenderusing, allOptions]);


    return (
        <>
            <div className="section-body view_page_design  p-1 bt child">
                <div className="div">
                    <div className="col-12 inc__tabs">
                        <Tab />
                    </div>
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">
                            <div className="card-body" >
                                <div className="col-md-12" style={{ marginTop: '-20px' }}>
                                    <fieldset >
                                        <legend>Offender/Victim</legend>
                                        <div className="row">
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Offender{errors.RelationshipTypeIDErrors !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RelationshipTypeIDErrors}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2 mt-1" >
                                                <Select
                                                    name='OffenderNameID'
                                                    styles={Requiredcolour}
                                                    isClearable
                                                    value={nameDrp?.filter((obj) => obj.value === value.OffenderNameID)}
                                                    options={nameDrp}
                                                    onChange={(e) => { ChangeDropDown(e, 'OffenderNameID'); }}
                                                    placeholder="Select.."
                                                />
                                            </div>
                                            <div className="col-1 mt-2" data-toggle="modal" data-target="#MasterModal" >
                                                <button onClick={() => {
                                                    if (possessionID) {
                                                        setTimeout(() => {
                                                            GetSingleDataPassion(possessionID);
                                                        }, [200])

                                                    }
                                                    setType('Offender')
                                                    setNameModalStatus(true);
                                                }} className=" btn btn-sm bg-green text-white py-1" >
                                                    <i className="fa fa-plus" >
                                                    </i>
                                                </button>
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Victim{errors.VictimNameIDErrors !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.VictimNameIDErrors}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2 mt-1" >
                                                <Select
                                                    name='VictimNameID'
                                                    styles={Requiredcolour}
                                                    isClearable
                                                    value={VictimDrpp?.filter((obj) => obj.value === value?.VictimNameID)}
                                                    options={VictimDrpp}
                                                    onChange={(e) => { ChangeDropDownVictim(e, 'VictimNameID'); }}
                                                    placeholder="Select.."
                                                />

                                            </div>
                                            <div className="col-1 mt-2" data-toggle="modal" data-target="#MasterModal" >
                                                <button onClick={() => {
                                                    if (possessionIDVictim) {
                                                        setPossenSinglData([])
                                                        setTimeout(() => {
                                                            GetSingleDataPassion(possessionIDVictim);
                                                        }, [200])

                                                    }
                                                    setPossenSinglData([])
                                                    setType('Victim')
                                                    setNameModalStatus(true);
                                                }} className=" btn btn-sm bg-green text-white py-1" >
                                                    <i className="fa fa-plus" >
                                                    </i>
                                                </button>
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Relationship{errors.RelationshipIDErrors !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RelationshipIDErrors}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3 mt-1" >
                                                <Select
                                                    name='RelationshipTypeID'
                                                    styles={Requiredcolour}
                                                    isClearable
                                                    value={relationShipDrp?.filter((obj) => obj.value === value.RelationshipTypeID)}
                                                    options={relationShipDrp}
                                                    onChange={(e) => { ChangeDropDownRelationship(e, 'RelationshipTypeID'); }}
                                                    placeholder="Select.."
                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Offense{value?.VictimNameID && errors.OffenseIDIDErrors !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OffenseIDIDErrors}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-5" >
                                                <SelectBox
                                                    name='OffenseID'
                                                    isClearable={false}
                                                    options={offenseDrp?.filter((off) => !(offenceData?.some(obj => obj?.OffenseID === off?.value)))}
                                                    closeMenuOnSelect={false}
                                                    placeholder="Select.."
                                                    components={{ MultiValue, }}
                                                    onChange={(e) => offense(e)}
                                                    value={OffenseID}
                                                    ref={SelectedValue}
                                                    className="basic-multi-select"
                                                    isMulti
                                                    isDisabled={!value?.VictimNameID}
                                                    styles={!value?.VictimNameID ? customStylesWithColor : MultiSelectRequredColor}

                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Injury Type</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-5 " >
                                                <SelectBox
                                                    name='offenderInjuryID'
                                                    isClearable={false}
                                                    options={injuryTypeDrp}
                                                    closeMenuOnSelect={false}
                                                    placeholder="Select.."
                                                    components={{ MultiValue, }}
                                                    onChange={(e) => InjuryTypeOnChange(e)}
                                                    value={filterArray(victimInjuryID, 'label')}
                                                    // value={victimInjuryID}
                                                    className="basic-multi-select"
                                                    isMulti
                                                    isDisabled={!value?.VictimNameID}
                                                    // styles={customStylesWithOutColor}
                                                    styles={!value?.VictimNameID ? customStylesWithColor : customStylesWithOutColor}
                                                />
                                            </div>
                                            <div className="btn-box text-right col-12 col-md-12 col-lg-12 mr-1 pt-1 mb-2 mt-2">
                                                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { setStatusFalse(); }}>New</button>
                                                {
                                                    status ?
                                                        permissionForEdit ? <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button> : <></>
                                                        :
                                                        permissionForAdd ? <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button> : <></>
                                                }
                                            </div>


                                        </div>

                                    </fieldset>

                                    <fieldset className='mt-2'>
                                        <legend>Offense</legend>
                                        <div className='row mt-3 align-align-items-center'>
                                            <div className="col-2 col-md-3 col-lg-1 mt-3">
                                                <label htmlFor="" className='new-label mb-0 '>Offense Code/Name</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-11  text-field">
                                                <input type="text" className='readonlyColor' name='IncidentNumber' value={ChargeCodeDec}
                                                    // value={(IncNo, MstPage === "MST-Arrest-Dash" ? '' : IncNo)} 
                                                    required readOnly />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Bias</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-5 pt-1" >
                                                <SelectBox
                                                    className="basic-multi-select"
                                                    name='bias'
                                                    options={crimeBiasCategoryDrp}
                                                    isClearable={false}
                                                    // styles={customStylesWithOutColor}
                                                    // isDisabled={disabled}
                                                    isMulti
                                                    menuPlacement="top"
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={true}
                                                    components={{ MultiValue, }}
                                                    onChange={(e) => CrimeBiasCategorychange(e)}
                                                    // value={crimeBiasCategory}
                                                    value={filterArray(crimeBiasCategory, 'label')}
                                                    placeholder='Select Bias From List'
                                                    // isDisabled={!isCrimeIDSelected}
                                                    isDisabled={!isCrimeIDSelected}
                                                    styles={!isCrimeIDSelected ? customStylesWithColor : customStylesWithOutColor}
                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Offender&nbsp;Using </label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-5 pt-1" >
                                                <SelectBox
                                                    className="basic-multi-select"
                                                    name='CrimeOffenderUseID'
                                                    options={options}
                                                    isClearable={false}
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={true}
                                                    menuPlacement="top"
                                                    components={{ MultiValue }}
                                                    onChange={(e) => OffenderUsechange(e)}
                                                    value={filterArray(offenderusing, 'label')}
                                                    // value={offenderusing}
                                                    placeholder='Select Offender Using From List'
                                                    isDisabled={!isCrimeIDSelected}
                                                    styles={!isCrimeIDSelected ? customStylesWithColor : customStylesWithOutColor}
                                                />
                                            </div>
                                            {/* //--weapon */}
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Weapon
                                                </label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-5 pt-1" >
                                                <SelectBox
                                                    className="basic-multi-select"
                                                    name='WeaponTypeID'
                                                    options={weaponDrp?.filter((obj) => !(weaponEditVal.some((wpn) => wpn.code === obj.code)))}
                                                    isClearable={false}
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={true}
                                                    menuPlacement="top"
                                                    components={{ MultiValue }}
                                                    onChange={(e) => Weaponchange(e)}
                                                    // value={weaponID}
                                                    value={filterArray(weaponID, 'label')}
                                                    placeholder='Select Weapon Using From List'
                                                    isDisabled={!isCrimeIDSelected}
                                                    styles={!isCrimeIDSelected ? customStylesWithColor : customStylesWithOutColor}
                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                <label htmlFor="" className='label-name '>Location{!isCrimeIDSelected || error.PrimaryLocationIdErrors !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{error.PrimaryLocationIdErrors}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-5 mt-2" >
                                                <Select
                                                    name='PrimaryLocationId'
                                                    value={locationIdDrp?.filter((obj) => obj.value === values?.PrimaryLocationId)}
                                                    // isClearable
                                                    options={locationIdDrp}
                                                    onChange={(e) => ChangeDropDownPrimary(e, 'PrimaryLocationId')}
                                                    placeholder="Select..."
                                                    isDisabled={!isCrimeIDSelected}
                                                    styles={!isCrimeIDSelected ? customStylesWithColor : Requiredcolour}
                                                    menuPlacement='top'
                                                />
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                        <DataTable
                                            columns={columns}
                                            // data={processedData}
                                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? processedData : '' : ''}
                                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                            noHeader
                                            expandableRows
                                            dense
                                            persistTableHead={true}
                                            fixedHeader

                                            pagination
                                            selectableRowsHighlight
                                            fixedHeaderScrollHeight='200px'
                                            onRowClicked={handleRowClick}
                                            expandableRowExpanded={(row) => expandedRows === row.RelationshipID}
                                            conditionalRowStyles={conditionalRowStyles}
                                            expandableRowsComponent={({ data: row }) => {
                                                // Filter child data based on IncidentID
                                                return (
                                                    <div
                                                        style={{
                                                            padding: "10px",
                                                            background: "#f3f3f3",
                                                            borderBottom: "1px solid #ccc",
                                                            marginLeft: "30px",
                                                        }}
                                                    >
                                                        {/* Child DataTable for each row */}
                                                        {(expandedRows === row.RelationshipID) && (
                                                            <DataTable
                                                                columns={columns1} // Use the columns1 structure for the child table
                                                                data={offenceData} // Use filtered child details for the data
                                                                noHeader // You can add noHeader if you don't want headers to repeat
                                                                pagination // Optional pagination for child rows
                                                                conditionalRowStyles={conditionalRowStyles1}
                                                                fixedHeaderScrollHeight='150px'
                                                                onRowClicked={handleRowClickOffense}
                                                                customStyles={{
                                                                    rows: {
                                                                        style: {
                                                                            cursor: 'pointer', // 👈 ensures pointer cursor on all rows
                                                                        },
                                                                    },
                                                                    headRow: {
                                                                        style: {
                                                                            color: '#fff',
                                                                            backgroundColor: '#001f3f',
                                                                            borderBottomColor: '#FFFFFF',
                                                                            outline: '1px solid #FFFFFF',
                                                                            minHeight: "32px",
                                                                        },
                                                                    },
                                                                    expanderRow: {
                                                                        style: { display: "table-row" },
                                                                    },
                                                                    expanderCell: {
                                                                        style: { display: "none" },
                                                                    },
                                                                    table: {
                                                                        style: {
                                                                            maxHeight: '400px', // Adjust the height as per your need
                                                                            overflowY: 'auto', // Enables vertical scrolling
                                                                        },
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            }}
                                            expandOnRowClicked={false}
                                            customStyles={{
                                                rows: {
                                                    style: {
                                                        cursor: 'pointer', // 👈 ensures pointer cursor on all rows
                                                    },
                                                },
                                                headRow: {
                                                    style: {
                                                        color: '#fff',
                                                        backgroundColor: '#001f3f',
                                                        borderBottomColor: '#FFFFFF',
                                                        outline: '1px solid #FFFFFF',
                                                    },
                                                },
                                                expanderRow: {
                                                    style: { display: "table-row" },
                                                },
                                                expanderCell: {
                                                    style: { display: "none" },
                                                },
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <ChangesModal func={(e) => { check_ValidationError(e); check_Validation_Error(e); }} />
            <DeletePopUpModal func={!isProperty ? DeleteOffence : DeleteRelationship} />
            <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possessionID, setPossessionID, possessionIDVictim, setPossessionIDVictim, possenSinglData, setPossenSinglData, GetSingleDataPassion, setStatesChangeStatus }} />
        </>
    )
}

export default OffenderVictim






