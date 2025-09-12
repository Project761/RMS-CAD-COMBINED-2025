import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { compareStrings, isEmpty } from '../../../CADUtils/functions/common';
import useObjState from '../../../CADHook/useObjState';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { toastifySuccess } from '../../../Components/Common/AlertMsg';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import Select from "react-select";
import { colorLessStyle_Select } from '../../Utility/CustomStylesForReact';
import DatePicker from "react-datepicker";
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';


function Jurisdiction() {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
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
        jurisdictionState,
        setJurisdictionState,
        handleJurisdictionState,
        clearJurisdictionState,
    ] = useObjState({
        ID: "",
        agencyCode: "",
        MultiAgency_Name: '',
        fromTime: "",
        priorityCode: "",
        jurisdictionCode: "",
        jurisdictionType: "",
        description: "",
        toTime: "",
        IsActive: true,
    })

    const [
        errorJurisdictionState,
        ,
        handleErrorJurisdictionState,
        clearErrorJurisdictionState, ,
    ] = useObjState({
        jurisdictionCode: false,
        description: false,
        jurisdictionType: false,
    });


    const getAgencyCodeKey = `/CAD/MasterAgency/MasterAgencyCode`;
    const { data: getAgencyCodeData, isSuccess: isFetchAgencyCode } = useQuery(
        [getAgencyCodeKey, {},],
        MasterTableListServices.getAgencyCode,
        {
            refetchOnWindowFocus: false,
        }
    );

    const getJurisdictionKey = `/CAD/MasterJurisdiction/GetDataJurisdiction/${pageStatus}/${loginAgencyID}/${loginPinID}/${isSuperAdmin}`;
    const { data: getJurisdictionData, isSuccess: isFetchJurisdictionData, refetch, isError: isNoData } = useQuery(
        [getJurisdictionKey, {
            "IsActive": pageStatus,
            "AgencyID": loginAgencyID,
            "PINID": loginPinID,
            "IsSuperAdmin": isSuperAdmin
        },],
        MasterTableListServices.getDataJurisdiction,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID && !!loginPinID
        }
    );

    useEffect(() => {
        if (getJurisdictionData && isFetchJurisdictionData) {
            const data = JSON.parse(getJurisdictionData?.data?.data);
            setFilterListData(data?.Table)
            setListData(data?.Table)
            setEffectiveScreenPermission(data?.Table1?.[0]);
        } else {
            setFilterListData([])
            setListData([])
            setEffectiveScreenPermission();
        }
    }, [getJurisdictionData, isFetchJurisdictionData])

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
            name: 'Jurisdiction Code',
            selector: row => row.JurisdictionCode,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.JurisdictionCode, rowB.JurisdictionCode),
            style: {
                position: "static",
            },
        },
        {
            name: 'Description',
            selector: row => row.Name,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Name, rowB.Name),
            style: {
                position: "static",
            },
        },
        {
            name: 'Jurisdiction Type',
            selector: row => row.Type,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Type, rowB.Type),
            style: {
                position: "static",
            },
        },
        {
            name: 'Priority',
            selector: row => PriorityDrpData?.find((item) => item?.PriorityID === row?.PriorityID)?.PriorityCode,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(PriorityDrpData?.find((item) => item?.PriorityID === rowA?.PriorityID)?.PriorityCode, PriorityDrpData?.find((item) => item?.PriorityID === rowB?.PriorityID)?.PriorityCode),
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
        clearJurisdictionState();
        setIsChange(false);
        setMultiSelected({
            optionSelected: null
        });
        clearErrorJurisdictionState();
    }

    async function handelActiveInactive() {
        const data = {
            "JurisdictionID": activeInactiveData?.ID,
            "DeletedByUserFK": loginPinID,
            "IsActive": isActive,
        }
        const response = await MasterTableListServices.changeStatusJurisdiction(data);
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
        const keys = Object.keys(errorJurisdictionState);
        keys.forEach((field) => {
            if (field === "jurisdictionCode" && isEmpty(jurisdictionState[field])) {
                handleErrorJurisdictionState(field, true);
                isError = true;
            } else if (field === "description" && isEmpty(jurisdictionState[field])) {
                handleErrorJurisdictionState(field, true);
                isError = true;
            } else if (field === "jurisdictionType" && isEmpty(jurisdictionState[field])) {
                handleErrorJurisdictionState(field, true);
                isError = true;
            } else {
                handleErrorJurisdictionState(field, false);
            }
        });
        return !isError;
    };

    async function handleSave() {
        if (!validation()) return;
        const isUpdate = !!jurisdictionState?.ID;
        const payload = {
            MultiAgency_Name: jurisdictionState?.MultiAgency_Name,
            AgencyID: jurisdictionState?.agencyCode,
            JurisdictionID: isUpdate ? jurisdictionState?.ID : undefined,
            JurisdictionCode: jurisdictionState?.jurisdictionCode,
            Name: jurisdictionState?.description,
            Type: jurisdictionState?.jurisdictionType,
            PriorityID: jurisdictionState?.priorityCode,
            HoursOfOperationFrom: jurisdictionState?.fromTime,
            HoursOfOperationTo: jurisdictionState?.toTime,
            CreatedByUserFK: isUpdate ? undefined : loginPinID,
            ModifiedByUserFK: isUpdate ? loginPinID : undefined,
            IsActive: jurisdictionState?.IsActive ? 1 : 0,
        }
        let response;
        if (isUpdate) {
            response = await MasterTableListServices.updateJurisdiction(payload);
        } else {
            response = await MasterTableListServices.insertJurisdiction(payload);
        }
        if (response?.status === 200) {
            toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
            handleClose();
            refetch();
        }
    }

    function handelSetEditData(data) {
        const val = { JurisdictionID: data?.ID, AgencyID: loginAgencyID, }
        fetchPostData('/CAD/MasterJurisdiction/GetSingleDataJurisdiction', val).then((res) => {
            if (res) {
                const fromTime = new Date(res[0]?.HoursOfOperationFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const toTime = new Date(res[0]?.HoursOfOperationTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setJurisdictionState({
                    ID: res[0]?.ID,
                    agencyCode: res[0]?.AgencyID,
                    MultiAgency_Name: res[0]?.MultiAgency_Name,
                    fromTime: fromTime,  // Set from time
                    priorityCode: res[0]?.PriorityID,
                    jurisdictionCode: res[0]?.JurisdictionCode,
                    jurisdictionType: res[0]?.Type,
                    description: res[0]?.Name,
                    toTime: toTime,      // Set to time
                    IsActive: res[0]?.IsActive,
                });

                setMultiSelected({
                    optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency) : '',
                });
            } else {
                setJurisdictionState({});
            }
        })
    }


    const conditionalRowStyles = [
        {
            when: row => row?.ID === jurisdictionState?.ID,
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
            setJurisdictionState({
                ...jurisdictionState,
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
                                            <div className="col-8">
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
                                                    Jurisdiction Code
                                                    {errorJurisdictionState.jurisdictionCode && isEmpty(jurisdictionState?.jurisdictionCode) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Jurisdiction Code"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <input
                                                    name="JurisdictionCode"
                                                    type="text"
                                                    className="form-control py-1 new-input requiredColor"
                                                    placeholder='Jurisdiction Code'
                                                    value={jurisdictionState?.jurisdictionCode}
                                                    onChange={(e) => { handleJurisdictionState("jurisdictionCode", e.target.value); setIsChange(true); }}
                                                />
                                            </div>
                                            <div className="col-2 d-flex align-self-center justify-content-end">
                                                <label htmlFor="" className="tab-form-label">
                                                    Description
                                                    {errorJurisdictionState.description && isEmpty(jurisdictionState?.description) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-4 d-flex align-self-center justify-content-end">
                                                <input
                                                    name="Description"
                                                    type="text"
                                                    className="form-control py-1 new-input requiredColor"
                                                    placeholder='Description'
                                                    value={jurisdictionState?.description}
                                                    onChange={(e) => {
                                                        handleJurisdictionState("description", e.target.value);
                                                        setIsChange(true);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">

                                            <div className="col-2 d-flex align-self-start justify-content-end">
                                                <label for="" className="tab-form-label" style={{ marginTop: "6px" }}>
                                                    Jurisdiction Type{errorJurisdictionState.jurisdictionType && isEmpty(jurisdictionState.jurisdictionType) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Jurisdiction Type"}</p>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="col-2 d-flex align-self-start justify-content-end">
                                                <input
                                                    name="JurisdictionType"
                                                    type="text"
                                                    className="form-control py-1 new-input requiredColor"
                                                    placeholder='Jurisdiction Type'
                                                    value={jurisdictionState?.jurisdictionType}
                                                    onChange={(e) => {
                                                        handleJurisdictionState("jurisdictionType", e.target.value);
                                                        setIsChange(true);
                                                    }}
                                                />
                                            </div>
                                            <div className="col-1 d-flex align-self-start justify-content-end">
                                                <label for="" className="tab-form-label" style={{ marginTop: "6px" }}>
                                                    Priority Code
                                                </label>
                                            </div>
                                            <div className="col-2 d-flex align-self-start justify-content-end">
                                                <Select
                                                    isClearable
                                                    options={PriorityDrpData}
                                                    placeholder="Select..."
                                                    styles={colorLessStyle_Select}
                                                    getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                                    getOptionValue={(v) => v?.PriorityCode}
                                                    formatOptionLabel={(option, { context }) => {
                                                        return context === 'menu'
                                                            ? `${option?.PriorityCode} | ${option?.Description}`
                                                            : option?.PriorityCode;
                                                    }}
                                                    className="w-100"
                                                    name="priorityCode"
                                                    value={jurisdictionState.priorityCode ? PriorityDrpData?.find((item) => item?.PriorityID === jurisdictionState.priorityCode) : ""}
                                                    onChange={(e) => { handleJurisdictionState("priorityCode", e?.PriorityID); setIsChange(true); }}
                                                    onInputChange={(inputValue, actionMeta) => {
                                                        if (inputValue.length > 12) {
                                                            return inputValue.slice(0, 12);
                                                        }
                                                        return inputValue;
                                                    }}
                                                />
                                            </div>
                                            <div className="col-1 d-flex align-self-start justify-content-end">
                                                <label for="" className="tab-form-label" style={{ marginTop: "10px" }}>
                                                    Hours of Operation
                                                </label>
                                            </div>
                                            <div className="col-2 d-flex align-self-start justify-content-end">
                                                <DatePicker
                                                    name='fromTime'
                                                    id='fromTime'
                                                    selected={jurisdictionState?.fromTime ? new Date().setHours(jurisdictionState?.fromTime.split(':')[0], jurisdictionState?.fromTime.split(':')[1]) : null}
                                                    onChange={(time) => {
                                                        if (time) {
                                                            // Extract hours and minutes from the time string and set it using the current date
                                                            const timeOnly = `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
                                                            handleJurisdictionState("fromTime", timeOnly);  // Set only time
                                                            setIsChange(true);
                                                        }
                                                    }}
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeFormat="HH:mm"
                                                    timeIntervals={1}
                                                    dateFormat="HH:mm"
                                                    placeholderText="From Time"
                                                    autoComplete="off"
                                                />

                                                <DatePicker
                                                    name='toTime'
                                                    id='toTime'
                                                    selected={jurisdictionState?.toTime ? new Date().setHours(jurisdictionState?.toTime.split(':')[0], jurisdictionState?.toTime.split(':')[1]) : null}
                                                    onChange={(time) => {
                                                        if (time) {
                                                            // Extract hours and minutes from the time string and set it using the current date
                                                            const timeOnly = `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
                                                            handleJurisdictionState("toTime", timeOnly);  // Set only time
                                                            setIsChange(true);
                                                        }
                                                    }}
                                                    className='ml-2'
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeFormat="HH:mm"
                                                    timeIntervals={1} // Time interval in minutes (e.g., every 15 minutes)
                                                    dateFormat="HH:mm"
                                                    placeholderText="To Time"
                                                    autoComplete="off"
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
                                    const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'JurisdictionCode', 'Description')
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
                                    const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'JurisdictionCode', 'Description')
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
                                    {effectiveScreenPermission.AddOK && !jurisdictionState?.badgesID ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={!isChange}
                                            onClick={() => handleSave()}
                                        >
                                            Save
                                        </button>
                                    ) : effectiveScreenPermission.ChangeOK && !!jurisdictionState?.badgesID ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={!isChange}
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

export default Jurisdiction