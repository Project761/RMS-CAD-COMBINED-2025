
import { useState, useEffect, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetch_Post_Data, } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { Filter } from '../../../../Filter/Filter';
import EmployeeTypeAddUp from './EmployeeTypeAddUp';

const EmployeeType = () => {
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()
  const [employeeTypeData, setEmployeeTypeData] = useState();
  const [status, setStatus] = useState(false);
  const [pageStatus, setPageStatus] = useState("1")
  const [modal, setModal] = useState(false)
  // FilterData 
  const [filterEmployeeIdOption, setFilterEmployeeIdOption] = useState('Contains');
  const [filterEmployeeTypeDescOption, setFilterEmployeeTypeDescOption] = useState('Contains');
  const [employeeFilterData, setEmployeeFilterData] = useState();
  const [relationUpdStatus, setRelationUpdStatus] = useState(0)
  const [searchValue1, setSearchValue1] = useState('')
  const [searchValue2, setSearchValue2] = useState('')

  useEffect(() => {
    get_data_EmployeeType();
  }, [pageStatus])


  const get_data_EmployeeType = () => {

    fetch_Post_Data('TableManagement/GetData_EmployeeType',)
      .then((res) => {
        if (res) {
          setEmployeeTypeData(res?.Data)
          setEmployeeFilterData(res?.Data);
          setEffectiveScreenPermission(res?.Permision)
        }
        else { setEmployeeTypeData(); setEmployeeFilterData(); setEffectiveScreenPermission() }
      })
  }

  const [isActive, setIsActive] = useState('')
  const [employeeTypeID, setEmployeeTypeID] = useState('')
  const [confirmType, setConfirmType] = useState('')

  const UpdActiveDeactive = () => {
    const value = {
      'IsActive': isActive,
      'EmployeeTypeID': employeeTypeID,
    }
    AddDeleteUpadate('TableManagement/DeleteEmployeeType', value)
      .then(res => {
        if (res.success) {
          toastifySuccess(res.Message);
          get_data_EmployeeType();
        } else {
          toastifyError(res.data.Message)
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }

  // Table Columns Array
  const columns = [
    {
      name: 'Code',
      selector: (row) => row.EmployeeCode,
      sortable: true
    },
    {
      name: 'AgencyCode',
      selector: (row) => row.AgencyCode,
      sortable: true
    },
    {
      name: 'Description',
      selector: (row) => row.Description,
      sortable: true
    },
    {
      name: 'Agency',
      selector: (row) => <>{row?.MultiAgency_Name ? row?.MultiAgency_Name.substring(0, 40) : ''}{row?.MultiAgency_Name?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 40 }}>
          {
            pageStatus === "1" ?
              effectiveScreenPermission ? effectiveScreenPermission[0]?.ChangeOK ?
                <Link to="/ListManagement?page=Employee Type" data-toggle="modal" data-target="#EmployeeTypeModal" onClick={(e) => { setEditValue(e, row) }}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                </Link>
                : <></>
                : <></>
              : <></>
          }

          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              pageStatus === "1" ?
                < Link to="/ListManagement?page=Employee Type" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setEmployeeTypeID(row.employeeTypeID); setIsActive('0'); setConfirmType("InActive") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                </Link>
                :
                <Link to="/ListManagement?page=Employee Type" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setEmployeeTypeID(row.employeeTypeID); setIsActive('1'); setConfirmType("Active") }}
                  className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                  <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                </Link>
              : <></>
              : <></>
          }
        </div>

    }
  ]

  const setEditValue = (e, row) => {
    setRelationUpdStatus(relationUpdStatus + 1); setEmployeeTypeID(row.employeeTypeID)
    setModal(true)
    setStatus(true);
  }

  const setStatusFalse = (e) => {
    setStatus(false);
    setModal(true)
  }


  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6 col-lg-12 ">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" >
              <a className={`nav-link ${pageStatus === '1' ? 'active' : ''}`} onKeyDown={''} onClick={() => setPageStatus("1")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">Active</a>
            </li>
            <li className="nav-item" >
              <a className={`nav-link ${pageStatus === '0' ? 'active' : ''}`} onKeyDown={''} onClick={() => setPageStatus("0")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">InActive</a>
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-12 col-lg-12 ">
          <div className="row mt-2">
            <div className="col-12 ">
              <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                <p className="p-0 m-0">Employee Type</p>
                {
                  pageStatus === '1' ?
                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                      <Link to="/ListManagement?page=Employee Type" className="text-white" onClick={setStatusFalse}
                        data-toggle="modal" data-target="#EmployeeTypeModal" >
                        <i className="fa fa-plus"></i>
                      </Link>
                      : <></>
                      : <Link to="/ListManagement?page=Employee Type" className="text-white" onClick={setStatusFalse}
                        data-toggle="modal" data-target="#EmployeeTypeModal" >
                        <i className="fa fa-plus"></i>
                      </Link>
                    : <></>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-2 ">
          <div className="row">
            <div className="col-5">
              <input type="text" onChange={(e) => {
                setSearchValue1(e.target.value);
                const result = Filter(employeeTypeData, e.target.value, searchValue2, filterEmployeeIdOption, 'EmployeeCode', 'Description')
                setEmployeeFilterData(result)
              }}
                className='form-control' placeholder='Search By Code...' />
            </div>
            <div className='col-1 '>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterEmployeeIdOption('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterEmployeeIdOption('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterEmployeeIdOption('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterEmployeeIdOption('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterEmployeeIdOption('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-5">
              <input type="text" onChange={(e) => {
                setSearchValue2(e.target.value)
                const result = Filter(employeeTypeData, searchValue1, e.target.value, filterEmployeeTypeDescOption, 'EmployeeCode', 'Description')
                setEmployeeFilterData(result)
              }}
                className='form-control' placeholder='Search By Description...' />
            </div>
            <div className='col-1'>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  <i className="fa fa-filter"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterEmployeeTypeDescOption('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterEmployeeTypeDescOption('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterEmployeeTypeDescOption('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterEmployeeTypeDescOption('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterEmployeeTypeDescOption('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="table-responsive mt-2">
          <div className="col-12">
            <div className="row ">
              <div className="col-12">
                <DataTable
                  columns={columns}
                  data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? employeeFilterData : '' : ''}
                  dense
                  paginationPerPage={'10'}
                  paginationRowsPerPageOptions={[5, 10, 15]}
                  highlightOnHover
                  noContextMenu
                  pagination
                  responsive
                  subHeaderAlign="right"
                  subHeaderWrap
                  noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <EmployeeTypeAddUp {...{ employeeTypeID, status, get_data_EmployeeType, employeeTypeData, modal, setModal, relationUpdStatus }} />
      <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
    </>
  )
}

export default EmployeeType