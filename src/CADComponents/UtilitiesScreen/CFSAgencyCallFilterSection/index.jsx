import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Select from "react-select";
import Dropdown from 'react-bootstrap/Dropdown';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import { coloredStyle_Select } from '../../Utility/CustomStylesForReact';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import '../section.css';
import useObjState from '../../../CADHook/useObjState';
import { useQuery } from 'react-query';
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { useSelector } from 'react-redux';
import { isEmpty, compareStrings } from '../../../CADUtils/functions/common';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

const CFSAgencyCallFilterSection = () => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [csfDropDown, setCsfDropDown] = useState([])
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [searchValue1, setSearchValue1] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [searchValue2, setSearchValue2] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [confirmType, setConfirmType] = useState('');
  const [isActive, setIsActive] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [loginPinID, setLoginPinID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })
  const [isDisabled, setIsDisabled] = useState(false);
  const [
    agencyCallState,
    setAgencyCallState,
    handleAgencyCallState,
    clearAgencyCallState,
  ] = useObjState({
    serviceCode: "",
    description: "",
    law: false,
    fire: false,
    ems: false,
    other: false,
    agencyCode: "",
    MultiAgency_Name: "",
    IsActive: true
  })
  const [
    errorAgencyCallState,
    ,
    handleErrorAgencyCallState,
    clearStateAgencyCallState,
  ] = useObjState({
    serviceCode: false,
    description: false,
    agencyType: false,
  });

  const GetResourceTypeKey = `/CAD/MasterCallforServiceCode/InsertCallforServiceCode`;
  const { data: getCFSData, isSuccess: isFetchCFSData } = useQuery(
    [GetResourceTypeKey, { Action: "GetData_DropDown_CallforService", AgencyID: loginAgencyID, },],
    MasterTableListServices.getCFS,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID, // Only fetch if loginAgencyID is available
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
    if (getCFSData && isFetchCFSData) {
      const data = JSON.parse(getCFSData?.data?.data);
      setCsfDropDown(data?.Table)
    }
  }, [getCFSData, isFetchCFSData])

  const getAgencyCodeKey = `/CAD/MasterAgency/MasterAgencyCode`;
  const { data: agencyCodeData, isSuccess: isFetchAgencyCodeData } = useQuery(
    [getAgencyCodeKey, {},],
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
    if (isFetchAgencyCodeData && agencyCodeData) {
      const data = JSON.parse(agencyCodeData?.data?.data);
      setAgencyCodeDropDown(changeArrayFormat(data?.Table) || [])
    }
  }, [isFetchAgencyCodeData, agencyCodeData]);

  const getCFSAgencyCallFilterKey = `/CAD/MasterCFSagencycallfilter/GET_CFSagencycallfilter`;
  const { data: CFSAgencyCallFilterData, isSuccess: isFetchCFSAgencyCallFilter, refetch, isError: isNoData } = useQuery(
    [getCFSAgencyCallFilterKey, { IsActive: pageStatus, AgencyID: loginAgencyID, PINID: loginPinID, IsSuperAdmin: isSuperAdmin }],
    MasterTableListServices.getCFSAgencyCallFilter,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginPinID && !!loginAgencyID,
    }
  );

  useEffect(() => {
    if (isFetchCFSAgencyCallFilter && CFSAgencyCallFilterData) {
      const data = JSON.parse(CFSAgencyCallFilterData?.data?.data);
      setFilterListData(data?.Table)
      setListData(data?.Table)
      setEffectiveScreenPermission(data?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [CFSAgencyCallFilterData, isFetchCFSAgencyCallFilter])

  async function handelActiveInactive() {
    const data = {
      CadeCFSAgencyID: activeInactiveData?.CadeCFSagencyID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeStatusAgencyCallFilter(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      refetch();
    }
    setShowModal(false);
  }

  const columns = [
    {
      name: 'CFS Code',
      selector: row => csfDropDown?.find((i) => i?.CallforServiceID === row?.CallforServiceID)?.CFSCODE || "",
      sortable: true,
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
      name: 'Agency Type',
      selector: row => {
        let result = [];
        if (row?.LAW === true) result.push("L");
        if (row?.FIRE === true) result.push("F");
        if (row?.EMERGENCYMEDICALSERVICE === true) result.push("E");
        if (row?.OTHER === true) result.push("O");
        return result.join(", ") || "";
      },
      sortable: true,
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

  function handelCancel() {
    clearAgencyCallState();
    clearStateAgencyCallState();
    setMultiSelected({
      optionSelected: null
    });
    setIsChange(false);
  }

  const validateForm = () => {
    let isError = false;
    const keys = Object.keys(errorAgencyCallState);
    keys.map((field) => {
      if (
        field === "serviceCode" &&
        isEmpty(agencyCallState[field])) {
        handleErrorAgencyCallState(field, true);
        isError = true;
      } else if (field === "description" && isEmpty(agencyCallState[field])) {
        handleErrorAgencyCallState(field, true);
        isError = true;
      } else if (field === "agencyType" && (agencyCallState.law === false && agencyCallState.fire === false && agencyCallState.ems === false && agencyCallState.other === false)) {
        handleErrorAgencyCallState(field, true);
        isError = true;
      } else {
        handleErrorAgencyCallState(field, false);
      }
      return null;
    });
    return !isError;
  };

  async function handelSave() {
    if (!validateForm()) return
    const isUpdate = Boolean(agencyCallState?.CallforServiceID);
    setIsDisabled(true);

    const result = listData?.find(item => {
      if (item.CallforServiceID) {
        const code = agencyCallState?.serviceCode;
        return code && item.CallforServiceID === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.Description) {
        const description = agencyCallState?.description?.toLowerCase();
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
      const data = {
        CadeCFSagencyID: isUpdate ? agencyCallState?.CallforServiceID : undefined, // Only include for update
        CallforServiceID: agencyCallState?.serviceCode,
        Description: agencyCallState?.description,
        LAW: agencyCallState?.law ? 1 : 0,
        FIRE: agencyCallState?.fire ? 1 : 0,
        EMERGENCYMEDICALSERVICE: agencyCallState?.ems ? 1 : 0,
        AgencyID: agencyCallState?.agencyCode,
        IsActive: agencyCallState?.IsActive,
        OTHER: agencyCallState?.other ? 1 : 0,
        CreatedByUserFK: isUpdate ? undefined : loginPinID,
        ModifiedByUserFK: isUpdate ? loginPinID : undefined,
        MultiAgency_Name: agencyCallState?.MultiAgency_Name,
      };

      let response;
      if (isUpdate) {
        response = await MasterTableListServices.updateCFSagencycallfilter(data);
      } else {
        response = await MasterTableListServices.insertCFSAgencyCallFilter(data);
      }

      if (response?.status === 200) {
        toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
        handelCancel();
        refetch();
      }
      handelCancel()
      setIsDisabled(false);
    }
  }

  function handelSetEditData(data) {
    const val = { CadeCFSAgencyID: data?.CadeCFSagencyID, AgencyID: loginAgencyID };
    fetchPostData('/CAD/MasterCFSagencycallfilter/GetSingleDataCFSagencycallfilter', val).then((res) => {
      if (res) {
        setAgencyCallState({
          CallforServiceID: res[0]?.CadeCFSagencyID,
          serviceCode: res[0]?.CallforServiceID,
          description: res[0]?.Description,
          law: res[0]?.LAW,
          fire: res[0]?.FIRE,
          ems: res[0]?.EMERGENCYMEDICALSERVICE,
          law: res[0]?.LAW,
          agencyCode: res[0]?.AgencyID,
          IsActive: res[0]?.IsActive,
          MultiAgency_Name: res[0]?.MultiAgency_Name
        })
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setAgencyCallState({}) }
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.CadeCFSagencyID === agencyCallState?.CallforServiceID,
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
      setAgencyCallState({
        ...agencyCallState,
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
                          Call For Service Code{errorAgencyCallState.serviceCode && isEmpty(agencyCallState.serviceCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Service Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-3 d-flex align-self-center justify-content-end">
                        <Select
                          styles={coloredStyle_Select}
                          placeholder="Select"
                          options={csfDropDown}
                          isClearable
                          getOptionLabel={(v) => `${v?.CFSCODE} | ${v?.CFSCodeDescription}`}
                          getOptionValue={(v) => v?.CallforServiceID}
                          value={agencyCallState.serviceCode ? csfDropDown?.find((i) => i?.CallforServiceID === agencyCallState.serviceCode) : ""}
                          formatOptionLabel={(option, { context }) => {
                            return context === 'menu'
                              ? `${option?.CFSCODE} | ${option?.CFSCodeDescription}`
                              : option?.CFSCODE;
                          }}
                          onChange={(e) => { handleAgencyCallState("serviceCode", e?.CallforServiceID); handleAgencyCallState("description", e.CFSCodeDescription || ""); setIsChange(true); }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Description{errorAgencyCallState.description && isEmpty(agencyCallState.description) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-4 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Description'
                          value={agencyCallState.description}
                          onChange={(e) => { handleAgencyCallState("description", e.target.value); setIsChange(true); }}
                        />
                      </div>
                    </div>
                    {/* line 2 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-start justify-content-end">
                        <label for="" className="tab-form-label" style={{ marginTop: "10px" }}>
                          Required Agency Types{errorAgencyCallState.agencyType && agencyCallState.law === false && agencyCallState.fire === false && agencyCallState.ems === false && agencyCallState.other === false && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Agency Type"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-7 d-flex align-self-center justify-content-end">
                        <div className='agency-types-checkbox-container'>
                          {/* L : Law */}
                          <div className="agency-checkbox-item">
                            <input type="checkbox" checked={agencyCallState.law} onChange={(e) => { handleAgencyCallState("law", e.target.checked); setIsChange(true); }} />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>L</span>
                              <span>|</span>
                              <span>Law</span>
                            </div>
                          </div>
                          {/* F : Fire */}
                          <div className="agency-checkbox-item">
                            <input type="checkbox" checked={agencyCallState.fire} onChange={(e) => { handleAgencyCallState("fire", e.target.checked); setIsChange(true); }} />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>F</span>
                              <span>|</span>
                              <span>Fire</span>
                            </div>
                          </div>
                          {/* E : Emergency Medical Service */}
                          <div className="agency-checkbox-item">
                            <input type="checkbox" checked={agencyCallState.ems} onChange={(e) => { handleAgencyCallState("ems", e.target.checked); setIsChange(true); }} />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>E</span>
                              <span>|</span>
                              <span>Emergency Medical Service </span>
                            </div>
                          </div>
                          {/* O : Law */}
                          <div className="agency-checkbox-item">
                            <input type="checkbox" checked={agencyCallState.other} onChange={(e) => { handleAgencyCallState("other", e.target.checked); setIsChange(true); }} />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>O</span>
                              <span>|</span>
                              <span>Other</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* line 3 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-start justify-content-end">
                        <label for="" className="tab-form-label" style={{ marginTop: "10px" }}>
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
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'CallforServiceID', 'Description')
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
                value={searchValue2}
                placeholder='Search By Description...'
                onChange={(e) => {
                  setSearchValue2(e.target.value);
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'CallforServiceID', 'Description')
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
              persistTableHead={true}
              conditionalRowStyles={conditionalRowStyles}
              striped
              highlightOnHover
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              fixedHeader
              fixedHeaderScrollHeight="360px"
              onRowClicked={(row) => {
                handelSetEditData(row);
              }}
            />
          </div>
          {pageStatus &&
            <div className="utilities-tab-content-button-container" >
              <button type="button" className="btn btn-sm btn-success" onClick={() => handelCancel()}>New</button>
              {effectiveScreenPermission && (
                <>
                  {effectiveScreenPermission.AddOK && !agencyCallState?.CallforServiceID ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      disabled={!isChange}
                      onClick={() => handelSave()}
                    >
                      Save
                    </button>
                  ) : effectiveScreenPermission.ChangeOK && !!agencyCallState?.CallforServiceID ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      disabled={!isChange || isDisabled}
                      onClick={() => handelSave()}
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

export default CFSAgencyCallFilterSection;