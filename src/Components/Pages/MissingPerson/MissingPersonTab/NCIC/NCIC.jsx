import Select from "react-select";
import React, { useContext, useEffect, useState } from 'react'
import { Decrypt_Id_Name, customStylesWithOutColor } from "../../../../Common/Utility";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { get_LocalStoreData } from "../../../../../redux/actions/Agency";
import { get_BloodType_Drp_Data, get_Body_XRay_Drp_Data, get_Circumcision_Drp_Data, get_Circumstances_Drp_Data, get_Corrected_Vision_Drp_Data, get_Ever_DonatedBlood_Drp_Data, get_Fingerprinted_Drp_Data, get_Missing_CMC_Drp_Data, get_Skin_Tone_Drp_Data } from "../../../../../redux/actions/DropDownsData";
import { AgencyContext } from "../../../../../Context/Agency/Index";
import { AddDeleteUpadate, fetchPostData } from "../../../../hooks/Api";
import { toastifySuccess } from "../../../../Common/AlertMsg";
import ListModal from "../../../Utility/ListManagementModel/ListModal";
import ChangesModal from "../../../../Common/ChangesModal";
import { get_ScreenPermissions_Data } from "../../../../../redux/actions/IncidentAction";

const NCIC = (props) => {
    const { DecMissPerID, DecIncID } = props;

    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { setChangesStatus } = useContext(AgencyContext);

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const donatedBloodDrpData = useSelector((state) => state.DropDown.donatedBloodDrpData);
    const circumstancesDrpData = useSelector((state) => state.DropDown.circumstancesDrpData);
    const correctedVisionDrpData = useSelector((state) => state.DropDown.correctedVisionDrpData);
    const fingerPrintedDrpData = useSelector((state) => state.DropDown.fingerPrintedDrpData);
    const missingCMCDrpData = useSelector((state) => state.DropDown.missingCMCDrpData);
    const bodyXRayDrpData = useSelector((state) => state.DropDown.bodyXRayDrpData);
    const skinToneDrpData = useSelector((state) => state.DropDown.skinToneDrpData);
    const bloodTypeDrpData = useSelector((state) => state.DropDown.bloodTypeDrpData);
    const circumcisionDrpData = useSelector((state) => state.DropDown.circumcisionDrpData);
    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [Editval, setEditval] = useState();
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const option = [
        {
            label: "Yes",
            value: true
        },
        {
            label: "No",
            value: false
        }
    ]

    const [value, setValue] = useState({
        'CautionAndMedicalConditions': "", 'BloodDonateID': "", 'BloodTypeID': "", 'CircumcisionID': "", 'CircumstancesID': "", 'XrayID': "", 'CorrVisionID': "", 'VisionPerscription': "", 'FingerprintID': "", 'FingerprintClassification': "", 'IsDNA': "", 'IsPreviouslyMissing': "", 'IsDisability': "", 'IsFootprint': "", 'IsNoLongerMissing': "", 'MissingPersonID': "", 'ModifiedByUserFK': "", IsHasMissing: "", ByWhom: "", FingerprintClassification1: "", FingerprintClassification2: "", FingerprintClassification3: "", FingerprintClassification4: "", FingerprintClassification5: "", FingerprintClassification6: "", FingerprintClassification7: "", FingerprintClassification8: "", FingerprintClassification9: "", FingerprintClassification10: "", IsFootprintAvailable: "", SkinID: "", CautionAndMedicalConditions: "", IsGlasses: "", IsConLenses: "", IsDnaProfile: "", DnaLocation: "", MiscellaneousInfo: "", ModifiedByUserFK: "",
    });


    const Reset = (e) => {
        setValue({
            ...value,
            'CautionAndMedicalConditions': "", 'BloodDonateID': "", 'BloodTypeID': "", 'CircumcisionID': "", 'CircumstancesID': "", 'XrayID': "", 'CorrVisionID': "", 'VisionPerscription': "", 'FingerprintID': "", 'FingerprintClassification': "", 'IsDNA': "", 'IsPreviouslyMissing': "", 'IsDisability': "", 'IsFootprint': "", 'IsNoLongerMissing': "", IsHasMissing: "", ByWhom: "", FingerprintClassification1: "", FingerprintClassification2: "", FingerprintClassification3: "", FingerprintClassification4: "", FingerprintClassification5: "", FingerprintClassification6: "", FingerprintClassification7: "", FingerprintClassification8: "", FingerprintClassification9: "", FingerprintClassification10: "", IsFootprintAvailable: "", SkinID: "", CautionAndMedicalConditions: "", IsGlasses: "", IsConLenses: "", IsDnaProfile: "", DnaLocation: "", MiscellaneousInfo: "", ModifiedByUserFK: "",
        });
        setStatesChangeStatus(false);
        if (Editval[0]?.CautionAndMedicalConditions?.length || Editval[0]?.BloodDonateID?.length || Editval[0]?.BloodTypeID?.length || Editval[0]?.CircumcisionID?.length || Editval[0]?.CircumstancesID?.length || Editval[0]?.XrayID?.length || Editval[0]?.CorrVisionID?.length || Editval[0]?.VisionPerscription?.length || Editval[0]?.FingerprintID?.length || Editval[0]?.FingerprintClassification?.length > 0) {
            setUpdateCount(updateCount + 1)
        }
    }
    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);


    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("M122", localStoreData?.AgencyID, localStoreData?.PINID));
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
        if (DecMissPerID) {
            GetSingleData(DecMissPerID);
        }
    }, [DecMissPerID]);

    const GetSingleData = (ID) => {
        const val = { 'MissingPersonID': ID }
        fetchPostData('MissingPerson/GetSingleData_MissingPerson', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                } else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value,
                'ModifiedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'MissingPersonID': DecMissPerID, 'IsDNA': false, 'IsPreviouslyMissing': false, 'IsDisability': false, 'IsFootprint': false, 'IsNoLongerMissing': false
            });
            if (missingCMCDrpData?.length === 0) { dispatch(get_Missing_CMC_Drp_Data(loginAgencyID)) }
            if (donatedBloodDrpData?.length === 0) { dispatch(get_Ever_DonatedBlood_Drp_Data(loginAgencyID)) }
            if (circumstancesDrpData?.length === 0) { dispatch(get_Circumstances_Drp_Data(loginAgencyID)) }
            if (bodyXRayDrpData?.length === 0) { dispatch(get_Body_XRay_Drp_Data(loginAgencyID)) }
            if (skinToneDrpData?.length === 0) { dispatch(get_Skin_Tone_Drp_Data(loginAgencyID)) }
            if (correctedVisionDrpData?.length === 0) { dispatch(get_Corrected_Vision_Drp_Data(loginAgencyID)) }
            if (fingerPrintedDrpData?.length === 0) { dispatch(get_Fingerprinted_Drp_Data(loginAgencyID)) }
            if (bloodTypeDrpData?.length === 0) { dispatch(get_BloodType_Drp_Data(loginAgencyID)) }
            if (circumcisionDrpData?.length === 0) { dispatch(get_Circumcision_Drp_Data(loginAgencyID)) }
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (Editval) {
            setValue({
                ...value,
                'CautionAndMedicalConditions': Editval[0]?.CautionAndMedicalConditions, 'BloodDonateID': Editval[0]?.BloodDonateID, 'BloodTypeID': Editval[0]?.BloodTypeID, 'CircumcisionID': Editval[0]?.CircumcisionID, 'CircumstancesID': Editval[0]?.CircumstancesID, 'XrayID': Editval[0]?.XrayID, 'CorrVisionID': Editval[0]?.CorrVisionID, 'VisionPerscription': Editval[0]?.VisionPerscription, 'FingerprintID': Editval[0]?.FingerprintID, 'FingerprintClassification': Editval[0]?.FingerprintClassification, 'IsDNA': Editval[0]?.IsDNA, 'IsPreviouslyMissing': Editval[0]?.IsPreviouslyMissing, 'IsDisability': Editval[0]?.IsDisability, 'IsFootprint': Editval[0]?.IsFootprint, 'IsNoLongerMissing': Editval[0]?.IsNoLongerMissing, 'MissingPersonID': Editval[0]?.MissingPersonID, 'ModifiedByUserFK': loginPinID, IsHasMissing: Editval[0]?.IsHasMissing, ByWhom: Editval[0]?.ByWhom, FingerprintClassification1: Editval[0]?.FingerprintClassification1, FingerprintClassification2: Editval[0]?.FingerprintClassification2, FingerprintClassification3: Editval[0]?.FingerprintClassification3, FingerprintClassification4: Editval[0]?.FingerprintClassification4, FingerprintClassification5: Editval[0]?.FingerprintClassification5, FingerprintClassification6: Editval[0]?.FingerprintClassification6, FingerprintClassification7: Editval[0]?.FingerprintClassification7, FingerprintClassification8: Editval[0]?.FingerprintClassification8, FingerprintClassification9: Editval[0]?.FingerprintClassification9, FingerprintClassification10: Editval[0]?.FingerprintClassification10, IsFootprintAvailable: Editval[0]?.IsFootprintAvailable, SkinID: Editval[0]?.SkinID, CautionAndMedicalConditions: Editval[0]?.CautionAndMedicalConditions, IsGlasses: Editval[0]?.IsGlasses, IsConLenses: Editval[0]?.IsConLenses, IsDnaProfile: Editval[0]?.IsDnaProfile, DnaLocation: Editval[0]?.DnaLocation, MiscellaneousInfo: Editval[0]?.MiscellaneousInfo, ModifiedByUserFK: loginPinID,
            });
        } else {
            setValue({
                ...value,
                'CautionAndMedicalConditions': "", 'BloodDonateID': "", 'BloodTypeID': "", 'CircumcisionID': "", 'CircumstancesID': "", 'XrayID': "", 'CorrVisionID': "", 'VisionPerscription': "", 'FingerprintID': "", 'FingerprintClassification': "", 'IsDNA': "", 'IsPreviouslyMissing': "", 'IsDisability': "", 'IsFootprint': "", 'IsNoLongerMissing': "", 'MissingPersonID': "", 'ModifiedByUserFK': "", IsHasMissing: "", ByWhom: "", FingerprintClassification1: "", FingerprintClassification2: "", FingerprintClassification3: "", FingerprintClassification4: "", FingerprintClassification5: "", FingerprintClassification6: "", FingerprintClassification7: "", FingerprintClassification8: "", FingerprintClassification9: "", FingerprintClassification10: "", IsFootprintAvailable: "", SkinID: "", CautionAndMedicalConditions: "", IsGlasses: "", IsConLenses: "", IsDnaProfile: "", DnaLocation: "", MiscellaneousInfo: "", ModifiedByUserFK: "",
            });
        }
    }, [Editval, updateCount])


    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'CautionAndMedicalConditions') {
                // const id = []

                // value?.CautionAndMedicalConditions?.map((item, i) => { id.push(item.value); })
                // setValue({ ...value, [name]: id.toString(), })
                // Convert selected values to a comma-separated string
                const id = e.map(item => item.value).join(',');
                setValue({ ...value, [name]: id });
            } else if (name === 'BloodDonateID') {
                setValue({ ...value, [name]: e.value })
            } else if (name === 'BloodTypeID') {
                setValue({ ...value, [name]: e.value })
            }
            else if (name === 'CircumcisionID') {
                setValue({ ...value, [name]: e.value })
            } else if (name === 'CircumstancesID') {
                setValue({ ...value, [name]: e.value })
            }
            else if (name === 'XrayID') {
                setValue({ ...value, [name]: e.value })
            } else if (name === 'FingerprintID') {
                setValue({ ...value, [name]: e.value })
            }
            else if (name === 'CorrVisionID') {
                // Reset Glasses and Con Lenses when Corrected Vision is not "Yes" (value 1)
                if (e.value !== 1) {
                    setValue({ ...value, [name]: e.value, IsGlasses: false, IsConLenses: false, VisionPerscription: "" })
                } else {
                    setValue({ ...value, [name]: e.value })
                }
            } else {
                setValue({ ...value, [name]: e.value })
            }
        } else if (e === null) {
            // Reset Glasses and Con Lenses when Corrected Vision is cleared
            if (name === 'CorrVisionID') {
                setValue({ ...value, [name]: null, IsGlasses: false, IsConLenses: false, VisionPerscription: "" })
            } else {
                setValue({ ...value, [name]: null })
            }
        } else {
            setValue({ ...value, [name]: null })
        }
    }


    const HandleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);

        const { name, id, checked, value: inputValue } = e.target;



        // ✅ Special case for IsGlasses and IsConLenses - reset VisionPerscription when both are unchecked
        if (name === 'IsGlasses' || name === 'IsConLenses') {
            setValue(prev => {
                const newValue = { ...prev, [name]: checked };
                // Reset VisionPerscription if both Glasses and Con Lenses are now unchecked
                const isGlassesChecked = name === 'IsGlasses' ? checked : prev.IsGlasses;
                const isConLensesChecked = name === 'IsConLenses' ? checked : prev.IsConLenses;
                if (!isGlassesChecked && !isConLensesChecked) {
                    newValue.VisionPerscription = "";
                }
                return newValue;
            });
        }
        // ✅ For standard boolean checkboxes
        else if (
            name === 'IsDNA' ||
            name === 'IsPreviouslyMissing' ||
            name === 'IsDisability' ||
            name === 'IsFootprint' ||
            name === 'IsNoLongerMissing'
        ) {
            setValue({ ...value, [name]: checked });
        }

        // ✅ For text input fields
        else if (name === 'VisionPerscription' || name === 'FingerprintClassification1' || name === 'FingerprintClassification2' || name === 'FingerprintClassification3' || name === 'FingerprintClassification4' || name === 'FingerprintClassification5' || name === 'FingerprintClassification6' || name === 'FingerprintClassification7' || name === 'FingerprintClassification8' || name === 'FingerprintClassification9' || name === 'FingerprintClassification10' || name === 'ByWhom' || name === 'DnaLocation' || name === 'MiscellaneousInfo') {
            setValue({ ...value, [name]: inputValue });
        }

        // ✅ For all others
        else {
            setValue({ ...value, [name]: null });
        }
    };

    const Update_NCIC_Information = () => {
        AddDeleteUpadate('MissingPerson/NCIC_Information', value).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); setStatesChangeStatus(false); setChangesStatus(false)
            GetSingleData(DecMissPerID)
        })
    }
    return (
        <>
            <div className="col-12 mt-2">

                <fieldset>
                    <legend>Other Information</legend>
                    <div className="col-12">
                        <div className="row ">
                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                <div className="d-flex align-items-center ">
                                    <label htmlFor="" className='new-label mr-2 mb-0 text-nowrap'>Has the missing person ever been fingerprinted?</label>
                                    <div className="d-flex align-items-center">
                                        <input
                                            className="mr-1"
                                            type="radio"
                                            id="FingerprintYes"
                                            name="IsHasMissing"
                                            checked={value?.IsHasMissing === true}
                                            onChange={(e) => {
                                                setValue(prev => ({
                                                    ...prev,
                                                    IsHasMissing: true,
                                                    ByWhom: prev.ByWhom
                                                }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                        />
                                        <span className="mr-2">Yes</span>

                                        <input
                                            className="mr-1"
                                            type="radio"
                                            id="FingerprintNo"
                                            name="IsHasMissing"
                                            checked={value?.IsHasMissing === false}
                                            onChange={(e) => {
                                                setValue(prev => ({
                                                    ...prev,
                                                    IsHasMissing: false,
                                                    ByWhom: ''
                                                }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                        />
                                        <span>No</span>
                                    </div>

                                </div>
                            </div>

                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <label htmlFor="" className='new-label'>By Whom?</label>
                            </div>
                            <div className="col-6 col-md-6 col-lg-6 mt-1 text-field">
                                <input
                                    type="text"
                                    className='form-control'
                                    name='ByWhom'
                                    value={value?.ByWhom}
                                    onChange={HandleChange}
                                    disabled={!value?.IsHasMissing}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row ">
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <label htmlFor="" className='new-label'>Fingerprint Classification</label>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification1' value={value?.FingerprintClassification1} onChange={HandleChange} required />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification2' value={value?.FingerprintClassification2} onChange={HandleChange} required />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification3' value={value?.FingerprintClassification3} onChange={HandleChange} required />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification4' value={value?.FingerprintClassification4} onChange={HandleChange} required />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification5' value={value?.FingerprintClassification5} onChange={HandleChange} required />
                            </div>
                        </div>

                        <div className="row ">
                            <div className="offset-2 col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification6' value={value?.FingerprintClassification6} onChange={HandleChange} required />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification7' value={value?.FingerprintClassification7} onChange={HandleChange} required />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification8' value={value?.FingerprintClassification8} onChange={HandleChange} required />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification9' value={value?.FingerprintClassification9} onChange={HandleChange} required />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <input type="text" className='' name='FingerprintClassification10' value={value?.FingerprintClassification10} onChange={HandleChange} required />
                            </div>
                        </div>

                        <div className="row ">
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <label htmlFor="" className='new-label'>Footprints Available?</label>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 text-field">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="IsFootprintAvailable"
                                    value={option?.filter((obj) => obj.value === value?.IsFootprintAvailable)}
                                    options={option}
                                    onChange={(e) => { ChangeDropDown(e, 'IsFootprintAvailable') }}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">

                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Circumstances') }}>
                                    Circumstances
                                </span>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 ">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="CircumstancesID"
                                    value={circumstancesDrpData?.filter((obj) => obj.value === value?.CircumstancesID)}
                                    options={circumstancesDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'CircumstancesID') }}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>

                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">

                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Circumcision') }}>
                                    Circumcision
                                </span>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 ">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="CircumcisionID"
                                    value={circumcisionDrpData?.filter((obj) => obj.value === value?.CircumcisionID)}
                                    options={circumcisionDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'CircumcisionID') }}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>
                        </div>

                        <div className="row ">
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('CMC') }}>
                                    Caution and Medical Conditions
                                </span>
                            </div>
                            <div className="col-6 col-md-6 col-lg-6 mt-1 ">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="CautionAndMedicalConditions"
                                    // value={missingCMCDrpData?.filter((obj) => obj.value === value?.CautionAndMedicalConditions)}
                                    // value={missingCMCDrpData?.filter((obj) => value?.CautionAndMedicalConditions?.split(',').includes(obj.value.toString()))}
                                    value={missingCMCDrpData?.filter((obj) =>
                                        (String(value?.CautionAndMedicalConditions).split(',').includes(obj.value.toString()))
                                    )}
                                    options={missingCMCDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'CautionAndMedicalConditions') }}
                                    isClearable
                                    placeholder="Select..."
                                    isMulti={true}
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Body X Ray') }}>
                                    Body-X-Rays?
                                </span>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 ">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="XrayID"
                                    value={bodyXRayDrpData?.filter((obj) => obj.value === value?.XrayID)}
                                    options={bodyXRayDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'XrayID') }}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>
                        </div>

                        <div className="row ">

                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Ever Donated Blood') }}>
                                    Ever Donated Blood?
                                </span>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 ">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="BloodDonateID"
                                    value={donatedBloodDrpData?.filter((obj) => obj.value === value?.BloodDonateID)}
                                    options={donatedBloodDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'BloodDonateID') }}

                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">

                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Blood Type') }}>
                                    Blood Type
                                </span>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 ">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="BloodTypeID"
                                    value={bloodTypeDrpData?.filter((obj) => obj.value === value?.BloodTypeID)}
                                    options={bloodTypeDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'BloodTypeID') }}

                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Skin Tone') }}>
                                    Skin Tone
                                </span>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 ">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="SkinID"
                                    value={skinToneDrpData?.filter((obj) => obj.value === value?.SkinID)}
                                    options={skinToneDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'SkinID') }}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>

                        </div>

                        <div className="row ">
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Corrected Vision') }}>
                                    Corrected Vision?
                                </span>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-1 ">
                                <Select
                                    styles={customStylesWithOutColor}
                                    name="CorrVisionID"
                                    value={correctedVisionDrpData?.filter((obj) => obj.value === value?.CorrVisionID)}
                                    options={correctedVisionDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'CorrVisionID') }}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>

                            {value?.CorrVisionID === 1 && (
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                    <div className="d-flex align-items-center ">

                                        <div className='d-flex align-items-center'>
                                            <input
                                                className="mr-1"
                                                type="checkbox"
                                                id="IsGlasses"
                                                name="IsGlasses"
                                                value={value?.IsGlasses}
                                                onChange={HandleChange}
                                                checked={value?.IsGlasses}
                                            />
                                            <span className='mr-2'> Glasses</span>
                                            <input
                                                className="mr-1"
                                                type="checkbox"
                                                id="IsConLenses"
                                                name="IsConLenses"
                                                value={value?.IsConLenses}
                                                onChange={HandleChange}
                                                checked={value?.IsConLenses}
                                            />
                                            <span>Con Lenses</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(value?.IsGlasses === true || value?.IsConLenses === true) && (
                                <>
                                    <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                        <label htmlFor="" className='new-label'>Corrective Vision Prescription</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-4 mt-1 text-field">
                                        <input type="text" className='' name='VisionPerscription' value={value?.VisionPerscription} onChange={HandleChange} required />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="row ">

                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <label htmlFor="" className='new-label  mb-0 text-nowrap'>DNA Profile Indicator</label>
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <div className="d-flex align-items-center">
                                    <input
                                        className="mr-1"
                                        type="radio"
                                        id="IsDnaProfileYes"
                                        name="IsDnaProfile"
                                        checked={value?.IsDnaProfile === true}
                                        onChange={(e) => {
                                            setValue(prev => ({
                                                ...prev,
                                                IsDnaProfile: true,
                                                DnaLocation: prev.DnaLocation
                                            }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }}
                                    />
                                    <span className="mr-2">Yes</span>

                                    <input
                                        className="mr-1"
                                        type="radio"
                                        id="IsDnaProfileNo"
                                        name="IsDnaProfile"
                                        checked={value?.IsDnaProfile === false}
                                        onChange={(e) => {
                                            setValue(prev => ({
                                                ...prev,
                                                IsDnaProfile: false,
                                                DnaLocation: ''
                                            }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }}
                                    />
                                    <span>No</span>
                                </div>

                            </div>

                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                <label htmlFor="" className='new-label'>DNA Location</label>
                            </div>
                            <div className="col-6 col-md-6 col-lg-6 mt-1 text-field">
                                <input
                                    type="text"
                                    className='form-control'
                                    name='DnaLocation'
                                    value={value?.DnaLocation}
                                    onChange={HandleChange}
                                    disabled={!value?.IsDnaProfile}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Miscellaneous Information</legend>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1">
                                <label htmlFor="" className='new-label' style={{ float: 'left' }}>Miscellaneous (MIS) information such as build, handedness, any illness or diseases, clothing description, hair description, should be included. If more space is needed, attach additional sheet.</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-12 mt-1 text-field">

                                <textarea
                                    name='MiscellaneousInfo'
                                    value={value?.MiscellaneousInfo}
                                    onChange={HandleChange}
                                    className='form-control'
                                    rows='4'
                                    placeholder=''
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div className="col-12  text-right p-0">
                {
                    effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                        <button type="button" className="btn btn-sm btn-success  mr-4" disabled={!statesChangeStatus} onClick={Update_NCIC_Information} >Update</button>
                        : <></> :
                        <button type="button" className="btn btn-sm btn-success  mr-4" disabled={!statesChangeStatus} onClick={Update_NCIC_Information} >Update</button>
                }
            </div>
            <ListModal {...{ openPage, setOpenPage }} />
            <ChangesModal func={Update_NCIC_Information} setToReset={Reset} />

        </>
    )
}

export default NCIC