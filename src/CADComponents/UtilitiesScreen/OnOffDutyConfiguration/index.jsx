import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';
import { getShowingDateText, tableCustomStyles } from '../../../Components/Common/Utility';
import { compareStrings } from '../../../CADUtils/functions/common';
import { toastifySuccess } from '../../../Components/Common/AlertMsg';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import useObjState from '../../../CADHook/useObjState';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';

function OnOffDutyConfiguration() {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState("1");
  const [loginPinID, setLoginPinID] = useState(1);
  const [isChange, setIsChange] = useState(false);
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [loginAgencyID, setLoginAgencyID] = useState();
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    onOffDutyState,
    setOnOffDutyState,
    handleOnOffDutyState,
    clearOnOffDutyState,
  ] = useObjState({
    rowsOfResource: "",
    agencyCode: "",
    MultiAgency_Name: "",
  })

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

  const getMasterOnOfDutyConfigurationKey = `/CAD/MasterOnOfDutyConfiguration/GetMasterOnOfDutyConfiguration`;
  const { data: getOnOffDutyConfData, isSuccess: isFetchGetOnOffDutyConf, refetch, isError: isNoData } = useQuery(
    [getMasterOnOfDutyConfigurationKey, {
      IsActive: parseInt(pageStatus),
      AgencyID: loginAgencyID,
      IsSuperAdmin: isSuperAdmin,
      PINID: loginPinID,
    },],
    MasterTableListServices.getMasterOnOfDutyConfiguration,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );

  useEffect(() => {
    if (getOnOffDutyConfData && isFetchGetOnOffDutyConf) {
      const data = JSON.parse(getOnOffDutyConfData?.data?.data);
      setFilterListData(data?.Table)
      setListData(data?.Table)
      setEffectiveScreenPermission(data?.Table1?.[0]);
      setIsChange(false);
      const val = { OnOfDutyconfigurationID: data?.Table[0]?.OnOfDutyconfigurationID, AgencyID: loginAgencyID, }
      fetchPostData('CAD/MasterOnOfDutyConfiguration/GetSingleData_OnOfDutyconfiguration', val).then((res) => {
        if (res) {
          setOnOffDutyState({
            rowsOfResource: res[0]?.OnOfDutyconfigurationNO,
            id: res[0]?.OnOfDutyconfigurationID,
            agencyCode: res[0]?.AgencyID,
            MultiAgency_Name: res[0]?.MultiAgency_Name,
          })
          setMultiSelected({
            optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
            ) : '',
          });
        }
        else { setOnOffDutyState({}) }
      })
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [getOnOffDutyConfData, isFetchGetOnOffDutyConf])


  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID)
      setLoginPinID(localStoreData?.PINID);
      setIsSuperAdmin(localStoreData?.IsSuperadmin);
    }
  }, [localStoreData]);

  const columns = [
    {
      name: 'Operator Name',
      selector: row => row.PIKI,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.PIKI, rowB.PIKI),
      style: {
        position: "static",
      },
    },
    {
      name: 'No. of Rows For Unit',
      selector: row => row.OnOfDutyconfigurationNO,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.OnOfDutyconfigurationNO, rowB.OnOfDutyconfigurationNO),
      style: {
        position: "static",
      },
    },
    {
      name: 'Created Date/Time',
      selector: row => row.ModifiedDtTm ? getShowingDateText(row.ModifiedDtTm) : getShowingDateText(row.CreatedDtTm),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ModifiedDtTm, rowB.ModifiedDtTm),
      width: "20%",
      style: {
        position: "static",
      },
    },
  ]

  function handelCancel() {
    clearOnOffDutyState()
  }

  const handelSave = async () => {
    const isUpdate = Boolean(onOffDutyState?.id);
    const payload = {
      AgencyID: onOffDutyState?.agencyCode,
      OnOfDutyconfigurationNO: onOffDutyState?.rowsOfResource,
      PINID: loginPinID,
      CreatedByUserFK: isUpdate ? undefined : loginPinID,
      ModifiedByUserFK: isUpdate ? loginPinID : undefined,
      OnOfDutyconfigurationID: isUpdate ? onOffDutyState?.id : undefined,
      MultiAgency_Name: onOffDutyState?.MultiAgency_Name,
    };

    const response = isUpdate
      ? await MasterTableListServices.updateMasterOnOfDutyConfiguration(payload)
      : await MasterTableListServices.insertMasterOnOfDutyConfiguration(payload);

    if (response?.status === 200) {
      toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
      handelCancel();
      refetch();
      setIsChange(false);
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
      setOnOffDutyState({
        ...onOffDutyState,
        'agencyCode': id.toString(), 'MultiAgency_Name': name.toString()
      })
    }
  }

  return (
    <>
      <div className='utilities-tab-content-main-container'>
        <div className='utilities-tab-content-form-container'>
          <div className="row">
            <div className='utilities-tab-content-form-main'>
              <div className="row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    No. Of Rows For Unit
                  </label>
                </div>
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <input
                    name="rowsOfResource"
                    type="number"
                    className="form-control py-1 new-input requiredColor"
                    placeholder='No. Of Rows For Unit'
                    value={onOffDutyState?.rowsOfResource}
                    onChange={(e) => { handleOnOffDutyState("rowsOfResource", e.target.value); setIsChange(true) }}
                  />
                </div>
              </div>
              <div className='row'>
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
                noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                pagination
                responsive
                striped
                persistTableHead={true}
                highlightOnHover
                fixedHeader
              // onRowClicked={(row) => {
              //   handelSetEditData(row);
              // }}
              />
            </div>
            {parseInt(pageStatus) === 1 &&
              <div className="utilities-tab-content-button-container" >
                {effectiveScreenPermission && (
                  <>
                    {effectiveScreenPermission.AddOK && !onOffDutyState?.id ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        disabled={!isChange}
                        onClick={() => handelSave()}
                      >
                        Save
                      </button>
                    ) : effectiveScreenPermission.ChangeOK && !!onOffDutyState?.id ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        disabled={!isChange}
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
      </div>
      {/* <CADConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirm={handelActiveInactive} confirmType={confirmType} /> */}
    </>
  )
}

export default OnOffDutyConfiguration