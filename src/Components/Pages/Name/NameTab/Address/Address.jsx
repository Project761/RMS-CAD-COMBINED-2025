import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Decrypt_Id_Name, getShowingMonthDateYear, getShowingWithOutTime, isLockOrRestrictModule, LockFildscolour, tableCustomStyles } from '../../../../Common/Utility';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import Location from '../../../../Location/Location';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import DatePicker from "react-datepicker";
import AddressVerify from './AddressVerify';
import Select from "react-select";
// import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import NameListing from '../../../ShowAllList/NameListing';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';

const Address = (props) => {

    const { ListData, DecNameID, DecMasterNameID, isViewEventDetails = false, isLocked } = props

    const { get_Name_Count, setChangesStatus, GetDataTimeZone, datezone } = useContext(AgencyContext);

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let MstPage = useQuery().get('page');

    //screen permission 
    const [addressData, setAddressData] = useState([]);
    const [status, setStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [nameAddressID, setNameAddressID] = useState('');

    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [masterNameID, setMasterNameID,] = useState('');
    const [nameID, setNameID] = useState();
    const [editval, setEditval] = useState([]);
    const [modalStatus, setModalStatus] = useState(false);
    const [locationStatus, setLocationStatus] = useState(false);
    const [addVerifySingleData, setAddVerifySingleData] = useState([]);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        DateFrom: '', DateTo: '', Address: '', IsVerify: true, IsCurrent: true, AddressFlags: '', NameAddressID: '',
        NameID: '', MasterNameID: '', CreatedByUserFK: '', ModifiedByUserFK: '', DirectionPrefix: '',
        Street: '', DirectionSufix: '', TypeSufix: '', City: '', State: '', ZipCode: '', PremiseNo: '', ApartmentNo: '',
        CommonPlace: '', ApartmentType: '', Street_Parse: '', PremiseNo_Parse: '', DirectionPrefix_Parse: '', TypeSuffix_Parse: '',
        DirectionSuffix_Parse: '', ZipCodeID: '', CityID: '', IsUsLocation: '', CountryID: '', Country: '', point_of_interest: '',
        neighborhood: '', subpremise: '', premise: '',
        'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
    })

    const [errors, setErrors] = useState({ 'AddressError': '', 'DateFromError': '', 'DateToError': '' });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("N053", localStoreData?.AgencyID, localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        setNameID(DecNameID); setMasterNameID(DecMasterNameID);
    }, [DecNameID, DecMasterNameID]);

    useEffect(() => {
        setValue(pre => {
            return {
                ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': masterNameID, 'NameID': nameID, 'IsVerify': true, 'AddressFlags': 'Permanent',
            }
        });
        Get_ContactDetailsData(nameID, masterNameID);
    }, [nameID, masterNameID, updateStatus]);

    const check_Validation_Error = (e) => {
        const AddressErr = RequiredFieldIncident(value.Address);
        const DateFromErr = RequiredFieldIncident(value.DateFrom);
        const DateToErr = value?.IsCurrent == false ? RequiredFieldIncident(value.DateTo) : 'true';
        setErrors(pre => {
            return {
                ...pre,
                ['AddressError']: AddressErr || pre['AddressError'],
                ['DateFromError']: DateFromErr || pre['DateFromError'],
                ['DateToError']: DateToErr || pre['DateToError'],
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { AddressError, DateFromError, DateToError } = errors

    useEffect(() => {
        if (AddressError === 'true' && DateFromError === 'true' && DateToError === 'true') {
            if (nameAddressID && status) {
                update_Addresss()
            } else {
                Add_Address()
            }
        }
    }, [AddressError, DateFromError, DateToError])

    useEffect(() => {
        if (nameAddressID && status) { GetSingleData(nameAddressID) }
    }, [nameAddressID, status]);

    const GetSingleData = (NameAddressID) => {
        const val = { 'NameAddressID': NameAddressID }
        fetchPostData('NameAddress/GetSingleData_NameAddress', val)
            .then((res) => {
                if (res) {
                    setEditval(res);
                }
                else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (editval.length > 0) {
            setValue({
                ...value,
                DateFrom: editval[0]?.DateFrom,
                Address: editval[0]?.Address,
                IsVerify: editval[0]?.IsVerify,
                LocationID: editval[0]?.LocationID,
                IsCurrent: editval[0]?.IsCurrent,
                AddressFlags: editval[0]?.AddressFlags,
                NameAddressID: editval[0]?.NameAddressID,
                ModifiedByUserFK: loginPinID,
                DateTo: editval[0]?.DateTo,
            });
            if (!editval[0]?.IsVerify && parseInt(editval[0]?.LocationID)) {
                get_Add_Single_Data(editval[0]?.LocationID);
            }
        } else {
            setValue({ ...value, DateFrom: '', Address: '', IsCurrent: true, LocationID: '', AddressFlags: 'Permanent', NameAddressID: '', })
        }
    }, [editval])


    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true)
        if (e.target.name === 'IsVerify' || e.target.name === 'IsCurrent') {
            if (e.target.name === 'IsVerify') {
                if (e.target.checked && addVerifySingleData.length > 0) {
                    setModalStatus(false);
                    setLocationStatus(true); setAddVerifySingleData([]);
                    setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
                    !addUpdatePermission && setChangesStatus(true)
                } else {
                    setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
                    setModalStatus(true);
                    setLocationStatus(false);
                    setAddVerifySingleData([]);
                    !addUpdatePermission && setChangesStatus(true)
                }
            } else if (e.target.name === 'IsCurrent') {
                setValue({
                    ...value,
                    [e.target.name]: e.target.checked,
                    ['DateTo']: e.target.checked ? null : getShowingMonthDateYear(new Date()),
                });
                setErrors({ ...errors, 'DateToError': '' });
                !addUpdatePermission && setChangesStatus(true)
            } else {
                setValue({ ...value, [e.target.name]: e.target.checked, })
                !addUpdatePermission && setChangesStatus(true)
            }
        } else {
            setValue({ ...value, [e.target.name]: e.target.value });
            !addUpdatePermission && setChangesStatus(true)
        }
    }

    const reset = () => {
        setStatesChangeStatus(false)
        setValue({ ...value, Address: '', DateFrom: '', DateTo: '', IsVerify: true, IsCurrent: true, AddressFlags: 'Permanent', });
        setErrors({ ...errors, 'AddressError': '', 'DateFromError': '', 'DateToError': '' });
        setNameAddressID('');
        setEditval([]);
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset();
        }
    }, []);


    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const Add_Address = (e) => {
        const result = addressData?.find(item => {
            if (item.Address === value.Address) {
                return item.Address === value.Address
            } else {
                return item.Address === value.Address
            }
        });
        if (result) {
            toastifyError('Address Already Exists')
            setErrors({ ...errors, ['AddressError']: '' })
        } else {
            AddDeleteUpadate('NameAddress/Insert_NameAddress', value).then((res) => {
                if (res.success) {
                    setChangesStatus(false);
                    setLocationStatus(true);
                    setUpdateStatus(updateStatus + 1);
                    get_Name_Count(nameID, masterNameID, MstPage === "MST-Name-Dash" ? true : false); Get_ContactDetailsData(nameID, masterNameID);
                    const parseData = JSON.parse(res.data);
                    toastifySuccess(parseData?.Table[0].Message);
                    reset();
                }
            })
        }
    }

    const update_Addresss = () => {
        AddDeleteUpadate('NameAddress/Update_NameAddress', value).then((res) => {
            setChangesStatus(false); setStatesChangeStatus(false); setLocationStatus(true); setStatus(false);
            Get_ContactDetailsData(nameID, masterNameID);

            reset();
            setUpdateStatus(updateStatus + 1);
            const parseData = JSON.parse(res.data);
            toastifySuccess(parseData?.Table[0].Message);
        })
    }

    const get_Add_Single_Data = (LocationID) => {
        const val = { 'LocationID': LocationID, }
        fetchPostData('MasterLocation/GetSingleData_MasterLocation', val).then((res) => {
            if (res.length > 0) {
                setAddVerifySingleData(res)
            } else {
                setAddVerifySingleData([])
            }
        })
    }

    const startRef = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    }

    const myFunction = () => {
        const checkBox = document.getElementById("IsCurrent");
        const text = document.getElementById("text");
        if (checkBox.checked !== true) {
            text.style.display = "block";
        } else {
            text.style.display = "none";
            setValue({ ...value, DateTo: '' });
        }
    }

    const Get_ContactDetailsData = () => {
        const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
        const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('NameAddress/GetData_NameAddress', MstPage ? val2 : val).then((res) => {
            if (res) {

                setAddressData(res)
            } else {
                setAddressData();
            }
        })
    }

    const columns = [
        {
            width: '300px',
            name: 'Address',
            selector: (row) => row?.Address || '',
            format: (row) => (
                <>{row?.Address ? row?.Address.substring(0, 40) : ''}{row?.Address?.length > 30 ? '  . . .' : null} </>
            ),
            sortable: true
        },

        {
            name: 'Type',
            selector: (row) => row.AddressFlags,
            sortable: true
        },
        {
            name: 'Date From',
            selector: (row) => row.DateFrom ? getShowingWithOutTime(row.DateFrom) : '',
            sortable: true
        },
        {
            name: 'Date To',
            selector: (row) => row.DateTo ? getShowingWithOutTime(row.DateTo) : '',
            sortable: true
        },
        {
            name: 'Is Verify',
            selector: (row) => <input type="checkbox" name="" id="" checked={row.IsVerify} />,
            sortable: true
        },
        {
            name: 'Is Current',
            selector: (row) => <input type="checkbox" name="" id="" checked={row.IsCurrent} />,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", addressData, isLocked, true) ?
                                <span onClick={() => { setNameAddressID(row.NameAddressID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            !isLockOrRestrictModule("Lock", addressData, isLocked, true) &&
                            <span onClick={() => { setNameAddressID(row.NameAddressID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>

        }
    ]

    const set_Edit_Value = (row) => {
        reset();
        setStatus(true);
        setNameAddressID(row?.NameAddressID);
        GetSingleData(row.NameAddressID);
        get_Name_Count(row.NameID, row.MasterNameID, MstPage === "MST-Name-Dash" ? true : false); setUpdateStatus(updateStatus + 1);
    }

    const DeleteContactDetail = () => {
        const val = { 'NameAddressID': nameAddressID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameAddress/Delete_NameAddress', val).then((res) => {
            if (res) {
                const parseData = JSON.parse(res.data);
                toastifySuccess(parseData?.Table[0].Message);
                Get_ContactDetailsData();
                setNameAddressID(''); get_Name_Count(nameID, masterNameID, MstPage === "MST-Name-Dash" ? true : false);
                setUpdateStatus(updateStatus + 1);
                setLocationStatus(true);
                reset();
            } else {
                setNameAddressID('');
            }
            Get_ContactDetailsData();
            get_Name_Count(nameID, masterNameID, MstPage === "MST-Name-Dash" ? true : false);
            setUpdateStatus(updateStatus + 1);
            reset();
        })
    }

    const setStatusFalse = (e) => {
        setStatesChangeStatus(false);
        reset(); setStatus(false); setNameAddressID(''); setUpdateStatus(updateStatus + 1); setLocationStatus(true);
    }

    const conditionalRowStyles = [
        {
            when: row => row.NameAddressID
                === nameAddressID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const AddType = [
        { value: 1, label: 'Permanent' },
        { value: 2, label: 'Temporary' },
        { value: 3, label: 'Frequent' },
        { value: 4, label: 'Old' },
        { value: 5, label: 'Alternate' },
    ]

    return (
        <>
            <NameListing  {...{ ListData }} />
            <div className="col-12 col-md-12 pt-2 p-0" >

                <div className="row align-items-center" style={{ rowGap: "8px" }}>
                    <div className="col-3 col-md-2 col-lg-1">
                        <label htmlFor="" className='new-label mb-0 '>Address{errors.AddressError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.AddressError}</p>
                        ) : null}
                        </label>
                    </div>
                    <div className="col-4 col-md-7 col-lg-6 text-field mt-0" >
                        <Location
                            {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setStatesChangeStatus, setChangesStatus }}
                            col='Address'
                            locationID='LocationID'
                            check={true}
                            verify={value.IsVerify}
                            isDisabled={isLockOrRestrictModule("Lock", editval[0]?.Address, isLocked)}
                        />

                    </div>
                    <div className="col-5 col-md-3 col-lg-2 pl-2">
                        <div className="form-check ">
                            <input className="form-check-input" data-toggle="modal" data-target="#AddressVerifyModal" type="checkbox" name='IsVerify'
                                checked={(value?.IsVerify || !value?.LocationID)}
                                value={value?.IsVerify} onChange={handleChange} id="flexCheckDefault" style={{ cursor: 'pointer' }} />
                            <label className="form-check-label mr-2" htmlFor="flexCheckDefault">
                                Verify
                            </label>
                            {
                                !value?.IsVerify && addVerifySingleData.length > 0 ?
                                    <i className="fa fa-edit " onKeyDown={''} onClick={() => { if (value.LocationID) { if (value.LocationID) { get_Add_Single_Data(value.LocationID); setModalStatus(true); setStatesChangeStatus(true) } } }} data-toggle="modal" data-target="#AddressVerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                    :
                                    <>
                                    </>
                            }
                        </div>
                    </div>
                    <div className="col-1 col-md-1 col-lg-1 ">
                        <label htmlFor="" className='new-label mb-0 '>Type</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2">
                        <Select
                            name='AddressFlags'
                            value={AddType?.filter((obj) => obj.label === value?.AddressFlags)}
                            onChange={(selectedOption) => {
                                setValue({ ...value, ['AddressFlags']: selectedOption ? selectedOption.label : '' });
                                !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                            }}
                            placeholder="Select..."
                            options={AddType}
                            // styles={customStylesWithOutColor}
                            styles={isLockOrRestrictModule("Lock", editval[0]?.AddressFlags, isLocked) ? LockFildscolour : customStylesWithOutColor}
                            isDisabled={isLockOrRestrictModule("Lock", editval[0]?.AddressFlags, isLocked)}
                        />
                    </div>

                    <div className="col-3 col-md-2 col-lg-1">
                        <label htmlFor="" className='new-label mb-0 '>From Date{errors.DateFromError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DateFromError}</p>
                        ) : null}
                        </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2" >
                        <DatePicker
                            id='DateFrom'
                            name='DateFrom'
                            ref={startRef}
                            onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                    e.preventDefault();
                                } else {
                                    onKeyDown(e);
                                }
                            }}
                            onChange={(date) => {
                                setValue({
                                    ...value,
                                    ['DateFrom']: date ? getShowingMonthDateYear(date) : null,
                                    ['DateTo']: null

                                });
                                !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                            }}
                            className={isLockOrRestrictModule("Lock", editval[0]?.DateFrom, isLocked) ? 'LockFildsColor' : 'requiredColor'}
                            disabled={isLockOrRestrictModule("Lock", editval[0]?.DateFrom, isLocked)}
                            // className='requiredColor'
                            dateFormat="MM/dd/yyyy"
                            isClearable={value?.DateFrom ? true : false}
                            selected={value?.DateFrom && new Date(value?.DateFrom)}
                            placeholderText={'Select...'}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            autoComplete='Off'
                            maxDate={new Date(datezone)}

                        />
                    </div>
                    <div className="col-5 col-lg-4 p-0" id="text" style={{ display: value.IsCurrent ? 'none' : 'block' }}>
                        <div className="d-flex align-items-center">
                            <div className="col-3 col-md-2 col-lg-4">
                                <label htmlFor="" className='new-label mb-0'>To Date{errors.DateToError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DateToError}</p>
                                ) : null}</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-8" >
                                <DatePicker
                                    id='DateTo'
                                    name='DateTo'
                                    ref={startRef}

                                    onKeyDown={(e) => {
                                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                            e.preventDefault();
                                        } else {
                                            onKeyDown(e);
                                        }
                                    }}
                                    onChange={(date) => { setValue({ ...value, ['DateTo']: date ? getShowingMonthDateYear(date) : null }); !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true); }}
                                    className={isLockOrRestrictModule("Lock", editval[0]?.DateTo, isLocked) ? 'LockFildsColor' : 'requiredColor'}
                                    disabled={isLockOrRestrictModule("Lock", editval[0]?.DateTo, isLocked)}
                                    dateFormat="MM/dd/yyyy"
                                    isClearable={value?.DateTo ? true : false}

                                    selected={value?.DateTo ? new Date(value.DateTo) : null}
                                    placeholderText={'Select...'}
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    autoComplete='Off'
                                    maxDate={new Date()}

                                    minDate={value?.DateFrom ? new Date(value.DateFrom) : new Date()}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-3 col-md-3 col-lg-1 pl-2">
                        <div className="form-check " style={{ fontSize: '15px' }}>
                            <input className="form-check-input" type="checkbox" name='IsCurrent' checked={value.IsCurrent} value={value.IsCurrent} onChange={handleChange} id="IsCurrent" onClick={myFunction} />
                            <label className="form-check-label" htmlFor="flexCheckDefault1">
                                Current
                            </label>
                        </div>
                    </div>
                </div>
                {
                    !isViewEventDetails &&
                    <div className="btn-box text-right  mr-1 mb-2">
                        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); }}>New</button>

                        {
                            status && nameAddressID ?
                                effectiveScreenPermission ?
                                    effectiveScreenPermission[0]?.Changeok ?
                                        <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                        :
                                        <>
                                        </>
                                    :
                                    <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                :
                                effectiveScreenPermission ?
                                    effectiveScreenPermission[0]?.AddOK ?
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                        :
                                        <>
                                        </>
                                    :
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                        }
                    </div>
                }

                <div className="row ">
                    <div className="col-12 modal-table">
                        <DataTable
                            dense
                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? addressData : [] : addressData}
                            columns={columns}
                            selectableRowsHighlight
                            highlightOnHover
                            customStyles={tableCustomStyles}
                            onRowClicked={(row) => {
                                set_Edit_Value(row);
                            }}
                            fixedHeader
                            persistTableHead={true}
                            fixedHeaderScrollHeight='220px'
                            conditionalRowStyles={conditionalRowStyles}
                            pagination
                            paginationPerPage={'100'}
                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                        />
                    </div>
                </div>
            </div>
            <AddressVerify {...{ loginAgencyID, loginPinID, modalStatus, setModalStatus, value, setValue, addVerifySingleData, setAddVerifySingleData, get_Add_Single_Data }} />
            <DeletePopUpModal func={DeleteContactDetail} />
            {/* <IdentifyFieldColor /> */}
            <ChangesModal hasPermission={status && nameAddressID ? permissionForEdit : permissionForAdd} func={check_Validation_Error} setToReset={setStatusFalse} />

        </>
    )
}

export default Address
