
import React, { useRef, useContext, useState, useEffect } from 'react'
import Select from "react-select";
import { components } from "react-select";
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { Comman_changeArrayFormatChargeWeapon, threeColArray } from '../../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../redux/actions/Agency';

const CitationWeapon = () => {

//   const { DecChargeId } = props
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const SelectedValue = useRef();
  const { get_ArrestCharge_Count } = useContext(AgencyContext);
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
  const [typeOfSecurityList, setTypeOfSecurityList] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [arrestID, setArrestID] = useState('');
  const [ChargeID, setChargeID] = useState('');
  const [incidentID, setIncidentID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  //screen permission 

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const [value, setValue] = useState({
    'ChargeWeaponTypeID': null,
    'ChargeID': '',
    'CreatedByUserFK': '',
  })

  const [multiSelected, setMultiSelected] = useState({
    ChargeWeaponTypeID: null,
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

//   useEffect(() => {
//     if (localStoreData) {
//       setLoginPinID(localStoreData?.PINID); setIncidentID(localStoreData?.IncidentID); setLoginAgencyID(parseInt(localStoreData?.AgencyID)); setChargeID(DecChargeId)
//     }
//   }, [localStoreData]);

//   useEffect(() => {
//     if (DecChargeId) {
//       setValue({
//         ...value,
//         'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID,

//       })
//       get_Security_Data(DecChargeId); setArrestID(DecChargeId);
//     }
//   }, [DecChargeId]);


  const [errors, setErrors] = useState({
    'TypeOfSecError': '',
  })

  useEffect(() => {
    if (ChargeID) { get_Security_Data(ChargeID); get_Security_DropDown(ChargeID); }
  }, [ChargeID])

  useEffect(() => {
    if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['ChargeWeaponTypeID']: typeOfSecurityEditVal } }) }
  }, [typeOfSecurityEditVal])


  const typeofsecurity = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      ChargeWeaponTypeID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < typeOfSecurityEditVal?.length) {
      let missing = null;
      let i = typeOfSecurityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
      }
      DelSertBasicInfo(missing.value, 'ChargeWeaponID', 'ChargeWeaponType/Delete_ChargeWeaponType')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'ChargeWeaponTypeID', 'ChargeWeaponType/Insert_ChargeWeaponType')
    }
  }

  const get_Security_Data = (ChargeID) => {
    const val = {
      'ChargeID': ChargeID
    }
    fetchPostData('ChargeWeaponType/GetData_ChargeWeaponType', val).then((res) => {
      if (res) {
        setTypeOfSecurityEditVal(Comman_changeArrayFormatChargeWeapon(res, 'ChargeWeaponID', 'ChargeID', 'ChargeWeaponTypeID', 'PretendToBeID', 'Weapon_Description'));
      } else {
        setTypeOfSecurityEditVal([]);
      }
    })
  }
  const get_Security_DropDown = (chargeID) => {
    const val = {
      'ChargeID': chargeID
    }
    fetchPostData('ChargeWeaponType/GetData_InsertChargeWeaponType', val).then((data) => {
      if (data) {
        setTypeOfSecurityList(threeColArray(data, 'WeaponID', 'Description'));
      }
      else {
        setTypeOfSecurityList([])
      }
    })
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
  };

  const InSertBasicInfo = (id, col1, url, chargeID) => {
    const val = {
      'ChargeID': ChargeID,
      [col1]: id,
      'CreatedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'ChargeWeaponTypeID' && get_Security_Data(ChargeID); get_ArrestCharge_Count(ChargeID); get_Security_DropDown(ChargeID);
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (ChargeWeaponID, col1, url) => {
    const val = {
      [col1]: ChargeWeaponID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'ChargeWeaponID' && get_Security_Data(ChargeID); get_ArrestCharge_Count(ChargeID); get_Security_DropDown(ChargeID);
      } else {
        console.log("res");
      }
    })
  }
  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      minHeight: 60,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };
  return (
    <>

      <div className="col-12 ">
        <div className="row mt-1">
          <div className="col-2 col-md-2 col-lg-2 mt-4">
            <label htmlFor="" className='new-label'>Weapon</label>
          </div>
          <div className="col-7 col-md-7 col-lg-5 mt-2 mb-2">
            {
              value?.ChargeWeaponTypeIDName ?
                <Select
                  className="basic-multi-SelectBox"
                  isMulti
                  name='ChargeWeaponTypeID'
                  isClearable
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  options={typeOfSecurityList}
                  onChange={(e) => typeofsecurity(e)}
                  value={multiSelected.ChargeWeaponTypeID}
                  components={{ MultiValue, }}
                  placeholder="Select Type Of Weapon From List.."
                  styles={customStylesWithOutColor}
                />
                :
                <Select
                  className="basic-multi-select"
                  isMulti
                  name='ChargeWeaponTypeID'
                  isClearable
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  options={typeOfSecurityList}
                  onChange={(e) => typeofsecurity(e)}
                  value={multiSelected.ChargeWeaponTypeID}
                  placeholder="Select Type Of Weapon From List.."
                  components={{ MultiValue, }}
                  styles={customStylesWithOutColor}

                />
            }
          </div>
        </div>
      </div>

    </>
  )
}

export default CitationWeapon

