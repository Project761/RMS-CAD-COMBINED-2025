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
import { useSelector, useDispatch } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { getData_DropDown_Priority } from '../../../CADRedux/actions/DropDownsData';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

const PrioritySection = () => {
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [searchValue1, setSearchValue1] = useState('');
  const [isUpdateAgency, setIsUpdateAgency] = useState(false);
  const [searchValue2, setSearchValue2] = useState('');
  const [isActive, setIsActive] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [showModal, setShowModal] = useState(false);
  const [loginPinID, setLoginPinID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })
  const [isDisabled, setIsDisabled] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    priorityState,
    setPriorityState,
    handlePriorityState,
    clearPriorityState,
  ] = useObjState({
    PriorityID: "",
    PriorityCode: "",
    Description: "",
    BackColor: "#000000",
    agencyCode: "",
    MultiAgency_Name: ""
  })

  const [
    errorPriorityState,
    ,
    handleErrorPriorityState,
    clearErrorPriorityState,
  ] = useObjState({
    PriorityCode: false,
    Description: false,
    BackColor: false,
  });

  const validatePriorityForm = () => {
    let isError = false;
    const keys = Object.keys(errorPriorityState);
    keys.map((field) => {
      if (
        field === "PriorityCode" &&
        isEmpty(priorityState[field])) {
        handleErrorPriorityState(field, true);
        isError = true;
      } else if (field === "Description" && isEmpty(priorityState[field])) {
        handleErrorPriorityState(field, true);
        isError = true;
      } else {
        handleErrorPriorityState(field, false);
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
      if (localStoreData?.AgencyID && agencyCodeDropDown?.length > 0) {
        const agency = agencyCodeDropDown?.find((i => i?.value.toString() === localStoreData?.AgencyID));
        setMultiSelected({
          optionSelected: agency
        });
        setPriorityState({
          ...priorityState,
          'agencyCode': agency.value.toString(), 'MultiAgency_Name': agency.label.toString()
        })
      }
    }
  }, [localStoreData, agencyCodeDropDown, isUpdateAgency]);

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


  const getPriorityKey = `/CAD/MasterPriority/GetData_Priority`;
  const { data: priorityList, isSuccess: isFetchPriorityList, refetch: priorityListRefetch, isError: isNoData } = useQuery(
    [getPriorityKey, {
      IsActive: pageStatus,
      AgencyID: loginAgencyID,
      IsSuperAdmin: isSuperAdmin,
      PINID: loginPinID,
    }],
    MasterTableListServices.getMasterPriority,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );

  useEffect(() => {
    if (isFetchPriorityList && priorityList) {
      const res = JSON.parse(priorityList?.data?.data);
      const data = res?.Table
      setFilterListData(data || []);
      setListData(data || []);
      setEffectiveScreenPermission(res?.Table1?.[0]);
    } else {
      setFilterListData([]);
      setListData([]);
      setEffectiveScreenPermission();
    }
    dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
  }, [isFetchPriorityList, priorityList])

  function handleClose() {
    clearPriorityState();
    clearErrorPriorityState();
    setMultiSelected({
      optionSelected: null
    });
    setIsChange(false);
  }

  const onSave = async () => {
    if (!validatePriorityForm()) return;
    setIsDisabled(true);
    const result = listData?.find(item => {
      if (item.PriorityCode) {
        const code = priorityState?.PriorityCode?.toLowerCase();
        return code && item.PriorityCode.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.Description) {
        const description = priorityState?.Description?.toLowerCase();
        return description && item.Description.toLowerCase() === description;
      }
      return false;
    });

    const result2 = listData?.find(item => {
      if (item.BackColor) {
        const backColor = priorityState?.BackColor?.toLowerCase();
        return backColor && item.BackColor.toLowerCase() === backColor;
      }
      return false;
    });

    if ((result || result1 || result2) && !priorityState?.PriorityID) {
      if (result) {
        toastifyError('Code Already Exists');
      }
      if (result1) {
        toastifyError('Description Already Exists');
      }
      if (result2) {
        toastifyError('BackColor Already Exists');
      }
    } else {
      try {
        const serviceMethod = priorityState?.PriorityID
          ? MasterTableListServices.updateMasterPriority
          : MasterTableListServices.insertMasterPriority;
        const payload = {
          PriorityID: priorityState?.PriorityID ? priorityState?.PriorityID : undefined,
          PriorityCode: priorityState?.PriorityCode,
          Description: priorityState?.Description,
          BackColor: priorityState?.BackColor,
          IsActive: true,
          CreatedByUserFK: priorityState?.PriorityID ? undefined : loginPinID,
          ModifiedByUserFK: priorityState?.PriorityID ? loginPinID : undefined,
          AgencyID: priorityState?.agencyCode,
          MultiAgency_Name: priorityState?.MultiAgency_Name,
        }
        const res = await serviceMethod(payload);

        if (res) {
          const message = priorityState?.PriorityID
            ? "Data Updated Successfully"
            : "Data Saved Successfully";

          toastifySuccess(message);
          setIsUpdateAgency(!isUpdateAgency);
          priorityListRefetch();
          handleClose();
        }
      } catch (error) {
        console.error("Error during insert/update:", error);
      }
    }
    setIsDisabled(false);
  };

  async function handelActiveInactive() {
    const data = {
      PriorityID: activeInactiveData?.PriorityID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeStatusMasterPriority(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      priorityListRefetch();
    }
    setShowModal(false);
  }

  const columns = [
    {
      name: 'Priority Code',
      selector: row => row.PriorityCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.PriorityCode, rowB.PriorityCode),
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
      name: 'Back Color Code',
      selector: row => row.BackColor,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.BackColor, rowB.BackColor),
      style: {
        position: "static",
      },
      cell: row => (
        <div style={{
          backgroundColor: row.BackColor, width: '100%', height: '100%', display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        </div>
      ),
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

  const setEditValue = (row) => {
    const val = { PriorityID: row?.PriorityID, AgencyID: loginAgencyID, }
    fetchPostData('CAD/MasterPriority/GetSingleData_Priority', val).then((res) => {
      if (res) {
        setPriorityState({
          PriorityID: res[0]?.PriorityID,
          PriorityCode: res[0]?.PriorityCode,
          Description: res[0]?.Description,
          BackColor: res[0]?.BackColor,
          agencyCode: res[0]?.AgencyID,
          MultiAgency_Name: res[0]?.MultiAgency_Name,
          IsActive: res[0]?.IsActive
        })
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setPriorityState({}) }
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.PriorityID === priorityState?.PriorityID,
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
      setPriorityState({
        ...priorityState,
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
                          Priority Code{errorPriorityState.PriorityCode && isEmpty(priorityState.PriorityCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Priority Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          name="PriorityCode"
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Priority Code'
                          onKeyDown={handleSpecialKeyDown}
                          value={priorityState.PriorityCode}
                          onChange={(e) => { handlePriorityState("PriorityCode", e.target.value); setIsChange(true); }}
                        // onKeyDown={handleTextKeyDown}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Description{errorPriorityState.Description && isEmpty(priorityState.Description) && (
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
                          value={priorityState.Description}
                          onChange={(e) => { handlePriorityState("Description", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Back Color
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          name="BackColor"
                          type="color"
                          className="w-100 py-1 new-input requiredColor"
                          style={{
                            height: '30px',
                            border: '1px solid #ced4da',
                            borderRadius: '.25rem',
                          }}
                          value={priorityState.BackColor}
                          onChange={(e) => { handlePriorityState("BackColor", e.target.value); setIsChange(true); }}
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
                          isDisabled
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
                placeholder='Search By Code...'
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'PriorityCode', 'Description')
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
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'PriorityCode', 'Description')
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
              striped
              highlightOnHover
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              fixedHeader
              fixedHeaderScrollHeight="360px"
              onRowClicked={(row) => {
                setEditValue(row);
              }}
              selectableRowsHighlight
              persistTableHead={true}
            />
          </div>

          {pageStatus && <div className="utilities-tab-content-button-container" >
            <button type="button" className="btn btn-sm btn-success" onClick={() => { handleClose(); setIsUpdateAgency(!isUpdateAgency); }}>New</button>
            {effectiveScreenPermission && (
              <>
                {effectiveScreenPermission.AddOK && !priorityState?.PriorityID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => onSave()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!priorityState?.PriorityID ? (
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

export default PrioritySection;