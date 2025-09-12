import { useEffect, useState, memo, useContext } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetch_Post_Data } from '../../../../hooks/Api';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Filter } from '../../../../Filter/Filter';
import Loader from '../../../../Common/Loader';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import AddUpCom from '../../ListManagement/AddUpCom';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';

const PropertyGunMake = (props) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const { getUrl, col1, col2, col3, col4, openPage, addUrl, singleDataUrl, upUrl, delUrl } = props

    const [pageStatus, setPageStatus] = useState("1")
    const [listData, setListData] = useState([])
    const [fillterListData, setFillterListData] = useState([])
    const [lodaer, setLodaer] = useState(false)
    const [modal, setModal] = useState(false)
    const [id, setId] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0)
    const [status, setStatus] = useState(false);
    const [isActive, setIsActive] = useState('');
    const [confirmType, setConfirmType] = useState('');
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [isSuperadmin, setIsSuperadmin] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [codeSortOrder, setCodeSortOrder] = useState('Asc');
    const [activeColumn, setActiveColumn] = useState('Code');
    const [orderTypeCode, setOrderTypeCode] = useState('Asc');
    const [orderTypeDescription, setOrderTypeDescription] = useState('Asc');
    const [value, setValue] = useState('')

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); setIsSuperadmin(localStoreData?.IsSuperadmin);
            setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID });
            get_data(localStoreData?.AgencyID, localStoreData?.PINID, localStoreData?.IsSuperadmin);
        }
    }, [localStoreData, openPage, pageStatus]);

    useEffect(() => {
        if (getUrl) { setPageStatus('1'); setSearchValue1(''); setSearchValue2('') }
    }, [getUrl])

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue1, searchValue2]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch_Post_Data(getUrl, {
                    PageCount: currentPage,
                    PageRecord: itemsPerPage,
                    AgencyID: '',
                    PropertyGunMakeCode: searchValue1,
                    Description: searchValue2,
                    IsActive: pageStatus,
                    IsSuperAdmin: '1',
                    PINID: '1',
                    OrderTypeDescription: activeColumn === 'Description' ? orderTypeDescription : '',
                    OrderTypeCode: activeColumn === 'Code' ? orderTypeCode : ''
                });

                if (res) {
                    setListData(changeArrayFormat(res?.Data, col1, col2, col3, col4));
                    setFillterListData(changeArrayFormat(res?.Data, col1, col2, col3, col4));
                    setLodaer(true);
                    setEffectiveScreenPermission(res?.Permision);
                    setTotalRows(res?.Data[0]?.Count || 0);
                } else {
                    setListData([]);
                    setFillterListData([]);
                    setLodaer(true);
                    setEffectiveScreenPermission(null);
                    setTotalRows(0);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setListData([]);
                setFillterListData([]);
                setLodaer(true);
                setEffectiveScreenPermission(null);
                setTotalRows(0);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage, searchValue1, searchValue2, getUrl, activeColumn, orderTypeCode, orderTypeDescription]);

    const handleSort = (column, sortDirection) => {
        if (column.name === 'Code') {
            const newSortOrder = codeSortOrder === 'Asc' ? 'Desc' : 'Asc';
            setCodeSortOrder(newSortOrder);
            setOrderTypeCode(newSortOrder);
            setActiveColumn('Code');
        } else if (column.name === 'Description') {
            setOrderTypeDescription(sortDirection);
            setActiveColumn('Description');
        }
    };
    useEffect(() => {
        get_data()
    }, [])

    const get_data = () => {
        const val = {
            PageCount: currentPage,
            PageRecord: itemsPerPage,
            AgencyID: '',
            PropertyGunMakeCode: searchValue1,
            Description: searchValue2,
            IsActive: pageStatus,
            IsSuperAdmin: '1',
            PINID: '1',
            OrderTypeDescription: activeColumn === 'Description' ? orderTypeDescription : '',
            OrderTypeCode: activeColumn === 'Code' ? orderTypeCode : ''
        };

        setLodaer(false);
        fetch_Post_Data(getUrl, val)
            .then((res) => {
                if (res) {
                    setListData(changeArrayFormat(res?.Data, col1, col2, col3, col4));
                    setFillterListData(changeArrayFormat(res?.Data, col1, col2, col3, col4));
                    setLodaer(true);
                    setEffectiveScreenPermission(res?.Permision);
                    setTotalRows(res?.Data[0]?.Count || 0);
                } else {
                    setListData([]);
                    setFillterListData([]);
                    setLodaer(true);
                    setEffectiveScreenPermission(null);
                    setTotalRows(0);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setListData([]);
                setFillterListData([]);
                setLodaer(true);
                setEffectiveScreenPermission(null);
                setTotalRows(0);
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(() => {
            return page;
        }, () => {
            get_data();
        });
    };

    const checkEdittable = (val) => { const check = { "1": true, "0": false }; return check[val] }

    const columns = [
        {
            name: 'Code',
            selector: (row) => row.Code,
            sortable: true
        },
        {
            name: 'Agency Code',
            selector: (row) => row.AgencyCode,
            sortable: true
        },
        {
            name: 'Description',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: 'IsEditable',
            selector: (row) => <> <input type="checkbox" checked={checkEdittable(row.IsEditable)} disabled /></>,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 40 }}>
                    {
                        pageStatus === "1" ?
                            effectiveScreenPermission ? effectiveScreenPermission[0]?.ChangeOK ?
                                <Link to={`/ListManagement?page=${openPage}`} data-toggle="modal" data-target="#Modal" onClick={(e) => { setEditValue(e, row); setUpdateStatus(updateStatus + 1) }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                                : <></>
                            : <></>
                    }
                    {effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                        pageStatus === "1" ?
                            < Link to={`/ListManagement?page=${openPage}`} data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setId(row.id); setIsActive('0'); setConfirmType("InActive") }}
                                className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                            </Link>
                            :
                            <Link to={`/ListManagement?page=${openPage}`} data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setId(row.id); setIsActive('1'); setConfirmType("Active"); }}
                                className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                            </Link>
                        : <></>
                        : <></>
                    }
                </div>

        }
    ]

    // to set Button add or update condition
    const setEditValue = (e, row) => {
        setId(row.id);
        setModal(true); setStatus(true);
    }

    const setStatusFalse = (e) => {
        setStatus(false);
        setModal(true)
        setId(null);
    }

    const UpdActiveDeactive = () => {
        const value = {
            'IsActive': isActive,
            [col3]: id,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate(delUrl, value)
            .then((res) => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_data();
                } else {
                    toastifyError(res.data.Message)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-12 ">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" >
                            <a className={`nav-link ${pageStatus === '1' ? 'active' : ''}`} onKeyDown={''} onClick={() => setPageStatus("1")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">Active</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${pageStatus === '0' ? 'active' : ''}`} onKeyDown={''} onClick={() => setPageStatus("0")} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true">InActive</a>
                        </li>
                    </ul>
                </div>
                <div className="col-12 col-md-12 col-lg-12 ">
                    <div className="row mt-2">
                        <div className="col-12 ">
                            <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0">{openPage}</p>
                                {
                                    pageStatus === '1' ?
                                        effectiveScreenPermission ?
                                            effectiveScreenPermission[0]?.AddOK ?
                                                <Link to={`/ListManagement?page=${openPage}`} onClick={setStatusFalse} className="text-white"
                                                    data-toggle="modal" data-target="#Modal" >
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                                :
                                                <></>
                                            :

                                            <Link to={`/ListManagement?page=${openPage}`} onClick={setStatusFalse} className="text-white"
                                                data-toggle="modal" data-target="#Modal" >
                                                <i className="fa fa-plus"></i>
                                            </Link>

                                        :
                                        <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 mt-2 ">
                    <div className="row">
                        <div className="col-5">
                            <input type="text" value={searchValue1} onChange={(e) => {
                                setSearchValue1(e.target.value);
                                const result = Filter(listData, e.target.value, searchValue2, 'Code', 'Description')
                                setFillterListData(result)
                            }}
                                className='form-control' placeholder='Search By Code...' />
                        </div>
                        <div className='col-1 '>
                        </div>
                        <div className="col-5">
                            <input type="text" value={searchValue2} onChange={(e) => {
                                setSearchValue2(e.target.value)
                                const result = Filter(listData, searchValue1, e.target.value, 'Code', 'Description')
                                setFillterListData(result)
                            }}
                                className='form-control' placeholder='Search By Description...' />
                        </div>
                        <div className='col-1'>
                        </div>
                    </div>
                </div>
                <div className="table-responsive mt-2">
                    <div className="col-12">
                        <div className="row ">
                            <div className="col-12">
                                {
                                    lodaer ?
                                        <DataTable
                                            columns={columns}
                                            data={fillterListData}
                                            dense
                                            pagination
                                            paginationServer
                                            paginationTotalRows={totalRows}
                                            paginationPerPage={itemsPerPage}
                                            onChangeRowsPerPage={setItemsPerPage}
                                            onChangePage={handlePageChange}
                                            onSort={handleSort}
                                            highlightOnHover
                                            noContextMenu
                                            responsive
                                            subHeaderAlign="right"
                                            subHeaderWrap
                                        />
                                        :
                                        <Loader />
                                }

                            </div>

                            <div className="col-12">
                                <div className="col-12">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddUpCom {...{ loginPinID, isSuperadmin, loginAgencyID, openPage, modal, setModal, updateStatus, id, col1, col3, addUrl, upUrl, get_data, status, singleDataUrl, listData }} />
            <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
        </>
    )
}

export default memo(PropertyGunMake)

export const changeArrayFormat = (data, col1, col2, col3, col4) => {
    const result = data?.map((sponsor) =>
        ({ Code: sponsor[col1], Description: sponsor[col2], MultiAgency_Name: sponsor.MultiAgency_Name, id: sponsor[col3], AgencyCode: sponsor.AgencyCode, IsEditable: sponsor[col4] })
    )
    return result
}


