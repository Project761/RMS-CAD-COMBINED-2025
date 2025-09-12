import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../../Common/Utility';
import { Penalties_Valid, RequiredField, Space, Space_NotAllow } from '../../../../Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { useDispatch, useSelector } from 'react-redux';
import ChangesModal from '../../../../../Common/ChangesModal';

const CitationPenalties = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { updateCount, setUpdateCount, setChangesStatus } = useContext(AgencyContext);
    const [ftaDate, setFtaDate] = useState();
    const [arrestChargeID, setArrestChargeID] = useState();
    const [editval, setEditval] = useState();
    const [loginPinID, setLoginPinID,] = useState('');

    const [value, setValue] = useState({
        'Fine': '', 'CourtCost': '', 'OtherCost': '', 'FTADate': '', 'FTAAmount': '', 'LitigationTax': '', 'TotalPenalty': '', 'Comments': '', 'Years': '', 'Months': '',
        'Days': '', 'ChargePenaltyID': '', 'ChargeID': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'FineError': '', 'FTAAmount': '', 'CourtCost': '', 'OtherCost': '', 'LitigationTax': '',
    })

    // useEffect(() => {
    //     if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
    //         if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    //     }
    // }, []);

    // useEffect(() => {
    //     if (localStoreData) {
    //         setLoginPinID(localStoreData?.PINID);
    //         dispatch(get_ScreenPermissions_Data("C074", localStoreData?.AgencyID, localStoreData?.PINID));
    //     }
    // }, [localStoreData]);

    // useEffect(() => {
    //     if (loginPinID) {
    //         setValue({
    //             ...value,
    //             'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID, 'OfficerID': loginPinID,
    //         })
    //         GetSingleData(DecChargeId); setArrestChargeID(DecChargeId);
    //     }
    // }, [loginPinID]);

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
    }, [editval])

    const handlChanges = (e) => {
        if (e.target.name === 'Fine' || e.target.name === 'Years' || e.target.name === 'LitigationTax' || e.target.name === 'FTAAmount' || e.target.name === 'OtherCost' || e.target.name === 'CourtCost') {
            const ele = e.target.value.replace(/[^0-9.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setValue({ ...value, [e.target.name]: ele });
                    setChangesStatus(true)
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
                        if (!checkDot) {
                            setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                            setChangesStatus(true)
                            return;
                        } else {
                            return;
                        }
                    } else {
                        setValue({ ...value, [e.target.name]: ele })
                        setChangesStatus(true)
                    }
                }
            } else {
                setValue({
                    ...value, [e.target.name]: ele
                });
                setChangesStatus(true)
            }
        } else if (e.target.name === 'Months') {
            if (e.target.value <= 11) {
                setValue({
                    ...value, ['Months']: e.target.value
                })
                setChangesStatus(true)
            }
        } else if (e.target.name === 'Days') {
            if (e.target.value <= 30) {
                setValue({
                    ...value, ['Days']: e.target.value
                })
                setChangesStatus(true)
            }

        } else {
            setValue({
                ...value, [e.target.name]: e.target.value
            })
            setChangesStatus(true)

        }
    }

    // const handlChanges = (e) => {
    //     const { name, value } = e.target;

    //     if (['Fine', 'Years', 'LitigationTax', 'FTAAmount', 'OtherCost', 'CourtCost'].includes(name)) {
    //         let newValue = value.replace(/[^0-9.]/g, ""); // Allow only digits and a dot
    //         const decimalIndex = newValue.indexOf('.');

    //         // Limit decimal places to 2
    //         if (decimalIndex !== -1) {
    //             newValue = newValue.slice(0, decimalIndex + 3);
    //         }

    //         setValue({ ...value, [name]: newValue });
    //     } else if (name === 'Months') {
    //         if (value <= 11) {
    //             setValue({ ...value, ['Months']: value });
    //         }
    //     } else if (name === 'Days') {
    //         if (value <= 30) {
    //             setValue({ ...value, ['Days']: value });
    //         }
    //     } else {
    //         setValue({ ...value, [name]: value });
    //     }
    // };


    const Insert_Penalties = () => {
        AddDeleteUpadate('ChargePenalty/Insert_ChargePenalty', value).then((res) => {
            toastifySuccess(res.Message)
            setUpdateCount(updateCount + 1)
            setErrors({
                ...errors, ['FineError']: ''
            })
        })
    }

    const update_Charge_Penalties = () => {
        AddDeleteUpadate('ChargePenalty/Update_ChargePenalty', value).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); setChangesStatus(false)
            setErrors({
                ...errors,
                ['FineError']: ''
            })
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
        setValue({
            ...value,
            ['TotalPenalty']: total
        })
    }
    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <fieldset>
                    <legend>Penalties</legend>
                    <div className="row ">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label '>Fine  {errors.FineError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FineError}</span>
                            ) : null}</label>
                        </div>
                        <div className="col-4  col-md-4 col-lg-2  mt-1  text-field" >
                            <input type="text" name='Fine' id='Fine' maxLength={17} onChange={handlChanges} value={`$${value?.Fine}`} />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label '>Court Cost{errors.CourtCost !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtCost}</span>
                            ) : null}</label>
                        </div>
                        <div className="col-4  col-md-4 col-lg-2  mt-1  text-field" >
                            <input type="text" name='CourtCost' id='CourtCost' maxLength={17} onChange={handlChanges} value={`$${value?.CourtCost}`} />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label '>Other Cost{errors.OtherCost !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OtherCost}</span>
                            ) : null}</label>
                        </div>
                        <div className="col-4  col-md-4 col-lg-3  mt-1  text-field" >
                            <input type="text" name='OtherCost' id='OtherCost' maxLength={17} onChange={handlChanges} value={`$${value?.OtherCost}`} />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-3 ">
                            <label htmlFor="" className='new-label '>FTA Date</label>
                        </div>
                        <div className="col-4  col-md-4 col-lg-2  mt-1 " >
                            <DatePicker
                                id='FTADate'
                                name='FTADate'
                                ref={startRef}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setFtaDate(date); setValue({ ...value, ['FTADate']: date ? getShowingMonthDateYear(date) : null }) }}
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
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-3">
                            <label htmlFor="" className='new-label '>FTA Amount {errors.FTAAmount !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FTAAmount}</span>
                            ) : null}</label>
                        </div>
                        <div className="col-4  col-md-4 col-lg-2  mt-2  text-field" >
                            <input type="text" name='FTAAmount' id='FTAAmount' maxLength={17} onChange={handlChanges} value={`$${value?.FTAAmount}`} />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-3 ">
                            <label htmlFor="" className='new-label '>Litigation Tax{errors.LitigationTax !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LitigationTax}</span>
                            ) : null}</label>
                        </div>
                        <div className="col-4  col-md-4 col-lg-3  mt-2  text-field" >
                            <input type="text" name='LitigationTax' id='LitigationTax' maxLength={17} onChange={handlChanges} value={`$${value?.LitigationTax}`} />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label '>Total Penalty</label>
                        </div>
                        <div className="col-4  col-md-4 col-lg-2  mt-1  text-field" >
                            <input type="text" name='TotalPenalty' id='TotalPenalty' maxLength={17} value={`$${value?.TotalPenalty}`} readOnly />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label '>Comments</label>
                        </div>
                        <div className="col-4  col-md-4 col-lg-7  mt-1  text-field" >
                            <textarea name='Comments' id='Comments' value={value?.Comments} onChange={handlChanges} cols="30" rows='1' className="form-control">
                            </textarea>
                        </div>

                    </div>
                </fieldset>
            </div>
            <div className="col-12 col-md-12 pt-2 p-0">
                <fieldset>
                    <legend>Sentence</legend>
                    <div className="row">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label '>Yrs</label>
                        </div>
                        <div className="col-4  col-md-2 col-lg-2  mt-1  text-field" >
                            <input type="text" name='Years' id='Years' maxLength={4} onChange={handlChanges} value={value?.Years} />
                        </div>

                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label '>Months</label>
                        </div>
                        <div className="col-4  col-md-2 col-lg-2  mt-1  text-field" >
                            <input type="text" name='Months' id='Months' maxLength={3} onChange={handlChanges} value={value?.Months} />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label '>Days</label>
                        </div>
                        <div className="col-4  col-md-2 col-lg-2  mt-1  text-field" >
                            <input type="text" name='Days' id='Days' maxLength={3} onChange={handlChanges} value={value?.Days} />
                        </div>
                    </div>

                </fieldset>
            </div>
            <div className="col-12 text-right mt-3 p-0">
                {/* {
                    arrestChargeID ?
                        <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
                        :
                        <button type="button" className="btn btn-sm btn-success" onClick={() => { check_Validation_Error(); }}>Save</button>
                } */}

                {
                    arrestChargeID ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Update</button>
                            : <></> :
                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Save</button>
                            : <></> :
                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Save</button>
                }
                {/* {
                    effectiveScreenPermission ?
                        effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-md py-1 btn-success " onClick={() => { check_Validation_Error(); }}>Update</button>
                            :
                            <>
                            </>
                        :
                        <button type="button" className="btn btn-md py-1 btn-success " onClick={() => { check_Validation_Error(); }}>Update</button>
                } */}
            </div>
            <ChangesModal func={check_Validation_Error} />
        </>
    )
}
export default CitationPenalties