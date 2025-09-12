import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { ORIValidator } from '../../../../../Agency/AgencyValidation/validators';
import { toastifyError, toastifySuccess } from '../../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';

const Ori = (props) => {

  const { get_NameVictim_Count } = useContext(AgencyContext)

  const { victimID, nameID, loginPinID } = props
  const [oriData, setOriData] = useState();
  const [oriId, setOriId] = useState();
  const [status, setStatus] = useState(false);
  const [editval, setEditval] = useState();

  const [value, setValue] = useState({
    'ORI': '',
    'NameID': nameID,
    'VictimID': victimID,
    'CreatedByUserFK': loginPinID,
    'ModifiedByUserFK': '',
    'ORIID': '',
  })

  const [errors, setErrors] = useState({
    'DescriptionError': '',
  })

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        'ORI': editval?.ORI,
        'ORIID': editval?.ORIID,
        'ModifiedByUserFK': loginPinID,
      })
    } else {
      setValue({
        ...value,
        'ORI': '',
        'ORIID': '',
      })
    }
  }, [status])

  const Reset = () => {
    setValue({
      ...value,
      'ORI': '',
    })
    setErrors({
      ...errors,
      'DescriptionError': '',
    })
  }

  const check_Validation_Error = (e) => {
    if (ORIValidator(value.ORI)) {
      setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: ORIValidator(value.ORI) } })
    }
  }

  const { DescriptionError } = errors

  useEffect(() => {
    if (DescriptionError === 'true') {
      if (status) UpdateORI();
      else InsertORI();
    }
  }, [DescriptionError])


  useEffect(() => {
    get_Data_ORI(victimID);
  }, [victimID]);

  const get_Data_ORI = (victimID) => {
    const val = {
      'VictimID': victimID,
    }
    fetchPostData('VictimORI/GetData_VictimORI', val).then((res) => {
      if (res) {
        setOriData(res)
      } else {
        setOriData([]);
      }
    })
  }

  const handlChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    })
  }

  const InsertORI = () => {
    const result = oriData?.find(item => {
      if (item.ORI) {
        if (item.ORI.toLowerCase() === value.ORI.toLowerCase()) {
          return item.ORI.toLowerCase() === value.ORI.toLowerCase()
        } else return item.ORI.toLowerCase() === value.ORI.toLowerCase()
      }
    })
    if (result) {
      toastifyError('Description Already Exists')
      setErrors({ ...errors, ['DescriptionError']: '' })
    } else {
      AddDeleteUpadate('VictimORI/Insert_VictimORI', value).then((res) => {
        if (res) {
          toastifySuccess(res.Message);
          get_Data_ORI(victimID);
          Reset();
          get_NameVictim_Count(victimID)
          setErrors({
            ...errors,
            'DescriptionError': '',
          })
        } else {
          console.log("Somthing Wrong");
        }
      })
    }
  }

  const UpdateORI = () => {
    const result = oriData?.find(item => {
      if (item.ORI) {
        if (item.ORI.toLowerCase() === value.ORI.toLowerCase()) {
          return item.ORI.toLowerCase() === value.ORI.toLowerCase()
        } else return item.ORI.toLowerCase() === value.ORI.toLowerCase()
      }
    })
    if (result) {
      toastifyError('Description Already Exists')
      setErrors({ ...errors, ['DescriptionError']: '' })
    } else {
      AddDeleteUpadate('VictimORI/Update_VictimORI', value).then((res) => {
        if (res) {
          toastifySuccess(res.Message);
          get_Data_ORI(victimID);
          Reset();
          setStatus(false);
          setErrors({
            ...errors,
            'DescriptionError': '',
          })
        } else {
          console.log("Somthing Wrong");
        }
      })
    }
  }


  const columns = [
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, }}>
          <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditvalue(row) }}>
            <i className="fa fa-edit"></i>
          </Link>

        </div>


    },
    {
      name: 'Description',
      selector: (row) => row.ORI.toUpperCase(),
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, left: 25 }}>

          <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setOriId(row.ORIID) }} data-toggle="modal" data-target="#DeleteModal">
            <i className="fa fa-trash"></i>
          </Link>

        </div>

    }
  ]

  const setEditvalue = (row) => {
    setEditval(row);
    setStatus(true)
    setOriId(row.ORIID)
  }

  const CancelButton = () => {
    Reset();
    setStatus(false);
  }

  const DeleteotherCode = () => {
    const val = {
      'ORIID': oriId,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate('VictimORI/Delete_VictimORI', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Data_ORI(victimID);
        get_NameVictim_Count(victimID)

      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-12 " id='display-not-form'>
        <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
          <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0">ORI</p>
          </div>
        </div>
        <div className="row">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className="text-field">
              <input type="text" name='ORI' maxLength={9} style={{ textTransform: "uppercase" }} className='requiredColor' onChange={handlChange} value={value?.ORI} required />
              <label>ORI</label>
              {errors.DescriptionError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
              ) : null}
            </div>
          </div>
          <div className="row">
            {
              status ?

                <div className="col-6 col-md-6 col-lg-8  mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Update</button>
                </div>

                :

                <div className="col-6 col-md-6 col-lg-8  mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                </div>



            }
          </div>
          <div className="col-6 col-md-6 col-lg-4  mt-3 pt-1 p-0">
            <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { CancelButton(); }}>Cancel</button>
          </div>
        </div>
      </div>
      <div className="col-12">
        <DataTable
          columns={columns}
          data={oriData}
          dense
          pagination
          paginationPerPage={'3'}
          paginationRowsPerPageOptions={[3]}
          selectableRowsHighlight
          highlightOnHover
          noDataComponent={"There are no data to display"}
        />
      </div>
      <DeletePopUpModal func={DeleteotherCode} />
    </>
  )
}

export default Ori