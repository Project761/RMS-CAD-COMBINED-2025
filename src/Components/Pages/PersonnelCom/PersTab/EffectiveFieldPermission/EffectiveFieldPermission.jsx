// Import Component
import React, { useState, useEffect } from 'react'
import {fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';

const EffectiveFieldPermission = ({ PINID, agencyId }) => {

    // Hooks Initialization
    const [moduleFK, setModuleFK] = useState([]);
    const [applicationScreen, setApplicationScreen] = useState([]);
    const [effectiveFieldPermissionList, setEffectiveFieldPermissionList] = useState([]);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();

    const [value, setValue] = useState({
        'ApplicationId': '',
        'ModuleFK': '',
        'screenid': '',
        'FieldId': ''
    })

    // Onload Function
    useEffect(() => {
        get_ModuleFK('1');
        getScreenPermision()
    }, [])

    // Get Screeen Permission
    const getScreenPermision = () => {
        ScreenPermision("P017", agencyId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // onChange Hooks Function
    const handleChange = (e, row) => {
        setValue({
            ...value,
            ['FieldId']: e.target.value
        });
    }

    const ModuleFKChange = (e) => {
        setValue({
            ...value,
            ['ModuleFK']: e.value
        })
        get_ApplicationScreen(e.value);
    }

    const ApplicationScreenChange = (e) => {
        setValue({
            ...value,
            ['screenid']: e.value
        })
    }

    // Get ApplicationScreen
    const get_ApplicationScreen = (id) => {
        const val = {
            ModuleFK: id
        }
        fetchPostData('ScreenPermission/GetData_ApplicationScreen', val)
            .then(res => {
                if (res) setApplicationScreen(res);
                else setApplicationScreen();
            })
    }

    // Get Module List
    const get_ModuleFK = (id) => {
        const val = {
            ApplicationId: id
        }
        fetchPostData('ScreenPermission/GetData_Module', val)
            .then(res => {
                if (res) setModuleFK(res)
                else setModuleFK()
            })
    }

    // Get Effective Field Permission
    const get_Effective_Field_Permission = (e) => {
        e.preventDefault()
        const val = {
            PINID: PINID,
            ScreenID: value.screenid
        }
        fetchPostData('EffectivePermission/GetData_EffectiveFieldPermission', val)
            .then(res => {
                if (res) { setEffectiveFieldPermissionList(res); console.log(res); }
                else setEffectiveFieldPermissionList()
            })
    }

    // // Table Columns Array
    const columns = [
        {
            name: 'Field Name',
            selector: (row) => row.FieldName,
            sortable: true
        },
        {
            name: 'Display',
            selector: (row) => <input type="checkbox" checked={row.Display} value={row.FieldId} name='Display' onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Add',
            selector: (row) => <input type="checkbox" checked={row.AddOK} value={row.FieldId} name='AddOK' onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Change',
            selector: (row) => <input type="checkbox" checked={row.Change} value={row.FieldId} name='Change' onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Delete',
            selector: (row) => <input type="checkbox" checked={row.DeleteOK} value={row.FieldId} name='DeleteOK' onChange={(e) => handleChange(e, row)} />,
            sortable: true
        }

    ]

    return (
        <div className="row px-3">
            <div className="col-12  mt-2">
                <div className="row">
                  
                    <div className="col-6 col-md-4 col-lg-4 dropdown__box">
                        <Select name="ModuleFK"
                            options={moduleFK?.map((sponsor) =>
                            (
                                { label: sponsor.ModuleName, value: sponsor.ModulePK })
                            )}
                            value={
                                moduleFK?.filter(function (option) { return option.ModulePK === value.ModuleFK }).map(({ ModuleName: label, ModulePK: value, ...rest }) => ({
                                    label, value,
                                    ...rest
                                }))
                            }
                            placeholder="Select Module"
                            onChange={ModuleFKChange}
                        />
                        <label htmlFor="">Module</label>


                    </div>
                    <div className="col-6 col-md-4 col-lg-3 dropdown__box">
                        <Select name="screenid"
                            options={applicationScreen?.map((sponsor) =>
                            (
                                { label: sponsor.Description, value: sponsor.ScreenID })
                            )}
                            value={
                                applicationScreen?.filter(function (option) { return option.ScreenID === value.screenid }).map(({ ScreenName: label, ScreenID: value, ...rest }) => ({
                                    label, value,
                                    ...rest
                                }))
                            }
                            placeholder="Screen Name"
                            onChange={ApplicationScreenChange}
                        />
                        <label htmlFor="">Screen Name</label>


                    </div>

                    <div className="col-1 mt-3">
                        <button type="button" className="btn btn-sm btn-success mr-1 py-2" onClick={get_Effective_Field_Permission}>Search</button>
                    </div>
                </div>
                <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Field Security
                    </p>
                </div>
                <DataTable
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? effectiveFieldPermissionList : '' : ''}
                    dense
                    paginationRowsPerPageOptions={[10, 15]}
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
    )
}

export default EffectiveFieldPermission;