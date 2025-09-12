import {  useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { threeColVictimInjuryArray, Comman_changeArrayFormatBasicInfo } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { components } from "react-select";

const InjuryType = (props) => {

  const { victimID, nameID, loginPinID, incidentID, } = props

  const [injuryTypeDrp, setInjuryTypeDrp] = useState();
  const [injuryTypeEditVal, setInjuryTypeEditVal] = useState();
  const [multiSelected, setMultiSelected] = useState({
    VictimInjuryID: null,
  })

  const SelectedValue = useRef();

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  
  useEffect(() => {
    if (victimID) {
      get_Data_InjuryType_Drp(incidentID, victimID);
    }
  }, [incidentID, victimID])


  useEffect(() => {
    if (victimID) { get_InjuryType_Data(); }
  }, [victimID])

  const get_InjuryType_Data = () => {
    const val = { 'VictimID': victimID, }
    fetchPostData('InjuryVictim/GetData_InjuryVictim', val).then((res) => {
      if (res) {
        setInjuryTypeEditVal(Comman_changeArrayFormatBasicInfo(res, 'VictimInjuryID', 'NameID', 'PretendToBeID', 'NameEventInjuryID', 'VictimInjury_Description'));
      } else {
        setInjuryTypeEditVal([]);
      }
    })
  }

  const get_Data_InjuryType_Drp = (incidentID, victimID) => {
    const val = { 'IncidentID': incidentID, 'VictimID': victimID }
    fetchPostData('InjuryVictim/GetData_InsertVictimInjury', val).then((data) => {
      if (data) {
        setInjuryTypeDrp(threeColVictimInjuryArray(data, 'VictimInjuryID', 'Description', 'InjuryCode'))
      } else {
        setInjuryTypeDrp([])
      }
    })
  }

  useEffect(() => {
    if (injuryTypeEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['VictimInjuryID']: injuryTypeEditVal } }) }
  }, [injuryTypeEditVal])

  const InjuryType = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      VictimInjuryID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < injuryTypeEditVal?.length) {
      let missing = null;
      let i = injuryTypeEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(injuryTypeEditVal[--i])) ? missing : injuryTypeEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'nameEventInjuryID', 'InjuryVictim/Delete_VictimInjury')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'VictimInjuryID', 'InjuryVictim/Insert_VictimInjury')
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

        toastifySuccess(res.Message);

        col1 === 'VictimInjuryID' && get_InjuryType_Data();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (nameEventInjuryID, col1, url) => {
    const val = {
      [col1]: nameEventInjuryID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {

        toastifySuccess(res.Message);

        col1 === 'VictimInjuryID' && get_InjuryType_Data()
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
      <div className="col-12 " id='display-not-form'>
        <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
          <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0">Injury Type</p>
          </div>
        </div>
        <div className="row">
          <div className="col-2 col-md-2 col-lg-1 mt-3">
            <Link to={'/ListManagement?page=Injury%20Type&call=/Name-Home'} className='new-link'>
              Injury Type 
            </Link>
          </div>
          <div className="col-4 col-md-4 col-lg-4  mt-2" >
            <Select
              name='VictimInjuryID'
              isClearable
              options={injuryTypeDrp}
              closeMenuOnSelect={false}
              placeholder="Select.."
              ref={SelectedValue}
              components={{ MultiValue, }}
              onChange={(e) => InjuryType(e)}
              value={multiSelected.VictimInjuryID}
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

export default InjuryType