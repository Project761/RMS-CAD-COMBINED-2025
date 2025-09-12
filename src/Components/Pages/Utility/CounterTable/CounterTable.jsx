import { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DataTable from 'react-data-table-component';
import { fetchPostData } from '../../../hooks/Api';
import { One_Value_Search_Filter } from '../../../Filter/Filter';
import CounterTableAddUp from './CounterTableAddUp';
import { useSelector } from 'react-redux';
import { tableCustomStyles } from '../../../Common/Utility';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import { useDispatch } from 'react-redux';

const CounterTable = () => {

  
  const dispatch = useDispatch();

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const [dataList, setDataList] = useState();
  const [editList, setEditList] = useState();
  const [dataListFillter, setDataListFillter] = useState([])
  const [filterOption, setFilterOption] = useState('Contains');
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0)
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [modal, setModal] = useState(false)

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      dispatch(get_ScreenPermissions_Data("U114", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  useEffect(() => {
    if (loginAgencyID) {
      get_Data_List();
    }
  }, [loginAgencyID])

  const get_Data_List = () => {
    fetchPostData('Counter/GetData_SysCounter', { 'AgencyID': loginAgencyID })
      .then((res) => {
        if (res) {
          setDataList(res); setDataListFillter(res);
        }
        else { setDataList(); setDataListFillter(); }
      })
  }

  // Table Columns Array
  const columns = [
    {
      name: 'Counter Description', selector: (row) => row.CounterDesc, sortable: true
    },
    {
      name: 'Counter Format', selector: (row) => row.Counter_Format, sortable: true
    },
    {
      name: 'When Reset', selector: (row) => row.WhenReset, sortable: true
    },
    {
      name: 'Last Number', selector: (row) => row.Last_Number, sortable: true
    },
    {
      name: 'System Generated', selector: (row) => row.IsSystemGenerated, sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 50 }}>Action</p>,
      cell: row =>
        
        <div style={{ position: 'absolute', top: 0, right: 40 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
              <Link to="/CounterTable" data-toggle="modal" data-target="#CounterModal" onClick={(e) => { setEditValue(e, row); }}
                className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
              </Link>
              : <></> :
              <Link to="/CounterTable" data-toggle="modal" data-target="#CounterModal" onClick={(e) => { setEditValue(e, row); }}
                className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
              </Link>
          }
        </div>

    }
  ]

  const setEditValue = (e, row) => {
    setModal(true); setUpdateStatus(updateStatus + 1); setEditList(row); setStatus(true);
  }

  return (
    <>
      <div className="section-body view_page_design pt-3">
        <div className="row clearfix">
          <div className="col-12 col-sm-12">
            <div className="card Agency">
              <div className="card-body">
                <div className="row " style={{ position: 'sticky', top: '0px' }}>
                  <div className="col-12 col-md-12 col-lg-12 ">
                    <div className="row mt-2">
                      <div className="col-12 ">
                        <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                          <p className="p-0 m-0">Counter Table</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-2 ">
                    <div className="row">
                      <div className="col-5">
                        <input type="text" onChange={(e) => {
                          const result = One_Value_Search_Filter(dataList, e.target.value, filterOption, 'CounterDesc')
                          setDataListFillter(result)
                        }}
                          className='form-control' placeholder='Search By Name...' />
                      </div>
                      <div className='col-1'>
                        <Dropdown>
                          <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            <i className="fa fa-filter"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFilterOption('Contains')}>Contains</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterOption('is equal to')}>is equal to</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterOption('is not equal to')}>is not equal to </Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterOption('Starts With')}>Starts With</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFilterOption('End with')}>End with</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-responsive mt-2">
                  <div className="col-12">
                    <div className="row ">
                      <div className="col-12">
                        <DataTable
                          columns={columns}
                          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? dataListFillter : [] : dataListFillter}
                          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                          dense
                          persistTableHead={true}
                          customStyles={tableCustomStyles}
                          paginationPerPage={'20'}
                          paginationRowsPerPageOptions={[20, 30]}
                          highlightOnHover
                          noContextMenu
                          pagination
                          responsive
                          subHeaderAlign="right"
                          subHeaderWrap
                          fixedHeader
                          fixedHeaderScrollHeight="400px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CounterTableAddUp {...{ modal, status, editList, setModal, get_Data_List, updateStatus, loginAgencyID }} />
    </>
  )
}

export default CounterTable