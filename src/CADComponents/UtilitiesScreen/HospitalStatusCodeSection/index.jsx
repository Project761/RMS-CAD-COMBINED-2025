import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import '../section.css';
import useObjState from '../../../CADHook/useObjState';
import { useQuery } from 'react-query';
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import {
  compareStrings,
  isEmpty
} from "../../../CADUtils/functions/common";
import CADConfirmModal from '../../Common/CADConfirmModal';
import { useSelector } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

const HospitalStatusCodeSection = () => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [confirmType, setConfirmType] = useState('');
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isUpdateAgency, setIsUpdateAgency] = useState(false);
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    hospitalStatusCodeState,
    setHospitalStatusCodeState,
    handleHospitalStatusCodeState,
    clearHospitalStatusCodeState,
  ] = useObjState({
    HospitalStatusID: "",
    hospitalCode: "",
    codeDesc: "",
    isActive: true,
    MultiAgency_Name: "",
    agencyCode: "",
  });

  const [
    errorHospitalStatusCodeState,
    ,
    handleErrorHospitalStatusCodeState,
    clearStateHospitalStatusCodeState,
  ] = useObjState({
    hospitalCode: false,
    codeDesc: false,
  });

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
      setIsSuperAdmin(localStoreData?.IsSuperadmin === "true" ? 1 : 0);
      if (localStoreData?.AgencyID && agencyCodeDropDown?.length > 0) {
        const agency = agencyCodeDropDown?.find((i => i?.value.toString() === localStoreData?.AgencyID));
        setMultiSelected({
          optionSelected: agency
        });
        setHospitalStatusCodeState({
          ...hospitalStatusCodeState,
          'agencyCode': agency.value.toString(), 'MultiAgency_Name': agency.label.toString()
        })
      }
    }
  }, [localStoreData, agencyCodeDropDown, isUpdateAgency]);

  const getHospitalStatusCodeKey = `/CAD/MasterHospitalStatusCode/GetData_HospitalStatusCode`;
  const { data: getHospitalStatusCodeData, isSuccess: isFetchHospitalStatusCode, refetch, isError: isNoData } = useQuery(
    [getHospitalStatusCodeKey, { IsActive: pageStatus, AgencyID: String(loginAgencyID), PINID: loginPinID, IsSuperAdmin: isSuperAdmin },],
    MasterTableListServices.getHospitalStatusCode,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginPinID && !!loginAgencyID,
    }
  );

  const getAgencyCodeKey = `/CAD/MasterAgency/MasterAgencyCode`;
  const { data: getAgencyCodeData, isSuccess: isFetchAgencyCode } = useQuery(
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
    if (isFetchAgencyCode && getAgencyCodeData) {
      const data = JSON.parse(getAgencyCodeData?.data?.data);
      setAgencyCodeDropDown(changeArrayFormat(data?.Table) || [])
    }
  }, [isFetchAgencyCode, getAgencyCodeData]);

  useEffect(() => {
    if (getHospitalStatusCodeData && isFetchHospitalStatusCode) {
      const data = JSON.parse(getHospitalStatusCodeData?.data?.data);
      setFilterListData(data?.Table)
      setListData(data?.Table)
      setEffectiveScreenPermission(data?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [getHospitalStatusCodeData, isFetchHospitalStatusCode])

  function onCancel() {
    clearHospitalStatusCodeState();
    clearStateHospitalStatusCodeState();
    setIsChange(false);
    setMultiSelected({
      optionSelected: null
    });
  }
  async function handelActiveInactive() {
    const data = {
      HospitalStatusID: activeInactiveData?.HospitalStatusID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeStatusHospitalStatusCode(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      refetch();
    }
    setShowModal(false);
    onCancel();
  }

  const validateCFSCodeForm = () => {
    let isError = false;
    const keys = Object.keys(errorHospitalStatusCodeState);
    keys.map((field) => {
      if (
        field === "hospitalCode" &&
        isEmpty(hospitalStatusCodeState[field])) {
        handleErrorHospitalStatusCodeState(field, true);
        isError = true;
      } else if (field === "codeDesc" && isEmpty(hospitalStatusCodeState[field])) {
        handleErrorHospitalStatusCodeState(field, true);
        isError = true;
      } else {
        handleErrorHospitalStatusCodeState(field, false);
      }
      return null;
    });
    return !isError;
  };
  async function handelSave() {
    if (!validateCFSCodeForm()) return
    const isUpdate = !!hospitalStatusCodeState?.HospitalStatusID;
    setIsDisabled(true);
    const result = listData?.find(item => {
      if (item.hospitalstatuscode) {
        const code = hospitalStatusCodeState?.hospitalCode?.toLowerCase();
        return code && item.hospitalstatuscode.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.codedescription) {
        const description = hospitalStatusCodeState?.codeDesc?.toLowerCase();
        return description && item.codedescription.toLowerCase() === description;
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
        HospitalStatusID: isUpdate ? hospitalStatusCodeState?.HospitalStatusID : undefined,
        hospitalstatuscode: hospitalStatusCodeState?.hospitalCode,
        codedescription: hospitalStatusCodeState?.codeDesc,
        isactive: true,
        CreatedByUserFK: isUpdate ? undefined : loginPinID,
        ModifiedByUserFK: isUpdate ? loginPinID : undefined,
        AgencyID: hospitalStatusCodeState?.agencyCode,
        MultiAgency_Name: hospitalStatusCodeState?.MultiAgency_Name || "",
      }
      let response;
      if (isUpdate) {
        response = await MasterTableListServices.updateHospitalStatusCode(data);
      }
      else {
        response = await MasterTableListServices.insertHospitalStatusCode(data);
      }
      if (response?.status === 200) {
        toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
        onCancel()
        setIsUpdateAgency(!isUpdateAgency);
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
      setHospitalStatusCodeState({
        ...hospitalStatusCodeState,
        'agencyCode': id.toString(), 'MultiAgency_Name': name.toString()
      })
    }
  }

  function handelSetEditData(data) {
    const val = { HospitalStatusID: data?.HospitalStatusID, AgencyID: loginAgencyID, }
    fetchPostData('/CAD/MasterHospitalStatusCode/GetSingleData_HospitalStatusCode', val).then((res) => {
      if (res) {
        setHospitalStatusCodeState({
          HospitalStatusID: res[0]?.HospitalStatusID,
          hospitalCode: res[0]?.hospitalstatuscode,
          codeDesc: res[0]?.codedescription,
          IsActive: res[0]?.IsActive,
          agencyCode: res[0]?.AgencyID,
          MultiAgency_Name: res[0]?.MultiAgency_Name || "",
        })
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setHospitalStatusCodeState({}) }
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.HospitalStatusID === hospitalStatusCodeState?.HospitalStatusID,
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
      name: 'Hospital Status Code',
      selector: row => row.hospitalstatuscode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.hospitalstatuscode, rowB.hospitalstatuscode),
      style: {
        position: "static",
      },
    },
    {
      name: 'Code Description',
      selector: row => row.codedescription,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.codedescription, rowB.codedescription),
      width: "60%",
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
              <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true" onClick={(e) => { setShowModal(true); setActiveInactiveData(row); setIsActive(false); setConfirmType("InActive"); onCancel() }}></i>
            ) : (
              <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true" onClick={(e) => { setShowModal(true); setActiveInactiveData(row); setIsActive(true); setConfirmType("Active"); onCancel() }}></i>
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
                <span className={`nav-item ${pageStatus === true ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(true); setSearchValue1(""); setSearchValue2(""); onCancel() }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === true ? 'Red' : '' }}>Active</span>
                <span className={`nav-item ${pageStatus === false ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(false); setSearchValue1(""); setSearchValue2(""); onCancel() }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === false ? 'Red' : '' }}>InActive</span>
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
                          Hospital Status Code {errorHospitalStatusCodeState.hospitalCode && isEmpty(hospitalStatusCodeState?.hospitalCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Hospital Status Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          name="hospitalCode"
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          onKeyDown={handleSpecialKeyDown}
                          placeholder='Hospital Status Code'
                          value={hospitalStatusCodeState?.hospitalCode}
                          onChange={(e) => { handleHospitalStatusCodeState("hospitalCode", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Code Description {errorHospitalStatusCodeState.codeDesc && isEmpty(hospitalStatusCodeState?.codeDesc) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Code Description"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-4 d-flex align-self-center justify-content-end">
                        <input
                          name="codeDesc"
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Code Description'
                          value={hospitalStatusCodeState?.codeDesc}
                          onChange={(e) => { handleHospitalStatusCodeState("codeDesc", e.target.value); setIsChange(true); }}

                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label htmlFor="" className="tab-form-label">
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
          <div className="row mb-2">
            <div className="col-5 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="form-control"
                placeholder='Search By Code...'
                value={searchValue1}
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'hospitalstatuscode', 'codedescription')
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
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'hospitalstatuscode', 'codedescription')
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
              conditionalRowStyles={conditionalRowStyles}
              responsive
              striped
              highlightOnHover
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              fixedHeader
              onRowClicked={(row) => {
                handelSetEditData(row);
              }}
            />
          </div>
          <div className="utilities-tab-content-button-container bb pb-2" >
            <button type="button" className="btn btn-sm btn-success" onClick={() => { onCancel(); setIsUpdateAgency(!isUpdateAgency) }}>New</button>
            {effectiveScreenPermission && (
              <>
                {effectiveScreenPermission.AddOK && !hospitalStatusCodeState?.HospitalStatusID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => handelSave()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!hospitalStatusCodeState?.HospitalStatusID ? (
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
          </div>
        </div>
      </div>
      <CADConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirm={handelActiveInactive} confirmType={confirmType} />
    </>
  );
};

export default HospitalStatusCodeSection;