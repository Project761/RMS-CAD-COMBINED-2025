import React, { useContext, useEffect, useState } from 'react'
import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor } from '../../../../Common/Utility'
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Link } from 'react-router-dom';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const OtherInformation = () => {

    const { updateCount, get_Arrestee_Drp_Data, get_LocalStorage, localStoreArray } = useContext(AgencyContext);
    const [bilConditionDrp, setBilConditionDrp] = useState([])
    const [judgeDrpData, setJudgeDrpData] = useState([])
    const [nameDrpData, setNameDrpData] = useState([])
    const [editval, setEditval] = useState();
    const [WarrantID, setWarrantID] = useState('');


    const [mainIncidentID, setMainIncidentID] = useState('');

    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [value, setValue] = useState({
        'BailConditionID': null,
        'WarrantNumber': '',
        'BailAmount': '',
        'NameID': null,
        'JudgeID': null,
        'DocketID': '',
        'WarrantID': WarrantID,
        'CreatedByUserFK': loginPinID,
        'ModifiedByUserFK': '',
    })

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', Agency_Name: "" }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setMainIncidentID(localStoreArray?.IncidentID);
                if (localStoreArray?.WarrantID) {
                    setWarrantID(localStoreArray?.WarrantID);
                } else {
                    setWarrantID('');
                }
            }
        }
    }, [localStoreArray])

    useEffect(() => {
        if (editval) {
            setValue({
                ...value,
                'WarrantID': editval[0]?.WarrantID,
                'WarrantNumber': editval[0]?.WarrantNumber,
                'BailAmount': editval[0]?.BailAmount ? editval[0]?.BailAmount : '',
                'NameID': editval[0]?.NameID,
                'BailConditionID': editval[0]?.BailConditionID,
                'JudgeID': editval[0]?.JudgeID,
            })
        } else {
            resetState()
        }
    }, [editval])

    const resetState = () => {
        setValue({
            ...value,
            'BailConditionID': '',
            'BailAmount': '',
            'NameID': '',
            'JudgeID': '',
            'DocketID': '',
        })
    }

    useEffect(() => {
        if (WarrantID) {
            GetSingleData(WarrantID)
        }
    }, [WarrantID, updateCount])

    const GetSingleData = (WarrantID) => {
        const val = { 'WarrantID': WarrantID }
        fetchPostData('Warrant/GetSingleData_Warrant', val)
            .then((res) => {
                if (res) {
                    setEditval(res);
                } else { setEditval() }
            })
    }

    useEffect(() => {
        if (loginAgencyID) {
            get_BilConditionDrpData(loginAgencyID); get_JudgeDrpData(loginAgencyID); get_NameDrpData(loginAgencyID);
        }
        get_Arrestee_Drp_Data(mainIncidentID);
    }, [loginAgencyID, mainIncidentID])

    const get_BilConditionDrpData = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('BailType/GetDataDropDown_BailType', val).then((data) => {
            if (data) {
                setBilConditionDrp(threeColArrayWithCode(data, 'BailTypeID', 'Description', 'BailTypeCode',))
            } else {
                setBilConditionDrp([]);
            }
        })
    }

    const get_JudgeDrpData = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('CourtJudgeName/GetDataDropDown_CourtJudgeName', val).then((data) => {
            if (data) {
                setJudgeDrpData(Comman_changeArrayFormat(data, 'CourtJudgeNameID', 'Description'))
            } else {
                setJudgeDrpData([]);
            }
        })
    }

    const get_NameDrpData = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('/CourtName/GetDataDropDown_CourtName', val).then((data) => {
            if (data) {
                setNameDrpData(Comman_changeArrayFormat(data, 'CourtID', 'Description'))
            } else {
                setNameDrpData([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
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

    const HandleChange = (e) => {
        if (e) {
            if (e.target.name === 'BailAmount') {
                const ele = e.target.value.replace(/[^0-9]/g, "")
                if (ele.includes('.')) {
                    if (ele.length === 16) {
                        setValue({ ...value, [e.target.name]: ele });
                    } else {
                        if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                            setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                        } else { setValue({ ...value, [e.target.name]: ele }) }
                        void 0;
                    }
                } else {
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                }
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

    const update_BilCondition = () => {
        AddDeleteUpadate('Warrant/Update_Warrant_OtherInformation', value).then((res) => {
            toastifySuccess(res.Message);
        })
    }

    return (
        <>
            {/* Bail*/}
            <div className="col-12 " id="display-not-form">
                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-7items-center">
                        <p className="p-0 m-0 d-flex align-items-center">Bail</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12 pt-1 ">
                        <div className="row">
                            <div className="col-4 col-md-4 col-lg-4 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name="BailConditionID"
                                        value={bilConditionDrp?.filter((obj) => obj.value === value?.BailConditionID)}
                                        isClearable
                                        styles={colourStyles}
                                        options={bilConditionDrp}
                                        onChange={(e) => ChangeDropDown(e, 'BailConditionID')}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Bail Condition</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-3 " style={{ marginTop: '5px' }}>
                                <div className="text-field">
                                    <input type="text" name='BailAmount' className="" value={'$' + value?.BailAmount} onChange={HandleChange} id='BailAmount' required />
                                    <label >Bail Amount</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Court Information*/}
            <div className="col-12 " id="display-not-form">
                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">Court Information</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12 pt-1 ">
                        <div className="row">
                            <div className="col-4 col-md-4 col-lg-4 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name="Name"
                                        value={nameDrpData?.filter((obj) => obj.value === value?.NameID)}
                                        isClearable
                                        styles={colourStyles}
                                        options={nameDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'NameID')}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Name</label>
                                </div>
                            </div>
                            <div className="col-4 col-md-4 col-lg-4 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name="Judge"
                                        value={judgeDrpData?.filter((obj) => obj.value === value?.JudgeID)}
                                        isClearable
                                        options={judgeDrpData}
                                        styles={colourStyles}
                                        onChange={(e) => ChangeDropDown(e, 'JudgeID')}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Judge</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2 mt-1">
                                <div className="text-field">
                                    <input type="text" className='readonlyColor' name='WarrantIDNumber' value={value?.WarrantNumber} onChange={HandleChange} required readOnly />
                                    <label>Warrant Number</label>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-2 mt-1">
                                <div className="text-field">
                                    <input type="text" name='DocketID' className="readonlyColor" value={''} onChange={HandleChange} id='DocketID' required readOnly />
                                    <label >Docket Id</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* service-information*/}
            <div className="col-12 " id="display-not-form">
                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-7items-center">
                        <p className="p-0 m-0 d-flex align-items-center">Service Information</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12 pt-1 ">
                        <div className="row">
                            <div className="col-2 col-md-2 col-lg-2 mt-3 ">
                                <div className="form-check ">
                                    <input className="form-check-input" type="checkbox" name='Outsideagency' id="flexCheckDefault" />
                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                        Outside Agency
                                    </label>
                                </div>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name="assignedofficer"
                                        isClearable
                                        styles={customStylesWithOutColor}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Assigned Officer</label>
                                </div>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5 mt-1">
                                <div className=" dropdown__box">
                                    <Select
                                        name="assignedAgency"
                                        isClearable
                                        styles={customStylesWithOutColor}
                                        placeholder="Select..."
                                    />
                                    <label htmlFor="">Assigned Agency</label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12  text-right mt-3 p-0">
                <button type="button" onClick={update_BilCondition} className="btn btn-sm btn-success pl-2">Update</button>
                <Link to={"/warrant"}><button type="button" className="btn btn-sm btn-success mx-1" data-dismiss="modal">Close</button>
                </Link>
            </div>

        </>
    )
}

export default OtherInformation