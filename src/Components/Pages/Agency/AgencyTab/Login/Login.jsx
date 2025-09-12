
import React, { useState, useEffect, useContext } from 'react'
import DataTable from 'react-data-table-component'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'

const Login = ({ agencyId }) => {

    // Hooks Initialization
    const [loginListData, setLoginListData] = useState([])
    const { get_CountList } = useContext(AgencyContext)
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()

    // Onload Function
    useEffect(() => {
        login_List()
        getScreenPermision()
    }, [])

    // Get Screeen Permission
    const getScreenPermision = () => {
        ScreenPermision("A007", agencyId).then(res => {

            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // Get Personnel list
    const login_List = () => {
        const value = {
            'AgencyID': agencyId
        }
        fetchPostData('Personnel/GetDataLoginAgency', value)
            .then(res => {
                if (res) {
                    setLoginListData(res)
                    get_CountList(agencyId)
                }
                else setLoginListData()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Allow',
            selector: (row) => <>
                {
                    effectiveScreenPermission ?
                        effectiveScreenPermission[0]?.Changeok ? <input type="checkbox" checked={row.IsAllowLogin} onClick={(e) => update_Login_List(e, row)} />
                            : <input type="checkbox" checked={row.IsAllowLogin} disabled /> : <></>
                }
            </>,
            sortable: true
        },
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },

        {
            name: 'LastName',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'FirstName',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'MiddleName',
            selector: (row) => row.MiddleName,
            sortable: true
        },
        {
            name: 'UserName',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: 'Agency Name',
            selector: (row) => row.Agency_Name,
            sortable: true
        }
    ]

    // Update Login List
    const update_Login_List = (e, id) => {
        e.preventDefault()
        const value = {
            'IsAllowLogin': e.target.checked,
            'PINID': id.PINID
        }
        AddDeleteUpadate("Personnel/UpdateLoginAgency", value).then((data) => {
            if (data) { toastifySuccess(data.Message); get_CountList(agencyId); login_List() }
        })
    }

    return (

        <div className="row px-3">
            <div className="col-12 pt-2 p-0">

                <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Login
                    </p>
                </div>
                <div className='row'>
                    <div className="col-12">
                        <DataTable
                            columns={columns}
                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? loginListData : '' : ''}
                            paginationPerPage={'3'}
                            paginationRowsPerPageOptions={[3]}
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

export default Login