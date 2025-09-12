import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { RequiredField } from '../../AgencyValidation/validators';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import ChangesModal from '../../../../Common/ChangesModal';
import { RequiredFieldIncident, Space_Not_Allow } from '../../../Utility/Personnel/Validation';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const Shift = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [clickedRow, setClickedRow] = useState(null);

    const { get_CountList, setChangesStatus } = useContext(AgencyContext);

    // Hooks Initialization
    const [shiftList, setShiftList] = useState([])
    const [shiftEditData, setShiftEditData] = useState([])
    const [status, setStatus] = useState(false)
    const [shiftId, setShiftId] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [updCount, setUpdCount] = useState(0);
    const [pinID, setPinID] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddShift, setPermissionForAddShift] = useState(false);
    const [permissionForEditShift, setPermissionForEditShift] = useState(false);
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
                'ShiftCode': '', 'AgencyId': aId, 'ModifiedByUserFK': '', 'ShiftDescription': '', 'Starttime': '', 'EndTime': '',
                'ShiftId': '',
                'CreatedByUserFK': pinID,
            });
        }
    }, [pinID]);

    useEffect(() => {
        if (aId) {
            get_Shift(aId);
        }
    }, [aId]);

    const [value, setValue] = useState({
        'AgencyId': aId,
        'ShiftCode': '',
        'ShiftDescription': '',
        'Starttime': '',
        'EndTime': '',
        'ShiftId': '',
        'CreatedByUserFK': pinID,
    })

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        'ShiftCode': '', 'ShiftDescription': '', 'Starttime': '', 'EndTime': '',
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'ShiftCodeErr': '', 'ShiftDescriptionErr': '', 'StarttimeErr': '', 'EndTimeErr': '',
    })

    const handleInput = (e) => {
        !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    const emptyField = () => {
        setValue({
            ...value,
            'ShiftId': "",
            'ShiftCode': "",
            'ShiftDescription': "",
            'Starttime': "",
            'EndTime': "",
        });
    }

    useEffect(() => {
        if (shiftEditData?.ShiftId) {
            setValue({
                ...value,
                'ShiftId': shiftEditData?.ShiftId,
                'AgencyId': aId,
                'ShiftCode': shiftEditData?.ShiftCode,
                'ShiftDescription': shiftEditData?.ShiftDescription,
                'Starttime': shiftEditData?.Starttime,
                'EndTime': shiftEditData?.EndTime,
                'ModifiedByUserFK': pinID,
            });
        } else {
            setValue({
                ...value,
                'AgencyId': aId,
                'ShiftCode': '',
                'ShiftDescription': '',
                'Starttime': '',
                'EndTime': '',
                'ModifiedByUserFK': '',
            });
        }
    }, [shiftEditData, updCount])

    useEffect(() => {
        if (aId && pinID) { get_Field_Permision_Shift(aId, pinID) }
    }, [aId])

    // Get Effective Field Permission
    const get_Field_Permision_Shift = (aId, pinID) => {
        fieldPermision(aId, 'A020', pinID).then(res => {
            if (res) {
                const ShiftCodeFilter = Agency_Field_Permistion_Filter(res, "Agency-ShiftCode");
                const ShiftDescriptionFilter = Agency_Field_Permistion_Filter(res, "Agency-Description");
                const StarttimeFilter = Agency_Field_Permistion_Filter(res, "Agency-StartTime");
                const EndTimeFilter = Agency_Field_Permistion_Filter(res, "Agency-EndTime");

                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['ShiftCode']: ShiftCodeFilter || prevValues['ShiftCode'],
                        ['ShiftDescription']: ShiftDescriptionFilter || prevValues['ShiftDescription'],
                        ['Starttime']: StarttimeFilter || prevValues['Starttime'],
                        ['EndTime']: EndTimeFilter || prevValues['EndTime'],
                    }
                });
            }
        });
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault();
        const ShiftCodeErr = RequiredFieldIncident(value.ShiftCode);
        const ShiftDescriptionErr = Space_Not_Allow(value.ShiftDescription);
        const StarttimeErr = RequiredField(value.Starttime);
        const EndTimeErr = RequiredField(value.EndTime);

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['ShiftCodeErr']: ShiftCodeErr || prevValues['ShiftCodeErr'],
                ['ShiftDescriptionErr']: ShiftDescriptionErr || prevValues['ShiftDescriptionErr'],
                ['StarttimeErr']: StarttimeErr || prevValues['StarttimeErr'],
                ['EndTimeErr']: EndTimeErr || prevValues['EndTimeErr'],
            }
        });
    }

    // Check All Field Format is True Then Submit 
    const { ShiftCodeErr, ShiftDescriptionErr, EndTimeErr, StarttimeErr } = errors

    useEffect(() => {
        if (ShiftCodeErr === 'true' && ShiftDescriptionErr === 'true' && EndTimeErr === 'true' && StarttimeErr === 'true') {
            if (status) shift_Update()
            else shift_add()
        }
    }, [ShiftCodeErr, ShiftDescriptionErr, EndTimeErr, StarttimeErr])

    // New Shift Create
    const shift_add = async (e) => {
        const result = shiftList?.find(item => item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase());
        const result1 = shiftList?.find(item => item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()
        );
        if (result || result1) {
            if (result) {
                toastifyError('Shift Code Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
            if (result1) {
                toastifyError('Shift Description Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/InsertShift', value)
                .then((res) => {
                    if (res.success === true) {
                        const parsedData = JSON.parse(res.data);
                        const message = parsedData.Table[0].Message;
                        toastifySuccess(message);

                        setErrors({ ...errors, ['ShiftCodeErr']: '' })
                        setStatesChangeStatus(false); setChangesStatus(false)
                        get_Shift(aId); get_CountList(aId); setOpenModal(false); emptyField()
                    } else { toastifyError("Shift can not be saved !!") }
                })
        }
    }

    // Update Shift Function---------
    const shift_Update = (e) => {
        const result = shiftList?.find(item => {
            if (item.ShiftId !== value.ShiftId) {
                if (item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase()) {
                    return item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase()
                } else return item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase()
            }
        });
        const result1 = shiftList?.find(item => {
            if (item.ShiftId !== value.ShiftId) {
                if (item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()) {
                    return item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()
                } else return item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()
            }
        });
        if (result || result1) {
            if (result) {
                toastifyError('Shift Code Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
            if (result1) {
                toastifyError('Shift Description Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/UpdateShift', value)
                .then(res => {
                    if (res.success) {
                        const parsedData = JSON.parse(res.data);
                        const message = parsedData.Table[0].Message;
                        toastifySuccess(message);

                        setErrors({ ...errors, ['ShiftCodeErr']: '' })
                        get_Shift(aId); emptyField()
                        setStatusFalse()
                        setStatesChangeStatus(false); setChangesStatus(false)
                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    const closeModalReset = () => {
        setErrors({ ...errors, 'ShiftCodeErr': '', 'ShiftDescriptionErr': '', 'StarttimeErr': '', 'EndTimeErr': '' })
        emptyField(); setStatesChangeStatus(false);

    }

    // Get Screeen Permission
    const getScreenPermision = (aId, pinID) => {
        ScreenPermision("A020", aId, pinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res); setPermissionForAddShift(res?.[0]?.AddOK); setPermissionForEditShift(res?.[0]?.Changeok);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
            }
            else {
                setEffectiveScreenPermission(); setPermissionForAddShift(false); setPermissionForEditShift(false);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(false)
            }
        }).catch(error => {
            console.error('There was an error!', error);
            setPermissionForAddShift(false);
            setPermissionForEditShift(false);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(false)
        });
    }

    // Get Shift List 
    const get_Shift = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData('MasterPersonnel/GetData_Shift', value)
            .then(res => {
                if (res) setShiftList(res)
                else setShiftList()
            })
    }

    // Edit value Set in hooks
    const set_Edit_Value = (row) => {
        setStatus(true); setShiftEditData(row); setOpenModal(true); setUpdCount(updCount + 1)
        setErrors({});
        closeModalReset()
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Shift Code',
            selector: (row) => row.ShiftCode,
            sortable: true
        },
        {
            name: 'Shift Description',
            selector: (row) => row.ShiftDescription,
            sortable: true
        },
        {
            name: 'Start Time',
            selector: (row) => row.Starttime.substr(0, 5),
            sortable: true
        },
        {
            name: 'End Time',
            selector: (row) => row.EndTime.substr(0, 5),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 50 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={() => setShiftId(row.ShiftId)} data-toggle="modal" data-target="#DeleteModal"
                                    className="btn btn-sm bg-green text-white px-1 py-0"><i className="fa fa-trash"></i></span>
                                : <></>
                            : <span onClick={() => setShiftId(row.ShiftId)} data-toggle="modal" data-target="#DeleteModal"
                                className="btn btn-sm bg-green text-white px-1 py-0"><i className="fa fa-trash"></i></span>
                    }

                </div>
        }
    ]

    const set_Status = () => {
        setStatus(false)
        setOpenModal(true)
        setShiftEditData()
    }

    // Delete Shift Function
    const deleteShift = async (e) => {
        e.preventDefault()
        const value = {
            ShiftId: shiftId,
            DeletedByUserFK: pinID,
        }
        AddDeleteUpadate('MasterPersonnel/DeleteShift', value).then((data) => {
            if (data.success) {

                const parsedData = JSON.parse(data.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Shift(aId); get_CountList(aId); setStatusFalse();
            } else {
                toastifyError("Shift Can't be Deleted !!")
            }
        });
    }

    const setStatusFalse = (e) => {
        setClickedRow(null); setStatus(false); setShiftEditData(); closeModalReset(); setStatesChangeStatus(false);
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    return (
        <>
            <div className="col-12 ">
                <div className="row" >
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Shift Code {errors.ShiftCodeErr !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ShiftCodeErr}</span>
                        ) : null} </label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-3 mt-2 text-field">
                        <input type="text" name='ShiftCode' value={value.ShiftCode}
                            className={'requiredColor'
                            }
                            onChange={handleInput
                            }
                            required maxLength={10} />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Start Time   {errors.StarttimeErr !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.StarttimeErr}</span>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <input type="time" name='Starttime' value={value.Starttime}
                            className={'requiredColor'}

                            onChange={handleInput}
                            required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>End Time  {errors.EndTimeErr !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.EndTimeErr}</span>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <input type="time" name='EndTime' value={value.EndTime}
                            className={'requiredColor'}
                            onChange={handleInput}
                            required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Description {errors.ShiftDescriptionErr !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ShiftDescriptionErr}</span>
                        ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-11 mt-2 text-field">
                        <textarea type="text" name='ShiftDescription' value={value.ShiftDescription}
                            className={'requiredColor'}
                            onChange={handleInput}
                            required cols="30" rows="1" style={{ resize: 'none' }} />
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="btn-box text-right  mr-1">
                    <button type="button" className="btn btn-sm btn-success mr-1 " data-dismiss="modal" onClick={() => { setStatusFalse(); }}>New</button>
                    {
                        status ?
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.Changeok ?
                                    <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                            :
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                    }
                </div>
            </div>
            <div className="col-12 mt-2 ">
                <DataTable
                    dense
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? shiftList : '' : ''}
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    fixedHeaderScrollHeight='270px'
                    highlightOnHover
                    noContextMenu
                    pagination
                    responsive
                    showHeader={true}
                    persistTableHead={true}
                    conditionalRowStyles={conditionalRowStyles}
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => {
                        set_Edit_Value(row); setClickedRow(row);
                    }}
                    fixedHeader
                    subHeaderAlign="right"
                    subHeaderWrap
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>

            <DeletePopUpModal func={deleteShift} />
            <ChangesModal func={check_Validation_Error} />
            {/* <ChangesModal hasPermission={status ? permissionForEditShift : permissionForAddShift} func={check_Validation_Error} /> */}
            <IdentifyFieldColor />


        </>
    )
}

export default Shift