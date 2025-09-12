import React, { useEffect, useRef, useState, useContext } from 'react'
import Select from "react-select";
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat';
import { Link } from 'react-router-dom';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { ArrChargeWeaponListDropDownArray } from '../../../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../../../Common/FindListDropDown';
import Loader from '../../../../../../Common/Loader';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';


const Weapon = ({ loginPinID, chargeID }) => {

  const { get_ArrestCharge_Count } = useContext(AgencyContext);

  const SelectedValue = useRef();
  const [weaponData, setWeaponData] = useState();
  const [weaponDrp, setWeaponDrp] = useState();
  const [chargeWeaponID, setChargeWeaponID] = useState();
  const [loder, setLoder] = useState(false)

  const [value, setValue] = useState({
    'ChargeWeaponTypeID': null,
    'ChargeID': chargeID,
    'CreatedByUserFK': loginPinID
  })

  const [errors, setErrors] = useState({
    'ChargeWeaponTypeIDError': '',
  })

  const Reset = () => {
    setValue({
      ...value,
      'WeaponID': '',
    })
    setErrors({
      'ChargeWeaponTypeIDError': '',
    });
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.ChargeWeaponTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ChargeWeaponTypeIDError']: RequiredFieldIncident(value.ChargeWeaponTypeID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { ChargeWeaponTypeIDError } = errors

  useEffect(() => {
    if (ChargeWeaponTypeIDError === 'true') {
      AddWeapon();
    }
  }, [ChargeWeaponTypeIDError])


  useEffect(() => {
    if (chargeID) {
      get_Weapon_DropDown(chargeID);
      get_Weapon_Data(chargeID);
    }
  }, [chargeID])


  const get_Weapon_Data = (chargeID) => {
    const val = {
      'ChargeID': chargeID
    }
    fetchPostData('ChargeWeaponType/GetData_ChargeWeaponType', val).then((res) => {
      if (res) {
        setWeaponData(res); setLoder(true)
      } else {
        setWeaponData([]); setLoder(true)
      }
    })
  }

  const get_Weapon_DropDown = (chargeID) => {
    const val = {
      'ChargeID': chargeID
    }
    fetchPostData('ChargeWeaponType/GetData_InsertChargeWeaponType', val).then((data) => {
      if (data) {
        setWeaponDrp(Comman_changeArrayFormat(data, 'WeaponID', 'Description'));
      }
      else {
        setWeaponDrp([])
      }
    })
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
  };

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [name]: e.value
      })
    } else setValue({
      ...value,
      [name]: null
    })
  }

  const AddWeapon = () => {
    AddDeleteUpadate('ChargeWeaponType/Insert_ChargeWeaponType', value).then((res) => {
      if (res) {
        toastifySuccess(res.Message); setErrors({ 'ChargeWeaponTypeIDError': '' })
        get_Weapon_Data();
        get_ArrestCharge_Count(chargeID)
        get_Weapon_DropDown();
        Reset();
        onClear();
        setErrors({
          ...errors,
          ['ChargeWeaponTypeIDError']: '',
        });
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  // Custom Style   
  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const columns = [
    {
      name: 'Description',
      selector: (row) => row.Weapon_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
      cell: row => <>
        <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setChargeWeaponID(row.chargeWeaponID); }} data-toggle="modal" data-target="#DeleteModal">
          <i className="fa fa-trash"></i>
        </Link>

      </>
    }
  ]

  const DeleteWeapon = () => {
    const val = {
      'ChargeWeaponID': chargeWeaponID,
      'DeletedByUserFK': loginPinID
    }
    AddDeleteUpadate('ChargeWeaponType/Delete_ChargeWeaponType', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Weapon_Data(chargeID);
        get_ArrestCharge_Count(chargeID)
        get_Weapon_DropDown();
      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Weapon</p>
          <div style={{ marginLeft: 'auto' }}>
            <FindListDropDown
              array={ArrChargeWeaponListDropDownArray}
            />
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className=" dropdown__box">
              <Select
                name='ChargeWeaponTypeID'
                styles={colourStyles}
                isClearable
                options={weaponDrp}
                onChange={(e) => { ChangeDropDown(e, 'ChargeWeaponTypeID'); }}
                placeholder="Select.."
                ref={SelectedValue}
              />
              <label htmlFor="">Weapon Type</label>
              {errors.ChargeWeaponTypeIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ChargeWeaponTypeIDError}</span>
              ) : null}
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-8 p-0" style={{ marginTop: '3px' }}>
            <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
              <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
            </div>
          </div>
        </div>
        <div className="col-12">
          {
            loder ?
              <DataTable
                columns={columns}
                data={weaponData}
                dense
                pagination
                selectableRowsHighlight
                highlightOnHover
                noDataComponent={"There are no data to display"}
              />
              :
              <Loader />
          }
        </div>
      </div>
      <DeletePopUpModal func={DeleteWeapon} />
    </>
  )
}

export default Weapon