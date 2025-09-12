import { useEffect, useState } from 'react'
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

function TypeOfBoloSection() {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
    const [pageStatus, setPageStatus] = useState(true);
    const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [filterListData, setFilterListData] = useState([]);
    const [isChange, setIsChange] = useState(false);
    const [listData, setListData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isActive, setIsActive] = useState('');
    const [activeInactiveData, setActiveInactiveData] = useState({})
    const [confirmType, setConfirmType] = useState('');
    const [loginPinID, setLoginPinID] = useState(1);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [
        typeOfBOLOState,
        setTypeOfBOLOState,
        handleTypeOfBOLOState,
        clearTypeOfBOLOState,
    ] = useObjState({
        description: "",
        IsActive: true
    })

    const [
        errorTypeOfBOLOState,
        ,
        handleErrorTypeOfBOLOState,
        clearErrorTypeOfBOLOState,
    ] = useObjState({
        description: false,
    });


    const getBoloTypeKey = `/CAD/MasterBoloType/GetBoloType/${parseInt(pageStatus)}`;
    const { data: getBoloTypeData, isSuccess: isFetchBoloType, refetch, isError: isNoData } = useQuery(
        [getBoloTypeKey, {
            IsActive: pageStatus,
            AgencyID: loginAgencyID,
            IsSuperAdmin: isSuperAdmin,
            PINID: loginPinID,
        },],
        MasterTableListServices.getBoloType,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID && !!loginPinID
        }
    );

    const getAgencyCodeKey = `/CAD/MasterAgency/MasterAgencyCode`;
    const { data: agencyCodeData, isSuccess: isFetchAgencyCodeData } = useQuery(
        [getAgencyCodeKey, {},],
        MasterTableListServices.getAgencyCode,
        {
            refetchOnWindowFocus: false,
        }
    );

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
            setIsSuperAdmin(localStoreData?.IsSuperadmin);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (getBoloTypeData && isFetchBoloType) {
            const data = JSON.parse(getBoloTypeData?.data?.data);
            setFilterListData(data?.Table)
            setListData(data?.Table)
            setEffectiveScreenPermission(data?.Table1?.[0]);
        } else {
            setFilterListData([])
            setListData([])
            setEffectiveScreenPermission();
        }
    }, [getBoloTypeData, isFetchBoloType])

    const changeArrayFormat = (data) => {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }

    useEffect(() => {
        if (isFetchAgencyCodeData && agencyCodeData) {
            const data = JSON.parse(agencyCodeData?.data?.data);
            setAgencyCodeDropDown(changeArrayFormat(data?.Table) || [])
        }
    }, [isFetchAgencyCodeData, agencyCodeData]);


    function handleClose() {
        setMultiSelected({
            optionSelected: null
        });
        clearTypeOfBOLOState();
        clearErrorTypeOfBOLOState();
        setIsChange(false);
    }

    const columns = [
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

    async function handelActiveInactive() {
        const data = {
            "BoloTypeID": activeInactiveData?.BoloTypeID,
            "DeletedByUserFK": loginPinID,
            "IsActive": isActive,
        }
        const response = await MasterTableListServices.changeStatusBoloType(data);
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
        const keys = Object.keys(errorTypeOfBOLOState);
        keys.map((field) => {
            if (
                field === "description" &&
                isEmpty(typeOfBOLOState[field])) {
                handleErrorTypeOfBOLOState(field, true);
                isError = true;
            } else {
                handleErrorTypeOfBOLOState(field, false);
            }
            return null;
        });
        return !isError;
    };

    function handelSetEditData(data) {
        const val = { BoloTypeID: data?.BoloTypeID, AgencyID: loginAgencyID, }

        fetchPostData('/CAD/MasterBoloType/GetSingleData_BoloType', val).then((res) => {
            if (res) {
                setTypeOfBOLOState({
                    agencyCode: res[0]?.AgencyID,
                    MultiAgency_Name: res[0]?.MultiAgency_Name,
                    BoloTypeID: res[0]?.BoloTypeID,
                    description: res[0]?.Description,
                    IsActive: res[0]?.IsActive
                })
                setMultiSelected({
                    optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
                    ) : '',
                });
            }
            else { setTypeOfBOLOState({}) }
        })
    }

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
            setTypeOfBOLOState({
                ...typeOfBOLOState,
                'agencyCode': id.toString(), 'MultiAgency_Name': name.toString()
            })
        }
    }

    const conditionalRowStyles = [
        {
            when: row => row?.BoloTypeID === typeOfBOLOState?.BoloTypeID,
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

    async function handleSave() {
        if (!validation()) return
        setIsDisabled(true);
        const isUpdate = !!typeOfBOLOState?.BoloTypeID;
        const result = listData?.find(item => {
            if (item.Description) {
                const code = typeOfBOLOState?.description?.toLowerCase();
                return code && item.Description.toLowerCase() === code;
            }
            return false;
        });

        if (result && !isUpdate) {
            if (result) {
                toastifyError('Description Already Exists');
            }
        } else {
            const data = {
                "MultiAgency_Name": typeOfBOLOState?.MultiAgency_Name,
                "AgencyID": typeOfBOLOState?.agencyCode || "",
                "BoloTypeID": isUpdate ? typeOfBOLOState?.BoloTypeID : undefined,
                "Description": typeOfBOLOState?.description,
                "CreatedByUserFK": isUpdate ? undefined : loginPinID,
                "ModifiedByUserFK": isUpdate ? loginPinID : undefined,
                "IsActive": typeOfBOLOState?.IsActive
            };

            let response;
            if (isUpdate) {
                response = await MasterTableListServices.updateBoloType(data);
            } else {
                response = await MasterTableListServices.insertBoloType(data);
            }
            if (response?.status === 200) {
                toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
                handleClose();
                refetch();
            }
        }
        setIsDisabled(false);
    }

    return (
        <>
            <div className='utilities-tab-content-main-container'>
                <div className='utilities-tab-content-form-container'>
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12 incident-tab ">
                            <ul className="nav nav-tabs mb-1 pl-2 " id="myTab" role="tablist">
                                <span className={`nav-item ${pageStatus === true ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(true); setSearchValue1(""); setSearchValue2(""); handleClose() }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === true ? 'Red' : '' }}>Active</span>
                                <span className={`nav-item ${pageStatus === false ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(false); setSearchValue1(""); setSearchValue2(""); handleClose() }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === false ? 'Red' : '' }}>InActive</span>
                            </ul>
                        </div>    {
                            pageStatus ?
                                <>
                                    <div className='utilities-tab-content-form-main'>
                                        <div className="row">
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <label for="" className="tab-form-label">
                                                    Description  {errorTypeOfBOLOState.description && isEmpty(typeOfBOLOState?.description) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-3 d-flex align-self-center justify-content-end">
                                                <input
                                                    name="description"
                                                    type="text"
                                                    className="form-control py-1 new-input requiredColor"
                                                    placeholder='Description'
                                                    value={typeOfBOLOState?.description}
                                                    onChange={(e) => { handleTypeOfBOLOState("description", e.target.value); setIsChange(true); }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <label for="" className="tab-form-label">
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
                                    {effectiveScreenPermission.AddOK && !typeOfBOLOState?.BoloTypeID ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={!isChange}
                                            onClick={() => handleSave()}
                                        >
                                            Save
                                        </button>
                                    ) : effectiveScreenPermission.ChangeOK && !!typeOfBOLOState?.BoloTypeID ? (
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

export default TypeOfBoloSection