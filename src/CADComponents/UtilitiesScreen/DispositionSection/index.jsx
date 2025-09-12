import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import { tableMinCustomStyles } from '../../../Components/Common/Utility';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { compareStrings, isEmpty } from '../../../CADUtils/functions/common';
import useObjState from '../../../CADHook/useObjState';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import Tooltip from '../../Common/Tooltip';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

function DispositionSection() {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuperadmin, setIsSuperadmin] = useState(0);
  const [agencyID, setAgencyID] = useState(0);
  const [PINID, setPINID] = useState(0);
  const [isActive, setIsActive] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [confirmType, setConfirmType] = useState('');
  const [loginPinID, setLoginPinID] = useState(1);
  const [isDisabled, setIsDisabled] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    dispositionState,
    setDispositionState,
    handleDispositionState,
    clearDispositionState,
  ] = useObjState({
    code: "",
    agencyCode: "",
    description: "",
    Agency: "",
    RMSIncident: false,
    IsEditable: false,
    IsCADDisposition: false,
    IsActive: true,
    MultiAgency_Name: '',
    cfsLaw: false,
    cfsFire: false,
    cfsEmergencyMedicalService: false,
    cfsOther: false,
  })

  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })

  const [
    errorDispositionState,
    ,
    handleErrorDispositionState,
    clearErrorDispositionState, ,
  ] = useObjState({
    code: false,
    description: false,
    agencyTypes: false,
  });

  const columns = [
    {
      name: 'Code',
      selector: row => row.DispositionCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.DispositionCode, rowB.DispositionCode),
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
      cell: (row) => (
        <Tooltip text={row?.Description || ''} maxLength={35} isSmall />
      ),
    },
    {
      name: 'RMS Incident#',
      selector: row => row.CaseRequired ? "Yes" : "No",
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CaseRequired, rowB.CaseRequired),
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

  const getAgencyCodeKey = `/CAD/MasterAgency/MasterAgencyCode`;
  const { data: getAgencyCodeData, isSuccess: isFetchAgencyCode } = useQuery(
    [getAgencyCodeKey, {},],
    MasterTableListServices.getAgencyCode,
    {
      refetchOnWindowFocus: false,
    }
  );

  const getDispositionskey = `/CAD/MasterIncidentDispositions/GetData_IncidentDispositions`;
  const { data: getDispositionsData, isSuccess: isFetchDispositions, refetch, isError: isNoData } = useQuery(
    [getDispositionskey, {
      "IsActive": pageStatus,
      "IsSuperAdmin": isSuperadmin,
      "AgencyID": agencyID,
      "PINID": PINID
    },],
    MasterTableListServices.getIncidentDispositions,
    {
      refetchOnWindowFocus: false,
      enabled: !!agencyID && !!PINID,
      retry: 0
    }
  );

  useEffect(() => {
    if (getDispositionsData && isFetchDispositions) {
      const data = JSON.parse(getDispositionsData?.data?.data);
      setFilterListData(data?.Table)
      setListData(data?.Table)
      setEffectiveScreenPermission(data?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [getDispositionsData, isFetchDispositions])

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
      setAgencyID(localStoreData?.AgencyID)
      setPINID(localStoreData?.PINID)
      setIsSuperadmin(localStoreData?.IsSuperadmin);
    }
  }, [localStoreData]);

  function onCancel() {
    clearDispositionState();
    clearErrorDispositionState();
    setMultiSelected({
      optionSelected: null
    });
    setIsChange(false);
  }

  async function handelActiveInactive() {
    const data = {
      "IsActive": isActive,
      "IncidentDispositionsID": activeInactiveData?.IncidentDispositionsID,
      "DeletedByUserFK": loginPinID,
    }
    const response = await MasterTableListServices.changeStatusIncidentDispositions(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      refetch();
    }
    setShowModal(false);
    onCancel();
  }

  const validation = () => {
    let isError = false;
    const keys = Object.keys(errorDispositionState);
    keys.map((field) => {
      if (
        field === "code" &&
        isEmpty(dispositionState[field])) {
        handleErrorDispositionState(field, true);
        isError = true;
      } else if (field === "description" && isEmpty(dispositionState[field])) {
        handleErrorDispositionState(field, true);
        isError = true;
      } else if (field === "agencyTypes" && (dispositionState.cfsLaw === false && dispositionState.cfsFire === false && dispositionState.cfsEmergencyMedicalService === false && dispositionState.cfsOther === false)) {
        handleErrorDispositionState(field, true);
        isError = true;
      } else {
        handleErrorDispositionState(field, false);
      }
      return null;
    });
    return !isError;
  };

  async function handleSave() {
    if (!validation()) return
    const isUpdate = !!dispositionState?.IncidentDispositionsID;
    setIsDisabled(true)

    const result = listData?.find(item => {
      if (item.DispositionCode) {
        const code = dispositionState?.code?.toLowerCase();
        return code && item.DispositionCode.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.Description) {
        const description = dispositionState?.description?.toLowerCase();
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
        // "Action": isUpdate ? "UpdateIncidentDispositions" : "InsertIncidentDispositions",
        "IncidentDispositionsID": isUpdate ? dispositionState?.IncidentDispositionsID : undefined,
        "DispositionCode": dispositionState?.code,
        "Description": dispositionState?.description,
        "CreatedByUserFK": loginPinID,
        "AgencyID": dispositionState?.agencyCode,
        "CaseRequired": dispositionState?.RMSIncident ? 1 : 0,
        "IsActive": dispositionState?.IsActive,
        "MultiAgency_Name": dispositionState?.MultiAgency_Name,
        CFSL: dispositionState?.cfsLaw ? 1 : 0,
        CFSF: dispositionState?.cfsFire ? 1 : 0,
        CFSE: dispositionState?.cfsEmergencyMedicalService ? 1 : 0,
        OTHER: dispositionState?.cfsOther ? 1 : 0,
      };

      let response;
      if (isUpdate) {
        response = await MasterTableListServices.updateMasterDisposition(data);
      } else {
        response = await MasterTableListServices.insertMasterDisposition(data);
      }

      if (response?.status === 200) {
        toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
        onCancel();
        refetch();
      }
    }
    setIsDisabled(false)
  }


  function handelSetEditData(data) {
    const val = { IncidentDispositionsID: data?.IncidentDispositionsID, }
    fetchPostData('/CAD/MasterIncidentDispositions/GetSingleData_IncidentDispositions', val).then((res) => {
      if (res) {
        setDispositionState({
          IncidentDispositionsID: res[0]?.IncidentDispositionsID,
          code: res[0]?.DispositionCode,
          agencyCode: res[0]?.AgencyID,
          description: res[0]?.Description,
          IsActive: res[0]?.IsActive,
          RMSIncident: res[0]?.CaseRequired,
          MultiAgency_Name: res[0]?.MultipleAgency,
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
      else { setDispositionState({}) }
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.IncidentDispositionsID === dispositionState?.IncidentDispositionsID,
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
      setDispositionState({
        ...dispositionState,
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
                <span className={`nav-item ${pageStatus === true ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(true); setSearchValue1(""); setSearchValue2(""); onCancel() }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === true ? 'Red' : '' }}>Active</span>
                <span className={`nav-item ${pageStatus === false ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(false); setSearchValue1(""); setSearchValue2(""); onCancel() }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === false ? 'Red' : '' }}>InActive</span>
              </ul>
            </div>    {
              pageStatus ?
                <>
                  <div className='utilities-tab-content-form-main'>
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Code
                          {errorDispositionState.code && isEmpty(dispositionState?.code) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          name="Code"
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Code'
                          onKeyDown={handleSpecialKeyDown}
                          value={dispositionState?.code}
                          onChange={(e) => { handleDispositionState("code", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Description
                          {errorDispositionState.description && isEmpty(dispositionState?.description) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Description"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-4 d-flex align-self-center justify-content-end">
                        <input
                          name="description"
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Description'
                          value={dispositionState?.description}
                          onChange={(e) => { handleDispositionState("description", e.target.value); setIsChange(true); }}
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
                    <div className="row">
                      <div className="col-2 d-flex align-self-start justify-content-end">
                        <label for="" className="tab-form-label" style={{ marginTop: "10px", whiteSpace: 'nowrap', marginRight: '10px' }}>
                          Required Agency Types{errorDispositionState.agencyTypes && dispositionState.cfsLaw === false && dispositionState.cfsFire === false && dispositionState.cfsEmergencyMedicalService === false && dispositionState.cfsOther === false && (
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
                              checked={dispositionState.cfsLaw}
                              onChange={(e) => { handleDispositionState("cfsLaw", e.target.checked); setIsChange(true); }}
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
                              checked={dispositionState.cfsFire}
                              onChange={(e) => { handleDispositionState("cfsFire", e.target.checked); setIsChange(true); }}
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
                              checked={dispositionState.cfsEmergencyMedicalService}
                              onChange={(e) => { handleDispositionState("cfsEmergencyMedicalService", e.target.checked); setIsChange(true); }}
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
                              checked={dispositionState.cfsOther}
                              onChange={(e) => { handleDispositionState("cfsOther", e.target.checked); setIsChange(true); }}

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
                    <div className="row">
                      {/* <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Agency
                        </label>
                      </div>
                      <div className="col-5 d-flex align-self-center justify-content-end">
                        <Select
                          isClearable
                          styles={coloredStyle_Select}
                          placeholder="Select"
                          value={dispositionState?.Agency}
                          options={agencyCodeDropDown}
                          getOptionLabel={(v) => v?.ShortName}
                          getOptionValue={(v) => v?.AgencyID}
                          onChange={(e) => { handleDispositionState("Agency", e) }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
                      </div> */}
                      <div className="col-4 agency-checkbox-item offset-2">
                        <input
                          type="checkbox"
                          name="RMSIncident"
                          checked={dispositionState.RMSIncident}
                          onChange={(e) => { handleDispositionState("RMSIncident", e.target.checked); setIsChange(true); }}
                        />
                        <div className="agency-checkbox-text-container tab-form-label">
                          <span>Generate RMS Incident#</span>
                        </div>
                      </div>
                      {/* <div className="col-2 agency-checkbox-item">
                        <input
                          type="checkbox"
                          name="CaseRequired"
                        // checked={CFSCodeState.CaseRequired}
                        // onChange={(e) => { handleCFSCodeState("CaseRequired", e.target.checked) }}
                        />
                        <div className="agency-checkbox-text-container tab-form-label">
                          <span>Is Editable</span>
                        </div>
                      </div> */}
                    </div>
                    {/* <div className="row">
                      <div className="col-5 offset-2 agency-checkbox-item">
                        <input
                          type="checkbox"
                          name="CaseRequired"
                        // checked={CFSCodeState.CaseRequired}
                        // onChange={(e) => { handleCFSCodeState("CaseRequired", e.target.checked) }}
                        />
                        <div className="agency-checkbox-text-container tab-form-label">
                          <span>Is CAD Disposition</span>
                        </div>
                      </div>
                    </div> */}
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
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'DispositionCode', 'Description')
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
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'DispositionCode', 'Description')
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
              customStyles={tableMinCustomStyles}
              pagination
              responsive
              conditionalRowStyles={conditionalRowStyles}
              striped
              persistTableHead={true}
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              highlightOnHover
              fixedHeader
              onRowClicked={(row) => {
                handelSetEditData(row);
              }}
            />
          </div>
          {pageStatus &&
            <div className="utilities-tab-content-button-container" >
              <button type="button" className="btn btn-sm btn-success" onClick={() => onCancel()} >New</button>
              {effectiveScreenPermission && (
                <>
                  {effectiveScreenPermission.AddOK && !dispositionState?.IncidentDispositionsID ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      disabled={!isChange}
                      onClick={() => handleSave()}
                    >
                      Save
                    </button>
                  ) : effectiveScreenPermission.ChangeOK && !!dispositionState?.IncidentDispositionsID ? (
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
  )
}

export default DispositionSection