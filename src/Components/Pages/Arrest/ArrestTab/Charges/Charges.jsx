import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import DataTable from 'react-data-table-component'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import { AddDeleteUpadate } from '../../../../hooks/Api'
import DeletePopUpModal from '../../../../Common/DeleteModal'

const Charges = () => {

  const { setIncStatus, get_ArrestCharge_Count, get_Arrest_Count, updateCount, setUpdateCount, arrestChargeData, get_Data_Arrest_Charge, localStoreArray, setLocalStoreArray, get_LocalStorage, storeData, } = useContext(AgencyContext);

  const [chargeID, setChargeID] = useState();
  const [arrestID, setArrestID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", ChargeID: '' }),
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
        setLoginPinID(localStoreArray?.PINID);
        setArrestID(localStoreArray?.ArrestID)
      } else {
        setLoginPinID('');
        setArrestID('');
      }
    }
  }, [localStoreArray])

  useEffect(() => {
    if (arrestID) {
      get_Data_Arrest_Charge(arrestID);
    }
  }, [arrestID])

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>
          <Link to={'/chargetab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
            <i className="fa fa-edit"></i>
          </Link>
        </div>
    },
    {
      name: 'Arrest Number', selector: (row) => row.ArrestNumber, sortable: true
    },
    {
      name: 'TIBRS Description', selector: (row) => row.NIBRS_Description, sortable: true
    },
    {
      name: 'UCRClear Description', selector: (row) => row.UCRClear_Description, sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 5 }}>
          <Link to={`#`} onClick={(e) => setChargeID(row.ChargeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
            <i className="fa fa-trash"></i>
          </Link>

        </div>

    }
  ]

  const set_Edit_Value = (e, row) => {
    get_ArrestCharge_Count(row.ChargeID)
    if (row.ChargeID) {
      setLocalStoreArray({ ...localStoreArray, 'ChargeID': row.ChargeID, 'ArrestChargeStatus': true })
      storeData({ 'ChargeID': row.ChargeID, 'ArrestChargeStatus': true })
    }
  }

  const DeleteArrestCharge = () => {
    const val = { 'ChargeID': chargeID, 'DeletedByUserFK': loginPinID }
    AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message); get_Data_Arrest_Charge(arrestID); get_Arrest_Count(arrestID); get_ArrestCharge_Count(chargeID)
        setUpdateCount(updateCount + 1);
      } else { console.log("Somthing Wrong"); }
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Charges</p>
          <div style={{ marginLeft: 'auto' }}>
            <Link to={'/chargetab'} onClick={() => {
              setIncStatus(false);
            }} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#" style={{ marginTop: '-6px' }}>
              <i className="fa fa-plus"></i>
            </Link>

          </div>
        </div>
        <DataTable
          dense
          columns={columns}
          data={arrestChargeData}
          pagination
          selectableRowsHighlight
          highlightOnHover
        />
      </div>
      <DeletePopUpModal func={DeleteArrestCharge} />
    </>
  )
}

export default Charges