
import  { useRef, useContext, useState, useEffect } from 'react'
import Select from "react-select";
import { components } from "react-select";
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { threeColArray } from '../../../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name } from '../../../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../../redux/actions/Agency';

const Weapon = (props) => {

  const { DecChargeId } = props
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const SelectedValue = useRef();
  const { get_ArrestCharge_Count } = useContext(AgencyContext);
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
  const [typeOfSecurityList, setTypeOfSecurityList] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [ChargeID, setChargeID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const [value, setValue] = useState({
    'ChargeWeaponTypeID': null, 'ChargeID': '', 'CreatedByUserFK': '',
  })

  const [multiSelected, setMultiSelected] = useState({
    ChargeWeaponTypeID: null,
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(parseInt(localStoreData?.AgencyID)); setChargeID(DecChargeId)
    }
  }, [localStoreData]);

  useEffect(() => {
    if (loginAgencyID) {
      setValue({
        ...value, 'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID,
      }); get_Security_Data(DecChargeId); get_Security_DropDown(ChargeID);
    }
  }, [loginAgencyID]);


  useEffect(() => {
    if (DecChargeId) { setChargeID(DecChargeId) }
  }, [DecChargeId])

  useEffect(() => {
    if (typeOfSecurityEditVal) {
      setMultiSelected(prevValues => { return { ...prevValues, ['ChargeWeaponTypeID']: typeOfSecurityEditVal } })
    }
  }, [typeOfSecurityEditVal])

  const typeofsecurity = (multiSelected) => {
    setMultiSelected({ ...multiSelected, ChargeWeaponTypeID: multiSelected })
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
    const val = { 'ChargeID': ChargeID }
    fetchPostData('ChargeWeaponType/GetData_ChargeWeaponType', val).then((res) => {
      if (res) {
        setTypeOfSecurityEditVal(Comman_changeArrayFormatChargeWeapon(res, 'ChargeWeaponID', 'WeaponCode', 'PretendToBeID', 'Weapon_Description', 'Weapon_Description', 'ChargeWeaponTypeID'));
      }
      else { setTypeOfSecurityEditVal([]); }
    })
  }

  const Comman_changeArrayFormatChargeWeapon = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
      const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[col4], id: sponsor[Code], code: sponsor[Code] })
      )
      return result
    } else {
      const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[col4], code: sponsor[col4] })
      )
      return result
    }
  }

  const get_Security_DropDown = (chargeID) => {
    const val = { 'ChargeID': chargeID }
    fetchPostData('ChargeWeaponType/GetData_InsertChargeWeaponType', val).then((data) => {
      if (data) {
        setTypeOfSecurityList(threeColArray(data, 'WeaponID', 'Description', 'WeaponCode'));
      } else {
        setTypeOfSecurityList([])
      }
    })
  }

  
  const InSertBasicInfo = (id, col1, url) => {
    const val = { 'ChargeID': ChargeID, [col1]: id, 'CreatedByUserFK': loginPinID, }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'ChargeWeaponTypeID' && get_Security_Data(ChargeID); get_ArrestCharge_Count(ChargeID); get_Security_DropDown(ChargeID);
      } else { console.log("Somthing Wrong"); }
    })
  }

  const DelSertBasicInfo = (ChargeWeaponID, col1, url) => {
    const val = { [col1]: ChargeWeaponID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'ChargeWeaponID' && get_Security_Data(ChargeID); get_ArrestCharge_Count(ChargeID); get_Security_DropDown(ChargeID);
      }
    })
  }

  function filterArray(arr, key) {
    return [...new Map(arr?.map(item => [item[key], item])).values()]
  }

  const filterUnArmed = (arr) => {
    const ValArr = multiSelected.ChargeWeaponTypeID ? multiSelected.ChargeWeaponTypeID : []

    const unArmedArr = ValArr?.filter((item) => item?.id === '01');

    if (unArmedArr?.length > 0) {
      return []

    } else {
      const weaponValues = ValArr?.map((item) => item?.id)
      const otherFilterArr = arr?.filter((item) => !weaponValues?.includes(item?.id));
      return otherFilterArr

    }
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
                  isClearable={false}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  options={typeOfSecurityList ? filterUnArmed(typeOfSecurityList) : []}
                  onChange={(e) => typeofsecurity(e)}
                  value={filterArray(multiSelected.ChargeWeaponTypeID, 'label')}
                  components={{ MultiValue, }}
                  placeholder="Select Type Of Weapon From List.."
                  styles={customStylesWithOutColor}
                />
                :
                <Select
                  className="basic-multi-select"
                  isMulti
                  name='ChargeWeaponTypeID'
                  isClearable={false}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  options={typeOfSecurityList ? filterUnArmed(typeOfSecurityList) : []}
                  onChange={(e) => typeofsecurity(e)}
                  value={filterArray(multiSelected.ChargeWeaponTypeID, 'label')}
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

export default Weapon

