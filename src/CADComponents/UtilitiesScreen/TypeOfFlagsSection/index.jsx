import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import { tableMinCustomStyles } from '../../../Components/Common/Utility';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { compareStrings, handleNumberTextNoSpaceKeyDown, isEmpty, isEmptyObject } from '../../../CADUtils/functions/common';
import useObjState from '../../../CADHook/useObjState';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import Select from "react-select";
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import { coloredStyle_Select } from '../../Utility/CustomStylesForReact';
import Tooltip from '../../Common/Tooltip';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { getData_DropDown_Priority } from '../../../CADRedux/actions/DropDownsData';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

function TypeOfFlagsSection() {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
    const [pageStatus, setPageStatus] = useState(true);
    const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [isChange, setIsChange] = useState(false);
    const [filterListData, setFilterListData] = useState([]);
    const [listData, setListData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isActive, setIsActive] = useState('');
    const [activeInactiveData, setActiveInactiveData] = useState({})
    const [confirmType, setConfirmType] = useState('');
    const [loginPinID, setLoginPinID] = useState(1);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [isSuperAdmin, setIsSuperAdmin] = useState(0);
    const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })
    const [isDisabled, setIsDisabled] = useState(false);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [
        typeOfFlagsState,
        setTypeOfFlagsState,
        handleTypeOfFlagsState,
        clearTypeOfFlagsState,
    ] = useObjState({
        nameCode: "",
        description: "",
        PriorityID: "",
        FlagID: "",
        IsActive: true,
        agencyCode: "",
        MultiAgency_Name: "",
        cfsLaw: false,
        cfsFire: false,
        cfsEmergencyMedicalService: false,
        cfsOther: false,
    })

    const [
        errorTypeOfFlagsState,
        ,
        handleErrorTypeOfFlagsState,
        clearErrorTypeOfFlagsState,
    ] = useObjState({
        nameCode: false,
        description: false,
        PriorityID: false,
        agencyTypes: false,
    });

    const getTypeOfFlagKey = `/CAD/MasterTypeOfFlag/GetData_Flag`;
    const { data: getTypeOfFlagData, isSuccess: isFetchGetTypeOfFlag, refetch, isError: isNoData } = useQuery(
        [getTypeOfFlagKey, {
            IsActive: pageStatus,
            AgencyID: loginAgencyID,
            IsSuperAdmin: isSuperAdmin,
            PINID: loginPinID,
        },],
        MasterTableListServices.getTypeOfFlag,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID && !!loginPinID,
        }
    );

    const getAgencyCode = `/MasterAgency/MasterAgencyCode`;
    const { data: agencyCodeData, isSuccess: isFetchAgencyCode } = useQuery(
        [getAgencyCode],
        MasterTableListServices.getAgencyCode,
        {
            refetchOnWindowFocus: false,
        }
    );

    const changeArrayFormat = (data) => {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }

    useEffect(() => {
        if (isFetchAgencyCode && agencyCodeData) {
            const data = JSON.parse(agencyCodeData?.data?.data);
            setAgencyCodeDropDown(changeArrayFormat(data?.Table) || [])
        }
    }, [isFetchAgencyCode, agencyCodeData]);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
            setIsSuperAdmin(localStoreData?.IsSuperadmin);
            if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    useEffect(() => {
        if (getTypeOfFlagData && isFetchGetTypeOfFlag) {
            const data = JSON.parse(getTypeOfFlagData?.data?.data);
            setFilterListData(data?.Table)
            setListData(data?.Table)
            setEffectiveScreenPermission(data?.Table1?.[0]);
        } else {
            setFilterListData([])
            setListData([])
            setEffectiveScreenPermission();
        }
    }, [getTypeOfFlagData, isFetchGetTypeOfFlag])

    function handleClose() {
        clearTypeOfFlagsState();
        clearErrorTypeOfFlagsState();
        setIsChange(false);
        setMultiSelected({
            optionSelected: null
        });
    }

    const columns = [
        {
            name: 'Flag Name',
            selector: row => row.FlagNameCode,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.FlagNameCode, rowB.FlagNameCode),
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
            cell: (row) => (
                <Tooltip text={row?.Description || ''} maxLength={30} />
            ),
        },
        {
            name: 'Priority Code',
            selector: row => PriorityDrpData?.find((i) => i?.PriorityID === row?.PriorityID)?.PriorityCode,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.PriorityID, rowB.PriorityID),
            style: {
                position: "static",
            },
        },
        {
            name: 'Priority Color',
            selector: row => row.PriorityColor1,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.PriorityColor1, rowB.PriorityColor1),
            style: {
                position: "static",
            },
            cell: row => (
                <div style={{
                    backgroundColor: row.PriorityColor1, width: '100%', height: '100%', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                </div>)
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
            "FlagID": activeInactiveData?.FlagID,
            "DeletedByUserFK": loginPinID,
            "IsActive": isActive,
        }
        const response = await MasterTableListServices.changeStatusTypeOfFlag(data);
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
        const keys = Object.keys(errorTypeOfFlagsState);
        keys.map((field) => {
            if (
                field === "nameCode" &&
                isEmpty(typeOfFlagsState[field])) {
                handleErrorTypeOfFlagsState(field, true);
                isError = true;
            } else if (
                field === "description" &&
                isEmpty(typeOfFlagsState[field])) {
                handleErrorTypeOfFlagsState(field, true);
                isError = true;
            } else if (field === "agencyTypes" && (typeOfFlagsState.cfsLaw === false && typeOfFlagsState.cfsFire === false && typeOfFlagsState.cfsEmergencyMedicalService === false && typeOfFlagsState.cfsOther === false)) {
                handleErrorTypeOfFlagsState(field, true);
                isError = true;
            } else if (field === "PriorityID" && isEmptyObject(typeOfFlagsState[field])) {
                handleErrorTypeOfFlagsState(field, true);
                isError = true;
            } else {
                handleErrorTypeOfFlagsState(field, false);
            }
            return null;
        });
        return !isError;
    };

    function handelSetEditData(data) {
        const val = { FlagID: data?.FlagID, AgencyID: loginAgencyID, }
        fetchPostData('/CAD/MasterTypeOfFlag/GetSingleData_Flag', val).then((res) => {
            if (res) {
                setTypeOfFlagsState({
                    ZoneID: res[0]?.ZoneID,
                    agencyCode: res[0]?.AgencyID,
                    MultiAgency_Name: res[0]?.MultiAgency_Name,
                    nameCode: res[0]?.FlagNameCode,
                    description: res[0]?.Description,
                    PriorityID: res[0]?.PriorityID ? PriorityDrpData?.find((i) => i?.PriorityID === res[0]?.PriorityID) : "",
                    FlagID: res[0]?.FlagID,
                    IsActive: res[0]?.IsActive,
                    cfsLaw: res[0]?.LAW,
                    cfsFire: res[0]?.FIRE,
                    cfsEmergencyMedicalService: res[0]?.EMERGENCY,
                    cfsOther: res[0]?.OTHER,
                })
                setMultiSelected({
                    optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
                    ) : '',
                });
            }
            else { setTypeOfFlagsState({}) }
        })
    }

    const conditionalRowStyles = [
        {
            when: row => row?.FlagID === typeOfFlagsState?.FlagID,
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
        const isUpdate = !!typeOfFlagsState?.FlagID;
        const result = listData?.find(item => {
            if (item.FlagNameCode) {
                const code = typeOfFlagsState?.nameCode?.toLowerCase();
                return code && item.FlagNameCode.toLowerCase() === code;
            }
            return false;
        });
        const result1 = listData?.find(item => {
            if (item.Description) {
                const description = typeOfFlagsState?.description?.toLowerCase();
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
            const payload = {
                FlagID: isUpdate ? typeOfFlagsState?.FlagID : undefined,
                AgencyID: loginAgencyID,
                FlagNameCode: typeOfFlagsState?.nameCode,
                Description: typeOfFlagsState?.description,
                PriorityID: typeOfFlagsState?.PriorityID?.PriorityID,
                CreatedByUserFK: isUpdate ? undefined : loginPinID,
                ModifiedByuserFk: isUpdate ? loginPinID : undefined,
                isActive: true,
                MultiAgency_Name: typeOfFlagsState?.MultiAgency_Name,
                AgencyID: typeOfFlagsState?.agencyCode,
                CFSL: typeOfFlagsState?.cfsLaw ? 1 : 0,
                CFSF: typeOfFlagsState?.cfsFire ? 1 : 0,
                CFSE: typeOfFlagsState?.cfsEmergencyMedicalService ? 1 : 0,
                OTHER: typeOfFlagsState?.cfsOther ? 1 : 0,
            };
            let response;
            if (isUpdate) {
                response = await MasterTableListServices.updateFlag(payload);
            } else {
                response = await MasterTableListServices.insertTypeOfFlag(payload);
            }

            if (response?.status === 200) {
                toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
                handleClose();
                refetch();
            }
        }
        setIsDisabled(false);
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
            setTypeOfFlagsState({
                ...typeOfFlagsState,
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
                                                    Flag Name Code  {errorTypeOfFlagsState.nameCode && isEmpty(typeOfFlagsState?.nameCode) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Flag Name Code"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <input
                                                    name="nameCode"
                                                    type="text"
                                                    className="form-control py-1 new-input requiredColor"
                                                    placeholder='Flag Name Code'
                                                    value={typeOfFlagsState?.nameCode}
                                                    onChange={(e) => { handleTypeOfFlagsState("nameCode", e.target.value); setIsChange(true); }}
                                                    onKeyDown={handleNumberTextNoSpaceKeyDown}
                                                    maxLength={20}
                                                />
                                            </div>
                                            <div className="col-1 d-flex align-self-center justify-content-end">
                                                <label for="" className="tab-form-label">
                                                    Description  {errorTypeOfFlagsState.description && isEmpty(typeOfFlagsState?.description) && (
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
                                                    value={typeOfFlagsState?.description}
                                                    onChange={(e) => { handleTypeOfFlagsState("description", e.target.value); setIsChange(true); }}
                                                    maxLength={256}
                                                />
                                            </div>
                                            <div className="col-1 d-flex align-self-center justify-content-end">
                                                <label for="" className="tab-form-label">
                                                    Priority  {errorTypeOfFlagsState.PriorityID && isEmpty(typeOfFlagsState?.PriorityID) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Priority"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <Select
                                                    isClearable
                                                    options={PriorityDrpData}
                                                    placeholder="Select..."
                                                    styles={coloredStyle_Select}
                                                    getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                                    getOptionValue={(v) => v?.PriorityCode}
                                                    formatOptionLabel={(option, { context }) => {
                                                        return context === 'menu'
                                                            ? `${option?.PriorityCode} | ${option?.Description}`
                                                            : option?.PriorityCode;
                                                    }}
                                                    className="w-100"
                                                    name="PriorityID"
                                                    value={typeOfFlagsState.PriorityID ? typeOfFlagsState.PriorityID : ""}
                                                    onChange={(e) => { handleTypeOfFlagsState("PriorityID", e); setIsChange(true); }}
                                                    onInputChange={(inputValue, actionMeta) => {
                                                        if (inputValue.length > 12) {
                                                            return inputValue.slice(0, 12);
                                                        }
                                                        return inputValue;
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-2 d-flex align-self-start justify-content-end">
                                                <label for="" className="tab-form-label" style={{ marginTop: "10px", whiteSpace: 'nowrap', marginRight: '10px' }}>
                                                    Required Agency Types{errorTypeOfFlagsState.agencyTypes && typeOfFlagsState.cfsLaw === false && typeOfFlagsState.cfsFire === false && typeOfFlagsState.cfsEmergencyMedicalService === false && typeOfFlagsState.cfsOther === false && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Agency Type"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-7 d-flex align-self-center justify-content-end">

                                                <div className='agency-types-checkbox-container'>
                                                    {/* L : Law */}
                                                    <div className="agency-checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            name="cfsLaw"
                                                            checked={typeOfFlagsState.cfsLaw}
                                                            onChange={(e) => { handleTypeOfFlagsState("cfsLaw", e.target.checked); setIsChange(true); }}
                                                        />
                                                        <div className="agency-checkbox-text-container tab-form-label">
                                                            <span>L</span>
                                                            <span>|</span>
                                                            <span>Law</span>
                                                        </div>
                                                    </div>
                                                    {/* F : Fire */}
                                                    <div className="agency-checkbox-item ">
                                                        <input
                                                            type="checkbox"
                                                            name="cfsFire"
                                                            checked={typeOfFlagsState.cfsFire}
                                                            onChange={(e) => { handleTypeOfFlagsState("cfsFire", e.target.checked); setIsChange(true); }}
                                                        />
                                                        <div className="agency-checkbox-text-container tab-form-label">
                                                            <span>F</span>
                                                            <span>|</span>
                                                            <span>Fire</span>
                                                        </div>
                                                    </div>
                                                    {/* E : Emergency Medical Service */}
                                                    <div className="agency-checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            name="cfsEmergencyMedicalService"
                                                            checked={typeOfFlagsState.cfsEmergencyMedicalService}
                                                            onChange={(e) => { handleTypeOfFlagsState("cfsEmergencyMedicalService", e.target.checked); setIsChange(true); }}
                                                        />
                                                        <div className="agency-checkbox-text-container tab-form-label">
                                                            <span>E</span>
                                                            <span>|</span>
                                                            <span>Emergency Medical Service </span>
                                                        </div>
                                                    </div>
                                                    {/* O : Other */}
                                                    <div className="agency-checkbox-item">
                                                        <input
                                                            type="checkbox"
                                                            name="cfsOther"
                                                            checked={typeOfFlagsState.cfsOther}
                                                            onChange={(e) => { handleTypeOfFlagsState("cfsOther", e.target.checked); setIsChange(true); }}

                                                        />
                                                        <div className="agency-checkbox-text-container tab-form-label">
                                                            <span>O</span>
                                                            <span>|</span>
                                                            <span>Other</span>
                                                        </div>
                                                    </div>
                                                </div>
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
                                placeholder='Search By Flag Name...'
                                value={searchValue1}
                                onChange={(e) => {
                                    setSearchValue1(e.target.value);
                                    const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'FlagNameCode', 'Description')
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
                                    const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'FlagNameCode', 'Description')
                                    setFilterListData(result)
                                }}
                            />
                        </div>

                        <div className="col-1 d-flex align-self-center justify-content-end" style={{ zIndex: '1', }}>
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
                            customStyles={tableMinCustomStyles}
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
                                    {effectiveScreenPermission.AddOK && !typeOfFlagsState?.FlagID ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={!isChange}
                                            onClick={() => handleSave()}
                                        >
                                            Save
                                        </button>
                                    ) : effectiveScreenPermission.ChangeOK && !!typeOfFlagsState?.FlagID ? (
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

export default TypeOfFlagsSection