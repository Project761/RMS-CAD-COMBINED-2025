import { useEffect, useState, memo, useContext, useRef } from 'react'
import SelectBox from '../../../../../../Common/SelectBox';
import { AddDeleteUpadate, fetchPostData, } from '../../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { ErrorTooltip, NameVictimOffenses } from '../../../../../../NIBRSError';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { components } from "react-select";
import { offenseArray, threeColVictimOffenseArray } from '../../../../../../Common/ChangeArrayFormat';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../../redux/api';
import { Decrypt_Id_Name } from '../../../../../../Common/Utility';

const Offense = (props) => {

  const { DecNameID, DecIncID, victimID } = props

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const { get_NameVictim_Count, get_Name_Count, } = useContext(AgencyContext);
  const SelectedValue = useRef();
  const [offenseDrp, setOffenseDrp] = useState();
  const [offenseNameData, setOffenseNameData] = useState([]);
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
  const [loginPinID, setLoginPinID,] = useState('');
  const [nameID, setNameID] = useState('');
  const [incidentID, setIncidentID] = useState();
  const [multiSelected, setMultiSelected] = useState({
    OffenseID: null,
  })

  const [value, setValue] = useState({
    'OffenseID': '',
    'NameID': DecNameID,
    'VictimID': victimID,
    'CreatedByUserFK': loginPinID,
    'VictimOffenseID': '',
  })

  useEffect(() => {
    setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'NameID': nameID, 'VictemTypeCode': null, } });
  }, [loginPinID])

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (DecNameID) {
      setNameID(DecNameID);
      setIncidentID(DecIncID);
    }
  }, [DecNameID, loginPinID,]);

  useEffect(() => {
    if (victimID) { get_OffenseName_Data(); }
  }, [victimID])

  useEffect(() => {
    if (victimID) {
      get_Offense_DropDown(incidentID, victimID);
    }
  }, [incidentID, victimID])

  const get_OffenseName_Data = () => {
    const val = { 'VictimID': victimID, }
    fetchPostData('VictimOffense/GetData_VictimOffense', val).then((res) => {
      if (res) {
        setTypeOfSecurityEditVal(offenseArray(res, 'VictimOffenseID', 'OffenseID', 'NameID', 'VictimID', 'Offense_Description', 'PretendToBeID'));
        get_NameVictim_Count(victimID)
      } else {
        setTypeOfSecurityEditVal([]);
      }
    })
  }

  useEffect(() => {
    if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['OffenseID']: typeOfSecurityEditVal } }) }
  }, [typeOfSecurityEditVal])

  const get_Offense_DropDown = (incidentID, victimID) => {
    const val = {
      'IncidentID': incidentID,
      'VictimID': victimID
    }
    fetchPostData('VictimOffense/GetData_InsertVictimOffense', val).then((data) => {
      if (data) {
        setOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description'))
      } else {
        setOffenseDrp([])
      }
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
      DelSertBasicInfo(missing.value, 'VictimOffenseID', 'VictimOffense/Delete_VictimOffense')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'OffenseID', 'VictimOffense/Insert_VictimOffense')
    }
  }


  const InSertBasicInfo = (id, col1, url) => {
    const val = {
      'NameID': nameID,
      'VictimID': victimID,
      [col1]: id,
      'CreatedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        get_Name_Count(DecNameID)
        get_Offense_DropDown(incidentID, victimID);

        col1 === 'OffenseID' && get_OffenseName_Data();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (VictimOffenseID, col1, url) => {
    const val = {
      [col1]: VictimOffenseID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        get_Name_Count(DecNameID)
        get_Offense_DropDown(incidentID, victimID);

        col1 === 'VictimOffenseID' && get_OffenseName_Data()
      } else {
        console.log("res");
      }
    })
  }

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      minHeight: 70,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  return (
    <>
      <div className="col-12 " id='display-not-form'>
        <div className="row mt-2">
          <div className="col-2 col-md-2 col-lg-1 mt-4">
            <label htmlFor="" className='label-name '>Offense {offenseNameData.length > 0 && value?.OffenseID ? ErrorTooltip(NameVictimOffenses) : <></>}
            </label>
          </div>
          <div className="col-8 col-md-8 col-lg-10  mt-2" >
            <SelectBox
              name='OffenseID'

              isClearable
              options={offenseDrp}
              closeMenuOnSelect={false}

              placeholder="Select.."
              components={{ MultiValue, }}
              onChange={(e) => offense(e)}
              value={multiSelected.OffenseID}
              ref={SelectedValue}
              className="basic-multi-select"
              isMulti
              styles={customStylesWithOutColor}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(Offense)