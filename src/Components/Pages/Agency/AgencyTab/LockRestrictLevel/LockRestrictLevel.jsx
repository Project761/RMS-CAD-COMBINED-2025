
import React, { useState, useEffect } from 'react'
import { fetchPostData } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';

const LockRestrictLevel = ({ agencyId }) => {

    // Hooks Initialization
    const [moduleDrpData, setModuleDrpData] = useState([])
    const [applicationScreen, setApplicationScreen] = useState([])
    const [lockRetrictLevelList, setLockRetrictLevelList] = useState([])
    const [value, setValue] = useState({
        'ApplicationId': '',
        'Module': '',
        'AgencyID': agencyId,
        'screenid': ''
    })

    // Onload Function
    useEffect(() => {
        get_Module('1')
    }, [])

    const ModuleChange = (e) => {
        setValue({
            ...value,
            ['Module']: e.Module
        })
        get_ApplicationScreen(e.Module)
    }

    const ApplicationScreenChange = (e) => {
        setValue({
            ...value,
            ['screenid']: e.screenid
        })
        get_SecurityGroup_LockRetrictLevel(e.screenid);
    }

    // Get Module 
    const get_Module = (id) => {
        const val = {
            ApplicationId: id
        }
        fetchPostData('LockRetrictLevel/LockScreenModule', val)
            .then(res => {
                if (res) setModuleDrpData(res)
                else setModuleDrpData()
            })
    }


    const get_ApplicationScreen = (id) => {
        const val = {
            ModuleFK: id
        }
        fetchPostData('ScreenPermission/GetData_ApplicationScreen', val)
            .then(res => {
                if (res) setApplicationScreen(res)
                else setApplicationScreen()
            })
    }

    // Get Lock RetrictLevel List
    const get_SecurityGroup_LockRetrictLevel = (ScreenID) => {
        const val = {
            'AgencyId': agencyId,
            'ScreenID': ScreenID
        }
        fetchPostData('LockRetrictLevel/GetData_SecurityGroupComponentLevels', val)
            .then(res => {
                if (res) setLockRetrictLevelList(res)
                else setLockRetrictLevelList()
            })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Group Name',
            selector: (row) => row.GroupName,
            sortable: true
        },
        {
            name: 'LockLevel',
            selector: (row) => row.LockLevel,
            sortable: true
        },
        {
            name: 'RestrictLevel',
            selector: (row) => row.RestrictLevel,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 0, right: 0 }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <Link to={`#`} data-toggle="modal" data-target="#UnitModal" onClick=''
                        className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i></Link>
                </div>

        }

    ]

    // Custom Style
    const customStyles = {
        option: (styles, { isFocused }) => {
            return {
                ...styles,
                backgroundColor: isFocused ? "#e0ebf3" : null,
                color: "#333333"
            };
        }
    };
    return (
        <div className="row px-3">
            <div className="col-12 pt-2 p-0">
                <div className="row ">
                    <div className="col-6 mt-2 dropdown__box">
                        <Select styles={customStyles} name="Module"
                            options={moduleDrpData?.map((sponsor) =>
                            (
                                { label: sponsor.Description, Module: sponsor.ModuleFK })
                            )}
                            placeholder="Select_Module"
                            onChange={ModuleChange}
                        />
                        <label htmlFor="">Module</label>
                    </div>
                </div>
                <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Lock Restrict Levels
                    </p>
                </div>
                <div className="row ">
                    <div className="col-4 mt-4 dropdown__box">
                        <Select styles={customStyles} name="screenid"
                            options={applicationScreen?.map((sponsor) =>
                            (
                                { label: sponsor.ScreenName, screenid: sponsor.ScreenID })
                            )}
                            placeholder="Select_Application"
                            onChange={ApplicationScreenChange}
                        />
                        <label htmlFor="">Application Screen</label>
                    </div>

                    <div className="col-8 mt-2">
                        <DataTable
                            columns={columns}
                            data={lockRetrictLevelList}
                            paginationPerPage={'5'}
                            paginationRowsPerPageOptions={[5]}
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
    )
}

export default LockRestrictLevel