import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { fetchPostData } from '../../../../hooks/Api';

const History = () => {
    const { localStoreArray, get_LocalStorage } = useContext(AgencyContext)

    const [warrantHistory, setWarrantHistory] = useState([])
    const [warrantID, setWarrantID] = useState('');


    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', UserName: '' }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                if (localStoreArray?.WarrantID) {
                    setWarrantID(localStoreArray?.WarrantID); get_WarrantHistory(localStoreArray?.WarrantID)
                } else {
                    setWarrantID('');
                }
            }
        }
    }, [localStoreArray])


    useEffect(() => {
        if(warrantID){
            get_WarrantHistory(warrantID)
        }
    }, [warrantID])

    const get_WarrantHistory = (warrantID) => {
        const val = {
            'WarrantID': warrantID,
        }
        fetchPostData('WarrantHistory/GetData_WarrantHistory', val)
            .then(res => {
    
                if (res) {
                    setWarrantHistory(res);
                } else {
                    setWarrantHistory([]);
                }
            })


    }
    const columns = [
        {
            name: 'Warrant Status',
            selector: (row) => row.WarrantStatus,
            sortable: true
        },
        {
            name: 'Creation Date',
            selector: (row) => getShowingDateText(row.CreatedDtTm),
            sortable: true
        },

    ]

    return (
  
            <div className="col-md-12 mt-2">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">History</p>
                        </div>
                        <DataTable
                            dense
                            columns={columns}
                            data={warrantHistory}
                            pagination
                            selectableRowsHighlight
                            highlightOnHover
                            noDataComponent={'There are no data to display'}
                        />

                    </div>
                </div>
            </div>

    
    )
}

export default History