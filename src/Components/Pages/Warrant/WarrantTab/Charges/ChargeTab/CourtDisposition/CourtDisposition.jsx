import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate } from './../../../../../../hooks/Api.js'
import { getShowingDateText, } from './../../../../../../Common/Utility';
import { toastifySuccess } from './../../../../../../Common/AlertMsg';
import DeletePopUpModal from './../../../../../../Common/DeleteModal';
import { ArrChargeCourtListDropDownArray } from '../../../../../../Utility/ListDropDownArray/ListDropArray.js';
import FindListDropDown from '../../../../../../Common/FindListDropDown.jsx';
import Loader from '../../../../../../Common/Loader.jsx';
import { AgencyContext } from '../../../../../../../Context/Agency/Index.js';
import CourtDispositionAddUp from './CourtDispositionAddUp.jsx';

const CourtDisposition = ({ loginPinID, loginAgencyID, chargeID }) => {

  const { get_ArrestCharge_Count } = useContext(AgencyContext);

  const [courtDispoData, setCourtDispoData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [updateStatus, setUpdateStatus] = useState(0)
  const [chargeCourtDispositionID, setChargeCourtDispositionID] = useState();
  const [loder, setLoder] = useState(false)

  useEffect(() => {
    get_CourtDisposition_Data(chargeID);
  }, [chargeID])

  const get_CourtDisposition_Data = (chargeID) => {
    const val = {
      'ChargeID': chargeID,
    }
    fetchPostData('ChargeCourtDisposition/GetData_ChargeCourtDisposition', val).then((res) => {
      if (res) {
        setCourtDispoData(res); setLoder(true)
      } else {
        setCourtDispoData([]); setLoder(true)
      }
    })
  }


  const columns = [
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
          <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CourtDispositionModal" >
            <i className="fa fa-edit"></i></Link>
        </div>
    },
    {
      name: 'Date/Time',
      selector: (row) => getShowingDateText(row.DispositionDtTm),
      sortable: true
    },
    {
      name: 'Comment',
      selector: (row) => row.Comments,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 65 }}>
          <Link to={`#`} onClick={() => { setChargeCourtDispositionID(row.chargeCourtDispositionID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
            <i className="fa fa-trash"></i>
          </Link>

        </div>

    }
  ]

  const set_Edit_Value = (e, row) => {
    get_ArrestCharge_Count(row.chargeID)
    setStatus(true);
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    setChargeCourtDispositionID(row.chargeCourtDispositionID);
  }

  const DeleteCourtDisposition = () => {
    const val = {
      'ChargeCourtDispositionID': chargeCourtDispositionID,
      'DeletedByUserFK': loginPinID
    }
    AddDeleteUpadate('ChargeCourtDisposition/Delete_ChargeCourtDisposition', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_CourtDisposition_Data(chargeID)
        get_ArrestCharge_Count(chargeID);
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setStatus(false)
    setModal(true)
  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="bg-line text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center">
            Court Disposition
          </p>
          <div>
            <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
              data-toggle="modal" data-target="#CourtDispositionModal" >
              <i className="fa fa-plus"></i>
            </Link>

            <FindListDropDown
              array={ArrChargeCourtListDropDownArray}
            />
          </div>
        </div>
        {
          loder ?
            <DataTable
              dense
              columns={columns}
              data={courtDispoData}
              pagination
              highlightOnHover
              noDataComponent={"There are no data to display"}
            />
            :
            <Loader />
        }
      </div>
      <DeletePopUpModal func={DeleteCourtDisposition} />
      <CourtDispositionAddUp {...{ chargeID, loginPinID, loginAgencyID, status, setStatus, chargeCourtDispositionID, modal, setModal, get_CourtDisposition_Data, updateStatus }} />
    </>
  )
}

export default CourtDisposition;



