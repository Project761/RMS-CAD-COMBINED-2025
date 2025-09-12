import React, { useState, useEffect, useContext } from 'react'
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../../../Common/Utility';
import { Penalties_Valid, } from '../../../../../Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { get_LocalStoreData } from '../../../../../../../redux/actions/Agency';
import { useDispatch, useSelector } from 'react-redux';
import { get_ScreenPermissions_Data } from '../../../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../../../Common/ChangesModal';

const Penalties = (props) => {
    const { DecChargeId } = props
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { updateCount, setUpdateCount, setChangesStatus, changesStatusCount } = useContext(AgencyContext);
    const [ftaDate, setFtaDate] = useState();
    const [arrestChargeID, setArrestChargeID] = useState();
    const [editval, setEditval] = useState();
    const [loginPinID, setLoginPinID,] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    // permissions
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'Fine': '', 'CourtCost': '', 'OtherCost': '', 'FTADate': '', 'FTAAmount': '', 'LitigationTax': '', 'TotalPenalty': '', 'Comments': '', 'Years': '', 'Months': '',
        'Days': '', 'ChargePenaltyID': '', 'ChargeID': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'FineError': '', 'FTAAmount': '', 'CourtCost': '', 'OtherCost': '', 'LitigationTax': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID); dispatch(get_ScreenPermissions_Data("C074", localStoreData?.AgencyID, localStoreData?.PINID));
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
        if (loginPinID) {
            setValue({
                ...value, 'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID, 'OfficerID': loginPinID,
            })
            setArrestChargeID(DecChargeId);
        }
    }, [loginPinID]);

    const check_Validation_Error = (e) => {
        if (Penalties_Valid(value.Fine)) {
            setErrors(prevValues => { return { ...prevValues, ['FineError']: Penalties_Valid(value.Fine) } })
        }
        if (Penalties_Valid(value.LitigationTax)) {
            setErrors(prevValues => { return { ...prevValues, ['LitigationTax']: Penalties_Valid(value.LitigationTax) } })
        }
        if (Penalties_Valid(value.OtherCost)) {
            setErrors(prevValues => { return { ...prevValues, ['OtherCost']: Penalties_Valid(value.OtherCost) } })
        }
        if (Penalties_Valid(value.CourtCost)) {
            setErrors(prevValues => { return { ...prevValues, ['CourtCost']: Penalties_Valid(value.CourtCost) } })
        }
        if (Penalties_Valid(value.FTAAmount)) {
            setErrors(prevValues => { return { ...prevValues, ['FTAAmount']: Penalties_Valid(value.FTAAmount) } })
        }

    }
    // Check All Field Format is True Then Submit 
    const { FineError, LitigationTax, OtherCost, CourtCost, FTAAmount } = errors

    useEffect(() => {
        if (FineError === 'true' && LitigationTax === 'true' && OtherCost === 'true' && CourtCost === 'true' && FTAAmount === 'true') {
            if (arrestChargeID) { update_Charge_Penalties() }
            else { Insert_Penalties() }
        }
    }, [FineError, LitigationTax, OtherCost, CourtCost, FTAAmount])

    useEffect(() => {
        if (arrestChargeID) {
            GetSingleData(arrestChargeID)
        }
    }, [arrestChargeID])

    const GetSingleData = (arrestChargeID) => {
        const val = { 'ChargeID': arrestChargeID, }
        fetchPostData('ChargePenalty/GetSingleData_ChargePenalty', val)
            .then((res) => {
                if (res) {
                    setEditval(res);
                } else { setEditval() }
            })
    }

    useEffect(() => {
        if (arrestChargeID) {
            setValue({
                ...value,
                'Fine': editval[0]?.Fine ? editval[0]?.Fine : '', 'CourtCost': editval[0]?.CourtCost ? editval[0]?.CourtCost : '', 'OtherCost': editval[0]?.OtherCost ? editval[0]?.OtherCost : '',
                'FTADate': editval[0]?.FTADate ? getShowingDateText(editval[0]?.FTADate) : '', 'FTAAmount': editval[0]?.FTAAmount ? editval[0]?.FTAAmount : '', 'LitigationTax': editval[0]?.LitigationTax ? editval[0]?.LitigationTax : '',
                'TotalPenalty': editval[0]?.TotalPenalty ? editval[0]?.TotalPenalty : '', 'Comments': editval[0]?.Comments, 'Years': editval[0]?.Years, 'Months': editval[0]?.Months,
                'Days': editval[0]?.Days, 'ModifiedByUserFK': loginPinID,
            })
            setFtaDate(editval[0]?.FTADate ? new Date(editval[0]?.FTADate) : "")
        } else {
            setValue({
                ...value, 'Fine': '', 'CourtCost': '', 'OtherCost': '', 'FTADate': '', 'FTAAmount': '', 'LitigationTax': '', 'TotalPenalty': '', 'Comments': '', 'Years': '', 'Months': '', 'Days': '',
            })
        }
    }, [editval, changesStatusCount])

    const handlChanges = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e.target.name === 'Fine' || e.target.name === 'LitigationTax' || e.target.name === 'FTAAmount' || e.target.name === 'OtherCost' || e.target.name === 'CourtCost') {
            const ele = e.target.value.replace(/[^0-9.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
                        if (!checkDot) {
                            setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                            return;
                        } else {
                            return;
                        }
                    } else {
                        setValue({ ...value, [e.target.name]: ele })
                    }
                }
            } else {
                setValue({
                    ...value, [e.target.name]: ele
                });
            }
        }
        else if (e.target.name === 'Months') {
            let newValue = e.target.value.replace(/[^0-9]/g, "");
            let numericValue = parseInt(newValue, 10);
            if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 11 && newValue.length <= 2) {
                setValue({ ...value, [e.target.name]: newValue });
            } else { setValue({ ...value, [e.target.name]: '' }); }
        }
        else if (e.target.name === 'Days') {

            const checkNumber = e.target.value.replace(/[^0-9]/g, "");
            const number = parseInt(checkNumber, 10);
            if (number >= 1 && number <= 31) {
                setValue({ ...value, [e.target.name]: checkNumber });
            } else { setValue({ ...value, [e.target.name]: '' }); }
        }
        else if (e.target.name === 'Years') {

            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: checkNumber })
        } else {
            setValue({ ...value, [e.target.name]: e.target.value })

        }
    }

    const Insert_Penalties = () => {
        AddDeleteUpadate('ChargePenalty/Insert_ChargePenalty', value).then((res) => {
            toastifySuccess(res.Message); setUpdateCount(updateCount + 1); setStatesChangeStatus(false)
            setErrors({ ...errors, ['FineError']: '' })
        })
    }

    const update_Charge_Penalties = () => {
        AddDeleteUpadate('ChargePenalty/Update_ChargePenalty', value).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); setChangesStatus(false); setStatesChangeStatus(false)
            setErrors({ ...errors, ['FineError']: '' })
        })
    }

    useEffect(() => {
        Sum();
    }, [value?.Fine, value?.OtherCost, value?.CourtCost, value?.FTAAmount, value?.LitigationTax])

    const Sum = () => {
        let total = 0;
        let fineNum = value?.Fine ? value?.Fine : 0
        let OtherCostNum = value?.OtherCost ? value?.OtherCost : 0
        let CourtCostNum = value?.CourtCost ? value?.CourtCost : 0
        let FTAAmountNum = value?.FTAAmount ? value?.FTAAmount : 0
        let LitigationTaxNum = value?.LitigationTax ? value?.LitigationTax : 0
        total = parseFloat(fineNum) + parseFloat(OtherCostNum) + parseFloat(CourtCostNum) + parseFloat(FTAAmountNum) + parseFloat(LitigationTaxNum);
        total = total.toFixed(2)
        setValue({ ...value, ['TotalPenalty']: total })
    }
    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };
    const setToReset = () => {
    }
    return (
        <div className="col-12 col-md-12 pt-2 p-0" >
            <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                <p className="p-0 m-0">Penalties</p>
            </div>
            <div className="row ">
                <div className="col-7  col-md-4 col-lg-3  mt-1 pt-1" >
                    <div className="text-field">
                        <input type="text" name='Fine' id='Fine' maxLength={17} onChange={handlChanges} value={`$${value?.Fine}`} />
                        <label htmlFor="" >Fine</label>
                        {errors.FineError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-7  col-md-4 col-lg-3  mt-1 pt-1" >
                    <div className="text-field">
                        <input type="text" name='CourtCost' id='CourtCost' maxLength={17} onChange={handlChanges} value={`$${value?.CourtCost}`} />
                        <label htmlFor="">Court Cost</label>
                        {errors.CourtCost !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtCost}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-7  col-md-4 col-lg-3  mt-1 pt-1" >
                    <div className="text-field">
                        <input type="text" name='OtherCost' id='OtherCost' maxLength={17} onChange={handlChanges} value={`$${value?.OtherCost}`} />
                        <label htmlFor="">Other Cost</label>
                        {errors.OtherCost !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OtherCost}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-6 col-md-6 col-lg-3 mt-3 date__box">
                    <DatePicker
                        id='FTADate'
                        name='FTADate'
                        ref={startRef}
                        onKeyDown={onKeyDown}
                        onChange={(date) => {
                            setFtaDate(date); !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                            setValue({ ...value, ['FTADate']: date ? getShowingMonthDateYear(date) : null })
                        }}
                        className=''
                        dateFormat="MM/dd/yyyy"
                        isClearable={value?.FTADate ? true : false}
                        selected={ftaDate}
                        placeholderText={'Select...'}
                        timeInputLabel
                        autoComplete="nope"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                    />
                    <label htmlFor="">FTA Date</label>
                </div>
                <div className="col-7  col-md-4 col-lg-2  mt-3" >
                    <div className="text-field">
                        <input type="text" name='FTAAmount' id='FTAAmount' maxLength={17} onChange={handlChanges} value={`$${value?.FTAAmount}`} />
                        <label htmlFor="" >FTA Amount</label>
                        {errors.FTAAmount !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FTAAmount}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-7  col-md-4 col-lg-2  mt-3" >
                    <div className="text-field">
                        <input type="text" name='LitigationTax' id='LitigationTax' maxLength={17} onChange={handlChanges} value={`$${value?.LitigationTax}`} />
                        <label htmlFor="" >Litigation Tax</label>
                        {errors.LitigationTax !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LitigationTax}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-7  col-md-4 col-lg-2  mt-3" >
                    <div className="text-field">
                        <input type="text" name='TotalPenalty' id='TotalPenalty' maxLength={17} value={`$${value?.TotalPenalty}`} readOnly />
                        <label htmlFor="" >Total Penalty</label>

                    </div>
                </div>
                <div className="col-7  col-md-4 col-lg-6  mt-2 pt-1  " >
                    <div className=" dropdown__box">
                        <textarea name='Comments' id='Comments' value={value?.Comments} onChange={handlChanges} cols="30" rows='1' className="form-control">
                        </textarea>
                        <label htmlFor="">Comments</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-12 pt-1 p-0" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                        <p className="p-0 m-0">Sentence</p>
                    </div>
                </div>
                <div className="col-7  col-md-4 col-lg-2  mt-1 pt-1" >
                    <div className="text-field">
                        <input type="text" name='Years' id='Years' maxLength={4} onChange={handlChanges} value={value?.Years} />
                        <label htmlFor="">Yrs</label>

                    </div>
                </div>
                <div className="col-7  col-md-4 col-lg-2  mt-1 pt-1" >
                    <div className="text-field">
                        <input type="text" name='Months' id='Months' maxLength={3} onChange={handlChanges} value={value?.Months} />
                        <label htmlFor="">Months</label>

                    </div>
                </div>
                <div className="col-7  col-md-4 col-lg-2  mt-1 pt-1" >
                    <div className="text-field">
                        <input type="text" name='Days' id='Days' maxLength={3} onChange={handlChanges} value={value?.Days} />
                        <label htmlFor="">Days</label>

                    </div>
                </div>
            </div>
            <div className="col-12 text-right mt-3 p-0">
                {
                    arrestChargeID ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1">Update</button>
                            : <></> :
                            <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1">Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Save</button>
                            : <></> :
                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Save</button>
                }

            </div>
            <ChangesModal
                func={check_Validation_Error} setToReset={setToReset} />
        </div>
    )
}
export default Penalties