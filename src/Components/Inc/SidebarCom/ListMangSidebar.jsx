import { useState, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import { fetchPostData } from '../../hooks/Api';
import { AgencyContext } from '../../../Context/Agency/Index';
import { useContext } from 'react';
import { One_Search_Filter_OneValue } from '../../Filter/Filter';

const ListMangSidebar = () => {

    const { setUtilityTable } = useContext(AgencyContext)
    const [expand, setExpand] = useState()
    const [expandList, setExpandList] = useState()
    const [moduleList, setModuleList] = useState([])
    const [tableManagementList, setTableManagementList] = useState([])
    const [tableManagementFillterList, setTableManagementFillterList] = useState([])
    const [plusMinus, setPlusMinus] = useState(false)
    const [plusMinus1, setPlusMinus1] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const useQuery = () => new URLSearchParams(useLocation().search);

    let openPage = useQuery().get('page');
    const page = new URLSearchParams(window.location.search).get("page")

    const callUtilityModules = (type, val) => {
        if (type === 'List') {
            setPlusMinus1(!plusMinus1)
            setExpand(expand ?
                expand[0].id === val ? { id: val } : '' : { id: val })
        }
        else {
            setPlusMinus(!plusMinus); setExpandList(expandList === val ? '' : val)
        }
    }

    useEffect(() => {
        if (moduleList?.length === 0) { get_Modules('1'); }
        if (tableManagementList?.length === 0) { get_Table_Management_List(); }
    }, [])

    // Get Module and Table_Management_List
    const get_Modules = (id) => {
        const val = {
            ApplicationId: id, IslstTables: true
        }
        fetchPostData('ScreenPermission/GetData_Module', val)
            .then(res => {
                if (res) { setModuleList(res); }
                else { setModuleList(); }
            })
    }

    const get_Table_Management_List = () => {
        const value = {
            ModuleID: 0
        }
        fetchPostData('TableManagement/GetData_TableManagement', value)
            .then(res => {
                if (res) {
                    setTableManagementList(res); setTableManagementFillterList(res);
                }
                else { setTableManagementList(); setTableManagementFillterList(); }
            })
    }

    const getTableInfo = (val) => {
        setUtilityTable(val)
    };

    return (
        <>
            <div className="row px-1" >
                <div className="col-12 mt-4">
                    <input type="text" className='form-control input-fixed mt-1'
                        onChange={(e) => {
                            setSearchValue(e.target.value)
                            const result = One_Search_Filter_OneValue(tableManagementList, e.target.value, 'Contains', 'Name')
                            setTableManagementFillterList(result)
                            if (result && e.target.value) {
                                var arr = []
                                result?.map(val => {
                                    arr.push({ id: val.ModuleID })
                                })
                                const ids = arr.map(o => o.id)
                                const filtered = arr.filter(({ id }, index) => !ids.includes(id, index + 1))
                                setExpand(filtered)
                            } else setExpand()
                        }}
                        placeholder='Search By List ...' />
                </div>
            </div>
            {
                moduleList?.map((item, index) => (
                    <li key={index} >
                        <Link to="#" className="has-arrow arrow-c"
                            onClick={(e) => {
                                callUtilityModules('List', item.ModulePK)
                                if (!searchValue) {
                                    if (expand) {
                                        if (expand[0].id === item.ModulePK) {
                                            setExpand()
                                        }
                                        else setExpand([{ id: item.ModulePK }])
                                    } else setExpand([{ id: item.ModulePK }])
                                } else { setExpand() }
                            }
                            }
                            aria-expanded={expand != undefined ?
                                expand.length > 0 ?
                                    expand[0].id === item.ModulePK ?
                                        plusMinus1
                                        : ''
                                    : ''
                                : ''}
                        >
                            <span className='pl-4'>{item.ModuleName}</span>
                        </Link>
                        {
                            expand?.map(exp => (
                                <ul aria-expanded={`${exp.id === item.ModulePK ? true : false}`}
                                    className={`${exp.id === item.ModulePK ? 'collapse in' : 'collapse'}`}
                                    style={{ marginLeft: '-23px' }}>
                                    {
                                        tableManagementFillterList?.map((val, index) => (
                                            <li className={`ml-4 p-0 ${page === val.Name ? "active" : ''}`} key={index}

                                                style={{ background: `${openPage == val.Name ? '#EEE' : ''}` }}
                                                onClick={() => {
                                                    getTableInfo(val);
                                                }}>
                                                {
                                                    val.ModuleID === exp.id ?
                                                        <Link to={`/ListManagement?page=${val.RouteTable}`}>
                                                            <span className="m-0 p-0">{val.Name}</span>
                                                        </Link>
                                                        : <></>
                                                }
                                            </li>
                                        ))
                                    }
                                </ul>
                            ))
                        }
                    </li>
                ))
            }
        </>
    )
}

export default ListMangSidebar