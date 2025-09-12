import React, { useCallback, useContext, useEffect, useState } from 'react'
import Location from '../../../Location/Location';
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles } from '../../../Common/Utility';
import { RequiredFieldIncident } from '../../Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useSelector } from 'react-redux';
import { toastifySuccess } from '../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../Common/DeleteModal';
import AddressVerify from '../../Name/NameTab/Address/AddressVerify';
import IdentifyFieldColor from '../../../Common/IdentifyFieldColor';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import NameListing from '../../ShowAllList/NameListing';
import MasterChangesModal from '../MasterChangeModel';

const MasterAddress = (props) => {

    const { possessionID, mstPossessionID, complainNameID, type, ownerOfID } = props;
    const { get_Name_Count, localStoreArray, get_LocalStorage, setChangesStatus, get_MasterName_Count } = useContext(AgencyContext);

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [masterNameID, setMasterNameID,] = useState('');
    const [status, setStatus] = useState(false);
    const [locationStatus, setLocationStatus] = useState(false);
    const [deletemodel, setdeletemodel] = useState(false)
    const [nameAddressID, setNameAddressID] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0);
    const [modalStatus, setModalStatus] = useState(false);
    const [modal, setModal] = useState(false);
    const [addVerifySingleData, setAddVerifySingleData] = useState([]);
    const [loginPinID, setLoginPinID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [addressData, setAddressData] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);
    const [editval, setEditval] = useState([]);
    const [onSelectLocation, setOnSelectLocation] = useState(true);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [value, setValue] = useState({
        DateFrom: '', DateTo: '', Address: '', IsVerify: true, IsCurrent: true, AddressFlags: '', NameAddressID: '',
        NameID: '', MasterNameID: '', CreatedByUserFK: '', ModifiedByUserFK: '', DirectionPrefix: '',
        Street: '', DirectionSufix: '', TypeSufix: '', City: '', State: '', ZipCode: '', PremiseNo: '', ApartmentNo: '',
        CommonPlace: '', ApartmentType: '', Street_Parse: '', PremiseNo_Parse: '', DirectionPrefix_Parse: '', TypeSuffix_Parse: '',
        DirectionSuffix_Parse: '', ZipCodeID: '', CityID: '', IsUsLocation: '', CountryID: '', Country: '', point_of_interest: '',
        neighborhood: '', subpremise: '', premise: '',
    })

    const [errors, setErrors] = useState({
        'AddressError': '', 'DateFromError': '', 'DateToError': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);


    // custuom style withoutColor
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

    const startRef = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    }

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        setMasterNameID(mstPossessionID); get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
    }, [mstPossessionID])

    useEffect(() => {
        setValue(pre => {
            return {
                ...pre,
                'CreatedByUserFK': loginPinID, 'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'IsVerify': true, 'AddressFlags': 'Permanent', 'AgencyID': loginAgencyID
            }
        });
        Get_ContactDetailsData();
    }, [possessionID, mstPossessionID, ownerOfID, updateStatus]);

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

    const { AddressError, DateFromError, DateToError } = errors

    useEffect(() => {
        if (AddressError === 'true' && DateFromError === 'true' && DateToError === 'true') {
            if (nameAddressID) { update_Addresss() }
            else { Add_Address() }
        }
    }, [AddressError, DateFromError, DateToError])

    useEffect(() => {
        if (nameAddressID && status) { GetSingleData(nameAddressID) }
    }, [nameAddressID, status]);

    useEffect(() => {
        if (editval?.length) {
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
        setStatesChangeStatus(true);
        setChangesStatus(true)
        if (e.target.name === 'IsVerify' || e.target.name === 'IsCurrent') {
            if (e.target.name === 'IsVerify') {
                if (e.target.checked && addVerifySingleData.length > 0) {
                    setModalStatus(false);
                    setLocationStatus(true); setAddVerifySingleData([]);
                    setValue(pre => { return { ...pre, ['Address']: '', [e.target.name]: e.target.checked, } });
                } else {
                    setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
                    setModalStatus(true);
                    setLocationStatus(false);
                    setAddVerifySingleData([]);
                }
            } else if (e.target.name === 'IsCurrent') {
                setValue({
                    ...value,
                    [e.target.name]: e.target.checked,
                    ['DateTo']: e.target.checked ? null : getShowingMonthDateYear(new Date()),

                });
            } else {
                setValue({ ...value, [e.target.name]: e.target.checked, })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const reset = () => {
        setValue({ ...value, Address: '', DateFrom: '', DateTo: '', IsVerify: true, IsCurrent: true, AddressFlags: 'Permanent', });
        setErrors({ ...errors, 'AddressError': '', 'DateFromError': '', 'DateToError': '', });
        setNameAddressID('');
        setModalStatus(false);
        setStatesChangeStatus(false);
        setChangesStatus(false)
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset();
            setModal(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const AddType = [
        { value: 1, label: 'Permanent' },
        { value: 2, label: 'Temporary' },
        { value: 3, label: 'Frequent' },
        { value: 4, label: 'Old' },
        { value: 5, label: 'Alternate' },
    ]

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
        const val = {
            'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID,

        }
        fetchPostData('NameAddress/GetData_NameAddress', val).then((res) => {
            if (res) {
                setAddressData(res)
            } else {
                setAddressData();
            }
        })
    }

    // <<<<<<<<<<<<<<<<<<<<<<<-------Add-Del-Update------------->>>>>>>>>>>>

    const Add_Address = (e) => {
        const { DateFrom, DateTo, Address, IsVerify, IsCurrent, AddressFlags, NameAddressID, DirectionPrefix, Street, DirectionSufix, TypeSufix, City, State, ZipCode, PremiseNo, ApartmentNo, CommonPlace, ApartmentType, Street_Parse, PremiseNo_Parse, DirectionPrefix_Parse, TypeSuffix_Parse,
            DirectionSuffix_Parse, ZipCodeID, CityID, IsUsLocation, CountryID, Country, point_of_interest, neighborhood, subpremise, premise } = value
        const val = {
            MasterNameID: mstPossessionID, NameID: type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, CreatedByUserFK: loginPinID,
            DateFrom: DateFrom, DateTo: DateTo, Address: Address, IsVerify: IsVerify, IsCurrent: IsCurrent, AddressFlags: AddressFlags, NameAddressID: NameAddressID, DirectionPrefix: DirectionPrefix, Street: Street, DirectionSufix: DirectionSufix, TypeSufix: TypeSufix, City: City, State: State, ZipCode: ZipCode, PremiseNo: PremiseNo, ApartmentNo: ApartmentNo, CommonPlace: CommonPlace, ApartmentType: ApartmentType, Street_Parse: Street_Parse, PremiseNo_Parse: PremiseNo_Parse, DirectionPrefix_Parse: DirectionPrefix_Parse, TypeSuffix_Parse: TypeSuffix_Parse, DirectionSuffix_Parse: DirectionSuffix_Parse, ZipCodeID: ZipCodeID, CityID: CityID, IsUsLocation: IsUsLocation, CountryID: CountryID, Country: Country, point_of_interest: point_of_interest, neighborhood: neighborhood, subpremise: subpremise, premise: premise,
        }
        AddDeleteUpadate('NameAddress/Insert_NameAddress', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                setLocationStatus(true);
                setUpdateStatus(updateStatus + 1);
                get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID); Get_ContactDetailsData(); setModal(false);
                toastifySuccess(message); reset();
                setStatesChangeStatus(false);
                setChangesStatus(false)
            }
        })
    }

    const update_Addresss = () => {
        AddDeleteUpadate('NameAddress/Update_NameAddress', value).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            Get_ContactDetailsData();
            setModal(false);
            reset();
            setStatus(false);
            setUpdateStatus(updateStatus + 1);
            toastifySuccess(message);
            setStatesChangeStatus(false);
            setChangesStatus(false)

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

    const columns = [
        {
            width: '300px',
            name: 'Address',
            selector: (row) => <>{row?.Address ? row?.Address.substring(0, 70) : ''}{row?.Address?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Address Type',
            selector: (row) => row.AddressFlags,
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
            name: 'Date From',
            selector: (row) => row.DateFrom ? getShowingWithOutTime(row.DateFrom) : '',
            sortable: true
        },
        {
            name: 'To Date',
            selector: (row) => row.DateTo ? getShowingWithOutTime(row.DateTo) : '',
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>

                    <span onClick={(e) => { setNameAddressID(row.NameAddressID); setdeletemodel(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" >
                        <i className="fa fa-trash"></i>
                    </span>

                </div>

        }
    ]

    const set_Edit_Value = (row) => {
        reset();
        setModal(true); setStatus(true);
        GetSingleData(row.NameAddressID);

        get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
        setUpdateStatus(updateStatus + 1); setNameAddressID(row.NameAddressID);
    }

    const DeleteContactDetail = () => {
        const val = { 'NameAddressID': nameAddressID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameAddress/Delete_NameAddress', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                Get_ContactDetailsData();
                setNameAddressID(''); get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
                setUpdateStatus(updateStatus + 1);
                reset();
                setdeletemodel(false);
                setLocationStatus(true);
            } else {
                setNameAddressID('');
            }
            Get_ContactDetailsData();
            get_MasterName_Count(type === "ComplainantName" ? complainNameID : possessionID || ownerOfID);
            setUpdateStatus(updateStatus + 1);
            reset();
        })
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

    const setStatusFalse = (e) => {
        setClickedRow(null); reset(); setStatus(false); setNameAddressID(''); setUpdateStatus(updateStatus + 1); setLocationStatus(true); setStatesChangeStatus(false);
    }

    return (
        <div>
            <div className="col-12 col-md-12 pt-2 p-0" >

                <div className="row">
                    <div className="col-3 col-md-2 col-lg-1 mt-3">
                        <label htmlFor="" className='label-name '>Address{errors.AddressError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AddressError}</p>
                        ) : null}
                        </label>
                    </div>
                    <div className="col-4 col-md-7 col-lg-6 text-field mt-2" >
                        <Location
                            {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setChangesStatus, setStatesChangeStatus }}
                            col='Address'
                            locationID='LocationID'
                            check={true}
                            verify={value.IsVerify}
                        />
                    </div>
                    <div className="col-5 col-md-3 col-lg-2 mt-3 pl-2">
                        <div className="form-check ">
                            <input className="form-check-input" data-toggle="modal" data-target="#AddressVerifyModal" type="checkbox" name='IsVerify'
                                checked={(value?.IsVerify || !value?.LocationID)}
                                value={value?.IsVerify} onChange={handleChange} id="flexCheckDefault" style={{ cursor: 'pointer' }} />
                            <label className="form-check-label mr-2" htmlFor="flexCheckDefault">
                                Verify
                            </label>
                            {
                                !value?.IsVerify && addVerifySingleData.length > 0 ?
                                    <i className="fa fa-edit " onKeyDown={''} onClick={() => { if (value.LocationID) { if (value.LocationID) { get_Add_Single_Data(value.LocationID); setModalStatus(true); } } }} data-toggle="modal" data-target="#AddressVerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                    :
                                    <>
                                    </>
                            }
                        </div>
                    </div>
                    <div className="col-1 col-md-1 col-lg-1 mt-3">
                        <label htmlFor="" className='label-name '>Type</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-2">
                        <Select
                            name='AddressFlags'
                            value={AddType?.filter((obj) => obj.label === value?.AddressFlags)}
                            onChange={(selectedOption) => {
                                setValue({ ...value, ['AddressFlags']: selectedOption ? selectedOption.label : '' });
                                setChangesStatus(true)
                                setStatesChangeStatus(true);
                            }}

                            placeholder="Select..."
                            options={AddType}
                            styles={customStylesWithOutColor}
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  pt-2 mt-md-2 pl-4">
                        <div className="form-check ">
                            <input className="form-check-input" type="checkbox" name='IsCurrent' checked={value.IsCurrent} value={value.IsCurrent}
                                onChange={handleChange}
                                id="IsCurrent" onClick={myFunction} />
                            <label className="form-check-label" htmlFor="flexCheckDefault1">
                                Current
                            </label>
                        </div>
                    </div>
                    <div className="col-3 col-md-2 col-lg-1 mt-3">
                        <label htmlFor="" className='label-name '>Date From{errors.DateFromError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateFromError}</p>
                        ) : null}
                        </label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-1" >
                        <DatePicker
                            id='DateFrom'
                            name='DateFrom'
                            ref={startRef}
                            onKeyDown={onKeyDown}
                            onChange={(date) => {
                                setStatesChangeStatus(true);
                                setValue({
                                    ...value,
                                    ['DateFrom']: date ? getShowingMonthDateYear(date) : null,
                                    ['DateTo']: null
                                })
                                setChangesStatus(true)
                            }}
                            className='requiredColor'
                            dateFormat="MM/dd/yyyy"
                            isClearable={value?.DateFrom ? true : false}
                            selected={value?.DateFrom && new Date(value?.DateFrom)}
                            placeholderText={'Select...'}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            autoComplete='Off'
                            maxDate={new Date()}
                        />
                    </div>
                    <div className="col-5 col-lg-4 " id="text" style={{ display: value.IsCurrent ? 'none' : 'block' }}>
                        <div className="d-flex">
                            <div className="col-3 col-md-2 col-lg-2 mt-3">
                                <label htmlFor="" className='label-name '>Date To{errors.DateToError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateToError}</p>
                                ) : null}</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-7  mt-1" >
                                <DatePicker
                                    id='DateTo'
                                    name='DateTo'
                                    ref={startRef}
                                    onKeyDown={onKeyDown}
                                    onChange={(date) => {
                                        setStatesChangeStatus(true);
                                        setValue({ ...value, ['DateTo']: date ? getShowingMonthDateYear(date) : null })
                                        setChangesStatus(true)
                                    }}

                                    className='requiredColor'
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
                </div>
                {
                    deletemodel &&
                    <div className="modal" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s', display: "block" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={() => { DeleteContactDetail(); reset(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                        <button type="button" onClick={() => { (setdeletemodel(false)); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <div className="btn-box text-right  mr-1 mb-2">
                    <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); conditionalRowStyles(''); }}>New</button>
                    {
                        status && nameAddressID ?
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }}>Update</button>
                            :
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
                    }
                </div>
                <div className="row ">
                    <div className="col-12 ">
                        <DataTable
                            dense
                            data={addressData}
                            columns={columns}
                            selectableRowsHighlight
                            highlightOnHover
                            customStyles={tableCustomStyles}
                            onRowClicked={(row) => {
                                setClickedRow(row);
                                set_Edit_Value(row);
                            }}
                            fixedHeader
                            persistTableHead={true}
                            fixedHeaderScrollHeight='150px'
                            paginationPerPage={'10'}
                            paginationRowsPerPageOptions={[10, 15, 20, 50]}
                            conditionalRowStyles={conditionalRowStyles}
                            pagination
                            noDataComponent={"There are no data to display"}
                        />
                    </div>
                </div>
            </div>
            <AddressVerify {...{ loginAgencyID, loginPinID, modalStatus, setModalStatus, value, setValue, addVerifySingleData, setAddVerifySingleData, get_Add_Single_Data }} />
            <IdentifyFieldColor />
            <MasterChangesModal func={check_Validation_Error} />
        </div>
    )
}

export default MasterAddress