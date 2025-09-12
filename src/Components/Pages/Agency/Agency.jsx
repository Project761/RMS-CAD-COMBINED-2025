// Import Component
import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate } from '../../hooks/Api';
import Dropdown from 'react-bootstrap/Dropdown';
import DeletePopUpModal from '../../Common/DeleteModal';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import { toastifySuccess, toastifyError } from '../../Common/AlertMsg';
import { Three_Search_Filter } from '../../Filter/Filter';

const Agency = () => {

    const { agencyData, agencyFilterData, getAgency, setAgencyFilterData, setAgencyID, setAgencyName, setStatus,
        localStoreArray, setLocalStoreArray, get_LocalStorage, LoginPinID, setLoginPinID, LoginAgencyID, setLoginAgencyID, setAllowMultipleLogin, storeData, deleteStoreData } = useContext(AgencyContext);

    // Hooks Initialization
    const [rowAgencyID, setRowAgencyID] = useState();
    
    const [filterAgencyNameOption, setFilterAgencyNameOption] = useState('Contains');
    const [filterAgencyORIOption, setFilterAgencyORIOption] = useState('Contains');
    const [filterAgencyPhoneOption, setFilterAgencyPhoneOption] = useState('Contains');
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [searchValue3, setSearchValue3] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IsSuperadmin: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setAllowMultipleLogin(localStoreArray?.IsSuperadmin);
                getAgency(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // Table Columns Array
    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    <Link to={`/agencyTab?id=U2FsdGVkX1${row.AgencyID}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => { setEditValue(row); }}
                        className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                    </Link>
                </div>
        },
        {
            name: 'ORI',
            selector: (row) => row.ORI.toUpperCase(),
            sortable: true
        },
        {
            name: 'Agency Name',
            selector: (row) => row.Agency_Name
        },
        {
            name: 'Short Name',
            selector: (row) => row.Short_Name,
            sortable: true
        },
        {
            name: 'Municipality Code',
            selector: (row) => row.MunicipalityCode,
            sortable: true
        },
        {
            name: 'Phone',
            selector: (row) => row.Agency_Phone,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 53 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>
                    <Link to={`#`} onClick={(e) => { setRowAgencyID(row.AgencyID); setAgencyName(row.Agency_Name) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </Link>
                </div>

        }
    ]

    const setEditValue = (row) => {
        if (row.AgencyID) {
            setAgencyID(row.AgencyID); setAgencyName(row.Agency_Name); setStatus(true); localStorage.setItem('status', true);
            setLocalStoreArray({ ...localStoreArray, 'LocalAgencyID': row?.AgencyID, 'LocalAgencyName': row?.Agency_Name })
            storeData({ 'LocalAgencyID': row?.AgencyID, 'LocalAgencyName': row?.Agency_Name });
        }
    }

    const on_plusAgency = () => {
        
        localStorage.setItem('status', false); setStatus(false); setRowAgencyID(); setAgencyName()
    }

    // Delete Agency
    const delete_Agency = () => {
        const value = {
            'AgencyID': rowAgencyID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('Agency/AgencyDelete', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                getAgency(LoginAgencyID, LoginPinID)
            } else {
                toastifyError(data.Message)
            }
        });
    }

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 px-2">
                                        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0">Agency</p>
                                            <p className="p-0 m-0">
                                                <Link to={`/agencyTab?id=U2FsdGVkX1000/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} className="btn btn-sm bg-green text-white px-2 py-0"
                                                    data-toggle="modal" data-target="" onClick={() => { on_plusAgency(); }} >
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <DataTable
                                    columns={columns}
                                    dense
                                    data={agencyFilterData}
                                    pagination
                                    paginationPerPage={'10'}
                                    paginationRowsPerPageOptions={[10, 15, 20]}
                                    highlightOnHover
                                    subHeader
                                    showPaginationBottom={agencyFilterData?.length > 10 ? true : false}
                                    subHeaderComponent={
                                        <div className="col-12 pl-0 ml-0">
                                            <div className="row">
                                                <div className="col-3">
                                                    <input type="text" onChange={(e) => {
                                                        setSearchValue1(e.target.value)
                                                        const result = Three_Search_Filter(agencyData, e.target.value, searchValue2, searchValue3, filterAgencyORIOption, 'ORI', 'Agency_Name', 'Agency_Phone')
                                                      
                                                        setAgencyFilterData(result)
                                                    }} className='form-control' placeholder='Search By ORI ...' />
                                                </div>
                                               
                                                <div className='col-1'>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                            <i className="fa fa-filter"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => setFilterAgencyORIOption('Contains')}>Contains</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyORIOption('is equal to')}>is equal to</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyORIOption('is not equal to')}>is not equal to </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyORIOption('Starts With')}>Starts With</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyORIOption('End with')}>End with</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                                <div className="col-3">
                                                    <input type="text" onChange={(e) => {
                                                        setSearchValue2(e.target.value)
                                                        const result = Three_Search_Filter(agencyData, searchValue1, e.target.value, searchValue3, filterAgencyNameOption, 'ORI', 'Agency_Name', 'Agency_Phone')
                                                        setAgencyFilterData(result)
                                                    }} className='form-control' placeholder='Search By Agency Name ...' />
                                                </div>
                                                <div className='col-1'>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                            <i className="fa fa-filter"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => setFilterAgencyNameOption('Contains')}>Contains</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyNameOption('is equal to')}>is equal to</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyNameOption('is not equal to')}>is not equal to </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyNameOption('Starts With')}>Starts With</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyNameOption('End with')}>End with</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>

                                                <div className="col-3">
                                                    <input type="text" onChange={(e) => {
                                                        
                                                        setSearchValue3(e.target.value)
                                                        const result = Three_Search_Filter(agencyData, searchValue1, searchValue2, e.target.value, filterAgencyPhoneOption, 'ORI', 'Agency_Name', 'Agency_Phone')
                                                        setAgencyFilterData(result)
                                                    }} className='form-control' placeholder='Search By Phone ...' />
                                                </div>
                                                <div className='col-1'>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                            <i className="fa fa-filter"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => setFilterAgencyPhoneOption('Contains')}>Contains</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyPhoneOption('is equal to')}>is equal to</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyPhoneOption('is not equal to')}>is not equal to </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyPhoneOption('Starts With')}>Starts With</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => setFilterAgencyPhoneOption('End with')}>End with</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    subHeaderAlign='left'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={delete_Agency} />
        </>
    )
}

export default Agency