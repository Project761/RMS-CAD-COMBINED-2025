// Import Component
import { useState, useEffect } from 'react'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { toastifySuccess } from '../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { Link } from 'react-router-dom';
import ListPermissionEdit from './ListPermissionEdit';
import Dropdown from 'react-bootstrap/Dropdown';
import { One_Value_Search_Filter } from '../../Filter/Filter';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useSelector } from 'react-redux';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';

const ListPermission = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    // Hooks Initialization
    const [moduleList, setModuleList] = useState([])
    const [dataListFillter, setDataListFillter] = useState([])
    const [editList, setEditList] = useState([])
    const [dataList, setDataList] = useState([])
    const [modal, setModal] = useState(false)
    const [status, setStatus] = useState(false);
    const [filterOption, setFilterOption] = useState('Contains');
    const [loginPinID, setLoginPinID,] = useState('');
    const [searchValue, setSearchValue] = useState("");
    const [LoginAgencyID, setLoginAgencyID] = useState("");
    const [Name, setName] = useState('');

    const [value, setValue] = useState({
        'ApplicationId': '', 'ModuleFK': '', 'TableID': '', 'AgencyID': '',

    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    useEffect(() => {
        if (localStoreData?.AgencyID) {
            setLoginPinID(localStoreData?.AgencyID); setLoginAgencyID(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("U113", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    // Onload Function
    useEffect(() => {
        get_ModuleFK('1');
    }, [])

    const ModuleFKChange = (e) => {
        if (e) {
            setValue({ ...value, ['ModuleFK']: e.value, });
            get_List_Table(e.value); setSearchValue('');
        } else {
            setValue({ ...value, ['ModuleFK']: null });
            setDataListFillter(); setDataList(); setSearchValue('');
        }
    }

    const get_List_Table = (id) => {
        const val = { ModuleId: id }
        fetchPostData('TablePermission/GetData_ListPersmission', val).then(res => {
            if (res) { setDataList(res); setDataListFillter(res) }
            else { setDataList(); setDataListFillter() }
        })

    }

    // Get Module and Application Screen And Group Field permission
    const Update_List = (id, Name) => {
        const val = {
            'ModuleId': value.ModuleFK, 'TableId': id,
            'Name': Name,
            'AgencyID': LoginAgencyID, 'ModifiedByUserFK': loginPinID,
        }
        AddDeleteUpadate('TablePermission/Update_ListPermission', val)
            .then(res => {
                if (res) {
                    toastifySuccess(res.Message); get_List_Table(value.ModuleFK)
                }
            })
    }

    const get_ModuleFK = (id) => {
        const val = { ApplicationId: id, IslstTables: true }
        fetchPostData('ScreenPermission/GetData_Module', val).then(res => {
            if (res) { setModuleList(changeArrayFormat(res, 'modul')) }
            else { setModuleList() }
        })

    }

    // Table Columns Array
    const columns = [
        {
            name: 'Status', selector: (row) => <input type="checkbox"
                checked={row.Status} onChange={(e) => { Update_List(row.TableID, row.Name); setName(row.Name) }} />, sortable: true
        },
        {
            name: 'Name', selector: (row) => row.Name, sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row =>

                <div style={{ position: 'absolute', top: 0, right: 40 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <Link to="/ListPermission" data-toggle="modal" data-target="#EditTypeModal" onClick={(e) => { setEditValue(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i></Link>
                            : <></> :
                            <Link to="/ListPermission" data-toggle="modal" data-target="#EditTypeModal" onClick={(e) => { setEditValue(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i></Link>
                    }
                </div>
        },
    ]

    const setEditValue = (e, row) => {
        setEditList(row); setModal(true); setStatus(true);
    }

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row px-3">
                                    <div className="col-12 pt-2 p-0">
                                        <div className="row ">
                                            <div className="col-6 mt-2 dropdown__box">
                                                <Select
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name="ModuleFK"
                                                    options={moduleList}
                                                    isClearable
                                                    onChange={ModuleFKChange}
                                                />
                                                <label htmlFor="">Module</label>
                                            </div>
                                        </div>
                                        <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">
                                                List-Module Manager
                                            </p>
                                        </div>
                                        <div className="col-12 mt-2 ">
                                            <div className="row">
                                                <div className="col-5">

                                                    <input
                                                        type="text"
                                                        value={searchValue}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            const result = One_Value_Search_Filter(dataList, value, filterOption, 'Name');
                                                            setDataListFillter(result);
                                                            setSearchValue(value);
                                                        }}
                                                        className='form-control'
                                                        placeholder='Search By Name...' />
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
                                        <div className="row ">
                                            <div className="col-12 mt-2">
                                                <DataTable
                                                    columns={columns}
                                                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? dataListFillter : [] : dataListFillter}
                                                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                    dense
                                                    paginationRowsPerPageOptions={[10, 15]}
                                                    highlightOnHover
                                                    noContextMenu
                                                    pagination
                                                    responsive
                                                    subHeaderAlign="right"
                                                    subHeaderWrap
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
            <ListPermissionEdit {...{ loginPinID, modal, setModal, editList, status, get_List_Table }} ModuleFK={value.ModuleFK} />
        </>
    )
}

export default ListPermission

export const changeArrayFormat = (data, type) => {
    if (type === 'modul') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ModulePK, label: sponsor.ModuleName, })
        )
        return result
    }
}




