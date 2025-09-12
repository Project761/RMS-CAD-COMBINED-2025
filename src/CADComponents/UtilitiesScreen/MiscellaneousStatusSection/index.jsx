import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import { useQuery } from 'react-query';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import '../section.css';
import useObjState from '../../../CADHook/useObjState';
import MasterTableListServices from '../../../CADServices/APIs/masterTableList'
import { isEmpty, compareStrings } from '../../../CADUtils/functions/common';
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { useSelector } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

const MiscellaneousStatusSection = () => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterListData, setFilterListData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [listData, setListData] = useState([]);
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [isActive, setIsActive] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [showModal, setShowModal] = useState(false);
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [loginPinID, setLoginPinID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    miscellaneousStatusCode,
    setMiscellaneousStatusCode,
    handleMiscellaneousStatusCode,
    clearStateMiscellaneousStatusCode
    ,
  ] = useObjState({
    AgencyCode: "",
    lstMiscellaneousID: "",
    MiscellaneousStatusCode: "",
    Description: "",
    ResourceAvailableStatus: false,
    MultiAgency_Name: "",
    IsActive: true,
  })
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })

  const [
    errorMiscellaneousStatusCode,
    ,
    handleErrorMiscellaneousStatusCode,
    clearErrorMiscellaneousStatusCode,
  ] = useObjState({
    MiscellaneousStatusCode: false,
    Description: false,
  });

  const validateMiscellaneousStatusCodeForm = () => {
    let isError = false;
    const keys = Object.keys(errorMiscellaneousStatusCode);
    keys.map((field) => {
      if (
        field === "MiscellaneousStatusCode" &&
        isEmpty(miscellaneousStatusCode[field])) {
        handleErrorMiscellaneousStatusCode(field, true);
        isError = true;
      } else if (field === "Description" && isEmpty(miscellaneousStatusCode[field])) {
        handleErrorMiscellaneousStatusCode(field, true);
        isError = true;
      } else {
        handleErrorMiscellaneousStatusCode(field, false);
      }
      return null;
    });
    return !isError;
  };

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
    },
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

  const getMiscellaneousStatusListKey = `/CAD/MasterMiscellaneous/GetData_MiscellaneousStatus`;
  const { data: miscellaneousStatusList, isSuccess: isFetchMiscellaneousStatusList, refetch: miscellaneousStatusListRefetch, isError: isNoData } = useQuery(
    [getMiscellaneousStatusListKey, {
      Isactive: pageStatus,
      AgencyID: loginAgencyID,
      IsSuperAdmin: isSuperAdmin === "true" ? "1" : "0",
      PINID: loginPinID,
    }],
    MasterTableListServices.getMiscellaneousStatus,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );

  useEffect(() => {
    if (isFetchMiscellaneousStatusList && miscellaneousStatusList) {
      const res = JSON.parse(miscellaneousStatusList?.data?.data);
      const data = res?.Table
      setFilterListData(data || [])
      setListData(data || [])
      setEffectiveScreenPermission(res?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [isFetchMiscellaneousStatusList, miscellaneousStatusList])

  function handleClose() {
    clearStateMiscellaneousStatusCode();
    clearErrorMiscellaneousStatusCode();
    setMultiSelected({
      optionSelected: null
    });
    setIsChange(false);
  }

  const onSave = async () => {
    if (!validateMiscellaneousStatusCodeForm()) return
    const isUpdate = !!miscellaneousStatusCode?.lstMiscellaneousID;
    setIsDisabled(true);
    const result = listData?.find(item => {
      if (item.MiscellaneousStatusCode) {
        const code = miscellaneousStatusCode?.MiscellaneousStatusCode?.toLowerCase();
        return code && item.MiscellaneousStatusCode.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.Description) {
        const description = miscellaneousStatusCode?.Description?.toLowerCase();
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
        lstMiscellaneousID: isUpdate ? miscellaneousStatusCode?.lstMiscellaneousID : undefined,
        MiscellaneousStatusCode: miscellaneousStatusCode?.MiscellaneousStatusCode,
        Description: miscellaneousStatusCode?.Description,
        ResourceAvailableStatus: miscellaneousStatusCode?.ResourceAvailableStatus ? 'true' : 'false',
        CreatedByUserFK: isUpdate ? undefined : loginPinID,
        ModifiedByUserFK: isUpdate ? loginPinID : undefined,
        MultiAgency_Name: miscellaneousStatusCode?.MultiAgency_Name,
        AgencyID: miscellaneousStatusCode?.AgencyCode,
      }
      let response;
      if (isUpdate) {
        response = await MasterTableListServices.updateMiscellaneous(data);
      } else {
        response = await MasterTableListServices.insertMiscellaneous(data);
      }
      if (response?.status === 200) {
        toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
        handleClose()
        miscellaneousStatusListRefetch();
      }
    }
    setIsDisabled(false);
  };

  async function handelActiveInactive() {
    const data = {
      lstMiscellaneousID: activeInactiveData?.lstMiscellaneousID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeMiscellaneousStatus(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      miscellaneousStatusListRefetch();
    }
    setShowModal(false);
  }

  const setEditValue = (row) => {
    const val = { lstMiscellaneousID: row?.lstMiscellaneousID, AgencyID: loginAgencyID, }
    fetchPostData('CAD/MasterMiscellaneous/GetSingleData_MiscellaneousStatus', val).then((res) => {
      if (res) {
        setMiscellaneousStatusCode({
          lstMiscellaneousID: res[0]?.lstMiscellaneousID,
          AgencyCode: res[0]?.AgencyID,
          MultiAgency_Name: res[0]?.MultiAgency_Name,
          IsActive: res[0]?.IsActive,
          MiscellaneousStatusCode: res[0]?.MiscellaneousStatusCode,
          Description: res[0]?.Description,
          ResourceAvailableStatus: res[0]?.ResourceAvailableStatus,
        })
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setMiscellaneousStatusCode({}) }
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
      setMiscellaneousStatusCode({
        ...miscellaneousStatusCode,
        'AgencyCode': id.toString(), 'MultiAgency_Name': name.toString()
      })
    }
  }

  const conditionalRowStyles = [
    {
      when: row => row?.lstMiscellaneousID === miscellaneousStatusCode?.lstMiscellaneousID,
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

  const columns = [
    {
      name: 'Miscellaneous Status Code',
      selector: row => row.MiscellaneousStatusCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.MiscellaneousStatusCode, rowB.MiscellaneousStatusCode),
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
      name: 'Unit Available',
      selector: row => row.ResourceAvailableStatus ? "Yes" : "No",
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceAvailableStatus, rowB.ResourceAvailableStatus),
      style: {
        position: "static",
      },
    },
    {
      name: 'Agency Code',
      selector: row => agencyCodeDropDown.find(item => item.AgencyID === row.AgencyID)?.ShortName,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ZoneDescription, rowB.ZoneDescription),
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
                        <label htmlFor="" className="tab-form-label text-end">
                          Miscellaneous Status Code
                          {errorMiscellaneousStatusCode.MiscellaneousStatusCode && isEmpty(miscellaneousStatusCode.MiscellaneousStatusCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                              {"Select Miscellaneous Status Code"}
                            </p>
                          )}
                        </label>
                      </div>
                      <div className="col-3 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder="Miscellaneous Status Code"
                          name="cfsCodeDesc"
                          onKeyDown={handleSpecialKeyDown}
                          value={miscellaneousStatusCode.MiscellaneousStatusCode}
                          onChange={(e) => {
                            handleMiscellaneousStatusCode
                              ("MiscellaneousStatusCode", e.target.value); setIsChange(true);
                          }}
                          style={{ flex: '1' }}
                          maxLength={7}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Description{errorMiscellaneousStatusCode.Description && isEmpty(miscellaneousStatusCode.Description) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-4 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Description'
                          value={miscellaneousStatusCode.Description}
                          onChange={(e) => {
                            handleMiscellaneousStatusCode
                              ("Description", e.target.value); setIsChange(true);
                          }}
                          maxLength={255}
                        />
                      </div>
                    </div>
                    {/* line 3 */}
                    <div className="row">
                      <div className="col-5 offset-2 agency-checkbox-item">
                        <input
                          type="checkbox"
                          name="ResourceAvailableStatus"
                          checked={miscellaneousStatusCode.ResourceAvailableStatus}
                          onChange={(e) => { handleMiscellaneousStatusCode("ResourceAvailableStatus", e.target.checked); setIsChange(true); }}
                        />
                        <div className="agency-checkbox-text-container tab-form-label">
                          <span>Unit Available Status</span>
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
                value={searchValue1}
                placeholder='Search By Code...'
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'MiscellaneousStatusCode', 'Description')
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
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'MiscellaneousStatusCode', 'Description')
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
              striped
              highlightOnHover
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              fixedHeader
              conditionalRowStyles={conditionalRowStyles}
              fixedHeaderScrollHeight="360px"
              onRowClicked={(row) => {
                setEditValue(row);
              }}
              selectableRowsHighlight
              persistTableHead={true}
            />
          </div>

          {pageStatus && <div className="utilities-tab-content-button-container" >
            <button type="button" className="btn btn-sm btn-success" onClick={() => handleClose()}>New</button>
            {effectiveScreenPermission && (
              <>
                {effectiveScreenPermission.AddOK && !miscellaneousStatusCode?.lstMiscellaneousID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => onSave()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!miscellaneousStatusCode?.lstMiscellaneousID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange || isDisabled}
                    onClick={() => onSave()}
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

export default MiscellaneousStatusSection;