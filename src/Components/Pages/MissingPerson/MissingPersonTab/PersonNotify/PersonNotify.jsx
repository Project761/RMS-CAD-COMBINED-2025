import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { Requiredcolour, tableCustomStyles } from '../../../../Common/Utility'
import Select from "react-select";
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { PhoneFieldNotReq, PhoneField } from '../../../Agency/AgencyValidation/validators';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { sixColArrayArrest } from '../../../../Common/ChangeArrayFormat';

const PersonNotify = (props) => {

    const dispatch = useDispatch();

    const { DecMissPerID, DecIncID } = props
    // const arresteeNameData = useSelector((state) => state.DropDown.arresteeNameData);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { setChangesStatus, get_MissingPerson_Count, personNotifyDrp, setpersonNotifyDrp, get_MissingPerson_NotifyDrp } = useContext(AgencyContext);

    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [PersonToBeNotifiedID, setPersonToBeNotifiedID,] = useState('');
    const [clickedRow, setClickedRow] = useState(null);
    const [editval, setEditval] = useState();
    const [status, setStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [personNotifyData, setpersonNotifyData] = useState();
    const [type, setType] = useState("MissingNotify");
    const [possessionID, setPossessionID] = useState();
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    // const [personNotifyDrp, setpersonNotifyDrp] = useState([]);

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("M127", localStoreData?.AgencyID, localStoreData?.PINID));
            get_MissingPerson_Count(DecMissPerID, localStoreData?.PINID);
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

    const [value, setValue] = useState({
        'MissingPersonID': DecMissPerID, 'NameID': '', 'CreatedByUserFK': '', 'CellPhone': '', 'HomePhone': '', 'WorkPhone': '', 'PersonToBeNotifiedID': '',
    });

    const [errors, setErrors] = useState({
        'LastNameErrors': '', 'CellPhoneError': 'true', 'HomePhoneError': 'true', 'WorkPhoneError': 'true'
    })

    useEffect(() => {
        if (DecMissPerID) {
            setValue(prevValue => ({ ...prevValue, 'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID, })); get_MissingPerson_Count(DecMissPerID, loginPinID)
        }
        get_Data();
    }, [DecMissPerID, loginPinID]);

    useEffect(() => {
        get_MissingPerson_NotifyDrp(DecIncID, DecMissPerID, 'IsPersonToBeNotified');
    }, [DecIncID, DecMissPerID, possessionID]);


    useEffect(() => {
        if (possessionID) {
            setValue({ ...value, ['NameID']: parseInt(possessionID) });
        }
    }, [possessionID, personNotifyDrp]);

    useEffect(() => {
        if (clickedRow?.PersonToBeNotifiedID) { GetSingleData(clickedRow?.PersonToBeNotifiedID) }
    }, [clickedRow])

    const GetSingleData = (PersonToBeNotifiedID) => {
        fetchPostData('PersonToBeNotified/GetSingleData_PersonToBeNotified', { 'PersonToBeNotifiedID': PersonToBeNotifiedID })
            .then((res) => {
                if (res) { setEditval(res) }
                else { setEditval() }
            })
    }

    // const get_MissingPerson_NotifyDrp = (IncidentID, MissingPersonID) => {
    //     const val = {

    //         'IncidentID': IncidentID, 'MissingPersonID': MissingPersonID
    //     };

    //     fetchPostData('MissingPerson/GetDropDown_PersonToByNotified', val).then((data) => {
    //         if (data) {
    //             console.log(data)
    //             setpersonNotifyDrp(sixColArrayArrest(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID', 'AgeFrom', 'IsJuvenile'));
    //         } else {
    //             setpersonNotifyDrp(sixColArrayArrest(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID', 'AgeFrom', 'IsJuvenile'));
    //         }
    //     })
    // };


    useEffect(() => {
        if (editval) {
            setValue({
                ...value, 'PersonToBeNotifiedID': PersonToBeNotifiedID, 'CellPhone': editval[0]?.CellPhone, 'HomePhone': editval[0]?.HomePhone,
                'WorkPhone': editval[0]?.WorkPhone, 'ModifiedByUserFK': loginPinID, 'NameID': editval[0]?.NameID, 'MissingPersonID': editval[0]?.MissingPersonID
            }); setPossessionID(editval[0]?.NameID);
        } else {
            setValue({ ...value, 'MissingPersonID': '', 'NameID': '', 'CreatedByUserFK': '', 'CellPhone': '', 'HomePhone': '', 'WorkPhone': '', });
        }
    }, [editval])

    const columns = [
        {
            name: 'Name', selector: (row) => row.Arrestee_Name ? row.Arrestee_Name : '', sortable: true
        },
        {
            name: 'Cell Phone', selector: (row) => row.CellPhone ? row.CellPhone : '', sortable: true
        },
        {
            name: 'Home Phone', selector: (row) => row.HomePhone ? row.HomePhone : '', sortable: true
        },
        {
            name: 'Work Phone', selector: (row) => row.WorkPhone ? row.WorkPhone : '', sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={() => { setPersonToBeNotifiedID(row.PersonToBeNotifiedID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span onClick={() => { setPersonToBeNotifiedID(row.PersonToBeNotifiedID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>
        }
    ]

    const set_Edit_Value = (row) => {
        reset(); GetSingleData(row.PersonToBeNotifiedID); setPersonToBeNotifiedID(row.PersonToBeNotifiedID);
        setStatus(true); setUpdateStatus(updateStatus + 1); setErrors({ ...errors, 'LastNameErrors': '', 'PhoneErrors': 'true' });
    }

    const setStatusFalse = (e) => {
        setChangesStatus(false); setStatus(false); reset(); setUpdateStatus(updateStatus + 1); setClickedRow(null);
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.NameID)) {
            setErrors(prevValues => { return { ...prevValues, ['LastNameErrors']: RequiredFieldIncident(value.NameID) } })
        }
        const CellPhoneError = value.CellPhone ? PhoneField(value.CellPhone) : 'true'
        const HomePhoneError = value.HomePhone ? PhoneField(value.HomePhone) : 'true'
        const WorkPhoneError = value.WorkPhone ? PhoneField(value.WorkPhone) : 'true'
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['CellPhoneError']: CellPhoneError || prevValues['CellPhoneError'],
                ['HomePhoneError']: HomePhoneError || prevValues['HomePhoneError'],
                ['WorkPhoneError']: WorkPhoneError || prevValues['WorkPhoneError'],
            }
        })
    }

    const { LastNameErrors, CellPhoneError, HomePhoneError, WorkPhoneError } = errors

    useEffect(() => {
        if (LastNameErrors === 'true' && CellPhoneError === 'true' && HomePhoneError === 'true' && WorkPhoneError === 'true') {
            if (PersonToBeNotifiedID && status) { update_Activity() }
            else { Add_Type() }
        }
    }, [LastNameErrors, CellPhoneError, HomePhoneError, WorkPhoneError])

    const Add_Type = () => {
        const MissingPersonID = DecMissPerID
        const CreatedByUserFK = loginPinID
        const { NameID, CellPhone, HomePhone, WorkPhone, } = value
        const val = { MissingPersonID, NameID, CreatedByUserFK, CellPhone, HomePhone, WorkPhone, }
        const exists = personNotifyData?.some(item =>
            item.NameID === NameID &&
            item.CellPhone === CellPhone &&
            item.HomePhone === HomePhone &&
            item.WorkPhone === WorkPhone
        );
        if (exists) {
            toastifyError('Phone numbers already exist'); setErrors({ ...errors, ['CellPhoneError']: '', ['HomePhoneError']: '', ['WorkPhoneError']: '' });
        }
        else {
            AddDeleteUpadate('PersonToBeNotified/Insert_PersonToBeNotified', val).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                reset(); get_Data(); toastifySuccess(message); get_MissingPerson_Count(DecMissPerID, loginPinID)
                setStatesChangeStatus(false); setChangesStatus(false)
            })
        }
    }

    const update_Activity = () => {
        const MissingPersonID = DecMissPerID
        const ModifiedByUserFK = loginPinID
        const { NameID, CellPhone, HomePhone, WorkPhone, PersonToBeNotifiedID } = value
        const val = { MissingPersonID, NameID, ModifiedByUserFK, CellPhone, HomePhone, WorkPhone, PersonToBeNotifiedID }
        const exists = personNotifyData?.some(item =>
            (item.CellPhone === CellPhone && item.PersonToBeNotifiedID !== PersonToBeNotifiedID) &&
            (item.HomePhone === HomePhone && item.PersonToBeNotifiedID !== PersonToBeNotifiedID) &&
            (item.NameID === NameID && item.PersonToBeNotifiedID !== PersonToBeNotifiedID) &&
            (item.WorkPhone === WorkPhone && item.PersonToBeNotifiedID !== PersonToBeNotifiedID)
        );
        if (exists) {
            toastifyError('Phone numbers already exist');
            setErrors({ ...errors, ['CellPhoneError']: '', ['HomePhoneError']: '', ['WorkPhoneError']: '' });
            return;
        }
        AddDeleteUpadate('PersonToBeNotified/Update_PersonToBeNotified', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); get_Data(DecMissPerID); setErrors({ ...errors, 'LastNameErrors': '', }); reset();
            setChangesStatus(false); setStatus(false); setStatesChangeStatus(false)
        })
    }

    const DeleteLastSeen = () => {
        const val = { 'PersonToBeNotifiedID': PersonToBeNotifiedID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('PersonToBeNotified/Delete_PersonToBeNotified', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Data(DecMissPerID); reset()
                get_MissingPerson_Count(DecMissPerID, loginPinID); setStatusFalse()
            } else console.log("Somthing Wrong");
        })
    }

    const get_Data = () => {
        const val = { 'MissingPersonID': DecMissPerID, }
        fetchPostData('PersonToBeNotified/GetData_PersonToBeNotified', val).then((res) => {
            if (res) {
                setpersonNotifyData(res)
            }
            else { setpersonNotifyData([]); }
        })
    }

    const reset = () => {
        setValue({
            ...value, 'MissingPersonID': '', 'NameID': '', 'CreatedByUserFK': '', 'CellPhone': '', 'HomePhone': '', 'WorkPhone': '',
        });
        setErrors({
            ...errors, 'LastNameErrors': '', 'CellPhoneError': '', 'HomePhoneError': '', 'WorkPhoneError': ''
        })
        setPossessionID(''); setPossenSinglData([]); setStatesChangeStatus(false)
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'NameID') {
                setValue({ ...value, [name]: e.value }); setPossessionID(e.value); setPossenSinglData([]);
            }
        } else {
            if (name === 'NameID') {
                setValue({ ...value, [name]: null }); setPossessionID(''); setPossenSinglData([]);
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    }

    const handleChange = (event) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        const { name, value } = event.target;
        let ele = value.replace(/\D/g, '');

        if (ele.length === 10) {
            const cleaned = ele.replace(/\D/g, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                setValue((prevState) => ({ ...prevState, [name]: match[1] + '-' + match[2] + '-' + match[3], }));
            }
        } else {
            ele = value.split('-').join('').replace(/\D/g, '');
            setValue((prevState) => ({ ...prevState, [name]: ele, }));
        }
    };

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer',
            },
        },
    ];


    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setPossenSinglData(res);
            } else { setPossenSinglData([]); }
        })
    }

    return (
        <>
            <fieldset className='mt-2'>
                <legend>Person To Be Notified</legend>
                <div className="col-12 ">
                    <div className="row">
                        <div className="col-3 col-md-3 col-lg-1 mt-2 pt-1">
                            <label htmlFor="" className='new-label'>Name{errors.LastNameErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameErrors}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-6 col-md-6 col-lg-4  mt-1">
                            <Select
                                name="NameID"
                                styles={Requiredcolour}
                                options={personNotifyDrp}
                                value={personNotifyDrp?.filter((obj) => obj.value === value?.NameID)}
                                isClearable
                                onChange={(e) => ChangeDropDown(e, 'NameID')}
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-3 col-md-3 col-lg-1 pt-1" data-toggle="modal" data-target="#MasterModal"  >
                            <button
                                onClick={() => {
                                    if (possessionID) { GetSingleDataPassion(possessionID); } setNameModalStatus(true);
                                }}
                                className=" btn btn-sm bg-green text-white py-1"
                            >
                                <i className="fa fa-plus" > </i>
                            </button>
                        </div>

                        <div className="col-2 col-md-3 col-lg-3 mt-2 ">
                            <label htmlFor="" className='new-label'>Cell Phone{errors.CellPhoneError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CellPhoneError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-3 col-lg-3 mt-1 text-field">
                            <input type="text" className='' name='CellPhone'
                                value={value.CellPhone}
                                onChange={handleChange} maxLength={10} required />
                        </div>
                        <div className="col-2 col-md-3 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Home&nbsp;Phone{errors.HomePhoneError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HomePhoneError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-3 col-lg-4 mt-1 text-field">
                            <input type="text" className='' name='HomePhone'
                                value={value.HomePhone}
                                onChange={handleChange} maxLength={10} required />
                        </div>
                        <div className="col-2 col-md-3 col-lg-4  mt-2 ">
                            <label htmlFor="" className='new-label'>Work Phone{errors.WorkPhoneError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WorkPhoneError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-3 col-lg-3 mt-1 text-field">
                            <input type="text" className='' name='WorkPhone'
                                value={value.WorkPhone}
                                onChange={handleChange} maxLength={10} required />
                        </div>
                    </div>
                </div>
            </fieldset>


            <div className="col-12 text-right mt-2 p-0">
                <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                {
                    PersonToBeNotifiedID && status ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }} >Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }} >Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }} >Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }} >Save</button>
                }
            </div>
            <div className="col-12 mt-2">
                <DataTable
                    dense
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? personNotifyData : [] : personNotifyData}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}

                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    onRowClicked={(row) => { setClickedRow(row); set_Edit_Value(row); setStatesChangeStatus(false) }}
                    pagination
                    paginationPerPage={'10'}
                    paginationRowsPerPageOptions={[10, 15, 20, 50]}
                    fixedHeaderScrollHeight='300px'
                />
            </div>
            <DeletePopUpModal func={DeleteLastSeen} />
            <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possenSinglData, setPossessionID, possessionID, setPossenSinglData, GetSingleDataPassion }} />
            <ChangesModal func={check_Validation_Error} />
        </>
    )
}
export default PersonNotify