import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useQuery } from 'react-query';
import Select from "react-select";
import Dropdown from 'react-bootstrap/Dropdown';
import moment from 'moment';
import '../section.css';
import { coloredStyle_Select } from '../../Utility/CustomStylesForReact';
import { getShowingWithOutTime, tableCustomStyles } from '../../../Components/Common/Utility';
import useObjState from '../../../CADHook/useObjState';
import {
  compareStrings,
  isEmpty
} from "../../../CADUtils/functions/common";
import { useSelector } from 'react-redux';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import ResourcesStatusServices from "../../../CADServices/APIs/resourcesStatus";
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import CADConfirmModal from '../../Common/CADConfirmModal';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

const HospitalNameCodeSection = () => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUpdateAgency, setIsUpdateAgency] = useState(false);
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [isChange, setIsChange] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [confirmType, setConfirmType] = useState('');
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [hospitalStatusCodeOption, setHospitalStatusCodeOption] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [
    hospitalNameCodeState,
    setHospitalNameCodeState,
    handleHospitalNameCodeState,
    clearHospitalNameCodeState,
  ] = useObjState({
    HospitalNameCodeID: "",
    hospitalnamecode: "",
    hospitalname: "",
    hospitalstatuscode: [],
    statusexpirationdate: "",
    agencyCode: "",
    MultiAgency_Name: "",
  });
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })

  const [
    errorHospitalNameCodeState,
    ,
    handleErrorHospitalNameCodeState,
    clearErrorHospitalNameCodeState, ,
  ] = useObjState({
    hospitalnamecode: false,
    hospitalname: false,
    hospitalstatuscode: false,
  });

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
      setIsSuperAdmin(localStoreData?.IsSuperadmin === 'true' ? 1 : 0);
      if (localStoreData?.AgencyID && agencyCodeDropDown?.length > 0) {
        const agency = agencyCodeDropDown?.find((i => i?.value.toString() === localStoreData?.AgencyID));
        setMultiSelected({
          optionSelected: agency
        });
        setHospitalNameCodeState({
          ...hospitalNameCodeState,
          'agencyCode': agency.value.toString(), 'MultiAgency_Name': agency.label.toString()
        })
      }
    }
  }, [localStoreData, agencyCodeDropDown, isUpdateAgency]);

  //Hospital Status Code Dropdown
  const getHospitalStatusCodeKey = `/CAD/MasterHospitalStatusCode/GetDataDropDown_HospitalStatusCode/${loginAgencyID}`;
  const { data: getHospitalStatusCodeData, isSuccess: isFetchHospitalStatusCode, isError: isNoData } = useQuery(
    [getHospitalStatusCodeKey, { AgencyID: loginAgencyID },],
    MasterTableListServices.getDataDropDown_HospitalStatusCode,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID
    }
  );

  useEffect(() => {
    if (getHospitalStatusCodeData && isFetchHospitalStatusCode) {
      const data = JSON.parse(getHospitalStatusCodeData?.data?.data);
      setHospitalStatusCodeOption(data?.Table)
    }
  }, [getHospitalStatusCodeData, isFetchHospitalStatusCode])

  // List Table
  const getHospitalNameCodeKey = `/CAD/MasterHospitalNamecode/GetData_HospitalNameCode/${loginAgencyID}`;
  const { data: hospitalNameCodeData, isSuccess: isFetchHospitalNameCode, refetch } = useQuery(
    [getHospitalNameCodeKey, { IsActive: pageStatus, AgencyID: String(loginAgencyID), IsSuperAdmin: isSuperAdmin, PINID: loginPinID },],
    ResourcesStatusServices.getHospitalNameCode,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID
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
    if (hospitalNameCodeData && isFetchHospitalNameCode) {
      const data = JSON.parse(hospitalNameCodeData?.data?.data);
      setFilterListData(data?.Table)
      setListData(data?.Table)
      setEffectiveScreenPermission(data?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [hospitalNameCodeData, isFetchHospitalNameCode])

  async function handelActiveInactive() {
    const data = {
      HospitalNameCodeID: activeInactiveData?.HospitalNameCodeID,
      DeletedByUserFK: loginPinID,
      isactive: isActive,
    }

    const response = await ResourcesStatusServices.changeStatusHospitalNameCode(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      refetch();
    }
    setShowModal(false);
    onCancel()

  }
  const validateNameCodeForm = () => {
    let isError = false;
    const keys = Object.keys(errorHospitalNameCodeState);
    keys.map((field) => {
      if (
        field === "hospitalnamecode" &&
        isEmpty(hospitalNameCodeState[field])) {
        handleErrorHospitalNameCodeState(field, true);
        isError = true;
      } else if (field === "hospitalname" && isEmpty(hospitalNameCodeState[field])) {
        handleErrorHospitalNameCodeState(field, true);
        isError = true;
      } else if (field === "hospitalstatuscode" && isEmpty(hospitalNameCodeState[field])) {
        handleErrorHospitalNameCodeState(field, true);
        isError = true;
      } else {
        handleErrorHospitalNameCodeState(field, false);
      }
      return null;
    });
    return !isError;
  };
  async function handelSave() {
    if (!validateNameCodeForm()) return
    const isUpdate = !!hospitalNameCodeState?.HospitalNameCodeID;
    setIsDisabled(true);
    const result = listData?.find(item => {
      if (item.hospitalnamecode) {
        const code = hospitalNameCodeState?.hospitalnamecode?.toLowerCase();
        return code && item.hospitalnamecode.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.hospitalname) {
        const description = hospitalNameCodeState?.hospitalname?.toLowerCase();
        return description && item.hospitalname.toLowerCase() === description;
      }
      return false;
    });
    if ((result || result1) && !isUpdate) {
      if (result) {
        toastifyError('Code Already Exists');
      }
      if (result1) {
        toastifyError('Name Already Exists');
      }
    } else {
      const data = {
        HospitalNameCodeID: isUpdate ? hospitalNameCodeState?.HospitalNameCodeID : undefined,
        hospitalnamecode: hospitalNameCodeState?.hospitalnamecode,
        hospitalname: hospitalNameCodeState?.hospitalname,
        hospitalstatuscode: hospitalNameCodeState?.hospitalstatuscode,
        statusexpirationdate: hospitalNameCodeState?.statusexpirationdate ? moment(hospitalNameCodeState?.statusexpirationdate).format("DD/MM/YYYY") : "",
        isactive: true,
        CreatedByUserFK: isUpdate ? undefined : loginPinID,
        ModifiedByUserFK: isUpdate ? loginPinID : undefined,
        AgencyID: hospitalNameCodeState?.agencyCode,
        MultiAgency_Name: hospitalNameCodeState?.MultiAgency_Name || "",
      }
      let response = []
      if (isUpdate) {
        response = await ResourcesStatusServices.updateMasterHospitalNamecode(data);
      } else {
        response = await ResourcesStatusServices.insertHospitalNameCode(data);
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

  function onCancel() {
    clearHospitalNameCodeState();
    clearErrorHospitalNameCodeState();
    setIsChange(false);
    setMultiSelected({
      optionSelected: null
    });
  }

  function handelSetEditData(data) {
    const val = { HospitalNameCodeID: data?.HospitalNameCodeID, AgencyID: loginAgencyID, }
    fetchPostData('/CAD/MasterHospitalNamecode/GetSingleData_HospitalNameCode', val).then((res) => {
      if (res) {
        setHospitalNameCodeState({
          HospitalNameCodeID: res[0]?.HospitalNameCodeID,
          hospitalnamecode: res[0]?.hospitalnamecode,
          hospitalname: res[0]?.hospitalname,
          hospitalstatuscode: res[0]?.hospitalstatuscode,
          statusexpirationdate: res[0]?.statusexpirationdate ? moment(res[0]?.statusexpirationdate).format("YYYY-MM-DD") : "",
          agencyCode: res[0]?.AgencyID,
          MultiAgency_Name: res[0]?.MultiAgency_Name || "",
        })
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setHospitalNameCodeState({}) }
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.HospitalNameCodeID === hospitalNameCodeState?.HospitalNameCodeID,
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
      name: 'Hospital Name Code',
      selector: row => row.hospitalnamecode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.hospitalnamecode, rowB.hospitalnamecode),
      style: {
        position: "static",
      },
    },
    {
      name: 'Hospital Name',
      selector: row => row.hospitalname,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.hospitalname, rowB.hospitalname),
      width: "25%",
      style: {
        position: "static",
      },
    },
    {
      name: 'Hospital Status Code',
      selector: row => hospitalStatusCodeOption.find((i) => i?.HospitalStatusID === row.hospitalstatuscode)?.hospitalstatuscode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.hospitalstatuscode, rowB.hospitalstatuscode),
      width: "25%",
      style: {
        position: "static",
      },
    },
    {
      name: 'Expire Date',
      selector: row => row.statusexpirationdate ? getShowingWithOutTime(row.statusexpirationdate) : "",
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.statusexpirationdate, rowB.statusexpirationdate),
      width: "20%",
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
      setHospitalNameCodeState({
        ...hospitalNameCodeState,
        'agencyCode': id.toString(), 'MultiAgency_Name': name.toString()
      })
    }
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
  return (
    <>
      <div className='utilities-tab-content-main-container'>
        <div className='utilities-tab-content-form-container'>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 incident-tab ">
              <ul className="nav nav-tabs mb-1 pl-2 " id="myTab" role="tablist">
                <span className={`nav-item ${pageStatus === 'true' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(true); setSearchValue1(""); setSearchValue2(""); onCancel() }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === true ? 'Red' : '' }}>Active</span>
                <span className={`nav-item ${pageStatus === 'false' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(false); setSearchValue1(""); setSearchValue2(""); onCancel() }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === false ? 'Red' : '' }}>InActive</span>
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
                          Hospital Name Code {errorHospitalNameCodeState.hospitalnamecode && isEmpty(hospitalNameCodeState?.hospitalnamecode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Hospital Name Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          name="hospitalnamecode"
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Hospital Name Code'
                          onKeyDown={handleSpecialKeyDown}
                          value={hospitalNameCodeState?.hospitalnamecode}
                          onChange={(e) => { handleHospitalNameCodeState("hospitalnamecode", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Hospital Name {errorHospitalNameCodeState.hospitalname && isEmpty(hospitalNameCodeState?.hospitalname) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Hospital Name"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-4 d-flex align-self-center justify-content-end">
                        <input
                          name="hospitalname"
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Hospital Name'
                          value={hospitalNameCodeState?.hospitalname}
                          onChange={(e) => { handleHospitalNameCodeState("hospitalname", e.target.value); setIsChange(true); }}

                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Hospital Status Code {errorHospitalNameCodeState.hospitalstatuscode && isEmpty(hospitalNameCodeState?.hospitalstatuscode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Hospital Status Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <Select
                          styles={coloredStyle_Select}
                          placeholder="Select"
                          isSearchable
                          options={hospitalStatusCodeOption}
                          getOptionLabel={(i) => i.hospitalstatuscode}
                          getOptionValue={(i) => i.HospitalStatusID}
                          // value={hospitalNameCodeState?.HospitalStatusID}
                          value={
                            !isEmpty(hospitalNameCodeState?.hospitalstatuscode)
                              ? hospitalStatusCodeOption?.find((i) => i?.HospitalStatusID === hospitalNameCodeState?.hospitalstatuscode)
                              : []
                          }
                          onChange={(e) => { handleHospitalNameCodeState("hospitalstatuscode", e?.HospitalStatusID); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Status Expiration Date
                        </label>
                      </div>
                      <div className="col-4 d-flex align-self-center justify-content-end">
                        <input
                          type="date"
                          className="form-control py-1 new-input"
                          placeholder="placeholder"
                          value={hospitalNameCodeState?.statusexpirationdate}
                          onChange={(e) => { handleHospitalNameCodeState("statusexpirationdate", e.target.value); setIsChange(true); }}
                          min={new Date().toISOString().split("T")[0]}
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
                placeholder='Search By Hospital Name Code...'
                value={searchValue1}
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'hospitalnamecode', 'hospitalname')
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
                placeholder='Search By Hospital Name...'
                value={searchValue2}
                onChange={(e) => {
                  setSearchValue2(e.target.value);
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'hospitalnamecode', 'hospitalname')
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
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              striped
              highlightOnHover
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
                {effectiveScreenPermission.AddOK && !hospitalNameCodeState?.HospitalNameCodeID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => handelSave()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!hospitalNameCodeState?.HospitalNameCodeID ? (
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

export default HospitalNameCodeSection;