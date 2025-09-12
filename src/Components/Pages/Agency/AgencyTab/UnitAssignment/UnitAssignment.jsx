// Import Component
import React, { useState, useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { isDisabled } from '@testing-library/user-event/dist/utils';

const UnitAssignment = ({ aId, pinId }) => {


    // Hooks Initialization
    const [shiftList, setShiftList] = useState()
    const [divisionList, setDivisionList] = useState()
    const [unitList, setUnitList] = useState([])
    const [onlineList, setOnlineList] = useState([])
    const [oflineList, setOflineList] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddUnitAssignment, setPermissionForAddUnitAssignment] = useState(false);
    const [permissionForEditUnitAssignment, setPermissionForEditUnitAssignment] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();


    const [value, setValue] = useState({
        'ShiftID': '',
        'DivisionId': '',
        'AgencyID': aId,
        'UnitId': ''
    })

    // Onload Function
    useEffect(() => {
        get_Shift(aId);
        get_Division(aId);
        getScreenPermision(aId, pinId);
    }, [aId])


    // Get Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        // old code ->   A019
        ScreenPermision("A011", aId, pinId).then(res => {
            if (res) {
                setEffectiveScreenPermission(res);
                setPermissionForAddUnitAssignment(res?.[0]?.AddOK);
                setPermissionForEditUnitAssignment(res?.[0]?.Changeok);
                // for change tab when not having  add and update permission
                // setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);

            }
            else {
                setEffectiveScreenPermission([]); setPermissionForAddUnitAssignment(false); setPermissionForEditUnitAssignment(false);
                //  setaddUpdatePermission(false)
            }
        }).catch(error => {
            console.error('There was an error!', error);
            setPermissionForAddUnitAssignment(false);
            setPermissionForEditUnitAssignment(false);
            // for change tab when not having  add and update permission
            // setaddUpdatePermission(false)
        });
    }

    // onChange Hooks Function
    const shiftChange = (e) => {
        setValue({
            ...value,
            ['ShiftID']: e.ShiftID
        })
    }

    const divisionChange = (e) => {
        setValue({
            ...value,
            ['DivisionId']: e.DivisionId
        })
        get_Unit_List(e.DivisionId)
    }

    const unitChange = (e) => {
        setValue({
            ...value,
            ['UnitId']: e.UnitId
        })
    }

    const get_Shift = (aId) => {
        const val = { 'AgencyID': aId }
        fetchPostData("MasterPersonnel/GetData_Shift", val).then((data) => {
            if (data) setShiftList(data)
            else setShiftList()
        })
    }

    // Get Division
    const get_Division = (aId) => {
        const val = {
            AgencyId: aId
        }
        fetchPostData('Division/GetData_Division', val)
            .then(res => {
                if (res) setDivisionList(res)
                else setDivisionList()
            })
    }

    const get_Unit_List = (id) => {
        const value = {
            AgencyID: aId,
            DivisionId: id
        }
        fetchPostData('Unit/UnitGetData', value).then((res) => {
            if (res) {
                setUnitList(res)
            }
            else setUnitList([]);
        })
    }

    const [shiftErr, setShiftErr] = useState(false)
    const [divisionErr, setDivisionErr] = useState(false)
    const [unitErr, setUnitErr] = useState(false)

    const get_Roaster = () => {
        const { DivisionId, ShiftID, UnitId } = value
        if (ShiftID === '') {
            setShiftErr("Select shift !!")
        } else {
            setShiftErr(false)
        }
        if (DivisionId === '') {
            setDivisionErr("Select division !!")
        } else {
            setDivisionErr(false)
        }
        if (UnitId === '') {
            setUnitErr("Select unit !!")
        } else {
            setUnitErr(false)
        }
        if (ShiftID !== '' && DivisionId !== '' && UnitId !== '') {
            OnlineList()
            offlineList()
        }
    }


    const offlineList = () => {
        const data = {
            IsActive: 0,
            UnitID: value?.UnitId,
            AgencyId: aId
        }
        fetchPostData('RoasterUnit/GetDataIsOfflineOnlineUnit', data)
            .then(result => {
                if (result) {
                    setOflineList(result)
                } else {
                    setOflineList()
                }
            })
    }

    const OnlineList = () => {
        const data = {
            IsActive: 1,
            UnitID: value?.UnitId,
            AgencyId: aId
        }
        fetchPostData('RoasterUnit/GetDataIsOfflineOnlineUnit', data)
            .then(result => {
                if (result) {
                    setOnlineList(result)
                } else {
                    setOnlineList()
                }
            })
    }

    const columnsOnline = [
        {
            name: 'Name',
            selector: (row) => row.FirstName + " " + row.LastName,
            sortable: true
        },
        {
            name: 'UserName',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: 'Address',
            selector: (row) => row.Address,
            sortable: true
        },
    ]

    // Table Columns Array
    const columnsOffline = [
        {
            name: 'Name',
            selector: (row) => row.FirstName + " " + row.LastName,
            sortable: true
        },
        {
            name: 'Username',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: 'Address',
            selector: (row) => row.Address,
            sortable: true
        },
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

    const [btn, setBtn] = useState({
        "assign_btn": false,
        "unassign_btn": false,
    })

    // Unassigned row select 
    const handleRowClicked_UnAss = row => {
        setBtn({
            ...btn,
            ['assign_btn']: true
        })
        const updatedData = oflineList.map(item => {
            if (row.PINID !== item.PINID) {
                return item;
            }
            setSelectedRows(item)
            return {
                ...item,
                toggleSelected: !item.toggleSelected,
            };
        });
        setOflineList(updatedData);
    };

    // Data Table row select 
    const handleRowClicked_Ass = row => {
        setBtn({
            ...btn,
            ['unassign_btn']: true
        })
        const updatedData = onlineList.map(item => {
            if (row.PINID !== item.PINID) {
                return item;
            }

            setSelectedRows(item)
            return {
                ...item,
                toggleSelected: !item.toggleSelected,
            };
        });
        setOnlineList(updatedData);
    };

    // Update Roster
    const update_Assigned_Roster = (e, type) => {
        e.preventDefault()
        const val = {
            PINID: selectedRows?.PINID,
            UnitID: value?.UnitId,
            ShiftId: value?.ShiftID
        }
        AddDeleteUpadate('RoasterUnit/IsUpdateOnlineStatus', val)
            .then(res => {
                if (res) {
                    OnlineList()
                    offlineList()
                    if (type === 1) {
                        toastifySuccess("User turned active !!")
                        setBtn({
                            ...btn,
                            ['assign_btn']: false
                        })
                    }
                    if (type === 0) {
                        toastifySuccess("User turned inactive !!")
                        setBtn({
                            ...btn,
                            ['unassign_btn']: false
                        })
                    }
                }
            })
    }

    // Custom Style
    const conditionalRowStyles = [
        {
            when: row => row.toggleSelected,
            style: {
                backgroundColor: 'hwb(199deg 88% 0%)',
                userSelect: "none"
            }
        },
    ];

    return (

        <div className='row px-3' >
            <div className='col-12  p-0 mt-1'>
                <fieldset >

                    <div className='row'>
                        <div className='col-3 mt-3 dropdown__box'>
                            <Select styles={customStyles} name="ShiftID"
                                options={shiftList?.map((sponsor) =>
                                (
                                    { label: sponsor.ShiftCode, ShiftID: sponsor.ShiftId })
                                )}
                                placeholder="shift.."
                                onChange={shiftChange}
                            />
                            <label htmlFor="">Shift</label>
                            <span className='text-danger'>{shiftErr}</span>
                        </div>
                        <div className='col-3 mt-3 dropdown__box'>
                            <Select styles={customStyles} name="DivisionId"
                                options={divisionList?.map((sponsor) =>
                                (
                                    { label: sponsor.Name, DivisionId: sponsor.DivisionID })
                                )}
                                placeholder="Division"
                                onChange={divisionChange}
                            />
                            <label htmlFor="">Division</label>
                            <span className='text-danger'>{divisionErr}</span>
                        </div>
                        <div className='col-3 mt-3 dropdown__box'>
                            <Select styles={customStyles} name="UnitId"
                                options={unitList?.map((sponsor) =>
                                (
                                    { label: sponsor.UnitName, UnitId: sponsor.UnitId })
                                )}
                                placeholder=" Select Unit .."
                                onChange={unitChange}
                            />
                            <label htmlFor="">Unit</label>
                            <span className='text-danger'>{unitErr}</span>
                        </div>
                        <div className='col-1 mt-3'>
                            <button type="button" className="btn btn-sm btn-success py-2 mr-1" onClick={() => get_Roaster()}>Search</button>
                        </div>
                    </div>
                </fieldset>
                <div className='row'>
                    <div className='col-5'>
                        <div className='col-12 bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center'>
                            <p className="p-0 m-0 d-flex align-items-center">
                                On duty
                            </p>
                        </div>
                        <DataTable
                            columns={columnsOnline}
                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? onlineList : '' : ''}
                            onRowClicked={handleRowClicked_Ass}
                            conditionalRowStyles={conditionalRowStyles}
                            paginationPerPage={'5'}
                            paginationRowsPerPageOptions={[5]}
                            highlightOnHover
                            noContextMenu
                            pagination
                            responsive
                            subHeaderAlign="right"
                            subHeaderWrap
                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                        />
                    </div>
                    <div className='col-1 mt-5 text-center'>
                        {
                            btn.unassign_btn && effectiveScreenPermission[0]?.Changeok ?
                                <button className='btn btn-sm btn-primary d-inline-block' onClick={(e) => update_Assigned_Roster(e, 0)}>
                                    <i className='fa fa-arrow-right'></i>
                                </button>
                                :
                                <button className='btn btn-sm btn-primary d-inline-block' style={{ cursor: 'not-allowed' }} onClick={(e) => alert(1)} disabled={isDisabled}>
                                    <i className='fa fa-arrow-right'></i>
                                </button>
                        }
                        <br />
                        {
                            btn.assign_btn && effectiveScreenPermission[0]?.Changeok ?
                                <button className='btn btn-sm btn-primary d-inline-block mt-2' onClick={(e) => update_Assigned_Roster(e, 1)}>
                                    <i className='fa fa-arrow-left'></i>
                                </button>
                                :
                                <button className='btn btn-sm btn-primary d-inline-block mt-2' style={{ cursor: 'not-allowed' }} onClick={(e) => alert(1)} disabled={isDisabled}>
                                    <i className='fa fa-arrow-left'></i>
                                </button>
                        }

                    </div>
                    <div className='col-6'>
                        <div className='col-12 bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center'>
                            <p className="p-0 m-0 d-flex align-items-center">
                                Off duty
                            </p>
                        </div>
                        <DataTable
                            columns={columnsOffline}
                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? oflineList : '' : ''}
                            onRowClicked={handleRowClicked_UnAss}
                            conditionalRowStyles={conditionalRowStyles}
                            paginationPerPage={'5'}
                            paginationRowsPerPageOptions={[5]}
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

    )
}

export default UnitAssignment