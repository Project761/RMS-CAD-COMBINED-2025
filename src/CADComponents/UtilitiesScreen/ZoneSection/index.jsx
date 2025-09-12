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
import { useSelector, useDispatch } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { getData_DropDown_Priority } from '../../../CADRedux/actions/DropDownsData';


const ZoneSection = () => {
  const dispatch = useDispatch();
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
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })
  const [isDisabled, setIsDisabled] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    zoneState,
    setZoneState,
    handleZoneState,
    clearZoneState,
  ] = useObjState({
    ZoneID: "",
    agencyCode: "",
    MultiAgency_Name: "",
    ZoneCode: "",
    ZoneDescription: "",
    IsActive: true,
  })

  const [
    errorZoneState,
    ,
    handleErrorZoneState,
    clearStateZoneState,
  ] = useObjState({
    ZoneCode: false,
    ZoneDescription: false
  });

  const validateZoneForm = () => {
    let isError = false;
    const keys = Object.keys(errorZoneState);
    keys.map((field) => {
      if (field === "ZoneCode" && isEmpty(zoneState[field])) {
        handleErrorZoneState(field, true);
        isError = true;
      } else if (field === "ZoneDescription" && isEmpty(zoneState[field])) {
        handleErrorZoneState(field, true);
        isError = true;
      } else {
        handleErrorZoneState(field, false);
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

  const getZoneKey = `/CAD/GeoPetrolZone/GetData_Zone`;
  const { data: zoneList, isSuccess: isFetchZoneList, refetch: zoneListRefetch, isError: isNoData } = useQuery(
    [getZoneKey, {
      IsActive: pageStatus,
      AgencyID: loginAgencyID,
      IsSuperAdmin: isSuperAdmin,
      PINID: loginPinID,
    }],
    MasterTableListServices.getZone,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );

  useEffect(() => {
    if (isFetchZoneList && zoneList) {
      const res = JSON.parse(zoneList?.data?.data);
      const data = res?.Table
      setFilterListData(data || [])
      setListData(data || [])
      setEffectiveScreenPermission(res?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
    dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
  }, [isFetchZoneList, zoneList])

  function handleClose() {
    clearZoneState();
    clearStateZoneState();
    setMultiSelected({
      optionSelected: null
    });
  }

  const onInsertZone = async () => {
    if (!validateZoneForm()) return;
    setIsDisabled(true);
    const result = listData?.find(item => {
      if (item.ZoneCode) {
        const code = zoneState?.ZoneCode?.toLowerCase();
        return code && item.ZoneCode.toLowerCase() === code;
      }
      return false;
    });

    const result1 = listData?.find(item => {
      if (item.ZoneDescription) {
        const description = zoneState?.ZoneDescription?.toLowerCase();
        return description && item.ZoneDescription.toLowerCase() === description;
      }
      return false;
    });

    if ((result || result1) && !zoneState?.ZoneID) {
      if (result) {
        toastifyError('Code Already Exists');
      }
      if (result1) {
        toastifyError('Description Already Exists');
      }
    } else {
      try {
        const data = {
          ZoneID: zoneState?.ZoneID ? zoneState?.ZoneID : undefined,
          ZoneCode: zoneState?.ZoneCode,
          ZoneDescription: zoneState?.ZoneDescription,
          CreatedByUserFK: zoneState?.ZoneID ? undefined : loginPinID,
          MultiAgency_Name: zoneState?.MultiAgency_Name,
          AgencyID: zoneState?.agencyCode,
          ModifiedByUserFK: zoneState?.ZoneID ? loginPinID : undefined,
          IsActive: zoneState?.IsActive,
        };
        const serviceMethod = zoneState?.ZoneID
          ? MasterTableListServices.updateZone
          : MasterTableListServices.insertZone;

        const res = await serviceMethod(data);

        if (res) {
          const message = zoneState?.ZoneID
            ? "Data Updated Successfully"
            : "Data Saved Successfully";
          toastifySuccess(message);
          zoneListRefetch();
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
      ZoneID: activeInactiveData?.ZoneID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeStatusZone(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      zoneListRefetch();
    }
    setShowModal(false);
  }

  const columns = [
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
      name: 'Description',
      selector: row => row.ZoneDescription,
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

  const setEditValue = (row) => {
    const val = { ZoneID: row?.ZoneID, AgencyID: loginAgencyID, }
    fetchPostData('/CAD/GeoPetrolZone/GetSingleData_Zone', val).then((res) => {
      if (res) {
        setZoneState({
          ZoneID: res[0]?.ZoneID,
          agencyCode: res[0]?.AgencyID,
          MultiAgency_Name: res[0]?.MultiAgency_Name,
          ZoneCode: res[0]?.ZoneCode,
          ZoneDescription: res[0]?.ZoneDescription,
          IsActive: res[0]?.IsActive,
        })
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setZoneState({}) }
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.ZoneID === zoneState?.ZoneID,
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
      setZoneState({
        ...zoneState,
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
                          Zone Code{errorZoneState.ZoneCode && isEmpty(zoneState.ZoneCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Zone Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Zone Code'
                          maxLength={10}
                          onKeyDown={handleSpecialKeyDown}
                          value={zoneState.ZoneCode}
                          onChange={(e) => { handleZoneState("ZoneCode", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Description{errorZoneState.ZoneDescription && isEmpty(zoneState.ZoneDescription) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-4 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Description'
                          value={zoneState.ZoneDescription}
                          onChange={(e) => { handleZoneState("ZoneDescription", e.target.value); setIsChange(true); }}
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
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'ZoneCode', 'ZoneDescription')
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
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'ZoneCode', 'ZoneDescription')
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
              conditionalRowStyles={conditionalRowStyles}
              highlightOnHover
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              fixedHeader
              fixedHeaderScrollHeight="360px"
              onRowClicked={(row) => {
                setEditValue(row);
              }}
              selectableRowsHighlight
            />
          </div>

          {pageStatus && <div className="utilities-tab-content-button-container" >
            <button type="button" className="btn btn-sm btn-success" onClick={() => handleClose()}>New</button>
            {effectiveScreenPermission && (
              <>
                {effectiveScreenPermission.AddOK && !zoneState?.ZoneID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => onInsertZone()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!zoneState?.ZoneID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange || isDisabled}
                    onClick={() => onInsertZone()}
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

export default ZoneSection;