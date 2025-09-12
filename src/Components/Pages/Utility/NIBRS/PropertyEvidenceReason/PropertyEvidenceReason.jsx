import React, { useState, useEffect, useCallback } from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData, fetch_Post_Data } from '../../../../hooks/Api';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { Filter } from '../../../../Filter/Filter';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import SelectBox from '../../../../Common/SelectBox';
import { Space_Not_Allow } from '../../Personnel/Validation';
import Select from "react-select";

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

const PropertyEvidenceReason = () => {

    const [agencyData, setAgencyData] = useState([])
    const [editval, setEditval] = useState();
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [dataList, setDataList] = useState();
    const [filterDataList, setFilterDataList] = useState([]);
    const [status, setStatus] = useState(false);
    const [pageStatus, setPageStatus] = useState("1")
    const [modal, setModal] = useState(false)
    // FilterData 
    const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
    const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
    const [updateStatus, setUpdateStatus] = useState(0)
    //filter SearchVal
    const [clickedRow, setClickedRow] = useState(null);

    const [searchValue1, setSearchValue1] = useState('')
    const [searchValue2, setSearchValue2] = useState('')

    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [isSuperadmin, setIsSuperadmin] = useState(0);
    const [isActive, setIsActive] = useState('')
    const [singleTypeId, setSingleTypeId] = useState('')
    const [confirmType, setConfirmType] = useState('')

    const [value, setValue] = useState({
        'Description': '', 'AgencyCode': '', 'AgencyID': '', 'Agency_Name': '', 'MultiAgency_Name': '', 'EvidenceReasonCode': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1', 'IsEditable': 1, 'EvidenceReasonID': '',
        'EvidenceReasonType': '',
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); setIsSuperadmin(localStoreData?.IsSuperadmin);
            setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID });
            get_Data_List(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData, pageStatus]);

    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })

    const [errors, setErrors] = useState({
        'CodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        getAgency(loginAgencyID, loginPinID);
        if (agencyData?.length === 0 && modal) {
            if (loginPinID && loginAgencyID) {
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
        const val = { 'EvidenceReasonID': singleTypeId }
        fetchPostData('PropertyEvidenceReason/GetSingleData_PropertyEvidenceReason', val)
            .then((res) => {
                if (res) { setEditval(res); }
                else setEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "EvidenceReasonID": editval[0]?.EvidenceReasonID,
                'MultiAgency_Name': editval[0]?.MultiAgency_Name,
                "EvidenceReasonCode": editval[0]?.EvidenceReasonCode, 'IsActive': editval[0]?.IsActive,
                "Description": editval[0]?.Description, "ORINumber": editval[0]?.ORINumber,
                "AgencyName": editval[0]?.AgencyName,
                'AgencyCode': editval[0]?.AgencyCode, 'EvidenceReasonType': editval[0]?.EvidenceReasonType,
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
                'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '', 'EvidenceReasonID': '', 'EvidenceReasonCode': '',
                'CreatedByUserFK': '', 'EvidenceReasonType': '',
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
            'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '', 'EvidenceReasonID': '', 'EvidenceReasonCode': '', 'AgencyName': '',
            'ModifiedByUserFK': '', 'IsActive': '1', 'IsEditable': 0, 'Agency_Name': '', 'EvidenceReasonType': '',
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

    const Add_Type = () => {
        const result = dataList?.find(item => {
            if (item.EvidenceReasonCode === value.EvidenceReasonCode) {
                return item.EvidenceReasonCode === value.EvidenceReasonCode
            } else return item.EvidenceReasonCode === value.EvidenceReasonCode
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
            AddDeleteUpadate('PropertyEvidenceReason/InsertPropertyEvidenceReason', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CodeError']: '' })
                setModal(false)
                get_Data_List(loginAgencyID, loginPinID, isSuperadmin);
                reset();
            })
        }
    }

    const update_Type = () => {
        const result = dataList?.find(item => {
            if (item.EvidenceReasonID != singleTypeId) {
                if (item.EvidenceReasonCode === value.EvidenceReasonCode) {
                    return item.EvidenceReasonCode === value.EvidenceReasonCode
                } else return item.EvidenceReasonCode === value.EvidenceReasonCode
            }
        });
        const result1 = dataList?.find(item => {
            if (item.EvidenceReasonID != singleTypeId) {
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
            AddDeleteUpadate('PropertyEvidenceReason/UpdatePropertyEvidenceReason', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_Data_List(loginAgencyID, loginPinID, isSuperadmin);
                setModal(false); setStatus(true);
                reset(); setStatusFalse()
            })
        }
    }

    const check_Validation_Error = () => {
        if (Space_Not_Allow(value.EvidenceReasonCode)) {
            setErrors(prevValues => { return { ...prevValues, ['CodeError']: Space_Not_Allow(value.EvidenceReasonCode) } })
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

    const get_Data_List = (AgencyID, PINID, IsSuperadmin) => {
        const val = {
            IsActive: pageStatus,
            AgencyID: AgencyID,
            IsSuperadmin: IsSuperadmin,
            PINID: PINID,
        }
        fetch_Post_Data('PropertyEvidenceReason/GetData_PropertyEvidenceReason', val).then((res) => {
            if (res) {
                setDataList(res?.Data)
                setFilterDataList(res?.Data);
                setEffectiveScreenPermission(res?.Permision)
            }
            else { setDataList(); setFilterDataList([]); setEffectiveScreenPermission() }
        })
    }

    const UpdActiveDeactive = () => {
        const value = {
            'IsActive': isActive,
            'EvidenceReasonID': singleTypeId,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('PropertyEvidenceReason/DeletePropertyEvidenceReason', value)
            .then(res => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_Data_List(loginAgencyID, loginPinID, isSuperadmin); setModal(false);
                    setStatusFalse(); setSearchValue1(''); setSearchValue2('');
                } else {
                    toastifyError(res.data.Message)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Code',
            selector: (row) => row.EvidenceReasonCode,
            sortable: true
        },
        {
            name: 'Agency Code',
            selector: (row) => row.AgencyCode,
            sortable: true
        },
        {
            name: 'Description',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: 'Agency',
            selector: (row) => <>{row?.MultiAgency_Name ? row?.MultiAgency_Name.substring(0, 40) : ''}{row?.MultiAgency_Name?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'IsEditable',
            selector: (row) => <> <input type="checkbox" checked={checkEdittable(row.IsEditable)} disabled /></>,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>

                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            pageStatus === "1" ?
                                < Link to="/ListManagement?page=Evidence Reasons" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.EvidenceReasonID); setIsActive('0'); setConfirmType("InActive") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                                </Link>
                                :
                                <Link to="/ListManagement?page=Evidence Reasons" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.EvidenceReasonID); setIsActive('1'); setConfirmType("Active") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                            : <></>
                            :
                            pageStatus === "1" ?
                                < Link to="/ListManagement?page=Evidence Reasons" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.EvidenceReasonID); setIsActive('0'); setConfirmType("InActive") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                                </Link>
                                :
                                <Link to="/ListManagement?page=Evidence Reasons" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.EvidenceReasonID); setIsActive('1'); setConfirmType("Active") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                    }
                </div>

        }
    ]

    const checkEdittable = (val) => {
        const check = { "1": true, "0": false };
        return check[val]
    }

    // to set Button add or update condition
    const setEditValue = (row) => {
        setUpdateStatus(updateStatus + 1);
        setSingleTypeId(row.EvidenceReasonID)
        setModal(true)
        setStatus(true); reset('')
    }

    const setStatusFalse = (e) => {
        setClickedRow(null); setStatus(false); setSingleTypeId(); setModal(true); reset();
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

    const AddType = [
        { value: 1, label: 'CheckIn', },
        { value: 2, label: 'CheckOut', },
        { value: 3, label: 'Release', },
        { value: 4, label: 'Destroy', },
        { value: 5, label: 'TransferLocation', },
        { value: 6, label: 'Update', },
    ]

    const ChangeDropDown = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-12 col-lg-12 ">
                    <div className="row " style={{ marginTop: '-14px', marginLeft: '-18px' }}>
                        <div className="col-12 px-1 ">
                            <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0">Property Evidence Reason</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-12 col-lg-12 incident-tab mt-1">
                    <ul className="nav nav-tabs mb-1 pl-2" id="myTab" role="tablist">
                        <span className={`nav-item ${pageStatus === '1' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus("1"); setSearchValue1(''); setSearchValue2(''); setStatusFalse(); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === '1' ? 'Red' : '' }}>Active</span>
                        <span className={`nav-item ${pageStatus === '0' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus("0"); setSearchValue1(''); setSearchValue2(''); setStatusFalse(); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === '0' ? 'Red' : '' }}>InActive</span>
                    </ul>
                </div>
                <div className="col-12 mt-2 ">
                    {
                        pageStatus === '1' ?
                            <>
                                <div className="row">

                                    <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                        <label htmlFor="" className='new-label px-0'>Evidence&nbsp;Reason</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-5 mt-1">
                                        <Select
                                            name='EvidenceReasonType'
                                            menuPlacement="top"
                                            options={AddType}
                                            isClearable
                                            value={AddType?.filter((obj) => obj.label === value?.EvidenceReasonType)}
                                            onChange={(selectedOption) => {
                                                setValue({ ...value, ['EvidenceReasonType']: selectedOption ? selectedOption.label : '' });
                                            }}

                                        />

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                        <label htmlFor="" className='new-label'>Code{errors.CodeError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                        <input type="text" maxLength={10} name='EvidenceReasonCode' onChange={handlChanges}
                                            disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false} className='requiredColor' value={value.EvidenceReasonCode} />
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                        <label htmlFor="" className='new-label'>Agency Code</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                        <input type="text" name='AgencyCode' maxLength={10} onChange={handlChanges} value={value.AgencyCode} />

                                    </div>
                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                        <label htmlFor="" className='new-label'>Description  {errors.DescriptionError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-5 mt-1 text-field">
                                        <textarea className='requiredColor' name='Description' disabled={status && value.IsEditable === '0' || value.IsEditable === false ? true : false} onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                        <label htmlFor="" className='new-label'>Agency</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-9 mt-1">
                                        <SelectBox
                                            options={agencyData}
                                            isMulti
                                            closeMenuOnSelect={false}
                                            hideSelectedOptions={true}
                                            onChange={Agencychange}
                                            allowSelectAll={true}
                                            value={multiSelected.optionSelected}
                                        />
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-2 mt-1">
                                        <input type="checkbox" name="IsEditable" checked={value.IsEditable} value={value.IsEditable}
                                            onChange={handlChanges}
                                            id="IsCADCfsCode" />
                                        <label className='ml-2' htmlFor="IsEditable">Is Editable</label>
                                    </div>


                                </div>
                                <div className="btn-box text-right mt-3 mr-1 bb">
                                    <button type="button" className="btn btn-sm btn-success mr-1 mb-1" data-dismiss="modal" onClick={() => { setStatusFalse(); }}>New</button>

                                    {
                                        status ?
                                            effectiveScreenPermission ? effectiveScreenPermission[0]?.ChangeOK ?
                                                <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Update</button>
                                                : <></> :
                                                <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Update</button>
                                            :
                                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Save</button>
                                                : <> </> :
                                                <button type="button" className="btn btn-sm btn-success mr-2 mb-1" onClick={check_Validation_Error}>Save</button>
                                    }
                                </div>
                            </>
                            : <></>
                    }
                    <div className="col-12 mt-2 ">
                        <div className="row">
                            <div className="col-5">
                                <input type="text" value={searchValue1} onChange={(e) => {
                                    setSearchValue1(e.target.value);
                                    const result = Filter(dataList, e.target.value, searchValue2, filterTypeIdOption, ' EvidenceReasonCode', 'Description')
                                    setFilterDataList(result)
                                }}
                                    className='form-control' placeholder='Search By Code...' />
                            </div>
                            <div className='col-1'>
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        <i className="fa fa-filter"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilterTypeIdOption('Contains')}>Contains</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterTypeIdOption('is equal to')}>is equal to</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterTypeIdOption('is not equal to')}>is not equal to </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterTypeIdOption('Starts With')}>Starts With</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterTypeIdOption('End with')}>End with</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="col-5">
                                <input type="text" value={searchValue2} onChange={(e) => {
                                    setSearchValue2(e.target.value)
                                    const result = Filter(dataList, searchValue1, e.target.value, filterTypeDescOption, ' EvidenceReasonCode', 'Description')
                                    setFilterDataList(result)
                                }}
                                    className='form-control' placeholder='Search By Description...' />
                            </div>
                            <div className='col-1'>
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        <i className="fa fa-filter"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilterTypeDescOption('Contains')}>Contains</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterTypeDescOption('is equal to')}>is equal to</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterTypeDescOption('is not equal to')}>is not equal to </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterTypeDescOption('Starts With')}>Starts With</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterTypeDescOption('End with')}>End with</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive mt-2">
                        <div className="col-12">
                            <div className="row ">
                                <div className="col-12">
                                    <DataTable
                                        columns={columns}
                                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? filterDataList : '' : ''}
                                        dense
                                        paginationPerPage={'10'}
                                        paginationRowsPerPageOptions={[5, 10, 15]}
                                        highlightOnHover
                                        noContextMenu
                                        pagination
                                        responsive
                                        subHeaderAlign="right"
                                        subHeaderWrap
                                        fixedHeader
                                        conditionalRowStyles={conditionalRowStyles}
                                        onRowClicked={(row) => {
                                            setEditValue(row); setClickedRow(row);
                                        }}
                                        persistTableHead={true}
                                        customStyles={tableCustomStyles}
                                        fixedHeaderScrollHeight='200px'
                                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            < ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
        </>
    )
}

export default PropertyEvidenceReason

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