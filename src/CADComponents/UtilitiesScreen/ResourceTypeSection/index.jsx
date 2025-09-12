import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import DataTable from 'react-data-table-component';
import '../section.css';
import useObjState from '../../../CADHook/useObjState';
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { isEmpty, compareStrings } from '../../../CADUtils/functions/common';
import { useSelector } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

const ResourceTypeSection = () => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [searchValue1, setSearchValue1] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [searchValue2, setSearchValue2] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [showModal, setShowModal] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    resourceTypeState,
    setResourceTypeState,
    handleResourceTypeState,
    clearResourceTypeState,
  ] = useObjState({
    id: "",
    typeCode: "",
    description: "",
    law: false,
    fire: false,
    ems: false,
    other: false,
    isActive: true,
    agencyCode: "",
    MultiAgency_Name: "",
  });

  const [
    errorResourceTypeState,
    ,
    handleErrorResourceTypeState,
    clearStateResourceTypeState,
  ] = useObjState({
    typeCode: false,
    description: false,
    agencyType: false,
  });

  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })

  const columns = [
    {
      name: 'Unit Type Code',
      selector: row => row?.ResourceTypeCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceTypeCode, rowB.ResourceTypeCode),
      style: {
        position: "static",
      },
    },
    {
      name: 'Description',
      selector: row => row?.Description,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.Description, rowB.Description),
      width: "60%",
      style: {
        position: "static",
      },
    },
    {
      name: 'Agency Type',
      selector: row => {
        let result = [];
        if (row?.law === 1) result.push("L");
        if (row?.fire === 1) result.push("F");
        if (row?.emergencymedicalservice === 1) result.push("E");
        if (row?.Other === 1) result.push("O");
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

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
      setIsSuperAdmin(localStoreData?.IsSuperadmin);
    }
  }, [localStoreData]);

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

  const GetResourceTypeKey = `/CAD/MasterResourceType/GetData_ResourcesType/${loginAgencyID}/${pageStatus}/${isSuperAdmin}/${loginPinID}`;
  const { data: resourceTypeData, isSuccess: isFetchResourceType, refetch, isError: isNoData } = useQuery(
    [GetResourceTypeKey, {
      IsActive: pageStatus,
      AgencyID: loginAgencyID,
      IsSuperAdmin: isSuperAdmin,
      PINID: loginPinID,
    },],
    MasterTableListServices.getResourceType,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );

  useEffect(() => {
    if (isFetchResourceType && resourceTypeData) {
      setFilterListData(resourceTypeData?.data?.data?.Table)
      setListData(resourceTypeData?.data?.data?.Table)
      setEffectiveScreenPermission(resourceTypeData?.data?.data?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [resourceTypeData, isFetchResourceType])

  function handelSetEditData(data) {
    const val = { ResourceTypeID: data?.ResourceTypeID, AgencyID: loginAgencyID, }
    fetchPostData('/CAD/MasterResourceType/GetSingleData_ResourceType', val).then((res) => {
      if (res) {
        setResourceTypeState({
          id: res[0]?.ResourceTypeID,
          agencyCode: res[0]?.AgencyID,
          MultiAgency_Name: res[0]?.MultiAgency_Name,
          isActive: res[0]?.IsActive,
          typeCode: res[0]?.ResourceTypeCode || "",
          description: res[0]?.description || "",
          law: res[0]?.law === '1' ? true : false,
          fire: res[0]?.fire === '1' ? true : false,
          ems: res[0]?.emergencymedicalservice === '1' ? true : false,
          other: res[0]?.Other === '1' ? true : false,
        })
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setResourceTypeState({}) }
    })
  }

  function handelCancel() {
    clearStateResourceTypeState();
    clearResourceTypeState();
    setIsChange(false);
    setMultiSelected({
      optionSelected: null
    });
  }

  async function handelActiveInactive() {
    const data = {
      ResourceTypeID: activeInactiveData?.ResourceTypeID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeStatusResourceType(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      refetch();
    }
    setShowModal(false);
  }

  const validateResourceTypeForm = () => {
    let isError = false;
    const keys = Object.keys(errorResourceTypeState);
    keys.map((field) => {
      if (
        field === "typeCode" &&
        isEmpty(resourceTypeState[field])) {
        handleErrorResourceTypeState(field, true);
        isError = true;
      } else if (field === "description" && isEmpty(resourceTypeState[field])) {
        handleErrorResourceTypeState(field, true);
        isError = true;
      } else if (field === "agencyType" && (resourceTypeState.law === false && resourceTypeState.fire === false && resourceTypeState.ems === false && resourceTypeState.other === false)) {
        handleErrorResourceTypeState(field, true);
        isError = true;
      } else {
        handleErrorResourceTypeState(field, false);
      }
      return null;
    });
    return !isError;
  };

  async function handleSave() {
    if (!validateResourceTypeForm()) return
    setIsDisabled(true);
    const isUpdate = resourceTypeState?.id ? true : false;
    const result = listData?.find(item => {
      if (item.ResourceTypeCode) {
        const code = resourceTypeState?.typeCode?.toLowerCase();
        return code && item.ResourceTypeCode.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.description) {
        const description = resourceTypeState?.description?.toLowerCase();
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
        ResourceTypeID: resourceTypeState?.id || undefined,
        ResourceTypeCode: resourceTypeState?.typeCode,
        description: resourceTypeState?.description,
        law: resourceTypeState?.law ? 1 : 0,
        fire: resourceTypeState?.fire ? 1 : 0,
        emergencymedicalservice: resourceTypeState?.ems ? 1 : 0,
        Other: resourceTypeState?.other ? 1 : 0,
        isActive: resourceTypeState?.isActive,
        CreatedByUserFK: isUpdate ? undefined : loginPinID,
        ModifiedByUserFK: isUpdate ? loginPinID : undefined,
        AgencyID: resourceTypeState?.agencyCode,
        MultiAgency_Name: resourceTypeState?.MultiAgency_Name,
      };
      try {
        let response;
        if (isUpdate) {
          response = await MasterTableListServices.updateResourceType(data);
        } else {
          response = await MasterTableListServices.insertResourceType(data);
        }

        if (response?.status === 200) {
          toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
          handelCancel();
          refetch();
        }
      } catch (error) {
        console.error("Error saving resource type:", error);
      }
    }
    setIsDisabled(false);
  }

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

  const conditionalRowStyles = [
    {
      when: row => row?.ResourceTypeID === resourceTypeState?.id,
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
      setResourceTypeState({
        ...resourceTypeState,
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
                          Unit Type Code{errorResourceTypeState.typeCode && isEmpty(resourceTypeState.typeCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Unit Type Code'
                          maxLength={10}
                          onKeyDown={handleSpecialKeyDown}
                          value={resourceTypeState.typeCode}
                          onChange={(e) => { handleResourceTypeState("typeCode", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Description{errorResourceTypeState.description && isEmpty(resourceTypeState.description) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-4 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Description'
                          value={resourceTypeState.description}
                          onChange={(e) => { handleResourceTypeState("description", e.target.value); setIsChange(true); }}
                        />
                      </div>
                    </div>

                    {/* line 2 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-start justify-content-end">
                        <label for="" className="tab-form-label" style={{ marginTop: "10px" }}>
                          Required Agency Types{errorResourceTypeState.agencyType && resourceTypeState.law === false && resourceTypeState.fire === false && resourceTypeState.ems === false && resourceTypeState.other === false && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Agency Type"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-7 d-flex align-self-center justify-content-end">
                        <div className='agency-types-checkbox-container'>
                          {/* L : Law */}
                          <div className="agency-checkbox-item">
                            <input type="checkbox" checked={resourceTypeState.law} onChange={(e) => { handleResourceTypeState("law", e.target.checked); setIsChange(true); }} />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>L</span>
                              <span>|</span>
                              <span>Law</span>
                            </div>
                          </div>
                          {/* F : Fire */}
                          <div className="agency-checkbox-item">
                            <input type="checkbox" checked={resourceTypeState.fire} onChange={(e) => { handleResourceTypeState("fire", e.target.checked); setIsChange(true); }} />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>F</span>
                              <span>|</span>
                              <span>Fire</span>
                            </div>
                          </div>
                          {/* E : Emergency Medical Service */}
                          <div className="agency-checkbox-item">
                            <input type="checkbox" checked={resourceTypeState.ems} onChange={(e) => { handleResourceTypeState("ems", e.target.checked); setIsChange(true); }} />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>E</span>
                              <span>|</span>
                              <span>Emergency Medical Service </span>
                            </div>
                          </div>
                          {/* O : Law */}
                          <div className="agency-checkbox-item">
                            <input type="checkbox" checked={resourceTypeState.other} onChange={(e) => { handleResourceTypeState("other", e.target.checked); setIsChange(true); }} />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>O</span>
                              <span>|</span>
                              <span>other</span>
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
            }
          </div>

        </div>

        <div className='utilities-tab-content-table-container'>
          <div className="row">
            <div className="col-5 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="form-control"
                value={searchValue1}
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'ResourceTypeCode', 'description')
                  setFilterListData(result)
                }}
                placeholder='Search By Code...'
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
                  const result = SearchFilter(listData, searchValue1, searchValue2, filterTypeDescOption, 'ResourceTypeCode', 'description')
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
          {isFetchResourceType &&
            <div className="table-responsive">
              <DataTable
                dense
                columns={columns}
                data={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? filterListData : '' : ''}
                customStyles={tableCustomStyles}
                conditionalRowStyles={conditionalRowStyles}
                pagination
                fixedHeaderScrollHeight="360px"
                responsive
                striped
                highlightOnHover
                noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                fixedHeader
                onRowClicked={(row) => {
                  handelSetEditData(row);
                }}
              // fixedHeaderScrollHeight="200px" 
              />
            </div>}
          {pageStatus &&
            <div className="utilities-tab-content-button-container" >
              <button type="button" className="btn btn-sm btn-success" onClick={() => { handelCancel() }}>New</button>
              {effectiveScreenPermission && (
                <>
                  {effectiveScreenPermission.AddOK && !resourceTypeState?.id ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      disabled={!isChange}
                      onClick={() => handleSave()}
                    >
                      Save
                    </button>
                  ) : effectiveScreenPermission.ChangeOK && !!resourceTypeState?.id ? (
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

export default ResourceTypeSection;

