import React, { useState,useEffect,useCallback } from 'react'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import SelectBox from '../../../../Common/SelectBox';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredField } from '../../Personnel/Validation';
import { components } from "react-select";
import makeAnimated from "react-select/animated";


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

const WarrantORIAddUp = (props) => {

    const { loginPinID, IsSuperadmin, loginAgencyID, singleTypeId, status, get_Data_List, DataList, modal, setModal, updateStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [editval, setEditval] = useState();

    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })

    const [value, setValue] = useState({
        'Description': '', 'AgencyCode': '', 'AgencyID': '', 'Agency_Name': '', 'MultiAgency_Name': '', 'ORINumber': '',  'Agency_State': '', 
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1', 'IsEditable': 1, 'WarrantORIID': '',
    });

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'CodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (agencyData?.length === 0 && modal) {
            if (loginPinID && loginAgencyID) {
                getAgency(loginAgencyID, loginPinID);
                setValue({ ...value, 'CreatedByUserFK': loginPinID, })
            }
        }
    }, [modal, loginAgencyID])

    useEffect(() => {
        if (singleTypeId) {
            GetSingleData()
        }
    }, [singleTypeId, updateStatus])

    const GetSingleData = () => {
        const val = { 'WarrantORIID': singleTypeId }
        fetchPostData('WarrantORI/GetSingleData_WarrantORI', val)
            .then((res) => {
                if (res) { setEditval(res); }
                else setEditval()
            })
    }

   

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "WarrantORIID": editval[0]?.WarrantORIID,
                'MultiAgency_Name': editval[0]?.MultiAgency_Name,
                "Agency_State": editval[0]?.Agency_State, 'IsActive': editval[0]?.IsActive,
                "Description": editval[0]?.Description, "ORINumber": editval[0]?.ORINumber,
                "AgencyName": editval[0]?.AgencyName,
                'AgencyCode': editval[0]?.AgencyCode, 
                'IsEditable': editval[0]?.IsEditable === '0' ? false : true,
                'AgencyID': editval[0]?.AgencyID, 'ModifiedByUserFK': loginPinID,
                'Agency_Name': editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(editval[0]?.MultipleAgency) : '',
            }); setMultiSelected({
                optionSelected: editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(editval[0]?.MultipleAgency
                ) : '',
            });
        }
        else {
            setValue({
                ...value,
                'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '', 'ORINumber': '', 'WarrantORIID': '', 'Agency_State': '',
                'CreatedByUserFK': '',
                'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1', 'IsEditable': 0, 'Agency_Name': '',
            }); setMultiSelected({ optionSelected: null })
        }
    }, [editval])

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const reset = () => {
        setValue({
            ...value,
            'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '', 'ORINumber': '', 'WarrantORIID': '', 'Agency_State': '', 'AgencyName': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',  'IsActive': '1', 'IsEditable': 0, 'Agency_Name': '',
        });
        setErrors({ ...errors, 'CodeError': '', 'DescriptionError': '', });
        setMultiSelected({ optionSelected: null })
    }

    const handlChanges = (e) => {
        if (e.target.name === 'IsEditable') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
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
                ['AgencyID']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    }

    const getAgency = async (loginAgencyID, loginPinID) => {
        const value = {
            AgencyID: loginAgencyID,
            PINID: loginPinID
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }

    const Add_Type = (e) => {
        const result = DataList?.find(item => {
            if (item.Agency_State === value.Agency_State) {
                return item.Agency_State === value.Agency_State
            } else return item.Agency_State === value.Agency_State
        });
        const result1 = DataList?.find(item => {
            if (item.Description === value.Description) {
                return item.Description === value.Description
            } else return item.Description === value.Description
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
            AddDeleteUpadate('WarrantORI/Insert_WarrantORI', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CodeError']: '' })
                setModal(false)
                get_Data_List(loginAgencyID, loginPinID, IsSuperadmin);
                reset();
            })
        }
    }

    const update_Type = () => {
        const result = DataList?.find(item => {
            if (item.WarrantORIID != singleTypeId) {
                if (item.Agency_State === value.Agency_State) {
                    return item.Agency_State === value.Agency_State
                } else return item.Agency_State === value.Agency_State
            }
        });
        const result1 = DataList?.find(item => {
            if (item.WarrantORIID != singleTypeId) {
                if (item.Description === value.Description) {
                    return item.Description === value.Description
                } else return item.Description === value.Description
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
            AddDeleteUpadate('WarrantORI/Update_WarrantORI', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_Data_List(loginAgencyID, loginPinID, IsSuperadmin);
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.Agency_State)) {
            setErrors(prevValues => { return { ...prevValues, ['CodeError']: RequiredField(value.Agency_State) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    const { CodeError, DescriptionError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CodeError === 'true') {
            if (status) update_Type()
            else Add_Type()
        }
    }, [CodeError, DescriptionError])

    const closeModal = () => {
        reset();
        setModal(false);
    }

    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="WarrantORIModel" tabIndex="-1"  aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 ">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Warrant ORI</legend>
                                            <div className="row">
                                                <div className="col-12 col-md-2 col-lg-2 ">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} name='Agency_State' onChange={handlChanges}
                                                            disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false} className='requiredColor' value={value.Agency_State} />
                                                        <label>State Code</label>
                                                        {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 col-lg-2 ">
                                                    <div className="text-field">
                                                        <input type="text" name='AgencyCode' onChange={handlChanges} value={value.AgencyCode} />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-7 col-lg-8 ">
                                                    <div className="text-field">
                                                        <textarea className='requiredColor' name='Description' disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false} onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={''} name='AgencyName' onChange={handlChanges} value={value.AgencyName} />
                                                        <label>Agency Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={13} name='ORINumber' onChange={handlChanges} value={value.ORINumber} />
                                                        <label>ORI Number</label>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-12 col-lg-12 dropdown__box pt-1">
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
                                                    <label className='pt-1'>Agency</label>
                                                </div>

                                                <div className="col-6 col-md-6 col-lg-3 mt-1">
                                                    <input type="checkbox" name="IsEditable" checked={value.IsEditable} value={value.IsEditable}
                                                        onChange={handlChanges}
                                                        id="IsCADCfsCode" />
                                                    <label className='ml-2' htmlFor="IsEditable">Is Editable</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {
                                            status ?
                                                <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >update</button>
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

export default WarrantORIAddUp;

export const changeArrayFormat = (data, type) => {
    if (type === 'ChargeGrpVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ChargeGroupID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'UcrVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.UCRCodeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'FBIVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.FBICodeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'LawTitleVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.LawTitleID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'CategoryVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ChargeCategoryID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'UcrArrestVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.UCRArrestID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'ChargeClassVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ChargeClassID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'DegreeVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ChargeDegreeID, label: sponsor.Description })
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
    if (type === 'ChargeGrpVal') {
        const result = data?.map((sponsor) =>
            (sponsor.ChargeGroupID)
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
    if (type === 'UcrVal') {
        const result = data?.map((sponsor) =>
            (sponsor.UCRCodeID)
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
    if (type === 'FBIVal') {
        const result = data?.map((sponsor) =>
            (sponsor.FBIID)
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
    if (type === 'LawTitleVal') {
        const result = data?.map((sponsor) =>
            (sponsor.LawTitleID)
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
    if (type === 'CategoryVal') {
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
    if (type === 'UcrArrestVal') {
        const result = data?.map((sponsor) =>
            (sponsor.UCRArrestID)
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
    if (type === 'ChargeClassVal') {
        const result = data?.map((sponsor) =>
            (sponsor.ChargeClassID)
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
    if (type === 'DegreeVal') {
        const result = data?.map((sponsor) =>
            (sponsor.DegreeID)
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
    } else {
        const result = data.map((sponsor) =>
            ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
        )
        return result
    }
}