import React, { useContext, useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, colourStyles, getShowingDateText, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import DeletePopUpModal from '../../../Common/DeleteModal';
import { useReactToPrint } from 'react-to-print';
import OtherSummaryModel from '../../SummaryModel/OtherSummaryModel';
import * as XLSX from 'xlsx';
import ArrestPrintReport from './ArrestPrintReport';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';

const ArrestSearch = () => {

  const { arrestSearchData, setArrestSearchData, recentSearchData, setRecentSearchData, searchObject, setSearchObject } = useContext(AgencyContext);
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';


  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  let openPage = query?.get("page");
  let Recent = query?.get("Recent");

  const navigate = useNavigate();
  const [loginPinID, setLoginPinID,] = useState('');
  const [arrestSearchID, setArrestSearchID,] = useState('');
  const [otherSummModal, setOtherSummModal] = useState(false);
  const [incSummModal, setIncSummModal] = useState(false);
  const [otherColID, setOtherColID] = useState('');
  const [otherUrl, setOtherUrl] = useState('');
  const [updateCount, setupdateCount] = useState(1);
  const [otherColName, setOtherColName] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [recentArrestSearchData, setRecentArrestSearchData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [LoginAgencyID, setLoginAgencyID] = useState('');

  const exportToExcel = () => {
    const filteredData = arrestSearchData?.map(item => ({
      'Arrest Date/Time': item.ArrestDtTm ? getShowingDateText(item.ArrestDtTm) : " ",
      'Arrest Number': item.ArrestNumber,
      'Incident Number': item.IncidentNumber,
      'Arrest Type': item.ArrestType_Description,
      'Arrest By': item.GivenBy_Name,
      'Arrestee Name': item.Arrestee_Name,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };



  const columns = [
    {
      grow: 0,
      minWidth: "70px",
      cell: row =>
        <div className="div" >
          {/* <a data-toggle="modal" data-target={`${row?.TransactionName == "Incident" ? "#IncSummaryModel" : "#OtherSummaryModel"}`} */}
          <a data-toggle="modal" data-target="#OtherSummaryModel"
            style={{ textDecoration: 'underline' }}
            onClick={() => {
              console.log(row)
              setupdateCount(updateCount + 1);
              setOtherSummModal(true);
              setOtherColName('ArrestID');
              setOtherColID(row?.ArrestID);
              setOtherUrl('Summary/ArrestSummary');
              setModalTitle("Arrest Summary");
            }}
          >
            MS
          </a>
        </div>
    },
    // {
    //   name: 'Agency Name', selector: (row) => row.Agency_Name, sortable: true
    // },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      grow: 0,
      minWidth: "70px",
      cell: row =>
        <span onClick={(e) => set_Edit_Value(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
          <i className="fa fa-edit"></i>
        </span>
    },
    {
      name: 'Agency Code',
      selector: (row) => (
        <span title={row?.Agency_Code}>
          {row?.Agency_Code ? row?.Agency_Code.substring(0, 20) : ''}
          {row?.Agency_Code?.length > 20 ? '...' : ''}
        </span>
      ),
      sortable: true
    },

    {

      name: 'Incident Number',
      selector: (row) => row.IncidentNumber,
      sortable: true
    },
    {
      name: 'Arrest Number',
      selector: (row) => row.ArrestNumber,
      sortable: true
    },
    {
      name: 'Arrestee Name', selector: (row) => row.Arrestee_Name, sortable: true
    },

    {
      name: 'Arrest Date/Time',
      selector: (row) => row.ArrestDtTm ? getShowingDateText(row.ArrestDtTm) : " ",
      sortable: true
    },
    {

      name: 'Arrest Type',
      selector: (row) => row.ArrestType_Description,
      sortable: true
    },
    // {

    //   name: 'Primary Offense',
    //   selector: (row) => row.ChargeCode,
    //   sortable: true
    // },
    {
      name: 'Primary Offense',
      selector: (row) => (
        <span title={row?.ChargeCode}>
          {row?.ChargeCode ? row?.ChargeCode.substring(0, 20) : ''}
          {row?.ChargeCode?.length > 20 ? '...' : ''}
        </span>
      ),
      sortable: true
    },
    {

      name: 'Supervisor Name',
      selector: (row) => row.Supervisor_Name,
      sortable: true
    },

    // {
    //   name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 5 }}>Delete</p>,
    //   cell: row =>
    //     <div className="div" style={{ position: 'absolute', right: 5 }}>
    //       <Link to={`#`} onClick={(e) => setArrestSearchID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
    //         <i className="fa fa-trash"></i>
    //       </Link>
    //     </div>
    // },
  ]

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(parseInt(localStoreData?.AgencyID));
    }
  }, [localStoreData]);

  const set_Edit_Value = (row) => {
    if (row.ArrestID) {
      // console.log(row.ArrestID)
      console.log(row.IncidentID)
      navigate(`/Arrest-Home?page=MST-Arrest-Dash&ArrNo=${row?.ArrestNumber}&IncId=${stringToBase64(row?.IncidentID)}&Name=${row?.Arrestee_Name}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrestSta=${true}&ChargeSta=${true}`);
    }
  }

  const DeleteArrest = () => {
    const val = {
      'ArrestID': arrestSearchID,
      'DeletedByUserFK': loginPinID
    }
    AddDeleteUpadate('Arrest/Delete_Arrest', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
      } else { console.log("Somthing Wrong"); }
    })
  }

  const startRef = React.useRef();
  const startRef1 = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
      startRef1.current.setOpen(false);
    }
  };

  const componentRef = useRef();

  const printForm = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Data',
    onAfterPrint: () => setSelectedStatus(false),
  })

  useEffect(() => {
    if (selectedStatus) {
      printForm();
    }
  }, [selectedStatus]);


  useEffect(() => {
    if (Recent && Recent === 'Arrest' && searchObject?.SearchModule === 'Arr-Search') { setArrestSearchData([]); getArrestRecentSearchData(searchObject); }
  }, [Recent, searchObject]);

  const getArrestRecentSearchData = (searchObject) => {
    fetchPostData('Arrest/Search_Arrest', searchObject).then((res) => {
      if (res) {
        setRecentArrestSearchData(res);
      }
      else {
        setRecentArrestSearchData([]);
      }
    })
  }

  useEffect(() => {
    if (LoginAgencyID) {
      getAgencyImg(LoginAgencyID);
    }
  }, [LoginAgencyID]);

  const getAgencyImg = (LoginAgencyID) => {
    const val = { 'AgencyID': LoginAgencyID }
    fetchPostData('Agency/GetData_AgencyWithPhoto', val).then((res) => {
      if (res) {
        setSearchData(res[0]);
      }
      else {
        setSearchData([]);
      }
    })
  }


  return (
    <>
      <div className="section-body view_page_design pt-1">
        <div className="row clearfix" >
          <div className="col-12 col-sm-12">
            <div className="card Agency name-card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12 " >
                    <DataTable
                      dense
                      columns={columns}
                      data={Recent === 'Arrest' && searchObject?.SearchModule === 'Arr-Search' ? recentArrestSearchData : arrestSearchData}
                      // data={arrestSearchData?.length > 0 ? arrestSearchData : recentArrestSearchData}
                      selectableRowsHighlight
                      highlightOnHover
                      fixedHeader
                      pagination
                      paginationPerPage={'100'}
                      paginationRowsPerPageOptions={[100, 150, 200, 500]}
                      showPaginationBottom={100}
                      persistTableHead={true}
                      customStyles={tableCustomStyles}
                      responsive
                      fixedHeaderScrollHeight='450px'
                    />
                  </div>
                  <div className="btn-box text-right col-12 mr-1 mt-4 pt-3 ">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary mr-1"
                      onClick={() => setSelectedStatus(true)}
                    >
                      <i className="fa fa-print mr-1"></i>
                      Print Preview
                    </button>
                    <button type="button" onClick={exportToExcel} className="btn btn-sm btn-primary mr-1"
                    >
                      <i className="fa fa-file-excel-o mr-1" aria-hidden="true"></i>
                      Export to Excel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {
        advancedSearch &&
        <dialog className="modal top fade " style={{ background: "rgba(0,0,0, 0.5)" }} id="ArrestSearchModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog  modal-xl">
            <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0px 0px 3px floralwhite' }}>
              <div className="modal-header px-3 p-2" style={{ backgroundColor: 'aliceblue', boxShadow: '0px 0px 2px dimgray' }}>
                <h5 className="modal-title">Arrest Advance Search</h5>
                <button type="button" className="close btn-modal" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="m-1 ">
                  <div className="row">
                    <div className="col-12">
                      <fieldset className='fieldset'>
                        <legend>Arrest Information</legend>
                        <div className="row">
                          <div className="col-6 col-md-3 mt-1">
                            <div className="text-field">
                              <input type="text" id='ArrestNumber' name='ArrestNumber' value={value?.ArrestNumber} onChange={HandleChange} />
                              <label className=''>Arrest Number From</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mt-1">
                            <div className="text-field">
                              <input type="text" id='ArrestNumberTo' name='ArrestNumberTo' value={value?.ArrestNumberTo} onChange={HandleChange} />
                              <label className=''>Arrest Number To</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mb-1">
                            <div className="dropdown__box">
                              <DatePicker
                                id='ArrestDtTm'
                                name='ArrestDtTm'
                                ref={startRef}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setArrestFromDate(date); setValue({ ...value, ['ArrestDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy"
                                autoComplete='Off'
                                timeInputLabel
                                maxDate={new Date()}
                                isClearable
                                showYearDropdown
                                dropdownMode="select"
                                selected={arrestFromDate}
                                placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                              />
                              <label htmlFor="" className='pt-1'>Arrest From Date</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mb-1">
                            <div className="dropdown__box">
                              <DatePicker
                                id='ArrestDtTmTo'
                                name='ArrestDtTmTo'
                                ref={startRef1}
                                onKeyDown={onKeyDown}
                                onChange={(date) => { setArrestToDate(date); setValue({ ...value, ['ArrestDtTmTo']: date ? getShowingWithOutTime(date) : null }) }}
                                className=''
                                dateFormat="MM/dd/yyyy"
                                autoComplete='Off'
                                timeInputLabel
                                minDate={arrestFromDate}
                                maxDate={new Date()}
                                isClearable
                                showYearDropdown
                                dropdownMode="select"
                                selected={arrestToDate}
                                placeholderText={value?.ArrestDtTmTo ? value.ArrestDtTmTo : 'Select...'}
                              />
                              <label htmlFor="" className='pt-1'>Arrest To Date</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-4 col-lg-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='IncidentNumber' name='IncidentNumber' value={value?.IncidentNumber} onChange={HandleChange} />
                              <label className=''>Incident</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='PrimaryOfficerID'
                                styles={colourStyles}
                                menuPlacement='bottom'
                                value={headOfAgency?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                isClearable
                                options={headOfAgency}
                                onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Arresting Officer</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='ChargeCodeID'
                                styles={colourStyles}
                                value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                                isClearable
                                options={chargeCodeDrp}
                                onChange={(e) => ChangeDropDown(e, 'ChargeCodeID')}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Charge Code/Description</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='ArrestTypeID'
                                styles={colourStyles}
                                value={arrestTypeDrpData?.filter((obj) => obj.value === value?.ArrestTypeID)}
                                isClearable
                                options={arrestTypeDrpData}
                                onChange={(e) => { ChangeDropDown(e, 'ArrestTypeID') }}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Arrest Type</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name="ArrestingAgencyID"
                                styles={colourStyles}
                                value={agencyNameDrpData?.filter((obj) => obj.value === value?.ArrestingAgencyID)}
                                isClearable
                                options={agencyNameDrpData}
                                onChange={(e) => { ChangeDropDown(e, 'ArrestingAgencyID') }}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Arresting Agency</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                            <div className="dropdown__box">
                              <Select
                                name='JuvenileDispositionID'
                                menuPlacement='bottom'
                                styles={colourStyles}
                                value={juvenileDisDrp?.filter((obj) => obj.value === value?.JuvenileDispositionID)}
                                isClearable
                                options={juvenileDisDrp}
                                onChange={(e) => ChangeDropDown(e, 'JuvenileDispositionID')}
                                placeholder="Select..."
                              />
                              <label htmlFor='' className='mt-0'>Juvenile Disposition</label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <fieldset className='fieldset mt-2'>
                        <legend>Arrestee Information</legend>
                        <div className="row">
                          <div className="col-6 col-md-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='LastName' name='LastName' value={value?.LastName} onChange={HandleChange} />
                              <label className=''>Last Name</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='FirstName' name='FirstName' value={value?.FirstName} onChange={HandleChange} />
                              <label className=''>First Name</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='MiddleName' name='MiddleName' value={value?.MiddleName} onChange={HandleChange} />
                              <label className=''>Middle Name</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-3 mt-2">
                            <div className="text-field">
                              <input type="text" id='SSN' name='SSN' value={value?.SSN} onChange={HandleChange} />
                              <label className=''>SSN</label>
                            </div>
                          </div>
                        </div>
                      </fieldset>
                      <div className="row mt-1 px-2 text-right">
                        <div className="col-12">
                          <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button>
                          <button type="button" data-dismiss="modal" className="btn btn-sm btn-success" >Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      } */}
      <DeletePopUpModal func={DeleteArrest} />
      <OtherSummaryModel
        {...{ otherSummModal, setOtherSummModal, updateCount, openPage, modalTitle }}
        otherColName={otherColName}
        otherColID={otherColID}
        otherUrl={otherUrl}
      />
      {selectedStatus && (
        <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
          <ArrestPrintReport  {...{ componentRef, selectedStatus, setSelectedStatus, arrestSearchData, searchData }} />
        </div>
      )}
    </>
  )
}

export default ArrestSearch