import React, { useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Select from "react-select";
import { Decrypt_Id_Name, isLockOrRestrictModule, LockFildscolour, Requiredcolour } from '../../../../Common/Utility';
import { get_DrugManufactured_Drp_Data, get_PropertyLossCode_Drp_Data, get_TypeMarijuana_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import PropListng from '../../../ShowAllList/PropListng';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useLocation } from 'react-router-dom';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';

const Other = (props) => {

    const { ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails = false, isLocked, setIsLocked } = props
    const { setChangesStatus, changesStatus, } = useContext(AgencyContext);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const typeMarijuanaDrpData = useSelector((state) => state.DropDown.typeMarijuanaDrpData);
    const drugManufacturedDrpData = useSelector((state) => state.DropDown.drugManufacturedDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [editval, setEditval] = useState([]);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [DrugMarijuraNPStatus, setDrugMarijuraNPStatus] = useState(false);
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'MarijuanaType': '', 'NumLabs': '', 'DrugType': '', 'NumFields': '', 'PropertyID': '',
        'MasterPropertyID': '', 'ModifiedByUserFK': '', 'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
    });

    const [errors, setErrors] = useState({ 'MarijuanaTypeError': '', 'NumFieldsError': '', 'NumLabsError': '', });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("P091", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setPermissionForAdd(false);
            setPermissionForEdit(false);
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (loginAgencyID) {
            if (typeMarijuanaDrpData?.length === 0) dispatch(get_TypeMarijuana_Drp_Data(loginAgencyID));
            if (drugManufacturedDrpData?.length === 0) dispatch(get_DrugManufactured_Drp_Data(loginAgencyID));
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (DecPropID || DecMPropID) {
            GetSingleData(DecPropID, DecMPropID);
            get_Data_Drug_Modal(DecPropID, DecMPropID);
        }
    }, [DecPropID]);

    const GetSingleData = (propertyID, masterPropertyID) => {
        const val = { PropertyID: propertyID, MasterPropertyID: masterPropertyID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        const val2 = { MasterPropertyID: masterPropertyID, PropertyID: 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('Property/GetSingleData_Property', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
            if (res) {

                setEditval(res);
            } else { setEditval([]); }
        })
    }

    const get_Data_Drug_Modal = (propertyID, masterPropertyId) => {
        const val = { 'PropertyID': propertyID, 'MasterPropertyID': masterPropertyId, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('PropertyDrug/GetData_PropertyDrug', val).then((res) => {
            if (res) {
                const validationError = res?.filter((item) => { if (item?.DrugTypeCode === "E" && item?.PropertyDrugMeasureCode === "NP") { return item } })
                setDrugMarijuraNPStatus(validationError?.length > 0);
            } else {
                setDrugMarijuraNPStatus(false);
            }
        })
    }

    useEffect(() => {
        if (editval?.length > 0) {
            setValue({
                ...value,
                'MarijuanaType': editval[0]?.MarijuanaType ? parseInt(editval[0]?.MarijuanaType) : 0, 'NumLabs': editval[0]?.NumLabs,
                'DrugType': editval[0]?.DrugType ? parseInt(editval[0]?.DrugType) : null,
                'NumFields': editval[0]?.NumFields, 'PropertyID': DecPropID, 'MasterPropertyID': DecPropID, 'ModifiedByUserFK': loginPinID,
            })
        }
    }, [editval])

    const check_Validation_Error = () => {
        const MarijuanaTypeErr = DrugMarijuraNPStatus ? RequiredFieldIncident(value.MarijuanaType) : 'true';
        const NumFieldsErr = value?.MarijuanaType ? RequiredFieldIncident(value.NumFields) : 'true';
        const NumLabsErr = value?.DrugType ? RequiredFieldIncident(value.NumLabs) : 'true';
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['MarijuanaTypeError']: MarijuanaTypeErr || prevValues['MarijuanaTypeError'],
                ['NumFieldsError']: NumFieldsErr || prevValues['NumFieldsError'],
                ['NumLabsError']: NumLabsErr || prevValues['NumLabsError']
            }
        })
    }

    const { NumFieldsError, NumLabsError, MarijuanaTypeError } = errors

    useEffect(() => {
        if (NumFieldsError === 'true' && NumLabsError === 'true' && MarijuanaTypeError === 'true') {
            updateMarijuna()
        }
    }, [NumFieldsError, NumLabsError, MarijuanaTypeError]);

    const updateMarijuna = () => {
        const { MarijuanaType, NumLabs, DrugType, NumFields, PropertyID, MasterPropertyID, IsMaster } = value
        const val = {
            'MarijuanaType': MarijuanaType, 'NumLabs': NumLabs, 'DrugType': DrugType, 'NumFields': NumFields,
            'PropertyID': DecPropID, 'MasterPropertyID': DecMPropID, 'IsMaster': IsMaster, 'ModifiedByUserFK': loginPinID,
        }
        AddDeleteUpadate('Property/Update_MiscellaneousInformation', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            setChangesStatus(false); setStatesChangeStatus(false);
            GetSingleData(DecPropID, DecMPropID)
        })
    }

    const Reset = () => {
        setValue({ ...value, 'MarijuanaType': null, 'NumLabs': '', 'DrugType': null, 'NumFields': '', });
        setStatesChangeStatus(false);
    }

    const HandleChanges = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {

            if (e.target.name === 'NumFields' || e.target.name === 'NumLabs') {
                var ele = e.target.value.replace(/[^0-9\.]/g, "")
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            } else {

                setValue({
                    ...value,
                    [e.target.name]: e.target.value
                })
            }
        } else {

            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            if (name === 'MarijuanaType') {
                setValue({ ...value, 'MarijuanaType': e.value, 'NumFields': '', });
                setErrors({ ...errors, 'NumFieldsError': "" });
            } else if (name === 'DrugType') {
                setValue({ ...value, 'DrugType': e.value, 'NumLabs': '', });
                setErrors({ ...errors, 'NumLabsError': "" });
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === 'MarijuanaType') {
                setValue({ ...value, [name]: null, 'NumFields': '', });
                setErrors({ ...errors, 'NumFieldsError': "" });
            } else if (name === 'DrugType') {
                setValue({ ...value, 'DrugType': null, 'NumLabs': '', });
                setErrors({ ...errors, 'NumLabsError': "" });
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            <PropListng {...{ ListData }} />
            <div className="col-12">
                <div className="row mt-1">
                    <div className="col-4 col-md-4 col-lg-3  mt-3">
                        <label htmlFor="" className='new-label'>
                            Type Marijuana Fields and Gardens
                            {errors.MarijuanaTypeError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MarijuanaTypeError}</p>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-8 col-md-8 col-lg-3 mt-2">
                        <Select
                            name='MarijuanaType'
                            value={typeMarijuanaDrpData?.filter((obj) => obj.value === value?.MarijuanaType)}
                            options={typeMarijuanaDrpData}
                            onChange={(e) => ChangeDropDown(e, 'MarijuanaType')}
                            isClearable
                            placeholder="Select..."
                            styles={isLockOrRestrictModule("Lock", editval[0]?.MarijuanaType, isLocked) ? LockFildscolour : DrugMarijuraNPStatus ? Requiredcolour : customStylesWithOutColor}
                            isDisabled={isLockOrRestrictModule("Lock", editval[0]?.MarijuanaType, isLocked) ? true : false}
                        />
                    </div>

                    <div className="col-4 col-md-4 col-lg-3  mt-2">
                        <label htmlFor="" className='new-label'>Type of Drug Manufactured</label>
                    </div>
                    <div className="col-8 col-md-8 col-lg-3 mt-1">
                        <Select
                            name='DrugType'
                            value={drugManufacturedDrpData?.filter((obj) => obj.value === value?.DrugType)}
                            options={drugManufacturedDrpData}
                            onChange={(e) => ChangeDropDown(e, 'DrugType')}
                            isClearable
                            placeholder="Select..."
                            styles={isLockOrRestrictModule("Lock", editval[0]?.DrugType, isLocked) ? LockFildscolour : customStylesWithOutColor}

                            isDisabled={isLockOrRestrictModule("Lock", editval[0]?.DrugType, isLocked) ? true : false}
                        />
                    </div>
                    <div className="col-4 col-md-4 col-lg-3  mt-3">
                        <label htmlFor="" className='new-label'>
                            Number Marijuana Fields and Gardens
                            {errors.NumFieldsError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NumFieldsError}</p>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-8 col-md-8 col-lg-3 mt-2 text-field">
                        <input
                            type="text" name='NumFields' id='NumFields'
                            maxLength={1} value={value?.NumFields} onChange={HandleChanges}
                            required
                            autoComplete='off'
                            className={isLockOrRestrictModule("Lock", editval[0]?.NumFields, isLocked) ? "LockFildsColor" : value?.MarijuanaType ? 'requiredColor' : 'readonlyColor'}
                            disabled={isLockOrRestrictModule("Lock", editval[0]?.NumFields, isLocked) ? true : value?.MarijuanaType ? false : true}
                        />
                    </div>

                    <div className="col-4 col-md-4 col-lg-3  mt-3">
                        <label htmlFor="" className='new-label'>
                            Number of Clandestine Labs Seized
                            {errors.NumLabsError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NumLabsError}</p>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-8 col-md-8 col-lg-3 mt-2 text-field">
                        <input
                            type="text" name='NumLabs' id='NumLabs'
                            maxLength={1}
                            value={value?.NumLabs}
                            className={isLockOrRestrictModule("Lock", editval[0]?.NumLabs, isLocked) ? "LockFildsColor" : value?.DrugType ? 'requiredColor' : 'readonlyColor'}
                            disabled={isLockOrRestrictModule("Lock", editval[0]?.NumLabs, isLocked) ? true : value?.DrugType ? false : true}
                            onChange={HandleChanges}
                            required autoComplete='off' />
                    </div>
                </div>

                {/* {!isViewEventDetails && */}
                    <div className="col-12 col-md-12 col-lg-12 mt-2 mb-1 text-right">
                        {
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.Changeok ?
                                    <button type="button" disabled={!statesChangeStatus} className="btn btn-md py-1 btn-success" onClick={() => { check_Validation_Error() }}>Update</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" disabled={!statesChangeStatus} className="btn btn-md py-1 btn-success" onClick={() => { check_Validation_Error() }}>Update</button>
                        }
                    </div>
                {/* } */}

            </div>
            <ChangesModal func={updateMarijuna} setToReset={Reset} />
        </>
    )
}

export default Other