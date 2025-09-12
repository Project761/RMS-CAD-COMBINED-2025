import React, { useState, useEffect } from 'react';
import { fetchPostData, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useLocation } from 'react-router-dom';

const Effectivepermission = ({ setaddUpdatePermission }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [effectiveScreenList, setEffectiveScreenList] = useState([])
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [pinId, setPinID] = useState('');

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var Aid = query?.get("Aid");
    var perId = query?.get('perId');

    if (!Aid) Aid = 0;
    else Aid = parseInt(base64ToString(Aid));
    if (!perId) perId = 0;
    else perId = parseInt(base64ToString(perId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            // get_Group_Personnel(Aid);
            get_EffectiveScreen_Permission(localStoreData?.AgencyID, localStoreData?.PINID);
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    // Get Screeen Permission
    const getScreenPermision = (Aid, pinId) => {
        ScreenPermision("P016", Aid, pinId).then(res => {
            if (res) {
                setEffectiveScreenPermission(res);
                // setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
            }
            else {
                setEffectiveScreenPermission()
                // setaddUpdatePermission(false);
            }
        });
    }

    // Get Effective Screeen Permission
    const get_EffectiveScreen_Permission = (Aid, pinId) => {
        const val = {
            PINID: pinId,
            AgencyID: Aid,
            ApplicationID: '1',
            code: '',
        }
        fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", val)
            .then(res => {
                if (res) setEffectiveScreenList(res)
                else setEffectiveScreenList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    //  // Table Columns Array
    const columns = [
        {
            name: 'Screen Name',
            selector: (row) => row.ScreenCode1,
            sortable: true
        },
        {
            name: 'Display',
            selector: (row) => <input type="checkbox" disabled checked={row.DisplayOK} value={row.ScreenID} name='DisplayOK' />,
            sortable: true
        },
        {
            name: 'Add',
            selector: (row) => <input type="checkbox" checked={row.AddOK} value={row.ScreenID} name='AddOK' disabled />,
            sortable: true
        },
        {
            name: 'Change',
            selector: (row) => <input type="checkbox" checked={row.Changeok} value={row.ScreenID} name='Changeok' disabled />,
            sortable: true
        },
        {
            name: 'Delete',
            selector: (row) => <input type="checkbox" checked={row.DeleteOK} value={row.ScreenID} name='DeleteOK' disabled />,
            sortable: true
        }

    ]

    return (
        <div className="row px-3">
            <div className="col-12 mt-3 ">
                {/* <div className="bg-line py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Screen Security
                    </p>
                </div> */}
                <DataTable
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? effectiveScreenList : '' : ''}
                    dense
                    paginationRowsPerPageOptions={[10]}
                    highlightOnHover
                    noContextMenu
                    pagination
                    showHeader={true}
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    fixedHeader
                    // fixedHeaderScrollHeight="300px"
                    responsive
                    subHeaderAlign="right"
                    subHeaderWrap
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
        </div>
    )
}

export default Effectivepermission