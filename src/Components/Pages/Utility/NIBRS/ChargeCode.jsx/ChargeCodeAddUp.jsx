import React, { useState, useEffect, useCallback } from 'react'
import Select, { components } from 'react-select';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import SelectBox from '../../../../Common/SelectBox';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredFieldIncident, Space_Not_Allow } from '../../Personnel/Validation';
import makeAnimated from "react-select/animated";
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';

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


const ChargeCodeAddUp = (props) => {

    const { loginPinID, loginAgencyID, isSuperadmin, singleTypeId, status, get_data, dataList, modal, setModal, updateStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [categoryDropDownVal, setCategoryDropDownVal] = useState([])
    const [degreeDrpDwnVal, setDegreeDrpDwnVal] = useState([])
    const [chargeClsDrpDwnVal, setChargeClsDrpDwnVal] = useState([])
    const [ucrArrestDrpDwnVal, setUcrArrestDrpDwnVal] = useState([])
    const [lawTitleDrpDwnVal, setLawTitleDrpDwnVal] = useState([])
    const [fbiDrpDwnVal, setFbiDrpDwnVal] = useState([])
    const [ucrDrpDwnVal, setUcrDrpDwnVal] = useState([])
    const [chargeGrpDrpDwnVal, setChargeGrpDrpDwnVal] = useState([])
    const [editval, setEditval] = useState();

    const [value, setValue] = useState({
        'ChargeCode': '', 'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1', 'ChargeCodeID': '', 'StateCD': '',
        'UniqueCharge': '', 'MandatoryHours': '', 'Subsection': '', 'StateOrdinalCode': '', 'CitationFine': '', 'LC': '', 'Junsdiction': '',
        'ShortDescription': '', 'IsEditable': 1,
        // DropDown
        'CategoryID': '', 'CategoryName': '',
        'DegreeID': '', 'DegreeName': '',
        'ChargeClassID': '', 'ChargeClassName': '',
        'UCRArrestID': '', 'UCRArrestName': '',
        'LawTitleID': '', 'LawTitleName': '',
        'FBIID': '', 'FBIName': '',
        'UCRCodeID': '', 'UCRCodeName': '',
        'ChargeGroupID': '', 'ChargeGroupName': '',
        // checkbox
        'IsWarrantCode': '', 'IsBondDenied': '', 'IsParoleViolation': '', 'IsAssaultive': '', 'IsNeedsDNATaken': '', 'IsProbation': '', 'IsParking': '',
        'IsTicketCode': '', 'IsNjeTicket': '', 'IsArrestCode': '', 'IsOffenseCode': '', 'IsETicketDieselInd': '', 'IsReportable': '',
        'IsDomesticViolenceCrime': '', 'IsConditionalRelease': '', 'IsCADCfsCode': '',

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
                setValue({ ...value, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID })
            }
        }
    }, [modal, loginAgencyID])

    useEffect(() => {
        if (singleTypeId) {
            GetSingleData()
        }
    }, [singleTypeId, updateStatus])

    useEffect(() => {
        if (loginAgencyID) {
            FBIDropVal(loginAgencyID)
        }
    }, [loginAgencyID])

    const GetSingleData = () => {
        const val = { 'ChargeCodeID': singleTypeId }
        fetchPostData('ChargeCodes/GetSingleData_ChargeCodes', val)
            .then((res) => {
                if (res) { setEditval(res); }
                else setEditval()
            })
    }


    useEffect(() => {
        if (loginAgencyID) {
            getCategoryDropVal('ChargeCategory/GetDataDropDown_ChargeCategory', loginAgencyID);
            getDegreeDropVal('ChargeDegree/GetDataDropDown_ChargeDegree', loginAgencyID);
            getChargeClassDropVal('ChargeClass/GetDataDropDown_ChargeClass', loginAgencyID);
            getUCRArrestDropVal('UCRArrest/GetDataDropDown_UCRArrest', loginAgencyID);
            lawTitleDropVal('LawTitle/GetDataDropDown_LawTitle', loginAgencyID)
            FBIDropVal('FBICodes/GetData_FBICodes', loginAgencyID);
            UCRDropVal('UCRCodes/GetDataDropDown_UCRCodes', loginAgencyID);
            ChargeGroupDropVal('ChargeGroup/GetDataDropDown_ChargeGroup', loginAgencyID);
        }
    }, [loginAgencyID])

    const getCategoryDropVal = (Url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setCategoryDropDownVal(changeArrayFormat(data, 'CategoryVal'))
            } else {
                setCategoryDropDownVal();
            }
        })
    }

    const getDegreeDropVal = (Url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setDegreeDrpDwnVal(changeArrayFormat(data, 'DegreeVal'))
            } else {
                setDegreeDrpDwnVal();
            }
        })
    }

    const getChargeClassDropVal = (Url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setChargeClsDrpDwnVal(changeArrayFormat(data, 'ChargeClassVal'))
            } else {
                setChargeClsDrpDwnVal();
            }
        })
    }

    const getUCRArrestDropVal = (Url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setUcrArrestDrpDwnVal(changeArrayFormat(data, 'UcrArrestVal'))
            } else {
                setUcrArrestDrpDwnVal();
            }
        })
    }

    const UCRDropVal = (Url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setUcrDrpDwnVal(changeArrayFormat(data, 'UcrVal'))
            } else {
                setUcrDrpDwnVal();
            }
        })
    }

    const lawTitleDropVal = (Url, loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setLawTitleDrpDwnVal(Comman_changeArrayFormat(data, 'LawTitleID', 'Description'))
            } else {
                setLawTitleDrpDwnVal();
            }
        })
    }

    const FBIDropVal = (Url, loginAgencyID, IsActive) => {
        fetchPostData(Url, { AgencyID: loginAgencyID, IsActive: 1 }).then((data) => {
            if (data) {
                setFbiDrpDwnVal(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
            } else {
                setFbiDrpDwnVal();
            }
        })
    }

    const ChargeGroupDropVal = (Url, loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData(Url, val).then((data) => {
            if (data) {
                setChargeGrpDrpDwnVal(changeArrayFormat(data, 'ChargeGrpVal'))
            } else {
                setChargeGrpDrpDwnVal();
            }
        })
    }

    const changeDropDown = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value, [`${name}Name`]: e.label })
        } else {
            setValue({ ...value, [name]: null })
        }
    }


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "ChargeCode": editval[0]?.ChargeCode, 'IsActive': editval[0]?.IsActive,
                "Description": editval[0]?.Description,
                'AgencyCode': editval[0]?.AgencyCode,
                //Dropdown
                'CategoryID': editval[0]?.CategoryID, 'CategoryName': editval[0]?.CategoryID ? changeArrayFormat_WithFilter(editval, 'CategoryVal', categoryDropDownVal) : '',
                'DegreeID': editval[0]?.DegreeID, 'DegreeName': editval[0]?.DegreeID ? changeArrayFormat_WithFilter(editval, 'DegreeVal', degreeDrpDwnVal) : '',
                'ChargeClassID': editval[0]?.ChargeClassID, 'ChargeClassName': editval[0]?.ChargeClassID ? changeArrayFormat_WithFilter(editval, 'ChargeClassVal', chargeClsDrpDwnVal) : '',
                'UCRArrestID': editval[0]?.UCRArrestID, 'UCRArrestName': editval[0]?.UCRArrestID ? changeArrayFormat_WithFilter(editval, 'UcrArrestVal', ucrArrestDrpDwnVal) : '',
                'LawTitleID': editval[0]?.LawTitleID, 'LawTitleName': editval[0]?.LawTitleID ? changeArrayFormat_WithFilter(editval, 'LawTitleVal', lawTitleDrpDwnVal) : '',
                'FBIID': editval[0]?.FBIID, 'FBIName': editval[0]?.FBIID ? changeArrayFormat_WithFilter(editval, 'FBIVal', fbiDrpDwnVal) : '',
                'UCRCodeID': editval[0]?.UCRCodeID, 'UCRCodeName': editval[0]?.UCRCodeID ? changeArrayFormat_WithFilter(editval, 'UcrVal', ucrDrpDwnVal) : '',
                'ChargeGroupID': editval[0]?.ChargeGroupID, 'ChargeGroupName': editval[0]?.ChargeGroupID ? changeArrayFormat_WithFilter(editval, 'ChargeGrpVal', chargeGrpDrpDwnVal) : '',
                'UniqueCharge': editval[0]?.UniqueCharge, 'IsEditable': editval[0]?.IsEditable === '0' ? false : true,
                'MandatoryHours': editval[0]?.MandatoryHours, 'Junsdiction': editval[0]?.Junsdiction, 'CitationFine': editval[0]?.CitationFine, 'StateOrdinalCode': editval[0]?.StateOrdinalCode,
                'ShortDescription': editval[0]?.ShortDescription, 'IsNeedsDNATaken': editval[0]?.IsNeedsDNATaken, 'IsProbation': editval[0]?.IsProbation,
                'IsAutoHold': editval[0]?.IsAutoHold, 'LC': editval[0]?.LC, 'ModifiedByUserFK': loginPinID,
                'Subsection': editval[0]?.Subsection, 'IsWarrantCode': editval[0]?.IsWarrantCode, 'IsBondDenied': editval[0]?.IsBondDenied, 'IsParoleViolation': editval[0]?.IsParoleViolation,
                'IsAssaultive': editval[0]?.IsAssaultive, 'IsParking': editval[0]?.IsParking, 'IsTicketCode': editval[0]?.IsTicketCode, 'IsNjeTicket': editval[0]?.IsNjeTicket,
                'IsArrestCode': editval[0]?.IsArrestCode, 'IsETicketDieselInd': editval[0]?.IsETicketDieselInd, 'IsReportable': editval[0]?.IsReportable,
                'IsDomesticViolenceCrime': editval[0]?.IsDomesticViolenceCrime, 'IsConditionalRelease': editval[0]?.IsConditionalRelease,
                'IsCADCfsCode': editval[0]?.IsCADCfsCode, 'StateCD': editval[0]?.StateCD,
                'ChargeCodeID': editval[0]?.ChargeCodeID, 'MultiAgency_Name': editval[0]?.MultiAgency_Name,
                'AgencyID': editval[0]?.AgencyID,
                'AgencyName': editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(editval[0]?.MultipleAgency) : '',
                'IsOffenseCode': editval[0]?.IsOffenseCode,
                // 'LawTitleId': editval[0]?.LawTitleId,

            });
            setMultiSelected({
                optionSelected: editval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(editval[0]?.MultipleAgency
                ) : '',
            });
        } else {
            setValue({
                ...value,
                'ChargeCode': '', 'AgencyCode': '', 'Description': '', 'AgencyID': '', 'MultiAgency_Name': '', 'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1',
                'ChargeCodeID': '', 'DegreeID': '', 'ChargeClassID': '', 'LawTitleID': '', 'UCRCodeID': '', 'ChargeGroupID': '',
                'StateCD': '', 'UniqueCharge': '', 'MandatoryHours': '', 'Subsection': '', 'StateOrdinalCode': '', 'CitationFine': '', 'LC': '', 'Junsdiction': '',
                'ShortDescription': '', 'IsEditable': 0,
                // DropDown
                'CategoryID': '', 'CategoryName': '',
                'DegreeName': '',
                'ChargeClassName': '',
                'UCRArrestID': '', 'UCRArrestName': '',
                'LawTitleName': '',
                'FBIID': '', 'FBIName': '',
                'UCRCodeName': '',
                'ChargeGroupName': '',
                //chackbox
                'IsWarrantCode': '', 'IsBondDenied': '', 'IsParoleViolation': '', 'IsAssaultive': '', 'IsNeedsDNATaken': '', 'IsProbation': '', 'IsAutoHold': '',
                'IsTicketCode': '', 'IsNjeTicket': '', 'IsArrestCode': '', 'IsOffenseCode': '', 'IsETicketDieselInd': '', 'IsReportable': '', 'IsDomesticViolenceCrime': '',
                'IsConditionalRelease': '', 'IsCADCfsCode': '',
            });
            setMultiSelected({ optionSelected: null })
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
            'ChargeCode': '', 'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '', 'IsEditable': 0,
            'ModifiedByUserFK': '', 'AgencyName': '', 'DegreeID': '',
            'LawTitleID': '', 'UCRCodeID': '', 'StateCD': '', 'UniqueCharge': '', 'MandatoryHours': '',
            'Subsection': '', 'StateOrdinalCode': '', 'CitationFine': '', 'LC': '', 'Junsdiction': '', 'ShortDescription': '', 'IsWarrantCode': '',
            'IsBondDenied': '', 'IsParoleViolation': '', 'IsAssaultive': '', 'IsNeedsDNATaken': '', 'IsProbation': '', 'IsAutoHold': '', 'IsParking': '',
            'IsTicketCode': '', 'IsNjeTicket': '', 'IsArrestCode': '', 'IsOffenseCode': '', 'IsETicketDieselInd': '', 'IsReportable': '', 'IsDomesticViolenceCrime': '', 'IsConditionalRelease': '', 'IsCADCfsCode': '',
            // DropDown
            'CategoryID': '', 'CategoryName': '',
            'DegreeName': '',
            'ChargeClassID': '', 'ChargeClassName': '',
            'UCRArrestID': '', 'UCRArrestName': '',
            'LawTitleName': '',
            'FBIID': '', 'FBIName': '',
            'UCRCodeName': '',
            'ChargeGroupID': '', 'ChargeGroupName': '',
        });
        setMultiSelected({ optionSelected: null })
        setErrors({
            'CodeError': '',
            'DescriptionError': '',
        })
    }

    const handlChanges = (e) => {
        if (e.target.name === 'IsEditable' || e.target.name === 'IsCADCfsCode' || e.target.name === 'IsWarrantCode' || e.target.name === 'IsBondDenied' || e.target.name === 'IsParoleViolation' || e.target.name === 'IsAssaultive' || e.target.name === 'IsNeedsDNATaken' || e.target.name === 'IsProbation' || e.target.name === 'IsAutoHold' || e.target.name === 'IsParking' || e.target.name === 'IsTicketCode' || e.target.name === 'IsNjeTicket' || e.target.name === 'IsArrestCode' || e.target.name === 'IsOffenseCode' || e.target.name === 'IsETicketDieselInd' || e.target.name === 'IsReportable' || e.target.name === 'IsDomesticViolenceCrime' || e.target.name === 'IsConditionalRelease') {
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

    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })

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
        const result = dataList?.find(item => {
            if (item.ChargeCode === value.ChargeCode) {
                return item.ChargeCode === value.ChargeCode
            } else return item.ChargeCode === value.ChargeCode
        });
        const result1 = dataList?.find(item => {
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
            AddDeleteUpadate('ChargeCodes/InsertChargeCodes', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CodeError']: '' })
                setModal(false)
                get_data(loginAgencyID, loginPinID);
                reset();
            })
        }
    }

    const update_Type = () => {
        const result = dataList?.find(item => {
            if (item.ChargeCodeID != singleTypeId) {
                if (item.ChargeCode === value.ChargeCode) {
                    return item.ChargeCode === value.ChargeCode
                } else return item.ChargeCode === value.ChargeCode
            }
        });
        const result1 = dataList?.find(item => {
            if (item.ChargeCodeID != singleTypeId) {
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
            AddDeleteUpadate('ChargeCodes/UpdateChargeCodes', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_data(loginAgencyID, loginPinID);
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (Space_Not_Allow(value.ChargeCode)) {
            setErrors(prevValues => { return { ...prevValues, ['CodeError']: Space_Not_Allow(value.ChargeCode) } })
        }
        if (Space_Not_Allow(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: Space_Not_Allow(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
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

    const HandleChanges = (e) => {
        if (e.target.name === 'CitationFine' || e.target.name === 'MandatoryHours') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
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
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CFSModal" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-xl modal-dialog-centered rounded">
                            <div className="modal-content" style={{ marginTop: '-20px', marginBottom: '-20px' }}>
                                <div className="modal-body" >
                                    <div className=" ">
                                        <fieldset style={{ border: '1px solid gray', marginTop: '-12px' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Charge Code</legend>
                                            <div className="row">
                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>Code {errors.CodeError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='ChargeCode' onChange={handlChanges}
                                                        disabled={
                                                            isSuperadmin !== 'true' && isSuperadmin !== true ?
                                                                status && (value.IsEditable === '0' || value.IsEditable === false) ? true
                                                                    : false : false
                                                        }


                                                        className='requiredColor' value={value.ChargeCode} />
                                                </div>

                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>Description   {errors.DescriptionError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-5 mt-1 text-field">
                                                    <textarea className='requiredColor' name='Description'
                                                       
                                                        disabled={
                                                            isSuperadmin !== 'true' && isSuperadmin !== true ?
                                                                status && (value.IsEditable === '0' || value.IsEditable === false) ? true
                                                                    :
                                                                    false
                                                                :
                                                                false
                                                        }
                                                        onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>Agency Code</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" name='AgencyCode' maxLength={10} disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false} onChange={handlChanges} value={value.AgencyCode} />
                                                </div>


                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>Law Title</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-5 mt-1">
                                                    <Select
                                                        name='LawTitleID'
                                                        isClearable
                                                        value={lawTitleDrpDwnVal.find(option => option.value === value.LawTitleID) || null}
                                                        options={lawTitleDrpDwnVal}
                                                        onChange={(e) => changeDropDown(e, 'LawTitleID')}
                                                        placeholder="Law Title"
                                                        styles={customStylesWithOutColor}
                                                    />
                                                </div>



                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>FBI ID</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-5 mt-1">
                                                 
                                                    {
                                                        value?.FBIName ?
                                                            <Select
                                                                name='FBIID'
                                                                isClearable
                                                                value={fbiDrpDwnVal.find(option => option.value === value.FBIID) || null}
                                                                options={fbiDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'FBIID')}
                                                                placeholder="Law Title"
                                                                styles={customStylesWithOutColor}
                                                            />
                                                            :
                                                            <Select
                                                                name='FBIID'
                                                                isClearable
                                                                options={fbiDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'FBIID')}
                                                                placeholder="FBI ID"
                                                                styles={customStylesWithOutColor}
                                                            />

                                                    }
                                                </div>

                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>Category</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1">
                                                    {
                                                        value?.CategoryName ?
                                                            <Select
                                                                name='CategoryID'
                                                                isClearable
                                                                value={categoryDropDownVal.find(option => option.value === value.CategoryID) || null}
                                                                options={categoryDropDownVal}
                                                                onChange={(e) => changeDropDown(e, 'CategoryID')}
                                                                placeholder="Category"
                                                                styles={customStylesWithOutColor}
                                                            />
                                                            :
                                                            <Select
                                                                name='CategoryID'
                                                                isClearable
                                                                options={categoryDropDownVal}
                                                                onChange={(e) => changeDropDown(e, 'CategoryID')}
                                                                placeholder="Category"
                                                                styles={customStylesWithOutColor}
                                                            />

                                                    }
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>Degree</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1">
                                                    {
                                                        value?.DegreeName ?
                                                            <Select
                                                                name='CategoryID'
                                                                isClearable
                                                                defaultValue={value?.DegreeName}
                                                                value={degreeDrpDwnVal.find(option => option.value === value.DegreeID) || null}
                                                                options={degreeDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'DegreeID')}
                                                                placeholder="Degree"
                                                                styles={customStylesWithOutColor}
                                                            />
                                                            :
                                                            <Select
                                                                name='CategoryID'
                                                                isClearable
                                                                options={degreeDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'DegreeID')}
                                                                placeholder="Degree"
                                                                styles={customStylesWithOutColor}
                                                            />

                                                    }
                                                </div>


                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>Charge Class</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1">
                                                    {
                                                        value?.ChargeClassName ?
                                                            <Select
                                                                name='ChargeClassID'
                                                                isClearable
                                                                value={chargeClsDrpDwnVal.find(option => option.value === value.ChargeClassID) || null}
                                                                options={chargeClsDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'ChargeClassID')}
                                                                placeholder="Charge Class"
                                                                styles={customStylesWithOutColor}
                                                            />
                                                            :
                                                            <Select
                                                                name='ChargeClassID'
                                                                isClearable
                                                                options={chargeClsDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'ChargeClassID')}
                                                                placeholder="Charge Class"
                                                                styles={customStylesWithOutColor}
                                                            />

                                                    }
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>UCR Arrest</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1">
                                                    {
                                                        value?.UCRArrestName ?
                                                            <Select
                                                                name='UCRArrestID'
                                                                isClearable
                                                                value={ucrArrestDrpDwnVal.find(option => option.value === value.UCRArrestID) || null}
                                                                options={ucrArrestDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'UCRArrestID')}
                                                                placeholder="Ucr Arrest"
                                                                styles={customStylesWithOutColor}

                                                            />
                                                            :
                                                            <Select
                                                                name='UCRArrestID'
                                                                isClearable
                                                                options={ucrArrestDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'UCRArrestID')}
                                                                placeholder="Ucr Arrest"
                                                                styles={customStylesWithOutColor}

                                                            />

                                                    }
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>UCR Code</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1">
                                                    {
                                                        value?.UCRCodeName ?
                                                            <Select
                                                                name='UCRCodeID'
                                                                isClearable
                                                                value={ucrDrpDwnVal.find(option => option.value === value.UCRCodeID) || null}
                                                                options={ucrDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'UCRCodeID')}
                                                                placeholder="UCR Code"
                                                                styles={customStylesWithOutColor}
                                                            />
                                                            :
                                                            <Select
                                                                name='UCRCodeID'
                                                                isClearable
                                                                options={ucrDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'UCRCodeID')}
                                                                placeholder="UCR Code"
                                                                styles={customStylesWithOutColor}
                                                            />

                                                    }
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>Charge&nbsp;Group</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1">
                                                    {
                                                        value?.ChargeGroupName ?
                                                            <Select
                                                                name='ChargeGroupID'
                                                                isClearable
                                                                value={chargeGrpDrpDwnVal.find(option => option.value === value.ChargeGroupID) || null}
                                                                options={chargeGrpDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'ChargeGroupID')}
                                                                placeholder="Charge Group"
                                                                styles={customStylesWithOutColor}

                                                            />
                                                            :
                                                            <Select
                                                                name='ChargeGroupID'
                                                                isClearable
                                                                options={chargeGrpDrpDwnVal}
                                                                onChange={(e) => changeDropDown(e, 'ChargeGroupID')}
                                                                placeholder="Charge Group"
                                                                styles={customStylesWithOutColor}

                                                            />
                                                    }
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='new-label'>State CD</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={''} name='StateCD' onChange={handlChanges} value={value.StateCD} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Unique Charge</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='UniqueCharge' onChange={handlChanges} value={value.UniqueCharge} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Subsection</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='Subsection' onChange={handlChanges} value={value.Subsection} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Mandate&nbsp;Hour</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='MandatoryHours' onChange={HandleChanges} value={value.MandatoryHours} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Citation Fine</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='CitationFine' onChange={HandleChanges} value={value.CitationFine} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>LC</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='LC' onChange={handlChanges} value={value.LC} />
                                                </div>



                                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Junsdiction</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='Junsdiction' onChange={handlChanges} value={value.Junsdiction} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Description</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='ShortDescription' onChange={handlChanges} value={value.ShortDescription} />
                                                </div>

                                                <div className="col-2 col-md-2 col-lg-2 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0 text-nowrap'>State Ordinal Code</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-1 text-field">
                                                    <input type="text" maxLength={10} name='StateOrdinalCode' onChange={handlChanges} value={value.StateOrdinalCode} />
                                                </div>

                                                <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Agency</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-5 mt-1 ">
                                                    <SelectBox
                                                        options={agencyData}
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={false}
                                                        onChange={Agencychange}
                                                        allowSelectAll={true}
                                                        value={multiSelected.optionSelected}
                                                    />
                                                </div>
                                                <div className='col-lg-6'></div>
                                                <div className="col-6 col-md-6 col-lg-2">
                                                    <input type="checkbox" name="IsWarrantCode" checked={value.IsWarrantCode} value={value.IsWarrantCode}
                                                        onChange={handlChanges}
                                                        id="IsWarrantCode" />
                                                    <label className='ml-2' htmlFor="IsWarrantCode">Is Warrant Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsBondDenied" checked={value.IsBondDenied} value={value.IsBondDenied}
                                                        onChange={handlChanges}
                                                        id="IsBondDenied" />
                                                    <label className='ml-2' htmlFor="IsBondDenied">Is Bond Denied</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsParoleViolation" checked={value.IsParoleViolation} value={value.IsParoleViolation}
                                                        onChange={handlChanges}
                                                        id="IsParoleViolation" />
                                                    <label className='ml-2' htmlFor="IsParoleViolation">Is Parole Violation</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsAssaultive" checked={value.IsAssaultive} value={value.IsAssaultive}
                                                        onChange={handlChanges}
                                                        id="IsAssaultive" />
                                                    <label className='ml-2' htmlFor="IsAssaultive">Is Assaultive</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsNeedsDNATaken" checked={value.IsNeedsDNATaken} value={value.IsNeedsDNATaken}
                                                        onChange={handlChanges}
                                                        id="IsNeedsDNATaken" />
                                                    <label className='ml-2' htmlFor="IsNeedsDNATaken">Is Needs DNA Taken</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsProbation" checked={value.IsProbation} value={value.IsProbation}
                                                        onChange={handlChanges}
                                                        id="IsProbation" />
                                                    <label className='ml-2' htmlFor="IsProbation">Is Probation</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsAutoHold" checked={value.IsAutoHold} value={value.IsAutoHold}
                                                        onChange={handlChanges}
                                                        id="IsAutoHold" />
                                                    <label className='ml-2' htmlFor="IsAutoHold">Is Auto Hold</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsParking" checked={value.IsParking} value={value.IsParking}
                                                        onChange={handlChanges}
                                                        id="IsParking" />
                                                    <label className='ml-2' htmlFor="IsParking">Is Parking</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsTicketCode" checked={value.IsTicketCode} value={value.IsTicketCode}
                                                        onChange={handlChanges}
                                                        id="IsTicketCode" />
                                                    <label className='ml-2' htmlFor="IsTicketCode">Is Ticket Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsNjeTicket" checked={value.IsNjeTicket} value={value.IsNjeTicket}
                                                        onChange={handlChanges}
                                                        id="IsNjeTicket" />
                                                    <label className='ml-2' htmlFor="IsNjeTicket">Is Nje Ticket</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2">
                                                    <input type="checkbox" name="IsArrestCode" checked={value.IsArrestCode} value={value.IsArrestCode}
                                                        onChange={handlChanges}
                                                        id="IsArrestCode" />
                                                    <label className='ml-2' htmlFor="IsArrestCode">Is Arrest Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsOffenseCode" checked={value.IsOffenseCode} value={value.IsOffenseCode}
                                                        onChange={handlChanges}
                                                        id="IsOffenseCode" />
                                                    <label className='ml-2' htmlFor="IsOffenseCode">Is Offense Code</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsETicketDieselInd" checked={value.IsETicketDieselInd} value={value.IsETicketDieselInd}
                                                        onChange={handlChanges}
                                                        id="IsETicketDieselInd" />
                                                    <label className='ml-2' htmlFor="IsETicketDieselInd">Is ETicket Diesel Ind</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsReportable" checked={value.IsReportable} value={value.IsReportable}
                                                        onChange={handlChanges}
                                                        id="IsReportable" />
                                                    <label className='ml-2' htmlFor="IsReportable">Is Reportable</label>
                                                </div>

                                               
                                                <div className="col-6 col-md-6 col-lg-2 ">
                                                    <input type="checkbox" name="IsEditable" checked={value.IsEditable} value={value.IsEditable}
                                                        onChange={handlChanges}
                                                        id="IsCADCfsCode" />
                                                    <label className='ml-2' htmlFor="IsEditable">Is Editable</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsDomesticViolenceCrime" checked={value.IsDomesticViolenceCrime} value={value.IsDomesticViolenceCrime}
                                                        onChange={handlChanges}
                                                        id="IsDomesticViolenceCrime" />
                                                    <label className='ml-2' htmlFor="IsDomesticViolenceCrime">Is Domestic Violence Crime</label>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 ">
                                                    <input type="checkbox" name="IsConditionalRelease" checked={value.IsConditionalRelease} value={value.IsConditionalRelease}
                                                        onChange={handlChanges}
                                                        id="IsConditionalRelease" />
                                                    <label className='ml-2' htmlFor="IsConditionalRelease">Is Conditional Release</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right pt-1  mr-1" style={{ marginBottom: '-13px' }}>
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

export default ChargeCodeAddUp;

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