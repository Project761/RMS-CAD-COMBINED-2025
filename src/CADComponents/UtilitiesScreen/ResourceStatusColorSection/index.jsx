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
import { SearchFilter, SendIcon } from '../../Common/SearchFilter'
import CADConfirmModal from '../../Common/CADConfirmModal';
import { useSelector } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';

const ResourceStatusColorSection = () => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [confirmType, setConfirmType] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [showModal, setShowModal] = useState(false);
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [loginPinID, setLoginPinID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })
  const [isDisabled, setIsDisabled] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    resourceStatusColorState,
    setResourceStatusColorState,
    handleResourceStatusColorState,
    clearResourceStatusColorState,
  ] = useObjState({
    ResourceStatusID: "",
    ResourceStatusCode: "",
    Description: "",
    BackColor: "#ffffff",
    ForeColor: "#000000",
    AgencyID: loginAgencyID,
    CreatedByUserFK: "",
    ModifiedByUserFK: "",
    agencyCode: "",
    MultiAgency_Name: "",
  })

  const [
    errorResourceStatusColorState,
    ,
    handleErrorResourceStatusColorState,
    clearErrorResourceStatusColorState,
  ] = useObjState({
    ResourceStatusCode: false,
    Description: false,
    BackColor: false,
    ForeColor: false
  });

  const validateResourceStatusColorForm = () => {
    let isError = false;
    const keys = Object.keys(errorResourceStatusColorState);
    keys.map((field) => {
      if (
        field === "ResourceStatusCode" &&
        isEmpty(resourceStatusColorState[field])) {
        handleErrorResourceStatusColorState(field, true);
        isError = true;
      } else if (field === "Description" && isEmpty(resourceStatusColorState[field])) {
        handleErrorResourceStatusColorState(field, true);
        isError = true;
      } else if (field === "BackColor" && isEmpty(resourceStatusColorState[field])) {
        handleErrorResourceStatusColorState(field, true);
        isError = true;
      } else if (field === "ForeColor" && isEmpty(resourceStatusColorState[field])) {
        handleErrorResourceStatusColorState(field, true);
        isError = true;
      } else {
        handleErrorResourceStatusColorState(field, false);
      }
      return null;
    });
    return !isError;
  };

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
      handleResourceStatusColorState("AgencyID", localStoreData?.AgencyID);
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

  const getResourceStatusColorKey = `/CAD/ResourceStatusColor/GetResourceStatusColor`;
  const { data: resourceStatusColorList, isSuccess: isFetchResourceStatusColorList, refetch: resourceStatusColorListRefetch, isError: isNoData } = useQuery(
    [getResourceStatusColorKey, {
      IsActive: pageStatus,
      AgencyID: loginAgencyID,
      IsSuperAdmin: isSuperAdmin,
      PINID: loginPinID,
    }],
    MasterTableListServices.getResourceStatusColor,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );

  useEffect(() => {
    if (isFetchResourceStatusColorList && resourceStatusColorList) {
      const res = JSON.parse(resourceStatusColorList?.data?.data);
      const data = res?.Table
      setFilterListData(data || [])
      setListData(data || [])
      setEffectiveScreenPermission(res?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission(null);
    }
  }, [isFetchResourceStatusColorList, resourceStatusColorList])

  function handleClose() {
    clearResourceStatusColorState();
    clearErrorResourceStatusColorState();
    setIsChange(false);
    setMultiSelected({
      optionSelected: null
    });
  }

  const onSave = async () => {
    if (!validateResourceStatusColorForm()) return;
    setIsDisabled(true);
    const sameBackAndForeColor = resourceStatusColorState?.BackColor === resourceStatusColorState?.ForeColor;
    if (sameBackAndForeColor) {
      toastifyError('Back Color and Fore Color should not be same');
      return;
    }
    const result = listData?.find(item => {
      if (item.ResourceStatusCode) {
        const code = resourceStatusColorState?.ResourceStatusCode?.toLowerCase();
        return code && item.ResourceStatusCode.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.Description) {
        const description = resourceStatusColorState?.Description?.toLowerCase();
        return description && item.Description.toLowerCase() === description;
      }
      return false;
    });
    const BackColor = listData?.find(item => {
      if (item.BackColor) {
        const description = resourceStatusColorState?.BackColor?.toLowerCase();
        return description && item.BackColor.toLowerCase() === description;
      }
      return false;
    });
    if ((result || result1 || BackColor) && !resourceStatusColorState?.ResourceStatusID) {
      if (result) {
        toastifyError('Code Already Exists');
      }
      if (result1) {
        toastifyError('Description Already Exists');
      }
      if (BackColor) {
        toastifyError('BackColor Already Exists');
      }
    } else {
      try {
        const serviceMethod = resourceStatusColorState?.ResourceStatusID
          ? MasterTableListServices.updateResourceStatusColor
          : MasterTableListServices.insertResourceStatusColor;

        const payload = {
          ResourceStatusID: resourceStatusColorState?.ResourceStatusID ? parseInt(resourceStatusColorState?.ResourceStatusID) : undefined,
          ResourceStatusCode: resourceStatusColorState?.ResourceStatusCode,
          Description: resourceStatusColorState?.Description,
          BackColor: resourceStatusColorState?.BackColor,
          ForeColor: resourceStatusColorState?.ForeColor,
          AgencyID: resourceStatusColorState?.agencyCode,
          CreatedByUserFK: resourceStatusColorState?.ResourceStatusID ? undefined : loginPinID,
          ModifiedByUserFK: resourceStatusColorState?.ResourceStatusID ? loginPinID : undefined,
          MultiAgency_Name: resourceStatusColorState?.MultiAgency_Name,
        };

        const res = await serviceMethod(payload);

        if (res) {
          const message = resourceStatusColorState?.ResourceStatusID
            ? "Data Updated Successfully"
            : "Data Saved Successfully";

          toastifySuccess(message);
          resourceStatusColorListRefetch();
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
      ResourceStatusID: activeInactiveData?.ResourceStatusID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeStatusResourceStatusColor(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      resourceStatusColorListRefetch();
    }
    setShowModal(false);
  }

  const columns = [
    {
      name: 'Unit Status Code',
      selector: row => row.ResourceStatusCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceStatusCode, rowB.ResourceStatusCode),
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
      name: 'Back Color',
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
        </div>)
    },
    {
      name: 'Fore Color',
      selector: row => row.ForeColor,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ForeColor, rowB.ForeColor),
      style: {
        position: "static",
      },
      cell: row => (
        <div style={{
          backgroundColor: row.ForeColor, width: '100%', height: '100%', display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }} />
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
    setResourceStatusColorState({
      ...row,
      ResourceStatusID: parseInt(row.ResourceStatusID),
      IsActive: row.IsActive
    });
    const val = { ResourceStatusID: row?.ResourceStatusID, AgencyID: loginAgencyID, }
    fetchPostData('/CAD/ResourceStatusColor/GetSingleData_ResourceStatusColor', val).then((res) => {
      if (res) {
        setResourceStatusColorState({
          ResourceStatusID: res[0]?.ResourceStatusID,
          ResourceStatusCode: res[0]?.ResourceStatusCode,
          Description: res[0]?.Description,
          BackColor: res[0]?.BackColor,
          ForeColor: res[0]?.ForeColor,
          agencyCode: res[0]?.agencyCode,
          MultiAgency_Name: res[0]?.MultiAgency_Name,
          IsActive: res[0]?.IsActive,

        })
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setResourceStatusColorState({}) }
    })

  }

  const conditionalRowStyles = [
    {
      when: row => row?.ResourceStatusID === resourceStatusColorState?.ResourceStatusID,
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
      setResourceStatusColorState({
        ...resourceStatusColorState,
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
                          Unit Status Code{errorResourceStatusColorState.ResourceStatusCode && isEmpty(resourceStatusColorState.ResourceStatusCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Unit Status Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          name="ResourceStatusCode"
                          type="text"
                          onKeyDown={handleSpecialKeyDown}
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Unit Status Code'
                          value={resourceStatusColorState.ResourceStatusCode}
                          onChange={(e) => { handleResourceStatusColorState("ResourceStatusCode", e.target.value); setIsChange(true); }}
                          maxLength={5}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Description{errorResourceStatusColorState.Description && isEmpty(resourceStatusColorState.Description) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          name="Description"
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Description'
                          value={resourceStatusColorState.Description}
                          onChange={(e) => { handleResourceStatusColorState("Description", e.target.value); setIsChange(true); }}
                          maxLength={255}
                        />
                      </div>
                    </div>
                    {/* line 2 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Back Color{errorResourceStatusColorState.BackColor && isEmpty(resourceStatusColorState.BackColor) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Back Color"}</p>
                          )}
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
                          value={resourceStatusColorState.BackColor}
                          onChange={(e) => { handleResourceStatusColorState("BackColor", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Fore Color{errorResourceStatusColorState.ForeColor && isEmpty(resourceStatusColorState.ForeColor) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Fore Color"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          name="ForeColor"
                          type="color"
                          className="w-100 py-1 new-input requiredColor"
                          style={{
                            height: '30px',
                            border: '1px solid #ced4da',
                            borderRadius: '.25rem',
                          }}
                          value={resourceStatusColorState.ForeColor}
                          onChange={(e) => { handleResourceStatusColorState("ForeColor", e.target.value); setIsChange(true); }}
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
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'ResourceStatusCode', 'Description')
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
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'ResourceStatusCode', 'Description')
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
            <button type="button" className="btn btn-sm btn-success" onClick={() => handleClose()}>New</button>
            {effectiveScreenPermission && (
              <>
                {effectiveScreenPermission.AddOK && !resourceStatusColorState?.ResourceStatusID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => onSave()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!resourceStatusColorState?.ResourceStatusID ? (
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

export default ResourceStatusColorSection;