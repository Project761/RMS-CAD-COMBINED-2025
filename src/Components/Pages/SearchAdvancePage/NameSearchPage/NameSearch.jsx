import React, { useContext, useEffect, useRef, useState } from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../../Common/Utility';
import { useReactToPrint } from 'react-to-print';
import OtherSummaryModel from '../../SummaryModel/OtherSummaryModel';
import { fetchPostData } from '../../../hooks/Api';
import * as XLSX from 'xlsx';
import NamePrintReport from './NamePrintReport';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';


const NameSearch = ({ isCAD = false }) => {

    const dispatch = useDispatch();
    const location = useLocation();

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const navigate = useNavigate();

    const { nameSearch, setnameSearch, recentSearchData, setRecentSearchData, searchObject, setSearchObject } = useContext(AgencyContext);

    const [nameSearchValue, setNameSearchValue] = useState([]);

    const [otherSummModal, setOtherSummModal] = useState(false);
    const [incSummModal, setIncSummModal] = useState(false);
    const [otherColID, setOtherColID] = useState('');
    const [otherUrl, setOtherUrl] = useState('');
    const [updateCount, setupdateCount] = useState(1);
    const [otherColName, setOtherColName] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    const [ListData, setListData] = useState([])
    const [searchData, setSearchData] = useState([])
    const [LoginAgencyID, setLoginAgencyID] = useState('');

    const exportToExcel = () => {
        const filteredData = nameSearch?.map(item => ({
            MNI: item.NameIDNumber,
            'Last Name': item.LastName,
            'First Name': item.FirstName,
            'Middle Name': item.MiddleName,
            SSN: item.SSN,
            Age: item.AgeFrom,
            Address: item.Address,
            DOB: item.DateOfBirth ? getShowingDateText(item.DateOfBirth) : '',
            Gender: item.Gender_Description,
            Race: item.Race_Description,
            'Alias SSN': item.AliasSSN,
            IsAlias: item.IsAlias
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

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let openPage = query?.get("page");
    let Recent = query?.get("Recent");
    // console.log(otherColName)
    const columns = [
        {
            cell: row =>
                <div className="div" >
                    {/* <a data-toggle="modal" data-target={`${row?.TransactionName == "Incident" ? "#IncSummaryModel" : "#OtherSummaryModel"}`} */}
                    <a data-toggle="modal" data-target="#OtherSummaryModel"
                        style={{ textDecoration: 'underline' }}
                        onClick={() => {
                            // console.log(row)
                            setupdateCount(updateCount + 1);
                            setOtherSummModal(true);
                            setOtherColName('MasterNameID');
                            setOtherColID(row?.MasterNameID);
                            setOtherUrl('Summary/NameSummary');
                            setModalTitle("Name Summary");
                        }}
                    >
                        MS
                    </a>
                </div>
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        <span onClick={(e) => set_Edit_Value(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" style={{ cursor: 'pointer' }}>
                            <i className="fa fa-edit"></i>
                        </span>
                    }
                </div>
        },

        {
            width: '150px',
            name: 'Agency Code',
            selector: (row) => <>{row?.Agency_Code  ? row?.Agency_Code .substring(0, 10) : ''}{row?.Agency_Code ?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',
            name: 'MNI',
            selector: (row) => <>{row?.NameIDNumber} </>,
            sortable: true
        },
        {
            width: '150px',
            name: 'Last Name',
            selector: (row) => <>{row?.LastName ? row?.LastName.substring(0, 10) : ''}{row?.LastName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',
            name: 'First Name',
            selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',
            name: 'Middle Name',
            selector: (row) => <>{row?.MiddleName ? row?.MiddleName.substring(0, 10) : ''}{row?.MiddleName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            width: '150px',
            name: 'Age',
            selector: (row) => row.AgeFrom,
            sortable: true
        },
        // {
        //     width: '150px',
        //     name: 'Juvenile flag',
        //     selector: (row) => row.Juvenileflag,
        //     sortable: true
        // },
        {
            name: 'Juvenile flag',
            selector: row => (
                <input type="checkbox" checked={row.IsJuvenileArrest === true} disabled />
            ),
            sortable: true
        },
        {
            width: '150px',
            name: 'Address',
            selector: (row) => row.Address,
            sortable: true
        },
        {
            width: '150px',
            name: 'Gender',
            selector: (row) => row.Gender_Description,
            sortable: true
        },
        {
            width: '150px',
            name: 'Race',
            selector: (row) => row.Race_Description,
            sortable: true
        },
        {
            width: '150px',
            name: 'Alias Name',
            selector: (row) => row.FullNameAlias,
            sortable: true
        },

        {
            width: '150px',
            name: 'IsAlias',
            selector: (row) => row.IsAlias,
            sortable: true
        },

        {
            width: '150px',
            name: 'Last Updated Date',
            selector: (row) => row.LastModifiy_Date ? getShowingMonthDateYear(row.LastModifiy_Date) : '',
            // selector: (row) => row.IsAlias,
            sortable: true
        },

    ]



    const businessColumns = [
        {
            cell: row =>
                <div className="div" >
                    {/* <a data-toggle="modal" data-target={`${row?.TransactionName == "Incident" ? "#IncSummaryModel" : "#OtherSummaryModel"}`} */}
                    <a data-toggle="modal" data-target="#OtherSummaryModel"
                        style={{ textDecoration: 'underline' }}
                        onClick={() => {
                            // console.log(row)
                            setupdateCount(updateCount + 1);
                            setOtherSummModal(true);
                            setOtherColName('MasterNameID');
                            setOtherColID(row?.MasterNameID);
                            setOtherUrl('Summary/NameSummary');
                            setModalTitle("Name Summary");
                        }}
                    >
                        MS
                    </a>
                </div>
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        <span onClick={(e) => set_Edit_Value(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </span>
                    }
                </div>
        },

        // {
        //     name: 'Incident No',
        //     selector: (row) => row.IncidentNumber,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Business Name',
            selector: (row) => <>{row?.LastName ? row?.LastName.substring(0, 10) : ''}{row?.LastName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Business Type',
            selector: (row) => <>{row?.BusinessType ? row?.BusinessType.substring(0, 10) : ''}{row?.BusinessType?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => <>{row?.OwnerName ? row?.OwnerName.substring(0, 10) : ''}{row?.OwnerName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '150px',

            name: 'Business Fax No',
            selector: (row) => row.OwnerFaxNumber,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Phone No',
            selector: (row) => <>{row?.OwnerPhone ? row?.OwnerPhone.substring(0, 10) : ''}{row?.OwnerPhone?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        // {
        //     name: 'Business Phone',
        //     selector: (row) => row.Contact,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Address',
            selector: (row) => <>{row?.Address ? row?.Address.substring(0, 50) : ''}{row?.Address?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        }

    ]

    const set_Edit_Value = (row) => {
        if (row.NameID || row?.MasterNameID) {
            if (isCAD) {
                navigate(`/cad/name-search?page=MST-Name-Dash&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&ModNo=${row?.NameIDNumber}&NameStatus=${true}`);
            } else {
                navigate(`/Name-Home?page=MST-Name-Dash&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&ModNo=${row?.NameIDNumber}&NameStatus=${true}`);
            }
        }
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
        }
    };

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

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

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        // onAfterPrint: () => { '' },
        onAfterPrint: () => setSelectedStatus(false),
    })

    useEffect(() => {
        if (selectedStatus) {
            printForm();
            getAgencyImg(LoginAgencyID);
        }
    }, [selectedStatus]);

    const handleRefineSearch = () => {
        navigate('/cad/query_incident/nameSearch', { state: { searchState: location.state?.searchState, nameCodeState: location.state?.nameCodeState, multiSelectedState: location.state?.multiSelectedState, fromRefineSearch: true, } })
    }

    useEffect(() => {
        if (Recent && Recent === 'Name' && searchObject?.SearchModule === 'Nam-Search') { setnameSearch([]); getNameRecentSearchData(searchObject); }
    }, [Recent, searchObject]);

    const getNameRecentSearchData = (searchObject) => {
        fetchPostData('MasterName/Search_Name', searchObject).then((res) => {
            if (res) {
                setNameSearchValue(res);
            }
            else {
                setNameSearchValue([]);
            }
        })
    }

    console.log(nameSearch)

    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency name-card">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12  ">
                                                <div className="row">
                                                    <div className={`col-12 ${isCAD ? "CAD-table" : ""}`}>
                                                        <DataTable
                                                            dense
                                                            columns={nameSearch?.[0]?.NameTypeID === 2 ? businessColumns : columns}
                                                            data={Recent === 'Name' && searchObject?.SearchModule === 'Nam-Search' ? nameSearchValue : nameSearch}
                                                            // data={nameSearch?.length > 0 ? nameSearch : nameSearchValue}
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
                                                        {isCAD && <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => handleRefineSearch()}>Refine Search</button>}
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
                        </div>
                    </div>
                </div>
            </div>
            {/* <OtherSummaryModel {...{ setIncSummModal, incSummModal, otherColID, updateCount }} /> */}
            <OtherSummaryModel
                {...{ otherSummModal, setOtherSummModal, updateCount, openPage, modalTitle }}
                otherColName={otherColName}
                otherColID={otherColID}
                otherUrl={otherUrl}
            />
            {/* {selectedStatus && <NamePrintReport {...{ componentRef, selectedStatus, setSelectedStatus }} />} */}
            {selectedStatus && (
                <div style={{ position: 'absolute', top: '-100000px', left: '-100000px' }}>
                    <NamePrintReport  {...{ componentRef, selectedStatus, setSelectedStatus, nameSearch, searchData }} />
                </div>
            )}
        </>

    )
}

export default NameSearch


