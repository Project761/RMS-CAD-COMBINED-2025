import Select from "react-select";
import React, { useContext, useEffect, useState } from 'react'
import { Decrypt_Id_Name, customStylesWithOutColor } from "../../../../Common/Utility";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { get_LocalStoreData } from "../../../../../redux/actions/Agency";
import { get_BloodType_Drp_Data, get_Body_XRay_Drp_Data, get_Circumcision_Drp_Data, get_Circumstances_Drp_Data, get_Corrected_Vision_Drp_Data, get_Ever_DonatedBlood_Drp_Data, get_Fingerprinted_Drp_Data, get_Missing_CMC_Drp_Data } from "../../../../../redux/actions/DropDownsData";
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
    const bloodTypeDrpData = useSelector((state) => state.DropDown.bloodTypeDrpData);
    const circumcisionDrpData = useSelector((state) => state.DropDown.circumcisionDrpData);

    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [Editval, setEditval] = useState();
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'CMCID': "", 'BloodDonateID': "", 'BloodTypeID': "", 'CircumcisionID': "", 'CircumstancesID': "", 'XrayID': "", 'CorrVisionID': "", 'VisionPerscription': "", 'FingerprintID': "", 'FingerprintClassification': "", 'IsDNA': "", 'IsPreviouslyMissing': "", 'IsDisability': "", 'IsFootprint': "", 'IsNoLongerMissing': "", 'MissingPersonID': "", 'ModifiedByUserFK': "",
    });

    const [errors, setErrors] = useState({
        'ReportingOfficerIDError': '', 'ReportedDttmError': '', 'PersonIDError': '', 'IncidentIDError': ''
    })

    const Reset = (e) => {
        setValue({
            ...value,
            'CMCID': "", 'BloodDonateID': "", 'BloodTypeID': "", 'CircumcisionID': "", 'CircumstancesID': "", 'XrayID': "", 'CorrVisionID': "", 'VisionPerscription': "", 'FingerprintID': "", 'FingerprintClassification': "", 'IsDNA': "", 'IsPreviouslyMissing': "", 'IsDisability': "", 'IsFootprint': "", 'IsNoLongerMissing': "",
        }); setStatesChangeStatus(false);
        if (Editval[0]?.CMCID?.length || Editval[0]?.BloodDonateID?.length || Editval[0]?.BloodTypeID?.length || Editval[0]?.CircumcisionID?.length || Editval[0]?.CircumstancesID?.length || Editval[0]?.XrayID?.length || Editval[0]?.CorrVisionID?.length || Editval[0]?.VisionPerscription?.length || Editval[0]?.FingerprintID?.length || Editval[0]?.FingerprintClassification?.length > 0) {
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
                'CMCID': Editval[0]?.CMCID, 'BloodDonateID': Editval[0]?.BloodDonateID, 'BloodTypeID': Editval[0]?.BloodTypeID, 'CircumcisionID': Editval[0]?.CircumcisionID, 'CircumstancesID': Editval[0]?.CircumstancesID, 'XrayID': Editval[0]?.XrayID, 'CorrVisionID': Editval[0]?.CorrVisionID, 'VisionPerscription': Editval[0]?.VisionPerscription, 'FingerprintID': Editval[0]?.FingerprintID, 'FingerprintClassification': Editval[0]?.FingerprintClassification, 'IsDNA': Editval[0]?.IsDNA, 'IsPreviouslyMissing': Editval[0]?.IsPreviouslyMissing, 'IsDisability': Editval[0]?.IsDisability, 'IsFootprint': Editval[0]?.IsFootprint, 'IsNoLongerMissing': Editval[0]?.IsNoLongerMissing, 'MissingPersonID': Editval[0]?.MissingPersonID, 'ModifiedByUserFK': loginPinID,
            });
        } else {
            setValue({
                ...value,
                'CMCID': "", 'BloodDonateID': "", 'BloodTypeID': "", 'CircumcisionID': "", 'CircumstancesID': "", 'XrayID': "", 'CorrVisionID': "", 'VisionPerscription': "", 'FingerprintID': "", 'FingerprintClassification': "", 'IsDNA': "", 'IsPreviouslyMissing': "", 'IsDisability': "", 'IsFootprint': "", 'IsNoLongerMissing': "", 'MissingPersonID': "", 'ModifiedByUserFK': "",
            });
        }
    }, [Editval, updateCount])


    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'CMCID') {
                setValue({ ...value, [name]: e.value })
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
                setValue({ ...value, [name]: e.value })
            } else {
                setValue({ ...value, [name]: e.value })
            }
        } else if (e === null) {
            setValue({ ...value, [name]: null })
        } else {
            setValue({ ...value, [name]: null })
        }
    }

    const HandleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e.target.name === 'IsDNA' || e.target.name === 'IsPreviouslyMissing' || e.target.name === 'IsDisability' || e.target.name === 'IsFootprint' || e.target.name === 'IsNoLongerMissing') {
            setValue({ ...value, [e.target.name]: e.target.checked })
        }
        else if (e.target.name === 'VisionPerscription' || e.target.name === 'FingerprintClassification') {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
        else {
            setValue({ ...value, [e.target.name]: null });
        }
    };

    const Update_NCIC_Information = () => {
        AddDeleteUpadate('MissingPerson/NCIC_Information', value).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); setStatesChangeStatus(false); setChangesStatus(false)
        })
    }
    return (
        <>
            <div className="col-12 mt-2">
                <div className="row">
                    <fieldset>
                        <legend>NCIC Information</legend>
                        <div className="col-12">
                            <div className="row ">
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">

                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('CMC') }}>
                                        CMC
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                                    <Select
                                        styles={customStylesWithOutColor}
                                        name="CMCID"
                                        value={missingCMCDrpData?.filter((obj) => obj.value === value?.CMCID)}
                                        options={missingCMCDrpData}
                                        onChange={(e) => { ChangeDropDown(e, 'CMCID') }}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">

                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Ever Donated Blood') }}>
                                        Ever Donated Blood
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 ">
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
                                <div className="col-4 col-md-4 col-lg-2 mt-1 ">
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

                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Circumcision') }}>
                                        Circumcision
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 ">
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
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">

                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Circumstances') }}>
                                        Circumstances
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 ">
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

                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Body X Ray') }}>
                                        Body-X-Rays
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 ">
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
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">

                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Corrected Vision') }}>
                                        Corrected Vision
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 ">
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
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                    <label htmlFor="" className='new-label'>Vision Prescription</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                    <input type="text" className='' name='VisionPerscription' value={value?.VisionPerscription} onChange={HandleChange} required />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">

                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Fingerprinted') }}>
                                        Fingerprinted
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                                    <Select
                                        styles={customStylesWithOutColor}
                                        name="FingerprintID"
                                        value={fingerPrintedDrpData?.filter((obj) => obj.value === value?.FingerprintID)}
                                        options={fingerPrintedDrpData}
                                        onChange={(e) => { ChangeDropDown(e, 'FingerprintID') }}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                    <label htmlFor="" className='new-label'>Fingerprint Classification</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field ">
                                    <input type="text" className='' name='FingerprintClassification' value={value?.FingerprintClassification} onChange={HandleChange} required />
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-6 col-md-6 col-lg-4 pl-5 ml-5 mt-2 " >
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="IsDNA" name='IsDNA' value={value?.IsDNA} onChange={HandleChange} checked={value?.IsDNA} />
                                        <label className="form-check-label" htmlFor="DNA">DNA</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-4 mt-2 " >
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="IsPreviouslyMissing" name='IsPreviouslyMissing' value={value?.IsPreviouslyMissing} onChange={HandleChange} checked={value?.IsPreviouslyMissing} />
                                        <label className="form-check-label" htmlFor="PreviouslyMissing">Previously Missing</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-3 mt-2 " >
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="IsDisability" name='IsDisability' value={value?.IsDisability} onChange={HandleChange} checked={value?.IsDisability} />
                                        <label className="form-check-label" htmlFor="Disability">Disability</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-4 mt-2 pl-5 ml-5" >
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="IsFootprint" name='IsFootprint' value={value?.IsFootprint} onChange={HandleChange} checked={value?.IsFootprint} />
                                        <label className="form-check-label" htmlFor="Footprint">Footprint</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-6 col-lg-4 mt-2 " >
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="IsNoLongerMissing" name='IsNoLongerMissing' value={value?.IsNoLongerMissing} onChange={HandleChange} checked={value?.IsNoLongerMissing} />
                                        <label className="form-check-label" htmlFor="NOlonger">No Longer Missing</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>

            </div>

            <div className="col-12  text-right p-0" style={{ marginTop: '-10px' }}>
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