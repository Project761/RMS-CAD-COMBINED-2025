import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from "react-select";
import Dropdown from 'react-bootstrap/Dropdown';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import { coloredStyle_Select } from '../../Utility/CustomStylesForReact';
import '../section.css';
import useObjState from '../../../CADHook/useObjState';
import MasterTableListServices from '../../../CADServices/APIs/masterTableList'
import { useQuery } from 'react-query';
import { dropDownDataModel, isEmpty, compareStrings } from '../../../CADUtils/functions/common';
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { useSelector, useDispatch } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { getData_DropDown_Zone } from '../../../CADRedux/actions/DropDownsData';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

const StationCodeSection = () => {
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterListData, setFilterListData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [listData, setListData] = useState([]);
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [zoneDropDown, setZoneDropDown] = useState([])
  const [isActive, setIsActive] = useState('');
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [loginPinID, setLoginPinID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    stationCodeState,
    setStationCodeState,
    handleStationCodeState,
    clearStationCodeState,
  ] = useObjState({
    agencyCode: "",
    stationCode: "",
    description: "",
    zoneCode: "",
    isActive: true,
    MultiAgency_Name: "",
    cfsLaw: false,
    cfsFire: false,
    cfsEmergencyMedicalService: false,
    cfsOther: false,
  })

  const [
    errorStationState,
    ,
    handleErrorStationState,
    clearStateStationState,
  ] = useObjState({
    stationCode: false,
    description: false,
    zoneCode: false,
    agencyTypes: false,
  });

  const getAgencyCodeKey = `/CAD/MasterAgency/MasterAgencyCode`;
  const { data: agencyCodeData, isSuccess: isFetchAgencyCodeData } = useQuery(
    [getAgencyCodeKey, {},],
    MasterTableListServices.getAgencyCode,
    {
      refetchOnWindowFocus: false,
    }
  );

  function handleClose() {
    setMultiSelected({
      optionSelected: null
    });
    clearStateStationState();
    clearStationCodeState();
    setIsChange(false);
  }

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
      setIsSuperAdmin(localStoreData?.IsSuperadmin);
      if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
    }
  }, [localStoreData]);

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

  const stationCodeKey = `/CAD/MasterStationCode/GetData_StationCode/${parseInt(pageStatus)}`;
  const { data: stationCodeData, isSuccess: isFetchStationCode, refetch, isError: isNoData, isFetched } = useQuery(
    [stationCodeKey, {
      IsActive: pageStatus,
      AgencyID: loginAgencyID,
      IsSuperAdmin: isSuperAdmin,
      PINID: loginPinID,
    },],
    MasterTableListServices.getStationCode,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );

  useEffect(() => {
    if (isFetchStationCode && stationCodeData && isFetched) {
      const data = JSON.parse(stationCodeData?.data?.data);
      setFilterListData(data?.Table)
      setListData(data?.Table)
      setEffectiveScreenPermission(data?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [isFetchStationCode, stationCodeData, isFetched])

  useEffect(() => {
    if (ZoneDrpData) {
      setZoneDropDown(dropDownDataModel(ZoneDrpData, "ZoneID", "ZoneDescription"));
    }
  }, [ZoneDrpData]);

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


  const validateHandel = () => {
    let isError = false;
    const keys = Object.keys(errorStationState);
    keys.map((field) => {
      if (field === "stationCode" && isEmpty(stationCodeState[field])) {
        handleErrorStationState(field, true);
        isError = true;
      } else if (field === "description" && isEmpty(stationCodeState[field])) {
        handleErrorStationState(field, true);
        isError = true;
      } else if (field === "agencyTypes" && (stationCodeState.cfsLaw === false && stationCodeState.cfsFire === false && stationCodeState.cfsEmergencyMedicalService === false && stationCodeState.cfsOther === false)) {
        handleErrorStationState(field, true);
        isError = true;
      } else if (field === "zoneCode" && isEmpty(stationCodeState[field])) {
        handleErrorStationState(field, true);
        isError = true;
      } else {
        handleErrorStationState(field, false);
      }
      return null;
    });
    return !isError;
  };

  async function handelActiveInactive() {
    const data = {
      StationID: activeInactiveData?.stationID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeStatusStationCode(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      refetch();
    }
    setShowModal(false);
  }

  async function handleSave() {
    if (!validateHandel()) return;
    setIsDisabled(true);
    const isUpdate = Boolean(stationCodeState?.stationID);
    const result = listData?.find(item => {
      if (item.stationCode) {
        const code = stationCodeState?.stationCode?.toLowerCase();
        return code && item.stationCode.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.description) {
        const description = stationCodeState?.description?.toLowerCase();
        return description && item.description.toLowerCase() === description;
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
      const data = {
        stationID: isUpdate ? stationCodeState?.stationID : "",
        AgencyID: stationCodeState?.agencyCode || "",
        StationCode: stationCodeState?.stationCode || "",
        Description: stationCodeState?.description || "",
        ZoneID: stationCodeState?.zoneCode || "",
        isActive: stationCodeState?.isActive,
        CreatedByUserFK: isUpdate ? undefined : loginPinID,
        ModifiedByUserFK: isUpdate ? loginPinID : undefined,
        MultiAgency_Name: stationCodeState?.MultiAgency_Name,
        CFSL: stationCodeState?.cfsLaw ? 1 : 0,
        CFSF: stationCodeState?.cfsFire ? 1 : 0,
        CFSE: stationCodeState?.cfsEmergencyMedicalService ? 1 : 0,
        OTHER: stationCodeState?.cfsOther ? 1 : 0,
      };
      let response = null;
      if (isUpdate) {
        response = await MasterTableListServices.updateStationCode(data);
      } else {
        response = await MasterTableListServices.insertStationCode(data);
      }
      if (response?.status === 200) {
        toastifySuccess("Data Saved Successfully");
        handleClose();
        refetch();
      }
    }
    setIsDisabled(false);
  }

  const columns = [
    {
      name: 'Station Code',
      selector: row => row?.stationCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.stationCode, rowB.stationCode),
      style: {
        position: "static",
      },
    },
    {
      name: 'Description',
      selector: row => row?.Description,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.Description, rowB.Description),
      width: "50%",
      style: {
        position: "static",
      },
    },
    {
      name: 'Zone Code',
      selector: row => row.ZoneCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ZoneCode, rowB.ZoneCode),
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
              <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true" onClick={(e) => { setShowModal(true); setActiveInactiveData(row); setIsActive(false); setConfirmType("InActive") }}></i>
            ) : (
              <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true" onClick={(e) => { setShowModal(true); setActiveInactiveData(row); setIsActive(true); setConfirmType("Active"); }}></i>
            ) : <></> : <></>}
          </span>
        </div>,
      width: "70px",
      style: {
        position: "static",
      },
    },
  ];

  function handelSetEditData(data) {
    const val = { StationID: data?.stationID, AgencyID: loginAgencyID, }
    fetchPostData('/CAD/MasterStationCode/GetSingleData_StationCode', val).then((res) => {
      if (res) {
        setStationCodeState({
          agencyCode: res[0]?.AgencyID,
          MultiAgency_Name: res[0]?.MultiAgency_Name,
          stationCode: res[0]?.stationCode,
          description: res[0]?.Description,
          zoneCode: res[0]?.ZoneID,
          isActive: res[0]?.isActive,
          stationID: res[0]?.stationID,
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
      else { setStationCodeState({}) }
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.stationID === stationCodeState?.stationID,
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
      setStationCodeState({
        ...stationCodeState,
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
                <span className={`nav-item ${pageStatus === true ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(true); setSearchValue1(""); setSearchValue2(""); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === true ? 'Red' : '' }}>Active</span>
                <span className={`nav-item ${pageStatus === false ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(false); setSearchValue1(""); setSearchValue2(""); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === false ? 'Red' : '' }}>InActive</span>
              </ul>
            </div>
            {
              pageStatus ?
                <>
                  <div className='utilities-tab-content-form-main'>
                    {/* line 1 */}
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
                    {/* line 2 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Station Code{errorStationState.stationCode && isEmpty(stationCodeState.stationCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Station Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Station Code'
                          onKeyDown={handleSpecialKeyDown}
                          maxLength={10}
                          value={stationCodeState.stationCode}
                          onChange={(e) => { handleStationCodeState("stationCode", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Description{errorStationState.description && isEmpty(stationCodeState.description) && (
                            <p className='text-nowrap' style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-3 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Description'
                          value={stationCodeState.description}
                          onChange={(e) => { handleStationCodeState("description", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Zone Code{errorStationState.zoneCode && isEmpty(stationCodeState.zoneCode) && (
                            <p className='text-nowrap' style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Zone Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <Select
                          styles={coloredStyle_Select}
                          placeholder="Select"
                          options={zoneDropDown}
                          isClearable
                          value={stationCodeState?.zoneCode ? zoneDropDown?.find((i) => i?.value === stationCodeState?.zoneCode) : ""}
                          onChange={(e) => { handleStationCodeState("zoneCode", e?.value); setIsChange(true); }}
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
                          Required Agency Types{errorStationState.agencyTypes && stationCodeState.cfsLaw === false && stationCodeState.cfsFire === false && stationCodeState.cfsEmergencyMedicalService === false && stationCodeState.cfsOther === false && (
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
                              checked={stationCodeState.cfsLaw}
                              onChange={(e) => { handleStationCodeState("cfsLaw", e.target.checked); setIsChange(true); }}
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
                              checked={stationCodeState.cfsFire}
                              onChange={(e) => { handleStationCodeState("cfsFire", e.target.checked); setIsChange(true); }}
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
                              checked={stationCodeState.cfsEmergencyMedicalService}
                              onChange={(e) => { handleStationCodeState("cfsEmergencyMedicalService", e.target.checked); setIsChange(true); }}
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
                              checked={stationCodeState.cfsOther}
                              onChange={(e) => { handleStationCodeState("cfsOther", e.target.checked); setIsChange(true); }}

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
                  </div>
                </>
                :
                <>
                </>
            }
          </div>

        </div>

        <div className='utilities-tab-content-table-container'>
          <div className="row">
            <div className="col-5 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="form-control"
                placeholder='Search By Code...'
                value={searchValue1}
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'stationCode', 'description')
                  setFilterListData(result)
                }}
              />
            </div>
            <div className="col-1 d-flex align-self-center justify-content-end">
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
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'stationCode', 'description')
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
              pagination
              responsive
              conditionalRowStyles={conditionalRowStyles}
              fixedHeaderScrollHeight="360px"
              striped
              highlightOnHover
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              fixedHeader
              onRowClicked={(row) => {
                handelSetEditData(row);
              }}
            />
          </div>

          {pageStatus && <div className="utilities-tab-content-button-container" >
            <button type="button" className="btn btn-sm btn-success" onClick={() => handleClose()}>New</button>
            {effectiveScreenPermission && (
              <>
                {effectiveScreenPermission.AddOK && !stationCodeState?.stationID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => handleSave()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!stationCodeState?.stationID ? (
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
  );
};

export default StationCodeSection;