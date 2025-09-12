import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormatBasicInfowithoutcode, threeColVictimOffenseArray, offenseArray, AssaultInjuryComArrayFormat, threeColArray, threeColVictimInjuryArray } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { components } from "react-select";
import SelectBox from '../../../../../../Common/SelectBox';
import { get_LocalStoreData } from '../../../../../../../redux/api';
import { Decrypt_Id_Name } from '../../../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import NameListing from '../../../../../ShowAllList/NameListing';
import { get_ScreenPermissions_Data } from '../../../../../../../redux/actions/IncidentAction';

const Home = (props) => {

  const { ListData, DecNameID, DecMasterNameID, DecIncID } = props
  const { setOffenderCount } = useContext(AgencyContext);

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);

  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();

  const [offenderOffenseDrp, setOffenderOffenseDrp] = useState();
  const [offenderAssaultDrp, setOffenderAssaultDrp] = useState();
  const [value, setValue] = useState()
  const [nameID, setNameID] = useState();
  const [loginPinID, setLoginPinID,] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [incidentID, setIncidentID] = useState('');
  const [assaultEditVal, setAssaultEditVal] = useState();
  const [injuryTypeEditVal, setInjuryTypeEditVal] = useState();
  const [injuryTypeDrp, setInjuryTypeDrp] = useState();
  const [propertyDrp, setPropertyDrp] = useState();
  const [propertyEditVal, setPropertyEditVal] = useState();

  //ids
  const [offenderOffenseID, setOffenderOffenseID] = useState();
  const [offenderAssaultID, setOffenderAssaultID] = useState();
  const [offenderInjuryID, setOffenderInjuryID] = useState();
  const [offenderPropertyID, setOffenderPropertyID] = useState();

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("N058", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);


  useEffect(() => {
    if (DecNameID) {
      setNameID(DecNameID);
      setIncidentID(DecIncID);
    }
  }, [DecNameID, loginPinID,]);

  useEffect(() => {
    if (DecNameID && DecMasterNameID) {
      setValue({ ...value, 'NameID': DecNameID, 'CreatedByUserFK': loginPinID, })
    }
  }, [DecNameID, DecMasterNameID, loginPinID]);

  useEffect(() => {
    if (nameID) { get_Offense_Data(nameID); get_InjuryType_Data(nameID); get_Offender_Assault_Data(DecNameID); get_Offender_Property_Data(nameID); }
  }, [nameID])

  // offence
  useEffect(() => {
    if (typeOfSecurityEditVal) { setOffenderOffenseID(typeOfSecurityEditVal) }
  }, [typeOfSecurityEditVal])

  useEffect(() => {
    if (assaultEditVal) { setOffenderAssaultID(assaultEditVal) }
  }, [assaultEditVal])

  useEffect(() => {
    if (injuryTypeEditVal) { setOffenderInjuryID(injuryTypeEditVal) }
  }, [injuryTypeEditVal])

  useEffect(() => {
    if (propertyEditVal) { setOffenderPropertyID(propertyEditVal) }
  }, [propertyEditVal])

  useEffect(() => {
    const isAnyArrayEmpty = (Array.isArray(offenderOffenseID) && offenderOffenseID.length === 0) && (Array.isArray(offenderAssaultID) && offenderAssaultID.length === 0) && (Array.isArray(offenderInjuryID) && offenderInjuryID.length === 0) &&
      (Array.isArray(offenderPropertyID) && offenderPropertyID.length === 0);
    if (isAnyArrayEmpty) {
      setOffenderCount(false);
    } else {
      setOffenderCount(true);
    }
  }, [offenderOffenseID, offenderAssaultID, offenderInjuryID, offenderPropertyID]);


  useEffect(() => {
    if (incidentID) {
      get_Data_Offense_Drp(incidentID, nameID);
      get_Offender_Assault_Drp(incidentID, nameID);
      get_Data_InjuryType_Drp(incidentID, nameID);
      get_Offender_Property_Drp(incidentID, nameID);
    }
  }, [nameID, incidentID, loginAgencyID])

  const get_Offense_Data = () => {
    const val = { 'NameID': nameID, }
    fetchPostData('OffenderOffense/GetData_OffenderOffense', val).then((res) => {
      if (res) {
        console.log("🚀 ~ fetchPostData ~ res:", res);
        const offence360 = res.filter((item) => item?.FBICode === '13A');
        setTypeOfSecurityEditVal(offenseArray(res, 'OffenderOffenseID', 'OffenseID', 'NameID', 'VictimID', 'Offense_Description', 'PretendToBeID'));
      } else {
        setTypeOfSecurityEditVal([]);
      }
    })
  }

  const get_InjuryType_Data = () => {
    const val = { 'NameID': nameID, }
    fetchPostData('OffenderInjury/GetData_OffenderInjury', val).then((res) => {
      if (res) {
        setInjuryTypeEditVal(AssaultInjuryComArrayFormat(res, 'InjuryID', 'NameID', 'PretendToBeID', 'OffenderInjuryID', 'Injury_Description'));
      } else {
        setInjuryTypeEditVal([]);
      }
    })
  }

  const get_Offender_Assault_Data = () => {
    const val = { 'NameID': nameID, }
    fetchPostData('OffenderAssault/GetData_OffenderAssault', val).then((res) => {
      if (res) {
        setAssaultEditVal(AssaultInjuryComArrayFormat(res, 'OffenderAssaultID', 'NameID', 'PretendToBeID', 'AssaultID', 'Assault_Description'));
      } else {
        setAssaultEditVal([]);
      }
    })
  }

  const get_Offender_Property_Data = () => {
    const val = { 'NameID': nameID, }
    fetchPostData('OffenderProperty/GetData_OffenderProperty', val).then((res) => {
      if (res) {
        setPropertyEditVal(Comman_changeArrayFormatBasicInfowithoutcode(res, 'OffenderPropertyID', 'NameID', 'PretendToBeID', 'PropertyID', 'Description'));
      } else {
        setPropertyEditVal([]);
      }
    })
  }

  const get_Data_Offense_Drp = (incidentID, nameID) => {
    const val = { 'NameID': nameID, 'IncidentId': incidentID, }
    fetchPostData('OffenderOffense/GetData_InsertOffenderOffense', val).then((data) => {
      if (data) {
        const offence360 = data.filter((item) => item?.FBICode === '13A');
        console.log("🚀 ~ fetchPostData ~ offence360:", offence360);
        setOffenderOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description', 'FBICode'))
      } else {
        setOffenderOffenseDrp([])
      }
    })
  }

  const get_Data_InjuryType_Drp = (incidentID, nameID) => {
    const val = { 'NameID': nameID, 'IncidentId': incidentID, }
    fetchPostData('OffenderInjury/GetData_InsertOffenderInjury', val).then((data) => {
      if (data) {

        setInjuryTypeDrp(threeColVictimInjuryArray(data, 'VictimInjuryID', 'Description', 'InjuryCode'))
      } else {
        setInjuryTypeDrp([])
      }
    })
  }

  const get_Offender_Assault_Drp = (incidentID, nameID) => {
    const val = { 'NameID': nameID, 'IncidentId': incidentID, }
    fetchPostData('OffenderAssault/GetData_InsertOffenderAssault', val).then((data) => {
      if (data) {
        setOffenderAssaultDrp(Comman_changeArrayFormat(data, 'AssaultTypeID', 'Description'))
      } else {
        setOffenderAssaultDrp([])
      }
    })
  }

  const get_Offender_Property_Drp = (incidentID, nameID) => {
    const val = { 'NameID': nameID, 'IncidentId': incidentID, }
    fetchPostData('OffenderProperty/GetData_InsertOffenderProperty', val).then((data) => {
      if (data) {
        setPropertyDrp(threeColArray(data, 'PropertyID', 'Description'))
      } else {
        setPropertyDrp([])
      }
    })
  }


  const AssaultTypeChange = (multiSelected) => {
    setOffenderAssaultID(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < assaultEditVal?.length) {
      let missing = null;
      let i = assaultEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(assaultEditVal[--i])) ? missing : assaultEditVal[i];
      }
      DelSertBasicInfo(missing.value, 'OffenderAssaultID', 'OffenderAssault/DeleteOffenderAssault')

    } else {
      setOffenderCount(true);
      InSertBasicInfo(multiSelected[len].value, 'AssaultID', 'OffenderAssault/InsertOffenderAssault')
    }
  }

  const InjuryTypeChange = (multiSelected) => {

    setOffenderInjuryID(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < injuryTypeEditVal?.length) {
      let missing = null;
      let i = injuryTypeEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(injuryTypeEditVal[--i])) ? missing : injuryTypeEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'OffenderInjuryID', 'OffenderInjury/DeleteOffenderInjury')

    } else {
      setOffenderCount(true);
      InSertBasicInfo(multiSelected[len].value, 'InjuryID', 'OffenderInjury/InsertOffenderInjury')
    }
  }

  const PropertyChange = (multiSelected) => {
    setOffenderPropertyID(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < propertyEditVal?.length) {
      let missing = null;
      let i = propertyEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(propertyEditVal[--i])) ? missing : propertyEditVal[i];
      }
      DelSertBasicInfo(missing.value, 'OffenderPropertyID', 'OffenderProperty/Delete_OffenderProperty')

    } else {
      setOffenderCount(true);
      InSertBasicInfo(multiSelected[len].value, 'PropertyID', 'OffenderProperty/Insert_OffenderProperty')
    }
  }

  const InSertBasicInfo = (id, col1, url) => {
    const val = {
      'NameID': nameID,
      [col1]: id,
      'CreatedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        col1 === 'OffenseID' && get_Offense_Data(); get_Data_Offense_Drp(incidentID, nameID);
        col1 === 'PropertyID' && get_Offender_Property_Data(); get_Offender_Property_Drp(incidentID, nameID);
        col1 === 'InjuryID' && get_InjuryType_Data();
        col1 === 'AssaultID' && get_Offender_Assault_Data(); get_Offender_Assault_Drp(incidentID, nameID);
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (OffenderOffenseID, col1, url) => {
    const val = {
      [col1]: OffenderOffenseID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        col1 === 'OffenderOffenseID' && get_Offense_Data(); get_Data_Offense_Drp(incidentID, nameID);
        col1 === 'OffenderPropertyID' && get_Offender_Property_Data(); get_Offender_Property_Drp(incidentID, nameID);
        col1 === 'OffenderInjuryID' && get_InjuryType_Data()
        col1 === 'OffenderAssaultID' && get_Offender_Assault_Data(); get_Offender_Assault_Drp(incidentID, nameID);
      } else {
        console.log("Somthing Wrong");
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
      <NameListing {... { ListData }} />
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12">
            <div className="row">

              <div className="col-2 col-md-2 col-lg-2 mt-5">
                <Link to={'/ListManagement?page=Assault%20Type&call=/Off-Home?page=CrimeInformation'} className='new-link'>
                  Assault Type
                </Link>
              </div>
              <div className="col-4 col-md-4 col-lg-4 mt-4">
                <SelectBox
                  className="basic-multi-select"
                  styles={customStylesWithOutColor}

                  value={offenderAssaultID}
                  name='OffenderAssaultID'
                  options={offenderAssaultDrp}
                  isClearable={false}

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => AssaultTypeChange(e)}
                  placeholder='Select Assault Type List'

                />
              </div>
              <div className="col-2 col-md-2 col-lg-2 mt-5">
                <Link to={'/ListManagement?page=Injury%20Type&call=/Name-Home?page=Offender'} className='new-link'>
                  Injury Type
                </Link>
              </div>
              <div className="col-4 col-md-4 col-lg-4  mt-4 ">
                <SelectBox
                  className="basic-multi-select"

                  value={offenderInjuryID}
                  styles={customStylesWithOutColor}
                  name='OffenderInjuryID'
                  options={injuryTypeDrp}
                  isClearable={false}

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => InjuryTypeChange(e)}
                  placeholder='Select Injury Type List'
                />
              </div>
            </div>
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-5">
            <label htmlFor="" className='new-label'>
              Property
            </label>
          </div>
          <div className="col-10 col-md-10 col-lg-10 mt-4">
            <SelectBox
              className="basic-multi-select"

              value={offenderPropertyID}
              name='OffenderPropertyID'
              options={propertyDrp}
              isClearable={false}

              isMulti

              closeMenuOnSelect={false}
              hideSelectedOptions={true}
              components={{ MultiValue, }}
              onChange={(e) => PropertyChange(e)}
              placeholder='Select Property List'
              styles={customStylesWithOutColor}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home