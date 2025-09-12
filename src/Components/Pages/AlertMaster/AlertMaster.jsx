import Select from "react-select";
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../Common/DeleteModal';
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Decrypt_Id_Name, tableCustomStyles } from '../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useDispatch, useSelector } from 'react-redux';
import { Comman_changeArrayFormat } from '../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { RequiredField, RequiredFieldIncident } from '../Utility/Personnel/Validation';
import { get_ScreenPermissions_Data } from "../../../redux/actions/IncidentAction";

const AlertMaster = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [isChanged, setIsChanged] = useState(false);
    const [priorityDrpData, setPriorityDrpData] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [alertData, setAlertData] = useState([]);
    const [initialAlertData, setInitialAlertData] = useState([]);
    const [isSuperadmin, setIsSuperadmin] = useState(0);
    const [status, setStatus] = useState(false);
    const [alertID, setAlertID] = useState('')
    const [isActive, setIsActive] = useState('')
    const [clickedRow, setClickedRow] = useState(null);
    const [editval, setEditval] = useState();
    const [upDateCount, setUpDateCount] = useState(0);
    const [isAllChecked, setIsAllChecked] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [value, setValue] = useState({
        'AgencyID': '', 'AlertTitle': '', 'Priority': '', 'AlertID': '', 'IsActive': true, 'ForeColor': '', 'BackColor': '', 'Notes': '', 'AlertChar': '',
        // -----checkBox-----------
        'IsNamesAlert': '', 'IsLocationsAlert': '', 'IsPropertiesAlert': '', 'IsVehiclesAlert': '', 'IsSystem': '', 'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'AlertTitleError': '', 'AlertCharError': '', 'BackError': '', 'ForeError': '',
        // 'IsActiveError': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); setIsSuperadmin(localStoreData?.IsSuperadmin);
            setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID });
            dispatch(get_ScreenPermissions_Data("U119", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (alertID) { setAlertID(alertID); setIsChanged(false); }
    }, [alertID]);

    useEffect(() => {
        if (loginAgencyID || loginPinID) {
            setValue({
                ...value,
                'AlertID': '', 'AlertTitle': '', 'Priority': '', 'ForeColor': '', 'IsActive': '', 'AgencyID': loginAgencyID, 'BackColor': '', 'Notes': '', 'AlertChar': '',
                // -----checkBox-----------
                'IsNamesAlert': '', 'IsLocationsAlert': '', 'IsPropertiesAlert': '', 'IsVehiclesAlert': '', 'IsSystem': '', 'CreatedByUserFK': loginPinID,
            });
            get_Alert_Data(loginAgencyID, loginPinID); get_priorityDrpData(loginAgencyID)
        }
    }, [loginAgencyID, loginPinID])

    const reset = () => {
        setValue({
            ...value,
            'AlertTitle': '', 'Priority': '', 'ForeColor': '', 'BackColor': '', 'Notes': '', 'AlertChar': '', 'IsActive': '',
            // -----checkBox-----------
            'IsNamesAlert': '', 'IsLocationsAlert': '', 'IsPropertiesAlert': '', 'IsVehiclesAlert': '', 'IsSystem': '',
        });
        setStatesChangeStatus(false);
    }

    const check_Validation_Error = () => {
        if (!value.IsNamesAlert && !value.IsLocationsAlert && !value.IsPropertiesAlert && !value.IsVehiclesAlert && !value.IsSystem) {
            toastifyError('Please select atleast one alert for type.');
            return;
        }
        if (RequiredField(value.AlertTitle)) {
            setErrors(prevValues => { return { ...prevValues, ['AlertTitleError']: RequiredField(value.AlertTitle) } })
        }
        if (RequiredFieldIncident(value.AlertChar)) {
            setErrors(prevValues => { return { ...prevValues, ['AlertCharError']: RequiredFieldIncident(value.AlertChar) } })
        }
        if (RequiredFieldIncident(value.BackColor)) {
            setErrors(prevValues => { return { ...prevValues, ['BackError']: RequiredFieldIncident(value.BackColor) } })
        }
        if (RequiredFieldIncident(value.ForeColor)) {
            setErrors(prevValues => { return { ...prevValues, ['ForeError']: RequiredFieldIncident(value.ForeColor) } })
        }

    }
    const { AlertTitleError, AlertCharError, BackError, ForeError } = errors

    useEffect(() => {
        if (AlertTitleError === 'true' && AlertCharError === 'true' && BackError === 'true' && ForeError === 'true'
        ) {
            if (status) { Update_Alert() }
            else { Insert_Alert() }
        }
    }, [AlertTitleError, AlertCharError, BackError, ForeError
    ])

    useEffect(() => {
        if (alertID && status) {
            GetSingleData(alertID)
        }
    }, [upDateCount, alertID])

    const GetSingleData = (alertID) => {
        const val = { 'AlertID': alertID }
        fetchPostData('Alert/GetSingleData_Alert', val)
            .then((res) => {
                if (res) { setEditval(res) }
                else { setEditval() }
            })
    }

    useEffect(() => {
        if (editval && status) {
            setValue({
                ...value,
                AlertID: alertID, ForeColor: editval[0]?.ForeColor, BackColor: editval[0]?.BackColor,
                AlertTitle: editval[0]?.AlertTitle, Notes: editval[0]?.Notes, Priority: editval[0]?.Priority, CreatedByUserFK: editval[0]?.CreatedByUserFK,
                AlertChar: editval[0]?.AlertChar, ModifiedByUserFK: loginPinID,
                IsActive: editval[0].IsActive === "Yes" ? true : false,
                IsNamesAlert: editval[0]?.IsNamesAlert, IsLocationsAlert: editval[0]?.IsLocationsAlert, IsPropertiesAlert: editval[0]?.IsPropertiesAlert,
                IsVehiclesAlert: editval[0]?.IsVehiclesAlert, IsSystem: editval[0]?.IsSystem,
            });
        } else {
            setValue({
                ...value,
                'AlertTitle': '', 'AlertID': '', 'Priority': '', 'IsActive': true, 'ForeColor': '', 'BackColor': '', 'Notes': '', 'AlertChar': '', 'IsNamesAlert': '',
                'IsLocationsAlert': '', 'IsPropertiesAlert': '', 'IsVehiclesAlert': '', 'IsSystem': '', 'CreatedByUserFK': loginAgencyID,
            });
        }
    }, [editval, status]);

    //---------------Get_Data_Alert-------------
    const get_Alert_Data = (loginAgencyID, loginPinID) => {
        const val = { 'IsActive': true, 'AgencyID': loginAgencyID, 'IsSuperAdmin': loginPinID, 'PINID': loginAgencyID, };
        fetchPostData('Alert/GetData_Alert', val).then((res) => {
            if (res) { setAlertData(res); setInitialAlertData(res); }
            else { setAlertData([]); setInitialAlertData([]); }
        });
    };

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") { reset() }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const handleChange = (e) => {
        setStatesChangeStatus(true)
        if (e.target.name === 'IsSystem' || e.target.name === 'IsNamesAlert' || e.target.name === 'IsLocationsAlert' || e.target.name === 'IsPropertiesAlert' || e.target.name === 'IsVehiclesAlert') {
            setValue({ ...value, [e.target.name]: e.target.checked });
        } else if (e.target.name === 'AllClick') {
            const isChecked = e.target.checked;
            setValue({
                ...value,
                IsNamesAlert: isChecked, IsLocationsAlert: isChecked, IsPropertiesAlert: isChecked, IsVehiclesAlert: isChecked, IsSystem: isChecked,
            });
            setIsAllChecked(isChecked);
        } else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
        setIsChanged(true);
    };

    useEffect(() => {
        const allChecked = value.IsNamesAlert && value.IsLocationsAlert && value.IsPropertiesAlert && value.IsVehiclesAlert && value.IsSystem;
        setIsAllChecked(allChecked);
    }, [value.IsNamesAlert, value.IsLocationsAlert, value.IsPropertiesAlert, value.IsVehiclesAlert, value.IsSystem]);

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true)
        if (e) { setValue({ ...value, [name]: e.value }) }
        else { setValue({ ...value, [name]: null }); setIsChanged(true); }
    }

    //-----------DrpDown_Data-------------------
    const get_priorityDrpData = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('Priority/GetDataDropDown_Priority', val).then((res) => {
            if (res) { setPriorityDrpData(Comman_changeArrayFormat(res, 'PriorityID', 'Description')) }
            else { setPriorityDrpData() }
        })
    }

    //-------------Insert_Alert------------
    const Insert_Alert = () => {
        const result = alertData?.find(item => {
            if (item.AlertChar) {
                if (item.AlertChar === value.AlertChar) {
                    return item.AlertChar === value.AlertChar
                } else return item.AlertChar === value.AlertChar
            }
        });
        if (result) {

            toastifyError('AlertChar Already Exists')
            setErrors({ ...errors, ['AlertCharError']: '', })
        } else {

            const {
                AgencyID, AlertTitle, Priority, AlertID, IsActive, ForeColor, BackColor, Notes, AlertChar,
                IsNamesAlert, IsLocationsAlert, IsPropertiesAlert, IsVehiclesAlert, IsSystem, CreatedByUserFK
            } = value
            const val = {
                'AgencyID': loginAgencyID, 'AlertTitle': AlertTitle, 'Priority': Priority, 'AlertID': AlertID, 'IsActive': IsActive, 'ForeColor': ForeColor, 'BackColor': BackColor, 'Notes': Notes, 'AlertChar': AlertChar,
                'IsNamesAlert': IsNamesAlert, 'IsLocationsAlert': IsLocationsAlert, 'IsPropertiesAlert': IsPropertiesAlert, 'IsVehiclesAlert': IsVehiclesAlert, 'IsSystem': IsSystem, CreatedByUserFK: loginAgencyID
            }
            AddDeleteUpadate('Alert/InsertAlert', val).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setStatesChangeStatus(false);
                setErrors({ ...errors, ['AlertCharError']: '' })
                get_Alert_Data(loginAgencyID, loginPinID); reset('')
            })
        }
    }

    const Update_Alert = () => {
        const result = alertData?.find(item => {
            if (item.AlertChar) {
                if (item.AlertID != value.AlertID) {
                    if (item.AlertChar === value.AlertChar) {
                        return item.AlertChar === value.AlertChar
                    } else return item.AlertChar === value.AlertChar
                }
            }
        });
        if (result) {
            toastifyError('AlertChar Already Exists');
            setErrors({ ...errors, ['AlertCharError']: '' })
        } else {
            AddDeleteUpadate('Alert/UpdateAlert', value).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setStatesChangeStatus(false);
                setErrors({ ...errors, ['AlertCharError']: '' })
                get_Alert_Data(loginAgencyID, loginPinID); setStatusFalse();
            })
        }
    }

    const Delete_Alert = () => {
        const value = { 'IsActive': isActive, 'AlertID': alertID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('Alert/DeleteAlert', value)
            .then(res => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    get_Alert_Data(loginAgencyID, loginPinID); setStatus(false);
                } else { toastifyError(res.data.Message) }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const columns = [
        { name: 'Active', selector: (row) => row.IsActive, sortable: true },
        { name: 'Alert Name', selector: (row) => row.AlertTitle, sortable: true },
        { name: 'Priority', selector: (row) => row.PriorityDescription, sortable: true },
        { name: 'Alert For', selector: (row) => row.AlertFor, sortable: true },
        { name: 'Alert Character', selector: (row) => row.AlertChar, sortable: true },
        { name: 'Back Color', selector: (row) => (<div style={{ backgroundColor: row.BackColor, width: '50px', height: '20px' }}></div>), sortable: true },
        { name: 'Fore Color', selector: (row) => (<div style={{ backgroundColor: row.ForeColor, width: '50px', height: '20px' }}></div>), sortable: true },
        {
            name: 'Notes', selector: (row) => row?.Notes || '', format: (row) => (<>{row?.Notes ? row?.Notes.substring(0, 70) : ''}{row?.Notes?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
       
    ]

    const setEditValue = (row) => {
        setAlertID(row.AlertID); reset(); setStatus(true); setUpDateCount(upDateCount + 1); setErrors('')
    }

    const setStatusFalse = () => {
        setClickedRow(null); get_Alert_Data(loginAgencyID, loginPinID);
        setStatus(false); setIsAllChecked(''); setErrors(''); reset(); setStatesChangeStatus(false);
    }

    const customStylesWithOutColor = {
        control: base => ({ ...base, height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0, }),
    };

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer',
            },
        }
    ];

    const handleBackColorChange = (event) => {
        setStatesChangeStatus(true); setValue({ ...value, BackColor: event.target.value, });
    };

    const handleForeColorChange = (event) => {
        setStatesChangeStatus(true)
        setValue({ ...value, ForeColor: event.target.value, });
    };

    const onClose = () => {
        navigate('/dashboard-page');
    }

    const AddType = [
        { value: true, label: 'Yes', }, { value: false, label: 'No', },
    ]

    const get_AlertSearch = async () => {
        if ((value?.IsActive || value?.IsActive === false) || value?.AlertTitle || value?.Priority) {
            const { IsActive, AlertTitle, Priority, AgencyID } = value;
            const val = { 'IsActive': IsActive, 'AlertTitle': AlertTitle, 'Priority': Priority, 'AgencyID': loginAgencyID };
            try {
                const res = await fetchPostData('Alert/Search_Alert', val);
                if (res.length > 0) {
                    setAlertData(res);
                } else {
                    toastifyError("Data Not Available");
                    setAlertData([]);
                }
            } catch (error) {
                toastifyError("Error fetching search results");
            }
        } else {
            setAlertData(initialAlertData);
        }
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20, minHeight: 33, fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    };

    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency  name-card ">
                            <div className="card-body">
                                <div className="col-12 col-md-12 col-lg-12 ">
                                    <div className="row " style={{ marginTop: '-10px' }}>
                                        <div className="col-2 col-md-2 col-lg-1 px-0  mt-2">
                                            <label htmlFor="" className='new-label px-0'>Alert&nbsp;Name&nbsp;Code{errors.AlertTitleError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AlertTitleError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3  text-field mt-1">
                                            <input type="text" className='requiredColor' autoComplete='off' name='AlertTitle' value={value?.AlertTitle} onChange={handleChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2  mt-2">
                                            <label htmlFor="" className='new-label'>Alert Character{errors.AlertCharError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AlertCharError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-2  text-field mt-1">
                                            <input type="text" name='AlertChar' className='requiredColor' maxLength={5} autoComplete='off' value={value?.AlertChar} onChange={handleChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Priority</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                                            <Select
                                                name='Priority'
                                                styles={customStylesWithOutColor}
                                                value={priorityDrpData?.filter((obj) => obj.value === value?.Priority)}
                                                isClearable
                                                options={priorityDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'Priority')}
                                                placeholder="Select..."
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-3">
                                            <label htmlFor="" className='label-name '>Notes</label>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-11 text-field mt-1" >
                                            <textarea id="Notes" cols="30" rows='2' className="form-control pt-2 pb-2 " name='Notes' value={value?.Notes} onChange={handleChange} style={{ resize: 'none' }} ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 ">
                                    <div className="row mt-1" >
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Back Color{errors.BackError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.BackError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-1  text-field mt-1">
                                            <input type="color" id="BackColor" name="BackColor" style={{ height: '30px' }} value={value.BackColor || '#ffffff'}
                                                onChange={handleBackColorChange} />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Fore Color{errors.ForeError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ForeError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-1  text-field mt-1">
                                            <input type="color" id="ForeColor" name="ForeColor" style={{ height: '30px' }}
                                                value={value.ForeColor || '#ffffff'}
                                                onChange={handleForeColorChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 ">
                                    <div className="row mt-2" >
                                        <div className="col-2 col-md-2 col-lg-1  ">
                                            <label htmlFor="" className='new-label  '>Alert For:</label>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='AllClick' id="flexCheckDefault"
                                                    checked={isAllChecked}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    All
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name="IsNamesAlert" checked={value.IsNamesAlert} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="flexCheckDefault1">
                                                    Names
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name="IsLocationsAlert" checked={value.IsLocationsAlert} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                    Locations
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name="IsPropertiesAlert" checked={value.IsPropertiesAlert} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="flexCheckDefault3">
                                                    Properties
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name="IsVehiclesAlert" checked={value.IsVehiclesAlert} onChange={handleChange} />
                                                <label className="form-check-label" htmlFor="flexCheckDefault4">
                                                    Vehicles
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-1">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='IsSystem' id="flexCheckDefault5" checked={value.IsSystem} onChange={handleChange} />

                                                <label className="form-check-label" htmlFor="flexCheckDefault5">
                                                    System
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>IsActive
                                                {/* {errors.IsActiveError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IsActiveError}</p>
                                            ) : null} */}
                                            </label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                                            <Select
                                                name='IsActive'
                                                menuPlacement="top"
                                                options={AddType}
                                                // styles={colourStyles}
                                                isClearable
                                                value={AddType?.filter((obj) => obj.value === value?.IsActive)}
                                                onChange={(selectedOption) => {
                                                    setValue({ ...value, ['IsActive']: selectedOption ? selectedOption.value : '' });
                                                    setStatesChangeStatus(true)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            

                                <div className="btn-box  text-right  mr-1 mb-1 mt-3" >
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { setStatusFalse(); }} >New</button>
                                    {
                                        status ?
                                            effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                                                <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                                : <></> :
                                                <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                            :
                                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                                                : <></> :
                                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                                    }
                                </div>
                                <div className="col-12 mt-3">
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={alertData}
                                        pagination
                                        highlightOnHover
                                        fixedHeaderScrollHeight='220px'
                                        fixedHeader
                                        conditionalRowStyles={conditionalRowStyles}
                                        onRowClicked={(row) => {
                                            setEditValue(row); setClickedRow(row);
                                        }}
                                        persistTableHead={true}
                                        customStyles={tableCustomStyles}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={Delete_Alert} />

        </>
    )
}

export default AlertMaster