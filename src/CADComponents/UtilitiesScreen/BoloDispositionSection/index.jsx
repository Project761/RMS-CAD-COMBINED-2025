import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { compareStrings, isEmpty } from '../../../CADUtils/functions/common';
import useObjState from '../../../CADHook/useObjState';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

function BoloDispositionSection() {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
    const [pageStatus, setPageStatus] = useState(true);
    const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
    const [searchValue1, setSearchValue1] = useState('');
    const [isChange, setIsChange] = useState(false);
    const [searchValue2, setSearchValue2] = useState('');
    const [filterListData, setFilterListData] = useState([]);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [listData, setListData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isActive, setIsActive] = useState('');
    const [activeInactiveData, setActiveInactiveData] = useState({})
    const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
    const [confirmType, setConfirmType] = useState('');
    const [loginPinID, setLoginPinID] = useState(1);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [isSuperAdmin, setIsSuperAdmin] = useState(0);
    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })
    const [
        boloDispositionState,
        setBoloDispositionState,
        handleBoloDispositionState,
        clearBoloDispositionState,
    ] = useObjState({
        code: "",
        agencyCode: "",
        description: "",
        MultiAgency_Name: "",
        IsActive: true
    })

    const [
        errorBoloDispositionState,
        ,
        handleErrorBoloDispositionState,
        clearErrorBoloDispositionState, ,
    ] = useObjState({
        code: false,
        description: false,
    });


    const getAgencyCodeKey = `/CAD/MasterAgency/MasterAgencyCode`;
    const { data: getAgencyCodeData, isSuccess: isFetchAgencyCode } = useQuery(
        [getAgencyCodeKey, {},],
        MasterTableListServices.getAgencyCode,
        {
            refetchOnWindowFocus: false,
        }
    );

    const getBoloDispositionKey = `/CAD/Monitor/MasterBoloDispositionGet/${parseInt(pageStatus)}`;
    const { data: getBoloDispositionData, isSuccess: isFetchBoloDisposition, refetch, isError: isNoData } = useQuery(
        [getBoloDispositionKey, {
            "IsActive": pageStatus,
            "AgencyID": loginAgencyID,
            "PINID": loginPinID,
            "IsSuperAdmin": isSuperAdmin
        },],
        MasterTableListServices.getBoloDisposition,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID && !!loginPinID
        }
    );

    useEffect(() => {
        if (getBoloDispositionData && isFetchBoloDisposition) {
            const data = JSON.parse(getBoloDispositionData?.data?.data);
            setFilterListData(data?.Table)
            setListData(data?.Table)
            setEffectiveScreenPermission(data?.Table1?.[0]);
        } else {
            setFilterListData([])
            setListData([])
            setEffectiveScreenPermission();
        }
    }, [getBoloDispositionData, isFetchBoloDisposition])

    const changeArrayFormat = (data) => {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }

    useEffect(() => {
        if (isFetchAgencyCode && getAgencyCodeData) {
            const data = JSON.parse(getAgencyCodeData?.data?.data);
            setAgencyCodeDropDown(changeArrayFormat(data?.Table) || [])
        }
    }, [isFetchAgencyCode, getAgencyCodeData]);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
            setIsSuperAdmin(localStoreData?.IsSuperadmin);
        }
    }, [localStoreData]);

    const columns = [
        {
            name: 'Code',
            selector: row => row.DispositionCode,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.DispositionCode, rowB.DispositionCode),
            style: {
                position: "static",
            },
        },
        {
            name: 'Description',
            selector: row => row.Description,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Description, rowB.Description),
            style: {
                position: "static",
            },
        },
        {
            name:
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    {'Status'}
                </div>,
            cell: (row, index) =>
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <span
                        className="btn btn-sm text-white px-1 py-0 mr-1"
                        style={{ background: "#ddd", cursor: "pointer" }}
                    >
                        {effectiveScreenPermission ? effectiveScreenPermission?.DeleteOK ? row?.IsActive ? (
                            <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true" onClick={(e) => { setShowModal(true); setActiveInactiveData(row); setIsActive(false); setConfirmType("InActive"); handleClose() }}></i>
                        ) : (
                            <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true" onClick={(e) => { setShowModal(true); setActiveInactiveData(row); setIsActive(true); setConfirmType("Active"); handleClose() }}></i>
                        ) : <></> : <></>}
                    </span>
                </div>,
            width: "70px",
            style: {
                position: "static",
            },
        },
    ];

    function handleClose() {
        clearBoloDispositionState();
        setIsChange(false);
        setMultiSelected({
            optionSelected: null
        });
        clearErrorBoloDispositionState();
    }

    async function handelActiveInactive() {
        const data = {
            "BoloDispositionID": activeInactiveData?.BoloDispositionID,
            "DeletedByUserFK": loginPinID,
            "IsActive": isActive,
        }
        const response = await MasterTableListServices.changeStatusBoloDisposition(data);
        if (response?.status === 200) {
            const data = JSON.parse(response?.data?.data)?.Table?.[0];
            toastifySuccess(data?.Message);
            refetch();
        }
        setShowModal(false);
        handleClose();
    }

    const validation = () => {
        let isError = false;
        const keys = Object.keys(errorBoloDispositionState);
        keys.forEach((field) => {
            if (field === "code" && isEmpty(boloDispositionState[field])) {
                handleErrorBoloDispositionState(field, true);
                isError = true;
            } else if (field === "description" && isEmpty(boloDispositionState[field])) {
                handleErrorBoloDispositionState(field, true);
                isError = true;
            } else {
                handleErrorBoloDispositionState(field, false);
            }
        });
        return !isError;
    };

    async function handleSave() {
        if (!validation()) return;
        const isUpdate = !!boloDispositionState?.BoloDispositionID;

        const result = listData?.find(item => {
            if (item.DispositionCode) {
                const code = boloDispositionState?.code?.toLowerCase();
                return code && item.DispositionCode.toLowerCase() === code;
            }
            return false;
        });
        const result1 = listData?.find(item => {
            if (item.Description) {
                const description = boloDispositionState?.description?.toLowerCase();
                return description && item.Description.toLowerCase() === description;
            }
            return false;
        });
        if ((result || result1) && !isUpdate) {
            if (result) {
                toastifyError('Code Already Exists');
            }
            if (result1) {
                toastifyError('Description Already Exists');
            }
        } else {
            setIsDisabled(true);
            const data = {
                DispositionCode: boloDispositionState?.code,
                BoloDispositionID: isUpdate ? boloDispositionState?.BoloDispositionID : undefined,
                Description: boloDispositionState?.description,
                CreatedByUserFK: isUpdate ? undefined : loginPinID,
                MultiAgency_Name: boloDispositionState?.MultiAgency_Name,
                AgencyID: boloDispositionState?.agencyCode,
                ModifiedByUserFK: isUpdate ? loginPinID : undefined,
                IsActive: boloDispositionState?.IsActive,
            };
            let response;
            if (isUpdate) {
                response = await MasterTableListServices.updateBoloDisposition(data);
            } else {
                response = await MasterTableListServices.insertMasterBoloDisposition(data);
            }
            if (response?.status === 200) {
                toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
                handleClose();
                refetch();
            }
            setIsDisabled(false);
        }
    }

    function handelSetEditData(data) {
        const val = { BoloDispositionID: data?.BoloDispositionID, AgencyID: loginAgencyID, }
        fetchPostData('/CAD/Monitor/MasterBoloDispositionGetById', val).then((res) => {
            if (res) {
                setBoloDispositionState({
                    BoloDispositionID: res[0]?.BoloDispositionID,
                    code: res[0]?.DispositionCode,
                    agencyCode: res[0]?.AgencyID,
                    description: res[0]?.Description,
                    IsActive: res[0]?.IsActive,
                    MultiAgency_Name: res[0]?.MultiAgency_Name
                })
                setMultiSelected({
                    optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
                    ) : '',
                });
            }
            else { setBoloDispositionState({}) }
        })
    }

    const conditionalRowStyles = [
        {
            when: row => row?.BoloDispositionID === boloDispositionState?.BoloDispositionID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                },
            },
        }
    ];

    const handleTabClick = (status) => {
        setPageStatus(status);
        setSearchValue1("");
        setSearchValue2("");
        handleClose();
    };


    const handleSpecialKeyDown = (e) => {
        const isAlphanumeric = e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/);
        const controlKeys = [
            "Backspace",
            "Delete",
            "Tab",
            "Enter",
            "Escape",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
        ];

        if (!isAlphanumeric && !controlKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    const Agencychange = (multiSelected) => {
        setIsChange(true);
        setMultiSelected({
            optionSelected: multiSelected
        });
        const id = []
        const name = []
        if (multiSelected) {
            multiSelected.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setBoloDispositionState({
                ...boloDispositionState,
                'agencyCode': id.toString(), 'MultiAgency_Name': name.toString()
            })
        }
    }

    return (
        <>
            <div className='utilities-tab-content-main-container'>
                <div className='utilities-tab-content-form-container'>
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12 incident-tab ">
                            <ul className="nav nav-tabs mb-1 pl-2" id="myTab" role="tablist">

                                <span className={`nav-item ${pageStatus === true ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(true); setSearchValue1(""); setSearchValue2(""); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === true ? 'Red' : '' }}>Active</span>
                                <span className={`nav-item ${pageStatus === false ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(false); setSearchValue1(""); setSearchValue2(""); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === false ? 'Red' : '' }}>InActive</span>

                            </ul>
                        </div>
                        {
                            pageStatus ?
                                <>
                                    <div className='utilities-tab-content-form-main'>
                                        <div className="row">
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <label htmlFor="" className="tab-form-label">
                                                    Agency
                                                </label>
                                            </div>
                                            <div className="col-6">
                                                <SelectBox
                                                    options={agencyCodeDropDown}
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    hideSelectedOptions={true}
                                                    onChange={Agencychange}
                                                    allowSelectAll={true}
                                                    value={multiSelected.optionSelected}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <label htmlFor="" className="tab-form-label">
                                                    Code
                                                    {errorBoloDispositionState.code && isEmpty(boloDispositionState?.code) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Code"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-3 d-flex align-self-center justify-content-end">
                                                <input
                                                    name="code"
                                                    type="text"
                                                    className="form-control py-1 new-input requiredColor"
                                                    placeholder='Code'
                                                    onKeyDown={handleSpecialKeyDown}
                                                    value={boloDispositionState?.code}
                                                    onChange={(e) => { handleBoloDispositionState("code", e.target.value); setIsChange(true); }}
                                                />
                                            </div>
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <label htmlFor="" className="tab-form-label">
                                                    Description
                                                    {errorBoloDispositionState.description && isEmpty(boloDispositionState?.description) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-4 d-flex align-self-center justify-content-end">
                                                <input
                                                    name="description"
                                                    type="text"
                                                    className="form-control py-1 new-input requiredColor"
                                                    placeholder='Description'
                                                    value={boloDispositionState?.description}
                                                    onChange={(e) => { handleBoloDispositionState("description", e.target.value); setIsChange(true); }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                </>
                        } </div>

                </div>

                <div className='utilities-tab-content-table-container'>
                    <div className="row mb-2">
                        <div className="col-5 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Search By Code...'
                                value={searchValue1}
                                onChange={(e) => {
                                    setSearchValue1(e.target.value);
                                    const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'DispositionCode', 'Description')
                                    setFilterListData(result)
                                }}
                            />
                        </div>
                        <div className="col-1 d-flex align-self-center justify-content-end" >
                            <Dropdown className='w-100'>
                                <Dropdown.Toggle id="dropdown-basic" className='cad-sort-dropdown'>
                                    <img src={SendIcon(filterTypeIdOption)} alt="" className='filter-icon mr-1' />
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
                        <div className="col-5 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Search By Description...'
                                value={searchValue2}
                                onChange={(e) => {
                                    setSearchValue2(e.target.value);
                                    const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'DispositionCode', 'Description')
                                    setFilterListData(result)
                                }}
                            />
                        </div>

                        <div className="col-1 d-flex align-self-center justify-content-end">
                            <Dropdown className='w-100'>
                                <Dropdown.Toggle id="dropdown-basic" className='cad-sort-dropdown'>
                                    <img src={SendIcon(filterTypeDescOption)} alt="" className='filter-icon mr-1' />
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

                    <div className="table-responsive">
                        <DataTable
                            dense
                            columns={columns}
                            data={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? filterListData : '' : ''}
                            customStyles={tableCustomStyles}
                            conditionalRowStyles={conditionalRowStyles}
                            pagination
                            responsive
                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            striped
                            persistTableHead={true}
                            highlightOnHover
                            fixedHeader
                            onRowClicked={(row) => {
                                handelSetEditData(row);
                            }}
                        />
                    </div>
                    {pageStatus &&
                        <div className="utilities-tab-content-button-container" >
                            <button type="button" className="btn btn-sm btn-success" onClick={() => handleClose()} >New</button>
                            {effectiveScreenPermission && (
                                <>
                                    {effectiveScreenPermission.AddOK && !boloDispositionState?.BoloDispositionID ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={!isChange}
                                            onClick={() => handleSave()}
                                        >
                                            Save
                                        </button>
                                    ) : effectiveScreenPermission.ChangeOK && !!boloDispositionState?.BoloDispositionID ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={!isChange || isDisabled}
                                            onClick={() => handleSave()}
                                        >
                                            Update
                                        </button>
                                    ) : null}
                                </>
                            )}
                        </div>}
                </div>
            </div>
            <CADConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirm={handelActiveInactive} confirmType={confirmType} />
        </>
    )
}

export default BoloDispositionSection