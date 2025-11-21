import { useContext, useEffect, useState, useRef } from 'react';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormatwithoutcode, Comman_changeArrayFormatBasicInfowithoutcode, Comman_changeArrayFormatBasicInfo, Comman_changeArrayFormatJustfiableHomicide, threeColArray, threeColVictimInjuryArray, threeColArrayWithCode } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { components } from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../../redux/api';
import { Decrypt_Id_Name, isLockOrRestrictModule, MultiSelectLockedStyle, nibrscolourStyles } from '../../../../../../Common/Utility';
import NameListing from '../../../../../ShowAllList/NameListing';
import ListModal from '../../../../../Utility/ListManagementModel/ListModal';
import { assult_Type_Nibrs_Errors, check_injuryType_Nibrs, check_justifiy_Homicide, ErrorTooltipComp } from '../../../../NameNibrsErrors';

const Home = (props) => {

    const { DecNameID, DecMasterNameID, DecIncID, victimID, offenceCodes, victimCode, nibFieldStatusOrErr, isCrimeAgainsPerson, isLocked } = props

    const { get_NameVictim_Count, get_Name_Count, nibrsSubmittedName, } = useContext(AgencyContext);

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const SelectedValue = useRef();
    const [propertyDrp, setPropertyDrp] = useState();
    const [justifiableHomiDrp, setJustifiableHomiDrp] = useState();
    const [justifiableHomiVal, setJustifiableHomiVal] = useState();
    const [officerDrpData, setOfficerDrpData] = useState();
    const [injuryTypeDrp, setInjuryTypeDrp] = useState();
    const [assaultDrp, setAssaultDrp] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [nameID, setNameID] = useState('');
    const [incidentID, setIncidentID] = useState();
    const [assultCodeArr, setAssultCodeArr] = useState([]);
    const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
    const [propertyEditVal, setPropertyEditVal] = useState();
    const [injuryTypeEditVal, setInjuryTypeEditVal] = useState();
    const [assaultEditVal, setAssaultEditVal] = useState();

    //ids
    const [officerID, setofficerID] = useState();
    const [justifiyID, setJustifiyID] = useState();
    const [victimInjuryID, setVictimInjuryID] = useState();
    const [assaultID, setAssaultID] = useState();
    const [propertyID, setPropertyID] = useState();
    const [openPage, setOpenPage] = useState('');

    const MultiValue = props => (
        <components.MultiValue {...props}>
            <span>{props.data.label}</span>
        </components.MultiValue>
    );


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);

        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecNameID) { setNameID(DecNameID); setIncidentID(DecIncID); }
    }, [DecNameID, loginPinID,]);

    useEffect(() => {
        if (victimID) {
            get_Property_Data(victimID); get_Victim_Officer_Data(victimID); get_RelationShip_Data(victimID); get_InjuryType_Data(victimID); get_Assults_Data(victimID); get_Data_RelationShip_Drp(victimID); get_Data_InjuryType_Drp(victimID);
            get_Assults_Drp(victimID); get_Property_DropDown(DecIncID, victimID);
            get_NameVictim_Count(victimID); get_Victim_Officer_Drp(victimID, loginAgencyID);
        }
    }, [victimID])

    useEffect(() => {
        if (typeOfSecurityEditVal) { setofficerID(typeOfSecurityEditVal) }
    }, [typeOfSecurityEditVal])

    useEffect(() => {
        if (justifiableHomiVal) {
            setJustifiyID(justifiableHomiVal)
        }
    }, [justifiableHomiVal])

    useEffect(() => {
        if (injuryTypeEditVal) { setVictimInjuryID(injuryTypeEditVal) }
    }, [injuryTypeEditVal])

    useEffect(() => {
        if (assaultEditVal) {
            setAssaultID(assaultEditVal)
            const assultArray = assaultEditVal?.map((item) => item?.code);
            setAssultCodeArr(assultArray);
        }
    }, [assaultEditVal])

    useEffect(() => {
        if (propertyEditVal) { setPropertyID(propertyEditVal) }
    }, [propertyEditVal])

    const get_InjuryType_Data = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('InjuryVictim/GetData_InjuryVictim', val).then((res) => {
            if (res) {
                setInjuryTypeEditVal(Comman_changeArrayFormatBasicInfowithoutcode(res, 'VictimInjuryID', 'NameID', 'PretendToBeID', 'NameEventInjuryID', 'VictimInjury_Description'));
            } else {
                setInjuryTypeEditVal([]);
            }
        })
    }

    const get_Data_InjuryType_Drp = (incidentID, victimID) => {
        const val = { 'IncidentID': incidentID, 'VictimID': victimID }
        fetchPostData('InjuryVictim/GetData_InsertVictimInjury', val).then((data) => {
            if (data) {
                setInjuryTypeDrp(threeColVictimInjuryArray(data, 'VictimInjuryID', 'Description', 'InjuryCode'))
            } else {
                setInjuryTypeDrp([])
            }
        })
    }

    const get_RelationShip_Data = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('VictimJustifiableHomicide/GetData_VictimJustifiableHomicide', val).then((res) => {
            if (res) {
                setJustifiableHomiVal(Comman_changeArrayFormatJustfiableHomicide(res, 'VictimJustifiableHomicideID', 'JustifiableHomicideID', 'PretendToBeID', 'JustifiableHomicide_Description', 'JustifiableHomicideCode'));

            } else {
                setJustifiableHomiVal([]);
            }
        })
    }

    const get_Data_RelationShip_Drp = (victimID) => {
        const val = { 'VictimID': victimID }
        fetchPostData('VictimJustifiableHomicide/GetData_InsertJustifiableHomicide', val).then((data) => {
            if (data) {
                setJustifiableHomiDrp(threeColVictimInjuryArray(data, 'JustifiableHomicideID', 'Description', "JustifiableHomicideCode",))

            } else {
                setJustifiableHomiDrp([])
            }
        })
    }

    const get_Victim_Officer_Data = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('VictimOfficer/GetData_VictimOfficer', val).then((res) => {
            if (res) {
                setTypeOfSecurityEditVal(Comman_changeArrayFormatwithoutcode(res, 'VictimOfficerID', 'NameID', 'PretendToBeID', 'OfficerID', 'Officer_Name'));
            } else {
                setTypeOfSecurityEditVal([]);
            }
        })
    }

    const get_Victim_Officer_Drp = (victimID, loginAgencyID) => {
        const val = { 'VictimID': victimID, 'AgencyID': loginAgencyID, 'IncidentID': 0 }
        fetchPostData('VictimOfficer/GetData_InsertVictimOfficer', val).then((data) => {
            if (data) {
                setOfficerDrpData(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'))
            } else {
                setOfficerDrpData([])
            }
        })
    }

    const get_Assults_Data = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('VictimAssaultType/GetData_VictimAssaultType', val).then((res) => {
            if (res) {
                setAssaultEditVal(Comman_changeArrayFormatBasicInfo(res, 'NameEventAssaultID', 'Assault_Description', 'PretendToBeID', 'AssaultID', 'AssaultCode'));

            } else {
                setAssaultEditVal([]);
            }
        })
    }

    const get_Assults_Drp = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('VictimAssaultType/GetData_InsertVictimAssaultType', val).then((data) => {
            if (data) {

                setAssaultDrp(threeColArrayWithCode(data, 'AssaultTypeID', 'Description', 'AssaultCode'));

            } else {
                setAssaultDrp([])
            }
        })
    }

    const get_Property_Data = (victimID) => {
        const val = { 'VictimID': victimID }
        fetchPostData('VictimProperty/GetData_VictimProperty', val).then((res) => {
            if (res) {
                setPropertyEditVal(Comman_changeArrayFormatwithoutcode(res, 'VictimPropertyID', 'NameID', 'PretendToBeID', 'PropertyID', 'Description'));
            } else {
                setPropertyEditVal([]);
            }
        })
    }

    const get_Property_DropDown = (incidentID, victimID) => {
        const val = { 'IncidentID': incidentID, 'VictimID': victimID, }
        fetchPostData('VictimProperty/GetData_InsertVictimProperty', val).then((data) => {
            if (data) {
                setPropertyDrp(threeColArray(data, 'PropertyID', 'Description'))
            } else {
                setPropertyDrp([])
            }
        })
    }

    const InSertBasicInfo = (id, col1, url) => {

        const val = {
            'NameID': nameID,
            'VictimID': victimID,
            [col1]: id,
            'CreatedByUserFK': loginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                get_Name_Count(DecNameID, DecMasterNameID);

                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                col1 === 'OfficerID' && get_Victim_Officer_Data(victimID); get_Victim_Officer_Drp(victimID, loginAgencyID);
                col1 === 'PropertyID' && get_Property_Data(victimID); get_Property_DropDown(incidentID, victimID);
                col1 === 'JustifiableHomicideID' && get_RelationShip_Data(victimID); get_Data_RelationShip_Drp(victimID);
                col1 === 'VictimInjuryID' && get_InjuryType_Data(victimID);
                col1 === 'AssaultID' && get_Assults_Data(victimID); get_Assults_Drp(victimID)
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const DelSertBasicInfo = (victimOfficerID, col1, url) => {

        const val = {
            [col1]: victimOfficerID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                get_Name_Count(DecNameID, DecMasterNameID);

                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                if (col1 === 'VictimOfficerID') {
                    get_Victim_Officer_Data(victimID);
                    get_Victim_Officer_Drp(victimID, loginAgencyID);
                }

                else if (col1 === 'VictimPropertyID') {
                    get_Property_Data(victimID);
                    get_Property_DropDown(incidentID, victimID);
                } else if (col1 === 'VictimJustifiableHomicideID') {
                    get_RelationShip_Data(victimID);
                    get_Data_RelationShip_Drp(victimID);
                } else if (col1 === 'NameEventInjuryID') {
                    get_InjuryType_Data(victimID);
                } else if (col1 === 'NameEventAssaultID') {
                    get_Assults_Data(victimID);
                    get_Assults_Drp(victimID);
                }
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const officerOnChange = (multiSelected) => {

        setofficerID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < typeOfSecurityEditVal?.length) {
            let missing = null;
            let i = typeOfSecurityEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
            }
            DelSertBasicInfo(missing.value, 'VictimOfficerID', 'VictimOfficer/Delete_VictimOfficer')
        } else {
            InSertBasicInfo(multiSelected[len].value, 'OfficerID', 'VictimOfficer/Insert_VictimOfficer')
        }
    }

    const JustifuableOnChange = (multiSelected) => {
        setJustifiyID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < justifiableHomiVal?.length) {
            let missing = null;
            let i = justifiableHomiVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(justifiableHomiVal[--i])) ? missing : justifiableHomiVal[i];
            }
            DelSertBasicInfo(missing.id, 'VictimJustifiableHomicideID', 'VictimJustifiableHomicide/Delete_VictimJustifiableHomicide')
        } else {
            InSertBasicInfo(multiSelected[len].value, 'JustifiableHomicideID', 'VictimJustifiableHomicide/Insert_VictimJustifiableHomicide')
        }
    }

    const InjuryTypeOnChange = (multiSelected) => {

        setVictimInjuryID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < injuryTypeEditVal?.length) {
            let missing = null;
            let i = injuryTypeEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(injuryTypeEditVal[--i])) ? missing : injuryTypeEditVal[i];
            }
            DelSertBasicInfo(missing.id, 'NameEventInjuryID', 'InjuryVictim/Delete_VictimInjury')
        } else {
            InSertBasicInfo(multiSelected[len].value, 'VictimInjuryID', 'InjuryVictim/Insert_VictimInjury')
        }
    }

    const assaultOnChange = (multiSelected) => {

        setAssaultID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < assaultEditVal?.length) {
            let missing = null;
            let i = assaultEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(assaultEditVal[--i])) ? missing : assaultEditVal[i];
            }
            DelSertBasicInfo(missing.value, 'NameEventAssaultID', 'VictimAssaultType/Delete_VictimAssaultType')
        } else {
            InSertBasicInfo(multiSelected[len].value, 'AssaultID', 'VictimAssaultType/Insert_VictimAssaultType')
        }
    }

    const PropertyOnChange = (multiSelected) => {

        setPropertyID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < propertyEditVal?.length) {
            let missing = null;
            let i = propertyEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(propertyEditVal[--i])) ? missing : propertyEditVal[i];
            }
            DelSertBasicInfo(missing.value, 'VictimPropertyID', 'VictimProperty/Delete_VictimProperty')
        } else {
            InSertBasicInfo(multiSelected[len].value, 'PropertyID', 'VictimProperty/Insert_VictimProperty')
        }
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            <NameListing />
            <div className="col-12 " id='display-not-form'>
                <div className="col-12 col-md-12  p-0" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">Other Victim</p>
                    </div>
                </div>
                <div className="row pt-1">
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Officer</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4  mt-2" >
                        <Select
                            name='OfficerID'
                            value={officerID}
                            options={officerDrpData}
                            isClearable={false}
                            closeMenuOnSelect={false}
                            placeholder="Select.."
                            ref={SelectedValue}
                            className="basic-multi-select"
                            isMulti
                            components={{ MultiValue, }}
                            onChange={(e) => officerOnChange(e)}
                            // styles={customStylesWithOutColor}
                            styles={isLockOrRestrictModule("Lock", typeOfSecurityEditVal, isLocked, true) ? MultiSelectLockedStyle : customStylesWithOutColor}
                            isDisabled={isLockOrRestrictModule("Lock", typeOfSecurityEditVal, isLocked, true) ? true : false}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-4">
                        <span data-toggle="modal" data-target="#ListModel" className='new-link'>
                            <span onClick={() => { setOpenPage('Justifiable Homicide') }}> Justifiable Homicide </span>
                            {
                                loginAgencyState === 'TX' ?
                                    nibFieldStatusOrErr?.JustHomicide ? <ErrorTooltipComp ErrorStr={nibFieldStatusOrErr?.JustHomicideError} />
                                        :
                                        check_justifiy_Homicide(assultCodeArr, justifiyID, offenceCodes, 'Tooltip')
                                    :
                                    null
                            }
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4  mt-2" >
                        <Select
                            name='JustifiableHomicideID'
                            value={justifiyID}
                            isClearable={false}
                            options={justifiableHomiDrp}
                            closeMenuOnSelect={false}
                            placeholder="Select.."
                            ref={SelectedValue}
                            components={{ MultiValue, }}
                            onChange={(e) => JustifuableOnChange(e)}
                            className="basic-multi-select"
                            isMulti
                            styles={
                                isLockOrRestrictModule("Lock", justifiableHomiVal, isLocked, true) ? MultiSelectLockedStyle :
                                    loginAgencyState === 'TX' ?
                                        check_justifiy_Homicide(assultCodeArr, justifiyID, offenceCodes, 'Color') ? check_justifiy_Homicide(assultCodeArr, justifiyID, offenceCodes, 'Color') : customStylesWithOutColor
                                        :
                                        customStylesWithOutColor
                            }
                            isDisabled={isLockOrRestrictModule("Lock", justifiableHomiVal, isLocked, true) ? true : false}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <span data-toggle="modal" data-target="#ListModel" className='new-link'>
                            <span onClick={() => { setOpenPage('Injury Type') }} >Injury Type </span>
                            {
                                loginAgencyState === 'TX' ?
                                    nibFieldStatusOrErr?.InjuryType ? <ErrorTooltipComp ErrorStr={nibFieldStatusOrErr?.InjuryTypeError} />
                                        :
                                        <></>
                                    :
                                    <>
                                    </>
                            }
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4  mt-2" >
                        <Select
                            name='VictimInjuryID'
                            value={victimInjuryID}
                            isClearable={false}
                            options={injuryTypeDrp}
                            closeMenuOnSelect={false}
                            placeholder="Select.."
                            ref={SelectedValue}
                            components={{ MultiValue, }}
                            onChange={(e) => InjuryTypeOnChange(e)}
                            className="basic-multi-select"
                            isMulti
                            menuPlacement='top'
                            // styles={customStylesWithOutColor}
                            // isDisabled={nibrsSubmittedName === 1 && victimInjuryID?.length > 0}
                            styles={isLockOrRestrictModule("Lock", injuryTypeEditVal, isLocked, true) ? MultiSelectLockedStyle : customStylesWithOutColor}
                            isDisabled={isLockOrRestrictModule("Lock", injuryTypeEditVal, isLocked, true) || (nibrsSubmittedName === 1 && victimInjuryID?.length > 0)}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <span data-toggle="modal" data-target="#ListModel" className='new-link'>
                            <span onClick={() => { setOpenPage('Assault Type') }}>Assault Type </span>
                            {
                                loginAgencyState === 'TX' ?
                                    nibFieldStatusOrErr?.AssaultType ? <ErrorTooltipComp ErrorStr={nibFieldStatusOrErr?.AssaultTypeError} />
                                        :
                                        assultCodeArr?.includes("08") && offenceCodes?.length < 2 ? <ErrorTooltipComp ErrorStr={'Must have multiple offenses when Assault/Homicide Circumstances = 08'} />
                                            :
                                            assult_Type_Nibrs_Errors(assultCodeArr, offenceCodes, 'Tooltip')
                                    :
                                    customStylesWithOutColor
                            }

                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4  mt-2" >
                        <Select
                            name='AssaultID'
                            value={assaultID}
                            isClearable={false}
                            options={assaultDrp}
                            closeMenuOnSelect={false}
                            placeholder="Select.."
                            ref={SelectedValue}
                            className="basic-multi-select"
                            isMulti
                            components={{ MultiValue, }}
                            onChange={(e) => assaultOnChange(e)}
                            menuPlacement='top'
                            // isDisabled={nibrsSubmittedName === 1 && victimInjuryID?.length > 0}
                            styles={
                                isLockOrRestrictModule("Lock", assaultEditVal, isLocked, true) ? MultiSelectLockedStyle :
                                    loginAgencyState === 'TX' ?
                                        assultCodeArr?.includes("08") && offenceCodes?.length < 2 ? nibrscolourStyles
                                            :
                                            assult_Type_Nibrs_Errors(assultCodeArr, offenceCodes, 'Color') ? assult_Type_Nibrs_Errors(assultCodeArr, offenceCodes, 'Color') : customStylesWithOutColor
                                        :
                                        customStylesWithOutColor
                            }
                            isDisabled={isLockOrRestrictModule("Lock", assaultEditVal, isLocked, true) || (nibrsSubmittedName === 1 && victimInjuryID?.length > 0)}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Property</label>
                    </div>
                    <div className="col-6 col-md-6 col-lg-10 mt-2">
                        <Select
                            options={propertyDrp}
                            value={propertyID}
                            isClearable={false}
                            closeMenuOnSelect={false}
                            placeholder="Select.."
                            ref={SelectedValue}
                            className="basic-multi-select"
                            isMulti
                            components={{ MultiValue, }}
                            onChange={(e) => PropertyOnChange(e)}
                            name='PropertyID'
                            menuPlacement='top'
                            // styles={customStylesWithOutColor}
                            styles={isLockOrRestrictModule("Lock", propertyEditVal, isLocked, true) ? MultiSelectLockedStyle : customStylesWithOutColor}
                            isDisabled={isLockOrRestrictModule("Lock", propertyEditVal, isLocked, true)}
                        />
                    </div>
                </div>
            </div>
            <ListModal {...{ openPage, setOpenPage }} />
        </>
    )
}

export default Home