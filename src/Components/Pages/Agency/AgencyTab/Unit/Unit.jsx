import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchPostData, AddDeleteUpadate, ScreenPermision, fieldPermision } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { base64ToString, Decrypt_Id_Name, getShowingWithOutTime, tableCustomStyles } from '../../../../Common/Utility'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { RequiredField } from '../../AgencyValidation/validators';
import Select from "react-select";
import DatePicker from "react-datepicker";
import ChangesModal from '../../../../Common/ChangesModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const Unit = ({ aId }) => {

    const [clickedRow, setClickedRow] = useState(null);
    const { get_CountList, setChangesStatus } = useContext(AgencyContext);
    // Hooks Initialization
    const [unitList, setUnitList] = useState([])
    const [unitEditData, setUnitEditData] = useState([])
    const [status, setStatus] = useState(false)
    const [unitID, setUnitID] = useState();
    const [delUnitId, setDelUnitId] = useState();

    const [openModal, setOpenModal] = useState(false)
    const [updCount, setUpdCount] = useState(0)
    const [pinID, setPinID] = useState('');
    const [associatedShiftList, setAssociatedShiftList] = useState([])
    const [divisionList, setDivisionList] = useState([])
    const [serviceDate, setServiceDate] = useState()
    const [permissionForAddUnit, setPermissionForAddUnit] = useState(false);
    const [permissionForEditUnit, setPermissionForEditUnit] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");

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
            dispatch(get_ScreenPermissions_Data("A005", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, 0))
        }
    }, [localStoreData]);

    useEffect(() => {
        if (aId) {
            get_Unit_List(aId); get_AssociatedShift(aId); get_Division(aId);
        }
    }, [aId]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAddUnit(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEditUnit(effectiveScreenPermission[0]?.Changeok);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    const [value, setValue] = useState({
        "UnitCode": "", "AgencyID": aId, "DivisionId": "", "UnitName": "", "ServiceDate": "",
        "AssociatedShiftID": false, "AllowMobileLogin": "", "CreatedByUserFK": pinID,
        "ModifiedByUserFK": "", "UnitId": "", "AssociatedShiftName": '', 'DivisionName': ''
    });

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        // Unit Field
        "UnitCode": "", "DivisionId": "", "UnitName": "", "ServiceDate": "", "AssociatedShiftID": "",
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'UnitCodeError': '', 'UnitNameError': '', 'DivisionIdError': ''
    })

    const get_AssociatedShift = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('MasterPersonnel/GetData_Shift', value).then(res => {
            if (res) { setAssociatedShiftList(changeArrayFormat(res, 'shift')) }
            else { setAssociatedShiftList() }
        })
    }

    const get_Division = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('Division/GetData_Division', value).then(res => {
            if (res) {
                setDivisionList(changeArrayFormat(res, 'division'))
            } else {
                setDivisionList([]);
            }
        })
    }

    useEffect(() => {
        if (unitEditData?.UnitId) {
            setServiceDate(getShowingWithOutTime(unitEditData?.ServiceDate) === '01/01/1900' ? null : getShowingWithOutTime(unitEditData?.ServiceDate) === 'Invalid date' ? '' : new Date(unitEditData?.ServiceDate))
            setValue({
                ...value,
                'AgencyID': unitEditData?.AgencyID, "UnitCode": unitEditData?.UnitCode, "DivisionId": unitEditData?.DivisionId, "UnitName": unitEditData?.UnitName,
                "ServiceDate": getShowingWithOutTime(unitEditData?.ServiceDate) === '01/01/1900' ? null : getShowingWithOutTime(unitEditData?.ServiceDate) === 'Invalid date' ? '' : getShowingWithOutTime(unitEditData?.ServiceDate),
                "AssociatedShiftID": unitEditData?.AssociatedShiftID, "AllowMobileLogin": unitEditData?.AllowMobileLogin,
                "UnitId": unitEditData?.UnitId, "AssociatedShiftName": unitEditData?.AssociatedShiftID != null ? changeArrayFormat_WithFilter([unitEditData], 'shift') : '',
                'DivisionName': unitEditData?.DivisionId != null ? changeArrayFormat_WithFilter([unitEditData], 'division', divisionList) : '',
                "ModifiedByUserFK": pinID,
            });
        } else {
            setValue({
                ...value,
                "UnitCode": '', "DivisionId": '', "UnitName": '', "ServiceDate": '', "AssociatedShiftID": '', "ModifiedByUserFK": '', "UnitId": '', 'AllowMobileLogin': false, "DivisionName": '', 'AssociatedShiftName': ''
            });
        }
    }, [unitEditData, updCount])

    // Get Effective Field Permission
    const get_Field_Permision_Unit = (aId, pinID) => {
        fieldPermision(aId, 'A005', pinID).then(res => {
            if (res) {
                const agencyUnitCodeFilter = Agency_Field_Permistion_Filter(res, "Agency-UnitCode");
                const agencyDivisionFilter = Agency_Field_Permistion_Filter(res, "Agency-Division");
                const agencyUnitNameFilter = Agency_Field_Permistion_Filter(res, "Agency-UnitName");
                const agencyServiceDateFilter = Agency_Field_Permistion_Filter(res, "Agency-ServiceDate");
                const agencyAssociatedShiftFilter = Agency_Field_Permistion_Filter(res, "Agency-AssociatedShift");
                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['UnitCode']: agencyUnitCodeFilter || prevValues['UnitCode'],
                        ['DivisionId']: agencyDivisionFilter || prevValues['DivisionId'],
                        ['UnitName']: agencyUnitNameFilter || prevValues['UnitName'],
                        ['ServiceDate']: agencyServiceDateFilter || prevValues['ServiceDate'],
                        ['AssociatedShiftID']: agencyAssociatedShiftFilter || prevValues['AssociatedShiftID'],
                    }
                });
            }
        });
    }

    // onChange Hooks Function
    const handleInput = (e) => {
        !addUpdatePermission && setChangesStatus(true)
        if (e.target.name === 'AllowMobileLogin') {
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
    };

    const dateChange = (date) => {
        !addUpdatePermission && setChangesStatus(true);
        setServiceDate(date);
        setValue({ ...value, ['ServiceDate']: date });
    }

    // Set value 
    const divisionChanges = (e) => {
        !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, ['DivisionId']: e.value });
        } else {
            setValue({ ...value, ['DivisionId']: null });
        }
    }

    const AssociatedShiftChanges = (e) => {
        !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, ['AssociatedShiftID']: e.value })
        } else {
            setValue({ ...value, ['AssociatedShiftID']: null })
        }
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.UnitCode)) {
            setErrors(prevValues => { return { ...prevValues, ['UnitCodeError']: RequiredField(value.UnitCode) } })
        }
        if (RequiredField(value.UnitName)) {
            setErrors(prevValues => { return { ...prevValues, ['UnitNameError']: RequiredField(value.UnitName) } })
        }
        if (RequiredField(value.DivisionId)) {
            setErrors(prevValues => { return { ...prevValues, ['DivisionIdError']: RequiredField(value.DivisionId) } })
        }
    }

    const reset_Value = () => {
        setValue({
            ...value,
            "UnitCode": '', "DivisionId": '', "UnitName": '', "ServiceDate": '', "AssociatedShiftID": '', "AllowMobileLogin": '', "ModifiedByUserFK": '', 'AssociatedShiftName': '', 'DivisionName': ''
        });
        setServiceDate()
    }

    const closeModalReset = () => {
        setErrors({ ...errors, 'UnitCodeError': '', 'UnitNameError': '', 'DivisionIdError': '' });
        reset_Value()
    }

    // Check All Field Format is True Then Submit 
    const { UnitCodeError, UnitNameError, DivisionIdError } = errors

    useEffect(() => {
        if (UnitCodeError === 'true' && UnitNameError === 'true' && DivisionIdError === 'true') {
            if (status) unit_Update()
            else unit_Add()
        }
    }, [UnitCodeError, UnitNameError, DivisionIdError])

    // New Unit Create
    const unit_Add = async () => {
        const result = unitList?.find(item => item.UnitCode === value.UnitCode);
        const result1 = unitList?.find(item => item.UnitName === value.UnitName);
        if (result || result1) {
            if (result) {
                toastifyError('Unit Code Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
            if (result1) {
                toastifyError('Unit Name Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
        } else {
            const {
                UnitCode, AgencyID, DivisionId, UnitName, ServiceDate,
                AssociatedShiftID, AllowMobileLogin, CreatedByUserFK,
                ModifiedByUserFK, UnitId, AssociatedShiftName, DivisionName
            } = value
            const val = {
                "UnitCode": UnitCode, "AgencyID": aId, "DivisionId": DivisionId, "UnitName": UnitName, "ServiceDate": ServiceDate,
                "AssociatedShiftID": AssociatedShiftID, "AllowMobileLogin": AllowMobileLogin, "CreatedByUserFK": pinID,
                "ModifiedByUserFK": ModifiedByUserFK, "UnitId": UnitId, "AssociatedShiftName": AssociatedShiftName, 'DivisionName': DivisionName,
            }
            AddDeleteUpadate('Unit/UnitInsert', val).then((res) => {
                if (res.success === true) {
                    toastifySuccess(res.data);
                    setErrors({ ...errors, ['UnitCodeError']: '' });
                    get_Unit_List(aId);
                    get_CountList(aId);
                    setOpenModal(false);
                    reset_Value();
                }
            })
        }
    }

    // Unit Values Update
    const unit_Update = async () => {
        const result = unitList?.find(item => {
            if (item.UnitId != value.UnitId) {
                if (item.UnitCode === value.UnitCode) {
                    return item.UnitCode === value.UnitCode
                } else return item.UnitCode === value.UnitCode
            }
            return false
        });
        const result1 = unitList?.find(item => {
            if (item.UnitId != value.UnitId) {
                if (item.UnitName === value.UnitName) {
                    return item.UnitName === value.UnitName
                } else return item.UnitName === value.UnitName
            }
            return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Unit Code Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
            if (result1) {
                toastifyError('Unit Name Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
        } else {
            const {
                UnitCode, AgencyID, DivisionId, UnitName, ServiceDate,
                AssociatedShiftID, AllowMobileLogin, CreatedByUserFK,
                ModifiedByUserFK, UnitId, AssociatedShiftName, DivisionName
            } = value
            const val = {
                "UnitCode": UnitCode, "AgencyID": aId, "DivisionId": DivisionId, "UnitName": UnitName, "ServiceDate": ServiceDate,
                "AssociatedShiftID": AssociatedShiftID, "AllowMobileLogin": AllowMobileLogin, "CreatedByUserFK": pinID,
                "ModifiedByUserFK": ModifiedByUserFK, "UnitId": UnitId, "AssociatedShiftName": AssociatedShiftName, 'DivisionName': DivisionName,
            }
            AddDeleteUpadate('Unit/UnitUpdate', val).then((res) => {
                if (res.success === true) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    reset_Value();
                    setErrors({ ...errors, ['UnitCodeError']: '' });
                    get_Unit_List(aId);
                    setOpenModal(false);
                    setStatusFalse();
                }
            })
        }
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

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

    // tab date change
    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    }



    const get_Unit_List = (aId) => {
        const value = { AgencyID: aId }
        fetchPostData('Unit/UnitGetData', value).then((res) => {
            if (res) {
                setUnitList(res)
            } else {
                setUnitList([]);
            }
        })
    }

    // Table Columns Array
    const columns = [

        {
            name: 'Unit Name',
            selector: (row) => row.UnitName,
            sortable: true
        },
        {
            name: 'Unit Code',
            selector: (row) => row.UnitCode,
            sortable: true
        },
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
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 53 }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={(e) => setDelUnitId(row.UnitId)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <></>
                    }
                </div>
        }
    ]

    // Delete unit
    const delete_Unit = async (e, id) => {
        e.preventDefault()
        const value = { UnitId: delUnitId, DeletedByUserFK: pinID }
        AddDeleteUpadate('Unit/UnitDelete', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Unit_List(aId)
                get_CountList(aId)
            } else {
                toastifyError(data.Message)
            }
        });
    }

    const set_Edit_Value = (row) => {

        setStatus(true); setUnitID(row.UnitId); setUnitEditData(row); setOpenModal(true); setUpdCount(updCount + 1)
    }

    const setStatusFalse = (e) => {
        setClickedRow(null); setStatus(false); setUnitEditData(); reset_Value(); setUnitID('');
    }

    const conditionalRowStyles = [
        {
            when: row => row?.UnitId === unitID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const set_Status = () => {
        setOpenModal(true); setStatus(false); setUnitEditData()
    }

    return (
        <>
            <div className="col-12">
                <div className="row pt-1 ">
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Unit Code {errors.UnitCodeError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UnitCodeError}</span>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <input
                            type="text"
                            value={value.UnitCode}
                            className={'requiredColor'}
                            onChange={handleInput}
                            name='UnitCode'
                            maxLength={10}
                            required
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>
                            Unit Name
                            {errors.UnitNameError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UnitNameError}</span>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
                        <input type="text"
                            className={'requiredColor'}
                            onChange={handleInput}
                            value={value.UnitName}
                            name='UnitName' required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>
                            Division
                            {errors.DivisionIdError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DivisionIdError}</span>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-3 mt-2 ">
                        <Select
                            styles={colourStyles}
                            value={divisionList?.filter((obj) => obj.value === value?.DivisionId)}
                            className="basic-single"
                            classNamePrefix="select"
                            options={divisionList}
                            isClearable
                            onChange={divisionChanges}
                            isDisabled={false}
                            name='DivisionId'
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Associated&nbsp;Shift</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 ">
                        <Select
                            styles={customStylesWithOutColor}
                            value={associatedShiftList?.filter((obj) => obj.value === value?.AssociatedShiftID)}
                            className="basic-single"
                            classNamePrefix="select"
                            name='AssociatedShiftID'
                            options={associatedShiftList}
                            isClearable
                            onChange={AssociatedShiftChanges}
                            isDisabled={false}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Service Date</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3">
                        <DatePicker
                            ref={startRef}
                            onKeyDown={onKeyDown}
                            autoComplete='Off'
                            dateFormat="MM/dd/yyyy"
                            timeInputLabel
                            name='ServiceDate'
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            isClearable={true}
                            onChange={date => dateChange(date)}
                            disabled={false}
                            selected={serviceDate}
                            placeholderText={'Select ..'}
                        />
                    </div>
                </div>
                <div className="col-12">
                    <div className="btn-box text-right mt-1 mr-1">
                        <button type="button" className="btn btn-sm btn-success mr-1 " data-dismiss="modal" onClick={() => { setStatusFalse(); }}>New</button>
                        {
                            status ?
                                permissionForEditUnit && <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                :
                                permissionForAddUnit && <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                        }
                    </div>
                </div>
                <div className="col-12 mt-1">
                    <DataTable
                        columns={columns}
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? unitList : '' : ''}
                        dense
                        paginationRowsPerPageOptions={[10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        showHeader={true}
                        persistTableHead={true}
                        conditionalRowStyles={conditionalRowStyles}
                        customStyles={tableCustomStyles}
                        onRowClicked={(row) => {
                            set_Edit_Value(row);
                        }}
                        fixedHeader
                        subHeaderAlign="right"
                        subHeaderWrap
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>

            <DeletePopUpModal func={delete_Unit} />
            <ChangesModal func={check_Validation_Error} />
         
            <IdentifyFieldColor />
        </>
    )
}

export default Unit

export const changeArrayFormat = (data, type) => {
    if (type === 'shift') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        data = result.filter(function (element) {
            return element !== "";
        });
        return result
    }
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.DivisionID, label: sponsor.DivisionCode })
        )
        data = result.filter(function (element) {
            return element !== "";
        });
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, dropDownData) => {
    if (type === 'shift') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )

        return result[0]
    }
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            (sponsor.DivisionId)
        )
        const result2 = dropDownData?.map((sponsor) => {
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
}