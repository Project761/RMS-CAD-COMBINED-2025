import { useState, useEffect, } from 'react'
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetch_Post_Data, } from '../../../../hooks/Api';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import ConfirmModal from '../../../../Common/ConfirmModal';
import { Filter } from '../../../../Filter/Filter';
import ChargeCodeAddUp from './ChargeCodeAddUp';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';

const ChargeCode = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()

    const [dataList, setDataList] = useState();
    const [status, setStatus] = useState(false);
    const [pageStatus, setPageStatus] = useState("1")
    const [modal, setModal] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(0)
    const [searchValue1, setSearchValue1] = useState('')
    const [searchValue2, setSearchValue2] = useState('')
    const [searchValue3, setSearchValue3] = useState('')
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [isSuperadmin, setIsSuperadmin] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [totalRows, setTotalRows] = useState(0);
    const [codeSortOrder, setCodeSortOrder] = useState('Asc');
    const [activeColumn, setActiveColumn] = useState('Code');
    const [orderTypeCode, setOrderTypeCode] = useState('Asc');
    const [orderTypeDescription, setOrderTypeDescription] = useState('Asc');
    const [fillterListData, setFillterListData] = useState([])
    const [value, setValue] = useState('')
    const getUrl = "ChargeCodes/GetData_ChargeCodes"

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            console.log(localStoreData)
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            setIsSuperadmin(localStoreData?.IsSuperadmin);
            setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID });
            if (localStoreData?.AgencyID) { get_data(localStoreData?.AgencyID, localStoreData?.PINID, localStoreData?.IsSuperadmin); }
        }
    }, [localStoreData, pageStatus]);

    useEffect(() => {
        if (getUrl) { setPageStatus('1'); setSearchValue1(''); setSearchValue2(''); setSearchValue3(''); }
    }, [getUrl])

    useEffect(() => {
        if (loginAgencyID) {
            get_data(loginAgencyID, loginPinID, isSuperadmin);
        }
    }, [loginAgencyID])

    useEffect(() => {
        setCurrentPage(1);
    }, [searchValue1, searchValue2, searchValue3]);

    const fetchData = async () => {
        try {
            const res = await fetch_Post_Data(getUrl, {
                PageCount: currentPage,
                PageRecord: itemsPerPage,
                AgencyID: loginAgencyID,
                ChargeCode: searchValue1,
                Description: searchValue2,
                FBIDescriptionCode: searchValue3,
                IsActive: pageStatus,
                IsSuperAdmin: '1',
                PINID: '1',
                OrderTypeDescription: activeColumn === 'Description' ? orderTypeDescription : '',
                OrderTypeCode: activeColumn === 'Code' ? orderTypeCode : ''
            });

            if (res) {
                console.log(res, "response")
                setDataList(changeArrayFormat(res?.Data));
                setFillterListData(changeArrayFormat(res?.Data));
                setEffectiveScreenPermission(res?.Permision);
                setTotalRows(res?.Data[0]?.Count || 0);
            } else {
                setDataList([]);
                setFillterListData([]);
                setEffectiveScreenPermission();
                setTotalRows(0);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setDataList([]);
            setFillterListData([]);
            setEffectiveScreenPermission();
            setTotalRows(0);
        }
    };

    console.log(fillterListData)
    useEffect(() => {
        if (loginAgencyID) {
            fetchData();
        }
    }, [loginAgencyID, currentPage, itemsPerPage, searchValue1, searchValue2, searchValue3, getUrl, activeColumn, orderTypeCode, orderTypeDescription]);

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

    const get_data = (loginAgencyID, loginPinID, IsSuperAdmin) => {
        const val = {
            PageCount: currentPage,
            PageRecord: itemsPerPage,
            AgencyID: loginAgencyID,
            ChargeCode: searchValue1,
            Description: searchValue2,
            FBIDescriptionCode: searchValue3,
            IsActive: pageStatus,
            IsSuperAdmin: IsSuperAdmin,
            PINID: loginPinID,
            OrderTypeDescription: activeColumn === 'Description' ? orderTypeDescription : '',
            OrderTypeCode: activeColumn === 'Code' ? orderTypeCode : ''
        };
        fetch_Post_Data(getUrl, val).then((res) => {
            if (res) {
                console.log(res)
                setFillterListData(changeArrayFormat(res?.Data));
                setEffectiveScreenPermission(res?.Permision);
                setTotalRows(res?.Data[0]?.Count || 0);
            } else {
                setFillterListData([]);
                setEffectiveScreenPermission();
                setTotalRows(0);
            }
        })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setFillterListData([]);
                setEffectiveScreenPermission();
                setTotalRows(0);
            });
    };

    const [isActive, setIsActive] = useState('')
    const [singleTypeId, setSingleTypeId] = useState('')
    const [confirmType, setConfirmType] = useState('')

    const UpdActiveDeactive = () => {
        const value = {
            'IsActive': isActive,
            'ChargeCodeID': singleTypeId,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('ChargeCodes/DeleteChargeCodes', value)
            .then(res => {
                if (res.success) {
                    toastifySuccess(res.Message); get_data(loginAgencyID, loginPinID);
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
            selector: (row) => row.Code,

            sortable: true
        },

        {
            name: 'Description',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: ' FBI Code',
            selector: (row) => row?.FBIID,
            sortable: true
        },
        {
            name: 'Agency Code',
            selector: (row) => row.AgencyCode,
            sortable: true
        },

        {
            name: 'Agency Name',
            selector: (row) => <>{row?.MultiAgency_Name ? row?.MultiAgency_Name.substring(0, 40) : ''}{row?.MultiAgency_Name?.length > 40 ? '  . . .' : null} </>,
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
                                <Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#CFSModal" onClick={(e) => { setEditValue(e, row); }}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-2"><i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                                : <></>
                            : <></>
                    }

                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            pageStatus === "1" ?
                                < Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.ChargeCodeID); setIsActive('0'); setConfirmType("InActive") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                                </Link>
                                :
                                <Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.ChargeCodeID); setIsActive('1'); setConfirmType("Active") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                            : <></>
                            :
                            pageStatus === "1" ?
                                < Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.ChargeCodeID); setIsActive('0'); setConfirmType("InActive") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true"></i>
                                </Link>
                                :
                                <Link to="/ListManagement?page=Charge Code" data-toggle="modal" data-target="#ConfirmModal" onClick={(e) => { setSingleTypeId(row.ChargeCodeID); setIsActive('1'); setConfirmType("Active") }}
                                    className="btn btn-sm  text-white px-1 py-0 mr-1" style={{ background: "#ddd" }}>
                                    <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                                </Link>
                    }
                </div>

        }
    ]

    const handlePageChange = (page) => {
        setCurrentPage((prevPage) => {
            return page;
        }, () => {
            get_data(loginAgencyID, loginPinID, isSuperadmin);
        });
    };

    const checkEdittable = (val) => {
        const check = { "1": true, "0": false };
        return check[val]
    }

    // to set Button add or update condition
    const setEditValue = (e, row) => {
        setUpdateStatus(updateStatus + 1); setSingleTypeId(row.ChargeCodeID)
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
                <div className="col-12 col-md-12 col-lg-12 ">
                    <div className="row mt-2">
                        <div className="col-12 ">
                            <div className="bg-green text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0">Charge Code</p>
                                {
                                    pageStatus === '1' ?
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                            <Link to="/ListManagement?page=Charge Code" className="text-white" onClick={setStatusFalse}
                                                data-toggle="modal" data-target="#CFSModal" >
                                                <i className="fa fa-plus"></i>
                                            </Link>
                                            : <></>
                                            : <Link to="/ListManagement?page=Charge Code" className="text-white" onClick={setStatusFalse}
                                                data-toggle="modal" data-target="#CFSModal" >
                                                <i className="fa fa-plus"></i>
                                            </Link>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-12 col-lg-12 incident-tab mt-1">
                    <ul className="nav nav-tabs mb-1 pl-2" id="myTab" role="tablist">
                        <span className={`nav-item ${pageStatus === '1' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus("1"); setSearchValue1(''); setSearchValue2(''); setSearchValue3(''); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === '1' ? 'Red' : '' }}>Active</span>
                        <span className={`nav-item ${pageStatus === '0' ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus("0"); setSearchValue1(''); setSearchValue2(''); setSearchValue3(''); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === '0' ? 'Red' : '' }}>InActive</span>
                    </ul>
                </div>

                <div className="col-12 mt-2 ">
                    <div className="row">
                        <div className="col-4">
                            <input type="text" value={searchValue1} onChange={(e) => {
                                setSearchValue1(e.target.value);
                                const result = Filter(dataList, e.target.value, searchValue2, searchValue3, 'ChargeCode', 'Description', 'FBIDescriptionCode')
                                setFillterListData(result)
                            }}
                                className='form-control' placeholder='Search By Code...' />
                        </div>

                        <div className="col-4">
                            <input type="text" value={searchValue2} onChange={(e) => {

                                setSearchValue2(e.target.value)
                                const result = Filter(dataList, e.target.value, searchValue1, searchValue3, 'ChargeCode', 'Description', 'FBIDescriptionCode')
                                setFillterListData(result)
                            }}
                                className='form-control' placeholder='Search By Description...' />
                        </div>

                        <div className="col-4">
                            <input type="text" value={searchValue3} onChange={(e) => {
                                console.log(searchValue3)
                                console.log(e.target.value)
                                setSearchValue3(e.target.value)
                                const result = Filter(dataList, e.target.value, searchValue1, searchValue2, 'ChargeCode', 'Description', 'FBIDescriptionCode')
                                setFillterListData(result)
                            }}
                                className='form-control' placeholder='Search By FBI Code...' />
                        </div>

                    </div>

                </div>
                <div className="table-responsive mt-2">
                    <div className="col-12">
                        <div className="row ">
                            <div className="col-12">
                                <DataTable
                                    columns={columns}
                                    data={fillterListData}
                                    dense
                                    pagination
                                    paginationServer
                                    paginationTotalRows={totalRows}
                                    paginationPerPage={itemsPerPage}
                                    paginationRowsPerPageOptions={[100, 200, 300, 400]}
                                    onChangeRowsPerPage={setItemsPerPage}
                                    onChangePage={handlePageChange}
                                    onSort={handleSort}
                                    highlightOnHover
                                    noContextMenu
                                    responsive
                                    subHeaderAlign="right"
                                    subHeaderWrap
                                    fixedHeader
                                    persistTableHead={true}
                                    customStyles={tableCustomStyles}
                                    fixedHeaderScrollHeight='380px'
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <ChargeCodeAddUp {...{ loginPinID, isSuperadmin, loginAgencyID, singleTypeId, status, get_data, dataList, modal, setModal, updateStatus }} />
            <ConfirmModal func={UpdActiveDeactive} confirmType={confirmType} />
        </>
    )
}

export default ChargeCode


const changeArrayFormat = (data) => {
    console.log(data)
    if (!data || !Array.isArray(data)) {
        return [];
    }

    return data.map((item) => ({
        Code: item.ChargeCode,
        AgencyCode: item.AgencyCode || '',
        Description: item.Description || '',
        FBIID: item.FBIDescription || '',
        MultiAgency_Name: item.MultiAgency_Name,
        IsEditable: item.IsEditable,
        ChargeCodeID: item.ChargeCodeID || '',
        IsActive: item.IsActive
    }));
};




