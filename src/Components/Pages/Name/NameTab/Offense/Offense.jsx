import { useEffect, useState, memo, useContext, useRef } from 'react'
import { components } from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import SelectBox from '../../../../Common/SelectBox';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { threeColVictimOffenseArray, offenseArray, } from '../../../../Common/ChangeArrayFormat';
import { get_LocalStoreData } from '../../../../../redux/api';
import { Decrypt_Id_Name, isLockOrRestrictModule, MultiSelectLockedStyle } from '../../../../Common/Utility';
import NameListing from '../../../ShowAllList/NameListing';


const Offense = (props) => {

  const { DecNameID, DecMasterNameID, DecIncID, ListData, isLocked } = props
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const { get_Name_Count, setoffenceCountStatus, } = useContext(AgencyContext);
  const SelectedValue = useRef();
  const [offenseDrp, setOffenseDrp] = useState();
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
  const [loginPinID, setLoginPinID,] = useState('');
  const [nameID, setNameID] = useState('');
  const [masterNameID, setmasterNameID] = useState('');
  const [incidentID, setIncidentID] = useState();
  const [multiSelected, setMultiSelected] = useState({ OffenseID: null, });

  const [value, setValue] = useState({
    'OffenseID': '',
    'NameID': DecNameID,
    'CreatedByUserFK': loginPinID,
    'MasterNameID': DecMasterNameID
  })

  useEffect(() => {
    setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'NameID': nameID, 'VictemTypeCode': null, 'MasterNameID': masterNameID } });
  }, [loginPinID])

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (DecNameID) {
      setNameID(DecNameID); setIncidentID(DecIncID);

    }
    else if (DecMasterNameID) {
      setmasterNameID(DecMasterNameID)
    }
  }, [DecNameID, loginPinID, DecMasterNameID]);


  useEffect(() => {
    if (DecNameID) {
      get_OffenseName_Data(DecNameID);
    }
  }, [DecNameID])

  useEffect(() => {
    if (incidentID) {
      get_Offense_DropDown(incidentID, DecNameID);
    }
  }, [incidentID])

  const get_OffenseName_Data = (DecNameID) => {
    const val = { 'NameID': DecNameID, }
    fetchPostData('NameOffense/GetData_NameOffense', val).then((res) => {
      if (res) {
        // console.log("🚀 ~ fetchPostData ~ res:", res);
        setTypeOfSecurityEditVal(offenseArray(res, 'NameOffenseID', 'OffenseID', 'NameID', 'NameID', 'Offense_Description', 'PretendToBeID'));
      } else {
        setTypeOfSecurityEditVal([]);
      }
    }).catch((err) => {
      console.log("🚀 ~ getOffenseData ~ err:", err);
    })
  }

  useEffect(() => {
    if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['OffenseID']: typeOfSecurityEditVal } }) }
  }, [typeOfSecurityEditVal])

  const get_Offense_DropDown = (incidentID, nameID) => {
    const val = {
      'IncidentID': incidentID,
      'NameID': nameID,
      'MasterNameID': masterNameID,
      'IsMaster': nameID ? false : true
    }
    fetchPostData('NameOffense/GetData_InsertNameOffense', val).then((data) => {
      if (data) {
        setOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description'))
      } else {
        setOffenseDrp([])
      }
    }).catch((err) => {
      console.log("🚀 ~get_Offense_DropDown fetchpostdata error ~ err:", err);
    })
  }


  const offense = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      OffenseID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < typeOfSecurityEditVal?.length) {
      let missing = null;
      let i = typeOfSecurityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
      }
      DelSertBasicInfo(missing.value, 'NameOffenseID', 'NameOffense/Delete_NameOffense')
    } else {
      InSertBasicInfo(multiSelected[len]?.value, 'OffenseID', 'NameOffense/Insert_NameOffense')
    }
    if (multiSelected.length > 0) {
      setoffenceCountStatus(true);
    } else {
      setoffenceCountStatus(false);
    }
  }

  const InSertBasicInfo = (id, col1, url) => {
    const val = {
      'NameID': nameID,
      [col1]: id,
      'CreatedByUserFK': loginPinID,
      'MasterNameID': masterNameID,
      'IsMaster': nameID ? false : true
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        get_Name_Count(DecNameID)
        get_Offense_DropDown(incidentID, DecNameID);


        col1 === 'OffenseID' && get_OffenseName_Data(DecNameID);
      } else {
        console.log("Somthing Wrong");
      }
    }).catch((err) => {
      console.log("🚀 ~ Insert AddDeleteUpadate ~ err:", err);
    })
  }

  const DelSertBasicInfo = (OffenseID, col1, url) => {
    const val = {
      [col1]: OffenseID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        get_Name_Count(DecNameID)
        get_Offense_DropDown(incidentID, DecNameID);

        col1 === 'NameOffenseID' && get_OffenseName_Data(DecNameID)
      } else {
        // console.log("res");
      }
    }).catch((err) => {
      console.log("🚀 ~Delete AddDeleteUpadate ~ err:", err);
    })
  }

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      minHeight: 150,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: "134px",
      overflowY: "auto",
    }),
  };

  const customDisabledStylesLockedColor = {
    control: base => ({
      ...base,
      backgroundColor: "#D9E4F2",
      minHeight: 150,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: "134px",
      overflowY: "auto",
    }),
  };

  const CheckboxOption = props => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <label className='ml-2'>{props.label}</label>
      </components.Option>
    );
  };

  return (
    <>
      <NameListing {...{ ListData }} />
      <div className="col-12 " id='display-not-form'>
        <div className='row'>
          <label htmlFor="" className='label-name ' style={{ marginLeft: "90px", fontSize: "15px" }}>Please select the offenses associated with this person for this incident from the dropdown. </label>
        </div>
        <div className="row  align-items-center mt-2">
          <div className="col-2 col-md-2 col-lg-1 ">
            <label htmlFor="" className='label-name '>
              Offense
            </label>
          </div>
          <div className="col-8 col-md-8 col-lg-8  mt-2" >
            <SelectBox
              name='OffenseID'
              isClearable
              options={offenseDrp}
              closeMenuOnSelect={false}
              components={{ Option: CheckboxOption }}
              placeholder="Select.."
              onChange={(e) => offense(e)}
              value={multiSelected.OffenseID}
              ref={SelectedValue}
              className="basic-multi-select select-box_offence"
              isMulti
              // styles={customStylesWithOutColor}
              styles={isLockOrRestrictModule("Lock", typeOfSecurityEditVal, isLocked, true) ? customDisabledStylesLockedColor : customStylesWithOutColor}
              isDisabled={isLockOrRestrictModule("Lock", typeOfSecurityEditVal, isLocked, true) ? true : false}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Offense)