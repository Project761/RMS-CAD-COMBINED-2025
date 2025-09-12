import React, { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component';
import { Link, useLocation } from 'react-router-dom'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../../Common/Utility';
import { AddDeleteUpadate, ScreenPermision, fetchPostData } from '../../../../hooks/Api';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import AgencyContactAddUpp from './AgencyContactAddUp';
import { RequiredField } from '../../AgencyValidation/validators';
import { useSelector, useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { Email_Field } from '../../../PersonnelCom/Validation/PersonnelValidation';
import ChangesModal from '../../../../Common/ChangesModal';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const AgencyContact = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [clickedRow, setClickedRow] = useState(null);
    const { get_CountList, setChangesStatus } = useContext(AgencyContext);
    const [agencyContactData, setAgencyContactData] = useState();
    const [agencyContactEditData, setAgencyContactEditData] = useState([]);
    const [status, setStatus] = useState(false);
    const [agencyContactID, setAgencyContactID] = useState();
    const [delAgyContactID, setDelAgyContactID] = useState();
    const [relationUpdStatus, setRelationUpdStatus] = useState(0);
    const [pinID, setPinID] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddAgencyContact, setPermissionForAddAgencyContact] = useState(false);
    const [permissionForEditAgencyContact, setPermissionForEditAgencyContact] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");
    var aIdSta = query?.get("ASta");
    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    const [value, setValue] = useState({
        'FirstName': '', 'MiddleName': '', 'LastName': '', 'AgencyID': aId, 'Phone1': '', 'Phone2': '',
        'Fax': '', 'Cell': '', 'Email': '', 'CreatedByUserFK': pinID, 'AgencyEmergencyID': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (pinID) {
            setValue({
                ...value,
                'FirstName': '', 'MiddleName': '', 'LastName': '', 'AgencyID': aId, 'Phone1': '', 'Phone2': '',
                'Fax': '', 'Cell': '', 'Email': '', 'CreatedByUserFK': pinID, 'AgencyEmergencyID': '',
            });
        }
    }, [pinID]);

    useEffect(() => {
        if (aId) {
            get_Agency_Contact_data(aId);
        }
    }, [aId]);

    useEffect(() => {
        if (agencyContactEditData?.AgencyEmergencyID) {
            setValue({
                'FirstName': agencyContactEditData?.FirstName,
                'MiddleName': agencyContactEditData?.MiddleName,
                'LastName': agencyContactEditData?.LastName,
                'AgencyID': agencyContactEditData?.AgencyID,
                'Phone1': agencyContactEditData?.Phone1,
                'Phone2': agencyContactEditData?.Phone2,
                'Fax': agencyContactEditData?.Fax,
                'Cell': agencyContactEditData?.Cell,
                'Email': agencyContactEditData?.Email,

                'AgencyEmergencyID': agencyContactEditData?.AgencyEmergencyID,
            });
        } else {
            setValue({
                ...value,
                'FirstName': '', 'MiddleName': '', 'LastName': '', 'Phone1': '',
                'Phone2': '', 'Fax': '', 'Cell': '', 'Email': '', 'AgencyEmergencyID': '', 'CreatedByUserFK': pinID,
            });
        }
    }, [agencyContactEditData, relationUpdStatus])

    // initialization Error Hooks
    const [errors, setErrors] = useState({
        'FirstNameError': '', 'LastNameError': '', 'Phone1Error': '', 'Phone2Error': '', 'CellError': '', 'FaxError': '', 'EmailError': ''
    })

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e?.preventDefault()
        if (RequiredFieldIncident(value.FirstName)) {
            setErrors(prevValues => { return { ...prevValues, ['FirstNameError']: RequiredFieldIncident(value.FirstName) } })
        }
        if (RequiredFieldIncident(value.LastName)) {
            setErrors(prevValues => { return { ...prevValues, ['LastNameError']: RequiredFieldIncident(value.LastName) } })
        }
        const Phone1Err = value?.Phone1?.length > 0 && value?.Phone1?.length < 10 ? "Enter Minimum 10 Digits" : 'true';
        const Phone2Err = value?.Phone2?.length > 0 && value?.Phone2?.length < 10 ? "Enter Minimum 10 Digits" : 'true';
        const CellErr = value?.Cell?.length > 0 && value?.Cell?.length < 10 ? "Enter Minimum 10 Digits" : 'true';
        const FaxErr = value?.Fax?.length > 0 && value?.Fax?.length < 10 ? "Enter Minimum 10 Digits" : 'true';
        const EmailErr = value?.Email?.length > 0 ? Email_Field(value.Email) : 'true';
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['Phone1Error']: Phone1Err || prevValues['Phone1Error'],
                ['Phone2Error']: Phone2Err || prevValues['Phone2Error'],
                ['CellError']: CellErr || prevValues['CellError'],
                ['FaxError']: FaxErr || prevValues['FaxError'],
                ['EmailError']: EmailErr || prevValues['EmailError']
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { FirstNameError, LastNameError, Phone1Error, Phone2Error, CellError, FaxError, EmailError } = errors

    useEffect(() => {
        if (FirstNameError === 'true' && LastNameError === 'true' && Phone1Error === 'true' && Phone2Error === 'true' && CellError === 'true' && FaxError === 'true' && EmailError === 'true') {
            if (status) { Update_Agency_Contact() }
            else { Add_Agency_contact() }
        }
    }, [FirstNameError, LastNameError, Phone1Error, Phone2Error, CellError, FaxError, EmailError])


    const reset = () => {
        setValue({
            ...value,
            'FirstName': '', 'MiddleName': '', 'LastName': '', 'Phone1': '', 'Phone2': '',
            'Fax': '', 'Cell': '', 'Email': '', 'AgencyEmergencyID': '', 'FirstNameError': '', 'LastNameError': '',
        })
        setStatesChangeStatus(false);
        setErrors({
            ...errors,
            'FirstNameError': '', 'LastNameError': '', 'Phone1Error': '', 'Phone2Error': '', 'CellError': '', 'FaxError': '', 'EmailError': ''
        })
    }

    const handlChanges = (e) => {
        !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
        if (e.target.name === 'Phone1' || e.target.name === 'Phone2' || e.target.name === 'Cell' || e.target.name === 'Fax') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const Add_Agency_contact = (e) => {
        const result = agencyContactData?.find(item => item.FirstName === value.FirstName);
        const result1 = agencyContactData?.find(item => item.LastName === value.LastName);
        if (result || result1) {
            if (result) {
                toastifyError('FirstName Already Exists')
                setErrors({ ...errors, ['FirstNameError']: '' })
            }
            if (result1) {
                toastifyError('LastName Already Exists')
                setErrors({ ...errors, ['LastNameError']: '' })
            }
        } else {
            AddDeleteUpadate('AgencyEmergencyContact/InsertAgency_EmergencyContact', value).then((res) => {
                if (res) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    setErrors({ ...errors, ['LastNameError']: '' })
                    get_Agency_Contact_data(aId);
                    reset();
                    get_CountList(aId);
                    setStatesChangeStatus(false);
                }
            })
        }
    }

    const Update_Agency_Contact = (e) => {
        const result = agencyContactData?.find(item => {
            if (item.AgencyEmergencyID != value.AgencyEmergencyID) {
                if (item.FirstName === value.FirstName) {
                    return item.FirstName === value.FirstName
                } else return item.FirstName === value.FirstName
            }
            return false;
        });
        const result1 = agencyContactData?.find(item => {
            if (item.AgencyEmergencyID != value.AgencyEmergencyID) {
                if (item.LastName === value.LastName) {
                    return item.LastName === value.LastName
                } else return item.LastName === value.LastName
            }
            return false;
        });
        if (result || result1) {
            if (result) {
                toastifyError('FirstName Already Exists')
                setErrors({ ...errors, ['FirstNameError']: '' })
            }
            if (result1) {
                toastifyError('LastName Already Exists')
                setErrors({ ...errors, ['LastNameError']: '' })
            }
        } else {
            AddDeleteUpadate('AgencyEmergencyContact/UpdateAgency_EmergencyContact', value)
                .then(res => {
                    if (res.success) {
                        const parsedData = JSON.parse(res.data);
                        const message = parsedData.Table[0].Message;
                        toastifySuccess(message);

                        get_Agency_Contact_data(aId);
                        reset()
                        setStatusFalse(); setChangesStatus(false)
                        setErrors({ ...errors, ['LastNameError']: '' })
                        setStatesChangeStatus(false);
                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    const get_Agency_Contact_data = (aId) => {
        const val = { 'AgencyID': aId, }
        fetchPostData('AgencyEmergencyContact/GetDataAgency_EmergencyContact', val).then((res) => {
            if (res) {
                setAgencyContactData(res)
            }
        })
    }

    const getScreenPermision = (aId, pinID) => {
        ScreenPermision("A027", aId, pinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res);
                setPermissionForAddAgencyContact(res[0]?.AddOK);
                setPermissionForEditAgencyContact(res[0]?.Changeok);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
            }
            else {
                setEffectiveScreenPermission();
                setPermissionForAddAgencyContact(false);
                setPermissionForEditAgencyContact(false);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(false)
            }
        }).catch(error => {
            console.error('There was an error!', error);
            setPermissionForAddAgencyContact(false);
            setPermissionForEditAgencyContact(false);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(false)
        });
    }

    const Columns = [
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'Phone 1',
            selector: (row) => row.Phone1,
            sortable: true
        },
        {
            name: 'Phone 2',
            selector: (row) => row.Phone2,
            sortable: true
        },
        {
            name: 'Cell',
            selector: (row) => row.Cell,
            sortable: true
        },
        {
            name: 'Fax',
            selector: (row) => row.Fax,
            sortable: true
        },
        {
            name: 'Email',
            selector: (row) => row.Email,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={(e) => { setDelAgyContactID(row.AgencyEmergencyID) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            <span onClick={(e) => { setDelAgyContactID(row.AgencyEmergencyID) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>
        }
    ]

    const getAgencyContEditData = (row) => {
        setAgencyContactID(row.AgencyEmergencyID)
        reset();
        setAgencyContactEditData(row);
        setRelationUpdStatus(relationUpdStatus + 1);
        setStatus(true);
    }

    const conditionalRowStyles = [
        {
            when: row => row?.AgencyEmergencyID === agencyContactID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const setStatusFalse = (e) => {
        setClickedRow(null); setStatus(false); setAgencyContactEditData([]); reset(); setStatesChangeStatus(false); setAgencyContactID(0)
    }


    const delete_Agency_Contact = async (e) => {
        e.preventDefault()
        const value = { AgencyEmergencyID: delAgyContactID, DeletedByUserFK: pinID, }
        AddDeleteUpadate('AgencyEmergencyContact/DeleteAgency_EmergencyContact', value).then((data) => {
            if (data.success) {
                const parsedData = JSON.parse(data.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Agency_Contact_data(aId);
                get_CountList(aId); setErrors(''); reset()
                if (agencyContactID == delAgyContactID) { setStatus(false); reset(); }
            } else {
                console.log(data?.Message)

            }
        });
    }

    return (
        <>
            <div className="col-12 ">
                <div className="row " >
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>First Name {errors.FirstNameError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</span>
                        ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-3 mt-2 text-field">
                        <input type="text" className='requiredColor' id="FirstName" name='FirstName' value={value.FirstName} onChange={handlChanges} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1 px-0">
                        <label htmlFor="" className='new-label px-0'>Middle Name</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-3 mt-2 text-field">
                        <input type="text" id="MiddleName" name='MiddleName' value={value.MiddleName} onChange={handlChanges} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Last Name  {errors.LastNameError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</span>
                        ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-3 mt-2 text-field">
                        <input type="text" className='requiredColor' id="LastName" name='LastName' value={value.LastName} onChange={handlChanges} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Phone 1 {errors.Phone1Error !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Phone1Error}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <input type="text" maxLength={10} id="Phone1" name='Phone1' value={value.Phone1} onChange={handlChanges} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Phone 2 {errors.Phone2Error !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.Phone2Error}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <input type="text" maxLength={10} id="Phone2" name='Phone2' value={value.Phone2} onChange={handlChanges} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Fax {errors.FaxError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.FaxError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-4 col-lg-3 mt-2 text-field">
                        <input type="text" maxLength={10} id="Fax" name='Fax' value={value.Fax} onChange={handlChanges} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Cell {errors.CellError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CellError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-3 col-lg-3 mt-2 text-field">
                        <input type="Phone" maxLength={10} id="Cell" name='Cell' value={value.Cell} onChange={handlChanges} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Email {errors.EmailError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.EmailError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <input type="Email" name='Email' value={value.Email} onChange={handlChanges} required />
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="btn-box text-right mt-1 mr-1">
                    <button type="button" className="btn btn-sm btn-success mr-1 " data-dismiss="modal" onClick={() => { setStatusFalse(); }}>New</button>
                    {
                        status ?
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.Changeok ?
                                    <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Update</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Update</button>
                            :
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Save</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Save</button>
                    }
                </div>
            </div>
            <div className="col-12 mt-1">
                <DataTable
                    columns={Columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? agencyContactData : "" : agencyContactData}
                    dense
                    showHeader={true}
                    persistTableHead={true}
                    conditionalRowStyles={conditionalRowStyles}
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => {
                        getAgencyContEditData(row); setClickedRow(row);
                    }}
                    fixedHeader
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    fixedHeaderScrollHeight='260px'
                    highlightOnHover
                    noContextMenu
                    pagination
                    responsive
                    subHeaderAlign="right"
                    subHeaderWrap
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={delete_Agency_Contact} />
            <ChangesModal func={check_Validation_Error} />
            {/* <ChangesModal hasPermission={status ? permissionForEditAgencyContact : permissionForAddAgencyContact} func={check_Validation_Error} /> */}
            <IdentifyFieldColor />


        </>
    )
}

export default AgencyContact